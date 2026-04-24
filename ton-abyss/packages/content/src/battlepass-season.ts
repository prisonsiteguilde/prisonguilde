import type { BattlePassSeasonDef } from "@ton-abyss/shared";
import { buildDefaultBattlePassTiers } from "@ton-abyss/shared";

const NOW = Date.now();
const DAY = 1000 * 60 * 60 * 24;

export const CURRENT_SEASON: BattlePassSeasonDef = {
  id: "season_01_abyssal_awakening",
  name: "Сезон 1: Пробуждение Бездны",
  description: "Первый сезон TON Abyss. Пройди 50 уровней и получи эксклюзивного скакуна.",
  startAt: NOW,
  endAt: NOW + 30 * DAY,
  premiumPriceShards: 750,
  premiumPriceTon: 2.5,
  tiers: buildDefaultBattlePassTiers(),
};
