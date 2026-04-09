'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from './CityHotelList';
import { getSidebarData } from '@/lib/api/sidebarapi';
import ListingLayout from '@/components/common/listing/ListingLayout';
import {
    buildCategoryListingPath,
    buildCategorySidebarSections,
    buildRegionCategorySidebarSections,
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

export default function CityCategoryDetails({
    citySlug = '',
    categorySlug = '',
    resolvedCategoryId = null,
    resolvedCityId: initialResolvedCityId = null,
    resolvedCityName: initialResolvedCityName = '',
    resolvedRegionId: initialResolvedRegionId = null,
    resolvedRegionName: initialResolvedRegionName = '',
    initialData = null,
    pageCookieName = '',
    pageIntentCookieName = '',
    onPageInfoChange = null
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hydratedFromServerRef = useRef(Boolean(initialData));
    const [queryIds, setQueryIds] = useState({ categoryId: null, regionId: null, countrySlug: '', initialized: false });

    const readListingContext = () => {
        if (typeof window === 'undefined') return null;

        const normalizePath = (value) =>
            decodeURIComponent(String(value || ''))
                .split('?')[0]
                .replace(/\/+$/, '');

        let stored = null;

        try {
            stored = sessionStorage.getItem('listingCategoryContext');
        } catch {
            stored = null;
        }

        if (!stored) {
            try {
                const match = document.cookie.match(/(?:^|;\s*)listingCategoryContext=([^;]+)/);
                if (match?.[1]) {
                    stored = decodeURIComponent(match[1]);
                }
            } catch {
                stored = null;
            }
        }

        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            const storedHref = normalizePath(String(parsed?.href || ''));
            const currentPath = normalizePath(window.location?.pathname || '');
            if (storedHref && storedHref === currentPath) {
                return {
                    categoryId: Number(parsed?.categoryId) || null,
                    regionId: Number(parsed?.regionId) || null,
                    countrySlug: String(parsed?.countrySlug || '')
                };
            }
        } catch (error) {
            console.error('Unable to parse listing context:', error);
        }

        return null;
    };

    useEffect(() => {
        if (queryIds.initialized) return;

        const rawCategoryId = Number(searchParams?.get('categoryId'));
        const rawRegionId = searchParams?.get('regionId');
        const rawCountrySlug = searchParams?.get('country');
        const hasCategoryId = Number.isInteger(rawCategoryId) && rawCategoryId > 0;
        const hasRegionId = rawRegionId !== null && rawRegionId !== undefined && rawRegionId !== '';
        const hasCountrySlug = rawCountrySlug !== null && rawCountrySlug !== undefined && rawCountrySlug !== '';

        let nextCategoryId = hasCategoryId ? rawCategoryId : null;
        let nextRegionId = hasRegionId ? Number(rawRegionId) : null;
        let nextCountrySlug = hasCountrySlug ? String(rawCountrySlug) : '';

        if (!hasCategoryId && !hasRegionId) {
            const stored = readListingContext();
            if (stored) {
                nextCategoryId = stored.categoryId;
                nextRegionId = stored.regionId;
                nextCountrySlug = stored.countrySlug || '';
            }
        }

        setQueryIds({ categoryId: nextCategoryId, regionId: nextRegionId, countrySlug: nextCountrySlug, initialized: true });

        if (hasCategoryId || hasRegionId) {
            const cleanPath = buildCategoryListingPath(citySlug, categorySlug);
            if (cleanPath) {
                const params = new URLSearchParams();
                if (hasRegionId && nextRegionId) {
                    params.set('regionId', String(nextRegionId));
                }
                if ((hasCountrySlug || nextCountrySlug) && (hasRegionId || nextRegionId)) {
                    params.set('country', String(nextCountrySlug || rawCountrySlug || ''));
                }
                router.replace(params.toString() ? `${cleanPath}?${params.toString()}` : cleanPath, { scroll: false });
            }
        }
    }, [queryIds.initialized, searchParams, router, citySlug, categorySlug]);

    const queryCategoryId = queryIds.categoryId;
    const regionId = queryIds.regionId;
    const queryCountrySlug = queryIds.countrySlug;

    const [loading, setLoading] = useState(initialData ? Boolean(initialData.loading) : true);
    const [error, setError] = useState(initialData?.error || '');
    const [hotelRows, setHotelRows] = useState(Array.isArray(initialData?.hotelRows) ? initialData.hotelRows : []);
    const [sidebarData, setSidebarData] = useState(initialData?.sidebarData || {});
    const [totalCount, setTotalCount] = useState(Number(initialData?.totalCount || 0));
    const [pageSize, setPageSize] = useState(Number(initialData?.pageSize || 10));
    const [currentPage, setCurrentPage] = useState(Number(initialData?.currentPage || 1));
    const [resolvedCityId, setResolvedCityId] = useState(Number(initialData?.resolvedCityId) || null);
    const [resolvedRegionId, setResolvedRegionId] = useState(Number(initialData?.resolvedRegionId) || null);
    const [resolvedRegionName, setResolvedRegionName] = useState(initialData?.resolvedRegionName || '');
    const [resolvedRegionCountrySlug, setResolvedRegionCountrySlug] = useState(initialData?.resolvedRegionCountrySlug || '');
    const [categoryName, setCategoryName] = useState(initialData?.categoryName || '');
    const [cityName, setCityName] = useState(initialData?.cityName || '');
    const [countryName, setCountryName] = useState(initialData?.countryName || '');
    const [countryUrl, setCountryUrl] = useState(initialData?.countryUrl || '');
    const [cityUrl, setCityUrl] = useState(initialData?.cityUrl || '');
    const [regionUrl, setRegionUrl] = useState(initialData?.regionUrl || '');
    const [locationInfo, setLocationInfo] = useState(initialData?.locationInfo || {});

    const slugKey = useMemo(() => `${toSlug(citySlug)}|${toSlug(categorySlug)}`, [citySlug, categorySlug]);

    useEffect(() => {
        let cancelled = false;

        const requestedCategoryId =
            Number.isInteger(queryCategoryId) && queryCategoryId > 0
                ? queryCategoryId
                : Number.isInteger(Number(resolvedCategoryId)) && Number(resolvedCategoryId) > 0
                    ? Number(resolvedCategoryId)
                    : null;
        const requestedRegionId = Number(regionId) > 0 ? Number(regionId) : Number(initialResolvedRegionId) > 0 ? Number(initialResolvedRegionId) : null;

        if (hydratedFromServerRef.current) {
            const initialCategoryId = Number(initialData?.effectiveCategoryId || 0) || null;
            const initialRegionId = Number(initialData?.resolvedRegionId || 0) || null;
            const sameSlug = initialData?.citySlug === citySlug && initialData?.categorySlug === categorySlug;
            const sameCategory = initialCategoryId === requestedCategoryId;
            const sameRegion = initialRegionId === requestedRegionId;

            hydratedFromServerRef.current = false;

            if (sameSlug && sameCategory && sameRegion) {
                return undefined;
            }
        }

        async function loadCategoryPage() {
            setLoading(true);
            setError('');
            setHotelRows([]);
            setSidebarData({});
            setTotalCount(0);
            setPageSize(10);
            setCurrentPage(1);
            setResolvedCityId(null);
            setCategoryName('');
            setCityName('');
            setCountryName('');
            setCountryUrl('');
            setCityUrl('');
            setRegionUrl('');
            setLocationInfo({});
            setResolvedRegionCountrySlug('');

            try {
                let cityContext = null;
                let regionContext = null;
                const hasKnownRegionId =
                    Number(regionId) > 0 ||
                    Number(initialResolvedRegionId) > 0;

                if (Number(initialResolvedCityId) > 0) {
                    cityContext = {
                        cityId: Number(initialResolvedCityId),
                        cityName: String(initialResolvedCityName || formatCityName(citySlug)).trim()
                    };
                } else if (!hasKnownRegionId) {
                    cityContext = await resolveCityContextFromSlug(citySlug);
                }

                if (!cityContext?.cityId) {
                    if (Number(initialResolvedRegionId) > 0) {
                        regionContext = {
                            regionId: Number(initialResolvedRegionId),
                            regionName: String(initialResolvedRegionName || formatCityName(citySlug)).trim()
                        };
                    } else if (Number(regionId) > 0) {
                        regionContext = {
                            regionId: Number(regionId),
                            regionName: String(initialResolvedRegionName || formatCityName(citySlug)).trim()
                        };
                    } else {
                        regionContext = await resolveRegionContextFromSlug(citySlug, queryCountrySlug);
                    }
                }

                const cityId = cityContext?.cityId;
                const regionIdForRequest = regionContext?.regionId ?? (Number(regionId) > 0 ? Number(regionId) : null);

                if (!cityId && !regionIdForRequest) {
                    throw new Error('Unable to resolve the city or region for this listing.');
                }

                if (cancelled) return;

                setResolvedCityId(cityId || null);
                setResolvedRegionId(regionIdForRequest || null);
                setResolvedRegionName(regionContext?.regionName || '');
                setResolvedRegionCountrySlug(regionContext?.countrySlug || queryCountrySlug || '');

                const initialCategoryId = Number(resolvedCategoryId);
                const hasInitialCategoryId = Number.isInteger(initialCategoryId) && initialCategoryId > 0;
                const hasQueryCategoryId = Number.isInteger(queryCategoryId) && queryCategoryId > 0;

                let response = null;
                let effectiveCategoryId = hasQueryCategoryId ? queryCategoryId : hasInitialCategoryId ? initialCategoryId : 0;

                if (!effectiveCategoryId) {
                    const stored = readListingContext();
                    if (stored) {
                        effectiveCategoryId = Number(stored.categoryId || 0);
                    }

                    if (regionIdForRequest) {
                        const resolved = await resolveCategoryFromRegionSlug(categorySlug, citySlug, queryCountrySlug);
                        effectiveCategoryId = Number(resolved?.categoryId || 0);
                    } else if (cityId) {
                        const resolved = await resolveCategoryFromSlug(categorySlug, citySlug);
                        effectiveCategoryId = Number(resolved?.categoryId || 0);
                    }
                }

                if (!effectiveCategoryId) {
                    throw new Error('CategoryId is required.');
                }

                if (!response || hasInitialCategoryId || hasQueryCategoryId) {
                    response = await getCityCategoryHotels({
                        cityId,
                        regionId: regionIdForRequest,
                        categoryId: effectiveCategoryId,
                        pageNo: 1,
                        pageSize: 10
                    });
                }

                if (cancelled) return;

                const categories = normalizeCategoryItems(response.categories || []);
                const responseLocationInfo = response.locationInfo || {};

                const selectedCategory =
                    categories.find((item) => String(item?.categoryId) === String(effectiveCategoryId)) ||
                    null;

                const selectedCategoryName = getCategoryDisplayName(selectedCategory) || '';

                const firstHotel = Array.isArray(response.hotels) ? response.hotels[0] : null;
                const resolvedRegionNameValue = String(
                    responseLocationInfo?.regionName || firstHotel?.regionName || regionContext?.regionName || ''
                ).trim();
                const resolvedCityName =
                    String(responseLocationInfo?.cityName || firstHotel?.cityName || firstHotel?.city || firstHotel?.cityLabel || '').trim() ||
                    String(cityContext?.cityName || regionContext?.regionName || '').trim() ||
                    formatCityName(citySlug);
                const resolvedCountryName =
                    String(responseLocationInfo?.countryName || firstHotel?.countryName || firstHotel?.country || '').trim();
                const resolvedCountryUrl =
                    String(responseLocationInfo?.countryUrl || firstHotel?.countryUrlName || firstHotel?.countryUrl || '').trim() ||
                    (resolvedCountryName ? toSlug(resolvedCountryName) : '');
                const resolvedCityUrl =
                    String(responseLocationInfo?.cityUrl || firstHotel?.cityUrlName || firstHotel?.cityUrl || '').trim() ||
                    (resolvedCityName ? `/${toSlug(resolvedCityName)}` : '');
                const resolvedRegionUrl =
                    String(responseLocationInfo?.regionUrl || firstHotel?.regionUrlName || firstHotel?.regionUrl || '').trim() ||
                    (resolvedCountryUrl && resolvedRegionNameValue ? `/${toSlug(resolvedCountryUrl)}/${toSlug(resolvedRegionNameValue)}` : '');

                setHotelRows(Array.isArray(response.hotels) ? response.hotels : []);
                if (cityId) {
                    setSidebarData(await getSidebarData({ cityId: cityId }));
                } else if (regionIdForRequest) {
                    setSidebarData(await getSidebarData({ regionId: regionIdForRequest }));
                } else {
                    setSidebarData({});
                }
                setTotalCount(Number(response.totalCount || response.hotels?.length || 0));
                setPageSize(Number(response.pageSize || 10));
                setCurrentPage(Number(response.pageNo || 1));
                setCategoryName(selectedCategoryName || formatCityName(categorySlug));
                setCityName(resolvedCityName);
                setCountryName(resolvedCountryName);
                setCountryUrl(resolvedCountryUrl);
                setCityUrl(resolvedCityUrl);
                setRegionUrl(resolvedRegionUrl);
                setLocationInfo(responseLocationInfo);
                setResolvedRegionName(resolvedRegionNameValue);

                onPageInfoChange?.({
                    title: selectedCategoryName || formatCityName(categorySlug),
                    description: `Browse ${selectedCategoryName || formatCityName(categorySlug)} in ${resolvedCityName}.`,
                    cityName: resolvedCityName,
                    categoryName: selectedCategoryName || formatCityName(categorySlug)
                });
            } catch (err) {
                if (cancelled) return;

                console.error('Error loading city category hotels:', err);
                setError(err?.message || 'Unable to load category hotels.');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        if (citySlug && categorySlug) {
            loadCategoryPage();
        } else {
            setLoading(false);
            setError('Missing city or category information.');
        }

        return () => {
            cancelled = true;
        };
    }, [
        citySlug,
        categorySlug,
        initialResolvedCityId,
        initialResolvedCityName,
        initialResolvedRegionId,
        initialResolvedRegionName,
        resolvedCategoryId,
        slugKey,
        onPageInfoChange,
        queryCategoryId,
        regionId,
        queryCountrySlug,
        initialData,
        initialResolvedRegionId
    ]);

    const effectiveCategoryId = Number.isInteger(queryCategoryId) && queryCategoryId > 0 ? queryCategoryId : resolvedCategoryId;
    const countrySlugForRegion = queryCountrySlug || resolvedRegionCountrySlug || countryUrl || toSlug(countryName);

    const sidebarSections = useMemo(() => {
        if (resolvedRegionId) {
            const sections = buildRegionCategorySidebarSections(sidebarData, {
                regionSlug: citySlug,
                regionName: resolvedRegionName || cityName || formatCityName(citySlug),
                activeCategorySlug: categorySlug
            });
            const countrySlugForLinks = countrySlugForRegion;
            if (!countrySlugForLinks) return sections;
            return sections.map((section) => ({
                ...section,
                items: (section.items || []).map((item) => {
                    if (!item?.href) return { ...item, countrySlug: countrySlugForLinks };
                    const [path, queryString] = String(item.href).split('?');
                    const params = new URLSearchParams(queryString || '');
                    if (!params.has('country')) {
                        params.set('country', String(countrySlugForLinks));
                    }
                    if (!params.has('regionId') && resolvedRegionId) {
                        params.set('regionId', String(resolvedRegionId));
                    }
                    return {
                        ...item,
                        countrySlug: countrySlugForLinks,
                        regionId: item?.regionId ?? resolvedRegionId ?? null,
                        href: `${path}?${params.toString()}`
                    };
                })
            }));
        }

        return buildCategorySidebarSections(sidebarData, {
            citySlug,
            cityName: cityName || formatCityName(citySlug),
            activeCategorySlug: categorySlug
        });
    }, [
        categorySlug,
        cityName,
        citySlug,
        sidebarData,
        regionId,
        resolvedRegionId,
        resolvedRegionName,
        countrySlugForRegion
    ]);

    const fetchMoreHotels = async ({ pageNumber, pageSize: nextPageSize }) => {
        if ((!resolvedCityId && !resolvedRegionId) || !effectiveCategoryId) {
            return {
                hotels: [],
                totalCount,
                pageNo: pageNumber,
                pageSize: nextPageSize
            };
        }

        const response = await getCityCategoryHotels({
            cityId: resolvedCityId,
            regionId: resolvedRegionId || regionId,
            categoryId: effectiveCategoryId,
            pageNo: pageNumber,
            pageSize: nextPageSize
        });

        return response;
    };

    const normalizeBreadcrumbHref = (value = '') => {
        const trimmed = String(value || '').trim();
        if (!trimmed) return '';
        return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    };

    const isRegionContext = Boolean(resolvedRegionId || queryCountrySlug || resolvedRegionCountrySlug);
    const countryBreadcrumbHref = normalizeBreadcrumbHref(locationInfo?.countryUrl || queryCountrySlug || countryUrl || toSlug(countryName));
    const countryBreadcrumbLabel = String(locationInfo?.countryName || countryName || '').trim();
    const regionBreadcrumbHref = normalizeBreadcrumbHref(locationInfo?.regionUrl || regionUrl);
    const regionBreadcrumbLabel = String(locationInfo?.regionName || resolvedRegionName || '').trim();
    const cityBreadcrumbHref = normalizeBreadcrumbHref(locationInfo?.cityUrl || cityUrl);
    const cityBreadcrumbLabel = String(locationInfo?.cityName || cityName || '').trim();

    const breadcrumb = (
        <div className="container">
            <div className="d-flex align-items-center small flex-wrap">
                <Link href="/destinations" className="text-dark text-decoration-none">
                    All countries
                </Link>
                {countryBreadcrumbLabel && countryBreadcrumbHref && (
                    <>
                        <span className="mx-2 text-muted">&bull;</span>
                        <Link href={countryBreadcrumbHref} className="text-dark text-decoration-none">
                            {countryBreadcrumbLabel}
                        </Link>
                    </>
                )}
                {regionBreadcrumbLabel && regionBreadcrumbHref && (
                    <>
                        <span className="mx-2 text-muted">&bull;</span>
                        <Link href={regionBreadcrumbHref} className="text-dark text-decoration-none">
                            {regionBreadcrumbLabel}
                        </Link>
                    </>
                )}
                {!isRegionContext && cityBreadcrumbLabel && cityBreadcrumbHref && (
                    <>
                        <span className="mx-2 text-muted">&bull;</span>
                        <Link href={cityBreadcrumbHref} className="text-dark text-decoration-none">
                            {cityBreadcrumbLabel}
                        </Link>
                    </>
                )}
                <span className="mx-2 text-muted">&bull;</span>
                <span className="text-primary">{categoryName || formatCityName(categorySlug)}</span>
            </div>
        </div>
    );

    const header = <h2 className="mb-3">{categoryName || formatCityName(categorySlug)}</h2>;

    const sidebar = (
        <div className="position-sticky" style={{ top: '16px' }}>
            <ListingSidebar title="Filters" sections={sidebarSections} />
        </div>
    );

    if (loading) {
        return (
            <ListingLayout
                breadcrumb={breadcrumb}
                header={header}
                sidebar={sidebar}
                main={<div className="text-center py-5 text-muted">Loading category hotels...</div>}
            />
        );
    }

    if (error) {
        return (
            <ListingLayout
                breadcrumb={breadcrumb}
                header={header}
                sidebar={sidebar}
                main={<div className="alert alert-danger mb-0">{error}</div>}
            />
        );
    }

    return (
        <ListingLayout
            breadcrumb={breadcrumb}
            header={header}
            sidebar={sidebar}
            main={
                hotelRows.length > 0 ? (
                    <CityHotelList
                        hotels={hotelRows}
                        totalCount={totalCount}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        citySlug={citySlug}
                        content=""
                        fetchMoreHotels={fetchMoreHotels}
                        pageCookieName={pageCookieName}
                        pageIntentCookieName={pageIntentCookieName}
                    />
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">No hotels available for this category.</p>
                    </div>
                )
            }
        />
    );
}
