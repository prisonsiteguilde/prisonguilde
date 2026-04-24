// Weapon archetypes & weapon-locked skills.
// Each weapon archetype has 4-6 unique abilities that can ONLY be used while equipped.
// Weapon swapping mid-combat is forbidden (enforced by combat engine).

import type { ElementId, AbilityId } from "./types.js";

export type WeaponKind =
  | "sword"        // Меч (1H phys)
  | "greatsword"   // Двуручный меч
  | "axe"          // Топор
  | "hammer"       // Молот
  | "mace"         // Булава
  | "dagger"       // Кинжал
  | "spear"        // Копьё
  | "bow"          // Лук
  | "crossbow"     // Арбалет
  | "staff"        // Посох
  | "wand"         // Жезл
  | "tome"         // Гримуар
  | "claw"         // Когти
  | "scythe"       // Коса
  | "rapier"       // Рапира
  | "polearm"      // Алебарда
  | "katana"       // Катана
  | "fist"         // Кулаки
  | "orb"          // Сфера
  | "rune_blade";  // Рунический клинок

export interface WeaponKindMeta {
  id: WeaponKind;
  ru: string;
  range: "melee" | "ranged" | "magic";
  hands: 1 | 2;
  attackElement: ElementId;
  speed: "slow" | "normal" | "fast" | "very_fast";
  description: string;
  // The weapon-locked skills that become available when wielding this archetype.
  abilities: AbilityId[];
}

export const WEAPON_KINDS: Record<WeaponKind, WeaponKindMeta> = {
  sword: {
    id: "sword", ru: "Меч", range: "melee", hands: 1, attackElement: "physical", speed: "normal",
    description: "Сбалансированное оружие. Универсальные приёмы силы и техники.",
    abilities: ["wsk_sword_slash", "wsk_sword_riposte", "wsk_sword_whirl", "wsk_sword_pierce", "wsk_sword_execute"],
  },
  greatsword: {
    id: "greatsword", ru: "Двуручный меч", range: "melee", hands: 2, attackElement: "physical", speed: "slow",
    description: "Тяжёлый клинок. Мощные удары по площади, низкая скорость.",
    abilities: ["wsk_gs_cleave", "wsk_gs_smash", "wsk_gs_overhead", "wsk_gs_devastate", "wsk_gs_grand_finale"],
  },
  axe: {
    id: "axe", ru: "Топор", range: "melee", hands: 1, attackElement: "physical", speed: "normal",
    description: "Кровавое оружие. Кровотечения, сильные критические удары.",
    abilities: ["wsk_axe_chop", "wsk_axe_rend", "wsk_axe_bloodthirst", "wsk_axe_throw", "wsk_axe_butcher"],
  },
  hammer: {
    id: "hammer", ru: "Молот", range: "melee", hands: 2, attackElement: "physical", speed: "slow",
    description: "Сокрушающее оружие. Оглушения и пробитие брони.",
    abilities: ["wsk_hammer_bash", "wsk_hammer_quake", "wsk_hammer_stun", "wsk_hammer_judgement", "wsk_hammer_meteor"],
  },
  mace: {
    id: "mace", ru: "Булава", range: "melee", hands: 1, attackElement: "physical", speed: "normal",
    description: "Дробящее оружие против нежити и доспехов.",
    abilities: ["wsk_mace_strike", "wsk_mace_consecrate", "wsk_mace_shield_smash", "wsk_mace_holy_light", "wsk_mace_purge"],
  },
  dagger: {
    id: "dagger", ru: "Кинжал", range: "melee", hands: 1, attackElement: "physical", speed: "very_fast",
    description: "Быстрый клинок. Яды, скрытность, серии ударов.",
    abilities: ["wsk_dagger_jab", "wsk_dagger_poison_strike", "wsk_dagger_backstab", "wsk_dagger_flurry", "wsk_dagger_assassinate"],
  },
  spear: {
    id: "spear", ru: "Копьё", range: "melee", hands: 2, attackElement: "physical", speed: "normal",
    description: "Длинное оружие. Прокол, контратаки, удержание дистанции.",
    abilities: ["wsk_spear_thrust", "wsk_spear_sweep", "wsk_spear_impale", "wsk_spear_phalanx", "wsk_spear_skewer"],
  },
  bow: {
    id: "bow", ru: "Лук", range: "ranged", hands: 2, attackElement: "physical", speed: "fast",
    description: "Дальнобойное оружие. Точность и стихийные стрелы.",
    abilities: ["wsk_bow_shot", "wsk_bow_volley", "wsk_bow_piercing", "wsk_bow_explosive", "wsk_bow_rain_arrows"],
  },
  crossbow: {
    id: "crossbow", ru: "Арбалет", range: "ranged", hands: 2, attackElement: "physical", speed: "slow",
    description: "Мощный болт. Высокий урон, медленное перезаряжение.",
    abilities: ["wsk_xbow_bolt", "wsk_xbow_heavy_bolt", "wsk_xbow_pinning", "wsk_xbow_siege_shot", "wsk_xbow_executioner"],
  },
  staff: {
    id: "staff", ru: "Посох", range: "magic", hands: 2, attackElement: "fire", speed: "normal",
    description: "Универсальный магический фокус. Стихии и АОЕ.",
    abilities: ["wsk_staff_bolt", "wsk_staff_fireball", "wsk_staff_chain_lightning", "wsk_staff_meteor", "wsk_staff_arcane_storm"],
  },
  wand: {
    id: "wand", ru: "Жезл", range: "magic", hands: 1, attackElement: "shock", speed: "fast",
    description: "Лёгкий магический фокус. Быстрые залпы, высокая крит-сила.",
    abilities: ["wsk_wand_zap", "wsk_wand_arcane_missile", "wsk_wand_drain", "wsk_wand_enfeeble", "wsk_wand_obliterate"],
  },
  tome: {
    id: "tome", ru: "Гримуар", range: "magic", hands: 1, attackElement: "void", speed: "normal",
    description: "Запретные знания. Дебаффы, проклятия, призыв.",
    abilities: ["wsk_tome_curse", "wsk_tome_void_bolt", "wsk_tome_summon_imp", "wsk_tome_soul_drain", "wsk_tome_apocalypse"],
  },
  claw: {
    id: "claw", ru: "Когти", range: "melee", hands: 2, attackElement: "physical", speed: "very_fast",
    description: "Парные когти. Серии ударов, кровотечение.",
    abilities: ["wsk_claw_swipe", "wsk_claw_lacerate", "wsk_claw_pounce", "wsk_claw_savage", "wsk_claw_blood_frenzy"],
  },
  scythe: {
    id: "scythe", ru: "Коса", range: "melee", hands: 2, attackElement: "void", speed: "slow",
    description: "Оружие смерти. Кражи души, удары по площади.",
    abilities: ["wsk_scythe_reap", "wsk_scythe_soul_harvest", "wsk_scythe_death_grip", "wsk_scythe_eclipse", "wsk_scythe_oblivion"],
  },
  rapier: {
    id: "rapier", ru: "Рапира", range: "melee", hands: 1, attackElement: "physical", speed: "fast",
    description: "Точное колющее. Парирование, серии выпадов.",
    abilities: ["wsk_rapier_lunge", "wsk_rapier_parry", "wsk_rapier_riposte_chain", "wsk_rapier_thousand_cuts", "wsk_rapier_crescent"],
  },
  polearm: {
    id: "polearm", ru: "Алебарда", range: "melee", hands: 2, attackElement: "physical", speed: "slow",
    description: "Древковое. Атаки нескольких целей, контроль зоны.",
    abilities: ["wsk_polearm_swing", "wsk_polearm_sweep", "wsk_polearm_hook", "wsk_polearm_warden", "wsk_polearm_storm"],
  },
  katana: {
    id: "katana", ru: "Катана", range: "melee", hands: 2, attackElement: "physical", speed: "fast",
    description: "Изящный двуручный клинок. Точные срезы, контратаки.",
    abilities: ["wsk_katana_slash", "wsk_katana_iaido", "wsk_katana_crescent", "wsk_katana_thousand_blossoms", "wsk_katana_void_cut"],
  },
  fist: {
    id: "fist", ru: "Кулаки", range: "melee", hands: 1, attackElement: "physical", speed: "very_fast",
    description: "Боевые перчатки. Серии быстрых ударов, контратаки.",
    abilities: ["wsk_fist_jab", "wsk_fist_combo", "wsk_fist_uppercut", "wsk_fist_seven_stars", "wsk_fist_dragon_fist"],
  },
  orb: {
    id: "orb", ru: "Сфера", range: "magic", hands: 1, attackElement: "frost", speed: "normal",
    description: "Магическая сфера. Стихийные сферы, защитные щиты.",
    abilities: ["wsk_orb_pulse", "wsk_orb_frost_shard", "wsk_orb_barrier", "wsk_orb_nova", "wsk_orb_singularity"],
  },
  rune_blade: {
    id: "rune_blade", ru: "Рунический клинок", range: "melee", hands: 1, attackElement: "shock", speed: "normal",
    description: "Меч с руной. Гибрид магии и стали.",
    abilities: ["wsk_rb_strike", "wsk_rb_rune_charge", "wsk_rb_arc_slash", "wsk_rb_runic_blast", "wsk_rb_eternal_edge"],
  },
};

export const WEAPON_KIND_LIST = Object.values(WEAPON_KINDS);

export function getWeaponAbilities(kind: WeaponKind): AbilityId[] {
  return WEAPON_KINDS[kind]?.abilities ?? [];
}
