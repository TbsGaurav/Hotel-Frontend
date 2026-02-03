import CountryDropdownServer from '@/utils/components/country/CountryDropdownServer';
import CountryHeroSection from '@/utils/components/herosection/CountryHeroSection';

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
