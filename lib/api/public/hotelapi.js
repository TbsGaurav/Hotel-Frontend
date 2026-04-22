import { fetchClient } from './fetchClient';

function safeDecodeURIComponent(value = '') {
    try {
        return decodeURIComponent(value);
    } catch {
        return String(value || '');
    }
}

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

function parseGetHotelListArgs(arg2, arg3, arg4) {
    // Preferred signature:
    // getHotelList(urlName, { countryId, pageNumber, pageSize })
    if (arg2 && typeof arg2 === 'object' && !Array.isArray(arg2)) {
        return {
            countryId: arg2.countryId ?? null,
            pageNumber: arg2.pageNumber ?? 1,
            pageSize: arg2.pageSize ?? 10
        };
    }

    // Legacy signatures supported for backward compatibility:
    // - getHotelList(urlName, pageNumber, pageSize)
    // - getHotelList(urlName, countryId, pageNumber, pageSize)
    if (arg4 !== undefined) {
        return {
            countryId: arg2 ?? null,
            pageNumber: arg3 ?? 1,
            pageSize: arg4 ?? 10
        };
    }

    if (arg3 !== undefined) {
        return {
            countryId: null,
            pageNumber: arg2 ?? 1,
            pageSize: arg3 ?? 10
        };
    }

    return {
        countryId: arg2 ?? null,
        pageNumber: 1,
        pageSize: 10
    };
}

export async function getHotelList(urlName, arg2 = null, arg3, arg4) {
    try {
        const { countryId, pageNumber, pageSize } = parseGetHotelListArgs(arg2, arg3, arg4);
        const normalizedUrlName = safeDecodeURIComponent(String(urlName || '').replace(/^\/+/, ''));

        const encodedUrlName = encodeURIComponent(normalizedUrlName);

        let url = `/hotels/list?urlName=${encodedUrlName}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

        if (countryId !== null && countryId !== undefined) {
            url += `&countryId=${countryId}`;
        }

        const response = await fetchClient(url, {
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
            // metaDescription: response?.data?.metaDescription,
            // content: response?.data?.content
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
