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
