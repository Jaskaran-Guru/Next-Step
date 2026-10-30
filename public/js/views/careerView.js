/**
 * NEXTSTEP OS - CAREER & DEGREE EXPLORER + EMPLOYABILITY CENTRE
 * ============================================================
 * Provides:
 *   1. Career Catalog with Day-in-the-Life, Prerequisites & Salaries
 *   2. Degree Comparison Matrix (e.g., B.Tech vs BCA, B.Com vs BBA)
 *   3. Employability Suite (ATS Resume Analyzer & AI Mock Interview Simulator)
 */

const CareerView = {
  careers: [],
  degrees: [],
  selectedCategory: 'All',
  selectedDegreeCodes: ['btech-cse', 'bca'],

  async init() {
    await this.fetchData();
    this.render();
  },

  async fetchData() {
    try {
      const [careersRes, degreesRes] = await Promise.all([
        API.getCareers(),
        API.getDegrees()
      ]);
      if (careersRes.success) this.careers = careersRes.data;
      if (degreesRes.success) this.degrees = degreesRes.data;
    } catch (e) {
      console.warn('Failed to load career data, using defaults:', e);
    }
  },

  render() {
    this.renderCareerGrid();
    this.renderDegreeComparison();
    this.bindEvents();
  },

  renderCareerGrid() {
    const container = document.getElementById('career-cards-container');
    if (!container) return;

    const filtered = this.selectedCategory === 'All'
      ? this.careers
      : this.careers.filter(c => c.category === this.selectedCategory);

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);">No careers found in this category.</div>`;
      return;
    }

    container.innerHTML = filtered.map(career => `
      <div class="career-card" style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:24px;display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s ease, border-color 0.2s ease;">
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--brand-secondary);background:rgba(25,198,216,0.1);padding:4px 10px;border-radius:20px;letter-spacing:0.05em;">
              ${career.category}
            </span>
            <span style="font-size:0.75rem;font-weight:600;color:var(--status-success);">
              ${career.growthOutlook || 'High Demand'}
            </span>
          </div>

          <h3 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">
            ${career.title}
          </h3>

          <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5;margin-bottom:16px;">
            ${career.tagline || career.overview}
          </p>

          <div style="margin-bottom:16px;">
            <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">Recommended Degrees:</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${(career.requiredDegrees || []).map(deg => `
                <span style="font-size:0.72rem;background:var(--bg-surface-secondary);color:var(--text-primary);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">
                  ${deg}
                </span>
              `).join('')}
            </div>
          </div>

          <div style="margin-bottom:16px;background:rgba(104,87,245,0.06);padding:10px 12px;border-radius:var(--radius-sm);border:1px solid rgba(104,87,245,0.15);">
            <div style="font-size:0.7rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;">Fresher CTC Outlook:</div>
            <div style="font-size:0.88rem;font-weight:700;color:var(--text-primary);margin-top:2px;">
              ${career.approxSalaryRange?.fresher || '₹6,00,000 - ₹12,00,000'}
            </div>
          </div>
        </div>

        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-outline" style="flex:1;font-size:0.8rem;padding:8px 12px;" onclick="CareerView.openCareerDetails('${career.slug}')">
            Full Profile →
          </button>
          <button class="btn btn-primary" style="flex:1;font-size:0.8rem;padding:8px 12px;" onclick="CareerView.generateCareerRoadmap('${career.title}')">
            Add to Roadmap
          </button>
        </div>
      </div>
    `).join('');
  },

  renderDegreeComparison() {
    const tableBody = document.getElementById('degree-comparison-table-body');
    if (!tableBody) return;

    const compared = this.degrees.filter(d => this.selectedDegreeCodes.includes(d.code));
    if (compared.length < 2) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-muted);">Select at least 2 degrees to compare.</td></tr>`;
      return;
    }

    const d1 = compared[0];
    const d2 = compared[1];

    tableBody.innerHTML = `
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Degree Name</td>
        <td style="font-weight:700;color:var(--brand-primary);padding:14px;">${d1.name}</td>
        <td style="font-weight:700;color:var(--brand-secondary);padding:14px;">${d2.name}</td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Duration</td>
        <td style="padding:14px;">${d1.durationYears} Years</td>
        <td style="padding:14px;">${d2.durationYears} Years</td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Eligibility</td>
        <td style="padding:14px;font-size:0.85rem;">${d1.eligibility}</td>
        <td style="padding:14px;font-size:0.85rem;">${d2.eligibility}</td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Entrance Exams</td>
        <td style="padding:14px;font-size:0.85rem;">${(d1.entranceExams || []).join(', ')}</td>
        <td style="padding:14px;font-size:0.85rem;">${(d2.entranceExams || []).join(', ')}</td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Average Total Fees</td>
        <td style="padding:14px;font-weight:600;">${d1.averageFees}</td>
        <td style="padding:14px;font-weight:600;">${d2.averageFees}</td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Core Advantages (Pros)</td>
        <td style="padding:14px;font-size:0.82rem;line-height:1.4;">
          <ul style="padding-left:18px;margin:0;">
            ${(d1.pros || []).map(p => `<li>${p}</li>`).join('')}
          </ul>
        </td>
        <td style="padding:14px;font-size:0.82rem;line-height:1.4;">
          <ul style="padding-left:18px;margin:0;">
            ${(d2.pros || []).map(p => `<li>${p}</li>`).join('')}
          </ul>
        </td>
      </tr>
      <tr>
        <td style="font-weight:700;color:var(--text-muted);padding:14px;">Top Career Roles</td>
        <td style="padding:14px;font-size:0.85rem;">${(d1.careerOutcomes || []).join(' • ')}</td>
        <td style="padding:14px;font-size:0.85rem;">${(d2.careerOutcomes || []).join(' • ')}</td>
      </tr>
    `;
  },

  openCareerDetails(slug) {
    const career = this.careers.find(c => c.slug === slug);
    if (!career) return;

    const modal = document.getElementById('career-details-modal');
    const content = document.getElementById('career-details-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="margin-bottom:20px;">
        <span style="font-size:0.75rem;font-weight:700;color:var(--brand-secondary);text-transform:uppercase;background:rgba(25,198,216,0.1);padding:4px 10px;border-radius:20px;">
          ${career.category}
        </span>
        <h2 style="font-size:1.6rem;font-weight:800;color:var(--text-primary);margin:10px 0 6px 0;">
          ${career.title}
        </h2>
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.6;">
          ${career.overview}
        </p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div style="background:var(--bg-surface-secondary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">Fresher Compensation</div>
          <div style="font-size:1.05rem;font-weight:700;color:var(--status-success);">${career.approxSalaryRange?.fresher || 'N/A'}</div>
        </div>
        <div style="background:var(--bg-surface-secondary);padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;">Experienced (5+ Yrs)</div>
          <div style="font-size:1.05rem;font-weight:700;color:var(--brand-primary);">${career.approxSalaryRange?.experienced || 'N/A'}</div>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">Core Skills Required</h4>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${(career.coreSkills || []).map(s => `
            <span style="font-size:0.8rem;background:rgba(104,87,245,0.1);color:var(--brand-primary);border:1px solid rgba(104,87,245,0.25);padding:4px 10px;border-radius:20px;">
              ${s}
            </span>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">A Day in the Life</h4>
        <ul style="padding-left:20px;color:var(--text-secondary);font-size:0.88rem;line-height:1.6;">
          ${(career.dayInTheLife || []).map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom:24px;background:rgba(245,185,66,0.08);border:1px solid rgba(245,185,66,0.25);padding:14px;border-radius:var(--radius-md);">
        <h4 style="font-size:0.85rem;font-weight:700;color:var(--status-warning);margin-bottom:6px;">Alternative & Backup Pathways</h4>
        <ul style="padding-left:18px;color:var(--text-primary);font-size:0.82rem;line-height:1.5;margin:0;">
          ${(career.alternativePathways || []).map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn btn-outline" onclick="document.getElementById('career-details-modal').classList.remove('active')">
          Close
        </button>
        <button class="btn btn-primary" onclick="CareerView.generateCareerRoadmap('${career.title}')">
          Generate Career Roadmap →
        </button>
      </div>
    `;

    modal.classList.add('active');
  },

  async generateCareerRoadmap(careerTitle) {
    try {
      showToast(`Generating roadmap for ${careerTitle}...`, 'info');
      const res = await API.askStageAdvisor('Learner', 18, 'degree_college_19_23', `Generate complete learning & employability roadmap to become ${careerTitle}`);
      if (res.success) {
        showToast(`Roadmap generated! Saved to your profile.`, 'success');
        const modal = document.getElementById('career-details-modal');
        if (modal) modal.classList.remove('active');
        if (window.Router) window.Router.navigate('stages');
      }
    } catch (e) {
      showToast('Roadmap generation error', 'error');
    }
  },

  bindEvents() {
    // Category pill filtering
    const pills = document.querySelectorAll('.career-cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        pills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedCategory = e.currentTarget.getAttribute('data-cat') || 'All';
        this.renderCareerGrid();
      });
    });

    // Degree compare dropdowns
    const degSelect1 = document.getElementById('degree-select-1');
    const degSelect2 = document.getElementById('degree-select-2');
    if (degSelect1 && degSelect2) {
      degSelect1.addEventListener('change', (e) => {
        this.selectedDegreeCodes[0] = e.target.value;
        this.renderDegreeComparison();
      });
      degSelect2.addEventListener('change', (e) => {
        this.selectedDegreeCodes[1] = e.target.value;
        this.renderDegreeComparison();
      });
    }

    // Mock Interview Generator
    const interviewBtn = document.getElementById('btn-generate-interview');
    interviewBtn?.addEventListener('click', async () => {
      const role = document.getElementById('interview-role-select')?.value || 'Software Engineer';
      const difficulty = document.getElementById('interview-difficulty-select')?.value || 'Intermediate';
      const resultArea = document.getElementById('interview-questions-result');
      if (!resultArea) return;

      resultArea.innerHTML = `<div style="text-align:center;padding:20px;color:var(--brand-primary);"><i data-lucide="loader-2" class="spin"></i> Generating interview questions via AI...</div>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const res = await API.getMockInterview(role, 'Engineering', difficulty);
        if (res.success && res.questions) {
          resultArea.innerHTML = res.questions.map((q, idx) => `
            <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:18px;margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:0.75rem;font-weight:700;color:var(--brand-primary);text-transform:uppercase;">
                  Q${idx + 1} • ${q.type} Question
                </span>
                <span style="font-size:0.72rem;background:rgba(104,87,245,0.1);color:var(--brand-primary);padding:2px 8px;border-radius:10px;">
                  ${difficulty}
                </span>
              </div>
              <h4 style="font-size:0.95rem;font-weight:700;color:var(--text-primary);margin-bottom:10px;line-height:1.5;">
                ${q.question}
              </h4>
              <div style="background:rgba(25,198,216,0.06);border-left:3px solid var(--brand-secondary);padding:8px 12px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;margin-bottom:10px;">
                <div style="font-size:0.7rem;font-weight:700;color:var(--brand-secondary);text-transform:uppercase;">What the Interviewer Evaluates:</div>
                <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">${q.whatInterviewerLooksFor}</div>
              </div>
              <div style="font-size:0.78rem;color:var(--text-muted);">
                💡 <strong>Suggested Framework:</strong> ${q.suggestedFramework}
              </div>
            </div>
          `).join('');
        }
      } catch (err) {
        resultArea.innerHTML = `<div style="color:var(--status-error);padding:14px;">Failed to generate questions.</div>`;
      }
    });

    // ATS Resume Reviewer
    const resumeBtn = document.getElementById('btn-review-resume');
    resumeBtn?.addEventListener('click', async () => {
      const skillsInput = document.getElementById('resume-skills-input')?.value || '';
      const summaryInput = document.getElementById('resume-summary-input')?.value || '';
      const roleInput = document.getElementById('resume-target-role')?.value || 'Software Engineer';
      const resultArea = document.getElementById('resume-review-result');
      if (!resultArea) return;

      const skillsList = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      resultArea.innerHTML = `<div style="text-align:center;padding:20px;color:var(--brand-primary);"><i data-lucide="loader-2" class="spin"></i> Analyzing resume against ATS models...</div>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const res = await API.reviewResume(skillsList, summaryInput, roleInput);
        if (res.success) {
          resultArea.innerHTML = `
            <div style="background:var(--bg-surface-secondary);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:20px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                <div>
                  <h4 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);">ATS Readiness Assessment</h4>
                  <p style="font-size:0.82rem;color:var(--text-muted);">Target Role: ${roleInput}</p>
                </div>
                <div style="text-align:center;background:rgba(34,197,139,0.1);border:1px solid rgba(34,197,139,0.3);padding:8px 16px;border-radius:var(--radius-md);">
                  <div style="font-size:1.4rem;font-weight:800;color:var(--status-success);">${res.readinessScore || 78}%</div>
                  <div style="font-size:0.65rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Readiness Score</div>
                </div>
              </div>

              <div style="margin-bottom:16px;">
                <h5 style="font-size:0.85rem;font-weight:700;color:var(--status-success);margin-bottom:6px;">Key Strengths:</h5>
                <ul style="padding-left:18px;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
                  ${(res.strengths || []).map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>

              <div style="margin-bottom:16px;">
                <h5 style="font-size:0.85rem;font-weight:700;color:var(--status-warning);margin-bottom:6px;">Critical Skill Gaps to Fill:</h5>
                <ul style="padding-left:18px;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
                  ${(res.criticalGaps || []).map(g => `<li>${g}</li>`).join('')}
                </ul>
              </div>

              <div>
                <h5 style="font-size:0.85rem;font-weight:700;color:var(--brand-primary);margin-bottom:6px;">High-Impact Project Ideas for Your Portfolio:</h5>
                <ul style="padding-left:18px;font-size:0.85rem;color:var(--text-secondary);line-height:1.5;">
                  ${(res.suggestedProjects || []).map(p => `<li><strong>${p}</strong></li>`).join('')}
                </ul>
              </div>
            </div>
          `;
        }
      } catch (err) {
        resultArea.innerHTML = `<div style="color:var(--status-error);padding:14px;">Resume review failed.</div>`;
      }
    });
  }
};

window.CareerView = CareerView;
