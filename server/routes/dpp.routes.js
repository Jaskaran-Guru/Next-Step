const express = require('express');
const router = express.Router();
const Dpp = require('../models/Dpp');
const DppSubmission = require('../models/DppSubmission');
const User = require('../models/User');

// Get DPP for a specific lecture or by ID
router.get('/lecture/:lectureId', async (req, res) => {
  try {
    const dpp = await Dpp.findOne({ lectureId: req.params.lectureId });
    if (!dpp) {
      return res.status(404).json({ success: false, message: 'No DPP found for this lecture' });
    }

    const user = await User.findOne();
    const submission = user ? await DppSubmission.findOne({ userId: user._id, dppId: dpp._id }) : null;

    res.json({ success: true, dpp, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit DPP
router.post('/:dppId/submit', async (req, res) => {
  try {
    const { answers, timeTakenSeconds } = req.body; // answers: { questionId: selectedOptionIndex }
    const dpp = await Dpp.findById(req.params.dppId);
    if (!dpp) return res.status(404).json({ success: false, message: 'DPP not found' });

    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers = dpp.questions.map(q => {
      const selected = answers[q.questionId];
      const isAnswered = selected !== undefined && selected !== null && selected !== -1;
      const isCorrect = isAnswered && Number(selected) === q.correctOption;

      if (isAnswered) {
        if (isCorrect) {
          score += dpp.marksPerQuestion;
          correctCount++;
        } else {
          score -= dpp.negativeMarks;
          wrongCount++;
        }
      } else {
        unansweredCount++;
      }

      return {
        questionId: q.questionId,
        selectedOption: isAnswered ? Number(selected) : -1,
        isCorrect
      };
    });

    const maxScore = dpp.totalQuestions * dpp.marksPerQuestion;
    const accuracyPercentage = (correctCount + wrongCount) > 0 
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
      : 0;

    const submission = await DppSubmission.findOneAndUpdate(
      { userId: user._id, dppId: dpp._id },
      {
        $set: {
          answers: evaluatedAnswers,
          score,
          maxScore,
          correctCount,
          wrongCount,
          unansweredCount,
          accuracyPercentage,
          timeTakenSeconds: timeTakenSeconds || 0,
          submittedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    user.dppsCompleted += 1;
    user.coins += 25; // 25 coins for completing a DPP!
    await user.save();

    res.json({
      success: true,
      message: 'DPP submitted successfully! +25 PW Coins earned 🎯',
      submission,
      questions: dpp.questions // return full questions with explanations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
