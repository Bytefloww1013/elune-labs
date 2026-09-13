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
