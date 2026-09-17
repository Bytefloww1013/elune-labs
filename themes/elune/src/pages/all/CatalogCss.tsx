import React from 'react';
import './catalog.scss';

/**
 * Loads the catalog/product/category/CMS presentation stylesheet.
 *
 * Same mechanism as `GlobalCss.tsx` (the head-area sibling that loads
 * global.scss): the stylesheet is a module side effect, and this component
 * renders nothing. It is separate from global.scss because these rules are
 * owned by the catalog surface — they target core's product page, core's
 * category route and the CMS page shell, not the storefront shell.
 */
export default function CatalogCss() {
  return null;
}

export const layout = {
  areaId: 'head',
  sortOrder: 6
};
