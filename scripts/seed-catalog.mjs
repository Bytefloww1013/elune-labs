#!/usr/bin/env node
// Elune Labs catalog seeder — auth, category/product upsert, attach, asserts.
// Spec: docs/design/8-3-catalog-orders.md §1. Node ESM, zero dependencies (built-in fetch).
// Importing this module has no side effects.
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const BASE_URL = process.env.EVERSHOP_BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@evershop.com';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123';

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
// ignored. Fetch the (tiny) list and match url_key client-side instead.
export async function findCategory(urlKey) {
  const data = await graphql(`query { categories { items { uuid urlKey } } }`);
  return (data.categories?.items ?? []).find((c) => c.urlKey === urlKey) ?? null;
}

async function graphql(query) {
  const res = await apiFetch('/api/graphql', { method: 'POST', body: JSON.stringify({ query }) });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`graphql ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}


// Query first, then create-or-reuse: existing -> reuse uuid, skip PATCH (name/url_key stable in seed).
export async function upsertCategory({ name, url_key }) {
  const existing = await findCategory(url_key);
  if (existing) {
    console.log(`category '${url_key}': reuse ${existing.uuid}`);
    return existing;
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
// empirically, a nonexistent sku returned unrelated products. Same fallback as
// categories: fetch the list and match client-side.
async function findProduct(sku) {
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
// Post-run asserts (8-3 §1): categories resolve by url_key; every SKU resolves;
// each product's category is the declared one (Product.category — singular, no
// 'categories' field in 2.2.1). Any failure: one stderr line each, exit 1.
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
  if (failures.length) {
    console.error(`SEED FAILURE - ${failures.length} issues`);
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exit(1);
  }
  console.log(`asserts: ${data.categories.length} categories, ${data.products.length} products, all attached`);
}

export async function run() {
  const data = JSON.parse(await readFile(new URL('./catalog-data.json', import.meta.url), 'utf8'));
  await login();
  const categories = {};
  for (const category of data.categories) {
    const upserted = await upsertCategory(category);
    categories[category.url_key] = { uuid: upserted?.uuid, url_key: category.url_key };
  }
  for (const product of data.products) {
    const upserted = await upsertProduct(product);
    await attachProduct(categories[product.category], upserted);
  }
  await assertSeed(data);
}

// Execute only when run directly; importing (b04.16) must not seed.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`SEED FAILURE: ${error.message}`);
    process.exit(1);
  });
}
