import React from 'react';

// Wordmark — the only brand mark in the header. The core EverShop demo logo that
// would otherwise sit beside it is suppressed in pages/all/Logo.tsx.
export default function Wordmark() {
  return (
    <a
      href="/"
      className="inline-flex items-center no-underline text-foreground select-none py-1"
    >
      <span className="font-sans font-extrabold tracking-[0.28em] text-xl text-foreground">
        ELUNE<span className="text-brand-ochre ml-1 font-black">LABS</span>
      </span>
    </a>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
