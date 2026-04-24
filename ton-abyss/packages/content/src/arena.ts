// Async Arena — fake opponents with snapshot stats, ELO ranking.
import type { ClassId, DerivedStats } from "@ton-abyss/shared";

export interface ArenaOpponent {
  id: string;
  name: string;
  classId: ClassId;
  level: number;
  power: number; // aggregate rating
  elo: number;
  winRate: number;
  stats: Partial<DerivedStats>;
  abilities: string[];
  titleLabel?: string;
  flavor?: string;
}

export const ARENA_RANKS = [
  { min: 0, name: "Бронза V", color: "#a16207" },
  { min: 200, name: "Бронза III", color: "#b45309" },
  { min: 400, name: "Серебро V", color: "#94a3b8" },
  { min: 600, name: "Серебро II", color: "#cbd5e1" },
  { min: 800, name: "Золото V", color: "#eab308" },
  { min: 1000, name: "Золото I", color: "#facc15" },
  { min: 1200, name: "Платина III", color: "#22d3ee" },
  { min: 1500, name: "Бриллиант II", color: "#60a5fa" },
  { min: 1800, name: "Мастер", color: "#a78bfa" },
  { min: 2100, name: "Гроссмейстер", color: "#f0abfc" },
  { min: 2500, name: "Легенда Бездны", color: "#fb7185" },
];

export function arenaRankFor(elo: number) {
  let rank = ARENA_RANKS[0]!;
  for (const r of ARENA_RANKS) if (elo >= r.min) rank = r;
  return rank;
}

export function arenaEloDelta(playerElo: number, opponentElo: number, playerWon: boolean) {
  const K = 32;
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(K * ((playerWon ? 1 : 0) - expected));
}

export const ARENA_OPPONENTS: ArenaOpponent[] = [
  { id: "arena_grim_1", name: "Гримволд Кровавый", classId: "warden", level: 12, power: 420, elo: 300, winRate: 0.52, stats: { maxHp: 620, attack: 88, defense: 38 }, abilities: ["basic_strike", "shield_bash", "taunt"], titleLabel: "Раздолбай", flavor: "Ломает мечи и зубы." },
  { id: "arena_ilya_2", name: "Илья Рунный", classId: "runesmith", level: 15, power: 510, elo: 480, winRate: 0.58, stats: { maxHp: 520, spellPower: 110, maxMana: 180 }, abilities: ["basic_strike", "rune_bolt", "fireball"], flavor: "Рунная лава под каждым шагом." },
  { id: "arena_void_3", name: "Тёмная Мэйра", classId: "voidcaller", level: 18, power: 640, elo: 720, winRate: 0.62, stats: { maxHp: 480, spellPower: 140, critChance: 0.25 }, abilities: ["basic_strike", "soul_rip", "shadow_step"], titleLabel: "Шёпот", flavor: "Шепчет — и ты уже мёртв." },
  { id: "arena_volk_4", name: "Волк-Шепчущий", classId: "beastbound", level: 20, power: 730, elo: 900, winRate: 0.61, stats: { maxHp: 760, attack: 140, speed: 70 }, abilities: ["basic_strike", "heroic_strike", "poison_dart"], flavor: "Вперёд лезет клык." },
  { id: "arena_omega_5", name: "Омега Железная", classId: "warden", level: 24, power: 920, elo: 1180, winRate: 0.68, stats: { maxHp: 1100, defense: 95, blockChance: 0.25 }, abilities: ["basic_strike", "divine_shield", "taunt"], titleLabel: "Неумолимая", flavor: "Щит, который нельзя пробить. Кроме одного раза." },
  { id: "arena_nyx_6", name: "Никс Лезвие", classId: "voidcaller", level: 28, power: 1100, elo: 1420, winRate: 0.71, stats: { maxHp: 760, critChance: 0.35, critMultiplier: 2.2 }, abilities: ["basic_strike", "assassinate", "shadow_step"], flavor: "Зовут 'Улыбкой Бездны'." },
  { id: "arena_inferno_7", name: "Инферно Каск", classId: "runesmith", level: 32, power: 1350, elo: 1720, winRate: 0.74, stats: { maxHp: 940, spellPower: 210, resistance: { physical: 0, fire: 0.35, frost: 0.1, shock: 0.1, void: 0.1, holy: 0.1 } as any }, abilities: ["basic_strike", "meteor", "chain_lightning"], titleLabel: "Сожжённый заживо", flavor: "Его броня — расплавленная руна." },
  { id: "arena_silent_8", name: "Молчаливая Соль", classId: "beastbound", level: 38, power: 1630, elo: 2010, winRate: 0.78, stats: { maxHp: 1200, attack: 220, lifesteal: 0.2 }, abilities: ["basic_strike", "execute", "berserk"], flavor: "Ни слова за пять лет." },
  { id: "arena_apex_9", name: "Апекс Т.", classId: "voidcaller", level: 45, power: 2100, elo: 2350, winRate: 0.82, stats: { maxHp: 1400, spellPower: 320, critChance: 0.4, critMultiplier: 2.5 }, abilities: ["basic_strike", "abyss_reap", "meteor", "shadow_step"], titleLabel: "Мастер Бездны", flavor: "Побывала глубже всех." },
  { id: "arena_god_10", name: "Безымянный", classId: "warden", level: 60, power: 3000, elo: 2700, winRate: 0.9, stats: { maxHp: 2400, attack: 340, defense: 160, blockChance: 0.35 }, abilities: ["basic_strike", "divine_shield", "execute", "vengeance"], titleLabel: "Безымянный Легенда", flavor: "Имя стёрли из истории. Остались только шрамы." },
];
