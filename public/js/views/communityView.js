/**
 * NEXTSTEP OS - MODERATED ACADEMIC COMMUNITY & DISCUSSION BOARD
 * ==============================================================
 * Peer learning, mentor answers, and subject discussions
 */

const CommunityView = {
  posts: [],
  selectedSubject: 'All',

  async init() {
    await this.fetchPosts();
    this.render();
  },

  async fetchPosts() {
    try {
      const res = await API.getCommunityPosts(this.selectedSubject);
      if (res.success && res.posts) this.posts = res.posts;
    } catch (e) {
      console.warn('Failed to load community posts:', e);
    }
  },

  render() {
    this.renderPostsList();
    this.bindEvents();
  },

  renderPostsList() {
    const container = document.getElementById('community-posts-container');
    if (!container) return;

    if (this.posts.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);">No questions found for this subject. Be the first to ask!</div>`;
      return;
    }

    container.innerHTML = this.posts.map(post => `
      <div class="community-post-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;margin-bottom:20px;">
        <!-- Post Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid var(--brand-primary);" alt="Avatar">
            <div>
              <div style="font-size:0.88rem;font-weight:700;color:var(--text-primary);">${post.authorName}</div>
              <div style="font-size:0.72rem;color:var(--text-muted);">${post.stageTag} • ${post.createdAt}</div>
            </div>
          </div>
          <span style="font-size:0.72rem;font-weight:700;color:var(--brand-secondary);background:rgba(25,198,216,0.1);padding:3px 10px;border-radius:12px;">
            #${post.subject}
          </span>
        </div>

        <!-- Question Title & Content -->
        <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-primary);margin-bottom:8px;line-height:1.4;">
          ${post.title}
        </h3>
        <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">
          ${post.content}
        </p>

        <!-- Verified Answer Callout (if available) -->
        ${post.verifiedAnswer ? `
          <div style="background:rgba(104,87,245,0.06);border-left:4px solid var(--brand-primary);padding:14px 16px;border-radius:0 var(--radius-md) var(--radius-md) 0;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;margin-bottom:4px;">
              <span>🛡️ Verified Answer by ${post.verifiedAnswer.author}</span>
            </div>
            <div style="font-size:0.85rem;color:var(--text-primary);line-height:1.55;">
              ${post.verifiedAnswer.text}
            </div>
          </div>
        ` : ''}

        <!-- Post Footer Actions -->
        <div style="display:flex;align-items:center;gap:16px;border-top:1px solid var(--border-subtle);padding-top:12px;">
          <button style="display:flex;align-items:center;gap:6px;background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);color:var(--text-primary);padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:700;cursor:pointer;" onclick="CommunityView.upvote('${post.id}')">
            <span>▲ Upvote</span>
            <span id="upvotes-count-${post.id}" style="color:var(--brand-primary);">${post.upvotes}</span>
          </button>
          <span style="font-size:0.8rem;color:var(--text-muted);">
            💬 ${post.commentsCount || 0} Replies
          </span>
          <button style="background:none;border:none;color:var(--brand-primary);font-size:0.8rem;font-weight:700;cursor:pointer;margin-left:auto;" onclick="showToast('Reply drawer opened', 'info')">
            Write Answer →
          </button>
        </div>
      </div>
    `).join('');
  },

  async upvote(postId) {
    try {
      const res = await API.upvoteCommunityPost(postId);
      if (res.success) {
        const el = document.getElementById(`upvotes-count-${postId}`);
        if (el) el.textContent = res.upvotes;
        showToast('Upvoted!', 'success');
      }
    } catch (e) {
      showToast('Upvote failed', 'error');
    }
  },

  bindEvents() {
    // Subject filter pills
    const pills = document.querySelectorAll('.community-filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', async (e) => {
        pills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedSubject = e.currentTarget.getAttribute('data-sub') || 'All';
        await this.fetchPosts();
        this.renderPostsList();
      });
    });

    // Create post form
    const form = document.getElementById('community-ask-form');
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('new-post-title')?.value;
        const content = document.getElementById('new-post-content')?.value;
        const subject = document.getElementById('new-post-subject')?.value;

        if (!title || !content) {
          showToast('Title and Question details are required', 'error');
          return;
        }

        try {
          const res = await API.createCommunityPost({ title, content, subject });
          if (res.success) {
            this.posts.unshift(res.post);
            this.renderPostsList();
            form.reset();
            document.getElementById('community-ask-modal')?.classList.remove('active');
            showToast('Question posted to community!', 'success');
          }
        } catch (err) {
          showToast('Failed to post question', 'error');
        }
      };
    }
  }
};

window.CommunityView = CommunityView;

