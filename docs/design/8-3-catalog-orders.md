# Catalog seed and order data path

`scripts/seed-catalog.mjs` validates the catalogue rows in `scripts/catalog-data.json`, writes categories and products through the EverShop 2.2.1 REST API, indexes Size for every SKU, groups the compound families that carry more than one milligram size for selection in SQL, and creates three CMS pages. `scripts/smoke-checkout.mjs` places one guest order and captures it.

Payment presentation is in [8-2-ui-compliance-payment-grok-unapproved.md](8-2-ui-compliance-payment-grok-unapproved.md).

## 1. How to run the seeder

Run it in the app container. `DB_HOST=database` and `PORT=3000` are set there. The script has no dependency install of its own. It uses built-in `fetch` plus the image's `ajv` and `pg` packages.

```bash
docker compose exec app sh -c '
  ADMIN_EMAIL="admin@elunelabs.example" ADMIN_PASSWORD="ChangeMe123" \
  node /app/scripts/seed-catalog.mjs
'
```

| Variable | Required | Default |
|---|---|---|
| `ADMIN_EMAIL` | yes | none; throws `ADMIN_EMAIL and ADMIN_PASSWORD are required` |
| `ADMIN_PASSWORD` | yes | none |
| `EVERSHOP_BASE_URL` | no | `http://localhost:${PORT:-3000}` |
| `DB_HOST` | no | `localhost` (Compose sets `database` in the app container) |
| `DB_PORT` | no | `5432` |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | for the SQL path | from the container environment |

`requireSecureBaseUrl` throws `EVERSHOP_BASE_URL must use HTTPS unless it targets loopback` unless the protocol is `https:` or the host is `localhost`, `127.0.0.1`, or `[::1]`.

Importing the module does not seed. The runner at the bottom compares `import.meta.url` with `process.argv[1]`.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*

## 2. Run sequence

`run()`:

1. Read and parse `catalog-data.json` and `catalog-schema.json` concurrently from the module URL, so the files beside the script are the ones that load.
2. `validateCatalog(data, schema)` validates the draft-07 shape, then cross-row rules: unique category keys and SKUs, valid product category references, at least two members and unique milligram sizes per family, and a name ending in the declared Size. SKUs are opaque catalogue codes and are not constrained to carry the Size. All validation completes before login or any other network access.
3. `login()` → `POST /api/user/tokens` `{ email, password }` → `data.accessToken`.
4. `applyStoreSettings()`.
5. For each category, `upsertCategory`.
6. For each product, `upsertProduct` then `attachProduct`.
7. `reconcileVariants`.
8. `prune`.
9. `assertSeed`.
10. `applyCmsPages`.

`apiFetch` sends `Authorization: Bearer <token>`. On HTTP 401 it calls `login()` once and retries that request once. On HTTP 429 it waits `retry-after` (else `ratelimit-reset`, else 60 s) and retries up to ten times: 2.2.1 rate-limits the admin API at 120 requests per 60 s per IP (`ratelimit-policy: 120;w=60`), which a full catalog run exceeds.

Failures print `SEED FAILURE: <message>` and set `process.exitCode = 1`. `closeDb()` runs in `finally`. Assertion failures print `SEED FAILURE - N issues` and one `✗` line per failure before throwing.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*

## 3. Why reads go to Postgres

Comments in the seeder, matched by the code around them:

- Category GraphQL filters on this image accept `name`, `status`, `parent`, and `ob`. A `url_key` filter is ignored. `findCategory` loads categories from SQL and matches `url_key` in process.
- Product GraphQL filters are keyed and registered per key: `sku` (`like`, `in`) and `limit` work on both the storefront and the admin-authenticated endpoint, and an unregistered key such as `url_key` is silently ignored — the query then returns unrelated products, which is how an earlier note came to read that filters are ignored.
- `products { items }` returns at most one storefront page of rows (20) unless a `limit` filter says otherwise: `filters: [{key: "limit", operation: eq, value: "100"}]` returned all 84 declared SKUs on both endpoints. The collection also registers `page`. `assertSeed` still resolves declared SKUs through the uncapped DB read, because the collection hides `status = 0` rows and the seeder needs the retired ones too.
- Category collection queries hide `status = 0` rows. After prune, a GraphQL lookup would miss a retired `url_key` and the next create would collide on the unique key.

`db()`, `dbProducts()`, and `dbCategories()` use `pg`. If that client fails, the script logs `db read unavailable` and falls back to GraphQL. Prune then skips. The fallback is only safe under the 20-row cap.

SQL for products joins `product` to `category_description` on `product.category_id`. That column is the single product-to-category link the seeder treats as current for 2.2.1.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*

## 4. Category and product writes

### Category

`upsertCategory({ name, url_key })`:

- Live row with that `url_key`: log `reuse`, return it, do not PATCH the name.
- Retired row: `PATCH /api/categories/:uuid` `{ status: 1, include_in_nav: 1 }`, log `restored`.
- Missing: `POST /api/categories` `{ name, url_key, status: 1, include_in_nav: 1 }`, log `created`.

`status` and `include_in_nav` are sent because this image's `category` columns are NOT NULL and have no defaults.

### Product

`upsertProduct({ name, sku, price, qty }, declaredSkus)` receives one expanded child, not a grouped parent:

- Existing SKU: `PATCH /api/products/:uuid`

```json
{ "price": 39.99, "qty": 100, "status": 1, "stock_availability": 1 }
```

`stock_availability` is `1` when `qty > 0`, else `0`.

- Missing SKU: `POST /api/products`

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

`url_key` is the name lowercased, non-alphanumerics collapsed to `-`, leading and trailing hyphens stripped. The seeder comment states that 2.2.1 `createProduct` does not generate `url_key` from the name and that the middleware rejects a body without it. `group_id: 1` and `package_id: 1` are the image's Default attribute group and Standard Box package, which the create path requires.

Before the `POST`, `parkUrlKey(urlKey, declaredSkus)` reads `product_description.url_key` for a holder: `PRODUCT_URL_KEY_UNIQUE` is enforced regardless of `status`, so a row prune has not retired yet still owns the slug. An undeclared holder is re-keyed to `<url_key>-retired-<lowercased sku>` and prune retires it later in the same run. A declared holder throws — two declared names collide and the data file must change.

The expanded child's `category` is not sent on create. `attachProduct` always `POST`s `/api/categories/:categoryUuid/products` with `{ "product_id": "<product uuid>" }`.

### Variants

`reconcileVariants` runs after every expanded child exists. Every declared variant has a positive milligram `size`; only children of multi-variant parents have `family` and become selectable variants. Inside one transaction:

- `pg_advisory_xact_lock(hashtext('elune-catalog-variants'))`
- Insert attribute `size` / `Size` / `select` / `display_on_frontend = false`, or on conflict update the name and `display_on_frontend` only. Throw if the existing attribute's `type` is not `select`.
- Link that attribute to group 1.
- Clear `variant_group_id` for declared standalone SKUs and for other non-family members of Size-only groups in attribute group 1. Other products' non-Size group assignments and Size indexes on undeclared SKUs remain intact.
- Derive the distinct option strings from every declared Size and reuse or insert each `attribute_option.option_text`; option rows are never deleted because orders may reference them.
- Reconcile each declared SKU to exactly one index for its declared Size, removing only that SKU's other Size indexes.
- For each family, reuse a Size-only group in attribute group 1 whose members are exactly that family's SKUs, or insert one. Set each child's `variant_group_id` and the group's `visibility` to true.
- Delete only empty Size-only groups in attribute group 1; do not delete unrelated variant groups.

`assertSeed` derives its expected options and counts from expanded children. It requires every seeded row to stay `type = 'simple'`, every declared SKU to have exactly its declared milligram Size option, family children to share distinct expected Size-only groups, standalone SKUs to have a null group while retaining their Size value, exactly one `size` attribute and group-1 link, each declared option to exist exactly once, and zero empty Size groups. Unrelated legacy Size options may remain.

### Prune

Live categories and products whose `url_key` or SKU is not declared by the expanded catalog: `PATCH` `{ "status": 0 }`. No `DELETE`. A second run finds nothing further to retire. If the DB read failed, prune logs `prune skipped: db read unavailable` and returns 0.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*

## 5. Store settings and CMS pages

`applyStoreSettings` queries `setting { storeName storeDescription favicon }` and `POST`s `/api/settings` with only the keys that are empty.

| Key | Value written when empty |
|---|---|
| `storeName` | `Elune Labs` |
| `storeDescription` | `Research reference compounds supplied for laboratory work, with a specification record on the products that have one. For research use only.` |
| `favicon` | `/assets/brand/favicons/favicon-512x512.png` |

`applyCmsPages` looks up `cms_page_description.url_key` in SQL. If the page exists it logs `exists, left as-is` and does not PATCH. If it is missing it `POST`s `/api/pages` with `status: 1`, `name`, `url_key`, `meta_title`, and EditorJS `content`.

| `url_key` | `name` | `meta_title` |
|---|---|---|
| `faqs` | FAQs | FAQs |
| `shipping` | Shipping | Shipping |
| `contact` | Contact Us | Contact Us |

Contact body reads `setting.storeEmail`. When that is empty the page says a contact address has not been configured. FAQ and Shipping bodies are the `FAQ_BLOCKS` and `SHIPPING_BLOCKS` arrays in the script: research-use framing, no certificate of analysis, manual crypto with the three rail names, flat rate per order, dispatch after a hand confirmation, supplier fulfilment, no cold-chain claim.

The header and footer link to these three paths. Payments also links to `/faqs`.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs), [`themes/elune/src/data/siteLinks.ts`](../../themes/elune/src/data/siteLinks.ts)*

## 6. Catalog files

`scripts/catalog-data.json` is the commerce list. `scripts/catalog-schema.json` defines its draft-07 shape: non-empty categories require non-empty `name` and `url_key`; non-empty products require non-empty `name`, `sku`, and `category`, a positive milligram `size` such as `5mg`, nonnegative numeric `price`, and nonnegative integer `qty`, with optional non-empty `family`; neither kind accepts additional fields. Specification text is not in these files. It is in `themes/elune/src/data/productSpecs.ts`.

`scripts/catalog-data.example.json` shows real catalog rows: BPC-157 at `5mg` and `10mg` with distinct prices and a shared `family`, GHK-Cu `50mg` whose `100mg` sibling is not in the excerpt, and ARA-290 `10mg`, a single-size row with no `family`. It is an excerpt, not a replacement catalog: keep the other product and category rows when seeding, because `prune` retires omitted live products and categories.

### Categories

| Name | `url_key` |
|---|---|
| GLPs | `glps` |
| Bioregulators | `bioregulators` |
| Recovery | `recovery` |
| GH Releasing | `gh-releasing` |
| Other | `other` |

### Products

All child quantities are 100. Prices are USD numbers, not strings. The list is 84 rows: 70 of them belong to 29 multi-size `family` values (two or more milligram sizes of one compound) and 14 are single rows with no `family`. A row's `name` already carries its size (`BPC-157 5mg`), and `sku` is an opaque catalogue code (`BPC5`, `TR10`, `GHKS0`) — it is not derived from the name or the size, and the seeder does not check it against either.

Per-category row counts:

| Category (`url_key`) | Rows |
|---|---|
| `glps` | 17 |
| `bioregulators` | 17 |
| `recovery` | 18 |
| `gh-releasing` | 11 |
| `other` | 21 |

Neither parent nor variant has an `images` field. The create request still sends `images: []`.

An older three-category list (peptides, SARMs, nootropics, fifteen products) is not this file. `scripts/cut-dag.sh` still describes that older list inside a beads issue body.

*Source: [`scripts/catalog-data.json`](../../scripts/catalog-data.json), [`scripts/catalog-data.example.json`](../../scripts/catalog-data.example.json), [`scripts/catalog-schema.json`](../../scripts/catalog-schema.json), [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*

## 7. Order path the smoke executes

`scripts/smoke-checkout.mjs` is a guest REST checkout against the 2.2.1 handlers. It loads `.env` if present. It refuses to start unless `EVERSHOP_ALLOW_MUTATION=1` and both admin variables are set.

Default SKU is `BPC10`. Override with `EVERSHOP_CHECKOUT_SKU`. The script does not read wallet addresses and does not require a rail to be configured. It pays with method `cod`.

### Sequence

| Step | Request | Assert |
|---|---|---|
| Storefront origin | `GET` storefront `/` | `pageMeta` base URL and `addMineCartItemApi` share the storefront origin |
| Admin login | `POST /api/user/tokens` | `data.accessToken` |
| Create cart | `POST /api/carts` `{ items: [{ sku, qty: 1 }] }` | HTTP 200, `data.cartId` |
| Add item | `POST /api/cart/:cartId/items` `{ sku, qty: 1 }` | HTTP 200; GraphQL cart contains `productSku` |
| Contact | `POST /api/carts/:cartId/contacts` `{ email: "test@example.com" }` | HTTP 200 |
| Shipping address | `POST /api/carts/:cartId/addresses` `{ type: "shipping", address }` | HTTP 200 |
| Billing address | same with `type: "billing"` | HTTP 200 |
| Shipping method | `POST /api/carts/:cartId/shippingMethods` `{ provider_code, method_code }` | HTTP 200 |
| Payment | `POST /api/carts/:cartId/paymentMethods` `{ method_code: "cod" }` | HTTP 200 |
| Note | `POST /api/carts/:cartId/shippingNotes` `{ note: "TXID: smoke-test-123" }` | HTTP 200 |
| Checkout | `POST /api/carts/:cartId/checkout` `{ cart_id, customer: { email } }` | HTTP 200, `payment_status === "pending"`, `shipping_note` equals the note |
| Item snapshot | GraphQL `order(uuid)` | line SKU matches; the six family-member SKUs match price and `variantOptions` Size text |
| Capture | `POST /api/cod/captures` `{ order_id }` | HTTP 200, then `paymentStatus.code === "paid"` |
| Double capture | same body | HTTP 400 |
| Unknown order | `{ order_id: "00000000-0000-0000-0000-000000000000" }` | HTTP 400 |
| Add to cart in Chromium | homepage/catalog card | only the clicked card is busy; `SKIP` when the storefront host is not loopback |

Address object:

```json
{
  "full_name": "Smoke Tester",
  "address_1": "123 Test St",
  "city": "Test City",
  "province": "CA",
  "country": "US",
  "postcode": "90210",
  "telephone": "5551234567"
}
```

The script header records why these shapes differ from an earlier sketch: create-cart requires `items`, add-item takes `{ sku, qty }` on singular `/api/cart/:id/items`, addresses need `type` plus `full_name` / `address_1` / `province` / `telephone`, checkout requires `{ cart_id, customer: { email } }`, and a billing address is required when `grand_total` is above zero.

### Shipping bootstrap

If `cart.availableShippingMethods` is empty, the script creates:

- `POST /api/shippingZones` `{ "name": "Smoke Zone", "countries": ["US"] }`
- `POST /api/shippingProviders/core/methods` `{ "name": "Flat Rate", "is_enabled": true }` (on HTTP 400, retries as `Flat Rate <timestamp>`)
- `POST /api/shippingProviders/core/rates` `{ method_id, zone_id, cost: 5, is_enabled: true }`

A store that already resolves a method skips this. The cost `5` is the smoke's bootstrap value, not a rate in `config/default.json`.

### Browser step

Chromium is resolved from `CHROMIUM_PATH` or `~/.cache/ms-playwright/chromium*/chrome-linux64/chrome`. Launch adds `--no-sandbox` when `CHROMIUM_NO_SANDBOX=1`. The step returns skip text `storefront is not loopback` instead of failing when `EVERSHOP_STOREFRONT_URL` (else `HOME_URL`, else the API base) is not a loopback host.

*Source: [`scripts/smoke-checkout.mjs`](../../scripts/smoke-checkout.mjs)*

## 8. What this path does not do

- It does not delete products or categories.
- It does not write `crypto_wallet_*`, `codPaymentStatus`, or `codDisplayName`.
- It does not overwrite CMS HTML after the first successful create.
- It does not mark an order paid except by `POST /api/cod/captures` in the smoke.
- It does not verify a transaction on chain. Capture is an admin action the smoke performs with the admin token.

*Source: [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs), [`scripts/smoke-checkout.mjs`](../../scripts/smoke-checkout.mjs)*
