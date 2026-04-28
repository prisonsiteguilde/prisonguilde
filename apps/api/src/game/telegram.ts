import { createHmac, timingSafeEqual } from "node:crypto";

export interface TelegramIdentity {
  telegramId: string;
  username: string;
  displayName: string;
  authDate?: number;
}

export function parseTelegramInitData(initData: string | undefined, botToken: string | undefined): TelegramIdentity | null {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  const userRaw = params.get("user");
  if (!hash || !userRaw) return null;
  if (botToken && botToken !== "replace-with-production-token" && !verifyTelegramHash(params, botToken, hash)) {
    return null;
  }
  const parsed = JSON.parse(userRaw) as { id: number; username?: string; first_name?: string; last_name?: string };
  return {
    telegramId: String(parsed.id),
    username: parsed.username ?? `captain_${parsed.id}`,
    displayName: [parsed.first_name, parsed.last_name].filter(Boolean).join(" ") || parsed.username || `Captain ${parsed.id}`,
    authDate: Number(params.get("auth_date") ?? 0)
  };
}

export function demoIdentity(): TelegramIdentity {
  return {
    telegramId: "100000001",
    username: "demo_corsair",
    displayName: "Капитан Девин"
  };
}

function verifyTelegramHash(params: URLSearchParams, botToken: string, hash: string): boolean {
  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  return safeEqual(computed, hash);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
