# Design Brief — Elune Labs Landing ("Lunar Plates") — v5 (distilled)

This file records the **owner-approved v5 landing specification**: section order, fixed copy, nav destinations, scoped exceptions, and content-truth bans for the homepage. The storefront-wide design system that followed — tokens, type scale, radii, component anatomies across every route — lives in [`DESIGN.md`](../../../DESIGN.md). Prefer that file for the token encyclopedia; this brief does not restate the full palette. Normative prose source: [`docs/design/.mockups/DESIGN-mockup-v5.md`](DESIGN-mockup-v5.md). Visual prototype: [`docs/design/.mockups/elune-landing-mockup-v5.html`](elune-landing-mockup-v5.html). Landing surface: [`themes/elune/src/pages/homepage/Elune.tsx`](../../../themes/elune/src/pages/homepage/Elune.tsx).

**Mode:** Persuade, constrained by storefront trust. **Thesis:** object and record share the first viewport at equal scale — a numbered research-journal plate, not a banner.

---

## 1. Page sequence

Owner-locked order (announcement and footer are shared chrome; `Elune.tsx` owns the middle bands):

1. Announcement bar (`--mist`, 38px)
2. Sticky header (snow, 74px, 1px hairline)
3. Hero + Plate 01 (`--mist` band)
4. Value ribbon (`--snow`)
5. Categories strip (`--mist`)
6. Catalogue plates (`--snow`) — four featured compounds
7. Night band (`--night`) — cratered-disc motif + three directed reviews + feet
8. Footer (`--snow`, hairline top)

Exactly **one** deep `--night` region on the page. Light-only theme otherwise. Tokens, radii, type steps, and browser surfaces: see `DESIGN.md`.

---

## 2. Chrome (outside `Elune.tsx`)

### Announcement
- **"For research use only. Not for human consumption."**
- **"Prices in USD · Guest checkout"**
- Sentence case; never a countdown or discount.

### Header nav — seven destinations
**Home · New releases · Shop · FAQs · Payments · Shipping · Contact us**, plus cart (mono count) and one compact **"Shop all"** pill.

- **Shop:** native `<details>` holding the five live categories with mono counts, fixed domain order: GLPs, Bioregulators, Recovery, GH Releasing, Other.
- **Payments → `/faqs`.** There is no `/payments` route; the destination documents how payment works. Never link Payments to `/payments`.
- Logo: official transparent header lockup at **48px** height (`width: auto`).
- No search field, no mega-menu, no blur. ≤900px: destinations move into a pill disclosure beside the cart. ≤400px: hide the "Shop all" pill.

### Footer
- Mark + positioning line: **"Research reference compounds, catalogued with their specification on record."**
- Columns: **Catalogue** (All products, New releases, five categories) · **Information** (FAQs, Shipping, Contact us) · **Payment** (Bitcoin, USDT (ERC-20), Ethereum — all to `/faqs` in the shipped theme).
- Base: RUO line left; **`© 2026 Elune Labs · Prices in USD`** right in mono.

### Age gate
Unchanged behaviour (`elune_age_ok`, 30 days, advisory). Restated in Lunar Plates chrome; sole permitted light-side scrim shadow.

---

## 3. Hero + Plate 01

**Band:** mist. Left copy column; right **Plate 01** sheet (32px radius, ash edge).

### Owner-selected copy
- **H1:** `Research peptides. Direct from the source. Uncompromising purity.`
- **Lede:** `Every compound has a ≥99% purity or we reject the batch. Quality is our primary focus — affordable bulk pricing for everyone. Transparent order process. All info is posted in the product pages, checkout needs no account, and every parcel ships tracked and discreet.`
  - Inline `.mono` on **`≥99%`** (Manrope lacks U+2265) and on the prose word **"everyone"** (scoped Mono-Is-Data exception).
  - Scoped rule: `.lede .mono { font-size: 1em }` so the shared mono step does not shrink the glyphs inside the lede.
  - Purity is a **declaration**, never "verified" / certificate theatre.
- **Primary CTA:** `Browse the catalogue` → `/all` (filled pill + drawn arrow).
- **Secondary:** `How ordering works` → `/faqs` (text link + drawn arrow).
- **Proof line (`.scope.muted`):** `Extensive catalog across 5 core research categories` (prose, not mono; no stale compound count).

### Plate 01
- Hero SKU: **`BPC157-5MG`**.
- Head: beam chip `Plate 01` + mono SKU.
- Figure: night-cap vial photograph, framed **3:4**, `object-fit: cover`. Provenance on disk: `docs/refs/assets/brand/Product-placeholder-vial-night-cap-moon-3-4.jpg` (the theme serves `/assets/plates/hero-photo.jpg`; see `themes/elune/public/assets/plates/hero-photo.jpg.json`). Alt names the midnight-navy crimp cap and Elune Labs label.
- Spec rows from `productSpecs.ts` only — **omit unsourced fields**, never blank or guess. Ordered: Purity, Form, Sequence, Storage. Storage string literal when present: `Store cool and dry, away from direct light`.
- Foot: category · strength chip + `View compound` link.

---

## 4. Value ribbon

Replaces the v1 ruled ledger. Full-bleed snow band between hero and categories; hairline pipe between items; 64s linear infinite drift of two identical sets; pause on hover and keyboard focus (`tabindex="0"`, `role="region"`); `prefers-reduced-motion` stops drift and enables native horizontal scroll.

### Owner-selected statements (verbatim)
1. `Tracked & discreet, flat rate shipping`
2. `Bitcoin, USDT (ERC-20), and Ethereum Accepted`
3. `Batch tracking for each vial`
4. `Best in class factory direct pricing`
5. `Unbeatable delivery rate. Zero issues.`

**Scoped exceptions:** owner-requested ticker overrides the inherited "no marquees" ban because the ribbon *is* the features component. Statements 3–5 (and the ERC-20 rail label as owner copy) are landing exceptions; they do not transfer to other routes without operational proof. "Batch tracking" means identity tracking only — no per-batch document affordance (§ content-truth). No purity figure and no verification adjective in the ribbon.

---

## 5. Categories

- Heading: **`Quality compounds, across five core categories.`**
- Text link: `All products` → `/all`.
- One 16px-radius strip, five cells divided by 1px rules — not floating cards.
- Each cell: category name in its accent hue, mono `NN compounds` count, drawn arrow visible at rest (touch).

---

## 6. Catalogue plates

- Heading: **`From the catalogue.`**
- Text link: `New releases` → `/new-releases`.
- Four plates, numbered **02–05**, SKUs in order:
  - `SEMAGLUTIDE-5MG` · `EPITALON-10MG` · `TB500-10MG` · `IPAMORELIN-5MG`
- Drop a SKU missing from the live catalogue rather than fabricating a filler.
- Card anatomy (v5): `Plate 0n` chip + **mono SKU in category accent** · authored vial cutaway · name · mono form · size · mono price · `View` link. Hue marks the identifier only — not buttons, prices, or containers (v3).

---

## 7. Night band (motif + reviews)

Single `--night` band. Record table removed from the landing (v4.3); full spec lives on product pages.

- **Motif:** authored cratered-disc SVG, ~16% white / `currentColor`, bleeding off the right — the system's only ornament.
- **Heading:** `From recent orders.`
- **Three owner-supplied reviews** (quality, shipping, order friction only — no efficacy, dosing, medical, human-use, or purity claims):

  | Name | Meta | Quote |
  |---|---|---|
  | Marcus D. | Austin, TX · Aug 2026 | “Vials arrived sealed, labeled and exactly as the spec page described. Ordered Monday night, tracking by Tuesday morning, on my desk Thursday.” |
  | Elena R. | Portland, OR · Jul 2026 | “I braced for a clunky first order and got the opposite. Guest checkout, paid in USDT, pasted the transaction ID, done in under five minutes. Nothing about it felt like a gamble.” |
  | Dana W. | Tampa, FL · Aug 2026 | “Third reorder and the standard hasn’t slipped. Every vial matches the spec on the page, shipping is quick, and the whole thing takes about two minutes.” |

- Order photography under the meta (not face avatars); provenance `docs/refs/assets/imgs/td-1.jpg` … `td-3.jpg`.
- **v5 card treatment:** `--night-surface` card, 1px `--night-rule`, 16px radius, dark-band shadow `0 8px 24px rgba(0,0,0,.22)` (light side stays flat). Quote: serif italic, transparent ground inside the card, **3px `--beam` left bar**, radius `0 6px 6px 0`. No circle avatars.
- **Transparency foot:** `Collected from completed orders and published unedited. Names shortened to first name and last initial.`
- **Purity caveat (rehomed here):** `The purity value is a product specification, not a batch test result.`
- Band padding tighter than standard sections: `clamp(36px, 4.5vw, 56px)` top / `clamp(32px, 4vw, 48px)` bottom.

**Scoped exception:** owner-directed testimonials supersede the earlier "no testimonials" ban *for this section only*. Metrics, partner logos, press marks, and invented ratings remain banned.

---

## 8. Motion & arrows

- One authored entrance: `.rise` — 14px rise + fade, 660ms exponential ease-out, ~70ms stagger.
- Arrow: drawn SVG path only (`currentColor`); never `→` / `»` / `›` glyphs. Hover translate 3px.
- `prefers-reduced-motion: reduce` removes entrance motion and halts the ribbon drift.

---

## 9. Scoped exceptions (landing)

| Exception | Scope |
|---|---|
| `.lede .mono { font-size: 1em }` | Hero lede inline mono glyphs |
| Mono on the word **"everyone"** | Hero lede only (Mono-Is-Data otherwise) |
| Value ribbon ticker | Features component; not decorative marquee elsewhere |
| Owner ribbon statements 3–5 (+ landing rail wording) | Landing only without operational proof elsewhere |
| Three directed reviews + order photos | Night band only; lifts § fabricated-social-proof ban here |
| Beam as 3px quote bar | Review quotes (badge + selection + this bar) |
| Dark-band review card shadow | Night band cards only |

---

## 10. Content-truth bans (hard)

From the v5 guardrails (storefront still bound by `DESIGN.md` §13):

1. No neon gradient blobs, glow edges, halo shadows; no warm paper / cream / tan / ochre systems.
2. No three-column pastel icon grids; no uniform border radius; no glassmorphism; no drop shadows on the light side.
3. No eyebrow/kicker above headlines; plate numbers exempt (catalogue identity).
4. **No verification theatre:** no "tested / verified / certified / accredited", no CoA affordance, no testing status. Purity is the literal `≥99%` **specification**, never a result.
5. No fabricated social proof, metrics, partner logos, or press marks outside the owner-directed review set.
6. No dosing, medical, body-composition, or weight-loss framing; no body imagery.
7. No monospace as costume — data and the recorded lede exceptions only.
8. WCAG AA on every text pair; secondary text on a coloured surface is tinted from that hue, never grey.

Omission rule: `productSpecs.ts` is the only spec source; missing fields drop the row.

---

## 11. Implementation check (`Elune.tsx`)

Code read only — **not** browser-verified.

| Spec item | In `Elune.tsx` / nearby theme | Notes |
|---|---|---|
| `HERO_SKU = 'BPC157-5MG'` | Match | Plate 01 gated on live catalogue find |
| `FEATURED_SKUS` order (four SKUs above) | Match | `index={position + 2}` → Plates 02–05; missing SKUs dropped |
| H1 + lede + CTAs + proof line | Match | `≥99%` and `everyone` in `.mono`; proof uses `CATEGORY_URL_KEYS.length` |
| `COMMITMENTS` five owner strings | Match | Inline comments flag unsubstantiated claims for 2–5 |
| Categories / catalogue headings | Match | Fixed strings as specified |
| `REVIEWS` quotes, names, meta, photo paths | Match | Photos served from `/assets/order/td-*.jpg` |
| Purity caveat foot | Match | Second `.proof__foot` |
| Night-band card chrome (surface, beam bar, shadow) | Match in `homepage.scss` | Aligns with v5.2 |
| Announcement / nav / footer | Shared components | `Announce.tsx`, `Nav.tsx` + `siteLinks.ts`, `FooterNav.tsx` — not composed inside `Elune.tsx` |
| Seven destinations; Payments → `/faqs` | Match in `siteLinks.ts` / `Nav.tsx` | |
| Payment rails labelled ERC-20 | Match in `siteLinks.ts` | Resolves the v2 mockup’s TRC-20 footer contradiction toward ERC-20 |
| Catalogue card-head = mono **SKU** in category accent | **Mismatch** | `ProductListItemRender` currently paints the **category display name** (accent-coloured) in the head row, not the SKU string the v5 plates used |
| Catalogue foot = `View` only | **Mismatch vs v5 HTML** | Shared plate component also renders compact **Add to cart**; v5 mockup foot was View-only |
| Hero image path | Theme serves `/assets/plates/hero-photo.jpg` | Source file is `docs/refs/assets/brand/Product-placeholder-vial-night-cap-moon-3-4.jpg` (`hero-photo.jpg.json`) |

---

## Sources

- [`docs/design/.mockups/DESIGN-mockup-v5.md`](DESIGN-mockup-v5.md) — normative v5 prose and changelogs
- [`docs/design/.mockups/elune-landing-mockup-v5.html`](elune-landing-mockup-v5.html) — v5 structure and fixed strings
- [`DESIGN.md`](../../../DESIGN.md) — storefront-wide Lunar Plates system (tokens and cross-route rules)
- [`themes/elune/src/pages/homepage/Elune.tsx`](../../../themes/elune/src/pages/homepage/Elune.tsx) — landing composition
- [`themes/elune/src/data/siteLinks.ts`](../../../themes/elune/src/data/siteLinks.ts) — seven destinations and Payments → `/faqs`
- [`themes/elune/src/components/frontStore/catalog/ProductListItemRender.tsx`](../../../themes/elune/src/components/frontStore/catalog/ProductListItemRender.tsx) — shared catalogue plate
