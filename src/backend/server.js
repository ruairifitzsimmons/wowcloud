const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const express = require('express');
const { collection, Post, Category } = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 9000;
const auth = require('./auth');

// CONTROLLERS
const dungeonsController = require('./controllers/dungeonController');
const realmsController = require('./controllers/realmsController');
const characterController = require('./controllers/characterController');
const characterMediaController = require('./controllers/characterMediaController');
const characterEquipmentController = require('./controllers/characterEquipmentController');
const characterEquipmentMediaController = require('./controllers/characterEquipmentMediaController');
const characterStatisticsController = require('./controllers/characterStatisticsController');
const forumController = require('./controllers/forumController');

app.use(cors());
app.use(express.json());

// ROUTES
app.get('/api/realms', realmsController.getRealms);
app.get('/api/character', characterController.getCharacter);
app.get('/api/character-media', characterMediaController.getCharacterMedia);
app.get('/api/character-equipment', characterEquipmentController.getCharacterEquipment);
app.get('/api/character-equipment-media', characterEquipmentMediaController.getCharacterEquipmentMedia);
app.get('/api/character-statistics', characterStatisticsController.getCharacterStatistics);
app.use('/forum', forumController);

app.get('/api/dungeons/:expansionId', async (req, res) => {
  const { expansionId } = req.params;
  try {
    const dungeons = await dungeonsController.fetchDungeonsByExpansion(expansionId);
    res.json(dungeons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/api/dungeons/:expansionId/:dungeonId', async (req, res) => {
  const { expansionId, dungeonId } = req.params;
  try {
    const dungeonData = await dungeonsController.fetchDungeonsByExpansion(expansionId);
    const dungeon = dungeonData.dungeons.find(dungeon => dungeon.id === parseInt(dungeonId));
    const dungeonMedia = await dungeonsController.getDungeonMedia(dungeonId);
    const dungeonDetails = await dungeonsController.getDungeonDetails(dungeonId);

    // Combine both media and details and send the response
    res.json({ dungeonMedia, dungeonDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/api/dungeons/:expansionId/:dungeonId/:encounterId', async (req, res) => {
  const { encounterId } = req.params;
  try {
    const encounterDetails = await dungeonsController.getEncounterDetails(encounterId);
    res.json(encounterDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get item information
app.get('/api/item/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const itemInfo = await dungeonsController.getItemInformation(itemId);
    res.json(itemInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get item media
app.get('/api/item-media/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const itemMedia = await dungeonsController.getItemMedia(itemId);
    res.json(itemMedia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordMatch = await auth.comparePasswords(password, user.password);
      if (isPasswordMatch) {
        const token = auth.generateToken(user);
        res.json({ token: token });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Profile
app.get('/profile', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await collection.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Profile
app.put('/profile', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const newUsername = req.body.username;
    const user = await collection.findByIdAndUpdate(userId, { username: newUsername }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (!emailRegex.test(email)) {
    res.json('invalidemail');
    return;
  }
  try {
    const check = await collection.findOne({ email: email });
    if (check) {
      res.json('exist');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await collection.insertMany([
        { email: email, password: hashedPassword, username: username }, // Include the username field
      ]);
      const token = auth.generateToken(newUser[0]);
      res.json({ token: token });
    }
  } catch (e) {
    res.status(500).json('error');
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get User Posts
app.get('/user-posts', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username'); // Populate the author field with the username
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new post
app.post('/forum/posts', auth.authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user.userId;
    const post = await Post.create({ title, content, author, category, giphyLink, comments: [] });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all categories
app.get('/forum/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new category
app.post('/forum/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all posts with category
app.get('/forum/posts', async (req, res) => {
  try {
    const categoryId = req.query.category;
    const posts = await Post.find(categoryId ? { category: categoryId } : {})
      .sort({ createdAt: 'desc' })
      .populate('author', 'username');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.put('/forum/posts/:id', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this post' });
    }
    // Update the post's content
    post.content = content;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a post
app.delete('/forum/posts/:id', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the authenticated user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Delete the post
    await post.remove();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all comments for a post
app.get('/forum/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new comment for a post
app.post('/forum/posts/:id/comments', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const author = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({ content, post: postId, author });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user by ID
app.get('/forum/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await collection.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a comment
app.delete('/forum/posts/:postId/comments/:commentId', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the comment by ID and the author
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      post: postId,
      author: req.user.userId,
    });

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized to delete this comment' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a post
app.post('/forum/posts/:id/like', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ liked: !isLiked, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlike a post
app.post('/forum/posts/:id/unlike', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (!isLiked) {
      // User hasn't liked the post, no need to unlike
      return res.json({ liked: false, count: post.likes.length });
    }

    // User already liked the post, remove their like
    post.likes.pull(userId);
    await post.save();

    // Return the updated like status and count
    res.json({ liked: false, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get like count for a post
app.get('/forum/posts/:id/like-count', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the current like count
    res.json({ count: post.likes.length });
    console.log(postId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a post
app.post('/forum/posts/:id/like', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ liked: !isLiked, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlike a post
app.post('/forum/posts/:id/unlike', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const isLiked = post.likes.includes(userId);

    if (!isLiked) {
      // User hasn't liked the post, no need to unlike
      return res.json({ liked: false, count: post.likes.length });
    }

    // User already liked the post, remove their like
    post.likes.pull(userId);
    await post.save();

    // Return the updated like status and count
    res.json({ liked: false, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get like count for a post
app.get('/forum/posts/:id/like-count', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the current like count
    res.json({ count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get liked posts by the authenticated user
app.get('/forum/posts/liked', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const posts = await Post.find({ likes: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a comment
app.post('/forum/posts/:postId/comments/:commentId/like', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({ liked: !isLiked, count: comment.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlike a comment
app.post('/forum/posts/:postId/comments/:commentId/unlike', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isLiked = comment.likes.includes(userId);
    if (!isLiked) {
      return res.json({ liked: false, count: comment.likes.length });
    }

    comment.likes.pull(userId);
    await comment.save();

    res.json({ liked: false, count: comment.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});