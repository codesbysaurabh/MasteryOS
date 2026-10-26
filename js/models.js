// models.js - the shape of our data, plus small helper functions.
// Plain objects and functions only (no classes) so it is easy to explain.

// Unique id such as "k3j9x2a1"
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

// Today's LOCAL date as "YYYY-MM-DD" (the "en-CA" locale prints dates in this format)
function today() {
  return new Date().toLocaleDateString("en-CA");
}

// A date offset by some days from today, same format
function dateFromToday(offsetDays) {
  return new Date(Date.now() + offsetDays * 86400000).toLocaleDateString("en-CA");
}

// Whole days between a "YYYY-MM-DD" date and today
function daysSince(dateString) {
  return Math.floor((new Date(today()) - new Date(dateString)) / 86400000);
}

function createTopic(title) {
  return {
    id: makeId(),
    title: title,
    done: false,
    doneOn: null,         // date the topic was ticked
    lastStudied: null,    // date of the last study or revision
    revisionDays: null,   // null means "use the default gap"
    revisionCount: 0,     // how many times it has been revised (used by smart gaps)
    snoozedUntil: null,   // hides the reminder until this date
    note: "",
    sessions: []          // each: { start: ISO string, seconds: number }
  };
}

function createSkill(name, topicTitles) {
  return {
    id: makeId(),
    name: name,
    topics: (topicTitles || []).map(createTopic)
  };
}

function createDefaultData() {
  return {
    settings: { defaultRevisionDays: 7, smartRevision: false, theme: "light", dailyGoalMin: 60 },
    skills: [],
    activeTimer: null     // { skillId, topicId, startedAt } while a timer runs
  };
}

// ---- Derived values: calculated when needed, never stored ----

function topicSeconds(topic) {
  return topic.sessions.reduce((sum, s) => sum + s.seconds, 0);
}

function skillSeconds(skill) {
  return skill.topics.reduce((sum, t) => sum + topicSeconds(t), 0);
}

function skillProgress(skill) {
  if (skill.topics.length === 0) return 0;
  const done = skill.topics.filter((t) => t.done).length;
  return Math.round((done / skill.topics.length) * 100);
}

// 4500 -> "1h 15m", 600 -> "10m", 40 -> "40s"
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return h + "h " + String(m).padStart(2, "0") + "m";
  }
  if (m > 0) {
    return m + "m";
  }
  return seconds + "s";
}
