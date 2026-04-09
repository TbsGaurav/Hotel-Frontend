export const RULE_FIELDS = [
    { label: 'GeoNode', value: 'GeoContainment' },
    { label: 'Star Rating', value: 'StarRating' },
    { label: 'Review Score', value: 'ReviewScore' },
    { label: 'Amenities', value: 'Amenities' },
    { label: 'Intent Tag', value: 'IntentTag' },
    { label: 'Distance radius', value: 'DistanceRadius' },
    { label: 'Price Band', value: 'PriceBand' },
    { label: 'Property Type', value: 'PropertyType' },
    { label: 'Brand', value: 'Brand' },
    { label: 'Booking.com', value: 'Booking.com' },
    { label: 'Custom internal tags', value: 'CustomInternalTags' }
];

export const RULE_OPERATORS = [
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: 'IN', value: 'IN' },
    { label: 'LIKE', value: 'LIKE' }
];

export const RULE_VALUE_OPTIONS = {
    StarRating: ['1', '2', '3', '4', '5'],
    ReviewScore: ['6', '7', '8', '9', '9.5'],
    PriceBand: ['Budget', 'Mid', 'Upscale', 'Luxury'],
    IntentTag: ['Family', 'Luxury', 'Business', 'Romantic', 'Eco Friendly', 'Beachfront'],
    BookingRating: ['7+', '8+', '8.5+', '9+'],
    CustomInternalTags: ['Top Seller', 'High Margin', 'Preferred Partner', 'Contracted']
};

export const COLLECTION_STATUS_OPTIONS = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Live', value: 'Live' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Published', value: 'Published' }
];

export const FIELD_OPERATOR_RULES = {
    GeoContainment: ['='],
    StarRating: ['=', '!=', '>=', '<=', '>', '<'],
    ReviewScore: ['=', '!=', '>=', '<=', '>', '<'],
    DistanceRadius: ['=', '!=', '>=', '<=', '>', '<'],
    Amenities: ['='],
    PropertyType: ['='],
    Brand: ['LIKE'],
    IntentTag: ['LIKE']
};

export const getOperatorsForField = (field) => {
    const allowedOperators = FIELD_OPERATOR_RULES[field];

    if (!allowedOperators) return RULE_OPERATORS;

    return RULE_OPERATORS.filter((op) => allowedOperators.includes(op.value));
};
