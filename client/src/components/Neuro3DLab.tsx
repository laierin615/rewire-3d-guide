import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Pause,
  Play,
  RotateCcw,
  Hand,
  Move3D,
  Sparkles,
} from "lucide-react";

import { lessons, type Mode } from "../data/neuroLessons";
import { buildExtraModel } from "./neuroModels";
const colors = {
  coral: 0xf18069,
  teal: 0x34a89b,
  gold: 0xf2bc4c,
  ink: 0x284854,
  pale: 0xd4e1df,
};

/** Conceptual geometry, not an anatomical or quantitative simulation. */
function Scene({
  mode,
  step,
  playing,
  resetKey,
}: {
  mode: Mode;
  step: number;
  playing: boolean;
  resetKey: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const props = useRef({ step, playing, resetKey });
  props.current = { step, playing, resetKey };
  const rotate = useRef<(delta: number) => void>(() => {});
  const [failed, setFailed] = useState(false);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setNearby(entry.isIntersecting),
      { rootMargin: "480px" }
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element || !nearby) return;
    setFailed(false);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xffffff, 0);
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.set(0, 2.8, 11.7);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa3a4, 2.8));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 5, 4);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xffe2a9, 1.2);
    fill.position.set(3, 0, -2);
    scene.add(fill);
    const group = new THREE.Group();
    scene.add(group);
    const objects: THREE.Object3D[] = [];
    const material = (color: number, opacity = 1) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.38,
        metalness: 0.08,
        transparent: opacity < 1,
        opacity,
      });
    const sphere = (
      pos: THREE.Vector3,
      radius: number,
      color: number,
      opacity = 1
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 28, 20),
        material(color, opacity)
      );
      mesh.position.copy(pos);
      group.add(mesh);
      objects.push(mesh);
      return mesh;
    };
    const tube = (
      points: THREE.Vector3[],
      radius: number,
      color: number,
      opacity = 1
    ) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, radius, 10, false),
        material(color, opacity)
      );
      group.add(mesh);
      objects.push(mesh);
      return { curve, mesh };
    };
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    const pulses: {
      mesh: THREE.Mesh;
      curve: THREE.Curve<THREE.Vector3>;
      steps: number[];
      offset: number;
    }[] = [];
    const pulse = (
      curve: THREE.Curve<THREE.Vector3>,
      color: number,
      steps: number[],
      offset = 0
    ) => {
      const mesh = sphere(curve.getPoint(0), 0.105, color);
      (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(color);
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7;
      pulses.push({ mesh, curve, steps, offset });
    };
    let newPath: THREE.Mesh | undefined;
    let oldPath: THREE.Mesh | undefined;
    let chemical: THREE.Mesh[] = [];
    const nodes: THREE.Mesh[] = [];
    let extraModel: ReturnType<typeof buildExtraModel> | undefined;
    if (mode === "synapse") {
      const left = sphere(v(-2.1, 0.1), 0.47, colors.coral);
      const right = sphere(v(2.12, 0.08), 0.48, colors.teal);
      nodes.push(left, right);
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const z = Math.sin(angle * 2) * 0.65;
        const end = v(
          -2.1 + Math.cos(angle) * 0.9 - 0.25,
          0.1 + Math.sin(angle) * 0.98,
          z
        );
        const branch = tube(
          [
            v(-2.1, 0.1),
            v(
              -2.1 + Math.cos(angle) * 0.5,
              0.1 + Math.sin(angle) * 0.6,
              z * 0.6
            ),
            end,
          ],
          0.045,
          colors.coral
        );
        sphere(end, 0.095, colors.coral);
        if (i === 3)
          pulse(new THREE.LineCurve3(end, v(-2.1, 0.1)), colors.gold, [0]);
        const rend = v(
          2.12 + Math.cos(angle) * 0.95 + 0.23,
          0.08 + Math.sin(angle) * 0.9,
          -z
        );
        tube(
          [
            v(2.12, 0.08),
            v(
              2.12 + Math.cos(angle) * 0.5,
              0.08 + Math.sin(angle) * 0.45,
              -z * 0.5
            ),
            rend,
          ],
          0.042,
          colors.teal
        );
        sphere(rend, 0.08, colors.teal);
      }
      const axon = tube(
        [v(-1.7, 0.05), v(-1.1, -0.12, 0.1), v(-0.6, 0.07, 0.1), v(-0.28, 0.1)],
        0.085,
        colors.coral
      );
      sphere(v(-0.25, 0.1), 0.2, colors.coral);
      sphere(v(0.35, 0.1), 0.23, colors.teal);
      tube(
        [v(0.35, 0.1), v(0.9, 0.05, -0.15), v(1.7, 0.08)],
        0.075,
        colors.teal
      );
      pulse(axon.curve, colors.gold, [1]);
      pulse(
        new THREE.CatmullRomCurve3([v(0.35, 0.1), v(1.1, 0.05), v(2.12, 0.08)]),
        colors.gold,
        [3]
      );
      chemical = Array.from({ length: 8 }, (_, i) =>
        sphere(
          v(
            -0.15 + (i % 4) * 0.12,
            -0.08 + Math.floor(i / 4) * 0.24,
            ((i % 3) - 1) * 0.14
          ),
          0.055,
          colors.gold
        )
      );
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.62, 0.012, 8, 64),
        material(colors.gold, 0.7)
      );
      ring.position.set(0.03, 0.1, 0);
      group.add(ring);
      objects.push(ring);
    } else if (mode === "practice") {
      nodes.push(
        sphere(v(-3, 0), 0.33, colors.ink),
        sphere(v(3, 0), 0.33, colors.ink)
      );
      const old = tube(
        [v(-3, 0), v(-1.5, 1, 0.5), v(0.7, 1.3, -0.5), v(3, 0)],
        0.14,
        colors.coral
      );
      oldPath = old.mesh;
      (old.mesh.material as THREE.MeshStandardMaterial).transparent = true;
      const fresh = tube(
        [v(-3, 0), v(-1.3, -0.9, -0.6), v(0.5, -1, 0.65), v(3, 0)],
        0.17,
        colors.teal
      );
      newPath = fresh.mesh;
      [v(-1.5, 1, 0.5), v(0.7, 1.3, -0.5)].forEach(p =>
        sphere(p, 0.23, colors.coral)
      );
      [v(-1.3, -0.9, -0.6), v(0.5, -1, 0.65)].forEach(p =>
        nodes.push(sphere(p, 0.23, colors.teal))
      );
      pulse(old.curve, colors.gold, [0]);
      pulse(fresh.curve, colors.gold, [1, 2, 3]);
      pulse(fresh.curve, colors.gold, [2, 3], 0.5);
    } else if (mode !== "regulation") {
      extraModel = buildExtraModel(mode, group, { sphere, tube, pulse });
    } else {
      const positions = [
        v(-3, 0),
        v(-1.5, 1, 0.2),
        v(0.8, 1.2, -0.4),
        v(-0.6, -1, 0.6),
        v(2.8, -0.3),
      ];
      const ns = positions.map((p, i) =>
        sphere(
          p,
          i === 1 ? 0.43 : 0.35,
          [colors.ink, colors.coral, colors.coral, colors.gold, colors.teal][i]
        )
      );
      nodes.push(...ns);
      const alert = tube(
        [positions[0], v(-2.4, 0.8), positions[1]],
        0.07,
        colors.coral
      );
      const body = tube(
        [positions[1], v(-0.2, 1.7, -0.3), positions[2]],
        0.07,
        colors.coral,
        0.5
      );
      const pause = tube(
        [positions[2], v(0.6, -0.4, 0.3), positions[3]],
        0.07,
        colors.gold
      );
      const choice = tube(
        [positions[3], v(1.4, -1, 0.2), positions[4]],
        0.07,
        colors.teal
      );
      pulse(alert.curve, colors.gold, [0]);
      pulse(body.curve, colors.gold, [1]);
      pulse(pause.curve, colors.gold, [2]);
      pulse(choice.curve, colors.gold, [3]);
      ns.forEach((node, i) => {
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(0.53, 0.025, 8, 64),
          material(
            [colors.ink, colors.coral, colors.coral, colors.gold, colors.teal][
              i
            ],
            0.4
          )
        );
        halo.position.copy(node.position);
        group.add(halo);
        objects.push(halo);
      });
    }
    // Ground plane grid gives a depth reference without suggesting anatomical coordinates.
    const grid = new THREE.GridHelper(10, 20, 0xa9c8c4, 0xdce9e6);
    grid.position.y = -1.9;
    scene.add(grid);
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.42;
    let y = -0.13,
      x = 0.08,
      dragging = false,
      start = { x: 0, y: 0, rx: 0, ry: 0 },
      visible = true,
      dirty = true,
      raf = 0,
      time = 0,
      last = performance.now(),
      previous = -1,
      lastReset = resetKey;
    const paint = () => {
      group.rotation.set(x, y, 0);
      renderer.render(scene, camera);
    };
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      if (!["synapse", "practice", "regulation"].includes(mode)) {
        const distance = Math.max(7.4, 13 / camera.aspect);
        camera.position.set(0, distance * 0.22, distance);
        camera.lookAt(0, 0.15, 0);
      }
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(element);
    resize();
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        dirty = true;
      },
      { threshold: 0.05 }
    );
    io.observe(element);
    const down = (e: PointerEvent) => {
      dragging = true;
      start = { x: e.clientX, y: e.clientY, rx: x, ry: y };
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      y = start.ry + (e.clientX - start.x) * 0.007;
      x = THREE.MathUtils.clamp(
        start.rx + (e.clientY - start.y) * 0.005,
        -0.6,
        0.6
      );
      dirty = true;
    };
    const up = () => {
      dragging = false;
    };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    rotate.current = delta => {
      y += delta;
      dirty = true;
    };
    const frame = (now: number) => {
      const delta = Math.max(0, Math.min((now - last) / 1000, 0.05));
      last = now;
      const p = props.current;
      if (p.resetKey !== lastReset) {
        x = 0.08;
        y = -0.13;
        time = 0;
        dirty = true;
        lastReset = p.resetKey;
      }
      if (p.step !== previous) {
        dirty = true;
        previous = p.step;
        time = 0;
        if (newPath) {
          const scale = [0.22, 0.4, 0.7, 1][p.step];
          newPath.geometry.dispose();
          const points = [
            v(-3, 0),
            v(-1.3, -0.9, -0.6),
            v(0.5, -1, 0.65),
            v(3, 0),
          ];
          newPath.geometry = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points),
            64,
            0.17 * scale,
            10,
            false
          );
        }
        if (oldPath)
          (oldPath.material as THREE.MeshStandardMaterial).opacity =
            1 - p.step * 0.18;
        chemical.forEach(mesh => (mesh.visible = p.step === 2));
        pulses.forEach(q => (q.mesh.visible = q.steps.includes(p.step)));
      }
      if (visible) {
        if (p.playing) {
          time += delta;
          dirty = true;
        }
        if (dirty) {
          pulses.forEach(q => {
            if (q.mesh.visible)
              q.mesh.position.copy(
                q.curve.getPoint(
                  (time * 0.34 + q.offset + (p.playing ? 0 : 0.55)) % 1
                )
              );
          });
          chemical.forEach((mesh, i) => {
            mesh.position.x = -0.18 + ((time * 0.18 + i * 0.065) % 0.46);
          });
          nodes.forEach((node, i) => {
            const scale =
              mode === "regulation" && i === [1, 2, 3, 4][p.step] ? 1.1 : 1;
            node.scale.setScalar(scale);
          });
          extraModel?.update(time, p.step);
          paint();
          dirty = false;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      rotate.current = () => {};
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse(obj => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.LineSegments ||
          obj instanceof THREE.Sprite
        ) {
          if (!(obj instanceof THREE.Sprite)) obj.geometry.dispose();
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach(m => m.dispose());
        }
      });
      extraModel?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [mode, nearby]);

  return (
    <div className="lab-scene-shell">
      <div
        className="lab-scene"
        ref={host}
        role="img"
        aria-label={`${lessons[mode].title}立體概念示意；${lessons[mode].steps[step].observe}`}
      />
      {failed && (
        <div className="lab-fallback">
          <Move3D size={42} />
          <strong>{lessons[mode].steps[step].title}</strong>
          <p>
            此瀏覽器未能顯示 3D。你仍可使用下方四步驟與右側解說閱讀同一個概念。
          </p>
        </div>
      )}
      <div className="scene-caption">
        <span>
          <Hand size={13} />
          拖曳旋轉
        </span>
        <span>立體概念示意</span>
      </div>
      <div className="scene-rotate-controls">
        <button onClick={() => rotate.current(-0.35)} aria-label="向左旋轉模型">
          <ArrowLeft size={14} />
        </button>
        <button onClick={() => rotate.current(0.35)} aria-label="向右旋轉模型">
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Neuro3DLab({
  initialMode = "synapse",
  embedded = false,
  id = "lab3d",
}: {
  initialMode?: Mode;
  embedded?: boolean;
  id?: string;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [resetKey, setResetKey] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const lesson = lessons[mode];
  const current = lesson.steps[step];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !autoAdvance || !visible) return;
    const timer = window.setInterval(() => setStep(s => (s + 1) % 4), 6000);
    return () => window.clearInterval(timer);
  }, [playing, autoAdvance, visible, mode]);
  const select = (m: Mode) => {
    setMode(m);
    setStep(0);
    setResetKey(n => n + 1);
  };
  return (
    <section
      id={id}
      className={`section lab-section ${embedded ? "lab-inline" : ""}`}
      ref={root}
      aria-labelledby={`${id}-title`}
    >
      <div className="container-wide">
        {embedded ? (
          <div className="lab-inline-heading">
            <span>{lesson.en}</span>
            <h3 id={`${id}-title`}>{lesson.title}</h3>
          </div>
        ) : (
          <div className="lab-heading">
            <div>
              <div className="section-label eyebrow">01 / 看見改變如何發生</div>
              <h2 className="section-title" id={`${id}-title`}>
                把抽象概念，
                <br />
                <span>變成可以看懂的過程。</span>
              </h2>
            </div>
            <p className="section-intro">
              選一個概念，旋轉觀察，再按步驟解說。用一個生活問題開始，把理解帶回自己的下一次選擇。
            </p>
          </div>
        )}
        {!embedded && (
          <div className="lab-tabs" aria-label="3D 概念動畫">
            {(
              [
                ["synapse", "01", "突觸傳訊"],
                ["practice", "02", "重複與新路徑"],
                ["regulation", "03", "壓力與調節"],
              ] as const
            ).map(([id, n, title]) => (
              <button
                key={id}
                className={mode === id ? "active" : ""}
                aria-pressed={mode === id}
                onClick={() => select(id)}
              >
                <span>{n}</span>
                {title}
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        )}
        <div className="lab-layout">
          <div className="lab-visual">
            <div className="lab-visual-header">
              <span className="eyebrow">{lesson.en}</span>
              <span className="lab-live">
                <i className={playing ? "playing" : ""} />
                {playing ? "動畫播放中" : "畫面已暫停"}
              </span>
            </div>
            <Scene
              mode={mode}
              step={step}
              playing={playing}
              resetKey={resetKey}
            />
            <div className="scene-key" aria-label="模型顏色圖例">
              {{
                synapse: [
                  ["coral", "傳訊神經元"],
                  ["teal", "接收神經元"],
                  ["gold", "訊息亮點"],
                ],
                practice: [
                  ["coral", "熟悉的舊路"],
                  ["teal", "練習的新路"],
                  ["gold", "反覆使用"],
                ],
                regulation: [
                  ["ink", "觸發線索"],
                  ["coral", "警報／身體動員"],
                  ["gold", "覺察與暫停"],
                  ["teal", "新的選擇"],
                ],
                attention: [
                  ["teal", "朋友的話"],
                  ["gold", "鄰桌談話"],
                  ["coral", "窗外狗吠"],
                  ["ink", "篩選框"],
                ],
                muscle: [
                  ["coral", "肌肉束"],
                  ["teal", "神經網絡"],
                  ["gold", "溝通訊號"],
                ],
                sleep: [
                  ["coral", "新的學習"],
                  ["gold", "睡眠與整合"],
                  ["teal", "鞏固後的記憶"],
                ],
                reward: [
                  ["coral", "即時獎勵"],
                  ["gold", "想要更多"],
                  ["teal", "平衡板"],
                ],
              }[mode].map(([color, label]) => (
                <span key={label}>
                  <i className={color} />
                  {label}
                </span>
              ))}
            </div>
            <div className="lab-steps" aria-label="動畫解說步驟">
              {lesson.steps.map((s, i) => (
                <button
                  key={s.title}
                  className={step === i ? "active" : ""}
                  aria-pressed={step === i}
                  onClick={() => {
                    setStep(i);
                    setAutoAdvance(false);
                  }}
                >
                  <span>0{i + 1}</span>
                  <strong>{s.title}</strong>
                </button>
              ))}
            </div>
            <div className="lab-playbar">
              <button className="lab-play" onClick={() => setPlaying(p => !p)}>
                {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
                {playing ? "暫停動畫" : "播放動畫"}
              </button>
              <button
                onClick={() => {
                  setStep(s => (s + 1) % 4);
                  setAutoAdvance(false);
                }}
              >
                下一步 <ArrowRight size={15} />
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setResetKey(n => n + 1);
                  setAutoAdvance(false);
                }}
                aria-label="重播並重設視角"
              >
                <RotateCcw size={15} />
                重播
              </button>
              <label>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={e => setAutoAdvance(e.target.checked)}
                />
                自動換步
              </label>
            </div>
          </div>
          <article className="lab-explanation" aria-live="polite">
            <div className="lab-case">
              <span>
                {["attention", "muscle", "sleep", "reward"].includes(mode)
                  ? "從書中例子開始"
                  : "生活情境"}
              </span>
              <p>{lesson.situation}</p>
            </div>
            <div className="lab-step-detail">
              <span className="eyebrow">STEP 0{step + 1} / 04</span>
              <h3>{current.title}</h3>
              <p>{current.explain}</p>
              <div className="lab-observe">
                <EyeIcon />
                <div>
                  <strong>看哪裡？</strong>
                  <p>{current.observe}</p>
                </div>
              </div>
              <div className="lab-question">
                <Sparkles size={17} />
                <div>
                  <strong>問問讀者</strong>
                  <p>{current.question}</p>
                </div>
              </div>
            </div>
            <div className="lab-source">
              <BookOpen size={14} />
              <span>{lesson.source}</span>
            </div>
          </article>
        </div>
        <div className="lab-bottom">
          <p>
            <strong>一句話帶走</strong>
            {lesson.takeaway}
          </p>
          <small>
            動畫依書中概念重整；形狀、線粗與亮點為解說符號，不表示真實解剖位置、測量數值或改變所需時間。
          </small>
        </div>
        {mode === "regulation" && (
          <details className="stress-cycle">
            <summary>展開原書的完整壓力迴圈</summary>
            <ol>
              {[
                "壓力",
                "無能力應付情緒",
                "焦慮",
                "容易被觸發",
                "高度警覺",
                "延宕",
                "扭曲的負面自我信念",
                "低自尊",
                "無能力把基本需要列為優先",
                "無助益的應對機制",
              ].map((label, i) => (
                <li key={label}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                  <b aria-hidden="true">→</b>
                </li>
              ))}
            </ol>
            <p>
              無助益的應對機制又把人帶回壓力，形成循環。作者說：「我們需要打破這個循環！」找出一個你最容易介入的環節，練習不同的回應。
              <small>對應：階段一〈打破循環〉</small>
            </p>
          </details>
        )}
      </div>
    </section>
  );
}
function EyeIcon() {
  return <Move3D size={17} />;
}
