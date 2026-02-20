import CollectionList from '@/components/common/collections/CollectionList';
import { getCollectionList, getGeoNodes } from '@/lib/api/admin/collectionapi';

export default async function CollectionPage() {
    // Initial server data load (for page source)
    const [collectionsRes, geoRes] = await Promise.all([
        getCollectionList({
            status: null,
            countryId: null,
            regionId: null,
            cityId: null
        }),
        getGeoNodes()
    ]);

    return <CollectionList initialCollections={collectionsRes?.data || []} initialGeoNodes={geoRes?.data?.countries || []} />;
}
