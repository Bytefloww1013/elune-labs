import { Button } from '@components/common/ui/Button.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

/**
 * The empty cart's shell — the core component at this @components path, kept
 * verbatim except for its heading.
 *
 * Core opens the empty state with an `<h2>`, which leaves /cart as the one
 * storefront route whose page carries no `<h1>` at all: the filled state's title
 * is an h1 ("Your cart"), so a visitor who lands on an empty cart gets an outline
 * that starts at level two. The element is promoted to `<h1>` and carries the
 * same `shopping-cart-title` hook the filled state's title carries, so both
 * states of the route expose exactly one top-level heading.
 *
 * No utility class is added. The theme's global `h1` rule already sets the
 * headline step — the same step the global `h2` rule was giving this string — so
 * the reading is unchanged and only the outline is fixed.
 *
 * Everything else is core's: the wrapper, the inline offset, the copy, and the
 * button that sends the visitor home. Behavior is untouched; this is a
 * presentation-only @components override, which resolves ahead of core's copy in
 * the theme's component resolution order.
 */
export function ShoppingCartEmpty() {
  return (
    <div
      className="empty-shopping-cart w-full flex justify-center"
      style={{ marginTop: '150px' }}
    >
      <div>
        <div className="text-center shopping-cart-heading">
          <h1 className="shopping-cart-title">{_('Shopping cart')}</h1>
        </div>
        <div className="mt-5 text-center">
          <span>{_('Your cart is empty!')}</span>
        </div>
        <div className="flex justify-center mt-5">
          <Button size="lg" onClick={() => (window.location.href = '/')}>
            <span className="flex space-x-2">
              <span className="self-center uppercase">
                {_('Continue shopping')}
              </span>{' '}
              <svg
                className="self-center"
                style={{ width: '2rem', height: '2rem' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}