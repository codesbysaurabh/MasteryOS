// revision.js - decides which topics need revising.
// Rule: a topic is DUE when (days since last studied) >= (its revision gap).

// Optional "smart" mode: the gap grows each time you revise (a simple spaced repetition)
const SMART_GAPS = [1, 3, 7, 14, 30];

function revisionGap(topic) {
  // 1. the user set a gap for this topic
  if (topic.revisionDays) {
    return topic.revisionDays;
  }
  // 2. smart mode: the gap grows with each revision
  if (data.settings.smartRevision) {
    const step = Math.min(topic.revisionCount, SMART_GAPS.length - 1);
    return SMART_GAPS[step];
  }
  // 3. the default from settings
  return data.settings.defaultRevisionDays;
}

function isDueForRevision(topic) {
  if (!topic.lastStudied) {
    return false;
  }
  // ISO dates ("2026-10-26") can be compared as plain text
  if (topic.snoozedUntil && topic.snoozedUntil > today()) {
    return false;
  }
  return daysSince(topic.lastStudied) >= revisionGap(topic);
}

// All due topics across all skills, most overdue first
function getDueTopics() {
  const due = [];
  data.skills.forEach((skill) => {
    skill.topics.forEach((topic) => {
      if (isDueForRevision(topic)) {
        const overdue = daysSince(topic.lastStudied) - revisionGap(topic);
        due.push({ skill: skill, topic: topic, overdue: overdue });
      }
    });
  });
  return due.sort((a, b) => b.overdue - a.overdue);
}

function markRevised(topic) {
  topic.lastStudied = today();
  topic.revisionCount += 1;
  topic.snoozedUntil = null;
}

function snoozeTopic(topic) {
  topic.snoozedUntil = dateFromToday(1);
}
