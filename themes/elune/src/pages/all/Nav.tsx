import {
  orderCategories,
  PRIMARY_LINKS,
  SECONDARY_LINKS,
  type CategoryLink
} from '../../data/siteLinks.js';
import React, { useEffect, useRef } from 'react';
import './chrome.scss';

/**
 * Header navigation: the seven destinations the design approves — Home · New
 * releases · Shop (the five categories behind a disclosure) · FAQs · Payments ·
 * Shipping · Contact us.
 *
 * Payments resolves to `/faqs`, the page that documents how the storefront is
 * paid; there is no `/payments` route to link to, and a link to a page that does
 * not exist is worse than no link.
 *
 * The Shop disclosure is a native <details>/<summary>, not a scripted menu: it
 * is keyboard-operable, screen-reader-announced, and works with touch for free.
 * Native <details> has no notion of dismissing on an outside click or Escape,
 * though, which is the one thing that would feel broken, so `useDismissableDetails`
 * adds exactly those two behaviours and nothing else.
 *
 * Below 900px this row is hidden and the same destinations move into the pill
 * disclosure in the right cluster (see MiniCartIcon.tsx), so nothing becomes
 * unreachable on a phone.
 */
export default function Nav({ categories }: { categories?: { items?: CategoryLink[] } }) {
  const shops = orderCategories(categories?.items ?? []);
  const shop = useRef<HTMLDetailsElement>(null);
  useDismissableDetails(shop);

  return (
    <nav className="nav-links" aria-label="Primary">
      {PRIMARY_LINKS.map((link) => (
        <a key={link.label} href={link.href}>
          {link.label}
        </a>
      ))}

      {shops.length > 0 && (
        <details className="menu" ref={shop}>
          <summary>
            Shop
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none" aria-hidden="true">
              <path
                d="M1 1.5 5 5.5 9 1.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="menu-panel">
            {shops.map((category) => (
              <a key={category.urlKey} href={category.url}>
                {category.name}
                {typeof category.products?.total === 'number' && (
                  <span className="mono">{String(category.products.total).padStart(2, '0')}</span>
                )}
              </a>
            ))}
          </div>
        </details>
      )}

      {SECONDARY_LINKS.map((link) => (
        <a key={link.label} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Escape and an outside click close a native <details> disclosure.
 *
 * Shared by the header's Shop menu and the phone-sized menu in
 * MiniCartIcon.tsx: both are disclosures that would otherwise stay open until
 * something else was clicked, and both need the same two behaviours, so the
 * handlers live in one place. Escape returns focus to the summary, because a
 * disclosure that swallowed focus on close would be a keyboard trap.
 */
export function useDismissableDetails(ref: React.RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const element = ref.current;
      if (element?.open && !element.contains(event.target as Node)) {
        element.open = false;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const element = ref.current;
      if (event.key === 'Escape' && element?.open) {
        element.open = false;
        element.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('click', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [ref]);
}

export const layout = {
  areaId: 'headerMiddleCenter',
  sortOrder: 20
};

export const query = `
  query Query {
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
