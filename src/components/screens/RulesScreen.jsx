import React from 'react';
import { ArrowRight, Lightbulb, Smartphone, MessageSquare, Search, Vote } from 'lucide-react';
import Header from '../common/Header';
import { useGame } from '../../context/GameContext';
import { GAME_RULES, PRO_TIP } from '../../data/gameRules';

export default function RulesScreen() {
  const { setCurrentScreen, setActiveTab } = useGame();

  const handleStartPlaying = () => {
    setActiveTab('lobby');
    setCurrentScreen('CONFIG');
  };

  const getStepIcon = (idx) => {
    switch (idx) {
      case 0: return <Smartphone size={18} className="step-icon" />;
      case 1: return <MessageSquare size={18} className="step-icon" />;
      case 2: return <Search size={18} className="step-icon" />;
      case 3: return <Vote size={18} className="step-icon" />;
      default: return null;
    }
  };

  return (
    <div className="screen-container">
      <Header
        title="EL IMPOSTOR"
        subtitle="Rules Archive"
        showBack={true}
        onBack={() => {
          setActiveTab('lobby');
          setCurrentScreen('HOME');
        }}
      />

      <main className="rules-content">
        <div className="rules-header">
          <h1 className="rules-title">Reglas del juego</h1>
          <p className="rules-subtitle">
            Aprende la dinámica en 4 pasos esenciales y descubre al infiltrado.
          </p>
        </div>

        {/* 4 Pasos Esenciales */}
        <div className="steps-list">
          {GAME_RULES.map((rule, idx) => (
            <div key={rule.step} className="step-card">
              <div className="step-card-header">
                <div className="step-title-col">
                  <div className="step-number-row">
                    <span className="step-number">{rule.step}</span>
                    <span className="badge-pill badge-neutral step-badge">{rule.badge}</span>
                  </div>
                  <h2 className="step-title">{rule.title}</h2>
                </div>
                <div className="step-icon-box">
                  {getStepIcon(idx)}
                </div>
              </div>
              <p className="step-desc">{rule.description}</p>
            </div>
          ))}
        </div>

        {/* Consejo Pro */}
        <div className="pro-tip-box">
          <div className="pro-tip-header">
            <Lightbulb size={18} className="pro-tip-icon" />
            <span className="pro-tip-title">CONSEJO PRO</span>
          </div>
          <p className="pro-tip-text">{PRO_TIP}</p>
        </div>

        {/* Botón de acción */}
        <div className="rules-actions">
          <button className="btn-primary" onClick={handleStartPlaying}>
            <span>ENTENDIDO, ¡A JUGAR!</span>
            <ArrowRight size={18} />
          </button>
          <span className="rules-caption">Partida local • 3 a 12 participantes</span>
        </div>
      </main>

      <style>{`
        .rules-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
        }

        .rules-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rules-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .rules-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-card {
          background-color: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .step-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .step-title-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .step-number-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--primary-red);
          line-height: 1;
        }

        .step-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
        }

        .step-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .step-icon-box {
          width: 38px;
          height: 38px;
          background-color: var(--bg-card-subtle);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-icon {
          color: var(--primary-red);
        }

        .step-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .pro-tip-box {
          background-color: var(--bg-card-subtle);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pro-tip-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pro-tip-icon {
          color: var(--primary-red);
        }

        .pro-tip-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-red);
          letter-spacing: 0.05em;
        }

        .pro-tip-text {
          font-size: 0.8rem;
          color: var(--text-main);
          line-height: 1.35;
        }

        .rules-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
          padding-top: 10px;
        }

        .rules-caption {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
