import { fetchClient } from './fetchClient';

export const getcollectionHotelsByMultipleNodes = async (collectionId, { pageNumber, pageSize, searchTerm = '' } = {}) => {
    const query = new URLSearchParams();

    if (pageNumber !== undefined && pageNumber !== null) query.append('pageNumber', pageNumber);
    if (pageSize !== undefined && pageSize !== null) query.append('pageSize', pageSize);
    if (searchTerm) query.append('searchTerm', searchTerm);

    const queryString = query.toString();

    return fetchClient(`/collections/${collectionId}/hotels${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
};

export const getHotelsByCollection = async (collectionId, pageNumber = 1, pageSize = 10) => {
    return fetchClient(`/hotels/${collectionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET'
    });
};

export const getHotelByUrl = async (urlName) => {
    return fetchClient(`/hotels/slug?urlName=${encodeURIComponent(urlName)}`, {
        method: 'GET'
    });
};

export const getHotelRates = async (payload) => {
    return fetchClient('/hotels/rates', {
        method: 'POST',
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
            method: 'GET'
        });

        const apiData = response?.data;
        if (apiData && apiData.hotels) {
            // Return combined object with IDs from API response + hotels array
            return {
                hotels: apiData.hotels,
                cityId: apiData.cityId,
                countryId: apiData.countryId,
                regionId: apiData.regionId,
                totalCount: apiData.totalCount
            };
        }
        return { hotels: [], totalCount: 0 };
    } catch (error) {
        console.error('Error fetching hotel list:', error);
        return { hotels: [], totalCount: 0 };
    }
}
