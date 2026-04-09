'use client';

import CountryHeroSection from '@/components/sections/CountryHeroSection';

export default function ListingLayout({
    breadcrumb = null,
    header = null,
    topContent = null,
    sidebar = null,
    main = null,
    showHero = true,
    sectionClassName = 'container py-5',
    rowClassName = 'row g-4 align-items-start',
    sidebarClassName = 'col-lg-3 order-2 order-lg-1',
    mainClassName = 'col-lg-9 order-1 order-lg-2'
}) {
    return (
        <>
            {showHero ? <CountryHeroSection /> : null}

            {breadcrumb ? <div className="py-2">{breadcrumb}</div> : null}

            <section className={sectionClassName}>
                {header}
                {topContent}

                <div className={rowClassName}>
                    <div className={sidebarClassName}>{sidebar}</div>
                    <div className={mainClassName}>{main}</div>
                </div>
            </section>
        </>
    );
}
