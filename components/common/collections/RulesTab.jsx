'use client';

import { getCategoryList } from '@/lib/api/admin/collectionapi';
import { RULE_FIELDS, RULE_VALUE_OPTIONS, getOperatorsForField } from '@/lib/constants/ruleConfig';
import { useEffect, useState } from 'react';

export default function RulesTab({
    rules,
    ruleField,
    setRuleField,
    ruleOperator,
    setRuleOperator,
    ruleValue,
    setRuleValue,
    formData,
    setFormData,
    selectedCities = [],
    addRule,
    removeRule,
    onNext,
    onBack,
    loading
}) {
    const [errors, setErrors] = useState({});
    const operators = ruleField ? getOperatorsForField(ruleField) : [];
    const [amenities, setAmenities] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategoryList();
                setAmenities(res?.data.amenities || []);
                setPropertyTypes(res?.data.propertyTypes || []);
                setBrands(res?.data.brands || []);
            } catch (err) {
                console.error('Error fetching categories', err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextClick = () => {
        onNext();
    };

    const handleAddRule = () => {
        const newErrors = {};

        // if (!ruleField) {
        //     newErrors.ruleField = 'Please select a field';
        // }

        // if (ruleField !== 'GeoContainment' && (!ruleValue || !ruleValue.toString().trim())) {
        //     newErrors.ruleValue = 'Please enter/select a value';
        // }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        addRule(); // call parent function
    };

    const geoNodeLabel =
        selectedCities?.length > 0
            ? selectedCities.map((city) => city.name).join(', ')
            : formData.geoNodeName || 'Select GeoNode in Basics tab';

    return (
        <>
            <div className="row">
                {/* ================= Collection Mode ================= */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Collection Mode </label>
                    <select className="form-select" name="mode" value={formData.mode} onChange={handleChange}>
                        <option value="Rule">Rule Based</option>
                        {/* <option value="Curated">Curated</option> */}
                        <option value="Hybrid">Hybrid (Rules + Pinned)</option>
                    </select>
                </div>
            </div>

            {/* ================= RULE BUILDER ================= */}
            {(formData.mode === 'Rule' || formData.mode === 'Hybrid') && (
                <div className="border p-3 rounded-2 mb-3">
                    <h6 className="mb-3">Add Rule</h6>

                    {/* <div className="row g-2"> */}
                    <div className="row g-2 align-items-start">
                        {/* Field */}
                        <div className="col-12 col-md-4">
                            {/* <select className="form-select" value={ruleField} onChange={(e) => setRuleField(e.target.value)}> */}
                            <select
                                className="form-select"
                                // className={`form-select ${errors.ruleField ? 'is-invalid' : ''}`}
                                value={ruleField}
                                onChange={(e) => {
                                    const field = e.target.value;
                                    setRuleField(field);

                                    const ops = getOperatorsForField(field);
                                    setRuleOperator(ops[0]?.value || '');

                                if (field === 'GeoContainment') {
                                        setRuleValue(geoNodeLabel || '');
                                    } else {
                                        setRuleValue('');
                                    }

                                    setErrors((prev) => ({ ...prev, ruleField: null }));
                                }}
                            >
                                <option value="">Select Field</option>
                                {RULE_FIELDS.map((field) => (
                                    <option key={field.value} value={field.value}>
                                        {field.label}
                                    </option>
                                ))}
                            </select>
                            {errors.ruleField && <div className="invalid-feedback">{errors.ruleField}</div>}
                        </div>

                        {/* Operator */}
                        <div className="col-12 col-md-3">
                            <select className="form-select" value={ruleOperator} onChange={(e) => setRuleOperator(e.target.value)}>
                                {operators.map((op) => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-3">
                            {ruleField === 'GeoContainment' ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.geoNodeType ? geoNodeLabel : 'Select GeoNode in Basics tab'}
                                    disabled
                                />
                            ) : ruleField === 'Amenities' ? (
                                <>
                                    <select
                                        className="form-select"
                                        // className={`form-select ${errors.ruleValue ? 'is-invalid' : ''}`}
                                        value={ruleValue}
                                        onChange={(e) => {
                                            setRuleValue(e.target.value);
                                            setErrors((prev) => ({ ...prev, ruleValue: null }));
                                        }}
                                    >
                                        <option value="">Select Value</option>
                                        {amenities.map((amen) => (
                                            <option key={amen.categoryId} value={amen.categoryName}>
                                                {amen.categoryName}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.ruleValue && <div className="invalid-feedback">{errors.ruleValue}</div>}
                                </>
                            ) : ruleField === 'PropertyType' ? (
                                <>
                                    <select
                                        className="form-select"
                                        // className={`form-select ${errors.ruleValue ? 'is-invalid' : ''}`}
                                        value={ruleValue}
                                        onChange={(e) => {
                                            setRuleValue(e.target.value);
                                            setErrors((prev) => ({ ...prev, ruleValue: null }));
                                        }}
                                    >
                                        <option value="">Select Value</option>
                                        {propertyTypes.map((prop) => (
                                            <option key={prop.propertyTypeId} value={prop.propertyTypeName}>
                                                {prop.propertyTypeName}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.ruleValue && <div className="invalid-feedback">{errors.ruleValue}</div>}
                                </>
                            ) : ruleField === 'Brand' ? (
                                <>
                                    <select
                                        className="form-select"
                                        // className={`form-select ${errors.ruleValue ? 'is-invalid' : ''}`}
                                        value={ruleValue}
                                        onChange={(e) => {
                                            setRuleValue(e.target.value);
                                            setErrors((prev) => ({ ...prev, ruleValue: null }));
                                        }}
                                    >
                                        <option value="">Select Value</option>
                                        {brands.map((brand) => (
                                            <option key={brand.brandId} value={brand.brandName}>
                                                {brand.brandName}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.ruleValue && <div className="invalid-feedback">{errors.ruleValue}</div>}
                                </>
                            ) : RULE_VALUE_OPTIONS[ruleField] ? (
                                <>
                                    <select
                                        className="form-select"
                                        // className={`form-select ${errors.ruleValue ? 'is-invalid' : ''}`}
                                        value={ruleValue}
                                        onChange={(e) => {
                                            setRuleValue(e.target.value);
                                            setErrors((prev) => ({ ...prev, ruleValue: null }));
                                        }}
                                    >
                                        <option value="">Select Value</option>
                                        {RULE_VALUE_OPTIONS[ruleField].map((val) => (
                                            <option key={val} value={val}>
                                                {val}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.ruleValue && <div className="invalid-feedback">{errors.ruleValue}</div>}
                                </>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className="form-select"
                                        // className={`form-control ${errors.ruleValue ? 'is-invalid' : ''}`}
                                        value={ruleValue}
                                        onChange={(e) => {
                                            setRuleValue(e.target.value);
                                            setErrors((prev) => ({ ...prev, ruleValue: null }));
                                        }}
                                    />

                                    {errors.ruleValue && <div className="invalid-feedback">{errors.ruleValue}</div>}
                                </>
                            )}
                        </div>

                        {/* Add Button */}
                        <div className="col-12 col-md-2 d-flex align-items-start">
                            <button type="button" className="theme-button-orange rounded-2 w-100 h-100" onClick={handleAddRule}>
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* ================= ADDED RULES ================= */}
                    {rules.length > 0 && (
                        <div className="mt-4">
                            <h6>Added Rules</h6>

                            {rules.map((r, index) => (
                                <div
                                    key={index}
                                    className={`d-flex justify-content-between align-items-center py-2 ${rules.length > 1 && index !== rules.length - 1 ? 'border-bottom' : ''}`}
                                >
                                    <div>
                                        {r.Field} {r.Operator} {r.Value}
                                    </div>

                                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeRule(index)}>
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ================= NAVIGATION ================= */}
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>

                <button
                    className="theme-button-orange rounded-2 d-flex align-items-center justify-content-center"
                    onClick={handleNextClick}
                    type="button"
                    disabled={loading}
                    style={{ minWidth: '100px' }}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {/* Loading... */}
                        </>
                    ) : (
                        'Next'
                    )}
                </button>
            </div>
        </>
    );
}
