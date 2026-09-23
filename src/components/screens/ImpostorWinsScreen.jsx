import React from 'react';
import { RotateCcw, Home, Lock, TrendingUp, Flag, UserX } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function ImpostorWinsScreen() {
  const {
    assignedPlayers,
    secretInfo,
    roundHistory,
    currentRound,
    startNewGame,
    returnToHome
  } = useGame();

  const impostors = assignedPlayers.filter(p => p.isImpostor);
  const impostorNames = impostors.map(p => p.name).join(' y ');
  const aliveCivilians = assignedPlayers.filter(p => !p.isImpostor && p.isAlive).length;
  const aliveImpostors = assignedPlayers.filter(p => p.isImpostor && p.isAlive).length;

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Round Result"
        showBack={true}
        onBack={returnToHome}
      />

      <main className="impostor-win-content">
        <div className="impostor-win-header">
          <h1 className="impostor-win-title">
            ¡EL IMPOSTOR<br />
            <span className="ha-ganado-text">HA GANADO!</span>
          </h1>
          <p className="impostor-win-desc">
            Los impostores igualaron en número a los civiles ({aliveImpostors} Impostores = {aliveCivilians} Civiles). El engaño fue total y se apoderaron del control definitivo de la sala.
          </p>
        </div>

        {/* Card: Agente Infiltrado */}
        <div className="neo-card agent-card">
          <div className="agent-row">
            <div className="agent-avatar-frame">
              <img src="/impostor-logo.png" alt="Impostor Mascot" className="agent-mascot-img" />
            </div>
            <div className="agent-details">
              <div className="agent-tag-row">
                <span className="agent-label">AGENTE INFILTRADO</span>
                <span className="badge-pill badge-dark exito-badge">ÉXITO</span>
              </div>
              <h2 className="agent-names">{impostorNames}</h2>
              <span className="agent-subtext">Identidades desclasificadas</span>
            </div>
          </div>
        </div>

        {/* Card: Palabra Oculta Jamás Revelada */}
        <div className="neo-card secret-unrevealed-card">
          <div className="secret-unrevealed-header">
            <span className="unrevealed-label">PALABRA OCULTA JAMÁS REVELADA</span>
            <span className="unrevealed-category">Categoría: {secretInfo.categoryName}</span>
          </div>
          <div className="unrevealed-word-row">
            <Lock size={18} color="#C24128" />
            <span className="unrevealed-word">{secretInfo.word}</span>
          </div>
        </div>

        {/* Card: Pista Maestra de Camuflaje */}
        <div className="neo-card master-hint-card">
          <span className="master-hint-label">PISTA MAESTRA DE CAMUFLAJE</span>
          <p className="master-hint-quote">“{secretInfo.hint}”</p>
          <div className="master-hint-footer">
            <span>Persuadió con éxito a los civiles en la mesa</span>
          </div>
        </div>

        {/* Card: Cronología de la mesa (Figma 5:122) */}
        <div className="neo-card chronology-card">
          <div className="chronology-header">
            <div className="chronology-title-wrap">
              <TrendingUp size={16} className="trend-icon" />
              <span className="chronology-title">CRONOLOGÍA DE LA MESA</span>
            </div>
            <span className="badge-pill badge-neutral">{currentRound} Rondas</span>
          </div>

          <div className="chronology-timeline">
            {roundHistory.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-num">{item.round}</div>
                <div className="timeline-details">
                  <span className="timeline-player-name">{item.player} eliminada</span>
                  <span className="timeline-player-role">{item.roleDescription}</span>
                </div>
                <UserX size={16} className="timeline-icon" />
              </div>
            ))}

            {/* Fila final: Jaque Mate Infiltrado */}
            <div className="timeline-final-banner">
              <div className="final-banner-left">
                <Flag size={16} color="#FFFFFF" />
                <div className="final-banner-texts">
                  <span className="final-title">Jaque Mate Infiltrado</span>
                  <span className="final-sub">{aliveCivilians} Civiles vs {aliveImpostors} Impostores</span>
                </div>
              </div>
              <span className="final-badge">FIN</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="impostor-win-actions">
          <button className="btn-primary" onClick={startNewGame}>
            <RotateCcw size={18} />
            <span>JUGAR REVANCHA</span>
          </button>

          <button className="btn-secondary" onClick={returnToHome}>
            <Home size={18} />
            <span>VOLVER AL MENÚ PRINCIPAL</span>
          </button>
        </div>
      </main>

      <style>{`
        .impostor-win-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .impostor-win-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .impostor-win-title {
          font-size: 2.3rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .ha-ganado-text {
          color: var(--primary-red);
          text-decoration: underline;
          text-underline-offset: 6px;
        }

        .impostor-win-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .agent-card {
          padding: 16px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
        }

        .agent-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .agent-avatar-frame {
          width: 58px;
          height: 58px;
          background-color: #1C1917;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .agent-mascot-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }

        .agent-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .agent-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .agent-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.05em;
        }

        .exito-badge {
          background-color: #991B1B;
          color: #FFFFFF;
          font-size: 0.62rem;
          padding: 2px 6px;
        }

        .agent-names {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .agent-subtext {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .secret-unrevealed-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px 16px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
        }

        .secret-unrevealed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .unrevealed-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .unrevealed-category {
          font-size: 0.72rem;
          color: var(--primary-red);
          font-weight: 700;
        }

        .unrevealed-word-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .unrevealed-word {
          font-size: 1.35rem;
          font-weight: 900;
          color: var(--text-main);
        }

        .master-hint-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
        }

        .master-hint-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .master-hint-quote {
          font-size: 1.05rem;
          font-weight: 700;
          font-style: italic;
          color: var(--text-main);
        }

        .master-hint-footer {
          font-size: 0.74rem;
          color: var(--text-muted);
          text-align: right;
        }

        .chronology-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background-color: var(--bg-card-subtle);
        }

        .chronology-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chronology-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .trend-icon {
          color: var(--primary-red);
        }

        .chronology-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-main);
        }

        .chronology-timeline {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 10px 14px;
        }

        .timeline-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #EFECE6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .timeline-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin-left: 12px;
        }

        .timeline-player-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .timeline-player-role {
          font-size: 0.72rem;
          color: var(--primary-red);
        }

        .timeline-icon {
          color: var(--primary-red);
        }

        .timeline-final-banner {
          background-color: var(--primary-red);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .final-banner-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .final-banner-texts {
          display: flex;
          flex-direction: column;
        }

        .final-title {
          font-size: 0.95rem;
          font-weight: 800;
        }

        .final-sub {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .final-badge {
          background-color: rgba(0, 0, 0, 0.25);
          font-size: 0.68rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .impostor-win-actions {
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
