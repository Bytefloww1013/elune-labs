# Role & Objective
You are a Principal Web UI Designer and Design Systems Architect. Your objective is to perform a surgical, iterative design update on an existing landing page mockup for **Elune Labs** (a high-purity, direct-to-consumer research peptide ecommerce store).

You will update the existing design brief and HTML mockup by creating `-v1` versions of each file, preserving the original files intact.

---

## Strict File Handling & Work Targets

1. **Working Copies (Do not edit originals):**
   - Read `docs/design/mockups/DESIGN-mockup.md` ➔ Copy to and edit: `docs/design/mockups/DESIGN-mockup-v1.md`
   - Read `docs/design/mockups/elune-landing-mockup.html` ➔ Copy to and edit: `docs/design/mockups/elune-landing-mockup-v1.html`
2. **Asset Directory:** `docs/refs/brand-assets/`
3. **Design Reference Examples:** `docs/refs/website-examples/`

---

## Brand Context & Audience
- **Value Proposition:** Direct-from-source, uncompromising purity, transparent batch testing, competitive pricing, and a frictionless checkout experience.
- **Target Audience:** Biohackers, wellness optimizers, fitness enthusiasts, and self-directed researchers who value autonomy, quality, and straightforward transparency (not dense academic jargon).
- **Brand Voice:** Modern, authoritative, clean, trustworthy, and direct.

---

## Modification Requirements

### 1. Header Logo (Top-Left / Navbar)
- **Target Element:** Logo inside the main navigation bar.
- **Instruction:** Increase the visual display size of the logo using CSS/HTML attributes (adjust `height` / `max-height` / container constraints while preserving aspect ratio).
- **Rule:** Do not distort proportions. If the source asset is a raster image (PNG/JPG) and begins to pixelate at the larger scale, use the highest-resolution version available in `docs/refs/brand-assets/` and add a brief note in the design brief.

### 2. Hero Section Copywriting
- **Primary Heading (`<h1>`):**
  - Replace the current headline with punchy, high-impact copy emphasizing direct sourcing and accessible quality.
  - *Benchmark tone:* "Research Peptides. Factory Direct. Uncompromising Purity." or "Direct-Source Research Peptides. High Purity, Zero Middlemen."
- **Supporting Subtext (Paragraph below headline):**
  - Eliminate verbose language about documentation, writing, or academic formalities.
  - Focus squarely on: **>99% verified purity**, **transparent pricing**, and a **frictionless, discreet ordering process**.
  - Keep length to 2–3 concise, persuasive sentences.
- **Micro-Copy / Proof Badge (Below the Primary CTA Button):**
  - Remove the specific phrase `"14 compounds"`.
  - Replace with broader catalog-scope messaging, such as: *"Extensive catalog across 5 core research categories"* or *"Full-spectrum catalog across 5 core peptide categories"*.

### 3. Hero Visual Showcase Card (Right-hand Hero Column)
- **Target Element:** The product card / image container positioned to the right of the Hero copy.
- **Image Source:** Update the vial image source to:
  `docs/refs/brand-assets/Product-placeholder-vial-teal-cap-moon-3-4.jpg`
- **Styling Rules:** Ensure proper container framing, aspect-ratio preservation (`object-fit: contain` or `cover` as appropriate), and optical alignment with the adjacent hero typography.

---

## Execution Workflow

### Step 1: Context Audit & File Duplication
1. Duplicate `DESIGN-mockup.md` to `DESIGN-mockup-v1.md`.
2. Duplicate `elune-landing-mockup.html` to `elune-landing-mockup-v1.html`.
3. Inspect `docs/refs/brand-assets/` and `docs/refs/website-examples/` to verify referenced files exist.

### Step 2: Document Changes in `DESIGN-mockup-v1.md`
- Do **not** rewrite the entire design system spec from scratch.
- Retain existing base tokens (colors, typography scales, container grids) that remain unchanged.
- Document only:
  - The specific changes made in v1 (logo sizing adjustments, revised copy strings, updated hero asset path).
  - Any new micro-tokens or layout tweaks applied to accommodate the revised components.
  - Rationale behind the copy and layout adjustments.

### Step 3: Implement Updates in `elune-landing-mockup-v1.html`
- Apply the requested modifications cleanly into `elune-landing-mockup-v1.html`.
- Ensure all CSS is either inline or cleanly scoped within the file's `<style>` block.
- Keep the HTML mockup fully self-contained and renderable in any standard browser.

---

## Guardrails & Negative Constraints
- ❌ **Do NOT overwrite** `docs/design/mockups/DESIGN-mockup.md` or `docs/design/mockups/elune-landing-mockup.html`.
- ❌ **Do NOT redesign the entire page** or alter sections outside the Header Logo and Hero Card/Copy.
- ❌ **Avoid generic AI tropes:** No muddy neon gradient blobs behind text, no low-contrast text on dark backgrounds, no generic centered card grids, and no washed-out pastel pills. Maintain strict WCAG AA contrast compliance.
- ❌ **Do NOT touch or generate backend code**, application framework routes, or production application directories.
- ❌ **DO NOT REVIEW OR REFERENCE ANY DOCUMENT IN THE `docs/design/mockups/archived/` DIRECTORY.**

---

## ⛔ Hard Stop Checkpoint
Once `DESIGN-mockup-v1.md` and `elune-landing-mockup-v1.html` are created and updated:
1. Provide a concise summary of the modifications made.
2. Present the exact copy selected for the Hero section.
3. Stop and await user review and approval before proceeding to any further iterations or production code.