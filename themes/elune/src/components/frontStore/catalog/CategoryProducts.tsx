import Area from '@components/common/Area.js';
import { useCategory } from '@components/frontStore/catalog/CategoryContext.js';
import { ProductList } from '@components/frontStore/catalog/ProductList.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

/**
 * Theme override of core's CategoryProducts. One delta, marked below: the list
 * is drawn without the buy pill.
 *
 * Core hard-codes `showAddToCart={true}` here (and in SearchProducts), and core
 * also passes it from the category AND search routes, so a card cannot decide
 * this for itself — the flag has to be turned off where the browse lists are
 * configured. DESIGN.md gives the browse card the quiet "View" text link and
 * allows a filled "Add to cart" pill on /all only, the one catalogue the store
 * sells from directly; /all and /new-releases render their grids in the theme's
 * own pages and pass the flag themselves.
 */
export function CategoryProducts() {
  const { showProducts, products } = useCategory();
  if (!showProducts) {
    return null;
  }
  return (
    <>
      <Area
        id="categoryProductsBefore"
        className="category__products__before"
      />
      <div>
        <ProductList
          products={products.items}
          layout="grid"
          gridColumns={3}
          showAddToCart={false}
        />
        <span className="product-count mt-5 block text-sm text-muted-foreground">
          {_('${count} products', { count: products.total.toString() })}
        </span>
      </div>
      <Area id="categoryProductsAfter" className="category__products__after" />
    </>
  );
}
