const express = require('express');
const router = express.Router();

// In-memory bookmarks store
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
router.get('/', (req, res) => {
  const { type } = req.query;
  let result = [...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (type) result = result.filter(b => b.type === type);
  res.json({ success: true, bookmarks: result, total: result.length });
});

// POST /api/bookmarks — add bookmark
router.post('/', (req, res) => {
  const { type, refId, title, subtitle, icon, url } = req.body;
  if (!type || !refId || !title) {
    return res.status(400).json({ success: false, message: 'type, refId and title are required' });
  }
  // Prevent duplicate
  const exists = bookmarks.find(b => b.type === type && b.refId === refId);
  if (exists) return res.status(409).json({ success: false, message: 'Already bookmarked', bookmark: exists });

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
  bookmarks.unshift(bookmark);
  res.status(201).json({ success: true, bookmark });
});

// DELETE /api/bookmarks/:id
router.delete('/:id', (req, res) => {
  const idx = bookmarks.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Bookmark not found' });
  bookmarks.splice(idx, 1);
  res.json({ success: true, message: 'Bookmark removed' });
});

// DELETE /api/bookmarks/ref/:type/:refId — remove by reference
router.delete('/ref/:type/:refId', (req, res) => {
  const { type, refId } = req.params;
  const idx = bookmarks.findIndex(b => b.type === type && b.refId === refId);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Bookmark not found' });
  bookmarks.splice(idx, 1);
  res.json({ success: true, message: 'Bookmark removed' });
});

// GET /api/bookmarks/check/:type/:refId — check if bookmarked
router.get('/check/:type/:refId', (req, res) => {
  const { type, refId } = req.params;
  const bookmark = bookmarks.find(b => b.type === type && b.refId === refId);
  res.json({ success: true, isBookmarked: !!bookmark, bookmark: bookmark || null });
});

module.exports = router;

