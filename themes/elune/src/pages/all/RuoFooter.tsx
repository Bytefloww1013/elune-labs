import React from 'react';

// RUO compliance disclaimer — every storefront page (design 8-2 §1.4).
export default function RuoFooter() {
  return (
    <p className="text-sm text-muted-foreground">
      For research use only. Not for human consumption.
    </p>
  );
}

export const layout = {
  areaId: 'footerBottom',
  sortOrder: 5
};
