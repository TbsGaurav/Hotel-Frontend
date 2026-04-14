import { fetchClient } from '../public/fetchClient';

function toFiniteNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function firstArray(candidates = []) {
    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;
    }
    return [];
}

/* ---------------- NORMALIZERS ---------------- */

function normalizeHotelListResponse(response) {
    const root = response?.data ?? response ?? {};

    const hotels = firstArray([
        Array.isArray(root) ? root : null,
        root?.hotels,
        root?.hotelData,
        root?.collectionPreviewHotels,
        root?.data
    ]);

    const currentPage = toFiniteNumber(root?.currentPage ?? root?.pageNumber, 1);
    const pageSize = toFiniteNumber(root?.pageSize, 10);
    const totalCount = toFiniteNumber(root?.totalCount, hotels.length);

    const totalPages =
        toFiniteNumber(root?.totalPages, null) ?? (pageSize && totalCount !== null ? Math.ceil(totalCount / pageSize) : null);

    const hasNextPage = typeof root?.hasNextPage === 'boolean' ? root.hasNextPage : totalPages ? currentPage < totalPages : false;

    return {
        hotels,
        currentPage,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage
    };
}

function normalizeHotelSearchResponse(response) {
    const root = response?.data ?? response ?? {};

    const hotels = firstArray([root?.hotels, root?.data, Array.isArray(root) ? root : null]);

    return {
        hotels
    };
}

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

export const getHotelsByCity = async ({ geoNodeType, geoNodeId, searchTerm = '', collectionId = null, pageNumber, pageSize }) => {
    const query = new URLSearchParams();

    query.append('geoNodeType', geoNodeType);
    query.append('geoNodeId', geoNodeId);

    if (searchTerm) query.append('searchTerm', searchTerm);
    if (collectionId !== null && collectionId !== undefined) query.append('collectionId', collectionId);
    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);

    const response = await fetchClient(`/hotels?${query.toString()}`);
    return normalizeHotelListResponse(response);
};

export const searchHotelsGlobally = async (queryText) => {
    const response = await fetchClient(`/Hotels/search?q=${encodeURIComponent(queryText)}`);
    return normalizeHotelSearchResponse(response);
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
    const normalizedUrl = String(urlName || '').replace(/^\/+/, '');
    return fetchClient(`/collections/${normalizedUrl}`, {
        method: 'GET'
    });
};

export const getcollectionHotelsByMultipleNodes = async (collectionId, { pageNumber, pageSize, searchTerm = '' } = {}) => {
    const query = new URLSearchParams();

    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);
    if (searchTerm) query.append('searchTerm', searchTerm);

    const queryString = query.toString();

    const response = await fetchClient(`/collections/${collectionId}/hotels${queryString ? `?${queryString}` : ''}`, {
        method: 'GET'
    });
    return normalizeHotelListResponse(response);
};

export const getPreviewHotels = getcollectionHotelsByMultipleNodes;
