---
title: "Recordatorios"
description: "Diseño de recordatorios locales y escalamiento."
tags: ["backend", "recordatorios"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

Phase 4 of `backend-fases.md`. On-time reminders are local notifications scheduled on the phone, so they work without a connection. The server only steps in when an occurrence passes its grace period (default 60 min) and nobody recorded it. It then alerts the people who look after the recipient day to day: primary caregiver, caregivers, and family, but not professionals or read-only members.

## Flow

```
worker: planner (every 10 min)        escalation_jobs                 worker: dispatcher (every 30 s)
  current version of each instruction ─▶ one row per occurrence      ─▶ claim due rows (FOR UPDATE SKIP LOCKED)
  occurrences from now−grace to +36 h     due_at = time + grace           recorded?        → satisfied
                                          UNIQUE (instruction, time)      paused/rescheduled → cancelled
                                                                          else one message per circle device ─▶ SQS
worker: delivery (long poll)                                                                                     │
  ◀───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  skip if already in escalation_deliveries → push provider → delivered: record; DeviceNotRegistered: clear token;
  other failures stay queued (visibility timeout) and move to the dead-letter queue after 5 receives
```

- **Several tasks.** Several worker tasks can run at once: claims use `SKIP LOCKED`, a claim abandoned for 5 min returns to the queue, a job fails after 5 attempts, and deliveries are de-duplicated per job and device.
- **Late planner.** The planner never plans occurrences older than one grace period, so a planner that was down does not flood the circle when it comes back.
- **Read-only access.** The reminders module reads regimen, records, care, and devices tables read-only through its own queries (`db/queries/reminders.sql`). It writes only its own tables, plus clearing tokens the push provider rejects.

## Push providers (`PUSH_PROVIDER`)

| Value | Use |
|---|---|
| `expo` | Production. The Expo push service forwards to APNs and FCM. Optional `EXPO_ACCESS_TOKEN`. The app needs an EAS project ID to obtain `ExponentPushToken[…]` tokens. |
| `log` | Development default: logs `push_logged` with job and device IDs. |
| `ios-simulator` | Local testing: `xcrun simctl push booted host.exp.Exponent`. Development builds without an EAS project register the token `dev:ios`, which the API accepts outside production. |

Production refuses any provider except `expo`.

## Phone side

- `src/platform/local-reminders.ts`. Reminders are rebuilt whenever an instruction version or status changes (after a sync, an adopted space, a sign-out) and on the first check of each day. Before, they were scheduled once per install.
- `src/platform/push.ts`. Gets the push token and registers it with `PUT /v1/devices/{id}`, at sign-in and on every launch with a session. Tapping an escalation opens Hoy and starts a sync.

## Scaling (AWS settings; there is no infrastructure code in this repo yet)

| Setting | Value |
|---|---|
| Worker service (ECS) | min 1, max 4 tasks |
| Scheduled scaling | min 2 tasks from 06:45 to 09:30 and from 19:45 to 22:30 local time, where 45% of daily use falls |
| Target tracking | `ApproximateAgeOfOldestMessage` on `daury-escalations` at 60 s |
| Queue | visibility 60 s, long poll 20 s, redrive to `daury-escalations-dead` after 5 receives |
| Alarms | messages in the dead-letter queue > 0; age of oldest message > 5 min; `worker_task_failed` in the logs |

## Configuration

`ESCALATION_GRACE` (1h), `ESCALATION_PLAN_HORIZON` (36h), `ESCALATION_PLAN_INTERVAL` (10m), `ESCALATION_DISPATCH_INTERVAL` (30s), `SQS_ENDPOINT` (local ElasticMQ, empty in AWS), `SQS_REGION`, `SQS_ESCALATION_QUEUE_URL`, `PUSH_PROVIDER`, `EXPO_ACCESS_TOKEN`, `PUSH_SIMULATOR_BUNDLE_ID`.

## Verification

- `make queue-up && make test-integration` runs the planner, dispatcher, and delivery against PostgreSQL and ElasticMQ:
  - an activity that nobody recorded reaches the primary caregiver and the family member, but not the professional;
  - a recorded activity is satisfied;
  - a second dispatch claims nothing.
- Unit tests cover the planning window, dispatch decisions, queue outages, redelivered messages, and dead tokens.
- Tried in the simulator (2026-11-16): a phone account created by tapping through the flow with Maestro, then an activity nobody recorded, which brought up the alert on the simulator's home screen.
