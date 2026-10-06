import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Search,
  Maximize2,
  X,
  Layers3,
} from "lucide-react";
import { guideChapters } from "../data/guideChapters";

const stages = [
  ["all", "全部"],
  ["intro", "導言"],
  ["stage1", "01 擺脫負面情緒"],
  ["stage2", "02 改變你的敘事"],
  ["stage3", "03 增強積極性"],
  ["outro", "尾聲"],
] as const;
export default function TeachingGuide() {
  const [stage, setStage] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const exit = useRef<HTMLButtonElement>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const filtered = useMemo(
    () =>
      guideChapters.filter(
        ch =>
          (stage === "all" || ch.stage === stage) &&
          [ch.title, ch.en, ch.summary, ch.concepts]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase().trim())
      ),
    [stage, query]
  );
  const index = Math.min(active, Math.max(0, filtered.length - 1));
  const chapter = filtered[index];
  const close = () => {
    setPresenting(false);
    requestAnimationFrame(() => launch.current?.focus());
  };
  useEffect(() => {
    if (!presenting) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    exit.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPresenting(false);
        launch.current?.focus();
      }
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive(i => Math.min(filtered.length - 1, i + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive(i => Math.max(0, i - 1));
      }
      if (e.key === "Tab") {
        const elements = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            ".guide-present button:not(:disabled)"
          )
        );
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", key);
    };
  }, [presenting, filtered.length]);
  return (
    <section
      className="section teaching-section"
      id="teaching"
      aria-labelledby="teaching-title"
    >
      <div className="container-wide">
        <div className="lab-heading">
          <div>
            <div className="section-label eyebrow">06 / 把一本書說清楚</div>
            <h2 className="section-title" id="teaching-title">
              每一章，
              <br />
              <span>都有清楚的解說起點。</span>
            </h2>
          </div>
          <p className="section-intro">
            依原書導言、三階段與尾聲排列。每一章先看在說什麼、有哪些概念，最後留一個問題給自己。
          </p>
        </div>
        <div className="guide-filters">
          <div aria-label="依原書階段篩選">
            {stages.map(([id, label]) => (
              <button
                key={id}
                className={stage === id ? "active" : ""}
                aria-pressed={stage === id}
                onClick={() => {
                  setStage(id);
                  setActive(0);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="guide-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="搜尋章節或概念"
              aria-label="搜尋完整章節導讀"
            />
          </label>
        </div>
        <div className="guide-layout">
          <aside className="guide-index" aria-label="原書完整章節">
            <span className="guide-count" aria-live="polite">
              章節目錄
            </span>
            {filtered.map((ch, i) => (
              <button
                key={ch.id}
                className={index === i ? "active" : ""}
                onClick={() => setActive(i)}
                aria-pressed={index === i}
              >
                <span>{ch.no}</span>
                <strong>{ch.title}</strong>
                <ArrowRight size={15} />
              </button>
            ))}
          </aside>
          {chapter ? (
            <article
              className={`guide-card ${presenting ? "guide-present" : ""}`}
              role={presenting ? "dialog" : undefined}
              aria-modal={presenting ? true : undefined}
              aria-label={presenting ? "章節滿版導讀" : undefined}
            >
              <div className="guide-card-top">
                <span>{stages.find(([id]) => id === chapter.stage)?.[1]}</span>
                <div>
                  <span>{chapter.no}</span>
                  {presenting ? (
                    <button
                      ref={exit}
                      onClick={close}
                      aria-label="離開滿版導讀"
                    >
                      <X size={18} />
                    </button>
                  ) : (
                    <button
                      ref={launch}
                      onClick={() => setPresenting(true)}
                      aria-label="開始滿版導讀"
                    >
                      <Maximize2 size={17} />
                      滿版導讀
                    </button>
                  )}
                </div>
              </div>
              <h3>{chapter.title}</h3>
              <p className="guide-english">{chapter.en}</p>
              <div className="guide-four">
                <div>
                  <BookOpen size={21} />
                  <span>01 / 這章在講什麼</span>
                  <p>{chapter.summary}</p>
                </div>
                <div>
                  <Layers3 size={21} />
                  <span>02 / 重要概念</span>
                  <p>{chapter.concepts}</p>
                </div>
                <div>
                  <MessageCircle size={21} />
                  <span>03 / 想想看</span>
                  <p>{chapter.question}</p>
                </div>
              </div>
              <div className="guide-footer">
                <p>
                  依原章改寫摘要{presenting ? " · ← → 換章 · Esc 離開" : ""}
                </p>
                <div>
                  <button
                    disabled={index === 0}
                    onClick={() => setActive(i => Math.max(0, i - 1))}
                  >
                    <ArrowLeft size={15} />
                    上一章
                  </button>
                  <button
                    disabled={index === filtered.length - 1}
                    onClick={() =>
                      setActive(i => Math.min(filtered.length - 1, i + 1))
                    }
                  >
                    下一章
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="guide-empty">
              沒有符合的章節，請試試其他關鍵字。
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
