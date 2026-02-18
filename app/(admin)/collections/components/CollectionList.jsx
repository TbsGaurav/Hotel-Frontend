
export default function CollectionList() {
    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hotel Collections</h5>
                <button className="btn btn-outline-dark btn-sm">Create New Collection</button>
            </div>

            <div className="card-body">
                {/* <div className="mb-3 text-muted small">Filter: City / Type / Status / Template</div> */}

                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Collection Name</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Hotels</th>
                            <th>Last Modified</th>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sydney Hotels</td>
                            <td>Sydney</td>
                            <td>Cura</td>
                            <td>Active</td>
                            <td>42</td>
                            <td>05/01/22</td>
                            <td>
                                <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                                <button className="btn btn-sm btn-outline-secondary me-2">Clone</button>
                                <button className="btn btn-sm btn-outline-secondary">Preview</button>
                            </td>
                        </tr>
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



