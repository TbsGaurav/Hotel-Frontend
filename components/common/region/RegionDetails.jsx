import CountryHeroSection from '@/components/sections/CountryHeroSection';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { formatCountryName } from '@/lib/utils';
import Link from 'next/link';
import Dropdown from '@/components/ui/Dropdown';
import RegionCard from '@/components/ui/RegionCard';
import { getCitiesByRegion } from '@/lib/api/public/countryapi';

function normalizeItems(items) {
    return Array.isArray(items) ? items : [];
}

export default async function RegionDetails({ params }) {
    const resolvedParams = await params;

    const slug = resolvedParams?.slug || [];
    const countrySlug = slug[0];
    const regionSlug = slug[1];
    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);

    const response = await getCitiesByRegion(countrySlug, regionSlug);
    const payload = response?.data || {};
    const cities = Array.isArray(payload) ? payload : payload?.cities || [];
    const description = payload?.regionContent || '';
    const sidebarData = payload?.sidebar || payload?.filters || payload?.filterGroups || {};

    const cityItems = cities.map((city) => ({
        label: city.cityName,
        count: city.hotelCount,
        href: `/${city.cityName.toLowerCase().replace(/\s+/g, '-')}`
    }));

    const sidebarSections = [
        {
            title: 'Rating',
            items: normalizeItems(sidebarData?.rating || sidebarData?.ratings || sidebarData?.ratingItems),
            maxVisible: 6
        },
        {
            title: 'Property Type',
            items: normalizeItems(sidebarData?.propertyType || sidebarData?.propertyTypes || sidebarData?.propertyTypeItems),
            maxVisible: 5
        },
        {
            title: 'Facilities',
            items: normalizeItems(sidebarData?.facilities || sidebarData?.facilityItems),
            maxVisible: 5
        }
    ];

    return (
        <>
            <CountryHeroSection />

            <div className="py-2">
                <div className="container">
                    <div className="d-flex align-items-center small flex-wrap gap-1">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>
                        <span className="mx-1 text-muted">&rsaquo;</span>
                        <Link href={`/${countrySlug}`} className="text-dark text-decoration-none">
                            {countryName}
                        </Link>
                        <span className="mx-1 text-muted">&rsaquo;</span>
                        <span className="text-primary">{regionName}</span>
                    </div>
                </div>
            </div>

            <section className="container py-4">
                <div className="bg-white border rounded-1 p-4 mb-4">
                    <h2 className="mb-0" style={{ fontWeight: 700 }}>
                        {regionName}
                    </h2>
                </div>

                {description && (
                    <div className="bg-white border rounded-1 p-4 mb-4 text-muted" dangerouslySetInnerHTML={{ __html: description }} />
                )}

                <div className="bg-white border rounded-1 p-3 mb-4">
                    <Dropdown id="regions" parentId="countryAccordion" title="Cities" items={cityItems} defaultOpen />
                </div>

                <hr className="border-secondary opacity-10 my-5" />

                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-0">Featured Properties in {regionName}</h2>
                </div>

                <div className="row g-4 align-items-start">
                    <div className="col-lg-3">
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="d-flex flex-column gap-4">
                            <RegionCard />
                            <RegionCard />
                            <RegionCard />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}