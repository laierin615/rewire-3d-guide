import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Maximize2, X } from "lucide-react";
import { guideChapters, type GuideChapter } from "../data/guideChapters";
import Neuro3DLab from "./Neuro3DLab";
import ChapterExamples from "./ChapterExamples";
import ChapterDepth from "./ChapterDepth";
import type { Mode } from "../data/neuroLessons";
import { sceneByChapter as allScenes } from "../data/islandScenes";

/** 主題卡上播放的情境：已移到層前導或理論節點的、或精簡掉的不再顯示 */
const sceneByChapter = Object.fromEntries(Object.entries(allScenes).filter(([id]) => !relocatedScenes.has(id) && !hiddenScenes.has(id)));
import IslandScene from "./IslandScene";
import StressCycle from "./StressCycle";
import FormulaShowcase from "./FormulaShowcase";
import { markKeys } from "./KeyMark";
import { guideLayers, hiddenScenes, layerChapterOrder, relocatedScenes, topicNumber, type GuideLayer } from "../data/guideLayers";

const chapterModels: Record<string, { mode: Mode; id: string }> = {
  muscles: { mode: "muscle", id: "muscle-animation" },
  sleep: { mode: "sleep", id: "sleep-animation" },
  dopamine: { mode: "reward", id: "reward-animation" },
};

const orderedChapters = layerChapterOrder
  .map(id => guideChapters.find(ch => ch.id === id))
  .filter((ch): ch is GuideChapter => !!ch);

function NodeAnim({ layer, node, i }: { layer: GuideLayer; node: GuideLayer["nodes"][number]; i: number }) {
  const anim = node.anim!;
  const scene = "scene" in anim ? allScenes[anim.scene] : undefined;
  const chapter = "scene" in anim ? guideChapters.find(ch => ch.id === anim.scene) : undefined;
  return (
    <section className="layer-anim" id={`anim-${layer.id}-${i}`}>
      <h4>
        <span>補充動畫</span>
        {node.title}
      </h4>
      {"lab" in anim ? (
        <Neuro3DLab initialMode={anim.lab} embedded id={anim.id} />
      ) : scene ? (
        <IslandScene key={scene.chapter} script={scene} question={chapter?.question ?? ""} />
      ) : null}
    </section>
  );
}

/** 理論節點：每個節點下面直接接它的補充動畫 */
function LayerNodes({ layer }: { layer: GuideLayer }) {
  return (
    <ol className="layer-nodes stacked">
      {layer.nodes.map((node, i) => (
        <li key={node.title} className={node.anim ? "has-anim" : ""}>
          <div className="layer-node-card">
            <header>
              <span className="layer-node-no">{i + 1}</span>
              <h3>{node.title}</h3>
            </header>
            <div className="layer-node-body">
              <p>{markKeys(node.text)}</p>
              {node.note && (
                <p className="layer-node-note">
                  <b>導讀補充</b>
                  {node.note}
                </p>
              )}
            </div>
          </div>
          {node.anim && <NodeAnim layer={layer} node={node} i={i} />}
        </li>
      ))}
    </ol>
  );
}

/** 層最前面的前導情境 */
function LayerLead({ layer }: { layer: GuideLayer }) {
  const scene = allScenes[layer.lead.scene];
  if (!scene) return null;
  return (
    <div className="layer-lead">
      <span className="layer-lead-label">前導情境</span>
      <IslandScene key={scene.chapter} script={scene} question={layer.lead.question} />
    </div>
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
      <p>{markKeys(chapter.summary)}</p>
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

/** slots：Home 傳進來的參考資料，key 為層 id（放在層末）或「層 id:小節序」（放在小節開頭） */
export default function BookWalkthrough({ slots }: { slots?: Record<string, ReactNode> }) {
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

  const renderTopic = (ch: GuideChapter) => (
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
      {chapterModels[ch.id] && (
        <Neuro3DLab initialMode={chapterModels[ch.id].mode} embedded id={chapterModels[ch.id].id} />
      )}
    </div>
  );


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
                <p>{layer.intro}</p>
              </header>
              <LayerLead layer={layer} />
              {layer.id === "layer3" && (
                <>
                  <FormulaShowcase />
                  {allScenes.neurotoolkit && (
                    <section className="layer-anim" id="anim-formula">
                      <h3>
                        <span>補充動畫</span>
                        網球課上的妮可
                      </h3>
                      <IslandScene key="neurotoolkit" script={allScenes.neurotoolkit} question={guideChapters.find(ch => ch.id === "neurotoolkit")?.question ?? ""} />
                    </section>
                  )}
                </>
              )}
              <LayerNodes layer={layer} />
              {layer.sections.map((sec, si) => {
                const last = si === layer.sections.length - 1;
                return (
                  <div className="layer-section" key={sec.title} id={`${layer.id}-s${si + 1}`}>
                    <header className="layer-section-head">
                      <span>
                        {layerIndex + 1}.{si + 1}
                      </span>
                      <div>
                        <h3>{sec.title}</h3>
                        <p>{sec.question}</p>
                      </div>
                    </header>
                    {slots?.[`${layer.id}:${si}`]}
                    {layer.id === "layer1" && si === 0 && (
                      <>
                        <p className="layer-transition">
                          自動駕駛本來是為了省力。但長期壓力沒有恢復時，大腦會進入作者說的「低電量模式」：只顧撐過眼前，最熟悉的老路跑得最快。
                        </p>
                        <StressCycle />
                      </>
                    )}
                    <div className="walk-chapters">
                      {sec.chapters.map(id => {
                        const ch = guideChapters.find(item => item.id === id);
                        return ch ? renderTopic(ch) : null;
                      })}
                    </div>
                    {!last && <p className="layer-bridge section-bridge">{sec.bridge}</p>}
                  </div>
                );
              })}
            </div>
            {slots?.[layer.id]}
            <div className="container-wide">
              <aside className="layer-recap layer-recap-big">
                <h4>
                  <span>{layer.label}小結</span>
                  {layer.title}：{layer.question}
                </h4>
                <ul>
                  {layer.recap.points.map(point => (
                    <li key={point}>{markKeys(point)}</li>
                  ))}
                </ul>
                <p className="layer-recap-key">{layer.recap.key}</p>
              </aside>
              {!next && (
                <aside className="layer-recap guide-summary">
                  <h4>
                    <span>總結</span>
                    從大腦重塑到學習賦能
                  </h4>
                  <ol>
                    {guideLayers.map(l => (
                      <li key={l.id}>
                        <b>{l.title}</b>
                        {l.recap.key}
                      </li>
                    ))}
                  </ol>
                </aside>
              )}
              <a className="walk-next layer-bridge-next" href={next ? `#${next.id}` : "#exam"}>
                <span>{layer.sections[layer.sections.length - 1].bridge}</span>
                <small>{next ? `接著讀：${next.label}　${next.title}` : "前往：延伸學習"}</small>
                <ArrowRight size={19} />
              </a>
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
