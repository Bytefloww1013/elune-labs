import BrandMark from './BrandMark.js';
import React from 'react';

/**
 * Wordmark — the brand lockup, and the only brand mark in the header. The core
 * EverShop demo logo that would otherwise sit beside it is suppressed in
 * pages/all/Logo.tsx.
 *
 * Rebuilt 2026-09-11 with the mark and from weights that actually exist. It
 * previously asked for `font-extrabold` and `font-black` against a loaded set
 * topping out at 700, so the browser synthesized two heavier weights — recorded
 * as drift in DESIGN.md and a real reason the lockup looked uneven. Now both
 * halves sit at 700 and the distinction is carried by colour, which is the
 * brand's actual device: ELUNE in graphite, LABS in ochre.
 *
 * The tracking is 0.18em rather than the previous 0.28em. Wide tracking on
 * uppercase adds a trailing space after the final letter, which pushes the
 * lockup off-centre against whatever follows it; the negative right margin
 * removes exactly that much space again so the mark sits optically flush. This
 * is the same class of detail as the underline offset — the part of the type
 * that is drawn rather than inherited.
 */
export default function Wordmark() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2.5 no-underline text-foreground select-none py-1"
    >
      <BrandMark className="h-[1.45rem] w-[1.45rem] shrink-0 text-brand-ochre" />
      <span className="font-sans font-bold tracking-[0.18em] -mr-[0.18em] text-xl text-foreground">
        ELUNE<span className="text-brand-ochre ml-1.5">LABS</span>
      </span>
    </a>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
