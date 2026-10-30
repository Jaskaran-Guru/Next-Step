const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LectureProgress = require('../models/LectureProgress');
const DppSubmission = require('../models/DppSubmission');
const TestSubmission = require('../models/TestSubmission');

// Get student overall performance analytics
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findOne().populate('enrolledBatches');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [progressList, dppSubs, testSubs] = await Promise.all([
      LectureProgress.find({ userId: user._id }).populate('lectureId'),
      DppSubmission.find({ userId: user._id }),
      TestSubmission.find({ userId: user._id }).populate('testId')
    ]);

    const totalLecturesWatched = progressList.filter(p => p.isCompleted).length;
    const avgTestAccuracy = testSubs.length > 0 
      ? Math.round(testSubs.reduce((acc, curr) => acc + (curr.accuracyPercentage || 0), 0) / testSubs.length)
      : 84;

    const avgDppAccuracy = dppSubs.length > 0
      ? Math.round(dppSubs.reduce((acc, curr) => acc + (curr.accuracyPercentage || 0), 0) / dppSubs.length)
      : 78;

    const projectedRank = testSubs.length > 0
      ? Math.min(...testSubs.map(t => t.allIndiaRank || 412))
      : 412;

    res.json({
      success: true,
      user,
      stats: {
        studyHours: +(user.studyMinutesTotal / 60).toFixed(1),
        streakDays: user.streakDays,
        coins: user.coins,
        enrolledBatchesCount: user.enrolledBatches.length,
        totalLecturesWatched,
        testsAttempted: testSubs.length || user.testsAttempted,
        avgTestAccuracy,
        dppsCompleted: dppSubs.length || user.dppsCompleted,
        avgDppAccuracy,
        projectedRank
      },
      recentTests: testSubs.slice(0, 5),
      recentProgress: progressList.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
