import React from 'react';

/**
 * The header lockup: the approved raster brand mark, at 48px display height.
 *
 * This replaces the generated crescent (`BrandMark.tsx`) the theme shipped
 * before the v5 redesign. The mark is a pure-black raster with no vector source,
 * so it is never recoloured, filtered or tinted — the palette keeps its ink
 * near-neutral precisely so the black mark sits natively beside the type.
 *
 * `website_header_logo_transparent.png` is 378×188 (ink bbox 354×177, ≈2:1), the
 * highest-resolution asset in the kit, so 48px is a downscale with no
 * pixelation. `width`/`height` carry the intrinsic ratio so the header never
 * reflows while the image loads; the stylesheet sets the displayed height.
 *
 * The image is decorative: the link carries the accessible name, so the brand is
 * announced once rather than twice.
 */
export default function Wordmark() {
  return (
    <a className="brand" href="/" aria-label="Elune Labs — home">
      <img
        src="/assets/brand/website_header_logo_transparent.png"
        alt=""
        width={378}
        height={188}
      />
    </a>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
