// storage.js - the ONLY file that talks to localStorage.
// If we later move to a real backend, only this file changes.

const STORAGE_KEY = "masteryos_data";
let data;   // the whole app state lives in this one object

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createDefaultData();
  } catch (error) {
    return createDefaultData();   // corrupted data: start fresh instead of crashing
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function findSkill(skillId) {
  return data.skills.find((s) => s.id === skillId);
}

function findTopic(skillId, topicId) {
  const skill = findSkill(skillId);
  return skill ? skill.topics.find((t) => t.id === topicId) : undefined;
}

// Replace everything with a backup file's content. Returns true if the file looked valid.
function importData(text) {
  try {
    const imported = JSON.parse(text);
    if (!Array.isArray(imported.skills)) {
      return false;
    }
    data = { ...createDefaultData(), ...imported };
    saveData();
    return true;
  } catch (error) {
    return false;
  }
}
