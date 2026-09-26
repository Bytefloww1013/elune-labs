# Storefront theme, compliance, and crypto presentation

The theme package is `themes/elune`. Wallet storage and validation are `extensions/elune-payments`. Visual tokens are specified in [DESIGN.md](../../DESIGN.md). This document is the behavior of the components.

## 1. How the theme is selected

`config/default.json` sets `system.theme` to `elune`. The container mounts `./config` read-only. `evershop theme:active` is not required for the theme to stay selected across recreation.

Build:

```bash
docker compose exec app npm --prefix themes/elune run build
```

That script is `swc ./src -d dist --copy-files --strip-leading-paths`. CSS files are copied because of `--copy-files`. `themes/*/dist/` is gitignored.

*Source: [`config/default.json`](../../config/default.json), [`themes/elune/package.json`](../../themes/elune/package.json), [`.gitignore`](../../.gitignore)*

## 2. Chrome

| Piece | File | What it shows |
|---|---|---|
| Announcement | `pages/all/Announce.tsx` | `For research use only. Not for human consumption.` and `Prices in USD · Guest checkout` |
| Logo | `pages/all/Wordmark.tsx` | `/assets/brand/website_header_logo_transparent.png`, intrinsic 378×188, link name `Elune Labs — home` |
| Core logo slot | `pages/all/Logo.tsx` | Renders nothing. The query still requests `setting.logo`. |
| Navigation | `pages/all/Nav.tsx` | Home, New releases, Shop, FAQs, Payments, Shipping, Contact us |
| Search | `pages/all/SearchBox.tsx` | Renders nothing. Core `/search` still exists. |
| Account icon | `pages/all/CustomerIcon.tsx` | Renders nothing. Account routes still exist. |
| Cart cluster | `pages/all/MiniCartIcon.tsx` | Cart link (`aria-label` `Cart, N items`), `Shop all` → `/all`, and a `<details>` menu below 900px |
| Footer columns | `pages/all/FooterNav.tsx` | Catalogue, Information, Payment |
| Footer base | `pages/all/RuoFooter.tsx` | The RUO sentence and `© 2026 Elune Labs · Prices in USD` |

Shop is a `<details>` element. `useDismissableDetails` closes it on outside click and on Escape, and returns focus to the summary. The same helper is used by the phone menu. Categories are ordered by `CATEGORY_URL_KEYS` and dropped if the catalog query did not return that key. Cell counts print `NN compounds`, padded to two digits, with `00` when `products.total` is absent.

Information-column links are FAQs, Shipping, and Contact us. Payments is omitted there because the Payment column lists Bitcoin, `USDT (ERC-20)`, and Ethereum. Every one of those hrefs is `/faqs`.

`Shop all` in the header and `All products` in the menus are the same URL, `/all`.

*Source: [`themes/elune/src/pages/all/Nav.tsx`](../../themes/elune/src/pages/all/Nav.tsx), [`themes/elune/src/data/siteLinks.ts`](../../themes/elune/src/data/siteLinks.ts), [`themes/elune/src/pages/all/FooterNav.tsx`](../../themes/elune/src/pages/all/FooterNav.tsx), [`themes/elune/src/pages/all/MiniCartIcon.tsx`](../../themes/elune/src/pages/all/MiniCartIcon.tsx)*

## 3. Age gate

`pages/all/AgeGate.tsx`, area `body`, sort order 20.

On mount:

- If `window.location.pathname` starts with `/admin`, return.
- If any cookie crumb starts with `elune_age_ok=`, return.
- Otherwise show the dialog and add `elune-lock` on `document.body`.

Enter writes:

```
elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax
```

and removes `elune-lock`. Leave is `<a class="tlink" href="https://www.google.com">`, so it works before hydration. The keydown handler ignores Escape. Tab cycles the focusable controls in the panel.

Copy in the component:

- Title: `Are you 18 or older?`
- Notice label: `Research Chemical Notice`
- Body: products are sold as research chemicals for laboratory research use only; they are not food, dietary supplements, or drugs, and are not intended for human consumption.
- Confirm: `By entering, you confirm that you are at least 18 years old and accept our terms of sale.`
- Buttons: `I am 18 or older — Enter`, `Cancel — Leave`
- Foot: `This notice is advisory and stored only in a browser cookie for 30 days.`

The dialog is `role="dialog"` `aria-modal="true"` `aria-labelledby="age-gate-title"`.

*Source: [`themes/elune/src/pages/all/AgeGate.tsx`](../../themes/elune/src/pages/all/AgeGate.tsx)*

## 4. Research-use copy

Exact sentence `For research use only. Not for human consumption.`:

| Surface | File |
|---|---|
| Announcement bar | `pages/all/Announce.tsx` |
| Footer base | `pages/all/RuoFooter.tsx` |
| Product page | `pages/productView/RuoNotice.tsx` |

The product notice adds the label `Laboratory Research Notice (RUO)` and the sentence `This chemical compound is supplied strictly for in-vitro laboratory experimentation and analytical reference. Not for human, clinical, or veterinary administration.`

The specification table in `ProductSpecs.tsx` always ends with `The purity value is a product specification, not a batch test result.` Purity cells use `PURITY_DECLARATION` (`≥99%`) and the mono face, including when a spec record exists, because the Manrope subset has no U+2265 glyph. 22 of the 84 catalog SKUs have a record in `productSpecs.ts`; a SKU without one renders no specification section.

`ProductDescription.tsx` renders only when `getProductLiterature(sku)` returns a record. 22 of the 84 catalog SKUs have a summary. The citation block, when present, is introduced with: the studies describe the compound, not this product, not the batch, and not an analysis of it, and no certificate of analysis is published. The Epitalon sizes and both CJC-1295 (No DAC) SKUs have summaries and no `literature` array, so they show the section without citations.

The checkout-success panel does not repeat the RUO sentence. `ConfirmationStatus.tsx` relies on `RuoFooter` already being on the page.

*Source: [`themes/elune/src/pages/productView/RuoNotice.tsx`](../../themes/elune/src/pages/productView/RuoNotice.tsx), [`themes/elune/src/pages/productView/ProductSpecs.tsx`](../../themes/elune/src/pages/productView/ProductSpecs.tsx), [`themes/elune/src/pages/productView/ProductDescription.tsx`](../../themes/elune/src/pages/productView/ProductDescription.tsx), [`themes/elune/src/data/productLiterature.ts`](../../themes/elune/src/data/productLiterature.ts)*

## 5. Routes the theme body fills

| Path | Registered by | Body |
|---|---|---|
| `/` | EverShop homepage | `pages/homepage/Elune.tsx` |
| `/all` | `elune-catalog` `route.json` | `pages/allProducts/AllProducts.tsx` |
| `/new-releases` | `elune-catalog` `route.json` | `pages/newReleases/NewReleases.tsx` |
| `/<category url_key>` | EverShop category route | core category page plus `CatalogueHeading` |
| product URL | EverShop | description, specs, RUO notice |
| `/faqs`, `/shipping`, `/contact` | CMS pages created by the seeder | core CMS renderer, no theme page component |
| checkout, cart, account | EverShop | theme overrides listed below |

`/all` sorts by `name` with `localeCompare`. `/new-releases` sorts by descending `productId` and slices to 6. Both say so in the component comments: the 2.2.1 `products` field ignores a `sort` argument.

Empty states: `/all` links to `/` with `Browse the categories`. `/new-releases` links to `/all` with `View all products`.

*Source: [`extensions/elune-catalog/src/pages/frontStore/allProducts/route.json`](../../extensions/elune-catalog/src/pages/frontStore/allProducts/route.json), [`extensions/elune-catalog/src/pages/frontStore/newReleases/route.json`](../../extensions/elune-catalog/src/pages/frontStore/newReleases/route.json), [`themes/elune/src/pages/allProducts/AllProducts.tsx`](../../themes/elune/src/pages/allProducts/AllProducts.tsx), [`themes/elune/src/pages/newReleases/NewReleases.tsx`](../../themes/elune/src/pages/newReleases/NewReleases.tsx)*

## 6. Landing composition

`Elune.tsx` renders, under the shared chrome:

1. Hero. `h1`: `Research peptides. Direct from the source. Uncompromising purity.` Lede includes mono `≥99%` and mono `everyone`. Actions: `Browse the catalogue` → `/all`, `How ordering works` → `/faqs`. Proof line uses `CATEGORY_URL_KEYS.length` (`5`).
2. Plate 01 sheet when SKU `BPC5` is in the product query. Photo `/assets/plates/hero-photo.jpg` (file `themes/elune/public/assets/plates/hero-photo.jpg`), width/height attributes 1200×1591. Head chip text `Plate 01` uses `chip--beam`; the foot chip is category · strength. Spec rows are Purity, Form, Sequence, Storage, omitting empty values.
3. Ribbon, `role="region"` `aria-label="Storefront commitments"` `tabIndex={0}`. Five strings, duplicated, second list `aria-hidden`. Motion is in `homepage.scss` (64s drift, paused for reduced motion).
4. Category strip. Heading `Quality compounds, across five core categories.` Each cell links to the category URL and prints the count as `NN compounds`.
5. Four plates, SKUs `TR10`, `ET10`, `TB10`, `IP5`, numbered from 2. A missing SKU is skipped.
6. Night band. Heading `From recent orders.` Three review figures with photos `/assets/order/td-1.jpg`, `td-2.jpg`, `td-3.jpg`. Foot lines: `Collected from completed orders and published unedited. Names shortened to first name and last initial.` and the purity caveat.

Ribbon strings, verbatim:

1. `Tracked & discreet, flat rate shipping`
2. `Bitcoin, USDT (ERC-20), and Ethereum Accepted`
3. `84 SKUs across 1mg–1500mg sizes`
4. `Guest cart & checkout, no account required`
5. `Five core research categories: GLPs, Bioregulators, Recovery, GH Releasing, Other`

Items 3–5 carry counts and facts from this repository rather than claims: `scripts/catalog-data.json` (84 rows, 84 unique SKUs, 1mg–1500mg), the account-free checkout, and the five `CATEGORY_URL_KEYS`. They replace `Batch tracking for each vial`, `Best in class factory direct pricing`, and `Unbeatable delivery rate. Zero issues.`, which named a batch field, a price comparison, and a delivery measurement the repository has never held.

*Source: [`themes/elune/src/pages/homepage/Elune.tsx`](../../themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/homepage/homepage.scss`](../../themes/elune/src/pages/homepage/homepage.scss)*

## 7. Wallet extension

### GraphQL

```graphql
extend type Setting {
  cryptoWalletBtc: String
  cryptoWalletUsdt: String
  cryptoWalletEth: String
  cryptoWalletInstructions: String
}
```

Resolver rules in `CryptoWalletSetting.resolvers.js`:

- BTC uses `isBitcoinAddress`.
- USDT and ETH use `isErc20Address`.
- A matching value is returned trimmed. Every other value is `null`.
- Instructions: if a `crypto_wallet_instructions` row exists, return `row.value` unchanged. If it does not, return:

```
Send the order total to one of the addresses above, then paste your transaction ID (TXID) into the TXID note field before placing the order. We confirm on-chain and ship after 1 network confirmation.
```

Predicates (`walletAddress.js`):

```
Bitcoin: /^(?:bc1[02-9ac-hj-np-z]{8,87}|[13][1-9A-HJ-NP-Za-km-z]{25,39})$/
ERC-20:  /^0x[0-9a-f]{40}$/i
```

The checkout label says native SegWit. The predicate also accepts legacy `1` and `3` addresses. Mixed-case ERC-20 is accepted. The comments in `walletAddress.js` state these are not checksum or on-chain checks.

### Admin card

`CryptoWalletSetting.tsx`, `areaId: 'paymentSetting'`, `sortOrder: 30`.

| Label | Input `name` | Rule |
|---|---|---|
| BTC Wallet | `crypto_wallet_btc` | blank, or Bitcoin shape |
| USDT — Ethereum (ERC-20) | `crypto_wallet_usdt` | blank, or ERC-20 shape |
| ETH Wallet | `crypto_wallet_eth` | blank, or ERC-20 shape |
| Instructions | `crypto_wallet_instructions` | no shape check |

USDT help text: `USDT is accepted on Ethereum (ERC-20) only. A TRON (TRC-20) address, or any other value that is not an Ethereum address, is never shown to customers as a payment destination.`

The card reads the GraphQL fields, which are already null for a bad shape, so a stored TRON value shows as an empty field.

### Tests

`extensions/elune-payments/tests/walletAddress.test.mjs`. Run `npm test` in that package (`node --test tests/`). Cases cover ERC-20 case and trim, TRON and placeholder rejection, Bitcoin acceptance and sentinel rejection, and the resolver returning null for `TPLACEHOLDER_REPLACE_ME`.

*Source: [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql`](../../extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.graphql), [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`](../../extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js), [`extensions/elune-payments/src/lib/walletAddress.js`](../../extensions/elune-payments/src/lib/walletAddress.js), [`extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx`](../../extensions/elune-payments/src/pages/admin/paymentSetting/CryptoWalletSetting.tsx), [`extensions/elune-payments/tests/walletAddress.test.mjs`](../../extensions/elune-payments/tests/walletAddress.test.mjs)*

## 8. Checkout presentation

`pages/checkout/CashOnDelivery.tsx` registers method `cod`:

- `nameRenderer` prints `setting.codDisplayName` and no cash logo.
- `formRenderer` is `WalletRails`: order total (`cart.grandTotal.text`), then the three rows.
- `checkoutButtonRenderer` calls `checkout()` from the checkout context. Labels are `Place Order`, `Placing Order...`, and `Order Placed`.
- When `orderPlaced` and `checkoutData.paymentMethod === 'cod'`, the browser navigates to `${checkoutSuccessUrl}/${orderId}`.

Copy uses `navigator.clipboard.writeText` when it exists, otherwise a temporary textarea and `document.execCommand('copy')`. Success toast: `Address copied to clipboard`. Failure toast: `Could not copy the address. Select it manually.` The row also shows `Copy failed — select the address and copy it manually.` The Copy icon is `lucide-react`'s `Copy`.

`components/frontStore/checkout/ShippingNote.tsx` is the note field. Title `Transaction ID (TXID)`, placeholder `Paste your BTC / USDT / ETH transaction ID (hash)`, three rows. It writes `updateCheckoutData({ note })`. The initial value is `checkoutData.note ?? cart.shippingNote ?? ''`. The icon is `lucide-react`'s `NotebookPen`. The field id comes from `useId()` because the checkout page mounts the component twice.

`config/default.json` sets `checkout.showShippingNote` to `true`. `ConfirmationStatus.tsx` shows the TXID only when that flag is true. Empty note copy: `Not provided with this order.` Closing line: `We check the transfer by hand and record it against this order.` It prints `paymentStatus.name` and `status.name` from the order query. It does not invent a status.

`CustomerInfo.tsx` is the core customer block with the green check disc removed.

Panel geometry is in `components/frontStore/checkout/checkout.scss`, using `--r-ctrl` for the wallet and TXID panels.

COD still has to be enabled in EverShop (`codPaymentStatus`, `codDisplayName`). This extension does not set those keys.

*Source: [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](../../themes/elune/src/pages/checkout/CashOnDelivery.tsx), [`themes/elune/src/components/frontStore/checkout/ShippingNote.tsx`](../../themes/elune/src/components/frontStore/checkout/ShippingNote.tsx), [`themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx`](../../themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx), [`config/default.json`](../../config/default.json)*

## 9. Assets the theme requests

| URL | File |
|---|---|
| `/assets/brand/website_header_logo_transparent.png` | `themes/elune/public/assets/brand/website_header_logo_transparent.png` |
| `/assets/brand/favicons/favicon-512x512.png` | same directory; seeder writes this path into `favicon` only when the setting is empty |
| `/assets/fonts/manrope-latin.woff2` | `themes/elune/public/assets/fonts/manrope-latin.woff2` |
| `/assets/fonts/jetbrains-mono-latin.woff2` | `themes/elune/public/assets/fonts/jetbrains-mono-latin.woff2` |
| `/assets/plates/hero-photo.jpg` | `themes/elune/public/assets/plates/hero-photo.jpg` |
| `/assets/order/td-1.jpg`, `td-2.jpg`, `td-3.jpg` | `themes/elune/public/assets/order/` |

`docs/refs/assets/brand/` and `docs/refs/assets/imgs/` hold a reference kit, including `Product-placeholder-vial-night-cap-moon-3-4.jpg`. The homepage does not request that path.

*Source: [`themes/elune/src/pages/all/Wordmark.tsx`](../../themes/elune/src/pages/all/Wordmark.tsx), [`themes/elune/src/pages/all/global.scss`](../../themes/elune/src/pages/all/global.scss), [`themes/elune/src/pages/homepage/Elune.tsx`](../../themes/elune/src/pages/homepage/Elune.tsx), [`scripts/seed-catalog.mjs`](../../scripts/seed-catalog.mjs)*
