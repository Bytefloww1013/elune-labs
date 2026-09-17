import React from 'react';

import { getProductSpec, PURITY_DECLARATION } from '../../data/productSpecs';

// Product specification record (DESIGN.md, Specification Table). Values are
// keyed by SKU in data/productSpecs.ts — the single source of truth for the
// analytical record.
//
// Absent values are OMITTED: no empty cell, no dash, no "pending" state. A SKU
// with no record renders no specification section at all.
//
// The purity caveat renders directly below the table, where the `≥99%` figure
// is actually read — never in a footnote and never detached from what it
// qualifies (DESIGN.md, Content Truth & Compliance).
export default function ProductSpecs({
  product
}: {
  product?: { name?: string | null; sku?: string | null } | null;
}) {
  const spec = getProductSpec(product?.sku);
  if (!spec) {
    return null;
  }

  // `mono` marks chemical data (CAS, formula, weight, sequence, the purity
  // declaration); the labels stay in the sans face.
  //
  // The purity value is mono on purpose, and it is the one place DESIGN's table
  // and DESIGN's font note disagree: the table's prose keeps form/purity/storage
  // in the sans face, while the typography section records that the shipped
  // sans subset carries no U+2265 and that "the purity declaration therefore
  // always renders in JetBrains Mono". A `≥` rendered from a face that lacks it
  // falls back to a system font mid-string — the exact defect that made the old
  // build look jagged — so the glyph's face wins over the table's prose.
  const rows: Array<{ label: string; value?: string; mono?: boolean }> = [
    { label: 'CAS Registry Number', value: spec.cas, mono: true },
    { label: 'Molecular formula', value: spec.formula, mono: true },
    {
      label: 'Molecular weight',
      value: spec.molecularWeight ? `${spec.molecularWeight} g/mol` : undefined,
      mono: true
    },
    { label: 'Sequence', value: spec.sequence, mono: true },
    { label: 'Form', value: spec.form },
    { label: 'Purity', value: PURITY_DECLARATION, mono: true },
    { label: 'Storage', value: spec.storage }
  ];

  return (
    <section className="product__single__specification mt-8">
      <h2 className="h3">Specification</h2>
      <table className="product__single__spec__table mt-3 w-full">
        <caption className="sr-only">
          {product?.name
            ? `Analytical specification for ${product.name}`
            : 'Analytical specification'}
        </caption>
        <tbody>
          {rows
            .filter((row) => row.value)
            .map((row) => (
              <tr key={row.label}>
                <th scope="row" className="text-sm text-slate">
                  {row.label}
                </th>
                <td className={row.mono ? 'font-mono break-all' : undefined}>{row.value}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="muted text-micro mt-2">
        The purity value is a product specification, not a batch test result.
      </p>
    </section>
  );
}

export const layout = {
  areaId: 'productSingleDescription',
  sortOrder: 20
};

export const query = `
  query Query {
    product: currentProduct {
      name
      sku
    }
  }
`;
