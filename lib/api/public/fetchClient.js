import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchClient(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options,
        cache: 'no-store'
    });

    const text = await res.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`Invalid JSON response (HTTP ${res.status})`);
    }

    // ✅ If backend says not found → show Next.js 404 page
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
}

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function fetchClient(endpoint, options = {}) {
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             ...(options.headers || {})
//         },
//         ...options,
//         cache: 'no-store'
//     });

//     const text = await res.text();

//     let data = null;

//     try {
//         data = text ? JSON.parse(text) : null;
//     } catch {
//         throw new Error(`Invalid JSON response (HTTP ${res.status})`);
//     }

//     // return response instead of triggering notFound
//     if (res.status === 404) {
//         return {
//             status: 404,
//             data: null
//         };
//     }

//     if (!res.ok) {
//         throw new Error(data?.message || `HTTP Error ${res.status}`);
//     }

//     if (data?.code !== 200) {
//         throw new Error(data?.message || 'API Error');
//     }

//     return {
//         status: 200,
//         data
//     };
// }
