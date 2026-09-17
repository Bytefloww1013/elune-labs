---
name: "Elune Labs Design System (Lunar Plates)"
description: "Light-only storefront design system — cool lunar neutrals, midnight ink, one lime accent, five category accents, one bounded night region. Approved target system; migration in progress."
colors:
  snow: "#F7F8FA"
  panel: "#FFFFFF"
  mist: "#ECEFF3"
  hairline: "#DBDFE6"
  ash: "#B7BDC9"
  night: "#16233C"
  slate: "#5A6479"
  beam: "#CFF26F"
  night-muted: "#C3CEE4"
  night-rule: "#33415F"
  night-surface: "#394459"
  destructive: "#A32A1F"
  destructive-foreground: "#F7F8FA"
  accent-glps: "#1F6FA8"
  accent-bioregulators: "#4A3A9C"
  accent-recovery: "#0F6E68"
  accent-gh-releasing: "#7A3E86"
  accent-other: "#4E5870"
  background: "#F7F8FA"
  foreground: "#16233C"
  card: "#FFFFFF"
  card-foreground: "#16233C"
  popover: "#FFFFFF"
  popover-foreground: "#16233C"
  primary: "#16233C"
  primary-foreground: "#F7F8FA"
  accent: "#ECEFF3"
  accent-foreground: "#16233C"
  secondary: "#ECEFF3"
  secondary-foreground: "#16233C"
  muted: "#ECEFF3"
  muted-foreground: "#5A6479"
  border: "#DBDFE6"
  divider: "#DBDFE6"
  input: "#DBDFE6"
  ring: "#16233C"
typography:
  display:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4rem)"
    fontWeight: 250
    lineHeight: 1.06
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "clamp(1.75rem, 2.9vw, 2.5rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0"
  body:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  label-sm:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  name:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  micro:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  caption:
    fontFamily: "Manrope, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.03em"
  caption-mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.03em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.015em"
  price:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.01em"
  quote:
    fontFamily: "Georgia, \"Times New Roman\", serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
rounded:
  pill: "999px"
  ctrl: "8px"
  card: "16px"
  sheet: "32px"
  inner: "14px"
  focus: "2px"
spacing:
  element: "8px"
  card: "16px"
  gutter: "20px"
  shell: "1200px"
  page-gutter: "48px"
  page-gutter-sm: "32px"
  nav: "74px"
  announce: "38px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
    typography: "{typography.label}"
  card-hero-sheet:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.sheet}"
    padding: "1rem"
    typography: "{typography.body}"
  link-text:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.ctrl}"
    padding: "0.625rem 0.75rem"
    typography: "{typography.body}"
  card-product:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.card}"
    padding: "1rem"
    typography: "{typography.body}"
  card-category:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.card}"
    padding: "1.5rem 1.375rem 1.375rem"
    typography: "{typography.title}"
  chip-beam:
    backgroundColor: "{colors.beam}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "0.3125rem 0.75rem"
    typography: "{typography.caption-mono}"
  nav-link:
    textColor: "{colors.foreground}"
    typography: "{typography.label-sm}"
  notice-ruo:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.ctrl}"
    padding: "1rem"
    typography: "{typography.micro}"
  review-card:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.night-muted}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
    typography: "{typography.body}"
---

# Design System: Elune Labs (Lunar Plates)

**Document status:** Migration in progress. The owner selected the exact v5 landing prototype as the winning
direction on 2026-09-17 (see *The v5 Landing Exception* below), the specification here is settled, and the
migration into `themes/elune` is underway. No part of this document is a claim that the theme already renders
this world, and nothing is verified until the implemented pages have been reviewed. Every visual value below
is derived from the approved v5 landing prototype (`docs/design/mockups/elune-landing-mockup-v5.html`) and its
normative prose (`docs/design/mockups/DESIGN-mockup-v5.md`), extended to project-wide surfaces that the
prototype does not
render. Where this file describes how a surface behaves, that is a specification of what the surface must
do, not a report of what the theme already does. Nothing here is a statement that the theme in
`themes/elune` already renders this world.

- **Token home:** `themes/elune/src/pages/all/shadcn.css` (`:root` raw values). Tailwind v4 bindings in
  `themes/elune/src/pages/all/tailwind.css` (`@theme inline`). Browser-surface rules in
  `themes/elune/src/pages/all/global.scss`. No component introduces its own colour or radius.
**Provenance:** this document supersedes the specification it replaces. The superseded document described a
  cream-and-tan world; this one describes the cool lunar world approved at v5.
  The promotion chain is v1 → v5 of the landing brief, with the owner-locked section canon unchanged
  (`docs/design/mockups/DESIGN-mockup-v5.md` §1) and the visual world replaced. Source mockups are
  immutable and remain the provenance of record.
- **Scope:** the whole storefront theme — landing, category and product routes, cart, checkout, payment,
  confirmation, account and guest surfaces, CMS content pages, notices, forms, browser surfaces.
  The admin console is core-rendered and outside this theme; the age gate never blocks it or any API route.
- **Decisions closed in this document:** the display face (Manrope), the single bounded `--night` region,
  the beam accent's scope, the value ribbon as the value-props component, the night-cap hero photograph,
  differentiated radii, the dark-band review-card shadow, the directed review set, and the payment rails —
  Bitcoin, **USDT on Ethereum (ERC-20)** and Ethereum. An earlier draft carried these as owner-confirmable
  decisions; they are resolved here and are not open. **The v5 landing's own layout, type, footer, mono usage,
  claims and caveat placement are settled too**, by the owner's 2026-09-17 instruction; they are recorded as a
  scoped exception in the next section and are not open to redesign.

## Overview

**Creative North Star: "Lunar Plates."** A storefront that behaves like a catalogue of plates: the object
and its record share the first viewport at the same scale, so trust is earned by what is written down and by
atmosphere — a specimen plate on a pale table under a clear night sky. The surface is light because the
scene is light. The night sky appears once, as a single region, and never becomes the theme.

The record is the interface. A compound's name, form, size, price and purity declaration are the content;
the page's job is to set them in a readable order and then get out of the way. One accent colour is spent on
badges, the document selection and small emphasis. Everything else separates by tone and by a 1px hairline.

The audience buys on two things — where a compound came from and what its declared purity is — and is
otherwise repelled by hype. The world is therefore confident, quiet and specific: no countdown, no
badge-stack, no testimonials with faces, no certificate theatre.

**Explicit rejections, on record.** These were considered and refused, and no surface may drift back toward
them:

- The neon biohacker terminal — phosphor-on-black, glow, gradient atmosphere, mono as costume.
- The lab-cold institutional register — clinical blue-grey impersonality, stock laboratory photography.
- The hype storefront — countdowns, discount banners, urgency badges, invented metrics.
- The retired cream-and-tan counter (the superseded world) — cream grounds, tan borders, ochre accents.

**Key Characteristics**

- **Light only.** One deep region is permitted per page: the `--night` feature/proof band. There is no dark
  theme, no `.dark` class, and no dark-mode token set, on any surface, now or later.
- **One chromatic authority.** `--night` is the ink, the button fill, the focus ring, the caret and the band
  ground. It is not a decorative colour.
- **One vivid accent.** `--beam` marks the document selection background, a badge fill and the 3px
  quote bar. It is never a region background, never body text, never a button fill.
- **Five identity hues.** Category accents colour category names, arrows and the catalogue plate's identity
  string. No button, price, badge container or section header takes a hue.
- **Differentiated radii.** Pill controls, 8px fields, 16px cards and menus, 32px hero sheet, 14px figure.
  Uniform radius is banned; so is a radius above 32px.
- **Flat on the light side.** No shadows, no gradients, no blur. Depth on the light side is tonal
  (snow → mist) plus hairlines. The dark band carries one card shadow, by decision.
- **Mono is data.** JetBrains Mono carries codes, chemical values, prices, counts and measures — never prose.
- **The record omits what it cannot source.** `themes/elune/src/data/productSpecs.ts` is the only record source, and a
  field that is not sourced renders no row at all.
- **Claims are operational.** Every statement the storefront makes about itself must be true today and
  supportable on request — except where the owner has directed otherwise on the landing route, which is
  recorded as a scoped exception below and nowhere else.

## The v5 Landing Exception

**Recorded from the owner's instruction, 2026-09-17: the exact v5 landing wins.** The owner selected
`docs/design/mockups/elune-landing-mockup-v5.html` as the reference the landing route reproduces, and directed
that this document stop ruling against it. Where this document and that prototype disagree **on the landing
route**, the prototype governs. The exception is scoped to the landing route and to the seven items below, and
to nothing else.

| # | v5 governs on the landing | The rule it supersedes there |
|---|---|---|
| 1 | **Layout.** The band order and count, the grids, the gutters and the paddings as the prototype renders them. | The 8px unit is a rhythm for the other routes; the landing's own spacing is the prototype's. |
| 2 | **Type.** The literal sizes and weights as rendered — nav 15.5px, small print 13.5px, spec labels 14.5px, cart count 11px, review meta 13.6px, sheet foot link 14px. | "No surface may declare a size that is not a step" resolves off-step literals onto steps; the step table governs every route except the landing. |
| 3 | **Footer.** The four-column grid (`1.4fr 1fr 1fr 1fr`), its three link lists, and the **Payment** column listing Bitcoin, **USDT (ERC-20)** and Ethereum. | The superseded centred page-link row and the superseded rail label. |
| 4 | **Mono.** The prototype's mono usage as rendered, including the inline `.mono` span around the prose word "everyone" in the hero lede. | The Mono-Is-Data Rule's "no mono span around a word that is not a value" — which still binds every other route. |
| 5 | **Claims.** The hero lede and the ribbon's five statements, verbatim as the prototype renders them: "Tracked & discreet, flat rate shipping" · "Bitcoin, USDT (ERC-20), and Ethereum Accepted" · "Batch tracking for each vial" · "Best in class factory direct pricing" · "Unbeatable delivery rate. Zero issues." | "Unsupportable claims are not normalised into the system" and the claim rules' veto over superlatives — on the landing route only. |
| 6 | **Reviews.** The three directed review cards in the night band, their heading, their quotes, their name/city/date meta and their order photographs, as rendered — plus the transparency foot **verbatim**, including "Collected from completed orders and published unedited." | The publication gate ("no review card renders until …"), the "no-purity-caveat-here" ruling, and any correction of the transparency foot's collection-method claim. |
| 7 | **Caveat placement.** The purity caveat sentence renders as the band's closing foot line, directly under the transparency foot. | "renders directly below the plate sheet" — the landing's own position is the approved one. |

**What the exception does not do.**

- **It does not touch accessibility.** `<main>`, one `<h1>` per page, heading order without level skips, real
  alt text, the 44px target floor, the focus ring, and the AA contrast floor hold on the landing exactly as
  they hold everywhere else. The prototype's own structural defects — sections as direct body children with no
  `<main>`, card titles and footer column labels as `<h3>` with no `<h2>` above them — are corrected in the
  build, and correcting them changes no visual value in the table above.
- **It does not carry into the global system.** A ribbon statement, a superlative or an inline mono prose span
  is approved *on the landing route*; none of it becomes a token, a component default or a pattern another
  route may copy. The next route that wants one needs its own owner instruction.
- **It does not extend to the product, category, cart, checkout, confirmation or account routes**, which take
  the token layer, the step table, the card anatomies and the claim rules unchanged.
- **It does not make any of the supplied copy evidence.** See the next subsection.

### Owner-selected copy is not evidence

The landing's hero lede, its five ribbon statements, the three review quotes with their names, cities, dates
and order photographs, and the transparency foot were **supplied and selected by the owner**. They render
because the owner directed that they render. That direction is a decision about *what the page shows*; it is
not, and must not be read as, any of the following:

- **Not consent evidence.** Nothing here records that the three reviewers consented to publication. No consent
  record exists in this repository, and none may be inferred from the fact that the cards ship.
- **Not order evidence.** Nothing here links any quote to a real order, a real payment or a real shipment. It
  is not a record that any of those three orders happened.
- **Not quality evidence.** Nothing here records that any claim was tested, measured or checked. "Unbeatable
  delivery rate. Zero issues.", "Best in class factory direct pricing", "affordable bulk pricing for everyone"
  and "Batch tracking for each vial" are **copy the owner chose to run**, and the storefront now makes them.
  No source, measurement or audit for any of them exists in this repository, and this document does not supply
  one, soften them, or claim they are substantiated.
- **Not a review process.** No editorial, legal or compliance review of this copy is recorded here, and none
  is implied. Only the owner's instruction to render it is on record. Any future claim that this copy was
  reviewed, consented, verified or tested is unsupported until an actual artifact says so.

**Factual substantiation risk, listed explicitly.** These strings are statements of fact made to customers,
and each carries a risk that should be visible to whoever maintains them rather than buried in a caveat.
Being owner-selected, fixed, or merely present in a prototype does not make any of them non-claims, and a code
comment that hedges one does not neutralize what the page tells a visitor.

| String (landing, owner-selected) | What it asserts | Evidence in this repository |
|---|---|---|
| "Collected from completed orders and published unedited." (transparency foot) | That a collection method exists and that reviews came from completed orders — i.e. real, completed transactions | **None.** No collection record, order link or consent record exists. |
| "Batch tracking for each vial" (ribbon) | That every vial is tracked by batch | **None.** Neither `catalog-data.json` nor `productSpecs.ts` carries a batch or lot field. |
| "Unbeatable delivery rate. Zero issues." (ribbon) | A superlative comparative delivery claim | **None.** No delivery data, and the claim is a comparison against unnamed competitors. |
| "Best in class factory direct pricing" (ribbon) | A comparative pricing ranking | **None.** No comparable pricing data; "best in class" is a ranking nobody here established. |
| "affordable bulk pricing for everyone" (hero lede) | Unbounded affordability and volume terms | **None.** The catalogue has no bulk tier and no price-tier data. |
| "Vials arrived sealed, labeled…", "shipping is quick" and the like (quotes) | Specific product, packing and delivery-speed outcomes per order | **None.** No order linkage, no substantiation per order. |

**The consequence is a live, accepted risk, recorded here rather than resolved.** The owner directed these
strings onto the page knowing they describe an operation the repository cannot evidence, and that decision is
theirs to make. What this document adds is that the risk is *named*: none of these statements is independently
verified, none may be described as substantiated or reviewed, and each is something a customer could
reasonably rely on. If any of them is ever challenged, the honest answer starts from this table.

This is the honest reading of the exception and it is binding: the exception changes what the landing renders,
never what this repository can prove about it. Where a document, a comment or a commit message could be read
as asserting consent, order linkage, measurement or review for this material, it is wrong and must be
corrected rather than relied on.

## Colors

A cool near-monochrome field with one vivid accent and five identity hues. Every value is declared in
`shadcn.css` `:root` and exposed to Tailwind through `@theme inline` in `tailwind.css`; a component that
needs a value adds a token there. **No hex literal appears in any component.**

The table below is the normative palette. Contrast is the WCAG 2 relative-luminance ratio, recomputed from
these exact values for the pairs the system actually renders (an earlier draft carried figures computed
against intermediate surfaces; the numbers here are the ones to hold a build to).

| Token | Value | Role | Verified pairs |
|---|---|---|---|
| `--snow` | `#F7F8FA` | Page canvas. Cool near-white; never cream, never pure white. | night on it **14.75:1** |
| `--panel` | `#FFFFFF` | Card, menu, sheet and strip surface; one tier above the canvas. | night **15.67:1**, slate **5.94:1** |
| `--mist` | `#ECEFF3` | Alternating band, hover/selected fill, muted panel. | night **13.59:1**, slate **5.15:1** |
| `--hairline` | `#DBDFE6` | Every 1px border and divider on the light side. | decorative only — see Named Rules |
| `--ash` | `#B7BDC9` | Disabled chrome, the plate sheet's edge and the arrow's rest state. | night on it **8.31:1**; 1.77:1 against snow |
| `--night` | `#16233C` | The only chromatic authority: text, fills, band ground, caret, ring. | on snow **14.75:1**, on mist **13.59:1**, on panel **15.67:1** |
| `--slate` | `#5A6479` | Secondary text: nav, ledes, spec labels, footer headings, meta, scrollbar thumb. | on snow **5.59:1**, on mist **5.15:1**, on panel **5.94:1** |
| `--beam` | `#CFF26F` | The one vivid accent: document selection, badge fill and the 3px quote bar. | night on beam **12.38:1** |
| `--accent-glps` | `#1F6FA8` | GLPs identity. | snow **5.07:1**, panel **5.39:1** |
| `--accent-bioregulators` | `#4A3A9C` | Bioregulators identity. | snow **8.32:1**, panel **8.84:1** |
| `--accent-recovery` | `#0F6E68` | Recovery identity. | snow **5.73:1**, panel **6.09:1** |
| `--accent-gh-releasing` | `#7A3E86` | GH Releasing identity. | snow **6.91:1**, panel **7.34:1** |
| `--accent-other` | `#4E5870` | Other identity. | snow **6.69:1**, panel **7.11:1** |
| `--night-muted` | `#C3CEE4` | Secondary text on the night band, tinted from the hue, never grey. | on night **9.90:1**, on `--night-surface` **6.19:1** |
| `--night-rule` | `#33415F` | Rules and edges on the night band. | decorative only (1.54:1 on night) |
| `--night-surface` | `#394459` | The review card's surface; a one-step tonal lift from the band. | snow **9.21:1**, beam bar **7.73:1** |
| `--destructive` | `#A32A1F` | Errors and cancellation only. Never decoration. | on snow **6.80:1**, on panel **7.22:1** |

`--night-surface` is declared with a resolved literal first and the derived value second, so the card still
paints in an engine without `color-mix()` support:

```css
--night-surface: #394459;                                        /* resolved fallback */
--night-surface: color-mix(in srgb, var(--night) 85%, #fff 15%); /* authored this round: 0.85 ink + 0.15 white */
```

The band's own surface ladder is deliberately shallow: `--night-surface` against `--night` is a **1.6:1**
tonal step. That is surface separation, not text, and the review card adds the one permitted dark-side
shadow to carry it. `--night-rule` against the card it edges is 1.04:1 — the hairline there is decoration,
never a control boundary.

**Role aliases (kept, repointed).** The theme's semantic slots are preserved so core surfaces — cart,
checkout, account, popovers, menus — inherit the new world without bespoke work. The superseded values are
retired with the warm world; each alias now points at a Lunar Plates primitive:

| Alias | Now resolves to |
|---|---|
| `--background` | `--snow` |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--accent-foreground`, `--secondary-foreground` | `--night` (all five; a single missed slot leaves old ink live on cards and popovers) |
| `--card`, `--popover` | `--panel` |
| `--primary` | `--night` |
| `--primary-foreground` | `--snow` |
| `--accent`, `--secondary`, `--muted` | `--mist` |
| `--muted-foreground` | `--slate` |
| `--border`, `--divider`, `--input` | `--hairline` |
| `--ring` | `--night` |
| `--destructive` | `#A32A1F`, `--destructive-foreground` = `--snow` |

`--accent` matters more than it looks: it is the hover/selected **surface** for core menus, selects and rows,
so repointing it at `--mist` is what keeps a hovered core row in this world rather than in the old one.

### Primary

- **Midnight Ink** (`--night` `#16233C`): the only chromatic authority. It is the body text, the button fill,
  the focus ring, the text caret, the cart badge, the night band's ground, and the source of the band's
  derived surface. It carries 14.75:1 on the canvas, 13.59:1 on the mist band and 15.67:1 on white panels.
- Its role split with `--beam`: ink is *authority* (text, fills, edges, state), beam is *accent* (a badge and
  a 3px bar). The accent never carries a control.

### Secondary

- **Slate** (`--slate` `#5A6479`): secondary text only — nav links at rest, ledes, spec labels, footer column
  headings, specs and meta lines. It holds 5.59:1 on the canvas and 5.15:1 on the mist band, so it is legible
  at micro sizes. It is never used for a heading that must lead, and never on `--ash`. *Secondary* here names
  this palette role — the second tier of text — and is not the button variant of the same name: a secondary
  action in this system is a text link, never a slate-filled control.
- There is **no second brand colour.** The identity mark is a monochrome raster (see Assets & Identity), so
  the palette needs no hue to host it; the retired ochre brand colour is gone and may not return.

### Tertiary

Five deep, cool accents mark the five categories, keyed to the catalog's `url_key`. Canonical token names
are `--accent-<url_key>`; the prototype's `--glps / --bio / --rec / --gh / --other` are shorthand for the
same values and are not the shipping names.

- **GLPs — Plate Blue** (`--accent-glps` `#1F6FA8`): 5.07:1 on snow, 5.39:1 on panel.
- **Bioregulators — Enamel Violet** (`--accent-bioregulators` `#4A3A9C`): 8.32:1 / 8.84:1.
- **Recovery — Deep Teal** (`--accent-recovery` `#0F6E68`): 5.73:1 / 6.09:1.
- **GH Releasing — Damson** (`--accent-gh-releasing` `#7A3E86`): 6.91:1 / 7.34:1.
- **Other — Slate Indigo** (`--accent-other` `#4E5870`): 6.69:1 / 7.11:1.

All five clear AA for normal text on both the canvas and the white panel, at the micro and mono sizes where
they are actually rendered. The GH Releasing slot took the violet left free when the ochre accent was
retired for being tan.

### Neutral

- **Snow** (`#F7F8FA`): the page ground. Never replaced by pure white, never warmed toward cream.
- **Panel White** (`#FFFFFF`): cards, menus, the category strip, the hero sheet, form fields, popovers.
- **Mist** (`#ECEFF3`): the announcement bar, the hero band, the categories band, the hover and selected fill
  for rows, cells and menu rows, and the chip's rest fill.
- **Hairline** (`#DBDFE6`): every 1px edge on the light side.
- **Ash** (`#B7BDC9`): disabled chrome, the hero sheet's edge, the arrow's rest state and the text link's
  rest underline. It is never the scrollbar thumb: that affordance is `--slate` (5.59:1 on snow, 5.15:1 on
  mist), so it clears the 3:1 non-text floor where `--ash` would sit at 1.77:1.
- **Night band set:** `--night` (ground), `--night-surface` (the review card, `#394459`), `--night-rule`
  (rules and card edges), `--night-muted` (secondary text on the band).
- **Destructive** (`#A32A1F`): semantic error and cancellation only. It survives the warm-colour purge
  because it is a state, not decoration; folding it into that purge would leave error UI colourless.

The retired chart tokens are **deleted, not re-derived**: four of them were exact duplicates of the ring and
three category accents (one of them the banned ochre), and nothing in the theme consumed them. Error UI reads
`--destructive` directly.

### Named Rules

**The One-Chromatic-Authority Rule.** `--night` is the ink, the fill, the ring, the caret and the band
ground, and nothing else is allowed to compete for that role. A new saturated colour added to the palette for
chrome is a change to the world, not an addition to it. Brand hue never paints a hover or selected surface:
`--accent` is a *surface* slot (`--mist`) and must stay one.

**The Beam-Is-Spent-Three-Times Rule.** `--beam` appears on the document selection background, on a badge
fill (`chip-beam`), and as the 3px left bar on a review quote. That is the whole budget. It is never a
button fill, never a background for a region, never body text, and never a hover state. If beam is dropped,
the page becomes fully achromatic — which is a coherent fallback, not a broken one.

**The No-Warmth Rule.** The superseded world's paper ground, sandy hover surface, warm hairline, ochre
brand colour and ochre category accent may not reappear in any form — not in a component, not in an
illustration, not in an empty-state drawing. Every neutral here is cool. Warmth in this world is a bug.

**The Category-Accent-Is-Identity Rule.** A category accent may colour a category's name, its arrow, a 1px
identity mark, and the catalogue plate's identity string (the mono compound identifier). It may not colour a
button, a price, a badge container, a section header, a border that carries state, or a whole card. The
category name stays textual everywhere, so colour is never the only signal.

**The Decorative-Only Rule for hairlines.** `--hairline` (1.26:1 on snow, 1.16:1 on mist), `--ash` as an edge
(1.77:1), and `--night-rule` on the band (1.54:1, and 1.04:1 against the review card) are tonal separators,
not affordances. A control whose *only* visible affordance is its boundary — a bare border with no icon,
label or fill — must use `--night` for that boundary instead. Where an icon, label or fill already
identifies the control, the hairline boundary is decoration and may stay.

## Typography

**Display Font:** Manrope, variable 200–800 (with `system-ui`, `-apple-system`, `"Segoe UI"`, `sans-serif`).

**Body Font:** Manrope, variable, weights 400/500 — the default reading face for body, lede, notices and
record values. Same family as display; no second sans is loaded.

**Label Font:** Manrope, variable, weight 500 — pill labels, nav and footer links, menu rows, ribbon items
and spec labels.

**Mono Font:** JetBrains Mono, variable, existing subset reused (with `ui-monospace`, `SFMono-Regular`,
`Menlo`, `monospace`) — codes, chemical values, prices, counts, measures, identifiers and meta.

**Quote Font:** the system serif stack (`Georgia`, `"Times New Roman"`, `serif`), italic, for review quotes
only.

Manrope replaces the previous four-weight static sans, which had no light face: at display size the whisper
register is the point, and a face without a Light weight cannot render it. Manrope is semi-geometric with
rounded terminals, so the whisper register keeps a point of view instead of collapsing into a neutral
default. Inter is deliberately not used.

Both faces are self-hosted woff2 with no third-party request and no CDN. **Two things are load-bearing and
must land with the token migration, not after it:**

1. **The variable file's weight axis defaults to `200`.** Any element that inherits without an explicit
   `font-weight` renders hairline. Declare `font-weight: 400` on the body step and on every surface that
   inherits a size without a weight.
2. **The latin subset carries neither `≥` (U+2265) nor `→` (U+2192).** The purity declaration therefore
   always renders in JetBrains Mono, where both glyphs are present, and **every arrow in the system is a
   drawn SVG path, never a glyph** — four authored paths (chevron, cart, burger, long arrow) are recycled
   everywhere an arrow appears.

No italics are loaded for the sans; the only italic in the system is the serif quote. There are no
letterspaced uppercase kickers anywhere except a notice's inside caption.

**Type is a token, weight is a choice.** Sizes come from the step table and nothing else; the weight is
picked per surface from Manrope's variable range. Off-step literal sizes left in the landing prototype
(nav 15.5px, small print 13.5px, spec labels 14.5px, cart count 11px, button 16px, review meta 13.6px,
sheet foot link 14px) are **kept on the landing route**, which the owner approved as rendered (see The v5
Landing Exception, item 2). On every **other** route those literals resolve onto the nearest step when the
component is rebuilt — `label-sm`, `micro`, `micro`, `caption`, `label`, `mono`, `label-sm` respectively. No
other surface may declare a size that is not a step.

### Hierarchy

| Step | Size / line-height | Weight | Tracking | Where it is used |
|---|---|---|---|---|
| **Display** | `clamp(2.5rem, 4.6vw, 4rem)` / 1.06 | 250 | −0.022em | The homepage offer line only. One per page. Balanced (`text-wrap: balance`), no kicker above it. |
| **Headline** | `clamp(1.75rem, 2.9vw, 2.5rem)` / 1.12 | 300 | −0.018em | Page and section titles: the categories heading, the catalogue heading, "From recent orders.", every route's h2. |
| **Title** | 1.25rem / 1.3 | 400 | −0.01em | Card and product names, the category cell's name, the specification section's heading. |
| **Lede** | 1.125rem / 1.62 | 400 | 0 | The hero lede and section intros. Slate, measure 56ch, hero measure 48ch. |
| **Body** | 1.0625rem / 1.6 | 400 | 0 | Default text: descriptions, notices, checkout copy, record values, page prose. |
| **Label** | 1rem / 1.4 | 500 | 0 | Filled pill labels and text links. |
| **Label Small** | 0.9375rem / 1.4 | 500 | 0 | Nav links, footer links, menu rows, ribbon items, compact links, spec labels. |
| **Name** | 0.9375rem / 1.35 | 600 | 0 | A review's author name. The upper bound of interface emphasis. |
| **Micro** | 0.8125rem / 1.4 | 500 | 0 | The proof line under the hero CTA; small print in the announcement and footer base rows (weight 400 there). |
| **Caption** | 0.75rem / 1.3 | 500 | +0.03em | Pill and chip labels, the cart count. A caption inside a notice block, never a standalone eyebrow. |
| **Mono** | 0.8125rem / 1.5 | 400 | +0.015em | Codes, SKUs, spec values, counts, wallet addresses, meta lines, review dates. Tabular numerals. |
| **Price** | 1.0625rem / 1.2 | 400 | +0.01em | Prices, in mono with tabular numerals. |
| **Quote** | 1.05rem / 1.55 | 400 italic | 0 | Review quotes, in the serif stack. |

An inline figure inside prose that must render in mono — the `≥99%` declaration — keeps the prose step's
size (an explicit `.lede .mono { font-size: 1em }` scoped rule), so the glyph matches its sentence instead of
dropping to the mono step's 13px.

At ≤640px the body step steps down to 1rem. Every measure stays fixed: 72ch maximum anywhere, 56ch for a
lede, 48ch for the hero lede, 64ch for the band's transparency foot, 24ch for the band heading.

### Named Rules

**The Mono-Is-Data Rule.** JetBrains Mono appears only on chemical data (CAS number, molecular formula,
molecular weight, sequence), prices, counts, measures, and identifiers (SKU, lot, wallet address, TXID,
review date). It never carries a label, a heading, a button, a link's prose, or body text. If a string is a
word rather than a value, it is not mono. **This binds every route except the landing**, where the owner
approved the prototype's own mono usage — including the inline `.mono` span around the prose word "everyone"
in the hero lede — as rendered (see The v5 Landing Exception, item 4). That span is landing copy, not a
pattern: no other route may wrap a prose word in mono, and outside the landing the only `.mono` spans
permitted inside prose are figures and identifiers.

**The Steps-Are-The-Scale Rule.** Sizes come from the step table above; the weight is chosen per surface from
Manrope's variable range. Display sits at 250 and headline at 300 — the whisper register is the signature of
this world, and a heading that asks for 600 or more is a different design. Interface emphasis tops out at
600, used only for a review author's name.

**The Declaration-Not-Measurement Rule.** The purity value is the literal string `≥99%` on every product. It
is a placeholder declaration, never a measured figure, never a per-product number, never a per-batch result,
and never styled as a result. It is labelled a specification wherever it appears outside the record, and the
caveat sentence is carried on any surface that shows the figure. A specification value that is not sourced is
omitted from the record entirely — no dash, no empty cell, no "pending".

**The Arrows-Are-Drawn Rule.** Every arrow is an SVG path with `currentColor`, `aria-hidden`, and a 3px
translate on hover over 220ms. No glyph arrows (`→`, `»`, `›`) appear in any surface, at any size.

## Layout

The layout rhythm runs on an 8px unit, applied as: 16px card padding, 8px element gap, 20px grid gutter,
and a section rhythm of `clamp(56px, 7vw, 96px)`. The unit governs layout, not component interiors —
control padding, chip padding and cell padding sit off-grid deliberately (a pill is `14px 24px`, a chip is
`5px 12px`, a category cell is `24px 22px 22px`), and that is the rule: rhythm on the unit, interiors by
optical fit. A new surface does not invent a rhythm value.

**Shell.** One container: `width: min(1200px, 100% - 48px)`, centred; the gutter narrows to 32px at ≤900px.
Content never bleeds outside the shell except the night band's moon motif, which is clipped by the band.

**Section rhythm.** `padding-block: clamp(56px, 7vw, 96px)` for every band, with one override: the night band
tightens to `clamp(36px, 4.5vw, 56px)` top and `clamp(32px, 4vw, 48px)` bottom so it hugs its content
instead of carrying the standard rhythm into the footer. The catalogue plate grid sits at `padding-top: 0`
under the categories band, because the two bands share one visual block.

**Grids.** All of them, with their gaps:

| Region | Columns | Gap |
|---|---|---|
| Header nav | `1fr auto 1fr`, `min-height: 74px` | 24px |
| Hero | `1.04fr .96fr` | `clamp(32px, 4vw, 64px)`, with `padding-block: clamp(48px, 6vw, 84px)` |
| Hero sheet body | `.78fr 1.22fr` | 18px |
| Category strip | `repeat(5, 1fr)` inside one 16px-radius container | 1px rules between cells |
| Catalogue plates | `repeat(4, 1fr)` | 20px |
| Review set | `repeat(3, 1fr)` | 20px, `margin-top: 36px` |
| Footer | `1.4fr 1fr 1fr 1fr` | 32px |
| Section head | flex, `align-items: flex-end`, `margin-bottom: 36px` | 24px, wraps |

**Measures and ratios.** The hero sheet's photograph is framed **3:4**; an order photograph in a review is
framed **4:3**; the review photo's inner radius is 14px, as is the hero figure's. The nav's three-zone grid
is what makes the links optically centred rather than centred in the leftover space. The desktop thinking is
12 columns, tablet 8, mobile 4 — collapsing to one column at 900px (hero, review set) and 640px (plates,
category cells, hero sheet body, footer).

**Overflow.** Zero horizontal overflow at 390px is a requirement, not a nicety: the ribbon is the only band
whose content is wider than the viewport, and it is clipped by design.

### Responsive

Four breakpoints, in this order, each with a single purpose:

| Query | What changes |
|---|---|
| **≤1080px** | Nav link gap 18px and size to 15px; catalogue plates 2-up; category strip 2-up with the left rules reset on odd cells and a top rule from the third cell. |
| **≤900px** | Shell gutter 48px → 32px; hero stacks to one column at a 36px gap; the nav link row is hidden and the pill disclosure takes over; the footer grid becomes 2-up; the review set becomes 1-up. |
| **≤640px** | Body step drops to 1rem; plates 1-up; the category strip becomes one column with a top rule per cell and none on the first; the announcement bar switches to left-aligned at a 6px gap; the moon motif resizes to 400px and repositions; hero actions tighten to an 18px gap; the hero sheet body 1-up at a 16px gap with the caption free to grow; spec rows keep their 11px padding; the hero's pill and text link go full width and centre; the footer becomes 1-up. |
| **≤400px** | The header's "Shop all" pill is hidden — it duplicates the Shop disclosure and the hero CTA, and three controls overflow a 360px viewport. |

Verified layout claims from the prototype that stay binding: no horizontal overflow at 390px, and equal
card heights across the four-up plate grid at 1440px (the grid stretches, and each card's foot is pushed to
the bottom with `margin-top: auto`, so the price row aligns across the row).

## Elevation & Depth

**The light side is flat; hairlines and tone do the separating.** Depth on snow is tonal — snow → mist →
white panel — plus a 1px hairline at every edge. Nothing else on the light side casts a shadow: not a card,
not a menu panel, not a hover, not the checkout's TXID capture panel, which explicitly cancels both shadow and
ring.
There are no gradients, no glow, and no backdrop blur anywhere except the age gate's scrim.

**The dark side carries exactly one shadow.** The review card on the night band is lifted with
`0 8px 24px rgba(0, 0, 0, .22)` — a downward offset with blur, no halo, no spread. This is an owner decision
recorded here rather than an accident of the build: on a band where the surface step is only 1.6:1 and the
card's own hairline is 1.04:1 against it, the shadow is what makes the card read as a card. It appears only
there.

This is the one place where this document deliberately differs from an earlier elevation rule that allowed a
single shadow in the whole system, on the modal. The modal keeps its shadow; the dark-band card gains one.

### Shadow Vocabulary

- **Modal panel** (`0 8px 24px rgba(22, 35, 60, .22)`, tinted from the ink so the lift stays in the world's
  hue rather than grey): the age-gate sheet only, over a 95%-opaque scrim.
- **Dark-band review card** (`0 8px 24px rgba(0, 0, 0, .22)`): the review card on the night band, and
  nothing else on that band.
- **None** (`shadow-none`, `ring-0`): the explicit resting state for panels that would otherwise inherit a
  core shadow — the TXID capture panel, the wallet rail panel, the shop menu panel, every light-side card.

### Named Rules

**The Flat-By-Default Rule.** Light surfaces are flat at rest and there are exactly two shadows in the
system: the modal sheet and the dark-band review card. A third shadow — a hover lift, a "premium" card, a
glow, a focus halo — is not an addition to this vocabulary; it is a change to the world and needs the owner's
decision recorded in this document.

**The Tone-Not-Shadow Rule.** On the light side, separation is always a tonal step plus a hairline, never a
shadow. On the dark side, separation is the one-step tonal lift plus the permitted card shadow. A surface that
needs a shadow to be legible on snow is a surface that has the wrong tone.

**The No-Glow Rule.** No gradient used as atmosphere, no blurred colour behind content, no inner shadow, no
text glow, no neon edge. Flat fields only. The age gate's scrim is the sole exception and is unchanged.

## Shapes

Radii are differentiated on purpose — a uniform radius is banned, and so is anything above 32px.

| Family | Radius | Token | Consumers |
|---|---|---|---|
| Buttons, badges, chips, pills, count badge, scrollbar thumb | **999px** | `--r-pill` | Filled pills, text-link chips, plate-number chips, the cart pill, the mobile menu pill, the count badge |
| Inputs and inline controls | **8px** | `--r-ctrl` | Form fields, textareas, menu panel rows, select rows |
| Cards, menus, category strip | **16px** | `--r-card` | Catalogue plate, category strip, menu panel, review card |
| Hero plate sheet | **32px** | `--r-sheet` | The Plate 01 sheet only |
| Figure inner | **14px** | `--r-inner` | Hero plate figure, review order photograph |
| Focus outline corners | **2px** | `--r-focus` | The focus ring's own corner radius |

The review quote is the one asymmetric corner in the system, stated here rather than tokenised: the block
is square against its 3px beam bar and carries a 6px radius on its two free corners
(`border-radius: 0 6px 6px 0`), because the bar runs the full height of the left edge and a radius there
would break the join. **Radius resolution:** the legacy base `--radius` stays declared as an alias resolving
to `--r-ctrl` (8px), so core-derived utilities keep rendering their corners instead of collapsing to square,
and it is not re-based to 16px. Every theme-owned component names its own radius from the table above
instead of inheriting the base.

Borders are always 1px and always a token: `--hairline` on the light side, `--ash` for the hero sheet's edge
and a card's hover edge, `--night-rule` on the dark side. There are no 2px rules, no double rules, and no
angled or offset geometry. Nothing in this system is clipped or masked except the hero figure and the review
photo (both `overflow: hidden` at 14px) and the night band's moon motif (clipped by the band).

The retired radius world — one base token deriving every corner, no pill anywhere, nothing above 8px — is
superseded outright. Pills are the button and badge shape here, and the hero sheet's 32px is the ceiling.

## Components

Components are plain, text-led and named by their shipped file. Every value comes from the token home.

### Buttons

- **Shape:** full pill (`--r-pill`), ink fill, snow text, 1px transparent border, no shadow, ever.
  Minimum height 44px on every variant, so a button is never the smallest thing on a row.
- **Primary:** `--night` fill, `--snow` label, `label` step at weight 500, padding `14px 24px`, icon gap
  10px, min-height 44px — the prototype's primary pill resolves to 56px (20px padding plus the 1rem/1.6 label
  line box), so the 44px floor is a target this document states and the rebuild meets downward, not a value
  copied from the prototype. Used for exactly one action per action group: the hero CTA, "Add to cart",
  "Checkout" or "Place order". The budget is per **action group**, not per page or per card grid: each of
  the header, the hero, a card's own action group and the checkout summary may carry one filled pill, and no
  group may carry two. The age gate uses the compact variant below.
- **Hover inverts:** the fill becomes `--panel`, the label `--night`, and the border `--night` — the pressed
  state is the same appearance with the arrow held translated. Nothing moves, nothing scales, nothing lifts.
- **Compact variant:** `10px 18px` at the `label-sm` step (46px in the prototype, so it clears the 44px
  floor), for the header's "Shop all" and the age gate's confirm. The age gate renders the compact variant
  only — it is never a full-height primary.
- **Secondary routes are not buttons.** A second-path action is a text link: underline, 1px thickness,
  `text-underline-offset: 4px`, decoration `--ash` at rest and `--night` on hover, with a drawn arrow that
  translates 3px.
- **Labels name their destination** — "Browse the catalogue", "Shop Recovery", "View compound". Never
  "Learn more", never "Submit".
- **Disabled:** `--ash` chrome with a `--night` label (8.31:1 on the ash fill, so it stays legible even
  though inactive controls are exempt from the ratio floor), `cursor: not-allowed`, no colour change to a
  category hue, and never a beam fill. The checkout submit keeps its ink fill while disabled rather than
  greying out, so a pending order still reads as the action.
- **Focus:** the global ring (below). A button never draws a second ring of its own.

### Links & Navigation

- **Header:** sticky, `--snow` ground, 1px `--hairline` bottom rule, 74px, three-zone `1fr auto 1fr` grid so
  the links are optically centred. Left: the approved header lockup at 48px display height, `width: auto`,
  aspect preserved, `alt` empty beside an accessible brand name on the link. Centre: the destination list.
  Right: the cart pill, one filled pill, and — below 900px — the mobile disclosure.
- **Destinations:** Home · New releases · Shop · FAQs · Shipping · Contact us, plus **Payments** — seven, as
  the v5 prototype renders them (see The v5 Landing Exception). Six are bound to the routes named above;
  **Payments is bound to `/faqs`**, not to a `/payments` page, because no such page exists and no link may
  point at a page that does not. The destination is truthful: the FAQs page carries the "How do I pay?" block
  that explains the manual crypto flow, so a visitor asking how to pay lands on the answer. It is a real link,
  never an inert `#` anchor and never a fragment. Payment is taken by hand — how an order is paid, which rail
  is accepted, and what happens after live in prose the owner can maintain, plus the FAQs page and checkout,
  not in a page this theme cannot render. The Shop disclosure holds the
  five categories in fixed domain order (`glps`, `bioregulators`, `recovery`, `gh-releasing`, `other`).
- **Shop disclosure:** a native `<details>`/`<summary>` holding a hairline panel on `--panel`, `--r-card`,
  no shadow, rows at `--r-ctrl`. Each category row carries its mono count and clears the 44px touch target.
  Requirements: it is keyboard-operable natively (the summary is focusable and toggles on Enter/Space);
  Escape-to-close and click-outside-to-close are **not** native `<details>` behaviour and need a small
  scripted handler — one keydown listener for Escape and one document-level pointer check; and the summary
  shows a drawn
  chevron. There is no search field, no mega-menu and no blur.
- **Below 900px:** the link row is hidden and a 44×44 pill disclosure in the right cluster carries the same
  destinations plus the five categories (and "All products"), so nothing becomes unreachable on a phone.
  Below 400px the header's filled pill hides.
- **Cart:** a 44×44 pill with a hairline border that escalates to `--night` on hover with a `--panel` fill,
  a drawn cart path, and a count badge — absolute at the top-right, `min-width: 18px`, `height: 18px`,
  `padding: 0 4px` (so the caption-step line box fits without an off-scale size), pill, `--night` fill,
  `--snow` mono at the caption step, `aria-label="Cart, N items"`. The prototype draws this control at
  40×40; this document states 44×44 as the target, and that is a deliberate correction, not a copied value.
  The mobile disclosure is corrected the same way.
- **Nav links:** `label-sm`, weight 500, default ink, with a 1.5px bottom border that is transparent at rest
  and `--night` on hover over 160ms. This is the one place a hover underline is added; the old world forbade
  it and that prohibition is lifted here.
- **In-card links:** the compound's name in ink, turning to `--night` at full strength on hover (there is no
  lighter ink to escalate to); a category name in its own accent; a plate identity string in its accent.
- **Wordmark and mark:** the approved raster lockup, never a generated crescent and never a text wordmark
  with a hue on half of it. See Assets & Identity.
- **Favicon:** the approved PNG family wired through the store's `favicon` setting, so the owner can replace
  it from the admin console with no rebuild.

### Cards

Five card families, one vocabulary: a surface, a hairline, a shade of radius, no light-side shadow.

- **Catalogue plate (product card).** `--panel`, 1px `--hairline`, `--r-card`, 16px padding, flex column,
  border escalating to `--ash` on hover with nothing moving. Anatomy top to bottom: a head row (a neutral
  pill chip carrying the plate number on the left, the mono compound identifier in its category accent on
  the right) → an authored hairline cutaway of a sealed vial in `currentColor` at `--slate`, `role="img"`
  with a real `aria-label` ("Cutaway diagram of a sealed vial: crimp seal, glass body, lyophilized powder")
  → the product name at the title step → a mono form · size line in `--slate` → a foot row pushed to the
  bottom by `margin-top: auto`, hairline top rule, mono price on the left and a "View" text link on the
  right. That is the **browse card** — price plus one quiet text route into the product page. On the
  shoppable `/all` grid the same card instead carries the price plus an "Add to cart" compact pill: one
  filled pill in the card's own action group, never a second one beside it. The figure is a drawing, so the
  grid is complete with zero product photography.
- **Hero plate sheet.** The thesis in one object: `--panel`, 1px `--ash` edge (not hairline — the sheet is
  the page's one lifted-looking flat object, and ash is what makes its edge read against the mist band),
  `--r-sheet` 32px, 16px padding. Head row: a `chip-beam` plate number on the left, the mono identifier on
  the right. Body: the photograph at 3:4 on a `.78fr` column and the record on `1.22fr`; the caption is a
  real `<dl>` whose rows are hairline-separated label/value pairs, the label at the `label-sm` step in
  `--slate`, the value mono right-aligned in ink, 12px vertical padding, no rule under the last row. Foot
  row: a neutral chip carrying category · strength, and a "View compound" text link, above a hairline.
- **Category cell.** Not a floating card: five cells inside one `--r-card` container with `overflow: hidden`,
  divided by 1px hairlines. Each cell is a link whose colour is its own category accent, holding the
  category name at the title step, and a foot row with a mono count in `--slate` and a drawn arrow at 0.85
  opacity — visible without hover so touch works — going to opacity 1 and translating 3px on hover. Hover
  fills the cell with `--mist`. The hue colours the category name and the drawn arrow only: the count stays
  `--slate` text on the panel ground with no hue-tinted container behind it.
- **Review card.** The one dark-side card. `--night-surface`, 1px `--night-rule`, `--r-card`, 24px padding,
  and the one permitted dark-side shadow. Flex column so the row stays equal-height. Anatomy: a
  `<blockquote>` (serif italic quote step, snow, `padding: 12px 16px`, transparent ground, a 3px `--beam`
  left bar, square against that bar and 6px on the two free corners) → a `<figcaption>` 20px below holding the author's name (name step, 600,
  snow) over the order meta line (mono at `--night-muted`: city, state abbreviation, month and year) → the
  order photograph as a direct sibling of the caption, 20px below it, 4:3, `object-fit: cover`, 14px inner
  radius, 1px `--night-rule` edge, `--night` background. The photograph is an order shot, never a face
  avatar; monogram discs are gone and may not return.
- **Flush panel.** The checkout wallet panel, the TXID capture panel, a notice block, the shop menu panel: a
  `--panel` surface on a hairline, shadow none, ring zero. Radius follows the panel's job: **`--r-ctrl` (8px)
  for every form-bearing or control-bearing panel** — the wallet rail list and the TXID field among them, since
  both carry controls and sit in a form — and `--r-card` (16px) for menus, which are navigation surfaces
  rather than form ones. A payment panel is never `--r-card`.
- **No empty frames, ever.** A catalogue card is complete on name, form, size and price; the cutaway is
  authored, not a photograph; and the image element renders only where an image actually exists. There is no
  placeholder box, no grey rectangle, and no "image coming soon".

### Footer

- **Shape:** `--snow`, hairline top rule, `padding-block: 56px 40px`.
- **Grid:** `1.4fr 1fr 1fr 1fr` at a 32px gap — brand column then three link columns: **Catalogue** (All
  products, New releases, and the five categories), **Information** (Home, FAQs, Shipping, Contact us),
  **Payment** (Bitcoin, USDT (ERC-20), Ethereum) — the three rails the storefront accepts. The v5 prototype
  renders all three as links and the owner approved that treatment: each is an `<a href="/faqs">`, pointing at
  the page that explains how payment works, and none points at a per-rail page, because none exists. USDT is
  **Ethereum (ERC-20)** — see Crypto Payment Panel. Every destination that existed in the superseded
  centre-aligned page row is present here; only the arrangement changed.
- **Brand column:** the approved mark at 44px height with 18px below it, then one plain line of positioning.
  The mark is decorative (`alt=""`, `aria-hidden`), so the brand is announced exactly once — through the
  link's own accessible name — rather than twice.
- **Column headings:** `micro` at weight 500 in `--slate`, 14px below.
- **Links:** `label-sm` in ink, escalating to `--slate` on hover; 10px between rows.
- **Base row:** 48px above, 22px padding-top, hairline top rule, flex space-between, `13.5px` resolved onto
  the micro step in `--slate`. Left: the RUO line, unaltered — "For research use only. Not for human consumption."
  Right: `© 2026 Elune Labs · Prices in USD` in mono. Compliance text is never shrunk or dimmed below AA.

### Inputs & Fields

The landing prototype renders no form; this section is the specification the account, cart, checkout and
contact surfaces inherit. It is derived from the same token layer, not from an older world.

- **Style:** `--panel` fill, 1px `--hairline` stroke, `--r-ctrl` (8px) radius, `padding: 0.625rem 0.75rem`,
  ink text at the body step, `--slate` placeholder. Caret `--night`.
- **Focus:** fields keep the global focus ring and add nothing else — border `--night` plus the 2px outline
  at a 2px offset. There is **no** separate border-plus-shadow ring in this world, and no exclusion from the
  global ring: one ring treatment, everywhere. This resolves an inconsistency in the superseded
  specification, which excluded fields from the global ring; a second, field-only ring is not adopted.
- **Textarea:** the same family; the TXID capture field is three rows and accepts an on-chain hash.
- **Disabled:** `--ash` chrome with a `--night` label; never a bee-lightened or hue-tinted field.
- **Error:** the field's 1px stroke and its message text both use `--destructive` (7.22:1 on the panel
  fill), the message sits directly under the field at the micro step, and the message begins with a word,
  never with colour alone. No red fill behind body text, no icon library, no shake animation.
- **Labels:** a real `<label>`, ink, at the `label-sm` step, above the field. No floating labels, no
  placeholder-as-label.
- **Targets:** every input, its label's hit area, and every checkbox or radio is at least 44px in its
  interactive dimension.

### Notices

Two notice blocks are compliance surfaces: the product page's research-use-only notice and the research
chemical notice inside the age-gate panel. Both are a `--mist` panel at the 8px control radius (`--r-ctrl`) with `--night`
body copy at the micro step and a small uppercase caption label **inside** the block.

- **The amber exception is retired.** The superseded world carved out one amber notice treatment; no warm
  value may survive, so both notices use tokens like every other surface.
- **A notice label is a caption, never an eyebrow.** It sits inside the block it belongs to and never floats
  above a headline. That distinction is the only reason uppercase survives at all.
- The RUO string is not a design decision — see Content Truth & Compliance for its exact wording and render
  points.

### About This Compound

The product page renders this section
(`themes/elune/src/pages/productView/ProductDescription.tsx`) between the price and the specification table:
one to two plain-language paragraphs on what the compound is, then a "Published research on this compound"
block.

- **Heading:** deliberately not "Product Description" — core renders its own heading by that name into the
  same area and the two would collide. The heading takes the title step.
- **Literature block:** carries a sentence stating that it documents the external research literature and not
  this product, the batch supplied, or any analysis of it, and that no certificate of analysis is published
  for any product. It is deliberately un-ruled — no border, no table — so it cannot be mistaken for the
  specification record.
- **Absent literature:** three SKUs (Epitalon, and both CJC-1295 entries) ship with no literature at all, for
  compliance reasons; for those the entire literature section is omitted, never rendered as an empty heading.

### Specification Table

The product page renders the analytical record as a real `<table>` with an `sr-only` caption and
`<th scope="row">` for each label — no decorative panel, no definition-list-as-grid.

- **Labels:** `--slate`, regular weight, left-aligned, 40% column, top-aligned, at the `label-sm` step.
- **Values:** ink, with mono applied to the chemical values (CAS, formula, molecular weight, sequence);
  form, purity and storage stay in the sans face at the body step.
- **Density:** 11px vertical padding per row and a 16px gap before the value column. Each cell keeps the
  base table's 1px `--hairline` border, so the record reads as a ruled label sheet rather than a floating
  list.
- **Absent values vanish:** rows without a value are filtered out, and a SKU with no record renders no
  specification section at all — no dash, no blank cell, no "pending".
- The hero sheet's four-row caption is the same record in miniature and follows the same omission rule: its
  rows are that one compound's own shape, not a fixed template.
- **Purity caveat (required):** because the table is where the `≥99%` declaration is read, the sentence
  "The purity value is a product specification, not a batch test result." renders directly below the table,
  at the micro step in `--slate`, and always adjacent to the figure it qualifies — never in a footnote or a
  distant legal block.
- The landing page does not render the full record; the record's home is the product page, sourced from
  `themes/elune/src/data/productSpecs.ts`.

### Age Gate

A modal on the first storefront visit: advisory only, 30-day cookie, client-side by design.

- **Shape:** a sheet on `--snow` with `--night` ink, a 1px `--hairline` border, `--r-card` (16px) radius,
  max-width 32rem, 1.5–2rem padding, the **one** permitted light-side shadow, over a 95%-opaque scrim.
- **Content order:** the question, the research chemical notice, the confirmation sentence, then one filled
  pill — the compact button variant, never the full-height primary, so the panel keeps a single modest
  action.
- **Copy (normative, and by contract):** title `Are you 18 or older?` carrying `id="age-gate-title"`; the
  research-chemical sentence stating the products are sold as research chemicals for laboratory research use
  only, are not food, dietary supplements or drugs, and are not intended for human consumption; the
  confirmation sentence that entering confirms the visitor is at least 18 and accepts the terms of sale; the
  pill `I am 18 or older — Enter`; and a plain text link `Cancel — Leave` beside it rather than a second
  button, so the region keeps its single filled pill. A footnote states the notice is advisory and stored
  only in a browser cookie for 30 days. These strings, their order and the two control labels are the
  shipped contract's, taken verbatim from `docs/design/8-2-ui-compliance-payment.md`: a visual restyle does
  not invent, shorten or rewrite compliance copy, and none of it is design-owned or open to wording
  preference.
- **Behaviour:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby="age-gate-title"`, focus moved into
  the panel on open and trapped inside it, body scroll locked with `.elune-lock`, and a 30-day cookie
  `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax` written on confirm; declining leaves the site. It
  is never an authentication boundary, is never enforced server-side, and never blocks `/admin` or any
  `/api` route: admin pages are theme-immune and API routes render no component tree, so the gate cannot
  reach them. How the guard is written stays as shipped; this document specifies the outcome, not the
  detection mechanism.

### Crypto Payment Panel

The payment step shows the order total above a definition list of wallet addresses — **Bitcoin (native
SegWit), USDT (Ethereum, ERC-20), and Ethereum (ERC-20)** — inside one `--panel` card on a hairline, radius
`--r-ctrl` (8px), shadow none, ring zero. The panel is form-bearing — it carries a copy control and sits beside
the TXID field — so it takes the control radius, not the card radius; the same applies to the TXID panel. See
**Flush panel** under Cards for the rule this follows.

- **Rail — USDT is Ethereum (ERC-20).** The storefront accepts USDT on Ethereum, not on TRON. Network label:
  `USDT — Ethereum (ERC-20)`. This is the owner's decision and it is global: the same label and the same rail
  govern the checkout panel, the value ribbon, the footer and every other surface. The superseded TRON
  (`TRC-20`) reading is retired; it may not reappear in copy, a label, a placeholder or a test.
- **The rail fails closed.** `crypto_wallet_usdt` resolves only when the stored value is a 40-hex-digit
  Ethereum address (`^0x[0-9a-fA-F]{40}$`). Anything else — unset, a legacy TRON `T…` value, or an old
  placeholder — resolves to null, and the row renders as unavailable: the plain sentence **"Not configured —
  contact us before sending."** in place of an address, with **no Copy control**. An empty value disables the
  rail; it never falls back to a default. The consequence is deliberate and expected: **the shipped storefront
  shows USDT as unavailable until the owner saves a real Ethereum address**, because the stored value is the
  retired TRON placeholder.
- **The old TRON settings cannot be reused.** Nothing about a TRON configuration carries over — not the
  address, not the placeholder sentinel, not the admin label. Migrating the rail means configuring a new
  **Ethereum** address through the admin console (Settings → Payment) or `POST /api/settings`; the owner must
  hold an Ethereum wallet that can receive USDT on ERC-20, and the address is pasted as `0x…`. There is no
  conversion path and no fallback rail: until that happens, customers pay by Bitcoin or Ethereum only.
- **Fail-closed is the whole rule.** No surface may render a placeholder address as if it were payable, mark
  an unconfigured rail as available, or print a "coming soon" state. An unavailable rail says it is
  unavailable, and the other two rails stay fully usable.
- **Addresses:** mono at the mono step, `overflow-wrap: anywhere` so they break across lines, each row with a
  small pill-labelled "Copy" control whose hit area is at least 44px.
- **Copy fallback:** the storefront is served over plain http on a LAN/tailnet address, where
  `navigator.clipboard` does not exist, so the textarea + `execCommand` path is the real one; a failed copy
  reports itself in plain text.
- **TXID capture:** a separate flush panel with a three-row textarea, stored on the order's shipping note,
  with the destructive treatment reserved for a genuine validation failure.
- **Manual only:** no gateway, no card fields, no automated on-chain verification UI. Addresses and
  instructions are edited in the admin console and take effect immediately.
- **No confirmation guarantee.** The panel and its instructions never promise that payment will be detected,
  credited or confirmed within any time; the order sits at `pending` until the owner captures it, and no
  surface may say otherwise. Manual verification instructions must not imply an automated check.
- **No certificate or verification affordance** appears beside a payment row. A lot or batch identifier,
  where the catalogue carries one, is plain product data — never proof, never a link to a document that does
  not exist.

### Pages & Routes

- **`/all`:** every product, alphabetical by name.
- **`/new-releases`:** the newest 6 by catalog order.
- **`elune-catalog` extension:** both routes are served by `extensions/elune-catalog/`, because themes cannot
  register routes in EverShop; the theme binds to those routes by folder name.
- **CMS pages:** `/faqs`, `/shipping` and `/contact` are CMS pages, editable in the admin console with no
  rebuild. They render page prose at the lede/body steps inside the shell, with no cards, no icon rows and no
  decorative panels. An FAQ is heading-plus-paragraph prose: a disclosure block is specified only when a
  disclosure renderer actually exists in the CMS, and today none does, so no page may require one.
- **Category routes:** the catalogue plate grid at 4-up, with the category heading in `--night` ink like
  every other section header, and the same empty and error states as the catalogue. A category's accent
  stays inside the cards — the name on each plate and its 1px identity mark — never on the section header
  and never as a container fill.
- **Product page:** hero-sheet-scale record anatomy, About This Compound, the specification table, the RUO
  notice and one filled pill for the primary action. Because the catalogue has no per-product photography,
  its figure uses the authored vial cutaway or is omitted; the existing empty-media collapse remains. The
  crypto panel appears later at checkout.
- **Cart:** hairline-separated flush rows, mono quantities and prices, the order total above the fold of the
  summary, one filled pill to check out, and a `--destructive` treatment reserved for a real error.
- **Checkout:** guest checkout is the default and the only required path (the announcement bar says so), and
  it is three steps — contact, then shipping at the one flat rate, then crypto payment — each collecting only
  what that step needs, with the order summary carried forward. The third step is the crypto panel with its
  TXID field, plus the shared field/focus/disabled/error treatments above. Account surfaces
  — sign in, register, order history — are core-rendered and inherit this world through the role aliases, so
  no bespoke work is needed for them to render correctly.
- **Confirmation:** the order's state, the payment instructions' status, the TXID, and the RUO line. The
  confirmation renders with **`payment_status` at `pending`** and keeps saying so until the owner records the
  captured payment from the admin console; the page never claims the money has arrived, and it invents no
  timeline beyond that one status. No
  celebratory colour, no confetti, no invented timeline graphic, and at most one use of the `--night` region
  on any confirmation surface.

### Browser Surfaces

The palette reaches the places Tailwind does not paint, from the token home in `shadcn.css`:

- **Text selection:** beam fill with `--night` text (12.38:1).
- **Caret:** `--night`.
- **Scrollbar (Firefox):** `scrollbar-color: var(--slate) var(--snow)` — the slate thumb on the snow track.
  The thumb is a control affordance, not decoration, so it holds the 3:1 non-text floor (5.59:1 on snow,
  5.15:1 on mist); the prototype paints it `--ash`, which would sit at 1.77:1, and this document corrects
  that.
- **Scrollbar (WebKit):** a 12px track in `--snow`, a `--slate` thumb with a 4px snow border and a pill
  radius.
- **Keyboard focus ring:** `2px solid var(--night)` with a 2px offset, and a 4px offset on links, all with a
  2px corner radius. It applies to links, buttons, summaries, `[role="button"]` and `[tabindex]` — and to
  form fields as well, which take no second ring.
- **Text links:** underline thickness 1px, `text-underline-offset: 4px`, decoration `--ash` at rest and
  `--night` on hover.
- **Numeric figures:** every figure column is `font-variant-numeric: tabular-nums` — prices, counts, spec
  values, meta lines, wallet addresses.

### States

One state vocabulary for every surface, light or dark.

| State | Treatment |
|---|---|
| **Rest** | Hairline boundary on the light side; `--night-rule` on the dark side. No shadow (except the two permitted). No scale, no offset. |
| **Hover** | Two families only, and nothing moves: controls with a filled or labelled affordance escalate to `--night` (the pill inverts, the cart and menu pills take the ink border with a panel fill, the nav link's underline turns ink, the text link's underline turns ink); surfaces that are themselves the target escalate tonally (cards to the `--ash` border, category cells to a `--mist` fill). Hover never adds a shadow, never changes type, and never shifts layout. |
| **Focus-visible** | The global ring. Never suppressed, never replaced by a colour change alone, never drawn twice. |
| **Pressed** | The hover appearance, held, with the arrow at its 3px offset. No scale, no darkening, no ripple. |
| **Selected / active** | `--mist` fill with `--night` text, for menu rows, select rows and the current route. Selection never uses a category hue or the beam. |
| **Disabled** | `--ash` chrome, `--night` label, `cursor: not-allowed`; the control keeps its shape and label. A pending submit keeps its ink fill instead of greying out. |
| **Loading** | Skeleton blocks: `--mist` on `--snow`, `--night-rule` on `--night`, always at the radius of the thing they stand in for. **No shimmer and no spinner** — a sweep is a gradient, and this world bans gradients as atmosphere; the skeleton is static and therefore already reduced-motion safe. A pending control keeps its label and sets `aria-busy`. |
| **Empty** | One `--mist` panel or bare shell block: a title-step heading, one `--slate` body line, and one text link to the way out (the catalogue, or the category list). No illustration, no icon row, no invented statistic. The RUO line and the footer are unaffected. |
| **Error** | `--destructive` for the message text, any 1px rule and any affected field stroke (6.80:1 on snow, 7.22:1 on panel); message in plain words at the micro step; never a destructive fill behind body text; never colour as the only signal. The error is stated in the same region as the thing that failed. |
| **Success** | Carried by ink and by copy, not by a colour. No green, no confetti, no celebratory badge; the confirmation surface states what happened in plain sentences. |

Every state that carries meaning is announced to assistive technology by text or ARIA, not by colour,
weight or position alone.

### Announcement Bar

A 38px `--mist` band above the header, `--slate` text at the micro step, one compliance line and one
operational line, sentence case, no hype: **"For research use only. Not for human consumption."** and
**"Prices in USD · Guest checkout"**. It is a flex row, space-between, wrapping, tightening to left-aligned
with a 6px gap at ≤640px. It is never a countdown and never a discount. The RUO half of it is the same fixed
string used everywhere else.

### Value Ribbon

The value-props component of this world. It replaces the ruled ledger of an earlier draft and is not
decoration on top of the page — **the ribbon *is* the features component**.

- **Form:** a full-bleed `--snow` band between the hero and the categories, hairline bottom rule,
  `overflow: hidden`, holding two identical sets of statements; each item is padded `15px 28px` with a 1px
  `--hairline` left pipe, `--slate`, at the `label-sm` step, `white-space: nowrap`. The item's line-height is the step's own 1.4: the
  prototype's 1.5 is a local override and is not adopted, so an item's height follows its type step like every
  other surface rather than carrying a one-off value.
- **Motion:** the track drifts exactly one set-width per **64s**, linear, infinite — deliberately **not**
  on the shared easing token, because a constant-speed ticker has no ease to share; that token belongs to
  entrances and hovers, and a continuous loop does not consume it. Hover pauses it, and keyboard focus pauses it too — the band carries `role="region"`, an
  `aria-label`, and `tabindex="0"`, which is the WCAG 2.2.2 pause mechanism for auto-scrolling content, with
  the system's focus ring as the visible cue. The second set is `aria-hidden`.
- **Reduced motion:** the drift stops, the duplicate set is hidden, and the band hands over to native
  horizontal scroll (`overflow-x: auto`) so no statement is lost. This is the accessible form of the
  component, not a degraded one.
- **No responsive rules:** a ticker is width-agnostic, so the ribbon needs none of the ledger's six override
  blocks.
- **Copy rule — this is the load-bearing part, and the landing is a recorded exception to it.** A ribbon
  statement is a claim the storefront makes about its own operation, so outside the landing it must be **true
  today, operationally supportable on request, and reviewed for compliance before production**. Three
  consequences are binding on every route except the landing route:
  1. **Owner-supplied copy is not automatically approved copy.** A statement supplied for the band is
     reviewed against this section before it renders.
  2. **Unsupportable claims are not normalised into the system.** Three candidate strings — "Unbeatable
     delivery rate. Zero issues." (a superlative delivery claim with no source in this repository,
     contradicting the inherited no-speed-claims rule); "Best in class factory direct pricing" (a comparative
     superlative — published, comparable pricing is a fact this storefront can state, while "best in class"
     is a ranking nobody here has established); and "affordable bulk pricing for everyone" (an unbounded
     affordability and volume claim — the catalogue has no bulk tier and no price-tier data at all today) —
     may **not** be copied onto another route, may not be softened into a variant that still makes the
     superlative, and may not be cited as "owner copy" to justify their use elsewhere. They render on the
     landing route only, because the owner directed exactly that (see The v5 Landing Exception).
  3. **A batch-tracking statement is landing-only today.** "Batch tracking for each vial" renders on the
     landing route by the same direction, and **neither `scripts/catalog-data.json` nor
     `themes/elune/src/data/productSpecs.ts` carries a batch or lot field** — so the statement is owner-selected
     copy, not a fact this repository can demonstrate. It may not be copied to another route, and no surface
     may imply published evidence behind it: no certificate, per-batch document, confirmation affordance or
     "verified" label. If a real batch field is ever added, stating an identifier's existence becomes
     supportable; implying evidence still does not.
- **What the band renders.** In the shipped landing the ribbon carries the owner's five statements verbatim,
  as the v5 prototype renders them: **"Tracked & discreet, flat rate shipping"**, **"Bitcoin, USDT (ERC-20),
  and Ethereum Accepted"**, **"Batch tracking for each vial"**, **"Best in class factory direct pricing"** and
  **"Unbeatable delivery rate. Zero issues."** The rail named in the second statement is now correct as
  written — USDT is Ethereum (ERC-20) — but the other four are owner-selected copy, and the storefront making
  a statement is not evidence that the statement is true. Any other route that wants one of these statements
  takes it through the copy rule above, and nothing else.

### Hero & Plate Sheet

The homepage's first viewport, and the clearest statement of the thesis: object and record at the same scale.

- **Band:** `--mist`, one column at ≤900px, `padding-block: clamp(48px, 6vw, 84px)`.
- **Copy column** (`1.04fr`): the display headline with **no kicker above it**, one lede in `--slate` at the
  48ch measure, an action row with exactly one filled pill and one underlined text link, and a micro proof
  line under them ("Extensive catalog across 5 core research categories") — the count is the storefront's
  fixed category count, not a product count, so it cannot go stale as the catalogue grows. "Extensive" is
  carried from the owner's copy as descriptive language, not as a metric, and the line is omitted rather
  than rewritten if the owner ever wants a number in it.
- **Headline:** "Research peptides. Direct from the source. Uncompromising purity." — three beats, sentence
  case, whisper weight.
- **Lede — landing copy, owner-selected.** It names the purity declaration, the pricing and the order
  process, and it carries two inline `.mono` spans as the v5 prototype renders them: the `≥99%` figure and the
  prose word "everyone". The `≥99%` figure is a declaration carried on every product; it is never restated as
  a verification, and it never implies that a batch was tested, accepted or rejected — no batch or lot record
  exists to point at. The mono span around "everyone", and the lede's "affordable bulk pricing for everyone"
  claim, are **owner-selected copy rendered on the landing route** under The v5 Landing Exception: they do not
  become a system pattern, they do not license an inline mono prose span or a bulk-pricing claim on any other
  route, and nothing in this repository substantiates the claim. The catalogue carries no bulk tier and no
  price-tier data.
- **Plate 01** (`0.96fr`): the hero plate sheet described under Cards, with the branded vial photograph at
  its native 3:4, framed by `object-fit: cover` alone at every width — no transform, no crop hack, no
  letterbox seam against `--snow`, and no ≤640px aspect-ratio override. Alt text describes the actual
  subject: a sealed glass vial with a midnight-navy crimp cap and the Elune Labs label, lyophilized powder
  at the base, on a pale seamless ground.
- **Purity caveat (required):** the sentence "The purity value is a product specification, not a batch test
  result." renders wherever the `≥99%` declaration is read. On the **landing route** the approved position is
  the band's closing foot line — the last line of the night band, directly under the reviews' transparency
  foot, as the v5 prototype renders it (see The v5 Landing Exception). On the **product route** it renders
  directly below the specification table. The superseded placement — directly below the plate sheet — is not
  what the owner approved and is not built.
- **Why this asset:** the cap's midnight navy is the palette's own ink family, and the label puts the
  approved mark at product scale in the first viewport. The earlier teal-cap asset is superseded.

### Review Entries

Three directed reviews, on the night band, above the footer. This is a **scoped, recorded exception** to the
no-fabricated-social-proof rule and to a surface brief that forbade testimonials; the exception covers this
section and nothing else — no invented metrics, no partner logos, no press marks, no star ratings, no
purchase counts anywhere else.

**The section renders.** The owner directed the three cards to ship as the v5 prototype renders them — quotes,
names, cities, dates and order photographs — and that direction is recorded in The v5 Landing Exception. The
superseded rule that held the cards behind a publication gate is lifted, and no surface may re-introduce a
gate, hide the section, or describe it as blocked or prohibited.

**What the section is not.** The supplied quotes, names, dates and photographs are **owner-selected
testimonial material**. Their presence is not proof of completed orders, not evidence of customer consent, and
not evidence that anything in them was checked. No consent record, order link or truth review exists in this
repository for any of the three, and none may be inferred, fabricated or asserted in a comment, a document or
a commit message. The privacy treatment below is a design rule the cards follow; it is not a consent record.
The transparency foot's collection claim is owner-selected copy and shares this status — see *Owner-selected
copy is not evidence* for the full list and the risk it carries.

- **Band:** the single permitted `--night` region, carrying the cratered-disc motif and the reviews. Heading
  "From recent orders." at the headline step, max 24ch.
- **Grid:** three equal columns at a 20px gutter, 36px below the heading, 1-up at ≤900px.
- **Card anatomy:** as specified under Cards (review card).
- **Copy limits:** each quote may reference the product's quality and the ordering experience only — no
  shipping-speed claim unless that specific claim is substantiated for that specific order, and never as a
  general permission. No efficacy, dosing, medical, body or human-use claim; no purity figure inside a quote;
  no verification adjective.
- **Privacy:** first name plus last initial, city plus state abbreviation, month and year. No faces, no
  avatars, no full names.
- **Transparency foot — verbatim v5 string, and it is a claim.** The closing line renders exactly as the
  prototype words it and the owner directed it: **"Collected from completed orders and published unedited.
  Names shortened to first name and last initial."** It sits at the micro step in `--night-muted`, 64ch, 28px
  below the grid.
  **This is owner-selected copy, not a verified statement.** Nothing in this repository records a collection
  method, a completed order, an order link or a consent record for these three reviews, so the first sentence
  is an **unsubstantiated factual claim about the store's own operation**, and it is not independently verified.
  It is not a moderation policy the code can be read as enforcing, and no comment, document or commit message
  may treat it as substantiated or inoffensive merely because it is a fixed string or because nearby code
  caveats it. The second sentence (names shortened to first name and last initial) is the privacy treatment the
  cards in fact follow.
- **Purity caveat — landing position.** On the landing route the caveat sentence renders as the band's closing
  foot line, directly under the transparency foot, as the v5 prototype renders it and the owner approved. The
  superseded rule forbade a caveat in this band; that rule is lifted for the landing route. The statement
  itself is unchanged and still required: "The purity value is a product specification, not a batch test
  result." Placing it here is a response to the hero's `≥99%` declaration — the figure is read in the first
  viewport, and the sentence qualifies it on the same page.
- **Motif:** one authored SVG only — concentric crater rings and four dots, drawn in `currentColor` at 16%
  opacity, bleeding off the band's right edge, `aria-hidden`, `pointer-events: none`, resized and
  repositioned at ≤640px. It is the only ornament in the system; there is no illustration set.
- **The band carries no record text.** The specification record lives on the product page.

### Homepage Composition

The landing page is a composition of the components above, in the owner-locked order. The order is
unchanged from the canon; only the world is new. One region was added — the night band — inside that order,
not as a reordering of it.

1. Announcement bar — RUO line + USD/guest line.
2. Sticky header — brand lockup, seven destinations + Shop disclosure, cart, one filled pill.
3. Hero + Plate 01 — the thesis.
4. Value ribbon — the storefront's commitments, as a ticker.
5. Categories — one strip, five cells, in fixed domain order.
6. Catalogue plates — four plates at 4-up under a section head (heading + text link).
7. Night band — motif, the three reviews, the transparency foot and the purity caveat as its closing line.
8. Footer — brand, three link columns (Catalogue · Information · Payment), base row.

Global versus composition, stated once: **the section order, the band set and the region rhythm are
homepage composition** and are not generalised to other routes. **The tokens, the type steps, the radii, the
state vocabulary, the card anatomies, the button and link rules, the notices, the record rules and the
accessibility floor are the global system** and apply to every route, including admin-adjacent storefront
surfaces. A route that needs a composition of its own builds it from the global rules; it does not invent
values.

### Motion

**One authored entrance, and the ticker.** Nothing else moves.

- **Entrance (`rise`):** content rises 14px and fades in over **660ms** on `cubic-bezier(.16, .84, .44, 1)`,
  applied to hero copy, the sheet, the plates and the review cards. Stagger is **70ms** per item
  (`--d: 0 / .07s / .14s …`); the prototype's hero used an 80ms cadence while its cards used 70ms, and 70ms
  is the single cadence. It runs only under `prefers-reduced-motion: no-preference`.
- **Hover transitions:** colour and border over 160ms; the arrow's 3px translate over 220ms; menu rows and
  category arrows over 140–180ms. All on the shared easing token, all colour or transform only — never
  layout, never size.
- **Ticker:** the ribbon's 64s linear drift — deliberately outside the shared easing token, which governs
  entrances and hovers — with the pause and reduced-motion behaviour specified above.
- **Reduced motion:** `prefers-reduced-motion: reduce` removes the entrance entirely (content at its final
  position, opacity 1), stops the ticker and hands the ribbon to native scroll. Under `print`, the entrance is
  neutralised too.
- **Banned:** parallax, scroll-jacking, decorative marquees (the ribbon is a component, not décor), cursor
  effects, per-section animation variants, and any second entrance family.

### Accessibility

The floor is WCAG 2.2 AA, and it is not delegable to a later pass.

- **Contrast.** Every text pair meets 4.5:1 for body sizes and 3:1 for large text; non-text affordances meet
  3:1. The verified pairs are the ones listed in Colors — in particular night on snow 14.75:1, slate on snow
  5.59:1, slate on mist 5.15:1, every category accent above 5:1 on both the canvas and the panel, snow on the
  band 14.75:1, band secondary text 9.90:1 on the band and 6.19:1 on the review card, and night on beam
  12.38:1. Hairlines and dark-side card rules are decorative and are never the sole affordance of a control.
- **Focus.** Always visible: a 2px `--night` ring at a 2px offset (4px on links), on every interactive
  element including form fields. Focus is never removed and never simulated with a colour change. On the
  night band and on the `--night-surface` review card the ring switches to `--snow`, because a `--night`
  ring would vanish into its own ground; everywhere else the global `--night` ring stands unchanged.
- **Colour is never the only signal.** Category names stay textual; state changes carry text or ARIA; the
  destructive treatment is always accompanied by words; the ribbon's duplicated set is `aria-hidden`.
- **Targets.** Every standalone control is at least 44×44px: the cart pill, the mobile disclosure, the
  copy controls, every button and every input, including each control's label hit area. WCAG 2.2 AA's own
  floor for everything else is 24×24px, and the inline-text exception applies as written — links inside a
  sentence, the header's nav link row and the footer's link rows are sized by their text, so they are exempt
  rather than padded to 44px, and no other control is.
- **Structure.** One `<h1>` per page, headings in order without level skips, sections and the nav named,
  landmark structure with content inside a `<main>` and the header/footer outside it. The prototype renders
  its sections as direct body children with no `<main>`, and it sets catalogue card titles and the footer's
  column labels as `<h3>`s with no `<h2>` above them — two defects this system fixes rather than copies:
  each route's sections own an `<h2>`, a card takes the title step inside the section that owns its `<h2>`,
  and the footer's three column labels hang beneath a visually hidden `<h2>` for the footer navigation, so
  the outline never skips a level.
- **Text alternatives.** Real alt text on the hero photograph, on each of the three order photographs, and on
  each cutaway figure (`role="img"` plus a descriptive label). The brand mark is decorative beside an
  accessible brand name; decorative SVGs and the duplicated ribbon set are `aria-hidden`.
- **Auto-scrolling content.** The ribbon is pausable by hover **and** by keyboard (`tabindex="0"` +
  `role="region"` + focus-within pause), and its reduced-motion form is a native horizontal scroll — so the
  statements remain reachable with motion disabled.
- **Forms.** A real `<label>` per field, errors tied to the field by text and by `aria-describedby`, the
  pending state announced with `aria-busy`, and no input that depends on a drag or a gesture. No field asks
  for information the visitor already gave: checkout collects the contact address, the shipping address and
  the payment reference once each, and a failed step returns with its data intact rather than cleared.
- **Sticky chrome.** The announcement bar (38px) and the header (74px) stay pinned, so a fragment target
  scrolled to must not land underneath them: any element that is a link destination carries
  `scroll-margin-top: 112px`.
- **Disclosure controls.** Native `<details>`/`<summary>` in the header and the mobile panel, keyboard
  operable with the system focus ring, closing on Escape and on an outside click — both delivered by the
  small scripted handler specified in Links & Navigation, since `<details>` provides neither natively. No
  page depends on a disclosure block the CMS cannot render today.
- **Language and title.** `lang="en"` on the document and a meaningful `<title>` per route — the offer line
  on the homepage, the product or category name elsewhere.

### Content Truth & Compliance

These are not design preferences; they are the rules that let the storefront exist.

**The fixed strings.**

- Research-use-only, exact and unaltered, on every page and every product:
  **"For research use only. Not for human consumption."** It renders in the footer base on every route and in
  a notice on every product page, and again as the first half of the announcement bar. It is never shortened,
  never paraphrased, never moved into an image, never set in a size or colour that falls below AA.
- Purity is the literal **`≥99%`** declaration on every product — a specification, not a result. It is never
  a measured figure, never a per-batch number, and never accompanied by a certificate affordance. Every
  surface that shows the figure carries the caveat sentence "The purity value is a product specification,
  not a batch test result." directly beneath it — under the specification table on the product route, and as
  the night band's closing foot line on the landing route — never in a footnote and never detached from what
  it qualifies.
- **Manual crypto only**, by hand, with the buyer pasting a TXID. No card fields, no gateway widget, no
  automated verification claim.
- **The age gate is advisory.** A cookie, not a boundary. Never enforced server-side, never blocking `/admin`
  or any API route.

**The claim rules.**

- No verification theatre: no "tested", "verified", "certified", "accredited", no testing status, no
  per-batch document link, no certificate affordance, and no reference to a document that does not exist in
  this repository.
- No fabricated social proof: no invented metrics, partner logos, press marks, ratings or counts. The three
  directed reviews are the sole exception and are governed by Review Entries.
- No speed or superlative claims without a source — including "unbeatable", "zero issues", "fastest",
  "guaranteed" and "best in class". On every route but the landing, a storefront statement must be
  supportable on request and owner-supplied copy is reviewed before it renders. **The landing route is the
  one recorded exception:** the hero lede and the five ribbon statements render as the owner directed, appear
  in The v5 Landing Exception, and are owner-selected copy rather than substantiated claims — no source,
  measurement or review for them exists in this repository, and none may be asserted. They are not portable:
  no other route may adopt them, and none of them may be cited as precedent or as a general permission.
- **Sourcing and operational copy is classified before it publishes.** The direct-from-source value
  proposition is owner-mandated and stays; every operational or sourcing statement around it is classified as
  supportable, owner-confirmed or unapproved before it renders, and unapproved copy does not ship. Cold-chain
  claims and in-house packing claims are neither sourced nor confirmed, so they do not appear. The landing's
  owner-selected statements are a recorded exception to this classification, not an output of it.
- Nothing implies human use: no dosing, protocols, cycle advice, medical or weight-loss claims, no
  body-composition framing, no before/after or body imagery. The GLP category is a research reference
  category like any other and carries no weight-management language. Plain language does not relax this.
- A batch or lot identifier is a plain product attribute where the catalogue records one. It is never a
  verification badge, never evidence, and never a document link.
- No purity figure inside a review quote, and no review quote that references the body.

**The record rules.**

- `themes/elune/src/data/productSpecs.ts` is the only source for a compound's record, and `scripts/catalog-data.json` is
  the only source for catalogue facts: name, sku, price, quantity and category. Strength is not a field of
  its own — it is embedded in the product name and the SKU, which is why the seeder's fact fields are those
  five and nothing else. The storefront renders exact
  strings: storage is "Store cool and dry, away from direct light", not a paraphrase.
- A field that is not sourced renders no row. GHKCU-50MG carries CAS, purity, form and storage only; it has
  no formula, no molecular weight and no sequence, so those rows do not exist. Nothing is blanked, guessed,
  invented, or labelled pending.
- Prices are USD and render in mono with tabular numerals. Counts are mono. A count is a fact from the
  catalog, not a marketing number.

**Where compliance text lives.** The RUO string appears twice within one screen on the landing page (the
announcement bar and the footer base) around the night band, the product page carries its own notice, and the
purity caveat sits under the specification table on the product page and — on the landing route — as the night
band's closing foot line beneath the reviews, which is the approved v5 position. The figure the caveat
qualifies (`≥99%`) is read in the landing's hero, so the sentence renders on the landing page and on the
product page, never detached from the figure it qualifies. Compliance text is never the quietest thing on the page: it holds at
least the micro step, at least AA contrast, and it is never dimmed below the footer's own body text.

### Assets & Identity

Sources of record are `docs/refs/assets/brand/` for identity and product imagery and `docs/refs/assets/imgs/`
for order photography. Some earlier drafts cited a brand-asset directory that does not exist in this
repository; the paths below are the ones on disk.

| Asset | Use |
|---|---|
| `docs/refs/assets/brand/website_header_logo_transparent.png` (378×188, black on transparent) | The header lockup at 48px display height, `width: auto`; the footer mark at 44px. The highest-resolution header asset in the kit, so 48px is a downscale with no pixelation. |
| `docs/refs/assets/brand/website_header_logo_white.png` (378×188, black on an **opaque white** ground, no alpha) | White-only fallback and print. It is not a white logo: it is the black mark flattened onto a white rectangle, so it must never sit on `--night`, where it would show as a white block. No white-on-transparent lockup exists in the kit, which is why the night band carries no logo at all. |
| `docs/refs/assets/brand/simplified_wordmark_transparent.png` (364×53, transparent) and `…_white.png` (364×53, black on opaque white) | The horizontal wordmark for a compact header or for print, on the same rules as the lockup: the transparent twin on any surface, the `_white` twin never on the band. |
| `docs/refs/assets/brand/favicon_master_moon.png` (87×87) | Master icon. |
| `docs/refs/assets/brand/favicon.ico` and `docs/refs/assets/brand/favicons/favicon-{16x16,32x32,64x64,128x128,256x256,512x512}.png` | The browser-icon family, wired through the store's `favicon` setting so the owner can replace it from admin with no rebuild. |
| `docs/refs/assets/brand/Product-placeholder-vial-night-cap-moon-3-4.jpg` (1792×2376, ≈3:4) | The hero plate photograph — the system's canonical product asset. |
| `docs/refs/assets/imgs/td-1.jpg` (1280×960), `td-2.jpg` (960×1098), `td-3.jpg` (960×1280) | The three directed reviews' order photography, in fixed order, one per review. These are source frames, not pre-cropped plates: `object-fit: cover` in the review's 4:3 well crops nothing from td-1 (already 4:3), about **34%** of td-2's height and about **44%** of td-3's, so the rendered subject is not the whole source file. Alt text must be written against the final crop, describing what actually survives in frame — never against the uncropped file, and never invented from the filename. |

**Asset rules.**

- **Use the approved kit. Never recolour it.** The mark is a pure-black raster with no vector source, so any
  hue applied to it would be a fake; the palette keeps its ink near-neutral precisely so the black mark sits
  natively beside the type and the CTA. No CSS filter, no `mix-blend-mode` recolour, no drop-shadow on the
  logo, no tinted plate behind it.
- **Transparent by default; the `_white` twins are flat print files.** The transparent lockup is the only
  asset that may be placed on a surface. Every `_white.png` in the kit is the black mark flattened onto an
  opaque white ground with no alpha channel — for a white-only fallback and for print — so it is never placed
  on `--night` or over any photograph, where it would read as a white rectangle. Since no
  white-on-transparent artwork exists, **the night band carries no logo**: the review band is type, the motif
  and photography only.
- **Preserve aspect ratio and native resolution.** Frame with `object-fit: cover` inside a fixed-ratio
  container; never letterbox, never distort, never apply a transform crop hack. The hero asset's 0.7542 ratio
  against the figure's 0.75 crops under 0.3% per side, which is why no hack is needed.
- **Photography is confined.** Photography appears only in the hero plate and the three review order shots. A
  catalogue plate carries the authored cutaway, never a photo and never an empty frame.
- **Order photos are order photos.** The review images are customer order shots; the monogram/avatar discs
  that briefly existed are removed and may not return. Faces are never used.
- **Every image carries real alt text** describing its actual subject — no filename, no "image of", no empty
  alt on a meaningful image, and empty alt only on decoration.
- **Illustration is exactly two authored drawings:** the vial cutaway (crimped seal, glass body, lyophilized
  bed) and the cratered disc. No icon library, no illustration set, no stock figures.

### Migration & Retirement

This document is a target, and the migration is part of the specification. Everything below happens in one
pass, because half-migrated tokens are worse than either world.

1. **Tokens.** Declare the Lunar Plates values in `themes/elune/src/pages/all/shadcn.css` `:root` and bind
   them in `themes/elune/src/pages/all/tailwind.css` `@theme inline`. No hex literal in any component.
   **Retire the warm values by slot:** the page ground alias, the three sandy hover/selected/secondary
   surfaces, the three warm hairline slots, the ochre brand token, the ochre GH-releasing accent, and the
   five ink/grey tokens that carry the old warm graphite — the last of these is five slots, not one, and a
   single missed slot leaves old ink live on cards, popovers and secondary surfaces.
2. **Role aliases are repointed, not deleted** (see the table in Colors), so core-rendered surfaces inherit
   the new world: `--primary` and `--ring` become ink, `--primary-foreground` becomes snow, `--accent`
   becomes mist. Deleting them would break cart, checkout and popover chrome that this theme does not own.
3. **Chart tokens — all five, deleted.** The theme consumes none of them: four duplicated the ring and a
   category accent (one of them the retired ochre) and the fifth is unused as well, so the whole `chart-*`
   group goes rather than being re-derived. If a chart surface ever ships it takes colours from the palette
   at that point, with the reason recorded here. Error UI reads `--destructive` directly.
4. **Fonts.** Self-host the Manrope variable woff2 in the existing font directory,
   `themes/elune/public/assets/fonts/manrope-latin.woff2`, beside the JetBrains Mono subset
   (`jetbrains-mono-latin.woff2`), and declare both in `@font-face` blocks in `global.scss`. **Retire the four static sans files and their `@font-face`
   declarations** — they have no light face and cannot render the display step. Verify the variable file's
   axis default (200) is overridden everywhere a weight is inherited.
5. **Identity.** Replace the generated crescent component and the text wordmark with the approved raster kit
   — the transparent lockup on the light chrome, and no logo at all on the night band, because no
   white-on-transparent artwork exists and the `_white` twins are opaque print files — and move the favicon to
   the PNG family, replacing the SVG favicon that hardcoded the retired ochre. No generated mark survives.
6. **Vestigial tokens are deleted.** The band's unused panel token goes — the review card's surface token
   replaces it, and only one of the two exists after this pass. The prototype's `8px` layout-unit token is
   dropped too: it had no consumer, and the 8px unit lives as the layout rule described under Layout rather
   than as a variable nothing reads.
7. **Radii.** Retire the single-base-token radius world (4/6/8/12 steps derived from one value) and the rule
   that forbade pills and capped corners at 8px. Replace with the pill/8/16/32/14 set above, plus the 2px
   focus corner and the quote block's 6px free corners, both stated in prose. The legacy
   base **stays declared as a compatibility alias**: `--radius: 8px` keeps resolving to `--r-ctrl`, because
   core-derived utilities compute their corners from that base and deleting it would collapse them to square
   corners on every surface this theme does not own. It is not re-based to 16px — the derived utilities stay
   where they already are — and every theme-owned component names `--r-pill`, `--r-ctrl`, `--r-card`,
   `--r-sheet` or `--r-inner` explicitly instead of inheriting. Sidebar aliases keep resolving through the
   role tokens; nothing in that chain is deleted.
8. **Elevation.** Retire the "exactly one shadow in the system" rule and replace it with the two-shadow
   vocabulary here (modal sheet, dark-band review card). The flat-by-default statement for light surfaces is
   unchanged.
9. **Notices.** Retire the amber notice exception and its literal warm values; both notices move onto tokens.
10. **Type.** Retire the four-weight static scale and the Tailwind text-size overrides it needed; the step
    table here is the scale, and body is the 1.0625rem step. The landing route keeps the prototype's own
    literal sizes (The v5 Landing Exception, item 2); every other route resolves onto the steps.
11. **Layout.** Retire the previous container, gutter, section and breakpoint set; the shell, the section
    rhythm and the 1080/900/640/400 breakpoints above replace them, and the old header reflow point is
    superseded by the 900px collapse. The landing route keeps the prototype's own band order, grids, gutters
    and paddings (The v5 Landing Exception, item 1).
12. **Footer.** Retire the centred page-link row and the centred compliance lines; the four-column grid
    (brand plus three link columns) and the base row replace them, with every destination preserved.
13. **Copy corrections in the same pass — USDT is Ethereum (ERC-20).** The trust ribbon, the footer Payment
    list, the checkout rail list and every other surface print **USDT (ERC-20)**, and the admin network label
    reads `USDT — Ethereum (ERC-20)`. The superseded `USDT (TRC-20)` / `TRON — TRC-20` strings are corrected
    wherever copy carries them, including the seeded FAQ answer. One core-rendered payment-method label is
    line-clamped, which would clip the network suffix, so that clamp is lifted for the rail list and the
    network suffix always prints in full.
    **Rail migration is a configuration step, not a copy edit:** the stored `crypto_wallet_usdt` value is a
    retired TRON placeholder, and it cannot be reused. The USDT row must be switched to an Ethereum address —
    a real `0x…` address the owner configures in the admin console — and until that happens the rail resolves
    to null and renders as unavailable rather than as a payable address. No placeholder address may be
    presented as payable on any surface.
    **Landing copy follows the v5 instruction rather than the older corrections:** the hero lede and the five
    ribbon statements render as the owner directed, including the inline mono span around "everyone" and the
    delivery and pricing superlatives. The unapproved-superlative removal recorded in earlier drafts does not
    apply to the landing route; on other routes it still does.
    **Status feedback keeps its existing mechanism:** where core already surfaces a toast, the toast stays;
    inline plain text is added only where the design requires the message beside its control — the payment
    panel's copy control and the TXID field — rather than replacing the toast everywhere.
    **Browser surfaces migrate in the same pass:** the selection, caret, scrollbar and focus rules under
    Browser Surfaces land in `themes/elune/src/pages/all/global.scss`, since leaving them behind leaves the
    scrollbar sitting in the retired world. The previous scroll-reveal mechanism is retired with the entrance
    it belonged to, and the old header reflow point is superseded by the 900px collapse (item 11).
14. **Icons and superseded assets.** If the implementation follows the no-icon-library rule above, the
    existing inline icon-library usage is replaced by the four authored SVG paths (chevron, cart, burger, long
    arrow) and the library import plus its dependency go in the same commit. The superseded teal-cap hero
    asset is removed once the night-cap photograph is wired, so no orphan image stays in the tree.
15. **Navigation destinations.** The header carries the seven v5 destinations, with **Payments bound to
    `/faqs`** (the page that answers "How do I pay?"), and the footer's Payment column entries
    (Bitcoin · USDT (ERC-20) · Ethereum) are links to `/faqs` as well. This supersedes the earlier ruling that
    the Payments destination "must not be added": the destination is restored because a truthful page exists
    for it, and the restriction that replaces the old one is that no destination may point at a route that
    does not (`/payments` does not, and must not be linked).
16. **Downstream artifacts.** `.impeccable/design.json` is regenerated from this document, and the homepage
    surface brief under `themes/elune/.impeccable/surfaces/` is amended in the same pass: its single-dark-
    region constraint is resolved as **one** dark region carrying the motif and the directed reviews, its
    no-testimonials constraint and its publication gate are marked superseded by owner direction, its pending
    D1/D2/D3 markers are resolved, and the v5 landing exception is recorded in it. `PRODUCT.md`'s rail label
    becomes `USDT — Ethereum (ERC-20)`, and its stale brand-asset path is corrected. Without these steps the
    briefs ban what the page renders.
17. **This document's own promotion is later work.** `DESIGN.md` is replaced by this file, and the pointers
    to it from `PRODUCT.md` and the design briefs are updated, when the implementation lands. The swap is
    recorded here as implementation work and is deliberately **not** done in this pass, so the shipped
    specification and the proposed one cannot be confused while the build is unmigrated.
18. **Nothing in this pass is shipped until it is reviewed.** The migration status is *in progress*: the
    documents, the surface brief and the sidecar describe the target, and the implemented pages are verified
    against it by review after the build. No document may claim a surface is verified, reviewed or shipped
    before that review has actually happened.

**Deliberately absent.** No hero video, icon library, animation library, new dependency, newsletter or email-
capture band, analytics or third-party tracker in the purchase path, illustration set beyond the two
authored drawings, second typeface family beyond the serif quote, dark theme, gradient, glassmorphism,
search field in the header, or full specification record on the landing route. Shipping copy never promises
cold-chain or in-house packing that a drop-shipper cannot control.

## Do's and Don'ts

### Do:

- **Do** pull every colour, radius, type step and motion value from `shadcn.css`; a component that needs a
  value adds a token there and maps it in `tailwind.css`. No hex literal in a component.
- **Do** keep the light world light: snow canvas, mist bands, white panels — and let tone plus a 1px hairline
  be the depth.
- **Do** hold the whole system to two faces and one exception: Manrope for everything, JetBrains Mono for
  data, the serif italic for a review quote and nothing else.
- **Do** keep the display step at 250 and the headline step at 300. The whisper register is the point.
- **Do** keep mono to codes, chemical values, prices, counts, measures and identifiers — and keep the
  `≥99%` figure in mono wherever it appears inside prose.
- **Do** keep one filled pill per action group, label it with its destination, and make every standalone control at least 44px.
- **Do** use differentiated radii — pill, 8, 16, 32, 14 — and separate surfaces with a 1px token hairline.
- **Do** spend `--beam` exactly three times: selection, a badge fill, a 3px quote bar.
- **Do** render a specification value only when it is sourced, and omit the row otherwise.
- **Do** show a product image only where one exists; a card is complete on name, form, size and price.
- **Do** keep the RUO line on every page and every product, and carry the purity caveat wherever the figure
  sits near the record.
- **Do** keep notice labels inside their notice block, as captions rather than eyebrows.
- **Do** route every second-path action to a text link with a drawn arrow, and keep every arrow a drawn path.
- **Do** make the ribbon pausable by hover and by keyboard, and give it a real reduced-motion form.
- **Do** treat a claim as copy that must be true today and supportable on request.

### Don't:

- **Don't** add a dark theme, a `.dark` class, dark-mode tokens, or a second `--night` region. One bounded
  deep region per page is the ceiling; the inert `dark:` variant in `tailwind.css` is not an invitation.
- **Don't** reintroduce warmth in any form — a cream ground, a sand hover surface, a tan border, an ochre
  accent, a warm grey, a warm illustration. The retired set may not reappear.
- **Don't** add neon, glow, gradient-as-atmosphere, blur-as-decoration, or the lab-cold institutional
  register either. The banned list runs in both directions.
- **Don't** make a verification claim. No "tested", "verified", "certified", "accredited", no testing status,
  no certificate affordance, no link to a document that does not exist.
- **Don't** render a measured purity percentage, a per-batch figure, or `≥99%` styled as a result.
- **Don't** print "Unbeatable delivery rate. Zero issues.", "Best in class factory direct pricing", "Batch
  tracking for each vial" or any other unsourced superlative **on a route other than the landing**. On the
  landing route the owner directed those exact statements and they render as approved copy (The v5 Landing
  Exception) — that direction is the whole of the permission, it does not make the claims substantiated, and
  no other route may adopt them. Elsewhere, make the claim supportable first, or leave it out.
- **Don't** imply published evidence from a lot or batch identifier; it is a plain product attribute.
- **Don't** present the three directed reviews as a precedent: no new invented metrics, partner logos, press
  marks, ratings, counts, avatars or faces anywhere else. And don't describe the shipped reviews as consented,
  order-linked, reviewed or verified — none of that is recorded anywhere.
- **Don't** add dosing, protocols, cycle advice, medical, body-composition or weight-loss framing, or
  before/after and body imagery. The GLP category carries no weight-management language.
- **Don't** paint `--accent` with a category hue — it is the hover/selected **surface** slot. Category hues
  mark identity only, and a real category never renders a fallback hue.
- **Don't** use mono as costume **outside the landing route**: no mono prose, no mono headings, no mono
  buttons, and no mono span around a word that is not a value. The landing's own mono usage, including the
  inline span around "everyone", is the approved exception and travels nowhere else.
- **Don't** put an eyebrow or kicker above a headline, or number something "01 / 02 / 03" unless the number is
  the catalogue's own plate identity.
- **Don't** use a uniform radius, exceed 32px, or add a third shadow.
- **Don't** add a second animation family: no parallax, no scroll effects, no spinner, no shimmer, no
  decorative marquee.
- **Don't** hardcode a hex or a raw radius in a component, and don't extend a retired exception to a new
  surface.

### Governance checklist — every new surface

- [ ] **Light only.** No dark surface, no `.dark`, no dark-mode tokens; at most one bounded `--night` feature
      or proof region on the page, never a theme.
- [ ] **No verification claim.** No testing, certification or accreditation wording, no status badge, no
      certificate affordance. If a document does not exist in this repository, the surface does not reference
      it.
- [ ] **Purity is `≥99%`.** The literal declaration on every product, in mono inside prose, labelled a
      specification, with the caveat sentence wherever the figure sits near the record. Never a measured
      figure, never a per-batch result.
- [ ] **RUO framing is absolute.** The exact string on every page and every product, and no dosing, medical,
      weight-loss or body framing anywhere. The GLP category carries no weight-management language.
- [ ] **Claims are supportable.** Every statement about shipping, delivery, pricing or the catalogue is true
      today; owner-supplied copy has been reviewed; no superlative without a source. **The landing route is
      the one exception**: its hero lede and five ribbon statements are owner-selected copy rendered by
      direction, and their presence there neither substantiates them nor licenses them elsewhere — a new
      surface takes the rule, not the exception, and the exception is requested from the owner if it is wanted.
- [ ] **No invented provenance.** The surface does not assert that a testimonial was consented, order-linked,
      reviewed, tested or verified unless an artifact in this repository says so. Copy the owner chose to run
      is owner-selected copy, and that is all. The landing's owner-selected strings are inventoried with their
      substantiation risk in *Owner-selected copy is not evidence*; a string being fixed, owner-supplied or
      wired into a component does not make it a claim the surface can stand behind, and a code comment that
      hedges it does not either.
- [ ] **Mono only for data.** Codes, chemical values, prices, counts, measures and identifiers. Everything
      else is Manrope.
- [ ] **Tokens come from the token home.** No hardcoded hex or radius in a component; new values are declared
      in `shadcn.css` and mapped in `tailwind.css`. No warm value reappears.
- [ ] **Category accents mark identity only**, and a real category never renders the fallback hue. The
      category name stays textual.
- [ ] **Differentiated radii and the two-shadow vocabulary.** Pill / 8 / 16 / 32 / 14 / 6 / 2, no uniform
      radius, no third shadow, no glow.
- [ ] **One filled pill per action group**, with a destination-naming label; standalone controls are at least 44px and other targets meet the 24px AA floor with the inline-text exception.
- [ ] **Text-led components.** No empty image frame, no placeholder box, and a card complete on name, form,
      size and price.
- [ ] **States are covered.** Rest, hover, focus, pressed, selected, disabled, loading, empty, error and
      success all resolve from the state vocabulary, and meaning is never carried by colour alone.
- [ ] **Accessibility holds.** AA on every text pair, AA non-text contrast where a boundary is the only
      affordance, a visible focus ring on every interactive element, a real label per field, real alt text
      per image, a `<main>` landmark, and one `<h1>` in heading order.
- [ ] **Motion is the system's motion.** The single entrance, the hover transitions, and the pausable ticker —
      and nothing else. Reduced motion removes all of it and leaves the content reachable.
- [ ] **WCAG AA on the snow ground and on the white panel.** Any new pair is checked against both, and on the
      band against `--night` and `--night-surface`.
