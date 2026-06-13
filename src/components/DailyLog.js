import { useState } from 'react';
import { EMISSION_FACTORS } from '../data/constants';

const QUICK_ACTIONS = [
  { label: "Drove car 10km", cat: "transport", type: "car_petrol", qty: 10, icon: "🚗" },
  { label: "Took bus 5km", cat: "transport", type: "bus", qty: 5, icon: "🚌" },
  { label: "Home electricity 5kWh", cat: "home", type: "electricity", qty: 5, icon: "💡" },
  { label: "Ate beef meal", cat: "food", type: "beef", qty: 0.2, icon: "🥩" },
  { label: "Ate chicken meal", cat: "food", type: "chicken", qty: 0.15, icon: "🍗" },
  { label: "Ate vegetarian meal", cat: "food", type: "vegetables", qty: 0.3, icon: "🥗" },
  { label: "Ordered online", cat: "shopping", type: "online_shopping", qty: 1, icon: "📦" },
  { label: "Train commute 20km", cat: "transport", type: "train", qty: 20, icon: "🚆" },
  { label: "Cooked with LPG", cat: "home", type: "lpg", qty: 0.3, icon: "🍳" },
  { label: "Ate rice meal", cat: "food", type: "rice", qty: 0.3, icon: "🍚" },
];

export default function DailyLog({ logs, onSave }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [custom, setCustom] = useState({ cat: 'transport', type: 'car_petrol', qty: '' });

  const todayLog = logs[selectedDate] || {};
  const dayTotal = Object.values(todayLog).reduce((a, b) => a + b, 0);

  const addQuick = (action) => {
    const grams = action.qty * EMISSION_FACTORS[action.cat][action.type].factor * 1000;
    const key = `${action.cat}_${action.type}`;
    const updated = { ...todayLog, [key]: (todayLog[key] || 0) + grams };
    onSave(selectedDate, updated);
  };

  const addCustom = () => {
    if (!custom.qty || custom.qty <= 0) return;
    const factor = EMISSION_FACTORS[custom.cat][custom.type]?.factor || 0;
    const grams = parseFloat(custom.qty) * factor * 1000;
    const key = `${custom.cat}_${custom.type}`;
    const updated = { ...todayLog, [key]: (todayLog[key] || 0) + grams };
    onSave(selectedDate, updated);
    setCustom(prev => ({ ...prev, qty: '' }));
  };

  const removeEntry = (key) => {
    const updated = { ...todayLog };
    delete updated[key];
    onSave(selectedDate, updated);
  };

  const getCatInfo = (key) => {
    const [cat, ...rest] = key.split('_');
    const type = rest.join('_');
    return EMISSION_FACTORS[cat]?.[type];
  };

  return (
    <div className="daily-log">
      <div className="log-header">
        <h2>Daily Activity Log</h2>
        <input type="date" value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="date-picker" max={new Date().toISOString().split('T')[0]} />
      </div>

      <div className="day-summary">
        <span>Total for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}:</span>
        <strong>{(dayTotal / 1000).toFixed(2)} kg CO₂e</strong>
      </div>

      <div className="quick-add">
        <h3>Quick Add</h3>
        <div className="quick-grid">
          {QUICK_ACTIONS.map((action, i) => (
            <button key={i} className="quick-btn" onClick={() => addQuick(action)}>
              <span>{action.icon}</span>
              <span>{action.label}</span>
              <span className="quick-emission">
                +{(action.qty * EMISSION_FACTORS[action.cat][action.type].factor).toFixed(2)} kg
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="custom-add">
        <h3>Custom Entry</h3>
        <div className="custom-form">
          <select value={custom.cat} onChange={e => setCustom({ cat: e.target.value, type: Object.keys(EMISSION_FACTORS[e.target.value])[0], qty: '' })} className="custom-select">
            {Object.keys(EMISSION_FACTORS).map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <select value={custom.type} onChange={e => setCustom(prev => ({ ...prev, type: e.target.value }))} className="custom-select">
            {Object.entries(EMISSION_FACTORS[custom.cat]).map(([type, info]) => (
              <option key={type} value={type}>{info.label}</option>
            ))}
          </select>
          <input type="number" placeholder={`Amount (${EMISSION_FACTORS[custom.cat][custom.type]?.unit})`}
            value={custom.qty} onChange={e => setCustom(prev => ({ ...prev, qty: e.target.value }))}
            className="custom-input" min="0" />
          <button className="add-btn" onClick={addCustom}>+ Add</button>
        </div>
      </div>

      <div className="log-entries">
        <h3>Today's Activities</h3>
        {Object.keys(todayLog).length === 0 ? (
          <p className="empty-log">No activities logged yet. Use Quick Add above!</p>
        ) : (
          <div className="entries-list">
            {Object.entries(todayLog).map(([key, grams]) => {
              const info = getCatInfo(key);
              return (
                <div key={key} className="entry-item">
                  <span className="entry-icon">{info?.icon || '📌'}</span>
                  <span className="entry-label">{info?.label || key}</span>
                  <span className="entry-value">{(grams / 1000).toFixed(3)} kg CO₂e</span>
                  <button className="remove-btn" onClick={() => removeEntry(key)}>✕</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="log-history">
        <h3>Recent Days</h3>
        <div className="history-list">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const dayData = logs[key];
            const total = dayData ? Object.values(dayData).reduce((a, b) => a + b, 0) : 0;
            return (
              <div key={key} className={`history-item ${key === selectedDate ? 'selected' : ''}`}
                onClick={() => setSelectedDate(key)}>
                <span>{d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}</span>
                <div className="history-bar-wrap">
                  <div className="history-bar" style={{ width: `${Math.min(total / 50, 100)}%` }} />
                </div>
                <span>{total > 0 ? `${(total / 1000).toFixed(1)}kg` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
