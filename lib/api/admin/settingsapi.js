import { fetchClient } from '../public/fetchClient';

export const getSettingsApi = async () => {
    return fetchClient(`/settings`);
};

export const upsertSettingsApi = async (payload) => {
    return await fetchClient('/settings', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
};
