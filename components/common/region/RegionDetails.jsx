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
    const description = cities.regionContent;
    const cityItems = cities.map((city) => ({
        label: city.cityName,
        count: city.hotelCount,
        href: `/${city.cityName.toLowerCase().replace(/\s+/g, '-')}`
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
                <section className="container py-5">
                    <div className="row align-items-start">
                        {/* LEFT CONTENT */}
                        <div className="col-lg-6">
                            <h3 className="fw-bold mb-4">{regionName}</h3>

                            <div className="region-description" dangerouslySetInnerHTML={{ __html: description || '' }}></div>
                        </div>

                        {/* RIGHT IMAGE */}
                        {/* <div className="col-lg-6 text-end">
                            <img src="/image/Delight your senses.webp" alt={regionName} className="img-fluid rounded-4" />
                        </div> */}
                    </div>
                </section>
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
