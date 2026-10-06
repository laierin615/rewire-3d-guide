import * as THREE from "three";
import type { Beat, SceneScript, Sky } from "@/data/islandScenes";
import { iconTexture, isSharedMaterial, island, tree, type Icon } from "./kit";
import { animateProp, buildProp, type PropAnim, type PropInfo } from "./props";
import { Pup, Villager, type Actor, type Face, type Pose } from "./villager";

type AState = {
  x: number; z: number; y: number; turn: number;
  pose: Pose; face: Face; icon: Icon | null;
  hold: string | null; holdL: string | null; on: string | null; visible: boolean;
};
type PState = {
  x: number; y: number; z: number; turn: number; scale: number;
  visible: boolean; anim: PropAnim | null; animBeat: number; showBeat: number;
};
type World = { actors: Record<string, AState>; props: Record<string, PState>; cam: [number, number, number]; sky: Sky };

const DEG = Math.PI / 180;
const DEFAULT_TREES: [number, number][] = [[-3.7, -2.1], [3.8, -1.9], [-2.4, -3.5], [2.6, -3.4], [0.2, -4.0]];
const MOVING: Pose[] = ["walk", "run", "swim"];
const CHEAT = 62 * (Math.PI / 180);

const SKY_LIGHT: Record<Sky, { hemi: number; hemiI: number; sun: number; sunI: number }> = {
  day: { hemi: 0xfff4dc, hemiI: 1.9, sun: 0xfff0d2, sunI: 2.3 },
  dusk: { hemi: 0xffd2b0, hemiI: 1.45, sun: 0xffb072, sunI: 1.9 },
  night: { hemi: 0x9aa6e6, hemiI: 0.95, sun: 0xb8c4ff, sunI: 0.75 },
};

function rotate(x: number, z: number, a: number): [number, number] {
  return [x * Math.cos(a) + z * Math.sin(a), -x * Math.sin(a) + z * Math.cos(a)];
}
function angleLerp(a: number, b: number, k: number) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

/** 依序套用第 0..upto 拍，得到該拍結束時的畫面狀態。 */
export function computeWorld(
  script: SceneScript,
  beats: Beat[],
  upto: number,
  seatOf: (id: string) => { seat?: [number, number, number]; seatTurn?: number } | undefined
): World {
  const props: Record<string, PState> = {};
  script.props.forEach(p => {
    props[p.id] = {
      x: p.at[0], y: p.at[1], z: p.at[2], turn: (p.turn ?? 0) * DEG, scale: p.scale ?? 1,
      visible: !p.hidden, anim: p.anim ?? null, animBeat: -1, showBeat: -1,
    };
  });
  const actors: Record<string, AState> = {};
  const sit = (a: AState, propId: string, slot = 0) => {
    const p = props[propId];
    const info = seatOf(propId);
    const seat = info?.seat ?? [0, 0, 0];
    const [sx, sz] = rotate(seat[0] + slot, seat[2], p.turn);
    a.x = p.x + sx;
    a.z = p.z + sz;
    a.y = p.y + seat[1];
    a.on = propId;
    a.turn = p.turn + (info?.seatTurn ?? 0);
  };
  const posOf = (id: string): [number, number] | undefined =>
    actors[id] ? [actors[id].x, actors[id].z] : props[id] ? [props[id].x, props[id].z] : undefined;
  const face = (a: AState, t: number | string) => {
    if (typeof t === "number") a.turn = t * DEG;
    else {
      const p = posOf(t);
      // 像舞台演員一樣微微朝向觀眾，臉才看得到
      if (p) a.turn = THREE.MathUtils.clamp(Math.atan2(p[0] - a.x, p[1] - a.z), -CHEAT, CHEAT);
    }
  };
  script.actors.forEach(s => {
    const a: AState = {
      x: s.at[0], z: s.at[1], y: 0, turn: 0, pose: s.pose ?? "idle", face: s.face ?? "smile",
      icon: null, hold: null, holdL: null, on: null, visible: !s.hidden,
    };
    actors[s.id] = a;
    if (s.on) sit(a, s.on, s.slot);
  });
  script.actors.forEach(s => s.turn !== undefined && face(actors[s.id], s.turn));
  let cam: [number, number, number] = [script.cam?.[0] ?? 0, script.cam?.[1] ?? 0, script.cam?.[2] ?? 1];
  let sky: Sky = script.sky ?? "day";

  for (let b = 0; b <= upto && b < beats.length; b++) {
    const beat = beats[b];
    Object.values(actors).forEach(a => (a.icon = null));
    Object.entries(beat.props ?? {}).forEach(([id, ch]) => {
      const p = props[id];
      if (!p) return;
      if (ch.show !== undefined) {
        if (ch.show && !p.visible) p.showBeat = b;
        p.visible = ch.show;
      }
      if (ch.to) [p.x, p.y, p.z] = ch.to;
      if (ch.turn !== undefined) p.turn = ch.turn * DEG;
      if (ch.anim) {
        p.anim = ch.anim === "none" ? null : ch.anim;
        p.animBeat = b;
      }
    });
    const moved = new Map<string, number>();
    Object.entries(beat.act ?? {}).forEach(([id, ch]) => {
      const a = actors[id];
      if (!a) return;
      if (ch.show !== undefined) a.visible = ch.show;
      if (ch.to) {
        const dir = Math.atan2(ch.to[0] - a.x, ch.to[1] - a.z);
        a.x = ch.to[0];
        a.z = ch.to[1];
        a.y = 0;
        a.on = null;
        moved.set(id, dir);
      }
      if (ch.on === null) {
        a.on = null;
        a.y = 0;
      } else if (ch.on) sit(a, ch.on, ch.slot);
      if (ch.pose) a.pose = ch.pose;
      if (ch.face) a.face = ch.face;
      if (ch.icon) a.icon = ch.icon;
      if (ch.hold !== undefined) a.hold = ch.hold;
      if (ch.holdL !== undefined) a.holdL = ch.holdL;
    });
    Object.entries(beat.act ?? {}).forEach(([id, ch]) => {
      const a = actors[id];
      if (!a) return;
      if (ch.turn !== undefined) face(a, ch.turn);
      else if (moved.has(id) && !ch.on) a.turn = moved.get(id)!;
    });
    if (beat.cam) cam = [beat.cam[0], beat.cam[1], beat.cam[2] ?? 1];
    if (beat.sky) sky = beat.sky;
  }
  return { actors, props, cam, sky };
}

type ActorRT = {
  actor: Actor;
  state: AState;
  pos: THREE.Vector3;
  rot: number;
  move: { from: THREE.Vector3; to: THREE.Vector3; t: number; dur: number; pose: Pose } | null;
  speakingName: string;
};
type PropRT = {
  group: THREE.Group & { userData: PropInfo };
  state: PState;
  pos: THREE.Vector3;
  tween: { from: THREE.Vector3; t: number } | null;
  appear: number;
  animAge: number;
  holder: THREE.Object3D | null;
};

export class IslandEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1.6, 0.1, 80);
  private hemi = new THREE.HemisphereLight(0xfff4dc, 0x9ccf7a, 1.9);
  private sun = new THREE.DirectionalLight(0xfff0d2, 2.3);
  private actors = new Map<string, ActorRT>();
  private props = new Map<string, PropRT>();
  private icons = new Map<Icon, THREE.Texture>();
  private camTarget = new THREE.Vector3();
  private camLook = new THREE.Vector3();
  private camPos = new THREE.Vector3();
  private sky: Sky = "day";
  private clock = new THREE.Clock();
  private raf = 0;
  private resize: ResizeObserver;
  private beat = -1;
  private disposed = false;
  private reduced: boolean;

  constructor(private host: HTMLElement, private script: SceneScript, private beats: Beat[]) {
    this.reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute("aria-hidden", "true");

    this.hemi.groundColor.setHex(0x9ccf7a);
    this.scene.add(this.hemi);
    this.sun.position.set(4.5, 9, 6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -7;
    this.sun.shadow.camera.right = 7;
    this.sun.shadow.camera.top = 7;
    this.sun.shadow.camera.bottom = -7;
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.radius = 4;
    this.scene.add(this.sun);

    this.build();
    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(host);
    this.fit();
    this.loop();
  }

  private build() {
    const clear: [number, number][] = [];
    this.script.props.forEach(p => clear.push([p.at[0], p.at[2]]));
    this.script.actors.forEach(a => clear.push(a.at));
    this.beats.forEach(b => Object.values(b.act ?? {}).forEach(c => c.to && clear.push(c.to)));
    const keepClear = (x: number, z: number) => clear.some(([cx, cz]) => Math.hypot(x - cx, z - cz) < 0.75) || (Math.abs(x) < 1.2 && z > 1.6);
    island(this.scene, this.script.seed, keepClear);
    (this.script.trees ?? DEFAULT_TREES).forEach(([x, z], i) => {
      if (!clear.some(([cx, cz]) => Math.hypot(x - cx, z - cz) < 1.1)) tree(this.scene, x, z, 0.9 + (i % 3) * 0.12);
    });

    this.script.props.forEach(p => {
      const group = buildProp(p.kind, p.label);
      this.scene.add(group);
      this.props.set(p.id, { group, state: null!, pos: new THREE.Vector3(...p.at), tween: null, appear: 9, animAge: 9, holder: null });
    });
    this.script.actors.forEach(s => {
      const actor: Actor = s.cast.kind === "pup" ? new Pup(s.cast.opts) : new Villager(s.cast.opts);
      this.scene.add(actor.root);
      this.actors.set(s.id, { actor, state: null!, pos: new THREE.Vector3(s.at[0], 0, s.at[1]), rot: 0, move: null, speakingName: s.cast.name });
    });
  }

  private seatOf = (id: string) => this.props.get(id)?.group.userData;

  private icon(kind: Icon) {
    let t = this.icons.get(kind);
    if (!t) {
      t = iconTexture(kind);
      this.icons.set(kind, t);
    }
    return t;
  }

  /** 切到第 i 拍；animate 為真時走位與道具會補間，否則直接到位。 */
  go(i: number, animate: boolean) {
    if (this.disposed) return;
    const w = computeWorld(this.script, this.beats, i, this.seatOf);
    const smooth = animate && !this.reduced && this.beat >= 0;
    const speaker = this.beats[i]?.who;
    this.actors.forEach((rt, id) => {
      const s = w.actors[id];
      const target = new THREE.Vector3(s.x, s.y + (s.pose === "swim" ? 0.25 : 0), s.z);
      const dist = Math.hypot(target.x - rt.pos.x, target.z - rt.pos.z);
      if (smooth && dist > 0.05 && s.visible && rt.actor.root.visible) {
        const movePose: Pose = MOVING.includes(s.pose) ? s.pose : "walk";
        const speed = movePose === "run" ? 3.4 : movePose === "swim" ? 2.6 : 2.1;
        rt.move = { from: rt.pos.clone(), to: target, t: 0, dur: Math.max(0.35, dist / speed), pose: movePose };
      } else {
        rt.move = null;
        rt.pos.copy(target);
        if (!smooth) rt.rot = s.turn;
      }
      rt.state = s;
      rt.actor.root.visible = s.visible;
      rt.actor.setFace(s.face);
      rt.actor.setIcon(s.icon, s.icon ? this.icon(s.icon) : undefined);
      rt.actor.speaking = false;
      if (!rt.move) rt.actor.pose = s.pose;
      rt.speakingName === speaker && (rt.actor.speaking = true);
    });
    this.props.forEach((rt, id) => {
      const s = w.props[id];
      const target = new THREE.Vector3(s.x, s.y, s.z);
      if (smooth && rt.state && rt.pos.distanceTo(target) > 0.02) rt.tween = { from: rt.pos.clone(), t: 0 };
      else rt.tween = null;
      if (!rt.tween) rt.pos.copy(target);
      if (smooth && s.showBeat === i) rt.appear = 0;
      else if (!smooth) rt.appear = 9;
      if (s.animBeat === i) rt.animAge = smooth ? 0 : 9;
      else if (!smooth) rt.animAge = 9;
      rt.state = s;
      rt.group.visible = s.visible;
    });
    this.attachHeld(w);
    const [cx, cz, zoom] = w.cam;
    this.camTarget.set(cx, 0.75, cz);
    this.zoom = zoom;
    if (!smooth) this.snapCamera();
    this.setSky(w.sky, !smooth);
    this.beat = i;
  }

  setSpeaking(on: boolean) {
    const speaker = this.beats[this.beat]?.who;
    this.actors.forEach(rt => (rt.actor.speaking = on && rt.speakingName === speaker));
  }

  private attachHeld(w: World) {
    const holders = new Map<string, THREE.Object3D>();
    this.actors.forEach((rt, id) => {
      const s = w.actors[id];
      if (s.hold && rt.actor.handR) holders.set(s.hold, rt.actor.handR);
      if (s.holdL && rt.actor.handL) holders.set(s.holdL, rt.actor.handL);
    });
    this.props.forEach((rt, id) => {
      const h = holders.get(id) ?? null;
      if (h === rt.holder) return;
      if (h) {
        h.add(rt.group);
        const info = rt.group.userData.hold ?? { pos: [0, 0, 0.05], rot: [0, 0, 0] };
        rt.group.position.set(...info.pos);
        rt.group.rotation.set(...info.rot);
        rt.group.scale.setScalar(rt.state.scale);
        rt.group.visible = true;
      } else this.scene.add(rt.group);
      rt.holder = h;
    });
  }

  private zoom = 1;
  private camOffset() {
    const aspect = this.camera.aspect;
    const widen = aspect < 1.25 ? 1.22 : aspect < 1.5 ? 1.08 : 1;
    return new THREE.Vector3(0, 5.3, 9.3).multiplyScalar(this.zoom * widen);
  }
  private snapCamera() {
    this.camLook.copy(this.camTarget);
    this.camPos.copy(this.camTarget).add(this.camOffset());
  }

  private setSky(sky: Sky, snap: boolean) {
    this.sky = sky;
    if (snap) {
      const L = SKY_LIGHT[sky];
      this.hemi.color.setHex(L.hemi);
      this.hemi.intensity = L.hemiI;
      this.sun.color.setHex(L.sun);
      this.sun.intensity = L.sunI;
    }
  }

  private fit() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.beat >= 0 && this.clock.elapsedTime < 0.2) this.snapCamera();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 3.2);

    this.actors.forEach(rt => {
      const s = rt.state;
      if (!s) return;
      let targetRot = s.turn;
      if (rt.move) {
        const m = rt.move;
        m.t += dt;
        const u = Math.min(1, m.t / m.dur);
        rt.pos.lerpVectors(m.from, m.to, u);
        rt.pos.y = u < 1 ? (m.pose === "swim" ? m.to.y : 0) : m.to.y;
        rt.actor.pose = m.pose;
        targetRot = Math.atan2(m.to.x - m.from.x, m.to.z - m.from.z);
        if (u >= 1) {
          rt.move = null;
          rt.actor.pose = s.pose;
        }
      }
      rt.rot = angleLerp(rt.rot, targetRot, rt.move ? Math.min(1, dt * 12) : Math.min(1, dt * 7));
      rt.actor.seated = !!s.on && !rt.move;
      rt.actor.root.position.copy(rt.pos);
      rt.actor.root.rotation.y = rt.rot;
      rt.actor.update(t, dt);
    });

    this.props.forEach(rt => {
      const s = rt.state;
      if (!s || rt.holder) return;
      if (rt.tween) {
        rt.tween.t += dt / 0.9;
        const u = Math.min(1, rt.tween.t);
        const e = 1 - Math.pow(1 - u, 3);
        rt.pos.lerpVectors(rt.tween.from, new THREE.Vector3(s.x, s.y, s.z), e);
        if (u >= 1) rt.tween = null;
      }
      const g = rt.group;
      g.position.copy(rt.pos);
      g.rotation.set(0, s.turn, 0);
      rt.appear += dt;
      const a = Math.min(1, rt.appear / 0.35);
      g.scale.setScalar(s.scale * (a < 1 ? Math.sin(a * Math.PI * 0.72) * 1.15 : 1));
      rt.animAge += dt;
      if (s.anim) animateProp(g, s.anim, rt.animAge, t, rt.pos);
    });

    const L = SKY_LIGHT[this.sky];
    this.hemi.color.lerp(new THREE.Color(L.hemi), k);
    this.hemi.intensity += (L.hemiI - this.hemi.intensity) * k;
    this.sun.color.lerp(new THREE.Color(L.sun), k);
    this.sun.intensity += (L.sunI - this.sun.intensity) * k;

    const desired = this.camTarget.clone().add(this.camOffset());
    this.camPos.lerp(desired, k);
    this.camLook.lerp(this.camTarget, k);
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resize.disconnect();
    const textures = new Set<THREE.Texture>(this.icons.values());
    this.scene.traverse(o => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
      mats.forEach(mt => {
        if (isSharedMaterial(mt)) return;
        const map = (mt as THREE.MeshBasicMaterial).map;
        if (map) textures.add(map);
        mt.dispose();
      });
    });
    textures.forEach(tx => tx.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
