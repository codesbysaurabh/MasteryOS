# MasteryOS

A browser-only skill tracker: add skills, tick off topics, time your study sessions and get reminded when a topic is due for revision. No backend, no build step; data lives in `localStorage`.

## Run it
Double-click `index.html`. That is all.

## Files
| File | Job |
|---|---|
| `index.html` | Page skeleton and script order |
| `style.css` | Look, including dark theme (CSS variables) |
| `images/` | Skill logos (SVG) and the app logo |
| `js/skills-data.js` | Prebuilt skills, their logo file and topics (inspired by roadmap.sh) |
| `js/models.js` | Shape of the data and small helpers (progress, time format, dates) |
| `js/storage.js` | The only file that touches `localStorage`; also backup import |
| `js/timer.js` | Start/stop timer, saves sessions |
| `js/revision.js` | Decides which topics are due |
| `js/stats.js` | Today's time and study streak |
| `js/app.js` | Draws screens and handles clicks |

## How it works in one line
Click, change the `data` object, `saveData()`, then `render()` redraws the page from `data`.

## Data
Everything is one JSON object under the key `masteryos_data`:
`settings`, `skills` (each with `topics`, each with `sessions`) and `activeTimer`.
Total time and progress are calculated, never stored.

## Skill icons
Prebuilt skills use their logo from the `images/` folder (works offline). Logos come from the open-source Devicon set and belong to their respective owners. DSA and SQL have no single official logo, so they use simple drawn icons. Custom skills show a badge with the first letter of their name.

## Revision rule
A topic is due when `days since last studied >= revision gap`. The gap is the topic's own setting, else the default (7 days), or growing gaps (1, 3, 7, 14, 30) when Smart gaps is on.

## Good answers for a viva
- **Why localStorage?** No server needed; about 5 MB of text per site.
- **Limits?** One browser and device only, can be cleared, not secure. Hence the export/import backup.
- **Why save `startedAt` for the timer?** The page may refresh; elapsed time is recomputed from `Date.now()`.
- **How to scale?** Replace `storage.js` with calls to an Express and MongoDB API; the rest stays the same.
- **Why `esc()`?** User text goes into `innerHTML`; escaping stops broken markup and script injection.
- **Reminder limit:** without a server, notifications only fire while the app is open.
