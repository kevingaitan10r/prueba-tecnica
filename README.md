# UNIMINUTO VirtuXperience 3D

> Prototipo interactivo inmersivo y sistema de evaluación pedagógica para las 6 líneas transversales de UNIMINUTO Virtual, basado en el marco del Diseño Universal para el Aprendizaje (DUA).

---

## 1. Descripción del Proyecto

UNIMINUTO VirtuXperience 3D es una aplicación web y de escritorio que traslada la matriz curricular transversal de UNIMINUTO a un entorno tridimensional interactivo. En lugar de evaluaciones estáticas memorísticas, propone estaciones temáticas articuladas en torno a un Ágora Central y 6 domos disciplinarios, acompañadas de tres simuladores prácticos con retroalimentación inmediata y andamiaje pedagógico adaptativo.

---

## 2. Tecnologías y Librerías

- **Entorno 3D:** Three.js (WebGL 2.0, sombreado PBR, materiales dieléctricos y transmisivos, iluminación puntual y direccional).
- **Herramienta de Construcción:** Vite 6 (bundling optimizado de módulos ES).
- **Entorno de Escritorio:** Electron 34 (ejecución multiplataforma con aislamiento de contexto).
- **Audio y Efectos Espaciales:** Web Audio API (síntesis de frecuencias armónicas y sonido ambiental procedural).
- **Accesibilidad y Voz:** Web Speech Synthesis API (`es-CO` / `es-ES`).
- **Pruebas Unitarias:** Vitest (testing automatizado de la lógica de scoring, impacto social y criptografía).
- **Estilos:** Vanilla CSS estructurado por capas (HUD, simuladores, accesibilidad y modales).

---

## 3. Arquitectura del Software

El código está estructurado bajo principios de responsabilidad única y bajo acoplamiento:

```
src/
├── engine/                  # Motor de renderizado 3D y controles
│   ├── World.js             # Ciclo de vida Three.js (escena, cámara, render loop)
│   ├── Environment.js       # Campus, iluminación, cielo, suelo y señalización
│   ├── DomeArchitectures.js # Geometrías y monumentos temáticos por disciplina
│   ├── Controls.js          # Navegación en primera persona, colisiones y minimapa
│   └── AudioSystem.js       # Síntesis sonora con Web Audio API
├── modules/                 # Motores pedagógicos, narrativos y de progresión
│   ├── TransversalLines.js  # Definición curricular canónica (6 líneas y subcompetencias)
│   ├── NarrativeEngine.js   # Gestión de estaciones y formatos de aprendizaje
│   ├── ProgressSystem.js    # XP, rangos, radar hexagonal y persistencia local
│   ├── DuaAccessibility.js  # Lector TTS, modo alto contraste y adaptabilidad motora
│   ├── AIAssistant.js       # Tutor adaptativo basado en base de conocimiento curricular
│   └── CertificateGenerator.js # Emisión de diploma con hash verificable
├── simulators/              # Simuladores vivenciales prácticos
│   ├── scoring.js           # Lógica pura de cálculo (desacoplada del DOM y testeada)
│   ├── NeuroMathSim.js      # Optimización matemática y redes neuronales
│   ├── GerenciaSim.js       # Liderazgo ágil, balance de compensaciones y sprint
│   └── LatidoSocialSim.js   # Diagnóstico comunitario y distribución presupuestal
└── utils/
    └── crypto.js            # Generación de firma hash SHA-256
```

---

## 4. Requerimientos y Componentes Implementados

### 4.1. Las 6 Líneas Transversales
1. **Comunicarte** (Azul): Escritura, Oralidad, Lectura y Multilingüismo (Niveles I, II, III).
2. **NeuroMath** (Violeta): IA y Matemáticas, Cálculo, Fundamentos, Álgebra y Desafiomente.
3. **VoxCivitas** (Dorado): Competencias Ciudadanas, Aprendizaje Autónomo y Proyecto de Vida.
4. **Gerencia+** (Verde): Liderazgo Estratégico, Metodologías Ágiles, Marketing y Talento Humano.
5. **Activa Tu Idea** (Naranja): Investigación y Emprendimiento.
6. **Latido Social** (Rosa): Responsabilidad Social, FEBIPE y Liderazgo Comunitario.

### 4.2. Tres Simuladores Prácticos Desacoplados
- **NeuroMath & IA:** Modulación de tasa de aprendizaje, regularización L2, capas ocultas y optimizador (Adam / SGD / RMSprop), evaluando convergencia vs. sobreajuste mediante funciones de pérdida en Canvas.
- **Gerencia+ Ágil:** Gestión de eventos de sprint (cambio de alcance, bloqueos de arquitectura, deuda técnica y retrospectivas), midiendo el balance entre velocidad, moral del equipo y presupuesto.
- **Latido Social:** Distribución del fondo participativo de 100 unidades y selección de modelo de gobernanza comunitaria, evaluando cohesión social, sostenibilidad ambiental y equidad distributiva.

### 4.3. Tutor Curricular Adaptativo (VirtuMentor)
- Diagnóstico del estilo de aprendizaje según el marco DUA (Visual, Auditivo, Kinestésico).
- Motor determinista de andamiaje cognitivo basado en reglas pedagógicas, ofreciendo pistas graduales para los simuladores sin entregar la respuesta directa.
- Prevención estricta de inyecciones (sanitización de entradas de usuario).

### 4.4. Acreditación y Persistencia
- Radar hexagonal de competencias renderizado en Canvas en tiempo real.
- Persistencia del progreso de misiones, insignias y XP en `localStorage`.
- Generación de certificado digital de acreditación con firma de integridad SHA-256 calculada mediante la Web Cryptography API (`crypto.subtle`).

---

## 5. Instrucciones de Instalación y Ejecución

### Requisitos Previos
- Node.js v18 o superior.
- Navegador web moderno con soporte para WebGL 2.0.

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone <url-del-repositorio>
cd virtuxperience-uniminuto
npm install
```

### 2. Ejecutar las pruebas unitarias
```bash
npm test
```
Ejecuta la suite de pruebas de Vitest que valida las funciones puras de scoring de los 3 simuladores y la consistencia del hash de certificados.

### 3. Modo Desarrollo Web
```bash
npm run dev
```
Disponible en: `http://localhost:5174`

### 4. Compilación de Producción
```bash
npm run build
```

### 5. Ejecución Rápida (1 solo clic)

#### En Windows:
- **Opción A (Aplicación de Escritorio):** Haz doble clic en `start-windows.bat`. Si no tienes dependencias instaladas, las descargará automáticamente y abrirá la aplicación. Si tu equipo tiene alguna restricción con Electron, abrirá el navegador automáticamente.
- **Opción B (Navegador Web directo):** Haz doble clic en `iniciar-navegador.bat` para iniciar el servidor local y abrir la experiencia directamente en Chrome o Edge.

#### En macOS / Linux:
```bash
./run_virtuxperience.sh
```

---

### 6. Ejecución Manual por Terminal (Opcional)
```bash
# Modo desarrollo con recarga en caliente
npm run dev

# Compilar y lanzar aplicación de escritorio
npm run app
```

---

## 6. Atajos de Teclado y Accesibilidad

| Tecla / Acción | Descripción |
| :--- | :--- |
| **W, A, S, D** / Flechas | Desplazamiento por el entorno virtual |
| **Arrastrar Ratón** | Giro y orientación de la cámara |
| **Teclas 0 a 6** | Teletransporte instantáneo directo (acceso universal sin barreras motoras) |
| **Tecla E** | Interactuar con la estación o pedestal activo |
| **Tecla M** | Abrir/cerrar matriz curricular y radar de competencias |
| **Escape** | Cerrar cualquier ventana modal activa |
| **Clic en Minimapa** | Navegación por coordenadas del campus |

---

## 7. Decisiones Técnicas y Limitaciones Conocidas

1. **Three.js sobre motores gráficos pesados (Unity/Unreal):** Se priorizó una arquitectura web ligera basada en WebGL estándar que no requiere descargas de varios gigabytes ni plugins privativos, garantizando compatibilidad cruzada directa en navegadores y distribución mediante Electron.
2. **Motor de tutoría basado en reglas deterministas:** En lugar de depender de llamadas a APIs externas de modelos de lenguaje (las cuales introducen latencia de red, costo por tokens y fallos en modo offline), el asistente utiliza un catálogo estructurado de andamiaje pedagógico DUA disponible 100% en local.
3. **Desacoplamiento de lógica de simulación (`scoring.js`):** La separación entre los cálculos de precisión/convergencia y la manipulación del DOM permite someter el comportamiento matemático a pruebas unitarias automatizadas (`npm test`).
4. **Limitación conocida en renderizado de sombras:** Para no sobrecargar equipos sin tarjeta gráfica dedicada se usa una sola luz direccional con sombras PCF suaves (mapa de 2048x2048) y sin pases de oclusión ambiental. No se ha medido el rendimiento en equipos de gama baja.
