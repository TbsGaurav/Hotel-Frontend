import { fetchClient } from './public/fetchClient';

export async function getSidebarData({ cityId = null, regionId = null, countryId = null } = {}) {
    try {
        const query = new URLSearchParams();

        if (cityId !== null && cityId !== undefined) {
            query.set('cityId', cityId);
        }

        if (regionId !== null && regionId !== undefined) {
            query.set('regionId', regionId);
        }

        if (countryId !== null && countryId !== undefined) {
            query.set('countryId', countryId);
        }

        const response = await fetchClient(`/cities/sidebar?${query.toString()}`, {
            method: 'GET',
            next: { revalidate: 1800 }
        });

        return response?.data || {};
    } catch (error) {
        console.error('Error fetching sidebar data:', error);
        return {};
    }
}
