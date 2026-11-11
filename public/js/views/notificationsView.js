/**
 * NOTIFICATIONS CONTROLLER
 * NextStep OS — Real-time alerts, exam deadlines, and academic notifications
 */

const NotificationsView = {
  notifications: [],
  unreadCount: 0,
  activeFilter: 'all',

  async init() {
    this.bindHeaderEvents();
    this.bindDrawerEvents();
    await this.refreshUnreadBadge();
  },

  bindHeaderEvents() {
    const bellBtn = document.getElementById('header-notifications-btn');
    if (!bellBtn) return;

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openDrawer();
    });
  },

  bindDrawerEvents() {
    const modal = document.getElementById('notifications-drawer-modal');
    const closeBtn = document.getElementById('notifications-drawer-close');
    const markAllBtn = document.getElementById('notifications-mark-all-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeDrawer();
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener('click', async () => {
        await this.markAllAsRead();
      });
    }

    // Filter pill clicks
    const filterPills = document.querySelectorAll('.notif-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.activeFilter = pill.getAttribute('data-filter') || 'all';
        this.renderList();
      });
    });
  },

  async openDrawer() {
    const modal = document.getElementById('notifications-drawer-modal');
    if (!modal) return;
    modal.classList.add('active');
    await this.loadNotifications();
  },

  closeDrawer() {
    const modal = document.getElementById('notifications-drawer-modal');
    if (modal) modal.classList.remove('active');
  },

  async refreshUnreadBadge() {
    try {
      const res = await API.getUnreadNotificationCount();
      const count = res.success ? res.unreadCount : 0;
      this.unreadCount = count;
      this.updateBadgeUI(count);
    } catch (err) {
      console.warn('Failed to refresh unread count:', err);
    }
  },

  updateBadgeUI(count) {
    const badge = document.getElementById('header-unread-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  },

  async loadNotifications() {
    const listEl = document.getElementById('notifications-list-container');
    if (listEl) {
      listEl.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;padding:40px;color:var(--text-muted);gap:10px;">
          <div class="loader-spinner" style="width:20px;height:20px;border:2px solid var(--brand-primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
          <span>Loading notifications...</span>
        </div>
      `;
    }

    try {
      const res = await API.getNotifications();
      if (res.success) {
        this.notifications = res.notifications || [];
        this.unreadCount = res.unreadCount || 0;
        this.updateBadgeUI(this.unreadCount);
        this.renderList();
      } else {
        if (listEl) listEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">Failed to load notifications.</div>`;
      }
    } catch (err) {
      if (listEl) listEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">Error loading notifications.</div>`;
    }
  },

  renderList() {
    const listEl = document.getElementById('notifications-list-container');
    if (!listEl) return;

    let items = [...this.notifications];
    if (this.activeFilter === 'unread') {
      items = items.filter(n => !n.isRead);
    } else if (this.activeFilter === 'exam') {
      items = items.filter(n => n.type === 'exam_reminder');
    } else if (this.activeFilter === 'doubt') {
      items = items.filter(n => n.type === 'doubt_resolved');
    } else if (this.activeFilter === 'batch') {
      items = items.filter(n => n.type === 'new_batch');
    }

    const drawerCountEl = document.getElementById('notifications-drawer-count');
    if (drawerCountEl) {
      drawerCountEl.textContent = `${this.unreadCount} unread`;
    }

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:48px 20px;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:12px;">🔕</div>
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:4px;">No notifications here</div>
          <div style="font-size:0.82rem;">You are all caught up with your academic schedule!</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = items.map(n => {
      const timeAgo = this.formatTimeAgo(n.createdAt);
      const isUnread = !n.isRead;
      return `
        <div class="notification-item ${isUnread ? 'unread' : ''}" data-id="${n.id}" style="display:flex;gap:14px;padding:14px 16px;border-bottom:1px solid var(--border-subtle);background:${isUnread ? 'rgba(104,87,245,0.06)' : 'transparent'};position:relative;transition:background 0.2s ease;">
          <div style="font-size:1.6rem;line-height:1;flex-shrink:0;">${n.icon || '🔔'}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
              <h4 style="margin:0;font-size:0.9rem;font-weight:${isUnread ? '700' : '600'};color:var(--text-primary);">${this.escapeHtml(n.title)}</h4>
              <span style="font-size:0.72rem;color:var(--text-muted);white-space:nowrap;margin-left:8px;">${timeAgo}</span>
            </div>
            <p style="margin:0 0 8px 0;font-size:0.82rem;color:var(--text-secondary);line-height:1.4;">${this.escapeHtml(n.message)}</p>
            <div style="display:flex;align-items:center;gap:10px;">
              ${n.link ? `<a href="${n.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding:4px 10px;font-size:0.75rem;text-decoration:none;">Open Official Portal ↗</a>` : ''}
              ${isUnread ? `<button class="btn-text-action" onclick="NotificationsView.markSingleRead('${n.id}')" style="background:none;border:none;color:var(--brand-primary);font-size:0.75rem;font-weight:700;cursor:pointer;padding:0;">Mark as read</button>` : ''}
              <button class="btn-text-action" onclick="NotificationsView.deleteSingle('${n.id}')" style="background:none;border:none;color:var(--text-muted);font-size:0.75rem;cursor:pointer;padding:0;margin-left:auto;" title="Dismiss notification">✕ Dismiss</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  async markSingleRead(id) {
    const res = await API.markNotificationRead(id);
    if (res.success) {
      const item = this.notifications.find(n => n.id === id);
      if (item) item.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.updateBadgeUI(this.unreadCount);
      this.renderList();
    }
  },

  async markAllAsRead() {
    const res = await API.markAllNotificationsRead();
    if (res.success) {
      this.notifications.forEach(n => { n.isRead = true; });
      this.unreadCount = 0;
      this.updateBadgeUI(0);
      this.renderList();
      if (typeof showToast === 'function') {
        showToast('All notifications marked as read', 'success');
      }
    }
  },

  async deleteSingle(id) {
    const res = await API.deleteNotification(id);
    if (res.success) {
      const idx = this.notifications.findIndex(n => n.id === id);
      if (idx !== -1) {
        if (!this.notifications[idx].isRead) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.updateBadgeUI(this.unreadCount);
        }
        this.notifications.splice(idx, 1);
      }
      this.renderList();
    }
  },

  formatTimeAgo(isoString) {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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

window.NotificationsView = NotificationsView;
