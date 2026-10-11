import { ArrowRight, Check, Link2, MoveHorizontal, Scale } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** 只在看得到時才跑的計時器 */
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- 連鎖：言語 → 想法 → 感覺 → 行為 → 信念 ---------- */
export function ChainFlow({ title, steps, note, chips }: { title: string; steps: string[]; note?: string; chips?: { title: string; items: string[] } }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!inView || reducedMotion()) return;
    const id = window.setInterval(() => setActive(i => (i + 1) % (steps.length + 1)), 1100);
    return () => window.clearInterval(id);
  }, [inView, steps.length]);
  return (
    <div className="widget chain" ref={ref}>
      <h5>
        <Link2 size={20} aria-hidden="true" />
        {title}
      </h5>
      <ol className="chain-row">
        {steps.map((s, i) => (
          <li key={s} className={active >= steps.length || i <= active ? "on" : ""}>
            <span className="chain-dot">{i + 1}</span>
            <strong>{s}</strong>
            {i < steps.length - 1 && <ArrowRight className="chain-arrow" size={20} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      {note && <p className="widget-note">{note}</p>}
      {chips && (
        <div className="chain-chips">
          <span>{chips.title}</span>
          <ul>
            {chips.items.map(c => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- 觸發與反應之間的空間 ---------- */
export function SpaceTimeline() {
  const [mode, setMode] = useState<"old" | "new">("old");
  const [practice, setPractice] = useState(2);
  const gap = mode === "old" ? 0 : 18 + practice * 16;
  return (
    <div className="widget space">
      <h5>
        <MoveHorizontal size={20} aria-hidden="true" />
        觸發與反應之間的空間
      </h5>
      <div className="space-tabs" role="group" aria-label="切換迴路">
        <button type="button" aria-pressed={mode === "old"} onClick={() => setMode("old")}>
          舊迴路
        </button>
        <button type="button" aria-pressed={mode === "new"} onClick={() => setMode("new")}>
          新迴路
        </button>
      </div>
      <div className={`space-track ${mode}`}>
        <span className="space-node trigger">不中聽的話</span>
        <span className="space-gap" style={{ flexBasis: `${gap}%` }}>
          {mode === "old" ? <i>立即放電</i> : <i>暫停・騰出時間</i>}
        </span>
        <span className={`space-node result ${mode}`}>{mode === "old" ? "惱怒生氣" : "重新架構"}</span>
      </div>
      {mode === "new" && (
        <label className="space-slider">
          <span>練習愈久，空間愈大</span>
          <input type="range" min={1} max={4} value={practice} onChange={e => setPractice(Number(e.target.value))} aria-label="練習程度" />
          <small>{["剛開始", "練習一陣子", "常常練習", "成了習慣"][practice - 1]}</small>
        </label>
      )}
      <p className="widget-note">
        {mode === "old"
          ? "剛開始幾乎沒有空隙：一被觸發，反應就衝出來。"
          : "空間不會一夜之間變大。就算這次又衝出口，也不要自責，大腦會從錯誤中學習。"}
      </p>
    </div>
  );
}

/* ---------- 兩種方法對照 ---------- */
export function CompareCards({ title, items }: { title: string; items: { name: string; text: string; example?: string }[] }) {
  return (
    <div className="widget compare">
      <h5>
        <Scale size={20} aria-hidden="true" />
        {title}
      </h5>
      <div className="compare-grid">
        {items.map((it, i) => (
          <article key={it.name} className={`compare-${i}`}>
            <strong>{it.name}</strong>
            <p>{it.text}</p>
            {it.example && (
              <p className="compare-ex">
                <b>書中例子</b>
                {it.example}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------- 可勾選的清單 ---------- */
export function Checklist({ steps }: { steps: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => steps.map(() => false));
  const count = done.filter(Boolean).length;
  return (
    <div className="checklist">
      <ul>
        {steps.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              aria-pressed={done[i]}
              className={done[i] ? "on" : ""}
              onClick={() => setDone(d => d.map((v, k) => (k === i ? !v : v)))}
            >
              <span className="check-box" aria-hidden="true">
                {done[i] && <Check size={15} />}
              </span>
              {s}
            </button>
          </li>
        ))}
      </ul>
      <p className="checklist-count" aria-live="polite">
        你已經做到 {count} / {steps.length} 項
      </p>
    </div>
  );
}

/* ---------- 編號步驟卡 ---------- */
export function StepCards({ steps }: { steps: string[] }) {
  return (
    <ol className="step-cards">
      {steps.map((s, i) => {
        const [head, ...rest] = s.split("：");
        return (
          <li key={s}>
            <span className="step-no">{i + 1}</span>
            {rest.length ? (
              <>
                <strong>{head}</strong>
                <p>{rest.join("：")}</p>
              </>
            ) : (
              <p>{s}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
