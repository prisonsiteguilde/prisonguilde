// Battle Pass system. Sezon = 30 days. 50 levels. Free + Premium tracks.

export interface BattlePassReward {
  kind: "gold" | "shards" | "abyss_dust" | "lootbox" | "item" | "pet" | "mount" | "skill_point" | "transmog" | "title" | "rune";
  baseId?: string;
  amount?: number;
  rarity?: string;
  premium?: boolean;
}

export interface BattlePassTier {
  level: number;
  xpRequired: number;     // cumulative
  freeReward?: BattlePassReward;
  premiumReward?: BattlePassReward;
}

export interface BattlePassSeasonDef {
  id: string;
  name: string;
  description: string;
  startAt: number;
  endAt: number;
  premiumPriceShards: number;
  premiumPriceTon: number;
  tiers: BattlePassTier[];
}

export interface BattlePassProgress {
  seasonId: string;
  xp: number;
  level: number;
  premium: boolean;
  claimedFree: number[];   // tier indices
  claimedPremium: number[];
}

// Daily/Weekly missions for BP xp
export interface BattlePassMissionDef {
  id: string;
  name: string;
  description: string;
  kind: "daily" | "weekly";
  objective: {
    type:
      | "kill_monsters"
      | "kill_bosses"
      | "clear_dungeons"
      | "spend_gold"
      | "craft_items"
      | "win_arena"
      | "open_lootboxes"
      | "feed_pet"
      | "complete_bounty"
      | "tower_floors"
      | "deal_damage"
      | "use_ability";
    target?: string;
    amount: number;
  };
  rewardXp: number;
  flavor?: string;
}

export interface BattlePassMissionState {
  missionId: string;
  current: number;
  completed: boolean;
  claimed: boolean;
  resetAt: number;
}

// Curve: tier N requires roughly 1000 + 200*N xp. Total ~50 tiers ≈ 285k xp.
export function buildDefaultBattlePassTiers(): BattlePassTier[] {
  const tiers: BattlePassTier[] = [];
  let cumulative = 0;
  for (let lvl = 1; lvl <= 50; lvl++) {
    cumulative += 1000 + 200 * lvl;
    const free = mkFreeReward(lvl);
    const premium = mkPremiumReward(lvl);
    tiers.push({ level: lvl, xpRequired: cumulative, freeReward: free, premiumReward: premium });
  }
  return tiers;
}

function mkFreeReward(lvl: number): BattlePassReward {
  if (lvl === 50) return { kind: "lootbox", baseId: "lb_abyss", amount: 1 };
  if (lvl === 25) return { kind: "lootbox", baseId: "lb_gold", amount: 1 };
  if (lvl % 10 === 0) return { kind: "abyss_dust", amount: 50 + lvl };
  if (lvl % 5 === 0) return { kind: "shards", amount: 25 + lvl };
  return { kind: "gold", amount: 200 * lvl };
}

function mkPremiumReward(lvl: number): BattlePassReward {
  if (lvl === 50) return { kind: "mount", baseId: "mount_abyssal_drake", premium: true };
  if (lvl === 40) return { kind: "pet", baseId: "pet_void_phoenix", premium: true };
  if (lvl === 30) return { kind: "transmog", baseId: "tm_abyssal_armor", premium: true };
  if (lvl === 20) return { kind: "lootbox", baseId: "lb_abyss", amount: 1, premium: true };
  if (lvl === 10) return { kind: "title", baseId: "title_void_blessed", premium: true };
  if (lvl % 5 === 0) return { kind: "lootbox", baseId: "lb_gold", amount: 1, premium: true };
  if (lvl % 3 === 0) return { kind: "skill_point", amount: 1, premium: true };
  return { kind: "shards", amount: 50 + lvl * 2, premium: true };
}

export const DEFAULT_DAILY_MISSIONS: BattlePassMissionDef[] = [
  { id: "bm_d_kill_30",       name: "Истребитель",     description: "Убей 30 монстров.",                     kind: "daily", objective: { type: "kill_monsters", amount: 30 }, rewardXp: 600 },
  { id: "bm_d_clear_2",       name: "Зачистка",        description: "Зачисти 2 данжа.",                      kind: "daily", objective: { type: "clear_dungeons", amount: 2 }, rewardXp: 800 },
  { id: "bm_d_boss_1",        name: "Охота на босса",  description: "Убей босса.",                           kind: "daily", objective: { type: "kill_bosses", amount: 1 }, rewardXp: 700 },
  { id: "bm_d_craft_3",       name: "Кузнечный пыл",   description: "Скрафти 3 предмета.",                   kind: "daily", objective: { type: "craft_items", amount: 3 }, rewardXp: 500 },
  { id: "bm_d_lootbox_1",     name: "Удача",           description: "Открой 1 лутбокс.",                     kind: "daily", objective: { type: "open_lootboxes", amount: 1 }, rewardXp: 400 },
  { id: "bm_d_feed_pet",      name: "Кормилец",        description: "Покорми питомца 3 раза.",               kind: "daily", objective: { type: "feed_pet", amount: 3 }, rewardXp: 350 },
  { id: "bm_d_arena_2",       name: "Дуэлянт",         description: "Победи 2 раза на арене.",               kind: "daily", objective: { type: "win_arena", amount: 2 }, rewardXp: 700 },
  { id: "bm_d_tower_5",       name: "Восхождение",     description: "Пройди 5 этажей башни.",                kind: "daily", objective: { type: "tower_floors", amount: 5 }, rewardXp: 600 },
];

export const DEFAULT_WEEKLY_MISSIONS: BattlePassMissionDef[] = [
  { id: "bm_w_kill_300",      name: "Бойня недели",    description: "Убей 300 монстров за неделю.",          kind: "weekly", objective: { type: "kill_monsters", amount: 300 }, rewardXp: 4000 },
  { id: "bm_w_boss_10",       name: "Истребитель боссов", description: "Убей 10 боссов.",                    kind: "weekly", objective: { type: "kill_bosses", amount: 10 }, rewardXp: 5000 },
  { id: "bm_w_dungeons_15",   name: "Дозорный",        description: "Зачисти 15 данжей.",                    kind: "weekly", objective: { type: "clear_dungeons", amount: 15 }, rewardXp: 5000 },
  { id: "bm_w_lootbox_15",    name: "Коллекционер",    description: "Открой 15 лутбоксов.",                  kind: "weekly", objective: { type: "open_lootboxes", amount: 15 }, rewardXp: 3500 },
  { id: "bm_w_arena_10",      name: "Чемпион арены",   description: "Победи 10 раз на арене.",               kind: "weekly", objective: { type: "win_arena", amount: 10 }, rewardXp: 4500 },
  { id: "bm_w_tower_30",      name: "Покоритель башни", description: "Пройди 30 этажей башни.",              kind: "weekly", objective: { type: "tower_floors", amount: 30 }, rewardXp: 4500 },
  { id: "bm_w_craft_25",      name: "Мастер кузнец",   description: "Скрафти 25 предметов.",                 kind: "weekly", objective: { type: "craft_items", amount: 25 }, rewardXp: 3500 },
];

export function levelFromBpXp(xp: number, tiers: BattlePassTier[]): number {
  let lvl = 0;
  for (const t of tiers) {
    if (xp >= t.xpRequired) lvl = t.level;
    else break;
  }
  return lvl;
}
