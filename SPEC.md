# Requirements Specification: Elune Labs — EverShop Storefront

## 1. Executive Summary & Destination

A simple e-commerce storefront selling peptides, SARMs, and nootropics ("research-use-only" products), built on EverShop 2.2.1 + PostgreSQL, deployed and operated entirely via Docker Compose. Brand: **Elune Labs**. The initial version is deliberately minimal: stock EverShop commerce engine, a custom lightly-styled theme, manual crypto payment (no gateway), an 18+ age gate with research-use disclaimers, and a small placeholder catalog seeded via the REST API.

**Destination (map epic `elune-labs-tvg`):** a working store at `http://localhost:3000` with admin at `/admin`, running from one `docker compose up -d`, where a customer can browse 3 categories, place an order, and the owner can confirm manual crypto payment and mark it paid in the admin panel.

**Non-goals (v1):** payment gateway automation (hosted processor / BTCPay), email marketing, analytics integrations, multi-currency, custom logo design, automated backup infrastructure (documented `pg_dump` only), VPS/TLS deployment (deferred until a host exists), server-side age verification.

## 2. Functional & Non-Functional Requirements

### Functional Requirements

- **FR-1 Docker deployment (deploy + database)**
  - One `docker-compose.yml` defining: `app` (image `evershop/evershop:2.2.1`, pinned; NOT `latest`) and `database` (`postgres:16`).
  - Environment: `DB_HOST=database`, `DB_PORT=5432`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSLMODE=disable` (local), `PORT=3000`.
  - Persistent volumes: `postgres-data` (DB), and app-side `media/`, `public/`, `.evershop/`, `.log/` (the stock upstream compose omits these — required for product images, themes, and logs).
  - Healthcheck: Postgres `pg_isready`; app `depends_on` with `condition: service_healthy`.
  - Admin user creation documented/executed via `docker compose exec app npm run user:create -- --email … --password … --name …`.
  - Theme/build note: changes to mounted theme code require `docker compose exec app npm run build` (image bakes core at build; CMD is `npm run start`; migrations run automatically on start).

- **FR-2 Storefront commerce flow**
  - Home, category listing (Peptides, SARMs, Nootropics), product pages, cart.
  - Single-page checkout in stock order: Contact information → Shipping address + shipping method → Payment → Place order → success page.
  - Guest checkout enabled (default).

- **FR-3 Manual crypto payment**
  - Orders are placed with `payment_status = pending` (EverShop built-in offline/COD behavior; admin "Capture" marks paid).
  - Payment step shows order total plus wallet address blocks for **BTC, USDT (TRC-20), ETH** (placeholder addresses until owner supplies real wallets) and instructs the customer to send payment and paste the transaction ID (TXID) into the order note field.
  - Owner verifies payment on-chain in the admin panel and clicks Capture → `payment_status = paid`; the system records an offline payment transaction and order activity.
  - COD/offline wording (display name, instructions) must be customizable so it reads as crypto instructions, not "cash on delivery".
  - **Invariant: an order must not be fulfilled before `payment_status = paid`.** Capture is the only pending→paid path.

- **FR-4 Compliance surface**
  - First storefront visit shows an **18+ confirmation modal**; acceptance sets a cookie (≈30 days) so the gate does not re-show. Client-side only; advisory.
  - "For research use only. Not for human consumption" disclaimer in the footer and on every product page.
  - Age gate must never block `/admin` or API routes (storefront UI concern only).

- **FR-5 Theme (custom, minimal)**
  - Created with `evershop theme:create`; package.json carries the `theme:*` npm scripts.
  - Surface: Elune Labs wordmark header, coherent palette/typography, category accents, footer disclaimer block, age-gate modal styling. No bespoke React components beyond these touch points.

- **FR-6 Catalog seeding**
  - A re-runnable seed script (kept in the repo, e.g. `scripts/seed-catalog.*` with its JSON data list) authenticates to the admin REST API and creates 3 categories and 12–15 placeholder products (names, prices, per-size simple products e.g. 5 mg/10 mg vials, placeholder images).
  - Re-run must be safe: skip/update existing by `url_key`/`sku` instead of duplicating.

- **FR-7 Admin operations**
  - Configure in Admin → Settings: store name "Elune Labs", USD currency, offline/COD payment enable + display name, flat-rate shipping method for the default zone.
  - Confirm payments (FR-3), manage products/categories/orders via `/admin`.

### Non-Functional Requirements

- Single currency (USD); single locale (English).
- Pinned image versions; reproducible bring-up from a clean clone + `docker compose up -d`.
- Runs within 2 GB RAM (EverShop minimum).
- Backups: documented manual `pg_dump` command against the `database` container (no automation in v1).
- No third-party services beyond the customer's own crypto wallet network; no telemetry added.

## 3. Architectural Decisions Record (ADRs)

| # | Decision bead | Choice | Rationale / rejected options |
|---|---|---|---|
| 1 | `elune-labs-tvg.1` Payments | **Manual crypto** (wallet + TXID, admin confirms) | No crypto gateway exists for EverShop; hosted processors (NOWPayments/Cryptomus) need custom extension + KYC + fees and can drop high-risk vendors; BTCPay sidecar = heavy ops. Stripe/PayPal ban this vertical. Automate only when volume justifies. |
| 2 | `elune-labs-tvg.2` Docker layout (research) | **Pinned `evershop/evershop:2.2.1` + `postgres:16`**, app-side volumes, `pg_isready` healthcheck | Stock compose omits media/public/.evershop/.log volumes and healthchecks; `latest` == `next` == 2.2.1 today — pin for upgrade control. |
| 3 | `elune-labs-tvg.3` Age gate | **Client-side 18+ modal + cookie**; RUO disclaimers footer + product pages | Standard niche practice, hours not days; server middleware rejected for v1 (bypassable-by-design accepted; revisit only on legal requirement). |
| 4 | `elune-labs-tvg.4` Catalog seeding (research) | **Scripted REST seeding**, JSON product list in repo | `npm run seed` = demo shoes data, dev-only, no custom hook; direct SQL undocumented; manual admin entry non-reproducible. Variants modeled as separate simple products per size. |
| 5 | `elune-labs-tvg.5` Theme | **Custom theme via `theme:create`, minimal surface** | User trade-off: brand feel accepted, theme maintenance on upgrades acknowledged. Marketplace (SweetDream Bakery) rejected as mismatched. |
| 6 | `elune-labs-tvg.6` VPS topology | **Deferred** — portable compose now | Caddy-vs-Traefik decided when host + domain exist; backups documented only. |
| 7 | `elune-labs-tvg.7.1` Store parameters | **USD; flat rate per order; BTC + USDT (TRC-20) + ETH** address blocks | Placeholder addresses swapped for real wallets at setup. |
| 8 | `elune-labs-tvg.7.2` Checkout capabilities (research) | Use **built-in COD/offline method + core shipping provider**; close the crypto wording/TXID gap via small payment-method extension or COD theme override | EverShop 2.2.1 already provides pending→Capture confirmation, offline transaction records, flat/price-tier/weight-tier rates with free-over-`$X` support — no new machinery beyond payment presentation. |

## 4. Domain Model & Data Schemas

EverShop owns the persistence schema (products, categories, carts, orders, settings, shipping zone/provider/method/rate). This spec fixes the interface-level shapes we touch; internal table design belongs to design/implementation.

### Product (creation payload — REST `POST /api/products`)

```json
{
  "name": "BPC-157 5mg",
  "sku": "BPC157-5MG",                 // optional; auto-generated if omitted
  "price": 39.99,                       // required, > 0, USD
  "qty": 100,
  "status": 1,                          // 1 = enabled
  "visibility": 1,
  "manage_stock": 1,
  "stock_availability": 1,
  "category_id": 1,                     // one of the 3 seeded categories
  "images": [],                         // placeholder imagery
  "attributes": [{ "attribute_code": "size", "value": "5mg" }],
  "metafields": []
}
```

Variants (5 mg/10 mg) are modeled as **separate simple products**, not variant groups — fewest moving parts for a placeholder catalog.

### Category (creation payload — REST `POST /api/categories`)

```json
{
  "name": "Peptides",
  "url_key": "peptides"                 // required, kebab-case regex validated server-side
}
```

Products attach via `POST /api/categories/{id}/products`.

### Order payment lifecycle

```
checkout → createOrder → payment_status: pending
    └─ admin verifies on-chain → Capture → payment_status: paid
         └─ writes payment_transaction (transaction_type: offline) + order_activity
```

- Built-in offline method id: `cod` (enable via Admin → Settings → Payment `codPaymentStatus` toggle, or `config/default.json` → `{"system":{"cod":{"status":1}}}`; display name via `codDisplayName`).
- TXID: customer-provided free text carried on the order (order note); not a dedicated DB field in v1.

### Age-gate cookie (client-side contract)

```
name: elune_age_ok
value: "1"
path: /; max-age: 2592000 (30 days); SameSite=Lax
```

Advisory only: not an auth boundary; never enforced server-side; never blocks `/admin` or API routes.

### Seed data file (repo artifact, consumed by seed script)

```json
{
  "categories": [
    { "name": "Peptides", "url_key": "peptides" },
    { "name": "SARMs", "url_key": "sarms" },
    { "name": "Nootropics", "url_key": "nootropics" }
  ],
  "products": [
    {
      "name": "BPC-157 5mg",
      "sku": "BPC157-5MG",
      "price": 39.99,
      "category": "peptides",
      "qty": 100
    }
  ]
}
```

Validation: `price` numeric > 0; `url_key` kebab-case; admin password ≥ 8 chars with ≥ 1 letter + 1 digit; product counts — 3 categories, 12–15 products total.

### Wallet/instruction configuration seam (input to design)

Crypto payment presentation data (3 address strings + per-coin networks + instructions text) must live in one swappable place — store settings or config file — not scattered in templates. Exact mechanism is a design decision (ADR candidate) constrained by: owner can replace placeholder addresses without code changes.

## 5. API & Interface Specifications

All under base `http://localhost:3000`. Admin API auth: `POST /api/user/tokens` with `{ "email", "password" }` → `{ accessToken, refreshToken }`; subsequent calls send `Authorization: Bearer <accessToken>` (admin token default lifetime ≈ 15 min — seed script must re-authenticate on 401).

| Purpose | Method & path | Body / contract |
|---|---|---|
| Admin token | `POST /api/user/tokens` | `{email, password}` → `{accessToken, refreshToken}` |
| Create category | `POST /api/categories` | Category payload above |
| Attach product to category | `POST /api/categories/{id}/products` | `{product_id}` |
| Create product | `POST /api/products` | Product payload above |
| Cart lifecycle (storefront) | `POST` createCart / addCartContactInfo / addCartAddress / addCartShippingMethod / addCartPaymentMethod / addShippingNote / cartCheckout / createOrder | Stock EverShop checkout REST sequence |
| Set shipping method | `POST /api/carts/:cart_id/shippingMethods` | `{ "provider_code": "core", "method_code": "<configured>" }` — both fields required |
| Confirm payment (admin) | Capture action on order edit → `codCapturePayment` | pending → paid; records offline transaction + activity |

Admin UI surfaces (no API work needed): `/admin` → Settings (store name, payment toggle + display name, shipping methods + rates), Products, Categories, Orders.

Shipping configuration: core provider methods are database/admin-driven (Settings → Shipping): `flat_rate`, `price_based_rate` tiers `[{min_price, cost}]`, `weight_based_rate` tiers `[{min_weight, cost}]`, optional `[min, max)` conditions. v1 uses a single flat rate per order in the default zone. (Free-over-threshold is supported by the same panel if ever wanted — not in v1 scope.)

Error handling: REST errors return 4xx with an error payload; token expiry → 401 (re-authenticate); server-side validation failures (url_key regex, missing/invalid fields) → 400. Exact error JSON shape to be confirmed against the running API during implementation; the seed script must treat non-2xx as failure and report the offending item.

## 6. Invariants, Concurrency & Error Topography

- **Order placement is transactional and server-validated** (EverShop order creator): cart-not-empty, shipping address present, shipping method selected, billing address unless zero total; guest checkout allowed by default. Do not weaken these checks.
- **Payment invariant:** fulfillment only after `payment_status = paid`; Capture is the only pending→paid transition; no client-side path can mark paid.
- **Seed idempotency:** re-running the seed must not duplicate categories (match by `url_key`) or products (match by `sku`); it updates or skips.
- **Startup ordering:** app starts only after Postgres passes `pg_isready` (compose `depends_on: service_healthy`); migrations run automatically on app start — image pinning controls when migrations change.
- **Persistence:** all state (DB data, product images `media/`, built themes/assets in `.evershop/`, `public/`, logs) survives container recreation via named/bind volumes; recreating containers must not lose the catalog.
- **Age gate topology:** purely client-side; absent/expired cookie → show modal; must not intercept admin or API paths.
- **Single currency:** all prices USD; no currency conversion anywhere in v1.
- Failure modes: 401 (expired admin token → re-auth), 400 (validation, wrong payload), cart errors blocking checkout ( surfaced by stock checkout UI), compose failure on unhealthy DB (app refuses start — correct behavior).

## 7. Testing Strategy & Seams

Lean, manual-first (v1 has no test framework):

- **Bring-up smoke (documented checklist):** clean `docker compose up -d` → `GET http://localhost:3000` 200 → `/admin` 200 → login works.
- **Seed verification (in the seed script):** after run, assert 3 categories exist and product count is within 12–15; exit non-zero with the offending payload on any API failure.
- **Checkout E2E (manual or REST-scripted):** add product to cart → complete checkout with flat-rate shipping → order appears in admin as pending-payment → Capture → `payment_status = paid` → offline transaction recorded.
- **Compliance checks:** fresh browser context shows 18+ modal; confirm → cookie set; reload → no modal; footer + a product page contain the RUO string; `/admin` and API routes unaffected by the gate.
- **Persistence check:** `docker compose down && docker compose up -d` → catalog, order, and settings survive.
- Mock seams: none required — payment is manual (no external gateway to mock); the seed script exercises the real API as an integration seam.
