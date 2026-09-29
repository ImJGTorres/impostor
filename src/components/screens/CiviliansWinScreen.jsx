import React, { useEffect } from 'react';
import { RotateCcw, Home, Key } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';
import confetti from 'canvas-confetti';

export default function CiviliansWinScreen() {
  const {
    assignedPlayers,
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

  const allImpostors = (assignedPlayers || []).filter(p => p && p.isImpostor);
  const impostorsList = allImpostors.length > 0 ? allImpostors : (lastEliminated ? [lastEliminated] : []);

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

        {/* Card: Identidades de los Infiltrados */}
        <div className="neo-card dossier-card">
          <div className="card-mini-header" style={{ marginBottom: '12px' }}>
            <span className="mini-label">
              {impostorsList.length === 1 ? 'INFILTRADO DESENMASCARADO' : 'INFILTRADOS DESENMASCARADOS'}
            </span>
            <span className="badge-pill badge-red era-impostor-pill">
              {impostorsList.length} {impostorsList.length === 1 ? 'IMPOSTOR' : 'IMPOSTORES'}
            </span>
          </div>

          <div className="impostors-unmasked-list">
            {impostorsList.map((imp) => (
              <div key={imp.id || imp.name} className="impostor-unmasked-row">
                <div
                  className="roster-avatar"
                  style={{ backgroundColor: imp.color || '#C24128' }}
                >
                  {imp.letter || imp.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="impostor-unmasked-info">
                  <span className="impostor-name">{imp.name}</span>
                  <span className="badge-pill badge-red era-impostor-pill">ERA EL IMPOSTOR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card: Palabra Secreta */}
        <div className="neo-card secret-reveal-card">
          <div className="card-mini-header">
            <span className="mini-label">PALABRA SECRETA</span>
            <Key size={16} className="key-icon" />
          </div>
          <h2 className="secret-word-title">{secretInfo?.word || 'Palabra Secreta'}</h2>
          <span className="category-subtext">Categoría: {secretInfo?.categoryName || 'General'}</span>
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

        .impostors-unmasked-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .impostor-unmasked-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          background-color: #FFF8F6;
          border: 1.5px solid #FCA5A5;
          border-radius: var(--radius-md);
        }

        .roster-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--border-dark);
          color: #FFFFFF;
          font-weight: 900;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0px var(--border-dark);
          flex-shrink: 0;
        }

        .impostor-unmasked-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .impostor-name {
          font-size: 1.25rem;
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
