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

// PUT route to edit a post
router.put('/posts/:id', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    // Find the post by ID and update its content
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: req.user.userId },
      { content },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized to edit this post' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a post
router.delete('/posts/:id', auth.authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID and the author
    const deletedPost = await Post.findOneAndDelete({ _id: postId, author: req.user.userId });

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized to delete this post' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;