// Endless tower — infinite floor scaling, checkpoints every 10 floors.
import type { ElementId } from "@ton-abyss/shared";

export interface TowerFloorDef {
  floor: number;
  monsterPool: string[];
  bossId?: string;
  modifier?: { name: string; description: string };
  element: ElementId;
  checkpoint: boolean;
}

export const TOWER_CONFIG = {
  name: "Башня Бездны",
  description: "Бесконечная вертикаль. Каждый этаж сложнее. Чекпоинт каждые 10 этажей.",
  checkpointInterval: 10,
  hpGrowthPerFloor: 0.12, // multiplicative
  damageGrowthPerFloor: 0.08,
  goldGrowthPerFloor: 0.15,
  xpGrowthPerFloor: 0.1,
  entryCost: { gold: 300 },
  resetCooldownMinutes: 1440, // 24h before full reset
};

export const TOWER_BIOME_ROTATION: { floor: number; biome: string; monsterPool: string[]; element: ElementId; bossAtFloor?: string }[] = [
  { floor: 1, biome: "Крипта", monsterPool: ["mon_skeleton", "mon_zombie", "mon_bone_guardian"], element: "void" },
  { floor: 11, biome: "Лёд", monsterPool: ["mon_frost_sprite", "mon_ice_wolf", "mon_glacial_guardian"], element: "frost" },
  { floor: 21, biome: "Преисподняя", monsterPool: ["mon_fire_elemental", "mon_hellhound", "mon_flame_knight"], element: "fire" },
  { floor: 31, biome: "Гроза", monsterPool: ["mon_shade", "mon_wraith"], element: "shock" },
  { floor: 41, biome: "Бездна", monsterPool: ["mon_void_crawler", "mon_nightmare", "mon_shadow_beast"], element: "void" },
  { floor: 51, biome: "Небесные врата", monsterPool: ["mon_abyss_warden"], element: "holy" },
];

export const TOWER_BOSS_FLOORS: Record<number, string> = {
  10: "boss_crypt_knight",
  20: "boss_frost_wyrm",
  30: "boss_infernal_lord",
  40: "boss_abyss_titan",
  50: "boss_abyss_titan",
};

export const TOWER_MODIFIERS: { minFloor: number; name: string; description: string }[] = [
  { minFloor: 5, name: "Эхо Бездны", description: "Враги получают +10% атаки." },
  { minFloor: 10, name: "Злой рок", description: "−30% лечение от зелий." },
  { minFloor: 20, name: "Холодная ярость", description: "Замораживание длится на 1 ход дольше." },
  { minFloor: 30, name: "Безумная гонка", description: "Враги действуют первыми каждый ход." },
  { minFloor: 40, name: "Запечатанная магия", description: "Стоимость маны ×1.25." },
  { minFloor: 50, name: "Абсолют", description: "У игрока только одна жизнь. HP/Mana не восстанавливаются между боями." },
];

export function towerScaling(floor: number) {
  return {
    hpMult: Math.pow(1 + TOWER_CONFIG.hpGrowthPerFloor, floor - 1),
    dmgMult: Math.pow(1 + TOWER_CONFIG.damageGrowthPerFloor, floor - 1),
    goldMult: Math.pow(1 + TOWER_CONFIG.goldGrowthPerFloor, floor - 1),
    xpMult: Math.pow(1 + TOWER_CONFIG.xpGrowthPerFloor, floor - 1),
  };
}

export function towerBiomeForFloor(floor: number) {
  let current = TOWER_BIOME_ROTATION[0]!;
  for (const entry of TOWER_BIOME_ROTATION) {
    if (floor >= entry.floor) current = entry;
    else break;
  }
  return current;
}
