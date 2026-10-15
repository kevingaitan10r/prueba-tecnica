import { evaluateSocialImpact } from './scoring.js';

export class LatidoSocialSim {
  constructor(progressSystem, audioSystem, duaSystem) {
    this.progress = progressSystem;
    this.audio = audioSystem;
    this.dua = duaSystem;

    this.sliderInfra = document.getElementById('alloc-infra');
    this.sliderMediation = document.getElementById('alloc-mediation');
    this.sliderEco = document.getElementById('alloc-sustainability');

    this.lblInfra = document.getElementById('lbl-alloc-infra');
    this.lblMediation = document.getElementById('lbl-alloc-mediation');
    this.lblEco = document.getElementById('lbl-alloc-sustainability');
    this.pointsLeft = document.getElementById('social-points-left');

    this.selectGov = document.getElementById('social-decision-select');
    this.btnSimulate = document.getElementById('btn-simulate-social-impact');
    this.btnClaim = document.getElementById('btn-claim-social');

    this.kpiCohesion = document.getElementById('kpi-cohesion');
    this.kpiEco = document.getElementById('kpi-eco');
    this.kpiEquity = document.getElementById('kpi-equity');
    this.evalText = document.getElementById('social-eval-text');

    this.initEvents();
  }

  initEvents() {
    const updateBudgetDisplay = () => {
      const infra = parseInt(this.sliderInfra ? this.sliderInfra.value : 0, 10) || 0;
      const med = parseInt(this.sliderMediation ? this.sliderMediation.value : 0, 10) || 0;
      const eco = parseInt(this.sliderEco ? this.sliderEco.value : 0, 10) || 0;

      if (this.lblInfra) this.lblInfra.textContent = String(infra);
      if (this.lblMediation) this.lblMediation.textContent = String(med);
      if (this.lblEco) this.lblEco.textContent = String(eco);

      const total = infra + med + eco;
      const remaining = 100 - total;

      if (this.pointsLeft) {
        this.pointsLeft.textContent = String(remaining);
        this.pointsLeft.style.color = remaining === 0 ? '#10b981' : (remaining < 0 ? '#ef4444' : '#f59e0b');
      }
    };

    if (this.sliderInfra) this.sliderInfra.addEventListener('input', updateBudgetDisplay);
    if (this.sliderMediation) this.sliderMediation.addEventListener('input', updateBudgetDisplay);
    if (this.sliderEco) this.sliderEco.addEventListener('input', updateBudgetDisplay);

    if (this.btnSimulate) {
      this.btnSimulate.addEventListener('click', () => this.simulateImpact());
    }

    if (this.btnClaim) {
      this.btnClaim.addEventListener('click', () => this.claimReward());
    }
  }

  simulateImpact() {
    this.audio.playClick();
    const infra = parseInt(this.sliderInfra ? this.sliderInfra.value : 0, 10) || 0;
    const mediation = parseInt(this.sliderMediation ? this.sliderMediation.value : 0, 10) || 0;
    const eco = parseInt(this.sliderEco ? this.sliderEco.value : 0, 10) || 0;
    const governance = this.selectGov ? this.selectGov.value : 'participative';

    const result = evaluateSocialImpact({ infra, mediation, eco, governance });

    if (result.error === 'EXCEEDED_BUDGET') {
      alert('El presupuesto total asignado supera las 100 unidades permitidas.');
      return;
    }

    if (this.kpiCohesion) this.kpiCohesion.textContent = `${result.cohesion}%`;
    if (this.kpiEco) this.kpiEco.textContent = `${result.environmental}%`;
    if (this.kpiEquity) this.kpiEquity.textContent = `${result.equity}%`;

    if (this.evalText) this.evalText.textContent = result.feedback;
    this.dua.speak(result.feedback);

    if (this.btnClaim) {
      this.btnClaim.disabled = !result.isSuccess;
    }
  }

  claimReward() {
    this.audio.playSuccess();
    this.progress.awardXP(150, 'Dominio en Liderazgo Comunitario e Impacto Social (Latido Social)');
    this.progress.unlockCompetency('latidosocial', 'ls-liderazgo-social', 'II');
    this.progress.unlockBadge('Líder Social Transformador');

    if (this.btnClaim) {
      this.btnClaim.disabled = true;
      this.btnClaim.textContent = 'Competencia Acreditada';
    }

    const modal = document.getElementById('modal-sim-social');
    if (modal) {
      setTimeout(() => modal.classList.add('hidden'), 1200);
    }
  }
}
