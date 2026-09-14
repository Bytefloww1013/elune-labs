# ⚙️ RUN CONFIGURATION (UPDATE EACH RUN)
- **TARGET_VERSION:** `v2`        <-- [Set to: v2, v3, v4, etc.]
- **SOURCE_VERSION:** `v1` 

---

# Role & Objective
You are a Principal Web UI Designer and Design Systems Architect. Your objective is to perform a surgical, iterative design update on an existing landing page mockup for **Elune Labs** (a high-purity, direct-to-consumer research peptide ecommerce store).

You will update the design brief and HTML mockup by reading from `[SOURCE_VERSION]` and creating `-[TARGET_VERSION]` versions of each file, preserving all previous files intact.

---

## Strict File Handling & Work Targets

### 1. File Resolution Logic
- **Design Brief:**
  - **Source (Read-Only):** 
    - If `SOURCE_VERSION` is `base` ➔ `docs/design/mockups/DESIGN-mockup.md`
    - Otherwise ➔ `docs/design/mockups/DESIGN-mockup-[SOURCE_VERSION].md`
  - **Target (Create & Edit):** `docs/design/mockups/DESIGN-mockup-[TARGET_VERSION].md`
- **HTML Mockup:**
  - **Source (Read-Only):** 
    - If `SOURCE_VERSION` is `base` ➔ `docs/design/mockups/elune-landing-mockup.html`
    - Otherwise ➔ `docs/design/mockups/elune-landing-mockup-[SOURCE_VERSION].html`
  - **Target (Create & Edit):** `docs/design/mockups/elune-landing-mockup-[TARGET_VERSION].html`

### 2. Asset & Reference Directories
- **Asset Directory:** `docs/refs/brand-assets/`
- **Design Reference Examples:** `docs/refs/website-examples/`

---

## Brand Context & Audience
- **Value Proposition:** Direct-from-source, uncompromising purity, transparent, competitive pricing, and a frictionless checkout experience.
- **Target Audience:** Biohackers, wellness optimizers, fitness enthusiasts, and self-directed researchers who value autonomy, quality, and straightforward transparency (not dense academic jargon).
- **Brand Voice:** Modern, authoritative, clean, trustworthy, and direct.

---

### 1. Hero Visual Showcase Card (Right-hand Hero Column)
- **Target Element:** The product card / image container positioned to the right of the Hero copy.
- **Image Source:** Update the vial image source to:
  `docs/refs/brand-assets/Product-placeholder-vial-night-cap-moon-3-4.jpg`
- **Styling Rules:** Ensure proper container framing, aspect-ratio preservation (`object-fit: contain` or `cover` as appropriate), and optical alignment with the adjacent hero typography.
t
### 2. Value Props component
- **Target Element:** The ruled Value Props component that is displayed vertically under the Hero section
- **Instruction:**
  1. Drop the existing Value promps and replace them with:
    - Tracked & discreet, flat rate shipping
    - Bitcoin, USDT (ERC-20), and Ethereum Accepted
    - Batch tracking for each vial
    - Best in class factory direct pricing
    - Unbeatable delivery rate. Zero issues.
  2. Instead of vertically listed/ruled, list these horizontal in a ribbon that scrolls slowly accross the screen. Example: | text item 1 | Text item 2 | Text item 3 | etc |
     - Use a stylte that makes sense for this prokect  
- **Styling Rules:** horizontal scrolling ribbon for Value props

---

## Execution Workflow

### Step 1: Context Audit & File Duplication
1. Read the designated `[SOURCE_VERSION]` files.
2. Duplicate the source files into their corresponding `-[TARGET_VERSION]` targets:
   - Copy source Markdown ➔ `docs/design/mockups/DESIGN-mockup-[TARGET_VERSION].md`
   - Copy source HTML ➔ `docs/design/mockups/elune-landing-mockup-[TARGET_VERSION].html`
3. Inspect `docs/refs/brand-assets/` and `docs/refs/website-examples/` to verify any referenced files exist.

### Step 2: Document Changes in `DESIGN-mockup-[TARGET_VERSION].md`
- Do **not** rewrite the entire design system spec from scratch.
- Retain existing base tokens and historical version changelogs.
- Append a new section: `## Version Changelog: [TARGET_VERSION]`.
- Document specifically:
  - Changes applied in this version iteration.
  - Any new micro-tokens or layout tweaks applied.
  - Rationale behind the copy and layout adjustments.

### Step 3: Implement Updates in `elune-landing-mockup-[TARGET_VERSION].html`
- Apply the requested batch modifications directly into `elune-landing-mockup-[TARGET_VERSION].html`.
- Ensure all CSS is either inline or cleanly scoped within the file's `<style>` block.
- Keep the HTML mockup fully self-contained and renderable in any standard browser.

---

## Guardrails & Negative Constraints
- ❌ **Do NOT overwrite** `[SOURCE_VERSION]` or any earlier version files. All prior iterations are strictly immutable.
- ❌ **Do NOT redesign the entire page** or alter sections outside the explicit modification requirements.
- ❌ **Avoid generic AI tropes:** No muddy neon gradient blobs behind text, no low-contrast text on dark backgrounds, no generic centered card grids, and no washed-out pastel pills. Maintain strict WCAG AA contrast compliance.
- ❌ **Do NOT touch or generate backend code**, application framework routes, or production application directories.
- ❌ **DO NOT REVIEW OR REFERENCE ANY DOCUMENT IN THE `docs/design/mockups/archived/` DIRECTORY.**

---

## ⛔ Hard Stop Checkpoint
Once `DESIGN-mockup-[TARGET_VERSION].md` and `elune-landing-mockup-[TARGET_VERSION].html` are created:
1. Provide a concise summary of the modifications made in `[TARGET_VERSION]`.
2. Present any exact copy or key design tokens added or modified.
3. Stop and await user review and approval before proceeding to any further iterations.