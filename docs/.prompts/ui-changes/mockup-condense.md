# Role & Objective
You are a Principal Web UI Designer and Design Systems Architect. Your objective is to perform a exhaustive, iterative design update on an existing DESIGN.md for **Elune Labs** (a high-purity, direct-to-consumer research peptide ecommerce store).  Based from the landing page mockups that were designed for this project.  The `DESIGN.md` located in the project root is for the entire prokject, adapt the landing page mockup, to the entire project's `DESIGN.md` be sure to read it in full so you are aware of the items that need added using the new design tokens in the copy based from the mockup.

---

## Strict File Handling & Work Targets

### 1. File Resolution Logic
- **Design Brief:**
  - **Source (Read-Only):** 
    - If `SOURCE_VERSION` is ➔ `docs/design/mockups/DESIGN-mockup-v5.md`
  - **Target (Create & Edit):** `DESIGN.md` -> If one exists in project root, overwrite it with this new version
- **HTML Mockup:**
  - **Source (Read-Only):** 
    - If `SOURCE_VERSION` is  ➔ `docs/design/mockups/elune-landing-mockup-v5.html`
    - The html mockup can be used as reference for the new proect DESIGN.md - Do not edit any other html documents in this project.

### 2. Asset & Reference Directories
- **Asset Directory:** 
 - Landing page testimonial images: `docs/refs/assets/imgs` 
 - Brand Assets (Logo & favicons): `docs/refs/assets/brand`


---

## Brand Context & Audience
- **Value Proposition:** Direct-from-source, uncompromising purity, transparent, competitive pricing, and a frictionless checkout experience.
- **Target Audience:** Biohackers, wellness optimizers, fitness enthusiasts, and self-directed researchers who value autonomy, quality, and straightforward transparency (not dense academic jargon).
- **Brand Voice:** Modern, authoritative, clean, trustworthy, and direct.

---

### 1. New project DESIGN.md:
- **Target Element:** Generate a new `DESIGN.md` file that can be used for the rest of this project.  Name this new file `DESIGN-v1.md`
- - **Instruction:** 
    1. You will base this new version of the general style and design elements outlined in the File Resolution Logic section above. 
    2.  You can view the existing DESIGN.md in the project root, then after you understand all the sections that need to be covered by your new version. Make it using the new design tokens- **Styling Rules:** 
---


## Guardrails & Negative Constraints
- ❌ **Do NOT overwrite** `[SOURCE_VERSION]` or any earlier version files. All prior iterations are strictly immutable.  The new version `DESIGN-v1.md`
- ❌ **Avoid generic AI tropes:** No muddy neon gradient blobs behind text, no low-contrast text on dark backgrounds, no generic centered card grids, and no washed-out pastel pills. Maintain strict WCAG AA contrast compliance.
- ❌ **Do NOT touch or generate backend code**, application framework routes, or production application directories.
- ❌ **DO NOT REVIEW OR REFERENCE ANY DOCUMENT IN THE `docs/design/mockups/archived/` DIRECTORY.**

