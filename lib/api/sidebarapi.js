import { fetchClient } from './public/fetchClient';

export async function getSidebarData({ cityId = 0, regionId = null } = {}) {
    try {
        const query = new URLSearchParams();

        if (Number(cityId) > 0) {
            query.set('cityId', cityId);
        }

        if (regionId !== null && regionId !== undefined) {
            query.set('regionId', regionId);
        }

        const response = await fetchClient(`/cities/sidebar?${query.toString()}`, {
            method: 'GET'
        });

        return response?.data || {};
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
        return {};
    }
}
