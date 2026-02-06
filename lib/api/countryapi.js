import { fetchClient } from './fetchClient';

export const getCountriesApi = async () => {
    const json = await fetchClient('/country/list', {
        cache: 'no-store'
    });

    return json.data || [];
};

export const getCountryByUrlName = async (urlName) => {
    const json = await fetchClient(`/country/getByUrl/${urlName}`, {
        cache: 'no-store'
    });

    return json.data;
};
