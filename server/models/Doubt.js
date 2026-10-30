const mongoose = require('mongoose');

const DoubtSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, default: 'Physics', enum: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'] },
  questionText: { type: String, required: true, trim: true },
  solutionText: { type: String, required: true },
  stepBreakdown: [{
    stepNumber: Number,
    heading: String,
    content: String
  }],
  conceptFormula: { type: String },
  relatedLectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
  status: { type: String, default: 'resolved', enum: ['pending', 'resolved'] },
  helpfulVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doubt', DoubtSchema);
