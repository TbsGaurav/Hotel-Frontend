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

export const getHotelsByCity = async ({ cityId, searchTerm = '' }) => {
    const query = new URLSearchParams();

    if (cityId) query.append('cityId', cityId);
    if (searchTerm) query.append('search', searchTerm);

    return fetchClient(`/hotels?${query.toString()}`);
};

export const getCitiesByCountryOrRegion = async ({ countryId, regionId, searchTerm = '' }) => {
    const query = new URLSearchParams();
    if (countryId) query.append('countryId', countryId);
    if (regionId) query.append('regionId', regionId);
    if (searchTerm) query.append('searchTerm', searchTerm);

    return fetchClient(`/cities?${query.toString()}`);
};

export const getRegionsByCountry = async (countryId, searchTerm = '') => {
    return fetchClient(`/regions?countryId=${countryId}&searchTerm=${searchTerm}`);
};

export const saveRule = async (payload) => {
    return await fetchClient('/collections/rules', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
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

export const saveCuration = async (payload) => {
    return await fetchClient('/collections/curations', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
