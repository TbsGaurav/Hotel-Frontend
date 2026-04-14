import { fetchClient } from './fetchClient';

export const getcollectionHotelsByMultipleNodes = async (collectionId, { pageNumber, pageSize, searchTerm = '' } = {}) => {
    const query = new URLSearchParams();

    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);
    if (searchTerm) query.append('searchTerm', searchTerm);

    const queryString = query.toString();

    const response = fetchClient(`/collections/${collectionId}/hotels${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
    return normalizeHotelListResponse(response);
};

export const getHotelsByCollection = async (collectionId, pageNumber = 1, pageSize = 10) => {
    const response = await fetchClient(`/hotels/${collectionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET'
    });
    return normalizeHotelListResponse(response);
};

export const getHotelByUrl = async (urlName) => {
    return fetchClient(`/hotels/slug?urlName=${encodeURIComponent(urlName)}`, {
        method: 'GET'
    });
};

export const getHotelRates = async (payload) => {
    return fetchClient('/hotels/rates', {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(payload)
    });
};

export const saveCustomerReview = async (payload) => {
    return fetchClient('/hotels/review', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};

export async function getHotelList(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const normalizedUrlName = String(urlName || '').replace(/^\/+/, '');
        const encodedUrlName = encodeURIComponent(normalizedUrlName);
        const response = await fetchClient(`/hotels/list?urlName=${encodedUrlName}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
            next: { revalidate: 900 }
        });

        const normalized = normalizeHotelListResponse(response);

        return {
            hotels: normalized.hotels,
            totalCount: normalized.totalCount,
            cityId: response?.data?.cityId,
            countryId: response?.data?.countryId,
            regionId: response?.data?.regionId
        };
    } catch (error) {
        console.error('Error fetching hotel list:', error);
        return { hotels: [], totalCount: 0 };
    }
}

function normalizeHotelListResponse(response) {
    const root = response?.data ?? response ?? {};

    const hotels = root?.hotelData || root?.hotels || (Array.isArray(root) ? root : []);

    return {
        hotels,
        totalCount: root?.totalCount ?? hotels.length ?? 0,
        currentPage: root?.currentPage ?? root?.pageNumber ?? 1,
        pageSize: root?.pageSize ?? 10
    };
}
