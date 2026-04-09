import CollectionList from '@/components/common/collections/CollectionList';
import { getCollectionList } from '@/lib/api/admin/collectionapi';
import { getCountriesApi } from '@/lib/api/public/countryapi';

export default async function CollectionPage() {
    const [collectionsRes, countries] = await Promise.all([
        getCollectionList({
            status: null,
            countryId: null,
            regionId: null,
            cityId: null
        }),
        getCountriesApi()
    ]);

    return <CollectionList initialCollections={collectionsRes?.data || []} initialCountries={countries || []} />;
}
