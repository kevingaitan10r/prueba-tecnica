import { TRANSVERSAL_LINES } from './TransversalLines.js';

export class ProgressSystem {
  constructor(audioSystem, duaSystem) {
    this.audio = audioSystem;
    this.dua = duaSystem;

    this.xp = 0;
    this.rank = 'Navegante I';
    this.unlockedCompetencies = {};
    this.badges = [];
    this.quests = [
      { id: 'q1', text: 'Explorar el Domo Comunicarte', done: false, dome: 1 },
      { id: 'q2', text: 'Superar Simulador NeuroMath & IA', done: false, dome: 2 },
      { id: 'q3', text: 'Conocer el Ágora VoxCivitas', done: false, dome: 3 },
      { id: 'q4', text: 'Superar Simulación Gerencia+ Ágil', done: false, dome: 4 },
      { id: 'q5', text: 'Visitar Hub Activa Tu Idea', done: false, dome: 5 },
      { id: 'q6', text: 'Superar Misión Latido Social', done: false, dome: 6 }
    ];

    this.load();
    this.initUI();
  }

  load() {
    try {
      const saved = localStorage.getItem('virtuxperience_progress');
      if (saved) {
        const data = JSON.parse(saved);
        this.xp = data.xp || 0;
        this.rank = data.rank || 'Navegante I';
        this.unlockedCompetencies = data.unlockedCompetencies || {};
        this.badges = data.badges || [];
        if (data.quests) this.quests = data.quests;
      }
    } catch (e) {
      console.warn('No se pudo cargar progreso previo:', e);
    }
  }

  save() {
    try {
      const data = {
        xp: this.xp,
        rank: this.rank,
        unlockedCompetencies: this.unlockedCompetencies,
        badges: this.badges,
        quests: this.quests
      };
      localStorage.setItem('virtuxperience_progress', JSON.stringify(data));
    } catch (e) {
      console.warn('Error al guardar progreso:', e);
    }
  }

  initUI() {
    this.updateHUD();
    this.renderQuests();
  }

  awardXP(amount, reason) {
    this.xp += amount;
    this.checkRank();
    this.save();
    this.updateHUD();
    this.showToast('¡Experiencia Ganada!', `+${amount} XP: ${reason}`, 'achievement');
  }

  checkRank() {
    let oldRank = this.rank;
    if (this.xp >= 600) this.rank = 'Maestro VirtuXperience';
    else if (this.xp >= 350) this.rank = 'Especialista Transversal';
    else if (this.xp >= 150) this.rank = 'Navegante II';
    else this.rank = 'Navegante I';

    if (oldRank !== this.rank) {
      this.showToast('¡Ascenso de Nivel!', `Has alcanzado el rango de ${this.rank}`, 'achievement');
      this.dua.speak(`Felicitaciones, has ascendido al rango de ${this.rank}`);
    }
  }

  unlockCompetency(lineCode, subId, level) {
    if (!this.unlockedCompetencies[lineCode]) {
      this.unlockedCompetencies[lineCode] = {};
    }
    this.unlockedCompetencies[lineCode][subId] = level;

    // Actualizar quest si aplica
    if (lineCode === 'neuromath') this.completeQuest('q2');
    if (lineCode === 'gerencia') this.completeQuest('q4');
    if (lineCode === 'latidosocial') this.completeQuest('q6');

    this.save();
    this.updateHUD();
    this.drawRadarChart();
  }

  unlockBadge(badgeName) {
    if (!this.badges.includes(badgeName)) {
      this.badges.push(badgeName);
      this.save();
      this.showToast('Insignia Desbloqueada', `🏅 ${badgeName}`, 'achievement');
    }
  }

  completeQuest(questId) {
    const q = this.quests.find(item => item.id === questId);
    if (q && !q.done) {
      q.done = true;
      this.save();
      this.renderQuests();
      this.awardXP(50, `Misión completada: ${q.text}`);
    }
  }

  updateHUD() {
    const xpCounter = document.getElementById('xp-counter');
    const xpBar = document.getElementById('xp-bar-progress');
    const rankBadge = document.getElementById('user-rank-badge');

    if (xpCounter) xpCounter.textContent = `${this.xp} XP`;
    if (rankBadge) rankBadge.textContent = this.rank;

    const progressPct = Math.min(100, Math.round((this.xp / 700) * 100));
    if (xpBar) xpBar.style.width = `${Math.max(5, progressPct)}%`;

    // Estadísticas globales del modal de competencias
    const statComp = document.getElementById('stat-competencies-unlocked');
    const statChallenges = document.getElementById('stat-challenges-completed');
    const statBadges = document.getElementById('stat-badges-earned');

    let totalComp = 0;
    Object.values(this.unlockedCompetencies).forEach(subs => {
      totalComp += Object.keys(subs).length;
    });

    if (statComp) statComp.textContent = `${totalComp}/18`;
    if (statChallenges) statChallenges.textContent = `${this.quests.filter(q => q.done).length}/6`;
    if (statBadges) statBadges.textContent = `${this.badges.length}/6`;
  }

  renderQuests() {
    const list = document.getElementById('quest-progress-list');
    if (!list) return;

    list.innerHTML = '';
    this.quests.forEach(q => {
      const item = document.createElement('div');
      item.className = `quest-item ${q.done ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="quest-check">${q.done ? '✓' : ''}</div>
        <span>${q.text}</span>
      `;
      list.appendChild(item);
    });
  }

  drawRadarChart() {
    const canvas = document.getElementById('competency-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(centerX, centerY) - 35;

    ctx.clearRect(0, 0, w, h);

    const lines = TRANSVERSAL_LINES;
    const numAxes = lines.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Dibujar círculos concéntricos de nivel (I, II, III)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 3; level++) {
      ctx.beginPath();
      const r = (radius / 3) * level;
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Dibujar radios y nombres
    lines.forEach((line, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.stroke();

      // Etiquetas
      const labelDist = radius + 20;
      const lx = centerX + Math.cos(angle) * labelDist;
      const ly = centerY + Math.sin(angle) * labelDist;

      ctx.fillStyle = line.colorHex;
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.title, lx, ly);
    });

    // Calcular valores actuales por línea
    const values = lines.map(line => {
      const subs = this.unlockedCompetencies[line.code] || {};
      const count = Object.keys(subs).length;
      if (count === 0) return 0.4; // Nivel base visible
      return Math.min(3, 0.8 + count * 0.9);
    });

    // Polígono de dominio del estudiante
    ctx.beginPath();
    values.forEach((val, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius / 3) * val;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = 'rgba(0, 160, 223, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#00a0df';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Puntos de datos
    values.forEach((val, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (radius / 3) * val;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e8a800';
      ctx.fill();
    });
  }

  showToast(title, msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${type === 'achievement' ? '🏆' : '⚡'}</div>
      <div class="toast-content">
        <strong>${title}</strong>
        <div style="font-size:0.8rem; color:#cbd5e1;">${msg}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}
