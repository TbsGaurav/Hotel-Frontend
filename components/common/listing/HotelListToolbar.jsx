'use client';

import { FaMapMarkerAlt, FaList, FaThLarge } from 'react-icons/fa';

export default function HotelListToolbar({
    viewMode = 'list',
    onViewModeChange = () => {},
    mapVisible = false,
    onMapToggle = () => {},
    resultsCount = null,
    className = ''
}) {
    if (resultsCount !== null && Number(resultsCount) <= 0) {
        return null;
    }

    const isList = viewMode === 'list';
    const rootClassName = ['hotel-toolbar', className].filter(Boolean).join(' ');

    return (
        <div
            className={rootClassName}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px',
                marginBottom: '12px'
            }}
        >
            <div
                className="toolbar-switch"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px',
                    borderRadius: '999px',
                    background: '#f5f5f5',
                    border: '1px solid transparent'
                }}
            >
                <button
                    type="button"
                    className="toolbar-btn list-btn"
                    aria-pressed={isList}
                    onClick={() => onViewModeChange('list')}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: isList ? '#ffffff' : 'transparent',
                        border: 'none',
                        boxShadow: isList ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#333'
                    }}
                >
                    <FaList size={12} />
                    List
                </button>
                <button
                    type="button"
                    className="toolbar-btn grid-btn"
                    aria-pressed={!isList}
                    onClick={() => onViewModeChange('grid')}
                    style={{
                        border: 'none',
                        borderRadius: '999px',
                        padding: '8px 16px',
                        background: !isList ? '#ffffff' : 'transparent',
                        color: '#333333',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        boxShadow: !isList ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <FaThLarge size={12} />
                    Grid
                </button>
                <button
                    type="button"
                    className="toolbar-btn map-btn"
                    onClick={onMapToggle}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        background: mapVisible ? '#ffffff' : 'transparent',
                        border: 'none',
                        boxShadow: mapVisible ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#333'
                    }}
                >
                    <FaMapMarkerAlt size={14} />
                    <span>Map</span>
                </button>
            </div>
        </div>
    );
}
