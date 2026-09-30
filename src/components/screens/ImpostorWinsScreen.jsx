import React from 'react';
import { RotateCcw, Home, Lock, UserX, Trophy } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function ImpostorWinsScreen() {
  const {
    assignedPlayers,
    secretInfo,
    roundHistory,
    currentRound,
    startNewGame,
    returnToHome,
    withClues,
    isAllImpostorsRound
  } = useGame();

  const playersList = assignedPlayers || [];
  const allImpostors = playersList.filter(p => p && p.isImpostor);
  const aliveImpostors = allImpostors.filter(p => p.isAlive);
  const winnerNames = aliveImpostors.map(p => p.name).join(' y ') || 'Infiltrado';
  const aliveCivilians = playersList.filter(p => !p.isImpostor && p.isAlive).length;

  const getThemeText = (rawCategory) => {
    if (!rawCategory) return 'Tema: General';
    const parts = rawCategory.split(/[›\->]/);
    const sub = parts[parts.length - 1].trim();
    const formatted = sub ? sub.charAt(0).toUpperCase() + sub.slice(1) : rawCategory;
    return `Tema: ${formatted}`;
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle={isAllImpostorsRound ? "¡Giro Inesperado!" : "Round Result"}
        showBack={true}
        onBack={returnToHome}
      />

      <main className="impostor-win-content">
        {isAllImpostorsRound ? (
          <div className="impostor-win-header">
            <div className="badge-pill badge-red" style={{ margin: '0 auto 8px auto', width: 'fit-content' }}>
              <span>😱 RONDA SECRETA DE PARANOIA</span>
            </div>
            <h1 className="impostor-win-title" style={{ color: '#E11D48' }}>
              ¡TODOS ERAN<br />
              <span className="ha-ganado-text">IMPOSTORES!</span>
            </h1>
            <p className="impostor-win-desc">
              ¡Nadie conocía la palabra secreta ni tenía pistas! Todos estuvieron fingiendo, mintiendo y sospechando entre sí durante toda la ronda.
            </p>
          </div>
        ) : (
          <div className="impostor-win-header">
            <h1 className="impostor-win-title">
              ¡{aliveImpostors.length === 1 ? 'EL IMPOSTOR' : 'LOS IMPOSTORES'}<br />
              <span className="ha-ganado-text">
                {aliveImpostors.length === 1 ? 'HA GANADO!' : 'HAN GANADO!'}
              </span>
            </h1>
            <p className="impostor-win-desc">
              Los impostores igualaron en número a los civiles ({aliveImpostors.length} Impostores = {aliveCivilians} Civiles). El engaño fue total y se apoderaron del control definitivo de la sala.
            </p>
          </div>
        )}

        {/* 1. QUIÉN GANÓ / SPOTLIGHT */}
        {isAllImpostorsRound ? (
          <div className="neo-card paranoia-spotlight-card">
            <div className="winner-card-top">
              <div className="winner-pill-tag paranoia-pill">
                <span>🎭</span>
                <span>ENGAÑO COLECTIVO TOTAL</span>
              </div>
              <span className="badge-pill badge-red">CAOS MÁXIMO</span>
            </div>

            <div className="paranoia-avatars-wrap">
              {allImpostors.map(p => (
                <div
                  key={p.id}
                  className="winner-avatar-disc paranoia-avatar-disc"
                  style={{ backgroundColor: p.color || '#C24128' }}
                  title={p.name}
                >
                  <span>{p.letter}</span>
                  <span className="crown-badge">🤡</span>
                </div>
              ))}
            </div>

            <div className="paranoia-text-box">
              <span className="winner-sub-label">Todos jugaron a ciegas:</span>
              <h2 className="winner-main-names">¡Nadie sabía nada!</h2>
              <span className="winner-triumph-caption">
                Cada jugador pensó que era el único impostor sufriendo sin pistas, inventando palabras para no levantar sospechas.
              </span>
            </div>
          </div>
        ) : (
          <div className="neo-card winner-spotlight-card">
            <div className="winner-card-top">
              <div className="winner-pill-tag">
                <Trophy size={14} color="#FBBF24" />
                <span>{aliveImpostors.length === 1 ? 'GANADOR DE LA PARTIDA' : 'GANADORES DE LA PARTIDA'}</span>
              </div>
              <span className="badge-pill badge-green-glow">SOBREVIVIÓ</span>
            </div>

            <div className="winner-profile-row">
              <div className="winner-avatar-group">
                {aliveImpostors.map(p => (
                  <div
                    key={p.id}
                    className="winner-avatar-disc"
                    style={{ backgroundColor: p.color || '#C24128' }}
                  >
                    <span>{p.letter}</span>
                    <span className="crown-badge">👑</span>
                  </div>
                ))}
              </div>

              <div className="winner-text-col">
                <span className="winner-sub-label">
                  {aliveImpostors.length === 1 ? 'Infiltrado que quedó vivo:' : 'Infiltrados que quedaron vivos:'}
                </span>
                <h2 className="winner-main-names">{winnerNames}</h2>
                <span className="winner-triumph-caption">
                  {aliveImpostors.length === 1
                    ? 'Engañó a toda la mesa, esquivó las sospechas y se llevó la victoria.'
                    : 'Lograron mantenerse con vida y sellar el triunfo del equipo infiltrado.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. QUIÉNES ERAN LOS IMPOSTORES: Lista de todos los infiltrados */}
        <div className="neo-card all-impostors-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <span className="section-emoji">🎭</span>
              <h3 className="section-title">
                {isAllImpostorsRound ? "¿Quiénes eran los impostores? ¡TODOS!" : "¿Quiénes eran los impostores?"}
              </h3>
            </div>
            <span className="badge-pill badge-red">
              {isAllImpostorsRound ? "100% de la mesa" : `${allImpostors.length} ${allImpostors.length === 1 ? 'infiltrado' : 'infiltrados'} en total`}
            </span>
          </div>

          <div className="impostor-roster-list">
            {allImpostors.map(imp => {
              const isAlive = imp.isAlive;
              const elimEntry = roundHistory.find(r => r.player === imp.name && r.wasImpostor);
              return (
                <div
                  key={imp.id}
                  className={`roster-item ${isAlive ? 'roster-alive' : 'roster-eliminated'}`}
                >
                  <div
                    className="roster-avatar"
                    style={{ backgroundColor: imp.color || '#C24128' }}
                  >
                    {imp.letter}
                  </div>

                  <div className="roster-info">
                    <div className="roster-title-row">
                      <span className="roster-name">{imp.name}</span>
                      {isAllImpostorsRound ? (
                        isAlive ? (
                          <span className="roster-badge badge-alive" style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>
                            <span>🤡 Fingió hasta el final</span>
                          </span>
                        ) : (
                          <span className="roster-badge badge-dead">
                            <UserX size={11} />
                            <span>Fue acusado (¡era impostor!)</span>
                          </span>
                        )
                      ) : (
                        isAlive ? (
                          <span className="roster-badge badge-alive">
                            <Trophy size={11} />
                            <span>¡GANÓ! (VIVO)</span>
                          </span>
                        ) : (
                          <span className="roster-badge badge-dead">
                            <UserX size={11} />
                            <span>{elimEntry ? `Eliminado en R${elimEntry.round}` : 'Eliminado'}</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card: Palabra Oculta Jamás Revelada */}
        <div className="neo-card secret-unrevealed-card">
          <div className="secret-unrevealed-header">
            <span className="unrevealed-label">
              {isAllImpostorsRound ? "LA PALABRA QUE NADIE CONOCÍA" : "PALABRA OCULTA JAMÁS REVELADA"}
            </span>
            <span className="unrevealed-category">{getThemeText(secretInfo?.categoryName)}</span>
          </div>
          <div className="unrevealed-word-row">
            <Lock size={18} color="#C24128" />
            <span className="unrevealed-word">{secretInfo?.word || 'Palabra Secreta'}</span>
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
          box-sizing: border-box;
          max-width: 100%;
          overflow-x: hidden;
        }

        .impostor-win-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .impostor-win-title {
          font-size: clamp(1.8rem, 6.5vw, 2.3rem);
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

        /* 1. WINNER SPOTLIGHT CARD */
        .winner-spotlight-card,
        .paranoia-spotlight-card {
          padding: 16px;
          background: linear-gradient(135deg, #FFFDF8 0%, #FEF3C7 100%);
          border: 2.5px solid #1C1917;
          box-shadow: 4px 4px 0px #1C1917;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          max-width: 100%;
          overflow: hidden;
        }

        .paranoia-spotlight-card {
          background: linear-gradient(135deg, #FFFDF8 0%, #FFF1F2 100%);
          border-color: #E11D48;
        }

        .winner-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .paranoia-pill {
          background-color: #FFF1F2 !important;
          color: #E11D48 !important;
          border: 1.5px solid #FECDD3 !important;
        }

        .paranoia-avatars-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 6px 2px;
          width: 100%;
          box-sizing: border-box;
        }

        .paranoia-avatar-disc {
          width: 44px;
          height: 44px;
          font-size: 1.15rem;
          flex-shrink: 0;
        }

        .paranoia-text-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }

        .winner-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #1C1917;
          color: #FBBF24;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .badge-green-glow {
          background-color: #ECFDF5;
          color: #059669;
          border: 1.5px solid #059669;
          font-weight: 800;
          font-size: 0.65rem;
          padding: 2px 8px;
        }

        .winner-profile-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .winner-avatar-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
        }

        .winner-avatar-disc {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2.5px solid #1C1917;
          box-shadow: 2px 2px 0px #1C1917;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 1.35rem;
          font-weight: 900;
          position: relative;
        }

        .crown-badge {
          position: absolute;
          top: -10px;
          right: -8px;
          font-size: 1.15rem;
          filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.5));
        }

        .winner-text-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .winner-sub-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #92400E;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .winner-main-names {
          font-size: 1.45rem;
          font-weight: 900;
          color: #1C1917;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .winner-triumph-caption {
          font-size: 0.76rem;
          color: #78350F;
          line-height: 1.3;
          margin-top: 2px;
        }

        /* 2. ¿QUIÉNES ERAN LOS IMPOSTORES? CARD */
        .all-impostors-card {
          padding: 16px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          box-shadow: var(--shadow-neo);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .impostor-roster-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .roster-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
        }

        .roster-item.roster-alive {
          background-color: #ECFDF5;
          border: 1.5px solid #059669;
          box-shadow: 2px 2px 0px #059669;
        }

        .roster-item.roster-eliminated {
          background-color: #F9FAFB;
          border: 1.5px dashed #9CA3AF;
          opacity: 0.8;
        }

        .roster-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--border-dark);
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .roster-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .roster-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .roster-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .roster-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .badge-alive {
          background-color: #059669;
          color: #FFFFFF;
        }

        .badge-dead {
          background-color: #E5E7EB;
          color: #6B7280;
        }

        .roster-hint {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.25;
        }

        .roster-hint strong {
          color: var(--text-main);
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
