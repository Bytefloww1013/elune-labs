# Requirements specification: Elune Labs storefront

This document records the behavior implemented in this repository and in the pinned `evershop/evershop:2.2.1` image where the repo calls it. It is not a backlog.

## 1. Destination

A Docker Compose stack serves a storefront and `/admin`. A guest can browse five categories, place an order, and leave a transaction id on the order note. An admin can replace wallet addresses without a rebuild and can mark the order paid with the image's COD capture route.

Out of scope of the code that is here: a payment gateway, an on-chain watcher, email marketing, a third-party analytics tag in the theme, server-side age verification, and an automated backup scheduler. Backup is the documented `pg_dump` command.

*Source: [`docker-compose.yml`](docker-compose.yml), [`themes/elune/src`](themes/elune/src)*

## 2. Functional requirements

### FR-1 Deployment

- `docker-compose.yml` defines `app` (`evershop/evershop:2.2.1`) and `database` (`postgres:16`).
- The app container sets `NODE_ENV=production`, `DB_HOST=database`, and `PORT=3000`.
- The host publish line is `${BIND_HOST:-127.0.0.1}:${PORT:-3000}:3000`.
- `EVERSHOP_HOME_URL` is `${HOME_URL:-http://localhost:${PORT:-3000}}`.
- Named volumes: `postgres-data`, `media-data`, `public-data`, `evershop-build`, `log-data`.
- Binds: `./themes` and `./extensions` read-write; `./scripts` and `./config` read-only.
- Postgres has a `pg_isready` healthcheck and no published ports. The app waits for `service_healthy` and has its own wget healthcheck against `127.0.0.1:3000`.
- `DB_PASSWORD` uses Compose's required-variable syntax.
- Admin creation is `docker compose exec app npm run user:create -- --email … --password … --name …`. In this image, `isValidPassword` accepts any string of length at least 8.

*Source: [`docker-compose.yml`](docker-compose.yml), [`.env.example`](.env.example)*

### FR-2 Storefront commerce

- Landing page at `/` (`themes/elune/src/pages/homepage/Elune.tsx`).
- Category listings for `glps`, `bioregulators`, `recovery`, `gh-releasing`, and `other`, ordered by `CATEGORY_URL_KEYS`.
- `/all` lists every product, sorted by name in the theme. `/new-releases` lists the six highest `productId` values.
- Product pages show literature (when the SKU has a narrative), a specification table (only when the SKU has a record), and the RUO notice.
- Guest checkout uses the stock EverShop sequence. The smoke drives it over REST, including both a shipping and a billing address.

*Source: [`themes/elune/src/data/categories.ts`](themes/elune/src/data/categories.ts), [`extensions/elune-catalog/src/pages/frontStore/allProducts/route.json`](extensions/elune-catalog/src/pages/frontStore/allProducts/route.json), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

### FR-3 Manual crypto payment

- Orders are placed with method `cod`. The smoke asserts `payment_status` is `pending` and that `shipping_note` equals the submitted note.
- The payment step lists three rails and the order total. Labels: `BTC — Bitcoin (native SegWit)`, `USDT — Ethereum (ERC-20)`, `ETH — Ethereum (ERC-20)`.
- A null address renders `Not configured — contact us before sending.` with no Copy control.
- Shape checks live in `extensions/elune-payments/src/lib/walletAddress.js`. BTC accepts bech32 `bc1…` and legacy base58 `1…` / `3…`. USDT and ETH accept `0x` plus 40 hex digits, either case. Checks are shape checks, not checksum or ownership checks.
- The TXID control is titled `Transaction ID (TXID)`. Placeholder: `Paste your BTC / USDT / ETH transaction ID (hash)`. The value is `checkoutData.note`.
- Admin capture is `POST /api/cod/captures` with JSON `{ "order_id": "<uuid>" }` and a bearer token. The smoke requires HTTP 200 and then `paymentStatus.code === 'paid'`. A second capture, and a capture of `00000000-0000-0000-0000-000000000000`, must return HTTP 400.
- The theme does not contain a function that sets an order paid.

*Source: [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx), [`themes/elune/src/components/frontStore/checkout/ShippingNote.tsx`](themes/elune/src/components/frontStore/checkout/ShippingNote.tsx), [`extensions/elune-payments/src/lib/walletAddress.js`](extensions/elune-payments/src/lib/walletAddress.js), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

### FR-4 Compliance

- Age gate: dialog `role="dialog"` `aria-modal="true"` `aria-labelledby="age-gate-title"`. Title `Are you 18 or older?`. Enter sets the cookie below. Leave links to `https://www.google.com`. Escape does not dismiss the dialog. Focus is moved into the panel and Tab wraps inside it. `document.body` receives class `elune-lock` while the dialog is open.
- Cookie written by Enter: `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax`.
- If `location.pathname` starts with `/admin`, the effect returns without showing the dialog.
- RUO sentence, exact: `For research use only. Not for human consumption.` On the announcement bar, the footer, and the product notice.

*Source: [`themes/elune/src/pages/all/AgeGate.tsx`](themes/elune/src/pages/all/AgeGate.tsx), [`themes/elune/src/pages/all/RuoFooter.tsx`](themes/elune/src/pages/all/RuoFooter.tsx), [`themes/elune/src/pages/productView/RuoNotice.tsx`](themes/elune/src/pages/productView/RuoNotice.tsx)*

### FR-5 Theme

- Package `themes/elune`. Build script: `swc ./src -d dist --copy-files --strip-leading-paths`.
- Active theme is `system.theme` = `elune` in `config/default.json`.
- Presentation includes the landing composition, catalog plates, category accents, footer, age gate, checkout wallet panel, and specification table. Core cart, checkout, and account pages inherit the role tokens in `shadcn.css`.
- Header search and the account icon are theme overrides that render nothing.

*Source: [`themes/elune/package.json`](themes/elune/package.json), [`config/default.json`](config/default.json), [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css)*

### FR-6 Catalog seeding

`scripts/seed-catalog.mjs` plus `scripts/catalog-data.json`:

- Node ESM, built-in `fetch`, plus the `pg` driver that ships in the EverShop image for uncapped reads.
- Requires `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Base URL defaults to `http://localhost:${PORT:-3000}`. HTTP is rejected unless the host is loopback.
- Auth: `POST /api/user/tokens` with `{ email, password }` → `data.accessToken`. On 401, login once and retry the failed request once.
- Categories: create with `{ name, url_key, status: 1, include_in_nav: 1 }`, or `PATCH` a retired row back to `status: 1`. A live match is reused and not renamed.
- Products: create with `name`, `sku`, `price`, `qty`, `status`, `group_id: 1`, `package_id: 1`, `visibility: 1`, `manage_stock: 1`, `stock_availability: 1`, `images: []`, and `url_key` derived from the name. An existing SKU is `PATCH`ed with `price`, `qty`, `status: 1`, and `stock_availability`.
- `category_id` is not sent. Attachment is `POST /api/categories/:uuid/products` with `{ product_id }` on every run.
- Size families are reconciled in SQL inside a transaction that takes `pg_advisory_xact_lock(hashtext('elune-catalog-variants'))`. Products stay `type = 'simple'`.
- Rows that are live but absent from the file are retired with `PATCH` `{ status: 0 }`. The script does not `DELETE` them.
- After that, the script asserts categories, attachment, prices, quantities, simple type, and Size groups. Failures throw. The direct runner prints `SEED FAILURE:` and sets exit code 1.
- `storeName`, `storeDescription`, and `favicon` are posted only for keys that are currently empty.
- CMS pages `faqs`, `shipping`, and `contact` are created if missing and are not updated if present.

`npm run seed` is `evershop seed` and is a different command.

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`package.json`](package.json)*

### FR-7 Admin

- Wallet card on `/admin/setting/payments`, area `paymentSetting`, sort order 30.
- Store name and favicon are EverShop settings. The seeder fills them once when empty. Favicon value when filled by the seeder: `/assets/brand/favicons/favicon-512x512.png`.
- Shipping rates are EverShop shipping-zone data. The smoke creates a US zone, a flat-rate method, and a cost of `5` only when the cart reports no available shipping methods.

*Source: [`extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx`](extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx), [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## 3. Decisions still visible in the tree

| Topic | What the code does |
|---|---|
| Payment | Manual COD plus wallet display. No gateway client in the repo. |
| Runtime | Pinned Compose images, named volumes, Postgres not published. |
| Age gate | Client cookie. No server middleware in this repo. |
| Catalog | JSON file plus REST seeder, not `evershop seed`. |
| Theme | Custom theme `elune`, tokens in CSS, raster logo. |
| USDT | ERC-20 shape only. TRON strings resolve to null. |
| Public URL | `HOME_URL` → `EVERSHOP_HOME_URL`. Default bind is loopback. |

*Source: [`docker-compose.yml`](docker-compose.yml), [`extensions/elune-payments/src/lib/walletAddress.js`](extensions/elune-payments/src/lib/walletAddress.js)*

## 4. Data contracts

### Category create — `POST /api/categories`

```json
{
  "name": "Recovery",
  "url_key": "recovery",
  "status": 1,
  "include_in_nav": 1
}
```

### Product create — `POST /api/products`

```json
{
  "name": "BPC-157 5mg",
  "sku": "BPC5",
  "price": 40,
  "qty": 100,
  "status": 1,
  "group_id": 1,
  "package_id": 1,
  "visibility": 1,
  "manage_stock": 1,
  "stock_availability": 1,
  "images": [],
  "url_key": "bpc-157-5mg"
}
```

`url_key` is `name` lowercased, with runs of non-alphanumerics replaced by a single hyphen, trimmed. Size is not part of this body. `reconcileVariants` writes attribute `size` (`type` `select`) and the variant group after the products exist.

### Product update — `PATCH /api/products/:uuid`

```json
{ "price": 40, "qty": 100, "status": 1, "stock_availability": 1 }
```

### Catalog file

`scripts/catalog-data.json`:

```json
{
  "categories": [{ "name": "GLPs", "url_key": "glps" }],
  "products": [{
    "name": "BPC-157 5mg",
    "sku": "BPC5",
    "family": "bpc-157",
    "size": "5mg",
    "price": 40,
    "category": "recovery",
    "qty": 100
  }]
}
```

`family` and `size` are optional. Products without them must not end up in a variant group. The live file has five categories and 84 products, 22 of which have a specification record in `themes/elune/src/data/productSpecs.ts`; the other 62 render no specification section.

### Age-gate cookie

```
elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax
```

### Wallet settings

| Key | GraphQL field | Resolver |
|---|---|---|
| `crypto_wallet_btc` | `cryptoWalletBtc` | Bitcoin shape or `null` |
| `crypto_wallet_usdt` | `cryptoWalletUsdt` | ERC-20 shape or `null` |
| `crypto_wallet_eth` | `cryptoWalletEth` | ERC-20 shape or `null` |
| `crypto_wallet_instructions` | `cryptoWalletInstructions` | stored value, or the default sentence when the row is absent |

Default instructions string:

```
Send the order total to one of the addresses above, then paste your transaction ID (TXID) into the TXID note field before placing the order. We confirm on-chain and ship after 1 network confirmation.
```

### Store settings filled only when empty

| Key | Value |
|---|---|
| `storeName` | `Elune Labs` |
| `storeDescription` | `Research reference compounds supplied for laboratory work, with a specification record on the products that have one. For research use only.` |
| `favicon` | `/assets/brand/favicons/favicon-512x512.png` |

### Checkout bodies the smoke sends

Create cart `POST /api/carts`:

```json
{ "items": [{ "sku": "BPC10", "qty": 1 }] }
```

Add item `POST /api/cart/:cartId/items` (singular `cart`):

```json
{ "sku": "BPC10", "qty": 1 }
```

Addresses `POST /api/carts/:cartId/addresses`, once with `type: "shipping"` and once with `type: "billing"`:

```json
{
  "type": "shipping",
  "address": {
    "full_name": "Smoke Tester",
    "address_1": "123 Test St",
    "city": "Test City",
    "province": "CA",
    "country": "US",
    "postcode": "90210",
    "telephone": "5551234567"
  }
}
```

Shipping method `POST /api/carts/:cartId/shippingMethods`:

```json
{ "provider_code": "<from availableShippingMethods>", "method_code": "<from availableShippingMethods>" }
```

Payment `POST /api/carts/:cartId/paymentMethods`:

```json
{ "method_code": "cod" }
```

Note `POST /api/carts/:cartId/shippingNotes`:

```json
{ "note": "TXID: smoke-test-123" }
```

Checkout `POST /api/carts/:cartId/checkout`:

```json
{ "cart_id": "<cartId>", "customer": { "email": "test@example.com" } }
```

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`scripts/catalog-data.json`](scripts/catalog-data.json), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs), [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`](extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js)*

## 5. HTTP surface this repo calls

Base URL is the app origin. Admin calls send `Authorization: Bearer <accessToken>` from `POST /api/user/tokens`.

| Purpose | Request |
|---|---|
| Admin token | `POST /api/user/tokens` |
| Admin session (runbook) | `POST /admin/user/login` JSON `{ email, password }` |
| Save settings | `POST /api/settings` (private) |
| Read settings | `POST /api/graphql` query `setting { … }` |
| Create category | `POST /api/categories` |
| Update category | `PATCH /api/categories/:uuid` |
| Attach product | `POST /api/categories/:uuid/products` `{ product_id }` |
| Create product | `POST /api/products` |
| Update product | `PATCH /api/products/:uuid` |
| Create CMS page | `POST /api/pages` |
| Cart through checkout | paths in section 4 |
| Capture | `POST /api/cod/captures` `{ order_id }` (private) |
| Shipping bootstrap (smoke only, if no method resolves) | `POST /api/shippingZones`, `POST /api/shippingProviders/core/methods`, `POST /api/shippingProviders/core/rates` |

GraphQL product and category filters in this image are not used to find a SKU or `url_key`. The seeder reads `product` and `category` with SQL. The product GraphQL connection returns at most 20 rows and ignores `page`.

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## 6. Invariants

- Seeded products remain `type = 'simple'`. A family shares one visible Size group in attribute group 1. A product without `family` has no variant group and no Size value.
- Re-running the seeder does not duplicate SKUs or `url_key`s and does not rewrite existing CMS pages or non-empty store name, description, or favicon.
- Prune never deletes. A declared category that was retired is restored to `status: 1`.
- Capture is the transition the smoke treats as pending → paid. The theme has no other transition.
- The age gate does not add the cookie unless Enter is used, and it does not render the dialog for an `/admin` path.
- Extension production loads require `dist/`. Compose sets `NODE_ENV=production`.

*Source: [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs), [`docker-compose.yml`](docker-compose.yml)*

## 7. Verification

| Check | Command or test |
|---|---|
| Compose file | `docker compose config` |
| Stack | `docker compose up -d --wait`, then HTTP 200 on `/` |
| Wallet shapes | `npm test` in `extensions/elune-payments` (`node --test tests/`) |
| Catalog | `node /app/scripts/seed-catalog.mjs` inside the app container; second run stays exit 0 |
| Checkout | `EVERSHOP_ALLOW_MUTATION=1` plus admin credentials, `node scripts/smoke-checkout.mjs` |
| Age gate and RUO | browser with cookies cleared; `/admin` has no theme dialog |

The wallet test file includes the string `TPLACEHOLDER_REPLACE_ME` as an input that must not resolve as USDT. That asserts the predicate. It does not write the database.

*Source: [`extensions/elune-payments/package.json`](extensions/elune-payments/package.json), [`extensions/elune-payments/tests/walletAddress.test.mjs`](extensions/elune-payments/tests/walletAddress.test.mjs), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*
