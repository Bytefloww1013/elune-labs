# Design Brief — Elune Labs Landing Redesign ("Moonlab")

**Status:** Mockup for review. `DESIGN.md` is untouched; on approval this brief promotes to
`DESIGN.md` + `.impeccable/design.json`, and the mockup becomes the hero blueprint.
**Viewport target:** `themes/elune/src/pages/homepage/Elune.tsx` (visitor mode: **Persuade**).

## 0. Direction decision record

Concept roll `a66cc2b1` assigned candidate **5** of the grounded seven; the challengers dealt
with it are judged below. The old warm-paper world is evidence, not authority: it is retired
by the owner's own banned list (warm paper, tans, browns) and this brief replaces it.

**Grounded candidates (resonance order):**
1. The CoA-as-editorial document — the specification record worn as the whole surface. *(pick; rejected as lead: drifts toward the rejected specimen-archive register)*
2. The lunar atlas — literal sky/moon iconography. *(literal subject artifice; spent as texture inside #5, not the lead)*
3. Blockchain-explorer clarity — hash typographic discipline. *(folded into mono rules)*
4. Consumer-wellness vernacular (Hims/Seed cadence). *(folded; keeps approachability)*
5. **Moonlab** — Seed's botanical-clinical discipline re-keyed from forest/lime to Elune's lunar sky. **(assigned — built)**
6. Bench notebook — ink structure diagrams over white. *(decorative risk; discipline kept: one authored illustration moment)*
7. Broadsheet hairlines — ruled editorial grid. *(folded into trust-row and table rulings)*

**Challengers weighed (both axes = audience identification + product clarity):**
- *Neo-Tokyo neon night* — **declined**: dark ground violates the binding light-only commitment. Raise kept: one burning central accent → the single vivid Aurora punctuation.
- *Greiman hybrid collage* — **declined**: angled type ramps fail readable hierarchy. Raise kept: strict layering axes → the flat grid.
- *CRT oscilloscope* — **declined**: phosphor-on-black fails the light scene. Raise kept: instrument readout discipline → mono strictly for data/measurement.
- *WebGL shader portal* — **declined**: deep-hue ground again. Raise kept: thin, exact uppercase labels only where they earn it.
- *Mesophotic deep dive* — **declined**: darkening abyss. Raise kept: one vertical axis ruling rhythm.
- *Versailles bosquets* — **declined**: gravel buff and gilt are the banned tan/brown family. Raise kept: axial symmetry → centered footer and band alignment.

Each raise is paid into the system below; one world owns the page.

**Thesis.** A conventional storefront wearing clinical-journal discipline: near-monochrome
lunar-sky palette, whisper-light display type, and one vivid accent saved for badges. It
refuses the category's hype terminals and equally refuses lab-cold institution — confidence
comes from the specification record, not from atmosphere.

**Stack audit integration.** Tokens map 1:1 into `themes/elune/src/pages/all/shadcn.css` and
are bound to Tailwind v4 in `tailwind.css` (current convention preserved). Fonts self-hosted
under `themes/elune/public/assets/fonts/` (current convention preserved). EverShop 2.2.1 core
is presentation-only; no engine change needed.

---

## 1. Design Tokens

### Color

93% achromatic + one vivid accent, re-keyed to lunar sky. All values in `:root` of `shadcn.css`.

| Token | HEX | Role | Contrast on ground |
|---|---|---|---|
| `--night` | `#232148` | Chromatic authority as **ink only**: primary text, button fills, focus ring,
 selection, caret, code-chip outlines. **Never a surface or band** (light-only is binding). | 14.42:1 |
| `--snow` | `#F8F9FB` | Page ground ("Lunar Snow" — never pure white) | — |
| `--panel` | `#FCFDFE` | Card/modal surface one tier above ground | — |
| `--mist` | `#ECEEF3` | Secondary surface: alternating bands, muted separators, hover fills | night 13.08:1 |
| `--aurora` | `#9EF5D3` | **Vivid accent — badges and emphasis only, never backgrounds, never body text** | night text on it 11.90:1 |
| `--grey` | `#5A5C73` | Muted text (nav, trust lines, spec labels) | 6.20:1 |
| `--hairline` | `#D9DBE4` | 1px borders/dividers, cool | — |
| `--ash` | `#B4B6C2` | Disabled chrome only (never readable text) | — |
| `--destructive` | `#A32A1F` | Errors/cancel only | 6.85:1 |
| Category: GLPs | `#1C5F96` celeste | identity on category name only | 6.38:1 |
| Category: Bioregulators | `#6B4F9E` iris | identity | 6.16:1 |
| Category: Recovery | `#0F6B6B` teal | identity | 5.98:1 |
| Category: GH Releasing | `#7A3D8F` plum | identity | 6.89:1 |
| Category: Other | `#4E5870` slate | identity | 6.75:1 |

Banned chroma: no warm paper/ochre/sand anywhere (replaces `#faf9f7/#8a5a1c/#f2efe9/#e5e0d8`
warm set); no purple-blue gradient blobs (flat indigo is fine); gradients and shadow halos
banned outright. Light only — no `.dark` surface, ever.

### Typography

Two faces, strict division (current self-host convention preserved, both faces replaced with intent):

- **Display/Body: Manrope (variable 200–800)** — a semi-geometric grotesk with rounded,
  unmistakable letterforms; it reads as a drawing, not a default. Whisper-light 300–350 on all
  display sizes (24px+); 400 body; 450–500 buttons/labels. Inter was explicitly rejected — the
  incumbent DESIGN.md names it "the neutral default with no point of view" and the detector flags
  it as training-data slop; Manrope's geometry is chosen so the whisper register keeps an own
  personality. Self-hosted; U+2265 (`≥`) verified present in its cmap (the incumbent's fallback
  bug cannot recur). Fallbacks: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- **Data: JetBrains Mono (variable)** — codes (SEMAGLUTIDE-5MG), prices, spec values, hashes.
  Slight positive tracking (+0.015em) for measured tone. The repo's shipped subset is reused.

Scale (px): micro 12/1.0 · label 12/1.5 · caption 14/1.4 · body-sm 16/1.5 · body 18/1.3 ·
subheading 24/1.2 · heading-sm 32/1.5 · heading 36 · heading-lg 40/1.1 · display 48/1.1.
Tracking tightens with size: −0.18px @18 · −0.4px @40 · −0.72px @48 (never below −0.04em equivalent).

### Spacing & Layout

- Base unit **8px**. Page max-width **1200px** with 24px page margins.
- Section gap **64–96px** (generous; breathing room is the brand's quiet).
- Card padding **16px** · element gap **8px** · grid equal-gutters 16px.

### Radius & Elevation

Differentiated on purpose (optical balance, not uniform):

| Element family | Radius |
|---|---|
| Badges & identity chips (code pills) | **999px** — the only pill semantics |
| Buttons & inputs | **8px** |
| Cards | **16px** |
| Hero sheet panel | **32px** |

**Elevation: none.** Zero drop shadows, zero gradients, no decorative borders. Depth is tonal
contrast (snow/mist/night) or nothing. The age gate keeps the system's single permitted soft
shadow (existing exception, unchanged).

### Browser surfaces (from the skill floor; must ship)

Text selection = aurora fill on night text · caret = night · Firefox scrollbar = hairline thumb
on snow track · focus ring `2px solid var(--night)` offset 2px (inputs use border+ring instead)
· underlines offset consistently.

---

## 2. Component Rules (landing page)

**Announcement bar:** light `--mist` band, night micro text, one honest fact (guest crypto
checkout). No countdowns, no hype.

**Navigation:** sticky, full-width snow background, wordmark left (official
`website_header_logo_transparent.png`), centered links (Home, New Releases, Shop + categories,
FAQs, Shipping, Contact Us), right: rectangular CTA + cart. 1px hairline separator.

**Hero:** full-bleed field — the produced plate (`hero-photo.webp`, provenance in
`hero-photo.webp.json`) covers the band with a snow **sheet panel** (32px radius) carrying the
headline; left-aligned overlay, not a column split. No eyebrow/kicker; the aurora highlight is
a functional marker on the key clause. The panel's flat field keeps the photograph honest and
the text at AA. Filled rectangular CTA + arrow text link.

**Trust row (Value Props):** 4 statements separated by hairlines on snow, not cards-with-icons:
tracked & discreet shipping · BTC/USDT/ETH accepted · form, storage and the ≥99% purity
declaration on every product · research-use-only framing. No certification claims; no badges of
trust.

**Category cards:** five-up row; flat panel, 16px radius; category name in its accent color +
mono product count. No icons, no pastel circles.

**Featured products:** four-up on the `--mist` alternating band; text-led cards (panel white) —
code pill (SKU outline chip) → name (whisper heading-sm) → mono line (size · form) → mono price
→ rectangular "View compound". Complete without images; no empty frames.

**Mechanism band:** light (`--snow`); left 40%: heading + body + line-bound button; right 60%:
the BPC-157 specification table with hairline-ruled rows, mirrored on `productSpecs.ts` order.

**Social Proof:** none exists — no testimonials, press marks, or customer claims are fabricated
on any surface. The spec record carries the credibility work in their place; that is the rule
this component must honor to become the build.

**Primary CTA discipline:** exactly one filled rectangular button per viewport region; arrow
links for secondary. Badges/chips use Aurora sparingly.

**Footer:** snow with 1px hairline top; dark wordmark variant
(`website_header_logo_transparent.png`); centered page-link row (Home, New Releases, All
Products, 5 categories, FAQs, Shipping, Contact); centered compliance: "For research use only.
Not for human consumption." + copyright.

---

## 3. Anti-Pattern Guardrails (hard bans)

1. **No neon purple/blue gradient blobs** or glow edge treatments. Bold flat color is welcome —
   gradients-as-atmosphere are not.
2. **No warm paper design system**, and **no tans/browns as colors**. The entire chromatic
   family is cool (lunar indigo, celestial blue-greys, mint). The retired warm set
   (`#faf9f7`, `#8a5a1c`, `#f2efe9`, `#e5e0d8`) may not reappear.
3. **No 3-column card grids with centered generic icons in pastel circles.** Trust is carried by
   ruled rows of plain statements; categories are flat name+accent panels.
4. **No uniform border radius** across element families — badges/identity chips 999 / buttons
   and inputs 8 / cards 16 / hero sheet panel 32, optically reasoned and differentiated.
5. **No glassmorphism/backdrop blur** as decoration. (The age gate's fifteenth-of-an-opacity
   scrim is the only existing exception and stays as-is.)
6. **No drop shadows or elevation cosplay** — fields of flat color only.
7. **No eyebrow/kicker labels above headlines** — a heading speaks for itself.
8. **No verification theater:** no "tested/verified/certified/accredited", no certificate
   affordance, no testing status, no per-batch document links. Purity is always the literal
   `≥99%` declaration. Specification coverage follows PRODUCT.md's own "(if available)" rule:
   CAS/formula/MW/sequence are optional and omitted when unsourced; "batch identity" language
   stays out until real lot identifiers exist in the catalog.
9. **No dosing, medical, or body framing.** GLPs are research reference compounds like any other.
10. **No monospace as costume** — mono for codes/data only.
11. **WCAG AA on every pair:** body/placeholder ≥4.5:1, large ≥3:1; secondary text on colored
    surfaces tinted from that hue, never gray. (Verify in the shipped build, not by intention.)

---

## 4. Integration map (post-approval)

- `:root` tokens → `themes/elune/src/pages/all/shadcn.css`; Tailwind v4 `@theme` binding →
  `themes/elune/src/pages/all/tailwind.css`. No hardcoded hex in components; new values join
  the token home.
- Fonts: self-host Manrope variable (200–800) + reuse the repo's JetBrains Mono subset under
  `themes/elune/public/assets/fonts/`; U+2265 presence verified in Manrope's cmap, re-verified
  at implementation.
- Wordmark: old `BrandMark.tsx` crescent + custom wordmark CSS replaced by official
  `docs/refs/brand-assets/website_header_logo_transparent.png` (light surfaces) and
  `website_header_logo_white.png` (dark bands); favicon → `favicon-32x32.png` set, admin-replaceable.
- Category accents re-mapped to the five cool hues; `CategoryAccent.tsx` fallback stays
  never-rendered.
- The old "Warm Paper" DESIGN.md entity is replaced on approval; nothing from it survives
  except the compliance register (RUO text, age gate behavior, spec table semantics).

## 5. Next steps

1. **Review this brief + the mockup** (`docs/mockups/elune-landing-mockup.html`).
2. Approve → promote to `DESIGN.md` + `.impeccable/design.json`, then build the ship phase
   per the impeccable new-work pipeline (hero → sections → motion → responsive gates).
3. Re-roll available: say the word and a fresh concept roll replaces #5; the decision record
   above is preserved either way.

*Telemetry: the concept-roll ping fires on your approval choice.*
