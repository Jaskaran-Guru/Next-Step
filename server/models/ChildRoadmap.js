const mongoose = require('mongoose');

const ChildRoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  childName: { type: String, default: 'Child' },
  childAge: { type: String, required: true },
  currentStage: { type: String, default: 'playway_1_4' },
  parentConcernOrQuery: { type: String, required: true },
  aiAnalysis: {
    summary: { type: String, required: true },
    immediateNextSteps: [{ type: String }],
    personalityAndHabits: [{ type: String }],
    academicRoadmap: [{ type: String }],
    unemploymentImmunityPlan: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChildRoadmap', ChildRoadmapSchema);
