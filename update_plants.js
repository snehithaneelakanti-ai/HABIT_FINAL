const fs = require('fs');
const file = 'js/garden.js';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// Keep lines 1-23 (header + PLANT_THEMES) and lines 158+ (rest of file)
const header = lines.slice(0, 23); // lines 1-23
const footer = lines.slice(157);   // lines 158+

const newPlantCode = `
  // Generate the SVG body for a plant based on its stage (0-5)
  function buildPlantSVG(stage, plantType) {
    const color = PLANT_THEMES[plantType] || PLANT_THEMES.default;
    const stem  = 'var(--stem-green)';
    const dark  = 'var(--stem-dark)';
    const brown = '#8B6F47';
    const dirt  = '#6B5A3E';

    let svg = \`<svg viewBox="0 0 100 120" width="100%" height="80px" fill="none" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">\`;

    // Soil mound
    svg += \`<ellipse cx="50" cy="112" rx="25" ry="6" fill="\${dirt}" opacity="0.5"/>\`;

    // Stage 0: Seed
    if (stage === 0) {
      svg += \`<ellipse cx="50" cy="106" rx="5" ry="3.5" fill="\${brown}" stroke="\${dark}" stroke-width="1.2"/>\`;
      svg += \`<path d="M50 103 Q53 98 51 103" stroke="\${stem}" stroke-width="1.2" fill="none"/>\`;
      return svg + \`</svg>\`;
    }

    /* ===== FERN (leaf) ===== */
    if (plantType === 'leaf' || !plantType) {
      if (stage === 1) {
        svg += \`<path d="M50 110 Q50 95 50 85" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M50 88 Q42 82 46 88" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 92 Q58 87 54 92" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 Q49 80 50 65" stroke="\${stem}" stroke-width="3.5" fill="none"/>\`;
        [[50,95,30,82],[50,88,70,75],[50,78,25,65],[50,72,68,58]].forEach(([sx,sy,ex,ey]) => {
          svg += \`<path d="M\${sx} \${sy} Q\${ex} \${ey+5} \${ex} \${ey}" fill="\${color}" stroke="\${dark}" stroke-width="0.8" opacity="0.8"/>\`;
        });
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 Q50 65 50 45" stroke="\${stem}" stroke-width="4" fill="none"/>\`;
        [[50,98,20,82],[50,92,78,76],[50,82,15,65],[50,75,82,58],[50,65,25,48],[50,58,72,42]].forEach(([sx,sy,ex,ey]) => {
          svg += \`<path d="M\${sx} \${sy} Q\${ex} \${ey+5} \${ex} \${ey}" fill="\${color}" stroke="\${dark}" stroke-width="0.8" opacity="0.85"/>\`;
          const mx = (sx+ex)/2, my = (sy+ey)/2;
          svg += \`<path d="M\${mx} \${my} Q\${mx-4} \${my-6} \${mx-8} \${my-3}" fill="\${color}" stroke="none" opacity="0.5"/>\`;
        });
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 Q50 55 50 30" stroke="\${stem}" stroke-width="5" fill="none"/>\`;
        [[50,100,12,82],[50,95,85,78],[50,85,8,65],[50,78,88,58],[50,68,15,48],[50,60,82,38],[50,50,22,32],[50,42,75,25]].forEach(([sx,sy,ex,ey], i) => {
          svg += \`<path d="M\${sx} \${sy} Q\${ex+2} \${ey+8} \${ex} \${ey}" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
          const mx = (sx+ex)/2, my = (sy+ey)/2;
          svg += \`<path d="M\${mx} \${my} Q\${mx + (i%2===0?-6:6)} \${my-5} \${mx + (i%2===0?-12:12)} \${my-2}" fill="\${color}" stroke="none" opacity="0.5"/>\`;
        });
        if (stage === 5) {
          svg += \`<path d="M50 30 Q45 20 42 22 Q40 28 45 28" stroke="\${stem}" stroke-width="2" fill="none"/>\`;
          svg += \`<path d="M50 30 Q55 18 58 20 Q60 26 55 26" stroke="\${stem}" stroke-width="2" fill="none"/>\`;
          svg += \`<circle cx="42" cy="22" r="3" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
          svg += \`<circle cx="58" cy="20" r="3" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        }
      }
    }
    /* ===== SUCCULENT (water) ===== */
    else if (plantType === 'water') {
      const cx = 50, baseY = 108;
      if (stage === 1) {
        svg += \`<ellipse cx="\${cx}" cy="\${baseY-8}" rx="10" ry="6" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<ellipse cx="\${cx}" cy="\${baseY-5}" rx="8" ry="5" fill="\${color}" stroke="\${dark}" stroke-width="1.2" opacity="0.7"/>\`;
      }
      if (stage === 2) {
        svg += \`<ellipse cx="\${cx}" cy="\${baseY-5}" rx="12" ry="6" fill="\${color}" stroke="\${dark}" stroke-width="1.2" opacity="0.6"/>\`;
        svg += \`<ellipse cx="\${cx-8}" cy="\${baseY-10}" rx="10" ry="5" fill="\${color}" stroke="\${dark}" stroke-width="1" transform="rotate(-25 \${cx-8} \${baseY-10})"/>\`;
        svg += \`<ellipse cx="\${cx+8}" cy="\${baseY-10}" rx="10" ry="5" fill="\${color}" stroke="\${dark}" stroke-width="1" transform="rotate(25 \${cx+8} \${baseY-10})"/>\`;
        svg += \`<ellipse cx="\${cx}" cy="\${baseY-16}" rx="8" ry="5" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
      }
      if (stage === 3) {
        for (let a = 0; a < 360; a += 60) {
          const rad = a * Math.PI / 180;
          const lx = cx + Math.cos(rad) * 14, ly = (baseY-18) + Math.sin(rad) * 8;
          svg += \`<ellipse cx="\${lx}" cy="\${ly}" rx="11" ry="5" fill="\${color}" stroke="\${dark}" stroke-width="1" transform="rotate(\${a} \${lx} \${ly})" opacity="0.85"/>\`;
        }
        svg += \`<circle cx="\${cx}" cy="\${baseY-18}" r="6" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
      }
      if (stage >= 4) {
        for (let ring = 0; ring < 2; ring++) {
          const r = ring === 0 ? 18 : 10;
          const count = ring === 0 ? 8 : 5;
          const yOff = baseY - 22 + ring * 4;
          for (let i = 0; i < count; i++) {
            const a = (i / count) * 360 + ring * 25;
            const rad = a * Math.PI / 180;
            const lx = cx + Math.cos(rad) * r, ly = yOff + Math.sin(rad) * (r * 0.45);
            const op = ring === 0 ? '0.75' : '0.9';
            svg += \`<ellipse cx="\${lx}" cy="\${ly}" rx="12" ry="5.5" fill="\${color}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${a} \${lx} \${ly})" opacity="\${op}"/>\`;
          }
        }
        svg += \`<circle cx="\${cx}" cy="\${baseY-22}" r="7" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        if (stage === 5) {
          svg += \`<path d="M50 \${baseY-28} Q50 \${baseY-50} 50 \${baseY-60}" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
          svg += \`<circle cx="50" cy="\${baseY-63}" r="5" fill="#FFB6C1" stroke="\${dark}" stroke-width="1"/>\`;
          svg += \`<circle cx="50" cy="\${baseY-63}" r="2" fill="#FF69B4"/>\`;
          for (let p = 0; p < 5; p++) {
            const pa = (p / 5) * Math.PI * 2;
            const px = 50 + Math.cos(pa) * 7, py = (baseY-63) + Math.sin(pa) * 7;
            svg += \`<ellipse cx="\${px}" cy="\${py}" rx="4" ry="2.5" fill="#FFB6C1" stroke="\${dark}" stroke-width="0.6" transform="rotate(\${p*72} \${px} \${py})"/>\`;
          }
        }
      }
    }
    /* ===== SUNFLOWER (sun) ===== */
    else if (plantType === 'sun') {
      if (stage === 1) {
        svg += \`<path d="M50 110 Q50 95 50 82" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M50 85 Q42 78 48 82" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M50 88 Q58 82 54 86" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 Q50 75 50 55" stroke="\${stem}" stroke-width="4" fill="none"/>\`;
        svg += \`<path d="M50 90 Q30 78 35 70 Q42 75 50 85" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 78 Q70 66 65 58 Q58 63 50 73" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<ellipse cx="50" cy="53" rx="5" ry="4" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 Q50 60 50 35" stroke="\${stem}" stroke-width="5" fill="none"/>\`;
        svg += \`<path d="M50 88 Q22 72 28 60 Q38 68 50 82" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 70 Q78 55 72 44 Q62 52 50 65" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const px = 50 + Math.cos(a) * 14, py = 33 + Math.sin(a) * 14;
          svg += \`<ellipse cx="\${px}" cy="\${py}" rx="6" ry="3" fill="\${color}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${(i/8)*360} \${px} \${py})" opacity="0.7"/>\`;
        }
        svg += \`<circle cx="50" cy="33" r="6" fill="#8B6914" stroke="\${dark}" stroke-width="1.2"/>\`;
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 Q50 55 50 28" stroke="\${stem}" stroke-width="6" fill="none"/>\`;
        svg += \`<path d="M50 85 Q18 68 25 52 Q35 62 50 78" fill="\${stem}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M50 68 Q82 52 75 38 Q65 48 50 62" fill="\${stem}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M50 90 Q75 80 70 70 Q62 76 50 85" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        const headY = 22;
        const petalCount = stage === 5 ? 16 : 12;
        const petalR = stage === 5 ? 18 : 15;
        for (let i = 0; i < petalCount; i++) {
          const a = (i / petalCount) * Math.PI * 2;
          const px = 50 + Math.cos(a) * petalR, py = headY + Math.sin(a) * petalR;
          const rx = stage === 5 ? 8 : 7, ry = stage === 5 ? 3.5 : 3;
          svg += \`<ellipse cx="\${px}" cy="\${py}" rx="\${rx}" ry="\${ry}" fill="\${color}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${(i/petalCount)*360} \${px} \${py})"/>\`;
        }
        svg += \`<circle cx="50" cy="\${headY}" r="\${stage === 5 ? 10 : 8}" fill="#8B6914" stroke="\${dark}" stroke-width="1.5"/>\`;
        svg += \`<circle cx="48" cy="\${headY-2}" r="1.5" fill="#5c3d0a" opacity="0.6"/>\`;
        svg += \`<circle cx="52" cy="\${headY+1}" r="1.5" fill="#5c3d0a" opacity="0.6"/>\`;
        svg += \`<circle cx="50" cy="\${headY-3}" r="1" fill="#5c3d0a" opacity="0.5"/>\`;
        if (stage === 5) {
          svg += \`<path d="M50 65 Q70 58 78 48" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
          for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2;
            const px = 80 + Math.cos(a) * 10, py = 42 + Math.sin(a) * 10;
            svg += \`<ellipse cx="\${px}" cy="\${py}" rx="5" ry="2.2" fill="\${color}" stroke="\${dark}" stroke-width="0.6" transform="rotate(\${(i/10)*360} \${px} \${py})"/>\`;
          }
          svg += \`<circle cx="80" cy="42" r="5" fill="#8B6914" stroke="\${dark}" stroke-width="1"/>\`;
        }
      }
    }
    /* ===== MOONFLOWER (moon) ===== */
    else if (plantType === 'moon') {
      if (stage === 1) {
        svg += \`<path d="M50 110 Q55 95 48 80" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
        svg += \`<path d="M48 84 Q42 78 46 82" fill="\${color}" stroke="\${dark}" stroke-width="0.8" opacity="0.7"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 Q58 80 45 55" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M54 90 Q35 80 42 72 Q48 78 54 85" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M48 70 Q62 62 58 55 Q52 60 48 66" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M45 55 Q42 45 45 42 Q48 48 45 55" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 Q60 75 42 40" stroke="\${stem}" stroke-width="4" fill="none"/>\`;
        svg += \`<path d="M55 88 Q28 75 35 62 Q42 70 52 82" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M47 62 Q68 52 62 42 Q55 48 46 58" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 - Math.PI/2;
          const px = 42 + Math.cos(a) * 12, py = 35 + Math.sin(a) * 12;
          svg += \`<ellipse cx="\${px}" cy="\${py}" rx="7" ry="4" fill="\${color}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${(i/5)*360-90} \${px} \${py})" opacity="0.7"/>\`;
        }
        svg += \`<circle cx="42" cy="35" r="4" fill="#E8E0F0" stroke="\${dark}" stroke-width="1"/>\`;
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 Q65 70 40 30" stroke="\${stem}" stroke-width="5" fill="none"/>\`;
        svg += \`<path d="M58 82 Q22 68 30 52 Q40 62 52 75" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M46 58 Q72 45 65 32 Q56 42 44 53" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        const petals = stage === 5 ? 8 : 6;
        const r = stage === 5 ? 18 : 14;
        for (let i = 0; i < petals; i++) {
          const a = (i / petals) * Math.PI * 2 - Math.PI/2;
          const px = 38 + Math.cos(a) * r, py = 25 + Math.sin(a) * r;
          const rx = stage === 5 ? 9 : 7, ry = stage === 5 ? 4 : 3.5;
          svg += \`<ellipse cx="\${px}" cy="\${py}" rx="\${rx}" ry="\${ry}" fill="\${color}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${(i/petals)*360-90} \${px} \${py})"/>\`;
        }
        svg += \`<circle cx="38" cy="25" r="\${stage === 5 ? 7 : 5}" fill="#E8E0F0" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<circle cx="38" cy="25" r="\${stage === 5 ? 12 : 9}" fill="\${color}" opacity="0.1"/>\`;
        if (stage === 5) {
          svg += \`<path d="M50 75 Q72 68 78 55" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            const px = 80 + Math.cos(a) * 10, py = 50 + Math.sin(a) * 10;
            svg += \`<ellipse cx="\${px}" cy="\${py}" rx="5" ry="2.5" fill="\${color}" stroke="\${dark}" stroke-width="0.6" transform="rotate(\${(i/6)*360} \${px} \${py})"/>\`;
          }
          svg += \`<circle cx="80" cy="50" r="4" fill="#E8E0F0" stroke="\${dark}" stroke-width="0.8"/>\`;
        }
      }
    }
    /* ===== ROSE BUSH (book) ===== */
    else if (plantType === 'book') {
      const roseShape = (cx, cy, r, fillColor) => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 - Math.PI/2;
          const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          s += \`<ellipse cx="\${px}" cy="\${py}" rx="\${r*0.7}" ry="\${r*0.4}" fill="\${fillColor}" stroke="\${dark}" stroke-width="0.8" transform="rotate(\${(i/5)*360-90} \${px} \${py})"/>\`;
        }
        s += \`<circle cx="\${cx}" cy="\${cy}" r="\${r*0.45}" fill="\${fillColor}" stroke="\${dark}" stroke-width="0.8"/>\`;
        s += \`<path d="M\${cx-r*0.2} \${cy} Q\${cx} \${cy-r*0.3} \${cx+r*0.2} \${cy}" stroke="\${dark}" stroke-width="0.7" fill="none"/>\`;
        return s;
      };
      if (stage === 1) {
        svg += \`<path d="M50 110 Q48 95 52 80" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
        svg += \`<path d="M49 100 L46 97" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M52 85 Q58 78 55 82" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 Q48 80 52 55" stroke="\${stem}" stroke-width="3.5" fill="none"/>\`;
        svg += \`<path d="M50 90 Q32 80 38 72 Q44 78 50 85" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M52 72 Q68 65 62 58 Q56 62 50 68" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M52 55 Q48 45 50 42 Q54 45 52 55" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M48 52 Q52 48 56 52" fill="\${stem}" stroke="\${dark}" stroke-width="0.6"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 Q48 70 52 40" stroke="\${stem}" stroke-width="4" fill="none"/>\`;
        svg += \`<path d="M50 88 Q25 75 32 62 Q40 70 50 82" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M52 68 Q75 58 68 48 Q60 55 50 63" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += roseShape(52, 35, 9, color);
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 Q45 65 50 30" stroke="\${stem}" stroke-width="5" fill="none"/>\`;
        svg += \`<path d="M50 80 Q25 65 28 45" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M50 75 Q75 60 72 40" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M50 90 Q28 78 34 68 Q42 74 50 84" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M38 58 Q20 50 25 42 Q30 48 38 54" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M62 52 Q78 45 72 38 Q66 44 62 50" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += roseShape(50, 25, 11, color);
        svg += roseShape(28, 40, 8, color);
        svg += roseShape(72, 35, 8, color);
        if (stage === 5) {
          svg += \`<path d="M50 85 Q15 75 18 55" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
          svg += \`<path d="M50 82 Q85 72 82 52" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
          svg += roseShape(16, 50, 7, color);
          svg += roseShape(84, 48, 7, color);
        }
      }
    }
    /* ===== TULIP (heart) ===== */
    else if (plantType === 'heart') {
      if (stage === 1) {
        svg += \`<path d="M50 110 L50 82" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M50 95 Q42 88 46 82" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 L50 58" stroke="\${stem}" stroke-width="3.5" fill="none"/>\`;
        svg += \`<path d="M50 95 Q30 80 38 70 Q44 78 50 88" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M50 80 Q70 68 62 58 Q56 65 50 74" fill="\${stem}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M46 58 Q44 45 50 40 Q56 45 54 58 Z" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 L50 42" stroke="\${stem}" stroke-width="4.5" fill="none"/>\`;
        svg += \`<path d="M50 92 Q22 75 32 62 Q40 72 50 85" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 75 Q78 60 68 48 Q60 58 50 68" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M42 42 Q38 22 50 18 Q62 22 58 42 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M45 40 Q44 28 50 24" stroke="\${dark}" stroke-width="0.6" fill="none" opacity="0.4"/>\`;
        svg += \`<path d="M55 40 Q56 28 50 24" stroke="\${dark}" stroke-width="0.6" fill="none" opacity="0.4"/>\`;
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 L50 35" stroke="\${stem}" stroke-width="5.5" fill="none"/>\`;
        svg += \`<path d="M50 90 Q15 72 28 55 Q38 66 50 82" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 72 Q85 55 72 40 Q62 52 50 65" fill="\${stem}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M36 38 Q32 12 50 8 Q68 12 64 38 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M42 35 Q40 18 50 12" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<path d="M50 35 L50 12" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<path d="M58 35 Q60 18 50 12" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<line x1="50" y1="22" x2="50" y2="16" stroke="#DAA520" stroke-width="1.5"/>\`;
        svg += \`<circle cx="50" cy="15" r="2" fill="#DAA520"/>\`;
        if (stage === 5) {
          svg += \`<path d="M50 72 Q25 60 22 42" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
          svg += \`<path d="M18 45 Q15 28 22 24 Q29 28 26 45 Z" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
          svg += \`<path d="M50 82 Q75 70 78 52" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
          svg += \`<path d="M74 55 Q71 38 78 34 Q85 38 82 55 Z" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        }
      }
    }
    /* ===== CACTUS (star) ===== */
    else if (plantType === 'star') {
      if (stage === 1) {
        svg += \`<path d="M45 110 Q42 95 45 85 Q50 78 55 85 Q58 95 55 110 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M44 95 L40 93 M56 92 L60 90 M50 82 L50 78" stroke="\${dark}" stroke-width="0.8" fill="none"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M43 110 Q38 78 43 60 Q50 50 57 60 Q62 78 57 110 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M50 105 L50 55" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<path d="M46 105 Q44 80 46 58" stroke="\${dark}" stroke-width="0.4" fill="none" opacity="0.2"/>\`;
        svg += \`<path d="M54 105 Q56 80 54 58" stroke="\${dark}" stroke-width="0.4" fill="none" opacity="0.2"/>\`;
        svg += \`<path d="M42 90 L37 87 M58 85 L63 82 M42 72 L37 70 M58 68 L63 65 M50 52 L50 48" stroke="\${dark}" stroke-width="0.8" fill="none"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M42 110 Q35 65 42 40 Q50 28 58 40 Q65 65 58 110 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M42 72 Q30 68 28 58 Q26 52 30 48 Q35 52 35 62 Q38 68 42 72" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M58 65 Q70 62 72 52 Q74 46 70 42 Q65 46 65 56 Q62 62 58 65" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 105 L50 32" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<path d="M40 85 L35 82 M60 78 L65 75 M29 55 L25 52 M71 48 L75 45" stroke="\${dark}" stroke-width="0.8" fill="none"/>\`;
      }
      if (stage >= 4) {
        svg += \`<path d="M41 110 Q32 55 41 28 Q50 15 59 28 Q68 55 59 110 Z" fill="\${color}" stroke="\${dark}" stroke-width="1.2"/>\`;
        svg += \`<path d="M41 68 Q25 62 22 48 Q20 38 25 32 Q30 38 30 52 Q35 62 41 68" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M59 58 Q75 52 78 38 Q80 28 75 22 Q70 28 70 42 Q65 52 59 58" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<path d="M50 108 L50 18" stroke="\${dark}" stroke-width="0.5" fill="none" opacity="0.3"/>\`;
        svg += \`<path d="M45 108 Q40 65 45 22" stroke="\${dark}" stroke-width="0.4" fill="none" opacity="0.2"/>\`;
        svg += \`<path d="M55 108 Q60 65 55 22" stroke="\${dark}" stroke-width="0.4" fill="none" opacity="0.2"/>\`;
        svg += \`<path d="M40 82 L35 79 M60 72 L65 69 M24 44 L19 41 M77 34 L82 31 M39 50 L34 47 M61 42 L66 39" stroke="\${dark}" stroke-width="0.8" fill="none"/>\`;
        svg += \`<circle cx="50" cy="14" r="5" fill="#FF69B4" stroke="\${dark}" stroke-width="1"/>\`;
        svg += \`<circle cx="50" cy="14" r="2" fill="#FFD700"/>\`;
        if (stage === 5) {
          svg += \`<circle cx="25" cy="28" r="4" fill="#FF69B4" stroke="\${dark}" stroke-width="0.8"/>\`;
          svg += \`<circle cx="25" cy="28" r="1.5" fill="#FFD700"/>\`;
          svg += \`<circle cx="75" cy="18" r="4" fill="#FF69B4" stroke="\${dark}" stroke-width="0.8"/>\`;
          svg += \`<circle cx="75" cy="18" r="1.5" fill="#FFD700"/>\`;
          svg += \`<path d="M41 85 Q20 80 18 68 Q16 60 20 55 Q24 60 24 70 Q28 78 41 85" fill="\${color}" stroke="\${dark}" stroke-width="1"/>\`;
        }
      }
    }
    /* ===== VINE (run) ===== */
    else if (plantType === 'run') {
      if (stage === 1) {
        svg += \`<path d="M50 110 Q45 95 55 85 Q60 80 58 90" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
        svg += \`<path d="M55 88 Q62 82 58 86" fill="\${color}" stroke="\${dark}" stroke-width="0.6"/>\`;
      }
      if (stage === 2) {
        svg += \`<path d="M50 110 Q40 85 60 65 Q70 55 65 50" stroke="\${stem}" stroke-width="3" fill="none"/>\`;
        svg += \`<path d="M48 92 Q38 85 42 80 Q46 82 48 88" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M58 72 Q68 66 64 62 Q60 64 56 68" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<path d="M65 52 Q70 46 68 42 Q66 45 65 50" stroke="\${stem}" stroke-width="1.5" fill="none"/>\`;
      }
      if (stage === 3) {
        svg += \`<path d="M50 110 Q35 75 60 48 Q72 35 65 25 Q58 18 52 28" stroke="\${stem}" stroke-width="3.5" fill="none"/>\`;
        [[45,88,-1],[55,68,1],[62,48,-1],[60,32,1]].forEach(([lx,ly,dir]) => {
          svg += \`<path d="M\${lx} \${ly} Q\${lx+dir*12} \${ly-8} \${lx+dir*8} \${ly-12} Q\${lx+dir*4} \${ly-6} \${lx} \${ly}" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
        });
        svg += \`<path d="M52 28 Q48 20 50 16 Q54 18 52 24" stroke="\${stem}" stroke-width="1.5" fill="none"/>\`;
      }
      if (stage >= 4) {
        svg += \`<path d="M50 110 Q30 70 58 40 Q72 25 62 12 Q55 5 48 15" stroke="\${stem}" stroke-width="4.5" fill="none"/>\`;
        svg += \`<path d="M50 85 Q72 72 80 55 Q85 42 78 35" stroke="\${stem}" stroke-width="2.5" fill="none"/>\`;
        [[42,92,-1],[58,65,1],[65,45,-1],[58,25,1],[78,48,-1],[82,38,1]].forEach(([lx,ly,dir]) => {
          svg += \`<path d="M\${lx} \${ly} Q\${lx+dir*14} \${ly-10} \${lx+dir*10} \${ly-15} Q\${lx+dir*5} \${ly-7} \${lx} \${ly}" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
        });
        svg += \`<circle cx="48" cy="12" r="4" fill="#E8B4D8" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<circle cx="48" cy="12" r="1.5" fill="#fff"/>\`;
        svg += \`<circle cx="78" cy="32" r="3" fill="#E8B4D8" stroke="\${dark}" stroke-width="0.8"/>\`;
        svg += \`<circle cx="78" cy="32" r="1.2" fill="#fff"/>\`;
        if (stage === 5) {
          svg += \`<path d="M50 95 Q20 80 15 60 Q12 42 20 30" stroke="\${stem}" stroke-width="2" fill="none"/>\`;
          [[30,78,1],[18,55,-1],[16,40,1]].forEach(([lx,ly,dir]) => {
            svg += \`<path d="M\${lx} \${ly} Q\${lx+dir*12} \${ly-8} \${lx+dir*8} \${ly-12} Q\${lx+dir*4} \${ly-6} \${lx} \${ly}" fill="\${color}" stroke="\${dark}" stroke-width="0.8"/>\`;
          });
          svg += \`<circle cx="20" cy="28" r="3.5" fill="#E8B4D8" stroke="\${dark}" stroke-width="0.8"/>\`;
          svg += \`<circle cx="20" cy="28" r="1.3" fill="#fff"/>\`;
          svg += \`<circle cx="58" cy="42" r="3" fill="#E8B4D8" stroke="\${dark}" stroke-width="0.8"/>\`;
          svg += \`<circle cx="58" cy="42" r="1.2" fill="#fff"/>\`;
        }
      }
    }

    svg += \`</svg>\`;
    return svg;
  }`;

const result = [...header, newPlantCode, ...footer].join('\n');
fs.writeFileSync(file, result, 'utf8');
console.log('OK — garden.js updated with new plant SVGs. New length:', result.split('\n').length, 'lines');
