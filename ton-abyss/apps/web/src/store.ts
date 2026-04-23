import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Character,
  ClassId,
  ItemInstance,
  PetInstance,
  StatusEffect,
  AbilityDef,
  MonsterDef,
  SkillAllocation,
  QuestProgress,
  ParagonAllocation,
  MapProgress,
  LeaderboardEntry,
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
import {
  ITEMS,
  LOOT_TABLES,
  MONSTERS,
  BOSSES,
  RECIPES,
  DUNGEONS,
  ABILITIES,
  SETS,
  GEMS,
  QUESTS,
  ACHIEVEMENTS,
  SKILLS,
  WORLD_MAP,
} from "@ton-abyss/content";

export type Screen =
  | "splash"
  | "class_select"
  | "home"
  | "inventory"
  | "equipment"
  | "dungeon_list"
  | "dungeon_run"
  | "active_combat"
  | "crafting"
  | "pets"
  | "shop"
  | "codex"
  | "world_map"
  | "skill_tree"
  | "sockets"
  | "quests"
  | "achievements"
  | "leaderboard";

export interface Toast {
  id: string;
  text: string;
  tone?: "info" | "good" | "bad" | "epic";
}

export interface CombatActor {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  statuses: StatusEffect[];
  abilityCooldowns: Record<string, number>;
}

export interface ActiveCombatState {
  dungeonId: string;
  room: number;
  totalRooms: number;
  isBossRoom: boolean;
  player: CombatActor;
  enemy: CombatActor;
  enemyDef: MonsterDef;
  rngSeed: number;
  turn: number;
  log: { turn: number; text: string; tone?: "info" | "good" | "bad" | "epic" }[];
  aggregatedLoot: ItemInstance[];
  aggregatedGold: number;
  aggregatedXp: number;
  aggregatedMats: Record<string, number>;
  damageDealtTotal: number;
  ended: boolean;
  victory: boolean;
  rewardsApplied: boolean;
}

export interface GameState {
  screen: Screen;
  character: Character | null;
  inventory: ItemInstance[];
  equipped: Record<string, string | null>;
  materials: Record<string, number>;
  gems: Record<string, number>; // gem base id -> count
  pets: PetInstance[];
  activePetUid: string | null;
  toasts: Toast[];
  lastDungeonLog: import("@ton-abyss/shared").CombatEvent[];

  // expansion state
  skillAllocation: SkillAllocation;
  skillPoints: number;
  paragon: ParagonAllocation;
  paragonPoints: number;
  quests: Record<string, QuestProgress>;
  achievements: Record<string, { unlocked: boolean; progress: number; claimedAt?: number }>;
  unlockedTitles: string[];
  activeTitle: string | null;
  mapProgress: MapProgress;
  combat: ActiveCombatState | null;
  dungeonsCleared: Record<string, number>;
  bossesKilled: Record<string, number>;
  monstersKilled: Record<string, number>;
  totalKills: number;
  totalGoldEarned: number;
  totalItemsLooted: number;
  totalDamageDealt: number;
  hardcoreStreak: number;
  leaderboard: LeaderboardEntry[];

  // UI / animation
  lootReveal: ItemInstance[] | null;
  bossCinematic: string | null;

  // actions
  setScreen: (s: Screen) => void;
  createCharacter: (classId: ClassId, hardcore: boolean) => void;
  allocatePoint: (stat: keyof Character["stats"]) => void;
  equipItem: (uid: string) => void;
  unequip: (slot: string) => void;

  // Combat
  beginDungeon: (dungeonId: string) => void;
  combatAction: (kind: "basic" | "ability" | "consumable" | "flee", payload?: { abilityId?: string; itemUid?: string }) => void;
  endCombatReturn: () => void;
  dismissLootReveal: () => void;
  dismissBossCinematic: () => void;

  // Crafting
  craftRecipe: (recipeId: string) => { ok: boolean; error?: string };
  upgrade: (uid: string) => { result: "success" | "fail" | "destroy" };
  salvage: (uids: string[]) => { materials: number; dust: number; shards: number };
  sell: (uids: string[]) => number;

  // Sockets & gems
  socketGem: (itemUid: string, slotIndex: number, gemBaseId: string) => { ok: boolean; error?: string };
  unsocketGem: (itemUid: string, slotIndex: number) => { ok: boolean };
  reforgeItem: (uid: string) => { ok: boolean; error?: string };

  // Skills
  allocateSkill: (nodeId: string) => { ok: boolean; error?: string };
  resetSkills: () => void;
  allocateParagon: (kind: keyof ParagonAllocation) => void;

  // Quests & achievements
  acceptQuest: (questId: string) => void;
  claimQuest: (questId: string) => { ok: boolean };
  claimAchievement: (achId: string) => { ok: boolean };

  // Title
  setActiveTitle: (title: string | null) => void;

  // Map
  enterMapNode: (nodeId: string) => void;

  // Leaderboard
  refreshLeaderboard: () => void;

  // Utility
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  reset: () => void;

  // internal
  _finalizeDungeon: (combat: ActiveCombatState) => void;
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
    sockets: [],
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

export function computeSetBonuses(equipped: Record<string, string | null>, inventory: ItemInstance[]) {
  const counts: Record<string, number> = {};
  const equippedItems = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  for (const setId of Object.keys(SETS)) {
    const set = SETS[setId]!;
    const count = equippedItems.filter((i) => set.pieceIds.includes(i.baseId)).length;
    counts[setId] = count;
  }
  // Apply cumulative bonuses for each set
  const aggregate: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  const active: { setId: string; pieces: number; name: string }[] = [];
  for (const [setId, count] of Object.entries(counts)) {
    if (count < 2) continue;
    const set = SETS[setId]!;
    active.push({ setId, pieces: count, name: set.name });
    for (const bonus of set.bonuses) {
      if (count >= bonus.pieces) {
        for (const [k, v] of Object.entries(bonus.bonus)) {
          if (typeof v === "number") {
            (aggregate as any)[k] = ((aggregate as any)[k] ?? 0) + v;
          } else if (typeof v === "object" && v !== null) {
            (aggregate as any)[k] = { ...((aggregate as any)[k] ?? {}) };
            for (const [kk, vv] of Object.entries(v)) {
              (aggregate as any)[k][kk] = ((aggregate as any)[k][kk] ?? 0) + (vv as number);
            }
          }
        }
      }
    }
  }
  return { bonuses: aggregate, activeSets: active };
}

export function computeSkillBonuses(allocation: SkillAllocation): Partial<import("@ton-abyss/shared").DerivedStats> {
  const aggregate: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  for (const [nodeId, rank] of Object.entries(allocation)) {
    if (!rank) continue;
    const node = SKILLS[nodeId];
    if (!node?.grants) continue;
    for (const [k, v] of Object.entries(node.grants)) {
      if (typeof v === "number") {
        (aggregate as any)[k] = ((aggregate as any)[k] ?? 0) + v * rank;
      }
    }
  }
  return aggregate;
}

export function computeParagonBonuses(p: ParagonAllocation): Partial<import("@ton-abyss/shared").DerivedStats> & { goldFindPct?: number; magicFindPct?: number } {
  return {
    attack: Math.round(p.offense * 1),
    spellPower: Math.round(p.offense * 1),
    defense: Math.round(p.defense * 0.5),
    luck: Math.round(p.utility * 0.25 + p.treasure * 0.25),
  };
}

export function computeGemBonuses(inventory: ItemInstance[], equipped: Record<string, string | null>) {
  const agg: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  const equippedItems = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  for (const it of equippedItems) {
    for (const socket of it.sockets ?? []) {
      if (!socket) continue;
      const gem = GEMS[socket];
      if (!gem) continue;
      const base = ITEMS[it.baseId];
      const slotType = base?.slot;
      let bonus = gem.anyBonus ?? {};
      if (slotType === "weapon" && gem.weaponBonus) bonus = gem.weaponBonus;
      else if ((slotType === "chest" || slotType === "head" || slotType === "legs" || slotType === "hands" || slotType === "feet" || slotType === "offhand") && gem.armorBonus) bonus = gem.armorBonus;
      for (const [k, v] of Object.entries(bonus)) {
        if (typeof v === "number") (agg as any)[k] = ((agg as any)[k] ?? 0) + v;
      }
    }
  }
  return agg;
}

export function buildDerived(
  character: Character,
  inventory: ItemInstance[],
  equipped: Record<string, string | null>,
  skillAllocation: SkillAllocation,
  paragon: ParagonAllocation,
) {
  const primary = primaryStatsFor(character.classId, character.level, {});
  Object.assign(primary, character.stats);
  const base = derivedFromPrimary(character.classId, primary);
  const gear = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  const withGear = applyGear(base, gear, (id) => ITEMS[id]);
  // add set / skill / paragon / gem bonuses
  const setAgg = computeSetBonuses(equipped, inventory).bonuses;
  const skillAgg = computeSkillBonuses(skillAllocation);
  const paragonAgg = computeParagonBonuses(paragon);
  const gemAgg = computeGemBonuses(inventory, equipped);
  const merged = { ...withGear } as any;
  for (const agg of [setAgg, skillAgg, paragonAgg, gemAgg]) {
    for (const [k, v] of Object.entries(agg)) {
      if (typeof v === "number") {
        merged[k] = (merged[k] ?? 0) + v;
      } else if (typeof v === "object" && v !== null) {
        merged[k] = { ...(merged[k] ?? {}) };
        for (const [kk, vv] of Object.entries(v)) {
          merged[k][kk] = (merged[k][kk] ?? 0) + (vv as number);
        }
      }
    }
  }
  return merged as ReturnType<typeof derivedFromPrimary>;
}

function applyLevelUps(character: Character, skillPoints: number): { character: Character; skillPointsGained: number; paragonGained: number } {
  const info = levelFromTotalXp(character.xp + xpTotalUpTo(character.level));
  let paragonGained = 0;
  if (info.level > character.level) {
    const gained = info.level - character.level;
    // Paragon: level 50 cap; beyond grants paragonPoints (1 per level).
    const levelCap = 50;
    let newLevel = info.level;
    if (newLevel > levelCap) {
      paragonGained = newLevel - Math.max(levelCap, character.level);
      newLevel = levelCap;
    }
    const skillGained = Math.max(0, newLevel - character.level) * 1; // 1 skill pt per level
    return {
      character: {
        ...character,
        level: newLevel,
        unspentPoints: character.unspentPoints + gained * POINTS_PER_LEVEL,
      },
      skillPointsGained: skillGained,
      paragonGained,
    };
  }
  return { character, skillPointsGained: 0, paragonGained: 0 };
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
      gems: {},
      pets: [],
      activePetUid: null,
      toasts: [],
      lastDungeonLog: [],
      skillAllocation: {},
      skillPoints: 0,
      paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
      paragonPoints: 0,
      quests: {},
      achievements: {},
      unlockedTitles: [],
      activeTitle: null,
      mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
      combat: null,
      dungeonsCleared: {},
      bossesKilled: {},
      monstersKilled: {},
      totalKills: 0,
      totalGoldEarned: 0,
      totalItemsLooted: 0,
      totalDamageDealt: 0,
      hardcoreStreak: 0,
      leaderboard: [],
      lootReveal: null,
      bossCinematic: null,

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
          skillPoints: 1,
          skillAllocation: {},
          paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: 0,
          quests: { q_main_01: { questId: "q_main_01", status: "active", startedAt: Date.now(), objectives: {} } },
          achievements: {},
          unlockedTitles: [],
          activeTitle: null,
          mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
          combat: null,
          dungeonsCleared: {},
          bossesKilled: {},
          monstersKilled: {},
          totalKills: 0,
          totalGoldEarned: 0,
          totalItemsLooted: 0,
          totalDamageDealt: 0,
          hardcoreStreak: 0,
          gems: {},
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
      unequip: (slot) => set((s) => ({ equipped: { ...s.equipped, [slot]: null } })),

      // ================ ACTIVE COMBAT ================
      beginDungeon: (dungeonId) => {
        const s = get();
        if (!s.character) return;
        const dungeon = DUNGEONS[dungeonId];
        if (!dungeon) return;
        if (s.character.level < dungeon.levelMin) {
          s.pushToast({ text: `Требуется уровень ${dungeon.levelMin}.`, tone: "bad" });
          return;
        }
        if ((dungeon.entryCost?.gold ?? 0) > s.character.gold) {
          s.pushToast({ text: "Недостаточно золота для входа.", tone: "bad" });
          return;
        }
        // Charge entry
        const newChar = { ...s.character, gold: s.character.gold - (dungeon.entryCost?.gold ?? 0) };
        const derived = buildDerived(newChar, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const rngSeed = seedFrom(s.character.id, dungeon.id, Date.now());
        // Spawn first encounter
        const rng = new RNG(rngSeed);
        const enemyId = rng.pick(dungeon.monsterPool);
        const enemy = MONSTERS[enemyId];
        if (!enemy) return;
        const diff = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
        const enemyMaxHp = Math.round(enemy.stats.maxHp * diff.monsterHp);
        const combat: ActiveCombatState = {
          dungeonId,
          room: 1,
          totalRooms: dungeon.rooms,
          isBossRoom: dungeon.rooms === 1,
          player: {
            id: "player",
            name: s.character.classId,
            hp: derived.maxHp,
            maxHp: derived.maxHp,
            mana: derived.maxMana,
            maxMana: derived.maxMana,
            statuses: [],
            abilityCooldowns: {},
          },
          enemy: {
            id: enemy.id,
            name: enemy.name,
            hp: enemyMaxHp,
            maxHp: enemyMaxHp,
            mana: enemy.stats.maxMana,
            maxMana: enemy.stats.maxMana,
            statuses: [],
            abilityCooldowns: {},
          },
          enemyDef: enemy,
          rngSeed,
          turn: 0,
          log: [{ turn: 0, text: `Вы входите в ${dungeon.name}. Комната 1 / ${dungeon.rooms}. ${enemy.name} приближается…`, tone: "info" }],
          aggregatedLoot: [],
          aggregatedGold: 0,
          aggregatedXp: 0,
          aggregatedMats: {},
          damageDealtTotal: 0,
          ended: false,
          victory: false,
          rewardsApplied: false,
        };
        set({ character: newChar, combat, screen: "active_combat" });
      },

      combatAction: (kind, payload) => {
        const s = get();
        if (!s.character || !s.combat) return;
        const combat = s.combat;
        if (combat.ended) return;
        const dungeon = DUNGEONS[combat.dungeonId];
        if (!dungeon) return;
        const diff = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const rng = new RNG(combat.rngSeed + combat.turn * 37 + 1);

        combat.turn++;
        const newLog: typeof combat.log = [...combat.log];

        // Resolve player action
        let ability: AbilityDef | null = null;
        let mana = combat.player.mana;
        let playerActionDescription = "";

        if (kind === "flee") {
          if (rng.chance(0.5)) {
            newLog.push({ turn: combat.turn, text: "Вам удалось сбежать! Вы возвращаетесь без награды.", tone: "bad" });
            set({
              combat: { ...combat, ended: true, victory: false, log: newLog },
            });
            return;
          } else {
            newLog.push({ turn: combat.turn, text: "Попытка побега не удалась!", tone: "bad" });
          }
        } else if (kind === "consumable" && payload?.itemUid) {
          const it = s.inventory.find((i) => i.uid === payload.itemUid);
          if (it) {
            const base = ITEMS[it.baseId];
            if (base?.slot === "consumable") {
              // Simple heal
              const heal = base.id === "con_minor_hp_potion" ? 50 : base.id === "con_hp_potion" ? 180 : 420;
              combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + heal);
              newLog.push({ turn: combat.turn, text: `Вы используете ${base.name}: +${heal} HP.`, tone: "good" });
              // Remove one
              const inv = [...s.inventory];
              const idx = inv.findIndex((i) => i.uid === it.uid);
              if (idx !== -1) inv.splice(idx, 1);
              set({ inventory: inv });
            }
          }
        } else if (kind === "ability" && payload?.abilityId) {
          const def = ABILITIES[payload.abilityId];
          if (def) {
            const cd = combat.player.abilityCooldowns[def.id] ?? 0;
            if (cd > 0) {
              newLog.push({ turn: combat.turn, text: `${def.name}: перезарядка ещё ${cd} ход.`, tone: "bad" });
              combat.turn--; // free action
              set({ combat: { ...combat, log: newLog } });
              return;
            }
            if (mana < def.manaCost) {
              newLog.push({ turn: combat.turn, text: `Не хватает маны для ${def.name}.`, tone: "bad" });
              combat.turn--;
              set({ combat: { ...combat, log: newLog } });
              return;
            }
            mana -= def.manaCost;
            ability = def;
            combat.player.abilityCooldowns[def.id] = def.cooldown;
            playerActionDescription = def.name;
          }
        } else {
          ability = ABILITIES["basic_strike"]!;
          playerActionDescription = "Удар";
        }

        // Apply player damage
        if (ability && ability.kind !== "heal" && ability.kind !== "buff") {
          const scaling = ability.scaling ?? {};
          const atk = (scaling.attack ?? 0) * derived.attack + (scaling.spellPower ?? 0) * derived.spellPower;
          let dmg = (ability.baseDamage ?? 0) + atk;
          const crit = rng.chance(derived.critChance);
          if (crit) dmg *= derived.critMultiplier;
          // Defense
          const def = combat.enemyDef.stats.defense;
          dmg = Math.max(1, Math.round(dmg * rng.range(0.9, 1.1) * (1 - Math.min(0.6, def / (def + 80)))));
          // Resistance
          if (ability.element) {
            const res = combat.enemyDef.stats.resistance[ability.element] ?? 0;
            dmg = Math.max(1, Math.round(dmg * (1 - res)));
          }
          combat.enemy.hp = Math.max(0, combat.enemy.hp - dmg);
          combat.damageDealtTotal += dmg;
          newLog.push({ turn: combat.turn, text: `${playerActionDescription}: ${dmg}${crit ? " (КРИТ!)" : ""} урона ${combat.enemy.name}.`, tone: crit ? "epic" : "good" });
          // Apply status effects
          if (ability.effects) {
            for (const eff of ability.effects) {
              combat.enemy.statuses = [...combat.enemy.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
          // Lifesteal
          if (derived.lifesteal > 0) {
            const heal = Math.round(dmg * derived.lifesteal);
            combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + heal);
          }
        } else if (ability && ability.kind === "heal") {
          const heal = (ability.baseDamage ?? 0) + (ability.scaling?.spellPower ?? 0) * derived.spellPower;
          const amt = Math.round(heal);
          combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + amt);
          newLog.push({ turn: combat.turn, text: `Лечение: +${amt} HP.`, tone: "good" });
        } else if (ability && ability.kind === "buff") {
          if (ability.effects) {
            for (const eff of ability.effects) {
              combat.player.statuses = [...combat.player.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
          newLog.push({ turn: combat.turn, text: `${ability.name}: применено.`, tone: "good" });
        }

        combat.player.mana = mana;

        // Tick statuses (burn/bleed/poison deal damage at end of player turn)
        const tickStatuses = (actor: CombatActor, onDamage: (n: number) => void) => {
          const remaining: StatusEffect[] = [];
          for (const st of actor.statuses) {
            if (st.id === "burn" || st.id === "bleed" || st.id === "poison") {
              const d = Math.round(st.potency * (st.stacks ?? 1));
              onDamage(d);
              newLog.push({ turn: combat.turn, text: `${actor.name}: ${st.id} -${d} HP.`, tone: "bad" });
            }
            if (st.duration - 1 > 0) remaining.push({ ...st, duration: st.duration - 1 });
          }
          actor.statuses = remaining;
        };
        tickStatuses(combat.enemy, (n) => { combat.enemy.hp = Math.max(0, combat.enemy.hp - n); });

        // Check enemy death
        if (combat.enemy.hp <= 0) {
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name} повержен!`, tone: "epic" });
          // Loot
          const lootRng = new RNG(combat.rngSeed + combat.room * 1001 + 17);
          const tableId = combat.isBossRoom ? (BOSSES[combat.enemyDef.id as any] ? `lt_boss_${dungeon.biome}` : combat.enemyDef.lootTable) : combat.enemyDef.lootTable;
          const table = LOOT_TABLES[tableId] ?? LOOT_TABLES[combat.enemyDef.lootTable];
          const loot: ItemInstance[] = [];
          if (table) {
            const rolls = rollLootTable(lootRng, table, {
              level: s.character.level,
              magicFindPct: s.character.stats.luck * 3,
              luck: s.character.stats.luck,
              lootQuantityMult: diff.loot,
              lootQualityMult: diff.quality,
            });
            for (const roll of rolls) {
              if (roll.kind === "gold" && roll.amount) {
                combat.aggregatedGold += lootRng.int(roll.amount[0], roll.amount[1]);
              } else if (roll.kind === "material" && roll.baseId && roll.amount) {
                const qty = lootRng.int(roll.amount[0], roll.amount[1]);
                combat.aggregatedMats[roll.baseId] = (combat.aggregatedMats[roll.baseId] ?? 0) + qty;
              } else if (roll.kind === "item" && roll.baseId) {
                const base = ITEMS[roll.baseId];
                if (!base) continue;
                const it = createItemInstance(lootRng, base, { level: s.character.level, magicFindPct: s.character.stats.luck * 3, rarityOverride: roll.rarityOverride });
                if (base.slot === "weapon" || base.slot === "chest" || base.slot === "head" || base.slot === "legs" || base.slot === "hands" || base.slot === "feet" || base.slot === "offhand") {
                  const sockCount = base.slot === "weapon" ? 2 : base.slot === "chest" ? 2 : 1;
                  it.sockets = new Array(sockCount).fill(null);
                }
                loot.push(it);
              }
            }
          }
          combat.aggregatedLoot.push(...loot);
          combat.aggregatedXp += Math.round(combat.enemyDef.xp * diff.quality);
          combat.aggregatedGold += new RNG(combat.rngSeed + 1234 + combat.room).int(combat.enemyDef.gold[0], combat.enemyDef.gold[1]);

          // Track kill
          const mk = { ...s.monstersKilled };
          mk[combat.enemyDef.id] = (mk[combat.enemyDef.id] ?? 0) + 1;
          set({ monstersKilled: mk, totalKills: s.totalKills + 1 });

          // Next room or dungeon end
          if (combat.room >= combat.totalRooms) {
            combat.ended = true;
            combat.victory = true;
            combat.log = newLog;
            get()._finalizeDungeon(combat);
            return;
          }
          // Spawn next
          combat.room++;
          combat.isBossRoom = combat.room === combat.totalRooms;
          const nextRng = new RNG(combat.rngSeed + combat.room * 991);
          let nextId = nextRng.pick(dungeon.monsterPool);
          let nextDef: any = MONSTERS[nextId];
          if (combat.isBossRoom) {
            nextId = dungeon.bossId;
            nextDef = BOSSES[nextId];
            set({ bossCinematic: nextDef?.name ?? null });
          }
          if (nextDef) {
            const nextMaxHp = Math.round(nextDef.stats.maxHp * diff.monsterHp);
            combat.enemy = {
              id: nextDef.id,
              name: nextDef.name,
              hp: nextMaxHp,
              maxHp: nextMaxHp,
              mana: nextDef.stats.maxMana,
              maxMana: nextDef.stats.maxMana,
              statuses: [],
              abilityCooldowns: {},
            };
            combat.enemyDef = nextDef;
            combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + Math.round(combat.player.maxHp * 0.12));
            combat.player.mana = Math.min(combat.player.maxMana, combat.player.mana + Math.round(combat.player.maxMana * 0.25));
            newLog.push({ turn: combat.turn, text: `Комната ${combat.room}/${combat.totalRooms}: ${nextDef.name} появляется.`, tone: "info" });
          }
          // Decrement cooldowns
          for (const k of Object.keys(combat.player.abilityCooldowns)) {
            combat.player.abilityCooldowns[k] = Math.max(0, combat.player.abilityCooldowns[k]! - 1);
          }
          set({ combat: { ...combat, log: newLog } });
          return;
        }

        // Enemy counter-attack
        const enemyAbilId = combat.enemyDef.abilities[Math.floor(rng.next() * combat.enemyDef.abilities.length)] ?? "e_bite";
        const enemyAbil = ABILITIES[enemyAbilId] ?? ABILITIES["e_bite"]!;
        if (rng.chance(derived.dodge)) {
          newLog.push({ turn: combat.turn, text: `Вы уклонились от ${enemyAbil.name}!`, tone: "good" });
        } else if (combat.enemy.statuses.some((st) => st.id === "stun" || st.id === "freeze")) {
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name} оглушён и не может атаковать.`, tone: "good" });
        } else {
          const escaling = enemyAbil.scaling ?? {};
          const eatk = (escaling.attack ?? 0) * combat.enemyDef.stats.attack + (escaling.spellPower ?? 0) * combat.enemyDef.stats.spellPower;
          let edmg = ((enemyAbil.baseDamage ?? 0) + eatk) * diff.monsterDmg;
          edmg = Math.max(1, Math.round(edmg * rng.range(0.9, 1.1) * (1 - Math.min(0.75, derived.defense / (derived.defense + 80)))));
          if (enemyAbil.element) {
            const resVal = derived.resistance[enemyAbil.element] ?? 0;
            edmg = Math.max(1, Math.round(edmg * (1 - resVal)));
          }
          // Shield buff reduces damage
          const shield = combat.player.statuses.find((s) => s.id === "shield" || s.id === "fortify");
          if (shield) edmg = Math.max(1, Math.round(edmg * (1 - shield.potency)));
          combat.player.hp = Math.max(0, combat.player.hp - edmg);
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name}: ${enemyAbil.name} ${edmg} урона.`, tone: "bad" });
          // Enemy applies statuses
          if (enemyAbil.effects) {
            for (const eff of enemyAbil.effects) {
              combat.player.statuses = [...combat.player.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
        }
        tickStatuses(combat.player, (n) => { combat.player.hp = Math.max(0, combat.player.hp - n); });

        // Player death
        if (combat.player.hp <= 0) {
          combat.ended = true;
          combat.victory = false;
          combat.log = newLog;
          get()._finalizeDungeon(combat);
          return;
        }

        // Decrement cooldowns
        for (const k of Object.keys(combat.player.abilityCooldowns)) {
          combat.player.abilityCooldowns[k] = Math.max(0, combat.player.abilityCooldowns[k]! - 1);
        }
        set({ combat: { ...combat, log: newLog } });
      },

      _finalizeDungeon: (combat: ActiveCombatState) => {
        const s = get() as GameState & { _finalizeDungeon: (c: ActiveCombatState) => void };
        if (!s.character || combat.rewardsApplied) return;
        combat.rewardsApplied = true;
        const dungeon = DUNGEONS[combat.dungeonId]!;
        let char = { ...s.character };
        const quests = { ...s.quests };
        const achievements = { ...s.achievements };
        const dungeonsCleared = { ...s.dungeonsCleared };
        const bossesKilled = { ...s.bossesKilled };
        const mapProgress: MapProgress = { ...s.mapProgress, unlocked: [...s.mapProgress.unlocked], cleared: [...s.mapProgress.cleared] };

        if (combat.victory) {
          char.xp += combat.aggregatedXp;
          char.gold += combat.aggregatedGold;
          char.hpCurrent = combat.player.hp;
          char.manaCurrent = combat.player.mana;
          char.deepestFloor = Math.max(char.deepestFloor, dungeon.difficulty);
          const lu = applyLevelUps(char, s.skillPoints);
          char = lu.character;
          dungeonsCleared[dungeon.id] = (dungeonsCleared[dungeon.id] ?? 0) + 1;
          bossesKilled[dungeon.bossId] = (bossesKilled[dungeon.bossId] ?? 0) + 1;
          // Map unlock: flag node and downstream
          if (!mapProgress.cleared.includes(dungeon.id)) mapProgress.cleared.push(dungeon.id);
          for (const node of WORLD_MAP) {
            if (node.dungeonId === dungeon.id) {
              if (!mapProgress.cleared.includes(node.id)) mapProgress.cleared.push(node.id);
            }
            if (node.requires?.every((r) => mapProgress.cleared.includes(r) || mapProgress.cleared.some((c) => WORLD_MAP.find((n) => n.id === r)?.dungeonId === c))) {
              if (!mapProgress.unlocked.includes(node.id)) mapProgress.unlocked.push(node.id);
            }
          }
          // Update quests
          for (const qp of Object.values(quests) as QuestProgress[]) {
            if (qp.status !== "active") continue;
            const def = QUESTS[qp.questId];
            if (!def) continue;
            for (const obj of def.objectives) {
              if (obj.kind === "clear_dungeon" && (obj.target === "any" || obj.target === dungeon.id)) {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + 1;
              }
              if (obj.kind === "kill_boss" && (obj.target === "any" || obj.target === dungeon.bossId)) {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + 1;
              }
              if (obj.kind === "kill_monster" && obj.target === "any") {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + combat.totalRooms;
              }
            }
            if (def.objectives.every((o) => (qp.objectives[o.id] ?? 0) >= o.amount)) {
              qp.status = "completed";
              qp.completedAt = Date.now();
              s.pushToast({ text: `Квест завершён: ${def.name}!`, tone: "epic" });
            }
          }
          // Inventory & materials
          const inv = [...s.inventory, ...combat.aggregatedLoot];
          const mats = { ...s.materials };
          for (const [k, v] of Object.entries(combat.aggregatedMats)) mats[k] = (mats[k] ?? 0) + v;
          // Achievements
          const totals = {
            kills: s.totalKills,
            bossKills: Object.values(bossesKilled).reduce((a, b) => (a as number) + (b as number), 0) as number,
            gold: s.totalGoldEarned + combat.aggregatedGold,
            items: s.totalItemsLooted + combat.aggregatedLoot.length,
          };
          for (const ach of Object.values(ACHIEVEMENTS)) {
            const current = achievements[ach.id] ?? { unlocked: false, progress: 0 };
            if (current.unlocked) continue;
            let progress = current.progress;
            const c = ach.condition;
            if (c.kind === "dungeon_cleared") progress = dungeonsCleared[c.target] ?? (c.target === "any" ? Object.values(dungeonsCleared).reduce((a, b) => (a as number) + (b as number), 0) as number : 0);
            else if (c.kind === "boss_killed") progress = c.target === "any" ? totals.bossKills : (bossesKilled[c.target] ?? 0);
            else if (c.kind === "level_reached") progress = char.level;
            else if (c.kind === "gold_earned_total") progress = totals.gold;
            else if (c.kind === "items_looted_total") progress = totals.items;
            if (progress >= c.amount) {
              current.unlocked = true;
              s.pushToast({ text: `Достижение: ${ach.name} (+${ach.points} AP)!`, tone: "epic" });
              if (ach.reward.gold) char.gold += ach.reward.gold;
              if (ach.reward.xp) char.xp += ach.reward.xp;
              if (ach.reward.shards) char.shards += ach.reward.shards;
              if (ach.reward.abyssDust) char.abyssDust += ach.reward.abyssDust;
              if (ach.reward.skillPoints) lu.skillPointsGained += ach.reward.skillPoints;
              if (ach.reward.title) {
                if (!s.unlockedTitles.includes(ach.reward.title)) s.unlockedTitles.push(ach.reward.title);
              }
            }
            current.progress = progress;
            achievements[ach.id] = current;
          }
          set({
            character: char,
            inventory: inv,
            materials: mats,
            skillPoints: s.skillPoints + lu.skillPointsGained,
            paragonPoints: s.paragonPoints + lu.paragonGained,
            quests,
            achievements,
            dungeonsCleared,
            bossesKilled,
            mapProgress,
            totalGoldEarned: totals.gold,
            totalItemsLooted: totals.items,
            totalDamageDealt: s.totalDamageDealt + combat.damageDealtTotal,
            hardcoreStreak: s.hardcoreStreak + 1,
            lootReveal: combat.aggregatedLoot.length > 0 ? combat.aggregatedLoot : null,
            combat,
            bossCinematic: null,
          });
          s.pushToast({ text: `Победа! +${combat.aggregatedXp} XP, +${combat.aggregatedGold} золота, дропа: ${combat.aggregatedLoot.length}.`, tone: "epic" });
        } else {
          // Loss
          char.deaths += 1;
          char.gold = Math.max(0, Math.floor(char.gold * 0.75));
          char.hpCurrent = 1;
          set({
            character: char,
            combat,
            hardcoreStreak: 0,
          });
          s.pushToast({ text: "Вы погибли. Потери: 25% золота. Хардкор не прощает.", tone: "bad" });
        }
      },

      endCombatReturn: () => set({ combat: null, screen: "home", bossCinematic: null }),
      dismissLootReveal: () => set({ lootReveal: null }),
      dismissBossCinematic: () => set({ bossCinematic: null }),

      // ================ CRAFTING ================
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
        if (base.slot === "weapon" || base.slot === "chest" || base.slot === "head" || base.slot === "legs" || base.slot === "hands" || base.slot === "feet" || base.slot === "offhand") {
          const sockCount = base.slot === "weapon" ? 2 : base.slot === "chest" ? 2 : 1;
          item.sockets = new Array(sockCount).fill(null);
        }
        const mats = { ...s.materials };
        for (const inp of recipe.inputs) mats[inp.baseId] = (mats[inp.baseId] ?? 0) - inp.qty;
        set({
          character: { ...s.character, gold: s.character.gold - recipe.goldCost },
          materials: mats,
          inventory: [...s.inventory, item],
          lootReveal: [item],
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

      // ================ SOCKETS & GEMS ================
      socketGem: (itemUid, slotIndex, gemBaseId) => {
        const s = get();
        const idx = s.inventory.findIndex((i) => i.uid === itemUid);
        if (idx === -1) return { ok: false, error: "no item" };
        const item = s.inventory[idx]!;
        if (!item.sockets || slotIndex >= item.sockets.length) return { ok: false, error: "no socket" };
        if ((s.gems[gemBaseId] ?? 0) < 1) return { ok: false, error: "no gem" };
        const newSockets = [...item.sockets];
        newSockets[slotIndex] = gemBaseId;
        const inv = [...s.inventory];
        inv[idx] = { ...item, sockets: newSockets };
        const gems = { ...s.gems, [gemBaseId]: s.gems[gemBaseId]! - 1 };
        set({ inventory: inv, gems });
        s.pushToast({ text: `Гем вставлен.`, tone: "good" });
        return { ok: true };
      },
      unsocketGem: (itemUid, slotIndex) => {
        const s = get();
        const idx = s.inventory.findIndex((i) => i.uid === itemUid);
        if (idx === -1) return { ok: false };
        const item = s.inventory[idx]!;
        if (!item.sockets || !item.sockets[slotIndex]) return { ok: false };
        const cost = 200;
        if (!s.character || s.character.gold < cost) {
          s.pushToast({ text: `Нужно ${cost} золота.`, tone: "bad" });
          return { ok: false };
        }
        const gemBase = item.sockets[slotIndex]!;
        const newSockets = [...item.sockets];
        newSockets[slotIndex] = null;
        const inv = [...s.inventory];
        inv[idx] = { ...item, sockets: newSockets };
        const gems = { ...s.gems, [gemBase]: (s.gems[gemBase] ?? 0) + 1 };
        set({ inventory: inv, gems, character: { ...s.character, gold: s.character.gold - cost } });
        s.pushToast({ text: `Гем извлечён.`, tone: "good" });
        return { ok: true };
      },
      reforgeItem: (uid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no char" };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx === -1) return { ok: false, error: "no item" };
        const item = s.inventory[idx]!;
        const cost = 500 + item.level * 40;
        const dustCost = 10 + item.level;
        if (s.character.gold < cost || s.character.abyssDust < dustCost) {
          s.pushToast({ text: "Недостаточно ресурсов для перековки.", tone: "bad" });
          return { ok: false, error: "insufficient" };
        }
        const rng = new RNG(seedFrom(s.character.id, item.uid, Date.now() + 999));
        const newAffixes = item.affixes.map((a) => ({ ...a, value: Math.round(a.value * rng.range(0.6, 1.4)) }));
        const inv = [...s.inventory];
        inv[idx] = { ...item, affixes: newAffixes };
        set({
          character: { ...s.character, gold: s.character.gold - cost, abyssDust: s.character.abyssDust - dustCost },
          inventory: inv,
        });
        s.pushToast({ text: "Предмет перекован.", tone: "good" });
        return { ok: true };
      },

      // ================ SKILLS ================
      allocateSkill: (nodeId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no char" };
        if (s.skillPoints < 1) return { ok: false, error: "no points" };
        const node = SKILLS[nodeId];
        if (!node) return { ok: false, error: "no node" };
        if (node.classId !== s.character.classId) return { ok: false, error: "wrong class" };
        const cur = s.skillAllocation[nodeId] ?? 0;
        if (cur >= node.maxRank) return { ok: false, error: "maxed" };
        if (node.requires) {
          for (const req of node.requires) {
            if ((s.skillAllocation[req] ?? 0) < 1) return { ok: false, error: `Требуется: ${SKILLS[req]?.name}` };
          }
        }
        // Level gate
        const tierLevels = { 1: 1, 2: 8, 3: 18, 4: 35 };
        if (s.character.level < tierLevels[node.tier]) {
          s.pushToast({ text: `Требуется уровень ${tierLevels[node.tier]}.`, tone: "bad" });
          return { ok: false };
        }
        set({
          skillPoints: s.skillPoints - 1,
          skillAllocation: { ...s.skillAllocation, [nodeId]: cur + 1 },
        });
        s.pushToast({ text: `${node.name}: +1 ранг.`, tone: "good" });
        return { ok: true };
      },
      resetSkills: () => {
        const s = get();
        if (!s.character || s.character.gold < 2000) {
          s.pushToast({ text: "Сброс стоит 2000 золота.", tone: "bad" });
          return;
        }
        const totalInvested = Object.values(s.skillAllocation).reduce((a, b) => a + (b as number), 0);
        set({
          character: { ...s.character, gold: s.character.gold - 2000 },
          skillAllocation: {},
          skillPoints: s.skillPoints + totalInvested,
        });
        s.pushToast({ text: `Сброшено: +${totalInvested} очков.`, tone: "good" });
      },
      allocateParagon: (kind) => {
        const s = get();
        if (s.paragonPoints < 1) return;
        set({
          paragon: { ...s.paragon, [kind]: s.paragon[kind] + 1 },
          paragonPoints: s.paragonPoints - 1,
        });
      },

      // ================ QUESTS ================
      acceptQuest: (questId) => {
        const s = get();
        const def = QUESTS[questId];
        if (!def) return;
        if (s.quests[questId]?.status === "active") return;
        set({
          quests: { ...s.quests, [questId]: { questId, status: "active", startedAt: Date.now(), objectives: {} } },
        });
        s.pushToast({ text: `Взят квест: ${def.name}`, tone: "info" });
      },
      claimQuest: (questId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const qp = s.quests[questId];
        if (!qp || qp.status !== "completed") return { ok: false };
        const def = QUESTS[questId];
        if (!def) return { ok: false };
        const char = { ...s.character };
        if (def.rewards.gold) char.gold += def.rewards.gold;
        if (def.rewards.xp) char.xp += def.rewards.xp;
        if (def.rewards.shards) char.shards += def.rewards.shards;
        if (def.rewards.abyssDust) char.abyssDust += def.rewards.abyssDust;
        const skillPoints = s.skillPoints + (def.rewards.skillPoints ?? 0);
        const unlockedTitles = def.rewards.title && !s.unlockedTitles.includes(def.rewards.title)
          ? [...s.unlockedTitles, def.rewards.title]
          : s.unlockedTitles;
        const inv = [...s.inventory];
        const mats = { ...s.materials };
        for (const r of def.rewards.items ?? []) {
          const base = ITEMS[r.baseId];
          if (!base) continue;
          if (base.slot === "material") mats[r.baseId] = (mats[r.baseId] ?? 0) + r.qty;
          else {
            for (let i = 0; i < r.qty; i++) {
              inv.push({ uid: genId("it"), baseId: r.baseId, rarity: "common", level: base.levelReq ?? 1, affixes: [], upgradeLevel: 0, createdAt: Date.now() });
            }
          }
        }
        // Chain quest
        const quests = { ...s.quests };
        quests[questId] = { ...qp, status: "claimed", claimedAt: Date.now() };
        if (def.chain && QUESTS[def.chain]) {
          quests[def.chain] = { questId: def.chain, status: "active", startedAt: Date.now(), objectives: {} };
        }
        set({ character: char, inventory: inv, materials: mats, skillPoints, unlockedTitles, quests });
        s.pushToast({ text: `Награда получена: ${def.name}!`, tone: "epic" });
        return { ok: true };
      },
      claimAchievement: (achId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const a = s.achievements[achId];
        if (!a?.unlocked || a.claimedAt) return { ok: false };
        const def = ACHIEVEMENTS[achId];
        if (!def) return { ok: false };
        const char = { ...s.character };
        if (def.reward.gold) char.gold += def.reward.gold;
        if (def.reward.xp) char.xp += def.reward.xp;
        if (def.reward.shards) char.shards += def.reward.shards;
        set({
          character: char,
          achievements: { ...s.achievements, [achId]: { ...a, claimedAt: Date.now() } },
        });
        return { ok: true };
      },

      setActiveTitle: (title) => set({ activeTitle: title }),
      enterMapNode: (nodeId) => {
        const s = get();
        const node = WORLD_MAP.find((n) => n.id === nodeId);
        if (!node) return;
        if (!s.mapProgress.unlocked.includes(nodeId)) {
          s.pushToast({ text: "Узел не разблокирован.", tone: "bad" });
          return;
        }
        if (node.dungeonId && node.kind !== "town") {
          get().beginDungeon(node.dungeonId);
        } else if (node.kind === "town") {
          set({ screen: "home" });
        }
      },

      refreshLeaderboard: () => {
        const s = get();
        if (!s.character) return;
        const me: LeaderboardEntry = {
          playerId: s.character.id,
          playerName: s.activeTitle ? `${s.character.classId} «${s.activeTitle}»` : s.character.classId,
          classId: s.character.classId,
          level: s.character.level,
          deepestDungeon: Object.keys(s.dungeonsCleared).sort((a, b) => (DUNGEONS[b]?.difficulty ?? 0) - (DUNGEONS[a]?.difficulty ?? 0))[0] ?? null,
          totalKills: s.totalKills,
          hardcoreRank: s.character.hardcoreMode ? s.hardcoreStreak : 0,
          achievementPoints: Object.values(s.achievements)
            .filter((a: any) => a.unlocked)
            .reduce((sum, a: any) => {
              const id = Object.keys(s.achievements).find((k) => s.achievements[k] === a);
              return sum + (id ? (ACHIEVEMENTS[id]?.points ?? 0) : 0);
            }, 0 as number),
          updatedAt: Date.now(),
        };
        // Simulate other players
        const fakes: LeaderboardEntry[] = [
          { playerId: "p_1", playerName: "Kaelthas", classId: "runesmith", level: 48, deepestDungeon: "dng_abyss_01", totalKills: 3400, hardcoreRank: 28, achievementPoints: 2100, updatedAt: Date.now() },
          { playerId: "p_2", playerName: "Nova «Мифолог»", classId: "voidcaller", level: 52, deepestDungeon: "dng_depths", totalKills: 4200, hardcoreRank: 12, achievementPoints: 2850, updatedAt: Date.now() },
          { playerId: "p_3", playerName: "Grimrook «Страж»", classId: "warden", level: 40, deepestDungeon: "dng_infernal_01", totalKills: 2100, hardcoreRank: 45, achievementPoints: 1500, updatedAt: Date.now() },
          { playerId: "p_4", playerName: "Faela", classId: "beastbound", level: 36, deepestDungeon: "dng_ashen", totalKills: 1800, hardcoreRank: 0, achievementPoints: 1100, updatedAt: Date.now() },
          { playerId: "p_5", playerName: "Orin «Запредельный»", classId: "runesmith", level: 58, deepestDungeon: "dng_celestial_trial", totalKills: 6200, hardcoreRank: 72, achievementPoints: 4100, updatedAt: Date.now() },
          { playerId: "p_6", playerName: "Sylvara", classId: "voidcaller", level: 32, deepestDungeon: "dng_void_shrine", totalKills: 1200, hardcoreRank: 0, achievementPoints: 900, updatedAt: Date.now() },
        ];
        const all = [me, ...fakes].sort((a, b) => b.achievementPoints - a.achievementPoints);
        set({ leaderboard: all });
      },

      pushToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: genId("tst") }].slice(-6) })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      reset: () =>
        set({
          screen: "splash",
          character: null,
          inventory: [],
          equipped: {},
          materials: {},
          gems: {},
          pets: [],
          activePetUid: null,
          toasts: [],
          lastDungeonLog: [],
          skillAllocation: {},
          skillPoints: 0,
          paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: 0,
          quests: {},
          achievements: {},
          unlockedTitles: [],
          activeTitle: null,
          mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
          combat: null,
          dungeonsCleared: {},
          bossesKilled: {},
          monstersKilled: {},
          totalKills: 0,
          totalGoldEarned: 0,
          totalItemsLooted: 0,
          totalDamageDealt: 0,
          hardcoreStreak: 0,
          leaderboard: [],
          lootReveal: null,
          bossCinematic: null,
        }),
    }),
    {
      name: "ton-abyss-save",
      version: 2,
      partialize: (s) => ({
        character: s.character,
        inventory: s.inventory,
        equipped: s.equipped,
        materials: s.materials,
        gems: s.gems,
        pets: s.pets,
        activePetUid: s.activePetUid,
        skillAllocation: s.skillAllocation,
        skillPoints: s.skillPoints,
        paragon: s.paragon,
        paragonPoints: s.paragonPoints,
        quests: s.quests,
        achievements: s.achievements,
        unlockedTitles: s.unlockedTitles,
        activeTitle: s.activeTitle,
        mapProgress: s.mapProgress,
        dungeonsCleared: s.dungeonsCleared,
        bossesKilled: s.bossesKilled,
        monstersKilled: s.monstersKilled,
        totalKills: s.totalKills,
        totalGoldEarned: s.totalGoldEarned,
        totalItemsLooted: s.totalItemsLooted,
        totalDamageDealt: s.totalDamageDealt,
        hardcoreStreak: s.hardcoreStreak,
        screen: s.character ? (s.screen === "active_combat" ? "home" : s.screen) : "splash",
      }),
    },
  ),
);

export function useDerivedStats() {
  return useGame((s) => {
    if (!s.character) return null;
    return buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
  });
}
