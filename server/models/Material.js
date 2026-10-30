const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subjectName: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Formula Sheet', 'Class Notes PDF', 'Mind Map', 'NCERT Solutions', 'PYQ Booklet'] 
  },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  chapterName: { type: String, default: 'General' },
  pagesCount: { type: Number, default: 12 },
  fileSizeMb: { type: String, default: '4.2 MB' },
  downloadUrl: { type: String, default: '#' },
  downloadsCount: { type: Number, default: 14200 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);
