const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchClient(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });
    const text = await res.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        throw new Error(`Invalid JSON response (HTTP ${res.status})`);
    }

    if (!res.ok) {
        throw new Error(data?.message || `HTTP Error ${res.status}`);
    }

    if (data?.code !== 200) {
        throw new Error(data?.message || 'API Error');
    }

    return data;
}
// export async function fetchClient(endpoint, options = {}) {
//     if (!BASE_URL) {
//         throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
//     }

//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             ...(options.headers || {})
//         },
//         ...options
//     });

//     const data = await res.json().catch(() => null);

//     if (!res.ok) {
//         throw {
//             status: res.status,
//             data
//         };
//     }

//     return data;
// }

// export async function fetchClient(endpoint, options = {}) {
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//         headers: {
//             'Content-Type': 'application/json',
//             ...(options.headers || {})
//         },
//         ...options
//     });
//     if (!res.ok) {
//         // Optional: central error handling
//         const errorText = await res.text();
//         throw new Error(`API Error ${res.status}: ${errorText}`);
//     }

//     return res.json();
// }
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export async function fetchClient(endpoint, options = {}) {
//     const { headers = {}, auth = false, ...rest } = options;

//     const finalHeaders = {
//         'Content-Type': 'application/json',
//         ...headers
//     };

//     if (auth) {
//         const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//         if (token) {
//             finalHeaders.Authorization = `Bearer ${token}`;
//         }
//     }

//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//         headers: finalHeaders,
//         ...rest
//     });

//     if (res.status === 401) {

//     }

//     if (!res.ok) {
//         const errorBody = await res.json().catch(() => ({}));
//         throw {
//             status: res.status,
//             message: errorBody.message || 'Something went wrong'
//         };
//     }

//     return res.json();
// }
