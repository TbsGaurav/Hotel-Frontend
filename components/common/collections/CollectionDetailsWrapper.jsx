import { getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import CollectionDetails from './CollectionDetails';
import { notFound } from 'next/navigation';

export default async function CollectionDetailsWrapper({ slug }) {
    // Fetch collection and hotels data on server
    const collectionRes = await getCollectionByUrl(slug);
    const collection = collectionRes?.data;

    if (!collection) {
        return notFound();
    }

    let hotels = [];
    let hotelRates = [];
    if (collection?.basicCollection?.collectionId) {
        const hotelsRes = await getHotelsByCollection(collection.basicCollection.collectionId);
        hotels = hotelsRes?.data || [];

        // Get booking IDs from hotels array (each hotel has a bookingId property)
        const bookingIds = hotels?.map(hotel => hotel.bookingId).filter(Boolean);
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

    return <CollectionDetails collection={collection} hotels={hotels} hotelRates={hotelRates} slug={slug} />;
}
