# Role & Objective
You are a Principal Web UI Designer and Design Systems Architect. Your objective is to perform a exhaustive, iterative design update on an existing project pages using the DESIGN.md file as your source of truth, for **Elune Labs** (a high-purity, direct-to-consumer research peptide ecommerce store).  Based from the landing page mockups that were designed for this project.  The `DESIGN.md` located in the project root is for the entire project, be sure to read it in full so you are aware of the items that need to be modified.  

---

## Strict File Handling & Work Targets

### 1. File Resolution Logic
- **Design Brief:**
  - **Source (Read-Only):** 
    - `SOURCE_VERSION` is ➔ `DESIGN.md`
  - **Target (Create & Edit):** All existing html theme files in the project
- **HTML Mockup:**
  - **Source (Read-Only):** 
    - `SOURCE_VERSION` is  ➔ `docs/design/mockups/elune-landing-mockup-v5.html`
    - The html mockup, `docs/design/mockups/elune-landing-mockup-v5.html` should be used as reference for the project's landing page - Edit the existing project landing page to match the code in the mockup version.

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
## How to Work
### Multi-Agent & Sub-Agent Process
- **Fan-Out & Fan-in in waves** 
  - Subagents to examine the file structure, existing design, and make a list of tasks and goals that must be fulfilled to accomplish the theme redesign.
  - When a peice of code is returned, a Reviewer subagent must analyze and grade it for correctness, style/design adherance, quality, and how will it fit's the projects DESIGN.md.  The reviewer **MUST** review all design code visually via screenshot or headless browser.  You cant tell for certain how good a design is without looking at it visually.
    - The reviewer will decide a score between 0 - 10..  
    - An average score of 8 or higher is required before submission is accepted.  
    - If the reviewer fails the submission, return the submission to the subagent who produced it, provide actionable insight on how the subagent could improve their score for their next submission.
    - This loop continues until the code is passing.

### 1. New project Theme Created from: DESIGN.md:
- **Target Element:** Update the current project theme to match the new design tokens, design system, and ui elements outlined in the project's `DESIGN.md`.
- - **Instruction:** 
    1. You will start by conducting an analysis of the `DESIGN.md` file to understand everything that will be required for the project theme redesign.  
    2. Do the same for the current theme's file structure.  The existing project theme is located in the `theme` directory
       1. Be sure to move copies of any file assets into that folder if need. 
    3. Be sure to update the current project landing page to match `docs/design/mockups/elune-landing-mockup-v5.html` exactly.
    4. Once the redesign is completed, visually walkthrough each webpage design that was changed, if there is a mistake, fix it before proceeding.  Do this until the result is 100% correct and matches the `DESIGN.md`
    
---
## Guardrails & Negative Constraints
- ❌ **Do NOT overwrite** `DESIGN.md` or any earlier version files of it. 
- ❌ **DO NOT touch or view** any other mockup files other than the `-v5` landing page mentioned above.
- ❌ **Do NOT redesign any file without verifying that the changes you made are correct and didn't break the application**
- ❌ **DO NOT REVIEW OR REFERENCE ANY DOCUMENT IN THE `docs/design/mockups/archived/` DIRECTORY.**

