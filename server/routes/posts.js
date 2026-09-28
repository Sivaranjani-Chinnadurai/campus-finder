const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts (with optional type filter)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.type && req.query.type !== 'all') {
      filters.type = req.query.type;
    }
    const posts = await Post.find(filters).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    category: req.body.category,
    location: req.body.location,
    date: req.body.date,
    contact: req.body.contact
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a post (e.g. mark as resolved)
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
