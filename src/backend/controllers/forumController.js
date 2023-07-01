const express = require('express');
const router = express.Router();
const auth = require('../auth');
const { Post } = require('../db');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: 'desc' }).populate('author', 'username');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new post
router.post('/posts', auth.authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user.userId;
    const post = await Post.create({ title, content, author, category });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
