const express = require('express');
const router = express.Router();

// Badge definitions
const BADGE_DEFINITIONS = [
  // Learning badges
  { id: 'first_doubt', category: 'learning', icon: '🤔', name: 'Curious Mind', description: 'Submitted your first doubt to AI Saarthi', xp: 10 },
  { id: 'five_doubts', category: 'learning', icon: '💡', name: 'Knowledge Seeker', description: 'Submitted 5 doubts — keep asking!', xp: 25 },
  { id: 'first_lecture', category: 'learning', icon: '🎬', name: 'First Watch', description: 'Watched your first lecture', xp: 10 },
  { id: 'ten_lectures', category: 'learning', icon: '📺', name: 'Binge Learner', description: 'Watched 10 lectures', xp: 50 },
  { id: 'first_note', category: 'learning', icon: '📝', name: 'Note Taker', description: 'Downloaded your first study note', xp: 10 },
  // Test badges
  { id: 'first_test', category: 'tests', icon: '📋', name: 'Test Taker', description: 'Completed your first mock test', xp: 20 },
  { id: 'test_topper', category: 'tests', icon: '🏆', name: 'Test Topper', description: 'Scored above 90% in a mock test', xp: 100 },
  { id: 'five_tests', category: 'tests', icon: '🎯', name: 'Exam Warrior', description: 'Completed 5 mock tests', xp: 75 },
  { id: 'perfect_score', category: 'tests', icon: '💯', name: 'Perfect Score', description: 'Scored 100% in a mock test!', xp: 200 },
  // Streak badges
  { id: 'streak_3', category: 'streak', icon: '🔥', name: '3-Day Streak', description: 'Studied for 3 consecutive days', xp: 30 },
  { id: 'streak_7', category: 'streak', icon: '⚡', name: 'Week Warrior', description: 'Studied for 7 consecutive days', xp: 70 },
  { id: 'streak_30', category: 'streak', icon: '🌟', name: 'Monthly Champion', description: 'Studied for 30 consecutive days', xp: 300 },
  // DPP badges
  { id: 'first_dpp', category: 'dpp', icon: '✏️', name: 'Practice Starter', description: 'Submitted your first DPP', xp: 15 },
  { id: 'ten_dpp', category: 'dpp', icon: '📚', name: 'Practice Pro', description: 'Submitted 10 DPPs', xp: 60 },
  // Career badges
  { id: 'career_explorer', category: 'career', icon: '🧭', name: 'Career Explorer', description: 'Explored 3 career profiles', xp: 20 },
  { id: 'roadmap_created', category: 'career', icon: '🗺️', name: 'Roadmap Builder', description: 'Generated your first learning roadmap', xp: 30 },
  { id: 'resume_builder', category: 'career', icon: '📄', name: 'Resume Ready', description: 'Built your first resume with NextStep OS', xp: 40 },
  { id: 'mock_interview', category: 'career', icon: '🎤', name: 'Interview Prepper', description: 'Completed an AI mock interview session', xp: 50 },
  // Community badges
  { id: 'first_post', category: 'community', icon: '💬', name: 'Community Voice', description: 'Posted your first question in the community', xp: 15 },
  { id: 'helpful_answer', category: 'community', icon: '🤝', name: 'Helpful Hand', description: 'Your answer was upvoted 5 times', xp: 50 },
  // Milestone badges
  { id: 'profile_complete', category: 'milestone', icon: '✅', name: 'Profile Complete', description: 'Completed your NextStep OS profile', xp: 25 },
  { id: 'first_login', category: 'milestone', icon: '🚀', name: 'Welcome Aboard!', description: 'Welcome to NextStep OS!', xp: 5, earned: true },
  { id: 'ai_search', category: 'milestone', icon: '🔍', name: 'AI Explorer', description: 'Used the Universal AI Search for the first time', xp: 10 }
];

// Simulated earned badges for demo
let earnedBadgeIds = ['first_login', 'first_doubt', 'first_lecture', 'first_test', 'profile_complete', 'career_explorer', 'first_dpp', 'streak_3', 'ai_search'];

// GET /api/achievements/badges — all badges with earned status
router.get('/badges', (req, res) => {
  const { category } = req.query;
  let definitions = BADGE_DEFINITIONS;
  if (category) definitions = definitions.filter(b => b.category === category);

  const badges = definitions.map(b => ({
    ...b,
    earned: earnedBadgeIds.includes(b.id),
    earnedAt: earnedBadgeIds.includes(b.id) ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null
  }));

  const earned = badges.filter(b => b.earned);
  const totalXP = earned.reduce((sum, b) => sum + b.xp, 0);

  res.json({
    success: true,
    badges,
    stats: {
      totalBadges: BADGE_DEFINITIONS.length,
      earnedBadges: earned.length,
      totalXP,
      level: Math.floor(totalXP / 100) + 1,
      nextLevelXP: (Math.floor(totalXP / 100) + 1) * 100 - totalXP
    },
    categories: [...new Set(BADGE_DEFINITIONS.map(b => b.category))]
  });
});

// GET /api/achievements/badges/earned — only earned
router.get('/badges/earned', (req, res) => {
  const earned = BADGE_DEFINITIONS
    .filter(b => earnedBadgeIds.includes(b.id))
    .map(b => ({ ...b, earned: true, earnedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() }));
  const totalXP = earned.reduce((sum, b) => sum + b.xp, 0);
  res.json({ success: true, badges: earned, totalXP });
});

// POST /api/achievements/badges/:id/earn — mark badge as earned (called from frontend on action)
router.post('/badges/:id/earn', (req, res) => {
  const badge = BADGE_DEFINITIONS.find(b => b.id === req.params.id);
  if (!badge) return res.status(404).json({ success: false, message: 'Badge not found' });
  if (earnedBadgeIds.includes(req.params.id)) {
    return res.json({ success: true, alreadyEarned: true, badge: { ...badge, earned: true } });
  }
  earnedBadgeIds.push(req.params.id);
  res.json({ success: true, newBadge: true, badge: { ...badge, earned: true, earnedAt: new Date().toISOString() } });
});

// GET /api/achievements/leaderboard — mock leaderboard
router.get('/leaderboard', (req, res) => {
  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', avatar: '👩‍🎓', xp: 1250, badges: 18, streak: 32 },
    { rank: 2, name: 'Arjun Mehta', avatar: '👨‍💻', xp: 980, badges: 14, streak: 21 },
    { rank: 3, name: 'Ananya Singh', avatar: '👩‍🔬', xp: 870, badges: 12, streak: 15 },
    { rank: 4, name: 'You', avatar: '🎯', xp: 280, badges: earnedBadgeIds.length, streak: 3, isCurrentUser: true },
    { rank: 5, name: 'Rohan Gupta', avatar: '👨‍🏫', xp: 220, badges: 8, streak: 7 }
  ];
  res.json({ success: true, leaderboard });
});

module.exports = router;

