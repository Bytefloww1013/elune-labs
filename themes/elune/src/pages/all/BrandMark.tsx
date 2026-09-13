import React from 'react';

/**
 * The Elune mark: a crescent.
 *
 * A lunar mark for a store named Elune — restrained geometry that is legible at
 * 16px as a favicon and at 24px beside the wordmark, and that sits outside the
 * lab-cold register the brand explicitly refuses (a flask or a molecular glyph
 * would read institutional, which PRODUCT.md rules out for this audience).
 *
 * Geometry: a crescent is the difference of two circles. Outer circle r=9 about
 * (12,12); inner circle r=8.2 about (16.4,12). Their intersections are at
 * x=15.764, y=12±8.175. The arc flags are not guesses — all four combinations
 * were rendered and compared: only this pair (outer large-arc 1 / sweep 0, inner
 * 0 / 1) yields a crescent rather than a lens or a disc, and it survived
 * downsampling to 16px best. The `translate` recentres the mark, whose raw
 * bounding box runs x 3..15.764.
 *
 * Filled with `currentColor` so the caller sets the hue — the header uses brand
 * ochre. Deliberately NOT evergreen: DESIGN.md's Evergreen-Is-Action Rule
 * reserves `--primary` for the primary action, focus ring, selection and caret,
 * and a logo is none of those.
 *
 * The same path ships as public/assets/favicon.svg. Keep the two in step.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(2.62 0)">
        <path d="M15.764 3.825 A9 9 0 1 0 15.764 20.175 A8.2 8.2 0 0 1 15.764 3.825 Z" />
      </g>
    </svg>
  );
}
