# NextStep OS – REST API Specification

**Document Version:** 1.0.0  
**Base URL:** `/api`  
**Authentication:** Bearer JWT in `Authorization` header or Session Cookie

---

## 1. Authentication & Profiles (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (Parent, Student, Mentor) with email/password & role | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile, permissions & settings | Yes |
| `PUT` | `/api/auth/me` | Update profile, target exam, life stage, or avatar | Yes |

---

## 2. Parent-Child Management (`/api/children`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/children` | List all child profiles under authenticated parent | Yes (`parent`) |
| `POST` | `/api/children` | Add new child profile (name, age, life stage, interests) | Yes (`parent`) |
| `PUT` | `/api/children/:id` | Update child profile or developmental notes | Yes (`parent`) |
| `DELETE` | `/api/children/:id` | Remove child profile | Yes (`parent`) |

---

## 3. Dynamic Life Stages & Roadmaps (`/api/stages`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/stages` | Get metadata for all 7 lifecycle stages (nav items, themes, hero copy) | No |
| `GET` | `/api/stages/:key` | Get deep blueprints, curriculum subjects & recommended paths for stage | No |
| `POST` | `/api/stages/roadmap` | Generate customized lifecycle roadmap via AI context engine | Yes |
| `GET` | `/api/stages/saved-roadmaps` | Fetch user's saved, trackable learning roadmaps | Yes |

---

## 4. Batches, Lectures & Video Theater (`/api/batches`, `/api/lectures`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/batches` | List batches filtered by `lifeStage` and `targetExam` | No |
| `GET` | `/api/batches/:id` | Detailed batch syllabus, instructors & schedule | No |
| `POST` | `/api/batches/:id/enroll` | Enroll current user into batch | Yes |
| `GET` | `/api/lectures` | List lectures by `batchId` and `subject` | No |
| `GET` | `/api/lectures/:id` | Video stream URL, bookmarks, notes PDF, and attached DPP | No |

---

## 5. Daily Practice Problems & Mock Tests (`/api/dpp`, `/api/tests`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dpp/:lectureId` | Fetch DPP quiz questions with timer configuration | Yes |
| `POST` | `/api/dpp/:lectureId/submit` | Submit answers, calculate score & return step-by-step solutions | Yes |
| `GET` | `/api/tests` | List available mock examinations by category | No |
| `GET` | `/api/tests/:id` | Start timed test session | Yes |
| `POST` | `/api/tests/:id/submit` | Submit test answers & receive percentile / performance analysis | Yes |

---

## 6. Universal AI Assistant (`/api/ai`, `/api/doubts`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/universal-search` | Natural language query resolving to stage-specific guidance & links | No / Optional |
| `POST` | `/api/doubts/ask` | AI Saarthi doubt solver with step-by-step Socratic breakdown | Yes |
| `POST` | `/api/ai/interview-prep` | Mock interview generation & real-time response evaluation | Yes |
| `POST` | `/api/ai/resume-review` | ATS resume parsing and targeted skill-gap feedback | Yes |

---

## 7. Career, Degree & Skill Explorer (`/api/careers`, `/api/degrees`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/careers` | Browse catalog of careers with salary outlook and prerequisites | No |
| `GET` | `/api/careers/:slug` | Deep-dive career profile with degree requirements and roadmap | No |
| `GET` | `/api/degrees` | List higher education degrees with syllabus breakdown | No |
| `POST` | `/api/degrees/compare` | Compare two or three degrees side-by-side | No |

---

## 8. Analytics & Telemetry (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Aggregated user metrics: study hours, quizzes solved, rank progress | Yes |
| `POST` | `/api/analytics/heartbeat` | Record active learning time in video player or quiz | Yes |
