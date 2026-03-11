import CountryHeroSection from '@/components/sections/CountryHeroSection';
import RegionFilterSidebar from './RegionFilterSidebar';
import { formatCountryName } from '@/lib/utils';
import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';
import RegionCard from '@/components/ui/RegionCard';
import { getCitiesByRegion } from '@/lib/api/public/countryapi';

export default async function RegionDetails({ params }) {
    const resolvedParams = await params;

    const slug = resolvedParams?.slug || [];
    const countrySlug = slug[0];
    const regionSlug = slug[1];

    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);
    const response = await getCitiesByRegion(countrySlug, regionSlug);
    const cities = response?.data || [];
    const cityItems = cities.map((city) => ({
        label: city.cityName,
        count: city.hotelCount,
        href: `/${countrySlug}/${regionSlug}/${city.cityName.toLowerCase().replace(/\s+/g, '-')}`
    }));
    return (
        <>
            <CountryHeroSection />

            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                            {countryName}
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <span className="text-primary">{regionName}</span>
                    </div>
                </div>
            </div>

            <section className="container py-4">
                <div className="row">
                    <Dropdown id="regions" parentId="countryAccordion" title="Cities" items={cityItems} defaultOpen />{' '}
                    <hr className="border-secondary opacity-10 my-5" />
                    <div>
                        <h2 className="text-center fw-bold mb-4">Featured Properties in {regionName}</h2>
                    </div>
                    <div className="col-lg-3">
                        <RegionFilterSidebar />
                    </div>
                    <div className="col-lg-9">
                        <RegionCard />
                        <RegionCard />
                    </div>
                </div>
            </section>
        </>
    );
}
