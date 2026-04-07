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
