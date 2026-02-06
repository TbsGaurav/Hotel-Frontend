import { fetchClient } from './fetchClient';

export const globalSearchapi = async (query) => {
    const json = await fetchClient(`/GlobalSearch/Globalsearch?q=${encodeURIComponent(query)}`, {
        cache: 'no-store'
    });

    return json?.data || [];
};
