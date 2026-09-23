import React from 'react';
import { Users, Key, HelpCircle, Play, BookOpen, Tag } from 'lucide-react';
import Header from '../common/Header';
import BottomNav from '../common/BottomNav';
import { useGame } from '../../context/GameContext';

export default function HomeScreen() {
  const { setCurrentScreen, setActiveTab } = useGame();

  const handlePlayClick = () => {
    setCurrentScreen('CONFIG');
  };

  const handleRulesClick = () => {
    setActiveTab('rules');
    setCurrentScreen('RULES');
  };

  const handlePacksClick = () => {
    setActiveTab('packs');
    setCurrentScreen('PACKS');
  };

  return (
    <div className="screen-container">
      <Header title="EL IMPOSTOR" subtitle="Lobby" showBack={false} />

      <main className="home-content">
        {/* Mascota y Título Hero */}
        <div className="hero-section">
          <div className="mascot-frame">
            <img src="/impostor-logo.png" alt="Mascota El Impostor" className="mascot-img" />
            <div className="eye-badge">
              <span className="eye-dot"></span>
            </div>
          </div>
          <h1 className="hero-title">El Impostor</h1>
          <p className="hero-subtitle">Juego social de deducción cara a cara</p>
        </div>

        {/* Ficha de Partida Card */}
        <div className="neo-card partida-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-icon">🎭</span>
              <span className="card-header-title">FICHA DE PARTIDA</span>
            </div>
            <span className="badge-pill badge-neutral">Mesa Local</span>
          </div>

          <div className="stats-grid">
            <div className="sub-card stat-item">
              <Users size={18} className="stat-icon" />
              <span className="stat-number">3+</span>
              <span className="stat-label">Jugadores</span>
            </div>

            <div className="sub-card stat-item">
              <Key size={18} className="stat-icon" />
              <span className="stat-number">1</span>
              <span className="stat-label">Palabra Clave</span>
            </div>

            <div className="sub-card stat-item">
              <HelpCircle size={18} className="stat-icon" />
              <span className="stat-number">100%</span>
              <span className="stat-label">Deducción Pura</span>
            </div>
          </div>

          <div className="card-hint-row">
            <div className="hint-icon-box">?</div>
            <p className="hint-text">
              Todos conocen el código secreto excepto uno. ¿Podrás descubrir al infiltrado antes de la votación?
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="home-actions">
          <button className="btn-primary" onClick={handlePlayClick}>
            <Play size={18} fill="#FFFFFF" />
            <span>Jugar</span>
          </button>

          <button className="btn-secondary" onClick={handleRulesClick}>
            <BookOpen size={18} />
            <span>CÓMO SE JUEGA</span>
          </button>

          <button className="btn-link" onClick={handlePacksClick}>
            <Tag size={16} />
            <span>Explorar barajas de palabras</span>
          </button>
        </div>
      </main>

      <BottomNav />

      <style>{`
        .screen-container {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          flex: 1;
        }

        .home-content {
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }

        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 10px;
        }

        .mascot-frame {
          width: 96px;
          height: 96px;
          background-color: #1C1917;
          border-radius: 24px;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .mascot-img {
          width: 82px;
          height: 82px;
          object-fit: contain;
        }

        .eye-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          background-color: var(--primary-red);
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .eye-dot {
          width: 8px;
          height: 8px;
          background-color: #FFFFFF;
          border-radius: 50%;
        }

        .hero-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .partida-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-icon {
          font-size: 1.1rem;
        }

        .card-header-title {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--text-main);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          padding: 14px 6px;
        }

        .stat-icon {
          color: var(--primary-red);
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.1;
        }

        .card-hint-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding-top: 6px;
          border-top: 1px solid var(--border-light);
        }

        .hint-icon-box {
          width: 20px;
          height: 20px;
          border: 1.5px solid var(--primary-red);
          color: var(--primary-red);
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .hint-text {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.35;
          font-weight: 500;
        }

        .home-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
          padding-top: 10px;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          padding: 8px;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.15s;
        }

        .btn-link:hover {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
