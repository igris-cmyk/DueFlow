# DueFlow

**DueFlow** is a cashflow command center for contractors, freelancers, agencies, and service businesses.

> Your work is done. Your money should not be lost in WhatsApp.

DueFlow is designed to help work-based businesses track pending payments, proof, client promises, disputes, and follow-ups from one premium cashflow command center.

---

## What DueFlow Solves

Many small businesses complete work before receiving full payment. Their payment records often get scattered across WhatsApp chats, screenshots, invoices, notebooks, phone calls, and memory.

DueFlow is built around one simple principle:

> Every pending payment should have a client, a project, proof, a reason, and a next action.

---

## Current Status

This repository currently contains **Phase 1 + Phase 1.5** of DueFlow:

* Premium public landing page
* Pricing page
* Use-cases page
* Dynamic use-case pages
* Component-based product previews
* Design system primitives
* Responsive visual polish
* CTA contrast fixes
* Smooth scrolling and anchor polish
* SEO metadata
* Static early-access marketing experience

This version does **not** include authentication, database, billing, file uploads, AI API calls, PDF generation, or a live mobile app yet.

---

## Core Product Concepts

### Today’s Cash Desk

DueFlow does not open with a generic dashboard. It opens with a focused cash desk that answers:

* Who owes money?
* What is overdue?
* What did clients promise?
* What proof is missing?
* What should be followed up today?

### Proof Vault

A structured place for invoices, work photos, WhatsApp screenshots, approvals, bills, delivery proof, signed documents, and other evidence related to a project.

### Suggested Follow-Ups

DueFlow is designed to help users write clear, respectful payment follow-ups. Messages are user-approved and do not imply automatic collection or legal action.

### Web + Mobile Vision

The web app is planned as the command center for full cashflow control, reporting, pricing, billing, and team workflows.

The mobile app is planned as the field tool for adding proof photos, recording promises, checking follow-ups, marking payments received, and copying WhatsApp reminders.

---

## Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* React
* ESLint
* Static marketing architecture

---

## Routes

```txt
/
 /pricing
 /use-cases
 /use-cases/contractors
 /use-cases/freelancers
 /use-cases/agencies
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Run typecheck:

```bash
npm run typecheck
```

---

## Verification Status

Phase 1.5 passed:

* `npm run lint`
* `npm run typecheck`
* `npm run build`
* `npm audit`
* Route smoke checks
* Responsive browser QA using headless Chromium

---

## Product Boundaries

DueFlow is not:

* a debt recovery app
* a legal recovery tool
* a generic CRM
* an accounting replacement
* a chatbot wrapper
* an automated WhatsApp spam tool

DueFlow is designed to help businesses organize pending money, proof, promises, disputes, and follow-ups professionally.

---

## Planned Next Phase

**Phase 2: Production SaaS Foundation**

Planned scope:

* Authentication
* Organization/workspace model
* Protected app shell
* Database schema
* Multi-tenant boundaries
* Empty-state product workflows
* Client, project, payment, proof, promise, and follow-up foundations

---

## License

Private project. All rights reserved.
