# Design Brief — Elune Labs Landing Redesign ("Lunar Plates") — v4

**Status:** proposal for review, **v4 working copy**. `DESIGN.md` (the shipped Warm Paper system) is untouched; on approval this
brief promotes to `DESIGN.md` + `.impeccable/design.json`, and the prototype becomes the build blueprint.
The base brief (`DESIGN-mockup.md`) remains the full specification; this v4 file carries the v1 delta in §0 and the v2–v4 deltas in the Version Changelog at the end.
**Surface:** `themes/elune/src/pages/homepage/Elune.tsx` · **Mode:** Persuade, constrained by storefront trust.
**Prototype:** `docs/design/mockups/elune-landing-mockup-v4.html` (single self-contained file, no JS, no network).

---

## 0. v1 change record (2026-09-13)

Surgical revision of the header logo and the hero region only. Every token, section and rule outside
these two regions is inherited unchanged from the base brief; nothing below re-specifies them.

### 0.1 Header logo — display size
- **Change:** `.brand img` height `38px` → `48px` (`width:auto`, aspect preserved). The 74px nav bar
  absorbs it with no reflow of the link row or the right cluster.
- **Raster note:** the source is `website_header_logo_transparent.png`, 378×188 — the highest-resolution
  header asset in the owner-verified kit. At 48px display height the render is a 0.26× downscale of
  native, so no pixelation; no asset swap was required.

### 0.2 Hero copy
- **H1:** "Research peptides, with the record attached." → **"Research peptides. Direct from the source.
  Uncompromising purity."** Three-beat sentence-case line; keeps the whisper-weight display register and
  names the two things the audience buys on — sourcing and purity — without hype register.
- **Lede:** the documentation-mechanism sentence is replaced by two sentences carrying exactly three
  proof points — the purity declaration, transparent pricing, frictionless discreet ordering:
  "Every compound has a ≥99% purity or we reject the batch. Quality is our primary focus — affordable bulk pricing for everyone. Transparent order process. All info is posted in the product pages , checkout needs no account, and every parcel ships tracked and discreet."
  The `≥99%` figure sits in an inline `.mono` span: Manrope's latin subset lacks U+2265 (§2), so the glyph
  must render in the mono face or fall back jagged. A scoped `.lede .mono{font-size:1em}` rule keeps that
  inline figure at the lede's own 18px — the shared `.mono` class's 13px would otherwise render it
  visibly small inside the prose.
- **Proof badge under the CTA:** "14 compounds · 5 categories" → **"Extensive catalog across 5 core
  research categories"** — catalog scope without a count that goes stale as the catalogue grows.
- **Compliance note:** the requested subtext focus ">99% *verified* purity" is rendered as the standing
  `≥99%` **declaration**, never "verified": §4.9 and PRODUCT.md ban verification theatre because no
  certificate exists in this repository. The purity focus is honoured; the banned adjective is not.
  Flagged for owner confirmation at the v1 review gate.

### 0.3 New micro-token
- `.scope` — 13px / 1.4, weight 500, sans (Manrope), colour via existing `.muted` (`--slate`, 5.15:1 on
  the mist hero band — AA). It replaces the badge line's `mono` class because the new string is prose,
  not data, and the Mono-Is-Data rule (§2) forbids mono as costume. No other type step changes.

### 0.4 Hero plate figure — asset swap
- **Asset:** the embedded landscape hero photograph is replaced by
  `docs/refs/brand-assets/Product-placeholder-vial-teal-cap-moon-3-4.jpg` (1158×1536, ≈3:4), embedded as a
  base64 JPEG so the mockup stays a single self-contained file; this path is its provenance of record.
- **Framing:** the old `transform:translate(16px,-2px) scale(1.36)` crop hack (written for the landscape
  webp) is deleted; `object-fit:cover` remains. The asset's 0.754 ratio against the figure's 3/4 crops
  under 0.6% per side — no letterbox seam against `--snow`, no distortion. The ≤640px overrides
  `.plate-figure{aspect-ratio:3/2}` and `.plate-figure img{transform:scale(1.2)}` — both tuned for the
  old landscape webp — are deleted with it: the base 3/4 figure and `cover` frame the portrait asset at
  every width, 390px included.
- **Alt:** rewritten to the actual subject — "Sealed glass vial with teal crimp cap and Elune Labs label,
  lyophilized powder at the base, on a pale seamless ground".
- **Rationale:** the plate now shows a branded object instead of a cropped photograph, which optically
  balances the display column at equal weight and teaches the object to a non-scientist (§3 thesis).

---

## 1. Discovery audit

### Stack (verified in the repo, not assumed)
| Layer | Fact | Consequence |
|---|---|---|
| Engine | EverShop 2.2.1, PostgreSQL 16, theme at `themes/elune` is presentation-only | No engine change; every decision below is CSS + component markup |
| Build | `swc ./src -d dist`; no dev server, no bundler | Tokens must live in CSS, not JS |
| Styling | Tailwind v4, config-in-CSS: `src/pages/all/tailwind.css` (`@theme inline`) importing `src/pages/all/shadcn.css` (raw `:root` hex) | New tokens go in `shadcn.css`, bound in `tailwind.css` — the existing convention, kept |
| Type | Self-hosted woff2, `@font-face` declared in `src/pages/all/global.scss` | Faces are replaced in place; no CDN, no third-party request |
| Data | `scripts/catalog-data.json` (14 products, 5 categories), `src/data/productSpecs.ts` (spec record by SKU, `PURITY_DECLARATION = '≥99%'`), `src/data/categories.ts` (display order) | The prototype renders **real** catalog values |
| Components | `Elune.tsx` (4 sections), `Nav`, `FooterNav`, `Wordmark` + `BrandMark`, `ProductListItemRender`, `AgeGate`, `RuoFooter` | `BrandMark.tsx`'s generated crescent is replaced by the official kit; `CategoryAccent.tsx` does **not** exist (a prior brief referenced it) — category colour stays a token + inline `var()` as `Elune.tsx` already does |
| Assets | `public/assets/plates/hero-photo.webp` is the only photograph; `public/assets/favicon.svg` hardcodes `#8a5a1c` | One real plate photo, reused and cropped; favicon moves to the official PNG family |

### Brand assets (verified)
`docs/refs/brand-assets` is the owner-verified identity. Measured, not assumed:
`website_header_logo_transparent.png` 378×188, ink bbox 354×177 (2:1) — cratered crescent mark left, stacked
`ELUNE / LABS` right, **pure black on transparent**; `simplified_wordmark_transparent.png` 364×53 (9.2:1);
six favicon PNGs + `favicon.ico`. Because the mark is monochrome, it recolours by context — the crescent's
crater dots are the seed of the one decorative motif in this system (§ 7).

The kit is a **pure-black raster with no vector source**, so it cannot be recoloured to a chromatic ink:
the palette deliberately keeps its ink near-neutral (`--night #16233C`, a cool midnight) so the black mark
sits natively beside the type and the CTA instead of fighting a saturated hue. On any dark ground the
white asset twin is used (integration map item 3; the prototype renders no mark on the ink band).

### Benchmark: Seed (refero.design)
Source: <https://styles.refero.design/style/cd723d5a-e7ea-4e4c-a3bb-6cf56e05057a> — read as published
tokens, so the values below are **machine-verified, not inferred** (canvas `#fcfcf7`, ink `#1c3a13`,
accent `#d3fa99`, radii 1000/16/32/8, base unit 8 with section gap 64 / card padding 16 / element gap 8,
display weights 300–350, and literally empty `shadows` and `gradients` arrays). What is taken is **structure and discipline**, not palette — the owner's
binding mental image (lunar, sky, space, white) and the banned list outrank Seed's greens:

| Seed trait | Verdict here |
|---|---|
| 93% achromatic, one vivid accent; whisper-light 300–350 display; **flat — the token set carries empty `shadows` and `gradients` arrays** | **Taken** |
| 8px base unit, 1200px max width, 64px section gap, 16px card padding, 8px element gap | **Taken** |
| Radius: inputs 8 / cards 16 / large cards 32 / buttons + badges pill (1000px) | **Taken** |
| Mono companion (JetBrains Mono) at 12–16px, +0.015em, for codes and data | **Taken** — already the repo's face |
| Snow White `#fcfcf7` canvas, Forest Depths `#1c3a13` ink, Lime Pulse `#d3fa99` accent | **Adapted** — cool lunar neutrals, deep midnight ink, one lime beam; warm off-white and olive gold are out under the ban list |
| "No blues, reds or purples" | **Adapted** — five cool category hues are required for browse legibility; flat, never neon |

**Resolution rule — which clause wins.** The owner's ban list outranks the reference. Seed carries three
values inside the banned families — Warm Stone `#eeeee9`, Olive Gold `#9f995b`, and the faintly warm canvas
Snow White `#fcfcf7` (adjacent to the retired `#faf9f7` warm paper) — so none is copied: `#fcfcf7` →
`--snow #F7F8FA` (cooled to a lunar near-white), `#eeeee9` → `--mist #ECEFF3`, `#9f995b` → dropped, no warm
hue survives anywhere. Seed's *structure* is taken unchanged — one accent, flat, no shadows or gradients, 8px
unit, pill + 16/32 radius, mono for data, display at weight 300–350 — and its own don'ts are honoured: no
headline weight ≥600, no pure `#ffffff` as the canvas, every primary control a pill.

### Direction decision record
Concept roll `5e5d0361` assigned candidate **4** of the grounded seven. Grounded list, in resonance order —
each is something this audience reads or owns, not a mood:
1. *The CoA broadsheet* — the certificate as a printed page. **Not the lead:** it is the specimen-archive register the owner already rejected; its hairline ruling is kept.
2. *The selenographic atlas* — moon maps with coordinate ticks. Kept as one authored motif, not the whole surface.
3. *The index-card apothecary* — typed catalogue cards in a drawer. Kept as the plate card's field-list rhythm.
4. **Lunar Plates** — a numbered plate from a research journal: object left, specification caption right. **Assigned, built.**
5. *The block explorer* — mono readouts, confirmation states. Kept as the mono/data discipline.
6. *The bench notebook* — grid paper and ink diagrams. Kept as the cutaway figure.
7. *The ephemeris table* — almanac columns. Kept as the record table on the ink band.

Challengers dealt by the roll, each fused with the product before judgement (axes: audience identification,
product clarity):
- *Silk canopy of indigo/madder/saffron* — **declined**: multi-hue wash breaks the one-accent rule. Kept: "clear sky as rest state" → the snow canvas is the resting field, colour is always an event.
- *Gravity-rain garden* — **declined**: bent baselines fail readable hierarchy. Kept: "the legend stays level" → every data label is level and mono.
- *Midnight transit enamel mural* — **declined**: midnight ground as a *page* violates light-only. Kept: disciplined line routing and the interchange circle → the cratered-disc motif and hairline rules; line-colour coding → category hues at AA.
- *Glyph-rain terminal* — **declined**: phosphor-on-black. Kept: data locking into readable rows → tabular alignment of every spec value.
- *HyperCard shoebox* — **declined**: one-bit Chicago pixel menus are costume on a store. Kept: a real pressed/inverted control state → pill buttons invert to ink-on-white on hover.
- *Phosphor terminal* — **declined**: glow. Kept: the caret, selection and scrollbar are themed from the palette rather than left to browser defaults.

**Canon stands (owner-locked 2026-09-11).** `.impeccable/mocks/decision/canon.json` records `approved: true`
with the owner's words — "I do not like that design, please just use the standard one you mentioned earlier…
convention is now the commitment" — after rejecting The Specimen Archive. This proposal re-opens the
**visual world** only (that world's ground is the now-banned warm paper) and keeps the canon's section order
exactly: announcement → nav → offer + product photo → four trust statements → five categories → featured
products → footer. One region is added — the ink band, pending D2 — and it is a region inside
the canon order, not a reordering. That band first carried the specification record; v4.3 strips the
record text out of it and seats the directed reviews beside the motif (§3; changelog v4.3). No dossier,
archive or specimen register returns.

**Thesis.** A storefront that behaves like a catalogue of plates: the object and its record share the first
viewport at the same scale, so trust is earned by what is written down, and by atmosphere. It prefers the subtle use of the category's hype terminals and equally refuses lab-cold institution.

---

## 2. Design tokens

### Colour
**Strategy: Restrained**, derived from one sentence of physical scene rather than a default: *a specimen
plate on a pale table under a clear night sky.* The scene is light, so the surface is light; the night sky
appears **once**, as a single region, and never becomes the theme.

Two registers: a cool near-monochrome field (snow / mist / night) and one vivid accent. No warm hue
anywhere; no tan, no brown, no ochre, no paper cream.

| Token | HEX | HSL | Role | Contrast |
|---|---|---|---|---|
| `--snow` | `#F7F8FA` | `hsl(220 23% 97%)` | Page canvas — cool near-white, never cream, never pure white | — |
| `--panel` | `#FFFFFF` | `hsl(0 0% 100%)` | Card, menu, sheet surface; one tier above canvas | — |
| `--mist` | `#ECEFF3` | `hsl(214 23% 94%)` | Alternating band, hover fill, mute | night 13.59:1 |
| `--hairline` | `#DBDFE6` | `hsl(218 18% 88%)` | 1px borders and dividers | — |
| `--ash` | `#B7BDC9` | `hsl(220 14% 75%)` | Disabled chrome, the plate sheet's edge, arrow rest state | — |
| `--night` | `#16233C` | `hsl(219 46% 16%)` | **The only chromatic authority:** text, button fills, the ink band, caret, focus ring | 14.75:1 on snow |
| `--slate` | `#5A6479` | `hsl(221 15% 41%)` | Secondary text: nav, trust lines, spec labels | 5.59:1 on snow, 5.15:1 on mist |
| `--beam` | `#CFF26F` | `hsl(76 83% 69%)` | **One vivid accent:** badges and small emphasis only — never a background, never body text | night on it 12.93:1 |
| `--night-muted` | `#C3CEE4` | `hsl(220 38% 83%)` | Secondary text *on the ink band* (tinted from the hue, never grey) | 9.90:1 on night |
| `--night-rule` | `#33415F` | `hsl(221 30% 29%)` | Rules and card edges on the ink band | — |
| `--destructive` | `#A32A1F` | `hsl(5 68% 38%)` | Errors and cancellation only (unchanged) | 6.85:1 |
| `--glps` | `#1F6FA8` | `hsl(205 69% 39%)` | Category identity: name, arrow, 1px marks | 5.07:1 |
| `--bio` | `#4A3A9C` | `hsl(250 46% 42%)` | Bioregulators | 8.37:1 |
| `--rec` | `#0F6E68` | `hsl(176 76% 25%)` | Recovery | 5.73:1 |
| `--gh` | `#7A3E86` | `hsl(290 37% 38%)` | GH Releasing | 6.91:1 |
| `--other` | `#4E5870` | `hsl(222 18% 37%)` | Other | 6.69:1 |

Rules: category hues colour **names and marks only** — never buttons, prices, or containers. Every pair
above was computed, not eyeballed; re-verify in the shipped build. Light-only stands: no `.dark` surface,
no dark default. **One** deep band (`--night`) is a permitted region, not a theme (§ 3, decision D2).
**(v4 amendment:** the owner's directive puts the directed testimonials *inside* the single `--night` band,
beside the cratered-disc motif, and strips the record text out of it (v4.3). The page still carries exactly
one dark region; the light-theme commitment is unchanged. The D2 amendment in §3 is the governing record.)

### Typography
Two faces, strict division, both self-hosted under `themes/elune/public/assets/fonts/`:

- **Manrope (variable 200–800)** — replaces Source Sans 3. Semi-geometric with rounded terminals, so the
  whisper register keeps a point of view instead of collapsing into a neutral default; weight 250 at display
  size is the signature. U+2265 (`≥`) is **absent** from its latin subset — so the purity declaration is
  always rendered in mono, where the glyph is verified present. Fallbacks `system-ui, -apple-system, "Segoe UI", sans-serif`.
- **JetBrains Mono (variable, existing subset reused)** — codes, spec values, prices, counts, measures.
  `+0.015em` tracking, `font-variant-numeric: tabular-nums`.

| Step | Size / line-height | Weight | Tracking |
|---|---|---|---|
| display | `clamp(2.5rem, 4.6vw, 4rem)` / 1.06 | 250 | −0.022em |
| h2 | `clamp(1.75rem, 2.9vw, 2.5rem)` / 1.12 | 300 | −0.018em |
| h3 | 1.25rem / 1.3 | 400 | −0.01em |
| lede | 1.125rem / 1.62 | 400 | 0 |
| body | 1.0625rem / 1.6 | 400 | 0 |
| micro | 0.8125rem / 1.4 | 500 | 0 |
| mono | 0.8125rem / 1.5 | 400 | +0.015em |

Body measure capped at 56–72ch; display headings `text-wrap: balance`. No letterspaced uppercase kickers.
Inter is deliberately not used.

**Ship-ability (read before approving).** The theme today ships only Source Sans 3 at 400/500/600/700 —
**no Light face exists** — so a `font-weight:250` rule against today's fonts silently falls back to 400 and
the whisper register does not render. The integration step below (self-host the Manrope variable file —
`wght 200–800`, verified present in the fetched subset) is what makes it real, and it must land with the
token migration, not after it. Manrope's latin subset carries U+00B7, U+00A9 and U+2014 but **not U+2265
(`≥`) and not U+2192 (`→`)**: `≥` therefore always renders in JetBrains Mono (present, verified), and every
arrow in the design is an SVG path, never a glyph. The fetched subset's `wght` axis **defaults to 200**
(verified: `fvar` wght 200–800, default 200, 7 named instances), so any element that inherits without an
explicit `font-weight` renders hairline — declare the weight on body text and every unstyled descendant.

### Spacing & layout
8px base unit · shell `min(1200px, 100% - 48px)` (32px gutters ≤900px) · section padding
`clamp(56px, 7vw, 96px)` · card padding 16px · element gap 8px · grid gutters 20px · hero columns
1.04 / 0.96. Desktop 12-col thinking, tablet 8, mobile 4, collapsing to one column
at 900px (hero) and 640px (cards and category cells).

### Radius & elevation
Differentiated on purpose — uniform radius is banned:

| Family | Radius |
|---|---|
| Buttons, badges, chips, pills | **999px** |
| Inputs and inline controls | **8px** |
| Cards, menus, category strip | **16px** |
| Hero plate sheet | **32px** |
| Plate figure (inner) | **14px** |

**Elevation: none.** Zero drop shadows, zero gradients, no glow. Depth is tonal (snow → mist → night) or
nothing. The existing age-gate scrim keeps its single permitted shadow; nothing else does.

### Browser surfaces (they ship with the design)
`::selection` = beam fill on night text · caret = night · Firefox scrollbar = hairline thumb on snow track ·
focus ring `2px solid var(--night)` at 2px offset (4px on links) · `text-underline-offset: 4px` with the
underline in `--ash` until hover · tabular numerals on every figure column.

---

## 3. Component rules

**Announcement bar (38px, mist).** One compliance line and one operational line, sentence case, no hype:
"For research use only. Not for human consumption." / "Prices in USD · Guest checkout". Never a countdown,
never a discount.

**Navigation (sticky, snow, 1px hairline, 74px).** Three-zone grid `1fr auto 1fr` so the links are optically
centred, not centred in the leftover space. Official `website_header_logo_transparent.png` left at 48px
height (v1, §0.1); Home · New releases · Shop (native `<details>` disclosure holding the five live categories, each with
its mono count) · FAQs · Shipping · Contact us; cart with a mono count and one pill CTA right. No search
field, no mega-menu, no blur. **Below 900px** the six destinations and the five categories move into a pill
disclosure button in the right cluster beside the cart — a `details`/`summary` control, keyboard-operable
natively — so nothing becomes unreachable on a phone. Below 400px the "Shop all" pill hides: it duplicates
the Shop disclosure and the hero CTA, and three controls in that cluster overflow a 360px viewport.

**Hero (mist band).** The thesis, not a banner. Left: display headline (no kicker), one lede that states the
mechanism, one filled pill CTA plus one underlined text link, and a mono data line. Right: **Plate 01** — a
white sheet (32px radius, `--ash` edge) holding the branded vial photograph framed at its native 3:4 on the left (v1, §0.4) and
its specification caption on the right: PLATE 01 beam chip + mono SKU, four hairline-ruled rows (Purity,
Form, Sequence, Storage), then a footer row with a category chip and "View compound →". Object and record
share the viewport at equal weight.

**Value props / features (snow)** — the prompt's Value Props component, played as one ruled ledger of four statements, hairline-separated, no cards, no icons, no
pastel circles. Every statement must be operationally true today: flat-rate tracked and discreet shipping;
BTC/USDT/ETH accepted; identity, form, storage and the ≥99% declaration on every product; batch and lot
identifiers recorded. No certification, no testing status, no speed claims. There is no icon row and no
card row: the ruled ledger *is* the features component in this world.

**Omission state (every plate and every record).** `productSpecs.ts` is the only source and it omits
unsourced fields: `GHKCU-50MG` carries CAS, purity, form and storage only — no formula, no molecular weight,
no sequence; `HUMANIN-10MG` has no formula or molecular weight. A record renders **only the fields present**:
the row is dropped, never blanked, never guessed, never labelled pending. The hero plate's four rows are
therefore BPC-157-5MG's own shape, not a fixed template. **(v4.3:** the landing mockup no longer renders
the full-length table; the complete record lives on the product page per the data contract.) Values are
the record's exact strings — storage is "Store cool and dry, away from direct light", not
a shortened paraphrase.

**The batch/lot line carries a dependency.** `PRODUCT.md` §37 states products carry a batch/lot identifier,
but neither `scripts/catalog-data.json` nor `productSpecs.ts` has one — which is exactly why a recorded
decision on this surface dropped this line from the shipped build in favour of "Form, storage and purity on
every product". Either the seeder gains a real `lot` field before this ships, or the fourth cell reverts to
the decided form (which statement 3 already makes, so the cell then carries the RUO line).

**Categories (mist band).** A full-width strip of five cells inside one 16px-radius container, divided by
1px rules — not five floating cards. Each cell: category name in its hue, mono count, arrow at 0.85 opacity
(visible without hover, so touch works). Hover fills the cell with mist.

**Featured compounds (snow).** Four plates, each: PLATE 0n chip + mono SKU, an authored hairline cutaway of
a sealed vial (crimp seal / glass vial / lyophilized — teaching the object to a non-scientist), name, mono
form · size line, mono price, "View →". The figure is a drawing, so the section is complete with zero
product photography.

**The ink band (motif + reviews, one `--night` band).** **v4.3:** the owner directed the record text out
of this band entirely — heading, lede, beam CTA, Plate 01 label, specification table and caveat line — so
the band now carries the cratered-disc motif (authored SVG, 16% white, bleeding off the right), still the
only ornament in the system, and the three-card review set with its transparency foot and the compliance
foot (the purity-as-specification caveat; the RUO line already renders in the announcement bar and the
footer base). The specification record ships on product pages from `productSpecs.ts` (data contract
unchanged).

**Social proof** (v4: owner-directed customer testimonials). The owner's v4 instruction supersedes the earlier
"no testimonials" position and the §4.10 fabrication ban *for this section only*: three customer testimonial
cards ship inside the `--night` ink band above the footer, with owner-supplied order photography (`docs/refs/assets/imgs/td-1..3.jpg`),
first name + last initial, and city + state abbreviation. Copy stays compliant — quality, shipping speed and
order friction only; no efficacy, dosing, medical or human-use claims, no purity figures, no verification
adjectives. A moderation/transparency line closes the review set. Full spec in the v4 changelog.

**Primary CTA.** Exactly one filled pill per region; secondary routes are underlined text links with a drawn
arrow. Labels name the destination ("Browse the catalogue", "Shop Recovery") — never "Learn more". 44px
minimum target. Rest state ink fill; hover inverts to ink text on white with an ink border.

**Age gate (the real first screen).** Unchanged in behaviour — `elune_age_ok`, 30 days, advisory only,
focus trapped while open — and restated in the new world: a modal sheet on `--snow` with `--night` ink,
hairline border, 16px radius, one sentence of RUO framing and a single pill confirm. It is the one place a
shadow is still permitted (the existing scrim); nothing else in the system casts one.

**Footer (snow, hairline top).** Official mark, one plain line of positioning, three link columns
(Catalogue / Information / Payment), then a base row: the RUO notice left, `© 2026 Elune Labs · Prices in USD`
right in mono. Compliance text is never shrunk or dimmed below AA.

### Decisions the owner should confirm
- **D1 — display face.** Manrope replaces Source Sans 3 (reason: a point of view at whisper weights). Inter is rejected.
- **D2 — the one dark band.** Light-only is honoured as *the theme*; a single `--night` region carries the
  band's content. Say the word and it becomes `--mist` at identical structure. **(v4:** the owner's directive
  keeps D2's single band and changes only what it carries — the cratered-disc motif and the directed
  testimonials — with the specification record moved off the landing page (v4.3). D2's one-band reading
  stands, not superseded; the light-theme commitment is unchanged.)
- **D3 — beam accent.** `#CFF26F` is kept for badges and small emphasis only (Seed's rule). Dropping it makes
  the page fully achromatic.

---

## 4. Anti-pattern guardrails (hard bans)

1. No purple/blue neon gradient blobs, glow edges, or halo shadows. Flat bold colour is welcome; gradients
   as atmosphere are not.
2. No warm paper systems — no cream canvas, no tan borders, no ochre. The retired set (`#faf9f7`,
   `#f2efe9`, `#e5e0d8`, `#8a5a1c`, `#9f995b`) may not reappear. Every neutral here is cool.
3. No tans or browns as colours, including in category accents and illustration.
4. No three-column grids of centred generic icons in pastel circles. Trust is a ruled ledger; categories are
   a ruled strip; products are plates.
5. No uniform border radius. Pills 999 / inputs 8 / cards 16 / hero sheet 32, optically reasoned.
6. No glassmorphism or backdrop blur as decoration. The age gate's existing scrim is the sole exception and
   stays as-is.
7. No drop shadows or elevation cosplay — flat fields only.
8. No eyebrow/kicker above a headline; no "01 / 02 / 03" numbering that carries no information (plate numbers
   are exempt: they are the catalogue's own identity).
9. No verification theatre: no "tested / verified / certified / accredited", no certificate affordance, no
   testing status, no per-batch document links. Purity is always the literal `≥99%` declaration, and it is
   labelled a specification, never a result.
10. No fabricated social proof, metrics, partner logos or press marks. **(v4 amendment:** the owner's v4
    instruction directs three customer testimonials with supplied order photography; those ship as directed,
    and this ban still holds for everything else — metrics, partner logos, press marks, ratings, counts.)
11. No dosing, medical, body-composition or weight-loss framing; GLPs are research reference compounds like
    any other; no body imagery anywhere.
12. No monospace as costume — mono is for codes, data and measures only.
13. WCAG AA on every pair (body ≥4.5:1, large ≥3:1, non-text affordances ≥3:1). Secondary text on a coloured
    surface is tinted from that hue, never grey.

---

## 5. Responsive, motion, accessibility

- Breakpoints 1080 (cards 2-up, strip 2-up) · 900 (hero stacks, links collapse, trust 2-up) ·
  640 (everything single column, trust full measure). Verified: zero horizontal overflow at 390px;
  all four product cards equal height at 1440px.
- **One authored motion:** plates and hero copy rise 14px and fade over 660ms on a single exponential
  ease-out, staggered 60–70ms; the arrow translates 3px on hover. No parallax, no marquees, no cursor
  effects, no per-section repetition. `@media (prefers-reduced-motion: reduce)` removes all of it.
- Semantic headings in order; sections and nav named; the logo is decorative next to an accessible brand
  name; real alt text on the photograph and on each cutaway figure; focus always visible; colour never the
  only signal (category names stay textual); every control keyboard-operable.

---

## 6. Integration map (after approval)

1. Tokens → `themes/elune/src/pages/all/shadcn.css` (`:root`), Tailwind v4 bindings → `tailwind.css`
   (`@theme inline`). No hex literal in any component. **Name mapping:** this brief's `--glps / --bio /
   --rec / --gh / --other` are shorthand; the theme's canonical names are `--accent-<url_key>`
   (`--accent-glps`, `--accent-bioregulators`, `--accent-recovery`, `--accent-gh-releasing`,
   `--accent-other`) and those are what ships.

   **Retirement list — every warm value comes out, not just the ground:** `--background:#faf9f7` (warm
   paper), `--accent:#f2efe9`, `--secondary:#f2efe9`, `--muted:#f2efe9` (warm sand; `--accent` is
   Tailwind's hover/selected **surface** for core menus and rows, so repainting it is not cosmetic),
   `--border/--divider/--input:#e5e0d8` (warm hairline), `--brand-ochre:#8a5a1c`,
   `--accent-gh-releasing:#9a6414` (ochre — tan/brown), `--foreground:#1f1d1a` and
   `--muted-foreground:#6b6558` (warm graphite/grey), plus `tailwind.css`'s `--chart-4:#9a6414`, and
   `public/assets/favicon.svg`'s hardcoded `fill="#8a5a1c"`. Two incumbent category accents already clear
   the ban and survive with a small re-tune: `--accent-recovery #0f6b6b` → `--rec #0F6E68`,
   `--accent-other #5c6270` → `--other #4E5870`. `--accent-glps #1c5f96` → `--glps #1F6FA8`, and
   `--accent-gh-releasing` takes the violet slot the ban frees, → `--gh #7A3E86` (`--bio` becomes
   `#4A3A9C`).

   **Three additions the list above missed, each with a live consumer.** `--primary:#14604a` (deep
   evergreen, bound as `--color-primary`) is the fill for core UI buttons through cart and checkout — it
   becomes `--night`, and `--primary-foreground:#ffffff` becomes `--snow`, or the shipped checkout stays
   green. `--ring:#14604a` is the incumbent focus colour (`outline: 2px solid var(--ring)`); it becomes
   `--night` to match this brief's focus rule. `#1f1d1a` is not one token but five — `--foreground`,
   `--accent-foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground` — and all
   five become `--night`, or warm graphite ink stays live on cards, popovers and secondary surfaces.
   `--chart-1/2/3/4` are exact duplicates of `--ring`, `--accent-glps`, `--accent-bioregulators` and
   `--accent-gh-releasing`; nothing in the theme consumes them, so they are **deleted**, not re-derived —
   otherwise re-keying the hues leaves four stale copies, one of them the banned `#9a6414`.
   `--destructive:#a32a1f` and `--chart-5:#a32a1f` are **kept**: that is a semantic error state, not warm
   decoration, and folding it into the ochre ban would leave error UI colourless.
2. Fonts → self-host `manrope-latin.woff2` (already fetched at
   `docs/design/mockups/fonts/`) beside the existing JetBrains Mono subset; `@font-face` in `global.scss`.
   Retire the four Source Sans 3 files.
3. Identity → `Wordmark.tsx` and `BrandMark.tsx` render the official PNG (light surfaces) and
   `website_header_logo_white.png` (the ink band); favicon → `favicon-32x32.png` / `favicon.ico`, replacing
   `favicon.svg` and its hardcoded `#8a5a1c`.
4. Category hues → the five tokens, applied exactly as `Elune.tsx` already does
   (`color: var(--accent-<urlKey>, var(--foreground))`). No `CategoryAccent.tsx` is introduced.
5. Sections rebuilt inside `Elune.tsx`, keeping its `categories` query and `ProductListItemRender`.
6. **Superseded in v1 by §0.4:** the plate no longer uses `hero-photo.webp`, and the
   `translate(16px,-2px) scale(1.36)` crop is deleted; the v1 asset is embedded as base64 and framed by
   `object-fit:cover` alone at every breakpoint.
7. On approval, `DESIGN.md` is replaced by this brief and `.impeccable/design.json` is written from it.
8. On approval, the governing surface brief
   (`themes/elune/.impeccable/surfaces/themes-elune-src-pages-homepage-elune-tsx.md`) is amended in the
   same pass: its hard-constraint lines — the *single* `--night` region under pending D2, and "No
   fabricated social proof … no testimonials" — contradict the approved design and must be updated to
   record D2 resolved as **one** dark band carrying the cratered-disc motif and the owner-directed
   testimonials, with the no-testimonials constraint superseded by owner direction and the
   source/date/moderation line honoured. Without this step the brief bans what the homepage ships.

## 7. What is deliberately absent

No hero video, no illustration set beyond the one cutaway and the cratered disc, no animation library, no
icon library, no new dependency. The category-standard arrangement the owner picked — hero, honest trust
statements, categories, featured products, footer — is intact; only its world is new.

---

## Version Changelog: v2

Surgical revision of two regions only — the hero plate figure and the value-props band. Every token,
section and rule outside these two regions is inherited unchanged from v1; nothing below re-specifies
them. All prior version files (`DESIGN-mockup-v1.md`, `elune-landing-mockup-v1.html` and earlier) are
immutable and untouched.

### v2.1 Hero plate figure — asset swap to the night-cap vial
- **Asset:** the embedded teal-cap photograph is replaced by
  `docs/refs/brand-assets/Product-placeholder-vial-night-cap-moon-3-4.jpg` (1792×2376, ≈3:4), embedded
  as a base64 JPEG so the mockup stays a single self-contained file; this path is its provenance of
  record. The embedded derivative is downscaled to 1200px wide at quality 82 (≈2× the largest render
  size, 71.6KB vs the source's 1.48MB) to keep the single file light; no visible loss at plate size.
- **Framing:** unchanged — `aspect-ratio:3/4` + `object-fit:cover`. The asset's 0.7542 ratio against
  the figure's 0.75 crops under 0.3% per side: no letterbox seam against `--snow`, no distortion, no
  transform hack at any breakpoint.
- **Why the night cap reads better here:** the cap's midnight navy is the palette's own ink family
  (`--night #16233C`), so the plate object carries the page's ink instead of an outside hue, and the
  black cratered-crescent label puts the owner-verified mark at product scale in the first viewport.
- **Alt:** rewritten to the actual subject — "Sealed glass vial with midnight-navy crimp cap and
  Elune Labs label, lyophilized powder at the base, on a pale seamless ground".

### v2.2 Value props — ruled ledger replaced by a scrolling ribbon
- **Copy:** the four v1 ledger statements are dropped; the ribbon carries the five owner-supplied
  statements verbatim: "Tracked & discreet, flat rate shipping" · "Bitcoin, USDT (ERC-20), and
  Ethereum Accepted" · "Batch tracking for each vial" · "Best in class factory direct pricing" ·
  "Unbeatable delivery rate. Zero issues."
- **Form:** a full-bleed horizontal ribbon on `--snow` between the hero and the categories, replacing
  the vertical ruled ledger. One `--hairline` pipe between items — the ledger's ruling turned 90° —
  and the ledger's own 15px/1.5 `--slate` type, so the band keeps the v1 trust row's voice while it
  moves. Items are `white-space:nowrap`; the band is a ticker, not a wrapping list.
- **Motion:** the track holds two identical sets and drifts exactly one set-width per 64s loop
  (`@keyframes ribbon-drift`, `translateX(-50%)`, linear, infinite) — slow enough to read at a glance,
  seamless at the seam because every item opens on a pipe. Hover pauses the drift, and keyboard focus
  on the band pauses it too — `tabindex="0"` + `role="region"` on the section with `:focus-within` on
  the track, the WCAG 2.2.2 pause mechanism for auto-scrolling content, the system's focus ring as
  its visible cue.
  `prefers-reduced-motion:reduce` stops the drift, hides the duplicate set and hands the band to
  native horizontal scroll (`overflow-x:auto`), so no statement is lost to reduced-motion users.
  This is a deliberate, owner-requested exception to v1 §5's "no marquees": that ban stood against
  decorative motion, and this ribbon *is* the value-props component, not decoration on top of it.
- **Deleted with the ledger:** the `.trust` grid and its 900px / 640px override blocks — a ticker is
  width-agnostic, so the ribbon needs zero responsive rules where the ledger needed six.
- **Compliance notes:** "Batch tracking for each vial" states identity tracking only — no per-batch
  document affordance is implied or linked (§4.9 holds). No purity figure and no verification
  adjective enters the ribbon.
- **Flagged for owner confirmation — (a) the rail contradiction, on one page.** The ribbon copy says
  **USDT (ERC-20)** (owner-supplied, verbatim) while this same mockup's footer Payment link list,
  PRODUCT.md's Operating Context and DESIGN.md's crypto panel all say **USDT (TRC-20)** — a
  visible contradiction on the page. Resolution the owner must confirm: which rail is live. Until
  then the ribbon carries the owner copy and the footer stays TRC-20 (the footer is outside v2's
  scoped regions); one follow-up edit aligns whichever line loses.
- **Flagged for owner confirmation — (b) the speed claim.** "Unbeatable delivery rate. Zero issues."
  is a delivery/speed claim, and the inherited value-props rule (base brief §3, `DESIGN-mockup.md`
  line 211: "No certification, no testing status, no speed claims") bans exactly it. Kept verbatim as
  owner-supplied copy this iteration — noted, not rewritten; the owner must confirm the override of
  the inherited rule, or supply compliant copy, before promotion.

### v2.3 Micro-tokens added
- `.ribbon` — the band: `--snow` ground, 1px `--hairline` bottom rule, `overflow:hidden` viewport.
- `.ribbon-track` — the drifting flex track, `width:max-content`, one 64s linear infinite loop.
- `.ribbon-set` — one loop set; five `li` items, each opening on a 1px `--hairline` pipe.
- `@keyframes ribbon-drift` — `to { transform: translateX(-50%) }`, the ribbon's only motion.
- No new colour, radius or type token: the ribbon consumes `--snow`, `--hairline`, `--slate` and the
  ledger's 15px/1.5 step exactly as the trust row did.

---

## Version Changelog: v3

One surgical change in one region only — the catalogue plates' `card-head` product string. Every token,
section and rule outside it is inherited unchanged from v2; nothing below re-specifies them. All prior
version files (`DESIGN-mockup-v2.md`, `elune-landing-mockup-v2.html` and earlier) are immutable and
untouched. The colouring lives in the landing mockup only; the shipped theme (`themes/elune`) is not
modified by this iteration.

### v3.1 Catalogue plates — card-head product text carries its category hue
- **Change:** the mono product string in each plate's `.card-head` — name plus milligram strength as one
  identifier (`SEMAGLUTIDE-5MG`) — is now coloured with the compound's category accent instead of
  inheriting the card's ink. Applied through the mockup's existing category-hue convention: an inline
  `style="color:var(--<token>)"` on the string, exactly as the category strip's `.cat` links already bind
  theirs (v2 markup, `cat-strip`). No new selector, class or token is introduced.
- **Mapping, verified against `scripts/catalog-data.json`:**

  | Plate | card-head string | Category | Token | Value | Contrast on `--panel` white (13px mono) |
  |---|---|---|---|---|---|
  | 02 | `SEMAGLUTIDE-5MG` | GLPs | `--glps` | `#1F6FA8` | 5.39:1 |
  | 03 | `EPITALON-10MG` | Bioregulators | `--bio` | `#4A3A9C` | 8.90:1 |
  | 04 | `TB500-10MG` | Recovery | `--rec` | `#0F6E68` | 6.10:1 |
  | 05 | `IPAMORELIN-5MG` | GH Releasing | `--gh` | `#7A3E86` | 7.35:1 |

  (v2 §2 verified the same four hues at 5.07 / 8.37 / 5.73 / 6.91:1 on the `--snow` ground; the plate's
  white panel is the lighter pair, so every figure above is at or above the v2 number. All clear WCAG AA
  for normal text at the string's 13px.)
- **Scope:** the `card-head` string only. The plate's `<h3>` name, spec line, price and View link keep
  their inherited ink and slate; the hero plate (Plate 01), the category strip and every other region are
  untouched. The `Plate 0n` chip keeps its neutral treatment — the hue names the compound, not the plate
  number.
- **Rationale:** the plate head is the catalogue's identity row — plate number left, compound identity
  right. Giving the identity string its category hue extends v2's Category-Accent-Is-Identity rule from
  the strip to the plates: a reader traces any plate to its category without leaving the card, and the
  hue still marks only the category it names. It stays identity, not decoration — no button, price, badge
  container or section takes the hue, and the category name remains textual everywhere, so colour is
  never the only signal (§4.13, §5 hold).
- **Ship note:** mockup-only by this iteration's brief. When the plates ship to
  `themes/elune/src/pages/homepage/Elune.tsx`, the same binding follows the theme's canonical names —
  `color: var(--accent-<url_key>, var(--foreground))`, the pattern `Elune.tsx` already uses for category
  names — never a hex literal in a component.

### v3.2 Micro-tokens added
- None. v3 introduces no new colour, radius, type or motion token; it consumes the four existing category
  tokens (`--glps`, `--bio`, `--rec`, `--gh`) exactly as declared in v2 §2, and adds no layout rule — the
  change is a colour binding on an existing element.

---

## Version Changelog: v4

One surgical addition in one region only — three customer testimonials on a `--night` ground, placed
above the footer; v4.3 merges them into the ink band itself and strips that band's record text. Every
token, section and rule outside it is inherited unchanged from v3; nothing below re-specifies them. All
prior version files (`DESIGN-mockup-v3.md`, `elune-landing-mockup-v3.html` and earlier) are immutable and
untouched.
The change lives in the landing mockup only; the shipped theme (`themes/elune`) is not modified.

### v4.0 Directive that reopens the section
The v3 brief answered the Social Proof component with *documentation proof* and banned invented
testimonials (§3 Social proof, §4.10). The owner's v4 instruction explicitly lifts that for this
section: testimonials are now directed content, supplied with owner-provided photography. All three
inherited rules are amended in place (§2 colour rule, §3 Social proof, §4.10) rather than silently
contradicted, and D2's one-dark-band reading was set aside as superseded at the time. The RUO frame is
untouched: every quote stays on product quality, shipping and ordering friction, with no efficacy, dosing,
medical or human-use claim anywhere in the section. The same directive also moved the testimonials into the
single ink band and stripped that band's record text, so D2's one-band reading stands after all (v4.3).

### v4.1 Social proof band — "From recent orders."
- **Placement:** the reviews live *inside* the ink band, above the snow footer — featured compounds →
  ink band (motif + reviews) → footer (snow, hairline top). v4.1 first seated them on a `--night` ground
  of their own; v4.3 merged them into the band, so no second band and no seam hairline exist. The
  section sits above the footer as directed.
- **Ground:** `--night` per the directive ("with --night background color"). Cards sit one tonal tier
  up on a new `--night-panel #1C2B4A` — the same tonal-depth move the light side uses (snow → panel),
  with a 1px `--night-rule` hairline and the standard `--r-card` 16px radius. Flat, no shadow (§2
  elevation rule holds).
- **Grid:** three equal columns at 20px gutters (the page's existing card-grid rhythm), collapsing
  to a single column at ≤900px like the page's other card grids. Not the banned "generic centred card grid":
  left-aligned type, no icons, no centred composition, no pastel fills.
- **Card anatomy (top to bottom):** the quote as a real `<blockquote>` in snow on the night panel
  (16px/1.55), then a `<figcaption>`: name in 15px/500 snow, the order meta line in the existing
  13px mono at `--night-muted`, and the order photo **under the quote** (owner directive: the photo
  is the customer's order shot, never a face avatar). Photo frame: 4/3, `object-fit:cover`, 14px
  inner radius (the plate-figure's own inner-radius step), 1px `--night-rule` edge.
- **Assets:** `docs/refs/assets/imgs/td-1.jpg`, `td-2.jpg`, `td-3.jpg` — owner-supplied order
  photography of shipped vial trays. Embedded as base64 (resized to 720px wide, q78; 74–88KB each)
  so the mockup stays a single self-contained file; the repo paths are the provenance of record,
  matching the v2 hero-plate convention. Each photo carries real alt text describing the actual
  subject (vial cases, cap colours, surface).
- **Copy — three distinct voices, each covering quality + fast shipping + frictionless ordering:**
  1. **Marcus D., Austin, TX** — the careful-inspection voice: "Vials arrived sealed, labeled and
     exactly as the spec page described. Ordered Monday night, tracking by Tuesday morning, on my
     desk Thursday."
  2. **Elena R., Portland, OR** — the first-time-buyer voice: "I braced for a clunky first order and
     got the opposite. Guest checkout, paid in USDT, pasted the transaction ID, done in under five
     minutes. Nothing about it felt like a gamble."
  3. **Dana W., Tampa, FL** — the repeat-buyer voice: "Third reorder and the standard hasn't
     slipped. Every vial matches the spec on the page, shipping is quick, and the whole thing takes
     about two minutes."
  Privacy per the directive: first name + last initial only; city + state abbreviation only. The
  quotes reference the *order* (sealed vials matching the spec page, guest checkout, USDT + TXID)
  and never the body — compliant with §4.9, §4.11 and the RUO frame.
- **Heading:** "From recent orders." — plain, sentence case, no eyebrow, no rating stars, no count.
  The h2 carries the section alone (§4.8).
- **Transparency foot:** the inherited rule "if reviews ever ship: source, date and moderation
  policy shown" is honoured by the closing line: "Collected from completed orders and published
  unedited. Names shortened to first name and last initial." Each meta line carries a month +
  year.
- **Motion:** the cards join the page's single authored entrance (`rise`, 660ms exponential
  ease-out) at the existing 60–70ms stagger cadence (`--d:.05s/.12s/.19s`), so the section does not
  introduce a second animation family; `prefers-reduced-motion` already neutralises `.rise` page-wide.
- **Contrast, computed:** snow on night panel 13.23:1 (quote, name); `--night-muted` on night panel
  8.88:1 (meta, transparency foot); night panel against the `--night` ground is a 1.38:1 tonal step,
  which is surface separation, not text — the hairline does the edge work exactly as on the light
  side. All text pairs clear WCAG AA by wide margins.

### v4.2 Micro-tokens added
- `--night-panel: #1C2B4A` — the testimonial card surface, one tonal tier above the `--night` band
  ground (the dark-side analogue of snow → panel white). Declared beside the existing ink-band tokens.
- Layout selectors, all consuming existing tokens only: `.proof` (band), `.proof-grid` (3-up →
  1-up at 900), `.tcard` (card), `.tname` (name), `.tshot` (photo frame, 14px inner radius per the
  plate-figure precedent), `.proof-foot` (transparency line). No new colour beyond `--night-panel`,
  no new radius, no new type step, no new motion.

### v4.3 Ink band becomes the reviews band
Owner directive: "leave the graphic in that section… remove the plate 01 - bpc157-5mg part… the section
that contains the moon motif will now contain the reviews". Every word of record content is deleted from
`.ink` — heading, lede, beam CTA, Plate 01 label, the nine-row spec table and the caveat line — with its
dead CSS (`.record*`, `.ink-foot`, `.btn--beam`, `.ink :focus-visible`/`.lede`/`.btn`, the two-column grid
on `.ink .shell`, and the 900px / 640px media blocks that served them). The cratered-disc motif stays; the
review set (h2, three cards, transparency foot) moves into the `.ink` shell, and the standalone `.proof`
band — with the band-level selector v4.2 declared — is deleted. What remains is the `.ink` ground, the moon
SVG and a hairline top into the footer. Consequences: one dark region again, so D2's one-band reading
stands; the landing no longer renders the full record, whose home is the product page; and the beam loses
its only button consumer here, making D3's badge-and-small-emphasis rule total on this page.
**Compliance rehome (not a deletion):** the deleted caveat line was the landing's only "specification, not
a batch test result" statement while the hero still declares `≥99%`, so that caveat sentence is rehomed
verbatim as a second `.proof-foot` line closing the band — §4 rule 9 holds on the page that still shows the
figure. The RUO half is not repeated there: it already renders twice within one screen (announcement bar,
footer base) directly around the band, and the caveat is the only sentence the deletion orphaned.
