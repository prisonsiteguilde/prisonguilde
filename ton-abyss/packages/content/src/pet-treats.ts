// Pet treats — special consumable items that give pet bond/happiness/level XP
// when fed via the Pets screen. Distinct from regular materials in `feedTable`.

export interface PetTreatDef {
  id: string;
  name: string;
  ru: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  iconColor: string;
  bondGain: number; // 0..10 added to pet bond per use
  happinessGain: number; // 0..100
  xpGain: number; // pet XP
  buffMinutes: number; // duration of stat buff after use
  buffDescription: string;
  // Family preference: gives 1.5× effect on this family
  preferredFamily?: "wyrm" | "golem" | "spirit" | "beast" | "construct" | "abyssal";
  sellValue: number;
}

export const PET_TREATS: Record<string, PetTreatDef> = {
  treat_jerky: {
    id: "treat_jerky",
    name: "jerky",
    ru: "Сушёное мясо",
    description: "Базовое лакомство. Любят все звери.",
    rarity: "common",
    iconColor: "#a16207",
    bondGain: 0,
    happinessGain: 12,
    xpGain: 30,
    buffMinutes: 0,
    buffDescription: "—",
    preferredFamily: "beast",
    sellValue: 8,
  },
  treat_honey: {
    id: "treat_honey",
    name: "honey",
    ru: "Дикий мёд",
    description: "Сладкое лакомство, поднимает настроение.",
    rarity: "common",
    iconColor: "#facc15",
    bondGain: 1,
    happinessGain: 25,
    xpGain: 40,
    buffMinutes: 30,
    buffDescription: "+5% удача на 30 мин",
    sellValue: 18,
  },
  treat_emberberry: {
    id: "treat_emberberry",
    name: "emberberry",
    ru: "Ягоды углей",
    description: "Раскалённые ягоды для огненных питомцев.",
    rarity: "uncommon",
    iconColor: "#f97316",
    bondGain: 1,
    happinessGain: 30,
    xpGain: 80,
    buffMinutes: 60,
    buffDescription: "+10% урон огнём на 60 мин",
    preferredFamily: "wyrm",
    sellValue: 45,
  },
  treat_iceshard_candy: {
    id: "treat_iceshard_candy",
    name: "iceshard candy",
    ru: "Леденец-льдинка",
    description: "Хрустящий, освежает дух питомца.",
    rarity: "uncommon",
    iconColor: "#38bdf8",
    bondGain: 1,
    happinessGain: 30,
    xpGain: 80,
    buffMinutes: 60,
    buffDescription: "+10% сопротивление льду на 60 мин",
    preferredFamily: "spirit",
    sellValue: 45,
  },
  treat_phoenix_feast: {
    id: "treat_phoenix_feast",
    name: "phoenix feast",
    ru: "Пир Феникса",
    description: "Редкое блюдо. Даёт значительный бонус опыту и связи.",
    rarity: "rare",
    iconColor: "#f43f5e",
    bondGain: 2,
    happinessGain: 50,
    xpGain: 250,
    buffMinutes: 120,
    buffDescription: "+15% всех статов на 120 мин",
    preferredFamily: "wyrm",
    sellValue: 220,
  },
  treat_arcane_cookie: {
    id: "treat_arcane_cookie",
    name: "arcane cookie",
    ru: "Магическое печенье",
    description: "Хрустящее, светится.",
    rarity: "rare",
    iconColor: "#a855f7",
    bondGain: 2,
    happinessGain: 45,
    xpGain: 300,
    buffMinutes: 90,
    buffDescription: "+20% сила заклинаний на 90 мин",
    preferredFamily: "construct",
    sellValue: 280,
  },
  treat_void_truffle: {
    id: "treat_void_truffle",
    name: "void truffle",
    ru: "Трюфель Бездны",
    description: "Гриб из глубин. Возможно опасен.",
    rarity: "epic",
    iconColor: "#9333ea",
    bondGain: 3,
    happinessGain: 70,
    xpGain: 600,
    buffMinutes: 180,
    buffDescription: "+25% урон бездны / -10% получаемый урон, 180 мин",
    preferredFamily: "abyssal",
    sellValue: 950,
  },
  treat_golem_grit: {
    id: "treat_golem_grit",
    name: "golem grit",
    ru: "Гранит Голема",
    description: "Каменная крошка с мифрилом. Хрустит, как леденец.",
    rarity: "epic",
    iconColor: "#94a3b8",
    bondGain: 3,
    happinessGain: 60,
    xpGain: 550,
    buffMinutes: 180,
    buffDescription: "+30% брони / +25% HP на 180 мин",
    preferredFamily: "golem",
    sellValue: 880,
  },
  treat_eternal_ambrosia: {
    id: "treat_eternal_ambrosia",
    name: "eternal ambrosia",
    ru: "Вечная Амброзия",
    description: "Легендарный нектар богов. Питомец светится день.",
    rarity: "legendary",
    iconColor: "#fbbf24",
    bondGain: 5,
    happinessGain: 100,
    xpGain: 1500,
    buffMinutes: 360,
    buffDescription: "+40% всех статов / +25% find на 6 ч",
    sellValue: 4500,
  },
  treat_dragon_heart: {
    id: "treat_dragon_heart",
    name: "dragon heart",
    ru: "Сердце Дракона",
    description: "Билось ещё мгновение назад. Питомец становится временно бессмертным.",
    rarity: "mythic",
    iconColor: "#dc2626",
    bondGain: 8,
    happinessGain: 100,
    xpGain: 4000,
    buffMinutes: 720,
    buffDescription: "+100% HP, +50% всех статов, 12 ч. Гарантированный crit.",
    preferredFamily: "wyrm",
    sellValue: 18000,
  },
};

export const PET_TREAT_IDS = Object.keys(PET_TREATS);
