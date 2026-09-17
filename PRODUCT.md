# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary — people researching their own body and health.** Hobbyists, biohackers, self-improvement and longevity types, athletes and training-focused people, and anyone who cares about improving their health. They are not scientists by trade: they will not read a chromatogram, they do not have a lab, and clinical or institutional presentation reads as intimidating or fake to them. They are, however, careful, and do their own research — they have read enough to be wary of the hype-driven sellers in this category and they want to know what is actually in the vial.
- **Secondary — genuinely analytical buyers.** Independent researchers and lab-adjacent people who do read the specifications. The specification data must be correct and complete for them without becoming the interface the primary audience has to climb over.
- **The shared trait:** both groups arrive skeptical of this category's sellers and both need the same reassurance — that this is a real, well-run operation with precise products, not a dropship storefront padded with claims.

## Product Purpose
Elune Labs sells research reference peptides — clearly described, precisely specified, honestly priced — to people who buy them to research on themselves, and to the smaller group of analytical buyers who want the full specification.

Success for v1: from a clean deployment, a visitor can understand what is sold and what is documented, browse five categories, place a guest order, and pay in crypto — and the owner can verify that payment and fulfil it from the admin console.

## Positioning
Verification, with subtle persuasion, is the mechanism this business is built around: the intention is that every compound is identified by batch and described by its full analytical specification (if available), and eventually backed by third-party accredited testing with per-batch documents a buyer can inspect — none of which exists in the data today (see Capabilities and Constraints). A neighboring storefront can copy the catalog and the layout; it cannot truthfully copy a per-batch evidence chain without actually building one.  Starting off, we will need to focus on a dropshipping model, using trusted and tested peptide suppliers.  Once enough funds are gained, we will hold stock ourselves and send out products ourselves.  This is why the ordering and admin systems are designed the way they are — the admin console is designed to allow for manual payment processing and order fulfillment.

## Operating Context
- **Catalog:** peptides only, in five research categories — GLPs, Bioregulators, Recovery, GH Releasing, Other — with per-size simple products. Single currency (USD), single locale (English).
- **Purchase path:** guest checkout; shipping address plus a flat-rate method; the payment step shows the order total and Bitcoin / **USDT on Ethereum (ERC-20)** / Ethereum wallet addresses with sending instructions. USDT is not accepted on TRON — that rail was retired, and a legacy TRON address cannot be reused as the Ethereum one.
- **Payment is manual:** the customer sends crypto on-chain and pastes the transaction ID; the order sits at `payment_status = pending` until the owner verifies it on-chain and captures it in the admin console. Fulfilment happens only after paid — capture is the only pending→paid transition.
- **Compliance ritual:** an 18+ confirmation on first storefront visit (30-day cookie, client-side and advisory), and "For research use only. Not for human consumption." in the footer and on every product page. The storefront nav carries a **Payments** item pointing at `/faqs`, whose "How do I pay?" block explains the manual crypto flow; no `/payments` page exists.
- **Operation:** `/admin` manages products, categories, orders, shipping, and the crypto wallet settings. Wallet addresses, the payment display name, and shipping rates are edited there and take effect immediately — no rebuild, no restart, no code change. The USDT field takes an Ethereum address (`0x…`); anything that is not a 40-hex-digit Ethereum address leaves the rail disabled and visibly unavailable at checkout, so a stored placeholder is never shown to a customer as payable.

## Capabilities and Constraints
- **Research-use-only framing is absolute:** no surface may imply human consumption, dosage, or medical benefit.
- **Manual crypto only:** no payment gateway, no cards, no automated on-chain verification, no third-party processor in the purchase path.
- **The age gate is advisory, not a boundary** — it never blocks `/admin` or API routes and is not a security control.
- **Engine:** EverShop 2.2.1 with PostgreSQL 16 on Docker Compose, pinned. The theme and the payments extension are presentation-only; checkout and order-creation logic is stock. Engine upgrades are treated as breaking events with known COD/capture divergence from 2.3+.
- **v1 non-goals:** payment automation (hosted processor, BTCPay), email marketing, analytics integrations, multi-currency, custom logo, automated backup infrastructure, VPS/TLS deployment, server-side age verification.
- **Fulfilment is drop-shipped at launch:** for the first weeks orders ship via a supplier, not an Elune-operated facility. Shipping copy must stay at what a drop-shipper can actually honour (tracked, discreet) and must not promise packing the operator controls, such as cold-chain or in-house handling.
- **Purity is a product attribute, not a claim of current testing:** the catalog carries a purity spec (99%+ as the placeholder value) alongside sequence, molecular weight, CAS number, form, and storage. Surfaces present these as specs. They must not show a testing status, an "in testing" or "pending" state, or a certificate affordance, because no certificate, chromatogram, or accreditation document exists in this repository and none is loaded yet.
- **Batch identity is intended, not present in the data yet:** the catalogue data carries no batch or lot field today — neither `scripts/catalog-data.json` nor `themes/elune/src/data/productSpecs.ts` records one. Batch identity is how the business intends to distinguish itself as it moves off drop-shipping, and "Batch tracking for each vial" is copy the owner directed onto the landing page; it is owner-selected copy, not a fact this repository can demonstrate. Nothing in any surface may imply that a document per batch is available to view, and no surface outside the landing may state the tracking claim until a real field exists.
- **Presentation constraint for GLPs:** GLP-category compounds are widely associated with therapeutic weight management. Under the absolute RUO framing they are presented strictly as research reference compounds — no weight-loss, appetite, dosing, or body-composition framing, and no before/after or body imagery anywhere near them.
- **Current data is placeholder:** the seeded catalog, the purity values, and the wallet addresses describe structure, not real stock, real analytical results, or real receiving addresses. The USDT field still holds the retired TRON placeholder, so that rail is expected to render unavailable until a real Ethereum address is configured.

## Brand Commitments
- **Name:** Elune Labs; wordmark rendered `ELUNE LABS`.
- **Mental Image** Like our logo, Elune Labs, reminds me of something very sophisticated, yet clean and simple. Like the lunar surface.  The colors of the sky, space, and moon.  Contrasted on a white background. Is what I see, but it is not the only solution
- **Voice:** sober, transparent, rigorous — plain-spoken first, precise underneath. Say what the product is and what is documented about it in ordinary language; keep the exact technical vocabulary (batch and lot numbers, purity, form, sequence, molecular weight, storage) available and correct for the analytical buyer who wants it, without letting it become the register the whole store speaks in. Never hype, never jargon as decoration, never a claim about the body.
- **Banned register:** hype-driven biohacker jargon ("get shredded", "limitless", "superhuman synthesis"); equally, crypto-hype cues.
- **Binding visual constraint from the owner:** a light theme; never default to dark. Light means clean, modern and trustworthy — **not** clinical, institutional, or lab-cold. The owner's words: buyers are regular people, so do not make the storefront overly clinical or "official".
- **Standing preference — the conventional storefront (recorded 2026-09-11).** The owner reviewed an out-of-the-ordinary direction (a specimen-archive world) and rejected it, choosing the category standard instead: the familiar arrangement of hero, honest trust statements, category cards, featured products, footer, executed at full craft. This is a standing brand decision, not a per-surface one. You can re-pitch unconventional visual worlds for this storefront if you feel it will genuinely be worth the effort.
- **Craft bar for the standard path:** plain-spoken and human in register, exact in detail — clarity, real product data, honest statements. References the owner approved: consumer wellness brands that make sourcing legible to non-specialists, direct-to-consumer health brands that de-stigmatise a personal category, and quality driven nootropic brands with honest specifications. Not institutional lab-supply catalogues.
- **Approachability does not relax compliance.** The audience buys to research on themselves, but every surface still holds the research-use-only frame absolutely: no dosing, no protocols, no medical or weight-loss claims, no before/after or body imagery. Plain language is required; permission is not granted by it. The quality should be AAA - high enough that a actual researcher would feel comfortable purchasing and using the product. Do not make the storefront overly clinical or "official".
- **Anti-patterns:** no warm paper, no neon glows, cybernetic grids, matrix graphics, or sketchy crypto banners; no unverified commercial medical claims.  Although, do not shy away from using color, strong lines, and creative design to fit the idea I am after.


## Evidence on Hand
- **Specification and architecture:** `SPEC.md`, `ARCHITECTURE.md`, `IMPLEMENTATION.md`; the source design docs in `docs/design/` (`8-1-deployment.md`, `8-2-ui-compliance-payment.md`, `8-3-catalog-orders.md`). (An earlier revision cited a `docs/DEVELOPER.md` that does not exist in this repository.)
- **Design record:** `DESIGN.md` 
- **Logo & Favicons:** `docs/refs/assets/brand/` (the identity kit and the favicon family); `docs/refs/assets/imgs/` (order photography).
- **Placeholder catalog:** `scripts/catalog-data.json` — 5 categories, 14 products across them, $29.99–$79.99, with empty image arrays.
- **Live compliance and brand copy:** the RUO notice, age gate, and wordmark in `themes/elune/src`.
- **Absences that future work MUST NOT fabricate:** no real certificates of analysis, HPLC/MS reports, or ISO/IEC 17025 accreditation certificate exist in this repository; no press coverage, partner logos, or benchmarks; no per-product photography (catalog image arrays are empty, so product cards are text-led); no real wallet addresses (settings hold placeholders, and the USDT slot holds a retired TRON value).
- **Owner-selected landing material — present, and not evidence.** The landing route's hero lede, its five value-ribbon statements, its three directed reviews (quotes, names, cities, dates and order photographs under `docs/refs/assets/imgs/`) and the review band's transparency foot were supplied and selected by the owner. They ship as the owner directed. They are **not** evidence: no consent record, order linkage, measurement, audit or review exists for any of them in this repository, and no document may claim otherwise. The transparency foot's "Collected from completed orders" is an unsubstantiated claim about the store's own operation — owner-selected copy, not independently verified. The string-by-string substantiation risk list is in `DESIGN.md` § *Owner-selected copy is not evidence*.

## Product Principles
1. **Verification then slight persuasion** — lead with the specification record and the batch identity the business is building toward; never ask the buyer to trust copy. Where the owner has directed promotional copy onto the landing route, it renders as owner-selected copy and never as substantiated evidence.
2. **Restraint and trustworthyness is the brand** — quiet, clinical surfaces where the compound data is the loudest element on the page.
3. **The RUO line is absolute** — no surface, no matter how persuasive, implies human use, dosing, or therapeutic benefit.
4. **Privacy-respecting commerce** — crypto-native payment, no third-party processors or trackers in the purchase path.
5. **Operators are not engineers** — wallet addresses, shipping rates, and catalog content are editable from the admin console with no rebuild and no code change.
