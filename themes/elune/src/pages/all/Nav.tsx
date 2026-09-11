import { CATEGORY_URL_KEYS } from '../../data/categories.js';
import React from 'react';

interface CategoryLink {
  name: string;
  urlKey: string;
  url: string;
}

// Header category nav — the five categories, in order, sitting next to the
// wordmark (the five-category nav the brief's first viewport calls for).
export default function Nav({ categories }: { categories?: { items?: CategoryLink[] } }) {
  const items = categories?.items ?? [];
  const links = CATEGORY_URL_KEYS.map((key) =>
    items.find((category) => category.urlKey === key)
  ).filter((category): category is CategoryLink => Boolean(category));

  return (
    <nav aria-label="Categories" className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {links.map((category) => (
        <a
          key={category.urlKey}
          href={category.url}
          className="whitespace-nowrap text-sm font-medium text-muted-foreground no-underline hover:text-foreground"
        >
          {category.name}
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
