# Elune Labs Landing Page Redesign — Design Brief

**Status:** Proposal only. This file does not replace the shipped `DESIGN.md` until approval.
**Target:** `themes/elune` landing page
**Surface mode:** Persuade, constrained by storefront trust and catalog usability
**Creative north star:** **The Documented Counter** — a warm, editorial storefront where product specifications are visible evidence, not decorative science language.

## 1. Discovery Audit

### Product and audience
Elune Labs sells research-use-only reference peptides. The audience is interested but not assumed to be scientifically trained, so the landing page must make category, specification, shipping, and use restrictions easy to understand. The voice is direct, calm, and verifiable. It must not imply clinical efficacy, human use, certification, or testing that the product record cannot substantiate.

### Existing stack
- React/TypeScript within the EverShop theme at `themes/elune`.
- Tailwind CSS v4 bindings in `src/pages/all/tailwind.css`.
- Semantic CSS custom properties in `src/pages/all/shadcn.css`.
- Browser and font rules in `src/pages/all/global.scss`.
- Source Sans 3 and JetBrains Mono are self-hosted; the theme compiles `src` to `dist` with SWC.
- Existing EverShop components and dynamic category/product data remain the production integration path. No new UI library is needed.

### Current visual authority
`DESIGN.md` is the shipped Warm Paper system and explicitly retires the old dark visual world. Its light-only commitment remains binding for this proposal. `PRODUCT.md` contains one stale reference to Aegis-Dark; it is not used as visual authority.

### Brand asset verification
- **Official identity:** the owner has verified the supplied kit in `docs/refs/brand-assets` as Elune Labs’ official brand system. The stacked `ELUNE / LABS` header lockups, compact wordmark variants, cratered moon mark, six favicon PNG sizes, and `favicon.ico` are the mark of record for this redesign.
- **Verified source dimensions:** `website_header_logo_transparent.png` 378×188, `simplified_wordmark_transparent.png` 364×53, and `favicon_master_moon.png` 87×87.
- **Current implementation mismatch:** the one-line wordmark and generated crescent in `BrandMark.tsx`/`public/assets/favicon.svg` are provisional theme artwork, not the official identity. The prototype therefore uses the supplied official header logo and favicon directly.
- **Production handoff:** after this proposal is approved, replace the provisional `BrandMark.tsx` and `public/assets/favicon.svg` identity with the supplied official logo and favicon family.

## 2. 2.AG Benchmark: Structural Translation Only

The reference informs composition, contrast hierarchy, density, elevation, border treatment, and motion—not Elune’s palette, typography, radius language, or product claims. Those departures are explicit because the incumbent system and owner constraints outrank the benchmark.

### Traits translated
- Asymmetric split composition rather than a centered marketing hero.
- Product/specification pairing: the object and its evidence share the first viewport.
- Sparse accent usage, hard hierarchy, generous section rhythm, and full-width bands.
- Hairline borders and tonal surface changes instead of floating shadows.
- Compact tracked labels and mono data as an editorial/scientific indexing device.
- One prominent action and one quiet text route.

### Explicit departures from 2.AG
- **Palette:** 2.AG Deep Teal `#244d54` and Mint Pulse `#2ecea0` are not adopted. Dark bands conflict with Elune’s light-only, warm-and-trustworthy direction; mint would create a second action language beside evergreen `#14604a`.
- **Typography:** Inter Tight is not adopted. Source Sans 3 and JetBrains Mono are already self-hosted, require no third-party request, and remain the only font families.
- **Radius:** 2.AG’s 30–50px pill language is not adopted. Elune’s incumbent 8px ceiling remains intact, with 4–8px optical variation and full circles only for true dots/counters.
- **Content:** product-efficacy statistics, glowing anatomy, wellness cues, and unsupported science claims are not adopted for research-use-only products.

## 3. Design Tokens

### Color

| Role | HEX | HSL | Usage |
|---|---:|---:|---|
| Page / warm paper | `#faf9f7` | `hsl(40 23% 97%)` | Default canvas; never pure white |
| Panel | `#ffffff` | `hsl(0 0% 100%)` | Product, specification, menu, and form surfaces |
| Graphite ink | `#1f1d1a` | `hsl(36 9% 11%)` | Primary text |
| Warm grey | `#6b6558` | `hsl(41 10% 38%)` | Secondary text; WCAG AA on paper and white |
| Hairline | `#e5e0d8` | `hsl(37 20% 87%)` | 1px borders and dividers |
| Recessed sand | `#f2efe9` | `hsl(40 26% 93%)` | Quiet bands, hover and selected surfaces |
| Evergreen action | `#14604a` | `hsl(163 66% 23%)` | Primary CTA, focus ring, caret, selection only |
| Brand ochre | `#8a5a1c` | `hsl(34 66% 33%)` | Crescent and restrained brand detail only |
| Destructive | `#a32a1f` | `hsl(5 68% 38%)` | Errors and cancellation only |
| GLPs | `#1c5f96` | `hsl(207 69% 35%)` | Category identity text only |
| Bioregulators | `#6b4f9e` | `hsl(261 33% 46%)` | Category identity text only |
| Recovery | `#0f6b6b` | `hsl(180 75% 24%)` | Category identity text only |
| GH releasing | `#9a6414` | `hsl(36 77% 34%)` | Category identity text only |
| Other | `#5c6270` | `hsl(222 10% 40%)` | Category identity text only |

**Color rules**
- Light only; no dark theme or dark hero.
- Evergreen is action, not decoration. Ochre is brand, not hover state.
- Category colors identify their named category and do not color buttons, prices, or containers.
- Body text remains at least 4.5:1; large text remains at least 3:1.

### Typography

| Token | Family | Size / line height | Weight | Tracking |
|---|---|---:|---:|---:|
| Display XL | Source Sans 3 | `clamp(3rem, 6vw, 5.5rem) / 0.96` | 600 | `-0.035em` |
| Display | Source Sans 3 | `3rem / 1.1` | 600 | `-0.025em` |
| Heading L | Source Sans 3 | `2.25rem / 1.15` | 600 | `-0.018em` |
| Heading M | Source Sans 3 | `1.875rem / 1.2` | 600 | `-0.011em` |
| Heading S | Source Sans 3 | `1.5rem / 1.2` | 600 | `-0.011em` |
| Title | Source Sans 3 | `1.25rem / 1.25` | 600 | `-0.006em` |
| Body L | Source Sans 3 | `1.125rem / 1.625` | 400 | `0` |
| Body | Source Sans 3 | `1rem / 1.5` | 400 | `0` |
| Label | Source Sans 3 | `0.9375rem / 1.25` | 600 | `0` |
| Micro | Source Sans 3 | `0.8125rem / 1.3` | 400 | `0` |
| Data | JetBrains Mono | `0.875rem / 1.35` | 400–600 | `0` |

- Display copy is left-aligned and balanced to 8–12 words per line.
- Body copy is capped at 65–72 characters.
- JetBrains Mono is reserved for SKU, purity, form, storage, price, counts, and identifiers.
- No synthetic italics or third font.

### Spacing and layout

**Base unit:** 4px.

| Token | Value | Typical use |
|---|---:|---|
| `space-1` | 4px | optical nudge |
| `space-2` | 8px | icon/label gap |
| `space-3` | 12px | compact control gap |
| `space-4` | 16px | mobile gutter, field padding |
| `space-5` | 20px | card padding |
| `space-6` | 24px | desktop gutter, grouped content |
| `space-8` | 32px | block separation |
| `space-12` | 48px | mobile section padding |
| `space-16` | 64px | desktop section padding |
| `space-24` | 96px | major editorial separation |

- Container: `min(1200px, calc(100% - 48px))`; 16px mobile gutters below 640px.
- Desktop grid: 12 columns, 24px gutters. Hero uses 7/5 columns; evidence uses 5/7.
- Tablet: 8 columns, 20px gutters. Mobile: 4 columns, 16px gutters.
- Section padding: 72–96px desktop, 48–64px mobile. Tight groups use 8–20px.

### Radius and elevation

| Token | Value | Use |
|---|---:|---|
| `radius-sm` | 4px | compact tags/data cells |
| `radius-md` | 6px | buttons and controls |
| `radius-lg` | 8px | cards, evidence panels, and product plates |
| `radius-full` | 9999px | true status dot/counter only |

- The incumbent 8px Ceiling Rule remains binding; this proposal does not activate the unused 12px shell token.
- No decorative box shadow. Depth comes from paper/panel contrast and a 1px warm hairline.
- Focus uses a 2px evergreen ring with a 2px paper offset.
- Radius follows scale and function; it is not repeated uniformly.

### Motion
- One authored entrance: hero evidence rows resolve upward over 360ms with 60ms stagger after first paint.
- Hover/focus transitions: 150ms color or border change; no scale animation on controls.
- Respect `prefers-reduced-motion: reduce` and remove all nonessential motion.
- No infinite marquees, parallax, cursor effects, or ambient blob animation.

## 4. Landing Page Component Rules

### Navigation
- 72px desktop / 64px mobile, paper background, one bottom hairline, no shadow.
- Use the supplied stacked header lockup from `docs/refs/brand-assets`; do not redraw it from `BrandMark.tsx`.
- Preserve the owner-approved six-item IA and only real routes: Home (`/`), New Releases (`/new-releases`), Shop disclosure, FAQs (`/faqs`), Shipping (`/shipping`), Contact Us (`/contact`).
- Shop exposes the five live catalog categories one click away. Research-use-only remains an inline/footer notice, not a fake destination.
- Search and Cart remain standard labeled/icon controls; mobile collapses secondary links, not the brand or cart.

### Hero
- 7/5 asymmetric split on paper; never centered.
- Left: concrete value proposition, one explanatory paragraph, filled primary CTA, quiet catalog text link.
- Right: a white product plate containing one vial/object and a visible specification ledger. The image cannot imply lifestyle or human use.
- Hero promise remains: “Research peptides, with the specification on record for every product.”
- Minimum first-viewport evidence: form, storage, purity declaration, and research-use-only status.

### Value props / trust
- Use one ruled horizontal ledger, not floating icon cards.
- Each statement must be operationally verifiable: tracked/discreet shipping, accepted crypto, specification fields, research-use restriction.
- No “lab tested,” “pharmaceutical grade,” efficacy, customer-count, or delivery-speed claim without an approved source.

### Categories / features
- Present categories as an indexed editorial list or table with count and category identity text.
- Avoid five identical rounded cards. Use rules, alignment, and mono counts to communicate browse structure.
- Product features remain attached to the item/specification, not converted into generic benefit marketing.

### Social proof
- No fabricated testimonials, ratings, logos, or customer counts.
- Until verified reviews exist, use a **documentation proof** section: show the repeated product-record fields and explain what a shopper can verify before purchase.
- If verified reviews later exist, show source, reviewer status, date, and moderation policy; quote cards must not claim efficacy or human use.

### Primary CTA
- One filled evergreen action per section; secondary route is an underlined text link.
- 6px radius, minimum 44px target, 600 weight, direct verb + object.
- CTA copy names its destination: “Browse all products” or “Shop Recovery,” never “Learn more” or “Get started.”

### Footer
- Repeats the supplied official logo, catalog routes, shipping/payment routes, and research-use-only notice.
- Compliance text is visible and readable, not reduced below 13px or hidden in low contrast.

## 5. Responsive and Accessibility Requirements

- Mobile source order: headline -> explanation -> CTA -> evidence plate -> trust ledger.
- Hero collapses to one column below 800px; no art-directed content is lost.
- Touch targets are at least 44×44px; navigation and CTA remain keyboard operable.
- Semantic headings remain sequential; sections and navigation receive accessible names.
- The supplied official logo image is decorative when adjacent to an equivalent accessible brand name; the favicon uses the supplied PNG asset.
- Focus is always visible. Color is never the only indicator; category names remain textual.
- Images need factual alt text. Decorative rules and diagrams are hidden from assistive technology.
- Motion is removed for reduced-motion preference.

## 6. Anti-Pattern Guardrails

Do not ship:
- Purple/blue neon blobs, glows, star fields, glassmorphism, or low-contrast blur.
- A centered “Unlock the power of…” hero with two matching pill buttons.
- Repetitive three-column cards with generic icons in pastel circles.
- Uniform radii across controls, cards, images, and bands.
- Dark teal, black, or obsidian hero surfaces; mint as a second CTA color.
- Decorative molecular diagrams, fake seals, fake lab reports, fabricated metrics, testimonials, or partner logos.
- Gradient headline text, giant hollow typography, or pharmaceutical/wellness efficacy cues.
- Shadows used to make every panel float.
- Tiny uppercase copy with excessive tracking, hidden compliance text, or keyboard-invisible controls.

## 7. Prototype Scope and Production Handoff

The companion prototype is `docs/design/landing-redesign-prototype.html`. It is a single no-build HTML/CSS artifact with project-relative self-hosted fonts and supplied brand images; it uses no JavaScript and does not alter production code. It demonstrates desktop and mobile behavior for navigation, hero, specification evidence, trust ledger, categories, documentation proof, CTA, and footer.

After approval, production work should:
1. Replace the landing composition in `themes/elune/src/pages/homepage/Elune.tsx` while preserving dynamic category/product queries.
2. Reuse existing semantic tokens and components; add only the few layout rules the new composition needs.
3. Replace the generated `BrandMark.tsx`/`public/assets/favicon.svg` identity with the supplied brand kit and its existing favicon sizes.
4. Replace `DESIGN.md` with this approved direction only after checking values against the implemented result.
