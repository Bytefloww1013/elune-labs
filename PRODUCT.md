# Product

Elune Labs is a single-storefront shop for research reference compounds. The running system is EverShop 2.2.1, theme `elune`, extensions `elune-payments` and `elune-catalog`, and the catalog in `scripts/catalog-data.json`.

## What a visitor can do

From a seeded deployment a visitor can open the landing page, browse five categories, open `/all` and `/new-releases`, read a specification where one is on record for that SKU, add a line to the cart, and place a guest order. The payment step shows the order total and up to three wallet rails. The buyer pastes a transaction id into the order note. The order is created with `payment_status` `pending`. The owner captures it in the admin console, which is the image's COD capture route.

The header links are Home, New releases, Shop (the five categories), FAQs, Payments, Shipping, and Contact us. Payments, and the footer payment names, go to `/faqs`. There is no `/payments` route.

*Source: [`themes/elune/src/data/siteLinks.ts`](themes/elune/src/data/siteLinks.ts), [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx), [`scripts/smoke-checkout.mjs`](scripts/smoke-checkout.mjs)*

## Catalog

Five categories, in this order: GLPs (`glps`, 17 SKUs), Bioregulators (`bioregulators`, 17), Recovery (`recovery`, 18), GH Releasing (`gh-releasing`, 11), Other (`other`, 21). That is 84 products, $14–$340, quantity 100 throughout. 29 families hold 70 of those SKUs and share one native Size variant group per family; the remaining 14 SKUs are standalone. Sibling sizes stay separate simple SKUs, each with its own SKU string and price:

| Family | Children |
|---|---|
| `retatrutide` | `RT5`, `RT10`, `RT15`, `RT20`, `RT30`, `RT40`, `RT60` |
| `tirzepatide` | `TR10`, `TR15`, `TR20`, `TR30`, `TR40`, `TR60` |
| `bpc-tb` | `BB10`, `BB20`, `BB30` |
| `mots-c` | `MS10`, `MS20`, `MS40` |
| `tesamorelin` | `TSM5`, `TSM10`, `TSM20` |
| `bpc-157` | `BPC5`, `BPC10` |
| `tb-500` | `TB5`, `TB10` |
| `cjc-1295-no-dac` | `CND5`, `CND10` |

The other 21 families are two-size pairs (`AA5`/`AA10`, `GHKS0`/`GHK100`, `GTT600`/`GTT1500`, …). The standalone SKUs include the multi-component blends (`BBG70`, `KLOW`, `CP10`) and singles such as `IF1`, `AR100`, and `P1`. Commerce fields (name, SKU, size, family, price, quantity, category) come from `scripts/catalog-data.json`. The file has no `images` key. The seeder's create call sends `images: []`.

Specification rows come from `themes/elune/src/data/productSpecs.ts`, keyed by SKU. 22 of the 84 SKUs carry a record: nine compounds — tirzepatide, epitalon, BPC-157, TB-500, ipamorelin, CJC-1295 (No DAC), semax, selank, GHK-Cu — and every size of a compound shows that compound's one record. The other 62 SKUs have no record and render no specification section at all, not an empty table and not a placeholder row. Multi-component blends carry no record either, because no single molecule's record would be true of a blend. Every record includes purity `≥99%`, form (`Lyophilized powder`, `Powder` for GHK-Cu), and storage `Store cool and dry, away from direct light`. CAS, formula, molecular weight, and sequence are present only where that file sets them. The product page omits a row whose value is absent. There is no batch or lot field in the catalog file or the spec table.

"About this compound" comes from `themes/elune/src/data/productLiterature.ts`, keyed by SKU, covering the same 22 SKUs as the spec map. Seven of the nine compounds list one or two primary references. Epitalon (`ET10`, `ET50`) and CJC-1295 (No DAC) (`CND5`, `CND10`) carry a summary with no citation list: Epitalon's summary says the literature is not cited because the titles would read as efficacy claims, and the CJC summary says the conjugated CJC-1295 paper describes a different molecule, so no references are listed. The other 62 SKUs render no description section. Nothing in either map is a certificate of analysis or a batch test.

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

The landing ribbon prints five lines from `COMMITMENTS` in `Elune.tsx`. The first two restate the store's own seeded copy: `Tracked & discreet, flat rate shipping`, which matches the Shipping and FAQ pages, and `Bitcoin, USDT (ERC-20), and Ethereum Accepted`, the three checkout rails. The other three are readable from this repository: `84 SKUs across 1mg–1500mg sizes`, the 84 rows in `scripts/catalog-data.json`; `Guest cart & checkout, no account required`; and `Five core research categories: GLPs, Bioregulators, Recovery, GH Releasing, Other`, the five `url_key`s in `themes/elune/src/data/categories.ts`. The earlier batch-tracking, superlative-pricing, and delivery-rate lines (`Batch tracking for each vial`, `Best in class factory direct pricing`, `Unbeatable delivery rate. Zero issues.`) are gone.

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
| Requirements that match the code | [SPEC.md](SPEC.md) |
| Visual system as implemented | [DESIGN.md](DESIGN.md) |
| Served brand rasters | `themes/elune/public/assets/brand/` |
| Reference kit (not the URLs the theme requests) | `docs/refs/assets/brand/`, `docs/refs/assets/imgs/` |
| Hero photograph the page requests | `themes/elune/public/assets/plates/hero-photo.jpg` (`/assets/plates/hero-photo.jpg`) |
| Review photographs the page requests | `themes/elune/public/assets/order/td-1.jpg`, `td-2.jpg`, `td-3.jpg` |

The larger files under `docs/refs/assets/` are the reference kit. The storefront `<img>` tags point at the files under `themes/elune/public/assets/`.

*Source: [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/all/Wordmark.tsx`](themes/elune/src/pages/all/Wordmark.tsx)*
