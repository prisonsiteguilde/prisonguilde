import { useState, useMemo } from "react";
import { BOSSES, DUNGEONS, ITEMS, MONSTERS, PETS, RECIPES } from "@ton-abyss/content";
import { RARITY_COLOR } from "@ton-abyss/shared";
import { ScreenLayout } from "../components/ScreenLayout.js";

type Category = "all" | "dungeons" | "bosses" | "monsters" | "pets" | "recipes" | "items";

export function Codex() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category>("all");

  const q = query.trim().toLowerCase();
  const matches = (s: string | undefined | null) => !q || (s ?? "").toLowerCase().includes(q);

  const dungeons = useMemo(() => Object.values(DUNGEONS).filter((d) => matches(d.name) || matches(d.id)), [q]);
  const bosses = useMemo(() => Object.values(BOSSES).filter((b) => matches(b.name) || matches(b.element)), [q]);
  const monsters = useMemo(() => Object.values(MONSTERS).filter((m) => matches(m.name) || matches(m.archetype)), [q]);
  const pets = useMemo(() => Object.values(PETS).filter((p) => matches(p.name) || matches(p.rarity)), [q]);
  const recipes = useMemo(() => Object.values(RECIPES).filter((r) => matches(r.name)), [q]);
  const items = useMemo(() => Object.values(ITEMS).filter((i) => matches(i.name) || matches(i.slot)), [q]);

  const total = dungeons.length + bosses.length + monsters.length + pets.length + recipes.length + items.length;

  return (
    <ScreenLayout title="Кодекс" subtitle={q ? `Найдено: ${total}` : "Гид по миру"} back="home" accent="#a78bfa">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Поиск по миру…"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body focus:outline-none focus:border-abyss-500"
      />
      <div className="seg overflow-x-auto">
        {(["all", "dungeons", "bosses", "monsters", "pets", "recipes", "items"] as Category[]).map((c) => (
          <button
            key={c}
            className={`seg-item ${cat === c ? "seg-active" : ""}`}
            onClick={() => setCat(c)}
          >
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      {(cat === "all" || cat === "dungeons") && dungeons.length > 0 && (
        <Section title={`Данжи · ${dungeons.length}`}>
          {dungeons.map((d) => (
            <li key={d.id} className="text-body">
              <b>{d.name}</b> <span className="text-white/50">— ур. {d.levelMin}-{d.levelMax}, комнат: {d.rooms}, босс:</span>{" "}
              <span className="text-abyss-300">{BOSSES[d.bossId]?.name}</span>
            </li>
          ))}
        </Section>
      )}
      {(cat === "all" || cat === "bosses") && bosses.length > 0 && (
        <Section title={`Боссы · ${bosses.length}`}>
          {bosses.map((b) => (
            <li key={b.id} className="text-body">
              <b>{b.name}</b> <span className="text-white/50">ур. {b.level} · {b.element}</span> · фаз: {b.phases.length}
            </li>
          ))}
        </Section>
      )}
      {(cat === "all" || cat === "monsters") && monsters.length > 0 && (
        <Section title={`Монстры · ${monsters.length}`}>
          {monsters.map((m) => (
            <li key={m.id} className="text-body">{m.name} <span className="text-white/50">— ур. {m.level} · {m.archetype}</span></li>
          ))}
        </Section>
      )}
      {(cat === "all" || cat === "pets") && pets.length > 0 && (
        <Section title={`Питомцы · ${pets.length}`}>
          {pets.map((p) => (
            <li key={p.id} className="text-body" style={{ color: RARITY_COLOR[p.rarity] }}>
              {p.name} <span className="opacity-60">· {p.rarity}</span>
            </li>
          ))}
        </Section>
      )}
      {(cat === "all" || cat === "recipes") && recipes.length > 0 && (
        <Section title={`Рецепты · ${recipes.length}`}>
          {recipes.map((r) => (
            <li key={r.id} className="text-body">
              {r.name}: <span className="text-abyss-300">{ITEMS[r.outputBaseId]?.name}</span> (ур. {r.outputLevel})
            </li>
          ))}
        </Section>
      )}
      {(cat === "all" || cat === "items") && items.length > 0 && (
        <Section title={`Предметы · ${items.length}`}>
          {items.slice(0, cat === "items" ? items.length : 80).map((b) => (
            <li key={b.id} className="text-body">{b.name} <span className="text-white/50">— {b.slot}, ур. {b.levelReq}</span></li>
          ))}
          {cat !== "items" && items.length > 80 && (
            <li className="text-caption text-white/40">…ещё {items.length - 80}. Переключись на «Предметы».</li>
          )}
        </Section>
      )}

      {total === 0 && (
        <div className="card-ghost p-6 text-center text-caption text-white/50">Ничего не найдено.</div>
      )}
    </ScreenLayout>
  );
}

const CAT_LABEL: Record<Category, string> = {
  all: "Всё",
  dungeons: "Данжи",
  bosses: "Боссы",
  monsters: "Монстры",
  pets: "Питомцы",
  recipes: "Рецепты",
  items: "Предметы",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-flat p-4">
      <div className="text-title mb-2">{title}</div>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
