import { cookies } from 'next/headers';
import CityCategoryDetails from './CityCategoryDetails';
import { getSidebarData } from '@/lib/api/sidebarapi';
import {
    getCityCategoryHotels,
    normalizeCategoryItems,
    resolveCategoryFromRegionSlug,
    resolveCategoryFromSlug,
    resolveCityContextFromSlug,
    resolveRegionContextFromSlug,
    toSlug
} from '@/lib/api/public/cityCategoryapi';

function formatCityName(slug = '') {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getCategoryDisplayName(item = {}) {
    return String(item?.categoryName || item?.categoryTitle || item?.name || '').trim();
}

function normalizeCookieKeyPart(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function getCategoryPageCookieName({ citySlug = '', categorySlug = '', countrySlug = '' } = {}) {
    return `category_page_${normalizeCookieKeyPart(countrySlug)}_${normalizeCookieKeyPart(citySlug)}_${normalizeCookieKeyPart(categorySlug)}`;
}

function getCategoryPageIntentCookieName({ citySlug = '', categorySlug = '', countrySlug = '' } = {}) {
    return `category_page_intent_${normalizeCookieKeyPart(countrySlug)}_${normalizeCookieKeyPart(citySlug)}_${normalizeCookieKeyPart(categorySlug)}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

async function getInitialCategoryPageData({
    citySlug = '',
    categorySlug = '',
    resolvedCategoryId = null,
    resolvedCityId = null,
    resolvedCityName = '',
    resolvedRegionId = null,
    resolvedRegionName = '',
    queryRegionId = null,
    queryCountrySlug = '',
    currentPage = 1
}) {
    const emptyState = {
        citySlug,
        categorySlug,
        effectiveCategoryId: Number(resolvedCategoryId) || null,
        hotelRows: [],
        sidebarData: {},
        totalCount: 0,
        pageSize: 10,
        currentPage,
        resolvedCityId: null,
        resolvedRegionId: Number(resolvedRegionId) || Number(queryRegionId) || null,
        resolvedRegionName: resolvedRegionName || '',
        resolvedRegionCountrySlug: queryCountrySlug || '',
        categoryName: '',
        cityName: '',
        countryName: '',
        countryUrl: '',
        error: '',
        loading: false
    };

    try {
        let cityContext = null;
        let regionContext = null;
        const hasQueryRegionId = Number(queryRegionId) > 0;

        if (Number(resolvedCityId) > 0) {
            cityContext = {
                cityId: Number(resolvedCityId),
                cityName: String(resolvedCityName || formatCityName(citySlug)).trim()
            };
        } else if (!hasQueryRegionId) {
            cityContext = await resolveCityContextFromSlug(citySlug);
        }

        if (!cityContext?.cityId) {
            if (Number(resolvedRegionId) > 0) {
                regionContext = {
                    regionId: Number(resolvedRegionId),
                    regionName: String(resolvedRegionName || formatCityName(citySlug)).trim()
                };
            } else if (hasQueryRegionId) {
                regionContext = {
                    regionId: Number(queryRegionId),
                    regionName: String(resolvedRegionName || formatCityName(citySlug)).trim()
                };
            } else {
                regionContext = await resolveRegionContextFromSlug(citySlug, queryCountrySlug);
            }
        }

        const cityId = cityContext?.cityId || null;
        const regionIdForRequest = regionContext?.regionId ?? (Number(queryRegionId) > 0 ? Number(queryRegionId) : null);

        if (!cityId && !regionIdForRequest) {
            return {
                ...emptyState,
                error: 'Unable to resolve the city or region for this listing.'
            };
        }

        let effectiveCategoryId = Number(resolvedCategoryId) || 0;

        if (!effectiveCategoryId) {
            if (regionIdForRequest) {
                const resolved = await resolveCategoryFromRegionSlug(categorySlug, citySlug, queryCountrySlug);
                effectiveCategoryId = Number(resolved?.categoryId || 0);
            } else if (cityId) {
                const resolved = await resolveCategoryFromSlug(categorySlug, citySlug);
                effectiveCategoryId = Number(resolved?.categoryId || 0);
            }
        }

        if (!effectiveCategoryId) {
            return {
                ...emptyState,
                resolvedCityId: cityId,
                resolvedRegionId: regionIdForRequest,
                resolvedRegionName: regionContext?.regionName || '',
                resolvedRegionCountrySlug: regionContext?.countrySlug || queryCountrySlug || '',
                error: 'CategoryId is required.'
            };
        }

        let response = null;
        let hotels = [];
        let totalCount = 0;
        let pageSize = 10;

        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber += 1) {
            const pageResponse = await getCityCategoryHotels({
                cityId,
                regionId: regionIdForRequest,
                categoryId: effectiveCategoryId,
                pageNo: pageNumber,
                pageSize: 10
            });

            const nextHotels = Array.isArray(pageResponse?.hotels) ? pageResponse.hotels : [];
            if (!nextHotels.length) {
                response = pageResponse;
                break;
            }

            response = pageResponse;
            hotels = hotels.concat(nextHotels);

            if (pageNumber === 1) {
                totalCount = Number(pageResponse.totalCount || nextHotels.length || 0);
                pageSize = Number(pageResponse.pageSize || 10);
            }

            if (nextHotels.length < pageSize) {
                break;
            }
        }

        response = response || {
            hotels,
            categories: [],
            totalCount,
            pageNo: currentPage,
            pageSize
        };

        const categories = normalizeCategoryItems(response.categories || []);
        const selectedCategory =
            categories.find((item) => String(item?.categoryId) === String(effectiveCategoryId)) ||
            null;
        const selectedCategoryName = getCategoryDisplayName(selectedCategory) || '';
        const firstHotel = Array.isArray(response.hotels) ? response.hotels[0] : null;
        const resolvedCityLabel =
            String(firstHotel?.cityName || firstHotel?.city || firstHotel?.cityLabel || '').trim() ||
            String(cityContext?.cityName || regionContext?.regionName || '').trim() ||
            formatCityName(citySlug);
        const resolvedCountryName = String(firstHotel?.countryName || firstHotel?.country || '').trim();
        const resolvedCountryUrl =
            String(firstHotel?.countryUrlName || firstHotel?.countryUrl || '').trim() ||
            (resolvedCountryName ? toSlug(resolvedCountryName) : '');
        const resolvedSidebarData = cityId
            ? await getSidebarData({ cityId })
            : regionIdForRequest
              ? await getSidebarData({ regionId: regionIdForRequest })
              : {};

        return {
            ...emptyState,
            effectiveCategoryId,
            hotelRows: hotels,
            sidebarData: resolvedSidebarData,
            totalCount: Number(totalCount || response.totalCount || hotels.length || 0),
            pageSize: Number(pageSize || response.pageSize || 10),
            currentPage,
            resolvedCityId: cityId,
            resolvedRegionId: regionIdForRequest,
            resolvedRegionName: regionContext?.regionName || '',
            resolvedRegionCountrySlug: regionContext?.countrySlug || queryCountrySlug || '',
            categoryName: selectedCategoryName || formatCityName(categorySlug),
            cityName: resolvedCityLabel,
            countryName: resolvedCountryName,
            countryUrl: resolvedCountryUrl
        };
    } catch (error) {
        console.error('Error loading city category hotels:', error);
        return {
            ...emptyState,
            error: error?.message || 'Unable to load category hotels.'
        };
    }
}

export default async function CityCategoryRouteApp(props) {
    const cookieStore = await cookies();
    const pageCookieName = getCategoryPageCookieName({
        citySlug: props.citySlug,
        categorySlug: props.categorySlug,
        countrySlug: props.queryCountrySlug
    });
    const pageIntentCookieName = getCategoryPageIntentCookieName({
        citySlug: props.citySlug,
        categorySlug: props.categorySlug,
        countrySlug: props.queryCountrySlug
    });
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);
    const initialData = await getInitialCategoryPageData({
        ...props,
        currentPage
    });

    return (
        <CityCategoryDetails
            {...props}
            initialData={initialData}
            pageCookieName={pageCookieName}
            pageIntentCookieName={pageIntentCookieName}
        />
    );
}
