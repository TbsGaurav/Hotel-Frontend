import { fetchClient } from "./fetchClient";

export const getCountriesApi = async () => {
    const json = await fetchClient('/country/list', {
        cache: 'no-store' // SSR
        // OR: next: { revalidate: 3600 }
    });

    return json.data || [];
};
