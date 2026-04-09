import { fetchClient } from './fetchClient';

export const getCitiesByRegion = async (countrySlug, regionSlug) => {
    const urlName = encodeURIComponent(`/${countrySlug}/${regionSlug}`);
    return fetchClient(`/regions/${urlName}`);
};
