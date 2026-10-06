import * as THREE from "three";
import { C, box, capsule, cone, cyl, flatMat, flower, mesh, place, sphere, torus } from "./kit";

export type PropKind =
  | "sink" | "toothbrush" | "stove" | "cottage" | "desk" | "papers" | "chair" | "bench"
  | "train" | "rails" | "lemon" | "lemons" | "table" | "mug" | "houseModel" | "stage" | "bar"
  | "stool" | "car" | "mailbox" | "letters" | "bed" | "nightstand" | "net" | "racket" | "ball"
  | "stones" | "phone" | "badges" | "alarm" | "sprout" | "bloom" | "can" | "sign" | "notebook"
  | "reception" | "vending" | "bike" | "coin" | "road" | "dirt" | "tiles" | "newFlowers"
  | "pool" | "goggles" | "medal" | "shelf" | "treat" | "dumbbell" | "hammock" | "tub" | "sauna"
  | "laptop" | "blockSmall" | "blockBig" | "board" | "scale" | "seesaw" | "keys" | "book"
  | "stars" | "lamp" | "hoop" | "fence";

export type PropInfo = {
  /** 拿在手上時的位置與角度（相對手掌）。 */
  hold?: { pos: [number, number, number]; rot: [number, number, number] };
  /** 坐、躺、騎時角色站立點（相對道具）。 */
  seat?: [number, number, number];
  /** 坐上去時面向的角度（相對道具），例如車頭朝 +x。 */
  seatTurn?: number;
  parts?: THREE.Object3D[];
  mats?: THREE.MeshLambertMaterial[];
};

function own(color: number, emissive = 0x000000) {
  return new THREE.MeshLambertMaterial({ color, emissive });
}

export function labelTexture(text: string, bg = "#fff6df", fg = "#7a5a40") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = fg;
  const size = text.length > 6 ? 66 : 88;
  g.font = `700 ${size}px "Huninn", "PingFang TC", "Microsoft JhengHei", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text, 256, 132);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildProp(kind: PropKind, label?: string): THREE.Group & { userData: PropInfo } {
  const g = new THREE.Group() as THREE.Group & { userData: PropInfo };
  g.userData = {};
  const P = (o: THREE.Object3D, x: number, y: number, z: number) => place(o, x, y, z, g);
  switch (kind) {
    case "sink": {
      P(cyl(0.12, 0.17, 0.72, C.white), 0, 0.36, 0);
      P(box(0.72, 0.18, 0.46, C.white, 0.08), 0, 0.8, 0);
      P(cyl(0.16, 0.16, 0.03, C.screen), 0, 0.9, 0.02);
      P(cyl(0.025, 0.025, 0.16, C.gray, 8), 0, 0.97, -0.16);
      P(box(0.6, 0.72, 0.05, C.wood), 0, 1.5, -0.22);
      P(box(0.5, 0.6, 0.03, 0xd7f2fb), 0, 1.5, -0.19);
      break;
    }
    case "toothbrush": {
      P(capsule(0.025, 0.26, C.blue), 0, 0.15, 0);
      P(box(0.05, 0.07, 0.07, C.white, 0.01), 0, 0.3, 0.03);
      g.userData.hold = { pos: [0, 0.02, 0.06], rot: [0.2, 0, 0] };
      break;
    }
    case "stove": {
      P(box(0.85, 0.78, 0.6, C.white), 0, 0.39, 0);
      P(cyl(0.13, 0.13, 0.02, C.dark), -0.2, 0.79, 0);
      P(cyl(0.13, 0.13, 0.02, C.dark), 0.2, 0.79, 0);
      P(cyl(0.17, 0.15, 0.22, C.red), 0.2, 0.92, 0);
      P(cyl(0.18, 0.18, 0.03, C.red), 0.2, 1.04, 0);
      P(box(0.3, 0.06, 0.04, C.gray), 0, 0.6, 0.31);
      break;
    }
    case "cottage": {
      P(box(1.7, 1.25, 1.4, C.cream, 0.08), 0, 0.62, 0);
      const roof = P(cone(1.35, 0.85, C.red, 4), 0, 1.66, 0);
      roof.rotation.y = Math.PI / 4;
      P(box(0.45, 0.78, 0.06, C.woodDark), 0.35, 0.4, 0.71);
      P(sphere(0.035, C.yellow, 8), 0.48, 0.42, 0.75);
      P(box(0.38, 0.34, 0.05, 0xbfe9f7), -0.42, 0.75, 0.71);
      P(cyl(0.12, 0.12, 0.35, C.brown, 10), 0.45, 1.85, -0.2);
      break;
    }
    case "desk": {
      P(box(1.25, 0.08, 0.62, C.wood), 0, 0.64, 0);
      [[-0.55, -0.24], [0.55, -0.24], [-0.55, 0.24], [0.55, 0.24]].forEach(([x, z]) =>
        P(cyl(0.035, 0.035, 0.62, C.woodDark, 8), x, 0.31, z)
      );
      break;
    }
    case "papers": {
      for (let i = 0; i < 4; i++) {
        const p = P(box(0.32, 0.015, 0.42, C.white, 0.004), (i % 2) * 0.03, 0.01 + i * 0.016, 0);
        p.rotation.y = (i - 1.5) * 0.12;
      }
      P(capsule(0.012, 0.18, C.yellow), 0.25, 0.08, 0.05).rotation.z = Math.PI / 2;
      break;
    }
    case "chair": {
      P(box(0.46, 0.08, 0.46, C.wood), 0, 0.42, 0);
      P(box(0.46, 0.5, 0.06, C.wood), 0, 0.7, -0.2);
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([x, z]) =>
        P(cyl(0.03, 0.03, 0.4, C.woodDark, 8), x, 0.2, z)
      );
      g.userData.seat = [0, 0.46, 0.02];
      break;
    }
    case "bench": {
      P(box(1.5, 0.1, 0.46, C.wood), 0, 0.44, 0);
      P(box(1.5, 0.12, 0.06, C.wood), 0, 0.72, -0.2);
      P(box(1.5, 0.12, 0.06, C.wood), 0, 0.92, -0.2);
      [-0.62, 0.62].forEach(x => {
        P(box(0.1, 0.44, 0.4, C.stone), x, 0.22, 0);
        P(box(0.06, 0.5, 0.06, C.woodDark), x, 0.72, -0.2);
      });
      g.userData.seat = [0, 0.48, 0.02];
      break;
    }
    case "rails": {
      [-0.32, 0.32].forEach(z => P(box(3.6, 0.05, 0.08, C.gray, 0.02), 0, 0.03, z));
      for (let i = -8; i <= 8; i++) P(box(0.12, 0.03, 0.9, C.woodDark, 0.01), i * 0.22, 0.01, 0);
      break;
    }
    case "train": {
      P(box(1.9, 0.95, 0.85, C.blue, 0.22), 0, 0.68, 0);
      P(box(1.95, 0.12, 0.9, C.white, 0.05), 0, 1.2, 0);
      [-0.55, 0, 0.55].forEach(x => {
        P(box(0.38, 0.32, 0.04, 0xd9f3fb, 0.05), x, 0.8, 0.43);
        P(box(0.38, 0.32, 0.04, 0xd9f3fb, 0.05), x, 0.8, -0.43);
      });
      P(box(0.04, 0.32, 0.5, 0xd9f3fb, 0.03), 0.96, 0.82, 0);
      [-0.6, 0.6].forEach(x =>
        [-0.36, 0.36].forEach(z => {
          const w = P(cyl(0.14, 0.14, 0.08, C.dark, 16), x, 0.18, z);
          w.rotation.x = Math.PI / 2;
        })
      );
      P(sphere(0.06, C.yellow, 10), 0.97, 0.5, 0.25);
      P(sphere(0.06, C.yellow, 10), 0.97, 0.5, -0.25);
      break;
    }
    case "lemon": {
      const l = P(sphere(0.13, C.yellow, 18), 0, 0.12, 0);
      l.scale.set(1.25, 1, 1);
      P(sphere(0.03, 0xf3c13a, 8), 0.16, 0.12, 0);
      P(sphere(0.03, 0xf3c13a, 8), -0.16, 0.12, 0);
      const leaf = P(sphere(0.06, C.leaf, 8), -0.06, 0.24, 0);
      leaf.scale.set(1.5, 0.4, 0.8);
      g.userData.hold = { pos: [0, -0.04, 0.08], rot: [0, 0, 0] };
      break;
    }
    case "lemons": {
      P(cyl(0.3, 0.26, 0.05, C.white), 0, 0.03, 0);
      [[-0.1, 0.02], [0.1, -0.04], [0, 0.12]].forEach(([x, z], i) => {
        const l = P(sphere(0.1, C.yellow, 14), x, 0.13 + (i === 2 ? 0.05 : 0), z);
        l.scale.set(1.25, 1, 1);
      });
      break;
    }
    case "table": {
      P(cyl(0.58, 0.58, 0.07, C.wood, 28), 0, 0.64, 0);
      P(cyl(0.06, 0.06, 0.62, C.woodDark, 10), 0, 0.32, 0);
      P(cyl(0.26, 0.3, 0.04, C.woodDark, 18), 0, 0.02, 0);
      break;
    }
    case "mug": {
      P(cyl(0.075, 0.065, 0.15, C.white, 14), 0, 0.075, 0);
      P(cyl(0.065, 0.065, 0.01, 0x8a5a3a, 14), 0, 0.15, 0);
      const h = P(torus(0.045, 0.015, C.white), 0.08, 0.08, 0);
      h.rotation.y = Math.PI / 2;
      break;
    }
    case "houseModel": {
      P(box(0.32, 0.03, 0.32, C.white, 0.01), 0, 0.015, 0);
      P(box(0.2, 0.18, 0.2, 0xb9e3f5, 0.02), 0, 0.12, 0);
      const r = P(cone(0.17, 0.14, C.navy, 4), 0, 0.28, 0);
      r.rotation.y = Math.PI / 4;
      g.userData.hold = { pos: [0, 0.03, 0.14], rot: [0, 0, 0] };
      break;
    }
    case "stage": {
      P(cyl(1.0, 1.06, 0.12, C.pink, 32), 0, 0.06, 0);
      P(cyl(0.86, 0.86, 0.01, 0xfcd2dc, 32), 0, 0.125, 0);
      const beam = new THREE.Mesh(new THREE.ConeGeometry(0.95, 3.2, 28, 1, true), flatMat(C.yellow, 0.18));
      P(beam, 0, 1.7, 0);
      break;
    }
    case "bar": {
      P(box(1.8, 0.95, 0.55, C.woodDark, 0.06), 0, 0.48, 0);
      P(box(1.95, 0.08, 0.68, C.wood, 0.04), 0, 0.98, 0);
      [-0.5, 0.1, 0.6].forEach((x, i) => {
        P(cyl(0.05, 0.06, 0.24, [C.mint, C.yellow, C.pink][i], 10), x, 1.14, 0);
      });
      break;
    }
    case "stool": {
      P(cyl(0.22, 0.22, 0.08, C.red, 18), 0, 0.62, 0);
      P(cyl(0.04, 0.04, 0.6, C.gray, 8), 0, 0.3, 0);
      P(cyl(0.18, 0.2, 0.03, C.gray, 14), 0, 0.02, 0);
      g.userData.seat = [0, 0.66, 0];
      break;
    }
    case "car": {
      P(box(1.4, 0.46, 0.8, 0x3f7fd6, 0.2), 0, 0.42, 0);
      P(box(0.8, 0.4, 0.72, 0xbfe6f7, 0.16), -0.08, 0.78, 0);
      P(box(0.84, 0.06, 0.74, 0x3f7fd6, 0.03), -0.08, 0.99, 0);
      [-0.45, 0.45].forEach(x =>
        [-0.4, 0.4].forEach(z => {
          const w = P(cyl(0.17, 0.17, 0.1, C.dark, 16), x, 0.18, z);
          w.rotation.x = Math.PI / 2;
          const hub = P(cyl(0.07, 0.07, 0.11, C.gray, 10), x, 0.18, z);
          hub.rotation.x = Math.PI / 2;
        })
      );
      P(sphere(0.07, C.yellow, 10), 0.7, 0.45, 0.26);
      P(sphere(0.07, C.yellow, 10), 0.7, 0.45, -0.26);
      g.userData.seat = [-0.15, 0.28, 0];
      g.userData.seatTurn = Math.PI / 2;
      break;
    }
    case "mailbox": {
      P(cyl(0.05, 0.05, 0.85, C.woodDark, 8), 0, 0.42, 0);
      P(box(0.36, 0.3, 0.48, C.red, 0.12), 0, 0.98, 0);
      P(box(0.04, 0.2, 0.06, C.yellow, 0.01), 0.2, 1.08, -0.1);
      break;
    }
    case "letters": {
      for (let i = 0; i < 11; i++) {
        const e = P(box(0.34, 0.025, 0.22, i % 2 ? C.white : 0xfff1d6, 0.01), (i % 3 - 1) * 0.03, 0.015 + i * 0.03, (i % 2) * 0.02);
        e.rotation.y = (i % 4 - 1.5) * 0.18;
      }
      g.userData.parts = g.children.slice();
      break;
    }
    case "bed": {
      P(box(1.05, 0.3, 2.0, C.wood, 0.06), 0, 0.17, 0);
      P(box(1.08, 0.7, 0.1, C.wood, 0.05), 0, 0.42, -0.98);
      P(box(0.96, 0.16, 1.88, C.white, 0.07), 0, 0.4, 0);
      P(box(0.62, 0.14, 0.32, C.cream, 0.07), 0, 0.54, -0.68);
      P(box(1.0, 0.08, 1.05, 0x9fd0f2, 0.04), 0, 0.5, 0.38);
      g.userData.seat = [0, 0.48, -0.1];
      break;
    }
    case "nightstand": {
      P(box(0.45, 0.5, 0.4, C.wood, 0.05), 0, 0.25, 0);
      P(cyl(0.05, 0.08, 0.06, C.gray, 10), 0, 0.53, 0);
      P(cyl(0.02, 0.02, 0.22, C.gray, 6), 0, 0.66, 0);
      P(cone(0.14, 0.16, C.cream, 16), 0, 0.82, 0);
      break;
    }
    case "net": {
      [-1.3, 1.3].forEach(z => P(cyl(0.04, 0.04, 1.0, C.white, 8), 0, 0.5, z));
      P(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.45, 2.6), flatMat(C.white, 0.55)), 0, 0.72, 0);
      P(box(0.04, 0.05, 2.62, C.white, 0.01), 0, 0.96, 0);
      P(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.005, 0.05), flatMat(C.white, 0.8)), 0, 0.005, 1.3);
      P(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.005, 0.05), flatMat(C.white, 0.8)), 0, 0.005, -1.3);
      break;
    }
    case "racket": {
      P(capsule(0.028, 0.22, C.dark), 0, 0.12, 0);
      P(torus(0.15, 0.022, C.red), 0, 0.42, 0);
      P(new THREE.Mesh(new THREE.CircleGeometry(0.14, 20), flatMat(C.white, 0.5)), 0, 0.42, 0);
      g.userData.hold = { pos: [0, 0, 0.05], rot: [0.2, 0, 0] };
      break;
    }
    case "ball":
      P(sphere(0.075, 0xd9ef4a, 12), 0, 0, 0);
      break;
    case "stones": {
      const mats: THREE.MeshLambertMaterial[] = [];
      for (let i = 0; i < 7; i++) {
        const m = own(C.stone);
        mats.push(m);
        const st = mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.08, 18), m);
        P(st, -2.4 + i * 0.8, 0.04, Math.sin(i * 0.9) * 0.25);
      }
      g.userData.mats = mats;
      break;
    }
    case "phone": {
      P(box(0.13, 0.24, 0.025, C.dark, 0.02), 0, 0, 0);
      P(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.2, 0.004), flatMat(C.screen)), 0, 0, 0.014);
      g.userData.hold = { pos: [0.02, 0.02, 0.1], rot: [-0.9, 0, 0] };
      break;
    }
    case "badges": {
      for (let i = 0; i < 5; i++) {
        const b = new THREE.Group();
        place(cyl(0.11, 0.11, 0.04, C.red, 16), 0, 0, 0, b).rotation.x = Math.PI / 2;
        place(new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), flatMat(C.white)), 0, 0, 0.025, b);
        P(b, (i - 2) * 0.28, 1.9 + (i % 2) * 0.2, 0.2);
      }
      g.userData.parts = g.children.slice();
      break;
    }
    case "alarm": {
      P(sphere(0.16, C.red, 16), 0, 0.2, 0).scale.set(1, 1, 0.7);
      P(new THREE.Mesh(new THREE.CircleGeometry(0.12, 18), flatMat(C.white)), 0, 0.2, 0.115);
      P(sphere(0.06, C.yellow, 8), -0.1, 0.36, 0);
      P(sphere(0.06, C.yellow, 8), 0.1, 0.36, 0);
      P(capsule(0.02, 0.05, C.dark), -0.08, 0.04, 0);
      P(capsule(0.02, 0.05, C.dark), 0.08, 0.04, 0);
      break;
    }
    case "sprout": {
      P(cyl(0.18, 0.15, 0.16, C.dirt, 16), 0, 0.08, 0);
      P(capsule(0.02, 0.14, C.leaf), 0, 0.26, 0);
      const l1 = P(sphere(0.07, C.leafLight, 10), -0.07, 0.36, 0);
      l1.scale.set(1.4, 0.5, 0.8);
      const l2 = P(sphere(0.07, C.leafLight, 10), 0.07, 0.38, 0);
      l2.scale.set(1.4, 0.5, 0.8);
      break;
    }
    case "bloom": {
      P(cyl(0.18, 0.15, 0.16, C.dirt, 16), 0, 0.08, 0);
      P(capsule(0.025, 0.42, C.leaf), 0, 0.4, 0);
      [-1, 1].forEach(s => P(sphere(0.08, C.leafLight, 10), s * 0.09, 0.36, 0).scale.set(1.5, 0.5, 0.8));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        P(sphere(0.085, C.pink, 10), Math.cos(a) * 0.11, 0.72 + Math.sin(a) * 0.11, 0.02);
      }
      P(sphere(0.08, C.yellow, 10), 0, 0.72, 0.05);
      break;
    }
    case "can": {
      P(cyl(0.12, 0.13, 0.2, C.mint, 14), 0, 0, 0);
      const spout = P(capsule(0.025, 0.2, C.mint), 0, 0.02, 0.18);
      spout.rotation.x = 1.0;
      P(torus(0.08, 0.02, C.mint, Math.PI), 0, 0.12, -0.02).rotation.y = Math.PI / 2;
      g.userData.hold = { pos: [0, -0.06, 0.1], rot: [0, 0, 0] };
      break;
    }
    case "sign": {
      P(cyl(0.04, 0.04, 1.0, C.woodDark, 8), 0, 0.5, 0);
      P(box(1.1, 0.5, 0.06, C.wood, 0.05), 0, 1.05, 0);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.42), new THREE.MeshBasicMaterial({ map: labelTexture(label ?? "") }));
      P(face, 0, 1.05, 0.035);
      break;
    }
    case "notebook": {
      P(box(0.3, 0.04, 0.38, C.lilac, 0.01), 0, 0.02, 0);
      P(box(0.27, 0.03, 0.35, C.white, 0.005), 0, 0.045, 0);
      g.userData.hold = { pos: [0, -0.04, 0.1], rot: [-1.2, 0, 0] };
      break;
    }
    case "reception": {
      P(box(1.7, 0.95, 0.6, C.cream, 0.08), 0, 0.48, 0);
      P(box(1.8, 0.07, 0.7, C.wood, 0.03), 0, 0.98, 0);
      P(cyl(0.07, 0.09, 0.06, C.yellow, 12), 0.5, 1.05, 0.1);
      P(box(0.35, 0.22, 0.04, C.dark, 0.02), -0.4, 1.13, -0.1);
      break;
    }
    case "vending": {
      P(box(0.85, 1.7, 0.6, C.red, 0.1), 0, 0.85, 0);
      P(box(0.58, 0.85, 0.04, 0xd9f3fb, 0.03), -0.08, 1.12, 0.3);
      [0, 1, 2].forEach(r =>
        [0, 1, 2].forEach(c => P(cyl(0.045, 0.045, 0.18, [C.blue, C.mint, C.yellow][c], 8), -0.28 + c * 0.2, 0.86 + r * 0.26, 0.24))
      );
      P(box(0.14, 0.3, 0.04, C.gray, 0.02), 0.3, 1.0, 0.31);
      P(box(0.5, 0.14, 0.04, C.dark, 0.03), -0.08, 0.42, 0.31);
      break;
    }
    case "bike": {
      P(torus(0.3, 0.05, C.dark), 0.45, 0.32, 0).rotation.y = 0;
      P(box(0.9, 0.1, 0.12, C.gray, 0.03), 0, 0.45, 0).rotation.z = -0.2;
      P(cyl(0.04, 0.04, 0.5, C.gray, 8), -0.3, 0.55, 0);
      P(box(0.3, 0.08, 0.22, C.dark, 0.04), -0.32, 0.82, 0);
      P(cyl(0.04, 0.04, 0.5, C.gray, 8), 0.42, 0.75, 0);
      P(box(0.08, 0.06, 0.5, C.dark, 0.02), 0.42, 1.0, 0);
      P(box(1.0, 0.06, 0.4, C.gray, 0.02), 0, 0.03, 0);
      g.userData.seat = [-0.32, 0.56, 0];
      g.userData.seatTurn = Math.PI / 2;
      break;
    }
    case "coin": {
      const c = P(cyl(0.09, 0.09, 0.025, C.yellow, 18), 0, 0, 0);
      c.rotation.x = Math.PI / 2;
      g.userData.hold = { pos: [0, -0.02, 0.08], rot: [0, 0, 0] };
      break;
    }
    case "road": {
      for (let i = 0; i < 5; i++) P(box(0.9, 0.06, 0.62, C.stone, 0.04), 0, 0.03, -i * 0.66);
      [-1, 1].forEach(s => {
        [0, 2].forEach(i => {
          P(cyl(0.035, 0.045, 1.4, C.dark, 8), s * 0.62, 0.7, -i * 0.66 - 0.3);
          P(sphere(0.1, 0xfff2b0, 10), s * 0.62, 1.45, -i * 0.66 - 0.3);
        });
        P(box(0.24, 0.12, 2.6, C.woodDark, 0.03), s * 0.68, 0.06, -1.6);
        for (let k = 0; k < 6; k++) flower(g, s * 0.68, -0.5 - k * 0.44, [C.pink, C.yellow, C.lilac][k % 3]).position.y = 0.1;
      });
      break;
    }
    case "dirt": {
      for (let i = 0; i < 5; i++) {
        const d = P(cyl(0.34, 0.36, 0.02, 0xb98d5f, 16), (i % 2) * 0.08, 0.01, -i * 0.62);
        d.scale.set(1.2, 1, 0.9);
        d.castShadow = false;
      }
      break;
    }
    case "tiles": {
      for (let i = 0; i < 5; i++) P(box(0.62, 0.06, 0.5, C.stone, 0.04), (i % 2) * 0.08, 0.04, -i * 0.62);
      g.userData.parts = g.children.slice();
      break;
    }
    case "newFlowers": {
      for (let i = 0; i < 6; i++) flower(g, (i % 2 ? 1 : -1) * 0.5, -i * 0.5, [C.pink, C.yellow, C.white][i % 3]);
      g.userData.parts = g.children.slice();
      break;
    }
    case "pool": {
      P(box(3.6, 0.36, 1.9, C.white, 0.08), 0, 0.12, 0);
      P(box(3.3, 0.06, 1.6, 0x6fcbe4, 0.03), 0, 0.29, 0);
      [-0.3, 0.3].forEach(z => {
        for (let i = 0; i < 16; i++) P(sphere(0.035, i % 2 ? C.red : C.white, 6), -1.6 + i * 0.213, 0.33, z);
      });
      break;
    }
    case "goggles": {
      [-0.07, 0.07].forEach(x => P(torus(0.05, 0.018, C.dark), x, 0, 0));
      P(new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), flatMat(0x9fd8ff, 0.8)), -0.07, 0, 0.005);
      P(new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), flatMat(0x9fd8ff, 0.8)), 0.07, 0, 0.005);
      g.userData.hold = { pos: [0, 0.02, 0.1], rot: [-0.3, 0, 0] };
      break;
    }
    case "medal": {
      P(box(0.08, 0.2, 0.02, C.red, 0.01), 0, 0.1, 0);
      const d = P(cyl(0.1, 0.1, 0.03, C.yellow, 18), 0, -0.04, 0);
      d.rotation.x = Math.PI / 2;
      g.userData.hold = { pos: [0, 0.05, 0.08], rot: [0, 0, 0] };
      break;
    }
    case "shelf": {
      P(box(1.3, 0.8, 0.5, C.white, 0.06), 0, 0.4, 0);
      P(box(1.34, 0.06, 0.54, C.wood, 0.03), 0, 0.82, 0);
      P(cyl(0.12, 0.14, 0.26, C.gray, 14), -0.4, 0.98, 0);
      P(capsule(0.03, 0.1, C.gray), -0.25, 1.02, 0).rotation.z = 1.0;
      P(cyl(0.07, 0.06, 0.18, C.mint, 12), 0.05, 0.94, 0);
      P(capsule(0.018, 0.2, C.blue), 0.07, 1.08, 0).rotation.z = 0.2;
      P(cyl(0.07, 0.07, 0.17, C.orange, 12), 0.38, 0.94, 0);
      P(cyl(0.075, 0.075, 0.05, C.white, 12), 0.38, 1.05, 0);
      break;
    }
    case "treat": {
      P(capsule(0.03, 0.12, C.cream), 0, 0, 0).rotation.z = Math.PI / 2;
      [-1, 1].forEach(s => {
        P(sphere(0.035, C.cream, 8), s * 0.09, 0.025, 0);
        P(sphere(0.035, C.cream, 8), s * 0.09, -0.025, 0);
      });
      g.userData.hold = { pos: [0, -0.02, 0.08], rot: [0, 0, 0] };
      break;
    }
    case "dumbbell": {
      P(cyl(0.025, 0.025, 0.5, C.gray, 8), 0, 0, 0).rotation.z = Math.PI / 2;
      [-0.22, 0.22].forEach(x => P(cyl(0.11, 0.11, 0.09, C.dark, 14), x, 0, 0).rotation.z = Math.PI / 2);
      g.userData.hold = { pos: [0, -0.02, 0], rot: [0, Math.PI / 2, 0] };
      break;
    }
    case "hammock": {
      [-1.1, 1.1].forEach(x => P(cyl(0.07, 0.09, 1.3, C.trunk, 10), x, 0.65, 0));
      const cloth = P(sphere(1, 0xf6c25a, 24), 0, 0.62, 0);
      cloth.scale.set(1.05, 0.16, 0.42);
      g.userData.seat = [0.1, 0.48, 0];
      g.userData.seatTurn = Math.PI / 2;
      break;
    }
    case "tub": {
      P(cyl(0.48, 0.42, 0.55, C.woodDark, 20), 0, 0.27, 0);
      P(cyl(0.43, 0.43, 0.02, 0xb9ecf7, 20), 0, 0.5, 0);
      [[0.1, 0.1], [-0.15, 0], [0.05, -0.18]].forEach(([x, z]) => P(box(0.1, 0.1, 0.1, 0xeaf9ff, 0.02), x, 0.54, z));
      break;
    }
    case "sauna": {
      P(box(1.3, 1.1, 1.1, C.woodDark, 0.08), 0, 0.55, 0);
      const roof = P(cone(1.05, 0.6, C.wood, 4), 0, 1.38, 0);
      roof.rotation.y = Math.PI / 4;
      P(box(0.4, 0.7, 0.05, C.wood), 0, 0.35, 0.56);
      for (let i = 0; i < 3; i++) P(new THREE.Mesh(new THREE.SphereGeometry(0.16 + i * 0.04, 12, 8), flatMat(C.white, 0.7)), 0.3 - i * 0.1, 1.75 + i * 0.28, 0);
      g.userData.parts = g.children.slice(-3);
      break;
    }
    case "laptop": {
      P(box(0.5, 0.03, 0.34, C.gray, 0.015), 0, 0.015, 0);
      const lid = new THREE.Group();
      place(box(0.5, 0.34, 0.025, C.gray, 0.015), 0, 0.17, 0, lid);
      place(new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.28), flatMat(C.screen)), 0, 0.17, 0.014, lid);
      const env = new THREE.Group();
      place(new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.11), flatMat(C.white)), 0, 0, 0, env);
      place(new THREE.Mesh(new THREE.CircleGeometry(0.03, 10), flatMat(C.red)), 0, -0.01, 0.002, env);
      place(env, 0, 0.17, 0.016, lid);
      P(lid, 0, 0.03, -0.16);
      lid.rotation.x = -0.25;
      break;
    }
    case "blockSmall": {
      P(box(0.22, 0.22, 0.22, C.yellow, 0.04), 0, 0.11, 0);
      break;
    }
    case "blockBig": {
      P(box(0.42, 0.42, 0.42, C.mint, 0.06), 0, 0.21, 0);
      P(box(0.44, 0.08, 0.44, C.blue, 0.02), 0, 0.3, 0);
      P(box(0.44, 0.08, 0.44, C.pink, 0.02), 0, 0.14, 0);
      break;
    }
    case "board": {
      [-0.6, 0.6].forEach(x => P(cyl(0.035, 0.035, 1.6, C.woodDark, 8), x, 0.8, 0));
      P(box(1.4, 0.85, 0.05, 0x5f8f6a, 0.04), 0, 1.15, 0);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.7), new THREE.MeshBasicMaterial({ map: labelTexture(label ?? "", "#5f8f6a", "#ffffff") }));
      P(face, 0, 1.15, 0.03);
      break;
    }
    case "scale": {
      P(box(0.5, 0.08, 0.5, C.white, 0.05), 0, 0.04, 0);
      P(new THREE.Mesh(new THREE.CircleGeometry(0.1, 18), flatMat(0xffe6a8)), 0, 0.082, 0.12).rotation.x = -Math.PI / 2;
      g.userData.seat = [0, 0.08, -0.05];
      break;
    }
    case "seesaw": {
      const pivot = P(cone(0.32, 0.55, C.wood, 4), 0, 0.27, 0);
      pivot.rotation.y = Math.PI / 4;
      const plank = new THREE.Group();
      place(box(2.6, 0.09, 0.38, C.mint, 0.04), 0, 0, 0, plank);
      place(sphere(0.22, C.orange, 16), -1.05, 0.26, 0, plank);
      place(sphere(0.18, C.yellow, 16), 1.05, 0.22, 0, plank);
      P(plank, 0, 0.58, 0);
      g.userData.parts = [plank];
      break;
    }
    case "keys": {
      P(torus(0.05, 0.012, C.yellow), 0, 0.01, 0).rotation.x = Math.PI / 2;
      P(box(0.04, 0.012, 0.14, C.yellow, 0.005), 0.05, 0.01, 0.07);
      P(box(0.04, 0.012, 0.12, C.gray, 0.005), -0.04, 0.01, 0.07);
      break;
    }
    case "book": {
      [-1, 1].forEach(s => {
        const page = P(box(0.2, 0.02, 0.28, C.white, 0.005), s * 0.1, 0.02, 0);
        page.rotation.z = -s * 0.15;
      });
      P(box(0.42, 0.015, 0.3, C.red, 0.004), 0, 0.005, 0);
      g.userData.hold = { pos: [0, -0.02, 0.12], rot: [-1.0, 0, 0] };
      break;
    }
    case "stars": {
      for (let i = 0; i < 6; i++) {
        const s = P(new THREE.Mesh(new THREE.OctahedronGeometry(0.08), flatMat(C.yellow)), 0, 0, 0);
        s.userData.offset = i / 6;
      }
      g.userData.parts = g.children.slice();
      break;
    }
    case "lamp": {
      P(cyl(0.04, 0.05, 1.5, C.dark, 8), 0, 0.75, 0);
      P(sphere(0.12, 0xfff2b0, 12), 0, 1.55, 0);
      break;
    }
    case "hoop": {
      P(cyl(0.05, 0.05, 2.2, C.gray, 8), 0, 1.1, 0);
      P(box(0.7, 0.5, 0.04, C.white, 0.02), 0, 2.1, 0.08);
      P(torus(0.17, 0.02, C.orange), 0, 1.92, 0.28).rotation.x = Math.PI / 2;
      break;
    }
    case "fence": {
      for (let i = 0; i < 6; i++) P(box(0.1, 0.55, 0.06, C.white, 0.03), i * 0.4, 0.28, 0);
      [0.18, 0.4].forEach(y => P(box(2.2, 0.06, 0.04, C.white, 0.02), 1.0, y, 0));
      break;
    }
  }
  return g;
}

export type PropAnim =
  | "bounce" | "shake" | "spin" | "float" | "drive" | "driveBy" | "rally" | "tilt"
  | "stagger" | "light" | "steam" | "grow" | "sway" | "orbit" | "pop";

export function animateProp(g: THREE.Object3D, anim: PropAnim | undefined, age: number, t: number, base: THREE.Vector3) {
  const parts = (g.userData as PropInfo).parts ?? [];
  switch (anim) {
    case "bounce":
      g.position.y = base.y + Math.abs(Math.sin(t * 7)) * 0.12;
      break;
    case "shake":
      g.rotation.z = Math.sin(t * 34) * 0.18;
      g.position.y = base.y + Math.abs(Math.sin(t * 17)) * 0.04;
      break;
    case "spin":
      g.rotation.y = t * 3;
      g.position.y = base.y + Math.sin(t * 3) * 0.05;
      break;
    case "float":
      parts.forEach((p, i) => {
        const k = (t * 0.35 + i / Math.max(1, parts.length)) % 1;
        p.position.y = 1.4 + k * 1.2;
        p.scale.setScalar(Math.min(1, k * 5, (1 - k) * 5));
      });
      break;
    case "drive": {
      const a = t * 0.55;
      g.position.set(Math.cos(a) * 2.9, base.y, Math.sin(a) * 2.2);
      g.rotation.y = Math.atan2(-Math.sin(a) * 2.9, Math.cos(a) * 2.2) - Math.PI / 2;
      break;
    }
    case "driveBy": {
      const k = (age * 0.22) % 1;
      g.position.set(-6 + k * 12, base.y, base.z);
      g.rotation.y = 0;
      break;
    }
    case "rally": {
      const k = (t * 0.6) % 1;
      const dir = Math.floor(t * 0.6) % 2 ? -1 : 1;
      const x = dir > 0 ? -1.4 + k * 2.8 : 1.4 - k * 2.8;
      g.position.set(x, 0.5 + Math.sin(k * Math.PI) * 0.9, base.z);
      break;
    }
    case "tilt":
      if (parts[0]) parts[0].rotation.z = Math.sin(t * 1.5) * 0.3;
      break;
    case "stagger":
      parts.forEach((p, i) => p.scale.setScalar(Math.max(0.001, Math.min(1, (age - i * 0.14) / 0.2))));
      break;
    case "light": {
      const mats = (g.userData as PropInfo).mats ?? [];
      mats.forEach((m, i) => m.emissive.setHex(age > i * 0.35 ? 0x8a6a10 : 0x000000));
      break;
    }
    case "steam":
      parts.forEach((p, i) => {
        const k = (t * 0.4 + i / 3) % 1;
        p.position.y = 1.65 + k * 0.9;
        p.scale.setScalar(0.6 + k * 0.8);
      });
      break;
    case "grow": {
      const k = Math.min(1, age / 1.2);
      g.scale.setScalar(0.2 + 0.8 * (1 - Math.pow(1 - k, 3)));
      break;
    }
    case "sway":
      g.rotation.z = Math.sin(t * 1.4) * 0.08;
      break;
    case "orbit":
      parts.forEach(p => {
        const off = (p.userData.offset as number) ?? 0;
        const a = t * 1.2 + off * Math.PI * 2;
        const k = (t * 0.3 + off) % 1;
        p.position.set(Math.cos(a) * (0.7 - k * 0.5), 2.2 - k * 0.9, Math.sin(a) * (0.7 - k * 0.5));
        p.rotation.y = t * 3;
      });
      break;
    case "pop": {
      const k = Math.min(1, age / 0.3);
      g.scale.setScalar(k < 1 ? Math.sin(k * Math.PI * 0.7) * 1.2 : 1);
      break;
    }
  }
}
