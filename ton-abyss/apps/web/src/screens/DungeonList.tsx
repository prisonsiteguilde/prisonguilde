import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { DUNGEONS } from "@ton-abyss/content";
import { DIFFICULTY_CURVE } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";

const BIOME_ART: Record<string, { emoji: string; tint: string; gradient: string }> = {
  crypt: { emoji: "⚰️", tint: "#60a5fa", gradient: "from-slate-800 via-slate-900 to-black" },
  ice: { emoji: "❄️", tint: "#22d3ee", gradient: "from-cyan-900 via-blue-950 to-black" },
  infernal: { emoji: "🔥", tint: "#f97316", gradient: "from-orange-900 via-red-950 to-black" },
  abyss: { emoji: "🕳️", tint: "#14f1c1", gradient: "from-emerald-900 via-purple-950 to-black" },
};

export function DungeonList() {
  const beginDungeon = useGame((s) => s.beginDungeon);
  const dungeons = Object.values(DUNGEONS);
  const char = useGame((s) => s.character)!;

  return (
    <ScreenLayout title="Данжи" subtitle={`${dungeons.length} мест для зачистки`} back="home" accent="#f43f5e">

      <div className="space-y-3">
        {dungeons.map((d) => {
          const art = BIOME_ART[d.biome] ?? BIOME_ART.crypt!;
          const diff = DIFFICULTY_CURVE.find((x) => x.tier === d.difficulty)!;
          const belowLevel = char.level < d.levelMin;
          const overleveled = char.level > d.levelMax + 5;
          return (
            <motion.div
              key={d.id}
              whileHover={{ y: -2 }}
              className={`card overflow-hidden relative`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient} opacity-70`} />
              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl drop-shadow" style={{ filter: `drop-shadow(0 0 12px ${art.tint})` }}>
                    {art.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-2xl tracking-wider" style={{ color: art.tint }}>
                      {d.name}
                    </div>
                    <div className="text-[11px] text-white/60">
                      Ур. {d.levelMin}-{d.levelMax} · комнат: {d.rooms} · сложность: <b>{diff.name}</b>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {d.modifiers?.map((m) => (
                        <span key={m.id} className="chip bg-amber-500/10 text-amber-200 border border-amber-400/30 text-[10px] normal-case tracking-normal">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div className="text-xs text-white/70">
                    {d.entryCost?.gold ? <>Вход: {d.entryCost.gold} 💰</> : "Вход свободный"}
                    {d.entryCost?.key && <span className="ml-2">+ ключ</span>}
                  </div>
                  <button
                    className="btn-primary"
                    disabled={belowLevel}
                    onClick={() => {
                      beginDungeon(d.id);
                    }}
                  >
                    {belowLevel ? "Слишком слаб" : overleveled ? "Повторить" : "Войти"}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenLayout>
  );
}
