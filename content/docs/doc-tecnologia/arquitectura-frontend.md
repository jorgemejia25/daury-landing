---
title: "Arquitectura del frontend"
description: "Organización de la app móvil."
tags: ["frontend", "arquitectura"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

The Expo app is organized in layers. Atomic design applies only to the presentational components in `src/ui`; screens are grouped by feature, and data access lives in its own layer. ESLint enforces the import rules (`mobile/eslint.config.js`), so a violation fails `npx expo lint`.

## Layout

```
mobile/
├── app/                 Expo Router routes only; each file re-exports one screen
├── assets/              fonts, logo, mascot
├── src/
│   ├── ui/              design system: tokens, atoms, molecules, organisms, templates,
│   │                    motion, illustrations, mascot. No domain or data imports.
│   ├── features// screens/, components/, hooks/, index.ts (the feature's public API)
│   ├── domain/          pure TypeScript: instructions, occurrences, records, IDs, date format
│   ├── data/local/      the only code that opens expo-sqlite: database, migrations, repositories, seeds
│   ├── data/sync/       outbox, wire format, sync engine, scheduler (see sync-protocol.md)
│   ├── data/remote/     backend clients: sync transport, phone auth, session (see accounts.md)
│   ├── platform/        device services: local reminders, speech
│   └── providers/       React contexts: session, local store, sync, notifications, toasts
└── tests/               domain, data, and sync tests on Node with node:sqlite; tests/e2e runs against a live backend
```

Features: `today`, `guided-activity`, `routine`, `prescription`, `family`, `health`, `profile`, `self-care`, `settings`, `onboarding`, `auth`, `instructions` (shared instruction icon and state colors), and `dev`.

## Import rules

| Layer | May import | May not import |
|---|---|---|
| `app/` | `@/features/` (index only) | anything else |
| `features/` | `ui`, `domain`, `providers`, `platform`, `data` (from hooks), other features through their index | another feature's internal files |
| `ui/` | `ui`, `platform` | `features`, `data`, `domain`, `providers` |
| `domain/` | other `domain` files | React, Expo, every other layer |
| `data/` | `domain` | `ui`, `features`, `providers`, `app` |

## Conventions

- Route files contain one line: `export { TodayScreen as default } from '@/features/today';`.
- Screens read and write through feature hooks built on `useLocalQuery` and `useLocalMutation` (`src/providers/local-store-provider.tsx`); they never call `@/data/local` directly. Type-only imports from `@/data/local` are allowed.
- Subcomponents of a screen live in `features//components`, each with its own styles.
- File names, identifiers, comments, and stored values are in English and match the backend (`done`, `missed`, `interrupted`, `contact_professional`, ...). Text shown to users stays in Spanish.
- Every local write enqueues its sync mutation in the same transaction (`src/data/sync/outbox.ts`). Modules that the Node tests import use relative imports with the `.ts` extension, because Node does not resolve the `@/` alias.
- The on-device database is versioned with `PRAGMA user_version`. Every schema change is a new migration in `src/data/local/migrations.ts` with a test in `tests/data/migrations.test.ts`. The database file name and secure-storage keys never change, so existing installs keep their data.

## Verification

```bash
npx tsc --noEmit
npx expo lint
npm test
npx expo export --platform ios   # real Metro bundle; catches broken imports and routes
DAURY_API_URL=http://localhost:8080 npm run test:e2e   # optional: sync against a running backend
```
