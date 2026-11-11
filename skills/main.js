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
  const art = (viewBox, inner, cls) => {
    const s = svg('svg', { viewBox, 'aria-hidden': 'true' });
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = inner;
    return s;
  };
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const INK = '#25272e', RED = '#d1492e';
  const CAPS = ['#d1492e', '#3f7d78', '#3c5a94', '#a97b22'];
  const pen = `fill="none" stroke="${INK}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"`;

  /* torn edges, as in the pen line version */
  document.querySelectorAll('.tear').forEach((t, i) => {
    const r = rng(500 + i * 17);
    t.setAttribute('viewBox', '0 0 1000 28');
    t.setAttribute('preserveAspectRatio', 'none');
    let d = 'M0 28L0 14';
    for (let x = 0; x <= 1000; x += 6 + r() * 16) d += `L${f(x)} ${f(r() < 0.04 ? 3 + r() * 4 : 11 + r() * 6)}`;
    d += 'L1000 14L1000 28Z';
    t.append(svg('path', { d, fill: '#fcf9f1', transform: 'translate(0 -3)' }), svg('path', { d, fill: 'currentColor' }));
  });

  /* ---------- a · an archipelago: one island per category ---------- */
  (() => {
    const r = rng(17), isles = $('isles-art');
    SKILLS.forEach(([title, skills], c) => {
      const pct = () => `${f(34 + r() * 22)}%`;
      const isle = el('div', { className: `isle c${c} reveal` },
        el('h3', { textContent: title }),
        el('ul', {}, ...skills.map((s) => el('li', { textContent: s }))));
      isle.style.setProperty('--blob', `${pct()} ${pct()} ${pct()} ${pct()} / ${pct()} ${pct()} ${pct()} ${pct()}`);
      isle.style.setProperty('--r', `${f((r() - 0.5) * 3)}deg`);
      isles.append(isle);
    });
    // a little open water between them
    [[46, 8], [2, 47], [93, 52], [47, 92], [20, 101], [78, -4]].forEach(([x, y]) => {
      const w = art('0 0 40 10', `<path d="M2 6q5 -5 9 0t9 0 9 0 9 0" ${pen} stroke-width="1"/>`, 'swell');
      w.style.left = `${x}%`; w.style.top = `${y}%`;
      isles.append(w);
    });
    isles.append(
      art('0 0 60 60', `<circle cx="30" cy="30" r="17" ${pen} stroke-width=".8"/><path d="M30 6L34 30 30 54 26 30Z" ${pen}/><path d="M8 30L30 27 52 30 30 33Z" ${pen} stroke-width=".8"/><path d="M30 6L34 30H26Z" fill="${RED}" opacity=".8"/>`, 'rose'),
      art('-32 -32 64 54', `<g ${pen} stroke-width="1.6"><path d="M-20 4Q0 12 22 3L16 13Q0 18 -14 13Z"/><path d="M1 6V-26"/><path d="M4 -23Q20 -11 5 2Z"/><path d="M-2 -19Q-12 -8 -3 2"/></g>`, 'skiff'));
  })();

  /* ---------- b · growth rings: read each ring around ---------- */
  (() => {
    const r = rng(29), g = $('rings-art'), C = 210;
    // shortest list in the middle, longest outside
    const order = SKILLS.map((s, c) => [s, c]).sort((a, b) => a[0][1].join('').length - b[0][1].join('').length);
    const wobble = (rad) => {
      let d = '';
      const p1 = r() * 6, p2 = r() * 6;
      for (let a = 0; a <= 360; a += 6) {
        const t = (a * Math.PI) / 180, rr = rad + 1.8 * Math.sin(t * 3 + p1) + 1.2 * Math.sin(t * 7 + p2);
        d += `${a ? 'L' : 'M'}${f(C + rr * Math.cos(t))} ${f(C + rr * Math.sin(t))}`;
      }
      return d + 'Z';
    };
    let defs = '', body = `<path d="${wobble(26)}" ${pen} stroke-width=".8"/><circle cx="${C}" cy="${C}" r="2.2" fill="${INK}"/>`;
    order.forEach(([[title, skills], c], k) => {
      const rad = 58 + k * 38, id = `ring${k}`;
      defs += `<path id="${id}" d="M${C + rad} ${C}A${rad} ${rad} 0 1 1 ${C - rad} ${C}A${rad} ${rad} 0 1 1 ${C + rad} ${C}" transform="rotate(${-90 + k * 47} ${C} ${C})"/>`;
      body += `<path d="${wobble(rad + 21)}" ${pen} stroke-width="${k === order.length - 1 ? 1.3 : 0.8}"/>
        <text fill="${INK}"><textPath href="#${id}" textLength="${f(2 * Math.PI * rad - 8)}" lengthAdjust="spacing">${skills.join('  ·  ')}  ·</textPath></text>
        <circle cx="${f(C + (rad - 14) * Math.cos(k * 1.9))}" cy="${f(C + (rad - 14) * Math.sin(k * 1.9))}" r="2.6" fill="${CAPS[c]}"/>`;
      $('rings-legend').append(el('li', { className: `c${c}`, textContent: title }));
    });
    body += `<path d="M${C + 30} ${C + 6}L${C + 196} ${C + 34}" ${pen} stroke-width=".7" opacity=".5"/>`;
    g.setAttribute('aria-label', order.map(([[t, s]]) => `${t}: ${s.join(', ')}`).join('. '));
    g.innerHTML = `<defs>${defs}</defs>${body}`;
  })();

  /* ---------- c · hung on a line ---------- */
  SKILLS.forEach(([title, skills], c) => {
    const r = rng(70 + c * 11);
    const row = el('ul', { className: 'hung' });
    skills.forEach((s) => {
      const li = el('li', {}, el('span', { textContent: s }));
      li.style.setProperty('--r', `${f((r() - 0.5) * 7)}deg`);
      li.style.setProperty('--drop', `${f(0.6 + r() * 0.9)}rem`);
      row.append(li);
    });
    $('line-art').append(el('div', { className: `hung-row c${c} reveal` }, el('h3', { textContent: title }), row));
  });

  /* ---------- d · a pressed garden: one sprig per skill ---------- */
  (() => {
    const sprigs = [
      (r) => { // fern
        let s = `<path d="M30 78Q${f(26 + r() * 8)} 40 30 8" ${pen}/>`;
        for (let k = 0; k < 8; k++) { const y = 68 - k * 7.4, L = 15 - k * 1.5; s += `<path d="M30 ${f(y)}q${f(-L * 0.5)} ${f(-L * 0.5)} ${f(-L)} ${f(-L * 0.25)}M30 ${f(y)}q${f(L * 0.5)} ${f(-L * 0.5)} ${f(L)} ${f(-L * 0.25)}" ${pen} stroke-width=".9"/>`; }
        return s;
      },
      (r, tint) => { // leafy stem
        let s = `<path d="M30 78Q${f(22 + r() * 16)} 44 30 10" ${pen}/>`;
        for (let k = 0; k < 4; k++) { const y = 64 - k * 14, d = k % 2 ? 1 : -1; s += `<path d="M30 ${y}q${d * 9} ${-12} ${d * 20} ${-6}q${-d * 8} ${9} ${-d * 20} ${6}Z" fill="${tint}" fill-opacity=".25" ${pen.replace('fill="none" ', '')} stroke-width=".9"/>`; }
        return s;
      },
      (r, tint) => { // daisy
        let s = `<path d="M30 78Q${f(24 + r() * 12)} 52 30 30" ${pen}/><path d="M30 60q-10 -8 -17 -2q8 6 17 2Z" ${pen} stroke-width=".9"/>`;
        for (let k = 0; k < 11; k++) { const a = (k / 11) * Math.PI * 2 + r() * 0.2, L = 11 + r() * 3; s += `<path d="M${f(30 + 4 * Math.cos(a))} ${f(22 + 4 * Math.sin(a))}L${f(30 + L * Math.cos(a))} ${f(22 + L * Math.sin(a))}" ${pen} stroke-width=".9"/>`; }
        return s + `<circle cx="30" cy="22" r="3.4" fill="${tint}"/>`;
      },
      (r, tint) => { // grain
        let s = `<path d="M30 78Q${f(27 + r() * 8)} 50 31 12" ${pen}/>`;
        for (let k = 0; k < 6; k++) { const y = 44 - k * 6; s += `<path d="M30.500 ${y}l-7 -6M30.500 ${y}l7 -6" ${pen} stroke="${tint}" stroke-width="1.2"/>`.replace(/30\.500/g, '30.5'); }
        return s;
      },
      (r, tint) => { // buds
        let s = `<path d="M30 78Q${f(25 + r() * 10)} 46 30 16" ${pen}/><path d="M30 54Q20 48 15 38M30 40Q41 34 45 24" ${pen} stroke-width=".9"/>`;
        [[30, 12], [14, 34], [46, 20]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4.5" fill="${tint}" fill-opacity=".3" stroke="${INK}" stroke-width="1"/>`; });
        return s;
      },
    ];
    let n = 0;
    SKILLS.forEach(([title, skills], c) => {
      const list = el('ul');
      skills.forEach((s) => {
        const r = rng(300 + n * 13);
        list.append(el('li', { className: 'reveal' }, art('0 0 60 80', sprigs[(n * 3 + c) % sprigs.length](r, CAPS[c])), s));
        n++;
      });
      $('garden-art').append(el('div', { className: `bed c${c}` }, el('h3', { textContent: title }), list));
    });
  })();

  /* ---------- e · liner notes: four sides of a record ---------- */
  (() => {
    let grooves = '';
    for (let rad = 34; rad <= 100; rad += 3.3) grooves += `<circle cx="110" cy="110" r="${f(rad)}" ${pen} stroke-width=".45" opacity="${rad % 2 > 1 ? 0.75 : 0.45}"/>`;
    $('disc').innerHTML = `<circle cx="110" cy="110" r="105" fill="#fcf9f1" ${pen.replace('fill="none" ', '')} stroke-width="1.3"/>${grooves}
      <circle cx="110" cy="110" r="27" fill="#f6e3da" stroke="${INK}" stroke-width="1"/>
      <path d="M103 98h14M112 98v15a6 6 0 0 1 -12 0" ${pen} stroke-width="1.6"/><circle cx="106" cy="106" r="1.8" fill="${RED}"/>
      <circle cx="110" cy="124" r="1.6" fill="${INK}"/>`;
    SKILLS.forEach(([title, skills], c) => {
      const list = el('ol', {}, ...skills.map((s) => el('li', { textContent: s })));
      $('sleeve').append(el('div', { className: `c${c}` }, el('h3', { textContent: `side ${'abcd'[c]} · ${title}` }), list));
    });
  })();

  /* reveal on scroll */
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach((t) => t.classList.add('in'));
})();
