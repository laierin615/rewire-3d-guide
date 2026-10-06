import * as THREE from "three";
import type { Mode } from "../data/neuroLessons";

type Tools = {
  sphere: (
    pos: THREE.Vector3,
    radius: number,
    color: number,
    opacity?: number
  ) => THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  tube: (
    points: THREE.Vector3[],
    radius: number,
    color: number,
    opacity?: number
  ) => {
    curve: THREE.CatmullRomCurve3;
    mesh: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial>;
  };
  pulse: (
    curve: THREE.Curve<THREE.Vector3>,
    color: number,
    steps: number[],
    offset?: number
  ) => void;
};
const c = {
  coral: 0xf7927a,
  teal: 0x6cc7a8,
  gold: 0xffcf55,
  ink: 0x8a6a4c,
  pale: 0xf1e4c4,
};
const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);

/** Book-grounded visual metaphors. No anatomical coordinates or measured kinetics. */
export function buildExtraModel(
  mode: Mode,
  group: THREE.Group,
  { sphere, tube, pulse }: Tools
) {
  const textures: THREE.CanvasTexture[] = [];
  const updates: ((time: number, step: number) => void)[] = [];
  const mat = (color: number, opacity = 1) =>
    new THREE.MeshStandardMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      roughness: 0.9,
    });
  const add = (
    geometry: THREE.BufferGeometry,
    color: number,
    position: THREE.Vector3,
    opacity = 1
  ) => {
    const m = new THREE.Mesh(geometry, mat(color, opacity));
    m.position.copy(position);
    group.add(m);
    return m;
  };
  const label = (text: string, pos: THREE.Vector3, width = 1.7) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(250, text.length * 66 + 80);
    canvas.height = 140;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "rgba(255,255,255,.94)";
    ctx.beginPath();
    ctx.roundRect(8, 10, canvas.width - 16, 120, 25);
    ctx.fill();
    ctx.fillStyle = "#284854";
    ctx.font = "600 66px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, 72, canvas.width - 50);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, depthTest: false })
    );
    sprite.position.copy(pos);
    sprite.scale.set(
      Math.max(width * 0.75, (canvas.width / canvas.height) * 0.62),
      0.62,
      1
    );
    sprite.renderOrder = 10;
    group.add(sprite);
  };
  const fade = (mesh: THREE.Mesh, on: boolean) => {
    const m = mesh.material as THREE.MeshStandardMaterial;
    m.transparent = true;
    m.opacity = on ? 1 : 0.16;
    m.emissive.setHex(on ? c.teal : 0);
    m.emissiveIntensity = on ? 0.12 : 0;
  };

  if (mode === "attention") {
    const lanes = [
      { name: "朋友", y: 1.05, z: -0.35, color: c.teal, step: 1 },
      { name: "鄰桌", y: 0, z: 0.45, color: c.gold, step: 3 },
      { name: "狗吠", y: -1.05, z: -0.15, color: c.coral, step: 2 },
    ];
    const gate = add(
      new THREE.TorusGeometry(1.42, 0.09, 12, 80),
      c.ink,
      v(0, 0),
      0.55
    );
    gate.scale.x = 0.55;
    add(new THREE.CylinderGeometry(0.075, 0.075, 0.42, 12), c.ink, v(0, -1.62));
    label("注意力篩選", v(0, 1.95), 2.1);
    label("注意焦點", v(2.45, -0.9), 1.8);
    const focus = sphere(v(2.4, 0, 0.15), 0.46, c.teal);
    lanes.forEach(lane => {
      const start = v(-2.85, lane.y, lane.z),
        gatePoint = v(0, lane.y * 0.48, lane.z);
      sphere(start, 0.23, lane.color);
      label(lane.name, v(-2.85, lane.y + 0.47, lane.z), 1.1);
      const incoming = tube(
        [start, v(-1.4, lane.y, lane.z + 0.3), gatePoint],
        0.05,
        lane.color,
        0.75
      );
      const selected = tube(
        [gatePoint, v(1.1, lane.y * 0.5, lane.z + 0.45), v(2.4, 0, 0.15)],
        0.075,
        lane.color,
        0.2
      );
      pulse(incoming.curve, lane.color, [0, lane.step]);
      pulse(selected.curve, c.gold, [lane.step]);
      updates.push((_t, step) => {
        fade(incoming.mesh, step === 0 || step === lane.step);
        fade(selected.mesh, step === lane.step);
      });
    });
    updates.push((_t, step) => {
      focus.material.color.setHex(
        step === 2 ? c.coral : step === 3 ? c.gold : c.teal
      );
    });
  }

  if (mode === "muscle") {
    const fibers: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const fiber = add(
        new THREE.CapsuleGeometry(0.1, 1.1, 8, 16),
        c.coral,
        v(-2.35, 0.15, (i - 2) * 0.19)
      );
      fiber.rotation.z = Math.PI / 2 + (i - 2) * 0.09;
      fibers.push(fiber);
    }
    label("肌肉收縮與放鬆", v(-2.3, -0.8), 2.2);
    label("大腦的動作指令", v(0, 1.6), 2.3);
    label("身體的回饋訊號", v(0, -1.45), 2.3);
    label("支持神經連結", v(2.4, -0.8), 2);
    const coords = [
      v(1.65, 0.1, 0.4),
      v(2.25, 0.5, -0.25),
      v(2.9, 0.1, 0.2),
      v(2.3, -0.15, 0.55),
      v(2.8, 0.65, -0.4),
    ];
    coords.forEach(p => sphere(p, 0.16, c.teal));
    const links = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 4],
    ].map(
      ([a, b]) =>
        tube(
          [
            coords[a],
            coords[a]
              .clone()
              .lerp(coords[b], 0.5)
              .add(v(0, 0.08, 0.1)),
            coords[b],
          ],
          0.045,
          c.teal,
          0.3
        ).mesh
    );
    const shell = sphere(v(2.3, 0.25, 0), 0.78, c.teal, 0.07);
    shell.scale.set(1.16, 0.8, 0.7);
    const command = tube(
      [v(1.65, 0.1, 0.4), v(0.1, 1.15, -0.5), v(-2.2, 0.3)],
      0.055,
      c.ink,
      0.6
    );
    const response = tube(
      [v(-2.2, 0.1), v(0, -0.9, 0.7), v(2.3, -0.15, 0.55)],
      0.055,
      c.gold,
      0.6
    );
    pulse(command.curve, c.gold, [0]);
    pulse(response.curve, c.gold, [2, 3]);
    updates.push((time, step) => {
      fibers.forEach(
        (fiber, i) =>
          (fiber.scale.y =
            step === 1 ? 0.8 + Math.sin(time * 3 + i * 0.2) * 0.08 : 1)
      );
      links.forEach(m => fade(m, step === 3));
    });
  }

  if (mode === "sleep") {
    const makeNetwork = (cx: number, color: number) => {
      const pos = [
        v(cx - 0.45, 0.35, 0.15),
        v(cx + 0.15, 0.7, -0.3),
        v(cx + 0.5, 0, 0.35),
        v(cx - 0.15, -0.45, -0.25),
      ];
      pos.forEach(p => sphere(p, 0.17, color));
      return [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 2],
      ].map(
        ([a, b]) =>
          tube(
            [
              pos[a],
              pos[a]
                .clone()
                .lerp(pos[b], 0.5)
                .add(v(0, 0.08, 0.16)),
              pos[b],
            ],
            0.055,
            color,
            0.25
          ).mesh
      );
    };
    const fresh = makeNetwork(-2.35, c.coral),
      stable = makeNetwork(2.35, c.teal);
    label("白天的新學習", v(-2.35, -1.05), 2);
    label("之後的回想", v(2.35, -1.05), 1.8);
    const moon = add(
      new THREE.TorusGeometry(0.5, 0.14, 16, 60, Math.PI * 1.55),
      c.gold,
      v(0, 0.95)
    );
    moon.rotation.z = -0.65;
    const ring = add(
      new THREE.TorusGeometry(0.65, 0.035, 10, 64),
      c.gold,
      v(0, 0.9, -0.1),
      0.3
    );
    label("睡眠中的鞏固", v(0, 1.8), 2.1);
    const first = tube(
      [v(-1.85, 0.1), v(-0.8, -0.25, 0.3), v(0, 0.2)],
      0.04,
      c.coral,
      0.45
    );
    const second = tube(
      [v(0, 0.2), v(0.8, -0.25, -0.25), v(1.9, 0.1)],
      0.04,
      c.teal,
      0.45
    );
    pulse(first.curve, c.gold, [0, 1]);
    pulse(second.curve, c.gold, [2, 3]);
    updates.push((_t, step) => {
      fresh.forEach(m => fade(m, step === 0));
      stable.forEach(m => fade(m, step >= 2));
      moon.material.emissive.setHex(step === 1 ? c.gold : 0);
      moon.material.emissiveIntensity = 0.3;
      fade(ring, step === 2);
    });
  }

  if (mode === "reward") {
    const pivot = add(new THREE.ConeGeometry(0.4, 0.75, 4), c.ink, v(0, -0.8));
    pivot.rotation.y = Math.PI / 4;
    const balance = new THREE.Group();
    balance.position.y = -0.4;
    group.add(balance);
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(5.3, 0.15, 0.7),
      mat(c.teal)
    );
    balance.add(plank);
    const weights: THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshStandardMaterial
    >[][] = [[], []];
    [-1, 1].forEach((sign, side) => {
      for (let i = 0; i < 3; i++) {
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, 24, 16),
          mat(side === 0 ? c.coral : c.gold)
        );
        ball.position.set(
          sign * 2.05 + (i - 1) * 0.22,
          0.36 + i * 0.38,
          (i % 2) * 0.1
        );
        balance.add(ball);
        weights[side].push(ball);
      }
    });
    label("快樂／即時獎勵", v(-2.15, 1.7), 2.4);
    label("不適／想要更多", v(2.15, 1.7), 2.4);
    label("留出觀察的空間", v(0, -1.5), 2.3);
    updates.push((time, step) => {
      balance.rotation.z = [0.22, -0.22, Math.sin(time * 1.5) * 0.24, 0][step];
      weights.forEach((balls, side) =>
        balls.forEach((ball, i) => {
          ball.visible = step === 2 || i === 0;
          ball.material.opacity =
            step === 3
              ? 0.4
              : side === (step === 0 ? 0 : 1) || step === 2
                ? 1
                : 0.25;
          ball.material.transparent = true;
        })
      );
    });
  }
  return {
    update: (time: number, step: number) =>
      updates.forEach(fn => fn(time, step)),
    dispose: () => textures.forEach(texture => texture.dispose()),
  };
}
