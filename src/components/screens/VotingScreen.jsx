import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';

export default function VotingScreen() {
  const {
    assignedPlayers,
    submitVote,
    setCurrentScreen
  } = useGame();

  const alivePlayers = assignedPlayers.filter(p => p.isAlive);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleConfirmVote = () => {
    if (!selectedPlayer) return;
    submitVote(selectedPlayer);
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Accusation And Vote"
        showBack={true}
        onBack={() => setCurrentScreen('CLUES')}
      />

      <main className="voting-content">
        <div className="voting-header">
          <h1 className="voting-title">¿Quién es el Impostor?</h1>
          <p className="voting-subtitle">
            Debatan las pistas y seleccionen al sospechoso para someterlo a juicio.
          </p>
        </div>

        {/* Lista de sospechosos seleccionables */}
        <div className="players-vote-list">
          {alivePlayers.map((player) => {
            const isSelected = selectedPlayer === player.name;
            return (
              <div
                key={player.id}
                className={`vote-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPlayer(player.name)}
              >
                <div className="vote-card-left">
                  <div className={`vote-avatar-box ${isSelected ? 'selected' : ''}`}>
                    {player.letter}
                  </div>
                  <span className="vote-player-name">{player.name}</span>
                  {isSelected && (
                    <span className="badge-pill badge-dark suspect-badge">
                      SOSPECHOSO
                    </span>
                  )}
                </div>

                <div className={`vote-check-circle ${isSelected ? 'selected' : ''}`}>
                  {isSelected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón de confirmar voto */}
        <div className="voting-actions">
          <button
            className="btn-primary"
            onClick={handleConfirmVote}
            disabled={!selectedPlayer}
            style={{ opacity: selectedPlayer ? 1 : 0.45 }}
          >
            <span>Confirmar voto</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <style>{`
        .voting-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .voting-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .voting-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .voting-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .players-vote-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vote-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease-in-out;
        }

        .vote-card:hover {
          background-color: #FAF8F5;
        }

        .vote-card.selected {
          background-color: var(--bg-accent-light);
          border: 2px solid var(--primary-red);
          box-shadow: 0 4px 12px rgba(194, 65, 40, 0.08);
        }

        .vote-card-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vote-avatar-box {
          width: 44px;
          height: 44px;
          background-color: #E6E1D8;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .vote-avatar-box.selected {
          background-color: var(--primary-red);
          color: #FFFFFF;
        }

        .vote-player-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .suspect-badge {
          background-color: #8C2210;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
        }

        .vote-check-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #D5CEC4;
          background-color: #EDE8E1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .vote-check-circle.selected {
          background-color: var(--primary-red);
          border-color: var(--primary-red);
        }

        .voting-actions {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
