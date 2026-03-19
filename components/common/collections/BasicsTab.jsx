import { getCitiesByCountryOrRegion, getDistrictsByCity, getRegionsByCountry } from '@/lib/api/admin/collectionapi';
import { ADMIN_ROUTES } from '@/lib/route';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BasicsTab({
    formData,
    setFormData,
    onNext,
    loading,
    countries,
    geoSearch,
    setGeoSearch,
    showGeoDropdown,
    setShowGeoDropdown,
    selectedGeoNode,
    setSelectedGeoNode,
    locationNames,
    isEdit
}) {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [regions, setRegions] = useState([]);
    const [regionSearch, setRegionSearch] = useState('');
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [cities, setCities] = useState([]);
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [districtSearch, setDistrictSearch] = useState('');
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

    useEffect(() => {
        if (!locationNames) return;

        if (locationNames.countryName) {
            setGeoSearch(locationNames.countryName);
        }

        if (locationNames.regionName) {
            setRegionSearch(locationNames.regionName);
        }

        if (locationNames.cityName) {
            setCitySearch(locationNames.cityName);
        }

        if (locationNames.districtName) {
            setDistrictSearch(locationNames.districtName);
        }
    }, [locationNames]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.slug?.trim()) {
            newErrors.slug = 'Slug is required';
        }

        if (!formData.template) {
            newErrors.template = 'Template is required';
        }
        if (!formData.maxHotels || formData.maxHotels < 1) {
            newErrors.maxHotels = 'Max Hotels must be at least 1';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-wrapper')) {
                setShowGeoDropdown(false);
                setShowRegionDropdown(false);
                setShowCityDropdown(false);
                setShowDistrictDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        let finalId = null;
        let finalType = null;

        if (formData.districtId) {
            finalId = formData.districtId;
            finalType = 'District';
        } else if (formData.cityId) {
            finalId = formData.cityId;
            finalType = 'City';
        } else if (formData.regionId) {
            finalId = formData.regionId;
            finalType = 'Region';
        } else if (formData.countryId) {
            finalId = formData.countryId;
            finalType = 'Country';
        }

        if (formData.geoNodeId !== finalId || formData.geoNodeType !== finalType) {
            setFormData((prev) => ({
                ...prev,
                geoNodeId: finalId,
                geoNodeType: finalType,
                sourceId: finalId
            }));
        }
    }, [formData.countryId, formData.regionId, formData.cityId, formData.districtId, formData.geoNodeType]);
    const handleCancel = () => {
        router.push(ADMIN_ROUTES.collections);
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            // ✅ ONLY generate slug in CREATE mode
            if (!isEdit) {
                const generatedSlug = generateSlug(value);

                setFormData((prev) => ({
                    ...prev,
                    name: value,
                    slug: generatedSlug
                }));
            } else {
                // ✅ EDIT MODE → only update name
                setFormData((prev) => ({
                    ...prev,
                    name: value
                }));
            }

            setErrors((prev) => ({
                ...prev,
                name: null
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));

            if (value?.trim()) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: null
                }));
            }
        }
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name === 'name') {
    //         const generatedSlug = generateSlug(value);

    //         setFormData((prev) => ({
    //             ...prev,
    //             name: value,
    //             slug: generatedSlug
    //         }));

    //         setErrors((prev) => ({
    //             ...prev,
    //             name: null,
    //             slug: generatedSlug ? null : prev.slug
    //         }));
    //     } else {
    //         setFormData((prev) => ({
    //             ...prev,
    //             [name]: value
    //         }));

    //         if (value?.trim()) {
    //             setErrors((prev) => ({
    //                 ...prev,
    //                 [name]: null
    //             }));
    //         }
    //     }
    // };
    const handleNextClick = () => {
        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        onNext();
    };

    useEffect(() => {
        if (!formData.countryId) return;

        const loadRegions = async () => {
            try {
                const res = await getRegionsByCountry(formData.countryId);
                setRegions(res?.data || []);
            } catch {
                setRegions([]);
            }
        };

        loadRegions();
    }, [formData.countryId]);

    useEffect(() => {
        if (!formData.countryId) return;

        const loadCities = async () => {
            try {
                const res = await getCitiesByCountryOrRegion({
                    countryId: formData.countryId,
                    regionId: formData.regionId
                });

                setCities(res?.data || []);
            } catch {
                setCities([]);
            }
        };

        loadCities();
    }, [formData.regionId, formData.countryId]);

    useEffect(() => {
        if (!formData.cityId) return;

        const loadDistricts = async () => {
            try {
                const res = await getDistrictsByCity(formData.cityId);
                setDistricts(res?.data || []);
            } catch {
                setDistricts([]);
            }
        };

        loadDistricts();
    }, [formData.cityId]);

    return (
        <>
            <form autoComplete="off">
                <div className="row">
                    {/* Collection Name */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Collection Name </label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter collection name"
                            autoComplete="off"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Slug */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Slug </label>
                        <input
                            type="text"
                            className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="collection-slug"
                            autoComplete="off"
                            readOnly={isEdit}
                        />
                        {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                    </div>

                    <div className="col-12 col-lg-6 mb-3 position-relative dropdown-wrapper">
                        <label className="form-label">Country</label>

                        <input
                            type="text"
                            className={`form-control ${errors.geoNodeId ? 'is-invalid' : ''}`}
                            name="countrySearchField"
                            placeholder="Search By Country"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="search"
                            value={geoSearch}
                            onFocus={() => {
                                setShowGeoDropdown(true);
                                if (selectedGeoNode) {
                                    setGeoSearch(selectedGeoNode.name);
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setGeoSearch(value);
                                setShowGeoDropdown(true);

                                setFormData((prev) => ({
                                    ...prev,
                                    countryId: null,
                                    regionId: null,
                                    cityId: null,
                                    districtId: null,
                                    geoNodeId: null
                                }));
                            }}
                        />

                        {errors.geoNodeId && <div className="invalid-feedback d-block">{errors.geoNodeId}</div>}

                        {showGeoDropdown && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {countries
                                    .filter((c) => c.name.toLowerCase().includes(geoSearch.toLowerCase()))
                                    .map((node) => (
                                        <div
                                            key={node.countryId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedGeoNode(node);
                                                setGeoSearch(node.name);
                                                setShowGeoDropdown(false);
                                                setRegionSearch('');
                                                setCitySearch('');
                                                setDistrictSearch('');

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    countryId: node.countryId,
                                                    geoNodeName: node.name,
                                                    regionId: null,
                                                    cityId: null,
                                                    districtId: null
                                                }));
                                            }}
                                        >
                                            {node.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-lg-6 mb-3 position-relative dropdown-wrapper">
                        <label className="form-label">Region</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Region"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="search"
                            name="regionSearchField"
                            value={regionSearch}
                            disabled={!formData.countryId}
                            onFocus={() => setShowRegionDropdown(true)}
                            onChange={async (e) => {
                                const value = e.target.value;
                                setRegionSearch(value);
                                setShowRegionDropdown(true);

                                try {
                                    const res = await getRegionsByCountry(formData.countryId, value);
                                    setRegions(res?.data || []);
                                } catch {
                                    setRegions([]);
                                }
                            }}
                        />

                        {showRegionDropdown && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {regions
                                    .filter((r) => r.name.toLowerCase().includes(regionSearch.toLowerCase()))
                                    .map((region) => (
                                        <div
                                            key={region.regionId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setRegionSearch(region.name);
                                                setShowRegionDropdown(false);
                                                setCitySearch('');
                                                setDistrictSearch('');

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    regionId: region.regionId,
                                                    geoNodeName: region.name,
                                                    cityId: null,
                                                    districtId: null
                                                }));
                                            }}
                                        >
                                            {region.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-lg-6 mb-3 position-relative dropdown-wrapper">
                        <label className="form-label">City</label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search City"
                            value={citySearch}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="search"
                            name="citySearchField"
                            disabled={!formData.regionId}
                            onFocus={() => setShowCityDropdown(true)}
                            onChange={async (e) => {
                                const value = e.target.value;
                                setCitySearch(value);
                                setShowCityDropdown(true);

                                try {
                                    const res = await getCitiesByCountryOrRegion({
                                        countryId: formData.countryId,
                                        regionId: formData.regionId,
                                        searchTerm: value
                                    });

                                    setCities(res?.data || []);
                                } catch {
                                    setCities([]);
                                }
                            }}
                        />

                        {showCityDropdown && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {cities
                                    .filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase()))
                                    .map((city) => (
                                        <div
                                            key={city.cityId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setCitySearch(city.name);
                                                setShowCityDropdown(false);
                                                setDistrictSearch('');
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    cityId: city.cityId,
                                                    geoNodeName: city.name,
                                                    districtId: null
                                                }));
                                            }}
                                        >
                                            {city.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-lg-6 mb-3 position-relative dropdown-wrapper">
                        <label className="form-label">District</label>

                        <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            inputMode="search"
                            placeholder="Search District"
                            name="districtSearchField"
                            value={districtSearch}
                            disabled={!formData.cityId}
                            onFocus={() => setShowDistrictDropdown(true)}
                            onChange={async (e) => {
                                const value = e.target.value;
                                setDistrictSearch(value);
                                setShowDistrictDropdown(true);

                                try {
                                    const res = await getDistrictsByCity(formData.cityId, value);
                                    setDistricts(res?.data || []);
                                } catch (err) {
                                    setDistricts([]);
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    districtId: null
                                }));
                            }}
                        />

                        {showDistrictDropdown && (
                            <div
                                className="border bg-white position-absolute w-100 mt-1"
                                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}
                            >
                                {districts
                                    .filter((d) => d.name.toLowerCase().includes(districtSearch.toLowerCase()))
                                    .map((district) => (
                                        <div
                                            key={district.districtId}
                                            className="p-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setDistrictSearch(district.name);
                                                setShowDistrictDropdown(false);

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    districtId: district.districtId,
                                                    geoNodeName: district.name
                                                }));
                                            }}
                                        >
                                            {district.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Template */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Template</label>

                        <select
                            className={`form-select ${errors.template ? 'is-invalid' : ''}`}
                            name="template"
                            value={formData.template}
                            onChange={handleChange}
                            autoComplete="off"
                        >
                            <option value="">Select Template</option>
                            <option value="Family">Family</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Business">Business</option>
                            <option value="Budget">Budget</option>
                        </select>

                        {errors.template && <div className="invalid-feedback d-block">{errors.template}</div>}
                    </div>

                    {/* Expiry Date */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Expiry Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>

                    {/* Max Hotels */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Max Hotels</label>
                        <input
                            type="number"
                            min="1"
                            className={`form-control ${errors.maxHotels ? 'is-invalid' : ''}`}
                            name="maxHotels"
                            value={formData.maxHotels}
                            onChange={handleChange}
                            placeholder="Enter maximum number of hotels"
                            autoComplete="off"
                        />
                        {errors.maxHotels && <div className="invalid-feedback">{errors.maxHotels}</div>}
                    </div>

                    {/* Status */}
                    <div className="col-12 col-lg-6 mb-3">
                        <label className="form-label">Status</label>
                        <div className="form-control bg-light">{formData.status}</div>
                    </div>
                </div>

                <div className="d-flex justify-content-between">
                    <button className="btn btn-outline-secondary" type="button" onClick={handleCancel}>
                        Cancel
                    </button>

                    <button
                        className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                        onClick={handleNextClick}
                        type="button"
                        disabled={loading}
                        style={{ minWidth: '100px' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            </>
                        ) : (
                            'Next'
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}
