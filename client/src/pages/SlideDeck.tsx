import { ArrowLeft, ArrowRight, Maximize2, Minimize2, NotebookText, Pause, Play, RotateCcw, MonitorUp, Home as HomeIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import slidesData from "../data/slides.json";
import { guideLayers } from "../data/guideLayers";
import { sceneByChapter } from "../data/islandScenes";
import type { Mode } from "../data/neuroLessons";
import { DecodeCards } from "../components/HeroIntro";
import FormulaShowcase from "../components/FormulaShowcase";
import IslandScene from "../components/IslandScene";
import Neuro3DLab from "../components/Neuro3DLab";
import StressCycle from "../components/StressCycle";
import { markKeys } from "../components/KeyMark";
import "../deck.css";

type Card = { h: string; p: string };
export type Slide = {
  id: string;
  section: "open" | "layer1" | "layer2" | "layer3" | "layer4" | "qa" | "close";
  kind: "title" | "question" | "embed" | "text" | "cards" | "interact" | "cover" | "recap" | "summary" | "closing" | "qa" | "qa-answer";
  kicker?: string;
  title: string;
  lead?: string;
  points?: string[];
  steps?: string[];
  cards?: Card[];
  quote?: string;
  aside?: string;
  question?: string;
  embed?: string;
  tag?: string;
  seconds?: number;
  key?: string;
  book?: string;
  theory?: string;
  pitfall?: string;
  bridge?: string;
  notes: string;
};

export const slides = slidesData as Slide[];

const sectionLabel: Record<Slide["section"], string> = {
  open: "開場",
  layer1: "01 覺察陷阱",
  layer2: "02 解碼大腦",
  layer3: "03 阻斷與重建",
  layer4: "04 教育現場落地",
  qa: "深度問答",
  close: "總結",
};

const params = new URLSearchParams(window.location.search);
const exportMode = params.has("export");
const presenterMode = params.get("slides") === "presenter";

const readIndex = () => {
  const n = Number(window.location.hash.replace("#s", ""));
  return Number.isFinite(n) && n >= 1 && n <= slides.length ? n - 1 : 0;
};

/** 互動頁的倒數計時 */
function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setLeft(s => (s <= 1 ? (setRunning(false), 0) : s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [running]);
  const pct = left / seconds;
  return (
    <div className={`deck-timer ${left === 0 ? "done" : ""}`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" className="track" />
        <circle cx="60" cy="60" r="52" className="bar" style={{ strokeDashoffset: 327 * (1 - pct) }} />
      </svg>
      <strong>{left === 0 ? "時間到" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}</strong>
      <div className="deck-timer-btns">
        <button type="button" onClick={() => setRunning(r => !r)} aria-label={running ? "暫停計時" : "開始計時"}>
          {running ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" onClick={() => { setRunning(false); setLeft(seconds); }} aria-label="重設計時">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}

function Embed({ slide }: { slide: Slide }) {
  const e = slide.embed ?? "";
  if (e === "decode") return <div className="deck-decode"><DecodeCards /></div>;
  if (e === "formula") return <FormulaShowcase />;
  if (e === "stress") return <StressCycle />;
  if (e === "funnel")
    return (
      <ol className="deck-funnel">
        {guideLayers.map((l, i) => (
          <li key={l.id} className={`deck-funnel-${i}`}>
            <span>{l.no}</span>
            <strong>{l.title}</strong>
            <em>{l.question}</em>
          </li>
        ))}
      </ol>
    );
  if (e === "keylines")
    return (
      <div className="deck-keylines">
        <p><span>1・可能</span><mark className="key-mark">大腦是可塑的</mark></p>
        <p><span>2・機制</span><mark className="key-mark">一起放電的神經元會彼此連結</mark></p>
        <div><span>3・方法</span><FormulaShowcase compact /></div>
      </div>
    );
  if (e.startsWith("scene:")) {
    const script = sceneByChapter[e.slice(6)];
    return script ? <IslandScene key={script.chapter} script={script} question={slide.question ?? ""} /> : null;
  }
  if (e.startsWith("lab:")) {
    const [, mode, id] = e.split(":");
    return <Neuro3DLab key={id} initialMode={mode as Mode} embedded id={id} />;
  }
  return null;
}

function SlideBody({ slide }: { slide: Slide }) {
  const head = (
    <header className="deck-head">
      {slide.kicker && <span className="deck-kicker">{slide.kicker}</span>}
      <h2>{markKeys(slide.title)}</h2>
    </header>
  );
  switch (slide.kind) {
    case "title":
      return (
        <div className="deck-title-slide">
          <span className="deck-kicker">{slide.kicker}</span>
          <h1>
            <b>RE</b><i>WIRE</i>
            <small>神經可塑性</small>
          </h1>
          <p className="deck-lead">{slide.lead}</p>
          <div className="deck-byline">{slide.points?.map(p => <span key={p}>{p}</span>)}</div>
          <img className="deck-cover" src="book-cover.jpg" alt="《Rewire－神經可塑性》書封" />
        </div>
      );
    case "cover":
      return (
        <div className="deck-cover-slide">
          <span className="deck-kicker">{slide.kicker}</span>
          <h1>{slide.title}</h1>
          <p>{slide.lead}</p>
        </div>
      );
    case "closing":
      return (
        <div className="deck-closing">
          <h1>{slide.title}</h1>
          <p className="deck-lead">{slide.lead}</p>
          <figure>
            <img src="site-qr.svg" alt="導讀網站 QR code" />
            <figcaption>掃描帶走導讀網站<br />謝謝大家</figcaption>
          </figure>
        </div>
      );
    case "embed":
      return (
        <>
          {head}
          <div className="deck-embed"><Embed slide={slide} /></div>
        </>
      );
    case "interact":
      return (
        <div className="deck-interact">
          <div>
            <span className="deck-tag">{slide.tag}</span>
            <h2>{slide.title}</h2>
            {slide.lead && <p className="deck-lead">{slide.lead}</p>}
            {slide.steps && (
              <ol className="deck-steps">{slide.steps.map(s => <li key={s}>{s}</li>)}</ol>
            )}
            {slide.points && <ul className="deck-points small">{slide.points.map(p => <li key={p}>{p}</li>)}</ul>}
          </div>
          {slide.seconds && <Countdown key={slide.id} seconds={slide.seconds} />}
        </div>
      );
    case "recap":
      return (
        <div className="deck-recap">
          <span className="deck-tag">{slide.kicker}</span>
          <h2>{slide.title}</h2>
          <ul>{slide.points?.map(p => <li key={p}>{markKeys(p)}</li>)}</ul>
          <p className="deck-key">{slide.key}</p>
          {slide.bridge && <p className="deck-bridge">接下來 → {slide.bridge}</p>}
        </div>
      );
    case "qa":
      return (
        <>
          {head}
          <section className="deck-qa-book">
            <h3>書中說法</h3>
            <p>{markKeys(slide.book ?? "")}</p>
          </section>
          <p className="deck-qa-hint">先想一想：你會怎麼分析？可以怎麼幫這個學生？</p>
        </>
      );
    case "qa-answer":
      return (
        <>
          {head}
          <div className="deck-qa-answer">
            <ol>{slide.points?.map(p => <li key={p}>{markKeys(p)}</li>)}</ol>
            <aside>
              <section>
                <h3>理論延伸<small>導讀補充</small></h3>
                <p>{slide.theory}</p>
              </section>
              <section className="pitfall">
                <h3>常見誤區</h3>
                <p>{slide.pitfall}</p>
              </section>
            </aside>
          </div>
        </>
      );
    case "summary":
      return (
        <>
          {head}
          <div className="deck-summary">
            {slide.cards?.map((c, i) => (
              <article key={c.h} className={`deck-funnel-${i}`}>
                <span>{c.h}</span>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
          {slide.aside && <p className="deck-aside">{slide.aside}</p>}
        </>
      );
    default:
      return (
        <>
          {head}
          {slide.lead && <p className="deck-lead">{slide.lead}</p>}
          {slide.points && <ul className="deck-points">{slide.points.map(p => <li key={p}>{markKeys(p)}</li>)}</ul>}
          {slide.cards && (
            <div className={`deck-cards n${slide.cards.length}`}>
              {slide.cards.map(c => (
                <article key={c.h}>
                  <h3>{c.h}</h3>
                  <p>{markKeys(c.p)}</p>
                </article>
              ))}
            </div>
          )}
          {slide.quote && <blockquote className="deck-quote">{slide.quote}</blockquote>}
          {slide.aside && <p className="deck-aside">{slide.aside}</p>}
        </>
      );
  }
}

const channelName = "rewire-deck";

/** 講者視窗：顯示目前這張的備註、下一張標題和計時 */
function Presenter() {
  const [i, setI] = useState(0);
  const [start] = useState(() => Date.now());
  const [, tick] = useState(0);
  useEffect(() => {
    const ch = new BroadcastChannel(channelName);
    ch.onmessage = e => typeof e.data === "number" && setI(e.data);
    ch.postMessage("hello");
    const t = window.setInterval(() => tick(n => n + 1), 1000);
    return () => { ch.close(); window.clearInterval(t); };
  }, []);
  const s = slides[i];
  const next = slides[i + 1];
  const sec = Math.floor((Date.now() - start) / 1000);
  return (
    <div className="deck-presenter">
      <header>
        <strong>{i + 1} / {slides.length}　{sectionLabel[s.section]}</strong>
        <span className="deck-clock">{Math.floor(sec / 60)}:{String(sec % 60).padStart(2, "0")}</span>
      </header>
      <h2>{s.title}</h2>
      <div className="deck-presenter-notes">{s.notes.split("\n").map(l => <p key={l}>{l}</p>)}</div>
      {next && <p className="deck-presenter-next">下一張：{next.title}</p>}
    </div>
  );
}

export default function SlideDeck() {
  if (presenterMode) return <Presenter />;
  return <Deck />;
}

function Deck() {
  const [index, setIndex] = useState(readIndex);
  const [notes, setNotes] = useState(false);
  const [full, setFull] = useState(false);
  const ch = useRef<BroadcastChannel | null>(null);
  const slide = slides[index];

  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(slides.length - 1, n))), []);

  useEffect(() => {
    window.history.replaceState(null, "", `#s${index + 1}`);
    ch.current?.postMessage(index);
    document.title = `${index + 1}. ${slide.title}｜Rewire 導讀簡報`;
  }, [index, slide.title]);

  const indexRef = useRef(index);
  indexRef.current = index;
  useEffect(() => {
    const c = new BroadcastChannel(channelName);
    c.onmessage = e => e.data === "hello" && c.postMessage(indexRef.current);
    ch.current = c;
    return () => {
      ch.current = null;
      c.close();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(index + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(index - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(slides.length - 1);
      else if (e.key.toLowerCase() === "n") setNotes(v => !v);
      else if (e.key.toLowerCase() === "f") toggleFull();
    };
    const onHash = () => setIndex(readIndex());
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("hashchange", onHash); };
  }, [index, go]);

  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }

  // 進度條依連續的段落分段（總結、深度問答、收尾各自一段）
  const runs: { sec: Slide["section"]; from: number; to: number }[] = [];
  slides.forEach((s, i) => {
    const last = runs[runs.length - 1];
    if (last && last.sec === s.section) last.to = i;
    else runs.push({ sec: s.section, from: i, to: i });
  });

  return (
    <div className={`deck ${notes ? "with-notes" : ""} ${exportMode ? "export" : ""}`}>
      <main className={`deck-stage s-${slide.section} k-${slide.kind}`} aria-roledescription="投影片" aria-label={`第 ${index + 1} 張，共 ${slides.length} 張`}>
        <div className="deck-topbar">
          <span className="deck-section">{sectionLabel[slide.section]}</span>
          <span className="deck-brand">Rewire 導讀</span>
        </div>
        <div className="deck-body" key={slide.id}>
          <SlideBody slide={slide} />
        </div>
        <div className="deck-progress" aria-hidden="true">
          {runs.map(({ sec, from, to }) => {
            const total = to - from + 1;
            const done = Math.min(Math.max(index - from + 1, 0), total) / total;
            return (
              <span key={from} className={`p-${sec}`} style={{ flex: total }}>
                <i style={{ width: `${done * 100}%` }} />
              </span>
            );
          })}
        </div>
      </main>

      {!exportMode && (
        <nav className="deck-controls" aria-label="簡報控制">
          <a href="./" className="deck-btn" title="回到導讀網站"><HomeIcon size={18} /><span>網站</span></a>
          <button type="button" className="deck-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="上一張"><ArrowLeft size={20} /></button>
          <span className="deck-count">{index + 1} / {slides.length}</span>
          <button type="button" className="deck-btn" onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="下一張"><ArrowRight size={20} /></button>
          <button type="button" className={`deck-btn ${notes ? "on" : ""}`} onClick={() => setNotes(v => !v)} title="講者備註（N）"><NotebookText size={18} /><span>備註</span></button>
          <button type="button" className="deck-btn" onClick={() => window.open("?slides=presenter", "rewire-presenter", "width=720,height=640")} title="另開講者視窗"><MonitorUp size={18} /><span>講者視窗</span></button>
          <button type="button" className="deck-btn" onClick={toggleFull} title="全螢幕（F）">{full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </nav>
      )}

      {notes && !exportMode && (
        <aside className="deck-notes" aria-label="講者備註">
          <strong>講者備註</strong>
          {slide.notes.split("\n").map(l => <p key={l}>{l}</p>)}
        </aside>
      )}
    </div>
  );
}

