import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { RELICS, BOSSES } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Relics() {
  const relicsUnlocked = useGame((s) => s.relicsUnlocked);
  const bossesKilled = useGame((s) => s.bossesKilled);
  const claimRelic = useGame((s) => s.claimRelic);

  return (
    <ScreenLayout title="Реликвии" subtitle="Перманентные бонусы за боссов" back="home" accent="#d6bcfa">
      <div className="card-elevated p-3 border-purple-400/40">
        <div className="text-title text-purple-200 mb-1">🏺 Перманентные бонусы</div>
        <div className="text-caption text-white/60">Каждая реликвия даёт вечный бафф. Получайте за первое убийство уникального босса.</div>
      </div>

      <div className="space-y-2">
        {Object.values(RELICS).map((r) => {
          const unlocked = relicsUnlocked.includes(r.id);
          const killed = (bossesKilled[r.sourceBossId] ?? 0) > 0;
          const boss = BOSSES[r.sourceBossId];
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`card p-3 ${unlocked ? "border-purple-400/50" : killed ? "border-amber-400/40" : "opacity-60"}`}
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">{r.icon ?? "🏺"}</div>
                <div className="flex-1">
                  <div className="font-display text-lg text-purple-200">{r.name}</div>
                  <div className="text-xs text-white/60">{r.description}</div>
                  {r.flavor && <div className="text-[11px] italic text-white/40 mt-1">{r.flavor}</div>}
                  <div className="text-[10px] text-white/40 mt-1">Источник: {boss?.name ?? r.sourceBossId}</div>
                </div>
                <div>
                  {unlocked
                    ? <span className="text-emerald-300 text-xs">✓ Активно</span>
                    : killed
                      ? <button className="btn-primary text-xs" onClick={() => claimRelic(r.sourceBossId)}>Забрать</button>
                      : <span className="text-red-300 text-xs">Заблок.</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
