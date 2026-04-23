import type { ItemInstance } from "@ton-abyss/shared";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ITEMS } from "@ton-abyss/content";
import { motion } from "framer-motion";

const SLOT_ICON: Record<string, string> = {
  weapon: "🗡️", offhand: "🛡️", head: "👑", chest: "🥼", legs: "👖",
  hands: "🧤", feet: "🥾", ring: "💍", amulet: "📿", relic: "🔮",
  consumable: "🧪", material: "📦", rune: "🔯", pet_egg: "🥚", key: "🗝️",
};

export function ItemTile({ item, onClick, selected }: { item: ItemInstance; onClick?: () => void; selected?: boolean }) {
  const base = ITEMS[item.baseId];
  if (!base) return null;
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      data-rarity={item.rarity}
      className={`relative rarity-glow rarity-border rounded-lg bg-white/5 border p-2 aspect-square flex flex-col items-center justify-center text-center ${selected ? "ring-2 ring-white" : ""}`}
    >
      <span className="text-2xl">{SLOT_ICON[base.slot] ?? "❔"}</span>
      <span
        className="mt-1 text-[10px] leading-3 line-clamp-2"
        style={{ color: RARITY_COLOR[item.rarity] }}
      >
        {base.name}
      </span>
      {item.upgradeLevel > 0 && (
        <span className="absolute top-1 right-1 text-[10px] font-mono text-amber-300">+{item.upgradeLevel}</span>
      )}
      {item.level > 1 && (
        <span className="absolute bottom-0.5 left-1 text-[9px] font-mono text-white/40">ур.{item.level}</span>
      )}
    </motion.button>
  );
}
