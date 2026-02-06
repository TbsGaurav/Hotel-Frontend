import CountryDropdownServer from '@/components/common/country/CountryDropdownServer';
import CountryHeroSection from '@/components/sections/CountryHeroSection';

export default async function CountryPage({ params }) {
    return (
        <>
            <CountryHeroSection />
            <section className="container py-3">
                <CountryDropdownServer />
            </section>
        </>
    );
}
