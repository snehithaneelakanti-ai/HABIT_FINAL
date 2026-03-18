/* world.js — Module 1: The World */
'use strict';

(function () {
  const SF  = document.getElementById('star-field');
  const OC  = document.getElementById('orb-container');
  const ML  = document.getElementById('mist-layer');
  const GS  = document.getElementById('garden-strip');
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---- Pastel Star Colours ---- */
  const STAR_COLORS = [
    '#ffb3d1', // pastel pink
    '#b3d4ff', // pastel blue
    '#fff5b3', // pastel yellow
    '#b3f5d1', // pastel green
    '#e8b3ff', // pastel lilac
  ];

  /* ---- Stars ---- */
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz    = Math.random() * 1.4 + 0.6;   // 0.6–2px (was 0.8–3.3px)
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    s.style.cssText = [
      `width:${sz}px`,
      `height:${sz}px`,
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 88}%`,
      `background:${color}`,
      `box-shadow:0 0 ${sz * 1.2}px ${sz * 0.6}px ${color}`,  // softer glow
      `animation:twinkle ${(Math.random() * 4 + 3).toFixed(1)}s ease-in-out infinite`,
      `animation-delay:${(Math.random() * 8).toFixed(1)}s`
    ].join(';');
    SF.appendChild(s);
  }

  /* ---- Orbs ---- */
  const ORB_COLORS = [
    'rgba(100,200,255,0.10)',
    'rgba(139,92,246,0.09)',
    'rgba(0,255,208,0.07)',
    'rgba(59,130,246,0.08)',
    'rgba(180,180,255,0.06)'
  ];
  for (let i = 0; i < 5; i++) {
    const o = document.createElement('div');
    o.className = 'orb';
    const sz = Math.random() * 280 + 180;
    o.style.cssText = [
      `width:${sz}px`,
      `height:${sz}px`,
      `left:${Math.random() * 80 + 5}%`,
      `top:${Math.random() * 80 + 5}%`,
      `background:radial-gradient(circle,${ORB_COLORS[i]} 0%,transparent 70%)`,
      `animation:orbPulse ${(Math.random() * 12 + 15).toFixed(0)}s ease-in-out infinite`,
      `animation-delay:${(Math.random() * 8).toFixed(1)}s`
    ].join(';');
    OC.appendChild(o);
  }

  /* ========================================================
     TINY GARDEN — SVG flower functions
     All flowers are inline SVG, no canvas, no emoji
     ======================================================== */

  /** Shared helper: make an SVG element */
  function svg(w, h) {
    const el = document.createElementNS(SVG_NS, 'svg');
    el.setAttribute('viewBox', `0 0 ${w} ${h}`);
    el.setAttribute('width',  w);
    el.setAttribute('height', h);
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function el(tag, attrs) {
    const e = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }

  /* ROSE — layered concentric arcs */
  function makeRose(size) {
    const s = svg(size, size);
    const cx = size / 2, cy = size / 2, r = size * 0.42;
    // outer petals
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const px = cx + Math.cos(angle) * r * 0.65;
      const py = cy + Math.sin(angle) * r * 0.65;
      s.appendChild(el('ellipse', {
        cx: px, cy: py, rx: r * 0.45, ry: r * 0.32,
        fill: '#ff8fab', opacity: '0.85',
        transform: `rotate(${(i * 72)},${px},${py})`
      }));
    }
    // inner petals
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + 0.4;
      const px = cx + Math.cos(angle) * r * 0.28;
      const py = cy + Math.sin(angle) * r * 0.28;
      s.appendChild(el('ellipse', {
        cx: px, cy: py, rx: r * 0.28, ry: r * 0.2,
        fill: '#ffb3c6', opacity: '0.9',
        transform: `rotate(${(i * 90)},${px},${py})`
      }));
    }
    // centre
    s.appendChild(el('circle', { cx, cy, r: r * 0.18, fill: '#ffe0ec' }));
    return s;
  }

  /* CARNATION — ruffled fringe circle */
  function makeCarnation(size) {
    const s = svg(size, size);
    const cx = size / 2, cy = size / 2, r = size * 0.4;
    const petals = 14;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const px = cx + Math.cos(a) * r * 0.7;
      const py = cy + Math.sin(a) * r * 0.7;
      s.appendChild(el('ellipse', {
        cx: px, cy: py, rx: r * 0.38, ry: r * 0.18,
        fill: `hsl(${340 + i * 2},90%,${72 + (i % 3) * 5}%)`,
        opacity: '0.88',
        transform: `rotate(${(i / petals) * 360 + 90},${px},${py})`
      }));
    }
    s.appendChild(el('circle', { cx, cy, r: r * 0.22, fill: '#ffccd5' }));
    return s;
  }

  /* HYDRANGEA — cluster of 4-petal florets */
  function makeHydrangea(size) {
    const s = svg(size, size);
    const cx = size / 2, cy = size / 2;
    const positions = [
      [0, -0.35], [0.35, 0], [0, 0.35], [-0.35, 0],
      [-0.25, -0.25], [0.25, -0.25], [0.25, 0.25], [-0.25, 0.25],
      [0, 0]
    ];
    const floretColors = ['#b8c0ff', '#a0b4ff', '#c4b5fd', '#bfdbfe', '#ddd6fe'];
    positions.forEach(([ox, oy], idx) => {
      const fx = cx + ox * size;
      const fy = cy + oy * size;
      const fc = floretColors[idx % floretColors.length];
      for (let p = 0; p < 4; p++) {
        const a = (p / 4) * Math.PI * 2;
        const r = size * 0.11;
        s.appendChild(el('ellipse', {
          cx: fx + Math.cos(a) * r, cy: fy + Math.sin(a) * r,
          rx: r * 1.1, ry: r * 0.65,
          fill: fc, opacity: '0.85',
          transform: `rotate(${p * 90},${fx + Math.cos(a) * r},${fy + Math.sin(a) * r})`
        }));
      }
      s.appendChild(el('circle', { cx: fx, cy: fy, r: size * 0.04, fill: '#f0f4ff' }));
    });
    return s;
  }

  /* LAVENDER — tall spike of tiny oval florets */
  function makeLavender(size) {
    const s = svg(size * 0.5, size);
    const cx = size * 0.25;
    const floretCount = 8;
    const startY = size * 0.1;
    const spacing = (size * 0.65) / floretCount;
    for (let i = 0; i < floretCount; i++) {
      const y = startY + i * spacing;
      const offset = i % 2 === 0 ? -size * 0.09 : size * 0.09;
      s.appendChild(el('ellipse', {
        cx: cx + offset, cy: y,
        rx: size * 0.09, ry: size * 0.06,
        fill: `hsl(${270 + i * 3},65%,${70 + (i % 3) * 4}%)`,
        opacity: '0.9'
      }));
    }
    // stem
    s.appendChild(el('line', {
      x1: cx, y1: size * 0.75, x2: cx, y2: size,
      stroke: '#2d7a47', 'stroke-width': '2', 'stroke-linecap': 'round'
    }));
    return s;
  }

  /* ---- Assemble the garden strip ---- */
  if (!GS) return; // fallback if div missing

  const FLOWER_DEFS = [
    { fn: makeRose,       size: 18, glow: 'rgba(255,143,171,0.35)',  stemH: 20, lean: '-1deg',   swayDur: '8s',  swayDelay: '0s',   glowDur: '3.5s', glowDelay: '0s' },
    { fn: makeCarnation,  size: 16, glow: 'rgba(255,180,200,0.30)',  stemH: 16, lean: '1deg',    swayDur: '10s', swayDelay: '0.5s', glowDur: '4s',   glowDelay: '0.8s' },
    { fn: makeHydrangea,  size: 22, glow: 'rgba(196,181,253,0.30)',  stemH: 12, lean: '-0.5deg', swayDur: '12s', swayDelay: '1s',   glowDur: '5s',   glowDelay: '0.3s' },
    { fn: makeLavender,   size: 24, glow: 'rgba(167,139,250,0.28)',  stemH:  6, lean: '0.5deg',  swayDur: '9s',  swayDelay: '1.5s', glowDur: '4.5s', glowDelay: '1s' },
  ];

  // Spread flowers across the bottom, repeating
  const viewW = window.innerWidth;
  const SPACING = 80;    // was 52 — more breathing room between flowers
  let xPos = 18;

  while (xPos < viewW - 20) {
    const def = FLOWER_DEFS[Math.floor(Math.random() * FLOWER_DEFS.length)];
    // slight random offset
    const jitter = (Math.random() - 0.5) * 18;
    const finalX = xPos + jitter;

    const wrap = document.createElement('div');
    wrap.className = 'flower-wrap';
    // left-to-right bloom cascade: 0s at far left → 2.5s at far right
    const bloomDelay = ((finalX / viewW) * 2.5).toFixed(2);
    wrap.style.cssText = [
      `left:${finalX}px`,
      `--bloom-delay:${bloomDelay}s`,
      `--sway-dur:${def.swayDur}`,
      `--sway-delay:${def.swayDelay}`,
      `--glow-c:${def.glow}`,
      `--glow-dur:${def.glowDur}`,
      `--glow-delay:${def.glowDelay}`,
      `--lean:${def.lean}`
    ].join(';');

    // Flower head SVG
    const flowerSvg = def.fn(def.size);
    wrap.appendChild(flowerSvg);

    // Stem
    const stem = document.createElement('div');
    stem.className = 'flower-stem';
    stem.style.height = def.stemH + 'px';
    wrap.appendChild(stem);

    GS.appendChild(wrap);
    xPos += SPACING + Math.random() * 20;
  }

  /* ---- Parallax ---- */
  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 30;
    ty = (e.clientY / window.innerHeight - 0.5) * 30;
  }, { passive: true });

  function tick() {
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    SF.style.transform = `translate(${cx * 1.6}px, ${cy * 1.6}px)`;
    OC.style.transform = `translate(${cx * 0.8}px, ${cy * 0.8}px)`;
    ML.style.transform = `translate(${cx * 0.3}px, ${cy * 0.3}px)`;
    GS.style.transform = `translate(${cx * 0.2}px, 0)`;  // garden barely moves
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}());
