import React from 'react';
import { ArrowRight, Lock, EyeOff } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function HandoverScreen() {
  const {
    currentPlayer,
    currentTurnIndex,
    assignedPlayers,
    setCurrentScreen
  } = useGame();

  if (!currentPlayer) return null;

  const totalPlayers = assignedPlayers.length;

  const handleRevealClick = () => {
    // Pasar a la pantalla de filtro de privacidad (Figma 1:416)
    setCurrentScreen('PRIVACY');
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Pass And Play Handover"
        showBack={true}
        onBack={() => setCurrentScreen('CONFIG')}
      />

      <main className="handover-content">
        {/* Indicador de turno y progreso */}
        <div className="turn-progress-wrap">
          <div className="badge-pill badge-neutral turn-pill">
            <span className="red-dot"></span>
            <span>JUGADOR {currentTurnIndex + 1} DE {totalPlayers}</span>
          </div>

          <div className="progress-dots">
            {assignedPlayers.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentTurnIndex ? 'active' : idx < currentTurnIndex ? 'passed' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Mensaje de pase de teléfono */}
        <div className="handover-hero">
          <span className="handover-eyebrow">TURNO DE ENTREGA</span>
          <h1 className="handover-title">
            Pásale el teléfono a<br />
            <span className="player-highlight">{currentPlayer.name}</span>
          </h1>
        </div>

        {/* Tarjeta de Sobre Confidencial */}
        <div className="neo-card confidential-card">
          <div className="envelope-graphic">
            <div className="envelope-body">
              <div className="envelope-flap"></div>
              <div className="envelope-lines"></div>
              <div className="lock-badge">
                <Lock size={22} color="#FFFFFF" />
              </div>
            </div>
          </div>

          <div className="badge-pill badge-neutral confidential-badge">
            <EyeOff size={14} />
            <span>CONTENIDO CONFIDENCIAL</span>
          </div>
        </div>

        {/* Acción */}
        <div className="handover-actions">
          <button className="btn-primary" onClick={handleRevealClick}>
            <span>Ver mi palabra</span>
            <ArrowRight size={18} />
          </button>
          <p className="handover-caption">
            Solo <strong>{currentPlayer.name}</strong> debe pulsar este botón
          </p>
        </div>
      </main>

      <style>{`
        .handover-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 26px;
          flex: 1;
        }

        .turn-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .turn-pill {
          padding: 6px 14px;
          font-size: 0.76rem;
        }

        .red-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary-red);
          border-radius: 50%;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #E2DDD5;
          transition: all 0.25s ease;
        }

        .dot.active {
          width: 24px;
          border-radius: 6px;
          background-color: var(--primary-red);
        }

        .dot.passed {
          background-color: var(--text-muted);
        }

        .handover-hero {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .handover-eyebrow {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .handover-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .player-highlight {
          color: var(--primary-red);
          font-size: 2.3rem;
        }

        .confidential-card {
          width: 100%;
          max-width: 320px;
          height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background-color: var(--bg-card-subtle);
          border: 2px solid var(--border-dark);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
        }

        .envelope-graphic {
          position: relative;
          width: 100px;
          height: 70px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0px var(--border-dark);
        }

        .envelope-body {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lock-badge {
          width: 44px;
          height: 44px;
          background-color: var(--primary-red);
          border: 2px solid var(--border-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 4px 10px rgba(194, 65, 40, 0.3);
        }

        .confidential-badge {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 6px 14px;
          color: var(--text-muted);
          font-size: 0.72rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }

        .handover-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .handover-caption {
          text-align: center;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .handover-caption strong {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
