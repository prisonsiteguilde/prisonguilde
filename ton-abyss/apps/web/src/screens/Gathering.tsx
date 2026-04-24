import { useGame } from "../store.js";
import { ScreenLayout } from "../components/ScreenLayout.js";

const BIOMES = [
  { id: "forest", ru: "Лес", emoji: "🌲", color: "#22c55e", drops: "Лён · кожа · дуб" },
  { id: "mountain", ru: "Горы", emoji: "⛰️", color: "#94a3b8", drops: "Железо · серебро · митрил" },
  { id: "swamp", ru: "Болото", emoji: "🌿", color: "#84cc16", drops: "Жемчуг · мерцающая эссенция · осколок пустоты" },
  { id: "abyss", ru: "Бездна", emoji: "🌌", color: "#c084fc", drops: "Осколки Бездны · сияющая эссенция · душа босса" },
];

export function Gathering() {
  const gatherRun = useGame((s) => s.gatherRun);
  const pushToast = useGame((s) => s.pushToast);
  const dc = useGame((s) => s.dailyCounters);
  const remaining = Math.max(0, 20 - dc.gatheringRuns);

  return (
    <ScreenLayout title="Собирательство" subtitle={`Осталось на сегодня: ${remaining}/20`} back="home" accent="#22c55e">
      <div className="grid grid-cols-2 gap-2">
        {BIOMES.map((b) => (
          <button
            key={b.id}
            disabled={remaining <= 0}
            onClick={() => {
              const r = gatherRun(b.id);
              if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
            }}
            className="card-elevated p-4 text-left active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="text-[32px] mb-1">{b.emoji}</div>
            <div className="text-title" style={{ color: b.color }}>{b.ru}</div>
            <div className="text-micro text-white/50 mt-1 line-clamp-2">{b.drops}</div>
            <div className="text-micro text-amber-300/80 mt-2">−2 энергии</div>
          </button>
        ))}
      </div>
      <div className="card-ghost p-3 text-caption text-white/50">
        Каждый забег даёт 1-3 предмета из пула биома с шансом 70% на каждый.
      </div>
    </ScreenLayout>
  );
}
