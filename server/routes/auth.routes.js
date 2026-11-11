const express = require('express');
const router = express.Router();
const User = require('../models/User');

const mongoose = require('mongoose');

// Get active student profile
router.get(['/me', '/profile'], async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne().populate('enrolledBatches');
      if (!user) {
        user = await User.create({
          name: 'Jaskaran Singh',
          email: 'jaskaran@pw.in',
          phone: '+91 98765 43210'
        });
      }
      return res.json({ success: true, user });
    }
    return res.json({
      success: true,
      user: {
        name: 'Jaskaran Singh',
        email: 'jaskaran@pw.in',
        phone: '+91 98765 43210',
        targetExam: 'JEE Mains & Advanced',
        currentClass: 'Class 12th',
        lifeStage: 'entrance_prep_17_18',
        coins: 250,
        streakDays: 14,
        studyMinutesTotal: 1840,
        enrolledBatches: []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update profile / target exam / life stage (whole app experience)
router.put('/me', async (req, res) => {
  try {
    const { name, targetExam, currentClass, lifeStage, childAge } = req.body;
    const update = {};
    if (name) update.name = name;
    if (targetExam) update.targetExam = targetExam;
    if (currentClass) update.currentClass = currentClass;
    if (lifeStage) update.lifeStage = lifeStage;
    if (childAge !== undefined) update.childAge = childAge;
    const user = await User.findOneAndUpdate({}, { $set: update }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
