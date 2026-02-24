'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCitiesByCountryOrRegion,
    getGeoNodes,
    getHotelsByCity,
    upsertCollection,
    saveContent,
    saveRule,
    getRulesByCollectionId,
    updateCollectionStatus
} from '@/lib/api/admin/collectionapi';

import BasicsTab from './BasicsTab';
import ContentTab from './ContentTab';
import RulesTab from './RulesTab';
import CurationTab from './CurationTab';
import PreviewTab from './PreviewTab';

export default function CreateCollection() {
    const router = useRouter();

    const tabOrder = ['Basics', 'Content', 'Rules', 'Curation', 'Preview'];
    const [activeTab, setActiveTab] = useState('Basics');
    const [geoSearch, setGeoSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    const [geoOptions, setGeoOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [showGeoDropdown, setShowGeoDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const [selectedGeoNode, setSelectedGeoNode] = useState(null);
    const [selectedCityObj, setSelectedCityObj] = useState(null);
    const [collectionId, setCollectionId] = useState(null);

    const [contentData, setContentData] = useState({
        header: '',
        metaTitle: '',
        metaDescription: '',
        introShortCopy: '',
        introLongCopy: '',
        heroImageUrl: '',
        badge: '',
        faqs: []
    });

    const [rules, setRules] = useState([]);
    const [ruleField, setRuleField] = useState('');
    const [ruleOperator, setRuleOperator] = useState('=');
    const [ruleValue, setRuleValue] = useState('');

    const [hotelSearch, setHotelSearch] = useState('');
    const [excludeSearch, setExcludeSearch] = useState('');
    const [excludeReason, setExcludeReason] = useState('');
    const [selectedPinnedHotel, setSelectedPinnedHotel] = useState(null);
    const [selectedExcludeHotel, setSelectedExcludeHotel] = useState(null);

    const [pinnedHotels, setPinnedHotels] = useState([]);
    const [excludedHotels, setExcludedHotels] = useState([]);

    const [pinnedOptions, setPinnedOptions] = useState([]);
    const [excludeOptions, setExcludeOptions] = useState([]);
    const [showPinnedDropdown, setShowPinnedDropdown] = useState(false);
    const [showExcludeDropdown, setShowExcludeDropdown] = useState(false);

    const [geoNodes, setGeoNodes] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        geoNodeId: '',
        status: 'Draft',
        expiryDate: '',
        mode: 'Hybrid',
        maxHotels: '',
        changedBy: 'Admin',
        isDebug: false,
        defaultSort: 'StarRating DESC',
        template: ''
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            if (geoSearch.length >= 2 && !selectedGeoNode) {
                loadGeoNodesBySearch(geoSearch);
            } else {
                setShowGeoDropdown(false);
            }

            if (citySearch.length >= 2 && selectedGeoNode && !selectedCityObj) {
                loadCitiesBySearch(citySearch);
            } else {
                setShowCityDropdown(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [geoSearch, citySearch]);

    const loadGeoNodesBySearch = async (search) => {
        const res = await getGeoNodes({ search });

        const results = res?.data?.countries || [];

        setGeoOptions(results);
        setShowGeoDropdown(true);
    };

    const loadCitiesBySearch = async (search) => {
        const payload = {
            search,
            countryId: selectedGeoNode?.countryId
        };

        const res = await getCitiesByCountryOrRegion(payload);
        setCityOptions(res?.data?.slice(0, 50) || []);
        setShowCityDropdown(true);
    };
    // ---------------- TAB NAV ----------------
    const goNext = () => {
        const i = tabOrder.indexOf(activeTab);
        if (i < tabOrder.length - 1) setActiveTab(tabOrder[i + 1]);
    };

    const goBack = () => {
        const i = tabOrder.indexOf(activeTab);
        if (i > 0) setActiveTab(tabOrder[i - 1]);
    };

    // ---------------- LOAD GEO ----------------
    // useEffect(() => {
    //     loadGeoNodes();
    // }, []);

    // const loadGeoNodes = async () => {
    //     const res = await getGeoNodes();
    //     setGeoNodes(res?.data?.countries || []);
    // };

    // useEffect(() => {
    //     if (formData.geoNodeId) loadCities(formData.geoNodeId);
    // }, [formData.geoNodeId]);

    // const loadCities = async (countryId) => {
    //     const res = await getCitiesByCountryOrRegion({ countryId });
    //     setCities(res?.data || []);
    // };

    // ---------------- HOTEL SEARCH ----------------
    useEffect(() => {
        const delay = setTimeout(() => {
            if (hotelSearch.length >= 2 && !selectedPinnedHotel) {
                loadHotels(hotelSearch, 'pinned');
            } else {
                setShowPinnedDropdown(false);
            }

            if (excludeSearch.length >= 2 && !selectedExcludeHotel) {
                loadHotels(excludeSearch, 'exclude');
            } else {
                setShowExcludeDropdown(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [hotelSearch, excludeSearch, selectedCity]);

    const loadHotels = async (search, type) => {
        const payload = { search };
        if (selectedCity) payload.cityId = selectedCity;

        const res = await getHotelsByCity(payload);
        const results = res?.data?.slice(0, 50) || [];

        if (type === 'pinned') {
            setPinnedOptions(results);
            setShowPinnedDropdown(true);
        } else {
            setExcludeOptions(results);
            setShowExcludeDropdown(true);
        }
    };

    // ---------------- RULE FUNCTIONS ----------------
    const addRule = () => {
        if (!ruleField || !ruleValue) return;

        setRules([...rules, { Field: ruleField, Operator: ruleOperator, Value: ruleValue }]);

        setRuleField('');
        setRuleOperator('=');
        setRuleValue('');
    };

    const removeRule = (index) => {
        setRules(rules.filter((_, i) => i !== index));
    };

    // ---------------- PIN ----------------
    const addPinnedHotel = () => {
        if (!selectedPinnedHotel) return;

        if (pinnedHotels.some((h) => h.id === selectedPinnedHotel.id)) {
            alert('Hotel already pinned');
            return;
        }

        setPinnedHotels([...pinnedHotels, selectedPinnedHotel]);
        setSelectedPinnedHotel(null);
        setHotelSearch('');
    };

    const moveHotel = (index, direction) => {
        const updated = [...pinnedHotels];
        const target = index + direction;
        if (target < 0 || target >= updated.length) return;

        [updated[index], updated[target]] = [updated[target], updated[index]];
        setPinnedHotels(updated);
    };

    // ---------------- EXCLUDE ----------------
    const addExcludedHotel = () => {
        if (!selectedExcludeHotel || !excludeReason) return;

        if (excludedHotels.some((h) => h.id === selectedExcludeHotel.id)) {
            alert('Already excluded');
            return;
        }

        setExcludedHotels([
            ...excludedHotels,
            {
                id: selectedExcludeHotel.id,
                name: selectedExcludeHotel.name,
                reason: excludeReason
            }
        ]);

        setSelectedExcludeHotel(null);
        setExcludeSearch('');
        setExcludeReason('');
    };

    // ---------------- SAVE CONTENT ----------------
    const handleSaveContent = async () => {
        if (!collectionId) {
            alert('Please save Basics first');
            return;
        }

        const payload = {
            collectionId: collectionId,
            header: contentData.header,
            metaTitle: contentData.metaTitle,
            metaDescription: contentData.metaDescription,
            introShortCopy: contentData.introShortCopy,
            introLongCopy: contentData.introLongCopy,
            heroImageUrl: contentData.heroImageUrl,
            badge: contentData.badge,
            faQsJson: JSON.stringify(contentData.faqs),
            userId: 1
        };

        try {
            await saveContent(collectionId, payload);
            setActiveTab('Rules');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save content');
        }
    };

    const handleSaveBasics = async () => {
        const collectionObject = {
            GeoNodeId: Number(formData.geoNodeId),
            Name: formData.name,
            Slug: formData.slug,
            Type: formData.mode.toLowerCase(),
            Template: formData.template || null,
            Status: formData.status.toLowerCase(),
            ExpiryDate: formData.expiryDate || null,
            MaxHotels: formData.maxHotels ? Number(formData.maxHotels) : null,
            DefaultSort: formData.defaultSort || 'StarRating DESC'
        };

        const payload = {
            collectionId: null,
            collectionJson: JSON.stringify(collectionObject),
            rulesJson: null,
            pinnedJson: null,
            excludeJson: null,
            changedBy: formData.changedBy,
            isDebug: formData.isDebug
        };

        try {
            const response = await upsertCollection(payload);

            const newCollectionId = response?.data?.collectionId;

            if (newCollectionId) {
                setCollectionId(newCollectionId);
                // alert('Basics saved successfully!');
                goNext(); // ✅ move to Content tab
            } else {
                alert('Failed to get collectionId from response');
            }
        } catch (error) {
            console.error('Save Basics failed:', error);
            alert('Failed to save Basics');
        }
    };

    const handleSaveRules = async () => {
        if (!collectionId) {
            alert('Please save Basics first');
            return;
        }

        if (!rules.length) {
            alert('Please add at least one rule');
            return;
        }

        try {
            await Promise.all(
                rules.map((rule) =>
                    saveRule({
                        ruleId: 0,
                        collectionId: collectionId,
                        field: rule.Field,
                        operator: rule.Operator,
                        value: rule.Value,
                        logicalGroup: 'AND'
                    })
                )
            );

            // alert('Rules saved successfully!');
            goNext();
        } catch (error) {
            console.error('Save rules failed:', error);
            alert('Failed to save rules');
        }
    };

    useEffect(() => {
        if (!selectedGeoNode) {
            setSelectedCity(null);
            setSelectedCityObj(null);
            setCitySearch('');
            setCityOptions([]);
            setShowCityDropdown(false);
        }
    }, [selectedGeoNode]);

    const handleRulesBack = async () => {
        if (!collectionId) {
            goBack();
            return;
        }

        try {
            const res = await getRulesByCollectionId(collectionId);

            // adjust based on backend response
            const fetchedRules = res?.data || [];

            const formattedRules = fetchedRules.map((rule) => ({
                Field: rule.field,
                Operator: rule.operator,
                Value: rule.value
            }));

            setRules(formattedRules);

            // move to previous tab after fetching
            setActiveTab('Content');
        } catch (error) {
            console.error('Failed to fetch rules:', error);
            goBack();
        }
    };

    const handleStatusUpdate = async (action) => {
        if (!collectionId) {
            alert('Collection Id not found');
            return;
        }

        try {
            await updateCollectionStatus(collectionId, action);

            alert(action === 'publish' ? 'Collection published successfully!' : 'Collection saved as draft!');

            setFormData((prev) => ({
                ...prev,
                status: action === 'publish' ? 'Published' : 'Draft'
            }));

            router.push('/collections');
        } catch (error) {
            console.error('Status update failed:', error);
            alert('Failed to update status');
        }
    };
    // ---------------- RENDER ----------------
    return (
        <div className="card shadow-sm">
            <ul className="nav nav-tabs mb-4">
                {tabOrder.map((tab, index) => {
                    const currentIndex = tabOrder.indexOf(activeTab);
                    const isDisabled = index > currentIndex + 1;

                    return (
                        <li className="nav-item" key={tab}>
                            <button
                                type="button"
                                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                disabled={isDisabled}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className="card-header">
                <h5>Collections</h5>
            </div>
            <div className="card-body">
                {activeTab === 'Basics' && (
                    <BasicsTab
                        formData={formData}
                        setFormData={setFormData}
                        geoNodes={geoNodes}
                        cities={cities}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        setCollectionId={setCollectionId}
                        onNext={handleSaveBasics}

                        // onNext={goNext}
                    />
                )}

                {activeTab === 'Content' && (
                    <ContentTab
                        data={contentData}
                        setData={setContentData}
                        onBack={goBack}
                        onNext={handleSaveContent}
                        collectionId={collectionId}
                    />
                )}

                {activeTab === 'Rules' && (
                    <RulesTab
                        rules={rules}
                        setRules={setRules}
                        ruleField={ruleField}
                        setRuleField={setRuleField}
                        ruleOperator={ruleOperator}
                        setRuleOperator={setRuleOperator}
                        ruleValue={ruleValue}
                        setRuleValue={setRuleValue}
                        formData={formData}
                        setFormData={setFormData}
                        addRule={addRule}
                        removeRule={removeRule}
                        // onNext={goNext}
                        onNext={handleSaveRules}
                        onBack={handleRulesBack}
                    />
                )}

                {activeTab === 'Curation' && (
                    <CurationTab
                        formData={formData}
                        setFormData={setFormData}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        pinnedHotels={pinnedHotels}
                        setPinnedHotels={setPinnedHotels}
                        excludedHotels={excludedHotels}
                        setExcludedHotels={setExcludedHotels}
                        hotelSearch={hotelSearch}
                        setHotelSearch={setHotelSearch}
                        excludeSearch={excludeSearch}
                        setExcludeSearch={setExcludeSearch}
                        excludeReason={excludeReason}
                        setExcludeReason={setExcludeReason}
                        pinnedOptions={pinnedOptions}
                        excludeOptions={excludeOptions}
                        selectedPinnedHotel={selectedPinnedHotel}
                        setSelectedPinnedHotel={setSelectedPinnedHotel}
                        selectedExcludeHotel={selectedExcludeHotel}
                        setSelectedExcludeHotel={setSelectedExcludeHotel}
                        showPinnedDropdown={showPinnedDropdown}
                        setShowPinnedDropdown={setShowPinnedDropdown}
                        showExcludeDropdown={showExcludeDropdown}
                        setShowExcludeDropdown={setShowExcludeDropdown}
                        geoSearch={geoSearch}
                        setGeoSearch={setGeoSearch}
                        geoOptions={geoOptions}
                        showGeoDropdown={showGeoDropdown}
                        setShowGeoDropdown={setShowGeoDropdown}
                        selectedGeoNode={selectedGeoNode}
                        setSelectedGeoNode={setSelectedGeoNode}
                        citySearch={citySearch}
                        setCitySearch={setCitySearch}
                        cityOptions={cityOptions}
                        showCityDropdown={showCityDropdown}
                        setShowCityDropdown={setShowCityDropdown}
                        selectedCityObj={selectedCityObj}
                        setSelectedCityObj={setSelectedCityObj}
                        loadGeoNodesBySearch={loadGeoNodesBySearch}
                        loadCitiesBySearch={loadCitiesBySearch}
                        addPinnedHotel={addPinnedHotel}
                        addExcludedHotel={addExcludedHotel}
                        moveHotel={moveHotel}
                        onNext={goNext}
                        onBack={goBack}
                        setCityOptions={setCityOptions}
                    />
                    // <CurationTab
                    //     formData={formData}
                    //     setFormData={setFormData}
                    //     geoNodes={geoNodes}
                    //     cities={cities}
                    //     selectedCity={selectedCity}
                    //     setSelectedCity={setSelectedCity}
                    //     pinnedHotels={pinnedHotels}
                    //     setPinnedHotels={setPinnedHotels}
                    //     excludedHotels={excludedHotels}
                    //     setExcludedHotels={setExcludedHotels}
                    //     hotelSearch={hotelSearch}
                    //     setHotelSearch={setHotelSearch}
                    //     excludeSearch={excludeSearch}
                    //     setExcludeSearch={setExcludeSearch}
                    //     excludeReason={excludeReason}
                    //     setExcludeReason={setExcludeReason}
                    //     pinnedOptions={pinnedOptions}
                    //     excludeOptions={excludeOptions}
                    //     selectedPinnedHotel={selectedPinnedHotel}
                    //     setSelectedPinnedHotel={setSelectedPinnedHotel}
                    //     selectedExcludeHotel={selectedExcludeHotel}
                    //     setSelectedExcludeHotel={setSelectedExcludeHotel}
                    //     addPinnedHotel={addPinnedHotel}
                    //     addExcludedHotel={addExcludedHotel}
                    //     moveHotel={moveHotel}
                    //     onNext={goNext}
                    //     onBack={goBack}
                    //     showPinnedDropdown={showPinnedDropdown}
                    //     setShowPinnedDropdown={setShowPinnedDropdown}
                    //     showExcludeDropdown={showExcludeDropdown}
                    //     setShowExcludeDropdown={setShowExcludeDropdown}
                    // />
                )}

                {activeTab === 'Preview' && (
                    <PreviewTab
                        formData={formData}
                        rules={rules}
                        pinnedHotels={pinnedHotels}
                        excludedHotels={excludedHotels}
                        onBack={goBack}
                        onSubmit={handleStatusUpdate}
                    />
                )}
            </div>
        </div>
    );
}
