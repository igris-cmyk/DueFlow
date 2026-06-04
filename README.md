# DueFlow

**DueFlow** is a cashflow command center for contractors, freelancers, agencies, and service businesses.

> Your work is done. Your money should not be lost in WhatsApp.

Every pending payment should have a client, a project, proof, a reason, and a next action.

## Current Status

This repository contains **Phase 2A: Production SaaS Foundation**:

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

Phase 2A does not include billing, AI, file uploads, invitation emails, live reports, or full client, project, and payment CRUD.

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

Create a local `.env.local` from `.env.example` and provide real values for
`DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL`.

`DATABASE_URL` must point to a valid PostgreSQL database for runtime auth, onboarding, and protected app flows. Generate `AUTH_SECRET` with a cryptographically secure random value. Never commit `.env.local` or production secrets.

## Local Development

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run db:generate
```

Create or apply a development migration after configuring a safe PostgreSQL database:

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
/app/projects
/app/payments
/app/follow-ups
/app/proof-vault
/app/reports
/app/settings
```

Unauthenticated users are redirected to `/login`. Authenticated users without an active organization membership are redirected to `/onboarding`.

## Data and Tenant Safety

All future product models include `organizationId`. Future queries must filter by organization and verify active membership; client-submitted organization IDs are never sufficient authorization.

Organization onboarding creates the organization, OWNER membership, and `organization.created` activity log entry inside one database transaction. The `passwordHash` field is never selected by client-facing user helpers.

## Vercel Deployment

Before redeploying Phase 2A, configure these Vercel environment variables for the relevant environments:

* `DATABASE_URL`
* `AUTH_SECRET`
* `NEXTAUTH_URL`

Use the deployed application URL for `NEXTAUTH_URL`. Ensure the PostgreSQL database is reachable from Vercel and apply the initial migration against the intended database before opening auth flows to users.

## Current Limitations

* No organization switcher
* No password reset or email verification flow
* No OAuth providers
* No team invitation workflow
* Organization settings are read-only
* No live uploads, billing, AI, analytics, or product CRUD
* No fake operational data is seeded

## Recommended Next Phase

**Phase 3: Core Ledger System** should add clients, projects, payment records, pending balance calculations, tenant-safe CRUD, empty-to-active workflows, and server-side data integrity.

## License

Private project. All rights reserved.
