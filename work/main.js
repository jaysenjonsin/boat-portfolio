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
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const INK = '#25272e', RED = '#d1492e', MOON = '#e8e3d4';
  const pen = (c = INK, w = 1.1) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  const JOBS = PROJECTS.filter((p) => p.category === 'work');        // newest first
  const text = (p) => el('div', { className: 'job-text' },
    el('p', { className: 'year', textContent: p.year }),
    el('h3', { textContent: p.title }),
    el('p', { textContent: p.description }));

  document.querySelectorAll('.tear').forEach((t, i) => {
    const r = rng(800 + i * 17);
    t.setAttribute('viewBox', '0 0 1000 28');
    t.setAttribute('preserveAspectRatio', 'none');
    let d = 'M0 28L0 14';
    for (let x = 0; x <= 1000; x += 6 + r() * 16) d += `L${f(x)} ${f(r() < 0.04 ? 3 + r() * 4 : 11 + r() * 6)}`;
    d += 'L1000 14L1000 28Z';
    if (!t.closest('.night')) t.append(svg('path', { d, fill: '#fcf9f1', transform: 'translate(0 -3)' }));
    t.append(svg('path', { d, fill: 'currentColor' }));
  });

  /* ---------- a · orbits: the newest job sits closest to the sun ---------- */
  (() => {
    const planet = (k, x, y, s = 1) => {
      const g = `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">`;
      return g + [
        `<circle r="7" fill="${RED}"/>`,
        `<circle r="8" fill="#f5f0e4" ${pen().replace('fill="none" ', '')}/><ellipse rx="15" ry="4.5" transform="rotate(-18)" ${pen()}/>`,
        `<circle r="9" fill="#f5f0e4" ${pen().replace('fill="none" ', '')}/><path d="M-8 -3q8 -3 16 0M-9 2q9 -3 18 0" ${pen(INK, 0.8)}/>`,
        `<circle r="6" fill="#f5f0e4" ${pen().replace('fill="none" ', '')}/><circle cx="12" cy="-7" r="1.8" fill="${INK}"/>`,
      ][k] + '</g>';
    };
    const SX = 60, SY = 150, angles = [-28, 20, -13, 9];
    let s = '', rays = '';
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; rays += `M${f(SX + 20 * Math.cos(a))} ${f(SY + 20 * Math.sin(a))}L${f(SX + (k % 2 ? 26 : 30) * Math.cos(a))} ${f(SY + (k % 2 ? 26 : 30) * Math.sin(a))}`; }
    s += `<circle cx="${SX}" cy="${SY}" r="14" ${pen()}/><path d="${rays}" ${pen(INK, 0.9)}/>`;
    JOBS.forEach((p, k) => {
      const rx = 130 + k * 150, ry = rx * 0.42, a = (angles[k] * Math.PI) / 180;
      s += `<ellipse cx="${SX}" cy="${SY}" rx="${rx}" ry="${f(ry)}" ${pen(INK, 0.7)} stroke-dasharray="1.5 6" opacity=".7"/>`;
      s += planet(k, SX + rx * Math.cos(a), SY + ry * Math.sin(a), 1.25);
      $('planets').append(el('li', { className: 'reveal' }, art('-18 -14 36 28', planet(k, 0, 0)), text(p)));
    });
    $('orrery').innerHTML = s;
  })();

  /* ---------- b · a constellation: four stars joined by one line ---------- */
  (() => {
    const r = rng(41);
    let dust = '';
    for (let k = 0; k < 70; k++) dust += `<circle cx="${f(r() * 1000)}" cy="${f(r() * 800)}" r="${f(0.5 + r() * 1.1)}" fill="${MOON}" opacity="${f(0.15 + r() * 0.5)}"/>`;
    $('dust').innerHTML = dust;
    JOBS.forEach((p, k) => {
      let rays = '';
      const n = 4, big = 13 - k * 1.5;
      for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI + 0.3, L = j % 2 ? big * 0.55 : big; rays += `M${f(-L * Math.cos(a))} ${f(-L * Math.sin(a))}L${f(L * Math.cos(a))} ${f(L * Math.sin(a))}`; }
      const star = art('-16 -16 32 32', `<path d="${rays}" ${pen(MOON, 1)}/><circle r="2.4" fill="${k ? MOON : '#e8a08f'}"/>`);
      star.classList.add('star');
      $('starlist').append(el('li', { className: 'reveal' }, star, text(p)));
    });
    const join = () => {
      const box = $('star-lines').getBoundingClientRect();
      const pts = [...document.querySelectorAll('#starlist .star')].map((s) => { const b = s.getBoundingClientRect(); return [b.left + b.width / 2 - box.left, b.top + b.height / 2 - box.top]; });
      let d = '';
      pts.forEach(([x, y], k) => {
        if (!k) return;
        const [px, py] = pts[k - 1], len = Math.hypot(x - px, y - py), ux = (x - px) / len, uy = (y - py) / len;
        d += `M${f(px + ux * 22)} ${f(py + uy * 22)}L${f(x - ux * 22)} ${f(y - uy * 22)}`;   // stop short of each star
      });
      $('star-lines').innerHTML = `<path d="${d}" ${pen(MOON, 0.8)} stroke-dasharray="2 6" opacity=".45"/>`;
    };
    addEventListener('resize', join);
    addEventListener('load', join);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(join);
    join();
  })();

  /* ---------- c · phases: oldest job a thin crescent, newest a full moon ---------- */
  [...JOBS].reverse().forEach((p, k, all) => {
    const lit = (k + 1) / all.length, R = 26, rx = R * Math.abs(1 - 2 * lit);
    const shadow = lit >= 1 ? '' : `<path d="M0 ${-R}A${R} ${R} 0 0 0 0 ${R}A${f(rx)} ${R} 0 0 ${lit < 0.5 ? 0 : 1} 0 ${-R}Z" fill="${INK}"/>`;
    const moon = art('-30 -30 60 60', `<circle r="${R}" fill="#fcf9f1"/>${shadow}<circle r="${R}" ${pen(INK, 1.2)}/>
      <circle cx="9" cy="-8" r="3" ${pen(INK, 0.6)} opacity=".45"/><circle cx="14" cy="9" r="1.8" ${pen(INK, 0.6)} opacity=".45"/>`);
    $('moons').append(el('li', { className: 'reveal' }, moon, text(p)));
  });

  /* ---------- d · the sun's climb: dawn at the first job, noon at the latest ---------- */
  (() => {
    const order = [...JOBS].reverse(), hours = ['dawn', 'morning', 'late morning', 'noon'];
    const xs = [100, 300, 500, 700], top = (x) => 215 - 175 * Math.sin(((x - 40) / 720) * Math.PI * 0.56);
    let s = `<path d="M10 222Q200 217 400 221T790 220" ${pen(INK, 1)}/>`, path = '';
    for (let x = 40; x <= 760; x += 12) path += `${x === 40 ? 'M' : 'L'}${x} ${f(top(x))}`;
    s += `<path d="${path}" ${pen(INK, 0.8)} stroke-dasharray="1.5 6" opacity=".7"/>`;
    order.forEach((p, k) => {
      const x = xs[k], y = top(x), last = k === order.length - 1;
      let rays = '';
      for (let j = 0; j < 10; j++) { const a = (j / 10) * Math.PI * 2; rays += `M${f(x + 13 * Math.cos(a))} ${f(y + 13 * Math.sin(a))}L${f(x + 18 * Math.cos(a))} ${f(y + 18 * Math.sin(a))}`; }
      s += `<path d="M${x} ${f(y + 22)}V218" ${pen(INK, 0.6)} stroke-dasharray="1 5" opacity=".6"/>
        <circle cx="${x}" cy="${f(y)}" r="8" fill="${last ? RED : '#efe0d6'}" ${last ? '' : pen().replace('fill="none" ', '')}/>
        <path d="${rays}" ${pen(last ? RED : INK, 0.9)}/>`;
      const li = el('li', { className: 'reveal' }, text(p));
      li.dataset.hour = hours[k];
      $('suns').append(li);
    });
    $('arc').innerHTML = s;
  })();

  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));
})();
