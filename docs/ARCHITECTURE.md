# Corsairs architecture

## Product scope

The project implements the GDD as a server-authoritative Telegram Mini App RPG:

- Turn-based land combat with action points, energy, cooldowns, status effects, vulnerabilities, critical damage, and deterministic seeded RNG.
- Hard progression to level 50, prestige-ready XP curve, skill/bonus points, body stats separated from gear.
- Crafting vertical with professions, queue slots, recipe level gates, material spending, superior quality, and profession XP.
- Ethical chests with public odds and pity counters.
- Ship avatar with asynchronous PvP AI preset rules.
- Pet loyalty and evolution state.
- P2P market/auction escrow model.
- TON NFT reservation for Legendary/Mythic items and mint-intent payload generation.
- Anti-cheat telemetry: Telegram auth verification, nonce replay prevention, rate signals, timing anomaly capture.

## Security model

The frontend is intentionally thin. It can request actions only:

- `POST /api/battles` starts a server-created battle.
- `POST /api/battles/action` sends a move intent; the server validates AP, energy, cooldowns, target HP conditions, timing, and nonce.
- `POST /api/chests/open` pays on the server and rolls rewards server-side.
- `POST /api/craft/start` spends materials server-side and schedules a craft job.
- `POST /api/craft/:jobId/claim` grants output only after server time passes.
- `POST /api/ton/mint-intent` creates a payload only for inventory items owned by the session player.

No client-provided reward, XP, currency, item, or battle result is trusted.

## Production hardening path

The prototype currently uses JSON persistence to keep the repository self-contained. Production migration should replace `GameStore` with:

- PostgreSQL tables for players, inventory, battles, craft jobs, market listings, ledger, and anti-cheat signals.
- Redis for session cache, rate limiting, WebSocket presence, and TON on-chain cache.
- BullMQ for async PvP, raids, market settlement, NFT mint batches, and scheduled economy reports.
- Sentry + Prometheus/Grafana for crash and balance telemetry.

## Environment variables

See `apps/api/.env.example`.

- `TELEGRAM_BOT_TOKEN`: validates Telegram Mini App initData.
- `SESSION_HMAC_SECRET`: signs API session tokens.
- `TON_COLLECTION_ADDRESS`: production collection used in mint intents.
- `TON_TREASURY_ADDRESS`: payment destination for future TON/Stars settlement.
