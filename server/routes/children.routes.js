const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const User = require('../models/User');

// Default developmental milestones by age stage
function getStarterMilestones(lifeStage) {
  if (lifeStage === 'playway_1_4') {
    return [
      { category: 'Speech & Language', title: 'Speaks 50+ single words & 2-word sentences', achieved: true },
      { category: 'Fine Motor', title: 'Stacks a tower of 6+ blocks', achieved: true },
      { category: 'Gross Motor', title: 'Runs smoothly & kicks a ball forward', achieved: false },
      { category: 'Social & Emotional', title: 'Imitates peers and engages in parallel play', achieved: false },
      { category: 'Cognitive', title: 'Identifies 4 primary colors & 3 geometric shapes', achieved: false }
    ];
  }
  if (lifeStage === 'primary_5_10') {
    return [
      { category: 'Mathematics', title: 'Fluent in single/double-digit addition and multiplication tables (1-10)', achieved: true },
      { category: 'Reading & Literacy', title: 'Reads grade-appropriate books independently for 20 mins', achieved: true },
      { category: 'Scientific Curiosity', title: 'Understands states of matter and water cycle', achieved: false },
      { category: 'Digital Literacy', title: 'Comfortable with basic keyboarding and Scratch block coding', achieved: false }
    ];
  }
  return [
    { category: 'Academic Focus', title: 'Self-directed daily study routine of 2+ hours', achieved: true },
    { category: 'Critical Thinking', title: 'Participates in science/math Olympiads or debate', achieved: false },
    { category: 'Career Awareness', title: 'Identified top 3 areas of interest for Class 11 stream', achieved: false }
  ];
}

// 1. Get all children for parent
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let children = await Child.find({ parentId: user._id }).sort({ createdAt: -1 });

    // Seed default child for instant demo if none exist
    if (children.length === 0) {
      const defaultChild = await Child.create({
        parentId: user._id,
        name: 'Aarav',
        age: 3,
        lifeStage: 'playway_1_4',
        currentClass: 'Playway Toddler',
        interests: ['Drawing', 'Building Blocks', 'Animal Rhymes'],
        milestones: getStarterMilestones('playway_1_4')
      });
      children = [defaultChild];
    }

    return res.json({ success: true, count: children.length, children });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Add new child
router.post('/', async (req, res) => {
  try {
    const { name, age, lifeStage, currentClass, interests } = req.body;
    if (!name || !age) {
      return res.status(400).json({ success: false, message: 'Child name and age are required' });
    }

    const user = await User.findOne();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const targetStage = lifeStage || (age <= 4 ? 'playway_1_4' : (age <= 10 ? 'primary_5_10' : 'middle_11_14'));

    const child = await Child.create({
      parentId: user._id,
      name: name.trim(),
      age: Number(age),
      lifeStage: targetStage,
      currentClass: currentClass || 'General',
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(s => s.trim()) : []),
      milestones: getStarterMilestones(targetStage)
    });

    return res.status(201).json({ success: true, message: 'Child profile added successfully', child });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Update child profile or toggle milestone
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, lifeStage, currentClass, interests, milestoneIndex, milestoneAchieved } = req.body;

    const child = await Child.findById(id);
    if (!child) return res.status(404).json({ success: false, message: 'Child profile not found' });

    if (name) child.name = name.trim();
    if (age) child.age = Number(age);
    if (lifeStage) child.lifeStage = lifeStage;
    if (currentClass) child.currentClass = currentClass;
    if (interests) child.interests = Array.isArray(interests) ? interests : interests.split(',').map(s => s.trim());

    if (milestoneIndex !== undefined && child.milestones[milestoneIndex]) {
      child.milestones[milestoneIndex].achieved = milestoneAchieved !== undefined ? milestoneAchieved : !child.milestones[milestoneIndex].achieved;
      if (child.milestones[milestoneIndex].achieved) {
        child.milestones[milestoneIndex].achievedDate = new Date();
      }
    }

    await child.save();
    return res.json({ success: true, message: 'Child profile updated', child });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Delete child profile
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Child.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Child profile removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
