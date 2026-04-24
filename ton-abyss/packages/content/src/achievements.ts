import type { AchievementDef } from "@ton-abyss/shared";

export const ACHIEVEMENTS: Record<string, AchievementDef> = {
  // Combat
  ach_first_blood: { id: "ach_first_blood", name: "Первая кровь", description: "Убейте первого монстра.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 0 }, reward: { gold: 50, xp: 50 }, points: 5 },
  ach_boss_slayer_1: { id: "ach_boss_slayer_1", name: "Охотник на боссов I", description: "Победите 1 босса.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 200, xp: 300 }, points: 10 },
  ach_boss_slayer_5: { id: "ach_boss_slayer_5", name: "Охотник на боссов V", description: "Победите 5 боссов.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 5 }, reward: { gold: 1200, xp: 1800, abyssDust: 20 }, points: 25 },
  ach_boss_slayer_25: { id: "ach_boss_slayer_25", name: "Охотник на боссов XXV", description: "Победите 25 боссов.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 25 }, reward: { gold: 12000, xp: 18000, shards: 10 }, points: 100 },
  ach_titan_slayer: { id: "ach_titan_slayer", name: "Поражение Титана", description: "Убейте Титана Бездны.", category: "combat", condition: { kind: "boss_killed", target: "boss_abyss_titan", amount: 1 }, reward: { gold: 40000, xp: 80000, shards: 50, title: "Убийца Титана" }, points: 500 },

  // Exploration
  ach_first_dungeon: { id: "ach_first_dungeon", name: "Первый шаг в бездну", description: "Зачистите 1 данж.", category: "exploration", condition: { kind: "dungeon_cleared", target: "any", amount: 1 }, reward: { gold: 100, xp: 100 }, points: 5 },
  ach_crypt_clear: { id: "ach_crypt_clear", name: "Склеп покорён", description: "Зачистите Заброшенный склеп.", category: "exploration", condition: { kind: "dungeon_cleared", target: "dng_crypt_01", amount: 1 }, reward: { gold: 200, xp: 400 }, points: 10 },
  ach_ice_clear: { id: "ach_ice_clear", name: "Холод не сломит", description: "Зачистите Ледяные пещеры.", category: "exploration", condition: { kind: "dungeon_cleared", target: "dng_ice_01", amount: 1 }, reward: { gold: 600, xp: 1200 }, points: 15 },
  ach_infernal_clear: { id: "ach_infernal_clear", name: "Пламя не обжигает", description: "Зачистите Преисподнюю.", category: "exploration", condition: { kind: "dungeon_cleared", target: "dng_infernal_01", amount: 1 }, reward: { gold: 2400, xp: 4800 }, points: 25 },
  ach_abyss_clear: { id: "ach_abyss_clear", name: "Бездна покорена", description: "Зачистите Врата Бездны.", category: "exploration", condition: { kind: "dungeon_cleared", target: "dng_abyss_01", amount: 1 }, reward: { gold: 20000, xp: 40000, shards: 30, title: "Покоритель Бездны" }, points: 150 },
  ach_dungeon_100: { id: "ach_dungeon_100", name: "Сто раз туда и обратно", description: "Зачистите 100 данжей.", category: "exploration", condition: { kind: "dungeon_cleared", target: "any", amount: 100 }, reward: { gold: 50000, xp: 60000, shards: 40 }, points: 200 },

  // Progression
  ach_level_10: { id: "ach_level_10", name: "Опытный", description: "Достигните 10 уровня.", category: "progression", condition: { kind: "level_reached", target: "any", amount: 10 }, reward: { gold: 500, xp: 0, skillPoints: 1 }, points: 10 },
  ach_level_25: { id: "ach_level_25", name: "Ветеран", description: "Достигните 25 уровня.", category: "progression", condition: { kind: "level_reached", target: "any", amount: 25 }, reward: { gold: 3000, skillPoints: 2 }, points: 30 },
  ach_level_50: { id: "ach_level_50", name: "Легенда", description: "Достигните 50 уровня.", category: "progression", condition: { kind: "level_reached", target: "any", amount: 50 }, reward: { gold: 20000, shards: 20, skillPoints: 3, title: "Легенда" }, points: 100 },
  ach_level_80: { id: "ach_level_80", name: "Запредельный", description: "Достигните 80 уровня.", category: "progression", condition: { kind: "level_reached", target: "any", amount: 80 }, reward: { gold: 100000, shards: 50, skillPoints: 5, title: "Запредельный" }, points: 400 },

  // Economy
  ach_gold_10k: { id: "ach_gold_10k", name: "Первый капитал", description: "Заработайте 10 000 золота.", category: "progression", condition: { kind: "gold_earned_total", target: "any", amount: 10000 }, reward: { xp: 1000 }, points: 15 },
  ach_gold_1m: { id: "ach_gold_1m", name: "Миллионер", description: "Заработайте 1 000 000 золота.", category: "progression", condition: { kind: "gold_earned_total", target: "any", amount: 1000000 }, reward: { shards: 100, title: "Миллионер" }, points: 250 },

  // Collection
  ach_loot_100: { id: "ach_loot_100", name: "Коллекционер", description: "Получите 100 предметов.", category: "collection", condition: { kind: "items_looted_total", target: "any", amount: 100 }, reward: { gold: 2000 }, points: 15 },
  ach_loot_1000: { id: "ach_loot_1000", name: "Собиратель сокровищ", description: "Получите 1000 предметов.", category: "collection", condition: { kind: "items_looted_total", target: "any", amount: 1000 }, reward: { gold: 30000, shards: 10 }, points: 80 },
  ach_epic_find: { id: "ach_epic_find", name: "Эпический найдёныш", description: "Найдите эпический предмет.", category: "collection", condition: { kind: "rarity_found", target: "epic", amount: 1 }, reward: { gold: 500 }, points: 10 },
  ach_legendary_find: { id: "ach_legendary_find", name: "Легендарный найдёныш", description: "Найдите легендарный предмет.", category: "collection", condition: { kind: "rarity_found", target: "legendary", amount: 1 }, reward: { gold: 2500, shards: 5 }, points: 50 },
  ach_mythic_find: { id: "ach_mythic_find", name: "Мифический найдёныш", description: "Найдите мифический предмет.", category: "collection", condition: { kind: "rarity_found", target: "mythic", amount: 1 }, reward: { gold: 10000, shards: 15, title: "Мифолог" }, points: 100 },
  ach_abyssal_find: { id: "ach_abyssal_find", name: "Бездонный найдёныш", description: "Найдите абиссальный предмет.", category: "collection", condition: { kind: "rarity_found", target: "abyssal", amount: 1 }, reward: { gold: 50000, shards: 40, title: "Избранник Бездны" }, points: 500 },

  // Craft
  ach_craft_1: { id: "ach_craft_1", name: "Первое творение", description: "Скрафтите 1 предмет.", category: "craft", condition: { kind: "items_looted_total", target: "crafted", amount: 1 }, reward: { gold: 100 }, points: 5 },
  ach_upgrade_5: { id: "ach_upgrade_5", name: "+5", description: "Усильте предмет до +5.", category: "craft", condition: { kind: "upgrade_level_reached", target: "any", amount: 5 }, reward: { gold: 500, abyssDust: 10 }, points: 20 },
  ach_upgrade_10: { id: "ach_upgrade_10", name: "+10", description: "Усильте предмет до +10.", category: "craft", condition: { kind: "upgrade_level_reached", target: "any", amount: 10 }, reward: { gold: 5000, abyssDust: 40 }, points: 60 },
  ach_upgrade_15: { id: "ach_upgrade_15", name: "+15", description: "Усильте предмет до максимума (+15).", category: "craft", condition: { kind: "upgrade_level_reached", target: "any", amount: 15 }, reward: { gold: 50000, abyssDust: 200, shards: 20, title: "Мастер усиления" }, points: 300 },

  // Pets
  ach_first_pet: { id: "ach_first_pet", name: "Первый спутник", description: "Получите первого питомца.", category: "collection", condition: { kind: "pet_hatched", target: "any", amount: 1 }, reward: { gold: 300 }, points: 10 },
  ach_pet_5: { id: "ach_pet_5", name: "Кинолог", description: "Выведите 5 питомцев.", category: "collection", condition: { kind: "pet_hatched", target: "any", amount: 5 }, reward: { gold: 5000, shards: 10, title: "Укротитель" }, points: 80 },

  // Skills
  ach_skill_5: { id: "ach_skill_5", name: "Ученик", description: "Вложите 5 очков в дерево навыков.", category: "progression", condition: { kind: "skill_rank_total", target: "any", amount: 5 }, reward: { gold: 500 }, points: 10 },
  ach_skill_20: { id: "ach_skill_20", name: "Мастер", description: "Вложите 20 очков в дерево навыков.", category: "progression", condition: { kind: "skill_rank_total", target: "any", amount: 20 }, reward: { gold: 5000, skillPoints: 1 }, points: 40 },

  // Hardcore
  ach_hc_streak_10: { id: "ach_hc_streak_10", name: "Хардкор-серия 10", description: "10 данжей подряд без смерти в режиме Хардкор.", category: "hardcore", condition: { kind: "hardcore_streak", target: "any", amount: 10 }, reward: { gold: 20000, shards: 20, title: "Непреклонный" }, points: 150 },
  ach_hc_streak_50: { id: "ach_hc_streak_50", name: "Хардкор-серия 50", description: "50 данжей подряд без смерти в режиме Хардкор.", category: "hardcore", condition: { kind: "hardcore_streak", target: "any", amount: 50 }, reward: { gold: 200000, shards: 100, title: "Легенда Хардкора" }, points: 800 },
};
