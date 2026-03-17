import { fetchClient } from './fetchClient';

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
