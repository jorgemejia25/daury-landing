---
title: "Cuentas y autenticación"
description: "Diseño de cuentas, invitados y acceso."
tags: ["backend", "cuentas"]
source: "daury/docs"
---

> Migrado desde: daury/docs. Conserva el contenido original; las cifras y fechas son las de ese documento.

Phase 3 of `backend-fases.md`. Daury works without an account (guest mode, data only on the phone). An account keeps the care log on the server, lets the care circle share it, and moves it to a new phone.

## Sign-up and sign-in

```
phone                               API                                Cognito
  │ POST /v1/auth/phone/register      │ normalize +502, refuse weak PIN    │
  │ { phone_number, pin }        ───▶ │ reserve one SMS (limits)          │
  │                                   │ password = HMAC(pepper, phone+PIN) ─▶ SignUp(username = phone) → SMS code
  │ ◀── 202 { delivery: "+502 ••••0123" }
  │ POST …/register/confirm { code } ─▶ (counts toward lockout)         ─▶ ConfirmSignUp
  │ POST /v1/auth/phone/login { pin } ─▶ lockout check, same HMAC       ─▶ InitiateAuth
  │ ◀── tokens; POST /v1/session (ID token); PUT /v1/devices/{install id}
```

| Rule | Value | Where |
|---|---|---|
| PIN | 6 digits. Runs (123456), one digit repeated, repeated pairs or triples, and the end of the phone number are refused with `weak_pin` | `identity.ValidatePIN` |
| Countries | Allowed calling codes, `PHONE_ALLOWED_CALLING_CODES` (default `502`); others get `phone_not_supported` | `identity.PhonePolicy` |
| Provider password | `Dy1!` + HMAC-SHA256(`PIN_PEPPER`, phone and PIN). A PIN alone cannot sign in at Cognito, so nobody can get around Daury's lockout by calling Cognito directly. A leaked user pool exposes no PINs. Rotating the pepper invalidates every PIN. | `identity.CredentialDeriver` |
| SMS per number | 3 per hour, 6 per day (`sms_rate_limited`, Retry-After 3600) | `sms_dispatches`, shared by all API instances |
| SMS per day | `SMS_DAILY_BUDGET` (default 500). The logs record `sms_budget_warning` at 80% and `sms_budget_exhausted` at 100% (`sms_unavailable`); alarms watch these events | same table |
| Lockout | 5 wrong PINs or codes within 15 min lock the number for 15 min after the latest failure (`too_many_attempts`, Retry-After), even with the right PIN. A success clears the count | `auth_failures` |
| Per-address limit | The email routes' limiter also covers `/v1/auth/phone/*` | existing |

Numbers in the abuse tables are stored only as HMAC digests. The identity keeps the verified number as a profile snapshot (`phone_number`); the key is still issuer + subject.

## Guest to account, and a new phone

The first sync after sign-in matches the phone's care space with the account (`src/data/sync/engine.ts`, `linkAccount`):

| The account has… | The phone holds… | Result |
|---|---|---|
| this space | anything | `linked`: a reinstall that kept its data |
| another space | only the untouched seeds | `adopted`: seeds dropped, the phone takes the account's space and pulls its routine and log; no seeds are added to it later |
| no space, or another one | records or its own instructions | `uploaded`: the space is created with the phone's IDs and the whole outbox follows (guest to account) |

Signing out empties the phone (shared phones are common): every personal table is cleared and a new guest space is created; the installation ID stays. While records still wait for the server, sign-out stops and asks the person to connect first; they can still sign out and lose those records.

## Phone side

| Piece | File |
|---|---|
| Auth endpoints | `src/data/remote/auth-client.ts` |
| Session: tokens in secure storage (three entries, each under 2 KB), refresh one minute before expiry, one refresh at a time, rejected refresh ends the session | `src/data/remote/session.ts` |
| Provider: restore on launch, phone sign-up, sign-in, recovery, sign-out with the pending check, device registration | `src/providers/auth-provider.tsx` |
| Screen: number → PIN → repeat → SMS code, or number → PIN, with "Olvidé mi PIN" | `src/features/auth/screens/phone-auth-screen.tsx`, `hooks/use-phone-auth.ts` |
| Account row and sign-out in Ajustes | `src/features/settings/hooks/use-account.ts` |

Builds without `EXPO_PUBLIC_API_URL` run as guest only. Apple, Google, and email sign-in are not connected; their buttons point to the phone account.

## Production setup still needed

- Cognito user pool with plain usernames, `phone_number` auto-verified by SMS, the same password policy as the local seed, and an SNS SMS spend limit with an alarm (see `backend/dev/identity/cognito/README.md`).
- `PIN_PEPPER` stored as a secret (at least 32 characters). Startup fails in production while the development pepper is still in use.
- CloudWatch metric filters and alarms on `sms_budget_warning` and `sms_budget_exhausted`.

## Verification

```bash
cd backend && make check     # unit, HTTP, contract, and integration tests: lifecycle, lockout, SMS limits against the emulator
cd mobile && npm test        # session refresh and sign-out, account linking, reset
DAURY_API_URL=http://localhost:8080 npm run test:e2e   # guest upgrade, second phone adopts, sign-out, against the real API
```

The phone and PIN screen has been rendered in the iOS simulator (Expo Go). The full flow has been tested end to end through the data layer, but not by tapping through it on a device.
