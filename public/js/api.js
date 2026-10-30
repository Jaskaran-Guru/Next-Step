/**
 * NEXTSTEP (PHYSICS WALLAH CLONE) - API CLIENT SERVICE
 * Connects Frontend seamlessly with Express & MongoDB Atlas Backend
 */

const API_BASE = '/api';

const API = {
  // Auth & Student Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`);
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Batches & Courses
  async getBatches(category = 'All') {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/batches${query}`);
    return res.json();
  },

  async getBatchDetails(idOrSlug) {
    const res = await fetch(`${API_BASE}/batches/${idOrSlug}`);
    return res.json();
  },

  async toggleEnrollBatch(batchId) {
    const res = await fetch(`${API_BASE}/batches/${batchId}/enroll`, {
      method: 'POST'
    });
    return res.json();
  },

  // Lectures, Progress & Notes
  async getLectureDetails(lectureId) {
    const res = await fetch(`${API_BASE}/lectures/${lectureId}`);
    return res.json();
  },

  async saveWatchProgress(lectureId, progressSeconds, totalSeconds) {
    const res = await fetch(`${API_BASE}/lectures/${lectureId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressSeconds, totalSeconds })
    });
    return res.json();
  },

  async addNote(lectureId, noteData) {
    const res = await fetch(`${API_BASE}/lectures/${lectureId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    return res.json();
  },

  async deleteNote(noteId) {
    const res = await fetch(`${API_BASE}/lectures/notes/${noteId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Daily Practice Problems (DPP)
  async getDppForLecture(lectureId) {
    const res = await fetch(`${API_BASE}/dpp/lecture/${lectureId}`);
    return res.json();
  },

  async submitDpp(dppId, answers, timeTakenSeconds) {
    const res = await fetch(`${API_BASE}/dpp/${dppId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, timeTakenSeconds })
    });
    return res.json();
  },

  // CBT Mock Test Series
  async getTests() {
    const res = await fetch(`${API_BASE}/tests`);
    return res.json();
  },

  async getTestDetails(testId) {
    const res = await fetch(`${API_BASE}/tests/${testId}`);
    return res.json();
  },

  async submitTest(testId, answers, timeSpentSeconds) {
    const res = await fetch(`${API_BASE}/tests/${testId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, timeSpentSeconds })
    });
    return res.json();
  },

  // PW Saarthi AI Doubt Assistant
  async askDoubt(questionText, subject = 'Physics') {
    const res = await fetch(`${API_BASE}/doubts/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText, subject })
    });
    return res.json();
  },

  async getDoubtHistory() {
    const res = await fetch(`${API_BASE}/doubts/history`);
    return res.json();
  },

  async upvoteDoubt(doubtId) {
    const res = await fetch(`${API_BASE}/doubts/${doubtId}/upvote`, {
      method: 'POST'
    });
    return res.json();
  },

  // Khazana & Study Materials
  async getMaterials(category = 'All', subject = 'All') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (subject && subject !== 'All') params.append('subject', subject);
    const res = await fetch(`${API_BASE}/materials?${params.toString()}`);
    return res.json();
  },

  async recordDownload(materialId) {
    const res = await fetch(`${API_BASE}/materials/${materialId}/download`, {
      method: 'POST'
    });
    return res.json();
  },

  // Analytics Dashboard
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    return res.json();
  },

  // Life-Stage & Career Navigator (Birth to Career)
  async getStages() {
    const res = await fetch(`${API_BASE}/stages`);
    return res.json();
  },

  async getStageDetails(stageKey) {
    const res = await fetch(`${API_BASE}/stages/${stageKey}`);
    return res.json();
  },

  async askStageAdvisor(childName, childAge, currentStage, parentQuery) {
    const res = await fetch(`${API_BASE}/stages/advise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childName, childAge, currentStage, parentQuery })
    });
    return res.json();
  },

  async getSavedRoadmaps() {
    const res = await fetch(`${API_BASE}/stages/saved-roadmaps`);
    return res.json();
  },

  // Universal AI Assistant & Search
  async universalSearch(query, activeStage) {
    const res = await fetch(`${API_BASE}/ai/universal-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, activeStage })
    });
    return res.json();
  },

  async getMockInterview(role, domain, difficulty) {
    const res = await fetch(`${API_BASE}/ai/interview-prep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, domain, difficulty })
    });
    return res.json();
  },

  async reviewResume(skills, experienceSummary, targetRole) {
    const res = await fetch(`${API_BASE}/ai/resume-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, experienceSummary, targetRole })
    });
    return res.json();
  },

  // Career & Degree Explorer
  async getCareers() {
    const res = await fetch(`${API_BASE}/careers`);
    return res.json();
  },

  async getCareerBySlug(slug) {
    const res = await fetch(`${API_BASE}/careers/${slug}`);
    return res.json();
  },

  async getDegrees() {
    const res = await fetch(`${API_BASE}/careers/meta/degrees`);
    return res.json();
  },

  async compareDegrees(codes) {
    const res = await fetch(`${API_BASE}/careers/meta/compare-degrees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codes })
    });
    return res.json();
  },

  // Multi-Child Parent Portal
  async getChildren() {
    const res = await fetch(`${API_BASE}/children`);
    return res.json();
  },

  async createChild(data) {
    const res = await fetch(`${API_BASE}/children`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateChild(id, data) {
    const res = await fetch(`${API_BASE}/children/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteChild(id) {
    const res = await fetch(`${API_BASE}/children/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Scholarships Finder
  async getScholarships(category = 'All', stage = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (stage) params.append('stage', stage);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/scholarships${query}`);
    return res.json();
  },

  // Personality & Life Skills
  async getLifeSkills() {
    const res = await fetch(`${API_BASE}/lifeskills`);
    return res.json();
  },

  async submitLifeSkillsDiagnostic(answers) {
    const res = await fetch(`${API_BASE}/lifeskills/diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return res.json();
  },

  // Mentor & Admin Governance
  async getAdminMetrics() {
    const res = await fetch(`${API_BASE}/admin/metrics`);
    return res.json();
  },

  async createAdminBatch(data) {
    const res = await fetch(`${API_BASE}/admin/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`);
    return res.json();
  },

  async updateUserRole(id, role) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  }
};

// Global Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.API = API;
window.showToast = showToast;
