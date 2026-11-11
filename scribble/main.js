(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs = {}) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const newSvg = (viewBox) => svg('svg', { viewBox, 'aria-hidden': 'true' });
  // seeded random, so every drawing is the same on each visit
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '#2a2622', RED = '#c9483a', CREAM = '#e9e2d2';

  /* ---------- the circle of marks ---------- */
  const enso = (node, seed, gapDeg) => {
    const r = rng(seed);
    const from = -60 + gapDeg, to = 300, step = 2.1;
    for (let a = from, i = 0; a <= to; a += step, i++) {
      const t = (a * Math.PI) / 180;
      const rad = 112 + 5 * Math.sin(t * 2 + 1) + 3 * Math.sin(t * 5) + (r() - 0.5) * 3;
      const x = 150 + rad * Math.cos(t), y = 150 + rad * Math.sin(t);
      const taper = Math.min(1, (a - from) / 30, (to - a) / 60 + 0.35);
      const bead = svg('ellipse', {
        class: 'bead', cx: f(x), cy: f(y), rx: f((2.2 + r() * 2.2) * taper), ry: f((1.6 + r() * 1.6) * taper),
        transform: `rotate(${f(a + 90 + (r() - 0.5) * 40)} ${f(x)} ${f(y)})`, fill: INK,
      });
      bead.style.setProperty('--o', f(0.65 + r() * 0.35));
      bead.style.animationDelay = `${i * 12}ms`;
      node.append(bead);
      if (i % 3 === 0) {
        const sh = svg('circle', { class: 'bead', cx: f(x + 4), cy: f(y + 4), r: 0.9, fill: INK });
        sh.style.setProperty('--o', '0.25');
        sh.style.animationDelay = `${i * 12}ms`;
        node.append(sh);
      }
    }
    const star = svg('g', { class: 'star', stroke: RED, 'stroke-width': 1, 'stroke-linecap': 'round' });
    for (let k = 0; k < 4; k++) {
      const t = (k * Math.PI) / 4 + 0.2, L = 8 + r() * 3;
      star.append(svg('line', { x1: f(150 - L * Math.cos(t)), y1: f(150 - L * Math.sin(t)), x2: f(150 + L * Math.cos(t)), y2: f(150 + L * Math.sin(t)) }));
    }
    node.append(star);
  };
  enso($('enso-top'), 7, 38);
  enso($('enso-end'), 23, 12);

  /* ---------- field of writing, with room left for the code ---------- */
  const asemic = () => {
    const c = $('asemic'), dpr = Math.min(devicePixelRatio || 1, 2);
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    // mask: a pair of braces left blank in the middle of the page
    const m = el('canvas', { width: W, height: H }).getContext('2d', { willReadFrequently: true });
    const size = Math.min(H * 0.8, W * 0.55);
    m.font = `${size}px Georgia, serif`; m.textAlign = 'center'; m.textBaseline = 'middle';
    m.lineWidth = size * 0.09; m.lineJoin = 'round';
    m.strokeText('{ }', W / 2, H / 2); m.fillText('{ }', W / 2, H / 2);
    const mask = m.getImageData(0, 0, W, H).data;
    const blank = (x, y) => mask[((y | 0) * W + (x | 0)) * 4 + 3] > 40;
    const r = rng(42);
    const colW = Math.min(W, 760), x0 = (W - colW) / 2;
    g.lineWidth = 0.7; g.lineCap = 'round';
    for (let y = 10; y < H - 4; y += 8.5) {
      const fade = Math.min(1, y / 70); // the writing thickens as it starts
      let x = x0 + r() * 12;
      while (x < x0 + colW - 10) {
        const len = 8 + r() * 34;
        if (r() < fade && !blank(x, y) && !blank(x + len / 2, y) && !blank(x + len, y)) {
          g.strokeStyle = r() < 0.025 ? RED : INK;
          g.globalAlpha = 0.3 + r() * 0.55;
          g.beginPath(); g.moveTo(x, y);
          for (let i = 2.5; i < len; i += 2.5) g.lineTo(x + i, y + (r() - 0.5) * 5.5);
          g.stroke();
        }
        x += len + 4 + r() * 5;
      }
    }
  };

  /* ---------- torn paper edges ---------- */
  document.querySelectorAll('.tear').forEach((t, i) => {
    const r = rng(300 + i * 17);
    t.setAttribute('viewBox', '0 0 1000 28');
    t.setAttribute('preserveAspectRatio', 'none');
    let d = 'M0 28L0 14';
    for (let x = 0; x <= 1000; x += 6 + r() * 16) d += `L${f(x)} ${f(r() < 0.04 ? 3 + r() * 4 : 11 + r() * 6)}`;
    d += 'L1000 14L1000 28Z';
    if (!t.closest('.dark')) t.append(svg('path', { d, fill: '#fbf8f0', transform: 'translate(0 -3)' }));
    t.append(svg('path', { d, fill: 'currentColor' }));
  });

  /* ---------- work: a blossoming branch for each job ---------- */
  const branch = (seed) => {
    const r = rng(seed), s = newSvg('0 0 130 130');
    const wood = svg('g', { fill: 'none', stroke: '#6f5148', 'stroke-linecap': 'round' });
    const bloom = svg('g');
    const grow = (x, y, ang, len, depth) => {
      const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      const bend = (r() - 0.5) * len * 0.4;
      wood.append(svg('path', {
        d: `M${f(x)} ${f(y)}Q${f((x + x2) / 2 + bend)} ${f((y + y2) / 2)} ${f(x2)} ${f(y2)}`, 'stroke-width': f(0.35 + depth * 0.32),
      }));
      if (depth === 0) {
        for (let k = 0; k < 3; k++) {
          bloom.append(svg('circle', { cx: f(x2 + (r() - 0.5) * 7), cy: f(y2 + (r() - 0.5) * 7), r: f(0.9 + r() * 0.9), fill: r() < 0.6 ? '#d27f78' : '#8d9d6c', opacity: 0.85 }));
        }
        return;
      }
      const kids = r() < 0.35 ? 3 : 2;
      for (let k = 0; k < kids; k++) grow(x2, y2, ang + (k - (kids - 1) / 2) * 0.62 + (r() - 0.5) * 0.45, len * (0.66 + r() * 0.14), depth - 1);
    };
    grow(65, 128, -Math.PI / 2 + (r() - 0.5) * 0.3, 30, 5);
    s.append(wood, bloom);
    return s;
  };

  const moreBtn = (p) => {
    const b = el('button', { className: 'more', type: 'button', textContent: 'open' });
    b.setAttribute('aria-label', `Open ${p.title}`);
    b.addEventListener('click', () => openLog(p.id));
    return b;
  };

  PROJECTS.filter((p) => p.category === 'work').forEach((p, i) => {
    $('jobs').append(
      el('li', { className: 'job reveal' },
        branch(60 + i * 31),
        el('div', {},
          el('p', { className: 'year', textContent: p.year }),
          el('h3', { textContent: p.title }),
          el('p', { textContent: p.description }),
          moreBtn(p)))
    );
  });

  /* ---------- projects: small drawings on paper scraps ---------- */
  const glyphs = [
    () => { // spiral
      let d = '';
      for (let t = 0; t < 22; t += 0.2) d += `${t ? 'L' : 'M'}${f(40 + t * 1.5 * Math.cos(t))} ${f(40 + t * 1.5 * Math.sin(t))}`;
      return `<path d="${d}" fill="none" stroke="${RED}" stroke-width="1"/>`;
    },
    () => { // maze
      let s = '';
      [[8, '150 14'], [17, '40 10 200 0'], [26, '70 9 200 0'], [35, '14 8 200 0']].forEach(([o, dash]) => {
        s += `<rect x="${o}" y="${o}" width="${80 - o * 2}" height="${80 - o * 2}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="${dash}"/>`;
      });
      return s;
    },
    () => { // seed head
      const r = rng(5); let s = `<path d="M40 44Q44 62 38 78" fill="none" stroke="${INK}" stroke-width="1"/>`;
      for (let k = 0; k < 26; k++) {
        const t = (k / 26) * Math.PI * 2, L = 18 + r() * 9;
        s += `<line x1="40" y1="34" x2="${f(40 + L * Math.cos(t))}" y2="${f(34 + L * Math.sin(t))}" stroke="${INK}" stroke-width=".7"/>`;
      }
      return s + `<circle cx="40" cy="34" r="2.2" fill="${INK}"/>`;
    },
    () => { // orbits
      let s = '';
      [10, 19, 28, 36].forEach((rad) => { s += `<circle cx="40" cy="40" r="${rad}" fill="none" stroke="${INK}" stroke-width=".7"/>`; });
      return s + `<circle cx="40" cy="40" r="2" fill="${INK}"/><circle cx="59" cy="40" r="2.4" fill="${RED}"/><circle cx="26" cy="64" r="1.8" fill="#b0842c"/><circle cx="34" cy="12" r="1.6" fill="${INK}"/>`;
    },
  ];

  PROJECTS.filter((p) => p.category === 'project').forEach((p, i) => {
    const r = rng(900 + i * 41);
    const art = newSvg('0 0 80 80');
    art.innerHTML = glyphs[i % glyphs.length]();
    const j = () => f(r() * 2.2);
    let poly = '';
    for (let k = 0; k <= 10; k++) poly += `${k * 10}% ${j()}%,`;
    for (let k = 1; k <= 6; k++) poly += `${f(100 - r() * 1.6)}% ${f(k * 16.6)}%,`;
    for (let k = 10; k >= 0; k--) poly += `${k * 10}% ${f(100 - r() * 2.2)}%,`;
    for (let k = 5; k >= 1; k--) poly += `${f(r() * 1.6)}% ${f(k * 16.6)}%,`;
    const paper = el('div', {},
      art,
      el('p', { className: 'year', textContent: p.year }),
      el('h3', { textContent: p.title }),
      el('p', { textContent: p.description }),
      moreBtn(p));
    paper.style.clipPath = `polygon(${poly.slice(0, -1)})`;
    const li = el('li', { className: 'scrap reveal' }, paper);
    li.style.transform = `rotate(${f((r() - 0.5) * 4)}deg)`;
    $('scraps').append(li);
  });

  /* ---------- one motion, many marks ---------- */
  (() => {
    const r = rng(77), g = svg('g', { stroke: '#4a5a44', 'stroke-linecap': 'round' });
    for (let i = 0; i < 420; i++) {
      const t = Math.pow(r(), 0.8);
      const cx = 60 + t * 600, cy = 30 + 190 * Math.pow(t, 1.6) - 60 * Math.sin(t * 3);
      const spread = 12 + 34 * Math.sin(t * Math.PI);
      const x = cx + (r() - 0.5) * spread * 2.4, y = cy + (r() - 0.5) * spread;
      const a = 0.5 + t * 0.5 + (r() - 0.5) * 0.6, L = 2 + r() * 4;
      g.append(svg('line', { x1: f(x), y1: f(y), x2: f(x + L * Math.cos(a)), y2: f(y + L * Math.sin(a)), 'stroke-width': f(0.6 + r() * 0.8), opacity: f(0.35 + r() * 0.6) }));
    }
    $('flock').append(g);
  })();

  (() => {
    const r = rng(13); let d = '';
    for (let x = 0; x < 1000; x += 1.2 + r() * 3) {
      const h = 18 + r() * 52, lean = (r() - 0.5) * 16;
      d += `M${f(x)} 90Q${f(x + lean * 0.2)} ${f(90 - h * 0.6)} ${f(x + lean)} ${f(90 - h)}`;
    }
    $('grass').append(svg('path', { d, fill: 'none', stroke: '#55704b', 'stroke-width': 0.6, opacity: 0.8, 'vector-effect': 'non-scaling-stroke' }));
  })();

  /* ---------- skills: a stitched sampler ---------- */
  const stitches = [
    () => [8, 17, 26, 35, 43].map((o) => `<rect x="${o}" y="${o}" width="${100 - o * 2}" height="${100 - o * 2}"/>`).join(''),
    () => [18, 32, 46, 60, 74, 88].map((q) => `<path d="M${q} 96A${q} ${q} 0 0 0 4 ${96 - q}"/>`).join(''),
    () => [14, 26, 38, 50, 62, 74, 86].map((y) => `<path d="M6 ${y}q11 -9 22 0t22 0 22 0 22 0"/>`).join(''),
    () => [-80, -60, -40, -20, 0, 20, 40, 60, 80].map((o) => `<path d="M${o} 0l100 100M${100 + o} 0l-100 100"/>`).join(''),
    () => {
      let s = '';
      for (let row = 0; row < 6; row++) for (let c = -1; c < 5; c++) s += `<path d="M${c * 22 + (row % 2) * 11 + 4} ${row * 15 + 22}a11 11 0 0 1 22 0"/>`;
      return s;
    },
    (r) => {
      let s = '';
      for (let k = 0; k < 16; k++) { const x = 12 + r() * 76, y = 12 + r() * 76; s += `<path d="M${f(x - 4)} ${f(y - 4)}l8 8M${f(x + 4)} ${f(y - 4)}l-8 8"/>`; }
      return s;
    },
  ];
  let n = 0;
  SKILLS.forEach(([title, skills], cat) => {
    $('legend').append(el('li', { className: `c${cat}`, textContent: title }));
    skills.forEach((skill) => {
      const s = newSvg('0 0 100 100');
      s.setAttribute('preserveAspectRatio', 'none');
      s.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2.5" clip-path="inset(0)">${stitches[(n * 5 + cat) % stitches.length](rng(200 + n))}</g>`;
      $('quilt').append(el('li', { className: `tile c${cat}`, title }, s, el('span', { textContent: skill })));
      n++;
    });
  });
  // fill the last row so the sampler stays a full rectangle at 5 or 3 columns
  while (n % 15) {
    const s = newSvg('0 0 100 100');
    s.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2.5">${stitches[n % 3]()}</g>`;
    const li = el('li', { className: 'tile' }, s);
    li.style.color = '#7d756a'; li.setAttribute('aria-hidden', 'true');
    $('quilt').append(li);
    n++;
  }

  /* ---------- night: two ripples, one water ---------- */
  [[230, 190, RED], [470, 220, '#8fa3d8']].forEach(([cx, cy, dot]) => {
    const g = svg('g', { fill: 'none', stroke: CREAM, 'stroke-width': 0.6 });
    g.style.setProperty('--cx', `${cx}px`); g.style.setProperty('--cy', `${cy}px`);
    for (let rad = 16; rad < 330; rad += 26) g.append(svg('circle', { cx, cy, r: rad, opacity: f(Math.max(0.15, 1 - rad / 360)) }));
    g.append(svg('circle', { cx, cy, r: 2.5, fill: dot, stroke: 'none' }));
    $('ripples').append(g);
  });

  const burst = (seed, tint) => {
    const r = rng(seed), s = newSvg('0 0 120 120');
    const g = svg('g', { stroke: tint, 'stroke-width': 0.7, 'stroke-linecap': 'round' });
    for (let i = 4; i < 190; i++) {
      const a = i * 2.39996, rad = Math.sqrt(i) * 3.9, L = 2.5 + r() * 2.5;
      g.append(svg('line', { x1: f(60 + rad * Math.cos(a)), y1: f(60 + rad * Math.sin(a)), x2: f(60 + (rad + L) * Math.cos(a)), y2: f(60 + (rad + L) * Math.sin(a)), opacity: f(0.4 + r() * 0.6) }));
    }
    s.append(g, svg('circle', { cx: 60, cy: 60, r: 1.6, fill: '#e8c46a' }));
    return s;
  };
  [['reading', CREAM], ['gymming', '#e3a79b'], ['making music', CREAM], ['the movies', '#c9c2ae']].forEach(([label, tint], i) => {
    const li = el('li', { className: 'reveal' }, burst(500 + i * 9, tint));
    li.append(el('span', { textContent: label }));
    $('bursts').append(li);
  });

  (() => { // the boat and its lantern
    const r = rng(31), b = $('boat');
    let water = '';
    for (let y = 150; y < 350; y += 9) for (let x = r() * 30; x < 700; x += 14 + r() * 40) water += `M${f(x)} ${y}h${f(4 + r() * 16)}`;
    b.append(svg('path', { d: water, stroke: CREAM, 'stroke-width': 0.5, opacity: 0.22 }));
    const rings = svg('g', { fill: 'none', stroke: '#e8c46a', 'stroke-width': 0.6 });
    [24, 52, 86, 126, 172].forEach((rad, i) => {
      const c = svg('ellipse', { class: 'ring', cx: 372, cy: 196, rx: rad * 1.25, ry: rad, opacity: f(0.7 - i * 0.12), transform: `rotate(${i * 14 - 20} 372 196)` });
      c.style.animationDelay = `${-i * 0.8}s`;
      rings.append(c);
    });
    const hull = svg('g', { class: 'hull', fill: 'none', stroke: CREAM, 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    hull.innerHTML = `
      <path d="M278 238h150l-14 16h-120Z"/>
      <path d="M300 238q-2-26 10-34q12 8 10 34"/>
      <path d="M372 238v-34"/>
      <path d="M364 204h16l-2-16q-6-8-12 0Z" fill="rgba(232,196,106,.35)" stroke="#e8c46a"/>
      <path d="M372 188v-8" stroke="#e8c46a"/>
      <circle cx="372" cy="198" r="1.6" fill="#e8c46a" stroke="none"/>`;
    b.append(rings, hull);
    for (let k = 0; k < 40; k++) b.append(svg('circle', { cx: f(r() * 700), cy: f(r() * 130), r: f(0.4 + r() * 0.9), fill: CREAM, opacity: f(0.2 + r() * 0.6) }));
  })();

  /* ---------- circles that practice becoming birds ---------- */
  (() => {
    const r = rng(88), m = $('morph'), cols = 12, rows = 7;
    const bird = (x, y, t, red, rot = 0) => {
      const w = 17 * t, rad = 8.5 * (1 - t * 0.72);
      const g = svg('g', { fill: 'none', stroke: red ? RED : INK, 'stroke-width': 1.1, 'stroke-linecap': 'round', transform: `translate(${f(x)} ${f(y)}) rotate(${f(rot)})` });
      g.append(svg('circle', { r: f(rad) }));
      if (t > 0.05) g.append(svg('path', { d: `M${f(-rad)} 0q${f(-w * 0.5)} ${f(-w * 0.75)} ${f(-w)} ${f(-w * 0.3)}M${f(rad)} 0q${f(w * 0.5)} ${f(-w * 0.75)} ${f(w)} ${f(-w * 0.3)}` }));
      return g;
    };
    for (let row = 0; row < rows; row++) {
      const t = row / (rows - 1);
      for (let c = 0; c < cols; c++) {
        if (row >= rows - 2 && r() < (row === rows - 1 ? 0.55 : 0.25)) continue; // some have already left
        const loose = Math.max(0, t - 0.6) * 22;
        m.append(bird(25 + c * 50 + (r() - 0.5) * loose, 22 + row * 50 + (r() - 0.5) * loose, t, (row + c) % 2 === 1, (r() - 0.5) * loose * 2));
      }
    }
    for (let k = 0; k < 7; k++) m.append(bird(40 + r() * 520, 370 + r() * 90, 1, r() < 0.4, (r() - 0.5) * 50));
  })();

  /* ---------- the thread ---------- */
  const thread = $('thread'), line = thread.querySelector('path');
  let total = 0;
  const layThread = () => {
    const main = thread.parentElement, W = main.clientWidth, H = main.scrollHeight;
    const r = rng(2026), col = Math.min(W - 40, 640);
    const top = $('enso-top').getBoundingClientRect(), end = $('enso-end').getBoundingClientRect();
    const sy = scrollY, y0 = top.top + sy + top.height / 2, y1 = end.top + sy + end.height / 2;
    let x = top.left + top.width / 2, y = y0, d = `M${f(x)} ${f(y)}`;
    while (y < y1 - 320) {
      const ny = y + 220 + r() * 160, nx = W / 2 + (r() - 0.5) * col * 0.9;
      d += `C${f(x)} ${f(y + (ny - y) * 0.5)} ${f(nx)} ${f(ny - (ny - y) * 0.5)} ${f(nx)} ${f(ny)}`;
      x = nx; y = ny;
    }
    const ex = end.left + end.width / 2;
    d += `C${f(x)} ${f(y + (y1 - y) * 0.5)} ${f(ex)} ${f(y1 - (y1 - y) * 0.6)} ${f(ex)} ${f(y1)}`;
    line.setAttribute('d', d);
    total = line.getTotalLength();
    line.style.strokeDasharray = total;
    pull();
  };
  const pull = () => {
    const main = thread.parentElement;
    const p = still ? 1 : Math.min(1, (scrollY + innerHeight * 0.75) / main.scrollHeight);
    line.style.strokeDashoffset = total * (1 - p);
  };
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { pull(); tick = false; });
  }, { passive: true });

  let resizeT;
  const relayout = () => { asemic(); layThread(); };
  addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(relayout, 150); });
  addEventListener('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layThread);
  relayout();

  /* ---------- reveal on scroll ---------- */
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));

  /* ---------- project viewer ---------- */
  const log = $('log');
  let media = [], at = 0, current = null;
  const show = (i) => {
    at = (i + media.length) % media.length;
    const src = '../' + media[at];
    const node = src.endsWith('.mp4')
      ? el('video', { src, autoplay: true, loop: true, muted: true, playsInline: true })
      : el('img', { src, alt: `${current.title} screenshot ${at + 1}` });
    $('frame').replaceChildren(node);
    $('count').textContent = `${at + 1} / ${media.length}`;
  };
  function openLog(id) {
    const p = PROJECTS.find((x) => x.id.toLowerCase() === String(id).toLowerCase());
    if (!p) return;
    current = p;
    media = p.images || [];
    $('log-year').textContent = p.year;
    $('log-title').textContent = p.title;
    $('log-body').textContent = p.longDescription;
    $('log-tech').replaceChildren(...p.technologies.map((t) => el('li', { textContent: t })));
    const links = [[p.githubUrl, 'view on github'], [p.liveUrl, 'view live site'], [p.articleUrl, 'read article']]
      .filter(([u]) => u)
      .map(([href, textContent]) => el('li', {}, el('a', { href, textContent, target: '_blank', rel: 'noopener' })));
    $('log-links').replaceChildren(...links);
    $('carousel').hidden = !media.length;
    $('carousel').querySelector('.carousel-bar').hidden = media.length < 2;
    if (media.length) show(0);
    if (!log.open) log.showModal();
    log.scrollTop = 0;
    history.replaceState(null, '', `#log/${p.id}`);
  }
  $('prev').addEventListener('click', () => show(at - 1));
  $('next').addEventListener('click', () => show(at + 1));
  $('log-close').addEventListener('click', () => log.close());
  log.addEventListener('click', (e) => { if (e.target === log) log.close(); });
  log.addEventListener('keydown', (e) => {
    if (media.length < 2) return;
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
  log.addEventListener('close', () => {
    $('frame').replaceChildren();
    history.replaceState(null, '', location.pathname + location.search);
  });
  const fromHash = () => { const m = location.hash.match(/^#log\/(.+)$/); if (m) openLog(decodeURIComponent(m[1])); };
  addEventListener('hashchange', fromHash);
  fromHash();
})();
