import { getCountriesApi } from '@/utils/api/countryapi';
import CountryDropdownClient from './CountryDropdownClient';
import Dropdown from '../ui/Dropdown';

export default async function CountryDropdownServer() {
    const countries = await getCountriesApi();
    const countryItems = countries.map((country) => ({
        label: country.name,
        href: `${country.urlName}`
    }));
    return <CountryDropdownClient countries={countries} />;
}
