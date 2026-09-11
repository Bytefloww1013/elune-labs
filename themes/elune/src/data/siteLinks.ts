// The storefront's non-catalog destinations — a fixed domain fact, matching the
// convention in ./categories.ts. The header and the footer both need the same
// list, so it lives here once rather than being spelled out in each.
//
// `primary` sits at the head of the header nav; the Shop disclosure covers the
// categories, which come from the catalog query; `secondary` closes both the
// header nav and the footer link row.
//
// Every href here must resolve. The page routes are CMS pages seeded by
// scripts/seed-catalog.mjs (`/faqs`, `/shipping`, `/contact`); `/all` and
// `/new-releases` are the elune-catalog extension's routes. A link to a page
// that does not exist is worse than no link, so keep this list in step with what
// actually ships.
export interface SiteLink {
  label: string;
  href: string;
}

export const PRIMARY_LINKS: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'New Releases', href: '/new-releases' }
];

export const SECONDARY_LINKS: SiteLink[] = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Contact Us', href: '/contact' }
];
