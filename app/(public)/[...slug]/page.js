import { notFound } from 'next/navigation';
import { resolveSlug } from '@/lib/api/public/countryapi';
import CountryDetails from '@/components/common/country/CountryDetails';
import RegionDetails from '@/components/common/region/RegionDetails';

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
    if (slugArray.length === 1 && data.entityType === 'country') {
        return <CountryDetails country={slugArray[0]} />;
    }

    // REGION PAGE
    if (slugArray.length === 2 && data.entityType === 'region') {
        return <RegionDetails country={slugArray[0]} region={slugArray[1]} params={params} />;
    }

    return notFound();
}
