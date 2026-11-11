const express = require('express');
const router = express.Router();

// In-memory seed notifications (in production these would be in MongoDB)
const seedNotifications = [
  {
    id: 'n1',
    type: 'exam_reminder',
    icon: '📅',
    title: 'JEE Main 2025 – Registration Closes Soon',
    message: 'Only 7 days left to register for JEE Main Session 1. Visit NTA official site.',
    link: 'https://jeemain.nta.ac.in',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n2',
    type: 'new_batch',
    icon: '🎓',
    title: 'New Batch: NEET 2025 Crash Course',
    message: 'A new NEET crash course batch has been published. Enroll now and start your prep!',
    link: null,
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n3',
    type: 'doubt_resolved',
    icon: '✅',
    title: 'Your Doubt Has Been Answered',
    message: 'AI Saarthi has resolved your doubt on Organic Chemistry – Alkyl Halides. Check it out!',
    link: null,
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n4',
    type: 'achievement',
    icon: '🏆',
    title: 'Achievement Unlocked: First Doubt Solved!',
    message: 'You submitted your first doubt. Keep the curiosity alive!',
    link: null,
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n5',
    type: 'study_reminder',
    icon: '📚',
    title: 'Study Streak Alert',
    message: 'You haven\'t studied today yet. Your 5-day streak is at risk!',
    link: null,
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let notifications = [...seedNotifications];

// GET /api/notifications — list all, unread first
router.get('/', (req, res) => {
  const sorted = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const unreadCount = notifications.filter(n => !n.isRead).length;
  res.json({ success: true, notifications: sorted, unreadCount });
});

// GET /api/notifications/unread-count
router.get('/unread-count', (req, res) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  res.json({ success: true, unreadCount });
});

// PUT /api/notifications/:id/read — mark single as read
router.put('/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
  notif.isRead = true;
  res.json({ success: true, notification: notif });
});

// PUT /api/notifications/read-all — mark all as read
router.put('/read-all', (req, res) => {
  notifications.forEach(n => { n.isRead = true; });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// DELETE /api/notifications/:id
router.delete('/:id', (req, res) => {
  const idx = notifications.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Not found' });
  notifications.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

// POST /api/notifications — create new (admin use)
router.post('/', (req, res) => {
  const { type, icon, title, message, link } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'title and message are required' });
  }
  const notif = {
    id: 'n' + Date.now(),
    type: type || 'info',
    icon: icon || '🔔',
    title,
    message,
    link: link || null,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(notif);
  res.status(201).json({ success: true, notification: notif });
});

module.exports = router;

