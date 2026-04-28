'use client';

import Dropdown from '@/components/ui/Dropdown';
import CityDropdown from '@/components/common/city/CityDropdown';

export default function CountryDropdownSection({ regions, countryName, countrySlug = '', data, hotelBrands, hotelTypes }) {
    const cities = data?.countryData?.filter((i) => i.type === 0) ?? [];
    return (
        <>
            <div className="accordion" id="countryAccordion">
                <Dropdown id="regions" items={regions} parentId="countryAccordion" title="All Regions" />

                <CityDropdown countryName={countryName} countrySlug={countrySlug} initialCities={cities} parentId="countryAccordion" />

                <Dropdown id="hotelbrand" items={hotelBrands} parentId="countryAccordion" title={`Top Hotel Brands in ${countryName}`} />
                <Dropdown id="hoteltype" items={hotelTypes} parentId="countryAccordion" title={`Top Hotel Types in ${countryName}`} />
            </div>
        </>
        // <section className="container py-4">
        //     <div className="accordion" id="countryAccordion">
        //         <Dropdown id="regions" items={regions} parentId="countryAccordion" title="All Regions" />

        //         <CityDropdown countryName={countryName} initialCities={cities} parentId="countryAccordion" />

        //         <Dropdown id="hotelbrand" items={hotelBrands} parentId="countryAccordion" title={`Top Hotel Brands in ${countryName}`} />
        //         <Dropdown id="hoteltype" items={hotelTypes} parentId="countryAccordion" title={`Top Hotel Types in ${countryName}`} />
        //     </div>
        // </section>
    );
}
