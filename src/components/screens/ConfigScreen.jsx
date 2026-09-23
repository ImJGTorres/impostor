import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  X,
  Minus,
  Plus,
  Check,
  GraduationCap,
  Globe,
  Gamepad2,
  Utensils,
  Clapperboard,
  Trophy,
  ArrowRight,
  Info
} from 'lucide-react';
import Header from '../common/Header';
import BottomNav from '../common/BottomNav';
import { useGame } from '../../context/GameContext';
import { GENERAL_SUBTOPICS } from '../../data/categories';

export default function ConfigScreen() {
  const {
    playerNames,
    addPlayer,
    removePlayer,
    impostorCount,
    setImpostorCount,
    mainCategory,
    setMainCategory,
    activeSubtopics,
    toggleSubtopic,
    startNewGame,
    setCurrentScreen
  } = useGame();

  const [inputName, setInputName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    const ok = addPlayer(inputName);
    if (ok) {
      setInputName('');
      setErrorMsg('');
    } else {
      setErrorMsg('Nombre duplicado o límite alcanzado (máx. 12)');
    }
  };

  const handleDecrementImpostors = () => {
    if (impostorCount > 1) {
      setImpostorCount(prev => prev - 1);
    }
  };

  const maxImpostors = Math.max(1, Math.floor((playerNames.length - 1) / 2));
  const handleIncrementImpostors = () => {
    if (impostorCount < maxImpostors) {
      setImpostorCount(prev => prev + 1);
    }
  };

  const getSubtopicIcon = (iconName) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 size={15} />;
      case 'Utensils': return <Utensils size={15} />;
      case 'Globe': return <Globe size={15} />;
      case 'Clapperboard': return <Clapperboard size={15} />;
      case 'Trophy': return <Trophy size={15} />;
      default: return null;
    }
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Lobby"
        showBack={true}
        onBack={() => setCurrentScreen('HOME')}
      />

      <main className="config-content">
        <div className="config-header">
          <h1 className="config-title">Configuración de partida</h1>
          <p className="config-subtitle">
            Ajusta los participantes y la baraja temática para esta ronda.
          </p>
        </div>

        {/* Card 1: Participantes */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <Users size={18} className="section-icon" />
              <h2 className="section-title">Participantes</h2>
            </div>
            <span className="badge-pill badge-red">{playerNames.length} añadidos</span>
          </div>

          <form onSubmit={handleAddSubmit} className="add-player-row">
            <input
              type="text"
              className="player-input"
              placeholder="Escribe un nombre (ej. Sofía)..."
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              maxLength={15}
            />
            <button type="submit" className="add-btn" aria-label="Añadir jugador">
              <UserPlus size={16} />
              <span>Añadir</span>
            </button>
          </form>

          {errorMsg && <p className="error-text">{errorMsg}</p>}

          <div className="players-chips-wrap">
            {playerNames.map((name, index) => (
              <div key={index} className="player-chip">
                <span className="chip-avatar">{name.charAt(0).toUpperCase()}</span>
                <span className="chip-name">{name}</span>
                {playerNames.length > 3 && (
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => removePlayer(name)}
                    aria-label={`Eliminar a ${name}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="card-info-footer">
            <Info size={14} className="info-icon" />
            <span>Mínimo 3 jugadores para iniciar</span>
          </div>
        </div>

        {/* Card 2: Número de impostores */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <span className="section-emoji">🎭</span>
              <h2 className="section-title">Número de impostores</h2>
            </div>
            <span className="badge-pill badge-red">Infiltrados</span>
          </div>

          <div className="stepper-row">
            <button
              type="button"
              className="stepper-btn"
              onClick={handleDecrementImpostors}
              disabled={impostorCount <= 1}
              aria-label="Disminuir impostores"
            >
              <Minus size={18} />
            </button>

            <div className="stepper-display">
              <span className="stepper-number">{impostorCount}</span>
              <span className="stepper-label">{impostorCount === 1 ? 'impostor' : 'impostores'}</span>
            </div>

            <button
              type="button"
              className="stepper-btn"
              onClick={handleIncrementImpostors}
              disabled={impostorCount >= maxImpostors}
              aria-label="Aumentar impostores"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="card-info-footer">
            <span className="red-dot"></span>
            <span>{impostorCount} {impostorCount === 1 ? 'impostor' : 'impostores'} en esta sala</span>
          </div>
        </div>

        {/* Card 3: Categoría principal */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <span className="section-emoji">🏷️</span>
              <h2 className="section-title">Categoría principal</h2>
            </div>
            <span className="category-hint">Elige la temática</span>
          </div>

          <div className="categories-grid">
            {/* Opción UFPS */}
            <div
              className={`category-card ${mainCategory === 'ufps' ? 'active' : ''}`}
              onClick={() => setMainCategory('ufps')}
            >
              <div className="cat-top">
                <span className="badge-pill badge-neutral">ESPECIAL</span>
                {mainCategory === 'ufps' && (
                  <span className="check-badge"><Check size={14} color="#C24128" /></span>
                )}
              </div>
              <h3 className="cat-title">UFPS</h3>
              <p className="cat-desc">Ing. de Sistemas, profes, campus...</p>
              <div className="cat-footer">
                <GraduationCap size={14} />
                <span>Cúcuta campus</span>
              </div>
            </div>

            {/* Opción General */}
            <div
              className={`category-card ${mainCategory === 'general' ? 'active' : ''}`}
              onClick={() => setMainCategory('general')}
            >
              <div className="cat-top">
                <span className={`badge-pill ${mainCategory === 'general' ? 'badge-red' : 'badge-neutral'}`}>
                  ACTIVO
                </span>
                {mainCategory === 'general' && (
                  <span className="check-badge"><Check size={14} color="#C24128" /></span>
                )}
              </div>
              <h3 className="cat-title">General</h3>
              <p className="cat-desc">Cultura pop, cine, comida y temas...</p>
              <div className="cat-footer">
                <Globe size={14} />
                <span>Variado clásico</span>
              </div>
            </div>
          </div>

          {/* Subtemas activos (visible cuando General está seleccionado) */}
          {mainCategory === 'general' && (
            <div className="subtopics-section">
              <div className="subtopics-header">
                <div className="subtopics-title-wrap">
                  <span className="subtopics-icon">⚏</span>
                  <span className="subtopics-title">SUBTEMAS ACTIVOS</span>
                </div>
                <span className="subtopics-count">{activeSubtopics.length} elegidos</span>
              </div>

              <div className="subtopics-pills-wrap">
                {GENERAL_SUBTOPICS.map((sub) => {
                  const isActive = activeSubtopics.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`subtopic-chip ${isActive ? 'active' : ''}`}
                      onClick={() => toggleSubtopic(sub.id)}
                    >
                      {getSubtopicIcon(sub.icon)}
                      <span>{sub.name}</span>
                      {isActive && <Check size={13} className="subtopic-check" />}
                    </button>
                  );
                })}
              </div>

              <p className="subtopics-hint">
                Toca cualquier tema para añadirlo a la baraja secreta.
              </p>
            </div>
          )}
        </div>

        {/* Botón de Iniciar */}
        <div className="config-actions">
          <button className="btn-primary" onClick={startNewGame}>
            <span>Comenzar partida</span>
            <ArrowRight size={18} />
          </button>
          <p className="action-caption">
            La pantalla se bloqueará para el primer jugador al pulsar iniciar.
          </p>
        </div>
      </main>

      <BottomNav />

      <style>{`
        .config-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .config-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .config-title {
          font-size: 1.55rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .config-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .config-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          color: var(--primary-red);
        }

        .section-emoji {
          font-size: 1.1rem;
        }

        .section-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .add-player-row {
          display: flex;
          gap: 8px;
        }

        .player-input {
          flex: 1;
          padding: 12px 14px;
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.88rem;
          color: var(--text-main);
          background-color: #FFFFFF;
          outline: none;
        }

        .player-input:focus {
          border-color: var(--primary-red);
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background-color: var(--primary-red);
          color: #FFFFFF;
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }

        .add-btn:hover {
          background-color: var(--primary-red-hover);
        }

        .error-text {
          color: var(--primary-red);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .players-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .player-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px 6px 8px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .chip-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: var(--bg-accent-light);
          color: var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .chip-name {
          line-height: 1;
        }

        .chip-remove-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
        }

        .chip-remove-btn:hover {
          color: var(--primary-red);
          background-color: rgba(0, 0, 0, 0.05);
        }

        .card-info-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .info-icon {
          color: var(--text-muted);
        }

        .red-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary-red);
        }

        .stepper-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-md);
          padding: 6px;
        }

        .stepper-btn {
          width: 44px;
          height: 44px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 1px 1px 0px var(--border-dark);
          transition: all 0.1s;
        }

        .stepper-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }

        .stepper-btn:not(:disabled):hover {
          background-color: #FAF8F5;
          transform: translate(-1px, -1px);
        }

        .stepper-display {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .stepper-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-red);
        }

        .stepper-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .category-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .category-card {
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .category-card.active {
          border: 2px solid var(--primary-red);
          background-color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(194, 65, 40, 0.08);
        }

        .cat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .check-badge {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid var(--primary-red);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .cat-desc {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.3;
          flex: 1;
        }

        .cat-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--primary-red);
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .subtopics-section {
          background-color: var(--bg-card-subtle);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subtopics-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .subtopics-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .subtopics-icon {
          font-size: 0.85rem;
          color: var(--primary-red);
        }

        .subtopics-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--text-main);
        }

        .subtopics-count {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary-red);
        }

        .subtopics-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .subtopic-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s;
        }

        .subtopic-chip.active {
          background-color: var(--bg-accent-light);
          border-color: var(--primary-red);
          color: var(--primary-red);
          font-weight: 700;
        }

        .subtopic-check {
          color: var(--primary-red);
        }

        .subtopics-hint {
          font-size: 0.76rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .config-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .action-caption {
          text-align: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
        }
      `}</style>
    </div>
  );
}
