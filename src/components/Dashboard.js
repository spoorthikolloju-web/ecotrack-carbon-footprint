import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { INDIA_AVERAGE_FOOTPRINT, WORLD_AVERAGE_FOOTPRINT, PARIS_GOAL } from '../data/constants';
import AIInsights from './AIInsights';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  home: '#f59e0b',
  food: '#16a34a',
  shopping: '#ef4444'
};

function ComparisonBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100).toFixed(1);
  return (
    <div className="comparison-row">
      <span className="bar-label">{label}</span>
      <div className="bar-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={`${label}: ${(value/1000).toFixed(1)} tonnes CO2e per year`}>
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="bar-value">{(value / 1000).toFixed(1)}t</span>
    </div>
  );
}

ComparisonBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default function Dashboard({ logs, totalFootprint, completedChallenges }) {
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayLog = logs[key];
      const total = dayLog
        ? Object.values(dayLog).reduce((a, b) => a + (isFinite(b) ? b : 0), 0)
        : 0;
      days.push({
        date: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        kg: parseFloat((total / 1000).toFixed(2))
      });
    }
    return days;
  }, [logs]);

  const categoryBreakdown = useMemo(() => {
    const cats = { transport: 0, home: 0, food: 0, shopping: 0 };
    Object.values(logs).forEach(day => {
      Object.entries(day).forEach(([key, val]) => {
        const cat = key.split('_')[0];
        if (cats[cat] !== undefined && isFinite(val)) cats[cat] += val;
      });
    });
    return cats;
  }, [logs]);

  const categoryChartData = useMemo(() => {
    return Object.entries(categoryBreakdown)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: parseFloat((value / 1000).toFixed(2)),
        color: CATEGORY_COLORS[name]
      }));
  }, [categoryBreakdown]);

  const annualProjected = totalFootprint * 12;
  const footprintKg = totalFootprint.toFixed(1);
  const treesNeeded = Math.ceil(annualProjected / 21);
  const carsEquivalent = (annualProjected / 4600).toFixed(1);

  const scoreColor = annualProjected < PARIS_GOAL
    ? '#16a34a'
    : annualProjected < INDIA_AVERAGE_FOOTPRINT
    ? '#f59e0b'
    : '#ef4444';

  const insightText = annualProjected < PARIS_GOAL
    ? '🎉 Amazing! Your footprint is below the Paris Agreement target. You\'re a climate champion!'
    : annualProjected < INDIA_AVERAGE_FOOTPRINT
    ? '✅ You\'re below India\'s average! Keep going — the Paris Goal (2.3t) is within reach.'
    : `📊 Your footprint is ${((annualProjected / INDIA_AVERAGE_FOOTPRINT - 1) * 100).toFixed(0)}% above India's average. Small changes add up!`;

  return (
    <main className="dashboard" aria-label="Carbon footprint dashboard">
      <div className="welcome-banner">
        <div>
          <h2>Your Carbon Dashboard</h2>
          <p>Track, understand, and reduce your environmental impact</p>
        </div>
        <div
          className="score-badge"
          style={{ borderColor: scoreColor, color: scoreColor }}
          role="status"
          aria-label={`Current monthly footprint: ${footprintKg} kilograms CO2 equivalent`}
        >
          <span className="score-num">{footprintKg}</span>
          <span className="score-unit">kg CO₂e/mo</span>
        </div>
      </div>

      <div className="stats-grid" role="list" aria-label="Key statistics">
        {[
          { icon: '📅', value: `${footprintKg} kg`, label: 'This Month' },
          { icon: '📆', value: `${(annualProjected / 1000).toFixed(1)} t`, label: 'Annual Projection' },
          { icon: '🌳', value: treesNeeded, label: 'Trees to Offset' },
          { icon: '🚗', value: `${carsEquivalent}x`, label: 'Cars/Year Equiv.' },
        ].map(({ icon, value, label }) => (
          <div key={label} className="stat-card" role="listitem">
            <div className="stat-icon" aria-hidden="true">{icon}</div>
            <div className="stat-info">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI INSIGHTS SECTION */}
      <AIInsights
        totalFootprint={totalFootprint}
        categoryBreakdown={categoryBreakdown}
        completedChallenges={completedChallenges}
      />

      <div className="charts-row">
        <section className="chart-card" aria-labelledby="trend-heading">
          <h3 id="trend-heading">7-Day Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData} aria-label="Line chart of 7-day CO2 emissions">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit=" kg" />
              <Tooltip formatter={(v) => [`${v} kg`, 'CO₂e']} />
              <Line type="monotone" dataKey="kg" stroke="#16a34a" strokeWidth={2.5}
                dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="chart-card" aria-labelledby="breakdown-heading">
          <h3 id="breakdown-heading">Category Breakdown</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}kg`}
                  labelLine={false}
                >
                  {categoryChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} aria-label={`${entry.name}: ${entry.value} kg CO2e`} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} kg CO₂e`, '']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart" role="status">
              <p>🌱 Start logging activities to see your breakdown</p>
            </div>
          )}
        </section>
      </div>

      <section className="comparison-card" aria-labelledby="compare-heading">
        <h3 id="compare-heading">How You Compare</h3>
        <div className="comparison-bars">
          <ComparisonBar label="You (annual)" value={annualProjected} max={WORLD_AVERAGE_FOOTPRINT * 1.5} color={scoreColor} />
          <ComparisonBar label="India Average" value={INDIA_AVERAGE_FOOTPRINT} max={WORLD_AVERAGE_FOOTPRINT * 1.5} color="#94a3b8" />
          <ComparisonBar label="Paris Goal" value={PARIS_GOAL} max={WORLD_AVERAGE_FOOTPRINT * 1.5} color="#16a34a" />
          <ComparisonBar label="World Average" value={WORLD_AVERAGE_FOOTPRINT} max={WORLD_AVERAGE_FOOTPRINT * 1.5} color="#f59e0b" />
        </div>
        <div className="comparison-insight" role="status" aria-live="polite">
          {insightText}
        </div>
      </section>
    </main>
  );
}

Dashboard.propTypes = {
  logs: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)).isRequired,
  totalFootprint: PropTypes.number.isRequired,
  completedChallenges: PropTypes.number.isRequired,
};
