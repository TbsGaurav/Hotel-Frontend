'use client';

import { cloneCollection, getCitiesByCountryOrRegion, getCollectionList, getRegionsByCountry } from '@/lib/api/admin/collectionapi';
import { COLLECTION_STATUS_OPTIONS } from '@/lib/constants/ruleConfig';
import { ADMIN_ROUTES } from '@/lib/route';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CollectionList({ initialCollections, initialCountries }) {
    const countries = initialCountries;

    const [collections, setCollections] = useState(initialCollections);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [regionSearch, setRegionSearch] = useState('');
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // useEffect(() => {
    //     const loadCollections = async () => {
    //         try {
    //             setLoading(true);

    //             const res = await getCollectionList({
    //                 status: statusFilter,
    //                 countryId: selectedCountry || null,
    //                 regionId: selectedRegion || null,
    //                 cityId: selectedCity || null
    //             });
    //             setCollections(res?.data || []);
    //         } catch (error) {
    //             console.error('Error loading collections:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadCollections();
    // }, [statusFilter, selectedCountry, selectedRegion, selectedCity]);

    const getFinalGeoSelection = () => {
        if (selectedCity) {
            return { geoNodeType: 'City', geoNodeId: selectedCity };
        }

        if (selectedRegion) {
            return { geoNodeType: 'Region', geoNodeId: selectedRegion };
        }

        if (selectedCountry) {
            return { geoNodeType: 'Country', geoNodeId: selectedCountry };
        }

        return { geoNodeType: null, geoNodeId: null };
    };
    useEffect(() => {
        const loadCollections = async () => {
            try {
                setLoading(true);

                const { geoNodeType, geoNodeId } = getFinalGeoSelection();

                const res = await getCollectionList({
                    status: statusFilter || null,
                    geoNodeType,
                    geoNodeId,
                    pageNumber,
                    pageSize
                });

                setCollections(res?.data?.collections || []);
                setTotalRecords(Number(res?.data?.totalRecords || 0));
            } catch (error) {
                console.error('Error loading collections:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCollections();
    }, [statusFilter, selectedCountry, selectedRegion, selectedCity, pageNumber]);

    useEffect(() => {
        if (!selectedCountry) {
            setRegions([]);
            setSelectedRegion('');
            return;
        }

        getRegionsByCountry(selectedCountry)
            .then((res) => setRegions(res?.data || []))
            .catch(() => setRegions([]));
    }, [selectedCountry]);

    useEffect(() => {
        if (!selectedCountry) {
            setCities([]);
            setSelectedCity('');
            return;
        }

        getCitiesByCountryOrRegion({
            countryId: selectedCountry,
            regionId: selectedRegion || null
        })
            .then((res) => setCities(res?.data || []))
            .catch(() => setCities([]));
    }, [selectedCountry, selectedRegion]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-wrapper')) {
                setShowCountryDropdown(false);
                setShowRegionDropdown(false);
                setShowCityDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countries.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()));

    const selectedCountryObj = countries.find((c) => c.countryId === selectedCountry);

    const filteredRegions = regions.filter((r) => r.name.toLowerCase().includes(regionSearch.toLowerCase()));

    const selectedRegionObj = regions.find((r) => r.regionId === selectedRegion);

    const filteredCities = cities.filter((ct) => ct.name.toLowerCase().includes(citySearch.toLowerCase()));

    const selectedCityObj = cities.find((ct) => ct.cityId === selectedCity);

    const handleClone = async (collectionId) => {
        try {
            const res = await cloneCollection(collectionId);

            toast.success(res?.message || 'Collection cloned successfully');

            const { geoNodeType, geoNodeId } = getFinalGeoSelection();

            const updated = await getCollectionList({
                status: statusFilter || null,
                geoNodeType,
                geoNodeId
            });

            setCollections(updated?.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to clone collection');
        }
    };
    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hotel Collections</h5>
                <button className="theme-button-orange rounded-1" onClick={() => router.push(ADMIN_ROUTES.createCollection)}>
                    Create New Collection
                </button>
            </div>

            <div className="card-body">
                <div className="row g-3 mb-3">
                    {/* Status */}
                    <div className="col-12 col-md-4 col-lg-3">
                        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            {COLLECTION_STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Country */}
                    <div className="col-12 col-md-4 col-lg-3 position-relative dropdown-wrapper">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Select Country"
                            value={countrySearch}
                            onFocus={() => {
                                setShowCountryDropdown(true);

                                // If user focuses after selection, allow editing
                                if (selectedCountryObj) {
                                    setCountrySearch(selectedCountryObj.name);
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCountrySearch(value);
                                setShowCountryDropdown(true);

                                // If user edits input → clear selected country
                                if (selectedCountry) {
                                    setSelectedCountry('');
                                    setSelectedRegion('');
                                    setSelectedCity('');
                                }
                            }}
                        />

                        {showCountryDropdown && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {filteredCountries.length === 0 ? (
                                    <div className="p-2 text-muted">No countries found</div>
                                ) : (
                                    filteredCountries.map((country) => (
                                        <div
                                            key={country.countryId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedCountry(country.countryId);
                                                setCountrySearch(country.name);
                                                setShowCountryDropdown(false);

                                                setSelectedRegion('');
                                                setRegionSearch('');

                                                setSelectedCity('');
                                                setCitySearch('');
                                            }}
                                        >
                                            {country.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Region */}
                    <div className="col-12 col-md-4 col-lg-3 position-relative dropdown-wrapper">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Select Region"
                            value={regionSearch}
                            disabled={!selectedCountry}
                            onFocus={() => {
                                if (!selectedCountry) return;
                                setShowRegionDropdown(true);
                                if (selectedRegionObj) {
                                    setRegionSearch(selectedRegionObj.name);
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setRegionSearch(value);
                                setShowRegionDropdown(true);

                                if (selectedRegion) {
                                    setSelectedRegion('');
                                    setSelectedCity('');
                                }
                            }}
                        />

                        {showRegionDropdown && selectedCountry && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {filteredRegions.length === 0 ? (
                                    <div className="p-2 text-muted">No regions found</div>
                                ) : (
                                    filteredRegions.map((region) => (
                                        <div
                                            key={region.regionId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedRegion(region.regionId);
                                                setRegionSearch(region.name);
                                                setShowRegionDropdown(false);
                                                setSelectedCity('');
                                            }}
                                        >
                                            {region.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* City */}
                    <div className="col-12 col-md-4 col-lg-3 position-relative dropdown-wrapper">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Select City"
                            value={citySearch}
                            disabled={!selectedCountry}
                            onFocus={() => {
                                if (!selectedCountry) return;
                                setShowCityDropdown(true);
                                if (selectedCityObj) {
                                    setCitySearch(selectedCityObj.name);
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCitySearch(value);
                                setShowCityDropdown(true);

                                if (selectedCity) {
                                    setSelectedCity('');
                                }
                            }}
                        />

                        {showCityDropdown && selectedCountry && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {filteredCities.length === 0 ? (
                                    <div className="p-2 text-muted">No cities found</div>
                                ) : (
                                    filteredCities.map((city) => (
                                        <div
                                            key={city.cityId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedCity(city.cityId);
                                                setCitySearch(city.name);
                                                setShowCityDropdown(false);
                                            }}
                                        >
                                            {city.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLE (same UI as yours) */}
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Collection Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Hotels</th>
                            <th>Publish Date</th>
                            <th>URL</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>
                                        <div className="skeleton-name"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton-small"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton-badge"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton-number"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton-small"></div>
                                    </td>
                                    <td>
                                        <div className="skeleton-actions"></div>
                                    </td>
                                </tr>
                            ))
                        ) : // <tr>
                        //     <td colSpan="6" className="text-center py-4">
                        //         Loading collections...
                        //     </td>
                        // </tr>

                        collections.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    No collections found
                                </td>
                            </tr>
                        ) : (
                            collections.map((item) => (
                                <tr key={item.collectionId}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span className="badge bg-success">{item.status}</span>
                                    </td>
                                    <td>{item.hotelCount}</td>
                                    <td>{item.publishDate ? new Date(item.publishDate).toLocaleDateString('en-GB') : '-'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => router.push(`${ADMIN_ROUTES.collections}/${item.collectionId}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-secondary me-2"
                                            onClick={() => handleClone(item.collectionId)}
                                        >
                                            Clone
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary">Preview</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center mt-3 ">
                    <div>
                        Showing page {pageNumber} of {totalPages}
                    </div>

                    <div className="d-flex gap-2 justify-content-end mt-3">
                        <button
                            className="theme-button-orange rounded-1"
                            disabled={pageNumber === 1}
                            onClick={() => setPageNumber((prev) => prev - 1)}
                        >
                            Previous
                        </button>

                        <button
                            className="theme-button-orange rounded-1"
                            disabled={pageNumber === totalPages}
                            onClick={() => setPageNumber((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
