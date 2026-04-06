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
        const encodedSlug = encodeURIComponent(String(slug || ''));
        const response = await fetchClient(`/slug?url=${encodedSlug}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        if (error?.name === 'AbortError' || error?.cause?.code === 'UND_ERR_BODY_TIMEOUT') {
            return null;
        }

        if (error?.digest === 'NEXT_HTTP_ERROR_FALLBACK;404') {
            return null;
        }

        console.error('Error resolving slug:', error);
        return null;
    }
}
