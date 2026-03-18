/* history.js — heatmap colouring and stagger */
'use strict';

(function () {
  /* ---- Determine data source ---- */
  // 1. Prefer window.HG_HISTORY injected by progress.jsp (server-rendered, no extra fetch)
  // 2. Fall back to fetching ProgressServlet for AJAX
  function applyHeatmap(dataArr) {
    const cells = document.querySelectorAll('.heat-cell');
    if (!cells.length) return;

    const maxCnt = Math.max(...dataArr.map(d => d.completion_count || d.count || 0), 1);

    cells.forEach((cell, i) => {
      const count = parseInt(cell.dataset.count, 10) || (dataArr[i] ? (dataArr[i].completion_count || dataArr[i].count || 0) : 0);
      const ratio = count / maxCnt;
      let lvl = 0;
      if      (ratio === 0)     lvl = 0;
      else if (ratio <= 0.25)   lvl = 1;
      else if (ratio <= 0.50)   lvl = 2;
      else if (ratio <= 0.75)   lvl = 3;
      else                      lvl = 4;
      // Staggered pop-in
      cell.style.animationDelay = `${i * 18}ms`;
      cell.classList.add(`lvl-${lvl}`);
    });
  }

  if (window.HG_HISTORY && Array.isArray(window.HG_HISTORY)) {
    // Data already injected by server — colour immediately after paint
    requestAnimationFrame(() => applyHeatmap(window.HG_HISTORY));
  } else {
    // Fallback: fetch from ProgressServlet
    fetch('ProgressServlet', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(r => r.json())
      .then(applyHeatmap)
      .catch(console.error);
  }
}());
