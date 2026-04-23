import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";

export function LootReveal() {
  const lootReveal = useGame((s) => s.lootReveal);
  const dismiss = useGame((s) => s.dismissLootReveal);

  return (
    <AnimatePresence>
      {lootReveal && lootReveal.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -3 }}
            animate={{ scale: 1, rotate: 0 }}
            className="card p-5 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl font-display tracking-widest text-amber-300 mb-3">
              ⚡ ДОБЫЧА ⚡
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {lootReveal.map((it, i) => {
                const base = ITEMS[it.baseId];
                if (!base) return null;
                const color = RARITY_COLOR[it.rarity];
                const isEpic = it.rarity === "legendary" || it.rarity === "mythic" || it.rarity === "abyssal";
                return (
                  <motion.div
                    key={it.uid}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                    className="relative card p-2 text-center"
                    style={{
                      borderColor: color,
                      boxShadow: isEpic ? `0 0 20px ${color}` : `0 0 8px ${color}55`,
                    }}
                  >
                    {isEpic && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{ boxShadow: [`0 0 8px ${color}`, `0 0 24px ${color}`, `0 0 8px ${color}`] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <div className="text-3xl">
                      {base.slot === "weapon" ? "🗡️" : base.slot === "offhand" ? "🛡️" : base.slot === "head" ? "👑" : base.slot === "chest" ? "🥼" : base.slot === "legs" ? "👖" : base.slot === "hands" ? "🧤" : base.slot === "feet" ? "🥾" : base.slot === "ring" ? "💍" : base.slot === "amulet" ? "📿" : base.slot === "relic" ? "🔮" : base.slot === "consumable" ? "🧪" : base.slot === "material" ? "📦" : base.slot === "pet_egg" ? "🥚" : "💎"}
                    </div>
                    <div className="text-[10px] font-bold" style={{ color }}>
                      {base.name}
                    </div>
                    <div className="text-[9px] text-white/60">{it.rarity}</div>
                  </motion.div>
                );
              })}
            </div>
            <button className="btn-primary mt-4 w-full" onClick={dismiss}>Забрать</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
