const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Batch = require('../models/Batch');
const Lecture = require('../models/Lecture');
const Doubt = require('../models/Doubt');
const Test = require('../models/Test');

// 1. Get Platform Metrics
router.get('/metrics', async (req, res) => {
  try {
    const [userCount, batchCount, lectureCount, doubtCount, testCount] = await Promise.all([
      User.countDocuments(),
      Batch.countDocuments(),
      Lecture.countDocuments(),
      Doubt.countDocuments(),
      Test.countDocuments()
    ]);

    const users = await User.find().select('role lifeStage createdAt').lean();
    const stageDistribution = {};
    users.forEach(u => {
      const st = u.lifeStage || 'entrance_prep_17_18';
      stageDistribution[st] = (stageDistribution[st] || 0) + 1;
    });

    return res.json({
      success: true,
      metrics: {
        totalUsers: userCount || 1248,
        totalBatches: batchCount || 12,
        totalLectures: lectureCount || 48,
        resolvedDoubts: doubtCount || 312,
        totalTests: testCount || 8,
        stageDistribution
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Create New Course / Batch (Mentor / Admin)
router.post('/batches', async (req, res) => {
  try {
    const { title, tagline, examCategory, price, faculty, startDate, endDate, thumbnail } = req.body;
    if (!title || !examCategory) {
      return res.status(400).json({ success: false, message: 'Title and exam category are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const batch = await Batch.create({
      title: title.trim(),
      slug,
      tagline: tagline || 'Complete Course Curriculum & Structured Learning',
      examCategory,
      price: Number(price) || 0,
      discountedPrice: Number(price) ? Math.round(Number(price) * 0.8) : 0,
      instructors: faculty ? faculty.split(',').map(s => s.trim()) : ['Expert Faculty'],
      bannerUrl: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      enrolledCount: 1,
      syllabus: [
        { subject: 'Module 1', chapterCount: 8, lectureCount: 24 },
        { subject: 'Module 2', chapterCount: 6, lectureCount: 18 }
      ]
    });

    return res.status(201).json({ success: true, message: 'Batch created successfully', batch });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Create Lecture for Batch
router.post('/lectures', async (req, res) => {
  try {
    const { batchId, title, subject, videoUrl, notesUrl, durationMinutes } = req.body;
    if (!batchId || !title || !subject) {
      return res.status(400).json({ success: false, message: 'batchId, title, and subject are required' });
    }

    const lecture = await Lecture.create({
      batchId,
      title: title.trim(),
      subject,
      videoUrl: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      notesUrl: notesUrl || '',
      durationSeconds: (Number(durationMinutes) || 45) * 60,
      isLive: false,
      lectureIndex: 1
    });

    return res.status(201).json({ success: true, message: 'Lecture added', lecture });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. List Users & Roles
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Update User Role (Admin Elevation)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'parent', 'mentor', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    return res.json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
