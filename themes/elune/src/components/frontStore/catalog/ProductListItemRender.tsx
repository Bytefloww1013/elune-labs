import { getProductSpec } from '../../../data/productSpecs.js';
import { categoryUrlKeyFromProductUrl } from '../../../data/categories.js';
import { Image } from '@components/common/Image.js';
import { toast } from '@components/common/ui/Sonner.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { ReactNode, useRef, useState } from 'react';

// Overlapping saveCart can drop sibling items. Queue the mutation; keep busy local.
let cartMutation = Promise.resolve();
function serializeCartMutation<T>(task: () => Promise<T>): Promise<T> {
  const next = cartMutation.then(task, task);
  cartMutation = next.then(() => {}, () => {});
  return next;
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

/**
 * The drawn long arrow. Every arrow in the system is an SVG path, never a
 * glyph, and `.tlink`/`.btn` only supply the 3px translate on hover — so the
 * one path lives here and is reused wherever a text link needs it.
 */
export function Arrow() {
  return (
    <svg
      className="arw"
      width="15"
      height="12"
      viewBox="0 0 15 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 6h12M9 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The authored vial cutaway — one of the system's exactly two drawings.
 *
 * The catalog ships no product photography (`scripts/catalog-data.json` carries
 * empty image arrays), and the plate is complete without it: the figure is
 * drawn, not photographic, and it never has to be replaced by an empty frame.
 * `currentColor` lets the plate paint it `--slate` from the surrounding text
 * colour, and the labels are part of the drawing (set in the mono face at the
 * drawing's own scale, as the prototype authored them).
 *
 * Exported so the one drawing is never traced twice: any surface that needs it
 * imports this rather than re-authoring the path.
 */
export function VialCutaway() {
  return (
    <svg
      viewBox="0 0 300 176"
      fill="none"
      role="img"
      aria-label="Cutaway diagram of a sealed vial: crimp seal, glass body, lyophilized powder"
      className="m-0 block h-auto w-full"
    >
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="52" y="20" width="32" height="18" rx="3" />
        <path d="M56 26h24M56 31h24" opacity=".5" />
        <rect x="60" y="38" width="16" height="12" />
        <path d="M60 50 40 64M76 50 96 64" />
        <rect x="40" y="64" width="56" height="88" rx="5" />
        <path d="M46 138h44v8H46z" fill="currentColor" stroke="none" opacity=".14" />
        <path d="M46 138h44" opacity=".5" />
        <path d="M84 29h46M96 100h34M90 142h40" opacity=".55" />
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="17" fill="currentColor" letterSpacing="0.2">
        <text x="136" y="35">Crimp seal</text>
        <text x="136" y="105">Glass vial</text>
        <text x="136" y="150">Lyophilized</text>
      </g>
    </svg>
  );
}

/**
 * The catalogue plate — the one product card the whole storefront draws
 * (DESIGN.md, Cards → Catalogue plate).
 *
 * Anatomy top to bottom: a head row (the plate number chip, or the compound's
 * category where a surface has no plate sequence, with the mono identifier in
 * its category accent on the right) → the authored vial cutaway → the product
 * name at the title step → a mono form · size line in slate → a foot row pushed
 * to the bottom by `mt-auto` above a hairline, carrying the mono price, compact
 * Add to cart control, and View link when the product has a URL.
 *
 * `index` is what makes the head a plate number (`Plate 02`): the homepage's
 * catalogue section and its hero carry the sequence, and a surface without one
 * carries the head's other element alone. The compound's category is NOT
 * printed here on browse grids: the normative head row is a chip plus the mono
 * identifier, a category name is longer than the plate chip the mockup drew
 * ("Bioregulators" against "Plate 02"), and at the 4-up grid's narrowest column
 * the pair overflows the card. The category is carried by the identifier's own
 * accent, which is the identity mark DESIGN sanctions for a plate.
 *
 * Every value is a token or a registered utility: no hex literal, no off-step
 * size, no light-side shadow.
 */
export function ProductListItemRender({
  product,
  imageWidth,
  imageHeight,
  customAddToCartRenderer,
  index,
  accent,
  delay
}: {
  product: ProductListItemData;
  imageWidth?: number;
  imageHeight?: number;
  layout?: 'grid' | 'list';
  showAddToCart?: boolean;
  customAddToCartRenderer?: (product: ProductListItemData) => ReactNode;
  /** 1-based plate number for this card's position in a catalogued sequence. */
  index?: number;
  /** `--accent-<urlKey>` to colour the identifier with; normally derived from `product.url`. */
  accent?: string;
  /**
   * Seconds before this plate's entrance, and the only thing that turns `.rise`
   * on. The plate's entrance belongs to the surface rather than the card: the
   * landing's catalogue section is the one authored sequence in the storefront
   * (70ms cadence, its plates at .05/.12/.19/.26 — DESIGN.md, Motion), so it
   * passes this and every browse route passes nothing, which leaves the plate
   * static there. `--d` is the primitive's own variable, and `.rise` already
   * removes itself under reduced motion and in print.
   */
  delay?: number;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const queued = useRef(false);
  const spec = getProductSpec(product.sku);
  const sizeMatch = product.name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu))$/i);
  const size = sizeMatch ? sizeMatch[2] : null;
  const urlKey = accent ?? categoryUrlKeyFromProductUrl(product.url);
  const accentColor = urlKey ? `var(--accent-${urlKey}, var(--slate))` : 'var(--slate)';
  const discounted =
    product.price.special && product.price.special.value < product.price.regular.value;
  // The custom property needs a cast: React's CSSProperties has no index
  // signature for `--x`, the same reason `Elune.tsx` casts its `rise` helper.
  const entrance =
    delay === undefined ? undefined : ({ '--d': `${delay}s` } as React.CSSProperties);

  return (
    <div
      className={`product__list__item__inner flex h-full flex-col rounded-card border border-hairline bg-panel p-4 transition-colors duration-[160ms] hover:border-ash${
        delay === undefined ? '' : ' rise'
      }`}
      style={entrance}
      data-product-sku={product.sku}
    >
      <div className="flex items-center justify-between gap-3 px-1 pt-0.5 pb-2.5">
        {index ? <span className="chip">Plate {String(index).padStart(2, '0')}</span> : null}
        <span className="ml-auto text-sm font-medium" style={{ color: accentColor }}>
          {urlKey
            ? ({
                glps: 'GLPs',
                bioregulators: 'Bioregulators',
                recovery: 'Recovery',
                'gh-releasing': 'GH Releasing',
                other: 'Other'
              } as const)[urlKey]
            : null}
        </span>
      </div>

      <figure className="m-0 px-1 pt-1.5 pb-3.5 text-slate">
        <VialCutaway />
      </figure>

      {product.image && (
        <a href={product.url} className="mb-3 block">
          <Image
            src={product.image.url}
            alt={product.image.alt || product.name}
            width={imageWidth || 400}
            height={imageHeight || 300}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 25vw"
            className="w-full rounded-inner"
          />
        </a>
      )}

      <h3 className="h3 px-1">
        <a href={product.url} className="text-night no-underline">
          {product.name}
        </a>
      </h3>

      {(size || spec?.form) && (
        <p className="mono px-1 pt-1.5 text-slate">
          {[spec?.form, size].filter(Boolean).join(' · ')}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-hairline px-1 pt-4 pb-0.5">
        <span className="font-mono text-price tabular-nums">
          {discounted ? (
            <>
              <span className="mr-2 text-sm text-slate line-through">
                {product.price.regular.text}
              </span>
              <span>{product.price.special?.text}</span>
            </>
          ) : (
            product.price.regular.text
          )}
        </span>

        <div className="product__list__actions ml-auto flex shrink-0 flex-nowrap items-center justify-end gap-3">
          {customAddToCartRenderer ? (
            customAddToCartRenderer(product)
          ) : (
            <AddToCart
              product={{ sku: product.sku, isInStock: product.inventory.isInStock }}
              qty={1}
              onError={(error) => toast.error(error)}
            >
              {(state, actions) => (
                <button
                  type="button"
                  className="btn btn--sm"
                  disabled={!state.canAddToCart || isAdding}
                  aria-busy={isAdding}
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // A queued card is not `isAdding` yet; this stops its own
                    // repeat clicks from stacking extra adds without marking
                    // any sibling busy.
                    if (queued.current) return;
                    queued.current = true;
                    try {
                      await serializeCartMutation(async () => {
                        setIsAdding(true);
                        try {
                          await actions.addToCart();
                        } finally {
                          setIsAdding(false);
                        }
                      });
                    } finally {
                      queued.current = false;
                    }
                  }}
                >
                  {/* Both words stay in the pill so the swap cannot resize it —
                    * the idle one hides while the add is in flight. */}
                  <span className="btn__labels">
                    <span className="btn__label btn__label--idle">
                      {_('Add to cart')}
                    </span>
                    <span className="btn__label btn__label--pending">
                      {_('Adding...')}
                    </span>
                  </span>
                </button>
              )}
            </AddToCart>
          )}
          {product.url && (
            <a className="tlink" href={product.url}>
              {_('View')}
              <Arrow />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
