import { useGame } from "../store.js";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { motion } from "framer-motion";

export function Fishing() {
  const fishingCast = useGame((s) => s.fishingCast);
  const pushToast = useGame((s) => s.pushToast);
  const dc = useGame((s) => s.dailyCounters);
  const energy = useGame((s) => s.energy);

  const remaining = Math.max(0, 20 - dc.fishingCasts);

  return (
    <ScreenLayout title="Рыбалка" subtitle={`Осталось на сегодня: ${remaining}/20`} back="home" accent="#38bdf8">
      <div className="card-elevated p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 via-teal-900/20 to-transparent" />
        <div className="relative">
          <div className="text-[72px] mb-2">🎣</div>
          <div className="text-title mb-1">Закинуть удочку</div>
          <div className="text-caption text-white/60 mb-4">−2 энергии · золото + материалы + шанс редких</div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={remaining <= 0}
            onClick={() => {
              const r = fishingCast();
              if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
            }}
            className="btn-primary px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🎣 Забросить
          </motion.button>
        </div>
      </div>
      <div className="card-flat p-3">
        <div className="text-micro text-white/60 mb-2">Возможная добыча</div>
        <div className="grid grid-cols-2 gap-2 text-caption">
          <div className="flex items-center gap-2"><span>🦪</span><span>Жемчуг (40%)</span></div>
          <div className="flex items-center gap-2"><span>🌿</span><span>Водоросли (25%)</span></div>
          <div className="flex items-center gap-2"><span>🪨</span><span>Железо (20%)</span></div>
          <div className="flex items-center gap-2"><span>🥓</span><span>Вяленое мясо (10%)</span></div>
          <div className="flex items-center gap-2 col-span-2 text-fuchsia-300"><span>💎</span><span>Осколок Бездны (5%)</span></div>
        </div>
      </div>
      <div className="card-ghost p-3 text-caption text-white/50">
        Энергия: {Math.floor(energy.current)}/{energy.max}. Восстанавливается 1/6мин.
      </div>
    </ScreenLayout>
  );
}
