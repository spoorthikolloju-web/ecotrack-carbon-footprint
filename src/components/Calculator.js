import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { EMISSION_FACTORS } from '../data/constants';
import { sanitizeNumericInput } from '../utils/calculations';

const PERIOD_MULTIPLIERS = { daily: 1, weekly: 7, monthly: 30, annual: 365 };

export default function Calculator({ onSave }) {
  const [inputs, setInputs] = useState({});
  const [period, setPeriod] = useState('monthly');

  const totalKg = useMemo(() => {
    return Object.entries(inputs).reduce((sum, [key, val]) => {
      const [cat, type] = key.split('__');
      const factor = EMISSION_FACTORS[cat]?.[type]?.factor ?? 0;
      return sum + sanitizeNumericInput(val) * factor;
    }, 0);
  }, [inputs]);

  const periodTotal = totalKg * PERIOD_MULTIPLIERS[period];

  const handleChange = useCallback((cat, type, val) => {
    setInputs(prev => ({ ...prev, [`${cat}__${type}`]: val }));
  }, []);

  const customAlert = window.customAlert;
  const handleSave = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const dailyLog = {};
    Object.entries(inputs).forEach(([key, val]) => {
      const [cat, type] = key.split('__');
      const factor = EMISSION_FACTORS[cat]?.[type]?.factor ?? 0;
      const grams = sanitizeNumericInput(val) * factor * 1000;
      if (grams > 0) dailyLog[`${cat}_${type}`] = grams;
    });
    onSave(today, dailyLog);
    customAlert('✅ Saved to your log!');
  }, [inputs, onSave,customAlert]);

  return (
    <main className="calculator" aria-label="Carbon footprint calculator">
      <div className="calc-header">
        <h2>Carbon Footprint Calculator</h2>
        <p>Enter your typical usage to estimate your emissions</p>
        <fieldset className="period-selector" aria-label="Select time period">
          <legend className="sr-only">Time period</legend>
          {Object.keys(PERIOD_MULTIPLIERS).map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="calc-result-banner" role="status" aria-live="polite" aria-label={`Total: ${periodTotal.toFixed(1)} kg CO2 equivalent per ${period}`}>
        <div>
          <span className="result-num">{periodTotal.toFixed(1)}</span>
          <span className="result-unit"> kg CO₂e / {period}</span>
        </div>
        <div className="result-equiv">
          ≈ {Math.ceil((periodTotal * 1000) / 21000)} trees needed to absorb this
        </div>
      </div>

      {Object.entries(EMISSION_FACTORS).map(([cat, items]) => (
        <section key={cat} className="calc-section" aria-labelledby={`section-${cat}`}>
          <h3 id={`section-${cat}`} className="section-title">
            <span aria-hidden="true">
              {cat === 'transport' ? '🚗' : cat === 'home' ? '🏠' : cat === 'food' ? '🍽️' : '🛍️'}
            </span>
            {' '}{cat.charAt(0).toUpperCase() + cat.slice(1)}
          </h3>
          <div className="calc-items">
            {Object.entries(items).map(([type, info]) => {
              const inputId = `input-${cat}-${type}`;
              const currentVal = inputs[`${cat}__${type}`] || '';
              const emission = sanitizeNumericInput(currentVal) * info.factor * PERIOD_MULTIPLIERS[period];
              return (
                <div key={type} className="calc-item">
                  <div className="item-info">
                    <span className="item-icon" aria-hidden="true">{info.icon}</span>
                    <div>
                      <label htmlFor={inputId} className="item-label">{info.label}</label>
                      <span className="item-factor">{info.factor} kg CO₂e per {info.unit}</span>
                    </div>
                  </div>
                  <div className="item-input-group">
                    <input
                      id={inputId}
                      type="number"
                      min="0"
                      max="10000"
                      step="any"
                      placeholder="0"
                      value={currentVal}
                      onChange={e => handleChange(cat, type, e.target.value)}
                      className="item-input"
                      aria-label={`${info.label} quantity in ${info.unit} per ${period === 'daily' ? 'day' : period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year'}`}
                    />
                    <span className="item-unit" aria-hidden="true">
                      {info.unit}/{period === 'daily' ? 'day' : period === 'weekly' ? 'wk' : period === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {currentVal && (
                    <span className="item-emission" aria-label={`${emission.toFixed(1)} kg CO2 equivalent`}>
                      {emission.toFixed(1)} kg
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <button className="save-btn" onClick={handleSave} aria-label="Save these calculations to today's daily log">
        💾 Save to Daily Log
      </button>
    </main>
  );
}

Calculator.propTypes = {
  onSave: PropTypes.func.isRequired,
};
