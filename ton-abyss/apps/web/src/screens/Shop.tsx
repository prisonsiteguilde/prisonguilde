import { useMemo, useState } from "react";
import { useGame } from "../store.js";
import { ITEMS } from "@ton-abyss/content";
import { ECONOMY, RARITY_COLOR } from "@ton-abyss/shared";

export function Shop() {
  const inv = useGame((s) => s.inventory);
  const equipped = useGame((s) => s.equipped);
  const sell = useGame((s) => s.sell);
  const setScreen = useGame((s) => s.setScreen);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const equippedSet = useMemo(() => new Set(Object.values(equipped).filter(Boolean) as string[]), [equipped]);
  const items = inv.filter((i) => !equippedSet.has(i.uid));
  const totalGold = useMemo(() => {
    let g = 0;
    for (const uid of picked) {
      const it = items.find((i) => i.uid === uid);
      if (!it) continue;
      const b = ITEMS[it.baseId];
      if (!b) continue;
      g += Math.round(b.sellValue * ECONOMY.SHOP_SELL_MULT * (1 + it.upgradeLevel * 0.25));
    }
    return g;
  }, [picked, items]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Лавка</h2>
        <span className="w-16" />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {items.map((i) => {
          const b = ITEMS[i.baseId]!;
          const pickedOn = picked.has(i.uid);
          const price = Math.round(b.sellValue * ECONOMY.SHOP_SELL_MULT * (1 + i.upgradeLevel * 0.25));
          return (
            <button
              key={i.uid}
              onClick={() => {
                const n = new Set(picked);
                pickedOn ? n.delete(i.uid) : n.add(i.uid);
                setPicked(n);
              }}
              data-rarity={i.rarity}
              className={`rarity-glow rarity-border rounded-lg border bg-white/5 p-2 aspect-square text-left ${pickedOn ? "ring-2 ring-emerald-400" : ""}`}
            >
              <div className="text-[10px]" style={{ color: RARITY_COLOR[i.rarity] }}>{b.name}</div>
              <div className="mt-1 text-[10px] font-mono text-amber-300">{price} 💰</div>
              {i.upgradeLevel > 0 && <div className="text-[10px] text-amber-300">+{i.upgradeLevel}</div>}
            </button>
          );
        })}
      </div>

      <div className="card p-4 flex items-center justify-between">
        <div>
          <div className="text-sm">Выбрано: {picked.size} шт.</div>
          <div className="text-[11px] text-white/60">Сумма: <span className="text-amber-300 font-mono">{totalGold} 💰</span></div>
        </div>
        <button className="btn-primary" disabled={picked.size === 0} onClick={() => { sell([...picked]); setPicked(new Set()); }}>
          Продать
        </button>
      </div>
    </div>
  );
}
