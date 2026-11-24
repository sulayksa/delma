/**
 * Delma 3D studio (three.js). Procedural, to scale:
 *  - WPC doors: plain / carved / glass / decor — wood is the company's own catalogue texture (P01–P19)
 *  - UPVC doors: panel (strips) / glazed
 *  - UPVC windows: casement (two sashes) / sliding / tilt — set in a section of wall
 * Tap / click the product itself to open or close it.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Product =
  | 'wpc-plain' | 'wpc-carved' | 'wpc-glass' | 'wpc-decor'
  | 'upvc-panel' | 'upvc-glass'
  | 'win-casement' | 'win-sliding' | 'win-tilt';
export type Finish = 'black' | 'chrome' | 'gold';
export type View = 'front' | 'side' | 'back' | 'angle';
export type Surface = { kind: 'texture'; code: string } | { kind: 'solid'; hex: number };

const DW = 0.9, DH = 2.05, DT = 0.045; // door leaf (m)
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
type Tween = { from: number; to: number; dur: number; t0: number; set: (v: number) => void; done?: () => void };
type Movable = { open: () => void; close: () => void };

export class DoorScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  private loader = new THREE.TextureLoader();
  private texCache = new Map<string, THREE.Texture>();
  private body = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  private bodyPanel = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.56 });
  private groove = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9, transparent: true, opacity: 0.22 });
  private metal = new THREE.MeshStandardMaterial({ color: 0x1b1c1f, roughness: 0.32, metalness: 0.75 });
  private gold = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.22, metalness: 1 });
  private glass = new THREE.MeshPhysicalMaterial({ color: 0xbfd0dc, roughness: 0.08, metalness: 0, transmission: 0.7, thickness: 0.01, ior: 1.5, transparent: true, opacity: 0.55, envMapIntensity: 1.4 });
  private wall = new THREE.MeshStandardMaterial({ color: 0xece9e3, roughness: 0.92 });
  private sillMat = new THREE.MeshStandardMaterial({ color: 0xd9d4cb, roughness: 0.7 });
  private gasket = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.8 });
  private root = new THREE.Group();
  private hit: THREE.Object3D[] = [];
  private moves: Movable[] = [];
  private tweens: Tween[] = [];
  private dirty = true;
  private raf = 0;
  private running = true;
  private visible = true;
  private product: Product = 'wpc-plain';
  private down = { x: 0, y: 0, t: 0 };
  private ray = new THREE.Raycaster();
  private lastOver = false;
  open = false;
  busy = false;
  onState?: (s: { open: boolean; busy: boolean }) => void;
  onHover?: (over: boolean) => void;

  constructor(private canvas: HTMLCanvasElement, private base: string, opts: { interactive?: boolean } = {}) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 0.95;
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;

    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; this.scene.environmentIntensity = 0.6;
    pm.dispose();

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
    this.camera.position.set(3.4, 1.9, 5.6);
    const c = (this.controls = new OrbitControls(this.camera, canvas));
    c.target.set(-DW / 2, 1.05, 0);
    c.enableDamping = true; c.dampingFactor = 0.07;
    c.enablePan = false; c.minDistance = 1.8; c.maxDistance = 8;
    c.minPolarAngle = 0.2; c.maxPolarAngle = Math.PI * 0.58;
    c.rotateSpeed = 0.8; c.zoomSpeed = 0.8; c.autoRotateSpeed = 0.8;
    c.enabled = opts.interactive !== false;
    c.addEventListener('change', () => { this.dirty = true; });

    const key = new THREE.DirectionalLight(0xfff6ec, 2.5);
    key.position.set(2.6, 4.4, 3.4); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 7; key.shadow.bias = -0.0004;
    Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 3.2, bottom: -1, near: 0.5, far: 14 });
    const rim = new THREE.DirectionalLight(0xbfe6ff, 0.8); rim.position.set(-3, 2.5, -3);
    this.scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0xdfe5ec, 0.25));

    const floor = new THREE.Mesh(new THREE.CircleGeometry(5, 64), new THREE.ShadowMaterial({ opacity: 0.18 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    this.scene.add(floor, this.root);

    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointerup', this.onUp);
    canvas.addEventListener('pointermove', this.onMove);
  }

  /* ---------------- picking: a tap opens/closes, a drag orbits ---------------- */
  private pick(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera);
    return this.ray.intersectObjects(this.hit, true).length > 0;
  }
  private onDown = (e: PointerEvent) => { this.down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
  private onUp = (e: PointerEvent) => {
    const moved = Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y);
    if (moved < 8 && performance.now() - this.down.t < 500 && this.pick(e)) this.toggle();
  };
  private onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    const over = this.pick(e);
    if (over !== this.lastOver) { this.lastOver = over; this.canvas.style.cursor = over ? 'pointer' : 'grab'; this.onHover?.(over); }
  };

  /* ---------------- materials ---------------- */
  private texture(code: string): Promise<THREE.Texture> {
    const hit = this.texCache.get(code); if (hit) return Promise.resolve(hit);
    return new Promise((res) => this.loader.load(`${this.base}/img/colors/${code}.webp`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      this.texCache.set(code, t); res(t);
    }));
  }
  async setSurface(s: Surface) {
    if (s.kind === 'texture') {
      const t = await this.texture(s.code);
      for (const [m, shade] of [[this.body, 1], [this.bodyPanel, 0.84]] as const) {
        const tt = t.clone(); tt.repeat.set(1 / DW, 1 / DH); tt.needsUpdate = true;
        m.map = tt; m.color.setScalar(shade); m.roughness = 0.6; m.needsUpdate = true;
      }
    } else {
      for (const [m, shade] of [[this.body, 1], [this.bodyPanel, 0.95]] as const) {
        m.map = null; m.color.setHex(s.hex).multiplyScalar(shade); m.roughness = 0.42; m.needsUpdate = true;
      }
    }
    this.dirty = true;
  }
  setFinish(f: Finish) {
    const m = this.metal;
    if (f === 'black') { m.color.set(0x1b1c1f); m.roughness = 0.32; m.metalness = 0.75; }
    if (f === 'chrome') { m.color.set(0xe2e5e9); m.roughness = 0.12; m.metalness = 1; }
    if (f === 'gold') { m.color.set(0xc9a24a); m.roughness = 0.22; m.metalness = 1; }
    m.needsUpdate = true; this.dirty = true;
  }

  /* ---------------- helpers ---------------- */
  private box(w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D, shadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z); mesh.castShadow = shadow; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  private rectShape(x0: number, y0: number, x1: number, y1: number, holes: [number, number, number, number][] = []) {
    const s = new THREE.Shape(); s.moveTo(x0, y0); s.lineTo(x1, y0); s.lineTo(x1, y1); s.lineTo(x0, y1); s.lineTo(x0, y0);
    for (const [hx, hy, hw, hh] of holes) { const p = new THREE.Path(); p.moveTo(hx, hy); p.lineTo(hx, hy + hh); p.lineTo(hx + hw, hy + hh); p.lineTo(hx + hw, hy); p.lineTo(hx, hy); s.holes.push(p); }
    return s;
  }
  /** rectangular frame (profile w, depth d) of outer size W × H, origin bottom-left */
  private frame(W: number, H: number, w: number, d: number, m: THREE.Material, parent: THREE.Object3D) {
    const geo = new THREE.ExtrudeGeometry(this.rectShape(0, 0, W, H, [[w, w, W - 2 * w, H - 2 * w]]), { depth: d, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2 });
    geo.translate(0, 0, -d / 2);
    const mesh = new THREE.Mesh(geo, m); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  private lever(parent: THREE.Object3D, x: number, y: number, z: number, side: 1 | -1) {
    const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.01, 40), this.metal);
    rose.rotation.x = Math.PI / 2; rose.position.set(x, y, z + side * 0.005); rose.castShadow = true; parent.add(rose);
    const esc = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.008, 32), this.metal);
    esc.rotation.x = Math.PI / 2; esc.position.set(x, y - 0.11, z + side * 0.004); parent.add(esc);
    const lv = new THREE.Group(); lv.position.set(x, y, z + side * 0.03);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.045, 24), this.metal);
    neck.rotation.x = Math.PI / 2; neck.position.z = -side * 0.012; neck.castShadow = true;
    const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.0095, 0.12, 8, 24), this.metal);
    bar.rotation.z = Math.PI / 2; bar.position.set(0.068, 0, side * 0.004); bar.castShadow = true;
    lv.add(neck, bar); parent.add(lv); return lv;
  }
  private glassPane(w: number, h: number, x: number, y: number, z: number, parent: THREE.Object3D) {
    const g = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.008), this.glass); g.position.set(x, y, z); parent.add(g); return g;
  }
  private tween(from: number, to: number, dur: number, set: (v: number) => void, done?: () => void, delay = 0) {
    this.tweens.push({ from, to, dur, t0: performance.now() + delay, set, done });
  }

  /* ---------------- products ---------------- */
  setProduct(p: Product) {
    this.product = p;
    this.root.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); });
    this.root.clear(); this.hit = []; this.moves = []; this.tweens = []; this.open = false; this.busy = false;
    this.onState?.({ open: false, busy: false });
    if (p.startsWith('win')) this.buildWindow(p); else this.buildDoor(p);
    this.dirty = true;
  }

  private buildDoor(p: Product) {
    const isUpvc = p.startsWith('upvc');
    const g = new THREE.Group(); this.root.add(g);
    if (isUpvc) {
      const fr = this.frame(DW + 0.14, DH + 0.075, 0.07, 0.07, this.body, g); fr.position.set(-DW - 0.07, 0, 0);
    } else {
      const jw = 0.075, dp = 0.14;
      this.box(jw, DH + jw + 0.01, dp, this.body, jw / 2 + 0.003, (DH + jw) / 2, 0, g);
      this.box(jw, DH + jw + 0.01, dp, this.body, -DW - jw / 2 - 0.003, (DH + jw) / 2, 0, g);
      this.box(DW + jw * 2 + 0.006, jw, dp, this.body, -DW / 2, DH + jw / 2 + 0.004, 0, g);
      for (const z of [dp / 2 + 0.008, -dp / 2 - 0.008]) {
        const aw = 0.085, ad = 0.016;
        this.box(aw, DH + aw + 0.01, ad, this.body, aw / 2 - 0.001, (DH + aw) / 2, z, g);
        this.box(aw, DH + aw + 0.01, ad, this.body, -DW - aw / 2 + 0.001, (DH + aw) / 2, z, g);
        this.box(DW + aw * 2, aw, ad, this.body, -DW / 2, DH + aw / 2 + 0.006, z, g);
      }
    }
    const pivot = new THREE.Group(); g.add(pivot);
    const leaf = new THREE.Group(); pivot.add(leaf);
    const W = isUpvc ? DW - 0.01 : DW, H = isUpvc ? DH - 0.005 : DH, T = isUpvc ? 0.06 : DT;
    let holes: [number, number, number, number][] = [];
    if (p === 'wpc-glass') { const hw = 0.17, hh = 0.2; for (const cx of [0.32, 0.58]) for (const cy of [1.18, 1.46, 1.74]) holes.push([cx - hw / 2, cy - hh / 2, hw, hh]); }
    if (p === 'upvc-glass') holes = [[0.13, 0.86, W - 0.26, 1.05]];
    const geo = new THREE.ExtrudeGeometry(this.rectShape(0, 0, W, H, holes), { depth: T, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0025, bevelSegments: 2, curveSegments: 1 });
    geo.translate(-W, 0.006, -T / 2);
    const leafMesh = new THREE.Mesh(geo, this.body); leafMesh.castShadow = leafMesh.receiveShadow = true; leaf.add(leafMesh);

    if (p === 'wpc-carved') {
      for (const [y0, y1] of [[1.12, 1.9], [0.18, 0.98]]) for (const side of [1, -1]) {
        const pg = new THREE.ExtrudeGeometry(this.rectShape(0.13, y0, W - 0.13, y1), { depth: 0.002, bevelEnabled: true, bevelThickness: 0.011, bevelSize: 0.026, bevelSegments: 4 });
        pg.translate(-W, 0.006, 0);
        const m = new THREE.Mesh(pg, this.bodyPanel); m.castShadow = m.receiveShadow = true; m.position.z = side * (T / 2 - 0.003); if (side < 0) m.scale.z = -1; leaf.add(m);
      }
    }
    if (p === 'upvc-panel') {
      for (let y = 0.16; y < H - 0.1; y += 0.105) for (const side of [1, -1]) this.box(W - 0.16, 0.006, 0.002, this.groove, -W / 2, y, side * (T / 2 + 0.0012), leaf, false);
    }
    for (const [x, y, w, h] of holes) {
      this.glassPane(w, h, -W + x + w / 2, 0.006 + y + h / 2, 0, leaf);
      for (const side of [1, -1]) {
        const bw = isUpvc ? 0.022 : 0.012, bd = 0.01, z = side * (T / 2 + bd / 2 - 0.003);
        for (const [bx, by, bwid, bh] of [[x + w / 2, y + bw / 2, w + bw * 2, bw], [x + w / 2, y + h - bw / 2, w + bw * 2, bw], [x + bw / 2, y + h / 2, bw, h], [x + w - bw / 2, y + h / 2, bw, h]])
          this.box(bwid, bh, bd, this.bodyPanel, -W + bx, 0.006 + by, z, leaf);
      }
    }
    if (p === 'wpc-decor') {
      const lines: [number, number, number, number][] = [[0.62, 1.62, 0.28, 1.62], [0.28, 1.62, 0.28, 0.52], [0.36, 1.5, 0.36, 0.62], [0.36, 0.62, 0.7, 0.62]];
      for (const side of [1, -1]) for (const [x0, y0, x1, y1] of lines) {
        const len = Math.hypot(x1 - x0, y1 - y0) + 0.008, horiz = Math.abs(y1 - y0) < 1e-6;
        this.box(horiz ? len : 0.008, horiz ? 0.008 : len, 0.003, this.gold, -W + (x0 + x1) / 2, 0.006 + (y0 + y1) / 2, side * (T / 2 + 0.0015), leaf, false);
      }
    }
    const levers = [this.lever(leaf, -W + 0.075, 1.02, T / 2, 1), this.lever(leaf, -W + 0.075, 1.02, -T / 2, -1)];
    for (const y of [0.24, 1.05, 1.86]) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.0085, 0.0085, 0.1, 24), this.metal); h.position.set(0.004, y, T / 2 - 0.004); leaf.add(h); }
    this.hit.push(leaf);
    this.moves.push({
      open: () => {
        levers.forEach((l) => this.tween(0, -0.55, 220, (v) => { l.rotation.z = v; }, () => this.tween(-0.55, 0, 420, (v) => { l.rotation.z = v; }, undefined, 420)));
        this.tween(pivot.rotation.y, -1.45, 1500, (v) => { pivot.rotation.y = v; }, undefined, 200);
      },
      close: () => this.tween(pivot.rotation.y, 0, 1250, (v) => { pivot.rotation.y = v; }),
    });
    this.controls.target.set(-DW / 2, 1.05, 0);
  }

  private buildWindow(p: Product) {
    const g = new THREE.Group(); this.root.add(g);
    const OW = 1.5, OH = 1.3, SILL = 0.85, WT = 0.22, WW = 2.6, WH = 2.7;
    const wallGeo = new THREE.ExtrudeGeometry(this.rectShape(-WW / 2, 0, WW / 2, WH, [[-OW / 2, SILL, OW, OH]]), { depth: WT, bevelEnabled: false });
    wallGeo.translate(0, 0, -WT / 2);
    const wall = new THREE.Mesh(wallGeo, this.wall); wall.castShadow = wall.receiveShadow = true; g.add(wall);
    this.box(OW + 0.12, 0.035, WT + 0.06, this.sillMat, 0, SILL - 0.018, 0.02, g);
    const fw = 0.065, fd = 0.07;
    const fr = this.frame(OW, OH, fw, fd, this.body, g); fr.position.set(-OW / 2, SILL, 0.02);
    const iw = OW - 2 * fw, ih = OH - 2 * fw, ix = -OW / 2 + fw, iy = SILL + fw;
    const sash = (w: number, h: number, depth = 0.06) => {
      const s = new THREE.Group();
      this.frame(w, h, 0.07, depth, this.body, s);
      this.glassPane(w - 0.14, h - 0.14, w / 2, h / 2, 0, s);
      for (const side of [1, -1]) {
        this.box(w - 0.14, 0.006, 0.004, this.gasket, w / 2, 0.07, side * (depth / 2 - 0.004), s, false);
        this.box(w - 0.14, 0.006, 0.004, this.gasket, w / 2, h - 0.07, side * (depth / 2 - 0.004), s, false);
      }
      return s;
    };
    const handle = (parent: THREE.Object3D, x: number, y: number, z: number) => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.075, 0.012), this.metal); base.position.set(x, y, z); parent.add(base);
      const lv = new THREE.Group(); lv.position.set(x, y, z + 0.018);
      const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.09, 6, 16), this.metal); bar.position.y = -0.05; bar.castShadow = true; lv.add(bar); parent.add(lv);
      return lv;
    };

    if (p === 'win-casement') {
      const sw = iw / 2;
      const pivR = new THREE.Group(); pivR.position.set(ix + iw, iy, 0.02); g.add(pivR);
      const sR = sash(sw, ih); sR.position.set(-sw, 0, 0); pivR.add(sR);
      const pivL = new THREE.Group(); pivL.position.set(ix, iy, 0.02); g.add(pivL);
      const sL = sash(sw, ih); pivL.add(sL);
      const h1 = handle(sR, 0.05, ih / 2, 0.03), h2 = handle(sL, sw - 0.05, ih / 2, 0.03);
      this.hit.push(sR, sL);
      this.moves.push({
        open: () => {
          [h1, h2].forEach((h) => this.tween(0, Math.PI / 2, 260, (v) => { h.rotation.z = v; }));
          this.tween(0, 1, 1400, (v) => { pivR.rotation.y = -v * 1.25; pivL.rotation.y = v * 1.25; }, undefined, 260);
        },
        close: () => this.tween(1, 0, 1200, (v) => { pivR.rotation.y = -v * 1.25; pivL.rotation.y = v * 1.25; },
          () => [h1, h2].forEach((h) => this.tween(Math.PI / 2, 0, 240, (v) => { h.rotation.z = v; }))),
      });
    }
    if (p === 'win-sliding') {
      const sw = iw / 2 + 0.04;
      this.box(iw, 0.02, 0.07, this.body, 0, iy + 0.01, 0.02, g);
      const back = sash(sw, ih - 0.02, 0.045); back.position.set(ix, iy + 0.01, 0); g.add(back);
      const front = sash(sw, ih - 0.02, 0.045); front.position.set(ix + iw - sw, iy + 0.01, 0.045); g.add(front);
      const h = handle(front, 0.04, ih / 2, 0.026);
      this.hit.push(front, back);
      const x0 = front.position.x, x1 = ix + 0.02;
      this.moves.push({
        open: () => { this.tween(0, -Math.PI / 2, 240, (v) => { h.rotation.z = v; }); this.tween(x0, x1, 1500, (v) => { front.position.x = v; }, undefined, 240); },
        close: () => this.tween(front.position.x, x0, 1300, (v) => { front.position.x = v; }, () => this.tween(-Math.PI / 2, 0, 220, (v) => { h.rotation.z = v; })),
      });
    }
    if (p === 'win-tilt') {
      const piv = new THREE.Group(); piv.position.set(ix, iy, 0.02); g.add(piv);
      const s = sash(iw, ih); piv.add(s);
      const h = handle(s, iw - 0.05, ih / 2, 0.03);
      this.hit.push(s);
      this.moves.push({
        open: () => { this.tween(0, Math.PI, 300, (v) => { h.rotation.z = v; }); this.tween(0, 0.2, 1300, (v) => { piv.rotation.x = -v; }, undefined, 300); },
        close: () => this.tween(-piv.rotation.x, 0, 1100, (v) => { piv.rotation.x = -v; }, () => this.tween(Math.PI, 0, 260, (v) => { h.rotation.z = v; })),
      });
    }
    this.controls.target.set(0, SILL + OH / 2, 0);
  }

  /* ---------------- interaction ---------------- */
  toggle() {
    if (this.busy || !this.moves.length) return;
    const opening = !this.open; this.busy = true;
    this.onState?.({ open: opening, busy: true });
    this.moves.forEach((m) => (opening ? m.open() : m.close()));
    const settle = window.setInterval(() => {
      if (!this.tweens.length) { window.clearInterval(settle); this.busy = false; this.open = opening; this.onState?.({ open: opening, busy: false }); }
    }, 60);
  }

  view(v: View, dur = 1300) {
    const t = this.controls.target;
    const isWin = this.product.startsWith('win');
    const R = this.camera.position.distanceTo(t) || 5;
    const d = Math.max(isWin ? 4.2 : 3.6, Math.min(R, 5.8));
    const to = {
      front: new THREE.Vector3(t.x, t.y + 0.15, d),
      back: new THREE.Vector3(t.x, t.y + 0.15, -d),
      side: new THREE.Vector3(t.x + d * 0.92, t.y + 0.2, d * 0.38),
      angle: new THREE.Vector3(t.x + d * 0.62, t.y + 1.0, d * 0.78),
    }[v];
    const s0 = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(t));
    const s1 = new THREE.Spherical().setFromVector3(to.clone().sub(t));
    let dT = s1.theta - s0.theta; if (dT > Math.PI) dT -= Math.PI * 2; if (dT < -Math.PI) dT += Math.PI * 2;
    this.tween(0, 1, dur, (k) => {
      this.camera.position.copy(new THREE.Vector3().setFromSpherical(new THREE.Spherical(s0.radius + (s1.radius - s0.radius) * k, s0.phi + (s1.phi - s0.phi) * k, s0.theta + dT * k)).add(t));
    });
  }
  intro() { this.view('angle', 2200); }
  setAutoRotate(on: boolean) { this.controls.autoRotate = on; this.dirty = true; }
  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.fov = w / h < 0.8 ? 40 : 30;
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
        tw.set(tw.from + (tw.to - tw.from) * ease(k)); active = true;
        if (k >= 1) { tw.done?.(); return false; } return true;
      });
      const moved = this.controls.update();
      if (active || moved || this.dirty || this.controls.autoRotate) { this.renderer.render(this.scene, this.camera); this.dirty = false; }
    };
    this.raf = requestAnimationFrame(loop);
  }
  dispose() {
    this.running = false; cancelAnimationFrame(this.raf);
    this.canvas.removeEventListener('pointerdown', this.onDown); this.canvas.removeEventListener('pointerup', this.onUp); this.canvas.removeEventListener('pointermove', this.onMove);
    this.controls.dispose();
    this.scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); });
    this.texCache.forEach((t) => t.dispose()); this.renderer.dispose();
  }
}
