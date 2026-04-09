'use client';

import CityCategoryDetails from './CityCategoryDetails';

export default function CityCategoryRouteApp({
    citySlug = '',
    categorySlug = '',
    resolvedCategoryId = null,
    resolvedCityId = null,
    resolvedCityName = '',
    resolvedRegionId = null,
    resolvedRegionName = ''
}) {
    return (
        <CityCategoryDetails
            citySlug={citySlug}
            categorySlug={categorySlug}
            resolvedCategoryId={resolvedCategoryId}
            resolvedCityId={resolvedCityId}
            resolvedCityName={resolvedCityName}
            resolvedRegionId={resolvedRegionId}
            resolvedRegionName={resolvedRegionName}
        />
    );
}
