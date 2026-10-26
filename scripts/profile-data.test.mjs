import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeProfile, activitySummary } from './profile-data.mjs';

const snapshot = JSON.parse(readFileSync(new URL('../data/github-profile.json', import.meta.url), 'utf8'));
const makeUser = () => ({ login: snapshot.login, repositories: { nodes: [
  { name: 'public-project', url: 'https://github.com/SalyyS1/public-project', isPrivate: false, isFork: false, isArchived: false, primaryLanguage: { name: 'Rust' }, stargazerCount: 0 },
  { name: 'private-project', isPrivate: true }, { name: 'fork-project', isFork: true }, { name: 'archive-project', isArchived: true }
] }, contributionsCollection: { contributionCalendar: structuredClone(snapshot.calendar) } });

test('publishes only the allowed public metadata, excluding forks and archived repositories', () => {
  const result = normalizeProfile(makeUser(), snapshot.login, '2026-10-27');
  assert.deepEqual(result.repositories.map(r => r.name), ['public-project']);
  assert.equal(JSON.stringify(result).includes('private-project'), false);
  assert.deepEqual(Object.keys(result.repositories[0]).sort(), ['language', 'name', 'stars', 'url']);
});
test('refuses the wrong user and incomplete or inconsistent contribution data', () => {
  assert.throws(() => normalizeProfile(makeUser(), 'someone-else', ''), /account/);
  const user = makeUser();
  user.contributionsCollection.contributionCalendar.totalContributions++;
  assert.throws(() => normalizeProfile(user, snapshot.login, ''), /mismatch/);
  user.contributionsCollection.contributionCalendar.weeks = [];
  assert.throws(() => normalizeProfile(user, snapshot.login, ''), /Incomplete/);
});
test('activity summary counts every day once and handles a zero-activity calendar', () => {
  const calendar = structuredClone(snapshot.calendar);
  calendar.weeks.forEach(w => w.contributionDays.forEach(d => { d.contributionCount = 0; }));
  calendar.totalContributions = 0;
  const summary = activitySummary(calendar);
  assert.equal(summary.total, 0);
  assert.equal(summary.peak, 0);
  assert.equal(summary.activeDays, 0);
});
