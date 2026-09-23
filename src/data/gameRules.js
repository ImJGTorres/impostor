// Reglas del juego basadas fielmente en el diseño 1:1149 de Figma

export const GAME_RULES = [
  {
    step: '01',
    badge: 'INICIO',
    title: 'Reparto secreto',
    description: 'Se pasa el teléfono. Todos ven la palabra secreta salvo el impostor, quien recibe una pista general para poder fingir.'
  },
  {
    step: '02',
    badge: 'INTERCAMBIO',
    title: 'Ronda de pistas',
    description: 'Por turnos, cada jugador dice una palabra sutil. ¡Cuidado: si eres demasiado obvio, el impostor descubrirá el enigma al instante!'
  },
  {
    step: '03',
    badge: 'ANÁLISIS',
    title: 'Debate & sospecha',
    description: 'Se abre la discusión libre. Analicen quién dudó en responder, quién dio una pista extraña o quién parece demasiado nervioso.'
  },
  {
    step: '04',
    badge: 'SENTENCIA',
    title: 'Votación & veredicto',
    description: 'A la de tres, señalen al culpable. Si votan al impostor, ganan los civiles; si logra desviar las miradas, triunfa el impostor.'
  }
];

export const PRO_TIP = 'Como impostor, escucha atentamente las pistas iniciales de los demás para que tu palabra encaje sin desentonar en la mesa.';
