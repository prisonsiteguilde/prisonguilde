import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ENCHANTS, RUNEWORDS, ITEMS } from "@ton-abyss/content";

export function Enchanting() {
  const setScreen = useGame((s) => s.setScreen);
  const inventory = useGame((s) => s.inventory);
  const materials = useGame((s) => s.materials);
  const char = useGame((s) => s.character)!;
  const applyEnchant = useGame((s) => s.applyEnchant);
  const applyRuneword = useGame((s) => s.applyRuneword);
  const [tab, setTab] = useState<"enchant" | "runeword">("enchant");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const equipableItems = inventory.filter((it) => {
    const base = ITEMS[it.baseId];
    return base && (base.slot === "weapon" || base.slot === "offhand" || base.slot === "chest" || base.slot === "head" || base.slot === "legs" || base.slot === "hands" || base.slot === "feet");
  });

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Чарование</h2>
        <span className="w-16" />
      </div>

      <div className="flex gap-2">
        <button className={`flex-1 px-3 py-2 rounded text-sm ${tab === "enchant" ? "bg-fuchsia-500/30 border border-fuchsia-400/40" : "bg-black/30"}`} onClick={() => setTab("enchant")}>
          ✨ Энчанты
        </button>
        <button className={`flex-1 px-3 py-2 rounded text-sm ${tab === "runeword" ? "bg-amber-500/30 border border-amber-400/40" : "bg-black/30"}`} onClick={() => setTab("runeword")}>
          🔮 Рунворды
        </button>
      </div>

      {/* Item selector */}
      <div className="card p-3">
        <div className="text-xs text-white/60 mb-2">Выберите предмет для чарования</div>
        {equipableItems.length === 0 ? (
          <div className="text-xs text-white/40">Нет подходящих предметов.</div>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-1">
            {equipableItems.map((it) => {
              const base = ITEMS[it.baseId];
              return (
                <button
                  key={it.uid}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs text-left ${selectedItem === it.uid ? "bg-fuchsia-500/30 border border-fuchsia-400/40" : "bg-black/30 border border-white/10"}`}
                  onClick={() => setSelectedItem(it.uid)}
                >
                  <span className={`rarity-${it.rarity}`}>{base?.name ?? it.baseId}</span>
                  <span className="text-white/40">[{base?.slot}] Lv{it.level}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {tab === "enchant" && (
        <div className="space-y-2">
          <div className="text-xs text-white/50 px-1">Доступные энчанты (золото: {char.gold}, пыль: {char.abyssDust})</div>
          {Object.values(ENCHANTS).map((e) => {
            const canAfford = char.gold >= e.costGold && char.abyssDust >= e.costDust;
            return (
              <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-display text-lg text-fuchsia-200">✨ {e.name}</div>
                    <div className="text-xs text-white/60">{e.description}</div>
                    <div className="text-[10px] text-white/40 mt-1">Слоты: {e.slotRestriction.join(", ")} · Ур. {e.levelReq}+</div>
                    <div className="text-[10px] text-amber-300 mt-0.5">Стоимость: {e.costGold}g + {e.costDust} пыли</div>
                  </div>
                  <button
                    disabled={!selectedItem || !canAfford}
                    className="btn-primary text-xs disabled:opacity-40"
                    onClick={() => {
                      if (!selectedItem) return;
                      const r = applyEnchant(selectedItem, e.id);
                      if (!r.ok && r.error) alert(r.error);
                    }}
                  >
                    Применить
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "runeword" && (
        <div className="space-y-2">
          <div className="text-xs text-white/50 px-1">Руны нужны — проверяйте материалы в кузне.</div>
          {Object.values(RUNEWORDS).map((rw) => {
            const haveAll = rw.runeSequence.every((r) => (materials[r] ?? 0) >= 1);
            return (
              <motion.div key={rw.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3 border-amber-400/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-display text-lg text-amber-200">🔮 {rw.name}</div>
                    <div className="text-xs text-white/60">{rw.description}</div>
                    {rw.flavor && <div className="text-[10px] italic text-white/40 mt-0.5">«{rw.flavor}»</div>}
                    <div className="text-[10px] text-white/50 mt-1">Последовательность рун: {rw.runeSequence.join(" + ")}</div>
                    <div className="text-[10px] text-white/40">Ур. {rw.lvlReq}+ · Слоты: {rw.slotRestriction?.join(", ") ?? "любой"}</div>
                  </div>
                  <button
                    disabled={!selectedItem || !haveAll}
                    className="btn-primary text-xs disabled:opacity-40"
                    onClick={() => {
                      if (!selectedItem) return;
                      const r = applyRuneword(selectedItem, rw.id);
                      if (!r.ok && r.error) alert(r.error);
                    }}
                  >
                    {haveAll ? "Сковать" : "Нет рун"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
