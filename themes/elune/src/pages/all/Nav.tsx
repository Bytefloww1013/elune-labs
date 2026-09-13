import { CATEGORY_URL_KEYS } from '../../data/categories.js';
import { PRIMARY_LINKS, SECONDARY_LINKS } from '../../data/siteLinks.js';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface CategoryLink {
  name: string;
  urlKey: string;
  url: string;
}

const LINK =
  'whitespace-nowrap text-sm font-medium text-muted-foreground no-underline hover:text-foreground';

/**
 * Header nav: Home, New Releases, Shop (the five categories behind a
 * disclosure), FAQs, Shipping, Contact Us. Rebuilt 2026-09-11 to the owner's
 * requested information architecture; the previous five-category row became the
 * Shop disclosure so the categories stay one click away without six-top-level
 * items crowding the bar at 375px.
 *
 * The disclosure is a native <details>/<summary>, not a scripted menu: it is
 * keyboard-operable, screen-reader-announced, and works with touch for free.
 * Native <details> has no notion of dismissing on an outside click or Escape,
 * though, which is the one thing that would feel broken, so a small effect adds
 * exactly those two behaviours and nothing else.
 */
export default function Nav({ categories }: { categories?: { items?: CategoryLink[] } }) {
  const items = categories?.items ?? [];
  const links = CATEGORY_URL_KEYS.map((key) => items.find((c) => c.urlKey === key)).filter(
    (c): c is CategoryLink => Boolean(c)
  );
  const shopRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const el = shopRef.current;
      if (el?.open && !el.contains(event.target as Node)) {
        el.open = false;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const el = shopRef.current;
      if (event.key === 'Escape' && el?.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('click', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {PRIMARY_LINKS.map((link) => (
        <a key={link.href} href={link.href} className={LINK}>
          {link.label}
        </a>
      ))}

      {links.length > 0 && (
        <details ref={shopRef} className="relative">
          <summary
            className={`${LINK} inline-flex cursor-pointer list-none items-center gap-1`}
          >
            Shop
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          </summary>
          {/* A hairline panel on the card surface — no shadow, per the
           * Flat-By-Default Rule (the age gate is the system's only shadow). */}
          <div className="absolute left-0 z-40 mt-2 min-w-[11rem] rounded-lg border border-border bg-card p-1.5">
            {links.map((category) => (
              <a
                key={category.urlKey}
                href={category.url}
                className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground no-underline hover:bg-secondary hover:text-foreground"
              >
                {category.name}
              </a>
            ))}
          </div>
        </details>
      )}

      {SECONDARY_LINKS.map((link) => (
        <a key={link.href} href={link.href} className={LINK}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 20
};

export const query = `
  query Query {
    categories {
      items {
        name
        urlKey
        url
      }
    }
  }
`;
