import { motion } from "framer-motion";
import { useState } from "react";
import { useGame } from "../store.js";
import { CLAN_PERKS, CLAN_RANKS, NPC_CLANS, CLAN_CONFIG } from "@ton-abyss/content";
import { ScreenLayout } from "../components/ScreenLayout.js";

export function Clan() {
  const clan = useGame((s) => s.clan);
  return (
    <ScreenLayout title="Клан" subtitle={clan ? `${clan.name} · ур. ${clan.level}` : "Без клана"} back="home" accent="#f0abfc">
      {clan ? <ClanDashboard /> : <NoClan />}
    </ScreenLayout>
  );
}

function NoClan() {
  const [mode, setMode] = useState<"browse" | "create">("browse");
  const createClan = useGame((s) => s.createClan);
  const joinClanNpc = useGame((s) => s.joinClanNpc);
  const gold = useGame((s) => s.character?.gold ?? 0);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [banner, setBanner] = useState("🏰");

  return (
    <div className="space-y-3">
      <div className="card p-3 space-y-1.5 border-white/10">
        <p className="text-xs text-white/70">
          Клан — долгосрочный союз игроков. Клан даёт пассивные бонусы, общую казну, совместные кланы-войны.
          Создание клана стоит <b className="text-amber-300">{CLAN_CONFIG.creationCost.gold}g</b>. Альтернативно — вступи в существующий NPC-клан.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("browse")}
          className={`flex-1 btn-ghost ${mode === "browse" ? "ring-2 ring-abyss-500" : ""}`}
        >
          Обзор кланов
        </button>
        <button
          onClick={() => setMode("create")}
          className={`flex-1 btn-ghost ${mode === "create" ? "ring-2 ring-abyss-500" : ""}`}
        >
          Создать свой
        </button>
      </div>

      {mode === "browse" && (
        <div className="space-y-2">
          {NPC_CLANS.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-3 flex items-center gap-3"
            >
              <div className="text-3xl">{c.banner}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg">{c.name}</span>
                  <span className="chip bg-white/10">[{c.tag}]</span>
                  <span className="chip text-[10px]">ур. {c.level}</span>
                </div>
                <div className="text-[11px] text-white/60 line-clamp-2">{c.flavor}</div>
                <div className="text-[10px] text-white/50 mt-1">
                  {c.memberCount} участников · Сила: {c.power}
                </div>
              </div>
              <button className="btn-primary text-xs" onClick={() => joinClanNpc(c.id)}>
                Войти
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {mode === "create" && (
        <div className="card p-3 space-y-2">
          <label className="block text-xs text-white/70">
            Имя клана (3–24)
            <input
              className="mt-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Чёрные Клинки"
              maxLength={24}
            />
          </label>
          <label className="block text-xs text-white/70">
            Тег (2–5)
            <input
              className="mt-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm font-mono uppercase"
              value={tag}
              onChange={(e) => setTag(e.target.value.toUpperCase())}
              placeholder="BLK"
              maxLength={5}
            />
          </label>
          <label className="block text-xs text-white/70">
            Знамя (эмодзи)
            <div className="flex gap-1 mt-1">
              {["🏰", "⚔️", "🛡️", "🔥", "💀", "🐺", "🦅", "🌙", "⚡", "🌑"].map((e) => (
                <button
                  key={e}
                  onClick={() => setBanner(e)}
                  className={`w-10 h-10 rounded border ${banner === e ? "border-abyss-400 bg-abyss-500/20" : "border-white/10 bg-white/5"} text-2xl`}
                >
                  {e}
                </button>
              ))}
            </div>
          </label>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-white/50">Стоимость: {CLAN_CONFIG.creationCost.gold}g (у вас {gold}g)</span>
            <button
              className="btn-primary"
              disabled={gold < CLAN_CONFIG.creationCost.gold || name.length < 3 || tag.length < 2}
              onClick={() => {
                const r = createClan(name, tag, banner);
                if (r.ok) {
                  setName("");
                  setTag("");
                }
              }}
            >
              Создать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClanDashboard() {
  const clan = useGame((s) => s.clan)!;
  const clanWars = useGame((s) => s.clanWars);
  const contributeGoldToClan = useGame((s) => s.contributeGoldToClan);
  const withdrawFromClanBank = useGame((s) => s.withdrawFromClanBank);
  const leaveClan = useGame((s) => s.leaveClan);
  const activateClanPerk = useGame((s) => s.activateClanPerk);
  const deactivateClanPerk = useGame((s) => s.deactivateClanPerk);
  const declareClanWar = useGame((s) => s.declareClanWar);
  const setClanMotd = useGame((s) => s.setClanMotd);
  const [tab, setTab] = useState<"overview" | "bank" | "perks" | "wars" | "members">("overview");
  const [contribAmount, setContribAmount] = useState(500);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [motd, setMotd] = useState(clan.motd);

  const nextXp = CLAN_CONFIG.xpCurve[clan.level] ?? Infinity;
  const prevXp = CLAN_CONFIG.xpCurve[clan.level - 1] ?? 0;
  const pct = Math.min(100, ((clan.xp - prevXp) / Math.max(1, nextXp - prevXp)) * 100);
  const rank = CLAN_RANKS[clan.myRank];

  return (
    <div className="space-y-3">
      {/* Hero card */}
      <div className="card p-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-30 bg-fuchsia-400" />
        <div className="flex items-center gap-3">
          <div className="text-5xl">{clan.banner}</div>
          <div className="flex-1">
            <div className="font-display text-2xl">{clan.name}</div>
            <div className="text-[11px] text-white/60">
              [{clan.tag}] · Ур. {clan.level}/{CLAN_CONFIG.maxLevel} · {clan.members.length} участников
            </div>
            <div className="text-[11px] text-fuchsia-300">Ваш ранг: {rank.name}</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-white/60">
            <span>Опыт клана</span>
            <span>{clan.xp} / {nextXp === Infinity ? "МАКС" : nextXp}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-fuchsia-400 to-pink-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="mt-2 text-xs italic text-white/70">«{clan.motd}»</div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-5 gap-1">
        {([
          ["overview", "Обзор"],
          ["bank", "Банк"],
          ["perks", "Перки"],
          ["wars", "Войны"],
          ["members", "Люди"],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-2 py-1.5 rounded text-xs ${tab === k ? "bg-abyss-600 text-white" : "bg-white/5 text-white/70"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-2">
          <div className="card p-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded bg-white/5 px-2 py-1.5"><span className="text-white/60">Казна:</span> <b>{clan.bankGold}g</b></div>
            <div className="rounded bg-white/5 px-2 py-1.5"><span className="text-white/60">Перков:</span> <b>{clan.perksActive.length}/4</b></div>
            <div className="rounded bg-white/5 px-2 py-1.5"><span className="text-white/60">Ваш вклад:</span> <b>{clan.myContribTotal}</b></div>
            <div className="rounded bg-white/5 px-2 py-1.5"><span className="text-white/60">Создан:</span> <b>{new Date(clan.createdAt).toLocaleDateString()}</b></div>
          </div>
          {rank.canPromote && (
            <div className="card p-3 space-y-2">
              <div className="text-xs text-white/70">MOTD (сообщение дня):</div>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs"
                maxLength={200}
                rows={2}
                value={motd}
                onChange={(e) => setMotd(e.target.value)}
              />
              <div className="flex justify-end">
                <button className="btn-ghost text-xs" onClick={() => setClanMotd(motd)}>Сохранить</button>
              </div>
            </div>
          )}
          <button
            className="btn-ghost w-full text-red-300 border-red-500/30"
            onClick={() => {
              if (confirm(`Покинуть клан «${clan.name}»?`)) leaveClan();
            }}
          >
            Покинуть клан
          </button>
        </div>
      )}

      {tab === "bank" && (
        <div className="space-y-2">
          <div className="card p-3 space-y-2">
            <div className="text-xs text-white/70">Внести в казну (× 100g = +1 вклад)</div>
            <div className="flex gap-2">
              <input
                type="number"
                min={100}
                step={100}
                className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm"
                value={contribAmount}
                onChange={(e) => setContribAmount(Math.max(0, Number(e.target.value)))}
              />
              <button className="btn-primary text-xs" onClick={() => contributeGoldToClan(contribAmount)}>Внести</button>
            </div>
            <div className="text-[10px] text-white/50">
              Дневной лимит: {CLAN_CONFIG.dailyContribMax.gold} вклад-ед. (= {CLAN_CONFIG.dailyContribMax.gold * 100}g/день)
            </div>
          </div>

          {rank.canWithdraw && (
            <div className="card p-3 space-y-2">
              <div className="text-xs text-white/70">Снять из банка (только офицер/лидер/ветеран)</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={100}
                  step={100}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-sm"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Math.max(0, Number(e.target.value)))}
                />
                <button className="btn-primary text-xs" onClick={() => withdrawFromClanBank(withdrawAmount)}>Снять</button>
              </div>
              <div className="text-[10px] text-white/50">В банке: {clan.bankGold}g</div>
            </div>
          )}
        </div>
      )}

      {tab === "perks" && (
        <div className="space-y-1.5">
          {CLAN_PERKS.map((p) => {
            const active = clan.perksActive.includes(p.id);
            const locked = clan.level < p.requiresClanLevel;
            return (
              <div key={p.id} className={`card p-2.5 flex items-center gap-2 ${locked ? "opacity-50" : ""}`}>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-white/60">{p.description}</div>
                  <div className="text-[10px] text-white/50 mt-0.5">Треб. ур. клана {p.requiresClanLevel}</div>
                </div>
                <button
                  disabled={locked || (!active && clan.perksActive.length >= 4)}
                  onClick={() => (active ? deactivateClanPerk(p.id) : activateClanPerk(p.id))}
                  className={`btn-ghost text-xs ${active ? "text-fuchsia-300 border-fuchsia-500/30" : ""}`}
                >
                  {active ? "Активен" : locked ? "🔒" : "Включить"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "wars" && (
        <div className="space-y-2">
          {rank.canStartWar ? (
            <>
              <div className="card p-2.5 text-xs text-white/70">
                Выбери противника. Победа даёт золото, опыт клана и шарды участникам. Хардкор: проигрыш = −0 казны, но −моральный урон.
              </div>
              {NPC_CLANS.filter((c) => c.id !== clan.id).map((c) => (
                <div key={c.id} className="card p-2.5 flex items-center gap-2">
                  <span className="text-2xl">{c.banner}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.name} [{c.tag}]</div>
                    <div className="text-[10px] text-white/60">Ур. {c.level} · Сила {c.power}</div>
                  </div>
                  <button className="btn-primary text-xs" onClick={() => declareClanWar(c.id)}>В бой</button>
                </div>
              ))}
            </>
          ) : (
            <div className="card p-3 text-xs text-white/60">
              Только офицер или лидер может начинать клан-войны.
            </div>
          )}
          {clanWars.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-white/60 mb-1">История войн</div>
              {clanWars.map((w) => (
                <div key={w.id} className={`card p-2 mb-1 flex justify-between text-[11px] ${w.won ? "border-emerald-500/30" : "border-red-500/30"}`}>
                  <span>{w.won ? "🏆" : "💀"} vs {w.opponentName}</span>
                  <span className="text-white/60">+{w.rewardGold}g · +{w.rewardXp} XP</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "members" && (
        <div className="space-y-1.5">
          {clan.members.slice().sort((a, b) => b.contribTotal - a.contribTotal).map((m) => (
            <div key={m.id} className="card p-2 flex items-center gap-2">
              <span className="text-xl">
                {m.classId === "warden" ? "🛡️" : m.classId === "runesmith" ? "🔨" : m.classId === "voidcaller" ? "🌀" : "🐺"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{m.name}</div>
                <div className="text-[10px] text-white/50">ур. {m.level} · {CLAN_RANKS[m.rank].name} · вклад {m.contribTotal}</div>
              </div>
              <div className="text-[10px] text-white/40">
                {m.id === clan.members[0]?.id ? "вы" : new Date(m.lastOnline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
