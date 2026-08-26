# Prescription Lifeline Pharmacy

A modern, trustworthy e-commerce pharmacy platform for a Nigerian customer
base — online ordering for prescriptions, OTC medicines, vitamins, personal
care, and telepharmacy services.

- **Phone:** +234 702 664 8102
- **Email:** prescriptionlifelinepharmacy@gmail.com

## Tech Stack

| Layer          | Technology                          |
| -------------- | ------------------------------------ |
| Frontend       | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend        | NestJS, TypeScript                   |
| Database       | PostgreSQL                           |
| ORM            | Prisma                               |
| Authentication | Better Auth                          |
| Payments       | Flutterwave                          |
| Monorepo       | pnpm workspaces                      |

## Project Structure

```
apps/
  web/               Next.js frontend (App Router, Tailwind CSS)
  api/                NestJS backend (REST API, Prisma, Better Auth)
packages/
  shared/            Shared TypeScript types/DTOs used by both apps
docker-compose.yml   Local PostgreSQL for development
```

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- [pnpm](https://pnpm.io) (`corepack enable` will pick up the pinned version)
- [Docker](https://www.docker.com/) (for local PostgreSQL)

### Setup

```bash
# 1. Install dependencies for all workspaces
pnpm install

# 2. Start PostgreSQL locally
pnpm db:up

# 3. Copy environment files and adjust if needed
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
# Set a real BETTER_AUTH_SECRET in apps/api/.env, e.g:
openssl rand -hex 32

# 4. Apply the Prisma schema (User/Session/Account/Verification from Better
#    Auth, plus Category/Product/Order/OrderItem) to the database
pnpm --filter api prisma:migrate

# 5. Seed sample categories/products and an admin account
pnpm --filter api prisma:seed

# 6. Run both apps in dev mode
pnpm dev
```

The seed script prints/uses `admin@prescriptionlifelinepharmacy.com` /
`ChangeMe123!` by default (override with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD`) — change that password before this goes anywhere near
production.

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Auth endpoints (Better Auth): http://localhost:4000/api/auth/*

After changing `prisma/schema.prisma`, regenerate the client and create a new
migration with:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```

If Better Auth's config (`apps/api/src/auth/auth.ts`) changes — e.g. adding a
social provider or plugin — regenerate its required tables with:

```bash
pnpm --filter api exec auth generate -y --config src/auth/auth.ts
```

### API overview

- `GET /api/categories`, `GET /api/categories/:slug` — public.
- `GET /api/products` (query: `q`, `category`, `page`, `limit`), `GET /api/products/:slug` — public.
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id` — signed-in customer, scoped to their own orders.
- `POST/PATCH/DELETE /api/admin/categories`, `/api/admin/products` (soft-delete), `GET /api/admin/orders` — admin only (`user.role === "admin"`, via the seed script or by hand).
- `POST /api/payments/webhook` — Flutterwave webhook receiver (HMAC-verified via the `flutterwave-signature` header).

**Flutterwave checkout is not wired up yet.** Their current API (confirmed
live against their docs) uses OAuth2 client-credentials auth and a
Customers → Payment Methods → Orders flow that expects the merchant to
already hold a `payment_method_id` — there's no plain "redirect to a
Flutterwave-hosted page" endpoint in that reference, though their
e-commerce docs still point at a "Flutterwave Inline" product for exactly
that. `POST /api/orders` still fully creates the order (price computed
server-side, stock decremented) and returns `checkout: { ok: false, reason }`
rather than failing. See the comment at the top of
`apps/api/src/payments/flutterwave.client.ts` for what's needed to finish
this — mainly: a real Flutterwave sandbox account so we can see which
checkout product it actually issues keys for.

## Development Roadmap

This project is being built in phases, each verified working before moving
to the next:

1. **Project initialization & setup** — monorepo, Next.js + NestJS scaffolds, Postgres via Docker
2. **Database schema & authentication** — Prisma models, Better Auth in NestJS
3. **Backend API** — categories/products/orders endpoints, Flutterwave integration *(current — checkout initialization still open, see above)*
4. **Frontend UI/UX** — homepage, product catalog, product detail, cart
5. **Integration & checkout** — frontend/backend wiring, auth UI, Flutterwave checkout flow
