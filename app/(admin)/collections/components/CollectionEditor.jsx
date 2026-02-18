export default function CollectionEditor() {
    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header">
                <h5 className="mb-0">
                    Edit Collection: <strong>Melbourne Family Hotels</strong>
                </h5>
            </div>

            <div className="card-body">
                {/* Basic Details */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Collection Name</label>
                        <input className="form-control" defaultValue="Melbourne-Family-Hotels" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Slug</label>
                        <input className="form-control" defaultValue="/melbourne-family-hotels" />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <label className="form-label">GeoNode</label>
                        <select className="form-select">
                            <option>Melbourne</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Template</label>
                        <select className="form-select">
                            <option>Family</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <div>
                            <input type="checkbox" className="form-check-input me-2" />
                            Draft / Published
                        </div>
                    </div>
                </div>

                {/* Mode + Rules */}
                <div className="row">
                    <div className="col-md-6">
                        <h6>Mode</h6>
                        <div className="mb-3">Hybrid (Rules + Pinned)</div>

                        <h6>Rules</h6>

                        <select className="form-select mb-2">
                            <option>Geo = Melbourne</option>
                        </select>

                        <select className="form-select mb-2">
                            <option>Tag = Family Friendly</option>
                        </select>

                        <select className="form-select mb-2">
                            <option>Rating &gt; 8.0</option>
                        </select>

                        <div className="mt-3">
                            Max Hotels:
                            <select className="form-select w-25 d-inline-block ms-2">
                                <option>50</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <h6>Exclusions</h6>
                        <ul>
                            <li>Chain: ABC Hotels</li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h6>Pinned Hotels</h6>
                        <ul>
                            <li>Hotel A</li>
                            <li>Hotel B</li>
                        </ul>
                    </div>
                </div>

                <div className="text-end mt-4">
                    <button className="btn btn-outline-secondary me-2">Save Draft</button>
                    <button className="btn btn-success">Publish</button>
                </div>
            </div>
        </div>
    );
}
