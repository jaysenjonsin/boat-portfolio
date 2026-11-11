(() => {
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n) => n.toFixed(1);
  const INK = '#25272e', RED = '#d1492e', MOON = '#e8e3d4', PEN = '#3c5a94', SOFT = '#77756f';
  const PAPER = '#f5f0e4', NIGHT = '#1d2130', SKY = '#dde5e6', BLUSH = '#efe0d6', SAND = '#efe7d3';
  const W = 260;
  const pen = (c = INK, w = 1) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

  /* ---- small pieces shared by the three strips ---- */
  const band = (y, h, fill) => `<rect x="0" y="${y}" width="${W}" height="${h}" fill="${fill}"/>`;
  const label = (y, t, c = SOFT) => `<text x="10" y="${y}" font-size="9.5" fill="${c}">${t}</text>`;
  const jMark = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 -16h26M4 -16v24a10 10 0 0 1-20 0v-3" ${pen(INK, 1.6)}/><circle cx="-6" cy="-4" r="2.2" fill="${RED}"/></g>`;
  const textLines = (x, y, widths, c = INK) => widths.map((w, i) => `<path d="M${x - w / 2} ${y + i * 7}h${w}" ${pen(c, 1.2)} opacity=".45"/>`).join('');
  const dust = (y, h, n, seed) => { const r = rng(seed); let s = ''; for (let k = 0; k < n; k++) s += `<circle cx="${f(r() * W)}" cy="${f(y + r() * h)}" r="${f(0.4 + r() * 0.7)}" fill="${MOON}" opacity="${f(0.2 + r() * 0.5)}"/>`; return s; };
  const star = (x, y, s = 1, c = MOON) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0h12M0 -6v12M-3 -3l6 6M3 -3l-6 6" ${pen(c, 0.8)}/><circle r="1.4" fill="${c}"/></g>`;
  const constellation = (y0, seed) => {
    const pts = [[62, y0 + 30], [200, y0 + 92], [58, y0 + 158], [204, y0 + 222]];
    let s = `<path d="${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')}" ${pen(MOON, 0.7)} stroke-dasharray="1.5 4" opacity=".5"/>`;
    pts.forEach(([x, y], i) => { s += star(x, y, i ? 0.9 : 1.15, i ? MOON : '#e8a08f') + textLines(i % 2 ? x - 62 : x + 62, y - 4, [44, 60, 30], MOON); });
    return [s, pts];
  };
  const shooting = (x, y, deg) => `<g transform="translate(${x} ${y}) rotate(${deg})"><path d="M-4 0H-30" ${pen(MOON, 0.9)} opacity=".6"/><path d="M-30 0H-46" ${pen(MOON, 0.7)} opacity=".25"/><path d="M0 -4L1 -1 4 0 1 1 0 4 -1 1 -4 0 -1 -1Z" fill="${MOON}"/></g>`;
  const bird = (x, y, s = 1, red = false, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${s})"><circle r="1.8" ${pen(red ? RED : INK, 0.9)}/><path d="M-1.8 0q-5 -8 -11 -3M1.8 0q5 -8 11 -3" ${pen(red ? RED : INK, 0.9)}/></g>`;
  const flock = (y, seed, n = 9) => {
    const r = rng(seed); let s = '';
    for (let k = 0; k < 70; k++) { const t = r(), x = 24 + t * 150 + (r() - 0.5) * 30, yy = y + 46 * t * t - 14 * Math.sin(t * 3) + (r() - 0.5) * 16; s += `<path d="M${f(x)} ${f(yy)}l${f(1.5 + r() * 2)} ${f(1 + r())}" ${pen(INK, 0.7)} opacity="${f(0.3 + r() * 0.5)}"/>`; }
    for (let k = 0; k < n; k++) s += bird(150 + r() * 92, y - 16 + r() * 60, 0.6 + r() * 0.5, k % 3 === 1, (r() - 0.5) * 30);
    return s;
  };
  const cards = (y) => [[58, y], [140, y + 6], [58, y + 62], [140, y + 56]].map(([x, yy], i) => `<g transform="rotate(${[-2, 1.5, 1, -1.5][i]} ${x + 30} ${yy + 22})"><rect x="${x}" y="${yy}" width="62" height="46" fill="#fcf9f1" stroke="${INK}" stroke-width=".7"/><path d="M${x} ${yy + 7}h62" stroke="${RED}" stroke-width=".5" opacity=".6"/>${textLines(x + 31, yy + 20, [30, 42, 22])}</g>`).join('');
  // a five-line staff; `shape` bends it (straight wires, a rising swell, or waves), notes sit on it
  const staff = (y, shape, noteColor = INK, lineColor = INK, seed = 5) => {
    const r = rng(seed); let s = '';
    for (let k = 0; k < 5; k++) { let d = ''; for (let x = 0; x <= W; x += 10) d += `${x ? 'L' : 'M'}${x} ${f(y + k * 5 + shape(x, k))}`; s += `<path d="${d}" ${pen(lineColor, 0.6)} opacity=".8"/>`; }
    for (let x = 18; x < W - 8; x += 13 + r() * 8) {
      const k = Math.floor(r() * 5), ny = y + k * 5 + shape(x, k) - (k % 2 ? 0 : 2.5), up = k > 1, red = r() < 0.12, c = red ? RED : noteColor;
      s += `<ellipse cx="${f(x)}" cy="${f(ny)}" rx="2.6" ry="1.9" transform="rotate(-22 ${f(x)} ${f(ny)})" fill="${r() < 0.25 ? 'none' : c}" stroke="${c}" stroke-width=".7"/><path d="M${f(x + (up ? 2.3 : -2.3))} ${f(ny)}v${up ? -13 : 13}" ${pen(c, 0.7)}/>`;
    }
    return s;
  };
  const pictures = (y) => [0, 1, 2, 3].map((i) => `<rect x="${44 + i * 46}" y="${y + (i % 2) * 8}" width="34" height="28" fill="#fcf9f1" stroke="${INK}" stroke-width=".6" transform="rotate(${[-3, 2, -1, 3][i]} ${61 + i * 46} ${y + 14})"/>`).join('');
  const sprigs = (ground, seed, n = 11) => {
    const r = rng(seed); let s = '';
    for (let k = 0; k < n; k++) { const x = 22 + (k * (W - 44)) / (n - 1) + (r() - 0.5) * 6, h = 16 + r() * 22; s += `<path d="M${f(x)} ${ground}q${f((r() - 0.5) * 6)} ${f(-h / 2)} 0 ${f(-h)}" ${pen(INK, 0.8)}/>`; for (let j = 1; j < 4; j++) s += `<path d="M${f(x)} ${f(ground - (h * j) / 4)}l${j % 2 ? 5 : -5} -4" ${pen(INK, 0.7)}/>`; if (k % 3 === 0) s += `<circle cx="${f(x)}" cy="${f(ground - h - 2)}" r="2" fill="${[RED, '#a97b22', '#3f7d78'][k % 4 % 3]}" opacity=".75"/>`; }
    return s;
  };
  const keys = (y) => { let s = ''; [[5, 0], [9, 8], [8, 16], [7, 24]].forEach(([n, off], row) => { for (let k = 0; k < Math.min(n, 8); k++) s += `<rect x="${34 + off + k * 23}" y="${y + row * 20}" width="19" height="15" rx="3" fill="${['#f6e3da', '#dfeae4', '#dfe5f0', '#f1e6c8'][row]}" stroke="${INK}" stroke-width=".7"/>`; }); return s; };
  const hello = (y) => jMark(130, y + 34, 1.1) + textLines(130, y + 62, [40]) + `<path d="M96 ${y + 78}h14M116 ${y + 78}h14M136 ${y + 78}h14M156 ${y + 78}h10" ${pen(RED, 0.8)} stroke-dasharray="2 2" opacity=".8"/>`;
  const heroBlock = () => band(0, 150, PAPER) + jMark(130, 52, 1.5) + textLines(130, 96, [84]) + textLines(130, 110, [120, 96]);

  /* ---- a · falling star: altitude, from the stars down to the ground ---- */
  const a = () => {
    const [con] = constellation(176, 3);
    return heroBlock() + label(144, 'the j, and a star gets loose')
      + band(150, 290, NIGHT) + dust(150, 290, 46, 8) + label(168, 'work — the stars', '#a9a596') + con + shooting(150, 418, 60)
      + band(440, 220, SKY) + label(458, 'side projects — open air, birds') + flock(486, 12) + cards(540)
      + band(660, 210, BLUSH) + label(678, 'about — notes perched on the wires')
      + `<path d="M26 694v150M234 694v150M18 702h16M226 702h16" ${pen(INK, 1.1)}/>` + staff(712, (x) => 9 * Math.sin((x / W) * Math.PI), INK, INK, 9) + pictures(772)
      + `<path d="M0 846Q130 838 260 846" ${pen(INK, 0.8)}/>`
      + band(870, 180, SAND) + label(888, 'skills — what grows on the ground')
      + `<path d="M0 990Q70 984 130 989T260 987" ${pen(INK, 0.9)}/>` + sprigs(988, 21)
      + `<circle cx="196" cy="1004" r="2.4" fill="${MOON}" stroke="${INK}" stroke-width=".6"/><path d="M196 1004l-3 -22" ${pen(INK, 0.5)} stroke-dasharray="1 3" opacity=".6"/>`
      + band(1050, 130, PAPER) + label(1068, 'hello — the star, landed') + hello(1062)
      + `<path d="M118 62C60 120 190 150 150 418C140 520 60 560 110 660S200 800 196 1004" ${pen(PEN, 0.8)} opacity=".55"/>`;
  };

  /* ---- b · night into morning: one place, the sky changing above it ---- */
  const b = () => {
    const [con] = constellation(176, 4);
    const moon = (x, y) => `<path d="M${x} ${y - 9}A9 9 0 1 0 ${x} ${y + 9}A6.500 9 0 0 1 ${x} ${y - 9}Z" fill="${MOON}" opacity=".9"/>`.replace(/6\.500/g, '6.5');
    let rays = '';
    for (let k = 0; k < 9; k++) { const t = Math.PI + (k / 8) * Math.PI; rays += `M${f(130 + 30 * Math.cos(t))} ${f(826 + 30 * Math.sin(t))}L${f(130 + 38 * Math.cos(t))} ${f(826 + 38 * Math.sin(t))}`; }
    return `<defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${NIGHT}"/><stop offset=".3" stop-color="${NIGHT}"/><stop offset=".47" stop-color="#4b4460"/>
        <stop offset=".6" stop-color="#c9a59a"/><stop offset=".76" stop-color="${BLUSH}"/><stop offset="1" stop-color="${PAPER}"/></linearGradient></defs>`
      + heroBlock() + label(144, 'the j, late at night')
      + `<rect x="0" y="150" width="${W}" height="900" fill="url(#dawn)"/>` + dust(150, 330, 50, 9)
      + label(168, 'work — deep night', '#a9a596') + con + moon(218, 176)
      + label(458, 'side projects — first light, birds wake', MOON) + moon(226, 560).replace('opacity=".9"', 'opacity=".5"') + flock(488, 14, 11).replace(new RegExp(INK, 'g'), '#2b2a36') + cards(546)
      + label(688, 'about — sunrise, the dawn chorus')
      + staff(716, (x) => -16 * Math.sin((x / W) * Math.PI), INK, INK, 11) + pictures(764)
      + `<path d="M100 826A30 30 0 0 1 160 826" fill="#f4d98a" stroke="${INK}" stroke-width=".9"/><path d="${rays}" ${pen(INK, 0.7)}/><path d="M0 826Q130 822 260 826" ${pen(INK, 0.9)}/>`
      + label(866, 'skills — full day') + `<circle cx="222" cy="884" r="8" fill="#f4d98a" stroke="${INK}" stroke-width=".8"/>` + keys(906)
      + `<path d="M0 1050h${W}" stroke="none"/>` + band(1050, 130, PAPER) + label(1068, 'hello — morning') + hello(1062)
      + `<path d="M118 62C40 200 220 300 140 470S60 700 130 790S200 980 124 1080" ${pen(PEN, 0.8)} opacity=".5"/>`;
  };

  /* ---- c · down to the water: stars, birds, then a sea whose waves are the staff ---- */
  const c = () => {
    const [con] = constellation(176, 5);
    const SEA = '#d6e2e4';
    const boat = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-12 2Q0 7 13 2L9 8Q0 11 -8 8Z" fill="#fcf9f1" ${pen(INK, 0.9).replace('fill="none" ', '')}/><path d="M0 3V-16M2 -14Q12 -7 3 1ZM-1 -12Q-7 -5 -2 1" ${pen(INK, 0.9)}/><path d="M0 -16l5 2-5 2Z" fill="${RED}"/></g>`;
    return heroBlock() + label(144, 'the j, and a line let down')
      + band(150, 290, NIGHT) + dust(150, 290, 46, 10) + label(168, 'work — the stars', '#a9a596') + con
      + band(440, 200, SKY) + label(458, 'side projects — birds over the water') + flock(486, 16) + cards(536)
      + band(640, 240, SEA) + label(658, 'about — the sea is the staff; the boat sails the tune')
      + staff(700, (x, k) => 3.2 * Math.sin(x / 13 + k * 0.5), INK, PEN, 13) + boat(74, 694)
      + pictures(760) + `<path d="M20 836q10 -5 20 0t20 0M150 848q10 -5 20 0t20 0M90 862q10 -5 20 0t20 0" ${pen(PEN, 0.7)} opacity=".6"/>`
      + band(880, 170, SAND) + label(898, 'skills — washed up on the shore')
      + `<path d="M0 884Q40 876 80 884T160 882 260 886" ${pen(INK, 0.8)}/>`
      + [[40, 930], [84, 950], [128, 924], [170, 952], [214, 930], [62, 990], [108, 1004], [152, 986], [198, 1002]].map(([x, y], i) => i % 3 === 0
        ? `<path d="M${x - 8} ${y}a8 8 0 0 1 16 0ZM${x} ${y}v-8M${x - 4} ${y}l1.500 -7M${x + 4} ${y}l-1.500 -7" ${pen(INK, 0.8)}/>`.replace(/1\.500/g, '1.5')
        : i % 3 === 1 ? `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" ${pen(INK, 0.8)}/><path d="M${x - 5} ${y}h10" ${pen(INK, 0.6)}/>`
        : `<path d="M${x} ${y - 8}l2.400 5.500 6 .5-4.600 3.900 1.500 5.800-5.300-3.200-5.300 3.200 1.500-5.800-4.600-3.900 6-.5Z" ${pen(INK, 0.8)}/>`.replace(/(\d)\.(\d)00/g, '$1.$2')).join('')
      + band(1050, 130, PAPER) + label(1068, 'hello — ashore') + hello(1062) + boat(196, 1092)
      + `<path d="M118 62C70 160 200 260 130 440S50 600 74 690" ${pen(PEN, 0.8)} opacity=".55"/><path d="M74 700C120 760 220 800 180 900S210 1040 196 1086" ${pen(PEN, 0.8)} stroke-dasharray="2 4" opacity=".5"/>`;
  };

  const boards = [
    ['a', 'falling star', 'the page loses height as you scroll: space, open air, treetop wires, the ground.', a,
      ['<b>stars.</b> work stays as the constellation; a shooting star breaks away.', '<b>open air.</b> side projects, with the birds and scattered marks; no grass.', '<b>wires.</b> the staff becomes five wires between two poles, the notes perched on them like birds.', '<b>ground.</b> skills grow out of a single ground line.', '<b>landed.</b> the star comes to rest beside the closing j.']],
    ['b', 'night into morning', 'the page stays in one place and time passes: one unbroken sky fading from night to day.', b,
      ['<b>deep night.</b> work as the constellation, a moon high up.', '<b>first light.</b> the moon sets, the birds wake over the side projects.', '<b>sunrise.</b> the staff arcs over a rising sun: the dawn chorus.', '<b>full day.</b> skills in plain daylight (the keys, here).', '<b>morning.</b> the closing j.']],
    ['c', 'down to the water', 'stars, then birds, then a sea whose five waves are the staff, with the boat back in the story.', c,
      ['<b>stars.</b> work as the constellation; the pen line is let down from the j.', '<b>birds.</b> side projects in the open air above the water.', '<b>the sea.</b> five wave lines double as the staff; the notes float on them and the boat sails through as you scroll.', '<b>shore.</b> skills as small things washed up on the sand.', '<b>ashore.</b> the boat pulled up beside the closing j.']],
  ];
  const root = document.getElementById('boards');
  boards.forEach(([letter, title, pitch, draw, beats]) => {
    const fig = document.createElement('section');
    fig.className = 'board'; fig.id = letter;
    fig.innerHTML = `<p class="letter">${letter}</p><h2>${title}</h2><p class="pitch">${pitch}</p>
      <svg viewBox="0 0 ${W} 1180" role="img" aria-label="Storyboard: ${title}">${draw()}</svg>
      <ol>${beats.map((t) => `<li>${t}</li>`).join('')}</ol>`;
    root.append(fig);
  });
})();
