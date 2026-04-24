// Lootbox system. 4 chest tiers with rarity-weighted rolls and pity counters.

import type { RarityId } from "./types.js";

export type LootboxKind = "lb_bronze" | "lb_silver" | "lb_gold" | "lb_abyss";

export interface LootboxDef {
  id: LootboxKind;
  ru: string;
  description: string;
  costGold?: number;
  costShards?: number;
  costDust?: number;
  costTon?: number;
  rolls: number;             // how many items per box
  rarityWeights: Partial<Record<RarityId, number>>;
  guaranteed?: { rarity: RarityId; chance: number };
  pity: { every: number; rarity: RarityId }; // pity guarantee
  iconColor: string;
}

export const LOOTBOXES: Record<LootboxKind, LootboxDef> = {
  lb_bronze: {
    id: "lb_bronze",
    ru: "Бронзовый сундук",
    description: "Базовый сундук. В основном обычные и редкие предметы, шанс на эпику.",
    costGold: 250,
    rolls: 3,
    rarityWeights: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
    pity: { every: 50, rarity: "rare" },
    iconColor: "#a78b6f",
  },
  lb_silver: {
    id: "lb_silver",
    ru: "Серебряный сундук",
    description: "Стабильный источник редких. Один редкий гарантирован.",
    costGold: 1500,
    rolls: 4,
    rarityWeights: { uncommon: 35, rare: 35, epic: 20, legendary: 8, mythic: 2 },
    guaranteed: { rarity: "rare", chance: 1 },
    pity: { every: 30, rarity: "epic" },
    iconColor: "#cbd5e1",
  },
  lb_gold: {
    id: "lb_gold",
    ru: "Золотой сундук",
    description: "Элита. Гарантированная эпика, шанс на легенду.",
    costGold: 7500,
    costShards: 50,
    rolls: 5,
    rarityWeights: { rare: 30, epic: 40, legendary: 20, mythic: 8, abyssal: 2 },
    guaranteed: { rarity: "epic", chance: 1 },
    pity: { every: 20, rarity: "legendary" },
    iconColor: "#f5b942",
  },
  lb_abyss: {
    id: "lb_abyss",
    ru: "Сундук Бездны",
    description: "Запретный сундук. Только мифики и абиссальные предметы.",
    costShards: 250,
    costDust: 30,
    costTon: 0.5,
    rolls: 4,
    rarityWeights: { epic: 20, legendary: 35, mythic: 30, abyssal: 15 },
    guaranteed: { rarity: "legendary", chance: 1 },
    pity: { every: 10, rarity: "mythic" },
    iconColor: "#14f1c1",
  },
};

export interface LootboxState {
  // pity counter per box id (counts since last guaranteed pity proc)
  pityCounters: Record<LootboxKind, number>;
  totalOpened: Record<LootboxKind, number>;
}

export function defaultLootboxState(): LootboxState {
  return {
    pityCounters: { lb_bronze: 0, lb_silver: 0, lb_gold: 0, lb_abyss: 0 },
    totalOpened:  { lb_bronze: 0, lb_silver: 0, lb_gold: 0, lb_abyss: 0 },
  };
}

export interface LootboxRollResult {
  rarities: RarityId[];
  pityTriggered: boolean;
}

export function rollLootbox(
  kind: LootboxKind,
  state: LootboxState,
  rng: () => number,
): { rarities: RarityId[]; pityTriggered: boolean; updatedState: LootboxState } {
  const def = LOOTBOXES[kind];
  if (!def) throw new Error(`Unknown lootbox ${kind}`);
  const next: LootboxState = {
    pityCounters: { ...state.pityCounters },
    totalOpened: { ...state.totalOpened },
  };
  next.pityCounters[kind] = (next.pityCounters[kind] ?? 0) + 1;
  next.totalOpened[kind] = (next.totalOpened[kind] ?? 0) + 1;

  const rarities: RarityId[] = [];
  let pityTriggered = false;
  // pity check
  if (next.pityCounters[kind] >= def.pity.every) {
    rarities.push(def.pity.rarity);
    pityTriggered = true;
    next.pityCounters[kind] = 0;
  }
  // guaranteed
  if (def.guaranteed && rng() < def.guaranteed.chance) {
    rarities.push(def.guaranteed.rarity);
  }
  // remaining rolls
  while (rarities.length < def.rolls) {
    rarities.push(weightedRarity(def.rarityWeights, rng));
  }
  return { rarities: rarities.slice(0, def.rolls), pityTriggered, updatedState: next };
}

function weightedRarity(weights: Partial<Record<RarityId, number>>, rng: () => number): RarityId {
  const entries = Object.entries(weights) as Array<[RarityId, number]>;
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [rarity, w] of entries) {
    roll -= w;
    if (roll <= 0) return rarity;
  }
  return entries[0]?.[0] ?? "common";
}
