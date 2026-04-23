import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { FORGE_STATIONS, ITEMS } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function ForgeStations() {
  const character = useGame((s) => s.character);
  const materials = useGame((s) => s.materials);
  const active = useGame((s) => s.activeForgeStation);
  const unlocked = useGame((s) => s.unlockedForgeStations);
  const setActive = useGame((s) => s.setActiveForgeStation);
  const unlock = useGame((s) => s.unlockForgeStation);
  const pushToast = useGame((s) => s.pushToast);

  if (!character) return null;

  const stationList = Object.values(FORGE_STATIONS);

  return (
    <ScreenLayout title="Кузни Бездны" subtitle={`Активна: ${FORGE_STATIONS[active]?.ru ?? "—"}`} accent="#f97316">
      <div className="card-elevated p-4">
        <div className="text-caption text-white/60 leading-relaxed">
          Каждая кузня даёт уникальные бонусы при крафте. Активную кузню можно сменить в любой момент.
          Бонусы применяются автоматически к рецептам в Кузнечной мастерской.
        </div>
      </div>

      <div className="space-y-3">
        {stationList.map((s) => {
          const isUnlocked = unlocked.includes(s.id);
          const isActive = active === s.id;
          const cost = s.unlockCost;
          const canAfford = !isUnlocked && (
            (!cost.gold || character.gold >= cost.gold) &&
            (!cost.shards || character.shards >= cost.shards) &&
            (!cost.materials || Object.entries(cost.materials).every(([m, q]) => (materials[m] ?? 0) >= q))
          );
          return (
            <motion.div
              key={s.id}
              whileTap={isUnlocked ? { scale: 0.98 } : undefined}
              onClick={() => isUnlocked && !isActive && setActive(s.id)}
              className={`card-elevated p-4 cursor-pointer transition-all ${isActive ? "ring-2 ring-amber-400/60" : isUnlocked ? "" : "opacity-70"}`}
              style={isActive ? { boxShadow: `0 0 0 2px ${s.iconColor}, 0 0 24px ${s.glow}66` } : undefined}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center text-2xl shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${s.glow}33 0%, transparent 70%)`,
                    border: `1px solid ${s.iconColor}55`,
                    color: s.iconColor,
                  }}
                >
                  {s.id === "neutral" ? "🔨" : s.element === "fire" ? "🔥" : s.element === "frost" ? "❄️" : s.element === "void" ? "🌑" : s.element === "shock" ? "⚡" : "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-title">{s.ru}</span>
                    {isActive && <span className="chip-success text-[9px]">активна</span>}
                    {!isUnlocked && <span className="text-micro text-white/40">закрыта</span>}
                  </div>
                  <div className="text-caption text-white/65 mt-1 leading-snug">{s.description}</div>
                  <div className="text-micro text-white/45 mt-2 italic">{s.loreFlavor}</div>
                  {!isUnlocked && (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="text-micro text-white/55">
                        {cost.gold && <span className="mr-2">{cost.gold}g</span>}
                        {cost.shards && <span className="mr-2">{cost.shards}🔹</span>}
                        {cost.materials && Object.entries(cost.materials).map(([m, q]) => (
                          <span key={m} className="mr-2">{q}× {ITEMS[m]?.name ?? m}</span>
                        ))}
                      </div>
                      <button
                        disabled={!canAfford}
                        onClick={(e) => {
                          e.stopPropagation();
                          const r = unlock(s.id);
                          if (!r.ok && r.error) pushToast({ text: r.error, tone: "bad" });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${canAfford ? "bg-amber-500/20 border border-amber-500/50 text-amber-200" : "bg-white/5 border border-white/10 text-white/30"}`}
                      >
                        Открыть
                      </button>
                    </div>
                  )}
                  {isUnlocked && !isActive && (
                    <div className="mt-3 text-micro text-amber-300/70">Тап чтобы активировать</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-caption text-white/40 text-center pt-2 leading-relaxed">
        Бонусы кузни применяются к шансу высоких редкостей и стоимости крафта.
        <br />
        Тигель Бездны имеет шанс 5% удвоить выход.
      </div>
    </ScreenLayout>
  );
}
