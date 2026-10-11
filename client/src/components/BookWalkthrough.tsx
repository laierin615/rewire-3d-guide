import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Maximize2, X } from "lucide-react";
import { guideChapters, type GuideChapter } from "../data/guideChapters";
import Neuro3DLab from "./Neuro3DLab";
import ChapterExamples from "./ChapterExamples";
import ChapterDepth from "./ChapterDepth";
import type { Mode } from "../data/neuroLessons";
import { sceneByChapter } from "../data/islandScenes";
import IslandScene from "./IslandScene";
import StressCycle from "./StressCycle";
import { guideLayers, layerChapterOrder, topicNumber, type GuideLayer } from "../data/guideLayers";

const chapterModels: Record<string, { mode: Mode; id: string }> = {
  neurotoolkit: { mode: "regulation", id: "stress-animation" },
  "confirmation-bias": { mode: "attention", id: "attention-animation" },
  muscles: { mode: "muscle", id: "muscle-animation" },
  sleep: { mode: "sleep", id: "sleep-animation" },
  dopamine: { mode: "reward", id: "reward-animation" },
};

const orderedChapters = layerChapterOrder
  .map(id => guideChapters.find(ch => ch.id === id))
  .filter((ch): ch is GuideChapter => !!ch);

function LayerNodes({ layer }: { layer: GuideLayer }) {
  return (
    <ol className="layer-nodes">
      {layer.nodes.map((node, i) => (
        <li key={node.title}>
          <header>
            <span className="layer-node-no">{i + 1}</span>
            <h3>{node.title}</h3>
          </header>
          <p>{node.text}</p>
          {node.note && (
            <p className="layer-node-note">
              <b>導讀補充</b>
              {node.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}

const introEssentials = (
  <div className="intro-essentials">
    <article>
      <span>Neuroplasticity</span>
      <h3>大腦是可塑的</h3>
      <p>plastic 的意思是能被塑形。任何年紀，大腦都能走出新的路徑；習慣不是天生的個性。</p>
    </article>
    <article>
      <span>Low Power Mode</span>
      <h3>低電量模式</h3>
      <p>大腦是硬體，習慣是軟體。人累了，大腦只顧基本功能，沒有餘力更新軟體。</p>
    </article>
    <article>
      <span>Automaticity</span>
      <h3>熟悉，讓大腦省力</h3>
      <p>重複讓小徑變成大道，熟悉的事就像刷牙一樣不用想。想走新路，要先注意到老路。</p>
    </article>
  </div>
);

function ChapterGist({ chapter }: { chapter: GuideChapter }) {
  return (
    <div className="walk-gist">
      <h4>重點摘要</h4>
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
        <small>重要概念、深入理解、書中例子</small>
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
    <IslandScene key={chapter.id} script={scene} question={chapter.question} chapterLabel={topicNumber(chapter.id)} />
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
          i === null ? null : Math.min(orderedChapters.length - 1, i + 1)
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

  const present = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    origin.current = event.currentTarget;
    setSlideView("scene");
    setPresented(orderedChapters.findIndex(ch => ch.id === id));
  };

  return (
    <>
      {guideLayers.map((layer, layerIndex) => {
        const next = guideLayers[layerIndex + 1];
        return (
          <section
            className={`section walk-phase walk-layer walk-${layer.id}`}
            id={layer.id}
            key={layer.id}
            aria-labelledby={`${layer.id}-title`}
          >
            <div className="container-wide">
              <header className="walk-phase-heading">
                <div>
                  <span className="walk-label">
                    {layer.label}
                    <small>{layer.en}</small>
                  </span>
                  <h2 id={`${layer.id}-title`}>
                    {layer.title}
                    <span className="layer-question">{layer.question}</span>
                  </h2>
                </div>
                <p>{layer.lead}</p>
              </header>
              <LayerNodes layer={layer} />
              {layer.id === "layer1" && <StressCycle />}
              <h3 className="layer-chapters-title">
                這一層的主題
              </h3>
              <div className="walk-chapters">
                {layer.chapters.map(id => {
                  const ch = guideChapters.find(item => item.id === id);
                  if (!ch) return null;
                  return (
                    <div key={ch.id}>
                      <article className="walk-chapter" id={`chapter-${ch.id}`}>
                        <header>
                          <div>
                            <span className="walk-chapter-number">{topicNumber(ch.id)}</span>
                            <h3>{ch.title}</h3>
                            <p>{ch.en}</p>
                          </div>
                          <button onClick={event => present(event, ch.id)} aria-label={`滿版解說：${ch.title}`}>
                            <Maximize2 size={18} />
                            滿版解說
                          </button>
                        </header>
                        <SceneOrGist chapter={ch} />
                        {sceneByChapter[ch.id] && <ChapterGist chapter={ch} />}
                        {ch.id === "intro" && introEssentials}
                        <ChapterMore chapter={ch} />
                        {chapterModels[ch.id] && (
                          <a className="example-model-link" href={`#${chapterModels[ch.id].id}`}>
                            接著看立體示意 <ArrowRight size={18} />
                          </a>
                        )}
                      </article>
                      {ch.id === "intro" && <Neuro3DLab initialMode="synapse" embedded id="lab3d" />}
                      {chapterModels[ch.id] && (
                        <Neuro3DLab initialMode={chapterModels[ch.id].mode} embedded id={chapterModels[ch.id].id} />
                      )}
                      {ch.id === "subconscious" && (
                        <Neuro3DLab initialMode="practice" embedded id="practice-animation" />
                      )}
                    </div>
                  );
                })}
              </div>
              {next ? (
                <a className="walk-next" href={`#${next.id}`}>
                  接著讀：{next.label}　{next.title}
                  <ArrowRight size={19} />
                </a>
              ) : (
                <a className="walk-next" href="#exam">
                  延伸：把書中概念接回教師資格考
                  <ArrowRight size={19} />
                </a>
              )}
            </div>
          </section>
        );
      })}
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
              {guideLayers.find(l => l.chapters.includes(orderedChapters[presented].id))?.label}{" "}
              · {topicNumber(orderedChapters[presented].id)}
            </span>
            <button aria-label="離開滿版解說" onClick={close}>
              <X size={24} />
            </button>
          </header>
          <h2 id="walk-slide-title">{orderedChapters[presented].title}</h2>
          <p className="walk-slide-english">{orderedChapters[presented].en}</p>
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
              重點摘要
            </button>
            <button
              aria-pressed={slideView === "depth"}
              onClick={() => setSlideView("depth")}
            >
              重點與工具
            </button>
          </div>
          {slideView === "scene" ? (
            <SceneOrGist chapter={orderedChapters[presented]} />
          ) : slideView === "depth" ? (
            <ChapterDepth chapterId={orderedChapters[presented].id} />
          ) : (
            <div className="walk-slide-outline">
              <ChapterGist chapter={orderedChapters[presented]} />
              <div className="walk-concepts">
                <h4>重要概念</h4>
                <p>{orderedChapters[presented].concepts}</p>
              </div>
            </div>
          )}
          <footer>
            <span>← → 切換主題 · Esc 返回</span>
            <div>
              <button
                disabled={presented === 0}
                onClick={() => setPresented(i => (i === null ? null : i - 1))}
              >
                <ArrowLeft size={18} />
                上一個
              </button>
              <button
                disabled={presented === orderedChapters.length - 1}
                onClick={() => setPresented(i => (i === null ? null : i + 1))}
              >
                下一個
                <ArrowRight size={18} />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
