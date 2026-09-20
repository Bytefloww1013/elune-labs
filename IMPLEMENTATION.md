# Implementation Specification: Elune Labs — EverShop Storefront

Low-level build specs per ticket cluster, distilled from `docs/design/8-1-deployment.md`, `8-2-ui-compliance-payment.md`, `8-3-catalog-orders.md` (all source-verified against EverShop v2.2.1). Build order (DAG): B1 → (B2 ∥ B3) → B4 → B5 → B6 → **B7 (design-system migration — in progress)**. The visual specification for B7 and for every surface is root `DESIGN.md`; where an earlier cluster's description of the look conflicts with it, `DESIGN.md` governs and the cluster note is historical.

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

- `src/pages/all/TailwindCss.tsx` + `tailwind.css` + `shadcn.css` — via `npx evershop theme:twizz`; token overrides in `shadcn.css` `:root` (exact oklch values in design 8-2 §1.4): near-black violet bg, violet primary, lavender accent, per-category accents (`--accent-peptides` teal / `--accent-sarms` amber / `--accent-nootropics` green), `--font-sans` system stack; map via `@theme inline`. **[Historical — superseded by B7.]** This is the palette the original build shipped; the B7 migration replaces it with the Lunar Plates token layer and the five `--accent-<url_key>` category tokens in root `DESIGN.md`.
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
- `src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`: each field `getSetting('crypto_wallet_btc', 'bc1qPLACEHOLDER_REPLACE_ME')` / `crypto_wallet_usdt` / `'0xPLACEHOLDER_REPLACE_ME'` / instructions default text (design 8-2 §3.1). **`cryptoWalletUsdt` returns the stored value only when it matches `^0x[0-9a-fA-F]{40}$`; otherwise it returns `null`.** There is no USDT placeholder string: the retired TRON `T…` sentinel is not reused, and null is what makes the checkout row render as unavailable instead of as a payable address. This means the shipped storefront shows USDT unavailable until the owner saves a real Ethereum address — expected, and not a defect.
- `src/pages/admin/paymentSetting/CryptoWalletSetting.tsx`: layout `{areaId:'paymentSetting', sortOrder:30}`; 4 InputFields bound to those keys (pattern: `modules/cod/pages/admin/paymentSetting/CODSetting.tsx@v2.2.1`). The USDT field is labelled **`USDT — Ethereum (ERC-20)`** and validates on save: an empty value (rail disabled) or a `0x` + 40 hex address only. A legacy TRON address is rejected rather than stored, so it cannot be carried forward by accident. Placeholder text asks for an Ethereum wallet address, not a TRON one.

Theme COD override `themes/elune/src/pages/checkout/CashOnDelivery.tsx` — copy of core `modules/cod/pages/frontStore/checkout/CashOnDelivery.tsx@v2.2.1`; keep `registerPaymentComponent('cod', …)`, `checkoutButtonRenderer`, `layout`, `useEffect` redirect verbatim; change only: `nameRenderer` (drop base64 cash logo, render `setting.codDisplayName`), `formRenderer` (query `setting { codDisplayName cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth cryptoWalletInstructions }`; render instructions + 3 network-labelled rows: `BTC — Bitcoin (native SegWit)`, `USDT — Ethereum (ERC-20)`, `ETH — Ethereum (ERC-20)`). **A rail whose address is null renders the sentence `Not configured — contact us before sending.` in place of an address, with no Copy control** — an unconfigured rail is never presented as payable. Panel styling lives in `themes/elune/src/components/frontStore/checkout/checkout.scss` at `--r-ctrl`.

TXID re-label `themes/elune/src/components/frontStore/checkout/ShippingNote.tsx` — copy of core shared component; change only `CardTitle` → `_('Transaction ID (TXID)')` and placeholder → `_('Paste your BTC / USDT / ETH transaction ID (hash)')`. Config: `checkout.showShippingNote: true` explicit.

Settings bootstrap (runbook step or REST): `POST /api/settings {"codPaymentStatus":1,"codDisplayName":"Crypto Payment (BTC / USDT / ETH)"}` + `crypto_wallet_btc` / `crypto_wallet_eth` placeholders. `crypto_wallet_usdt` is **not** seeded with a sentinel — it starts empty (rail disabled) and is set by the owner to a real Ethereum address, because the retired TRON placeholder cannot be reused and a placeholder must never render as payable.

**Verify:** checkout payment step shows crypto name + 3 address rows, no cash logo/doorstep copy; **the USDT row reads `Not configured — contact us before sending.` with no Copy control until a valid `0x…` address is saved, and shows the address once it is**; TXID-titled note field present; note text lands on order (`order.shipping_note`) visible in admin; swap `crypto_wallet_btc` in admin → checkout reload shows new address, no rebuild/restart. The wallet rail list and the TXID panel are flush panels at `--r-ctrl` (8px) — control radius, not card radius, because both carry controls inside a form.

## B4 — Catalog seed script + data

**Files:** `scripts/seed-catalog.mjs`, `scripts/catalog-data.json` (the live catalog content: **five categories, 14 products**, $29.99–$79.99, per-size SKUs like `BPC157-5MG`, qty 100, Size-paired SKUs share a native EverShop Size variant group while each child stays its own simple SKU, `images: []`). Also seeds the three CMS pages (`/faqs`, `/shipping`, `/contact`).

Script behavior (design 8-3 §1): Node ESM, built-in fetch, zero deps; env `EVERSHOP_BASE_URL` (default `http://localhost:3000`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`; `POST /api/user/tokens` → Bearer; on 401 → re-login once, retry. Categories: GraphQL query by `url_key` → POST create if missing. Products: GraphQL query by `sku` → found: PATCH `/api/products/:uuid` `{price, qty, status: 1, stock_availability}`; missing: POST `/api/products` (name, sku, price, qty, status/visibility/manage_stock/stock_availability = 1, `images: []`). Attach: `POST /api/categories/:category_uuid/products` `{product_id: <uuid>}` every run (idempotent, verified). `category_id` in create payload is ignored by 2.2.1 — attach endpoint is the only wiring. Size families are reconciled into native `variant_group` rows without changing product type. Post-run asserts: the five categories by url_key, every SKU resolves, category membership per product, Size groups exact; any failure → stderr list + `process.exit(1)`.

**Verify:** run twice from clean DB — second run creates zero duplicates; price edit in `catalog-data.json` + re-run → PATCH lands; storefront shows five categories with correct products; delete a product + re-run → recreated.

## B5 — Checkout + capture E2E smoke (REST, throwaway)

**Files:** `scripts/smoke-checkout.mjs` (kept: it is the store's checkout regression check) implementing design 8-3 §4 steps 16–19: cart create → add item (`POST /api/cart/:id/items` — singular `/cart/`) → contact → address → shippingMethods (`{provider_code:"core", method_code:"<flat rate code>"}` — confirm at runtime) → paymentMethods (`{method_code:"cod"}`) → shippingNotes (TXID) → checkout → assert order `payment_status: "pending"` + note carried → `POST /api/cod/captures {order_id}` (Bearer) → 200, status `paid`; re-capture → 400. Prints PASS/FAIL per step, non-zero exit on failure.

**Verify:** full green run against the composed stack; double-capture rejected; non-pending/nonexistent order → 400 with documented error shape. The smoke run does not depend on any rail being configured — it places and captures an order through the COD method, so it passes with USDT unavailable.

## B6 — Compliance + persistence + docs finish

**Files:** README final pass (verify/checklist sections from SPEC §7), `.gitignore` check.

**Verify (manual checklist):** fresh context → 18+ modal → accept → cookie → reload clean; `/admin` + `/api` unaffected by gate; RUO string in footer + product page; `docker compose down && up -d --wait` → catalog/settings/order survive; backup one-liner produces restorable dump (spot-check file header); all smoke checks green.

## B7 — Design system migration (in progress, not shipped)

**Status: in progress.** The owner selected the exact v5 landing as the winning direction on 2026-09-17 and root
`DESIGN.md` now carries the settled specification plus a scoped landing exception. This cluster is the work of
bringing `themes/elune` to that specification. **Nothing here may be described as shipped, verified or reviewed
until the build has been reviewed against the rendered pages** — the documents describe the target, not a
completed implementation.

**Scope, per `DESIGN.md` § Migration & Retirement:** the Lunar Plates token layer in `shadcn.css` `:root` +
`tailwind.css` `@theme inline` (with warm slots retired by slot); repointed role aliases; deleted `chart-*`
group; self-hosted Manrope beside JetBrains Mono, with the four static sans faces and their `@font-face`
declarations retired; the approved raster identity kit replacing the generated crescent and text wordmark; the
PNG favicon family; the pill/8/16/32/14 radius set; the two-shadow vocabulary; notices moved onto tokens; the
step table replacing the four-weight scale on every route but the landing; the shell, section rhythm and
1080/900/640/400 breakpoints; the footer grid and base row; the four authored SVG paths replacing the icon
library; and the landing route reproduced from the owner-approved mockup with its seven scoped exceptions.

**Route work in this pass:** the header carries the seven v5 destinations with **Payments → `/faqs`**, and the
footer's Payment column (Bitcoin · USDT (ERC-20) · Ethereum) links to `/faqs` as well. `/payments` does not
exist and must not be linked.

**Rail work in this pass:** `crypto_wallet_usdt` is USDT on Ethereum (ERC-20), validated `^0x[0-9a-fA-F]{40}$`
and failing closed to an unavailable row. **The rail migration is a configuration step for the owner, not a code
change:** the stored TRON value cannot be reused, and until an Ethereum address is saved the storefront shows
USDT as unavailable. That is the expected state, not a defect to be worked around by reintroducing a
placeholder.

**Verify:** the composed stack renders the landing route against the v5 arrangement at desktop and mobile
widths; the accessibility floor in `DESIGN.md` holds (one `<h1>`, `<main>` landmark, heading order, real alt
text, focus ring, 44px targets); the checkout shows the USDT row as unavailable until a valid address is
saved and shows the address after; `/faqs` answers payment; the smoke run stays green. Design values are
confirmed by review against the rendered pages rather than by asserting them here.

## Sequencing & parallelism

- B1 first (everything composes up through it).
- B2 and B3 both touch `themes/elune/` + `config/default.json` — serialize B2 → B3 (B2 creates the scaffold B3 overrides into).
- B4 independent of B2/B3 — can run parallel to B2 (needs only B1).
- B5 needs B4 (products exist) + B1; B6 last.
- Recommended chain: `B1 → B2 → B3 → B5`, `B1 → B4 → B5`, `B5 → B6`.
- **B7 depends on B1–B6** and on the owner's v5 decision; it is the only cluster that may not be treated as
  complete until the rendered pages have been reviewed.
