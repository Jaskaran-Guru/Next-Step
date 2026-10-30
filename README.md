# NextStep OS (Physics Wallah Clone + Age-Adaptive Learning Platform)

> **One Search. Every Learning Need. Zero Fluff.**  
> A full-featured Physics Wallah (PW) clone integrated with an **Age-Adaptive Stage Engine** that transforms the entire application (navigation, AI persona, themes, content) across 7 lifecycle stages—from Playway (ages 1–4) through Board Exam, College, and Career Launch.

---

## 🌟 Key Features

### 1. 🎓 Physics Wallah Core Capabilities
- **Batch Explorer & Enrollment**: Filter batches by exam stream (JEE, NEET, NDA, CBSE, Foundation). Real-time enrollment and batch schedules.
- **Interactive Lecture Theater**: High-definition video player with speed toggle ($0.5\times$ to $2.0\times$), quality selector, chapter bookmarks, and live doubt timestamps.
- **Daily Practice Problems (DPP)**: Integrated quiz engine with countdown timer, question navigation grid, instant scoring, and step-by-step explanations.
- **Mock Test Series**: Timed test simulation mirroring NTA / PW exam interface with positive/negative marking rules.
- **Study Materials & Notes**: Curated chapter-wise PDF revision notes, formula cheat sheets, and downloadable DPPs.
- **AI Saarthi 2.0**: Integrated AI tutor powered by Google Gemini with domain-aware system prompts, OCR doubt solving, and structured step-by-step guidance.

### 2. 🧬 Dynamic Stage Engine (Age-Adaptive Transformation)
Unlike standard platforms with a static age filter, NextStep's **StageEngine** rewires the **entire UI and AI persona** in real time:

| Life Stage | Age Bracket | Accent Color | Brand Subtitle | Sidebar Experience | AI Saarthi Persona |
|---|---|---|---|---|---|
| **Playway & Early Years** | Ages 1–4 | `#06B6D4` (Cyan) | Playway OS | Milestones, Motor Skills, Nutrition, Daily Activity | Pediatric & Early Childhood Advisor |
| **Primary Schooling** | Ages 5–10 | `#2563EB` (Blue) | Primary OS | Curiosity Quests, Phonics, Foundations, Badges | Friendly "Curiosity Buddy" |
| **Middle School** | Ages 11–14 | `#8B5CF6` (Violet) | Discovery OS | Olympiads, STEM Labs, Science & Math Explorers | Discovery Guide & Problem Solver |
| **Class 9–10 Board Prep** | Ages 15–16 | `#F59E0B` (Amber) | Board Prep OS | Board Mocks, Stream Decision Matrix, PYQs | CBSE Board Mentor & Stream Counselor |
| **Class 11–12 & Droppers** | Ages 17–18 | `#2563EB` (Electric Blue) | Physics Wallah OS | Full Batches, DPPs, NTA Mocks, Rank Predictors | Rigorous JEE/NEET Saarthi Tutor |
| **College & Degree** | Ages 19–23 | `#10B981` (Emerald) | Skill Stack OS | Projects, DSA, System Design, Open Source, Resume | Technical Mentor & Code Architect |
| **Career Launch** | Ages 21+ | `#6366F1` (Indigo) | Corporate OS | Mock Interviews, CTC Negotiator, Portfolio, Cold Outreach | Senior Interview Coach |

- **First-Visit Onboarding**: Prompts new users to select their learning stage once.
- **Profile Customizer**: Switch or update learning stages anytime in the Profile modal; changes persist immediately to MongoDB Atlas.

### 3. 🎨 Visual Identity & Color Tokens
- **Midnight Navy** (`#101C3A`): Deep brand dark tone
- **Electric Blue** (`#2563EB`): Primary call-to-actions
- **AI Violet** (`#8B5CF6`): Intelligence and AI badge accents
- **Neon Cyan** (`#06B6D4`): Interactive accents and progress rings
- Full **Light Mode** & **Dark Mode** toggle with instant token persistence.

---

## 🛠️ Tech Stack

- **Backend**: Node.js & Express.js
- **Database**: MongoDB Atlas via Mongoose
- **AI Integration**: Google Gemini API (`@google/genai` REST)
- **Frontend**: Responsive Single Page Application (HTML5, Modern CSS custom properties, Vanilla JS ES6+)
- **Deployment**: Production-ready for Render.com (`render.yaml` Blueprint included)

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/Jaskaran-Guru/Next-Step.git
cd Next-Step
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Seed Sample PW Data
```bash
npm run seed
```

### 5. Start the Application
```bash
npm start
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## ⚡ Deploying to Vercel (Fast & Free)

NextStep is configured for zero-friction serverless deployment on **Vercel** via `vercel.json` and `api/index.js`:

1. Sign up / Log in to [**vercel.com**](https://vercel.com/) with your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your repository: `Jaskaran-Guru/Next-Step`.
4. Framework Preset: Leave as **Other**.
5. Under **Environment Variables**, add:
   - `MONGODB_URI` = *(your MongoDB Atlas connection string)*
   - `GEMINI_API_KEY` = *(your Google Gemini API key)*
6. Click **Deploy**.
7. Vercel will build and deploy the app in ~30 seconds, giving you a custom `.vercel.app` URL!

---

## 🌐 Deploying to Render.com (Alternative Free Host)

Deploying NextStep on Render takes less than 2 minutes using the bundled Blueprint:

1. Sign up / Log in to [Render.com](https://render.com) using your GitHub account.
2. Click **New +** $\rightarrow$ **Web Service** (or **Blueprint**).
3. Connect your repository: `https://github.com/Jaskaran-Guru/Next-Step.git`.
4. Configure the Web Service:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGODB_URI` = *(your MongoDB Atlas connection string)*
   - `GEMINI_API_KEY` = *(your Gemini API key)*
   - `PORT` = `10000`
6. Click **Create Web Service**.
7. Once deployed, Render provides your live URL (e.g., `https://nextstep-xxxx.onrender.com`).

---

## 📡 API Overview

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | Platform health and version status |
| `/api/auth/me` | GET / PUT | Fetch or update user profile, life stage, and preferences |
| `/api/batches` | GET / POST | List all batches or enroll |
| `/api/lectures` | GET | Fetch lectures by batch and subject |
| `/api/dpp` | GET / POST | Fetch DPP questions or submit test score |
| `/api/tests` | GET / POST | Mock test list and submission |
| `/api/doubts/ask` | POST | Ask AI Saarthi doubt with Gemini AI |
| `/api/stages` | GET | Fetch all 7 life-stage configurations & blueprints |
| `/api/stages/roadmap` | POST | Generate AI roadmap for child/career lifecycle |

---

## 📄 License
ISC License — built for students, parents, and lifelong learners.

