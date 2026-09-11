import { getProductSpec } from '../../../data/productSpecs.js';
import { Image } from '@components/common/Image.js';
import { Button } from '@components/common/ui/Button.js';
import { toast } from '@components/common/ui/Sonner.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { ReactNode } from 'react';

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

// Text-led product card. The catalog ships no product images, so the card is
// complete on name, size, spec and price alone: the image element is rendered
// only when the product actually has one — never an empty thumbnail frame.
export function ProductListItemRender({
  product,
  imageWidth,
  imageHeight,
  showAddToCart = false,
  customAddToCartRenderer
}: {
  product: ProductListItemData;
  imageWidth?: number;
  imageHeight?: number;
  layout?: 'grid' | 'list';
  showAddToCart?: boolean;
  customAddToCartRenderer?: (product: ProductListItemData) => ReactNode;
}) {
  const spec = getProductSpec(product.sku);
  const sizeMatch = product.name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu))$/i);
  const name = sizeMatch ? sizeMatch[1] : product.name;
  const size = sizeMatch ? sizeMatch[2] : null;
  const discounted =
    product.price.special && product.price.special.value < product.price.regular.value;

  return (
    <div className="product__list__item__inner group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-150 hover:border-muted-foreground/40">
      {product.image && (
        <a href={product.url} className="mb-4 block">
          <Image
            src={product.image.url}
            alt={product.image.alt || name}
            width={imageWidth || 400}
            height={imageHeight || 300}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 25vw"
            className="w-full rounded-md"
          />
        </a>
      )}

      <h3 className="product__list__name text-base font-semibold tracking-tight">
        <a href={product.url} className="text-foreground no-underline hover:text-primary">
          {name}
        </a>
      </h3>

      {(size || spec) && (
        <p className="product__list__spec mt-1 font-mono text-xs text-muted-foreground">
          {[size, spec?.form].filter(Boolean).join(' · ')}
        </p>
      )}

      <p className="product__list__price mt-3 font-mono text-lg text-foreground">
        {discounted ? (
          <>
            <span className="mr-2 text-sm text-muted-foreground line-through">
              {product.price.regular.text}
            </span>
            <span className="font-semibold">{product.price.special?.text}</span>
          </>
        ) : (
          <span className="font-semibold">{product.price.regular.text}</span>
        )}
      </p>

      {spec && (
        <p className="product__list__identity mt-1 font-mono text-xs text-muted-foreground">
          {spec.purity} · {product.sku}
        </p>
      )}

      {showAddToCart && (
        <div className="product__list__actions mt-auto pt-4 border-t border-border">
          {customAddToCartRenderer ? (
            customAddToCartRenderer(product)
          ) : (
            <AddToCart
              product={{ sku: product.sku, isInStock: product.inventory.isInStock }}
              qty={1}
              onError={(error) => toast.error(error)}
            >
              {(state, actions) => (
                <Button
                  className="w-full"
                  disabled={!state.canAddToCart || state.isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.addToCart();
                  }}
                >
                  {state.isLoading ? _('Adding...') : _('Add to Cart')}
                </Button>
              )}
            </AddToCart>
          )}
        </div>
      )}
    </div>
  );
}
