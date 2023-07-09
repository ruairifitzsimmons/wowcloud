const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ruairi:22%26Ht%25Lx4BDv@atlascluster.nqapa88.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('MongoDB Connected.');
    createInitialCategories(); // Call the function to create initial categories
  })
  .catch(() => {
    console.log('MongoDB Failed.');
  });

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  }
});
const collection = mongoose.model('collection', newSchema);

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});
const Category = mongoose.model('Category', categorySchema);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collection',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});
const Post = mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collection',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = mongoose.model('Comment', commentSchema);

// Function to create initial categories
const createInitialCategories = async () => {
  try {
    const initialCategories = ['General', 'Gameplay', 'News', 'Lore'];

    for (const categoryName of initialCategories) {
      const categoryExists = await Category.exists({ name: categoryName });
      if (!categoryExists) {
        await Category.create({ name: categoryName });
        console.log(`Category '${categoryName}' created.`);
      }
    }
  } catch (error) {
    console.error('Error creating initial categories:', error);
  }
};

module.exports = {
  collection: collection,
  Post: Post,
  Category: Category,
  Comment: Comment,
};
