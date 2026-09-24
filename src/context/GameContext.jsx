import React, { createContext, useContext, useState } from 'react';
import { getRandomGameWord } from '../data/categories';
import confetti from 'canvas-confetti';

const GameContext = createContext();

const AVATAR_COLORS = [
  '#C24128', // Terracotta red
  '#2563EB', // Blue
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#DB2777', // Pink
  '#0D9488', // Teal
  '#4F46E5', // Indigo
];

export function GameProvider({ children }) {
  // Parámetro de preview por URL (?screen=...)
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const screenParam = params ? params.get('screen') : null;

  const defaultMockPlayers = [
    { id: 1, name: 'Sofía', letter: 'S', color: '#C24128', isImpostor: false, isAlive: screenParam !== 'INNOCENT_ELIMINATED' },
    { id: 2, name: 'Mateo', letter: 'M', color: '#2563EB', isImpostor: false, isAlive: true },
    { id: 3, name: 'Carlos', letter: 'C', color: '#059669', isImpostor: true, isAlive: screenParam !== 'IMPOSTOR_ELIMINATED_CONTINUES' },
    { id: 4, name: 'Camila', letter: 'C', color: '#D97706', isImpostor: true, isAlive: true }, // Segunda impostora viva para multi-impostor
    { id: 5, name: 'Andrés', letter: 'A', color: '#7C3AED', isImpostor: false, isAlive: true },
  ];

  const getInitialScreen = () => {
    if (!screenParam) return 'HOME';
    if (screenParam === 'REVEAL_CIVIL' || screenParam === 'REVEAL_IMPOSTOR') return 'REVEAL';
    if (screenParam === 'IMPOSTOR_ELIMINATED_CONTINUES') return 'INNOCENT_ELIMINATED';
    return screenParam.toUpperCase();
  };

  const getInitialTurn = () => {
    if (screenParam === 'REVEAL_IMPOSTOR') return 2; // Carlos es impostor
    if (screenParam === 'HANDOVER') return 1; // Pásale a Mateo
    return 0;
  };

  // Navegación principal y pestañas
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [activeTab, setActiveTab] = useState(() => {
    if (screenParam === 'RULES') return 'rules';
    if (screenParam === 'PACKS') return 'packs';
    return 'lobby';
  });

  // Configuración de partida
  const [playerNames, setPlayerNames] = useState([]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [discussionTime, setDiscussionTime] = useState(90); // en segundos
  const [mainCategory, setMainCategory] = useState('general'); // 'ufps' | 'general'
  const [activeSubtopics, setActiveSubtopics] = useState(['videojuegos', 'comida', 'peliculas']);

  // Estado activo de la partida
  const [assignedPlayers, setAssignedPlayers] = useState(defaultMockPlayers);
  const [secretInfo, setSecretInfo] = useState({
    word: 'THE LEGEND OF ZELDA',
    hint: 'Aventura en mundo abierto de Nintendo',
    categoryName: 'General › Videojuegos',
    categoryBadge: 'NIVEL 1'
  });
  const [currentTurnIndex, setCurrentTurnIndex] = useState(getInitialTurn);
  const [currentRound, setCurrentRound] = useState(screenParam === 'IMPOSTOR_WINS' ? 3 : 1);
  const [roundHistory, setRoundHistory] = useState(() => {
    if (screenParam === 'IMPOSTOR_WINS') {
      return [
        { round: 1, player: 'Sofía', roleDescription: 'Civil inocente expulsada' },
        { round: 2, player: 'Camila', roleDescription: 'Civil inocente expulsada' }
      ];
    }
    return [];
  });
  const [lastEliminated, setLastEliminated] = useState(() => {
    if (screenParam === 'CIVILIANS_WIN' || screenParam === 'IMPOSTOR_ELIMINATED_CONTINUES') {
      return { id: 3, name: 'Carlos', letter: 'C', isImpostor: true, wasImpostor: true };
    }
    if (screenParam === 'INNOCENT_ELIMINATED') {
      return { id: 1, name: 'Sofía', letter: 'S', isImpostor: false, wasImpostor: false };
    }
    return null;
  });
  const [firstCluePlayer, setFirstCluePlayer] = useState('Sofía');

  // Agregar jugador
  const addPlayer = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (playerNames.some(p => p.toLowerCase() === trimmed.toLowerCase())) return false;
    if (playerNames.length >= 12) return false;
    setPlayerNames(prev => [...prev, trimmed]);
    return true;
  };

  // Eliminar jugador (sin restricciones mínimas fijas para poder limpiar la lista)
  const removePlayer = (nameToRemove) => {
    setPlayerNames(prev => {
      const next = prev.filter(p => p !== nameToRemove);
      const maxAllowed = Math.max(1, Math.floor((next.length - 1) / 2));
      if (impostorCount > maxAllowed) {
        setImpostorCount(maxAllowed);
      }
      return next;
    });
    return true;
  };

  // Conmutar subtema en General
  const toggleSubtopic = (subtopicId) => {
    setActiveSubtopics(prev => {
      if (prev.includes(subtopicId)) {
        if (prev.length === 1) return prev; // Mantener al menos uno activo
        return prev.filter(id => id !== subtopicId);
      } else {
        return [...prev, subtopicId];
      }
    });
  };

  // Iniciar partida
  const startNewGame = () => {
    if (playerNames.length < 3) return;

    const wordData = getRandomGameWord(mainCategory, activeSubtopics);
    setSecretInfo(wordData);

    // Asignar impostores de forma aleatoria
    const shuffledIndices = [...Array(playerNames.length).keys()].sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(shuffledIndices.slice(0, impostorCount));

    const playersWithRoles = playerNames.map((name, idx) => ({
      id: idx + 1,
      name,
      letter: name.charAt(0).toUpperCase(),
      color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      isImpostor: impostorIndices.has(idx),
      isAlive: true
    }));

    setAssignedPlayers(playersWithRoles);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
    setRoundHistory([]);
    setLastEliminated(null);

    // Seleccionar quién da la primera pista al azar
    const randomStarter = playersWithRoles[Math.floor(Math.random() * playersWithRoles.length)].name;
    setFirstCluePlayer(randomStarter);

    // Ir a pantalla de entrega y revelación segura (Screen 3)
    setCurrentScreen('HANDOVER');
  };

  // Pasar al siguiente jugador o a la fase de pistas
  const nextPlayerTurn = () => {
    if (currentTurnIndex < assignedPlayers.length - 1) {
      setCurrentTurnIndex(prev => prev + 1);
      setCurrentScreen('HANDOVER');
    } else {
      // Todos los jugadores vieron su rol: pasar a la ronda de pistas & debate
      setCurrentScreen('CLUES');
    }
  };

  // Votar a un jugador
  const submitVote = (votedPlayerName) => {
    const voted = assignedPlayers.find(p => p.name === votedPlayerName);
    if (!voted) return;

    // Actualizar estado de vivo
    const updatedPlayers = assignedPlayers.map(p =>
      p.name === votedPlayerName ? { ...p, isAlive: false } : p
    );
    setAssignedPlayers(updatedPlayers);

    const wasImpostor = voted.isImpostor;
    const historyEntry = {
      round: currentRound,
      player: voted.name,
      wasImpostor,
      roleDescription: wasImpostor ? 'Agente Infiltrado (Expulsado)' : 'Civil Inocente (Expulsado)'
    };
    setRoundHistory(prev => [...prev, historyEntry]);
    setLastEliminated({ ...voted, wasImpostor });

    // Calcular vivos
    const remainingCivilians = updatedPlayers.filter(p => !p.isImpostor && p.isAlive).length;
    const remainingImpostors = updatedPlayers.filter(p => p.isImpostor && p.isAlive).length;

    // Caso 1: Votaron a un IMPOSTOR
    if (wasImpostor) {
      if (remainingImpostors === 0) {
        // No quedan más impostores: ¡Victoria total de los civiles!
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
        setCurrentScreen('CIVILIANS_WIN');
        return;
      } else {
        // ¡Sí era impostor, pero aún quedan más impostores ocultos!
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        setCurrentScreen('INNOCENT_ELIMINATED'); // Mostrar pantalla de expulsión con fue impostor
        return;
      }
    }

    // Caso 2: Votaron a un CIVIL INOCENTE
    if (remainingImpostors >= remainingCivilians) {
      // Los impostores igualaron o superaron a los civiles: ¡Ganan los impostores!
      setCurrentScreen('IMPOSTOR_WINS');
      return;
    }

    // El juego continúa con un civil menos
    setCurrentScreen('INNOCENT_ELIMINATED');
  };

  // Comenzar nueva ronda tras voto inocente
  const startNextRoundOfClues = () => {
    setCurrentRound(prev => prev + 1);
    // Cambiar el jugador que inicia la nueva ronda entre los vivos
    const alive = assignedPlayers.filter(p => p.isAlive);
    if (alive.length > 0) {
      const nextStarter = alive[Math.floor(Math.random() * alive.length)].name;
      setFirstCluePlayer(nextStarter);
    }
    setCurrentScreen('CLUES');
  };

  // Volver a Home
  const returnToHome = () => {
    setActiveTab('lobby');
    setCurrentScreen('HOME');
  };

  const currentPlayer = assignedPlayers[currentTurnIndex] || null;
  const nextPlayer = assignedPlayers[currentTurnIndex + 1] || null;

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        playerNames,
        addPlayer,
        removePlayer,
        impostorCount,
        setImpostorCount,
        discussionTime,
        setDiscussionTime,
        mainCategory,
        setMainCategory,
        activeSubtopics,
        toggleSubtopic,
        startNewGame,
        assignedPlayers,
        secretInfo,
        currentTurnIndex,
        currentPlayer,
        nextPlayer,
        nextPlayerTurn,
        submitVote,
        currentRound,
        roundHistory,
        lastEliminated,
        firstCluePlayer,
        startNextRoundOfClues,
        returnToHome
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
