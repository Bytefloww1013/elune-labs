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

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

// .env is a local convenience; the script still runs from real env vars alone.
try {
  process.loadEnvFile();
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}

// Privileged script: it creates carts and orders. Fail closed before any network
// call unless the mutation opt-in and explicit admin credentials are present,
// and never send those credentials over plain HTTP to a non-loopback host.
const BASE_URL = process.env.EVERSHOP_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const STOREFRONT_URL = process.env.EVERSHOP_STOREFRONT_URL ??
  process.env.HOME_URL ?? BASE_URL;
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (process.env.EVERSHOP_ALLOW_MUTATION !== '1') {
  throw new Error('refusing to run: set EVERSHOP_ALLOW_MUTATION=1 to allow cart and order mutations');
}
if (!EMAIL || !PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
const loopbackHosts = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
function requireLoopbackOrHttps(raw, name) {
  const url = new URL(raw);
  if (url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && loopbackHosts.has(url.hostname))) {
    throw new Error(`${name} must use HTTPS unless it targets loopback`);
  }
}
requireLoopbackOrHttps(BASE_URL, 'EVERSHOP_BASE_URL');

// Default checkout line is a non-representative member of a Size group so the
// run snapshots a specific child SKU. The configured SKU is used verbatim.
const CHECKOUT_SKU = process.env.EVERSHOP_CHECKOUT_SKU ?? 'BPC157-10MG';
const KNOWN_VARIANTS = {
  'BPC157-5MG': { price: 39.99, size: '5mg' },
  'BPC157-10MG': { price: 59.99, size: '10mg' },
  'TB500-5MG': { price: 49.99, size: '5mg' },
  'TB500-10MG': { price: 79.99, size: '10mg' },
  'CJC1295-5MG': { price: 44.99, size: '5mg' },
  'CJC1295-10MG': { price: 69.99, size: '10mg' }
};
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

// --- Add-to-cart browser regression -----------------------------------------
// CartContext's `isLoading` is cart-global, so folding it into a card's
// `disabled` greys out every card the moment one of them adds. Driven in a real
// browser so the assertion covers what a shopper sees, not component source.

// Chromium ships in Playwright's cache, not the app's dependencies; CHROMIUM_PATH
// overrides when another build is wanted.
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const cache = join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(cache)) return null;
  for (const dir of readdirSync(cache)) {
    if (!dir.startsWith('chromium')) continue;
    const exe = join(cache, dir, 'chrome-linux64', 'chrome');
    if (existsSync(exe)) return exe;
  }
  return null;
}

async function launchChromium() {
  const exe = findChromium();
  if (!exe) throw new Error('no Chromium found — set CHROMIUM_PATH');
  const profile = mkdtempSync(join(tmpdir(), 'smoke-chromium-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank'
  ];
  if (process.env.CHROMIUM_NO_SANDBOX === '1') args.splice(1, 0, '--no-sandbox');
  const stderrChunks = [];
  const child = spawn(exe, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  child.stderr.on('data', (chunk) => {
    if (stderrChunks.reduce((n, c) => n + c.length, 0) < 4096) stderrChunks.push(chunk);
  });
  const portFile = join(profile, 'DevToolsActivePort');
  const deadline = Date.now() + 20000;
  const fail = (prefix) => {
    const stderr = Buffer.concat(stderrChunks).toString().replace(/\s+/g, ' ').trim().slice(0, 400);
    const hint = process.env.CHROMIUM_NO_SANDBOX === '1' || !/sandbox/i.test(stderr)
      ? ''
      : ' (set CHROMIUM_NO_SANDBOX=1 on AppArmor hosts)';
    throw new Error(`${prefix}${stderr ? `: ${stderr}` : ''}${hint}`);
  };
  while (!existsSync(portFile)) {
    if (child.exitCode !== null) fail(`Chromium exited early (code ${child.exitCode})`);
    if (Date.now() > deadline) fail('Chromium never opened a debugging port');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const [port, browserPath] = readFileSync(portFile, 'utf8').split('\n');
  return { child, profile, wsUrl: `ws://127.0.0.1:${port.trim()}${browserPath.trim()}` };
}

// Minimal CDP client over the global WebSocket — no browser-automation dependency.
function connectCdp(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  const handlers = new Map();
  let nextId = 0;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id !== undefined) {
      const entry = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
      return;
    }
    for (const handler of handlers.get(message.method) ?? []) handler(message.params, message.sessionId);
  });
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error(`cannot connect to ${wsUrl}`)), { once: true });
  });
  return {
    ready,
    on(method, handler) {
      if (!handlers.has(method)) handlers.set(method, new Set());
      handlers.get(method).add(handler);
    },
    send(method, params = {}, sessionId) {
      const id = ++nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      });
    },
    close() {
      socket.close();
    }
  };
}

// Clicks one list card and watches the whole row while the add is in flight:
// only the clicked button may read busy/disabled, and the request it fires must
// carry that card's SKU before the mini-cart count moves.
async function checkAddToCartFlash() {
  if (!loopbackHosts.has(new URL(STOREFRONT_URL).hostname)) {
    return { skip: 'storefront is not loopback' };
  }
  const origin = new URL(STOREFRONT_URL).origin;
  const { child, profile, wsUrl } = await launchChromium();
  const cdp = connectCdp(wsUrl);
  let cartPost = null;
  try {
    await cdp.ready;
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const send = (method, params) => cdp.send(method, params, sessionId);

    await send('Network.enable');
    await send('Page.enable');
    cdp.on('Network.requestWillBeSent', (params, sid) => {
      if (sid !== sessionId || params.request.method !== 'POST') return;
      if (/\/api\/cart\/.+\/items$/.test(new URL(params.request.url).pathname)) cartPost = params.request;
    });

    // The age gate accepts a cookie, so seed it instead of driving the modal.
    await send('Network.setCookie', {
      name: 'elune_age_ok',
      value: '1',
      url: `${origin}/`,
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 2592000
    });

    const loaded = new Promise((resolve) => {
      cdp.on('Page.loadEventFired', (params, sid) => {
        if (sid === sessionId) resolve();
      });
    });
    await send('Page.navigate', { url: `${origin}/all` });
    await loaded;
    // Cards are server-rendered; let hydration attach the click handlers.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const evaluate = async (expression, awaitPromise = false) => {
      const { result, exceptionDetails } = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise
      });
      if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
      return result.value;
    };

    const point = await evaluate(`(() => {
      const button = document.querySelector('.product__list__item__inner button.btn');
      if (!button) throw new Error('expected an add-to-cart button');
      button.scrollIntoView({ block: 'center' });
      const rect = button.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await new Promise((resolve) => setTimeout(resolve, 200));

    await evaluate(`(() => {
      const buttons = [...document.querySelectorAll('.product__list__item__inner')]
        .map((card) => card.querySelector('button.btn'));
      if (buttons.length < 2 || buttons.some((button) => !button)) {
        throw new Error('expected a product list with at least two add-to-cart buttons');
      }
      const busy = (button) => button.getAttribute('aria-busy') === 'true';
      const count = () =>
        Number((document.querySelector('.minicart')?.getAttribute('aria-label') ?? '')
          .match(/\\bCart, (\\d+) items?\\b/)?.[1] ?? 0);
      const visual = (button) => {
        const style = getComputedStyle(button);
        return [style.backgroundColor, style.color, style.borderColor, button.getBoundingClientRect().width]
          .join('|');
      };
      const chosen = buttons[0];
      const monitor = window.__cartFlashMonitor = {
        buttons,
        beforeCount: count(),
        busyBefore: buttons.filter(busy).length,
        disabledBefore: buttons.filter((button) => button.hasAttribute('disabled')).length,
        sku: chosen.closest('.product__list__item__inner')?.querySelector(':scope > div .mono')?.textContent.trim() ?? null,
        chosenBusy: false,
        siblings: new Set(),
        siblingVisualChanges: new Set(),
        clickedVisualChanges: new Set(),
        clickedBaseline: visual(chosen),
        siblingBaselines: buttons.map(visual),
        maxBusy: 0,
        maxDisabled: 0
      };
      const record = (button, wasBusy, wasDisabled) => {
        const index = buttons.indexOf(button);
        if (index < 0) return;
        if (index === 0) monitor.chosenBusy ||= wasBusy;
        else if (wasBusy || wasDisabled) monitor.siblings.add(index);
      };
      monitor.sample = () => {
        const states = buttons.map((button) => ({
          busy: busy(button),
          disabled: button.hasAttribute('disabled')
        }));
        buttons.forEach((button, index) => record(button, states[index].busy, states[index].disabled));
        monitor.maxBusy = Math.max(monitor.maxBusy, states.filter((state) => state.busy).length);
        monitor.maxDisabled = Math.max(
          monitor.maxDisabled,
          states.filter((state) => state.disabled).length
        );
        if (visual(chosen) !== monitor.clickedBaseline) {
          monitor.clickedVisualChanges.add(visual(chosen));
        }
        buttons.slice(1).forEach((button, offset) => {
          if (visual(button) !== monitor.siblingBaselines[offset + 1]) {
            monitor.siblingVisualChanges.add(offset + 1);
          }
        });
      };
      monitor.observer = new MutationObserver((mutations) => {
        for (const { target, attributeName, oldValue } of mutations) {
          record(
            target,
            (attributeName === 'aria-busy' && oldValue === 'true') || busy(target),
            (attributeName === 'disabled' && oldValue !== null) || target.hasAttribute('disabled')
          );
        }
        monitor.sample();
      });
      monitor.observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['disabled', 'aria-busy']
      });
      monitor.transition = (event) => {
        if (event.target === chosen && ['background-color', 'color', 'border-color'].includes(event.propertyName)) {
          monitor.clickedVisualChanges.add('transition:' + event.propertyName);
        }
      };
      chosen.addEventListener('transitionstart', monitor.transition);
      monitor.timer = setInterval(monitor.sample, 8);
    })()`);

    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      ...point,
      button: 'left',
      buttons: 1,
      clickCount: 1
    });
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      ...point,
      button: 'left',
      buttons: 0,
      clickCount: 1
    });

    const observed = await evaluate(`(async () => {
      const monitor = window.__cartFlashMonitor;
      const count = () =>
        Number((document.querySelector('.minicart')?.getAttribute('aria-label') ?? '')
          .match(/\\bCart, (\\d+) items?\\b/)?.[1] ?? 0);
      const deadline = performance.now() + 20000;
      while (performance.now() < deadline) {
        monitor.sample();
        if (monitor.chosenBusy && (monitor.siblings.size > 0 || count() > monitor.beforeCount)) break;
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      clearInterval(monitor.timer);
      monitor.observer.disconnect();
      monitor.buttons[0].removeEventListener('transitionstart', monitor.transition);
      monitor.sample();
      return {
        sku: monitor.sku,
        buttons: monitor.buttons.length,
        busyBefore: monitor.busyBefore,
        disabledBefore: monitor.disabledBefore,
        beforeCount: monitor.beforeCount,
        afterCount: count(),
        maxBusy: monitor.maxBusy,
        maxDisabled: monitor.maxDisabled,
        chosenBusy: monitor.chosenBusy,
        siblings: [...monitor.siblings],
        siblingVisualChanges: [...monitor.siblingVisualChanges],
        clickedVisualChanges: [...monitor.clickedVisualChanges]
      };
    })()`, true);

    if (observed.busyBefore !== 0 || observed.disabledBefore !== 0) {
      throw new Error(
        `list did not start idle (${observed.busyBefore} busy, ${observed.disabledBefore} disabled)`
      );
    }
    if (!observed.chosenBusy) throw new Error('the clicked card never showed a busy state');
    if (observed.siblings.length > 0) {
      throw new Error(`${observed.siblings.length} sibling card(s) went busy or disabled during the add`);
    }
    if (observed.siblingVisualChanges.length > 0) {
      throw new Error(`${observed.siblingVisualChanges.length} sibling card button(s) changed color during the add`);
    }
    if (observed.clickedVisualChanges.length > 0) {
      throw new Error(`clicked card button changed visually during the add: ${observed.clickedVisualChanges.join(', ')}`);
    }
    if (observed.maxBusy !== 1) throw new Error(`expected exactly 1 busy card, saw ${observed.maxBusy}`);
    if (observed.maxDisabled !== 1) {
      throw new Error(`expected only the clicked card to disable, saw ${observed.maxDisabled}`);
    }
    if (observed.afterCount <= observed.beforeCount) {
      throw new Error(`mini-cart count did not grow: ${observed.beforeCount} -> ${observed.afterCount}`);
    }
    if (!cartPost) throw new Error('no POST to the cart items API was observed');
    const payload = JSON.parse(cartPost.postData ?? '{}');
    if (payload.sku !== observed.sku) {
      throw new Error(`POST sku ${payload.sku} does not match the clicked card ${observed.sku}`);
    }
    if (payload.qty !== 1) throw new Error(`POST qty ${payload.qty} is not the card's 1`);
    console.log(
      `  ${payload.sku} x${payload.qty}; mini-cart ${observed.beforeCount} -> ${observed.afterCount}; ` +
      `busy cards max ${observed.maxBusy}/${observed.buttons}`
    );
  } finally {
    cdp.close();
    if (child.exitCode === null) {
      await new Promise((resolve) => {
        child.once('exit', resolve);
        child.kill('SIGKILL');
      });
    }
    rmSync(profile, { recursive: true, force: true });
  }
}

const steps = [
  ['storefront URLs match browser origin', () => checkStorefrontUrls()],
  ['admin login', () => login()],
  [
    'select product',
    () => {
      // Used verbatim: cart creation validates it exists and is enabled.
      sku = CHECKOUT_SKU;
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
      const data = await graphql(`query { cart(id: "${cartId}") { items { productSku } } }`);
      const line = (data?.cart?.items ?? []).find((item) => item.productSku === sku);
      if (!line) throw new Error(`cart does not carry ${sku}`);
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
    'order item snapshot',
    async () => {
      const data = await graphql(`query { order(uuid: "${orderId}") {
        items { productSku qty productPrice { value } variantOptions { attributeCode optionText } }
      } }`);
      const items = data?.order?.items ?? [];
      const item = items.find((line) => line.productSku === sku);
      if (!item) {
        throw new Error(
          `order has no item for ${sku}: ${items.map((line) => line.productSku).join(', ') || 'no items'}`
        );
      }
      const expected = KNOWN_VARIANTS[sku];
      if (expected) {
        const price = item.productPrice?.value;
        if (typeof price !== 'number' || Math.abs(price - expected.price) > 0.001) {
          throw new Error(`${sku} unit price ${price} is not the expected ${expected.price}`);
        }
        const size = (item.variantOptions ?? []).find((option) => option.attributeCode === 'size');
        if (size?.optionText !== expected.size) {
          throw new Error(`${sku} Size snapshot is '${size?.optionText}' not '${expected.size}'`);
        }
      }
      console.log(`  order item ${item.productSku} x${item.qty} at ${item.productPrice?.value}`);
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
  ],
  ['add to cart only marks the clicked card busy (browser)', () => checkAddToCartFlash()]
];

for (const [name, fn] of steps) {
  try {
    const result = await fn();
    if (result?.skip) {
      console.log(`SKIP ${name}: ${result.skip}`);
    } else {
      console.log(`PASS ${name}`);
    }
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`);
    process.exit(1);
  }
}
console.log('ALL CHECKOUT SMOKE STEPS PASSED');