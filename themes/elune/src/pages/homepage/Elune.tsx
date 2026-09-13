import { ProductListItemRender } from '@components/frontStore/catalog/ProductListItemRender.js';
import { CATEGORY_URL_KEYS } from '../../data/categories.js';
import React from 'react';

interface CategorySummary {
  name: string;
  urlKey: string;
  url: string;
  products?: { total: number; items: ProductListItemData[] };
}

interface ProductListItemData {
  productId: number;
  name: string;
  sku: string;
  url?: string;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string };
  };
  inventory: { isInStock: boolean };
  image?: { url: string; alt?: string };
}

// The four statements, all checkable, none of them a claim about testing.
const TRUST_STATEMENTS = [
  'Tracked & discreet shipping',
  'Crypto payment — BTC, USDT and ETH',
  'Form, storage and purity on every product',
  'Research use only — not for human consumption'
];

const Elune: React.FC<{ categories?: { items?: CategorySummary[] } }> = ({ categories }) => {
  const items = categories?.items ?? [];
  const canonical = CATEGORY_URL_KEYS.map((urlKey) =>
    items.find((category) => category.urlKey === urlKey)
  ).filter((category): category is CategorySummary => Boolean(category));

  // One product from each of the first four categories — the featured row.
  const featured = canonical
    .slice(0, 4)
    .map((category) => category.products?.items?.[0])
    .filter((product): product is ProductListItemData => Boolean(product));

  const primary = canonical.find((category) => category.urlKey === 'recovery') ?? canonical[0];

  return (
    <>
      {/* Offer band: one plain statement, one supporting sentence, one action,
          and the vial photograph bleeding to the band's right edge. */}
      <section className="border-b border-border bg-secondary">
        <div className="grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:py-0">
          {/* `main` already carries .page-width, so the grid's first column
           * starts at the page gutter. ml-6 matches that gutter's 1.5rem and
           * pl-0 cancels the mobile px-4 so the headline lines up with the
           * wordmark, the trust row and every section heading. The column keeps
           * its own pr-10 measure instead of the mobile gutter. */}
          <div className="px-4 lg:ml-6 lg:mr-auto lg:max-w-[600px] lg:py-16 lg:pl-0 lg:pr-10">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Research peptides, with the specification on record for every product.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Five categories of reference compounds. Each product page carries its own
              specification — form, storage, and a purity declaration of &#8805;99%.
            </p>
            {primary && (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={primary.url || `/${primary.urlKey}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline transition-colors duration-150 hover:bg-primary/90"
                >
                  Shop {primary.name}
                </a>
                {/* The headline promises the whole catalog; the filled button can
                 * only enter one category, so the catalog-level path is this
                 * quiet link to the full listing rather than a second button
                 * competing with the primary action. It pointed at the
                 * `#categories` anchor on this page, which is not the listing it
                 * promises — now it reaches /all, which lists every product. */}
                <a
                  href="/all"
                  className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  or browse the full catalog
                </a>
              </div>
            )}
          </div>

          {/* Full-bleed at the band edge, as the direction contract asks.
           *
           * This stretched to the band height before (`lg:h-full
           * lg:self-stretch`), so `object-cover` had to crop 26% of the frame
           * width at 1280px and 44% at 1024px, where the box aspect runs 1.104
           * and 0.837 against a 1.50 asset.
           *
           * That crop was never the cause of the "squashed vial" the owner
           * reported, and the container was not either: `object-cover` scales
           * uniformly and can only ever crop. Measured from the asset, the vial
           * sits between 39.9% and 54% of the frame width and is fully inside
           * the cropped window at every breakpoint, so the crop only removed
           * empty ground. The real cause was the plate itself — its vial had an
           * aspect of 0.245, roughly 1:4.1, against 1:2.5-3 for a real vial, and
           * a cylinder that slim reads as pinched. The plate was regenerated at
           * 0.332 (1:3.0); see the provenance beside the asset.
           *
           * So the stretch behaviour stays as it was: it gives the band a
           * full-bleed plate with no dead space and no tonal seam between the
           * plate's near-white ground and the band's warm sand. Pinning the
           * ratio instead would letterbox the band above and below. */}
          <img
            src="/assets/plates/hero-photo.webp"
            alt="A single clear glass vial with a metal crimp seal on a plain light surface."
            width={1400}
            height={933}
            className="w-full px-4 lg:h-full lg:min-h-[420px] lg:self-stretch lg:object-cover lg:px-0"
          />
        </div>
      </section>

      {/* Four honest statements on a hairline-ruled band. */}
      <section className="page-width" aria-label="How orders are handled">
        <ul className="grid gap-4 border-b border-border py-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {TRUST_STATEMENTS.map((statement) => (
            <li
              key={statement}
              className="text-sm text-muted-foreground lg:px-6 lg:first:pl-0"
            >
              {statement}
            </li>
          ))}
        </ul>
      </section>

      <section id="categories" className="page-width pt-8 pb-12 scroll-mt-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Shop by category
        </h2>
        <ul className="mt-6 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {canonical.map((category) => (
            <li key={category.urlKey}>
              <a
                href={category.url || `/${category.urlKey}`}
                className="flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5 no-underline transition-colors duration-150 hover:border-muted-foreground/40"
              >
                <span
                  className="text-base font-semibold"
                  style={{
                    color: `var(--accent-${category.urlKey.replace(/[^\w-]/g, '')}, var(--foreground))`
                  }}
                >
                  {category.name}
                </span>
                <span className="mt-8 font-mono text-xs text-muted-foreground">
                  {category.products?.total ?? 0}{' '}
                  {category.products?.total === 1 ? 'product' : 'products'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="page-width pb-16">
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Featured products
          </h2>
          <div className="reveal mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductListItemRender
                key={product.productId}
                product={product}
                showAddToCart
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    categories {
      items {
        name
        urlKey
        url
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
    }
  }
`;

export default Elune;
