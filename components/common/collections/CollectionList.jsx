'use client';

import { getCitiesByCountryOrRegion, getCollectionList, getRegionsByCountry } from '@/lib/api/admin/collectionapi';
import { COLLECTION_STATUS_OPTIONS } from '@/lib/constants/ruleConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CollectionList({ initialCollections, initialGeoNodes }) {
    const [collections, setCollections] = useState(initialCollections);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState('');
    const [cities, setCities] = useState([]);

    const [selectedGeoNode, setSelectedGeoNode] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [geoNodes, setGeoNodes] = useState(initialGeoNodes);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');

    useEffect(() => {
        const loadCollections = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getCollectionList({
                    status: statusFilter,
                    countryId: selectedGeoNode || null,
                    regionId: selectedRegion || null,
                    cityId: selectedCity || null
                });
                setCollections(res?.data || []);
            } catch {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        loadCollections();
    }, [statusFilter, selectedGeoNode, selectedRegion, selectedCity]);

    // Region load
    useEffect(() => {
        if (!selectedGeoNode) {
            setRegions([]);
            setSelectedRegion('');
            return;
        }

        getRegionsByCountry(selectedGeoNode)
            .then((res) => setRegions(res?.data || []))
            .catch(() => setRegions([]));
    }, [selectedGeoNode]);

    // City load
    useEffect(() => {
        if (!selectedGeoNode) {
            setCities([]);
            setSelectedCity('');
            return;
        }

        getCitiesByCountryOrRegion({
            countryId: selectedGeoNode,
            regionId: selectedRegion || null
        })
            .then((res) => setCities(res?.data || []))
            .catch(() => setCities([]));
    }, [selectedGeoNode, selectedRegion]);

    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hotel Collections</h5>
                <button className="theme-button-orange rounded-1" onClick={() => router.push('/collections/create')}>
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
                            {geoNodes.map((node, index) => (
                                <option key={`${node.countryId || index}`} value={node.countryId}>
                                    {node.name}
                                </option>
                            ))}
                            {/* {geoNodes.map((node) => (
                                <option key={node.countryId} value={node.countryId}>
                                    {node.name}
                                </option>
                            ))} */}
                        </select>
                    </div>

                    {/* Region */}
                    <div className="col-12 col-md-4 col-lg-3">
                        <select
                            className="form-select"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            disabled={!selectedGeoNode}
                        >
                            <option value="">Select Region</option>
                            {regions.length === 0 && selectedGeoNode && <option disabled>No regions found</option>}
                            {regions.map((r, index) => (
                                <option key={`${r.regionId || index}`} value={r.regionId}>
                                    {r.name}
                                </option>
                            ))}
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
                            {cities.length === 0 && selectedGeoNode && <option disabled>No cities found</option>}
                            {cities.map((c, index) => (
                                <option key={`${c.cityId || index}`} value={c.cityId}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
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
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading collections...
                                </td>
                            </tr>
                        ) : collections.length === 0 ? (
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
            </div>
        </div>
    );
}
