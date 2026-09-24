const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outAppScreens = path.join(projectRoot, 'capturas_pantallas');
const outFigmaScreens = path.join(projectRoot, 'disenos_figma_referencia');

if (!fs.existsSync(outAppScreens)) fs.mkdirSync(outAppScreens, { recursive: true });
if (!fs.existsSync(outFigmaScreens)) fs.mkdirSync(outFigmaScreens, { recursive: true });

const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const screens = [
  { name: '01_Home_Lobby.png', url: 'http://localhost:3001/?screen=HOME' },
  { name: '02_Configuracion_Partida.png', url: 'http://localhost:3001/?screen=CONFIG' },
  { name: '03_Entrega_Telefono_Cubierto.png', url: 'http://localhost:3001/?screen=HANDOVER' },
  { name: '04_Revelacion_Civil_Presionado.png', url: 'http://localhost:3001/?screen=REVEAL_CIVIL' },
  { name: '05_Revelacion_Impostor_Presionado.png', url: 'http://localhost:3001/?screen=REVEAL_IMPOSTOR' },
  { name: '06_Ronda_Pistas_Debate.png', url: 'http://localhost:3001/?screen=CLUES' },
  { name: '07_Votacion_Sospechoso.png', url: 'http://localhost:3001/?screen=VOTING' },
  { name: '08_Inocente_Eliminado.png', url: 'http://localhost:3001/?screen=INNOCENT_ELIMINATED' },
  { name: '09_Impostor_Eliminado_Continua.png', url: 'http://localhost:3001/?screen=IMPOSTOR_ELIMINATED_CONTINUES' },
  { name: '10_Victoria_Civiles.png', url: 'http://localhost:3001/?screen=CIVILIANS_WIN' },
  { name: '11_Victoria_Impostor.png', url: 'http://localhost:3001/?screen=IMPOSTOR_WINS' },
  { name: '12_Reglas_Del_Juego.png', url: 'http://localhost:3001/?screen=RULES' },
  { name: '13_Barajas_Packs.png', url: 'http://localhost:3001/?screen=PACKS' }
];

console.log('--- Capturando pantallas de la aplicación web ---');

for (const sc of screens) {
  const filePath = path.join(outAppScreens, sc.name);
  console.log(`Capturando ${sc.name}...`);
  const res = spawnSync(edgeExe, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=480,1050',
    `--screenshot=${filePath}`,
    sc.url
  ]);

  if (fs.existsSync(filePath)) {
    console.log(`  ✓ Guardado: ${sc.name} (${fs.statSync(filePath).size} bytes)`);
  } else {
    console.log(`  ✗ Error al guardar: ${sc.name}`, res.stderr?.toString());
  }
}

console.log('\n--- Copiando diseños originales de Figma con nombres descriptivos ---');

const figmaSourceDir = 'C:\\Users\\torre\\.gemini\\antigravity-ide\\brain\\9913fce7-6110-451b-86d8-c32f1e71c8de\\figma_screens';

const figmaMap = [
  { src: '1_2.png', dest: '01_Figma_1-2_Home_Lobby.png' },
  { src: '5_289.png', dest: '02_Figma_5-289_Configuracion.png' },
  { src: '1_127.png', dest: '03_Figma_1-127_Entrega_Telefono.png' },
  { src: '1_416.png', dest: '04_Figma_1-416_Filtro_Privacidad.png' },
  { src: '1_510.png', dest: '05_Figma_1-510_Revelacion_Civil.png' },
  { src: '1_611.png', dest: '06_Figma_1-611_Revelacion_Impostor.png' },
  { src: '1_861.png', dest: '07_Figma_1-861_Votacion.png' },
  { src: '5_2.png', dest: '08_Figma_5-2_Inocente_Eliminado.png' },
  { src: '1_987.png', dest: '09_Figma_1-987_Civiles_Ganan.png' },
  { src: '5_122.png', dest: '10_Figma_5-122_Impostor_Gana.png' },
  { src: '1_1149.png', dest: '11_Figma_1-1149_Reglas.png' },
  { src: '1_1285.png', dest: '12_Figma_1-1285_Logo_Mascota.png' }
];

for (const item of figmaMap) {
  const srcPath = path.join(figmaSourceDir, item.src);
  const destPath = path.join(outFigmaScreens, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copiado: ${item.dest}`);
  }
}

console.log('\n¡Proceso finalizado con éxito!');
