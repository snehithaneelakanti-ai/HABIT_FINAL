/* whimsy.js — Module 10: The Whimsy */
'use strict';

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const layer = document.createElement('div');
  layer.className = 'whimsy-layer';
  document.body.appendChild(layer);

  /* ---- Fairies (3) ---- */
  function makeFairySvg() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    // Body
    const body = document.createElementNS(SVG_NS, 'ellipse');
    body.setAttribute('cx', '12'); body.setAttribute('cy', '14'); body.setAttribute('rx', '3'); body.setAttribute('ry', '4');
    body.setAttribute('fill', 'rgba(200,180,255,0.7)');

    // Left wing
    const wL = document.createElementNS(SVG_NS, 'ellipse');
    wL.setAttribute('cx', '7');  wL.setAttribute('cy', '11'); wL.setAttribute('rx', '5'); wL.setAttribute('ry', '3');
    wL.setAttribute('fill', 'rgba(180,160,255,0.4)');

    // Right wing
    const wR = document.createElementNS(SVG_NS, 'ellipse');
    wR.setAttribute('cx', '17'); wR.setAttribute('cy', '11'); wR.setAttribute('rx', '5'); wR.setAttribute('ry', '3');
    wR.setAttribute('fill', 'rgba(180,160,255,0.4)');

    // Head
    const head = document.createElementNS(SVG_NS, 'circle');
    head.setAttribute('cx', '12'); head.setAttribute('cy', '8'); head.setAttribute('r', '3');
    head.setAttribute('fill', 'rgba(220,200,255,0.8)');

    svg.appendChild(wL); svg.appendChild(wR); svg.appendChild(body); svg.appendChild(head);
    return svg;
  }

  for (let i = 0; i < 3; i++) {
    const f = document.createElement('div');
    f.className = 'fairy';
    f.appendChild(makeFairySvg());
    layer.appendChild(f);

    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight;

    function roam(el) {
      const nextX = Math.random() * (window.innerWidth  - 40);
      const nextY = Math.random() * (window.innerHeight - 40);
      const dur   = Math.random() * 6000 + 5000;
      el.animate([
        { transform: `translate(${posX}px, ${posY}px)` },
        { transform: `translate(${nextX}px, ${nextY}px)` }
      ], { duration: dur, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => {
        posX = nextX; posY = nextY;
        setTimeout(() => roam(el), Math.random() * 2000 + 500);
      };
    }

    // Init position
    f.style.transform = `translate(${posX}px, ${posY}px)`;
    setTimeout(() => roam(f), i * 800);
  }

  /* ---- Petals (periodic) ---- */
  function spawnPetal() {
    const p = document.createElement('div');
    p.className = 'petal';
    const startX = Math.random() < 0.5 ? 30 : window.innerWidth - 30;
    const size   = Math.random() * 8 + 6;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';
    layer.appendChild(p);
    p.animate([
      { transform: `translate(${startX}px, -10px) rotate(0deg)`, opacity: 0.6 },
      { transform: `translate(${startX + (Math.random() - 0.5) * 160}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], { duration: Math.random() * 5000 + 6000, easing: 'ease-in' }).onfinish = () => p.remove();
  }

  setInterval(spawnPetal, 12000);
  setTimeout(spawnPetal, 3000);
}());
