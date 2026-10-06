import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** 小島共用色票：柔和、偏暖，像午後陽光下的玩具。 */
export const C = {
  grass: 0x93d46c,
  grassDark: 0x79c057,
  sand: 0xf7e6b8,
  dirt: 0xc8996a,
  water: 0x8fd8e6,
  trunk: 0xa77852,
  leaf: 0x6dbf5a,
  leafLight: 0x92d872,
  cream: 0xfff5dc,
  wood: 0xd9a86c,
  woodDark: 0xa9784a,
  brown: 0x7a5a40,
  white: 0xffffff,
  pink: 0xf7a8b8,
  peach: 0xf8bc9c,
  yellow: 0xffd65c,
  orange: 0xf6a04d,
  red: 0xee6b5d,
  blue: 0x7cc4ef,
  navy: 0x4f73ad,
  mint: 0x8fdcc0,
  lilac: 0xc5b3ef,
  gray: 0xbfb9b0,
  stone: 0xd8d2c6,
  dark: 0x4a3a30,
  ink: 0x3b2a22,
  screen: 0x9fe3ff,
} as const;

const materials = new Map<string, THREE.Material>();
/** 同色共用材質；材質數量少，不隨場景釋放。 */
export function mat(color: number, opts: { emissive?: number; opacity?: number } = {}) {
  const key = `${color}-${opts.emissive ?? 0}-${opts.opacity ?? 1}`;
  let m = materials.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({
      color,
      emissive: opts.emissive ?? 0x000000,
      transparent: (opts.opacity ?? 1) < 1,
      opacity: opts.opacity ?? 1,
    });
    materials.set(key, m);
  }
  return m;
}
export function flatMat(color: number, opacity = 1) {
  const key = `flat-${color}-${opacity}`;
  let m = materials.get(key);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });
    materials.set(key, m);
  }
  return m;
}

export function mesh(geo: THREE.BufferGeometry, color: number | THREE.Material, shadow = true) {
  const m = new THREE.Mesh(geo, typeof color === "number" ? mat(color) : color);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}
export const sphere = (r: number, color: number, seg = 24) =>
  mesh(new THREE.SphereGeometry(r, seg, Math.max(8, Math.round(seg * 0.7))), color);
export const box = (w: number, h: number, d: number, color: number, r = 0.06) =>
  mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), color);
export const cyl = (rt: number, rb: number, h: number, color: number, seg = 24) =>
  mesh(new THREE.CylinderGeometry(rt, rb, h, seg), color);
export const capsule = (r: number, len: number, color: number) =>
  mesh(new THREE.CapsuleGeometry(r, len, 6, 14), color);
export const torus = (r: number, t: number, color: number, arc = Math.PI * 2) =>
  mesh(new THREE.TorusGeometry(r, t, 10, 28, arc), color);
export const cone = (r: number, h: number, color: number, seg = 18) =>
  mesh(new THREE.ConeGeometry(r, h, seg), color);

export function place<T extends THREE.Object3D>(o: T, x: number, y: number, z: number, parent?: THREE.Object3D) {
  o.position.set(x, y, z);
  parent?.add(o);
  return o;
}

export function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function tree(parent: THREE.Object3D, x: number, z: number, scale = 1) {
  const g = new THREE.Group();
  place(cyl(0.11, 0.16, 0.8, C.trunk, 10), 0, 0.4, 0, g);
  place(sphere(0.62, C.leaf, 18), 0, 1.15, 0, g);
  place(sphere(0.46, C.leafLight, 16), 0.28, 1.45, 0.18, g);
  place(sphere(0.42, C.leaf, 16), -0.3, 1.35, -0.12, g);
  g.scale.setScalar(scale);
  return place(g, x, 0, z, parent);
}

export function flower(parent: THREE.Object3D, x: number, z: number, color: number) {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    place(sphere(0.045, color, 8), Math.cos(a) * 0.055, 0.1, Math.sin(a) * 0.055, g);
  }
  place(sphere(0.04, C.yellow, 8), 0, 0.11, 0, g);
  g.traverse(o => (o.castShadow = false));
  return place(g, x, 0, z, parent);
}

/** 浮在水面的圓形小島。草地頂面在 y = 0。 */
export function island(parent: THREE.Object3D, seed = 3, keepClear: (x: number, z: number) => boolean = () => false) {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.7, 0.36, 56), [mat(C.grassDark), mat(C.grass), mat(C.grass)]);
  top.position.y = -0.18;
  top.receiveShadow = true;
  g.add(top);
  const sand = mesh(new THREE.CylinderGeometry(5.15, 5.3, 0.3, 56), C.sand);
  sand.position.y = -0.3;
  sand.castShadow = false;
  g.add(sand);
  const dirt = mesh(new THREE.CylinderGeometry(5.3, 4.2, 1.1, 40), C.dirt);
  dirt.position.y = -1.0;
  dirt.castShadow = false;
  g.add(dirt);
  const water = new THREE.Mesh(new THREE.CircleGeometry(16, 48), flatMat(C.water));
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.42;
  g.add(water);
  const rnd = seeded(seed);
  const colors = [C.pink, C.white, C.yellow, C.lilac];
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 1.2 + rnd() * 3.2;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (keepClear(x, z)) continue;
    if (i % 3 === 0) flower(g, x, z, colors[i % colors.length]);
    else {
      const tuft = cone(0.06, 0.16, C.grassDark, 6);
      tuft.castShadow = false;
      place(tuft, x, 0.07, z, g);
    }
  }
  parent.add(g);
  return g;
}

/* ---------- 表情泡泡 ---------- */
export type Icon =
  | "!" | "?" | "note" | "dots" | "sweat" | "anger" | "heart" | "sparkle"
  | "bulb" | "zzz" | "gloom" | "pause" | "think" | "star";

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function star(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, r: number) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 ? r : R;
    g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath();
}

export function iconTexture(kind: Icon) {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  // 白色圓泡加小尾巴
  g.fillStyle = "rgba(122,90,64,.18)";
  g.beginPath();
  g.arc(64, 60, 50, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fffaf0";
  g.beginPath();
  g.arc(64, 56, 48, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(52, 98);
  g.lineTo(64, 120);
  g.lineTo(72, 98);
  g.fill();
  const brown = "#7a5a40";
  g.lineCap = "round";
  g.lineJoin = "round";
  const text = (t: string, color: string, size = 64) => {
    g.fillStyle = color;
    g.font = `900 ${size}px "Huninn", "Arial Rounded MT Bold", sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(t, 64, 60);
  };
  switch (kind) {
    case "!": text("!", "#ef6f5e", 72); break;
    case "?": text("?", "#5aa6d6", 70); break;
    case "note": text("♪", "#f08aa5", 66); break;
    case "dots": text("…", brown, 64); break;
    case "zzz": text("Zz", "#7c8fd6", 52); break;
    case "sweat":
      g.fillStyle = "#79c6ef";
      g.beginPath();
      g.moveTo(64, 22);
      g.bezierCurveTo(90, 56, 88, 84, 64, 86);
      g.bezierCurveTo(40, 84, 38, 56, 64, 22);
      g.fill();
      break;
    case "anger":
      g.strokeStyle = "#ef5e5e";
      g.lineWidth = 10;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        g.beginPath();
        g.arc(64 + sx * 26, 56 + sy * 26, 16, 0, Math.PI * 2);
        g.stroke();
      });
      g.fillStyle = "#fffaf0";
      g.fillRect(48, 40, 32, 32);
      break;
    case "heart":
      g.fillStyle = "#f2708d";
      g.beginPath();
      g.moveTo(64, 88);
      g.bezierCurveTo(20, 60, 34, 22, 64, 42);
      g.bezierCurveTo(94, 22, 108, 60, 64, 88);
      g.fill();
      break;
    case "sparkle":
    case "star":
      g.fillStyle = "#ffc93c";
      star(g, 64, 58, 36, 15);
      g.fill();
      if (kind === "sparkle") {
        g.fillStyle = "#ffe08a";
        star(g, 96, 30, 12, 5);
        g.fill();
      }
      break;
    case "bulb":
      g.fillStyle = "#ffd447";
      g.beginPath();
      g.arc(64, 50, 26, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#b9a48a";
      roundRect(g, 52, 74, 24, 14, 4);
      g.fill();
      break;
    case "gloom":
      g.fillStyle = "#9aa7b5";
      g.beginPath();
      g.arc(48, 60, 18, 0, Math.PI * 2);
      g.arc(68, 50, 22, 0, Math.PI * 2);
      g.arc(86, 62, 16, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#7f93a8";
      g.lineWidth = 5;
      [50, 66, 82].forEach(x => {
        g.beginPath();
        g.moveTo(x, 80);
        g.lineTo(x - 4, 92);
        g.stroke();
      });
      break;
    case "pause":
      g.fillStyle = "#6cbf7c";
      roundRect(g, 42, 32, 15, 50, 6);
      g.fill();
      roundRect(g, 71, 32, 15, 50, 6);
      g.fill();
      break;
    case "think":
      g.fillStyle = brown;
      [44, 64, 84].forEach(x => {
        g.beginPath();
        g.arc(x, 58, 7, 0, Math.PI * 2);
        g.fill();
      });
      break;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function shadowBlob(size = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(60,80,40,.32)");
  grd.addColorStop(1, "rgba(60,80,40,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.01;
  return m;
}

/** 共用材質不隨單一場景釋放。 */
export function isSharedMaterial(m: THREE.Material) {
  return Array.from(materials.values()).includes(m);
}
