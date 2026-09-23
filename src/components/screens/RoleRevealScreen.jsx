import React from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Check
} from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function RoleRevealScreen() {
  const {
    currentPlayer,
    nextPlayer,
    currentTurnIndex,
    assignedPlayers,
    secretInfo,
    nextPlayerTurn
  } = useGame();

  if (!currentPlayer) return null;

  const totalPlayers = assignedPlayers.length;
  const isImpostor = currentPlayer.isImpostor;

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Secret Identity Reveal"
        showBack={false}
      />

      <main className="reveal-content">
        {/* ===================== VISTA CIVIL (Figma 1:510) ===================== */}
        {!isImpostor && (
          <div className="civil-view">
            <div className="turn-indicator-pill">
              <span className="player-num-text">
                👥 Jugador {currentTurnIndex + 1} de {totalPlayers} ({currentPlayer.name})
              </span>
            </div>

            <div className="neo-card secret-dossier-card">
              <div className="dossier-header">
                <div className="dossier-title-col">
                  <span className="dossier-label">EXPEDIENTE SECRETO</span>
                  <span className="dossier-category">
                    <span className="category-symbol">⚏</span> {secretInfo.categoryName}
                  </span>
                </div>
                <div className="badge-pill badge-neutral level-badge">
                  <Lock size={12} />
                  <span>{secretInfo.categoryBadge || 'NIVEL 1'}</span>
                </div>
              </div>

              <div className="role-pill-wrap">
                <div className="civil-badge">
                  <ShieldCheck size={16} className="civil-shield-icon" />
                  <span>ERES CIVIL</span>
                </div>
              </div>

              <div className="secret-word-section">
                <div className="secret-word-line"></div>
                <span className="secret-word-label">PALABRA CLAVE</span>
                <h1 className="secret-word-display">{secretInfo.word}</h1>
                <div className="secret-word-line"></div>
              </div>
            </div>

            <div className="reveal-memo">
              <EyeOff size={16} className="memo-icon" />
              <span>Memoriza tu palabra. No podrás volver a verla.</span>
            </div>

            <div className="reveal-actions">
              <button className="btn-primary" onClick={nextPlayerTurn}>
                <span className="touch-icon">👆</span>
                <span>YA LA VI, PASAR AL SIGUIENTE</span>
              </button>

              <div className="next-player-info-card">
                <RotateCcw size={16} className="next-icon" />
                <span>
                  {nextPlayer
                    ? `Siguiente turno: Jugador ${currentTurnIndex + 2} (${nextPlayer.name})`
                    : '¡Último jugador! Siguiente: Ronda de Pistas'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VISTA IMPOSTOR (Figma 1:611) ===================== */}
        {isImpostor && (
          <div className="impostor-view">
            <div className="impostor-top-bar">
              <div className="badge-pill badge-red attention-pill">
                <AlertTriangle size={14} />
                <span>¡ATENCIÓN!</span>
              </div>
              <div className="impostor-turn-text">
                JUGADOR {currentTurnIndex + 1} DE {totalPlayers} <span className="red-dot"></span>
              </div>
            </div>

            <div className="neo-card impostor-dossier-card">
              {/* Banner rojo: ERES EL IMPOSTOR */}
              <div className="impostor-alert-banner">
                <EyeOff size={20} />
                <span>ERES EL IMPOSTOR</span>
              </div>

              {/* Categoría del sector */}
              <div className="sector-category-wrap">
                <span className="sector-label">CATEGORÍA DEL SECTOR</span>
                <div className="sector-tag">
                  <Gamepad2 size={16} />
                  <span>{secretInfo.categoryName}</span>
                </div>
              </div>

              {/* Tarjeta de Palabra oculta y pista de camuflaje */}
              <div className="impostor-inner-card">
                <div className="inner-card-top">
                  <span className="inner-label">PALABRA SECRETA</span>
                  <Lock size={15} color="#C24128" />
                </div>

                <div className="censored-word-row">
                  <span className="censored-text">PALABRA OCULTA</span>
                  <span className="badge-pill badge-neutral censored-badge">CENSURADA</span>
                </div>

                {/* Subtarjeta blanca con Pista */}
                <div className="camouflage-box">
                  <div className="camouflage-header">
                    <span className="question-circle">?</span>
                    <span className="camouflage-title">PISTA DE CAMUFLAJE</span>
                  </div>
                  <h2 className="camouflage-text">{secretInfo.hint}</h2>
                </div>
              </div>
            </div>

            <div className="reveal-actions">
              <button className="btn-primary" onClick={nextPlayerTurn}>
                <Check size={18} />
                <span>Ya la vi, pasar al siguiente</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .reveal-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        /* ESTILOS CIVIL */
        .civil-view {
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }

        .turn-indicator-pill {
          display: inline-flex;
          align-self: flex-start;
          background-color: #EFECE6;
          border-radius: var(--radius-full);
          padding: 6px 14px;
        }

        .player-num-text {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .secret-dossier-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 28px 20px;
          gap: 24px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-neo);
        }

        .dossier-header {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .dossier-title-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dossier-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.06em;
        }

        .dossier-category {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .category-symbol {
          color: var(--primary-red);
        }

        .level-badge {
          background-color: #F1ECE4;
          font-size: 0.68rem;
          padding: 4px 8px;
        }

        .role-pill-wrap {
          display: flex;
          justify-content: center;
        }

        .civil-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #F3EFEA;
          border: 1px solid var(--border-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: 0.04em;
        }

        .civil-shield-icon {
          color: var(--primary-red);
        }

        .secret-word-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 0;
        }

        .secret-word-line {
          width: 50px;
          height: 2px;
          background-color: #E2DDD5;
          border-radius: 2px;
        }

        .secret-word-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .secret-word-display {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-main);
          text-align: center;
          letter-spacing: -0.02em;
          line-height: 1.15;
          word-break: break-word;
        }

        .reveal-memo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
          text-align: center;
        }

        .memo-icon {
          color: var(--text-muted);
        }

        .reveal-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .touch-icon {
          font-size: 1.1rem;
        }

        .next-player-info-card {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .next-icon {
          color: var(--text-muted);
        }

        /* ESTILOS IMPOSTOR */
        .impostor-view {
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }

        .impostor-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .attention-pill {
          background-color: var(--primary-red);
          color: #FFFFFF;
          padding: 6px 14px;
        }

        .impostor-turn-text {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .red-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary-red);
          border-radius: 50%;
        }

        .impostor-dossier-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 20px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-neo);
        }

        .impostor-alert-banner {
          background-color: var(--primary-red);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .sector-category-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sector-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .sector-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-card-subtle);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          align-self: flex-start;
        }

        .impostor-inner-card {
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .inner-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .inner-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .censored-word-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .censored-text {
          font-size: 1.4rem;
          font-weight: 900;
          color: #B5AFA7;
          text-decoration: line-through;
          letter-spacing: 0.04em;
        }

        .censored-badge {
          background-color: #E2DDD5;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .camouflage-box {
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .camouflage-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .question-circle {
          width: 16px;
          height: 16px;
          border: 1.5px solid var(--primary-red);
          color: var(--primary-red);
          border-radius: 50%;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camouflage-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.04em;
        }

        .camouflage-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}
