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
 * /all — every product in the catalog.
 *
 * This is the destination the homepage's "browse the full catalog" link and the
 * footer's "All Products" link both point at. The route itself is supplied by the
 * elune-catalog extension (themes cannot register routes in EverShop); this is
 * the body it renders, and the theme binds to the route by folder name.
 *
 * Cards come from the same ProductListItemRender the homepage uses, so a product
 * looks identical wherever it appears.
 *
 * Sorted by name here. The `products` collection returns rows in descending
 * `product_id` — i.e. newest-first — which is exactly what /new-releases wants and
 * what made this page redundant with it. A full catalog is for finding a known
 * compound, so it reads better alphabetically, and the two pages then each do one
 * job. A `sort:` argument on the query would be silently ignored by the resolver,
 * which is worse than sorting here.
 */
const AllProducts: React.FC<{ products?: { total?: number; items?: ProductListItemData[] } }> = ({
  products
}) => {
  const items = [...(products?.items ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="page-width py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        All products
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? 'reference compound' : 'reference compounds'}, each
        with its full specification on the product page.
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

export default AllProducts;
