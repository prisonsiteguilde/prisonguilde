// Rare monster hunts — specific named targets with location and guaranteed drops.
export interface HuntDef {
  id: string;
  name: string;
  description: string;
  targetMonsterId: string;
  biome: string;
  levelReq: number;
  trackDurationMinutes: number;
  rewards: {
    gold: number;
    xp: number;
    itemBaseId?: string;
    dust?: number;
    reputation?: { factionId: string; amount: number };
  };
  flavor?: string;
}

export const HUNTS: HuntDef[] = [
  { id: "hunt_pale_wraith", name: "Бледный призрак", description: "Ведёт других призраков в Крипте. Выследи и убей.", targetMonsterId: "mon_wraith", biome: "crypt", levelReq: 5, trackDurationMinutes: 30, rewards: { gold: 800, xp: 500, itemBaseId: "arm_shadow_cowl", reputation: { factionId: "free_hunters", amount: 50 } }, flavor: "Говорят, он помнит свою жизнь. Жаль." },
  { id: "hunt_alpha_wolf", name: "Альфа-волк стаи", description: "Заводила стаи ледяных волков.", targetMonsterId: "mon_ice_wolf", biome: "ice", levelReq: 10, trackDurationMinutes: 45, rewards: { gold: 1600, xp: 1000, itemBaseId: "arm_hunter_cloak", reputation: { factionId: "free_hunters", amount: 70 }, dust: 20 }, flavor: "Шерсть белее снега, глаза синее пламени." },
  { id: "hunt_infernal_hound", name: "Цепной пёс Ада", description: "Огромный инфернальный пёс. Осторожно — плюётся лавой.", targetMonsterId: "mon_hellhound", biome: "infernal", levelReq: 18, trackDurationMinutes: 60, rewards: { gold: 3200, xp: 2000, itemBaseId: "wpn_hunter_bow", reputation: { factionId: "free_hunters", amount: 100 }, dust: 35 } },
  { id: "hunt_void_whisperer", name: "Шёпот Бездны", description: "Необычный ночной кошмар. Истинная форма меняется.", targetMonsterId: "mon_nightmare", biome: "abyss", levelReq: 28, trackDurationMinutes: 90, rewards: { gold: 6000, xp: 4500, itemBaseId: "wpn_cult_tome", reputation: { factionId: "free_hunters", amount: 150 }, dust: 70 }, flavor: "Видевшие его до рассвета не доживают." },
  { id: "hunt_stone_tyrant", name: "Каменный тиран", description: "Массивный лавовый голем-мутант. Бросает камнями размером с дом.", targetMonsterId: "mon_lava_golem", biome: "infernal", levelReq: 22, trackDurationMinutes: 75, rewards: { gold: 4500, xp: 3000, itemBaseId: "rel_beastheart", reputation: { factionId: "free_hunters", amount: 120 }, dust: 50 } },
];
