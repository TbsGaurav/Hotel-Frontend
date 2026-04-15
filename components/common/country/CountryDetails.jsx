import { getCountryByUrlName } from '@/lib/api/public/countryapi';
import CountryDropdownSection from '@/components/common/country/CountryDropdownSection';
import CountryIntro from '@/components/common/country/CountryInfo';
import HeroSection from '@/components/sections/HeroSection';
import { formatCountryName } from '@/lib/utils';
import CountryHotelCarousel from '@/components/common/country/CountryHotelCarousel';
import { notFound } from 'next/navigation';
import { buildCountrySeo } from '@/lib/seo';

export default async function CountryDetails({ country, resolvedSlugData = {} }) {
    const data = await getCountryByUrlName(country);
    const countryName = formatCountryName(country);
    const seo = buildCountrySeo({
        countrySlug: country,
        resolvedSlugData: {
            ...data,
            ...resolvedSlugData
        }
    });

    if (!data) {
        return notFound();
    }

    const descriptionHtml = data.countryContent;

    const ITEM_TYPE = {
        City: 0,
        Region: 1,
        HotelBrand: 2,
        HotelType: 3
    };

    const regions = data.countryData
        .filter((item) => item.type === ITEM_TYPE.Region)
        .map((item) => ({
            label: item.itemName,
            href: item.urlName
        }));

    const cities = data.countryData
        .filter((item) => item.type === ITEM_TYPE.City)
        .map((item) => ({
            label: item.itemName,
            href: item.urlName
        }));

    const hotelBrands = data.hotelData
        .filter((item) => item.type === ITEM_TYPE.HotelBrand)
        .map((item) => ({
            label: item.itemName,
            count: item.hotelCount,
            href: `/${country}${item.urlName}`
        }));

    const hotelTypes = data?.hotelData
        ?.filter((item) => item.type === ITEM_TYPE.HotelType)
        .map((item) => ({
            label: item.itemName,
            count: item.hotelCount,
            href: item.urlName
        }));

    return (
        <>
            <HeroSection variant="common" />
            <CountryIntro countryName={countryName}  heroImage="/image/country.webp" seo={seo} />

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

            <CountryHotelCarousel hotels={data.featuredHotels} />
        </>
    );
}
