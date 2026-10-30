const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');
const User = require('../models/User');

// Get all mock tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find().select('-questions.correctOption -questions.explanation');
    const user = await User.findOne();
    const submissions = user ? await TestSubmission.find({ userId: user._id }) : [];

    const testsWithStatus = tests.map(test => {
      const sub = submissions.find(s => s.testId.toString() === test._id.toString());
      return {
        ...test.toObject(),
        isAttempted: !!sub,
        lastScore: sub ? sub.totalScore : null,
        percentile: sub ? sub.percentile : null,
        rank: sub ? sub.allIndiaRank : null
      };
    });

    res.json({ success: true, tests: testsWithStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start / Get Test details with questions (excluding explanations during exam)
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    const user = await User.findOne();
    const submission = user ? await TestSubmission.findOne({ userId: user._id, testId: test._id }) : null;

    // If test is not submitted yet, hide correct answer & explanation
    const safeQuestions = test.questions.map(q => ({
      questionId: q.questionId,
      subject: q.subject,
      section: q.section,
      text: q.text,
      options: q.options,
      marksPositive: q.marksPositive,
      marksNegative: q.marksNegative,
      ...(submission ? { correctOption: q.correctOption, explanation: q.explanation } : {})
    }));

    res.json({
      success: true,
      test: {
        ...test.toObject(),
        questions: safeQuestions
      },
      submission
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit CBT Mock Test
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers, timeSpentSeconds } = req.body; // answers: { questionId: { selectedOption, status } }
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const subjectBreakdown = {
      Physics: { score: 0, correct: 0, wrong: 0 },
      Chemistry: { score: 0, correct: 0, wrong: 0 },
      Mathematics: { score: 0, correct: 0, wrong: 0 },
      Biology: { score: 0, correct: 0, wrong: 0 }
    };

    const evaluatedAnswers = test.questions.map(q => {
      const userResponse = answers ? answers[q.questionId] : null;
      const selected = userResponse ? userResponse.selectedOption : -1;
      const status = userResponse ? userResponse.status : 'not_visited';
      const isAnswered = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = isAnswered && Number(selected) === q.correctOption;

      if (isAnswered) {
        if (isCorrect) {
          totalScore += q.marksPositive;
          correctCount++;
          if (subjectBreakdown[q.subject]) {
            subjectBreakdown[q.subject].score += q.marksPositive;
            subjectBreakdown[q.subject].correct++;
          }
        } else {
          totalScore -= q.marksNegative;
          wrongCount++;
          if (subjectBreakdown[q.subject]) {
            subjectBreakdown[q.subject].score -= q.marksNegative;
            subjectBreakdown[q.subject].wrong++;
          }
        }
      } else {
        unattemptedCount++;
      }

      return {
        questionId: q.questionId,
        selectedOption: selected,
        status: status,
        isCorrect
      };
    });

    const attemptedCount = correctCount + wrongCount;
    const accuracyPercentage = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Realistic NTA Percentile & Rank algorithm based on score
    const maxScore = test.totalMarks || 300;
    const scoreRatio = Math.max(0, totalScore) / maxScore;
    const percentile = Math.min(99.98, +(90 + scoreRatio * 9.9).toFixed(2));
    const allIndiaRank = Math.max(12, Math.round((1 - (percentile / 100)) * (test.totalAttempts || 40000)));

    const submission = await TestSubmission.findOneAndUpdate(
      { userId: user._id, testId: test._id },
      {
        $set: {
          answers: evaluatedAnswers,
          totalScore,
          maxMarks: maxScore,
          correctCount,
          wrongCount,
          unattemptedCount,
          accuracyPercentage,
          percentile,
          allIndiaRank,
          timeSpentSeconds: timeSpentSeconds || 0,
          subjectBreakdown,
          submittedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    user.testsAttempted += 1;
    user.coins += 100; // 100 PW coins for completing full mock test!
    await user.save();

    res.json({
      success: true,
      message: 'Exam submitted successfully! Scorecard generated with All-India Rank 🏆',
      submission,
      fullQuestions: test.questions // return with answers and detailed explanations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
