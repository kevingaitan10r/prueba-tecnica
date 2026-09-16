import { DUA_PROFILES } from './TransversalLines.js';

export class AIAssistant {
  constructor(duaSystem, progressSystem) {
    this.dua = duaSystem;
    this.progress = progressSystem;

    this.currentProfile = 'kinesthetic'; // Por defecto práctico/vivencial
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
        const text = this.chatInput.value.trim();
        if (!text) return;
        this.handleUserQuery(text);
        this.chatInput.value = '';
      });
    }

    // Botones de preguntas rápidas
    const quickBtns = document.querySelectorAll('.quick-prompt-btn');
    quickBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        if (prompt) this.handleUserQuery(prompt);
      });
    });

    // Botón recalibrar estilo DUA
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

    this.addBotMessage(`🔄 Has recalibrado tu perfil DUA a: <strong>${profileData.name}</strong>.<br>${profileData.recommendation}`);
    this.dua.speak(`Perfil DUA actualizado a estilo ${profileData.name}.`);
  }

  handleUserQuery(query) {
    this.addUserMessage(query);

    // Indicador de "pensando"
    const typingId = this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator(typingId);
      const response = this.generateAdaptiveResponse(query);
      this.addBotMessage(response);
      this.dua.speak(response.replace(/<[^>]*>?/gm, ''));
    }, 600);
  }

  generateAdaptiveResponse(query) {
    const q = query.toLowerCase();

    // 1. Pistas para NeuroMath
    if (q.includes('neuromath') || q.includes('redes') || q.includes('matemática') || q.includes('pérdida')) {
      return `
        <strong>🧠 Andamiaje Adaptativo - NeuroMath & IA:</strong><br>
        1. <strong>Tasa de Aprendizaje (LR):</strong> Manténla en el rango dulce entre <strong>0.04 y 0.08</strong>. Si supera 0.18, el gradiente oscilará y divergerá.<br>
        2. <strong>Regularización L2:</strong> Configúrala cerca de <strong>0.025</strong> para castigar pesos gigantes y evitar el sobreajuste (overfitting).<br>
        3. <strong>Optimizador:</strong> Selecciona <strong>Adam</strong>, pues ajusta adaptativamente el momento por cada parámetro.<br>
        <em>¡Aplica estos parámetros en el simulador del Domo 2 para alcanzar más del 90% de precisión!</em>
      `;
    }

    // 2. Gerencia+ y metodologías ágiles
    if (q.includes('gerencia') || q.includes('ágil') || q.includes('sprint') || q.includes('scrum') || q.includes('liderazgo')) {
      return `
        <strong>💼 Estrategia de Liderazgo - Gerencia+:</strong><br>
        En metodologías ágiles, el liderazgo no es coercitivo, sino de <strong>servicio (Servant Leadership)</strong>.<br>
        - Cuando el cliente pide más alcance: No digas "no", aplica <em>Trade-offs</em> (renegociar prioridades manteniendo la capacidad sostenible).<br>
        - Ante bloqueos técnicos: Fomenta la seguridad psicológica y el trabajo en enjambre (Swarming), nunca culpes al individuo.
      `;
    }

    // 3. Recomendación de ruta según DUA
    if (q.includes('ruta') || q.includes('recomiendas') || q.includes('empezar') || q.includes('iniciar')) {
      if (this.currentProfile === 'kinesthetic') {
        return `
          <strong>🎯 Recomendación Personalizada (Perfil Vivencial/Práctico):</strong><br>
          Dado tu estilo orientado a la acción, te sugiero teletransportarte directamente al <strong>Domo 2 (NeuroMath)</strong> o al <strong>Domo 4 (Gerencia+)</strong>. Allí podrás poner a prueba tus competencias en simuladores interactivos en tiempo real con retroalimentación inmediata.
        `;
      } else if (this.currentProfile === 'visual') {
        return `
          <strong>🎯 Recomendación Personalizada (Perfil Visual/Espacial):</strong><br>
          Te recomiendo abrir el <strong>Árbol de Competencias (Tecla M)</strong> para explorar el Radar Hexagonal y visitar las pestañas de <strong>Diagramas Interactivos</strong> e infografías en Comunicarte y Latido Social.
        `;
      } else {
        return `
          <strong>🎯 Recomendación Personalizada (Perfil Auditivo/Narrativo):</strong><br>
          Inicia tu recorrido en <strong>Comunicarte (Domo 1)</strong> o <strong>VoxCivitas (Domo 3)</strong> y reproduce los <strong>Podcasts Sonoros</strong> narrados por los mentores con el sintetizador de voz activado.
        `;
      }
    }

    // 4. Explicación de DUA y UNIMINUTO
    if (q.includes('dua') || q.includes('diseño universal') || q.includes('inclusión')) {
      return `
        <strong>♿ Principios del DUA en VirtuXperience:</strong><br>
        El Diseño Universal para el Aprendizaje busca que ningún estudiante quede atrás mediante:<br>
        1. <strong>Múltiples formas de representación:</strong> Entorno 3D, lector de voz (TTS), infografías visuales y podcasts sonoros.<br>
        2. <strong>Múltiples formas de acción y expresión:</strong> Teclado completo, mouse, navegación táctil y atajos numéricos directos (0 al 6).<br>
        3. <strong>Múltiples formas de implicación:</strong> Gamificación, desafíos del mundo real colombiano y retroalimentación formativa inmediata.
      `;
    }

    // 5. Latido Social o Ciudadanía
    if (q.includes('social') || q.includes('comunitaria') || q.includes('latido') || q.includes('ciudadanía') || q.includes('voxcivitas')) {
      return `
        <strong>❤️ Enfoque de Transformación Social:</strong><br>
        En UNIMINUTO concebimos la responsabilidad social no como filantropía, sino como <strong>empoderamiento comunitario y justicia distributiva</strong>. En el simulador de Latido Social, recuerda que la infraestructura sin diálogo ciudadano genera elefantes blancos. ¡Equilibra la inversión!
      `;
    }

    // Respuesta adaptativa contextual general
    return `
      Como tu tutor adaptativo, te recuerdo que en <strong>VirtuXperience</strong> superamos la memorización para enfocarnos en la <strong>aplicación directa de la competencia</strong>.<br>
      Puedes teletransportarte a cualquiera de los 6 Domos temáticos utilizando los botones superiores o las teclas <strong>1 a 6</strong>. ¿Deseas andamiaje sobre alguna simulación en específico?
    `;
  }

  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user-msg';
    msg.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="msg-content"><p>${text}</p></div>
    `;
    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
  }

  addBotMessage(html) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot-msg';
    msg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content"><p>${html}</p></div>
    `;
    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
  }

  showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = 'chat-msg bot-msg';
    msg.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content"><p style="color:var(--text-dim);"><em>VirtuMentor está analizando tu perfil pedagógico...</em></p></div>
    `;
    this.chatHistoryEl.appendChild(msg);
    this.chatHistoryEl.scrollTop = this.chatHistoryEl.scrollHeight;
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}
