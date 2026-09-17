import { Area } from '@components/common/index.js';
import { ProductList } from '@components/frontStore/catalog/ProductList.js';
import { useSearch } from '@components/frontStore/catalog/SearchContext.js';
import React from 'react';

/**
 * Theme override of core's SearchProducts. Two deltas, both marked below.
 *
 * 1. The buy pill is off (`showAddToCart={false}`), as on every browse list:
 *    core passes `true` from the search route too, and DESIGN.md allows the
 *    filled pill on /all only, giving the browse card the quiet "View" link.
 * 2. The results grid owns the route's second heading level. Core's search page
 *    runs the `h1` (SearchInfo) straight into the plates' `h3` names, skipping a
 *    level; this `h2` is real text for the outline and nothing for the eye, the
 *    same pattern the theme's own catalogue pages use.
 */
export function SearchProducts() {
  const { products } = useSearch();

  return (
    <>
      <h2 className="sr-only">Results</h2>
      <Area id="searchProductsBefore" noOuter />
      {/* Re-skin (2026-07-10): 4-col grid (reference) — the result count lives in
          the SearchInfo heading, so no separate italic count line. */}
      <ProductList
        products={products.items}
        layout="grid"
        gridColumns={4}
        showAddToCart={false}
      />
      <Area id="searchProductsAfter" noOuter />
    </>
  );
}
