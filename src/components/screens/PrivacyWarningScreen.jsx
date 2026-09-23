import React from 'react';
import { EyeOff, Lightbulb, Lock } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function PrivacyWarningScreen() {
  const {
    currentPlayer,
    currentTurnIndex,
    setCurrentScreen
  } = useGame();

  if (!currentPlayer) return null;

  const handleReadyClick = () => {
    // Pasar a la pantalla de revelación de rol (Civil o Impostor)
    setCurrentScreen('REVEAL');
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Secret Identity Reveal"
        showBack={true}
        onBack={() => setCurrentScreen('HANDOVER')}
      />

      <main className="privacy-content">
        <div className="neo-card privacy-card">
          {/* Badge superior de turno */}
          <div className="badge-pill badge-neutral player-turn-pill">
            <span className="pill-emoji">🎭</span>
            <span>TURNO DE: {currentPlayer.name.toUpperCase()} • JUGADOR {currentTurnIndex + 1}</span>
          </div>

          {/* Gráfico circular de radar de privacidad */}
          <div className="radar-graphic-wrap">
            <div className="radar-circle-outer">
              <div className="radar-circle-inner">
                <div className="radar-crosshair"></div>
                <div className="radar-eye-badge">
                  <EyeOff size={16} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>

          {/* Textos de advertencia */}
          <div className="privacy-texts">
            <h1 className="privacy-title">¿Tienes el teléfono tú solo?</h1>
            <p className="privacy-subtitle">
              Asegúrate de que nadie más esté mirando.
            </p>
          </div>

          {/* Consejo Táctico */}
          <div className="tactical-box">
            <div className="tactical-header">
              <Lightbulb size={16} className="bulb-icon" />
              <span className="tactical-title">CONSEJO TÁCTICO</span>
            </div>
            <p className="tactical-text">
              Si eres el impostor, finge tranquilidad; si eres civil, prepara tu pista con cautela.
            </p>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="privacy-actions">
          <button className="btn-primary" onClick={handleReadyClick}>
            <Lock size={18} />
            <span>ESTOY LISTO</span>
          </button>
        </div>
      </main>

      <style>{`
        .privacy-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .privacy-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 30px 20px;
          gap: 24px;
          background-color: var(--bg-card-subtle);
          border: 2px solid var(--border-dark);
        }

        .player-turn-pill {
          padding: 6px 14px;
          font-size: 0.72rem;
          background-color: #EAE6DF;
        }

        .pill-emoji {
          font-size: 0.85rem;
        }

        .radar-graphic-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radar-circle-outer {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 2px dashed #D6CEC4;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #EDE8E1;
        }

        .radar-circle-inner {
          position: relative;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1.5px solid #C24128;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
        }

        .radar-crosshair {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border-top: 2px solid var(--primary-red);
          border-bottom: 2px solid var(--primary-red);
        }

        .radar-eye-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 28px;
          height: 28px;
          background-color: var(--primary-red);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .privacy-texts {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .privacy-title {
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .privacy-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .tactical-box {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .tactical-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bulb-icon {
          color: var(--primary-red);
        }

        .tactical-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .tactical-text {
          font-size: 0.82rem;
          color: var(--text-main);
          line-height: 1.4;
          font-weight: 500;
        }

        .privacy-actions {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
