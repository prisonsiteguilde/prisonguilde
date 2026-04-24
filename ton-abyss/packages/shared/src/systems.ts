// Extended systems: quests, achievements, skills, gems, sets, world map, paragon, reforge.
import type {
  RarityId,
  StatId,
  ElementId,
  DerivedStats,
  ItemSlot,
  ClassId,
  AbilityId,
} from "./types.js";

// ---------------- Skill trees ----------------
export interface SkillNode {
  id: string;
  classId: ClassId;
  tier: 1 | 2 | 3 | 4; // 1 = T1, requires level 1; T2 level 8; T3 level 18; T4 level 35
  name: string;
  description: string;
  maxRank: number; // how many points can be invested
  requires?: string[]; // prerequisite node ids
  kind: "passive" | "active";
  grants?: Partial<DerivedStats>; // per-rank flat bonus (passive)
  grantsAbility?: AbilityId; // active: ability unlocked at rank 1
  costPerRank?: number; // skill points per rank (default 1)
  icon?: string;
}

export interface SkillAllocation {
  [nodeId: string]: number; // current rank
}

// ---------------- Gems & Sockets ----------------
export type GemColor = "red" | "blue" | "green" | "yellow" | "purple" | "white";

export interface GemDef {
  id: string;
  name: string;
  color: GemColor;
  tier: 1 | 2 | 3 | 4 | 5;
  weaponBonus?: Partial<DerivedStats>;
  armorBonus?: Partial<DerivedStats>;
  anyBonus?: Partial<DerivedStats>;
  sellValue: number;
  icon?: string;
}

export interface SocketSlot {
  color: GemColor; // slot color (gems of matching color get 1.5x bonus)
  gemId: string | null;
}

// ---------------- Sets ----------------
export interface SetBonus {
  pieces: 2 | 3 | 4 | 5 | 6;
  bonus: Partial<DerivedStats>;
  description: string;
}

export interface SetDef {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  pieceIds: string[]; // base item ids that count
  bonuses: SetBonus[]; // cumulative
  flavor?: string;
}

// ---------------- Quests / Bounties ----------------
export type QuestObjectiveKind =
  | "kill_monster"
  | "kill_boss"
  | "clear_dungeon"
  | "craft_item"
  | "collect_material"
  | "reach_level"
  | "equip_rarity"
  | "socket_gem"
  | "deal_damage";

export interface QuestObjective {
  id: string;
  kind: QuestObjectiveKind;
  target: string; // monster id / dungeon id / material id / rarity id
  amount: number;
  current?: number;
}

export type QuestKind = "main" | "side" | "daily" | "bounty";

export interface QuestReward {
  gold?: number;
  xp?: number;
  shards?: number;
  abyssDust?: number;
  items?: { baseId: string; qty: number }[];
  skillPoints?: number;
  title?: string;
}

export interface QuestDef {
  id: string;
  name: string;
  kind: QuestKind;
  levelMin: number;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  chain?: string; // next quest id
  cooldownSeconds?: number; // for daily
  flavor?: string;
}

export interface QuestProgress {
  questId: string;
  status: "active" | "completed" | "claimed" | "locked";
  startedAt: number;
  objectives: Record<string, number>; // objective id -> count
  completedAt?: number;
  claimedAt?: number;
}

// ---------------- Achievements ----------------
export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  category: "combat" | "exploration" | "progression" | "collection" | "craft" | "hardcore";
  condition: {
    kind:
      | "dungeon_cleared"
      | "boss_killed"
      | "level_reached"
      | "gold_earned_total"
      | "items_looted_total"
      | "rarity_found"
      | "upgrade_level_reached"
      | "pet_hatched"
      | "skill_rank_total"
      | "hardcore_streak";
    target: string; // id or "any"
    amount: number;
  };
  reward: QuestReward;
  points: number; // AP for leaderboard
  icon?: string;
}

// ---------------- World Map ----------------
export interface MapNode {
  id: string;
  act: 1 | 2 | 3 | 4;
  x: number; // 0..100 % of map width
  y: number; // 0..100 % of map height
  dungeonId?: string;
  kind: "start" | "dungeon" | "boss" | "town" | "portal" | "event";
  name: string;
  levelReq: number;
  requires?: string[]; // node ids that must be completed
  biome?: string;
}

export interface MapProgress {
  unlocked: string[];
  cleared: string[];
  currentAct: 1 | 2 | 3 | 4;
}

// ---------------- Paragon ----------------
export interface ParagonAllocation {
  offense: number;  // +1% dmg each
  defense: number;  // +0.5% all res each
  utility: number;  // +0.25% MF each
  treasure: number; // +0.5% gold find each
}

// ---------------- Reforge / Enchant ----------------
export interface ReforgeCost {
  gold: number;
  dust: number;
  shards?: number;
  materials?: { baseId: string; qty: number }[];
}

// ---------------- Events / Seasonal ----------------
export interface ServerEvent {
  id: string;
  name: string;
  description: string;
  multipliers: Partial<{
    xp: number;
    gold: number;
    drops: number;
    crit: number;
  }>;
  startAt: number;
  endAt: number;
}

// ---------------- Bestiary entry ----------------
export interface BestiaryEntry {
  monsterId: string;
  kills: number;
  firstSeenAt: number;
  discovered: boolean;
}

// ---------------- Combat runtime extensions ----------------
export interface ActiveCombatChoice {
  kind: "ability" | "item" | "flee" | "basic";
  abilityId?: AbilityId;
  itemId?: string;
}

export interface ActiveCombatStep {
  choice: ActiveCombatChoice;
  seed: number;
}

// ---------------- Leaderboard entries ----------------
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  classId: ClassId;
  level: number;
  deepestDungeon: string | null;
  totalKills: number;
  hardcoreRank: number; // 0 = softcore, 1..N
  achievementPoints: number;
  updatedAt: number;
}

// ---------------- Reputation (faction) ----------------
export interface Faction {
  id: string;
  name: string;
  description: string;
  maxReputation: number;
  unlocksAt: Partial<Record<number, string>>; // reputation tier -> unlock label (recipe id, shop id, etc.)
}

// ---------------- Utility types ----------------
export type SlotSocketCount = Partial<Record<ItemSlot, number>>;

export interface CombatPresence {
  actorId: string;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  statuses: import("./types.js").StatusEffect[];
}

// Re-export convenience unions referenced by content
export type { RarityId, StatId, ElementId, ItemSlot };
