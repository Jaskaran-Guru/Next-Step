const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technology & AI', 'Medical & Healthcare', 'Engineering', 'Commerce & Finance', 'Law & Governance', 'Design & Creative', 'Civil Services'],
    required: true
  },
  tagline: String,
  overview: String,
  requiredDegrees: [String],
  entranceExams: [String],
  recommendedStreams: [String], // e.g. 'Science (PCM)', 'Commerce'
  coreSkills: [String],
  growthOutlook: String, // e.g., 'High Demand (+22% YoY)'
  approxSalaryRange: {
    fresher: String,
    experienced: String
  },
  dayInTheLife: [String],
  alternativePathways: [String],
  topHiringDomains: [String]
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
