const mongoose = require('mongoose');

const LifeStageSchema = new mongoose.Schema({
  stageKey: { 
    type: String, 
    required: true, 
    unique: true, 
    enum: ['playway_1_4', 'primary_5_10', 'middle_11_14', 'stream_selection_15_16', 'entrance_prep_17_18', 'degree_college_19_23', 'career_launch'] 
  },
  ageGroup: { type: String, required: true }, // e.g. "1 - 4 Years", "15 - 16 Years (Class 9-10)"
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  badge: { type: String, default: 'LIFECYCLE STAGE' },
  icon: { type: String, default: 'baby' },
  color: { type: String, default: '#2563EB' },
  overview: { type: String, required: true },
  parentConcerns: [{ type: String }], // e.g. "Speech delay, screen addiction, school readiness"
  subjectsAndActivities: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'book' },
    skillsDeveloped: [{ type: String }]
  }],
  personalityDevelopment: [{
    trait: { type: String, required: true },
    guideline: { type: String, required: true },
    actionableHabit: { type: String, required: true }
  }],
  futureCareerPathways: [{
    pathwayName: { type: String, required: true },
    suitableFor: { type: String, required: true },
    roiOutlook: { type: String, default: 'High Demand (Zero Unemployment Target)' },
    degreesRecommended: [{ type: String }],
    inDemandSkills: [{ type: String }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LifeStage', LifeStageSchema);
