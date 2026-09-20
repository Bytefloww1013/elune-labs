import {
  Arrow,
  ProductListItemRender
} from '@components/frontStore/catalog/ProductListItemRender.js';
import React from 'react';

interface ProductListItemData {
  productId: number;
  name: string;
  sku: string;
  url?: string;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string } | null;
  };
  inventory: { isInStock: boolean };
  image?: { url: string; alt?: string } | null;
}

/**
 * /all — every product in the catalog, alphabetical by name.
 *
 * This is the destination the homepage's "browse the full catalogue" link and
 * the header's Shop disclosure both point at. The route itself is supplied by
 * the elune-catalog extension (themes cannot register routes in EverShop); this
 * is the body it renders, and the theme binds to the route by folder name.
 *
 * Cards come from the same ProductListItemRender the homepage's catalogue
 * section uses, so a compound has the same Add to cart and View actions
 * wherever it appears.
 *
 * Sorted by name here. The `products` collection returns rows in descending
 * `product_id` — i.e. newest-first — which is exactly what /new-releases wants
 * and what made this page redundant with it. A full catalog is for finding a
 * known compound, so it reads better alphabetically, and the two pages then
 * each do one job. A `sort:` argument on the query would be silently ignored by
 * the resolver, which is worse than sorting here.
 */
const AllProducts: React.FC<{ products?: { total?: number; items?: ProductListItemData[] } }> = ({
  products
}) => {
  const items = [...(products?.items ?? [])].sort((a, b) => a.name.localeCompare(b.name));
  const count = items.length;

  return (
    <div className="section">
      <h1 className="h2">All products</h1>
      <p className="lede mt-3">
        <span className="mono">{count}</span>{' '}
        {count === 1 ? 'reference compound' : 'reference compounds'}, each with its full
        specification on the product page.
      </p>

      {count === 0 ? (
        <div className="mt-8 rounded-card border border-hairline bg-mist p-6">
          <h2 className="h3">Nothing is listed yet</h2>
          <p className="muted mt-2">
            No compounds are published in the catalog right now. They appear here as soon as one
            is.
          </p>
          <a className="tlink mt-4 inline-flex" href="/">
            Browse the categories
            <Arrow />
          </a>
        </div>
      ) : (
        <>
          {/*
           * The grid owns its own <h2> so the outline runs h1 → h2 → h3 without
           * a level skip; the heading itself is redundant to a sighted reader,
           * who can already see a grid of cards under the route title.
           */}
          <h2 className="sr-only">Catalogue</h2>
          <div className="product__grid mt-6 grid">
            {items.map((product) => (
              <ProductListItemRender key={product.productId} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    products {
      total
      items {
        productId
        name
        sku
        url
        price {
          regular {
            value
            text
          }
          special {
            value
            text
          }
        }
        inventory {
          isInStock
        }
        image {
          url
          alt
        }
      }
    }
  }
`;

export default AllProducts;
