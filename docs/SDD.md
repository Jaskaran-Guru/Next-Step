# NextStep OS – Software Design Document (SDD)

**Document Version:** 1.0.0  
**Target:** High-Performance Modular Architecture for NextStep OS  
**Design Tokens:** Electric Violet (`#6857F5`), Cyan (`#19C6D8`), Lavender (`#A78BFA`), Midnight Navy (`#0B1020`), Deep Navy (`#151D32`)

---

## 1. Architectural Overview

NextStep OS employs a **Modular Layered Architecture** with strict separation of concerns, designed for continuous evolution, rapid edge-rendering on Vercel, and hybrid database support (MongoDB Atlas / PostgreSQL Prisma ready).

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   NextStep OS Client                   │
                    │   (SPA: StageEngine 2.0 + Dynamic RBAC Dashboards)     │
                    └───────────────────────────┬────────────────────────────┘
                                                │ REST / JSON (JWT Session)
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               API Gateway & Router (Express)           │
                    │   (/api/auth, /api/stages, /api/batches, /api/ai...)   │
                    └───────┬───────────────────┬────────────────────┬───────┘
                            │                   │                    │
             ┌──────────────▼──────┐   ┌────────▼────────┐   ┌───────▼───────────┐
             │   Context & AI Hub  │   │ Education Core  │   │  RBAC & Profiles  │
             │ (Gemini 2.0 / RAG)  │   │ (Stages/Exams)  │   │ (Parent/Child/Pro)│
             └──────────────┬──────┘   └────────┬────────┘   └───────┬───────────┘
                            │                   │                    │
                            └───────────────────┼────────────────────┘
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │           Data Access & Persistence Layer              │
                    │   (Connection-Pooled Mongoose / PostgreSQL Ready)      │
                    └────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture & Design System

### 2.1 Design Tokens Specification (Electric Violet + Cyan SaaS Palette)

The frontend implements modern CSS Custom Properties with strict contrast ratios (WCAG AA compliant):

```css
:root {
  /* Brand Core Colors */
  --brand-primary: #6857F5;       /* Electric Violet */
  --brand-secondary: #19C6D8;     /* Cyan */
  --brand-accent: #A78BFA;        /* Lavender */
  --brand-primary-rgb: 104, 87, 245;
  --brand-secondary-rgb: 25, 198, 216;

  /* Semantic Feedback */
  --color-success: #22C58B;       /* Emerald */
  --color-warning: #F5B942;       /* Amber */
  --color-error: #F06474;         /* Coral Red */

  /* Dark Theme Tokens (Default) */
  --bg-main: #0B1020;             /* Midnight Navy */
  --bg-card: #151D32;             /* Deep Navy */
  --bg-elevated: #1D2942;         /* Slate Navy */
  --text-main: #F5F7FF;           /* Cloud White */
  --text-secondary: #A5B0C5;      /* Silver Blue */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(104, 87, 245, 0.5);
  --glass-bg: rgba(21, 29, 50, 0.85);
  --glass-blur: blur(16px);
}

/* Light Theme Tokens */
[data-theme="light"] {
  --bg-main: #F6F8FC;             /* Light Cloud */
  --bg-card: #FFFFFF;             /* Pure White */
  --bg-elevated: #EEF2F9;         /* Light Surface */
  --text-main: #182238;           /* Deep Charcoal */
  --text-secondary: #667085;      /* Slate Gray */
  --border-subtle: #E2E8F0;
  --border-focus: rgba(104, 87, 245, 0.4);
  --glass-bg: rgba(255, 255, 255, 0.9);
}
```

### 2.2 StageEngine 2.0 (Whole-App Transformation Engine)
Rather than simple page switching, `StageEngine` manages a single source of truth for the platform state:
1. **Nav Tree Rewiring**: Replaces navigation links, badges, and counters based on active stage.
2. **Dynamic AI Persona**: Updates AI system prompt parameters (`targetAudience`, `tone`, `pedagogicalDepth`).
3. **Hero & Content Cards**: Dynamically updates the hero spotlight, current modules, and action cards.
4. **State Persistence**: Syncs via `localStorage` for zero-flash load and writes back to `PUT /api/auth/me` for cloud persistence.

---

## 3. Universal AI Assistant & Context Orchestration

```
User Query (e.g. "What should I do after 10th if I like computers?")
      │
      ▼
┌────────────────────────────────────────────────────────┐
│               AI Context Injector                      │
│ - Injects active life stage (e.g. "stream_selection") │
│ - Injects user profile (interests: ["coding", "math"]) │
│ - Injects guardrails: Socratic, no admission guarantee │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│           Gemini API (1.5 Pro / 2.0 Flash)             │
│ - Temperature: 0.65 (focused yet conversational)       │
│ - Formats markdown, bullet points, LaTeX math          │
└─────────────────────────────┬──────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────┐
│                 Client Render Engine                   │
│ - Interactive clickable pathway pills                  │
│ - LaTeX KaTeX mathematical equation renderer           │
│ - "Add to My Roadmap" action triggers                  │
└────────────────────────────────────────────────────────┘
```

---

## 4. Multi-Role RBAC Model

The system enforces four distinct roles with granular permission scopes:

1. **Role: Parent (`parent`)**
   - Can create, view, edit child profiles (`POST /api/children`, `GET /api/children`).
   - Can switch active child context (`activeChildId`).
   - Access to Parent Guidance, Developmental Milestones, and Weekly Planners.
2. **Role: Student (`student`)**
   - Independent learner account.
   - Access to Courses, Video Theater, DPPs, Mock Tests, Career Explorer, Resume Builder.
3. **Role: Mentor / Teacher (`mentor`)**
   - Authoring access for Batches, Lectures, and Practice Questions.
   - Student telemetry and doubt-clearing queue.
4. **Role: Admin (`admin`)**
   - System settings, role elevation, stage curriculum config, analytics.

---

## 5. Security & Data Protection Architecture

- **Stateless Authentication**: JWT tokens signed with HMAC-SHA256, carrying user role, ID, and life-stage.
- **Child Privacy Shield**: Child records created under parents do not require independent email/phone numbers; their data is isolated and accessible only by the verified parent.
- **Rate Limiting**: AI endpoints protected by leaky-bucket rate limiters to prevent API abuse.
- **Input Sanitization**: All incoming query and doubt text sanitized against XSS and injection attacks.

