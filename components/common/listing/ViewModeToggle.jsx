'use client';

export default function ViewModeToggle({ viewMode = 'list', onChange = () => {}, className = '' }) {
    const isList = viewMode === 'list';

    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                borderRadius: '999px',
                background: '#efefef',
                border: '1px solid transparent'
            }}
        >
            <button
                type="button"
                aria-pressed={isList}
                onClick={() => onChange('list')}
                style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: isList ? '#ffffff' : 'transparent',
                    border: 'none',
                    boxShadow: isList ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.1
                }}
            >
                List
            </button>
            <button
                type="button"
                aria-pressed={!isList}
                onClick={() => onChange('grid')}
                style={{
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    background: !isList ? '#ffffff' : 'transparent',
                    color: '#111111',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.1,
                    boxShadow: !isList ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
                }}
            >
                Grid
            </button>
        </div>
    );
}
