import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { PETS } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";

export function Pets() {
  const setScreen = useGame((s) => s.setScreen);
  const pets = useGame((s) => s.pets);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Питомцы</h2>
        <span className="w-16" />
      </div>

      {pets.length === 0 && (
        <div className="card p-4 text-center text-white/60">
          У вас пока нет питомцев. Находите яйца в данжах — шанс крохотный, но падает гарантированно у некоторых боссов.
        </div>
      )}

      <div className="space-y-3">
        <div className="text-white/60 text-sm mt-2">Каталог всех питомцев:</div>
        {Object.values(PETS).map((p) => (
          <motion.div whileHover={{ y: -2 }} key={p.id} className="card p-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl" style={{ filter: `drop-shadow(0 0 10px ${RARITY_COLOR[p.rarity]})` }}>
                {iconFor(p.family)}
              </div>
              <div className="flex-1">
                <div className="font-display text-xl tracking-wider" style={{ color: RARITY_COLOR[p.rarity] }}>{p.name}</div>
                <div className="text-[11px] text-white/60 uppercase tracking-widest">{p.rarity} · семейство {p.family} · {p.element}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.passives.map((t, i) => <span key={i} className="chip bg-white/10">{t}</span>)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function iconFor(family: string): string {
  switch (family) {
    case "wyrm": return "🐉";
    case "golem": return "🗿";
    case "spirit": return "👻";
    case "beast": return "🐺";
    case "construct": return "⚙️";
    case "abyssal": return "🕷️";
    default: return "🐾";
  }
}
