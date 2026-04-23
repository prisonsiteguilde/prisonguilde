import type { MapNode } from "@ton-abyss/shared";

// 3 acts × ~5 nodes each = 15 nodes total. Acts gate by level + prerequisites.
export const WORLD_MAP: MapNode[] = [
  // ======== ACT I: Граница света ========
  { id: "mn_town_safehold", act: 1, x: 10, y: 80, kind: "town", name: "Убежище", levelReq: 1, biome: "haven" },
  { id: "mn_crypt_gate", act: 1, x: 24, y: 70, kind: "dungeon", name: "Заброшенный склеп", levelReq: 1, dungeonId: "dng_crypt_01", requires: [], biome: "crypt" },
  { id: "mn_ruined_chapel", act: 1, x: 36, y: 62, kind: "dungeon", name: "Разрушенная часовня", levelReq: 4, dungeonId: "dng_chapel", requires: ["mn_crypt_gate"], biome: "holy" },
  { id: "mn_sunken_vault", act: 1, x: 48, y: 72, kind: "dungeon", name: "Затопленный склеп", levelReq: 6, dungeonId: "dng_vault", requires: ["mn_crypt_gate"], biome: "water" },
  { id: "mn_crypt_boss", act: 1, x: 52, y: 55, kind: "boss", name: "Лорд склепа", levelReq: 7, dungeonId: "dng_crypt_01", requires: ["mn_ruined_chapel", "mn_sunken_vault"], biome: "crypt" },

  // ======== ACT II: Замёрзшие земли ========
  { id: "mn_portal_ice", act: 2, x: 60, y: 48, kind: "portal", name: "Портал Льдов", levelReq: 8, requires: ["mn_crypt_boss"], biome: "ice" },
  { id: "mn_ice_caverns", act: 2, x: 62, y: 38, kind: "dungeon", name: "Ледяные пещеры", levelReq: 9, dungeonId: "dng_ice_01", requires: ["mn_portal_ice"], biome: "ice" },
  { id: "mn_glacier_peak", act: 2, x: 72, y: 30, kind: "dungeon", name: "Вершина ледника", levelReq: 12, dungeonId: "dng_glacier", requires: ["mn_ice_caverns"], biome: "ice" },
  { id: "mn_frostfell_ruins", act: 2, x: 80, y: 42, kind: "dungeon", name: "Руины Морозной падали", levelReq: 15, dungeonId: "dng_frostfell", requires: ["mn_ice_caverns"], biome: "ice" },
  { id: "mn_ice_boss", act: 2, x: 84, y: 26, kind: "boss", name: "Матриарх льда", levelReq: 16, dungeonId: "dng_ice_01", requires: ["mn_glacier_peak", "mn_frostfell_ruins"], biome: "ice" },

  // ======== ACT III: Преисподняя ========
  { id: "mn_portal_infernal", act: 3, x: 50, y: 20, kind: "portal", name: "Врата Преисподней", levelReq: 18, requires: ["mn_ice_boss"], biome: "infernal" },
  { id: "mn_infernal_bastion", act: 3, x: 44, y: 14, kind: "dungeon", name: "Бастион Преисподней", levelReq: 18, dungeonId: "dng_infernal_01", requires: ["mn_portal_infernal"], biome: "infernal" },
  { id: "mn_molten_chambers", act: 3, x: 34, y: 12, kind: "dungeon", name: "Раскалённые чертоги", levelReq: 22, dungeonId: "dng_molten", requires: ["mn_infernal_bastion"], biome: "infernal" },
  { id: "mn_ashen_wastes", act: 3, x: 24, y: 18, kind: "dungeon", name: "Пепельная пустошь", levelReq: 24, dungeonId: "dng_ashen", requires: ["mn_infernal_bastion"], biome: "infernal" },
  { id: "mn_infernal_boss", act: 3, x: 14, y: 8, kind: "boss", name: "Принц Преисподней", levelReq: 26, dungeonId: "dng_infernal_01", requires: ["mn_molten_chambers", "mn_ashen_wastes"], biome: "infernal" },

  // ======== ACT IV: Бездна ========
  { id: "mn_portal_abyss", act: 4, x: 8, y: 50, kind: "portal", name: "Граница Бездны", levelReq: 28, requires: ["mn_infernal_boss"], biome: "abyss" },
  { id: "mn_abyss_gate", act: 4, x: 14, y: 58, kind: "dungeon", name: "Врата Бездны", levelReq: 28, dungeonId: "dng_abyss_01", requires: ["mn_portal_abyss"], biome: "abyss" },
  { id: "mn_void_shrine", act: 4, x: 8, y: 66, kind: "dungeon", name: "Храм Пустоты", levelReq: 32, dungeonId: "dng_void_shrine", requires: ["mn_abyss_gate"], biome: "abyss" },
  { id: "mn_forgotten_depths", act: 4, x: 16, y: 74, kind: "dungeon", name: "Забытые глубины", levelReq: 36, dungeonId: "dng_depths", requires: ["mn_void_shrine"], biome: "abyss" },
  { id: "mn_abyss_boss", act: 4, x: 24, y: 68, kind: "boss", name: "Титан Бездны", levelReq: 42, dungeonId: "dng_abyss_01", requires: ["mn_forgotten_depths"], biome: "abyss" },
];

export const ACT_META: Record<1 | 2 | 3 | 4, { id: number; name: string; description: string; color: string }> = {
  1: { id: 1, name: "Акт I — Граница света", description: "Первые шаги в катакомбах. Каждый шаг может стать последним.", color: "#60a5fa" },
  2: { id: 2, name: "Акт II — Замёрзшие земли", description: "Холод убивает быстрее меча. Готовьте огонь.", color: "#a5f3fc" },
  3: { id: 3, name: "Акт III — Преисподняя", description: "Пламя Преисподней выжигает трусов.", color: "#fb923c" },
  4: { id: 4, name: "Акт IV — Бездна", description: "За пределами смерти лишь пустота. И она смотрит в ответ.", color: "#c084fc" },
};
