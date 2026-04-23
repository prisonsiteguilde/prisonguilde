// Canonical game types for TON Abyss.
// Everything is data-driven — content lives in @ton-abyss/content, logic in @ton-abyss/shared.

export type ElementId = "physical" | "fire" | "frost" | "shock" | "void" | "holy";

export const ELEMENTS: readonly ElementId[] = [
  "physical",
  "fire",
  "frost",
  "shock",
  "void",
  "holy",
] as const;

export type ClassId = "warden" | "runesmith" | "voidcaller" | "beastbound";

export type StatId =
  | "strength"
  | "agility"
  | "intellect"
  | "vitality"
  | "spirit"
  | "luck";

export const STATS: readonly StatId[] = [
  "strength",
  "agility",
  "intellect",
  "vitality",
  "spirit",
  "luck",
] as const;

// Derived combat stats computed from primary stats + gear + buffs.
export interface DerivedStats {
  maxHp: number;
  maxMana: number;
  attack: number;
  spellPower: number;
  defense: number;
  resistance: Record<ElementId, number>; // 0..0.75
  critChance: number; // 0..1
  critMultiplier: number; // default 1.5
  dodge: number; // 0..0.5
  accuracy: number; // 0..1, modifies hit chance
  blockChance: number; // 0..0.5
  blockAmount: number; // flat reduction
  lifesteal: number; // 0..0.3
  speed: number; // turn order tiebreak
  luck: number; // drop/affix modifier
}

export type RarityId =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "abyssal";

export const RARITIES: readonly RarityId[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "abyssal",
] as const;

export type ItemSlot =
  | "weapon"
  | "offhand"
  | "head"
  | "chest"
  | "legs"
  | "hands"
  | "feet"
  | "ring"
  | "amulet"
  | "neck"
  | "waist"
  | "back"
  | "trinket"
  | "relic"
  | "consumable"
  | "material"
  | "rune"
  | "pet_egg"
  | "key";

export interface AffixRoll {
  id: string;
  stat: StatId | keyof DerivedStats | "elemental_damage" | "gold_find" | "xp_gain";
  element?: ElementId;
  value: number;
  tier: number; // 1..6
}

export interface BaseItem {
  id: string;
  name: string;
  slot: ItemSlot;
  levelReq: number;
  rarityWeight?: Partial<Record<RarityId, number>>; // override per base
  baseStats?: Partial<DerivedStats>;
  sellValue: number;
  stackable?: boolean;
  maxStack?: number;
  flavor?: string;
  icon?: string;
  twoHanded?: boolean;
  weaponKind?: "sword" | "axe" | "mace" | "dagger" | "bow" | "staff" | "wand" | "tome" | "claw" | "greatsword" | "hammer" | "spear";
  armorKind?: "light" | "medium" | "heavy" | "cloth";
  tags?: string[];
}

export interface ItemInstance {
  uid: string;
  baseId: string;
  rarity: RarityId;
  level: number;
  affixes: AffixRoll[];
  sockets?: (string | null)[]; // rune uids
  upgradeLevel: number; // 0..15
  corruption?: number; // 0..5 for Abyssal items
  bound?: boolean;
  createdAt: number;
}

// ---------------- Monsters / Bosses ----------------

export type MonsterArchetype =
  | "grunt"
  | "skirmisher"
  | "caster"
  | "brute"
  | "elite"
  | "miniboss"
  | "boss"
  | "apex";

export interface MonsterDef {
  id: string;
  name: string;
  archetype: MonsterArchetype;
  level: number;
  element: ElementId;
  stats: DerivedStats;
  abilities: AbilityId[];
  lootTable: string; // reference to loot table id
  xp: number;
  gold: [number, number];
  flavor?: string;
  biome?: string;
  aiProfile?: AiProfile;
}

export type AiProfile = "aggressive" | "defensive" | "berserker" | "tactician" | "spellweaver";

export interface BossDef extends MonsterDef {
  archetype: "boss" | "apex";
  phases: BossPhase[];
  enrageTurn?: number;
  uniqueDrops: string[]; // base item ids guaranteed with weights
}

export interface BossPhase {
  hpThreshold: number; // 0..1
  addAbilities: AbilityId[];
  removeAbilities?: AbilityId[];
  buff?: Partial<DerivedStats>;
  onEnter?: AbilityId; // scripted cast
}

// ---------------- Abilities ----------------

export type AbilityId = string;

export interface AbilityDef {
  id: AbilityId;
  name: string;
  kind: "attack" | "spell" | "buff" | "debuff" | "heal" | "summon" | "special";
  element: ElementId;
  manaCost: number;
  cooldown: number; // turns
  baseDamage?: number; // multiplied by attack/spellPower
  scaling?: { attack?: number; spellPower?: number; maxHp?: number };
  effects?: StatusEffect[];
  aoe?: boolean;
  targets?: "self" | "ally" | "enemy" | "all_enemies" | "all_allies";
  description?: string;
}

export type StatusEffectId =
  | "bleed"
  | "burn"
  | "chill"
  | "freeze"
  | "shock"
  | "stun"
  | "poison"
  | "curse"
  | "weakness"
  | "fortify"
  | "haste"
  | "regen"
  | "shield"
  | "mark"
  | "silence"
  | "root";

export interface StatusEffect {
  id: StatusEffectId;
  duration: number; // turns
  potency: number; // damage per tick / % buff
  stacks?: number;
}

// ---------------- Pets ----------------

export type PetRarity = RarityId;

export interface PetDef {
  id: string;
  name: string;
  family: "wyrm" | "golem" | "spirit" | "beast" | "construct" | "abyssal";
  element: ElementId;
  rarity: PetRarity;
  maxLevel: number;
  baseStats: Partial<DerivedStats>;
  growth: Partial<DerivedStats>; // per level
  abilities: AbilityId[]; // unlocked at [1,10,25,50]
  passives: string[];
  feedTable: Record<string, number>; // item id -> xp granted
}

export interface PetInstance {
  uid: string;
  defId: string;
  level: number;
  xp: number;
  bondLevel: number; // 0..10, unlocks stat bonuses
  equippedSlot?: 0 | 1;
  nickname?: string;
  traits: PetTrait[];
  hp: number;
  createdAt: number;
}

export interface PetTrait {
  id: string;
  rarity: PetRarity;
  bonus: Partial<DerivedStats>;
}

// ---------------- Dungeons ----------------

export interface DungeonDef {
  id: string;
  name: string;
  biome: string;
  levelMin: number;
  levelMax: number;
  rooms: number; // 6..20
  bossId: string;
  miniBossIds?: string[];
  monsterPool: string[]; // monster ids
  lootTable: string;
  modifiers?: DungeonModifier[];
  entryCost?: { gold?: number; key?: string; tonStars?: number };
  cooldownSeconds?: number;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 Normal .. 7 Abyssal
}

export interface DungeonModifier {
  id: string;
  name: string;
  description: string;
  effect: Partial<{
    monsterDamage: number; // multiplier
    monsterHp: number;
    playerDamageTaken: number;
    lootQuantity: number;
    lootQuality: number;
    goldFind: number;
    xpGain: number;
    forbidPotions: boolean;
    suddenDeath: boolean;
  }>;
}

// ---------------- Loot ----------------

export interface LootTableDef {
  id: string;
  rolls: number | [number, number];
  entries: LootEntry[];
}

export interface LootEntry {
  kind: "item" | "gold" | "material" | "rune" | "recipe" | "pet_egg";
  baseId?: string;
  weight: number;
  amount?: [number, number];
  rarityOverride?: Partial<Record<RarityId, number>>;
  condition?: { minLevel?: number; maxLevel?: number; flag?: string };
}

// ---------------- Crafting ----------------

export interface RecipeDef {
  id: string;
  name: string;
  outputBaseId: string;
  outputLevel: number;
  inputs: { baseId: string; qty: number }[];
  goldCost: number;
  rarityBias?: Partial<Record<RarityId, number>>;
  unlockedBy?: "default" | "drop" | "quest" | "reputation";
  stationTier: 1 | 2 | 3 | 4 | 5;
}

// ---------------- Character ----------------

export interface Character {
  id: string;
  classId: ClassId;
  level: number;
  xp: number;
  stats: Record<StatId, number>;
  unspentPoints: number;
  hpCurrent: number;
  manaCurrent: number;
  gold: number;
  shards: number; // soft premium currency
  abyssDust: number; // hardcore crafting currency
  deaths: number;
  deepestFloor: number;
  createdAt: number;
  hardcoreMode: boolean;
}

export interface AbilityLearned {
  id: AbilityId;
  rank: number;
}

// ---------------- Combat runtime ----------------

export interface CombatActor {
  side: "player" | "enemy";
  id: string;
  name: string;
  level: number;
  stats: DerivedStats;
  hp: number;
  mana: number;
  statuses: StatusEffect[];
  cooldowns: Record<AbilityId, number>;
  abilities: AbilityId[];
  petOf?: string;
}

export interface CombatEvent {
  turn: number;
  actor: string;
  target?: string;
  ability?: AbilityId;
  damage?: number;
  heal?: number;
  crit?: boolean;
  blocked?: boolean;
  dodged?: boolean;
  applied?: StatusEffect[];
  expired?: StatusEffectId[];
  killed?: boolean;
  flavor?: string;
}

export interface CombatState {
  seed: number;
  turn: number;
  actors: CombatActor[];
  log: CombatEvent[];
  over: boolean;
  winner?: "player" | "enemy";
}
