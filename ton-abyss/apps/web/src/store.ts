import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Character,
  ClassId,
  ItemInstance,
  PetInstance,
  StatusEffect,
  AbilityDef,
  MonsterDef,
  SkillAllocation,
  QuestProgress,
  ParagonAllocation,
  MapProgress,
  LeaderboardEntry,
  BattlePassProgress,
  BattlePassMissionState,
  LootboxState,
  LootboxKind,
  ClanBossInstance,
  RarityId,
} from "@ton-abyss/shared";
import {
  defaultLootboxState,
  rollLootbox,
  LOOTBOXES,
  CLAN_BOSSES,
  DEFAULT_DAILY_MISSIONS,
  DEFAULT_WEEKLY_MISSIONS,
  levelFromBpXp,
  WEAPON_KINDS,
} from "@ton-abyss/shared";
import {
  derivedFromPrimary,
  ECONOMY,
  primaryStatsFor,
  POINTS_PER_LEVEL,
  RNG,
  seedFrom,
  applyGear,
  xpForLevel,
  levelFromTotalXp,
  createItemInstance,
  rollLootTable,
  DIFFICULTY_CURVE,
  canCraft,
  craft,
  upgradeItem,
  transmuteItem,
  rerollAffixes,
  tierUpgradeItem,
  TRANSMUTE_COST,
  REROLL_COST,
  TIER_UPGRADE_COST,
  ESSENCE_FROM_RARITY,
  UPGRADE_TABLE,
  SALVAGE_YIELD,
} from "@ton-abyss/shared";
import {
  ITEMS,
  LOOT_TABLES,
  MONSTERS,
  BOSSES,
  RECIPES,
  DUNGEONS,
  ABILITIES,
  SETS,
  GEMS,
  QUESTS,
  ACHIEVEMENTS,
  SKILLS,
  WORLD_MAP,
  FACTIONS,
  TOWER_CONFIG,
  TOWER_BOSS_FLOORS,
  TOWER_MODIFIERS,
  towerBiomeForFloor,
  towerScaling,
  ARENA_OPPONENTS,
  arenaRankFor,
  arenaEloDelta,
  BOUNTIES_POOL,
  BOUNTIES_PER_DAY,
  BOUNTY_REROLL_COST,
  HUNTS,
  EXPEDITIONS,
  RUNEWORDS,
  RELICS,
  MOUNTS,
  ENCHANTS,
  WORLD_EVENTS,
  PETS,
  CLAN_CONFIG,
  CLAN_PERKS,
  CLAN_RANKS,
  NPC_CLANS,
  clanWarReward,
  CURRENT_SEASON,
  ECHO_RIFT_TIERS,
  ECHO_RIFT_PITY_INTERVAL,
  rollEchoRiftAffixes,
  PET_TREATS,
  FORGE_STATIONS,
} from "@ton-abyss/content";

export type Screen =
  | "splash"
  | "class_select"
  | "home"
  | "inventory"
  | "equipment"
  | "dungeon_list"
  | "dungeon_run"
  | "active_combat"
  | "crafting"
  | "pets"
  | "shop"
  | "codex"
  | "world_map"
  | "skill_tree"
  | "sockets"
  | "quests"
  | "achievements"
  | "leaderboard"
  | "stash"
  | "tower"
  | "arena"
  | "factions"
  | "expeditions"
  | "bounties"
  | "hunts"
  | "mounts"
  | "enchanting"
  | "relics"
  | "clan"
  | "battlepass"
  | "lootboxes"
  | "clan_bosses"
  | "echo_rifts"
  | "market"
  | "auction"
  | "trade_post"
  | "blueprints"
  | "forge_stations"
  | "fishing"
  | "gathering"
  | "world_boss"
  | "journal"
  | "loadouts";

export interface Toast {
  id: string;
  text: string;
  tone?: "info" | "good" | "bad" | "epic";
}

export interface CombatActor {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  statuses: StatusEffect[];
  abilityCooldowns: Record<string, number>;
}

export interface ActiveCombatState {
  dungeonId: string;
  room: number;
  totalRooms: number;
  isBossRoom: boolean;
  player: CombatActor;
  enemy: CombatActor;
  enemyDef: MonsterDef;
  rngSeed: number;
  turn: number;
  log: { turn: number; text: string; tone?: "info" | "good" | "bad" | "epic" }[];
  aggregatedLoot: ItemInstance[];
  aggregatedGold: number;
  aggregatedXp: number;
  aggregatedMats: Record<string, number>;
  damageDealtTotal: number;
  ended: boolean;
  victory: boolean;
  rewardsApplied: boolean;
}

export interface TowerState {
  currentFloor: number;
  highestFloor: number;
  active: boolean;
  currentScore: number;
  bestScore: number;
  lastEntryAt: number;
}

export interface ArenaState {
  elo: number;
  wins: number;
  losses: number;
  streak: number;
  lastFightAt: number;
  dailyFights: number;
}

export interface BountyActive {
  id: string;
  progress: number;
  expiresAt: number;
  completed: boolean;
  claimed: boolean;
}

export interface BountiesState {
  active: BountyActive[];
  refreshAt: number;
  completedToday: number;
}

export interface ExpeditionActive {
  id: string; // unique uid
  expId: string; // expedition def id
  petUid: string;
  startedAt: number;
  endsAt: number;
}

export interface ExpeditionsState {
  active: ExpeditionActive[];
  history: { expId: string; success: boolean; at: number }[];
}

export interface HuntActive {
  huntId: string;
  startedAt: number;
  endsAt: number;
  progress: number; // 0..1
}

export interface PetState {
  happiness: number; // 0..100
  lastFedAt: number;
  stage: 1 | 2 | 3;
  collarBaseId?: string;
  skillPoints: number;
  activeBuff?: { treatId: string; expiresAt: number; description: string };
}

export interface Loadout {
  id: string;
  name: string;
  equipped: Record<string, string | null>;
}

export interface ClanMember {
  id: string;
  name: string;
  classId: string;
  level: number;
  rank: import("@ton-abyss/content").ClanRank;
  contribTotal: number;
  lastOnline: number;
}

export interface PlayerClan {
  id: string;
  name: string;
  tag: string; // 3-4 char
  banner: string;
  level: number;
  xp: number;
  bankGold: number;
  members: ClanMember[];
  perksActive: string[]; // perk ids
  motd: string;
  createdAt: number;
  myRank: import("@ton-abyss/content").ClanRank;
  myContribTotal: number;
}

export interface ClanWarRecord {
  id: string;
  opponentId: string;
  opponentName: string;
  won: boolean;
  rewardGold: number;
  rewardXp: number;
  at: number;
}

// Marketplace — instant buy/sell board.
export interface MarketListing {
  id: string;
  item: ItemInstance;
  price: number;
  sellerId: string;
  sellerName: string;
  listedAt: number;
  expiresAt: number;
  isMine: boolean;
}

export interface MarketSale {
  id: string;
  itemBaseId: string;
  itemName: string;
  rarity: string;
  price: number;
  buyerName: string;
  at: number;
}

export interface MarketState {
  listings: MarketListing[];
  history: MarketSale[];
  maxActiveListings: number;
}

// Auction House — bid-based with anti-snipe.
export interface AuctionBid {
  bidderName: string;
  amount: number;
  at: number;
}

export interface AuctionLot {
  id: string;
  item: ItemInstance;
  startPrice: number;
  buyoutPrice: number | null;
  currentBid: number;
  bids: AuctionBid[];
  sellerId: string;
  sellerName: string;
  startedAt: number;
  endsAt: number;
  isMine: boolean;
}

export interface AuctionState {
  lots: AuctionLot[];
  history: { id: string; itemName: string; finalPrice: number; won: boolean; at: number }[];
}

// Trade Post — NPC barter.
export interface TradeOffer {
  id: string;
  npcName: string;
  npcFlavor: string;
  givesItemBaseId?: string;
  givesGold?: number;
  givesMaterial?: { id: string; qty: number };
  wantsItemBaseId?: string;
  wantsRarity?: string;
  wantsGold?: number;
  wantsMaterial?: { id: string; qty: number };
  rarity: "common" | "rare" | "legendary";
  expiresAt: number;
}

export interface TradePostState {
  offers: TradeOffer[];
  refreshAt: number;
  acceptedToday: number;
  lastResetAt: number;
}

// Daily login rewards — 7-day cycle, hardcore reset on miss.
export interface DailyRewardsState {
  currentDay: number; // 0-6
  lastClaimedAt: number; // 0 if never
  claimedToday: boolean;
  totalClaims: number;
}

// Market/Auction carry-over — for Inventory → Market quick flow.
export interface PendingListing {
  itemUid: string;
  destination: "market" | "auction";
}

export interface GameState {
  screen: Screen;
  character: Character | null;
  inventory: ItemInstance[];
  stash: ItemInstance[];
  equipped: Record<string, string | null>;
  materials: Record<string, number>;
  gems: Record<string, number>; // gem base id -> count
  pets: PetInstance[];
  activePetUid: string | null;
  petStates: Record<string, PetState>;

  // Forge stations (Plan v8)
  activeForgeStation: string;
  unlockedForgeStations: string[];
  toasts: Toast[];
  lastDungeonLog: import("@ton-abyss/shared").CombatEvent[];

  // god-mode v2 state
  echoRifts: { highestTier: number; clears: number; pityCounter: number; bestRunGold: number };
  market: MarketState;
  auction: AuctionState;
  tradePost: TradePostState;
  dailyRewards: DailyRewardsState;
  pendingListing: PendingListing | null;
  tower: TowerState;
  arena: ArenaState;
  bounties: BountiesState;
  hunts: { active: HuntActive[]; completed: string[] };
  expeditions: ExpeditionsState;
  factionRep: Record<string, number>;
  factionClaimedTiers: Record<string, number[]>;
  relicsUnlocked: string[];
  mountsOwned: string[];
  activeMount: string | null;
  loadouts: Loadout[];
  lockedItems: string[];
  activeEvent: { id: string; endsAt: number } | null;
  prestigeCount: number;
  craftingStats: { itemsCrafted: number; itemsSalvaged: number; itemsUpgraded: number };

  // Plan v9: Energy & Daily Caps (anti-grind)
  energy: { current: number; max: number; lastRegenAt: number };
  dailyCounters: {
    date: string;
    lootboxOpens: number;
    mythicLootboxOpens: number;
    marketListings: number;
    auctionCreates: number;
    tradeAccepts: number;
    echoRiftAttempts: number;
    arenaFights: number;
    petTreatsFed: Record<string, number>;
    staminaSpeedups: number;
    fishingCasts: number;
    gatheringRuns: number;
    journalEntries: number;
  };
  // Plan v9: Player Journal
  journal: { id: string; at: number; kind: string; text: string; meta?: Record<string, string | number> }[];
  // Plan v9: World Boss
  worldBoss: { id: string; name: string; hpCurrent: number; hpMax: number; endsAt: number; contributors: Record<string, number>; rewards: Record<string, { gold: number; shards: number; claimed: boolean }> } | null;

  // clan
  clan: PlayerClan | null;
  clanDailyContrib: { date: string; gold: number; kills: number; bounties: number; bosses: number };
  clanWars: ClanWarRecord[];
  clanBossActive: ClanBossInstance | null;
  clanBossHistory: { bossId: string; killed: boolean; damage: number; at: number }[];

  // battle pass
  battlepass: BattlePassProgress;
  bpMissions: Record<string, BattlePassMissionState>;
  bpMissionsResetDaily: number;
  bpMissionsResetWeekly: number;

  // lootbox
  lootbox: LootboxState;
  lastLootboxRoll: { kind: LootboxKind; rarities: import("@ton-abyss/shared").RarityId[]; pity: boolean } | null;

  // expansion state
  skillAllocation: SkillAllocation;
  skillPoints: number;
  paragon: ParagonAllocation;
  paragonPoints: number;
  quests: Record<string, QuestProgress>;
  achievements: Record<string, { unlocked: boolean; progress: number; claimedAt?: number }>;
  unlockedTitles: string[];
  activeTitle: string | null;
  mapProgress: MapProgress;
  combat: ActiveCombatState | null;
  dungeonsCleared: Record<string, number>;
  bossesKilled: Record<string, number>;
  monstersKilled: Record<string, number>;
  totalKills: number;
  totalGoldEarned: number;
  totalItemsLooted: number;
  totalDamageDealt: number;
  hardcoreStreak: number;
  leaderboard: LeaderboardEntry[];

  // UI / animation
  lootReveal: ItemInstance[] | null;
  bossCinematic: string | null;

  // actions
  setScreen: (s: Screen) => void;
  createCharacter: (classId: ClassId, hardcore: boolean) => void;
  allocatePoint: (stat: keyof Character["stats"]) => void;
  equipItem: (uid: string) => void;
  unequip: (slot: string) => void;

  // god-mode v2 actions
  moveToStash: (uid: string) => void;
  takeFromStash: (uid: string) => void;
  lockItem: (uid: string) => void;
  unlockItem: (uid: string) => void;
  equipLoadout: (id: string) => void;
  enterTower: () => void;
  towerNext: () => void;
  runEchoRift: (tier: number) => { ok: boolean; error?: string; gold?: number; xp?: number };
  // Marketplace
  marketRefresh: () => void;
  marketList: (uid: string, price: number) => { ok: boolean; error?: string };
  marketBuy: (listingId: string) => { ok: boolean; error?: string };
  marketCancel: (listingId: string) => { ok: boolean; error?: string };
  // Auction
  auctionRefresh: () => void;
  auctionCreate: (uid: string, startPrice: number, buyoutPrice: number | null, durationHours: number) => { ok: boolean; error?: string };
  auctionBid: (lotId: string, amount: number) => { ok: boolean; error?: string };
  auctionBuyout: (lotId: string) => { ok: boolean; error?: string };
  auctionResolve: () => void;
  // Trade post
  tradeRefresh: () => void;
  tradeAccept: (offerId: string) => { ok: boolean; error?: string };
  claimDailyReward: () => { ok: boolean; error?: string };
  checkDailyReward: () => void;
  unlockTitle: (id: string) => void;
  setPendingListing: (p: PendingListing | null) => void;
  exitTower: (save: boolean) => void;
  fightArena: (opponentId: string) => { won: boolean; eloDelta: number };
  rerollBounties: () => void;
  refreshBountiesIfNeeded: () => void;
  claimBounty: (bountyId: string) => { ok: boolean };
  startHunt: (huntId: string) => void;
  progressHunt: () => void;
  claimHunt: (huntId: string) => { ok: boolean };
  sendExpedition: (expId: string, petUid: string) => { ok: boolean; error?: string };
  claimExpedition: (activeId: string) => { ok: boolean };
  tickExpeditions: () => void;
  joinFaction: (factionId: string) => void;
  claimFactionTier: (factionId: string, tier: number) => { ok: boolean };
  feedPet: (petUid: string, materialBaseId: string) => void;
  feedPetTreat: (petUid: string, treatId: string) => { ok: boolean; error?: string; bondGained?: number; xpGained?: number };
  setActiveForgeStation: (stationId: string) => void;
  unlockForgeStation: (stationId: string) => { ok: boolean; error?: string };
  // Plan v9: Energy & Daily caps
  consumeEnergy: (amount: number) => { ok: boolean; error?: string };
  speedupEnergy: () => { ok: boolean; error?: string; cost?: number };
  // Plan v9: Activities
  fishingCast: () => { ok: boolean; error?: string; reward?: { gold: number; mat?: string; matQty?: number } };
  gatherRun: (biome: string) => { ok: boolean; error?: string; mats?: Record<string, number> };
  // Plan v9: World boss
  spawnWorldBoss: () => void;
  attackWorldBoss: () => { ok: boolean; error?: string; damage?: number };
  claimWorldBossReward: () => { ok: boolean; error?: string };
  // Plan v9: Journal
  addJournalEntry: (kind: string, text: string, meta?: Record<string, string | number>) => void;
  clearJournal: () => void;
  // Plan v9: Loadouts
  saveLoadout: (slot: number, name: string) => { ok: boolean; error?: string };
  loadLoadout: (slot: number) => { ok: boolean; error?: string };
  deleteLoadout: (slot: number) => void;
  evolvePet: (petUid: string) => { ok: boolean; error?: string };
  fusePets: (petUidA: string, petUidB: string) => { ok: boolean; error?: string };
  hatchEgg: (eggBaseId: string) => { ok: boolean };
  applyEnchant: (itemUid: string, enchantId: string) => { ok: boolean; error?: string };
  applyRuneword: (itemUid: string, runewordId: string) => { ok: boolean; error?: string };
  buyMount: (mountId: string) => { ok: boolean; error?: string };
  setActiveMount: (mountId: string | null) => void;
  claimRelic: (bossId: string) => { ok: boolean };
  triggerWorldEvent: () => void;
  prestigeAscend: () => { ok: boolean; error?: string };
  salvageMany: (uids: string[]) => { materials: number; dust: number; shards: number };

  // clan actions
  createClan: (name: string, tag: string, banner: string) => { ok: boolean; error?: string };
  joinClanNpc: (npcId: string) => { ok: boolean; error?: string };
  leaveClan: () => void;
  contributeGoldToClan: (amount: number) => { ok: boolean; error?: string };
  withdrawFromClanBank: (amount: number) => { ok: boolean; error?: string };
  setClanMotd: (motd: string) => void;
  activateClanPerk: (perkId: string) => { ok: boolean; error?: string };
  deactivateClanPerk: (perkId: string) => void;
  declareClanWar: (opponentId: string) => { ok: boolean; won: boolean; rewardGold: number; rewardXp: number; error?: string };

  // clan bosses
  startClanBoss: (bossId: string) => { ok: boolean; error?: string };
  attackClanBoss: (damage: number) => { ok: boolean; killed: boolean };
  claimClanBossRewards: () => { ok: boolean };

  // battle pass
  addBpXp: (amount: number) => void;
  claimBpReward: (tierIdx: number, track: "free" | "premium") => { ok: boolean; error?: string };
  purchaseBpPremium: () => { ok: boolean; error?: string };
  refreshBpMissions: () => void;
  progressBpMission: (missionId: string, amount: number) => void;
  claimBpMission: (missionId: string) => { ok: boolean };

  // lootbox
  openLootbox: (kind: LootboxKind, qty?: 1 | 3 | 10) => { ok: boolean; error?: string; rolls?: { kind: LootboxKind; rarities: import("@ton-abyss/shared").RarityId[]; pity: boolean }[] };
  purchaseLootbox: (kind: LootboxKind, qty: number) => { ok: boolean; error?: string };

  // Combat
  beginDungeon: (dungeonId: string) => void;
  combatAction: (kind: "basic" | "ability" | "consumable" | "flee", payload?: { abilityId?: string; itemUid?: string }) => void;
  endCombatReturn: () => void;
  dismissLootReveal: () => void;
  dismissBossCinematic: () => void;

  // Crafting
  craftRecipe: (recipeId: string) => { ok: boolean; error?: string };
  upgrade: (uid: string) => { result: "success" | "fail" | "destroy" };
  salvage: (uids: string[]) => { materials: number; dust: number; shards: number };
  sell: (uids: string[]) => number;

  // Sockets & gems
  socketGem: (itemUid: string, slotIndex: number, gemBaseId: string) => { ok: boolean; error?: string };
  unsocketGem: (itemUid: string, slotIndex: number) => { ok: boolean };
  reforgeItem: (uid: string) => { ok: boolean; error?: string };

  // deep crafting
  transmute: (uid: string) => { ok: boolean; error?: string };
  reroll: (uid: string) => { ok: boolean; error?: string };
  tierUp: (uid: string) => { ok: boolean; error?: string };

  // Skills
  allocateSkill: (nodeId: string) => { ok: boolean; error?: string };
  resetSkills: () => void;
  allocateParagon: (kind: keyof ParagonAllocation) => void;

  // Quests & achievements
  acceptQuest: (questId: string) => void;
  claimQuest: (questId: string) => { ok: boolean };
  claimAchievement: (achId: string) => { ok: boolean };

  // Title
  setActiveTitle: (title: string | null) => void;

  // Map
  enterMapNode: (nodeId: string) => void;

  // Leaderboard
  refreshLeaderboard: () => void;

  // Utility
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  reset: () => void;

  // internal
  _finalizeDungeon: (combat: ActiveCombatState) => void;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function genId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
}

// Plan v9: regen energy lazily on access. 1 point per 6 minutes (=10/h, full 120 in 12h)
const ENERGY_REGEN_MS = 6 * 60 * 1000;
function regenEnergy(e: { current: number; max: number; lastRegenAt: number }): { current: number; max: number; lastRegenAt: number } {
  const now = Date.now();
  const elapsed = now - e.lastRegenAt;
  if (elapsed < ENERGY_REGEN_MS) return e;
  const points = Math.floor(elapsed / ENERGY_REGEN_MS);
  const newCurrent = Math.min(e.max, e.current + points);
  const consumedMs = points * ENERGY_REGEN_MS;
  return { current: newCurrent, max: e.max, lastRegenAt: e.lastRegenAt + consumedMs };
}

function rolloverDailyIfNeeded<T extends { date: string }>(dc: T): T {
  const today = todayKey();
  if (dc.date === today) return dc;
  return {
    ...dc,
    date: today,
    lootboxOpens: 0,
    mythicLootboxOpens: 0,
    marketListings: 0,
    auctionCreates: 0,
    tradeAccepts: 0,
    echoRiftAttempts: 0,
    arenaFights: 0,
    petTreatsFed: {},
    staminaSpeedups: 0,
    fishingCasts: 0,
    gatheringRuns: 0,
    journalEntries: 0,
  } as unknown as T;
}

function starterKit(classId: ClassId): { inv: ItemInstance[]; equipped: Record<string, string | null>; mats: Record<string, number> } {
  const mk = (baseId: string): ItemInstance => ({
    uid: genId("it"),
    baseId,
    rarity: "common",
    level: 1,
    affixes: [],
    upgradeLevel: 0,
    createdAt: Date.now(),
    sockets: [],
  });
  const weapon =
    classId === "runesmith" || classId === "voidcaller"
      ? mk("wpn_novice_staff")
      : classId === "beastbound"
        ? mk("wpn_beast_claws")
        : mk("wpn_rusty_shortsword");
  const chest = mk("arm_leather_vest");
  const head = mk("arm_leather_cap");
  const legs = mk("arm_leather_legs");
  const hands = mk("arm_leather_gloves");
  const feet = mk("arm_leather_boots");
  const potion = mk("con_minor_hp_potion");
  const offhand = classId === "warden" ? mk("off_wooden_shield") : null;
  const inv: ItemInstance[] = [weapon, chest, head, legs, hands, feet, potion];
  if (offhand) inv.push(offhand);
  const equipped: Record<string, string | null> = {
    weapon: weapon.uid,
    chest: chest.uid,
    head: head.uid,
    legs: legs.uid,
    hands: hands.uid,
    feet: feet.uid,
    offhand: offhand?.uid ?? null,
    ring: null,
    amulet: null,
    relic: null,
  };
  const mats: Record<string, number> = {
    mat_linen: 3,
    mat_leather: 3,
    mat_iron: 2,
    treat_jerky: 3,
    treat_honey: 1,
  };
  return { inv, equipped, mats };
}

export function computeSetBonuses(equipped: Record<string, string | null>, inventory: ItemInstance[]) {
  const counts: Record<string, number> = {};
  const equippedItems = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  for (const setId of Object.keys(SETS)) {
    const set = SETS[setId]!;
    const count = equippedItems.filter((i) => set.pieceIds.includes(i.baseId)).length;
    counts[setId] = count;
  }
  // Apply cumulative bonuses for each set
  const aggregate: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  const active: { setId: string; pieces: number; name: string }[] = [];
  for (const [setId, count] of Object.entries(counts)) {
    if (count < 2) continue;
    const set = SETS[setId]!;
    active.push({ setId, pieces: count, name: set.name });
    for (const bonus of set.bonuses) {
      if (count >= bonus.pieces) {
        for (const [k, v] of Object.entries(bonus.bonus)) {
          if (typeof v === "number") {
            (aggregate as any)[k] = ((aggregate as any)[k] ?? 0) + v;
          } else if (typeof v === "object" && v !== null) {
            (aggregate as any)[k] = { ...((aggregate as any)[k] ?? {}) };
            for (const [kk, vv] of Object.entries(v)) {
              (aggregate as any)[k][kk] = ((aggregate as any)[k][kk] ?? 0) + (vv as number);
            }
          }
        }
      }
    }
  }
  return { bonuses: aggregate, activeSets: active };
}

export function computeSkillBonuses(allocation: SkillAllocation): Partial<import("@ton-abyss/shared").DerivedStats> {
  const aggregate: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  for (const [nodeId, rank] of Object.entries(allocation)) {
    if (!rank) continue;
    const node = SKILLS[nodeId];
    if (!node?.grants) continue;
    for (const [k, v] of Object.entries(node.grants)) {
      if (typeof v === "number") {
        (aggregate as any)[k] = ((aggregate as any)[k] ?? 0) + v * rank;
      }
    }
  }
  return aggregate;
}

export function computeParagonBonuses(p: ParagonAllocation): Partial<import("@ton-abyss/shared").DerivedStats> & { goldFindPct?: number; magicFindPct?: number } {
  return {
    attack: Math.round(p.offense * 1),
    spellPower: Math.round(p.offense * 1),
    defense: Math.round(p.defense * 0.5),
    luck: Math.round(p.utility * 0.25 + p.treasure * 0.25),
  };
}

export function computeGemBonuses(inventory: ItemInstance[], equipped: Record<string, string | null>) {
  const agg: Partial<import("@ton-abyss/shared").DerivedStats> = {};
  const equippedItems = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  for (const it of equippedItems) {
    for (const socket of it.sockets ?? []) {
      if (!socket) continue;
      const gem = GEMS[socket];
      if (!gem) continue;
      const base = ITEMS[it.baseId];
      const slotType = base?.slot;
      let bonus = gem.anyBonus ?? {};
      if (slotType === "weapon" && gem.weaponBonus) bonus = gem.weaponBonus;
      else if ((slotType === "chest" || slotType === "head" || slotType === "legs" || slotType === "hands" || slotType === "feet" || slotType === "offhand") && gem.armorBonus) bonus = gem.armorBonus;
      for (const [k, v] of Object.entries(bonus)) {
        if (typeof v === "number") (agg as any)[k] = ((agg as any)[k] ?? 0) + v;
      }
    }
  }
  return agg;
}

export function buildDerived(
  character: Character,
  inventory: ItemInstance[],
  equipped: Record<string, string | null>,
  skillAllocation: SkillAllocation,
  paragon: ParagonAllocation,
  opts?: { activePet?: PetInstance | null; petState?: PetState | null },
) {
  const primary = primaryStatsFor(character.classId, character.level, {});
  Object.assign(primary, character.stats);
  const base = derivedFromPrimary(character.classId, primary);
  const gear = Object.values(equipped)
    .filter((u): u is string => !!u)
    .map((uid) => inventory.find((i) => i.uid === uid))
    .filter((i): i is ItemInstance => !!i);
  const withGear = applyGear(base, gear, (id) => ITEMS[id]);
  // add set / skill / paragon / gem bonuses
  const setAgg = computeSetBonuses(equipped, inventory).bonuses;
  const skillAgg = computeSkillBonuses(skillAllocation);
  const paragonAgg = computeParagonBonuses(paragon);
  const gemAgg = computeGemBonuses(inventory, equipped);
  const merged = { ...withGear } as any;
  for (const agg of [setAgg, skillAgg, paragonAgg, gemAgg]) {
    for (const [k, v] of Object.entries(agg)) {
      if (typeof v === "number") {
        merged[k] = (merged[k] ?? 0) + v;
      } else if (typeof v === "object" && v !== null) {
        merged[k] = { ...(merged[k] ?? {}) };
        for (const [kk, vv] of Object.entries(v)) {
          merged[k][kk] = (merged[k][kk] ?? 0) + (vv as number);
        }
      }
    }
  }
  // Pet bond bonus — active pet contributes a passive % boost based on bondLevel
  if (opts?.activePet) {
    const bond = Math.min(10, opts.activePet.bondLevel ?? 0);
    const happy = opts.petState?.happiness ?? 0;
    const happyMult = 0.5 + (happy / 100) * 0.5; // 0.5..1.0 based on happiness
    const bondPct = (bond / 10) * 0.15 * happyMult; // up to +15% at bond 10 + 100 happy
    if (bondPct > 0) {
      merged.attack = Math.round((merged.attack ?? 0) * (1 + bondPct));
      merged.spellPower = Math.round((merged.spellPower ?? 0) * (1 + bondPct));
      merged.maxHp = Math.round((merged.maxHp ?? 0) * (1 + bondPct * 0.5));
    }
  }
  return merged as ReturnType<typeof derivedFromPrimary>;
}

function applyLevelUps(character: Character, skillPoints: number): { character: Character; skillPointsGained: number; paragonGained: number } {
  const info = levelFromTotalXp(character.xp + xpTotalUpTo(character.level));
  let paragonGained = 0;
  if (info.level > character.level) {
    const gained = info.level - character.level;
    // Paragon: level 50 cap; beyond grants paragonPoints (1 per level).
    const levelCap = 50;
    let newLevel = info.level;
    if (newLevel > levelCap) {
      paragonGained = newLevel - Math.max(levelCap, character.level);
      newLevel = levelCap;
    }
    const skillGained = Math.max(0, newLevel - character.level) * 1; // 1 skill pt per level
    return {
      character: {
        ...character,
        level: newLevel,
        unspentPoints: character.unspentPoints + gained * POINTS_PER_LEVEL,
      },
      skillPointsGained: skillGained,
      paragonGained,
    };
  }
  return { character, skillPointsGained: 0, paragonGained: 0 };
}

function xpTotalUpTo(level: number): number {
  let s = 0;
  for (let l = 1; l < level; l++) s += xpForLevel(l);
  return s;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "splash",
      character: null,
      inventory: [],
      stash: [],
      equipped: {},
      materials: {},
      gems: {},
      pets: [],
      activePetUid: null,
      petStates: {},
      activeForgeStation: "neutral",
      unlockedForgeStations: ["neutral"],
      energy: { current: 120, max: 120, lastRegenAt: Date.now() },
      dailyCounters: {
        date: todayKey(),
        lootboxOpens: 0,
        mythicLootboxOpens: 0,
        marketListings: 0,
        auctionCreates: 0,
        tradeAccepts: 0,
        echoRiftAttempts: 0,
        arenaFights: 0,
        petTreatsFed: {},
        staminaSpeedups: 0,
        fishingCasts: 0,
        gatheringRuns: 0,
        journalEntries: 0,
      },
      journal: [],
      worldBoss: null,
      toasts: [],
      lastDungeonLog: [],
      echoRifts: { highestTier: 0, clears: 0, pityCounter: 0, bestRunGold: 0 },
      market: { listings: [], history: [], maxActiveListings: 8 },
      auction: { lots: [], history: [] },
      tradePost: { offers: [], refreshAt: 0, acceptedToday: 0, lastResetAt: 0 },
      dailyRewards: { currentDay: 0, lastClaimedAt: 0, claimedToday: false, totalClaims: 0 },
      pendingListing: null,
      tower: { currentFloor: 0, highestFloor: 0, active: false, currentScore: 0, bestScore: 0, lastEntryAt: 0 },
      arena: { elo: 0, wins: 0, losses: 0, streak: 0, lastFightAt: 0, dailyFights: 0 },
      bounties: { active: [], refreshAt: 0, completedToday: 0 },
      hunts: { active: [], completed: [] },
      expeditions: { active: [], history: [] },
      factionRep: {},
      factionClaimedTiers: {},
      relicsUnlocked: [],
      mountsOwned: [],
      activeMount: null,
      loadouts: [],
      lockedItems: [],
      activeEvent: null,
      prestigeCount: 0,
      craftingStats: { itemsCrafted: 0, itemsSalvaged: 0, itemsUpgraded: 0 },
      clan: null,
      clanDailyContrib: { date: todayKey(), gold: 0, kills: 0, bounties: 0, bosses: 0 },
      clanWars: [],
      clanBossActive: null,
      clanBossHistory: [],
      battlepass: {
        seasonId: CURRENT_SEASON.id,
        xp: 0,
        level: 0,
        premium: false,
        claimedFree: [],
        claimedPremium: [],
      },
      bpMissions: {},
      bpMissionsResetDaily: 0,
      bpMissionsResetWeekly: 0,
      lootbox: defaultLootboxState(),
      lastLootboxRoll: null,
      skillAllocation: {},
      skillPoints: 0,
      paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
      paragonPoints: 0,
      quests: {},
      achievements: {},
      unlockedTitles: [],
      activeTitle: null,
      mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
      combat: null,
      dungeonsCleared: {},
      bossesKilled: {},
      monstersKilled: {},
      totalKills: 0,
      totalGoldEarned: 0,
      totalItemsLooted: 0,
      totalDamageDealt: 0,
      hardcoreStreak: 0,
      leaderboard: [],
      lootReveal: null,
      bossCinematic: null,

      setScreen: (screen) => set({ screen }),

      createCharacter: (classId, hardcore) => {
        const primary = primaryStatsFor(classId, 1, {});
        const derived = derivedFromPrimary(classId, primary);
        const char: Character = {
          id: genId("c"),
          classId,
          level: 1,
          xp: 0,
          stats: primary,
          unspentPoints: 0,
          hpCurrent: derived.maxHp,
          manaCurrent: derived.maxMana,
          gold: ECONOMY.START_GOLD,
          shards: ECONOMY.START_SHARDS,
          abyssDust: ECONOMY.START_ABYSS_DUST,
          deaths: 0,
          deepestFloor: 0,
          createdAt: Date.now(),
          hardcoreMode: hardcore,
        };
        const starter = starterKit(classId);
        set({
          character: char,
          inventory: starter.inv,
          stash: [],
          equipped: starter.equipped,
          materials: starter.mats,
          pets: [],
          petStates: {},
          skillPoints: 1,
          skillAllocation: {},
          paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: 0,
          quests: { q_main_01: { questId: "q_main_01", status: "active", startedAt: Date.now(), objectives: {} } },
          achievements: {},
          unlockedTitles: [],
          activeTitle: null,
          mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
          combat: null,
          dungeonsCleared: {},
          bossesKilled: {},
          monstersKilled: {},
          totalKills: 0,
          totalGoldEarned: 0,
          totalItemsLooted: 0,
          totalDamageDealt: 0,
          hardcoreStreak: 0,
          gems: {},
          tower: { currentFloor: 0, highestFloor: 0, active: false, currentScore: 0, bestScore: 0, lastEntryAt: 0 },
          echoRifts: { highestTier: 0, clears: 0, pityCounter: 0, bestRunGold: 0 },
          market: { listings: [], history: [], maxActiveListings: 8 },
          auction: { lots: [], history: [] },
          tradePost: { offers: [], refreshAt: 0, acceptedToday: 0, lastResetAt: 0 },
          dailyRewards: { currentDay: 0, lastClaimedAt: 0, claimedToday: false, totalClaims: 0 },
          pendingListing: null,
          arena: { elo: 0, wins: 0, losses: 0, streak: 0, lastFightAt: 0, dailyFights: 0 },
          bounties: { active: [], refreshAt: 0, completedToday: 0 },
          hunts: { active: [], completed: [] },
          expeditions: { active: [], history: [] },
          factionRep: {},
          factionClaimedTiers: {},
          relicsUnlocked: [],
          mountsOwned: [],
          activeMount: null,
          loadouts: [],
          lockedItems: [],
          activeEvent: { id: "evt_harvest", endsAt: Date.now() + 24 * 60 * 60 * 1000 },
          prestigeCount: 0,
          craftingStats: { itemsCrafted: 0, itemsSalvaged: 0, itemsUpgraded: 0 },
          clan: null,
          clanDailyContrib: { date: todayKey(), gold: 0, kills: 0, bounties: 0, bosses: 0 },
          clanWars: [],
          screen: "home",
        });
      },

      allocatePoint: (stat) =>
        set((s) => {
          if (!s.character || s.character.unspentPoints <= 0) return s;
          const next = { ...s.character, stats: { ...s.character.stats, [stat]: s.character.stats[stat] + 1 }, unspentPoints: s.character.unspentPoints - 1 };
          return { character: next };
        }),

      equipItem: (uid) =>
        set((s) => {
          const it = s.inventory.find((i) => i.uid === uid);
          if (!it) return s;
          const base = ITEMS[it.baseId];
          if (!base) return s;
          const slot = base.slot;
          // Weapon-locked: cannot swap weapons during active combat
          if (s.combat && !s.combat.ended && slot === "weapon") {
            return { ...s, toasts: [...s.toasts, { id: genId("tst"), text: "Нельзя сменить оружие в бою.", tone: "bad" as const }] };
          }
          return { equipped: { ...s.equipped, [slot]: uid } };
        }),
      unequip: (slot) =>
        set((s) => {
          if (s.combat && !s.combat.ended && slot === "weapon") {
            return { ...s, toasts: [...s.toasts, { id: genId("tst"), text: "Нельзя снять оружие в бою.", tone: "bad" as const }] };
          }
          return { equipped: { ...s.equipped, [slot]: null } };
        }),

      // ================ ACTIVE COMBAT ================
      beginDungeon: (dungeonId) => {
        const s = get();
        if (!s.character) return;
        const dungeon = DUNGEONS[dungeonId];
        if (!dungeon) return;
        if (s.character.level < dungeon.levelMin) {
          s.pushToast({ text: `Требуется уровень ${dungeon.levelMin}.`, tone: "bad" });
          return;
        }
        if ((dungeon.entryCost?.gold ?? 0) > s.character.gold) {
          s.pushToast({ text: "Недостаточно золота для входа.", tone: "bad" });
          return;
        }
        // Plan v9: energy cost
        const e = regenEnergy(s.energy);
        if (e.current < 8) {
          s.pushToast({ text: `Нужно 8 энергии (есть ${Math.floor(e.current)}).`, tone: "bad" });
          return;
        }
        set({ energy: { ...e, current: e.current - 8 } });
        // Charge entry
        const newChar = { ...s.character, gold: s.character.gold - (dungeon.entryCost?.gold ?? 0) };
        const derived = buildDerived(newChar, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const rngSeed = seedFrom(s.character.id, dungeon.id, Date.now());
        // Spawn first encounter
        const rng = new RNG(rngSeed);
        const enemyId = rng.pick(dungeon.monsterPool);
        const enemy = MONSTERS[enemyId];
        if (!enemy) return;
        const diff = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
        const enemyMaxHp = Math.round(enemy.stats.maxHp * diff.monsterHp);
        const combat: ActiveCombatState = {
          dungeonId,
          room: 1,
          totalRooms: dungeon.rooms,
          isBossRoom: dungeon.rooms === 1,
          player: {
            id: "player",
            name: s.character.classId,
            hp: derived.maxHp,
            maxHp: derived.maxHp,
            mana: derived.maxMana,
            maxMana: derived.maxMana,
            statuses: [],
            abilityCooldowns: {},
          },
          enemy: {
            id: enemy.id,
            name: enemy.name,
            hp: enemyMaxHp,
            maxHp: enemyMaxHp,
            mana: enemy.stats.maxMana,
            maxMana: enemy.stats.maxMana,
            statuses: [],
            abilityCooldowns: {},
          },
          enemyDef: enemy,
          rngSeed,
          turn: 0,
          log: [{ turn: 0, text: `Вы входите в ${dungeon.name}. Комната 1 / ${dungeon.rooms}. ${enemy.name} приближается…`, tone: "info" }],
          aggregatedLoot: [],
          aggregatedGold: 0,
          aggregatedXp: 0,
          aggregatedMats: {},
          damageDealtTotal: 0,
          ended: false,
          victory: false,
          rewardsApplied: false,
        };
        set({ character: newChar, combat, screen: "active_combat" });
      },

      combatAction: (kind, payload) => {
        const s = get();
        if (!s.character || !s.combat) return;
        const combat = s.combat;
        if (combat.ended) return;
        const dungeon = DUNGEONS[combat.dungeonId];
        if (!dungeon) return;
        const diff = DIFFICULTY_CURVE.find((d) => d.tier === dungeon.difficulty) ?? DIFFICULTY_CURVE[0]!;
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const rng = new RNG(combat.rngSeed + combat.turn * 37 + 1);

        combat.turn++;
        const newLog: typeof combat.log = [...combat.log];

        // Resolve player action
        let ability: AbilityDef | null = null;
        let mana = combat.player.mana;
        let playerActionDescription = "";

        if (kind === "flee") {
          if (rng.chance(0.5)) {
            newLog.push({ turn: combat.turn, text: "Вам удалось сбежать! Вы возвращаетесь без награды.", tone: "bad" });
            set({
              combat: { ...combat, ended: true, victory: false, log: newLog },
            });
            return;
          } else {
            newLog.push({ turn: combat.turn, text: "Попытка побега не удалась!", tone: "bad" });
          }
        } else if (kind === "consumable" && payload?.itemUid) {
          const it = s.inventory.find((i) => i.uid === payload.itemUid);
          if (it) {
            const base = ITEMS[it.baseId];
            if (base?.slot === "consumable") {
              // Simple heal
              const heal = base.id === "con_minor_hp_potion" ? 50 : base.id === "con_hp_potion" ? 180 : 420;
              combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + heal);
              newLog.push({ turn: combat.turn, text: `Вы используете ${base.name}: +${heal} HP.`, tone: "good" });
              // Remove one
              const inv = [...s.inventory];
              const idx = inv.findIndex((i) => i.uid === it.uid);
              if (idx !== -1) inv.splice(idx, 1);
              set({ inventory: inv });
            }
          }
        } else if (kind === "ability" && payload?.abilityId) {
          const def = ABILITIES[payload.abilityId];
          if (def) {
            const cd = combat.player.abilityCooldowns[def.id] ?? 0;
            if (cd > 0) {
              newLog.push({ turn: combat.turn, text: `${def.name}: перезарядка ещё ${cd} ход.`, tone: "bad" });
              combat.turn--; // free action
              set({ combat: { ...combat, log: newLog } });
              return;
            }
            if (mana < def.manaCost) {
              newLog.push({ turn: combat.turn, text: `Не хватает маны для ${def.name}.`, tone: "bad" });
              combat.turn--;
              set({ combat: { ...combat, log: newLog } });
              return;
            }
            mana -= def.manaCost;
            ability = def;
            combat.player.abilityCooldowns[def.id] = def.cooldown;
            playerActionDescription = def.name;
          }
        } else {
          ability = ABILITIES["basic_strike"]!;
          playerActionDescription = "Удар";
        }

        // Apply player damage
        if (ability && ability.kind !== "heal" && ability.kind !== "buff") {
          const scaling = ability.scaling ?? {};
          const atk = (scaling.attack ?? 0) * derived.attack + (scaling.spellPower ?? 0) * derived.spellPower;
          let dmg = (ability.baseDamage ?? 0) + atk;
          const crit = rng.chance(derived.critChance);
          if (crit) dmg *= derived.critMultiplier;
          // Defense
          const def = combat.enemyDef.stats.defense;
          dmg = Math.max(1, Math.round(dmg * rng.range(0.9, 1.1) * (1 - Math.min(0.6, def / (def + 80)))));
          // Resistance
          if (ability.element) {
            const res = combat.enemyDef.stats.resistance[ability.element] ?? 0;
            dmg = Math.max(1, Math.round(dmg * (1 - res)));
          }
          combat.enemy.hp = Math.max(0, combat.enemy.hp - dmg);
          combat.damageDealtTotal += dmg;
          newLog.push({ turn: combat.turn, text: `${playerActionDescription}: ${dmg}${crit ? " (КРИТ!)" : ""} урона ${combat.enemy.name}.`, tone: crit ? "epic" : "good" });
          // Apply status effects
          if (ability.effects) {
            for (const eff of ability.effects) {
              combat.enemy.statuses = [...combat.enemy.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
          // Lifesteal
          if (derived.lifesteal > 0) {
            const heal = Math.round(dmg * derived.lifesteal);
            combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + heal);
          }
        } else if (ability && ability.kind === "heal") {
          const heal = (ability.baseDamage ?? 0) + (ability.scaling?.spellPower ?? 0) * derived.spellPower;
          const amt = Math.round(heal);
          combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + amt);
          newLog.push({ turn: combat.turn, text: `Лечение: +${amt} HP.`, tone: "good" });
        } else if (ability && ability.kind === "buff") {
          if (ability.effects) {
            for (const eff of ability.effects) {
              combat.player.statuses = [...combat.player.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
          newLog.push({ turn: combat.turn, text: `${ability.name}: применено.`, tone: "good" });
        }

        combat.player.mana = mana;

        // Tick statuses (burn/bleed/poison deal damage at end of player turn)
        const tickStatuses = (actor: CombatActor, onDamage: (n: number) => void) => {
          const remaining: StatusEffect[] = [];
          for (const st of actor.statuses) {
            if (st.id === "burn" || st.id === "bleed" || st.id === "poison") {
              const d = Math.round(st.potency * (st.stacks ?? 1));
              onDamage(d);
              newLog.push({ turn: combat.turn, text: `${actor.name}: ${st.id} -${d} HP.`, tone: "bad" });
            }
            if (st.duration - 1 > 0) remaining.push({ ...st, duration: st.duration - 1 });
          }
          actor.statuses = remaining;
        };
        tickStatuses(combat.enemy, (n) => { combat.enemy.hp = Math.max(0, combat.enemy.hp - n); });

        // Check enemy death
        if (combat.enemy.hp <= 0) {
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name} повержен!`, tone: "epic" });
          // Loot
          const lootRng = new RNG(combat.rngSeed + combat.room * 1001 + 17);
          const tableId = combat.isBossRoom ? (BOSSES[combat.enemyDef.id as any] ? `lt_boss_${dungeon.biome}` : combat.enemyDef.lootTable) : combat.enemyDef.lootTable;
          const table = LOOT_TABLES[tableId] ?? LOOT_TABLES[combat.enemyDef.lootTable];
          const loot: ItemInstance[] = [];
          if (table) {
            const rolls = rollLootTable(lootRng, table, {
              level: s.character.level,
              magicFindPct: s.character.stats.luck * 3,
              luck: s.character.stats.luck,
              lootQuantityMult: diff.loot,
              lootQualityMult: diff.quality,
            });
            for (const roll of rolls) {
              if (roll.kind === "gold" && roll.amount) {
                combat.aggregatedGold += lootRng.int(roll.amount[0], roll.amount[1]);
              } else if (roll.kind === "material" && roll.baseId && roll.amount) {
                const qty = lootRng.int(roll.amount[0], roll.amount[1]);
                combat.aggregatedMats[roll.baseId] = (combat.aggregatedMats[roll.baseId] ?? 0) + qty;
              } else if (roll.kind === "item" && roll.baseId) {
                const base = ITEMS[roll.baseId];
                if (!base) continue;
                const it = createItemInstance(lootRng, base, { level: s.character.level, magicFindPct: s.character.stats.luck * 3, rarityOverride: roll.rarityOverride });
                if (base.slot === "weapon" || base.slot === "chest" || base.slot === "head" || base.slot === "legs" || base.slot === "hands" || base.slot === "feet" || base.slot === "offhand") {
                  const sockCount = base.slot === "weapon" ? 2 : base.slot === "chest" ? 2 : 1;
                  it.sockets = new Array(sockCount).fill(null);
                }
                loot.push(it);
              }
            }
          }
          combat.aggregatedLoot.push(...loot);
          combat.aggregatedXp += Math.round(combat.enemyDef.xp * diff.quality);
          combat.aggregatedGold += new RNG(combat.rngSeed + 1234 + combat.room).int(combat.enemyDef.gold[0], combat.enemyDef.gold[1]);

          // Track kill
          const mk = { ...s.monstersKilled };
          mk[combat.enemyDef.id] = (mk[combat.enemyDef.id] ?? 0) + 1;
          set({ monstersKilled: mk, totalKills: s.totalKills + 1 });
          // BP missions
          get().progressBpMission("bm_d_kill_30", 1);
          get().progressBpMission("bm_w_kill_300", 1);
          if (combat.isBossRoom) {
            get().progressBpMission("bm_d_boss_1", 1);
            get().progressBpMission("bm_w_boss_10", 1);
          }

          // Next room or dungeon end
          if (combat.room >= combat.totalRooms) {
            combat.ended = true;
            combat.victory = true;
            combat.log = newLog;
            get()._finalizeDungeon(combat);
            return;
          }
          // Spawn next
          combat.room++;
          combat.isBossRoom = combat.room === combat.totalRooms;
          const nextRng = new RNG(combat.rngSeed + combat.room * 991);
          let nextId = nextRng.pick(dungeon.monsterPool);
          let nextDef: any = MONSTERS[nextId];
          if (combat.isBossRoom) {
            nextId = dungeon.bossId;
            nextDef = BOSSES[nextId];
            set({ bossCinematic: nextDef?.name ?? null });
          }
          if (nextDef) {
            const nextMaxHp = Math.round(nextDef.stats.maxHp * diff.monsterHp);
            combat.enemy = {
              id: nextDef.id,
              name: nextDef.name,
              hp: nextMaxHp,
              maxHp: nextMaxHp,
              mana: nextDef.stats.maxMana,
              maxMana: nextDef.stats.maxMana,
              statuses: [],
              abilityCooldowns: {},
            };
            combat.enemyDef = nextDef;
            combat.player.hp = Math.min(combat.player.maxHp, combat.player.hp + Math.round(combat.player.maxHp * 0.12));
            combat.player.mana = Math.min(combat.player.maxMana, combat.player.mana + Math.round(combat.player.maxMana * 0.25));
            newLog.push({ turn: combat.turn, text: `Комната ${combat.room}/${combat.totalRooms}: ${nextDef.name} появляется.`, tone: "info" });
          }
          // Decrement cooldowns
          for (const k of Object.keys(combat.player.abilityCooldowns)) {
            combat.player.abilityCooldowns[k] = Math.max(0, combat.player.abilityCooldowns[k]! - 1);
          }
          set({ combat: { ...combat, log: newLog } });
          return;
        }

        // Enemy counter-attack
        const enemyAbilId = combat.enemyDef.abilities[Math.floor(rng.next() * combat.enemyDef.abilities.length)] ?? "e_bite";
        const enemyAbil = ABILITIES[enemyAbilId] ?? ABILITIES["e_bite"]!;
        if (rng.chance(derived.dodge)) {
          newLog.push({ turn: combat.turn, text: `Вы уклонились от ${enemyAbil.name}!`, tone: "good" });
        } else if (combat.enemy.statuses.some((st) => st.id === "stun" || st.id === "freeze")) {
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name} оглушён и не может атаковать.`, tone: "good" });
        } else {
          const escaling = enemyAbil.scaling ?? {};
          const eatk = (escaling.attack ?? 0) * combat.enemyDef.stats.attack + (escaling.spellPower ?? 0) * combat.enemyDef.stats.spellPower;
          let edmg = ((enemyAbil.baseDamage ?? 0) + eatk) * diff.monsterDmg;
          edmg = Math.max(1, Math.round(edmg * rng.range(0.9, 1.1) * (1 - Math.min(0.75, derived.defense / (derived.defense + 80)))));
          if (enemyAbil.element) {
            const resVal = derived.resistance[enemyAbil.element] ?? 0;
            edmg = Math.max(1, Math.round(edmg * (1 - resVal)));
          }
          // Shield buff reduces damage
          const shield = combat.player.statuses.find((s) => s.id === "shield" || s.id === "fortify");
          if (shield) edmg = Math.max(1, Math.round(edmg * (1 - shield.potency)));
          combat.player.hp = Math.max(0, combat.player.hp - edmg);
          newLog.push({ turn: combat.turn, text: `${combat.enemy.name}: ${enemyAbil.name} ${edmg} урона.`, tone: "bad" });
          // Enemy applies statuses
          if (enemyAbil.effects) {
            for (const eff of enemyAbil.effects) {
              combat.player.statuses = [...combat.player.statuses.filter((s) => s.id !== eff.id), { ...eff }];
            }
          }
        }
        tickStatuses(combat.player, (n) => { combat.player.hp = Math.max(0, combat.player.hp - n); });

        // Player death
        if (combat.player.hp <= 0) {
          combat.ended = true;
          combat.victory = false;
          combat.log = newLog;
          get()._finalizeDungeon(combat);
          return;
        }

        // Decrement cooldowns
        for (const k of Object.keys(combat.player.abilityCooldowns)) {
          combat.player.abilityCooldowns[k] = Math.max(0, combat.player.abilityCooldowns[k]! - 1);
        }
        set({ combat: { ...combat, log: newLog } });
      },

      _finalizeDungeon: (combat: ActiveCombatState) => {
        const s = get() as GameState & { _finalizeDungeon: (c: ActiveCombatState) => void };
        if (!s.character || combat.rewardsApplied) return;
        combat.rewardsApplied = true;
        const dungeon = DUNGEONS[combat.dungeonId]!;
        let char = { ...s.character };
        const quests = { ...s.quests };
        const achievements = { ...s.achievements };
        const dungeonsCleared = { ...s.dungeonsCleared };
        const bossesKilled = { ...s.bossesKilled };
        const mapProgress: MapProgress = { ...s.mapProgress, unlocked: [...s.mapProgress.unlocked], cleared: [...s.mapProgress.cleared] };

        if (combat.victory) {
          char.xp += combat.aggregatedXp;
          char.gold += combat.aggregatedGold;
          char.hpCurrent = combat.player.hp;
          char.manaCurrent = combat.player.mana;
          char.deepestFloor = Math.max(char.deepestFloor, dungeon.difficulty);
          const lu = applyLevelUps(char, s.skillPoints);
          char = lu.character;
          dungeonsCleared[dungeon.id] = (dungeonsCleared[dungeon.id] ?? 0) + 1;
          bossesKilled[dungeon.bossId] = (bossesKilled[dungeon.bossId] ?? 0) + 1;
          // BP missions
          get().progressBpMission("bm_d_clear_2", 1);
          get().progressBpMission("bm_w_dungeons_15", 1);
          // Map unlock: flag node and downstream
          if (!mapProgress.cleared.includes(dungeon.id)) mapProgress.cleared.push(dungeon.id);
          for (const node of WORLD_MAP) {
            if (node.dungeonId === dungeon.id) {
              if (!mapProgress.cleared.includes(node.id)) mapProgress.cleared.push(node.id);
            }
            if (node.requires?.every((r) => mapProgress.cleared.includes(r) || mapProgress.cleared.some((c) => WORLD_MAP.find((n) => n.id === r)?.dungeonId === c))) {
              if (!mapProgress.unlocked.includes(node.id)) mapProgress.unlocked.push(node.id);
            }
          }
          // Update quests
          for (const qp of Object.values(quests) as QuestProgress[]) {
            if (qp.status !== "active") continue;
            const def = QUESTS[qp.questId];
            if (!def) continue;
            for (const obj of def.objectives) {
              if (obj.kind === "clear_dungeon" && (obj.target === "any" || obj.target === dungeon.id)) {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + 1;
              }
              if (obj.kind === "kill_boss" && (obj.target === "any" || obj.target === dungeon.bossId)) {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + 1;
              }
              if (obj.kind === "kill_monster" && obj.target === "any") {
                qp.objectives[obj.id] = (qp.objectives[obj.id] ?? 0) + combat.totalRooms;
              }
            }
            if (def.objectives.every((o) => (qp.objectives[o.id] ?? 0) >= o.amount)) {
              qp.status = "completed";
              qp.completedAt = Date.now();
              s.pushToast({ text: `Квест завершён: ${def.name}!`, tone: "epic" });
            }
          }
          // Inventory & materials
          const inv = [...s.inventory, ...combat.aggregatedLoot];
          const mats = { ...s.materials };
          for (const [k, v] of Object.entries(combat.aggregatedMats)) mats[k] = (mats[k] ?? 0) + v;
          // Achievements
          const totals = {
            kills: s.totalKills,
            bossKills: Object.values(bossesKilled).reduce((a, b) => (a as number) + (b as number), 0) as number,
            gold: s.totalGoldEarned + combat.aggregatedGold,
            items: s.totalItemsLooted + combat.aggregatedLoot.length,
          };
          for (const ach of Object.values(ACHIEVEMENTS)) {
            const current = achievements[ach.id] ?? { unlocked: false, progress: 0 };
            if (current.unlocked) continue;
            let progress = current.progress;
            const c = ach.condition;
            if (c.kind === "dungeon_cleared") progress = dungeonsCleared[c.target] ?? (c.target === "any" ? Object.values(dungeonsCleared).reduce((a, b) => (a as number) + (b as number), 0) as number : 0);
            else if (c.kind === "boss_killed") progress = c.target === "any" ? totals.bossKills : (bossesKilled[c.target] ?? 0);
            else if (c.kind === "level_reached") progress = char.level;
            else if (c.kind === "gold_earned_total") progress = totals.gold;
            else if (c.kind === "items_looted_total") progress = totals.items;
            if (progress >= c.amount) {
              current.unlocked = true;
              s.pushToast({ text: `Достижение: ${ach.name} (+${ach.points} AP)!`, tone: "epic" });
              if (ach.reward.gold) char.gold += ach.reward.gold;
              if (ach.reward.xp) char.xp += ach.reward.xp;
              if (ach.reward.shards) char.shards += ach.reward.shards;
              if (ach.reward.abyssDust) char.abyssDust += ach.reward.abyssDust;
              if (ach.reward.skillPoints) lu.skillPointsGained += ach.reward.skillPoints;
              if (ach.reward.title) {
                if (!s.unlockedTitles.includes(ach.reward.title)) s.unlockedTitles.push(ach.reward.title);
              }
            }
            current.progress = progress;
            achievements[ach.id] = current;
          }
          const journalEntries = [
            { id: genId("jl"), at: Date.now(), kind: "boss", text: `Убит босс: ${BOSSES[dungeon.bossId]?.name ?? dungeon.bossId} (${dungeon.name}). +${combat.aggregatedXp} XP, +${combat.aggregatedGold}g.` },
            ...(lu.skillPointsGained > 0 ? [{ id: genId("jl"), at: Date.now(), kind: "level", text: `Новый уровень! +${lu.skillPointsGained} очков навыков.` }] : []),
          ];
          set({
            character: char,
            inventory: inv,
            materials: mats,
            skillPoints: s.skillPoints + lu.skillPointsGained,
            paragonPoints: s.paragonPoints + lu.paragonGained,
            quests,
            achievements,
            dungeonsCleared,
            bossesKilled,
            mapProgress,
            totalGoldEarned: totals.gold,
            totalItemsLooted: totals.items,
            totalDamageDealt: s.totalDamageDealt + combat.damageDealtTotal,
            hardcoreStreak: s.hardcoreStreak + 1,
            lootReveal: combat.aggregatedLoot.length > 0 ? combat.aggregatedLoot : null,
            combat,
            bossCinematic: null,
            journal: [...journalEntries, ...s.journal].slice(0, 200),
          });
          s.pushToast({ text: `Победа! +${combat.aggregatedXp} XP, +${combat.aggregatedGold} золота, дропа: ${combat.aggregatedLoot.length}.`, tone: "epic" });
        } else {
          // Loss — hardcore penalty: 30% gold + 25% xp + reset hardcore streak
          char.deaths += 1;
          char.gold = Math.max(0, Math.floor(char.gold * 0.70));
          char.xp = Math.max(0, Math.floor(char.xp * 0.75));
          char.hpCurrent = 1;
          const deathEntry = { id: genId("jl"), at: Date.now(), kind: "death", text: `Гибель в ${dungeon.name}. Потеряно 30% золота, 25% опыта.` };
          set({
            character: char,
            combat,
            hardcoreStreak: 0,
            journal: [deathEntry, ...s.journal].slice(0, 200),
          });
          s.pushToast({ text: "Вы погибли. Потери: 30% золота, 25% опыта. Хардкор не прощает.", tone: "bad" });
        }
      },

      endCombatReturn: () => set({ combat: null, screen: "home", bossCinematic: null }),
      dismissLootReveal: () => set({ lootReveal: null }),
      dismissBossCinematic: () => set({ bossCinematic: null }),

      // ================ CRAFTING ================
      craftRecipe: (recipeId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no character" };
        const baseRecipe = RECIPES[recipeId];
        if (!baseRecipe) return { ok: false, error: "no recipe" };
        // Apply active forge station bonuses
        const station = FORGE_STATIONS[s.activeForgeStation] ?? FORGE_STATIONS.neutral;
        const discountedCost = Math.floor(baseRecipe.goldCost * (1 - (station?.goldDiscount ?? 0)));
        const boostedBias: Partial<Record<import("@ton-abyss/shared").RarityId, number>> = { ...(baseRecipe.rarityBias ?? {}) };
        if (station?.rarityBoost) {
          for (const [rk, mult] of Object.entries(station.rarityBoost)) {
            const k = rk as import("@ton-abyss/shared").RarityId;
            if (boostedBias[k] !== undefined) boostedBias[k] = boostedBias[k]! * mult;
          }
        }
        const recipe = { ...baseRecipe, goldCost: discountedCost, rarityBias: boostedBias };
        if (!canCraft(recipe, s.materials, s.character.gold)) {
          s.pushToast({ text: "Недостаточно ресурсов.", tone: "bad" });
          return { ok: false, error: "insufficient" };
        }
        const base = ITEMS[recipe.outputBaseId];
        if (!base) return { ok: false, error: "bad base" };
        const rng = new RNG(seedFrom(s.character.id, recipe.id, Date.now()));
        const item = craft(recipe, rng, base, { magicFindPct: s.character.stats.luck * 3 });
        if (base.slot === "weapon" || base.slot === "chest" || base.slot === "head" || base.slot === "legs" || base.slot === "hands" || base.slot === "feet" || base.slot === "offhand") {
          const sockCount = base.slot === "weapon" ? 2 : base.slot === "chest" ? 2 : 1;
          item.sockets = new Array(sockCount).fill(null);
        }
        const mats = { ...s.materials };
        for (const inp of recipe.inputs) mats[inp.baseId] = (mats[inp.baseId] ?? 0) - inp.qty;
        // Forge station T5 (void) chance to double output
        let extraItem: import("@ton-abyss/shared").ItemInstance | null = null;
        if (s.activeForgeStation === "void" && Math.random() < 0.05) {
          extraItem = craft(recipe, new RNG(seedFrom(s.character.id, recipe.id, Date.now() + 1)), base, { magicFindPct: s.character.stats.luck * 3 });
        }
        const newInv = extraItem ? [...s.inventory, item, extraItem] : [...s.inventory, item];
        set({
          character: { ...s.character, gold: s.character.gold - recipe.goldCost },
          materials: mats,
          inventory: newInv,
          lootReveal: extraItem ? [item, extraItem] : [item],
        });
        s.pushToast({ text: `Создано: ${base.name} (${item.rarity})${extraItem ? " ×2 (Бездна!)" : ""}`, tone: item.rarity === "legendary" || item.rarity === "mythic" || item.rarity === "abyssal" ? "epic" : "good" });
        get().progressBpMission("bm_d_craft_3", 1);
        get().progressBpMission("bm_w_craft_25", 1);
        return { ok: true };
      },

      upgrade: (uid) => {
        const s = get();
        if (!s.character) return { result: "fail" };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx === -1) return { result: "fail" };
        const item = s.inventory[idx]!;
        if (item.upgradeLevel >= 15) {
          s.pushToast({ text: "Максимальный уровень усиления.", tone: "bad" });
          return { result: "fail" };
        }
        const row = UPGRADE_TABLE[item.upgradeLevel]!;
        if (s.character.gold < row.goldCost || s.character.abyssDust < row.dustCost) {
          s.pushToast({ text: "Недостаточно золота или пыли Бездны.", tone: "bad" });
          return { result: "fail" };
        }
        const rng = new RNG(seedFrom(s.character.id, item.uid, Date.now()));
        const res = upgradeItem(rng, item);
        const inv = [...s.inventory];
        if (res.result === "destroy") {
          inv.splice(idx, 1);
          s.pushToast({ text: "Предмет разрушен при усилении!", tone: "bad" });
        } else if (res.item) {
          inv[idx] = res.item;
          if (res.result === "success") s.pushToast({ text: `Усиление успешно (+${res.item.upgradeLevel}).`, tone: "good" });
          else s.pushToast({ text: "Усиление не удалось.", tone: "info" });
        }
        set({
          character: { ...s.character, gold: s.character.gold - row.goldCost, abyssDust: s.character.abyssDust - row.dustCost },
          inventory: inv,
        });
        return { result: res.result };
      },

      salvage: (uids) => {
        const s = get();
        if (!s.character) return { materials: 0, dust: 0, shards: 0 };
        let mats = 0;
        let dust = 0;
        let shards = 0;
        const essences: Record<string, number> = { ess_shimmering: 0, ess_radiant: 0, ess_absolute: 0 };
        const inv = [...s.inventory];
        const equippedSet = new Set(Object.values(s.equipped).filter(Boolean) as string[]);
        const lockedSet = new Set(s.lockedItems);
        for (const uid of uids) {
          if (equippedSet.has(uid) || lockedSet.has(uid)) continue;
          const idx = inv.findIndex((i) => i.uid === uid);
          if (idx === -1) continue;
          const it = inv[idx]!;
          const y = SALVAGE_YIELD[it.rarity];
          mats += y.materials;
          dust += y.dust;
          shards += y.shards;
          // Essence drop based on rarity quality tier (with chance for higher rarities)
          const essenceQuality = ESSENCE_FROM_RARITY[it.rarity];
          if (essenceQuality) {
            // 100% drop 1 essence, 30% drop 2nd, 10% drop 3rd for higher rarities
            essences[`ess_${essenceQuality}`] = (essences[`ess_${essenceQuality}`] ?? 0) + 1;
            if (Math.random() < 0.3) essences[`ess_${essenceQuality}`] = (essences[`ess_${essenceQuality}`] ?? 0) + 1;
            if (it.rarity === "mythic" || it.rarity === "abyssal") {
              if (Math.random() < 0.5) essences[`ess_${essenceQuality}`] = (essences[`ess_${essenceQuality}`] ?? 0) + 1;
            }
          }
          inv.splice(idx, 1);
        }
        const materials: Record<string, number> = { ...s.materials, mat_iron: (s.materials["mat_iron"] ?? 0) + mats };
        for (const [k, v] of Object.entries(essences)) {
          if (v > 0) materials[k] = (materials[k] ?? 0) + v;
        }
        set({
          inventory: inv,
          materials,
          character: { ...s.character, abyssDust: s.character.abyssDust + dust, shards: s.character.shards + shards },
        });
        const essParts = Object.entries(essences).filter(([, v]) => v > 0).map(([k, v]) => `+${v} ${k.replace("ess_", "")}`).join(", ");
        s.pushToast({ text: `Распылено: +${mats} железа, +${dust} пыли, +${shards} шардов${essParts ? ", " + essParts : ""}.`, tone: "good" });
        return { materials: mats, dust, shards };
      },

      sell: (uids) => {
        const s = get();
        if (!s.character) return 0;
        let gold = 0;
        const inv = [...s.inventory];
        const equippedSet = new Set(Object.values(s.equipped).filter(Boolean) as string[]);
        for (const uid of uids) {
          if (equippedSet.has(uid)) continue;
          const idx = inv.findIndex((i) => i.uid === uid);
          if (idx === -1) continue;
          const it = inv[idx]!;
          const base = ITEMS[it.baseId];
          if (!base) continue;
          gold += Math.round(base.sellValue * ECONOMY.SHOP_SELL_MULT * (1 + it.upgradeLevel * 0.25));
          inv.splice(idx, 1);
        }
        set({ inventory: inv, character: { ...s.character, gold: s.character.gold + gold } });
        s.pushToast({ text: `Продано на ${gold} золота.`, tone: "good" });
        return gold;
      },

      // ================ SOCKETS & GEMS ================
      socketGem: (itemUid, slotIndex, gemBaseId) => {
        const s = get();
        const idx = s.inventory.findIndex((i) => i.uid === itemUid);
        if (idx === -1) return { ok: false, error: "no item" };
        const item = s.inventory[idx]!;
        if (!item.sockets || slotIndex >= item.sockets.length) return { ok: false, error: "no socket" };
        if ((s.gems[gemBaseId] ?? 0) < 1) return { ok: false, error: "no gem" };
        const newSockets = [...item.sockets];
        newSockets[slotIndex] = gemBaseId;
        const inv = [...s.inventory];
        inv[idx] = { ...item, sockets: newSockets };
        const gems = { ...s.gems, [gemBaseId]: s.gems[gemBaseId]! - 1 };
        set({ inventory: inv, gems });
        s.pushToast({ text: `Гем вставлен.`, tone: "good" });
        return { ok: true };
      },
      unsocketGem: (itemUid, slotIndex) => {
        const s = get();
        const idx = s.inventory.findIndex((i) => i.uid === itemUid);
        if (idx === -1) return { ok: false };
        const item = s.inventory[idx]!;
        if (!item.sockets || !item.sockets[slotIndex]) return { ok: false };
        const cost = 200;
        if (!s.character || s.character.gold < cost) {
          s.pushToast({ text: `Нужно ${cost} золота.`, tone: "bad" });
          return { ok: false };
        }
        const gemBase = item.sockets[slotIndex]!;
        const newSockets = [...item.sockets];
        newSockets[slotIndex] = null;
        const inv = [...s.inventory];
        inv[idx] = { ...item, sockets: newSockets };
        const gems = { ...s.gems, [gemBase]: (s.gems[gemBase] ?? 0) + 1 };
        set({ inventory: inv, gems, character: { ...s.character, gold: s.character.gold - cost } });
        s.pushToast({ text: `Гем извлечён.`, tone: "good" });
        return { ok: true };
      },
      reforgeItem: (uid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no char" };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx === -1) return { ok: false, error: "no item" };
        const item = s.inventory[idx]!;
        const cost = 500 + item.level * 40;
        const dustCost = 10 + item.level;
        if (s.character.gold < cost || s.character.abyssDust < dustCost) {
          s.pushToast({ text: "Недостаточно ресурсов для перековки.", tone: "bad" });
          return { ok: false, error: "insufficient" };
        }
        const rng = new RNG(seedFrom(s.character.id, item.uid, Date.now() + 999));
        const newAffixes = item.affixes.map((a) => ({ ...a, value: Math.round(a.value * rng.range(0.6, 1.4)) }));
        const inv = [...s.inventory];
        inv[idx] = { ...item, affixes: newAffixes };
        set({
          character: { ...s.character, gold: s.character.gold - cost, abyssDust: s.character.abyssDust - dustCost },
          inventory: inv,
        });
        s.pushToast({ text: "Предмет перекован.", tone: "good" });
        return { ok: true };
      },

      // ============= DEEP CRAFTING =============
      transmute: (uid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx < 0) return { ok: false, error: "Предмет не найден." };
        const item = s.inventory[idx]!;
        const base = ITEMS[item.baseId];
        if (!base) return { ok: false, error: "База не найдена." };
        const cost = TRANSMUTE_COST[item.rarity];
        if (cost.gold > s.character.gold) return { ok: false, error: `Нужно ${cost.gold} золота.` };
        if (cost.shards > s.character.shards) return { ok: false, error: `Нужно ${cost.shards} шардов.` };
        if (cost.essence) {
          const have = s.materials[`ess_${cost.essence}`] ?? 0;
          if (have < cost.essenceQty) return { ok: false, error: `Нужно ${cost.essenceQty} ${cost.essence} эссенций.` };
        }
        const rng = new RNG(seedFrom(s.character.id, uid, Date.now()));
        const r = transmuteItem(rng, item, base);
        if (!r.ok || !r.item) return { ok: false, error: "Уже максимальная редкость." };
        const inv = [...s.inventory];
        inv[idx] = r.item;
        const mats = { ...s.materials };
        if (cost.essence) mats[`ess_${cost.essence}`] = (mats[`ess_${cost.essence}`] ?? 0) - cost.essenceQty;
        set({
          character: { ...s.character, gold: s.character.gold - cost.gold, shards: s.character.shards - cost.shards },
          inventory: inv,
          materials: mats,
          craftingStats: { ...s.craftingStats, itemsCrafted: s.craftingStats.itemsCrafted + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `Трансмутация: ${item.rarity} → ${r.item.rarity}.`, tone: "epic" as const }],
        });
        return { ok: true };
      },
      reroll: (uid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx < 0) return { ok: false, error: "Предмет не найден." };
        const item = s.inventory[idx]!;
        const base = ITEMS[item.baseId];
        if (!base) return { ok: false, error: "База не найдена." };
        const cost = REROLL_COST[item.rarity];
        if (s.character.gold < cost.gold) return { ok: false, error: `Нужно ${cost.gold} золота.` };
        if (s.character.shards < cost.shards) return { ok: false, error: `Нужно ${cost.shards} шардов.` };
        const rng = new RNG(seedFrom(s.character.id, uid, Date.now() + 1));
        const newItem = rerollAffixes(rng, item, base);
        const inv = [...s.inventory];
        inv[idx] = newItem;
        set({
          character: { ...s.character, gold: s.character.gold - cost.gold, shards: s.character.shards - cost.shards },
          inventory: inv,
          toasts: [...s.toasts, { id: genId("tst"), text: "Аффиксы переброшены.", tone: "good" as const }],
        });
        return { ok: true };
      },
      tierUp: (uid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const idx = s.inventory.findIndex((i) => i.uid === uid);
        if (idx < 0) return { ok: false, error: "Предмет не найден." };
        const item = s.inventory[idx]!;
        const base = ITEMS[item.baseId];
        if (!base) return { ok: false, error: "База не найдена." };
        const cost = TIER_UPGRADE_COST;
        if (s.character.gold < cost.gold) return { ok: false, error: `Нужно ${cost.gold} золота.` };
        if (s.character.shards < cost.shards) return { ok: false, error: `Нужно ${cost.shards} шардов.` };
        if (s.character.abyssDust < cost.dust) return { ok: false, error: `Нужно ${cost.dust} пыли.` };
        const have = s.materials[`ess_${cost.essence}`] ?? 0;
        if (have < cost.essenceQty) return { ok: false, error: `Нужно ${cost.essenceQty} ${cost.essence} эссенций.` };
        const rng = new RNG(seedFrom(s.character.id, uid, Date.now() + 2));
        const r = tierUpgradeItem(rng, item, base);
        if (!r.ok || !r.item) return { ok: false, error: "Достигнут потолок уровня." };
        const inv = [...s.inventory];
        inv[idx] = r.item;
        const mats = { ...s.materials, [`ess_${cost.essence}`]: have - cost.essenceQty };
        set({
          character: { ...s.character, gold: s.character.gold - cost.gold, shards: s.character.shards - cost.shards, abyssDust: s.character.abyssDust - cost.dust },
          inventory: inv,
          materials: mats,
          toasts: [...s.toasts, { id: genId("tst"), text: `Тир повышен до ур. ${r.item.level}.`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ SKILLS ================
      allocateSkill: (nodeId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no char" };
        if (s.skillPoints < 1) return { ok: false, error: "no points" };
        const node = SKILLS[nodeId];
        if (!node) return { ok: false, error: "no node" };
        if (node.classId !== s.character.classId) return { ok: false, error: "wrong class" };
        const cur = s.skillAllocation[nodeId] ?? 0;
        if (cur >= node.maxRank) return { ok: false, error: "maxed" };
        if (node.requires) {
          for (const req of node.requires) {
            if ((s.skillAllocation[req] ?? 0) < 1) return { ok: false, error: `Требуется: ${SKILLS[req]?.name}` };
          }
        }
        // Level gate
        const tierLevels = { 1: 1, 2: 8, 3: 18, 4: 35 };
        if (s.character.level < tierLevels[node.tier]) {
          s.pushToast({ text: `Требуется уровень ${tierLevels[node.tier]}.`, tone: "bad" });
          return { ok: false };
        }
        set({
          skillPoints: s.skillPoints - 1,
          skillAllocation: { ...s.skillAllocation, [nodeId]: cur + 1 },
        });
        s.pushToast({ text: `${node.name}: +1 ранг.`, tone: "good" });
        return { ok: true };
      },
      resetSkills: () => {
        const s = get();
        if (!s.character || s.character.gold < 2000) {
          s.pushToast({ text: "Сброс стоит 2000 золота.", tone: "bad" });
          return;
        }
        const totalInvested = Object.values(s.skillAllocation).reduce((a, b) => a + (b as number), 0);
        set({
          character: { ...s.character, gold: s.character.gold - 2000 },
          skillAllocation: {},
          skillPoints: s.skillPoints + totalInvested,
        });
        s.pushToast({ text: `Сброшено: +${totalInvested} очков.`, tone: "good" });
      },
      allocateParagon: (kind) => {
        const s = get();
        if (s.paragonPoints < 1) return;
        set({
          paragon: { ...s.paragon, [kind]: s.paragon[kind] + 1 },
          paragonPoints: s.paragonPoints - 1,
        });
      },

      // ================ QUESTS ================
      acceptQuest: (questId) => {
        const s = get();
        const def = QUESTS[questId];
        if (!def) return;
        if (s.quests[questId]?.status === "active") return;
        set({
          quests: { ...s.quests, [questId]: { questId, status: "active", startedAt: Date.now(), objectives: {} } },
        });
        s.pushToast({ text: `Взят квест: ${def.name}`, tone: "info" });
      },
      claimQuest: (questId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const qp = s.quests[questId];
        if (!qp || qp.status !== "completed") return { ok: false };
        const def = QUESTS[questId];
        if (!def) return { ok: false };
        const char = { ...s.character };
        if (def.rewards.gold) char.gold += def.rewards.gold;
        if (def.rewards.xp) char.xp += def.rewards.xp;
        if (def.rewards.shards) char.shards += def.rewards.shards;
        if (def.rewards.abyssDust) char.abyssDust += def.rewards.abyssDust;
        const skillPoints = s.skillPoints + (def.rewards.skillPoints ?? 0);
        const unlockedTitles = def.rewards.title && !s.unlockedTitles.includes(def.rewards.title)
          ? [...s.unlockedTitles, def.rewards.title]
          : s.unlockedTitles;
        const inv = [...s.inventory];
        const mats = { ...s.materials };
        for (const r of def.rewards.items ?? []) {
          const base = ITEMS[r.baseId];
          if (!base) continue;
          if (base.slot === "material") mats[r.baseId] = (mats[r.baseId] ?? 0) + r.qty;
          else {
            for (let i = 0; i < r.qty; i++) {
              inv.push({ uid: genId("it"), baseId: r.baseId, rarity: "common", level: base.levelReq ?? 1, affixes: [], upgradeLevel: 0, createdAt: Date.now() });
            }
          }
        }
        // Chain quest
        const quests = { ...s.quests };
        quests[questId] = { ...qp, status: "claimed", claimedAt: Date.now() };
        if (def.chain && QUESTS[def.chain]) {
          quests[def.chain] = { questId: def.chain, status: "active", startedAt: Date.now(), objectives: {} };
        }
        set({ character: char, inventory: inv, materials: mats, skillPoints, unlockedTitles, quests });
        s.pushToast({ text: `Награда получена: ${def.name}!`, tone: "epic" });
        return { ok: true };
      },
      claimAchievement: (achId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const a = s.achievements[achId];
        if (!a?.unlocked || a.claimedAt) return { ok: false };
        const def = ACHIEVEMENTS[achId];
        if (!def) return { ok: false };
        const char = { ...s.character };
        if (def.reward.gold) char.gold += def.reward.gold;
        if (def.reward.xp) char.xp += def.reward.xp;
        if (def.reward.shards) char.shards += def.reward.shards;
        set({
          character: char,
          achievements: { ...s.achievements, [achId]: { ...a, claimedAt: Date.now() } },
        });
        return { ok: true };
      },

      setActiveTitle: (title) => set({ activeTitle: title }),
      enterMapNode: (nodeId) => {
        const s = get();
        const node = WORLD_MAP.find((n) => n.id === nodeId);
        if (!node) return;
        if (!s.mapProgress.unlocked.includes(nodeId)) {
          s.pushToast({ text: "Узел не разблокирован.", tone: "bad" });
          return;
        }
        if (node.dungeonId && node.kind !== "town") {
          get().beginDungeon(node.dungeonId);
        } else if (node.kind === "town") {
          set({ screen: "home" });
        }
      },

      refreshLeaderboard: () => {
        const s = get();
        if (!s.character) return;
        const me: LeaderboardEntry = {
          playerId: s.character.id,
          playerName: s.activeTitle ? `${s.character.classId} «${s.activeTitle}»` : s.character.classId,
          classId: s.character.classId,
          level: s.character.level,
          deepestDungeon: Object.keys(s.dungeonsCleared).sort((a, b) => (DUNGEONS[b]?.difficulty ?? 0) - (DUNGEONS[a]?.difficulty ?? 0))[0] ?? null,
          totalKills: s.totalKills,
          hardcoreRank: s.character.hardcoreMode ? s.hardcoreStreak : 0,
          achievementPoints: Object.values(s.achievements)
            .filter((a: any) => a.unlocked)
            .reduce((sum, a: any) => {
              const id = Object.keys(s.achievements).find((k) => s.achievements[k] === a);
              return sum + (id ? (ACHIEVEMENTS[id]?.points ?? 0) : 0);
            }, 0 as number),
          updatedAt: Date.now(),
        };
        // Simulate other players
        const fakes: LeaderboardEntry[] = [
          { playerId: "p_1", playerName: "Kaelthas", classId: "runesmith", level: 48, deepestDungeon: "dng_abyss_01", totalKills: 3400, hardcoreRank: 28, achievementPoints: 2100, updatedAt: Date.now() },
          { playerId: "p_2", playerName: "Nova «Мифолог»", classId: "voidcaller", level: 52, deepestDungeon: "dng_depths", totalKills: 4200, hardcoreRank: 12, achievementPoints: 2850, updatedAt: Date.now() },
          { playerId: "p_3", playerName: "Grimrook «Страж»", classId: "warden", level: 40, deepestDungeon: "dng_infernal_01", totalKills: 2100, hardcoreRank: 45, achievementPoints: 1500, updatedAt: Date.now() },
          { playerId: "p_4", playerName: "Faela", classId: "beastbound", level: 36, deepestDungeon: "dng_ashen", totalKills: 1800, hardcoreRank: 0, achievementPoints: 1100, updatedAt: Date.now() },
          { playerId: "p_5", playerName: "Orin «Запредельный»", classId: "runesmith", level: 58, deepestDungeon: "dng_celestial_trial", totalKills: 6200, hardcoreRank: 72, achievementPoints: 4100, updatedAt: Date.now() },
          { playerId: "p_6", playerName: "Sylvara", classId: "voidcaller", level: 32, deepestDungeon: "dng_void_shrine", totalKills: 1200, hardcoreRank: 0, achievementPoints: 900, updatedAt: Date.now() },
        ];
        const all = [me, ...fakes].sort((a, b) => b.achievementPoints - a.achievementPoints);
        set({ leaderboard: all });
      },

      // ================ STASH / LOCK / LOADOUTS ================
      moveToStash: (uid) => set((s) => {
        const it = s.inventory.find((i) => i.uid === uid);
        if (!it) return s;
        if (Object.values(s.equipped).includes(uid)) {
          return { toasts: [...s.toasts, { id: genId("tst"), text: "Снимите предмет перед переносом в стэш.", tone: "bad" as const }] };
        }
        return { inventory: s.inventory.filter((i) => i.uid !== uid), stash: [...s.stash, it] };
      }),
      takeFromStash: (uid) => set((s) => {
        const it = s.stash.find((i) => i.uid === uid);
        if (!it) return s;
        return { stash: s.stash.filter((i) => i.uid !== uid), inventory: [...s.inventory, it] };
      }),
      lockItem: (uid) => set((s) => ({ lockedItems: s.lockedItems.includes(uid) ? s.lockedItems : [...s.lockedItems, uid] })),
      unlockItem: (uid) => set((s) => ({ lockedItems: s.lockedItems.filter((x) => x !== uid) })),
      equipLoadout: (id) => set((s) => {
        const ld = s.loadouts.find((l) => l.id === id);
        if (!ld) return s;
        // Only equip items that still exist in inventory
        const nextEq: Record<string, string | null> = {};
        for (const [slot, uid] of Object.entries(ld.equipped)) {
          if (uid && s.inventory.some((i) => i.uid === uid)) nextEq[slot] = uid;
          else nextEq[slot] = null;
        }
        return { equipped: nextEq, toasts: [...s.toasts, { id: genId("tst"), text: `Комплект «${ld.name}» надет.`, tone: "good" as const }] };
      }),

      // ================ TOWER ================
      enterTower: () => {
        const s = get();
        if (!s.character) return;
        if (s.tower.active) { s.pushToast({ text: "Вы уже в Башне.", tone: "info" }); return; }
        if (s.character.gold < TOWER_CONFIG.entryCost.gold) { s.pushToast({ text: `Нужно ${TOWER_CONFIG.entryCost.gold} золота для входа.`, tone: "bad" }); return; }
        set({
          character: { ...s.character, gold: s.character.gold - TOWER_CONFIG.entryCost.gold },
          tower: { ...s.tower, currentFloor: 1, active: true, currentScore: 0, lastEntryAt: Date.now() },
          toasts: [...s.toasts, { id: genId("tst"), text: `Вы входите в Башню Бездны. Этаж 1.`, tone: "epic" as const }],
        });
      },
      towerNext: () => {
        const s = get();
        if (!s.tower.active || !s.character) return;
        const nextFloor = s.tower.currentFloor + 1;
        const biome = towerBiomeForFloor(nextFloor);
        const scaling = towerScaling(nextFloor);
        const bossId = TOWER_BOSS_FLOORS[nextFloor];
        const enemyId = bossId ?? biome.monsterPool[Math.floor(Math.random() * biome.monsterPool.length)]!;
        const enemy = (bossId ? BOSSES[enemyId] : MONSTERS[enemyId]) ?? MONSTERS[enemyId];
        if (!enemy) { s.pushToast({ text: "Ошибка генерации этажа.", tone: "bad" }); return; }
        const enemyMaxHp = Math.round(enemy.stats.maxHp * scaling.hpMult);
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        get().progressBpMission("bm_d_tower_5", 1);
        get().progressBpMission("bm_w_tower_30", 1);
        set({
          tower: { ...s.tower, currentFloor: nextFloor, highestFloor: Math.max(s.tower.highestFloor, nextFloor) },
          combat: {
            dungeonId: `tower_${nextFloor}`,
            room: nextFloor,
            totalRooms: 999,
            isBossRoom: !!bossId,
            player: {
              id: "player", name: s.character.classId,
              hp: s.combat?.player.hp ?? derived.maxHp,
              maxHp: derived.maxHp,
              mana: s.combat?.player.mana ?? derived.maxMana,
              maxMana: derived.maxMana,
              statuses: [], abilityCooldowns: {},
            },
            enemy: {
              id: enemy.id, name: enemy.name, hp: enemyMaxHp, maxHp: enemyMaxHp,
              mana: enemy.stats.maxMana, maxMana: enemy.stats.maxMana,
              statuses: [], abilityCooldowns: {},
            },
            enemyDef: enemy as MonsterDef,
            rngSeed: seedFrom(s.character.id, "tower", nextFloor),
            turn: 0,
            log: [{ turn: 0, text: `Этаж ${nextFloor}: ${biome.biome}. ${enemy.name} ждёт.`, tone: "info" }],
            aggregatedLoot: [], aggregatedGold: 0, aggregatedXp: 0, aggregatedMats: {},
            damageDealtTotal: 0, ended: false, victory: false, rewardsApplied: false,
          },
          screen: "active_combat",
        });
      },
      exitTower: (save) => set((s) => {
        const score = s.tower.currentScore;
        const newBest = Math.max(s.tower.bestScore, score);
        if (save && s.character) {
          const goldBonus = Math.floor(score * 1.5);
          const xpBonus = Math.floor(score * 0.8);
          const newGold = s.character.gold + goldBonus;
          const newXp = s.character.xp + xpBonus;
          return {
            character: { ...s.character, gold: newGold, xp: newXp },
            tower: { ...s.tower, active: false, currentFloor: 0, bestScore: newBest, currentScore: 0 },
            toasts: [...s.toasts, { id: genId("tst"), text: `Выход из Башни: +${goldBonus}g, +${xpBonus}xp.`, tone: "good" as const }],
          };
        }
        return {
          tower: { ...s.tower, active: false, currentFloor: 0, bestScore: newBest, currentScore: 0 },
        };
      }),

      // ================ ECHO RIFTS ================
      runEchoRift: (tier) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const t = ECHO_RIFT_TIERS.find((x) => x.tier === tier);
        if (!t) return { ok: false, error: "Тир не найден." };
        if (s.character.level < t.levelMin) return { ok: false, error: `Нужен уровень ${t.levelMin}.` };
        if (s.echoRifts.highestTier + 1 < tier) return { ok: false, error: `Сначала пройди тир ${s.echoRifts.highestTier + 1}.` };
        // Plan v9: daily cap + energy
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.echoRiftAttempts >= 8) return { ok: false, error: "Дневной лимит Эхо-Рифтов (8/8)." };
        const e = regenEnergy(s.energy);
        if (e.current < 20) return { ok: false, error: `Нужно 20 энергии (есть ${Math.floor(e.current)}).` };
        set({
          energy: { ...e, current: e.current - 20 },
          dailyCounters: { ...dc, echoRiftAttempts: dc.echoRiftAttempts + 1 },
        });

        const seed = Date.now() + tier * 1000;
        const rngFn = (() => {
          let x: number = seed;
          return () => {
            x = (x * 1664525 + 1013904223) | 0;
            return ((x >>> 0) / 0x100000000);
          };
        })();
        const affixes = rollEchoRiftAffixes(t, rngFn);

        // Combine multipliers
        let goldMult = 1, xpMult = 1, qualityMult = 1, quantityMult = 1;
        for (const a of affixes) {
          if (a.goldMult) goldMult *= a.goldMult;
          if (a.xpMult) xpMult *= a.xpMult;
          if (a.lootQualityMult) qualityMult *= a.lootQualityMult;
          if (a.lootQuantityMult) quantityMult *= a.lootQuantityMult;
        }

        // Rough simulation: success based on player level vs tier scaling
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const playerPower = derived.attack + derived.spellPower * 0.7 + derived.maxHp * 0.5 + derived.defense * 2;
        const targetPower = 200 + tier * 250;
        const successRoll = Math.random() + (playerPower - targetPower) / Math.max(1, targetPower) * 0.4;
        const success = successRoll > 0.5;

        if (!success) {
          // Failed — small consolation, lose hp
          const goldLoss = Math.floor(s.character.gold * 0.05);
          set({
            character: { ...s.character, gold: Math.max(0, s.character.gold - goldLoss), hpCurrent: 1 },
            toasts: [...s.toasts, { id: genId("tst"), text: `Поражение в Эхо-Рифте ${t.ru}. Потеря: ${goldLoss}g.`, tone: "bad" as const }],
          });
          return { ok: true, gold: -goldLoss, xp: 0 };
        }

        // Success
        const gold = Math.round(t.baseGold * goldMult);
        const xp = Math.round(t.baseXp * xpMult);
        const newPity = s.echoRifts.pityCounter + 1;
        const pityTriggered = newPity >= ECHO_RIFT_PITY_INTERVAL;

        // Roll loot
        const charLevel = s.character.level;
        const lootRng = new RNG(seedFrom(`rift_${tier}_${Date.now()}`));
        const newLoot: ItemInstance[] = [];
        const lootCount = Math.max(1, Math.round(2 * quantityMult));
        for (let i = 0; i < lootCount; i++) {
          const pool = Object.values(ITEMS).filter((it) => it.slot !== "consumable" && it.slot !== "material" && it.slot !== "rune" && (it.levelReq ?? 1) <= charLevel + 5 && (it.levelReq ?? 1) >= Math.max(1, charLevel - 10));
          if (pool.length === 0) continue;
          const base = pool[Math.floor(lootRng.next() * pool.length)];
          if (!base) continue;
          let rarityFloor = t.rarityFloor;
          if (pityTriggered && i === 0) rarityFloor = "mythic";
          const inst = createItemInstance(lootRng, base, { level: base.levelReq ?? charLevel, magicFindPct: s.character.stats.luck * 3 + Math.round((qualityMult - 1) * 100), rarityOverride: { [rarityFloor]: 100 } as Partial<Record<RarityId, number>> });
          newLoot.push(inst);
        }

        const updatedRifts = {
          highestTier: Math.max(s.echoRifts.highestTier, tier),
          clears: s.echoRifts.clears + 1,
          pityCounter: pityTriggered ? 0 : newPity,
          bestRunGold: Math.max(s.echoRifts.bestRunGold, gold),
        };

        // Treat drops scale with tier
        const newMats = { ...s.materials };
        const treatPool = ["treat_jerky", "treat_honey", "treat_emberberry", "treat_iceshard_candy", "treat_phoenix_feast", "treat_arcane_cookie", "treat_void_truffle", "treat_golem_grit", "treat_eternal_ambrosia"];
        const treatTier = Math.min(treatPool.length - 1, Math.floor(tier / 2));
        const treatId = treatPool[treatTier]!;
        if (Math.random() < 0.6) {
          newMats[treatId] = (newMats[treatId] ?? 0) + 1;
        }

        set({
          character: { ...s.character, gold: s.character.gold + gold, xp: s.character.xp + xp },
          inventory: [...s.inventory, ...newLoot],
          materials: newMats,
          echoRifts: updatedRifts,
          lootReveal: newLoot.length ? newLoot : null,
          toasts: [...s.toasts, { id: genId("tst"), text: `Эхо-Рифт ${t.ru}: +${gold}g, +${xp} XP, +${newLoot.length} предметов.${pityTriggered ? " 🌟 PITY!" : ""}`, tone: "epic" as const }],
        });

        return { ok: true, gold, xp };
      },

      // ================ MARKETPLACE ================
      marketRefresh: () => {
        const s = get();
        const now = Date.now();
        // Drop expired listings (refund to stash for owner; NPC ones disappear)
        const live = s.market.listings.filter((l) => l.expiresAt > now);
        const expired = s.market.listings.filter((l) => l.expiresAt <= now);
        let stash = s.stash;
        let toasts = s.toasts;
        for (const l of expired) {
          if (l.isMine) {
            stash = [...stash, l.item];
            toasts = [...toasts, { id: genId("tst"), text: `Лот «${ITEMS[l.item.baseId]?.name ?? "предмет"}» истёк, возвращён в стэш.`, tone: "info" as const }];
          }
        }
        // NPC sells: every minute remove ~10% of mine if priced under 1.5x sellValue
        const myListings = live.filter((l) => l.isMine);
        const otherListings = live.filter((l) => !l.isMine);
        let goldEarned = 0;
        let salesAdded: MarketSale[] = [];
        const remainingMine: MarketListing[] = [];
        for (const l of myListings) {
          const base = ITEMS[l.item.baseId];
          const fairPrice = (base?.sellValue ?? 100) * 4 * (1 + (["common","uncommon","rare","epic","legendary","mythic","abyssal"].indexOf(l.item.rarity) * 0.5));
          const undercut = Math.max(0, (fairPrice - l.price) / fairPrice);
          const ageHours = (now - l.listedAt) / 3_600_000;
          const sellChance = Math.min(0.6, undercut * 0.4 + ageHours * 0.05);
          if (Math.random() < sellChance) {
            // Sold!
            const tax = Math.floor(l.price * 0.10);
            const net = l.price - tax;
            goldEarned += net;
            const buyerNames = ["Аноним", "Кузнец Тим", "Авантюрист", "Стрелок Зак", "Маг Лин", "Жнец", "Старатель"];
            const buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)] ?? "NPC";
            salesAdded.push({
              id: genId("ms"),
              itemBaseId: l.item.baseId,
              itemName: ITEMS[l.item.baseId]?.name ?? "предмет",
              rarity: l.item.rarity,
              price: l.price,
              buyerName,
              at: now,
            });
          } else {
            remainingMine.push(l);
          }
        }
        // Refresh NPC seed listings: keep up to 12 NPC listings
        let seeded = otherListings;
        if (seeded.length < 12) {
          const pool = Object.values(ITEMS).filter((it) => it.slot !== "consumable" && it.slot !== "material" && it.slot !== "rune" && (it.levelReq ?? 1) <= (s.character?.level ?? 1) + 8);
          for (let i = seeded.length; i < 12 && pool.length > 0; i++) {
            const base = pool[Math.floor(Math.random() * pool.length)];
            if (!base) continue;
            const rng = new RNG(seedFrom(`mkt_${now}_${i}`));
            const inst = createItemInstance(rng, base, { level: base.levelReq ?? 1, magicFindPct: 0 });
            const fairPrice = (base.sellValue ?? 100) * 4 * (1 + (["common","uncommon","rare","epic","legendary","mythic","abyssal"].indexOf(inst.rarity) * 0.5));
            const variance = 0.6 + Math.random() * 0.8;
            seeded.push({
              id: genId("mkt"),
              item: inst,
              price: Math.round(fairPrice * variance),
              sellerId: `npc_${i}`,
              sellerName: ["Купец", "Торговец", "Авантюрист", "Старьёвщик", "Кузнец"][i % 5] ?? "NPC",
              listedAt: now - Math.floor(Math.random() * 3_600_000),
              expiresAt: now + Math.floor(Math.random() * 48 * 3_600_000),
              isMine: false,
            });
          }
        }
        const newHistory = [...salesAdded, ...s.market.history].slice(0, 50);
        if (goldEarned > 0 && s.character) {
          toasts = [...toasts, { id: genId("tst"), text: `Маркет: продано ${salesAdded.length} лотов. +${goldEarned}g.`, tone: "good" as const }];
        }
        // Title unlock: 10 sales → "Торговец", 50 sales → "Купец"
        let unlockedTitles = s.unlockedTitles;
        if (newHistory.length >= 10 && !unlockedTitles.includes("title_merchant")) {
          unlockedTitles = [...unlockedTitles, "title_merchant"];
          toasts = [...toasts, { id: genId("tst"), text: "Титул разблокирован: Торговец", tone: "good" as const }];
        }
        if (newHistory.length >= 50 && !unlockedTitles.includes("title_magnate")) {
          unlockedTitles = [...unlockedTitles, "title_magnate"];
          toasts = [...toasts, { id: genId("tst"), text: "Титул разблокирован: Магнат Бездны", tone: "good" as const }];
        }
        set({
          market: { ...s.market, listings: [...remainingMine, ...seeded], history: newHistory },
          stash,
          character: s.character && goldEarned > 0 ? { ...s.character, gold: s.character.gold + goldEarned } : s.character,
          toasts,
          unlockedTitles,
        });
      },

      marketList: (uid, price) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const it = s.inventory.find((i) => i.uid === uid) ?? s.stash.find((i) => i.uid === uid);
        if (!it) return { ok: false, error: "Предмет не найден." };
        if (Object.values(s.equipped).includes(uid)) return { ok: false, error: "Снимите экипировку." };
        if (s.lockedItems.includes(uid)) return { ok: false, error: "Предмет заблокирован." };
        if (price < 10) return { ok: false, error: "Минимальная цена 10g." };
        const myActive = s.market.listings.filter((l) => l.isMine).length;
        if (myActive >= s.market.maxActiveListings) return { ok: false, error: `Лимит активных лотов: ${s.market.maxActiveListings}.` };
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.marketListings >= 5) return { ok: false, error: "Дневной лимит выставлений (5/5)." };
        const listingFee = Math.max(50, Math.floor(price * 0.05));
        if (s.character.gold < listingFee) return { ok: false, error: `Нужно ${listingFee}g для оплаты комиссии.` };
        const now = Date.now();
        const listing: MarketListing = {
          id: genId("mkt"),
          item: it,
          price,
          sellerId: s.character.id,
          sellerName: s.character.classId,
          listedAt: now,
          expiresAt: now + 48 * 3_600_000,
          isMine: true,
        };
        set({
          inventory: s.inventory.filter((i) => i.uid !== uid),
          stash: s.stash.filter((i) => i.uid !== uid),
          character: { ...s.character, gold: s.character.gold - listingFee },
          market: { ...s.market, listings: [listing, ...s.market.listings] },
          dailyCounters: { ...dc, marketListings: dc.marketListings + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `Лот выставлен. Комиссия: ${listingFee}g. (${dc.marketListings + 1}/5 за день)`, tone: "info" as const }],
        });
        return { ok: true };
      },

      marketBuy: (listingId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const l = s.market.listings.find((x) => x.id === listingId);
        if (!l) return { ok: false, error: "Лот не найден." };
        if (l.isMine) return { ok: false, error: "Это ваш лот." };
        if (s.character.gold < l.price) return { ok: false, error: `Не хватает золота: ${l.price}g.` };
        set({
          character: { ...s.character, gold: s.character.gold - l.price },
          inventory: [...s.inventory, l.item],
          market: { ...s.market, listings: s.market.listings.filter((x) => x.id !== listingId) },
          toasts: [...s.toasts, { id: genId("tst"), text: `Куплено: ${ITEMS[l.item.baseId]?.name ?? "предмет"} за ${l.price}g.`, tone: "good" as const }],
        });
        return { ok: true };
      },

      marketCancel: (listingId) => {
        const s = get();
        const l = s.market.listings.find((x) => x.id === listingId);
        if (!l || !l.isMine) return { ok: false, error: "Лот не найден." };
        set({
          stash: [...s.stash, l.item],
          market: { ...s.market, listings: s.market.listings.filter((x) => x.id !== listingId) },
          toasts: [...s.toasts, { id: genId("tst"), text: "Лот снят, предмет в стэше.", tone: "info" as const }],
        });
        return { ok: true };
      },

      // ================ AUCTION ================
      auctionRefresh: () => {
        const s = get();
        const now = Date.now();
        // Resolve ended lots first
        const ended = s.auction.lots.filter((l) => l.endsAt <= now);
        const live = s.auction.lots.filter((l) => l.endsAt > now);
        let goldDelta = 0;
        let stash = s.stash;
        let inventory = s.inventory;
        let toasts = s.toasts;
        const historyAdds: AuctionState["history"] = [];
        for (const lot of ended) {
          if (lot.isMine) {
            // I was selling
            if (lot.bids.length > 0) {
              const tax = Math.floor(lot.currentBid * 0.08);
              const net = lot.currentBid - tax;
              goldDelta += net;
              historyAdds.push({ id: genId("auc"), itemName: ITEMS[lot.item.baseId]?.name ?? "предмет", finalPrice: lot.currentBid, won: true, at: now });
              toasts = [...toasts, { id: genId("tst"), text: `Аукцион завершён: продано за ${lot.currentBid}g (после налога: ${net}g).`, tone: "good" as const }];
            } else {
              stash = [...stash, lot.item];
              historyAdds.push({ id: genId("auc"), itemName: ITEMS[lot.item.baseId]?.name ?? "предмет", finalPrice: 0, won: false, at: now });
              toasts = [...toasts, { id: genId("tst"), text: "Аукцион завершён без ставок, предмет в стэше.", tone: "info" as const }];
            }
          } else {
            // NPC was selling — if I had highest bid, I get it (simulate)
            const mine = lot.bids.length > 0 && lot.bids[0]?.bidderName === (s.character?.classId ?? "");
            if (mine) {
              inventory = [...inventory, lot.item];
              historyAdds.push({ id: genId("auc"), itemName: ITEMS[lot.item.baseId]?.name ?? "предмет", finalPrice: lot.currentBid, won: true, at: now });
              toasts = [...toasts, { id: genId("tst"), text: `Вы выиграли аукцион: ${ITEMS[lot.item.baseId]?.name}.`, tone: "epic" as const }];
            }
          }
        }
        // NPC bidder activity on live lots
        const updated = live.map((lot) => {
          // 30% chance per refresh that NPC bids if currentBid is below fair value
          const base = ITEMS[lot.item.baseId];
          const fair = (base?.sellValue ?? 100) * 5;
          if (Math.random() < 0.35 && lot.currentBid < fair * 1.5) {
            const inc = Math.max(50, Math.floor(lot.currentBid * 0.08));
            const newBid = lot.currentBid + inc;
            const npcNames = ["Гильдмастер", "Купец Бездны", "Авантюрист", "Старьёвщик", "Контрабандист"];
            const bidderName = npcNames[Math.floor(Math.random() * npcNames.length)] ?? "NPC";
            // Anti-snipe: if < 5min remaining, extend
            const remaining = lot.endsAt - now;
            const newEnd = remaining < 5 * 60_000 ? now + 5 * 60_000 : lot.endsAt;
            return { ...lot, currentBid: newBid, endsAt: newEnd, bids: [{ bidderName, amount: newBid, at: now }, ...lot.bids].slice(0, 10) };
          }
          return lot;
        });
        // Seed NPC lots if low
        let seeded = updated;
        if (seeded.length < 6) {
          const pool = Object.values(ITEMS).filter((it) => it.slot !== "consumable" && it.slot !== "material" && it.slot !== "rune" && (it.levelReq ?? 1) <= (s.character?.level ?? 1) + 10 && (it.levelReq ?? 1) >= Math.max(1, (s.character?.level ?? 1) - 5));
          for (let i = seeded.length; i < 6 && pool.length > 0; i++) {
            const base = pool[Math.floor(Math.random() * pool.length)];
            if (!base) continue;
            const rng = new RNG(seedFrom(`auc_${now}_${i}`));
            const inst = createItemInstance(rng, base, { level: base.levelReq ?? 1, magicFindPct: 50 });
            const fair = (base.sellValue ?? 100) * 5 * (1 + ["common","uncommon","rare","epic","legendary","mythic","abyssal"].indexOf(inst.rarity) * 0.4);
            const start = Math.round(fair * 0.4);
            const buyout = Math.round(fair * 1.8);
            seeded.push({
              id: genId("auc"),
              item: inst,
              startPrice: start,
              buyoutPrice: buyout,
              currentBid: start,
              bids: [],
              sellerId: `npc_${i}`,
              sellerName: ["Купец", "Торговец", "Реликварий"][i % 3] ?? "NPC",
              startedAt: now,
              endsAt: now + (1 + Math.floor(Math.random() * 24)) * 3_600_000,
              isMine: false,
            });
          }
        }
        set({
          auction: { lots: seeded, history: [...historyAdds, ...s.auction.history].slice(0, 50) },
          stash,
          inventory,
          character: s.character && goldDelta !== 0 ? { ...s.character, gold: s.character.gold + goldDelta } : s.character,
          toasts,
        });
      },

      auctionCreate: (uid, startPrice, buyoutPrice, durationHours) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const it = s.inventory.find((i) => i.uid === uid) ?? s.stash.find((i) => i.uid === uid);
        if (!it) return { ok: false, error: "Предмет не найден." };
        if (Object.values(s.equipped).includes(uid)) return { ok: false, error: "Снимите экипировку." };
        if (s.lockedItems.includes(uid)) return { ok: false, error: "Предмет заблокирован." };
        if (startPrice < 50) return { ok: false, error: "Стартовая цена ≥ 50g." };
        if (buyoutPrice && buyoutPrice <= startPrice) return { ok: false, error: "Цена выкупа должна быть выше старта." };
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.auctionCreates >= 3) return { ok: false, error: "Дневной лимит аукционов (3/3)." };
        const fee = Math.max(100, Math.floor(startPrice * 0.05));
        if (s.character.gold < fee) return { ok: false, error: `Нужно ${fee}g комиссии.` };
        const now = Date.now();
        const lot: AuctionLot = {
          id: genId("auc"),
          item: it,
          startPrice,
          buyoutPrice,
          currentBid: startPrice,
          bids: [],
          sellerId: s.character.id,
          sellerName: s.character.classId,
          startedAt: now,
          endsAt: now + durationHours * 3_600_000,
          isMine: true,
        };
        set({
          inventory: s.inventory.filter((i) => i.uid !== uid),
          stash: s.stash.filter((i) => i.uid !== uid),
          character: { ...s.character, gold: s.character.gold - fee },
          auction: { ...s.auction, lots: [lot, ...s.auction.lots] },
          dailyCounters: { ...dc, auctionCreates: dc.auctionCreates + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `Лот на аукционе. Комиссия: ${fee}g. (${dc.auctionCreates + 1}/3 за день)`, tone: "info" as const }],
        });
        return { ok: true };
      },

      auctionBid: (lotId, amount) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const lot = s.auction.lots.find((l) => l.id === lotId);
        if (!lot) return { ok: false, error: "Лот не найден." };
        if (lot.isMine) return { ok: false, error: "Нельзя ставить на свой лот." };
        if (amount <= lot.currentBid) return { ok: false, error: `Ставка должна быть > ${lot.currentBid}g.` };
        if (s.character.gold < amount) return { ok: false, error: "Не хватает золота." };
        const now = Date.now();
        const remaining = lot.endsAt - now;
        const newEnd = remaining < 5 * 60_000 ? now + 5 * 60_000 : lot.endsAt;
        const bidderName = s.character.classId;
        // Refund previous top bidder if it was me; here we don't refund others (NPCs)
        // But block the gold (escrow): for simplicity, just deduct now and refund if outbid later (omitted).
        // Practical compromise: deduct increment from previous me-bid only.
        const myPrevBid = lot.bids.find((b) => b.bidderName === bidderName)?.amount ?? 0;
        const goldDelta = -(amount - myPrevBid);
        set({
          character: { ...s.character, gold: s.character.gold + goldDelta },
          auction: {
            ...s.auction,
            lots: s.auction.lots.map((l) =>
              l.id === lotId
                ? { ...l, currentBid: amount, endsAt: newEnd, bids: [{ bidderName, amount, at: now }, ...l.bids].slice(0, 10) }
                : l,
            ),
          },
          toasts: [...s.toasts, { id: genId("tst"), text: `Ваша ставка: ${amount}g.`, tone: "info" as const }],
        });
        return { ok: true };
      },

      auctionBuyout: (lotId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const lot = s.auction.lots.find((l) => l.id === lotId);
        if (!lot) return { ok: false, error: "Лот не найден." };
        if (!lot.buyoutPrice) return { ok: false, error: "У лота нет выкупа." };
        if (lot.isMine) return { ok: false, error: "Нельзя выкупать свой лот." };
        if (s.character.gold < lot.buyoutPrice) return { ok: false, error: "Не хватает золота." };
        set({
          character: { ...s.character, gold: s.character.gold - lot.buyoutPrice },
          inventory: [...s.inventory, lot.item],
          auction: {
            lots: s.auction.lots.filter((l) => l.id !== lotId),
            history: [{ id: genId("auc"), itemName: ITEMS[lot.item.baseId]?.name ?? "предмет", finalPrice: lot.buyoutPrice, won: true, at: Date.now() }, ...s.auction.history].slice(0, 50),
          },
          toasts: [...s.toasts, { id: genId("tst"), text: `Выкуплено за ${lot.buyoutPrice}g!`, tone: "good" as const }],
        });
        return { ok: true };
      },

      auctionResolve: () => {
        // Alias for refresh (cron-like).
        get().auctionRefresh();
      },

      // ================ TRADE POST ================
      tradeRefresh: () => {
        const s = get();
        const now = Date.now();
        const dayMs = 24 * 3_600_000;
        let acceptedToday = s.tradePost.acceptedToday;
        let lastResetAt = s.tradePost.lastResetAt;
        if (now - lastResetAt > dayMs) {
          acceptedToday = 0;
          lastResetAt = now;
        }
        // Refresh offers if past TTL or empty
        let offers = s.tradePost.offers.filter((o) => o.expiresAt > now);
        if (offers.length < 3 || now > s.tradePost.refreshAt) {
          const pool = Object.values(ITEMS).filter((it) => (it.slot === "weapon" || it.slot === "amulet" || it.slot === "ring" || it.slot === "relic") && (it.levelReq ?? 1) <= (s.character?.level ?? 1) + 5);
          while (offers.length < 3 && pool.length > 0) {
            const wantBase = pool[Math.floor(Math.random() * pool.length)];
            const giveBase = pool[Math.floor(Math.random() * pool.length)];
            if (!wantBase || !giveBase) break;
            const wantRarity = ["rare", "epic", "legendary"][Math.floor(Math.random() * 3)] ?? "rare";
            const npcs = [
              { name: "Странствующий торговец", flavor: "Караван путешествий, предлагает обмен." },
              { name: "Контрабандист Зак", flavor: "Тёмные товары по сниженной цене." },
              { name: "Реликварий", flavor: "Собиратель древних артефактов." },
              { name: "Кузнец Ронан", flavor: "Меняет оружие на оружие." },
              { name: "Авантюрист Лина", flavor: "Ищет редкие материалы." },
            ];
            const npc = npcs[Math.floor(Math.random() * npcs.length)] ?? npcs[0]!;
            offers.push({
              id: genId("trd"),
              npcName: npc.name,
              npcFlavor: npc.flavor,
              givesItemBaseId: giveBase.id,
              wantsItemBaseId: wantBase.id,
              wantsRarity: wantRarity,
              rarity: Math.random() < 0.7 ? "common" : Math.random() < 0.7 ? "rare" : "legendary",
              expiresAt: now + 24 * 3_600_000,
            });
          }
        }
        set({ tradePost: { offers, refreshAt: now + 6 * 3_600_000, acceptedToday, lastResetAt } });
      },

      tradeAccept: (offerId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (s.tradePost.acceptedToday >= 5) return { ok: false, error: "Лимит обменов: 5 в сутки." };
        const offer = s.tradePost.offers.find((o) => o.id === offerId);
        if (!offer) return { ok: false, error: "Предложение не найдено." };
        if (!offer.wantsItemBaseId || !offer.givesItemBaseId) return { ok: false, error: "Некорректное предложение." };
        const wantedRarity = offer.wantsRarity ?? "rare";
        const candidate = s.inventory.find((it) => it.baseId === offer.wantsItemBaseId && it.rarity === wantedRarity && !s.lockedItems.includes(it.uid));
        if (!candidate) return { ok: false, error: `Нужен ${ITEMS[offer.wantsItemBaseId]?.name} (${wantedRarity}).` };
        const giveBase = ITEMS[offer.givesItemBaseId];
        if (!giveBase) return { ok: false, error: "Предмет не доступен." };
        const rng = new RNG(seedFrom(`trade_${offerId}_${Date.now()}`));
        const newItem = createItemInstance(rng, giveBase, { level: giveBase.levelReq ?? 1, magicFindPct: 30 });
        set({
          inventory: [...s.inventory.filter((it) => it.uid !== candidate.uid), newItem],
          tradePost: {
            ...s.tradePost,
            offers: s.tradePost.offers.filter((o) => o.id !== offerId),
            acceptedToday: s.tradePost.acceptedToday + 1,
          },
          toasts: [...s.toasts, { id: genId("tst"), text: `Обмен с ${offer.npcName}: получено ${giveBase.name}.`, tone: "good" as const }],
        });
        return { ok: true };
      },

      checkDailyReward: () => {
        const s = get();
        if (!s.character) return;
        const now = Date.now();
        const DAY = 24 * 3_600_000;
        const last = s.dailyRewards.lastClaimedAt;
        if (last === 0) {
          set({ dailyRewards: { ...s.dailyRewards, claimedToday: false } });
          return;
        }
        const sinceLast = now - last;
        if (sinceLast >= 2 * DAY) {
          set({ dailyRewards: { currentDay: 0, lastClaimedAt: 0, claimedToday: false, totalClaims: s.dailyRewards.totalClaims } });
        } else if (sinceLast >= DAY) {
          set({ dailyRewards: { ...s.dailyRewards, claimedToday: false } });
        } else {
          set({ dailyRewards: { ...s.dailyRewards, claimedToday: true } });
        }
      },

      claimDailyReward: () => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (s.dailyRewards.claimedToday) return { ok: false, error: "Уже получено сегодня." };
        const day = s.dailyRewards.currentDay;
        const rewards = [
          { gold: 500 },
          { gold: 1000, shards: 5 },
          { gold: 1500, shards: 10 },
          { gold: 2500, dust: 5, shards: 15 },
          { gold: 3500, shards: 25 },
          { gold: 5000, dust: 15, shards: 40 },
          { gold: 10000, dust: 50, shards: 100 },
        ];
        const r = rewards[day]!;
        const char = {
          ...s.character,
          gold: s.character.gold + (r.gold ?? 0),
          shards: s.character.shards + (r.shards ?? 0),
          abyssDust: s.character.abyssDust + (r.dust ?? 0),
        };
        set({
          character: char,
          dailyRewards: {
            currentDay: (day + 1) % 7,
            lastClaimedAt: Date.now(),
            claimedToday: true,
            totalClaims: s.dailyRewards.totalClaims + 1,
          },
          toasts: [
            ...s.toasts,
            { id: genId("tst"), text: `День ${day + 1}: +${r.gold}g${r.shards ? ` +${r.shards}🔹` : ""}${r.dust ? ` +${r.dust}✨` : ""}`, tone: "good" as const },
          ],
        });
        return { ok: true };
      },

      unlockTitle: (id) => {
        const s = get();
        if (s.unlockedTitles.includes(id)) return;
        set({
          unlockedTitles: [...s.unlockedTitles, id],
          toasts: [...s.toasts, { id: genId("tst"), text: `Титул разблокирован: ${id}`, tone: "good" as const }],
        });
      },

      setPendingListing: (p) => set({ pendingListing: p }),

      // ================ ARENA ================
      fightArena: (opponentId) => {
        const s = get();
        if (!s.character) return { won: false, eloDelta: 0 };
        const opp = ARENA_OPPONENTS.find((o) => o.id === opponentId);
        if (!opp) return { won: false, eloDelta: 0 };
        // Plan v9: daily + energy
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.arenaFights >= 10) {
          set({ toasts: [...s.toasts, { id: genId("tst"), text: "Дневной лимит арены (10/10).", tone: "bad" as const }] });
          return { won: false, eloDelta: 0 };
        }
        const e = regenEnergy(s.energy);
        if (e.current < 10) {
          set({ toasts: [...s.toasts, { id: genId("tst"), text: `Нужно 10 энергии (есть ${Math.floor(e.current)}).`, tone: "bad" as const }] });
          return { won: false, eloDelta: 0 };
        }
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        // Power comparison with RNG
        const playerPower = derived.attack + derived.spellPower + derived.defense + derived.maxHp / 10;
        const oppPower = opp.power + Math.random() * 100 - 50;
        const won = playerPower + Math.random() * 50 > oppPower;
        const eloDelta = arenaEloDelta(s.arena.elo, opp.elo, won);
        const goldReward = won ? 200 + Math.floor(opp.power * 0.3) : 50;
        const xpReward = won ? 80 + Math.floor(opp.power * 0.2) : 20;
        set({
          arena: {
            ...s.arena,
            elo: Math.max(0, s.arena.elo + eloDelta),
            wins: s.arena.wins + (won ? 1 : 0),
            losses: s.arena.losses + (won ? 0 : 1),
            streak: won ? s.arena.streak + 1 : 0,
            lastFightAt: Date.now(),
            dailyFights: s.arena.dailyFights + 1,
          },
          character: { ...s.character, gold: s.character.gold + goldReward, xp: s.character.xp + xpReward },
          energy: { ...e, current: e.current - 10 },
          dailyCounters: { ...dc, arenaFights: dc.arenaFights + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: won ? `Победа! +${eloDelta} ELO, +${goldReward}g.` : `Поражение. ${eloDelta} ELO.`, tone: won ? "epic" as const : "bad" as const }],
        });
        if (won) {
          get().progressBpMission("bm_d_arena_2", 1);
          get().progressBpMission("bm_w_arena_10", 1);
        }
        return { won, eloDelta };
      },

      // ================ BOUNTIES ================
      refreshBountiesIfNeeded: () => {
        const s = get();
        if (s.bounties.refreshAt > Date.now()) return;
        // Pick BOUNTIES_PER_DAY random bounties
        const shuffled = [...BOUNTIES_POOL].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, BOUNTIES_PER_DAY);
        const now = Date.now();
        set({
          bounties: {
            active: picks.map((b) => ({ id: b.id, progress: 0, expiresAt: now + b.expiresAfterHours * 3600 * 1000, completed: false, claimed: false })),
            refreshAt: now + 24 * 3600 * 1000,
            completedToday: 0,
          },
        });
      },
      rerollBounties: () => {
        const s = get();
        if (!s.character || s.character.gold < BOUNTY_REROLL_COST) { s.pushToast({ text: "Не хватает золота.", tone: "bad" }); return; }
        const shuffled = [...BOUNTIES_POOL].sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, BOUNTIES_PER_DAY);
        const now = Date.now();
        set({
          character: { ...s.character, gold: s.character.gold - BOUNTY_REROLL_COST },
          bounties: { ...s.bounties, active: picks.map((b) => ({ id: b.id, progress: 0, expiresAt: now + b.expiresAfterHours * 3600 * 1000, completed: false, claimed: false })) },
        });
      },
      claimBounty: (bountyId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const active = s.bounties.active.find((b) => b.id === bountyId);
        if (!active || active.claimed) return { ok: false };
        const def = BOUNTIES_POOL.find((b) => b.id === bountyId);
        if (!def) return { ok: false };
        // For demo — allow claim anytime (progress tracked loosely)
        const reward = def.rewards;
        const newRep = { ...s.factionRep };
        if (reward.reputation) {
          newRep[reward.reputation.factionId] = (newRep[reward.reputation.factionId] ?? 0) + reward.reputation.amount;
        }
        set({
          character: { ...s.character, gold: s.character.gold + reward.gold, xp: s.character.xp + reward.xp, shards: s.character.shards + (reward.shards ?? 0), abyssDust: s.character.abyssDust + (reward.dust ?? 0) },
          bounties: { ...s.bounties, active: s.bounties.active.map((b) => b.id === bountyId ? { ...b, claimed: true, completed: true } : b), completedToday: s.bounties.completedToday + 1 },
          factionRep: newRep,
          toasts: [...s.toasts, { id: genId("tst"), text: `Баунти «${def.name}» выполнено! +${reward.gold}g, +${reward.xp}xp${reward.reputation ? `, +${reward.reputation.amount} реп.` : ""}.`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ HUNTS ================
      startHunt: (huntId) => set((s) => {
        const hunt = HUNTS.find((h) => h.id === huntId);
        if (!hunt || !s.character) return s;
        if (s.character.level < hunt.levelReq) return { toasts: [...s.toasts, { id: genId("tst"), text: `Требуется уровень ${hunt.levelReq}.`, tone: "bad" as const }] };
        if (s.hunts.active.some((a) => a.huntId === huntId)) return s;
        const now = Date.now();
        return { hunts: { ...s.hunts, active: [...s.hunts.active, { huntId, startedAt: now, endsAt: now + hunt.trackDurationMinutes * 60000, progress: 0 }] }, toasts: [...s.toasts, { id: genId("tst"), text: `Охота «${hunt.name}» начата.`, tone: "info" as const }] };
      }),
      progressHunt: () => set((s) => {
        const now = Date.now();
        const updated = s.hunts.active.map((a) => {
          const hunt = HUNTS.find((h) => h.id === a.huntId);
          if (!hunt) return a;
          const pct = Math.min(1, (now - a.startedAt) / (hunt.trackDurationMinutes * 60000));
          return { ...a, progress: pct };
        });
        return { hunts: { ...s.hunts, active: updated } };
      }),
      claimHunt: (huntId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const hunt = HUNTS.find((h) => h.id === huntId);
        const active = s.hunts.active.find((a) => a.huntId === huntId);
        if (!hunt || !active || active.progress < 1) return { ok: false };
        const reward = hunt.rewards;
        const items: ItemInstance[] = reward.itemBaseId ? [{ uid: genId("it"), baseId: reward.itemBaseId, rarity: "rare", level: hunt.levelReq, affixes: [], upgradeLevel: 0, createdAt: Date.now(), sockets: [] }] : [];
        const newRep = { ...s.factionRep };
        if (reward.reputation) newRep[reward.reputation.factionId] = (newRep[reward.reputation.factionId] ?? 0) + reward.reputation.amount;
        set({
          character: { ...s.character, gold: s.character.gold + reward.gold, xp: s.character.xp + reward.xp, abyssDust: s.character.abyssDust + (reward.dust ?? 0) },
          inventory: [...s.inventory, ...items],
          hunts: { active: s.hunts.active.filter((a) => a.huntId !== huntId), completed: [...s.hunts.completed, huntId] },
          factionRep: newRep,
          toasts: [...s.toasts, { id: genId("tst"), text: `Охота завершена: ${hunt.name}! +${reward.gold}g, +${reward.xp}xp.`, tone: "epic" as const }],
          lootReveal: items.length ? items : s.lootReveal,
        });
        return { ok: true };
      },

      // ================ EXPEDITIONS ================
      sendExpedition: (expId, petUid) => {
        const s = get();
        if (!s.character) return { ok: false, error: "no character" };
        const exp = EXPEDITIONS.find((e) => e.id === expId);
        const pet = s.pets.find((p) => p.uid === petUid);
        if (!exp) return { ok: false, error: "no expedition" };
        if (!pet) return { ok: false, error: "no pet" };
        if (pet.level < exp.petLevelReq) return { ok: false, error: `Питомец должен быть ${exp.petLevelReq} уровня.` };
        if (s.expeditions.active.some((a) => a.petUid === petUid)) return { ok: false, error: "Питомец уже в экспедиции." };
        const now = Date.now();
        set({ expeditions: { ...s.expeditions, active: [...s.expeditions.active, { id: genId("exp"), expId, petUid, startedAt: now, endsAt: now + exp.durationMinutes * 60000 }] } });
        return { ok: true };
      },
      claimExpedition: (activeId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const active = s.expeditions.active.find((a) => a.id === activeId);
        if (!active) return { ok: false };
        if (Date.now() < active.endsAt) return { ok: false };
        const def = EXPEDITIONS.find((e) => e.id === active.expId);
        if (!def) return { ok: false };
        const success = Math.random() < def.successBaseChance;
        const history = [...s.expeditions.history, { expId: active.expId, success, at: Date.now() }];
        const remaining = s.expeditions.active.filter((a) => a.id !== activeId);
        if (!success) {
          set({ expeditions: { active: remaining, history }, toasts: [...s.toasts, { id: genId("tst"), text: `Экспедиция провалена. Питомец вернулся пустым.`, tone: "bad" as const }] });
          return { ok: true };
        }
        const gold = def.rewards.gold[0] + Math.floor(Math.random() * (def.rewards.gold[1] - def.rewards.gold[0]));
        const xp = def.rewards.xp[0] + Math.floor(Math.random() * (def.rewards.xp[1] - def.rewards.xp[0]));
        const newMats = { ...s.materials };
        if (def.rewards.material) {
          const qty = def.rewards.material.qty[0] + Math.floor(Math.random() * (def.rewards.material.qty[1] - def.rewards.material.qty[0]));
          newMats[def.rewards.material.baseId] = (newMats[def.rewards.material.baseId] ?? 0) + qty;
        }
        let newInv = s.inventory;
        if (def.rewards.itemChance && Math.random() < def.rewards.itemChance && def.rewards.itemPool?.length) {
          const pick = def.rewards.itemPool[Math.floor(Math.random() * def.rewards.itemPool.length)]!;
          newInv = [...newInv, { uid: genId("it"), baseId: pick, rarity: "uncommon", level: 1, affixes: [], upgradeLevel: 0, createdAt: Date.now(), sockets: [] }];
        }
        set({
          character: { ...s.character, gold: s.character.gold + gold, xp: s.character.xp + xp },
          materials: newMats,
          inventory: newInv,
          expeditions: { active: remaining, history },
          toasts: [...s.toasts, { id: genId("tst"), text: `Экспедиция успешна: +${gold}g, +${xp}xp.`, tone: "good" as const }],
        });
        return { ok: true };
      },
      tickExpeditions: () => {
        // No-op placeholder — UI polls endsAt directly.
      },

      // ================ FACTIONS ================
      joinFaction: (factionId) => set((s) => ({ factionRep: { ...s.factionRep, [factionId]: Math.max(0, s.factionRep[factionId] ?? 0) } })),
      claimFactionTier: (factionId, tier) => {
        const s = get();
        if (!s.character) return { ok: false };
        const def = FACTIONS[factionId];
        if (!def) return { ok: false };
        const rep = s.factionRep[factionId] ?? 0;
        const tierDef = def.tiers.find((t) => t.tier === tier);
        if (!tierDef) return { ok: false };
        if (rep < tierDef.repRequired) return { ok: false };
        const claimed = s.factionClaimedTiers[factionId] ?? [];
        if (claimed.includes(tier)) return { ok: false };
        const r = tierDef.rewards;
        const newInv = [...s.inventory];
        if (r.itemBaseId) newInv.push({ uid: genId("it"), baseId: r.itemBaseId, rarity: "epic", level: Math.max(1, Math.floor(rep / 500)), affixes: [], upgradeLevel: 0, createdAt: Date.now(), sockets: [] });
        const titles = r.title ? [...new Set([...s.unlockedTitles, r.title])] : s.unlockedTitles;
        set({
          character: { ...s.character, gold: s.character.gold + (r.gold ?? 0) },
          inventory: newInv,
          factionClaimedTiers: { ...s.factionClaimedTiers, [factionId]: [...claimed, tier] },
          unlockedTitles: titles,
          toasts: [...s.toasts, { id: genId("tst"), text: `Награда фракции ${def.name}: ${tierDef.name} получена!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ PETS DEEP ================
      feedPet: (petUid, materialBaseId) => set((s) => {
        const pet = s.pets.find((p) => p.uid === petUid);
        if (!pet) return s;
        const have = s.materials[materialBaseId] ?? 0;
        if (have < 1) return { toasts: [...s.toasts, { id: genId("tst"), text: "Нет этого материала.", tone: "bad" as const }] };
        const state = s.petStates[petUid] ?? { happiness: 50, lastFedAt: 0, stage: 1 as const, skillPoints: 0 };
        const xpGain = 25;
        const newLevel = Math.min(60, pet.level + (pet.xp + xpGain >= 100 ? 1 : 0));
        const newXp = newLevel > pet.level ? 0 : pet.xp + xpGain;
        return {
          materials: { ...s.materials, [materialBaseId]: have - 1 },
          pets: s.pets.map((p) => p.uid === petUid ? { ...p, level: newLevel, xp: newXp, bondLevel: Math.min(10, p.bondLevel + 1) } : p),
          petStates: { ...s.petStates, [petUid]: { ...state, happiness: Math.min(100, state.happiness + 15), lastFedAt: Date.now(), skillPoints: state.skillPoints + (newLevel > pet.level ? 1 : 0) } },
          toasts: [...s.toasts, { id: genId("tst"), text: `Питомец накормлен. +${xpGain} XP, +15 счастья.`, tone: "good" as const }],
        };
      }),
      feedPetTreat: (petUid, treatId) => {
        const s = get();
        const pet = s.pets.find((p) => p.uid === petUid);
        if (!pet) return { ok: false, error: "Питомец не найден." };
        const have = s.materials[treatId] ?? 0;
        if (have < 1) return { ok: false, error: "Нет этого лакомства." };
        const treat = (PET_TREATS as Record<string, import("@ton-abyss/content").PetTreatDef>)[treatId];
        if (!treat) return { ok: false, error: "Неизвестное лакомство." };
        const state = s.petStates[petUid] ?? { happiness: 50, lastFedAt: 0, stage: 1 as const, skillPoints: 0 };
        const petDef = PETS[pet.defId];
        const familyMatch = treat.preferredFamily && petDef && petDef.family === treat.preferredFamily;
        const mult = familyMatch ? 1.5 : 1;
        const xpGained = Math.round(treat.xpGain * mult);
        const bondGained = Math.min(10 - pet.bondLevel, Math.round(treat.bondGain * mult));
        const happyGained = Math.round(treat.happinessGain * mult);
        const xpToLevel = 100;
        let newLevel = pet.level;
        let newXp = pet.xp + xpGained;
        while (newXp >= xpToLevel && newLevel < 60) {
          newXp -= xpToLevel;
          newLevel += 1;
        }
        const newPets = s.pets.map((p) => p.uid === petUid ? { ...p, level: newLevel, xp: newXp, bondLevel: Math.min(10, p.bondLevel + bondGained) } : p);
        const newState: PetState = {
          ...state,
          happiness: Math.min(100, state.happiness + happyGained),
          lastFedAt: Date.now(),
          skillPoints: state.skillPoints + Math.max(0, newLevel - pet.level),
          activeBuff: treat.buffMinutes > 0 ? { treatId, expiresAt: Date.now() + treat.buffMinutes * 60_000, description: treat.buffDescription } : state.activeBuff,
        };
        set({
          materials: { ...s.materials, [treatId]: have - 1 },
          pets: newPets,
          petStates: { ...s.petStates, [petUid]: newState },
          toasts: [...s.toasts, { id: genId("tst"), text: `${treat.ru}: +${xpGained} XP, +${bondGained} bond${familyMatch ? " (×1.5 семья!)" : ""}`, tone: "good" as const }],
        });
        return { ok: true, bondGained, xpGained };
      },

      setActiveForgeStation: (stationId) => {
        const s = get();
        if (!s.unlockedForgeStations.includes(stationId)) {
          set({ toasts: [...s.toasts, { id: genId("tst"), text: "Кузня заблокирована.", tone: "bad" as const }] });
          return;
        }
        const def = (FORGE_STATIONS as Record<string, import("@ton-abyss/content").ForgeStationDef>)[stationId];
        set({
          activeForgeStation: stationId,
          toasts: [...s.toasts, { id: genId("tst"), text: `Активна: ${def?.ru ?? stationId}`, tone: "info" as const }],
        });
      },
      unlockForgeStation: (stationId) => {
        const s = get();
        if (s.unlockedForgeStations.includes(stationId)) return { ok: false, error: "Уже открыта." };
        const def = (FORGE_STATIONS as Record<string, import("@ton-abyss/content").ForgeStationDef>)[stationId];
        if (!def) return { ok: false, error: "Не существует." };
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const cost = def.unlockCost;
        if (cost.gold && s.character.gold < cost.gold) return { ok: false, error: `Нужно ${cost.gold}g.` };
        if (cost.shards && s.character.shards < cost.shards) return { ok: false, error: `Нужно ${cost.shards}🔹.` };
        if (cost.materials) {
          for (const [matId, qty] of Object.entries(cost.materials)) {
            if ((s.materials[matId] ?? 0) < qty) {
              return { ok: false, error: `Нужно ${qty}× ${matId}.` };
            }
          }
        }
        const newMats = { ...s.materials };
        if (cost.materials) {
          for (const [matId, qty] of Object.entries(cost.materials)) {
            newMats[matId] = (newMats[matId] ?? 0) - qty;
          }
        }
        set({
          character: {
            ...s.character,
            gold: s.character.gold - (cost.gold ?? 0),
            shards: s.character.shards - (cost.shards ?? 0),
          },
          materials: newMats,
          unlockedForgeStations: [...s.unlockedForgeStations, stationId],
          activeForgeStation: stationId,
          toasts: [...s.toasts, { id: genId("tst"), text: `🔥 ${def.ru} открыта и активирована!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ============ ENERGY SYSTEM ============
      consumeEnergy: (amount) => {
        const s = get();
        const e = regenEnergy(s.energy);
        if (e.current < amount) {
          return { ok: false, error: `Нужно ${amount} энергии (есть ${Math.floor(e.current)}). Восстанавливается 1/6мин.` };
        }
        set({ energy: { ...e, current: e.current - amount } });
        return { ok: true };
      },
      speedupEnergy: () => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.staminaSpeedups >= 3) return { ok: false, error: "Лимит ускорений на сегодня (3/3)." };
        const cost = 500 + dc.staminaSpeedups * 250;
        if (s.character.gold < cost) return { ok: false, error: `Нужно ${cost}g.` };
        const e = regenEnergy(s.energy);
        const restored = Math.floor(e.max * 0.5);
        set({
          character: { ...s.character, gold: s.character.gold - cost },
          energy: { ...e, current: Math.min(e.max, e.current + restored), lastRegenAt: Date.now() },
          dailyCounters: { ...dc, staminaSpeedups: dc.staminaSpeedups + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `+${restored} энергии за ${cost}g.`, tone: "good" as const }],
        });
        return { ok: true, cost };
      },

      // ============ FISHING (anti-grind passive activity) ============
      fishingCast: () => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.fishingCasts >= 20) return { ok: false, error: "Дневной лимит рыбалки (20)." };
        const e = regenEnergy(s.energy);
        if (e.current < 2) return { ok: false, error: "Нужно 2 энергии." };
        const rng = Math.random();
        let mat: string | undefined;
        let matQty = 0;
        const goldGain = 30 + Math.floor(Math.random() * 80);
        if (rng < 0.4) { mat = "mat_pearl"; matQty = 1; }
        else if (rng < 0.65) { mat = "mat_seaweed"; matQty = 2; }
        else if (rng < 0.85) { mat = "mat_iron"; matQty = 1; }
        else if (rng < 0.95) { mat = "treat_jerky"; matQty = 1; }
        else { mat = "mat_abyss_shard"; matQty = 1; }
        const newMats = { ...s.materials };
        if (mat) newMats[mat] = (newMats[mat] ?? 0) + matQty;
        set({
          character: { ...s.character, gold: s.character.gold + goldGain },
          energy: { ...e, current: e.current - 2 },
          materials: newMats,
          dailyCounters: { ...dc, fishingCasts: dc.fishingCasts + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `🎣 +${goldGain}g${mat ? `, +${matQty}× ${mat}` : ""}`, tone: "good" as const }],
        });
        return { ok: true, reward: { gold: goldGain, mat, matQty } };
      },

      // ============ GATHERING ============
      gatherRun: (biome) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        if (dc.gatheringRuns >= 10) return { ok: false, error: "Дневной лимит сбора (10)." };
        const e = regenEnergy(s.energy);
        if (e.current < 4) return { ok: false, error: "Нужно 4 энергии." };
        const tableMap: Record<string, string[]> = {
          forest: ["mat_linen", "mat_leather", "mat_oak"],
          mountain: ["mat_iron", "mat_silver", "mat_mithril"],
          swamp: ["mat_pearl", "mat_essence_shimmer", "mat_void_shard"],
          abyss: ["mat_abyss_shard", "mat_essence_radiant", "mat_boss_soul"],
        };
        const pool = tableMap[biome] ?? tableMap.forest!;
        const drops: Record<string, number> = {};
        for (const m of pool) {
          if (Math.random() < 0.7) drops[m] = (drops[m] ?? 0) + 1 + Math.floor(Math.random() * 3);
        }
        const newMats = { ...s.materials };
        for (const [m, q] of Object.entries(drops)) newMats[m] = (newMats[m] ?? 0) + q;
        set({
          energy: { ...e, current: e.current - 4 },
          materials: newMats,
          dailyCounters: { ...dc, gatheringRuns: dc.gatheringRuns + 1 },
          toasts: [...s.toasts, { id: genId("tst"), text: `🌿 Собрано: ${Object.entries(drops).map(([m, q]) => `${q}× ${m}`).join(", ")}`, tone: "good" as const }],
        });
        return { ok: true, mats: drops };
      },

      // ============ WORLD BOSS ============
      spawnWorldBoss: () => {
        const s = get();
        if (s.worldBoss && s.worldBoss.endsAt > Date.now() && s.worldBoss.hpCurrent > 0) return;
        const bosses = [
          { id: "wb_collossus", name: "Колосс Бездны", hp: 200000 },
          { id: "wb_devourer", name: "Пожиратель Миров", hp: 300000 },
          { id: "wb_warden", name: "Страж Финального Покоя", hp: 500000 },
        ];
        const b = bosses[Math.floor(Math.random() * bosses.length)]!;
        set({
          worldBoss: {
            id: b.id, name: b.name,
            hpMax: b.hp, hpCurrent: b.hp,
            endsAt: Date.now() + 24 * 60 * 60 * 1000,
            contributors: {},
            rewards: {},
          },
          toasts: [...s.toasts, { id: genId("tst"), text: `🐉 ${b.name} появился! Действует 24ч.`, tone: "epic" as const }],
        });
      },
      attackWorldBoss: () => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (!s.worldBoss || s.worldBoss.hpCurrent <= 0) return { ok: false, error: "Босса нет." };
        if (s.worldBoss.endsAt < Date.now()) return { ok: false, error: "Босс ушёл." };
        const e = regenEnergy(s.energy);
        if (e.current < 5) return { ok: false, error: "Нужно 5 энергии." };
        const derived = buildDerived(s.character, s.inventory, s.equipped, s.skillAllocation, s.paragon);
        const dmg = Math.round((derived.attack + derived.spellPower * 0.7) * (0.8 + Math.random() * 0.4));
        const newHp = Math.max(0, s.worldBoss.hpCurrent - dmg);
        const myDmg = (s.worldBoss.contributors[s.character.id] ?? 0) + dmg;
        const updated = {
          ...s.worldBoss,
          hpCurrent: newHp,
          contributors: { ...s.worldBoss.contributors, [s.character.id]: myDmg },
        };
        const toasts = [...s.toasts, { id: genId("tst"), text: `⚔ -${dmg.toLocaleString("ru-RU")} HP боссу.`, tone: "good" as const }];
        if (newHp === 0) {
          // distribute rewards based on damage share
          const totalDmg = Object.values(updated.contributors).reduce((a, b) => a + b, 0);
          const myShare = myDmg / totalDmg;
          const goldReward = Math.round(50000 * myShare);
          const shardsReward = Math.round(150 * myShare);
          updated.rewards[s.character.id] = { gold: goldReward, shards: shardsReward, claimed: false };
          toasts.push({ id: genId("tst"), text: `🏆 Босс повержен! Доля: ${(myShare * 100).toFixed(1)}%`, tone: "epic" as const });
        }
        set({
          energy: { ...e, current: e.current - 5 },
          worldBoss: updated,
          toasts,
        });
        if (newHp === 0) {
          const journalEntry = { id: genId("jl"), at: Date.now(), kind: "boss", text: `Повержен мировой босс ${s.worldBoss.name}. Ваш урон: ${myDmg.toLocaleString("ru-RU")}.` };
          set((st) => ({ journal: [journalEntry, ...st.journal].slice(0, 200) }));
        }
        return { ok: true, damage: dmg };
      },
      claimWorldBossReward: () => {
        const s = get();
        if (!s.character || !s.worldBoss) return { ok: false, error: "Нет награды." };
        const r = s.worldBoss.rewards[s.character.id];
        if (!r) return { ok: false, error: "Не участвовал или нет добычи." };
        if (r.claimed) return { ok: false, error: "Уже забрано." };
        set({
          character: { ...s.character, gold: s.character.gold + r.gold, shards: s.character.shards + r.shards },
          worldBoss: { ...s.worldBoss, rewards: { ...s.worldBoss.rewards, [s.character.id]: { ...r, claimed: true } } },
          toasts: [...s.toasts, { id: genId("tst"), text: `+${r.gold}g, +${r.shards}🔹 за мирового босса!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ============ JOURNAL ============
      addJournalEntry: (kind, text, meta) => {
        const s = get();
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        const entry = { id: genId("jl"), at: Date.now(), kind, text, ...(meta ? { meta } : {}) };
        const next = [entry, ...s.journal].slice(0, 200);
        set({ journal: next, dailyCounters: { ...dc, journalEntries: dc.journalEntries + 1 } });
      },
      clearJournal: () => set({ journal: [] }),

      // ============ LOADOUTS ============
      saveLoadout: (slot, name) => {
        const s = get();
        if (slot < 0 || slot >= 4) return { ok: false, error: "Слот 0-3." };
        const ld: Loadout = { id: `ld${slot}`, name, equipped: { ...s.equipped } };
        const newLoadouts = [...s.loadouts];
        newLoadouts[slot] = ld;
        set({ loadouts: newLoadouts, toasts: [...s.toasts, { id: genId("tst"), text: `Лоадаут «${name}» сохранён в слот ${slot + 1}.`, tone: "good" as const }] });
        return { ok: true };
      },
      loadLoadout: (slot) => {
        const s = get();
        const ld = s.loadouts[slot];
        if (!ld) return { ok: false, error: "Слот пуст." };
        // Verify all equipped items still exist
        const valid = Object.values(ld.equipped).every((u) => !u || s.inventory.find((i) => i.uid === u));
        if (!valid) return { ok: false, error: "Часть предметов из лоадаута больше не в инвентаре." };
        set({ equipped: { ...ld.equipped }, toasts: [...s.toasts, { id: genId("tst"), text: `Лоадаут «${ld.name}» применён.`, tone: "good" as const }] });
        return { ok: true };
      },
      deleteLoadout: (slot) => {
        const s = get();
        const newLoadouts = s.loadouts.filter((_, i) => i !== slot);
        set({ loadouts: newLoadouts });
      },

      evolvePet: (petUid) => {
        const s = get();
        const pet = s.pets.find((p) => p.uid === petUid);
        if (!pet) return { ok: false, error: "Не найден." };
        const state = s.petStates[petUid] ?? { happiness: 50, lastFedAt: 0, stage: 1 as const, skillPoints: 0 };
        if (state.stage === 3) return { ok: false, error: "Максимальная стадия." };
        const reqLvl = state.stage === 1 ? 10 : 25;
        const reqHappy = state.stage === 1 ? 60 : 80;
        if (pet.level < reqLvl) return { ok: false, error: `Нужен уровень ${reqLvl}.` };
        if (state.happiness < reqHappy) return { ok: false, error: `Нужно счастье ${reqHappy}.` };
        const nextStage: 1 | 2 | 3 = (state.stage + 1) as 1 | 2 | 3;
        set({
          petStates: { ...s.petStates, [petUid]: { ...state, stage: nextStage } },
          toasts: [...s.toasts, { id: genId("tst"), text: `Питомец эволюционировал до стадии ${nextStage}!`, tone: "epic" as const }],
        });
        return { ok: true };
      },
      fusePets: (petUidA, petUidB) => {
        const s = get();
        const a = s.pets.find((p) => p.uid === petUidA);
        const b = s.pets.find((p) => p.uid === petUidB);
        if (!a || !b) return { ok: false, error: "Питомцы не найдены." };
        if (a.defId !== b.defId) return { ok: false, error: "Можно сливать только одинаковых питомцев." };
        const fused: PetInstance = {
          ...a,
          uid: genId("pet"),
          level: Math.min(60, Math.max(a.level, b.level) + 5),
          xp: 0,
          bondLevel: Math.min(10, a.bondLevel + 2),
          traits: [...a.traits, ...b.traits],
          createdAt: Date.now(),
        };
        set({
          pets: [...s.pets.filter((p) => p.uid !== petUidA && p.uid !== petUidB), fused],
          petStates: { ...Object.fromEntries(Object.entries(s.petStates).filter(([k]) => k !== petUidA && k !== petUidB)), [fused.uid]: { happiness: 80, lastFedAt: Date.now(), stage: 3, skillPoints: 3 } },
          activePetUid: s.activePetUid === petUidA || s.activePetUid === petUidB ? fused.uid : s.activePetUid,
          toasts: [...s.toasts, { id: genId("tst"), text: `Питомцы слиты! Получен Apex-питомец.`, tone: "epic" as const }],
        });
        return { ok: true };
      },
      hatchEgg: (eggBaseId) => {
        const s = get();
        const eggInv = s.inventory.find((i) => i.baseId === eggBaseId);
        if (!eggInv) return { ok: false };
        // Pick random pet def
        const petIds = Object.keys(PETS);
        const petDefId = petIds[Math.floor(Math.random() * petIds.length)]!;
        const petDef = PETS[petDefId]!;
        const newPet: PetInstance = {
          uid: genId("pet"),
          defId: petDefId,
          level: 1, xp: 0, bondLevel: 0, hp: petDef.baseStats.maxHp ?? 50,
          nickname: petDef.name,
          traits: [],
          createdAt: Date.now(),
        };
        set({
          inventory: s.inventory.filter((i) => i.uid !== eggInv.uid),
          pets: [...s.pets, newPet],
          petStates: { ...s.petStates, [newPet.uid]: { happiness: 70, lastFedAt: Date.now(), stage: 1, skillPoints: 0 } },
          toasts: [...s.toasts, { id: genId("tst"), text: `Вылупился: ${petDef.name}!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ ENCHANT / RUNEWORD ================
      applyEnchant: (itemUid, enchantId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const item = s.inventory.find((i) => i.uid === itemUid);
        const ench = ENCHANTS[enchantId];
        if (!item || !ench) return { ok: false, error: "Не найдено." };
        const base = ITEMS[item.baseId];
        if (!base || !ench.slotRestriction.includes(base.slot)) return { ok: false, error: "Неподходящий слот." };
        if (s.character.gold < ench.costGold) return { ok: false, error: "Мало золота." };
        if (s.character.abyssDust < ench.costDust) return { ok: false, error: "Мало пыли." };
        // Append affix
        const newAffix = { id: `ench_${Date.now()}`, stat: Object.keys(ench.bonus)[0] ?? "attack" as any, value: Object.values(ench.bonus)[0] as number ?? 10, tier: 3 } as any;
        const next = { ...item, affixes: [...item.affixes, newAffix] };
        set({
          character: { ...s.character, gold: s.character.gold - ench.costGold, abyssDust: s.character.abyssDust - ench.costDust },
          inventory: s.inventory.map((i) => i.uid === itemUid ? next : i),
          toasts: [...s.toasts, { id: genId("tst"), text: `Энчант «${ench.name}» нанесён.`, tone: "good" as const }],
        });
        return { ok: true };
      },
      applyRuneword: (itemUid, runewordId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const item = s.inventory.find((i) => i.uid === itemUid);
        const rw = RUNEWORDS[runewordId];
        if (!item || !rw) return { ok: false, error: "Не найдено." };
        // Check materials
        for (const r of rw.runeSequence) {
          if ((s.materials[r] ?? 0) < 1) return { ok: false, error: `Нужен ${r}.` };
        }
        const newMats = { ...s.materials };
        for (const r of rw.runeSequence) newMats[r] = newMats[r]! - 1;
        const newAffixes = Object.entries(rw.bonus).map(([k, v], idx) => ({ id: `rw_${runewordId}_${idx}`, stat: k as any, value: v as number, tier: 5 }));
        set({
          materials: newMats,
          inventory: s.inventory.map((i) => i.uid === itemUid ? { ...i, affixes: [...i.affixes, ...newAffixes] } : i),
          toasts: [...s.toasts, { id: genId("tst"), text: `Runeword «${rw.name}» активирован!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ MOUNTS ================
      buyMount: (mountId) => {
        const s = get();
        if (!s.character) return { ok: false };
        const m = MOUNTS[mountId];
        if (!m) return { ok: false, error: "Не найдено." };
        if (s.mountsOwned.includes(mountId)) return { ok: false, error: "Уже владеете." };
        if (m.costGold && s.character.gold < m.costGold) return { ok: false, error: "Мало золота." };
        if (m.costShards && s.character.shards < m.costShards) return { ok: false, error: "Мало шардов." };
        set({
          character: { ...s.character, gold: s.character.gold - (m.costGold ?? 0), shards: s.character.shards - (m.costShards ?? 0) },
          mountsOwned: [...s.mountsOwned, mountId],
          activeMount: s.activeMount ?? mountId,
          toasts: [...s.toasts, { id: genId("tst"), text: `Скакун «${m.name}» куплен!`, tone: "epic" as const }],
        });
        return { ok: true };
      },
      setActiveMount: (mountId) => set((s) => ({ activeMount: mountId })),

      // ================ RELICS ================
      claimRelic: (bossId) => {
        const s = get();
        const relicId = Object.keys(RELICS).find((id) => RELICS[id]!.sourceBossId === bossId);
        if (!relicId) return { ok: false };
        if (s.relicsUnlocked.includes(relicId)) return { ok: false };
        if ((s.bossesKilled[bossId] ?? 0) < 1) return { ok: false };
        set({
          relicsUnlocked: [...s.relicsUnlocked, relicId],
          toasts: [...s.toasts, { id: genId("tst"), text: `Реликвия получена: ${RELICS[relicId]!.name}!`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ================ EVENTS ================
      triggerWorldEvent: () => set((s) => {
        const evt = WORLD_EVENTS[Math.floor(Math.random() * WORLD_EVENTS.length)]!;
        return {
          activeEvent: { id: evt.id, endsAt: Date.now() + evt.durationHours * 3600 * 1000 },
          toasts: [...s.toasts, { id: genId("tst"), text: `Событие: ${evt.name} активно на ${evt.durationHours}ч!`, tone: "epic" as const }],
        };
      }),

      // ================ PRESTIGE ================
      prestigeAscend: () => {
        const s = get();
        if (!s.character) return { ok: false };
        if (s.character.level < 50) return { ok: false, error: "Нужен уровень 50." };
        // Reset character but keep prestige count and a bonus
        const bonusShards = 10 + s.prestigeCount * 5;
        const primary = primaryStatsFor(s.character.classId, 1, {});
        const derived = derivedFromPrimary(s.character.classId, primary);
        set({
          character: {
            ...s.character,
            level: 1, xp: 0, stats: primary, unspentPoints: 0,
            hpCurrent: derived.maxHp, manaCurrent: derived.maxMana,
            shards: s.character.shards + bonusShards,
            deaths: 0,
          },
          prestigeCount: s.prestigeCount + 1,
          skillAllocation: {},
          skillPoints: 3, // bonus starting skill points per prestige
          paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: 0,
          toasts: [...s.toasts, { id: genId("tst"), text: `Вознесение! Prestige-ранг ${s.prestigeCount + 1}. +${bonusShards} шардов, +3 скилл-поинта.`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      salvageMany: (uids) => {
        const s = get();
        let mats = 0, dust = 0, shards = 0;
        for (const uid of uids) {
          const r = s.salvage([uid]);
          mats += r.materials; dust += r.dust; shards += r.shards;
        }
        return { materials: mats, dust, shards };
      },

      // ================ CLAN ================
      createClan: (name, tag, banner) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (s.clan) return { ok: false, error: "Вы уже в клане." };
        if (s.character.gold < CLAN_CONFIG.creationCost.gold) {
          return { ok: false, error: `Нужно ${CLAN_CONFIG.creationCost.gold} золота.` };
        }
        if (!name.trim() || name.length < 3 || name.length > 24) return { ok: false, error: "Имя 3–24 символов." };
        if (!tag.trim() || tag.length < 2 || tag.length > 5) return { ok: false, error: "Тег 2–5 символов." };
        const clan: PlayerClan = {
          id: genId("clan"),
          name: name.trim(),
          tag: tag.trim().toUpperCase(),
          banner: banner || "🏰",
          level: 1,
          xp: 0,
          bankGold: 0,
          members: [
            { id: s.character.id, name: s.character.classId, classId: s.character.classId, level: s.character.level, rank: "leader", contribTotal: 0, lastOnline: Date.now() },
          ],
          perksActive: [],
          motd: "Добро пожаловать в клан.",
          createdAt: Date.now(),
          myRank: "leader",
          myContribTotal: 0,
        };
        set({
          character: { ...s.character, gold: s.character.gold - CLAN_CONFIG.creationCost.gold },
          clan,
          toasts: [...s.toasts, { id: genId("tst"), text: `Клан «${clan.name}» [${clan.tag}] создан.`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      joinClanNpc: (npcId) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (s.clan) return { ok: false, error: "Вы уже в клане." };
        const npc = NPC_CLANS.find((c) => c.id === npcId);
        if (!npc) return { ok: false, error: "Клан не найден." };
        if (s.character.level < npc.level - 1) return { ok: false, error: `Нужен уровень ${npc.level - 1}.` };
        // Generate plausible members
        const genMembers = (count: number): ClanMember[] => {
          const out: ClanMember[] = [
            { id: s.character!.id, name: s.character!.classId, classId: s.character!.classId, level: s.character!.level, rank: "recruit", contribTotal: 0, lastOnline: Date.now() },
          ];
          const names = ["Игрок", "Боец", "Мастер", "Страж", "Убийца", "Страж", "Клинок", "Кудесник", "Тень", "Берсерк"];
          const classes = ["warden", "runesmith", "voidcaller", "beastbound"];
          for (let i = 1; i < count; i++) {
            out.push({
              id: `npc_${npcId}_${i}`,
              name: `${names[i % names.length]}${i}`,
              classId: classes[i % classes.length]!,
              level: Math.max(1, npc.level + Math.floor(Math.random() * 6 - 2)),
              rank: i === 1 ? "leader" : i <= 3 ? "officer" : i <= 6 ? "veteran" : "member",
              contribTotal: Math.floor(Math.random() * 5000),
              lastOnline: Date.now() - Math.floor(Math.random() * 86400_000 * 7),
            });
          }
          return out;
        };
        const clan: PlayerClan = {
          id: npc.id,
          name: npc.name,
          tag: npc.tag,
          banner: npc.banner,
          level: npc.level,
          xp: CLAN_CONFIG.xpCurve[Math.min(npc.level, CLAN_CONFIG.xpCurve.length - 1)] ?? 0,
          bankGold: npc.level * 5000,
          members: genMembers(npc.memberCount),
          perksActive: CLAN_PERKS.filter((p) => p.requiresClanLevel <= npc.level).slice(0, 3).map((p) => p.id),
          motd: npc.flavor,
          createdAt: Date.now() - 86400_000 * 30 * npc.level,
          myRank: "recruit",
          myContribTotal: 0,
        };
        set({
          clan,
          toasts: [...s.toasts, { id: genId("tst"), text: `Вступили в клан «${clan.name}» [${clan.tag}]`, tone: "good" as const }],
        });
        return { ok: true };
      },

      leaveClan: () => {
        const s = get();
        if (!s.clan) return;
        set({
          clan: null,
          toasts: [...s.toasts, { id: genId("tst"), text: `Вы покинули клан «${s.clan.name}».`, tone: "info" as const }],
        });
      },

      contributeGoldToClan: (amount) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (!s.clan) return { ok: false, error: "Вы не в клане." };
        if (amount <= 0) return { ok: false, error: "Сумма неверна." };
        if (s.character.gold < amount) return { ok: false, error: "Недостаточно золота." };
        // Roll daily contrib limit
        const today = todayKey();
        const daily = s.clanDailyContrib.date === today ? s.clanDailyContrib : { date: today, gold: 0, kills: 0, bounties: 0, bosses: 0 };
        const remain = Math.max(0, CLAN_CONFIG.dailyContribMax.gold - daily.gold);
        if (remain <= 0) return { ok: false, error: "Дневной лимит взноса достигнут." };
        const goldActual = Math.min(amount, remain * 100); // 1 contrib per 100g, cap in contrib terms
        const contribGained = Math.floor(goldActual / 100);
        const newXp = s.clan.xp + contribGained;
        const levelCap = CLAN_CONFIG.maxLevel;
        let newLevel = s.clan.level;
        while (newLevel < levelCap && newXp >= (CLAN_CONFIG.xpCurve[newLevel] ?? Infinity)) newLevel++;
        set({
          character: { ...s.character, gold: s.character.gold - goldActual },
          clan: { ...s.clan, bankGold: Math.min(CLAN_CONFIG.bankGoldCap, s.clan.bankGold + goldActual), xp: newXp, level: newLevel, myContribTotal: s.clan.myContribTotal + contribGained },
          clanDailyContrib: { ...daily, gold: daily.gold + contribGained },
          toasts: [
            ...s.toasts,
            { id: genId("tst"), text: `+${goldActual}g в казну, +${contribGained} вклад${newLevel > s.clan.level ? `. Клан достиг ур. ${newLevel}!` : "."}`, tone: (newLevel > s.clan.level ? "epic" : "good") as "epic" | "good" },
          ],
        });
        return { ok: true };
      },

      withdrawFromClanBank: (amount) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (!s.clan) return { ok: false, error: "Вы не в клане." };
        const rank = CLAN_RANKS[s.clan.myRank];
        if (!rank.canWithdraw) return { ok: false, error: "У вас нет прав на снятие." };
        if (amount <= 0) return { ok: false, error: "Сумма неверна." };
        if (s.clan.bankGold < amount) return { ok: false, error: "В банке недостаточно." };
        set({
          character: { ...s.character, gold: s.character.gold + amount },
          clan: { ...s.clan, bankGold: s.clan.bankGold - amount },
          toasts: [...s.toasts, { id: genId("tst"), text: `Снято ${amount}g из банка.`, tone: "good" as const }],
        });
        return { ok: true };
      },

      setClanMotd: (motd) => {
        const s = get();
        if (!s.clan) return;
        const rank = CLAN_RANKS[s.clan.myRank];
        if (!rank.canPromote) {
          s.pushToast({ text: "Только лидер может менять MOTD.", tone: "bad" });
          return;
        }
        set({ clan: { ...s.clan, motd: motd.slice(0, 200) } });
      },

      activateClanPerk: (perkId) => {
        const s = get();
        if (!s.clan) return { ok: false, error: "Вы не в клане." };
        const perk = CLAN_PERKS.find((p) => p.id === perkId);
        if (!perk) return { ok: false, error: "Перк не найден." };
        if (s.clan.level < perk.requiresClanLevel) return { ok: false, error: `Нужен ур. клана ${perk.requiresClanLevel}.` };
        if (s.clan.perksActive.includes(perkId)) return { ok: false, error: "Уже активен." };
        if (s.clan.perksActive.length >= 4) return { ok: false, error: "Максимум 4 активных перка." };
        set({ clan: { ...s.clan, perksActive: [...s.clan.perksActive, perkId] } });
        return { ok: true };
      },

      deactivateClanPerk: (perkId) => {
        const s = get();
        if (!s.clan) return;
        set({ clan: { ...s.clan, perksActive: s.clan.perksActive.filter((p) => p !== perkId) } });
      },

      declareClanWar: (opponentId) => {
        const s = get();
        if (!s.character) return { ok: false, won: false, rewardGold: 0, rewardXp: 0, error: "Нет персонажа." };
        if (!s.clan) return { ok: false, won: false, rewardGold: 0, rewardXp: 0, error: "Вы не в клане." };
        const rank = CLAN_RANKS[s.clan.myRank];
        if (!rank.canStartWar) return { ok: false, won: false, rewardGold: 0, rewardXp: 0, error: "Только офицер/лидер." };
        const opp = NPC_CLANS.find((c) => c.id === opponentId);
        if (!opp) return { ok: false, won: false, rewardGold: 0, rewardXp: 0, error: "Оппонент не найден." };
        const myPower = s.clan.level * 400 + s.clan.members.reduce((sum, m) => sum + m.level * 30, 0);
        const oppPower = opp.power;
        const won = myPower + Math.random() * 300 > oppPower;
        const r = clanWarReward(opp.level, won);
        const record: ClanWarRecord = { id: genId("cw"), opponentId: opp.id, opponentName: opp.name, won, rewardGold: r.gold, rewardXp: r.clanXp, at: Date.now() };
        const newXp = s.clan.xp + r.clanXp;
        let newLevel = s.clan.level;
        while (newLevel < CLAN_CONFIG.maxLevel && newXp >= (CLAN_CONFIG.xpCurve[newLevel] ?? Infinity)) newLevel++;
        set({
          character: {
            ...s.character,
            gold: s.character.gold + Math.floor(r.gold * 0.3),
            shards: s.character.shards + r.memberShards,
          },
          clan: { ...s.clan, bankGold: Math.min(CLAN_CONFIG.bankGoldCap, s.clan.bankGold + Math.floor(r.gold * 0.7)), xp: newXp, level: newLevel },
          clanWars: [record, ...s.clanWars].slice(0, 30),
          toasts: [
            ...s.toasts,
            { id: genId("tst"), text: won ? `Победа над «${opp.name}»! +${Math.floor(r.gold * 0.3)}g, +${r.memberShards} шардов, +${r.clanXp} опыта клана.` : `Поражение от «${opp.name}». +${Math.floor(r.gold * 0.3)}g утешительный.`, tone: (won ? "epic" : "bad") as "epic" | "bad" },
          ],
        });
        return { ok: true, won, rewardGold: r.gold, rewardXp: r.clanXp };
      },

      // ============= CLAN BOSS =============
      startClanBoss: (bossId) => {
        const s = get();
        if (!s.clan) return { ok: false, error: "Только для членов клана." };
        if (s.clanBossActive) return { ok: false, error: "Уже идёт босс." };
        const def = CLAN_BOSSES[bossId];
        if (!def) return { ok: false, error: "Босс не найден." };
        if (s.clan.level < def.minClanRank) return { ok: false, error: `Требуется ранг клана ${def.minClanRank}.` };
        const inst: ClanBossInstance = {
          bossId,
          clanId: s.clan.id,
          startedAt: Date.now(),
          endsAt: Date.now() + def.durationHours * 3600_000,
          hpRemaining: def.totalHp,
          damageByMember: {},
          killed: false,
        };
        set({
          clanBossActive: inst,
          toasts: [...s.toasts, { id: genId("tst"), text: `Клан-босс «${def.ru}» призван.`, tone: "epic" as const }],
        });
        return { ok: true };
      },
      attackClanBoss: (damage) => {
        const s = get();
        if (!s.clanBossActive || !s.character) return { ok: false, killed: false };
        const inst = { ...s.clanBossActive };
        const def = CLAN_BOSSES[inst.bossId];
        if (!def) return { ok: false, killed: false };
        const dmg = Math.max(1, Math.floor(damage));
        inst.hpRemaining = Math.max(0, inst.hpRemaining - dmg);
        inst.damageByMember = { ...inst.damageByMember, [s.character.id]: (inst.damageByMember[s.character.id] ?? 0) + dmg };
        const killed = inst.hpRemaining === 0;
        if (killed) {
          inst.killed = true;
          inst.killedAt = Date.now();
        }
        set({
          clanBossActive: inst,
          toasts: killed
            ? [...s.toasts, { id: genId("tst"), text: `Клан-босс «${def.ru}» повержен!`, tone: "epic" as const }]
            : s.toasts,
        });
        return { ok: true, killed };
      },
      claimClanBossRewards: () => {
        const s = get();
        if (!s.clanBossActive || !s.character) return { ok: false };
        const inst = s.clanBossActive;
        const def = CLAN_BOSSES[inst.bossId];
        if (!def || !inst.killed) return { ok: false };
        const myDmg = inst.damageByMember[s.character.id] ?? 0;
        const totalDmg = Math.max(1, Object.values(inst.damageByMember).reduce((a, b) => a + b, 0));
        const share = myDmg / totalDmg;
        const gold = Math.floor(def.killRewards.gold * share);
        const shards = Math.floor(def.killRewards.shards * share);
        const dust = Math.floor(def.killRewards.abyssDust * share);
        set({
          character: { ...s.character, gold: s.character.gold + gold, shards: s.character.shards + shards, abyssDust: s.character.abyssDust + dust },
          clanBossActive: null,
          clanBossHistory: [{ bossId: inst.bossId, killed: true, damage: myDmg, at: Date.now() }, ...s.clanBossHistory].slice(0, 30),
          toasts: [...s.toasts, { id: genId("tst"), text: `Награда: +${gold}g, +${shards} шардов, +${dust} пыли (доля ${(share * 100).toFixed(1)}%).`, tone: "epic" as const }],
        });
        return { ok: true };
      },

      // ============= BATTLE PASS =============
      addBpXp: (amount) => {
        const s = get();
        const newXp = s.battlepass.xp + Math.max(0, Math.floor(amount));
        const newLevel = levelFromBpXp(newXp, CURRENT_SEASON.tiers);
        if (newLevel > s.battlepass.level) {
          set({
            battlepass: { ...s.battlepass, xp: newXp, level: newLevel },
            toasts: [...s.toasts, { id: genId("tst"), text: `БП: уровень ${newLevel}!`, tone: "epic" as const }],
          });
        } else {
          set({ battlepass: { ...s.battlepass, xp: newXp } });
        }
      },
      claimBpReward: (tierIdx, track) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const tier = CURRENT_SEASON.tiers[tierIdx];
        if (!tier) return { ok: false, error: "Тир не найден." };
        if (s.battlepass.level < tier.level) return { ok: false, error: "Уровень слишком низкий." };
        if (track === "premium" && !s.battlepass.premium) return { ok: false, error: "Требуется премиум." };
        const claimed = track === "free" ? s.battlepass.claimedFree : s.battlepass.claimedPremium;
        if (claimed.includes(tierIdx)) return { ok: false, error: "Уже забрано." };
        const reward = track === "free" ? tier.freeReward : tier.premiumReward;
        if (!reward) return { ok: false, error: "Нет награды." };
        let char = { ...s.character };
        const newToasts = [...s.toasts];
        const newInventory = [...s.inventory];
        const newMaterials = { ...s.materials };
        if (reward.kind === "gold") char.gold += reward.amount ?? 0;
        else if (reward.kind === "shards") char.shards += reward.amount ?? 0;
        else if (reward.kind === "abyss_dust") char.abyssDust += reward.amount ?? 0;
        else if (reward.kind === "lootbox" && reward.baseId) newMaterials[reward.baseId] = (newMaterials[reward.baseId] ?? 0) + (reward.amount ?? 1);
        else if (reward.kind === "skill_point") {
          set({ skillPoints: s.skillPoints + (reward.amount ?? 1) });
        } else if (reward.kind === "title" && reward.baseId) {
          if (!s.unlockedTitles.includes(reward.baseId)) set({ unlockedTitles: [...s.unlockedTitles, reward.baseId] });
        }
        newToasts.push({ id: genId("tst"), text: `Награда BP: ${reward.kind} ${reward.amount ?? ""}`, tone: "epic" as const });
        set({
          character: char,
          inventory: newInventory,
          materials: newMaterials,
          battlepass: {
            ...s.battlepass,
            claimedFree: track === "free" ? [...s.battlepass.claimedFree, tierIdx] : s.battlepass.claimedFree,
            claimedPremium: track === "premium" ? [...s.battlepass.claimedPremium, tierIdx] : s.battlepass.claimedPremium,
          },
          toasts: newToasts,
        });
        return { ok: true };
      },
      purchaseBpPremium: () => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        if (s.battlepass.premium) return { ok: false, error: "Уже куплено." };
        const cost = CURRENT_SEASON.premiumPriceShards;
        if (s.character.shards < cost) return { ok: false, error: `Нужно ${cost} шардов.` };
        set({
          character: { ...s.character, shards: s.character.shards - cost },
          battlepass: { ...s.battlepass, premium: true },
          toasts: [...s.toasts, { id: genId("tst"), text: "Премиум БП активирован!", tone: "epic" as const }],
        });
        return { ok: true };
      },
      refreshBpMissions: () => {
        const s = get();
        const now = Date.now();
        const dayMs = 86_400_000;
        const weekMs = 7 * dayMs;
        let missions = { ...s.bpMissions };
        let dailyReset = s.bpMissionsResetDaily;
        let weeklyReset = s.bpMissionsResetWeekly;
        if (now >= s.bpMissionsResetDaily) {
          for (const m of DEFAULT_DAILY_MISSIONS) {
            missions[m.id] = { missionId: m.id, current: 0, completed: false, claimed: false, resetAt: now + dayMs };
          }
          dailyReset = now + dayMs;
        }
        if (now >= s.bpMissionsResetWeekly) {
          for (const m of DEFAULT_WEEKLY_MISSIONS) {
            missions[m.id] = { missionId: m.id, current: 0, completed: false, claimed: false, resetAt: now + weekMs };
          }
          weeklyReset = now + weekMs;
        }
        set({ bpMissions: missions, bpMissionsResetDaily: dailyReset, bpMissionsResetWeekly: weeklyReset });
      },
      progressBpMission: (missionId, amount) => {
        const s = get();
        const ms = s.bpMissions[missionId];
        if (!ms || ms.claimed) return;
        const def = [...DEFAULT_DAILY_MISSIONS, ...DEFAULT_WEEKLY_MISSIONS].find((m) => m.id === missionId);
        if (!def) return;
        const newCur = Math.min(def.objective.amount, ms.current + Math.max(0, amount));
        const completed = newCur >= def.objective.amount;
        set({ bpMissions: { ...s.bpMissions, [missionId]: { ...ms, current: newCur, completed } } });
      },
      claimBpMission: (missionId) => {
        const s = get();
        const ms = s.bpMissions[missionId];
        if (!ms || !ms.completed || ms.claimed) return { ok: false };
        const def = [...DEFAULT_DAILY_MISSIONS, ...DEFAULT_WEEKLY_MISSIONS].find((m) => m.id === missionId);
        if (!def) return { ok: false };
        get().addBpXp(def.rewardXp);
        set({
          bpMissions: { ...s.bpMissions, [missionId]: { ...ms, claimed: true } },
          toasts: [...s.toasts, { id: genId("tst"), text: `Миссия БП выполнена: +${def.rewardXp} опыта.`, tone: "good" as const }],
        });
        return { ok: true };
      },

      // ============= LOOTBOX =============
      purchaseLootbox: (kind, qty) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const def = LOOTBOXES[kind];
        if (!def) return { ok: false, error: "Сундук не найден." };
        const totalGold = (def.costGold ?? 0) * qty;
        const totalShards = (def.costShards ?? 0) * qty;
        const totalDust = (def.costDust ?? 0) * qty;
        if (s.character.gold < totalGold) return { ok: false, error: `Нужно ${totalGold} золота.` };
        if (s.character.shards < totalShards) return { ok: false, error: `Нужно ${totalShards} шардов.` };
        if (s.character.abyssDust < totalDust) return { ok: false, error: `Нужно ${totalDust} пыли.` };
        const newMats = { ...s.materials, [kind]: (s.materials[kind] ?? 0) + qty };
        set({
          character: {
            ...s.character,
            gold: s.character.gold - totalGold,
            shards: s.character.shards - totalShards,
            abyssDust: s.character.abyssDust - totalDust,
          },
          materials: newMats,
          toasts: [...s.toasts, { id: genId("tst"), text: `Куплено ${qty}x «${def.ru}».`, tone: "good" as const }],
        });
        return { ok: true };
      },
      openLootbox: (kind, qty = 1) => {
        const s = get();
        if (!s.character) return { ok: false, error: "Нет персонажа." };
        const owned = s.materials[kind] ?? 0;
        if (owned < qty) return { ok: false, error: `Нет сундуков (нужно ${qty}, есть ${owned}).` };
        // Plan v9: daily caps
        const dc = rolloverDailyIfNeeded(s.dailyCounters);
        const isMythic = kind === "lb_gold" || kind === "lb_abyss";
        const cap = isMythic ? 1 : 5;
        const counter = isMythic ? dc.mythicLootboxOpens : dc.lootboxOpens;
        if (counter + qty > cap) return { ok: false, error: `Дневной лимит ${isMythic ? "мифических" : "обычных"} сундуков (${counter}/${cap}).` };
        let lbState = s.lootbox;
        const rolls: { kind: LootboxKind; rarities: import("@ton-abyss/shared").RarityId[]; pity: boolean }[] = [];
        const newItems: ItemInstance[] = [];
        const seed = seedFrom(`lb_${kind}_${Date.now()}_${Math.random()}`);
        const rng = new RNG(seed);
        const charLevel = s.character.level;
        for (let i = 0; i < qty; i++) {
          const result = rollLootbox(kind, lbState, () => rng.next());
          lbState = result.updatedState;
          rolls.push({ kind, rarities: result.rarities, pity: result.pityTriggered });
          for (const r of result.rarities) {
            const pool = Object.values(ITEMS).filter((it) => it.slot !== "consumable" && it.slot !== "material" && (it.levelReq ?? 1) <= charLevel + 5);
            if (pool.length === 0) continue;
            const base = pool[Math.floor(rng.next() * pool.length)];
            if (!base) continue;
            const inst = createItemInstance(rng, base, { level: base.levelReq ?? charLevel, magicFindPct: 0, rarityOverride: { [r]: 1000 } as Partial<Record<import("@ton-abyss/shared").RarityId, number>> });
            newItems.push(inst);
          }
        }
        const newMats = { ...s.materials, [kind]: owned - qty };
        const lastRoll = rolls[rolls.length - 1] ?? null;
        const newDc = isMythic
          ? { ...dc, mythicLootboxOpens: dc.mythicLootboxOpens + qty }
          : { ...dc, lootboxOpens: dc.lootboxOpens + qty };
        // Journal: log top-rarity items
        const rarityOrder: Record<string, number> = { common: 0, uncommon: 1, rare: 2, epic: 3, mythic: 4, abyssal: 5 };
        const best = newItems.reduce<ItemInstance | null>((acc, it) => (!acc || (rarityOrder[it.rarity] ?? 0) > (rarityOrder[acc.rarity] ?? 0) ? it : acc), null);
        const nextJournal = best && (rarityOrder[best.rarity] ?? 0) >= 3
          ? [{ id: genId("jl"), at: Date.now(), kind: "loot", text: `Из сундука выпал: ${best.baseId} [${best.rarity}]` }, ...s.journal].slice(0, 200)
          : s.journal;
        set({
          inventory: [...s.inventory, ...newItems],
          materials: newMats,
          lootbox: lbState,
          lastLootboxRoll: lastRoll,
          lootReveal: newItems,
          dailyCounters: newDc,
          journal: nextJournal,
          toasts: [...s.toasts, { id: genId("tst"), text: `Открыто ${qty} сундука. Получено ${newItems.length} предметов.`, tone: "epic" as const }],
        });
        get().progressBpMission("bm_d_lootbox_1", qty);
        get().progressBpMission("bm_w_lootbox_15", qty);
        return { ok: true, rolls };
      },

      pushToast: (t) => set((s) => {
        const last = s.toasts[s.toasts.length - 1];
        if (last && last.text === t.text && last.tone === t.tone) return {};
        return { toasts: [...s.toasts, { ...t, id: genId("tst") }].slice(-6) };
      }),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      reset: () =>
        set({
          screen: "splash",
          character: null,
          inventory: [],
          stash: [],
          equipped: {},
          materials: {},
          gems: {},
          pets: [],
          activePetUid: null,
          petStates: {},
          activeForgeStation: "neutral",
          unlockedForgeStations: ["neutral"],
          energy: { current: 120, max: 120, lastRegenAt: Date.now() },
          dailyCounters: {
            date: todayKey(),
            lootboxOpens: 0,
            mythicLootboxOpens: 0,
            marketListings: 0,
            auctionCreates: 0,
            tradeAccepts: 0,
            echoRiftAttempts: 0,
            arenaFights: 0,
            petTreatsFed: {},
            staminaSpeedups: 0,
            fishingCasts: 0,
            gatheringRuns: 0,
            journalEntries: 0,
          },
          journal: [],
          worldBoss: null,
          toasts: [],
          lastDungeonLog: [],
          tower: { currentFloor: 0, highestFloor: 0, active: false, currentScore: 0, bestScore: 0, lastEntryAt: 0 },
          echoRifts: { highestTier: 0, clears: 0, pityCounter: 0, bestRunGold: 0 },
          market: { listings: [], history: [], maxActiveListings: 8 },
          auction: { lots: [], history: [] },
          tradePost: { offers: [], refreshAt: 0, acceptedToday: 0, lastResetAt: 0 },
          dailyRewards: { currentDay: 0, lastClaimedAt: 0, claimedToday: false, totalClaims: 0 },
          pendingListing: null,
          arena: { elo: 0, wins: 0, losses: 0, streak: 0, lastFightAt: 0, dailyFights: 0 },
          bounties: { active: [], refreshAt: 0, completedToday: 0 },
          hunts: { active: [], completed: [] },
          expeditions: { active: [], history: [] },
          factionRep: {},
          factionClaimedTiers: {},
          relicsUnlocked: [],
          mountsOwned: [],
          activeMount: null,
          loadouts: [],
          lockedItems: [],
          activeEvent: null,
          prestigeCount: 0,
          craftingStats: { itemsCrafted: 0, itemsSalvaged: 0, itemsUpgraded: 0 },
          clan: null,
          clanDailyContrib: { date: todayKey(), gold: 0, kills: 0, bounties: 0, bosses: 0 },
          clanWars: [],
          clanBossActive: null,
          clanBossHistory: [],
          battlepass: { seasonId: CURRENT_SEASON.id, xp: 0, level: 0, premium: false, claimedFree: [], claimedPremium: [] },
          bpMissions: {},
          bpMissionsResetDaily: 0,
          bpMissionsResetWeekly: 0,
          lootbox: defaultLootboxState(),
          lastLootboxRoll: null,
          skillAllocation: {},
          skillPoints: 0,
          paragon: { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: 0,
          quests: {},
          achievements: {},
          unlockedTitles: [],
          activeTitle: null,
          mapProgress: { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
          combat: null,
          dungeonsCleared: {},
          bossesKilled: {},
          monstersKilled: {},
          totalKills: 0,
          totalGoldEarned: 0,
          totalItemsLooted: 0,
          totalDamageDealt: 0,
          hardcoreStreak: 0,
          leaderboard: [],
          lootReveal: null,
          bossCinematic: null,
        }),
    }),
    {
      name: "ton-abyss-save",
      version: 11,
      partialize: (s) => ({
        character: s.character,
        inventory: s.inventory,
        stash: s.stash,
        equipped: s.equipped,
        materials: s.materials,
        gems: s.gems,
        pets: s.pets,
        activePetUid: s.activePetUid,
        petStates: s.petStates,
        activeForgeStation: s.activeForgeStation,
        unlockedForgeStations: s.unlockedForgeStations,
        energy: s.energy,
        dailyCounters: s.dailyCounters,
        journal: s.journal,
        worldBoss: s.worldBoss,
        skillAllocation: s.skillAllocation,
        skillPoints: s.skillPoints,
        paragon: s.paragon,
        paragonPoints: s.paragonPoints,
        quests: s.quests,
        achievements: s.achievements,
        unlockedTitles: s.unlockedTitles,
        activeTitle: s.activeTitle,
        mapProgress: s.mapProgress,
        dungeonsCleared: s.dungeonsCleared,
        bossesKilled: s.bossesKilled,
        monstersKilled: s.monstersKilled,
        totalKills: s.totalKills,
        totalGoldEarned: s.totalGoldEarned,
        totalItemsLooted: s.totalItemsLooted,
        totalDamageDealt: s.totalDamageDealt,
        hardcoreStreak: s.hardcoreStreak,
        tower: s.tower,
        echoRifts: s.echoRifts,
        market: s.market,
        auction: s.auction,
        tradePost: s.tradePost,
        dailyRewards: s.dailyRewards,
        arena: s.arena,
        bounties: s.bounties,
        hunts: s.hunts,
        expeditions: s.expeditions,
        factionRep: s.factionRep,
        factionClaimedTiers: s.factionClaimedTiers,
        relicsUnlocked: s.relicsUnlocked,
        mountsOwned: s.mountsOwned,
        activeMount: s.activeMount,
        loadouts: s.loadouts,
        lockedItems: s.lockedItems,
        activeEvent: s.activeEvent,
        prestigeCount: s.prestigeCount,
        craftingStats: s.craftingStats,
        clan: s.clan,
        clanDailyContrib: s.clanDailyContrib,
        clanWars: s.clanWars,
        clanBossActive: s.clanBossActive,
        clanBossHistory: s.clanBossHistory,
        battlepass: s.battlepass,
        bpMissions: s.bpMissions,
        bpMissionsResetDaily: s.bpMissionsResetDaily,
        bpMissionsResetWeekly: s.bpMissionsResetWeekly,
        lootbox: s.lootbox,
        screen: s.character ? (s.screen === "active_combat" ? "home" : s.screen) : "splash",
      }),
      migrate: (persisted: any, version: number) => {
        // v3 added god-mode v2 fields. Ensure they exist with defaults.
        const base = persisted ?? {};
        return {
          ...base,
          stash: base.stash ?? [],
          petStates: base.petStates ?? {},
          tower: base.tower ?? { currentFloor: 0, highestFloor: 0, active: false, currentScore: 0, bestScore: 0, lastEntryAt: 0 },
          echoRifts: base.echoRifts ?? { highestTier: 0, clears: 0, pityCounter: 0, bestRunGold: 0 },
          market: base.market ?? { listings: [], history: [], maxActiveListings: 8 },
          auction: base.auction ?? { lots: [], history: [] },
          tradePost: base.tradePost ?? { offers: [], refreshAt: 0, acceptedToday: 0, lastResetAt: 0 },
          dailyRewards: base.dailyRewards ?? { currentDay: 0, lastClaimedAt: 0, claimedToday: false, totalClaims: 0 },
          pendingListing: null,
          arena: base.arena ?? { elo: 0, wins: 0, losses: 0, streak: 0, lastFightAt: 0, dailyFights: 0 },
          bounties: base.bounties ?? { active: [], refreshAt: 0, completedToday: 0 },
          hunts: base.hunts ?? { active: [], completed: [] },
          expeditions: base.expeditions ?? { active: [], history: [] },
          factionRep: base.factionRep ?? {},
          factionClaimedTiers: base.factionClaimedTiers ?? {},
          relicsUnlocked: base.relicsUnlocked ?? [],
          mountsOwned: base.mountsOwned ?? [],
          activeMount: base.activeMount ?? null,
          loadouts: base.loadouts ?? [],
          lockedItems: base.lockedItems ?? [],
          activeEvent: base.activeEvent ?? null,
          prestigeCount: base.prestigeCount ?? 0,
          craftingStats: base.craftingStats ?? { itemsCrafted: 0, itemsSalvaged: 0, itemsUpgraded: 0 },
          clan: base.clan ?? null,
          clanDailyContrib: base.clanDailyContrib ?? { date: todayKey(), gold: 0, kills: 0, bounties: 0, bosses: 0 },
          clanWars: base.clanWars ?? [],
          clanBossActive: base.clanBossActive ?? null,
          clanBossHistory: base.clanBossHistory ?? [],
          battlepass: base.battlepass ?? { seasonId: CURRENT_SEASON.id, xp: 0, level: 0, premium: false, claimedFree: [], claimedPremium: [] },
          bpMissions: base.bpMissions ?? {},
          bpMissionsResetDaily: base.bpMissionsResetDaily ?? 0,
          bpMissionsResetWeekly: base.bpMissionsResetWeekly ?? 0,
          lootbox: base.lootbox ?? defaultLootboxState(),
          lastLootboxRoll: base.lastLootboxRoll ?? null,
          // ensure legacy fields exist
          inventory: base.inventory ?? [],
          equipped: base.equipped ?? {},
          materials: base.materials ?? {},
          gems: base.gems ?? {},
          pets: base.pets ?? [],
          skillAllocation: base.skillAllocation ?? {},
          skillPoints: base.skillPoints ?? 0,
          paragon: base.paragon ?? { offense: 0, defense: 0, utility: 0, treasure: 0 },
          paragonPoints: base.paragonPoints ?? 0,
          quests: base.quests ?? {},
          achievements: base.achievements ?? {},
          unlockedTitles: base.unlockedTitles ?? [],
          activeTitle: base.activeTitle ?? null,
          mapProgress: base.mapProgress ?? { unlocked: ["mn_town_safehold", "mn_crypt_gate"], cleared: [], currentAct: 1 },
          dungeonsCleared: base.dungeonsCleared ?? {},
          bossesKilled: base.bossesKilled ?? {},
          monstersKilled: base.monstersKilled ?? {},
          totalKills: base.totalKills ?? 0,
          totalGoldEarned: base.totalGoldEarned ?? 0,
          totalItemsLooted: base.totalItemsLooted ?? 0,
          totalDamageDealt: base.totalDamageDealt ?? 0,
          hardcoreStreak: base.hardcoreStreak ?? 0,
          activeForgeStation: base.activeForgeStation ?? "neutral",
          unlockedForgeStations: base.unlockedForgeStations ?? ["neutral"],
          energy: base.energy ?? { current: 120, max: 120, lastRegenAt: Date.now() },
          dailyCounters: base.dailyCounters ?? {
            date: todayKey(),
            lootboxOpens: 0,
            mythicLootboxOpens: 0,
            marketListings: 0,
            auctionCreates: 0,
            tradeAccepts: 0,
            echoRiftAttempts: 0,
            arenaFights: 0,
            petTreatsFed: {},
            staminaSpeedups: 0,
            fishingCasts: 0,
            gatheringRuns: 0,
            journalEntries: 0,
          },
          journal: base.journal ?? [],
          worldBoss: base.worldBoss ?? null,
        };
      },
    },
  ),
);

export function useDerivedStats() {
  // Subscribe to stable refs; compute derived outside the store subscription
  // to avoid "getSnapshot should be cached" infinite loop with useSyncExternalStore.
  const character = useGame((s) => s.character);
  const inventory = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const skillAllocation = useGame((s) => s.skillAllocation);
  const paragon = useGame((s) => s.paragon);
  const pets = useGame((s) => s.pets);
  const petStates = useGame((s) => s.petStates);
  const activePetUid = useGame((s) => s.activePetUid);
  return useMemo(() => {
    if (!character) return null;
    const activePet = activePetUid ? pets.find((p) => p.uid === activePetUid) ?? null : null;
    const petState = activePetUid ? petStates[activePetUid] ?? null : null;
    return buildDerived(character, inventory, equipped, skillAllocation, paragon, { activePet, petState });
  }, [character, inventory, equipped, skillAllocation, paragon, pets, petStates, activePetUid]);
}
