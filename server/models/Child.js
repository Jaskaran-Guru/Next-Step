const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 25
  },
  lifeStage: {
    type: String,
    enum: [
      'playway_1_4',
      'primary_5_10',
      'middle_11_14',
      'stream_selection_15_16',
      'entrance_prep_17_18',
      'degree_college_19_23',
      'career_launch'
    ],
    default: 'playway_1_4'
  },
  currentClass: {
    type: String,
    default: 'Playway'
  },
  interests: [{
    type: String
  }],
  milestones: [{
    category: String, // e.g., 'Motor Skills', 'Speech', 'Cognitive', 'Social'
    title: String,
    achieved: { type: Boolean, default: false },
    achievedDate: Date,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Child', childSchema);
