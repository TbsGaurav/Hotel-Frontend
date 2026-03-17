import BrandDropdown from '@/components/common/brand/Branddropdown';
import CountryHeroSection from '@/components/sections/CountryHeroSection';
import { getBrandList } from '@/lib/api/public/brandapi';
import Link from 'next/link';

export default async function BrandsPage() {
    const initialBrands = await getBrandList();

    return (
        <>
            <CountryHeroSection />

            <div className="breadcrumb-section">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/brands" className="text-dark text-decoration-none">
                            All Brands
                        </Link>
                    </div>
                </div>
            </div>

            <section className="container py-4">
                <section className="container py-5">
                    <div className="row align-items-start">
                        <div className="col-lg-6">
                            <h3 className="fw-bold mb-4">All Brand List</h3>
                        </div>
                    </div>
                </section>

                <div className="row">
                    <BrandDropdown initialBrands={initialBrands} parentId="countryAccordion" />
                </div>
            </section>
        </>
    );
}
