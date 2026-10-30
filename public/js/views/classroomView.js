/**
 * CLASSROOM & VIDEO PLAYER VIEW CONTROLLER
 * Real-time video playback, watch progress tracking, and timestamped notes synced to MongoDB
 */

const ClassroomView = {
  currentLecture: null,
  currentLectures: [],
  currentChapters: [],
  currentNotes: [],
  videoEl: null,
  progressInterval: null,

  init() {
    this.videoEl = document.getElementById('main-video-element');
    this.bindPlayerEvents();
    this.bindDrawerEvents();
  },

  bindPlayerEvents() {
    if (!this.videoEl) return;

    const playBtn = document.getElementById('ctrl-play-btn');
    const playIcon = document.getElementById('play-icon');
    const rewindBtn = document.getElementById('ctrl-rewind-btn');
    const forwardBtn = document.getElementById('ctrl-forward-btn');
    const timelineBar = document.getElementById('video-timeline-bar');
    const timelineProgress = document.getElementById('video-timeline-progress');
    const currentTimeText = document.getElementById('current-time-text');
    const durationTimeText = document.getElementById('duration-time-text');
    const speedSelect = document.getElementById('video-speed-select');
    const fullscreenBtn = document.getElementById('ctrl-fullscreen-btn');

    // Play/Pause toggle
    playBtn.addEventListener('click', () => {
      if (this.videoEl.paused) {
        this.videoEl.play();
        playIcon.setAttribute('data-lucide', 'pause');
      } else {
        this.videoEl.pause();
        playIcon.setAttribute('data-lucide', 'play');
        this.saveCurrentProgress();
      }
      if (window.lucide) window.lucide.createIcons();
    });

    // Rewind 10s
    rewindBtn.addEventListener('click', () => {
      this.videoEl.currentTime = Math.max(0, this.videoEl.currentTime - 10);
    });

    // Forward 10s
    forwardBtn.addEventListener('click', () => {
      this.videoEl.currentTime = Math.min(this.videoEl.duration, this.videoEl.currentTime + 10);
    });

    // Time update & timeline scrub
    this.videoEl.addEventListener('timeupdate', () => {
      const cur = this.videoEl.currentTime || 0;
      const dur = this.videoEl.duration || 1;
      const pct = (cur / dur) * 100;
      timelineProgress.style.width = `${pct}%`;
      currentTimeText.textContent = this.formatTime(cur);

      // Update active timestamp tag in notes box
      const noteTimeTag = document.getElementById('note-active-timestamp');
      if (noteTimeTag) noteTimeTag.textContent = this.formatTime(cur);
    });

    this.videoEl.addEventListener('loadedmetadata', () => {
      durationTimeText.textContent = this.formatTime(this.videoEl.duration);
    });

    // Seek on timeline click
    timelineBar.addEventListener('click', (e) => {
      const rect = timelineBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      this.videoEl.currentTime = pct * this.videoEl.duration;
    });

    // Speed change
    speedSelect.addEventListener('change', (e) => {
      this.videoEl.playbackRate = parseFloat(e.target.value);
    });

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
      const container = document.querySelector('.player-container');
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Save progress periodically every 15 seconds
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (!this.videoEl.paused && this.currentLecture) {
        this.saveCurrentProgress();
      }
    }, 15000);
  },

  bindDrawerEvents() {
    // Drawer tabs
    const tabLectures = document.getElementById('tab-drawer-lectures');
    const tabNotes = document.getElementById('tab-drawer-notes');
    const viewLectures = document.getElementById('drawer-view-lectures');
    const viewNotes = document.getElementById('drawer-view-notes');

    tabLectures.addEventListener('click', () => {
      tabLectures.classList.add('active');
      tabNotes.classList.remove('active');
      viewLectures.style.display = 'block';
      viewNotes.style.display = 'none';
    });

    tabNotes.addEventListener('click', () => {
      tabNotes.classList.add('active');
      tabLectures.classList.remove('active');
      viewLectures.style.display = 'none';
      viewNotes.style.display = 'block';
    });

    // Save note button
    const saveNoteBtn = document.getElementById('save-note-btn');
    const noteTextarea = document.getElementById('new-note-textarea');

    saveNoteBtn.addEventListener('click', async () => {
      if (!this.currentLecture) return;
      const text = noteTextarea.value.trim();
      if (!text) {
        showToast('Please type a note first', 'error');
        return;
      }

      const curSec = Math.floor(this.videoEl.currentTime || 0);
      const formatted = this.formatTime(curSec);

      try {
        const res = await API.addNote(this.currentLecture._id, {
          timestampSeconds: curSec,
          timestampFormatted: formatted,
          noteText: text
        });

        if (res.success && res.note) {
          this.currentNotes.push(res.note);
          this.renderSavedNotes();
          noteTextarea.value = '';
          showToast(`Note saved at ${formatted} in MongoDB! 📝`, 'success');
        }
      } catch (err) {
        showToast('Failed to save note', 'error');
      }
    });
  },

  async loadLecture(lectureId) {
    try {
      const res = await API.getLectureDetails(lectureId);
      if (res.success && res.lecture) {
        this.currentLecture = res.lecture;
        this.currentNotes = res.notes || [];

        // Update video source
        if (this.videoEl) {
          this.videoEl.src = res.lecture.videoUrl;
          if (res.progress && res.progress.progressSeconds > 10) {
            this.videoEl.currentTime = res.progress.progressSeconds;
          }
        }

        // Update Meta UI
        document.getElementById('current-lecture-title').textContent = res.lecture.title;
        document.getElementById('current-lecture-description').textContent = res.lecture.description;
        document.getElementById('current-lecture-faculty-name').textContent = res.lecture.facultyName || 'Alakh Pandey Sir';

        // Render drawer items
        this.renderLecturesList();
        this.renderSavedNotes();

        // Also fetch linked DPP for DPP tab
        await DppView.loadDppForLecture(lectureId);
      }
    } catch (err) {
      console.error('Error loading lecture:', err);
    }
  },

  renderLecturesList() {
    const container = document.getElementById('classroom-lectures-container');
    if (!container) return;

    if (this.currentLectures.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No lectures in this chapter yet.</div>`;
      return;
    }

    container.innerHTML = this.currentLectures.map((lec, idx) => {
      const isActive = this.currentLecture && this.currentLecture._id === lec._id;
      return `
        <div class="lecture-item ${isActive ? 'active' : ''}" onclick="ClassroomView.loadLecture('${lec._id}')">
          <div class="lecture-index">${idx + 1}</div>
          <div class="lecture-item-info">
            <div class="lecture-item-title">${lec.title}</div>
            <div class="lecture-item-meta">
              <span>⏱ ${lec.durationMinutes} mins</span>
              <span>• ${lec.facultyName || 'Alakh Sir'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderSavedNotes() {
    const container = document.getElementById('saved-notes-list');
    if (!container) return;

    if (this.currentNotes.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px 10px; font-size: 0.82rem;">No timestamped notes yet.<br>Pause video and jot down key concepts!</div>`;
      return;
    }

    container.innerHTML = this.currentNotes.map(n => `
      <div class="saved-note-item" data-note-id="${n._id}">
        <div class="saved-note-header">
          <button class="note-time-btn" onclick="ClassroomView.jumpToTime(${n.timestampSeconds})" title="Jump to timestamp">
            ▶ ${n.timestampFormatted}
          </button>
          <button class="note-delete-btn" onclick="ClassroomView.deleteNote('${n._id}')" title="Delete note">
            ✕
          </button>
        </div>
        <div class="note-text-body">${n.noteText}</div>
      </div>
    `).join('');
  },

  jumpToTime(seconds) {
    if (this.videoEl) {
      this.videoEl.currentTime = seconds;
      this.videoEl.play();
    }
  },

  async deleteNote(noteId) {
    try {
      const res = await API.deleteNote(noteId);
      if (res.success) {
        this.currentNotes = this.currentNotes.filter(n => n._id !== noteId);
        this.renderSavedNotes();
        showToast('Note deleted', 'info');
      }
    } catch (err) {
      showToast('Could not delete note', 'error');
    }
  },

  async saveCurrentProgress() {
    if (!this.currentLecture || !this.videoEl) return;
    const cur = Math.floor(this.videoEl.currentTime || 0);
    const dur = Math.floor(this.videoEl.duration || 1);
    if (cur > 5) {
      try {
        await API.saveWatchProgress(this.currentLecture._id, cur, dur);
      } catch (err) {}
    }
  },

  formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

window.ClassroomView = ClassroomView;
