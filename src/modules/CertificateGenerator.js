export class CertificateGenerator {
  constructor(progressSystem, audioSystem) {
    this.progress = progressSystem;
    this.audio = audioSystem;

    this.btnView = document.getElementById('btn-view-certificate');
    this.btnPrint = document.getElementById('btn-print-certificate');
    this.modal = document.getElementById('modal-certificate');
    this.nameEl = document.getElementById('cert-student-name');
    this.hashEl = document.getElementById('cert-hash-code');

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

  openCertificate() {
    this.audio.playChime();

    // Generar o recuperar hash único
    const hash = 'VX-2026-' + Math.random().toString(16).substring(2, 8).toUpperCase();
    if (this.hashEl) this.hashEl.textContent = `HASH: ${hash}`;

    // Permitir ingresar nombre si es el default
    if (this.nameEl && (this.nameEl.textContent.includes('Destacado') || !this.studentName)) {
      const inputName = prompt('Ingresa tu nombre completo para la expedición oficial del diploma:', 'Kevin Felipe Gaitán Rodríguez');
      if (inputName && inputName.trim()) {
        this.studentName = inputName.trim();
        this.nameEl.textContent = this.studentName;
      }
    }

    if (this.modal) this.modal.classList.remove('hidden');
  }

  printCertificate() {
    window.print();
  }
}
