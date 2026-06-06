# DueFlow

**DueFlow** is a cashflow command center for contractors, freelancers, agencies, and service businesses.

> Your work is done. Your money should not be lost in WhatsApp.

Every pending payment should have a client, a project, proof, a reason, and a next action.

## Current Status

This repository contains **Phase 3: Core Ledger System**:

* Premium public marketing routes from Phase 1 and Phase 1.5
* Email and password signup, login, and logout
* Auth.js credentials authentication with encrypted JWT sessions
* PostgreSQL and Prisma 7 foundation
* User, organization, membership, role, and activity log models
* Future client, project, payment, proof, promise, follow-up, and dispute schema
* Transactional organization onboarding
* Server-side tenant and role helpers
* Protected DueFlow app shell and product-specific empty states
* Read-only organization settings foundation
* Tenant-safe client create, list, detail, and edit workflows
* Tenant-safe project create, list, detail, and edit workflows
* Tenant-safe received-payment create, list, detail, edit, and cancel workflows
* Transactional project balance recalculation for paid and pending amounts
* Real Today’s Cash Desk aggregates for pending, overdue, due-this-week, and received-this-month money
* Activity logs for core ledger create, update, and cancellation actions

Phase 3 does not include billing, AI, file uploads, invitation emails, live reports, proof uploads, promise tracking, or follow-up automation.

## Tech Stack

* Next.js App Router
* React and TypeScript
* Tailwind CSS
* Auth.js / NextAuth.js v5 credentials provider
* bcryptjs password hashing
* Zod validation
* PostgreSQL
* Prisma 7 with `@prisma/adapter-pg`

## Auth Architecture

DueFlow uses a credentials provider and JWT session strategy for the initial email and password flow. Users are persisted directly with Prisma and passwords are stored only as bcrypt hashes.

The Prisma Adapter is not used in Phase 2A because credentials authentication with JWT sessions does not require it. Standard adapter-ready `Account`, `Session`, `VerificationToken`, and `Authenticator` models are included so a future OAuth or database-session path does not require a schema rewrite.

Authorization is performed near protected data and layouts through server-only helpers in `lib/auth/guards.ts`. No middleware or proxy is treated as the tenant authorization boundary.

The current workspace is the user's first active membership. A workspace switcher is deferred until multi-workspace UX is implemented.

## Environment Variables

Create local `.env.local` and `.env` files from `.env.example`, then provide
real values for `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL`.

Next.js loads `.env.local` for the application. Prisma 7 loads `.env` through
`prisma.config.ts`, so local migration commands need `DATABASE_URL` in `.env`
or already present in the shell environment. Both files are ignored and must
never be committed.

`DATABASE_URL` must point to a valid PostgreSQL database for runtime auth,
onboarding, and protected app flows. Generate `AUTH_SECRET` with a
cryptographically secure random value.

Prisma client generation does not require a live database connection. The
Prisma config reads `process.env.DATABASE_URL` so dependency installation and
`prisma generate` can complete before deployment secrets are available.
Migration commands still require a valid `DATABASE_URL` and fail clearly when
it is missing.

## Local Development

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run db:generate
```

Create or apply a development migration after configuring a safe PostgreSQL
database in `.env`:

```bash
npm run db:migrate -- --name init_dueflow_saas_foundation
```

Run the app:

```bash
npm run dev
```

Other commands:

```bash
npm run lint
npm run typecheck
npm run build
npm run db:studio
```

`npm run build` generates the Prisma client before building Next.js.

## Routes

Public marketing:

```txt
/
/pricing
/use-cases
/use-cases/contractors
/use-cases/freelancers
/use-cases/agencies
```

Auth and onboarding:

```txt
/signup
/login
/onboarding
```

Protected product:

```txt
/app
/app/today
/app/clients
/app/clients/new
/app/clients/[clientId]
/app/clients/[clientId]/edit
/app/projects
/app/projects/new
/app/projects/[projectId]
/app/projects/[projectId]/edit
/app/payments
/app/payments/new
/app/payments/[paymentId]
/app/payments/[paymentId]/edit
/app/follow-ups
/app/proof-vault
/app/reports
/app/settings
```

Unauthenticated users are redirected to `/login`. Authenticated users without an active organization membership are redirected to `/onboarding`.

## Core Ledger

Phase 3 treats `Project.totalValue` as the agreed value of the work and
`PaymentRecord` rows with `type = PAYMENT` as money received against that
project. Valid received payments exclude records with `status = CANCELLED`.

Project balances use transactional denormalization because `Project` already
stores `paidAmount` and `pendingAmount`. Whenever a payment is created, edited,
or cancelled, DueFlow recalculates:

```txt
paidAmount = sum(valid received payments)
pendingAmount = max(totalValue - paidAmount, 0)
```

Received payments are rejected if they would exceed the remaining pending
balance. Cancelled payment records remain in the database and no longer count
toward paid totals.

## Migration Notes

Phase 3 adds `PaymentStatus.CANCELLED`, `PaymentRecord.cancelledAt`,
`PaymentRecord.cancelledById`, and an index for organization-scoped paid-date
queries. The migration is:

```txt
prisma/migrations/20260605000000_phase_3_core_ledger/migration.sql
```

Apply migrations to the intended PostgreSQL database before redeploying:

```bash
npm run db:migrate -- --name phase_3_core_ledger
```

## Data and Tenant Safety

All product models include `organizationId`. Product queries and mutations filter by the current organization and verify active membership; client-submitted organization IDs are never sufficient authorization.

Organization onboarding creates the organization, OWNER membership, and `organization.created` activity log entry inside one database transaction. The `passwordHash` field is never selected by client-facing user helpers.

Client, project, and payment mutations write concise activity log entries for
core ledger actions without storing secrets or unnecessary PII.

## Vercel Deployment

Before redeploying Phase 3, configure these Vercel environment variables for the relevant environments:

* `DATABASE_URL`
* `AUTH_SECRET`
* `NEXTAUTH_URL`

Add the variables in the Vercel project settings before using auth or database
flows. Use the deployed application URL for `NEXTAUTH_URL`. Ensure the
PostgreSQL database is reachable from Vercel and apply migrations against the
intended database before opening auth flows to users.

## Current Limitations

* No organization switcher
* No password reset or email verification flow
* No OAuth providers
* No team invitation workflow
* Organization settings are read-only
* No live uploads, billing, AI, analytics, reports engine, or proof backend
* No archive workflow for clients or projects yet
* No promise tracker or follow-up engine
* No fake operational data is seeded

## Recommended Next Phase

**Phase 4A: Proof Vault Foundation** should add proof metadata CRUD and a storage decision for invoices, approvals, screenshots, and work photos linked to the real ledger.

## License

Private project. All rights reserved.
