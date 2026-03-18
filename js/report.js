/* report.js — Module 8: The Report */
'use strict';

(function () {
  const msgEl         = document.getElementById('report-message');
  const streakBig     = document.getElementById('streak-big');
  const streakHabit   = document.getElementById('streak-habit');
  const consFill      = document.getElementById('consistency-fill');
  const starFaceSvg   = document.getElementById('star-face-svg');

  async function load() {
    try {
      const res  = await fetch('ReportServlet');
      const data = await res.json();
      render(data);
    } catch (_) {
      render({ message: 'Your garden is quietly resting.', consistency: 0, longestStreak: 0, topHabit: '' });
    }
  }

  function animateTicker(el, target) {
    let cur = 0;
    const start = performance.now();
    const dur   = 1200;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      cur = Math.round((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = cur;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function drawStarFace(cons) {
    // mood: >0.7 happy, 0.4-0.7 neutral, <0.4 sad
    const SVG_NS = 'http://www.w3.org/2000/svg';
    if (!starFaceSvg) return;
    starFaceSvg.innerHTML = '';

    // Outer star shape
    const outerPath = document.createElementNS(SVG_NS, 'path');
    outerPath.setAttribute('d', 'M50 8L62 35H92L68 53L77 82L50 64L23 82L32 53L8 35H38Z');
    outerPath.setAttribute('fill', 'none');
    outerPath.setAttribute('stroke', '#00ffd0');
    outerPath.setAttribute('stroke-width', '2');
    outerPath.setAttribute('stroke-linejoin', 'round');

    // Eyes
    const eyeL = document.createElementNS(SVG_NS, 'circle');
    const eyeR = document.createElementNS(SVG_NS, 'circle');
    eyeL.setAttribute('cx', '38'); eyeL.setAttribute('cy', '44'); eyeL.setAttribute('r', '3');
    eyeR.setAttribute('cx', '62'); eyeR.setAttribute('cy', '44'); eyeR.setAttribute('r', '3');
    ['fill'].forEach(a => { eyeL.setAttribute(a, '#00ffd0'); eyeR.setAttribute(a, '#00ffd0'); });

    // Mouth
    const mouth = document.createElementNS(SVG_NS, 'path');
    mouth.setAttribute('fill', 'none');
    mouth.setAttribute('stroke', '#00ffd0');
    mouth.setAttribute('stroke-width', '2.5');
    mouth.setAttribute('stroke-linecap', 'round');
    if (cons >= 0.7) {
      mouth.setAttribute('d', 'M38 58 Q50 68 62 58'); // smile
    } else if (cons >= 0.4) {
      mouth.setAttribute('d', 'M40 62 H60');           // neutral
    } else {
      mouth.setAttribute('d', 'M38 64 Q50 54 62 64'); // sad
    }

    [outerPath, eyeL, eyeR, mouth].forEach(el => starFaceSvg.appendChild(el));
  }

  function render(data) {
    if (msgEl)       msgEl.textContent   = data.message || '';
    if (streakHabit) streakHabit.textContent = data.topHabit || '—';
    if (streakBig)   animateTicker(streakBig, data.longestStreak || 0);
    if (consFill)    setTimeout(() => { consFill.style.width = `${Math.round(data.consistency * 100)}%`; }, 200);
    drawStarFace(data.consistency || 0);
  }

  load();
}());
