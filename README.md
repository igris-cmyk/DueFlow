# DueFlow

**DueFlow** is a cashflow command center for contractors, freelancers, agencies, and service businesses.

> Your work is done. Your money should not be lost in WhatsApp.

Every pending payment should have a client, a project, proof, a reason, and a next action.

## Current Status

This repository contains **Phase 5A: Promise & Follow-Up Engine**:

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
* Tenant-safe proof metadata create, list, detail, edit, and archive workflows
* Proof records linked to organization, client, project, and optionally payment
* Proof completeness indicators on project and payment detail pages
* Activity logs for proof create, update, and archive actions
* Private Vercel Blob upload storage for one proof file per proof item
* Tenant-safe proof file open/download route through the application
* Proof file upload, replace, and remove actions with activity logs
* File attached/missing indicators in Proof Vault, project proof, and payment proof surfaces
* Tenant-safe client promise create, list, detail, edit, and status workflows
* Tenant-safe follow-up create, list, detail, edit, copy, done, snooze, and cancel workflows
* Missed promise detection without background jobs
* Today’s Cash Desk action queue for missed promises and due/overdue follow-ups
* Project, client, and payment integrations for promise/follow-up context
* Deterministic manual follow-up message templates with copy-only UX

Phase 5A does not include billing, AI, OCR, PDF Proof Packs, WhatsApp API integration, invitation emails, live reports, multi-file proof packs, automated reminders, automatic sending, or debt-collection workflows.

## Tech Stack

* Next.js App Router
* React and TypeScript
* Tailwind CSS
* Auth.js / NextAuth.js v5 credentials provider
* bcryptjs password hashing
* Zod validation
* PostgreSQL
* Prisma 7 with `@prisma/adapter-pg`
* Vercel Blob private storage for proof files

## Auth Architecture

DueFlow uses a credentials provider and JWT session strategy for the initial email and password flow. Users are persisted directly with Prisma and passwords are stored only as bcrypt hashes.

The Prisma Adapter is not used in Phase 2A because credentials authentication with JWT sessions does not require it. Standard adapter-ready `Account`, `Session`, `VerificationToken`, and `Authenticator` models are included so a future OAuth or database-session path does not require a schema rewrite.

Authorization is performed near protected data and layouts through server-only helpers in `lib/auth/guards.ts`. No middleware or proxy is treated as the tenant authorization boundary.

The current workspace is the user's first active membership. A workspace switcher is deferred until multi-workspace UX is implemented.

## Environment Variables

Create local `.env.local` and `.env` files from `.env.example`, then provide
real values for `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, and
`BLOB_READ_WRITE_TOKEN`.

Next.js loads `.env.local` for the application. Prisma 7 loads `.env` through
`prisma.config.ts`, so local migration commands need `DATABASE_URL` in `.env`
or already present in the shell environment. Both files are ignored and must
never be committed.

`DATABASE_URL` must point to a valid PostgreSQL database for runtime auth,
onboarding, and protected app flows. Generate `AUTH_SECRET` with a
cryptographically secure random value.

`BLOB_READ_WRITE_TOKEN` must point to a Vercel Blob store that supports private
objects before proof file upload/open/remove actions can be used. If it is
missing, proof metadata still works and upload attempts show a clean storage
configuration error.

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
/app/promises
/app/promises/new
/app/promises/[promiseId]
/app/promises/[promiseId]/edit
/app/follow-ups
/app/follow-ups/new
/app/follow-ups/[followUpId]
/app/follow-ups/[followUpId]/edit
/app/proof-vault
/app/proof-vault/new
/app/proof-vault/[proofId]
/app/proof-vault/[proofId]/file
/app/proof-vault/[proofId]/edit
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

## Proof Vault

Phase 4B treats a proof item as evidence metadata plus one optional private
uploaded file. Existing `sourceUrl`, `fileName`, and `fileUrl` fields remain
external reference metadata and are separate from storage-backed proof files.

Proof records must belong to the current organization and a project. The
client is derived from the selected project server-side, and payment linking is
optional. When a payment is linked, the server verifies that the payment
belongs to the same organization and selected project.

The Proof Vault supports:

```txt
/app/proof-vault
/app/proof-vault/new
/app/proof-vault/[proofId]
/app/proof-vault/[proofId]/edit
```

Project detail pages show project proof completeness and whether each proof
item has an uploaded file. Payment detail pages show payment proof completeness
and payment proof file status. Completeness still means at least one active
proof item is attached to that project or payment. Archived proof is retained
but does not count as active proof.

Reference URLs and file URLs are displayed as external links only when present
and safe to open. They do not imply that DueFlow uploaded, hosted, verified, or
analyzed the file.

Storage-backed proof files use Vercel Blob private storage. The app stores
stable metadata on `ProofItem`, including storage provider, storage key,
private storage URL, uploaded file name, MIME type, size, upload timestamp, and
file-level actor IDs. The private storage URL/token is never exposed as a user
download link.

Supported proof file uploads:

```txt
application/pdf  .pdf
image/png        .png
image/jpeg       .jpg, .jpeg
image/webp       .webp
```

The current server-upload limit is 4 MB per proof file. Vercel's server upload
path is constrained by function request body limits, so larger proof packs are
deferred until a client-delegated direct-upload flow is added.

Proof files are opened through:

```txt
/app/proof-vault/[proofId]/file
```

That route requires an active signed-in user, resolves the current workspace,
verifies the proof belongs to the workspace, rejects archived/missing files,
fetches the private blob server-side, and streams it with private/no-store
headers.

## Promise and Follow-Up Engine

Phase 5A adds a manual operational action layer over the ledger. Promises are
client commitments; they do not create payment records and never update
`Project.paidAmount` or `Project.pendingAmount`. Only received payments in the
payment ledger update balances.

A promise can be linked to a client, project, optional payment, and optional
proof record. A promise is shown as missed when:

```txt
status = OPEN
promisedDate is before today
project pendingAmount > 0
```

The app does not mutate promise status automatically on page load. Users can
explicitly mark promises kept, missed, partial, or cancelled.

Follow-ups are manual next actions. They may link to a project, promise,
payment, and proof record. Follow-up messages are deterministic templates that
the user can review and copy manually. DueFlow does not send WhatsApp, SMS, or
email messages and does not integrate with WhatsApp Business API or AI services.

Today’s Cash Desk now includes a bounded action queue for missed promises,
follow-ups due today, and overdue follow-ups.

## Migration Notes

Phase 3 adds `PaymentStatus.CANCELLED`, `PaymentRecord.cancelledAt`,
`PaymentRecord.cancelledById`, and an index for organization-scoped paid-date
queries. Phase 4A adds `ProofStatus`, proof title/source/status/archive
metadata, and optional proof-to-payment linking. Phase 4B adds private proof
file storage metadata. Phase 5A adds promise/follow-up links, status fields,
message fields, and action-queue indexes. The migrations are:

```txt
prisma/migrations/20260605000000_phase_3_core_ledger/migration.sql
prisma/migrations/20260608000000_phase_4a_proof_vault_foundation/migration.sql
prisma/migrations/20260609000000_phase_4b_real_proof_upload_storage/migration.sql
prisma/migrations/20260610000000_phase_5a_promise_followup_engine/migration.sql
prisma/migrations/20260610055047_phase_5a_promise_followup_engine/migration.sql
```

Apply migrations to the intended PostgreSQL database before redeploying:

```bash
npx prisma migrate deploy
```

## Data and Tenant Safety

All product models include `organizationId`. Product queries and mutations filter by the current organization and verify active membership; client-submitted organization IDs are never sufficient authorization.

Organization onboarding creates the organization, OWNER membership, and `organization.created` activity log entry inside one database transaction. The `passwordHash` field is never selected by client-facing user helpers.

Client, project, payment, and proof mutations write concise activity log
entries for product actions without storing secrets or unnecessary PII. Proof
activity metadata stores titles, types, project IDs/names, linked payment IDs,
and safe uploaded file metadata. Storage tokens, private storage credentials,
and raw file contents are never logged.

## Vercel Deployment

Before redeploying Phase 4B, configure these Vercel environment variables for
the relevant environments:

* `DATABASE_URL`
* `AUTH_SECRET`
* `NEXTAUTH_URL`
* `BLOB_READ_WRITE_TOKEN`

Add the variables in the Vercel project settings before using auth or database
flows. Use the deployed application URL for `NEXTAUTH_URL`. Ensure the
PostgreSQL database is reachable from Vercel and apply migrations against the
intended database before opening auth flows to users.

Before production proof uploads:

1. Create or connect a Vercel Blob store with private object support.
2. Add `BLOB_READ_WRITE_TOKEN` to Vercel project environment variables.
3. Apply database migrations with `npx prisma migrate deploy`.
4. Redeploy the app.
5. Test upload/open/replace/remove first with a dummy PDF or image, not real
   sensitive client evidence.

For Phase 5A production rollout, apply migrations and then test with non-real
client data first:

1. Create a promise on a pending project.
2. Create a follow-up from that promise.
3. Verify Today’s Cash Desk shows missed/due actions.
4. Verify the follow-up message can be copied manually and is not sent.

## Current Limitations

* No organization switcher
* No password reset or email verification flow
* No OAuth providers
* No team invitation workflow
* Organization settings are read-only
* One uploaded file per proof item
* Proof file uploads are limited to 4 MB with the current server-upload flow
* No audio proof uploads
* Follow-up messages are deterministic templates, not AI-generated
* No automatic WhatsApp, SMS, or email sending
* No billing, AI, OCR, analytics, reports engine, PDF Proof Packs, multi-file proof packs, or generated proof exports
* No archive workflow for clients or projects yet
* No fake operational data is seeded

## Recommended Next Phase

**Phase 5B: Follow-Up Workflow Refinement** should improve filtering, saved
templates, snooze controls, and promise/payment reconciliation helpers before
moving into larger reports or proof-pack exports.

## License

Private project. All rights reserved.
