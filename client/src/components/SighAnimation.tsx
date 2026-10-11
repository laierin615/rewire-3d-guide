import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 生理性嘆息示意動畫。步驟依書中方法：
 * 短促地連續吸氣兩次（最好用鼻子）→ 閉氣一秒 → 用嘴巴長而緩慢地完全呼氣。
 * 秒數與比例是示意，不是書中規定的數值。
 */

type PhaseId = "in1" | "in2" | "hold" | "out" | "rest";

const PHASES: { id: PhaseId; ms: number; step: number; title: string; text: string }[] = [
  { id: "in1", ms: 1400, step: 0, title: "吸第一口", text: "用鼻子短促地吸氣（做不到也可以用嘴巴）。" },
  { id: "in2", ms: 700, step: 1, title: "再補一口", text: "緊接著再吸一小口，讓塌陷的肺泡重新張開。" },
  { id: "hold", ms: 1000, step: 2, title: "閉氣一秒", text: "停住，讓肺部充分擴張。" },
  { id: "out", ms: 5200, step: 3, title: "長長吐氣", text: "用嘴巴慢慢、完全地吐氣，排出多餘的二氧化碳，告訴大腦：現在不危險了。" },
  { id: "rest", ms: 1700, step: 4, title: "身體慢下來", text: "心跳跟著下降，身體回到放鬆的狀態。" },
];
const CYCLE = PHASES.reduce((n, p) => n + p.ms, 0);
const STEPS = ["短促吸一口（鼻子）", "再補吸一口", "閉氣一秒", "用嘴巴長而慢地吐氣"];

const easeOut = (p: number) => 1 - (1 - p) * (1 - p);
const smooth = (p: number) => p * p * (3 - 2 * p);

function phaseAt(t: number) {
  let acc = 0;
  for (const ph of PHASES) {
    if (t < acc + ph.ms) return { ph, p: (t - acc) / ph.ms };
    acc += ph.ms;
  }
  return { ph: PHASES[PHASES.length - 1], p: 1 };
}

/** 肺容量（0.3 呼盡 ～ 1 吸滿） */
function volume(id: PhaseId, p: number) {
  if (id === "in1") return 0.3 + 0.48 * easeOut(p);
  if (id === "in2") return 0.78 + 0.22 * easeOut(p);
  if (id === "hold") return 1;
  if (id === "out") return 1 - 0.7 * smooth(p);
  return 0.3;
}

/** 肺泡張開程度：第一輪從塌陷開始，第二口吸氣把它們撐開 */
function openness(id: PhaseId, p: number, first: boolean) {
  const start = first ? 0.25 : 0.75;
  if (id === "in1") return start + (first ? 0.15 : 0.05) * p;
  if (id === "in2") return (first ? 0.4 : 0.8) + (first ? 0.6 : 0.2) * easeOut(p);
  return 1;
}

// 肺泡群：支氣管末端的小氣囊
const LEFT_SACS: [number, number][] = [
  [92, 132], [80, 158], [96, 184], [78, 210], [100, 232], [122, 250], [118, 150], [126, 206],
];
const SACS = [...LEFT_SACS.map(([x, y]) => [x, y] as const), ...LEFT_SACS.map(([x, y]) => [360 - x, y] as const)];

// 呼吸曲線（一個循環）
function curvePath(w: number, h: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * CYCLE;
    const { ph, p } = phaseAt(Math.min(t, CYCLE - 1));
    const v = volume(ph.id, p);
    pts.push(`${((t / CYCLE) * w).toFixed(1)},${(h - 6 - (v - 0.25) / 0.8 * (h - 14)).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

export default function SighAnimation() {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [playing, setPlaying] = useState(!reduced);
  const [inView, setInView] = useState(false);
  const [elapsed, setElapsed] = useState(reduced ? PHASES[0].ms + PHASES[1].ms + 500 : 0);
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) {
      last.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (last.current !== null) {
        const dt = Math.min(64, now - last.current);
        setElapsed(e => e + dt);
      }
      last.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView]);

  const round = Math.floor(elapsed / CYCLE);
  const t = elapsed % CYCLE;
  const { ph, p } = phaseAt(t);
  const v = volume(ph.id, p);
  const open = openness(ph.id, p, round === 0);
  const inhaling = ph.id === "in1" || ph.id === "in2";
  const exhaling = ph.id === "out";
  const sx = 0.86 + 0.14 * v;
  const sy = 0.8 + 0.2 * v;

  // 氣流粒子：吸氣時氧氣沿氣管往下，吐氣時二氧化碳往上
  const flow = Array.from({ length: 6 }, (_, k) => {
    const s = (p * 1.4 - k * 0.18 + 1) % 1;
    return s;
  });

  const CW = 300;
  const CH = 64;
  const curve = useMemo(() => curvePath(CW, CH), []);
  const cursorX = (t / CYCLE) * CW;

  return (
    <div className="sigh" ref={wrap}>
      <div className="sigh-stage">
        <svg viewBox="0 0 360 300" className="sigh-svg" role="img" aria-label={`生理性嘆息示意：${ph.title}`}>
          <defs>
            <radialGradient id="sighLung" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#ffd9d2" />
              <stop offset="100%" stopColor="#f3a99c" />
            </radialGradient>
            <clipPath id="sighCurveClip">
              <rect x="0" y="0" width={cursorX} height={CH} />
            </clipPath>
          </defs>

          {/* 入口：鼻子吸、嘴巴吐 */}
          <g className={`sigh-port ${inhaling ? "on" : ""}`}>
            <rect x="96" y="8" width="66" height="28" rx="14" />
            <text x="129" y="27">鼻子吸</text>
          </g>
          <g className={`sigh-port out ${exhaling ? "on" : ""}`}>
            <rect x="198" y="8" width="66" height="28" rx="14" />
            <text x="231" y="27">嘴巴吐</text>
          </g>
          <path d="M162 22 C172 22 176 34 180 44 M198 22 C188 22 184 34 180 44" className="sigh-inlet" />

          {/* 氣管與支氣管 */}
          <g transform={`translate(180 150) scale(${sx} ${sy}) translate(-180 -150)`}>
            <path
              className="sigh-lobe"
              d="M168 92 C120 84 66 118 58 186 C52 238 74 268 110 266 C142 264 160 246 164 214 C168 170 170 124 168 92 Z"
            />
            <path
              className="sigh-lobe"
              d="M192 92 C240 84 294 118 302 186 C308 238 286 268 250 266 C218 264 200 246 196 214 C192 170 190 124 192 92 Z"
            />
            <path
              className="sigh-bronchi"
              d="M180 44 V110 M180 110 C164 118 150 128 140 146 M140 146 C130 160 104 156 92 132 M140 146 C128 170 100 172 80 158 M140 146 C138 176 114 190 96 184 M140 146 C146 186 132 206 126 206 M126 206 C112 214 90 214 78 210 M126 206 C122 226 110 232 100 232 M126 206 C126 232 124 246 122 250 M140 146 C134 150 124 150 118 150
                 M180 110 C196 118 210 128 220 146 M220 146 C230 160 256 156 268 132 M220 146 C232 170 260 172 280 158 M220 146 C222 176 246 190 264 184 M220 146 C214 186 228 206 234 206 M234 206 C248 214 270 214 282 210 M234 206 C238 226 250 232 260 232 M234 206 C234 232 236 246 238 250 M220 146 C226 150 236 150 242 150"
            />
            {SACS.map(([x, y], i) => {
              const late = i % 3 === 1; // 部分肺泡塌得比較深
              const o = Math.max(0, Math.min(1, late ? open * 1.08 - 0.08 : open));
              return (
                <g key={i} className="sigh-sac" style={{ opacity: 0.55 + 0.45 * o }}>
                  <circle cx={x - 5} cy={y} r={2.5 + 4 * o} />
                  <circle cx={x + 4} cy={y - 4} r={2.2 + 3.6 * o} />
                  <circle cx={x + 3} cy={y + 5} r={2 + 3.4 * o} />
                </g>
              );
            })}
          </g>

          {/* 氣流 */}
          {(inhaling || exhaling) &&
            flow.map((s, k) => {
              const y = inhaling ? 40 + s * 76 : 116 - s * 76;
              const x = inhaling ? 172 - (1 - Math.min(1, s * 3)) * 18 : 188 + (1 - Math.min(1, s * 3)) * 18;
              return (
                <circle
                  key={k}
                  cx={x}
                  cy={y}
                  r={inhaling ? 3.6 : 3.2}
                  className={inhaling ? "sigh-o2" : "sigh-co2"}
                  style={{ opacity: Math.sin(s * Math.PI) }}
                />
              );
            })}

          {/* 心跳：吐完氣後變慢 */}
          <g className={`sigh-heart ${ph.id === "rest" || ph.id === "out" ? "calm" : ""}`} transform="translate(180 222)">
            <path d="M0 8 C-14 -4 -10 -16 0 -9 C10 -16 14 -4 0 8 Z" />
          </g>
        </svg>

        <div className="sigh-legend" aria-hidden="true">
          <span><i className="dot o2" />氧氣</span>
          <span><i className="dot co2" />二氧化碳</span>
          <span><i className="dot sac" />肺泡（肺部的小氣囊）</span>
        </div>
      </div>

      <div className="sigh-side">
        <div className="sigh-now" aria-live="polite">
          <span className="sigh-badge">{ph.step < 4 ? `步驟 ${ph.step + 1}` : "結果"}</span>
          <strong>{ph.title}</strong>
          <p>{ph.text}</p>
        </div>

        <ol className="sigh-steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === ph.step ? "on" : i < ph.step ? "done" : ""}>
              {s}
            </li>
          ))}
        </ol>

        <svg viewBox={`0 0 ${CW} ${CH + 18}`} className="sigh-curve" aria-hidden="true">
          <path d={curve} className="sigh-curve-bg" />
          <path d={curve} className="sigh-curve-fg" clipPath="url(#sighCurveClip)" />
          <line x1={cursorX} x2={cursorX} y1="0" y2={CH} className="sigh-cursor" />
          {(() => {
            let acc = 0;
            return PHASES.slice(0, 4).map(phase => {
              const x = ((acc + phase.ms / 2) / CYCLE) * CW;
              acc += phase.ms;
              const label = phase.id === "in1" ? "吸" : phase.id === "in2" ? "吸" : phase.id === "hold" ? "停" : "吐";
              return (
                <text key={phase.id} x={x} y={CH + 14} className={phase.id === ph.id ? "on" : ""}>
                  {label}
                </text>
              );
            });
          })()}
        </svg>

        <div className="sigh-ctrl">
          <button type="button" onClick={() => setPlaying(x => !x)} aria-pressed={playing}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            <span>{playing ? "暫停" : "播放"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setElapsed(0);
              setPlaying(true);
            }}
          >
            <RotateCcw size={15} />
            <span>從頭</span>
          </button>
          <small>示意動畫：秒數與比例僅供跟做參考</small>
        </div>
      </div>
    </div>
  );
}
