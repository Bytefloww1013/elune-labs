# 8.3 — Catalog Seed Script & Order Data Path

> **Ticket:** elune-labs-tvg.8.3
> **Subsystem:** Catalog seeding (FR-6) + order payment lifecycle (FR-3, FR-7)
> **Status:** Verified against EverShop **v2.2.1** source (pinned image tag). Main-branch divergences noted explicitly.
> **Depends on:** SPEC.md §2 (FR-6, FR-3, FR-7), §4 (domain schemas), §5 (API shapes)

---

## 1. Seed Script Design

### Runtime: Node (built-in `fetch`) — not bash+curl

**Chosen:** `scripts/seed-catalog.mjs` — plain ESM, no dependencies, uses Node built-in `fetch()`.

**Rationale (rejected options):**

| Option | Verdict | Why |
|---|---|---|
| Node `fetch` (MJS) | ✅ | JSON is native; per-item error reporting trivial; `process.exit(1)` on failures; same Node 20 that ships in `evershop/evershop:2.2.1` (`FROM node:20-alpine` — verified Dockerfile). No `jq` dependency. |
| bash + curl + jq | ✗ | Brittle quoting; `jq` not guaranteed in Alpine or dev host; JSON error payloads from EverShop vary by route; per-item failure list requires string mangling. |
| Python | ✗ | Extra runtime; curl-based equivalent is same complexity with no benefit. |

**Verified fact:** `evershop/evershop:2.2.1` Dockerfile = `node:20-alpine`; built-in `fetch` is stable since Node 18. Host-run also safe (Node 18+ standard on dev machines). Script runs as a plain HTTP client against `http://localhost:3000` — no filesystem coupling with the container; runs from host or inside container identically.

### File Layout

```
scripts/
  seed-catalog.mjs     ← runner (auth, upsert, assert)
  catalog-data.json    ← declarative payload (SPEC §4 shape)
```

**Execution:**
```bash
# From host (preferred — HTTP-only, no mount needed):
node scripts/seed-catalog.mjs

# Or inside the container (if repo is mounted):
docker compose exec app node scripts/seed-catalog.mjs
```

**Environment (all optional, sane defaults):**
```
EVERSHOP_BASE_URL   — default: http://localhost:3000
ADMIN_EMAIL         — default: admin@evershop.com
ADMIN_PASSWORD      — default: admin123 (override in CI/secrets)
```

### Authentication Flow

```
POST /api/user/tokens  { email, password }
  → 200 { data: { accessToken, refreshToken } }
  → Bearer token for all subsequent calls
  → On 401: re-login ONCE (fresh POST /api/user/tokens), retry the failed request
  → If login fails on retry: exit non-zero with error
```

**Design choice — 401 → re-login, not refresh:**

The 2.2.1 source confirms `POST /api/user/token/refresh` exists and accepts `{refreshToken}` → new accessToken. However, the seed script is a short-lived batch (~30 requests); the refresh token introduces a second credential to manage for no benefit. Re-login with email+password on 401 is one extra request per token expiry (~15 min default), which never hits during a seed run. This also means the script only needs two secrets (email, password), not three.

### Idempotency: GET-before-POST + PATCH update

**Chosen strategy: query first, then create-or-update.** Rejected POST-then-handle-conflict.

| Approach | Verdict | Why |
|---|---|---|
| GET-before-POST + PATCH | ✅ | Deterministic; reads existing state; can update price/qty to match `catalog-data.json` (data file stays authoritative). |
| POST-then-handle-conflict | ✗ | Duplicate-sku error message varies; no UUID in error body (can't PATCH without UUID); duplicate url_key error path is a different service (`assertUrlKeyAvailable`). Requires two distinct error parsers for the same logical outcome. |

**Query mechanism:** REST mutation endpoints only exist in 2.2.1 — no GET list routes for products or categories. All reads go through GraphQL:

- **Product by SKU:** `POST /api/graphql` (public storefront schema, no auth needed)
  ```graphql
  query { products(filters: [{ key: "sku", operation: "eq", value: "<SKU>" }]) { items { uuid sku } } }
  ```
  *Exact filter syntax → smoke-test item #2.*

- **Category by url_key:** `POST /api/graphql`
  ```graphql
  query { categories(filters: [{ key: "url_key", operation: "eq", value: "<url_key>" }]) { items { uuid url_key } } }
  ```

**Logic per product:**
1. Query GraphQL for existing product by SKU.
2. If found → PATCH `/api/products/:uuid` with `{ price, qty, status: 1 }` (keep price/qty current from data file).
3. If not found → POST `/api/products` (create payload below).
4. POST `/api/categories/:category_uuid/products` with `{ product_id: <product uuid> }` — idempotent by design (2.2.1 handler returns 200 "Product is assigned to the category" on duplicate).

**Logic per category:**
1. Query GraphQL for existing category by url_key.
2. If found → use existing UUID; skip PATCH (name/url_key stable, never changes in seed).
3. If not found → POST `/api/categories` (name, url_key).

**Why PATCH for products:** Re-running after a price change in `catalog-data.json` should update the store. The data file is the single source of truth; PATCH makes that truth land.

### Category-Product Attach: Verified Idempotent (2.2.1)

`POST /api/categories/:category_id/products` (body: `{ product_id: <uuid> }`, path: category uuid) — the handler checks for existing assignment and returns **200 success** on duplicate (source verified: `addProducts.js` in 2.2.1 `catalog/api/addProductToCategory/`). Safe to call every run.

**Important:** In 2.2.1, `category_id` on the product creation payload is **ignored** by `createProduct.ts` (no category handling in the service). The only way to attach a product to a category is via the attach endpoint above. (Main branch refactored this; pinned 2.2.1 is what we ship.)

### Post-Run Assertions

After all creates/updates, the script asserts:

1. **The five categories exist** with the expected `url_key` values (`glps`, `bioregulators`, `recovery`, `gh-releasing`, `other`).
2. **Every product exists** — every SKU in `catalog-data.json` must resolve to an existing product (query per SKU via GraphQL).
3. **Each product is attached** to its declared category — query the product's category membership via admin GraphQL.
4. **Exit code non-zero** with a per-item failure list on any mismatch. Printed to stderr, one line per failure.

```text
SEED FAILURE — 2 issues found:
  ✗ SKU BPC157-5MG: not found after create
  ✗ Category 'recovery': expected url_key 'recovery', got none (product 4 not attached)
```

---

## 2. Catalog Data: `catalog-data.json`

### Schema (matches SPEC §4)

```json
{
  "categories": [
    { "name": "<display name>", "url_key": "<kebab-case>" }
  ],
  "products": [
    {
      "name": "<product name>",
      "sku": "<UPPER-KEBAB>",
      "price": 39.99,
      "category": "<url_key of parent category>",
      "qty": 100
    }
  ]
}
```

**Field notes:**
- `price` — numeric, > 0, USD; EverShop stores as `decimal(12,4)`.
- `category` — references a `categories[].url_key` (not an ID); script resolves at runtime.
- `url_key` — omitted per product; EverShop auto-generates from `name` (lowered, spaces→dashes).
- `attributes` — **omitted deliberately.** In 2.2.1, the `size` attribute is type `select` (pre-seeded options: XXL/XL/SM). A text value like `"5mg"` hits `parseInt("5mg")` → NaN → option not found → silently skipped. No benefit; size is encoded in product name + SKU. Documented deviation from SPEC §4 payload sketch (where it was illustrative, not binding).
- `images` — `[]` (empty array, passed to POST). See §2.1 below.
- `manage_stock`, `status`, `visibility`, `stock_availability` — set to `1` in the script (not in JSON; never changes). Data file stays minimal.

### Full Placeholder Catalog

> **Superseded (design-time artifact).** The catalog below is the **design-stage draft**. The live file that
> ships is `scripts/catalog-data.json` and it differs: **five categories** (`glps`, `bioregulators`, `recovery`,
> `gh-releasing`, `other`), **14 peptides-only products**, prices **$29.99–$79.99**, qty 100 each. The
> design-stage SARMs and Nootropics categories and their products were dropped — the storefront sells research
> reference peptides only, and the five categories in PRODUCT.md are the catalog. The JSON below is kept as the
> record of what the design stage proposed; where it disagrees with `scripts/catalog-data.json`, the live file
> wins.

**Draft shape — 3 categories, 15 products, $19.99–$79.99, qty 100 each (do not build from this list).**

```json
{
  "categories": [
    { "name": "Peptides",   "url_key": "peptides" },
    { "name": "SARMs",      "url_key": "sarms" },
    { "name": "Nootropics", "url_key": "nootropics" }
  ],
  "products": [
    {
      "name": "BPC-157 5mg",
      "sku": "BPC157-5MG",
      "price": 39.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "BPC-157 10mg",
      "sku": "BPC157-10MG",
      "price": 59.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "TB-500 5mg",
      "sku": "TB500-5MG",
      "price": 49.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "TB-500 10mg",
      "sku": "TB500-10MG",
      "price": 79.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "CJC-1295 (No DAC) 5mg",
      "sku": "CJC1295-5MG",
      "price": 44.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "Ipamorelin 5mg",
      "sku": "IPAMORELIN-5MG",
      "price": 42.99,
      "category": "peptides",
      "qty": 100
    },
    {
      "name": "Ostarine (MK-2866) 10mg",
      "sku": "OSTARINE-10MG",
      "price": 34.99,
      "category": "sarms",
      "qty": 100
    },
    {
      "name": "LGD-4033 5mg",
      "sku": "LGD4033-5MG",
      "price": 39.99,
      "category": "sarms",
      "qty": 100
    },
    {
      "name": "RAD-140 10mg",
      "sku": "RAD140-10MG",
      "price": 44.99,
      "category": "sarms",
      "qty": 100
    },
    {
      "name": "Cardarine (GW-501516) 10mg",
      "sku": "CARDARINE-10MG",
      "price": 39.99,
      "category": "sarms",
      "qty": 100
    },
    {
      "name": "MK-677 15mg",
      "sku": "MK677-15MG",
      "price": 44.99,
      "category": "sarms",
      "qty": 100
    },
    {
      "name": "Alpha-GPC 300mg",
      "sku": "ALPHA-GPC-300MG",
      "price": 29.99,
      "category": "nootropics",
      "qty": 100
    },
    {
      "name": "L-Theanine 200mg",
      "sku": "L-THEANINE-200MG",
      "price": 19.99,
      "category": "nootropics",
      "qty": 100
    },
    {
      "name": "Phenylpiracetam 100mg",
      "sku": "PHENYLPIRACETAM-100MG",
      "price": 34.99,
      "category": "nootropics",
      "qty": 100
    },
    {
      "name": "Citicoline 500mg",
      "sku": "CITICOLINE-500MG",
      "price": 27.99,
      "category": "nootropics",
      "qty": 100
    }
  ]
}
```

### Image Handling

**v1: no product images.** `images: []` passed to create/update. EverShop shows a default placeholder (SVG "no image" box) when no image is set.

**Upgrade path (when images exist):**
1. Drop PNG/JPG files into `media/catalog/product/` (via admin upload or host copy into the bind-mounted volume).
2. Add `"images": ["catalog/product/filename.jpg"]` to the product entry in `catalog-data.json`.
3. Re-run the seed script — PATCH updates the images field.
4. Script can optionally verify image files exist before PATCHing (a `--strict` flag that fails if a path in the JSON doesn't resolve to a file).

---

## 3. Order Data Path: COD in EverShop 2.2.1

### 3.1 Payment Method Configuration

| Setting | Key | Default | Source |
|---|---|---|---|
| COD enabled | `codPaymentStatus` | `0` (disabled) | Admin → Settings → Payment toggle (`CODSetting.tsx` in v2.2.1) |
| Display name | `codDisplayName` | `"Cash on Delivery"` | Admin → Settings → Payment text field |
| Config override | `system.cod.status` | — | `config/default.json` or env `SYSTEM__COD__STATUS` |

**To enable:** Admin → Settings → Payment → toggle `codPaymentStatus` to 1; set `codDisplayName` to "Cryptocurrency (manual)" (or similar; wording customizable by the store owner).

**Alternative (config-file):** `config/default.json` → `{ "system": { "cod": { "status": 1 } } }` — takes priority over the DB setting if present (verified in `cod/bootstrap.ts` validator).

**Note:** `codPaymentStatus` is read during cart checkout validation (the validator checks it every time the customer selects the method). Admin capture does not re-check this toggle.

### 3.2 Order Lifecycle (2.2.1 — pinned)

```
checkout (payment_method = 'cod')
  → createOrder → payment_status: "pending" (default global status)
  → admin reads TXID from order.shipping_note
  → admin verifies on-chain
  → Capture button click → POST /api/cod/captures { order_id: <uuid> }
  → payment_status: "paid"
  → payment_transaction row inserted (payment_action: "capture", transaction_type: "offline")
  → order_activity row inserted ("Customer paid using cash.")
  → fulfill (create shipment) — only after paid
```

**Verified facts from `codCapturePayment/[bodyParser]capture.js` (v2.2.1):**

- **Route:** `POST /api/cod/captures` — access: `private` (admin Bearer required)
- **Body:** `{ "order_id": "<order uuid>" }`
- **Validation:** order must exist with `payment_method = 'cod'` AND `payment_status = 'pending'`
- **On failure (not found / not pending):** `400 INVALID_PAYLOAD` → `{ error: { status: 400, message: "Requested order does not exist or is not in pending payment status" } }`
- **On success:** `200 OK` → `{ data: {} }` (empty data object)

**Capture transactions recorded:**
```sql
-- payment_transaction row
payment_transaction_order_id = order.order_id
amount                       = order.grand_total
currency                     = order.currency
payment_action               = 'capture'
transaction_type             = 'offline'
-- no transaction_id column value (2.2.1 insert omits it; main branch adds one)
```

```sql
-- order_activity row
order_activity_order_id = order.order_id
comment                 = 'Customer paid using cash.'
customer_notified       = 0
```

### 3.3 Divergence: v2.2.1 vs. EverShop Main

| Aspect | v2.2.1 (pinned) | main (2.3+) |
|---|---|---|
| COD payment statuses | `pending` → `paid` (global defaults) | `cod_pending` → `cod_captured` (method-specific, registered in `cod/bootstrap.ts`) |
| Capture route | `POST /api/cod/captures` (COD-only) | `POST /api/orders/:id/capture` (unified, all methods) |
| CaptureButton | `codCapturePayment` route ID | Core `captureOrder` route ID |
| Transaction ID | not recorded (column omitted from insert) | `cod-capture-{uuid}-{timestamp}` |
| Order activity | hardcoded "Customer paid using cash." | dynamic "Captured {amount} {currency}. Transaction ID: {id}" |

**Impact on this project:** None during v1 — we pin 2.2.1. This table exists solely to flag that upgrading to a later EverShop version will require adjusting the seed script's capture call path and the admin documentation. (The design slice for deployment should record this as a known upgrade friction point.)

### 3.4 TXID Capture via Order Note

**Mechanism:** The checkout page's "Order Note" field (visible when `checkout.showShippingNote` config is `true`, which is the default).

**REST path during checkout:**
```
POST /api/carts/:cart_id/shippingNotes   { "note": "TXID: ab12cd34..." }
  → cart.shipping_note = "TXID: ab12cd34..."
  → on order creation, orderCreator copies cart.shipping_note → order.shipping_note
```

**In admin:** Order detail page → shows `shipping_note` as the "Note" field. Owner reads this to find the TXID.

**In storefront:** `checkoutSuccess` page displays the note back to the customer as confirmation.

### 3.5 Admin Confirm-Payment Checklist

The store owner performs this sequence for each paid order:

1. **Open order** → `/admin` → Orders → click the order.
2. **Read TXID** → from the "Note" field (order.shipping_note).
3. **Verify on-chain** → open a block explorer for the relevant network:
   - **BTC:** paste TXID in [mempool.space](https://mempool.space) or [blockchain.com](https://blockchain.com); confirm ≥ 1 confirmation, amount matches `grand_total`.
   - **USDT (Ethereum, ERC-20):** paste TXID in [etherscan.io](https://etherscan.io); confirm the transfer is a **USDT (ERC-20) token transfer** — not a native ETH transfer to the same address — with amount matching `grand_total` (USDT is 6-decimal; the transferred amount should match `grand_total × 10⁶`). Allow ≥ 12 confirmations.
   - **ETH:** paste TXID in [etherscan.io](https://etherscan.io); confirm ≥ 12 confirmations, amount matches `grand_total`.
4. **Click "Capture Payment"** → button is only rendered when `paymentStatus.code === 'pending' && paymentMethod === 'cod'`.
5. **Status changes to Paid** → payment_status = "paid"; offline transaction recorded.
6. **Fulfill** → create shipment via admin → mark shipped. **Never before step 5** (enforced by EverShop: CaptureButton only renders when status is `pending` + `cod`; capture route rejects non-pending orders).

**Two things this checklist does not do, and no documentation may claim it does.** Verification is performed by
hand by the owner: nothing here is automated, and no surface may state that a payment is detected, credited or
confirmed automatically. And this checklist is a procedure, not a guarantee — an order stays `pending` until
step 4 actually happens.

**Rail change — USDT is Ethereum (ERC-20), not TRON.** The step-3 explorer for USDT is **Etherscan**
(Tronscan is no longer part of the procedure), and the payout address for that rail is an Ethereum wallet. The
retired TRON address cannot be reused: while `crypto_wallet_usdt` holds it, the checkout renderer resolves the
rail to `null` and shows USDT as unavailable, so no customer can send to it. See 8-2 §3.1 for the resolver rule
and the owner's configuration step.

---

## 4. Smoke-Test Checklist: Confirm Against Running API

These items answer the question: *What exact calls should we run first during implementation to confirm our assumptions match the live 2.2.1 API?*

Each is phrased as a command + expected result. Run in order; any failure stops and informs the implementation.

### Authentication

| # | Call | Expected | Risk if wrong |
|---|---|---|---|
| 1 | `POST /api/user/tokens { email, password }` | `200 → { data: { accessToken, refreshToken } }` | Script can't authenticate; verify credentials |
| 2 | `GET /api/admin/products` with `Authorization: Bearer <token>` | `200` (or `404` if route not exposed as GET) — just confirm the token is accepted by a private route | Token format/schema mismatch |
| 3 | Expire a token (wait 15 min or use a bad token) → `POST /api/products` with stale Bearer | `401` → confirm error body shape matches `{ error: { message: "..." } }` or similar | Re-login logic can't parse the 401 body |

### GraphQL Query Endpoint

| # | Call | Expected | Risk if wrong |
|---|---|---|---|
| 4 | `POST /api/graphql { query: "{ categories { items { uuid url_key name } } }" }` | `200 → { data: { categories: { items: [...] } } }` — public, no auth | Storefront GraphQL path is different in 2.2.1; adjust URL |
| 5 | `POST /api/graphql { query: "{ products(filters:[{key:\"sku\",operation:\"eq\",value:\"BPC157-5MG\"}]) { items { uuid sku name price } } }" }` | `200 → { data: { products: { items: [{ uuid, sku, name, price }] } } }` after first seed run | Filter syntax (`key`/`operation`/`value` shape) — adjust if 2.2.1 uses different filter model |
| 6 | `POST /api/admin/graphql` with Bearer + same products query | `200` with same fields | Admin GraphQL path (`/admin/graphql`) confirmed in 2.2.1; public path might be sufficient for all seed reads |

### Product CRUD

| # | Call | Expected | Risk if wrong |
|---|---|---|---|
| 7 | `POST /api/products { name: "Smoke Test", price: 10, sku: "SMOKE-TEST-001", qty: 1 }` (with Bearer) | `200 → { data: { product_id, uuid, sku: "SMOKE-TEST-001" } }` — product created | Required field mismatch; confirm `name`+`price` are sufficient |
| 8 | `POST /api/products` with same SKU (`SMOKE-TEST-001`) | `400` with message containing "SKU" and "already" | Idempotency logic depends on this error being detectable |
| 9 | `PATCH /api/products/:uuid { price: 12.50 }` (the UUID from step 7) | `200 → { data: { price: 12.50 } }` | PATCH route may expect different body shape or field names |
| 10 | `DELETE /api/products/:uuid` (cleanup) | `200` — confirm the test product is removed | Cleanup path |

### Category CRUD + Attach

| # | Call | Expected | Risk if wrong |
|---|---|---|---|
| 11 | `POST /api/categories { name: "Smoke Category", url_key: "smoke-cat" }` (Bearer) | `200 → { data: { category_id, uuid, url_key: "smoke-cat" } }` | URL key regex enforcement: `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| 12 | `POST /api/categories { name: "Bad", url_key: "SMOKES!" }` | `400` with validation error about url_key | Regex constraint enforcement |
| 13 | `POST /api/categories/:category_uuid/products { product_id: <product_uuid> }` | `200 → { success: true, data: { product_id, category_id } }` | Path param = uuid, body product_id = uuid (confirmed) |
| 14 | Re-run step 13 (same ids) | `200 → { success: true, message: "Product is assigned to the category" }` | Idempotent on duplicate — confirmed in source |
| 15 | `DELETE /api/categories/:uuid` (cleanup) | `200` | Cleanup path |

### COD Capture

| # | Call | Expected | Risk if wrong |
|---|---|---|---|
| 16 | Full checkout via REST: create cart → add item → set contact → set address → set shipping method → set payment method (cod) → set shipping note → checkout → `200 { data: { order: { uuid } } }` | Order created with `payment_status = "pending"` | REST checkout sequence has path/body mismatches in 2.2.1; enumerate per-step as sub-items |
| 17 | `POST /api/cod/captures { order_id: <uuid> }` (Bearer, against order from step 16) | `200 → { data: {} }` — payment_status now "paid" | Route path or body shape changed in 2.2.1 |
| 18 | `POST /api/cod/captures { order_id: <uuid> }` (same order, already paid) | `400 → { error: { message: "Requested order does not exist or is not in pending payment status" } }` | Confirms double-capture is rejected |
| 19 | `POST /api/cod/captures { order_id: "nonexistent-uuid" }` | `400` with same error shape | Error handling on invalid UUID |

### Checkout REST Sequence (step 16 detail)

Sub-calls within the checkout flow — exact paths confirmed in v2.2.1 route.json:

| Step | Method + Path | Body (key fields) |
|---|---|---|
| a | `POST /api/carts` | `{}` (empty → returns `cart_id`) |
| b | `POST /api/cart/:cart_id/items` | `{ "product_id": <uuid>, "qty": 1 }` — note singular `/cart/` |
| c | `POST /api/carts/:cart_id/contacts` | `{ "email": "test@example.com" }` |
| d | `POST /api/carts/:cart_id/addresses` | `{ "address": { "address1": "123 Test St", "city": "Test", "state": "CA", "country": "US", "postcode": "90210", "phone": "5551234567" } }` |
| e | `POST /api/carts/:cart_id/shippingMethods` | `{ "provider_code": "core", "method_code": "<configured>" }` — method_code to be confirmed at runtime (e.g. `"flat_rate"`) |
| f | `POST /api/carts/:cart_id/paymentMethods` | `{ "method_code": "cod" }` — confirm body key is `method_code` not `payment_method` |
| g | `POST /api/carts/:cart_id/shippingNotes` | `{ "note": "TXID: smoke-test-123" }` |
| h | `POST /api/carts/:cart_id/checkout` | `{}` (or `{ billing_address: ... }` if required) |
| i | Verify: `GET /api/admin/graphql` query order by uuid → `payment_status: "pending"`, `shipping_note: "TXID: smoke-test-123"` |

*Items (e) and (f) have unverified body keys — adjust based on 400 error messages during smoke test.*

### Admin Settings (for deployment slice reference)

| # | Call | Expected | Notes |
|---|---|---|---|
| 20 | `POST /api/settings` (Bearer) `{ "codPaymentStatus": 1, "codDisplayName": "Cryptocurrency (manual)" }` | `200` — setting saved | Confirm settings API path/body; verify via Admin UI |
| 21 | Verify: open `/admin` → Settings → Payment → COD toggle is ON, display name shows custom text | UI reflects saved settings | Visual confirmation |

---

## 5. Design Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Script runtime | Node ESM (`fetch`) | Node 20 in image; native JSON; no deps; one execution path |
| Auth on 401 | Re-login (fresh token) | Simpler than refresh; batch runs < 15 min anyway |
| Idempotency | GET-before-POST + PATCH | Deterministic; PATCH keeps data file authoritative |
| Category-product attach | Dedicated endpoint (`POST /categories/:id/products`) | `category_id` on product payload is ignored by `createProduct` service in 2.2.1 |
| Attributes in seed payload | **Omitted** | `size` attribute is `select` type (options: XXL/XL/SM); text values silently ignored; size encoded in name+SKU |
| Images | `[]` (empty) | No images in v1; upgrade path documented; placeholder box renders in storefront |
| Capture in script | Not scripted (admin-only action) | Capture is a human verification step; not automatable by seed script |
| Wallet address config | Out of scope | ArchUI design slice (8.2) owns `cryptoWallets` setting via POST /api/settings |
| Main-branch divergence | Documented but not actioned | v2.2.1 pinned; upgrade path flagged for deployment slice |

---

*Verified against: EverShop v2.2.1 source (git tag `v2.2.1`), v2.2.1 Dockerfile, `evershop.io/docs/api/*` pages, 2.2.1 `cod/bootstrap.ts`, `cod/api/codCapturePayment/*`, `catalog/api/createProduct/*`, `catalog/api/addProductToCategory/*`, `checkout/api/*` route.json files.*
