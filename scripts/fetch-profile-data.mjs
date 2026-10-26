import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { normalizeProfile } from './profile-data.mjs';
import { setTimeout as delay } from 'node:timers/promises';

async function requestGraphQL(payload) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return JSON.parse(execFileSync('gh', ['api', 'graphql', '--input', '-'], {
        input: JSON.stringify(payload), encoding: 'utf8', timeout: 45000,
        maxBuffer: 8 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe']
      }));
    } catch (error) {
      const message = String(error.stderr || error.message).split('\n')[0];
      if (attempt === 2 || !/HTTP 50[234]|timed?\s?out|ETIMEDOUT/i.test(message)) {
        throw new Error(`GitHub data fetch failed: ${message}`);
      }
      console.warn(`GitHub temporarily unavailable; retry ${attempt + 1}/2.`);
      await delay(2000 * (attempt + 1));
    }
  }
}

const config = JSON.parse(await readFile(new URL('../profile.config.json', import.meta.url), 'utf8'));
const query = `query($login: String!, $cursor: String) {
  user(login: $login) {
    login
    repositories(first: 100, after: $cursor, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: {field: NAME, direction: ASC}) {
      nodes { name url isPrivate isFork isArchived primaryLanguage { name } stargazerCount }
      pageInfo { hasNextPage endCursor }
    }
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
    }
  }
}`;
let cursor = null;
let user;
const repositories = [];
do {
  // gh reads GH_TOKEN in Actions or the user's credential store locally. Never persist credentials.
  const result = await requestGraphQL({ query, variables: { login: config.login, cursor } });
  if (result.errors?.length) throw new Error(result.errors.map(e => e.message).join('; '));
  user = result.data.user;
  if (!user) throw new Error('GitHub user not found');
  repositories.push(...user.repositories.nodes);
  cursor = user.repositories.pageInfo.hasNextPage ? user.repositories.pageInfo.endCursor : null;
} while (cursor);
user.repositories.nodes = repositories;
const snapshot = normalizeProfile(user, config.login, new Date().toISOString().slice(0, 10));
for (const project of config.projects) {
  if (!snapshot.repositories.some(r => r.name === project.repo)) throw new Error(`Featured repository unavailable: ${project.repo}`);
}
await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(new URL('../data/github-profile.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Saved ${snapshot.repositories.length} public, non-fork, active repositories and the contribution calendar.`);
