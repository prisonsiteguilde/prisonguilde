import type { RarityId } from "./types.js";
import { RARITIES } from "./types.js";

// Hardcore rarity weights. Abyssal is vanishingly rare.
// Base weights (before luck/modifiers):
export const RARITY_WEIGHTS_BASE: Record<RarityId, number> = {
  common: 1000,
  uncommon: 300,
  rare: 90,
  epic: 22,
  legendary: 5,
  mythic: 0.8,
  abyssal: 0.07,
};

// Number of random affixes per rarity (min..max).
export const AFFIX_COUNTS: Record<RarityId, [number, number]> = {
  common: [0, 1],
  uncommon: [1, 2],
  rare: [2, 3],
  epic: [3, 4],
  legendary: [4, 5],
  mythic: [5, 6],
  abyssal: [6, 7],
};

export const RARITY_COLOR: Record<RarityId, string> = {
  common: "#b0b8c4",
  uncommon: "#4ade80",
  rare: "#60a5fa",
  epic: "#c084fc",
  legendary: "#f59e0b",
  mythic: "#f43f5e",
  abyssal: "#14f1c1",
};

export const RARITY_MULT: Record<RarityId, number> = {
  common: 1.0,
  uncommon: 1.18,
  rare: 1.45,
  epic: 1.85,
  legendary: 2.4,
  mythic: 3.2,
  abyssal: 4.5,
};

export const RARITY_ORDER = RARITIES;

export function rarityIndex(r: RarityId): number {
  return RARITIES.indexOf(r);
}

// Apply magic-find bonus. Each 1% MF reduces common weight by 0.25% and boosts
// higher rarities multiplicatively. Luck soft-caps diminishingly.
export function applyMagicFind(
  weights: Record<RarityId, number>,
  magicFindPct: number,
): Record<RarityId, number> {
  const mf = Math.max(0, magicFindPct) / 100;
  const softMf = 1 - Math.exp(-mf * 0.6); // soft-cap ~63% effectiveness at 100 MF
  const out: Record<RarityId, number> = { ...weights };
  out.common *= Math.max(0.05, 1 - softMf * 0.45);
  out.uncommon *= 1 + softMf * 0.25;
  out.rare *= 1 + softMf * 0.6;
  out.epic *= 1 + softMf * 1.1;
  out.legendary *= 1 + softMf * 2.0;
  out.mythic *= 1 + softMf * 3.2;
  out.abyssal *= 1 + softMf * 4.6;
  return out;
}
