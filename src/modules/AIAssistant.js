import { DUA_PROFILES } from './TransversalLines.js';

const KNOWLEDGE_RULES = [
  {
    id: 'neuromath',
    keywords: ['neuromath', 'redes', 'red neuronal', 'matemática', 'pérdida', 'loss', 'learning rate', 'regularización', 'overfitting'],
    handler: () => `
      <strong>Andamiaje Pedagógico — NeuroMath & IA:</strong><br>
      1. <strong>Tasa de Aprendizaje (LR):</strong> Mantenerla entre <strong>0.04 y 0.08</strong>. Valores superiores a 0.18 inducen oscilación y divergencia del gradiente.<br>
      2. <strong>Regularización L2:</strong> Configurar en torno a <strong>0.025</strong> para penalizar magnitudes excesivas de pesos y mitigar el sobreajuste.<br>
      3. <strong>Optimizador:</strong> Emplear <strong>Adam</strong> por su estimación adaptativa de momentos de primer y segundo orden.
    `
  },
  {
    id: 'gerencia',
    keywords: ['gerencia', 'ágil', 'agil', 'sprint', 'scrum', 'liderazgo', 'deuda técnica', 'backlog'],
    handler: () => `
      <strong>Estrategia de Liderazgo — Gerencia+:</strong><br>
      - <strong>Gestión de Alcance:</strong> Ante solicitudes imprevistas, aplicar balance de compensaciones (trade-offs) priorizando el trabajo de mayor valor sin sobrecargar la capacidad.<br>
      - <strong>Resolución de Bloqueos:</strong> Priorizar trabajo colaborativo (swarming) y seguridad psicológica sobre asignación individual de culpas.<br>
      - <strong>Calidad:</strong> Respetar la Definición de Terminado (DoD) para no acumular deuda técnica en entregas apresuradas.
    `
  },
  {
    id: 'social',
    keywords: ['social', 'comunitaria', 'latido', 'ciudadanía', 'voxcivitas', 'gobernanza', 'presupuesto'],
    handler: () => `
      <strong>Enfoque Comunitario — Latido Social:</strong><br>
      - En proyectos sociales, la infraestructura física debe acompañarse de mediación comunitaria para garantizar apropiación ciudadana.<br>
      - La gobernanza participativa maximiza la cohesión y equidad en la distribución del fondo comunitario.
    `
  },
  {
    id: 'dua',
    keywords: ['dua', 'diseño universal', 'inclusión', 'accesibilidad', 'perfil'],
    handler: () => `
      <strong>Principios DUA aplicados en VirtuXperience:</strong><br>
      1. <strong>Representación múltiple:</strong> Entorno tridimensional, síntesis de voz (TTS) y diagramas conceptuales.<br>
      2. <strong>Acción y expresión:</strong> Navegación por teclado (WASD, atajos 0-6), minimapa interactivo y controles táctiles.<br>
      3. <strong>Compromiso:</strong> Simuladores vivenciales con escenarios basados en toma de decisiones del contexto colombiano.
    `
  },
  {
    id: 'route',
    keywords: ['ruta', 'recomiendas', 'empezar', 'iniciar', 'pasos', 'donde voy'],
    handler: (profile) => {
      if (profile === 'kinesthetic') {
        return `
          <strong>Recomendación según perfil Práctico/Kinestésico:</strong><br>
          Inicia por las estaciones con simuladores vivenciales activos: <strong>Domo 2 (NeuroMath)</strong> o <strong>Domo 4 (Gerencia+)</strong>, donde interactúas directamente con variables y retroalimentación inmediata.
        `;
      }
      if (profile === 'visual') {
        return `
          <strong>Recomendación según perfil Visual/Espacial:</strong><br>
          Abre la matriz curricular (tecla M) para revisar el radar de competencias y explora los diagramas conceptuales en <strong>Comunicarte (Domo 1)</strong> y <strong>Latido Social (Domo 6)</strong>.
        `;
      }
      return `
        <strong>Recomendación según perfil Auditivo/Narrativo:</strong><br>
        Comienza por <strong>Comunicarte (Domo 1)</strong> o <strong>VoxCivitas (Domo 3)</strong> utilizando el sintetizador de voz y los formatos sonoros de cada estación.
      `;
    }
  }
];

export class AIAssistant {
  constructor(duaSystem, progressSystem) {
    this.dua = duaSystem;
    this.progress = progressSystem;

    this.currentProfile = 'kinesthetic';
    this.chatHistory = [];

    this.chatForm = document.getElementById('ai-chat-form');
    this.chatInput = document.getElementById('ai-chat-input');
    this.chatHistoryEl = document.getElementById('ai-chat-history');
    this.profileStyleEl = document.getElementById('ai-profile-style');
    this.btnRecalibrate = document.getElementById('btn-recalibrate-dua');

    this.initEvents();
  }

  initEvents() {
    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.chatInput ? this.chatInput.value.trim() : '';
        if (!text) return;
        this.handleUserQuery(text);
        if (this.chatInput) this.chatInput.value = '';
      });
    }

    const quickBtns = document.querySelectorAll('.quick-prompt-btn');
    quickBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt) this.handleUserQuery(prompt);
      });
    });

    if (this.btnRecalibrate) {
      this.btnRecalibrate.addEventListener('click', () => {
        this.cycleDuaProfile();
      });
    }
  }

  cycleDuaProfile() {
    const profiles = ['kinesthetic', 'visual', 'auditory'];
    const nextIdx = (profiles.indexOf(this.currentProfile) + 1) % profiles.length;
    this.currentProfile = profiles[nextIdx];
    const profileData = DUA_PROFILES[this.currentProfile];

    if (this.profileStyleEl) {
      this.profileStyleEl.textContent = profileData.name;
    }

    this.addBotMessage(`Perfil DUA actualizado a: <strong>${profileData.name}</strong>.<br>${profileData.recommendation}`);
    this.dua.speak(`Perfil DUA actualizado a estilo ${profileData.name}.`);
  }

  handleUserQuery(query) {
    this.addUserMessage(query);

    const typingId = this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator(typingId);
      const response = this.generateAdaptiveResponse(query);
      this.addBotMessage(response);
      this.dua.speak(response.replace(/<[^>]*>?/gm, ''));
    }, 350);
  }

  generateAdaptiveResponse(query) {
    const normalized = query.toLowerCase();

    for (const rule of KNOWLEDGE_RULES) {
      const match = rule.keywords.some((kw) => normalized.includes(kw));
      if (match) {
        return rule.handler(this.currentProfile);
      }
    }

    return `
      El sistema cuenta con 6 domos transversales accesibles mediante los accesos directos numéricos (0 al 6).<br>
      Puedes consultar andamiaje sobre: <em>NeuroMath</em>, <em>Gerencia Ágil</em>, <em>Latido Social</em>, <em>Principios DUA</em> o solicitar una <em>recomendación de ruta</em>.
    `;
  }

  addUserMessage(text) {
    if (!this.chatHistoryEl) return;

    const msg = document.createElement('div');
    msg.className = 'chat-msg user-msg';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '👤';

    const content = document.createElement('div');
    content.className = 'msg-content';

    const p = document.createElement('p');
    p.textContent = text; // Previene inyección XSS de forma estricta

    content.appendChild(p);
    msg.appendChild(avatar);
    msg.appendChild(content);

    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
  }

  addBotMessage(html) {
    if (!this.chatHistoryEl) return;

    const msg = document.createElement('div');
    msg.className = 'chat-msg bot-msg';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';

    const content = document.createElement('div');
    content.className = 'msg-content';

    const p = document.createElement('p');
    p.innerHTML = html; // Respuestas internas curadas del sistema

    content.appendChild(p);
    msg.appendChild(avatar);
    msg.appendChild(content);

    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
  }

  showTypingIndicator() {
    if (!this.chatHistoryEl) return null;

    const id = `typing-${Date.now()}`;
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = 'chat-msg bot-msg';
    msg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content"><p style="color:var(--text-dim);"><em>Consultando base de conocimiento curricular...</em></p></div>
    `;
    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}
