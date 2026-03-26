import { getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import CollectionDetails from './CollectionDetails';
import { notFound } from 'next/navigation';

const extractHotelArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.hotels)) return payload.hotels;
    return [];
};

export default async function CollectionDetailsWrapper({ slug }) {
    // Fetch collection and hotels data on server
    const collectionRes = await getCollectionByUrl(slug);
    const collection = collectionRes?.data;

    if (!collection) {
        return notFound();
    }

    const basicCollection = Array.isArray(collection.basicCollection)
        ? collection.basicCollection[0] || {}
        : collection.basicCollection || {};
    let hotels = [];
    const collectionId = basicCollection?.collectionId ?? collection?.basicCollection?.collectionId ?? null;

    if (collectionId) {
        const hotelsRes = await getHotelsByCollection(collectionId);
        hotels = extractHotelArray(hotelsRes?.data);
    }

    let hotelRates = [];
    if (collection?.basicCollection?.collectionId) {
        const hotelsRes = await getHotelsByCollection(collection.basicCollection.collectionId);
        hotels = hotelsRes?.data || [];

        // Get booking IDs from hotels array (each hotel has a bookingId property)
        const bookingIds = hotels?.map((hotel) => hotel.bookingId).filter(Boolean);
        const currency = 'USD';

        if (bookingIds.length > 0) {
            const ratesPayload = {
                bookingIds: bookingIds,
                currency: currency,
                rooms: 1,
                adults: 2,
                childs: 0,
                device: 'desktop',
                checkIn: null,
                checkOut: null
            };
            const ratesRes = await getHotelRates(ratesPayload);
            hotelRates = ratesRes?.data || [];
        }
    }

    return <CollectionDetails collection={{ ...collection, basicCollection }} hotels={hotels} hotelRates={hotelRates} slug={slug} />;
}
