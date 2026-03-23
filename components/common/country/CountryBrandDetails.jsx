import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getBrandHotels } from '@/lib/api/public/brandapi';
import CountryBrandHotelList from '../hotel/CountryBrandHotelList';

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function formatBrand(text) {
    return text.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

export default async function CountryBrandDetails({ params }) {
    const { slug } = await params;

    const country = capitalize(slug[0]);
    const brand = decodeURIComponent(slug[1]);

    const fullSlug = `/${country}/${brand}`;

    const hotels = await getBrandHotels(fullSlug);
    const formattedBrand = formatBrand(brand);

    return (
        <>
            <CountryHeroSection />

            <section className="container py-4">
                <h3 className="mb-4 text-capitalize">
                    {formattedBrand}{' '}
                    {country}
                </h3>
                <CountryBrandHotelList hotels={hotels}    />
            </section>
        </>
    );
}
