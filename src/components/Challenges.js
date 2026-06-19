import { useState } from 'react';

const CHALLENGES = [
  {
    id: 'meatless_monday',
    title: 'Meatless Monday',
    icon: '🥗',
    description: 'Go meat-free every Monday for a month',
    duration: '30 days',
    saving: 200,
    difficulty: 'Easy',
    category: 'food',
    steps: ['Plan a vegetarian meal', 'Try a new recipe', 'Share with friends!']
  },
  {
    id: 'public_transport',
    title: 'Leave the Car at Home',
    icon: '🚌',
    description: 'Use public transport or cycle for all commutes this week',
    duration: '7 days',
    saving: 80,
    difficulty: 'Medium',
    category: 'transport',
    steps: ['Plan your route', 'Download a transit app', 'Track km saved']
  },
  {
    id: 'energy_saver',
    title: '1 Hour Power Cut',
    icon: '🕯️',
    description: 'Turn off all non-essential electronics for 1 hour daily',
    duration: '14 days',
    saving: 50,
    difficulty: 'Easy',
    category: 'home',
    steps: ['Set a daily reminder', 'Use this time for reading/walking', 'Track units saved']
  },
  {
    id: 'zero_waste_week',
    title: 'Zero Waste Week',
    icon: '♻️',
    description: 'Produce zero landfill waste for 7 days',
    duration: '7 days',
    saving: 60,
    difficulty: 'Hard',
    category: 'shopping',
    steps: ['Audit current waste', 'Buy in bulk', 'Compost food scraps']
  },
  {
    id: 'local_produce',
    title: 'Shop Local',
    icon: '🌾',
    description: 'Buy only locally sourced produce for 2 weeks',
    duration: '14 days',
    saving: 120,
    difficulty: 'Medium',
    category: 'food',
    steps: ['Find local farmers market', 'Check origin labels', 'Try seasonal recipes']
  },
  {
    id: 'digital_detox',
    title: 'Digital Detox Weekend',
    icon: '📵',
    description: 'Reduce screen time by 50% over the weekend',
    duration: '2 days',
    saving: 20,
    difficulty: 'Easy',
    category: 'home',
    steps: ['Unplug chargers', 'Spend time outdoors', 'Read a book']
  },
  {
    id: 'cold_shower',
    title: 'Cool Showers',
    icon: '🚿',
    description: 'Take cold or cool showers for 21 days',
    duration: '21 days',
    saving: 90,
    difficulty: 'Medium',
    category: 'home',
    steps: ['Start with 30 seconds cold', 'Reduce geyser usage', 'Track energy saved']
  },
  {
    id: 'plant_a_tree',
    title: 'Plant & Nurture',
    icon: '🌱',
    description: 'Plant a tree or indoor plant and keep it alive for 30 days',
    duration: '30 days',
    saving: 21,
    difficulty: 'Easy',
    category: 'other',
    steps: ['Choose a native species', 'Water daily', 'Watch it grow!']
  }
];

const DIFFICULTY_COLOR = { Easy: '#16a34a', Medium: '#f59e0b', Hard: '#ef4444' };

export default function Challenges({ activeChallenges, completedChallenges, onToggleChallenge, onComplete }) {
  const [expandedId, setExpandedId] = useState(null);
const ChallengeStats = ({ activeChallenges, completedChallenges }) => {
    const totalSaved = completedChallenges.reduce((sum, id) => {
      const c = CHALLENGES.find(ch => ch.id === id);
      return sum + (c?.saving || 0);
    }, 0);
    return (
      <div className="challenge-stats">
        <div className="cstat">
          <span className="cstat-num">{activeChallenges.length}</span>
          <span className="cstat-label">Active</span>
        </div>
        <div className="cstat">
          <span className="cstat-num">{completedChallenges.length}</span>
          <span className="cstat-label">Completed</span>
        </div>
        <div className="cstat">
          <span className="cstat-num">{totalSaved} kg</span>
          <span className="cstat-label">CO₂e Saved</span>
        </div>
      </div>
    );
  };

  return (
    <div className="challenges-page">
      <div className="challenges-header">
        <h2>Eco Challenges</h2>
        <p>Take on these missions to build sustainable habits</p>
        <ChallengeStats
          activeChallenges={activeChallenges}
          completedChallenges={completedChallenges}
        />
      </div>

      {activeChallenges.length > 0 && (
        <div className="active-challenges">
          <h3>🔥 Your Active Challenges</h3>
          {CHALLENGES.filter(c => activeChallenges.includes(c.id)).map(ch => (
            <div key={ch.id} className="challenge-active">
              <span>{ch.icon}</span>
              <div>
                <strong>{ch.title}</strong>
                <span> — {ch.duration}</span>
              </div>
              <button className="done-btn" onClick={() => onComplete(ch.id)}>Mark Done ✓</button>
            </div>
          ))}
        </div>
      )}

      <div className="challenges-grid">
       const ChallengeHeader = ({ch, isDone, isActive, isExpanded, toggleExpand}) => {
          return (
            <div className="challenge-top"
              onClick={toggleExpand}
              onKeyDown={e => e.key === 'Enter' && toggleExpand()}
              tabIndex={0}
            >
              <div className="challenge-icon-wrap">
                <span className="challenge-icon">{ch.icon}</span>
                {isDone && <span className="done-badge">✓</span>}
              </div>
              <div className="challenge-info">
                <h4>{ch.title}</h4>
                <p>{ch.description}</p>
                <div className="challenge-meta">
                  <span className="ch-duration">⏱ {ch.duration}</span>
                  <span className="ch-saving">🌿 {ch.saving} kg CO₂e</span>
                  <span
                    className="ch-diff"
                    style={{ color: DIFFICULTY_COLOR[ch.difficulty] }}
                  >
                    {ch.difficulty}
                  </span>
                </div>
              </div>
            </div>
          );
        }
        }

        function ChallengeSteps({steps}) {
          return (
            <div className="challenge-steps">
              <strong>Steps to success:</strong>
              <ol>
                {steps.map(s => <li key={s}>{s}</li>)}
              </ol>
            </div>
          );
        }

        function ChallengeAction({isActive, isDone, onToggleChallenge}) {
          return (
            <button
              className={`challenge-btn ${isActive ? 'active' : isDone ? 'done' : ''}`}
              onClick={() => !isDone && onToggleChallenge()}
              disabled={isDone}
            >
              {isDone ? '🎉 Completed!' : isActive ? '⏸ Quit Challenge' : '▶ Start Challenge'}
            </button>
          );
        }

        {CHALLENGES.map(ch => {
          const isActive = activeChallenges.includes(ch.id);
          const isDone = completedChallenges.includes(ch.id);
          const isExpanded = expandedId === ch.id;
          return (
            <div
               key={ch.id}
               className={`challenge-card ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              <ChallengeHeader
                ch={ch}
                isDone={isDone}
                isActive={isActive}
                isExpanded={isExpanded}
                toggleExpand={() => setExpandedId(isExpanded ? null : ch.id)}
              />
              {isExpanded && <ChallengeSteps steps={ch.steps} />}
              <ChallengeAction
                isActive={isActive}
                isDone={isDone}
                onToggleChallenge={() => onToggleChallenge(ch.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
