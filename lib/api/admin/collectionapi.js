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

export const getCollectionList = async ({ status, geoNodeType, sourceId, pageNumber, pageSize }) => {
    const query = new URLSearchParams();

    if (status) query.append('status', status);
    if (geoNodeType) query.append('geoNodeType', geoNodeType);
    if (sourceId) query.append('sourceId', sourceId);
    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);

    return fetchClient(`/collections?${query.toString()}`);
};

export const getHotelsByCity = async ({ geoNodeType, geoNodeId, searchTerm = '', collectionId = null }) => {
    const query = new URLSearchParams();

    query.append('geoNodeType', geoNodeType);
    query.append('geoNodeId', geoNodeId);

    if (searchTerm) query.append('searchTerm', searchTerm);
    if (collectionId !== null && collectionId !== undefined) query.append('collectionId', collectionId);

    return fetchClient(`/hotels?${query.toString()}`);
};

export const searchHotelsGlobally = async (queryText) => {
    return fetchClient(`/Hotels/search?q=${encodeURIComponent(queryText)}`);
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

export const getRulesByCollectionId = async (collectionId) => {
    return fetchClient(`/collections/rules/${collectionId}`, {
        method: 'GET'
    });
};

export const getContentByCollectionId = async (collectionId) => {
    return fetchClient(`/collections/${collectionId}/content`, {
        method: 'GET'
    });
};

export const getCurationByCollectionId = async (collectionId) => {
    return fetchClient(`/collections/curations/${collectionId}`, {
        method: 'GET'
    });
};

export const getCollectionById = async (collectionId) => {
    return fetchClient(`/collections/${collectionId}`, {
        method: 'GET'
    });
};

export const getDistrictsByCity = async (cityId, searchTerm = '') => {
    return fetchClient(`/districts?cityId=${cityId}&searchTerm=${searchTerm}`);
};

export const cloneCollection = async (collectionId) => {
    return fetchClient(`/collections/${collectionId}/clone`, {
        method: 'POST'
    });
};

export const deleteCollection = async (collectionId) => {
    return fetchClient(`/collections/${collectionId}`, {
        method: 'DELETE'
    });
};

export const getCategoryList = async () => {
    return fetchClient(`/categories`, {
        method: 'GET'
    });
};

export const getCollectionByUrl = async (urlName) => {
    return fetchClient(`/collections/${urlName}`, {
        method: 'GET'
    });
};

export const getPreviewHotels = async (collectionId) => {
    return fetchClient(`/collections/${collectionId}/preview`, {
        method: 'GET'
    });
};
