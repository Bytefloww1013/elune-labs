# 8.2 — Theme + Compliance + Payment Presentation (Design)

Bead: `elune-labs-tvg.8.2` · Parent: `elune-labs-tvg.8` · Spec: SPEC.md FR-3, FR-4, FR-5; ADR #3, #5, #7, #8 · Pinned engine: `evershop/evershop:2.2.1`

**Verification method.** Every EverShop claim below was checked against the GitHub tag `v2.2.1` (repo file reads; tag exists and npm `@evershop/evershop` latest == 2.2.1, so the docs site describes this line) and/or https://evershop.io/docs. Repo paths are cited as `…@v2.2.1`. The handful of items **not** individually verified are marked `[INFERENCE]`. Decisions locked by closed plan beads (stack, payments, compliance, theme, catalog) are respected, not relitigated.

---

## 1. Theme scaffold — `theme:create` for EverShop 2.2.1

### 1.1 What `theme:create` actually generates

`theme:create` is **interactive only** (prompt: "Enter new theme name…", validated `/^[A-Za-z0-9_-]+$/`, refuses duplicates). Source: `packages/evershop/src/bin/theme/create.ts@v2.2.1`. Scaffold tree:

```text
themes/elune/
├── package.json      # { name, version 0.1.0, type: "module", private, scripts.build = "tsc" }
├── tsconfig.json     # NodeNext, jsx react, outDir ./dist, @components/* path alias → src + core src
└── src/pages/homepage/Elune.tsx   # starter master component (default export + layout {areaId:'content',sortOrder:10})
```

`@components/*` resolves **in order**: theme `dist/components/` → extension `dist/components/` → core `node_modules/@evershop/evershop/dist/components/` (docs: Templating → Component Resolution Order). Placing a file under the theme at the same `@components` path **overrides that shared component everywhere**, including inside core modules. Master-level components (page files) override by **same folder + same filename** (e.g. `pages/checkout/CashOnDelivery.tsx` replaces the core checkout component of the same key).

**Change vs scaffold:** keep everything, but switch `scripts.build` to `"swc ./src -d dist --copy-files --strip-leading-paths"` (docs: Theme Overview). Plain `tsc` emits only JS — our theme ships CSS assets (`tailwind.css`, `global.scss`), which `tsc` would silently drop. `[verified docs; swc is what core's own compile script uses]`

### 1.2 Activation and referencing

- Root `package.json` workspaces gains `"themes/*"`, then `npm install` (docs: Theme Overview).
- The active theme is the `system.theme` config key. `theme:active` writes it into `config/default.json` and optionally installs widget/placement content from `theme.json` **into the DB**. Consequences for this project (agreed with 8.1):
  - `system.theme: "elune"` lives in the **repo-committed** `config/default.json` (compose keeps `./config:/app/config:ro` — 8.1 D2). `theme:active` is **not** part of container bootstrap; it is only ever needed if we later add `theme.json` widget content, run host-side with config temporarily rw.
  - This theme is **presentation-only** — no `theme.json`, no widget content. Nothing to install.
- Build sequence after theme edits (FR-1 command, runbook owned by 8.1):
  ```bash
  docker compose exec app sh -lc "npm run build --workspace=themes/elune && npm run build"
  ```
- Themes customize **storefront only**. Admin pages cannot be overridden by themes (docs warning; enforced by the `pages/admin` / `pages/frontStore` split) — so the age gate and every theme hook below are structurally incapable of touching `/admin`.

### 1.3 Theme file inventory (everything we add)

```text
themes/elune/
├── package.json, tsconfig.json                          # scaffold + swc build script
└── src/
    ├── pages/
    │   ├── all/
    │   │   ├── TailwindCss.tsx + tailwind.css + shadcn.css   # twizzed core; token home (§1.4)
    │   │   ├── GlobalCss.tsx + global.scss                    # fonts, .card-icons{display:none}, body lock class
    │   │   ├── Wordmark.tsx              # layout {areaId:'headerMiddleLeft', sortOrder:10}
    │   │   ├── AgeGate.tsx               # layout {areaId:'body', sortOrder:20}   (§2)
    │   │   └── RuoFooter.tsx             # layout {areaId:'footerBottom', sortOrder:5}  (§2.4)
    │   ├── checkout/
    │   │   └── CashOnDelivery.tsx        # master override of core COD payment step (§4)
    │   ├── categoryView/
    │   │   └── CategoryAccent.tsx        # category title accent from token trio (§1.4)
    │   └── productView/
    │       └── RuoNotice.tsx             # layout {areaId:'content', sortOrder:60}  (§2.4)
    └── components/frontStore/checkout/
        └── ShippingNote.tsx              # shared override via @components resolution (§4.3)
```

`TailwindCss.tsx` and `GlobalCss.tsx` are copied with `npx evershop theme:twizz` (docs: Styling — it copies the component **and** its stylesheet deps). Every master component carries `export default` + `export const layout`.

Hook targets verified against core: storefront master `Base.tsx` (`modules/base/pages/frontStore/all/Base.tsx@v2.2.1`) declares `layout {areaId:'body', sortOrder:1}` and renders shared `Header`/`Footer` around the `content` Area; `Footer.tsx@v2.2.1` declares Areas `footerTop`, `footerMiddle{Left,Center,Right}`, `footerBottom` (all `isGlobal`). Header Areas per docs: `headerTop`, `headerMiddle{Left,Center,Right}`, `headerBottom`. `[areaId 'body' as the parent of Base: docs-cited via Base's layout export; the root Area component itself not individually read — fallback if it misbehaves: render AgeGate with areaId 'content', sortOrder 5]`

### 1.4 Palette / typography tokens (placeholder values, designer-swappable)

Tokens live as CSS custom properties on `:root` in the theme's `shadcn.css` (copied via `tailwind.css`'s `@import './shadcn.css'`), mapped into Tailwind v4 through `@theme inline` in `tailwind.css` — there is no `tailwind.config.js` (Tailwind v4 is config-in-CSS; docs: Styling). Swapping the look = editing token values only; all components reference utility classes (`bg-primary`, `text-accent`, `font-sans`) that read these vars.

```css
/* themes/elune/src/pages/all/shadcn.css — :root overrides (placeholder values) */
:root {
  /* Elune Labs look — dark violet + lavender on near-black */
  --background: oklch(0.16 0.02 300);        /* near-black violet page bg */
  --foreground: oklch(0.93 0.01 300);        /* off-white text */
  --primary: oklch(0.55 0.20 295);           /* dark violet — buttons, links, prices */
  --primary-foreground: oklch(0.98 0 0);
  --accent: oklch(0.78 0.09 305);            /* lavender — badges, category accents, hover */
  --accent-foreground: oklch(0.18 0.03 300);
  --card: oklch(0.20 0.02 300);              /* card surfaces */
  --border: oklch(0.30 0.02 300);
  --radius: 0.5rem;

  /* Category accents — keyed by category url_key (Peptides / SARMs / Nootropics) */
  --accent-peptides: oklch(0.75 0.12 195);   /* teal */
  --accent-sarms: oklch(0.75 0.14 40);       /* amber */
  --accent-nootropics: oklch(0.75 0.12 130); /* green */

  /* Typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

@theme inline {  /* in tailwind.css — add alongside core mappings */
  --color-accent: var(--accent);
  --font-sans: var(--font-sans);
}
```

- **Wordmark** (`all/Wordmark.tsx`): pure text — `<span class="font-sans font-bold tracking-[0.35em] text-2xl">ELUNE&nbsp;LABS</span>`, `text-accent` on "LABS". No logo file; designer restyles by editing token values / this one component. Core `Header` renders a logo only when `themeConfig.logo` is set — we leave it unset, so the area is ours. `[verified: Footer core icon block + themeConfig.logo usage in configExample; header logo rendering not individually read]`
- **Category accents** (`categoryView/CategoryAccent.tsx`): reads the category `url_key` from the page context and applies `style={{ borderBottomColor: 'var(--accent-<url_key>)' }}` to the category title; unknown keys fall back to `--accent` (lavender).
- **Footer cleanup**: `GlobalCss.tsx` ships `.card-icons{display:none}` — hides the core Visa/MC/PayPal SVG block in `footerBottom` (core `Footer.tsx@v2.2.1`). Copyright string is data, not code: config `themeConfig.copyRight` = `"© 2026 Elune Labs. All rights reserved."` (repo `config/default.json`; core `Footer` receives it as `copyRight` — verified).
- Core ships **light-only** tokens (no `.dark` block in core `tailwind.css`). Our near-black look is achieved by overriding `:root` values directly — no `.dark` class mechanics needed. Keep `@custom-variant dark` from core when twizzing (docs warning).

---

## 2. Age gate + RUO compliance

Client-side, advisory-only per SPEC ADR #3. Cookie contract (SPEC §4):

| name | value | path | max-age | SameSite |
|---|---|---|---|---|
| `elune_age_ok` | `"1"` | `/` | `2592000` (30 days) | `Lax` |

(`HttpOnly` is impossible client-side; `Secure` omitted because v1 is http://localhost. Advisory only — never an auth boundary, never enforced server-side.)

### 2.1 Hook point and /admin + /api exclusion

`all/AgeGate.tsx` — a master component in `pages/all/` loads on **every storefront page** only. Exclusion is structural, no path sniffing:

- Themes cover `frontStore` pages only; `pages/admin` pages are separate and theme-immune (docs: Templating warning).
- `/api/*` routes return JSON without rendering React at all — no storefront component tree exists there.

`[INFERENCE — cheap belt-and-braces guard, one line, optional: bail early if `location.pathname.startsWith('/admin')`; the structural argument above is the real guarantee]`

### 2.2 Behavior

```text
on mount:
  read document.cookie → elune_age_ok present → render nothing
  absent/expired →
    render fixed fullscreen overlay <div role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
    add class .elune-lock to <body> (GlobalCss defines .elune-lock{overflow:hidden})
on click [I am 18 or older — Enter]:
  document.cookie = "elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax"
  remove .elune-lock, unmount
on click [Cancel — Leave]:
  window.location = "https://www.google.com"
```

Styling via `text-primary`/`bg-card` token classes + `tracking-[0.35em]` wordmark — no bespoke dialog dependency beyond classes; it is one component rendering nothing after acceptance.

### 2.3 Exact modal copy

> **Are you 18 or older?**  *(id: `age-gate-title`)*
>
> Elune Labs products are sold as **research chemicals for laboratory research use only**. They are not food, dietary supplements, or drugs, and are **not intended for human consumption**. By entering, you confirm that you are at least 18 years old and accept our terms of sale.
>
> **[ I am 18 or older — Enter ]**  **[ Cancel — Leave ]**
>
> *This notice is advisory and stored only in a browser cookie for 30 days.*

### 2.4 RUO disclaimer — exact string and placement

Fixed string (SPEC FR-4):

> `For research use only. Not for human consumption.`

- **Footer** (every page): `all/RuoFooter.tsx` → `layout {areaId:'footerBottom', sortOrder:5}` — renders above the core copyright block (sortOrder 10). Muted small text, links optional.
- **Product page** (every product): `productView/RuoNotice.tsx` → `layout {areaId:'content', sortOrder:60}` — bordered accent-lavender notice rendered under the product details. `[sortOrder 60 chosen to land below core product info components; exact relative order not individually read — adjust to taste at build time]`
- Compliance smoke (SPEC §7): fresh context → modal; accept → cookie; reload → no modal; footer + product page contain the RUO string; `/admin` and `/api` unaffected.

---

## 3. ADR — where BTC / USDT (TRC-20) / ETH addresses + instructions live

### 3.1 Decision record

| | |
|---|---|
| **Context** | SPEC §4 wallet seam: 3 address strings + per-coin networks + instructions text in **one swappable place**; owner must replace placeholders **without code changes**. Placeholder addresses until real wallets exist (SPEC ADR #7). |
| **Decision** | **DB `setting` table, flat string keys, written once via the admin/REST settings API, read by a tiny `elune-payments` extension that exposes them on the GraphQL `Setting` type.** Presentation is a theme COD override that queries those fields. |

**Settings keys** (flat strings — no JSON-shape dependency, each trivially resolvable with core `getSetting()`):

| key | placeholder value |
|---|---|
| `crypto_wallet_btc` | `bc1qPLACEHOLDER_REPLACE_ME` (network label: Bitcoin — native SegWit) |
| `crypto_wallet_usdt` | `TPLACEHOLDER_REPLACE_ME` (network label: TRON — TRC-20) |
| `crypto_wallet_eth` | `0xPLACEHOLDER_REPLACE_ME` (network label: Ethereum — ERC-20) |
| `crypto_wallet_instructions` | "Send the order total to one of the addresses above, then paste your transaction ID (TXID) into the TXID note field before placing the order. We confirm on-chain and ship after 1 network confirmation." |

### 3.2 Options considered

- **(a) Custom key in `config/default.json` read by a theme component — REJECTED, root reason verified.** Storefront/theme components cannot read arbitrary config keys in 2.2.1. The app context exposes only the registry-built `appConfig` (`{tax, catalog, pageMeta}` — `lib/response/render.ts@v2.2.1`, `getValueSync('appConfig', …)`), and the GraphQL `ThemeConfig` type is **strictly typed** to `headTags` + `copyRight` (`modules/cms/graphql/types/ThemeConfig/ThemeConfig.graphql@v2.2.1`) — a custom key is unqueryable without an extension resolver *anyway*. And even with one: the key lives in a file bind-mounted **read-only** (8.1 D2), so "owner swaps address" = edit repo file + container rebuild/restart — the worst option for the SPEC's no-code-change rule.
- **(b) DB setting + tiny extension — CHOSEN.** The settings API upserts **every** body key: `POST /api/settings` (`modules/setting/api/saveSetting@v2.2.1` — route private/auth'd; arbitrary keys inserted, objects JSON-stored). The `Setting` GraphQL type is extended by modules exactly this way — pattern source: `modules/cod/graphql/types/CODSetting/CODSetting.graphql@v2.2.1` (`extend type Setting { … }` + resolver using core `getSetting()`). Swap path for the owner: **Admin → Settings → Payment card** (extension admin component, same pattern as `modules/cod/pages/admin/paymentSetting/CODSetting.tsx@v2.2.1`) or one REST call — value lands in `postgres-data`, survives image upgrades and container recreation, zero restarts.
- **(c) Theme-level config file — REJECTED, no such mechanism.** `theme.json` is a content manifest (widgets/placements/metafields), not runtime config; nothing loads arbitrary files from `themes/<name>/` (docs: Theme Overview, CLI docs). (c) does not exist in 2.2.1.

### 3.3 Extension inventory — `extensions/elune-payments/`

```text
extensions/elune-payments/
├── src/graphql/types/Setting/CryptoWalletSetting.graphql
│     extend type Setting { cryptoWalletBtc: String  cryptoWalletUsdt: String
│                          cryptoWalletEth: String  cryptoWalletInstructions: String }
├── src/graphql/types/Setting/CryptoWalletSetting.resolvers.js
│     # each field: getSetting('crypto_wallet_btc', 'bc1qPLACEHOLDER_REPLACE_ME') …
└── src/pages/admin/paymentSetting/CryptoWalletSetting.tsx
      # layout {areaId:'paymentSetting', sortOrder:30}; 4 InputFields; query setting {…}
```

Registered in repo `config/default.json` → `system.extensions: [{name:"elune-payments", resolve:"extensions/elune-payments", enabled:true}]` (shape verified: `configExample.text@v2.2.1`). Extension reads by the theme override in §4.

### 3.4 Consequences and upgrade risk

- **Wins:** owner swap without code/rebuild/restart; one place (spec seam); theme stays presentation-only; works with the ro config mount of 8.1.
- **Cost:** one 3-file extension touching core GraphQL/admin extension API — the same API every module uses. Risk rated **low**; the image pin (`2.2.1`) controls exposure regardless, and the extension is the first thing to re-verify on upgrade.
- **Upgrade path:** if EverShop later offers a native custom-settings UI, the keys and their consumers stay identical — only the 3 files die.

---

## 4. COD presentation — reading as crypto payment at checkout

### 4.1 Enable + display name (data only)

Admin → Settings → Payment (or `POST /api/settings`): `codPaymentStatus = 1`, `codDisplayName = "Crypto Payment (BTC / USDT / ETH)"`. Verified mechanics: `modules/cod/bootstrap.ts@v2.2.1` reads `getSetting('codDisplayName', 'Cash on Delivery')` and gates the method on `getSetting('codPaymentStatus', 0)` (a `system.cod.status` config override also exists — we do **not** use it; settings-based stays DB-backed). The admin card fields `codDisplayName` / `codPaymentStatus` are editable in `/admin` → Settings → Payment (verified `modules/cod/pages/admin/paymentSetting/CODSetting.tsx@v2.2.1`). **No config edit, no code.**

### 4.2 Payment-step UI surface (what 2.2.1 actually exposes — verified)

The COD payment step is a master component of the `checkout` page: `modules/cod/pages/frontStore/checkout/CashOnDelivery.tsx@v2.2.1`. It registers with the checkout payment step (`registerPaymentComponent('cod', …)`):

- `nameRenderer` — the method row; renders `setting.codDisplayName` **plus a hardcoded base64 "Cash On Delivery" logo image**;
- `formRenderer` — the step body; **copy hardcoded**: "Conveniently pay with cash at your doorstep when your order is delivered.";
- `checkoutButtonRenderer` — the Place Order button (keep verbatim);
- component layout: `areaId:'checkoutFormAfter', sortOrder:10`; GraphQL query `setting { codDisplayName }`.

Customization surfaces for this file: (1) **theme master override** — same folder+filename in the theme (`pages/checkout/CashOnDelivery.tsx`, route folder `checkout`) replaces it; (2) a payment-method extension module. SPEC ADR #8 allows either ("small payment-method extension **or** COD theme override").

**Chosen: (1) theme master override** — presentation-only (renderers + query), no order/mutation logic, lighter than an extension. Re-verify the override against core on engine upgrade (pinned image controls exposure).

### 4.3 The override + TXID note re-label

`themes/elune/src/pages/checkout/CashOnDelivery.tsx` — copy of core file, two renderers replaced:

- `nameRenderer`: drop the base64 cash logo; render `setting.codDisplayName` text only.
- `formRenderer`: render `setting { codDisplayName cryptoWalletBtc cryptoWalletUsdt cryptoWalletEth cryptoWalletInstructions }` (query extended accordingly) as:

```text
[crypto_wallet_instructions]

BTC  — Bitcoin (native SegWit):  <crypto_wallet_btc>
USDT — TRON (TRC-20):            <crypto_wallet_usdt>
ETH  — Ethereum (ERC-20):        <crypto_wallet_eth>
```

- Keep `registerPaymentComponent('cod', …)`, `checkoutButtonRenderer`, `layout`, and the `useEffect` redirect verbatim — order creation path untouched.

**TXID capture — verified.** The stock checkout **"Order Note"** field exists and is enabled: shared component `components/frontStore/checkout/ShippingNote.tsx@v2.2.1` (title "Order Note", textarea → `checkoutData.note` → server persists `cart.shipping_note`); rendered on the checkout page (form flow + summary rail) when `showShippingNote` is true — resolver `modules/checkout/graphql/types/CheckoutSetting/CheckoutSetting.resolvers.js@v2.2.1` returns `getConfig('checkout.showShippingNote', true)` (default **true**; explicit `checkout.showShippingNote: true` committed in repo config for clarity). REST alternative confirmed: `addShippingNote` → `POST /carts/:cart_id/shippingNotes`, `access: "public"` (`modules/checkout/api/addShippingNote/route.json@v2.2.1`).

Re-label so it reads as a TXID field — shared-component override via `@components` resolution (§1.1): `themes/elune/src/components/frontStore/checkout/ShippingNote.tsx` = copy of core, changed only:

- `CardTitle`: `_('Transaction ID (TXID)')`
- placeholder: `_('Paste your BTC / USDT / ETH transaction ID (hash)')`

Mechanics unchanged (`checkoutData.note` → `cart.shipping_note` → carried onto the order; success-page + admin display use core's own read components — left untouched; order data path owned by 8.3). Why not a dedicated TXID column/mutation: SPEC FR-3/§4 fixes the order note as the TXID carrier; a dedicated field would add an order column + GraphQL surface for zero presentation gain.

### 4.4 Payment-presentation smoke (maps to SPEC §7)

1. Checkout → Payment step shows "Crypto Payment (BTC / USDT / ETH)", three network-labelled address blocks (from settings), no cash doorstep copy, no cash logo.
2. TXID field titled "Transaction ID (TXID)" above Place Order; note text lands on the order (`order.shipping_note`) and is visible in `/admin` → Orders.
3. Place order → `payment_status = pending`; admin Capture → `paid` (verified capture flow by 8.3; built-in `cod` method, no client-side paid path).
4. Swap `crypto_wallet_btc` in admin → reload checkout → new address rendered. No rebuild, no restart.

---

## 5. Cross-slice ownership

| Owner | Scope |
|---|---|
| **This doc (8.2)** | Theme scaffold/tokens/wordmark, age gate + copy, RUO placement, wallet-settings ADR + `elune-payments` extension, COD payment-step presentation, TXID note re-label |
| 8.1 (ArchDeploy) | Compose/volumes, config bind-mount (ro), `system.theme` committed config key, build/restart runbook, bootstrap runbook |
| 8.3 (ArchCatalog) | Seed script, catalog JSON, capture verification + checkout E2E checklist; **wallet settings explicitly out of scope there** |
| Parent 8 | Assembles ARCHITECTURE.md / IMPLEMENTATION.md from the three docs |

**Config keys touched (repo `config/default.json`):** `system.theme: "elune"`; `themeConfig.copyRight: "© 2026 Elune Labs. All rights reserved."`; `checkout.showShippingNote: true` (explicit; default true); `system.extensions: [elune-payments]`. `system.cod` deliberately **not** set (COD enable is a DB setting, §4.1).

**Appendix — evidence:** repo reads @ tag `v2.2.1`: `bin/theme/create.ts`, `lib/response/render.ts`, `modules/cod/{bootstrap.ts, pages/frontStore/checkout/CashOnDelivery.tsx, pages/admin/paymentSetting/CODSetting.tsx, graphql/types/CODSetting/CODSetting.resolvers.js}`, `modules/setting/graphql/types/Setting/Setting.resolvers.js`, `modules/setting/api/saveSetting/{route.json,saveSetting.js}`, `modules/cms/graphql/types/ThemeConfig/ThemeConfig.graphql`, `modules/checkout/graphql/types/CheckoutSetting/CheckoutSetting.resolvers.js`, `modules/checkout/api/addShippingNote/route.json`, `components/frontStore/checkout/ShippingNote.tsx`, `components/frontStore/Footer.tsx`, `modules/base/pages/frontStore/all/Base.tsx`, `modules/checkout/pages/frontStore/checkout/Checkout.tsx`, `configExample.text`, `package.json`. Docs: https://evershop.io/docs/development/theme/{theme-overview,templating,styling}, /docs/development/knowledge-base/{command-lines,pages}. Unverified items marked `[INFERENCE]` inline (age-gate parent Area, productView sortOrder, header logo rendering, swc-build recommendation source).
