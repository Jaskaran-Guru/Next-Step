/**
 * BOOKMARKS CONTROLLER & MANAGER
 * NextStep OS — Save lectures, careers, and scholarships for quick revision
 */

const BookmarksView = {
  bookmarks: [],
  activeFilter: 'all',

  async init() {
    this.bindHeaderEvents();
    this.bindModalEvents();
    await this.refreshBookmarksCount();
  },

  bindHeaderEvents() {
    const btn = document.getElementById('header-bookmarks-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openModal();
    });
  },

  bindModalEvents() {
    const modal = document.getElementById('bookmarks-modal');
    const closeBtn = document.getElementById('bookmarks-modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    // Filter pill clicks
    const filterPills = document.querySelectorAll('.bookmark-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeFilter = pill.getAttribute('data-filter') || 'all';
        this.renderList();
      });
    });
  },

  async openModal() {
    const modal = document.getElementById('bookmarks-modal');
    if (!modal) return;
    modal.classList.add('active');
    await this.loadBookmarks();
  },

  closeModal() {
    const modal = document.getElementById('bookmarks-modal');
    if (modal) modal.classList.remove('active');
  },

  async refreshBookmarksCount() {
    try {
      const res = await API.getBookmarks();
      const count = res.success ? res.total : 0;
      this.updateBadgeUI(count);
    } catch (err) {
      console.warn('Failed to refresh bookmarks count:', err);
    }
  },

  updateBadgeUI(count) {
    const badge = document.getElementById('header-bookmarks-count');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  },

  async loadBookmarks() {
    const listEl = document.getElementById('bookmarks-list-container');
    if (listEl) {
      listEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;padding:40px;color:var(--text-muted);gap:10px;">
          <div class="loader-spinner" style="width:20px;height:20px;border:2px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
          <span>Loading saved items...</span>
        </div>
      `;
    }

    try {
      const res = await API.getBookmarks();
      if (res.success) {
        this.bookmarks = res.bookmarks || [];
        this.updateBadgeUI(this.bookmarks.length);
        this.renderList();
      } else {
        if (listEl) listEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">Failed to load bookmarks.</div>`;
      }
    } catch (err) {
      if (listEl) listEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">Error loading bookmarks.</div>`;
    }
  },

  renderList() {
    const listEl = document.getElementById('bookmarks-list-container');
    if (!listEl) return;

    let items = [...this.bookmarks];
    if (this.activeFilter !== 'all') {
      items = items.filter(b => b.type === this.activeFilter);
    }

    const modalCountEl = document.getElementById('bookmarks-modal-count');
    if (modalCountEl) {
      modalCountEl.textContent = `${items.length} saved`;
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:48px 20px;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:12px;">📑</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px;">No saved items yet</div>
          <div style="font-size:0.82rem;">Click the bookmark icon on any lecture, career profile, or scholarship to save it here for fast access.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map(b => {
      const badgeColor = b.type === 'lecture' ? 'var(--brand-primary)' : b.type === 'career' ? 'var(--brand-secondary)' : '#F5B942';
      const typeLabel = b.type === 'lecture' ? 'Lecture' : b.type === 'career' ? 'Career Profile' : 'Scholarship';

      return `
        <div class="bookmark-item" data-id="${b.id}" style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid var(--border-subtle);transition:background 0.2s ease;">
          <div style="font-size:1.6rem;line-height:1;flex-shrink:0;">${b.icon || '🔖'}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-size:0.68rem;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:12px;background:rgba(104,87,245,0.12);color:${badgeColor};">${typeLabel}</span>
            </div>
            <h4 style="margin:0 0 2px 0;font-size:0.9rem;font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this.escapeHtml(b.title)}</h4>
            <div style="font-size:0.75rem;color:var(--text-muted);">${this.escapeHtml(b.subtitle || '')}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <button class="btn btn-outline" onclick="BookmarksView.openItem('${b.type}', '${b.refId}')" style="padding:5px 12px;font-size:0.78rem;font-weight:700;">Open →</button>
            <button class="btn-text-action" onclick="BookmarksView.removeItem('${b.id}')" style="background:none;border:none;color:var(--text-muted);font-size:1.1rem;cursor:pointer;padding:4px 8px;" title="Remove bookmark">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  },

  async removeItem(id) {
    const res = await API.removeBookmark(id);
    if (res.success) {
      this.bookmarks = this.bookmarks.filter(b => b.id !== id);
      this.updateBadgeUI(this.bookmarks.length);
      this.renderList();
      if (typeof showToast === 'function') {
        showToast('Bookmark removed', 'info');
      }
    }
  },

  openItem(type, refId) {
    this.closeModal();
    if (type === 'lecture') {
      if (typeof window.switchView === 'function') {
        window.switchView('classroom');
      }
      if (window.ClassroomView && typeof window.ClassroomView.loadLecture === 'function') {
        window.ClassroomView.loadLecture(refId);
      }
    } else if (type === 'career') {
      if (typeof window.switchView === 'function') {
        window.switchView('careers');
      }
      if (window.CareerView && typeof window.CareerView.openCareerDetails === 'function') {
        window.CareerView.openCareerDetails(refId);
      }
    } else if (type === 'scholarship') {
      if (typeof window.switchView === 'function') {
        window.switchView('scholarships');
      }
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }
};

// Global Bookmark Toggle Helper for Cards
const BookmarksManager = {
  async toggleBookmark(type, refId, title, subtitle, icon, url) {
    try {
      const check = await API.checkBookmark(type, refId);
      if (check.isBookmarked) {
        // Remove it
        await API.removeBookmarkByRef(type, refId);
        if (typeof showToast === 'function') {
          showToast(`Removed "${title}" from bookmarks`, 'info');
        }
      } else {
        // Add it
        await API.addBookmark({ type, refId, title, subtitle, icon, url });
        if (typeof showToast === 'function') {
          showToast(`Saved "${title}" to bookmarks`, 'success');
        }
      }
      // Refresh count
      if (window.BookmarksView) {
        await window.BookmarksView.refreshBookmarksCount();
      }
      // Re-render button state if caller provided a toggle target
      const btn = document.querySelector(`.bookmark-toggle-btn[data-ref="${refId}"]`);
      if (btn) {
        btn.classList.toggle('bookmarked', !check.isBookmarked);
        btn.innerHTML = !check.isBookmarked ? '🔖 Saved' : '🔖 Save';
      }
    } catch (err) {
      console.warn('Bookmark toggle error:', err);
    }
  }
};

window.BookmarksView = BookmarksView;
window.BookmarksManager = BookmarksManager;
