/**
 * Core renders a search box into the header's right cluster. This storefront
 * ships no search: DESIGN.md's Links & Navigation states it plainly — "There is
 * no search field, no mega-menu and no blur" — and the approved cluster is the
 * cart pill, one filled pill and the phone-sized menu disclosure.
 *
 * Suppressing the component rather than hiding its markup keeps the area free of
 * invisible core DOM. Nothing else depends on the query it made: the `/search`
 * route itself is core's and still resolves, it simply has no entry point in
 * this header.
 */
export default function SearchBox() {
  return null;
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 5
};
