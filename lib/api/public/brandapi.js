import { fetchClient } from './fetchClient';

function normalizeBrandPath(urlName = '') {
    return String(urlName || '').replace(/^\/+/, '');
}

export const getBrandList = async (alphabet = null) => {
    try {
        const endpoint = alphabet ? `/brand/list?alphabet=${alphabet}` : `/brand/list`;
        const json = await fetchClient(endpoint);
        return json?.data || [];
    } catch (error) {
        console.error('Error fetching brand list:', error);
        return [];
    }
};

export async function getBrandCountries(urlName) {
    try {
        const encodedUrlName = encodeURIComponent(urlName);
        const response = await fetchClient(`/brand/${encodedUrlName}`, {
            method: 'GET'
        });

        return response?.data || [];
    } catch (error) {
        console.error('Brand API Error:', error);
        return [];
    }
}

export async function getCountryBrandHotels(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const encodedUrlName = encodeURIComponent(normalizeBrandPath(urlName));
        const res = await fetchClient(`/brand/country/${encodedUrlName}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET'
        });

        const apiData = res?.data;
        if (apiData && apiData.hotelData) {
            const hotels = apiData.hotelData;
            if (hotels.length > 0) {
                hotels[0].totalCount = apiData.totalCount;
                hotels[0].countryId = apiData.countryId;
            }
            return hotels;
        }
        return res?.data || [];
    } catch (error) {
        console.error('Error fetching brand hotels:', error);
        return [];
    }
}

export async function getCityBrandHotels(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const encodedUrlName = encodeURIComponent(normalizeBrandPath(urlName));
        const res = await fetchClient(`/brand/city/${encodedUrlName}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET'
        });

        const apiData = res?.data;
        if (apiData && apiData.hotelData) {
            const hotels = apiData.hotelData;
            if (hotels.length > 0) {
                hotels[0].totalCount = apiData.totalCount;
                hotels[0].cityId = apiData.cityId;
            }
            return hotels;
        }
        return res?.data || [];
    } catch (error) {
        console.error('Error fetching brand hotels:', error);
        return [];
    }
}
