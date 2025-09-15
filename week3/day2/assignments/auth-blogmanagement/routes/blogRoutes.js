const express = require('express');
const Blog = require('../models/blogModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Blog
router.post('/blogs', authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blog = new Blog({ title, content, tags, createdBy: req.user._id });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Blogs for Logged-in User
router.get('/blogs', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.user._id });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Blog
router.put('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Blog
router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });
    res.json({ msg: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics Route
router.get('/blogs/stats', authMiddleware, async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $facet: {
          totalBlogs: [{ $count: 'count' }],
          blogsPerUser: [
            { $group: { _id: '$createdBy', count: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 0, user: '$user.name', count: 1 } }
          ],
          commonTags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
