import React from 'react';
import { Users, Layers, BookOpen } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function BottomNav() {
  const { activeTab, setActiveTab, setCurrentScreen } = useGame();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'lobby') {
      setCurrentScreen('HOME');
    } else if (tab === 'packs') {
      setCurrentScreen('PACKS');
    } else if (tab === 'rules') {
      setCurrentScreen('RULES');
    }
  };

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab ${activeTab === 'lobby' ? 'active' : ''}`}
        onClick={() => handleTabClick('lobby')}
      >
        <Users size={20} />
        <span>Lobby</span>
      </button>

      <button
        className={`nav-tab ${activeTab === 'packs' ? 'active' : ''}`}
        onClick={() => handleTabClick('packs')}
      >
        <Layers size={20} />
        <span>Packs</span>
      </button>

      <button
        className={`nav-tab ${activeTab === 'rules' ? 'active' : ''}`}
        onClick={() => handleTabClick('rules')}
      >
        <BookOpen size={20} />
        <span>Rules</span>
      </button>

      <style>{`
        .bottom-nav {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 12px 16px 18px 16px;
          background-color: var(--bg-main);
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          bottom: 0;
          z-index: 20;
          margin-top: auto;
        }

        .nav-tab {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s, transform 0.1s;
          padding: 4px 12px;
          border-radius: 8px;
        }

        .nav-tab:hover {
          color: var(--text-main);
        }

        .nav-tab.active {
          color: var(--primary-red);
        }

        .nav-tab.active span {
          font-weight: 700;
        }
      `}</style>
    </nav>
  );
}
