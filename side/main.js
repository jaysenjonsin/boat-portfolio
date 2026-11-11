(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, ...kids) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };
  const NS = 'http://www.w3.org/2000/svg';
  const art = (viewBox, inner) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', viewBox); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = inner;
    return s;
  };
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const MOON = '#e8e3d4', WARM = '#f2b27a', RED = '#e8806a';
  const pen = (c = MOON, w = 1.2) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  const SIDE = PROJECTS.filter((p) => p.category === 'project');
  const text = (p) => [el('p', { className: 'year', textContent: p.year }), el('h3', { textContent: p.title }), el('p', { textContent: p.description })];

  /* ---------- a · sky lanterns, let go at dusk ---------- */
  SIDE.forEach((p) => {
    $('lanterns-art').append(el('li', { className: 'reveal' }, art('0 0 100 130', `
      <defs><radialGradient id="lg"><stop offset="0" stop-color="${WARM}" stop-opacity=".5"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient></defs>
      <circle cx="50" cy="62" r="50" fill="url(#lg)"/>
      <path d="M30 18Q50 8 70 18Q80 56 68 98H32Q20 56 30 18Z" fill="rgba(242,178,122,.14)" ${pen().replace('fill="none" ', '')}/>
      <path d="M42 15Q36 56 41 98M58 15Q64 56 59 98" ${pen(MOON, 0.8)} opacity=".5"/>
      <path d="M32 98l5 8h26l5 -8" ${pen()}/><path d="M50 106v-5" ${pen(WARM, 1)}/>
      <path d="M50 96q-6 -8 0 -16q6 8 0 16Z" fill="${WARM}"/>`), ...text(p)));
  });

  /* ---------- b · kites, each on its own string ---------- */
  SIDE.forEach((p, k) => {
    const tint = ['#e8806a', '#8fb7b1', '#9fb0d6', '#e2c078'][k], sway = [8, -10, 6, -7][k];
    let bows = '';
    [[0.3, 1], [0.55, -1], [0.8, 1]].forEach(([t, d]) => { const y = 78 + t * 80, x = 50 + sway * Math.sin(t * Math.PI) * 1.2; bows += `<path d="M${f(x)} ${f(y)}l${5 * d} -4v8Zl${-5 * d} -4v8Z" fill="${tint}" opacity=".85"/>`; });
    $('kites-art').append(el('li', { className: 'reveal' }, art('0 0 100 170', `
      <path d="M50 6L82 44 50 78 18 44Z" fill="${tint}" fill-opacity=".28" ${pen().replace('fill="none" ', '')} transform="rotate(${sway} 50 44)"/>
      <path d="M50 6V78M18 44H82" ${pen(MOON, 0.8)} opacity=".7" transform="rotate(${sway} 50 44)"/>
      <path d="M${f(50 - sway * 0.6)} 78Q${50 + sway * 2} 120 50 166" ${pen(MOON, 0.8)}/>${bows}`), ...text(p)));
  });

  /* ---------- c · smaller constellations: each project its own figure ---------- */
  (() => {
    const r = rng(19);
    let dust = '';
    for (let k = 0; k < 60; k++) dust += `<circle cx="${f(r() * 1000)}" cy="${f(r() * 800)}" r="${f(0.5 + r() * 1)}" fill="${MOON}" opacity="${f(0.15 + r() * 0.45)}"/>`;
    $('dust').innerHTML = dust;
    const shapes = {
      Amelia: [[[14, 52], [88, 16], [62, 80], [50, 54], [14, 52]], [[50, 54], [88, 16]]],                       // a paper plane
      Knoted: [[[22, 30], [78, 24], [82, 62], [26, 68], [22, 30]], [[36, 44], [66, 41]], [[38, 55], [58, 53]]],   // a card with lines
      Ignition: [[[50, 12], [50, 84]], [[14, 48], [86, 48]], [[26, 24], [74, 72]], [[74, 24], [26, 72]]],         // a spark
      EventFinder: [[[12, 30], [88, 30], [88, 44], [82, 50], [88, 56], [88, 70], [12, 70], [12, 56], [18, 50], [12, 44], [12, 30]], [[62, 34], [62, 66]]], // a ticket
    };
    SIDE.forEach((p) => {
      const lines = shapes[p.id] || [[[20, 50], [80, 50]]];
      let s = '';
      lines.forEach((pts) => { s += `<path d="${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')}" ${pen(MOON, 0.8)} stroke-dasharray="1.5 5" opacity=".6"/>`; });
      const seen = new Set();
      lines.flat().forEach(([x, y], i) => {
        const key = `${x},${y}`; if (seen.has(key)) return; seen.add(key);
        s += i === 1 ? `<path d="M${x - 6} ${y}h12M${x} ${y - 6}v12M${x - 3.5} ${y - 3.5}l7 7M${x + 3.5} ${y - 3.5}l-7 7" ${pen(MOON, 0.9)}/><circle cx="${x}" cy="${y}" r="2.2" fill="#e8a08f"/>`
          : `<circle cx="${x}" cy="${y}" r="${f(1.4 + r() * 1.2)}" fill="${MOON}"/>`;
      });
      $('figures-art').append(el('li', { className: 'reveal' }, art('0 0 100 96', s), ...text(p)));
    });
  })();

  /* ---------- d · messages in bottles, where the sky meets the sea ---------- */
  SIDE.forEach((p, k) => {
    const li = el('li', { className: 'reveal' }, ...text(p), art('0 0 60 100', `
      <path d="M24 6h12v6H24Z" fill="#c9a36a" stroke="${MOON}" stroke-width="1"/>
      <path d="M25 12v14Q12 34 12 50V86Q12 94 20 94H40Q48 94 48 86V50Q48 34 35 26V12" fill="rgba(200,218,221,.16)" ${pen().replace('fill="none" ', '')}/>
      <path d="M22 52h16v30H22Z" fill="#f5f0e4" stroke="${MOON}" stroke-width=".8" transform="rotate(-6 30 67)"/>
      <path d="M25 60h10M25 66h10M25 72h6" ${pen('#77756f', 0.8)} transform="rotate(-6 30 67)"/>
      <path d="M17 44Q16 62 18 80" ${pen(MOON, 0.7)} opacity=".5"/>`));
    li.style.setProperty('--r', `${[12, -9, 16, -13][k]}deg`);
    $('bottles-art').append(li);
  });

  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));
})();
