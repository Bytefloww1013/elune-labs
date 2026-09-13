import { getContextValue, setContextValue } from '@evershop/evershop/graphql/services';

/**
 * Page meta for /all.
 *
 * Mirrors what core's own `homepage/meta.js` does, but through the public
 * package export. `setPageMetaInfo` itself lives in
 * `dist/modules/cms/services/pageMetaInfo.js` and is NOT reachable from an
 * extension — the `@evershop/evershop/cms/services` barrel does not re-export it,
 * and the extension resolves outside node_modules so a relative path into core's
 * dist would be brittle. `@evershop/evershop/graphql/services` does export the
 * `contextHelper`, and `setPageMetaInfo` is nothing but a merge into the
 * `pageInfo` context key — so this does the same thing through a supported
 * import.
 *
 * It MERGES rather than replaces: other middleware can legitimately have already
 * set fields on pageInfo (canonicalUrl, ogInfo, locale), and clobbering them
 * would quietly break canonical links.
 */
export default async (request, response, next) => {
  setContextValue(request, 'pageInfo', {
    ...getContextValue(request, 'pageInfo', {}),
    title: 'All Products',
    description:
      'Every research reference compound in the catalog, with its specification on record. For research use only.'
  });
  next();
};
