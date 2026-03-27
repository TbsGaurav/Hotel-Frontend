import { getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection, getHotelRates } from '@/lib/api/public/hotelapi';
import CollectionDetails from './CollectionDetails';
import { notFound } from 'next/navigation';
import { countryToCurrency } from '@/lib/utils';

export default async function CollectionDetailsWrapper({ slug }) {
    // Fetch collection and hotels data on server
    const collectionRes = await getCollectionByUrl(slug);
    const collection = collectionRes?.data;

    if (!collection) {
        return notFound();
    }

    let hotels = [];
    let hotelRates = [];
    let totalCount = 0;
    let currentPage = 1;
    let pageSize = 10;

    if (collection?.basicCollection?.collectionId) {
        // Fetch first page of hotels
        const hotelsRes = await getHotelsByCollection(collection.basicCollection.collectionId, 1, 10);

        // Handle new API response structure: data.hotelData and data.totalCount
        const hotelsData = hotelsRes?.data?.hotelData || hotelsRes?.data || [];
        hotels = hotelsData;
        totalCount = hotelsRes?.data?.totalCount || hotelsRes?.totalCount || 0;
        currentPage = hotelsRes?.data?.currentPage || 1;
        pageSize = hotelsRes?.data?.pageSize || 10;

        // Get booking IDs from hotels array (each hotel has a bookingId property)
        const bookingIds = hotels?.map(hotel => hotel.bookingId).filter(Boolean);

        // Get country code from first hotel and convert to currency
        // Note: countryCode is lowercase "au" but we need uppercase for our map
        const countryCode = hotels?.[0]?.countryCode?.toUpperCase();
        const currency = countryCode ? countryToCurrency(countryCode) : 'USD';

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

    return (
        <CollectionDetails
            collection={collection}
            hotels={hotels}
            hotelRates={hotelRates}
            slug={slug}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            collectionId={collection?.basicCollection?.collectionId}
        />
    );
}
