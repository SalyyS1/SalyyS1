import { text, label, line, rect, cube, arrow, svg } from './svg-primitives.mjs';
import { activitySummary } from './profile-data.mjs';

export function mobileHero(t) {
  let s = label('SALYYY / PERSONAL SOFTWARE LAB', 24, 30, t.accent, 10) + line(24, 47, 416, 47, t.line);
  s += text('salyyy.', 19, 146, 92, t.ink, 'SemiBold');
  s += text('Useful software.', 24, 196, 31, t.ink, 'SemiBold') + text('Thoughtfully built.', 24, 235, 31, t.accent, 'SemiBold');
  s += text('Apps, developer tools & AI workflows.', 24, 275, 16, t.muted);
  s += line(24, 304, 416, 304, t.line) + label('VIET NAM / SOFTWARE ENGINEERING', 24, 330, t.muted, 10);
  return svg(440, 352, 'Salyyy — personal software lab', 'Apps, developer tools and AI workflows. Useful software, thoughtfully built.', s, t);
}
export function mobileFocus(t) {
  let s = '';
  [['Applications', 'Local-first. User-controlled.'], ['Developer tools', 'Less friction. Better workflows.'], ['AI integration', 'Context. Review. Automation.']].forEach(([title, desc], i) => {
    const y = 34 + i * 72;
    s += label(`0${i + 1}`, 24, y, t.accent) + text(title, 66, y + 1, 20, t.ink, 'SemiBold') + text(desc, 66, y + 26, 14, t.muted);
  });
  return svg(440, 226, 'My focus', 'Applications, developer tools and AI integration.', s, t);
}
export function mobileSection(t) {
  return svg(440, 107, 'Selected work', 'A few things I have been building.', label('PROJECT INDEX', 24, 29, t.accent) + text('Selected work.', 24, 63, 29, t.ink, 'SemiBold') + text('A few things I have been building.', 24, 87, 14, t.muted), t);
}
export function mobileFeature(p, t) {
  let s = label(p.category, 24, 32, t.accent, 10) + arrow(394, 22, t.muted);
  s += text('SLClean', 24, 78, 36, t.ink, 'SemiBold') + text('A clearer view of your machine.', 24, 111, 20, t.ink);
  s += text('Inspect disk usage, caches and duplicates.', 24, 150, 15, t.muted) + text('Review first. You choose what goes.', 24, 176, 15, t.muted);
  s += label('RELEASED', 24, 216, t.muted, 9) + line(24, 234, 416, 234, t.line) + text(p.stack, 24, 261, 12, t.muted, 'Mono');
  return svg(440, 284, 'SLClean — desktop utility', p.lines.join(' '), s, t);
}
export function mobileActivity(calendar, t) {
  const a = activitySummary(calendar);
  let s = label('BUILD LOG / LAST 12 MONTHS', 24, 30, t.accent, 10) + text('A little, then a little more.', 24, 67, 26, t.ink, 'SemiBold');
  const colors = { NONE: t.tile, FIRST_QUARTILE: '#5C7940', SECOND_QUARTILE: '#7DA34C', THIRD_QUARTILE: '#A1CD5B', FOURTH_QUARTILE: '#C5EF78' };
  calendar.weeks.forEach((w, wi) => w.contributionDays.forEach(d => {
    const di = new Date(d.date + 'T00:00:00Z').getUTCDay();
    s += `<g data-date="${d.date}" data-count="${d.contributionCount}"><title>${d.date}: ${d.contributionCount} contributions</title>${rect(25 + wi * 7.3, 98 + di * 9, 6, 7, colors[d.contributionLevel], 1)}</g>`;
  }));
  s += text(`${a.from} → ${a.to}`, 24, 186, 11, t.muted, 'Mono') + line(24, 205, 416, 205, t.line);
  [[a.total.toLocaleString('en-US'), 'CONTRIBUTIONS'], [a.activeDays, 'ACTIVE DAYS'], [a.peak, 'DAILY PEAK']].forEach(([value, name], i) => {
    s += text(value, 24 + i * 141, 249, 28, t.ink, 'SemiBold') + label(name, 24 + i * 141, 273, t.muted, 8);
  });
  return svg(440, 298, 'GitHub contribution calendar', `${a.total} contributions across ${a.activeDays} active days.`, s, t);
}
export function mobileStack(t) {
  let s = label('THE TOOLBOX', 24, 30, t.accent) + text('Tools follow the problem.', 24, 70, 27, t.ink, 'SemiBold');
  [['LANGUAGES', 'Rust · TypeScript · Go · Kotlin · Java · Python'], ['APPLICATIONS', 'React · Tauri · Electron · Next.js'], ['WORKFLOWS', 'GitHub Actions · Agent skills · MCP']].forEach(([title, value], i) => {
    s += label(title, 24, 109 + i * 63, t.muted, 9) + text(value, 24, 133 + i * 63, 14, t.ink);
  });
  return svg(440, 282, 'Toolbox', 'Languages, application frameworks and automation tools.', s, t);
}
export function mobileFooter(t) {
  let s = label('ALWAYS A WORK IN PROGRESS', 24, 30, t.accent, 10);
  s += text('Good software starts', 24, 73, 28, t.ink, 'SemiBold') + text('with a useful question.', 24, 109, 28, t.ink, 'SemiBold');
  s += text('Find me around the web. Or start with the code.', 24, 146, 15, t.muted) + line(24, 169, 416, 169, t.line) + label('SALYYY / KEEP MAKING THINGS.', 24, 195, t.muted, 10);
  return svg(440, 217, 'Keep making things', 'Good software starts with a useful question.', s, t);
}
