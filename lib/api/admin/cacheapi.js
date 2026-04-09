import { fetchClient } from '../public/fetchClient';

export const clearCacheApi = async (token) => {
    return fetchClient('/admin/cache/clear', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
