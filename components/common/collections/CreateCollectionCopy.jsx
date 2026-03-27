'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCitiesByCountryOrRegion,
    getHotelsByCity,
    upsertCollection,
    saveContent,
    saveRule,
    updateCollectionStatus,
    saveCuration,
    getCollectionById
} from '@/lib/api/admin/collectionapi';

import BasicsTab from './BasicsTab';
import ContentTab from './ContentTab';
import RulesTab from './RulesTab';
import CurationTab from './CurationTab';
import PreviewTab from './PreviewTab';
import toast from 'react-hot-toast';
import { getCountriesApi } from '@/lib/api/public/countryapi';
import { ADMIN_ROUTES } from '@/lib/route';

export default function CreateCollection({ collectionId: propCollectionId }) {
    const router = useRouter();
    const [collectionId, setCollectionId] = useState(propCollectionId || null);
    const tabOrder = ['Basics', 'Content', 'Rules', 'Curation', 'Preview'];
    const [activeTab, setActiveTab] = useState('Basics');
    const [geoSearch, setGeoSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    const [cityOptions, setCityOptions] = useState([]);

    const [showGeoDropdown, setShowGeoDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const [selectedGeoNode, setSelectedGeoNode] = useState(null);
    const [selectedCityObj, setSelectedCityObj] = useState(null);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);

    const [initialBasicData, setInitialBasicData] = useState(null);
    const [initialContentData, setInitialContentData] = useState(null);
    const [initialRules, setInitialRules] = useState(null);
    const [initialCuration, setInitialCuration] = useState(null);
    const [locationNames, setLocationNames] = useState({
        countryName: '',
        regionName: '',
        cityName: '',
        districtName: ''
    });
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
    const [excludeError, setExcludeError] = useState('');
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

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sourceId: null,
        geoNodeType: null,
        countryId: null,
        regionId: null,
        cityId: null,
        districtId: null,
        status: 'Draft',
        mode: 'Hybrid',
        maxHotels: '',
        changedBy: 'Admin',
        isDebug: false,
        defaultSort: 'StarRating DESC',
        template: ''
    });

    useEffect(() => {
        if (propCollectionId) {
            setCollectionId(propCollectionId);
            fetchCollectionById(propCollectionId);
        }
    }, [propCollectionId]);

    // ---------------- TAB NAV ----------------
    const goNext = () => {
        const i = tabOrder.indexOf(activeTab);
        if (i < tabOrder.length - 1) setActiveTab(tabOrder[i + 1]);
    };

    const goBack = () => {
        const i = tabOrder.indexOf(activeTab);
        if (i > 0) setActiveTab(tabOrder[i - 1]);
    };

    useEffect(() => {
        if (!selectedGeoNode?.countryId) {
            setCities([]);
            return;
        }

        const loadCities = async () => {
            const res = await getCitiesByCountryOrRegion({
                countryId: selectedGeoNode.countryId
            });

            setCities(res?.data || []);
        };

        loadCities();
    }, [selectedGeoNode]);

    useEffect(() => {
        const delay = setTimeout(() => {
            loadHotels(hotelSearch, 'pinned');
            loadHotels(excludeSearch, 'exclude');
        }, 400);

        return () => clearTimeout(delay);
    }, [hotelSearch, excludeSearch, selectedCity]);

    useEffect(() => {
        const loadCountries = async () => {
            const res = await getCountriesApi();
            setCountries(res || []);
        };

        loadCountries();
    }, []);

    const loadHotels = async (search, type) => {
        if (!formData.sourceId || !formData.geoNodeType) return;

        const payload = {
            geoNodeType: formData.geoNodeType,
            geoNodeId: formData.sourceId,
            searchTerm: search || ''
        };

        const res = await getHotelsByCity(payload);

        const results = res?.data?.slice(0, 50) || [];

        if (type === 'pinned') setPinnedOptions(results);
        else setExcludeOptions(results);
    };

    // ---------------- LOAD HOTELS ON CURATION TAB MOUNT ----------------
    useEffect(() => {
        if (activeTab !== 'Curation') return;

        const fetchInitialHotels = async () => {
            await loadHotels('', 'pinned');
            await loadHotels('', 'exclude');
        };

        fetchInitialHotels();
    }, [activeTab, selectedGeoNode]);

    // ---------------- RULE FUNCTIONS ----------------

    const addRule = () => {
        if (!ruleField || !ruleValue) return;

        setRules([...rules, { ruleId: null, Field: ruleField, Operator: ruleOperator, Value: ruleValue }]);
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
            toast.error('Hotel already pinned');
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
        if (!selectedExcludeHotel) {
            setExcludeError('Please select a hotel');
            return;
        }

        if (!excludeReason.trim()) {
            setExcludeError('Reason is required to exclude a hotel');
            return;
        }

        if (excludedHotels.some((h) => h.id === selectedExcludeHotel.id)) {
            setExcludeError('Hotel already excluded');
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

        // clear after success
        setSelectedExcludeHotel(null);
        setExcludeSearch('');
        setExcludeReason('');
        setExcludeError('');
    };

    // ---------------- SAVE CONTENT ----------------
    const handleSaveContent = async () => {
        if (collectionId && !isContentChanged()) {
            goNext();
            return;
        }
        if (!collectionId) {
            toast.error('Please save Basics first');
            return;
        }
        const hasInvalidFaq = contentData.faqs?.some((faq) => !faq.question?.trim() || !faq.answer?.trim());

        if (hasInvalidFaq) {
            toast.error('Please complete all FAQs before saving.');
            return;
        }

        const questions = contentData.faqs?.map((f) => f.question.trim().toLowerCase());

        const hasDuplicate = new Set(questions).size !== questions.length;

        if (hasDuplicate) {
            toast.error('Duplicate FAQ questions are not allowed.');
            return;
        }
        setLoading(true);

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
            const response = await saveContent(collectionId, payload);
            toast.success(response?.message || 'Content saved successfully!');

            setInitialContentData({
                header: contentData.header,
                metaTitle: contentData.metaTitle,
                metaDescription: contentData.metaDescription,
                introShortCopy: contentData.introShortCopy,
                introLongCopy: contentData.introLongCopy,
                heroImageUrl: contentData.heroImageUrl,
                badge: contentData.badge,
                faqs: contentData.faqs
            });

            setActiveTab('Rules');
        } catch (error) {
            console.error('Save failed:', error);
            toast.error(error?.message || 'Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBasics = async () => {
        if (collectionId && !isBasicsChanged()) {
            goNext();
            return;
        }

        setLoading(true);
        let geoNodeType = null;
        let sourceId = null;

        if (formData.districtId) {
            geoNodeType = 'District';
            sourceId = formData.districtId;
        } else if (formData.cityId) {
            geoNodeType = 'City';
            sourceId = formData.cityId;
        } else if (formData.regionId) {
            geoNodeType = 'Region';
            sourceId = formData.regionId;
        } else if (formData.countryId) {
            geoNodeType = 'Country';
            sourceId = formData.countryId;
        }

        const collectionObject = {
            SourceId: sourceId,
            GeoNodeType: geoNodeType,
            Name: formData.name,
            Slug: formData.slug,
            Type: formData.mode.toLowerCase(),
            Template: formData.template || null,
            Status: formData.status,
            MaxHotels: formData.maxHotels ? Number(formData.maxHotels) : null,
            DefaultSort: formData.defaultSort || 'StarRating DESC'
        };
        // const collectionObject = {
        //     SourceId: formData.sourceId ? Number(formData.sourceId) : null,
        //     GeoNodeType: formData.geoNodeType,
        //     Name: formData.name,
        //     Slug: formData.slug,
        //     Type: formData.mode.toLowerCase(),
        //     Template: formData.template || null,
        //     Status: formData.status,
        //     MaxHotels: formData.maxHotels ? Number(formData.maxHotels) : null,
        //     DefaultSort: formData.defaultSort || 'StarRating DESC'
        // };

        const payload = {
            collectionId: collectionId ?? null,
            collectionJson: JSON.stringify(collectionObject),
            changedBy: formData.changedBy
        };

        try {
            const response = await upsertCollection(payload);

            const newCollectionId = response?.data?.collectionId;

            if (newCollectionId) {
                setCollectionId(newCollectionId);

                toast.success(response?.message || 'Basics saved successfully!');
                goNext();

                setInitialBasicData({
                    name: formData.name,
                    slug: formData.slug,
                    geoNodeId: formData.sourceId,
                    template: formData.template,
                    maxHotels: formData.maxHotels,
                    status: formData.status
                });
            } else {
                toast.error(response?.message || 'Failed to get collectionId from response');
            }
        } catch (error) {
            console.error('Save Basics failed:', error);
            toast.error(error?.message || 'Failed to save basics');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRules = async () => {
        if (collectionId && !isRulesChanged()) {
            goNext();
            return;
        }
        if (!collectionId) {
            toast.error('Please save Basics first');
            return;
        }

        if (!rules.length) {
            toast.error('Please add at least one rule');
            return;
        }

        try {
            setLoading(true);

            const rulesPayload = rules.map((rule) => ({
                RuleID: rule.RuleID ?? null,
                Field: rule.Field,
                Operator: rule.Operator,
                Value: rule.Value,
                LogicalGroup: 'AND'
            }));

            const payload = {
                collectionId,
                rulesJson: JSON.stringify(rulesPayload)
            };

            const response = await saveRule(payload);

            toast.success(response?.message || 'Rules saved successfully!');
            setInitialRules(rules);
            goNext();
        } catch (error) {
            toast.error(error?.message || 'Failed to save rules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Curation') {
            setGeoSearch('');
            setSelectedGeoNode(null);
            setSelectedCity(null);
            setSelectedCityObj(null);
            setCitySearch('');
            setCityOptions([]);
            setPinnedOptions([]);
            setExcludeOptions([]);
            setHotelSearch('');
            setExcludeSearch('');
        }
    }, [activeTab]);

    const handleStatusUpdate = async (action) => {
        if (!collectionId) {
            toast.error('Collection ID not available');
            return;
        }

        try {
            const response = await updateCollectionStatus(collectionId, action);

            toast.success(
                response?.message || (action === 'publish' ? 'Collection published successfully!' : 'Collection saved as draft!')
            );
            setFormData((prev) => ({
                ...prev,
                status: action === 'publish' ? 'Published' : 'Draft'
            }));

            router.push(ADMIN_ROUTES.collections);
        } catch (error) {
            console.error('Status update failed:', error);
            toast.error(error?.message || 'Failed to update status');
        }
    };

    const handleSaveCuration = async () => {
        if (!collectionId) {
            toast.error('Please save Basics first');
            return;
        }

        // ✅ If nothing added → just move next (no save, no toast)
        if (collectionId && !isCurationChanged()) {
            goNext();
            return;
        }

        try {
            setLoading(true);

            const pinnedPayload = pinnedHotels.map((hotel, index) => ({
                HotelID: hotel.id,
                Position: index + 1,
                PinType: 'FIXED'
            }));

            const excludePayload = excludedHotels.map((hotel) => ({
                HotelID: hotel.id,
                ChainID: null,
                Reason: hotel.reason
            }));

            const payload = {
                collectionId,
                pinnedJson: JSON.stringify(pinnedPayload),
                excludeJson: JSON.stringify(excludePayload)
            };

            const response = await saveCuration(payload);

            toast.success(response?.message || 'Curation saved successfully!');

            setInitialCuration({
                pinned: [...pinnedHotels],
                excluded: [...excludedHotels]
            });

            goNext();
        } catch (error) {
            console.error('Curation save failed:', error);
            toast.error(error?.message || 'Failed to save curation');
        } finally {
            setLoading(false);
        }
    };

    const handleRulesBack = async () => {
        setActiveTab('Rules');
    };

    const handleContentBack = async () => {
        setActiveTab('Content');
    };

    const handlePreviewBack = async () => {
        setActiveTab('Curation');
    };

    const fetchCollectionById = async (idParam) => {
        const idToUse = idParam || collectionId;
        if (!idToUse) return;

        try {
            setLoading(true);

            const res = await getCollectionById(idToUse);
            const data = res?.data;

            if (!data) return;

            const { basicCollection, collectionContent, collectionRules, collectionCuration } = data;

            // ---------------- BASICS ----------------
            const { countryId, regionId, cityId, districtId, countryName, regionName, cityName, districtName, geoNodeType, sourceId } =
                basicCollection || {};

            setFormData((prev) => ({
                ...prev,
                name: basicCollection?.name || '',
                slug: basicCollection?.slug || '',
                sourceId: sourceId || null,
                geoNodeType: geoNodeType || null,

                countryId: countryId || null,
                regionId: regionId || null,
                cityId: cityId || null,
                districtId: districtId || null,

                template: basicCollection?.template || '',
                maxHotels: basicCollection?.maxHotels ?? '',
                status: basicCollection?.status?.toLowerCase() === 'published' ? 'Published' : 'Draft'
            }));

            setInitialBasicData({
                name: basicCollection?.name || '',
                slug: basicCollection?.slug || '',
                sourceId: sourceId || null,
                template: basicCollection?.template || '',
                maxHotels: basicCollection?.maxHotels ?? '',
                status: basicCollection?.status?.toLowerCase() === 'published' ? 'Published' : 'Draft'
            });

            setLocationNames({
                countryName: countryName || '',
                regionName: regionName || '',
                cityName: cityName || '',
                districtName: districtName || ''
            });

            // ---------------- CONTENT ----------------
            let parsedFaqs = [];
            if (collectionContent?.faqsJson) {
                try {
                    parsedFaqs = JSON.parse(collectionContent.faqsJson);
                } catch {
                    parsedFaqs = [];
                }
            }

            setContentData({
                header: collectionContent?.header || '',
                metaTitle: collectionContent?.metaTitle || '',
                metaDescription: collectionContent?.metaDescription || '',
                introShortCopy: collectionContent?.introShortCopy || '',
                introLongCopy: collectionContent?.introLongCopy || '',
                heroImageUrl: collectionContent?.heroImageUrl || '',
                badge: collectionContent?.badge || '',
                faqs: parsedFaqs
            });

            setInitialContentData({
                header: collectionContent?.header || '',
                metaTitle: collectionContent?.metaTitle || '',
                metaDescription: collectionContent?.metaDescription || '',
                introShortCopy: collectionContent?.introShortCopy || '',
                introLongCopy: collectionContent?.introLongCopy || '',
                heroImageUrl: collectionContent?.heroImageUrl || '',
                badge: collectionContent?.badge || '',
                faqs: parsedFaqs
            });

            // ---------------- RULES ----------------
            const rulesArray = collectionRules?.[0]?.rules || [];

            const formattedRules = rulesArray.map((rule) => ({
                RuleID: rule.ruleId ?? null,
                Field: rule.field ?? '',
                Operator: rule.operator ?? '',
                Value: rule.value ?? ''
            }));

            setInitialRules(formattedRules);
            setRules(formattedRules);

            // ---------------- CURATION ----------------
            const pinned = collectionCuration?.[0]?.pinnedHotels || [];
            const excluded = collectionCuration?.[0]?.excludedHotels || [];

            const formattedPinned = pinned.map((hotel) => ({
                id: hotel.hotelID,
                name: hotel.hotelName,
                position: hotel.position,
                pinType: hotel.pinType
            }));

            const formattedExcluded = excluded.map((hotel) => ({
                id: hotel.hotelID,
                name: hotel.hotelName,
                reason: hotel.reason
            }));

            setPinnedHotels(formattedPinned);
            setExcludedHotels(formattedExcluded);

            setInitialCuration({
                pinned: formattedPinned,
                excluded: formattedExcluded
            });
        } catch (error) {
            console.error('Failed to fetch collection:', error);
            toast.error('Failed to fetch collection');
        } finally {
            setLoading(false);
        }
    };

    const handleBasicBack = async () => {
        await fetchCollectionById();
        setActiveTab('Basics');
    };

    const isBasicsChanged = () => {
        if (!initialBasicData) return true;

        return (
            initialBasicData.name !== formData.name ||
            initialBasicData.slug !== formData.slug ||
            initialBasicData.sourceId !== formData.sourceId ||
            initialBasicData.template !== formData.template ||
            Number(initialBasicData.maxHotels) !== Number(formData.maxHotels)
        );
    };

    const isContentChanged = () => {
        if (!initialContentData) return true;

        const currentFaqs = JSON.stringify(contentData.faqs || []);
        const initialFaqs = JSON.stringify(initialContentData.faqs || []);

        return (
            initialContentData.header !== contentData.header ||
            initialContentData.metaTitle !== contentData.metaTitle ||
            initialContentData.metaDescription !== contentData.metaDescription ||
            initialContentData.introShortCopy !== contentData.introShortCopy ||
            initialContentData.introLongCopy !== contentData.introLongCopy ||
            initialContentData.heroImageUrl !== contentData.heroImageUrl ||
            initialContentData.badge !== contentData.badge ||
            initialFaqs !== currentFaqs
        );
    };

    const isRulesChanged = () => {
        if (!initialRules) return true;

        const normalize = (rulesArray) =>
            (rulesArray || []).map((r) => ({
                Field: r.Field,
                Operator: r.Operator,
                Value: r.Value
            }));

        const current = JSON.stringify(normalize(rules));
        const initial = JSON.stringify(normalize(initialRules));

        return current !== initial;
    };

    const isCurationChanged = () => {
        if (!initialCuration) return true;

        const normalizePinned = (arr) =>
            (arr || []).map((h, index) => ({
                id: h.id,
                position: index + 1
            }));

        const normalizeExcluded = (arr) =>
            (arr || []).map((h) => ({
                id: h.id,
                reason: h.reason?.trim() || ''
            }));

        const currentPinned = JSON.stringify(normalizePinned(pinnedHotels));
        const initialPinned = JSON.stringify(normalizePinned(initialCuration.pinned));

        const currentExcluded = JSON.stringify(normalizeExcluded(excludedHotels));
        const initialExcluded = JSON.stringify(normalizeExcluded(initialCuration.excluded));

        return currentPinned !== initialPinned || currentExcluded !== initialExcluded;
    };

    // ---------------- RENDER ----------------
    return (
        <div className="card shadow-sm">
            <ul className="nav collection-tabs mb-4 gap-2">
                {tabOrder.map((tab, index) => {
                    const currentIndex = tabOrder.indexOf(activeTab);
                    const isDisabled = index > currentIndex + 1;

                    return (
                        <li className="nav-item" key={tab}>
                            <button
                                type="button"
                                className={`nav-link px-4 py-2 ${activeTab === tab ? 'active' : ''}`}
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
                        onNext={handleSaveBasics}
                        onBack={goBack}
                        loading={loading}
                        countries={countries}
                        geoSearch={geoSearch}
                        setGeoSearch={setGeoSearch}
                        showGeoDropdown={showGeoDropdown}
                        setShowGeoDropdown={setShowGeoDropdown}
                        selectedGeoNode={selectedGeoNode}
                        setSelectedGeoNode={setSelectedGeoNode}
                        locationNames={locationNames}
                    />
                )}

                {activeTab === 'Content' && (
                    <ContentTab
                        data={contentData}
                        setData={setContentData}
                        onBack={handleBasicBack}
                        onNext={handleSaveContent}
                        loading={loading}
                    />
                )}

                {activeTab === 'Rules' && (
                    <RulesTab
                        rules={rules}
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
                        onNext={handleSaveRules}
                        onBack={handleContentBack}
                        loading={loading}
                    />
                )}

                {activeTab === 'Curation' && (
                    <CurationTab
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
                        setSelectedExcludeHotel={setSelectedExcludeHotel}
                        showPinnedDropdown={showPinnedDropdown}
                        setShowPinnedDropdown={setShowPinnedDropdown}
                        showExcludeDropdown={showExcludeDropdown}
                        setShowExcludeDropdown={setShowExcludeDropdown}
                        geoSearch={geoSearch}
                        setGeoSearch={setGeoSearch}
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
                        addPinnedHotel={addPinnedHotel}
                        addExcludedHotel={addExcludedHotel}
                        moveHotel={moveHotel}
                        onNext={handleSaveCuration}
                        onBack={handleRulesBack}
                        setCityOptions={setCityOptions}
                        loading={loading}
                        countries={countries}
                        cities={cities}
                        excludeError={excludeError}
                        setExcludeError={setExcludeError}
                    />
                )}

                {activeTab === 'Preview' && (
                    <PreviewTab
                        formData={formData}
                        rules={rules}
                        pinnedHotels={pinnedHotels}
                        excludedHotels={excludedHotels}
                        onBack={handlePreviewBack}
                        onSubmit={handleStatusUpdate}
                        loading={loading}
                        locationNames={locationNames}
                    />
                )}
            </div>
        </div>
    );
}
