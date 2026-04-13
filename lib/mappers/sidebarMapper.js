function normalizeItems(items) {
    return Array.isArray(items) ? items : [];
}

function getSidebarValue(sidebarData, key) {
    if (!sidebarData || !key) return undefined;

    if (Array.isArray(sidebarData[key])) return sidebarData[key];

    const lowerKey = String(key).toLowerCase();
    const matchedKey = Object.keys(sidebarData).find((existingKey) => existingKey.toLowerCase() === lowerKey);

    return matchedKey ? sidebarData[matchedKey] : undefined;
}

function getSidebarItems(sidebarData, ...keys) {
    for (const key of keys) {
        const value = getSidebarValue(sidebarData, key);
        if (Array.isArray(value)) return value;
    }

    return [];
}

function mergeUniqueItems(...groups) {
    const seen = new Set();
    const merged = [];

    for (const group of groups) {
        for (const item of normalizeItems(group)) {
            const label = String(item?.categoryName ?? item?.name ?? item?.label ?? '').trim();
            const key = label.toLowerCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            merged.push(item);
        }
    }

    return merged;
}

function formatSidebarLabel(label, contextName, sectionTitle = '') {
    const value = String(label || '').trim();
    if (!value) return value;

    const context = String(contextName || '').trim();
    const contextLower = context.toLowerCase();
    const lower = value.toLowerCase();
    const section = String(sectionTitle || '').toLowerCase();

    if (context && lower.includes(contextLower)) {
        return value;
    }

    if (section.includes('rating')) {
        return context ? `${value} ${context} Hotels` : value;
    }

    if (section.includes('property type')) {
        return value;
    }

    if (context) {
        return `${context} Hotels with ${value}`;
    }

    return value;
}

function decorateSidebarItems(items, contextName, sectionTitle) {
    return normalizeItems(items).map((item) => ({
        ...item,
        categoryName: formatSidebarLabel(item?.categoryName ?? item?.name ?? item?.label ?? '', contextName, sectionTitle)
    }));
}

export function buildSidebarSections(sidebarData, { contextName = '', propertyTypeHeader = null } = {}) {
    const collections = getSidebarItems(sidebarData, 'collections', 'collectionItems');

    return [
        ...(collections.length > 0
            ? [
                  {
                      sectionId: 'collections',
                      title: contextName ? `${contextName} Collection Hotel List` : 'Collections',
                      items: collections.map((item) => ({
                          ...item,
                          categoryName: item.collectionName || item.categoryName || '',
                          categoryUrlName: item.collectionSlug || item.categoryUrlName || ''
                      })),
                      maxVisible: 10
                  }
              ]
            : []),
        {
            sectionId: 'rating',
            title: 'Rating',
            items: decorateSidebarItems(getSidebarItems(sidebarData, 'ratings', 'rating', 'ratingItems'), contextName, 'Rating'),
            maxVisible: 6
        },
        {
            sectionId: 'property-type',
            title: 'Property Type',
            displayTitle: propertyTypeHeader || undefined,
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'propertyTypes', 'propertyType', 'propertyTypeItems'),
                contextName,
                'Property Type'
            ),
            maxVisible: 5
        },
        {
            sectionId: 'facilities',
            title: 'Facilities',
            items: decorateSidebarItems(
                mergeUniqueItems(
                    getSidebarItems(sidebarData, 'roomFacilities', 'roomFacility', 'roomFacilityItems'),
                    getSidebarItems(sidebarData, 'hotelFacilities', 'facilityItems', 'facilities')
                ),
                contextName,
                'Facilities'
            ),
            maxVisible: 5
        },
        {
            sectionId: 'city-cbd',
            title: 'City & CBD',
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'cityAndCbd', 'cityAndCBD', 'cityAndCbdItems'),
                contextName,
                'City & CBD'
            ),
            maxVisible: 5
        },
        {
            sectionId: 'entertainment',
            title: 'Entertainment',
            items: decorateSidebarItems(getSidebarItems(sidebarData, 'entertainment', 'entertainmentItems'), contextName, 'Entertainment'),
            maxVisible: 5
        },
        {
            sectionId: 'relaxation-exercise',
            title: 'Relaxation & Exercise',
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'relaxationAndExercise', 'relaxation', 'relaxationItems'),
                contextName,
                'Relaxation & Exercise'
            ),
            maxVisible: 5
        }
    ];
}
