import { CATEGORY_URL_KEYS } from '../../data/categories.js';
import { PRIMARY_LINKS, SECONDARY_LINKS } from '../../data/siteLinks.js';
import React from 'react';

interface CategoryLink {
  name: string;
  urlKey: string;
  url: string;
}

/**
 * Footer page links (owner's review, 2026-09-11): every page on the site in one
 * place, so a visitor does not have to go back up to the header.
 *
 * Categories come from the catalog query rather than being written out, so a
 * category that is retired and re-seeded cannot leave a dead link behind; the
 * non-catalog pages come from the shared site-links module the header also uses.
 * `/all` is included here and not in the header — it duplicates the Shop
 * disclosure, but as a footer link it is the fast path to everything.
 */
export default function FooterNav({ categories }: { categories?: { items?: CategoryLink[] } }) {
  const items = categories?.items ?? [];
  const categoryLinks = CATEGORY_URL_KEYS.map((key) =>
    items.find((c) => c.urlKey === key)
  ).filter((c): c is CategoryLink => Boolean(c));

  const links = [
    ...PRIMARY_LINKS,
    { href: '/all', label: 'All Products' },
    ...categoryLinks.map((c) => ({ href: c.url, label: c.name })),
    ...SECONDARY_LINKS
  ];

  return (
    <nav aria-label="Site" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="whitespace-nowrap text-sm font-medium text-muted-foreground no-underline hover:text-foreground"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export const layout = {
  areaId: 'footerMiddleCenter',
  sortOrder: 10
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
