import { fetchClient } from './fetchClient';

export async function getCitySidebar(cityId, regionId = null) {
    const emptySidebar = {
        roomFacilities: [],
        hotelFacilities: [],
        propertyTypes: [],
        ratings: [],
        cityAndCbd: [],
        entertainment: [],
        relaxationAndExercise: []
    };

    try {
        let resolvedCityId = cityId;
        let resolvedRegionId = regionId;
        let resolvedCountryId = null;

        if (typeof cityId === 'object' && cityId !== null) {
            resolvedCityId = cityId.cityId ?? null;
            resolvedRegionId = cityId.regionId ?? null;
            resolvedCountryId = cityId.countryId ?? null;
        }

        const query = new URLSearchParams();

        if (resolvedCityId !== null && resolvedCityId !== undefined) {
            query.set('cityId', resolvedCityId);
        }

        if (resolvedRegionId !== null && resolvedRegionId !== undefined) {
            query.set('regionId', resolvedRegionId);
        }

        if (resolvedCountryId !== null && resolvedCountryId !== undefined) {
            query.set('countryId', resolvedCountryId);
        }

        if (!Array.from(query.keys()).length) {
            return emptySidebar;
        }

        const response = await fetchClient(`/cities/sidebar?${query.toString()}`, {
            method: 'GET'
        });

        return response?.data || emptySidebar;
    } catch (error) {
        console.error('Error fetching city sidebar:', error);
        return emptySidebar;
    }
}
