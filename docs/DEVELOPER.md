# Architecture

Elune Labs is an EverShop 2.2.1 storefront running in Docker Compose with Postgres 16.
This document covers the system architecture, custom extensions, and where to change
common fields.

## Table of contents

1. [System architecture](#system-architecture)
2. [Docker Compose services](#docker-compose-services)
3. [Theme system](#theme-system)
4. [Extension system](#extension-system)
5. [Configuration reference](#configuration-reference)
6. [Where to change fields](#where-to-change-fields)
7. [Seed catalog](#seed-catalog)
8. [Key files map](#key-files-map)

---

## System architecture

```
                    +-------------------+
                    |   Browser (SPA)   |
                    +---------+---------+
                              |
                    HTTP :PORT (3010)
                              |
                    +---------v---------+
                    |  app container    |
                    |  (evershop 2.2.1) |
                    |                   |
                    |  +---------------+|
                    |  | themes/elune  ||-- bind mount (rw)
                    |  | (custom theme)||
                    |  +---------------+|
                    |  +---------------+|
                    |  | extensions/    ||-- bind mount (rw)
                    |  | elune-payments||
                    |  +---------------+|
                    |  +---------------+|
                    |  | config/       ||-- bind mount (ro)
                    |  | default.json  ||
                    |  +---------------+|
                    |  +---------------+|
                    |  | .evershop/    ||-- named volume
                    |  | build/        ||
                    |  +---------------+|
                    +---------+---------+
                              |
                    +---------v---------+
                    |  database         |
                    |  (postgres 16)    |
                    |  postgres-data    |
                    |  (named volume)   |
                    +-------------------+
```

### Build pipeline

```
themes/elune/src/**.tsx  --(SWC)-->  themes/elune/dist/**.js
extensions/elune-payments/src/**  --(SWC)-->  extensions/elune-payments/dist/**
                                              |
EverShop core + theme dist/ + extension dist/  --(webpack)-->  .evershop/build/frontStore/
                                              |
                                     served by Node SSR + client hydration
```

1. `npm --prefix themes/elune run build` — SWC compiles `src/` to `dist/` (preserving `export const layout` via `.swcrc` jsc.target es2022).
2. `npm --prefix extensions/elune-payments run build` — same SWC pass for the payments extension's `src/` → `dist/`. (NODE_ENV=production makes the extension loader read `dist/`.)
3. `npm run build` — EverShop webpack bundles core + theme `dist/` into `.evershop/build/` (client chunks + server entry).
4. Restart the app to serve the new build.

Use `npm --prefix <dir> run build`, **not** `npm run build --workspace=<dir>`: `/app/package.json` is the image manifest, it is not bind-mounted and declares no `workspaces`, so `--workspace=` fails with `No workspaces found` on a fresh container. `--prefix` resolves `swc` from `/app/node_modules/.bin` and needs no image mutation.

### Why three build steps?

EverShop's theme system works via component override: the theme's `dist/` files are
picked up by EverShop's webpack build and merged into the client/server bundles.
SWC handles the TypeScript/JSX compilation (theme *and* extension — the extension
loader reads its `dist/` under `NODE_ENV=production`); webpack handles the bundling
and code-splitting. All three steps are needed.

---

## Docker compose services

| Service    | Image                    | Purpose                          | Volume type         |
|------------|--------------------------|----------------------------------|--------------------|
| app        | `evershop/evershop:2.2.1` | Node 20 web server + build       | bind + named mixed |
| database   | `postgres:16`            | Postgres 16 database             | named (postgres-data) |

### Volume mounts (app container)

| Host path       | Container path       | Mode | Purpose                          |
|-----------------|----------------------|------|----------------------------------|
| `./themes`      | `/app/themes`        | rw   | Theme source (SWC compiles in dist/) |
| `./extensions`  | `/app/extensions`    | rw   | Extension source (SWC compiles in dist/) |
| `./scripts`     | `/app/scripts`       | ro   | Seed catalog script               |
| `./config`      | `/app/config`        | ro   | `config/default.json`             |
| —               | `/app/.evershop`     | named| Build artifacts, sessions         |
| —               | `/app/media`         | named| Product images                    |
| —               | `/app/public`        | named| Built static assets               |
| —               | `/app/.log`          | named| Application logs                  |

### Environment variables (.env)

| Variable              | Required | Default     | Notes                                    |
|-----------------------|----------|-------------|------------------------------------------|
| `DB_PASSWORD`         | yes      | —           | Postgres password (also sets DB user)    |
| `DB_HOST`             | no       | `database`  | Overridden by compose `environment`      |
| `DB_PORT`             | no       | `5432`      |                                          |
| `DB_NAME`             | no       | `evershop`  |                                          |
| `DB_USER`             | no       | `evershop`  |                                          |
| `DB_SSLMODE`          | no       | `disable`   |                                          |
| `PORT`                | no       | `3000`      | Container + published host port (`3010` on this host) |
| `BIND_HOST`           | no       | `0.0.0.0`   | Published host address; `100.123.49.43` = tailnet only |
| `HOME_URL`            | no       | `http://100.123.49.43:$PORT` | Absolute base URL baked into links/forms/emails (`EVERSHOP_HOME_URL`); unset ⇒ EverShop falls back to `http://localhost:$PORT` |
| `JWT_ADMIN_SECRET`    | yes*     | —           | Admin JWT signing (needed for seed auth) |
| `JWT_ADMIN_REFRESH_SECRET` | yes* | —          | Admin JWT refresh                        |

\* Required for seed-catalog.mjs admin auth.

---

## Theme system

The `themes/elune/` directory overrides EverShop core components via the
`@components` resolution path. When EverShop resolves a component import like
`@components/frontStore/checkout/ShippingNote`, it first checks the active
theme's `dist/` directory, then falls back to core.

### Theme structure

```
themes/elune/
  package.json          # name: "elune", build script (swc)
  .swcrc                # SWC config: jsc.target es2022 + tsx parser
  src/
    pages/
      all/              # Components on EVERY storefront page
        TailwindCss.tsx  #   Imports tailwind.css (areaId: head, sort 1)
        GlobalCss.tsx    #   Imports global.scss (areaId: head, sort 5)
        shadcn.css       #   Elune palette tokens (:root vars)
        tailwind.css     #   Tailwind import + @theme inline mapping
        global.scss      #   Body styles, footer cleanup, age-gate lock
        AgeGate.tsx      #   18+ modal with 30-day cookie (areaId: body, sort 20)
        Wordmark.tsx     #   "ELUNE LABS" header logo (areaId: headerMiddleLeft, sort 10)
        RuoFooter.tsx    #   "For research use only" footer text (areaId: footerBottom, sort 5)
      productView/       # Components on product pages only
        RuoNotice.tsx    #   Bordered RUO notice (areaId: content, sort 60)
      categoryView/      # Components on category pages only
        CategoryAccent.tsx  # Category accent bar (areaId: content, sort 5)
      homepage/          # Components on homepage only
        Elune.tsx        #   Placeholder welcome banner
    components/
      frontStore/
        checkout/
          ShippingNote.tsx  # TXID re-label of core order-note field
```

### Layout areas

EverShop places theme components into named areas via `export const layout = { areaId, sortOrder }`:
- `head` — CSS/JS injected into `<head>` (TailwindCss, GlobalCss)
- `body` — top of body (AgeGate)
- `headerMiddleLeft` — header (Wordmark)
- `footerBottom` — footer (RuoFooter)
- `content` — main content area (RuoNotice, CategoryAccent)

### .swcrc — critical config

The theme's `.swcrc` sets `jsc.target: "es2022"` which preserves `export const layout`
in the compiled output. Without this, SWC downlevels to `export var layout`, and
EverShop's `buildEntry` regex (which matches `export const layout` only) silently
drops ALL theme components from the client bundle.

---

## Extension system

### elune-payments extension

```
extensions/elune-payments/
  package.json     # name: "elune-payments", type: module
  src/
    graphql/
      types/
        Setting/
          CryptoWalletSetting.graphql     # extends type Setting with 4 fields
          CryptoWalletSetting.resolvers.js # resolvers read from setting table
  dist/           # compiled output (mirrors src/)
```

### GraphQL schema extension

`CryptoWalletSetting.graphql` extends the EverShop `Setting` type:

```graphql
extend type Setting {
  cryptoWalletBtc: String
  cryptoWalletUsdt: String
  cryptoWalletEth: String
  cryptoWalletInstructions: String
}
```

### Resolvers

The resolvers read from the EverShop `setting` table (key-value store). Each field
maps to a `crypto_wallet_*` setting key with a placeholder fallback:

| GraphQL field              | Setting key                   | Fallback value              |
|----------------------------|-------------------------------|-----------------------------|
| `cryptoWalletBtc`          | `crypto_wallet_btc`           | `bc1qPLACEHOLDER_REPLACE_ME` |
| `cryptoWalletUsdt`         | `crypto_wallet_usdt`           | `TPLACEHOLDER_REPLACE_ME`   |
| `cryptoWalletEth`          | `crypto_wallet_eth`            | `0xPLACEHOLDER_REPLACE_ME`  |
| `cryptoWalletInstructions` | `crypto_wallet_instructions`  | Default instructions text   |

### Adding new extension fields

1. Add the field to `CryptoWalletSetting.graphql`.
2. Add a resolver in `CryptoWalletSetting.resolvers.js` that reads the matching `crypto_wallet_*` key.
3. Register in `config/default.json` under `system.extensions` (already done for elune-payments).
4. Rebuild the extension plus the app:
   `docker compose exec app npm --prefix extensions/elune-payments run build && docker compose exec app npm run build`.
5. Set the value via admin Settings or `POST /api/settings`.

### How extensions load

EverShop discovers extensions from `config/default.json` → `system.extensions[]`.
Each entry has `{ name, resolve, enabled }`. The `resolve` path is relative to the
app root. Extensions mount read-write in the container so the SWC build can write `dist/`.

---

## Configuration reference

### config/default.json

```json
{
  "system": {
    "theme": "elune",
    "extensions": [
      {
        "name": "elune-payments",
        "resolve": "extensions/elune-payments",
        "enabled": true
      }
    ]
  },
  "themeConfig": {
    "copyRight": "© 2026 Elune Labs. All rights reserved."
  },
  "checkout": {
    "showShippingNote": true
  }
}
```

| Key                              | Type    | Purpose                                      |
|----------------------------------|---------|----------------------------------------------|
| `system.theme`                   | string  | Active theme name (must match themes/<name>)  |
| `system.extensions`              | array   | Enabled extensions                            |
| `system.extensions[].name`       | string  | Extension package name                        |
| `system.extensions[].resolve`    | string  | Path to extension dir (relative to app root)  |
| `system.extensions[].enabled`    | boolean | Toggle extension on/off                        |
| `themeConfig.copyRight`           | string  | Footer copyright text                          |
| `checkout.showShippingNote`       | boolean | Show the order-note (TXID) field at checkout  |

> **Merge, never overwrite.** `config/default.json` is read-only in the container
> and host-writable. When adding keys, merge into the existing JSON — do not
> replace the whole file.

### .env

| Key                      | Example                              | Notes                                    |
|--------------------------|--------------------------------------|------------------------------------------|
| `PORT`                   | `3010`                               | Container + host port (must match)        |
| `BIND_HOST`              | `0.0.0.0`                            | Published host address (`0.0.0.0` = LAN + tailnet; tailnet-only: `100.123.49.43`) |
| `HOME_URL`               | `http://100.123.49.43:3010`          | Browse address; compose maps it to `EVERSHOP_HOME_URL` (absolute links) |
| `DB_PASSWORD`            | `EluneLabs-Store-3010`               | Postgres password                         |
| `DB_HOST`                | `database`                           | Compose service name (auto-set)           |
| `DB_PORT`                | `5432`                               |                                          |
| `DB_NAME`                | `evershop`                           |                                          |
| `DB_USER`                | `evershop`                           |                                          |
| `DB_SSLMODE`             | `disable`                            |                                          |
| `JWT_ADMIN_SECRET`       | (hex string)                         | Admin JWT signing                         |
| `JWT_ADMIN_REFRESH_SECRET`| (hex string)                        | Admin JWT refresh                         |

---

## Where to change fields

### Colors and theme tokens

**File:** `themes/elune/src/pages/all/shadcn.css` — `:root` block

| CSS variable           | Current value              | Controls                         |
|------------------------|----------------------------|----------------------------------|
| `--background`         | `oklch(0.16 0.02 300)`     | Page background (near-black violet) |
| `--foreground`         | `oklch(0.93 0.01 300)`     | Body text (off-white)            |
| `--primary`            | `oklch(0.55 0.20 295)`     | Buttons, links, prices (dark violet) |
| `--primary-foreground` | `oklch(0.98 0 0)`          | Text on primary buttons          |
| `--accent`             | `oklch(0.78 0.09 305)`     | Badges, hover, unknown-key fallback (lavender) |
| `--accent-foreground`  | `oklch(0.18 0.03 300)`     | Text on accent surfaces          |
| `--card`               | `oklch(0.20 0.02 300)`     | Card backgrounds                |
| `--card-foreground`    | `oklch(0.93 0.01 300)`     | Text on dark cards              |
| `--border`             | `oklch(0.30 0.02 300)`     | Border color                    |
| `--radius`             | `0.5rem`                   | Border radius for all components |
| `--accent-peptides`     | `oklch(0.75 0.12 195)`     | Peptides category accent (teal)  |
| `--accent-sarms`       | `oklch(0.75 0.14 40)`      | SARMs category accent (amber)    |
| `--accent-nootropics`  | `oklch(0.75 0.12 130)`     | Nootropics category accent (green) |

After changing colors: rebuild theme + app, then restart.

### RUO disclaimer text

**Footer (all pages):** `themes/elune/src/pages/all/RuoFooter.tsx`
**Product page notice:** `themes/elune/src/pages/productView/RuoNotice.tsx`

Both render the exact string: `For research use only. Not for human consumption.`
Change the text in the JSX return of each component.

### Age gate copy

**File:** `themes/elune/src/pages/all/AgeGate.tsx`

The modal title, body text, button labels, and cookie duration (30 days) are
all in this single component. The cookie name is `elune_age_ok`.

### TXID field labels

**File:** `themes/elune/src/components/frontStore/checkout/ShippingNote.tsx`

- CardTitle: `_('Transaction ID (TXID)')`
- Placeholder: `_('Paste your BTC / USDT / ETH transaction ID (hash)')`

The `checkoutData.note -> cart.shipping_note -> order.shipping_note` flow is
unchanged from EverShop core — only the labels are different.

### Copyright text

**File:** `config/default.json` — `themeConfig.copyRight`

Set the value to the desired copyright string. No rebuild needed (config is
read at runtime), but a restart may be required for the new value to appear.

### Crypto wallet addresses

Set via admin Settings or REST API:

```bash
# Set wallet addresses via REST (need admin JWT)
curl -X POST http://localhost:3010/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt>" \
  -d '{"crypto_wallet_btc":"bc1q...","crypto_wallet_usdt":"T...","crypto_wallet_eth":"0x...","crypto_wallet_instructions":"Send the order total..."}'
```

Or via admin UI: `/admin` -> Settings -> Payment -> Crypto Wallet fields.

Resolver fallbacks (in `extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`)
show placeholder values until real addresses are set in the `setting` table.

### Category accent colors

**File:** `themes/elune/src/pages/all/shadcn.css`

The `CategoryAccent.tsx` component reads the category's `urlKey` from page
context and applies `borderBottomColor: var(--accent-<url_key>, var(--accent))`.
Unknown url_keys fall back to `--accent` (lavender).

To add a new category accent: add `--accent-<url_key>` to `:root` in shadcn.css.

### Footer cash icons

**File:** `themes/elune/src/pages/all/global.scss`

```scss
.card-icons { display: none; }
```

Hides the core Visa/MC/PayPal icon block in `footerBottom`. Remove this rule
to restore the payment icons.

### COD payment display name

Set via admin Settings or REST:

```bash
curl -X POST http://localhost:3010/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-jwt>" \
  -d '{"codDisplayName":"Crypto Payment (BTC / USDT / ETH)","codPaymentStatus":1}'
```

---

## Seed catalog

**Script:** `scripts/seed-catalog.mjs`
**Data:** `scripts/catalog-data.json`

The seeder creates 3 categories (peptides, sarms, nootropics) and 15 products
(6 peptides, 5 SARMs, 4 nootropics) with prices. It authenticates as admin via
`POST /api/user/tokens`, upserts categories by `url_key`, creates products with
`url_key + group_id + package_id`, attaches products to categories, and patches
prices.

### Running the seeder

```bash
# Set admin credentials (or use env defaults)
export ADMIN_EMAIL="admin@elunelabs.example"
export ADMIN_PASSWORD="ChangeMe123"
export EVERSHOP_BASE_URL="http://localhost:3010"  # match your PORT

docker compose exec app node /app/scripts/seed-catalog.mjs
```

Idempotent: re-running upserts existing records without creating duplicates.
The script asserts success and exits 1 on failure.

### Host gotchas

- **Port**: stack runs on 3010 on this host (host :3000 is OpenChamber).
  Replace `localhost:3000` in any docs/scripts with the live port.
- **Remote access**: `docker-compose.yml` publishes on `${BIND_HOST:-0.0.0.0}`,
  so the storefront is already reachable from the tailnet at
  `http://100.123.49.43:3010` (or whatever `PORT` is). Set `BIND_HOST=100.123.49.43`
  in `.env` to publish on the tailnet only. The app also needs the tailnet
  address as its absolute base URL (`EVERSHOP_HOME_URL`, fed from `HOME_URL`,
  default `http://100.123.49.43:$PORT`) — without it every link points at
  `http://localhost:$PORT` and a remote browser loops back to itself. Scripts
  (`seed-catalog.mjs`, `smoke-checkout.mjs`) keep working on `localhost` when run
  on this host **as long as `BIND_HOST` is the default `0.0.0.0`** — a
  tailnet-only bind takes `localhost` away, so use the tailnet URL everywhere
  (runbook curls included); from another machine set
  `EVERSHOP_BASE_URL=http://100.123.49.43:3010`.
- **No host sudo**: reclaim root-owned files in themes/ via
  `docker compose exec app chown -R $(id -u):$(id -g) /app/themes`.
- **Restart**: `docker compose restart app` may fail. Use
  `docker compose exec app kill -TERM 1; sleep 2; docker compose start app`.
  Never kill while a build is running.
- **config/default.json**: host-writable (josh-owned). MERGE keys, never overwrite.

---

## Key files map

| File                                          | Purpose                                    |
|-----------------------------------------------|--------------------------------------------|
| `config/default.json`                         | Theme, extensions, copyright, checkout config |
| `docker-compose.yml`                          | Service definitions, volumes, healthchecks |
| `.env`                                        | DB password, port, JWT secrets              |
| `themes/elune/package.json`                   | Theme npm workspace (build: swc)            |
| `themes/elune/.swcrc`                          | SWC config (es2022 target — critical)       |
| `themes/elune/src/pages/all/shadcn.css`       | Elune color palette (:root CSS vars)        |
| `themes/elune/src/pages/all/tailwind.css`     | Tailwind import + @theme inline mapping     |
| `themes/elune/src/pages/all/global.scss`      | Body styles, footer cleanup, age-gate lock |
| `themes/elune/src/pages/all/AgeGate.tsx`      | 18+ modal with 30-day cookie               |
| `themes/elune/src/pages/all/Wordmark.tsx`     | "ELUNE LABS" header logo                   |
| `themes/elune/src/pages/all/RuoFooter.tsx`    | RUO footer disclaimer (all pages)          |
| `themes/elune/src/pages/productView/RuoNotice.tsx` | RUO notice (product pages)            |
| `themes/elune/src/pages/categoryView/CategoryAccent.tsx` | Category accent bar               |
| `themes/elune/src/pages/homepage/Elune.tsx`   | Homepage placeholder banner                |
| `themes/elune/src/components/frontStore/checkout/ShippingNote.tsx` | TXID re-label of order note |
| `extensions/elune-payments/package.json`     | Extension package definition                |
| `extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql` | GraphQL schema extension |
| `extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js` | Wallet address resolvers |
| `scripts/seed-catalog.mjs`                    | Category + product seeder                  |
| `scripts/catalog-data.json`                   | Seed data (15 products)                     |
| `docs/design/8-1-deployment.md`               | Deployment design doc                       |
| `docs/design/8-2-ui-compliance-payment.md`    | UI/compliance/payment design doc            |
| `docs/design/8-3-catalog-orders.md`           | Catalog/orders design doc                   |
