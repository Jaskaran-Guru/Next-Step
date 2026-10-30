const mongoose = require('mongoose');

const TestSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    questionId: { type: Number, required: true },
    selectedOption: { type: Number, default: -1 },
    status: { type: String, default: 'not_visited', enum: ['answered', 'marked_review', 'not_answered', 'not_visited'] },
    isCorrect: { type: Boolean, default: false }
  }],
  totalScore: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  correctCount: { type: Number, default: 0 },
  wrongCount: { type: Number, default: 0 },
  unattemptedCount: { type: Number, default: 0 },
  accuracyPercentage: { type: Number, default: 0 },
  percentile: { type: Number, default: 98.4 },
  allIndiaRank: { type: Number, default: 412 },
  timeSpentSeconds: { type: Number, default: 0 },
  subjectBreakdown: {
    Physics: { score: Number, correct: Number, wrong: Number },
    Chemistry: { score: Number, correct: Number, wrong: Number },
    Mathematics: { score: Number, correct: Number, wrong: Number },
    Biology: { score: Number, correct: Number, wrong: Number }
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestSubmission', TestSubmissionSchema);
