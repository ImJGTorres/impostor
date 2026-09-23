import React, { useEffect } from 'react';
import { RotateCcw, Home, Key, Info } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';
import confetti from 'canvas-confetti';

export default function CiviliansWinScreen() {
  const {
    lastEliminated,
    secretInfo,
    startNewGame,
    returnToHome
  } = useGame();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });
  }, []);

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Round Result"
        showBack={true}
        onBack={returnToHome}
      />

      <main className="civilians-win-content">
        <div className="win-header">
          <span className="badge-pill badge-neutral veredicto-pill">VEREDICTO OFICIAL</span>
          <h1 className="win-title">¡Los Civiles Ganan!</h1>
        </div>

        {/* Card: Identidad Confidencial */}
        <div className="neo-card dossier-card">
          <div className="impostor-unmasked-row">
            <div className="impostor-avatar-frame">
              <img src="/impostor-logo.png" alt="Impostor" className="impostor-img" />
            </div>
            <div className="impostor-unmasked-info">
              <span className="confidential-label">IDENTIDAD CONFIDENCIAL</span>
              <h2 className="impostor-name">{lastEliminated?.name || 'Infiltrado'}</h2>
              <span className="badge-pill badge-red era-impostor-pill">ERA EL IMPOSTOR</span>
            </div>
          </div>
        </div>

        {/* Card: Palabra Secreta */}
        <div className="neo-card secret-reveal-card">
          <div className="card-mini-header">
            <span className="mini-label">PALABRA SECRETA</span>
            <Key size={16} className="key-icon" />
          </div>
          <h2 className="secret-word-title">{secretInfo.word}</h2>
          <span className="category-subtext">Categoría: {secretInfo.categoryName}</span>
        </div>

        {/* Card: Pista del impostor */}
        <div className="neo-card hint-reveal-card">
          <div className="card-mini-header">
            <span className="mini-label">PISTA DE CAMUFLAJE ASIGNADA</span>
            <span className="hint-emoji">🗣️</span>
          </div>
          <p className="hint-quote">“{secretInfo.hint}”</p>
          <div className="hint-analysis-row">
            <Info size={14} className="info-icon" />
            <span className="hint-analysis-text">
              Los civiles detectaron la sospecha y lograron desenmascarar al agente infiltrado a tiempo.
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="win-actions">
          <button className="btn-primary" onClick={startNewGame}>
            <RotateCcw size={18} />
            <span>JUGAR OTRA RONDA</span>
          </button>

          <button className="btn-secondary" onClick={returnToHome}>
            <Home size={18} />
            <span>VOLVER AL MENÚ PRINCIPAL</span>
          </button>
        </div>
      </main>

      <style>{`
        .civilians-win-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .win-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .veredicto-pill {
          background-color: var(--bg-accent-light);
          color: var(--primary-red);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .win-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .dossier-card {
          padding: 16px 18px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
        }

        .impostor-unmasked-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .impostor-avatar-frame {
          width: 56px;
          height: 56px;
          background-color: #1C1917;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .impostor-img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .impostor-unmasked-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .confidential-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .impostor-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .era-impostor-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 8px;
          align-self: flex-start;
        }

        .secret-reveal-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 18px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
        }

        .card-mini-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mini-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        .key-icon {
          color: var(--primary-red);
        }

        .secret-word-title {
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .category-subtext {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .hint-reveal-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px 18px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
        }

        .hint-quote {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          font-style: italic;
          line-height: 1.35;
        }

        .hint-analysis-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 4px;
        }

        .info-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hint-analysis-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .win-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
}
