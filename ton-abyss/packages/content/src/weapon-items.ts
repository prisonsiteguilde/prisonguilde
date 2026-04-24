import type { BaseItem } from "@ton-abyss/shared";
import { ITEMS } from "./items.js";

// Unique weapons per archetype. Each weapon gets weapon-locked abilities automatically
// from WEAPON_KINDS in @ton-abyss/shared. Content below adds extra mid-tier + top-tier
// entries to ensure every weapon kind exists in the item pool.

const NEW_WEAPONS: BaseItem[] = [
  // ---- greatsword ----
  { id: "wpn_iron_greatsword",  name: "Железный двуручник",  slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 10, baseStats: { attack: 30 },  sellValue: 180, flavor: "Надёжный клинок ополченца." },
  { id: "wpn_titan_greatsword", name: "Клинок Титана",       slot: "weapon", weaponKind: "greatsword", twoHanded: true, levelReq: 30, baseStats: { attack: 85 },  sellValue: 1800, flavor: "Огромный меч, выкованный в древности." },

  // ---- hammer ----
  { id: "wpn_war_hammer",       name: "Боевой молот",        slot: "weapon", weaponKind: "hammer",    twoHanded: true, levelReq: 12, baseStats: { attack: 34 },  sellValue: 220 },
  { id: "wpn_skull_crusher",    name: "Сокрушитель черепов", slot: "weapon", weaponKind: "hammer",    twoHanded: true, levelReq: 28, baseStats: { attack: 80, critChance: 0.05 }, sellValue: 1500 },
  { id: "wpn_thunder_hammer",   name: "Молот Грома",         slot: "weapon", weaponKind: "hammer",    twoHanded: true, levelReq: 40, baseStats: { attack: 110, critChance: 0.08 }, sellValue: 4200 },

  // ---- spear ----
  { id: "wpn_iron_spear",       name: "Железное копьё",      slot: "weapon", weaponKind: "spear",     twoHanded: true, levelReq: 8,  baseStats: { attack: 26 },  sellValue: 140 },
  { id: "wpn_dragon_lance",     name: "Копьё Драконов",      slot: "weapon", weaponKind: "spear",     twoHanded: true, levelReq: 32, baseStats: { attack: 82 },  sellValue: 2100 },

  // ---- crossbow ----
  { id: "wpn_hunter_crossbow",  name: "Охотничий арбалет",   slot: "weapon", weaponKind: "crossbow",  twoHanded: true, levelReq: 15, baseStats: { attack: 40 },  sellValue: 400 },
  { id: "wpn_siege_crossbow",   name: "Осадный арбалет",     slot: "weapon", weaponKind: "crossbow",  twoHanded: true, levelReq: 35, baseStats: { attack: 98, critChance: 0.06 }, sellValue: 2800 },

  // ---- wand ----
  { id: "wpn_apprentice_wand",  name: "Жезл ученика",        slot: "weapon", weaponKind: "wand",      levelReq: 3,  baseStats: { spellPower: 14 }, sellValue: 60 },
  { id: "wpn_archon_wand",      name: "Жезл Архонта",        slot: "weapon", weaponKind: "wand",      levelReq: 25, baseStats: { spellPower: 70 }, sellValue: 1400 },
  { id: "wpn_starfall_wand",    name: "Жезл Звездопада",     slot: "weapon", weaponKind: "wand",      levelReq: 38, baseStats: { spellPower: 105, critChance: 0.07 }, sellValue: 3600 },

  // ---- tome ----
  { id: "wpn_tome_novice",      name: "Гримуар новичка",     slot: "weapon", weaponKind: "tome",      levelReq: 5,  baseStats: { spellPower: 20 }, sellValue: 100 },
  { id: "wpn_tome_forbidden",   name: "Запретный гримуар",   slot: "weapon", weaponKind: "tome",      levelReq: 22, baseStats: { spellPower: 62 }, sellValue: 1200 },
  { id: "wpn_tome_apocalypse",  name: "Гримуар Апокалипсиса", slot: "weapon", weaponKind: "tome",     levelReq: 42, baseStats: { spellPower: 125, critChance: 0.08 }, sellValue: 5200 },

  // ---- claw ----
  { id: "wpn_beast_claw",       name: "Клыки зверя",         slot: "weapon", weaponKind: "claw",      twoHanded: true, levelReq: 6,  baseStats: { attack: 22 },  sellValue: 90 },
  { id: "wpn_silver_claw",      name: "Серебряные когти",    slot: "weapon", weaponKind: "claw",      twoHanded: true, levelReq: 20, baseStats: { attack: 58, critChance: 0.06 }, sellValue: 900 },
  { id: "wpn_apex_claw",        name: "Когти Апекса",        slot: "weapon", weaponKind: "claw",      twoHanded: true, levelReq: 40, baseStats: { attack: 115, critChance: 0.1 }, sellValue: 4800 },

  // ---- scythe ----
  { id: "wpn_reaper_scythe",    name: "Коса Жнеца",          slot: "weapon", weaponKind: "scythe",    twoHanded: true, levelReq: 18, baseStats: { attack: 52 },  sellValue: 800 },
  { id: "wpn_soul_scythe",      name: "Коса Душ",            slot: "weapon", weaponKind: "scythe",    twoHanded: true, levelReq: 34, baseStats: { attack: 92, critChance: 0.07 }, sellValue: 2600 },
  { id: "wpn_oblivion_scythe",  name: "Коса Забвения",       slot: "weapon", weaponKind: "scythe",    twoHanded: true, levelReq: 48, baseStats: { attack: 140, critChance: 0.1 }, sellValue: 6800 },

  // ---- rapier ----
  { id: "wpn_duelist_rapier",   name: "Рапира дуэлянта",     slot: "weapon", weaponKind: "rapier",    levelReq: 10, baseStats: { attack: 28, critChance: 0.05 }, sellValue: 250 },
  { id: "wpn_noble_rapier",     name: "Дворянская рапира",   slot: "weapon", weaponKind: "rapier",    levelReq: 24, baseStats: { attack: 66, critChance: 0.08 }, sellValue: 1100 },

  // ---- polearm ----
  { id: "wpn_iron_halberd",     name: "Железная алебарда",   slot: "weapon", weaponKind: "polearm",   twoHanded: true, levelReq: 12, baseStats: { attack: 36 },  sellValue: 300 },
  { id: "wpn_royal_halberd",    name: "Королевская алебарда", slot: "weapon", weaponKind: "polearm",  twoHanded: true, levelReq: 30, baseStats: { attack: 88 },  sellValue: 2000 },

  // ---- katana ----
  { id: "wpn_ancestral_katana", name: "Катана предков",      slot: "weapon", weaponKind: "katana",    twoHanded: true, levelReq: 22, baseStats: { attack: 65, critChance: 0.07 }, sellValue: 1300 },
  { id: "wpn_masterwork_katana",name: "Мастерская катана",   slot: "weapon", weaponKind: "katana",    twoHanded: true, levelReq: 38, baseStats: { attack: 105, critChance: 0.1 }, sellValue: 3400 },
  { id: "wpn_void_katana",      name: "Катана Пустоты",      slot: "weapon", weaponKind: "katana",    twoHanded: true, levelReq: 50, baseStats: { attack: 160, critChance: 0.12 }, sellValue: 7200 },

  // ---- fist ----
  { id: "wpn_brass_knuckles",   name: "Кастет",              slot: "weapon", weaponKind: "fist",      levelReq: 4,  baseStats: { attack: 16 },  sellValue: 50 },
  { id: "wpn_dragon_gauntlets", name: "Перчатки Дракона",    slot: "weapon", weaponKind: "fist",      levelReq: 28, baseStats: { attack: 72, critChance: 0.06 }, sellValue: 1500 },

  // ---- orb ----
  { id: "wpn_apprentice_orb",   name: "Сфера ученика",       slot: "weapon", weaponKind: "orb",       levelReq: 8,  baseStats: { spellPower: 28 }, sellValue: 180 },
  { id: "wpn_frost_orb",        name: "Морозная сфера",      slot: "weapon", weaponKind: "orb",       levelReq: 26, baseStats: { spellPower: 72, critChance: 0.05 }, sellValue: 1600 },
  { id: "wpn_cosmic_orb",       name: "Космическая сфера",   slot: "weapon", weaponKind: "orb",       levelReq: 44, baseStats: { spellPower: 135, critChance: 0.09 }, sellValue: 6400 },

  // ---- rune_blade ----
  { id: "wpn_rune_shortsword",  name: "Рунический короткий меч", slot: "weapon", weaponKind: "rune_blade", levelReq: 14, baseStats: { attack: 32, spellPower: 12 }, sellValue: 420 },
  { id: "wpn_elder_rune_blade", name: "Древний рунический клинок", slot: "weapon", weaponKind: "rune_blade", levelReq: 34, baseStats: { attack: 88, spellPower: 35, critChance: 0.07 }, sellValue: 2800 },
  { id: "wpn_eternal_rune_blade", name: "Вечный рунический клинок", slot: "weapon", weaponKind: "rune_blade", levelReq: 50, baseStats: { attack: 145, spellPower: 60, critChance: 0.1 }, sellValue: 7800 },

  // ---- dagger ----
  { id: "wpn_shadow_dagger",    name: "Теневой кинжал",      slot: "weapon", weaponKind: "dagger",    levelReq: 16, baseStats: { attack: 38, critChance: 0.08 }, sellValue: 600 },
  { id: "wpn_assassin_fang",    name: "Клык убийцы",         slot: "weapon", weaponKind: "dagger",    levelReq: 32, baseStats: { attack: 78, critChance: 0.12 }, sellValue: 2400 },
];

for (const w of NEW_WEAPONS) ITEMS[w.id] = w;

export { NEW_WEAPONS };
