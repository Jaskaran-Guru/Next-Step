const express = require('express');
const router = express.Router();

let COMMUNITY_POSTS = [
  {
    id: 'post-1',
    authorName: 'Aarav Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    stageTag: '🎯 Class 11-12 (JEE)',
    subject: 'Physics',
    title: 'How do you visualize the torque direction using the Right-Hand Thumb Rule in 3D problems?',
    content: 'Whenever cross-product r × F comes in rotational dynamics with non-orthogonal vectors, I often get the sign of angular momentum wrong. Any visual trick that always works?',
    upvotes: 42,
    commentsCount: 6,
    createdAt: '2 hours ago',
    verifiedAnswer: {
      author: 'Rajesh Sir (Kota Physics Faculty)',
      text: 'Place your four fingers along the position vector r from the axis of rotation, curl them towards the force vector F through the smaller angle θ. Your outstretched thumb automatically points in the direction of vector torque τ. In 2D projections: counter-clockwise torque is +k̂ (out of page), clockwise torque is -k̂ (into page).'
    }
  },
  {
    id: 'post-2',
    authorName: 'Sneha Patel',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    stageTag: '⚡ Class 10 (Board)',
    subject: 'Stream Decision',
    title: 'Is taking Computer Science in Class 11 compulsory if I want to do B.Tech CSE in college?',
    content: 'My school offers PCM with Physical Education or Computer Science (Python). Will taking PE reduce my chances of doing software engineering in IIT or NIT?',
    upvotes: 68,
    commentsCount: 11,
    createdAt: '5 hours ago',
    verifiedAnswer: {
      author: 'NextStep Academic Counselor',
      text: 'No, it is NOT compulsory! Admission to B.Tech CSE in all IITs, NITs, and central universities is based strictly on JEE rank in Physics, Chemistry, and Math. In fact, many toppers take Physical Education as their 5th subject to maximize their CBSE aggregate score with lower exam stress, while learning programming parallelly.'
    }
  },
  {
    id: 'post-3',
    authorName: 'Rohan Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
    stageTag: '🎓 College (B.Tech)',
    subject: 'Computer Science',
    title: 'What is the optimal order to learn Data Structures & Algorithms for 3rd-year campus placements?',
    content: 'Currently comfortable with basic arrays and strings. Should I jump directly into Dynamic Programming or master Graphs and Trees first?',
    upvotes: 95,
    commentsCount: 14,
    createdAt: '1 day ago',
    verifiedAnswer: {
      author: 'Vikram Sengupta (Senior SDE Mentor)',
      text: 'Follow this exact sequence: 1. Two Pointers & Sliding Window -> 2. HashMaps & Prefix Sums -> 3. Recursion & Backtracking -> 4. Binary Trees & Traversals -> 5. Binary Search Trees & Heaps -> 6. Graphs (BFS/DFS, Topological Sort, Dijkstra) -> 7. Dynamic Programming (1D memoization first, then 2D grid DP). Never start DP before recursion is crystal clear!'
    }
  }
];

// 1. Get all community posts
router.get('/posts', (req, res) => {
  const { subject } = req.query;
  let filtered = COMMUNITY_POSTS;
  if (subject && subject !== 'All') {
    filtered = filtered.filter(p => p.subject.toLowerCase() === subject.toLowerCase());
  }
  return res.json({ success: true, count: filtered.length, posts: filtered });
});

// 2. Create new community post
router.post('/posts', (req, res) => {
  const { title, content, subject, stageTag } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const newPost = {
    id: 'post-' + Date.now(),
    authorName: 'Learner',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    stageTag: stageTag || '🎯 General Student',
    subject: subject || 'General',
    title: title.trim(),
    content: content.trim(),
    upvotes: 1,
    commentsCount: 0,
    createdAt: 'Just now'
  };

  COMMUNITY_POSTS.unshift(newPost);
  return res.status(201).json({ success: true, message: 'Question posted to community!', post: newPost });
});

// 3. Upvote a post
router.post('/posts/:id/upvote', (req, res) => {
  const post = COMMUNITY_POSTS.find(p => p.id === req.params.id);
  if (post) {
    post.upvotes += 1;
    return res.json({ success: true, upvotes: post.upvotes });
  }
  return res.status(404).json({ success: false, message: 'Post not found' });
});

module.exports = router;

