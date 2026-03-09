import { notFound } from 'next/navigation';
import { resolveSlug } from '@/lib/api/public/countryapi';
import CountryDetails from '@/components/common/country/CountryDetails';

export default async function DynamicPage({ params }) {
    const { slug } = await params;

    const slugArray = slug || [];

    // prepend slash for backend
    const fullSlug = `/${slugArray.join('/')}`;

    const result = await resolveSlug(fullSlug);

    if (!result || result.status !== 'success') {
        return notFound();
    }

    const data = result.data;

    // COUNTRY PAGE
    if (slugArray.length === 1 && data.geoType === 'country') {
        return <CountryDetails country={slugArray[0]} />;
    }

    return notFound();
}
