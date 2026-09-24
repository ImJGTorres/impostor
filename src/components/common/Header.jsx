import React from 'react';
import { ChevronLeft, User } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function Header({ title = 'EL IMPOSTOR', subtitle = 'Lobby', showBack = false, onBack = null }) {
  const { setCurrentScreen, returnToHome } = useGame();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      returnToHome();
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {showBack && (
          <button className="back-btn" onClick={handleBack} aria-label="Volver">
            <ChevronLeft size={22} color="#1C1917" />
          </button>
        )}
        <div className="header-brand">
          <div className="avatar-brand">
            <img src="/impostor-logo.png" alt="Impostor Avatar" className="brand-logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-title">{title}</span>
            <span className="brand-subtitle">{subtitle}</span>
          </div>
        </div>
      </div>

      <style>{`
        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background-color: var(--bg-main);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .back-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar-brand {
          width: 34px;
          height: 34px;
          background-color: #1C1917;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .user-avatar-circle {
          width: 34px;
          height: 34px;
          background-color: var(--primary-red);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}
