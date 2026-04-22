function BarsLoader() {
    return (
        <div className="bars-loader">
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}

export default function Loader() {
    return (
        <div className="loader">
            <BarsLoader />
        </div>
    );
}
