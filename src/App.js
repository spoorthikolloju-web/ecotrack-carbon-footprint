import { useState, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import DailyLog from './components/DailyLog';
import Tips from './components/Tips';
import Challenges from './components/Challenges';
import { useLocalStorage } from './hooks/useLocalStorage';
import { currentMonthFootprintKg } from './utils/calculations';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useLocalStorage('ecotrack_logs', {});
  const [savedTips, setSavedTips] = useLocalStorage('ecotrack_tips', []);
  const [activeChallenges, setActiveChallenges] = useLocalStorage('ecotrack_active_challenges', []);
  const [completedChallenges, setCompletedChallenges] = useLocalStorage('ecotrack_done_challenges', []);

  const totalFootprint = useMemo(() => currentMonthFootprintKg(logs), [logs]);

  const handleSaveLog = (date, dayLog) => {
    setLogs(prev => ({ ...prev, [date]: dayLog }));
  };

  const handleToggleTip = (id) => {
    setSavedTips(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleToggleChallenge = (id) => {
    setActiveChallenges(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleCompleteChallenge = (id) => {
    setActiveChallenges(prev => prev.filter(c => c !== id));
    setCompletedChallenges(prev => [...prev, id]);
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main" id="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            logs={logs}
            totalFootprint={totalFootprint}
            completedChallenges={completedChallenges.length}
          />
        )}
        {activeTab === 'calculator' && <Calculator onSave={handleSaveLog} />}
        {activeTab === 'log' && <DailyLog logs={logs} onSave={handleSaveLog} />}
        {activeTab === 'tips' && <Tips savedTips={savedTips} onToggleTip={handleToggleTip} />}
        {activeTab === 'challenges' && (
          <Challenges
            activeChallenges={activeChallenges}
            completedChallenges={completedChallenges}
            onToggleChallenge={handleToggleChallenge}
            onComplete={handleCompleteChallenge}
          />
        )}
      </main>
    </div>
  );
}
