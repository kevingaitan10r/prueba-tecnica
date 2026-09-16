/**
 * Modelo de Datos Pedagógico y Curricular: UNIMINUTO VirtuXperience
 * Basado estrictamente en el Requerimiento Técnico y Pedagógico
 * y la estructura oficial de las 6 Líneas Transversales con Niveles I, II y III.
 */

export const TRANSVERSAL_LINES = [
  {
    id: 1,
    code: 'comunicarte',
    title: 'Comunicarte',
    tagline: 'Expresión lingüística, pensamiento crítico y comunicación multilingüe',
    icon: '🔵',
    colorHex: '#2563eb',
    colorThree: 0x2563eb,
    domePosition: { x: 38, y: 0, z: -22 },
    narrative: 'El Domo de la Expresión custodia el poder de la palabra, la argumentación dialéctica y el multilingüismo global. Aquí forjarás la capacidad de transmitir ideas con impacto y rigor en cualquier contexto profesional.',
    mentor: {
      name: 'Dra. Helena Valenzuela',
      role: 'Mentora de Semiótica y Argumentación Digital',
      avatar: '👩‍🏫',
      greeting: 'Bienvenido al vórtice de Comunicarte. La palabra bien articulada es la herramienta más poderosa para la transformación social.'
    },
    subcompetencies: [
      {
        id: 'c-escritura',
        name: 'Escritura',
        description: 'Producción de textos académicos, ensayos argumentativos y redacción profesional con coherencia y cohesión.',
        levels: {
          I: 'Fundamentos de cohesión, conectores lógicos y ortografía técnica.',
          II: 'Estructuración de ensayos argumentativos y literatura científica.',
          III: 'Escritura persuasiva para líderes y publicación académica indexada.'
        }
      },
      {
        id: 'c-oralidad',
        name: 'Oralidad',
        description: 'Elocuencia, comunicación verbal y no verbal, debate estructurado y oratoria contemporánea.',
        levels: {
          I: 'Técnicas de modulación de voz, respiración y estructuración de discursos.',
          II: 'Debate dialéctico y argumentación espontánea bajo presión.',
          III: 'Keynotes, pitch de alto impacto y oratoria en medios digitales.'
        }
      },
      {
        id: 'c-lectura',
        name: 'Lectura',
        description: 'Comprensión crítica, análisis intertextual e interpretación profunda de fuentes diversas.',
        levels: {
          I: 'Identificación de tesis central e ideas secundarias.',
          II: 'Lectura crítica, detección de sesgos y contraste de posturas.',
          III: 'Análisis hermenéutico y deconstrucción de discursos complejos.'
        }
      },
      {
        id: 'c-multilinguismo',
        name: 'Multilingüismo',
        description: 'Competencia comunicativa intercultural y dominio práctico de lenguas extranjeras en entornos laborales globales.',
        levels: {
          I: 'Interacción cotidiana y vocabulario profesional básico (A2/B1).',
          II: 'Negociación intercultural y redacción de informes internacionales (B2).',
          III: 'Liderazgo de proyectos multilingües y diplomacia académica (C1).'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Reto: Torneo de Argumentación y Detección de Falacias',
        desc: 'Un tribunal académico simulado donde debes identificar 4 falacias lógicas en un discurso público para ganar el debate.',
        badge: 'Orador Distinguido'
      },
      audiovisual: {
        title: 'Masterclass: El Arte del Storytelling Transformador',
        duration: '12 min',
        thumbnail: '🎬',
        summary: 'Aprende cómo articular narrativas que movilicen voluntades mediante arquetipos y giros dramáticos en discursos de impacto social.'
      },
      audio: {
        title: 'Podcast VirtuXperience: Voces que Transforman Territorios',
        duration: '18 min',
        narrator: 'Helena Valenzuela',
        summary: 'Entrevista a líderes comunitarios sobre cómo la comunicación asertiva logró mediar un conflicto de tierras en Colombia.'
      },
      diagram: {
        title: 'Mapa Conceptual de la Retórica Aristotélica Contemporánea',
        type: 'Infografía Dinámica',
        summary: 'Interrelación entre Ethos (credibilidad), Pathos (conexión emocional) y Logos (rigor lógico) en medios digitales.'
      }
    }
  },
  {
    id: 2,
    code: 'neuromath',
    title: 'NeuroMath',
    tagline: 'Inteligencia artificial, pensamiento computacional y modelado matemático',
    icon: '🟣',
    colorHex: '#8b5cf6',
    colorThree: 0x8b5cf6,
    domePosition: { x: 44, y: 0, z: 18 },
    narrative: 'El Vórtice Cuántico de NeuroMath entrena tu cerebro en el razonamiento lógico formal, la analítica predictiva y la inteligencia artificial para resolver problemas del mundo real.',
    mentor: {
      name: 'Dr. Alan Turing-Restrepo',
      role: 'Mentor de Ciencias Cuantitativas e IA',
      avatar: '👨‍🔬',
      greeting: 'Bienvenido a NeuroMath. Las matemáticas no son solo números; son el lenguaje con el que decodificamos el universo y creamos inteligencia sintética.'
    },
    hasSimulator: true,
    simId: 'modal-sim-neuromath',
    subcompetencies: [
      {
        id: 'nm-ia-mat',
        name: 'IA y Matemáticas',
        description: 'Álgebra lineal para redes neuronales, gradiente descendente y modelos generativos.',
        levels: {
          I: 'Vectores, matrices y funciones de pérdida en modelos computacionales.',
          II: 'Ajuste de hiperparámetros y optimización de redes profundas.',
          III: 'Diseño de arquitecturas cognitivas y agentes autónomos.'
        }
      },
      {
        id: 'nm-calculo',
        name: 'Cálculo',
        description: 'Cálculo diferencial e integral aplicado a tasas de cambio y maximización de funciones.',
        levels: {
          I: 'Límites, continuidad y derivadas de primer orden.',
          II: 'Integración definida, cálculo multivariable y optimización con restricciones.',
          III: 'Ecuaciones diferenciales y modelos dinámicos en tiempo real.'
        }
      },
      {
        id: 'nm-fundamentos',
        name: 'Fundamentos de Matemáticas',
        description: 'Lógica proposicional, teoría de conjuntos y aritmética operativa para la toma de decisiones.',
        levels: {
          I: 'Operaciones aritméticas, proporciones y porcentajes en contextos prácticos.',
          II: 'Lógica booleana y diagramas de flujo de decisiones.',
          III: 'Demostraciones formales e inducción matemática.'
        }
      },
      {
        id: 'nm-algebra',
        name: 'Álgebra',
        description: 'Sistemas de ecuaciones lineales, matrices y espacios vectoriales para analítica de datos.',
        levels: {
          I: 'Ecuaciones lineales y cuadráticas con aplicaciones financieras.',
          II: 'Transformaciones lineales, valores y vectores propios (Eigenvalues).',
          III: 'Descomposición en valores singulares (SVD) para reducción de dimensionalidad.'
        }
      },
      {
        id: 'nm-desafiomente',
        name: 'Desafiomente',
        description: 'Gimnasia cerebral, pensamiento lateral, resolución de enigmas complejos y heurísticas de innovación.',
        levels: {
          I: 'Puzzles de patrones espaciales y sucesiones numéricas rápidas.',
          II: 'Problemas de optimización de rutas y algoritmos voraces (Greedy).',
          III: 'Paradojas probabilísticas y teoría de juegos estratégicos.'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Simulador: Optimizador de Redes Neuronales y Pérdida',
        desc: 'Modula la tasa de aprendizaje, regularización L2 y neuronas ocultas para predecir el éxito estudiantil sin sobreajuste.',
        badge: 'Científico de Datos UNIMINUTO'
      },
      audiovisual: {
        title: 'Video Inmersivo: Cómo "Ve" una Red Convolucional',
        duration: '10 min',
        thumbnail: '🔬',
        summary: 'Recorrido en 3D por las capas ocultas de una red neuronal mientras clasifica información visual en tiempo real.'
      },
      audio: {
        title: 'Podcast: Matemáticas que Salvan Vidas',
        duration: '15 min',
        narrator: 'Alan Turing-Restrepo',
        summary: 'Cómo los modelos epidemiológicos y el cálculo diferencial ayudaron a gestionar camas UCI en pandemia.'
      },
      diagram: {
        title: 'Visualizador de Descenso de Gradiente en 3D',
        type: 'Superficie de Pérdida Interactiva',
        summary: 'Interactúa con un hiperplano de funciones de pérdida para encontrar el mínimo global.'
      }
    }
  },
  {
    id: 3,
    code: 'voxcivitas',
    title: 'VoxCivitas',
    tagline: 'Ciudadanía activa, ética democrática, autonomía y sentido de vida',
    icon: '🏛️',
    colorHex: '#7c3aed',
    colorThree: 0x7c3aed,
    domePosition: { x: 12, y: 0, z: 42 },
    narrative: 'El Ágora de VoxCivitas es el santuario de la convivencia armónica, el juicio ético y el compromiso ciudadano por la paz y el desarrollo democrático de Colombia.',
    mentor: {
      name: 'Dra. Mercedes Cabal',
      role: 'Mentora de Ética Cívica y Derechos Humanos',
      avatar: '👩‍⚖️',
      greeting: 'Bienvenido al Ágora de VoxCivitas. Ser un gran profesional sin ser un ciudadano íntegro es una promesa inconclusa.'
    },
    subcompetencies: [
      {
        id: 'vc-ciudadanas',
        name: 'Competencias Ciudadanas',
        description: 'Conocimiento constitucional, mecanismos de participación y defensa de derechos fundamentales.',
        levels: {
          I: 'Derechos y deberes constitucionales, tutela y derecho de petición.',
          II: 'Análisis de políticas públicas y veedurías ciudadanas en territorio.',
          III: 'Diseño de iniciativas de ley popular y litigio estratégico por el bien común.'
        }
      },
      {
        id: 'vc-autonomo',
        name: 'Aprendizaje Autónomo',
        description: 'Metacognición, gestión del tiempo, autorregulación y aprendizaje autodirigido para la vida.',
        levels: {
          I: 'Organización de entornos personales de aprendizaje (PLE) y disciplina.',
          II: 'Estrategias metacognitivas y autoevaluación reflexiva continua.',
          III: 'Curaduría autónoma de conocimiento en la frontera de la disciplina.'
        }
      },
      {
        id: 'vc-vida',
        name: 'Proyecto de Vida',
        description: 'Alineación de talentos, vocación, sentido de propósito, resiliencia y salud socioemocional.',
        levels: {
          I: 'Identificación de valores, fortalezas y metas a corto plazo.',
          II: 'Plan de carrera resiliente frente a la incertidumbre y el fracaso.',
          III: 'Legado profesional y trascendencia ética al servicio de la sociedad.'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Reto: Tribunal de Dilemas Constitucionales',
        desc: 'Analiza casos emblemáticos de colisión de derechos (libertad de expresión vs. derecho a la intimidad) y emite un fallo argumentado.',
        badge: 'Defensor de la Ciudadanía'
      },
      audiovisual: {
        title: 'Documental: Mecanismos de Participación en Acción',
        duration: '14 min',
        thumbnail: '⚖️',
        summary: 'Casos reales de comunidades colombianas que defendieron sus páramos mediante consultas populares y cabildos abiertos.'
      },
      audio: {
        title: 'Podcast: Forjando un Proyecto de Vida con Propósito',
        duration: '16 min',
        narrator: 'Mercedes Cabal',
        summary: 'Diálogo inspirador sobre cómo navegar las crisis vocacionales y alinear la profesión con los sueños de vida.'
      },
      diagram: {
        title: 'Diagrama Interactivo de la Estructura del Estado Colombiano',
        type: 'Mapa Institucional',
        summary: 'Ramas del poder público, órganos de control y su articulación con los derechos ciudadanos.'
      }
    }
  },
  {
    id: 4,
    code: 'gerencia',
    title: 'Gerencia+',
    tagline: 'Liderazgo ágil, gestión estratégica, marketing y talento humano',
    icon: '💼',
    colorHex: '#0284c7',
    colorThree: 0x0284c7,
    domePosition: { x: -32, y: 0, z: 32 },
    narrative: 'La Torre Estratégica de Gerencia+ desarrolla las habilidades directivas del futuro: agilidad organizacional, mentalidad de crecimiento, dirección de equipos y visión de mercado.',
    mentor: {
      name: 'Mg. Carlos Mendoza',
      role: 'Mentor de Gestión Ágil y Liderazgo Transformacional',
      avatar: '👨‍💼',
      greeting: '¡Bienvenido a Gerencia+! Las organizaciones modernas no fracasan por falta de ideas, sino por falta de agilidad y liderazgo humano para ejecutarlas.'
    },
    hasSimulator: true,
    simId: 'modal-sim-gerencia',
    subcompetencies: [
      {
        id: 'g-liderazgo',
        name: 'Liderazgo Gerencial',
        description: 'Toma de decisiones estratégicas bajo incertidumbre, visión de futuro y empatía directiva.',
        levels: {
          I: 'Estilos de liderazgo situacional y comunicación motivacional.',
          II: 'Negociación estratégica y gestión del cambio organizacional.',
          III: 'Gobernanza corporativa, sostenibilidad y liderazgo en el C-Suite.'
        }
      },
      {
        id: 'g-agiles',
        name: 'Metodologías Ágiles',
        description: 'Scrum, Kanban, Design Sprint y Lean Startup para entregas rápidas de valor iterativo.',
        levels: {
          I: 'Ceremonias Scrum, backlog grooming y estimación por User Stories.',
          II: 'Gestión de impedimentos, métricas de velocidad y burndown charts.',
          III: 'Escalado ágil (SAFe / LeSS) y cultura ágil en grandes empresas.'
        }
      },
      {
        id: 'g-marketing',
        name: 'Marketing',
        description: 'Analítica de clientes, posicionamiento de marca, marketing digital y growth hacking.',
        levels: {
          I: 'Segmentación de mercado, propuesta de valor y buyer personas.',
          II: 'Estrategias omnicanal, métricas CAC/LTV y conversión digital.',
          III: 'Branding estratégico global y experiencia del cliente (CX).'
        }
      },
      {
        id: 'g-talento',
        name: 'Talento Humano',
        description: 'Atracción, desarrollo, bienestar, diversidad e inclusión en equipos de alto rendimiento.',
        levels: {
          I: 'Procesos de onboarding, evaluación por competencias y clima laboral.',
          II: 'Gestión del talento basado en datos (People Analytics) y upskilling.',
          III: 'Diseño de culturas organizacionales antifrágiles e inclusivas.'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Simulador Vivencial: Misión Sprint Crisis 4.0',
        desc: 'Lidera un equipo Scrum en tiempo real; equilibra velocidad, moral y alcance frente a crisis imprevistas del cliente.',
        badge: 'Scrum Master & Estratega'
      },
      audiovisual: {
        title: 'Masterclass: Negociación Basada en Principios (Método Harvard)',
        duration: '15 min',
        thumbnail: '📊',
        summary: 'Aprende a separar a las personas del problema y crear acuerdos ganar-ganar en negociaciones de alta tensión.'
      },
      audio: {
        title: 'Podcast: Liderar en Tiempos de Inteligencia Artificial',
        duration: '20 min',
        narrator: 'Carlos Mendoza',
        summary: 'Cómo los gerentes del siglo XXI combinan la intuición humana y la empatía con la analítica de decisiones.'
      },
      diagram: {
        title: 'Tablero Interactivo de Cadena de Valor y Canvas Ágil',
        type: 'Framework Dinámico',
        summary: 'Visualiza la interconexión entre procesos clave, costos y generación de valor.'
      }
    }
  },
  {
    id: 5,
    code: 'actividaidea',
    title: 'Activa tu Idea',
    tagline: 'Investigación aplicada, innovación abierta y emprendimiento sostenible',
    icon: '💡',
    colorHex: '#f59e0b',
    colorThree: 0xf59e0b,
    domePosition: { x: -44, y: 0, z: -14 },
    narrative: 'El Hub de Innovación de Activa tu Idea es el acelerador de vocaciones creadoras de UNIMINUTO. Aquí los problemas se convierten en oportunidades de negocio e investigación con impacto social.',
    mentor: {
      name: 'Dra. Natalia Osorio',
      role: 'Mentora de Innovación y Transferencia Tecnológica',
      avatar: '👩‍🔬',
      greeting: '¡Bienvenido a Activa tu Idea! Una idea guardada en la cabeza no genera cambio; aquí aprenderás a prototiparla, validarla y llevarla al mercado.'
    },
    subcompetencies: [
      {
        id: 'ai-investigacion',
        name: 'Investigación',
        description: 'Metodología de la investigación científica, formulación de proyectos, estado del arte y rigor epistémico.',
        levels: {
          I: 'Formulación de preguntas científicas, marco teórico y fuentes confiables.',
          II: 'Diseños metodológicos cualitativos, cuantitativos y mixtos.',
          III: 'Patentes, transferencia de conocimiento y redacción de artículos científicos.'
        }
      },
      {
        id: 'ai-emprendimiento',
        name: 'Emprendimiento',
        description: 'Modelo de negocio Canvas, validación de producto mínimo viable (MVP), finanzas y pitch deck.',
        levels: {
          I: 'Ideación creativa, design thinking y mapa de empatía del usuario.',
          II: 'Prototipado rápido, validación en calle y estructura financiera básica.',
          III: 'Levantamiento de capital semilla, escalabilidad y modelos B-Corp.'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Reto: Shark Tank UNIMINUTO & Pitch Deck Simulator',
        desc: 'Construye un pitch de 3 minutos para convencer a inversores de impacto sobre la viabilidad financiera de tu startup.',
        badge: 'Emprendedor de Impacto'
      },
      audiovisual: {
        title: 'Cápsula: De la Idea al MVP en 48 Horas',
        duration: '11 min',
        thumbnail: '🚀',
        summary: 'Metodologías sin código (No-Code) y prototipos de baja fidelidad para validar hipótesis de mercado con usuarios reales.'
      },
      audio: {
        title: 'Podcast: Historias de Emprendedores UNIMINUTO',
        duration: '17 min',
        narrator: 'Natalia Osorio',
        summary: 'Graduados que fundaron empresas que hoy generan empleo en Cundinamarca, Huila y Antioquia.'
      },
      diagram: {
        title: 'Lienzo Interactivo Business Model Canvas + Social Impact',
        type: 'Matriz Interactiva',
        summary: 'Los 9 bloques tradicionales adaptados al triple impacto: económico, social y ambiental.'
      }
    }
  },
  {
    id: 6,
    code: 'latidosocial',
    title: 'Latido Social',
    tagline: 'Responsabilidad social, liderazgo comunitario y humanismo cristiano',
    icon: '❤️',
    colorHex: '#10b981',
    colorThree: 0x10b981,
    domePosition: { x: -14, y: 0, z: -42 },
    narrative: 'El Biocentro de Latido Social materializa el ADN misional de UNIMINUTO: la opción preferencial por las comunidades vulnerables, el humanismo integral y la construcción de un país más equitativo.',
    mentor: {
      name: 'P. Rafael García-Herreros (In Memoriam / Legado)',
      role: 'Inspirador Misional de la Obra Minuto de Dios',
      avatar: '🕊️',
      greeting: '¡Que nadie se quede sin servir! Bienvenido al corazón de nuestra identidad. El conocimiento solo tiene sentido cuando se traduce en amor eficaz a los demás.'
    },
    hasSimulator: true,
    simId: 'modal-sim-social',
    subcompetencies: [
      {
        id: 'ls-responsabilidad',
        name: 'Responsabilidad Social',
        description: 'Compromiso ético con la sostenibilidad, objetivos de desarrollo sostenible (ODS) y justicia distributiva.',
        levels: {
          I: 'Fundamentos de la Doctrina Social de la Iglesia y los ODS 2030.',
          II: 'Diagnóstico participativo de necesidades comunitarias en territorio.',
          III: 'Formulación y gestión de proyectos de desarrollo comunitario sostenible.'
        }
      },
      {
        id: 'ls-febipe',
        name: 'FEBIPE',
        description: 'Formación Ética, Bioética y Pensamiento Institucional para el florecimiento humano integral.',
        levels: {
          I: 'Principios bioéticos fundamentales y respeto inviolable a la dignidad humana.',
          II: 'Dilemas bioéticos contemporáneos: tecnología, salud y medio ambiente.',
          III: 'Liderazgo moral y coherencia ética en la toma de decisiones profesionales.'
        }
      },
      {
        id: 'ls-liderazgo-social',
        name: 'Liderazgo Social',
        description: 'Facilitación de procesos comunitarios, resolución pacífica de conflictos y desarrollo territorial.',
        levels: {
          I: 'Escucha activa comunitaria y mapeo de actores locales.',
          II: 'Animación sociocomunitaria y formulación de presupuestos participativos.',
          III: 'Incidencia política territorial y redes de cooperación solidaria.'
        }
      }
    ],
    formats: {
      gamified: {
        title: 'Simulador Vivencial: Laboratorio de Transformación Comunitaria',
        desc: 'Distribuye un fondo social de 100 unidades entre infraestructura hídrica, diálogo comunitario y sostenibilidad para maximizar el bienestar colectivo.',
        badge: 'Líder Social Transformador'
      },
      audiovisual: {
        title: 'Cápsula Histórica: El Legado de Minuto de Dios en Colombia',
        duration: '13 min',
        thumbnail: '🤝',
        summary: 'Cómo una visión de fe y solidaridad construyó viviendas, colegios y la universidad más grande del país.'
      },
      audio: {
        title: 'Podcast: Voces de la Resiliencia Comunitaria',
        duration: '19 min',
        narrator: 'Comité de Pastoral y Proyección Social',
        summary: 'Experiencias de transformación en los Centros de Educación para el Desarrollo (CED) de UNIMINUTO.'
      },
      diagram: {
        title: 'Matriz Interactiva de Enfoque de Marco Lógico Social',
        type: 'Árbol de Problemas y Objetivos',
        summary: 'De la causa raíz al impacto medible en indicadores sociales y de paz.'
      }
    }
  }
];

export const DUA_PROFILES = {
  visual: {
    id: 'visual',
    name: 'Visual / Espacial',
    preferredFormat: 'diagram',
    recommendation: 'Te beneficias especialmente de mapas conceptuales, diagramas interactivos y visualización espacial en el campus 3D.'
  },
  auditory: {
    id: 'auditory',
    name: 'Auditivo / Narrativo',
    preferredFormat: 'audio',
    recommendation: 'Aprenderás mejor activando los podcasts sonoros y utilizando la síntesis de voz (Text-to-Speech) integrada.'
  },
  kinesthetic: {
    id: 'kinesthetic',
    name: 'Práctico / Vivencial',
    preferredFormat: 'gamified',
    recommendation: 'Tu mejor vía es la acción directa: simulaciones interactivas, toma de decisiones bajo presión y resolución de dilemas.'
  }
};
