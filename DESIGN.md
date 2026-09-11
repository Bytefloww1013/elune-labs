---
version: "1.0.0"
name: "Elune Labs Design System (Aegis-Dark)"
description: "Design system and UI token specification for Elune Labs — high-purity peptide, SARM, and nootropic research ecommerce storefront."
tokens:
  colors:
    primitives:
      void:
        0: "#050608"
        50: "#090B0E"
        100: "#0E1217"
        200: "#141921"
        300: "#1C232E"
        400: "#273140"
        500: "#374457"
        600: "#50617B"
        700: "#7485A0"
        800: "#A2B1C6"
        900: "#D4DCE8"
        950: "#F1F5F9"
      cyan:
        300: "#67E8F9"
        400: "#22D3EE"
        500: "#00F0FF"
        600: "#0891B2"
        700: "#0E7490"
        glow: "rgba(0, 240, 255, 0.25)"
      violet:
        300: "#D8B4FE"
        400: "#C084FC"
        500: "#A855F7"
        600: "#9333EA"
        700: "#7E22CE"
        glow: "rgba(168, 85, 247, 0.25)"
      emerald:
        300: "#6EE7B7"
        400: "#34D399"
        500: "#00FF9D"
        600: "#059669"
        glow: "rgba(0, 255, 157, 0.25)"
      amber:
        300: "#FCD34D"
        400: "#FBBF24"
        500: "#FFB300"
        600: "#D97706"
        glow: "rgba(255, 179, 0, 0.25)"
      crimson:
        400: "#F87171"
        500: "#EF4444"
        600: "#DC2626"
    semantic:
      background: "{colors.primitives.void.50}"
      foreground: "{colors.primitives.void.950}"
      card: "{colors.primitives.void.100}"
      cardForeground: "{colors.primitives.void.950}"
      popover: "{colors.primitives.void.200}"
      popoverForeground: "{colors.primitives.void.950}"
      primary: "{colors.primitives.cyan.500}"
      primaryForeground: "{colors.primitives.void.0}"
      secondary: "{colors.primitives.void.300}"
      secondaryForeground: "{colors.primitives.void.950}"
      muted: "{colors.primitives.void.200}"
      mutedForeground: "{colors.primitives.void.700}"
      accent: "{colors.primitives.violet.500}"
      accentForeground: "{colors.primitives.void.950}"
      destructive: "{colors.primitives.crimson.500}"
      destructiveForeground: "#FFFFFF"
      border: "{colors.primitives.void.300}"
      input: "{colors.primitives.void.300}"
      ring: "{colors.primitives.cyan.500}"
      divider: "{colors.primitives.void.300}"
    categories:
      peptides:
        accent: "{colors.primitives.cyan.500}"
        glow: "{colors.primitives.cyan.glow}"
        badgeBg: "rgba(0, 240, 255, 0.10)"
        badgeBorder: "rgba(0, 240, 255, 0.30)"
      sarms:
        accent: "{colors.primitives.amber.500}"
        glow: "{colors.primitives.amber.glow}"
        badgeBg: "rgba(255, 179, 0, 0.10)"
        badgeBorder: "rgba(255, 179, 0, 0.30)"
      nootropics:
        accent: "{colors.primitives.emerald.500}"
        glow: "{colors.primitives.emerald.glow}"
        badgeBg: "rgba(0, 255, 157, 0.10)"
        badgeBorder: "rgba(0, 255, 157, 0.30)"
  typography:
    fonts:
      sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      display: "Inter, 'Space Grotesk', -apple-system, sans-serif"
      mono: "'JetBrains Mono', 'SF Mono', Consolas, Menlo, monospace"
    scale:
      xs: { size: "0.75rem", lineHeight: "1rem", letterSpacing: "0.02em" }
      sm: { size: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0.01em" }
      base: { size: "1rem", lineHeight: "1.5rem", letterSpacing: "0" }
      lg: { size: "1.125rem", lineHeight: "1.75rem", letterSpacing: "-0.01em" }
      xl: { size: "1.25rem", lineHeight: "1.75rem", letterSpacing: "-0.015em" }
      "2xl": { size: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.02em" }
      "3xl": { size: "1.875rem", lineHeight: "2.25rem", letterSpacing: "-0.025em" }
      "4xl": { size: "2.25rem", lineHeight: "2.5rem", letterSpacing: "-0.03em" }
      "5xl": { size: "3rem", lineHeight: "1.15", letterSpacing: "-0.035em" }
    weights:
      normal: 400
      medium: 500
      semibold: 600
      bold: 700
      extrabold: 800
  spacing:
    0: "0px"
    1: "4px"
    2: "8px"
    3: "12px"
    4: "16px"
    5: "20px"
    6: "24px"
    8: "32px"
    10: "40px"
    12: "48px"
    16: "64px"
    20: "80px"
    24: "96px"
  radii:
    none: "0px"
    sm: "2px"
    md: "4px"
    lg: "6px"
    xl: "8px"
    full: "9999px"
  elevations:
    surface0: "0 0 0 0 transparent"
    surface1: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)"
    surface2: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)"
    surface3: "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)"
    glowCyan: "0 0 20px -4px rgba(0, 240, 255, 0.35)"
    glowViolet: "0 0 20px -4px rgba(168, 85, 247, 0.35)"
    glowEmerald: "0 0 20px -4px rgba(0, 255, 157, 0.35)"
    glowAmber: "0 0 20px -4px rgba(255, 179, 0, 0.35)"
---

# Elune Labs Design System Specification (DESIGN.md)

**Document Status:** Approved Architecture Standard  
**Target Engine:** EverShop 2.2.1 Storefront + Docker Compose  
**Primary Theme:** `themes/elune`  
**Brand:** Elune Labs (`https://elunelabs.com`)  
**Design Language:** *Aegis Dark* (High-Purity Bio-Intelligence)  
**Visual Reference Assets:** Located in [`docs/design/mockups/`](file:///home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/2/elune-labs/docs/design/mockups/)

---

## Visual Reference Mockups

The Aegis-Dark design system was visually modeled, approved, and formalized around four high-contrast dark-mode mockups:

1. **[Style 1: Electric Cyan (Peptides & Core Synthesis)](file:///home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/2/elune-labs/docs/design/mockups/mockup-cyan-peptides.jpg)**  
   *Token Anchor:* `--accent-peptides: #00F0FF`, `--primary: #00F0FF`. Borosilicate serum vial with anodized cyan cap, lyophilized cake, glowing cyan purity pill `≥99.4% HPLC PURITY`, and cyan CTA.
2. **[Style 2: Synaptic Emerald (Nootropics & Cognitive Focus)](file:///home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/2/elune-labs/docs/design/mockups/mockup-emerald-nootropics.jpg)**  
   *Token Anchor:* `--accent-nootropics: #00FF9D`. Matte black dropper bottle & capsule vial with emerald caustic ripples, monospace specs, `99.6% PURITY` pill badge, and mint CTA.
3. **[Style 3: Hyper Amber (SARMs & Metabolic Precision)](file:///home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/2/elune-labs/docs/design/mockups/mockup-amber-sarms.jpg)**  
   *Token Anchor:* `--accent-sarms: #FFB300`. Anodized gold crimp cap, warm edge lighting, carbon composite pedestal, `FOR RESEARCH USE ONLY` pill badge, and amber-gold CTA.
4. **[Style 4: Hyper-Violet (Elune Amethyst Theme)](file:///home/josh/dev/elune-labs/.treehouse/elune-labs-347ecc/2/elune-labs/docs/design/mockups/mockup-violet-elune.jpg)**  
   *Token Anchor:* `--accent: #A855F7`. Metallic purple crimp seal, tabbed clinical specifications, and violet neon CTA glow.

---

## 1. Brand Identity & Design Philosophy

### 1.1 Brand Archetype: The Precision Synthesizer & Bio-Intelligence Lab
Elune Labs is an ultra-modern, high-purity research chemical and cognitive enhancement storefront providing peptides, SARMs, and nootropics for biohacker hobbyists, laboratory researchers, and longevity practitioners. 

The industry is saturated with two flawed archetypes:
1. **The "Gym-Bro" Vaporware Store:** Garish neon colors, fake countdown timers, pseudo-medical claims, and aggressive marketing that repels serious researchers.
2. **The 2004 Legacy Supplier:** Cluttered text tables, Windows 98 aesthetic, non-responsive layouts, and zero visual appeal.

**Elune Labs occupies the high ground:** A clinical, aerospace-grade, high-contrast dark environment reminiscent of an advanced biotechnology laboratory interface or a high-end cryptographic terminal. It feels **competent, sterile, intelligent, and unshakeably trustworthy**.

### 1.2 Core Pillars

| Pillar | Expression in UI | Psychological Impact on Buyer |
|---|---|---|
| **Uncompromising Purity** | Sleek 3D renders with caustic glass reflections, batch verification badges, HPLC lab report tags (`≥99.2% Purity`), exact molecular weights and CAS numbers. | Eliminates anxiety regarding product adulteration or underdosing. |
| **Laboratory Competence** | Monospace typography for scientific specifications, structured grid layouts, clean hairlines, and precise data tables. | Signals institutional knowledge, chemical rigor, and professional handling. |
| **Cryptographic Trust** | Frictionless crypto checkout display (BTC, USDT TRC-20, ETH), clear TXID submission fields, copy-to-clipboard buttons, zero hidden steps. | Reassures privacy-focused, decentralized-currency biohackers. |
| **Clear, Honest Communication** | Unapologetic Research-Use-Only (RUO) disclaimers, clear dosage/concentration metadata, transparent stock status, and zero deceptive sales hooks. | Establishes high long-term customer lifetime value (LTV) and mutual respect. |

### 1.3 Target Audience Profile: The Analytical Biohacker
- **Demographics:** Analytical self-optimizers, longevity researchers, amateur biochemists, software engineers, and fitness scientists aged 22–50.
- **Mental Model:** Reads PubMed studies; understands HPLC chromatography and mass spectrometry; stores peptides at -20°C; values lyophilized cake stability; pays in cryptocurrency for speed and privacy.
- **Visual Expectation:** Prefers refined dark mode (OLED matte black, dark charcoal), micro-interactions that feel snappy (<150ms), and crisp typography that renders chemical formulas legibly.

---

## 2. Color System & Contrast Strategy

### 2.1 Color Palette Architecture
The palette is built on **Aegis Dark**, combining a deep obsidian/charcoal foundation with electric luminescent accents. Colors are calibrated using the modern **OKLCH** perceptual color space to preserve perceived lightness across devices and contrast ratios.

```
┌────────────────────────────────────────────────────────────────────────┐
│  SURFACES (OBSIDIAN)                                                  │
│  [#050608 Void]  →  [#090B0E Canvas]  →  [#0E1217 Card]  →  [#1C232E Border]
└────────────────────────────────────────────────────────────────────────┘
       │                      │                      │
       ▼                      ▼                      ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   PEPTIDES    │      │     SARMS     │      │  NOOTROPICS   │
│ Electric Cyan │      │  Hyper Amber  │      │ Synaptic Mint │
│   #00F0FF     │      │    #FFB300    │      │    #00FF9D    │
└───────────────┘      └───────────────┘      └───────────────┘
```

### 2.2 Token Values & WCAG 2.1/2.2 AA Contrast Ratios

| Token Name | CSS Custom Property | Hex Code | OKLCH Equivalent | Contrast vs Canvas (`#090B0E`) | Semantic Role |
|---|---|---|---|---|---|
| **Canvas Background** | `--background` | `#090B0E` | `oklch(0.14 0.015 250)` | Base | Root viewport background |
| **Card / Surface 1** | `--card` | `#0E1217` | `oklch(0.18 0.020 250)` | 1.3:1 (vs Base) | Product cards, modules, drawer panels |
| **Surface 2 / Popover**| `--popover` | `#141921` | `oklch(0.22 0.025 250)` | 1.8:1 (vs Base) | Dropdowns, dialogs, modals, hover states |
| **Hairline Border** | `--border` / `--divider` | `#1C232E` | `oklch(0.26 0.025 250)` | 2.5:1 (vs Base) | 1px clean separation lines |
| **Text Primary** | `--foreground` | `#F1F5F9` | `oklch(0.96 0.010 250)` | **16.2:1 (AAA)** | Primary titles, product names, prices |
| **Text Muted** | `--muted-foreground` | `#7485A0` | `oklch(0.62 0.035 250)` | **5.4:1 (AA)** | Scientific metadata, secondary labels, notes |
| **Primary Accent** | `--primary` | `#00F0FF` | `oklch(0.88 0.180 205)` | **13.8:1 (AAA)** | CTAs, focus rings, primary brand badges |
| **Primary Foreground**| `--primary-foreground`| `#050608` | `oklch(0.10 0.010 250)` | **14.2:1 (AAA)** | Text inside Primary Cyan buttons |
| **Secondary Accent** | `--accent` | `#A855F7` | `oklch(0.65 0.240 295)` | **6.8:1 (AA)** | Brand wordmark "LABS", hover states, badges |
| **Destructive / Alert**| `--destructive` | `#EF4444` | `oklch(0.62 0.220 25)` | **5.2:1 (AA)** | Form errors, checkout cancellation |

### 2.3 Category Tri-Accent Color Coding
Every product category is visually anchored with a distinctive luminescent accent. This creates instantaneous cognitive categorization when scanning catalog listings or browsing category pages.

```
                    ┌─────────────────────────┐
                    │    CATEGORY SYSTEM      │
                    └────────────┬────────────┘
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│     PEPTIDES     │    │      SARMS       │    │    NOOTROPICS    │
│  Electric Cyan   │    │   Hyper Amber    │    │  Synaptic Mint   │
│     #00F0FF      │    │     #FFB300      │    │     #00FF9D      │
│                  │    │                  │    │                  │
│ Symbolizes:      │    │ Symbolizes:      │    │ Symbolizes:      │
│ - Cellular repair│    │ - Anabolic drive │    │ - Neurogenesis   │
│ - Purity & frost │    │ - Receptor bond  │    │ - Acetylcholine  │
│ - Lyophilization │    │ - Metabolic surge│    │ - Synaptic spark │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

- **Peptides (`--accent-peptides: #00F0FF` / `oklch(0.88 0.18 205)`):**
  Electric Cyan evokes cryogenic storage, pure white lyophilized peptide cakes, laboratory peptide synthesis, and clean biological signalling.
- **SARMs (`--accent-sarms: #FFB300` / `oklch(0.80 0.18 75)`):**
  Hyper Amber evokes androgen receptor binding, cellular affinity, energetic vigor, and selective molecular targeting.
- **Nootropics (`--accent-nootropics: #00FF9D` / `oklch(0.88 0.22 150)`):**
  Synaptic Emerald/Mint evokes cognitive biohacking, neural arborization, memory consolidation, and heightened sensory alertness.

### 2.4 Critical EverShop Token Collision Fix
In stock EverShop 2.2.1, `tailwind.css` declares a second `:root` block that defines light-mode values (`--muted: oklch(0.97 0 0);`, `--input: oklch(0.922 0 0);`, `--secondary: oklch(0.97 0 0);`). Because these appear later in the stylesheet cascade, they overwrite the theme's dark tokens, resulting in jarring white input fields and washed-out cards.

**The Fix:** All `:root` tokens in `themes/elune/src/pages/all/shadcn.css` must define the complete dark surface set, and the downstream duplicate declarations in `tailwind.css` must be synchronized to dark values.

---

## 3. Typography & Technical Data Formatting

### 3.1 Typeface Families
- **Primary Interface Font (`--font-sans`):** `Inter`, system-ui fallback.  
  *Characteristics:* Clean geometric neo-grotesque, tall x-height, neutral legibility at dense information scales.
- **Display & Headlines (`--font-display`):** `Inter` with tight letter spacing (`-0.025em` to `-0.035em`) and font weight `700` (Bold) or `800` (Extrabold).
- **Scientific, Code & Payment Font (`--font-mono`):** `JetBrains Mono`, `SF Mono`, `Consolas`, monospace fallback.  
  *Characteristics:* Distinct 0 and O glyphs, clean numeric tabular alignment, ideal for CAS numbers, chemical formulas, crypto public keys, and transaction hashes (TXID).

### 3.2 Type Scale Hierarchy

| Level | Size (rem / px) | Line Height | Weight | Letter Spacing | Target Element / Usage |
|---|---|---|---|---|---|
| **Hero Display** | `3.000rem` (48px) | `1.15` | 800 (Extrabold) | `-0.035em` | Homepage hero punchlines, major banner headlines |
| **Heading 1 (H1)** | `2.250rem` (36px) | `1.20` | 700 (Bold) | `-0.030em` | Product title on PDP, Category main title |
| **Heading 2 (H2)** | `1.875rem` (30px) | `1.25` | 600 (Semibold) | `-0.025em` | Section headers, Checkout step headings, Age Gate title |
| **Heading 3 (H3)** | `1.500rem` (24px) | `1.30` | 600 (Semibold) | `-0.020em` | Card titles, Cart modal headings, Drawer labels |
| **Heading 4 (H4)** | `1.250rem` (20px) | `1.35` | 600 (Semibold) | `-0.015em` | Sub-sections, Accordion triggers, Table group headers |
| **Body Large** | `1.125rem` (18px) | `1.50` | 400 / 500 | `0` | Lead paragraphs, Hero supporting copy |
| **Body Default** | `1.000rem` (16px) | `1.50` | 400 (Regular) | `0` | Standard body text, product descriptions, instructions |
| **Body Small / UI** | `0.875rem` (14px) | `1.40` | 500 (Medium) | `+0.010em` | Navigation items, form inputs, button labels, prices |
| **Micro / Caption** | `0.750rem` (12px) | `1.30` | 500 / 600 | `+0.020em` | RUO badges, HPLC purity badges, timestamps, tags |
| **Technical Mono** | `0.875rem` (14px) | `1.40` | 400 / 500 | `0` | CAS numbers, SKU, Crypto addresses, TXID |

### 3.3 Scientific & Chemical Notation Rules
To preserve biohacker trust, chemical data must never look like casual marketing copy:
1. **Chemical Identifiers & SKUs:** Always render in monospace font (`font-mono tracking-tight text-muted-foreground`), e.g., `CAS: 137525-51-0` or `SKU: BPC157-5MG`.
2. **HPLC Purity Badges:** Format as high-contrast pills: `≥99.2% (HPLC)`. The percentage is highlighted in the category accent color or emerald green.
3. **Peptide Concentration & Quantity:** Standardize format as `[Compound Name] [Mass/Concentration]`, e.g., `BPC-157 5mg` or `TB-500 10mg`. Never write `5 Milligrams`.
4. **RUO Compliance String:** The required disclaimer:
   > *"For research use only. Not for human consumption."*  
   Render in `text-xs uppercase tracking-wider text-muted-foreground/80` with a subtle warning glyph or 1px accent border.

---

## 4. Spatial System, Grids & Responsive Layout

### 4.1 Spatial Grid (8-Point Base System)
All layout margins, paddings, and component heights adhere strictly to an **8px base grid** with a **4px half-step** for tight micro-spacing.

```
4px   (0.25rem) — Micro spacing (icon-to-text gap, badge internal padding)
8px   (0.50rem) — Compact element gap (button vertical padding, input padding)
12px  (0.75rem) — Component internal padding (card header margin, chip spacing)
16px  (1.00rem) — Standard gutter (form field vertical separation, card padding)
24px  (1.50rem) — Medium section rhythm (between related components in a grid)
32px  (2.00rem) — Large card padding, modal inset padding
48px  (3.00rem) — Major section break (desktop gap between hero and catalog)
64px+ (4.00rem) — Page division padding, footer top margin
```

### 4.2 Layout Containers & Breakpoints
The layout width is constrained to prevent extreme wide-screen stretching while giving 3D product renders room to breathe:

```css
.page-width {
  max-width: 1280px; /* Refined from default 1200px for 4-column product grids */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 1024px) {
  .page-width {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

**Responsive Breakpoint Strategy:**
- `sm` (`640px`): Single-column checkout stacks; product grid switches from 1 column to 2 columns.
- `md` (`768px`): Header expands with navigation links; Category filter bar switches to horizontal tabs.
- `lg` (`1024px`): Product grid expands to 3 or 4 columns; PDP shifts to 2-column split (Left: 3D render stage; Right: purchase panel).
- `xl` (`1280px`): Full max-width container with generous margins and elevated card padding.

---

## 5. Surface Elevations, Borders & High-Precision Glassmorphism

### 5.1 The 4 Surface Tiers
In dark mode, visual depth is created through lightness steps and subtle borders rather than heavy diffuse drop shadows:

```
┌────────────────────────────────────────────────────────┐
│ LEVEL 0: Canvas (#090B0E)                              │
│   ┌──────────────────────────────────────────────────┐ │
│   │ LEVEL 1: Card (#0E1217) + 1px border (#1C232E)   │ │
│   │   ┌────────────────────────────────────────────┐ │ │
│   │   │ LEVEL 2: Input / Popover (#141921)         │ │ │
│   │   │   ┌──────────────────────────────────────┐ │ │ │
│   │   │   │ LEVEL 3: Active Element / Button     │ │ │ │
│   │   │   └──────────────────────────────────────┘ │ │ │
│   │   └────────────────────────────────────────────┘ │ │
│   └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

1. **Level 0 (Canvas):** `#090B0E`. The deepest background plane.
2. **Level 1 (Card & Section):** `#0E1217`. Distinct from the canvas, bounded by a 1px solid `#1C232E` border.
3. **Level 2 (Interactive Modules & Flyouts):** `#141921`. Used for modals, dropdowns, cart drawer, and table hover states.
4. **Level 3 (Form Inputs & Monospace Blocks):** `#1C232E`. High-contrast inset areas for typing, wallet display, or code chips.

### 5.2 Micro-Radii Philosophy (Precision Aesthetic)
Excessively rounded borders (e.g., `rounded-2xl` or `rounded-3xl`) convey playful consumer tech (like candy or toy apps). In contrast, aerospace and precision chemical equipment use sharp, engineered radii:
- Buttons, Inputs, Cards: `rounded-md` (`4px` to `6px`).
- Badges & Metric Pills: `rounded` (`2px` to `4px`) or `rounded-full` (only for tiny status dots).
- Modals & Banners: `rounded-lg` (`8px`).

### 5.3 Glassmorphism & Luminescent Glows
- **Frosted Glass Backdrop:** For floating navigation bars and modals:
  ```css
  background-color: rgba(14, 18, 23, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(28, 35, 46, 0.8);
  ```
- **Category Rim Glows:**
  When a product card is hovered, a soft accent glow illuminates the border:
  ```css
  /* Peptides card hover */
  hover:border-cyan-500/50 hover:shadow-[0_0_25px_-5px_rgba(0,240,255,0.25)]
  /* SARMs card hover */
  hover:border-amber-500/50 hover:shadow-[0_0_25px_-5px_rgba(255,179,0,0.25)]
  /* Nootropics card hover */
  hover:border-emerald-500/50 hover:shadow-[0_0_25px_-5px_rgba(0,255,157,0.25)]
  ```

---

## 6. UI Component Anatomy & Design Guidelines

### 6.1 Brand Header & Wordmark (`Wordmark.tsx`)
The header anchors the store identity. Instead of an un-styled font or a generic image file, the wordmark is a typographic construct:

```tsx
<span className="font-sans font-extrabold tracking-[0.30em] text-xl text-foreground flex items-center gap-1.5 select-none">
  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
  ELUNE<span className="text-accent ml-1 font-black">LABS</span>
</span>
```
- A pulsing cyan beacon dot indicates "Active Synthesis / Online".
- `ELUNE` in crisp Stark Off-White (`text-foreground`).
- `LABS` in Electric Violet (`text-accent`), signaling bio-intelligence.

### 6.2 Product Grid & Product Card Anatomy
The product card is the engine of conversion. It must showcase the 3D vial render while communicating scientific rigor:

```
┌───────────────────────────────────────────────────┐
│ [PEPTIDES]                               ≥99% HPLC│  ← Category chip & Purity Tag
│                                                   │
│                     ┌───┐                         │
│                     │   │  ← 3D Render:           │
│                     │   │    Matte black/glass    │
│                     └───┘    vial with cyan cap   │
│                                                   │
│ BPC-157 5mg                                       │  ← Product Name (H3, Bold)
│ CAS 137525-51-0 · Pentadecapeptide                │  ← Monospace Chemical Spec
│                                                   │
│ $39.99 USD                         [ADD TO CART]  │  ← Price + Cyan Action Button
└───────────────────────────────────────────────────┘
```

**Card Components:**
1. **Header Meta Row:** Category pill (left) and HPLC purity badge (right).
2. **3D Render Staging Stage:** Aspect ratio 1:1, isolated against dark radial gradient (`radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)`).
3. **Nomenclature Block:** Exact compound name, dosage/vial size, CAS number.
4. **Pricing & Purchase Action:** Price in bold tabular numerals with high-contrast Cyan CTA button.

### 6.3 Interactive Buttons & Controls

| Variant | Normal State | Hover State | Active / Focus State | Usage |
|---|---|---|---|---|
| **Primary (Cyan CTA)** | `bg-primary text-primary-foreground font-semibold rounded-md` (`#00F0FF` / `#050608`) | `bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]` | `scale-[0.98] ring-2 ring-primary ring-offset-2 ring-offset-background` | "Add to Cart", "Place Order", "Enter (Age Gate)" |
| **Secondary (Slate)** | `bg-secondary text-foreground border border-border rounded-md` | `bg-secondary/80 border-muted-foreground/40` | `ring-1 ring-border` | "Filter", "View Lab Report", "Cancel" |
| **Ghost / Icon** | `text-muted-foreground hover:text-foreground` | `bg-muted/40 text-foreground` | `ring-1 ring-border` | Navigation icons, quantity adjusters, close modal |
| **Disabled** | `bg-muted/40 text-muted-foreground/50 cursor-not-allowed` | No change | No change | Out of stock, processing payment |

### 6.4 Advisory Age Gate Modal (`AgeGate.tsx`)
Biohacker compliance requires an 18+ confirmation modal before viewing research products.
- **Surface:** Level 2 Popover with frosted backdrop (`bg-background/90 backdrop-blur-md`).
- **Heading:** "Age Verification & Research Protocol Confirmation".
- **Body Copy:** Specific legal RUO statement emphasizing laboratory research compliance and age threshold.
- **Actions:** Dual button layout — Primary "I am 18 or older — Confirm" (`bg-primary`) and Secondary "Leave" (`border border-border`).
- **Persistence:** Cookie `elune_age_ok=1; path=/; max-age=2592000; SameSite=Lax`.

### 6.5 Crypto Payment Checkout Module (`CashOnDelivery.tsx` & `ShippingNote.tsx`)
Because standard merchant processors ban peptides and SARMs, manual cryptocurrency transfer is the lifeblood of checkout. The UI must eliminate user friction and anxiety:

```
┌────────────────────────────────────────────────────────────┐
│ Select Payment Currency:  (●) BTC   ( ) USDT-TRC20  ( ) ETH│
├────────────────────────────────────────────────────────────┤
│ Total to Transfer: 0.000421 BTC  ($39.99 USD equivalent)   │
│                                                            │
│ Receiving Wallet Address (Native SegWit):                  │
│ ┌───────────────────────────────────────────────┬────────┐ │
│ │ bc1q8vj9s78d234...90sduf89230                 │ [COPY] │ │
│ └───────────────────────────────────────────────┴────────┘ │
│                                                            │
│ Transaction ID (TXID):                                     │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Paste your on-chain transaction hash here...           │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```
- **Monospace Address Blocks:** Wallet addresses rendered in `font-mono text-sm` with one-click clipboard copy and confirmation toast.
- **QR Code Target:** Optional QR code render for mobile crypto wallet scanning.
- **TXID Capture:** Clear input field mapped to EverShop's `order.shipping_note` for rapid on-chain audit and confirmation.

### 6.6 RUO Product Page Notice (`RuoNotice.tsx`)
On every single product detail page (PDP), a dedicated compliance block appears above the Add-to-Cart trigger:

```tsx
<div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/90 flex items-start gap-3">
  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
  <div>
    <span className="font-semibold text-amber-300 block uppercase tracking-wider text-xs">
      Laboratory Research Notice
    </span>
    This compound is synthesized strictly as a chemical reference for in-vitro research and laboratory experimentation. Not for human or veterinary administration.
  </div>
</div>
```

---

## 7. 3D Product Render & Visual Asset Guidelines

### 7.1 Staging & Geometry Standards
All catalog visuals should use consistent 3D renders instead of mismatched supplier photographs.

```
                  ┌──────────────────────┐
                  │ Aluminum Crimp Cap   │ ← Category color-coded anodized metal
                  ├──────────────────────┤
                  │ Rubber Stopper       │ ← Sterile grey/black butyl
                  ├──────────────────────┤
                  │                      │
                  │ Clear Borosilicate   │ ← High-transmission glass shader
                  │ Glass Serum Vial     │
                  │                      │
                  │ ┌──────────────────┐ │
                  │ │ ELUNE LABS       │ │ ← Minimalist label with formula & CAS
                  │ │ BPC-157 5mg      │ │
                  │ └──────────────────┘ │
                  │ ════════════════════ │ ← Lyophilized cake (white freeze-dried plug)
                  └──────────────────────┘
                   ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
                   Dark Obsidian Pedestal  ← Circular matte black platform with rim reflection
```

### 7.2 Material & Shader Parameters
- **Vial Glass:** 
  - Index of Refraction (IOR): `1.52` (Crown Glass / Borosilicate).
  - Roughness: `0.02` (Ultra-clear, scratch-free).
  - Transmission: `0.98`.
- **Anodized Crimp Seal:**
  - Metallic: `0.90`.
  - Roughness: `0.30` (Brushed matte aluminum).
  - Color: Matched to category accent (Cyan for Peptides, Gold for SARMs, Emerald for Nootropics).
- **Lyophilized Cake (Pellet):**
  - Subsurface Scattering (SSS): Subtle milk-white scatter (`0.2`).
  - Roughness: `0.75` (Matte compressed powder plug).
- **Lighting Rig:**
  - Key Light: Cool 6500K softbox at 45 degrees left.
  - Fill Light: 5500K softbox at 45 degrees right, 40% intensity.
  - Rim Light (Edge): Color-gelled light matching category accent at 135 degrees behind the vial to trace a luminous silhouette.

### 7.3 Asset Export Standards
- **File Format:** Modern WebP or AVIF with fallback to compressed PNG.
- **Resolution:** `1000px × 1000px` (1:1 aspect ratio square).
- **Background:** Either transparent alpha or solid canvas void `#090B0E` (avoids white box clipping bugs).
- **File Size Budget:** `< 120 KB` per product hero render.

---

## 8. Technical Implementation in EverShop 2.2.1

### 8.1 Unified Dark Tokens (`themes/elune/src/pages/all/shadcn.css`)
Replace the default token values with the unified Aegis Dark specification:

```css
:root {
  /* Aegis Dark Palette — Foundation */
  --background: oklch(0.14 0.015 250);         /* #090B0E Canvas */
  --foreground: oklch(0.96 0.010 250);         /* #F1F5F9 Primary Text */
  
  /* Brand Accents */
  --primary: oklch(0.88 0.180 205);            /* #00F0FF Electric Cyan */
  --primary-foreground: oklch(0.10 0.010 250); /* #050608 Deep Void */
  
  --accent: oklch(0.65 0.240 295);             /* #A855F7 Electric Violet */
  --accent-foreground: oklch(0.96 0.010 250);
  
  /* Surfaces & Structural Containers */
  --card: oklch(0.18 0.020 250);               /* #0E1217 Surface 1 */
  --card-foreground: oklch(0.96 0.010 250);
  
  --popover: oklch(0.22 0.025 250);            /* #141921 Surface 2 */
  --popover-foreground: oklch(0.96 0.010 250);
  
  --secondary: oklch(0.24 0.025 250);          /* #18202A Secondary Surface */
  --secondary-foreground: oklch(0.96 0.010 250);
  
  --muted: oklch(0.20 0.020 250);              /* #12171F Muted Surface */
  --muted-foreground: oklch(0.62 0.035 250);   /* #7485A0 Slate Meta Text */
  
  --border: oklch(0.26 0.025 250);             /* #1C232E Hairline Border */
  --divider: oklch(0.26 0.025 250);
  --input: oklch(0.24 0.025 250);
  --ring: oklch(0.88 0.180 205);               /* Cyan Glow Ring */
  
  --destructive: oklch(0.62 0.220 25);         /* #EF4444 Crimson Alert */
  --radius: 0.375rem;                          /* 6px Precision Radius */

  /* Category Color Identifiers (url_key mapped) */
  --accent-peptides: oklch(0.88 0.180 205);    /* Electric Cyan */
  --accent-sarms: oklch(0.80 0.180 75);        /* Hyper Amber */
  --accent-nootropics: oklch(0.88 0.220 150);  /* Synaptic Mint */

  /* Font Families */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}
```

### 8.2 Tailwind Configuration (`themes/elune/src/pages/all/tailwind.css`)
Ensure Tailwind v4 inline theme mappings bind directly to these CSS variables:

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
@import 'tw-animate-css';
@import './shadcn.css';

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-divider: var(--divider);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
}
```

### 8.3 Global SCSS Overrides (`themes/elune/src/pages/all/global.scss`)
Apply typography tracking and dark form element rules:

```scss
body {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Precision inputs in dark mode */
input[type='email'],
input[type='password'],
input[type='tel'],
input[type='text'],
select,
textarea {
  background-color: var(--card);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: var(--radius);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }

  &::placeholder {
    color: var(--muted-foreground);
    opacity: 0.7;
  }
}

/* Hide default fiat payment icons in footer */
.card-icons {
  display: none !important;
}

/* Modal body freeze */
.elune-lock {
  overflow: hidden;
}
```

---

## 9. Accessibility (A11y) & WCAG 2.2 AA Compliance

1. **Color Contrast:** Every text element must meet WCAG 2.2 AA standards:
   - Normal text (below 18pt): Minimum `4.5:1` ratio against surface.
   - Large text (18pt+ or 14pt+ bold): Minimum `3.0:1` ratio against surface.
   - UI components and borders: Minimum `3.0:1` ratio against adjacent backgrounds.
   - *Verification:* The primary text (`#F1F5F9`) on canvas (`#090B0E`) achieves `16.2:1` (passes AAA). Muted text (`#7485A0`) achieves `5.4:1` (passes AA). Primary Cyan (`#00F0FF`) with Dark Void text (`#050608`) achieves `14.2:1` (passes AAA).
2. **Keyboard Navigation & Visible Focus:**
   - All interactive elements must show a distinct `2px` focus ring using `var(--ring)` with an offset:
     `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
3. **Screen Readers & ARIA Labels:**
   - The Age Gate dialog must have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="age-gate-title"`.
   - Category badges and purity tags must not rely on color alone; always include text labels (e.g., text `Peptides` alongside the cyan dot).
4. **Motion Sensitivity:**
   - Honor `prefers-reduced-motion`:
     ```css
     @media (prefers-reduced-motion: reduce) {
       * {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
       }
     }
     ```

---

## 10. Design Governance & Evolution Checklist

When introducing a new component, category, or page layout to Elune Labs:
- [ ] **Token Alignment:** Are all colors, radii, and fonts referencing variables from `shadcn.css` rather than hardcoded hex values?
- [ ] **Contrast Check:** Does every new text combination score `≥ 4.5:1` on WebAIM contrast checkers?
- [ ] **Scientific Integrity:** Are CAS numbers, molecular weights, and HPLC percentages rendered in `font-mono`?
- [ ] **Category Theme Check:** Does the product adhere to its respective tri-accent color (Cyan, Amber, Mint)?
- [ ] **RUO Compliance Check:** Is the mandatory disclaimer visible on all purchase pathways and footer regions?
- [ ] **Crypto Verification:** Are wallet address blocks rendered with monospace typography and one-click copy feedback?
- [ ] **SWC Build Verification:** Does the component maintain `export const layout` with target `es2022` to ensure EverShop inclusion?
