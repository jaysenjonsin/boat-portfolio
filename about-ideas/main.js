(() => {
  const INK = '#25272e', PEN = '#3c5a94', PAPER = '#fcf9f1';
  const pen = (c = INK, w = 1.2) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  // the four pastimes, each drawn in an 80 x 80 box
  const doodles = [
    '<path d="M40 24Q26 14 10 20V60Q26 54 40 64Q54 54 70 60V20Q54 14 40 24Z"/><path d="M40 24V64"/><path d="M18 32q8-3 14 1M18 42q8-3 14 1M48 33q8-4 14-1M48 43q8-4 14-1"/>',
    '<path d="M22 40H58"/><path d="M16 26h7v28h-7zM57 26h7v28h-7z"/><path d="M8 32h5v16H8zM67 32h5v16h-5z"/>',
    '<path d="M30 56V18l30-6v38"/><path d="M30 28l30-6"/><ellipse cx="22" cy="57" rx="8" ry="6"/><ellipse cx="52" cy="51" rx="8" ry="6"/>',
    '<path d="M22 34l5 34h26l5-34Z"/><path d="M32 35l2 33M40 35v33M48 35l-2 33"/><path d="M22 34q-3-9 6-9q1-9 10-6q6-7 12 1q9-2 8 8q4 5 0 6"/>',
  ];
  const draw = (k, x, y, s, c = INK, w = 2) => `<g transform="translate(${x} ${y}) scale(${s})" ${pen(c, w / s)}>${doodles[k]}</g>`;
  const put = (id, viewBox, make) => doodles.forEach((_, k) => {
    document.getElementById(id).insertAdjacentHTML('beforeend', `<li><svg viewBox="${viewBox}" aria-hidden="true">${make(k)}</svg></li>`);
  });

  // a · each picture inside a rising bubble
  put('a', '0 0 130 140', (k) => `
    <circle cx="65" cy="66" r="54" fill="rgba(252,249,241,.28)" ${pen(INK, 1.1).replace('fill="none" ', '')}/>
    <path d="M26 44A44 44 0 0 1 52 22" ${pen(PAPER, 2.2)} opacity=".9"/>
    ${draw(k, 35, 36, 0.75)}
    <circle cx="${k % 2 ? 108 : 20}" cy="126" r="5" ${pen(INK, 0.9)}/><circle cx="${k % 2 ? 120 : 9}" cy="110" r="2.6" ${pen(INK, 0.8)}/>`);

  // b · each picture on a note in a floating bottle
  put('b', '0 0 130 150', (k) => `
    <g transform="rotate(${[14, -10, 18, -14][k]} 65 80)">
      <path d="M57 8h16v8H57Z" fill="#c9a36a" stroke="${INK}" stroke-width="1"/>
      <path d="M58 16v16Q36 44 36 66V122Q36 134 48 134H82Q94 134 94 122V66Q94 44 72 32V16" fill="rgba(252,249,241,.3)" ${pen().replace('fill="none" ', '')}/>
      <rect x="45" y="64" width="40" height="46" fill="${PAPER}" stroke="${INK}" stroke-width=".8" transform="rotate(-5 65 87)"/>
      ${draw(k, 47, 68, 0.45)}
      <path d="M42 58Q40 86 43 118" ${pen(PAPER, 1.6)} opacity=".8"/>
    </g>
    <path d="M6 138q10 -7 20 0t20 0 20 0 20 0 20 0 20 0" ${pen(PEN, 1)} opacity=".7"/>`);

  // c · each picture as the sail of a small raft
  put('c', '0 0 130 150', (k) => `
    <path d="M65 118V16" ${pen()}/>
    <path d="M30 22Q65 14 100 22L96 84Q65 92 34 84Z" fill="${PAPER}" ${pen().replace('fill="none" ', '')}/>
    ${draw(k, 43, 30, 0.56)}
    <path d="M22 118Q65 132 108 116L98 130Q65 140 34 131Z" fill="${PAPER}" ${pen().replace('fill="none" ', '')}/>
    <path d="M4 142q10 -7 20 0t20 0M82 144q10 -7 20 0t20 0" ${pen(PEN, 1)} opacity=".7"/>`);

  // d · each picture standing on the water, with its reflection
  put('d', '0 0 130 160', (k) => `
    ${draw(k, 25, 4, 1)}
    <path d="M6 80q10 -5 20 0t20 0 20 0 20 0 20 0 18 0" ${pen(PEN, 1)} opacity=".8"/>
    <g transform="translate(0 164) scale(1 -1)" opacity=".4" stroke-dasharray="7 4">${draw(k, 25, 4, 1, PEN, 1.6)}</g>
    <path d="M30 104h26M70 122h30M24 140h20" ${pen('#c8dadd', 3)}/>`);
})();
