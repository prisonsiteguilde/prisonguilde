import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Character,
  ClassId,
  ItemInstance,
  PetInstance,
} from "@ton-abyss/shared";
import {
  derivedFromPrimary,
  ECONOMY,
  primaryStatsFor,
  POINTS_PER_LEVEL,
  RNG,
  seedFrom,
  applyGear,
  xpForLevel,
  levelFromTotalXp,
  createItemInstance,
  rollLootTable,
  DIFFICULTY_CURVE,
  canCraft,
  craft,
  upgradeItem,
  UPGRADE_TABLE,
  SALVAGE_YIELD,
} from "@ton-abyss/shared";
import { ITEMS, LOOT_TABLES, MONSTERS, BOSSES, RECIPES, DUNGEONS } from "@ton-abyss/content";

export type Screen =
  | "splash"
  | "class_select"
  | "home"
  | "inventory"
  | "equipment"
  | "dungeon_list"
  | "dungeon_run"
  | "crafting"
  | "pets"
  | "shop"
  | "codex";

export interface Toast {
  id: string;
  text: string;
  tone?: "info" | "good" | "bad" | "epic";
}

export interface GameState {
  screen: Screen;
  character: Character | null;
  inventory: ItemInstance[];
  equipped: Record<string, string | null>;
  materials: Record<string, number>;
  pets: PetInstance[];
  activePetUid: string | null;
  toasts: Toast[];
  lastDungeonLog: import("@ton-abyss/shared").CombatEvent[];
  // actions
  setScreen: (s: Screen) => void;
  createCharacter: (classId: ClassId, hardcore: boolean) => void;
  allocatePoint: (stat: keyof Character["stats"]) => void;
  equipItem: (uid: string) => void;
  unequip: (slot: string) => void;
  runDungeon: (dungeonId: string) => void;
  craftRecipe: (recipeId: string) => { ok: boolean; error?: string };
  upgrade: (uid: string) => { result: "success" | "fail" | "destroy" };
  salvage: (uids: string[]) => { materials: number; dust: number; shards: number };
  sell: (uids: string[]) => number;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  reset: () => void;
}

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

function starterKit(classId: ClassId): { inv: ItemInstance[]; equipped: Record<string, string | null>; mats: Record<string, number> } {
  const mk = (baseId: string): ItemInstance => ({
    uid: genId("it"),
    baseId,
    rarity: "common",
    level: 1,
    affixes: [],
    upgradeLevel: 0,
    createdAt: Date.now(),
  });
  const weapon =
    classId === "runesmith" || classId === "voidcaller"
      ? mk("wpn_novice_staff")
      : classId === "beastbound"
        ? mk("wpn_beast_claws")
        : mk("wpn_rusty_shortsword");
  const chest = mk("arm_leather_vest");
  const head = mk("arm_leather_cap");
  const legs = mk("arm_leather_legs");
  const hands = mk("arm_leather_gloves");
  const feet = mk("arm_leather_boots");
  const potion = mk("con_minor_hp_potion");
  const offhand = classId === "warden" ? mk("off_wooden_shield") : null;
  const inv: ItemInstance[] = [weapon, chest, head, legs, hands, feet, potion];
  if (offhand) inv.push(offhand);
  const equipped: Record<string, string | null> = {
    weapon: weapon.uid,
    chest: chest.uid,
    head: head.uid,
    legs: legs.uid,
    hands: hands.uid,
    feet: feet.uid,
    offhand: offhand?.uid ?? null,
    ring: null,
    amulet: null,
    relic: null,
  };
  const mats: Record<string, number> = { mat_linen: 3, mat_leather: 3, mat_iron: 2 };
  return { inv, equipped, mats };
}

function buildDerived(character: Character, inventory: ItemInstance[], equipped: Record<string, string | null>) {
  const primary = primaryStatsFor(character.classId, character.level, {});
  Object.assign(primary, character.stats);
  const base = derivedFromPrimary(character.classId, primary);
  const gear = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  return applyGear(base, gear, (id) => ITEMS[id]);
}

function applyLevelUps(character: Character): Character {
  const info = levelFromTotalXp(character.xp + xpTotalUpTo(character.level));
  if (info.level > character.level) {
    const gained = info.level - character.level;
    return {
      ...character,
      level: info.level,
      unspentPoints: character.unspentPoints + gained * POINTS_PER_LEVEL,
    };
  }
  return character;
}

function xpTotalUpTo(level: number): number {
  let s = 0;
  for (let l = 1; l < level; l++) s += xpForLevel(l);
  return s;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "splash",
      character: null,
      inventory: [],
      equipped: {},
      materials: {},
      pets: [],
      activePetUid: null,
      toasts: [],
      lastDungeonLog: [],

      setScreen: (screen) => set({ screen }),

      createCharacter: (classId, hardcore) => {
        const primary = primaryStatsFor(classId, 1, {});
        const derived = derivedFromPrimary(classId, primary);
        const char: Character = {
          id: genId("c"),
          classId,
          level: 1,
          xp: 0,
          stats: primary,
          unspentPoints: 0,
          hpCurrent: derived.maxHp,
          manaCurrent: derived.maxMana,
          gold: ECONOMY.START_GOLD,
          shards: ECONOMY.START_SHARDS,
          abyssDust: ECONOMY.START_ABYSS_DUST,
          deaths: 0,
          deepestFloor: 0,
          createdAt: Date.now(),
          hardcoreMode: hardcore,
        };
        const starter = starterKit(classId);
        set({
          character: char,
          inventory: starter.inv,
          equipped: starter.equipped,
          materials: starter.mats,
          pets: [],
          screen: "home",
        });
      },

      allocatePoint: (stat) =>
        set((s) => {
          if (!s.character || s.character.unspentPoints <= 0) return s;
          const next = { ...s.character, stats: { ...s.character.stats, [stat]: s.character.stats[stat] + 1 }, unspentPoints: s.character.unspentPoints - 1 };
          return { character: next };
        }),

      equipItem: (uid) =>
        set((s) => {
          const it = s.inventory.find((i) => i.uid === uid);
          if (!it) return s;
          const base = ITEMS[it.baseId];
          if (!base) return s;
          const slot = base.slot;
          return { equipped: { ...s.equipped, [slot]: uid } };
        }),
      unequip: (slot) =>
        set((s) => ({ equipped: { ...s.equipped, [slot]: null } })),

      runDungeon: (dungeonId) => {
        const s = get();
        if (!s.character) return;
        const dungeon = DUNGEONS[dungeonId];
        if (!dungeon) return;
        if ((dungeon.entryCost?.gold ?? 0) > s.character.gold) {
          s.pushToast({ text: "Недостаточно золота для входа.", tone: "bad" });
          return;
        }
        const rng = new RNG(seedFrom(s.character.id, dungeon.id, Date.now()));
        const diffRow = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
        const derived = buildDerived(s.character, s.inventory, s.equipped);
        let hp = derived.maxHp;
        const mana = derived.maxMana;
        const log: import("@ton-abyss/shared").CombatEvent[] = [];
        const loot: ItemInstance[] = [];
        const mats: Record<string, number> = {};
        let xp = 0;
        let gold = -(dungeon.entryCost?.gold ?? 0);
        let died = false;
        for (let i = 0; i < dungeon.rooms; i++) {
          const isLast = i === dungeon.rooms - 1;
          const enemyId = isLast ? dungeon.bossId : rng.pick(dungeon.monsterPool);
          const enemy = isLast ? BOSSES[enemyId] : MONSTERS[enemyId];
          if (!enemy) continue;
          log.push({ turn: 0, actor: "narration", flavor: `Комната ${i + 1}: ${enemy.name}` });
          // Simplified combat: simulate turns until one side drops to 0 HP.
          const encounter = simulateClientFight(derived, hp, mana, enemy, diffRow, rng, log);
          hp = encounter.playerHp;
          if (encounter.playerDied) {
            died = true;
            break;
          }
          // Loot
          const table = LOOT_TABLES[enemy.lootTable];
          if (table) {
            const rolls = rollLootTable(rng, table, {
              level: s.character.level,
              magicFindPct: s.character.stats.luck * 3,
              luck: s.character.stats.luck,
              lootQuantityMult: diffRow.loot,
              lootQualityMult: diffRow.quality,
            });
            for (const roll of rolls) {
              if (roll.kind === "gold" && roll.amount) {
                gold += rng.int(roll.amount[0], roll.amount[1]);
              } else if (roll.kind === "material" && roll.baseId && roll.amount) {
                const qty = rng.int(roll.amount[0], roll.amount[1]);
                mats[roll.baseId] = (mats[roll.baseId] ?? 0) + qty;
              } else if (roll.kind === "item" && roll.baseId) {
                const base = ITEMS[roll.baseId];
                if (!base) continue;
                const it = createItemInstance(rng, base, {
                  level: s.character.level,
                  magicFindPct: s.character.stats.luck * 3,
                  rarityOverride: roll.rarityOverride,
                });
                loot.push(it);
              }
            }
          }
          xp += Math.round(enemy.xp * (diffRow.quality * 0.8 + 0.6));
          gold += rng.int(enemy.gold[0], enemy.gold[1]);
        }
        // apply results
        let char = { ...s.character };
        if (!died) {
          char.xp += xp;
          char.gold += gold;
          char.hpCurrent = hp;
          char.manaCurrent = mana;
          char.deepestFloor = Math.max(char.deepestFloor, dungeon.difficulty);
          char = applyLevelUps(char);
          for (const it of loot) s.inventory.push(it);
          const materials = { ...s.materials };
          for (const [k, v] of Object.entries(mats)) materials[k] = (materials[k] ?? 0) + v;
          set({
            character: char,
            inventory: [...s.inventory],
            materials,
            lastDungeonLog: log,
          });
          s.pushToast({ text: `Победа! +${xp} XP, +${gold} золота, дропа: ${loot.length}.`, tone: "epic" });
        } else {
          char.deaths += 1;
          char.gold = Math.max(0, Math.floor(char.gold * 0.75));
          char.hpCurrent = Math.max(1, Math.floor(char.hpCurrent * 0.5));
          set({ character: char, lastDungeonLog: log });
          s.pushToast({ text: "Вы погибли. Потери: 25% золота и XP. Хардкор не прощает.", tone: "bad" });
        }
      },

      craftRecipe: (recipeId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no character" };
        const recipe = RECIPES[recipeId];
        if (!recipe) return { ok: false, error: "no recipe" };
        if (!canCraft(recipe, s.materials, s.character.gold)) {
          s.pushToast({ text: "Недостаточно ресурсов.", tone: "bad" });
          return { ok: false, error: "insufficient" };
        }
        const base = ITEMS[recipe.outputBaseId];
        if (!base) return { ok: false, error: "bad base" };
        const rng = new RNG(seedFrom(s.character.id, recipe.id, Date.now()));
        const item = craft(recipe, rng, base, { magicFindPct: s.character.stats.luck * 3 });
        const mats = { ...s.materials };
        for (const inp of recipe.inputs) mats[inp.baseId] = (mats[inp.baseId] ?? 0) - inp.qty;
        set({
          character: { ...s.character, gold: s.character.gold - recipe.goldCost },
          materials: mats,
          inventory: [...s.inventory, item],
        });
        s.pushToast({ text: `Создано: ${base.name} (${item.rarity})`, tone: item.rarity === "legendary" || item.rarity === "mythic" || item.rarity === "abyssal" ? "epic" : "good" });
        return { ok: true };
      },

      upgrade: (uid) => {
        const s = get();
        if (!s.character) return { result: "fail" };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx === -1) return { result: "fail" };
        const item = s.inventory[idx]!;
        if (item.upgradeLevel >= 15) {
          s.pushToast({ text: "Максимальный уровень усиления.", tone: "bad" });
          return { result: "fail" };
        }
        const row = UPGRADE_TABLE[item.upgradeLevel]!;
        if (s.character.gold < row.goldCost || s.character.abyssDust < row.dustCost) {
          s.pushToast({ text: "Недостаточно золота или пыли Бездны.", tone: "bad" });
          return { result: "fail" };
        }
        const rng = new RNG(seedFrom(s.character.id, item.uid, Date.now()));
        const res = upgradeItem(rng, item);
        const inv = [...s.inventory];
        if (res.result === "destroy") {
          inv.splice(idx, 1);
          s.pushToast({ text: "Предмет разрушен при усилении!", tone: "bad" });
        } else if (res.item) {
          inv[idx] = res.item;
          if (res.result === "success") s.pushToast({ text: `Усиление успешно (+${res.item.upgradeLevel}).`, tone: "good" });
          else s.pushToast({ text: "Усиление не удалось.", tone: "info" });
        }
        set({
          character: { ...s.character, gold: s.character.gold - row.goldCost, abyssDust: s.character.abyssDust - row.dustCost },
          inventory: inv,
        });
        return { result: res.result };
      },

      salvage: (uids) => {
        const s = get();
        if (!s.character) return { materials: 0, dust: 0, shards: 0 };
        let mats = 0;
        let dust = 0;
        let shards = 0;
        const inv = [...s.inventory];
        const equippedSet = new Set(Object.values(s.equipped).filter(Boolean) as string[]);
        for (const uid of uids) {
          if (equippedSet.has(uid)) continue;
          const idx = inv.findIndex((i) => i.uid === uid);
          if (idx === -1) continue;
          const it = inv[idx]!;
          const y = SALVAGE_YIELD[it.rarity];
          mats += y.materials;
          dust += y.dust;
          shards += y.shards;
          inv.splice(idx, 1);
        }
        const materials = { ...s.materials, mat_iron: (s.materials["mat_iron"] ?? 0) + mats };
        set({
          inventory: inv,
          materials,
          character: { ...s.character, abyssDust: s.character.abyssDust + dust, shards: s.character.shards + shards },
        });
        s.pushToast({ text: `Распылено: +${mats} железа, +${dust} пыли, +${shards} шардов.`, tone: "good" });
        return { materials: mats, dust, shards };
      },

      sell: (uids) => {
        const s = get();
        if (!s.character) return 0;
        let gold = 0;
        const inv = [...s.inventory];
        const equippedSet = new Set(Object.values(s.equipped).filter(Boolean) as string[]);
        for (const uid of uids) {
          if (equippedSet.has(uid)) continue;
          const idx = inv.findIndex((i) => i.uid === uid);
          if (idx === -1) continue;
          const it = inv[idx]!;
          const base = ITEMS[it.baseId];
          if (!base) continue;
          gold += Math.round(base.sellValue * ECONOMY.SHOP_SELL_MULT * (1 + it.upgradeLevel * 0.25));
          inv.splice(idx, 1);
        }
        set({ inventory: inv, character: { ...s.character, gold: s.character.gold + gold } });
        s.pushToast({ text: `Продано на ${gold} золота.`, tone: "good" });
        return gold;
      },

      pushToast: (t) =>
        set((s) => ({ toasts: [...s.toasts, { ...t, id: genId("tst") }].slice(-5) })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      reset: () =>
        set({
          screen: "splash",
          character: null,
          inventory: [],
          equipped: {},
          materials: {},
          pets: [],
          activePetUid: null,
          toasts: [],
          lastDungeonLog: [],
        }),
    }),
    {
      name: "ton-abyss-save",
      version: 1,
      partialize: (s) => ({
        character: s.character,
        inventory: s.inventory,
        equipped: s.equipped,
        materials: s.materials,
        pets: s.pets,
        activePetUid: s.activePetUid,
        screen: s.character ? s.screen : "splash",
      }),
    },
  ),
);

// Minimal encounter sim (client-only demo). Uses shared formulas indirectly.
function simulateClientFight(
  derived: ReturnType<typeof buildDerived>,
  startHp: number,
  startMana: number,
  enemy: import("@ton-abyss/shared").MonsterDef,
  diff: (typeof DIFFICULTY_CURVE)[number],
  rng: RNG,
  log: import("@ton-abyss/shared").CombatEvent[],
): { playerHp: number; playerDied: boolean } {
  let pHp = startHp;
  let eHp = Math.round(enemy.stats.maxHp * diff.monsterHp);
  const eAttack = Math.round((enemy.stats.attack || enemy.stats.spellPower) * diff.monsterDmg);
  const pAttack = derived.attack + derived.spellPower * 0.6;
  let turn = 0;
  while (eHp > 0 && pHp > 0 && turn < 40) {
    turn++;
    // Player strikes.
    const pcrit = rng.chance(derived.critChance);
    let pd = pAttack * rng.range(0.85, 1.15);
    if (pcrit) pd *= derived.critMultiplier;
    pd = Math.max(1, Math.round(pd * (1 - Math.min(0.6, enemy.stats.defense / (enemy.stats.defense + 80)))));
    eHp -= pd;
    log.push({ turn, actor: "player", target: enemy.id, damage: pd, crit: pcrit, flavor: `Вы бьёте ${enemy.name} на ${pd}${pcrit ? " (крит!)" : ""}` });
    if (eHp <= 0) {
      log.push({ turn, actor: enemy.id, killed: true, flavor: `${enemy.name} повержен!` });
      break;
    }
    // Enemy strikes.
    if (rng.chance(derived.dodge)) {
      log.push({ turn, actor: enemy.id, target: "player", dodged: true, flavor: `Вы уклонились от ${enemy.name}` });
    } else {
      let ed = eAttack * rng.range(0.85, 1.15);
      ed = Math.max(1, Math.round(ed * (1 - Math.min(0.75, derived.defense / (derived.defense + 80)))));
      pHp -= ed;
      log.push({ turn, actor: enemy.id, target: "player", damage: ed, flavor: `${enemy.name} бьёт на ${ed}` });
    }
  }
  void startMana;
  return { playerHp: Math.max(0, pHp), playerDied: pHp <= 0 };
}

export function useDerivedStats() {
  return useGame((s) => {
    if (!s.character) return null;
    return buildDerived(s.character, s.inventory, s.equipped);
  });
}
