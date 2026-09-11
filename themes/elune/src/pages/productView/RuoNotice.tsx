import React from 'react';

// RUO compliance notice on product pages (design 8-2 §1.4).
export default function RuoNotice() {
  return (
    <div className="my-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex items-start gap-3">
      <div>
        <span className="font-semibold text-amber-900 block uppercase tracking-wider text-[11px] mb-0.5">
          Laboratory Research Notice (RUO)
        </span>
        This chemical compound is supplied strictly for in-vitro laboratory experimentation and analytical reference. Not for human, clinical, or veterinary administration.
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 60
};
