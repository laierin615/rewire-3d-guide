import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Maximize2, X } from "lucide-react";
import { guideChapters, type GuideChapter } from "../data/guideChapters";
import Neuro3DLab from "./Neuro3DLab";
import ChapterExamples from "./ChapterExamples";
import ChapterDepth from "./ChapterDepth";
import type { Mode } from "../data/neuroLessons";
import { sceneByChapter } from "../data/islandScenes";
import IslandScene from "./IslandScene";

const chapterModels: Record<string, { mode: Mode; id: string }> = {
  "confirmation-bias": { mode: "attention", id: "attention-animation" },
  muscles: { mode: "muscle", id: "muscle-animation" },
  sleep: { mode: "sleep", id: "sleep-animation" },
  dopamine: { mode: "reward", id: "reward-animation" },
};

const phases = [
  {
    id: "intro",
    label: "導言",
    en: "Introduction",
    title: "先理解：大腦如何被經驗塑造？",
    lead: "大腦是可塑的，但改變需要電力。先看懂舊路怎麼形成，再看新路怎麼開始。",
  },
  {
    id: "stage1",
    label: "階段一",
    en: "Ditch the Negative",
    title: "擺脫負面情緒",
    lead: "先辨認壓力、負面偏見與既有信念，找出循環中的介入點，讓新的回應有機會出現。",
  },
  {
    id: "stage2",
    label: "階段二",
    en: "Shift Your Narrative",
    title: "改變你的敘事",
    lead: "從重組潛意識談起，再沿著七個步驟，把新的想法變成可反覆練習的行動。",
  },
  {
    id: "stage3",
    label: "階段三",
    en: "Boost the Positive",
    title: "增強積極性",
    lead: "用韌性、成長型心態、身體活動與睡眠支持改變，重新理解多巴胺，逐步建立自我信賴。",
  },
  {
    id: "outro",
    label: "尾聲",
    en: "Epilogue",
    title: "把理解帶回日常",
    lead: "回到自己願意練習的一個小選擇，讓全書的理解接上生活。",
  },
];

function ChapterGist({ chapter }: { chapter: GuideChapter }) {
  return (
    <div className="walk-gist">
      <h4>這章在說什麼</h4>
      <p>{chapter.summary}</p>
    </div>
  );
}

function ChapterMore({ chapter }: { chapter: GuideChapter }) {
  const scene = sceneByChapter[chapter.id];
  return (
    <details className="walk-more">
      <summary>
        展開看更多
        <small>重要概念、讀懂這一章、書中例子</small>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="walk-more-body">
        <div className="walk-concepts">
          <h4>重要概念</h4>
          <p>{chapter.concepts}</p>
        </div>
        <ChapterDepth chapterId={chapter.id} />
        <ChapterExamples chapterId={chapter.id} />
      </div>
    </details>
  );
}

function SceneOrGist({ chapter }: { chapter: GuideChapter }) {
  const scene = sceneByChapter[chapter.id];
  return scene ? (
    <IslandScene key={chapter.id} script={scene} question={chapter.question} chapterLabel={chapter.no} />
  ) : (
    <ChapterGist chapter={chapter} />
  );
}

export default function BookWalkthrough() {
  const [presented, setPresented] = useState<number | null>(null);
  const [slideView, setSlideView] = useState<"scene" | "outline" | "depth">("scene");
  const dialog = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const close = () => {
    setPresented(null);
    requestAnimationFrame(() => origin.current?.focus());
  };
  useEffect(() => {
    if (presented === null) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPresented(i =>
          i === null ? null : Math.min(guideChapters.length - 1, i + 1)
        );
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPresented(i => (i === null ? null : Math.max(0, i - 1)));
      }
      if (e.key === "Tab") {
        const buttons = Array.from(
          dialog.current?.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)"
          ) ?? []
        );
        const first = buttons[0],
          last = buttons.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", keyboard);
    };
  }, [presented !== null]);

  return (
    <>
      {phases.map(phase => (
        <section
          className={`section walk-phase walk-${phase.id}`}
          id={phase.id}
          key={phase.id}
          aria-labelledby={`${phase.id}-title`}
        >
          <div className="container-wide">
            <header className="walk-phase-heading">
              <div>
                <span className="walk-label">
                  {phase.label}
                  <small>{phase.en}</small>
                </span>
                <h2 id={`${phase.id}-title`}>{phase.title}</h2>
                {(phase.id === "intro" || phase.id === "outro") && (
                  <button
                    className="walk-phase-present"
                    onClick={event => {
                      origin.current = event.currentTarget;
                      setSlideView("scene");
                      setPresented(guideChapters.findIndex(ch => ch.stage === phase.id));
                    }}
                    aria-label={`滿版解說：${phase.label}`}
                  >
                    <Maximize2 size={18} />
                    滿版解說
                  </button>
                )}
              </div>
              <p>{phase.lead}</p>
            </header>
            {phase.id === "outro" && (
              <div className="walk-intro" id="chapter-closing">
                <SceneOrGist chapter={guideChapters[guideChapters.length - 1]} />
                <ChapterGist chapter={guideChapters[guideChapters.length - 1]} />
                <ChapterMore chapter={guideChapters[guideChapters.length - 1]} />
              </div>
            )}
            {phase.id === "intro" && (
              <div className="walk-intro" id="chapter-intro">
              <SceneOrGist chapter={guideChapters[0]} />
              <div className="intro-essentials">
                <article>
                  <span>Neuroplasticity</span>
                  <h3>大腦是可塑的</h3>
                  <p>
                    plastic 的意思是能被塑形。任何年紀，大腦都能走出新的路徑；習慣不是天生的個性。
                  </p>
                </article>
                <article>
                  <span>Low Power Mode</span>
                  <h3>低電量模式</h3>
                  <p>
                    大腦是硬體，習慣是軟體。人累了，大腦只顧基本功能，沒有餘力更新軟體。
                  </p>
                </article>
                <article>
                  <span>Automaticity</span>
                  <h3>熟悉，讓大腦省力</h3>
                  <p>
                    重複讓小徑變成大道，熟悉的事就像刷牙一樣不用想。想走新路，要先注意到老路。
                  </p>
                </article>
              </div>
              <ChapterMore chapter={guideChapters[0]} />
              </div>
            )}
            {phase.id === "intro" && (
              <Neuro3DLab initialMode="synapse" embedded id="lab3d" />
            )}
            {phase.id === "stage1" && (
              <Neuro3DLab
                initialMode="regulation"
                embedded
                id="stress-animation"
              />
            )}
            <div className="walk-chapters">
              {guideChapters
                .filter(ch => ch.stage === phase.id && ch.stage !== "intro" && ch.stage !== "outro")
                .map(ch => {
                  const index = guideChapters.findIndex(
                    item => item.id === ch.id
                  );
                  return (
                    <div key={ch.id}>
                      <article className="walk-chapter" id={`chapter-${ch.id}`}>
                        <header>
                          <div>
                            <span className="walk-chapter-number">{ch.no}</span>
                            <h3>{ch.title}</h3>
                            <p>{ch.en}</p>
                          </div>
                          <button
                            onClick={event => {
                              origin.current = event.currentTarget;
                              setSlideView("scene");
                              setPresented(index);
                            }}
                            aria-label={`滿版解說：${ch.title}`}
                          >
                            <Maximize2 size={18} />
                            滿版解說
                          </button>
                        </header>
                        <SceneOrGist chapter={ch} />
                        {sceneByChapter[ch.id] && <ChapterGist chapter={ch} />}
                        <ChapterMore chapter={ch} />
                        {chapterModels[ch.id] && (
                          <a
                            className="example-model-link"
                            href={`#${chapterModels[ch.id].id}`}
                          >
                            接著看立體示意 <ArrowRight size={18} />
                          </a>
                        )}
                      </article>
                      {chapterModels[ch.id] && (
                        <Neuro3DLab
                          initialMode={chapterModels[ch.id].mode}
                          embedded
                          id={chapterModels[ch.id].id}
                        />
                      )}
                      {ch.id === "subconscious" && (
                        <Neuro3DLab
                          initialMode="practice"
                          embedded
                          id="practice-animation"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            {phase.id === "outro" && (
              <a className="walk-next" href="#exam">
                延伸：把書中概念接回教師資格考
                <ArrowRight size={19} />
              </a>
            )}
            {phase.id !== "outro" && (
              <a
                className="walk-next"
                href={`#${phases[phases.findIndex(p => p.id === phase.id) + 1].id}`}
              >
                接著讀：
                {phases[phases.findIndex(p => p.id === phase.id) + 1].title}
                <ArrowRight size={19} />
              </a>
            )}
          </div>
        </section>
      ))}
      {presented !== null && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="walk-slide-title"
          className="walk-presentation"
        >
          <header>
            <span>
              {phases.find(p => p.id === guideChapters[presented].stage)?.label}{" "}
              · {guideChapters[presented].no}
            </span>
            <button aria-label="離開滿版解說" onClick={close}>
              <X size={24} />
            </button>
          </header>
          <h2 id="walk-slide-title">{guideChapters[presented].title}</h2>
          <p className="walk-slide-english">{guideChapters[presented].en}</p>
          <div className="walk-slide-views" role="group" aria-label="解說內容">
            <button
              aria-pressed={slideView === "scene"}
              onClick={() => setSlideView("scene")}
            >
              情境動畫
            </button>
            <button
              aria-pressed={slideView === "outline"}
              onClick={() => setSlideView("outline")}
            >
              這章在說什麼
            </button>
            <button
              aria-pressed={slideView === "depth"}
              onClick={() => setSlideView("depth")}
            >
              重點與工具
            </button>
          </div>
          {slideView === "scene" ? (
            <SceneOrGist chapter={guideChapters[presented]} />
          ) : slideView === "depth" ? (
            <ChapterDepth chapterId={guideChapters[presented].id} />
          ) : (
            <div className="walk-slide-outline">
              <ChapterGist chapter={guideChapters[presented]} />
              <div className="walk-concepts">
                <h4>重要概念</h4>
                <p>{guideChapters[presented].concepts}</p>
              </div>
            </div>
          )}
          <footer>
            <span>← → 換章 · Esc 返回</span>
            <div>
              <button
                disabled={presented === 0}
                onClick={() => setPresented(i => (i === null ? null : i - 1))}
              >
                <ArrowLeft size={18} />
                上一章
              </button>
              <button
                disabled={presented === guideChapters.length - 1}
                onClick={() => setPresented(i => (i === null ? null : i + 1))}
              >
                下一章
                <ArrowRight size={18} />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
