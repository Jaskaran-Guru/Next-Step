# NextStep OS – User Journeys & Implementation Roadmap

**Document Version:** 1.0.0  
**Vision:** *From the first step of learning to the first step of a professional career, NextStep OS guides every learner towards their next opportunity.*

---

## 1. Primary User Journeys

```
                    ┌────────────────────────────────────────────────────────┐
                    │               Homepage Universal Search                │
                    │      "What should I teach my 3-year-old child?"        │
                    │        "PCM vs Commerce: which should I choose?"       │
                    │      "How can I become employable after B.Tech?"       │
                    └───────────────────────────┬────────────────────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
   [Journey 1]        [Journey 2]         [Journey 3]         [Journey 4]        [Journey 5]
    👶 Parent          🧭 Class 10         🎯 Class 12         🎓 College         💼 Career
  Playway & Motor   Stream Selection &    JEE/NEET Batches,   DSA, Projects,    Certifications &
    Milestones          Board Mocks          DPP & Mocks      Resume Builder     Mock Interviews
```

### Journey 1: The New Parent (Early Childhood 1–4y)
1. **Discovery**: Parent visits NextStep OS looking for guidance on playway activities and speech development.
2. **Onboarding**: Selects **Parent** role and registers child ("Aarav", 3 years old). App immediately switches to **Playway OS** with Cyan branding (`#19C6D8`).
3. **Engagement**:
   - Accesses weekly sensory play, fine-motor skill activities, and bedtime stories.
   - Queries **AI Parent Advisor**: *"How much screen time is safe for a 3-year-old?"* $\rightarrow$ Receives empathetic, medical-pediatric aligned guidelines.
   - Tracks developmental milestones (speech, motor, social).

### Journey 2: The Secondary Student at the Crossroads (Class 9–10)
1. **Entry**: Class 10 student anxious about upcoming board examinations and choosing a stream for Class 11.
2. **Experience**: App transforms into **Board Prep OS** with Amber highlights.
3. **Engagement**:
   - Accesses chapter revision notes and previous-year question papers (PYQs).
   - Takes the **Stream Aptitude Explorer**: AI asks targeted questions evaluating interest in math, commerce, logic, and creativity.
   - Receives an objective breakdown of **PCM vs PCB vs Commerce vs Humanities** with corresponding college degree trees.

### Journey 3: The Competitive Aspirant (Class 11–12 / Dropper)
1. **Entry**: Student preparing for JEE Main or NEET-UG.
2. **Experience**: App transforms into **Physics Wallah OS** with Electric Blue identity.
3. **Engagement**:
   - Enrolls into *Lakshya JEE 2026* batch.
   - Watches video lectures with bookmarking and notes.
   - Solves Daily Practice Problems (DPP) with a countdown timer.
   - Solves doubts using **AI Saarthi 2.0** with LaTeX step-by-step mathematical reasoning.

### Journey 4: The Undergraduate Engineer (Higher Education 18–22y)
1. **Entry**: B.Tech 3rd year student seeking internship and placement readiness.
2. **Experience**: App transforms into **Skill Stack OS** with Emerald/Indigo palette.
3. **Engagement**:
   - Follows curated DSA & System Design tracks.
   - Builds portfolio projects (Full-Stack, Cloud, AI).
   - Uses the **ATS Resume Builder** to generate a clean resume.
   - Runs AI Mock Technical & HR Interviews with instant feedback on confidence and technical depth.

---

## 2. Six-Phase Implementation Roadmap

| Phase | Core Deliverables | Status |
|---|---|---|
| **Phase 1: Foundation, RBAC & Core UI** | User auth (JWT), Multi-Role accounts (Parent, Student, Mentor, Admin), Midnight Navy + Electric Violet design tokens, responsive layout. | ✅ COMPLETED |
| **Phase 2: 7-Stage Adaptive Engine** | Complete StageEngine 2.0 covering all 7 stages (Playway 1–4 to Career Launch), dynamic navigation rewiring, hero transformations. | ✅ COMPLETED |
| **Phase 3: Universal AI Assistant & Roadmaps** | Universal AI natural language search bar, Gemini 2.0 integration, multi-persona AI (Parent Advisor, Socratic Tutor, Career Coach, Interview Mentor), roadmap generator. | ✅ COMPLETED |
| **Phase 4: Examination Centre & PW Learning Core** | Batch explorer, high-definition lecture theater, timed DPP quiz engine, full-length mock tests, chapter notes PDF library. | ✅ COMPLETED |
| **Phase 5: Career, Degree & Employability Suite** | Career explorer, degree comparison matrix, ATS resume builder, soft skills & personality module, mock interview simulator. | 🚀 IN PROGRESS |
| **Phase 6: Multi-Child Parent Portal & Analytics** | Parent multi-child switcher, milestone tracker, weekly activity planner, study telemetry, deployment on Vercel. | 🚀 NEXT |
