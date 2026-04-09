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
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.7)',
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <BarsLoader />
        </div>
    );
}
