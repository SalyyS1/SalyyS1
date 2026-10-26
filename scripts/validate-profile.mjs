import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { SaxesParser } from 'saxes';

const root = new URL('../', import.meta.url);
const config = JSON.parse(await readFile(new URL('profile.config.json', root), 'utf8'));
const data = JSON.parse(await readFile(new URL('data/github-profile.json', root), 'utf8'));
const readme = await readFile(new URL('README.md', root), 'utf8');
assert.equal(data.login, config.login);
const files = (await readdir(new URL('assets/', root))).filter(f => f.endsWith('.svg'));
const expectedDays = data.calendar.weeks.flatMap(w => w.contributionDays);
for (const file of files) {
  const xml = await readFile(new URL(`assets/${file}`, root), 'utf8');
  const parser = new SaxesParser({ xmlns: true });
  parser.on('error', error => { throw new Error(`${file}: ${error.message}`); });
  parser.write(xml).close();
  assert.match(xml, /<title id="title">/);
  assert.doesNotMatch(xml, /<(?:script|foreignObject|image)\b|(?:href|src)="https?:|\bNaN\b|\bInfinity\b/);
  if (file.startsWith('activity')) {
    const mapped = [...xml.matchAll(/data-date="([^"]+)" data-count="(\d+)"/g)].map(m => ({ date: m[1], count: +m[2] }));
    assert.equal(mapped.length, expectedDays.length, `${file}: missing calendar cells`);
    assert.equal(new Set(mapped.map(d => d.date)).size, expectedDays.length, `${file}: repeated dates`);
    assert.deepEqual(mapped, expectedDays.map(d => ({ date: d.date, count: d.contributionCount })));
  }
}
const refs = [...readme.matchAll(/(?:src|srcset)="(assets\/[^" ]+)"/g)].map(m => m[1]);
for (const ref of refs) assert.ok(files.includes(ref.slice(7)), `Missing README image ${ref}`);
for (const p of config.projects) {
  assert.ok(data.repositories.some(r => r.name === p.repo), `Missing public repository ${p.repo}`);
  assert.ok(readme.includes(`href="https://github.com/${config.login}/${p.repo}"`));
}
assert.ok(!readme.includes('moonlit-midautumn'));
assert.equal(files.length, 36);
console.log(`Validated ${files.length} SVGs, ${refs.length} image references and all project links.`);
