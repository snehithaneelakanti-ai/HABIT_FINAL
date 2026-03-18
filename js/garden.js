/* garden.js — Module 6: Habit Garden — Procedural Pastel Plants */
'use strict';

(function () {
  const BASE = window.location.pathname.replace(/\/[^/]*(\.jsp|Servlet)?$/, '');

  /* ═══════════════════════════════════════════════════
     PLANT RENDERING ENGINE (Procedural SVGs)
     ═══════════════════════════════════════════════════ */
  
  // Maps icon_key from DB to pastel color themes in CSS and local fill logic
  const PLANT_THEMES = {
    leaf:  'var(--plant-mint)',
    water: 'var(--plant-sky)',
    sun:   'var(--plant-lemon)',
    moon:  'var(--plant-lavender)',
    book:  'var(--plant-rose)',
    heart: 'var(--plant-rose)',
    star:  'var(--plant-lemon)',
    run:   'var(--plant-sage)',
    default: 'var(--plant-mint)'
  };

  // Generate the SVG body for a plant based on its stage (0-5)
  function buildPlantSVG(stage, plantType) {
    const color = PLANT_THEMES[plantType] || PLANT_THEMES.default;
    const stem  = 'var(--stem-green)';
    const dark  = 'var(--stem-dark)';

    let svg = `<svg viewBox="0 0 100 120" width="100%" height="80px" fill="none" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">`;

    // Soil mound (all stages)
    svg += `<ellipse cx="50" cy="112" rx="22" ry="5" fill="#6B5A3E" opacity="0.45"/>`;

    // Seed (Stage 0)
    if (stage === 0) {
      svg += `<ellipse cx="50" cy="106" rx="5" ry="3.5" fill="#8B6F47" stroke="${dark}" stroke-width="1"/>`;
      svg += `<path d="M50 103 Q52 99 51 103" stroke="${stem}" stroke-width="1" fill="none"/>`;
      return svg + `</svg>`;
    }

    // ---- Helper: draw a proper flower with radial petals ----
    const drawFlower = (cx, cy, petalCount, petalRx, petalRy, petalDist, fillColor, centerR, centerColor) => {
      let s = '';
      for (let i = 0; i < petalCount; i++) {
        const a = (i / petalCount) * 360 - 90;
        const rad = a * Math.PI / 180;
        const px = cx + Math.cos(rad) * petalDist;
        const py = cy + Math.sin(rad) * petalDist;
        s += `<ellipse cx="${px}" cy="${py}" rx="${petalRx}" ry="${petalRy}" fill="${fillColor}" stroke="${dark}" stroke-width="0.8" transform="rotate(${a} ${px} ${py})" opacity="0.9"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="${centerR}" fill="${centerColor}" stroke="${dark}" stroke-width="0.8"/>`;
      return s;
    };

    // ---- Helper: draw a leaf pair ----
    const drawLeaf = (sx, sy, ex, ey, size) => {
      const mx = (sx + ex) / 2, my = (sy + ey) / 2;
      const dx = ex - sx, dy = ey - sy;
      const nx = -dy * size, ny = dx * size;
      return `<path d="M${sx} ${sy} Q${mx+nx} ${my+ny} ${ex} ${ey} Q${mx-nx*0.3} ${my-ny*0.3} ${sx} ${sy}" fill="${stem}" stroke="${dark}" stroke-width="0.8"/>`;
    };

    /* ===== FERN (leaf) ===== */
    if (plantType === 'leaf' || !plantType) {
      if (stage === 1) {
        svg += `<path d="M50 110 Q50 98 50 88" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += drawLeaf(50, 95, 40, 88, 0.3) + drawLeaf(50, 92, 60, 86, 0.3);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 Q49 85 50 65" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(50, 98, 34, 88, 0.35) + drawLeaf(50, 92, 66, 82, 0.35);
        svg += drawLeaf(50, 82, 36, 72, 0.3) + drawLeaf(50, 76, 64, 66, 0.3);
      }
      if (stage === 3) {
        svg += `<path d="M50 110 Q50 70 50 48" stroke="${stem}" stroke-width="3.5" fill="none"/>`;
        svg += drawLeaf(50, 100, 30, 88, 0.4) + drawLeaf(50, 92, 70, 80, 0.4);
        svg += drawLeaf(50, 80, 28, 68, 0.35) + drawLeaf(50, 72, 72, 60, 0.35);
        svg += drawLeaf(50, 62, 35, 52, 0.3) + drawLeaf(50, 56, 65, 46, 0.3);
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 Q50 60 50 35" stroke="${stem}" stroke-width="4" fill="none"/>`;
        svg += drawLeaf(50, 102, 25, 88, 0.45) + drawLeaf(50, 94, 75, 80, 0.45);
        svg += drawLeaf(50, 82, 22, 68, 0.4) + drawLeaf(50, 74, 78, 60, 0.4);
        svg += drawLeaf(50, 62, 28, 50, 0.35) + drawLeaf(50, 54, 72, 42, 0.35);
        svg += drawLeaf(50, 46, 35, 36, 0.3) + drawLeaf(50, 40, 65, 30, 0.3);
        if (stage === 5) {
          // Fiddlehead curls at top
          svg += `<path d="M50 35 Q45 28 42 30 Q40 35 44 33" stroke="${stem}" stroke-width="2" fill="none"/>`;
          svg += `<path d="M50 35 Q55 26 58 28 Q60 33 56 31" stroke="${stem}" stroke-width="2" fill="none"/>`;
          svg += drawFlower(42, 28, 5, 4, 2.2, 5, color, 2.5, '#FFE566');
          svg += drawFlower(58, 26, 5, 4, 2.2, 5, color, 2.5, '#FFE566');
        }
      }
    }

    /* ===== SUCCULENT (water) ===== */
    else if (plantType === 'water') {
      const cx = 50;
      if (stage === 1) {
        svg += `<ellipse cx="${cx}" cy="100" rx="10" ry="6" fill="${color}" stroke="${dark}" stroke-width="1" opacity="0.85"/>`;
        svg += `<ellipse cx="${cx}" cy="97" rx="7" ry="5" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
      }
      if (stage === 2) {
        svg += `<ellipse cx="${cx}" cy="103" rx="12" ry="5" fill="${color}" stroke="${dark}" stroke-width="1" opacity="0.6"/>`;
        svg += `<ellipse cx="${cx-8}" cy="97" rx="10" ry="5" fill="${color}" stroke="${dark}" stroke-width="1" transform="rotate(-20 ${cx-8} 97)"/>`;
        svg += `<ellipse cx="${cx+8}" cy="97" rx="10" ry="5" fill="${color}" stroke="${dark}" stroke-width="1" transform="rotate(20 ${cx+8} 97)"/>`;
        svg += `<ellipse cx="${cx}" cy="92" rx="7" ry="5" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
      }
      if (stage === 3) {
        for (let a = 0; a < 360; a += 60) {
          const rad = a * Math.PI / 180;
          const lx = cx + Math.cos(rad) * 13, ly = 90 + Math.sin(rad) * 7;
          svg += `<ellipse cx="${lx}" cy="${ly}" rx="10" ry="5" fill="${color}" stroke="${dark}" stroke-width="0.8" transform="rotate(${a} ${lx} ${ly})" opacity="0.85"/>`;
        }
        svg += `<circle cx="${cx}" cy="90" r="5.5" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
      }
      if (stage >= 4) {
        for (let ring = 0; ring < 2; ring++) {
          const r = ring === 0 ? 16 : 9;
          const count = ring === 0 ? 8 : 5;
          const yOff = 86 + ring * 4;
          for (let i = 0; i < count; i++) {
            const a = (i / count) * 360 + ring * 25;
            const rad = a * Math.PI / 180;
            const lx = cx + Math.cos(rad) * r, ly = yOff + Math.sin(rad) * (r * 0.45);
            svg += `<ellipse cx="${lx}" cy="${ly}" rx="11" ry="5" fill="${color}" stroke="${dark}" stroke-width="0.7" transform="rotate(${a} ${lx} ${ly})" opacity="${ring === 0 ? '0.75' : '0.9'}"/>`;
          }
        }
        svg += `<circle cx="${cx}" cy="86" r="6" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        if (stage === 5) {
          svg += `<path d="M50 80 Q50 60 50 48" stroke="${stem}" stroke-width="2" fill="none"/>`;
          svg += drawFlower(50, 44, 5, 4.5, 2.5, 6, '#FFB6C1', 3, '#FF69B4');
        }
      }
    }

    /* ===== SUNFLOWER (sun) ===== */
    else if (plantType === 'sun') {
      if (stage === 1) {
        svg += `<path d="M50 110 Q50 98 50 85" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(50, 98, 40, 90, 0.3) + drawLeaf(50, 95, 60, 88, 0.3);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 Q50 78 50 58" stroke="${stem}" stroke-width="3.5" fill="none"/>`;
        svg += drawLeaf(50, 92, 32, 78, 0.4) + drawLeaf(50, 82, 68, 68, 0.4);
        // Small bud
        svg += `<ellipse cx="50" cy="55" rx="5" ry="4" fill="${stem}" stroke="${dark}" stroke-width="0.8"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M50 110 Q50 65 50 38" stroke="${stem}" stroke-width="4.5" fill="none"/>`;
        svg += drawLeaf(50, 90, 25, 72, 0.45) + drawLeaf(50, 75, 75, 58, 0.45);
        // Opening flower
        svg += drawFlower(50, 35, 8, 7, 3, 10, color, 5, '#8B6914');
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 Q50 58 50 28" stroke="${stem}" stroke-width="5.5" fill="none"/>`;
        svg += drawLeaf(50, 88, 20, 68, 0.5) + drawLeaf(50, 72, 80, 52, 0.5);
        svg += drawLeaf(50, 92, 75, 82, 0.35);
        const petalN = stage === 5 ? 14 : 10;
        const petalR = stage === 5 ? 16 : 13;
        svg += drawFlower(50, 22, petalN, 9, 3.5, petalR, color, stage === 5 ? 9 : 7, '#8B6914');
        // Seed dots in center
        svg += `<circle cx="48" cy="20" r="1.2" fill="#5c3d0a" opacity="0.5"/>`;
        svg += `<circle cx="52" cy="23" r="1.2" fill="#5c3d0a" opacity="0.5"/>`;
        svg += `<circle cx="50" cy="19" r="1" fill="#5c3d0a" opacity="0.4"/>`;
        if (stage === 5) {
          // Second smaller sunflower on branch
          svg += `<path d="M50 68 Q68 60 76 48" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
          svg += drawFlower(78, 44, 8, 5.5, 2.2, 8, color, 4.5, '#8B6914');
        }
      }
    }

    /* ===== MOONFLOWER (moon) ===== */
    else if (plantType === 'moon') {
      if (stage === 1) {
        svg += `<path d="M50 110 Q55 98 48 85" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += drawLeaf(53, 98, 42, 90, 0.3);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 Q58 82 45 58" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(54, 92, 38, 80, 0.4) + drawLeaf(48, 72, 62, 62, 0.35);
        // Closed bud
        svg += `<path d="M45 58 Q43 48 45 44 Q47 50 45 58" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M50 110 Q60 78 42 42" stroke="${stem}" stroke-width="4" fill="none"/>`;
        svg += drawLeaf(55, 90, 30, 75, 0.45) + drawLeaf(47, 65, 65, 52, 0.4);
        svg += drawFlower(40, 38, 5, 8, 3.5, 10, color, 4, '#E8E0F0');
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 Q65 72 40 32" stroke="${stem}" stroke-width="5" fill="none"/>`;
        svg += drawLeaf(58, 85, 25, 68, 0.5) + drawLeaf(46, 60, 70, 45, 0.45);
        const petals = stage === 5 ? 8 : 6;
        const pr = stage === 5 ? 15 : 12;
        svg += drawFlower(38, 28, petals, 9, 3.8, pr, color, stage === 5 ? 6 : 4.5, '#E8E0F0');
        // Glow effect
        svg += `<circle cx="38" cy="28" r="${stage === 5 ? 20 : 15}" fill="${color}" opacity="0.08"/>`;
        if (stage === 5) {
          svg += `<path d="M50 78 Q70 70 78 55" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
          svg += drawFlower(80, 50, 6, 5.5, 2.5, 8, color, 3.5, '#E8E0F0');
        }
      }
    }

    /* ===== ROSE BUSH (book) ===== */
    else if (plantType === 'book') {
      // Helper: a rose = layered circles that look like spiral petals
      const drawRose = (cx, cy, r) => {
        let s = '';
        // Outer petals
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * 360 - 90;
          const rad = a * Math.PI / 180;
          const px = cx + Math.cos(rad) * (r * 0.7);
          const py = cy + Math.sin(rad) * (r * 0.7);
          s += `<ellipse cx="${px}" cy="${py}" rx="${r*0.55}" ry="${r*0.35}" fill="${color}" stroke="${dark}" stroke-width="0.7" transform="rotate(${a} ${px} ${py})" opacity="0.85"/>`;
        }
        // Inner center swirl
        s += `<circle cx="${cx}" cy="${cy}" r="${r*0.38}" fill="${color}" stroke="${dark}" stroke-width="0.6"/>`;
        s += `<path d="M${cx-r*0.15} ${cy+r*0.15} Q${cx+r*0.2} ${cy-r*0.1} ${cx} ${cy-r*0.25} Q${cx-r*0.2} ${cy} ${cx+r*0.25} ${cy+r*0.1}" fill="none" stroke="${dark}" stroke-width="0.6" opacity="0.6"/>`;
        return s;
      };
      if (stage === 1) {
        svg += `<path d="M50 110 Q48 98 52 82" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        // Small thorns
        svg += `<line x1="49" y1="100" x2="46" y2="98" stroke="${dark}" stroke-width="0.8"/>`;
        svg += drawLeaf(52, 90, 60, 82, 0.3);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 Q48 82 52 58" stroke="${stem}" stroke-width="3.5" fill="none"/>`;
        svg += `<line x1="49" y1="95" x2="46" y2="93" stroke="${dark}" stroke-width="0.8"/>`;
        svg += `<line x1="51" y1="78" x2="55" y2="76" stroke="${dark}" stroke-width="0.8"/>`;
        svg += drawLeaf(50, 92, 35, 80, 0.4) + drawLeaf(52, 75, 65, 65, 0.35);
        // Rose bud
        svg += `<path d="M52 58 Q48 48 50 44 Q54 48 52 58" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        svg += `<path d="M48 55 Q52 50 56 55" fill="${stem}" stroke="${dark}" stroke-width="0.6"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M50 110 Q48 72 52 42" stroke="${stem}" stroke-width="4" fill="none"/>`;
        svg += `<path d="M54 78 Q72 65 70 45" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += `<path d="M48 60 Q28 52 32 38" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += drawLeaf(50, 90, 30, 78, 0.4) + drawLeaf(52, 72, 70, 60, 0.35);
        svg += drawRose(52, 38, 9) + drawRose(70, 42, 7) + drawRose(30, 35, 7);
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 Q46 68 50 30" stroke="${stem}" stroke-width="5" fill="none"/>`;
        svg += `<path d="M50 82 Q25 70 28 48" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += `<path d="M50 72 Q75 58 72 38" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(50, 92, 28, 78, 0.45) + drawLeaf(38, 62, 22, 55, 0.35);
        svg += drawLeaf(62, 55, 78, 48, 0.35);
        svg += drawRose(50, 25, 11) + drawRose(27, 44, 8) + drawRose(73, 34, 8);
        if (stage === 5) {
          svg += `<path d="M50 88 Q18 78 20 55" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
          svg += `<path d="M50 85 Q82 75 80 52" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
          svg += drawRose(18, 52, 7) + drawRose(82, 49, 7);
        }
      }
    }

    /* ===== TULIP (heart) ===== */
    else if (plantType === 'heart') {
      if (stage === 1) {
        svg += `<path d="M50 110 L50 85" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(50, 100, 42, 90, 0.35);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 L50 58" stroke="${stem}" stroke-width="3.5" fill="none"/>`;
        svg += drawLeaf(50, 95, 32, 80, 0.4) + drawLeaf(50, 82, 68, 68, 0.4);
        // Closed tulip bud
        svg += `<path d="M46 58 Q44 46 50 40 Q56 46 54 58 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M50 110 L50 42" stroke="${stem}" stroke-width="4.5" fill="none"/>`;
        svg += drawLeaf(50, 94, 25, 78, 0.45) + drawLeaf(50, 78, 75, 62, 0.45);
        // Opening tulip cup
        svg += `<path d="M40 42 Q36 24 50 18 Q64 24 60 42 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        svg += `<path d="M44 40 Q44 28 50 22" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.35"/>`;
        svg += `<path d="M56 40 Q56 28 50 22" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.35"/>`;
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 L50 35" stroke="${stem}" stroke-width="5.5" fill="none"/>`;
        svg += drawLeaf(50, 92, 20, 74, 0.5) + drawLeaf(50, 76, 80, 58, 0.5);
        // Full tulip bloom with visible petals
        svg += `<path d="M35 38 Q30 14 50 8 Q70 14 65 38 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        svg += `<path d="M42 36 Q40 20 50 12" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>`;
        svg += `<path d="M50 36 L50 12" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>`;
        svg += `<path d="M58 36 Q60 20 50 12" stroke="${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>`;
        // Stamen
        svg += `<line x1="50" y1="22" x2="50" y2="16" stroke="#DAA520" stroke-width="1.5"/>`;
        svg += `<circle cx="50" cy="15" r="2" fill="#DAA520"/>`;
        if (stage === 5) {
          svg += `<path d="M50 76 Q25 62 22 42" stroke="${stem}" stroke-width="3" fill="none"/>`;
          svg += `<path d="M17 45 Q14 28 22 22 Q30 28 27 45 Z" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
          svg += `<path d="M50 84 Q75 70 78 50" stroke="${stem}" stroke-width="3" fill="none"/>`;
          svg += `<path d="M73 53 Q70 36 78 30 Q86 36 83 53 Z" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        }
      }
    }

    /* ===== CACTUS (star) ===== */
    else if (plantType === 'star') {
      if (stage === 1) {
        svg += `<path d="M45 110 Q43 98 45 88 Q50 82 55 88 Q57 98 55 110 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        // Spines
        svg += `<path d="M44 96 L40 94 M56 93 L60 91 M50 84 L50 80" stroke="${dark}" stroke-width="0.7" fill="none"/>`;
      }
      if (stage === 2) {
        svg += `<path d="M43 110 Q39 80 43 62 Q50 52 57 62 Q61 80 57 110 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        // Ribs
        svg += `<path d="M50 105 L50 56" stroke="${dark}" stroke-width="0.4" fill="none" opacity="0.3"/>`;
        svg += `<path d="M46 105 Q44 82 46 58" stroke="${dark}" stroke-width="0.3" fill="none" opacity="0.2"/>`;
        svg += `<path d="M54 105 Q56 82 54 58" stroke="${dark}" stroke-width="0.3" fill="none" opacity="0.2"/>`;
        svg += `<path d="M42 90 L38 88 M58 86 L62 84 M42 74 L38 72 M58 70 L62 68" stroke="${dark}" stroke-width="0.7" fill="none"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M42 110 Q36 68 42 42 Q50 30 58 42 Q64 68 58 110 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        // Left arm
        svg += `<path d="M42 74 Q32 70 30 60 Q28 54 32 50 Q36 54 36 64 Q38 70 42 74" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        // Right arm
        svg += `<path d="M58 68 Q68 64 70 54 Q72 48 68 44 Q64 48 64 58 Q62 64 58 68" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        svg += `<path d="M50 106 L50 34" stroke="${dark}" stroke-width="0.4" fill="none" opacity="0.3"/>`;
        svg += `<path d="M40 86 L36 84 M60 80 L64 78 M30 56 L26 54 M69 50 L73 48" stroke="${dark}" stroke-width="0.7" fill="none"/>`;
      }
      if (stage >= 4) {
        svg += `<path d="M41 110 Q33 58 41 30 Q50 18 59 30 Q67 58 59 110 Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
        svg += `<path d="M41 70 Q26 64 23 50 Q21 40 26 34 Q30 40 30 54 Q35 64 41 70" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        svg += `<path d="M59 60 Q74 54 77 40 Q79 30 74 24 Q70 30 70 44 Q65 54 59 60" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        svg += `<path d="M50 108 L50 22" stroke="${dark}" stroke-width="0.4" fill="none" opacity="0.25"/>`;
        svg += `<path d="M40 84 L36 82 M60 74 L64 72 M25 46 L21 44 M76 36 L80 34" stroke="${dark}" stroke-width="0.7" fill="none"/>`;
        // Cactus flower on top
        svg += drawFlower(50, 16, 5, 5, 2.5, 6, '#FF69B4', 3, '#FFD700');
        if (stage === 5) {
          svg += drawFlower(26, 30, 5, 3.5, 1.8, 4.5, '#FF69B4', 2, '#FFD700');
          svg += drawFlower(74, 20, 5, 3.5, 1.8, 4.5, '#FF69B4', 2, '#FFD700');
          svg += `<path d="M41 88 Q22 82 20 70 Q18 62 22 58 Q26 62 26 72 Q30 80 41 88" fill="${color}" stroke="${dark}" stroke-width="0.8"/>`;
        }
      }
    }

    /* ===== VINE (run) ===== */
    else if (plantType === 'run') {
      if (stage === 1) {
        svg += `<path d="M50 110 Q45 98 55 88 Q62 82 58 92" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += drawLeaf(55, 90, 62, 84, 0.3);
      }
      if (stage === 2) {
        svg += `<path d="M50 110 Q40 88 58 68 Q68 58 64 52" stroke="${stem}" stroke-width="3" fill="none"/>`;
        svg += drawLeaf(46, 94, 35, 86, 0.35) + drawLeaf(56, 76, 68, 68, 0.35);
        // Tendril curl
        svg += `<path d="M64 52 Q68 46 66 42 Q64 46 64 52" stroke="${stem}" stroke-width="1.5" fill="none"/>`;
      }
      if (stage === 3) {
        svg += `<path d="M50 110 Q36 78 58 52 Q72 38 64 28 Q56 22 50 32" stroke="${stem}" stroke-width="3.5" fill="none"/>`;
        svg += drawLeaf(44, 92, 30, 82, 0.4) + drawLeaf(54, 72, 70, 60, 0.4);
        svg += drawLeaf(48, 62, 35, 52, 0.35) + drawLeaf(58, 45, 70, 38, 0.3);
        svg += `<path d="M50 32 Q46 24 48 20 Q52 22 50 28" stroke="${stem}" stroke-width="1.5" fill="none"/>`;
      }
      if (stage >= 4) {
        svg += `<path d="M50 110 Q30 72 58 42 Q74 28 64 18 Q55 12 46 22" stroke="${stem}" stroke-width="4.5" fill="none"/>`;
        svg += `<path d="M50 88 Q70 78 78 60 Q82 48 76 40" stroke="${stem}" stroke-width="2.5" fill="none"/>`;
        svg += drawLeaf(42, 95, 28, 84, 0.45) + drawLeaf(55, 70, 72, 58, 0.4);
        svg += drawLeaf(48, 58, 32, 48, 0.35) + drawLeaf(60, 38, 74, 30, 0.3);
        svg += drawFlower(46, 18, 5, 4, 2, 5, '#E8B4D8', 2, '#fff');
        svg += drawFlower(76, 36, 5, 3.5, 1.8, 4.5, '#E8B4D8', 1.8, '#fff');
        if (stage === 5) {
          svg += `<path d="M50 98 Q22 85 18 62 Q14 45 22 35" stroke="${stem}" stroke-width="2" fill="none"/>`;
          svg += drawLeaf(32, 82, 18, 72, 0.4) + drawLeaf(20, 58, 12, 48, 0.35);
          svg += drawLeaf(16, 45, 10, 38, 0.3);
          svg += drawFlower(22, 32, 5, 3.5, 1.8, 4.5, '#E8B4D8', 1.8, '#fff');
          svg += drawFlower(56, 45, 5, 3, 1.5, 4, '#E8B4D8', 1.5, '#fff');
        }
      }
    }

    svg += `</svg>`;
    return svg;
  }

  // Draw little floating flowers above tile if streak > 3
  function buildStreakFlowers(streak, type) {
    if (streak < 3) return '';
    let count = Math.min(5, Math.floor(streak / 3));
    const color = PLANT_THEMES[type] || PLANT_THEMES.default;
    let html = '<div class="streak-flowers">';
    for(let i=0; i<count; i++) {
        let petals = '';
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * 360 - 90;
          const rad = a * Math.PI / 180;
          const px = 12 + Math.cos(rad) * 5;
          const py = 12 + Math.sin(rad) * 5;
          petals += `<ellipse cx="${px}" cy="${py}" rx="3.5" ry="2" fill="${color}" stroke="var(--stem-dark)" stroke-width="0.5" transform="rotate(${a} ${px} ${py})"/>`;
        }
        html += `<svg class="streak-flower" viewBox="0 0 24 24">
                   ${petals}
                   <circle cx="12" cy="12" r="2.5" fill="#FFE566" stroke="var(--stem-dark)" stroke-width="0.5"/>
                 </svg>`;
    }
    html += '</div>';
    return html;
  }

  /* ═══════════════════════════════════════════════════
     BUILD THE HABIT TILE
     ═══════════════════════════════════════════════════ */
  function buildTile(h) {
    const tile = document.createElement('div');
    const type = h.icon_key || 'leaf';
    const count = h.total_completions || 0;
    const streak = h.current_streak || 0;
    const isDone = h.completed_today;

    // Determine growth stage
    let stage = 0;
    let label = 'Seed';
    if (count >= 30) { stage = 5; label = 'Guardian'; }
    else if (count >= 14) { stage = 4; label = 'Flourish'; }
    else if (count >= 7)  { stage = 3; label = 'Bloom'; }
    else if (count >= 3)  { stage = 2; label = 'Growing'; }
    else if (count >= 1)  { stage = 1; label = 'Sprout'; }

    // Drooping logic: missed yesterday and not done today
    // (We will approximate droop if streak is 0 but it's not a seed)
    const isDrooping = (streak === 0 && count > 0 && !isDone);

    tile.className = `habit-tile plant-stage-${stage}${isDone ? ' done' : ''}${isDrooping ? ' drooping' : ''}`;
    tile.dataset.habitId = h.habit_id;
    tile.dataset.plant = type; // for custom css colors
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('role', 'button');
    tile.setAttribute('aria-label', `${h.habit_name}${isDone ? ', done' : ''}`);

    // Done Badge (top right)
    const badge = document.createElement('div');
    badge.className = 'habit-done-badge';
    tile.appendChild(badge);

    // Streak Flowers
    tile.insertAdjacentHTML('beforeend', buildStreakFlowers(streak, type));

    // Plant Body (SVG)
    const body = document.createElement('div');
    body.className = 'plant-body';
    body.innerHTML = buildPlantSVG(stage, type);
    tile.appendChild(body);

    // Info Section (Bottom)
    const info = document.createElement('div');
    info.className = 'plant-info';
    
    const name = document.createElement('div');
    name.className = 'habit-name';
    name.textContent = h.habit_name;
    info.appendChild(name);

    const pill = document.createElement('div');
    pill.className = 'habit-hatch-pill';
    pill.textContent = `${label} (${count})`;
    info.appendChild(pill);

    tile.appendChild(info);

    // Hover stat overlay (Glassmorphism)
    const overlay = document.createElement('div');
    overlay.className = 'habit-overlay';
    const todayLogged = isDone ? 'Watered today' : 'Needs watering';
    overlay.innerHTML = `
      <div class="overlay-title">${escHtml(h.habit_name)}</div>
      <div class="overlay-divider"></div>
      <div class="overlay-row">
        <span class="overlay-label">Plant Type</span>
        <span class="overlay-val" style="text-transform: capitalize;">${type}</span>
      </div>
      <div class="overlay-row">
        <span class="overlay-label">Total Waterings</span>
        <span class="overlay-val">${count}</span>
      </div>
      <div class="overlay-row">
        <span class="overlay-label">Streak Flow</span>
        <span class="overlay-val">${streak} days</span>
      </div>
      <div class="overlay-divider"></div>
      <div class="overlay-today${isDone ? ' logged' : ''}">${todayLogged}</div>
    `;
    tile.appendChild(overlay);

    return tile;
  }

  /* ═══════════════════════════════════════════════════
     TILE INTERACTIONS
     ═══════════════════════════════════════════════════ */
  let updating = new Set();

  function ripple(tile, e) {
    const r   = document.createElement('span');
    const box = tile.getBoundingClientRect();
    const sz  = Math.max(box.width, box.height);
    r.className = 'habit-ripple';
    r.style.cssText = `width:${sz}px;height:${sz}px;left:${(e.clientX||box.left+box.width/2)-box.left-sz/2}px;top:${(e.clientY||box.top+box.height/2)-box.top-sz/2}px`;
    tile.appendChild(r);
    setTimeout(() => r.remove(), 700);
  }

  async function toggleHabit(tile) {
    const hid = tile.dataset.habitId;
    if (updating.has(hid)) return;
    updating.add(hid);

    const wasDone = tile.classList.contains('done');
    const newDone = !wasDone;

    // Optimistic update
    tile.classList.toggle('done', newDone);
    if (newDone) {
      tile.classList.remove('drooping');
      tile.classList.add('milestone-pulse');
      setTimeout(() => tile.classList.remove('milestone-pulse'), 800);
    }
    
    updateProgressBar();
    updateTicker();

    // Update overlay text
    const overlayToday = tile.querySelector('.overlay-today');
    if (overlayToday) {
      overlayToday.textContent = newDone ? 'Watered today' : 'Needs watering';
      overlayToday.classList.toggle('logged', newDone);
    }

    try {
      const body = new URLSearchParams({ habit_id: hid, completed: newDone });
      const res  = await fetch(BASE + '/HabitLogServlet', {
        method: 'POST',
        body,
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Log failed');
      
      // We could reload completely here to update streaks/stages from server,
      // but for SPA speed we rely on optimistic UI until full refresh.
      
    } catch (_) {
      // Rollback on error
      tile.classList.toggle('done', wasDone);
      updateProgressBar();
      updateTicker();
    } finally {
      updating.delete(hid);
    }
  }

  function updateProgressBar() {
    const tiles = document.querySelectorAll('.habit-tile');
    const done  = document.querySelectorAll('.habit-tile.done').length;
    const total = tiles.length;
    const bar   = document.getElementById('garden-progress-fill');
    if (bar) bar.style.width = total > 0 ? `${(done / total) * 100}%` : '0';
  }

  function updateTicker() {
    const done  = document.querySelectorAll('.habit-tile.done').length;
    const total = document.querySelectorAll('.habit-tile').length;
    const tickEl = document.getElementById('ticker-num');
    if (tickEl) tickEl.textContent = done;
    const lbl = document.querySelector('.ticker-label');
    if (lbl) lbl.textContent = ` of ${total} habits done`;
  }

  /* ═══════════════════════════════════════════════════
     LOAD HABITS FROM SERVER
     ═══════════════════════════════════════════════════ */
  window.loadHabits = async function loadHabits() {
    const grid  = document.getElementById('habit-grid');
    const empty = document.getElementById('garden-empty');
    if (!grid) return;

    try {
      const res    = await fetch(BASE + '/HabitServlet', {
        headers: { 'Accept': 'application/json' }
      });
      const habits = await res.json();

      grid.innerHTML = '';
      if (!habits.length) {
        empty && empty.classList.remove('hidden');
        return;
      }
      empty && empty.classList.add('hidden');

      habits.forEach((h, i) => {
        const tile = buildTile(h);

        // Click to toggle
        tile.addEventListener('click', (e) => {
          if (e.target.closest('.habit-overlay')) return; // don't toggle when clicking overlay
          ripple(tile, e);
          toggleHabit(tile);
        });

        // Keyboard toggle
        tile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleHabit(tile);
          }
        });

        // Stagger entry animation
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(16px)';
        setTimeout(() => {
          tile.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          tile.style.opacity = '1';
          tile.style.transform = 'translateY(0)';
          // restore transition for hover later
          setTimeout(() => {
             tile.style.transition = ''; 
          }, 450);
        }, i * 65 + 100);

        grid.appendChild(tile);
      });

      updateProgressBar();
      updateTicker();
    } catch (err) {
      console.error('Failed to load habits:', err);
    }
  };

  function escHtml(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ═══════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════ */
  window.HabitGarden = {
    buildPlantSVG: buildPlantSVG
  };

  if (document.getElementById('habit-grid')) {
    loadHabits();
  }
}());
