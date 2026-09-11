---
name: "Elune Labs Design System (Warm Paper)"
description: "Light-only storefront design system for Elune Labs — warm paper ground, graphite ink, one evergreen action color, five muted category accents."
colors:
  background: "#faf9f7"
  foreground: "#1f1d1a"
  card: "#ffffff"
  card-foreground: "#1f1d1a"
  popover: "#ffffff"
  popover-foreground: "#1f1d1a"
  primary: "#14604a"
  primary-foreground: "#ffffff"
  brand-ochre: "#8a5a1c"
  accent: "#f2efe9"
  accent-foreground: "#1f1d1a"
  secondary: "#f2efe9"
  secondary-foreground: "#1f1d1a"
  muted: "#f2efe9"
  muted-foreground: "#6b6558"
  border: "#e5e0d8"
  divider: "#e5e0d8"
  input: "#e5e0d8"
  ring: "#14604a"
  destructive: "#a32a1f"
  destructive-foreground: "#ffffff"
  accent-glps: "#1c5f96"
  accent-bioregulators: "#6b4f9e"
  accent-recovery: "#0f6b6b"
  accent-gh-releasing: "#9a6414"
  accent-other: "#5c6270"
  chart-1: "#14604a"
  chart-2: "#1c5f96"
  chart-3: "#6b4f9e"
  chart-4: "#9a6414"
  chart-5: "#a32a1f"
typography:
  display:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.011em"
  headline-lg:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.011em"
  headline-sm:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.011em"
  title:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.011em"
  body:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-large:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  micro:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  caption:
    fontFamily: "'Titillium Web', system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.05em"
  mono:
    fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  2.5: "0.625rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  12: "3rem"
  16: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, #14604a 90%, transparent)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1rem"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 0.75rem"
    typography: "{typography.label}"
  card-product:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  card-category:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  nav-link:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
  notice-ruo:
    backgroundColor: "#fffbeb"
    textColor: "#451a03"
    rounded: "{rounded.md}"
    padding: "1rem"
    typography: "{typography.micro}"
---

# Design System: Elune Labs (Warm Paper)

**Document status:** Shipped. Every value below is read from the running theme — the token home is
`themes/elune/src/pages/all/shadcn.css`, the Tailwind binding is
`themes/elune/src/pages/all/tailwind.css`, and the browser-level rules are in
`themes/elune/src/pages/all/global.scss`. This file replaces the previously shipped dark
specification, which the owner rejected; nothing from that world is normative here.

## Overview

**Creative North Star: "The Warm Paper Counter"**

Elune Labs sells research reference peptides to people who are not scientists. They arrive
skeptical of this category's sellers, and what reassures them is not atmosphere — it is a precise
product and a clear statement about what is documented. The interface is therefore a counter, not
a campaign: a warm paper ground, white panels laid on it, one evergreen action, and the paperwork
— the specification — kept right beside the goods.

The ground is paper, not screen. It is a warm near-white (`#faf9f7`) with a yellow cast that reads
as stationery; ink is a warm graphite (`#1f1d1a`) rather than black, which takes the harshness out
of dense specification text. White panels (`#ffffff`) sit visibly above that ground on a single
warm hairline (`#e5e0d8`) — the separation is tonal and structural, never a shadow. There is
exactly one saturated color in the working interface: a deep evergreen (`#14604a`) that carries the
primary action, the focus ring, text selection and the caret. Everything else is warm neutral or
one of five deep, muted category accents that mark identity — never mood.

Typography is two faces with strictly divided work. Titillium Web, a humanist grotesque with some
warmth and slightly squared terminals, speaks for the brand; JetBrains Mono appears only where
data must align, which means chemical values, prices and identifiers. Density is comfortable and
generous: a 1200px measure, 1rem gutters, 1.25rem card padding, and a lot of white space left
alone.

**Explicit rejection, on record.** This world refuses three registers: the hype-and-countdown
supplement page, the neon biohacker terminal, and the lab-cold institutional presentation that
reads as intimidating or fake to the people who actually buy here. The dark world previously
specified in this file is rejected and retired: no obsidian ground, no glow palette, no
per-category accent trio, and no rule from it survives here.

**Key Characteristics:**
- Light only. No dark surface exists anywhere in the storefront, and no `.dark` class is ever
  applied to the DOM.
- One action color: evergreen is the only saturated color in the chrome.
- Warm neutrals throughout; paper ground, graphite ink, warm-grey hairlines.
- Text-first components: cards are complete on name, size, spec and price.
- Mono is reserved for data; the sans face carries every word.
- Depth comes from tone and hairlines, not shadow.

## Colors

A warm-paper palette with a single confident action color and five restrained category accents.
Every value is declared in `shadcn.css` `:root` and exposed to Tailwind through `@theme inline` in
`tailwind.css`; no component introduces its own color.

### Primary
- **Deep Evergreen** (`#14604a`): the only saturated chrome color. Fills primary buttons, the
  focus ring (`--ring`), text selection, the text caret, and the hover state on linked product
  names. With white text it holds 7.50:1, and it holds 7.12:1 against the ground.
- **Evergreen on White** (`#ffffff`): the text color inside an evergreen fill.

### Secondary
- **Warm Ochre** (`#8a5a1c`): the brand's second color, used on the wordmark's "LABS" and on warm
  detail only. It is deliberately *not* wired to Tailwind's `accent` slot (see The
  Hover-Surface-Is-Not-The-Brand Rule below). It holds 5.61:1 on the ground.

### Tertiary
Five muted, deep accents mark the five categories, keyed by the catalog's `url_key`. Each is dark
enough to be legible as text on the paper ground and none is a fallback to another color.
- **GLPs — Deep Blue** (`#1c5f96`): 6.38:1 on the ground.
- **Bioregulators — Muted Violet** (`#6b4f9e`): 6.17:1 on the ground.
- **Recovery — Deep Teal** (`#0f6b6b`): 5.98:1 on the ground.
- **GH Releasing — Warm Ochre** (`#9a6414`): 4.74:1 on the ground — the tightest of the five and
  the reason the set cannot be lightened further.
- **Other — Slate** (`#5c6270`): 5.81:1 on the ground.

A category accent is identity, not decoration: it appears as the category's own name in a listing
or card, and nowhere else.

### Neutral
- **Warm Paper** (`#faf9f7`): the page ground. Never replaced by pure white.
- **Panel White** (`#ffffff`): cards, modals, the offer band, and form field fills.
- **Graphite Ink** (`#1f1d1a`): all primary text, at 15.98:1 on the ground.
- **Warm Grey** (`#6b6558`): secondary and supporting text — nav links, trust statements, spec
  labels, the footer compliance line. 5.50:1 on the ground, 5.79:1 on a panel.
- **Recessed Sand** (`#f2efe9`): the one recessed surface, shared by `--secondary`, `--muted` and
  `--accent`. Used for the hover/selected surface of menus, selects and rows, and for quiet
  secondary buttons.
- **Warm Hairline** (`#e5e0d8`): every border, divider and input stroke, always 1px.
- **Deep Red** (`#a32a1f`): destructive only — form errors and cancellation. 7.22:1 with white.
- **Chart tokens** (`--chart-1…5`): carried from the EverShop core surface set (evergreen, deep
  blue, muted violet, warm ochre, deep red). No storefront surface consumes them; they are listed
  so the palette's declared set stays complete.

Contrast is a constraint, not an outcome: every text token above is at or above 4.5:1 on the paper
ground, and the five category accents were verified as a set before any of them shipped.

### Named Rules

**The Evergreen-Is-Action Rule.** `--primary` is reserved for the primary action, the focus ring,
text selection and the caret. It is not a decorative color, not a heading color, and not a border
color. Its rarity is what makes the button findable.

**The Hover-Surface-Is-Not-The-Brand Rule.** Tailwind maps `--color-accent: var(--accent)`, and
core `ui/*` paints that token as the hover and selected *surface* of menus, selects and rows.
`--accent` is therefore the warm recessed sand (`#f2efe9`) and must stay that. Brand ochre lives in
`--brand-ochre` instead; painting `--accent` ochre would tint every hover state in the storefront.

**The Category-Accent-Is-Identity Rule.** Category accents appear only on the category they name.
They never color a button, a price, a badge container or a section. A category's fallback must
never be what a real category renders as.

## Typography

**Display Font:** Titillium Web (with `system-ui`, `-apple-system`, `BlinkMacSystemFont`,
`"Segoe UI"`, `sans-serif`)
**Body Font:** Titillium Web (same stack)
**Label/Mono Font:** JetBrains Mono (with `'SF Mono', Consolas, Menlo, monospace`)

**Character:** One warm humanist grotesque for the brand's voice and one monospace for its data.
Titillium Web replaces the Inter default that this brief explicitly rejects — the neutral default
with no point of view — and its slightly squared terminals carry the technical register without
going cold. JetBrains Mono is decisive at small sizes, which is where the specification lives.

Both faces are self-hosted latin subsets served from the theme's static directory
(`themes/elune/public/assets/fonts/`), declared with `@font-face` in `global.scss`. There is no
third-party font request. Three static Titillium weights are loaded — 400, 600 and 700 — and no
`unicode-range` is set, so a glyph the subset lacks (the `≥` in the purity declaration, for
instance) falls through the stack to the system face rather than rendering as a missing-glyph box.

### Hierarchy
- **Display** (600, 1.875rem rising to 3rem from 768px, 1.1, -0.025em): the homepage offer line
  only. One per page.
- **Headline** (600, 1.875rem, rising to 2.25rem from 768px, 1.2, -0.011em): page and section
  titles. Section headings on the homepage step down to 1.5rem.
- **Title** (600, 1.25rem, 1.2, -0.011em): the specification section heading and sub-sections.
- **Body Large** (400, 1.125rem rising to 1.25rem, 1.625): the offer band's supporting sentence.
- **Body** (400, 1rem, 1.5): product descriptions, notices, checkout copy, specification values.
- **Label** (600, 0.875rem, 1.25): nav links, button labels, trust statements, form labels and
  inputs, the footer line.
- **Micro** (400, 0.75rem, 1.3): category counts, the product card's spec and identity lines, and
  notice body text. Notice *labels* are uppercase at 11px with wider tracking — a caption inside a
  notice, never a standalone eyebrow above a headline.
- **Mono** (400, 0.75rem–1.125rem): chemical values, prices and identifiers. Prices are mono at
  1.125rem with 600 weight; wallet addresses are mono at 0.875rem and break across lines.

### Named Rules

**The Mono-Is-Data Rule.** The monospace face appears only on chemical data (CAS registry number,
molecular formula, molecular weight, sequence), prices, and identifiers (SKU, lot, wallet address,
category product count). It never carries a label, a heading, a button or body prose. If a string
is a word rather than a value, it is not mono.

**The Three-Weights Rule.** The interface is built from 400, 600 and 700 only — the three static
weights that are actually loaded. 600 is the emphasis weight for headings, buttons and prices. 700
is the ceiling for interface emphasis and is reserved for the age-gate title and the wordmark. The
wordmark asks for more weight than the loaded set provides, so the browser synthesizes it from 700;
that gap is recorded drift, not a fourth weight, and no new surface should rely on it.

**The Declaration-Not-Measurement Rule.** The purity value is the literal string `≥99%` on every
product. It is a placeholder declaration, never a measured figure, never a per-product number, and
never styled as a result. A specification value that is not sourced is omitted from the record
entirely — no dash, no empty cell, no "pending".

## Layout

Spacing runs on Tailwind's 4px unit (1 = 0.25rem), unmodified — the theme does not override the
spacing scale. The steps the storefront actually uses are 0.25, 0.5, 0.625, 0.75, 1, 1.25, 1.5, 2,
3 and 4rem, applied as: 0.25–0.5rem inside a control, 0.625–0.75rem for control padding, 1–1.25rem
for card and panel padding, 1.5rem between sibling cards, and 2–4rem for section rhythm.

The page measure is a single container, `.page-width`: max-width 1200px, centred, with a 1rem
gutter rising to 1.5rem from 1024px. The offer band is a two-column grid from 1024px
(`1.05fr 1fr`) and stacks below it, with the vial plate bleeding toward the band's right edge.
Category and featured grids are 2-up from 640px and 4-up (featured) / 5-up (categories) from
1024px. The specification table uses a 40% label column with the values taking the remainder.

Breakpoints are Tailwind's defaults, also unmodified: `sm` 640px, `md` 768px, `lg` 1024px, `xl`
1280px. The theme adds two structural media rules of its own — the header reflows below 768px, and
the container gutter widens from 1024px.

Density is comfortable but never airy for its own sake. Below 768px the header dissolves its
wrapper so the wordmark and icons keep the first line and the five category links take a full-width
second line that wraps whole labels rather than breaking them mid-name. The footer is tightened to
its actual content: the core's five reserved widget areas stay in the DOM at zero height, but the
reserved padding and margin are removed so no empty grey band separates the catalog from the
compliance line.

## Elevation & Depth

**The system is flat by default; hairlines do the separating.** Depth is tonal — the paper ground,
the recessed sand, and white panels — and structural: a single 1px warm hairline marks every edge.
Cards, category tiles and the specification record carry no shadow at all, and a checkout card
explicitly cancels both shadow and ring. One element in the whole storefront is lifted: the age-gate
panel, which floats above a scrimmed ground. It is the modal, so it is the exception, and there is
no second exception.

### Shadow Vocabulary
- **Modal panel** (`shadow-lg` tinted to `rgba(31, 29, 26, 0.05)` via `shadow-foreground/5`; the
  theme does not override Tailwind's `--shadow-lg`): the age-gate panel only. The tint is the ink
  color at 5%, so the lift stays warm rather than grey.
- **None** (`shadow-none`, `ring-0`): the explicit resting state for panels that would otherwise
  inherit a core shadow, such as the TXID card on checkout.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest and there is exactly one shadow in the
system, on the modal panel. A new shadow — a hover lift, a "premium" card, a glow — is not an
addition to this vocabulary; it is a change to the world and needs the owner's decision.

## Shapes

Corners are small and consistent: the whole system derives from one radius token, `--radius`
(0.5rem / 8px), and Tailwind computes its steps from it. Containers — product cards, category
tiles, the modal panel — take `rounded-lg` (8px, the base token), and so do form fields, which are
styled at the token level with `border-radius: var(--radius)`. Buttons and the smaller chrome built
with Tailwind classes take `rounded-md` (6px, `calc(var(--radius) - 2px)`). `rounded-xl` (12px)
exists for larger shells and is unused by these surfaces; the 4px step appears exactly once, on the
age gate's inner notice block. Tailwind's `2xl`–`4xl` also derive from the same base and are unused
here.

Nothing is rounder than 8px, nothing is a pill, and nothing is clipped or masked except the offer
band's plate, which is cropped by the band edge rather than by a shape. Borders are always 1px of
`--border`; there are no 2px outlines, no double rules, and no angled or offset geometry. Imagery
inside a card carries the same small radius as its container.

**The 8px Ceiling Rule.** No corner in this storefront exceeds 8px. The full pill is not used
anywhere in this world; anything rounder or softer reads as toy-like and belongs to another one.

## Components

Components are warm, plain and text-led. Each one below is the shipped component, named by its
file.

### Buttons
- **Shape:** small radius, `rounded-md` (6px). No shadow, ever.
- **Primary:** evergreen fill (`--primary`), white text, `text-sm font-semibold`, padding
  `0.75rem 1.5rem` for the offer CTA and `0.625rem 1.25rem` for the age gate. Used for exactly one
  action per view: the offer CTA, "Add to Cart", "Place Order", the age gate's continue.
- **Hover:** the fill drops to 90% opacity (`hover:bg-primary/90`) over 150ms, colors only.
- **Secondary / Outline:** transparent fill, 1px `--border` stroke, warm-grey label that shifts to
  ink on hover with a recessed-sand fill. Shipped in the age gate's "Decline & Exit".
- **Disabled:** 50% opacity with a not-allowed cursor; the checkout submit keeps its evergreen fill
  while disabled rather than greying out, so the pending state still reads as the action.

### Links & Navigation
- **Header nav:** five category links in fixed domain order (`glps`, `bioregulators`, `recovery`,
  `gh-releasing`, `other`), `text-sm font-medium` in warm grey, shifting to graphite ink on hover.
  No underline, no active pill, no color change to evergreen.
- **In-card links:** a product name in graphite ink that turns evergreen on hover
  (`hover:text-primary`); a category name in its own category accent.
- **Wordmark:** `ELUNE` in graphite at the heavy end of the loaded range with a wide 0.28em
  tracking, `LABS` in brand ochre — the only place brand ochre appears in the interface. The core
  demo logo is suppressed so the wordmark is the sole mark in the header.

### Cards
- **Product card:** white panel, 1px warm hairline, `rounded-lg` (8px), 1.25rem padding, no shadow.
  Name in graphite (`text-base font-semibold`), a mono micro line for size and form, a mono price
  at 1.125rem, and a mono identity line carrying `≥99% · SKU`. Hover raises the border to 40%
  graphite; nothing moves.
- **Text-led, always:** the product catalog ships no images, so the image element is rendered only
  when a product actually has one. A card is complete on name, size, spec and price — there is no
  empty frame and no placeholder box.
- **Category card:** the same panel with the category name in its accent and a mono product count
  in warm grey; used on the homepage's five-up category row.
- **Notice / flush panel:** the checkout wallet panel is a white panel on a hairline with
  `rounded-md`; the sand surface appears only where a control is hovered or selected.

### Inputs & Fields
- **Style:** white fill (`--card`), 1px `--border` stroke, radius `var(--radius)` (8px, matching
  containers), padding `0.625rem 0.75rem`, ink text, warm-grey placeholder at 70% opacity.
- **Focus:** the border shifts to evergreen and a 1px evergreen ring is added by box-shadow
  (`0 0 0 1px var(--primary)`), over 150ms. Form fields keep this treatment and are deliberately
  excluded from the outline focus ring below, so they never show two rings at once.
- **Text area:** same family; the TXID capture field is three rows and accepts the on-chain hash.
- **No error styling ships yet** beyond the destructive token being available; nothing in the
  storefront currently renders it.

### Notices
Two notice blocks ship, both compliance surfaces, both a hairline-bordered panel with micro body
text and a small uppercase label inside the block: the product page's research-use-only notice
(`rounded-md`), and the research chemical notice inside the age-gate panel, which uses the system's
single 4px step. The product page carries "Laboratory Research Notice (RUO)"; the age gate carries
the research chemical notice that precedes its confirmation sentence. These are the one place in
the storefront where the color comes from Tailwind's amber palette rather than the token home — a
documented exception, not a precedent to extend.

Notice labels are captions. They sit inside the block they belong to and never float above a
headline as a standalone eyebrow.

### Specification Table
The product page renders the analytical record as a real `<table>` with an `sr-only` caption and a
`<th scope="row">` for each label — no decorative panel, no definition-list-as-grid.
- **Labels:** warm grey, regular weight, left-aligned, 40% width, top-aligned.
- **Values:** ink, with mono applied to the chemical values (CAS, formula, molecular weight,
  sequence); form, purity and storage stay in the sans face.
- **Density:** 0.625rem vertical padding per row and a 1rem gap before the value column, set by
  utilities over the core base table's 0.313rem. Each cell keeps the base table's 1px warm hairline
  border, so the record reads as a ruled label sheet rather than a floating list.
- **Absent values vanish:** rows without a value are filtered out, and a SKU with no record renders
  no specification section at all.

### Age Gate
A modal on first storefront visit (advisory only, 30-day cookie, client-side by design).
- **Shape:** white panel, `rounded-lg` (8px), max-width 32rem, 1.5–2rem padding, the system's only
  shadow, over a 95%-opaque paper scrim.
- **Content order:** the question, the research chemical notice, the confirmation sentence, then the
  actions — primary "I am 18 or older — Continue" and outline "Decline & Exit".
- **Behaviour:** focus moves into the panel on open and cycles inside it; the body scroll is locked.
  The gate never blocks `/admin` or API routes and is not a security control.

### Crypto Payment Panel
The payment step shows the order total above a definition list of wallet addresses (BTC native
SegWit, USDT TRC-20, ETH ERC-20), all inside one white panel with a hairline border.
- **Addresses:** mono, 0.875rem, breaking across lines, each with a small outline "Copy" button.
- **Copy fallback:** the storefront is served over plain http on a LAN/tailnet address, where
  `navigator.clipboard` does not exist, so the textarea + `execCommand` path is the real one; a
  toast reports failure.
- **TXID capture:** a separate card with a 3-row text area, stored on the order's shipping note.
  The wallet addresses and instructions are edited in the admin console and take effect immediately.

### Browser Surfaces
The palette reaches the places Tailwind does not paint, from the token home in `shadcn.css`:
- **Text selection:** evergreen fill with white text.
- **Caret:** evergreen.
- **Scrollbar (Firefox):** warm hairline thumb on the paper track.
- **Keyboard focus ring:** `2px solid var(--ring)` with a 2px offset on links, buttons, summaries,
  `[role="button"]` and `[tabindex]`. Form fields are excluded — they use their border-plus-ring
  focus treatment instead.

## Do's and Don'ts

### Do:
- **Do** pull every color, radius and font from `shadcn.css`; a component that needs a value adds a
  token there and maps it in `tailwind.css`.
- **Do** keep the ground warm paper and panels white; the tonal step is the depth.
- **Do** keep mono to chemical data, prices and identifiers, and keep every word in Titillium Web.
- **Do** keep corners at 6px for buttons and small chrome and 8px for containers and form fields,
  and separate surfaces with a 1px warm hairline.
- **Do** keep exactly one evergreen action per view, and let it be the only saturated chrome color.
- **Do** render a spec value only when it is sourced; omit the row otherwise.
- **Do** show a product image only when the product has one; a card must be complete without it.
- **Do** keep notice labels inside their notice block, as captions rather than eyebrows.
- **Do** keep the RUO line on every page and every product — "For research use only. Not for human
  consumption."

### Don't:
- **Don't** add a dark surface, a `.dark` class, or a dark-mode variant. The storefront is light
  only; the inert `dark:` variant in `tailwind.css` is not an invitation.
- **Don't** reintroduce neon, glow, gradient, blur-as-decoration, or a neon-terminal register — or
  its inverse, the lab-cold institutional register.
- **Don't** make a verification claim. No "tested", "verified", "certified", "accredited", no
  testing status, no certificate affordance, and no link to a document that does not exist.
- **Don't** render a measured purity percentage. Purity is the literal `≥99%` placeholder on every
  product; never a precise figure, never a per-batch result.
- **Don't** add dosing, protocols, cycle advice, medical or weight-loss claims, or before/after and
  body imagery anywhere. The GLP category is a research reference category like any other.
- **Don't** present batch identity as a verification badge; a lot number is a plain product
  attribute.
- **Don't** paint `--accent` with a brand hue — it is the shadcn hover surface for menus, selects
  and rows. Brand ochre is `--brand-ochre`.
- **Don't** hardcode a hex in a component, or extend the amber notice exception to a new surface.
- **Don't** add a shadow, a pill, or a radius above 8px.

### Governance checklist — every new surface
- [ ] **Light only.** No dark surface, no `.dark`, no dark-mode tokens.
- [ ] **No verification claim.** No testing, certification or accreditation wording, no status
      badge, no certificate affordance. If a document does not exist in this repository, the
      surface does not reference it.
- [ ] **Purity is `≥99%`.** The literal declaration placeholder, on every product. Never a measured
      figure, never a per-batch result.
- [ ] **RUO framing is absolute.** No dosing, medical, weight-loss or body framing; the GLP category
      carries no weight-management language. Plain language does not relax this.
- [ ] **Mono only for chemical data, prices and identifiers.** Everything else is Titillium Web.
- [ ] **Tokens come from `shadcn.css`.** No hardcoded hex in a component; new values are declared in
      the token home and mapped in `tailwind.css`.
- [ ] **Category accents mark identity only**, and a real category never renders the fallback color.
- [ ] **Text-led components.** No empty image frame; a card is complete on name, size, spec and
      price.
- [ ] **WCAG AA on the paper ground.** Any new text/background pair meets 4.5:1, checked against
      `#faf9f7` and against white panels.
