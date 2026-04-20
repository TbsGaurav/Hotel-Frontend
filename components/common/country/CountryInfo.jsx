import Link from 'next/link';
import SeoDetailsCard from '@/components/common/SeoDetailsCard';

export default function CountryIntro({ countryName, seo = {} }) {
    return (
        <>
            <div className="py-2 accordion-main">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <Link href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </Link>

                        <span className="mx-2 text-muted">•</span>

                        <Link href={seo?.canonicalPath || `/${countryName}`} className="fw-semibold text-decoration-none">
                            {countryName}
                        </Link>
                    </div>
                </div>
            </div>
            <section className="py-4 p-2">
                <div className="container">
                    <SeoDetailsCard
                        metaTitle={seo?.metaTitle || ` ${countryName}`}
                        metaDescription={seo?.metaDescription || ''}
                        canonicalPath={seo?.canonicalPath || `/${countryName}`}
                    />
                </div>
            </section>
        </>
    );
}
