const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchClient(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!res.ok) {
        // Optional: central error handling
        const errorText = await res.text();
        throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    return res.json();
}
