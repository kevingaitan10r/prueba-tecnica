import * as THREE from 'three';
import { TRANSVERSAL_LINES } from '../modules/TransversalLines.js';

export class Environment {
  constructor(world) {
    this.world = world;
    this.scene = world.scene;

    this.interactiveObjects = [];
    this.domeMeshes = [];
    this.rotatables = [];
    this.pulsatables = [];

    this.buildCampus();
  }

  buildCampus() {
    this.createGround();
    this.createCentralAgora();
    this.createEnergyPathways();
    this.createDomes();
    this.createAtmosphericParticles();
  }

  createGround() {
    // Terreno base infinito oscuro
    const groundGeo = new THREE.PlaneGeometry(300, 300, 40, 40);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070b19,
      roughness: 0.85,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Rejilla de coordenadas holográfica
    const gridHelper = new THREE.GridHelper(260, 65, 0x00a0df, 0x1e293b);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  createCentralAgora() {
    const agoraGroup = new THREE.Group();
    agoraGroup.position.set(0, 0, 0);

    // Plataforma circular principal
    const platformGeo = new THREE.CylinderGeometry(14, 15, 0.6, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = 0.3;
    platform.receiveShadow = true;
    agoraGroup.add(platform);

    // Anillo dorado UNIMINUTO en el borde de la plataforma
    const ringGeo = new THREE.RingGeometry(13.2, 13.9, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8a800,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.61;
    agoraGroup.add(ring);

    // Cristal Central del Nexo Transversal (Octaedro flotante)
    const crystalGeo = new THREE.OctahedronGeometry(2.5, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x00a0df,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.5,
      wireframe: false
    });
    this.centralCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.centralCrystal.position.set(0, 4.5, 0);
    this.centralCrystal.castShadow = true;
    agoraGroup.add(this.centralCrystal);

    // Estructura de alambre exterior del cristal
    const wireGeo = new THREE.OctahedronGeometry(2.8, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe8a800,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    this.centralWire = new THREE.Mesh(wireGeo, wireMat);
    this.centralWire.position.set(0, 4.5, 0);
    agoraGroup.add(this.centralWire);

    // Anillos orbitales giratorios
    const orbitRing1Geo = new THREE.TorusGeometry(4.2, 0.08, 16, 64);
    const orbitRing1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.orbitRing1 = new THREE.Mesh(orbitRing1Geo, orbitRing1Mat);
    this.orbitRing1.position.set(0, 4.5, 0);
    this.orbitRing1.rotation.x = Math.PI / 3;
    agoraGroup.add(this.orbitRing1);

    const orbitRing2Geo = new THREE.TorusGeometry(4.8, 0.08, 16, 64);
    const orbitRing2Mat = new THREE.MeshBasicMaterial({ color: 0xe8a800 });
    this.orbitRing2 = new THREE.Mesh(orbitRing2Geo, orbitRing2Mat);
    this.orbitRing2.position.set(0, 4.5, 0);
    this.orbitRing2.rotation.y = Math.PI / 4;
    agoraGroup.add(this.orbitRing2);

    // Luz puntual del Nexo Central
    const nexuLight = new THREE.PointLight(0x00a0df, 2.5, 30);
    nexuLight.position.set(0, 5, 0);
    agoraGroup.add(nexuLight);

    // Pedestal de bienvenida interactivo
    const pedestalGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.2, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, 1.2, 4);
    pedestal.castShadow = true;
    pedestal.userData = {
      isInteractive: true,
      type: 'agora',
      name: 'Nexo Central UNIMINUTO',
      desc: 'Núcleo integrador de las 6 Líneas Transversales'
    };
    agoraGroup.add(pedestal);
    this.interactiveObjects.push(pedestal);

    this.scene.add(agoraGroup);
  }

  createEnergyPathways() {
    // Caminos de luz que van desde el Ágora hacia los 6 domos
    TRANSVERSAL_LINES.forEach((line) => {
      const pos = line.domePosition;
      const length = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      const angle = Math.atan2(pos.x, pos.z);

      const pathGeo = new THREE.PlaneGeometry(1.8, length - 12);
      const pathMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.x = -Math.PI / 2;
      path.rotation.z = -angle;
      path.position.set(pos.x / 2, 0.05, pos.z / 2);
      this.scene.add(path);
    });
  }

  createDomes() {
    TRANSVERSAL_LINES.forEach((line) => {
      const domeGroup = new THREE.Group();
      domeGroup.position.set(line.domePosition.x, line.domePosition.y, line.domePosition.z);

      // Plataforma del domo
      const platGeo = new THREE.CylinderGeometry(9.5, 10.5, 0.5, 32);
      const platMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.5,
        metalness: 0.5
      });
      const plat = new THREE.Mesh(platGeo, platMat);
      plat.position.y = 0.25;
      plat.receiveShadow = true;
      domeGroup.add(plat);

      // Cúpula / Domo semitransparente
      const domeGeo = new THREE.SphereGeometry(9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshPhysicalMaterial({
        color: line.colorThree,
        emissive: line.colorThree,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
        side: THREE.DoubleSide
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 0.5;
      domeGroup.add(dome);

      // Nervaduras / Arcos del domo
      const wireGeo = new THREE.SphereGeometry(9.05, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const wireDome = new THREE.Mesh(wireGeo, wireMat);
      wireDome.position.y = 0.5;
      domeGroup.add(wireDome);

      // Portal de entrada holográfico
      const archGeo = new THREE.TorusGeometry(2.4, 0.15, 12, 24, Math.PI);
      const archMat = new THREE.MeshBasicMaterial({ color: line.colorThree });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 2.4, 8.8);
      domeGroup.add(arch);

      // Pedestal interactivo central del domo
      const pedGeo = new THREE.CylinderGeometry(1.2, 1.5, 1.4, 16);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.8
      });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.y = 1.2;
      ped.castShadow = true;
      ped.userData = {
        isInteractive: true,
        type: 'dome',
        lineData: line,
        name: line.title,
        desc: line.tagline
      };
      domeGroup.add(ped);
      this.interactiveObjects.push(ped);

      // Holograma flotante representativo en el pedestal
      const holoGeo = new THREE.IcosahedronGeometry(0.9, 0);
      const holoMat = new THREE.MeshStandardMaterial({
        color: line.colorThree,
        emissive: line.colorThree,
        emissiveIntensity: 0.8,
        wireframe: false,
        roughness: 0.2
      });
      const holoMesh = new THREE.Mesh(holoGeo, holoMat);
      holoMesh.position.set(0, 2.8, 0);
      domeGroup.add(holoMesh);

      // Anillo giratorio alrededor del holograma
      const ringGeo = new THREE.RingGeometry(1.2, 1.35, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 2.8, 0);
      ring.rotation.x = Math.PI / 2;
      domeGroup.add(ring);

      this.rotatables.push({ mesh: holoMesh, speed: 1.2 });
      this.rotatables.push({ mesh: ring, speed: -2.0, axis: 'z' });

      // Luz interior temática del domo
      const domeLight = new THREE.PointLight(line.colorThree, 2.2, 18);
      domeLight.position.set(0, 4, 0);
      domeGroup.add(domeLight);

      // Etiqueta flotante con el nombre del Domo
      const labelSprite = this.createTextSprite(line.icon + ' ' + line.title, line.colorHex);
      labelSprite.position.set(0, 11, 0);
      domeGroup.add(labelSprite);

      this.scene.add(domeGroup);
      this.domeMeshes.push({ group: domeGroup, line });
    });
  }

  createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Fondo tipo cápsula con borde
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fill();

    ctx.strokeStyle = colorHex || '#00a0df';
    ctx.lineWidth = 6;
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.stroke();

    // Texto
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(7, 1.75, 1);
    return sprite;
  }

  createAtmosphericParticles() {
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 180;
      positions[i + 1] = Math.random() * 40;
      positions[i + 2] = (Math.random() - 0.5) * 180;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  update(delta, elapsed) {
    // Rotación del cristal central
    if (this.centralCrystal) {
      this.centralCrystal.rotation.y += delta * 0.4;
      this.centralCrystal.rotation.x = Math.sin(elapsed * 0.8) * 0.15;
      this.centralCrystal.position.y = 4.5 + Math.sin(elapsed * 1.5) * 0.3;
    }
    if (this.centralWire) {
      this.centralWire.rotation.y -= delta * 0.6;
      this.centralWire.position.y = 4.5 + Math.sin(elapsed * 1.5) * 0.3;
    }
    if (this.orbitRing1) {
      this.orbitRing1.rotation.z += delta * 0.8;
    }
    if (this.orbitRing2) {
      this.orbitRing2.rotation.x += delta * 0.5;
    }

    // Rotación de hologramas de pedestales
    this.rotatables.forEach((item) => {
      if (item.axis === 'z') {
        item.mesh.rotation.z += delta * item.speed;
      } else {
        item.mesh.rotation.y += delta * item.speed;
      }
    });

    // Partículas ascendentes
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 1.2;
        if (positions[i] > 40) {
          positions[i] = 0;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }
}
