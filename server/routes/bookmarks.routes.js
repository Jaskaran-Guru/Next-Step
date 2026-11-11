const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// In-memory bookmarks store (fallback & demo)
let bookmarks = [
  {
    id: 'bk1',
    type: 'lecture',
    refId: 'lec_sample_1',
    title: 'Laws of Motion – Newton\'s Three Laws',
    subtitle: 'Physics · Class 11',
    icon: '🎬',
    url: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'bk2',
    type: 'career',
    refId: 'software_engineer',
    title: 'Software Engineer',
    subtitle: 'Career Profile',
    icon: '💻',
    url: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET /api/bookmarks
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne();
      if (user && user.bookmarks && user.bookmarks.length > 0) {
        let result = [...user.bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (type) result = result.filter(b => b.type === type);
        return res.json({ success: true, bookmarks: result, total: result.length, source: 'mongodb' });
      }
    }
  } catch (_) {}

  let result = [...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (type) result = result.filter(b => b.type === type);
  res.json({ success: true, bookmarks: result, total: result.length, source: 'memory' });
});

// POST /api/bookmarks — add bookmark
router.post('/', async (req, res) => {
  const { type, refId, title, subtitle, icon, url } = req.body;
  if (!type || !refId || !title) {
    return res.status(400).json({ success: false, message: 'type, refId and title are required' });
  }

  const bookmark = {
    id: 'bk' + Date.now(),
    type,
    refId,
    title,
    subtitle: subtitle || '',
    icon: icon || '🔖',
    url: url || null,
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne();
      if (user) {
        if (!user.bookmarks) user.bookmarks = [];
        const exists = user.bookmarks.find(b => b.type === type && b.refId === refId);
        if (exists) return res.status(409).json({ success: false, message: 'Already bookmarked', bookmark: exists });
        user.bookmarks.unshift(bookmark);
        await user.save();
        return res.status(201).json({ success: true, bookmark, source: 'mongodb' });
      }
    }
  } catch (_) {}

  // Prevent duplicate in memory
  const exists = bookmarks.find(b => b.type === type && b.refId === refId);
  if (exists) return res.status(409).json({ success: false, message: 'Already bookmarked', bookmark: exists });

  bookmarks.unshift(bookmark);
  res.status(201).json({ success: true, bookmark, source: 'memory' });
});

// DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne();
      if (user && user.bookmarks) {
        user.bookmarks = user.bookmarks.filter(b => b.id !== req.params.id);
        await user.save();
        return res.json({ success: true, message: 'Bookmark removed', source: 'mongodb' });
      }
    }
  } catch (_) {}

  const idx = bookmarks.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Bookmark not found' });
  bookmarks.splice(idx, 1);
  res.json({ success: true, message: 'Bookmark removed', source: 'memory' });
});

// DELETE /api/bookmarks/ref/:type/:refId — remove by reference
router.delete('/ref/:type/:refId', async (req, res) => {
  const { type, refId } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne();
      if (user && user.bookmarks) {
        user.bookmarks = user.bookmarks.filter(b => !(b.type === type && b.refId === refId));
        await user.save();
        return res.json({ success: true, message: 'Bookmark removed', source: 'mongodb' });
      }
    }
  } catch (_) {}

  const idx = bookmarks.findIndex(b => b.type === type && b.refId === refId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Bookmark not found' });
  bookmarks.splice(idx, 1);
  res.json({ success: true, message: 'Bookmark removed', source: 'memory' });
});

// GET /api/bookmarks/check/:type/:refId — check if bookmarked
router.get('/check/:type/:refId', (req, res) => {
  const { type, refId } = req.params;
  const bookmark = bookmarks.find(b => b.type === type && b.refId === refId);
  res.json({ success: true, isBookmarked: !!bookmark, bookmark: bookmark || null });
});

module.exports = router;

