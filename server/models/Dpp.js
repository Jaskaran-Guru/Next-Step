const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // 0-indexed
  explanation: { type: String, required: true },
  difficulty: { type: String, default: 'Medium', enum: ['Easy', 'Medium', 'Hard'] }
});

const DppSchema = new mongoose.Schema({
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  subjectName: { type: String, default: 'Physics' },
  title: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  durationMinutes: { type: Number, default: 30 },
  marksPerQuestion: { type: Number, default: 4 },
  negativeMarks: { type: Number, default: 1 },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dpp', DppSchema);
