// Clan boss raid system. Massive HP, multi-day, all clan members can attack, shared rewards.

import type { ElementId, RarityId } from "./types.js";

export interface ClanBossDef {
  id: string;
  name: string;
  ru: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6;
  description: string;
  element: ElementId;
  totalHp: number;        // shared HP pool
  durationHours: number;
  minClanRank: number;
  rewardsPerTick: {
    gold: number;
    xp: number;
  };
  killRewards: {
    gold: number;
    shards: number;
    abyssDust: number;
    guaranteedRarity: RarityId;
    uniqueDrops?: string[];
  };
  phases: ClanBossPhase[];
  flavor?: string;
}

export interface ClanBossPhase {
  hpThreshold: number;        // % of HP at which phase begins
  buff?: { attack?: number; defense?: number; resistance?: Partial<Record<ElementId, number>> };
  enrage?: boolean;
  abilities?: string[];
}

export const CLAN_BOSSES: Record<string, ClanBossDef> = {
  cb_iron_titan: {
    id: "cb_iron_titan",
    name: "iron_titan",
    ru: "Железный Титан",
    tier: 1,
    description: "Древний голем, охранник заброшенной крепости.",
    element: "physical",
    totalHp: 5_000_000,
    durationHours: 48,
    minClanRank: 1,
    rewardsPerTick: { gold: 50, xp: 100 },
    killRewards: { gold: 100_000, shards: 250, abyssDust: 50, guaranteedRarity: "epic", uniqueDrops: ["w_epic_warden_titan"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_slam"] },
      { hpThreshold: 0.5, abilities: ["cb_slam", "cb_quake"], buff: { defense: 1.3 } },
      { hpThreshold: 0.2, enrage: true, abilities: ["cb_slam", "cb_quake", "cb_meteor"], buff: { attack: 1.5 } },
    ],
    flavor: "Каждый его шаг сотрясает землю. Стены крепости дрожат от его рычания.",
  },
  cb_frost_wyrm: {
    id: "cb_frost_wyrm",
    name: "frost_wyrm",
    ru: "Морозный Вирм",
    tier: 2,
    description: "Древний дракон льдов, спящий тысячи лет.",
    element: "frost",
    totalHp: 12_000_000,
    durationHours: 72,
    minClanRank: 2,
    rewardsPerTick: { gold: 120, xp: 200 },
    killRewards: { gold: 300_000, shards: 600, abyssDust: 120, guaranteedRarity: "legendary", uniqueDrops: ["w_leg_frost_wyrm_breath"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_frost_breath"] },
      { hpThreshold: 0.6, abilities: ["cb_frost_breath", "cb_blizzard"], buff: { resistance: { frost: 0.5 } } },
      { hpThreshold: 0.3, enrage: true, abilities: ["cb_frost_breath", "cb_blizzard", "cb_glacial_prison"], buff: { attack: 1.4, defense: 1.2 } },
    ],
    flavor: "Дыхание его обращает реки в стекло.",
  },
  cb_infernal_lord: {
    id: "cb_infernal_lord",
    name: "infernal_lord",
    ru: "Лорд Преисподней",
    tier: 3,
    description: "Демон-владыка пламенных глубин.",
    element: "fire",
    totalHp: 25_000_000,
    durationHours: 96,
    minClanRank: 4,
    rewardsPerTick: { gold: 250, xp: 400 },
    killRewards: { gold: 800_000, shards: 1500, abyssDust: 300, guaranteedRarity: "legendary", uniqueDrops: ["w_leg_inferno_blade", "ar_leg_inferno_crown"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_infernal_strike"] },
      { hpThreshold: 0.75, abilities: ["cb_infernal_strike", "cb_meteor_shower"] },
      { hpThreshold: 0.4, abilities: ["cb_infernal_strike", "cb_meteor_shower", "cb_summon_imps"], buff: { attack: 1.2 } },
      { hpThreshold: 0.15, enrage: true, abilities: ["cb_infernal_strike", "cb_meteor_shower", "cb_apocalypse"], buff: { attack: 1.6, defense: 1.3 } },
    ],
    flavor: "Его голос сжигает само время.",
  },
  cb_storm_archon: {
    id: "cb_storm_archon",
    name: "storm_archon",
    ru: "Архонт Бури",
    tier: 4,
    description: "Сущность чистой молнии, управляющая небесами.",
    element: "shock",
    totalHp: 50_000_000,
    durationHours: 120,
    minClanRank: 5,
    rewardsPerTick: { gold: 500, xp: 800 },
    killRewards: { gold: 2_000_000, shards: 3000, abyssDust: 700, guaranteedRarity: "mythic", uniqueDrops: ["w_myth_storm_javelin"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_lightning_strike"] },
      { hpThreshold: 0.7, abilities: ["cb_lightning_strike", "cb_chain_storm"], buff: { resistance: { shock: 0.4 } } },
      { hpThreshold: 0.4, abilities: ["cb_lightning_strike", "cb_chain_storm", "cb_tempest"], buff: { attack: 1.3 } },
      { hpThreshold: 0.15, enrage: true, abilities: ["cb_lightning_strike", "cb_chain_storm", "cb_judgement_bolt"], buff: { attack: 1.7 } },
    ],
    flavor: "Гром — его шёпот, молния — его взгляд.",
  },
  cb_void_devourer: {
    id: "cb_void_devourer",
    name: "void_devourer",
    ru: "Пожиратель Бездны",
    tier: 5,
    description: "Существо из ничего, что пожирает свет.",
    element: "void",
    totalHp: 100_000_000,
    durationHours: 168,
    minClanRank: 7,
    rewardsPerTick: { gold: 1000, xp: 1500 },
    killRewards: { gold: 5_000_000, shards: 7500, abyssDust: 2000, guaranteedRarity: "mythic", uniqueDrops: ["w_myth_voidcaller_scythe", "ar_myth_void_armor"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_void_grasp"] },
      { hpThreshold: 0.8, abilities: ["cb_void_grasp", "cb_consume_light"] },
      { hpThreshold: 0.5, abilities: ["cb_void_grasp", "cb_consume_light", "cb_oblivion_call"], buff: { attack: 1.4 } },
      { hpThreshold: 0.2, enrage: true, abilities: ["cb_void_grasp", "cb_consume_light", "cb_event_horizon"], buff: { attack: 1.8, defense: 1.4 } },
    ],
    flavor: "Когда он смотрит — вселенная закрывает глаза.",
  },
  cb_eternal_one: {
    id: "cb_eternal_one",
    name: "eternal_one",
    ru: "Вечный",
    tier: 6,
    description: "Финальный клан-босс. Только сильнейшие кланы могут его повергнуть.",
    element: "void",
    totalHp: 250_000_000,
    durationHours: 240,
    minClanRank: 9,
    rewardsPerTick: { gold: 2500, xp: 3500 },
    killRewards: { gold: 15_000_000, shards: 20_000, abyssDust: 5000, guaranteedRarity: "abyssal", uniqueDrops: ["w_abyssal_eternal_blade"] },
    phases: [
      { hpThreshold: 1.0, abilities: ["cb_eternal_judgement"] },
      { hpThreshold: 0.85, abilities: ["cb_eternal_judgement", "cb_time_stop"] },
      { hpThreshold: 0.6, abilities: ["cb_eternal_judgement", "cb_time_stop", "cb_reality_break"] },
      { hpThreshold: 0.35, abilities: ["cb_eternal_judgement", "cb_time_stop", "cb_reality_break", "cb_summon_avatars"], buff: { attack: 1.5 } },
      { hpThreshold: 0.1, enrage: true, abilities: ["cb_eternal_judgement", "cb_time_stop", "cb_reality_break", "cb_finality"], buff: { attack: 2.0, defense: 1.5 } },
    ],
    flavor: "До него были другие. После него — никого.",
  },
};

export interface ClanBossInstance {
  bossId: string;
  clanId: string;
  startedAt: number;
  endsAt: number;
  hpRemaining: number;
  damageByMember: Record<string, number>; // charId -> total damage dealt
  killed: boolean;
  killedAt?: number;
}

export interface ClanBossAttackLog {
  charId: string;
  damageDealt: number;
  ts: number;
  abilityId?: string;
}
