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

**Specification Status:** Approved target system (derived from v5 landing prototype `docs/design/mockups/elune-landing-mockup-v5.html` and normative prose `docs/design/mockups/DESIGN-mockup-v5.md`). Migration into `themes/elune` is in progress.

- **Token Home:** Raw `:root` variables declared in `themes/elune/src/pages/all/shadcn.css`. Tailwind v4 bindings in `themes/elune/src/pages/all/tailwind.css` (`@theme inline`). Browser-surface rules in `themes/elune/src/pages/all/global.scss`. No component introduces raw hex or radius literals.
- **Scope:** Entire storefront theme — landing, catalog (`/all`), `/new-releases`, individual category pages, product pages, cart, checkout, payment, confirmation, account/guest surfaces, CMS pages (`/faqs`, `/shipping`, `/contact`), notices, forms, and browser surfaces. Core EverShop admin console is core-rendered and outside theme scope; age gate never blocks `/admin` or `/api`.
- **Closed Architectural Decisions:** Manrope display/body; single bounded `--night` feature band; `--beam` accent (strictly 3 allocations); value ribbon ticker; night-cap hero photo; differentiated radii; dark review card shadow; directed 3-review set; manual crypto rails (Bitcoin, USDT on Ethereum ERC-20, Ethereum).

---

## 1. Overview & Core Principles

**Creative North Star: "Lunar Plates."** A storefront behaving like a catalogue of scientific plates: object and record share the first viewport at equal scale. A specimen plate on a pale table under a clear night sky. The surface is light because the scene is light. The night sky appears exactly once as a bounded feature band; the overall system is strictly light.

The record is the interface. Compound name, form, size, price, and purity declaration form the primary content. One accent colour is spent on badges, selection, and small emphasis; separation elsewhere relies strictly on tone and 1px hairlines.

### Explicit Rejections
- **No Neon Biohacker Aesthetic:** No phosphor-on-black, glow, gradients as atmosphere, or monospace as costume.
- **No Lab-Cold Institutionalism:** No clinical blue-grey styling or generic stock laboratory imagery.

### Key Characteristics
1. **Light-Only:** Exactly one deep region permitted per page: the `--night` feature/proof band. No dark theme, `.dark` class, or dark-mode token set exists on any surface.
2. **One Chromatic Authority:** `--night` acts as ink, button fill, focus ring, caret, and band ground. It is never decorative.
3. **One Vivid Accent:** `--beam` is spent strictly three times: document selection background, badge fill (`chip-beam`), and 3px quote bar. Never a region background, body text, or button fill.
4. **Five Identity Hues:** Category accents color category names, arrows, 1px identity marks, and plate ID strings only. Never buttons, prices, badge containers, or headers.
5. **Differentiated Radii:** Pill controls (999px), 8px fields/panels, 16px cards/menus, 32px hero sheet, 14px inner figures, 2px focus ring corners. Uniform radius and radii >32px are forbidden.
6. **Flat on Light Side:** Depth is purely tonal (`--snow` → `--mist` → `--panel`) plus 1px hairlines. No shadows, blurs, or gradients on the light side. Exactly two shadows exist in the system (modal sheet and dark-band review card).
7. **Mono is Data:** JetBrains Mono carries codes, chemical values, prices, counts, and measures — never general prose or headings.
8. **Truthful Sourced Records:** `themes/elune/src/data/productSpecs.ts` is the sole specification source; unsourced fields render no row at all.

---

## 2. Color Palette & Tokens

Declared in `shadcn.css` `:root` and exposed via `@theme inline` in `tailwind.css`. **No hex literal inside any component.**

### Normative Palette

| Token | Hex | Role | Contrast Ratios (WCAG 2) |
|---|---|---|---|
| `--snow` | `#F7F8FA` | Page canvas. Cool near-white; never pure white or cream. | `--night` on snow: **14.75:1** |
| `--panel` | `#FFFFFF` | Cards, menus, hero sheet, form fields, and strip surface. | `--night`: **15.67:1**, `--slate`: **5.94:1** |
| `--mist` | `#ECEFF3` | Alternating bands, hover/selected fills, announcement bar. | `--night`: **13.59:1**, `--slate`: **5.15:1** |
| `--hairline` | `#DBDFE6` | 1px borders and dividers on light surfaces. | Decorative only (1.26:1 on snow, 1.16:1 on mist) |
| `--ash` | `#B7BDC9` | Disabled chrome, hero sheet edge, arrow rest state, rest link underline. | `--night` on ash: **8.31:1**; 1.77:1 on snow |
| `--night` | `#16233C` | Primary chromatic authority: text ink, button fill, ring, caret, band ground. | on snow: **14.75:1**, on mist: **13.59:1**, on panel: **15.67:1** |
| `--slate` | `#5A6479` | Secondary text: nav, ledes, spec labels, meta, footer headings, scrollbar thumb. | on snow: **5.59:1**, on mist: **5.15:1**, on panel: **5.94:1** |
| `--beam` | `#CFF26F` | Vivid accent: text selection, badge fill (`chip-beam`), 3px quote bar. | `--night` on beam: **12.38:1** |
| `--accent-glps` | `#1F6FA8` | GLPs identity. | on snow: **5.07:1**, on panel: **5.39:1** |
| `--accent-bioregulators` | `#4A3A9C` | Bioregulators identity. | on snow: **8.32:1**, on panel: **8.84:1** |
| `--accent-recovery` | `#0F6E68` | Recovery identity. | on snow: **5.73:1**, on panel: **6.09:1** |
| `--accent-gh-releasing` | `#7A3E86` | GH Releasing identity. | on snow: **6.91:1**, on panel: **7.34:1** |
| `--accent-other` | `#4E5870` | Other identity. | on snow: **6.69:1**, on panel: **7.11:1** |
| `--night-muted` | `#C3CEE4` | Secondary text on night band (tinted from hue, never grey). | on night: **9.90:1**, on `--night-surface`: **6.19:1** |
| `--night-rule` | `#33415F` | Rules and borders on the night band. | Decorative only (1.54:1 on night, 1.04:1 on card) |
| `--night-surface` | `#394459` | Review card surface (1.6:1 tonal step from night band ground). | on snow: **9.21:1**, beam bar: **7.73:1** |
| `--destructive` | `#A32A1F` | Semantic error states and cancellation only. Never decoration. | on snow: **6.80:1**, on panel: **7.22:1** |

```css
/* Night surface definition in shadcn.css */
--night-surface: #394459;                                        /* fallback literal */
--night-surface: color-mix(in srgb, var(--night) 85%, #fff 15%); /* authored value */
```

### Semantic Role Aliases

| Alias | Target Primitive | Purpose / Scope |
|---|---|---|
| `--background` | `--snow` | Page root background |
| `--foreground`, `--card-foreground`, `--popover-foreground`, `--accent-foreground`, `--secondary-foreground` | `--night` | Ink across cards, popovers, and controls (all five slots) |
| `--card`, `--popover` | `--panel` | Card, popover, and menu surfaces |
| `--primary` | `--night` | Primary button fill and active authority |
| `--primary-foreground` | `--snow` | Primary button text |
| `--accent`, `--secondary`, `--muted` | `--mist` | Hover/selected surface slot and muted bands |
| `--muted-foreground` | `--slate` | Secondary text and spec labels |
| `--border`, `--divider`, `--input` | `--hairline` | 1px boundary lines |
| `--ring` | `--night` | Focus ring outline color |
| `--destructive` | `#A32A1F` | Error and cancellation (`--destructive-foreground`: `--snow`) |

### Palette Governance Rules
- **The One-Chromatic-Authority Rule:** `--night` is the sole authority for text, fills, ring, caret, and band ground. Never use brand hues for hover/active surfaces (`--accent` remains `--mist`).
- **The Beam-Is-Spent-Three-Times Rule:** `--beam` appears strictly on document selection background, `chip-beam` badge fill, and the 3px review quote bar. Never used for button fills, region backgrounds, body text, or hover states. If beam is dropped, the system cleanly defaults to achromatic.
- **The Category-Accent-Is-Identity Rule:** Category accents colour category names, arrows, 1px identity marks, and plate ID strings. Never apply to buttons, prices, headers, or entire cards. Textual names must always accompany colour.
- **The Decorative-Only Rule for Hairlines:** `--hairline` (1.26:1 on snow, 1.16:1 on mist), `--ash` (1.77:1), and `--night-rule` (1.54:1 on night, 1.04:1 on card) are tonal separators. Any control relying solely on its boundary for affordance must use `--night`.
- **No Second Brand Colour:** The identity mark is a monochrome black raster. No second brand colour exists.

---

## 3. Typography

- **Display, Body, & Labels:** Manrope, variable 200–800 (`themes/elune/public/assets/fonts/manrope-latin.woff2`). Self-hosted woff2, no CDN.
  - *Critical Axis Rule:* Variable axis defaults to `200`. Explicitly declare `font-weight: 400` on body and every element inheriting without weight.
- **Mono:** JetBrains Mono, variable (`themes/elune/public/assets/fonts/jetbrains-mono-latin.woff2`).
- **Quote:** System serif stack (`Georgia, "Times New Roman", serif`), italic. Review quotes only.

### Type Scale Hierarchy

| Step | Size / Line-Height | Weight | Tracking | Usage & Limits |
|---|---|---|---|---|
| **Display** | `clamp(2.5rem, 4.6vw, 4rem)` / 1.06 | 250 | −0.022em | Homepage hero offer line only. Max 1/page. `text-wrap: balance`, no kicker. |
| **Headline** | `clamp(1.75rem, 2.9vw, 2.5rem)` / 1.12 | 300 | −0.018em | Section & route titles (`h2`s, categories, catalogue, "From recent orders."). Max 24ch on night band. |
| **Title** | 1.25rem / 1.3 | 400 | −0.01em | Card names, product titles, category cell names, spec section headings. |
| **Lede** | 1.125rem / 1.62 | 400 | 0 | Hero lede (48ch) and section intros (56ch). `--slate`. |
| **Body** | 1.0625rem / 1.6 | 400 | 0 | Descriptions, checkout copy, record values, prose. (Steps down to `1rem` at ≤640px). Max 72ch. |
| **Label** | 1rem / 1.4 | 500 | 0 | Primary pill labels and text links. |
| **Label-sm** | 0.9375rem / 1.4 | 500 | 0 | Nav links, footer links, menu rows, ribbon items, compact buttons, spec labels. |
| **Name** | 0.9375rem / 1.35 | 600 | 0 | Review author name. (System maximum weight ceiling). |
| **Micro** | 0.8125rem / 1.4 | 500 | 0 | Hero proof line, small print, notice body, error messages. (Weight 400 in footer base). |
| **Caption** | 0.75rem / 1.3 | 500 | +0.03em | Pill/chip labels, cart count badge, internal notice caption labels. Never an eyebrow. |
| **Caption-mono** | 0.75rem / 1.3 | 500 | +0.03em | JetBrains Mono for `chip-beam` badge text. |
| **Mono** | 0.8125rem / 1.5 | 400 | +0.015em | JetBrains Mono. Chemical data, SKUs, counts, wallet addresses, dates. Tabular numerals. |
| **Price** | 1.0625rem / 1.2 | 400 | +0.01em | JetBrains Mono with tabular numerals. |
| **Quote** | 1.05rem / 1.55 | 400 italic | 0 | Review quotes in serif stack. |

### Prototype Literal Sizes Resolution
Literal off-step sizes from the landing prototype are approved for landing only; all other routes snap to the nearest standard step:
- Nav `15.5px` → `label-sm`
- Small print `13.5px` → `micro`
- Spec labels `14.5px` → `micro`
- Cart count `11px` → `caption`
- Button `16px` → `label`
- Review meta `13.6px` → `mono`
- Sheet foot link `14px` → `label-sm`

### Typography Rules
- **The Mono-Is-Data Rule:** JetBrains Mono is restricted to data: chemical parameters (CAS, formula, MW, sequence), prices, counts, measures, and IDs (SKU, lot, wallet, TXID, date). Never for labels, headings, buttons, or prose. The landing hero lede carries the sole exception for the word "everyone".
- **Inline Mono in Prose:** When mono glyphs appear inside prose (e.g. `≥99%`), lock font size to the sentence via `.lede .mono { font-size: 1em }`.
- **The Steps-Are-The-Scale Rule:** All sizes must map to standard steps. Whisper weights (Display 250, Headline 300) are signature. Interface emphasis tops out at 600 (review author name).
- **The Declaration-Not-Measurement Rule:** Purity value is the literal string `≥99%` on every product — a specification, not a test result.
- **The Arrows-Are-Drawn Rule:** All arrows are inline SVGs (`currentColor`, `aria-hidden`) translating 3px on hover over 220ms. Unicode glyph arrows (`→`, `»`, `›`) are strictly forbidden.

---

## 4. Layout, Spacing, & Grids

- **Base Rhythm:** 8px base unit. Card padding: 16px. Element gap: 8px. Grid gutter: 20px. Section rhythm: `clamp(56px, 7vw, 96px)`. Component interiors fit optically (pills `14px 24px`, chips `5px 12px`, category cells `24px 22px 22px`).
- **Container Shell:** `width: min(1200px, 100% - 48px)`, centred. Gutter reduces to 32px at ≤900px. Content never bleeds outside shell except the night band moon motif.
- **Zero Overflow Floor:** Zero horizontal overflow at 390px viewport width.
- **Section Rhythm:** Standard: `padding-block: clamp(56px, 7vw, 96px)`. Night band override: `clamp(36px, 4.5vw, 56px)` top, `clamp(32px, 4vw, 48px)` bottom. Catalogue grid has `padding-top: 0` under the category strip.

### Grids Table

| Region | Grid Template | Gap / Margins |
|---|---|---|
| **Header nav** | `1fr auto 1fr` | 24px gap, min-height 74px |
| **Hero** | `1.04fr .96fr` | `clamp(32px, 4vw, 64px)` gap; `padding-block: clamp(48px, 6vw, 84px)` |
| **Hero sheet body** | `.78fr 1.22fr` | 18px gap |
| **Category strip** | `repeat(5, 1fr)` in 16px-radius container | 1px internal dividing rules |
| **Catalogue plates** | `repeat(4, 1fr)` | 20px gap |
| **Review set** | `repeat(3, 1fr)` | 20px gap, `margin-top: 36px` |
| **Footer** | `1.4fr 1fr 1fr 1fr` | 32px gap |
| **Section head** | Flex, `align-items: flex-end` | 24px gap, `margin-bottom: 36px`, wrapping |

### Measures and Ratios
- Hero sheet photograph: framed **3:4**
- Review order photograph: framed **4:3**
- Inner figure radius: **14px** (both hero figure and review photo wells)
- Column architecture: Desktop 12, Tablet 8, Mobile 4. Collapses to 1-col at 900px (hero, review set) and 640px (plates, category cells, hero sheet body, footer).

### Responsive Breakpoints

| Query | Key Structural Changes |
|---|---|
| **≤1080px** | Nav link gap 18px / font 15px; catalogue plates 2-up; category strip 2-up (reset left rules on odd cells, top rule from 3rd cell). |
| **≤900px** | Shell gutter: 32px; hero collapses to 1-col (36px gap); nav links hidden in favour of 44×44 pill disclosure; footer 2-up; review set 1-up. |
| **≤640px** | Body step drops to `1rem`; catalogue plates 1-up; category strip 1-col (top rule per cell, none on first); announcement bar left-aligned (6px gap); moon motif resizes to 400px and repositions; hero actions tighten to 18px gap; hero sheet body 1-col (16px gap, caption free to grow); spec rows keep 11px padding; hero pill and link full-width centred; footer 1-up. |
| **≤400px** | Header compact "Shop all" pill hidden to prevent 360px overflow. |

---

## 5. Elevation, Depth, & Shapes

### Elevation
- **Light Surfaces are Flat:** Separation achieved purely through tone (`--snow` → `--mist` → `--panel`) and 1px `--hairline` borders. No shadows, blurs, or gradients on the light side.
- **Two Permitted Shadows in Entire System:**
  1. **Modal Sheet:** `0 8px 24px rgba(22, 35, 60, .22)` (tinted ink) over 95% scrim (age gate).
  2. **Dark-Band Review Card:** `0 8px 24px rgba(0, 0, 0, .22)` on the night band.
- All other surfaces use `shadow-none` and `ring-0`.

### Radii Tokens

| Family | Token | Value | Consumers |
|---|---|---|---|
| **Pill** | `--r-pill` | `999px` | Buttons, badges, chips, count badge, scrollbar thumb |
| **Control** | `--r-ctrl` | `8px` | Inputs, textareas, inline controls, form/payment panels, menu rows, legacy `--radius` alias |
| **Card** | `--r-card` | `16px` | Catalogue plate cards, category strip container, menu panels, review cards, age-gate sheet |
| **Sheet** | `--r-sheet` | `32px` | Hero Plate 01 sheet only (system maximum ceiling) |
| **Inner Figure** | `--r-inner` | `14px` | Hero figure well, review order photograph (`overflow: hidden`) |
| **Focus Ring** | `--r-focus` | `2px` | Focus outline corners |
| **Review Quote** | *Authored* | `0 6px 6px 0` | Asymmetric radius on review blockquote (flush against 3px beam left bar) |

- **Compatibility Radius:** Base `--radius: 8px` remains declared as an alias resolving to `--r-ctrl` to support core-derived utilities.
- **Borders:** Strictly 1px tokens: `--hairline` (light surfaces), `--ash` (hero sheet edge & card hover), `--night-rule` (dark band). No 2px or decorative double borders.
- **Clipping:** Strictly confined to hero figure (14px), review photo (14px), and night band moon motif (clipped by band).

---

## 6. Components Specification

### Buttons
- **Primary Pill:** Full pill (`--r-pill`), `--night` fill, `--snow` text, 1px transparent border, no shadow, min-height 44px, padding `14px 24px`, icon gap 10px, weight 500 (`label` step).
  - *Hover/Pressed:* Inverts to `--panel` fill, `--night` text, 1px `--night` border. Arrow stays translated 3px. No scaling or lifting.
  - *Budget:* Exactly one primary filled pill per action group (header, hero, card action group, checkout summary).
- **Compact Variant:** `10px 18px` padding, `label-sm` step, min-height 44px. Header "Shop all" and age gate "Enter".
- **Secondary Actions:** Underlined text link (1px underline, `text-underline-offset: 4px`, `--ash` rest → `--night` hover) with drawn SVG arrow translating 3px. Never a slate-filled button.
- **Labels:** Destination-naming ("Browse the catalogue", "Shop Recovery", "View compound"). Never "Learn more" or "Submit".
- **Disabled State:** `--ash` chrome, `--night` text (8.31:1 contrast), `cursor: not-allowed`. Checkout submit maintains ink fill while pending.
- **Focus:** Universal 2px ring. A button never draws a second ring.

### Links & Header Navigation
- **Header:** Sticky, `--snow` ground, 1px `--hairline` bottom rule, 74px height, `1fr auto 1fr` grid. Approved transparent logo at 48px display height (`width: auto`, aspect preserved, `alt=""`, accessible brand link).
- **7 Destinations:** Home · New releases · Shop · FAQs · Shipping · Contact us · Payments.
  - *Payments Link Rule:* Binds to `/faqs` (where crypto payment is explained). Never link to `/payments`.
- **Shop Disclosure:** Native `<details>/<summary>`, `--panel` surface, `--r-card` (16px), rows at `--r-ctrl` (8px) with mono counts, clearing 44px target. Holds 5 categories in fixed domain order (`glps`, `bioregulators`, `recovery`, `gh-releasing`, `other`). Scripted Escape and outside-click handlers required. Drawn SVG chevron.
- **Mobile Menu (≤900px):** 44×44 pill disclosure button in right cluster carries 7 destinations + 5 categories + "All products". Below 400px header filled pill hides.
- **Cart Button:** 44×44 pill, hairline border (escalates to `--night` on hover with `--panel` fill), drawn SVG cart path. Absolute count badge at top-right (`min-width: 18px`, `height: 18px`, `padding: 0 4px`, pill, `--night` fill, `--snow` mono caption, `aria-label="Cart, N items"`). Target 44×44px.
- **Nav Links:** `label-sm`, weight 500, ink. 1.5px bottom border (transparent rest → `--night` hover over 160ms).
- **In-card Links:** Compound name in ink → `--night` hover; category name in category accent; plate ID in accent.
- **Favicon:** PNG family wired through store `favicon` setting.

### Cards
- **Catalogue Plate (Product Card):** `--panel` fill, 1px `--hairline`, `--r-card` (16px), 16px padding, flex column. Border turns `--ash` on hover.
  - *Anatomy:* Head row (plate number neutral pill chip left, mono ID in category accent right) → Authored vial cutaway SVG in `--slate` (`role="img"`, `aria-label="Cutaway diagram of a sealed vial: crimp seal, glass body, lyophilized powder"`) → Product name (`title` step) → Mono form · size line (`--slate`) → Foot row (`margin-top: auto`, hairline top rule, mono price left, "View" text link right; on `/all` grid, renders compact "Add to cart" pill).
- **Hero Plate Sheet:** `--panel` fill, 1px `--ash` edge, `--r-sheet` (32px), 16px padding.
  - *Anatomy:* Head row (`chip-beam` plate number left, mono ID right) → Body (`.78fr` column with 3:4 photo, 14px inner radius; `1.22fr` column with `<dl>` hairline-separated spec rows, `label-sm` `--slate` labels, ink mono values, 12px vertical padding, no rule under last row) → Foot row (category · strength chip + "View compound" link above hairline).
- **Category Cell:** Single `--r-card` (16px) container (`overflow: hidden`), 5 cells divided by 1px hairlines.
  - *Cell Anatomy:* Category name in category accent (`title` step), foot row with mono count in `--slate` and drawn arrow (opacity 0.85 rest → 1.0 + 3px translate hover). Hover fill: `--mist`. Count stays `--slate` on panel ground.
- **Review Card (Dark Band):** `--night-surface` fill, 1px `--night-rule`, `--r-card` (16px), 24px padding, dark shadow (`0 8px 24px rgba(0,0,0,.22)`). Flex column.
  - *Anatomy:* `<blockquote>` (serif italic quote step, `--snow`, `padding: 12px 16px`, transparent ground, 3px `--beam` left bar, `border-radius: 0 6px 6px 0`) → `<figcaption>` 20px below (author name at `name` step 600 in `--snow`, mono order meta in `--night-muted`: city, state abbreviation, month and year) → Order photograph direct sibling 20px below (4:3 ratio, 14px inner radius, 1px `--night-rule`, `object-fit: cover`).
- **Flush Panels:** Form/control panels (crypto wallet, TXID) use `--r-ctrl` (8px). Menus use `--r-card` (16px). Payment panels are never `--r-card`.
- **No Empty Frames:** Always render authored cutaway SVG if no photo exists; omit absent images cleanly. No placeholder boxes or "image coming soon".

### Form Inputs & Fields
- **Style:** `--panel` fill, 1px `--hairline` stroke, `--r-ctrl` (8px) radius, `padding: 0.625rem 0.75rem`, ink text (`body` step), `--slate` placeholder, `--night` caret. Min 44px touch target.
- **Focus:** Universal focus ring (2px solid `--night` at 2px offset). No custom shadow or dual-border rings.
- **Error State:** 1px `--destructive` stroke, micro error message directly below starting with plain words. No red fill; no shake animation.
- **Labels:** Explicit `<label>` above field, `label-sm`, ink.
- **Textarea:** Same styling; 3 rows for TXID field.
- **Disabled State:** `--ash` chrome with `--night` label.

### Notices & Compliance Components
- **Notice Blocks:** `--mist` panel, `--r-ctrl` (8px), 1rem padding, `--night` micro text, uppercase caption label inside block (never an eyebrow). Used for product RUO notice and age gate notice. Amber exception retired.
- **About This Compound:** Product page section (`ProductDescription.tsx`) between price and spec table. Title step heading (not "Product Description"), 1–2 plain paragraphs, un-ruled literature block with disclaimer: documents external research, not this batch; no CoA published. Omitted entirely for Epitalon and CJC-1295 entries.
- **Specification Table:** Real `<table>` with `sr-only` caption and `<th scope="row">` labels (40% width, `--slate`, regular, `label-sm`). Mono used for chemical data (CAS, formula, MW, sequence); sans body for form, purity, storage. 11px row padding, 16px column gap, 1px hairline borders. Unsourced rows omitted cleanly.
  - *Mandatory Caveat:* "The purity value is a product specification, not a batch test result." directly below table in `--slate` micro text.
- **Age Gate:** First-visit modal sheet on `--snow`, 1px `--hairline`, `--r-card` (16px), max-width 32rem, 1.5–2rem padding, modal shadow (`0 8px 24px rgba(22, 35, 60, .22)`), 95% scrim.
  - *Content:* Title "Are you 18 or older?" (`#age-gate-title`), research chemical notice, confirmation sentence, compact pill "I am 18 or older — Enter", text link "Cancel — Leave", 30-day advisory cookie footnote.
  - *Behaviour:* `role="dialog"`, `aria-modal="true"`, `aria-labelledby="age-gate-title"`, focus trapped, `.elune-lock` scroll lock, cookie `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax`. Client-side advisory only; never blocks `/admin` or `/api`.

### Crypto Payment Panel
- **Layout:** Flush `--panel` card, 1px `--hairline`, `--r-ctrl` (8px), shadow-none, ring-zero. Order total above wallet list.
- **Accepted Rails:** Bitcoin (native SegWit), USDT — Ethereum (ERC-20), Ethereum (ERC-20). Network label: `USDT — Ethereum (ERC-20)`.
- **USDT ERC-20 Fail-Closed Rule:** `crypto_wallet_usdt` must match a 40-hex Ethereum address (`^0x[0-9a-fA-F]{40}$`). Unset, TRON (`T…`), or placeholder values resolve to null and render: **"Not configured — contact us before sending."** with **no Copy control**.
- **Addresses & Copy:** Mono at `mono` step, `overflow-wrap: anywhere`, 44px pill "Copy" control. Fallback: textarea + `execCommand`.
- **TXID Capture:** Flush panel with 3-row textarea storing hash on order shipping note.
- **Manual Flow:** Orders remain `pending` until owner confirms payment in admin. No automated verification claims or certificate affordances.

### Announcement Bar
- 38px `--mist` band above header, `--slate` micro text, space-between flex row (tightens to left-aligned with 6px gap at ≤640px).
- Copy: **"For research use only. Not for human consumption."** and **"Prices in USD · Guest checkout"**.

### Value Ribbon
- Full-bleed `--snow` band between hero and categories, 1px hairline bottom rule, `overflow: hidden`.
- Items: `label-sm`, line-height 1.4, `--slate`, `15px 28px` padding, 1px `--hairline` left divider, `white-space: nowrap`.
- Motion: 64s linear infinite ticker drift. Pauses on hover and keyboard focus (`tabindex="0"`, `role="region"`, `aria-label`). Duplicate set is `aria-hidden`.
- Reduced Motion: Halts drift, hides duplicate set, enables native horizontal scroll (`overflow-x: auto`).
- Approved Landing Statements:
  1. "Tracked & discreet, flat rate shipping"
  2. "Bitcoin, USDT (ERC-20), and Ethereum Accepted"
  3. "Batch tracking for each vial"
  4. "Best in class factory direct pricing"
  5. "Unbeatable delivery rate. Zero issues."
  *(Note: Statements 3–5 are owner-selected landing exceptions and do not transfer to other routes without operational proof).*

### Hero & Plate Sheet
- `--mist` band, `padding-block: clamp(48px, 6vw, 84px)`. Grid `1.04fr .96fr`.
- Copy Column: Display headline (no kicker), lede in `--slate` (48ch), action row (1 filled pill + 1 text link), proof line ("Extensive catalog across 5 core research categories").
- Headline: "Research peptides. Direct from the source. Uncompromising purity."
- Lede: Owner-selected copy with inline `.mono` spans for `≥99%` and "everyone".
- Plate 01: Hero sheet with 3:4 branded vial photograph (`Product-placeholder-vial-night-cap-moon-3-4.jpg`, `object-fit: cover`).
- Purity Caveat (Landing Position): Closes the night band directly below the transparency foot: **"The purity value is a product specification, not a batch test result."**

### Review Entries (Night Band)
- Single bounded `--night` band above footer. Cratered-disc SVG motif (concentric crater rings + 4 dots in `currentColor` at 16% opacity, `aria-hidden`, `pointer-events: none`, bleed off right edge, resizes to 400px at ≤640px).
- Heading: "From recent orders." (`headline` step, max 24ch).
- Grid: 3 review cards (`repeat(3, 1fr)` at 20px gap, 36px below heading, 1-up at ≤900px).
- Copy Restrictions: Product quality and ordering experience only. No medical, dosing, body, or purity claims.
- Privacy Treatment: First name + last initial, city + state abbreviation, month and year. No avatars or faces; customer order photos at 4:3.
- Transparency Foot: **"Collected from completed orders and published unedited. Names shortened to first name and last initial."** (`micro` step in `--night-muted`, 64ch, 28px below grid).
- Purity Caveat (Landing Position): Closes the night band directly below the transparency foot: **"The purity value is a product specification, not a batch test result."**

### Footer
- `--snow` ground, 1px hairline top rule, `padding-block: 56px 40px`. Grid: `1.4fr 1fr 1fr 1fr` (32px gap).
- Col 1 (Brand): Approved mark at 44px display height (`alt=""`, `aria-hidden`), 18px gap, positioning line.
- Column Headings: `micro` at weight 500 in `--slate`, 14px below.
- Links: `label-sm` in ink, escalating to `--slate` on hover; 10px between rows.
- Link Columns:
  - **Catalogue:** All products, New releases, 5 categories.
  - **Information:** Home, FAQs, Shipping, Contact us.
  - **Payment:** Bitcoin, USDT (ERC-20), Ethereum (all link to `/faqs`).
- Base Row: 48px above, 22px padding-top, 1px hairline rule, space-between flex row, micro step in `--slate`. Left: "For research use only. Not for human consumption." Right: `© 2026 Elune Labs · Prices in USD` in mono.

---

## 7. Pages & Routes

- **`/all` (Catalogue Grid):** Every product, alphabetical by name, served by `extensions/elune-catalog/`. Renders 4-up grid of catalogue cards carrying price and compact "Add to cart" pill.
- **`/new-releases`:** Newest 6 by catalog order, served by `extensions/elune-catalog/`.
- **CMS Pages (`/faqs`, `/shipping`, `/contact`):** Editable in admin console with no rebuild. Render page prose at lede/body steps inside shell, with no cards, no icon rows, and no decorative panels. Heading-plus-paragraph structure (no CMS disclosures required).
- **Category Routes:** Catalogue plate grid at 4-up with category heading in `--night` ink. Category accents appear only inside cards (plate ID + product name), never on headers or container fills.
- **Product Page:** Hero-sheet-scale record anatomy, About This Compound, specification table, RUO notice, and one filled pill for primary action. Author vial cutaway SVG if no product photography exists.
- **Cart:** Hairline-separated flush rows, mono quantities and prices, order total above fold of summary, one primary filled pill to check out, `--destructive` reserved for real errors.
- **Checkout:** Guest checkout is default and only required path. Three distinct steps: 1) Contact, 2) Flat-rate shipping, 3) Crypto payment (wallet panel + TXID field). Order summary carried forward. Account surfaces (sign-in, register, order history) inherit styling via semantic role aliases.
- **Confirmation:** Displays order state, payment instructions status, TXID, and RUO line. Renders with `payment_status` at `pending`. No celebratory color, confetti, or timeline graphic. Max one `--night` region.

---

## 8. Browser Surfaces

Declared in `themes/elune/src/pages/all/global.scss` and `shadcn.css`:
- **Text Selection:** `::selection { background: var(--beam); color: var(--night); }` (12.38:1 contrast).
- **Caret:** `caret-color: var(--night);`.
- **Firefox Scrollbar:** `scrollbar-color: var(--slate) var(--snow);` (holds 5.59:1 non-text contrast floor).
- **WebKit Scrollbar:** 12px track in `--snow`, `--slate` thumb with 4px snow border and pill radius.
- **Keyboard Focus Ring:** `2px solid var(--night)` outline with 2px offset (4px on links), 2px corner radius. Universal across links, buttons, summaries, fields. Swaps to `--snow` on night band.
- **Text Links:** Underline thickness 1px, `text-underline-offset: 4px`, `--ash` at rest → `--night` on hover.
- **Numeric Figures:** `font-variant-numeric: tabular-nums;` globally applied to prices, counts, spec values, meta lines, and wallet addresses.

---

## 9. Homepage Composition

The landing page follows an owner-locked 8-part sequence:
1. **Announcement Bar:** RUO line + USD/guest line.
2. **Sticky Header:** Brand lockup, 7 destinations + Shop disclosure, cart, 1 filled pill.
3. **Hero + Plate 01:** Primary offer line, lede, CTA, and Plate 01 sheet.
4. **Value Ribbon:** 64s infinite ticker commitments.
5. **Categories:** 5-cell container strip in fixed domain order.
6. **Catalogue Plates:** 4-up catalogue grid under section head.
7. **Night Band:** Cratered-disc motif, 3 directed reviews, transparency foot, and closing purity caveat line.
8. **Footer:** Brand, 3 link columns (Catalogue, Information, Payment), base compliance row.

*Architecture Distinction:* Section order, band set, and region rhythms constitute **homepage composition**. The tokens, type steps, radii, state vocabulary, card anatomies, button/link rules, notices, record rules, and accessibility floor constitute the **global design system** binding every route.

---

## 10. State Vocabulary

| State | Visual Treatment | Assistive Tech / Interaction Rules |
|---|---|---|
| **Rest** | 1px `--hairline` (light) / 1px `--night-rule` (dark). No shadows. | Default accessible names and semantic landmarks. |
| **Hover** | Controls invert to `--night` border/text (pills invert to `--panel` fill). Surfaces escalate tonally (cards to `--ash` border, category cells to `--mist` fill). | Never adds shadows, scales, or shifts layout. |
| **Focus-visible** | 2px solid `--night` outline at 2px offset (4px on links), 2px radius. Swaps to `--snow` on night band. | Never suppressed; never simulated by color alone. |
| **Pressed** | Hover appearance held; arrow held translated 3px. | No scale or darkening effects. |
| **Selected / Active** | `--mist` fill with `--night` text for menus, select rows, and active routes. | `aria-current="page"` or `aria-selected="true"`. |
| **Disabled** | `--ash` chrome, `--night` label (8.31:1 contrast), `cursor: not-allowed`. Submit keeps ink fill while pending. | `aria-disabled="true"`. |
| **Loading** | Static skeleton blocks: `--mist` on `--snow`, `--night-rule` on `--night`. | No shimmers or spinners. Set `aria-busy="true"`. |
| **Empty** | Bare `--mist` panel: title heading, `--slate` body line, text link exit. | No illustrations or fake statistics. |
| **Error** | 1px `--destructive` border and micro message directly below starting with plain words. | `aria-invalid="true"`, `aria-describedby`. |
| **Success** | Delivered via ink text and copy statements. No green accents or confetti. | Status updates announced cleanly. |

---

## 11. Motion & Transitions

- **Page Entrance (`rise`):** Content rises 14px and fades in over **660ms** on `cubic-bezier(.16, .84, .44, 1)`. Stagger: **70ms** per item (`--d: 0 / .07s / .14s …`). Applied to hero copy, sheet, cards, review cards. Active only under `prefers-reduced-motion: no-preference`.
- **Hover Transitions:** Color and border over 160ms; arrow 3px translate over 220ms; menus and category arrows over 140–180ms.
- **Ticker Drift:** 64s linear infinite drift. Pauses on hover and focus.
- **Reduced Motion:** `prefers-reduced-motion: reduce` removes entrance animation, halts ticker, and enables native horizontal scroll (`overflow-x: auto`). Entrance neutralized under `print`.
- **Banned:** Parallax, scroll-jacking, spin loaders, shimmer gradients, and decorative marquees.

---

## 12. Accessibility Floor (WCAG 2.2 AA)

- **Contrast Ratios:** All text pairs ≥4.5:1 (normal) and ≥3:1 (large). Non-text boundaries ≥3:1 where they act as the sole affordance.
  - Ink on snow: 14.75:1; Slate on snow: 5.59:1; Slate on mist: 5.15:1; Category accents on snow/panel: >5:1; Night on beam: 12.38:1; Snow on night: 14.75:1; Night-muted on night: 9.90:1.
- **Touch Targets:** Standalone controls ≥44×44px (cart pill, mobile menu, buttons, form controls). Inline text links follow WCAG 24px exception.
- **Universal Focus Ring:** 2px solid `--night` (or `--snow` on night surfaces) with 2px offset (4px on links).
- **Structure:** Single `h1` per page; no skipped heading levels; landmark hierarchy (`<header>`, `<main>`, `<footer>`). Sections own an `h2`, cards take `title` step, and footer column labels hang beneath a visually hidden `h2`.
- **Text Alternatives:** Real alt text on hero photo, order photos, and cutaway figures (`role="img"` with descriptive aria-label). Decorative SVGs and duplicate ticker sets are `aria-hidden`.
- **Sticky Chrome Offset:** `scroll-margin-top: 112px` on anchor targets (accommodating 38px announcement + 74px header).
- **Disclosure Controls:** Native `<details>/<summary>` with Escape and click-outside scripted handlers.

---

## 13. Content Truth & Compliance Rules

### Exact Required Strings
1. **Research Use Only (RUO):** **"For research use only. Not for human consumption."** (Announcement bar, product notices, footer base). Never alter, shorten, or omit.
2. **Purity Declaration:** Literal **`≥99%`** declaration in mono.
3. **Purity Caveat:** **"The purity value is a product specification, not a batch test result."** (Product spec table and landing night band foot).
4. **Transparency Foot:** **"Collected from completed orders and published unedited. Names shortened to first name and last initial."** (Landing review band).
5. **Age Gate Title:** **"Are you 18 or older?"** (`#age-gate-title`). Controls: **"I am 18 or older — Enter"** and **"Cancel — Leave"**.
6. **Storage Specification:** Literal string: **"Store cool and dry, away from direct light"**.

### Prohibited Copy & Claims
- **No Verification Theatre:** No "tested", "certified", "accredited", testing status badges, or certificate of analysis (CoA) links.
- **No Human-Use or Medical Claims:** No dosing, protocols, cycle guidance, body-composition, or weight-loss claims (applies to GLPs as well).
- **No Unsourced Superlatives Outside Landing:** Claims like "best in class" or "unbeatable" are restricted to the approved landing prototype.
- **Truthful Data Sources:** `themes/elune/src/data/productSpecs.ts` is the sole source for product specs; `scripts/catalog-data.json` is the sole source for catalog facts (name, sku, price, quantity, category). Strength is embedded in name and SKU. Unsourced fields must be omitted entirely.

---

## 14. Assets & Identity

| Asset Path | Native Dimensions | Purpose & Placement |
|---|---|---|
| `docs/refs/assets/brand/website_header_logo_transparent.png` | 378×188 | Header logo at 48px display height; footer mark at 44px. Pure black on transparent. |
| `docs/refs/assets/brand/website_header_logo_white.png` | 378×188 | White-only fallback/print. Black mark on opaque white. **Never place on `--night`.** |
| `docs/refs/assets/brand/simplified_wordmark_transparent.png` | 364×53 | Compact header horizontal mark. |
| `docs/refs/assets/brand/simplified_wordmark_white.png` | 364×53 | Print fallback horizontal mark. |
| `docs/refs/assets/brand/favicon_master_moon.png` | 87×87 | Master brand icon. |
| `docs/refs/assets/brand/favicons/favicon-{16,32,64,128,256,512}.png` | Multi-res | Browser favicon suite. |
| `docs/refs/assets/brand/Product-placeholder-vial-night-cap-moon-3-4.jpg` | 1792×2376 (≈3:4) | Canonical hero Plate 01 product photograph. |
| `docs/refs/assets/imgs/td-1.jpg` | 1280×960 (4:3) | Review 1 customer order photograph. |
| `docs/refs/assets/imgs/td-2.jpg` | 960×1098 | Review 2 customer order photograph (cropped to 4:3 via `object-fit: cover`). |
| `docs/refs/assets/imgs/td-3.jpg` | 960×1280 | Review 3 customer order photograph (cropped to 4:3 via `object-fit: cover`). |

### Asset Usage Rules
- **No Recolouring:** Raster assets are pure black; do not apply filters, tinting, or blend modes.
- **No Logo on Night Band:** Since no white-on-transparent logo exists, the night band carries type, motif, and photography only.
- **Image Framing:** Always use `object-fit: cover` within fixed-ratio containers (3:4 hero, 4:3 reviews).
- **Authored SVGs Only:** Exactly four UI paths (chevron, cart, burger, long arrow) plus two illustrations (vial cutaway diagram and cratered-disc motif). Icon libraries are strictly banned.

---

## 15. Implementation & Migration Directives

### Implementation Checklist
1. **Tokens:** Declare values in `shadcn.css` `:root` and map in `tailwind.css` `@theme inline`. Remove warm/ochre tokens.
2. **Role Aliases:** Repoint `--primary` (`--night`), `--accent` (`--mist`), `--border` (`--hairline`), etc.
3. **Fonts:** Self-host Manrope and JetBrains Mono woff2 in `themes/elune/public/assets/fonts/`. Set body `font-weight: 400`.
4. **Radii:** Implement `--r-pill`, `--r-ctrl` (8px), `--r-card` (16px), `--r-sheet` (32px), `--r-inner` (14px). Retain `--radius: 8px` alias.
5. **Elevation:** Enforce flat light surfaces. Implement only modal sheet and review card shadows.
6. **Crypto USDT:** Enforce ERC-20 regex `^0x[0-9a-fA-F]{40}$`. Fail closed if unconfigured ("Not configured — contact us before sending.").
7. **Navigation:** Bind Payments destination to `/faqs`. Configure native `<details>` with Escape/outside-click handlers.
8. **Compliance:** Lock exact strings (RUO, `≥99%`, purity caveat, age gate copy).

### Key Prohibitions
- Do NOT introduce dark mode, `.dark` class, or a second night band.
- Do NOT use raw hex values or raw radii inside component files.
- Do NOT use `--beam` for buttons, large backgrounds, or body text.
- Do NOT render empty image placeholders or "image coming soon" boxes.
- Do NOT use icon libraries or generic stock photography.
- Do NOT allow auto-scrolling content without hover/focus pause controls.

---

## 16. Do's and Don'ts / Surface Governance Checklist

### Do:
- **Do** pull every colour, radius, type step, and motion value from `shadcn.css` and `tailwind.css`.
- **Do** keep the light world light: snow canvas, mist bands, white panels — with depth achieved by tone plus 1px hairline.
- **Do** hold the entire system to Manrope, JetBrains Mono, and the system serif italic quote.
- **Do** keep Display at 250 and Headline at 300 (whisper register).
- **Do** restrict mono to data: chemical values, prices, counts, measures, and IDs.
- **Do** limit filled pills to exactly one per action group, labelled with destination.
- **Do** enforce differentiated radii: pill, 8px, 16px, 32px, 14px.
- **Do** allocate `--beam` strictly three times: selection, `chip-beam` badge, 3px quote bar.
- **Do** omit unsourced specification rows cleanly.
- **Do** show product images only where real assets exist; catalogue cards are complete on name, form, size, and price.
- **Do** include the exact RUO line on every page and product, and the purity caveat adjacent to the purity declaration.
- **Do** keep notice labels inside notice blocks as captions, never eyebrows.
- **Do** route secondary actions to underlined text links with drawn SVG arrows.
- **Do** make tickers pausable by hover and keyboard focus with full reduced-motion fallback.

### Don't:
- **Don't** add a dark theme, `.dark` class, or a second night band.
- **Don't** reintroduce warm tones (cream ground, sand fills, tan borders, ochre accents).
- **Don't** add neon, glow, gradients, blur decoration, or clinical lab-cold styling.
- **Don't** make verification claims ("tested", "certified", "accredited", CoAs).
- **Don't** render measured purity percentages or per-batch figures.
- **Don't** use unsourced superlatives ("unbeatable", "zero issues", "best in class") outside the landing exception.
- **Don't** include dosing, medical, cycle advice, body-composition, or weight-loss claims (including GLPs).
- **Don't** paint `--accent` with a category hue (it is the `--mist` surface slot).
- **Don't** use mono for prose, headings, or buttons outside the landing exception or others allowed by the creator.
- **Don't** add kickers/eyebrows above headlines.
- **Don't** exceed 32px radius or add a third shadow.
- **Don't** add secondary animation families (no parallax, scroll-jacking, spin loaders, shimmers).
- **Don't** hardcode hex or radius values in components.

### Surface Governance Checklist (Every New Surface)
- [ ] **Light Only:** No dark theme; max one bounded `--night` region per page.
- [ ] **No Verification Claims:** No testing/certification claims, badges, or missing document links.
- [ ] **Purity is `≥99%`:** Specification declaration in mono; adjacent caveat sentence included.
- [ ] **RUO Framing:** Exact RUO string present; zero medical/weight-loss framing.
- [ ] **Supportable Claims:** Every operational claim verified; unsourced superlatives banned.
- [ ] **Mono for Data Only:** Codes, chemical values, prices, counts, measures, and IDs only.
- [ ] **Tokens from Token Home:** No hardcoded hex or raw radii.
- [ ] **Category Accents for Identity Only:** Accents never paint buttons, headers, or whole cards.
- [ ] **Differentiated Radii & Two Shadows:** Strictly follow tokenized radii and 2-shadow limit.
- [ ] **One Filled Pill Per Action Group:** Destination-naming labels; min 44px touch targets.
- [ ] **Text-Led Components:** No empty image frames or placeholder boxes.
- [ ] **Complete States:** Rest, hover, focus, pressed, selected, disabled, loading, empty, error, success handled.
- [ ] **WCAG AA Compliance:** Text contrast ≥4.5:1, non-text ≥3:1, universal focus ring, semantic landmarks (`h1`, `h2`, `<main>`).
- [ ] **Approved Motion Only:** Single entrance (`rise`), hover transitions, pausable ticker with reduced motion fallback.
