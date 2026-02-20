'use client';

import { RULE_FIELDS, RULE_OPERATORS, RULE_VALUE_OPTIONS } from '@/lib/constants/ruleConfig';

export default function RulesTab({
    rules,
    setRules,
    ruleField,
    setRuleField,
    ruleOperator,
    setRuleOperator,
    ruleValue,
    setRuleValue,
    formData,
    setFormData,
    addRule,
    removeRule,
    onNext,
    onBack
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className="row">
                {/* ================= Collection Mode ================= */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Collection Mode </label>
                    <select className="form-select" name="mode" value={formData.mode} onChange={handleChange}>
                        <option value="Rule">Rule Based</option>
                        <option value="Curated">Curated</option>
                        <option value="Hybrid">Hybrid (Rules + Pinned)</option>
                    </select>
                </div>

                {/* ================= Max Hotels ================= */}
                <div className="col-12 col-lg-6 mb-3">
                    <label className="form-label">Max Hotels</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        name="maxHotels"
                        value={formData.maxHotels}
                        onChange={handleChange}
                        placeholder="Enter max number of hotels"
                    />
                </div>
            </div>

            {/* ================= RULE BUILDER ================= */}
            {(formData.mode === 'Rule' || formData.mode === 'Hybrid') && (
                <div className="border p-3 rounded-2 mb-3">
                    <h6 className="mb-3">Add Rule</h6>

                    <div className="row g-2">
                        {/* Field */}
                        <div className="col-12 col-md-4">
                            <select className="form-select" value={ruleField} onChange={(e) => setRuleField(e.target.value)}>
                                <option value="">Select Field</option>
                                {RULE_FIELDS.map((field) => (
                                    <option key={field.value} value={field.value}>
                                        {field.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Operator */}
                        <div className="col-12 col-md-3">
                            <select className="form-select" value={ruleOperator} onChange={(e) => setRuleOperator(e.target.value)}>
                                {RULE_OPERATORS.map((op) => (
                                    <option key={op.value} value={op.value}>
                                        {op.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Value */}
                        <div className="col-12 col-md-3">
                            {RULE_VALUE_OPTIONS[ruleField] ? (
                                <select className="form-select" value={ruleValue} onChange={(e) => setRuleValue(e.target.value)}>
                                    <option value="">Select Value</option>
                                    {RULE_VALUE_OPTIONS[ruleField].map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter value"
                                    value={ruleValue}
                                    onChange={(e) => setRuleValue(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Add Button */}
                        <div className="col-12 col-md-2 d-grid">
                            <button type="button" className="btn btn-primary" onClick={addRule}>
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* ================= ADDED RULES ================= */}
                    {rules.length > 0 && (
                        <div className="mt-4">
                            <h6>Added Rules</h6>

                            {rules.map((r, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
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

            {/* ================= MODE INFO MESSAGE ================= */}
            {formData.mode === 'Curated' && (
                <div className="alert alert-info">
                    In Curated mode, rules are disabled. You can pin hotels manually in the Curation tab.
                </div>
            )}

            {/* ================= NAVIGATION ================= */}
            <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
                    Back
                </button>

                <button type="button" className="btn btn-primary" onClick={onNext}>
                    Next
                </button>
            </div>
        </>
    );
}
