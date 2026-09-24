import React, { useState } from 'react';
import { GraduationCap, Globe, Check, ArrowRight, BookOpen, Layers } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';
import { UFPS_CATEGORY, GENERAL_SUBTOPICS } from '../../data/categories';

export default function PacksScreen() {
  const {
    mainCategory,
    setMainCategory,
    setCurrentScreen,
    setActiveTab
  } = useGame();

  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'ufps' | 'general'

  const handleSelectPack = (packId) => {
    setMainCategory(packId);
    setActiveTab('lobby');
    setCurrentScreen('CONFIG');
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Barajas Temáticas"
        showBack={true}
        onBack={() => {
          setActiveTab('lobby');
          setCurrentScreen('HOME');
        }}
      />

      <main className="packs-content">
        <div className="packs-header">
          <h1 className="packs-title">Barajas de Palabras</h1>
          <p className="packs-subtitle">
            Explora los paquetes disponibles para tus partidas de deducción.
          </p>
        </div>

        {/* Filtros rápidos */}
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${activeTabFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTabFilter('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`filter-chip ${activeTabFilter === 'ufps' ? 'active' : ''}`}
            onClick={() => setActiveTabFilter('ufps')}
          >
            🎓 UFPS (Sistemas)
          </button>
          <button
            type="button"
            className={`filter-chip ${activeTabFilter === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTabFilter('general')}
          >
            🌎 General
          </button>
        </div>

        {/* Lista de Packs */}
        <div className="packs-list">
          {/* Pack UFPS */}
          {(activeTabFilter === 'all' || activeTabFilter === 'ufps') && (
            <div className={`pack-card ${mainCategory === 'ufps' ? 'selected' : ''}`}>
              <div className="pack-card-top">
                <div className="pack-brand-badge">
                  <GraduationCap size={16} color="#FFFFFF" />
                  <span>ESPECIAL UFPS</span>
                </div>
                {mainCategory === 'ufps' && (
                  <span className="badge-pill badge-red selected-pill">
                    <Check size={12} /> ACTIVO
                  </span>
                )}
              </div>

              <h2 className="pack-title">Ingeniería de Sistemas</h2>
              <p className="pack-desc">
                Diseñado exclusivamente para estudiantes y profesores de la Universidad Francisco de Paula Santander (Campus Cúcuta).
              </p>

              <div className="pack-tags-wrap">
                <span className="pack-subtag">👨‍🏫 Profesores</span>
                <span className="pack-subtag">💻 Materias Troncales</span>
                <span className="pack-subtag">🏛️ Campus & Aulas</span>
                <span className="pack-subtag">👥 Vida Universitaria</span>
              </div>

              <div className="pack-words-sample">
                <span className="sample-label">Palabras incluidas ({UFPS_CATEGORY.words.length}):</span>
                <p className="sample-list">
                  {UFPS_CATEGORY.words.slice(0, 6).map(w => w.word).join(' • ')}...
                </p>
              </div>

              <button
                className="btn-primary select-pack-btn"
                onClick={() => handleSelectPack('ufps')}
              >
                <span>{mainCategory === 'ufps' ? 'Baraja Seleccionada' : 'Jugar con Baraja UFPS'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Pack General */}
          {(activeTabFilter === 'all' || activeTabFilter === 'general') && (
            <div className={`pack-card ${mainCategory === 'general' ? 'selected' : ''}`}>
              <div className="pack-card-top">
                <div className="pack-brand-badge general-badge">
                  <Globe size={16} color="#FFFFFF" />
                  <span>VARIADO CLÁSICO</span>
                </div>
                {mainCategory === 'general' && (
                  <span className="badge-pill badge-red selected-pill">
                    <Check size={12} /> ACTIVO
                  </span>
                )}
              </div>

              <h2 className="pack-title">Cultura General</h2>
              <p className="pack-desc">
                Combinación de temas de entretenimiento, gastronomía, geografía y cine para jugar con cualquier grupo de amigos.
              </p>

              <div className="pack-tags-wrap">
                {GENERAL_SUBTOPICS.map(sub => (
                  <span key={sub.id} className="pack-subtag">
                    {sub.name} ({sub.words.length})
                  </span>
                ))}
              </div>

              <div className="pack-words-sample">
                <span className="sample-label">Ejemplos de palabras:</span>
                <p className="sample-list">
                  The Legend of Zelda • Pizza • Harry Potter • Colombia • Elden Ring...
                </p>
              </div>

              <button
                className="btn-primary select-pack-btn"
                onClick={() => handleSelectPack('general')}
              >
                <span>{mainCategory === 'general' ? 'Baraja Seleccionada' : 'Jugar con Baraja General'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .packs-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }

        .packs-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .packs-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .packs-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .filter-chips-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .filter-chip {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border-light);
          background-color: #FFFFFF;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }

        .filter-chip.active {
          background-color: var(--border-dark);
          color: #FFFFFF;
          border-color: var(--border-dark);
        }

        .packs-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pack-card {
          background-color: #FFFFFF;
          border: 2px solid var(--border-dark);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-neo);
          transition: all 0.15s;
        }

        .pack-card.selected {
          border-color: var(--primary-red);
          box-shadow: 3px 3px 0px var(--primary-red);
        }

        .pack-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pack-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #C24128;
          color: #FFFFFF;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .pack-brand-badge.general-badge {
          background-color: #1C1917;
        }

        .selected-pill {
          font-size: 0.68rem;
          padding: 3px 8px;
        }

        .pack-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .pack-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .pack-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pack-subtag {
          font-size: 0.72rem;
          font-weight: 700;
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-light);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          color: var(--text-main);
        }

        .pack-words-sample {
          background-color: var(--bg-card-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sample-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .sample-list {
          font-size: 0.75rem;
          color: var(--text-main);
          font-weight: 600;
          line-height: 1.3;
        }

        .select-pack-btn {
          margin-top: 4px;
          padding: 12px 16px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
