// Extended secondary stats with Russian display names.
// All values are numeric. Caps & defaults are strict (hardcore balance).

import type { ElementId } from "./types.js";

export type SecondaryStatId =
  // Offensive
  | "attack"
  | "spellPower"
  | "attackSpeed"
  | "castSpeed"
  | "critChance"
  | "critMultiplier"
  | "accuracy"
  | "armorPen"
  | "resistPen"
  | "lifesteal"
  | "manaSteal"
  | "comboBonus"
  | "executeThreshold"
  // Defensive
  | "maxHp"
  | "maxMana"
  | "defense"
  | "armor"
  | "dodge"
  | "parry"
  | "blockChance"
  | "blockAmount"
  | "thorns"
  | "tenacity"
  | "hpRegen"
  | "manaRegen"
  // Utility
  | "speed"
  | "cooldownReduction"
  | "magicFind"
  | "rarityBonus"
  | "xpGain"
  | "goldFind"
  | "lootboxChance"
  // Elemental amplifiers
  | "fireDamage"
  | "frostDamage"
  | "shockDamage"
  | "voidDamage"
  | "holyDamage"
  | "physicalDamage";

export interface SecondaryStatMeta {
  id: SecondaryStatId;
  ru: string;        // Russian display name
  short?: string;    // optional short label
  description: string;
  group: "offense" | "defense" | "utility" | "element";
  pct?: boolean;     // true if value is shown as %
  cap?: number;      // hard cap (after which it stops scaling)
  iconKey?: string;  // matches Icon name
}

export const SECONDARY_STATS: Record<SecondaryStatId, SecondaryStatMeta> = {
  // Offense
  attack:        { id: "attack",        ru: "Атака",                description: "Базовый физический урон от оружия и силы.",          group: "offense", iconKey: "attack" },
  spellPower:    { id: "spellPower",    ru: "Сила заклинаний",      description: "Базовый магический урон от чар и интеллекта.",       group: "offense", iconKey: "spell" },
  attackSpeed:   { id: "attackSpeed",   ru: "Скорость атаки",       description: "Множитель числа автоатак за ход.",                   group: "offense", pct: true, cap: 200 },
  castSpeed:     { id: "castSpeed",     ru: "Скорость каста",       description: "Снижает время восстановления заклинаний.",           group: "offense", pct: true, cap: 100 },
  critChance:    { id: "critChance",    ru: "Шанс крит. удара",     description: "Шанс нанести увеличенный урон.",                     group: "offense", pct: true, cap: 75 },
  critMultiplier:{ id: "critMultiplier",ru: "Множитель крит. урона", description: "Во сколько раз крит увеличивает урон.",              group: "offense", cap: 5 },
  accuracy:      { id: "accuracy",      ru: "Точность",             description: "Шанс попасть. Снижает уклонение врага.",             group: "offense", pct: true, cap: 100 },
  armorPen:      { id: "armorPen",      ru: "Пробитие брони",       description: "Игнорирует часть защиты противника.",                group: "offense", pct: true, cap: 75 },
  resistPen:     { id: "resistPen",     ru: "Пробитие сопротивлений", description: "Игнорирует часть стихийного сопротивления.",         group: "offense", pct: true, cap: 75 },
  lifesteal:     { id: "lifesteal",     ru: "Вампиризм",            description: "Возвращает часть нанесённого урона как HP.",          group: "offense", pct: true, cap: 30 },
  manaSteal:     { id: "manaSteal",     ru: "Кража маны",           description: "Восстанавливает ману за нанесённый урон.",            group: "offense", pct: true, cap: 25 },
  comboBonus:    { id: "comboBonus",    ru: "Бонус комбо",          description: "Каждый последующий удар по цели усиливается.",       group: "offense", pct: true, cap: 50 },
  executeThreshold:{ id: "executeThreshold", ru: "Порог казни",     description: "Мгновенное убийство врага с HP ниже порога.",         group: "offense", pct: true, cap: 30 },

  // Defense
  maxHp:         { id: "maxHp",         ru: "Здоровье",             description: "Максимальный запас жизненных сил.",                  group: "defense", iconKey: "heart" },
  maxMana:       { id: "maxMana",       ru: "Мана",                 description: "Максимальный запас маны.",                            group: "defense", iconKey: "mana" },
  defense:       { id: "defense",       ru: "Защита",               description: "Снижает входящий физический урон.",                   group: "defense" },
  armor:         { id: "armor",         ru: "Броня",                description: "Поглощает фиксированную часть урона.",                group: "defense" },
  dodge:         { id: "dodge",         ru: "Уклонение",            description: "Шанс полностью избежать атаки.",                      group: "defense", pct: true, cap: 60 },
  parry:         { id: "parry",         ru: "Парирование",          description: "Шанс отразить ближний удар, контратакуя.",            group: "defense", pct: true, cap: 40 },
  blockChance:   { id: "blockChance",   ru: "Шанс блока",           description: "Шанс заблокировать удар (только со щитом).",          group: "defense", pct: true, cap: 60 },
  blockAmount:   { id: "blockAmount",   ru: "Сила блока",           description: "Сколько урона блокируется при срабатывании блока.",   group: "defense" },
  thorns:        { id: "thorns",        ru: "Шипы",                 description: "Возвращает атакующему часть полученного урона.",      group: "defense", pct: true, cap: 100 },
  tenacity:      { id: "tenacity",      ru: "Стойкость",            description: "Снижает длительность негативных эффектов.",           group: "defense", pct: true, cap: 75 },
  hpRegen:       { id: "hpRegen",       ru: "Реген. здоровья",      description: "Восстановление HP за ход.",                           group: "defense" },
  manaRegen:     { id: "manaRegen",     ru: "Реген. маны",          description: "Восстановление маны за ход.",                         group: "defense" },

  // Utility
  speed:         { id: "speed",         ru: "Скорость",             description: "Определяет очерёдность хода в бою.",                  group: "utility" },
  cooldownReduction:{ id: "cooldownReduction", ru: "Сокращение КД", description: "Снижает кулдауны способностей.",                      group: "utility", pct: true, cap: 50 },
  magicFind:     { id: "magicFind",     ru: "Поиск сокровищ",       description: "Увеличивает количество дропа (мягкий капп).",         group: "utility", pct: true, cap: 250 },
  rarityBonus:   { id: "rarityBonus",   ru: "Бонус редкости",       description: "Повышает шанс выпадения предмета высшей редкости.",   group: "utility", pct: true, cap: 100 },
  xpGain:        { id: "xpGain",        ru: "Опыт +%",              description: "Множитель получаемого опыта.",                        group: "utility", pct: true, cap: 200 },
  goldFind:      { id: "goldFind",      ru: "Золото +%",            description: "Множитель получаемого золота.",                       group: "utility", pct: true, cap: 250 },
  lootboxChance: { id: "lootboxChance", ru: "Шанс лутбокса",        description: "Шанс получить сундук с боя.",                         group: "utility", pct: true, cap: 25 },

  // Elemental
  fireDamage:    { id: "fireDamage",    ru: "Урон огнём",           description: "Усиливает урон огнём.",                               group: "element", pct: true, cap: 200 },
  frostDamage:   { id: "frostDamage",   ru: "Урон льдом",           description: "Усиливает урон льдом.",                               group: "element", pct: true, cap: 200 },
  shockDamage:   { id: "shockDamage",   ru: "Урон молнией",         description: "Усиливает урон молнией.",                             group: "element", pct: true, cap: 200 },
  voidDamage:    { id: "voidDamage",    ru: "Урон бездной",         description: "Усиливает урон бездной.",                             group: "element", pct: true, cap: 200 },
  holyDamage:    { id: "holyDamage",    ru: "Урон светом",          description: "Усиливает урон светом.",                              group: "element", pct: true, cap: 200 },
  physicalDamage:{ id: "physicalDamage",ru: "Физический урон",      description: "Усиливает физический урон.",                          group: "element", pct: true, cap: 200 },
};

export const PRIMARY_STAT_RU: Record<string, string> = {
  strength:  "Сила",
  agility:   "Ловкость",
  intellect: "Интеллект",
  vitality:  "Выносливость",
  spirit:    "Дух",
  luck:      "Удача",
};

export const ELEMENT_RU: Record<ElementId, string> = {
  physical: "Физический",
  fire:     "Огонь",
  frost:    "Лёд",
  shock:    "Молния",
  void:     "Бездна",
  holy:     "Свет",
};

export const RESISTANCE_RU: Record<ElementId, string> = {
  physical: "Сопр. физическому",
  fire:     "Сопр. огню",
  frost:    "Сопр. льду",
  shock:    "Сопр. молнии",
  void:     "Сопр. бездне",
  holy:     "Сопр. свету",
};

// Soft + hard caps for resistances.
export const RESISTANCE_HARD_CAP = 0.75;
export const RESISTANCE_SOFT_CAP = 0.50;

export type ExtendedStats = Partial<Record<SecondaryStatId, number>>;
