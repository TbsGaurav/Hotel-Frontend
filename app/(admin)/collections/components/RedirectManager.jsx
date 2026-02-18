export default function RedirectManager() {
    return (
        <div className="card shadow-sm mb-5">
            <div className="card-header">
                <h5 className="mb-0">Redirect Manager</h5>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label">Old Collection</label>
                        <select className="form-select">
                            <option>/easter-in-melbourne</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">New Redirect URL</label>
                        <select className="form-select">
                            <option>/melbourne-hotels</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Redirect Type</label>
                        <select className="form-select">
                            <option>301 Permanent</option>
                        </select>
                    </div>
                </div>

                <button className="btn btn-primary">Save Redirect</button>
            </div>
        </div>
    );
}
