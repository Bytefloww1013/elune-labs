// The storefront's non-catalog destinations — a fixed domain fact, matching the
// convention in ./categories.ts. The header, the footer and the phone-sized menu
// all need the same list, so it lives here once rather than being spelled out in
// each.
//
// `primary` sits at the head of the header nav; the Shop disclosure covers the
// categories, which come from the catalog query; `secondary` closes the header
// nav, and the footer's Information column is that same set minus Payments,
// because the rails have a column of their own there.
//
// Every href here must resolve. `/all` and `/new-releases` are the elune-catalog
// extension's routes; `/faqs`, `/shipping` and `/contact` are CMS pages seeded
// by scripts/seed-catalog.mjs. **Payments is not a route** — the storefront
// takes payment by hand and `/faqs` is the page that documents how, so the
// Payments destination and the payment rails point at that page rather than at a
// /payments route this theme cannot render. A link to a page that does not exist
// is worse than no link, so keep this list in step with what actually ships.
import { CATEGORY_URL_KEYS } from './categories.js';

export interface SiteLink {
  label: string;
  href: string;
}

/** A catalog category, carrying the live count the Shop menu prints. */
export interface CategoryLink {
  name: string;
  urlKey: string;
  url: string;
  /** Live count from the catalog query (`products { total }`). */
  products?: { total: number };
}

export const PRIMARY_LINKS: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'New releases', href: '/new-releases' }
];

export const ALL_PRODUCTS_LINK: SiteLink = { label: 'All products', href: '/all' };

export const SECONDARY_LINKS: SiteLink[] = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Payments', href: '/faqs' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Contact us', href: '/contact' }
];

// The three rails the storefront accepts, in the footer's Payment column. These
// are destinations, not per-rail pages: how an order is paid, and which rail is
// accepted, live in prose on the FAQ page and at checkout. USDT settles on
// Ethereum (ERC-20) — the network label is copy, and it stays in step with the
// checkout rail it describes.
export const PAYMENT_RAILS: SiteLink[] = [
  { label: 'Bitcoin', href: '/faqs' },
  { label: 'USDT (ERC-20)', href: '/faqs' },
  { label: 'Ethereum', href: '/faqs' }
];

/** The footer's Information column: the shared links minus Payments, which the
 * design keeps in the header nav only — the payment rails have their own column,
 * so repeating the destination there would list it twice (DESIGN.md 830-831).
 * Filtering the shared list rather than writing a second array keeps the two in
 * step by construction. */
export const INFORMATION_LINKS: SiteLink[] = SECONDARY_LINKS.filter(
  (link) => link.label !== 'Payments'
);

/**
 * The five categories in fixed domain order, carrying live counts.
 *
 * Keyed against what the catalog actually returns, so a retired-and-reseeded
 * category cannot leave a dead link behind, and ordered from this list so the
 * menu can never drift from the canonical order.
 */
export function orderCategories(items: CategoryLink[]): CategoryLink[] {
  return CATEGORY_URL_KEYS.map((key) => items.find((c) => c.urlKey === key)).filter(
    (c): c is CategoryLink => Boolean(c)
  );
}

// A category row prints its count as the design draws it — two digits in mono,
// tabular — and prints nothing when the catalog returned no count rather than a
// fabricated `00`.
