import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { WORLD_MAP } from "@ton-abyss/content";

const ACT_COLOR: Record<number, string> = {
  1: "#60a5fa",
  2: "#f97316",
  3: "#14f1c1",
};

export function WorldMap() {
  const setScreen = useGame((s) => s.setScreen);
  const mapProgress = useGame((s) => s.mapProgress);
  const enterMapNode = useGame((s) => s.enterMapNode);

  const byAct = [1, 2, 3].map((act) => WORLD_MAP.filter((n) => n.act === act));

  return (
    <div className="px-4 py-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Мировая Карта</h2>
        <span className="w-16" />
      </div>

      {byAct.map((nodes, i) => {
        if (nodes.length === 0) return null;
        const act = i + 1;
        const color = ACT_COLOR[act]!;
        return (
          <div key={act}>
            <div className="panel-title mb-2" style={{ color }}>
              Акт {act} · {act === 1 ? "Забытые земли" : act === 2 ? "Врата Преисподней" : "Пути Бездны"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map((n) => {
                const unlocked = mapProgress.unlocked.includes(n.id);
                const cleared = mapProgress.cleared.includes(n.id);
                return (
                  <motion.button
                    key={n.id}
                    whileHover={{ scale: unlocked ? 1.02 : 1 }}
                    disabled={!unlocked}
                    onClick={() => enterMapNode(n.id)}
                    className={`card p-3 text-left text-[11px] relative overflow-hidden ${
                      !unlocked ? "opacity-40" : cleared ? "border-emerald-400/60" : ""
                    }`}
                    style={{ borderColor: unlocked && !cleared ? color : undefined }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">
                        {n.kind === "town" ? "🏯" : n.kind === "dungeon" ? "⚔️" : n.kind === "boss" ? "👹" : n.kind === "event" ? "✨" : "🏛️"}
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-sm tracking-wider">{n.name}</div>
                        <div className="text-[10px] text-white/60 capitalize">{n.biome ?? n.kind}</div>
                        {n.levelReq > 0 && <div className="text-[10px] text-white/50">Треб. ур. {n.levelReq}</div>}
                      </div>
                      {cleared && <div className="text-emerald-400 text-lg">✓</div>}
                      {!unlocked && <div className="text-white/30 text-lg">🔒</div>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
