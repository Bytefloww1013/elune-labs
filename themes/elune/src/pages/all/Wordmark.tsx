import React from 'react';

export default function Wordmark() {
  return (
    <span className="font-sans font-bold tracking-[0.35em] text-2xl">
      ELUNE{'\u00a0'}<span className="text-accent">LABS</span>
    </span>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
