
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HabitGarden — Growth History</title>
  <meta name="description" content="Your 30-day habit growth heatmap.">
  <link rel="stylesheet" href="css/world.css">
  <link rel="stylesheet" href="css/shell.css">
  <link rel="stylesheet" href="css/navbar.css">
  <link rel="stylesheet" href="css/page-transition.css">
  <link rel="stylesheet" href="css/history.css">
  <link rel="stylesheet" href="css/star-transition.css">
</head>
<body class="world-bg">

  <!-- Inject 30-day history for history.js -->
  <script>
    window.HG_HISTORY = <%- locals.historyJson ? historyJson : '[]' %>;
  </script>

  <!-- World atmosphere -->
  <div id="world-layer">
    <div id="star-field"></div>
    <div id="orb-container"></div>
    <div id="mist-layer" class="mist"></div>
    <div id="garden-strip"></div>
  </div>

  <!-- Top Navigation Bar -->
  <nav class="top-nav" aria-label="Main navigation">
    <!-- Brand -->
    <a href="DashboardServlet" class="nav-brand" aria-label="HabitGarden home">
      <svg class="nav-brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 22V12M12 12C12 6 7 2 2 2c5 0 10 4 10 10M12 12c0-6 5-10 10-10-5 0-10 4-10 10"/>
      </svg>
      <span class="nav-brand-text">HabitGarden</span>
    </a>

    <!-- Nav Links -->
    <ul class="nav-links" role="list">
      <li>
        <a href="DashboardServlet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="ProgressServlet" class="active" aria-current="page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          History
        </a>
      </li>
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

  <!-- App Shell -->
  <div class="app-shell top-nav-mode">

    <main class="dashboard-main">
      <div class="bento-grid">
        <div class="bento-cell span-3" style="--reveal-delay:80ms">
          <div class="cell-inner">
            <!-- Header row -->
            <div class="heatmap-toprow">
              <div class="heatmap-header">
                <h2>Growth History</h2>
                <p>Last 30 days of habit completions</p>
              </div>
              <button class="back-btn" onclick="window.location.href='DashboardServlet'" aria-label="Back to dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Dashboard
              </button>
            </div>

            <!-- Heatmap grid — rendered by JS (history.js/sections.js) -->
            <div class="heatmap-container" id="heatmap-grid-container">
               <!-- JS will inject habit rows here -->
            </div>

            <!-- Legend -->
            <div class="heatmap-legend" style="margin-top:20px;">
              <span>Seed</span>
              <div class="legend-cell lvl-0"></div>
              <div class="legend-cell lvl-1"></div>
              <div class="legend-cell lvl-2"></div>
              <div class="legend-cell lvl-3"></div>
              <div class="legend-cell lvl-4"></div>
              <span>Guardian</span>
            </div>
          </div>
        </div>
      </div>
    </main>

  </div>

  <script src="js/world.js"></script>
  <script src="js/star-transition.js"></script>
  <script src="js/shell.js"></script>
  <script src="js/history.js"></script>
</body>
</html>
