const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Integrated'],
    default: 'Undergraduate'
  },
  durationYears: Number,
  category: String,
  eligibility: String,
  entranceExams: [String],
  semesterOverview: [{
    semester: Number,
    coreSubjects: [String]
  }],
  careerOutcomes: [String],
  averageFees: String,
  practicalFocusScore: Number, // out of 100
  pros: [String],
  cons: [String]
}, { timestamps: true });

module.exports = mongoose.model('Degree', degreeSchema);

