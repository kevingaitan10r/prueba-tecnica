import * as THREE from 'three';
import { TRANSVERSAL_LINES } from '../modules/TransversalLines.js';

export class Environment {
  constructor(world) {
    this.world = world;
    this.scene = world.scene;
    this.camera = world.camera;

    this.interactiveObjects = [];
    this.domeMeshes = [];
    this.rotatables = [];
    this.pulsatables = [];
    this.energyPackets = [];
    this.skylineBeacons = [];
    this.thematicMonuments = {};
    this.floatingSigns = [];
    this.dynamicArchitectures = {};

    this.buildCampus();
  }

  buildCampus() {
    this.createStarfieldAndSky();
    this.createGround();
    this.createCentralAgora();
    this.createEnergyPathways();
    this.createDomes();
    this.createCampusSkyline();
    this.createAtmosphericParticles();
    this.createCompanionDrone();
  }

  /* -------------------------------------------------------------------------- */
  /* 1. BÓVEDA CELESTE, ESTRELLAS Y ANILLOS CÓSMICOS                             */
  /* -------------------------------------------------------------------------- */
  createStarfieldAndSky() {
    // 1.1 Campo Estelar Multicapa
    const starCount = 1600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5f3fc), // Cian suave
      new THREE.Color(0x38bdf8), // Azul eléctrico
      new THREE.Color(0xfde047), // Dorado UNIMINUTO
      new THREE.Color(0xc084fc)  // Púrpura cósmico
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 250 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 1.8) - 0.9); // Mayoría sobre el horizonte

      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) + 15; // Mantener elevadas
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.stars);

    // 1.2 Anillo orbital celestial en la alta atmósfera
    const skyRingGeo = new THREE.TorusGeometry(320, 1.2, 16, 120);
    const skyRingMat = new THREE.MeshBasicMaterial({
      color: 0x00a0df,
      transparent: true,
      opacity: 0.28
    });
    this.skyRing = new THREE.Mesh(skyRingGeo, skyRingMat);
    this.skyRing.position.set(0, 80, 0);
    this.skyRing.rotation.x = Math.PI / 2.6;
    this.scene.add(this.skyRing);

    const skyRing2Geo = new THREE.TorusGeometry(380, 0.8, 16, 120);
    const skyRing2Mat = new THREE.MeshBasicMaterial({
      color: 0xe8a800,
      transparent: true,
      opacity: 0.2
    });
    this.skyRing2 = new THREE.Mesh(skyRing2Geo, skyRing2Mat);
    this.skyRing2.position.set(0, 100, 0);
    this.skyRing2.rotation.x = Math.PI / 2.3;
    this.skyRing2.rotation.y = Math.PI / 4;
    this.scene.add(this.skyRing2);
  }

  /* -------------------------------------------------------------------------- */
  /* 2. SUELO DEL CAMPUS Y PISO TECNOLÓGICO                                      */
  /* -------------------------------------------------------------------------- */
  createGround() {
    const groundGroup = new THREE.Group();

    // 2.1 Terreno base pulido oscuro
    const groundGeo = new THREE.PlaneGeometry(420, 420, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050814,
      roughness: 0.35,
      metalness: 0.65
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    // 2.2 Rejilla tecnológica principal
    const gridHelper = new THREE.GridHelper(300, 60, 0x00a0df, 0x111c33);
    gridHelper.position.y = 0.01;
    groundGroup.add(gridHelper);

    // 2.3 Anillos concéntricos de navegación campus (zonas de radio)
    const radiuses = [30, 55, 80, 110];
    radiuses.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r - 0.15, r + 0.15, 72);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00a0df : 0xe8a800,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      groundGroup.add(ring);
    });

    this.scene.add(groundGroup);
  }

  /* -------------------------------------------------------------------------- */
  /* 3. ÁGORA CENTRAL UNIMINUTO (NEXO MULTINIVEL CON CRISTAL GIROSCÓPICO)       */
  /* -------------------------------------------------------------------------- */
  createCentralAgora() {
    const agoraGroup = new THREE.Group();
    agoraGroup.position.set(0, 0, 0);

    // 3.1 Plataforma de triple nivel
    // Nivel 1 (Base exterior)
    const baseGeo = new THREE.CylinderGeometry(16, 17.2, 0.4, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x090d1a,
      roughness: 0.5,
      metalness: 0.5
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    base.receiveShadow = true;
    agoraGroup.add(base);

    // Nivel 2 (Intermedio con acento metálico)
    const midGeo = new THREE.CylinderGeometry(13.8, 14.5, 0.4, 48);
    const midMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8
    });
    const mid = new THREE.Mesh(midGeo, midMat);
    mid.position.y = 0.5;
    mid.receiveShadow = true;
    agoraGroup.add(mid);

    // Nivel 3 (Plataforma superior con cuenco reflectante)
    const topGeo = new THREE.CylinderGeometry(11.5, 12.2, 0.3, 48);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.15,
      metalness: 0.9
    });
    const topPlat = new THREE.Mesh(topGeo, topMat);
    topPlat.position.y = 0.8;
    topPlat.receiveShadow = true;
    agoraGroup.add(topPlat);

    // 3.2 Anillo dorado insignia UNIMINUTO
    const goldRingGeo = new THREE.RingGeometry(11.2, 11.9, 64);
    const goldRingMat = new THREE.MeshBasicMaterial({
      color: 0xe8a800,
      side: THREE.DoubleSide
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = -Math.PI / 2;
    goldRing.position.y = 0.96;
    agoraGroup.add(goldRing);

    // 3.3 Columna de luz vertical del proyector holográfico
    const beamGeo = new THREE.CylinderGeometry(1.6, 5, 24, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00a0df,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 12, 0);
    agoraGroup.add(beam);

    // 3.4 Cristal Central del Nexo (Octaedro Crystalline de Lujo)
    const crystalGeo = new THREE.OctahedronGeometry(2.6, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x00a0df,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.6,
      thickness: 1.8,
      transparent: true,
      opacity: 0.95
    });
    this.centralCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.centralCrystal.position.set(0, 5.2, 0);
    this.centralCrystal.castShadow = true;
    agoraGroup.add(this.centralCrystal);

    // Jaula geométrica exterior del cristal
    const wireGeo = new THREE.OctahedronGeometry(3.1, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe8a800,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    this.centralWire = new THREE.Mesh(wireGeo, wireMat);
    this.centralWire.position.set(0, 5.2, 0);
    agoraGroup.add(this.centralWire);

    // 3.5 Anillos giroscópicos triples orbitando el cristal
    const orbit1Geo = new THREE.TorusGeometry(4.4, 0.09, 16, 64);
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.orbitRing1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
    this.orbitRing1.position.set(0, 5.2, 0);
    agoraGroup.add(this.orbitRing1);

    const orbit2Geo = new THREE.TorusGeometry(5.1, 0.09, 16, 64);
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0xe8a800 });
    this.orbitRing2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
    this.orbitRing2.position.set(0, 5.2, 0);
    agoraGroup.add(this.orbitRing2);

    const orbit3Geo = new THREE.TorusGeometry(5.8, 0.07, 16, 64);
    const orbit3Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    this.orbitRing3 = new THREE.Mesh(orbit3Geo, orbit3Mat);
    this.orbitRing3.position.set(0, 5.2, 0);
    agoraGroup.add(this.orbitRing3);

    // 3.6 Luz puntual intensa del nexo
    const nexuLight = new THREE.PointLight(0x00a0df, 3.5, 38);
    nexuLight.position.set(0, 5.5, 0);
    agoraGroup.add(nexuLight);

    const goldPoint = new THREE.PointLight(0xe8a800, 2.0, 25);
    goldPoint.position.set(0, 3.5, 0);
    agoraGroup.add(goldPoint);

    // 3.7 Pedestal interactivo del Ágora
    const pedGeo = new THREE.CylinderGeometry(0.85, 1.2, 1.3, 16);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.set(0, 1.5, 4.8);
    pedestal.castShadow = true;
    pedestal.userData = {
      isInteractive: true,
      type: 'agora',
      name: 'Nexo Central UNIMINUTO',
      desc: 'Núcleo integrador de las 6 Líneas Transversales'
    };
    agoraGroup.add(pedestal);
    this.interactiveObjects.push(pedestal);

    // Holograma interactivo sobre el pedestal
    const holoDiscGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.06, 24);
    const holoDiscMat = new THREE.MeshBasicMaterial({ color: 0x00a0df });
    const holoDisc = new THREE.Mesh(holoDiscGeo, holoDiscMat);
    holoDisc.position.set(0, 2.25, 4.8);
    agoraGroup.add(holoDisc);

    // Letrero Monumental Holográfico del Ágora Central
    const agoraSign = this.createAgoraSignSprite();
    agoraSign.position.set(0, 11.5, 0);
    agoraSign.userData = { baseY: 11.5, offset: 0 };
    agoraGroup.add(agoraSign);
    this.floatingSigns.push(agoraSign);

    this.scene.add(agoraGroup);
  }

  /* -------------------------------------------------------------------------- */
  /* 4. CAMINOS DE ENERGÍA Y PULSOS DE FLUJO DINÁMICOS                         */
  /* -------------------------------------------------------------------------- */
  createEnergyPathways() {
    this.energyPackets = [];

    TRANSVERSAL_LINES.forEach((line) => {
      const pos = line.domePosition;
      const length = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
      const angle = Math.atan2(pos.x, pos.z);

      // 4.1 Banda principal del camino
      const pathGeo = new THREE.PlaneGeometry(2.4, length - 11);
      const pathMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.x = -Math.PI / 2;
      path.rotation.z = -angle;
      path.position.set(pos.x / 2, 0.06, pos.z / 2);
      this.scene.add(path);

      // 4.2 Rieles de neón en los bordes del camino
      const railGeo = new THREE.PlaneGeometry(0.12, length - 11);
      const railMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        transparent: true,
        opacity: 0.8
      });

      // Riel izquierdo y derecho
      const offset = 1.15;
      const rx = Math.sin(angle + Math.PI / 2) * offset;
      const rz = Math.cos(angle + Math.PI / 2) * offset;

      const railL = new THREE.Mesh(railGeo, railMat);
      railL.rotation.x = -Math.PI / 2;
      railL.rotation.z = -angle;
      railL.position.set(pos.x / 2 + rx, 0.08, pos.z / 2 + rz);
      this.scene.add(railL);

      const railR = new THREE.Mesh(railGeo, railMat);
      railR.rotation.x = -Math.PI / 2;
      railR.rotation.z = -angle;
      railR.position.set(pos.x / 2 - rx, 0.08, pos.z / 2 - rz);
      this.scene.add(railR);

      // 4.3 Paquetes de energía pulsantes que viajan por el camino
      const packetGeo = new THREE.SphereGeometry(0.24, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      packet.position.set(0, 0.2, 0);
      this.scene.add(packet);

      this.energyPackets.push({
        mesh: packet,
        targetPos: new THREE.Vector3(pos.x, 0.2, pos.z),
        startPos: new THREE.Vector3(0, 0.2, 0),
        progress: Math.random(),
        speed: 0.22 + Math.random() * 0.1
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 5. DOMOS ARQUITECTÓNICOS TEMÁTICOS PERSONALIZADOS                         */
  /* -------------------------------------------------------------------------- */
  createDomes() {
    TRANSVERSAL_LINES.forEach((line) => {
      const domeGroup = new THREE.Group();
      domeGroup.position.set(line.domePosition.x, line.domePosition.y, line.domePosition.z);

      // 5.1 Plataforma base y suelo temático especializado
      this.buildPlatformAndFloor(domeGroup, line);

      // 5.2 Estructura Arquitectónica Única según la disciplina
      switch (line.code) {
        case 'comunicarte':
          this.buildComunicarteArchitecture(domeGroup, line);
          break;
        case 'neuromath':
          this.buildNeuroMathArchitecture(domeGroup, line);
          break;
        case 'voxcivitas':
          this.buildVoxCivitasArchitecture(domeGroup, line);
          break;
        case 'gerencia':
          this.buildGerenciaArchitecture(domeGroup, line);
          break;
        case 'actividaidea':
          this.buildActivaIdeaArchitecture(domeGroup, line);
          break;
        case 'latidosocial':
          this.buildLatidoSocialArchitecture(domeGroup, line);
          break;
        default:
          this.buildGenericArchitecture(domeGroup, line);
      }

      // 5.3 Pedestal interactivo del domo
      const pedGeo = new THREE.CylinderGeometry(1.2, 1.5, 1.4, 18);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85
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

      // 5.4 Monumento 3D Temático
      const monument = this.createThematicMonument(line);
      monument.position.set(0, 3.2, 0);
      domeGroup.add(monument);
      this.thematicMonuments[line.code] = monument;

      // 5.5 Luz interior ambiental temática
      const domeLight = new THREE.PointLight(line.colorThree, 3.2, 24);
      domeLight.position.set(0, 5, 0);
      domeGroup.add(domeLight);

      // 5.6 Faro Celestial de Luz Vertical
      const beaconGeo = new THREE.CylinderGeometry(0.6, 2.5, 75, 16, 1, true);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 46, 0);
      domeGroup.add(beacon);

      // 5.7 Letreros Holográficos Ultra HD de Cúpula, Portal y Pedestal
      // A) Cartel Monumental Superior del Domo (1024x340 px)
      const labelSprite = this.createHighDefSignSprite(line);
      labelSprite.position.set(0, 13.5, 0);
      labelSprite.userData = { baseY: 13.5, offset: line.id * 1.0 };
      domeGroup.add(labelSprite);
      this.floatingSigns.push(labelSprite);

      // B) Marquesina Holográfica sobre el Portal de Acceso (800x190 px)
      const portalSign = this.createPortalMarquee(line);
      portalSign.position.set(0, 4.2, 9.2);
      portalSign.userData = { baseY: 4.2, offset: line.id * 0.7 };
      domeGroup.add(portalSign);
      this.floatingSigns.push(portalSign);

      // C) Badge Flotante Interactivo sobre la Consola Pedestal (512x140 px)
      const pedBadge = this.createPedestalBadge(line.colorHex);
      pedBadge.position.set(0, 2.45, 0);
      pedBadge.userData = { baseY: 2.45, offset: line.id * 1.3 };
      domeGroup.add(pedBadge);
      this.floatingSigns.push(pedBadge);

      this.scene.add(domeGroup);
      this.domeMeshes.push({ group: domeGroup, line });
    });
  }

  buildPlatformAndFloor(group, line) {
    // Plataforma base circular
    const platGeo = new THREE.CylinderGeometry(10.2, 11.2, 0.5, 36);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.4,
      metalness: 0.6
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = 0.25;
    plat.receiveShadow = true;
    group.add(plat);

    // Anillo perimetral luminoso
    const ringGeo = new THREE.RingGeometry(10.0, 10.35, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: line.colorThree,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.51;
    group.add(ring);

    // Rampa / umbral de acceso
    const rampGeo = new THREE.BoxGeometry(4, 0.4, 3);
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.7
    });
    const ramp = new THREE.Mesh(rampGeo, rampMat);
    ramp.position.set(0, 0.2, 10.5);
    group.add(ramp);

    // Diseño de suelo específico por disciplina
    const code = line.code;
    if (code === 'comunicarte') {
      // Ondas concéntricas de sonido en el piso
      [2.5, 5.0, 7.5].forEach((r) => {
        const waveGeo = new THREE.RingGeometry(r - 0.08, r + 0.08, 36);
        const waveMat = new THREE.MeshBasicMaterial({
          color: line.colorThree,
          transparent: true,
          opacity: 0.4,
          side: THREE.DoubleSide
        });
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.rotation.x = -Math.PI / 2;
        wave.position.y = 0.52;
        group.add(wave);
      });
    } else if (code === 'neuromath') {
      // Rejilla de coordenadas cuánticas en el piso
      const floorGrid = new THREE.GridHelper(16, 8, line.colorThree, 0x1e293b);
      floorGrid.position.y = 0.52;
      group.add(floorGrid);
    } else if (code === 'voxcivitas') {
      // Gradas concéntricas de asamblea parlamentaria
      const daisGeo = new THREE.CylinderGeometry(7.5, 8.0, 0.15, 32);
      const daisMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.3,
        metalness: 0.8
      });
      const dais = new THREE.Mesh(daisGeo, daisMat);
      dais.position.y = 0.58;
      group.add(dais);
      const daisRing = new THREE.Mesh(
        new THREE.RingGeometry(7.3, 7.6, 32),
        new THREE.MeshBasicMaterial({ color: 0xe8a800, side: THREE.DoubleSide })
      );
      daisRing.rotation.x = -Math.PI / 2;
      daisRing.position.y = 0.66;
      group.add(daisRing);
    } else if (code === 'gerencia') {
      // Rosa de los vientos / 4 cuadrantes ágiles
      const crossGeo = new THREE.PlaneGeometry(12, 0.2);
      const crossMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide
      });
      const cross1 = new THREE.Mesh(crossGeo, crossMat);
      cross1.rotation.x = -Math.PI / 2;
      cross1.position.y = 0.52;
      group.add(cross1);
      const cross2 = new THREE.Mesh(crossGeo, crossMat);
      cross2.rotation.x = -Math.PI / 2;
      cross2.rotation.z = Math.PI / 2;
      cross2.position.y = 0.52;
      group.add(cross2);
    } else if (code === 'actividaidea') {
      // Patrón hexagonal industrial en el piso
      const hexGeo = new THREE.RingGeometry(4.5, 4.8, 6);
      const hexMat = new THREE.MeshBasicMaterial({
        color: line.colorThree,
        side: THREE.DoubleSide
      });
      const hex = new THREE.Mesh(hexGeo, hexMat);
      hex.rotation.x = -Math.PI / 2;
      hex.position.y = 0.52;
      group.add(hex);
    } else if (code === 'latidosocial') {
      // Mándala floral orgánico concéntrico
      [3.0, 6.0].forEach((r) => {
        const circ = new THREE.Mesh(
          new THREE.RingGeometry(r - 0.1, r + 0.1, 8),
          new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        );
        circ.rotation.x = -Math.PI / 2;
        circ.position.y = 0.52;
        group.add(circ);
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 5.1 COMUNICARTE: Radio-Observatorio Parabólico & Antena Sónica             */
  /* -------------------------------------------------------------------------- */
  buildComunicarteArchitecture(group, line) {
    const color = line.colorThree;

    // Gran Plato Parabólico de Datos de Telecomunicaciones
    const dishGeo = new THREE.SphereGeometry(9.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6);
    const dishMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: color,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.15,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = -0.35; // Inclinación parabólica hacia el cielo
    dish.position.set(0, 4.5, -1.0);
    group.add(dish);

    // Borde de Neón Cian del Plato
    const dishRim = new THREE.Mesh(
      new THREE.RingGeometry(8.9, 9.2, 48),
      new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
    );
    dishRim.rotation.x = Math.PI / 2 - 0.35;
    dishRim.position.set(0, 4.5, -1.0);
    group.add(dishRim);

    // Mástil Central Focal de Radiofrecuencia
    const mastGeo = new THREE.CylinderGeometry(0.12, 0.25, 6.5, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.rotation.x = -0.35;
    mast.position.set(0, 7.5, -1.8);
    group.add(mast);

    // Foco emisor con luz pulsante en la punta del mástil
    const focalEmitter = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    focalEmitter.position.set(0, 10.5, -2.6);
    group.add(focalEmitter);

    // Torres gemelas de transmisión con anillos de radiofrecuencia laterales
    [-7.8, 7.8].forEach((xPos) => {
      const towerGeo = new THREE.CylinderGeometry(0.4, 0.6, 11, 12);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x090e1c, metalness: 0.85 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(xPos, 5.5, 2.0);
      group.add(tower);

      // Anillos de microondas que pulsan
      for (let k = 0; k < 3; k++) {
        const rGeo = new THREE.TorusGeometry(1.2 - k * 0.25, 0.06, 8, 24);
        const rMat = new THREE.MeshBasicMaterial({ color: color });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(xPos, 6.0 + k * 1.8, 2.0);
        group.add(ring);
      }
    });

    // Portal de entrada con barras verticales acústicas
    const portalArch = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.22, 12, 28, Math.PI),
      new THREE.MeshBasicMaterial({ color: color })
    );
    portalArch.position.set(0, 0.5, 9.2);
    group.add(portalArch);

    this.dynamicArchitectures['comunicarte'] = { focalEmitter };
  }

  /* -------------------------------------------------------------------------- */
  /* 5.2 NEUROMATH: Prisma Octaédrico Flotante con Suspensión Magnética          */
  /* -------------------------------------------------------------------------- */
  buildNeuroMathArchitecture(group, line) {
    const color = line.colorThree;

    // Gran Prisma Octaédrico Cuántico FLOTANDO en el aire (Antigravedad)
    const prismGeo = new THREE.OctahedronGeometry(6.5, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.6,
      roughness: 0.05,
      metalness: 0.2,
      transmission: 0.85,
      thickness: 1.2,
      transparent: true,
      opacity: 0.45,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const floatingPrism = new THREE.Mesh(prismGeo, prismMat);
    floatingPrism.position.set(0, 6.2, 0);
    group.add(floatingPrism);

    // Aristas de Neón Violeta del Prisma
    const prismWire = new THREE.Mesh(
      new THREE.OctahedronGeometry(6.58, 0),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true })
    );
    floatingPrism.add(prismWire);

    // 4 Pilares de Suspensión Magnética (Tesla Pylons) con Bobinas
    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    angles.forEach((ang) => {
      const pylonGroup = new THREE.Group();
      const x = Math.cos(ang) * 9.5;
      const z = Math.sin(ang) * 9.5;
      pylonGroup.position.set(x, 0, z);

      // Torre cilíndrica de la bobina
      const pylonGeo = new THREE.CylinderGeometry(0.5, 0.7, 9.0, 16);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.y = 4.5;
      pylonGroup.add(pylon);

      // Esfera de descarga en la cúspide
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8, metalness: 0.9 })
      );
      sphere.position.y = 9.2;
      pylonGroup.add(sphere);

      // Anillo de Tesla
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.1, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0xc084fc })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 7.5;
      pylonGroup.add(ring);

      group.add(pylonGroup);
    });

    // Anillo de confinamiento magnético en el suelo
    const floorRing = new THREE.Mesh(
      new THREE.RingGeometry(5.0, 5.5, 36),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide })
    );
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.52;
    group.add(floorRing);

    // Portal de acceso cuántico con marcos angulares
    const portal = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.22, 4, 16, Math.PI),
      new THREE.MeshBasicMaterial({ color: color })
    );
    portal.position.set(0, 0.5, 9.2);
    group.add(portal);

    this.dynamicArchitectures['neuromath'] = { floatingPrism, basePrismY: 6.2 };
  }

  /* -------------------------------------------------------------------------- */
  /* 5.3 VOXCIVITAS: Pirámide Diamante de Cristal Dorado (Templo Cívico)        */
  /* -------------------------------------------------------------------------- */
  buildVoxCivitasArchitecture(group, line) {
    const goldColor = 0xe8a800;

    // Gran Pirámide de Cristal Dorado Facetado
    const pyrGeo = new THREE.ConeGeometry(9.6, 11.5, 4, 1, true);
    const pyrMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      emissive: goldColor,
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.08,
      transmission: 0.82,
      transparent: true,
      opacity: 0.38,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
    pyramid.rotation.y = Math.PI / 4;
    pyramid.position.y = 5.75;
    group.add(pyramid);

    // Estructura de Aristas Geodésicas de Oro
    const pyrWire = new THREE.Mesh(
      new THREE.ConeGeometry(9.65, 11.55, 4, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, wireframe: true })
    );
    pyrWire.rotation.y = Math.PI / 4;
    pyrWire.position.y = 5.75;
    group.add(pyrWire);

    // Faro Diamante en la cúspide
    const apexCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    apexCrystal.position.y = 11.8;
    group.add(apexCrystal);

    // Pórtico Monumental con Columnas de Oro y Frontón Tech
    [-2.2, 2.2].forEach((xSide) => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 5.2, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 })
      );
      col.position.set(xSide, 2.6, 9.4);
      group.add(col);

      const colTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.3, 0.7),
        new THREE.MeshBasicMaterial({ color: goldColor })
      );
      colTrim.position.set(xSide, 5.3, 9.4);
      group.add(colTrim);
    });

    const portalBeam = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 0.5, 0.8),
      new THREE.MeshBasicMaterial({ color: goldColor })
    );
    portalBeam.position.set(0, 5.5, 9.4);
    group.add(portalBeam);
  }

  /* -------------------------------------------------------------------------- */
  /* 5.4 GERENCIA+: Rascacielos Cónico Escalonado / Torre de Negocios           */
  /* -------------------------------------------------------------------------- */
  buildGerenciaArchitecture(group, line) {
    const color = line.colorThree;

    // Rascacielos Cónico de 3 Niveles Escalonados
    const levels = [
      { rTop: 7.8, rBot: 9.5, height: 4.2, y: 2.1 },
      { rTop: 5.5, rBot: 7.5, height: 4.0, y: 6.2 },
      { rTop: 3.2, rBot: 5.2, height: 3.8, y: 10.1 }
    ];

    levels.forEach((lvl) => {
      const cylGeo = new THREE.CylinderGeometry(lvl.rTop, lvl.rBot, lvl.height, 28, 1, true);
      const cylMat = new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.5,
        transmission: 0.8,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide
      });
      const tier = new THREE.Mesh(cylGeo, cylMat);
      tier.position.y = lvl.y;
      group.add(tier);

      // Anillo de terraza iluminado
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(lvl.rTop - 0.2, lvl.rTop + 0.3, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = lvl.y + lvl.height / 2;
      group.add(ring);
    });

    // Azotea con Helipuerto / Pista Ejecutiva de Drones
    const pad = new THREE.Mesh(
      new THREE.CircleGeometry(3.0, 24),
      new THREE.MeshStandardMaterial({ color: 0x090e1c, metalness: 0.9 })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 12.02;
    group.add(pad);

    const padBorder = new THREE.Mesh(
      new THREE.RingGeometry(2.7, 3.0, 24),
      new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
    );
    padBorder.rotation.x = -Math.PI / 2;
    padBorder.position.y = 12.04;
    group.add(padBorder);

    // Anillo de Ticker Financiero Holográfico que Gira a Media Altura
    const tickerGeo = new THREE.TorusGeometry(8.2, 0.14, 8, 48);
    const tickerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const tickerRing = new THREE.Mesh(tickerGeo, tickerMat);
    tickerRing.rotation.x = Math.PI / 2;
    tickerRing.position.y = 6.2;
    group.add(tickerRing);

    // Mástil de telecomunicaciones superior
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.15, 3.5, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    antenna.position.y = 13.8;
    group.add(antenna);

    // Portal de acceso corporativo
    const portal = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.4, 3.0),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    );
    portal.position.set(0, 3.6, 9.2);
    group.add(portal);

    const portalBorder = new THREE.Mesh(
      new THREE.BoxGeometry(5.0, 0.12, 0.2),
      new THREE.MeshBasicMaterial({ color: color })
    );
    portalBorder.position.set(0, 3.6, 10.7);
    group.add(portalBorder);

    this.dynamicArchitectures['gerencia'] = { tickerRing };
  }

  /* -------------------------------------------------------------------------- */
  /* 5.5 ACTIVA TU IDEA: Reactor Tokamak de Fusión e Innovación                */
  /* -------------------------------------------------------------------------- */
  buildActivaIdeaArchitecture(group, line) {
    const color = line.colorThree;

    // Gran Cámara Toroidal de Plasma (Cuerpo principal del Reactor)
    const torusGeo = new THREE.TorusGeometry(6.8, 2.2, 20, 36);
    const torusMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      emissive: color,
      emissiveIntensity: 0.45,
      roughness: 0.15,
      metalness: 0.8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = 4.2;
    group.add(torus);

    // 6 Bobinas Magnéticas Superconductoras en Forma de 'D'
    const coils = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const coilGeo = new THREE.TorusGeometry(3.6, 0.35, 12, 28);
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.2
      });
      const coil = new THREE.Mesh(coilGeo, coilMat);
      coil.position.set(Math.cos(ang) * 6.8, 4.2, Math.sin(ang) * 6.8);
      coil.rotation.y = -ang;
      group.add(coil);
      coils.push(coil);
    }

    // Núcleo de Plasma Incandescente Central
    const plasmaCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xffedd5 })
    );
    plasmaCore.position.y = 4.2;
    group.add(plasmaCore);

    // Tuberías Criogénicas Exteriores con Válvulas Naranja
    const pipeGeo = new THREE.TorusGeometry(9.6, 0.15, 8, 32);
    const pipeMat = new THREE.MeshBasicMaterial({ color: color });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.y = 1.2;
    group.add(pipe);

    // Portal blindado de reactor
    const portal = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.3, 8, 20, Math.PI),
      new THREE.MeshBasicMaterial({ color: color })
    );
    portal.position.set(0, 0.5, 9.2);
    group.add(portal);

    this.dynamicArchitectures['actividaidea'] = { plasmaCore, coils };
  }

  /* -------------------------------------------------------------------------- */
  /* 5.6 LATIDO SOCIAL: Biósfera Edén con Árbol de la Vida Biónico              */
  /* -------------------------------------------------------------------------- */
  buildLatidoSocialArchitecture(group, line) {
    const color = line.colorThree;
    const roseColor = 0xec4899;

    // Gran Cúpula Geodésica de la Biósfera Edén
    const bioDomeGeo = new THREE.SphereGeometry(9.2, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const bioDomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x064e3b,
      emissive: roseColor,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });
    const bioDome = new THREE.Mesh(bioDomeGeo, bioDomeMat);
    bioDome.position.y = 0.5;
    group.add(bioDome);

    // Estructura Geodésica Hexagonal Externa
    const bioWire = new THREE.Mesh(
      new THREE.SphereGeometry(9.28, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.45 })
    );
    bioWire.position.y = 0.5;
    group.add(bioWire);

    // Tronco Central del Árbol de la Vida Biónico
    const trunkGeo = new THREE.CylinderGeometry(0.8, 1.4, 7.5, 12);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.3,
      metalness: 0.6
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 4.0;
    group.add(trunk);

    // 6 Ramas de Fibra Óptica que se Despliegan hacia el Techo de la Cúpula
    const branches = [];
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const branchCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 6.8, 0),
        new THREE.Vector3(Math.cos(ang) * 3.5, 8.2, Math.sin(ang) * 3.5),
        new THREE.Vector3(Math.cos(ang) * 6.5, 8.8, Math.sin(ang) * 6.5),
        new THREE.Vector3(Math.cos(ang) * 8.6, 7.0, Math.sin(ang) * 8.6)
      );
      const branchTube = new THREE.Mesh(
        new THREE.TubeGeometry(branchCurve, 16, 0.16, 8, false),
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? roseColor : 0x34d399 })
      );
      group.add(branchTube);
      branches.push(branchTube);

      // Frutos/esferas de luz bio-luminiscentes en las puntas
      const fruit = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      fruit.position.set(Math.cos(ang) * 8.6, 7.0, Math.sin(ang) * 8.6);
      group.add(fruit);
    }

    // Estanque central bio-luminiscente con anillo en la base
    const pondRing = new THREE.Mesh(
      new THREE.RingGeometry(3.5, 3.8, 24),
      new THREE.MeshBasicMaterial({ color: roseColor, side: THREE.DoubleSide })
    );
    pondRing.rotation.x = -Math.PI / 2;
    pondRing.position.y = 0.52;
    group.add(pondRing);

    // Portal orgánico vegetal de bienvenida
    const portal = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.22, 12, 28, Math.PI),
      new THREE.MeshBasicMaterial({ color: roseColor })
    );
    portal.position.set(0, 0.5, 9.2);
    group.add(portal);

    this.dynamicArchitectures['latidosocial'] = { trunk, branches };
  }

  buildGenericArchitecture(group, line) {
    const domeGeo = new THREE.SphereGeometry(9, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: line.colorThree,
      emissive: line.colorThree,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.25,
      roughness: 0.08,
      transmission: 0.85,
      thickness: 0.6,
      side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.5;
    group.add(dome);
  }

  /* -------------------------------------------------------------------------- */
  /* 5.B MONUMENTOS 3D TEMÁTICOS PERSONALIZADOS POR DISCIPLINA                  */
  /* -------------------------------------------------------------------------- */
  createThematicMonument(line) {
    const group = new THREE.Group();
    const code = line.code;
    const color = line.colorThree;

    if (code === 'comunicarte') {
      // COMUNICARTE: Núcleo esférico acústico con 3 anillos de onda de frecuencia sonora
      const coreGeo = new THREE.SphereGeometry(0.7, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: color,
        emissiveIntensity: 1.0,
        roughness: 0.1
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // 3 Anillos de onda acústica en expansión
      group.userData.waveRings = [];
      [1.2, 1.7, 2.2].forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.05, 12, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.7 - i * 0.18
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        group.userData.waveRings.push(ring);
      });
    } else if (code === 'neuromath') {
      // NEUROMATH: Tesseract cuántico / Estelado poliédrico con red neuronal
      const tesseractGeo = new THREE.DodecahedronGeometry(0.85, 0);
      const tesseractMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.9,
        wireframe: true,
        roughness: 0.1
      });
      const tesseract = new THREE.Mesh(tesseractGeo, tesseractMat);
      group.add(tesseract);

      // Núcleo cuántico interno
      const innerCoreGeo = new THREE.OctahedronGeometry(0.4, 0);
      const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
      group.add(innerCore);

      // Nodos de sinapsis neuronal orbitales
      group.userData.synapseNodes = [];
      const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(Math.cos(angle) * 1.5, Math.sin(i) * 0.4, Math.sin(angle) * 1.5);
        group.add(node);
        group.userData.synapseNodes.push(node);
      }
    } else if (code === 'voxcivitas') {
      // VOXCIVITAS: Columna de luz de la democracia con triple anillo de equilibrio cívico
      const colGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.8, 16);
      const colMat = new THREE.MeshStandardMaterial({
        color: 0xe8a800,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
        metalness: 0.9,
        roughness: 0.2
      });
      const col = new THREE.Mesh(colGeo, colMat);
      group.add(col);

      // Anillos de balanza de la justicia y ciudadanía
      const ring1Geo = new THREE.TorusGeometry(1.2, 0.06, 12, 48);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xe8a800 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 3;
      group.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(1.5, 0.05, 12, 48);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 4;
      group.add(ring2);

      group.userData.voxRings = [ring1, ring2];
    } else if (code === 'gerencia') {
      // GERENCIA+: Doble hélice de crecimiento exponencial y prisma estratégico
      const helixGroup = new THREE.Group();
      const dotGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

      for (let i = 0; i < 24; i++) {
        const t = (i / 24) * Math.PI * 4;
        const y = ((i / 24) - 0.5) * 1.8;
        // Hélice 1
        const dot1 = new THREE.Mesh(dotGeo, dotMat);
        dot1.position.set(Math.cos(t) * 0.9, y, Math.sin(t) * 0.9);
        helixGroup.add(dot1);
        // Hélice 2 (desfasada 180°)
        const dot2 = new THREE.Mesh(dotGeo, dotMat);
        dot2.position.set(Math.cos(t + Math.PI) * 0.9, y, Math.sin(t + Math.PI) * 0.9);
        helixGroup.add(dot2);
      }
      group.add(helixGroup);
      group.userData.helix = helixGroup;

      // Prisma central de toma de decisiones
      const prismGeo = new THREE.ConeGeometry(0.55, 1.1, 4);
      const prismMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x10b981,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
      });
      const prism = new THREE.Mesh(prismGeo, prismMat);
      group.add(prism);
      group.userData.prism = prism;
    } else if (code === 'actividaidea') {
      // ACTIVA TU IDEA: Cristal filamento de innovación con chispas de ideación orbitales
      const bulbGeo = new THREE.IcosahedronGeometry(0.75, 1);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf97316,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.2
      });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      group.add(bulb);

      // Chispas de ideación orbitando
      group.userData.sparks = [];
      const sparkGeo = new THREE.OctahedronGeometry(0.15, 0);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      for (let i = 0; i < 4; i++) {
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        group.add(spark);
        group.userData.sparks.push(spark);
      }
    } else if (code === 'latidosocial') {
      // LATIDO SOCIAL: Escultura geométrica de corazón biométrico con latido pulsante
      const heartGroup = new THREE.Group();
      
      // Construcción del corazón mediante prismas facetados
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xdb2777,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.3
      });

      const sphereGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const lobeLeft = new THREE.Mesh(sphereGeo, boxMat);
      lobeLeft.position.set(-0.35, 0.3, 0);
      heartGroup.add(lobeLeft);

      const lobeRight = new THREE.Mesh(sphereGeo, boxMat);
      lobeRight.position.set(0.35, 0.3, 0);
      heartGroup.add(lobeRight);

      const coneGeo = new THREE.ConeGeometry(0.72, 1.1, 16);
      const cone = new THREE.Mesh(coneGeo, boxMat);
      cone.rotation.z = Math.PI;
      cone.position.set(0, -0.25, 0);
      heartGroup.add(cone);

      group.add(heartGroup);
      group.userData.heartMesh = heartGroup;

      // Ondas de resonancia empática expansivas
      const waveGeo = new THREE.TorusGeometry(1.4, 0.04, 12, 36);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6
      });
      const wave = new THREE.Mesh(waveGeo, waveMat);
      wave.rotation.x = Math.PI / 2;
      group.add(wave);
      group.userData.empathyWave = wave;
    }

    return group;
  }

  /* -------------------------------------------------------------------------- */
  /* 6. SILUETA DEL CAMPUS FUTURISTA (SKYLINE PERIMETRAL)                      */
  /* -------------------------------------------------------------------------- */
  createCampusSkyline() {
    const skylineGroup = new THREE.Group();
    const towerCount = 18;
    const radius = 125;

    for (let i = 0; i < towerCount; i++) {
      const angle = (i / towerCount) * Math.PI * 2 + (Math.random() * 0.1);
      const dist = radius + (Math.random() * 25 - 10);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const width = 8 + Math.random() * 7;
      const height = 35 + Math.random() * 55;
      const depth = 8 + Math.random() * 7;

      const towerGeo = new THREE.BoxGeometry(width, height, depth);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x090e1c,
        roughness: 0.4,
        metalness: 0.7
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(x, height / 2, z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      skylineGroup.add(tower);

      // Franja de neón vertical en la fachada de la torre
      const stripGeo = new THREE.PlaneGeometry(0.4, height * 0.8);
      const stripMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00a0df : 0xe8a800,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(x, height / 2, z + depth / 2 + 0.05);
      skylineGroup.add(strip);

      // Faro de advertencia superior en la azotea
      const beaconLightGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const beaconLightMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x38bdf8 : 0xf59e0b
      });
      const beaconLight = new THREE.Mesh(beaconLightGeo, beaconLightMat);
      beaconLight.position.set(x, height + 0.5, z);
      skylineGroup.add(beaconLight);

      this.skylineBeacons.push(beaconLight);
    }

    this.scene.add(skylineGroup);
  }

  /* -------------------------------------------------------------------------- */
  /* 7. DRON DE COMPAÑÍA FLOTANTE ("VIRTUBOT")                                  */
  /* -------------------------------------------------------------------------- */
  createCompanionDrone() {
    this.droneGroup = new THREE.Group();

    // Cuerpo esférico aerodinámico de alta tecnología
    const bodyGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.85
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    this.droneGroup.add(body);

    // Visor negro con lente ocular cian radiante
    const visorGeo = new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 0.6, 0, Math.PI * 0.4);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0x00a0df
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.02, 0.08);
    this.droneGroup.add(visor);

    // Anillo exterior de antigravedad levitatoria
    const ringGeo = new THREE.TorusGeometry(0.48, 0.03, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8a800
    });
    this.droneRing = new THREE.Mesh(ringGeo, ringMat);
    this.droneRing.rotation.x = Math.PI / 2;
    this.droneGroup.add(this.droneRing);

    // Luz propulsora inferior
    const thrusterLight = new THREE.PointLight(0x38bdf8, 1.2, 5);
    thrusterLight.position.set(0, -0.4, 0);
    this.droneGroup.add(thrusterLight);

    // Posición inicial junto a la cámara
    this.droneGroup.position.set(1.5, 4.2, 17);
    this.scene.add(this.droneGroup);
  }

  /* -------------------------------------------------------------------------- */
  /* 8. SISTEMA DE CARTELERÍA Y SEÑALÉTICA HOLOGRÁFICA ULTRA HD                */
  /* -------------------------------------------------------------------------- */

  // 8.1 Cartel Holográfico Monumental de Cúpula (1024 x 340 px)
  createHighDefSignSprite(line) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    const color = line.colorHex || '#00a0df';

    // Fondo cristalino espacial
    ctx.fillStyle = 'rgba(6, 11, 25, 0.94)';
    ctx.beginPath();
    ctx.roundRect(16, 16, 992, 308, 28);
    ctx.fill();

    // Borde exterior con brillo neón
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(16, 16, 992, 308, 28);
    ctx.stroke();

    // Corchetes Sci-Fi angulares en las esquinas [ ]
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    const bLen = 36;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(16, 16 + bLen); ctx.lineTo(16, 16); ctx.lineTo(16 + bLen, 16);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(1008 - bLen, 16); ctx.lineTo(1008, 16); ctx.lineTo(1008, 16 + bLen);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(16, 324 - bLen); ctx.lineTo(16, 324); ctx.lineTo(16 + bLen, 324);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(1008 - bLen, 324); ctx.lineTo(1008, 324); ctx.lineTo(1008, 324 - bLen);
    ctx.stroke();

    // Barra de categoría superior
    ctx.fillStyle = color;
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`LÍNEA TRANSVERSAL 0${line.id}  //  UNIMINUTO VIRTUAL`, 44, 40);

    // Píldora de estado a la derecha
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.roundRect(750, 36, 220, 34, 17);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● VÓRTICE ACTIVO', 860, 44);

    // Título monumental central con icono
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${line.icon}  ${line.title.toUpperCase()}`, 44, 98);

    // Subtítulo / Competencias
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 25px Plus Jakarta Sans, sans-serif';
    const cleanTag = line.tagline.length > 58 ? line.tagline.substring(0, 55) + '...' : line.tagline;
    ctx.fillText(cleanTag, 46, 192);

    // Barra decorativa técnica inferior
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(44, 250);
    ctx.lineTo(976, 250);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 18px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('━━◆  COMPETENCIA INSTITUCIONAL  •  NIVEL I · II · III  ◆━━', 512, 276);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(8.5, 2.85, 1);
    return sprite;
  }

  // 8.2 Marquesina Holográfica de Portal de Acceso (800 x 190 px)
  createPortalMarquee(line) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 190;
    const ctx = canvas.getContext('2d');

    const color = line.colorHex || '#00a0df';

    // Cápsula de portal
    ctx.fillStyle = 'rgba(8, 14, 30, 0.94)';
    ctx.beginPath();
    ctx.roundRect(12, 12, 776, 166, 24);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(12, 12, 776, 166, 24);
    ctx.stroke();

    // Franja de entrada
    ctx.fillStyle = color;
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`▶▶ ACCESO AUTORIZADO // LÍNEA 0${line.id}`, 400, 32);

    // Título del domo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillText(`DOMO ${line.title.toUpperCase()}`, 400, 70);

    // Indicador de tecla
    ctx.fillStyle = 'rgba(232, 168, 0, 0.95)';
    ctx.font = 'bold 19px JetBrains Mono, monospace';
    ctx.fillText('[ PRESIONA TECLA E O HAZ CLIC PARA INGRESAR ]', 400, 134);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(5.2, 1.25, 1);
    return sprite;
  }

  // 8.3 Badge Flotante Interactivo sobre la Consola Pedestal (512 x 140 px)
  createPedestalBadge(colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 120, 20);
    ctx.fill();

    ctx.strokeStyle = '#e8a800';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 120, 20);
    ctx.stroke();

    ctx.fillStyle = '#e8a800';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ INTERACCIÓN PEDAGÓGICA', 256, 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText('[ TECLA E // EXPLORAR ]', 256, 75);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.65, 1);
    return sprite;
  }

  // 8.4 Cartel Monumental del Ágora Central (1024 x 340 px)
  createAgoraSignSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    // Fondo oscuro espacial con acento dorado
    ctx.fillStyle = 'rgba(7, 12, 28, 0.95)';
    ctx.beginPath();
    ctx.roundRect(16, 16, 992, 308, 28);
    ctx.fill();

    ctx.strokeStyle = '#e8a800';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(16, 16, 992, 308, 28);
    ctx.stroke();

    // Corchetes dorados
    ctx.strokeStyle = '#00a0df';
    ctx.lineWidth = 4;
    const bLen = 36;
    ctx.beginPath();
    ctx.moveTo(16, 16 + bLen); ctx.lineTo(16, 16); ctx.lineTo(16 + bLen, 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1008 - bLen, 16); ctx.lineTo(1008, 16); ctx.lineTo(1008, 16 + bLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(16, 324 - bLen); ctx.lineTo(16, 324); ctx.lineTo(16 + bLen, 324);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1008 - bLen, 324); ctx.lineTo(1008, 324); ctx.lineTo(1008, 324 - bLen);
    ctx.stroke();

    // Encabezado
    ctx.fillStyle = '#00a0df';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CAMPUS INMERSIVO UNIMINUTO  //  NÚCLEO CENTRAL 00', 44, 40);

    ctx.fillStyle = 'rgba(232, 168, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(740, 36, 230, 34, 17);
    ctx.fill();
    ctx.strokeStyle = '#e8a800';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#e8a800';
    ctx.font = 'bold 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ NEXO TRANSVERSAL', 855, 44);

    // Título monumental
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🏛️ ÁGORA CENTRAL UNIMINUTO', 44, 98);

    // Subtítulo
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 25px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Núcleo Integrador de Competencias Transversales • 6 Domos de Formación', 46, 192);

    // Barra técnica inferior
    ctx.strokeStyle = 'rgba(232, 168, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(44, 250);
    ctx.lineTo(976, 250);
    ctx.stroke();

    ctx.fillStyle = '#e8a800';
    ctx.font = 'bold 18px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('━━◆  BIENVENIDO AL ECOSISTEMA VIRTUEXPERIENCE 3D  ◆━━', 512, 276);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(9.2, 3.05, 1);
    return sprite;
  }

  createTextSprite(text, colorHex) {
    // Mantener para compatibilidad
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fill();
    ctx.strokeStyle = colorHex || '#00a0df';
    ctx.lineWidth = 6;
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.stroke();
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(7.2, 1.8, 1);
    return sprite;
  }

  /* -------------------------------------------------------------------------- */
  /* 9. PARTÍCULAS ATMOSFÉRICAS ASCENDENTES                                     */
  /* -------------------------------------------------------------------------- */
  createAtmosphericParticles() {
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 220;
      positions[i + 1] = Math.random() * 45;
      positions[i + 2] = (Math.random() - 0.5) * 220;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.45,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  /* -------------------------------------------------------------------------- */
  /* 10. BUCLE DE ANIMACIÓN Y FÍSICA PROCEDURAL (UPDATE)                         */
  /* -------------------------------------------------------------------------- */
  update(delta, elapsed) {
    // 10.1 Cristal Central del Ágora
    if (this.centralCrystal) {
      this.centralCrystal.rotation.y += delta * 0.45;
      this.centralCrystal.rotation.x = Math.sin(elapsed * 0.7) * 0.12;
      this.centralCrystal.position.y = 5.2 + Math.sin(elapsed * 1.6) * 0.28;
    }
    if (this.centralWire) {
      this.centralWire.rotation.y -= delta * 0.55;
      this.centralWire.position.y = 5.2 + Math.sin(elapsed * 1.6) * 0.28;
    }
    if (this.orbitRing1) this.orbitRing1.rotation.z += delta * 0.75;
    if (this.orbitRing2) this.orbitRing2.rotation.x += delta * 0.5;
    if (this.orbitRing3) this.orbitRing3.rotation.y += delta * 0.65;

    // 10.2 Bóveda celeste y estrellas
    if (this.stars) {
      this.stars.rotation.y += delta * 0.015;
    }
    if (this.skyRing) {
      this.skyRing.rotation.z += delta * 0.02;
    }
    if (this.skyRing2) {
      this.skyRing2.rotation.z -= delta * 0.015;
    }

    // 10.3 Paquetes de energía fluyendo por los caminos
    this.energyPackets.forEach((packet) => {
      packet.progress += delta * packet.speed;
      if (packet.progress > 1) {
        packet.progress = 0;
      }
      packet.mesh.position.lerpVectors(packet.startPos, packet.targetPos, packet.progress);
      packet.mesh.position.y = 0.22 + Math.sin(packet.progress * Math.PI) * 0.35;
    });

    // 10.4 Monumentos 3D Temáticos
    // Comunicarte: Anillos de sonido
    const mCom = this.thematicMonuments['comunicarte'];
    if (mCom && mCom.userData.waveRings) {
      mCom.rotation.y += delta * 0.6;
      mCom.userData.waveRings.forEach((ring, idx) => {
        const scale = 1 + Math.sin(elapsed * 3 + idx * 1.2) * 0.15;
        ring.scale.set(scale, scale, 1);
      });
    }

    // NeuroMath: Tesseract y sinapsis
    const mMath = this.thematicMonuments['neuromath'];
    if (mMath) {
      mMath.rotation.x += delta * 0.7;
      mMath.rotation.y += delta * 0.5;
    }

    // VoxCivitas: Balanza cívica
    const mVox = this.thematicMonuments['voxcivitas'];
    if (mVox && mVox.userData.voxRings) {
      mVox.userData.voxRings[0].rotation.z += delta * 0.8;
      mVox.userData.voxRings[1].rotation.x += delta * 0.6;
    }

    // Gerencia+: Doble hélice
    const mGer = this.thematicMonuments['gerencia'];
    if (mGer) {
      if (mGer.userData.helix) mGer.userData.helix.rotation.y += delta * 1.4;
      if (mGer.userData.prism) {
        mGer.userData.prism.rotation.y -= delta * 1.0;
        mGer.userData.prism.position.y = Math.sin(elapsed * 2) * 0.2;
      }
    }

    // Activa tu Idea: Chispas orbitales
    const mIdea = this.thematicMonuments['actividaidea'];
    if (mIdea && mIdea.userData.sparks) {
      mIdea.rotation.y += delta * 0.8;
      mIdea.userData.sparks.forEach((spark, idx) => {
        const spAngle = elapsed * 2 + (idx * Math.PI / 2);
        spark.position.set(Math.cos(spAngle) * 1.3, Math.sin(spAngle * 2) * 0.3, Math.sin(spAngle) * 1.3);
      });
    }

    // Latido Social: Latido cardíaco en tiempo real (doble pulso diastólico/sistólico)
    const mSoc = this.thematicMonuments['latidosocial'];
    if (mSoc && mSoc.userData.heartMesh) {
      const beat = (Math.sin(elapsed * 4.5) > 0.6 ? 0.22 : 0) + Math.sin(elapsed * 2.2) * 0.06;
      const s = 1.0 + beat;
      mSoc.userData.heartMesh.scale.set(s, s, s);

      if (mSoc.userData.empathyWave) {
        mSoc.userData.empathyWave.scale.set(1 + beat * 2, 1 + beat * 2, 1);
        mSoc.userData.empathyWave.rotation.z += delta * 0.5;
      }
    }

    // 10.5 Balizas de advertencia del skyline parpadeantes
    this.skylineBeacons.forEach((b, idx) => {
      b.visible = Math.sin(elapsed * 3 + idx) > -0.2;
    });

    // 10.6 Partículas de niebla ascendentes
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 1.4;
        if (positions[i] > 45) {
          positions[i] = 0;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // 10.7 Dron de Compañía Flotante ("VirtuBot")
    if (this.droneGroup && this.camera) {
      // Seguir suavemente a la cámara con compensación angular
      const targetX = this.camera.position.x + Math.sin(elapsed * 0.6) * 1.8;
      const targetY = this.camera.position.y + 0.3 + Math.sin(elapsed * 2.0) * 0.22;
      const targetZ = this.camera.position.z + Math.cos(elapsed * 0.6) * 1.8;

      this.droneGroup.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 2.2);
      this.droneGroup.lookAt(this.camera.position.x, this.camera.position.y + 0.2, this.camera.position.z);
      if (this.droneRing) this.droneRing.rotation.z += delta * 2.5;
    }

    // 10.8 Levitación Suave de Carteles y Letreros Holográficos
    this.floatingSigns.forEach((sign) => {
      if (sign.userData && sign.userData.baseY !== undefined) {
        sign.position.y = sign.userData.baseY + Math.sin(elapsed * 1.8 + sign.userData.offset) * 0.16;
      }
    });

    // 10.9 Animaciones Arquitectónicas de Nueva Generación
    if (this.dynamicArchitectures) {
      // NeuroMath: Flotación del prisma octaédrico
      const nm = this.dynamicArchitectures['neuromath'];
      if (nm && nm.floatingPrism) {
        nm.floatingPrism.rotation.y += delta * 0.45;
        nm.floatingPrism.rotation.x = Math.sin(elapsed * 0.8) * 0.12;
        nm.floatingPrism.position.y = nm.basePrismY + Math.sin(elapsed * 1.6) * 0.35;
      }

      // Gerencia+: Rotación continua del ticker financiero
      const ger = this.dynamicArchitectures['gerencia'];
      if (ger && ger.tickerRing) {
        ger.tickerRing.rotation.z += delta * 0.75;
      }

      // Activa tu Idea: Pulso del reactor de plasma
      const idea = this.dynamicArchitectures['actividaidea'];
      if (idea && idea.plasmaCore) {
        const pScale = 1.0 + Math.sin(elapsed * 4.0) * 0.14;
        idea.plasmaCore.scale.set(pScale, pScale, pScale);
      }

      // Comunicarte: Pulso del foco emisor
      const com = this.dynamicArchitectures['comunicarte'];
      if (com && com.focalEmitter) {
        const fScale = 1.0 + Math.sin(elapsed * 5.0) * 0.18;
        com.focalEmitter.scale.set(fScale, fScale, fScale);
      }
    }
  }
}
