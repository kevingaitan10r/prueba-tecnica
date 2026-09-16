/**
 * DuaAccessibility: Motor de Diseño Universal para el Aprendizaje y Accesibilidad WCAG
 * Soporta múltiples formas de representación (TTS, alto contraste, 2D fallback),
 * acción y expresión (controles directos por teclado y mouse) e implicación formativa.
 */

export class DuaAccessibility {
  constructor(audioSystem) {
    this.audioSystem = audioSystem;
    this.ttsEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.spanishVoice = null;

    this.initVoices();
    this.initUIBindings();
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Priorizar voces en español
      this.spanishVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  speak(text) {
    if (!this.synth || !this.ttsEnabled || !text) return;

    // Detener cualquier lectura previa
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.spanishVoice) {
      utterance.voice = this.spanishVoice;
    }
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  initUIBindings() {
    // Switch de alto contraste
    const toggleHighContrast = document.getElementById('toggle-high-contrast');
    if (toggleHighContrast) {
      toggleHighContrast.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      });
    }

    // Switch de TTS automático
    const toggleTTS = document.getElementById('toggle-tts-auto');
    if (toggleTTS) {
      toggleTTS.addEventListener('change', (e) => {
        this.ttsEnabled = e.target.checked;
        if (!this.ttsEnabled) this.stopSpeaking();
      });
    }

    // Switch de movimiento reducido
    const toggleMotion = document.getElementById('toggle-reduced-motion');
    if (toggleMotion) {
      toggleMotion.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.body.classList.add('reduced-motion');
        } else {
          document.body.classList.remove('reduced-motion');
        }
      });
    }

    // Botones de tamaño tipográfico
    const fontBtns = document.querySelectorAll('.font-btn');
    fontBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.body.classList.remove('font-large', 'font-xlarge');
        const size = btn.getAttribute('data-size');
        if (size === 'large') document.body.classList.add('font-large');
        if (size === 'xlarge') document.body.classList.add('font-xlarge');
      });
    });

    // Botón de cambio a Modo 2D Accesible
    const btn2D = document.getElementById('btn-switch-2d-mode');
    if (btn2D) {
      btn2D.addEventListener('click', () => {
        document.body.classList.toggle('mode-2d-direct');
        const is2D = document.body.classList.contains('mode-2d-direct');
        btn2D.textContent = is2D ? 'Restaurar Modo 3D' : 'Activar Modo 2D HUD';
        this.speak(is2D ? 'Modo 2D accesible activado' : 'Modo 3D restaurado');
      });
    }
  }
}
