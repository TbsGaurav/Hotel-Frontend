'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCitiesByCountryOrRegion, getGeoNodes, getHotelsByCity, upsertCollection, saveContent } from '@/lib/api/admin/collectionapi';

import BasicsTab from './BasicsTab';
import ContentTab from './ContentTab';
import RulesTab from './RulesTab';
import CurationTab from './CurationTab';
import PreviewTab from './PreviewTab';

export default function CreateCollection() {
    const router = useRouter();

    const tabOrder = ['Basics', 'Content', 'Rules', 'Curation', 'Preview'];
    const [activeTab, setActiveTab] = useState('Basics');

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
    useEffect(() => {
        loadGeoNodes();
    }, []);

    const loadGeoNodes = async () => {
        const res = await getGeoNodes();
        setGeoNodes(res?.data?.countries || []);
    };

    useEffect(() => {
        if (formData.geoNodeId) loadCities(formData.geoNodeId);
    }, [formData.geoNodeId]);

    const loadCities = async (countryId) => {
        const res = await getCitiesByCountryOrRegion({ countryId });
        setCities(res?.data || []);
    };

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
            faQsJson: JSON.stringify(contentData.faqs), // match backend casing
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

    // ---------------- FINAL SUBMIT ----------------
    const handleSaveBasics = async () => {
        const collectionObject = {
            GeoNodeId: Number(formData.geoNodeId),
            Name: formData.name,
            Slug: formData.slug,
            Type: formData.mode.toLowerCase(),
            Template: formData.template || null,
            Status: formData.status.toLowerCase(),
            ExpiryDate: formData.expiryDate || null,
            MaxHotels: Number(formData.maxHotels),
            DefaultSort: 'StarRating DESC'
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
                setCollectionId(newCollectionId); // 🔥 IMPORTANT
                onNext();
            } else {
                alert('Failed to get collectionId');
            }
        } catch (err) {
            console.error(err);
            alert('Save failed');
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

            {activeTab === 'Basics' && (
                <BasicsTab
                    formData={formData}
                    setFormData={setFormData}
                    geoNodes={geoNodes}
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    setCollectionId={setCollectionId}
                    onNext={goNext}
                />
            )}

            {activeTab === 'Content' && (
                <ContentTab data={contentData} setData={setContentData} onBack={goBack} onNext={handleSaveContent} />
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
                    onNext={goNext}
                    onBack={goBack}
                />
            )}

            {activeTab === 'Curation' && (
                <CurationTab
                    formData={formData}
                    setFormData={setFormData}
                    geoNodes={geoNodes}
                    cities={cities}
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
                    addPinnedHotel={addPinnedHotel}
                    addExcludedHotel={addExcludedHotel}
                    moveHotel={moveHotel}
                    onNext={goNext}
                    onBack={goBack}
                    showPinnedDropdown={showPinnedDropdown}
                    setShowPinnedDropdown={setShowPinnedDropdown}
                    showExcludeDropdown={showExcludeDropdown}
                    setShowExcludeDropdown={setShowExcludeDropdown}
                />
            )}

            {activeTab === 'Preview' && (
                <PreviewTab
                    formData={formData}
                    rules={rules}
                    pinnedHotels={pinnedHotels}
                    excludedHotels={excludedHotels}
                    onBack={goBack}
                    onSubmit={() => handleSubmit('Published')}
                />
            )}
        </div>
    );
}
