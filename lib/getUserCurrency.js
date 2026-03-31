import { countryToCurrency } from './utils';

export async function getUserCurrency() {
    if (typeof window === 'undefined') return 'USD';

    let currency = localStorage.getItem('currency');

    if (currency) return currency;

    try {
        const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        const text = await res.text();

        const match = text.match(/loc=(\w+)/);

        if (match) {
            const country = match[1];
            currency = countryToCurrency(country);

            localStorage.setItem('currency', currency);

            return currency;
        }
    } catch (err) {
        console.error('Currency detection failed', err);
    }

    return 'USD';
}
