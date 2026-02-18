import CollectionList from './components/CollectionList';
import RedirectManager from './components/RedirectManager';
import CollectionEditor from './components/CollectionEditor';

export default function CollectionsPage() {

    return (
        <div className="container-fluid py-4">
            <CollectionList />
            <CollectionEditor />
            <RedirectManager />
        </div>
        // <div className="container-fluid py-4">
        //     <h3 className="mb-4 fw-bold">Hotel Collections</h3>

        //     {/* Tabs */}
        //     <ul className="nav nav-tabs mb-4">
        //         <li className="nav-item">
        //             <button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
        //                 Collections List
        //             </button>
        //         </li>

        //         <li className="nav-item">
        //             <button className={`nav-link ${activeTab === 'editor' ? 'active' : ''}`} onClick={() => setActiveTab('editor')}>
        //                 Collection Editor
        //             </button>
        //         </li>

        //         <li className="nav-item">
        //             <button className={`nav-link ${activeTab === 'redirect' ? 'active' : ''}`} onClick={() => setActiveTab('redirect')}>
        //                 Redirect Manager
        //             </button>
        //         </li>
        //     </ul>

        //     {/* Render Components */}
        //     {activeTab === 'list' && <CollectionList />}
        //     {activeTab === 'editor' && <CollectionEditor />}
        //     {activeTab === 'redirect' && <RedirectManager />}
        // </div>
    );
}
