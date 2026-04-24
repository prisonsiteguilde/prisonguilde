import type { BaseItem } from "@ton-abyss/shared";
import { ITEMS } from "./items.js";

// Mythic & Abyssal weapons (lvl 55+) — endgame chase items.
// These have signature stats and unique flavor; they're seeded in Echo Rift loot tables.

const MYTHIC_WEAPONS: BaseItem[] = [
  // Swords
  { id: "wpn_dawnbreaker",       name: "Сокрушитель Зари",    slot: "weapon", weaponKind: "sword",      levelReq: 55, baseStats: { attack: 165, critChance: 0.1, lifesteal: 0.05 }, sellValue: 9000, flavor: "Клинок света, разгоняющий тьму." },
  { id: "wpn_void_edge",         name: "Грань Пустоты",       slot: "weapon", weaponKind: "sword",      levelReq: 60, baseStats: { attack: 195, critChance: 0.12, spellPower: 40 }, sellValue: 14000, flavor: "Лезвие пьёт сам свет." },
  // Greatswords
  { id: "wpn_world_breaker",     name: "Сокрушитель Миров",   slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 55, baseStats: { attack: 230 }, sellValue: 11000, flavor: "Меч, что раскалывает горы." },
  { id: "wpn_apocalypse_blade",  name: "Клинок Апокалипсиса", slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 65, baseStats: { attack: 290, critChance: 0.1 }, sellValue: 18000, flavor: "Конец света на твоей спине." },
  // Bows
  { id: "wpn_skyshatter_bow",    name: "Лук Небесного Удара", slot: "weapon", weaponKind: "bow",        twoHanded: true, levelReq: 55, baseStats: { attack: 175, critChance: 0.15 }, sellValue: 10000, flavor: "Каждая стрела — молния." },
  { id: "wpn_voidshot_bow",      name: "Лук Пустотного Залпа", slot: "weapon", weaponKind: "bow",       twoHanded: true, levelReq: 65, baseStats: { attack: 220, critChance: 0.18, spellPower: 30 }, sellValue: 16000, flavor: "Стрелы прошивают реальность." },
  // Staves
  { id: "wpn_archmage_staff",    name: "Посох Архимага",      slot: "weapon", weaponKind: "staff",      twoHanded: true, levelReq: 55, baseStats: { spellPower: 220, maxMana: 80 }, sellValue: 11000, flavor: "Концентрат тысячелетней магии." },
  { id: "wpn_void_staff",        name: "Посох Бездны",        slot: "weapon", weaponKind: "staff",      twoHanded: true, levelReq: 65, baseStats: { spellPower: 280, maxMana: 120, critChance: 0.1 }, sellValue: 17000, flavor: "Бездна шепчет твоими заклинаниями." },
  // Daggers
  { id: "wpn_serpents_kiss",     name: "Поцелуй Змеи",        slot: "weapon", weaponKind: "dagger",     levelReq: 55, baseStats: { attack: 130, critChance: 0.18, lifesteal: 0.08 }, sellValue: 9500, flavor: "Яд этого клинка не имеет противоядия." },
  { id: "wpn_shadow_fang",       name: "Клык Тени",           slot: "weapon", weaponKind: "dagger",     levelReq: 65, baseStats: { attack: 165, critChance: 0.22, lifesteal: 0.1 }, sellValue: 15000, flavor: "Удар, которого не видно." },
  // Hammers
  { id: "wpn_titanforge_hammer", name: "Молот Кузни Титанов", slot: "weapon", weaponKind: "hammer",     twoHanded: true, levelReq: 55, baseStats: { attack: 210, critChance: 0.08 }, sellValue: 10500, flavor: "Выкован в недрах горы богов." },
  { id: "wpn_godsmasher",        name: "Сокрушитель Богов",   slot: "weapon", weaponKind: "hammer",     twoHanded: true, levelReq: 65, baseStats: { attack: 275, critChance: 0.12 }, sellValue: 19000, flavor: "Когда боги падают, этот молот стоит." },
  // Katana
  { id: "wpn_kage_no_katana",    name: "Катана Тени Каге",    slot: "weapon", weaponKind: "katana",     twoHanded: true, levelReq: 60, baseStats: { attack: 200, critChance: 0.15 }, sellValue: 13500, flavor: "Молчаливая, но беспощадная." },
  { id: "wpn_amaterasu_katana",  name: "Катана Аматэрасу",    slot: "weapon", weaponKind: "katana",     twoHanded: true, levelReq: 70, baseStats: { attack: 260, critChance: 0.2 }, sellValue: 22000, flavor: "Лезвие, выкованное самим солнцем." },
  // Scythes
  { id: "wpn_grim_reaper",       name: "Коса Мрачного Жнеца", slot: "weapon", weaponKind: "scythe",     twoHanded: true, levelReq: 60, baseStats: { attack: 215, critChance: 0.13, lifesteal: 0.07 }, sellValue: 14000, flavor: "Срезает души, как пшеницу." },
  // Tomes
  { id: "wpn_necronomicon",      name: "Некрономикон",        slot: "weapon", weaponKind: "tome",       levelReq: 60, baseStats: { spellPower: 230, maxMana: 100, critChance: 0.1 }, sellValue: 14500, flavor: "Книга мёртвых имён." },
  // Orbs
  { id: "wpn_singularity_orb",   name: "Сфера Сингулярности", slot: "weapon", weaponKind: "orb",        levelReq: 60, baseStats: { spellPower: 240, critChance: 0.12 }, sellValue: 14500, flavor: "Гравитационный вихрь в твоей руке." },
  // Rune blades
  { id: "wpn_god_rune_blade",    name: "Рунический клинок Богов", slot: "weapon", weaponKind: "rune_blade", levelReq: 65, baseStats: { attack: 200, spellPower: 100, critChance: 0.13 }, sellValue: 18000, flavor: "Рунный язык вырезан рукой бога." },
  // Spear/polearm/crossbow uniques
  { id: "wpn_gungnir",           name: "Гунгнир",             slot: "weapon", weaponKind: "spear",      twoHanded: true, levelReq: 65, baseStats: { attack: 235, critChance: 0.14 }, sellValue: 17000, flavor: "Копьё, что не знает промаха." },
  { id: "wpn_ashfall_polearm",   name: "Алебарда Пепелопада", slot: "weapon", weaponKind: "polearm",    twoHanded: true, levelReq: 60, baseStats: { attack: 215, critChance: 0.1 }, sellValue: 13500, flavor: "Сжигает землю шаг за шагом." },
  { id: "wpn_doomsday_crossbow", name: "Арбалет Судного Дня", slot: "weapon", weaponKind: "crossbow",   twoHanded: true, levelReq: 65, baseStats: { attack: 235, critChance: 0.15 }, sellValue: 17500, flavor: "Болт прошивает шесть тел." },
  // Wands/maces/axes
  { id: "wpn_wraith_wand",       name: "Жезл Призрака",       slot: "weapon", weaponKind: "wand",       levelReq: 60, baseStats: { spellPower: 215, critChance: 0.11 }, sellValue: 13000, flavor: "Шёпот духов в дереве." },
  { id: "wpn_dread_mace",        name: "Булава Страха",       slot: "weapon", weaponKind: "mace",       levelReq: 55, baseStats: { attack: 175, critChance: 0.08 }, sellValue: 9800, flavor: "Враги падают на колени." },
  { id: "wpn_executioner_axe",   name: "Топор Палача",        slot: "weapon", weaponKind: "axe",        twoHanded: true, levelReq: 60, baseStats: { attack: 220, critChance: 0.14, lifesteal: 0.06 }, sellValue: 14500, flavor: "Каждый удар — приговор." },
  // Fist/claws
  { id: "wpn_void_gauntlet",     name: "Перчатка Бездны",     slot: "weapon", weaponKind: "fist",       levelReq: 60, baseStats: { attack: 195, critChance: 0.13 }, sellValue: 13500, flavor: "Сжатый кулак — портал в Бездну." },
  { id: "wpn_eternal_claws",     name: "Когти Вечности",      slot: "weapon", weaponKind: "claw",       twoHanded: true, levelReq: 65, baseStats: { attack: 220, critChance: 0.18 }, sellValue: 17500, flavor: "Раны от них не заживают." },
  // Rapier
  { id: "wpn_kingmaker_rapier",  name: "Рапира Кингмейкера",  slot: "weapon", weaponKind: "rapier",     levelReq: 60, baseStats: { attack: 175, critChance: 0.16 }, sellValue: 13000, flavor: "Точный удар — корона." },
];

for (const w of MYTHIC_WEAPONS) ITEMS[w.id] = w;

export { MYTHIC_WEAPONS };
