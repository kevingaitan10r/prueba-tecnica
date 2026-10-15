import { evaluateNeuroMath } from './scoring.js';

export class NeuroMathSim {
  constructor(progressSystem, audioSystem, duaSystem) {
    this.progress = progressSystem;
    this.audio = audioSystem;
    this.dua = duaSystem;

    this.chartCanvas = document.getElementById('neuromath-chart-canvas');
    this.ctx = this.chartCanvas ? this.chartCanvas.getContext('2d') : null;

    this.lrSlider = document.getElementById('nm-learning-rate');
    this.regSlider = document.getElementById('nm-regularization');
    this.layerSlider = document.getElementById('nm-layers');
    this.optimizerSelect = document.getElementById('nm-optimizer');

    this.lrVal = document.getElementById('val-learning-rate');
    this.regVal = document.getElementById('val-regularization');
    this.layerVal = document.getElementById('val-layers');

    this.metricAcc = document.getElementById('nm-metric-acc');
    this.metricLoss = document.getElementById('nm-metric-loss');
    this.metricGen = document.getElementById('nm-metric-generalization');
    this.feedbackText = document.getElementById('nm-feedback-text');

    this.btnRun = document.getElementById('btn-run-simulation-neuromath');
    this.btnClaim = document.getElementById('btn-claim-neuromath');

    this.initEvents();
  }

  initEvents() {
    if (this.lrSlider) {
      this.lrSlider.addEventListener('input', (e) => {
        if (this.lrVal) this.lrVal.textContent = parseFloat(e.target.value).toFixed(3);
      });
    }

    if (this.regSlider) {
      this.regSlider.addEventListener('input', (e) => {
        if (this.regVal) this.regVal.textContent = parseFloat(e.target.value).toFixed(3);
      });
    }

    if (this.layerSlider) {
      this.layerSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (this.layerVal) this.layerVal.textContent = `${val} capas (${val * 16} nodos)`;
      });
    }

    if (this.btnRun) {
      this.btnRun.addEventListener('click', () => this.runSimulation());
    }

    if (this.btnClaim) {
      this.btnClaim.addEventListener('click', () => this.claimReward());
    }
  }

  runSimulation() {
    this.audio.playClick();
    const lr = parseFloat(this.lrSlider ? this.lrSlider.value : 0.05);
    const reg = parseFloat(this.regSlider ? this.regSlider.value : 0.02);
    const layers = parseInt(this.layerSlider ? this.layerSlider.value : 4, 10);
    const optimizer = this.optimizerSelect ? this.optimizerSelect.value : 'adam';

    const result = evaluateNeuroMath({ lr, reg, layers, optimizer });

    if (this.metricAcc) this.metricAcc.textContent = `${result.accuracy}%`;
    if (this.metricLoss) this.metricLoss.textContent = `${result.loss}`;
    if (this.metricGen) this.metricGen.textContent = result.generalization;
    if (this.feedbackText) this.feedbackText.textContent = result.feedback;

    this.dua.speak(result.feedback);
    this.drawLossCurve(result.accuracy, result.loss);

    if (this.btnClaim) {
      this.btnClaim.disabled = !result.isSuccess;
    }
  }

  drawLossCurve(accuracy, lossVal) {
    if (!this.ctx || !this.chartCanvas) return;
    const ctx = this.ctx;
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Fondo y cuadrícula
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Curva de pérdida
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 50);

    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const x = 40 + (i / steps) * (w - 70);
      const decay = Math.exp(-i * 0.12);
      const noise = (Math.sin(i * 1.5) * 2);
      const y = h - 30 - ((1 - decay) * (h - 90)) * (accuracy / 100) + noise;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText('Curva de Aprendizaje y Pérdida', 40, 22);
  }

  claimReward() {
    this.audio.playSuccess();
    this.progress.awardXP(150, 'Dominio en Optimización de Redes Neuronales (NeuroMath)');
    this.progress.unlockCompetency('neuromath', 'nm-ia-mat', 'II');
    this.progress.unlockBadge('Científico de Datos UNIMINUTO');

    if (this.btnClaim) {
      this.btnClaim.disabled = true;
      this.btnClaim.textContent = 'Competencia Acreditada';
    }

    const modal = document.getElementById('modal-sim-neuromath');
    if (modal) {
      setTimeout(() => modal.classList.add('hidden'), 1200);
    }
  }
}
