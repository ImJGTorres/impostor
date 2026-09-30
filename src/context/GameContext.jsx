import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  // Parámetro de preview por URL (?screen=...)
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const screenParam = params ? params.get('screen') : null;

  const defaultMockPlayers = [
    { id: 1, name: 'Sofía', letter: 'S', color: '#C24128', isImpostor: false, isAlive: screenParam !== 'INNOCENT_ELIMINATED' },
    { id: 2, name: 'Mateo', letter: 'M', color: '#2563EB', isImpostor: false, isAlive: true },
    { id: 3, name: 'Carlos', letter: 'C', color: '#059669', isImpostor: true, hint: 'delfín', isAlive: screenParam !== 'IMPOSTOR_ELIMINATED_CONTINUES' },
    { id: 4, name: 'Camila', letter: 'C', color: '#D97706', isImpostor: true, hint: 'motor', isAlive: true }, // Segunda impostora viva para multi-impostor
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

  // Gestión de palabras y sincronización Excel / Google Sheets
  const [dynamicWordsData, setDynamicWordsData] = useState(null);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [wordsSyncStatus, setWordsSyncStatus] = useState(null); // { type: 'success'|'error', message: string }
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');

  // Configuración de partida
  const [playerNames, setPlayerNames] = useState([]);
  const [impostorCount, setImpostorCount] = useState(1);
  const [withClues, setWithClues] = useState(true); // true = Con pista, false = Sin pista
  const [discussionTime, setDiscussionTime] = useState(90); // en segundos
  const [selectedCategories, setSelectedCategories] = useState(['general']); // ['general'], ['ufps'], o ['general', 'ufps']
  const [activeSubtopics, setActiveSubtopics] = useState(['videojuegos', 'comida', 'peliculas']);
  const [previousImpostorNames, setPreviousImpostorNames] = useState([]);

  // Historial de sesión para rotación justa y sin repeticiones consecutivas
  const impostorCountsRef = useRef({});
  const recentImpostorsRef = useRef([]);
  const starterCountsRef = useRef({});
  const recentStarterRef = useRef(null);
  const recentWordsRef = useRef([]);
  const wasAllImpostorsRef = useRef(false);

  // Ronda especial: Todos son impostores y nadie tiene pista (Easter egg / Paranoia)
  const [isAllImpostorsRound, setIsAllImpostorsRound] = useState(false);

  // Alternar categoría garantizando mínimo 1 seleccionada (permite ambas)
  const toggleCategory = (catId) => {
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        if (prev.length <= 1) return prev; // Mínimo 1 categoría activa
        return prev.filter(c => c !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  // Compatibilidad con código que lea mainCategory
  const mainCategory = selectedCategories.length === 2
    ? 'both'
    : (selectedCategories[0] || 'general');

  const setMainCategory = (val) => {
    if (Array.isArray(val)) {
      if (val.length > 0) setSelectedCategories(val);
    } else if (val === 'both') {
      setSelectedCategories(['general', 'ufps']);
    } else if (val === 'general' || val === 'ufps') {
      setSelectedCategories([val]);
    }
  };

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

    if (typeof window !== 'undefined') {
      window.triggerParanoiaRound = () => {
        window.__FORCE_ALL_IMPOSTORS = true;
        console.log("😈 ¡La próxima ronda será Ronda Paranoia (Todos Impostores a ciegas)!");
      };
    }
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

  // Agregar jugador (sin límite de cantidad)
  const addPlayer = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (playerNames.some(p => p.toLowerCase() === trimmed.toLowerCase())) return false;
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

    // 1. Obtener palabra secreta de las categorías activas (evitando palabras recientes)
    const wordData = getRandomGameWord(
      selectedCategories,
      activeSubtopics,
      dynamicWordsData,
      recentWordsRef.current
    );
    setSecretInfo(wordData);
    recentWordsRef.current = [wordData.word.toUpperCase(), ...(recentWordsRef.current || []).slice(0, 15)];

    // 2. Extraer lista de pistas individuales
    const availableHints = (wordData.hints && wordData.hints.length > 0)
      ? [...wordData.hints]
      : (wordData.hint ? wordData.hint.split(/[,;]/).map(s => s.trim()).filter(Boolean) : ['Sin pista disponible']);
    // Barajar las pistas para que el impostor no reciba siempre la primera (Fisher–Yates)
    for (let i = availableHints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableHints[i], availableHints[j]] = [availableHints[j], availableHints[i]];
    }

    // 3. Selección de roles
    // Probabilidad baja (~5% aleatorio en cualquier ronda) de ronda especial "Todos Impostores a ciegas"
    const isForced = typeof window !== 'undefined' && window.__FORCE_ALL_IMPOSTORS === true;
    const triggerAllImpostors = isForced || (!wasAllImpostorsRef.current && Math.random() < 0.05);
    if (isForced && typeof window !== 'undefined') {
      window.__FORCE_ALL_IMPOSTORS = false;
    }
    wasAllImpostorsRef.current = triggerAllImpostors;
    setIsAllImpostorsRound(triggerAllImpostors);

    let playersWithRoles;
    if (triggerAllImpostors) {
      // ¡TODOS SON IMPOSTORES Y NADIE TIENE PISTA!
      playersWithRoles = playerNames.map((name, idx) => ({
        id: idx + 1,
        name,
        letter: name.charAt(0).toUpperCase(),
        color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        isImpostor: true,
        hint: null, // Nadie tiene pista para hacerlo súper gracioso
        isAlive: true
      }));

      recentImpostorsRef.current = [];
      setPreviousImpostorNames([...playerNames]);
    } else {
      // Selección equitativa y aleatoria de impostores (cero repeticiones consecutivas indebidas)
      const counts = impostorCountsRef.current;
      playerNames.forEach(name => {
        if (counts[name] === undefined) counts[name] = 0;
      });

      let eligible = playerNames.filter(name => !recentImpostorsRef.current.includes(name));
      if (eligible.length < impostorCount) {
        eligible = [...playerNames];
      }

      // Barajado Fisher-Yates sobre elegibles para romper empates de forma 100% aleatoria
      const shuffledEligible = [...eligible];
      for (let i = shuffledEligible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledEligible[i], shuffledEligible[j]] = [shuffledEligible[j], shuffledEligible[i]];
      }

      // Ordenar por menor cantidad de veces siendo impostor en la sesión
      shuffledEligible.sort((a, b) => (counts[a] || 0) - (counts[b] || 0));
      const chosenImpostorNames = shuffledEligible.slice(0, impostorCount);

      // Actualizar historial
      chosenImpostorNames.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
      recentImpostorsRef.current = [...chosenImpostorNames];
      setPreviousImpostorNames(chosenImpostorNames);

      const impostorNameSet = new Set(chosenImpostorNames);

      // Asignar roles a jugadores
      let impostorCounter = 0;
      playersWithRoles = playerNames.map((name, idx) => {
        const isImp = impostorNameSet.has(name);
        let assignedHint = null;
        if (isImp) {
          assignedHint = availableHints[impostorCounter % availableHints.length];
          impostorCounter++;
        }
        return {
          id: idx + 1,
          name,
          letter: name.charAt(0).toUpperCase(),
          color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
          isImpostor: isImp,
          hint: assignedHint,
          isAlive: true
        };
      });
    }

    setAssignedPlayers(playersWithRoles);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
    setRoundHistory([]);
    setLastEliminated(null);

    // 4. Selección equitativa de quién inicia la ronda de palabras (cero repeticiones consecutivas)
    const starterCounts = starterCountsRef.current;
    playerNames.forEach(name => {
      if (starterCounts[name] === undefined) starterCounts[name] = 0;
    });

    let eligibleStarters = playerNames.filter(name => name !== recentStarterRef.current);
    if (eligibleStarters.length === 0) {
      eligibleStarters = [...playerNames];
    }

    const shuffledStarters = [...eligibleStarters];
    for (let i = shuffledStarters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledStarters[i], shuffledStarters[j]] = [shuffledStarters[j], shuffledStarters[i]];
    }

    shuffledStarters.sort((a, b) => (starterCounts[a] || 0) - (starterCounts[b] || 0));
    const chosenStarter = shuffledStarters[0];
    starterCounts[chosenStarter] = (starterCounts[chosenStarter] || 0) + 1;
    recentStarterRef.current = chosenStarter;
    setFirstCluePlayer(chosenStarter);

    // Ir a pantalla de entrega (Figma 1:127)
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

    // Número de jugadores eliminados hasta el momento en la partida
    const eliminatedCount = updatedPlayers.filter(p => !p.isAlive).length;

    // Caso especial: Ronda secreta de Paranoia (Todos eran impostores)
    // Se revela cuando se elimine a la cantidad de impostores configurada (impostorCount)
    if (isAllImpostorsRound) {
      if (eliminatedCount >= impostorCount) {
        // Se sacó a los impostores configurados: ¡Momento del clímax y gran revelación!
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 }
        });
        setCurrentScreen('IMPOSTOR_WINS');
        return;
      } else {
        // Aún faltan impostores por sacar según lo configurado en la ronda:
        // Pasa a la pantalla normal de expulsión (INNOCENT_ELIMINATED)
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
        setCurrentScreen('INNOCENT_ELIMINATED');
        return;
      }
    }

    // Calcular vivos
    const remainingCivilians = updatedPlayers.filter(p => !p.isImpostor && p.isAlive).length;
    const remainingImpostors = updatedPlayers.filter(p => p.isImpostor && p.isAlive).length;

    // Caso 1: Votaron a un IMPOSTOR
    if (wasImpostor) {
      if (remainingImpostors === 0) {
        // Victoria de los civiles (Figma 1:987)
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
      // Victoria de los impostores (Figma 5:122)
      setCurrentScreen('IMPOSTOR_WINS');
      return;
    }

    // Si eliminaron a un inocente y el juego sigue (Figma 5:2)
    setCurrentScreen('INNOCENT_ELIMINATED');
  };

  // Comenzar nueva ronda tras voto inocente
  const startNextRoundOfClues = () => {
    setCurrentRound(prev => prev + 1);
    const alive = assignedPlayers.filter(p => p.isAlive).map(p => p.name);
    if (alive.length > 0) {
      const eligibleAlive = alive.filter(name => name !== recentStarterRef.current);
      const candidates = eligibleAlive.length > 0 ? eligibleAlive : alive;
      const nextStarter = candidates[Math.floor(Math.random() * candidates.length)];
      recentStarterRef.current = nextStarter;
      setFirstCluePlayer(nextStarter);
    }
    setCurrentScreen('CLUES');
  };

  // Volver a Home
  const returnToHome = () => {
    setActiveTab('lobby');
    setCurrentScreen('HOME');
    setIsAllImpostorsRound(false);
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
        withClues,
        setWithClues,
        discussionTime,
        setDiscussionTime,
        selectedCategories,
        setSelectedCategories,
        toggleCategory,
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
        isAllImpostorsRound,
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
