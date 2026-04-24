// Factions — reputation tracks with tier rewards.
export interface FactionDef {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  icon: string;
  opposedTo?: string;
  tiers: FactionTier[];
  sourceLabel: string; // how to earn rep, displayed in UI
}

export interface FactionTier {
  tier: number;
  name: string;
  repRequired: number;
  rewards: {
    gold?: number;
    title?: string;
    itemBaseId?: string;
    recipeId?: string;
    unlockLabel?: string;
  };
}

export const FACTIONS: Record<string, FactionDef> = {
  order_of_light: {
    id: "order_of_light",
    name: "Орден Истины",
    shortName: "Орден",
    tagline: "Защитники смертных. Закон, сталь, свет.",
    color: "#fcd34d",
    icon: "🛡️",
    opposedTo: "cult_of_abyss",
    sourceLabel: "Убивай культистов и боссов культа, чтобы получить репутацию.",
    tiers: [
      { tier: 1, name: "Подмастерье", repRequired: 0, rewards: { unlockLabel: "Доступ к лавке Ордена" } },
      { tier: 2, name: "Страж", repRequired: 500, rewards: { itemBaseId: "arm_order_chest", title: "Страж Истины" } },
      { tier: 3, name: "Паладин", repRequired: 1500, rewards: { recipeId: "rec_order_blade", gold: 2500 } },
      { tier: 4, name: "Магистр", repRequired: 4000, rewards: { itemBaseId: "wpn_order_sword", title: "Магистр Ордена" } },
      { tier: 5, name: "Светоносец", repRequired: 10000, rewards: { itemBaseId: "rel_order_crest", title: "Светоносец", gold: 25000 } },
    ],
  },
  cult_of_abyss: {
    id: "cult_of_abyss",
    name: "Культ Бездны",
    shortName: "Культ",
    tagline: "Шёпот древних. Сила в забытьи.",
    color: "#c084fc",
    icon: "🌀",
    opposedTo: "order_of_light",
    sourceLabel: "Жертвуй эпик-лут в алтаре и проходи void-данжи.",
    tiers: [
      { tier: 1, name: "Посвящённый", repRequired: 0, rewards: { unlockLabel: "Алтарь пожертвований открыт" } },
      { tier: 2, name: "Неофит", repRequired: 500, rewards: { itemBaseId: "arm_cult_cowl" } },
      { tier: 3, name: "Жрец", repRequired: 1500, rewards: { recipeId: "rec_cult_rune" } },
      { tier: 4, name: "Ересиарх", repRequired: 4000, rewards: { itemBaseId: "wpn_cult_tome", title: "Ересиарх Бездны" } },
      { tier: 5, name: "Голос Бездны", repRequired: 10000, rewards: { itemBaseId: "rel_void_eye", title: "Голос Бездны" } },
    ],
  },
  smiths_guild: {
    id: "smiths_guild",
    name: "Гильдия Кузнецов",
    shortName: "Гильдия",
    tagline: "Металл не лжёт. Только молот.",
    color: "#fb923c",
    icon: "⚒️",
    sourceLabel: "Крафти, перековывай и разрушай предметы для гильдии.",
    tiers: [
      { tier: 1, name: "Ученик", repRequired: 0, rewards: { unlockLabel: "Скидка 5% в кузне" } },
      { tier: 2, name: "Подмастерье", repRequired: 400, rewards: { unlockLabel: "Скидка 10% в кузне", recipeId: "rec_guild_hammer" } },
      { tier: 3, name: "Мастер", repRequired: 1200, rewards: { unlockLabel: "+5% шанс крита при крафте", itemBaseId: "wpn_guild_hammer" } },
      { tier: 4, name: "Старейшина", repRequired: 3000, rewards: { recipeId: "rec_guild_runeblade", title: "Старейшина Кузни" } },
      { tier: 5, name: "Архикузнец", repRequired: 8000, rewards: { itemBaseId: "wpn_archforge", title: "Архикузнец", gold: 20000 } },
    ],
  },
  free_hunters: {
    id: "free_hunters",
    name: "Вольные Охотники",
    shortName: "Охотники",
    tagline: "Добыча — закон. След не остынет.",
    color: "#22d3ee",
    icon: "🏹",
    sourceLabel: "Выполняй охотничьи контракты и убивай редких монстров.",
    tiers: [
      { tier: 1, name: "Следопыт", repRequired: 0, rewards: { unlockLabel: "Охотничья доска открыта" } },
      { tier: 2, name: "Разведчик", repRequired: 500, rewards: { itemBaseId: "wpn_hunter_bow" } },
      { tier: 3, name: "Охотник", repRequired: 1500, rewards: { itemBaseId: "arm_hunter_cloak", recipeId: "rec_hunter_trap" } },
      { tier: 4, name: "Мастер-охотник", repRequired: 4000, rewards: { itemBaseId: "wpn_hunter_rifle", title: "Мастер-охотник" } },
      { tier: 5, name: "Тень Бездны", repRequired: 10000, rewards: { itemBaseId: "rel_beastheart", title: "Тень Бездны" } },
    ],
  },
};

export const FACTION_IDS = Object.keys(FACTIONS);
