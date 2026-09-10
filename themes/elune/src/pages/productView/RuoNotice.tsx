import React from 'react';

// RUO compliance notice on product pages (design 8-2 §1.4).
export default function RuoNotice() {
  return (
    <div className="border border-accent rounded-lg p-4 text-sm text-muted-foreground">
      For research use only. Not for human consumption.
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 60
};
