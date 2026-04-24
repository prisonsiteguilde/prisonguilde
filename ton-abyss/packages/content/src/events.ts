// World events — timed multiplier events.
export interface WorldEventDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  durationHours: number;
  multipliers: {
    xp?: number;
    gold?: number;
    drops?: number;
    crit?: number;
    rep?: number;
  };
  flavor?: string;
}

export const WORLD_EVENTS: WorldEventDef[] = [
  { id: "evt_harvest", name: "Урожай Бездны", description: "+50% золота, +20% XP", icon: "💰", durationHours: 24, multipliers: { gold: 1.5, xp: 1.2 }, flavor: "Купцы открывают скрытые склады." },
  { id: "evt_bloodmoon", name: "Кровавая Луна", description: "Монстры сильнее (+20%), но дроп +50%", icon: "🌕", durationHours: 12, multipliers: { drops: 1.5 }, flavor: "Красная луна. Монстры выходят из логовищ стаями." },
  { id: "evt_arcane_storm", name: "Буря Магии", description: "+30% шанс крита", icon: "⚡", durationHours: 6, multipliers: { crit: 1.3 } },
  { id: "evt_faction_war", name: "Война Фракций", description: "+50% репутации за задания", icon: "⚔️", durationHours: 24, multipliers: { rep: 1.5 } },
  { id: "evt_hunt_week", name: "Неделя Охоты", description: "Все баунти дают +100% золота и +50% XP", icon: "🏹", durationHours: 72, multipliers: { gold: 2, xp: 1.5 } },
];
