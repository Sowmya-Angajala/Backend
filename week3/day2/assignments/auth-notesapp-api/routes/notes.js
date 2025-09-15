const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require auth
router.use(auth);

// POST /api/notes  -> create note
router.post('/notes', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const note = await Note.create({ title, content: content || '', createdBy: mongoose.Types.ObjectId(req.user.id) });
    res.status(201).json({ message: 'Note created', note });
  } catch (err) {
    next(err);
  }
});

// GET /api/notes -> fetch user notes
router.get('/notes', async (req, res, next) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notes/:id -> update note if owner
router.put('/notes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid note id' });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { title, content } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    res.json({ message: 'Note updated', note });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id -> delete note if owner
router.delete('/notes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid note id' });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    if (note.createdBy.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await note.deleteOne();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
