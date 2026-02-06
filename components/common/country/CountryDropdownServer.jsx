import { getCountriesApi } from '@/lib/api/countryapi';
import CountryDropdownClient from './CountryDropdownClient';

export default async function CountryDropdownServer() {
    const countries = await getCountriesApi();

    return <CountryDropdownClient countries={countries} />;
}
