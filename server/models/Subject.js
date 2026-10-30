const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  name: { type: String, required: true }, // e.g. "Physics", "Chemistry", "Mathematics", "Biology"
  code: { type: String, required: true }, // "PHY", "CHE", "MAT", "BIO"
  icon: { type: String, default: 'atom' },
  color: { type: String, default: '#3b82f6' },
  totalLectures: { type: Number, default: 45 },
  totalDpps: { type: Number, default: 35 },
  orderIndex: { type: Number, default: 1 }
});

module.exports = mongoose.model('Subject', SubjectSchema);
