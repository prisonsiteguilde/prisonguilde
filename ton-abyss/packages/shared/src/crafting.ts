import type { BaseItem, ItemInstance, RarityId, RecipeDef } from "./types.js";
import { RNG, seedFrom } from "./rng.js";
import { createItemInstance } from "./loot.js";

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
