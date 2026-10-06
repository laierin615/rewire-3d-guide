import * as THREE from "three";
import { C, capsule, cone, flatMat, mat, mesh, place, sphere, torus, type Icon } from "./kit";

export type Species = "bunny" | "bear" | "cat" | "dog" | "sheep" | "mouse";
export type Face =
  | "smile" | "happy" | "sad" | "surprised" | "worried" | "angry"
  | "sleep" | "neutral" | "sour" | "calm";
export type Pose =
  | "idle" | "walk" | "run" | "wave" | "think" | "cheer" | "sigh" | "sad" | "jump"
  | "sit" | "lie" | "talk" | "brush" | "brushL" | "phone" | "point" | "hold" | "swim"
  | "dance" | "lift" | "write" | "nod" | "shrug" | "eat" | "swing" | "drive" | "pause"
  | "whisper" | "giggle" | "water" | "hug" | "shake" | "pet" | "ride" | "bark" | "nervous";

export type VillagerOpts = {
  species: Species;
  fur: number;
  shirt: number;
  pants?: number;
  accent?: number;
  flower?: number;
  cap?: number;
};

export interface Actor {
  root: THREE.Group;
  handR?: THREE.Object3D;
  handL?: THREE.Object3D;
  pose: Pose;
  speaking: boolean;
  /** 坐在椅子、長椅上時，上半身照做動作，腿維持坐姿。 */
  seated?: boolean;
  setFace(face: Face): void;
  setIcon(icon: Icon | null, tex?: THREE.Texture): void;
  update(t: number, dt: number): void;
}

const ICON_Y = 2.45;

function makeIcon() {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false }));
  sprite.renderOrder = 10;
  sprite.visible = false;
  return sprite;
}
function animateIcon(sprite: THREE.Sprite, age: number, t: number, baseY: number) {
  if (!sprite.visible) return;
  const pop = Math.min(1, age / 0.28);
  const overshoot = pop < 1 ? Math.sin(pop * Math.PI * 0.75) * 1.15 : 1;
  sprite.scale.setScalar(0.62 * overshoot);
  sprite.position.y = baseY + Math.sin(t * 3) * 0.04;
}

export class Villager implements Actor {
  root = new THREE.Group();
  body = new THREE.Group();
  head = new THREE.Group();
  armL = new THREE.Group();
  armR = new THREE.Group();
  legL = new THREE.Group();
  legR = new THREE.Group();
  handL = new THREE.Object3D();
  handR = new THREE.Object3D();
  pose: Pose = "idle";
  speaking = false;
  seated = false;
  private face: Face = "smile";
  private ears: THREE.Object3D[] = [];
  private eyesOpen = new THREE.Group();
  private eyesHappy = new THREE.Group();
  private eyesLine = new THREE.Group();
  private brows: THREE.Mesh[] = [];
  private mouths: Record<"smile" | "open" | "o" | "frown" | "flat", THREE.Object3D>;
  private icon = makeIcon();
  private iconAge = 0;
  private nextBlink = 1 + Math.random() * 3;
  private species: Species;

  constructor(o: VillagerOpts) {
    this.species = o.species;
    const fur = o.fur;
    const accent = o.accent ?? 0xfff3e2;
    this.root.add(this.body);
    // 腳
    const pants = o.pants ?? o.shirt;
    ([[this.legL, -0.13], [this.legR, 0.13]] as const).forEach(([leg, x]) => {
      place(leg, x, 0.3, 0, this.body);
      place(capsule(0.1, 0.1, pants), 0, -0.12, 0, leg);
      const foot = place(sphere(0.115, 0x6b4a35, 14), 0, -0.25, 0.04, leg);
      foot.scale.set(1, 0.7, 1.35);
    });
    // 身體
    const torso = place(sphere(0.34, o.shirt, 22), 0, 0.56, 0, this.body);
    torso.scale.set(1, 1, 0.88);
    place(sphere(0.1, o.species === "bunny" ? C.white : fur, 10), 0, 0.42, -0.31, this.body);
    // 手
    ([[this.armL, -0.31, this.handL], [this.armR, 0.31, this.handR]] as const).forEach(([arm, x, hand]) => {
      place(arm, x, 0.75, 0, this.body);
      place(capsule(0.085, 0.14, o.shirt), 0, -0.12, 0, arm);
      place(sphere(0.088, fur, 12), 0, -0.29, 0, arm);
      place(hand, 0, -0.34, 0.02, arm);
    });
    // 頭
    place(this.head, 0, 0.86, 0, this.body);
    const skull = place(sphere(0.5, fur, 30), 0, 0.45, 0, this.head);
    skull.scale.set(1.06, 0.94, 0.96);
    const muzzled = o.species !== "bunny" && o.species !== "sheep";
    if (muzzled) {
      const muzzle = place(sphere(0.2, accent, 18), 0, 0.3, 0.4, this.head);
      muzzle.scale.set(1.2, 0.82, 0.65);
      place(sphere(0.055, C.ink, 10), 0, 0.37, 0.53, this.head);
    } else {
      place(sphere(0.04, o.species === "bunny" ? 0xf08aa0 : C.ink, 10), 0, 0.36, 0.49, this.head);
    }
    // 眼睛
    [-0.18, 0.18].forEach(x => {
      const eye = place(sphere(0.068, C.ink, 14), x, 0.5, 0.43, this.eyesOpen);
      eye.scale.set(0.8, 1.15, 0.45);
      eye.castShadow = false;
      place(new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), flatMat(C.white)), x + 0.018, 0.54, 0.47, this.eyesOpen);
      const happy = place(torus(0.058, 0.016, C.ink, Math.PI), x, 0.47, 0.45, this.eyesHappy);
      happy.castShadow = false;
      const line = place(capsule(0.014, 0.08, C.ink), x, 0.48, 0.46, this.eyesLine);
      line.rotation.z = Math.PI / 2;
      line.castShadow = false;
      const brow = place(capsule(0.014, 0.07, C.dark), x, 0.63, 0.43, this.head);
      brow.rotation.z = Math.PI / 2;
      brow.castShadow = false;
      this.brows.push(brow);
    });
    this.head.add(this.eyesOpen, this.eyesHappy, this.eyesLine);
    // 嘴巴
    const my = muzzled ? 0.24 : 0.29, mz = muzzled ? 0.535 : 0.485;
    const smile = place(torus(0.052, 0.014, C.ink, Math.PI), 0, my + 0.03, mz, this.head);
    smile.rotation.z = Math.PI;
    const open = place(sphere(0.06, 0x9b4242, 12), 0, my, mz - 0.01, this.head);
    open.scale.set(1, 0.75, 0.35);
    const oh = place(torus(0.034, 0.014, C.ink), 0, my, mz, this.head);
    const frown = place(torus(0.045, 0.014, C.ink, Math.PI), 0, my - 0.02, mz, this.head);
    const flat = place(capsule(0.012, 0.05, C.ink), 0, my, mz, this.head);
    flat.rotation.z = Math.PI / 2;
    this.mouths = { smile, open, o: oh, frown, flat };
    Object.values(this.mouths).forEach(m => (m.castShadow = false));
    // 腮紅
    [-1, 1].forEach(side => {
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.07, 18), flatMat(C.pink, 0.6));
      place(blush, side * 0.33, 0.36, 0.385, this.head);
      blush.rotation.y = side * 0.68;
    });
    this.buildEars(o.species, fur, accent);
    if (o.flower) {
      const f = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        place(sphere(0.06, o.flower, 8), Math.cos(a) * 0.075, Math.sin(a) * 0.075, 0, f);
      }
      place(sphere(0.05, C.yellow, 8), 0, 0, 0.02, f);
      place(f, 0.32, 0.82, 0.2, this.head);
      f.rotation.y = 0.5;
    }
    if (o.cap) {
      const cap = mesh(new THREE.SphereGeometry(0.535, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2.1), o.cap);
      cap.scale.set(1.06, 0.98, 0.98);
      place(cap, 0, 0.47, -0.02, this.head);
    }
    this.icon.position.y = ICON_Y;
    this.root.add(this.icon);
    this.setFace("smile");
  }

  private buildEars(species: Species, fur: number, accent: number) {
    const h = this.head;
    if (species === "bunny") {
      [-1, 1].forEach(side => {
        const ear = place(new THREE.Group(), side * 0.17, 0.84, -0.05, h);
        ear.rotation.z = -side * 0.14;
        place(capsule(0.1, 0.42, fur), 0, 0.22, 0, ear);
        place(capsule(0.05, 0.3, C.pink), 0, 0.22, 0.065, ear);
        this.ears.push(ear);
      });
    } else if (species === "bear") {
      [-1, 1].forEach(side => {
        place(sphere(0.15, fur, 14), side * 0.34, 0.8, -0.03, h);
        place(sphere(0.08, accent, 10), side * 0.34, 0.8, 0.06, h);
      });
    } else if (species === "cat") {
      [-1, 1].forEach(side => {
        const ear = place(new THREE.Group(), side * 0.29, 0.83, 0, h);
        ear.rotation.z = -side * 0.35;
        place(cone(0.15, 0.3, fur, 4), 0, 0.1, 0, ear).rotation.y = Math.PI / 4;
        place(cone(0.08, 0.18, C.pink, 4), 0, 0.07, 0.05, ear).rotation.y = Math.PI / 4;
        this.ears.push(ear);
      });
    } else if (species === "dog") {
      [-1, 1].forEach(side => {
        const ear = place(new THREE.Group(), side * 0.47, 0.6, -0.02, h);
        ear.rotation.z = side * 0.35;
        const flap = place(sphere(0.17, accent === 0xfff3e2 ? 0x9c6b47 : accent, 14), 0, -0.12, 0, ear);
        flap.scale.set(0.5, 1.1, 0.85);
        this.ears.push(ear);
      });
    } else if (species === "mouse") {
      [-1, 1].forEach(side => {
        const ear = place(sphere(0.22, fur, 16), side * 0.36, 0.84, -0.05, h);
        ear.scale.set(1, 1, 0.35);
        const inner = place(sphere(0.13, C.pink, 12), side * 0.36, 0.84, 0.0, h);
        inner.scale.set(1, 1, 0.3);
      });
    } else if (species === "sheep") {
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        place(sphere(0.17, C.cream, 12), Math.cos(a) * 0.36, 0.78 + Math.sin(a * 2) * 0.03, Math.sin(a) * 0.3 - 0.04, h);
      }
      place(sphere(0.2, C.cream, 12), 0, 0.92, -0.02, h);
      [-1, 1].forEach(side => {
        const ear = place(capsule(0.06, 0.14, fur), side * 0.53, 0.48, 0, h);
        ear.rotation.z = Math.PI / 2;
      });
    }
  }

  setFace(face: Face) {
    this.face = face;
    const open = ["smile", "surprised", "worried", "angry", "sad", "neutral"].includes(face);
    this.eyesOpen.visible = open;
    this.eyesHappy.visible = face === "happy";
    this.eyesLine.visible = face === "sleep" || face === "calm" || face === "sour";
    this.eyesOpen.scale.setScalar(face === "surprised" ? 1.2 : 1);
    this.eyesLine.children.forEach((line, i) => (line.rotation.z = Math.PI / 2 + (face === "sour" ? (i ? -0.45 : 0.45) : 0)));
    const brow = face === "worried" || face === "sad" ? 0.35 : face === "angry" ? -0.4 : null;
    this.brows.forEach((b, i) => {
      b.visible = brow !== null;
      if (brow !== null) b.rotation.z = Math.PI / 2 + (i === 0 ? brow : -brow);
    });
    this.showMouth(this.baseMouth());
  }

  private baseMouth(): keyof Villager["mouths"] {
    switch (this.face) {
      case "happy": return "open";
      case "surprised": return "o";
      case "worried": case "sad": return "frown";
      case "neutral": case "angry": case "sleep": case "sour": return "flat";
      default: return "smile";
    }
  }
  private showMouth(which: keyof Villager["mouths"]) {
    (Object.keys(this.mouths) as (keyof Villager["mouths"])[]).forEach(k => (this.mouths[k].visible = k === which));
  }

  setIcon(icon: Icon | null, tex?: THREE.Texture) {
    if (!icon || !tex) {
      this.icon.visible = false;
      return;
    }
    const m = this.icon.material as THREE.SpriteMaterial;
    if (m.map !== tex) {
      m.map = tex;
      m.needsUpdate = true;
    }
    this.icon.visible = true;
    this.iconAge = 0;
  }

  update(t: number, dt: number) {
    const s = Math.sin;
    const A = this.armL.rotation, B = this.armR.rotation;
    const Ll = this.legL.rotation, Lr = this.legR.rotation, H = this.head.rotation;
    A.set(0, 0, -0.32);
    B.set(0, 0, 0.32);
    Ll.set(0, 0, 0);
    Lr.set(0, 0, 0);
    H.set(0, 0, 0);
    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    let droop = 0;
    let iconY = ICON_Y;
    const sitDown = () => {
      Ll.x = Lr.x = -1.5;
      this.body.position.y = -0.3;
    };
    switch (this.pose) {
      case "idle":
        this.body.position.y = s(t * 2.2) * 0.012;
        A.z = -0.32 - s(t * 2.2) * 0.04;
        B.z = 0.32 + s(t * 2.2) * 0.04;
        H.z = s(t * 1.3) * 0.04;
        break;
      case "walk":
      case "run": {
        const fast = this.pose === "run";
        const w = t * (fast ? 13 : 9), amp = fast ? 0.95 : 0.7;
        Ll.x = s(w) * amp;
        Lr.x = -s(w) * amp;
        A.x = -s(w) * amp * 0.85;
        B.x = s(w) * amp * 0.85;
        if (fast) { A.z = -0.5; B.z = 0.5; this.body.rotation.x = 0.12; }
        this.body.position.y = Math.abs(s(w)) * (fast ? 0.08 : 0.05);
        break;
      }
      case "wave":
        B.z = 2.5 + s(t * 9) * 0.35;
        H.z = 0.1;
        break;
      case "think":
        B.x = -2.0;
        B.z = 0.85;
        H.z = 0.18;
        H.x = -0.08;
        break;
      case "cheer":
        A.z = -2.6 + s(t * 10) * 0.15;
        B.z = 2.6 - s(t * 10) * 0.15;
        this.body.position.y = Math.abs(s(t * 6)) * 0.22;
        break;
      case "sigh": {
        const k = (s(t * 2.4) + 1) / 2;
        this.body.position.y = -k * 0.03;
        A.z = -0.18;
        B.z = 0.18;
        H.x = 0.25 * k;
        droop = 0.6;
        break;
      }
      case "sad":
        H.x = 0.35;
        A.z = -0.12;
        B.z = 0.12;
        droop = 1;
        break;
      case "nervous":
        H.x = 0.2;
        A.x = B.x = -0.6;
        A.z = 0.2;
        B.z = -0.2;
        this.body.position.x = s(t * 40) * 0.012;
        droop = 0.8;
        break;
      case "jump":
        this.body.position.y = Math.abs(s(t * 6.5)) * 0.35;
        A.z = -1.3;
        B.z = 1.3;
        break;
      case "sit":
        sitDown();
        A.x = B.x = -0.45;
        break;
      case "lie":
        this.body.rotation.x = -Math.PI / 2;
        this.body.position.y = 0.36;
        this.body.position.z = 0.55;
        A.z = -0.22;
        B.z = 0.22;
        iconY = 1.35;
        break;
      case "talk":
        H.x = s(t * 7) * 0.05;
        B.z = 0.55 + s(t * 3) * 0.15;
        B.x = -0.35;
        break;
      case "brush":
        B.x = -2.3;
        B.z = 0.55 + s(t * 18) * 0.12;
        break;
      case "brushL":
        A.x = -2.3;
        A.z = -0.55 - s(t * 9) * 0.1;
        H.z = -0.08;
        break;
      case "phone":
        A.x = -1.2;
        A.z = 0.32;
        B.x = -1.2;
        B.z = -0.32;
        H.x = 0.32;
        break;
      case "point":
        B.x = -1.5;
        B.z = 0.1;
        break;
      case "hold":
        B.x = -1.0;
        B.z = 0.2;
        break;
      case "swim":
        this.body.rotation.x = Math.PI / 2;
        this.body.position.y = 0.05;
        this.body.position.z = -0.6;
        A.x = t * 7;
        B.x = t * 7 + Math.PI;
        A.z = -0.2;
        B.z = 0.2;
        Ll.x = s(t * 14) * 0.4;
        Lr.x = -s(t * 14) * 0.4;
        H.x = -0.5;
        iconY = 1.2;
        break;
      case "dance":
        A.z = -2.7;
        B.z = 2.7;
        this.body.rotation.y = t * 2.6;
        Lr.x = -0.7;
        this.body.position.y = 0.04 + Math.abs(s(t * 2.6)) * 0.06;
        break;
      case "lift": {
        const k = (s(t * 4) + 1) / 2;
        A.z = -1.5 - k * 1.1;
        B.z = 1.5 + k * 1.1;
        break;
      }
      case "write":
        B.x = -1.05 + s(t * 10) * 0.06;
        B.z = 0.05;
        A.x = -0.9;
        H.x = 0.3;
        break;
      case "nod":
        H.x = s(t * 6) * 0.18;
        break;
      case "shrug":
        A.z = -0.9;
        B.z = 0.9;
        A.x = B.x = -0.5;
        H.z = 0.15;
        break;
      case "eat":
        B.x = -2.35;
        B.z = 0.45;
        H.x = -0.06;
        break;
      case "swing":
        B.z = 0.9 + s(t * 5) * 1.0;
        B.x = -0.7;
        this.body.rotation.y = s(t * 5) * 0.4;
        break;
      case "drive":
        sitDown();
        A.x = B.x = -1.2;
        A.z = 0.25;
        B.z = -0.25;
        break;
      case "ride":
        sitDown();
        Ll.x = -1.4 + s(t * 8) * 0.45;
        Lr.x = -1.4 - s(t * 8) * 0.45;
        A.x = B.x = -1.1;
        break;
      case "pause":
        B.x = -1.55;
        B.z = 0.25;
        H.x = 0.05;
        break;
      case "whisper":
        B.x = -1.9;
        B.z = 0.95;
        H.z = 0.22;
        break;
      case "giggle":
        A.x = B.x = -1.75;
        A.z = 0.55;
        B.z = -0.55;
        this.body.position.y = Math.abs(s(t * 12)) * 0.025;
        break;
      case "water":
        B.x = -1.1;
        B.z = 0.3 + s(t * 2) * 0.1;
        this.body.rotation.x = 0.1;
        break;
      case "hug":
        A.x = B.x = -1.4;
        A.z = 0.6;
        B.z = -0.6;
        break;
      case "shake":
        B.x = -1.3 + s(t * 10) * 0.12;
        B.z = 0.05;
        break;
      case "pet":
        this.body.position.y = -0.14;
        Ll.x = Lr.x = -0.45;
        B.x = -1.2 + s(t * 6) * 0.12;
        H.x = 0.25;
        break;
      default:
        break;
    }
    if (this.seated && !["sit", "lie", "drive", "ride", "swim"].includes(this.pose)) {
      Ll.x = Lr.x = -1.5;
      this.body.position.y = -0.3;
      this.body.rotation.x = 0;
    }
    if (this.species === "bunny") this.ears.forEach(e => (e.rotation.x = droop * 1.1));
    // 眨眼
    this.nextBlink -= dt;
    if (this.nextBlink < 0) {
      this.eyesOpen.scale.y = 0.12;
      if (this.nextBlink < -0.12) {
        this.nextBlink = 2 + Math.random() * 3;
        this.eyesOpen.scale.y = this.face === "surprised" ? 1.2 : 1;
      }
    }
    // 說話時嘴巴開合
    if (this.speaking && this.face !== "sleep") {
      this.showMouth(Math.floor(t * 8) % 2 ? "open" : this.baseMouth());
    } else this.showMouth(this.baseMouth());
    this.iconAge += dt;
    animateIcon(this.icon, this.iconAge, t, iconY);
  }
}

/** 四腳小狗：科比、麥克斯。 */
export class Pup implements Actor {
  root = new THREE.Group();
  body = new THREE.Group();
  head = new THREE.Group();
  tail = new THREE.Group();
  legs: THREE.Group[] = [];
  pose: Pose = "idle";
  speaking = false;
  private eyesOpen = new THREE.Group();
  private eyesHappy = new THREE.Group();
  private ears: THREE.Object3D[] = [];
  private icon = makeIcon();
  private iconAge = 0;

  constructor(o: { fur: number; patch?: number; size?: number; pointyEars?: boolean }) {
    const patch = o.patch ?? o.fur;
    this.root.add(this.body);
    const torso = place(capsule(0.24, 0.42, o.fur), 0, 0.48, 0, this.body);
    torso.rotation.x = Math.PI / 2;
    place(sphere(0.2, patch, 14), 0, 0.42, 0.24, this.body).scale.set(1, 1.1, 0.8);
    [[-0.14, 0.28], [0.14, 0.28], [-0.14, -0.28], [0.14, -0.28]].forEach(([x, z]) => {
      const leg = place(new THREE.Group(), x, 0.38, z, this.body);
      place(capsule(0.075, 0.18, o.fur), 0, -0.18, 0, leg);
      place(sphere(0.085, patch, 10), 0, -0.32, 0.03, leg);
      this.legs.push(leg);
    });
    place(this.head, 0, 0.82, 0.42, this.body);
    place(sphere(0.3, o.fur, 22), 0, 0, 0, this.head);
    const snout = place(sphere(0.15, patch, 14), 0, -0.07, 0.22, this.head);
    snout.scale.set(1.1, 0.85, 1);
    place(sphere(0.05, C.ink, 10), 0, -0.02, 0.36, this.head);
    [-0.12, 0.12].forEach(x => {
      const e = place(sphere(0.045, C.ink, 10), x, 0.07, 0.25, this.eyesOpen);
      e.scale.set(0.85, 1.15, 0.5);
      place(new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 4), flatMat(C.white)), x + 0.012, 0.09, 0.28, this.eyesOpen);
      place(torus(0.04, 0.012, C.ink, Math.PI), x, 0.06, 0.26, this.eyesHappy);
    });
    this.head.add(this.eyesOpen, this.eyesHappy);
    [-1, 1].forEach(side => {
      const ear = place(new THREE.Group(), side * 0.2, 0.2, -0.02, this.head);
      if (o.pointyEars) place(cone(0.1, 0.24, o.fur, 4), 0, 0.1, 0, ear);
      else place(sphere(0.12, patch === o.fur ? 0x5a3d2b : patch, 10), 0, -0.05, 0, ear).scale.set(0.55, 1.15, 0.8);
      ear.rotation.z = -side * (o.pointyEars ? 0.15 : -0.5);
      this.ears.push(ear);
    });
    place(this.tail, 0, 0.6, -0.42, this.body);
    place(capsule(0.06, 0.22, patch), 0, 0.12, -0.04, this.tail).rotation.x = -0.6;
    this.root.scale.setScalar(o.size ?? 1);
    this.icon.position.y = 1.5;
    this.root.add(this.icon);
    this.setFace("smile");
  }
  setFace(face: Face) {
    this.eyesOpen.visible = face !== "happy" && face !== "sleep" && face !== "calm";
    this.eyesHappy.visible = !this.eyesOpen.visible;
  }
  setIcon(icon: Icon | null, tex?: THREE.Texture) {
    if (!icon || !tex) {
      this.icon.visible = false;
      return;
    }
    const m = this.icon.material as THREE.SpriteMaterial;
    m.map = tex;
    m.needsUpdate = true;
    this.icon.visible = true;
    this.iconAge = 0;
  }
  update(t: number, dt: number) {
    const s = Math.sin;
    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);
    this.legs.forEach(l => l.rotation.set(0, 0, 0));
    let wag = s(t * 8) * 0.5;
    this.ears.forEach(e => (e.rotation.x = 0));
    switch (this.pose) {
      case "walk":
      case "run": {
        const w = t * (this.pose === "run" ? 14 : 10);
        this.legs.forEach((l, i) => (l.rotation.x = s(w + (i % 3 === 0 ? 0 : Math.PI)) * 0.6));
        this.body.position.y = Math.abs(s(w)) * 0.04;
        break;
      }
      case "sit":
        this.body.rotation.x = -0.45;
        this.body.position.y = -0.08;
        this.legs[2].rotation.x = this.legs[3].rotation.x = 1.2;
        break;
      case "lie":
        this.body.position.y = -0.22;
        this.legs.forEach(l => (l.rotation.x = -1.4));
        wag *= 0.3;
        break;
      case "bark":
        this.head.rotation.x = -0.25 + Math.abs(s(t * 9)) * 0.3;
        this.body.position.y = Math.abs(s(t * 9)) * 0.05;
        break;
      case "nervous":
        this.body.position.x = s(t * 38) * 0.015;
        this.head.rotation.x = 0.25;
        this.ears.forEach(e => (e.rotation.x = 0.9));
        wag = -0.6;
        break;
      case "jump":
      case "cheer":
        this.body.position.y = Math.abs(s(t * 7)) * 0.25;
        wag = s(t * 18) * 0.7;
        break;
      case "nod":
        this.head.rotation.x = s(t * 5) * 0.2;
        break;
      default:
        this.head.rotation.z = s(t * 1.4) * 0.08;
    }
    this.tail.rotation.y = wag;
    this.iconAge += dt;
    animateIcon(this.icon, this.iconAge, t, 1.5);
  }
}

