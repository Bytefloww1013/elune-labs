import React from 'react';

export default function Wordmark() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-2.5 no-underline text-foreground select-none group py-1"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
      </span>
      <span className="font-sans font-extrabold tracking-[0.28em] text-xl text-foreground">
        ELUNE<span className="text-accent ml-1 font-black">LABS</span>
      </span>
    </a>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
