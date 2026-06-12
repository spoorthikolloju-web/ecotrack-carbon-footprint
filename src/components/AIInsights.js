import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { INDIA_AVERAGE_FOOTPRINT, PARIS_GOAL } from '../data/constants';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

function buildPrompt(totalFootprint, categoryBreakdown, completedChallenges) {
  const annual = (totalFootprint * 12).toFixed(1);
  const breakdown = Object.entries(categoryBreakdown)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}: ${(v / 1000).toFixed(2)} kg CO₂e`)
    .join(', ');

  return `You are an expert carbon footprint advisor for Indian users.

A user's carbon footprint data:
- Monthly footprint: ${totalFootprint.toFixed(1)} kg CO₂e
- Annual projection: ${annual} kg CO₂e
- India average: ${(INDIA_AVERAGE_FOOTPRINT / 1000).toFixed(1)} tonnes/year
- Paris Agreement target: ${(PARIS_GOAL / 1000).toFixed(1)} tonnes/year
- Category breakdown this month: ${breakdown || 'No data logged yet'}
- Eco challenges completed: ${completedChallenges}

Give a short, friendly, personalized analysis in 3 sections:
1. **Your Status** (1-2 sentences on where they stand vs India average and Paris goal)
2. **Biggest Opportunity** (1-2 sentences on their highest-impact category and one specific action)
3. **This Week's Goal** (one concrete, achievable action for an Indian household)

Be warm, encouraging, and specific to India. Keep total response under 150 words.`;
}

export default function AIInsights({ totalFootprint, categoryBreakdown, completedChallenges }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsight = useCallback(async () => {
    if (!GEMINI_API_KEY) {
      setError('Gemini API key not configured. Add REACT_APP_GEMINI_API_KEY to your .env file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(totalFootprint, categoryBreakdown, completedChallenges) }] }],
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
          }),
        }
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from Gemini');
      setInsight(text);
      setHasGenerated(true);
    }catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Gemini API error:', err);
    } finally {
      setLoading(false);
    }
  }, [totalFootprint, categoryBreakdown, completedChallenges]);

  // Format markdown-style bold to JSX
  const formatInsight = (text) => {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ margin: '6px 0', lineHeight: 1.6 }} />;
    });
  };

  return (
    <section className="ai-insights" aria-labelledby="ai-heading">
      <div className="ai-header">
        <div className="ai-title-row">
          <span className="ai-icon" aria-hidden="true">🤖</span>
          <div>
            <h3 id="ai-heading">AI-Powered Insights</h3>
            <p>Personalized analysis powered by Google Gemini</p>
          </div>
          <span className="ai-badge">Gemini AI</span>
        </div>
      </div>

      {!hasGenerated && !loading && (
        <div className="ai-cta">
          <p>Get a personalized carbon footprint analysis based on your data — what's hurting most, and one action you can take this week.</p>
          <button
            className="ai-btn"
            onClick={generateInsight}
            aria-label="Generate AI-powered carbon footprint insights"
          >
            ✨ Generate My Insights
          </button>
        </div>
      )}

      {loading && (
        <div className="ai-loading" role="status" aria-live="polite">
          <div className="ai-spinner" aria-hidden="true" />
          <p>Gemini is analysing your footprint...</p>
        </div>
      )}

      {error && (
        <div className="ai-error" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}

      {insight && !loading && (
        <div className="ai-result" role="region" aria-label="AI generated insights">
          <div className="ai-content">
            {formatInsight(insight)}
          </div>
          <button
            className="ai-refresh"
            onClick={generateInsight}
            aria-label="Regenerate insights"
          >
            🔄 Refresh Insights
          </button>
        </div>
      )}
    </section>
  );
}

AIInsights.propTypes = {
  totalFootprint: PropTypes.number.isRequired,
  categoryBreakdown: PropTypes.object.isRequired,
  completedChallenges: PropTypes.number.isRequired,
};
