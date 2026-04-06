'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import CityHotelList from './CityHotelList';
import { getSidebarData } from '@/lib/api/sidebarapi';
import ListingLayout from '@/components/common/listing/ListingLayout';
import {
    buildCategorySidebarSections,
    getCityCategoryHotels,
    normalizeCategoryItems,
    resolveCityContextFromSlug,
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
    onPageInfoChange = null
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hotelRows, setHotelRows] = useState([]);
    const [sidebarData, setSidebarData] = useState({});
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [resolvedCityId, setResolvedCityId] = useState(null);
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

                if (Number(initialResolvedCityId) > 0) {
                    cityContext = {
                        cityId: Number(initialResolvedCityId),
                        cityName: String(initialResolvedCityName || formatCityName(citySlug)).trim()
                    };
                } else {
                    cityContext = await resolveCityContextFromSlug(citySlug);
                }

                const cityId = cityContext?.cityId;

                if (!cityId) {
                    throw new Error('Unable to resolve the city for this listing.');
                }

                if (cancelled) return;

                setResolvedCityId(cityId);

                const initialCategoryId = Number(resolvedCategoryId);
                const hasInitialCategoryId = Number.isInteger(initialCategoryId) && initialCategoryId > 0;

                let response = null;
                let effectiveCategoryId = hasInitialCategoryId ? initialCategoryId : 0;

                if (!hasInitialCategoryId) {
                    throw new Error('CategoryId is required.');
                }

                if (!response || hasInitialCategoryId) {
                    response = await getCityCategoryHotels({
                        cityId,
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
                    String(cityContext?.cityName || '').trim() ||
                    formatCityName(citySlug);

                setHotelRows(Array.isArray(response.hotels) ? response.hotels : []);
                setSidebarData(await getSidebarData({ cityId: cityId }));
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
    }, [citySlug, categorySlug, initialResolvedCityId, initialResolvedCityName, resolvedCategoryId, slugKey, onPageInfoChange]);

    const sidebarSections = useMemo(() => {
        return buildCategorySidebarSections(sidebarData, {
            citySlug,
            cityName: cityName || formatCityName(citySlug),
            activeCategorySlug: categorySlug
        });
    }, [categorySlug, cityName, citySlug, sidebarData]);

    const fetchMoreHotels = async ({ pageNumber, pageSize: nextPageSize }) => {
        if (!resolvedCityId || !resolvedCategoryId) return [];

        const response = await getCityCategoryHotels({
            cityId: resolvedCityId,
            categoryId: resolvedCategoryId,
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
                    Hotel {cityName || formatCityName(citySlug)}
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
