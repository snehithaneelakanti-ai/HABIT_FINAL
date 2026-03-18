/* star-transition.js — Module 4: The Transition */
'use strict';

const StarTransition = (() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function makeStar(size, color) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M50 5L61 35H95L68 57L79 91L50 70L21 91L32 57L5 35H39Z');
    path.setAttribute('fill', color || 'var(--teal)');
    svg.appendChild(path);
    return svg;
  }

  function triggerBloom(onDone) {
    const layer = document.createElement('div');
    layer.className = 'star-bloom-layer';
    document.body.appendChild(layer);

    const star = makeStar(80, '#00ffd0');
    star.className = 'bloom-star-svg';
    layer.appendChild(star);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => { star.classList.add('active'); });
    });

    setTimeout(() => {
      if (typeof onDone === 'function') onDone();
    }, 900);

    setTimeout(() => layer.remove(), 1800);
  }

  function triggerBurst(x, y) {
    const COUNT = 10;
    for (let i = 0; i < COUNT; i++) {
      const p = makeStar(Math.random() * 14 + 6, '#00ffd0');
      p.className = 'burst-particle';
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      document.body.appendChild(p);

      const angle = (i / COUNT) * Math.PI * 2;
      const dist  = Math.random() * 90 + 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
      ], { duration: 700, easing: 'ease-out' }).onfinish = () => p.remove();
    }
  }

  return { triggerBloom, triggerBurst };
})();
