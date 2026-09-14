---
version: 1
slug: "themes-elune-src-pages-homepage-elune-tsx"
primary_target: "themes/elune/src/pages/homepage/Elune.tsx"
related_targets: ["themes/elune/src/pages/all","themes/elune/src/pages/categoryView","themes/elune/src/pages/productView","themes/elune/src/components/frontStore/checkout"]
---

# Surface brief — Elune Labs storefront (homepage and storefront shell)

Primary target: `themes/elune/src/pages/homepage/Elune.tsx`
Related targets: `themes/elune/src/pages/all/*`, `themes/elune/src/pages/categoryView/*`, `themes/elune/src/pages/productView/*`, `themes/elune/src/components/frontStore/checkout/*`
Visitor mode: **Persuade** on homepage, category and product; **Operate** on cart, checkout and confirmation.
Seed key: `12a9eaca` · kind: `canon` · approved comp: `.impeccable/mocks/decision/canon.png`
Pending direction roll: `5e5d0361` (assigned candidate 4) — see "Proposed redesign" below.

## Direction contract
**THESIS (proposed 2026-09-13, pending approval — see "Proposed redesign").** The catalogue is a set of numbered plates: the compound and its written record are shown together, at the same scale, in the first viewport. This surface refuses the category's hype terminals and equally refuses lab-cold institution; confidence comes from the specification being visible before the pitch.
**OWN-WORLD (proposed).** Cool near-monochrome field — snow `#F7F8FA`, mist `#ECEFF3`, one deep midnight ink `#16233C` — plus a single vivid lime beam `#CFF26F` reserved for badges. Whisper-light Manrope 250 at display sizes, JetBrains Mono for every code, value and measure. Flat: no shadows, no gradients, no blur. Pills for controls, 16px cards, one 32px plate sheet, one 14px figure frame. One authored ornament: a hairline cratered disc on the ink band, drawn from the brand mark.
**STORY.** The visitor understands that every compound is identified and specified before purchase; believes this is a real, precise operation rather than a dropship storefront padded with claims; and acts by browsing the catalogue or a category. Nothing asks for trust that the record does not already supply.
**FIRST VIEWPORT (proposed).** Mist band. Left, at 64px/250: "Research peptides, with the record attached." — one lede, one filled pill CTA plus one underlined link, one mono data line. Right, the same height: Plate 01, a white sheet with the photographed vial cropped portrait on the left and four hairline-ruled specification rows on the right, closed by a category chip and "View compound →".
**FORM.** Journal plate, played as a storefront. Signature interaction: plates rise 14px and fade once on load, staggered, and hover inverts the pill to ink-on-white. Reach: the plate, the hairline ruling and the mono/data discipline carry to product, category and cart surfaces unchanged.
**RISK.** Restraint can read as plain if the cutaway figures and the photograph ever slip to placeholder quality; the record is the only proof, so any unsourced field must be omitted rather than filled.
**RAISES / BORROWED DISCIPLINE.** Batch/lot identity appears as a plain product attribute on product surfaces, never as a verification badge. State lives with the thing it describes, never as a floating overlay. Specifications are real tabular data with proper semantics, not a decorative panel.

### Void regions — comp content that must not be built
The canon comp is a **direction card, not a content-approved artifact**. Its painted words are arrangement, not copy:
- **Hero headline "Research-Grade Peptides, Verified" is void.** It asserts third-party verification. No surface may present, link, or imply testing, certification, or accreditation while no document exists. Replace with a plain statement of what is sold and what is documented (batch/lot identity and a full specification).
- **"THIRD-PARTY TESTED" badge is void.** The four trust statements carry only honourable facts: tracked & discreet shipping, crypto payment (BTC/USDT/ETH), batch/lot identity on every product, research-use-only framing.
- **The newsletter capture band is void** — email marketing is a v1 non-goal. Replace with a quiet band; the page closes on the footer's compliance line.
- **All prices, counts, ratings and product names painted in the comp are void.** Real content comes from the live catalog and the seeded spec data.
- **Compound names painted in any comp are not the catalog.** The catalog is the five categories and the compounds listed in the data contract below.

### Photography stance
The hero still life is a **produced raster** with recorded provenance, regenerated in the
2026-09-11 pass and still placeholder material, still not a photograph of real stock. The shipped
plate measures 1400×933 with the vial at roughly 14% of the frame width and an aspect of 0.332
(about 1:3.0); the plate it replaced measured 0.245 (about 1:4.1) against the 1:2.5–3 a real vial
reads as, and that over-slim cylinder was the actual cause of the "squashed" reading — diagnosed by
measuring the rendered asset, not by guessing, since `object-cover` can only crop and the crop
window never touched the vial. Full-bleed behaviour is unchanged. Real photography should replace it
when real photography exists. Catalog products ship with no images, so **no surface may render an
empty image box**: product cards are complete on name, size, lot, form and price alone. Build a
text-led product card, not a photo-led card with a missing photo.

## Hard constraints
- **Research-use-only is absolute, and approachability does not relax it.** The audience buys to research on themselves, so plain language is required — and dosing, protocols, cycle advice, medical or weight-loss claims, before/after and body imagery remain forbidden on every surface. No weight-loss framing anywhere near the GLP category; it is presented as a research reference compound like any other.
- **No verification claims.** No "tested", "verified", "certified", "accredited", no certificate affordance, no testing status. Purity is the literal `≥99%` on every product — a placeholder declaration, never a precise measured figure. An unsourced specification value is omitted, never status-flagged and never labelled "pending" or "coming soon".
- **Light only.** Never a dark surface anywhere. **Pending exception (decision D2, owner to confirm):** the proposed redesign introduces a *single* `--night` region carrying the specification record — a region, not a theme. Until the owner confirms, light-only stands unmodified; if D2 is declined, that band becomes `--mist` at identical structure and this constraint is unchanged.
- **Shop-able, not just pretty:** every link, control and form on the touched surfaces works.
- **No fabricated social proof.** No testimonials, ratings, press marks or customer counts exist in this repository and none may be invented; the specification record carries credibility instead.

## Data contract (settled — do not invent)
**Categories (five, keyed by `url_key`):** `glps`, `bioregulators`, `recovery`, `gh-releasing`, `other`. Currently the database holds the old trio, so `scripts/catalog-data.json` is reseeded to these five and the seeder creates them.
**Category accents:** five muted deep keys in `shadcn.css` — `--accent-glps`, `--accent-bioregulators`, `--accent-recovery`, `--accent-gh-releasing`, `--accent-other` — each readable at AA on the light ground. No `CategoryAccent.tsx` exists (verified: nothing by that name under `themes/elune`); the token is applied inline as `color: var(--accent-<url_key>, var(--foreground))`, which is what `Elune.tsx` does today. Keep it that way, and the fallback must never be what a real category renders as.
**Products:** the seeder carries only `name, sku, price, qty, category`. Product specification data (CAS, formula, molecular weight, sequence, purity, form, storage) lives in **one** theme-side map keyed by SKU — `themes/elune/src/data/productSpecs.ts` — and the product page renders it. One source of truth; do not duplicate spec values into the seed file. Values must come from the sourced chemistry table in the shape brief; a value that is not sourced is omitted from the record entirely.
**Product narrative and literature:** the product page's plain-language description and its published-research references live in **one** theme-side map keyed by SKU — `themes/elune/src/data/productLiterature.ts` — beside the specification map and under the same one-source-of-truth rule as `productSpecs.ts`; the product page renders it between the price and the specification table. The compliance rule that governs it: a quoted study title that asserts an effect is itself a claim and is not carried, so three SKUs hold no references at all and their literature section is omitted outright.

## Scope and boundaries
In scope: homepage; header/nav/footer; wordmark; age gate; category listing; product detail; cart; checkout (contact → shipping → crypto payment step); order confirmation; RUO notices.
Untouched: EverShop checkout logic, order creation, payment capture, `/admin`, the payments extension GraphQL contract, the age-gate cookie contract (`elune_age_ok`, 30 days, advisory only), the seeder's auth/upsert/assert mechanics.
Anti-goals: dark mode or any dark surface; neon, glow, gradients, blur-as-decoration; testing or accreditation badges; medical, dosing, weight-loss or body imagery; crypto-hype and bodybuilding register; institutional lab-cold presentation; the rejected Aegis-Dark token system.
Accessibility: WCAG AA on the light ground; the specification record is real tabular markup; keyboard-reachable commerce path; visible focus states; the age gate traps focus while open.

## Shipped world

Recorded 2026-09-11 after the light build shipped. See `DESIGN.md` (root) and
`.impeccable/design.json` for the token layer; this section records only what the shipped build
did to the direction contract.

**The canon comp was executed as an arrangement reference, by the user's explicit decision.**
`.impeccable/mocks/decision/canon.png` supplied arrangement, scale and rhythm — band order, the
two-column offer, the four-statement row, the five-up category row, the four-up featured row — and
nothing else. This is a user-recorded downgrade to **arrangement reference only (code-led)**, not
an inference from the build: the user chose the code-led reading explicitly. The build is therefore
code-led, and `canon.png` ships as the **critique reference** for the craft review
(`.impeccable/review/`), not as a pixel contract. Pixel diffing against the comp is expected to
show divergence and that divergence is not a defect.

**The comp's painted copy is VOID**, per this brief's own void-region list above — this is not a
new ruling. Its hero headline asserted third-party verification, and no such document exists in
this repository. Every word, price, count, rating and product name painted in the comp is void;
the shipped surfaces carry the catalog's real content instead. No surface presents, links or
implies testing, certification or accreditation.

**One recorded divergence from the void-region replacement list.** The brief specified four trust
statements — tracked & discreet shipping, crypto payment, batch/lot identity on every product, and
research-use-only framing. The build shipped three of those plus "Form, storage and purity on every
product" in place of the batch/lot line, because no lot identifier exists in the seeded product
data. The build's version is the honest one and stands; this note records the change rather than
repairing it.

**The hero ships a synthetic produced plate.** `/assets/plates/hero-photo.webp` (1400×933) is a
designed illustration plate produced by the harness image tool, with its provenance recorded
alongside it in `hero-photo.webp.json` — it is **not** a photograph of real Elune stock and makes
no claim about a real product. It is placeholder material to be replaced with real photography
when real photography exists. The plate is cropped by the offer band's edge rather than masked,
and it is the only image on the homepage: the catalog ships no product images, so product cards
remain text-led and complete without one.

**Recorded 2026-09-11, second pass — the shipped surface itself.** A later session changed the
build, not only the documents. Everything above still stands: the comp's role, the void painted
copy, the trust-statement divergence and the plate's placeholder status are unchanged, and these
notes record what the build did on top of them.

**Typography.** The sans face is now **Source Sans 3**, self-hosted with no third-party request,
replacing Titillium Web. Both faces were re-subset from their full variable sources with an
explicit unicodes list: the sans carries 388 codepoints and the mono 379, up from 212. The old
subsets omitted U+2265 (`≥`), so that glyph fell through to a system fallback inside the `≥99%`
purity declaration — a different face at a different weight beside its own digits. That was the
visible type artifact, and it is gone: every glyph the storefront renders is present in the shipped
files. Four static sans weights ship (400/500/600/700); JetBrains Mono stays a variable font
(100–800).

**Type scale.** The two small steps moved: `--text-xs` 12px → **13px** and `--text-sm` 14px →
**15px**, declared as Tailwind v4 theme tokens in `themes/elune/src/pages/all/tailwind.css` so they
lift the theme and core's own components together from one place. Body stays 16px.

**Identity.** A crescent mark (`themes/elune/src/pages/all/BrandMark.tsx`) now sits in brand ochre
beside the wordmark. It is deliberately **not** evergreen, because the Evergreen-Is-Action Rule
reserves `--primary` for the action, the focus ring, selection and the caret. Its geometry was
chosen empirically — all four SVG arc-flag combinations were rendered and the one legible at 16px
was picked. A matching favicon ships at `themes/elune/public/assets/favicon.svg`, wired through the
store's `favicon` setting so `<link rel="icon" href="/assets/favicon.svg">` is emitted and the owner
can replace it from the admin console with no rebuild. The wordmark itself was rebuilt: it
previously asked for `font-extrabold`/`font-black` — weights that were not in the loaded set, so the
browser synthesized them. It now uses a real 700 on both halves with 0.18em tracking, narrowed from
0.28em, and a compensating negative right margin.

**Navigation and footer.** The header's top-level destinations are now **Home, New Releases, Shop,
FAQs, Shipping and Contact Us**, with Shop a native `<details>`/`<summary>` disclosure holding the
five categories. The disclosure is keyboard-operable natively, with outside-click and Escape
dismissal added; its panel is a hairline card on `--card` with no shadow. The nav's accessible name
is now **`Main`**, which is what the mobile rule keys on. In the footer, both compliance lines — the
RUO line and the copyright — are horizontally centred, and a centred page-link row in area
`footerMiddleCenter` lists every page: Home, New Releases, All Products, the five categories, FAQs,
Shipping and Contact Us, eleven links.

**Hero plate.** The synthetic plate was regenerated and is now 1400×933 with the vial at roughly
14% of frame width and an aspect of 0.332 (about 1:3.0). The plate it replaced measured 0.245 (about
1:4.1) against the 1:2.5–3 a real vial reads as — an over-slim cylinder, and the actual cause of the
squashed or side-compressed reading. That was diagnosed by measuring the rendered asset rather than
guessing: `object-cover` can only crop, and the crop window never touched the vial. Full-bleed
behaviour is unchanged, and provenance is still recorded beside the asset in `hero-photo.webp.json`.

**Routes and pages.** Two routes were added — `/all`, every product alphabetical by name, and
`/new-releases`, the newest six by catalog order. Both are served by a new extension,
`extensions/elune-catalog/`, because themes cannot register routes in EverShop; the theme binds to
those routes by folder name. 2.2.1's `products` collection exposes no creation-date sort, so the
ordering is done in the component rather than through a `sort:` argument that would be silently
ignored. Three CMS pages were added — `/faqs`, `/shipping` and `/contact` — admin-editable with no
rebuild and created idempotently by the seeder, which only fills unset settings and so cannot revert
an owner's edits. The contact page reads `storeEmail` from the store settings and says plainly that
no address is configured when it is unset; it does not invent one.

**Product page.** An "About this compound" section
(`themes/elune/src/pages/productView/ProductDescription.tsx`) renders between the price and the
specification table: one to two plain-language paragraphs on what the compound is, then a "Published
research on this compound" block. Its heading is deliberately not "Product Description", because
core renders its own heading by that name into the same area. The literature block is deliberately
un-ruled — no borders, no table — so it cannot be mistaken for the specification record, and it
carries its own sentence stating that it documents the external research literature and not this
product, the batch supplied, or any analysis of it, and that no certificate of analysis is published
for any product. Three SKUs ship with no literature at all (Epitalon, and both CJC-1295 entries) for
compliance reasons; for those the entire literature section is omitted, never rendered as an empty
heading. All 21 surviving references were retrieved from PubMed by machine and resolved to exact
title, journal, year and DOI; several candidate citations were rejected because a quoted study title
itself asserted an effect — a "Once-Weekly" dosing interval, "increases telomere length", "doping
peptides", "Antioxidant … Properties".

**Detector and regression state.** The design detector reports no findings on the shipped surfaces,
and the repository's checkout regression (`scripts/smoke-checkout.mjs`) passes end to end.

## Proposed redesign (2026-09-13, awaiting owner approval — nothing has been built)

`DESIGN-mockup.md` at the repository root carries the full brief: discovery audit, token layer with
computed contrast, component rules, anti-pattern guardrails, responsive/motion/a11y, and the
integration map. The prototype is `docs/design/mockups/elune-landing-mockup.html` (self-contained,
no JS, no network), verified at 1440px and 390px.

Direction roll `5e5d0361`, assigned candidate **4 — Lunar Plates**, from a grounded list of seven;
six catalog challengers were dealt by the roll, fused with the product and declined, each with the
discipline it contributed (one accent, level legends, hairline ruling, tabular data, a real pressed
control state, themed browser surfaces).

Three decisions are with the owner: **D1** Manrope replaces Source Sans 3 as the display face (Inter
rejected) — note the theme ships only SS3 400/500/600/700 today, so the 250 display weight falls back to
400 until the Manrope variable file (`wght 200–800`, subset fetched) is self-hosted; **D2** the single
`--night` record band, pending per the hard constraint above; **D3** whether the lime beam `#CFF26F`
stays for badges or the page goes fully achromatic.

**One dependency to settle before the copy ships.** The proposed trust row restores "Batch and lot
identifiers recorded against every product," which is the line the shipped build deliberately replaced
because no lot identifier exists in the seeded data. `PRODUCT.md` §37 asserts it, so the claim is not
baseless — but either the seeder gains a real `lot` field, or the line reverts to the decided form
("Form, storage and purity on every product"). Do not ship the claim on the current catalog.

Until approved, `DESIGN.md`, `.impeccable/design.json` and every file under `themes/elune/src` are
untouched. On approval this section merges into "Shipped world" and the pending direction contract
loses its "(proposed)" markers.

