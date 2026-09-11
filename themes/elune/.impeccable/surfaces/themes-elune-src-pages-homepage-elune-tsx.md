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

## Direction contract

**THESIS.** A conventional storefront, executed properly for a non-scientist buyer: clean, warm and trustworthy, where the confidence comes from precise products and honest statements rather than from decoration or performance. It refuses the category's two habits — the hype-and-countdown supplement page and the neon biohacker terminal — and equally refuses the lab-cold institutional register, which reads as intimidating or fake to the people who actually buy here.
**OWN-WORLD.** Warm near-white paper ground, white panels, warm graphite ink, soft warm-grey hairline rules, one confident accent carried by the primary action and by category. One sans face for voice, one monospaced face for numbers only. Square corners at small radius, single soft-offset card shadows, comfortable density, generous white space on a strict grid.
**STORY.** A visitor lands, reads one line telling them plainly what is sold and what is documented about it, sees four statements that are all checkable, then opens a category or a product. Nothing asks to be believed; the product page is where confidence is earned.
**FIRST VIEWPORT.** Slim header (wordmark left, five category links, cart right). A wide band beneath: the offer in one line at display scale, one supporting sentence, one filled accent button, and a single vial photograph to the right bleeding to the band edge. Then a hairline-ruled row of four honest trust statements. No kicker above the headline, no gradient, no glow, no badge cluster.
**FORM.** Category-standard commerce at full craft. The comp supplies arrangement, scale and rhythm only — never its words. Density comfortable; specification detail available on the product page without dominating the homepage. Motion is one authored moment on scroll-in; nothing loops, nothing pulses.
**RAISES / BORROWED DISCIPLINE.** Batch/lot identity appears as a plain product attribute on product surfaces, never as a verification badge. State lives with the thing it describes, never as a floating overlay. Specifications are real tabular data with proper semantics, not a decorative panel.

### Void regions — comp content that must not be built
The canon comp is a **direction card, not a content-approved artifact**. Its painted words are arrangement, not copy:
- **Hero headline "Research-Grade Peptides, Verified" is void.** It asserts third-party verification. No surface may present, link, or imply testing, certification, or accreditation while no document exists. Replace with a plain statement of what is sold and what is documented (batch/lot identity and a full specification).
- **"THIRD-PARTY TESTED" badge is void.** The four trust statements carry only honourable facts: tracked & discreet shipping, crypto payment (BTC/USDT/ETH), batch/lot identity on every product, research-use-only framing.
- **The newsletter capture band is void** — email marketing is a v1 non-goal. Replace with a quiet band; the page closes on the footer's compliance line.
- **All prices, counts, ratings and product names painted in the comp are void.** Real content comes from the live catalog and the seeded spec data.
- **Compound names painted in any comp are not the catalog.** The catalog is the five categories and the compounds listed in the data contract below.

### Photography stance
The hero still life is a **produced raster** with recorded provenance. Catalog products ship with no images, so **no surface may render an empty image box**: product cards are complete on name, size, lot, form and price alone. Build a text-led product card, not a photo-led card with a missing photo.

## Hard constraints
- **Research-use-only is absolute, and approachability does not relax it.** The audience buys to research on themselves, so plain language is required — and dosing, protocols, cycle advice, medical or weight-loss claims, before/after and body imagery remain forbidden on every surface. No weight-loss framing anywhere near the GLP category; it is presented as a research reference compound like any other.
- **No verification claims.** No "tested", "verified", "certified", "accredited", no certificate affordance, no testing status. Purity is the literal `≥99%` on every product — a placeholder declaration, never a precise measured figure. An unsourced specification value is omitted, never status-flagged and never labelled "pending" or "coming soon".
- **Light only.** Never a dark surface anywhere.
- **Shop-able, not just pretty:** every link, control and form on the touched surfaces works.

## Data contract (settled — do not invent)
**Categories (five, keyed by `url_key`):** `glps`, `bioregulators`, `recovery`, `gh-releasing`, `other`. Currently the database holds the old trio, so `scripts/catalog-data.json` is reseeded to these five and the seeder creates them.
**Category accents:** five muted deep keys in `shadcn.css` — `--accent-glps`, `--accent-bioregulators`, `--accent-recovery`, `--accent-gh-releasing`, `--accent-other` — each readable at AA on the light ground. `CategoryAccent.tsx` already keys `var(--accent-<url_key>, var(--accent))`; the fallback must never be what a real category renders as.
**Products:** the seeder carries only `name, sku, price, qty, category`. Product specification data (CAS, formula, molecular weight, sequence, purity, form, storage) lives in **one** theme-side map keyed by SKU — `themes/elune/src/data/productSpecs.ts` — and the product page renders it. One source of truth; do not duplicate spec values into the seed file. Values must come from the sourced chemistry table in the shape brief; a value that is not sourced is omitted from the record entirely.

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

