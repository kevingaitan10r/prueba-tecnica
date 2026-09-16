/**
 * Simulador Práctico Vivencial: NeuroMath & IA
 * Laboratorio de Optimización Numérica y Redes Neuronales
 */

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
        const val = parseInt(e.target.value);
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
    const lr = parseFloat(this.lrSlider.value);
    const reg = parseFloat(this.regSlider.value);
    const layers = parseInt(this.layerSlider.value);
    const optimizer = this.optimizerSelect.value;

    let accuracy = 70;
    let loss = 0.65;
    let generalization = 'Estable';
    let feedback = '';

    // Evaluación matemática heurística del modelo
    if (lr > 0.18) {
      // Divergencia por gradiente excesivo
      accuracy = Math.max(45, 60 - (lr - 0.18) * 100);
      loss = 1.45;
      generalization = 'Divergencia (Gradiente Explosivo)';
      feedback = '⚠️ La tasa de aprendizaje es demasiado alta. El descenso de gradiente salta los mínimos locales y el modelo oscila sin converger.';
    } else if (lr < 0.015) {
      // Convergencia lenta / estancamiento
      accuracy = 74;
      loss = 0.52;
      generalization = 'Subajuste (Underfitting)';
      feedback = '⚠️ Tasa de aprendizaje excesivamente baja. El modelo avanza con extrema lentitud y no logra aprender los patrones complejos.';
    } else if (layers >= 6 && reg < 0.01) {
      // Sobreajuste
      accuracy = 94; // alta en train pero mala generalización
      loss = 0.12;
      generalization = 'Sobreajuste Severo (Overfitting)';
      feedback = '⚠️ Muchas capas ocultas sin regularización suficiente: la red memorizó los datos de entrenamiento pero fallará con nuevos estudiantes.';
    } else {
      // Rango óptimo
      let optBonus = optimizer === 'adam' ? 5 : (optimizer === 'rmsprop' ? 3 : 0);
      let regBonus = (reg >= 0.015 && reg <= 0.045) ? 6 : -2;
      accuracy = Math.min(97, 85 + optBonus + regBonus + (layers >= 3 && layers <= 5 ? 4 : 0));
      loss = (0.24 - (accuracy - 85) * 0.008).toFixed(3);
      generalization = 'Excelente (Óptima Generalización)';
      feedback = '✅ ¡Excelente configuración! El modelo alcanza alta capacidad predictiva y generaliza correctamente respetando el sesgo inductivo.';
    }

    // Renderizar métricas
    if (this.metricAcc) this.metricAcc.textContent = `${accuracy}%`;
    if (this.metricLoss) this.metricLoss.textContent = `${loss}`;
    if (this.metricGen) this.metricGen.textContent = generalization;
    if (this.feedbackText) this.feedbackText.textContent = feedback;

    this.dua.speak(feedback);
    this.drawLossCurve(accuracy, parseFloat(loss));

    // Habilitar reclamo si logró al menos 88% de precisión y generalización adecuada
    if (accuracy >= 88 && generalization.startsWith('Excelente')) {
      if (this.btnClaim) this.btnClaim.disabled = false;
    } else {
      if (this.btnClaim) this.btnClaim.disabled = true;
    }
  }

  drawLossCurve(accuracy, lossVal) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Fondo y ejes
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Curva de Pérdida (Loss - Violeta)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 50);

    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const x = 40 + (i / steps) * (w - 70);
      const decay = Math.exp(-i * 0.12);
      const noise = (Math.random() - 0.5) * 6;
      const y = h - 30 - ((1 - decay) * (h - 90)) * (accuracy / 100) + noise;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Leyenda
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
      this.btnClaim.textContent = '✅ Competencia Acreditada';
    }

    const modal = document.getElementById('modal-sim-neuromath');
    if (modal) {
      setTimeout(() => modal.classList.add('hidden'), 1200);
    }
  }
}
