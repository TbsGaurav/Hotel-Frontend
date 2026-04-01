import CountryHeroSection from '@/components/sections/CountryHeroSection';
import ListingSidebar from '@/components/common/sidebar/ListingSidebar';
import { formatCountryName } from '@/lib/utils';
import Link from 'next/link';
import RegionCard from '@/components/ui/RegionCard';
import { getCitiesByRegion } from '@/lib/api/public/countryapi';
import { getSidebarData } from '@/lib/api/sidebarapi';
import { buildSidebarSections } from '@/lib/mappers/sidebarMapper';

export default async function RegionDetails({ params, regionId: regionIdFromRoute }) {
    const resolvedParams = await params;

    const slug = resolvedParams?.slug || [];
    const countrySlug = slug[0];
    const regionSlug = slug[1];
    const countryName = formatCountryName(countrySlug);
    const regionName = formatCountryName(regionSlug);
    const response = await getCitiesByRegion(countrySlug, regionSlug);
    const cities = response?.data || [];
    const regionId = regionIdFromRoute || response?.entityID || response?.data?.entityID || cities?.regionId || cities?.regionID || cities?.RegionID || null;
    const description = cities.regionContent;
    const sidebarData = regionId ? await getSidebarData({ cityId: 0, regionId }) : {};
    const sidebarSections = buildSidebarSections(sidebarData, { contextName: regionName });
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
                    <hr className="border-secondary opacity-10 my-5" />
                    <div>
                        <h2 className="text-center fw-bold mb-4">Featured Properties in {regionName}</h2>
                    </div>
                    <div className="col-lg-3">
                        <div className="position-sticky" style={{ top: '16px' }}>
                            <ListingSidebar title="Filters" sections={sidebarSections} />
                        </div>
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
