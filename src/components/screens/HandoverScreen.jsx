import React, { useState } from 'react';
import {
  Lock,
  EyeOff,
  Eye,
  ShieldCheck,
  Gamepad2,
  Check,
  AlertTriangle,
  ArrowRight,
  Hand
} from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function HandoverScreen() {
  const {
    currentPlayer,
    currentTurnIndex,
    assignedPlayers,
    secretInfo,
    nextPlayerTurn,
    setCurrentScreen
  } = useGame();

  const isPreviewReveal = typeof window !== 'undefined' && (
    window.location.search.includes('REVEAL_CIVIL') ||
    window.location.search.includes('REVEAL_IMPOSTOR')
  );

  const [isHolding, setIsHolding] = useState(isPreviewReveal);
  const [hasRevealed, setHasRevealed] = useState(isPreviewReveal);

  if (!currentPlayer) return null;

  const totalPlayers = assignedPlayers.length;
  const isImpostor = currentPlayer.isImpostor;
  const isLastPlayer = currentTurnIndex === totalPlayers - 1;

  const startHolding = (e) => {
    // Evitar menú contextual en móviles y selecciones de texto
    if (e && e.cancelable) e.preventDefault();
    if (e && e.target && e.target.setPointerCapture && e.pointerId !== undefined) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
    setIsHolding(true);
    setHasRevealed(true);
  };

  const stopHolding = (e) => {
    if (e && e.target && e.target.releasePointerCapture && e.pointerId !== undefined) {
      try {
        if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
          e.target.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
    }
    setIsHolding(false);
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Turno de Entrega Secreto"
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

        {/* Encabezado con altura fija garantizada */}
        <div className="handover-hero">
          <span className="handover-eyebrow">
            {isHolding ? 'CONFIDENCIAL EN PANTALLA' : 'TURNO DE ENTREGA'}
          </span>
          <h1 className="handover-title">
            Pásale el teléfono a<br />
            <span className="player-highlight">{currentPlayer.name}</span>
          </h1>
        </div>

        {/* ESCENARIO DE TARJETA CON ALTURA ESTABLE */}
        <div className="card-stage-wrap">
          {!isHolding ? (
            /* =================== ESTADO OCULTO / CUBIERTO =================== */
            <div className="neo-card confidential-cover-card">
              <div className="envelope-graphic">
                <div className="envelope-body">
                  <div className="lock-badge">
                    <Lock size={24} color="#FFFFFF" />
                  </div>
                </div>
              </div>

              <div className="badge-pill badge-neutral confidential-badge">
                <EyeOff size={14} />
                <span>CONTENIDO CONFIDENCIAL</span>
              </div>

              <p className="cover-instruction">
                Solo <strong>{currentPlayer.name}</strong> debe mantener presionado el botón para mirar su secreto.
              </p>
            </div>
          ) : (
            /* =================== ESTADO REVELADO (MIENTRAS MANTIENE PRESIONADO) =================== */
            <div className={`neo-card reveal-active-card ${isImpostor ? 'impostor-card' : 'civil-card'}`}>
              {!isImpostor ? (
                /* VISTA CIVIL */
                <div className="revealed-civil-inner">
                  <div className="dossier-top">
                    <span className="dossier-category">{secretInfo.categoryName}</span>
                    <span className="badge-pill badge-neutral level-pill">NIVEL 1</span>
                  </div>

                  <div className="civil-shield-badge">
                    <ShieldCheck size={18} color="#C24128" />
                    <span>ERES CIVIL</span>
                  </div>

                  <div className="word-reveal-box">
                    <span className="word-label">PALABRA CLAVE</span>
                    <h2 className="secret-word-main">{secretInfo.word}</h2>
                  </div>

                  <p className="release-hint">⚠️ Suelta el botón para ocultar</p>
                </div>
              ) : (
                /* VISTA IMPOSTOR */
                <div className="revealed-impostor-inner">
                  <div className="impostor-banner-red">
                    <AlertTriangle size={18} />
                    <span>ERES EL IMPOSTOR</span>
                  </div>

                  <div className="impostor-category-row">
                    <Gamepad2 size={16} />
                    <span>{secretInfo.categoryName}</span>
                  </div>

                  <div className="impostor-camouflage-box">
                    <div className="camo-header">
                      <span className="camo-q">?</span>
                      <span className="camo-title">PISTA DE CAMUFLAJE</span>
                    </div>
                    <h2 className="camo-hint-text">{secretInfo.hint}</h2>
                  </div>

                  <p className="release-hint">⚠️ Suelta el botón para ocultar</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACCIONES Y BOTONES */}
        <div className="handover-actions">
          {/* Botón principal: Mantener presionado (con soporte de eventos estable) */}
          <button
            type="button"
            className={`btn-hold-reveal ${isHolding ? 'holding' : ''}`}
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerCancel={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
            onTouchCancel={stopHolding}
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onContextMenu={(e) => e.preventDefault()}
          >
            {isHolding ? (
              <>
                <EyeOff size={20} />
                <span>SUELTA PARA OCULTAR</span>
              </>
            ) : (
              <>
                <Eye size={20} />
                <span>Mantén presionado para ver</span>
              </>
            )}
          </button>

          {/* Botón secundario: Ya la vi, pasar al siguiente (solo aparece si ya lo presionó) */}
          {hasRevealed && !isHolding && (
            <button
              type="button"
              className="btn-primary btn-confirm-next"
              onClick={nextPlayerTurn}
            >
              <span>{isLastPlayer ? 'Comenzar ronda de pistas' : 'Ya la vi, pasar al siguiente'}</span>
              <ArrowRight size={18} />
            </button>
          )}

          <p className="handover-security-caption">
            {hasRevealed
              ? '✅ Identidad visualizada. Entrega el teléfono o pulsa siguiente.'
              : 'Presiona y no sueltes para leer tu rol en privado.'}
          </p>
        </div>
      </main>

      <style>{`
        .handover-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .turn-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .turn-pill {
          padding: 6px 14px;
          font-size: 0.74rem;
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
          gap: 4px;
          min-height: 76px;
          justify-content: center;
          flex-shrink: 0;
        }

        .handover-eyebrow {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .handover-title {
          font-size: 1.95rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .player-highlight {
          color: var(--primary-red);
          font-size: 2.1rem;
        }

        /* ESCENARIO DE TARJETA CON ALTURA ESTABLE */
        .card-stage-wrap {
          width: 100%;
          max-width: 330px;
          height: 295px;
          min-height: 295px;
          max-height: 295px;
          position: relative;
          display: flex;
          align-items: stretch;
          justify-content: center;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .confidential-cover-card,
        .reveal-active-card {
          width: 100%;
          height: 100%;
          min-height: 100%;
          max-height: 100%;
          box-sizing: border-box;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-lg);
          user-select: none;
        }

        /* TARJETA CUBIERTA */
        .confidential-cover-card {
          gap: 16px;
          padding: 24px 20px;
          background-color: var(--bg-card-subtle);
          border: 2px solid var(--border-dark);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
          text-align: center;
        }

        .envelope-graphic {
          position: relative;
          width: 90px;
          height: 65px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0px var(--border-dark);
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
          box-shadow: 0 4px 10px rgba(194, 65, 40, 0.3);
        }

        .confidential-badge {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 6px 14px;
          color: var(--text-muted);
          font-size: 0.72rem;
        }

        .cover-instruction {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .cover-instruction strong {
          color: var(--text-main);
        }

        /* TARJETA REVELADA */
        .reveal-active-card {
          border: 2.5px solid var(--border-dark);
          padding: 20px;
          box-shadow: var(--shadow-neo-lg);
          justify-content: space-evenly;
          user-select: none;
        }

        @keyframes popIn {
          from { transform: scale(0.97); opacity: 0.8; }
          to { transform: scale(1); opacity: 1; }
        }

        .civil-card {
          background-color: #FFFFFF;
        }

        .impostor-card {
          background-color: #FFF8F6;
          border-color: var(--primary-red);
        }

        .revealed-civil-inner, .revealed-impostor-inner {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          text-align: center;
        }

        .dossier-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dossier-category {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .level-pill {
          font-size: 0.65rem;
          padding: 2px 8px;
        }

        .civil-shield-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-accent-light);
          border: 1px solid var(--primary-red);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.04em;
        }

        .word-reveal-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 0;
        }

        .word-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .secret-word-main {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.2;
          word-break: break-word;
        }

        .impostor-banner-red {
          width: 100%;
          background-color: var(--primary-red);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.95rem;
          font-weight: 800;
        }

        .impostor-category-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .impostor-camouflage-box {
          width: 100%;
          background-color: #FFFFFF;
          border: 1.5px solid var(--primary-red);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(194, 65, 40, 0.1);
        }

        .camo-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .camo-q {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: var(--primary-red);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camo-title {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.04em;
        }

        .camo-hint-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.3;
        }

        .release-hint {
          font-size: 0.75rem;
          color: var(--primary-red);
          font-weight: 700;
          margin-top: 4px;
        }

        /* ACCIONES */
        .handover-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .btn-hold-reveal {
          width: 100%;
          min-height: 56px;
          padding: 16px 20px;
          background-color: #1C1917;
          color: #FFFFFF;
          border: 2px solid #1C1917;
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1.02rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: var(--shadow-neo);
          transition: background-color 0.12s ease, border-color 0.12s ease;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
          touch-action: none;
        }

        .btn-hold-reveal:active, .btn-hold-reveal.holding {
          background-color: var(--primary-red);
          border-color: var(--border-dark);
          transform: none; /* No scale or translation so pointer coordinates stay exact */
        }

        .btn-confirm-next {
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .handover-security-caption {
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
        }
      `}</style>
    </div>
  );
}
