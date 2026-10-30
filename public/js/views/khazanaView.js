/**
 * KHAZANA & STUDY MATERIALS VIEW CONTROLLER
 * Filter and download revision sheets, mind maps, and NCERT formulas from MongoDB
 */

const KhazanaView = {
  materials: [],

  async init() {
    this.bindFilterEvents();
    await this.loadMaterials();
  },

  bindFilterEvents() {
    const filterBar = document.getElementById('khazana-filter-bar');
    filterBar?.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', async () => {
        filterBar.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        await this.loadMaterials(cat);
      });
    });
  },

  async loadMaterials(category = 'All') {
    try {
      const res = await API.getMaterials(category);
      if (res.success) {
        this.materials = res.materials;
        this.renderMaterials();
      }
    } catch (err) {
      console.error('Failed to load study materials:', err);
    }
  },

  renderMaterials() {
    const container = document.getElementById('khazana-materials-grid');
    if (!container) return;

    if (this.materials.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No materials found in this category.</div>`;
      return;
    }

    container.innerHTML = this.materials.map(mat => `
      <div class="batch-card" data-mat-id="${mat._id}">
        <div class="batch-body">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span class="batch-badge" style="position: static;">${mat.category}</span>
            <span style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700;">${mat.subjectName}</span>
          </div>

          <h3 class="batch-title" style="font-size: 1.05rem; margin-bottom: 8px;">${mat.title}</h3>
          
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 16px;">
            Chapter: ${mat.chapterName} • ${mat.pagesCount} Pages • ${mat.fileSizeMb}
          </div>

          <div class="batch-footer">
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              📥 ${(mat.downloadsCount || 12000).toLocaleString()} downloads
            </span>
            <button class="btn btn-secondary" onclick="KhazanaView.downloadFile('${mat._id}', '${mat.downloadUrl}')" style="padding: 6px 14px; font-size: 0.8rem;">
              <i data-lucide="download"></i> Download PDF
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  async downloadFile(materialId, url) {
    try {
      await API.recordDownload(materialId);
      showToast('Downloading study material... 📥', 'success');
      window.open(url, '_blank');
      await this.loadMaterials();
    } catch (err) {}
  }
};

window.KhazanaView = KhazanaView;
