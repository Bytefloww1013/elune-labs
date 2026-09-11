import React from 'react';

// RUO compliance notice on product pages (design 8-2 §1.4).
export default function RuoNotice() {
  return (
    <div className="my-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200/90 flex items-start gap-3">
      <span className="text-amber-400 font-bold text-base shrink-0 leading-none mt-0.5">⚠</span>
      <div>
        <span className="font-semibold text-amber-300 block uppercase tracking-wider text-[11px] mb-0.5">
          Laboratory Research Notice (RUO)
        </span>
        This chemical compound is synthesized strictly for in-vitro laboratory experimentation and analytical reference. Not for human, clinical, or veterinary administration.
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 60
};
