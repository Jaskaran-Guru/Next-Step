const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Lecture = require('../models/Lecture');
const User = require('../models/User');

// Get all batches with optional exam category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { examCategory: category } : {};
    const batches = await Batch.find(filter).sort({ enrolledCount: -1 });
    res.json({ success: true, count: batches.length, batches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single batch details with its subjects, chapters, and lectures
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const batch = isObjectId 
      ? await Batch.findById(idOrSlug)
      : await Batch.findOne({ slug: idOrSlug });

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const subjects = await Subject.find({ batchId: batch._id }).sort({ orderIndex: 1 });
    const chapters = await Chapter.find({ batchId: batch._id }).sort({ orderIndex: 1 });
    const lectures = await Lecture.find({ batchId: batch._id }).sort({ orderIndex: 1 });

    res.json({
      success: true,
      batch,
      subjects,
      chapters,
      lectures
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Enroll / Unenroll in a batch
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyEnrolled = user.enrolledBatches.some(bId => bId.toString() === id);

    if (alreadyEnrolled) {
      user.enrolledBatches = user.enrolledBatches.filter(bId => bId.toString() !== id);
      batch.enrolledCount = Math.max(0, batch.enrolledCount - 1);
    } else {
      user.enrolledBatches.push(batch._id);
      batch.enrolledCount += 1;
      user.coins += 50; // award 50 PW coins for joining!
    }

    await user.save();
    await batch.save();

    res.json({
      success: true,
      isEnrolled: !alreadyEnrolled,
      message: alreadyEnrolled ? 'Unenrolled from batch' : 'Successfully enrolled! +50 PW Coins awarded 🎉',
      enrolledBatches: user.enrolledBatches
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
