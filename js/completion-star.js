/* completion-star.js — Daily Completion Star with liquid fill + morphing face */
'use strict';

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  let clipIdCounter = 0; // unique clip IDs per star instance

  // Star path (5-pointed, centered in 100x100 viewBox)
  const STAR_PATH = 'M50 5 L61 38 L97 38 L68 58 L79 92 L50 72 L21 92 L32 58 L3 38 L39 38 Z';

  // ── Face expression data (SVG path d-values) ──────────────────────
  const EXPRESSIONS = {
    verySad: {
      eyeL:  'M33 48 Q36 52 39 48',
      eyeR:  'M61 48 Q64 52 67 48',
      mouth: 'M37 68 Q50 58 63 68',
    },
    sad: {
      eyeL:  'M34 47 Q36 50 39 47',
      eyeR:  'M61 47 Q64 50 67 47',
      mouth: 'M39 65 Q50 60 61 65',
    },
    neutral: {
      eyeL:  'M34 46 Q36 44 39 46',
      eyeR:  'M61 46 Q64 44 67 46',
      mouth: 'M40 63 L60 63',
    },
    happy: {
      eyeL:  'M34 46 Q36 43 39 46',
      eyeR:  'M61 46 Q64 43 67 46',
      mouth: 'M38 61 Q50 70 62 61',
    },
    excited: {
      eyeL:  'M33 46 Q36 41 39 46',
      eyeR:  'M61 46 Q64 41 67 46',
      mouth: 'M35 59 Q50 74 65 59',
    }
  };

  // Liquid fill colors
  const LIQUID_BODY     = 'rgba(255, 210, 100, 0.6)';
  const LIQUID_FULL     = 'rgba(255, 215, 120, 0.8)';

  // ── Helper: create SVG element ────────────────────────────────────
  function el(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
    return e;
  }

  // ── Helper: create SVG <animate> element ──────────────────────────
  function animateEl(attrs) {
    return el('animate', Object.assign({
      repeatCount: 'indefinite',
      calcMode: 'spline',
      keySplines: '0.4 0 0.6 1;0.4 0 0.6 1'
    }, attrs));
  }

  // ── Wave path generator ───────────────────────────────────────────
  // Generates a closed wave-surface path for the top of the liquid.
  // amplitude = wave height, phase shifts create different shapes
  function wavePath(amp, phaseShift) {
    const a = amp;
    const p = phaseShift;
    // 4-peak sinusoidal wave across 120px width (-10 to 110)
    const y0 = 4 + a * Math.sin(p);
    const y1 = 4 + a * Math.sin(p + 1.2);
    const y2 = 4 + a * Math.sin(p + 2.4);
    const y3 = 4 + a * Math.sin(p + 3.6);
    const y4 = 4 + a * Math.sin(p + 4.8);
    return `M-10 ${y0.toFixed(1)} Q5 ${y1.toFixed(1)} 20 ${y2.toFixed(1)} Q40 ${y3.toFixed(1)} 55 ${y2.toFixed(1)} Q70 ${y1.toFixed(1)} 85 ${y4.toFixed(1)} Q100 ${y3.toFixed(1)} 115 ${y0.toFixed(1)} L115 120 L-10 120 Z`;
  }

  // Pre-generate keyframe wave shapes for smooth morphing
  function generateWaveKeyframes(amp, numFrames) {
    const frames = [];
    for (let i = 0; i <= numFrames; i++) {
      const phase = (i / numFrames) * Math.PI * 2;
      frames.push(wavePath(amp, phase));
    }
    return frames;
  }

  // ── Build the star SVG ────────────────────────────────────────────
  function buildStarSVG() {
    const uid = 'sc' + (clipIdCounter++);

    const svg = el('svg', {
      viewBox: '-5 -5 110 110',
      preserveAspectRatio: 'xMidYMid meet',
      'aria-label': 'Daily completion star',
      role: 'img'
    });

    // ─── Defs ───
    const defs = el('defs');

    // Star clip path (unique per instance)
    const clip = el('clipPath', { id: uid });
    clip.appendChild(el('path', { d: STAR_PATH }));
    defs.appendChild(clip);

    // Gradient for liquid depth
    const grad = el('linearGradient', { id: uid + '-lg', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(el('stop', { offset: '0%', 'stop-color': 'rgba(255, 225, 140, 0.9)' }));
    grad.appendChild(el('stop', { offset: '100%', 'stop-color': 'rgba(255, 180, 60, 0.7)' }));
    defs.appendChild(grad);

    svg.appendChild(defs);

    // ─── Star outline ───
    svg.appendChild(el('path', {
      d: STAR_PATH,
      class: 'star-outline'
    }));

    // ─── Liquid group (clipped to star) ───
    const liquidGroup = el('g', { 'clip-path': `url(#${uid})` });

    // Faint background inside the star
    liquidGroup.appendChild(el('rect', {
      x: '0', y: '0', width: '100', height: '100',
      fill: 'rgba(255, 215, 120, 0.04)'
    }));

    // Liquid fill container
    const fillGroup = el('g', { class: 'star-liquid-group' });

    // ── Wave layer 1 (back, darker, slower) ──
    const wave1Frames = generateWaveKeyframes(5, 4);
    const wave1 = el('path', {
      d: wave1Frames[0],
      fill: 'rgba(255, 190, 60, 0.45)',
      class: 'star-wave-1'
    });
    wave1.appendChild(animateEl({
      attributeName: 'd',
      dur: '4s',
      values: wave1Frames.join(';'),
      keyTimes: '0;0.25;0.5;0.75;1'
    }));
    fillGroup.appendChild(wave1);

    // ── Wave layer 2 (middle, main body) ──
    const wave2Frames = generateWaveKeyframes(4, 4);
    const wave2 = el('path', {
      d: wave2Frames[0],
      fill: `url(#${uid}-lg)`,
      class: 'star-wave-2'
    });
    wave2.appendChild(animateEl({
      attributeName: 'd',
      dur: '3s',
      values: wave2Frames.join(';'),
      keyTimes: '0;0.25;0.5;0.75;1'
    }));
    fillGroup.appendChild(wave2);

    // ── Wave layer 3 (front, lighter, fastest) ──
    const wave3Frames = generateWaveKeyframes(3.5, 4);
    const wave3 = el('path', {
      d: wave3Frames[0],
      fill: 'rgba(255, 230, 160, 0.5)',
      class: 'star-wave-3'
    });
    wave3.appendChild(animateEl({
      attributeName: 'd',
      dur: '2.5s',
      values: wave3Frames.join(';'),
      keyTimes: '0;0.25;0.5;0.75;1'
    }));
    fillGroup.appendChild(wave3);

    // ── Highlight / shimmer layer (very subtle) ──
    const wave4Frames = generateWaveKeyframes(2, 4);
    const wave4 = el('path', {
      d: wave4Frames[0],
      fill: 'rgba(255, 255, 220, 0.25)',
      class: 'star-wave-4'
    });
    wave4.appendChild(animateEl({
      attributeName: 'd',
      dur: '5s',
      values: wave4Frames.join(';'),
      keyTimes: '0;0.25;0.5;0.75;1'
    }));
    fillGroup.appendChild(wave4);

    // ── Bubble particles ──
    for (let i = 0; i < 3; i++) {
      const bx = 25 + i * 22;
      const bubble = el('circle', {
        cx: String(bx), cy: '80', r: '1.5',
        fill: 'rgba(255, 255, 255, 0.4)',
        class: 'star-bubble'
      });
      // Bubble rises and fades
      bubble.appendChild(animateEl({
        attributeName: 'cy',
        dur: `${2.5 + i * 0.8}s`,
        values: '80;20;80',
        keyTimes: '0;0.5;1'
      }));
      bubble.appendChild(animateEl({
        attributeName: 'opacity',
        dur: `${2.5 + i * 0.8}s`,
        values: '0;0.6;0',
        keyTimes: '0;0.3;1'
      }));
      fillGroup.appendChild(bubble);
    }

    liquidGroup.appendChild(fillGroup);
    svg.appendChild(liquidGroup);

    // ─── Face group ───
    const faceGroup = el('g', { class: 'star-face-group' });

    faceGroup.appendChild(el('path', {
      d: EXPRESSIONS.neutral.eyeL,
      class: 'star-eye-left'
    }));
    faceGroup.appendChild(el('path', {
      d: EXPRESSIONS.neutral.eyeR,
      class: 'star-eye-right'
    }));
    faceGroup.appendChild(el('path', {
      d: EXPRESSIONS.neutral.mouth,
      class: 'star-mouth'
    }));

    svg.appendChild(faceGroup);

    return svg;
  }

  // ── Get expression tier from percentage ───────────────────────────
  function getExpression(pct) {
    if (pct <= 0.20) return EXPRESSIONS.verySad;
    if (pct <= 0.40) return EXPRESSIONS.sad;
    if (pct <= 0.60) return EXPRESSIONS.neutral;
    if (pct <= 0.80) return EXPRESSIONS.happy;
    return EXPRESSIONS.excited;
  }

  // ── Update star state ─────────────────────────────────────────────
  function updateStar(container, done, total) {
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const pct = total > 0 ? done / total : 0;
    const pctDisplay = Math.round(pct * 100);

    // ── 1. Liquid fill level ──
    const fillGroup = svg.querySelector('.star-liquid-group');
    if (fillGroup) {
      const yOffset = 100 - (pct * 100);
      fillGroup.style.transform = `translateY(${yOffset}px)`;
    }

    // ── 2. Face expression morph ──
    const expr = getExpression(pct);
    const eyeL = svg.querySelector('.star-eye-left');
    const eyeR = svg.querySelector('.star-eye-right');
    const mouth = svg.querySelector('.star-mouth');

    if (eyeL)  eyeL.setAttribute('d', expr.eyeL);
    if (eyeR)  eyeR.setAttribute('d', expr.eyeR);
    if (mouth) mouth.setAttribute('d', expr.mouth);

    // ── 3. Complete state (glow + bounce) ──
    const wrap = container.closest('.completion-star-wrap') || container;
    if (pct >= 1) {
      if (!wrap.classList.contains('star-complete')) {
        wrap.classList.add('star-complete');
      }
    } else {
      wrap.classList.remove('star-complete');
    }

    // ── 4. Update label ──
    const row = wrap.closest('.greeting-star-row');
    const pctLabel = (row && row.querySelector('.star-pct-label')) || document.getElementById('star-pct-label');
    if (pctLabel) pctLabel.textContent = `${pctDisplay}%`;
  }

  // ── Initialize ────────────────────────────────────────────────────
  function init() {
    const container = document.getElementById('completion-star-container');
    if (!container) return;

    const wrap = document.createElement('div');
    wrap.className = 'completion-star-wrap';
    wrap.appendChild(buildStarSVG());
    container.appendChild(wrap);

    const done  = parseInt(window.HG_DONE || '0', 10);
    const total = parseInt(window.HG_TOTAL || '0', 10);
    updateStar(wrap, done, total);

    // Report section star
    const reportSvgEl = document.getElementById('star-face-svg');
    if (reportSvgEl) {
      const reportWrap = document.createElement('div');
      reportWrap.className = 'completion-star-wrap';
      reportWrap.style.width = '80px';
      reportWrap.style.height = '80px';
      reportWrap.appendChild(buildStarSVG());
      reportSvgEl.replaceWith(reportWrap);
      reportWrap.id = 'star-face-svg';
      updateStar(reportWrap, done, total);
    }
  }

  // ── Public API ────────────────────────────────────────────────────
  window.CompletionStar = {
    update: function () {
      const done  = document.querySelectorAll('.habit-tile.done').length;
      const total = document.querySelectorAll('.habit-tile').length;

      const greetWrap = document.querySelector('#completion-star-container .completion-star-wrap');
      if (greetWrap) updateStar(greetWrap, done, total);

      const reportWrap = document.getElementById('star-face-svg');
      if (reportWrap) updateStar(reportWrap, done, total);
    }
  };

  // ── Boot ──────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
