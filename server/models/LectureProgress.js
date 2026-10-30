const mongoose = require('mongoose');

const LectureProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  progressSeconds: { type: Number, default: 0 },
  totalSeconds: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  lastWatchedAt: { type: Date, default: Date.now }
});

LectureProgressSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model('LectureProgress', LectureProgressSchema);
