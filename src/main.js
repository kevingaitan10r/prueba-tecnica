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
    console.log('🚀 Inicializando UNIMINUTO VirtuXperience 3D...');

    // 1. Motores base
    this.audioSystem = new AudioSystem();
    this.duaSystem = new DuaAccessibility(this.audioSystem);
    this.progressSystem = new ProgressSystem(this.audioSystem, this.duaSystem);

    // 2. Motor 3D Three.js
    this.world = new World('webgl-container');
    this.environment = new Environment(this.world);
    this.world.addUpdatable(this.environment);

    // 3. Motores pedagógicos y narrativos
    this.narrativeEngine = new NarrativeEngine(this.audioSystem, this.duaSystem, this.progressSystem);
    this.aiAssistant = new AIAssistant(this.duaSystem, this.progressSystem);
    this.certificateGenerator = new CertificateGenerator(this.progressSystem, this.audioSystem);

    // 4. Simuladores vivenciales
    this.simNeuroMath = new NeuroMathSim(this.progressSystem, this.audioSystem, this.duaSystem);
    this.simGerencia = new GerenciaSim(this.progressSystem, this.audioSystem, this.duaSystem);
    this.simLatidoSocial = new LatidoSocialSim(this.progressSystem, this.audioSystem, this.duaSystem);

    // 5. Controles de navegación interactiva
    this.controls = new Controls(
      this.world,
      this.environment,
      (userData) => this.handleObjectInteraction(userData),
      (domeIdx, loc) => this.handleZoneChange(domeIdx, loc)
    );
    this.world.addUpdatable(this.controls);

    // 6. Configurar UI global y modales
    this.setupGlobalUI();

    // 7. Iniciar render loop
    this.world.start();

    // Mensaje de bienvenida inicial
    setTimeout(() => {
      this.progressSystem.showToast(
        '¡Bienvenido a VirtuXperience!',
        'Usa WASD o las teclas 1-6 para explorar los 6 Domos del Saber.',
        'achievement'
      );
      this.duaSystem.speak('Bienvenido al campus inmersivo de UNIMINUTO VirtuXperience. Explora los seis domos del saber y demuestra tus competencias.');
    }, 1000);
  }

  handleObjectInteraction(userData) {
    if (!userData) return;

    if (userData.type === 'agora') {
      // Pedestal del Nexo Central -> Abre el Árbol de Competencias
      const compModal = document.getElementById('modal-competencies');
      if (compModal) {
        compModal.classList.remove('hidden');
        this.progressSystem.drawRadarChart();
      }
    } else if (userData.type === 'dome' && userData.lineData) {
      // Pedestal del Domo Temático -> Abre la estación correspondiente
      this.narrativeEngine.openStation(userData.lineData);
    }
  }

  handleZoneChange(domeIdx, loc) {
    this.audioSystem.playTeleport();

    // Actualizar botones de selector superior activo
    const quickBtns = document.querySelectorAll('.dome-quick-btn');
    quickBtns.forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-dome'));
      if (idx === domeIdx) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Otorgar XP de exploración si es primera visita
    if (domeIdx > 0) {
      const line = TRANSVERSAL_LINES.find(l => l.id === domeIdx);
      if (line) {
        this.progressSystem.awardXP(25, `Exploración del Domo ${line.title}`);
        this.progressSystem.completeQuest(`q${domeIdx}`);
      }
    }
  }

  setupGlobalUI() {
    // Cerrar cualquier modal al hacer clic en botones con data-close
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
        this.duaSystem.stopSpeaking();
      });
    });

    // Cerrar modal con tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach((m) => {
          m.classList.add('hidden');
        });
        this.duaSystem.stopSpeaking();
      } else if (e.key === 'm' || e.key === 'M') {
        const compModal = document.getElementById('modal-competencies');
        if (compModal) {
          compModal.classList.toggle('hidden');
          if (!compModal.classList.contains('hidden')) {
            this.progressSystem.drawRadarChart();
          }
        }
      }
    });

    // Botones del HUD superior
    const btnComp = document.getElementById('btn-open-competencies');
    if (btnComp) {
      btnComp.addEventListener('click', () => {
        const m = document.getElementById('modal-competencies');
        if (m) {
          m.classList.remove('hidden');
          this.progressSystem.drawRadarChart();
        }
      });
    }

    const btnAI = document.getElementById('btn-open-ai');
    if (btnAI) {
      btnAI.addEventListener('click', () => {
        const m = document.getElementById('modal-ai');
        if (m) m.classList.remove('hidden');
      });
    }

    const btnAcc = document.getElementById('btn-accessibility');
    if (btnAcc) {
      btnAcc.addEventListener('click', () => {
        const m = document.getElementById('modal-accessibility');
        if (m) m.classList.remove('hidden');
      });
    }

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const enabled = this.audioSystem.toggleSound();
        const icon = document.getElementById('sound-icon');
        if (icon) icon.textContent = enabled ? '🔊' : '🔇';
      });
    }

    // Botones de selector superior de domos (0 al 6)
    document.querySelectorAll('.dome-quick-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const domeIdx = parseInt(btn.getAttribute('data-dome'));
        this.controls.teleportTo(domeIdx);
      });
    });

    // Minimizar / maximizar quest tracker
    const btnMinQuests = document.getElementById('btn-minimize-quests');
    const questTracker = document.querySelector('.hud-quest-tracker');
    if (btnMinQuests && questTracker) {
      btnMinQuests.addEventListener('click', () => {
        questTracker.classList.toggle('minimized');
        btnMinQuests.textContent = questTracker.classList.contains('minimized') ? '+' : '_';
      });
    }

    // Minimizar / maximizar minimapa
    const btnMinMap = document.getElementById('btn-minimize-minimap');
    const minimapPanel = document.querySelector('.hud-minimap-panel');
    if (btnMinMap && minimapPanel) {
      btnMinMap.addEventListener('click', () => {
        minimapPanel.classList.toggle('minimized');
        btnMinMap.textContent = minimapPanel.classList.contains('minimized') ? '+' : '_';
      });
    }

    // Iniciar sonido ambiental al primer clic en la pantalla (política de navegadores)
    window.addEventListener('click', () => {
      this.audioSystem.startAmbientDrone();
    }, { once: true });
  }
}

// Arrancar aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
