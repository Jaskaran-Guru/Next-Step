const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper function to call Gemini API with fallback
async function callGemini(systemPrompt, userPrompt, fallbackFn) {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
  if (apiKey && apiKey.length > 10) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }]
            }
          ]
        })
      });
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        // Try parsing JSON if required
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch (e) {
            return { directAnswer: rawText };
          }
        }
        return { directAnswer: rawText };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using built-in reasoning engine:', err.message);
    }
  }
  return fallbackFn();
}

// 1. Universal Search Endpoint
router.post('/universal-search', async (req, res) => {
  try {
    const { query, activeStage } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const qLower = query.toLowerCase().trim();

    const systemPrompt = `You are NextStep OS Universal AI Assistant — an expert educational counselor, academic guide, and career architect.
The user is asking: "${query}".
Active life stage: "${activeStage || 'unspecified'}".

Respond with clean JSON:
{
  "directAnswer": "Comprehensive, encouraging, structured response with bullet points explaining reasoning. Emphasize alternative pathways and never guarantee admissions or exact results.",
  "recommendedStage": "playway_1_4 | primary_5_10 | middle_11_14 | stream_selection_15_16 | entrance_prep_17_18 | degree_college_19_23 | career_launch",
  "keyHighlights": ["Point 1", "Point 2", "Point 3"],
  "suggestedActions": [
    { "label": "Button Label", "action": "switch_stage | open_view", "target": "stage_key or view_id" }
  ],
  "relatedQueries": ["Related question 1", "Related question 2", "Related question 3"]
}`;

    const fallbackGenerator = () => {
      // Intelligent rule-based fallback
      if (qLower.includes('3-year') || qLower.includes('playway') || qLower.includes('toddler') || qLower.includes('motor skill') || qLower.includes('screen time')) {
        return {
          directAnswer: `For a 3-year-old child, focus on **Sensory Exploration and Unstructured Play** rather than academic drilling. Research shows the brain forms over 1 million neural connections per second at this age.

**Top Recommended Activities:**
- **Sensory & Fine Motor**: Play dough modeling, transferring water with sponges, finger painting, and stacking blocks.
- **Language & Speech**: Read aloud illustrated storybooks for 20 minutes daily; ask open-ended questions like *"Where is the dog going?"*
- **Gross Motor**: Jumping over ribbons, obstacle courses with sofa cushions, kickball in the park.
- **Screen Time Guideline**: Limit high-paced digital screens to less than 1 hour daily of high-quality co-viewed content.`,
          recommendedStage: 'playway_1_4',
          keyHighlights: ['Sensory & fine-motor play', 'Daily interactive storytelling', 'Zero rote-learning pressure'],
          suggestedActions: [
            { label: 'Switch to Playway OS', action: 'switch_stage', target: 'playway_1_4' },
            { label: 'Open Parent Advisor', action: 'open_view', target: 'doubts' }
          ],
          relatedQueries: [
            'How to handle toddler tantrums without shouting?',
            'Best preschool selection checklist',
            'Nutritional milestones for 3-4 years old'
          ]
        };
      }

      if (qLower.includes('class 5') || qLower.includes('primary') || qLower.includes('phonics') || qLower.includes('mental math')) {
        return {
          directAnswer: `In Class 5 (Ages 9–10), the primary focus shifts from basic literacy to **Conceptual Foundations and Independent Study Habits**.

**Key Subject Priorities:**
- **Mathematics**: Fractions, decimals, unitary method, basic geometry (perimeter/area), and mental math speed drills.
- **Science & EVS**: States of matter, plant/animal life cycles, environmental conservation, and hands-on kitchen experiments.
- **Languages (English/Hindi/Regional)**: Reading comprehension, creative narrative writing, and vocabulary expansion.
- **Computer Literacy**: Touch-typing, basic internet safety, and block coding (Scratch).`,
          recommendedStage: 'primary_5_10',
          keyHighlights: ['Mental math & fractions', 'Conceptual science over memorization', 'Introductory block coding'],
          suggestedActions: [
            { label: 'Switch to Primary OS', action: 'switch_stage', target: 'primary_5_10' },
            { label: 'View Primary Courses', action: 'open_view', target: 'batches' }
          ],
          relatedQueries: [
            'How to develop a daily reading habit in Class 5?',
            'Olympiad exams suitable for Class 5 students',
            'Overcoming fear of mathematics at primary level'
          ]
        };
      }

      if (qLower.includes('pcm') || qLower.includes('commerce') || qLower.includes('after 10th') || qLower.includes('class 10') || qLower.includes('stream')) {
        return {
          directAnswer: `Choosing between **PCM (Physics, Chemistry, Math)** and **Commerce** after Class 10 should be guided by your innate cognitive affinity and desired lifestyle, not peer pressure:

**1. Science (PCM) Pathway:**
- **Best if:** You enjoy analytical problem-solving, abstract mathematics, and understanding physical laws.
- **Key Degree Options:** B.Tech / B.E., B.Arch, Integrated M.Sc, Defense (NDA), Merchant Navy, Data Science.
- **Demands:** High daily problem-solving volume; competitive exams like JEE Main/Advanced, BITSAT.

**2. Commerce Pathway (with/without Math):**
- **Best if:** You are fascinated by businesses, financial markets, economics, corporate strategy, or numbers in commercial contexts.
- **Key Degree Options:** B.Com (Hons), BBA, BMS, CA (Chartered Accountancy), CS, CFA, IPMAT (IIM 5-Year Integrated).
- **Advantage:** Commerce + Mathematics keeps tech-adjacent fields (FinTech, Data Analytics) wide open!`,
          recommendedStage: 'stream_selection_15_16',
          keyHighlights: ['Evaluate affinity for abstract math vs business logic', 'Commerce + Math opens FinTech & Analytics', 'Alternative pathways remain flexible'],
          suggestedActions: [
            { label: 'Explore Stream Navigator', action: 'open_view', target: 'stages' },
            { label: 'Switch to Board Prep OS', action: 'switch_stage', target: 'stream_selection_15_16' }
          ],
          relatedQueries: [
            'Can I do software engineering after Commerce with Math?',
            'CA vs MBA Finance: Long-term career trajectory',
            'Aptitude test for Class 10 stream selection'
          ]
        };
      }

      if (qLower.includes('software engineer') || qLower.includes('b.tech') || qLower.includes('bca') || qLower.includes('coding') || qLower.includes('employab')) {
        return {
          directAnswer: `To become a high-impact, employable **Software Engineer**, your choice of degree matters far less than your **demonstrated engineering skill stack**:

**Degree Pathways Compared:**
- **B.Tech in CSE / IT (4 Years)**: The standard campus recruitment highway. High campus placement volume at Tier-1/2 colleges.
- **BCA + MCA / Self-Driven (3+2 Years)**: Highly viable when paired with open-source contributions, GitHub repositories, and competitive programming.

**The Zero-Unemployment Employability Blueprint:**
1. **Core Language & DSA**: Master C++ or Java; solve 200+ LeetCode problems (Arrays, HashMaps, Trees, DP).
2. **Production Web/Cloud Projects**: Build and deploy 2 full-stack applications with auth, database indexing, and Docker.
3. **Computer Science Fundamentals**: Operating Systems (threads/locks), DBMS (SQL joins, ACID), System Design basics.
4. **Active Portfolio**: Live Vercel/Render deployments, clear READMEs, and open-source contributions.`,
          recommendedStage: 'degree_college_19_23',
          keyHighlights: ['DSA + 2 production full-stack projects', 'GitHub code proof outweighs college tier', 'System design & database fundamentals'],
          suggestedActions: [
            { label: 'View Degree Comparison', action: 'open_view', target: 'careers' },
            { label: 'Switch to Skill Stack OS', action: 'switch_stage', target: 'degree_college_19_23' }
          ],
          relatedQueries: [
            'B.Tech CSE vs BCA + MCA: Placement difference',
            'Top 5 projects to guarantee an off-campus SDE interview',
            'How to prepare for campus placements from 3rd year'
          ]
        };
      }

      // General Education Query Fallback
      return {
        directAnswer: `NextStep OS is your comprehensive learning and career companion. Based on your query **"${query}"**, we recommend taking a structured, milestone-based approach.

**Key Principles for this Stage:**
- Align daily effort with conceptual clarity rather than passive reading.
- Validate your progress through timed practice tests and practical project output.
- Explore alternative pathways early to eliminate career uncertainty.`,
        recommendedStage: activeStage || 'entrance_prep_17_18',
        keyHighlights: ['Conceptual understanding first', 'Consistent daily practice', 'Evidence-based career readiness'],
        suggestedActions: [
          { label: 'View Learning Roadmaps', action: 'open_view', target: 'stages' },
          { label: 'Explore Batches', action: 'open_view', target: 'batches' }
        ],
        relatedQueries: [
          'How to create an effective daily study timetable?',
          'Best memory retention techniques for competitive exams',
          'Balancing school curriculum with competitive exam preparation'
        ]
      };
    };

    const aiResult = await callGemini(systemPrompt, query, fallbackGenerator);
    return res.json({
      success: true,
      query,
      result: aiResult
    });
  } catch (error) {
    console.error('Universal Search error:', error);
    return res.status(500).json({ success: false, message: 'Universal search error: ' + error.message });
  }
});

// 2. AI Mock Interview Practice
router.post('/interview-prep', async (req, res) => {
  try {
    const { role, domain, difficulty } = req.body;
    const targetRole = role || 'Junior Software Engineer';

    const systemPrompt = `You are a Senior Engineering Hiring Manager & Interview Coach.
Generate 3 realistic interview questions for a candidate targeting: "${targetRole}" in domain: "${domain || 'Full-Stack Web Development'}" at difficulty: "${difficulty || 'Intermediate'}".
Format as JSON:
{
  "questions": [
    {
      "id": 1,
      "type": "Technical | System Design | Behavioral",
      "question": "question text",
      "whatInterviewerLooksFor": "key criteria",
      "suggestedFramework": "e.g., STAR method or Trade-off analysis"
    }
  ]
}`;

    const fallback = () => ({
      questions: [
        {
          id: 1,
          type: 'Technical',
          question: `Explain how indexing works in MongoDB or PostgreSQL. When might an index degrade write performance?`,
          whatInterviewerLooksFor: 'Understanding of B-Tree structure, read latency reduction vs write amplification trade-off.',
          suggestedFramework: 'Define B-Tree -> Explain search speedup O(log N) -> Explain insert/update overhead on index balance.'
        },
        {
          id: 2,
          type: 'System Design',
          question: `How would you design a scalable rate limiter for an API endpoint like NextStep AI Search?`,
          whatInterviewerLooksFor: 'Token Bucket vs Leaky Bucket algorithms, Redis in-memory storage, distributed lock awareness.',
          suggestedFramework: 'Requirements -> Algorithm choice -> High-level architecture -> Edge cases.'
        },
        {
          id: 3,
          type: 'Behavioral',
          question: `Describe a situation where a production bug occurred or your code failed. How did you diagnose and resolve it?`,
          whatInterviewerLooksFor: 'Accountability, blameless post-mortem mindset, structured troubleshooting.',
          suggestedFramework: 'STAR Method (Situation, Task, Action, Result).'
        }
      ]
    });

    const result = await callGemini(systemPrompt, `Generate questions for ${targetRole}`, fallback);
    return res.json({ success: true, targetRole, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. AI Resume Reviewer
router.post('/resume-review', async (req, res) => {
  try {
    const { skills, experienceSummary, targetRole } = req.body;

    const systemPrompt = `You are an executive ATS Technical Recruiter.
Analyze this profile targeting: "${targetRole || 'Full-Stack Developer'}".
Skills provided: "${(skills || []).join(', ')}".
Summary: "${experienceSummary || 'Undergraduate student with 2 project demos'}".

Return JSON:
{
  "readinessScore": 75,
  "strengths": ["list of strengths"],
  "criticalGaps": ["missing skills or certifications needed"],
  "actionableImprovements": ["bulleted tips for resume bullet points using XYZ format"],
  "suggestedProjects": ["Project ideas that will stand out"]
}`;

    const fallback = () => ({
      readinessScore: 78,
      strengths: [
        'Solid foundational stack in modern JavaScript/TypeScript and Node.js',
        'Awareness of full-stack integration and database connectivity'
      ],
      criticalGaps: [
        'Missing production deployment experience with CI/CD pipelines',
        'Need quantified metrics in project bullet points (e.g., "Reduced latency by 35% using caching")',
        'Unit & integration testing frameworks (Jest / Playwright) not highlighted'
      ],
      actionableImprovements: [
        'Rewrite project bullets using the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]"',
        'Add live URLs and GitHub repository links for every listed project',
        'Highlight database indexing and state management skills'
      ],
      suggestedProjects: [
        'Real-time collaborative code editor using WebSockets and Redis',
        'Distributed task queue worker with retry logic and telemetry dashboard'
      ]
    });

    const result = await callGemini(systemPrompt, 'Evaluate resume profile', fallback);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
