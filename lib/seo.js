function decodeUntilStable(value = '', maxPasses = 3) {
    let current = String(value || '');

    for (let pass = 0; pass < maxPasses; pass++) {
        if (!/%[0-9A-Fa-f]{2}/.test(current)) {
            break;
        }

        try {
            const decoded = decodeURIComponent(current);
            if (decoded === current) {
                break;
            }
            current = decoded;
        } catch {
            break;
        }
    }

    return current;
}

function formatSlugLabel(value = '') {
    return decodeUntilStable(value)
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
            return decodeUntilStable(value.trim());
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

function buildCanonicalPath(...segments) {
    return `/${segments
        .map((segment) => String(segment || '').replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/')}`
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');
}

function buildSeoMeta({ titleCandidates = [], descriptionCandidates = [], defaultTitle = '' } = {}) {
    return {
        metaTitle: getFirstDefinedString(...titleCandidates) || defaultTitle,
        metaDescription: normalizeText(getFirstDefinedString(...descriptionCandidates))
    };
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
    const canonicalPath = buildCanonicalPath(countrySlug, regionSlug);
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const defaultTitle = `${regionName} `.trim();
    const { metaTitle, metaDescription } = buildSeoMeta({
        titleCandidates: [resolvedSlugData?.metaTitle, resolvedSlugData?.name],
        descriptionCandidates: [resolvedSlugData?.metaDescription],
        defaultTitle
    });

    return {
        canonicalPath,
        canonicalUrl,
        countryName,
        metaDescription,
        metaTitle,
        regionName
    };
}

export function buildCountrySeo({ countrySlug = '', resolvedSlugData = {} } = {}) {
    const countryName = formatSlugLabel(countrySlug);
    const canonicalPath = buildCanonicalPath(countrySlug);
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const defaultTitle = countryName;
    const { metaTitle, metaDescription } = buildSeoMeta({
        titleCandidates: [resolvedSlugData?.metaTitle, resolvedSlugData?.name],
        descriptionCandidates: [resolvedSlugData?.metaDescription],
        defaultTitle
    });

    return {
        canonicalPath,
        canonicalUrl,
        countryName,
        metaDescription,
        metaTitle
    };
}

export function buildCitySeo({ citySlug = '', resolvedSlugData = {}, firstHotel = {}, countryName = '', countrySlug = '' } = {}) {
    const cityName = formatSlugLabel(citySlug);
    const canonicalPath = buildCanonicalPath(citySlug);
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const resolvedCountryName = formatSlugLabel(countryName || firstHotel?.countryName || firstHotel?.country || countrySlug);
    const defaultTitle = cityName;
    const { metaTitle, metaDescription } = buildSeoMeta({
        titleCandidates: [resolvedSlugData?.metaTitle],
        descriptionCandidates: [resolvedSlugData?.metaDescription],
        defaultTitle
    });

    return {
        canonicalPath,
        canonicalUrl,
        countryName: resolvedCountryName,
        metaDescription,
        metaTitle,
        cityName
    };
}

export function buildBrandSeo({ parentSlug = '', brandSlug = '', pageType = 'countrybrand', resolvedSlugData = {} } = {}) {
    const parentName = formatSlugLabel(parentSlug);
    const brandName = formatSlugLabel(brandSlug);
    const canonicalPath = buildCanonicalPath(parentSlug, brandSlug);
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const defaultTitle = `${brandName} ${parentName}`.trim();
    const { metaTitle, metaDescription } = buildSeoMeta({
        titleCandidates: [resolvedSlugData?.metaTitle],
        descriptionCandidates: [resolvedSlugData?.metaDescription],
        defaultTitle
    });

    return {
        canonicalPath,
        canonicalUrl,
        metaDescription,
        metaTitle,
        parentName,
        brandName,
        pageType
    };
}

export function buildCategorySeo({ citySlug = '', categorySlug = '', cityName = '', countryName = '', resolvedSlugData = {} } = {}) {
    const resolvedCityName = getFirstDefinedString(cityName) || formatSlugLabel(citySlug);
    const resolvedCategoryName = formatSlugLabel(categorySlug);
    const canonicalPath = buildCanonicalPath(citySlug, categorySlug);
    const canonicalUrl = buildAbsoluteUrl(canonicalPath);
    const defaultTitle = `${resolvedCategoryName} in ${resolvedCityName}`.trim();
    const { metaTitle, metaDescription } = buildSeoMeta({
        titleCandidates: [resolvedSlugData?.metaTitle, resolvedSlugData?.name],
        descriptionCandidates: [resolvedSlugData?.metaDescription],
        defaultTitle
    });

    return {
        canonicalPath,
        canonicalUrl,
        cityName: resolvedCityName,
        categoryName: resolvedCategoryName,
        countryName: formatSlugLabel(countryName),
        metaDescription,
        metaTitle
    };
}
