import { fetchClient } from './fetchClient';

function safeDecodeURIComponent(value = '') {
    try {
        return decodeURIComponent(String(value || ''));
    } catch {
        return String(value || '');
    }
}

export const getCountriesApi = async (searchTerm = '') => {
    const json = await fetchClient(`/countries?searchTerm=${searchTerm}`, {
        next: { revalidate: 3600 }
    });

    return json.data || [];
};

export const getCountryByUrlName = async (urlName) => {
    const json = await fetchClient(`/countries/${urlName}`, {
        next: { revalidate: 3600 }
    });

    return json.data;
};

export async function resolveSlug(slug) {
    try {
        const rawSlug = String(slug || '').trim();
        const normalizedSlug = safeDecodeURIComponent(rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`);
        const encodedSlug = encodeURIComponent(normalizedSlug);
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
