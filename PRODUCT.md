# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary — people researching their own body and health.** Hobbyists, biohackers, self-improvement and longevity types, athletes and training-focused people, and parents. They are not scientists: they will not read a chromatogram, they do not have a lab, and clinical or institutional presentation reads as intimidating or fake to them. They are, however, careful — they have read enough to be wary of the hype-driven sellers in this category and they want to know what is actually in the vial.
- **Secondary — genuinely analytical buyers.** Independent researchers and lab-adjacent people who do read the specifications. The specification data must be correct and complete for them without becoming the interface the primary audience has to climb over.
- **The shared trait:** both groups arrive skeptical of this category's sellers and both need the same reassurance — that this is a real, well-run operation with precise products, not a dropship storefront padded with claims.

## Product Purpose
Elune Labs sells research reference peptides — clearly described, precisely specified, honestly priced — to people who buy them to research on themselves, and to the smaller group of analytical buyers who want the full specification.

Success for v1: from a clean deployment, a visitor can understand what is sold and what is documented, browse five categories, place a guest order, and pay in crypto — and the owner can verify that payment and fulfil it from the admin console.

## Positioning
Verification, not persuasion, is the mechanism this business is built around: every compound is identified by batch, described by its full analytical specification, and eventually backed by third-party accredited testing with per-batch documents a buyer can inspect. A neighboring storefront can copy the catalog and the layout; it cannot truthfully copy a per-batch evidence chain without actually building one.

> **Document scope, not a verdict on the business.** Elune intends accredited third-party testing with per-batch documents a buyer can inspect; that is the proof mechanism this product is being built toward. What is true right now is narrower: no certificate, chromatogram, or accreditation document is loaded in this project, so no surface may present, link, or imply one until a real document is supplied. Surfaces carry batch identity and analytical specification only.

## Operating Context
- **Catalog:** peptides only, in five research categories — GLPs, Bioregulators, Recovery, GH Releasing, Other — with per-size simple products. Single currency (USD), single locale (English).
- **Purchase path:** guest checkout; shipping address plus a flat-rate method; the payment step shows the order total and Bitcoin / USDT (TRC-20) / Ethereum wallet addresses with sending instructions.
- **Payment is manual:** the customer sends crypto on-chain and pastes the transaction ID; the order sits at `payment_status = pending` until the owner verifies it on-chain and captures it in the admin console. Fulfilment happens only after paid — capture is the only pending→paid transition.
- **Compliance ritual:** an 18+ confirmation on first storefront visit (30-day cookie, client-side and advisory), and "For research use only. Not for human consumption." in the footer and on every product page.
- **Operation:** `/admin` manages products, categories, orders, shipping, and the crypto wallet settings. Wallet addresses, the payment display name, and shipping rates are edited there and take effect immediately — no rebuild, no restart, no code change.

## Capabilities and Constraints
- **Research-use-only framing is absolute:** no surface may imply human consumption, dosage, or medical benefit.
- **Manual crypto only:** no payment gateway, no cards, no automated on-chain verification, no third-party processor in the purchase path.
- **The age gate is advisory, not a boundary** — it never blocks `/admin` or API routes and is not a security control.
- **Engine:** EverShop 2.2.1 with PostgreSQL 16 on Docker Compose, pinned. The theme and the payments extension are presentation-only; checkout and order-creation logic is stock. Engine upgrades are treated as breaking events with known COD/capture divergence from 2.3+.
- **v1 non-goals:** payment automation (hosted processor, BTCPay), email marketing, analytics integrations, multi-currency, custom logo, automated backup infrastructure, VPS/TLS deployment, server-side age verification.
- **Fulfilment is drop-shipped at launch:** for the first weeks orders ship via a supplier, not an Elune-operated facility. Shipping copy must stay at what a drop-shipper can actually honour (tracked, discreet) and must not promise packing the operator controls, such as cold-chain or in-house handling.
- **Purity is a product attribute, not a claim of current testing:** the catalog carries a purity spec (99%+ as the placeholder value) alongside sequence, molecular weight, CAS number, form, and storage. Surfaces present these as specs. They must not show a testing status, an "in testing" or "pending" state, or a certificate affordance, because no certificate, chromatogram, or accreditation document exists in this repository and none is loaded yet.
- **Batch identity is tracked; batch evidence is not yet published:** products carry a batch/lot identifier. Nothing in the surface may imply that a document per batch is available to view until such documents exist.
- **Presentation constraint for GLPs:** GLP-category compounds are widely associated with therapeutic weight management. Under the absolute RUO framing they are presented strictly as research reference compounds — no weight-loss, appetite, dosing, or body-composition framing, and no before/after or body imagery anywhere near them.
- **Current data is placeholder:** the seeded catalog, the purity values, the batch identifiers, and the wallet addresses describe structure, not real stock, real analytical results, or real receiving addresses.

## Brand Commitments
- **Name:** Elune Labs; wordmark rendered `ELUNE LABS`.
- **Voice:** sober, transparent, rigorous — plain-spoken first, precise underneath. Say what the product is and what is documented about it in ordinary language; keep the exact technical vocabulary (batch and lot numbers, purity, form, sequence, molecular weight, storage) available and correct for the analytical buyer who wants it, without letting it become the register the whole store speaks in. Never hype, never jargon as decoration, never a claim about the body.
- **Banned register:** underground, bodybuilding, and hype-driven biohacker jargon ("get shredded", "limitless", "superhuman synthesis"); equally, crypto-hype cues.
- **Binding visual constraint from the owner:** a light theme; never default to dark. Light means clean, warm and trustworthy — **not** clinical, institutional, or lab-cold. The owner's words: buyers are regular people, so do not make the storefront overly clinical or "official".
- **Standing preference — the conventional storefront (recorded 2026-09-11).** The owner reviewed an out-of-the-ordinary direction (a specimen-archive world) and rejected it, choosing the category standard instead: the familiar arrangement of hero, honest trust statements, category cards, featured products, footer, executed at full craft. This is a standing brand decision, not a per-surface one. Do not re-pitch unconventional visual worlds for this storefront unless the owner asks.
- **Craft bar for the standard path:** plain-spoken and human in register, exact in detail — clarity, real product data, honest statements, no decoration. References the owner approved: consumer wellness brands that make sourcing legible to non-specialists, direct-to-consumer health brands that de-stigmatise a personal category, and product-led hardware brands with honest specifications. Not institutional lab-supply catalogues.
- **Approachability does not relax compliance.** The audience buys to research on themselves, but every surface still holds the research-use-only frame absolutely: no dosing, no protocols, no medical or weight-loss claims, no before/after or body imagery. Plain language is required; permission is not granted by it.
- **Anti-patterns:** no neon glows, cybernetic grids, matrix graphics, or sketchy crypto banners; no unverified commercial medical claims.

> **Shipped world (updated 2026-09-11).** `themes/elune` now ships the light world described in DESIGN.md: warm paper ground, evergreen action, Titillium Web. The previously shipped Aegis-Dark world was rejected by the owner and has been replaced; it is anti-reference, not approved source. One disclosure: the homepage hero ships a synthetic produced vial plate (its generation prompt is recorded in the asset's provenance), because the catalog carries no product photography. That image is placeholder material to be replaced with real photography — it is not a photograph of Elune stock.

## Evidence on Hand
- **Specification and architecture:** `SPEC.md`, `ARCHITECTURE.md`, `IMPLEMENTATION.md`, `docs/DEVELOPER.md`.
- **Design record:** `DESIGN.md` (the Aegis-Dark token system) and four mockups in `docs/design/mockups/` — cyan peptides, emerald nootropics, amber SARMs, violet Elune. These document a rejected direction; they are anti-reference, not approved source material.
- **Placeholder catalog:** `scripts/catalog-data.json` — 3 categories, 15 products, $19.99–$79.99, with empty image arrays.
- **Live compliance and brand copy:** the RUO notice, age gate, and wordmark in `themes/elune/src`.
- **Absences that future work MUST NOT fabricate:** no real certificates of analysis, HPLC/MS reports, or ISO/IEC 17025 accreditation certificate exist in this repository; no customer testimonials, press coverage, logos, or benchmarks; no product photography; no real wallet addresses (settings hold placeholders).

## Product Principles
1. **Verification before persuasion** — show the batch evidence and the batch identity; never ask the buyer to trust copy.
2. **Restraint is the brand** — quiet, clinical surfaces where the compound data is the loudest element on the page.
3. **The RUO line is absolute** — no surface, no matter how persuasive, implies human use, dosing, or therapeutic benefit.
4. **Privacy-respecting commerce** — crypto-native payment, no third-party processors or trackers in the purchase path.
5. **Operators are not engineers** — wallet addresses, shipping rates, and catalog content are editable from the admin console with no rebuild and no code change.
