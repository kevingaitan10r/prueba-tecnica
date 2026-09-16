/**
 * AudioSystem: Motor de audio sintetizado con Web Audio API
 * Genera paisajes sonoros y efectos hápticos/auditivos en tiempo real
 * sin dependencias externas ni problemas de carga de archivos.
 */

export class AudioSystem {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.initContext();
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1);
    } else if (this.isEnabled && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0.04, this.audioCtx.currentTime, 0.2);
    }
    return this.isEnabled;
  }

  startAmbientDrone() {
    if (!this.isEnabled || this.isAmbientPlaying) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      this.ambientGain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Nota A1

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, this.audioCtx.currentTime); // Nota A2

      // Filtro pasa-bajas para calidez espacial
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, this.audioCtx.currentTime);

      this.ambientGain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Audio contextual no disponible:', e);
    }
  }

  playClick() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.04);
  }

  playChime() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Mayor
    frequencies.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.06);

      const startTime = this.audioCtx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  playTeleport() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  playSuccess() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    // Fanfarria triunfal sintética
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.1);

      const st = this.audioCtx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.12, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(st);
      osc.stop(st + 0.6);
    });
  }
}
