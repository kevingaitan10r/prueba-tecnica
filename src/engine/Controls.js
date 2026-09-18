import * as THREE from 'three';
import { TRANSVERSAL_LINES } from '../modules/TransversalLines.js';

export class Controls {
  constructor(world, environment, onInteract, onZoneChange) {
    this.world = world;
    this.camera = world.camera;
    this.environment = environment;
    this.onInteract = onInteract;
    this.onZoneChange = onZoneChange;

    this.domElement = world.renderer.domElement;
    this.crosshair = document.getElementById('crosshair');
    this.promptEl = document.getElementById('interaction-prompt');
    this.promptTargetName = document.getElementById('prompt-target-name');
    this.camCoordsEl = document.getElementById('cam-coords');
    this.zoneNameEl = document.getElementById('current-zone-name');

    // Minimap canvas
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    // Movement state
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.isSprinting = false;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Camera angles
    this.yaw = 0;
    this.pitch = 0;
    this.isPointerLocked = false;
    this.isMouseDown = false;
    this.prevMousePos = { x: 0, y: 0 };

    // Raycaster for interactions
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 10;
    this.currentTarget = null;

    // Teleport points
    this.teleportLocations = {
      0: { name: 'Ágora Central UNIMINUTO', pos: new THREE.Vector3(0, 5, 14), lookAt: new THREE.Vector3(0, 4.5, 0) },
      1: { name: 'Domo Comunicarte', pos: new THREE.Vector3(38, 5, -12), lookAt: new THREE.Vector3(38, 2.8, -22) },
      2: { name: 'Domo NeuroMath', pos: new THREE.Vector3(44, 5, 28), lookAt: new THREE.Vector3(44, 2.8, 18) },
      3: { name: 'Domo VoxCivitas', pos: new THREE.Vector3(12, 5, 52), lookAt: new THREE.Vector3(12, 2.8, 42) },
      4: { name: 'Domo Gerencia+', pos: new THREE.Vector3(-32, 5, 42), lookAt: new THREE.Vector3(-32, 2.8, 32) },
      5: { name: 'Domo Activa Tu Idea', pos: new THREE.Vector3(-44, 5, -4), lookAt: new THREE.Vector3(-44, 2.8, -14) },
      6: { name: 'Domo Latido Social', pos: new THREE.Vector3(-14, 5, -32), lookAt: new THREE.Vector3(-14, 2.8, -42) }
    };

    this.currentZone = 'Ágora Central UNIMINUTO';

    // Transición cinemática de vuelo suave entre domos
    this.isTransitioning = false;
    this.transStartPos = new THREE.Vector3();
    this.transTargetPos = new THREE.Vector3();
    this.transStartYaw = 0;
    this.transTargetYaw = 0;
    this.transStartPitch = 0;
    this.transTargetPitch = 0;
    this.transProgress = 0;

    this.initEvents();
    this.initMinimap();
  }

  initEvents() {
    // Keyboard handlers
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    // Mouse drag / look
    this.domElement.addEventListener('mousedown', (e) => {
      // If click on 3D canvas and not already in modal
      if (document.querySelector('.modal-overlay:not(.hidden)')) return;
      this.isMouseDown = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };

      // Si hay un target interactivo seleccionado, actuar de inmediato
      if (this.currentTarget && typeof this.onInteract === 'function') {
        this.onInteract(this.currentTarget.userData);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown && !this.isPointerLocked) return;
      const movementX = this.isPointerLocked ? (e.movementX || 0) : (e.clientX - this.prevMousePos.x);
      const movementY = this.isPointerLocked ? (e.movementY || 0) : (e.clientY - this.prevMousePos.y);

      this.prevMousePos = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.0035;
      this.yaw -= movementX * sensitivity;
      this.pitch -= movementY * sensitivity;

      // Limitar inclinación vertical
      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));

      this.updateCameraRotation();
    });

    // Touch support for tablets / mobile
    let touchStartX = 0;
    let touchStartY = 0;
    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });

    this.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        this.yaw -= deltaX * 0.005;
        this.pitch -= deltaY * 0.005;
        this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
        this.updateCameraRotation();
      }
    });
  }

  updateCameraRotation() {
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.pitch;
    euler.y = this.yaw;
    this.camera.quaternion.setFromEuler(euler);
  }

  onKeyDown(e) {
    // Evitar interceptar cuando se escribe en inputs o formularios
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        break;
      case 'KeyE':
        if (this.currentTarget && typeof this.onInteract === 'function') {
          this.onInteract(this.currentTarget.userData);
        }
        break;
      case 'Digit0':
      case 'Numpad0':
        this.teleportTo(0);
        break;
      case 'Digit1':
      case 'Numpad1':
        this.teleportTo(1);
        break;
      case 'Digit2':
      case 'Numpad2':
        this.teleportTo(2);
        break;
      case 'Digit3':
      case 'Numpad3':
        this.teleportTo(3);
        break;
      case 'Digit4':
      case 'Numpad4':
        this.teleportTo(4);
        break;
      case 'Digit5':
      case 'Numpad5':
        this.teleportTo(5);
        break;
      case 'Digit6':
      case 'Numpad6':
        this.teleportTo(6);
        break;
    }
  }

  onKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        break;
    }
  }

  teleportTo(index) {
    const loc = this.teleportLocations[index];
    if (!loc) return;

    let targetYaw = this.yaw;
    let targetPitch = 0;
    if (loc.lookAt) {
      const dir = new THREE.Vector3().subVectors(loc.lookAt, loc.pos).normalize();
      targetYaw = Math.atan2(-dir.x, -dir.z);
      targetPitch = Math.asin(dir.y);
    }

    // Normalizar diferencia de yaw para la ruta de giro más corta
    let diffYaw = targetYaw - this.yaw;
    while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
    while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
    targetYaw = this.yaw + diffYaw;

    this.transStartPos.copy(this.camera.position);
    this.transTargetPos.copy(loc.pos);
    this.transStartYaw = this.yaw;
    this.transTargetYaw = targetYaw;
    this.transStartPitch = this.pitch;
    this.transTargetPitch = targetPitch;
    this.transProgress = 0;
    this.isTransitioning = true;

    this.currentZone = loc.name;
    if (this.zoneNameEl) this.zoneNameEl.textContent = loc.name;
    if (typeof this.onZoneChange === 'function') {
      this.onZoneChange(index, loc);
    }
  }

  initMinimap() {
    if (!this.minimapCanvas) return;

    this.minimapCanvas.addEventListener('click', (e) => {
      const rect = this.minimapCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Escalar de canvas (180x180) a coordenadas del mundo (-70 a 70)
      const worldX = ((clickX / 180) - 0.5) * 140;
      const worldZ = ((clickY / 180) - 0.5) * 140;

      // Buscar si el clic fue cerca de algún domo
      let closestDome = 0;
      let minDistance = 9999;

      Object.entries(this.teleportLocations).forEach(([key, loc]) => {
        const dist = Math.hypot(loc.pos.x - worldX, loc.pos.z - worldZ);
        if (dist < minDistance) {
          minDistance = dist;
          closestDome = parseInt(key);
        }
      });

      this.teleportTo(closestDome);
    });
  }

  drawMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const width = this.minimapCanvas.width;
    const height = this.minimapCanvas.height;

    ctx.clearRect(0, 0, width, height);

    // Fondo del minimapa
    ctx.fillStyle = 'rgba(6, 9, 19, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Cuadrícula del minimapa
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 20; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    const worldToMap = (wx, wz) => {
      return {
        x: (wx / 140 + 0.5) * width,
        y: (wz / 140 + 0.5) * height
      };
    };

    // Ágora Central
    const agoraMap = worldToMap(0, 0);
    ctx.fillStyle = 'rgba(232, 168, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(agoraMap.x, agoraMap.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e8a800';
    ctx.stroke();

    // Dibujar los 6 domos
    TRANSVERSAL_LINES.forEach((line) => {
      const p = worldToMap(line.domePosition.x, line.domePosition.z);
      ctx.fillStyle = line.colorHex;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });

    // Jugador (Posición actual y cono de visión)
    const playerMap = worldToMap(this.camera.position.x, this.camera.position.z);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(playerMap.x, playerMap.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Cono de dirección
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(playerMap.x, playerMap.y);
    ctx.lineTo(
      playerMap.x - Math.sin(this.yaw) * 12,
      playerMap.y - Math.cos(this.yaw) * 12
    );
    ctx.stroke();
  }

  update(delta) {
    // 1. Manejar transición cinemática suave si está activa
    if (this.isTransitioning) {
      // Si el usuario presiona teclas de movimiento manual, cancelar suavemente el vuelo
      if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
        this.isTransitioning = false;
      } else {
        this.transProgress += delta * 1.35; // ~0.75 segundos de vuelo
        if (this.transProgress >= 1.0) {
          this.transProgress = 1.0;
          this.isTransitioning = false;
        }

        // Curva de aceleración/desaceleración armónica (EaseInOutCubic)
        const t = this.transProgress;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        this.camera.position.lerpVectors(this.transStartPos, this.transTargetPos, ease);
        // Elevación parabólica sutil que simula un sobrevuelo tipo dron
        this.camera.position.y = 5.0 + Math.sin(ease * Math.PI) * 2.8;

        this.yaw = THREE.MathUtils.lerp(this.transStartYaw, this.transTargetYaw, ease);
        this.pitch = THREE.MathUtils.lerp(this.transStartPitch, this.transTargetPitch, ease);
        this.updateCameraRotation();

        if (this.camCoordsEl) {
          this.camCoordsEl.textContent = `X: ${Math.round(this.camera.position.x)} | Z: ${Math.round(this.camera.position.z)}`;
        }
        this.checkInteractions();
        this.drawMinimap();
        return;
      }
    }

    // Movimiento física suave
    const speed = this.isSprinting ? 28 : 14;
    const friction = 10.0;

    this.velocity.x -= this.velocity.x * friction * delta;
    this.velocity.z -= this.velocity.z * friction * delta;

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * speed * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x += this.direction.x * speed * delta;
    }

    // Proyectar movimiento en la dirección de la cámara (Yaw)
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    this.camera.position.addScaledVector(forward, -this.velocity.z * delta * 20);
    this.camera.position.addScaledVector(right, this.velocity.x * delta * 20);

    // Mantener altura fija de paso
    this.camera.position.y = 5.0;

    // Actualizar coordenadas en el HUD
    if (this.camCoordsEl) {
      this.camCoordsEl.textContent = `X: ${Math.round(this.camera.position.x)} | Z: ${Math.round(this.camera.position.z)}`;
    }

    // Raycast para interacción con pedestales
    this.checkInteractions();

    // Redibujar minimapa
    this.drawMinimap();
  }

  checkInteractions() {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.environment.interactiveObjects, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.currentTarget = hit;

      if (this.crosshair) this.crosshair.classList.add('interactive');
      if (this.promptEl) {
        this.promptEl.classList.remove('hidden');
        if (this.promptTargetName && hit.userData.name) {
          this.promptTargetName.textContent = hit.userData.name;
        }
      }
    } else {
      // Comprobar también por proximidad a objetos si el raycast no impacta exactamente el centro
      let nearObject = null;
      let minDistance = 6.0;

      for (const obj of this.environment.interactiveObjects) {
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);
        const dist = this.camera.position.distanceTo(worldPos);
        if (dist < minDistance) {
          minDistance = dist;
          nearObject = obj;
        }
      }

      if (nearObject) {
        this.currentTarget = nearObject;
        if (this.crosshair) this.crosshair.classList.add('interactive');
        if (this.promptEl) {
          this.promptEl.classList.remove('hidden');
          if (this.promptTargetName && nearObject.userData.name) {
            this.promptTargetName.textContent = nearObject.userData.name;
          }
        }
      } else {
        this.currentTarget = null;
        if (this.crosshair) this.crosshair.classList.remove('interactive');
        if (this.promptEl) this.promptEl.classList.add('hidden');
      }
    }
  }
}
