'use client';

import { getCitiesByCountryOrRegion, getCollectionList, getGeoNodes, getRegionsByCountry } from '@/lib/api/admin/collectionapi';
import { COLLECTION_STATUS_OPTIONS } from '@/lib/constants/ruleConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CollectionList() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('');
    const [cities, setCities] = useState([]);

    const [selectedGeoNode, setSelectedGeoNode] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [geoNodes, setGeoNodes] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');

    useEffect(() => {
        loadCollections();
    }, [statusFilter, selectedGeoNode, selectedCity]);

    const loadCollections = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await getCollectionList({
                status: statusFilter,
                countryId: selectedGeoNode,
                regionId: selectedRegion,
                cityId: selectedCity
            });

            setCollections(res?.data || []);
        } catch (err) {
            if (err.status === 404) {
                setCollections([]);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div className="text-danger text-center py-5">{error}</div>;

    useEffect(() => {
        if (selectedGeoNode) {
            loadCities(selectedGeoNode, selectedRegion);
        } else {
            setCities([]);
            setSelectedCity('');
        }
    }, [selectedGeoNode, selectedRegion]);

    // const loadCities = async (countryId, regionId) => {
    //     try {
    //         const res = await getCitiesByCountryOrRegion({
    //             countryId,
    //             regionId
    //         });

    //         setCities(res?.data || []);
    //         setSelectedCity('');
    //     } catch (err) {
    //         console.error('City load error', err);
    //         setCities([]);
    //     }
    // };

    const loadCities = async (countryId, regionId) => {
        try {
            const res = await getCitiesByCountryOrRegion({
                countryId,
                regionId
            });

            setCities(res?.data || []);
        } catch (err) {
            // If 404 → treat as empty list
            if (err?.status === 404) {
                setCities([]);
            } else {
                console.error('City load error', err);
            }
        } finally {
            setSelectedCity('');
        }
    };

    useEffect(() => {
        loadGeoNodes();
    }, []);

    const loadGeoNodes = async () => {
        try {
            const res = await getGeoNodes();
            console.log(res);
            setGeoNodes(res?.data?.countries || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (selectedGeoNode) {
            loadRegions(selectedGeoNode);
        } else {
            setRegions([]);
            setSelectedRegion('');
        }
    }, [selectedGeoNode]);

    const loadRegions = async (countryId) => {
        try {
            const res = await getRegionsByCountry(countryId);
            setRegions(res?.data || []);
        } catch (err) {
            if (err?.status === 404) {
                setRegions([]);
            } else {
                console.error('Region load error', err);
            }
        } finally {
            setSelectedRegion('');
        }
    };

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hotel Collections</h5>
                <button className="theme-button-orange rounded-1 " onClick={() => router.push('/collections/create')}>
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

                    {/* GeoNode */}
                    <div className="col-12 col-md-4 col-lg-3">
                        <select className="form-select" value={selectedGeoNode} onChange={(e) => setSelectedGeoNode(e.target.value)}>
                            <option value="">Select GeoNode</option>

                            {geoNodes.map((node) => (
                                <option key={node.countryID} value={node.countryID}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                        <select
                            className="form-select"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            disabled={!selectedGeoNode}
                        >
                            <option value="">Select Region</option>
                            {regions.length === 0 && selectedGeoNode && (
                                <option value="" disabled>
                                    No regions found
                                </option>
                            )}

                            {regions.map((region) => (
                                <option key={region.regionID} value={region.regionID}>
                                    {region.name}
                                </option>
                            ))}
                            {/* {regions.map((region) => (
                                <option key={region.regionID} value={region.regionID}>
                                    {region.name}
                                </option>
                            ))} */}
                        </select>
                    </div>

                    {/* City */}
                    <div className="col-12 col-md-4 col-lg-3">
                        <select
                            className="form-select"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedGeoNode}
                        >
                            <option value="">Select City</option>

                            {cities.length === 0 && selectedGeoNode && (
                                <option value="" disabled>
                                    No cities found
                                </option>
                            )}

                            {cities.map((city) => (
                                <option key={city.cityID} value={city.cityID}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading collections...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="text-danger text-center py-4">
                                    {error}
                                </td>
                            </tr>
                        ) : collections.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">
                                    {statusFilter ? `No ${statusFilter} collections found` : 'No collections found'}
                                </td>
                            </tr>
                        ) : (
                            collections.map((item) => (
                                <tr key={item.collectionID}>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span className="badge bg-success">{item.status}</span>
                                    </td>
                                    <td>{item.hotelCount}</td>
                                    <td>{item.publishDate ? new Date(item.publishDate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                        <button className="btn btn-sm btn-outline-secondary me-2">Clone</button>
                                        <button className="btn btn-sm btn-outline-secondary">Preview</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="text-end">
                    <button className="btn btn-outline-danger btn-sm me-2">Retire</button>
                    <button className="btn btn-outline-dark btn-sm">Retire & Redirect</button>
                </div>
            </div>
        </div>
    );
}
