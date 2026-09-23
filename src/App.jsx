import React from 'react';
import { useGame } from './context/GameContext';
import HomeScreen from './components/screens/HomeScreen';
import ConfigScreen from './components/screens/ConfigScreen';
import HandoverScreen from './components/screens/HandoverScreen';
import PrivacyWarningScreen from './components/screens/PrivacyWarningScreen';
import RoleRevealScreen from './components/screens/RoleRevealScreen';
import CluesPhaseScreen from './components/screens/CluesPhaseScreen';
import VotingScreen from './components/screens/VotingScreen';
import InnocentEliminatedScreen from './components/screens/InnocentEliminatedScreen';
import CiviliansWinScreen from './components/screens/CiviliansWinScreen';
import ImpostorWinsScreen from './components/screens/ImpostorWinsScreen';
import RulesScreen from './components/screens/RulesScreen';
import PacksScreen from './components/screens/PacksScreen';

export default function App() {
  const { currentScreen } = useGame();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'CONFIG':
        return <ConfigScreen />;
      case 'HANDOVER':
        return <HandoverScreen />;
      case 'PRIVACY':
        return <PrivacyWarningScreen />;
      case 'REVEAL':
        return <RoleRevealScreen />;
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
      {renderCurrentScreen()}
    </div>
  );
}
