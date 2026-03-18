/* sections.js — 5-Tab SPA: Dashboard | Add Habit | Track | Progress | Profile */
'use strict';

(function () {
  const BASE = window.location.pathname.replace(/\/[^/]*(\.jsp|Servlet)?$/, '');

  /* ══════════════════════════════════════════
     TAB SWITCHING
     ══════════════════════════════════════════ */
  function activateTab(tabId) {
    // Deactivate all nav links
    document.querySelectorAll('.top-nav .nav-links a[data-tab]').forEach(a => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });

    // Activate clicked link
    const link = document.querySelector(`.top-nav .nav-links a[data-tab="${tabId}"]`);
    if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }

    // Swap section content
    document.querySelectorAll('.section-view').forEach(sec => {
      sec.classList.remove('active');
    });
    const section = document.getElementById('sec-' + tabId);
    if (section) {
      // Re-trigger animation each time
      section.classList.remove('active');
      void section.offsetWidth; // reflow
      section.classList.add('active');
    }

    // Tab-specific data loaders
    if (tabId === 'dashboard') loadDashboard();
    if (tabId === 'track')     loadTrack();
    if (tabId === 'progress')  loadProgress();
    if (tabId === 'profile')   loadProfile();
  }

  /* Wire up all nav tabs */
  document.querySelectorAll('.top-nav .nav-links a[data-tab]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateTab(this.dataset.tab);
    });
  });

  /* ══════════════════════════════════════════
     SHARED ICON HELPERS
     ══════════════════════════════════════════ */
  const ICONS = {
    leaf:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 6 7 2 2 2c5 0 10 4 10 10M12 12c0-6 5-10 10-10-5 0-10 4-10 10"/></svg>`,
    water: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>`,
    sun:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    moon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    book:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    star:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    run:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.5"/><path d="M7 22l4-8 3 3 3-5"/><path d="M17 22l-1-4-3-2 1-5"/></svg>`,
  };

  function iconSvg(key) { 
    if (window.HabitGarden && typeof window.HabitGarden.buildPlantSVG === 'function') {
      return window.HabitGarden.buildPlantSVG(4, key).replace('height="80px"', 'height="100%"');
    }
    return ICONS[key] || ICONS.leaf; 
  }

  /* ══════════════════════════════════════════
     SECTION: DASHBOARD — load greeting data
     ══════════════════════════════════════════ */
  async function loadDashboard() {
    if (window.HabitGarden && typeof window.loadHabits === 'function') {
      window.loadHabits();
    } else {
      const done  = document.querySelectorAll('.habit-tile.done').length;
      const tiles = document.querySelectorAll('.habit-tile').length;
      const tickEl = document.getElementById('ticker-num');
      if (tickEl) tickEl.textContent = done;
      const lbl = document.querySelector('.ticker-label');
      if (lbl) lbl.textContent = ` of ${tiles} habits done`;
      const bar = document.getElementById('garden-progress-fill');
      if (bar) bar.style.width = tiles > 0 ? `${(done / tiles) * 100}%` : '0';
    }
  }

  /* ══════════════════════════════════════════
     SECTION: ADD HABIT — icon picker + submit
     ══════════════════════════════════════════ */
  let selectedIcon = 'leaf';
  let selectedFreq = 'daily';

  function initAddHabit() {
    const form = document.getElementById('add-habit-form');
    if (!form) return;

    // Icon cards
    const PLANT_NAMES = {
      leaf: 'Fern', water: 'Succulent', sun: 'Sunflower', moon: 'Moonflower',
      book: 'Rose bush', heart: 'Tulip', star: 'Cactus', run: 'Vine'
    };

    document.querySelectorAll('.icon-card').forEach(card => {
      const key = card.dataset.icon;
      if (window.HabitGarden && typeof window.HabitGarden.buildPlantSVG === 'function') {
        let customSvg = window.HabitGarden.buildPlantSVG(4, key);
        // Make the SVG fit nicely in the bigger card
        customSvg = customSvg.replace('width="100%"', 'width="70px"').replace('height="80px"', 'height="70px"');
        card.innerHTML = customSvg + `<span>${PLANT_NAMES[key] || 'Plant'}</span>`;
      }
      card.addEventListener('click', function () {
        document.querySelectorAll('.icon-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedIcon = this.dataset.icon;
        
        // --- Show the immersive inline plant preview ---
        if (typeof window.updateInlinePlantPreview === 'function') {
          window.updateInlinePlantPreview(selectedIcon, PLANT_NAMES[selectedIcon] || 'Plant');
        }
      });
    });

    // Frequency buttons
    document.querySelectorAll('.freq-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        selectedFreq = this.dataset.freq;
      });
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const nameInput = form.querySelector('#ah-name');
      const name = nameInput.value.trim();
      const status = document.getElementById('ah-status');
      if (!name) {
        showStatus(status, '⚠ Please enter a habit name', true);
        return;
      }
      const submitBtn = form.querySelector('.form-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Planting…';

      try {
        const body = new URLSearchParams({ name, icon_key: selectedIcon });
        const res = await fetch(BASE + '/HabitServlet', {
          method: 'POST', body,
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          nameInput.value = '';
          showStatus(status, '🌱 Habit planted in your garden!', false);
          // refresh garden tiles if visible
          if (typeof loadHabits === 'function') loadHabits();
        } else {
          showStatus(status, data.error || 'Something went wrong', true);
        }
      } catch (_) {
        showStatus(status, 'Connection error — please try again', true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Plant Habit';
      }
    });

    // Render the custom prebuilt habit categories
    renderPrebuiltHabits();
  }

  function showStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-status show' + (isError ? ' error' : '');
    setTimeout(() => el.classList.remove('show'), 4000);
  }

  /* ══════════════════════════════════════════
     SECTION: ADD HABIT — PREBUILT CATEGORIES
     ══════════════════════════════════════════ */
  function renderPrebuiltHabits() {
    const container = document.getElementById('prebuilt-habits-container');
    if (!container) return;

    const PREBUILT_CATEGORIES = [
      {
        title: '🌸 Cute Life Habits',
        desc: 'Small actions that improve daily life and create a sense of routine and aesthetic satisfaction.',
        habits: [
          { name: 'Plan outfit for tomorrow', icon: 'star' },
          { name: 'Keep your space clean', icon: 'water' },
          { name: 'Organize one small thing', icon: 'leaf' },
          { name: 'Take one photo', icon: 'sun' },
          { name: 'Do something that makes your day feel special', icon: 'heart' }
        ]
      },
      {
        title: '🌱 Bare Minimum Habits (Low-Energy Mode)',
        desc: 'For days when you feel low energy or overwhelmed. Completing even one feels like a win.',
        habits: [
          { name: 'Drink water', icon: 'water' },
          { name: 'Wash face', icon: 'water' },
          { name: 'Get out of bed', icon: 'sun' },
          { name: 'Do one small task', icon: 'leaf' },
          { name: 'Take a few deep breaths', icon: 'leaf' }
        ]
      }
    ];

    let html = '';
    PREBUILT_CATEGORIES.forEach(cat => {
      let gridHtml = '';
      cat.habits.forEach(h => {
        gridHtml += `
          <div class="prebuilt-card">
            <div class="prebuilt-icon">${ICONS[h.icon] || ICONS.leaf}</div>
            <span class="prebuilt-name">${esc(h.name)}</span>
            <button type="button" class="add-prebuilt-btn" data-name="${esc(h.name)}" data-icon="${h.icon}" aria-label="Add ${esc(h.name)}">+ Add</button>
          </div>
        `;
      });

      html += `
        <div class="prebuilt-category">
          <div class="prebuilt-header">
            <h3>${cat.title}</h3>
            <p>${cat.desc}</p>
          </div>
          <div class="prebuilt-grid">
            ${gridHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Attach click listeners to + Add buttons
    container.querySelectorAll('.add-prebuilt-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const name = this.dataset.name;
        const icon_key = this.dataset.icon;
        const prevText = this.textContent;
        this.textContent = '...';
        this.disabled = true;

        try {
          const body = new URLSearchParams({ name, icon_key });
          const res = await fetch(BASE + '/HabitServlet', {
            method: 'POST', body,
            headers: { 'Accept': 'application/json' }
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            this.textContent = '✓ Added';
            this.classList.add('added');
            // Show a global status or use the form's status area just for feedback
            const status = document.getElementById('ah-status');
            if (status) showStatus(status, '🌱 ' + name + ' added!', false);
            
            // Re-render garden dashboard if active
            if (typeof loadHabits === 'function') loadHabits(); 
          } else {
            this.textContent = prevText;
            this.disabled = false;
            alert(data.error || 'Failed to add habit');
          }
        } catch (_) {
          this.textContent = prevText;
          this.disabled = false;
          alert('Connection error');
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     SECTION: TRACK — today's habit toggles
     ══════════════════════════════════════════ */
  async function loadTrack() {
    const grid = document.getElementById('track-rows');
    const summary = document.getElementById('track-summary-text');
    const fill = document.getElementById('track-today-fill');
    if (!grid) return;

    grid.innerHTML = '<div class="track-empty">Loading habits…</div>';

    try {
      const res    = await fetch(BASE + '/HabitServlet', { headers: { 'Accept': 'application/json' } });
      const habits = await res.json();

      grid.innerHTML = '';
      if (!habits.length) {
        grid.innerHTML = '<div class="track-empty">No habits yet — add your first one in Add Habit.</div>';
        return;
      }

      habits.forEach((h, i) => {
        const row = document.createElement('div');
        row.className = `track-row${h.completed_today ? ' done' : ''}`;
        row.dataset.habitId = h.habit_id;
        row.style.animationDelay = `${i * 55}ms`;

        row.innerHTML = `
          <div class="track-info">
            <div class="track-icon">${iconSvg(h.icon_key)}</div>
            <div>
              <div class="track-name">${esc(h.habit_name)}</div>
              <div class="track-streak-badge">🔥 ${h.current_streak || 0} day streak</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <button class="track-toggle" aria-label="Toggle ${esc(h.habit_name)}" title="Mark ${h.completed_today ? 'incomplete' : 'complete'}"></button>
            <button class="track-delete" title="Delete Habit" aria-label="Delete ${esc(h.habit_name)}" style="background:none; border:none; color:rgba(255,100,100,0.6); cursor:pointer; padding:4px; display:flex; align-items:center; transition: color 0.2s;" onmouseover="this.style.color='rgba(255,100,100,1)'" onmouseout="this.style.color='rgba(255,100,100,0.6)'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <path d="M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        `;

        row.querySelector('.track-toggle').addEventListener('click', async () => {
          const isDone = row.classList.contains('done');
          row.classList.toggle('done', !isDone);
          updateTrackSummary();
          try {
            const body = new URLSearchParams({ habit_id: h.habit_id, completed: !isDone });
            await fetch(BASE + '/HabitLogServlet', { method: 'POST', body, headers: { 'Accept': 'application/json' } });
          } catch (_) {
            row.classList.toggle('done', isDone); // rollback
            updateTrackSummary();
          }
        });

        const delBtn = row.querySelector('.track-delete');
        if (delBtn) {
          delBtn.addEventListener('click', async () => {
            if (!confirm(`Are you sure you want to completely delete "${h.habit_name}"?`)) return;
            try {
              const res = await fetch(BASE + '/HabitServlet/' + h.habit_id, { method: 'DELETE' });
              if (res.ok) {
                row.remove();
                updateTrackSummary();
                // If we delete, update global total tiles count implicitly or directly
                if (window.HabitGarden && typeof window.loadHabits === 'function') {
                  window.loadHabits(); // silently rebuild dashboard garden in background so they are synced
                }
              } else {
                alert("Failed to delete habit.");
              }
            } catch (_) {
              alert("Connection error - could not delete.");
            }
          });
        }

        grid.appendChild(row);
      });

      updateTrackSummary();

    } catch (err) {
      grid.innerHTML = '<div class="track-empty">Failed to load habits.</div>';
    }
  }

  function updateTrackSummary() {
    const done  = document.querySelectorAll('#track-rows .track-row.done').length;
    const total = document.querySelectorAll('#track-rows .track-row').length;
    const txt   = document.getElementById('track-summary-text');
    const fill  = document.getElementById('track-today-fill');
    if (txt)  txt.textContent = `${done} of ${total} habits completed today`;
    if (fill) fill.style.width = total > 0 ? `${(done / total) * 100}%` : '0';
  }

  /* ══════════════════════════════════════════
     SECTION: PROGRESS — stats + heatmap
     ══════════════════════════════════════════ */
  async function loadProgress() {
    // Load stat numbers
    try {
      const res  = await fetch(BASE + '/ReportServlet', { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const d = await res.json();
        const cons   = document.getElementById('prog-consistency');
        const streak = document.getElementById('prog-streak');
        const habit  = document.getElementById('prog-habit');
        if (cons)   cons.textContent   = Math.round((d.consistency || 0) * 100) + '%';
        if (streak) streak.textContent = d.longestStreak || 0;
        if (habit)  habit.textContent  = d.topHabit || '—';
        const msg = document.getElementById('prog-message');
        if (msg) msg.textContent = d.message || '';
      }
    } catch (_) {}

    // Load heatmap
    try {
      const res  = await fetch(BASE + '/ProgressServlet', {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (res.ok) {
        const rows = await res.json();
        buildHeatmap(rows);
      }
    } catch (_) {}
  }

  function buildHeatmap(habitsData) {
    const container = document.getElementById('prog-heatmap') || document.getElementById('heatmap-grid-container');
    if (!container) return;
    container.innerHTML = '';

    if (!habitsData || !habitsData.length) {
      container.innerHTML = '<p style="color:rgba(255,255,255,0.3); font-family:var(--font-body); padding:20px;">No history to display.</p>';
      return;
    }

    // Sort to keep consistent order
    habitsData.sort((a,b) => a.habit_name.localeCompare(b.habit_name));

    habitsData.forEach((habit, hIdx) => {
      // 1. Create a row container for this habit
      const row = document.createElement('div');
      row.className = 'history-habit-row';
      row.style.animationDelay = `${hIdx * 100}ms`;

      // 2. Add habit label (Name & Current Streak)
      const labelDiv = document.createElement('div');
      labelDiv.className = 'history-habit-label';
      labelDiv.innerHTML = `
        <div class="hist-icon">${iconSvg(habit.icon_key)}</div>
        <div class="hist-name">${esc(habit.habit_name)}</div>
        <div class="hist-streak">🔥 ${habit.current_streak}</div>
      `;
      row.appendChild(labelDiv);

      // 3. Create the 30-day grid for this habit
      const grid = document.createElement('div');
      grid.className = 'history-habit-grid';
      
      // Calculate running total to roughly approximate 'stage' up to that date,
      // or just use the current total completions for an overarching look, 
      // but to show "growth" we should tally completions as we go through the 30 days.
      // Instead of recalculating exactly from the start of time, we'll assume the plant 
      // grows within the 30-day window, or just show the final final stage if we want it to 
      // look impressive. The prompt asks for plant structure to map to habit icon type 
      // and growth stages mapping to completions.
      
      let runningCompletions = Math.max(0, habit.total_completions - habit.history.filter(d=>d.completed).length);

      habit.history.forEach((dayData, dIdx) => {
        if (dayData.completed) runningCompletions++;
        
        let stage = 0;
        let stageLabel = 'Seed';
        if (runningCompletions >= 30) { stage = 5; stageLabel = 'Guardian'; }
        else if (runningCompletions >= 14) { stage = 4; stageLabel = 'Flourish'; }
        else if (runningCompletions >= 7)  { stage = 3; stageLabel = 'Bloom'; }
        else if (runningCompletions >= 3)  { stage = 2; stageLabel = 'Growing'; }
        else if (runningCompletions >= 1)  { stage = 1; stageLabel = 'Sprout'; }
        
        // Drooping animation if missed (only if they have started the habit)
        const isMissed = !dayData.completed && runningCompletions > 0;
        
        const cell = document.createElement('div');
        cell.className = `heat-cell plant-stage-${stage} ${isMissed ? 'drooping' : ''} ${dayData.completed ? 'done' : ''}`;
        // Give custom css variables for colors
        cell.dataset.plant = habit.icon_key;
        cell.style.animationDelay = `${(dayData.date === 'today' ? 30 : dIdx) * 15}ms`;

        // SVG Plant body
        const svgHTML = window.HabitGarden && typeof window.HabitGarden.buildPlantSVG === 'function'
                          ? window.HabitGarden.buildPlantSVG(stage, habit.icon_key) 
                          : '';

        // Streak Flowers (Only on the most recent day if current streak > 2)
        let streakFlowersHTML = '';
        if (dIdx === habit.history.length - 1 && habit.current_streak > 2 && window.HabitGarden && window.HabitGarden.buildStreakFlowers) {
            streakFlowersHTML = '<div class="streak-flowers-cal">';
            const flowerCount = Math.min(5, Math.floor(habit.current_streak / 3));
            for(let i=0; i<flowerCount; i++) {
                streakFlowersHTML += '<div class="streak-flower" style="animation-delay: ' + (i * 0.4) + 's">✨</div>';
            }
            streakFlowersHTML += '</div>';
        }

        // Hover Overlay (Glassmorphism)
        const overlayHTML = '<div class="habit-overlay hist-overlay">' +
            '<div class="overlay-title">' + esc(habit.habit_name) + '</div>' +
            '<div class="overlay-divider"></div>' +
            '<div class="overlay-row">' +
              '<span class="overlay-label">Date</span>' +
              '<span class="overlay-val">' + dayData.date + '</span>' +
            '</div>' +
            '<div class="overlay-row">' +
              '<span class="overlay-label">Stage</span>' +
              '<span class="overlay-val">' + stageLabel + '</span>' +
            '</div>' +
            '<div class="overlay-row">' +
              '<span class="overlay-label">Watered?</span>' +
              '<span class="overlay-val" style="color: ' + (dayData.completed ? 'var(--plant-mint)' : 'rgba(255,255,255,0.4)') + '">' +
                  (dayData.completed ? 'Yes' : 'No') +
              '</span>' +
            '</div>' +
          '</div>';

        cell.innerHTML = streakFlowersHTML + 
          '<div class="heat-plant-body">' + svgHTML + '</div>' +
          '<div class="heat-soil"></div>' +
          overlayHTML;
        
        grid.appendChild(cell);
      });

      row.appendChild(grid);
      container.appendChild(row);
    });
  }

  /* ══════════════════════════════════════════
     SECTION: PROFILE — user stats
     ══════════════════════════════════════════ */
  async function loadProfile() {
    try {
      const [habitRes, reportRes] = await Promise.all([
        fetch(BASE + '/HabitServlet', { headers: { 'Accept': 'application/json' } }),
        fetch(BASE + '/ReportServlet', { headers: { 'Accept': 'application/json' } })
      ]);

      const habits = habitRes.ok ? await habitRes.json() : [];
      const report = reportRes.ok ? await reportRes.json() : {};

      // Stats
      const totalHabits = document.getElementById('prof-total-habits');
      const totalLogs   = document.getElementById('prof-total-logs');
      const profStreak  = document.getElementById('prof-streak');
      const profCons    = document.getElementById('prof-consistency');

      const totalCompletions = habits.reduce((s, h) => s + (h.total_completions || 0), 0);
      if (totalHabits) totalHabits.textContent = habits.length;
      if (totalLogs)   totalLogs.textContent   = totalCompletions;
      if (profStreak)  profStreak.textContent  = report.longestStreak || 0;
      if (profCons)    profCons.textContent    = Math.round((report.consistency || 0) * 100) + '%';

      // Habit list with streaks
      const list = document.getElementById('prof-habit-list');
      if (list) {
        list.innerHTML = '';
        if (!habits.length) {
          list.innerHTML = '<p style="font-family:var(--font-body);font-size:0.82rem;color:rgba(255,255,255,0.25);padding:12px 0">No habits planted yet.</p>';
        } else {
          habits.slice(0, 8).forEach(h => {
            const item = document.createElement('div');
            item.className = 'profile-habit-item';
            item.innerHTML = `
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0">${iconSvg(h.icon_key)}</div>
                <span class="profile-habit-name">${esc(h.habit_name)}</span>
              </div>
              <div class="profile-habit-streak">${h.current_streak || 0}<span>day streak</span></div>
            `;
            list.appendChild(item);
          });
        }
      }

      // Motivational message
      const motiveEl = document.getElementById('prof-motive');
      if (motiveEl && report.message) motiveEl.textContent = report.message;

    } catch (err) { console.error(err); }
  }

  /* ══════════════════════════════════════════
     HELPER
     ══════════════════════════════════════════ */
  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ══════════════════════════════════════════
     BOOT
     ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    // Determine initial tab from URL hash or default
    const hash = (window.location.hash || '#dashboard').slice(1);
    const validTabs = ['dashboard', 'add', 'track', 'progress', 'profile'];
    const startTab = validTabs.includes(hash) ? hash : 'dashboard';

    activateTab(startTab);
    initAddHabit();
  });

  /* ════════════════════════════════════════════════════════
     INLINE PLANT PREVIEW LOGIC
     ════════════════════════════════════════════════════════ */
  window.updateInlinePlantPreview = function(plantKey, friendlyName) {
    if (!window.HabitGarden || typeof window.HabitGarden.buildPlantSVG !== 'function') return;

    const previewBox = document.getElementById('inline-plant-preview');
    if (!previewBox) return;

    const titleEl = document.getElementById('inline-preview-title');
    if (titleEl) titleEl.textContent = friendlyName;

    const container = document.getElementById('inline-preview-stages');
    if (container) {
      container.innerHTML = '';
      
      const stagesInfo = [
        { level: 0, name: 'Seed', req: '0' },
        { level: 1, name: 'Sprout', req: '3' },
        { level: 2, name: 'Growing', req: '7' },
        { level: 3, name: 'Blooming', req: '14' },
        { level: 4, name: 'Flourish', req: '21' },
        { level: 5, name: 'Guardian', req: '30+' }
      ];

      stagesInfo.forEach(info => {
        const svgRaw = window.HabitGarden.buildPlantSVG(info.level, plantKey);
        // Ensure SVG scales cleanly within the horizontal container
        const svg = svgRaw.replace('height="80px"', '').replace('width="100%"', 'width="100%" height="100%"');
        
        const div = document.createElement('div');
        div.className = 'preview-stage';
        div.innerHTML = `
          ${svg}
          <div style="display:flex; flex-direction:column; gap:2px; margin-top:8px;">
            <span class="preview-stage-name">${info.name}</span>
            <span class="preview-stage-req">${info.req} days</span>
          </div>
        `;
        container.appendChild(div);
      });
    }

    // Reveal the inline preview section smoothly
    previewBox.style.display = 'flex';
  };

}());
