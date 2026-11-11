(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };
  const SVG = 'http://www.w3.org/2000/svg';
  const svg = (tag, attrs = {}) => {
    const n = document.createElementNS(SVG, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  // small seeded random so the sky is the same on every visit
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* ---------- waves ---------- */
  const waves = $('waves');
  [[14, 'var(--ink)', 2.4, 1], [34, 'var(--ink-soft)', 1.6, 0.6]].forEach(([y, stroke, w, o], i) => {
    const d = `M${-20 * i} ${y}q15 -11 30 0` + 't30 0'.repeat(42);
    waves.append(svg('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', opacity: o, filter: 'url(#rough)' }));
  });

  /* ---------- work + projects ---------- */
  const moreBtn = (p, label) => {
    const b = el('button', { className: 'more', type: 'button', textContent: label });
    b.addEventListener('click', () => openLog(p.id));
    return b;
  };

  PROJECTS.filter((p) => p.category === 'work').forEach((p) => {
    $('ports').append(
      el('li', { className: 'port reveal' },
        el('p', { className: 'year', textContent: p.year }),
        el('h3', { textContent: p.title }),
        el('p', { textContent: p.description }),
        moreBtn(p, 'read the log →'))
    );
  });

  const lanternArt = () => {
    const s = svg('svg', { viewBox: '0 0 120 170', 'aria-hidden': 'true' });
    s.innerHTML = `
      <circle class="flame" cx="60" cy="78" r="58" fill="url(#glow)"/>
      <g filter="url(#rough)" fill="none" stroke="var(--moon)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M60 6V20"/>
        <path d="M44 22h32l4 8H40Z"/>
        <path d="M40 30Q22 76 42 122H78Q98 76 80 30Z" fill="rgba(242,166,90,.16)"/>
        <path d="M52 31Q44 76 53 121M68 31Q76 76 67 121" opacity=".55"/>
        <path d="M44 122h32l-3 8H47Z"/>
        <path d="M60 130v18M56 148q4 10 8 0" opacity=".8"/>
      </g>
      <path class="flame" d="M60 88q-9-10 0-24q9 14 0 24Z" fill="#f2a65a"/>`;
    return s;
  };

  PROJECTS.filter((p) => p.category === 'project').forEach((p) => {
    $('lanterns').append(
      el('li', { className: 'lantern reveal' },
        lanternArt(),
        el('p', { className: 'year', textContent: p.year }),
        el('h3', { textContent: p.title }),
        el('p', { textContent: p.description }),
        moreBtn(p, 'see it glow →'))
    );
  });

  /* ---------- night sky ---------- */
  document.querySelectorAll('.sky').forEach((sky, i) => {
    const r = rng(11 + i * 7);
    sky.setAttribute('viewBox', '0 0 1000 1000');
    sky.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    for (let n = 0; n < 110; n++) {
      const c = svg('circle', { cx: (r() * 1000).toFixed(0), cy: (r() * 1000).toFixed(0), r: (0.5 + r() * 1.5).toFixed(2), opacity: (0.25 + r() * 0.6).toFixed(2) });
      if (n % 5 === 0) { c.classList.add('tw'); c.style.animationDelay = `${(-r() * 4).toFixed(2)}s`; }
      sky.append(c);
    }
  });

  /* ---------- constellations ---------- */
  SKILLS.forEach(([title, skills], i) => {
    const r = rng(101 + i * 13);
    const W = 320, H = 96, n = skills.length;
    const pts = skills.map((_, k) => [14 + (k * (W - 28)) / (n - 1) + (r() - 0.5) * 14, 14 + r() * (H - 28)]);
    const s = svg('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    pts.slice(1).forEach((p, k) => s.append(svg('line', { x1: pts[k][0], y1: pts[k][1], x2: p[0], y2: p[1] })));
    pts.forEach((p) => s.append(svg('circle', { cx: p[0], cy: p[1], r: 2 + r() * 2 })));
    $('constellations').append(
      el('div', { className: 'constellation reveal' },
        s,
        el('h3', { textContent: title }),
        el('ul', {}, ...skills.map((k) => el('li', { textContent: k }))))
    );
  });

  /* ---------- reveal on scroll ---------- */
  const targets = document.querySelectorAll('.reveal, .draw:not(.in-now)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  /* ---------- project log ---------- */
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
    const links = [[p.githubUrl, '— view on github'], [p.liveUrl, '— view live site'], [p.articleUrl, '— read article']]
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
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
