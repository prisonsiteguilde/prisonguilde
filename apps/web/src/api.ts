import type { BattleState, ChestDefinition, CraftJob, CraftRecipe, EnemyDefinition, ItemDefinition, MarketListing, Player } from "@corsairs/shared";

export interface GameState {
  player: Player;
  catalog: {
    items: ItemDefinition[];
    enemies: EnemyDefinition[];
    recipes: CraftRecipe[];
    chests: ChestDefinition[];
  };
  activeBattles: BattleState[];
  craftJobs: CraftJob[];
  market: MarketListing[];
  anticheat: Array<{ id: string; severity: string; category: string; message: string; createdAt: string }>;
}

export interface SessionResponse {
  token: string;
  expiresAt: string;
  player: Player;
}

let token = localStorage.getItem("corsairs_token") ?? "";
let nonce = Number(localStorage.getItem("corsairs_nonce") ?? 1);

export function setToken(next: string): void {
  token = next;
  localStorage.setItem("corsairs_token", next);
}

export function nextNonce(): number {
  nonce += 1;
  localStorage.setItem("corsairs_nonce", String(nonce));
  return nonce;
}

export async function createSession(): Promise<SessionResponse> {
  const webApp = window.Telegram?.WebApp;
  const response = await request<SessionResponse>("/api/session", {
    method: "POST",
    body: JSON.stringify({ initData: webApp?.initData, demo: !webApp?.initData })
  }, false);
  setToken(response.token);
  return response;
}

export async function loadState(): Promise<GameState> {
  return request<GameState>("/api/state");
}

export async function startBattle(enemyId: string): Promise<BattleState> {
  return request<BattleState>("/api/battles", {
    method: "POST",
    body: JSON.stringify({ enemyId, nonce: nextNonce() })
  });
}

export async function battleAction(battleId: string, moveId: string): Promise<{ battle: BattleState; player: Player | null; rewards?: unknown }> {
  return request("/api/battles/action", {
    method: "POST",
    body: JSON.stringify({ battleId, moveId, nonce: nextNonce(), clientTick: performance.now() })
  });
}

export async function openChest(chestId: string): Promise<{ player: Player; rewards: unknown[]; piastres: number }> {
  return request("/api/chests/open", {
    method: "POST",
    body: JSON.stringify({ chestId, nonce: nextNonce() })
  });
}

export async function startCraft(recipeId: string): Promise<{ job: CraftJob; player: Player }> {
  return request("/api/craft/start", {
    method: "POST",
    body: JSON.stringify({ recipeId, nonce: nextNonce() })
  });
}

export async function claimCraft(jobId: string): Promise<{ job: CraftJob; player: Player; item: unknown }> {
  return request(`/api/craft/${jobId}/claim`, { method: "POST" });
}

export async function createMintIntent(itemUid: string, ownerAddress: string): Promise<unknown> {
  return request("/api/ton/mint-intent", {
    method: "POST",
    body: JSON.stringify({ itemUid, ownerAddress })
  });
}

async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  return response.json() as Promise<T>;
}
