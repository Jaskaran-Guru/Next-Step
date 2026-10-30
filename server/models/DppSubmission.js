const mongoose = require('mongoose');

const DppSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dppId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dpp', required: true },
  answers: [{
    questionId: { type: Number, required: true },
    selectedOption: { type: Number, default: -1 },
    isCorrect: { type: Boolean, default: false }
  }],
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  unansweredCount: { type: Number, default: 0 },
  accuracyPercentage: { type: Number, default: 0 },
  timeTakenSeconds: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DppSubmission', DppSubmissionSchema);
