import * as XLSX from 'xlsx';
import { GOOGLE_SHEETS_URL } from '../config/wordsConfig';

// URL por defecto del CSV integrado en la app
const DEFAULT_CSV_PATH = '/data/palabras.csv';
const STORAGE_KEY_WORDS = 'el_impostor_custom_words';
const STORAGE_KEY_SHEET_URL = 'el_impostor_sheets_url';

/**
 * Limpia y normaliza una fila leída de Excel o CSV
 */
function normalizeRow(row) {
  const getVal = (keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
        return String(row[k]).trim();
      }
    }
    return '';
  };

  const seccion = getVal(['seccion', 'Seccion', 'SECCION', 'sección', 'Sección', 'section', 'Section']).toLowerCase();
  const subcategoria = getVal(['subcategoria', 'Subcategoria', 'SUBCATEGORIA', 'subcategoría', 'Subcategoría', 'categoria', 'Categoria', 'category', 'Category', 'grupo', 'Grupo']);
  const palabra = getVal(['palabra', 'Palabra', 'PALABRA', 'word', 'Word', 'nombre', 'Nombre']);
  const pista = getVal(['pista', 'Pista', 'PISTA', 'hint', 'Hint', 'descripcion', 'Descripcion', 'descripción', 'Descripción']);

  if (!palabra) return null;

  return {
    section: seccion.includes('sistemas') || seccion.includes('ufps') ? 'ufps' : 'general',
    subtopic: subcategoria || (seccion.includes('sistemas') ? 'General Sistemas' : 'General'),
    word: palabra,
    hint: pista || 'Sin pista disponible'
  };
}

/**
 * Transforma un array de objetos normalizados en la estructura organizada que el juego utiliza
 */
export function buildCategoryTree(rawItems) {
  const ufpsWords = [];
  const generalSubtopicsMap = new Map();

  rawItems.forEach(item => {
    if (!item) return;

    if (item.section === 'ufps') {
      ufpsWords.push({
        word: item.word,
        hint: item.hint,
        group: item.subtopic
      });
    } else {
      const subId = item.subtopic.toLowerCase().replace(/[^a-z0-9]/g, '_');
      if (!generalSubtopicsMap.has(subId)) {
        generalSubtopicsMap.set(subId, {
          id: subId,
          name: item.subtopic,
          words: []
        });
      }
      generalSubtopicsMap.get(subId).words.push({
        word: item.word,
        hint: item.hint,
        categoryName: `General › ${item.subtopic}`
      });
    }
  });

  return {
    ufpsWords,
    generalSubtopics: Array.from(generalSubtopicsMap.values()),
    totalWords: rawItems.length
  };
}

/**
 * Convierte un link normal de Google Sheets al endpoint de descarga CSV de Google
 */
export function formatGoogleSheetsCsvUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Si ya es un enlace de exportación directa
  if (trimmed.includes('export?format=csv') || trimmed.includes('gviz/tq?tqx=out:csv')) {
    return trimmed;
  }

  // Extraer el ID de la hoja de cálculo
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  return trimmed;
}

/**
 * Parsea un ArrayBuffer o texto con XLSX
 */
export function parseSpreadsheetData(data) {
  try {
    const workbook = XLSX.read(data, { type: typeof data === 'string' ? 'string' : 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    const parsed = rows.map(normalizeRow).filter(Boolean);
    return parsed;
  } catch (err) {
    console.error('Error al procesar hoja de cálculo:', err);
    throw new Error('El formato del archivo no es válido. Revisa que tenga las columnas requeridas.');
  }
}

/**
 * Carga palabras desde una URL de Google Sheets
 */
export async function loadWordsFromGoogleSheets(url) {
  const exportUrl = formatGoogleSheetsCsvUrl(url);
  if (!exportUrl) {
    throw new Error('URL de Google Sheets inválida.');
  }

  const response = await fetch(exportUrl);
  if (!response.ok) {
    throw new Error('No se pudo acceder a Google Sheets. Verifica que el enlace tenga permisos de "Cualquier persona con el enlace puede ser lector".');
  }

  const csvText = await response.text();
  const parsed = parseSpreadsheetData(csvText);

  if (parsed.length === 0) {
    throw new Error('No se encontraron palabras válidas en la hoja de Google Sheets.');
  }

  // Guardar en cache local
  localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(parsed));
  localStorage.setItem(STORAGE_KEY_SHEET_URL, url);

  return buildCategoryTree(parsed);
}

/**
 * Carga palabras desde un archivo local subido (.xlsx o .csv)
 */
export async function loadWordsFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const parsed = parseSpreadsheetData(data);
        if (parsed.length === 0) {
          return reject(new Error('El archivo no contiene filas con palabras válidas.'));
        }
        localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(parsed));
        resolve(buildCategoryTree(parsed));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Carga inicial automática:
 * 1. Intenta conectarse a Google Sheets en tiempo real
 * 2. Si falla o está offline, usa el caché guardado
 * 3. Si no hay caché, usa el CSV base local
 */
export async function loadInitialWords() {
  // 1. Intentar cargar desde Google Sheets configurado
  if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.trim() !== '') {
    try {
      const tree = await loadWordsFromGoogleSheets(GOOGLE_SHEETS_URL);
      if (tree && tree.totalWords > 0) {
        return tree;
      }
    } catch (err) {
      console.warn('No se pudo sincronizar en vivo con Google Sheets, recurriendo a respaldo:', err);
    }
  }

  // 2. Verificar si hay datos en localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WORDS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return buildCategoryTree(parsed);
      }
    }
  } catch (err) {
    console.warn('Error al leer localStorage:', err);
  }

  // 3. Cargar el CSV base del proyecto
  try {
    const res = await fetch(DEFAULT_CSV_PATH);
    if (res.ok) {
      const text = await res.text();
      const parsed = parseSpreadsheetData(text);
      return buildCategoryTree(parsed);
    }
  } catch (err) {
    console.warn('No se pudo cargar el CSV local inicial:', err);
  }

  return null;
}

/**
 * Obtiene la URL configurada o guardada de Google Sheets
 */
export function getSavedSheetsUrl() {
  return GOOGLE_SHEETS_URL || localStorage.getItem(STORAGE_KEY_SHEET_URL) || '';
}


/**
 * Genera y descarga una plantilla Excel (.xlsx) de ejemplo
 */
export function downloadExcelTemplate() {
  const sampleData = [
    {
      seccion: 'sistemas',
      subcategoria: 'Materias',
      palabra: 'Bases de Datos',
      pista: 'Materia sobre SQL, consultas relacionales y modelado'
    },
    {
      seccion: 'sistemas',
      subcategoria: 'Profesores',
      palabra: 'Ing. Milton Jesús',
      pista: 'Docente titular de bases de datos y algoritmos'
    },
    {
      seccion: 'sistemas',
      subcategoria: 'Campus',
      palabra: 'Sala de Cómputo',
      pista: 'Salón de prácticas de laboratorio de informática'
    },
    {
      seccion: 'sistemas',
      subcategoria: 'Conceptos IT',
      palabra: 'Docker Container',
      pista: 'Empaquetado ligero para desplegar aplicaciones aisladas'
    },
    {
      seccion: 'general',
      subcategoria: 'Videojuegos',
      palabra: 'MINECRAFT',
      pista: 'Mundo abierto cúbico de bloques, supervivencia y crafteo'
    },
    {
      seccion: 'general',
      subcategoria: 'Comida',
      palabra: 'PIZZA',
      pista: 'Masa horneada con salsa de tomate y queso fundido'
    },
    {
      seccion: 'general',
      subcategoria: 'Peliculas',
      palabra: 'INTERSTELLAR',
      pista: 'Viaje a través de un agujero de gusano buscando salvar la humanidad'
    },
    {
      seccion: 'general',
      subcategoria: 'Anime',
      palabra: 'DRAGON BALL',
      pista: 'Búsqueda de las esferas mágicas con combates épicos'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Palabras');
  XLSX.writeFile(workbook, 'Plantilla_Palabras_El_Impostor.xlsx');
}

/**
 * Restablece las palabras al catálogo predeterminado
 */
export function resetToDefaultWords() {
  localStorage.removeItem(STORAGE_KEY_WORDS);
  localStorage.removeItem(STORAGE_KEY_SHEET_URL);
}
