import type { Player, Profession } from "./types.js";

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(120 * (level - 1) ** 1.72 + 80 * (level - 1));
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (level < 50 && xp >= xpForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

export function prestigeRequirement(prestige: number): number {
  return 50 + prestige * 5;
}

export function craftingLevelFromXp(xp: number): number {
  let level = 1;
  while (level < 50 && xp >= Math.floor(90 * level ** 1.65)) {
    level += 1;
  }
  return level;
}

export function addXp(player: Player, amount: number): Player {
  const xp = player.xp + Math.max(0, Math.floor(amount));
  const nextLevel = levelFromXp(xp);
  const gainedLevels = Math.max(0, nextLevel - player.level);
  return {
    ...player,
    xp,
    level: nextLevel,
    skillPoints: player.skillPoints + gainedLevels,
    bonusPoints: player.bonusPoints + Math.floor(nextLevel / 10) - Math.floor(player.level / 10),
    stats: {
      ...player.stats,
      maxHp: 100 + nextLevel * 14 + player.prestige * 30,
      hp: Math.min(player.stats.hp + gainedLevels * 14, 100 + nextLevel * 14 + player.prestige * 30)
    },
    updatedAt: new Date().toISOString()
  };
}

export function addProfessionXp(player: Player, profession: Profession, amount: number): Player {
  const current = player.professions[profession];
  const xp = current.xp + amount;
  const level = craftingLevelFromXp(xp);
  return {
    ...player,
    professions: {
      ...player.professions,
      [profession]: {
        ...current,
        xp,
        level
      }
    },
    updatedAt: new Date().toISOString()
  };
}
