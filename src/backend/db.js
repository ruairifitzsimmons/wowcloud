//22&Ht%Lx4BDv
//22%26Ht%25Lx4BDv

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ruairi:22%26Ht%25Lx4BDv@atlascluster.nqapa88.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB Connected.')
})
.catch(() => {
    console.log('MongoDB Failed.')
})
const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});
const collection = mongoose.model('collection', newSchema)

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Post = mongoose.model('Post', postSchema);

//module.exports = { collection, Post };

//module.exports = collection

module.exports = {
  collection: collection, 
  Post: Post,
}