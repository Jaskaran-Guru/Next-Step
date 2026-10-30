/**
 * BATCHES VIEW CONTROLLER
 * Handles Explore Batches & My Study Room with real-time MongoDB enrollment
 */

const BatchesView = {
  batches: [],

  async init() {
    this.bindFilterEvents();
    await this.loadBatches();
  },

  bindFilterEvents() {
    const filterBar = document.getElementById('batch-filter-bar');
    if (!filterBar) return;

    filterBar.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        filterBar.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        AppState.currentCategoryFilter = category;
        await this.loadBatches(category);
      });
    });
  },

  async loadBatches(category = 'All') {
    try {
      const res = await API.getBatches(category);
      if (res.success) {
        this.batches = res.batches;
        this.renderBatchesGrid();
        this.renderMyBatchesGrid();
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
      showToast('Failed to load batches from server', 'error');
    }
  },

  renderBatchesGrid() {
    const container = document.getElementById('batches-grid-container');
    if (!container) return;

    if (this.batches.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No batches found for this category.</div>`;
      return;
    }

    const enrolledIds = (AppState.currentUser?.enrolledBatches || []).map(b => (b._id || b).toString());

    container.innerHTML = this.batches.map(batch => {
      const isEnrolled = enrolledIds.includes(batch._id.toString());
      const facultyAvatars = (batch.faculty || []).slice(0, 3).map(f => `
        <img src="${f.avatar}" class="faculty-avatar-mini" alt="${f.name}" title="${f.name} (${f.subject})">
      `).join('');

      return `
        <div class="batch-card" data-batch-id="${batch._id}">
          <div class="batch-thumbnail">
            <img src="${batch.bannerImage}" alt="${batch.title}">
            <span class="batch-badge">${batch.badge || 'BESTSELLER'}</span>
            <span class="batch-rating">★ ${batch.rating || 4.9}</span>
          </div>

          <div class="batch-body">
            <div class="batch-tagline">${batch.tagline || 'PW Flagship'}</div>
            <h3 class="batch-title">${batch.title}</h3>

            <div class="faculty-row">
              <div class="faculty-avatars">${facultyAvatars}</div>
              <span class="faculty-text">${(batch.faculty || []).length} Kota Educators</span>
            </div>

            <ul class="batch-features">
              ${(batch.features || []).slice(0, 3).map(feat => `
                <li><i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> ${feat}</li>
              `).join('')}
            </ul>

            <div class="batch-footer">
              <div class="batch-pricing">
                <span class="current-price">₹${batch.price}</span>
                <span class="original-price">₹${batch.originalPrice} (${batch.discountPercentage}% OFF)</span>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn ${isEnrolled ? 'btn-enrolled' : 'btn-primary'}" onclick="BatchesView.handleEnroll('${batch._id}')">
                  ${isEnrolled ? 'Enrolled ✓' : 'Enroll Now'}
                </button>
                <button class="btn btn-secondary" onclick="BatchesView.openBatchClassroom('${batch._id}')" title="Enter Classroom">
                  <i data-lucide="play-circle" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  renderMyBatchesGrid() {
    const container = document.getElementById('my-batches-grid-container');
    if (!container) return;

    const enrolledIds = (AppState.currentUser?.enrolledBatches || []).map(b => (b._id || b).toString());
    const myBatches = this.batches.filter(b => enrolledIds.includes(b._id.toString()));

    if (myBatches.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 12px;">📚</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">You haven't enrolled in any batch yet!</h3>
          <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px auto;">Explore Lakshya JEE, Yakeen NEET, or Arjuna batches and click "Enroll Now" to start your prep.</p>
          <button class="btn btn-primary" onclick="window.switchView('batches')">Explore All Batches</button>
        </div>
      `;
      return;
    }

    container.innerHTML = myBatches.map(batch => `
      <div class="batch-card" data-batch-id="${batch._id}">
        <div class="batch-thumbnail">
          <img src="${batch.bannerImage}" alt="${batch.title}">
          <span class="batch-badge" style="background: rgba(16, 185, 129, 0.9); color: #fff;">ACTIVE ENROLLMENT</span>
        </div>
        <div class="batch-body">
          <div class="batch-tagline">${batch.classLevel} • ${batch.language}</div>
          <h3 class="batch-title">${batch.title}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">Validity: ${batch.validity}</p>
          <div class="batch-footer">
            <button class="btn btn-primary" style="width: 100%;" onclick="BatchesView.openBatchClassroom('${batch._id}')">
              <i data-lucide="play"></i> Resume Learning
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async handleEnroll(batchId) {
    try {
      const res = await API.toggleEnrollBatch(batchId);
      if (res.success) {
        showToast(res.message, res.isEnrolled ? 'success' : 'info');
        await AppState.initUser();
        this.renderBatchesGrid();
        this.renderMyBatchesGrid();
      }
    } catch (err) {
      showToast('Enrollment failed', 'error');
    }
  },

  async openBatchClassroom(batchId) {
    try {
      const res = await API.getBatchDetails(batchId);
      if (res.success && res.lectures && res.lectures.length > 0) {
        AppState.activeBatch = res.batch;
        ClassroomView.currentLectures = res.lectures;
        ClassroomView.currentChapters = res.chapters;
        await ClassroomView.loadLecture(res.lectures[0]._id);
        window.switchView('classroom');
      } else {
        showToast('No active lectures found in this batch yet', 'info');
      }
    } catch (err) {
      showToast('Could not load batch classroom', 'error');
    }
  }
};

window.BatchesView = BatchesView;
