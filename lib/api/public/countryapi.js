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
        const response = await fetchClient(`/slug?slug=${slug}`, {
            method: 'GET'
        });

        return response;
    } catch (error) {
        console.error('Error resolving slug:', error);
        return null;
    }
}
