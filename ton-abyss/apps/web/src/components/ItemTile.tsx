import type { ItemInstance, RarityId, ItemSlot } from "@ton-abyss/shared";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ITEMS } from "@ton-abyss/content";
import { motion } from "framer-motion";
import { ICONS, type IconName } from "./Icon.js";

export function rarityTint(r: RarityId): string {
  return RARITY_COLOR[r];
}

const SLOT_ICON: Record<ItemSlot, IconName> = {
  weapon: "sword",
  offhand: "shield",
  head: "helm",
  chest: "chest",
  legs: "legs",
  hands: "gloves",
  feet: "boots",
  ring: "ring",
  amulet: "amulet",
  neck: "amulet",
  waist: "amulet",
  back: "cape",
  trinket: "trinket",
  relic: "relic",
  consumable: "potion",
  material: "essence",
  rune: "rune",
  pet_egg: "pet",
  key: "dungeons",
};

const WEAPON_ICON: Record<string, IconName> = {
  sword: "sword",
  greatsword: "sword",
  axe: "sword",
  mace: "hammer",
  hammer: "hammer",
  dagger: "dagger",
  bow: "bow",
  staff: "staff",
  wand: "staff",
  tome: "codex",
  claw: "dagger",
  spear: "dagger",
};

export function ItemTile({ item, onClick, selected }: { item: ItemInstance; onClick?: () => void; selected?: boolean }) {
  const base = ITEMS[item.baseId];
  if (!base) return null;
  const iconKey: IconName =
    base.slot === "weapon" && base.weaponKind
      ? WEAPON_ICON[base.weaponKind] ?? "sword"
      : SLOT_ICON[base.slot] ?? "gem";
  const Icon = ICONS[iconKey];
  const isEpic = item.rarity === "legendary" || item.rarity === "mythic" || item.rarity === "abyssal";
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      data-rarity={item.rarity}
      className={`relative rarity-gradient-border rarity-glow rounded-xl p-2 aspect-square flex flex-col items-center justify-center text-center overflow-hidden ${
        selected ? "ring-2 ring-white/70" : ""
      }`}
    >
      <div
        className="grid place-items-center w-10 h-10 rounded-lg mb-1"
        style={{ color: "var(--rc)", background: "color-mix(in srgb, var(--rc) 12%, transparent)" }}
      >
        <Icon size={22} />
      </div>
      <span
        className="text-[10px] leading-3 line-clamp-2 font-semibold px-0.5"
        style={{ color: "var(--rc)" }}
      >
        {base.name}
      </span>
      {item.upgradeLevel > 0 && (
        <span className="absolute top-1 right-1 text-[10px] font-mono font-bold text-amber-300 drop-shadow">
          +{item.upgradeLevel}
        </span>
      )}
      {item.level > 1 && (
        <span className="absolute bottom-0.5 left-1 text-[9px] font-mono text-white/40">ур.{item.level}</span>
      )}
      {isEpic && (
        <motion.span
          className="absolute top-1 left-1 text-[9px]"
          style={{ color: "var(--rc)" }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✦
        </motion.span>
      )}
    </motion.button>
  );
}
