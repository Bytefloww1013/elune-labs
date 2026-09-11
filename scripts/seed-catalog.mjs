#!/usr/bin/env node
// Elune Labs catalog seeder — auth, upsert, attach, prune, asserts.
// Spec: docs/design/8-3-catalog-orders.md §1. Node ESM, zero dependencies (built-in fetch).
// Prune retires (PATCH status 0 — never DELETE, so images and order references
// survive) every live category/product the data file no longer declares.
// Importing this module has no side effects.
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// PORT is set in the container (docker-compose publishes on it), so the
// documented `docker compose exec app node scripts/seed-catalog.mjs` works
// without hand-passing EVERSHOP_BASE_URL.
const BASE_URL = process.env.EVERSHOP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
// Defaults are this deployment's seeded admin (docs/DEVELOPER.md § Seed
// catalog), so the documented container run needs no env. Override with
// ADMIN_EMAIL / ADMIN_PASSWORD.
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@elunelabs.example';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'ChangeMe123';

let accessToken = null;

// POST /api/user/tokens {email, password} -> data.accessToken (8-3 §1).
export async function login() {
  const res = await fetch(`${BASE_URL}/api/user/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status} ${await res.text()}`);
  accessToken = (await res.json()).data.accessToken;
  return accessToken;
}

// Authed request. On 401: re-login once, retry the failed request once (8-3 §1).
export async function apiFetch(path, options = {}, isRetry = false) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers
    }
  });
  if (res.status === 401 && !isRetry) {
    await login();
    return apiFetch(path, options, true);
  }
  return res;
}

// Design 8-3 §1 filters categories by url_key, but 2.2.1's CategoryCollection
// supports only name/status/parent/ob filters — a url_key filter is silently
// ignored. Match url_key client-side instead.
//
// The DB read MUST come first: CategoryCollection filters on status, so once
// prune retires a url_key GraphQL can no longer see it, the caller would POST a
// duplicate, and CATEGORY_URL_KEY_UNIQUE would fail the run.
export async function findCategory(urlKey) {
  const rows = await dbCategories();
  if (rows) {
    const row = rows.find((c) => c.url_key === urlKey);
    return row ? { uuid: row.uuid, url_key: row.url_key, status: row.status } : null;
  }
  // GraphQL categories are status-filtered, so anything it returns is live.
  const data = await graphql(`query { categories { items { uuid urlKey } } }`);
  const item = (data.categories?.items ?? []).find((c) => c.urlKey === urlKey);
  return item ? { uuid: item.uuid, url_key: item.urlKey, status: true } : null;
}

async function graphql(query) {
  const res = await apiFetch('/api/graphql', { method: 'POST', body: JSON.stringify({ query }) });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`graphql ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}


// Query first, then create-or-restore: existing and live -> reuse uuid, skip
// PATCH (name/url_key stable in seed); existing but retired -> PATCH status 1.
// The second branch is what makes prune reversible: without it a category that
// prune retired and a later data file re-declared stays at status 0, invisible
// everywhere, and the assertSeed guard cannot see it either (it only fails on
// live-but-undeclared rows, never on declared-but-retired ones).
export async function upsertCategory({ name, url_key }) {
  const existing = await findCategory(url_key);
  if (existing) {
    if (existing.status) {
      console.log(`category '${url_key}': reuse ${existing.uuid}`);
      return existing;
    }
    const res = await apiFetch(`/api/categories/${existing.uuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 1, include_in_nav: 1 })
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`restore '${url_key}' failed: HTTP ${res.status} ${JSON.stringify(json)}`);
    console.log(`category '${url_key}': restored ${existing.uuid}`);
    return { uuid: existing.uuid, url_key };
  }
  // 2.2.1 `category` has NOT NULL status/include_in_nav with no defaults —
  // the REST payload must supply them (schema allows them as additional props).
  const res = await apiFetch('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name, url_key, status: 1, include_in_nav: 1 })
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`create '${url_key}' failed: HTTP ${res.status} ${JSON.stringify(json)}`);
  console.log(`category '${url_key}': created`);
  return json?.data ?? null;
}

// Filters (including sku) are SILENTLY IGNORED by this fork's products query —
// empirically, a nonexistent sku returned unrelated products.
//
// Worse, `products { items }` returns at most 20 rows per page and the schema
// exposes NO page/limit argument on the field, so `page:` is ignored too: with
// more than 20 products a SKU outside the first page reads as missing, the
// caller creates a duplicate, and the unique-SKU constraint fails the run.
//
// So read the catalog from the database the app is already connected to (the
// `pg` driver ships in the EverShop image; DB_* are set in the container by
// docker-compose.yml). The GraphQL scan remains the fallback when `pg` is
// absent, which is only viable for catalogs under the 20-row cap.
let dbPool = null;

async function db() {
  if (dbPool) return dbPool;
  const { default: pg } = await import('pg');
  dbPool = new pg.Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 2
  });
  return dbPool;
}

export async function closeDb() {
  if (dbPool) {
    await dbPool.end();
    dbPool = null;
  }
}

// Every product with its status and category url_key, straight from the DB
// (uncapped). product.category_id is the single product->category link in
// 2.2.1; the url_key lives on category_description. status feeds prune and the
// assertSeed prune guard.
export async function dbProducts() {
  try {
    const { rows } = await (await db()).query(
      `select p.uuid, p.sku, p.status, cd.url_key as category
         from product p
         left join category c on c.category_id = p.category_id
         left join category_description cd
                on cd.category_description_category_id = c.category_id`
    );
    return rows;
  } catch (error) {
    console.warn(`db read unavailable (${error.message}); falling back to graphql (20-row cap)`);
    return null;
  }
}

// Every category with its url_key and status, straight from the DB (uncapped).
// Retired rows MUST stay visible here: CategoryCollection filters on status, so
// after prune retires a url_key GraphQL can no longer see it and the next run
// would POST a duplicate URL key.
export async function dbCategories() {
  try {
    const { rows } = await (await db()).query(
      `select c.uuid, cd.url_key, c.status
         from category c
         join category_description cd
           on cd.category_description_category_id = c.category_id`
    );
    return rows;
  } catch (error) {
    console.warn(`db read unavailable (${error.message}); falling back to graphql`);
    return null;
  }
}

async function findProduct(sku) {
  const rows = await dbProducts();
  if (rows) {
    const row = rows.find((p) => p.sku === sku);
    return row ? { uuid: row.uuid, sku: row.sku } : null;
  }
  const data = await graphql(`query { products { items { uuid sku } } }`);
  return (data.products?.items ?? []).find((p) => p.sku === sku) ?? null;
}

// Query first, then create-or-update (8-3 §1): found -> PATCH so the data file
// stays the single source of truth for price/qty; missing -> POST with explicit
// NOT-NULL defaults (2.2.1 has no schema defaults, same as categories).
export async function upsertProduct({ name, sku, price, qty }) {
  const existing = await findProduct(sku);
  if (existing) {
    const res = await apiFetch(`/api/products/${existing.uuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ price, qty, status: 1 })
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`patch '${sku}' failed: HTTP ${res.status} ${JSON.stringify(json)}`);
    console.log(`product '${sku}': patched ${existing.uuid}`);
    return existing;
  }
  const res = await apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name,
      sku,
      price,
      qty,
      status: 1,
      // Fork-enforced NOT NULLs beyond design 8-3's payload sketch (verified in
      // dist/modules/catalog/services/product/createProduct.js + DB: single
      // "Default" attribute group, single "Standard Box" package).
      group_id: 1,
      package_id: 1,
      visibility: 1,
      manage_stock: 1,
      stock_availability: 1,
      images: [],
      // 2.2.1 createProduct does NOT auto-generate url_key from name (design 8-3
      // §2 assumed it) — the middleware rejects the payload without it. Slug:
      // lowered, non-alphanumerics -> dashes.
      url_key: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    })
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`create '${sku}' failed: HTTP ${res.status} ${JSON.stringify(json)}`);
  console.log(`product '${sku}': created`);
  return json?.data ?? null;
}

// Attach EVERY run — 2.2.1 addProductToCategory returns 200 on duplicates too,
// and category_id in the create payload is ignored by createProduct (8-3 §1),
// so this endpoint is the only wiring.
export async function attachProduct(category, product) {
  const res = await apiFetch(`/api/categories/${category.uuid}/products`, {
    method: 'POST',
    body: JSON.stringify({ product_id: product.uuid })
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`attach '${product.sku}' to '${category.url_key}' failed: HTTP ${res.status} ${JSON.stringify(json)}`);
  }
  console.log(`product '${product.sku}': attached to '${category.url_key}'`);
  return json?.data ?? null;
}
// Retire every live category/product the data file no longer declares: PATCH
// status 0, never DELETE, so images and order references survive. Idempotent —
// a second run finds nothing live to retire. Both reads come from the DB
// because GraphQL cannot see retired rows.
export async function prune(data) {
  const categories = await dbCategories();
  const products = await dbProducts();
  if (!categories || !products) {
    console.warn('prune skipped: db read unavailable');
    return 0;
  }
  const declaredCategories = new Set(data.categories.map((c) => c.url_key));
  const declaredSkus = new Set(data.products.map((p) => p.sku));
  let retired = 0;
  for (const { uuid, url_key, status } of categories) {
    if (!status || declaredCategories.has(url_key)) continue;
    const res = await apiFetch(`/api/categories/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 0 })
    });
    if (!res.ok) throw new Error(`retire '${url_key}' failed: HTTP ${res.status} ${await res.text()}`);
    console.log(`category '${url_key}': retired`);
    retired += 1;
  }
  for (const { uuid, sku, status } of products) {
    if (!status || declaredSkus.has(sku)) continue;
    const res = await apiFetch(`/api/products/${uuid}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 0 })
    });
    if (!res.ok) throw new Error(`retire '${sku}' failed: HTTP ${res.status} ${await res.text()}`);
    console.log(`product '${sku}': retired`);
    retired += 1;
  }
  console.log(`prune: ${retired} row(s) retired`);
  return retired;
}
// Post-run asserts (8-3 §1): categories resolve by url_key; every SKU resolves;
// each product's category is the declared one (Product.category — singular, no
// 'categories' field in 2.2.1); and nothing live is undeclared (prune guard).
// Any failure: one stderr line each, exit 1.
export async function assertSeed(data) {
  const failures = [];
  for (const { url_key } of data.categories) {
    if (!(await findCategory(url_key))) failures.push(`category '${url_key}': not found`);
  }
  // One read; sku matched client-side (filters ignored — see findProduct).
  const result = await graphql(`query { products { items { sku category { urlKey } } } }`);
  const bySku = new Map((result.products?.items ?? []).map((p) => [p.sku, p]));
  for (const { sku, category } of data.products) {
    const item = bySku.get(sku);
    if (!item) {
      failures.push(`SKU ${sku}: not found after create`);
      continue;
    }
    const attached = item.category?.urlKey ?? 'none';
    if (attached !== category) failures.push(`SKU ${sku}: expected category '${category}', got '${attached}'`);
  }
  // Prune guard: a live row the data file does not declare means prune silently
  // stopped working. GraphQL cannot see these (status-filtered) — read the DB.
  const declaredCategories = new Set(data.categories.map((c) => c.url_key));
  const declaredSkus = new Set(data.products.map((p) => p.sku));
  const liveCategories = await dbCategories();
  if (liveCategories) {
    for (const { url_key, status } of liveCategories) {
      if (status && !declaredCategories.has(url_key)) failures.push(`category '${url_key}': live but not declared`);
    }
  }
  const liveProducts = await dbProducts();
  if (liveProducts) {
    for (const { sku, status } of liveProducts) {
      if (status && !declaredSkus.has(sku)) failures.push(`SKU ${sku}: live but not declared`);
    }
  }
  if (failures.length) {
    console.error(`SEED FAILURE - ${failures.length} issues`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exit(1);
  }
  console.log(`asserts: ${data.categories.length} categories, ${data.products.length} products, all attached`);
}

// Store identity. Core's page meta reads `storeName` / `storeDescription` and
// falls back to EverShop's own defaults when they are unset
// (dist/modules/cms/pages/frontStore/homepage/meta.js — verified), so a clean
// deployment shipped "EverShop" as the browser-tab title and "The best
// eCommerce platform" as the meta description until an operator happened to set
// the name in the admin console. The bootstrap owns making a clean deployment
// correct, so it sets them. No page-level derivation here: product and category
// pages title themselves from their own name.
const STORE_SETTINGS = {
  storeName: 'Elune Labs',
  storeDescription:
    'Research reference compounds with the specification on record for every product — form, storage and a purity declaration. For research use only.'
};

export async function applyStoreSettings() {
  const res = await apiFetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify(STORE_SETTINGS)
  });
  if (!res.ok) throw new Error(`settings update failed: HTTP ${res.status} ${await res.text()}`);
  console.log(`settings: ${Object.keys(STORE_SETTINGS).join(', ')} applied`);
}

export async function run() {
  const data = JSON.parse(await readFile(new URL('./catalog-data.json', import.meta.url), 'utf8'));
  await login();
  await applyStoreSettings();
  const categories = {};
  for (const category of data.categories) {
    const upserted = await upsertCategory(category);
    categories[category.url_key] = { uuid: upserted?.uuid, url_key: category.url_key };
  }
  for (const product of data.products) {
    const upserted = await upsertProduct(product);
    await attachProduct(categories[product.category], upserted);
  }
  await prune(data);
  await assertSeed(data);
}

// Execute only when run directly; importing (b04.16) must not seed.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`SEED FAILURE: ${error.message}`);
    process.exit(1);
  });
}
