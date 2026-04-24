// God Mode v3 — massive content expansion.
// Appends to existing records. Imported once by index.ts so side effects apply.

import type { BaseItem, MonsterDef, AchievementDef, DerivedStats, ElementId } from "@ton-abyss/shared";
import { ELEMENTS } from "@ton-abyss/shared";
import { ITEMS } from "./items.js";
import { MONSTERS } from "./monsters.js";
import { ACHIEVEMENTS } from "./achievements.js";

function mkStats(opts: Partial<DerivedStats> & { maxHp: number }): DerivedStats {
  const resistance = {} as Record<ElementId, number>;
  for (const el of ELEMENTS) resistance[el] = opts.resistance?.[el] ?? 0;
  return {
    maxHp: opts.maxHp,
    maxMana: opts.maxMana ?? 30,
    attack: opts.attack ?? 0,
    spellPower: opts.spellPower ?? 0,
    defense: opts.defense ?? 0,
    resistance,
    critChance: opts.critChance ?? 0.05,
    critMultiplier: opts.critMultiplier ?? 1.5,
    dodge: opts.dodge ?? 0.02,
    accuracy: opts.accuracy ?? 0.9,
    blockChance: opts.blockChance ?? 0,
    blockAmount: opts.blockAmount ?? 0,
    lifesteal: opts.lifesteal ?? 0,
    speed: opts.speed ?? 10,
    luck: 0,
  };
}

// ============== 30 NEW MONSTERS ==============
// Spread across biomes (swamp, desert, sky_ruins, hell_mine, utopia + existing biomes).
const NEW_MONSTERS: MonsterDef[] = [
  // Swamp biome
  { id: "m_swamp_toad",     name: "Ядовитая жаба",    archetype: "grunt",     level: 4,  element: "physical", stats: mkStats({ maxHp: 70, attack: 11, defense: 4, speed: 8 }),  abilities: ["e_bite"],  lootTable: "lt_crypt_mid", xp: 32, gold: [5, 14], biome: "swamp", aiProfile: "aggressive" },
  { id: "m_swamp_witch",    name: "Болотная ведьма",  archetype: "caster",    level: 7,  element: "void",     stats: mkStats({ maxHp: 110, attack: 8, spellPower: 22, defense: 3, speed: 10, resistance: { physical: -0.1, fire: 0, frost: 0, shock: 0.15, void: 0.25, holy: -0.2 } }), abilities: ["e_shadow_fang"], lootTable: "lt_crypt_mid", xp: 70, gold: [10, 22], biome: "swamp" },
  { id: "m_swamp_lurker",   name: "Болотный притайник", archetype: "skirmisher", level: 9,  element: "physical", stats: mkStats({ maxHp: 145, attack: 18, critChance: 0.12, speed: 15 }), abilities: ["e_bite"], lootTable: "lt_crypt_mid", xp: 95, gold: [14, 28], biome: "swamp" },
  { id: "m_swamp_drake",    name: "Болотный дрейк",   archetype: "elite",     level: 14, element: "void",     stats: mkStats({ maxHp: 320, attack: 32, spellPower: 20, defense: 9, speed: 11, resistance: { physical: 0.2, fire: 0, frost: 0, shock: 0, void: 0.35, holy: -0.3 } }), abilities: ["e_bite", "e_shadow_fang"], lootTable: "lt_ice_mid", xp: 310, gold: [50, 90], biome: "swamp" },
  // Desert
  { id: "m_desert_scorpion", name: "Пустынный скорпион", archetype: "grunt",    level: 8,  element: "physical", stats: mkStats({ maxHp: 130, attack: 17, defense: 10, critChance: 0.1, speed: 13 }), abilities: ["e_bite"], lootTable: "lt_crypt_mid", xp: 85, gold: [12, 24], biome: "desert" },
  { id: "m_desert_djinn",   name: "Пустынный джинн",  archetype: "caster",    level: 16, element: "fire",     stats: mkStats({ maxHp: 280, attack: 10, spellPower: 48, defense: 6, speed: 12, resistance: { physical: 0, fire: 0.65, frost: -0.4, shock: 0.1, void: 0, holy: 0 } }), abilities: ["e_infernal_roar"], lootTable: "lt_infernal_mid", xp: 380, gold: [60, 100], biome: "desert" },
  { id: "m_sand_wyrm",      name: "Песчаный вирм",    archetype: "brute",     level: 19, element: "physical", stats: mkStats({ maxHp: 520, attack: 44, defense: 18, speed: 7 }),  abilities: ["e_slam"],  lootTable: "lt_infernal_mid", xp: 520, gold: [80, 130], biome: "desert" },
  { id: "m_desert_assassin", name: "Пустынный ассасин", archetype: "skirmisher", level: 17, element: "physical", stats: mkStats({ maxHp: 310, attack: 40, critChance: 0.22, dodge: 0.12, speed: 17 }), abilities: ["e_bite"], lootTable: "lt_infernal_mid", xp: 440, gold: [65, 115], biome: "desert" },
  // Sky ruins
  { id: "m_sky_gryphon",    name: "Небесный грифон",  archetype: "brute",     level: 22, element: "shock",    stats: mkStats({ maxHp: 680, attack: 56, defense: 16, speed: 16, resistance: { physical: 0.1, fire: 0, frost: 0.1, shock: 0.5, void: 0, holy: 0.1 } }), abilities: ["e_slam"], lootTable: "lt_infernal_mid", xp: 700, gold: [100, 170], biome: "sky_ruins" },
  { id: "m_storm_elemental", name: "Штормовой элементаль", archetype: "elite", level: 24, element: "shock",    stats: mkStats({ maxHp: 740, attack: 22, spellPower: 68, defense: 8, speed: 14, resistance: { physical: 0.2, fire: 0, frost: 0.1, shock: 0.7, void: 0.1, holy: 0 } }), abilities: ["e_frost_lance"], lootTable: "lt_abyss_mid", xp: 860, gold: [125, 210], biome: "sky_ruins" },
  { id: "m_sky_archon",     name: "Небесный архон",   archetype: "elite",     level: 27, element: "holy",     stats: mkStats({ maxHp: 900, attack: 40, spellPower: 70, defense: 18, speed: 12, resistance: { physical: 0.15, fire: 0, frost: 0, shock: 0.1, void: -0.4, holy: 0.7 } }), abilities: ["e_slam", "e_abyssal_gaze"], lootTable: "lt_abyss_mid", xp: 1100, gold: [170, 260], biome: "sky_ruins" },
  { id: "m_sky_cherub",     name: "Небесный херувим", archetype: "caster",    level: 20, element: "holy",     stats: mkStats({ maxHp: 420, attack: 16, spellPower: 56, defense: 10, speed: 11, resistance: { physical: 0, fire: 0.1, frost: 0, shock: 0, void: -0.5, holy: 0.6 } }), abilities: ["e_frost_lance"], lootTable: "lt_infernal_mid", xp: 580, gold: [85, 140], biome: "sky_ruins" },
  // Hell mine
  { id: "m_magma_slave",    name: "Раб магмы",        archetype: "grunt",     level: 11, element: "fire",     stats: mkStats({ maxHp: 200, attack: 26, defense: 8, speed: 9, resistance: { physical: 0, fire: 0.5, frost: -0.4, shock: 0, void: 0, holy: -0.2 } }), abilities: ["e_bite"], lootTable: "lt_infernal_mid", xp: 160, gold: [22, 42], biome: "hell_mine" },
  { id: "m_magma_overseer", name: "Надзиратель магмы", archetype: "elite",    level: 18, element: "fire",     stats: mkStats({ maxHp: 500, attack: 52, defense: 14, speed: 10, resistance: { physical: 0.1, fire: 0.6, frost: -0.5, shock: 0, void: 0, holy: -0.2 } }), abilities: ["e_slam", "e_infernal_roar"], lootTable: "lt_infernal_mid", xp: 480, gold: [75, 125], biome: "hell_mine" },
  { id: "m_corruptor",      name: "Искажающий",       archetype: "caster",    level: 26, element: "void",     stats: mkStats({ maxHp: 820, attack: 20, spellPower: 82, defense: 14, speed: 12, resistance: { physical: 0, fire: 0.1, frost: 0.1, shock: 0, void: 0.7, holy: -0.5 } }), abilities: ["e_shadow_fang", "e_abyssal_gaze"], lootTable: "lt_abyss_mid", xp: 1050, gold: [160, 250], biome: "hell_mine" },
  { id: "m_hell_engineer",  name: "Адский инженер",   archetype: "skirmisher", level: 23, element: "fire",    stats: mkStats({ maxHp: 650, attack: 54, defense: 12, critChance: 0.18, speed: 14, resistance: { physical: 0.1, fire: 0.4, frost: -0.3, shock: 0.1, void: 0, holy: -0.2 } }), abilities: ["e_slam"], lootTable: "lt_abyss_mid", xp: 830, gold: [130, 200], biome: "hell_mine" },
  // Utopia (decayed paradise)
  { id: "m_fallen_angel",   name: "Падший ангел",     archetype: "elite",     level: 30, element: "holy",     stats: mkStats({ maxHp: 1200, attack: 66, spellPower: 40, defense: 22, speed: 13, resistance: { physical: 0.2, fire: 0.1, frost: 0, shock: 0, void: 0.3, holy: 0.4 } }), abilities: ["e_slam", "e_abyssal_gaze"], lootTable: "lt_abyss_mid", xp: 1550, gold: [220, 340], biome: "utopia" },
  { id: "m_utopia_sentinel", name: "Страж Утопии",    archetype: "brute",     level: 32, element: "physical", stats: mkStats({ maxHp: 1500, attack: 78, defense: 36, speed: 10, resistance: { physical: 0.4, fire: 0.1, frost: 0.1, shock: 0.1, void: 0, holy: 0.2 } }), abilities: ["e_slam"], lootTable: "lt_abyss_mid", xp: 1850, gold: [260, 410], biome: "utopia" },
  { id: "m_utopia_beacon",  name: "Маяк утопии",      archetype: "caster",    level: 35, element: "holy",     stats: mkStats({ maxHp: 1300, attack: 22, spellPower: 108, defense: 16, speed: 11, resistance: { physical: 0, fire: 0, frost: 0, shock: 0.2, void: -0.3, holy: 0.8 } }), abilities: ["e_frost_lance"], lootTable: "lt_abyss_high", xp: 2400, gold: [320, 500], biome: "utopia" },
  { id: "m_utopia_apex",    name: "Апекс Утопии",     archetype: "elite",     level: 40, element: "holy",     stats: mkStats({ maxHp: 2200, attack: 95, spellPower: 75, defense: 30, critChance: 0.18, speed: 14, resistance: { physical: 0.3, fire: 0.2, frost: 0.2, shock: 0.2, void: -0.2, holy: 0.7 } }), abilities: ["e_slam", "e_abyssal_gaze"], lootTable: "lt_abyss_high", xp: 4200, gold: [540, 780], biome: "utopia" },
  // Boost existing biomes
  { id: "m_crypt_lich_v2",  name: "Старший лич",      archetype: "caster",    level: 28, element: "void",     stats: mkStats({ maxHp: 900, attack: 30, spellPower: 90, defense: 15, speed: 10, resistance: { physical: 0.1, fire: 0, frost: 0.2, shock: 0.1, void: 0.6, holy: -0.4 } }), abilities: ["e_shadow_fang", "e_abyssal_gaze"], lootTable: "lt_abyss_mid", xp: 1200, gold: [180, 280], biome: "crypt" },
  { id: "m_ice_giant",      name: "Ледяной гигант",   archetype: "brute",     level: 21, element: "frost",    stats: mkStats({ maxHp: 780, attack: 58, defense: 24, speed: 8, resistance: { physical: 0.15, fire: -0.3, frost: 0.6, shock: 0, void: 0, holy: 0 } }), abilities: ["e_slam", "e_frost_lance"], lootTable: "lt_ice_high", xp: 680, gold: [100, 160], biome: "ice" },
  { id: "m_infernal_champion", name: "Инфернальный чемпион", archetype: "elite", level: 29, element: "fire",   stats: mkStats({ maxHp: 1050, attack: 72, defense: 20, speed: 12, critChance: 0.15, resistance: { physical: 0.1, fire: 0.65, frost: -0.4, shock: 0.1, void: 0, holy: -0.2 } }), abilities: ["e_slam", "e_infernal_roar"], lootTable: "lt_abyss_mid", xp: 1400, gold: [210, 320], biome: "infernal" },
  { id: "m_abyss_devourer", name: "Пожиратель Бездны", archetype: "brute",    level: 42, element: "void",     stats: mkStats({ maxHp: 2600, attack: 112, defense: 34, speed: 9, lifesteal: 0.1, resistance: { physical: 0.3, fire: 0.1, frost: 0.1, shock: 0.1, void: 0.7, holy: -0.5 } }), abilities: ["e_slam", "e_shadow_fang"], lootTable: "lt_abyss_high", xp: 5200, gold: [620, 900], biome: "abyss" },
  { id: "m_void_harbinger", name: "Предвестник Пустоты", archetype: "caster", level: 45, element: "void",    stats: mkStats({ maxHp: 2300, attack: 40, spellPower: 140, defense: 22, speed: 14, resistance: { physical: 0.2, fire: 0.1, frost: 0.1, shock: 0.2, void: 0.8, holy: -0.6 } }), abilities: ["e_abyssal_gaze", "e_shadow_fang"], lootTable: "lt_abyss_high", xp: 6400, gold: [780, 1100], biome: "abyss" },
];

for (const m of NEW_MONSTERS) MONSTERS[m.id] = m;

// ============== 60 NEW ITEMS ==============
const NEW_ITEMS: BaseItem[] = [
  // Weapons
  { id: "wpn_mithril_sword",   name: "Мифриловый меч",    slot: "weapon", weaponKind: "sword",  levelReq: 20, baseStats: { attack: 44 }, sellValue: 420 },
  { id: "wpn_obsidian_sword",  name: "Обсидиановый меч",   slot: "weapon", weaponKind: "sword",  levelReq: 28, baseStats: { attack: 58, critChance: 0.04 }, sellValue: 1100 },
  { id: "wpn_dragonfang",      name: "Клык Дракона",       slot: "weapon", weaponKind: "sword",  levelReq: 35, baseStats: { attack: 72, critChance: 0.08 }, sellValue: 2800, rarityWeight: { common: 0, uncommon: 0, rare: 100, epic: 60, legendary: 25, mythic: 6, abyssal: 1 } },
  { id: "wpn_moonbow",         name: "Лук Луны",           slot: "weapon", weaponKind: "bow",    levelReq: 26, baseStats: { attack: 50, critChance: 0.07 }, sellValue: 900 },
  { id: "wpn_hurricane_bow",   name: "Лук Урагана",        slot: "weapon", weaponKind: "bow",    levelReq: 34, baseStats: { attack: 68, critChance: 0.09 }, sellValue: 2600 },
  { id: "wpn_rune_staff",      name: "Рунный посох",       slot: "weapon", weaponKind: "staff",  twoHanded: true, levelReq: 22, baseStats: { spellPower: 50 }, sellValue: 600 },
  { id: "wpn_voidstaff",       name: "Посох Пустоты",      slot: "weapon", weaponKind: "staff",  twoHanded: true, levelReq: 32, baseStats: { spellPower: 78 }, sellValue: 1800 },
  { id: "wpn_archmage_rod",    name: "Жезл Архимага",      slot: "weapon", weaponKind: "staff",  twoHanded: true, levelReq: 42, baseStats: { spellPower: 115 }, sellValue: 5400 },
  { id: "wpn_greatsword",      name: "Двуручный меч",      slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 24, baseStats: { attack: 70 }, sellValue: 800 },
  { id: "wpn_executioner",     name: "Палач",              slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 36, baseStats: { attack: 105, critChance: 0.06 }, sellValue: 3100 },
  { id: "wpn_warhammer",       name: "Боевой молот",       slot: "weapon", weaponKind: "hammer", levelReq: 18, baseStats: { attack: 36 }, sellValue: 400 },
  { id: "wpn_skullcrusher",    name: "Черепокрошитель",    slot: "weapon", weaponKind: "hammer", twoHanded: true, levelReq: 30, baseStats: { attack: 78, critMultiplier: 0.2 }, sellValue: 1500 },
  { id: "wpn_poison_dagger",   name: "Ядовитый кинжал",    slot: "weapon", weaponKind: "dagger", levelReq: 14, baseStats: { attack: 22, critChance: 0.08 }, sellValue: 260 },
  { id: "wpn_twilight_blade",  name: "Сумеречный клинок",  slot: "weapon", weaponKind: "dagger", levelReq: 28, baseStats: { attack: 42, critChance: 0.14 }, sellValue: 1200 },
  { id: "wpn_pyromancer_rod",  name: "Жезл пиромана",      slot: "weapon", weaponKind: "staff",  levelReq: 16, baseStats: { spellPower: 34 }, sellValue: 320 },
  { id: "wpn_frostwand",       name: "Жезл мороза",        slot: "weapon", weaponKind: "staff",  levelReq: 14, baseStats: { spellPower: 28 }, sellValue: 240 },
  // Armor (chest)
  { id: "arm_steel_chest",     name: "Стальная кираса",     slot: "chest", levelReq: 14, baseStats: { defense: 28, maxHp: 50 }, sellValue: 260 },
  { id: "arm_mithril_chest",   name: "Мифриловая кираса",   slot: "chest", levelReq: 22, baseStats: { defense: 48, maxHp: 80 }, sellValue: 780 },
  { id: "arm_drake_plate",     name: "Панцирь дракона",    slot: "chest", levelReq: 34, baseStats: { defense: 82, maxHp: 160 }, sellValue: 3200 },
  { id: "arm_void_plate",      name: "Панцирь Пустоты",    slot: "chest", levelReq: 42, baseStats: { defense: 115, maxHp: 240 }, sellValue: 6800 },
  { id: "arm_holy_chestguard", name: "Священная кираса",   slot: "chest", levelReq: 30, baseStats: { defense: 66, maxHp: 130 }, sellValue: 2100 },
  { id: "arm_mage_robes",      name: "Мантия мага",        slot: "chest", levelReq: 12, baseStats: { defense: 12, spellPower: 16, maxMana: 20 }, sellValue: 200 },
  { id: "arm_archmage_robes",  name: "Мантия архимага",    slot: "chest", levelReq: 30, baseStats: { defense: 32, spellPower: 52, maxMana: 60 }, sellValue: 1700 },
  // Armor (head/helm)
  { id: "arm_steel_helm",      name: "Стальной шлем",       slot: "head", levelReq: 14, baseStats: { defense: 12, maxHp: 30 }, sellValue: 150 },
  { id: "arm_drake_helm",      name: "Шлем дракона",       slot: "head", levelReq: 34, baseStats: { defense: 38, maxHp: 90 }, sellValue: 1900 },
  { id: "arm_void_crown",      name: "Корона Пустоты",     slot: "head", levelReq: 42, baseStats: { defense: 50, spellPower: 32, maxHp: 110 }, sellValue: 4800 },
  { id: "arm_wizard_hat",      name: "Шляпа волшебника",   slot: "head", levelReq: 16, baseStats: { defense: 6, spellPower: 22 }, sellValue: 270 },
  { id: "arm_hood_of_shadows", name: "Капюшон теней",      slot: "head", levelReq: 24, baseStats: { defense: 14, critChance: 0.04, dodge: 0.04 }, sellValue: 820 },
  // Boots
  { id: "arm_swift_boots",     name: "Быстрые сапоги",      slot: "feet", levelReq: 10, baseStats: { defense: 8, speed: 3 }, sellValue: 160 },
  { id: "arm_stormboots",      name: "Сапоги Бури",        slot: "feet", levelReq: 26, baseStats: { defense: 22, speed: 5, dodge: 0.03 }, sellValue: 1100 },
  { id: "arm_voidwalkers",     name: "Поступь Пустоты",    slot: "feet", levelReq: 38, baseStats: { defense: 42, speed: 7, dodge: 0.05 }, sellValue: 3800 },
  // Gloves
  { id: "arm_steel_gauntlets", name: "Стальные рукавицы",   slot: "hands", levelReq: 14, baseStats: { defense: 10, attack: 4 }, sellValue: 220 },
  { id: "arm_drake_gauntlets", name: "Рукавицы дракона",   slot: "hands", levelReq: 32, baseStats: { defense: 28, attack: 14, critChance: 0.03 }, sellValue: 1600 },
  { id: "arm_archmage_gloves", name: "Перчатки архимага",  slot: "hands", levelReq: 24, baseStats: { defense: 14, spellPower: 22 }, sellValue: 800 },
  // Belts
  { id: "arm_thief_belt",      name: "Пояс вора",           slot: "waist", levelReq: 12, baseStats: { defense: 6, critChance: 0.03 }, sellValue: 180 },
  { id: "arm_bloodbelt",       name: "Кровавый пояс",      slot: "waist", levelReq: 28, baseStats: { defense: 20, maxHp: 80, lifesteal: 0.02 }, sellValue: 1400 },
  // Legs
  { id: "arm_steel_greaves",   name: "Стальные поножи",     slot: "legs", levelReq: 14, baseStats: { defense: 20, maxHp: 30 }, sellValue: 240 },
  { id: "arm_drake_greaves",   name: "Поножи дракона",     slot: "legs", levelReq: 34, baseStats: { defense: 52, maxHp: 120 }, sellValue: 2100 },
  { id: "arm_void_greaves",    name: "Поножи Пустоты",     slot: "legs", levelReq: 42, baseStats: { defense: 78, maxHp: 180 }, sellValue: 4600 },
  // Accessory
  { id: "acc_ring_health",     name: "Кольцо жизни",        slot: "ring", levelReq: 8,  baseStats: { maxHp: 40 }, sellValue: 180 },
  { id: "acc_ring_vitality",   name: "Кольцо бодрости",    slot: "ring", levelReq: 18, baseStats: { maxHp: 90, defense: 4 }, sellValue: 620 },
  { id: "acc_ring_mana",       name: "Кольцо маны",        slot: "ring", levelReq: 12, baseStats: { maxMana: 35, spellPower: 6 }, sellValue: 260 },
  { id: "acc_ring_archon",     name: "Кольцо архона",      slot: "ring", levelReq: 28, baseStats: { spellPower: 24, critChance: 0.04 }, sellValue: 1400 },
  { id: "acc_ring_void",       name: "Кольцо Пустоты",     slot: "ring", levelReq: 38, baseStats: { attack: 12, spellPower: 22, critChance: 0.06 }, sellValue: 3200 },
  { id: "acc_amulet_guardian", name: "Амулет стража",      slot: "neck", levelReq: 14, baseStats: { defense: 20, maxHp: 60 }, sellValue: 420 },
  { id: "acc_amulet_flame",    name: "Амулет пламени",     slot: "neck", levelReq: 22, baseStats: { spellPower: 26 }, sellValue: 800 },
  { id: "acc_amulet_stormcaller", name: "Амулет громовержца", slot: "neck", levelReq: 32, baseStats: { spellPower: 40, critChance: 0.05 }, sellValue: 2100 },
  { id: "acc_amulet_void",     name: "Амулет Пустоты",     slot: "neck", levelReq: 42, baseStats: { attack: 18, spellPower: 36, critChance: 0.08 }, sellValue: 5000 },
  { id: "acc_trinket_crit",    name: "Талисман крита",     slot: "trinket", levelReq: 20, baseStats: { critChance: 0.08, critMultiplier: 0.15 }, sellValue: 900 },
  { id: "acc_trinket_swift",   name: "Талисман скорости",  slot: "trinket", levelReq: 16, baseStats: { speed: 6, dodge: 0.04 }, sellValue: 600 },
  { id: "acc_trinket_drop",    name: "Талисман удачи",     slot: "trinket", levelReq: 24, baseStats: { luck: 15 }, sellValue: 1200 },
  // Offhand (shields / orbs)
  { id: "off_kite_shield",     name: "Защитный щит",       slot: "offhand", levelReq: 10, baseStats: { defense: 14, blockChance: 0.08, blockAmount: 8 }, sellValue: 260 },
  { id: "off_tower_shield",    name: "Башенный щит",       slot: "offhand", levelReq: 22, baseStats: { defense: 30, blockChance: 0.12, blockAmount: 16 }, sellValue: 920 },
  { id: "off_aegis_shield",    name: "Эгида",              slot: "offhand", levelReq: 34, baseStats: { defense: 52, blockChance: 0.18, blockAmount: 28, maxHp: 120 }, sellValue: 2900 },
  { id: "off_arcane_orb",      name: "Аркановая сфера",    slot: "offhand", levelReq: 18, baseStats: { spellPower: 22, maxMana: 30 }, sellValue: 540 },
  { id: "off_void_orb",        name: "Сфера Пустоты",      slot: "offhand", levelReq: 36, baseStats: { spellPower: 48, maxMana: 60, critChance: 0.05 }, sellValue: 2400 },
  // Books / tomes
  { id: "wpn_tome_elemental",  name: "Том стихий",         slot: "weapon", weaponKind: "tome", levelReq: 24, baseStats: { spellPower: 54 }, sellValue: 900 },
  { id: "wpn_tome_forbidden",  name: "Запретный том",      slot: "weapon", weaponKind: "tome", levelReq: 38, baseStats: { spellPower: 96, critChance: 0.07 }, sellValue: 3600 },
  // Capes / backs
  { id: "arm_cape_traveler",   name: "Плащ путника",       slot: "back", levelReq: 10, baseStats: { defense: 6, speed: 2 }, sellValue: 140 },
  { id: "arm_cape_shadow",     name: "Плащ тени",          slot: "back", levelReq: 24, baseStats: { defense: 16, dodge: 0.06 }, sellValue: 920 },
  { id: "arm_cape_void",       name: "Плащ Пустоты",       slot: "back", levelReq: 40, baseStats: { defense: 32, dodge: 0.08, maxHp: 100 }, sellValue: 3400 },
];

for (const it of NEW_ITEMS) ITEMS[it.id] = it;

// ============== 35 NEW ACHIEVEMENTS ==============
const NEW_ACH: AchievementDef[] = [
  { id: "ach_tower_10",  name: "Ступня I",       description: "Достигните 10 этажа Башни.",   category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 500 },  points: 20 },
  { id: "ach_tower_25",  name: "Ступня II",      description: "Достигните 25 этажа Башни.",   category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 2500 }, points: 50 },
  { id: "ach_tower_50",  name: "Ступня III",     description: "Достигните 50 этажа Башни.",   category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 10000, shards: 10 }, points: 150 },
  { id: "ach_tower_100", name: "Небесный предел", description: "100 этаж Башни.",              category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 50000, shards: 40, title: "Небесный" }, points: 500 },
  { id: "ach_arena_bronze", name: "Бронзовый бой",  description: "Достигните ранга Бронза.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 400 }, points: 10 },
  { id: "ach_arena_silver", name: "Серебряный бой", description: "Достигните ранга Серебро.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 1800 }, points: 30 },
  { id: "ach_arena_gold",   name: "Золотой бой",   description: "Достигните ранга Золото.",  category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 8000, shards: 5 }, points: 80 },
  { id: "ach_arena_legend", name: "Легенда Арены", description: "Достигните ранга Легенда.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 100000, shards: 60, title: "Легенда Арены" }, points: 600 },
  { id: "ach_faction_rev",  name: "Ревера",        description: "Достигните ревернта в любой фракции.", category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 3000 }, points: 50 },
  { id: "ach_faction_all",  name: "Все пути",      description: "Достигните 3 тира в каждой фракции.",  category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 20000, shards: 30, title: "Всевидящий" }, points: 300 },
  { id: "ach_bounty_1",  name: "Первый баунти",   description: "Завершите 1 баунти.",         category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 150 }, points: 5 },
  { id: "ach_bounty_50", name: "Охотник за головами", description: "Завершите 50 баунти.",   category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 6000, shards: 10 }, points: 100 },
  { id: "ach_hunt_1",    name: "Первая охота",    description: "Завершите 1 охоту.",          category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 300 }, points: 10 },
  { id: "ach_hunt_all",  name: "Все Редкие",      description: "Завершите все 5 охот.",       category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 10000, shards: 20, title: "Великий Охотник" }, points: 200 },
  { id: "ach_craft_100", name: "Мастер кузнечного дела", description: "Скрафтите 100 предметов.", category: "craft", condition: { kind: "items_looted_total", target: "crafted", amount: 100 }, reward: { gold: 8000, shards: 5 }, points: 100 },
  { id: "ach_salvage_1000", name: "Разрушитель",  description: "Расплавьте 1000 предметов.",  category: "craft", condition: { kind: "items_looted_total", target: "salvaged", amount: 1000 }, reward: { gold: 15000 }, points: 150 },
  { id: "ach_pet_evolved", name: "Эволюция",     description: "Эволюционируйте питомца до Apex.", category: "collection", condition: { kind: "pet_hatched", target: "any", amount: 1 }, reward: { gold: 5000, shards: 15, title: "Эволюционист" }, points: 150 },
  { id: "ach_mount_first", name: "Первый скакун", description: "Получите первого скакуна.",  category: "collection", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 1000 }, points: 20 },
  { id: "ach_mount_all",   name: "Все скакуны",   description: "Получите всех скакунов.",     category: "collection", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 40000, shards: 50, title: "Наездник" }, points: 400 },
  { id: "ach_relic_first", name: "Первая реликвия", description: "Получите первую реликвию.", category: "collection", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 2000 }, points: 40 },
  { id: "ach_relic_all",   name: "Все реликвии",  description: "Соберите все реликвии.",      category: "collection", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 80000, shards: 80, title: "Реликварий" }, points: 600 },
  { id: "ach_enchant_first", name: "Первое чарование", description: "Зачаруйте предмет.",    category: "craft", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 400 }, points: 15 },
  { id: "ach_runeword_first", name: "Рунное слово",   description: "Создайте рунворд.",      category: "craft", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 3000, shards: 10, title: "Рунемастер" }, points: 100 },
  { id: "ach_prestige_1",  name: "Вознесение",    description: "Сделайте первое prestige.",  category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 20000, shards: 30, title: "Вознесённый" }, points: 300 },
  { id: "ach_prestige_3",  name: "Триумвират",    description: "Сделайте 3 prestige.",        category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 100000, shards: 100, title: "Триумвират" }, points: 800 },
  { id: "ach_clan_found",  name: "Основатель",    description: "Основайте клан.",             category: "progression", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 2000, title: "Основатель" }, points: 50 },
  { id: "ach_clan_war_1",  name: "Боец клана",   description: "Победите в клан-войне.",       category: "combat", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 3000 }, points: 60 },
  { id: "ach_clan_war_25", name: "Полководец",   description: "25 побед в клан-войне.",       category: "combat", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 80000, shards: 50, title: "Полководец" }, points: 500 },
  { id: "ach_noob_killer", name: "Убийца десяти", description: "Убейте 10 монстров.",         category: "combat", condition: { kind: "boss_killed", target: "any", amount: 10 }, reward: { gold: 150 }, points: 5 },
  { id: "ach_killer_100",  name: "Убийца сотни", description: "Убейте 100 монстров.",        category: "combat", condition: { kind: "boss_killed", target: "any", amount: 100 }, reward: { gold: 2000, shards: 2 }, points: 40 },
  { id: "ach_killer_1000", name: "Машина смерти", description: "Убейте 1000 монстров.",      category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1000 }, reward: { gold: 30000, shards: 30, title: "Машина смерти" }, points: 300 },
  { id: "ach_crit_10k",    name: "10к крит",     description: "Нанесите 10 000+ урона за один удар.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 5000, title: "Убийца" }, points: 80 },
  { id: "ach_no_death_10", name: "Неуязвимый 10", description: "Победите 10 боссов без смерти.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 10 }, reward: { gold: 10000, shards: 20 }, points: 200 },
  { id: "ach_completionist", name: "Коллекционер всего", description: "Полностью изучите Кодекс.", category: "collection", condition: { kind: "level_reached", target: "any", amount: 1 }, reward: { gold: 100000, shards: 200, title: "Всезнающий" }, points: 1000 },
  { id: "ach_abyss_king",  name: "Король Бездны", description: "Единоличное достижение — лидер топа.", category: "combat", condition: { kind: "boss_killed", target: "any", amount: 1 }, reward: { gold: 500000, shards: 500, title: "Король Бездны" }, points: 2000 },
];

for (const a of NEW_ACH) ACHIEVEMENTS[a.id] = a;
