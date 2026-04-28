import { z } from "zod";

export const raritySchema = z.enum(["common", "uncommon", "rare", "epic", "legendary", "mythic"]);
export const damageTypeSchema = z.enum(["piercing", "slashing", "crushing", "firearm", "fire", "poison"]);
export const itemKindSchema = z.enum(["weapon", "armor", "ship_upgrade", "material", "rune", "potion", "pet", "nft_relic"]);
export const professionSchema = z.enum(["blacksmith", "alchemist", "shipwright", "relicsmith"]);
export const factionSchema = z.enum(["brotherhood", "crown", "inquisition", "aztec", "free_traders"]);

export type Rarity = z.infer<typeof raritySchema>;
export type DamageType = z.infer<typeof damageTypeSchema>;
export type ItemKind = z.infer<typeof itemKindSchema>;
export type Profession = z.infer<typeof professionSchema>;
export type Faction = z.infer<typeof factionSchema>;

export interface StatBlock {
  hp: number;
  maxHp: number;
  stamina: number;
  energy: number;
  armor: number;
  accuracy: number;
  evasion: number;
  critChance: number;
  critMultiplier: number;
  initiative: number;
  crewPower: number;
  charisma: number;
  luck: number;
  resistances: Record<DamageType, number>;
}

export interface MoveDefinition {
  id: string;
  name: string;
  description: string;
  actionCost: number;
  energyCost: number;
  damageMultiplier: number;
  damageType: DamageType;
  cooldown: number;
  minTargetHpPercent?: number;
  effects?: StatusEffectDefinition[];
}

export interface StatusEffectDefinition {
  type: "poison" | "bleed" | "burn" | "stun" | "fear" | "shock" | "vulnerable" | "fracture" | "curse" | "blessing" | "rage" | "regen" | "aim";
  duration: number;
  stacks: number;
  power: number;
}

export interface ItemDefinition {
  id: string;
  name: string;
  kind: ItemKind;
  rarity: Rarity;
  level: number;
  value: number;
  nftEligible: boolean;
  soulbound?: boolean;
  stats?: Partial<StatBlock>;
  damage?: {
    min: number;
    max: number;
    type: DamageType;
  };
  moves?: MoveDefinition[];
  tags: string[];
}

export interface InventoryItem {
  uid: string;
  itemId: string;
  rarity: Rarity;
  quantity: number;
  enhancement: number;
  superior: boolean;
  nft?: NftState;
  mintedAt?: string;
}

export interface NftState {
  status: "offchain_reserved" | "mint_pending" | "minted" | "exported";
  collectionAddress: string;
  itemIndex?: number;
  metadataUri: string;
  ownerAddress?: string;
}

export interface ProfessionState {
  level: number;
  xp: number;
  queueSlots: number;
}

export interface PetState {
  id: string;
  name: string;
  level: number;
  xp: number;
  loyalty: number;
  evolution: "cub" | "adult" | "elite";
  lastFedAt?: string;
}

export interface ShipState {
  id: string;
  name: string;
  classId: string;
  hp: number;
  upgrades: Record<string, string | undefined>;
  officers: string[];
  trophies: number;
  aiPreset: ShipAiRule[];
}

export interface ShipAiRule {
  id: string;
  priority: number;
  condition: string;
  action: string;
}

export interface Player {
  id: string;
  telegramId: string;
  username: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  level: number;
  xp: number;
  prestige: number;
  skillPoints: number;
  bonusPoints: number;
  islandId: string;
  faction: Faction;
  currencies: {
    piastres: number;
    doubloons: number;
    stars: number;
  };
  stats: StatBlock;
  inventory: InventoryItem[];
  equipment: {
    mainHand?: string;
    offHand?: string;
    head?: string;
    chest?: string;
    hands?: string;
    waist?: string;
    legs?: string;
    boots?: string;
  };
  professions: Record<Profession, ProfessionState>;
  pets: PetState[];
  activePetId?: string;
  ship: ShipState;
  quests: Record<string, QuestProgress>;
  pity: Record<string, number>;
  daily: {
    streak: number;
    lastClaimedAt?: string;
    earnedChestToday: boolean;
  };
  flags: Record<string, boolean>;
}

export interface QuestProgress {
  status: "locked" | "active" | "completed" | "claimed";
  progress: number;
  goal: number;
}

export interface EnemyDefinition {
  id: string;
  name: string;
  level: number;
  islandId: string;
  archetype: "duelist" | "guard" | "undead" | "beast" | "cultist" | "boss";
  stats: StatBlock;
  vulnerabilities: Record<DamageType, number>;
  moves: MoveDefinition[];
  rewards: RewardTable;
}

export interface RewardTable {
  xp: number;
  piastres: [number, number];
  doubloons?: [number, number];
  items: Array<{
    itemId: string;
    chance: number;
    minQty: number;
    maxQty: number;
  }>;
}

export interface BattleActor {
  id: string;
  name: string;
  side: "player" | "enemy";
  stats: StatBlock;
  effects: ActiveStatusEffect[];
  cooldowns: Record<string, number>;
  actionPoints: number;
  defeated: boolean;
}

export interface ActiveStatusEffect extends StatusEffectDefinition {
  remaining: number;
  sourceId: string;
}

export interface BattleState {
  id: string;
  playerId: string;
  enemyId: string;
  seed: string;
  turn: number;
  phase: "player" | "enemy" | "finished";
  winner?: "player" | "enemy";
  player: BattleActor;
  enemy: BattleActor;
  log: BattleLogEntry[];
  rewardsClaimed: boolean;
  startedAt: string;
  updatedAt: string;
}

export interface BattleLogEntry {
  turn: number;
  actorId: string;
  action: string;
  message: string;
  damage?: number;
  critical?: boolean;
  effects?: string[];
}

export interface CraftRecipe {
  id: string;
  name: string;
  profession: Profession;
  requiredLevel: number;
  durationSeconds: number;
  xp: number;
  inputs: Array<{ itemId: string; quantity: number }>;
  output: {
    itemId: string;
    quantity: number;
    superiorChance: number;
  };
}

export interface CraftJob {
  id: string;
  playerId: string;
  recipeId: string;
  startedAt: string;
  completesAt: string;
  claimed: boolean;
}

export interface ChestDefinition {
  id: string;
  name: string;
  price: {
    piastres?: number;
    doubloons?: number;
  };
  dailyLimit?: number;
  pity: {
    epic?: number;
    legendary?: number;
    mythic?: number;
  };
  rolls: Array<{
    label: string;
    chance: number;
    itemIds: string[];
    minPiastres?: number;
    maxPiastres?: number;
    minQty: number;
    maxQty: number;
    minimumRarity?: Rarity;
  }>;
}

export interface MarketListing {
  id: string;
  sellerId: string;
  item: InventoryItem;
  price: {
    piastres?: number;
    doubloons?: number;
  };
  kind: "fixed" | "auction";
  createdAt: string;
  expiresAt: string;
  bids: MarketBid[];
  status: "active" | "sold" | "expired" | "cancelled";
}

export interface MarketBid {
  bidderId: string;
  amount: number;
  currency: "piastres" | "doubloons";
  placedAt: string;
}

export interface AnticheatSignal {
  id: string;
  playerId: string;
  severity: "info" | "warning" | "critical";
  category: "rate_limit" | "signature" | "state_desync" | "economy" | "timing" | "telegram_auth" | "automation";
  message: string;
  createdAt: string;
  metadata: Record<string, string | number | boolean>;
}

export interface LedgerEntry {
  id: string;
  playerId: string;
  type: "source" | "sink" | "transfer" | "mint";
  currency: "piastres" | "doubloons" | "stars";
  amount: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

export interface SessionEnvelope {
  token: string;
  playerId: string;
  sessionSecret: string;
  expiresAt: string;
}

export const createPlayerSchema = z.object({
  telegramId: z.string().min(1).max(64),
  username: z.string().min(1).max(64),
  displayName: z.string().min(1).max(80),
  faction: factionSchema.default("brotherhood")
});

export const battleActionSchema = z.object({
  battleId: z.string().min(1),
  moveId: z.string().min(1),
  nonce: z.number().int().nonnegative(),
  clientTick: z.number().int().nonnegative()
});

export const craftStartSchema = z.object({
  recipeId: z.string().min(1),
  nonce: z.number().int().nonnegative()
});

export const chestOpenSchema = z.object({
  chestId: z.string().min(1),
  nonce: z.number().int().nonnegative()
});

export const marketListSchema = z.object({
  itemUid: z.string().min(1),
  price: z.object({
    piastres: z.number().int().positive().optional(),
    doubloons: z.number().int().positive().optional()
  }),
  kind: z.enum(["fixed", "auction"]).default("fixed"),
  hours: z.number().int().min(1).max(72).default(24),
  nonce: z.number().int().nonnegative()
});

export const pvpDuelSchema = z.object({
  opponentId: z.string().min(1),
  nonce: z.number().int().nonnegative()
});
