import React from 'react';
import PropTypes from 'prop-types';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
  { id: 'calculator', label: 'Calculator', emoji: '🧮' },
  { id: 'log', label: 'Daily Log', emoji: '📋' },
  { id: 'tips', label: 'Tips', emoji: '💡' },
  { id: 'challenges', label: 'Challenges', emoji: '🏆' },
];

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header" role="banner">
      <div className="header-top">
        <div className="logo">
          <span className="logo-icon" aria-hidden="true">🌿</span>
          <div>
            <h1>EcoTrack</h1>
            <p>Your Carbon Footprint Companion</p>
          </div>
        </div>
      </div>
      <nav className="nav-tabs" aria-label="Main navigation">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
          >
            <span aria-hidden="true">{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
