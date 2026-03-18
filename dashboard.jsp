
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HabitGarden — Dashboard</title>
  <meta name="description" content="Your personal habit garden.">
  <link rel="stylesheet" href="css/world.css">
  <link rel="stylesheet" href="css/shell.css">
  <link rel="stylesheet" href="css/navbar.css">
  <link rel="stylesheet" href="css/page-transition.css">
  <link rel="stylesheet" href="css/sections.css">
  <link rel="stylesheet" href="css/greeting.css">
  <link rel="stylesheet" href="css/garden.css">
  <link rel="stylesheet" href="css/report.css">
  <link rel="stylesheet" href="css/graphs.css">
  <link rel="stylesheet" href="css/history.css">
  <link rel="stylesheet" href="css/whimsy.css">
  <link rel="stylesheet" href="css/modal.css">
  <link rel="stylesheet" href="css/star-transition.css">
</head>
<body class="world-bg">

  <!-- Server-side data for JS modules -->
  <script>
    window.HG_USERNAME = '<%= username %>';
    window.HG_DONE     = '<%= done %>';
    window.HG_TOTAL    = '<%= total %>';
    window.HG_STREAK   = '<%= streak %>';
    window.HG_CONS     = '<%= consistency %>';
  </script>

  <!-- World atmosphere layers -->
  <div id="world-layer">
    <div id="star-field"></div>
    <div id="orb-container"></div>
    <div id="mist-layer" class="mist"></div>
    <div id="garden-strip"></div>
  </div>

  <!-- ═══════════════════════════════════════════
       TOP NAVIGATION BAR — 5 Sections
       ═══════════════════════════════════════════ -->
  <nav class="top-nav" aria-label="Main navigation">

    <!-- Brand -->
    <a href="#dashboard" class="nav-brand" aria-label="HabitGarden home">
      <svg class="nav-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 22V12M12 12C12 6 7 2 2 2c5 0 10 4 10 10M12 12c0-6 5-10 10-10-5 0-10 4-10 10"/>
      </svg>
      <span class="nav-brand-text">HabitGarden</span>
    </a>

    <!-- Nav Links -->
    <ul class="nav-links" role="list">

      <!-- Dashboard -->
      <li>
        <a href="#dashboard" data-tab="dashboard" class="active" aria-current="page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </a>
      </li>

      <!-- Add Habit -->
      <li>
        <a href="#add" data-tab="add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Habit
        </a>
      </li>

      <!-- Track -->
      <li>
        <a href="#track" data-tab="track">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          Track
        </a>
      </li>

      <!-- Progress -->
      <li>
        <a href="#progress" data-tab="progress">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Progress
        </a>
      </li>

      <!-- Profile -->
      <li>
        <a href="#profile" data-tab="profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Profile
        </a>
      </li>

      <!-- Divider + Sign Out -->
      <li class="nav-divider" aria-hidden="true"></li>
      <li>
        <a href="LogoutServlet" class="nav-logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </a>
      </li>
    </ul>
  </nav>

  <!-- ═══════════════════════════════════════════
       APP SHELL — SPA content area
       ═══════════════════════════════════════════ -->
  <div class="app-shell top-nav-mode">
    <main class="dashboard-main" id="dashboard-main">

      <!-- ─────────────────────────────────────
           SECTION 1: DASHBOARD
           ───────────────────────────────────── -->
      <div id="sec-dashboard" class="section-view active">

        <!-- Intelligence AI box -->
        <div id="intelligence-box"></div>

        <div class="bento-grid">

          <!-- Cell 1: Greeting (tall) -->
          <div class="bento-cell span-r2" style="--reveal-delay:50ms">
            <div class="cell-inner greeting-cell">
              <h2 class="greet-text" id="greet-text">Hello!</h2>
              <p  class="fact-text"  id="fact-text"></p>
              <div class="ticker-row">
                <span class="ticker-num" id="ticker-num">0</span>
                <span class="ticker-label"> of <%= total %> habits done</span>
              </div>
              <button class="new-habit-btn" id="new-habit-btn" aria-haspopup="dialog"
                      onclick="document.querySelector('[data-tab=add]').click()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Habit
              </button>
            </div>
          </div>

          <!-- Cell 2: Streak -->
          <div class="bento-cell" style="--reveal-delay:100ms">
            <div class="cell-inner">
              <span class="cell-label">Current Streak</span>
              <div class="cell-value"><%= streak %></div>
              <span class="cell-sub">days in a row</span>
            </div>
          </div>

          <!-- Cell 3: Consistency Ring Chart -->
          <div class="bento-cell" style="--reveal-delay:150ms">
            <div class="cell-inner">
              <span class="cell-label">Consistency</span>
              <div class="ring-chart-wrap">
                <div id="ring-container"></div>
              </div>
            </div>
          </div>

          <!-- Cell 4: 7-Day Bar Chart -->
          <div class="bento-cell" style="--reveal-delay:200ms">
            <div class="cell-inner">
              <span class="cell-label">Weekly Trend</span>
              <div class="bar-chart-wrap" id="bar-container"></div>
            </div>
          </div>

          <!-- Cell 5: The Garden (full width) -->
          <div class="bento-cell span-3" style="--reveal-delay:260ms">
            <div class="cell-inner">
              <div class="garden-header">
                <h3>The Garden</h3>
                <div class="garden-progress-track">
                  <div class="garden-progress-fill" id="garden-progress-fill"></div>
                </div>
              </div>
              <div class="habit-grid" id="habit-grid"></div>
              <div class="garden-empty hidden" id="garden-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 22V12M12 12C12 6 7 2 2 2c5 0 10 4 10 10M12 12c0-6 5-10 10-10-5 0-10 4-10 10"/>
                </svg>
                <p>No habits yet — plant your first one.</p>
              </div>
            </div>
          </div>

          <!-- Cell 6: Report (full width) -->
          <div class="bento-cell span-3" style="--reveal-delay:320ms">
            <div class="cell-inner report-cell">
              <span class="cell-label">Garden Report</span>
              <div class="report-row">
                <svg id="star-face-svg" viewBox="0 0 100 100"
                     aria-label="Mood indicator" role="img"></svg>
                <div class="report-text">
                  <p class="report-message" id="report-message"></p>
                  <div class="streak-row">
                    <span>Longest streak: <strong id="streak-habit">—</strong></span>
                    <span class="streak-big" id="streak-big">0</span>
                    <span>days</span>
                  </div>
                  <div class="consistency-track">
                    <div class="consistency-fill" id="consistency-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /bento-grid -->
      </div><!-- /sec-dashboard -->


      <!-- ─────────────────────────────────────
           SECTION 2: ADD HABIT
           ───────────────────────────────────── -->
      <div id="sec-add" class="section-view">
        <div class="bento-cell add-habit-card" style="--reveal-delay:0ms">
          <div class="cell-inner">
            <div class="section-head">
              <h2>Plant a New Habit</h2>
              <p>Habits grow stronger every day you nurture them.</p>
            </div>

            <form id="add-habit-form" class="add-habit-form" novalidate>

              <!-- Name -->
              <div class="form-field">
                <label class="form-label" for="ah-name">Habit Name</label>
                <input class="form-input" id="ah-name" type="text" name="name"
                       placeholder="e.g. Morning meditation, Read 10 pages…"
                       required maxlength="100" autocomplete="off">
              </div>

              <!-- Frequency -->
              <div class="form-field">
                <span class="form-label">Frequency</span>
                <div class="freq-group">
                  <button type="button" class="freq-btn selected" data-freq="daily">Daily</button>
                  <button type="button" class="freq-btn" data-freq="weekdays">Weekdays</button>
                  <button type="button" class="freq-btn" data-freq="weekly">Weekly</button>
                </div>
              </div>

              <!-- Icon -->
              <div class="form-field">
                <span class="form-label">Choose Icon</span>
                <div class="icon-grid-large">
                  <div class="icon-card selected" data-icon="leaf">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12C12 6 7 2 2 2c5 0 10 4 10 10M12 12c0-6 5-10 10-10-5 0-10 4-10 10"/></svg>
                    <span>Leaf</span>
                  </div>
                  <div class="icon-card" data-icon="water">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>
                    <span>Water</span>
                  </div>
                  <div class="icon-card" data-icon="sun">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                    <span>Sun</span>
                  </div>
                  <div class="icon-card" data-icon="moon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                    <span>Moon</span>
                  </div>
                  <div class="icon-card" data-icon="book">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
                    <span>Book</span>
                  </div>
                  <div class="icon-card" data-icon="heart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    <span>Heart</span>
                  </div>
                  <div class="icon-card" data-icon="star">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>Star</span>
                  </div>
                  <div class="icon-card" data-icon="run">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.5"/><path d="M7 22l4-8 3 3 3-5"/><path d="M17 22l-1-4-3-2 1-5"/></svg>
                    <span>Run</span>
                  </div>
                </div>
              </div>

              <!-- Inline Plant Stages Preview (Appears on selection) -->
              <div id="inline-plant-preview" style="display: none; flex-direction: column; gap: 12px; margin-top: 6px; margin-bottom: 24px; padding: 20px 24px; background: rgba(0,255,208,0.03); border: 1px solid rgba(0,255,208,0.15); border-radius: 18px; transition: opacity 0.3s ease;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <h3 id="inline-preview-title" style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 300; color: var(--teal); margin: 0;"></h3>
                  <span style="font-family: var(--font-body); font-size: 0.75rem; color: rgba(255,255,255,0.4);">Unlock stages by checking in</span>
                </div>
                <div class="preview-stages" id="inline-preview-stages" style="display: flex; gap: 10px; justify-content: space-between; overflow-x: auto; padding-bottom: 8px;">
                  <!-- Stages injected here via JS -->
                </div>
              </div>

              <!-- Submit -->
              <div>
                <button type="submit" class="form-submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Plant Habit
                </button>
                <div id="ah-status" class="form-status" aria-live="polite"></div>
              </div>

            </form>
          </div>
        </div>
      </div><!-- /sec-add -->


      <!-- ─────────────────────────────────────
           SECTION 3: TRACK
           ───────────────────────────────────── -->
      <div id="sec-track" class="section-view">
        <div class="bento-cell span-3" style="--reveal-delay:0ms">
          <div class="cell-inner">
            <div class="section-head">
              <h2>Today's Check-In</h2>
              <p>Toggle each habit you've completed today.</p>
            </div>

            <!-- Summary bar -->
            <div class="today-summary" style="margin-bottom:18px">
              <div class="today-summary-num" id="track-done-num">0</div>
              <div style="flex:1">
                <p id="track-summary-text" class="today-summary-text">0 of 0 habits completed today</p>
                <div class="today-progress-bar">
                  <div class="today-progress-fill" id="track-today-fill"></div>
                </div>
              </div>
            </div>

            <!-- Habit rows -->
            <div class="track-grid" id="track-rows">
              <div class="track-empty">Loading…</div>
            </div>

          </div>
        </div>
      </div><!-- /sec-track -->


      <!-- ─────────────────────────────────────
           SECTION 4: PROGRESS
           ───────────────────────────────────── -->
      <div id="sec-progress" class="section-view">

        <!-- Stats row -->
        <div class="progress-stats-row">

          <div class="bento-cell stat-mini" style="--reveal-delay:40ms">
            <div class="cell-inner">
              <span class="cell-label">Weekly Consistency</span>
              <div class="cell-value" id="prog-consistency">—</div>
              <span class="cell-sub">of days with completions</span>
            </div>
          </div>

          <div class="bento-cell stat-mini" style="--reveal-delay:80ms">
            <div class="cell-inner">
              <span class="cell-label">Longest Streak</span>
              <div class="cell-value" id="prog-streak">—</div>
              <span class="cell-sub">days in a row</span>
            </div>
          </div>

          <div class="bento-cell stat-mini" style="--reveal-delay:120ms">
            <div class="cell-inner">
              <span class="cell-label">Top Habit</span>
              <div class="cell-value" style="font-size:1.1rem;color:var(--white);font-weight:300;align-self:flex-start;margin-top:4px" id="prog-habit">—</div>
              <span class="cell-sub">highest streak</span>
            </div>
          </div>
        </div>

        <!-- Heatmap -->
        <div class="bento-cell" style="--reveal-delay:160ms">
          <div class="cell-inner">
            <div class="heatmap-toprow">
              <div class="heatmap-header">
                <h2>30-Day Activity</h2>
                <p>Each square is one day — darker means more habits completed</p>
              </div>
            </div>
            <div class="heatmap-grid" id="prog-heatmap"></div>
            <div class="heatmap-legend" style="margin-top:14px">
              <span>Less</span>
              <div class="legend-cell lvl-0"></div>
              <div class="legend-cell lvl-1"></div>
              <div class="legend-cell lvl-2"></div>
              <div class="legend-cell lvl-3"></div>
              <div class="legend-cell lvl-4"></div>
              <span>More</span>
            </div>
          </div>
        </div>

        <!-- Motivational message -->
        <div class="bento-cell" style="--reveal-delay:200ms">
          <div class="cell-inner">
            <span class="cell-label">Garden Report</span>
            <p id="prog-message" style="font-family:var(--font-display);font-size:1.15rem;font-weight:300;color:rgba(255,255,255,0.7);line-height:1.6;margin-top:8px;font-style:italic"></p>
          </div>
        </div>

      </div><!-- /sec-progress -->


      <!-- ─────────────────────────────────────
           SECTION 5: PROFILE
           ───────────────────────────────────── -->
      <div id="sec-profile" class="section-view">

        <!-- Profile card -->
        <div class="bento-cell" style="--reveal-delay:40ms">
          <div class="cell-inner">
            <div class="profile-card">
              <div class="profile-avatar" id="prof-avatar"><%= username ? username.charAt(0).toUpperCase() : 'G' %></div>
              <div class="profile-info">
                <h3><%= username %></h3>
                <p>Gardener since they planted their first habit</p>
              </div>
            </div>

            <div class="motive-banner" style="margin-top:18px">
              <p id="prof-motive">Loading your garden story…</p>
            </div>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="profile-stats-grid">
          <div class="bento-cell" style="--reveal-delay:80ms">
            <div class="cell-inner profile-stat-cell">
              <div class="profile-stat-label">Active Habits</div>
              <div class="profile-stat-value" id="prof-total-habits">—</div>
              <div class="profile-stat-sub">planted in your garden</div>
            </div>
          </div>
          <div class="bento-cell" style="--reveal-delay:100ms">
            <div class="cell-inner profile-stat-cell">
              <div class="profile-stat-label">Total Completions</div>
              <div class="profile-stat-value" id="prof-total-logs">—</div>
              <div class="profile-stat-sub">times you showed up</div>
            </div>
          </div>
          <div class="bento-cell" style="--reveal-delay:120ms">
            <div class="cell-inner profile-stat-cell">
              <div class="profile-stat-label">Longest Streak</div>
              <div class="profile-stat-value" id="prof-streak">—</div>
              <div class="profile-stat-sub">consecutive days</div>
            </div>
          </div>
          <div class="bento-cell" style="--reveal-delay:140ms">
            <div class="cell-inner profile-stat-cell">
              <div class="profile-stat-label">Consistency</div>
              <div class="profile-stat-value" id="prof-consistency">—</div>
              <div class="profile-stat-sub">weekly completion rate</div>
            </div>
          </div>
        </div>

        <!-- Habit streak list -->
        <div class="bento-cell" style="--reveal-delay:180ms">
          <div class="cell-inner">
            <span class="cell-label">Your Habits</span>
            <div class="profile-habit-list" id="prof-habit-list" style="margin-top:14px">
              <p style="font-family:var(--font-body);font-size:0.82rem;color:rgba(255,255,255,0.25)">Loading…</p>
            </div>
          </div>
        </div>

        <!-- Sign Out -->
        <div style="padding: 4px 0 8px">
          <a href="LogoutServlet" class="profile-sign-out-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </a>
        </div>

      </div><!-- /sec-profile -->

    </main>
  </div><!-- /app-shell -->

  <!-- New Habit Modal (kept for keyboard shortcut / direct calls) -->
  <div class="modal-overlay" id="new-habit-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modal-title">New Habit</h2>
        <button class="modal-close" id="modal-close" aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <form id="new-habit-form" novalidate>
        <div class="input-group">
          <input type="text" name="name" placeholder="Habit name" required maxlength="100">
          <span class="input-line"></span>
        </div>
        <div class="icon-select" id="icon-select">
          <span class="icon-select-label">Choose icon</span>
          <div class="icon-options">
            <label class="icon-option"><input type="radio" name="icon_key" value="leaf" checked><span data-key="leaf"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="water"><span data-key="water"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="sun"><span data-key="sun"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="moon"><span data-key="moon"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="book"><span data-key="book"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="heart"><span data-key="heart"></span></label>
            <label class="icon-option"><input type="radio" name="icon_key" value="star"><span data-key="star"></span></label>
          </div>
        </div>
        <button type="submit" class="auth-submit">Add to Garden</button>
      </form>
    </div>
  </div>

  <script src="js/world.js?v=2"></script>
  <script src="js/star-transition.js?v=2"></script>
  <script src="js/shell.js?v=2"></script>
  <script src="js/greeting.js?v=2"></script>
  <script src="js/garden.js?v=2"></script>
  <script src="js/report.js?v=2"></script>
  <script src="js/graphs.js?v=2"></script>
  <script src="js/whimsy.js?v=2"></script>
  <script src="js/intelligence.js?v=2"></script>
  <script src="js/sections.js?v=2"></script>
</body>
</html>
