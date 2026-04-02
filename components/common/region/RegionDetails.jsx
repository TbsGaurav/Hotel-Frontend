import Link from 'next/link';
import { cookies } from 'next/headers';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import RegionFilterSidebar from './RegionFilterSidebar';
import Dropdown from '@/components/ui/Dropdown';
import { getCitiesByRegion } from '@/lib/api/public/countryapi';
import { getRegionHotels } from '@/lib/api/public/regionapi';
import CityHotelList from '../city/CityHotelList';
import { formatCountryName } from '@/lib/utils';

function toSlug(value = '') {
    return value.toLowerCase().replace(/\s+/g, '-');
}

function getRegionPageCookieName(countrySlug = '', regionSlug = '') {
    return `region_page_${toSlug(countrySlug)}_${toSlug(regionSlug)}`;
}

function parsePageNumber(value) {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

const pageSize = 10;

export default async function RegionDetails({ params }) {
    const { slug } = await params;

    const countrySlug = slug?.[0] || '';
    const regionSlug = slug?.[1] || '';
    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);

    const urlName = `/${countrySlug}/${regionSlug}`;

    // Sidebar Cities
    const response = await getCitiesByRegion(countrySlug, regionSlug);
    const regionData = response?.data;
    const cities = Array.isArray(regionData) ? regionData : regionData?.cities || regionData?.regionData || [];
    const description = regionData?.regionContent || regionData?.content || cities?.[0]?.regionContent || '';

    const cityItems = cities.map((city) => ({
        label: city.cityName,
        count: city.hotelCount,
        href: `/${String(city.cityName || '')
            .toLowerCase()
            .replace(/\s+/g, '-')}`
    }));

    const cookieStore = await cookies();
    const pageCookieName = getRegionPageCookieName(countrySlug, regionSlug);
    const currentPage = parsePageNumber(cookieStore.get(pageCookieName)?.value);

    let hotels = [];
    let totalCount = 0;
    try {
        for (let pageNumber = 1; pageNumber <= currentPage; pageNumber++) {
            const res = await getRegionHotels(urlName, pageNumber, pageSize);

            const nextHotels = res?.hotelData || [];

            if (!nextHotels.length) break;

            hotels = hotels.concat(nextHotels);
            totalCount = res?.totalCount || 0;
        }
    } catch (err) {
        console.error('Region hotels error:', err);
    }

    return (
        <>
            <CountryHeroSection />

            {/* Breadcrumb */}
            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>
                        <span className="mx-2 text-muted">&bull;</span>
                        <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                            {countryName}
                        </Link>
                        <span className="mx-2 text-muted">&bull;</span>
                        <span className="text-primary">{regionName}</span>
                    </div>
                </div>
            </div>

            <section className="container py-4">
                <div className="row">
                    <Dropdown id="regions" parentId="countryAccordion" title="Cities" items={cityItems} defaultOpen />

                    <hr className="my-5" />

                    <div className="col-lg-3">
                        <RegionFilterSidebar />
                    </div>

                    <div className="col-lg-9">
                        <h2 className="text-center fw-bold mb-4">Featured Properties in {regionName}</h2>
                        <CityHotelList
                            hotels={hotels}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            pageCookieName={pageCookieName}
                            content={description}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
