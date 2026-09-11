import { getContextValue, setContextValue } from '@evershop/evershop/graphql/services';
/**
 * Page meta for /new-releases. Same approach as allProducts/meta.js — see the
 * note there for why this goes through `@evershop/evershop/graphql/services`
 * rather than core's internal `setPageMetaInfo`.
 */ export default (async (request, response, next)=>{
    setContextValue(request, 'pageInfo', {
        ...getContextValue(request, 'pageInfo', {}),
        title: 'New Releases',
        description: 'The most recently added research reference compounds in the Elune Labs catalog. For research use only.'
    });
    next();
});
