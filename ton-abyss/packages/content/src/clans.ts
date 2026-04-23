// Clans — persistent social guilds with shared perks, bank and async wars.

export interface ClanPerk {
  id: string;
  name: string;
  description: string;
  requiresClanLevel: number;
  kind: "atk" | "def" | "xp" | "gold" | "drop" | "crit" | "hp";
  value: number; // percent or flat depending on kind
}

export const CLAN_PERKS: ClanPerk[] = [
  { id: "cp_atk1", name: "Яростный марш I", description: "+3% атаки всему клану.", requiresClanLevel: 1, kind: "atk", value: 3 },
  { id: "cp_atk2", name: "Яростный марш II", description: "+6% атаки всему клану.", requiresClanLevel: 5, kind: "atk", value: 6 },
  { id: "cp_atk3", name: "Яростный марш III", description: "+10% атаки всему клану.", requiresClanLevel: 10, kind: "atk", value: 10 },
  { id: "cp_def1", name: "Каменная стена I", description: "+3% защиты всему клану.", requiresClanLevel: 2, kind: "def", value: 3 },
  { id: "cp_def2", name: "Каменная стена II", description: "+6% защиты всему клану.", requiresClanLevel: 6, kind: "def", value: 6 },
  { id: "cp_xp1", name: "Опыт братства I", description: "+5% XP всему клану.", requiresClanLevel: 3, kind: "xp", value: 5 },
  { id: "cp_xp2", name: "Опыт братства II", description: "+10% XP всему клану.", requiresClanLevel: 8, kind: "xp", value: 10 },
  { id: "cp_gold1", name: "Казна клана I", description: "+5% золота с добычи.", requiresClanLevel: 4, kind: "gold", value: 5 },
  { id: "cp_gold2", name: "Казна клана II", description: "+10% золота с добычи.", requiresClanLevel: 9, kind: "gold", value: 10 },
  { id: "cp_drop1", name: "Чуйка ловчего I", description: "+5% MF всему клану.", requiresClanLevel: 5, kind: "drop", value: 5 },
  { id: "cp_drop2", name: "Чуйка ловчего II", description: "+12% MF всему клану.", requiresClanLevel: 12, kind: "drop", value: 12 },
  { id: "cp_crit", name: "Сталь в крови", description: "+3% шанса крита.", requiresClanLevel: 7, kind: "crit", value: 3 },
  { id: "cp_hp", name: "Железное братство", description: "+5% макс. HP.", requiresClanLevel: 11, kind: "hp", value: 5 },
];

export type ClanRank = "recruit" | "member" | "veteran" | "officer" | "leader";

export interface ClanRankDef {
  id: ClanRank;
  name: string;
  canInvite: boolean;
  canKick: boolean;
  canPromote: boolean;
  canWithdraw: boolean;
  canDepositBank: boolean;
  canStartWar: boolean;
}

export const CLAN_RANKS: Record<ClanRank, ClanRankDef> = {
  recruit: { id: "recruit", name: "Рекрут", canInvite: false, canKick: false, canPromote: false, canWithdraw: false, canDepositBank: true, canStartWar: false },
  member: { id: "member", name: "Член клана", canInvite: false, canKick: false, canPromote: false, canWithdraw: false, canDepositBank: true, canStartWar: false },
  veteran: { id: "veteran", name: "Ветеран", canInvite: true, canKick: false, canPromote: false, canWithdraw: true, canDepositBank: true, canStartWar: false },
  officer: { id: "officer", name: "Офицер", canInvite: true, canKick: true, canPromote: false, canWithdraw: true, canDepositBank: true, canStartWar: true },
  leader: { id: "leader", name: "Лидер", canInvite: true, canKick: true, canPromote: true, canWithdraw: true, canDepositBank: true, canStartWar: true },
};

export const CLAN_CONFIG = {
  // Creating a clan costs gold — hardcore economy: a real commitment.
  creationCost: { gold: 15000 },
  maxMembers: 50,
  // Clan level is gained via contribution points from members.
  // Total contributions required per level (sum, not per-level delta).
  xpCurve: [0, 500, 2000, 5000, 10_000, 20_000, 35_000, 55_000, 85_000, 125_000, 180_000, 260_000, 380_000, 550_000, 800_000],
  maxLevel: 15,
  // Each member's contribution counts once per contribution category per day.
  dailyContribMax: {
    gold: 2000,   // deposit gold → +1 per 100g, capped daily
    kills: 100,   // monster kills → +1 per 5, capped
    bounties: 10, // baunty claimed → +20 each, capped
    bosses: 5,    // boss kill → +100 each, capped
  },
  // Bank limits: recruits can't withdraw; officers can.
  bankGoldCap: 999_999,
};

// Preset NPC clans to spar against in async wars (the first enemy snapshots).
export interface ClanSnapshot {
  id: string;
  name: string;
  tag: string;
  level: number;
  memberCount: number;
  power: number; // rough team power
  banner: string;
  flavor: string;
}

export const NPC_CLANS: ClanSnapshot[] = [
  { id: "nc_blackiron", name: "Чёрное Железо", tag: "BLK", level: 3, memberCount: 12, power: 850, banner: "⚫", flavor: "Шахтёры, превратившиеся в клан убийц гигантов." },
  { id: "nc_moonwatch", name: "Лунная Стража", tag: "LUN", level: 5, memberCount: 18, power: 1400, banner: "🌙", flavor: "Сторонники древних богов, чтящие лунные сезоны." },
  { id: "nc_redbriar", name: "Красный Тёрн", tag: "RED", level: 7, memberCount: 22, power: 2100, banner: "🌹", flavor: "Асассины и отравители. Яд — тоже оружие." },
  { id: "nc_silvermoor", name: "Серебряная Трясина", tag: "SLV", level: 9, memberCount: 26, power: 3000, banner: "💧", flavor: "Алхимики и колдуны, живущие в туманах Болот." },
  { id: "nc_emberfist", name: "Пламенный Кулак", tag: "EMB", level: 11, memberCount: 30, power: 4200, banner: "🔥", flavor: "Берсерки, приветствующие смерть в огне." },
  { id: "nc_abyssborn", name: "Порождение Бездны", tag: "ABY", level: 13, memberCount: 35, power: 5800, banner: "👁️", flavor: "Легендарные чемпионы, победившие самого Короля-в-Бездне." },
];

export interface ClanWarReward {
  gold: number;
  clanXp: number;
  memberShards: number;
}

export function clanWarReward(opponentLevel: number, won: boolean): ClanWarReward {
  const base = opponentLevel * 50;
  return won
    ? { gold: base * 15, clanXp: base * 6, memberShards: 2 + Math.floor(opponentLevel / 3) }
    : { gold: base * 3, clanXp: base * 1, memberShards: 0 };
}
