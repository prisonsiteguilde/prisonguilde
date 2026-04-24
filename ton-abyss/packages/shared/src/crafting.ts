import type { BaseItem, ItemInstance, RarityId, RecipeDef } from "./types.js";
import { RNG, seedFrom } from "./rng.js";
import { createItemInstance, rollAffixesForItem } from "./loot.js";

// Essence quality tiers used in deep crafting recipes
export type EssenceQuality = "shimmering" | "radiant" | "absolute";
export const ESSENCE_QUALITY_RU: Record<EssenceQuality, string> = {
  shimmering: "Мерцающая эссенция",
  radiant: "Сияющая эссенция",
  absolute: "Абсолютная эссенция",
};
export const ESSENCE_FROM_RARITY: Record<RarityId, EssenceQuality | null> = {
  common: null,
  uncommon: null,
  rare: "shimmering",
  epic: "shimmering",
  legendary: "radiant",
  mythic: "absolute",
  abyssal: "absolute",
};

import { RARITY_ORDER } from "./rarity.js";

export function nextRarity(r: RarityId): RarityId | null {
  const idx = RARITY_ORDER.indexOf(r);
  if (idx < 0 || idx >= RARITY_ORDER.length - 1) return null;
  return RARITY_ORDER[idx + 1] ?? null;
}

// Transmute: spend essence to bump rarity by 1.
export const TRANSMUTE_COST: Record<RarityId, { gold: number; shards: number; essence: EssenceQuality | null; essenceQty: number }> = {
  common: { gold: 250, shards: 0, essence: null, essenceQty: 0 },
  uncommon: { gold: 600, shards: 0, essence: null, essenceQty: 0 },
  rare: { gold: 1500, shards: 1, essence: "shimmering", essenceQty: 2 },
  epic: { gold: 4500, shards: 4, essence: "shimmering", essenceQty: 5 },
  legendary: { gold: 14000, shards: 12, essence: "radiant", essenceQty: 3 },
  mythic: { gold: 45000, shards: 38, essence: "absolute", essenceQty: 2 },
  abyssal: { gold: 0, shards: 0, essence: null, essenceQty: 0 },
};

export function transmuteItem(rng: RNG, item: ItemInstance, base: BaseItem): { ok: boolean; item?: ItemInstance } {
  const next = nextRarity(item.rarity);
  if (!next) return { ok: false };
  // Reroll affixes at the new rarity, keep upgrade level
  const affixes = rollAffixesForItem(rng, base, next, item.level);
  return { ok: true, item: { ...item, rarity: next, affixes } };
}

// Reroll affixes: keeps rarity, rerolls all affix values.
export const REROLL_COST: Record<RarityId, { gold: number; shards: number }> = {
  common: { gold: 100, shards: 0 },
  uncommon: { gold: 250, shards: 0 },
  rare: { gold: 700, shards: 1 },
  epic: { gold: 2200, shards: 3 },
  legendary: { gold: 7000, shards: 9 },
  mythic: { gold: 22000, shards: 25 },
  abyssal: { gold: 65000, shards: 70 },
};

export function rerollAffixes(rng: RNG, item: ItemInstance, base: BaseItem): ItemInstance {
  const affixes = rollAffixesForItem(rng, base, item.rarity, item.level);
  return { ...item, affixes };
}

// Tier upgrade: bump item level by 5 (uses shards + dust + essence).
export const TIER_UPGRADE_COST = { gold: 8000, shards: 6, dust: 30, essence: "radiant" as EssenceQuality, essenceQty: 1 };
export const TIER_UPGRADE_DELTA = 5;
export const TIER_UPGRADE_LEVEL_CAP = 60;

export function tierUpgradeItem(rng: RNG, item: ItemInstance, base: BaseItem): { ok: boolean; item?: ItemInstance } {
  if (item.level + TIER_UPGRADE_DELTA > TIER_UPGRADE_LEVEL_CAP) return { ok: false };
  const newLevel = item.level + TIER_UPGRADE_DELTA;
  const affixes = rollAffixesForItem(rng, base, item.rarity, newLevel);
  return { ok: true, item: { ...item, level: newLevel, affixes } };
}

// Salvaging: turn an item into materials scaled by rarity and level.
export const SALVAGE_YIELD: Record<RarityId, { materials: number; dust: number; shards: number }> = {
  common: { materials: 1, dust: 0, shards: 0 },
  uncommon: { materials: 2, dust: 0, shards: 0 },
  rare: { materials: 4, dust: 1, shards: 0 },
  epic: { materials: 8, dust: 3, shards: 1 },
  legendary: { materials: 16, dust: 8, shards: 3 },
  mythic: { materials: 32, dust: 18, shards: 9 },
  abyssal: { materials: 64, dust: 40, shards: 22 },
};

// Upgrade system: +1..+15.
// Success chance drops, destruction chance rises at high upgrade levels.
export const UPGRADE_TABLE: { level: number; success: number; destroy: number; goldCost: number; dustCost: number }[] = [
  { level: 1, success: 1.0, destroy: 0.0, goldCost: 100, dustCost: 0 },
  { level: 2, success: 0.98, destroy: 0.0, goldCost: 250, dustCost: 0 },
  { level: 3, success: 0.95, destroy: 0.0, goldCost: 500, dustCost: 0 },
  { level: 4, success: 0.9, destroy: 0.0, goldCost: 1000, dustCost: 1 },
  { level: 5, success: 0.85, destroy: 0.0, goldCost: 2000, dustCost: 2 },
  { level: 6, success: 0.75, destroy: 0.05, goldCost: 3800, dustCost: 4 },
  { level: 7, success: 0.65, destroy: 0.1, goldCost: 6500, dustCost: 7 },
  { level: 8, success: 0.55, destroy: 0.18, goldCost: 11000, dustCost: 12 },
  { level: 9, success: 0.45, destroy: 0.25, goldCost: 18000, dustCost: 20 },
  { level: 10, success: 0.35, destroy: 0.32, goldCost: 30000, dustCost: 32 },
  { level: 11, success: 0.28, destroy: 0.4, goldCost: 52000, dustCost: 52 },
  { level: 12, success: 0.22, destroy: 0.48, goldCost: 90000, dustCost: 85 },
  { level: 13, success: 0.17, destroy: 0.55, goldCost: 155000, dustCost: 140 },
  { level: 14, success: 0.13, destroy: 0.6, goldCost: 260000, dustCost: 230 },
  { level: 15, success: 0.09, destroy: 0.65, goldCost: 440000, dustCost: 380 },
];

export function upgradeItem(
  rng: RNG,
  item: ItemInstance,
): { result: "success" | "fail" | "destroy"; item?: ItemInstance } {
  const next = item.upgradeLevel + 1;
  if (next > 15) return { result: "fail", item };
  const row = UPGRADE_TABLE[next - 1]!;
  if (rng.chance(row.success)) {
    return {
      result: "success",
      item: { ...item, upgradeLevel: next },
    };
  }
  if (rng.chance(row.destroy)) {
    return { result: "destroy" };
  }
  return { result: "fail", item };
}

export function canCraft(
  recipe: RecipeDef,
  have: Record<string, number>,
  gold: number,
): boolean {
  if (gold < recipe.goldCost) return false;
  for (const inp of recipe.inputs) {
    if ((have[inp.baseId] ?? 0) < inp.qty) return false;
  }
  return true;
}

export function craft(
  recipe: RecipeDef,
  rng: RNG,
  base: BaseItem,
  ctx: { magicFindPct: number },
): ItemInstance {
  return createItemInstance(rng.fork(seedFrom(recipe.id, Date.now())), base, {
    level: recipe.outputLevel,
    magicFindPct: ctx.magicFindPct,
    rarityOverride: recipe.rarityBias,
  });
}
