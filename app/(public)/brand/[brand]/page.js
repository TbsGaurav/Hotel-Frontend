import CountryHeroSection from '@/components/sections/CountryHeroSection';
import Dropdown from '@/components/ui/Dropdown';
import { getBrandCountries } from '@/lib/api/public/countryapi';
import Link from 'next/link';

export default async function BrandPage({ params }) {
    const { brand } = await params;
    const decodedBrand = decodeURIComponent(brand);

    const brandData = await getBrandCountries(decodedBrand);

    const brandName = formatBrandName(decodedBrand);

    function formatBrandName(slug) {
        const smallWords = ['and', 'of', 'the', 'in', 'at', 'by', 'for'];

        return slug
            .replace(/-/g, ' ')
            .split(' ')
            .map((word, index) => {
                if (smallWords.includes(word) && index !== 0) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }
    const countryMap = {};

    brandData.forEach((item) => {
        if (!countryMap[item.countryName]) {
            countryMap[item.countryName] = {
                count: item.hotelCount
            };
        }
    });

    const items = Object.entries(countryMap).map(([country, data]) => ({
        label: `${brandName} ${country}`,
        count: data.count
        // href: `/${brand}/${country.toLowerCase().replace(/\s+/g, '-')}`
    }));

    return (
        <>
            <CountryHeroSection />

            <div className="breadcrumb-section">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/brands" className="text-dark text-decoration-none">
                            All Brands
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <span className="text-primary">{brandName}</span>
                    </div>
                </div>
            </div>
            <section className="container py-4">
                <section className="container py-5">
                    <div className="row align-items-start">
                        <div className="col-lg-6">
                            <h3 className="fw-bold mb-4">{brandName}</h3>
                        </div>
                    </div>
                </section>
                <div className="row">
                    <Dropdown id="brand-countries" title={`${brandName} `} items={items} parentId="brandAccordion" defaultOpen={true} />
                </div>
            </section>
        </>
    );
}
