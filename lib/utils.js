// utils/helpers/formatCountryName.js
export function formatCountryName(slug = '') {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const currencyMap = {
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    US: 'USD',
    CN: 'CNY',
    JP: 'JPY',
    IN: 'INR',
    ID: 'IDR',
    SG: 'SGD',
    MY: 'MYR',
    PH: 'PHP',
    AU: 'AUD',
    NZ: 'NZD',
    GB: 'GBP',
    CA: 'CAD',
    AE: 'AED',
    SA: 'SAR'
};

export function countryToCurrency(countryCode) {
    return currencyMap[countryCode] || 'USD';
}
