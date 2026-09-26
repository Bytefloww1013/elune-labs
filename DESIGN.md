# Design system: Elune Labs (Lunar Plates)

The storefront theme `themes/elune` implements this system. Tokens are CSS variables. Components consume those variables. This document describes the files in the tree.

The landing prototype file is `docs/design/.mockups/elune-landing-mockup-v5.html`. Where that file and the theme disagree, the theme is what renders.

## 1. Where the system lives

| Concern | File |
|---|---|
| Raw tokens | `themes/elune/src/pages/all/shadcn.css` `:root` |
| Tailwind v4 names | `themes/elune/src/pages/all/tailwind.css` `@theme inline` |
| Type, fields, selection, focus, chips, entrance | `themes/elune/src/pages/all/global.scss` |
| Header, footer, age gate | `themes/elune/src/pages/all/chrome.scss` |
| Catalog plates and product page | `themes/elune/src/pages/all/catalog.scss` |
| Homepage bands | `themes/elune/src/pages/homepage/homepage.scss` |
| Checkout panels | `themes/elune/src/components/frontStore/checkout/checkout.scss` |

`TailwindCss.tsx`, `GlobalCss.tsx`, and `CatalogCss.tsx` inject the first three stylesheets from the `head` area. `Nav.tsx` imports `chrome.scss`. `Elune.tsx` imports `homepage.scss`.

`tailwind.css` still contains `@custom-variant dark (&:is(.dark *))` from the theme scaffold. The same file states that no `.dark` class is added. No `.dark` rule and no `prefers-color-scheme` block exist under `themes/elune/src`.

Hex literals for the palette are in `shadcn.css` only. Component SCSS uses `var(--…)` except for two shadows: `rgba(22, 35, 60, 0.22)` on the age-gate sheet (`chrome.scss`) and `rgba(0, 0, 0, 0.22)` on the review card (`homepage.scss`).

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css), [`themes/elune/src/pages/all/tailwind.css`](themes/elune/src/pages/all/tailwind.css), [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss)*

## 2. Color

Declared on `:root` in `shadcn.css`.

| Token | Value | Role in the stylesheet comments and components |
|---|---|---|
| `--snow` | `#f7f8fa` | Page canvas |
| `--panel` | `#ffffff` | Cards, menus, sheets, fields |
| `--mist` | `#eceff3` | Bands, hover fill, announcement bar |
| `--hairline` | `#dbdfe6` | 1px edges on light surfaces |
| `--night` | `#16233c` | Ink, button fill, focus ring, night-band ground |
| `--slate` | `#5a6479` | Secondary text |
| `--ash` | `#b7bdc9` | Disabled chrome, sheet edge, rest underline |
| `--beam` | `#cff26f` | Selection, `.chip--beam`, review quote bar |
| `--night-muted` | `#c3cee4` | Secondary text on the night band |
| `--night-rule` | `#33415f` | Edges on the night band |
| `--night-surface` | `#394459`, then `color-mix(in srgb, var(--night) 85%, #fff 15%)` | Review card. The literal is the fallback; the `color-mix` line overrides it where supported |
| `--accent-glps` | `#1f6fa8` | Home category cell `.cat--glps` |
| `--accent-bioregulators` | `#4a3a9c` | `.cat--bioregulators` |
| `--accent-recovery` | `#0f6e68` | `.cat--recovery` |
| `--accent-gh-releasing` | `#7a3e86` | `.cat--gh-releasing` |
| `--accent-other` | `#4e5870` | `.cat--other` |
| `--destructive` | `#a32a1f` | Error |
| `--destructive-foreground` | `var(--snow)` | Error foreground |

Role aliases in the same file:

| Alias | Points at |
|---|---|
| `--background` | `--snow` |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--accent-foreground`, `--secondary-foreground` | `--night` |
| `--card`, `--popover` | `--panel` |
| `--primary` | `--night` |
| `--primary-foreground` | `--snow` |
| `--accent`, `--secondary`, `--muted` | `--mist` |
| `--muted-foreground` | `--slate` |
| `--border`, `--divider`, `--input` | `--hairline` |
| `--ring` | `--night` |
| `--radius` | `--r-ctrl` |

`--accent` is the mist surface used for hover and selected rows. It is not a category hue. Category hues are the five `--accent-<url_key>` tokens.

`--beam` is applied in three places:

1. `::selection` background in `global.scss`, with `--night` text.
2. `.chip--beam` background in `global.scss`. The homepage uses that class on the text `Plate 01`.
3. `border-left: 3px solid var(--beam)` on the review quote in `homepage.scss`.

`tailwind.css` also maps `--color-beam`. No component class uses a Tailwind `beam` color utility beyond `.chip--beam`.

Sidebar aliases (`--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`) resolve through the role tokens above.

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css), [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss), [`themes/elune/src/pages/homepage/homepage.scss`](themes/elune/src/pages/homepage/homepage.scss)*

## 3. Type

`global.scss` `@font-face`:

| Family | File | Weight axis | Style |
|---|---|---|---|
| Manrope | `/assets/fonts/manrope-latin.woff2` | 200–800 | normal |
| JetBrains Mono | `/assets/fonts/jetbrains-mono-latin.woff2` | 100–800 | normal |

Both use `font-display: swap`. Files are `themes/elune/public/assets/fonts/`. The Manrope comment states the latin subset has neither U+2265 (`≥`) nor U+2192 (`→`). Purity text is therefore mono, and arrows are SVG paths.

`body` sets `font-size: 1.0625rem`, `line-height: 1.6`, `font-weight: 400`, and at `max-width: 640px` drops the size to `1rem`. The comment says the variable font's axis default is 200, so the explicit 400 is required.

Steps declared in `shadcn.css` and mapped in `tailwind.css`:

| Token | Size | Line height | Tracking |
|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 4.6vw, 4rem)` | 1.06 | -0.022em |
| `--text-headline` | `clamp(1.75rem, 2.9vw, 2.5rem)` | 1.12 | -0.018em |
| `--text-title` | 1.25rem | 1.3 | -0.01em |
| `--text-lede` | 1.125rem | 1.62 | |
| `--text-body` | 1.0625rem | 1.6 | |
| `--text-label` | 1rem | 1.4 | |
| `--text-label-sm` | 0.9375rem | 1.4 | |
| `--text-name` | 0.9375rem | 1.35 | |
| `--text-micro` | 0.8125rem | 1.4 | |
| `--text-caption` | 0.75rem | 1.3 | 0.03em |
| `--text-caption-mono` | 0.75rem | 1.3 | 0.03em |
| `--text-mono` | 0.8125rem | 1.5 | 0.015em |
| `--text-price` | 1.0625rem | 1.2 | 0.01em |
| `--text-quote` | 1.05rem | 1.55 | |

The homepage `h1` uses the display step. Review quotes use `text-quote italic` and a serif stack defined with the quote rule in `homepage.scss`. No italic face is loaded for Manrope. The `global.scss` comment says the only italic is the serif review quote.

*Source: [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss), [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css)*

## 4. Layout tokens and breakpoints

From `:root`:

| Token | Value |
|---|---|
| `--shell` | 1200px |
| `--page-gutter` | 48px |
| `--page-gutter-sm` | 32px |
| `--nav` | 74px |
| `--announce` | 38px |
| `--ease` | `cubic-bezier(0.16, 0.84, 0.44, 1)` |

`.section` padding is `clamp(56px, 7vw, 96px)`.

Media queries present in the theme stylesheets:

| Query | Files |
|---|---|
| `max-width: 1080px` | `homepage.scss`, `catalog.scss` |
| `max-width: 900px` | `homepage.scss`, `global.scss`, `chrome.scss` |
| `max-width: 640px` | `homepage.scss`, `catalog.scss`, `global.scss`, `chrome.scss`, `checkout.scss` |
| `max-width: 400px` | `chrome.scss` (hides the header `Shop all` pill) |
| `prefers-reduced-motion` | `global.scss`, `homepage.scss` |
| `print` | `global.scss` (entrance disabled) |

`chrome.scss` hides the desktop nav links at 900px and shows the phone `<details>` menu from `MiniCartIcon.tsx`. There is no `scroll-margin` rule in the theme stylesheets. The 38px bar and 74px header are separate tokens, not a combined scroll offset.

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css), [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss), [`themes/elune/src/pages/all/chrome.scss`](themes/elune/src/pages/all/chrome.scss)*

## 5. Radius

| Token | Value | Used for |
|---|---|---|
| `--r-pill` | 999px | Buttons, chips, cart count |
| `--r-ctrl` | 8px | Inputs, wallet panel, TXID panel, menu rows |
| `--r-card` | 16px | Plates, category strip, menus, review cards, age-gate sheet |
| `--r-sheet` | 32px | Hero plate sheet |
| `--r-inner` | 14px | Hero figure and review photograph |
| `--r-focus` | 2px | Focus corner token |
| `--radius` | `var(--r-ctrl)` | Compatibility alias for core utilities |

*Source: [`themes/elune/src/pages/all/shadcn.css`](themes/elune/src/pages/all/shadcn.css)*

## 6. Browser chrome

`global.scss`:

- `::selection` background `--beam`, color `--night`.
- `html { caret-color: var(--night); scrollbar-color: var(--slate) var(--snow); }`.
- WebKit scrollbar rules follow that block (track and thumb).
- `:focus-visible` uses `outline: 2px solid var(--ring)` and `outline-offset: 2px`. Links use offset `4px`.
- `.tlink` underline rests on `--ash` and moves to `--night` on hover.

Fields (`input`, `select`, `textarea` of the listed types) get `min-height: 44px`, padding `0.625rem 0.75rem`, `--card` fill, `1px solid var(--border)`, radius `--r-ctrl`.

*Source: [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss)*

## 7. Motion

`@keyframes rise` moves 14px and fades in. Under `prefers-reduced-motion: no-preference`, `.rise` runs `rise 0.66s var(--ease) forwards` with `animation-delay: var(--d, 0s)`. Reduced motion and print set `opacity: 1` and `animation: none`.

The homepage ribbon drift is in `homepage.scss`, paused under `prefers-reduced-motion: reduce`. The ribbon element is a focusable region so keyboard focus can stop the motion. The duplicate list is `aria-hidden`.

*Source: [`themes/elune/src/pages/all/global.scss`](themes/elune/src/pages/all/global.scss), [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/homepage/homepage.scss`](themes/elune/src/pages/homepage/homepage.scss)*

## 8. Header, footer, age gate

Header lockup is the raster logo, not a text wordmark. See `Wordmark.tsx`. `Logo.tsx` renders `null` so the EverShop demo mark does not sit beside it.

Navigation order from `PRIMARY_LINKS`, the Shop disclosure, then `SECONDARY_LINKS`:

1. Home `/`
2. New releases `/new-releases`
3. Shop — five categories from the catalog query, fixed order in `categories.ts`
4. FAQs `/faqs`
5. Payments `/faqs`
6. Shipping `/shipping`
7. Contact us `/contact`

Right cluster: cart pill, `Shop all` (same destination as All products, `/all`), and the phone menu. Search and the account icon render `null`.

Footer columns from `FooterNav.tsx`:

- Brand: the same transparent logo, `alt=""`, plus `Research reference compounds, catalogued with their specification on record.`
- Catalogue: All products, New releases, then the five categories that the query returned.
- Information: FAQs, Shipping, Contact us. Home is not in this column. Payments is filtered out.
- Payment: Bitcoin, `USDT (ERC-20)`, Ethereum, each `href` `/faqs`.

A visually hidden `h2` (`Footer navigation`) sits above the column `h3`s.

Footer base (`RuoFooter.tsx`): the RUO sentence, then `© 2026 Elune Labs · Prices in USD` in mono. `themeConfig.copyRight` in `config/default.json` is a different string (`© 2026 Elune Labs. All rights reserved.`) and is not the line this component prints.

Age gate: snow sheet, hairline, card radius, the modal shadow above, title and copy in `AgeGate.tsx`. Enter sets the 30-day `elune_age_ok` cookie. Leave is a real link to `https://www.google.com`.

*Source: [`themes/elune/src/pages/all/Wordmark.tsx`](themes/elune/src/pages/all/Wordmark.tsx), [`themes/elune/src/data/siteLinks.ts`](themes/elune/src/data/siteLinks.ts), [`themes/elune/src/pages/all/FooterNav.tsx`](themes/elune/src/pages/all/FooterNav.tsx), [`themes/elune/src/pages/all/RuoFooter.tsx`](themes/elune/src/pages/all/RuoFooter.tsx), [`themes/elune/src/pages/all/AgeGate.tsx`](themes/elune/src/pages/all/AgeGate.tsx)*

## 9. Homepage

Implemented by `pages/homepage/Elune.tsx` in area `content`, sort order 10. Shared chrome is not inside this component.

Order of regions:

1. Hero copy and, when the catalog contains `BPC5` (`HERO_SKU` in `Elune.tsx`), the Plate 01 sheet.
2. Commitment ribbon (five strings, listed in [8-2-ui-compliance-payment.md](docs/design/8-2-ui-compliance-payment.md)).
3. Category strip. Cell color classes `.cat--glps` through `.cat--other` set `color` to the matching accent token. Count text is `NN compounds`, padded to two digits, using `00` when the query has no total.
4. Four featured plates, `FEATURED_SKUS` in `Elune.tsx`: `TR10`, `ET10`, `TB10`, `IP5`. `ProductListItemRender` receives `index` starting at 2. A SKU the query did not return is skipped.
5. Night band: crater SVG (`aria-hidden`), heading `From recent orders.`, three `<figure>` reviews, transparency sentence, purity caveat.

Hero photograph URL is `/assets/plates/hero-photo.jpg`. Review URLs are `/assets/order/td-1.jpg`, `td-2.jpg`, `td-3.jpg`.

The hero `h1` is `Research peptides. Direct from the source. Uncompromising purity.` The lede puts `≥99%` and the word `everyone` in `<span class="mono">`.

*Source: [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/homepage/homepage.scss`](themes/elune/src/pages/homepage/homepage.scss)*

## 10. Catalog plates and product page

`ProductListItemRender.tsx` draws the plate. Head row: the `Plate NN` chip only when the surface passes an `index` — the homepage sequence does, browse grids do not — and the mono SKU on the right, coloured by the `accent` prop or, when that is absent, by the product URL's first segment. The category name is not printed in the head; the accent carries it. Below the head: the vial cutaway SVG (`VialCutaway`, `role="img"`), the name, a mono `form · size` line when either value is known, the price, Add to cart, and View when `product.url` is set. Add to cart is serialized so one in-flight cart mutation finishes before the next starts. The cutaway comment says the catalog ships without product photography.

`/all` (`AllProducts.tsx`) sorts by name. `/new-releases` (`NewReleases.tsx`) sorts by descending `productId` and keeps six. Category routes use `CategoryProducts.tsx`. `CatalogueHeading.tsx` inserts a visually hidden `Catalogue` `h2` so the outline does not skip from the category `h1` to filter and plate `h3`s.

Product page, top to bottom within the theme's own blocks:

1. `ProductDescription.tsx` — heading `About this compound`. Omitted when the SKU has no literature record. 22 of the 84 catalog SKUs have a summary (`NARRATIVES` in `productLiterature.ts`). Citations render only when `literature` is a non-empty array. The Epitalon sizes and both CJC-1295 (No DAC) sizes have summaries and no citations.
2. `ProductSpecs.tsx` — heading `Specification`, `<table>` with a visually hidden caption, `<th scope="row">`. Rows with no value are dropped. Purity is always `≥99%` in `font-mono`. The caveat under the table is `The purity value is a product specification, not a batch test result.` 22 of the 84 catalog SKUs have a record in `productSpecs.ts`; a SKU without one renders no `Specification` section at all.
3. `RuoNotice.tsx` — mist panel, the fixed RUO sentence, and the in-vitro administration sentence.

`categoryUrlKeyFromProductUrl` returns a key only when the first URL segment is one of the five `CATEGORY_URL_KEYS`. Anything else yields `null` and no category accent.

*Source: [`themes/elune/src/components/frontStore/catalog/ProductListItemRender.tsx`](themes/elune/src/components/frontStore/catalog/ProductListItemRender.tsx), [`themes/elune/src/data/categories.ts`](themes/elune/src/data/categories.ts), [`themes/elune/src/pages/productView/ProductSpecs.tsx`](themes/elune/src/pages/productView/ProductSpecs.tsx), [`themes/elune/src/data/productSpecs.ts`](themes/elune/src/data/productSpecs.ts)*

## 11. Checkout and confirmation

Wallet and TXID panels use the control radius, not the card radius. Rails, copy behavior, and the null-address sentence are in [8-2-ui-compliance-payment.md](docs/design/8-2-ui-compliance-payment.md).

`CustomerInfo.tsx` removes the core green check disc. `ConfirmationStatus.tsx` prints the order's own status name, payment status name, and TXID. It does not add a second RUO line.

*Source: [`themes/elune/src/components/frontStore/checkout/checkout.scss`](themes/elune/src/components/frontStore/checkout/checkout.scss), [`themes/elune/src/pages/checkoutSuccess/CustomerInfo.tsx`](themes/elune/src/pages/checkoutSuccess/CustomerInfo.tsx), [`themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx`](themes/elune/src/pages/checkoutSuccess/ConfirmationStatus.tsx)*

## 12. Icons

Authored SVG paths in the theme:

- Long arrow in `ProductListItemRender.tsx` (`Arrow`) and a matching path in `Elune.tsx`.
- Shop chevron and cart glyph in `Nav.tsx` and `MiniCartIcon.tsx`.
- Phone menu glyph in `MiniCartIcon.tsx`.
- Vial cutaway in `ProductListItemRender.tsx`.
- Crater disc in `Elune.tsx`.

`lucide-react` is imported in three overrides:

| File | Icons |
|---|---|
| `pages/checkout/CashOnDelivery.tsx` | `Copy` |
| `components/frontStore/checkout/ShippingNote.tsx` | `NotebookPen` |
| `components/common/form/PasswordField.tsx` | `Eye`, `EyeClosed` |

*Source: those files.*

## 13. Copy the theme treats as fixed

| String | Where |
|---|---|
| `For research use only. Not for human consumption.` | Announcement, footer, product notice |
| `Are you 18 or older?` | Age gate title |
| `I am 18 or older — Enter` / `Cancel — Leave` | Age gate controls |
| `≥99%` | `PURITY_DECLARATION` in `productSpecs.ts`; every spec record; hero lede; hero sheet |
| `The purity value is a product specification, not a batch test result.` | Under the spec table and at the bottom of the night band |
| `Store cool and dry, away from direct light` | `STORAGE_COOL_DARK` on every spec record |
| `Not configured — contact us before sending.` | Checkout rail with a null address |
| `Transaction ID (TXID)` | Shipping note and confirmation |
| `Collected from completed orders and published unedited. Names shortened to first name and last initial.` | Night band |

Landing ribbon strings are rendered as written in `COMMITMENTS` (`Elune.tsx`); the five verbatim lines are in [8-2-ui-compliance-payment.md](docs/design/8-2-ui-compliance-payment.md). Lines 3–5 now state repository facts rather than claims: `84 SKUs across 1mg–1500mg sizes` counts `scripts/catalog-data.json`, `Guest cart & checkout, no account required` matches the public cart routes and an email-only checkout, and `Five core research categories: GLPs, Bioregulators, Recovery, GH Releasing, Other` names `CATEGORY_URL_KEYS`. The retired strings — `Batch tracking for each vial`, `Best in class factory direct pricing`, `Unbeatable delivery rate. Zero issues.` — named a batch field, a price comparison, and a delivery measurement this repository does not have, and no longer render.

*Source: [`themes/elune/src/pages/all/Announce.tsx`](themes/elune/src/pages/all/Announce.tsx), [`themes/elune/src/data/productSpecs.ts`](themes/elune/src/data/productSpecs.ts), [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx), [`themes/elune/src/pages/checkout/CashOnDelivery.tsx`](themes/elune/src/pages/checkout/CashOnDelivery.tsx)*

## 14. Served assets

| URL the theme requests | File in the repo |
|---|---|
| `/assets/brand/website_header_logo_transparent.png` | `themes/elune/public/assets/brand/website_header_logo_transparent.png` |
| `/assets/brand/favicons/favicon-512x512.png` | `themes/elune/public/assets/brand/favicons/favicon-512x512.png` |
| `/assets/fonts/manrope-latin.woff2` | `themes/elune/public/assets/fonts/manrope-latin.woff2` |
| `/assets/fonts/jetbrains-mono-latin.woff2` | `themes/elune/public/assets/fonts/jetbrains-mono-latin.woff2` |
| `/assets/plates/hero-photo.jpg` | `themes/elune/public/assets/plates/hero-photo.jpg` |
| `/assets/order/td-1.jpg` (and `td-2`, `td-3`) | `themes/elune/public/assets/order/` |

The reference copies under `docs/refs/assets/brand/` and `docs/refs/assets/imgs/` are not the `src` attributes above. The white logo files are in `public/assets/brand/` and are not referenced by `Wordmark.tsx` or `FooterNav.tsx`.

*Source: [`themes/elune/src/pages/all/Wordmark.tsx`](themes/elune/src/pages/all/Wordmark.tsx), [`themes/elune/src/pages/homepage/Elune.tsx`](themes/elune/src/pages/homepage/Elune.tsx)*
