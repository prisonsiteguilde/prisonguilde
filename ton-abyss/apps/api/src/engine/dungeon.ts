import type {
  CombatActor,
  CombatEvent,
  DungeonDef,
  ItemInstance,
  MonsterDef,
  BossDef,
} from "@ton-abyss/shared";
import {
  RNG,
  seedFrom,
  applyGear,
  clampDerived,
  cloneDerived,
  derivedFromPrimary,
  primaryStatsFor,
  rollLootTable,
  createItemInstance,
  rollRarity,
  levelFromTotalXp,
  xpForLevel,
  POINTS_PER_LEVEL,
  DIFFICULTY_CURVE,
} from "@ton-abyss/shared";
import { BOSSES, ITEMS, MONSTERS, LOOT_TABLES } from "@ton-abyss/content";
import { resolveCombat } from "./combat.js";
import type { FullState } from "../state.js";

export interface DungeonSummary {
  victory: boolean;
  rooms: number;
  xpGained: number;
  goldGained: number;
  lootDropped: ItemInstance[];
  materialsGained: Record<string, number>;
  died: boolean;
}

export function runDungeon(state: FullState, dungeon: DungeonDef): { state: FullState; log: CombatEvent[]; summary: DungeonSummary } {
  const rng = new RNG(seedFrom(state.character.id, dungeon.id, Date.now()));
  const diffRow = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
  const log: CombatEvent[] = [];
  const loot: ItemInstance[] = [];
  const materials: Record<string, number> = {};
  let xp = 0;
  let gold = 0;
  let died = false;
  const player = buildPlayerActor(state);
  let rooms = 0;
  for (let i = 0; i < dungeon.rooms; i++) {
    const isLast = i === dungeon.rooms - 1;
    const enemy: MonsterDef | BossDef = isLast
      ? BOSSES[dungeon.bossId]!
      : pickRoomMonster(rng, dungeon, diffRow.monsterHp, diffRow.monsterDmg);
    const enemyActor = monsterToActor(enemy, diffRow.monsterHp, diffRow.monsterDmg);
    const combat = resolveCombat(player, enemyActor, rng.fork(i * 7919));
    log.push({ turn: 0, actor: "narration", flavor: `Комната ${i + 1}: ${enemy.name}` });
    for (const e of combat.log) log.push(e);
    if (combat.winner === "enemy") {
      died = true;
      break;
    }
    // Loot.
    const lootCtx = { level: state.character.level, magicFindPct: state.character.stats.luck * 3, luck: state.character.stats.luck, lootQuantityMult: diffRow.loot, lootQualityMult: diffRow.quality };
    const table = LOOT_TABLES[enemy.lootTable];
    if (table) {
      const rolls = rollLootTable(rng, table, lootCtx);
      for (const roll of rolls) {
        if (roll.kind === "gold") {
          gold += rng.int(roll.amount![0], roll.amount![1]);
        } else if (roll.kind === "material" && roll.baseId) {
          const qty = rng.int(roll.amount?.[0] ?? 1, roll.amount?.[1] ?? 1);
          materials[roll.baseId] = (materials[roll.baseId] ?? 0) + qty;
        } else if (roll.kind === "item" && roll.baseId) {
          const base = ITEMS[roll.baseId];
          if (!base) continue;
          const it = createItemInstance(rng, base, {
            level: state.character.level,
            magicFindPct: lootCtx.magicFindPct,
            rarityOverride: roll.rarityOverride,
          });
          loot.push(it);
        }
      }
    }
    xp += Math.round(enemy.xp * (diffRow.quality * 0.8 + 0.6));
    gold += rng.int(enemy.gold[0], enemy.gold[1]);
    rooms++;
  }
  // Apply rewards / penalties.
  if (!died) {
    state.character.xp += xp;
    state.character.gold += gold;
    for (const [k, v] of Object.entries(materials)) {
      state.materials[k] = (state.materials[k] ?? 0) + v;
    }
    for (const it of loot) state.inventory.push(it);
    state.character.deepestFloor = Math.max(state.character.deepestFloor, dungeon.difficulty);
    // Level-up sweep.
    levelUpLoop(state);
  } else {
    // Hardcore penalty.
    state.character.deaths += 1;
    state.character.gold = Math.max(0, Math.floor(state.character.gold * 0.75));
    const lostXpPct = 0.15;
    state.character.xp = Math.max(0, state.character.xp - Math.floor(xpForLevel(state.character.level) * lostXpPct));
  }

  return {
    state,
    log,
    summary: {
      victory: !died,
      rooms,
      xpGained: xp,
      goldGained: gold,
      lootDropped: loot,
      materialsGained: materials,
      died,
    },
  };
}

function levelUpLoop(state: FullState): void {
  const info = levelFromTotalXp(state.character.xp + xpTotalUpTo(state.character.level));
  if (info.level > state.character.level) {
    state.character.unspentPoints += POINTS_PER_LEVEL * (info.level - state.character.level);
    state.character.level = info.level;
  }
}

function xpTotalUpTo(level: number): number {
  let s = 0;
  for (let l = 1; l < level; l++) s += xpForLevel(l);
  return s;
}

function buildPlayerActor(state: FullState): CombatActor {
  const equippedItems = Object.values(state.equipped)
    .filter((uid): uid is string => !!uid)
    .map((uid) => state.inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  const primary = primaryStatsFor(state.character.classId, state.character.level, {});
  // Reallocate player's stat-point buys — primary stats already stored.
  Object.assign(primary, state.character.stats);
  const derivedBase = derivedFromPrimary(state.character.classId, primary);
  const derived = applyGear(derivedBase, equippedItems, (id) => ITEMS[id]);
  clampDerived(derived);
  // Use current hp/mana.
  return {
    side: "player",
    id: state.character.id,
    name: "Вы",
    level: state.character.level,
    stats: derived,
    hp: Math.min(derived.maxHp, state.character.hpCurrent || derived.maxHp),
    mana: Math.min(derived.maxMana, state.character.manaCurrent || derived.maxMana),
    statuses: [],
    cooldowns: {},
    abilities: starterAbilities(state.character.classId),
  };
}

function starterAbilities(classId: string): string[] {
  switch (classId) {
    case "warden":
      return ["basic_strike", "power_strike", "shield_wall"];
    case "runesmith":
      return ["basic_strike", "rune_bolt", "rune_ignite", "lesser_heal"];
    case "voidcaller":
      return ["basic_strike", "void_drain", "void_curse", "lesser_heal"];
    case "beastbound":
      return ["basic_strike", "beast_slash", "rally_pet", "power_strike"];
    default:
      return ["basic_strike"];
  }
}

function monsterToActor(m: MonsterDef, hpMult: number, dmgMult: number): CombatActor {
  const stats = cloneDerived(m.stats);
  stats.maxHp = Math.round(stats.maxHp * hpMult);
  stats.attack = Math.round(stats.attack * dmgMult);
  stats.spellPower = Math.round(stats.spellPower * dmgMult);
  return {
    side: "enemy",
    id: `e_${m.id}_${Math.random().toString(36).slice(2, 6)}`,
    name: m.name,
    level: m.level,
    stats,
    hp: stats.maxHp,
    mana: stats.maxMana,
    statuses: [],
    cooldowns: {},
    abilities: m.abilities.slice(),
  };
}

function pickRoomMonster(rng: RNG, d: DungeonDef, hpMult: number, dmgMult: number): MonsterDef {
  const id = rng.pick(d.monsterPool);
  const m = MONSTERS[id];
  if (!m) throw new Error(`unknown monster ${id}`);
  return m;
}

void rollRarity; // ensure export is kept referenced
