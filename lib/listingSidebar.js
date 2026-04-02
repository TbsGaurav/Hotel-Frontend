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

function getSidebarItems(sidebarData, ...keys) {
    for (const key of keys) {
        const value = getSidebarValue(sidebarData, key);
        if (Array.isArray(value)) return value;
    }

    return [];
}

function formatSidebarLabel(label, locationName, sectionTitle = '') {
    const value = String(label || '').trim();
    if (!value) return value;

    const location = String(locationName || '').trim();
    const locationLower = location.toLowerCase();
    const lower = value.toLowerCase();
    const section = String(sectionTitle || '').toLowerCase();

    if (location && lower.includes(locationLower)) {
        return value;
    }

    if (section.includes('rating')) {
        return location ? `${value} ${location} Hotels` : value;
    }

    if (section.includes('property type')) {
        return value;
    }

    if (location) {
        return `${location} Hotels with ${value}`;
    }

    return value;
}

function decorateSidebarItems(items, locationName, sectionTitle) {
    return normalizeItems(items).map((item) => ({
        ...item,
        categoryName: formatSidebarLabel(item?.categoryName ?? item?.name ?? item?.label ?? '', locationName, sectionTitle)
    }));
}

function formatPropertyTypeHeader(locationName) {
    const location = String(locationName || '').trim();
    return location ? `${location} Apartments, Suites and Family Hotels` : 'Property Type';
}

export function buildListingSidebarSections(sidebarData, locationName) {
    return [
        {
            sectionId: 'rating',
            title: 'Rating',
            items: decorateSidebarItems(getSidebarItems(sidebarData, 'ratings', 'rating', 'ratingItems'), locationName, 'Rating'),
            maxVisible: 6
        },
        {
            sectionId: 'property-type',
            title: 'Property Type',
            displayTitle: formatPropertyTypeHeader(locationName),
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'propertyTypes', 'propertyType', 'propertyTypeItems'),
                locationName,
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
                locationName,
                'Facilities'
            ),
            maxVisible: 5
        },
        {
            sectionId: 'city-cbd',
            title: 'City & CBD',
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'cityAndCbd', 'cityAndCBD', 'cityAndCbdItems'),
                locationName,
                'City & CBD'
            ),
            maxVisible: 5
        },
        {
            sectionId: 'entertainment',
            title: 'Entertainment',
            items: decorateSidebarItems(getSidebarItems(sidebarData, 'entertainment', 'entertainmentItems'), locationName, 'Entertainment'),
            maxVisible: 5
        },
        {
            sectionId: 'relaxation-exercise',
            title: 'Relaxation & Exercise',
            items: decorateSidebarItems(
                getSidebarItems(sidebarData, 'relaxationAndExercise', 'relaxation', 'relaxationItems'),
                locationName,
                'Relaxation & Exercise'
            ),
            maxVisible: 5
        }
    ];
}
