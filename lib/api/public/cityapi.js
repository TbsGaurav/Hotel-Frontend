import { fetchClient } from './fetchClient';

 
export async function getCityHotels(urlName, pageNumber = 1, pageSize = 10) {
    try {
        const encodedUrlName = encodeURIComponent(urlName);
        const response = await fetchClient(`/cities/hotels?urlName=${encodedUrlName}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET'
        });

        const apiData = response?.data;
        if (apiData && apiData.hotelData) {
            const hotels = apiData.hotelData;
            if (hotels.length > 0) {
                hotels[0].totalCount = apiData.totalCount;
            }
            return hotels;
        }
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

        return (
            response?.data || {
                roomFacilities: [],
                hotelFacilities: [],
                propertyTypes: [],
                ratings: [],
                cityAndCbd: [],
                entertainment: [],
                relaxationAndExercise: []
            }
        );
    } catch (error) {
        console.error('Error fetching city sidebar:', error);
        return {
            roomFacilities: [],
            hotelFacilities: [],
            propertyTypes: [],
            ratings: [],
            cityAndCbd: [],
            entertainment: [],
            relaxationAndExercise: []
        };
    }
}
