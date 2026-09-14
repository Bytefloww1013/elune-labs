# Role & Objective
You are a Principal Product Designer and Design Systems Architect. Before writing any production code, conduct a discovery audit of the current project and author a comprehensive Design Brief (DESIGN.md or DESIGN-mockup.md) along with a visual prototype for the landing page redesign.  This is a redesign, feel free to try something new.  The bar is high, AAA quality is expected.  Do not settle for less.
---
## Workflow & Steps

### Phase 1: Project & Context Discovery
1. Audit Project Stack: Inspect repository configuration files (package.json, styling setup such as Tailwind/CSS modules/styled-components, component libraries, typography configs). Ensure all design choices directly integrate with the existing tech stack.
2. Context & Tone: 
   1. **Product's value proposition:** 
     - Peptide supplier ecommerce store that prides itself on straight forward, honest, and quality products.
   2. **target audience:**
     - Biohackers and health enthusiasts looking for high-quality peptides.
     - Health conscious individuals, fitness enthusiasts, and hobbyists
     - Non-scientists, non-medical professionals, and regular people who want beleive they should be able to have access to high quality and pure products   
   3. **brand voice:**
     - Modern, clear, beleif in autonomy, smart, and trustworthy
   4. **Brand Asset Verification:**
      - Inspect docs/refs/brand-assets (or fallback to docs/refs/).
        - Locate and verify available brand assets, specifically logos (SVG/PNG) and favicons.
        - Located at `docs/refs/website-examples` there is 3 website screenshots.  Those screenshots give a general idea of what I am going for.  I obviously want you to create a unique design.
### Phase 2: Visual Direction & Style Reference
- **Primary Visual Benchmark: Analyze the Seed design language referenced at:**
`https://styles.refero.design/style/cd723d5a-e7ea-4e4c-a3bb-6cf56e05057a`
- Extract and adapt key patterns: composition, contrast hierarchy, layout density, elevation, border treatments, and motion/interaction style.  You can also review the DESIGN.md, Css variables, design tokens, and other info on that web page.
### Phase 3: Create the Design Brief (DESIGN.md DESIGN-mockup.md)
1. **Design Tokens**:
   - **Color Palette**: Semantic roles (background, surface, borders, text primary/muted, accents) with exact HEX/HSL values matching the reference.
   - **Typography Scale**: Font families, weights, font sizes, line heights, and letter spacing.
   - **Spacing & Layout Scale**: Base spacing units, grid/container max-widths, and padding rules.
   - **Elevation & Radius**: Border radii rules, shadow tokens, and surface depth guidelines.
2. **Component Rules**: Layout guidelines for Hero, Navigation, Value Props/Features, Social Proof, and Primary CTA.
3. **Anti-Pattern Guardrails:**
   - Explicitly list and avoid generic "AI-generated" UI patterns, including:
   - Floating purple/blue neon gradient blobs with low contrast text.  BUT do not be afraid of using bold colors
   - Warm paper design systems.
   - Tans and browns as a colors
   - Repetitive 3-column card grids with centered generic icons inside pastel circles
   - Uniform border radiuses on every single element ignoring optical balance.
   - Overuse of glassmorphism/blur effects that compromise readability and accessibility (WCAG AA compliance required).
4. **Avoid Overwriting of Existing DESIGN.md**: 
   - If a DESIGN.md exists, please put your results in a DESIGN-mockup.md file until you get approval to start write code.  Once approval is gained, you can use  DESIGN-mockup.md to create the DESIGN.md
### Phase 4: Visual Mockup / Prototype
- Present a concrete visual sample of your proposed design incorporating the verified brand assets (logo and favicon).
   - **Format**: Generate a self-contained, high-fidelity visual HTML/CSS mockup (or use an image generation tool if available in your toolset) showcasing the hero and primary section styling.
### ⛔ Hard Stop Checkpoint
Do NOT write any application code, refactor existing files, or implement the landing page yet. Stop here, present the design brief and visual mockup, and await explicit user review and approval.