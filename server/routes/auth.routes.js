const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get active student profile
router.get('/me', async (req, res) => {
  try {
    let user = await User.findOne().populate('enrolledBatches');
    if (!user) {
      user = await User.create({
        name: 'Jaskaran Singh',
        email: 'jaskaran@pw.in',
        phone: '+91 98765 43210'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update profile / target exam
router.put('/me', async (req, res) => {
  try {
    const { name, targetExam, currentClass } = req.body;
    const user = await User.findOneAndUpdate(
      {},
      { $set: { ...(name && { name }), ...(targetExam && { targetExam }), ...(currentClass && { currentClass }) } },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
