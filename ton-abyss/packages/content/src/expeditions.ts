// Pet expeditions — pet auto-quests that return rewards after timer.
export interface ExpeditionDef {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  petLevelReq: number;
  successBaseChance: number; // 0..1
  rewards: {
    gold: [number, number];
    xp: [number, number];
    material?: { baseId: string; qty: [number, number] };
    itemChance?: number; // 0..1
    itemPool?: string[];
  };
  failureRefund?: { gold: number };
  biome: string;
  flavor?: string;
}

export const EXPEDITIONS: ExpeditionDef[] = [
  { id: "exp_crypt_sweep", name: "Крипта: разведка", description: "Короткий рейд по Крипте. Питомец приносит мелочь.", durationMinutes: 10, petLevelReq: 1, successBaseChance: 0.85, rewards: { gold: [150, 300], xp: [40, 80], material: { baseId: "mat_iron", qty: [1, 3] } }, biome: "crypt", flavor: "Быстрый забег за медяками." },
  { id: "exp_ice_hunt", name: "Лёд: охота", description: "Ледяная охота в горах. Питомцу понадобится мех потеплее.", durationMinutes: 20, petLevelReq: 5, successBaseChance: 0.75, rewards: { gold: [400, 800], xp: [150, 300], material: { baseId: "mat_leather", qty: [2, 5] }, itemChance: 0.1, itemPool: ["con_greater_hp_potion"] }, biome: "ice" },
  { id: "exp_infernal_trek", name: "Преисподняя: вылазка", description: "Огненная разведка. Риск на вылет, но добыча жирная.", durationMinutes: 35, petLevelReq: 10, successBaseChance: 0.6, rewards: { gold: [900, 2000], xp: [400, 800], material: { baseId: "mat_steel", qty: [2, 4] }, itemChance: 0.2, itemPool: ["con_greater_mana_potion", "mat_mithril"] }, biome: "infernal" },
  { id: "exp_void_dive", name: "Бездна: погружение", description: "Глубокий дайв. Одно движение — и можно потерять питомца.", durationMinutes: 60, petLevelReq: 20, successBaseChance: 0.45, rewards: { gold: [2500, 5000], xp: [1000, 2000], material: { baseId: "mat_mithril", qty: [2, 5] }, itemChance: 0.35, itemPool: ["con_elixir_vitality", "rune_strength"] }, biome: "abyss", flavor: "Не все возвращаются. Но возвращающиеся — с сокровищами." },
  { id: "exp_celestial", name: "Небесный шпиль", description: "Высота, где обитают древние. Только для питомцев, поднявших уровень.", durationMinutes: 90, petLevelReq: 30, successBaseChance: 0.35, rewards: { gold: [6000, 12000], xp: [2500, 5000], material: { baseId: "mat_mithril", qty: [4, 10] }, itemChance: 0.5, itemPool: ["wpn_celestial_staff", "arm_celestial_vestment"] }, biome: "celestial" },
];
