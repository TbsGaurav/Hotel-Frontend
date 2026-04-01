'use client';

import {
    getCitiesByCountryOrRegion,
    getCollectionList,
    getRegionsByCountry,
    cloneCollection,
    deleteCollection
} from '@/lib/api/admin/collectionapi';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const totalPages = Math.ceil(totalRecords / pageSize);

    const getPublicCollectionPath = (slug) => {
        const normalizedSlug = String(slug || '')
            .trim()
            .replace(/^\/+/, '');
        return normalizedSlug ? `/${normalizedSlug}` : null;
    };

    const getFinalGeoSelection = () => {
        if (selectedCity) {
            return { geoNodeType: 'City', sourceId: selectedCity };
        }

        if (selectedRegion) {
            return { geoNodeType: 'Region', sourceId: selectedRegion };
        }

        if (selectedCountry) {
            return { geoNodeType: 'Country', sourceId: selectedCountry };
        }

        return { geoNodeType: null, sourceId: null };
    };

    useEffect(() => {
        const loadCollections = async () => {
            try {
                setLoading(true);

                const { geoNodeType, sourceId } = getFinalGeoSelection();

                const res = await getCollectionList({
                    status: statusFilter || null,
                    geoNodeType,
                    sourceId,
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

            const { geoNodeType, sourceId } = getFinalGeoSelection();

            const updated = await getCollectionList({
                status: statusFilter || null,
                geoNodeType,
                sourceId
            });

            setCollections(updated?.data?.collections || []);
            setTotalRecords(Number(updated?.data?.totalRecords || 0));
        } catch (error) {
            console.error(error);
            toast.error('Failed to clone collection');
        }
    };

    const confirmDelete = async () => {
        if (!collectionToDelete) return;

        try {
            setDeleteLoading(true);

            await deleteCollection(collectionToDelete);

            toast.success('Collection deleted successfully');

            const { geoNodeType, sourceId } = getFinalGeoSelection();

            const updated = await getCollectionList({
                status: statusFilter || null,
                geoNodeType,
                sourceId,
                pageNumber,
                pageSize
            });

            setCollections(updated?.data?.collections || []);
            setTotalRecords(Number(updated?.data?.totalRecords || 0));

            setShowDeleteModal(false);
            setCollectionToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete collection');
        } finally {
            setDeleteLoading(false);
        }
    };
    const renderActionButtons = (item) => {
        const isViewEnabled = item.status === 'Published' || (item.status === 'Draft' && item.hotelCount > 0);

        return (
            <>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => router.push(`${ADMIN_ROUTES.collections}/${item.collectionId}`)}
                >
                    Edit
                </button>

                <button className="btn btn-sm btn-outline-primary" onClick={() => handleClone(item.collectionId)}>
                    Clone
                </button>

                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => router.push(`${ADMIN_ROUTES.collections}/${item.collectionId}/preview`)}
                >
                    Preview
                </button>

                <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={!isViewEnabled}
                    title={!isViewEnabled ? 'No hotels available for this collection' : ''}
                    onClick={() => {
                        if (!isViewEnabled) return;

                        const publicPath = getPublicCollectionPath(item.slug);

                        if (!publicPath) {
                            toast.error('Collection slug not available');
                            return;
                        }

                        router.push(publicPath);
                    }}
                >
                    View Live
                </button>

                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                        setCollectionToDelete(item.collectionId);
                        setShowDeleteModal(true);
                    }}
                >
                    Delete
                </button>
            </>
        );
    };

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <h5 className="mb-0  fw-semibold">Hotel Collections</h5>
                <button className="theme-button-orange rounded-1" onClick={() => router.push(ADMIN_ROUTES.createCollection)}>
                    Create New Collection
                </button>
            </div>

            <div className="card-body">
                <div className="row g-3 mb-4 p-3 bg-light rounded">
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

                                if (selectedCountryObj) {
                                    setCountrySearch(selectedCountryObj.name);
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setCountrySearch(value);
                                setShowCountryDropdown(true);

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

                <div className="d-none d-md-block">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-secondary small text-uppercase">
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
                            ) : collections.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No collections found
                                    </td>
                                </tr>
                            ) : (
                                collections?.map((item) => (
                                    <tr key={item.collectionId}>
                                        <td>
                                            <span className="fw-semibold text-dark">{item.name}</span>
                                        </td>
                                        <td>{item.type}</td>
                                        <td>
                                            <span
                                                className={`badge rounded-pill ${item.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}
                                            >
                                                {item.status}
                                            </span>{' '}
                                        </td>
                                        <td>{item.hotelCount}</td>
                                        <td>{item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('en-GB') : '-'}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2">{renderActionButtons(item)}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-md-none">
                    {loading ? (
                        <div className="d-flex flex-column gap-3">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="border rounded-3 p-3">
                                    <div className="skeleton-name mb-3"></div>
                                    <div className="skeleton-small mb-2"></div>
                                    <div className="skeleton-badge mb-2"></div>
                                    <div className="skeleton-number"></div>
                                </div>
                            ))}
                        </div>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-4 text-muted border rounded-3">No collections found</div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {collections.map((item) => (
                                <div key={item.collectionId} className="border rounded-3 p-3 shadow-sm">
                                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                                        <h6 className="mb-0 fw-semibold">{item.name}</h6>
                                        <span
                                            className={`badge rounded-pill ${item.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="small text-muted mb-1">
                                        <strong className="text-dark">Type:</strong> {item.type || '-'}
                                    </div>
                                    <div className="small text-muted mb-1">
                                        <strong className="text-dark">Hotels:</strong> {item.hotelCount}
                                    </div>
                                    <div className="small text-muted mb-3">
                                        <strong className="text-dark">Publish Date:</strong>{' '}
                                        {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString('en-GB') : '-'}
                                    </div>

                                    <div className="d-grid gap-2">{renderActionButtons(item)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mt-3">
                    <div>
                        Showing page {pageNumber} of {totalPages}
                    </div>

                    <div className="d-flex gap-2 justify-content-end w-100 w-md-auto">
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

            {showDeleteModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete Collection</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                </div>

                                <div className="modal-body">
                                    <p className="mb-0">Are you sure you want to delete this collection?</p>
                                    <small className="text-danger">This action cannot be undone.</small>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={deleteLoading}
                                    >
                                        Cancel
                                    </button>

                                    <button className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                                        {deleteLoading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backdrop */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
}
