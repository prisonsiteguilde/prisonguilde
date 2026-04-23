import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { HUNTS, FACTIONS } from "@ton-abyss/content";

export function Hunts() {
  const setScreen = useGame((s) => s.setScreen);
  const hunts = useGame((s) => s.hunts);
  const startHunt = useGame((s) => s.startHunt);
  const claimHunt = useGame((s) => s.claimHunt);
  const progressHunt = useGame((s) => s.progressHunt);
  const char = useGame((s) => s.character)!;

  useEffect(() => {
    const id = setInterval(() => progressHunt(), 5000);
    return () => clearInterval(id);
  }, [progressHunt]);

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Охотничья доска</h2>
        <span className="w-16" />
      </div>

      <div className="space-y-2">
        {HUNTS.map((h) => {
          const active = hunts.active.find((a) => a.huntId === h.id);
          const completed = hunts.completed.includes(h.id);
          const faction = h.rewards.reputation ? FACTIONS[h.rewards.reputation.factionId] : null;
          return (
            <motion.div key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-display text-lg tracking-wider">{h.name}</div>
                  <div className="text-xs text-white/60">{h.description}</div>
                  {h.flavor && <div className="text-[11px] italic text-white/40 mt-1">{h.flavor}</div>}
                  <div className="text-[11px] text-white/50 mt-1">
                    Биом: {h.biome} · Ур. {h.levelReq}+ · Длительность: {h.trackDurationMinutes}мин
                  </div>
                  <div className="text-[11px] text-white/40">
                    Награда: {h.rewards.gold}g, {h.rewards.xp}xp
                    {faction && `, +${h.rewards.reputation!.amount} реп. ${faction.shortName}`}
                    {h.rewards.itemBaseId && `, предмет`}
                  </div>
                  {active && (
                    <div className="mt-2">
                      <div className="h-2 rounded bg-black/40 overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${active.progress * 100}%` }} />
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5">Прогресс: {Math.floor(active.progress * 100)}%</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {completed ? <span className="text-xs text-emerald-300">✓ Выполнено</span>
                    : active
                      ? (active.progress >= 1
                        ? <button className="btn-primary text-xs" onClick={() => claimHunt(h.id)}>Забрать</button>
                        : <span className="text-xs text-amber-300">В процессе</span>)
                      : (char.level < h.levelReq
                        ? <span className="text-xs text-red-300">Ур. {h.levelReq}</span>
                        : <button className="btn-primary text-xs" onClick={() => startHunt(h.id)}>Начать</button>)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
