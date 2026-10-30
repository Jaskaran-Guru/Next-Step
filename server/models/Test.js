const mongoose = require('mongoose');

const TestQuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  subject: { type: String, required: true }, // "Physics", "Chemistry", "Mathematics", "Biology"
  section: { type: String, default: 'Section A' },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  explanation: { type: String, required: true },
  marksPositive: { type: Number, default: 4 },
  marksNegative: { type: Number, default: 1 }
});

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  examType: { type: String, default: 'JEE Mains & Advanced', enum: ['JEE Mains & Advanced', 'NEET UG', 'Class 10 Foundation', 'GATE CS', 'UPSC'] },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  durationMinutes: { type: Number, default: 180 },
  totalQuestions: { type: Number, default: 75 },
  totalMarks: { type: Number, default: 300 },
  instructions: [{ type: String }],
  questions: [TestQuestionSchema],
  totalAttempts: { type: Number, default: 24500 },
  isLive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);
