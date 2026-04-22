import BrandDropdown from '@/components/common/brand/Branddropdown';
import HeroSection from '@/components/sections/HeroSection';
import { getBrandList } from '@/lib/api/public/brandapi';
import Link from 'next/link';

export default async function BrandsPage() {
    const initialBrands = await getBrandList();

    return (
        <>
            <HeroSection variant="common" />

            <div className="py-3 mx-2">
                <div className="container">
                    <nav aria-label="breadcrumb" className="mb-0">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small-para-14-px">
                                <Link href="/brands" className="text-dark text-decoration-none">
                                    All Brands
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
                            <h3 className="fw-bold mb-4 accordion-main">All Brand List</h3>
                        </div>
                    </div>

                    <BrandDropdown initialBrands={initialBrands} parentId="countryAccordion" />
                </div>
            </section>
        </>
    );
}
