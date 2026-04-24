# TON Abyss

> Хардкорный roguelite-RPG в виде Telegram Mini App с TON-интеграцией.
>
> См. полный GDD: [`docs/GDD.md`](./docs/GDD.md)

## Кратко
- **Жанр**: turn-based roguelite-RPG. Классы, данжи, боссы, питомцы, крафт, хардкор.
- **Платформа**: Telegram Mini App (+ веб-превью).
- **Стек**: React 18 + Vite + TypeScript + Tailwind + Framer Motion + Zustand + TonConnect UI; Fastify + SQLite бэкенд; pnpm монорепо.
- **Философия**: pay-to-cosmetics, никогда не pay-to-win. Лут редкий. Смерть болит.

## Структура монорепо

```
ton-abyss/
├── apps/
│   ├── web/        React-клиент
│   └── api/        Fastify-сервер
├── packages/
│   ├── shared/     Типы, формулы, RNG, экономика (single source of truth)
│   └── content/    Предметы, монстры, боссы, питомцы, данжи, рецепты
└── docs/
    └── GDD.md      Game Design Document
```

## Быстрый старт (локально)

```bash
corepack enable
pnpm install
pnpm --filter @ton-abyss/shared build
pnpm --filter @ton-abyss/content build

# Оба сервиса параллельно (API + Web):
pnpm dev

# Или по отдельности:
pnpm dev:web   # http://localhost:5173
pnpm dev:api   # http://localhost:3030

# Health-check API:
curl http://localhost:3030/health
```

Клиент работает **полностью офлайн** на `localStorage` — чтобы preview-деплой не требовал поднятого сервера. Сервер (Fastify + SQLite) опционален и используется только для auth-флоу/сохранений/PvP-снэпшотов.

### Переменные окружения

```bash
# apps/api/.env
TG_BOT_TOKEN=                # пусто в деве = unsigned-fallback (dev only!)
PORT=3030
HOST=0.0.0.0
NODE_ENV=development

# apps/web/.env
VITE_API_URL=http://localhost:3030
```

В production всегда задавайте `TG_BOT_TOKEN` — без него auth НЕ валидируется.

## Сборка

```bash
pnpm build                   # shared → content → api + web
pnpm --filter @ton-abyss/web build
```

## Команды разработки

- `pnpm dev` — параллельный dev во всех пакетах
- `pnpm build` — сборка всего монорепо
- `pnpm typecheck` — проверка типов

## Основные формулы
- Прогрессия: `packages/shared/src/progression.ts`
- Формулы боя: `packages/shared/src/combat.ts`, `packages/shared/src/formulas.ts`
- Лут и аффиксы: `packages/shared/src/loot.ts`, `packages/shared/src/rarity.ts`
- Крафт/усиление: `packages/shared/src/crafting.ts`
- Экономика: `packages/shared/src/economy.ts`

## Ссылки
- GDD: [`docs/GDD.md`](./docs/GDD.md)
- Лицензия: MIT
