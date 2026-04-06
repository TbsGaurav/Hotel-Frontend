import { notFound } from 'next/navigation';
import { resolveSlug } from '@/lib/api/public/countryapi';
import { resolveCategoryFromSlug } from '@/lib/api/public/cityCategoryapi';
import CountryDetails from '@/components/common/country/CountryDetails';
import RegionDetails from '@/components/common/region/RegionDetails';
import CollectionDetailsWrapper from '@/components/common/collections/CollectionDetailsWrapper';
import CountryBrandDetails from '@/components/common/brand/CountryBrandDetails';
import CityDetails from '@/components/common/city/CityDetails';
import CityCategoryRouteApp from '@/components/common/city/CityCategoryRouteApp';
import HotelDetailsWrapper from '@/components/common/hotel/HotelDetailsWrapper';
import CityBrandDetails from '@/components/common/brand/CityBrandDetails';

export default async function DynamicPage({ params }) {
    const { slug } = await params;
    const slugArray = slug || [];
    const fullSlug = '/' + slugArray.join('/');

    const result = await resolveSlug(fullSlug);

    if (!result || result.status !== 'success') {
        if (slugArray.length === 2) {
            const resolvedCategory = await resolveCategoryFromSlug(slugArray[1], slugArray[0]);

            if (resolvedCategory?.categoryId) {
                return (
                    <CityCategoryRouteApp
                        citySlug={slugArray[0]}
                        categorySlug={slugArray[1]}
                        resolvedCategoryId={resolvedCategory.categoryId}
                        resolvedCityId={resolvedCategory.cityId}
                        resolvedCityName={resolvedCategory.cityName}
                    />
                );
            }
        }

        return notFound();
    }

    const data = result.data;

    // COUNTRY PAGE
    if (slugArray.length === 1 && data.entityType === 'Country') {
        return <CountryDetails country={slugArray[0]} />;
    }

    // REGION PAGE
    if (slugArray.length === 2 && data.entityType === 'Region') {
        return <RegionDetails country={slugArray[0]} region={slugArray[1]} regionId={data.entityId} params={params} />;
    }

    //COUNTRYBRAND Page
    if (slugArray.length === 2 && data.entityType === 'CountryBrand') {
        return <CountryBrandDetails country={slugArray[0]} params={params} />;
    }

    // COLLECTION PAGE
    if ((slugArray.length === 1 || slugArray.length === 2) && data.entityType === 'Collection') {
        return <CollectionDetailsWrapper slug={slugArray.join('/')} entityId={data.entityId} />;
    }

    // HOTEL PAGE (CityHotel)
    if (slugArray.length === 2 && data.entityType === 'Hotel') {
        return <HotelDetailsWrapper city={slugArray[0]} hotel={slugArray[1]} />;
    }

    if (slugArray.length === 1 && data.entityType === 'City') {
        return <CityDetails city={slugArray[0]} params={params} />;
    }

    
    if (slugArray.length === 2 && data.entityType === 'CityBrand') {
        return <CityBrandDetails city={slugArray[0]} params={params} />;
    }
    return notFound();
}
