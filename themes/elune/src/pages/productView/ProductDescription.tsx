import { getProductLiterature } from '../../data/productLiterature.js';
import React from 'react';

/**
 * What the compound is, plus the published research that describes it. Renders
 * between the price and the specification table, so a product page reads
 * description -> specification -> research-use notice.
 *
 * COMPLIANCE — why the literature is framed the way it is.
 *
 * This block sits beside a price and an add-to-cart button, so a bare list of
 * studies reads as evidence for the item in the cart. That would breach two
 * standing rules at once: the brief's "no verification claims, no certificate
 * affordance", and DESIGN.md's "if a document does not exist in this repository,
 * the surface does not reference it". The studies are real, but none is about
 * this product, this batch, or any analysis of either — no certificate of
 * analysis exists for anything in this catalog.
 *
 * So the section is titled as external research on the COMPOUND, and states
 * before the list what it does and does not document. The global RUO footer is
 * not sufficient cover: this is adjacent to one specific purchasable item, so the
 * qualification is adjacent too.
 *
 * It is also kept structurally unlike the specification table — no ruled cells,
 * no borders, nothing resembling the analytical record — so the two cannot be
 * mistaken for one another.
 *
 * The heading is "About this compound" rather than "Product Description" on
 * purpose. Core's ProductSingleDescription renders its own "Product Description"
 * <h3> into this same area; it is hidden only while the product row has no
 * description (global.scss hides `.product__single__description:has(...:empty)`).
 * Reusing that heading would put two identical headings on the page the moment
 * an operator filled the description field in admin.
 *
 * The class `product__single__description` is likewise never used here — that is
 * the class global.scss keys the hide on, so reusing it would hide this too.
 */
export default function ProductDescription({
  product
}: {
  product?: { name?: string | null; sku?: string | null } | null;
}) {
  const narrative = getProductLiterature(product?.sku);
  if (!narrative) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-semibold tracking-tight">About this compound</h2>

      {narrative.summary.map((paragraph, index) => (
        <p key={index} className="mt-3 max-w-[70ch] leading-relaxed text-foreground first:mt-0">
          {paragraph}
        </p>
      ))}

      {narrative.literature && narrative.literature.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">
            Published research on this compound
          </h3>
          {/* States what the list is and is not, before the list is read. */}
          <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
            These are published studies describing the compound itself. They document the
            external research literature — not this product, not the batch supplied, and not any
            analysis of it. No certificate of analysis is published for any product in this
            catalog, and nothing below is a test result.
          </p>
          {/* A citation is a navigation, so it is a plain list of links. No ruled
           * cells and no borders: the specification table is the ruled record,
           * and this must not read as part of it. */}
          <ul className="mt-3 space-y-2">
            {narrative.literature.map((ref) => (
              <li key={ref.url} className="text-sm leading-relaxed">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {ref.title}
                </a>
                <span className="block text-muted-foreground">{ref.source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export const layout = {
  areaId: 'productSingleDescription',
  sortOrder: 15
};

export const query = `
  query Query {
    product: currentProduct {
      name
      sku
    }
  }
`;
