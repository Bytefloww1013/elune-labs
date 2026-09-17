import React from 'react';

/**
 * The catalogue's second level on the category routes.
 *
 * Core's category page runs the `h1` (the category name, drawn by CategoryInfo)
 * straight into the filter panel's `h3` ("Filters") and then each plate's own
 * `h3` name, so the outline skips a level on all five category routes. The
 * heading is redundant to a sighted reader — the two columns below it are
 * self-evident — so it is real text for the outline and nothing for the eye,
 * exactly as the grid's own `h2` is on /all and /new-releases.
 *
 * Registered into `afterCategoryInfo`, the area core opens between the `h1`
 * block and the columns, which is the only position that puts the `h2` ahead of
 * the first `h3`.
 */
export default function CatalogueHeading() {
  return <h2 className="sr-only">Catalogue</h2>;
}

export const layout = {
  areaId: 'afterCategoryInfo',
  sortOrder: 5
};
