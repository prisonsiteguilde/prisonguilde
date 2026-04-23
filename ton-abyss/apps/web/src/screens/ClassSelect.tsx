import { motion } from "framer-motion";
import { useState } from "react";
import { CLASS_META } from "@ton-abyss/shared";
import type { ClassId } from "@ton-abyss/shared";
import { useGame } from "../store.js";
import { ClassPortrait } from "../components/ClassPortrait.js";
import { ICONS } from "../components/Icon.js";

export function ClassSelect() {
  const [pick, setPick] = useState<ClassId | null>(null);
  const createCharacter = useGame((s) => s.createCharacter);
  const setScreen = useGame((s) => s.setScreen);

  const classes: ClassId[] = ["warden", "runesmith", "voidcaller", "beastbound"];
  const current = pick ? CLASS_META[pick] : null;

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col pb-safe">
      <div className="flex items-center justify-between mb-5">
        <button className="btn-ghost btn-sm" onClick={() => setScreen("splash")}>← Назад</button>
        <h2 className="panel-title text-gradient-abyss">Выбор класса</h2>
        <span className="w-16" />
      </div>

      {/* Featured preview of selected class */}
      <motion.div
        layout
        className="hero-card mb-4 min-h-[230px] flex items-center gap-4"
        style={current ? { borderColor: `${current.palette}44` } : undefined}
      >
        {current ? (
          <>
            <ClassPortrait classId={pick!} size={140} />
            <div className="flex-1 min-w-0">
              <div
                className="font-display text-4xl tracking-wider leading-none"
                style={{ color: current.palette }}
              >
                {current.name}
              </div>
              <div className="text-xs text-white/70 mt-2">{current.tagline}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip">{current.weapon}</span>
                <span className="chip">{current.armor}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center w-full py-8">
            <div className="text-5xl mb-2">⚔️</div>
            <div className="font-display text-2xl tracking-widest text-white/80">Выберите класс</div>
            <div className="text-xs text-white/50 mt-2">Коснитесь карточки ниже</div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {classes.map((id) => {
          const m = CLASS_META[id];
          const selected = pick === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPick(id)}
              className={`card p-3 relative overflow-hidden text-left transition-all ${
                selected ? "ring-2 ring-offset-0" : "card-hover"
              }`}
              style={{
                ...(selected && { borderColor: m.palette, ["--tw-ring-color" as string]: m.palette } as React.CSSProperties),
              }}
            >
              <div
                className="absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
                style={{ background: m.palette }}
              />
              <div className="flex items-center gap-2 mb-1.5">
                <div className="grid place-items-center w-14">
                  <ClassPortrait classId={id} size={56} animated={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[17px] tracking-wider truncate" style={{ color: m.palette }}>
                    {m.name}
                  </div>
                  <div className="text-[10px] text-white/50 leading-tight line-clamp-2">{m.tagline}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="chip text-[9px] py-0">{m.weapon}</span>
                <span className="chip text-[9px] py-0">{m.armor}</span>
              </div>
              {selected && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ boxShadow: `inset 0 0 30px -4px ${m.palette}55` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="card-danger p-4 mb-4 flex gap-3">
        <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-red-500/20 text-red-300">
          <ICONS.skull size={22} />
        </div>
        <div>
          <div className="font-semibold text-red-300 font-display tracking-wider">Хардкорный режим всегда активен</div>
          <div className="text-xs text-white/60 mt-1 leading-relaxed">
            Смерть = −25% золота и XP. Усиление +15 с шансом уничтожения. 75% потолок резистов. Бездна не прощает.
          </div>
        </div>
      </div>

      <button
        className={pick ? "btn-abyssal h-14 text-lg tracking-widest" : "btn-primary h-14 text-lg tracking-widest"}
        disabled={!pick}
        onClick={() => pick && createCharacter(pick, true)}
      >
        ВОЙТИ В БЕЗДНУ
      </button>
    </div>
  );
}
