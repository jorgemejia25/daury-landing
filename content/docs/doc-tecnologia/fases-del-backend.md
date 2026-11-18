---
title: "Fases del backend"
description: "Las seis fases del backend y sus decisiones."
tags: ["backend", "roadmap"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

Complements `backend-development-plan.md`. Records the build order agreed on November 14, 2026, the product decisions taken by default, and the hardening each phase must deliver so a sudden growth spike does not take the service down.

## Starting point

- The mobile app (Expo/React Native) does not talk to the backend: login is mocked and all data lives in encrypted SQLite on the phone, with an append-only log.
- The backend has `platform` and `identity` (email + Cognito) complete, and the `care` domain (H0-H1) without persistence or HTTP.
- The app generates UUID v4 and the seed instructions use text IDs; the backend requires UUID v7.

## Default decisions (open to change)

| Topic | Decision | Discarded alternative |
|---|---|---|
| Login | E.164 phone number as the Cognito username, 6-digit PIN as the password (the minimum Cognito accepts), SMS verification and recovery. Email login stays as a fallback. | Custom authentication with argon2id and self-issued JWTs |
| Server reminders | On-time reminders stay local on the phone. The server only sends escalations to the care circle when no record arrives. | All reminders sent by the server |
| Activated user | Care space created and records on at least 3 of the first 7 days. | — |
| Promo codes | The backend attributes and measures. The Plus discount is applied through App Store and Google Play offer codes. | Discount applied by the backend |
| Sharing permissions | `access_grants` lives in the `care` module, in the same transaction as memberships. Every membership creates its grant; a physician or clinic will receive a grant without a membership. | Separate `access` module (would require cross-module transactions) |

## Phases

| Phase | Backend | Mobile app | Hardening delivered in the phase |
|---|---|---|---|
| 1. Data model and permissions | `care` H2-H4 (spaces, recipients, memberships, invitations, `access_grants`, idempotency), `regimen` and `records` H1-H3 | `uuidv7`, `care_space_id` in local tables, seed IDs as UUID v7 | Per-task pool limits; indexes by `care_space_id`; append-only `records` enforced by trigger |
| 2. Sync | `sync`: `POST /v1/sync`, `change_log` with `xid8` and a safe watermark, per-mutation idempotency, maximum batch size | Outbox, push+pull engine, per-space cursor | Exponential backoff with jitter, honoring `429`/`Retry-After`, write coalescing, per-identity rate limit on `/v1/sync` |
| 3. Accounts | Phone + PIN, `devices`, guest-to-account upgrade (create the space with the local IDs and upload the log) | Real auth, guest mode | Raised SMS spend limit with an alarm, per-number SMS limit, allowed country list, lockout after failed attempts |
| 4. Reminders | `reminders`: Postgres planner (`SKIP LOCKED`), SQS (ElasticMQ locally), push, escalation | Push token registration | Scheduled scaling 06:45-09:30 and 19:45-22:30, autoscaling on queue age, maximum task count |
| 5. AI prescription reading | `extraction`: signed upload to S3 (MinIO locally), extraction with validated JSON output, draft confirmed field by field | Camera → draft → confirmation | Maximum concurrency, daily per-account limit, budget alarm |
| 6. Report and referrals | `reports` (async PDF), `growth` (partners, codes, redemptions, subscriptions, lifecycle events) | Code redemption, PDF download | Load test with 20,000 users, the 08:00 peak, and mass reconnection before launch |

Cross-cutting: stage 2 infrastructure stays written as variables, and alarms cover active connections, RDS CPU credits, queue age, and `/v1/sync` p95.

## Progress

| Phase | State |
|---|---|
| 1. Data model and permissions | Done |
| 2. Sync | Done. See `sync-protocol.md`. Write coalescing happens on the phone (one pass per burst of writes). The phone keeps sync off until phase 3 provides a backend session. |
| 3. Accounts | Done. See `accounts.md`. Production still needs the Cognito pool settings, the `PIN_PEPPER` secret, and the SMS alarms listed there. |
| 4. Reminders | Done. See `reminders.md`. Production still needs the EAS project for push tokens and the ECS scaling and alarms listed there. |
| 5-6 | Not started |

## Write rule

Medications, instructions, and records are written only through `POST /v1/sync`. They have no REST create or edit endpoints; reads arrive in the sync response. Definitions are versioned (every edit is a new version) and records are never modified: a correction is a new record that references the earlier one.
