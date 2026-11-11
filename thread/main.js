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
  const INK = '#25272e', RED = '#d1492e', PEN = '#3c5a94', OCHRE = '#a97b22', TEAL = '#3f7d78', MOON = '#e8e3d4';

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

  /* ---------- a page of code, as the hand remembers it ---------- */
  const code = () => {
    const c = $('code'), dpr = Math.min(devicePixelRatio || 1, 2);
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr;
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    g.lineCap = 'round';
    const r = rng(42), colW = Math.min(W - 32, 620), x0 = (W - colW) / 2 + 26;
    const tints = [INK, INK, INK, INK, PEN, PEN, TEAL, OCHRE, RED];
    let indent = 0, row = 0;
    for (let y = 16; y < H - 10; y += 13, row++) {
      const edge = Math.min(1, y / 90, (H - y) / 90);
      // gutter tick, like a line number
      g.globalAlpha = 0.3 * edge; g.strokeStyle = INK; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x0 - 24, y); g.lineTo(x0 - 24 + 4 + (row % 10 > 8 ? 5 : 0), y); g.stroke();
      if (r() < 0.12) { continue; } // a blank line
      const step = r();
      if (step < 0.3 && indent < 5) indent++;
      else if (step > 0.72 && indent > 0) indent -= r() < 0.3 ? Math.min(indent, 2) : 1;
      let x = x0 + indent * 22;
      const words = 1 + Math.floor(r() * (6 - indent * 0.6));
      for (let w = 0; w < words && x < x0 + colW - 60; w++) {
        const len = 8 + r() * (w === 0 ? 30 : 58);
        g.strokeStyle = tints[Math.floor(r() * tints.length)];
        g.globalAlpha = (0.45 + r() * 0.45) * edge;
        g.lineWidth = 2.1;
        g.beginPath(); g.moveTo(x, y + (r() - 0.5));
        for (let i = 6; i < len; i += 6) g.lineTo(x + i, y + (r() - 0.5) * 1.6);
        g.lineTo(x + len, y + (r() - 0.5));
        g.stroke();
        x += len + 8;
      }
    }
    g.globalAlpha = 1;
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

  /* ---------- work: a small sketch for each job ---------- */
  const line = `fill="none" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"`;
  const accent = `fill="none" stroke="${RED}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;
  const jobArt = {
    // live numbers: bars with a pulse running over them
    Chartbeat: `<g ${line}><path d="M9 88q40 2 83 -1"/><path d="M19 88v-17h9v17M34 88v-30h9v30M49 88v-23h9v23M64 88v-42h9v42M79 88v-33h9v33"/></g>
      <path ${accent} d="M6 40h20l6-20 9 36 7-27 5 11h41"/>`,
    // a door left open
    Glassdoor: `<g ${line}><path d="M27 91V13h46v78"/><path d="M27 13l31 9v78l-31-9"/><path d="M33 24l19 5v24l-19-4Z" stroke-width="1"/><path d="M12 91q40 3 78 0"/></g>
      <circle cx="52" cy="62" r="2.2" fill="${RED}"/><g ${line} stroke-width=".8" opacity=".6"><path d="M64 30l6-3M64 46h7M64 62l6 3"/></g>`,
    // people gathering around one point
    Konvene: (() => {
      const r = rng(9); let s = `<g ${line} stroke-width="1">`;
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * Math.PI * 2 + 0.3, d = 30 + r() * 10, x = 50 + d * Math.cos(a), y = 52 + d * Math.sin(a);
        s += `<path d="M${f(x)} ${f(y)}L${f(50 + 9 * Math.cos(a))} ${f(52 + 9 * Math.sin(a))}" stroke-dasharray="1.5 4"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(2.6 + r() * 1.6)}" stroke-dasharray="none"/>`;
      }
      return s + `</g><circle cx="50" cy="52" r="5" fill="${RED}"/>`;
    })(),
    // a pencil writing tests that pass
    Scribe: `<g ${line}><path d="M72 12l12 10-44 50-15 5 3-15Z"/><path d="M64 21l12 10M28 62l12 10"/><path d="M12 90q6-8 12 0t12 0 12 0"/></g>
      <path ${accent} d="M58 86l6 6 13-15"/>`,
  };

  const moreBtn = (p) => {
    const b = el('button', { className: 'more', type: 'button', textContent: 'open' });
    b.setAttribute('aria-label', `Open ${p.title}`);
    b.addEventListener('click', () => openLog(p.id));
    return b;
  };

  PROJECTS.filter((p) => p.category === 'work').forEach((p) => {
    $('jobs').append(
      el('li', { className: 'job reveal' },
        art('0 0 100 100', jobArt[p.id] || `<circle cx="50" cy="50" r="30" ${line}/>`),
        el('div', {},
          el('p', { className: 'year', textContent: p.year }),
          el('h3', { textContent: p.title }),
          el('p', { textContent: p.description }),
          moreBtn(p)))
    );
  });

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

  /* ---------- skills: books on shelves ---------- */
  SKILLS.forEach(([title, skills], cat) => {
    const r = rng(40 + cat * 7);
    const books = el('ul', { className: 'books' });
    skills.forEach((skill, k) => {
      const li = el('li', { className: `book s${cat}${k === skills.length - 1 && skills.length > 5 ? ' lean' : ''}` }, el('span', { textContent: skill }));
      li.firstChild.style.setProperty('--w', `${f(2 + r() * 0.9)}rem`);
      li.firstChild.style.paddingBlock = `${f(0.9 + r() * 0.9)}rem`;
      books.append(li);
    });
    $('shelves').append(el('div', { className: 'shelf reveal' }, el('h3', { textContent: title }), books));
  });

  /* ---------- night: a few stars and a hatched moon ---------- */
  (() => {
    const r = rng(31), sky = $('sky');
    for (let k = 0; k < 90; k++) {
      const c = svg('circle', { cx: f(r() * 1000), cy: f(r() * 600), r: f(0.5 + r() * 1.3), fill: MOON, opacity: f(0.2 + r() * 0.6) });
      if (k % 6 === 0) { c.classList.add('tw'); c.style.animationDelay = `${f(-r() * 4)}s`; }
      sky.append(c);
    }
    const moon = svg('g', { fill: 'none', stroke: MOON, 'stroke-width': 1, 'stroke-linecap': 'round', opacity: 0.8, transform: 'translate(800 90) rotate(-20)' });
    moon.append(svg('path', { d: 'M0 -34A34 34 0 1 0 0 34A26 34 0 0 1 0 -34Z' }));
    for (let y = -26; y <= 26; y += 6.5) {
      const outer = -Math.sqrt(34 * 34 - y * y), inner = -26 * Math.sqrt(1 - (y * y) / (34 * 34));
      moon.append(svg('path', { d: `M${f(outer + 1.5)} ${f(y)}L${f(inner - 1.5)} ${f(y + 2)}`, 'stroke-width': 0.6 }));
    }
    sky.append(moon);
  })();

  /* ---------- a strip of film, one frame per pastime ---------- */
  (() => {
    const r = rng(64), film = $('film');
    const g = svg('g', { fill: 'none', stroke: MOON, 'stroke-width': 1.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const wobble = (y) => { let d = `M0 ${y}`; for (let x = 50; x <= 700; x += 50) d += `L${x} ${f(y + (r() - 0.5) * 1.6)}`; return d; };
    g.append(svg('path', { d: wobble(8) }), svg('path', { d: wobble(182) }));
    for (let x = 10; x < 690; x += 26) {
      g.append(svg('rect', { x: f(x), y: 17, width: 13, height: 11, rx: 2.5, 'stroke-width': 0.9 }), svg('rect', { x: f(x), y: 162, width: 13, height: 11, rx: 2.5, 'stroke-width': 0.9 }));
    }
    const frames = [
      // an open book
      '<path d="M40 24Q26 14 10 20V60Q26 54 40 64Q54 54 70 60V20Q54 14 40 24Z"/><path d="M40 24V64"/><path d="M18 32q8-3 14 1M18 42q8-3 14 1M48 33q8-4 14-1M48 43q8-4 14-1"/>',
      // a dumbbell
      '<path d="M22 40H58"/><path d="M16 26h7v28h-7zM57 26h7v28h-7z"/><path d="M8 32h5v16H8zM67 32h5v16h-5z"/>',
      // a pair of notes
      '<path d="M30 56V18l30-6v38"/><path d="M30 28l30-6"/><ellipse cx="22" cy="57" rx="8" ry="6"/><ellipse cx="52" cy="51" rx="8" ry="6"/>',
      // a tub of popcorn
      '<path d="M22 34l5 34h26l5-34Z"/><path d="M32 35l2 33M40 35v33M48 35l-2 33"/><path d="M22 34q-3-9 6-9q1-9 10-6q6-7 12 1q9-2 8 8q4 5 0 6"/>',
    ];
    frames.forEach((inner, i) => {
      const x = 20 + i * 168;
      g.append(svg('rect', { x, y: 42, width: 156, height: 106, rx: 4 }));
      const d = svg('g', { transform: `translate(${x + 78 - 46} ${95 - 46}) scale(1.15)` });
      d.innerHTML = inner;
      g.append(d);
    });
    film.append(g);
  })();

  /* ---------- the thread: leaves the J's hook, ends by starting the next J ---------- */
  const thread = $('thread'), pen = thread.querySelector('path');
  let total = 0;
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
    pull();
  };
  const pull = () => {
    const p = still ? 1 : Math.min(1, (scrollY + innerHeight * 0.75) / thread.parentElement.scrollHeight);
    pen.style.strokeDashoffset = total * (1 - p);
  };
  let tick = false;
  addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { pull(); tick = false; });
  }, { passive: true });

  let resizeT;
  const relayout = () => { code(); layThread(); };
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
