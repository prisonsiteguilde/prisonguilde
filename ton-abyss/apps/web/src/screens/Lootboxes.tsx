import { motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../store.js";
import { LOOTBOXES, type LootboxKind } from "@ton-abyss/shared";
import { Icon } from "../components/Icon.js";

export function Lootboxes() {
  const character = useGame((s) => s.character)!;
  const materials = useGame((s) => s.materials);
  const lbState = useGame((s) => s.lootbox);
  const purchaseLootbox = useGame((s) => s.purchaseLootbox);
  const openLootbox = useGame((s) => s.openLootbox);
  const setScreen = useGame((s) => s.setScreen);
  const [tab, setTab] = useState<"buy" | "open">("open");

  const kinds = Object.keys(LOOTBOXES) as LootboxKind[];

  return (
    <div className="px-4 py-4 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <button onClick={() => setScreen("home")} className="btn-ghost">← Домой</button>
      </div>

      <div className="panel p-4 bg-gradient-to-br from-amber-900/30 to-slate-900/80 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300/80">Сундуки и Удача</div>
            <div className="text-xl font-bold text-white">Сундуки Бездны</div>
            <div className="text-xs text-slate-400">Покупай, открывай, гарантированный лут после серии.</div>
          </div>
          <Icon name="achievement" size={48} color="#fbbf24" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("open")} className={`flex-1 py-2 rounded-lg ${tab === "open" ? "bg-amber-500 text-slate-900 font-bold" : "bg-slate-800 text-slate-300"}`}>Открыть</button>
        <button onClick={() => setTab("buy")} className={`flex-1 py-2 rounded-lg ${tab === "buy" ? "bg-amber-500 text-slate-900 font-bold" : "bg-slate-800 text-slate-300"}`}>Купить</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {kinds.map((k) => {
          const def = LOOTBOXES[k];
          const owned = materials[k] ?? 0;
          const pity = lbState.pityCounters[k] ?? 0;
          const pityPct = Math.min(100, (pity / def.pity.every) * 100);
          const canBuy = (def.costGold ?? 0) <= character.gold && (def.costShards ?? 0) <= character.shards && (def.costDust ?? 0) <= character.abyssDust;
          return (
            <motion.div
              key={k}
              whileHover={{ y: -2 }}
              className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-3 space-y-3"
              style={{ borderColor: def.iconColor + "80", boxShadow: `0 0 24px -8px ${def.iconColor}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChestSvg color={def.iconColor} />
                  <div>
                    <div className="font-bold text-white text-sm">{def.ru}</div>
                    <div className="text-[10px] text-slate-400">{def.rolls} дроп{def.rolls > 1 ? "ов" : ""} / откр.</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">У тебя</div>
                  <div className="text-lg font-bold text-amber-300">{owned}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">{def.description}</div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Pity ({def.pity.rarity})</span>
                  <span>{pity}/{def.pity.every}</span>
                </div>
                <div className="h-1.5 rounded bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-fuchsia-500 to-amber-300" style={{ width: `${pityPct}%` }} />
                </div>
              </div>

              {tab === "buy" ? (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-300 flex flex-wrap gap-2">
                    {def.costGold ? <span>💰 {def.costGold}g</span> : null}
                    {def.costShards ? <span>✦ {def.costShards}</span> : null}
                    {def.costDust ? <span>◈ {def.costDust} пыли</span> : null}
                    {def.costTon ? <span>TON {def.costTon}</span> : null}
                  </div>
                  <div className="flex gap-2">
                    {[1, 3, 10].map((q) => (
                      <button
                        key={q}
                        disabled={!canBuy}
                        onClick={() => {
                          const r = purchaseLootbox(k, q);
                          if (!r.ok) alert(r.error);
                        }}
                        className={`flex-1 py-1.5 rounded text-xs font-bold ${canBuy ? "bg-amber-500 text-slate-900 hover:bg-amber-400" : "bg-slate-700 text-slate-500"}`}
                      >×{q}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {[1, 3, 10].map((q) => (
                      <button
                        key={q}
                        disabled={owned < q}
                        onClick={() => {
                          const r = openLootbox(k, q as 1 | 3 | 10);
                          if (!r.ok) alert(r.error);
                        }}
                        className={`flex-1 py-1.5 rounded text-xs font-bold ${owned >= q ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400" : "bg-slate-700 text-slate-500"}`}
                      >Открыть ×{q}</button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChestSvg({ color }: { color: string }) {
  return (
    <svg width={48} height={48} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`chest-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="6" y="22" width="52" height="32" rx="3" fill={`url(#chest-${color})`} stroke="#1e293b" strokeWidth="2" />
      <path d="M6 32 Q32 12 58 32" fill={`url(#chest-${color})`} stroke="#1e293b" strokeWidth="2" />
      <rect x="28" y="30" width="8" height="14" rx="1" fill="#fde047" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="32" cy="36" r="2" fill="#1e293b" />
    </svg>
  );
}
