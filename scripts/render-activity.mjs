import { activitySummary } from './profile-data.mjs';
import { text, label, line, rect, cube, svg } from './svg-primitives.mjs';

export function activity(calendar, t, date) {
  const a = activitySummary(calendar);
  let s = label('BUILD LOG / LAST 12 MONTHS', 32, 34, t.accent);
  s += text('A little, then a little more.', 32, 75, 31, t.ink, 'SemiBold');
  s += label(`${a.from} → ${a.to}`, 579, 33, t.muted, 10);
  const size = 6.45, dx = 13.7, dy = 6.8;
  const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  const colors = [t.tile, '#5C7940', '#7DA34C', '#A1CD5B', '#C5EF78'];
  // Isometric columns map exactly one-to-one to calendar days; height is logarithmic.
  calendar.weeks.forEach((week, wi) => week.contributionDays.forEach(day => {
    const di = new Date(day.date + 'T00:00:00Z').getUTCDay();
    const height = day.contributionCount ? 4 + Math.log2(day.contributionCount + 1) * 7 : 2;
    const x = 84 + wi * dx - di * size;
    const y = 185 + di * dy - height;
    s += `<g data-date="${day.date}" data-count="${day.contributionCount}"><title>${day.date}: ${day.contributionCount} contributions</title>`;
    s += cube(x, y, size, height, colors[levels[day.contributionLevel] ?? 0], t.side, t.tile, t.bg) + '</g>';
  }));
  s += label('ONE COLUMN = ONE DAY', 38, 260, t.muted, 9);
  s += label('LESS', 654, 258, t.muted, 9);
  colors.forEach((c, i) => { s += rect(699 + i * 18, 247, 12, 12, c, 2); });
  s += label('MORE', 799, 258, t.muted, 9);
  s += line(32, 282, 864, 282, t.line);
  [[a.total.toLocaleString('en-US'), 'CONTRIBUTIONS'], [a.activeDays, 'DAYS WITH ACTIVITY'], [a.peak, 'MOST IN ONE DAY']].forEach(([value, title], i) => {
    const x = 34 + i * 287;
    s += text(value, x, 326, 31, t.ink, 'SemiBold') + label(title, x, 349, t.muted, 9);
  });
  s += text(`GitHub contribution calendar · snapshot ${date} UTC`, 34, 381, 11, t.muted, 'Mono');
  return svg(896, 404, 'GitHub contribution landscape', `${a.total} contributions across ${a.activeDays} active days. ${a.from} to ${a.to}. Heights encode daily counts.`, s, t);
}
