#!/usr/bin/env bash
# Cut the build DAG for Elune Labs (beadfinder-to-tickets). One-shot.
set -euo pipefail
cd /home/josh/dev/elune-labs

IMPL=$(bd create "Implement: Elune Labs — EverShop storefront" -t epic -p 1 \
  --label beadfinder:slice --label phase:implement --no-inherit-labels \
  -d "Implementation graph derived from Plan Epic elune-labs-tvg and SPEC.md (requirements epic elune-labs-tvg.7). Sources of truth: SPEC.md, ARCHITECTURE.md, IMPLEMENTATION.md, docs/design/8-1-deployment.md, docs/design/8-2-ui-compliance-payment.md, docs/design/8-3-catalog-orders.md. Waves: compose (T1-T2) -> theme (T3-T8) parallel with payments (T9-T13, needs T2) and seed (T14-T16, needs T2) -> smoke (T17) -> finish (T18)." \
  --json | jq -r '.id')

T1=$(bd create "Scaffold docker-compose.yml, .env.example, .gitignore" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- docker-compose.yml
- .env.example
- .gitignore

Contract / Interface:
Compose exactly per IMPLEMENTATION.md cluster B1 and docs/design/8-1 section 3. app: image evershop/evershop:2.2.1 (hard pin), restart unless-stopped, env_file .env, environment DB_HOST: database, ports "${PORT:-3000}:${PORT:-3000}", volumes: named media-data/public-data/evershop-build/log-data on /app/media,/app/public,/app/.evershop,/app/.log, plus binds ./themes:/app/themes (rw), ./scripts:/app/scripts:ro, ./config:/app/config:ro; depends_on database condition service_healthy; healthcheck CMD-SHELL wget -q --spider http://127.0.0.1:$$PORT/ interval 10s timeout 5s retries 12 start_period 60s. database: image postgres:16, restart unless-stopped, environment POSTGRES_USER ${DB_USER}, POSTGRES_PASSWORD ${DB_PASSWORD:?set DB_PASSWORD in .env}, POSTGRES_DB ${DB_NAME}, volume postgres-data:/var/lib/postgresql/data, healthcheck CMD-SHELL pg_isready -U ${DB_USER} -d ${DB_NAME} interval 5s timeout 5s retries 10 start_period 10s, NO ports published. Top-level volumes: postgres-data, media-data, public-data, evershop-build, log-data. No version key, no custom network. .env.example: PORT=3000, DB_HOST=database, DB_PORT=5432, DB_NAME=evershop, DB_USER=evershop, DB_PASSWORD=change-me-strong, DB_SSLMODE=disable. .gitignore adds .env, backups/, themes/*/node_modules/.

Verification Command:
docker compose config > /dev/null && echo COMPOSE_OK

Acceptance Criteria:
- [ ] docker compose config validates
- [ ] five named volumes declared; app state paths use named volumes, NOT empty host binds on /app/public or /app/.evershop (copy-up is load-bearing, docs/design/8-1 D1)
- [ ] DB_PASSWORD fail-fast interpolation present
- [ ] postgres publishes no ports
- [ ] .env.example and .gitignore committed' \
  --json | jq -r '.id')

T2=$(bd create "Verify bring-up: up --wait, curls, persistence cycle" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- README.md (runbook section draft only)

Contract / Interface:
Runbook per docs/design/8-1 section 4: cp .env.example .env, docker compose up -d --wait (blocks until DB healthy AND storefront answers), admin user creation via docker compose exec app npm run user:create -- --email ... --password ... --name ... (password policy: min 8 chars, 1 letter 1 digit), curl checks. Persistence: down/up cycle must preserve state via named volumes.

Verification Command:
docker compose up -d --wait && curl -sf -o /dev/null -w "storefront %{http_code}\n" http://localhost:3000 && curl -sf -o /dev/null -w "admin %{http_code}\n" http://localhost:3000/admin && docker compose down && docker compose up -d --wait && docker compose ps

Acceptance Criteria:
- [ ] up --wait reaches healthy (both healthchecks pass)
- [ ] storefront 200, /admin 200
- [ ] down + up --wait healthy again (named volumes persist)
- [ ] README runbook section drafted (steps 1-4 of docs/design/8-1 section 4)' \
  --json | jq -r '.id')

T3=$(bd create "Scaffold themes/elune: theme:create, swc build, workspaces, system.theme" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/** (scaffold)
- package.json (workspaces)
- config/default.json (new)

Contract / Interface:
Per docs/design/8-2 section 1. Scaffold: docker compose exec app npm run theme:create elune (name "elune"); then on host: sudo chown -R "$(id -u):$(id -g)" themes/ (container wrote as root). Switch themes/elune/package.json scripts.build to "swc ./src -d dist --copy-files --strip-leading-paths" (plain tsc drops CSS assets). Root package.json workspaces gains "themes/*". Create config/default.json containing {"system": {"theme": "elune"}} (active-theme persistence via repo-committed config; theme:active NOT run - design 8-2 section 1.2, 8-1 D2).

Verification Command:
docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build" && docker compose restart app && curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000

Acceptance Criteria:
- [ ] themes/elune scaffold exists with swc build script
- [ ] workspace linked, both builds green
- [ ] config/default.json committed with system.theme=elune
- [ ] storefront still 200 after restart (scaffold does not break boot)' \
  --json | jq -r '.id')

T4=$(bd create "Theme tokens: twizz styling, palette, category accents, footer cleanup" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/pages/all/TailwindCss.tsx, tailwind.css, shadcn.css
- themes/elune/src/pages/all/GlobalCss.tsx, global.scss

Contract / Interface:
Per docs/design/8-2 sections 1.3-1.4. Copy core styling components via npx evershop theme:twizz (keeps @custom-variant dark). shadcn.css :root overrides (placeholder palette, designer-swappable): --background oklch(0.16 0.02 300), --foreground oklch(0.93 0.01 300), --primary oklch(0.55 0.20 295), --primary-foreground oklch(0.98 0 0), --accent oklch(0.78 0.09 305), --accent-foreground oklch(0.18 0.03 300), --card oklch(0.20 0.02 300), --border oklch(0.30 0.02 300), --radius 0.5rem, category trio --accent-peptides oklch(0.75 0.12 195), --accent-sarms oklch(0.75 0.14 40), --accent-nootropics oklch(0.75 0.12 130), --font-sans system stack. tailwind.css @theme inline maps --color-accent and --font-sans. global.scss: fonts + .card-icons{display:none} (hides core cash icon block in footer) + .elune-lock{overflow:hidden}. Also set themeConfig.copyRight = "© 2026 Elune Labs. All rights reserved." in config/default.json.

Verification Command:
docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build" && docker compose restart app && curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000

Acceptance Criteria:
- [ ] builds green, storefront renders dark-violet palette
- [ ] footer cash icon block gone
- [ ] tokens live in shadcn.css :root; category accent vars present' \
  --json | jq -r '.id')

T5=$(bd create "Wordmark header component" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/pages/all/Wordmark.tsx

Contract / Interface:
Per docs/design/8-2 section 1.4. Master component: export default + export const layout = { areaId: "headerMiddleLeft", sortOrder: 10 }. Renders text wordmark: span with classes font-sans font-bold tracking-[0.35em] text-2xl, content ELUNE (nbsp) LABS, "LABS" in text-accent. No logo file; themeConfig.logo stays unset.

Verification Command:
docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build" && docker compose restart app

Acceptance Criteria:
- [ ] ELUNE LABS wordmark renders in header on storefront pages
- [ ] build green' \
  --json | jq -r '.id')

T6=$(bd create "AgeGate modal with exact copy + elune_age_ok cookie" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/pages/all/AgeGate.tsx

Contract / Interface:
Per docs/design/8-2 section 2. Master component layout { areaId: "body", sortOrder: 20 }. On mount read document.cookie for elune_age_ok: present -> render null. Absent -> fullscreen overlay div role="dialog" aria-modal="true" aria-labelledby="age-gate-title" + document.body.classList.add("elune-lock"). Button "I am 18 or older — Enter": sets document.cookie = "elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax", removes lock class, unmounts. Button "Cancel — Leave": window.location = "https://www.google.com". Modal copy VERBATIM from docs/design/8-2 section 2.3 (title "Are you 18 or older?", research-chemicals paragraph, advisory footnote). Styling via token classes; optional one-line location.pathname.startsWith("/admin") guard.

Verification Command:
Browser: fresh context (cookies cleared) -> modal on http://localhost:3000/; accept -> cookie present (document.cookie), reload -> no modal; /admin loads without modal.

Acceptance Criteria:
- [ ] fresh context shows modal on storefront pages
- [ ] Enter sets elune_age_ok cookie (30d, Lax) and dismisses
- [ ] reload clean; Leave redirects to google
- [ ] /admin and /api unaffected (structural: themes are frontStore-only)' \
  --json | jq -r '.id')

T7=$(bd create "RUO disclaimers + category accent components" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/pages/all/RuoFooter.tsx
- themes/elune/src/pages/productView/RuoNotice.tsx
- themes/elune/src/pages/categoryView/CategoryAccent.tsx

Contract / Interface:
Per docs/design/8-2 sections 1.4 and 2.4. RuoFooter: layout { areaId: "footerBottom", sortOrder: 5 }, muted small text, exact string "For research use only. Not for human consumption." RuoNotice: layout { areaId: "content", sortOrder: 60 }, bordered lavender notice, same string, on product pages. CategoryAccent: layout in categoryView content area; reads category url_key from page context, applies style borderBottomColor: "var(--accent-<url_key>)", fallback var(--accent) for unknown keys.

Verification Command:
docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build" && docker compose restart app

Acceptance Criteria:
- [ ] RUO string in footer on every storefront page
- [ ] RUO notice on product page
- [ ] category title accents: peptides teal, sarms amber, nootropics green; unknown keys fall back to lavender' \
  --json | jq -r '.id')

T8=$(bd create "Theme stage verification: build + compliance smoke" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- none (verification + fix-forward of T3-T7 files)

Contract / Interface:
Stage gate for cluster B2. Run the SPEC section 7 compliance checklist against the composed stack: fresh-context age-gate flow (modal -> cookie -> clean reload), RUO strings present (footer + product page), category accents render, /admin and /api unaffected by theme, storefront 200. Fix any breakage found in the theme files; re-run until green. Then submit for review via scripts/review-submit.sh.

Verification Command:
docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build" && docker compose restart app && curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000

Acceptance Criteria:
- [ ] full build green
- [ ] compliance checklist (SPEC section 7) passes end to end
- [ ] /admin and /api unaffected
- [ ] submitted for review' \
  --json | jq -r '.id')

T9=$(bd create "elune-payments extension: Setting GraphQL fields + resolvers" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql
- extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js
- config/default.json (system.extensions registration)

Contract / Interface:
Per docs/design/8-2 section 3. GraphQL: extend type Setting { cryptoWalletBtc: String cryptoWalletUsdt: String cryptoWalletEth: String cryptoWalletInstructions: String }. Resolvers use core getSetting() with placeholder defaults: crypto_wallet_btc -> "bc1qPLACEHOLDER_REPLACE_ME", crypto_wallet_usdt -> "TPLACEHOLDER_REPLACE_ME", crypto_wallet_eth -> "0xPLACEHOLDER_REPLACE_ME", crypto_wallet_instructions -> default text from docs/design/8-2 section 3.1. Pattern source: modules/cod/graphql/types/CODSetting/CODSetting.resolvers.js @ v2.2.1. Register in config/default.json: "system": { "extensions": [{ "name": "elune-payments", "resolve": "extensions/elune-payments", "enabled": true }] }.

Verification Command:
docker compose restart app && curl -s http://localhost:3000/api/graphql -H "Content-Type: application/json" -d "{\"query\":\"{ setting { cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth } }\"}"

Acceptance Criteria:
- [ ] extension registered and loads without boot errors
- [ ] Setting query returns the 3 wallet fields with placeholder values
- [ ] storefront boots clean with extension enabled' \
  --json | jq -r '.id')

T10=$(bd create "elune-payments admin Settings card" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx

Contract / Interface:
Per docs/design/8-2 section 3.3. Admin component layout { areaId: "paymentSetting", sortOrder: 30 } with 4 InputFields (BTC / USDT / ETH / instructions) bound to the crypto_wallet_* setting keys, saving through the standard admin settings save path. Pattern source: modules/cod/pages/admin/paymentSetting/CODSetting.tsx @ v2.2.1.

Verification Command:
Manual: /admin -> Settings -> Payment shows the 4 fields; change BTC value, save; then curl -s http://localhost:3000/api/graphql -H "Content-Type: application/json" -d "{\"query\":\"{ setting { cryptoWalletBtc } }\"}" reflects the new value.

Acceptance Criteria:
- [ ] admin card renders in Settings -> Payment
- [ ] save persists to the setting table
- [ ] GraphQL reads the updated value' \
  --json | jq -r '.id')

T11=$(bd create "COD payment-step override with crypto wallet blocks" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/pages/checkout/CashOnDelivery.tsx

Contract / Interface:
Per docs/design/8-2 section 4. Copy core modules/cod/pages/frontStore/checkout/CashOnDelivery.tsx @ v2.2.1 into the theme at the same folder+filename (master override). Keep registerPaymentComponent("cod", ...), checkoutButtonRenderer, layout, and the useEffect redirect VERBATIM - order creation path untouched. nameRenderer: drop the base64 cash logo, render setting.codDisplayName text only. formRenderer: extend the GraphQL query with cryptoWalletBtc/cryptoWalletUsdt/cryptoWalletEth/cryptoWalletInstructions and render instructions text + three blocks: "BTC — Bitcoin (native SegWit)", "USDT — TRON (TRC-20)", "ETH — Ethereum (ERC-20)" with the address values.

Verification Command:
Build + restart; walk a cart to the payment step (products from seed or a manual admin-created product); payment step shows crypto display name + 3 wallet blocks, no cash logo, no doorstep copy; placing the order still succeeds.

Acceptance Criteria:
- [ ] payment step renders 3 network-labelled wallet blocks from settings
- [ ] cash logo + doorstep copy gone
- [ ] Place Order path untouched (order created, payment_status pending)' \
  --json | jq -r '.id')

T12=$(bd create "ShippingNote override: TXID re-label" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- themes/elune/src/components/frontStore/checkout/ShippingNote.tsx
- config/default.json (checkout.showShippingNote: true, explicit)

Contract / Interface:
Per docs/design/8-2 section 4.3. Copy core components/frontStore/checkout/ShippingNote.tsx @ v2.2.1 into themes/elune/src/components/frontStore/checkout/. Change ONLY: CardTitle to _("Transaction ID (TXID)") and placeholder to _("Paste your BTC / USDT / ETH transaction ID (hash)"). Mechanics unchanged: checkoutData.note -> cart.shipping_note -> order.shipping_note.

Verification Command:
Build + restart; checkout page shows the TXID-titled note field; submitted text lands on the order (visible in /admin -> Orders, Note field).

Acceptance Criteria:
- [ ] field titled "Transaction ID (TXID)" with crypto placeholder
- [ ] note text reaches order.shipping_note in admin
- [ ] no other behavior of the note component changed' \
  --json | jq -r '.id')

T13=$(bd create "Payment settings bootstrap + no-restart swap verification" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- README.md (admin settings walkthrough step)

Contract / Interface:
Stage gate for cluster B3. Bootstrap data only (no code): enable COD via POST /api/settings {"codPaymentStatus": 1, "codDisplayName": "Crypto Payment (BTC / USDT / ETH)"} and set the 4 crypto_wallet_* placeholder values (admin UI or REST; smoke items 20-21 in docs/design/8-3 section 4). Then verify the owner swap path: change crypto_wallet_btc in /admin -> Settings -> Payment, save, reload the checkout payment step -> new address appears with NO rebuild and NO restart (docs/design/8-2 section 4.4). Document the walkthrough step in README.

Verification Command:
curl -s http://localhost:3000/api/graphql -H "Content-Type: application/json" -d "{\"query\":\"{ setting { codDisplayName cryptoWalletBtc } }\"}" before and after the admin swap.

Acceptance Criteria:
- [ ] COD enabled with crypto display name
- [ ] 4 wallet placeholder settings present
- [ ] address swap lands without rebuild/restart
- [ ] README settings walkthrough step documented' \
  --json | jq -r '.id')

T14=$(bd create "catalog-data.json: 3 categories, 15 products" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- scripts/catalog-data.json

Contract / Interface:
Verbatim content from docs/design/8-3 section 2: categories peptides/sarms/nootropics; 15 products (6 peptides, 5 SARMs, 4 nootropics) with per-size SKUs (BPC157-5MG ... CITICOLINE-500MG), prices 19.99-79.99 USD, qty 100. Schema: {categories: [{name, url_key}], products: [{name, sku, price, category (url_key reference), qty}]}. Attributes deliberately omitted (select-type size silently drops text in 2.2.1); no images field.

Verification Command:
jq -e ".categories | length == 3" scripts/catalog-data.json && jq -e ".products | length == 15" scripts/catalog-data.json && jq -e ".products | map(.sku) | length == (map(.sku) | unique | length)" scripts/catalog-data.json

Acceptance Criteria:
- [ ] valid JSON, 3 categories, 15 products, unique SKUs
- [ ] every product category references a declared url_key
- [ ] content matches docs/design/8-3 section 2' \
  --json | jq -r '.id')

T15=$(bd create "seed-catalog.mjs: auth + category upsert" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- scripts/seed-catalog.mjs

Contract / Interface:
Per docs/design/8-3 section 1. Node ESM, built-in fetch, ZERO dependencies. Env: EVERSHOP_BASE_URL (default http://localhost:3000), ADMIN_EMAIL, ADMIN_PASSWORD (script loads process.env; README documents sourcing .env). Auth: POST /api/user/tokens {email, password} -> data.accessToken, Bearer header; on 401 re-login once and retry the failed request. Category logic: POST /api/graphql query categories(filters: [{key: "url_key", operation: "eq", value: ...}]) { items { uuid url_key } } -> missing: POST /api/categories {name, url_key}; existing: reuse uuid, skip PATCH. Export a module structure that T16 extends (auth helper + category upsert + run loop over data.categories).

Verification Command:
node scripts/seed-catalog.mjs (with a running stack + admin user) creates the 3 categories; second run creates zero duplicates.

Acceptance Criteria:
- [ ] authenticates with admin creds; 401 re-login path present
- [ ] creates missing categories, reuses existing by url_key
- [ ] runs standalone without crashing on the products section (not yet implemented)' \
  --json | jq -r '.id')

T16=$(bd create "seed-catalog.mjs: product upsert + attach + asserts" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- scripts/seed-catalog.mjs (extend T15)

Contract / Interface:
Per docs/design/8-3 section 1. Product logic: POST /api/graphql products(filters: [{key: "sku", operation: "eq", value: ...}]) { items { uuid sku } } -> found: PATCH /api/products/:uuid {price, qty, status: 1}; missing: POST /api/products {name, sku, price, qty, status: 1, visibility: 1, manage_stock: 1, stock_availability: 1, images: []}. Attach EVERY run: POST /api/categories/:category_uuid/products {product_id: <product uuid>} (verified idempotent in 2.2.1; category_id in the create payload is IGNORED by createProduct in 2.2.1 - the attach endpoint is the only wiring). Post-run asserts: 3 categories resolve by url_key; all 15 SKUs resolve; each product attached to its declared category. Any failure: print one line per failure to stderr (SEED FAILURE - N issues) and process.exit(1).

Verification Command:
node scripts/seed-catalog.mjs && node scripts/seed-catalog.mjs (twice, exit 0 both, zero duplicates); then edit a price in catalog-data.json, re-run, confirm PATCH lands.

Acceptance Criteria:
- [ ] creates/updates/attaches all 15 products
- [ ] double run is idempotent (no duplicates)
- [ ] price edit + re-run PATCHes the store
- [ ] assert failures exit non-zero with per-item list' \
  --json | jq -r '.id')

T17=$(bd create "smoke-checkout.mjs: REST checkout + capture flow" -t task -p 1 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- scripts/smoke-checkout.mjs

Contract / Interface:
Implements docs/design/8-3 section 4 steps 16-19 as an automated smoke. Full guest checkout via REST: POST /api/carts -> POST /api/cart/:cart_id/items (SINGULAR /cart/, body {product_id: <uuid>, qty: 1}) -> POST /api/carts/:cart_id/contacts {email} -> POST /api/carts/:cart_id/addresses {address: {address1, city, state, country, postcode, phone}} -> POST /api/carts/:cart_id/shippingMethods {provider_code: "core", method_code: <configured flat rate code - confirm at runtime from the shipping settings or a 400 message>} -> POST /api/carts/:cart_id/paymentMethods {method_code: "cod"} -> POST /api/carts/:cart_id/shippingNotes {note: "TXID: smoke-test-123"} -> POST /api/carts/:cart_id/checkout. Then with admin Bearer: POST /api/cod/captures {order_id: <uuid>} -> 200 + payment_status paid; re-capture same order -> 400 with documented message; capture with nonexistent uuid -> 400. Prints PASS/FAIL per step, exit non-zero on any failure. Reuse the auth helper pattern from seed-catalog.mjs (ADMIN_EMAIL/ADMIN_PASSWORD env).

Verification Command:
node scripts/smoke-checkout.mjs (running stack, COD enabled, at least one product seeded) -> all steps green, exit 0.

Acceptance Criteria:
- [ ] full REST checkout sequence green
- [ ] order created with payment_status pending and TXID note carried
- [ ] capture -> paid; double-capture -> 400; nonexistent order -> 400
- [ ] non-zero exit on any step failure' \
  --json | jq -r '.id')

T18=$(bd create "Ops finish: backup/restore docs, final README, persistence spot-check" -t task -p 2 \
  --parent "$IMPL" --no-inherit-labels \
  --label phase:implement --label implementation \
  -d 'Target Files:
- README.md (final)

Contract / Interface:
Finish cluster B6. README final sections per docs/design/8-1 section 5: backup one-liner (set -a; source .env; set +a; docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > "backups/elune-$(date +%F).sql" - exec -T MANDATORY), restore into fresh volume, upgrade path (backup first, tag bump, pull, up; migrations irreversible; major versions can break themes). Then run the SPEC section 7 persistence check and a backup spot-check.

Verification Command:
mkdir -p backups && set -a && source .env && set +a && docker compose exec -T database pg_dump -U "$DB_USER" "$DB_NAME" > backups/elune-test.sql && head -3 backups/elune-test.sql && docker compose down && docker compose up -d --wait && curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000

Acceptance Criteria:
- [ ] README complete: bring-up, settings, seed, smoke, backup, restore, upgrade
- [ ] dump file has valid SQL header
- [ ] persistence cycle green (catalog + settings + orders survive)
- [ ] all prior smokes still green
- [ ] submitted for review' \
  --json | jq -r '.id')

bd dep add "$T2" "$T1" --type blocks
bd dep add "$T3" "$T2" --type blocks
bd dep add "$T4" "$T3" --type blocks
bd dep add "$T5" "$T4" --type blocks
bd dep add "$T6" "$T4" --type blocks
bd dep add "$T7" "$T4" --type blocks
bd dep add "$T8" "$T5" --type blocks
bd dep add "$T8" "$T6" --type blocks
bd dep add "$T8" "$T7" --type blocks
bd dep add "$T9" "$T2" --type blocks
bd dep add "$T10" "$T9" --type blocks
bd dep add "$T11" "$T4" --type blocks
bd dep add "$T11" "$T9" --type blocks
bd dep add "$T12" "$T4" --type blocks
bd dep add "$T13" "$T10" --type blocks
bd dep add "$T13" "$T11" --type blocks
bd dep add "$T13" "$T12" --type blocks
bd dep add "$T15" "$T2" --type blocks
bd dep add "$T16" "$T14" --type blocks
bd dep add "$T16" "$T15" --type blocks
bd dep add "$T17" "$T13" --type blocks
bd dep add "$T17" "$T16" --type blocks
bd dep add "$T18" "$T8" --type blocks
bd dep add "$T18" "$T17" --type blocks

echo "IMPL=$IMPL"
echo "T1=$T1 T2=$T2 T3=$T3 T4=$T4 T5=$T5 T6=$T6 T7=$T7 T8=$T8"
echo "T9=$T9 T10=$T10 T11=$T11 T12=$T12 T13=$T13 T14=$T14 T15=$T15 T16=$T16 T17=$T17 T18=$T18"
echo "--- implementer frontier (should show T1 + T14) ---"
/home/josh/.omp/agent/skills/beadfinder/scripts/frontier.sh --parent "$IMPL" --persona implementer || true
