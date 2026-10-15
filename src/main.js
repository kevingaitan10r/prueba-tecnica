import { World } from './engine/World.js';
import { Environment } from './engine/Environment.js';
import { Controls } from './engine/Controls.js';
import { AudioSystem } from './engine/AudioSystem.js';
import { DuaAccessibility } from './modules/DuaAccessibility.js';
import { ProgressSystem } from './modules/ProgressSystem.js';
import { NarrativeEngine } from './modules/NarrativeEngine.js';
import { AIAssistant } from './modules/AIAssistant.js';
import { CertificateGenerator } from './modules/CertificateGenerator.js';
import { NeuroMathSim } from './simulators/NeuroMathSim.js';
import { GerenciaSim } from './simulators/GerenciaSim.js';
import { LatidoSocialSim } from './simulators/LatidoSocialSim.js';
import { TRANSVERSAL_LINES } from './modules/TransversalLines.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.audioSystem = new AudioSystem();
    this.duaSystem = new DuaAccessibility(this.audioSystem);
    this.progressSystem = new ProgressSystem(this.audioSystem, this.duaSystem);

    this.world = new World('webgl-container');
    this.environment = new Environment(this.world);
    this.world.addUpdatable(this.environment);

    this.narrativeEngine = new NarrativeEngine(this.audioSystem, this.duaSystem, this.progressSystem);
    this.aiAssistant = new AIAssistant(this.duaSystem, this.progressSystem);
    this.certificateGenerator = new CertificateGenerator(this.progressSystem, this.audioSystem);

    this.simNeuroMath = new NeuroMathSim(this.progressSystem, this.audioSystem, this.duaSystem);
    this.simGerencia = new GerenciaSim(this.progressSystem, this.audioSystem, this.duaSystem);
    this.simLatidoSocial = new LatidoSocialSim(this.progressSystem, this.audioSystem, this.duaSystem);

    this.controls = new Controls(
      this.world,
      this.environment,
      (userData) => this.handleObjectInteraction(userData),
      (domeIdx, loc) => this.handleZoneChange(domeIdx, loc)
    );
    this.world.addUpdatable(this.controls);

    this.setupUI();
    this.world.start();

    // Mensaje de bienvenida inicial diferido para carga de assets
    setTimeout(() => {
      this.progressSystem.showToast(
        'VirtuXperience Iniciado',
        'Usa WASD o los atajos numéricos 1-6 para explorar los domos temáticos.',
        'achievement'
      );
    }, 800);
  }

  handleObjectInteraction(userData) {
    if (!userData) return;

    if (userData.type === 'agora') {
      this.openModal('modal-competencies', () => this.progressSystem.drawRadarChart());
    } else if (userData.type === 'dome' && userData.lineData) {
      this.narrativeEngine.openStation(userData.lineData);
    }
  }

  handleZoneChange(domeIdx) {
    this.audioSystem.playTeleport();

    const quickBtns = document.querySelectorAll('.dome-quick-btn');
    quickBtns.forEach((btn) => {
      const idx = Number(btn.getAttribute('data-dome'));
      btn.classList.toggle('active', idx === domeIdx);
    });

    if (domeIdx > 0) {
      const line = TRANSVERSAL_LINES.find((l) => l.id === domeIdx);
      if (line) {
        this.progressSystem.awardXP(25, `Exploración: Domo ${line.title}`);
        this.progressSystem.completeQuest(`q${domeIdx}`);
      }
    }
  }

  openModal(modalId, onOpen) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    if (typeof onOpen === 'function') onOpen();
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach((m) => {
      m.classList.add('hidden');
    });
    this.duaSystem.stopSpeaking();
  }

  setupUI() {
    // Manejo unificado de cierre por atributo data-close
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
        this.duaSystem.stopSpeaking();
      });
    });

    // Atajos de teclado para modales globales
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

      if (isTypingTarget(e.target)) return;

      if (e.code === 'KeyM') {
        const compModal = document.getElementById('modal-competencies');
        if (compModal) {
          const isHidden = compModal.classList.toggle('hidden');
          if (!isHidden) {
            this.progressSystem.drawRadarChart();
          }
        }
      } else if (e.code === 'KeyH') {
        this.setControlsHintVisible(this.controlsFooter.classList.contains('hints-hidden'));
      }
    });

    this.setupControlsHint();

    // Botones del HUD
    const hudBindings = [
      { id: 'btn-open-competencies', action: () => this.openModal('modal-competencies', () => this.progressSystem.drawRadarChart()) },
      { id: 'btn-open-ai', action: () => this.openModal('modal-ai') },
      { id: 'btn-accessibility', action: () => this.openModal('modal-accessibility') }
    ];

    hudBindings.forEach(({ id, action }) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', action);
    });

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const enabled = this.audioSystem.toggleSound();
        const icon = document.getElementById('sound-icon');
        if (icon) icon.textContent = enabled ? '🔊' : '🔇';
      });
    }

    // Botones de teletransporte rápido a los domos (0 al 6)
    document.querySelectorAll('.dome-quick-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const domeIdx = Number(btn.getAttribute('data-dome'));
        this.controls.teleportTo(domeIdx);
      });
    });

    // Colapso de paneles secundarios
    const setupCollapsible = (btnId, panelSelector) => {
      const btn = document.getElementById(btnId);
      const panel = document.querySelector(panelSelector);
      if (btn && panel) {
        btn.addEventListener('click', () => {
          const isMinimized = panel.classList.toggle('minimized');
          btn.textContent = isMinimized ? '+' : '_';
        });
      }
    };

    setupCollapsible('btn-minimize-quests', '.hud-quest-tracker');
    setupCollapsible('btn-minimize-minimap', '.hud-minimap-panel');

    // Desbloqueo de AudioContext tras la primera interacción requerida por el navegador
    window.addEventListener('click', () => {
      this.audioSystem.startAmbientDrone();
    }, { once: true });
  }

  setupControlsHint() {
    this.controlsFooter = document.querySelector('.hud-bottom-controls');
    this.controlsReopenBtn = document.getElementById('btn-show-controls');
    if (!this.controlsFooter) return;

    this.controlsReopenBtn?.addEventListener('click', () => this.setControlsHintVisible(true));

    // Quien ya ocultó los atajos antes no necesita verlos otra vez
    if (localStorage.getItem(HINTS_STORAGE_KEY) === 'hidden') {
      this.setControlsHintVisible(false, false);
      return;
    }

    // Se ocultan solos al empezar a moverse o después de 8 segundos
    const autoHide = () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onFirstMove);
      this.setControlsHintVisible(false, false);
    };
    const onFirstMove = (e) => {
      if (MOVEMENT_KEYS.has(e.code) && !isTypingTarget(e.target)) {
        setTimeout(autoHide, 1500);
        window.removeEventListener('keydown', onFirstMove);
      }
    };
    const timer = setTimeout(autoHide, 8000);
    window.addEventListener('keydown', onFirstMove);
  }

  setControlsHintVisible(visible, remember = true) {
    this.controlsFooter.classList.toggle('hints-hidden', !visible);
    this.controlsReopenBtn?.setAttribute('aria-expanded', String(visible));
    if (remember) {
      localStorage.setItem(HINTS_STORAGE_KEY, visible ? 'visible' : 'hidden');
    }
  }
}

const HINTS_STORAGE_KEY = 'virtuxperience_hints';
const MOVEMENT_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

function isTypingTarget(el) {
  return el instanceof HTMLElement && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
