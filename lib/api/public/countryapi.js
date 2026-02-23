import { fetchClient } from './fetchClient';

export const getCountriesApi = async () => {
    const json = await fetchClient('/countries', {
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
