'use client';

import Dropdown from '@/components/ui/Dropdown';
import CityDropdown from '@/components/common/city/CityDropdown';

export default function CountryDropdownSection({ regions, countryName, data, hotelBrands, hotelTypes }) {
    const cities = data?.countryData?.filter((i) => i.type === 'City') ?? [];

    return (
        <section className="container py-4">
            <div className="accordion" id="countryAccordion">
                <Dropdown id="regions" title="All Regions" items={regions} parentId="countryAccordion" />
                <CityDropdown countryName={countryName} initialCities={cities} parentId="countryAccordion" />
                <Dropdown id="hotelbrand" title={`Top Hotel Brands in ${countryName}`} items={hotelBrands} parentId="countryAccordion" />
                <Dropdown id="hoteltype" title={`Top Hotel Types in ${countryName}`} items={hotelTypes} parentId="countryAccordion" />
            </div>
        </section>
    );
}
