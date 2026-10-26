// stats.js - numbers for the dashboard (today's time and study streak).

// Every session across all skills
function allSessions() {
  const list = [];
  data.skills.forEach((skill) => {
    skill.topics.forEach((topic) => {
      list.push(...topic.sessions);
    });
  });
  return list;
}

// A session's local calendar date, e.g. "2026-10-26"
function sessionDate(session) {
  return new Date(session.start).toLocaleDateString("en-CA");
}

function todaySeconds() {
  return allSessions()
    .filter((s) => sessionDate(s) === today())
    .reduce((sum, s) => sum + s.seconds, 0);
}

// Number of days in a row with at least one session. Today not studied yet? Count from yesterday.
function getStreak() {
  const days = new Set(allSessions().map(sessionDate));
  let streak = 0;
  let offset = days.has(today()) ? 0 : -1;
  while (days.has(dateFromToday(offset))) {
    streak += 1;
    offset -= 1;
  }
  return streak;
}
