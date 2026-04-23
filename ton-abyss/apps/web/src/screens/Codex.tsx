import { useGame } from "../store.js";
import { BOSSES, DUNGEONS, ITEMS, MONSTERS, PETS, RECIPES } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";

export function Codex() {
  const setScreen = useGame((s) => s.setScreen);
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <button className="btn-ghost" onClick={() => setScreen("home")}>← Домой</button>
        <h2 className="panel-title">Кодекс</h2>
        <span className="w-16" />
      </div>

      <Section title={`Данжи · ${Object.keys(DUNGEONS).length}`}>
        {Object.values(DUNGEONS).map((d) => (
          <li key={d.id}>
            <b>{d.name}</b> — ур. {d.levelMin}-{d.levelMax}, комнат: {d.rooms}, босс: <span className="text-abyss-300">{BOSSES[d.bossId]?.name}</span>
          </li>
        ))}
      </Section>

      <Section title={`Боссы · ${Object.keys(BOSSES).length}`}>
        {Object.values(BOSSES).map((b) => (
          <li key={b.id}>
            <b>{b.name}</b> <span className="text-white/50">ур. {b.level} · {b.element}</span> · фаз: {b.phases.length}
          </li>
        ))}
      </Section>

      <Section title={`Монстры · ${Object.keys(MONSTERS).length}`}>
        {Object.values(MONSTERS).map((m) => (
          <li key={m.id}>
            {m.name} — ур. {m.level} · {m.archetype}
          </li>
        ))}
      </Section>

      <Section title={`Питомцы · ${Object.keys(PETS).length}`}>
        {Object.values(PETS).map((p) => (
          <li key={p.id} style={{ color: RARITY_COLOR[p.rarity] }}>
            {p.name} · {p.rarity}
          </li>
        ))}
      </Section>

      <Section title={`Рецепты · ${Object.keys(RECIPES).length}`}>
        {Object.values(RECIPES).map((r) => (
          <li key={r.id}>
            {r.name}: {ITEMS[r.outputBaseId]?.name} (ур. {r.outputLevel})
          </li>
        ))}
      </Section>

      <Section title={`Предметы · ${Object.keys(ITEMS).length}`}>
        {Object.values(ITEMS).slice(0, 50).map((b) => (
          <li key={b.id}>{b.name} <span className="text-white/50">— {b.slot}, ур. {b.levelReq}</span></li>
        ))}
        {Object.keys(ITEMS).length > 50 && <li className="text-white/40">...и ещё {Object.keys(ITEMS).length - 50}</li>}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="font-display text-xl tracking-wider mb-2 text-white/90">{title}</div>
      <ul className="space-y-1 text-[12px] text-white/70">{children}</ul>
    </div>
  );
}
