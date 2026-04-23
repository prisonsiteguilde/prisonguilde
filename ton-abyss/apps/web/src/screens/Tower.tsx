import { motion } from "framer-motion";
import { useGame } from "../store.js";
import { TOWER_CONFIG, TOWER_BOSS_FLOORS, TOWER_MODIFIERS, towerBiomeForFloor, towerScaling } from "@ton-abyss/content";

export function Tower() {
  const setScreen = useGame((s) => s.setScreen);
  const tower = useGame((s) => s.tower);
  const enterTower = useGame((s) => s.enterTower);
  const towerNext = useGame((s) => s.towerNext);
  const exitTower = useGame((s) => s.exitTower);
  const char = useGame((s) => s.character)!;

  const nextFloor = tower.currentFloor + 1;
  const biome = towerBiomeForFloor(Math.max(1, nextFloor));
  const scaling = towerScaling(Math.max(1, nextFloor));
  const bossAtNext = TOWER_BOSS_FLOORS[nextFloor];
  const activeModifiers = TOWER_MODIFIERS.filter((m) => m.minFloor <= Math.max(1, nextFloor));

  return (
    <div className="px-4 py-4 space-y-3 pb-24">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Башня Бездны</h2>
        <span className="w-16" />
      </div>

      <div className="card p-4 border-fuchsia-400/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl tracking-wider text-fuchsia-300">🗼 {TOWER_CONFIG.name}</div>
            <div className="text-xs text-white/60 mt-1">{TOWER_CONFIG.description}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/50">Рекорд</div>
            <div className="text-2xl font-display text-amber-300">{tower.highestFloor}</div>
          </div>
        </div>

        {tower.active ? (
          <>
            <div className="mt-4 rounded-lg bg-black/40 p-3 border border-fuchsia-400/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">Текущий этаж</div>
                <div className="text-2xl font-display text-fuchsia-200">{tower.currentFloor}</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <KV k="Биом" v={biome.biome} />
                <KV k="Следующий этаж" v={nextFloor} />
                <KV k="Множитель HP врага" v={`×${scaling.hpMult.toFixed(2)}`} />
                <KV k="Множитель урона" v={`×${scaling.dmgMult.toFixed(2)}`} />
              </div>
              {bossAtNext && <div className="mt-2 text-xs text-amber-300">⚠ Следующий этаж — БОСС.</div>}
            </div>

            <div className="mt-3 flex gap-2">
              <button className="btn-primary flex-1" onClick={() => towerNext()}>
                Вперёд: этаж {nextFloor}
              </button>
              <button className="btn-ghost" onClick={() => exitTower(true)}>Выйти и сохранить</button>
            </div>
          </>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="text-sm text-white/70">Вход: <b>{TOWER_CONFIG.entryCost.gold} золота</b>. У вас: <b>{char.gold}</b>.</div>
            <button className="btn-primary w-full" onClick={() => enterTower()}>Войти в Башню</button>
          </div>
        )}
      </div>

      <div className="card p-3">
        <div className="font-display text-lg mb-2">Активные модификаторы</div>
        <div className="space-y-1">
          {activeModifiers.length === 0 && <div className="text-xs text-white/40">Пока их нет. Появятся с ростом этажа.</div>}
          {activeModifiers.map((m) => (
            <div key={m.name} className="text-xs text-white/70">• <b className="text-amber-300">{m.name}</b> — {m.description}</div>
          ))}
        </div>
      </div>

      <div className="card p-3">
        <div className="font-display text-lg mb-2">Боссы башни</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(TOWER_BOSS_FLOORS).map(([f, b]) => (
            <div key={f} className="rounded bg-black/30 p-2 border border-white/10">
              <div className="text-amber-300">Этаж {f}</div>
              <div className="text-white/60">{b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between rounded bg-black/30 px-2 py-1">
      <span className="text-white/50">{k}</span>
      <span className="text-white/90 font-medium">{v}</span>
    </div>
  );
}
