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
    anticheat: Array<{
        id: string;
        severity: string;
        category: string;
        message: string;
        createdAt: string;
    }>;
}
export interface SessionResponse {
    token: string;
    expiresAt: string;
    player: Player;
}
export declare function setToken(next: string): void;
export declare function nextNonce(): number;
export declare function createSession(): Promise<SessionResponse>;
export declare function loadState(): Promise<GameState>;
export declare function startBattle(enemyId: string): Promise<BattleState>;
export declare function battleAction(battleId: string, moveId: string): Promise<{
    battle: BattleState;
    player: Player | null;
    rewards?: unknown;
}>;
export declare function openChest(chestId: string): Promise<{
    player: Player;
    rewards: unknown[];
    piastres: number;
}>;
export declare function startCraft(recipeId: string): Promise<{
    job: CraftJob;
    player: Player;
}>;
export declare function claimCraft(jobId: string): Promise<{
    job: CraftJob;
    player: Player;
    item: unknown;
}>;
export declare function createMintIntent(itemUid: string, ownerAddress: string): Promise<unknown>;
