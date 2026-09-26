import { Area } from '@components/common/index.js';
import { ProductList } from '@components/frontStore/catalog/ProductList.js';
import { SearchProductsPagination } from '@components/frontStore/catalog/SearchProductsPagination.js';
import { useSearch } from '@components/frontStore/catalog/SearchContext.js';
import React from 'react';

/**
 * Theme override gives the results grid its missing second heading level so
 * the route outline runs from SearchInfo's `h1` to product-name `h3`s.
 *
 * Core's SearchPage never mounts SearchProductsPagination (CategoryView does),
 * so hits past the first page were unreachable. Mounted here, after the grid;
 * skipped when the keyword fits one page because the default renderer has no
 * single-page guard and would print a lone "1".
 */
export function SearchProducts() {
  const { products } = useSearch();
  const limit =
    Number(
      products.currentFilters.find((filter) => filter.key === 'limit')?.value
    ) || 20;

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
      />
      <Area id="searchProductsAfter" noOuter />
      {products.total > limit && <SearchProductsPagination />}
    </>
  );
}
