
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
    return currencyMap[countryCode] || 'AUD';
}

export const ROLES = ['Admin', 'Editor', 'Viewer'];

export function isRole(role) {
    return ROLES.includes(role);
}

export function isAdminRole(role) {
    return role === 'Admin';
}


/**
 * Clean URL by removing extra leading slashes
 * @param {string} url 
 * @returns {string}
 */
export function cleanUrl(url) {
    if (!url || typeof url !== 'string' || url.startsWith('http')) return url;
    return '/' + url.replace(/^\/+/, '');
}

/**
 * Ensures URL ends with .htm if it's an internal link
 * @param {string} url 
 * @returns {string}
 */
export function ensureHtm(url) {
    if (!url || url === '#' || url === '/' || url.startsWith('http') || url.startsWith('/admin')) return url;
    
    // Standardize leading slash and remove duplicates
    const standardizedUrl = cleanUrl(url);
    
    const [path, query] = standardizedUrl.split('?');
    if (path.endsWith('.htm') || path.includes('.')) return standardizedUrl;
    return `${path}.htm${query ? `?${query}` : ''}`;
}
