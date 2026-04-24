import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ITEMS, GEMS } from "@ton-abyss/content";
import { rarityTint } from "../components/ItemTile.js";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Sockets() {
  const inventory = useGame((s) => s.inventory);
  const gems = useGame((s) => s.gems);
  const socketGem = useGame((s) => s.socketGem);
  const unsocketGem = useGame((s) => s.unsocketGem);
  const reforgeItem = useGame((s) => s.reforgeItem);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [selectedSocket, setSelectedSocket] = useState<number>(0);

  const sockettables = inventory.filter((i) => (i.sockets?.length ?? 0) > 0);
  const selected = sockettables.find((i) => i.uid === selectedUid) ?? sockettables[0];

  return (
    <ScreenLayout title="Гнёзда и Перековка" subtitle={`${sockettables.length} предметов · ${gems.length} гемов`} back="home" accent="#c084fc">

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1 max-h-72 overflow-y-auto">
          <div className="panel-title text-[11px]">Предметы с гнёздами</div>
          {sockettables.map((it) => {
            const base = ITEMS[it.baseId]!;
            const socks = it.sockets!;
            const filled = socks.filter(Boolean).length;
            return (
              <button
                key={it.uid}
                onClick={() => { setSelectedUid(it.uid); setSelectedSocket(0); }}
                className={`card p-2 text-left text-[11px] w-full ${selected?.uid === it.uid ? "border-amber-400/60" : ""}`}
              >
                <div className="font-bold" style={{ color: rarityTint(it.rarity) }}>
                  {base.name} +{it.upgradeLevel}
                </div>
                <div className="text-white/50 text-[10px]">Гнёзд: {filled}/{socks.length}</div>
              </button>
            );
          })}
          {sockettables.length === 0 && <div className="text-white/50 text-xs">Нет предметов с гнёздами.</div>}
        </div>

        <div className="space-y-2">
          {selected && (
            <motion.div key={selected.uid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3">
              <div className="font-bold" style={{ color: rarityTint(selected.rarity) }}>
                {ITEMS[selected.baseId]?.name} +{selected.upgradeLevel}
              </div>
              <div className="mt-2 flex gap-2">
                {selected.sockets!.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSocket(i)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg ${
                      selectedSocket === i ? "border-amber-400" : "border-white/20"
                    } ${s ? "bg-black/60" : "bg-black/30"}`}
                  >
                    {s ? "💎" : "○"}
                  </button>
                ))}
              </div>
              {selected.sockets![selectedSocket] && (
                <button
                  className="btn-ghost text-xs mt-2"
                  onClick={() => unsocketGem(selected.uid, selectedSocket)}
                >
                  Извлечь гем (200💰)
                </button>
              )}
              <button
                className="btn-primary text-xs mt-2 w-full"
                onClick={() => reforgeItem(selected.uid)}
              >
                🔨 Перековать аффиксы ({500 + selected.level * 40}💰 + {10 + selected.level} пыли)
              </button>
            </motion.div>
          )}
          <div className="card p-3">
            <div className="panel-title text-xs mb-2">Ваши гемы</div>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(gems).filter(([, c]) => c > 0).map(([gid, c]) => {
                const g = GEMS[gid];
                if (!g) return null;
                return (
                  <button
                    key={gid}
                    disabled={!selected}
                    onClick={() => selected && socketGem(selected.uid, selectedSocket, gid)}
                    className="card p-1 text-[10px] hover:bg-white/5"
                  >
                    <div className="text-lg">💎</div>
                    <div style={{ color: g.color === "red" ? "#f87171" : g.color === "blue" ? "#60a5fa" : g.color === "green" ? "#4ade80" : g.color === "yellow" ? "#fcd34d" : g.color === "purple" ? "#c084fc" : "#fff" }}>
                      {g.name.slice(0, 12)}
                    </div>
                    <div className="text-white/60">x{c}</div>
                  </button>
                );
              })}
              {Object.values(gems).every((v) => v === 0) && <div className="col-span-3 text-white/50 text-xs">Нет гемов. Собирайте в данжах.</div>}
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
