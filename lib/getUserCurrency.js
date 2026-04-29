import { countryToCurrency } from './utils';

export async function getUserCurrency() {
    if (typeof window === 'undefined') return 'AUD';

    try {
        const override = window.localStorage.getItem('currencyOverride');
        if (override) return override;

        const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        const text = await res.text();

        const match = text.match(/loc=(\w+)/);

        if (match) {
            const country = match[1];
            return countryToCurrency(country);
        }
    } catch (err) {
        console.error('Currency detection failed', err);
    }

    return 'AUD';
}
