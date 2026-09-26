import React from 'react';
import { Users, AlertTriangle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function InnocentEliminatedScreen() {
  const {
    lastEliminated,
    assignedPlayers,
    startNextRoundOfClues,
    returnToHome
  } = useGame();

  if (!lastEliminated) return null;

  const remainingCivilians = assignedPlayers.filter(p => !p.isImpostor && p.isAlive).length;
  const remainingImpostors = assignedPlayers.filter(p => p.isImpostor && p.isAlive).length;
  const isHighDanger = remainingCivilians - remainingImpostors <= 1;

  const wasImpostor = Boolean(lastEliminated.wasImpostor);

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Resultado de la Votación"
        showBack={true}
        onBack={returnToHome}
      />

      <main className="result-content">
        <div className="result-header">
          <span className="result-eyebrow">
            {wasImpostor ? '¡IMPOSTOR ELIMINADO!' : 'EXPULSIÓN INJUSTIFICADA'}
          </span>
          <h1 className="result-title">
            {wasImpostor
              ? `¡${lastEliminated.name} SÍ era el Impostor!`
              : `¡${lastEliminated.name} NO era el Impostor!`}
          </h1>
          <p className="result-desc">
            {wasImpostor
              ? `Los civiles han acertado en su deducción. ${lastEliminated.name} era un Agente Infiltrado y ha sido expulsado de la mesa.`
              : `Los civiles han cometido un grave error de deducción. ${lastEliminated.name} era una Civil Inocente y queda eliminada de la partida.`}
          </p>
        </div>

        {/* Card: Perfil del jugador eliminado */}
        <div className="neo-card eliminated-card">
          <div className="eliminated-avatar-wrap">
            <div className={`eliminated-avatar-box ${wasImpostor ? 'impostor-avatar-box' : ''}`}>
              {lastEliminated.letter}
            </div>
            <div className="cross-badge">
              <X size={14} color="#FFFFFF" strokeWidth={3} />
            </div>
          </div>

          <div className="eliminated-info">
            <div className="eliminated-name-row">
              <h2 className="eliminated-name">{lastEliminated.name}</h2>
              <span className="badge-pill badge-neutral">Expulsado/a</span>
            </div>

            <div className={`innocent-role-pill ${wasImpostor ? 'impostor-pill-dark' : 'civil-pill-green'}`}>
              {wasImpostor ? (
                <>
                  <span className="drama-icon">🎭</span>
                  <span>ROL: AGENTE INFILTRADO</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} color="#059669" strokeWidth={2.5} />
                  <span>ROL: CIVIL INOCENTE</span>
                </>
              )}
            </div>

            <p className="eliminated-note">
              {wasImpostor
                ? `¡Buen trabajo! Aún quedan ${remainingImpostors} impostores ocultos en la mesa.`
                : 'Queda descalificada de emitir votos y formular pistas en la siguiente ronda.'}
            </p>
          </div>
        </div>

        {/* Card: Balance de la mesa */}
        <div className="neo-card balance-card">
          <div className="balance-header">
            <span className="balance-title">BALANCE DE LA MESA</span>
            <span className="badge-pill badge-red">
              {wasImpostor ? 'Golpe Certero' : isHighDanger ? 'Tensión Máxima' : 'Partida en Curso'}
            </span>
          </div>

          <div className="balance-grid">
            <div className="sub-card balance-stat">
              <span className="balance-stat-num">{remainingCivilians}</span>
              <div className="balance-stat-label">
                <Users size={14} />
                <span>CIVILES RESTANTES</span>
              </div>
            </div>

            <div className="sub-card balance-stat">
              <span className="balance-stat-num" style={{ color: 'var(--primary-red)' }}>
                {remainingImpostors}
              </span>
              <div className="balance-stat-label">
                <span className="drama-icon">🎭</span>
                <span>IMPOSTORES OCULTOS</span>
              </div>
            </div>
          </div>

          {wasImpostor ? (
            <div className="success-alert-box">
              <span className="check-icon">🎯</span>
              <p className="danger-text" style={{ color: '#047857' }}>
                ¡Descubrieron a un infiltrado! Los civiles toman ventaja, pero la partida continúa hasta encontrar a todos.
              </p>
            </div>
          ) : isHighDanger ? (
            <div className="danger-alert-box">
              <AlertTriangle size={18} className="danger-icon" />
              <p className="danger-text">
                ¡Peligro inminente! Si cae un civil más, los impostores igualarán la mesa y ganarán la partida inmediatamente por superioridad táctica.
              </p>
            </div>
          ) : null}
        </div>

        {/* Acción: Siguiente ronda */}
        <div className="result-actions">
          <button className="btn-primary" onClick={startNextRoundOfClues}>
            <span>COMENZAR NUEVA RONDA DE PISTAS</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <style>{`
        .result-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .result-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result-eyebrow {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .result-title {
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .result-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .eliminated-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
        }

        .eliminated-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .eliminated-avatar-box {
          width: 58px;
          height: 58px;
          background-color: #EDE8E1;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-red);
        }

        .cross-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 22px;
          height: 22px;
          background-color: #B91C1C;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eliminated-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .eliminated-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .eliminated-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .innocent-role-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: var(--bg-accent-light);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.04em;
          align-self: flex-start;
        }

        .innocent-role-pill.civil-pill-green {
          background-color: #ECFDF5;
          border: 1px solid #059669;
          color: #047857;
        }

        .eliminated-note {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin-top: 2px;
        }

        .balance-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px;
          background-color: var(--bg-card-subtle);
        }

        .balance-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .balance-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-main);
        }

        .balance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .balance-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          padding: 14px 8px;
          background-color: #FFFFFF;
        }

        .balance-stat-num {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-main);
          line-height: 1;
        }

        .balance-stat-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .drama-icon {
          font-size: 0.85rem;
        }

        .danger-alert-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background-color: #FFF5F2;
          border: 1px solid #FED7D0;
          padding: 12px 14px;
          border-radius: var(--radius-md);
        }

        .danger-icon {
          color: var(--primary-red);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .danger-text {
          font-size: 0.78rem;
          color: var(--primary-red);
          line-height: 1.35;
          font-weight: 600;
        }

        .result-actions {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
