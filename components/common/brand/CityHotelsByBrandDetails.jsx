import Link from 'next/link';
import HeroSection from '@/components/sections/HeroSection';
import Dropdown from '@/components/ui/Dropdown';
import { getSidebarData } from '@/lib/api/sidebarapi';
import { resolveCityContextFromSlug, toSlug } from '@/lib/api/public/cityCategoryapi';
import { getHotelList } from '@/lib/api/public/hotelapi';

function formatCityName(slug = '') {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default async function CityHotelsByBrandDetails({ citySlug = '' }) {
    const normalizedCitySlug = toSlug(citySlug);
    const fallbackCityName = formatCityName(normalizedCitySlug);

    const context = await resolveCityContextFromSlug(normalizedCitySlug);
    const cityId = context?.cityId ?? null;
    const cityName = String(context?.cityName || fallbackCityName).trim() || fallbackCityName;

    const sidebarData = cityId ? await getSidebarData({ cityId }) : {};
    const brands = Array.isArray(sidebarData?.brands) ? sidebarData.brands : [];

    let countryName = '';
    let countryUrl = '';
    let regionName = '';
    let regionUrl = '';

    const pageResponse = await getHotelList(normalizedCitySlug, { pageNumber: 1, pageSize: 1 });
    const firstHotel = Array.isArray(pageResponse?.hotels) ? pageResponse.hotels[0] : null;

    countryName = firstHotel?.countryName || firstHotel?.country || '';
    countryUrl = firstHotel?.countryUrlName || firstHotel?.countryUrl || '';
    regionName = firstHotel?.regionName || firstHotel?.region || '';
    regionUrl = firstHotel?.regionUrlName || firstHotel?.regionUrl || '';

    const items = brands.map((brand) => {
        const brandName = String(brand?.brandName || '').trim();
        const brandUrl = String(brand?.brandUrl || '').trim();
        const href = brandUrl
            ? brandUrl.startsWith('/')
                ? brandUrl
                : `/${brandUrl}`
            : null;

        return {
            label: brandName,
            count: Number.isFinite(Number(brand?.hotelCount)) ? Number(brand.hotelCount) : null,
            href
        };
    });

    return (
        <>
            <HeroSection variant="common" />

            <div className="py-3 mx-2">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/destinations" className="text-dark text-decoration-none">
                                    All Countries
                                </Link>
                            </li>

                            {countryName && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <Link href={`/${countryUrl}`} className="text-dark text-decoration-none">
                                        {countryName}
                                    </Link>
                                </li>
                            )}

                            {regionName && (
                                <li className="breadcrumb-item small-para-14-px">
                                    <Link href={`${regionUrl}`} className="text-dark text-decoration-none">
                                        {regionName}
                                    </Link>
                                </li>
                            )}

                            <li className="breadcrumb-item small-para-14-px">
                                <Link href={`/${normalizedCitySlug}`} className="text-dark text-decoration-none">
                                    {cityName}
                                </Link>
                            </li>

                            <li className="breadcrumb-item small-para-14-px active">
                                <Link
                                    href={`/${normalizedCitySlug}/${normalizedCitySlug}-hotels-by-brand.htm`}
                                    className="text-decoration-none"
                                >
                                    {`${cityName} Hotels by Brand`}
                                </Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <section className="py-4 p-1">
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-lg-6">
                            <h3 className="fw-bold mb-4">{cityName}</h3>
                        </div>
                    </div>

                    <Dropdown
                        id={`city-brands-${normalizedCitySlug}`}
                        title={cityName ? `Top Hotel Brands in ${cityName}` : 'Top Hotel Brands'}
                        items={items}
                        parentId="cityBrandsAccordion"
                        defaultOpen={true}
                    />
                </div>
            </section>
        </>
    );
}
