import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { chests, damageTypeLabel, items, rarityLabel } from "@corsairs/shared";
import type { BattleState, ChestDefinition, CraftJob, CraftRecipe, EnemyDefinition, InventoryItem, ItemDefinition, Player } from "@corsairs/shared";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "./store";

type Tab = "captain" | "combat" | "craft" | "loot" | "ship" | "market" | "ton" | "security";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "captain", label: "Капитан" },
  { id: "combat", label: "Бой" },
  { id: "craft", label: "Крафт" },
  { id: "loot", label: "Сундуки" },
  { id: "ship", label: "Корабль" },
  { id: "market", label: "Рынок" },
  { id: "ton", label: "TON" },
  { id: "security", label: "Античит" }
];

export function App() {
  const { init, loading, error, state } = useGameStore();
  const [tab, setTab] = useState<Tab>("captain");

  useEffect(() => {
    void init();
  }, [init]);

  if (loading) return <Shell><div className="loading">Поднимаем паруса...</div></Shell>;
  if (error) return <Shell><div className="error">Ошибка: {error}</div></Shell>;
  if (!state) return <Shell><div className="error">Состояние не загружено</div></Shell>;

  return (
    <Shell>
      <Header player={state.player} />
      <nav className="tabs">
        {tabs.map((entry) => (
          <button className={tab === entry.id ? "active" : ""} key={entry.id} onClick={() => setTab(entry.id)}>
            {entry.label}
          </button>
        ))}
      </nav>
      {tab === "captain" && <CaptainView player={state.player} />}
      {tab === "combat" && <CombatView enemies={state.catalog.enemies} />}
      {tab === "craft" && <CraftView recipes={state.catalog.recipes} jobs={state.craftJobs} player={state.player} />}
      {tab === "loot" && <LootView chests={state.catalog.chests} />}
      {tab === "ship" && <ShipView player={state.player} />}
      {tab === "market" && <MarketView />}
      {tab === "ton" && <TonView player={state.player} />}
      {tab === "security" && <SecurityView />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="app">
      <div className="sea" />
      <section className="panel">{children}</section>
    </main>
  );
}

function Header({ player }: { player: Player }) {
  const xpNext = Math.floor(120 * player.level ** 1.72 + 80 * player.level);
  return (
    <header className="hero">
      <div>
        <p className="eyebrow">Telegram Mini App · TON Network</p>
        <h1>Corsairs: Return of the Legend</h1>
        <p>Капитан {player.displayName} · {player.islandId} · Престиж {player.prestige}</p>
      </div>
      <div className="wallet">
        <TonConnectButton />
      </div>
      <div className="resource-grid">
        <Stat label="LVL" value={player.level} />
        <Stat label="XP" value={`${player.xp}/${xpNext}`} />
        <Stat label="Пиастры" value={player.currencies.piastres.toLocaleString("ru-RU")} />
        <Stat label="Дублоны" value={player.currencies.doubloons} />
      </div>
    </header>
  );
}

function CaptainView({ player }: { player: Player }) {
  const gear = player.inventory.filter((item) => item.rarity !== "common").slice(0, 8);
  return (
    <section className="grid two">
      <Card title="Характеристики">
        <div className="stats-list">
          <Stat label="HP" value={`${player.stats.hp}/${player.stats.maxHp}`} />
          <Stat label="Выносливость" value={player.stats.stamina} />
          <Stat label="Энергия" value={player.stats.energy} />
          <Stat label="Броня" value={player.stats.armor} />
          <Stat label="Меткость" value={`${Math.round(player.stats.accuracy)}%`} />
          <Stat label="Уклонение" value={`${Math.round(player.stats.evasion)}%`} />
          <Stat label="Крит" value={`${Math.round(player.stats.critChance)}% ×${player.stats.critMultiplier.toFixed(1)}`} />
          <Stat label="Удача" value={`${Math.round(player.stats.luck)}%`} />
        </div>
      </Card>
      <Card title="Инвентарь высокой ценности">
        <div className="loot-list">
          {gear.map((item) => <InventoryRow item={item} key={item.uid} />)}
        </div>
      </Card>
      <Card title="Питомцы и лояльность">
        {player.pets.map((pet) => (
          <div className="pet" key={pet.id}>
            <strong>{pet.name}</strong>
            <span>{pet.evolution} · LVL {pet.level}</span>
            <meter value={pet.loyalty} min={0} max={100} />
          </div>
        ))}
      </Card>
      <Card title="Квесты">
        {Object.entries(player.quests).map(([id, quest]) => (
          <div className="quest" key={id}>
            <span>{id.replaceAll("_", " ")}</span>
            <b>{quest.status} · {quest.progress}/{quest.goal}</b>
          </div>
        ))}
      </Card>
    </section>
  );
}

function CombatView({ enemies }: { enemies: EnemyDefinition[] }) {
  const { activeBattle, startBattle, useMove } = useGameStore();
  return (
    <section className="grid two">
      <Card title="Выбор противника">
        <div className="enemy-list">
          {enemies.map((enemy) => (
            <button className="enemy-card" key={enemy.id} onClick={() => void startBattle(enemy.id)}>
              <strong>{enemy.name}</strong>
              <span>LVL {enemy.level} · {enemy.archetype}</span>
              <small>Награда: {enemy.rewards.xp} XP, {enemy.rewards.piastres[0]}–{enemy.rewards.piastres[1]} пиастров</small>
            </button>
          ))}
        </div>
      </Card>
      <BattlePanel battle={activeBattle} onMove={(moveId) => void useMove(moveId)} />
    </section>
  );
}

function BattlePanel({ battle, onMove }: { battle: BattleState | null; onMove(moveId: string): void }) {
  if (!battle) return <Card title="Бой"><p>Выбери противника. Все расчёты будут выполнены сервером.</p></Card>;
  const moves = ["thrust", "slash", "riposte", "pistol", "bomb", "skullbreaker", "harvest"];
  return (
    <Card title={`Бой: ${battle.enemy.name}`}>
      <div className="combat-bars">
        <HealthBar label={battle.player.name} hp={battle.player.stats.hp} max={battle.player.stats.maxHp} />
        <HealthBar label={battle.enemy.name} hp={battle.enemy.stats.hp} max={battle.enemy.stats.maxHp} />
      </div>
      <div className="move-grid">
        {moves.map((move) => (
          <button disabled={battle.phase !== "player"} key={move} onClick={() => onMove(move)}>{move}</button>
        ))}
      </div>
      <div className="battle-log">
        {battle.log.slice(-8).map((entry, index) => <p key={`${entry.turn}-${index}`}>{entry.message}</p>)}
      </div>
    </Card>
  );
}

function CraftView({ recipes, jobs, player }: { recipes: CraftRecipe[]; jobs: CraftJob[]; player: Player }) {
  const { startCraft, claimCraft } = useGameStore();
  return (
    <section className="grid two">
      <Card title="Профессии">
        <div className="stats-list">
          {Object.entries(player.professions).map(([profession, state]) => (
            <Stat key={profession} label={profession} value={`LVL ${state.level} · ${state.xp} XP`} />
          ))}
        </div>
      </Card>
      <Card title="Очередь">
        {jobs.length === 0 && <p>Очередь пуста.</p>}
        {jobs.map((job) => {
          const done = Date.now() >= new Date(job.completesAt).getTime();
          return (
            <div className="job" key={job.id}>
              <span>{job.recipeId}</span>
              <b>{job.claimed ? "получено" : done ? "готово" : new Date(job.completesAt).toLocaleTimeString("ru-RU")}</b>
              {!job.claimed && done && <button onClick={() => void claimCraft(job.id)}>Забрать</button>}
            </div>
          );
        })}
      </Card>
      <Card title="Рецепты">
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <button key={recipe.id} onClick={() => void startCraft(recipe.id)}>
              <strong>{recipe.name}</strong>
              <span>{recipe.profession} LVL {recipe.requiredLevel} · {recipe.durationSeconds}s</span>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}

function LootView({ chests: catalogChests }: { chests: ChestDefinition[] }) {
  const { openChest, state } = useGameStore();
  return (
    <section className="grid two">
      {catalogChests.map((chest) => (
        <Card key={chest.id} title={chest.name}>
          <p>Цена: {chest.price.piastres ? `${chest.price.piastres} пиастров` : ""} {chest.price.doubloons ? `${chest.price.doubloons} дублонов` : ""}{!chest.price.piastres && !chest.price.doubloons ? "бесплатно" : ""}</p>
          <p>Pity: Epic {chest.pity.epic ?? "—"} · Legendary {chest.pity.legendary ?? "—"} · Mythic {chest.pity.mythic ?? "—"}</p>
          <p>Текущий pity: {state?.player.pity[chest.id] ?? 0}</p>
          <button onClick={() => void openChest(chest.id)}>Открыть честно</button>
        </Card>
      ))}
    </section>
  );
}

function ShipView({ player }: { player: Player }) {
  return (
    <section className="grid two">
      <Card title={player.ship.name}>
        <div className="stats-list">
          <Stat label="Класс" value={player.ship.classId} />
          <Stat label="HP" value={player.ship.hp} />
          <Stat label="Трофеи" value={player.ship.trophies} />
          <Stat label="Офицеры" value={player.ship.officers.length} />
        </div>
      </Card>
      <Card title="AI-капитан PvP">
        {player.ship.aiPreset.map((rule) => (
          <div className="quest" key={rule.id}>
            <span>#{rule.priority} {rule.condition}</span>
            <b>{rule.action}</b>
          </div>
        ))}
      </Card>
    </section>
  );
}

function MarketView() {
  const state = useGameStore((store) => store.state);
  return (
    <section className="grid">
      <Card title="P2P рынок и аукцион">
        <p>Сервер удерживает предмет на escrow, берёт 5%/10% sink и автоматически резервирует NFT для Legendary/Mythic.</p>
        <div className="market-list">
          {state?.market.length === 0 && <p>Пока нет активных лотов.</p>}
          {state?.market.map((listing) => (
            <div className="listing" key={listing.id}>
              <InventoryRow item={listing.item} />
              <span>{listing.kind} · до {new Date(listing.expiresAt).toLocaleString("ru-RU")}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function TonView({ player }: { player: Player }) {
  const address = useTonAddress();
  const nftItems = player.inventory.filter((item) => item.nft);
  return (
    <section className="grid two">
      <Card title="TON Connect">
        <TonConnectButton />
        <p>{address ? `Кошелёк: ${address}` : "Подключи Tonkeeper или Telegram Wallet для mint/export NFT."}</p>
      </Card>
      <Card title="NFT-ready предметы">
        {nftItems.length === 0 && <p>Legendary/Mythic ещё не добыты.</p>}
        {nftItems.map((item) => <InventoryRow item={item} key={item.uid} />)}
      </Card>
    </section>
  );
}

function SecurityView() {
  const state = useGameStore((store) => store.state);
  return (
    <section className="grid two">
      <Card title="Server-authoritative защита">
        <ul>
          <li>Telegram initData проверяется HMAC на backend.</li>
          <li>Nonce защищает от replay-запросов.</li>
          <li>Бой, дроп, крафт и экономика считаются только сервером.</li>
          <li>Rate limit + behavioral timing сигналы пишутся в аудит.</li>
        </ul>
      </Card>
      <Card title="Последние сигналы">
        {state?.anticheat.length === 0 && <p>Нарушений нет.</p>}
        {state?.anticheat.map((signal) => (
          <div className={`signal ${signal.severity}`} key={signal.id}>
            <b>{signal.category}</b>
            <span>{signal.message}</span>
          </div>
        ))}
      </Card>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      {children}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HealthBar({ label, hp, max }: { label: string; hp: number; max: number }) {
  return (
    <div className="health">
      <div><span>{label}</span><b>{hp}/{max}</b></div>
      <meter min={0} max={max} value={hp} />
    </div>
  );
}

function InventoryRow({ item }: { item: InventoryItem }) {
  const definition = useMemo<ItemDefinition | undefined>(() => items.find((entry) => entry.id === item.itemId), [item.itemId]);
  if (!definition) return null;
  return (
    <div className={`inventory-row rarity-${item.rarity}`}>
      <strong>{definition.name}</strong>
      <span>{rarityLabel[item.rarity]} · ×{item.quantity}{item.superior ? " · Superior" : ""}{item.enhancement ? ` +${item.enhancement}` : ""}</span>
      {definition.damage && <small>{definition.damage.min}–{definition.damage.max} {damageTypeLabel[definition.damage.type]}</small>}
      {item.nft && <small>NFT: {item.nft.status}</small>}
    </div>
  );
}
