# 🎭 El Impostor - UFPS & Cultura General

Aplicación web social de deducción cara a cara pensada para jugarse en grupo presencial pasando un solo teléfono móvil entre los jugadores.

Desarrollada en **React + Vite** con **pnpm** y diseño móvil-first de alta fidelidad, inspirada fielmente en los **12 diseños de Figma** (`1:2`, `5:289`, `1:127`, `1:416`, `1:510`, `1:611`, `1:861`, `5:2`, `1:987`, `5:122`, `1:1149`, `1:1285`), con temática universitaria exclusiva de la **UFPS (Ingeniería de Sistemas - Cúcuta)** y temas generales combinables.

---

## ✨ Características Principales

1. **Partida en un solo dispositivo (Pass & Play)**:
   - Pantalla de traspaso con candado confidencial (`Pásale el teléfono a X`).
   - Pantalla de verificación de privacidad (`¿Tienes el teléfono tú solo?`).
   - Revelación secreta protegida:
     - **Civiles**: Ven la palabra secreta (ej. *THE LEGEND OF ZELDA* o *ING. MILTON JESÚS*).
     - **Impostores**: Ven la palabra censurada y una **Pista de camuflaje** estratégica para improvisar.
2. **Temática UFPS (Ingeniería de Sistemas)**:
   - Profesores y Directivos (Ing. Judith del Pilar, Ing. Milton Jesús, Ing. Marco Adarme, etc.).
   - Materias Troncales (Programación Móvil, Bases de Datos, Estructuras de Datos, etc.).
   - Lugares del Campus (Salas de Cómputo, Biblioteca Eduardo Cote Lamus, Cafetería Central, etc.).
   - Estudiantes y Vida Universitaria (Monitores, Tesistas, Primíparos).
3. **Temática General con Subtemas Multi-seleccionables**:
   - Videojuegos, Comida, Países, Películas y Deportes.
4. **Flujo Completo de Juego y Fases**:
   - Ronda de pistas con indicador de quién inicia y temporizador opcional.
   - Fase de votación con selección visual del sospechoso.
   - Manejo de expulsiones:
     - **Expulsión Injustificada**: Muestra el balance de la mesa y la tensión restante.
     - **Victoria de Civiles**: Desenmascara al impostor y muestra la pista usada.
     - **Victoria del Impostor**: Cronología completa de las rondas y agentes infiltrados.
5. **Reglas Integradas y Explorador de Barajas**:
   - Sección interactiva de cómo se juega en 4 pasos.
   - Explorador de barajas con visualización de palabras y ejemplos.

---

## 🚀 Cómo Ejecutar Localmente con pnpm

### Requisitos
- [Node.js](https://nodejs.org/) v18 o superior.
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Pasos
```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev
```

Abre tu navegador en `http://localhost:3000` (o la URL que indique Vite en consola).

---

## 🐳 Ejecutar con Docker Localmente

```bash
# Construir la imagen (usa pnpm internamente)
docker build -t el-impostor-app .

# Ejecutar el contenedor
docker run -d -p 8080:80 --name impostor-game el-impostor-app
```
Accede desde tu navegador en: `http://localhost:8080`.

---

## ☁️ Despliegue Gratis en Render

Esta aplicación está 100% optimizada para el plan **Free de Render** usando contenedores Docker:

### Opción 1: Conectar Repositorio de GitHub
1. Sube este proyecto a tu repositorio de GitHub.
2. En tu panel de [Render](https://dashboard.render.com/), haz clic en **New +** > **Web Service**.
3. Conecta tu repositorio de GitHub.
4. Render detectará automáticamente el archivo `Dockerfile`.
5. Selecciona el plan **Free** y haz clic en **Create Web Service**.

### Opción 2: Usar Render Blueprint (`render.yaml`)
1. En Render Dashboard, ve a **Blueprints**.
2. Conecta tu repositorio. Render leerá el archivo `render.yaml` y configurará el servicio automáticamente.

---

## 📐 Correspondencia con las Interfaces de Figma

| ID de Figma | Pantalla en la App | Archivo de Componente |
|---|---|---|
| `1:2` | 1. Home / Portada | `src/components/screens/HomeScreen.jsx` |
| `5:289` | 2. Configuración de partida | `src/components/screens/ConfigScreen.jsx` |
| `1:127` | 3. Turno de entrega (Pass & Play) | `src/components/screens/HandoverScreen.jsx` |
| `1:416` | 4. Filtro de privacidad | `src/components/screens/PrivacyWarningScreen.jsx` |
| `1:510` | 5. Revelación Civil | `src/components/screens/RoleRevealScreen.jsx` |
| `1:611` | 6. Revelación Impostor | `src/components/screens/RoleRevealScreen.jsx` |
| Intermedia | Ronda de Pistas y Debate | `src/components/screens/CluesPhaseScreen.jsx` |
| `1:861` | 7. Votación de sospechoso | `src/components/screens/VotingScreen.jsx` |
| `5:2` | 9. Expulsión Injustificada | `src/components/screens/InnocentEliminatedScreen.jsx` |
| `1:987` | 8. Veredicto: ¡Civiles Ganan! | `src/components/screens/CiviliansWinScreen.jsx` |
| `5:122` | 10. ¡El Impostor Ha Ganado! | `src/components/screens/ImpostorWinsScreen.jsx` |
| `1:1149` | 10. Cómo se juega (Reglas) | `src/components/screens/RulesScreen.jsx` |
| `1:1285` | Logo / Mascota oficial | `public/impostor-logo.png` / `PacksScreen.jsx` |
