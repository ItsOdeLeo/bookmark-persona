// Shared data + character art for the Bookmark Persona card and gallery.
// 16 original glossy pets in the spirit of Grok Bot's mascots: one shape and color per type,
// two tall oval eyes, no mouth.
(function (global) {
  // Original nicknames (not 16Personalities or Keirsey names).
  const TYPES = {
    INTJ: { color: '#26272E', shape: 'cube', en: 'The Long-Game Lurker', zh: '长线潜伏者' },
    INTP: { color: '#13A699', shape: 'donut', en: 'The Rabbit-Hole Diver', zh: '兔子洞探险家' },
    ENTJ: { color: '#E03E45', shape: 'triangle', en: 'The Agenda Setter', zh: '议程制定者' },
    ENTP: { color: '#ECEAE4', shape: 'speech bubble', en: 'The Reply-Section Debater', zh: '评论区辩手' },
    INFJ: { color: '#6E56CF', shape: 'gem', en: 'The Quiet Oracle', zh: '安静的预言家' },
    INFP: { color: '#A99BF5', shape: 'moon', en: 'The 2 a.m. Poet', zh: '凌晨两点的诗人' },
    ENFJ: { color: '#FFA62B', shape: 'sun', en: 'The Hype Captain', zh: '气氛组组长' },
    ENFP: { color: '#FF4F8B', shape: 'light bulb', en: 'The Idea Firehose', zh: '灵感喷泉' },
    ISTJ: { color: '#5A6F8E', shape: 'canister', en: 'The Receipt Keeper', zh: '截图存证员' },
    ISFJ: { color: '#F7A1BC', shape: 'heart', en: 'The Silent Liker', zh: '默默点赞的人' },
    ESTJ: { color: '#2E9A5E', shape: 'rocket', en: 'The Ship-It Sergeant', zh: '上线督导' },
    ESFJ: { color: '#5CB8F2', shape: 'cloud', en: 'The Group-Chat Glue', zh: '群聊粘合剂' },
    ISTP: { color: '#6A7280', shape: 'hex nut', en: 'The Quiet Tinkerer', zh: '闷声拆解师' },
    ISFP: { color: '#D05FC4', shape: 'paint drop', en: 'The Aesthetic Curator', zh: '审美收藏家' },
    ESTP: { color: '#FF5B2E', shape: 'flame', en: 'The Hot-Take Sprinter', zh: '热点冲浪手' },
    ESFP: { color: '#FFD43B', shape: 'star', en: 'The Main Character', zh: '主角本角' },
  };

  const ORDER = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
  ];

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    const x = rgb(a), y = rgb(b);
    return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  const shade = (hex, t) => mix(hex, '#000000', t);
  const tint = (hex, t) => mix(hex, '#ffffff', t);
  function luminance(hex) {
    const [r, g, b] = rgb(hex).map(v => v / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function palette(type) {
    const c = TYPES[type].color;
    const lum = luminance(c);
    return {
      body: c,
      panel: lum > 0.88 ? '#ECEAE6' : lum < 0.2 ? '#E4E4E8' : tint(c, 0.8),
      accent: lum > 0.88 || lum < 0.2 ? '#5866E8' : lum > 0.55 ? shade(c, 0.45) : shade(c, 0.12),
      eye: lum > 0.55 ? '#1C1C21' : '#FFFFFF',
    };
  }

  // ---- SVG helpers ----
  const f = n => (Math.round(n * 10) / 10).toString();
  const C = (x, y, r, fill, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
  const E = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${extra}/>`;
  const P = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const R = (x, y, w, h, rx, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(rx)}" fill="${fill}" ${extra}/>`;
  const rot = (a, x, y) => `transform="rotate(${a} ${f(x)} ${f(y)})"`;

  // Polygon with rounded corners.
  function roundPoly(pts, r) {
    const n = pts.length;
    let d = '';
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const l1 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [p1[0] + (p0[0] - p1[0]) / l1 * rr, p1[1] + (p0[1] - p1[1]) / l1 * rr];
      const b = [p1[0] + (p2[0] - p1[0]) / l2 * rr, p1[1] + (p2[1] - p1[1]) / l2 * rr];
      d += `${i ? 'L' : 'M'}${f(a[0])},${f(a[1])} Q${f(p1[0])},${f(p1[1])} ${f(b[0])},${f(b[1])} `;
    }
    return d + 'Z';
  }
  function starPts(x, y, R, r, n = 5) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
      pts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]);
    }
    return pts;
  }
  const sparkle = (x, y, r, fill = '#fff') =>
    P(`M${x},${y - r} Q${x + r * 0.2},${y - r * 0.2} ${x + r},${y} Q${x + r * 0.2},${y + r * 0.2} ${x},${y + r} Q${x - r * 0.2},${y + r * 0.2} ${x - r},${y} Q${x - r * 0.2},${y - r * 0.2} ${x},${y - r} Z`, fill);

  // Eyes: tall ovals by default, with a few expressions.
  const eyes = {
    oval: (x, y, c, k = 1, tilt = 0) => [-1, 1].map(s => E(x + s * 36 * k, y, 12 * k, 21 * k, c, tilt ? rot(tilt, x + s * 36 * k, y) : '')).join(''),
    round: (x, y, c, k = 1) => [-1, 1].map(s => E(x + s * 38 * k, y, 15 * k, 18 * k, c)).join(''),
    // Flat or slanted lid over an oval: focused, or determined when slant > 0.
    lid: (x, y, c, slant = 0, k = 1) => [-1, 1].map(s => {
      const cx = x + s * 36 * k, w = 13 * k, h = 21 * k;
      const yi = y - h * 0.15 + slant * k, yo = y - h * 0.15 - slant * k; // inner, outer edge of the lid
      const xi = cx - s * w, xo = cx + s * w;
      return P(`M${f(xi)},${f(yi)} L${f(xo)},${f(yo)} C${f(xo)},${f(y + h * 1.1)} ${f(xi)},${f(y + h * 1.1)} ${f(xi)},${f(yi)} Z`, c);
    }).join(''),
    happy: (x, y, c, k = 1) => [-1, 1].map(s =>
      P(`M${f(x + s * 36 * k - 15 * k)},${f(y + 6 * k)} Q${f(x + s * 36 * k)},${f(y - 16 * k)} ${f(x + s * 36 * k + 15 * k)},${f(y + 6 * k)}`, 'none', `stroke="${c}" stroke-width="${f(9 * k)}" stroke-linecap="round"`)).join(''),
    closed: (x, y, c, k = 1) => [-1, 1].map(s =>
      P(`M${f(x + s * 36 * k - 15 * k)},${f(y - 4 * k)} Q${f(x + s * 36 * k)},${f(y + 13 * k)} ${f(x + s * 36 * k + 15 * k)},${f(y - 4 * k)}`, 'none', `stroke="${c}" stroke-width="${f(8 * k)}" stroke-linecap="round"`)).join(''),
    sleepy: (x, y, c, k = 1) => [-1, 1].map(s => {
      const cx = x + s * 36 * k;
      return P(`M${f(cx - 13 * k)},${f(y)} L${f(cx + 13 * k)},${f(y)} C${f(cx + 13 * k)},${f(y + 20 * k)} ${f(cx - 13 * k)},${f(y + 20 * k)} ${f(cx - 13 * k)},${f(y)} Z`, c);
    }).join(''),
  };
  const blush = (x, y, dx, k = 1, c = '#FF6F91') => [-1, 1].map(s => E(x + s * dx, y, 17 * k, 9 * k, c, 'opacity=".35"')).join('');

  // ---- The 16 pets ----
  // Each returns { body: silhouette path, light: [x, y] where the gloss sits, under/over: extra layers }.
  const ART = {
    // A black cube: solid, quiet, playing the long game.
    INTJ: p => ({
      body: roundPoly([[90, 150], [134, 104], [316, 104], [316, 286], [272, 332], [90, 332]], 22),
      light: [140, 170],
      over: [
        P(roundPoly([[90, 150], [134, 104], [316, 104], [272, 150]], 18), tint(p.body, 0.2)),
        P(roundPoly([[272, 150], [316, 104], [316, 286], [272, 332]], 18), shade(p.body, 0.35)),
        eyes.lid(180, 236, p.eye, 0),
      ],
    }),
    // A donut, because it's all about the hole.
    INTP: p => ({
      body: 'M68,218 A132,104 0 1 0 332,218 A132,104 0 1 0 68,218 Z M156,198 A44,24 0 1 1 244,198 A44,24 0 1 1 156,198 Z',
      light: [130, 150],
      over: [
        P('M156,198 A44,24 0 0 1 244,198 A44,15 0 0 0 156,198 Z', shade(p.body, 0.4)),
        eyes.round(200, 270, p.eye, 0.9),
      ],
    }),
    // A triangle that knows where this is going.
    ENTJ: p => ({
      body: roundPoly([[200, 70], [332, 322], [68, 322]], 44),
      light: [170, 150],
      over: [eyes.lid(200, 250, p.eye, 7)],
    }),
    // A speech bubble giving you the side-eye.
    ENTP: p => ({
      body: 'M152,92 H248 A74,74 0 0 1 322,166 V206 A74,74 0 0 1 248,280 H180 L114,336 L130,272 A74,74 0 0 1 78,206 V166 A74,74 0 0 1 152,92 Z',
      light: [130, 120],
      over: [eyes.oval(222, 186, p.eye, 0.95, 8)],
    }),
    // A gem: clear, faceted, sees through things.
    INFJ: p => ({
      body: roundPoly([[134, 108], [266, 108], [322, 178], [200, 334], [78, 178]], 14),
      light: [150, 140],
      over: [
        P(roundPoly([[134, 108], [266, 108], [322, 178], [78, 178]], 12), tint(p.body, 0.18), 'opacity=".9"'),
        P('M168,108 L148,178 M232,108 L252,178 M148,178 L200,334 M252,178 L200,334', 'none', `stroke="${tint(p.body, 0.35)}" stroke-width="3" opacity=".6"`),
        eyes.closed(200, 222, p.eye),
        sparkle(318, 92, 16), sparkle(92, 268, 10),
      ],
    }),
    // A cradle moon, up way past bedtime.
    INFP: p => ({
      body: 'M85.1,143.7 A128,128 0 1 0 314.9,143.7 A116,116 0 0 1 85.1,143.7 Z',
      light: [120, 200],
      over: [
        eyes.sleepy(200, 276, p.eye),
        blush(200, 304, 70, 0.8),
        `<text x="268" y="122" font-family="Inter Tight, Arial, sans-serif" font-weight="800" font-size="40" fill="${shade(p.body, 0.35)}">z</text>`,
        `<text x="302" y="86" font-family="Inter Tight, Arial, sans-serif" font-weight="800" font-size="28" fill="${shade(p.body, 0.35)}">z</text>`,
        sparkle(112, 92, 14, '#FFD43B'), sparkle(150, 52, 8, '#FFD43B'),
      ],
    }),
    // A little sun that cheers for everyone.
    ENFJ: p => ({
      under: Array.from({ length: 12 }, (_, i) => {
        const a = i * 30;
        return R(186, 56, 28, 50, 14, shade(p.body, 0.06), rot(a, 200, 214));
      }),
      body: 'M98,214 A102,102 0 1 0 302,214 A102,102 0 1 0 98,214 Z',
      light: [150, 160],
      over: [eyes.happy(200, 206, p.eye), blush(200, 240, 66)],
    }),
    // A light bulb that won't stop lighting up.
    ENFP: p => ({
      body: 'M144,256 A104,104 0 1 1 256,256 Q244,276 242,298 L158,298 Q156,276 144,256 Z',
      light: [150, 120],
      over: [
        R(154, 292, 92, 22, 10, '#D2D6DC'), R(160, 312, 80, 20, 10, '#B9BEC6'), R(174, 330, 52, 18, 9, '#8F959E'),
        eyes.oval(200, 172, p.eye, 1.1),
        sparkle(84, 70, 16, '#FFD43B'), sparkle(318, 64, 13, '#FFD43B'), sparkle(330, 170, 9, '#FFD43B'),
      ],
    }),
    // A canister that keeps every receipt, in tiny reading glasses.
    ISTJ: p => ({
      body: 'M96,128 V300 A104,30 0 0 0 304,300 V128 A104,30 0 0 0 96,128 Z',
      light: [130, 170],
      over: [
        E(200, 128, 104, 30, tint(p.body, 0.25)),
        E(200, 128, 84, 20, tint(p.body, 0.12)),
        eyes.oval(200, 224, p.eye, 0.85),
        C(169, 224, 27, 'none', 'stroke="#1C1C21" stroke-width="6"'), C(231, 224, 27, 'none', 'stroke="#1C1C21" stroke-width="6"'),
        P('M196,222 Q200,216 204,222', 'none', 'stroke="#1C1C21" stroke-width="6" stroke-linecap="round"'),
      ],
    }),
    // A soft heart that likes everything and says nothing.
    ISFJ: p => ({
      body: 'M200,332 C110,272 64,222 74,160 C84,102 150,90 200,140 C250,90 316,102 326,160 C336,222 290,272 200,332 Z',
      light: [130, 140],
      over: [eyes.happy(200, 200, p.eye), blush(200, 236, 70, 1, '#FF4F7E')],
    }),
    // A rocket that ships on schedule.
    ESTJ: p => ({
      under: [
        P(roundPoly([[128, 228], [70, 300], [80, 332], [132, 304]], 10), shade(p.body, 0.2)),
        P(roundPoly([[272, 228], [330, 300], [320, 332], [268, 304]], 10), shade(p.body, 0.2)),
        P('M164,306 Q200,392 236,306 Z', '#FF8A00'),
        P('M180,306 Q200,360 220,306 Z', '#FFD43B'),
      ],
      body: 'M200,56 C266,100 290,180 282,302 Q200,320 118,302 C110,180 134,100 200,56 Z',
      light: [160, 120],
      over: [
        P('M200,56 C226,72 244,94 256,120 Q200,104 144,120 C156,94 174,72 200,56 Z', '#F2F2F2'),
        eyes.lid(200, 206, p.eye, 6, 0.9),
      ],
    }),
    // A cloud that holds the group chat together.
    ESFJ: p => ({
      body: 'M112,300 C70,300 56,252 84,226 C70,180 116,148 150,164 C162,112 238,100 262,150 C302,134 342,170 326,214 C354,236 342,300 296,300 Z',
      light: [150, 150],
      over: [eyes.happy(200, 224, p.eye), blush(200, 256, 70)],
    }),
    // A hex nut that takes things apart in silence.
    ISTP: p => ({
      body: roundPoly([[141, 116], [259, 116], [318, 218], [259, 320], [141, 320], [82, 218]], 22),
      light: [140, 150],
      over: [
        P(roundPoly([[150, 132], [250, 132], [300, 218], [250, 304], [150, 304], [100, 218]], 18), 'none', `stroke="${tint(p.body, 0.25)}" stroke-width="5" opacity=".7"`),
        eyes.lid(200, 222, p.eye, -2),
      ],
    }),
    // A paint drop in a beret, curating the vibe.
    ISFP: p => ({
      body: 'M200,62 C236,120 316,170 316,236 C316,300 262,340 200,340 C138,340 84,300 84,236 C84,170 164,120 200,62 Z',
      light: [140, 200],
      over: [
        E(212, 110, 46, 14, '#2A2A30', rot(-14, 212, 110)), C(232, 92, 7, '#2A2A30'),
        eyes.oval(194, 236, p.eye, 0.95, -10),
        blush(194, 274, 66),
        C(338, 318, 12, p.body), C(362, 296, 7, p.body), C(60, 330, 8, p.body),
      ],
    }),
    // A flame with a hot take, winking.
    ESTP: p => ({
      body: 'M200,52 C214,108 262,120 272,70 C320,128 332,190 320,248 C308,310 260,340 200,340 C140,340 92,310 80,248 C70,192 98,150 132,122 C130,160 146,176 162,180 C150,128 168,86 200,52 Z',
      light: [130, 190],
      over: [
        P('M200,172 C216,206 252,214 254,258 C256,300 232,322 200,322 C168,322 144,300 146,262 C148,230 178,214 200,172 Z', '#FFD34A', 'opacity=".95"'),
        E(170, 262, 11, 19, '#1C1C21'),
        P('M215,264 Q230,246 245,264', 'none', 'stroke="#1C1C21" stroke-width="8" stroke-linecap="round"'),
      ],
    }),
    // A star in sunglasses: the main character.
    ESFP: p => ({
      body: roundPoly(starPts(200, 214, 144, 66), 20),
      light: [160, 150],
      over: [
        R(140, 192, 54, 38, 15, '#1C1C21'), R(206, 192, 54, 38, 15, '#1C1C21'),
        P('M192,206 Q200,200 208,206', 'none', 'stroke="#1C1C21" stroke-width="7" stroke-linecap="round"'),
        P('M150,202 l14,0', 'none', 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"'),
        P('M216,202 l14,0', 'none', 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"'),
        blush(200, 252, 58),
        sparkle(66, 92, 14, '#fff'), sparkle(340, 330, 10, '#fff'),
      ],
    }),
  };

  let uid = 0;
  function creatureSVG(type) {
    const p = palette(type);
    const a = ART[type](p);
    const id = 'pet' + (++uid);
    const [lx, ly] = a.light;
    const defs =
      `<defs>` +
      `<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${lx}" cy="${ly}" r="270">` +
      `<stop offset="0" stop-color="${tint(p.body, 0.42)}"/><stop offset=".42" stop-color="${p.body}"/><stop offset="1" stop-color="${shade(p.body, 0.32)}"/></radialGradient>` +
      `<clipPath id="${id}c"><path d="${a.body}" clip-rule="evenodd"/></clipPath>` +
      `<filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>` +
      `<filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>` +
      `</defs>`;
    const shine =
      `<g clip-path="url(#${id}c)">` +
      E(lx, ly - 10, 54, 30, '#fff', `opacity=".55" filter="url(#${id}b)" ${rot(-30, lx, ly - 10)}`) +
      E(200, 360, 170, 60, '#000', `opacity=".18" filter="url(#${id}b)"`) +
      E(lx - 6, ly - 18, 16, 8, '#fff', `opacity=".75" ${rot(-30, lx - 6, ly - 18)}`) +
      `</g>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${type} ${TYPES[type].shape}">` +
      defs +
      E(200, 356, 104, 13, '#000', `opacity=".16" filter="url(#${id}s)"`) +
      (a.under || []).join('') +
      P(a.body, `url(#${id}g)`, 'fill-rule="evenodd"') +
      shine +
      (a.over || []).join('') +
      `</svg>`;
  }

  global.Persona = { TYPES, ORDER, palette, creatureSVG, isType: t => /^[EI][SN][TF][JP]$/.test(t) && !!TYPES[t] };
})(window);
