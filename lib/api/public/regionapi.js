import { fetchClient } from './fetchClient';

export async function getRegionHotels(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const encodedUrlName = encodeURIComponent(urlName);
        const response = await fetchClient(`/regions/hotels/${encodedUrlName}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET'
        });
       
        return response?.data || {};
    } catch (err) {
        console.error('Error fetching region hotels:', err);
        return {};
    }
}
