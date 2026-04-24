import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { ACHIEVEMENTS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Achievements() {
  const achievements = useGame((s) => s.achievements);
  const unlockedTitles = useGame((s) => s.unlockedTitles);
  const activeTitle = useGame((s) => s.activeTitle);
  const setActiveTitle = useGame((s) => s.setActiveTitle);

  const totalPoints = Object.entries(achievements)
    .filter(([, v]) => v.unlocked)
    .reduce((sum, [id]) => sum + (ACHIEVEMENTS[id]?.points ?? 0), 0);

  return (
    <ScreenLayout title="Достижения" subtitle={`${totalPoints} AP · ${unlockedTitles.length} титулов`} back="home" accent="#fcd34d">

      {unlockedTitles.length > 0 && (
        <div className="card p-3">
          <div className="panel-title text-xs mb-2">Титулы</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTitle(null)}
              className={`chip text-[10px] ${!activeTitle ? "bg-amber-500/30 border-amber-400" : "bg-white/5"}`}
            >— нет —</button>
            {unlockedTitles.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTitle(t)}
                className={`chip text-[10px] ${activeTitle === t ? "bg-amber-500/30 border-amber-400 text-amber-200" : "bg-white/5"}`}
              >«{t}»</button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {Object.values(ACHIEVEMENTS).map((a) => {
          const st = achievements[a.id] ?? { unlocked: false, progress: 0 };
          const pct = Math.min(1, st.progress / a.condition.amount);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`card p-3 ${st.unlocked ? "border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.25)]" : "opacity-80"}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{st.unlocked ? "🏆" : "🔒"}</div>
                <div className="flex-1">
                  <div className="font-display tracking-wider">{a.name}</div>
                  <div className="text-[10px] text-white/60">{a.description}</div>
                  <div className="mt-1 h-1.5 bg-white/10 rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300" style={{ width: `${pct * 100}%` }} />
                  </div>
                </div>
                <div className="text-right text-[10px] text-white/60">
                  {st.progress}/{a.condition.amount}
                  <div className="text-amber-300 font-bold">+{a.points} AP</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
