# Product

Elune Labs is a single-storefront shop for research reference compounds. The running system is EverShop 2.2.1, theme `elune`, extensions `elune-payments` and `elune-catalog`, and the catalog in `scripts/catalog-data.json`.

## What a visitor can do

From a seeded deployment a visitor can open the landing page, browse five categories, open `/all` and `/new-releases`, read a product specification, add a line to the cart, and place a guest order. The payment step shows the order total and up to three wallet rails. The buyer pastes a transaction id into the order note. The order is created with `payment_status` `pending`. The owner captures it in the admin console, which is the image's COD capture route.

The header links are Home, New releases, Shop (the five categories), FAQs, Payments, Shipping, and Contact us. Payments, and the footer payment names, go to `/faqs`. There is no `/payments` route.

*Source: [`themes/elune/src/data/siteLinks.ts`](themes/elune/src/data/siteLinks.ts), [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## Catalog

Five categories, in this order: GLPs (`glps`), Bioregulators (`bioregulators`), Recovery (`recovery`), GH Releasing (`gh-releasing`), Other (`other`). Fourteen products, $29.99–$79.99, quantity 100. Size pairs share one native Size variant group and remain separate simple SKUs:

| Family | Children |
|---|---|
| `bpc-157` | `BPC157-5MG`, `BPC157-10MG` |
| `tb-500` | `TB500-5MG`, `TB500-10MG` |
| `cjc-1295-no-dac` | `CJC1295-5MG`, `CJC1295-10MG` |

The other eight SKUs are ungrouped. Commerce fields (name, SKU, price, quantity, category) come from `scripts/catalog-data.json`. The file has no `images` key. The seeder's create call sends `images: []`.

Specification rows come from `themes/elune/src/data/productSpecs.ts`, one record per SKU. Every record includes purity `≥99%`, form `Lyophilized powder`, and storage `Store cool and dry, away from direct light`. CAS, formula, molecular weight, and sequence are present only where that file sets them. The product page omits a row whose value is absent. There is no batch or lot field in the catalog file or the spec table.

"About this compound" comes from `themes/elune/src/data/productLiterature.ts`. All fourteen SKUs have a summary. Epitalon and both CJC-1295 (No DAC) sizes have no citation list. Epitalon's summary says the literature is not cited because the titles would read as efficacy claims. The CJC summaries say the conjugated CJC-1295 paper describes a different molecule, so no references are listed.

*Source: [`scripts/catalog-data.json`](scripts/catalog-data.json), [`themes/elune/src/data/productSpecs.ts`](themes/elune/src/data/productSpecs.ts), [`themes/elune/src/data/productLiterature.ts`](themes/elune/src/data/productLiterature.ts)*

## Payment and fulfilment

The storefront accepts Bitcoin, USDT on Ethereum (ERC-20), and Ethereum. A rail appears as an address only when the saved setting matches that rail's shape. Otherwise the row says `Not configured — contact us before sending.` and has no Copy control. The catalog seeder does not write wallet settings. Whatever is in the database is an admin edit, not a value from this repository.

Checkout does not claim an automatic detection time. The confirmation panel says `We check the transfer by hand and record it against this order.` If the instructions setting row is missing, the GraphQL resolver supplies a default that does say the order ships after one network confirmation. Saving instructions replaces that sentence.

The initial Shipping and FAQ pages, created only when those CMS pages do not already exist, say orders ship after a hand confirmation, tracked and discreet, fulfilled by a supplier at launch, and that cold-chain and in-house packing are not promised. A later admin edit of those pages is kept.

*Source: [`extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js`](extensions/elune-payments/src/graphql/types/Setting/CryptoWalletSetting.resolvers.js), [`themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx`](themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx), [`scripts/seed-catalog.mjs`](scripts/seed-catalog.mjs)*

## Compliance the theme enforces

First storefront visit with no `elune_age_ok` cookie shows a dialog titled `Are you 18 or older?`. Enter sets `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax` (30 days). Leave is a link to `https://www.google.com`. The gate does not run when the path starts with `/admin`, and theme code is not on API routes. It is a browser notice, not an authentication check.

These surfaces render `For research use only. Not for human consumption.` unchanged:

- announcement bar
- footer base row
- product notice, plus a second sentence that the compound is supplied for in-vitro laboratory experimentation and analytical reference and is not for human, clinical, or veterinary administration

The specification table adds `The purity value is a product specification, not a batch test result.` The literature block says the citations are not a certificate of analysis and not a test of the supplied batch.

The landing ribbon also prints three lines this repository cannot substantiate: `Batch tracking for each vial`, `Best in class factory direct pricing`, and `Unbeatable delivery rate. Zero issues.` They are the strings in `Elune.tsx`. They are not catalog fields.

*Source: [`themes/elune/src/pages/all/AgeGate.tsx`](themes/elune/src/pages/all/AgeGate.tsx), [`themes/elune/src/pages/all/Announce.tsx`](themes/elune/src/pages/all/Announce.tsx), [`themes/elune/src/pages/productView/RuoNotice.tsx`](themes/elune/src/pages/productView/RuoNotice.tsx), [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx)*

## What the interface is

Light canvas (`--snow` `#f7f8fa`), ink (`--night` `#16233c`), one lime accent (`--beam` `#cff26f`) used for text selection, the Plate 01 chip, and the review quote bar. Category names on the home strip use the five accent tokens. The header mark is the raster `website_header_logo_transparent.png` at a 48px display height, linked home with accessible name `Elune Labs — home`. The component file is still `Wordmark.tsx`. It does not render the letters `ELUNE LABS` as text.

The header has no search field and no account icon. Core still serves `/search` and the account routes. Checkout can still link to them.

Landing reviews, names, cities, dates, and the three order photographs are constants in `Elune.tsx`. The transparency line says they were collected from completed orders. Nothing in this repository ties those quotes to an order row.

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css), [`themes/elune/src/pages/all/Wordmark.tsx`](themes/elune/src/pages/all/Wordmark.tsx), [`themes/elune/src/pages/all/SearchBox.tsx`](themes/elune/src/pages/all/SearchBox.tsx), [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx)*

## Operating boundaries

- One currency path in the copy: prices in USD. The announcement bar and footer say so. The seeder does not set a currency code.
- No card gateway, no on-chain watcher, and no analytics tag in `themes/elune/src`.
- Wallet addresses, COD display name, shipping rates, and CMS body copy are admin data. Wallet and shipping edits do not require a theme rebuild. CMS pages the seeder has already created are not patched on the next seed.
- Theme and extensions do not replace EverShop order creation. Capture is `POST /api/cod/captures`.
- Age gate and RUO copy are presentation. They do not block an API client.

*Source: [`themes/elune/src/pages/all/Announce.tsx`](themes/elune/src/pages/all/Announce.tsx), [`docker-compose.yml`](docker-compose.yml), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## Files that hold the product surface

| Topic | Path |
|---|---|
| Requirements that match the code | [SPEC-grok-unapproved.md](SPEC-grok-unapproved.md) |
| Visual system as implemented | [DESIGN-grok-unapproved.md](DESIGN-grok-unapproved.md) |
| Served brand rasters | `themes/elune/public/assets/brand/` |
| Reference kit (not the URLs the theme requests) | `docs/refs/assets/brand/`, `docs/refs/assets/imgs/` |
| Hero photograph the page requests | `themes/elune/public/assets/plates/hero-photo.jpg` (`/assets/plates/hero-photo.jpg`) |
| Review photographs the page requests | `themes/elune/public/assets/order/td-1.jpg`, `td-2.jpg`, `td-3.jpg` |

The larger files under `docs/refs/assets/` are the reference kit. The storefront `<img>` tags point at the files under `themes/elune/public/assets/`.

*Source: [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/all/Wordmark.tsx`](themes/elune/src/pages/all/Wordmark.tsx)*
