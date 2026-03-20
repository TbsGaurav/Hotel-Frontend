import { getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection } from '@/lib/api/public/hotelapi';
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
    if (collection?.basicCollection?.collectionId) {
        const hotelsRes = await getHotelsByCollection(collection.basicCollection.collectionId);
        hotels = hotelsRes?.data || [];
    }

    return <CollectionDetails collection={collection} hotels={hotels} slug={slug} />;
}
