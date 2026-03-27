import { getCitiesByCountryOrRegion, getDistrictsByCity, getRegionsByCountry } from '@/lib/api/admin/collectionapi';
import { ADMIN_ROUTES } from '@/lib/route';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BasicsTab({
    formData,
    setFormData,
    selectedCities,
    setSelectedCities,
    slugCityId,
    setSlugCityId,
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

    const slugifyText = (value = '') =>
        String(value)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    useEffect(() => {
        if (!locationNames) return;

        const timer = setTimeout(() => {
            if (locationNames.countryName) {
                setGeoSearch(locationNames.countryName);
            }

            if (locationNames.regionName) {
                setRegionSearch(locationNames.regionName);
            }

            if (locationNames.districtName) {
                setDistrictSearch(locationNames.districtName);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [locationNames]);

    useEffect(() => {
        if (!selectedCities?.length) {
            if (slugCityId !== null) {
                setSlugCityId(null);
            }
            return;
        }
        if (slugCityId !== null && !selectedCities.some((city) => city.cityId === slugCityId)) {
            setSlugCityId(null);
        }
    }, [selectedCities, slugCityId, setSlugCityId]);

    useEffect(() => {
        if (isEdit) return;
        if (!formData.slugBase?.trim()) return;

        const namespaceCity = selectedCities?.find((city) => city.cityId === slugCityId) || null;
        const namespace = namespaceCity ? slugifyText(namespaceCity.name || '') : '';
        const nextSlug = namespace ? `${namespace}/${formData.slugBase}` : formData.slugBase;

        if (formData.slug !== nextSlug) {
            setFormData((prev) => ({
                ...prev,
                slug: nextSlug
            }));
        }
    }, [formData.slugBase, formData.slug, selectedCities, slugCityId, isEdit, setFormData]);

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
                    slugBase: generatedSlug
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

    const syncPrimaryCity = (nextCities) => {
        const primaryCityId = nextCities?.[0]?.cityId ?? null;
        const cityLabel = (nextCities || []).map((city) => city.name).join(', ') || null;

        setFormData((prev) => ({
            ...prev,
            cityId: primaryCityId,
            districtId: null,
            geoNodeName: cityLabel
        }));
    };

    const addCity = (city) => {
        if (selectedCities?.some((item) => item.cityId === city.cityId)) {
            setCitySearch('');
            setShowCityDropdown(false);
            return;
        }

        const next = [...(selectedCities || []), city];
        setSelectedCities(next);
        syncPrimaryCity(next);

        setCitySearch('');
        setDistrictSearch('');
        setShowCityDropdown(false);
        setShowDistrictDropdown(false);
    };

    const removeCity = (cityId) => {
        const next = (selectedCities || []).filter((item) => item.cityId !== cityId);
        setSelectedCities(next);
        syncPrimaryCity(next);
        setDistrictSearch('');
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
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                            <label className="form-label mb-0">Slug</label>

                            <select
                                className="form-select form-select-sm"
                                style={{ maxWidth: '180px' }}
                                value={slugCityId || ''}
                                onChange={(e) => setSlugCityId(e.target.value ? Number(e.target.value) : null)}
                                disabled={!selectedCities?.length}
                            >
                                <option value="">No city prefix</option>
                                {selectedCities.map((city) => (
                                    <option key={city.cityId} value={city.cityId}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="collection-slug"
                            autoComplete="off"
                            disabled={isEdit}
                            readOnly={!isEdit}
                        />
                        {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                        <small className="text-muted d-block mt-1">Choose a city only if you want it added before the slug.</small>
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
                                setSelectedCities([]);
                                setCitySearch('');
                                setDistrictSearch('');
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
                                                setSelectedCities([]);
                                                setSlugCityId(null);
                                                setCitySearch('');
                                                setDistrictSearch('');
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
                                                setSelectedCities([]);
                                                setSlugCityId(null);
                                                setCitySearch('');
                                                setDistrictSearch('');
                                            }}
                                        >
                                            {region.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-lg-6 mb-3 position-relative dropdown-wrapper">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-1 flex-wrap">
                            <label className="form-label mb-0">City</label>

                            {selectedCities?.length > 0 && (
                                <div className="d-flex flex-nowrap gap-2 justify-content-end overflow-auto city-chip-strip">
                                    {selectedCities.map((city) => (
                                        <span
                                            key={city.cityId}
                                            className="badge text-bg-light border d-inline-flex align-items-center gap-2 py-2 px-3 flex-shrink-0"
                                        >
                                            {city.name}
                                            <button
                                                type="button"
                                                className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                                                onClick={() => removeCity(city.cityId)}
                                                aria-label={`Remove ${city.name}`}
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            className="form-control mt-0"
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
                                                addCity(city);
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
