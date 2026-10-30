const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  title: { type: String, required: true },
  lectureNumber: { type: Number, required: true },
  facultyName: { type: String, default: 'Alakh Pandey Sir' },
  durationMinutes: { type: Number, default: 95 },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600' },
  description: { type: String, default: 'In-depth derivation, concept visualization and PYQ analysis.' },
  hasDpp: { type: Boolean, default: true },
  hasNotes: { type: Boolean, default: true },
  pdfUrl: { type: String, default: '#' },
  viewsCount: { type: Number, default: 18500 },
  date: { type: String, default: 'Today' },
  orderIndex: { type: Number, default: 1 }
});

module.exports = mongoose.model('Lecture', LectureSchema);
