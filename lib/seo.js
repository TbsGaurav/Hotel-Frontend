function formatSlugLabel(value = '') {
    return String(value || '')
        .trim()
        .replace(/[-_]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getFirstDefinedString(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return '';
}

function normalizeText(value = '') {
    return String(value || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getSiteOrigin() {
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (configuredOrigin) {
        return configuredOrigin.replace(/\/+$/, '');
    }

    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
    }

    return '';
}

export function buildAbsoluteUrl(path = '') {
    const normalizedPath = String(path || '').startsWith('/') ? String(path || '') : `/${String(path || '')}`;
    const origin = getSiteOrigin();

    if (!origin) {
        return normalizedPath;
    }

    return `${origin}${normalizedPath}`;
}

export function buildRegionSeo({ countrySlug = '', regionSlug = '', resolvedSlugData = {} } = {}) {
    const countryName = formatSlugLabel(countrySlug);
    const regionName = formatSlugLabel(regionSlug);
    const canonicalPath = `/${String(countrySlug || '').replace(/^\/+/, '')}/${String(regionSlug || '').replace(/^\/+/, '')}`
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);

    const heading =
        getFirstDefinedString(
            resolvedSlugData?.h1,
            resolvedSlugData?.header,
            resolvedSlugData?.pageHeading,
            resolvedSlugData?.title,
            resolvedSlugData?.name
        ) || `${regionName} Hotels in ${countryName}`.trim();

    const metaTitle =
        getFirstDefinedString(
            resolvedSlugData?.metaTitle,
            resolvedSlugData?.metatitle,
            resolvedSlugData?.meta_title,
            resolvedSlugData?.seoTitle,
            resolvedSlugData?.title,
            heading
        ) || heading;

    const metaDescription = getFirstDefinedString(resolvedSlugData?.metaDescription, resolvedSlugData?.metadescription);

    return {
        canonicalPath,
        canonicalUrl,
        countryName,
        heading,
        metaDescription,
        metaTitle,
        regionName
    };
}

export function buildCountrySeo({ countrySlug = '', resolvedSlugData = {} } = {}) {
    const countryName = formatSlugLabel(countrySlug);
    const canonicalPath = `/${String(countrySlug || '').replace(/^\/+/, '')}`.replace(/\/+/g, '/').replace(/\/$/, '');
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);

    const heading =
        getFirstDefinedString(
            resolvedSlugData?.h1,
            resolvedSlugData?.header,
            resolvedSlugData?.pageHeading,
            resolvedSlugData?.title,
            resolvedSlugData?.name
        ) || ` ${countryName}`.trim();

    const metaTitle =
        getFirstDefinedString(
            resolvedSlugData?.metaTitle,
            resolvedSlugData?.metatitle,
            resolvedSlugData?.meta_title,
            resolvedSlugData?.seoTitle,
            resolvedSlugData?.title,
            heading
        ) || heading;

    const metaDescription = normalizeText(
        getFirstDefinedString(
            resolvedSlugData?.metaDescription,
            resolvedSlugData?.metadescription,
            resolvedSlugData?.meta_description,
            resolvedSlugData?.metadesc,
            resolvedSlugData?.metaDesc,
            resolvedSlugData?.description,
            resolvedSlugData?.countryContent,
            resolvedSlugData?.content
        )
    );

    return {
        canonicalPath,
        canonicalUrl,
        countryName,
        heading,
        metaDescription,
        metaTitle
    };
}

export function buildCitySeo({ citySlug = '', resolvedSlugData = {}, firstHotel = {}, countryName = '', countrySlug = '' } = {}) {
    const cityName = formatSlugLabel(citySlug);
    const canonicalPath = `/${String(citySlug || '').replace(/^\/+/, '')}`.replace(/\/+/g, '/').replace(/\/$/, '');
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const resolvedCountryName = formatSlugLabel(countryName || firstHotel?.countryName || firstHotel?.country || countrySlug);

    const heading =
        getFirstDefinedString(
            resolvedSlugData?.h1,
            resolvedSlugData?.header,
            resolvedSlugData?.pageHeading,
            resolvedSlugData?.title,
            resolvedSlugData?.name
        ) || ` ${cityName}`.trim();

    const metaTitle =
        getFirstDefinedString(
            resolvedSlugData?.metaTitle,
            resolvedSlugData?.metatitle,
            resolvedSlugData?.meta_title,
            resolvedSlugData?.seoTitle,
            resolvedSlugData?.title,
            heading
        ) || heading;

    const metaDescription = normalizeText(
        getFirstDefinedString(
            resolvedSlugData?.metaDescription,
            resolvedSlugData?.metadescription,
            resolvedSlugData?.meta_description,
            resolvedSlugData?.metadesc,
            resolvedSlugData?.metaDesc,
            resolvedSlugData?.description,
            firstHotel?.content,
            resolvedSlugData?.content
        )
    );

    return {
        canonicalPath,
        canonicalUrl,
        countryName: resolvedCountryName,
        heading,
        metaDescription,
        metaTitle,
        cityName
    };
}

export function buildBrandSeo({ parentSlug = '', brandSlug = '', pageType = 'countrybrand', resolvedSlugData = {} } = {}) {
    const parentName = formatSlugLabel(parentSlug);
    const brandName = formatSlugLabel(brandSlug);
    const canonicalPath = `/${String(parentSlug || '').replace(/^\/+/, '')}/${String(brandSlug || '').replace(/^\/+/, '')}`
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);

    const heading =
        getFirstDefinedString(
            resolvedSlugData?.h1,
            resolvedSlugData?.header,
            resolvedSlugData?.pageHeading,
            resolvedSlugData?.title,
            resolvedSlugData?.name
        ) || `${brandName} in ${parentName}`.trim();

    const metaTitle =
        getFirstDefinedString(
            resolvedSlugData?.metaTitle,
            resolvedSlugData?.metatitle,
            resolvedSlugData?.meta_title,
            resolvedSlugData?.seoTitle,
            resolvedSlugData?.title,
            heading
        ) || heading;

    const metaDescription = normalizeText(
        getFirstDefinedString(
            resolvedSlugData?.metaDescription,
            resolvedSlugData?.metadescription,
            resolvedSlugData?.meta_description,
            resolvedSlugData?.metadesc,
            resolvedSlugData?.metaDesc,
            resolvedSlugData?.description,
            resolvedSlugData?.content,
            resolvedSlugData?.brandContent,
            resolvedSlugData?.countryBrandContent,
            resolvedSlugData?.cityBrandContent
        )
    );

    return {
        canonicalPath,
        canonicalUrl,
        heading,
        metaDescription,
        metaTitle,
        parentName,
        brandName,
        pageType
    };
}
