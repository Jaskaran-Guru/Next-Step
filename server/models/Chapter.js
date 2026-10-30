const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  title: { type: String, required: true },
  chapterNumber: { type: Number, required: true },
  description: { type: String, default: 'Complete theory, NCERT coverage, and Advanced problem solving' },
  lectureCount: { type: Number, default: 6 },
  orderIndex: { type: Number, default: 1 }
});

module.exports = mongoose.model('Chapter', ChapterSchema);
