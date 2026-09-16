import { TRANSVERSAL_LINES } from './TransversalLines.js';

export class NarrativeEngine {
  constructor(audioSystem, duaSystem, progressSystem) {
    this.audio = audioSystem;
    this.dua = duaSystem;
    this.progress = progressSystem;

    this.activeLine = null;
    this.activeFormat = 'gamified';

    // Elementos del modal de estación
    this.stationModal = document.getElementById('modal-station');
    this.stationIcon = document.getElementById('modal-station-icon');
    this.stationTag = document.getElementById('modal-station-tag');
    this.stationTitle = document.getElementById('modal-station-title');
    this.stationNarrative = document.getElementById('station-narrative-text');
    this.formatContentView = document.getElementById('format-content-view');
    this.levelsGrid = document.getElementById('station-levels-grid');
    this.btnLaunchSim = document.getElementById('btn-launch-station-simulator');
    this.btnSpeakStation = document.getElementById('btn-speak-station');

    // Modal de competencias
    this.compModal = document.getElementById('modal-competencies');
    this.accordionContainer = document.getElementById('competencies-accordion');

    this.initEvents();
    this.buildCompetenciesAccordion();
  }

  initEvents() {
    // Pestañas de formatos
    const tabs = document.querySelectorAll('.format-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeFormat = tab.getAttribute('data-format');
        this.renderActiveFormat();
      });
    });

    // Botón TTS de la estación
    if (this.btnSpeakStation) {
      this.btnSpeakStation.addEventListener('click', () => {
        if (this.activeLine) {
          this.dua.speak(`${this.activeLine.title}. ${this.activeLine.narrative}`);
        }
      });
    }

    // Botón de lanzar simulador desde la estación
    if (this.btnLaunchSim) {
      this.btnLaunchSim.addEventListener('click', () => {
        if (this.activeLine && this.activeLine.hasSimulator && this.activeLine.simId) {
          this.stationModal.classList.add('hidden');
          const simModal = document.getElementById(this.activeLine.simId);
          if (simModal) {
            simModal.classList.remove('hidden');
            this.audio.playChime();
          }
        } else {
          alert('Este domo incluye actividades teóricas y reflexivas en los formatos audiovisual y sonoro.');
        }
      });
    }
  }

  openStation(lineData) {
    this.activeLine = lineData;
    this.audio.playChime();

    if (this.stationIcon) this.stationIcon.textContent = lineData.icon;
    if (this.stationTag) this.stationTag.textContent = `Línea Transversal #${lineData.id}`;
    if (this.stationTitle) this.stationTitle.textContent = lineData.title;
    if (this.stationNarrative) {
      this.stationNarrative.innerHTML = `
        <strong>Mentor: ${lineData.mentor.name} (${lineData.mentor.role})</strong><br>
        "${lineData.mentor.greeting}"<br><br>
        ${lineData.narrative}
      `;
    }

    // Adaptar botón de simulador
    if (this.btnLaunchSim) {
      if (lineData.hasSimulator) {
        this.btnLaunchSim.style.display = 'inline-flex';
        this.btnLaunchSim.textContent = `🚀 Iniciar Simulación Práctica (${lineData.title})`;
      } else {
        this.btnLaunchSim.style.display = 'none';
      }
    }

    // Renderizar formato activo
    this.renderActiveFormat();

    // Renderizar niveles de competencia de esta línea
    this.renderLevelsGrid(lineData);

    if (this.stationModal) this.stationModal.classList.remove('hidden');

    // Lectura automática accesible si está activada
    this.dua.speak(`Estación ${lineData.title}. ${lineData.tagline}`);
  }

  renderActiveFormat() {
    if (!this.activeLine || !this.formatContentView) return;
    const fmt = this.activeLine.formats[this.activeFormat];
    if (!fmt) return;

    if (this.activeFormat === 'gamified') {
      this.formatContentView.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h4 style="font-size:1.1rem; color:#38bdf8; margin-bottom:8px;">🎮 ${fmt.title}</h4>
            <p style="font-size:0.9rem; color:#cbd5e1; max-width:600px; line-height:1.5;">${fmt.desc}</p>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:#e8a800; font-weight:700;">Insignia a desbloquear:</span><br>
            <strong style="font-size:0.95rem; color:#fff;">🏅 ${fmt.badge}</strong>
          </div>
        </div>
      `;
    } else if (this.activeFormat === 'audiovisual') {
      this.formatContentView.innerHTML = `
        <div>
          <h4 style="font-size:1.1rem; color:#38bdf8; margin-bottom:8px;">🎬 ${fmt.title}</h4>
          <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:12px;">Duración estimada: <strong>${fmt.duration}</strong></p>
          <div style="background:rgba(0,0,0,0.4); border:1px dashed rgba(255,255,255,0.2); border-radius:8px; padding:20px; text-align:center;">
            <div style="font-size:2.5rem; margin-bottom:8px;">${fmt.thumbnail}</div>
            <p style="font-size:0.9rem; color:#e2e8f0; max-width:550px; margin:0 auto 12px auto;">${fmt.summary}</p>
            <button class="btn-secondary" onclick="alert('Reproduciendo micro-cápsula interactiva UNIMINUTO en alta definición.')">▶️ Reproducir Cápsula con Subtítulos DUA</button>
          </div>
        </div>
      `;
    } else if (this.activeFormat === 'audio') {
      this.formatContentView.innerHTML = `
        <div>
          <h4 style="font-size:1.1rem; color:#38bdf8; margin-bottom:8px;">🎙️ ${fmt.title}</h4>
          <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:12px;">Locución: <strong>${fmt.narrator}</strong> &bull; Duración: <strong>${fmt.duration}</strong></p>
          <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:16px;">
            <p style="font-size:0.88rem; color:#e2e8f0; margin-bottom:12px;">${fmt.summary}</p>
            <div style="display:flex; align-items:center; gap:12px;">
              <button class="btn-primary" onclick="alert('Reproduciendo podcast formativo.')">▶️ Escuchar Podcast</button>
              <button class="btn-secondary" onclick="alert('Mostrando transcripción textual accesible DUA.')">📄 Ver Transcripción Escrita</button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeFormat === 'diagram') {
      this.formatContentView.innerHTML = `
        <div>
          <h4 style="font-size:1.1rem; color:#38bdf8; margin-bottom:8px;">🗺️ ${fmt.title}</h4>
          <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:12px;">Formato: <strong>${fmt.type}</strong></p>
          <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:16px;">
            <p style="font-size:0.88rem; color:#e2e8f0; margin-bottom:14px;">${fmt.summary}</p>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <span style="background:rgba(2,132,199,0.25); border:1px solid #0284c7; padding:4px 10px; border-radius:4px; font-size:0.8rem;">Concepto Primario</span>
              <span style="background:rgba(139,92,246,0.25); border:1px solid #8b5cf6; padding:4px 10px; border-radius:4px; font-size:0.8rem;">Interrelación Dinámica</span>
              <span style="background:rgba(16,185,129,0.25); border:1px solid #10b981; padding:4px 10px; border-radius:4px; font-size:0.8rem;">Aplicación Práctica</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  renderLevelsGrid(lineData) {
    if (!this.levelsGrid) return;
    this.levelsGrid.innerHTML = '';

    lineData.subcompetencies.forEach((sub) => {
      const card = document.createElement('div');
      card.className = 'level-card';
      card.innerHTML = `
        <div class="level-tag">${sub.name}</div>
        <div class="level-desc" style="margin-bottom:6px;"><strong>I:</strong> ${sub.levels.I}</div>
        <div class="level-desc" style="margin-bottom:6px;"><strong>II:</strong> ${sub.levels.II}</div>
        <div class="level-desc"><strong>III:</strong> ${sub.levels.III}</div>
      `;
      this.levelsGrid.appendChild(card);
    });
  }

  buildCompetenciesAccordion() {
    if (!this.accordionContainer) return;
    this.accordionContainer.innerHTML = '';

    TRANSVERSAL_LINES.forEach((line) => {
      const item = document.createElement('div');
      item.className = 'comp-accordion-item';

      const header = document.createElement('button');
      header.className = 'comp-accordion-header';
      header.innerHTML = `
        <div class="comp-header-left">
          <span class="comp-line-icon">${line.icon}</span>
          <span class="comp-line-title" style="color:${line.colorHex};">${line.title}</span>
        </div>
        <span style="font-size:0.8rem; color:#94a3b8;">${line.subcompetencies.length} competencias &bull; Desplegar ▼</span>
      `;

      const subList = document.createElement('div');
      subList.className = 'comp-sub-list';

      line.subcompetencies.forEach((sub) => {
        const subCard = document.createElement('div');
        subCard.className = 'comp-sub-card';
        subCard.innerHTML = `
          <div class="comp-sub-card-title">${sub.name}</div>
          <div class="comp-levels-badge-row">
            <span class="level-chip unlocked">Nivel I: Fundamentos</span>
            <span class="level-chip unlocked">Nivel II: Aplicado</span>
            <span class="level-chip">Nivel III: Maestría</span>
          </div>
        `;
        subList.appendChild(subCard);
      });

      header.addEventListener('click', () => {
        subList.style.display = subList.style.display === 'none' ? 'grid' : 'none';
      });

      item.appendChild(header);
      item.appendChild(subList);
      this.accordionContainer.appendChild(item);
    });
  }
}
