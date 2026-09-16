import * as THREE from 'three';

export class World {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Contenedor ${containerId} no encontrado`);
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 20);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.updatables = [];

    this.initLightingAndAtmosphere();
    this.setupResizeHandler();
  }

  initLightingAndAtmosphere() {
    // Niebla ambiental futurista
    this.scene.background = new THREE.Color(0x060913);
    this.scene.fog = new THREE.FogExp2(0x060913, 0.015);

    // Luz ambiental suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    // Luz direccional cenital (Sol virtual del campus)
    const sunLight = new THREE.DirectionalLight(0xa5f3fc, 1.4);
    sunLight.position.set(30, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Luz de relleno azulada desde abajo
    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0284c7, 0.5);
    this.scene.add(fillLight);
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  addUpdatable(object) {
    this.updatables.push(object);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      for (const obj of this.updatables) {
        if (typeof obj.update === 'function') {
          obj.update(delta, elapsed);
        }
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
