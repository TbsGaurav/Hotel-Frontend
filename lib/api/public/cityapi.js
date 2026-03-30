import { fetchClient } from './fetchClient';

export async function getCityHotels(urlName) {
    try {
        const encodedUrlName = encodeURIComponent(urlName);
        const response = await fetchClient(`/cities/hotels?urlName=${encodedUrlName}`, {
            method: 'GET'
        });

        return response?.data || [];
    } catch (error) {
        console.error('Error fetching city hotels:', error);
        return [];
    }
}

export async function getCitySidebar(cityId, regionId = null) {
    try {
        const query = new URLSearchParams();
        query.set('cityId', cityId);

        if (regionId !== null && regionId !== undefined) {
            query.set('regionId', regionId);
        }

        const response = await fetchClient(`/cities/sidebar?${query.toString()}`, {
            method: 'GET'
        });

        return response?.data || { roomFacilities: [], hotelFacilities: [], propertyTypes: [] };
    } catch (error) {
        console.error('Error fetching city sidebar:', error);
        return { roomFacilities: [], hotelFacilities: [], propertyTypes: [] };
    }
}
