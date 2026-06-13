import { useState } from 'react';
import PropTypes from 'prop-types';
import { TIPS_BY_CATEGORY } from '../data/constants';

const DIFFICULTY_COLOR = { Easy: '#16a34a', Medium: '#f59e0b', Hard: '#ef4444' };
const CAT_ICON = { transport: '🚗', home: '🏠', food: '🍽️', shopping: '🛍️' };

export default function Tips({ savedTips, onToggleTip }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', 'transport', 'home', 'food', 'shopping'];

  const allTips = Object.entries(TIPS_BY_CATEGORY).flatMap(([cat, tips]) =>
    tips.map((tip, i) => ({ ...tip, cat, id: `${cat}_${i}` }))
  );

  const filtered = activeCategory === 'all' ? allTips : allTips.filter(t => t.cat === activeCategory);
  const totalSaving = savedTips.reduce((sum, id) => {
    const tip = allTips.find(t => t.id === id);
    return sum + (tip?.saving ?? 0);
  }, 0);

  return (
    <main className="tips-page" aria-label="Reduction tips">
      <div className="tips-header">
        <h2>Reduction Tips</h2>
        <p>Personalized actions to shrink your footprint</p>
        {savedTips.length > 0 && (
          <div className="savings-banner" role="status" aria-live="polite">
            ✅ {savedTips.length} tips committed — potential saving:{' '}
            <strong>{totalSaving} kg CO₂e/year</strong>
          </div>
        )}
      </div>

      <div className="cat-tabs" role="tablist" aria-label="Filter by category">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            aria-selected={activeCategory === cat}
            aria-controls="tips-list"
          >
            {cat === 'all'
              ? <><span aria-hidden="true">🌍</span> All</>
              : <><span aria-hidden="true">{CAT_ICON[cat]}</span> {cat.charAt(0).toUpperCase() + cat.slice(1)}</>}
          </button>
        ))}
      </div>

      <div id="tips-list" className="tips-grid" role="tabpanel" aria-label={`Tips for ${activeCategory}`}>
        {filtered.map(tip => {
          const committed = savedTips.includes(tip.id);
          return (
            <article key={tip.id} className={`tip-card ${committed ? 'committed' : ''}`}>
              <div className="tip-top">
                <span className="tip-cat-icon" aria-hidden="true">{CAT_ICON[tip.cat]}</span>
                <span
                  className="tip-difficulty"
                  style={{ color: DIFFICULTY_COLOR[tip.difficulty] }}
                  aria-label={`Difficulty: ${tip.difficulty}`}
                >
                  {tip.difficulty}
                </span>
              </div>
              <p className="tip-text">{tip.tip}</p>
              <div className="tip-bottom">
                <span className="tip-saving">Save ~{tip.saving} kg CO₂e/year</span>
                <button
                  className={`commit-btn ${committed ? 'committed' : ''}`}
                  onClick={() => onToggleTip(tip.id)}
                  aria-pressed={committed}
                  aria-label={committed ? `Remove commitment: ${tip.tip}` : `Commit to: ${tip.tip}`}
                >
                  {committed ? '✓ Committed' : 'Commit'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

Tips.propTypes = {
  savedTips: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleTip: PropTypes.func.isRequired,
};
