# TON Abyss — Test Plan (PR #1)

**Build under test:** https://dist-xstumueh.devinapps.com (frontend preview, offline/demo mode — state persisted in `localStorage`).

**Primary goal:** prove that a fresh player can go splash → create character → fight a dungeon → receive loot → see it reflected across screens. If any of those steps is broken, the game is unplayable.

All assertions reference Russian UI strings because the game's UI is in Russian.

---

## T1 — Cold-start splash screen (adversarial vs. broken routing/assets)
**Steps**
1. Open a fresh tab at https://dist-xstumueh.devinapps.com. Before loading, clear `localStorage` to simulate a brand-new player.
2. Reload.

**Assertions (must ALL be true)**
- Page title in the tab is exactly `TON Abyss`.
- Animated title `TON ABYSS` is visible (font-display, wide tracking).
- Subtitle exactly `Хардкорный roguelite-RPG` is visible.
- Exactly one primary button with the label `Начать спуск` is visible (not `Продолжить` — that only shows if a save exists).
- No console errors about missing fonts, TonConnect manifest, or React hydration.

**Why this is adversarial:** if Vite bundling/paths broke, the root would be blank or show "Не найдено". If the zustand persist fires before hydration, the button would say "Продолжить" even on a fresh profile.

---

## T2 — Class selection renders all 4 classes and gates the CTA
**Steps**
1. From Splash click `Начать спуск`.
2. Do NOT select a class yet — observe the CTA.
3. Select `Руновед`.
4. Inspect the class card visuals.

**Assertions**
- Header reads `Выбор класса`.
- Exactly 4 class cards are rendered, with these exact Russian names:
  - `Страж`
  - `Руновед`
  - `Зовущий Бездну`
  - `Связанный Зверь`
- The `Войти в Бездну` button is visually disabled (opacity reduced / not clickable) before any class is picked.
- After picking `Руновед`, the card has a visible blue ring (`ring-2 ring-abyss-500`) and the CTA becomes enabled.
- The hardcore checkbox is checked by default (`Хардкорный режим`).

**Why this is adversarial:** any accidental default pick would enable the CTA without a selection. Missing localization would show class IDs instead of Russian names.

---

## T3 — Create character: starting state is exactly the values promised by the GDD
**Steps**
1. With `Руновед` selected and hardcore on, click `Войти в Бездну`.
2. Arrive at Home screen.

**Assertions (all concrete numbers)**
- Top bar shows: class name `Руновед`, `ур. 1`, and a red `Хардкор` chip.
- Gold pill shows `50` (matches `ECONOMY.START_GOLD = 50` in `packages/shared/src/economy.ts`).
- Shards pill shows `0`, Dust pill shows `0`.
- HP bar text reads `X / X` where both numbers are equal (full HP on spawn) and X ≥ 80 (baseline VIT-derived maxHp for Runesmith).
- MP bar text shows full MP (both numbers equal).
- Six primary stats are displayed with labels `Сила`, `Ловкость`, `Интеллект`, `Выносливость`, `Дух`, `Удача` — each with a `+` button that is currently disabled (unspentPoints = 0 at level 1).
- Six action tiles are visible in exactly this order: `Данжи`, `Инвентарь`, `Кузня`, `Питомцы`, `Лавка`, `Кодекс`.
- TonConnect button `Connect Wallet` (or localized equivalent) is visible at the bottom.

**Why this is adversarial:** a regression in `createCharacter` (wrong starting gold, missing hardcore flag propagation, broken derived-stats pipeline) would show different numbers here. A broken Framer Motion layout would cause the tiles grid to collapse.

---

## T4 — Inventory paper doll reflects starter kit
**Steps**
1. From Home click the `Инвентарь` tile.
2. Observe the paper doll block and the item grid below.

**Assertions**
- Equipment grid has 10 slots. The following slots MUST be non-empty with correct names:
  - `weapon` → `Новичковый посох` (runesmith starter).
  - `chest` → `Кожаная куртка`.
  - `head` → `Кожаная шапка`.
  - `legs` → `Кожаные штаны`.
  - `hands` → `Кожаные перчатки`.
  - `feet` → `Кожаные сапоги`.
- `offhand`, `ring`, `amulet`, `relic` slots are visibly empty (placeholder icons at reduced opacity).
- Below the paper doll, the main inventory grid shows at least `Малое зелье HP` (starter consumable).
- Filter chips show `Всё / Снаряж. / Расх. / Ресурсы`.

**Why this is adversarial:** a broken `starterKit` class branch (e.g., non-exhaustive switch) would leave equipped slots empty for Runesmith. A broken lookup to `ITEMS[]` would show raw IDs.

---

## T5 — Complete a dungeon run and receive loot (the core loop)
**Steps**
1. From Home click `Данжи`.
2. Confirm 4 dungeons are listed. The first one should have `Заброшенный склеп` and display its level range.
3. Click `Войти` on the first dungeon.
4. Watch the auto-scrolling combat log.
5. When `Забрать добычу` appears at the bottom, click it.
6. Back on Home, open `Инвентарь` and count items.

**Assertions**
- Dungeon list has exactly 4 entries, including visible names `Заброшенный склеп`, `Ледяные пещеры` (or localized variant), `Глубины Преисподней`, `Врата Бездны`.
- Combat log renders at least one `⟪ Комната 1: ... ⟫` narration line.
- Log lines use colored classes (green-ish for player hits, red-ish for enemy hits) — visible via CSS classes `text-emerald-300` / `text-red-300`.
- After `Забрать добычу`, a toast appears containing `Победа! +<X> XP, +<Y> золота, дропа: <Z>.` (at least one of Y/Z must be > 0 — if both zero on a victory, the loot pipeline is broken).
- Top bar gold value is **strictly greater** than 50 after a victorious run (or strictly less than 50 if the entry cost > reward, which is allowed only on T1+ dungeons without entry cost — the first dungeon has `entryCost.gold = 0`, so gold MUST increase).
- Inventory count after: **strictly greater** than the 7 starter items (at least 1 new item added, since enemy loot tables include guaranteed material/item rolls).

**Why this is adversarial:** if the combat sim were broken (player always dies, or enemy HP = 0 instantly), this step would either skip to death-toast or award no loot. If `rollLootTable` regressed, the inventory count would not change. If zustand `set` mutated state incorrectly, the top bar gold would not update without a page reload.

---

## T6 — Crafting screen shows 3 tabs and gated state correctly
**Steps**
1. From Home click `Кузня`.
2. Verify the 3 tabs and inspect the default tab.
3. Click `Усиление` tab.

**Assertions**
- Three tabs with exact labels `Крафт`, `Усиление`, `Распыление`.
- On `Крафт` tab, at least 6 recipe cards are listed (from `RECIPES` in content package). Each card has a `Создать` button.
- For recipe `r_iron_sword`, the material chips `mat_iron` and `mat_leather` are visible with green `have/need` pattern (starter kit gives 2 iron + 3 leather; need 6 iron → chip is red "2/6").
- `Создать` button on `r_iron_sword` is disabled because iron is insufficient.
- Switching to `Усиление` shows an item picker grid containing at least the starter weapon (`Новичковый посох`).

**Why this is adversarial:** a broken `canCraft` would either enable the button (allowing free items — economy exploit) or crash the render with undefined material lookup.

---

## T7 — Codex confirms content volume claimed in PR
**Steps**
1. From Home click `Кодекс`.

**Assertions** (counts come from `packages/content/src/*.ts` and must match)
- Section title `Данжи · 4` — list contains exactly 4 dungeons.
- Section title `Боссы · 4` — list contains 4 bosses, including `Титан Бездны`.
- Section title `Монстры · ≥10` — list contains at least 10 monsters.
- Section title `Питомцы · 5` — 5 pets listed.
- Section title `Рецепты · 6` — 6 recipes.
- Section `Предметы · 50+` — first 50 items listed; if total > 50, line `...и ещё N` is visible.

**Why this is adversarial:** this is the fast way to refute a claim like "50+ items" or "4 bosses" — if content files were truncated by a bad build or `export *` was missed, the counts would be wrong.

---

## T8 — Regression: persistence survives a hard reload
**Steps**
1. After T5 (dungeon run complete), note current gold.
2. Hard-reload the page (Ctrl+R).

**Assertions**
- App loads directly to Home (not Splash), because zustand-persist hydrated the character.
- Top bar class/level unchanged.
- Gold equals the value noted before reload.

**Why this is adversarial:** a broken `partialize` in `store.ts` would wipe state on reload, or route to Splash instead of Home.

---

## Out of scope (explicitly not tested in this PR)
- Backend `apps/api` runtime (not deployed; covered by local `pnpm -r typecheck` passing).
- TonConnect actual wallet handshake (requires a live wallet app — only the button rendering is checked in T3).
- Full balance curve from level 1 → 100 (long-run).
- Upgrade `+15` stochastic path — only the Crafting UI surface is tested in T6 to avoid hours of grind.

## Evidence
All steps will be captured in a single browser recording with structured annotations (setup / test_start / assertion).
