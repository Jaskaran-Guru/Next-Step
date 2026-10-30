/**
 * NEXTSTEP OS - MENTOR & ADMIN GOVERNANCE CENTRE
 * ===============================================
 * Course creation, student telemetry, role elevation, and platform monitoring
 */

const AdminView = {
  metrics: null,
  users: [],

  async init() {
    await Promise.all([this.fetchMetrics(), this.fetchUsers()]);
    this.render();
  },

  async fetchMetrics() {
    try {
      const res = await API.getAdminMetrics();
      if (res.success) this.metrics = res.metrics;
    } catch (e) {
      console.warn('Metrics fetch error:', e);
    }
  },

  async fetchUsers() {
    try {
      const res = await API.getAdminUsers();
      if (res.success) this.users = res.users;
    } catch (e) {
      console.warn('Users fetch error:', e);
    }
  },

  render() {
    this.renderMetricsCards();
    this.renderUsersTable();
    this.bindEvents();
  },

  renderMetricsCards() {
    const container = document.getElementById('admin-metrics-grid');
    if (!container) return;

    const m = this.metrics || { totalUsers: 1248, totalBatches: 12, resolvedDoubts: 312, totalTests: 8 };

    container.innerHTML = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Registered Learners</div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--brand-primary);margin-top:4px;">${m.totalUsers}</div>
        <div style="font-size:0.72rem;color:var(--status-success);margin-top:2px;">↑ Active across 7 lifecycle stages</div>
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Active Batches & Courses</div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--brand-secondary);margin-top:4px;">${m.totalBatches}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Curriculum & Foundation tracks</div>
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">AI Doubts Resolved</div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--status-success);margin-top:4px;">${m.resolvedDoubts}</div>
        <div style="font-size:0.72rem;color:var(--brand-primary);margin-top:2px;">Powered by Google Gemini</div>
      </div>

      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">CBT Mock Tests Live</div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--status-warning);margin-top:4px;">${m.totalTests}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">NTA & Board simulated exams</div>
      </div>
    `;
  },

  renderUsersTable() {
    const tbody = document.getElementById('admin-users-table-body');
    if (!tbody) return;

    if (this.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-muted);">No users loaded.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.users.map(u => `
      <tr style="border-bottom:1px solid var(--border-subtle);">
        <td style="padding:12px;font-weight:700;color:var(--text-primary);">${u.name || 'Learner'}</td>
        <td style="padding:12px;font-size:0.85rem;color:var(--text-secondary);">${u.email}</td>
        <td style="padding:12px;font-size:0.8rem;text-transform:uppercase;color:var(--brand-secondary);">${(u.lifeStage || 'entrance_prep').replace(/_/g, ' ')}</td>
        <td style="padding:12px;">
          <select onchange="AdminView.handleRoleChange('${u._id}', this.value)" style="padding:4px 8px;font-size:0.78rem;background:var(--bg-surface-secondary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:4px;">
            <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
            <option value="parent" ${u.role === 'parent' ? 'selected' : ''}>Parent</option>
            <option value="mentor" ${u.role === 'mentor' ? 'selected' : ''}>Teacher / Mentor</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td style="padding:12px;font-size:0.8rem;color:var(--text-muted);">${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
      </tr>
    `).join('');
  },

  async handleRoleChange(userId, newRole) {
    try {
      const res = await API.updateUserRole(userId, newRole);
      if (res.success) {
        showToast(`Role updated to ${newRole}!`, 'success');
      }
    } catch (e) {
      showToast('Role update failed', 'error');
    }
  },

  bindEvents() {
    const form = document.getElementById('admin-create-batch-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('new-batch-title')?.value;
        const examCategory = document.getElementById('new-batch-category')?.value;
        const price = document.getElementById('new-batch-price')?.value;
        const faculty = document.getElementById('new-batch-faculty')?.value;
        const tagline = document.getElementById('new-batch-tagline')?.value;

        if (!title || !examCategory) {
          showToast('Title and Category are required', 'error');
          return;
        }

        try {
          const res = await API.createAdminBatch({ title, examCategory, price, faculty, tagline });
          if (res.success) {
            showToast(`Batch "${title}" published live!`, 'success');
            form.reset();
            await this.fetchMetrics();
            this.renderMetricsCards();
            if (window.BatchesView) window.BatchesView.init();
          }
        } catch (err) {
          showToast('Failed to create batch', 'error');
        }
      };
    }
  }
};

window.AdminView = AdminView;
