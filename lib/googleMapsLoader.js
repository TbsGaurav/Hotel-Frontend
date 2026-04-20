let cachedPromise = null;

function buildGoogleMapsScriptUrl({ apiKey, libraries = [] } = {}) {
    const params = new URLSearchParams();
    params.set('key', apiKey);
    if (libraries.length) params.set('libraries', libraries.join(','));
    return `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
}

export function loadGoogleMaps({ apiKey, libraries = [] } = {}) {
    if (typeof window === 'undefined') return Promise.resolve(null);
    if (window.google?.maps) return Promise.resolve(window.google.maps);

    if (cachedPromise) return cachedPromise;

    cachedPromise = new Promise((resolve, reject) => {
        if (!apiKey) {
            reject(new Error('Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.'));
            return;
        }

        const existing = document.querySelector('script[data-google-maps="true"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(window.google?.maps || null), { once: true });
            existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = buildGoogleMapsScriptUrl({ apiKey, libraries });
        script.async = true;
        script.defer = true;
        script.setAttribute('data-google-maps', 'true');

        script.onload = () => resolve(window.google?.maps || null);
        script.onerror = () => reject(new Error('Failed to load Google Maps script.'));

        document.head.appendChild(script);
    });

    return cachedPromise;
}
