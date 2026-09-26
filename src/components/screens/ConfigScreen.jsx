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
  Info,
  Clock
} from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';
import { GENERAL_SUBTOPICS } from '../../data/categories';

export default function ConfigScreen() {
  const {
    playerNames,
    addPlayer,
    removePlayer,
    impostorCount,
    setImpostorCount,
    withClues,
    setWithClues,
    discussionTime,
    setDiscussionTime,
    mainCategory,
    setMainCategory,
    activeSubtopics,
    toggleSubtopic,
    startNewGame,
    setCurrentScreen,
    currentGeneralSubtopics
  } = useGame();

  const [inputName, setInputName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [customTimeInput, setCustomTimeInput] = useState(String(discussionTime));

  const handleCustomTimeChange = (e) => {
    const val = e.target.value;
    setCustomTimeInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDiscussionTime(Math.min(999, parsed));
    }
  };

  const handleCustomTimeBlur = () => {
    const parsed = parseInt(customTimeInput, 10);
    if (isNaN(parsed) || parsed < 5) {
      setDiscussionTime(30);
      setCustomTimeInput('30');
    } else {
      const clamped = Math.min(999, Math.max(5, parsed));
      setDiscussionTime(clamped);
      setCustomTimeInput(String(clamped));
    }
  };

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

  const maxImpostors = Math.max(1, Math.floor((playerNames.length - 1) / 2));

  const handleDecrementImpostors = () => {
    if (impostorCount > 1) {
      setImpostorCount(prev => prev - 1);
    }
  };

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
            Ajusta los participantes, tiempo y temática para esta ronda.
          </p>
        </div>

        {/* Card 1: Participantes */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <Users size={18} className="section-icon" />
              <h2 className="section-title">Participantes</h2>
            </div>
            <span className={`badge-pill ${playerNames.length >= 3 ? 'badge-red' : 'badge-neutral'}`}>
              {playerNames.length} {playerNames.length === 1 ? 'añadido' : 'añadidos'}
            </span>
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

          {playerNames.length === 0 ? (
            <div className="empty-players-box">
              <p className="empty-players-msg">
                Aún no hay participantes en la lista.<br />
                Escribe un nombre y pulsa <strong>Añadir</strong> (mínimo 3 jugadores).
              </p>
            </div>
          ) : (
            <div className="players-chips-wrap">
              {playerNames.map((name, index) => (
                <div key={index} className="player-chip">
                  <span className="chip-avatar">{name.charAt(0).toUpperCase()}</span>
                  <span className="chip-name">{name}</span>
                  <button
                    type="button"
                    className="chip-remove-btn"
                    onClick={() => removePlayer(name)}
                    aria-label={`Eliminar a ${name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="card-info-footer">
            <Info size={14} className="info-icon" />
            <span>
              {playerNames.length < 3
                ? `Mínimo 3 jugadores para iniciar (faltan ${3 - playerNames.length})`
                : '¡Mesa completa! Puedes añadir hasta 12 jugadores'}
            </span>
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
              disabled={impostorCount >= maxImpostors || playerNames.length < 3}
              aria-label="Aumentar impostores"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="card-info-footer">
            <span className="red-dot"></span>
            <span>
              {playerNames.length < 3
                ? 'Agrega al menos 3 jugadores para configurar infiltrados'
                : `${impostorCount} ${impostorCount === 1 ? 'impostor' : 'impostores'} en esta sala`}
            </span>
          </div>
        </div>

        {/* Card 3: Modo de pistas (Con o Sin pista para el impostor) */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <span className="section-emoji">{withClues ? '💡' : '🕶️'}</span>
              <h2 className="section-title">Pistas de camuflaje</h2>
            </div>
            <span className={`badge-pill ${withClues ? 'badge-clue-active' : 'badge-neutral'}`}>
              {withClues ? 'CON PISTA' : 'SIN PISTA'}
            </span>
          </div>

          <div className="clue-toggle-container">
            <button
              type="button"
              className={`clue-mode-btn ${withClues ? 'active' : ''}`}
              onClick={() => setWithClues(true)}
              aria-label="Jugar con pista para el impostor"
            >
              <div className="clue-btn-icon">💡</div>
              <div className="clue-btn-info">
                <span className="clue-btn-title">JUGAR CON PISTA</span>
                <span className="clue-btn-desc">El impostor recibe una pista para orientarse y defenderse</span>
              </div>
              {withClues && <span className="clue-check-badge"><Check size={16} /></span>}
            </button>

            <button
              type="button"
              className={`clue-mode-btn ${!withClues ? 'active' : ''}`}
              onClick={() => setWithClues(false)}
              aria-label="Jugar sin pista para el impostor"
            >
              <div className="clue-btn-icon">🕶️</div>
              <div className="clue-btn-info">
                <span className="clue-btn-title">JUGAR SIN PISTA</span>
                <span className="clue-btn-desc">Modo difícil: el impostor juega a ciegas sin ninguna ayuda</span>
              </div>
              {!withClues && <span className="clue-check-badge"><Check size={16} /></span>}
            </button>
          </div>

          <div className="card-info-footer">
            <span className="red-dot"></span>
            <span>
              {withClues
                ? 'El infiltrado tendrá una frase de apoyo para disimular entre los civiles'
                : 'Modo hardcore: el impostor debe adivinar de qué hablan solo escuchando'}
            </span>
          </div>
        </div>

        {/* Card 4: Tiempo de discusión (Ronda de pistas) */}
        <div className="neo-card config-card">
          <div className="card-top-row">
            <div className="section-title-group">
              <Clock size={18} className="section-icon" />
              <h2 className="section-title">Tiempo de debate</h2>
            </div>
            <span className="badge-pill badge-red">{discussionTime}s por ronda</span>
          </div>

          <div className="time-chips-wrap">
            {[30, 45, 60, 90, 120, 180].map((timeSecs) => (
              <button
                key={timeSecs}
                type="button"
                className={`time-chip ${discussionTime === timeSecs ? 'active' : ''}`}
                onClick={() => {
                  setDiscussionTime(timeSecs);
                  setCustomTimeInput(String(timeSecs));
                }}
              >
                {timeSecs < 60 ? `${timeSecs}s` : `${timeSecs / 60}m`}
              </button>
            ))}
          </div>

          {/* Opción de escribir el tiempo deseado manualmente */}
          <div className="custom-time-row">
            <span className="custom-time-label">O escribe la cantidad exacta:</span>
            <div className="custom-time-input-group">
              <input
                type="number"
                min="5"
                max="999"
                className="custom-time-input"
                placeholder="Ej. 75"
                value={customTimeInput}
                onChange={handleCustomTimeChange}
                onBlur={handleCustomTimeBlur}
              />
              <span className="custom-time-unit">seg</span>
            </div>
          </div>

          <div className="card-info-footer">
            <span className="red-dot"></span>
            <span>Sonará una alarma acústica en el celular cuando el tiempo finalice</span>
          </div>
        </div>

        {/* Card 4: Categoría principal */}
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
                {(currentGeneralSubtopics || GENERAL_SUBTOPICS).map((sub) => {
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
          <button
            className="btn-primary"
            onClick={startNewGame}
            disabled={playerNames.length < 3}
            style={{
              opacity: playerNames.length < 3 ? 0.45 : 1,
              cursor: playerNames.length < 3 ? 'not-allowed' : 'pointer'
            }}
          >
            <span>Comenzar partida</span>
            <ArrowRight size={18} />
          </button>
          <p className="action-caption">
            {playerNames.length < 3
              ? 'Añade al menos 3 jugadores para poder iniciar la partida.'
              : 'La pantalla se bloqueará para el primer jugador al pulsar iniciar.'}
          </p>
        </div>
      </main>

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

        .empty-players-box {
          background-color: #FAF8F5;
          border: 1.5px dashed var(--border-light);
          border-radius: var(--radius-md);
          padding: 16px;
          text-align: center;
        }

        .empty-players-msg {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .empty-players-msg strong {
          color: var(--primary-red);
        }

        .time-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .time-chip {
          padding: 8px 16px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s;
        }

        .time-chip:hover {
          border-color: var(--primary-red);
          background-color: var(--bg-accent-light);
        }

        .time-chip.active {
          background-color: var(--primary-red);
          border-color: var(--border-dark);
          color: #FFFFFF;
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .custom-time-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background-color: #FAF8F5;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          margin-top: 4px;
        }

        .custom-time-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          flex: 1;
        }

        .custom-time-input-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-dark);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          box-shadow: 1px 1px 0px var(--border-dark);
        }

        .custom-time-input {
          width: 54px;
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--primary-red);
          text-align: center;
          outline: none;
        }

        .custom-time-unit {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
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

        /* MODO DE PISTAS (CON / SIN PISTA) */
        .badge-clue-active {
          background-color: var(--primary-red);
          color: #FFFFFF;
        }

        .clue-toggle-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .clue-mode-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
          box-shadow: 2px 2px 0px var(--border-dark);
          font-family: inherit;
        }

        .clue-mode-btn:hover {
          transform: translateY(-1px);
          box-shadow: 3px 3px 0px var(--border-dark);
        }

        .clue-mode-btn.active {
          background-color: var(--bg-accent-light);
          border-color: var(--primary-red);
          box-shadow: 3px 3px 0px var(--primary-red);
        }

        .clue-btn-icon {
          font-size: 1.5rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clue-btn-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .clue-btn-title {
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.03em;
          color: var(--text-main);
        }

        .clue-mode-btn.active .clue-btn-title {
          color: var(--primary-red);
        }

        .clue-btn-desc {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.25;
        }

        .clue-check-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--primary-red);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
