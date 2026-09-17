import React from 'react';

/**
 * The footer's base row: the research-use-only line on the left, the copyright
 * and currency line on the right in mono (DESIGN.md, Footer).
 *
 * It renders as the two halves of `.footer__bottom`, which chrome.scss lays out
 * as one hairline-topped flex row. The core grid that also lands in this area —
 * Visa/Mastercard/PayPal marks for rails this store does not accept, plus a
 * copyright string the design replaces — is taken out of the flow there rather
 * than here, so this component owns only the copy the design actually ships.
 *
 * The RUO string is fixed and unaltered: it is the same sentence every surface
 * uses, it is never shortened or paraphrased, and it is not dimmed below AA.
 */
export default function RuoFooter() {
  return (
    <>
      <p>For research use only. Not for human consumption.</p>
      <p className="mono">© 2026 Elune Labs · Prices in USD</p>
    </>
  );
}

export const layout = {
  areaId: 'footerBottom',
  sortOrder: 5
};