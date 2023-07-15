const express = require('express');
const router = express.Router();
const auth = require('../auth');
const { Post, User, Comment } = require('../db');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .populate('author', 'username');
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

// Get all comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new comment for a post
router.post('/posts/:id/comments', auth.authenticateToken, async (req, res) => {
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

// Update a comment
router.put('/posts/:postId/comments/:commentId', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    // Find the comment by ID and the author
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, post: postId, author: req.user.userId },
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or unauthorized to edit this comment' });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a comment
router.delete('/posts/:postId/comments/:commentId', auth.authenticateToken, async (req, res) => {
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
router.post('/posts/:id/like', auth.authenticateToken, async (req, res) => {
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

    if (isLiked) {
      // User already liked the post, remove their like
      post.likes.pull(userId);
    } else {
      // User hasn't liked the post, add their like
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    // Return the updated like status and count
    res.json({ liked: !isLiked, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unlike a post
router.post('/posts/:id/unlike', auth.authenticateToken, async (req, res) => {
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

// Get like status and count for a post
router.get('/posts/:id/like-count', auth.authenticateToken, async (req, res) => {
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

    // Return the like status and count
    res.json({ liked: isLiked, count: post.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like a comment
router.post('/posts/:postId/comments/:commentId/like', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    // Find the comment by ID and the post it belongs to
    const comment = await Comment.findOne({ _id: commentId, post: postId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user has already liked the comment
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      return res.status(400).json({ message: 'Comment already liked by the user' });
    }

    // Add the user's like to the comment
    comment.likes.push(userId);
    await comment.save();

    // Return the updated comment with the like count
    res.json({ ...comment.toObject(), count: comment.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Unlike a comment
router.post('/posts/:postId/comments/:commentId/unlike', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.userId;

    // Find the comment by ID and the post it belongs to
    const comment = await Comment.findOne({ _id: commentId, post: postId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user has already liked the comment
    const isLiked = comment.likes.includes(userId);

    if (!isLiked) {
      return res.status(400).json({ message: 'Comment not liked by the user' });
    }

    // Remove the user's like from the comment
    comment.likes = comment.likes.filter((like) => like.toString() !== userId);
    await comment.save();

    // Return the updated comment with the like count
    res.json({ ...comment.toObject(), count: comment.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get like count for a comment
router.get('/posts/:postId/comments/:commentId/like-count', auth.authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the comment by ID and the post it belongs to
    const comment = await Comment.findOne({ _id: commentId, post: postId });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Return the like count
    res.json({ count: comment.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;