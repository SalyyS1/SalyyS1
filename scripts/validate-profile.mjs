import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const config = JSON.parse(await readFile(new URL('profile.config.json', root), 'utf8'));
const data = JSON.parse(await readFile(new URL('data/github-profile.json', root), 'utf8'));
const readme = await readFile(new URL('README.md', root), 'utf8');
assert.equal(data.login, config.login);
const files = (await readdir(new URL('assets/', root))).filter(f => f.endsWith('.svg'));
const refs = [...readme.matchAll(/(?:src|srcset)="(assets\/[^" ]+)"/g)].map(m => m[1]);
assert.equal(files.length, 8, 'Profile should ship four small light/dark project marks');
assert.equal(refs.length, 8, 'README should reference four light/dark project marks');
for (const ref of refs) assert.ok(files.includes(ref.slice(7)), `Missing README image ${ref}`);
for (const p of config.projects) {
  assert.ok(data.repositories.some(r => r.name === p.repo), `Missing public repository ${p.repo}`);
  assert.ok(readme.includes(`href="https://github.com/${config.login}/${p.repo}"`));
}
assert.ok(!readme.includes('moonlit-midautumn'));
assert.match(readme, /<table>[\s\S]*SLClean[\s\S]*SLTerm[\s\S]*Stella Bot[\s\S]*Foliora[\s\S]*<\/table>/);
assert.doesNotMatch(readme, /DiscordsRPC/);
console.log(`Validated text-first README, ${files.length} SVG assets and all project links.`);
