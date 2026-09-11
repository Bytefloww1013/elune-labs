import { ProductListItemRender } from '@components/frontStore/catalog/ProductListItemRender.js';
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
 * labels led to the same page. A "new releases" page that lists everything is not
 * a new-releases page.
 *
 * Ordering is done here rather than by the query: 2.2.1's `products` collection
 * exposes no creation-date sort argument, and a `sort:` the resolver silently
 * ignores would be worse than none, because the page would look right while
 * quietly not sorting. `product_id` is an ascending identity column, so
 * newest-first is a descending sort on it.
 *
 * There is no publication date on a product, so this is honest about what it is:
 * the newest entries by catalog order, not a dated release feed.
 */
const NEW_RELEASE_COUNT = 6;

const NewReleases: React.FC<{ products?: { total?: number; items?: ProductListItemData[] } }> = ({
  products
}) => {
  const items = [...(products?.items ?? [])]
    .sort((a, b) => b.productId - a.productId)
    .slice(0, NEW_RELEASE_COUNT);

  return (
    <div className="page-width py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        New releases
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The most recently added reference compounds in the catalog.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Nothing is listed yet.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductListItemRender key={product.productId} product={product} showAddToCart />
          ))}
        </div>
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
