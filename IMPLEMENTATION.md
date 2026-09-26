# Implementation: Elune Labs storefront

What is in the tree, and how it is built. Behavior contracts are in [SPEC.md](SPEC.md). Operator commands are in [README.md](README.md).

## Repository layout

| Path | Role |
|---|---|
| `docker-compose.yml` | App and Postgres. |
| `.env.example` | Committed environment template. `.env` is gitignored. |
| `config/default.json` | Theme, extensions, copyright config, shipping-note flag. Read-only bind. |
| `package.json` | Host manifest `evershop-docker`. Dependency `@evershop/evershop` `2.2.1`. Workspace `themes/*`. Scripts call the EverShop CLI. Not mounted into the container. |
| `themes/elune` | Storefront theme. `src/` is TypeScript. `public/` is served assets. `dist/` is SWC output and gitignored. |
| `extensions/elune-payments` | Wallet settings. `dist/` is loaded when `NODE_ENV=production` and is tracked. |
| `extensions/elune-catalog` | Routes `/all` and `/new-releases`. `dist/` is tracked. |
| `scripts/seed-catalog.mjs` | Validated catalog, Size index and variants, store settings, CMS pages. |
| `scripts/catalog-data.json` | Five categories, 84 products; every product declares a positive milligram Size. 29 multi-size families hold 70 of the rows, the other 14 SKUs are standalone. |
| `scripts/catalog-schema.json` | Draft-07 catalog shape, including positive `mg` Size syntax, validated before login. |
| `scripts/smoke-checkout.mjs` | REST checkout, capture, and one headless add-to-cart check. |
| `scripts/restart.sh` | `kill -TERM 1` in the app container, sleep 2, `docker compose start app`. No shebang. |
| `scripts/cut-dag.sh` | Beads issue cutter. The issue bodies still describe `${PORT}:${PORT}` publishing and a peptides/SARMs/nootropics catalog. Do not treat those bodies as the current contract. |

*Source: [`package.json`](package.json), [`docker-compose.yml`](docker-compose.yml), [`.gitignore`](.gitignore), [`scripts/cut-dag.sh`](scripts/cut-dag.sh)*

## Config

`config/default.json`:

```json
{
  "system": {
    "theme": "elune",
    "extensions": [
      { "name": "elune-payments", "resolve": "extensions/elune-payments", "enabled": true },
      { "name": "elune-catalog", "resolve": "extensions/elune-catalog", "enabled": true }
    ]
  },
  "themeConfig": { "copyRight": "© 2026 Elune Labs. All rights reserved." },
  "checkout": { "showShippingNote": true }
}
```

The footer line a shopper sees is not this copyright key. `RuoFooter.tsx` renders `© 2026 Elune Labs · Prices in USD`. `chrome.scss` removes the core footer grid that would otherwise show the theme-config copyright and card marks.

*Source: [`config/default.json`](config/default.json), [`themes/elune/src/pages/all/RuoFooter.tsx`](themes/elune/src/pages/all/RuoFooter.tsx)*

## Compose facts that differ from older notes

| Older note | Current file |
|---|---|
| Ports `"${PORT:-3000}:${PORT:-3000}"` | `"${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000"` |
| Healthcheck uses `$$PORT` | Healthcheck uses `http://127.0.0.1:3000/` |
| No `extensions` bind | `./extensions:/app/extensions` read-write |
| No `HOME_URL` | `EVERSHOP_HOME_URL: "${HOME_URL:-http://localhost:${PORT:-3000}}"` |
| Extensions not mentioned | `NODE_ENV: production` so the image reads each extension's `dist/` |
| `.env.example` without bind or home URL | Also `BIND_HOST=127.0.0.1` and `HOME_URL=http://localhost:3000` |

App state paths are named volumes. Source paths are binds. There is no `version:` key and no custom network.

*Source: [`docker-compose.yml`](docker-compose.yml), [`.env.example`](.env.example)*

## Theme

Scaffold package name `elune`, private, `"type": "module"`. `tsconfig.json` targets ES2018, `jsx: react`, `outDir: dist`, `rootDir: src`. SWC (`.swcrc`) parses TSX and targets `es2022`. The npm build does not run `tsc`.

Styles enter the page through head components:

| Component | Area | Sort | Loads |
|---|---|---|---|
| `TailwindCss.tsx` | `head` | 1 | `tailwind.css` |
| `GlobalCss.tsx` | `head` | 5 | `global.scss` |
| `CatalogCss.tsx` | `head` | 6 | `catalog.scss` |

`chrome.scss` is imported by `Nav.tsx`. `homepage.scss` is imported by `Elune.tsx`. `checkout.scss` is imported by `ShippingNote.tsx` and the checkout components.

Token values are the `:root` block in `themes/elune/src/pages/all/shadcn.css`. Components do not introduce a second hex palette. Two shadows are literal `rgba` in SCSS: the age-gate sheet in `chrome.scss` (`rgba(22, 35, 60, 0.22)`) and the review card in `homepage.scss` (`rgba(0, 0, 0, 0.22)`).

### Area map

| File | `areaId` | `sortOrder` | Renders |
|---|---|---|---|
| `pages/all/Announce.tsx` | `headerTop` | 10 | RUO line and `Prices in USD · Guest checkout` |
| `pages/all/Wordmark.tsx` | `headerMiddleLeft` | 10 | Raster logo link |
| `pages/all/Logo.tsx` | `headerMiddleCenter` | 10 | `null` (keeps the core logo query) |
| `pages/all/Nav.tsx` | `headerMiddleCenter` | 20 | Seven links and the Shop `<details>` |
| `pages/all/SearchBox.tsx` | `headerMiddleRight` | 5 | `null` |
| `pages/all/CustomerIcon.tsx` | `headerMiddleRight` | 10 | `null` |
| `pages/all/MiniCartIcon.tsx` | `headerMiddleRight` | 20 | Cart pill, `Shop all`, phone menu |
| `pages/all/FooterNav.tsx` | `footerMiddleCenter` | 10 | Brand column and three link columns |
| `pages/all/RuoFooter.tsx` | `footerBottom` | 5 | RUO line and copyright line |
| `pages/all/AgeGate.tsx` | `body` | 20 | 18+ dialog |
| `pages/homepage/Elune.tsx` | `content` | 10 | Landing composition |
| `pages/allProducts/AllProducts.tsx` | `content` | 10 | Alphabetical catalog |
| `pages/newReleases/NewReleases.tsx` | `content` | 10 | Six newest products |
| `pages/categoryView/CatalogueHeading.tsx` | `afterCategoryInfo` | 5 | Visually hidden `h2` |
| `pages/productView/ProductDescription.tsx` | `productSingleDescription` | 15 | Literature |
| `pages/productView/ProductSpecs.tsx` | `productSingleDescription` | 20 | Specification table |
| `pages/productView/RuoNotice.tsx` | `content` | 60 | Product RUO notice |
| `pages/checkout/CashOnDelivery.tsx` | `checkoutFormAfter` | 10 | Registers `cod` |
| `pages/checkoutSuccess/CustomerInfo.tsx` | `checkoutSuccessPageLeft` | 10 | Customer block without the core green check |
| `pages/checkoutSuccess/ConfirmationStatus.tsx` | `checkoutSuccessPageLeft` | 20 | Status, payment status, TXID |

There is no `CategoryAccent.tsx`. Category color on the home strip is `.cat--<urlKey>` in `homepage.scss`. Plate identity color is chosen in `ProductListItemRender.tsx` from the first segment of the product URL via `categoryUrlKeyFromProductUrl`.

Shared data modules: `src/data/categories.ts`, `siteLinks.ts`, `productSpecs.ts`, `productLiterature.ts`. The two record maps are keyed by SKU: 22 of the 84 SKUs, across 9 compounds, carry both a sourced specification record and a literature narrative, and the sizes of one compound share that compound's single record. The other 62 SKUs render no specification and no description section, never an empty table or heading. Blends carry no record, because no single molecule's record is true of a blend.

Core-component overrides that keep upstream behavior and add an accessible name or a heading level: `PasswordField.tsx` (reveal button name; uses `lucide-react` `Eye` / `EyeClosed`), `Slider.tsx` (`getAriaLabel`), `DefaultPriceFilterRender.tsx` (group and thumb labels), `ShoppingCartEmpty.tsx` (heading level on `/cart`), `SearchProducts.tsx` (missing `h2` on search results), `CategoryProducts.tsx` (category grid), `DefaultVariantSelectorRender.tsx` (variant selector).

`ProductListItemRender.tsx` is the catalog plate: cutaway SVG, price, Add to cart, View. Add-to-cart mutations are serialized through a module-level promise so overlapping saves do not drop sibling lines. The homepage passes `index` starting at 2 so the featured plates are numbered after Plate 01.

Icon use that is not an authored SVG path: `Copy` in `CashOnDelivery.tsx`, `NotebookPen` in `ShippingNote.tsx`, and the eye icons in `PasswordField.tsx`, all from `lucide-react`. Header cart, chevron, menu, and arrows are inline SVG.

*Source: [`themes/elune/src`](themes/elune/src), [`themes/elune/package.json`](themes/elune/package.json), [`themes/elune/.swcrc`](themes/elune/.swcrc)*

## Payments extension

```
extensions/elune-payments/
  src/lib/walletAddress.js
  src/graphql/types/Setting/CryptoWalletSetting.graphql
  src/graphql/types/Setting/CryptoWalletSetting.resolvers.js
  src/pages/admin/paymentSetting/CryptoWalletSetting.tsx
  tests/walletAddress.test.mjs
  dist/          # production load path
```

Resolvers do not call `getSetting` and do not substitute a placeholder address. `railAddress` returns `row.value.trim()` only when the predicate matches. Instructions return the stored value when the row exists, including an empty string, and otherwise the default sentence in the resolver.

The admin component's `query` selects the four GraphQL fields. Inputs are named `crypto_wallet_btc`, `crypto_wallet_usdt`, `crypto_wallet_eth`, and `crypto_wallet_instructions`. Validation allows blank or a matching address.

Tests run with `node --test tests/` from the extension directory. They import `src/lib/walletAddress.js` and the resolver, not the database.

*Source: [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`](extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js), [`extensions/elune-payments/tests/walletAddress.test.mjs`](extensions/elune-payments/tests/walletAddress.test.mjs)*

## Catalog extension

Two route files and two meta middleware files. Meta uses `getContextValue` / `setContextValue` from `@evershop/evershop/graphql/services` and merges into `pageInfo` so it does not drop `canonicalUrl` or other fields already set. Titles: `All Products`, `New Releases`.

The theme binds by folder name: `pages/allProducts` and `pages/newReleases`.

*Source: [`extensions/elune-catalog/src/pages/frontStore/allProducts/meta.js`](extensions/elune-catalog/src/pages/frontStore/allProducts/meta.js), [`extensions/elune-catalog/src/pages/frontStore/newReleases/meta.js`](extensions/elune-catalog/src/pages/frontStore/newReleases/meta.js)*

## Seeder

Direct execution is guarded by `import.meta.url === pathToFileURL(process.argv[1]).href`. Importing the module does not seed. `run()` concurrently loads `catalog-data.json` and `catalog-schema.json`, then calls `validateCatalog(data, schema)` before login or other network access. Schema and cross-row validation must pass before it runs:

1. `login`
2. `applyStoreSettings`
3. `upsertCategory` for each category
4. `upsertProduct` then `attachProduct` for each product
5. `reconcileVariants`
6. `prune`
7. `assertSeed`
8. `applyCmsPages`

Database connection uses `DB_HOST` (default `localhost`), `DB_PORT` (default 5432), `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Inside the app container those variables are set and `DB_HOST` is `database`. Category and product lookup reads the DB first, uncapped, because the GraphQL product connection stops at 20 rows and the category connection ignores a `url_key` filter (and drops retired rows). If `pg` cannot connect, the lookup falls back to a GraphQL scan that cannot see retired rows and cannot see products past the first 20.

The admin API is rate limited at 120 requests / 60 s, and a full 84-product run issues more than that. An HTTP 429 waits out the advertised `retry-after` / `ratelimit-reset` window (`60` s when neither header is present) and retries, up to 10 attempts, instead of failing the run. A 401 logs in once and retries that request once.

A create derives `url_key` from the name (lowercased, non-alphanumerics collapsed to `-`, ends stripped), because 2.2.1 `createProduct` does not generate one. `PRODUCT_URL_KEY_UNIQUE` is enforced regardless of `status`, so `parkUrlKey` reads `product_description.url_key` first and re-keys an undeclared holder to `<url-key>-retired-<lowercased sku>`; prune retires that holder later in the same run. A declared SKU holding the key means two declared names collide: the run throws.

`reconcileVariants` inserts attribute code `size` if needed, requires `type = 'select'`, links it to attribute group 1, and gives every seeded product exactly the positive milligram Size index declared in the JSON file. Only products with `family` build or reuse a Size-only `variant_group`; standalone products retain a null `variant_group_id` and their Size index. Options and assertions are derived from the catalog rather than a hardcoded list. Size indexes are reconciled only for declared SKUs; undeclared products retain theirs. Empty Size groups are deleted, and option rows are never deleted because orders may reference them. Assertions require each declared option exactly once but allow unrelated legacy options.

CMS page body is an EditorJS envelope:

```json
[{
  "id": "elune-content-row",
  "size": 12,
  "columns": [{
    "id": "elune-content-column",
    "size": 12,
    "data": { "blocks": [] }
  }]
}]
```

Blocks are `{ "type": "paragraph", "data": { "text" } }` and `{ "type": "header", "data": { "text", "level": 2 } }`. Contact copy includes `storeEmail` when that setting is non-empty, and otherwise says no address is configured.

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs)*

## Checkout smoke

`scripts/smoke-checkout.mjs` calls `process.loadEnvFile()` and ignores a missing `.env`. It throws before any network call when `EVERSHOP_ALLOW_MUTATION` is not `1` or admin credentials are missing. `EVERSHOP_BASE_URL` must be HTTPS or loopback.

Steps, in order, each printed `PASS` or `FAIL`:

1. Storefront HTML `baseUrl` and cart API origin match `EVERSHOP_STOREFRONT_URL` (or `HOME_URL`, or the API base).
2. Admin login.
3. Select SKU (`EVERSHOP_CHECKOUT_SKU`, default `BPC10`).
4. `POST /api/carts` with `items: [{ sku, qty: 1 }]`.
5. `POST /api/cart/:id/items` with `{ sku, qty: 1 }`, then GraphQL confirms the line.
6. Contacts `{ email: "test@example.com" }`.
7. Shipping address, then billing address. Billing is required because the order total is above zero.
8. Shipping method. If none resolve, create zone `Smoke Zone` / `US`, method `Flat Rate` (or `Flat Rate <timestamp>` on HTTP 400), rate `cost: 5`.
9. Payment method `cod`.
10. Shipping note `TXID: smoke-test-123`.
11. Checkout body `{ cart_id, customer: { email } }`. Assert pending and the note.
12. Order item snapshot. For the six family-member SKUs, assert unit price and `variantOptions` Size text.
13. `POST /api/cod/captures` and GraphQL `paymentStatus.code === 'paid'`.
14. Second capture expects HTTP 400.
15. Capture of a nil UUID expects HTTP 400.
16. Headless Chromium: only the clicked catalog card goes busy. Returns `{ skip: 'storefront is not loopback' }` otherwise.

Known variant prices in the smoke match `catalog-data.json`: `BPC5`/`BPC10` at 40/70, `TB5`/`TB10` at 90/150, `CND5`/`CND10` at 90/140.

*Source: [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs), [`scripts/catalog-data.json`](scripts/catalog-data.json)*

## Build and load

```bash
docker compose exec app npm --prefix themes/elune run build
docker compose exec app npm --prefix extensions/elune-payments run build
docker compose exec app npm --prefix extensions/elune-catalog run build
docker compose exec app npm run build
```

The image extension loader (`dist/bin/extension/index.js` in `evershop/evershop:2.2.1`) uses `extensions/<name>/dist` when `isProductionMode()` is true (`NODE_ENV === 'production'`). A missing `dist` directory exits the process. Development mode would read `src` and still record `dist` as the path; this Compose file does not set development mode.

After a webpack build, restart with `scripts/restart.sh` or an equivalent recreate, then wait for the wget healthcheck.

*Source: [`docker-compose.yml`](docker-compose.yml), [`themes/elune/package.json`](themes/elune/package.json), [`extensions/elune-payments/package.json`](extensions/elune-payments/package.json), [`extensions/elune-catalog/package.json`](extensions/elune-catalog/package.json)*
