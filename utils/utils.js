// utils/helpers/formatCountryName.js
export function formatCountryName(slug = '') {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '); 
}
