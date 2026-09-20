# Architecture: Elune Labs — EverShop Storefront

Derived from `SPEC.md` (requirements epic `elune-labs-tvg.7`) and the design-stage docs in `docs/design/` (beads `elune-labs-tvg.8.1/.2/.3`, all closed). Pinned engine: `evershop/evershop:2.2.1` + `postgres:16`, all Docker.

## System overview

```
┌────────────────────────────── docker compose ──────────────────────────────┐
│  app  (evershop/evershop:2.2.1, node:20-alpine, root, CMD npm run start)   │
│    ├─ themes/elune/      bind rw   ← custom storefront theme (8.2)         │
│    ├─ extensions/elune-payments/  bind rw  ← wallet-settings GraphQL ext   │
│    ├─ scripts/           bind ro   ← seed script (8.3)                     │
│    ├─ config/            bind ro   ← system.theme, extensions registration │
│    └─ media/public/.evershop/.log → named volumes (copy-up is load-bearing)│
│  database (postgres:16)  — pg_isready healthcheck, named volume, NO ports  │
└────────────────────────────────────────────────────────────────────────────┘
        ↑ depends_on service_healthy (both sides healthchecked, up --wait)
http://localhost:3000  (storefront)   /admin  (admin panel)
```

## Subsystems (detail in linked design docs)

### 1. Deployment & Operations — [docs/design/8-1-deployment.md](docs/design/8-1-deployment.md)
Single `docker-compose.yml`: pinned images, `.env`-driven config with fail-fast `${DB_PASSWORD:?}`, app state in **named volumes** (binds would collect root-owned files and shadow baked build output), source dirs bind-mounted (`themes` rw, `extensions` rw for SWC `dist/`, `scripts`/`config` ro), dual healthchecks, `restart: unless-stopped`, Postgres port not published. Bootstrap runbook: up --wait → user:create → admin settings walkthrough → seed → curl smokes. Ops: theme/extension rebuild via `npm --prefix <dir> run build` (SWC) + `npm run build` (webpack) + restart, `pg_dump` backup (exec -T mandatory), restore, upgrade = tag bump + backup first (migrations irreversible).

### 2. Storefront theme + compliance — [docs/design/8-2-ui-compliance-payment.md](docs/design/8-2-ui-compliance-payment.md)
`theme:create` scaffold `themes/elune` (swc build, not tsc — CSS survives). Presentation-only; `system.theme: "elune"` committed in `config/default.json` (theme survives recreation; no theme:active). Tokens as CSS `:root` vars (Tailwind v4 config-in-CSS). **Design migration in progress:** the theme is being moved from its shipped dark-violet/lavender palette and text wordmark to the "Lunar Plates" world specified in root `DESIGN.md` — cool lunar neutrals, one lime accent, five category accents, one bounded `--night` region, the approved raster identity kit, and a landing route reproduced from `docs/design/mockups/elune-landing-mockup-v5.html`. Until the migration lands, ARCHITECTURE and DESIGN.md describe different states of the tree, and DESIGN.md's document status governs which is authoritative for design. **Age gate**: `pages/all/AgeGate.tsx` master component — every storefront page, structurally excludes `/admin` + `/api` (themes are frontStore-only); cookie `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax`. **RUO string** "For research use only. Not for human consumption." in footer + product page. Exact copy in doc §2.3/2.4.

### 3. Payment presentation (manual crypto) — [docs/design/8-2 §3–4](docs/design/8-2-ui-compliance-payment.md) + [docs/design/8-3 §3](docs/design/8-3-catalog-orders.md)
ADR: wallet data lives in **DB settings** (`crypto_wallet_btc/usdt/eth/instructions`) via `POST /api/settings`, surfaced by tiny `elune-payments` GraphQL extension (`extend type Setting` + admin Settings card) — owner swaps placeholder addresses with no code/rebuild/restart. **USDT is Ethereum (ERC-20):** `crypto_wallet_usdt` resolves only when the stored value matches `^0x[0-9a-fA-F]{40}$`, and otherwise resolves to null so the rail renders unavailable rather than payable — the retired TRON `T…` placeholder therefore cannot be reused, and the live storefront shows USDT unavailable until the owner saves a real Ethereum address. COD method enabled + renamed via admin settings (`codPaymentStatus=1`, `codDisplayName="Crypto Payment (BTC / USDT / ETH)"`). Theme master-override `pages/checkout/CashOnDelivery.tsx` renders wallet blocks (drops cash logo/doorstep copy); TXID captured in the stock Order Note re-labeled "Transaction ID (TXID)" (`ShippingNote.tsx` shared override) → `cart.shipping_note` → `order.shipping_note`.

### 4. Catalog & order data path — [docs/design/8-3-catalog-orders.md](docs/design/8-3-catalog-orders.md)
`scripts/seed-catalog.mjs` (Node 20 built-in fetch, zero deps) + `scripts/catalog-data.json`: 5 categories, 14 products ($29.99–$79.99, per-size SKUs, images `[]`). Size-paired SKUs share a native EverShop Size variant group; each child remains its own simple SKU, price, and stock. Also seeds the three CMS pages (`/faqs`, `/shipping`, `/contact`) idempotently, filling only unset settings so it cannot revert owner edits. Auth `POST /api/user/tokens` → Bearer, 401 → re-login. Idempotency: GraphQL GET-before-POST by sku/url_key, PATCH updates, attach via `POST /api/categories/:uuid/products` (idempotent, verified; `category_id` on create payload is ignored in 2.2.1). Post-run asserts + non-zero exit on failure. **Order lifecycle**: cod checkout → `payment_status: pending` → admin reads TXID from order note → verifies on-chain (mempool.space/etherscan) → Capture `POST /api/cod/captures {order_id}` → `paid` + offline transaction row → fulfill only after paid (server-enforced: capture route rejects non-pending). USDT payments are verified on Etherscan, since USDT is accepted on Ethereum (ERC-20) — Tronscan is no longer part of the procedure.

## Key invariants (from SPEC §6)
- Fulfillment only after `payment_status = paid`; Capture is the only pending→paid path.
- Named-volume copy-up is load-bearing: never replace `.evershop`/`public` with empty host binds.
- Theme/extension presentation only — no checkout/order mutation logic modified; order creation path stock.
- Seed idempotent by sku/url_key; data file is the single source of truth.
- Age gate never blocks `/admin` or `/api` (structural, frontStore-only).

## Known upgrade friction (pinned 2.2.1)
2.3+ changes COD statuses (`cod_pending/cod_captured`), unifies capture route (`/api/orders/:id/capture`), adds transaction IDs. Upgrade = re-verify seed capture path + theme override. See 8-3 §3.3 divergence table.
