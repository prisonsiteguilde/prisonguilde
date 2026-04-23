import type {
  AffixRoll,
  BaseItem,
  ItemInstance,
  LootEntry,
  LootTableDef,
  RarityId,
  StatId,
} from "./types.js";
import { RNG } from "./rng.js";
import { AFFIX_COUNTS, applyMagicFind, RARITY_WEIGHTS_BASE } from "./rarity.js";
import { STATS } from "./types.js";

// Affix pool — each entry is a stat + tier-scaled value range.
// Tier grows with item level. This is one of the key hardcore-balance knobs.

export interface AffixPoolEntry {
  id: string;
  weight: number;
  stat: AffixRoll["stat"];
  element?: AffixRoll["element"];
  valuePerTier: [number, number]; // [min, max] multiplied by tier
  maxTier: number;
  prefixSuffix: "prefix" | "suffix";
  slotRestrict?: BaseItem["slot"][];
}

export const AFFIX_POOL: AffixPoolEntry[] = [
  // prefixes
  { id: "of_strength", weight: 100, stat: "strength", valuePerTier: [2, 5], maxTier: 6, prefixSuffix: "prefix" },
  { id: "of_agility", weight: 100, stat: "agility", valuePerTier: [2, 5], maxTier: 6, prefixSuffix: "prefix" },
  { id: "of_intellect", weight: 100, stat: "intellect", valuePerTier: [2, 5], maxTier: 6, prefixSuffix: "prefix" },
  { id: "of_vitality", weight: 120, stat: "vitality", valuePerTier: [3, 6], maxTier: 6, prefixSuffix: "prefix" },
  { id: "of_spirit", weight: 90, stat: "spirit", valuePerTier: [2, 5], maxTier: 6, prefixSuffix: "prefix" },
  { id: "of_luck", weight: 40, stat: "luck", valuePerTier: [1, 3], maxTier: 6, prefixSuffix: "prefix" },
  { id: "sharp", weight: 80, stat: "attack", valuePerTier: [3, 8], maxTier: 6, prefixSuffix: "prefix", slotRestrict: ["weapon"] },
  { id: "arcane", weight: 70, stat: "spellPower", valuePerTier: [3, 8], maxTier: 6, prefixSuffix: "prefix", slotRestrict: ["weapon", "offhand", "relic"] },
  { id: "warded", weight: 80, stat: "defense", valuePerTier: [3, 9], maxTier: 6, prefixSuffix: "prefix", slotRestrict: ["head", "chest", "legs", "hands", "feet", "offhand"] },
  { id: "vital", weight: 70, stat: "maxHp", valuePerTier: [14, 30], maxTier: 6, prefixSuffix: "prefix" },
  { id: "focused", weight: 40, stat: "maxMana", valuePerTier: [6, 14], maxTier: 6, prefixSuffix: "prefix" },
  // suffixes
  { id: "of_the_hawk", weight: 55, stat: "critChance", valuePerTier: [0.005, 0.012], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_execution", weight: 25, stat: "critMultiplier", valuePerTier: [0.02, 0.05], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_dodge", weight: 45, stat: "dodge", valuePerTier: [0.005, 0.012], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_accuracy", weight: 45, stat: "accuracy", valuePerTier: [0.005, 0.012], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_lifesteal", weight: 20, stat: "lifesteal", valuePerTier: [0.008, 0.02], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_gold", weight: 60, stat: "gold_find", valuePerTier: [0.04, 0.08], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_scholar", weight: 40, stat: "xp_gain", valuePerTier: [0.02, 0.05], maxTier: 6, prefixSuffix: "suffix" },
  // elemental
  { id: "of_flame", weight: 55, stat: "elemental_damage", element: "fire", valuePerTier: [3, 7], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_frost", weight: 55, stat: "elemental_damage", element: "frost", valuePerTier: [3, 7], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_storm", weight: 55, stat: "elemental_damage", element: "shock", valuePerTier: [3, 7], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_void", weight: 25, stat: "elemental_damage", element: "void", valuePerTier: [4, 9], maxTier: 6, prefixSuffix: "suffix" },
  { id: "of_holy", weight: 25, stat: "elemental_damage", element: "holy", valuePerTier: [4, 9], maxTier: 6, prefixSuffix: "suffix" },
];

export function rollRarity(
  rng: RNG,
  magicFindPct: number,
  baseOverride?: Partial<Record<RarityId, number>>,
): RarityId {
  const base = { ...RARITY_WEIGHTS_BASE, ...(baseOverride ?? {}) } as Record<RarityId, number>;
  const w = applyMagicFind(base, magicFindPct);
  const entries = (Object.keys(w) as RarityId[]).map((k) => ({ weight: w[k], value: k }));
  return rng.weighted(entries);
}

export function rollAffixesForItem(
  rng: RNG,
  base: BaseItem,
  rarity: RarityId,
  itemLevel: number,
): AffixRoll[] {
  const [minA, maxA] = AFFIX_COUNTS[rarity];
  const count = rng.int(minA, maxA);
  const tierCap = Math.min(6, 1 + Math.floor(itemLevel / 10));
  const picked: AffixRoll[] = [];
  const usedIds = new Set<string>();
  const pool = AFFIX_POOL.filter((a) => !a.slotRestrict || a.slotRestrict.includes(base.slot));
  for (let i = 0; i < count; i++) {
    const avail = pool.filter((a) => !usedIds.has(a.id));
    if (!avail.length) break;
    const chosen = rng.weighted(avail.map((a) => ({ weight: a.weight, value: a })));
    usedIds.add(chosen.id);
    const tier = rng.int(1, Math.min(chosen.maxTier, tierCap));
    const rawVal = rng.range(chosen.valuePerTier[0] * tier, chosen.valuePerTier[1] * tier);
    const value = chosen.stat === "critChance" || chosen.stat === "dodge" || chosen.stat === "accuracy" || chosen.stat === "lifesteal" || chosen.stat === "critMultiplier" || chosen.stat === "gold_find" || chosen.stat === "xp_gain"
      ? Math.round(rawVal * 1000) / 1000
      : Math.round(rawVal);
    picked.push({
      id: chosen.id,
      stat: chosen.stat,
      element: chosen.element,
      value,
      tier,
    });
  }
  return picked;
}

export interface RollLootContext {
  level: number;
  magicFindPct: number;
  luck: number;
  lootQuantityMult?: number;
  lootQualityMult?: number;
}

export function rollLootTable(
  rng: RNG,
  table: LootTableDef,
  ctx: RollLootContext,
): LootEntry[] {
  const baseRolls = Array.isArray(table.rolls) ? rng.int(table.rolls[0], table.rolls[1]) : table.rolls;
  const rolls = Math.max(1, Math.round(baseRolls * (ctx.lootQuantityMult ?? 1)));
  const out: LootEntry[] = [];
  for (let i = 0; i < rolls; i++) {
    const chosen = rng.weighted(table.entries.map((e) => ({ weight: e.weight, value: e })));
    out.push(chosen);
  }
  return out;
}

export function createItemInstance(
  rng: RNG,
  base: BaseItem,
  ctx: { level: number; magicFindPct: number; rarityOverride?: Partial<Record<RarityId, number>> },
): ItemInstance {
  const rarity = rollRarity(rng, ctx.magicFindPct, ctx.rarityOverride ?? base.rarityWeight);
  const affixes = rollAffixesForItem(rng, base, rarity, ctx.level);
  return {
    uid: `it_${Math.floor(rng.next() * 1e9).toString(36)}_${Date.now().toString(36)}`,
    baseId: base.id,
    rarity,
    level: ctx.level,
    affixes,
    sockets: base.slot === "weapon" || base.slot === "chest" ? [null, null] : undefined,
    upgradeLevel: 0,
    corruption: rarity === "abyssal" ? 1 : 0,
    createdAt: Date.now(),
  };
}

// Quick helper for UI / formulas that need a stable stat-pretty name.
export const STAT_LABEL: Record<StatId, string> = {
  strength: "Сила",
  agility: "Ловкость",
  intellect: "Интеллект",
  vitality: "Выносл.",
  spirit: "Дух",
  luck: "Удача",
};

export const ALL_PRIMARY_STATS = STATS;
