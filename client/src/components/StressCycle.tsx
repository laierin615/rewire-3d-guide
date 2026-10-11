import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/** 書中〈打破循環〉開頭的「打破惡性循環」圖：十個環節依序推動，最後回到壓力。 */
const STEPS: string[][] = [
  ["壓力"],
  ["無能力", "應付情緒"],
  ["焦慮"],
  ["容易被觸發"],
  ["高度警覺"],
  ["延宕"],
  ["扭曲的", "負面自我信念"],
  ["低自尊"],
  ["無能力把基本需要", "列為優先之務"],
  ["無助益的", "應對機制"],
];

const C = 320;
const N = STEPS.length;
const angle = (i: number) => -Math.PI / 2 + (i / N) * Math.PI * 2;

/** 兩個節點之間沿圓周的弧線（留空給節點） */
function arc(i: number, R: number) {
  const gap = 0.2;
  const a0 = angle(i) + gap;
  const a1 = angle(i + 1) - gap;
  const [x0, y0] = [C + R * Math.cos(a0), C + R * Math.sin(a0)];
  const [x1, y1] = [C + R * Math.cos(a1), C + R * Math.sin(a1)];
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

export default function StressCycle() {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLElement>(null);
  // 手機上把圓縮小、字放大，避免字太小
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const R = small ? 214 : 236;
  const FS = small ? 23 : 17;
  const LH = small ? 27 : 22;
  const CORE = small ? 112 : 128;
  const pos = (i: number) => [C + R * Math.cos(angle(i)), C + R * Math.sin(angle(i))] as const;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % N), 1300);
    return () => window.clearInterval(id);
  }, [playing, inView]);

  const choose = (i: number) => {
    setActive(i);
    setPlaying(false);
  };

  return (
    <section className="cycle" ref={wrap} aria-labelledby="cycle-title">
      <header className="cycle-head">
        <span className="cycle-kicker">打破循環</span>
        <h3 id="cycle-title">壓力循環：一環推著一環，最後又回到壓力</h3>
        <p>作者把慢性壓力畫成一個圈。每一環都會把人推向下一環，繞完一圈，又回到起點。</p>
      </header>

      <div className="cycle-body">
        <svg viewBox={small ? "10 10 620 620" : "0 0 640 640"} className="cycle-svg" role="img" aria-label={`壓力循環，目前：${STEPS[active].join("")}`}>
          <defs>
            <marker id="cycleArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 Z" className="cycle-arrowhead" />
            </marker>
          </defs>

          <circle cx={C} cy={C} r={R} className="cycle-track" />
          {STEPS.map((_, i) => (
            <path
              key={`arc-${i}`}
              d={arc(i, R)}
              className={`cycle-arc ${i === active ? "on" : ""} ${i === N - 1 ? "back" : ""}`}
              markerEnd="url(#cycleArrow)"
            />
          ))}

          {/* 中央 */}
          <circle cx={C} cy={C} r={CORE} className="cycle-core" />
          <text x={C} y={C - 22} className="cycle-core-title">
            壓力循環
          </text>
          <text x={C} y={C + 14} className="cycle-core-now">
            {STEPS[active].join("")}
          </text>
          <text x={C} y={C + 48} className="cycle-core-hint">
            {active === N - 1 ? "又回到壓力 ↻" : `第 ${active + 1} 環 / 共 ${N} 環`}
          </text>

          {STEPS.map((lines, i) => {
            const [x, y] = pos(i);
            const w = Math.max(...lines.map(l => l.length)) * FS + 26;
            const h = lines.length * LH + 18;
            const on = i === active;
            return (
              <g
                key={lines.join("")}
                className={`cycle-node ${on ? "on" : ""} ${i === 0 ? "start" : ""}`}
                transform={`translate(${x} ${y})`}
                role="button"
                tabIndex={0}
                aria-label={`第 ${i + 1} 環：${lines.join("")}`}
                onClick={() => choose(i)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(i);
                  }
                }}
              >
                <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2 > 24 ? 20 : h / 2} />
                <circle cx={-w / 2 + 2} cy={-h / 2 + 2} r={11} className="cycle-num" />
                <text x={-w / 2 + 2} y={-h / 2 + 6} className="cycle-num-text">
                  {i + 1}
                </text>
                {lines.map((l, k) => (
                  <text key={l} x={0} y={(k - (lines.length - 1) / 2) * LH + FS * 0.36} className="cycle-label" style={{ fontSize: FS }}>
                    {l}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>

        <div className="cycle-side">
          <p className="cycle-quote">「我們需要打破這個循環！」</p>
          <p>點任何一環，停下來看看：你最常卡在哪一環？</p>
          <button type="button" onClick={() => setPlaying(p => !p)} aria-pressed={playing}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            <span>{playing ? "暫停" : "繼續繞圈"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
