import CountryDropdownServer from '@/components/common/country/CountryDropdownServer';
import HeroSection from '@/components/sections/HeroSection';

export default async function DestinationsPage() {
    return (
        <>
            <HeroSection variant="common" />
            <section className="container py-3">
                <CountryDropdownServer />
            </section>
        </>
    );
}

