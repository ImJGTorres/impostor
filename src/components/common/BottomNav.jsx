import React from 'react';
import { Users, Layers, BookOpen } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, setActiveTab } = useGame();

  const currentTab = currentScreen === 'RULES' ? 'rules' : currentScreen === 'PACKS' ? 'packs' : 'lobby';

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
        type="button"
        className={`nav-tab ${currentTab === 'lobby' ? 'active' : ''}`}
        onClick={() => handleTabClick('lobby')}
      >
        <Users size={20} />
        <span>Lobby</span>
      </button>

      <button
        type="button"
        className={`nav-tab ${currentTab === 'packs' ? 'active' : ''}`}
        onClick={() => handleTabClick('packs')}
      >
        <Layers size={20} />
        <span>Packs</span>
      </button>

      <button
        type="button"
        className={`nav-tab ${currentTab === 'rules' ? 'active' : ''}`}
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
          padding: 12px 16px 14px 16px;
          background-color: var(--bg-main);
          border-top: 1.5px solid var(--border-light);
          position: sticky;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          box-shadow: 0 -4px 14px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          width: 100%;
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
          transition: all 0.15s ease;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
        }

        .nav-tab:hover {
          color: var(--text-main);
          background-color: rgba(0, 0, 0, 0.03);
        }

        .nav-tab.active {
          color: var(--primary-red);
        }

        .nav-tab.active span {
          font-weight: 800;
        }
      `}</style>
    </nav>
  );
}
