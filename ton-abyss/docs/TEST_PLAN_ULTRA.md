# TON Abyss — ULTRA Expansion Test Plan

**Target**: https://dist-xstumueh.devinapps.com (PR #1 preview, ULTRA build)

## What changed (user-visible)
Old MVP had 6 Home tiles and an **auto-sim** (passive) combat screen. ULTRA expansion adds:
1. **12 Home tiles** including new destinations: Карта (World Map), Навыки (Skill Tree), Гнёзда (Sockets), Задания (Quests), Ачивки (Achievements), Топ (Leaderboard).
2. **Active turn-based combat**: player clicks Атака / ability buttons / предмет / Бегство — replaces auto-sim.
3. Expanded content: 3 acts of world map, skill points/paragon, loot reveal modal, boss cinematics.

## Primary E2E flow (single recording)
Create a Runesmith → verify new Home layout → open 6 new screens briefly → enter dungeon → play ≥2 rounds of **active** combat.

### Assertions (each would visibly differ if broken)

**A1. Home has exactly 12 action tiles (MVP had 6).**
Expected order visible on screen: Карта, Данжи, Инвентарь, Навыки, Гнёзда, Кузня, Питомцы, Задания, Ачивки, Топ, Лавка, Кодекс. Pass if all 12 labels are present.

**A2. World Map screen renders 3 acts.**
Click "Карта" tile → screen must show headings "Акт 1", "Акт 2", "Акт 3" (or the configured Russian names like «Забытые земли», «Врата Преисподней», «Пути Бездны»). Must show ≥10 map nodes total. Fail if screen is blank / "Not found" / only one act.

**A3. Skill Tree screen shows tiered skills.**
Click "Навыки" → must show header with "Очки навыков" counter and ≥4 skills grouped by tier. For runesmith class: at least one recognizable skill name from content/src/skills.ts (e.g. contains "Огн" or "Рун" in Russian). Fail if empty list or crash.

**A4. Sockets screen loads.**
Click "Гнёзда" → must render without error and show a heading containing "Гнёзда" or "Сокеты" or equivalent gem UI. Fail if blank screen / JS crash.

**A5. Quests, Achievements, Leaderboard screens load.**
Click each → each must show a header (e.g. "Задания", "Ачивки", "Топ") and either a list of content or an empty-state message. Fail if app crashes or blank white screen.

**A6. Active combat replaces passive sim.**
Click "Данжи" → pick "Забытый склеп" (level 1–8, 50g entry) → combat screen must:
- Show a player HP bar AND enemy HP bar side-by-side
- Show **clickable ability buttons** (at minimum an "Атака" / basic strike button)
- Show combat log area
- Be interactive: clicking Атака must advance the turn (enemy HP must decrease OR combat log must show a new line). Fail if screen shows auto-scrolling text without buttons (= old passive sim still active).

**A7. Turn progression works.**
From A6 — click Атака 2–3 times in a row. Between clicks, verify that either enemy HP changes OR the combat log adds new entries (tone-colored). Fail if clicks do nothing.

### Out of scope
- Backend / API testing (explicitly deferred in the PR).
- Balance verification (numbers tuning not testable in a smoke test).
- Full dungeon clear (not required — proving combat is *interactive* is enough).
- Regression of crafting / pets / shop (not touched by ULTRA expansion).

## Evidence to capture
- Screenshot of Home with 12 tiles
- Screenshot of World Map with 3 acts
- Screenshot of Skill Tree
- Screenshot of active combat with visible ability buttons
- Recording (~60s) of the full flow
