const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// Get all study materials / Khazana items
router.get('/', async (req, res) => {
  try {
    const { subject, category } = req.query;
    const filter = {};
    if (subject && subject !== 'All') filter.subjectName = subject;
    if (category && category !== 'All') filter.category = category;

    const materials = await Material.find(filter).sort({ downloadsCount: -1 });
    res.json({ success: true, count: materials.length, materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Download / Increment view count
router.post('/:id/download', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
    res.json({ success: true, downloadsCount: material ? material.downloadsCount : 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
