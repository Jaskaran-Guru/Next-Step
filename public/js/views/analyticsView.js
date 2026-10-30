/**
 * STUDENT PERFORMANCE & ANALYTICS VIEW CONTROLLER
 * Real-time metrics computed across user's tests, lectures, and DPPs from MongoDB
 */

const AnalyticsView = {
  stats: null,

  async init() {
    await this.loadAnalytics();
  },

  async loadAnalytics() {
    try {
      const res = await API.getAnalytics();
      if (res.success) {
        this.stats = res.stats;
        this.renderStatsGrid();
        this.renderRecentTests(res.recentTests || []);
      }
    } catch (err) {
      console.error('Failed to load student analytics:', err);
    }
  },

  renderStatsGrid() {
    const grid = document.getElementById('analytics-stats-grid');
    if (!grid || !this.stats) return;

    grid.innerHTML = `
      <div class="scorecard-stat-box">
        <div class="stat-box-val" style="color: var(--primary-light);">${this.stats.studyHours}h</div>
        <div class="stat-box-lbl">Total Watch Time</div>
      </div>
      <div class="scorecard-stat-box">
        <div class="stat-box-val" style="color: #f97316;">🔥 ${this.stats.streakDays}</div>
        <div class="stat-box-lbl">Day Active Streak</div>
      </div>
      <div class="scorecard-stat-box">
        <div class="stat-box-val" style="color: var(--accent-amber);">AIR ${this.stats.projectedRank}</div>
        <div class="stat-box-lbl">Predicted All-India Rank</div>
      </div>
      <div class="scorecard-stat-box">
        <div class="stat-box-val" style="color: var(--accent-emerald);">${this.stats.avgTestAccuracy}%</div>
        <div class="stat-box-lbl">Mock Test Accuracy</div>
      </div>
    `;
  },

  renderRecentTests(recentTests) {
    const container = document.getElementById('analytics-recent-tests-table');
    if (!container) return;

    if (recentTests.length === 0) {
      container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 16px 0;">No test attempts recorded yet. Attempt an AITS Mock Test to benchmark your rank!</div>`;
      return;
    }

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); text-align: left;">
            <th style="padding: 10px 14px;">TEST TITLE</th>
            <th style="padding: 10px 14px;">SCORE</th>
            <th style="padding: 10px 14px;">PERCENTILE</th>
            <th style="padding: 10px 14px;">AIR RANK</th>
            <th style="padding: 10px 14px;">DATE</th>
          </tr>
        </thead>
        <tbody>
          ${recentTests.map(t => `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.04);">
              <td style="padding: 12px 14px; font-weight: 700; color: #fff;">${t.testId?.title || 'JEE Mains Simulator'}</td>
              <td style="padding: 12px 14px; color: var(--accent-emerald); font-weight: 700;">${t.totalScore} / ${t.maxMarks}</td>
              <td style="padding: 12px 14px; color: var(--accent-cyan); font-weight: 700;">${t.percentile}%</td>
              <td style="padding: 12px 14px; color: var(--accent-amber); font-weight: 700;">AIR ${t.allIndiaRank}</td>
              <td style="padding: 12px 14px; color: var(--text-muted);">${new Date(t.submittedAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
};

window.AnalyticsView = AnalyticsView;
