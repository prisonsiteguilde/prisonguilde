import { motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../store.js";
import { ARENA_OPPONENTS, arenaRankFor } from "@ton-abyss/content";

export function Arena() {
  const setScreen = useGame((s) => s.setScreen);
  const arena = useGame((s) => s.arena);
  const fightArena = useGame((s) => s.fightArena);
  const [lastResult, setLastResult] = useState<{ won: boolean; eloDelta: number; opp: string } | null>(null);

  const rank = arenaRankFor(arena.elo);
  const sorted = [...ARENA_OPPONENTS].sort((a, b) => Math.abs(a.elo - arena.elo) - Math.abs(b.elo - arena.elo));

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Арена</h2>
        <span className="w-16" />
      </div>

      <div className="card p-4 border-rose-400/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl tracking-wider" style={{ color: rank.color }}>⚔️ {rank.name}</div>
            <div className="text-xs text-white/60 mt-1">Асинхронные бои против снимков других бойцов.</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50">ELO</div>
            <div className="text-3xl font-display" style={{ color: rank.color }}>{arena.elo}</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <KV k="Победы" v={arena.wins} />
          <KV k="Поражения" v={arena.losses} />
          <KV k="Стрик" v={`${arena.streak}🔥`} />
          <KV k="Боёв" v={arena.dailyFights} />
        </div>
      </div>

      {lastResult && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className={`card p-3 ${lastResult.won ? "border-emerald-400/40" : "border-red-400/40"}`}>
          <div className="text-sm">
            <b>{lastResult.won ? "Победа" : "Поражение"}</b> против <b>{lastResult.opp}</b>.{" "}
            <span className={lastResult.eloDelta > 0 ? "text-emerald-300" : "text-red-300"}>{lastResult.eloDelta > 0 ? "+" : ""}{lastResult.eloDelta} ELO</span>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="text-xs text-white/50 px-1">Доступные оппоненты</div>
        {sorted.map((opp) => (
          <div key={opp.id} className="card p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-display text-lg">{opp.name}</div>
                  {opp.titleLabel && <span className="chip text-[9px]">«{opp.titleLabel}»</span>}
                </div>
                <div className="text-[11px] text-white/50">
                  {opp.classId} · Ур. {opp.level} · ELO {opp.elo} · Власть {opp.power}
                </div>
                {opp.flavor && <div className="text-[11px] italic text-white/40 mt-1">{opp.flavor}</div>}
              </div>
              <button
                className="btn-primary text-xs"
                onClick={() => {
                  const r = fightArena(opp.id);
                  setLastResult({ ...r, opp: opp.name });
                }}
              >
                Бой
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string | number }) {
  return <div className="flex justify-between rounded bg-black/30 px-2 py-1"><span className="text-white/50">{k}</span><span className="text-white/90 font-medium">{v}</span></div>;
}
