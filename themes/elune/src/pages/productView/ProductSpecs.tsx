import React from 'react';

import { getProductSpec, PURITY_DECLARATION } from '../../data/productSpecs';

// Product specification record (design 8-2 §1.4). Values are keyed by SKU in
// data/productSpecs.ts — the single source of truth for the analytical record.
//
// Absent values are OMITTED: no empty cell, no dash, no "pending" state. A SKU
// with no record renders no specification section at all.
export default function ProductSpecs({
  product
}: {
  product?: { name?: string | null; sku?: string | null } | null;
}) {
  const spec = getProductSpec(product?.sku);
  if (!spec) {
    return null;
  }

  // `mono` marks chemical data (CAS, formula, weight, sequence); labels stay in
  // the sans face.
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
    { label: 'Purity', value: PURITY_DECLARATION },
    { label: 'Storage', value: spec.storage }
  ];

  return (
    <section className="product__single__specification mt-8">
      <h3 className="mb-3 text-xl font-semibold tracking-tight">
        Specification
      </h3>
      <table className="w-full text-sm">
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
                <th
                  scope="row"
                  className="w-2/5 py-2.5 pr-4 text-left align-top font-normal text-muted-foreground"
                >
                  {row.label}
                </th>
                <td
                  className={`py-2.5 align-top text-foreground ${row.mono ? 'font-mono break-all' : ''}`}
                >
                  {row.value}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
