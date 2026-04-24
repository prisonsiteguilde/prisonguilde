// Core economy knobs — every soft number lives here so balance iterations are 1-file edits.
// Hardcore principle: tight drip of high-value resources, steep sinks for progression.

export const ECONOMY = {
  // Starting bundles.
  START_GOLD: 50,
  START_SHARDS: 0,
  START_ABYSS_DUST: 0,

  // Core sinks.
  REVIVE_COST_GOLD: 1000, // non-hardcore only
  REROLL_AFFIX_SHARDS: 12,
  REROLL_AFFIX_DUST: 4,
  RESET_STATS_SHARDS: 80,

  // Shop.
  SHOP_BUY_MARKUP: 3.5, // sell 100 -> buy 350
  SHOP_SELL_MULT: 1.0, // baseline sellValue
  SHOP_RESTOCK_SECONDS: 900,

  // Gold/xp from dungeons (multiplied by floor difficulty).
  GOLD_PER_FLOOR: 35,
  XP_PER_FLOOR: 90,

  // TON integration (store-of-value premium currency).
  TON_TO_SHARD: 2500, // 1 TON -> 2500 shards (cosmetics/QoL only, NEVER power)
  TON_BATTLEPASS: 1.5, // 1.5 TON per pass
  TON_STASH_EXPAND: 0.3, // 0.3 TON for +20 stash slots

  // Hard caps / softcaps.
  MAX_GOLD: 100_000_000,
  MAX_STASH: 200, // expandable via premium
  MAX_ACTIVE_PETS: 2,
  DAILY_FREE_RUNS: 5, // limits nolifing

  // Drop rates for on-chain NFT pets (mythic+ conversion).
  MYTHIC_PET_NFT_MINT_COST_DUST: 2500,
};

export const DIFFICULTY_CURVE = [
  // per-difficulty global multipliers (1..7)
  { tier: 1, name: "Обычно", monsterHp: 1.0, monsterDmg: 1.0, loot: 1.0, quality: 1.0 },
  { tier: 2, name: "Сложно", monsterHp: 1.35, monsterDmg: 1.3, loot: 1.2, quality: 1.1 },
  { tier: 3, name: "Героически", monsterHp: 1.85, monsterDmg: 1.65, loot: 1.5, quality: 1.25 },
  { tier: 4, name: "Эпично", monsterHp: 2.6, monsterDmg: 2.1, loot: 1.85, quality: 1.45 },
  { tier: 5, name: "Мифически", monsterHp: 3.8, monsterDmg: 2.7, loot: 2.25, quality: 1.75 },
  { tier: 6, name: "Кошмар", monsterHp: 5.6, monsterDmg: 3.6, loot: 2.8, quality: 2.1 },
  { tier: 7, name: "Бездна", monsterHp: 9.0, monsterDmg: 5.0, loot: 3.5, quality: 2.6 },
] as const;
