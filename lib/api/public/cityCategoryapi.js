import { fetchClient } from './fetchClient';
import { getSidebarData } from '../sidebarapi';
import { resolveSlug } from './countryapi';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';

const cityIdCache = new Map();
const cityContextCache = new Map();
const categoryListCache = new Map();
const globalCategoryCache = {
    loaded: false,
    categories: []
};

const PROPERTY_TYPE_HEADER_SUFFIX = 'Apartments, Suites and Family Hotels';

export function toSlug(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
}

function encodePathSegment(value = '') {
    return encodeURIComponent(String(value || '').trim());
}

export function buildCategoryListingPath(primarySlug = '', categorySlug = '') {
    const normalizedPrimarySlug = toSlug(primarySlug);
    const normalizedCategorySegments = String(categorySlug || '')
        .split('/')
        .map((segment) => toSlug(segment))
        .filter(Boolean);

    if (!normalizedPrimarySlug || !normalizedCategorySegments.length) {
        return '';
    }

    return `/${encodePathSegment(normalizedPrimarySlug)}/${normalizedCategorySegments.map(encodePathSegment).join('/')}`;
}

export function getFirstDefined(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return null;
}

export function normalizeCategoryUrlSlug(urlName = '') {
    const cleaned = decodeURIComponent(String(urlName || '').trim())
        .replace(/\.htm$/i, '')
        .replace(/\/+$/, '');

    return cleaned.split('/').filter(Boolean).pop() || '';
}

export function normalizeCategoryResponse(response) {
    const payload = response?.data ?? response ?? {};
    const hotels = Array.isArray(payload.hotels)
        ? payload.hotels
        : Array.isArray(payload.hotelData)
          ? payload.hotelData
          : Array.isArray(payload.items)
            ? payload.items
            : [];
    const categories = Array.isArray(payload.categories)
        ? payload.categories
        : Array.isArray(payload.categoryData)
          ? payload.categoryData
          : Array.isArray(payload.categoryList)
            ? payload.categoryList
            : [];

    return {
        categories,
        hotels,
        totalCount: Number(payload.totalCount ?? payload.count ?? hotels?.[0]?.totalCount ?? hotels.length ?? 0),
        pageNo: Number(payload.pageNo ?? payload.pageNumber ?? 1),
        pageSize: Number(payload.pageSize ?? 10),
        raw: payload
    };
}

export async function getCityCategoryHotels({ cityId, regionId, categoryId, pageNo = 1, pageSize = 10 } = {}) {
    const payload = {
        categoryId,
        pageNo,
        pageSize
    };

    const normalizedCityId = Number(cityId);
    if (Number.isInteger(normalizedCityId) && normalizedCityId > 0) {
        payload.cityId = normalizedCityId;
    }

    const normalizedRegionId = Number(regionId);
    if (Number.isInteger(normalizedRegionId) && normalizedRegionId > 0) {
        payload.regionId = normalizedRegionId;
    }

    const response = await fetchClient('/cities/category-hotels', {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    return normalizeCategoryResponse(response);
}

function formatCityName(slug = '') {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getSidebarCategoryLabel(item = {}) {
    return String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
}

function buildPropertyTypeHeader(cityName = '') {
    return cityName ? `${cityName} ${PROPERTY_TYPE_HEADER_SUFFIX}` : 'Property Type';
}

function buildCategorySlugFromDisplayLabel(label = '', { sectionId = '', citySlug = '' } = {}) {
    const normalizedLabel = toSlug(label);
    const normalizedCitySlug = toSlug(citySlug);

    if (!normalizedLabel) return '';

    if (sectionId === 'property-type' && normalizedCitySlug) {
        return `${normalizedCitySlug}-${normalizedLabel}`;
    }

    return normalizedLabel;
}

function buildSidebarSectionsForCity(sidebarData = {}, citySlug = '', cityName = '') {
    return buildSidebarSections(sidebarData, {
        contextName: cityName || formatCityName(citySlug),
        propertyTypeHeader: buildPropertyTypeHeader(cityName || formatCityName(citySlug))
    });
}

function buildSidebarSectionsForRegion(sidebarData = {}, regionSlug = '', regionName = '') {
    const label = regionName || formatCityName(regionSlug);
    return buildSidebarSections(sidebarData, {
        contextName: label,
        propertyTypeHeader: label ? `${label} Hotels` : 'Property Type'
    });
}

function buildSidebarCategoryIndex(sidebarData = {}, citySlug = '', cityName = '') {
    const sections = buildSidebarSectionsForCity(sidebarData, citySlug, cityName);
    const entries = [];

    for (const section of sections) {
        for (const item of Array.isArray(section?.items) ? section.items : []) {
            const label = getSidebarCategoryLabel(item);
            const categoryId = getFirstDefined(item?.categoryId, item?.CategoryId, item?.id);
            const generatedSlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug
            });

            if (!label || categoryId === null || categoryId === undefined || categoryId === '') {
                continue;
            }

            entries.push({
                ...item,
                sectionId: section.sectionId,
                displayLabel: label,
                categoryId: Number(categoryId),
                categoryName: label,
                categorySlug: generatedSlug,
                href: buildCategoryListingPath(citySlug, generatedSlug)
            });
        }
    }

    return entries;
}

function buildSidebarCategoryIndexForRegion(sidebarData = {}, regionSlug = '', regionName = '') {
    const sections = buildSidebarSectionsForRegion(sidebarData, regionSlug, regionName);
    const entries = [];

    for (const section of sections) {
        for (const item of Array.isArray(section?.items) ? section.items : []) {
            const label = getSidebarCategoryLabel(item);
            const categoryId = getFirstDefined(item?.categoryId, item?.CategoryId, item?.id);
            const generatedSlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug: regionSlug
            });

            if (!label || categoryId === null || categoryId === undefined || categoryId === '') {
                continue;
            }

            entries.push({
                ...item,
                sectionId: section.sectionId,
                displayLabel: label,
                categoryId: Number(categoryId),
                categoryName: label,
                categorySlug: generatedSlug,
                href: buildCategoryListingPath(regionSlug, generatedSlug)
            });
        }
    }

    return entries;
}

export function buildCategorySidebarSections(
    sidebarData = {},
    { citySlug = '', cityName = '', activeCategorySlug = '' } = {}
) {
    const sections = buildSidebarSectionsForCity(sidebarData, citySlug, cityName);
    const normalizedCitySlug = toSlug(citySlug);
    const normalizedActiveSlug = toSlug(categorySlugFromAny(activeCategorySlug));

    return sections.map((section) => ({
        ...section,
        items: (section.items || []).map((item) => {
            const label = getSidebarCategoryLabel(item);
            const categorySlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug: normalizedCitySlug
            });

            if (!categorySlug) {
                return item;
            }

            const baseHref = buildCategoryListingPath(normalizedCitySlug, categorySlug);

            return {
                ...item,
                href: baseHref,
                isActive: categorySlug === normalizedActiveSlug
            };
        })
    }));
}

export function buildRegionCategorySidebarSections(
    sidebarData = {},
    { regionSlug = '', regionName = '', activeCategorySlug = '' } = {}
) {
    const sections = buildSidebarSectionsForRegion(sidebarData, regionSlug, regionName);
    const normalizedRegionSlug = toSlug(regionSlug);
    const normalizedActiveSlug = toSlug(categorySlugFromAny(activeCategorySlug));

    return sections.map((section) => ({
        ...section,
        items: (section.items || []).map((item) => {
            const label = getSidebarCategoryLabel(item);
            const categorySlug = buildCategorySlugFromDisplayLabel(label, {
                sectionId: section.sectionId,
                citySlug: normalizedRegionSlug
            });

            if (!categorySlug) {
                return item;
            }

            const baseHref = buildCategoryListingPath(normalizedRegionSlug, categorySlug);

            return {
                ...item,
                href: baseHref,
                isActive: categorySlug === normalizedActiveSlug
            };
        })
    }));
}

function categorySlugFromAny(value = '') {
    return normalizeCategoryUrlSlug(value || '').replace(/[^a-z0-9-]+/gi, '-');
}

export async function resolveCityContextFromSlug(citySlug = '') {
    const normalizedCitySlug = toSlug(citySlug);
    if (!normalizedCitySlug) return null;

    if (cityContextCache.has(normalizedCitySlug)) {
        return cityContextCache.get(normalizedCitySlug);
    }

    let resolvedContext = null;

    try {
        const response = await resolveSlug(`/${normalizedCitySlug}`);
        const data = response?.data;
        const cityId = getFirstDefined(data?.cityId, data?.entityId);
        const entityType = String(data?.entityType || data?.EntityType || '')
            .trim()
            .toLowerCase();

        if (entityType === 'city' && cityId !== null && cityId !== undefined && cityId !== '') {
            resolvedContext = {
                cityId: Number(cityId),
                cityName: String(data?.entityName || data?.name || formatCityName(normalizedCitySlug)).trim() || formatCityName(normalizedCitySlug)
            };
        }
    } catch (error) {
        console.error('Error resolving city context from slug:', error);
    }

    cityContextCache.set(normalizedCitySlug, resolvedContext);

    if (resolvedContext?.cityId) {
        cityIdCache.set(normalizedCitySlug, resolvedContext.cityId);
    }

    return resolvedContext;
}

export async function resolveCityIdFromSlug(citySlug = '') {
    const context = await resolveCityContextFromSlug(citySlug);
    return context?.cityId || null;
}

export async function resolveRegionContextFromSlug(regionSlug = '', countrySlug = '') {
    const normalizedRegionSlug = toSlug(regionSlug);
    const normalizedCountrySlug = toSlug(countrySlug);
    if (!normalizedRegionSlug) return null;

    const candidatePaths = normalizedCountrySlug
        ? [`/${normalizedCountrySlug}/${normalizedRegionSlug}`, `/${normalizedRegionSlug}`]
        : [`/${normalizedRegionSlug}`];

    try {
        for (const path of candidatePaths) {
            const response = await resolveSlug(path);
            const data = response?.data;

            if (data?.entityType === 'Region' && data?.entityId) {
                const resolvedCountrySlug = getFirstDefined(
                    data?.countryUrlName,
                    data?.countrySlug,
                    data?.countryUrl,
                    data?.country?.urlName,
                    data?.country?.slug,
                    normalizedCountrySlug
                );
                const resolvedCountryName = getFirstDefined(
                    data?.countryName,
                    data?.country?.name
                );
                return {
                    regionId: Number(data.entityId),
                    regionName: String(data?.entityName || data?.name || formatCityName(normalizedRegionSlug)).trim(),
                    countrySlug: resolvedCountrySlug ? toSlug(resolvedCountrySlug) : '',
                    countryName: resolvedCountryName ? String(resolvedCountryName).trim() : ''
                };
            }
        }
    } catch (error) {
        console.error('Error resolving region context from slug:', error);
    }

    return null;
}

export function getCachedCategories(cityId) {
    return categoryListCache.get(String(cityId)) || null;
}

export function setCachedCategories(cityId, categories) {
    if (cityId === null || cityId === undefined || cityId === '') return;
    categoryListCache.set(String(cityId), Array.isArray(categories) ? categories : []);
}

export function normalizeCategoryItems(categories = []) {
    return (Array.isArray(categories) ? categories : [])
        .filter((item) => {
            const name = String(item?.categoryName ?? item?.categoryTitle ?? item?.name ?? '').trim();
            const urlName = String(item?.categoryUrlName ?? item?.urlName ?? '').trim();
            return Boolean(name && urlName);
        })
        .map((item) => ({
            ...item,
            categoryId: getFirstDefined(item?.categoryId, item?.CategoryId, item?.id),
            categoryName: String(item?.categoryName ?? item?.CategoryName ?? item?.name ?? '').trim(),
            categoryTitle: String(item?.categoryTitle ?? item?.CategoryTitle ?? item?.title ?? '').trim(),
            categoryUrlName: String(item?.categoryUrlName ?? item?.CategoryUrlName ?? item?.urlName ?? '').trim()
        }));
}

export function getSelectedCategoryFromSlug(categories = [], categorySlug = '') {
    const normalizedSlug = toSlug(categorySlug);

    return (
        normalizeCategoryItems(categories).find(
            (item) => normalizeCategoryUrlSlug(item.categoryUrlName).toLowerCase() === normalizedSlug
        ) || null
    );
}

function normalizeCategoryMatchText(value = '') {
    return String(value || '')
        .toLowerCase()
        .replace(/\.htm$/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\b(hotel|hotels|with|and|or|the|of|city|cbd)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function singularizeWord(value = '') {
    const cleaned = normalizeCategoryMatchText(value);
    return cleaned
        .split(' ')
        .map((word) => (word.endsWith('s') && word.length > 3 ? word.slice(0, -1) : word))
        .join(' ')
        .trim();
}

function buildGlobalCategoryIndex(data = {}) {
    const buckets = [data?.data?.amenities, data?.data?.propertyTypes, data?.data?.brands].filter(Array.isArray);
    const flattened = buckets.flat();

    return flattened
        .map((item) => ({
            ...item,
            categoryId: item?.categoryId ?? item?.CategoryId ?? item?.propertyTypeId ?? item?.brandId ?? item?.id ?? null,
            categoryName: String(item?.categoryName ?? item?.propertyTypeName ?? item?.brandName ?? '').trim()
        }))
        .filter((item) => item.categoryId !== null && item.categoryId !== undefined && item.categoryId !== '' && item.categoryName);
}

function scoreCategoryMatch(slug, categoryName) {
    const slugText = singularizeWord(slug);
    const categoryText = singularizeWord(categoryName);

    if (!slugText || !categoryText) return 0;
    if (slugText === categoryText) return 100;
    if (slugText.includes(categoryText)) return 80;
    if (categoryText.includes(slugText)) return 70;

    const slugTokens = new Set(slugText.split(' ').filter(Boolean));
    const categoryTokens = categoryText.split(' ').filter(Boolean);
    if (!categoryTokens.length) return 0;

    const matches = categoryTokens.filter((token) => slugTokens.has(token)).length;
    return Math.round((matches / categoryTokens.length) * 60);
}

export async function getGlobalCategories() {
    if (globalCategoryCache.loaded && globalCategoryCache.categories.length) {
        return globalCategoryCache.categories;
    }

    const response = await fetchClient('/categories', { method: 'GET' });
    const indexed = buildGlobalCategoryIndex(response);

    globalCategoryCache.loaded = true;
    globalCategoryCache.categories = indexed;

    return indexed;
}

export async function resolveCategoryIdFromSlug(categorySlug = '', citySlug = '') {
    const resolved = await resolveCategoryFromSlug(categorySlug, citySlug);
    return resolved?.categoryId || null;
}

export async function resolveCategoryFromSlug(categorySlug = '', citySlug = '') {
    const normalizedCitySlug = toSlug(citySlug);
    const normalizedCategorySlug = toSlug(categorySlugFromAny(categorySlug));

    if (!normalizedCitySlug || !normalizedCategorySlug) {
        return null;
    }

    const cityContext = await resolveCityContextFromSlug(normalizedCitySlug);
    if (!cityContext?.cityId) {
        return null;
    }

    const sidebarData = await getSidebarData({ cityId: cityContext.cityId });
    const indexedCategories = buildSidebarCategoryIndex(sidebarData, normalizedCitySlug, cityContext.cityName);

    const exactMatch = indexedCategories.find((item) => item.categorySlug === normalizedCategorySlug);
    if (exactMatch) {
        return {
            categoryId: exactMatch.categoryId,
            categoryName: exactMatch.categoryName,
            cityId: cityContext.cityId,
            cityName: cityContext.cityName
        };
    }

    const categories = await getGlobalCategories();
    const allowedCategoryIds = new Set(indexedCategories.map((item) => Number(item.categoryId)).filter(Boolean));

    const scored = categories
        .filter((item) => allowedCategoryIds.has(Number(item.categoryId)))
        .map((item) => ({
            ...item,
            score: scoreCategoryMatch(normalizedCategorySlug.replace(/-/g, ' '), item.categoryName)
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    const best = scored[0];
    return best
        ? {
              categoryId: Number(best.categoryId),
              categoryName: best.categoryName,
              cityId: cityContext.cityId,
              cityName: cityContext.cityName
          }
        : null;
}

export async function resolveCategoryFromRegionSlug(categorySlug = '', regionSlug = '', countrySlug = '') {
    const normalizedRegionSlug = toSlug(regionSlug);
    const normalizedCategorySlug = toSlug(categorySlugFromAny(categorySlug));

    if (!normalizedRegionSlug || !normalizedCategorySlug) {
        return null;
    }

    const regionContext = await resolveRegionContextFromSlug(normalizedRegionSlug, countrySlug);
    if (!regionContext?.regionId) {
        return null;
    }

    const sidebarData = await getSidebarData({ regionId: regionContext.regionId });
    const indexedCategories = buildSidebarCategoryIndexForRegion(sidebarData, normalizedRegionSlug, regionContext.regionName);

    const exactMatch = indexedCategories.find((item) => item.categorySlug === normalizedCategorySlug);
    if (exactMatch) {
        return {
            categoryId: exactMatch.categoryId,
            categoryName: exactMatch.categoryName,
            regionId: regionContext.regionId,
            regionName: regionContext.regionName
        };
    }

    const categories = await getGlobalCategories();
    const allowedCategoryIds = new Set(indexedCategories.map((item) => Number(item.categoryId)).filter(Boolean));

    const scored = categories
        .filter((item) => allowedCategoryIds.has(Number(item.categoryId)))
        .map((item) => ({
            ...item,
            score: scoreCategoryMatch(normalizedCategorySlug.replace(/-/g, ' '), item.categoryName)
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    const best = scored[0];
    return best
        ? {
              categoryId: Number(best.categoryId),
              categoryName: best.categoryName,
              regionId: regionContext.regionId,
              regionName: regionContext.regionName
          }
        : null;
}
