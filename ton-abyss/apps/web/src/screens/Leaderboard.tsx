import { motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "../store.js";
import { CLASS_CONFIG } from "@ton-abyss/shared";

export function Leaderboard() {
  const setScreen = useGame((s) => s.setScreen);
  const leaderboard = useGame((s) => s.leaderboard);
  const refresh = useGame((s) => s.refreshLeaderboard);
  const character = useGame((s) => s.character);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Лидерборд</h2>
        <button className="btn-ghost text-xs" onClick={refresh}>⟳</button>
      </div>

      <div className="space-y-1">
        {leaderboard.map((e, idx) => {
          const mine = e.playerId === character?.id;
          return (
            <motion.div
              key={e.playerId}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`card p-3 flex items-center gap-3 ${mine ? "border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.25)]" : ""}`}
            >
              <div className={`text-2xl font-display ${idx === 0 ? "text-amber-300" : idx === 1 ? "text-white" : idx === 2 ? "text-orange-400" : "text-white/50"}`}>
                #{idx + 1}
              </div>
              <div className="text-2xl">{CLASS_CONFIG[e.classId].emoji}</div>
              <div className="flex-1">
                <div className="font-display tracking-wider" style={{ color: CLASS_CONFIG[e.classId].color }}>
                  {e.playerName}
                  {mine && <span className="text-cyan-300 text-[10px] ml-2">(ВЫ)</span>}
                </div>
                <div className="text-[10px] text-white/60">
                  ур. {e.level} · kills {e.totalKills} · HC {e.hardcoreRank}
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-300 font-bold">{e.achievementPoints}</div>
                <div className="text-[10px] text-white/50">AP</div>
              </div>
            </motion.div>
          );
        })}
        {leaderboard.length === 0 && <div className="text-white/50 text-center py-8">Загрузка…</div>}
      </div>
    </div>
  );
}
