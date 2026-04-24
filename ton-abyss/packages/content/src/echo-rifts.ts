// Echo Rifts — endgame replayable content.
// After the main story is cleared, players generate "rifts" with random affixes.
// Higher tier rifts = higher rewards, more punishing modifiers.
// Pity drops a guaranteed mythic+ piece every 10 cleared rifts.

import type { ElementId, RarityId } from "@ton-abyss/shared";

export interface EchoRiftAffix {
  id: string;
  ru: string;
  description: string;
  // Multipliers/flags applied at combat start.
  enemyHpMult?: number;
  enemyDmgMult?: number;
  enemyCritChance?: number;
  enemySpeedMult?: number;
  enemyResist?: { element: ElementId; amount: number };
  playerHpMult?: number;
  playerHealReduction?: number;
  // Reward modifiers.
  goldMult?: number;
  xpMult?: number;
  lootQualityMult?: number;
  lootQuantityMult?: number;
}

export const ECHO_RIFT_AFFIXES: Record<string, EchoRiftAffix> = {
  era_brutal:      { id: "era_brutal",      ru: "Жестокие",      description: "+50% урона врагов.", enemyDmgMult: 1.5, goldMult: 1.15, lootQualityMult: 1.1 },
  era_fortified:   { id: "era_fortified",   ru: "Укреплённые",   description: "+80% HP врагов.",     enemyHpMult: 1.8, xpMult: 1.2, lootQuantityMult: 1.15 },
  era_swift:       { id: "era_swift",       ru: "Стремительные", description: "+30% скорости врагов.", enemySpeedMult: 1.3, goldMult: 1.1 },
  era_lethal:      { id: "era_lethal",      ru: "Смертоносные",  description: "+25% крит. шанса врагов.", enemyCritChance: 0.25, lootQualityMult: 1.2 },
  era_drain:       { id: "era_drain",       ru: "Истощающие",    description: "Лечение -50%.", playerHealReduction: 0.5, lootQualityMult: 1.15 },
  era_fragile:     { id: "era_fragile",     ru: "Хрупкие узы",   description: "-25% HP игрока.", playerHpMult: 0.75, goldMult: 1.25, xpMult: 1.25 },
  era_inferno:     { id: "era_inferno",     ru: "Инферно",       description: "+75% сопротивления огню.", enemyResist: { element: "fire", amount: 0.75 }, lootQualityMult: 1.1 },
  era_glacial:     { id: "era_glacial",     ru: "Ледник",        description: "+75% сопротивления льду.", enemyResist: { element: "frost", amount: 0.75 }, lootQualityMult: 1.1 },
  era_void_touched:{ id: "era_void_touched",ru: "Опороченные",   description: "+75% сопротивления Бездне.", enemyResist: { element: "void", amount: 0.75 }, lootQualityMult: 1.1 },
  era_overflow:    { id: "era_overflow",    ru: "Изобилие",      description: "+50% золота, +30% к качеству.", goldMult: 1.5, lootQualityMult: 1.3 },
  era_resonance:   { id: "era_resonance",   ru: "Резонанс",      description: "+40% опыта, +20% количества.", xpMult: 1.4, lootQuantityMult: 1.2 },
  era_void_storm:  { id: "era_void_storm",  ru: "Буря Бездны",   description: "Все эффекты усилены.", enemyDmgMult: 1.25, enemyHpMult: 1.25, lootQualityMult: 1.4, xpMult: 1.3 },
};

export const ECHO_RIFT_AFFIX_LIST = Object.values(ECHO_RIFT_AFFIXES);

export interface EchoRiftTier {
  tier: number;
  ru: string;
  levelMin: number;
  affixCount: number;
  // Boss difficulty multiplier on top of affixes.
  baseHpMult: number;
  baseDmgMult: number;
  // Base rewards before affix modifiers.
  baseGold: number;
  baseXp: number;
  // Rarity floor for guaranteed item drop.
  rarityFloor: RarityId;
}

export const ECHO_RIFT_TIERS: EchoRiftTier[] = [
  { tier: 1,  ru: "Тир I",    levelMin: 25, affixCount: 1, baseHpMult: 1.5, baseDmgMult: 1.3, baseGold: 800,   baseXp: 600,   rarityFloor: "rare" },
  { tier: 2,  ru: "Тир II",   levelMin: 30, affixCount: 1, baseHpMult: 1.8, baseDmgMult: 1.5, baseGold: 1200,  baseXp: 900,   rarityFloor: "rare" },
  { tier: 3,  ru: "Тир III",  levelMin: 35, affixCount: 2, baseHpMult: 2.2, baseDmgMult: 1.8, baseGold: 1800,  baseXp: 1300,  rarityFloor: "epic" },
  { tier: 4,  ru: "Тир IV",   levelMin: 40, affixCount: 2, baseHpMult: 2.7, baseDmgMult: 2.1, baseGold: 2500,  baseXp: 1800,  rarityFloor: "epic" },
  { tier: 5,  ru: "Тир V",    levelMin: 45, affixCount: 3, baseHpMult: 3.3, baseDmgMult: 2.5, baseGold: 3500,  baseXp: 2400,  rarityFloor: "legendary" },
  { tier: 6,  ru: "Тир VI",   levelMin: 50, affixCount: 3, baseHpMult: 4.0, baseDmgMult: 3.0, baseGold: 5000,  baseXp: 3200,  rarityFloor: "legendary" },
  { tier: 7,  ru: "Тир VII",  levelMin: 55, affixCount: 3, baseHpMult: 5.0, baseDmgMult: 3.5, baseGold: 7000,  baseXp: 4200,  rarityFloor: "legendary" },
  { tier: 8,  ru: "Тир VIII", levelMin: 60, affixCount: 4, baseHpMult: 6.5, baseDmgMult: 4.0, baseGold: 10000, baseXp: 5500,  rarityFloor: "mythic" },
  { tier: 9,  ru: "Тир IX",   levelMin: 65, affixCount: 4, baseHpMult: 8.5, baseDmgMult: 4.7, baseGold: 14000, baseXp: 7500,  rarityFloor: "mythic" },
  { tier: 10, ru: "Тир X",    levelMin: 70, affixCount: 5, baseHpMult: 11.0, baseDmgMult: 5.5, baseGold: 20000, baseXp: 10500, rarityFloor: "mythic" },
];

export const ECHO_RIFT_PITY_INTERVAL = 10; // every 10 clears = guaranteed mythic+

export function rollEchoRiftAffixes(tier: EchoRiftTier, rng: () => number): EchoRiftAffix[] {
  const pool = [...ECHO_RIFT_AFFIX_LIST];
  const out: EchoRiftAffix[] = [];
  for (let i = 0; i < tier.affixCount && pool.length; i++) {
    const idx = Math.floor(rng() * pool.length);
    const picked = pool.splice(idx, 1)[0];
    if (picked) out.push(picked);
  }
  return out;
}
