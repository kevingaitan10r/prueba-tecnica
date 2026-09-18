import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

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
      1200
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
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.updatables = [];

    this.initLightingAndAtmosphere();
    this.initPostProcessing();
    this.setupResizeHandler();
  }

  initLightingAndAtmosphere() {
    // Fondo espacial profundo y niebla etérea
    this.scene.background = new THREE.Color(0x040714);
    this.scene.fog = new THREE.FogExp2(0x040714, 0.009);

    // Luz ambiental equilibrada
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.55);
    this.scene.add(ambientLight);

    // Sol virtual del campus de alta tecnología
    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 1.6);
    sunLight.position.set(40, 70, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.0003;
    this.scene.add(sunLight);

    // Luz de relleno hemisférica (cielo cian / rebote azul marino)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.65);
    this.scene.add(hemiLight);

    // Luz secundaria sutil para acentos dorados UNIMINUTO
    const accentLight = new THREE.DirectionalLight(0xe8a800, 0.35);
    accentLight.position.set(-40, 30, -30);
    this.scene.add(accentLight);
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    // Pase de render principal
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Pase de Bloom para neones, cristales y haces de energía
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.65, // Fuerza de brillo elegante
      0.4,  // Radio de difusión
      0.25  // Umbral de luminancia
    );
    this.composer.addPass(this.bloomPass);

    // Pase de salida con corrección tonal
    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (this.composer) {
        this.composer.setSize(width, height);
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
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

      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }
}

