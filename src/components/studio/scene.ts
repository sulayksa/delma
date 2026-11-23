/**
 * Procedural 3D door built with three.js: casing, leaf (4 Delma WPC models), lever handles, hinges.
 * The wood is the company's own catalogue texture (P01–P19), so colours match the catalogue.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Model = 'plain' | 'carved' | 'glass' | 'decor';
export type Finish = 'black' | 'chrome' | 'gold';
export type View = 'front' | 'side' | 'back' | 'angle';

const W = 0.9, H = 2.05, T = 0.045; // leaf size (m)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Tween = { from: number; to: number; dur: number; t0: number; set: (v: number) => void; done?: () => void };

export class DoorScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  private loader = new THREE.TextureLoader();
  private texCache = new Map<string, THREE.Texture>();
  private wood = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
  private woodPanel = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.58 });
  private metal = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.32, metalness: 0.75 });
  private gold = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.22, metalness: 1 });
  private glass = new THREE.MeshPhysicalMaterial({ color: 0xb9c6d1, roughness: 0.3, metalness: 0, transmission: 0.6, thickness: 0.006, ior: 1.5, transparent: true, opacity: 0.75, envMapIntensity: 1.2 });
  private leafPivot = new THREE.Group();
  private leaf = new THREE.Group();
  private levers: THREE.Group[] = [];
  private tweens: Tween[] = [];
  private dirty = true;
  private raf = 0;
  private running = true;
  private visible = true;
  open = false;
  onState?: (s: { open: boolean; busy: boolean }) => void;

  constructor(private canvas: HTMLCanvasElement, private base: string) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 0.92;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;

    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    pm.dispose();

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
    this.camera.position.set(3.4, 1.9, 5.6);

    const c = (this.controls = new OrbitControls(this.camera, canvas));
    c.target.set(-W / 2, 1.05, 0);
    c.enableDamping = true; c.dampingFactor = 0.075;
    c.enablePan = false; c.minDistance = 2.2; c.maxDistance = 8;
    c.minPolarAngle = 0.25; c.maxPolarAngle = Math.PI * 0.56;
    c.rotateSpeed = 0.75; c.zoomSpeed = 0.8;
    c.autoRotate = false; c.autoRotateSpeed = 0.7;
    c.addEventListener('change', () => { this.dirty = true; });

    // light rig: soft key with shadow, fill from the environment
    const key = new THREE.DirectionalLight(0xfff6ec, 2.4);
    key.position.set(2.5, 4.2, 3.2); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0004;
    Object.assign(key.shadow.camera, { left: -2, right: 2, top: 3, bottom: -1, near: 0.5, far: 12 });
    this.scene.add(key, new THREE.HemisphereLight(0xffffff, 0xdfe5ec, 0.25));

    const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    this.scene.add(floor);

    this.buildFrame();
    this.leafPivot.add(this.leaf);
    this.scene.add(this.leafPivot);
  }

  /* ---------- assets ---------- */
  private texture(code: string): Promise<THREE.Texture> {
    const hit = this.texCache.get(code); if (hit) return Promise.resolve(hit);
    return new Promise((res) => this.loader.load(`${this.base}/img/colors/${code}.webp`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      this.texCache.set(code, t); res(t);
    }));
  }

  async setColor(code: string) {
    const t = await this.texture(code);
    const leafTex = t.clone(); leafTex.repeat.set(1 / W, 1 / H); leafTex.needsUpdate = true; // UVs are in metres
    this.wood.map = leafTex; this.wood.needsUpdate = true;
    const p = t.clone(); p.repeat.set(1 / W, 1 / H); p.needsUpdate = true;
    this.woodPanel.map = p; this.woodPanel.color.setScalar(0.84); this.woodPanel.needsUpdate = true;
    this.dirty = true;
  }

  setFinish(f: Finish) {
    const m = this.metal;
    if (f === 'black') { m.color.set(0x1b1c1f); m.roughness = 0.32; m.metalness = 0.75; }
    if (f === 'chrome') { m.color.set(0xe2e5e9); m.roughness = 0.12; m.metalness = 1; }
    if (f === 'gold') { m.color.set(0xc9a24a); m.roughness = 0.22; m.metalness = 1; }
    m.needsUpdate = true; this.dirty = true;
  }

  /* ---------- geometry ---------- */
  private buildFrame() {
    const g = new THREE.Group();
    const jambW = 0.075, depth = 0.14;
    const mk = (w: number, h: number, d: number, x: number, y: number, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), this.wood);
      m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m;
    };
    mk(jambW, H + jambW + 0.01, depth, jambW / 2 + 0.003, (H + jambW) / 2);          // hinge-side jamb
    mk(jambW, H + jambW + 0.01, depth, -W - jambW / 2 - 0.003, (H + jambW) / 2);     // latch-side jamb
    mk(W + jambW * 2 + 0.006, jambW, depth, -W / 2, H + jambW / 2 + 0.004);          // head
    // architrave on both faces (slightly proud of the jambs)
    for (const z of [depth / 2 + 0.008, -depth / 2 - 0.008]) {
      const aw = 0.085, ad = 0.016;
      mk(aw, H + aw + 0.01, ad, aw / 2 + 0.003 - 0.004, (H + aw) / 2, z);
      mk(aw, H + aw + 0.01, ad, -W - aw / 2 - 0.003 + 0.004, (H + aw) / 2, z);
      mk(W + aw * 2, aw, ad, -W / 2, H + aw / 2 + 0.006, z);
    }
    this.scene.add(g);
  }

  setModel(model: Model) {
    // clear
    this.leaf.traverse((o) => { if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose(); });
    this.leaf.clear(); this.levers = [];

    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(W, 0); shape.lineTo(W, H); shape.lineTo(0, H); shape.lineTo(0, 0);
    const holes: [number, number, number, number][] = [];
    if (model === 'glass') {
      const hw = 0.17, hh = 0.2;
      for (const cx of [0.32, 0.58]) for (const cy of [1.18, 1.46, 1.74]) holes.push([cx - hw / 2, cy - hh / 2, hw, hh]);
      holes.forEach(([x, y, w, h]) => { const p = new THREE.Path(); p.moveTo(x, y); p.lineTo(x, y + h); p.lineTo(x + w, y + h); p.lineTo(x + w, y); p.lineTo(x, y); shape.holes.push(p); });
    }
    const leafGeo = new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0025, bevelSegments: 2, curveSegments: 1 });
    leafGeo.translate(-W, 0.006, -T / 2);
    const leafMesh = new THREE.Mesh(leafGeo, this.wood);
    leafMesh.castShadow = leafMesh.receiveShadow = true;
    this.leaf.add(leafMesh);

    const add = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; this.leaf.add(m); return m; };

    if (model === 'carved') {
      // raised, bevelled panels on both faces
      for (const [y0, y1] of [[1.12, 1.9], [0.18, 0.98]]) {
        const ps = new THREE.Shape(); const x0 = 0.13, x1 = W - 0.13;
        ps.moveTo(x0, y0); ps.lineTo(x1, y0); ps.lineTo(x1, y1); ps.lineTo(x0, y1); ps.lineTo(x0, y0);
        for (const side of [1, -1]) {
          const pg = new THREE.ExtrudeGeometry(ps, { depth: 0.002, bevelEnabled: true, bevelThickness: 0.011, bevelSize: 0.026, bevelSegments: 4 });
          pg.translate(-W, 0.006, 0);
          const m = add(new THREE.Mesh(pg, this.woodPanel));
          m.position.z = side * (T / 2 - 0.003); if (side < 0) { m.scale.z = -1; }
        }
      }
    }
    if (model === 'glass') {
      holes.forEach(([x, y, w, h]) => {
        const pane = add(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.006), this.glass));
        pane.position.set(-W + x + w / 2, 0.006 + y + h / 2, 0); pane.castShadow = false;
        // glazing beads
        for (const side of [1, -1]) {
          const bw = 0.012, bd = 0.008, z = side * (T / 2 + bd / 2 - 0.002);
          for (const [bx, by, bwid, bh] of [[x + w / 2, y + bw / 2, w + bw * 2, bw], [x + w / 2, y + h - bw / 2, w + bw * 2, bw], [x + bw / 2, y + h / 2, bw, h], [x + w - bw / 2, y + h / 2, bw, h]]) {
            const b = add(new THREE.Mesh(new THREE.BoxGeometry(bwid, bh, bd), this.woodPanel));
            b.position.set(-W + bx, 0.006 + by, z);
          }
        }
      });
    }
    if (model === 'decor') {
      // inlaid metal lines (two nested L-shapes), both faces
      const lines: [number, number, number, number][] = [[0.62, 1.62, 0.28, 1.62], [0.28, 1.62, 0.28, 0.52], [0.36, 1.5, 0.36, 0.62], [0.36, 0.62, 0.7, 0.62]];
      for (const side of [1, -1]) for (const [x0, y0, x1, y1] of lines) {
        const len = Math.hypot(x1 - x0, y1 - y0) + 0.008;
        const horiz = Math.abs(y1 - y0) < 1e-6;
        const m = add(new THREE.Mesh(new THREE.BoxGeometry(horiz ? len : 0.008, horiz ? 0.008 : len, 0.003), this.gold));
        m.position.set(-W + (x0 + x1) / 2, 0.006 + (y0 + y1) / 2, side * (T / 2 + 0.0015)); m.castShadow = false;
      }
    }

    // handles (lever + rose + key escutcheon), both faces
    for (const side of [1, -1]) {
      const hx = -W + 0.075, hy = 1.02, z = side * (T / 2);
      const rose = add(new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.01, 40), this.metal));
      rose.rotation.x = Math.PI / 2; rose.position.set(hx, hy, z + side * 0.005);
      const esc = add(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.008, 32), this.metal));
      esc.rotation.x = Math.PI / 2; esc.position.set(hx, hy - 0.11, z + side * 0.004);
      const lever = new THREE.Group(); lever.position.set(hx, hy, z + side * 0.03);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.045, 24), this.metal);
      neck.rotation.x = Math.PI / 2; neck.position.z = -side * 0.012; neck.castShadow = true;
      const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.12, 8, 24), this.metal);
      bar.rotation.z = Math.PI / 2; bar.position.set(0.068, 0, side * 0.004); bar.castShadow = true;
      lever.add(neck, bar); this.leaf.add(lever); this.levers.push(lever);
    }
    // hinges on the pivot side
    for (const y of [0.24, 1.05, 1.86]) {
      const h = add(new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.1, 24), this.metal));
      h.position.set(0.004, y, T / 2 - 0.004);
    }
    this.leafPivot.rotation.y = this.open ? -1.48 : 0;
    this.dirty = true;
  }

  /* ---------- interaction ---------- */
  private tween(from: number, to: number, dur: number, set: (v: number) => void, done?: () => void, delay = 0) {
    this.tweens.push({ from, to, dur, t0: performance.now() + delay, set, done });
  }

  toggle() {
    if (this.tweens.length) return;
    const opening = !this.open;
    this.onState?.({ open: opening, busy: true });
    if (opening) this.levers.forEach((l) => this.tween(0, -0.55, 230, (v) => { l.rotation.z = v; }, () => this.tween(-0.55, 0, 420, (v) => { l.rotation.z = v; }, undefined, 380)));
    const from = this.leafPivot.rotation.y, to = opening ? -1.48 : 0;
    this.tween(from, to, opening ? 1500 : 1200, (v) => { this.leafPivot.rotation.y = v; }, () => { this.open = opening; this.onState?.({ open: opening, busy: false }); }, opening ? 230 : 0);
  }

  view(v: View, dur = 1300) {
    const R = this.camera.position.distanceTo(this.controls.target) || 5;
    const d = Math.max(3.6, Math.min(R, 5.2));
    const t = this.controls.target;
    const to = {
      front: new THREE.Vector3(t.x, 1.25, d),
      back: new THREE.Vector3(t.x, 1.25, -d),
      side: new THREE.Vector3(t.x + d * 0.92, 1.3, d * 0.38),
      angle: new THREE.Vector3(t.x + d * 0.62, 2.1, d * 0.78),
    }[v];
    // orbit along a sphere for a camera-like move
    const s0 = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(t));
    const s1 = new THREE.Spherical().setFromVector3(to.clone().sub(t));
    let dTheta = s1.theta - s0.theta; if (dTheta > Math.PI) dTheta -= Math.PI * 2; if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    this.tween(0, 1, dur, (k) => {
      const s = new THREE.Spherical(s0.radius + (s1.radius - s0.radius) * k, s0.phi + (s1.phi - s0.phi) * k, s0.theta + dTheta * k);
      this.camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(t));
    });
  }

  intro() { this.view('angle', 2200); }
  setAutoRotate(on: boolean) { this.controls.autoRotate = on; this.dirty = true; }

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.8 ? 40 : 30;
    this.camera.updateProjectionMatrix(); this.dirty = true;
  }
  setVisible(v: boolean) { this.visible = v; }

  start() {
    const loop = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      if (!this.visible) return;
      let active = false;
      this.tweens = this.tweens.filter((tw) => {
        if (now < tw.t0) { active = true; return true; }
        const k = Math.min(1, (now - tw.t0) / tw.dur);
        tw.set(tw.from + (tw.to - tw.from) * easeInOut(k)); active = true;
        if (k >= 1) { tw.done?.(); return false; } return true;
      });
      const moved = this.controls.update();
      if (active || moved || this.dirty || this.controls.autoRotate) { this.renderer.render(this.scene, this.camera); this.dirty = false; }
    };
    this.raf = requestAnimationFrame(loop);
  }

  dispose() {
    this.running = false; cancelAnimationFrame(this.raf);
    this.controls.dispose();
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); });
    this.texCache.forEach((t) => t.dispose());
    this.renderer.dispose();
  }
}
