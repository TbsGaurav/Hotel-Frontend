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

function normalizeEntityType(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z]/g, '');
}

export default async function DynamicPage({ params, searchParams }) {
    const { slug } = await params;
    const slugArray = slug || [];
    const fullSlug = '/' + slugArray.join('/');
    const primarySlug = slugArray[0] || '';
    const categorySlug = slugArray.slice(1).join('/');
    const resolvedSearchParams = await searchParams;
    const result = await resolveSlug(fullSlug);

    if (result?.status === 'success') {
        const data = result.data;
        const entityType = normalizeEntityType(data?.entityType ?? data?.EntityType);

        // COUNTRY PAGE
        if (slugArray.length === 1 && entityType === 'country') {
            return <CountryDetails country={slugArray[0]} />;
        }

        // REGION PAGE
        if (slugArray.length === 2 && entityType === 'region') {
            return <RegionDetails country={slugArray[0]} region={slugArray[1]} regionId={data.entityId} params={params} />;
        }

        // COUNTRY BRAND PAGE
        if (slugArray.length === 2 && entityType === 'countrybrand') {
            return <CountryBrandDetails country={slugArray[0]} params={params} />;
        }

        // COLLECTION PAGE
        if ((slugArray.length === 1 || slugArray.length === 2) && entityType === 'collection') {
            return <CollectionDetailsWrapper slug={slugArray.join('/')} entityId={data.entityId} />;
        }

        // HOTEL PAGE
        if (slugArray.length === 2 && entityType === 'hotel') {
            return <HotelDetailsWrapper city={slugArray[0]} hotel={slugArray[1]} />;
        }

        if (slugArray.length === 1 && entityType === 'city') {
            return <CityDetails city={slugArray[0]} params={params} />;
        }

        if (slugArray.length === 2 && entityType === 'citybrand') {
            return <CityBrandDetails city={slugArray[0]} params={params} />;
        }
    }

    if (slugArray.length >= 2) {
        const queryCategoryId = Number(resolvedSearchParams?.categoryId);
        const queryRegionId = Number(resolvedSearchParams?.regionId);
        if (Number.isInteger(queryCategoryId) && queryCategoryId > 0) {
            return (
                <CityCategoryRouteApp
                    citySlug={primarySlug}
                    categorySlug={categorySlug}
                    resolvedCategoryId={queryCategoryId}
                    resolvedRegionId={Number.isInteger(queryRegionId) ? queryRegionId : null}
                    queryRegionId={Number.isInteger(queryRegionId) ? queryRegionId : null}
                    queryCountrySlug={String(resolvedSearchParams?.country || '')}
                />
            );
        }

        const resolvedCategory = await resolveCategoryFromSlug(categorySlug, primarySlug);

        if (resolvedCategory?.categoryId) {
            return (
                <CityCategoryRouteApp
                    citySlug={primarySlug}
                    categorySlug={categorySlug}
                    resolvedCategoryId={resolvedCategory.categoryId}
                    resolvedCityId={resolvedCategory.cityId}
                    resolvedCityName={resolvedCategory.cityName}
                    queryCountrySlug={String(resolvedSearchParams?.country || '')}
                />
            );
        }

        const resolvedRegionCategory = await resolveCategoryFromRegionSlug(
            categorySlug,
            primarySlug,
            String(resolvedSearchParams?.country || '')
        );

        if (resolvedRegionCategory?.categoryId) {
            return (
                <CityCategoryRouteApp
                    citySlug={primarySlug}
                    categorySlug={categorySlug}
                    resolvedCategoryId={resolvedRegionCategory.categoryId}
                    resolvedRegionId={resolvedRegionCategory.regionId}
                    resolvedRegionName={resolvedRegionCategory.regionName}
                    queryRegionId={resolvedRegionCategory.regionId}
                    queryCountrySlug={String(resolvedSearchParams?.country || '')}
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
                const currentPath = `/${primarySlug}/${categorySlug}`;
                if (storedHref === currentPath) {
                    return (
                        <CityCategoryRouteApp
                            citySlug={primarySlug}
                            categorySlug={categorySlug}
                            resolvedCategoryId={Number(parsed?.categoryId || 0)}
                            resolvedRegionId={Number(parsed?.regionId || 0)}
                            queryRegionId={Number(parsed?.regionId || 0)}
                            queryCountrySlug={String(resolvedSearchParams?.country || '')}
                        />
                    );
                }
            } catch (error) {
                console.error('Unable to parse listingCategoryContext cookie:', error);
            }
        }

        return (
            <CityCategoryRouteApp
                citySlug={primarySlug}
                categorySlug={categorySlug}
                queryRegionId={Number.isInteger(queryRegionId) ? queryRegionId : null}
                queryCountrySlug={String(resolvedSearchParams?.country || '')}
            />
        );
    }

    return notFound();
}
