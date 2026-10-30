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
