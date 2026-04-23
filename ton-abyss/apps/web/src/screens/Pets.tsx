import { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { PETS } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";
import { EmptyState } from "../components/EmptyState.js";

export function Pets() {
  const pets = useGame((s) => s.pets);
  const petStates = useGame((s) => s.petStates);
  const materials = useGame((s) => s.materials);
  const activePetUid = useGame((s) => s.activePetUid);
  const feedPet = useGame((s) => s.feedPet);
  const evolvePet = useGame((s) => s.evolvePet);
  const fusePets = useGame((s) => s.fusePets);
  const hatchEgg = useGame((s) => s.hatchEgg);
  const inventory = useGame((s) => s.inventory);
  const set = useGame.setState;
  const [fuseMode, setFuseMode] = useState<string | null>(null);
  const [tab, setTab] = useState<"barn" | "mine" | "catalog">("barn");

  const eggs = inventory.filter((i) => i.baseId.startsWith("pet_egg"));
  const activePet = activePetUid ? pets.find((p) => p.uid === activePetUid) : null;
  const activeDef = activePet ? PETS[activePet.defId] : null;
  const activeState = activePet ? petStates[activePet.uid] : null;

  return (
    <ScreenLayout
      title="Питомцы"
      subtitle={`${pets.length} живых · ${eggs.length} яиц · активный: ${activeDef?.name ?? "нет"}`}
      accent="#fb7185"
    >
      {/* Tabs */}
      <div className="seg">
        <button className={`seg-item ${tab === "barn" ? "active" : ""}`} onClick={() => setTab("barn")}>🏡 Ферма</button>
        <button className={`seg-item ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")}>Мои ({pets.length})</button>
        <button className={`seg-item ${tab === "catalog" ? "active" : ""}`} onClick={() => setTab("catalog")}>Каталог</button>
      </div>

      {/* BARN tab — visual scene */}
      {tab === "barn" && (
        <>
          {/* Scenic card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 p-5 min-h-[220px]"
            style={{
              background:
                "radial-gradient(400px 200px at 20% 0%, rgba(251,113,133,0.15), transparent 70%), " +
                "radial-gradient(500px 220px at 80% 100%, rgba(20,241,193,0.12), transparent 70%), " +
                "linear-gradient(180deg, #1a0812 0%, #04050e 100%)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {/* stars */}
              {[15, 35, 55, 75, 88].map((x, i) => (
                <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ left: `${x}%`, top: `${(i * 13) % 70 + 10}%`, animation: `twinkle 3s ease-in-out ${i * 0.5}s infinite` }} />
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-micro text-pink-200/70">🏡 Лагерь питомцев</div>
              <div className="text-display text-white/95 mt-0.5">{pets.length > 0 ? "Твой зверинец" : "Здесь будет жить твой первый питомец"}</div>
              {activePet && activeDef && activeState && (
                <div className="mt-3 text-caption">
                  Активный: <span className="text-pink-200 font-bold">{activePet.nickname ?? activeDef.name}</span> · Lv {activePet.level} · связь {activePet.bondLevel}/10 · 😊 {activeState.happiness}
                </div>
              )}

              {/* Pet silhouettes */}
              <div className="mt-5 flex gap-3 flex-wrap items-end">
                {pets.length === 0 && (
                  <div className="text-caption text-white/50 italic">Пусто — найдите яйцо в данжах или у боссов.</div>
                )}
                {pets.slice(0, 8).map((p, idx) => {
                  const def = PETS[p.defId];
                  const isActive = activePetUid === p.uid;
                  return (
                    <motion.button
                      key={p.uid}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => set({ activePetUid: isActive ? null : p.uid })}
                      className="relative group"
                      style={{ animation: `tile-in 0.6s ease-out ${idx * 60}ms both` }}
                    >
                      <div
                        className={`text-4xl transition-all ${isActive ? "scale-110" : ""}`}
                        style={{ filter: `drop-shadow(0 0 ${isActive ? 18 : 10}px ${def ? RARITY_COLOR[def.rarity] : "#fff"}aa)` }}
                      >
                        {iconFor(def?.family ?? "beast")}
                      </div>
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full opacity-80" />
                      )}
                      <div className="text-[9px] text-white/50 text-center mt-0.5 truncate w-12">{p.nickname ?? def?.name.slice(0, 8)}</div>
                    </motion.button>
                  );
                })}
                {pets.length > 8 && (
                  <div className="text-caption text-white/55 self-center">+{pets.length - 8} ещё</div>
                )}
              </div>
            </div>
          </div>

          {/* Egg tray */}
          {eggs.length > 0 && (
            <div className="card-elevated p-3 border-amber-400/40">
              <div className="text-title text-amber-200 mb-2">🥚 Яйца в инкубаторе</div>
              <div className="space-y-2">
                {eggs.map((e) => (
                  <div key={e.uid} className="flex items-center justify-between">
                    <div className="text-body truncate">{e.baseId.replace("pet_egg_", "")}</div>
                    <button className="btn-primary btn-sm" onClick={() => hatchEgg(e.baseId)}>Вылупить</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="card-flat p-3 text-center">
              <div className="text-micro">Всего</div>
              <div className="text-title text-white/95">{pets.length}</div>
            </div>
            <div className="card-flat p-3 text-center">
              <div className="text-micro">Apex</div>
              <div className="text-title text-amber-300">{pets.filter((p) => (petStates[p.uid]?.stage ?? 1) >= 3).length}</div>
            </div>
            <div className="card-flat p-3 text-center">
              <div className="text-micro">Макс. связь</div>
              <div className="text-title text-pink-300">{pets.length > 0 ? Math.max(...pets.map((p) => p.bondLevel)) : 0}/10</div>
            </div>
          </div>
        </>
      )}

      {tab === "mine" && (
        <>
          {pets.length === 0 && (
            <EmptyState icon="pet" title="Питомцев нет" hint="Найдите яйцо в данжах или у боссов." />
          )}

          <div className="space-y-2">
            {pets.map((p) => {
              const def = PETS[p.defId];
              const state = petStates[p.uid] ?? { happiness: 50, lastFedAt: 0, stage: 1, skillPoints: 0 };
              const stageLabels = ["", "Детёныш", "Взрослый", "Apex"];
              const isActive = activePetUid === p.uid;
              const feedMaterials = def ? Object.keys(def.feedTable) : [];
              return (
                <motion.div
                  key={p.uid}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card-elevated p-3 ${isActive ? "border-amber-400/50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl shrink-0" style={{ filter: `drop-shadow(0 0 10px ${def ? RARITY_COLOR[def.rarity] : "#fff"})` }}>
                      {iconFor(def?.family ?? "beast")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-title truncate" style={{ color: def ? RARITY_COLOR[def.rarity] : "#fff" }}>
                        {p.nickname ?? def?.name} <span className="text-caption">Lv {p.level}</span>
                      </div>
                      <div className="text-micro">{stageLabels[state.stage]} · связь {p.bondLevel}/10 · {def?.element}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-caption">
                        <span>😊</span>
                        <div className="flex-1 h-1.5 rounded bg-black/40 overflow-hidden">
                          <div className="h-full bg-pink-400" style={{ width: `${state.happiness}%` }} />
                        </div>
                        <span className="text-white/50 tabular-nums w-7 text-right">{state.happiness}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button className={`text-caption px-2 py-0.5 rounded ${isActive ? "bg-amber-500/40 text-amber-200" : "bg-black/30 text-white/60"}`} onClick={() => set({ activePetUid: isActive ? null : p.uid })}>
                        {isActive ? "Активен" : "Взять"}
                      </button>
                      <button className="text-caption px-2 py-0.5 rounded bg-fuchsia-500/30 text-fuchsia-200" onClick={() => { const r = evolvePet(p.uid); if (!r.ok && r.error) useGame.getState().pushToast({ text: r.error, tone: "bad" }); }}>
                        Эвол.
                      </button>
                    </div>
                  </div>

                  {feedMaterials.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {feedMaterials.slice(0, 4).map((m) => (
                        <button
                          key={m}
                          disabled={(materials[m] ?? 0) < 1}
                          className="text-caption px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 disabled:opacity-40"
                          onClick={() => feedPet(p.uid, m)}
                        >
                          🍖 {m} ({materials[m] ?? 0})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Fuse */}
                  {fuseMode === p.uid ? (
                    <div className="mt-2 text-caption">Выберите вторую цель того же вида для слияния.</div>
                  ) : null}
                  {fuseMode && fuseMode !== p.uid && (() => {
                    const other = pets.find((x) => x.uid === fuseMode);
                    if (other && other.defId === p.defId) {
                      return (
                        <button
                          className="mt-2 w-full text-caption px-2 py-1 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40"
                          onClick={() => { fusePets(fuseMode!, p.uid); setFuseMode(null); }}
                        >
                          Слить с {other.nickname ?? PETS[other.defId]?.name} → Apex
                        </button>
                      );
                    }
                    return null;
                  })()}
                  <button
                    className="mt-2 w-full text-caption px-2 py-0.5 rounded bg-black/30 text-white/50"
                    onClick={() => setFuseMode(fuseMode === p.uid ? null : p.uid)}
                  >
                    {fuseMode === p.uid ? "Отмена слияния" : "Слить..."}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tab === "catalog" && (
        <div className="space-y-2">
          <div className="text-caption px-1">Все возможные виды питомцев</div>
          {Object.values(PETS).map((p) => (
            <motion.div whileHover={{ y: -2 }} key={p.id} className="card-elevated p-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl shrink-0" style={{ filter: `drop-shadow(0 0 10px ${RARITY_COLOR[p.rarity]})` }}>{iconFor(p.family)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-title truncate" style={{ color: RARITY_COLOR[p.rarity] }}>{p.name}</div>
                  <div className="text-micro">{p.rarity} · {p.family} · {p.element}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.passives.map((t, i) => <span key={i} className="chip text-[9px]">{t}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </ScreenLayout>
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
