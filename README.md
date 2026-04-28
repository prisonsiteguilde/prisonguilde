# Corsairs: Return of the Legend

Full-stack Telegram Mini App RPG prototype based on the provided GDD: server-authoritative backend, Telegram/TON-ready frontend, economy, turn-based combat, crafting, pets, ships, market, PvP simulation, and anti-cheat telemetry.

## Stack

- Frontend: React + TypeScript + Vite + Zustand + TON Connect UI
- Backend: Fastify + TypeScript + WebSocket + HMAC anti-cheat
- Shared package: deterministic game rules, content catalog, schemas, simulators

## Local setup

```bash
npm install
npm run typecheck
npm run build
npm run dev:api
npm run dev:web
```

Copy `apps/api/.env.example` to `apps/api/.env` for production Telegram bot token and HMAC secrets.

## Important security model

The client never decides rewards, drop results, battle outcomes, market settlement, or currency changes. It sends intents to the API; the backend validates Telegram init data, rate limits, computes outcomes through shared deterministic rules, signs envelopes, and records anti-cheat signals.
