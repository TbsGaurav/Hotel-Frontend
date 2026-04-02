import { getCollectionById, getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection } from '@/lib/api/public/hotelapi';
import CollectionDetails from './CollectionDetails';
import { notFound } from 'next/navigation';

export default async function CollectionDetailsWrapper({ slug, collectionData, entityId }) {
    // Use collection data from resolveSlug if available, otherwise fetch it
    let collection = collectionData;

    if (!collection) {
        // Try to fetch by entity ID first if available (for multi-segment URLs)
        if (entityId) {
            try {
                const collectionRes = await getCollectionById(entityId);
                collection = collectionRes?.data;
            } catch (error) {
                console.error('Error fetching collection by ID:', error);
            }
        }

        // Fallback to fetching by URL
        if (!collection) {
            const collectionRes = await getCollectionByUrl(slug);
            collection = collectionRes?.data;
        }
    }

    if (!collection) {
        return notFound();
    }

    const basicCollection = Array.isArray(collection.basicCollection)
        ? collection.basicCollection[0] || {}
        : collection.basicCollection || {};
    let hotels = [];
    const collectionId = basicCollection?.collectionId ?? collection?.basicCollection?.collectionId ?? null;

    let hotelRates = [];

    let totalCount = 0;
    let currentPage = 1;
    let pageSize = 10;

    if (collectionId) {
        // Fetch first page of hotels
        const hotelsRes = await getHotelsByCollection(collectionId, 1, 10);

        // Handle new API response structure: data.hotelData and data.totalCount
        const hotelsData = hotelsRes?.data?.hotelData || hotelsRes?.data || [];
        hotels = hotelsData;
        totalCount = hotelsRes?.data?.totalCount || hotelsRes?.totalCount || 0;
        currentPage = hotelsRes?.data?.currentPage || 1;
        pageSize = hotelsRes?.data?.pageSize || 10;
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
            collectionId={collectionId}
        />
    );
}
