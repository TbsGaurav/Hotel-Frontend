'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from './CityHotelList';
import { getSidebarData } from '@/lib/api/sidebarapi';
import ListingLayout from '@/components/common/listing/ListingLayout';
import {
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
    onPageInfoChange = null
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [queryIds, setQueryIds] = useState({ categoryId: null, regionId: null, initialized: false });

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
                    regionId: Number(parsed?.regionId) || null
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
        const hasCategoryId = Number.isInteger(rawCategoryId) && rawCategoryId > 0;
        const hasRegionId = rawRegionId !== null && rawRegionId !== undefined && rawRegionId !== '';

        let nextCategoryId = hasCategoryId ? rawCategoryId : null;
        let nextRegionId = hasRegionId ? Number(rawRegionId) : null;

        if (!hasCategoryId && !hasRegionId) {
            const stored = readListingContext();
            if (stored) {
                nextCategoryId = stored.categoryId;
                nextRegionId = stored.regionId;
            }
        }

        setQueryIds({ categoryId: nextCategoryId, regionId: nextRegionId, initialized: true });

        if (hasCategoryId || hasRegionId) {
            const cleanPath = `/${encodeURIComponent(citySlug)}/${encodeURIComponent(categorySlug)}`;
            router.replace(cleanPath, { scroll: false });
        }
    }, [queryIds.initialized, searchParams, router, citySlug, categorySlug]);

    const queryCategoryId = queryIds.categoryId;
    const regionId = queryIds.regionId;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hotelRows, setHotelRows] = useState([]);
    const [sidebarData, setSidebarData] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [resolvedCityId, setResolvedCityId] = useState(null);
    const [resolvedRegionId, setResolvedRegionId] = useState(null);
    const [resolvedRegionName, setResolvedRegionName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [cityName, setCityName] = useState('');

    const slugKey = useMemo(() => `${toSlug(citySlug)}|${toSlug(categorySlug)}`, [citySlug, categorySlug]);

    useEffect(() => {
        let cancelled = false;

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

            try {
                let cityContext = null;
                let regionContext = null;
                const hasQueryRegionId = Number(regionId) > 0;

                if (Number(initialResolvedCityId) > 0) {
                    cityContext = {
                        cityId: Number(initialResolvedCityId),
                        cityName: String(initialResolvedCityName || formatCityName(citySlug)).trim()
                    };
                } else if (!hasQueryRegionId) {
                    cityContext = await resolveCityContextFromSlug(citySlug);
                }

                if (!cityContext?.cityId) {
                    if (Number(initialResolvedRegionId) > 0) {
                        regionContext = {
                            regionId: Number(initialResolvedRegionId),
                            regionName: String(initialResolvedRegionName || formatCityName(citySlug)).trim()
                        };
                    } else if (hasQueryRegionId) {
                        regionContext = {
                            regionId: Number(regionId),
                            regionName: String(initialResolvedRegionName || formatCityName(citySlug)).trim()
                        };
                    } else {
                        regionContext = await resolveRegionContextFromSlug(citySlug);
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
                        const resolved = await resolveCategoryFromRegionSlug(categorySlug, citySlug);
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

                const selectedCategory =
                    categories.find((item) => String(item?.categoryId) === String(effectiveCategoryId)) ||
                    null;

                const selectedCategoryName = getCategoryDisplayName(selectedCategory) || '';

                const firstHotel = Array.isArray(response.hotels) ? response.hotels[0] : null;
                const resolvedCityName =
                    String(firstHotel?.cityName || firstHotel?.city || firstHotel?.cityLabel || '').trim() ||
                    String(cityContext?.cityName || regionContext?.regionName || '').trim() ||
                    formatCityName(citySlug);

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
        regionId
    ]);

    const effectiveCategoryId = Number.isInteger(queryCategoryId) && queryCategoryId > 0 ? queryCategoryId : resolvedCategoryId;

    const sidebarSections = useMemo(() => {
        if (resolvedRegionId) {
            return buildRegionCategorySidebarSections(sidebarData, {
                regionSlug: citySlug,
                regionName: resolvedRegionName || cityName || formatCityName(citySlug),
                activeCategorySlug: categorySlug
            });
        }

        return buildCategorySidebarSections(sidebarData, {
            citySlug,
            cityName: cityName || formatCityName(citySlug),
            activeCategorySlug: categorySlug
        });
    }, [categorySlug, cityName, citySlug, sidebarData, regionId, resolvedRegionId, resolvedRegionName]);

    const fetchMoreHotels = async ({ pageNumber, pageSize: nextPageSize }) => {
        if ((!resolvedCityId && !resolvedRegionId) || !effectiveCategoryId) return [];

        const response = await getCityCategoryHotels({
            cityId: resolvedCityId,
            regionId: resolvedRegionId || regionId,
            categoryId: effectiveCategoryId,
            pageNo: pageNumber,
            pageSize: nextPageSize
        });

        setPageSize(Number(response.pageSize || nextPageSize || 10));
        setCurrentPage(Number(response.pageNo || pageNumber || 1));
        return Array.isArray(response.hotels) ? response.hotels : [];
    };

    const breadcrumb = (
        <div className="container">
            <div className="d-flex align-items-center small flex-wrap">
                <Link href="/destinations" className="text-dark text-decoration-none">
                    All countries
                </Link>
                <span className="mx-2 text-muted">&bull;</span>
                <Link href="/countries" className="text-dark text-decoration-none">
                    India
                </Link>
                <span className="mx-2 text-muted">&bull;</span>
                <Link href={`/${toSlug(citySlug)}`} className="text-dark text-decoration-none">
                     {cityName || formatCityName(citySlug)}
                </Link>
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
