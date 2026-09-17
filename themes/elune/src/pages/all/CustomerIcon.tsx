/**
 * Core renders a sign-in / account icon into the header's right cluster. The
 * approved header carries no account control: DESIGN.md enumerates the right
 * zone as the cart pill, one filled pill and — below 900px — the menu
 * disclosure, and the prototype's cluster is those three.
 *
 * Suppressing the component rather than hiding its markup keeps the area free of
 * invisible core DOM. The account routes are core's and are untouched: sign-in,
 * register and order history all still resolve, and checkout still links them,
 * so nothing about commerce access changes here — only the header's visual
 * inventory.
 */
export default function CustomerIcon() {
  return null;
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 10
};
