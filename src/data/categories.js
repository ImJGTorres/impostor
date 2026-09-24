// Diccionario de categorías y palabras para El Impostor
// Incluye categorías UFPS (Ingeniería de Sistemas) y General (Subtemas combinables)

export const UFPS_CATEGORY = {
  id: 'ufps',
  name: 'UFPS',
  tag: 'ESPECIAL',
  subtitle: 'Ing. de Sistemas, profes, campus...',
  badge: 'Cúcuta campus',
  words: [
    // Profesores & Directivos
    { word: 'Ing. Milton Jesús', hint: 'Docente titular de bases de datos y algoritmos', group: 'Profesores' },
    { word: 'Ing. Judith del Pilar', hint: 'Docente líder en procesos de acreditación y calidad de sistemas', group: 'Profesores' },
    { word: 'Ing. Claudia Gómez', hint: 'Docente destacada del departamento de sistemas e informática', group: 'Profesores' },
    { word: 'Ing. Marco Adarme', hint: 'Profesor experto en redes, desarrollo web y sistemas distribuidos', group: 'Profesores' },
    { word: 'Ing. Carlos René', hint: 'Profesor de programación y algoritmos avanzados', group: 'Profesores' },
    { word: 'Ing. Sergio Castro', hint: 'Docente de ingeniería de software y desarrollo', group: 'Profesores' },
    { word: 'Director de Plan de Estudios', hint: 'Persona a cargo de autorizaciones, cancelaciones y carga académica', group: 'Directivos' },
    { word: 'Decano de Ingeniería', hint: 'Máxima autoridad de la facultad de ingenierías de la UFPS', group: 'Directivos' },

    // Materias
    { word: 'Programación Móvil', hint: 'Asignatura donde se construyen apps para Android, iOS y celulares', group: 'Materias' },
    { word: 'Bases de Datos', hint: 'Materia sobre SQL, modelo relacional, claves foráneas y consultas', group: 'Materias' },
    { word: 'Estructuras de Datos', hint: 'Materia con listas enlazadas, pilas, colas, grafos y árboles binarios', group: 'Materias' },
    { word: 'Ingeniería de Software', hint: 'Materia sobre Scrum, diagramas de clases, historias de usuario y testing', group: 'Materias' },
    { word: 'Sistemas Operativos', hint: 'Materia donde se aprende de memoria virtual, procesos, hilos y Linux', group: 'Materias' },
    { word: 'Redes de Computadores', hint: 'Materia enfocada en cables UTP, modelo OSI, routers y paquetes IP', group: 'Materias' },
    { word: 'Arquitectura de Software', hint: 'Materia de patrones de diseño, microservicios y escalabilidad', group: 'Materias' },
    { word: 'Inteligencia Artificial', hint: 'Materia sobre redes neuronales, modelos predictivos y algoritmos genéticos', group: 'Materias' },
    { word: 'Cálculo Integral', hint: 'Materia de ciencias básicas con sumas de Riemann y áreas bajo la curva', group: 'Materias' },

    // Lugares del Campus
    { word: 'Sala de Cómputo de Sistemas', hint: 'Salón con computadores donde se realizan las prácticas de laboratorio', group: 'Campus' },
    { word: 'Biblioteca Eduardo Cote Lamus', hint: 'Edificio silencioso de varios pisos para consultar libros e investigar', group: 'Campus' },
    { word: 'Plazoleta de Telecomunicaciones', hint: 'Zona al aire libre muy concurrida cerca al edificio de ingeniería', group: 'Campus' },
    { word: 'Cafetería Central', hint: 'Punto de reunión para comprar empanadas, café o almorzar con amigos', group: 'Campus' },
    { word: 'Canchas de Microfútbol', hint: 'Zona de deportes detrás de las aulas para jugar partidos entre semestres', group: 'Campus' },
    { word: 'Edificio Fundadores', hint: 'Construcción histórica y representativa del campus universitario', group: 'Campus' },
    { word: 'Auditorio Eustorgio Colmenares', hint: 'Lugar ceremonial donde se realizan congresos, ponencias y grados', group: 'Campus' },
    { word: 'Jardín Botánico UFPS', hint: 'Espacio verde y natural ideal para descansar entre clases', group: 'Campus' },

    // Roles & Estudiantes
    { word: 'Monitor de Laboratorio', hint: 'Estudiante de semestre superior que te ayuda a depurar el código', group: 'Comunidad' },
    { word: 'Tesista de Grado', hint: 'Estudiante de último semestre redactando su proyecto final de carrera', group: 'Comunidad' },
    { word: 'Representante Estudiantil', hint: 'Voz elegida por los estudiantes ante los comités de la universidad', group: 'Comunidad' },
    { word: 'Estudiante Primíparo', hint: 'Persona recién ingresada perdida buscando los salones el primer día', group: 'Comunidad' }
  ]
};

export const GENERAL_SUBTOPICS = [
  {
    id: 'videojuegos',
    name: 'Videojuegos',
    icon: 'Gamepad2',
    words: [
      { word: 'THE LEGEND OF ZELDA', hint: 'Aventura en mundo abierto de Nintendo', categoryName: 'General › Videojuegos' },
      { word: 'MINECRAFT', hint: 'Mundo abierto cúbico de bloques, supervivencia y crafteo', categoryName: 'General › Videojuegos' },
      { word: 'GRAND THEFT AUTO', hint: 'Saga de acción criminal en ciudades abiertas', categoryName: 'General › Videojuegos' },
      { word: 'SUPER MARIO BROS', hint: 'Fontanero que salta tuberías para rescatar a la princesa', categoryName: 'General › Videojuegos' },
      { word: 'LEAGUE OF LEGENDS', hint: 'Juego competitivo por equipos en la Grieta del Invocador', categoryName: 'General › Videojuegos' },
      { word: 'ELDEN RING', hint: 'Mundo de fantasía oscura y combate exigente', categoryName: 'General › Videojuegos' },
      { word: 'GOD OF WAR', hint: 'Guerrero espartano enfrentando dioses mitológicos', categoryName: 'General › Videojuegos' },
      { word: 'VALORANT', hint: 'Shooter táctico en primera persona con agentes y orbes', categoryName: 'General › Videojuegos' },
      { word: 'EA SPORTS FC', hint: 'Simulador deportivo de fútbol con partidos rápidos y cartas', categoryName: 'General › Videojuegos' },
      { word: 'CYBERPUNK 2077', hint: 'Futuro distópico con implantes cibernéticos en Night City', categoryName: 'General › Videojuegos' }
    ]
  },
  {
    id: 'comida',
    name: 'Comida',
    icon: 'Utensils',
    words: [
      { word: 'PIZZA', hint: 'Base de masa horneada con salsa de tomate y queso fundido', categoryName: 'General › Comida' },
      { word: 'HAMBURGUESA', hint: 'Carne a la plancha entre dos panes con queso y vegetales', categoryName: 'General › Comida' },
      { word: 'TACOS AL PASTOR', hint: 'Tortilla de maíz con carne adobada, piña y cilantro', categoryName: 'General › Comida' },
      { word: 'SUSHI', hint: 'Platillo tradicional asiático con rollos de arroz y alga', categoryName: 'General › Comida' },
      { word: 'AREPA CON QUESO', hint: 'Preparación típica redonda de maíz asada sobre budare', categoryName: 'General › Comida' },
      { word: 'LASAÑA', hint: 'Capas de pasta rellenas de carne molida, bechamel y queso', categoryName: 'General › Comida' },
      { word: 'EMPANADAS', hint: 'Masa frita o al horno con relleno de carne o pollo', categoryName: 'General › Comida' },
      { word: 'CEVICHE', hint: 'Pescado o mariscos marinados en jugo de limón fresco y cebolla', categoryName: 'General › Comida' }
    ]
  },
  {
    id: 'paises',
    name: 'Países',
    icon: 'Globe',
    words: [
      { word: 'COLOMBIA', hint: 'País sudamericano con costas en dos océanos y gran variedad de climas', categoryName: 'General › Países' },
      { word: 'JAPÓN', hint: 'Nación asiática de islas famosa por su tecnología, cerezos y templos', categoryName: 'General › Países' },
      { word: 'ITALIA', hint: 'Territorio europeo con forma de bota, famoso por su arte y monumentos', categoryName: 'General › Países' },
      { word: 'MÉXICO', hint: 'País con rica herencia prehispánica, mariachis y costas caribeñas', categoryName: 'General › Países' },
      { word: 'ALEMANIA', hint: 'Potencia europea industrializada famosa por sus autopistas y castillos', categoryName: 'General › Países' },
      { word: 'BRASIL', hint: 'Nación de habla portuguesa con la mayor selva tropical del planeta', categoryName: 'General › Países' },
      { word: 'CANADÁ', hint: 'País del norte con bajas temperaturas, lagos inmensos y hoja de arce', categoryName: 'General › Países' },
      { word: 'EGIPTO', hint: 'País africano bañado por el río Nilo y rodeado de pirámides milenarias', categoryName: 'General › Países' }
    ]
  },
  {
    id: 'peliculas',
    name: 'Películas',
    icon: 'Clapperboard',
    words: [
      { word: 'HARRY POTTER', hint: 'Joven mago que descubre una escuela secreta de hechicería', categoryName: 'General › Películas' },
      { word: 'TITANIC', hint: 'Historia de amor dramática a bordo de un barco colosal', categoryName: 'General › Películas' },
      { word: 'INCEPTION', hint: 'Misión de infiltración dentro de los sueños y el subconsciente', categoryName: 'General › Películas' },
      { word: 'INTERSTELLAR', hint: 'Viaje a través de un agujero de gusano buscando salvar a la humanidad', categoryName: 'General › Películas' },
      { word: 'SPIDER-MAN', hint: 'Joven con poderes arácnidos que protege su ciudad con gran responsabilidad', categoryName: 'General › Películas' },
      { word: 'EL PADRINO', hint: 'Relato cinematográfico sobre una influyente familia mafiosa', categoryName: 'General › Películas' },
      { word: 'AVENGERS', hint: 'Grupo de superhéroes que unen fuerzas para defender el universo', categoryName: 'General › Películas' },
      { word: 'JURASSIC PARK', hint: 'Parque temático en una isla donde reviven criaturas prehistóricas', categoryName: 'General › Películas' }
    ]
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: 'Trophy',
    words: [
      { word: 'FÚTBOL', hint: 'Deporte de dos equipos que buscan meter un balón esférico en el arco', categoryName: 'General › Deportes' },
      { word: 'BALONCESTO', hint: 'Juego dinámico donde se anota encestando en un aro elevado', categoryName: 'General › Deportes' },
      { word: 'TENIS', hint: 'Duelo con raquetas donde se pasa una pelota por encima de la red', categoryName: 'General › Deportes' },
      { word: 'FÓRMULA 1', hint: 'Competencia automovilística de monoplazas a altísimas velocidades', categoryName: 'General › Deportes' },
      { word: 'NATACIÓN', hint: 'Carrera acuática en diferentes estilos como libre y mariposa', categoryName: 'General › Deportes' },
      { word: 'VOLEIBOL', hint: 'Deporte donde se impide que la pelota toque el suelo propio usando bloqueos', categoryName: 'General › Deportes' }
    ]
  }
];

export const GENERAL_CATEGORY = {
  id: 'general',
  name: 'General',
  tag: 'ACTIVO',
  subtitle: 'Cultura pop, cine, comida y temas...',
  badge: 'Variado clásico',
  subtopics: GENERAL_SUBTOPICS
};

// Función para obtener una palabra aleatoria según la configuración elegida
export function getRandomGameWord(mainCategory, activeSubtopicIds = ['videojuegos', 'comida', 'peliculas'], dynamicData = null) {
  const currentUfpsWords = dynamicData?.ufpsWords?.length > 0 ? dynamicData.ufpsWords : UFPS_CATEGORY.words;
  const currentSubtopics = dynamicData?.generalSubtopics?.length > 0 ? dynamicData.generalSubtopics : GENERAL_SUBTOPICS;

  if (mainCategory === 'ufps') {
    const list = currentUfpsWords;
    const selected = list[Math.floor(Math.random() * list.length)];
    return {
      word: selected.word.toUpperCase(),
      hint: selected.hint,
      categoryName: `UFPS › ${selected.group || 'Ingeniería de Sistemas'}`,
      categoryBadge: 'NIVEL 1',
      isUfps: true
    };
  }

  // Si es General, recolectar las palabras de los subtemas activos
  let pool = [];
  currentSubtopics.forEach(sub => {
    if (activeSubtopicIds.includes(sub.id)) {
      pool = pool.concat(sub.words);
    }
  });

  if (pool.length === 0) {
    // Si no seleccionó ninguno, usar el primer subtema disponible
    pool = currentSubtopics[0]?.words || GENERAL_SUBTOPICS[0].words;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return {
    word: chosen.word.toUpperCase(),
    hint: chosen.hint,
    categoryName: chosen.categoryName || `General › ${chosen.subtopic || 'Varios'}`,
    categoryBadge: 'NIVEL 1',
    isUfps: false
  };
}

