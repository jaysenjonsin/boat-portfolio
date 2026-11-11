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
  const art = (viewBox, inner) => {
    const s = svg('svg', { viewBox, 'aria-hidden': 'true' });
    s.innerHTML = inner;
    return s;
  };
  // seeded random, so every drawing is the same on each visit
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '#25272e', RED = '#d1492e';

  /* ---------- the J, sketched over a few passes of the pen ---------- */
  // Hook ends near (62, 168) and the bar starts near (96, 60) in the mark's 280 x 270 box.
  const MARK_TAIL = [62, 168], MARK_HEAD = [96, 60];
  const sketchJ = (node, seed) => {
    const r = rng(seed);
    for (let pass = 0; pass < 5; pass++) {
      const dx = (r() - 0.5) * 5, dy = (r() - 0.5) * 5, dr = (r() - 0.5) * 6, rad = 52 + dr;
      const g = svg('g', {
        fill: 'none', stroke: INK, 'stroke-width': pass ? 1.2 : 1.8, 'stroke-linecap': 'round', opacity: pass ? 0.75 : 1,
        transform: `rotate(${f((r() - 0.5) * 3.5)} 140 135)`,
      });
      const bar = svg('path', { pathLength: 1, d: `M${f(96 + dx - r() * 8)} ${f(60 + dy)}Q${f(150 + dx)} ${f(57 + dy + (r() - 0.5) * 4)} ${f(214 + dx + r() * 8)} ${f(60 + dy)}` });
      const stem = svg('path', {
        pathLength: 1,
        d: `M${f(166 + dx)} ${f(60 + dy - r() * 5)}V${f(182 + dy)}a${f(rad)} ${f(rad)} 0 0 1 ${f(-rad * 2)} 0v${f(-12 - r() * 8)}`,
      });
      bar.style.animationDelay = `${pass * 0.12}s`;
      stem.style.animationDelay = `${0.35 + pass * 0.12}s`;
      g.append(bar, stem);
      node.append(g);
    }
    node.append(svg('circle', { class: 'dot', cx: 118, cy: 112, r: 6, fill: RED }));
  };
  sketchJ($('mark-top'), 7);
  sketchJ($('mark-end'), 23);

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
    if (!t.closest('.night')) t.append(svg('path', { d, fill: '#fcf9f1', transform: 'translate(0 -3)' }));
    t.append(svg('path', { d, fill: 'currentColor' }));
  });

  /* ---------- fall: a few leaves in outline, settled along the bottom and the edges ---------- */
  (() => {
    const r = rng(121), tones = ['#8a6a4a', '#9a7a52', '#7d6a5a'];
    const place = (x, y) => {
      const tone = tones[Math.floor(r() * tones.length)];
      const l = art('0 0 24 30', `<path d="M12 2Q22 10 12 26Q2 10 12 2Z" fill="none" stroke="${tone}" stroke-width="1" stroke-linejoin="round"/>
        <path d="M12 6V29M12 12l4 -3M12 16l-4 -3M12 20l3.5 -2.5" fill="none" stroke="${tone}" stroke-width=".7" stroke-linecap="round"/>`);
      l.style.left = `${f(x)}%`; l.style.top = `${f(y)}%`;
      l.style.setProperty('--s', `${f(1 + r() * 0.8)}rem`);
      l.style.setProperty('--r', `${f(r() * 360)}deg`);
      $('leaves').append(l);
    };
    for (let k = 0; k < 13; k++) place(r() * 98, 92 + r() * 5);
    for (let k = 0; k < 6; k++) place(r() < 0.5 ? r() * 8 : 90 + r() * 8, 14 + r() * 70);
  })();

  /* ---------- shared pen settings for the small drawings ---------- */
  const line = `fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"`;
  const accent = `fill="none" stroke="${RED}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
  const moreBtn = (p) => {
    const b = el('button', { className: 'more', type: 'button', textContent: 'open' });
    b.setAttribute('aria-label', `Open ${p.title}`);
    b.addEventListener('click', () => openLog(p.id));
    return b;
  };

  /* ---------- work: four stars joined into a constellation, and a traveller that follows the line ---------- */
  (() => {
    const MOON = '#e8e3d4', r = rng(41);
    let dust = '';
    for (let k = 0; k < 70; k++) dust += `<circle cx="${f(r() * 1000)}" cy="${f(r() * 800)}" r="${f(0.5 + r() * 1.1)}" fill="${MOON}" opacity="${f(0.15 + r() * 0.5)}"/>`;
    $('dust').innerHTML = dust;

    PROJECTS.filter((p) => p.category === 'work').forEach((p, k) => {
      let rays = '';
      const big = 13 - k * 1.5;
      for (let j = 0; j < 4; j++) { const a = (j / 4) * Math.PI + 0.3, L = j % 2 ? big * 0.55 : big; rays += `M${f(-L * Math.cos(a))} ${f(-L * Math.sin(a))}L${f(L * Math.cos(a))} ${f(L * Math.sin(a))}`; }
      const star = art('-16 -16 32 32', `<path d="${rays}" fill="none" stroke="${MOON}" stroke-width="1" stroke-linecap="round"/><circle r="2.4" fill="${k ? MOON : '#e8a08f'}"/>`);
      star.classList.add('star');
      $('jobs').append(el('li', { className: 'job reveal' }, star,
        el('div', {},
          el('p', { className: 'year', textContent: p.year }),
          el('h3', { textContent: p.title }),
          el('p', { textContent: p.description }),
          moreBtn(p))));
    });

    // both travellers are drawn pointing right, then turned to face along the line
    const travellers = {
      star: `<path d="M-6 0H-46" stroke="${MOON}" stroke-width="1" opacity=".55"/><path d="M-46 0H-70" stroke="${MOON}" stroke-width=".8" opacity=".22"/>
        <path d="M-7 -3L-30 -5M-7 3L-27 5" stroke="${MOON}" stroke-width=".7" opacity=".35"/>
        <path d="M0 -7L1.8 -1.8 7 0 1.8 1.8 0 7 -1.8 1.8 -7 0 -1.8 -1.8Z" fill="${MOON}"/>`,
      rocket: `<path d="M-11 -2.500L-19 0 -11 2.500" fill="none" stroke="#e8a08f" stroke-width="1.2" stroke-linejoin="round"/>
        <g fill="#1d2130" stroke="${MOON}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
          <path d="M-10 -5l-6 -5v6ZM-10 5l-6 5v-6Z"/><path d="M-10 -5Q4 -8 13 0Q4 8 -10 5Z"/><circle cx="3" cy="0" r="2.2"/></g>`.replace(/2\.500/g, '2.5'),
    };
    const sky = $('star-lines');
    let pts = [], kind = 'star';
    try { kind = localStorage.getItem('traveller') === 'rocket' ? 'rocket' : 'star'; } catch (e) { /* private mode */ }

    const join = () => {
      const box = sky.getBoundingClientRect();
      pts = [...document.querySelectorAll('#jobs .star')].map((s) => { const b = s.getBoundingClientRect(); return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top]; });
      let d = '';
      pts.forEach(([x, y], k) => {
        if (!k) return;
        const [px, py] = pts[k - 1], len = Math.hypot(x - px, y - py), ux = (x - px) / len, uy = (y - py) / len;
        d += `M${f(px + ux * 22)} ${f(py + uy * 22)}L${f(x - ux * 22)} ${f(y - uy * 22)}`;   // stop short of each star
      });
      sky.innerHTML = `<path d="${d}" fill="none" stroke="${MOON}" stroke-width=".8" stroke-linecap="round" stroke-dasharray="2 6" opacity=".45"/><g id="traveller"><g transform="scale(${kind === 'rocket' ? 1.35 : 1})">${travellers[kind]}</g></g>`;
      travel();
    };
    // the traveller sits where the line crosses the middle of the screen
    const travel = () => {
      const t = document.getElementById('traveller');
      if (!t || pts.length < 2) return;
      const top = sky.getBoundingClientRect().top, first = pts[0][1], last = pts[pts.length - 1][1];
      const y = Math.max(first, Math.min(last, innerHeight * 0.5 - top));
      let k = 1;
      while (k < pts.length - 1 && pts[k][1] < y) k++;
      const [ax, ay] = pts[k - 1], [bx, by] = pts[k], u = (y - ay) / (by - ay || 1);
      t.setAttribute('transform', `translate(${f(ax + (bx - ax) * u)} ${f(y)}) rotate(${f((Math.atan2(by - ay, bx - ax) * 180) / Math.PI)})`);
    };
    $('pick').querySelectorAll('button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.traveller === kind));
      b.addEventListener('click', () => {
        kind = b.dataset.traveller;
        try { localStorage.setItem('traveller', kind); } catch (e) { /* private mode */ }
        $('pick').querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
        join();
      });
    });
    addEventListener('scroll', travel, { passive: true });
    addEventListener('resize', join);
    addEventListener('load', join);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(join);
    join();
  })();

  /* ---------- projects: index cards with a doodle each ---------- */
  const cardArt = {
    // a paper plane and the loop it just flew
    Amelia: `<path d="M8 62c14 10 30 0 22-12-6-9-18 2-8 9" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="2 4" stroke-linecap="round"/>
      <g ${line}><path d="M24 44l48-26-18 46-9-16Z"/><path d="M45 48l27-30"/></g>`,
    // a stack of flashcards
    Knoted: `<g ${line} fill="#fcf9f1"><rect x="20" y="20" width="44" height="30" rx="2" transform="rotate(-9 42 35)"/><rect x="20" y="26" width="44" height="30" rx="2" transform="rotate(4 42 41)"/><rect x="18" y="34" width="44" height="30" rx="2"/></g>
      <path ${accent} stroke-width="1.2" d="M25 44h22M25 51h30M25 57h14"/>`,
    // a spark over a clipboard
    Ignition: `<g ${line}><rect x="20" y="22" width="40" height="50" rx="3"/><path d="M32 22v-5h16v5"/><path d="M28 40h24M28 50h24M28 60h14"/></g>
      <path ${accent} d="M66 10v9M66 31v9M51 25h9M72 25h9M56 15l5 5M76 15l-5 5M56 35l5-5M76 35l-5-5"/>`,
    // a ticket stub
    EventFinder: `<g ${line}><path d="M10 28h60v9a6 6 0 0 0 0 12v9H10v-9a6 6 0 0 0 0-12Z" transform="rotate(-8 40 43)"/><path d="M52 27v33" stroke-dasharray="2 4" transform="rotate(-8 40 43)"/></g>
      <path ${accent} stroke-width="1.2" d="M30 34l2.6 6 6.4.5-4.9 4.2 1.6 6.3-5.7-3.5-5.7 3.5 1.6-6.3-4.9-4.2 6.4-.5Z" transform="rotate(-8 40 43)"/>`,
  };

  PROJECTS.filter((p) => p.category === 'project').forEach((p, i) => {
    const r = rng(900 + i * 41);
    const li = el('li', { className: 'card reveal' },
      art('0 0 80 80', cardArt[p.id] || ''),
      el('p', { className: 'year', textContent: p.year }),
      el('h3', { textContent: p.title }),
      el('p', { textContent: p.description }),
      moreBtn(p));
    li.style.transform = `rotate(${f((r() - 0.5) * 3.6)}deg)`;
    li.style.setProperty('--tape', `${f((r() - 0.5) * 10)}deg`);
    $('cards').append(li);
  });

  /* ---------- one motion, many marks ---------- */
  (() => {
    const r = rng(77), g = svg('g', { stroke: '#4b4a3c', 'stroke-linecap': 'round' });
    for (let i = 0; i < 420; i++) {
      const t = Math.pow(r(), 0.8);
      const cx = 60 + t * 600, cy = 30 + 190 * Math.pow(t, 1.6) - 60 * Math.sin(t * 3);
      const spread = 12 + 34 * Math.sin(t * Math.PI);
      const x = cx + (r() - 0.5) * spread * 2.4, y = cy + (r() - 0.5) * spread;
      const a = 0.5 + t * 0.5 + (r() - 0.5) * 0.6, L = 2 + r() * 4;
      g.append(svg('line', { x1: f(x), y1: f(y), x2: f(x + L * Math.cos(a)), y2: f(y + L * Math.sin(a)), 'stroke-width': f(0.6 + r() * 0.8), opacity: f(0.35 + r() * 0.6) }));
    }
    $('flock').append(g);
    // a few of the marks have become birds
    [[505, 118, 1, 0], [560, 86, 0.85, 1], [612, 128, 0.7, 0], [628, 56, 1.1, 1], [676, 92, 0.8, 0], [452, 70, 0.75, 1], [690, 28, 0.9, 0]].forEach(([bx, by, s, red]) => {
      const b = svg('g', { fill: 'none', stroke: red ? RED : INK, 'stroke-width': 1.1, 'stroke-linecap': 'round', transform: `translate(${bx} ${by}) rotate(${f((r() - 0.5) * 30)}) scale(${s})` });
      const wing = svg('path', { d: 'M-2.5 0q-8 -12 -17 -5M2.5 0q8 -12 17 -5' });
      b.append(svg('circle', { r: 2.5 }), wing);
      $('flock').append(b);
    });
  })();

  (() => {
    const r = rng(13); let d = '';
    for (let x = 0; x < 1000; x += 1.2 + r() * 3) {
      const h = 18 + r() * 52, lean = (r() - 0.5) * 16;
      d += `M${f(x)} 90Q${f(x + lean * 0.2)} ${f(90 - h * 0.6)} ${f(x + lean)} ${f(90 - h)}`;
    }
    $('grass').append(svg('path', { d, fill: 'none', stroke: '#5f7450', 'stroke-width': 0.6, opacity: 0.8, 'vector-effect': 'non-scaling-stroke' }));
  })();

  /* ---------- skills: a row of keys per category ---------- */
  SKILLS.forEach(([title, skills], cat) => {
    const r = rng(40 + cat * 7);
    const row = el('ul');
    skills.forEach((skill) => {
      const li = el('li', { className: 'key', textContent: skill });
      li.style.setProperty('--r', `${f((r() - 0.5) * 3.2)}deg`);
      row.append(li);
    });
    $('keys').append(el('div', { className: `keyrow s${cat} reveal` }, el('h3', { textContent: title }), row));
  });

  /* ---------- about: a tune written out by hand ---------- */
  (() => {
    const r = rng(64), staff = $('staff');
    const lines = svg('g', { fill: 'none', stroke: INK, 'stroke-width': 0.7, opacity: 0.75 });
    const drift = (x) => 6 * Math.sin(x / 190) + 3 * Math.sin(x / 67); // the whole staff wanders a little
    for (let k = 0; k < 5; k++) {
      let d = '';
      for (let x = 0; x <= 1200; x += 30) d += `${x ? 'L' : 'M'}${x} ${f(34 + k * 9 + drift(x) + (r() - 0.5) * 0.8)}`;
      lines.append(svg('path', { d }));
    }
    // scale steps above the bottom line, and how long each is held
    const tune = [[1, 1], [3, 1], [5, 2], [6, 1], [5, 1], [3, 2], [2, 1], [3, 1], [5, 1], [8, 1], [6, 2], [5, 2],
                  [8, 1], [6, 1], [5, 2], [3, 1], [2, 1], [1, 2], [2, 1], [3, 1], [5, 1], [3, 1], [2, 2], [1, 4]];
    const notes = svg('g', { stroke: INK, 'stroke-width': 1.1, 'stroke-linecap': 'round' });
    const played = [];
    let x = 26, i = 0, prev = null;
    while (x < 1185) {
      const [step, beats] = tune[i % tune.length];
      const y = 70 - step * 4.5 + drift(x), up = step < 5, red = i % 11 === 4;
      const sx = up ? x + 4.2 : x - 4.2, sy = up ? y - 26 : y + 26, col = red ? RED : INK;
      const note = svg('g', { class: 'note' });
      note.append(
        svg('ellipse', { cx: f(x), cy: f(y), rx: 4.6, ry: 3.3, transform: `rotate(-22 ${f(x)} ${f(y)})`, fill: beats >= 2 ? 'none' : col, stroke: col }),
        svg('line', { x1: f(sx), y1: f(y), x2: f(sx), y2: f(sy), stroke: col }));
      // tie two quick notes that lean the same way
      if (prev && prev.beats === 1 && beats === 1 && prev.up === up && !prev.tied && !red && !prev.red) {
        note.append(svg('line', { x1: f(prev.sx), y1: f(prev.sy), x2: f(sx), y2: f(sy), 'stroke-width': 2.6 }));
        prev = { tied: true };
      } else prev = { sx, sy, up, beats, red };
      if ((i + 1) % 8 === 0) notes.append(svg('line', { x1: f(x + 17), y1: f(34 + drift(x + 17)), x2: f(x + 17), y2: f(70 + drift(x + 17)), 'stroke-width': 0.7, opacity: 0.6 }));
      notes.append(note);
      played.push([x, note]);
      x += 22 + beats * 9;
      i++;
    }
    staff.append(lines, notes);

    // scrolling plays the tune: each note hops and inks in as the reading point passes it,
    // and fades back if the page is scrolled up again
    const play = () => {
      const box = staff.getBoundingClientRect();
      if (box.bottom < -200 || box.top > innerHeight + 200) return;
      const scale = Math.max(box.width / 1200, box.height / 110), half = box.width / scale / 2;
      const t = still ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.92 - box.top) / (innerHeight * 0.6)));
      const head = 600 - half + t * (half * 2 + 20);
      played.forEach(([nx, note]) => note.classList.toggle('on', nx <= head));
    };
    addEventListener('scroll', play, { passive: true });
    addEventListener('resize', play);
    play();
  })();

  /* ---------- small paper notes, one per pastime ---------- */
  (() => {
    const doodles = [
      ['reading', '<path d="M40 24Q26 14 10 20V60Q26 54 40 64Q54 54 70 60V20Q54 14 40 24Z"/><path d="M40 24V64"/><path d="M18 32q8-3 14 1M18 42q8-3 14 1M48 33q8-4 14-1M48 43q8-4 14-1"/>'],
      ['gymming', '<path d="M22 40H58"/><path d="M16 26h7v28h-7zM57 26h7v28h-7z"/><path d="M8 32h5v16H8zM67 32h5v16h-5z"/>'],
      ['making music', '<path d="M30 56V18l30-6v38"/><path d="M30 28l30-6"/><ellipse cx="22" cy="57" rx="8" ry="6"/><ellipse cx="52" cy="51" rx="8" ry="6"/>'],
      ['the movies', '<path d="M22 34l5 34h26l5-34Z"/><path d="M32 35l2 33M40 35v33M48 35l-2 33"/><path d="M22 34q-3-9 6-9q1-9 10-6q6-7 12 1q9-2 8 8q4 5 0 6"/>'],
    ];
    doodles.forEach(([, inner], i) => {
      const r = rng(700 + i * 29);
      const paper = el('div', {}, art('0 0 80 80', `<g filter="url(#rough)" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner.replace(/<(path|ellipse) /g, '<$1 pathLength="1" ')}</g>`));
      let poly = '';
      for (let k = 0; k <= 8; k++) poly += `${f(k * 12.5)}% ${f(r() * 3)}%,`;
      for (let k = 1; k <= 5; k++) poly += `${f(100 - r() * 3)}% ${k * 20}%,`;
      for (let k = 8; k >= 0; k--) poly += `${f(k * 12.5)}% ${f(100 - r() * 3)}%,`;
      for (let k = 4; k >= 1; k--) poly += `${f(r() * 3)}% ${k * 20}%,`;
      paper.style.clipPath = `polygon(${poly.slice(0, -1)})`;
      const li = el('li', { className: 'scrap reveal' }, el('div', { className: 'sheet' }, paper));
      li.style.transform = `rotate(${f((r() - 0.5) * 7)}deg)`;
      $('notes').append(li);
    });
  })();

  /* ---------- a cold shore, in outline: two bergs, three penguins, a fox ---------- */
  (() => {
    const SKY = '#efe0d6';
    const pen = `stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"`;
    // small and far off: a dark back, a pale front, a speck of beak
    const penguin = (x, y, s, dir) => `
      <g transform="translate(${x} ${y}) scale(${s * dir} ${s})">
        <path d="M0 -62C15 -62 22 -34 20 -2C19 12 11 20 0 20C-11 20 -19 12 -20 -2C-22 -34 -15 -62 0 -62Z" fill="${INK}"/>
        <path d="M5 -44C14 -40 16 -20 14 -2C13 8 8 14 2 14C-5 14 -9 8 -9 -2C-9 -20 -5 -40 5 -44Z" fill="${SKY}"/>
        <path d="M13 -54l11 4-11 3Z" fill="#c98a3a"/>
        <path d="M-6 20l-5 4M6 20l5 4" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      </g>`;
    let prints = '';
    for (let k = 0; k < 7; k++) prints += `<ellipse cx="${f(752 - k * 24)}" cy="${f(394 + Math.sin(k * 0.8) * 4 + (k % 2) * 4)}" rx="2.6" ry="1.3" fill="${INK}" opacity=".25"/>`;
    $('arctic').innerHTML = `
      <g fill="${SKY}" ${pen} stroke-width="1">
        <path d="M500 331L548 268 612 214 660 322 700 296 728 330"/>
        <path d="M70 336L118 290 160 262 196 322 222 304 244 334"/>
      </g>
      <path d="M612 214L628 300M160 262L172 312" fill="none" ${pen} stroke-width=".7" opacity=".5"/>
      <path d="M0 338Q150 326 330 334T700 330 1010 328 1200 336" fill="none" ${pen} stroke-width="1"/>
      ${penguin(250, 372, 0.36, 1)}${penguin(274, 375, 0.42, 1)}${penguin(300, 373, 0.3, 1)}${penguin(1010, 378, 0.34, -1)}
      ${prints}
      <g transform="translate(760 318) scale(.82)">
        <path d="M86 92Q118 102 134 82Q144 64 126 56Q132 74 114 80Q98 84 86 80Z" fill="${SKY}" ${pen}/>
        <path d="M22 52L8 48Q4 44 11 41L24 34 23 16 35 27Q41 25 46 28L55 17 56 36Q61 46 57 56Q80 60 88 78Q93 90 90 100H38Q43 88 39 77Q34 64 22 52Z" fill="${SKY}" ${pen}/>
        <path d="M54 78Q50 90 52 100M66 100Q64 92 70 86" fill="none" ${pen} stroke-width="1"/>
        <circle cx="8.5" cy="45" r="1.8" fill="${INK}"/><path d="M22 40q3 -2 6 0" fill="none" ${pen}/>
      </g>`;
    // on narrow screens, frame the animals instead of cropping to the middle
    const narrow = matchMedia('(max-width: 640px)');
    const frame = () => $('arctic').setAttribute('viewBox', narrow.matches ? '190 150 740 310' : '0 0 1200 460');
    narrow.addEventListener('change', frame);
    frame();
  })();

  /* ---------- the thread: leaves the J's hook, ends by starting the next J ---------- */
  const thread = $('thread'), pen = thread.querySelector('path');
  let total = 0, reach = [], drawn = 0, goal = 0, easing = false;
  const STEP = 6;
  const anchor = (node, [vx, vy]) => {
    const b = node.getBoundingClientRect(), s = b.width / 280;
    return [b.left + vx * s, b.top + scrollY + vy * s];
  };
  const layThread = () => {
    const W = thread.parentElement.clientWidth, r = rng(2026), col = Math.min(W - 40, 640);
    const [sx, sy] = anchor($('mark-top'), MARK_TAIL), [ex, ey] = anchor($('mark-end'), MARK_HEAD);
    // drop out of the hook, then wander
    let x = sx, y = sy + 150, d = `M${f(sx)} ${f(sy)}C${f(sx - 30)} ${f(sy + 50)} ${f(sx + 20)} ${f(sy + 90)} ${f(x)} ${f(y)}`;
    let px = x, py = y - 60;
    while (y < ey - 560) {
      const ny = y + 220 + r() * 160, nx = W / 2 + (r() - 0.5) * col * 0.9;
      d += `C${f(2 * x - px)} ${f(2 * y - py)} ${f(nx)} ${f(ny - (ny - y) * 0.5)} ${f(nx)} ${f(ny)}`;
      px = nx; py = ny - (ny - y) * 0.5; x = nx; y = ny;
    }
    // one loop before arriving, the way a pen does when it's thinking
    const lx = ex - 70, ly = ey - 170;
    d += `C${f(2 * x - px)} ${f(2 * y - py)} ${f(lx - 60)} ${f(ly - 90)} ${f(lx)} ${f(ly)}`;
    d += `C${f(lx + 50)} ${f(ly + 75)} ${f(lx + 120)} ${f(ly + 10)} ${f(lx + 70)} ${f(ly - 30)}`;
    d += `C${f(lx + 20)} ${f(ly - 70)} ${f(ex - 80)} ${f(ey - 10)} ${f(ex)} ${f(ey)}`;
    pen.setAttribute('d', d);
    total = pen.getTotalLength();
    pen.style.strokeDasharray = total;
    // how far down the page the line has reached at each step along it (never decreasing, so the
    // loop near the end doesn't make the drawn length jump)
    reach = [];
    let deepest = -Infinity;
    for (let l = 0; l <= total; l += STEP) { deepest = Math.max(deepest, pen.getPointAtLength(l).y); reach.push(deepest); }
    drawn = Math.min(drawn, total);
    pull();
  };
  const pull = () => {
    // aim to have the line drawn down to a point a little past mid-screen
    const max = document.documentElement.scrollHeight - innerHeight, frac = max > 0 ? Math.min(1, scrollY / max) : 1;
    const targetY = scrollY + innerHeight * (0.5 + 0.45 * frac);
    let lo = 0, hi = reach.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (reach[m] < targetY) lo = m + 1; else hi = m; }
    goal = still || reach[lo] < targetY ? total : lo * STEP;
    if (still) { drawn = goal; pen.style.strokeDashoffset = total - drawn; return; }
    if (!easing) { easing = true; requestAnimationFrame(ease); }
  };
  // the pen catches up to its goal a little each frame, so nothing appears all at once
  const ease = () => {
    const gap = goal - drawn, stride = Math.sign(gap) * Math.min(Math.abs(gap), Math.max(1.5, Math.abs(gap) * 0.1));
    drawn += stride;
    pen.style.strokeDashoffset = total - drawn;
    if (Math.abs(goal - drawn) > 0.5) requestAnimationFrame(ease); else easing = false;
  };
  addEventListener('scroll', pull, { passive: true });

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
