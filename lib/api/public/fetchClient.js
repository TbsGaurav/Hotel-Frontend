import { notFound } from 'next/navigation';

function getBaseUrl() {
    const configuredBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.API_BASE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL;

    if (configuredBaseUrl) {
        return configuredBaseUrl.replace(/\/+$/, '');
    }

    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
    }

    return 'http://localhost:3000';
}

export async function fetchClient(endpoint, options = {}) {
    const baseUrl = getBaseUrl();
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;


    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const signal = options.signal || controller.signal;

    try {
        const res = await fetch(`${baseUrl}${normalizedEndpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options,
            signal,
            cache: 'no-store'
        });

        const text = await res.text();

        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            throw new Error(`Invalid JSON response (HTTP ${res.status})`);
        }

        if (res.status === 404) {
            notFound();
        }

        if (!res.ok) {
            throw new Error(data?.message || `HTTP Error ${res.status}`);
        }

        if (data?.code !== 200) {
            throw new Error(data?.message || 'API Error');
        }

        return data;
    } finally {
        clearTimeout(timeoutId);
    }
}
