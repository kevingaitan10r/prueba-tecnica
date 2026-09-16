/**
 * Simulador Práctico Vivencial: Latido Social & VoxCivitas
 * Laboratorio de Transformación Comunitaria y Diagnóstico Participativo
 */

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
    const updateBudget = () => {
      const infra = parseInt(this.sliderInfra.value) || 0;
      const med = parseInt(this.sliderMediation.value) || 0;
      const eco = parseInt(this.sliderEco.value) || 0;

      if (this.lblInfra) this.lblInfra.textContent = infra;
      if (this.lblMediation) this.lblMediation.textContent = med;
      if (this.lblEco) this.lblEco.textContent = eco;

      const total = infra + med + eco;
      const remaining = 100 - total;

      if (this.pointsLeft) {
        this.pointsLeft.textContent = remaining;
        this.pointsLeft.style.color = remaining === 0 ? '#10b981' : (remaining < 0 ? '#ef4444' : '#f59e0b');
      }
    };

    if (this.sliderInfra) this.sliderInfra.addEventListener('input', updateBudget);
    if (this.sliderMediation) this.sliderMediation.addEventListener('input', updateBudget);
    if (this.sliderEco) this.sliderEco.addEventListener('input', updateBudget);

    if (this.btnSimulate) {
      this.btnSimulate.addEventListener('click', () => this.simulateImpact());
    }

    if (this.btnClaim) {
      this.btnClaim.addEventListener('click', () => this.claimReward());
    }
  }

  simulateImpact() {
    this.audio.playClick();
    const infra = parseInt(this.sliderInfra.value) || 0;
    const med = parseInt(this.sliderMediation.value) || 0;
    const eco = parseInt(this.sliderEco.value) || 0;
    const gov = this.selectGov.value;

    const total = infra + med + eco;
    if (total > 100) {
      alert('⚠️ Has excedido las 100 unidades del fondo comunitario disponible.');
      return;
    }

    // Algoritmo de impacto social multidimensional
    let govBonusCohesion = gov === 'participative' ? 25 : (gov === 'delegated' ? 5 : -10);
    let govBonusEquity = gov === 'participative' ? 20 : (gov === 'delegated' ? 0 : -15);

    let cohesion = Math.min(98, Math.round(med * 1.5 + infra * 0.4 + govBonusCohesion));
    let environmental = Math.min(96, Math.round(eco * 1.6 + infra * 0.5 + 10));
    let equity = Math.min(95, Math.round(med * 1.1 + infra * 0.8 + govBonusEquity));

    if (this.kpiCohesion) this.kpiCohesion.textContent = `${cohesion}%`;
    if (this.kpiEco) this.kpiEco.textContent = `${environmental}%`;
    if (this.kpiEquity) this.kpiEquity.textContent = `${equity}%`;

    let feedback = '';
    const isSuccess = cohesion >= 80 && environmental >= 75 && equity >= 78;

    if (isSuccess) {
      feedback = '🌟 ¡Excelente visión de desarrollo humano integral! Tu distribución equilibró la necesidad física inmediata con el tejido social y la sostenibilidad ecológica a largo plazo, bajo gobernanza comunitaria.';
      if (this.btnClaim) this.btnClaim.disabled = false;
    } else {
      feedback = '⚠️ El plan presenta desbalances: asegúrate de no descuidar las mesas de diálogo ni la sostenibilidad ambiental, y prioriza la gobernanza participativa.';
      if (this.btnClaim) this.btnClaim.disabled = true;
    }

    if (this.evalText) this.evalText.textContent = feedback;
    this.dua.speak(feedback);
  }

  claimReward() {
    this.audio.playSuccess();
    this.progress.awardXP(150, 'Dominio en Liderazgo Comunitario e Impacto Social (Latido Social)');
    this.progress.unlockCompetency('latidosocial', 'ls-liderazgo-social', 'II');
    this.progress.unlockBadge('Líder Social Transformador');

    if (this.btnClaim) {
      this.btnClaim.disabled = true;
      this.btnClaim.textContent = '✅ Competencia Acreditada';
    }

    const modal = document.getElementById('modal-sim-social');
    if (modal) {
      setTimeout(() => modal.classList.add('hidden'), 1200);
    }
  }
}
