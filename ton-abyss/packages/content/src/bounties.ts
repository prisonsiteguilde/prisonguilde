// Bounties — daily rotating mini-quests.
export interface BountyDef {
  id: string;
  name: string;
  description: string;
  kind: "kill_monster" | "kill_boss" | "clear_dungeon" | "craft_item" | "salvage" | "reach_floor" | "win_arena" | "equip_rarity" | "spend_gold";
  target: string;
  amount: number;
  difficulty: 1 | 2 | 3 | 4 | 5; // affects rewards
  faction?: string;
  rewards: {
    gold: number;
    xp: number;
    reputation?: { factionId: string; amount: number };
    dust?: number;
    shards?: number;
    itemBaseId?: string;
  };
  expiresAfterHours: number;
}

export const BOUNTIES_POOL: BountyDef[] = [
  { id: "bnt_skel_wave", name: "Зачистить склеп", description: "Убить 20 скелетов.", kind: "kill_monster", target: "mon_skeleton", amount: 20, difficulty: 1, faction: "order_of_light", rewards: { gold: 400, xp: 250, reputation: { factionId: "order_of_light", amount: 30 } }, expiresAfterHours: 24 },
  { id: "bnt_ice_sprite", name: "Ледяной контракт", description: "Убить 15 ледяных спрайтов.", kind: "kill_monster", target: "mon_frost_sprite", amount: 15, difficulty: 2, faction: "free_hunters", rewards: { gold: 800, xp: 500, reputation: { factionId: "free_hunters", amount: 40 } }, expiresAfterHours: 24 },
  { id: "bnt_hellhound", name: "Псы Ада", description: "Убить 10 инфернальных псов.", kind: "kill_monster", target: "mon_hellhound", amount: 10, difficulty: 3, rewards: { gold: 1400, xp: 900, dust: 15 }, expiresAfterHours: 24 },
  { id: "bnt_void_hunter", name: "Охота на тени", description: "Убить 8 теневых зверей.", kind: "kill_monster", target: "mon_shadow_beast", amount: 8, difficulty: 4, faction: "free_hunters", rewards: { gold: 2200, xp: 1400, reputation: { factionId: "free_hunters", amount: 60 }, dust: 25 }, expiresAfterHours: 24 },
  { id: "bnt_craft_run", name: "Пробная партия", description: "Скрафтить 3 предмета.", kind: "craft_item", target: "any", amount: 3, difficulty: 2, faction: "smiths_guild", rewards: { gold: 500, xp: 200, reputation: { factionId: "smiths_guild", amount: 50 } }, expiresAfterHours: 24 },
  { id: "bnt_salvage", name: "Утилизация", description: "Разобрать 10 предметов.", kind: "salvage", target: "any", amount: 10, difficulty: 1, faction: "smiths_guild", rewards: { gold: 250, xp: 100, reputation: { factionId: "smiths_guild", amount: 30 }, dust: 20 }, expiresAfterHours: 24 },
  { id: "bnt_tower_10", name: "Восхождение", description: "Подняться на 10-й этаж Башни.", kind: "reach_floor", target: "tower", amount: 10, difficulty: 3, rewards: { gold: 1800, xp: 1200, dust: 30 }, expiresAfterHours: 48 },
  { id: "bnt_tower_25", name: "Глубокое восхождение", description: "Подняться на 25-й этаж Башни.", kind: "reach_floor", target: "tower", amount: 25, difficulty: 5, rewards: { gold: 6500, xp: 4500, dust: 80, shards: 5 }, expiresAfterHours: 72 },
  { id: "bnt_arena_3", name: "Три победы", description: "Выиграть 3 боя на арене.", kind: "win_arena", target: "arena", amount: 3, difficulty: 2, rewards: { gold: 900, xp: 600, shards: 2 }, expiresAfterHours: 24 },
  { id: "bnt_clear_crypt", name: "Зачистка склепа", description: "Пройти 'Заброшенный склеп' 3 раза.", kind: "clear_dungeon", target: "dungeon_crypt_1", amount: 3, difficulty: 1, rewards: { gold: 600, xp: 400 }, expiresAfterHours: 24 },
  { id: "bnt_boss_kill", name: "Охота на бюбля", description: "Убить любого босса.", kind: "kill_boss", target: "any", amount: 1, difficulty: 3, faction: "free_hunters", rewards: { gold: 2500, xp: 1600, reputation: { factionId: "free_hunters", amount: 80 }, dust: 40 }, expiresAfterHours: 24 },
  { id: "bnt_spend_1k", name: "Инвестор", description: "Потратить 1000 золота в кузне/лавке.", kind: "spend_gold", target: "any", amount: 1000, difficulty: 1, rewards: { gold: 300, xp: 150 }, expiresAfterHours: 24 },
];

export const BOUNTY_REROLL_COST = 150;
export const BOUNTIES_PER_DAY = 5;
