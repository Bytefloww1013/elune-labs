import React from 'react';

// The core module renders the EverShop demo mark in this area, next to the Elune
// wordmark. The theme supplies its own wordmark, so this renders nothing. The
// core query is kept so the `setting` locale/currency data still reaches the rest
// of the header pipeline.
export default function Logo() {
  return null;
}

export const layout = {
  areaId: 'headerMiddleCenter',
  sortOrder: 10
};

export const query = `
  query query {
    setting {
      logo
      logoWidth
      logoHeight
      storeName
    }
  }
`;
