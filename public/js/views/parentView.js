/**
 * NEXTSTEP OS - PARENT PORTAL & MULTI-CHILD MANAGEMENT
 * ====================================================
 * Allows parents to:
 *   1. Manage profiles for multiple children
 *   2. Track developmental milestones by age bracket
 *   3. Access weekly sensory & cognitive learning planners
 *   4. Consult the AI Pediatric & Educational Parent Advisor
 */

const ParentView = {
  children: [],
  activeChildId: null,

  async init() {
    await this.fetchChildren();
    this.render();
  },

  async fetchChildren() {
    try {
      const res = await API.getChildren();
      if (res.success && res.children) {
        this.children = res.children;
        if (!this.activeChildId && this.children.length > 0) {
          this.activeChildId = this.children[0]._id;
        }
      }
    } catch (e) {
      console.warn('Failed to load children profiles:', e);
    }
  },

  getActiveChild() {
    return this.children.find(c => c._id === this.activeChildId) || this.children[0] || null;
  },

  render() {
    this.renderChildSelector();
    this.renderChildOverview();
    this.renderMilestones();
    this.bindEvents();
  },

  renderChildSelector() {
    const container = document.getElementById('parent-child-tabs-container');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        ${this.children.map(child => `
          <button class="child-tab-pill ${child._id === this.activeChildId ? 'active' : ''}" 
                  style="display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:var(--radius-full);border:1px solid ${child._id === this.activeChildId ? 'var(--brand-primary)' : 'var(--border-color)'};background:${child._id === this.activeChildId ? 'rgba(104,87,245,0.12)' : 'var(--bg-surface)'};color:${child._id === this.activeChildId ? 'var(--brand-primary)' : 'var(--text-secondary)'};font-weight:700;font-size:0.85rem;cursor:pointer;"
                  onclick="ParentView.selectChild('${child._id}')">
            <span>${child.age <= 4 ? '👶' : child.age <= 10 ? '🎒' : '🧭'}</span>
            <span>${child.name} (${child.age} Yrs)</span>
          </button>
        `).join('')}
        <button class="btn btn-outline" style="padding:8px 14px;font-size:0.8rem;border-radius:var(--radius-full);" onclick="ParentView.openAddChildModal()">
          + Add Another Child
        </button>
      </div>
    `;
  },

  renderChildOverview() {
    const child = this.getActiveChild();
    const overviewEl = document.getElementById('parent-active-child-card');
    if (!overviewEl || !child) return;

    const achievedCount = (child.milestones || []).filter(m => m.achieved).length;
    const totalCount = (child.milestones || []).length;
    const progressPercent = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

    overviewEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);">${child.name}</h2>
            <span style="font-size:0.75rem;font-weight:700;background:rgba(25,198,216,0.1);color:var(--brand-secondary);padding:3px 10px;border-radius:20px;">
              ${child.currentClass || 'Early Learning'}
            </span>
          </div>
          <p style="font-size:0.88rem;color:var(--text-secondary);">
            Age: <strong>${child.age} Years</strong> • Life Stage: <strong>${child.lifeStage.replace(/_/g, ' ').toUpperCase()}</strong>
          </p>
          <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
            ${(child.interests || []).map(i => `
              <span style="font-size:0.72rem;background:var(--bg-surface-secondary);color:var(--text-primary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">
                🎨 ${i}
              </span>
            `).join('')}
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Milestone Progress</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--status-success);">${achievedCount} / ${totalCount}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);">${progressPercent}% Completed</div>
        </div>
      </div>

      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="StageEngine.applyStage('${child.lifeStage}')" style="font-size:0.82rem;padding:8px 16px;">
          🚀 Switch Entire App to ${child.name}'s Stage
        </button>
        <button class="btn btn-outline" onclick="ParentView.askAdviceForChild()" style="font-size:0.82rem;padding:8px 16px;">
          💬 Ask AI Parent Advisor
        </button>
      </div>
    `;
  },

  renderMilestones() {
    const child = this.getActiveChild();
    const listEl = document.getElementById('parent-milestones-list');
    if (!listEl || !child) return;

    if (!child.milestones || child.milestones.length === 0) {
      listEl.innerHTML = `<div style="color:var(--text-muted);padding:14px;">No milestones configured for this stage yet.</div>`;
      return;
    }

    listEl.innerHTML = child.milestones.map((m, idx) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);margin-bottom:8px;transition:background 0.2s ease;">
        <div style="display:flex;align-items:center;gap:12px;">
          <input type="checkbox" id="milestone-chk-${idx}" ${m.achieved ? 'checked' : ''} 
                 style="width:18px;height:18px;accent-color:var(--status-success);cursor:pointer;"
                 onchange="ParentView.toggleMilestone(${idx}, this.checked)">
          <div>
            <div style="font-size:0.88rem;font-weight:600;color:${m.achieved ? 'var(--text-muted)' : 'var(--text-primary)'};text-decoration:${m.achieved ? 'line-through' : 'none'};">
              ${m.title}
            </div>
            <div style="font-size:0.72rem;color:var(--text-muted);">${m.category}</div>
          </div>
        </div>
        ${m.achieved ? `<span style="font-size:0.72rem;font-weight:700;color:var(--status-success);background:rgba(34,197,139,0.1);padding:3px 8px;border-radius:12px;">Achieved</span>` : `<span style="font-size:0.72rem;color:var(--text-muted);">In Progress</span>`}
      </div>
    `).join('');
  },

  async toggleMilestone(index, achieved) {
    const child = this.getActiveChild();
    if (!child) return;

    try {
      const res = await API.updateChild(child._id, { milestoneIndex: index, milestoneAchieved: achieved });
      if (res.success) {
        child.milestones = res.child.milestones;
        this.renderChildOverview();
        this.renderMilestones();
        showToast(achieved ? 'Milestone marked as achieved! 🎉' : 'Milestone updated', 'success');
      }
    } catch (e) {
      showToast('Failed to update milestone', 'error');
    }
  },

  selectChild(id) {
    this.activeChildId = id;
    this.render();
  },

  openAddChildModal() {
    const modal = document.getElementById('add-child-modal');
    if (modal) modal.classList.add('active');
  },

  async handleAddChildSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('new-child-name')?.value;
    const age = document.getElementById('new-child-age')?.value;
    const interests = document.getElementById('new-child-interests')?.value;

    if (!name || !age) {
      showToast('Name and age are required', 'error');
      return;
    }

    try {
      const res = await API.createChild({ name, age, interests });
      if (res.success) {
        showToast(`Profile for ${name} created!`, 'success');
        document.getElementById('add-child-modal')?.classList.remove('active');
        await this.fetchChildren();
        this.activeChildId = res.child._id;
        this.render();
      }
    } catch (err) {
      showToast('Failed to add child profile', 'error');
    }
  },

  askAdviceForChild() {
    const child = this.getActiveChild();
    if (!child) return;
    if (window.UniversalSearch) {
      window.UniversalSearch.openModal(`What developmental activities and nutrition guidelines are best for my ${child.age}-year-old child (${child.name})?`);
    }
  },

  bindEvents() {
    const form = document.getElementById('add-child-form');
    if (form) {
      form.onsubmit = (e) => this.handleAddChildSubmit(e);
    }
  }
};

window.ParentView = ParentView;
