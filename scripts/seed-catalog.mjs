#!/usr/bin/env node
// Elune Labs catalog seeder — auth + category upsert.
// Spec: docs/design/8-3-catalog-orders.md §1. Node ESM, zero dependencies (built-in fetch).
// Product upsert + attach + asserts land in b04.16; importing this module has no side effects.
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

export async function run() {
  const data = JSON.parse(await readFile(new URL('./catalog-data.json', import.meta.url), 'utf8'));
  await login();
  for (const category of data.categories) await upsertCategory(category);
  // Products are b04.16's scope. Do not crash on them.
  if (data.products?.length) {
    console.log(`products: not yet implemented (${data.products.length} in catalog-data.json, skipped)`);
  }
}

// Execute only when run directly; importing (b04.16) must not seed.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`SEED FAILURE: ${error.message}`);
    process.exit(1);
  });
}
