/** Keep the published snapshot limited to public repository metadata and calendar totals. */
export function normalizeProfile(user, login, fetchedAt) {
  if (!user || user.login.toLowerCase() !== login.toLowerCase()) throw new Error('Unexpected GitHub account');
  const repos = user.repositories.nodes.filter(r => !r.isPrivate && !r.isFork && !r.isArchived);
  const calendar = user.contributionsCollection.contributionCalendar;
  if (!Array.isArray(calendar.weeks) || calendar.weeks.length < 52) throw new Error('Incomplete contribution calendar');
  const days = calendar.weeks.flatMap(w => w.contributionDays);
  if (days.some(d => !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isInteger(d.contributionCount) || d.contributionCount < 0)) {
    throw new Error('Invalid contribution day');
  }
  if (days.reduce((sum, d) => sum + d.contributionCount, 0) !== calendar.totalContributions) throw new Error('Calendar total mismatch');
  return {
    login: user.login,
    fetchedAt,
    repositories: repos.map(r => ({ name: r.name, url: r.url, language: r.primaryLanguage?.name ?? null, stars: r.stargazerCount })),
    calendar: { totalContributions: calendar.totalContributions, weeks: calendar.weeks }
  };
}

export function activitySummary(calendar) {
  const days = calendar.weeks.flatMap(w => w.contributionDays);
  return { total: calendar.totalContributions, activeDays: days.filter(d => d.contributionCount > 0).length, peak: Math.max(0, ...days.map(d => d.contributionCount)), from: days[0].date, to: days.at(-1).date };
}
