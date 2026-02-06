import { getCountryByUrlName } from '@/lib/api/countryapi';
import CountryDropdownSection from '@/components/common/country/CountryDropdownSection';
import CountryIntro from '@/components/common/country/CountryInfo';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { formatCountryName } from '@/lib/utils';

export default async function CountryPage({ params }) {
    const { country } = await params;
    const data = await getCountryByUrlName(country);
    const countryName = formatCountryName(country);
    const descriptionHtml = data.countryContent;

    const regions = data.countryData
        .filter((item) => item.type === 'Region')
        .map((item) => ({
            label: item.itemName,
            href: item.urlName ? `/${countryName.toLocaleLowerCase()}/${item.urlName}` : null
        }));

    const cities = data.countryData
        .filter((item) => item.type === 'City')
        .map((item) => ({
            label: item.itemName,
            href: item.urlName ? `/${item.urlName}` : null
        }));
    const hotelBrands = data.hotelData
        .filter((item) => item.type === 'HotelBrand')
        .map((item) => ({
            label: item.itemName,
            count: item.hotelCount,
            href: item.urlName ? `/${countryName}/${item.urlName}` : null
        }));
    const hotelTypes = data?.hotelData
        .filter((item) => item.type === 'HotelType')
        .map((item) => ({
            label: item.itemName,
            count: item.hotelCount,
            href: item.urlName ? `/hoteltype/${item.urlName}` : null
        }));
    return (
        <>
            <CountryHeroSection />
            <CountryIntro countryName={countryName} descriptionHtml={descriptionHtml} heroImage="/image/country.webp" />
            <section className="container py-4">
                <CountryDropdownSection
                    regions={regions}
                    cities={cities}
                    hotelBrands={hotelBrands}
                    hotelTypes={hotelTypes}
                    countryName={countryName}
                    data={data}
                />
            </section>
        </>
    );
}
