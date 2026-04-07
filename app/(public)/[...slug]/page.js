import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { resolveSlug } from '@/lib/api/public/countryapi';
import { resolveCategoryFromRegionSlug, resolveCategoryFromSlug } from '@/lib/api/public/cityCategoryapi';
import CountryDetails from '@/components/common/country/CountryDetails';
import RegionDetails from '@/components/common/region/RegionDetails';
import CollectionDetailsWrapper from '@/components/common/collections/CollectionDetailsWrapper';
import CountryBrandDetails from '@/components/common/brand/CountryBrandDetails';
import CityDetails from '@/components/common/city/CityDetails';
import CityCategoryRouteApp from '@/components/common/city/CityCategoryRouteApp';
import HotelDetailsWrapper from '@/components/common/hotel/HotelDetailsWrapper';
import CityBrandDetails from '@/components/common/brand/CityBrandDetails';

export default async function DynamicPage({ params, searchParams }) {
    const { slug } = await params;
    const slugArray = slug || [];
    const fullSlug = '/' + slugArray.join('/');
    const resolvedSearchParams = await searchParams;
    const result = await resolveSlug(fullSlug);

    if (result?.status === 'success') {
        const data = result.data;

        // COUNTRY PAGE
        if (slugArray.length === 1 && data.entityType === 'Country') {
            return <CountryDetails country={slugArray[0]} />;
        }

        // REGION PAGE
        if (slugArray.length === 2 && data.entityType === 'Region') {
            return <RegionDetails country={slugArray[0]} region={slugArray[1]} regionId={data.entityId} params={params} />;
        }

        // COUNTRY BRAND PAGE
        if (slugArray.length === 2 && data.entityType === 'CountryBrand') {
            return <CountryBrandDetails country={slugArray[0]} params={params} />;
        }

        // COLLECTION PAGE
        if ((slugArray.length === 1 || slugArray.length === 2) && data.entityType === 'Collection') {
            return <CollectionDetailsWrapper slug={slugArray.join('/')} entityId={data.entityId} />;
        }

        // HOTEL PAGE
        if (slugArray.length === 2 && data.entityType === 'Hotel') {
            return <HotelDetailsWrapper city={slugArray[0]} hotel={slugArray[1]} />;
        }

        if (slugArray.length === 1 && data.entityType === 'City') {
            return <CityDetails city={slugArray[0]} params={params} />;
        }

        if (slugArray.length === 2 && data.entityType === 'CityBrand') {
            return <CityBrandDetails city={slugArray[0]} params={params} />;
        }
    }

    if (slugArray.length === 2) {
        const queryCategoryId = Number(resolvedSearchParams?.categoryId);
        const queryRegionId = Number(resolvedSearchParams?.regionId);
        if (Number.isInteger(queryCategoryId) && queryCategoryId > 0) {
            return (
                <CityCategoryRouteApp
                    citySlug={slugArray[0]}
                    categorySlug={slugArray[1]}
                    resolvedCategoryId={queryCategoryId}
                    resolvedRegionId={Number.isInteger(queryRegionId) ? queryRegionId : null}
                />
            );
        }

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

        const resolvedRegionCategory = await resolveCategoryFromRegionSlug(slugArray[1], slugArray[0]);

        if (resolvedRegionCategory?.categoryId) {
            return (
                <CityCategoryRouteApp
                    citySlug={slugArray[0]}
                    categorySlug={slugArray[1]}
                    resolvedCategoryId={resolvedRegionCategory.categoryId}
                    resolvedRegionId={resolvedRegionCategory.regionId}
                    resolvedRegionName={resolvedRegionCategory.regionName}
                />
            );
        }

        const cookieStore = await cookies();
        const contextCookie = cookieStore.get('listingCategoryContext')?.value || '';
        if (contextCookie) {
            try {
                const parsed = JSON.parse(decodeURIComponent(contextCookie));
                const storedHref = String(parsed?.href || '')
                    .split('?')[0]
                    .replace(/\/+$/, '');
                const currentPath = `/${slugArray[0]}/${slugArray[1]}`;
                if (storedHref === currentPath) {
                    return (
                        <CityCategoryRouteApp
                            citySlug={slugArray[0]}
                            categorySlug={slugArray[1]}
                            resolvedCategoryId={Number(parsed?.categoryId || 0)}
                            resolvedRegionId={Number(parsed?.regionId || 0)}
                        />
                    );
                }
            } catch (error) {
                console.error('Unable to parse listingCategoryContext cookie:', error);
            }
        }

        return <CityCategoryRouteApp citySlug={slugArray[0]} categorySlug={slugArray[1]} />;
    }

    return notFound();
}
