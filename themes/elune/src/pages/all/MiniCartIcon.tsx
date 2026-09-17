import { useCartState } from '@components/frontStore/cart/CartContext.js';
import {
  ALL_PRODUCTS_LINK,
  orderCategories,
  PRIMARY_LINKS,
  SECONDARY_LINKS,
  type CategoryLink
} from '../../data/siteLinks.js';
import React, { useRef } from 'react';
import { useDismissableDetails } from './Nav.js';

/**
 * The header's right cluster: the cart pill, one filled pill, and — below 900px
 * — the menu disclosure that carries every destination plus the five categories
 * (DESIGN.md, Links & Navigation).
 *
 * This is the theme's override of core's MinicartIcon. The count is real, not a
 * mockup number: it comes from the same cart context the checkout reads, so it
 * reflects the session's actual quantity and hides itself at zero.
 *
 * The core search box and account icon that would otherwise share this area are
 * suppressed in pages/all/SearchBox.tsx and pages/all/CustomerIcon.tsx: the
 * design ships no search field, and the approved cluster is these three controls.
 */
export default function MiniCartIcon({
  cartUrl,
  categories
}: {
  cartUrl: string;
  categories?: { items?: CategoryLink[] };
}) {
  const { data: cart } = useCartState();
  const total = cart?.totalQty ?? 0;
  const shops = orderCategories(categories?.items ?? []);
  const menu = useRef<HTMLDetailsElement>(null);
  useDismissableDetails(menu);

  return (
    <>
      <a className="minicart" href={cartUrl} aria-label={`Cart, ${total} items`}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M2 3h2l1.6 8.2a1.4 1.4 0 0 0 1.4 1.1h6.2a1.4 1.4 0 0 0 1.35-1.03L16 6H5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="15" r="1.15" fill="currentColor" />
          <circle cx="13.5" cy="15" r="1.15" fill="currentColor" />
        </svg>
        {total > 0 && <span className="minicart__count">{total > 99 ? '99+' : total}</span>}
      </a>

      {/* "Shop all" is the header's own label for the catalogue; the same route
       * is named "All products" in the menus and the footer. */}
      <a className="btn btn--sm" href={ALL_PRODUCTS_LINK.href}>
        Shop all
      </a>

      <details className="mob" ref={menu}>
        <summary aria-label="Open menu">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path
              d="M1 1.5h14M1 6h14M1 10.5h14"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </summary>
        <div className="menu-panel">
          {PRIMARY_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href={ALL_PRODUCTS_LINK.href}>{ALL_PRODUCTS_LINK.label}</a>
          {shops.map((category) => (
            <a key={category.urlKey} href={category.url}>
              {category.name}
              {typeof category.products?.total === 'number' && (
                <span className="mono">{String(category.products.total).padStart(2, '0')}</span>
              )}
            </a>
          ))}
          {SECONDARY_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </details>
    </>
  );
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 20
};

export const query = `
  query Query {
    cartUrl: url(routeId: "cart")
    categories {
      items {
        name
        urlKey
        url
        products {
          total
        }
      }
    }
  }
`;
