import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomGameWord, UFPS_CATEGORY, GENERAL_SUBTOPICS } from '../data/categories';
import {
  loadInitialWords,
  loadWordsFromGoogleSheets,
  loadWordsFromFile,
  getSavedSheetsUrl,
  resetToDefaultWords,
  downloadExcelTemplate
} from '../data/excelLoader';
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
  // Navegación principal y pestañas
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [activeTab, setActiveTab] = useState('lobby'); // 'lobby' | 'packs' | 'rules'

  // Gestión de palabras y sincronización Excel / Google Sheets
  const [dynamicWordsData, setDynamicWordsData] = useState(null);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [wordsSyncStatus, setWordsSyncStatus] = useState(null); // { type: 'success'|'error', message: string }
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');

  // Configuración de partida
  const [playerNames, setPlayerNames] = useState(['Sofía', 'Mateo', 'Carlos', 'Camila', 'Andrés']);
  const [impostorCount, setImpostorCount] = useState(1);
  const [mainCategory, setMainCategory] = useState('general'); // 'ufps' | 'general'
  const [activeSubtopics, setActiveSubtopics] = useState(['videojuegos', 'comida', 'peliculas']);

  // Estado activo de la partida
  const [assignedPlayers, setAssignedPlayers] = useState([]);
  const [secretInfo, setSecretInfo] = useState({
    word: '',
    hint: '',
    categoryName: '',
    categoryBadge: 'NIVEL 1'
  });
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundHistory, setRoundHistory] = useState([]);
  const [lastEliminated, setLastEliminated] = useState(null);
  const [firstCluePlayer, setFirstCluePlayer] = useState('');

  // Carga inicial de palabras al montar la app
  useEffect(() => {
    async function initWords() {
      setIsLoadingWords(true);
      const savedUrl = getSavedSheetsUrl();
      if (savedUrl) setGoogleSheetsUrl(savedUrl);

      const tree = await loadInitialWords();
      if (tree) {
        setDynamicWordsData(tree);
      }
      setIsLoadingWords(false);
    }
    initWords();
  }, []);

  // Sincronizar con Google Sheets
  const syncGoogleSheets = async (urlToSync) => {
    const targetUrl = urlToSync || googleSheetsUrl;
    if (!targetUrl.trim()) {
      setWordsSyncStatus({ type: 'error', message: 'Por favor ingresa el enlace de Google Sheets.' });
      return false;
    }

    setIsLoadingWords(true);
    setWordsSyncStatus(null);
    try {
      const tree = await loadWordsFromGoogleSheets(targetUrl);
      setDynamicWordsData(tree);
      setGoogleSheetsUrl(targetUrl);
      setWordsSyncStatus({
        type: 'success',
        message: `¡Sincronizado con éxito! Se cargaron ${tree.totalWords} palabras (${tree.ufpsWords.length} Sistemas / ${tree.totalWords - tree.ufpsWords.length} Generales).`
      });
      setIsLoadingWords(false);
      return true;
    } catch (err) {
      setWordsSyncStatus({ type: 'error', message: err.message || 'Error al sincronizar con Google Sheets.' });
      setIsLoadingWords(false);
      return false;
    }
  };

  // Subir archivo local (.xlsx o .csv)
  const uploadCustomFile = async (file) => {
    if (!file) return false;
    setIsLoadingWords(true);
    setWordsSyncStatus(null);
    try {
      const tree = await loadWordsFromFile(file);
      setDynamicWordsData(tree);
      setWordsSyncStatus({
        type: 'success',
        message: `¡Archivo cargado! Se procesaron ${tree.totalWords} palabras correctamente.`
      });
      setIsLoadingWords(false);
      return true;
    } catch (err) {
      setWordsSyncStatus({ type: 'error', message: err.message || 'Error al leer el archivo Excel.' });
      setIsLoadingWords(false);
      return false;
    }
  };

  // Restablecer al catálogo base
  const resetWordsCatalog = async () => {
    resetToDefaultWords();
    setGoogleSheetsUrl('');
    setWordsSyncStatus(null);
    setIsLoadingWords(true);
    const tree = await loadInitialWords();
    setDynamicWordsData(tree);
    setIsLoadingWords(false);
    setWordsSyncStatus({ type: 'success', message: 'Catálogo restablecido al predeterminado.' });
  };

  // Subtemas actuales disponibles para General
  const currentGeneralSubtopics = dynamicWordsData?.generalSubtopics?.length > 0
    ? dynamicWordsData.generalSubtopics
    : GENERAL_SUBTOPICS;

  // Palabras de UFPS actuales
  const currentUfpsWords = dynamicWordsData?.ufpsWords?.length > 0
    ? dynamicWordsData.ufpsWords
    : UFPS_CATEGORY.words;

  // Agregar jugador
  const addPlayer = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (playerNames.some(p => p.toLowerCase() === trimmed.toLowerCase())) return false;
    if (playerNames.length >= 12) return false;
    setPlayerNames(prev => [...prev, trimmed]);
    return true;
  };

  // Eliminar jugador
  const removePlayer = (nameToRemove) => {
    if (playerNames.length <= 3) return false;
    setPlayerNames(prev => {
      const next = prev.filter(p => p !== nameToRemove);
      if (impostorCount > Math.floor(next.length / 2)) {
        setImpostorCount(Math.max(1, Math.floor(next.length / 2)));
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
    const wordData = getRandomGameWord(mainCategory, activeSubtopics, dynamicWordsData);
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

    // Ir a pantalla de entrega
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
      roleDescription: wasImpostor ? 'Agente Infiltrado' : 'Civil Inocente expulsada'
    };
    setRoundHistory(prev => [...prev, historyEntry]);
    setLastEliminated({ ...voted, wasImpostor });

    // Calcular vivos
    const remainingCivilians = updatedPlayers.filter(p => !p.isImpostor && p.isAlive).length;
    const remainingImpostors = updatedPlayers.filter(p => p.isImpostor && p.isAlive).length;

    if (wasImpostor) {
      // Si eliminaron al impostor
      if (remainingImpostors === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setCurrentScreen('CIVILIANS_WIN');
        return;
      }
    }

    // Comprobar si los impostores igualan o superan a los civiles
    if (remainingImpostors >= remainingCivilians) {
      setCurrentScreen('IMPOSTOR_WINS');
      return;
    }

    // Si eliminaron a un inocente y el juego sigue
    setCurrentScreen('INNOCENT_ELIMINATED');
  };

  // Comenzar nueva ronda tras voto inocente
  const startNextRoundOfClues = () => {
    setCurrentRound(prev => prev + 1);
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
        returnToHome,
        // Nuevas propiedades de gestión Excel / Sheets
        dynamicWordsData,
        currentUfpsWords,
        currentGeneralSubtopics,
        isLoadingWords,
        wordsSyncStatus,
        googleSheetsUrl,
        setGoogleSheetsUrl,
        syncGoogleSheets,
        uploadCustomFile,
        resetWordsCatalog,
        downloadExcelTemplate
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
