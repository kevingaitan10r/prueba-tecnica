import * as THREE from 'three';

export function buildComunicarteArchitecture(group, line, dynamicArchitectures) {
  const color = line.colorThree;

  // Plato parabólico
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
  dish.rotation.x = -0.35;
  dish.position.set(0, 4.5, -1.0);
  group.add(dish);

  // Borde de neón
  const dishRim = new THREE.Mesh(
    new THREE.RingGeometry(8.9, 9.2, 48),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  );
  dishRim.rotation.x = Math.PI / 2 - 0.35;
  dishRim.position.set(0, 4.5, -1.0);
  group.add(dishRim);

  // Mástil focal
  const mastGeo = new THREE.CylinderGeometry(0.12, 0.25, 6.5, 8);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.rotation.x = -0.35;
  mast.position.set(0, 7.5, -1.8);
  group.add(mast);

  // Foco emisor
  const focalEmitter = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  focalEmitter.position.set(0, 10.5, -2.6);
  group.add(focalEmitter);

  // Torres laterales
  [-7.8, 7.8].forEach((xPos) => {
    const towerGeo = new THREE.CylinderGeometry(0.4, 0.6, 11, 12);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x090e1c, metalness: 0.85 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(xPos, 5.5, 2.0);
    group.add(tower);

    for (let k = 0; k < 3; k++) {
      const rGeo = new THREE.TorusGeometry(1.2 - k * 0.25, 0.06, 8, 24);
      const rMat = new THREE.MeshBasicMaterial({ color });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(xPos, 6.0 + k * 1.8, 2.0);
      group.add(ring);
    }
  });

  const portalArch = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.22, 12, 28, Math.PI),
    new THREE.MeshBasicMaterial({ color })
  );
  portalArch.position.set(0, 0.5, 9.2);
  group.add(portalArch);

  if (dynamicArchitectures) {
    dynamicArchitectures.comunicarte = { focalEmitter };
  }
}

export function buildNeuroMathArchitecture(group, line, dynamicArchitectures) {
  const color = line.colorThree;

  // Prisma octaédrico flotante
  const prismGeo = new THREE.OctahedronGeometry(6.5, 0);
  const prismMat = new THREE.MeshPhysicalMaterial({
    color,
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

  const prismWire = new THREE.Mesh(
    new THREE.OctahedronGeometry(6.58, 0),
    new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true })
  );
  floatingPrism.add(prismWire);

  // Pilones de suspensión magnética
  const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  angles.forEach((ang) => {
    const pylonGroup = new THREE.Group();
    const x = Math.cos(ang) * 9.5;
    const z = Math.sin(ang) * 9.5;
    pylonGroup.position.set(x, 0, z);

    const pylonGeo = new THREE.CylinderGeometry(0.5, 0.7, 9.0, 16);
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const pylon = new THREE.Mesh(pylonGeo, pylonMat);
    pylon.position.y = 4.5;
    pylonGroup.add(pylon);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8, metalness: 0.9 })
    );
    sphere.position.y = 9.2;
    pylonGroup.add(sphere);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.1, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xc084fc })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 7.5;
    pylonGroup.add(ring);

    group.add(pylonGroup);
  });

  const floorRing = new THREE.Mesh(
    new THREE.RingGeometry(5.0, 5.5, 36),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, side: THREE.DoubleSide })
  );
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = 0.52;
  group.add(floorRing);

  const portal = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.22, 4, 16, Math.PI),
    new THREE.MeshBasicMaterial({ color })
  );
  portal.position.set(0, 0.5, 9.2);
  group.add(portal);

  if (dynamicArchitectures) {
    dynamicArchitectures.neuromath = { floatingPrism, basePrismY: 6.2 };
  }
}

export function buildVoxCivitasArchitecture(group, line) {
  const goldColor = 0xe8a800;

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

  const pyrWire = new THREE.Mesh(
    new THREE.ConeGeometry(9.65, 11.55, 4, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfef08a, wireframe: true })
  );
  pyrWire.rotation.y = Math.PI / 4;
  pyrWire.position.y = 5.75;
  group.add(pyrWire);

  const apexCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.9, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  apexCrystal.position.y = 11.8;
  group.add(apexCrystal);

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

export function buildGerenciaArchitecture(group, line, dynamicArchitectures) {
  const color = line.colorThree;

  const levels = [
    { rTop: 7.8, rBot: 9.5, height: 4.2, y: 2.1 },
    { rTop: 5.5, rBot: 7.5, height: 4.0, y: 6.2 },
    { rTop: 3.2, rBot: 5.2, height: 3.8, y: 10.1 }
  ];

  levels.forEach((lvl) => {
    const cylGeo = new THREE.CylinderGeometry(lvl.rTop, lvl.rBot, lvl.height, 28, 1, true);
    const cylMat = new THREE.MeshPhysicalMaterial({
      color,
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

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(lvl.rTop - 0.2, lvl.rTop + 0.3, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = lvl.y + lvl.height / 2;
    group.add(ring);
  });

  const pad = new THREE.Mesh(
    new THREE.CircleGeometry(3.0, 24),
    new THREE.MeshStandardMaterial({ color: 0x090e1c, metalness: 0.9 })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = 12.02;
  group.add(pad);

  const padBorder = new THREE.Mesh(
    new THREE.RingGeometry(2.7, 3.0, 24),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  );
  padBorder.rotation.x = -Math.PI / 2;
  padBorder.position.y = 12.04;
  group.add(padBorder);

  const tickerGeo = new THREE.TorusGeometry(8.2, 0.14, 8, 48);
  const tickerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
  const tickerRing = new THREE.Mesh(tickerGeo, tickerMat);
  tickerRing.rotation.x = Math.PI / 2;
  tickerRing.position.y = 6.2;
  group.add(tickerRing);

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.15, 3.5, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  antenna.position.y = 13.8;
  group.add(antenna);

  const portal = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.4, 3.0),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
  );
  portal.position.set(0, 3.6, 9.2);
  group.add(portal);

  const portalBorder = new THREE.Mesh(
    new THREE.BoxGeometry(5.0, 0.12, 0.2),
    new THREE.MeshBasicMaterial({ color })
  );
  portalBorder.position.set(0, 3.6, 10.7);
  group.add(portalBorder);

  if (dynamicArchitectures) {
    dynamicArchitectures.gerencia = { tickerRing };
  }
}

export function buildActivaIdeaArchitecture(group, line, dynamicArchitectures) {
  const color = line.colorThree;

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

  const plasmaCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffedd5 })
  );
  plasmaCore.position.y = 4.2;
  group.add(plasmaCore);

  const pipeGeo = new THREE.TorusGeometry(9.6, 0.15, 8, 32);
  const pipeMat = new THREE.MeshBasicMaterial({ color });
  const pipe = new THREE.Mesh(pipeGeo, pipeMat);
  pipe.rotation.x = Math.PI / 2;
  pipe.position.y = 1.2;
  group.add(pipe);

  const portal = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.3, 8, 20, Math.PI),
    new THREE.MeshBasicMaterial({ color })
  );
  portal.position.set(0, 0.5, 9.2);
  group.add(portal);

  if (dynamicArchitectures) {
    dynamicArchitectures.actividaidea = { plasmaCore, coils };
  }
}

export function buildLatidoSocialArchitecture(group, line, dynamicArchitectures) {
  const roseColor = 0xec4899;

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

  const bioWire = new THREE.Mesh(
    new THREE.SphereGeometry(9.28, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.45 })
  );
  bioWire.position.y = 0.5;
  group.add(bioWire);

  const trunkGeo = new THREE.CylinderGeometry(0.8, 1.4, 7.5, 12);
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.3,
    metalness: 0.6
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 4.0;
  group.add(trunk);

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

    const fruit = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    fruit.position.set(Math.cos(ang) * 8.6, 7.0, Math.sin(ang) * 8.6);
    group.add(fruit);
  }

  const pondRing = new THREE.Mesh(
    new THREE.RingGeometry(3.5, 3.8, 24),
    new THREE.MeshBasicMaterial({ color: roseColor, side: THREE.DoubleSide })
  );
  pondRing.rotation.x = -Math.PI / 2;
  pondRing.position.y = 0.52;
  group.add(pondRing);

  const portal = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.22, 12, 28, Math.PI),
    new THREE.MeshBasicMaterial({ color: roseColor })
  );
  portal.position.set(0, 0.5, 9.2);
  group.add(portal);

  if (dynamicArchitectures) {
    dynamicArchitectures.latidosocial = { trunk, branches };
  }
}

export function buildGenericArchitecture(group, line) {
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

export function createThematicMonument(line) {
  const group = new THREE.Group();
  const code = line.code;
  const color = line.colorThree;

  if (code === 'comunicarte') {
    const coreGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: color,
      emissiveIntensity: 1.0,
      roughness: 0.1
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    group.userData.waveRings = [];
    [1.2, 1.7, 2.2].forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.05, 12, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7 - i * 0.18
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
      group.userData.waveRings.push(ring);
    });
  } else if (code === 'neuromath') {
    const tesseractGeo = new THREE.DodecahedronGeometry(0.85, 0);
    const tesseractMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.9,
      wireframe: true,
      roughness: 0.1
    });
    const tesseract = new THREE.Mesh(tesseractGeo, tesseractMat);
    group.add(tesseract);

    const innerCoreGeo = new THREE.OctahedronGeometry(0.4, 0);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    group.add(innerCore);

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
    const helixGroup = new THREE.Group();
    const dotGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 4;
      const y = ((i / 24) - 0.5) * 1.8;
      const dot1 = new THREE.Mesh(dotGeo, dotMat);
      dot1.position.set(Math.cos(t) * 0.9, y, Math.sin(t) * 0.9);
      helixGroup.add(dot1);
      const dot2 = new THREE.Mesh(dotGeo, dotMat);
      dot2.position.set(Math.cos(t + Math.PI) * 0.9, y, Math.sin(t + Math.PI) * 0.9);
      helixGroup.add(dot2);
    }
    group.add(helixGroup);
    group.userData.helix = helixGroup;

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

    group.userData.sparks = [];
    const sparkGeo = new THREE.OctahedronGeometry(0.15, 0);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    for (let i = 0; i < 4; i++) {
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      group.add(spark);
      group.userData.sparks.push(spark);
    }
  } else if (code === 'latidosocial') {
    const heartGroup = new THREE.Group();
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

export function buildDomeArchitectureByCode(code, group, line, dynamicArchitectures) {
  switch (code) {
    case 'comunicarte':
      buildComunicarteArchitecture(group, line, dynamicArchitectures);
      break;
    case 'neuromath':
      buildNeuroMathArchitecture(group, line, dynamicArchitectures);
      break;
    case 'voxcivitas':
      buildVoxCivitasArchitecture(group, line);
      break;
    case 'gerencia':
      buildGerenciaArchitecture(group, line, dynamicArchitectures);
      break;
    case 'actividaidea':
      buildActivaIdeaArchitecture(group, line, dynamicArchitectures);
      break;
    case 'latidosocial':
      buildLatidoSocialArchitecture(group, line, dynamicArchitectures);
      break;
    default:
      buildGenericArchitecture(group, line);
  }
}
