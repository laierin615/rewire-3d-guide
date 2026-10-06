import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { guideChapters, type GuideChapter } from "../data/guideChapters";
import Neuro3DLab from "./Neuro3DLab";
import ChapterExamples from "./ChapterExamples";
import ChapterDepth from "./ChapterDepth";
import { bookScenes } from "../data/bookScenes";
import type { Mode } from "../data/neuroLessons";

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
    lead: "從神經元、突觸與自動反應開始，理解為什麼熟悉的想法很容易出現，也理解改變的可能。",
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

function FourPoints({ chapter }: { chapter: GuideChapter }) {
  return (
    <div className="walk-four">
      <div>
        <h4>這章在講什麼</h4>
        <p>{chapter.summary}</p>
      </div>
      <div>
        <h4>重要概念</h4>
        <p>{chapter.concepts}</p>
      </div>
      <div>
        <h4>可以問讀者</h4>
        <p>{chapter.question}</p>
      </div>
      <div className="walk-takeaway">
        <h4>一句話帶走</h4>
        <p>{chapter.takeaway}</p>
      </div>
    </div>
  );
}

export default function BookWalkthrough() {
  const [presented, setPresented] = useState<number | null>(null);
  const [slideView, setSlideView] = useState<"outline" | "depth" | "example">("outline");
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
              </div>
              <p>{phase.lead}</p>
            </header>
            {phase.id === "intro" && (
              <div className="intro-essentials">
                <article>
                  <span>Neuroplasticity</span>
                  <h3>連結可以改變</h3>
                  <p>
                    經驗與重複會調整神經連結，讓某些想法與反應逐漸變得熟悉。
                  </p>
                </article>
                <article>
                  <span>Hardware & Software</span>
                  <h3>硬體與軟體互相支持</h3>
                  <p>
                    作者把大腦比作硬體，把思想、記憶與習慣比作軟體。睡眠與活動也支援新的練習。
                  </p>
                </article>
                <article>
                  <span>Automaticity & Heuristics</span>
                  <h3>熟悉，讓大腦省力</h3>
                  <p>
                    重複帶來自動性，心理捷思則簡化判斷。先察覺這些慣性，才能重新選擇。
                  </p>
                </article>
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
                .filter(ch => ch.stage === phase.id)
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
                              setSlideView("outline");
                              setPresented(index);
                            }}
                            aria-label={`滿版解說：${ch.title}`}
                          >
                            <Maximize2 size={18} />
                            滿版解說
                          </button>
                        </header>
                        <FourPoints chapter={ch} />
                        <ChapterDepth chapterId={ch.id} />
                        <ChapterExamples chapterId={ch.id} />
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
              aria-pressed={slideView === "outline"}
              onClick={() => setSlideView("outline")}
            >
              章節提綱
            </button>
            <button
              aria-pressed={slideView === "depth"}
              onClick={() => setSlideView("depth")}
            >
              重點與工具
            </button>
            {bookScenes.some(s => s.chapter === guideChapters[presented].id) && (
              <button
                aria-pressed={slideView === "example"}
                onClick={() => setSlideView("example")}
              >
                書中例子
              </button>
            )}
          </div>
          {slideView === "example" &&
          bookScenes.some(s => s.chapter === guideChapters[presented].id) ? (
            <ChapterExamples
              key={guideChapters[presented].id}
              chapterId={guideChapters[presented].id}
            />
          ) : slideView === "depth" ? (
            <ChapterDepth chapterId={guideChapters[presented].id} />
          ) : (
            <FourPoints chapter={guideChapters[presented]} />
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
