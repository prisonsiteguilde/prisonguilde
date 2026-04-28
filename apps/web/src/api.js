let token = localStorage.getItem("corsairs_token") ?? "";
let nonce = Number(localStorage.getItem("corsairs_nonce") ?? 1);
export function setToken(next) {
    token = next;
    localStorage.setItem("corsairs_token", next);
}
export function nextNonce() {
    nonce += 1;
    localStorage.setItem("corsairs_nonce", String(nonce));
    return nonce;
}
export async function createSession() {
    const webApp = window.Telegram?.WebApp;
    const response = await request("/api/session", {
        method: "POST",
        body: JSON.stringify({ initData: webApp?.initData, demo: !webApp?.initData })
    }, false);
    setToken(response.token);
    return response;
}
export async function loadState() {
    return request("/api/state");
}
export async function startBattle(enemyId) {
    return request("/api/battles", {
        method: "POST",
        body: JSON.stringify({ enemyId, nonce: nextNonce() })
    });
}
export async function battleAction(battleId, moveId) {
    return request("/api/battles/action", {
        method: "POST",
        body: JSON.stringify({ battleId, moveId, nonce: nextNonce(), clientTick: performance.now() })
    });
}
export async function openChest(chestId) {
    return request("/api/chests/open", {
        method: "POST",
        body: JSON.stringify({ chestId, nonce: nextNonce() })
    });
}
export async function startCraft(recipeId) {
    return request("/api/craft/start", {
        method: "POST",
        body: JSON.stringify({ recipeId, nonce: nextNonce() })
    });
}
export async function claimCraft(jobId) {
    return request(`/api/craft/${jobId}/claim`, { method: "POST" });
}
export async function createMintIntent(itemUid, ownerAddress) {
    return request("/api/ton/mint-intent", {
        method: "POST",
        body: JSON.stringify({ itemUid, ownerAddress })
    });
}
async function request(path, init = {}, auth = true) {
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
    return response.json();
}
