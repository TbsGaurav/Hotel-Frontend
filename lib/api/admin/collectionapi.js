import { fetchClient } from '../public/fetchClient';

export const upsertCollection = async (payload) => {
    return fetchClient('/collections', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};

export const saveContent = async (collectionId, payload) => {
    const response = await fetchClient(`/collections/${collectionId}/content`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    return response;
};
export const getCollectionList = async ({ status, countryId, regionId, cityId }) => {
    const query = new URLSearchParams();

    if (status) query.append('status', status);
    if (countryId) query.append('countryId', countryId);
    if (regionId) query.append('regionId', regionId);
    if (cityId) query.append('cityId', cityId);

    const url = query.toString() ? `/collections?${query.toString()}` : `/collections`;
    try {
        const response = await fetchClient(url);
        return response;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const getGeoNodes = async () => {
    return fetchClient('/masterdropdowns');
};

export const getCitiesByRegistry = async (registryId) => {
    return fetchClient(`/city/citiesByUrlRegistry?registryId=${registryId}`);
};

export const getHotelsByCity = async ({ cityId, search }) => {
    const query = new URLSearchParams();

    if (cityId) query.append('cityId', cityId);
    if (search) query.append('search', search);

    return fetchClient(`/hotels?${query.toString()}`);
};

export const getCitiesByCountryOrRegion = async ({ countryId, regionId }) => {
    console.log(countryId, regionId);

    const query = new URLSearchParams();
    if (countryId) query.append('countryId', countryId);
    if (regionId) query.append('regionId', regionId);

    return fetchClient(`/cities?${query.toString()}`);
};
export const getRegionsByCountry = async (countryId) => {
    return fetchClient(`/regions?countryId=${countryId}`);
};
export const saveRule = async (payload) => {
    const { data } = await fetchClient('/collections/rules', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    return data;
};
export const getRulesByCollectionId = async (collectionId) => {
    const res = await fetchClient(`/collections/rules/${collectionId}`, { method: 'GET' });

    return res;
};

export const updateCollectionStatus = async (collectionId, action) => {
    return fetchClient(`/collections/${collectionId}/status?action=${action}`, {
        method: 'POST'
    });
};
