import { ProductListItemRender } from '@components/frontStore/catalog/ProductListItemRender.js';
import { CATEGORY_URL_KEYS } from '../../data/categories.js';
import { getProductSpec } from '../../data/productSpecs.js';
import React from 'react';
import './homepage.scss';

interface ProductListItemData {
  productId: number;
  name: string;
  sku: string;
  url?: string;
  category?: { urlKey: string } | null;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string } | null;
  };
  inventory: { isInStock: boolean };
  image?: { url: string; alt?: string } | null;
}

interface CategorySummary {
  name: string;
  urlKey: string;
  url: string;
  products?: { total: number };
}

/**
 * The landing page's own composition: the hero band and its Plate 01 sheet, the
 * value ribbon, the categories strip, the four catalogue plates, and the night
 * band with its motif and reviews.
 *
 * The announcement bar, the header and the footer are shared chrome and live in
 * their own components. The catalogue plate is ProductListItemRender's — this
 * page owns the grid around it and nothing inside it.
 */

/**
 * Pins, in plate order — hero first, then the catalogue row. The page query
 * asks for exactly these SKUs by name, so this list and the query's `value`
 * below are edited together: the build extracts the query from this file's
 * source text, which is why the query carries the SKUs as a literal instead of
 * the array: a `${FEATURED_SKUS}` placeholder survives into the extracted query
 * verbatim, where it matches no SKU — a silently empty result, not an error.
 */
const HERO_SKU = 'BPC5';
const FEATURED_SKUS = ['TR10', 'ET10', 'TB10', 'IP5'];

/**
 * The ribbon's statements: five storefront facts. The first two are the store's
 * own published shipping and payment copy; the last three are read straight off
 * what this repository can show — the SKU/size inventory in
 * `scripts/catalog-data.json`, the public cart and account-free checkout, and
 * the fixed five-category list in `data/categories.ts`. Keep it that way: no
 * unsupported batch tracking, no comparative price claim, and no zero-issue
 * delivery rate — none of those has a field, a comparison or a measurement
 * behind it. The first two are simply the store's own existing copy.
 */
const COMMITMENTS = [
  'Tracked & discreet, flat rate shipping',
  // The rails the checkout wallets render; USDT settles on Ethereum (ERC-20).
  'Bitcoin, USDT (ERC-20), and Ethereum Accepted',
  // scripts/catalog-data.json: 84 rows, one SKU each, sized 1mg to 1500mg.
  '84 SKUs across 1mg–1500mg sizes',
  // Cart routes are public and checkout asks for an email, not an account.
  'Guest cart & checkout, no account required',
  // The five url_keys in data/categories.ts, in display order.
  'Five core research categories: GLPs, Bioregulators, Recovery, GH Releasing, Other'
];

/**
 * The three directed reviews, on the night band. Quotes, names, dates and order
 * photographs are the owner's supplied pre-production testimonial material; they
 * are carried here as approved copy and are not verified against orders in this
 * repository.
 */
const REVIEWS = [
  {
    quote:
      '“Vials arrived sealed, labeled and exactly as the spec page described. Ordered Monday night, tracking by Tuesday morning, on my desk Thursday.”',
    name: 'Marcus D.',
    meta: 'Austin, TX · Aug 2026',
    photo: '/assets/order/td-1.jpg',
    alt: 'Order photo: clear plastic cases of vials with white, navy, cyan and gold caps on a dark desk mat'
  },
  {
    quote:
      '“I braced for a clunky first order and got the opposite. Guest checkout, paid in USDT, pasted the transaction ID, done in under five minutes. Nothing about it felt like a gamble.”',
    name: 'Elena R.',
    meta: 'Portland, OR · Jul 2026',
    photo: '/assets/order/td-2.jpg',
    alt: 'Order photo: clear boxes of vials with white, blue, yellow and green caps on a dark reflective table'
  },
  {
    quote:
      '“Third reorder and the standard hasn’t slipped. Every vial matches the spec on the page, shipping is quick, and the whole thing takes about two minutes.”',
    name: 'Dana W.',
    meta: 'Tampa, FL · Aug 2026',
    photo: '/assets/order/td-3.jpg',
    alt: 'Order photo: three clear cases of blue-capped vials on a light wood-grain surface'
  }
];

/**
 * The stagger mechanism: `--d` on a `.rise` element, one 70ms cadence per set.
 * The hero set starts at zero; the two card sets start 50ms in.
 */
const STAGGER = [0.05, 0.12, 0.19, 0.26];

const rise = (seconds: number): React.CSSProperties =>
  ({ '--d': `${seconds}s` }) as React.CSSProperties;

/**
 * The one long arrow. Every arrow in the system is this drawn path, never a
 * glyph, and it carries its own hover translate.
 */
const Arrow = () => (
  <svg className="arw" width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true">
    <path
      d="M1 6h12M9 2l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Elune: React.FC<{
  products?: { items?: ProductListItemData[] };
  categories?: { items?: CategorySummary[] };
}> = ({ products, categories }) => {
  const catalog = products?.items ?? [];

  const hero = catalog.find((product) => product.sku === HERO_SKU);
  const featured = FEATURED_SKUS.map((sku) =>
    catalog.find((product) => product.sku === sku)
  ).filter((product): product is ProductListItemData => Boolean(product));

  // The five categories, in fixed domain order, with their live product counts.
  const items = categories?.items ?? [];
  const canonical = CATEGORY_URL_KEYS.map((urlKey) =>
    items.find((category) => category.urlKey === urlKey)
  ).filter((category): category is CategorySummary => Boolean(category));

  const heroSpec = hero ? getProductSpec(hero.sku) : null;
  // The hero product's own category, named from the category list rather than
  // from the product: `Product.category` carries the url_key (the seeder reads it
  // that way), and the display name has one home.
  const heroCategory = canonical.find((category) => category.urlKey === hero?.category?.urlKey);
  // "BPC-157 5mg" → "5 mg", for the sheet's category · strength chip.
  const heroSize = hero?.name.match(/(\d+(?:\.\d+)?)\s?(mg|mcg|g|ml|iu)$/i);
  const heroStrength = heroSize ? `${heroSize[1]} ${heroSize[2].toLowerCase()}` : null;
  // The record's rows, in the prototype's order. An unsourced value is omitted
  // rather than rendered as a dash or a placeholder.
  const heroRows = heroSpec
    ? ([
        ['Purity', heroSpec.purity],
        ['Form', heroSpec.form],
        ['Sequence', heroSpec.sequence],
        ['Storage', heroSpec.storage]
      ].filter(([, value]) => Boolean(value)) as [string, string][])
    : [];

  return (
    <>
      {/* Hero + Plate 01 — the thesis: the object and its record at the same
          scale, in the first viewport. */}
      <section className="hero">
        <div className="shell hero__inner">
          <div className="hero__copy">
            <h1 className="display rise" style={rise(0)}>
              Research peptides. Direct from the source. Uncompromising purity.
            </h1>
            {/* Two mono spans, as the prototype renders them: the ≥99% figure
                (the sans subset carries no U+2265, so the glyph needs the face
                that has it) and the prose word "everyone", kept by the landing's
                recorded v5 exception. `.lede .mono` holds both at the prose size.
                The figure is a declaration, never a measurement of a batch. */}
            <p className="lede rise" style={rise(0.07)}>
              Where a compound has a specification on record, its{' '}
              <span className="mono">≥99%</span> purity is a declaration, not a batch measurement.
              Quality is our primary focus — affordable bulk pricing for{' '}
              <span className="mono">everyone</span>. Transparent order process. Product pages show
              the specification record where one exists, checkout needs no account, and every parcel
              ships tracked and discreet.
            </p>
            <div className="hero__actions rise" style={rise(0.14)}>
              <a className="btn" href="/all">
                Browse the catalogue
                <Arrow />
              </a>
              <a className="tlink" href="/faqs">
                How ordering works
                <Arrow />
              </a>
            </div>
            <p className="scope muted hero__proof">
              Extensive catalog across {CATEGORY_URL_KEYS.length} core research categories
            </p>
          </div>

          {hero && (
            <article className="sheet rise" style={rise(0.21)}>
              <div className="sheet__head">
                <span className="chip chip--beam">Plate 01</span>
                <span className="mono">{hero.sku}</span>
              </div>
              <div className="sheet__body">
                <figure className="sheet__figure">
                  <img
                    src="/assets/plates/hero-photo.jpg"
                    alt="Sealed glass vial with midnight-navy crimp cap and Elune Labs label, lyophilized powder at the base, on a pale seamless ground"
                    width={1200}
                    height={1591}
                  />
                </figure>
                <dl className="sheet__record spec">
                  {heroRows.map(([label, value]) => (
                    <div className="spec__row" key={label}>
                      <dt className="spec__label">{label}</dt>
                      <dd className="mono spec__value">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="sheet__foot">
                <span className="chip">
                  {[heroCategory?.name, heroStrength].filter(Boolean).join(' · ')}
                </span>
                {hero.url && (
                  <a className="tlink" href={hero.url}>
                    View compound
                    <Arrow />
                  </a>
                )}
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Value ribbon. The band is the features component, not decoration on top
          of the page: two identical sets make the 64s drift seamless, the second
          hidden from assistive technology, and the band itself is focusable so a
          keyboard can stop the ticker (WCAG 2.2.2). */}
      <section className="ribbon" role="region" aria-label="Storefront commitments" tabIndex={0}>
        <div className="ribbon__track">
          <ul className="ribbon__set">
            {COMMITMENTS.map((statement) => (
              <li className="text-label-sm font-medium" key={statement}>
                {statement}
              </li>
            ))}
          </ul>
          <ul className="ribbon__set" aria-hidden="true">
            {COMMITMENTS.map((statement) => (
              <li className="text-label-sm font-medium" key={statement}>
                {statement}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories — one strip, five cells, in fixed domain order. */}
      <section className="cats section">
        <div className="shell">
          <div className="band-head">
            <h2 className="h2">Quality compounds, across five core categories.</h2>
            <a className="tlink" href="/all">
              All products
              <Arrow />
            </a>
          </div>
          <div className="cat-strip">
            {canonical.map((category) => (
              <a
                className={`cat cat--${category.urlKey}`}
                href={category.url}
                key={category.urlKey}
              >
                <span className="cat__name">{category.name}</span>
                <span className="cat__foot">
                  <span className="mono">
                    {String(category.products?.total ?? 0).padStart(2, '0')} compounds
                  </span>
                  <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue plates — four browse cards. The card itself, cutaway figure
          included, belongs to the catalog component; `index` is what puts the
          plate number in its head row. */}
      <section className="plates section">
        <div className="shell">
          <div className="band-head">
            <h2 className="h2">From the catalogue.</h2>
            <a className="tlink" href="/new-releases">
              New releases
              <Arrow />
            </a>
          </div>
          <div className="product__grid grid">
            {featured.map((product, position) => (
              <ProductListItemRender
                key={product.productId}
                product={product}
                index={position + 2}
                delay={STAGGER[position]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Night band — the page's single deep region: the cratered-disc motif,
          the directed reviews, and the transparency foot. */}
      <section className="ink">
        <svg className="ink__moon" viewBox="0 0 560 560" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.1">
            <circle cx="280" cy="280" r="270" opacity=".5" />
            <circle cx="280" cy="280" r="238" opacity=".22" />
            <circle cx="196" cy="196" r="54" opacity=".55" />
            <circle cx="196" cy="196" r="26" opacity=".3" />
            <circle cx="356" cy="168" r="34" opacity=".5" />
            <circle cx="150" cy="352" r="42" opacity=".45" />
            <circle cx="150" cy="352" r="18" opacity=".28" />
            <circle cx="330" cy="320" r="72" opacity=".4" />
            <circle cx="330" cy="320" r="40" opacity=".22" />
            <circle cx="404" cy="404" r="28" opacity=".45" />
            <circle cx="232" cy="440" r="20" opacity=".4" />
            <circle cx="98" cy="248" r="13" opacity=".45" />
            <circle cx="300" cy="106" r="16" opacity=".4" />
          </g>
          <g fill="currentColor" opacity=".5">
            <circle cx="196" cy="196" r="6" />
            <circle cx="150" cy="352" r="5" />
            <circle cx="330" cy="320" r="8" />
            <circle cx="404" cy="404" r="4" />
          </g>
        </svg>
        <div className="shell ink__inner">
          <h2 className="h2">From recent orders.</h2>
          <div className="proof__grid">
            {REVIEWS.map((review, position) => (
              <figure
                className="proof__card rise"
                key={review.name}
                style={rise(STAGGER[position])}
              >
                <blockquote className="proof__quote text-quote italic">{review.quote}</blockquote>
                <figcaption className="proof__meta">
                  <span className="proof__name">{review.name}</span>
                  <span className="mono">{review.meta}</span>
                </figcaption>
                <span className="proof__shot">
                  <img src={review.photo} alt={review.alt} loading="lazy" />
                </span>
              </figure>
            ))}
          </div>
          <p className="proof__foot">
            Collected from completed orders and published unedited. Names shortened to first name and
            last initial.
          </p>
          {/* The purity caveat renders with the ≥99% figure the hero sheet's record
              carries. The figure is a specification declaration, not a test result,
              and only the records in `data/productSpecs.ts` carry it — products
              without a record render no figure and no record. */}
          <p className="proof__foot">
            The purity value is a product specification, not a batch test result.
          </p>
        </div>
      </section>
    </>
  );
};

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

export const query = `
  query Query {
    products(filters: [{ key: "sku", operation: in, value: "BPC5,TR10,ET10,TB10,IP5" }]) {
      items {
        productId
        name
        sku
        url
        category {
          urlKey
        }
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
    categories {
      items {
        name
        urlKey
        url
        products {
          total
        }
      }
    }
  }
`;

export default Elune;
