#!/usr/bin/env node
// Guest checkout smoke test for the Elune Labs storefront (EverShop 2.2.1).
// Full REST sequence: cart -> item -> contacts -> shipping/billing address
// -> shipping method -> COD payment -> TXID note -> checkout -> admin capture
// (paid -> double-capture 400 -> unknown order 400).
// Zero-dependency Node ESM (built-in fetch). Exit 0 when every step passes,
// 1 on the first failure.
//
// Body shapes verified against 2.2.1 source payloadSchema.json / handlers
// (checkout/api/*), NOT against the design-doc sketch — several sketch fields
// were wrong for this fork:
//   - createCart REQUIRES items: [{sku, qty}] and returns data.cartId
//   - add-item takes {sku, qty} (not product_id); singular path /cart/
//   - addresses require {address, type: 'shipping'|'billing'}; address fields
//     are full_name/address_1/province/telephone (validator + cart_address cols)
//   - checkout REQUIRES {cart_id, customer: {email}} in the body
//   - a billing address is required for any order with grand_total > 0
//   - core method_code is the core_shipping_method uuid, and a zone+rate must
//     exist — this store ships with no shipping config, so the script
//     bootstraps zone->method->rate (idempotent: skips when the cart already
//     resolves available methods).

process.loadEnvFile();

const BASE_URL = process.env.EVERSHOP_BASE_URL ?? 'http://localhost:3010';
const STOREFRONT_URL = process.env.EVERSHOP_STOREFRONT_URL ??
  `http://100.123.49.43:${process.env.PORT ?? 3010}`;
const EMAIL = process.env.ADMIN_EMAIL ?? 'admin@elunelabs.example';
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'ChangeMe123';

const CUSTOMER_EMAIL = 'test@example.com';
const TXID = 'TXID: smoke-test-123';
const ADDRESS = {
  full_name: 'Smoke Tester',
  address_1: '123 Test St',
  city: 'Test City',
  province: 'CA',
  country: 'US',
  postcode: '90210',
  telephone: '5551234567'
};

let accessToken = null;
async function checkStorefrontUrls() {
  const res = await fetch(`${STOREFRONT_URL}/`);
  const html = await res.text();
  if (!res.ok) throw new Error(`storefront failed: HTTP ${res.status}`);

  const expectedOrigin = new URL(STOREFRONT_URL).origin;
  const baseUrl = html.match(/"baseUrl":"([^"]+)"/)?.[1];
  const cartApi = html.match(/"(https?:\/\/[^\"]+\/api\/cart\/mine\/items)"/)?.[1];
  if (!baseUrl || !cartApi) throw new Error('storefront did not expose its base URL and cart API');
  for (const [label, value] of [['pageMeta.baseUrl', baseUrl], ['addMineCartItemApi', cartApi]]) {
    const actualOrigin = new URL(value).origin;
    if (actualOrigin !== expectedOrigin) {
      throw new Error(`${label} uses ${actualOrigin}; expected ${expectedOrigin}`);
    }
  }
}
// POST /api/user/tokens {email, password} -> data.accessToken.
async function login() {
  const res = await fetch(`${BASE_URL}/api/user/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status} ${await res.text()}`);
  accessToken = (await res.json()).data.accessToken;
  return accessToken;
}

// Authed request. On 401: re-login once, retry the failed request once.
async function apiFetch(path, options = {}, isRetry = false) {
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

// Unauthenticated (guest) POST — cart routes are public.
async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* non-JSON body */ }
  return { status: res.status, json, text };
}

async function graphql(query) {
  const res = await apiFetch('/api/graphql', { method: 'POST', body: JSON.stringify({ query }) });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.errors) throw new Error(`graphql ${res.status}: ${JSON.stringify(json?.errors ?? json)}`);
  return json.data;
}

function check(res, status, label) {
  if (res.status !== status) {
    throw new Error(`${label}: expected HTTP ${status}, got ${res.status} — ${res.text.slice(0, 300)}`);
  }
  return res.json;
}

let sku;
let cartId;
let orderId;

// The cart resolves its available shipping methods from the shipping address;
// empty list means the store has no shipping config yet — create the minimum:
// a US zone (auto-attaches the core provider), a flat-rate method, a $5 rate.
// A rerun on a configured store skips all of this.
async function resolveShippingMethod() {
  const query = () =>
    graphql(`query { cart(id: "${cartId}") { availableShippingMethods { providerCode code name } } }`)
      .then((d) => d?.cart?.availableShippingMethods ?? []);

  let methods = await query();
  if (methods.length === 0) {
    console.log('INFO no shipping config found — bootstrapping zone/method/rate');
    const zone = await apiFetch('/api/shippingZones', {
      method: 'POST',
      body: JSON.stringify({ name: 'Smoke Zone', countries: ['US'] })
    });
    const zoneJson = await zone.json().catch(() => null);
    if (!zone.ok || !zoneJson?.data?.uuid) {
      throw new Error(`shipping zone create failed: HTTP ${zone.status} ${JSON.stringify(zoneJson)}`);
    }
    let methodRes = await apiFetch('/api/shippingProviders/core/methods', {
      method: 'POST',
      body: JSON.stringify({ name: 'Flat Rate', is_enabled: true })
    });
    let methodJson = await methodRes.json().catch(() => null);
    if (methodRes.status === 400) {
      // "Flat Rate" already exists from a half-finished bootstrap — make a
      // fresh one instead of hunting for the old uuid.
      methodRes = await apiFetch('/api/shippingProviders/core/methods', {
        method: 'POST',
        body: JSON.stringify({ name: `Flat Rate ${Date.now()}`, is_enabled: true })
      });
      methodJson = await methodRes.json().catch(() => null);
    }
    if (methodRes.status !== 200 || !methodJson?.data?.uuid) {
      throw new Error(`shipping method create failed: HTTP ${methodRes.status} ${JSON.stringify(methodJson)}`);
    }
    const rate = await apiFetch('/api/shippingProviders/core/rates', {
      method: 'POST',
      body: JSON.stringify({
        method_id: methodJson.data.uuid,
        zone_id: zoneJson.data.uuid,
        cost: 5,
        is_enabled: true
      })
    });
    if (rate.status !== 200) {
      throw new Error(`shipping rate create failed: HTTP ${rate.status} ${(await rate.text()).slice(0, 200)}`);
    }
    methods = await query();
  }
  if (methods.length === 0) throw new Error('no shipping method available after bootstrap');
  return methods[0];
}

const steps = [
  ['storefront URLs match browser origin', () => checkStorefrontUrls()],
  ['admin login', () => login()],
  [
    'find product',
    async () => {
      const data = await graphql('query { products { items { uuid sku status } } }');
      const product = (data?.products?.items ?? []).find((p) => p.status === 1);
      if (!product?.sku) throw new Error('no enabled product in catalog');
      sku = product.sku;
    }
  ],
  [
    'create cart',
    async () => {
      const res = await post('/api/carts', { items: [{ sku, qty: 1 }] });
      cartId = check(res, 200, 'create cart')?.data?.cartId;
      if (!cartId) throw new Error(`no cartId in response: ${res.text.slice(0, 200)}`);
    }
  ],
  [
    'add item',
    async () => {
      check(await post(`/api/cart/${cartId}/items`, { sku, qty: 1 }), 200, 'add item');
    }
  ],
  [
    'set contacts',
    async () => {
      check(await post(`/api/carts/${cartId}/contacts`, { email: CUSTOMER_EMAIL }), 200, 'contacts');
    }
  ],
  [
    'set shipping address',
    async () => {
      check(await post(`/api/carts/${cartId}/addresses`, { type: 'shipping', address: ADDRESS }), 200, 'shipping address');
    }
  ],
  [
    'set billing address',
    async () => {
      check(await post(`/api/carts/${cartId}/addresses`, { type: 'billing', address: ADDRESS }), 200, 'billing address');
    }
  ],
  [
    'set shipping method',
    async () => {
      const method = await resolveShippingMethod();
      const res = await post(`/api/carts/${cartId}/shippingMethods`, {
        provider_code: method.providerCode,
        method_code: method.code
      });
      check(res, 200, 'shipping method');
      console.log(`INFO shipping method: ${method.name} (${method.providerCode})`);
    }
  ],
  [
    'set payment method (cod)',
    async () => {
      check(await post(`/api/carts/${cartId}/paymentMethods`, { method_code: 'cod' }), 200, 'payment method');
    }
  ],
  [
    'set shipping note (TXID)',
    async () => {
      check(await post(`/api/carts/${cartId}/shippingNotes`, { note: TXID }), 200, 'shipping note');
    }
  ],
  [
    'checkout',
    async () => {
      const res = await post(`/api/carts/${cartId}/checkout`, { cart_id: cartId, customer: { email: CUSTOMER_EMAIL } });
      const order = check(res, 200, 'checkout')?.data;
      orderId = order?.uuid;
      if (!orderId) throw new Error(`no order uuid in response: ${res.text.slice(0, 200)}`);
      if (order.payment_status !== 'pending') {
        throw new Error(`expected payment_status 'pending', got '${order.payment_status}'`);
      }
      if (order.shipping_note !== TXID) {
        throw new Error(`TXID not carried on order: shipping_note='${order.shipping_note}'`);
      }
      console.log(`INFO order ${order.order_number} (${orderId}) grand_total=${order.grand_total}`);
    }
  ],
  [
    'capture order -> paid',
    async () => {
      const res = await apiFetch('/api/cod/captures', { method: 'POST', body: JSON.stringify({ order_id: orderId }) });
      if (res.status !== 200) {
        throw new Error(`capture failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
      }
      const data = await graphql(`query { order(uuid: "${orderId}") { paymentStatus { code } } }`);
      const code = data?.order?.paymentStatus?.code;
      if (code !== 'paid') throw new Error(`expected paymentStatus 'paid', got '${code}'`);
    }
  ],
  [
    'double-capture rejected (400)',
    async () => {
      const res = await apiFetch('/api/cod/captures', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId })
      });
      if (res.status !== 400) {
        throw new Error(`expected HTTP 400, got ${res.status} — ${(await res.text()).slice(0, 200)}`);
      }
    }
  ],
  [
    'nonexistent order rejected (400)',
    async () => {
      const res = await apiFetch('/api/cod/captures', {
        method: 'POST',
        body: JSON.stringify({ order_id: '00000000-0000-0000-0000-000000000000' })
      });
      if (res.status !== 400) {
        throw new Error(`expected HTTP 400, got ${res.status} — ${(await res.text()).slice(0, 200)}`);
      }
    }
  ]
];

for (const [name, fn] of steps) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`);
    process.exit(1);
  }
}
console.log('ALL CHECKOUT SMOKE STEPS PASSED');