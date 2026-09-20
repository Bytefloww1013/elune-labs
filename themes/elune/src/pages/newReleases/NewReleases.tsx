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
 * /new-releases — what was added to the catalog most recently.
 *
 * Bounded to the newest few rather than the whole catalog. The `products`
 * collection already returns rows newest-first (descending `product_id`), so an
 * unbounded version rendered all 14 in the same order as /all and the two nav
 * labels led to the same page. A "new releases" page that lists everything is
 * not a new-releases page.
 *
 * Ordering is done here rather than by the query: 2.2.1's `products` collection
 * exposes no creation-date sort argument, and a `sort:` the resolver silently
 * ignores would be worse than none, because the page would look right while
 * quietly not sorting. `product_id` is an ascending identity column, so
 * newest-first is a descending sort on it.
 *
 * There is no publication date on a product, so this is honest about what it
 * is: the newest entries by catalog order, not a dated release feed. Cards use
 * the storefront's shared catalogue actions.
 */
const NEW_RELEASE_COUNT = 6;

const NewReleases: React.FC<{ products?: { total?: number; items?: ProductListItemData[] } }> = ({
  products
}) => {
  const items = [...(products?.items ?? [])]
    .sort((a, b) => b.productId - a.productId)
    .slice(0, NEW_RELEASE_COUNT);

  return (
    <div className="section">
      <h1 className="h2">New releases</h1>
      <p className="lede mt-3">The most recently added reference compounds in the catalog.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-card border border-hairline bg-mist p-6">
          <h2 className="h3">Nothing is listed yet</h2>
          <p className="muted mt-2">
            No compounds are published in the catalog right now. They appear here as soon as one
            is.
          </p>
          <a className="tlink mt-4 inline-flex" href="/all">
            View all products
            <Arrow />
          </a>
        </div>
      ) : (
        <>
          {/* The grid owns its own <h2> so the outline runs h1 → h2 → h3. */}
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

export default NewReleases;
