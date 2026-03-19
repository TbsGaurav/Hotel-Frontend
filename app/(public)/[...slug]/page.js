import { notFound } from 'next/navigation';
import { resolveSlug } from '@/lib/api/public/countryapi';
import { getCollectionByUrl } from '@/lib/api/admin/collectionapi';
import { getHotelsByCollection } from '@/lib/api/public/hotelapi';
import CountryDetails from '@/components/common/country/CountryDetails';
import RegionDetails from '@/components/common/region/RegionDetails';
import CollectionDetails from '@/components/common/collections/CollectionDetails';
import CountryBrandDetails from '@/components/common/country/CountryBrandDetails';
import HotelDetails from '@/components/common/hotel/HotelDetails';

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const slugArray = slug || [];
    const fullSlug = '/' + slugArray.join('/');

    const result = await resolveSlug(fullSlug);

    if (!result || result.status !== 'success') {
        return notFound();
    }

    const data = result.data;

    // COUNTRY PAGE
    if (slugArray.length === 1 && data.entityType === 'Country') {
        return <CountryDetails country={slugArray[0]} />;
    }

    // REGION PAGE
    if (slugArray.length === 2 && data.entityType === 'Region') {
        return <RegionDetails country={slugArray[0]} region={slugArray[1]} params={params} />;
    }

    //CountryBrand Page
    if (slugArray.length === 2 && data.entityType === 'CountryBrand') {
        return <CountryBrandDetails country={slugArray[0]} params={params} />;
    }

    // COLLECTION PAGE
    if (slugArray.length === 1 && data.entityType === 'Collection') {
        // Fetch collection and hotels data on server for SSR/SEO
        const collectionRes = await getCollectionByUrl(slug);
        let hotels = [];
        
        if (collectionRes?.data?.basicCollection?.collectionId) {
            const hotelsRes = await getHotelsByCollection(collectionRes.data.basicCollection.collectionId);
            hotels = hotelsRes?.data || [];
        }
        
        return <CollectionDetails collection={collectionRes?.data} hotels={hotels} slug={slug} />;
    }

    // HOTEL PAGE (CityHotel)
    if (slugArray.length === 2 && data.entityType === 'Hotel') {
        return <HotelDetails city={slugArray[0]} hotel={slugArray[1]} params={params} />;
    }

    return notFound();
}
