import {
  ALL_PRODUCTS_LINK,
  INFORMATION_LINKS,
  orderCategories,
  PAYMENT_RAILS,
  PRIMARY_LINKS,
  type CategoryLink
} from '../../data/siteLinks.js';
import React from 'react';

/**
 * The footer: the approved lockup and one line of positioning, then three link
 * columns — Catalogue, Information, Payment — over a hairline.
 *
 * Every destination that exists is in one place here, so a visitor never has to
 * scroll back to the header. Categories come from the catalog query rather than
 * being written out, so a retired-and-reseeded category cannot leave a dead link
 * behind; the page links come from the shared site-links module the header also
 * reads. The payment rails are destinations rather than per-rail pages — how an
 * order is paid lives on the FAQ page and at checkout.
 *
 * The column labels are `h3` beneath a visually hidden `h2` for the footer
 * navigation, so the outline never skips a level. The lockup is decorative
 * (`alt=""`, `aria-hidden`) because the brand is already announced once, by the
 * header's own link.
 */
export default function FooterNav({ categories }: { categories?: { items?: CategoryLink[] } }) {
  const shops = orderCategories(categories?.items ?? []);

  return (
    <div className="foot-grid">
      <div className="foot-brand">
        <img
          src="/assets/brand/website_header_logo_transparent.png"
          alt=""
          aria-hidden="true"
          width={378}
          height={188}
        />
        <p className="muted">
          Research reference compounds, catalogued with their specification on record.
        </p>
      </div>

      <h2 className="sr-only">Footer navigation</h2>

      <div className="foot-col">
        <h3>Catalogue</h3>
        <ul>
          <li>
            <a href={ALL_PRODUCTS_LINK.href}>{ALL_PRODUCTS_LINK.label}</a>
          </li>
          <li>
            <a href={PRIMARY_LINKS[1].href}>{PRIMARY_LINKS[1].label}</a>
          </li>
          {shops.map((category) => (
            <li key={category.urlKey}>
              <a href={category.url}>{category.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="foot-col">
        <h3>Information</h3>
        <ul>
          {INFORMATION_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="foot-col">
        <h3>Payment</h3>
        <ul>
          {PAYMENT_RAILS.map((rail) => (
            <li key={rail.label}>
              <a href={rail.href}>{rail.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
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