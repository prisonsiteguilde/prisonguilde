// Mounts — cosmetic + travel-speed + minor stat bonuses.
import type { DerivedStats } from "@ton-abyss/shared";

export interface MountDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  costGold?: number;
  costShards?: number;
  unlockCondition?: "default" | "boss_kill" | "achievement" | "shards";
  unlockRef?: string; // e.g. boss id
  travelSpeedBonus: number; // percentage of cooldown reduction on dungeon re-entry etc
  statBonus?: Partial<DerivedStats>;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const MOUNTS: Record<string, MountDef> = {
  mount_riding_horse: {
    id: "mount_riding_horse",
    name: "Ездовая лошадь",
    description: "Простая. Быстрая. Надёжная.",
    icon: "🐎",
    costGold: 2500,
    unlockCondition: "default",
    travelSpeedBonus: 0.05,
    statBonus: { speed: 5 },
    rarity: "common",
  },
  mount_dire_wolf: {
    id: "mount_dire_wolf",
    name: "Лютоволк",
    description: "Зверь, выращенный на крови врагов.",
    icon: "🐺",
    costGold: 8000,
    unlockCondition: "default",
    travelSpeedBonus: 0.1,
    statBonus: { speed: 10, attack: 5 },
    rarity: "rare",
  },
  mount_frost_elk: {
    id: "mount_frost_elk",
    name: "Ледяной лось",
    description: "Копыта звенят по снегу как колокольчики.",
    icon: "🦌",
    costGold: 20000,
    unlockCondition: "boss_kill",
    unlockRef: "boss_frost_wyrm",
    travelSpeedBonus: 0.15,
    statBonus: { speed: 15, resistance: { physical: 0, fire: 0, frost: 0.05, shock: 0, void: 0, holy: 0 } as any },
    rarity: "epic",
  },
  mount_hellsteed: {
    id: "mount_hellsteed",
    name: "Адский скакун",
    description: "Копыта из расплавленной стали.",
    icon: "🔥",
    costShards: 30,
    unlockCondition: "shards",
    travelSpeedBonus: 0.18,
    statBonus: { speed: 15, attack: 15 },
    rarity: "epic",
  },
  mount_abyss_drake: {
    id: "mount_abyss_drake",
    name: "Дракон Бездны",
    description: "Летит. Не ходит. Не оставляет следов.",
    icon: "🐉",
    costShards: 80,
    unlockCondition: "boss_kill",
    unlockRef: "boss_abyss_titan",
    travelSpeedBonus: 0.3,
    statBonus: { speed: 30, spellPower: 20, critChance: 0.05 },
    rarity: "legendary",
  },
  mount_celestial_stag: {
    id: "mount_celestial_stag",
    name: "Небесный олень",
    description: "Рогами касается звёзд.",
    icon: "✨",
    costShards: 120,
    unlockCondition: "achievement",
    unlockRef: "ach_level_50",
    travelSpeedBonus: 0.35,
    statBonus: { speed: 35, maxMana: 100, spellPower: 30 },
    rarity: "legendary",
  },
};
