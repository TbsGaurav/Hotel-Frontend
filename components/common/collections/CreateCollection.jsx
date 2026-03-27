'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getCitiesByCountryOrRegion,
    getHotelsByCity,
    getcollectionHotelsByMultipleNodes,
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

const slugifyText = (value = '') =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const getSlugParts = (slug = '') => {
    const normalized = String(slug || '').replace(/^\/+/, '');
    const parts = normalized.split('/').filter(Boolean);

    if (parts.length <= 1) {
        return {
            namespace: '',
            base: normalized
        };
    }

    return {
        namespace: parts[0] || '',
        base: parts.slice(1).join('/')
    };
};

const extractHotelArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.hotels)) return payload.hotels;
    if (Array.isArray(payload?.collectionPreviewHotels)) return payload.collectionPreviewHotels;
    return [];
};

const extractHotelPagination = (payload) => {
    const source = payload?.data && typeof payload.data === 'object' ? payload.data : payload || {};

    return {
        pageNumber: source?.pageNumber ?? null,
        pageSize: source?.pageSize ?? null,
        totalCount: source?.totalCount ?? null,
        totalPages: source?.totalPages ?? null,
        hasNextPage: source?.hasNextPage ?? null
    };
};

const mergeHotelsById = (existingHotels = [], nextHotels = []) => {
    const hotelMap = new Map();

    [...existingHotels, ...nextHotels].forEach((hotel) => {
        if (hotel?.id && !hotelMap.has(hotel.id)) {
            hotelMap.set(hotel.id, hotel);
        }
    });

    return Array.from(hotelMap.values());
};

export default function CreateCollection({ collectionId: propCollectionId }) {
    const router = useRouter();
    const [collectionId, setCollectionId] = useState(propCollectionId || null);
    const tabOrder = ['Basics', 'Content', 'Rules', 'Curation', 'Preview'];
    const [activeTab, setActiveTab] = useState('Basics');
    const [geoSearch, setGeoSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const [hotelList, setHotelList] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [showGeoDropdown, setShowGeoDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const [selectedGeoNode, setSelectedGeoNode] = useState(null);
    const [selectedCityObj, setSelectedCityObj] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [slugCityId, setSlugCityId] = useState(null);
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
    const [includedHotelIds, setIncludedHotelIds] = useState([]);
    const [pinnedHotels, setPinnedHotels] = useState([]);
    const [excludedHotels, setExcludedHotels] = useState([]);
    const [pinnedOptions, setPinnedOptions] = useState([]);
    const [excludeOptions, setExcludeOptions] = useState([]);
    const [showPinnedDropdown, setShowPinnedDropdown] = useState(false);
    const [showExcludeDropdown, setShowExcludeDropdown] = useState(false);
    const [newlyAddedHotels, setNewlyAddedHotels] = useState([]);

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedHotels, setSelectedHotels] = useState([]);
    const hasInitializedCurationSelectionRef = useRef(false);
    const [hotelPagination, setHotelPagination] = useState({
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false
    });
    const [hotelLoadingMore, setHotelLoadingMore] = useState(false);
    const hotelLoadMoreLockRef = useRef(false);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        sourceId: null,
        geoNodeType: null,
        geoNodeName: null,
        countryId: null,
        regionId: null,
        cityId: null,
        slugBase: '',
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
            hasInitializedCurationSelectionRef.current = false;
            setCollectionId(propCollectionId);
            fetchCollectionById(propCollectionId);
        }
    }, [propCollectionId]);

    useEffect(() => {
        if (!selectedCities.length) {
            if (slugCityId !== null) {
                setSlugCityId(null);
            }
            return;
        }
        if (slugCityId !== null && !selectedCities.some((city) => city.cityId === slugCityId)) {
            setSlugCityId(null);
        }
    }, [selectedCities, slugCityId]);

    useEffect(() => {
        if (collectionId) return;

        const baseSlug = formData.slugBase?.trim();
        if (!baseSlug) return;

        const namespaceCity = selectedCities.find((city) => city.cityId === slugCityId) || null;
        const namespace = namespaceCity ? slugifyText(namespaceCity.name || '') : '';
        const nextSlug = namespace ? `${namespace}/${baseSlug}` : baseSlug;

        if (formData.slug !== nextSlug) {
            setFormData((prev) => ({
                ...prev,
                slug: nextSlug
            }));
        }
    }, [collectionId, formData.slugBase, formData.slug, selectedCities, slugCityId]);

    useEffect(() => {
        if (!selectedCities.length) return;

        const cityLabel = selectedCities.map((city) => city.name).join(', ');
        if (formData.geoNodeName !== cityLabel) {
            setFormData((prev) => ({
                ...prev,
                geoNodeName: cityLabel
            }));
        }
    }, [selectedCities, formData.geoNodeName]);

    // Update selected hotels when hotel list loads and we have included IDs
    useEffect(() => {
        if (hotelList.length > 0 && includedHotelIds.length > 0) {
            // Filter included IDs to only those that exist in the current hotel list
            const validIncludedIds = includedHotelIds.filter((id) => hotelList.some((hotel) => hotel.id === id));
            setSelectedHotels(validIncludedIds);
        }
    }, [hotelList, includedHotelIds]);

    // ---------------- TAB NAV ----------------
    const goNext = () => {
        const i = tabOrder.indexOf(activeTab);
        if (i < tabOrder.length - 1) setActiveTab(tabOrder[i + 1]);
    };

    const goBack = async () => {
        const i = tabOrder.indexOf(activeTab);
        if (i > 0) {
            const prevTab = tabOrder[i - 1];

            // Fetch data when going back to certain tabs
            if (prevTab === 'Basics' || prevTab === 'Content' || prevTab === 'Rules' || prevTab === 'Curation') {
                setLoading(true);
                try {
                    await fetchCollectionById();
                } finally {
                    setLoading(false);
                }
            }

            setActiveTab(prevTab);
        }
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
            if (activeTab !== 'Curation') return;

            setHotelPagination((prev) => ({
                ...prev,
                pageNumber: 1,
                hasNextPage: false
            }));
            loadHotels({ search: hotelSearch, pageNumber: 1, append: false });
        }, 400);

        return () => clearTimeout(delay);
    }, [hotelSearch, selectedCity, activeTab, collectionId, formData.sourceId, formData.geoNodeType]);

    useEffect(() => {
        const loadCountries = async () => {
            const res = await getCountriesApi();
            setCountries(res || []);
        };

        loadCountries();
    }, []);

    const loadHotels = async ({ search = '', pageNumber = 1, append = false } = {}) => {
        let results = [];
        let pagination = {};

        if (collectionId) {
            try {
                const previewRes = await getcollectionHotelsByMultipleNodes(collectionId, {
                    pageNumber,
                    pageSize: 20,
                    searchTerm: search || ''
                });
                results = extractHotelArray(previewRes?.data);
                pagination = extractHotelPagination(previewRes);
            } catch (error) {
                console.error('Failed to load preview hotels:', error);
            }
        } else if (formData.sourceId && formData.geoNodeType) {
            try {
                const res = await getHotelsByCity({
                    geoNodeType: formData.geoNodeType,
                    geoNodeId: formData.sourceId,
                    searchTerm: search || '',
                    pageNumber,
                    pageSize: 20
                });

                results = extractHotelArray(res?.data);
                pagination = extractHotelPagination(res);
            } catch (error) {
                console.error('Failed to load hotels by geo-node:', error);
                toast.error('Unable to load hotels for the selected geo-node');
            }
        }

        const normalizedResults = results.map(normalizeGlobalHotel).filter((hotel) => hotel?.id);

        setHotelList((prev) => {
            const baseHotels = append ? prev : newlyAddedHotels;
            return mergeHotelsById(baseHotels, normalizedResults);
        });

        const resolvedPageSize = pagination.pageSize ?? 20;
        const resolvedPageNumber = pagination.pageNumber ?? pageNumber;
        const resolvedTotalPages =
            pagination.totalPages ??
            (pagination.totalCount !== null && pagination.totalCount !== undefined
                ? Math.ceil(Number(pagination.totalCount) / resolvedPageSize)
                : null);

        setHotelPagination({
            pageNumber: resolvedPageNumber,
            pageSize: resolvedPageSize,
            totalCount: pagination.totalCount ?? 0,
            totalPages: resolvedTotalPages ?? 0,
            hasNextPage:
                pagination.hasNextPage ??
                (resolvedTotalPages ? resolvedPageNumber < resolvedTotalPages : normalizedResults.length === resolvedPageSize)
        });
        // setPinnedHotels(results);

        // if (type === 'pinned') setPinnedOptions(results);
        // else setExcludeOptions(results);
    };

    // ---------------- LOAD HOTELS ON CURATION TAB MOUNT ----------------
    useEffect(() => {
        if (activeTab !== 'Curation') return;

        const fetchInitialHotels = async () => {
            setHotelPagination({
                pageNumber: 1,
                pageSize: 20,
                totalCount: 0,
                totalPages: 0,
                hasNextPage: false
            });
            await loadHotels({ search: hotelSearch, pageNumber: 1, append: false });
        };

        fetchInitialHotels();
    }, [activeTab, selectedGeoNode, collectionId, formData.sourceId, formData.geoNodeType]);

    useEffect(() => {
        if (activeTab !== 'Curation') return;
        if (hasInitializedCurationSelectionRef.current) return;
        if (!hotelList.length) return;

        const effectiveMaxHotels = Number(formData.maxHotels) || 20;

        const initialSelection = includedHotelIds.length > 0 ? includedHotelIds : hotelList.slice(0, effectiveMaxHotels).map((hotel) => hotel.id);

        setSelectedHotels(initialSelection);
        hasInitializedCurationSelectionRef.current = true;
    }, [activeTab, hotelList, includedHotelIds, formData.maxHotels]);

    const handleLoadMoreHotels = async () => {
        if (hotelLoadMoreLockRef.current || hotelLoadingMore || !hotelPagination.hasNextPage) return;

        const nextPage = (hotelPagination.pageNumber || 1) + 1;
        hotelLoadMoreLockRef.current = true;
        setHotelLoadingMore(true);

        try {
            await loadHotels({
                search: hotelSearch,
                pageNumber: nextPage,
                append: true
            });
        } finally {
            setHotelLoadingMore(false);
            hotelLoadMoreLockRef.current = false;
        }
    };

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
        // ✅ CHECK IF CONTENT IS EMPTY
        const isEmptyContent =
            !contentData.header &&
            !contentData.metaTitle &&
            !contentData.metaDescription &&
            !contentData.introShortCopy &&
            !contentData.introLongCopy &&
            !contentData.heroImageUrl &&
            !contentData.badge &&
            (!contentData.faqs || contentData.faqs.length === 0);

        // ✅ IF EMPTY → SKIP API
        if (isEmptyContent) {
            goNext();
            return;
        }

        // ✅ IF NO CHANGE → SKIP API
        if (collectionId && !isContentChanged()) {
            goNext();
            return;
        }

        const hasInvalidFaq = contentData.faqs?.some((faq) => !faq.question?.trim() || !faq.answer?.trim());

        // if (hasInvalidFaq) {
        //     toast.error('Please complete all FAQs before saving.');
        //     return;
        // }

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

        const selectedCityIds = selectedCities.map((city) => city.cityId);
        const sourceIds = selectedCityIds.length > 0 ? selectedCityIds : sourceId ? [sourceId] : [];
        const selectedSlugCity = selectedCities.find((city) => city.cityId === slugCityId) || null;

        const collectionObject = {
            SourceId: sourceIds,
            GeoNodeType: geoNodeType,
            Name: formData.name,
            Slug: formData.slug,
            Type: formData.mode.toLowerCase(),
            Template: formData.template || null,
            Status: formData.status,
            MaxHotels: formData.maxHotels ? Number(formData.maxHotels) : null,
            DefaultSort: formData.defaultSort || 'StarRating DESC',
            UrlCityId: selectedSlugCity?.cityId ?? null
        };
        const collectionJson = JSON.stringify(collectionObject);

        const payload = {
            collectionId: collectionId ?? null,
            collectionJson,
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
                    status: formData.status,
                    cityIds: selectedCityIds,
                    urlCityId: selectedSlugCity?.cityId ?? null
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

        if (!rules || rules.length === 0) {
            goNext();
            return;
        }

        if (collectionId && !isRulesChanged()) {
            goNext();
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

            // Include only checked hotels
            const includePayload = selectedHotels.map((hotelId) => ({
                HotelID: hotelId
            }));

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
                includeJson: JSON.stringify(includePayload),
                pinnedJson: JSON.stringify(pinnedPayload),
                excludeJson: JSON.stringify(excludePayload)
            };

            const response = await saveCuration(payload);
            toast.success(response?.message || 'Curation saved successfully!');

            setInitialCuration({
                selectedHotels: [...selectedHotels],
                pinned: [...pinnedHotels],
                excluded: [...excludedHotels]
            });
            setNewlyAddedHotels([]);

            goNext();
        } catch (error) {
            console.error('Curation save failed:', error);
            toast.error(error?.message || 'Failed to save curation');
        } finally {
            setLoading(false);
        }
    };

    const handleRulesBack = async () => {
        setLoading(true);
        try {
            await fetchCollectionById();
        } finally {
            setLoading(false);
        }
        setActiveTab('Rules');
    };

    const handleContentBack = async () => {
        setLoading(true);
        try {
            await fetchCollectionById();
        } finally {
            setLoading(false);
        }
        setActiveTab('Content');
    };

    const handlePreviewBack = async () => {
        setLoading(true);
        try {
            await fetchCollectionById();
        } finally {
            setLoading(false);
        }
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
            const basic = Array.isArray(basicCollection) ? basicCollection[0] || {} : basicCollection || {};
            const {
                countryId,
                regionId,
                cityId,
                districtId,
                countryName,
                regionName,
                cityName,
                districtName,
                geoNodeType,
                sourceId,
                cities
            } = basic;

            const parsedSourceIds = String(sourceId || '')
                .split(',')
                .map((id) => Number(String(id).trim()))
                .filter(Boolean);

            const parsedCityNames = String(cityName || '')
                .split(',')
                .map((name) => name.trim())
                .filter(Boolean);

            const mappedCities =
                cities && cities.length > 0
                    ? cities.map((city) => ({
                          cityId: city.cityId,
                          name: city.cityName
                      }))
                    : parsedSourceIds.length > 0
                      ? parsedSourceIds.map((id, index) => ({
                            cityId: id,
                            name: parsedCityNames[index] || ''
                        }))
                      : cityId
                        ? [
                              {
                                  cityId,
                                  name: cityName || ''
                              }
                          ]
                        : [];
            const slugParts = getSlugParts(basicCollection?.slug || '');
            const matchedSlugCity = mappedCities.find((city) => slugifyText(city.name) === slugParts.namespace);

            setFormData((prev) => ({
                ...prev,
                name: basic.name || '',
                slug: basic.slug || '',
                slugBase: slugParts.base || basic.slug || '',
                sourceId: parsedSourceIds[0] || sourceId || null,
                geoNodeType: geoNodeType || null,

                countryId: countryId || null,
                regionId: regionId || null,
                cityId: mappedCities[0]?.cityId || cityId || null,
                districtId: districtId || null,

                template: basic.template || '',
                maxHotels: basic.maxHotels ?? '',
                status: basic.status?.toLowerCase() === 'published' ? 'Published' : 'Draft'
            }));

            setSelectedCities(mappedCities);
            setSlugCityId(matchedSlugCity?.cityId ?? mappedCities[0]?.cityId ?? null);

            setInitialBasicData({
                name: basic.name || '',
                slug: basic.slug || '',
                sourceId: parsedSourceIds[0] || sourceId || null,
                template: basic.template || '',
                maxHotels: basic.maxHotels ?? '',
                status: basic.status?.toLowerCase() === 'published' ? 'Published' : 'Draft',
                cityIds: mappedCities.map((city) => city.cityId),
                urlCityId: matchedSlugCity?.cityId ?? null
            });

            setLocationNames({
                countryName: countryName || '',
                regionName: regionName || '',
                cityName: mappedCities.map((city) => city.name).join(', ') || cityName || '',
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
            const included = collectionCuration?.[0]?.includedHotels || []; // Get included hotels

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

            const includedIds = included.map((hotel) => hotel.hotelID);

            setPinnedHotels(formattedPinned);
            setExcludedHotels(formattedExcluded);
            setIncludedHotelIds(includedIds);
            setNewlyAddedHotels([]);

            // Important: Set selectedHotels after hotelList is loaded
            // We'll need to wait for hotelList to be populated
            if (hotelList.length > 0) {
                setSelectedHotels(includedIds.filter((id) => hotelList.some((hotel) => hotel.id === id)));
            } else {
                // If hotelList isn't loaded yet, just store the IDs and they'll be applied when hotelList loads
                setSelectedHotels(includedIds);
            }

            setInitialCuration({
                selectedHotels: [...includedIds],
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
        setLoading(true);
        try {
            await fetchCollectionById();
        } finally {
            setLoading(false);
        }
        setActiveTab('Basics');
    };

    const isBasicsChanged = () => {
        if (!initialBasicData) return true;

        const currentCityIds = JSON.stringify((selectedCities || []).map((city) => city.cityId));
        const initialCityIds = JSON.stringify(initialBasicData.cityIds || []);

        return (
            initialBasicData.name !== formData.name ||
            initialBasicData.slug !== formData.slug ||
            initialBasicData.sourceId !== formData.sourceId ||
            initialBasicData.template !== formData.template ||
            Number(initialBasicData.maxHotels) !== Number(formData.maxHotels) ||
            currentCityIds !== initialCityIds ||
            (initialBasicData.urlCityId ?? null) !== (slugCityId ?? null)
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

        const currentSelected = JSON.stringify(selectedHotels);
        const initialSelected = JSON.stringify(initialCuration.selectedHotels || []);

        return currentPinned !== initialPinned || currentExcluded !== initialExcluded || currentSelected !== initialSelected;
    };

    const normalizeGlobalHotel = (hotel) => ({
        id: hotel?.id ?? hotel?.hotelID ?? hotel?.hotelId ?? hotel?.ID ?? null,
        name: hotel?.name ?? hotel?.hotelName ?? hotel?.Name ?? '',
        cityId: hotel?.cityId ?? hotel?.cityID ?? hotel?.CityID ?? null,
        cityName: hotel?.cityName ?? hotel?.city ?? hotel?.CityName ?? '',
        address: hotel?.address ?? hotel?.Address ?? '',
        stars: hotel?.stars ?? hotel?.Stars ?? null,
        reviewScore: hotel?.reviewScore ?? hotel?.ReviewScore ?? null
    });

    const handleAddGlobalHotel = (hotel) => {
        const normalizedHotel = normalizeGlobalHotel(hotel);

        if (!normalizedHotel.id) {
            toast.error('Unable to add this hotel');
            return;
        }

        const effectiveMaxHotels = Number(formData.maxHotels) || 20;

        const alreadySelected =
            selectedHotels.includes(normalizedHotel.id) ||
            hotelList.some((item) => item.id === normalizedHotel.id) ||
            pinnedHotels.some((item) => item.id === normalizedHotel.id);

        if (alreadySelected) {
            return;
        }

        if (selectedHotels.length >= effectiveMaxHotels) {
            toast.error(`You can only select up to ${effectiveMaxHotels} hotels`);
            return;
        }

        setHotelList((prev) => [normalizedHotel, ...prev.filter((item) => item.id !== normalizedHotel.id)]);
        setSelectedHotels((prev) => [...prev, normalizedHotel.id]);
        setNewlyAddedHotels((prev) => (prev.some((item) => item.id === normalizedHotel.id) ? prev : [...prev, normalizedHotel]));
    };

    // if (loading && collectionId) {
    //     return (
    //         <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
    //             <div className="spinner-border text-primary" role="status" />
    //         </div>
    //     );
    // }
    function BarsLoader() {
        return (
            <div className="bars-loader">
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    }
    // ---------------- RENDER ----------------
    return (
        <div className="card shadow-sm position-relative">
            <ul className="nav collection-tabs mb-4 gap-2">
                {tabOrder.map((tab) => {
                    return (
                        <li className="nav-item" key={tab}>
                            <button
                                type="button"
                                className={`nav-link px-4 py-2 ${activeTab === tab ? 'active' : ''}`}
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

            {loading && (
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
            )}
            <div className="card-body">
                {activeTab === 'Basics' && (
                    <BasicsTab
                        formData={formData}
                        setFormData={setFormData}
                        selectedCities={selectedCities}
                        setSelectedCities={setSelectedCities}
                        slugCityId={slugCityId}
                        setSlugCityId={setSlugCityId}
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
                        isEdit={!!collectionId}
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
                        selectedCities={selectedCities}
                        addRule={addRule}
                        removeRule={removeRule}
                        onNext={handleSaveRules}
                        onBack={handleContentBack}
                        loading={loading}
                    />
                )}

                {activeTab === 'Curation' && (
                    <CurationTab
                        hotelList={hotelList}
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
                        maxHotels={formData.maxHotels}
                        selectedHotels={selectedHotels}
                        setSelectedHotels={setSelectedHotels}
                        includedHotelIds={includedHotelIds}
                        newlyAddedHotels={newlyAddedHotels}
                        setNewlyAddedHotels={setNewlyAddedHotels}
                        onAddGlobalHotel={handleAddGlobalHotel}
                        onLoadMoreHotels={handleLoadMoreHotels}
                        hasMoreHotels={hotelPagination.hasNextPage}
                        loadingMoreHotels={hotelLoadingMore}
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
                        selectedCities={selectedCities}
                        slugCityId={slugCityId}
                    />
                )}
            </div>
        </div>
    );
}
