import type { ChestDefinition, CraftRecipe, DamageType, EnemyDefinition, ItemDefinition, MoveDefinition, Rarity, StatBlock } from "./types.js";

export const rarityRank: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6
};

export const rarityLabel: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic"
};

export const damageTypeLabel: Record<DamageType, string> = {
  piercing: "Колющий",
  slashing: "Рубящий",
  crushing: "Дробящий",
  firearm: "Огнестрельный",
  fire: "Огонь",
  poison: "Яд"
};

export const islands = [
  { id: "tortuga", name: "Тортуга", minLevel: 1, theme: "Контрабанда, таверны, первые дуэли" },
  { id: "santa-catalina", name: "Санта-Каталина", minLevel: 8, theme: "Королевские форты и политические интриги" },
  { id: "isla-muerte", name: "Исла-де-Муэрте", minLevel: 15, theme: "Проклятая нежить, алхимия и реликварий" },
  { id: "bahama-key", name: "Багама-Ки", minLevel: 22, theme: "Рыбалка, торговля, офицеры флота" },
  { id: "port-royal", name: "Порт-Рояль", minLevel: 28, theme: "Инквизиция, рынок Epic+, аукционы" },
  { id: "la-navidad", name: "Ла-Навидад", minLevel: 36, theme: "Ацтекские стражи, ягуары, храмы" },
  { id: "abyss", name: "Край Бездны", minLevel: 45, theme: "Эндгейм, Блэкхарт, Mythic-компоненты" }
] as const;

export const baseResistances: Record<DamageType, number> = {
  piercing: 0,
  slashing: 0,
  crushing: 0,
  firearm: 0,
  fire: 0,
  poison: 0
};

export function createBaseStats(level: number): StatBlock {
  return {
    hp: 100 + level * 14,
    maxHp: 100 + level * 14,
    stamina: level >= 30 ? 4 : 3,
    energy: 100,
    armor: Math.min(18 + level * 3, 280),
    accuracy: Math.min(62 + level * 0.55, 98),
    evasion: Math.min(5 + level * 0.45, 45),
    critChance: Math.min(7 + level * 0.35, 45),
    critMultiplier: 1.6 + Math.min(level * 0.012, 1.5),
    initiative: 20 + level * 1.6,
    crewPower: 10 + level * 4,
    charisma: 10 + level * 1.2,
    luck: Math.min(level * 0.3, 35),
    resistances: { ...baseResistances }
  };
}

export const moves: Record<string, MoveDefinition> = {
  thrust: {
    id: "thrust",
    name: "Выпад",
    description: "Точный колющий удар с бонусом к криту.",
    actionCost: 1,
    energyCost: 0,
    damageMultiplier: 1,
    damageType: "piercing",
    cooldown: 0
  },
  riposte: {
    id: "riposte",
    name: "Рипост",
    description: "Сильный ответный удар, эффективен против бронированных целей.",
    actionCost: 2,
    energyCost: 20,
    damageMultiplier: 1.55,
    damageType: "piercing",
    cooldown: 1,
    effects: [{ type: "aim", duration: 2, stacks: 1, power: 0.12 }]
  },
  slash: {
    id: "slash",
    name: "Абордажный рассекатель",
    description: "Рубящий удар с шансом кровотечения.",
    actionCost: 1,
    energyCost: 0,
    damageMultiplier: 1.12,
    damageType: "slashing",
    cooldown: 0,
    effects: [{ type: "bleed", duration: 2, stacks: 1, power: 0.1 }]
  },
  pistol: {
    id: "pistol",
    name: "Дуэльный выстрел",
    description: "Пробивает часть брони, требует перезарядки.",
    actionCost: 2,
    energyCost: 25,
    damageMultiplier: 1.75,
    damageType: "firearm",
    cooldown: 3
  },
  bomb: {
    id: "bomb",
    name: "Огненная бомба",
    description: "Поджигает цель и игнорирует часть защиты.",
    actionCost: 2,
    energyCost: 35,
    damageMultiplier: 1.3,
    damageType: "fire",
    cooldown: 2,
    effects: [{ type: "burn", duration: 3, stacks: 1, power: 0.12 }]
  },
  skullbreaker: {
    id: "skullbreaker",
    name: "Череполом",
    description: "Тяжёлый дробящий удар с шансом оглушения.",
    actionCost: 3,
    energyCost: 50,
    damageMultiplier: 2.2,
    damageType: "crushing",
    cooldown: 3,
    effects: [{ type: "stun", duration: 1, stacks: 1, power: 1 }]
  },
  harvest: {
    id: "harvest",
    name: "Кровавая жатва",
    description: "Legendary-финишер, добивает раненых врагов.",
    actionCost: 3,
    energyCost: 70,
    damageMultiplier: 3.1,
    damageType: "slashing",
    cooldown: 4,
    minTargetHpPercent: 45,
    effects: [{ type: "bleed", duration: 3, stacks: 2, power: 0.14 }]
  },
  abyssalHeart: {
    id: "abyssal-heart",
    name: "Сердце выжившего",
    description: "Mythic-приём: регенерация и проклятие врага.",
    actionCost: 3,
    energyCost: 100,
    damageMultiplier: 2.7,
    damageType: "poison",
    cooldown: 5,
    effects: [
      { type: "curse", duration: 3, stacks: 1, power: 0.15 },
      { type: "regen", duration: 3, stacks: 1, power: 0.05 }
    ]
  }
};

const move = (id: keyof typeof moves): MoveDefinition => {
  const definition = moves[id];
  if (!definition) throw new Error(`Move is not configured: ${String(id)}`);
  return definition;
};

export const items: ItemDefinition[] = [
  {
    id: "rusty-cutlass",
    name: "Ржавая абордажная сабля",
    kind: "weapon",
    rarity: "common",
    level: 1,
    value: 80,
    nftEligible: false,
    damage: { min: 28, max: 42, type: "slashing" },
    moves: [move("slash")],
    tags: ["starter", "sword"]
  },
  {
    id: "duelist-rapier",
    name: "Рапира дуэлянта",
    kind: "weapon",
    rarity: "rare",
    level: 8,
    value: 1600,
    nftEligible: false,
    damage: { min: 55, max: 82, type: "piercing" },
    moves: [move("thrust"), move("riposte")],
    stats: { accuracy: 9, critChance: 5 },
    tags: ["duelist", "piercing"]
  },
  {
    id: "blackheart-musketoon",
    name: "Мушкетон Блэкхарта",
    kind: "weapon",
    rarity: "legendary",
    level: 35,
    value: 180000,
    nftEligible: true,
    damage: { min: 180, max: 260, type: "firearm" },
    moves: [move("pistol"), move("bomb")],
    stats: { accuracy: 14, critChance: 12, critMultiplier: 0.5 },
    tags: ["legendary", "firearm", "blackheart"]
  },
  {
    id: "soul-reaper",
    name: "Жнец душ",
    kind: "weapon",
    rarity: "mythic",
    level: 46,
    value: 950000,
    nftEligible: true,
    damage: { min: 310, max: 380, type: "slashing" },
    moves: [move("slash"), move("harvest"), move("abyssalHeart")],
    stats: { critChance: 22, critMultiplier: 1.1, crewPower: 40 },
    tags: ["mythic", "endgame", "signature"]
  },
  {
    id: "tortuga-vest",
    name: "Кожаный жилет Тортуги",
    kind: "armor",
    rarity: "uncommon",
    level: 4,
    value: 550,
    nftEligible: false,
    stats: { armor: 18, evasion: 3, charisma: 2 },
    tags: ["armor", "light"]
  },
  {
    id: "abyss-heart-plate",
    name: "Сердце Бездны",
    kind: "armor",
    rarity: "mythic",
    level: 46,
    value: 780000,
    nftEligible: true,
    stats: { armor: 220, hp: 180, maxHp: 180 },
    tags: ["mythic", "armor", "survivor"]
  },
  { id: "iron-ore", name: "Железная руда", kind: "material", rarity: "common", level: 1, value: 35, nftEligible: false, tags: ["ore"] },
  { id: "coal", name: "Уголь", kind: "material", rarity: "common", level: 1, value: 20, nftEligible: false, tags: ["fuel"] },
  { id: "steel", name: "Сталь", kind: "material", rarity: "uncommon", level: 5, value: 180, nftEligible: false, tags: ["metal"] },
  { id: "tempered-steel", name: "Закалённая сталь", kind: "material", rarity: "rare", level: 12, value: 900, nftEligible: false, tags: ["metal", "upgrade"] },
  { id: "divinity-shard", name: "Осколок божества", kind: "material", rarity: "mythic", level: 45, value: 250000, nftEligible: true, tags: ["mythic", "relic"] },
  { id: "healing-elixir", name: "Лечебный эликсир", kind: "potion", rarity: "rare", level: 10, value: 700, nftEligible: false, tags: ["consumable", "alchemy"] },
  { id: "macaw-pet", name: "Попугай Ара", kind: "pet", rarity: "uncommon", level: 5, value: 3000, nftEligible: false, stats: { luck: 2 }, tags: ["pet", "air"] },
  { id: "silk-sails", name: "Шёлковые паруса", kind: "ship_upgrade", rarity: "epic", level: 25, value: 45000, nftEligible: false, stats: { initiative: 12, luck: 4 }, tags: ["ship", "sails"] }
];

export const recipes: CraftRecipe[] = [
  {
    id: "steel",
    name: "Сталь",
    profession: "blacksmith",
    requiredLevel: 1,
    durationSeconds: 30,
    xp: 24,
    inputs: [
      { itemId: "iron-ore", quantity: 3 },
      { itemId: "coal", quantity: 1 }
    ],
    output: { itemId: "steel", quantity: 1, superiorChance: 0 }
  },
  {
    id: "tempered-steel",
    name: "Закалённая сталь",
    profession: "blacksmith",
    requiredLevel: 10,
    durationSeconds: 120,
    xp: 110,
    inputs: [
      { itemId: "steel", quantity: 3 },
      { itemId: "coal", quantity: 3 }
    ],
    output: { itemId: "tempered-steel", quantity: 1, superiorChance: 0.02 }
  },
  {
    id: "duelist-rapier",
    name: "Рапира дуэлянта",
    profession: "blacksmith",
    requiredLevel: 12,
    durationSeconds: 240,
    xp: 240,
    inputs: [
      { itemId: "steel", quantity: 4 },
      { itemId: "tempered-steel", quantity: 1 }
    ],
    output: { itemId: "duelist-rapier", quantity: 1, superiorChance: 0.08 }
  },
  {
    id: "healing-elixir",
    name: "Лечебный эликсир",
    profession: "alchemist",
    requiredLevel: 8,
    durationSeconds: 90,
    xp: 95,
    inputs: [
      { itemId: "coal", quantity: 2 },
      { itemId: "iron-ore", quantity: 1 }
    ],
    output: { itemId: "healing-elixir", quantity: 2, superiorChance: 0.12 }
  },
  {
    id: "soul-reaper",
    name: "Жнец душ",
    profession: "relicsmith",
    requiredLevel: 46,
    durationSeconds: 86400,
    xp: 5000,
    inputs: [
      { itemId: "blackheart-musketoon", quantity: 1 },
      { itemId: "divinity-shard", quantity: 1 },
      { itemId: "tempered-steel", quantity: 30 }
    ],
    output: { itemId: "soul-reaper", quantity: 1, superiorChance: 0.2 }
  }
];

export const enemies: EnemyDefinition[] = [
  {
    id: "tavern-brawler",
    name: "Головорез таверны",
    level: 1,
    islandId: "tortuga",
    archetype: "duelist",
    stats: withHp(createBaseStats(1), 95, 8),
    vulnerabilities: { piercing: 1.3, slashing: 1.3, crushing: 1.3, firearm: 1, fire: 1, poison: 1 },
    moves: [move("slash")],
    rewards: { xp: 45, piastres: [80, 140], items: [{ itemId: "iron-ore", chance: 0.35, minQty: 1, maxQty: 2 }] }
  },
  {
    id: "crown-guard",
    name: "Гвардеец короны",
    level: 8,
    islandId: "santa-catalina",
    archetype: "guard",
    stats: withHp(createBaseStats(8), 260, 42),
    vulnerabilities: { piercing: 1.3, slashing: 0.7, crushing: 1, firearm: 1, fire: 1, poison: 0.8 },
    moves: [move("thrust"), move("riposte")],
    rewards: { xp: 180, piastres: [380, 720], items: [{ itemId: "steel", chance: 0.4, minQty: 1, maxQty: 2 }] }
  },
  {
    id: "undead-corsair",
    name: "Зомби-корсар",
    level: 17,
    islandId: "isla-muerte",
    archetype: "undead",
    stats: withHp(createBaseStats(17), 620, 78),
    vulnerabilities: { piercing: 0.7, slashing: 1, crushing: 1.3, firearm: 0.8, fire: 1.3, poison: 0 },
    moves: [move("slash"), move("skullbreaker")],
    rewards: { xp: 430, piastres: [900, 1600], items: [{ itemId: "tempered-steel", chance: 0.28, minQty: 1, maxQty: 2 }] }
  },
  {
    id: "blackheart",
    name: "Адмирал Блэкхарт",
    level: 45,
    islandId: "abyss",
    archetype: "boss",
    stats: withHp(createBaseStats(45), 4200, 210),
    vulnerabilities: { piercing: 1, slashing: 0.8, crushing: 1, firearm: 0.7, fire: 1.2, poison: 0.5 },
    moves: [move("pistol"), move("bomb"), move("harvest")],
    rewards: {
      xp: 12000,
      piastres: [24000, 42000],
      doubloons: [25, 55],
      items: [
        { itemId: "blackheart-musketoon", chance: 0.2, minQty: 1, maxQty: 1 },
        { itemId: "divinity-shard", chance: 0.05, minQty: 1, maxQty: 1 }
      ]
    }
  }
];

export const chests: ChestDefinition[] = [
  {
    id: "rookie",
    name: "Сундук новичка",
    price: {},
    dailyLimit: 1,
    pity: { epic: 20 },
    rolls: [
      { label: "Пиастры", chance: 1, itemIds: [], minPiastres: 300, maxPiastres: 800, minQty: 1, maxQty: 1 },
      { label: "Uncommon предмет", chance: 1, itemIds: ["tortuga-vest", "macaw-pet"], minQty: 1, maxQty: 1, minimumRarity: "uncommon" },
      { label: "Rare шанс", chance: 0.5, itemIds: ["duelist-rapier", "healing-elixir"], minQty: 1, maxQty: 1, minimumRarity: "rare" }
    ]
  },
  {
    id: "common",
    name: "Обычный сундук",
    price: { piastres: 1000 },
    pity: { epic: 50 },
    rolls: [
      { label: "Пиастры", chance: 1, itemIds: [], minPiastres: 500, maxPiastres: 1200, minQty: 1, maxQty: 1 },
      { label: "Материалы", chance: 0.7, itemIds: ["iron-ore", "coal", "steel"], minQty: 1, maxQty: 5 },
      { label: "Rare", chance: 0.04, itemIds: ["duelist-rapier", "healing-elixir"], minQty: 1, maxQty: 1, minimumRarity: "rare" },
      { label: "Epic", chance: 0.008, itemIds: ["silk-sails"], minQty: 1, maxQty: 1, minimumRarity: "epic" }
    ]
  },
  {
    id: "pirate",
    name: "Сундук пирата",
    price: { doubloons: 20 },
    pity: { epic: 10, legendary: 80 },
    rolls: [
      { label: "Пиастры", chance: 1, itemIds: [], minPiastres: 1500, maxPiastres: 3000, minQty: 1, maxQty: 1 },
      { label: "Rare", chance: 0.45, itemIds: ["duelist-rapier", "healing-elixir", "tempered-steel"], minQty: 1, maxQty: 3, minimumRarity: "rare" },
      { label: "Epic", chance: 0.12, itemIds: ["silk-sails"], minQty: 1, maxQty: 1, minimumRarity: "epic" },
      { label: "Legendary", chance: 0.028, itemIds: ["blackheart-musketoon"], minQty: 1, maxQty: 1, minimumRarity: "legendary" },
      { label: "Mythic material", chance: 0.002, itemIds: ["divinity-shard"], minQty: 1, maxQty: 1, minimumRarity: "mythic" }
    ]
  },
  {
    id: "admiral",
    name: "Сундук Адмирала",
    price: { doubloons: 400 },
    dailyLimit: 1,
    pity: { epic: 1, legendary: 3, mythic: 10 },
    rolls: [
      { label: "Epic", chance: 0.6, itemIds: ["silk-sails"], minQty: 1, maxQty: 1, minimumRarity: "epic" },
      { label: "Legendary", chance: 0.35, itemIds: ["blackheart-musketoon"], minQty: 1, maxQty: 1, minimumRarity: "legendary" },
      { label: "Mythic", chance: 0.05, itemIds: ["divinity-shard", "soul-reaper", "abyss-heart-plate"], minQty: 1, maxQty: 1, minimumRarity: "mythic" }
    ]
  }
];

export const shipClasses = [
  { id: "boat", name: "Шлюпка", price: 0, hp: 300, crew: 5, cannons: 2, cargo: 50, speed: 1.2, maneuver: 1.3 },
  { id: "sloop", name: "Шлюп", price: 8000, hp: 600, crew: 10, cannons: 6, cargo: 120, speed: 1.35, maneuver: 1.25 },
  { id: "brig", name: "Бриг", price: 35000, hp: 1200, crew: 20, cannons: 12, cargo: 250, speed: 1, maneuver: 1 },
  { id: "frigate", name: "Фрегат", price: 150000, hp: 2400, crew: 40, cannons: 24, cargo: 400, speed: 1.15, maneuver: 1 },
  { id: "galleon", name: "Галеон", price: 500000, hp: 4500, crew: 80, cannons: 40, cargo: 800, speed: 0.75, maneuver: 0.7 },
  { id: "ship-of-line", name: "Линкор", price: 2000000, hp: 7000, crew: 120, cannons: 60, cargo: 1200, speed: 0.9, maneuver: 0.65 }
] as const;

function withHp(stats: StatBlock, hp: number, armor: number): StatBlock {
  return {
    ...stats,
    hp,
    maxHp: hp,
    armor
  };
}
