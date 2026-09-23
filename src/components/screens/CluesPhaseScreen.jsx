import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, ArrowRight, Lightbulb, Play, Pause, RotateCcw } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function CluesPhaseScreen() {
  const {
    assignedPlayers,
    firstCluePlayer,
    currentRound,
    setCurrentScreen
  } = useGame();

  const alivePlayers = assignedPlayers.filter(p => p.isAlive);

  // Temporizador para debate/pistas
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsLeft(90);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle={`Ronda ${currentRound} • Pistas & Debate`}
        showBack={false}
      />

      <main className="clues-content">
        <div className="clues-header">
          <div className="badge-pill badge-neutral round-pill">
            <span className="red-dot"></span>
            <span>FASE DE PISTAS • RONDA {currentRound}</span>
          </div>
          <h1 className="clues-title">Ronda de Pistas</h1>
          <p className="clues-subtitle">
            Cada jugador en la mesa dirá una palabra o pista corta en voz alta.
          </p>
        </div>

        {/* Tarjeta de quién inicia */}
        <div className="neo-card starter-card">
          <div className="starter-header">
            <MessageSquare size={18} className="starter-icon" />
            <span className="starter-label">INICIA LA RONDA</span>
          </div>
          <div className="starter-player-name">
            {firstCluePlayer}
          </div>
          <p className="starter-instruction">
            Sigan el turno en el sentido de las agujas del reloj alrededor de la mesa.
          </p>
        </div>

        {/* Participantes activos en la mesa */}
        <div className="neo-card table-players-card">
          <div className="table-header">
            <div className="table-title-group">
              <Users size={16} />
              <span className="table-title">JUGADORES EN LA MESA</span>
            </div>
            <span className="badge-pill badge-red">{alivePlayers.length} activos</span>
          </div>

          <div className="alive-players-list">
            {alivePlayers.map((player) => (
              <div key={player.id} className="alive-chip">
                <span className="chip-avatar-letter">{player.letter}</span>
                <span className="chip-player-name">{player.name}</span>
                {player.name === firstCluePlayer && (
                  <span className="first-badge">1°</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Temporizador de debate opcional */}
        <div className="neo-card timer-card">
          <div className="timer-header">
            <Clock size={16} className="clock-icon" />
            <span className="timer-title">TIEMPO DE DISCUSIÓN</span>
          </div>
          <div className="timer-display-row">
            <span className="timer-number">{formatTime(secondsLeft)}</span>
            <div className="timer-controls">
              <button
                type="button"
                className="timer-btn"
                onClick={toggleTimer}
                aria-label={isTimerRunning ? 'Pausar' : 'Iniciar'}
              >
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                className="timer-btn"
                onClick={resetTimer}
                aria-label="Reiniciar tiempo"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Consejo */}
        <div className="tactical-box">
          <div className="tactical-header">
            <Lightbulb size={16} className="bulb-icon" />
            <span className="tactical-title">CONSEJO PRO</span>
          </div>
          <p className="tactical-text">
            No seas demasiado específico para no revelar el secreto al impostor, ni demasiado vago para no parecer culpable.
          </p>
        </div>

        {/* Botón hacia la votación (Figma 1:861) */}
        <div className="clues-actions">
          <button className="btn-primary" onClick={() => setCurrentScreen('VOTING')}>
            <span>Ir a Votación</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <style>{`
        .clues-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }

        .clues-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .round-pill {
          align-self: flex-start;
          margin-bottom: 4px;
        }

        .red-dot {
          width: 6px;
          height: 6px;
          background-color: var(--primary-red);
          border-radius: 50%;
        }

        .clues-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .clues-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .starter-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 22px 18px;
          background-color: var(--bg-card-subtle);
          border: 2px solid var(--border-dark);
        }

        .starter-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .starter-icon {
          color: var(--primary-red);
        }

        .starter-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.08em;
        }

        .starter-player-name {
          font-size: 2.1rem;
          font-weight: 900;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .starter-instruction {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .table-players-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .table-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-main);
        }

        .table-title {
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .alive-players-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .alive-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .chip-avatar-letter {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--primary-red);
        }

        .first-badge {
          background-color: var(--primary-red);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 8px;
        }

        .timer-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
        }

        .timer-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clock-icon {
          color: var(--primary-red);
        }

        .timer-title {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .timer-display-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .timer-number {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
          font-variant-numeric: tabular-nums;
        }

        .timer-controls {
          display: flex;
          gap: 6px;
        }

        .timer-btn {
          width: 32px;
          height: 32px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-dark);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .tactical-box {
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
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
          font-size: 0.8rem;
          color: var(--text-main);
          line-height: 1.35;
        }

        .clues-actions {
          margin-top: auto;
          padding-top: 6px;
        }
      `}</style>
    </div>
  );
}
