// timer.js - start/stop the study timer.
// We save the START TIME, not a counter, so refreshing the page never loses time.

function startTimer(skillId, topicId) {
  // only one timer at a time
  if (data.activeTimer) {
    stopTimer();
  }
  data.activeTimer = { skillId: skillId, topicId: topicId, startedAt: Date.now() };
  saveData();
}

function stopTimer() {
  const timer = data.activeTimer;
  if (!timer) {
    return;
  }
  const topic = findTopic(timer.skillId, timer.topicId);
  const seconds = Math.round((Date.now() - timer.startedAt) / 1000);
  if (topic && seconds > 0) {
    topic.sessions.push({ start: new Date(timer.startedAt).toISOString(), seconds: seconds });
    topic.lastStudied = today();
  }
  data.activeTimer = null;
  saveData();
}

// For when the user forgot to start the timer
function addManualTime(topic, minutes) {
  topic.sessions.push({ start: new Date().toISOString(), seconds: Math.round(minutes * 60) });
  topic.lastStudied = today();
}

// Used before deleting: stop tracking a timer that points at something about to disappear
function dropTimerIf(skillId, topicId) {
  const t = data.activeTimer;
  const sameSkill = t && t.skillId === skillId;
  const sameTopic = !topicId || (t && t.topicId === topicId);
  if (sameSkill && sameTopic) {
    data.activeTimer = null;
  }
}

// 125 -> "00:02:05"
function clockText(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return h + ":" + m + ":" + s;
}
