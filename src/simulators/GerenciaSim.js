/**
 * Simulador Práctico Vivencial: Gerencia+
 * Misión Sprint Ágil y Liderazgo Estratégico en Crisis
 */

export class GerenciaSim {
  constructor(progressSystem, audioSystem, duaSystem) {
    this.progress = progressSystem;
    this.audio = audioSystem;
    this.dua = duaSystem;

    this.currentStep = 0;
    this.stats = {
      velocity: 50,
      morale: 70,
      budget: 80
    };

    this.events = [
      {
        stepPill: 'Evento 1 de 4: Sprint Planning & Alcance',
        title: 'Solicitud Imprevista de Nuevas Historias',
        desc: 'El Product Owner solicita incluir 4 requerimientos críticos sin mover la fecha del demo. El equipo argumenta que la capacidad está al 100%.',
        options: [
          {
            text: 'Rechazar tajantemente la solicitud y cerrar el backlog sin diálogo.',
            effects: { velocity: 0, morale: +5, budget: -15 },
            feedback: 'Mantuviste el foco pero deterioraste la relación de confianza con el cliente y el valor de negocio.'
          },
          {
            text: 'Aceptar todo y exigir al equipo hacer horas extra durante el fin de semana.',
            effects: { velocity: +20, morale: -35, budget: -10 },
            feedback: 'Aumentaste la entrega aparente pero generaste riesgo de burnout y alta rotación de talento.'
          },
          {
            text: 'Aplicar negociación ágil: intercambiar historias de menor prioridad (Trade-off MoSCoW) manteniendo la capacidad sostenible.',
            effects: { velocity: +15, morale: +10, budget: +10 },
            feedback: '¡Excelente decisión! Protegiste el ritmo sostenible del equipo y alineaste el valor entregado con el cliente.'
          }
        ]
      },
      {
        stepPill: 'Evento 2 de 4: Daily Scrum & Bloqueo Técnico',
        title: 'Bloqueo Crítico en Integración de Base de Datos',
        desc: 'El desarrollador senior reporta un fallo de arquitectura que retrasa el 60% del sprint backlog.',
        options: [
          {
            text: 'Organizar una sesión de Pair Programming y Swarming (todo el equipo concentrado en remover el bloqueo).',
            effects: { velocity: +15, morale: +15, budget: 0 },
            feedback: '¡Cultura ágil pura! La colaboración colectiva resolvió el problema rápidamente elevando la cohesión del equipo.'
          },
          {
            text: 'Asignarle la culpa en la daily y pedirle que lo resuelva solo.',
            effects: { velocity: -20, morale: -30, budget: -10 },
            feedback: 'Destruiste la seguridad psicológica del equipo, violando los valores ágiles.'
          }
        ]
      },
      {
        stepPill: 'Evento 3 de 4: Calidad vs. Deuda Técnica',
        title: 'Presión por Entregar a Toda Costa',
        desc: 'Para llegar a la fecha límite, se propone omitir las pruebas automatizadas de regresión.',
        options: [
          {
            text: 'Omitir pruebas y entregar rápido con deuda técnica alta.',
            effects: { velocity: +10, morale: -10, budget: -30 },
            feedback: 'La deuda técnica explotará en producción, aumentando costos de soporte a largo plazo.'
          },
          {
            text: 'Mantener la Definición de Terminado (DoD) estricta y entregar solo lo probado con calidad.',
            effects: { velocity: +5, morale: +15, budget: +15 },
            feedback: '¡Integridad profesional! La Definición de Terminado garantiza software funcional y sostenible.'
          }
        ]
      },
      {
        stepPill: 'Evento 4 de 4: Sprint Retrospective',
        title: 'Inspección y Adaptación Final',
        desc: 'El sprint finalizó. ¿Qué acción de mejora continua priorizarás para el siguiente ciclo?',
        options: [
          {
            text: 'Automatizar el pipeline de despliegue continuo (CI/CD) para reducir fricción en entregas.',
            effects: { velocity: +20, morale: +15, budget: +10 },
            feedback: '¡Visión estratégica! La automatización libera al equipo para enfocarse en valor de negocio.'
          },
          {
            text: 'Saltar la retrospectiva para empezar a programar de inmediato.',
            effects: { velocity: -10, morale: -15, budget: -10 },
            feedback: 'Sin retrospectiva no hay agilidad: el equipo repetirá los mismos errores.'
          }
        ]
      }
    ];

    this.cardContainer = document.getElementById('gerencia-event-card');
    this.stepPill = document.getElementById('gerencia-step-pill');
    this.eventTitle = document.getElementById('gerencia-event-title');
    this.eventDesc = document.getElementById('gerencia-event-desc');
    this.optionsContainer = document.getElementById('gerencia-options-container');

    this.gaugeVelocity = document.getElementById('gauge-velocity');
    this.gaugeMorale = document.getElementById('gauge-morale');
    this.gaugeBudget = document.getElementById('gauge-budget');
    this.numVelocity = document.getElementById('num-velocity');
    this.numMorale = document.getElementById('num-morale');
    this.numBudget = document.getElementById('num-budget');

    this.btnClaim = document.getElementById('btn-claim-gerencia');

    this.renderCurrentEvent();
    if (this.btnClaim) {
      this.btnClaim.addEventListener('click', () => this.claimReward());
    }
  }

  updateGauges() {
    if (this.gaugeVelocity) this.gaugeVelocity.style.width = `${Math.min(100, Math.max(10, this.stats.velocity))}%`;
    if (this.gaugeMorale) this.gaugeMorale.style.width = `${Math.min(100, Math.max(10, this.stats.morale))}%`;
    if (this.gaugeBudget) this.gaugeBudget.style.width = `${Math.min(100, Math.max(10, this.stats.budget))}%`;

    if (this.numVelocity) this.numVelocity.textContent = `${this.stats.velocity} pts`;
    if (this.numMorale) this.numMorale.textContent = `${this.stats.morale}%`;
    if (this.numBudget) this.numBudget.textContent = `${this.stats.budget}%`;
  }

  renderCurrentEvent() {
    if (this.currentStep >= this.events.length) {
      this.renderCompletion();
      return;
    }

    const ev = this.events[this.currentStep];
    if (this.stepPill) this.stepPill.textContent = ev.stepPill;
    if (this.eventTitle) this.eventTitle.textContent = ev.title;
    if (this.eventDesc) this.eventDesc.textContent = ev.desc;

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      ev.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'event-option-btn';
        btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)})</strong> ${opt.text}`;
        btn.addEventListener('click', () => this.handleOptionSelect(opt));
        this.optionsContainer.appendChild(btn);
      });
    }

    this.updateGauges();
  }

  handleOptionSelect(opt) {
    this.audio.playClick();
    this.stats.velocity = Math.max(10, Math.min(100, this.stats.velocity + opt.effects.velocity));
    this.stats.morale = Math.max(10, Math.min(100, this.stats.morale + opt.effects.morale));
    this.stats.budget = Math.max(10, Math.min(100, this.stats.budget + opt.effects.budget));

    this.updateGauges();
    this.dua.speak(opt.feedback);

    // Mostrar feedback breve
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = `
        <div class="sim-ai-eval">
          <div class="feedback-badge">Resultado de tu Decisión Gerencial</div>
          <p>${opt.feedback}</p>
          <button id="btn-next-event" class="btn-primary glow-btn mt-3">Continuar al Siguiente Evento &rarr;</button>
        </div>
      `;
      const nextBtn = document.getElementById('btn-next-event');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.currentStep++;
          this.renderCurrentEvent();
        });
      }
    }
  }

  renderCompletion() {
    if (this.stepPill) this.stepPill.textContent = 'Sprint Concluido Exitosamente';
    if (this.eventTitle) this.eventTitle.textContent = '🎉 Evaluación de Liderazgo Ágil Gerencia+';
    if (this.eventDesc) {
      this.eventDesc.innerHTML = `
        Has completado el ciclo de toma de decisiones. Tu equipo alcanzó una velocidad de <strong>${this.stats.velocity} pts</strong>, 
        una moral del <strong>${this.stats.morale}%</strong> y un balance de calidad de <strong>${this.stats.budget}%</strong>.
      `;
    }

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = `
        <div class="sim-ai-eval">
          <div class="feedback-badge">Dictamen del Comité Evaluador UNIMINUTO</div>
          <p>Has demostrado competencia transversal en Metodologías Ágiles y Liderazgo Situacional, aplicando negociación colaborativa y preservando el bienestar de tu equipo.</p>
        </div>
      `;
    }

    if (this.btnClaim) {
      this.btnClaim.disabled = false;
    }
  }

  claimReward() {
    this.audio.playSuccess();
    this.progress.awardXP(150, 'Dominio en Liderazgo y Metodologías Ágiles (Gerencia+)');
    this.progress.unlockCompetency('gerencia', 'g-agiles', 'II');
    this.progress.unlockBadge('Scrum Master & Estratega');

    if (this.btnClaim) {
      this.btnClaim.disabled = true;
      this.btnClaim.textContent = '✅ Competencia Acreditada';
    }

    const modal = document.getElementById('modal-sim-gerencia');
    if (modal) {
      setTimeout(() => modal.classList.add('hidden'), 1200);
    }
  }
}
