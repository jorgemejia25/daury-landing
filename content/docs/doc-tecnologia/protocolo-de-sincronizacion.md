---
title: "Protocolo de sincronización"
description: "Cómo se sincronizan los datos del teléfono con el servidor."
tags: ["sync", "backend"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

Phase 2 of `backend-fases.md`. The phone stays the place where care is recorded; sync copies its log to the server and brings back what the rest of the care circle wrote. The contract is `POST /v1/sync` in `backend/api/openapi.yaml`.

## Round trip

One request pushes up to 100 mutations in order, then returns up to 500 changes after the client's cursor.

```
phone                                        server
  │  POST /v1/sync                              │
  │  { care_space_id, cursor, mutations[] } ──▶ │ apply each mutation through regimen / records
  │                                             │ read change_log after cursor (finished transactions only)
  │ ◀── { results[], changes[], cursor, has_more }
  │  one local transaction: settle outbox, apply changes, save cursor
```

| Mutation kind | Entity | Owning module |
|---|---|---|
| `medication.register` | `medication` | regimen |
| `instruction_version.save` | `instruction_version` | regimen |
| `care_record.append` | `care_record` | records |

## Guarantees

- **Idempotent writes.** A mutation's ID is the entity's client-generated UUID v7. Replaying an identical mutation reports `applied` without writing again; reusing an ID for different content is rejected with `id_conflict`.
- **Per-mutation rejections.** `invalid`, `not_found`, `forbidden`, `id_conflict`, and `kind_mismatch` are permanent: the phone marks the outbox row `rejected` and never resends it. Any other failure (5xx, timeout, no network) fails the whole request, and the phone retries it unchanged.
- **No skipped changes.** `change_log` rows are written by `AFTER INSERT` triggers in the same transaction as the entity and ordered by `(txid, seq)`. A read returns only rows whose transaction is older than `pg_snapshot_xmin(pg_current_snapshot())`, so a transaction that started earlier but commits later can never fall behind a cursor. The cost: a long-running transaction anywhere in the cluster delays the feed until it ends.
- **Read scopes per entity.** Syncing a space needs `routine.read`. Medications, mood, and symptoms also need `clinical.read`; doses, activities, and notes need `records.read`. Hidden entities are left out, but the cursor still moves past them.
- **Load protection.** Bodies are capped at 1 MiB, each identity gets a burst of 20 requests and then one every 500 ms (`429` with `Retry-After`), and grant checks are cached for the length of one request.

## Phone side

| Piece | File | Role |
|---|---|---|
| Outbox | `src/data/sync/outbox.ts` | Every write enqueues its mutation in the same SQLite transaction (`records-repository`, `seeds`). |
| Wire format | `src/data/sync/wire.ts` | Builds pushed payloads; parses pulled ones and normalizes server times to `toISOString()`. |
| Engine | `src/data/sync/engine.ts` | Creates the server copy of the space once (fixed `Idempotency-Key`), then pushes and pulls in rounds until both sides are caught up. |
| Apply | `src/data/sync/apply.ts` | Writes pulled changes idempotently. A local instruction edit that is still pending is not overwritten. |
| Scheduler | `src/data/sync/scheduler.ts` | Coalesces writes (2 s), retries with exponential backoff and jitter (2 s up to 5 min) and never sooner than `Retry-After`, polls every 15 min, and runs one pass at a time. |
| Client | `src/data/remote/api-client.ts` | `fetch` with a 20 s timeout. It turns HTTP errors into `TransportError`. |
| Provider | `src/providers/sync-provider.tsx` | Runs the scheduler on launch, after writes, and on return to the foreground, while `EXPO_PUBLIC_API_URL` is set and someone is signed in. |

Local schema version 3 added `medications`, instruction `status`, `seed_key`, and `seed_revision`, plus `sync_outbox` and `sync_state`. It also replaced the seed instruction IDs that every install used to share with per-install IDs, and enqueued every existing row, so the first sync uploads the whole log. Seed text is no longer rewritten on every launch: raising a seed's `revision` writes a new version, based on the previous one.

## Not covered yet

- Sync runs only with an account (phase 3, `accounts.md`); guests keep everything in the outbox until they sign in.
- Mood, symptom, and note records are pulled but not stored on the phone, since it has no tables for them yet.
- Rejected mutations are kept with their reason, but no screen shows them yet.
- Migration 3 has only been tested against SQLite in Node. It still needs a run on a device with SQLCipher (development build).

## Verification

```bash
cd backend && make check                                       # includes the integration and watermark tests
cd mobile && npm test                                          # migrations, seeds, wire, engine, scheduler
cd backend && make dev-up identity-up && make run-api          # then, in mobile/:
DAURY_API_URL=http://localhost:8080 npm run test:e2e           # real backend, synthetic user
```
