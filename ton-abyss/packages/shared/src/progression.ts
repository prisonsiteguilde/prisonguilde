import type { ClassId, StatId } from "./types.js";

// v10 rebalance: softer early-game curve, same mid/late feel.
// XP required *per level* (not cumulative).
export function xpForLevel(level: number): number {
  if (level < 1) return 0;
  const L = level;
  // Softer coefficients: lvl 5 ~180, 10 ~850, 20 ~5200, 30 ~15000, 50 ~72000.
  const val = 45 * Math.pow(L, 2) + 3.2 * Math.pow(L, 2.6) + 28 * L;
  return Math.round(val);
}

export function xpTotalForLevel(level: number): number {
  let sum = 0;
  for (let l = 1; l < level; l++) sum += xpForLevel(l);
  return sum;
}

export function levelFromTotalXp(totalXp: number): { level: number; xpIntoLevel: number; xpNeeded: number } {
  let level = 1;
  let remaining = totalXp;
  while (true) {
    const need = xpForLevel(level);
    if (remaining < need || level >= 100) {
      return { level, xpIntoLevel: remaining, xpNeeded: need };
    }
    remaining -= need;
    level++;
  }
}

export const MAX_LEVEL = 100;
export const POINTS_PER_LEVEL = 4;

// Base primary-stat budget per class at level 1.
export const CLASS_BASE: Record<ClassId, Record<StatId, number>> = {
  warden: { strength: 14, agility: 9, intellect: 5, vitality: 13, spirit: 6, luck: 3 },
  runesmith: { strength: 7, agility: 8, intellect: 14, vitality: 9, spirit: 11, luck: 3 },
  voidcaller: { strength: 5, agility: 10, intellect: 13, vitality: 7, spirit: 13, luck: 4 },
  beastbound: { strength: 9, agility: 13, intellect: 7, vitality: 10, spirit: 9, luck: 4 },
};

export const CLASS_CONFIG: Record<ClassId, { name: string; emoji: string; color: string }> = {
  warden: { name: "Страж", emoji: "🛡️", color: "#f4b740" },
  runesmith: { name: "Руновед", emoji: "🔨", color: "#60a5fa" },
  voidcaller: { name: "Зовущий Бездну", emoji: "🌀", color: "#c084fc" },
  beastbound: { name: "Зверолов", emoji: "🐺", color: "#22d3ee" },
};

export const CLASS_META: Record<
  ClassId,
  { name: string; tagline: string; weapon: string; armor: string; palette: string }
> = {
  warden: {
    name: "Страж",
    tagline: "Щит и сталь. Ломает строй.",
    weapon: "Тяжёлое оружие",
    armor: "Тяжёлая броня",
    palette: "#f4b740",
  },
  runesmith: {
    name: "Руновед",
    tagline: "Магия металла и рун.",
    weapon: "Молот/Посох",
    armor: "Средняя броня",
    palette: "#60a5fa",
  },
  voidcaller: {
    name: "Зовущий Бездну",
    tagline: "Проклятия, порча, тени.",
    weapon: "Посох/Фолиант",
    armor: "Ткань",
    palette: "#c084fc",
  },
  beastbound: {
    name: "Связанный зверь",
    tagline: "Призывает питомцев, бьёт в ближнем бою.",
    weapon: "Когти/Лук",
    armor: "Лёгкая броня",
    palette: "#14f1c1",
  },
};

// Hardcore death penalties.
export const DEATH_PENALTY = {
  softXpLossPct: 0.15, // 15% of current-level XP on death in normal mode
  softGoldLossPct: 0.25,
  hardcorePermadeath: true, // in hardcore, character is retired and gear is dropped to a "graveyard"
  durabilityLossOnDeath: 0.4, // all equipped gear loses 40% durability
};
