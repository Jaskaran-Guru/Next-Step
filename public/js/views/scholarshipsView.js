/**
 * NEXTSTEP OS - SCHOLARSHIPS & FINANCIAL AID FINDER
 * ==================================================
 * Direct access to central, state, and foundation scholarships
 */

const ScholarshipsView = {
  scholarships: [],
  selectedCategory: 'All',

  async init() {
    await this.fetchScholarships();
    this.render();
  },

  async fetchScholarships() {
    try {
      const res = await API.getScholarships(this.selectedCategory);
      if (res.success && res.data) {
        this.scholarships = res.data;
      }
    } catch (e) {
      console.warn('Failed to fetch scholarships:', e);
    }
  },

  render() {
    this.renderGrid();
    this.bindEvents();
  },

  renderGrid() {
    const container = document.getElementById('scholarships-grid-container');
    if (!container) return;

    if (this.scholarships.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No scholarships found for this filter.</div>`;
      return;
    }

    container.innerHTML = this.scholarships.map(item => `
      <div class="scholarship-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s ease;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px;">
            <span style="font-size:0.7rem;font-weight:700;color:var(--brand-secondary);background:rgba(25,198,216,0.1);padding:4px 10px;border-radius:20px;text-transform:uppercase;">
              ${item.category}
            </span>
            <span style="font-size:0.72rem;color:var(--text-muted);font-weight:600;">
              🗓️ ${item.applicationWindow}
            </span>
          </div>

          <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-primary);margin-bottom:6px;">
            ${item.title}
          </h3>

          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:14px;">
            🏛️ Provider: <strong>${item.provider}</strong>
          </div>

          <div style="background:rgba(34,197,139,0.08);border:1px solid rgba(34,197,139,0.25);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;">
            <div style="font-size:0.7rem;font-weight:700;color:var(--status-success);text-transform:uppercase;">Grant / Scholarship Amount:</div>
            <div style="font-size:0.95rem;font-weight:800;color:var(--status-success);margin-top:2px;">
              ${item.amount}
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Eligibility Criteria:</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">${item.eligibility}</div>
          </div>

          <div style="margin-bottom:16px;">
            <ul style="padding-left:18px;margin:0;font-size:0.78rem;color:var(--text-muted);line-height:1.4;">
              ${(item.highlights || []).map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:8px;">
          <a href="${item.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex:1;text-align:center;font-size:0.82rem;padding:8px 14px;text-decoration:none;">
            Official Portal Link ↗
          </a>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    const pills = document.querySelectorAll('.scholarship-filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', async (e) => {
        pills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedCategory = e.currentTarget.getAttribute('data-cat') || 'All';
        await this.fetchScholarships();
        this.renderGrid();
      });
    });
  }
};

window.ScholarshipsView = ScholarshipsView;

