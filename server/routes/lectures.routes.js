const express = require('express');
const router = express.Router();
const Lecture = require('../models/Lecture');
const LectureProgress = require('../models/LectureProgress');
const Note = require('../models/Note');
const User = require('../models/User');

// Get lecture details with student progress and notes
router.get('/:id', async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id)
      .populate('chapterId')
      .populate('subjectId')
      .populate('batchId');

    if (!lecture) {
      return res.status(404).json({ success: false, message: 'Lecture not found' });
    }

    const user = await User.findOne();
    const progress = user ? await LectureProgress.findOne({ userId: user._id, lectureId: lecture._id }) : null;
    const notes = user ? await Note.find({ userId: user._id, lectureId: lecture._id }).sort({ timestampSeconds: 1 }) : [];

    res.json({
      success: true,
      lecture,
      progress,
      notes
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update watch progress
router.post('/:id/progress', async (req, res) => {
  try {
    const { progressSeconds, totalSeconds } = req.body;
    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) return res.status(404).json({ success: false, message: 'Lecture not found' });

    const percentage = totalSeconds > 0 ? Math.min(100, Math.round((progressSeconds / totalSeconds) * 100)) : 0;
    const isCompleted = percentage >= 90;

    const record = await LectureProgress.findOneAndUpdate(
      { userId: user._id, lectureId: lecture._id },
      {
        $set: {
          batchId: lecture.batchId,
          progressSeconds,
          totalSeconds,
          percentage,
          isCompleted,
          lastWatchedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    // Update user study minutes
    if (progressSeconds > 60) {
      user.studyMinutesTotal += Math.round(progressSeconds / 60);
      await user.save();
    }

    res.json({ success: true, progress: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add timestamped note
router.post('/:id/notes', async (req, res) => {
  try {
    const { timestampSeconds, timestampFormatted, noteText } = req.body;
    if (!noteText || noteText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }

    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const note = await Note.create({
      userId: user._id,
      lectureId: req.params.id,
      timestampSeconds: Number(timestampSeconds) || 0,
      timestampFormatted: timestampFormatted || '00:00',
      noteText: noteText.trim()
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete note
router.delete('/notes/:noteId', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
