import React from 'react';

// Category accent bar (design 8-2 §2.4) — color keyed by category url_key
// via CSS custom properties (--accent-peptides teal, --accent-sarms amber,
// --accent-nootropics green). Unknown keys fall back to lavender --accent.
export default function CategoryAccent({
  category
}: {
  category?: { urlKey?: string } | null;
}) {
  // urlKey is DB-derived; strip to [\w-] so it can only name a CSS variable.
  const urlKey = String(category?.urlKey ?? '').replace(/[^\w-]/g, '');
  const accentVar = urlKey
    ? `var(--accent-${urlKey}, var(--accent))`
    : 'var(--accent)';

  return (
    <div
      style={{
        borderBottomColor: accentVar,
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid'
      }}
      className="pb-2"
    />
  );
}

export const query = `
  query Query {
    category: currentCategory {
      urlKey
    }
  }
`;

export const layout = {
  areaId: 'content',
  sortOrder: 5
};
