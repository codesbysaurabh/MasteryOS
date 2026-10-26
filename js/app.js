// app.js - draws the screens and reacts to clicks.
// Flow for every action:  click -> change `data` -> saveData() -> render()

const app = document.getElementById("app");
const dlg = document.getElementById("dlg");
let view = { page: "dashboard", skillId: null, filter: "all" };

// Escape user text before putting it inside HTML (prevents broken markup and injection)
function esc(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}

// Skill icon: the logo image from the images/ folder if the skill is a prebuilt one,
// otherwise (custom skills) a badge with the first letter of the name.
// The letter also sits behind the image, so it shows if the image fails to load.
function iconHtml(skill) {
  const letter = esc(skill.name.charAt(0).toUpperCase());
  const preset = PREBUILT_SKILLS[skill.name];
  if (!preset) {
    return `<span class="icon">${letter}</span>`;
  }
  return `<span class="icon">${letter}<img src="${preset.logo}" alt="" onerror="this.remove()"></span>`;
}

function change() {   // save, then redraw
  saveData();
  render();
}

// ---------- Drawing ----------

function render() {
  document.documentElement.dataset.theme = data.settings.theme;
  const skill = findSkill(view.skillId);
  app.innerHTML = view.page === "skill" && skill ? skillPage(skill) : dashboardPage();
  renderTimerBar();
}

function dashboardPage() {
  const due = getDueTopics();
  const cards = data.skills.map(skillCard).join("");
  const emptyMessage = '<p class="empty">No skills yet. Choose "Add skill" to pick a prebuilt one or make your own.</p>';
  return `
    <section class="stats">
      <div><strong>${formatTime(todaySeconds())}</strong>studied today (goal: ${data.settings.dailyGoalMin} min)</div>
      <div><strong>${getStreak()}</strong>day streak</div>
      <div><strong>${due.length}</strong>topics due for revision</div>
    </section>
    ${dueSection(due)}
    <h2>Your skills</h2>
    <div class="grid">${cards || emptyMessage}</div>`;
}

function skillCard(skill) {
  return `
    <div class="card" data-action="open" data-skill="${skill.id}">
      <h3>${iconHtml(skill)} ${esc(skill.name)}</h3>
      <div class="bar"><i style="width:${skillProgress(skill)}%"></i></div>
      <div class="muted">${skillProgress(skill)}% done, ${formatTime(skillSeconds(skill))} studied</div>
    </div>`;
}

function dueSection(due) {
  if (due.length === 0) return "";
  const items = due
    .map((d) => {
      const ids = `data-skill="${d.skill.id}" data-topic="${d.topic.id}"`;
      const status = d.overdue === 0 ? "due today" : d.overdue + " day(s) overdue";
      return `
        <li>
          <span>
            <b>${esc(d.topic.title)}</b>
            <span class="muted">in ${esc(d.skill.name)}, ${status}</span>
          </span>
          <button data-action="revised" ${ids}>Revised</button>
          <button class="ghost" data-action="snooze" ${ids}>Remind me tomorrow</button>
        </li>`;
    })
    .join("");
  return `<section class="due"><h2>Time to revise</h2><ul>${items}</ul></section>`;
}

function skillPage(skill) {
  const shown = skill.topics.filter(passesFilter);
  const rows = shown.map((t) => topicRow(skill, t)).join("");
  const filterChoices = [
    ["all", "All topics"],
    ["pending", "Pending"],
    ["done", "Done"],
    ["due", "Due for revision"]
  ];
  const options = filterChoices
    .map(([value, label]) => {
      const selected = view.filter === value ? "selected" : "";
      return `<option value="${value}" ${selected}>${label}</option>`;
    })
    .join("");
  return `
    <button class="ghost" data-action="home">Back to skills</button>
    <h2>${iconHtml(skill)} ${esc(skill.name)}</h2>
    <div class="bar"><i style="width:${skillProgress(skill)}%"></i></div>
    <p class="muted">${skillProgress(skill)}% done, ${formatTime(skillSeconds(skill))} studied in total</p>
    <div class="toolbar">
      <form data-form="addTopic"><input name="title" placeholder="New topic" required><button>Add topic</button></form>
      <select id="filter" aria-label="Filter topics">${options}</select>
      <button class="danger" data-action="deleteSkill" data-skill="${skill.id}">Delete skill</button>
    </div>
    <ul>${rows || '<li class="empty">No topics match this filter.</li>'}</ul>`;
}

function topicRow(skill, t) {
  const running = data.activeTimer && data.activeTimer.topicId === t.id;
  const ids = `data-skill="${skill.id}" data-topic="${t.id}"`;
  const last = t.lastStudied ? "last studied " + t.lastStudied : "not studied yet";
  const timerButton = running
    ? `<button data-action="stop">Stop timer</button>`
    : `<button data-action="start" ${ids}>Start timer</button>`;
  return `
    <li class="topic ${t.done ? "done" : ""}">
      <input type="checkbox" aria-label="Mark done" data-action="toggle" ${ids} ${t.done ? "checked" : ""}>
      <div>
        <span class="name">${esc(t.title)}</span>
        ${isDueForRevision(t) ? '<span class="badge">Due for revision</span>' : ""}
        <div class="muted">${formatTime(topicSeconds(t))} studied, ${last}</div>
        ${t.note ? `<div class="muted">Note: ${esc(t.note)}</div>` : ""}
      </div>
      <div class="actions">
        ${timerButton}
        <button class="ghost" data-action="addTime" ${ids}>Add time</button>
        <button class="ghost" data-action="note" ${ids}>Note</button>
        <button class="ghost" data-action="gap" ${ids}>Revision gap</button>
        <button class="danger" data-action="deleteTopic" ${ids}>Delete</button>
      </div>
    </li>`;
}

function passesFilter(t) {
  if (view.filter === "pending") return !t.done;
  if (view.filter === "done") return t.done;
  if (view.filter === "due") return isDueForRevision(t);
  return true;
}

// ---------- Timer bar at the bottom ----------

function renderTimerBar() {
  const bar = document.getElementById("timerbar");
  const timer = data.activeTimer;
  const topic = timer ? findTopic(timer.skillId, timer.topicId) : null;
  if (!topic) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  bar.innerHTML = `
    <span>Studying <b>${esc(topic.title)}</b></span>
    <span id="clock"></span>
    <button data-action="stop">Stop and save</button>`;
  tick();
}

function tick() {   // runs every second, only updates the clock text
  const clock = document.getElementById("clock");
  if (clock && data.activeTimer) {
    const elapsed = Math.floor((Date.now() - data.activeTimer.startedAt) / 1000);
    clock.textContent = clockText(elapsed);
  }
}

// ---------- Popups ----------

function openDialog(html) {
  dlg.innerHTML = html;
  dlg.showModal();
}

function addSkillHtml() {
  const have = data.skills.map((s) => s.name);
  const chips = Object.keys(PREBUILT_SKILLS)
    .filter((name) => !have.includes(name))
    .map((name) => {
      return `<button data-action="addPrebuilt" data-name="${name}">${iconHtml({ name: name })} ${name}</button>`;
    })
    .join("");
  return `
    <h2>Add a skill</h2>
    <h3>Prebuilt skills</h3>
    <div class="chips">${chips || '<span class="muted">You have added all prebuilt skills.</span>'}</div>
    <h3>Create your own</h3>
    <form data-form="customSkill">
      <input name="name" placeholder="Skill name" required>
      <button>Create skill</button>
    </form>
    <div class="row"><button class="ghost" data-action="closeDialog">Close</button></div>`;
}

function settingsHtml() {
  const s = data.settings;
  return `
    <h2>Settings</h2>
    <form data-form="settings">
      <label>Default revision gap (days) <input type="number" name="days" min="1" max="365" value="${s.defaultRevisionDays}"></label>
      <label>Daily goal (minutes) <input type="number" name="goal" min="5" max="1000" value="${s.dailyGoalMin}"></label>
      <label><input type="checkbox" name="smart" ${s.smartRevision ? "checked" : ""}> Smart gaps (1, 3, 7, 14, 30 days)</label>
      <button>Save settings</button>
    </form>
    <div class="row">
      <button class="ghost" data-action="toggleTheme">Switch to ${s.theme === "dark" ? "light" : "dark"} theme</button>
      <button class="ghost" data-action="enableNotifications">Enable notifications</button>
    </div>
    <h3>Backup</h3>
    <div class="row">
      <button class="ghost" data-action="exportData">Export data</button>
      <label class="ghost"><input type="file" id="importFile" accept=".json"></label>
      <button class="danger" data-action="resetData">Delete all data</button>
    </div>
    <div class="row"><button class="ghost" data-action="closeDialog">Close</button></div>`;
}

// ---------- Actions: one small function per button ----------

const actions = {
  home() {
    view = { page: "dashboard", skillId: null, filter: "all" };
    render();
  },

  open(skillId) {
    view = { page: "skill", skillId: skillId, filter: "all" };
    render();
  },

  toggle(skillId, topicId) {
    const t = findTopic(skillId, topicId);
    t.done = !t.done;
    t.doneOn = t.done ? today() : null;
    if (t.done) {
      // finishing a topic starts its revision clock
      t.lastStudied = today();
      t.snoozedUntil = null;
    }
    change();
  },

  start(skillId, topicId) {
    startTimer(skillId, topicId);
    render();
  },

  stop() {
    stopTimer();
    render();
  },

  addTime(skillId, topicId) {
    const minutes = Number(prompt("How many minutes did you study?"));
    if (minutes > 0) {
      addManualTime(findTopic(skillId, topicId), minutes);
      change();
    }
  },

  note(skillId, topicId) {
    const t = findTopic(skillId, topicId);
    const text = prompt("Note for this topic:", t.note);
    if (text !== null) {
      t.note = text.trim();
      change();
    }
  },

  gap(skillId, topicId) {
    const t = findTopic(skillId, topicId);
    const question = "Remind me to revise after how many days? Leave empty to use the default.";
    const text = prompt(question, t.revisionDays || "");
    if (text === null) return;
    t.revisionDays = Number(text) > 0 ? Math.round(Number(text)) : null;
    change();
  },

  deleteTopic(skillId, topicId) {
    if (!confirm("Delete this topic and its study time?")) return;
    dropTimerIf(skillId, topicId);
    const skill = findSkill(skillId);
    skill.topics = skill.topics.filter((t) => t.id !== topicId);
    change();
  },
  deleteSkill(skillId) {
    if (!confirm("Delete this skill with all its topics and study time?")) return;
    dropTimerIf(skillId);
    data.skills = data.skills.filter((s) => s.id !== skillId);
    view.page = "dashboard";
    change();
  },

  revised(skillId, topicId) {
    markRevised(findTopic(skillId, topicId));
    change();
  },

  snooze(skillId, topicId) {
    snoozeTopic(findTopic(skillId, topicId));
    change();
  },

  addSkillDialog() {
    openDialog(addSkillHtml());
  },

  addPrebuilt(a, b, button) {
    const preset = PREBUILT_SKILLS[button.dataset.name];
    data.skills.push(createSkill(button.dataset.name, preset.topics));
    dlg.close();
    change();
  },
  closeDialog() {
    dlg.close();
  },

  settingsDialog() {
    openDialog(settingsHtml());
  },

  toggleTheme() {
    data.settings.theme = data.settings.theme === "dark" ? "light" : "dark";
    saveData();
    render();
    openDialog(settingsHtml());
  },
  enableNotifications() {
    if ("Notification" in window) Notification.requestPermission();
    else alert("This browser does not support notifications.");
  },
  exportData() {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "masteryos-backup.json";
    link.click();
  },
  resetData() {
    if (!confirm("Delete ALL skills, topics and study time? This cannot be undone.")) return;
    data = createDefaultData();
    dlg.close();
    change();
  }
};

// ---------- Events: three listeners handle the whole app ----------

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const run = actions[el.dataset.action];
  if (run) run(el.dataset.skill, el.dataset.topic, el);
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);

  if (form.dataset.form === "addTopic") {
    findSkill(view.skillId).topics.push(createTopic(values.get("title").trim()));
    change();
  }
  if (form.dataset.form === "customSkill") {
    data.skills.push(createSkill(values.get("name").trim(), []));
    dlg.close();
    change();
  }
  if (form.dataset.form === "settings") {
    data.settings.defaultRevisionDays = Number(values.get("days")) || 7;
    data.settings.dailyGoalMin = Number(values.get("goal")) || 60;
    data.settings.smartRevision = values.get("smart") === "on";
    dlg.close();
    change();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "filter") {
    view.filter = event.target.value;
    render();
  }
  if (event.target.id === "importFile" && event.target.files[0]) {
    event.target.files[0].text().then((text) => {
      if (importData(text)) {
        dlg.close();
        render();
      } else {
        alert("That file is not a valid MasteryOS backup.");
      }
    });
  }
});

// ---------- Start ----------

function notifyDue() {   // browsers can only notify while the app is open
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const count = getDueTopics().length;
  if (count > 0) {
    new Notification("MasteryOS", { body: count + " topic(s) due for revision" });
  }
}

data = loadData();
render();
notifyDue();
setInterval(tick, 1000);
