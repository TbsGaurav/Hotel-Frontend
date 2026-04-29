import AppLink from '@/components/common/AppLink';
import SeoDetailsCard from '@/components/common/SeoDetailsCard';

export default function CountryIntro({ countryName, seo = {} }) {
    return (
        <>
            <div className="py-2 accordion-main">
                <div className="container">
                    <div className="d-flex align-items-center small">
                        <AppLink href="/destinations" className="text-dark text-decoration-none">
                            All Countries
                        </AppLink>

                        <span className="mx-2 text-muted">•</span>

                        <AppLink href={seo?.canonicalPath || `/${countryName}`} className="fw-semibold text-decoration-none">
                            {countryName}
                        </AppLink>
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
