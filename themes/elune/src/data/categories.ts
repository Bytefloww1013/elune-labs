// The store's five categories, in display order — a fixed domain fact, not a
// property of the database. `urlKey` is the catalog key and the source of the
// per-category accent token (`--accent-<urlKey>`).
//
// Live data may briefly hold retired categories (the 2.2.1 trio); render from
// this list so a stale row can never appear and the five can never drift.
export const CATEGORY_URL_KEYS = [
  'glps',
  'bioregulators',
  'recovery',
  'gh-releasing',
  'other'
] as const;

export type CategoryUrlKey = (typeof CATEGORY_URL_KEYS)[number];

export function isCategoryUrlKey(value?: string | null): value is CategoryUrlKey {
  return Boolean(value) && (CATEGORY_URL_KEYS as readonly string[]).includes(value as string);
}

/**
 * The compound's category, read from its product URL.
 *
 * EverShop builds a product's url as `/<category url_key>/<product url_key>`
 * (e.g. `/recovery/bpc-157-5mg`), and the first segment is the same key the
 * accent token is built from. The product's own `categories` field resolves to
 * null through the collection resolver, so the URL segment is the one
 * catalogue-accurate signal a catalogue plate actually receives — it is exact
 * data from the catalog, not a guess, and a URL whose first segment is not one
 * of the five known keys yields null rather than a wrong hue.
 */
export function categoryUrlKeyFromProductUrl(url?: string | null): CategoryUrlKey | null {
  if (!url) return null;
  const [segment] = url.split(/[?#]/)[0].split('/').filter(Boolean);
  return isCategoryUrlKey(segment) ? segment : null;
}
