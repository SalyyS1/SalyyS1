import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { themes, escape, text, label, rect, line, circle, path, svg } from './svg-primitives.mjs';
import { activitySummary } from './profile-data.mjs';

const root = new URL('../', import.meta.url);
const config = JSON.parse(await readFile(new URL('profile.config.json', root), 'utf8'));
const data = JSON.parse(await readFile(new URL('data/github-profile.json', root), 'utf8'));
const assets = new URL('assets/', root);
await mkdir(assets, { recursive: true });
for (const file of await readdir(assets)) if (file.endsWith('.svg')) await unlink(new URL(file, assets));

const motif = (kind, x, y, t) => {
  if (kind === 'terminal') return rect(x, y, 55, 34, 'none', 5, t.accent) + path(`M${x + 11} ${y + 10}l8 7 -8 7m17 0h15`, 'none', t.accent, 1.8);
  if (kind === 'nodes') return path(`M${x + 8} ${y + 8}L${x + 47} ${y + 18}L${x + 14} ${y + 37}Z`, 'none', t.line, 1.5) + circle(x + 8, y + 8, 5, t.bg, t.accent) + circle(x + 47, y + 18, 5, t.bg, t.accent) + circle(x + 14, y + 37, 5, t.bg, t.accent);
  if (kind === 'kit') return rect(x, y, 38, 28, 'none', 4, t.accent) + rect(x + 9, y + 8, 38, 28, 'none', 4, t.line) + line(x + 10, y + 14, x + 29, y + 14, t.accent) + line(x + 10, y + 21, x + 23, y + 21, t.accent);
  return rect(x, y + 5, 42, 29, 'none', 4, t.accent) + line(x + 9, y + 14, x + 33, y + 14, t.accent) + line(x + 9, y + 22, x + 28, y + 22, t.accent);
};

function compactHero(t) {
  let s = label('SALYYY / PERSONAL SOFTWARE LAB', 30, 30, t.accent, 10) + label('SOFTWARE ENGINEER · VIET NAM', 661, 30, t.muted, 9) + line(30, 46, 866, 46, t.line);
  s += text('Useful software.', 30, 103, 39, t.ink, 'SemiBold') + text('Thoughtfully built.', 30, 147, 39, t.accent, 'SemiBold');
  s += text('Applications, developer tools and AI workflows.', 32, 181, 16, t.muted);
  s += line(30, 208, 866, 208, t.line) + label('BUILD / UNDERSTAND / REFINE', 30, 229, t.muted, 9) + label('LOCAL-FIRST · REVIEWABLE · PRACTICAL', 632, 229, t.accent, 9);
  // A small three-layer mark keeps the identity without turning the hero into an illustration.
  s += path('M700 94l62 -30 62 30 -62 30Z', t.panel, t.accent, 1) + path('M700 94v12l62 30 62 -30V94M762 124v12', 'none', t.line, 1);
  s += path('M718 132l44 -21 44 21 -44 21Z', t.tile, t.line, 1) + circle(762, 76, 4, t.soft);
  return svg(896, 250, 'Salyyy — personal software lab', 'Applications, developer tools and AI workflows. Useful software, thoughtfully built.', s, t);
}

function projectCard(project, t) {
  let s = label(project.category, 22, 26, t.accent, 9) + text(project.title, 22, 63, 25, t.ink, 'SemiBold');
  s += text(project.lines[0], 22, 91, 13, t.muted) + text(project.lines[1], 22, 111, 13, t.muted);
  s += line(22, 132, 408, 132, t.line) + label(project.stack, 22, 154, t.muted, 8) + label(project.status, 314, 154, project.status.startsWith('EXPERIMENTAL') ? t.soft : t.muted, 8);
  s += motif(project.motif, 344, 35, t);
  return svg(430, 174, `${project.title} — ${project.category}`, `${project.lines.join(' ')} ${project.stack}. ${project.status}.`, s, t);
}

function compactActivity(t) {
  const summary = activitySummary(data.calendar);
  let s = label('BUILD LOG / LAST 12 MONTHS', 30, 28, t.accent, 9) + text('A little, then a little more.', 30, 57, 23, t.ink, 'SemiBold');
  const colors = [t.tile, '#5C7940', '#7DA34C', '#A1CD5B', '#C5EF78'];
  const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  data.calendar.weeks.forEach((week, wi) => week.contributionDays.forEach((day, di) => {
    s += `<g data-date="${day.date}" data-count="${day.contributionCount}"><title>${day.date}: ${day.contributionCount} contributions</title>${rect(30 + wi * 15.4, 75 + di * 8, 10, 6, colors[levels[day.contributionLevel] ?? 0], 1)}</g>`;
  }));
  s += line(30, 141, 866, 141, t.line);
  [[summary.total.toLocaleString('en-US'), 'CONTRIBUTIONS'], [summary.activeDays, 'ACTIVE DAYS'], [summary.peak, 'DAILY PEAK']].forEach(([value, name], i) => { const x = 30 + i * 280; s += text(value, x, 169, 23, t.ink, 'SemiBold') + label(name, x + 76, 168, t.muted, 8); });
  return svg(896, 190, 'GitHub contribution calendar', `${summary.total} contributions across ${summary.activeDays} active days.`, s, t);
}

function compactToolbox(t) {
  let s = label('THE TOOLBOX', 30, 28, t.accent, 9) + text('Tools follow the problem.', 30, 59, 23, t.ink, 'SemiBold');
  s += label('LANGUAGES', 30, 87, t.muted, 8) + text('Rust · TypeScript · Go · Kotlin · Java · Python', 136, 87, 12, t.ink);
  s += label('RUNTIME', 30, 108, t.muted, 8) + text('React · Tauri · Electron · Next.js · GitHub Actions · MCP', 136, 108, 12, t.ink);
  return svg(896, 130, 'Toolbox', 'Rust, TypeScript, Go, Kotlin, Java, Python, React, Tauri, Electron, Next.js, GitHub Actions and MCP.', s, t);
}

for (const [name, t] of Object.entries(themes)) {
  await writeFile(new URL(`hero.${name}.svg`, assets), compactHero(t));
  for (const [i, project] of config.projects.entries()) await writeFile(new URL(`project-${i + 1}.${name}.svg`, assets), projectCard(project, t));
  await writeFile(new URL(`activity.${name}.svg`, assets), compactActivity(t));
  await writeFile(new URL(`toolbox.${name}.svg`, assets), compactToolbox(t));
}

const picture = (name, alt, width = 896) => `<picture>\n<source media="(prefers-color-scheme: dark)" srcset="assets/${name}.dark.svg">\n<img src="assets/${name}.light.svg" width="${width}" alt="${escape(alt)}">\n</picture>`;
let readme = `<!-- Generated by scripts/render-compact.mjs. Edit profile.config.json to update projects. -->\n\n<p align="center">\n${picture('hero', 'Salyyy — useful software, thoughtfully built.')}\n</p>\n\n`;
readme += `<p align="center"><a href="https://github.com/${config.login}/SLClean/releases">Applications</a> &nbsp; / &nbsp; <a href="https://github.com/${config.login}/SLTerm">Developer tools</a> &nbsp; / &nbsp; <a href="${config.links.discord}">Contact</a></p>\n\n`;
readme += `I’m **Salyyy**, a software builder from **Viet Nam**. I make desktop applications, developer tools and practical automation with a focus on local-first, reviewable software.\n\n`;
readme += `<p align="center">\n`;
config.projects.forEach((project, i) => {
  const alt = escape(`${project.title}: ${project.lines.join(' ')} ${project.stack}`);
  readme += `<a href="https://github.com/${config.login}/${project.repo}"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/project-${i + 1}.dark.svg"><img src="assets/project-${i + 1}.light.svg" width="430" alt="${alt}"></picture></a>\n`;
});
readme += `</p>\n\n`;
readme += `<details>\n<summary>Engineering notes</summary>\n\n- **[SLClean](https://github.com/${config.login}/SLClean)** — Windows disk utility with review-before-delete controls and releases.\n- **[SLTerm](https://github.com/${config.login}/SLTerm)** — customized workspace based on [Wave Terminal](https://github.com/wavetermdev/waveterm).\n- **[Stella Bot](https://github.com/${config.login}/discord-bot)** — TypeScript dashboard and Discord workflow automation.\n- **[Foliora](https://github.com/${config.login}/foliora)** — experimental local-first context packs with optional AI assistance.\n\nMinecraft tooling stays in the repositories, but it is not the focus of this profile.\n\n</details>\n\n`;
readme += `<p align="center">\n${picture('activity', 'GitHub contribution activity.')}\n</p>\n\n<p align="center">\n${picture('toolbox', 'Languages and tools used across my projects.')}\n</p>\n\n`;
readme += `<p align="center"><a href="${config.links.discord}">Discord</a> &nbsp; / &nbsp; <a href="${config.links.facebook}">Facebook</a> &nbsp; / &nbsp; <a href="${config.links.instagram}">Instagram</a> &nbsp; / &nbsp; <a href="${config.links.spotify}">Spotify</a></p>\n\n`;
readme += `<details>\n<summary>About this profile</summary>\n\nCompact Personal Software Lab layout. SVGs are generated locally from public GitHub data and support light/dark themes. Run \`npm ci\`, \`npm run refresh\` and \`npm run check\` with Node.js 22+ and an authenticated GitHub CLI.\n\n</details>\n`;
await writeFile(new URL('README.md', root), readme);
console.log(`Rendered ${config.projects.length} compact project cards in ${Object.keys(themes).length} themes.`);
