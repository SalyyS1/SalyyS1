import { text, label, rect, line, circle, path, cube, arrow, svg } from './svg-primitives.mjs';

function coreArtwork(t) {
  let s = '';
  // Three exploded application layers: storage, tooling, and a human-facing interface.
  const ox = 666, oy = 252;
  for (let i = 0; i < 5; i++) {
    s += line(520 + i * 48, 308 - i * 24, 716 + i * 24, 406 - i * 48, t.line);
    s += line(520 + i * 48, 308 + i * 24, 760 + i * 24, 188 + i * 24, t.line);
  }
  s += `<g transform="translate(${ox} ${oy})">`;
  for (const [y, fill, stroke] of [[50, t.tile, t.line], [0, t.panel, t.accent], [-57, t.bg, t.accent]]) {
    s += path(`M-95 ${y}l112 -56 112 56 -112 56Z`, fill, stroke, 1.2);
    s += path(`M-95 ${y}v12l112 56 112 -56v-12M17 ${y + 56}v12`, 'none', stroke, 1.2);
  }
  s += path('M-66 -58l86 -43 82 41M-38 -44l84 -42M-9 -29l84 -42', 'none', t.line, 1.3);
  s += cube(-9, -100, 28, 31, t.accent, t.tile, t.side, t.accent);
  s += circle(20, -147, 4, t.soft) + line(20, -137, 20, -118, t.soft);
  s += '</g>';
  s += label('01 / INTERFACE', 674, 112, t.muted, 9) + line(655, 116, 627, 143, t.line);
  s += label('02 / SYSTEM', 726, 273, t.muted, 9) + line(722, 265, 693, 250, t.line);
  s += label('03 / INTENT', 552, 389, t.muted, 9);
  return s;
}

export function hero(t) {
  let s = label('SALYYY / PERSONAL SOFTWARE LAB', 36, 39, t.accent);
  s += label('VIET NAM · UTC+07', 677, 39, t.muted, 10) + line(36, 59, 860, 59, t.line);
  s += text('salyyy.', 31, 183, 110, t.ink, 'SemiBold');
  s += text('Useful software.', 36, 244, 35, t.ink, 'SemiBold');
  s += text('Thoughtfully built.', 36, 288, 35, t.accent, 'SemiBold');
  s += text('Apps, developer tools & AI workflows.', 38, 332, 18, t.muted);
  s += coreArtwork(t);
  s += line(36, 418, 860, 418, t.line);
  s += label('BUILD / UNDERSTAND / REFINE', 36, 445, t.muted, 10);
  s += label('SOFTWARE ENGINEERING', 665, 445, t.accent, 10);
  return svg(896, 468, 'Salyyy — personal software lab', 'Software engineering in Viet Nam. Building apps, developer tools and AI workflows. Useful software, thoughtfully built.', s, t);
}

export function focus(t) {
  let s = '';
  const fields = [['01', 'Applications', 'Local-first. User-controlled.'], ['02', 'Developer tools', 'Less friction. Better workflows.'], ['03', 'AI integration', 'Context. Review. Automation.']];
  fields.forEach(([n, title, desc], i) => {
    const x = 32 + i * 294;
    s += label(n, x, 28, t.accent) + text(title, x, 59, 22, t.ink, 'SemiBold') + text(desc, x, 87, 14, t.muted);
    if (i < 2) s += line(x + 268, 24, x + 268, 89, t.line);
  });
  return svg(896, 116, 'My focus', 'Applications; developer tools; AI integration.', s, t);
}

export function section(t, number, title, caption) {
  return svg(896, 98, title, caption, label(number, 32, 32, t.accent) + text(title, 32, 70, 31, t.ink, 'SemiBold') + text(caption, 360, 65, 14, t.muted), t);
}

function motif(kind, x, y, t) {
  let s = '';
  if (kind === 'terminal') return rect(x, y, 58, 44, 'none', 5, t.accent) + path(`M${x + 12} ${y + 13}l8 7 -8 7m17 0h14`, 'none', t.accent, 2);
  if (kind === 'pulse') return path(`M${x} ${y + 25}h12l7 -17 13 34 8 -17h21`, 'none', t.accent, 2);
  if (kind === 'nodes') {
    s += path(`M${x + 8} ${y + 10}L${x + 49} ${y + 22}L${x + 14} ${y + 43}Z`, 'none', t.line, 2);
    for (const [a, b] of [[8, 10], [49, 22], [14, 43]]) s += circle(x + a, y + b, 6, t.bg, t.accent);
    return s;
  }
  for (let i = 2; i >= 0; i--) s += rect(x + i * 9, y + i * 8, 39, 33, t.bg, 3, i === 0 ? t.accent : t.line);
  return s + line(x + 9, y + 12, x + 29, y + 12, t.accent) + line(x + 9, y + 20, x + 24, y + 20, t.accent);
}

export function projectCard(p, t, featured = false) {
  const w = featured ? 896 : 440, h = featured ? 268 : 254;
  let s = label(p.category, 28, 34, t.accent, 10) + arrow(w - 44, 24, t.muted);
  s += text(p.title, 28, 85, featured ? 35 : 30, t.ink, 'SemiBold');
  p.lines.forEach((v, i) => { s += text(v, 28, 121 + i * 24, featured ? 17 : 15, t.muted); });
  s += label(p.status, 28, h - 68, p.status.startsWith('EXPERIMENTAL') ? t.soft : t.muted, 9);
  s += line(28, h - 50, w - 28, h - 50, t.line) + text(p.stack, 28, h - 24, 12, t.muted, 'Mono');
  if (featured) {
    s += rect(663, 61, 192, 138, t.panel, 8, t.line);
    s += label('SLCLEAN', 680, 87, t.muted, 10);
    const lengths = [126, 90, 57];
    lengths.forEach((l, i) => { s += rect(681, 107 + i * 24, 152, 8, t.line, 4) + rect(681, 107 + i * 24, l, 8, i === 0 ? t.accent : t.muted, 4); });
    s += text('inspect → select → confirm', 681, 187, 10, t.muted, 'Mono');
  } else s += motif(p.motif, 347, 147, t);
  return svg(w, h, `${p.repo}: ${p.title}`, `${p.lines.join(' ')} ${p.stack}. ${p.status}.`, s, t);
}

export function stack(t) {
  let s = label('THE TOOLBOX', 32, 33, t.accent);
  s += text('Tools follow the problem.', 32, 78, 29, t.ink, 'SemiBold');
  const rows = [['LANGUAGES', 'Rust · TypeScript · Go · Kotlin · Java · Python'], ['APPLICATIONS', 'React · Tauri · Electron · Next.js'], ['WORKFLOWS', 'Git · GitHub Actions · Agent skills · MCP']];
  rows.forEach(([title, value], i) => { s += label(title, 33, 118 + i * 30, t.muted, 10) + text(value, 202, 118 + i * 30, 16, t.ink); });
  return svg(896, 207, 'Toolbox', rows.map(r => r.join(': ')).join('. '), s, t);
}

export function footer(t) {
  let s = label('ALWAYS A WORK IN PROGRESS', 32, 32, t.accent);
  s += text('Good software starts with a useful question.', 32, 80, 30, t.ink, 'SemiBold');
  s += text('Find me around the web. Or start with the code.', 32, 113, 17, t.muted) + arrow(831, 77, t.accent);
  s += line(32, 141, 864, 141, t.line) + label('SALYYY / BUILT WITH INTENT', 32, 168, t.muted, 10) + label('KEEP MAKING THINGS.', 684, 168, t.accent, 10);
  return svg(896, 191, 'Keep making things', 'Salyyy. Good software starts with a useful question. Find me around the web, or start with the code.', s, t);
}
