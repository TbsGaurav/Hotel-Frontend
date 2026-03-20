import { fetchClient } from './fetchClient';

export const getCountriesApi = async (searchTerm = '') => {
    const json = await fetchClient(`/countries?searchTerm=${searchTerm}`, {
        cache: 'no-store'
    });

    return json.data || [];
};

export const getCountryByUrlName = async (urlName) => {
    const json = await fetchClient(`/countries/${urlName}`, {
        cache: 'no-store'
    });

    return json.data;
};

export async function resolveSlug(slug) {
    try {
        const response = await fetchClient(`/slug?url=${slug}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        if (error?.digest === 'NEXT_HTTP_ERROR_FALLBACK;404') {
            throw error;
        }

        console.error('Error resolving slug:', error);
        return null;
    }
}

export const getCitiesByRegion = async (countrySlug, regionSlug) => {
    const urlName = encodeURIComponent(`/${countrySlug}/${regionSlug}`);
    return fetchClient(`/regions/${urlName}`);
};

export async function getBrandCountries(urlName) {
    try {
        const response = await fetchClient(`/brand/${urlName}`, {
            method: 'GET'
        });

        return response?.data || [];
    } catch (error) {
        console.error('Brand API Error:', error);
        return [];
    }
}
