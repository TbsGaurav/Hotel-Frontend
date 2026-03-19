import { fetchClient } from "./fetchClient";

export const getHotelsByCollection = async (collectionId) => {
    return fetchClient(`/hotels/${collectionId}`, {
        method: 'GET'
    });
};
