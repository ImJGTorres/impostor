import React from 'react';
import { useGame } from './context/GameContext';
import HomeScreen from './components/screens/HomeScreen';
import ConfigScreen from './components/screens/ConfigScreen';
import HandoverScreen from './components/screens/HandoverScreen';
import CluesPhaseScreen from './components/screens/CluesPhaseScreen';
import VotingScreen from './components/screens/VotingScreen';
import InnocentEliminatedScreen from './components/screens/InnocentEliminatedScreen';
import CiviliansWinScreen from './components/screens/CiviliansWinScreen';
import ImpostorWinsScreen from './components/screens/ImpostorWinsScreen';
import RulesScreen from './components/screens/RulesScreen';
import PacksScreen from './components/screens/PacksScreen';
import BottomNav from './components/common/BottomNav';

export default function App() {
  const { currentScreen } = useGame();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'CONFIG':
        return <ConfigScreen />;
      case 'HANDOVER':
      case 'PRIVACY':
      case 'REVEAL':
        return <HandoverScreen />;
      case 'CLUES':
        return <CluesPhaseScreen />;
      case 'VOTING':
        return <VotingScreen />;
      case 'INNOCENT_ELIMINATED':
        return <InnocentEliminatedScreen />;
      case 'CIVILIANS_WIN':
        return <CiviliansWinScreen />;
      case 'IMPOSTOR_WINS':
        return <ImpostorWinsScreen />;
      case 'RULES':
        return <RulesScreen />;
      case 'PACKS':
        return <PacksScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-screen-viewport">
        {renderCurrentScreen()}
      </div>
      <BottomNav />
    </div>
  );
}
