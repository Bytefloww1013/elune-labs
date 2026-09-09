# Implementation Specification: Elune Labs — EverShop Storefront

Low-level build specs per ticket cluster, distilled from `docs/design/8-1-deployment.md`, `8-2-ui-compliance-payment.md`, `8-3-catalog-orders.md` (all source-verified against EverShop v2.2.1). Build order (DAG): B1 → (B2 ∥ B3) → B4 → B5 → B6.

## B1 — Deployment foundation

**Files:** `docker-compose.yml`, `.env.example`, `.gitignore` (add `.env`, `backups/`), `config/default.json`, `README.md` (runbook).

`docker-compose.yml` (verbatim from design 8-1 §3): `app` = `evershop/evershop:2.2.1`, `env_file: .env`, `environment: DB_HOST: database`, ports `"${PORT:-3000}:${PORT:-3000}"`, volumes: named `media-data/public-data/evershop-build/log-data` on `/app/media|public|.evershop|.log`, binds `./themes:/app/themes` (rw), `./scripts:/app/scripts:ro`, `./config:/app/config:ro`, `depends_on: {database: {condition: service_healthy}}`, healthcheck `wget -q --spider http://127.0.0.1:$$PORT/ || exit 1` (interval 10s, timeout 5s, retries 12, start_period 60s), `restart: unless-stopped`. `database` = `postgres:16`, env interpolated `POSTGRES_USER/PASSWORD(${DB_PASSWORD:?set DB_PASSWORD in .env})/DB` from root `.env`, named `postgres-data`, healthcheck `pg_isready -U ${DB_USER} -d ${DB_NAME}` (5s/5s/10s/start 10s), **no ports**. Top-level `volumes:` block declares all five. No `version:` key, no custom network.

`.env.example` = `PORT=3000, DB_HOST=database, DB_PORT=5432, DB_NAME=evershop, DB_USER=evershop, DB_PASSWORD=change-me-strong, DB_SSLMODE=disable`.

`config/default.json` (committed; also carries B3 keys when that lands):
```json
{ "system": { "theme": "elune", "extensions": [{ "name": "elune-payments", "resolve": "extensions/elune-payments", "enabled": true }] } }
```
(theme key lands with B2's scaffold; extension entry with B3 — B1 may commit `{"system":{}}` placeholder then extend.)

README runbook (from design 8-1 §4): clone → `cp .env.example .env` → set `DB_PASSWORD` → `docker compose up -d --wait` → `docker compose exec app npm run user:create -- --email "admin@elunelabs.example" --password "<≥8 chars, ≥1 letter+digit>" --name Admin` → admin walkthrough (Settings: store name `Elune Labs`, currency `USD`, payment: enable COD + display name `Crypto Payment (BTC / USDT / ETH)`, shipping: flat rate) → seed (B4) → `curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3000` (200) + `/admin` (200). Ops section: theme rebuild (`npm run build` + `restart app`), backup `set -a; source .env; set +a; docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql"` (exec -T mandatory), restore into fresh volume, upgrade = backup → tag bump → `pull && up -d` → smoke.

**Verify:** `docker compose up -d --wait` reaches healthy; both curls 200; `docker compose down && up -d --wait` still healthy (volumes persist); `docker compose config` validates.

## B2 — Theme scaffold + branding + age gate + RUO

**Files (under `themes/elune/`, scaffolded via `docker compose exec app npm run theme:create elune`, then `sudo chown -R "$(id -u):$(id -g)" themes/`):** package.json (build script → `swc ./src -d dist --copy-files --strip-leading-paths`), tsconfig (scaffold), plus:

- `src/pages/all/TailwindCss.tsx` + `tailwind.css` + `shadcn.css` — via `npx evershop theme:twizz`; token overrides in `shadcn.css` `:root` (exact oklch values in design 8-2 §1.4): near-black violet bg, violet primary, lavender accent, per-category accents (`--accent-peptides` teal / `--accent-sarms` amber / `--accent-nootropics` green), `--font-sans` system stack; map via `@theme inline`.
- `src/pages/all/GlobalCss.tsx` + `global.scss` — fonts, `.card-icons{display:none}` (kills cash-logo footer block), `.elune-lock{overflow:hidden}` body lock.
- `src/pages/all/Wordmark.tsx` — layout `{areaId:'headerMiddleLeft', sortOrder:10}`; `<span class="font-sans font-bold tracking-[0.35em] text-2xl">ELUNE&nbsp;LABS</span>`, `text-accent` on LABS.
- `src/pages/all/AgeGate.tsx` — layout `{areaId:'body', sortOrder:20}`; on mount read `elune_age_ok` cookie → present: render null; absent: fullscreen `<div role="dialog" aria-modal="true" aria-labelledby="age-gate-title">` + `.elune-lock` on body. Buttons: **[I am 18 or older — Enter]** sets `document.cookie = "elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax"` + unmount; **[Cancel — Leave]** → `window.location = "https://www.google.com"`. Modal copy verbatim from design 8-2 §2.3. One-line pathname guard optional (`/admin` structural exclusion already holds: themes are frontStore-only).
- `src/pages/all/RuoFooter.tsx` — layout `{areaId:'footerBottom', sortOrder:5}`; string: `For research use only. Not for human consumption.`
- `src/pages/categoryView/CategoryAccent.tsx` — reads category `url_key` from page context → `borderBottomColor: var(--accent-<url_key>)`, fallback `--accent`.
- `src/pages/productView/RuoNotice.tsx` — layout `{areaId:'content', sortOrder:60}`; bordered RUO notice.
- Root `package.json` workspaces += `"themes/*"`; `config/default.json` `system.theme: "elune"`; `themeConfig.copyRight: "© 2026 Elune Labs. All rights reserved."`.
- Build inside container: `docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build"` then `docker compose restart app`.

**Verify:** storefront renders wordmark + violet palette; fresh browser context (no cookie) → modal on `/`, none on `/admin`; accept → cookie set, reload clean; footer + any product page contain the RUO string; category pages show per-category accent colors.

## B3 — Wallet settings extension + COD presentation override

**Files:**

`extensions/elune-payments/` (registered in `config/default.json` `system.extensions`, see B1):
- `src/graphql/types/Setting/CryptoWalletSetting.graphql`: `extend type Setting { cryptoWalletBtc: String cryptoWalletUsdt: String cryptoWalletEth: String cryptoWalletInstructions: String }`
- `src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`: each field `getSetting('crypto_wallet_btc', 'bc1qPLACEHOLDER_REPLACE_ME')` / `'TPLACEHOLDER_REPLACE_ME'` / `'0xPLACEHOLDER_REPLACE_ME'` / instructions default text (design 8-2 §3.1).
- `src/pages/admin/paymentSetting/CryptoWalletSetting.tsx`: layout `{areaId:'paymentSetting', sortOrder:30}`; 4 InputFields bound to those keys (pattern: `modules/cod/pages/admin/paymentSetting/CODSetting.tsx@v2.2.1`).

Theme COD override `themes/elune/src/pages/checkout/CashOnDelivery.tsx` — copy of core `modules/cod/pages/frontStore/checkout/CashOnDelivery.tsx@v2.2.1`; keep `registerPaymentComponent('cod', …)`, `checkoutButtonRenderer`, `layout`, `useEffect` redirect verbatim; change only: `nameRenderer` (drop base64 cash logo, render `setting.codDisplayName`), `formRenderer` (query `setting { codDisplayName cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth cryptoWalletInstructions }`; render instructions + 3 network-labelled blocks: `BTC — Bitcoin (native SegWit)`, `USDT — TRON (TRC-20)`, `ETH — Ethereum (ERC-20)`).

TXID re-label `themes/elune/src/components/frontStore/checkout/ShippingNote.tsx` — copy of core shared component; change only `CardTitle` → `_('Transaction ID (TXID)')` and placeholder → `_('Paste your BTC / USDT / ETH transaction ID (hash)')`. Config: `checkout.showShippingNote: true` explicit.

Settings bootstrap (runbook step or REST): `POST /api/settings {"codPaymentStatus":1,"codDisplayName":"Crypto Payment (BTC / USDT / ETH)"}` + the 4 `crypto_wallet_*` placeholders.

**Verify:** checkout payment step shows crypto name + 3 address blocks, no cash logo/doorstep copy; TXID-titled note field present; note text lands on order (`order.shipping_note`) visible in admin; swap `crypto_wallet_btc` in admin → checkout reload shows new address, no rebuild/restart.

## B4 — Catalog seed script + data

**Files:** `scripts/seed-catalog.mjs`, `scripts/catalog-data.json` (full 3-category/15-product content verbatim from design 8-3 §2; per-size SKUs like `BPC157-5MG`, prices $19.99–$79.99, qty 100, `attributes` omitted — select-type size silently drops text in 2.2.1, `images: []`).

Script behavior (design 8-3 §1): Node ESM, built-in fetch, zero deps; env `EVERSHOP_BASE_URL` (default `http://localhost:3000`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`; `POST /api/user/tokens` → Bearer; on 401 → re-login once, retry. Categories: GraphQL query by `url_key` → POST create if missing. Products: GraphQL query by `sku` → found: PATCH `/api/products/:uuid` `{price, qty, status: 1}`; missing: POST `/api/products` (name, sku, price, qty, status/visibility/manage_stock/stock_availability = 1, `images: []`). Attach: `POST /api/categories/:category_uuid/products` `{product_id: <uuid>}` every run (idempotent, verified). `category_id` in create payload is ignored by 2.2.1 — attach endpoint is the only wiring. Post-run asserts: 3 categories by url_key, all 15 SKUs resolve, category membership per product; any failure → stderr list + `process.exit(1)`.

**Verify:** run twice from clean DB — second run creates zero duplicates; price edit in `catalog-data.json` + re-run → PATCH lands; storefront shows 3 categories with correct products; delete a product + re-run → recreated.

## B5 — Checkout + capture E2E smoke (REST, throwaway)

**Files:** `scripts/smoke-checkout.mjs` (kept: it is the store's checkout regression check) implementing design 8-3 §4 steps 16–19: cart create → add item (`POST /api/cart/:id/items` — singular `/cart/`) → contact → address → shippingMethods (`{provider_code:"core", method_code:"<flat rate code>"}` — confirm at runtime) → paymentMethods (`{method_code:"cod"}`) → shippingNotes (TXID) → checkout → assert order `payment_status: "pending"` + note carried → `POST /api/cod/captures {order_id}` (Bearer) → 200, status `paid`; re-capture → 400. Prints PASS/FAIL per step, non-zero exit on failure.

**Verify:** full green run against the composed stack; double-capture rejected; non-pending/nonexistent order → 400 with documented error shape.

## B6 — Compliance + persistence + docs finish

**Files:** README final pass (verify/checklist sections from SPEC §7), `.gitignore` check.

**Verify (manual checklist):** fresh context → 18+ modal → accept → cookie → reload clean; `/admin` + `/api` unaffected by gate; RUO string in footer + product page; `docker compose down && up -d --wait` → catalog/settings/order survive; backup one-liner produces restorable dump (spot-check file header); all smoke checks green.

## Sequencing & parallelism

- B1 first (everything composes up through it).
- B2 and B3 both touch `themes/elune/` + `config/default.json` — serialize B2 → B3 (B2 creates the scaffold B3 overrides into).
- B4 independent of B2/B3 — can run parallel to B2 (needs only B1).
- B5 needs B4 (products exist) + B1; B6 last.
- Recommended chain: `B1 → B2 → B3 → B5`, `B1 → B4 → B5`, `B5 → B6`.
