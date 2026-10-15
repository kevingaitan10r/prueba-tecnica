import { generateCertificateHash } from '../utils/crypto.js';

export class CertificateGenerator {
  constructor(progressSystem, audioSystem) {
    this.progress = progressSystem;
    this.audio = audioSystem;

    this.btnView = document.getElementById('btn-view-certificate');
    this.btnPrint = document.getElementById('btn-print-certificate');
    this.modal = document.getElementById('modal-certificate');
    this.nameEl = document.getElementById('cert-student-name');
    this.hashEl = document.getElementById('cert-hash-code');
    this.dateEl = document.getElementById('cert-issue-date');

    this.studentName = 'Estudiante VirtuXperience';
    this.currentHash = null;

    this.initEvents();
  }

  initEvents() {
    if (this.btnView) {
      this.btnView.addEventListener('click', () => this.openCertificate());
    }

    if (this.btnPrint) {
      this.btnPrint.addEventListener('click', () => this.printCertificate());
    }
  }

  async openCertificate() {
    this.audio.playChime();

    if (this.nameEl && (this.nameEl.textContent.includes('Destacado') || this.studentName === 'Estudiante VirtuXperience')) {
      const inputName = prompt('Nombre completo del estudiante para expedición del certificado:', 'Kevin Felipe Gaitán Rodríguez');
      if (inputName && inputName.trim()) {
        this.studentName = inputName.trim();
        this.nameEl.textContent = this.studentName;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    if (this.dateEl) {
      this.dateEl.textContent = today;
    }

    const payload = `${this.studentName}|${today}|${this.progress.xp}|${this.progress.rank}`;
    this.currentHash = await generateCertificateHash(payload);

    if (this.hashEl) {
      this.hashEl.textContent = `HASH: ${this.currentHash}`;
    }

    if (this.modal) {
      this.modal.classList.remove('hidden');
    }
  }

  printCertificate() {
    window.print();
  }
}
