'use client';
import { useState } from 'react';

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState('All stays');
  const tabs = ['All stays', 'Hotels', 'Homes'];

  return (
    <div className="d-flex overflow-auto gap-2 px-3 py-2 border-bottom w-100 mx-auto" style={{ maxWidth: '480px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`btn btn-sm rounded-pill border text-nowrap ${
            activeTab === tab
              ? 'fw-semibold text-dark bg-light shadow-sm border-0'
              : 'bg-white text-secondary'
          }`}
          style={{ fontSize: '13px', padding: '5px 16px' }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
