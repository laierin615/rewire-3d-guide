import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ASK, NARRATOR, type Beat, type SceneScript, type Sky } from "@/data/islandScenes";
import type { IslandEngine } from "@/island/engine";

const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

function withAsk(script: SceneScript, question: string): Beat[] {
  const act: Beat["act"] = {};
  script.actors.forEach(a => (act[a.id] = { turn: 0 }));
  return [...script.beats, { who: ASK, text: question, act, cam: script.cam ?? [0, 0, 1] }];
}

function speakerColor(script: SceneScript, who: string) {
  if (who === NARRATOR) return "#c9955f";
  if (who === ASK) return "#5cb176";
  const cast = script.actors.find(a => a.cast.name === who)?.cast;
  if (!cast) return "#9a7b5c";
  return cast.kind === "villager" ? hex(cast.opts.shirt) : hex(cast.opts.fur);
}

function skyAt(script: SceneScript, beats: Beat[], idx: number): Sky {
  let sky: Sky = script.sky ?? "day";
  for (let i = 0; i <= idx; i++) if (beats[i]?.sky) sky = beats[i].sky!;
  return sky;
}

export default function IslandScene({ script, question, chapterLabel }: { script: SceneScript; question: string; chapterLabel?: string }) {
  const beats = useMemo(() => withAsk(script, question), [script, question]);
  const last = beats.length - 1;
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [auto, setAuto] = useState(true);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const wrapRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<IslandEngine | null>(null);
  const prevIdx = useRef(0);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);

  const beat = beats[idx];
  const done = typed >= beat.text.length;
  const sky = skyAt(script, beats, idx);

  // 接近畫面才建立 3D，離開就釋放，避免同時開太多 WebGL。
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "320px 0px" });
    // 畫面看得到才開始自動播放對話
    const seen = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    seen.observe(el);
    return () => {
      io.disconnect();
      seen.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!near || !hostRef.current) return;
    let cancelled = false;
    let engine: IslandEngine | null = null;
    (async () => {
      try {
        const labels = script.props.map(p => p.label ?? "").join("") + "?!";
        await Promise.race([document.fonts?.load('64px "Huninn"', labels), new Promise(r => setTimeout(r, 1500))]);
        const { IslandEngine } = await import("@/island/engine");
        if (cancelled || !hostRef.current) return;
        engine = new IslandEngine(hostRef.current, script, beats);
        engineRef.current = engine;
        engine.go(prevIdx.current, false);
        setReady(true);
      } catch (err) {
        console.warn("island scene", err);
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
      setReady(false);
    };
  }, [near, script, beats]);

  useEffect(() => {
    const forward = idx === prevIdx.current + 1;
    engineRef.current?.go(idx, forward);
    prevIdx.current = idx;
    setTyped(reduced ? beats[idx].text.length : 0);
  }, [idx, beats, reduced]);

  // 打字機
  useEffect(() => {
    if (done) {
      engineRef.current?.setSpeaking(false);
      return;
    }
    if (!inView) return;
    const id = window.setTimeout(() => setTyped(n => n + 1), 40);
    return () => window.clearTimeout(id);
  }, [typed, done, inView]);

  // 自動播放
  useEffect(() => {
    if (!auto || !done || !inView || idx >= last) return;
    const id = window.setTimeout(() => setIdx(i => Math.min(last, i + 1)), 1600 + beat.text.length * 90);
    return () => window.clearTimeout(id);
  }, [auto, done, inView, idx, last, beat.text.length]);

  const advance = useCallback(() => {
    if (!done) setTyped(beat.text.length);
    else if (idx < last) setIdx(idx + 1);
  }, [done, beat.text.length, idx, last]);
  const back = () => idx > 0 && setIdx(idx - 1);
  const restart = () => {
    prevIdx.current = -1;
    setIdx(0);
    setTyped(0);
    setAuto(true);
    engineRef.current?.go(0, false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      advance();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      back();
    }
  };

  return (
    <figure ref={wrapRef} className="isl" data-sky={sky} aria-label={`情境動畫：${script.title}`}>
      <div className="isl-stage">
        <div className="isl-sky isl-sky-day" />
        <div className="isl-sky isl-sky-dusk" />
        <div className="isl-sky isl-sky-night" />
        <div ref={hostRef} className="isl-canvas" onClick={advance} />
        <div className="isl-tint" />
        {!ready && <div className="isl-loading">{failed ? "這台裝置無法顯示動畫，下方對話仍可閱讀。" : "小島準備中…"}</div>}
        <div className="isl-chip">
          {chapterLabel && <span>{chapterLabel}</span>}
          {script.title}
        </div>
        <div className="isl-dots" aria-hidden="true">
          {beats.map((_, i) => (
            <i key={i} className={i === idx ? "on" : i < idx ? "past" : ""} />
          ))}
        </div>
      </div>

      <div className="isl-dialog" role="button" tabIndex={0} onClick={advance} onKeyDown={onKey} aria-label="對話框，按 Enter 看下一句">
        <span className="isl-name" style={{ "--c": speakerColor(script, beat.who) } as React.CSSProperties}>
          {beat.who}
        </span>
        {beat.supplement && <span className="isl-supp">導讀補充</span>}
        <p className={beat.who === ASK ? "isl-text ask" : "isl-text"}>{beat.text.slice(0, typed)}</p>
        <span className="sr-only" aria-live="polite">
          {beat.who}：{beat.text}
        </span>
        {done && idx < last && <span className="isl-next" aria-hidden="true">▼</span>}
      </div>

      <div className="isl-ctrl">
        <button type="button" onClick={back} disabled={idx === 0} aria-label="上一句">
          <ChevronLeft size={16} />
          <span>上一句</span>
        </button>
        <span className="isl-count">
          {idx + 1} / {beats.length}
        </span>
        <button type="button" onClick={restart} aria-label="從頭播放">
          <RotateCcw size={15} />
        </button>
        <button type="button" onClick={() => setAuto(a => !a)} aria-pressed={auto} aria-label={auto ? "暫停自動播放" : "自動播放"}>
          {auto ? <Pause size={15} /> : <Play size={15} />}
          <span>{auto ? "暫停" : "自動"}</span>
        </button>
        <button type="button" className="primary" onClick={advance} disabled={done && idx === last} aria-label="下一句">
          <span>下一句</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </figure>
  );
}

/** 文字版：給不方便看動畫的讀者。 */
export function SceneTranscript({ script, question }: { script: SceneScript; question: string }) {
  const beats = withAsk(script, question);
  return (
    <ol className="isl-transcript">
      {beats.map((b, i) => (
        <li key={i}>
          <b style={{ "--c": speakerColor(script, b.who) } as React.CSSProperties}>{b.who}</b>
          <span>{b.text}</span>
          {b.supplement && <em className="isl-supp">導讀補充</em>}
        </li>
      ))}
    </ol>
  );
}
