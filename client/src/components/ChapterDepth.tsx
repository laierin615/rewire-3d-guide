import { Brain, Flower2, Footprints, GraduationCap, Layers3, ListChecks, Moon, Palette, ShieldCheck, Wrench } from "lucide-react";
import { markKeys } from "./KeyMark";
import { chapterDepth, type SourceKind } from "../data/chapterDepth";
import { examDeepQA } from "../data/examDeepQA";
import { ChainFlow, Checklist, CompareCards, SpaceTimeline, StepCards } from "./DepthWidgets";
import ReframeCards from "./ReframeCards";
import SighAnimation from "./SighAnimation";

/** 書中內容不加標籤，只有導讀另外補充的內容才標示。 */
export function SourceTag({ kind }: { kind: SourceKind }) {
  if (kind !== "導讀延伸") return null;
  return <span className="source-tag tag-guide">導讀補充</span>;
}

const BASIC_ICONS = { sleep: Moon, meditate: Flower2, move: Footprints, boundary: ShieldCheck, hobby: Palette };

export function openExamQA(id: string) {
  window.dispatchEvent(new CustomEvent("rewire:open-qa", { detail: id }));
}

type DepthPart = "terms" | "tool";

/** 相關腦區：可單獨放在主題卡外面 */
export function DepthTerms({ chapterId }: { chapterId: string }) {
  const depth = chapterDepth[chapterId];
  if (!depth?.terms) return null;
  return (
    <div className="depth-terms">
      <h5>
        <Brain size={20} aria-hidden="true" />
        {depth.termsTitle ?? "相關腦區"}
      </h5>
      <div className="depth-terms-grid">
        {depth.terms.map((term, i) => (
          <article key={term.name} className={`term-${i}`}>
            <header>
              <strong>{term.name}</strong>
              <small>{term.en}</small>
            </header>
            <p className="term-where">{term.where}</p>
            <dl>
              <dt>{depth.termLabels?.[0] ?? "平常"}</dt>
              <dd>{term.role}</dd>
              <dt>{depth.termLabels?.[1] ?? "慢性壓力下"}</dt>
              <dd>{term.stress}</dd>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

/** 書中方法（含生理性嘆息動畫）：可單獨放在主題卡外面 */
export function DepthTool({ chapterId }: { chapterId: string }) {
  const depth = chapterDepth[chapterId];
  if (!depth?.tool) return null;
  return (
    <div className="depth-tool">
      <div className="depth-tool-head">
        <ListChecks size={20} aria-hidden="true" />
        <h5>{depth.tool.title}</h5>
        <SourceTag kind={depth.tool.kind} />
      </div>
      {depth.tool.animation === "sigh" ? (
        <SighAnimation />
      ) : depth.tool.display === "cards" ? (
        <StepCards steps={depth.tool.steps} />
      ) : depth.tool.display === "checklist" ? (
        <Checklist steps={depth.tool.steps} />
      ) : (
        <ol>
          {depth.tool.steps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      )}
      {depth.tool.note && <p className="depth-note">{depth.tool.note}</p>}
    </div>
  );
}

/** omit：已經拉到主題卡外面顯示的區塊，這裡不再重複 */
export default function ChapterDepth({ chapterId, omit = [] }: { chapterId: string; omit?: DepthPart[] }) {
  const depth = chapterDepth[chapterId];
  if (!depth) return null;
  const examLinks = (depth.exam ?? [])
    .map(id => examDeepQA.find(item => item.id === id))
    .filter(item => item !== undefined);
  return (
    <section className="chapter-depth" aria-label="深入理解">
      <h4>
        <Layers3 size={20} aria-hidden="true" />
        深入理解
      </h4>
      <ul className="depth-points">
        {depth.points.map(point => (
          <li key={point.text}>
            <SourceTag kind={point.kind} />
            <p>{markKeys(point.text)}</p>
          </li>
        ))}
      </ul>
      {depth.chain && <ChainFlow {...depth.chain} />}
      {depth.space && <SpaceTimeline />}
      {depth.reframe && <ReframeCards {...depth.reframe} />}
      {depth.compare && <CompareCards {...depth.compare} />}
      {!omit.includes("terms") && <DepthTerms chapterId={chapterId} />}
      {!omit.includes("tool") && <DepthTool chapterId={chapterId} />}
      {depth.basics && (
        <div className="depth-basics">
          <h5>
            <Wrench size={20} aria-hidden="true" />
            {depth.basics.title}
          </h5>
          <div className="basics-why">
            <strong>為什麼要回歸基本事項？</strong>
            {depth.basics.principle.map(text => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <ul className="basics-grid">
            {depth.basics.items.map(item => {
              const Icon = BASIC_ICONS[item.icon];
              return (
                <li key={item.name}>
                  <span className={`basics-icon basics-${item.icon}`} aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <strong>{item.name}</strong>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {examLinks.length > 0 && (
        <div className="depth-exam">
          <span>
            <GraduationCap size={18} aria-hidden="true" />
            深度問答
          </span>
          {examLinks.map(item => (
            <a
              key={item.id}
              href={`#qa-${item.id}`}
              onClick={event => {
                event.preventDefault();
                openExamQA(item.id);
              }}
            >
              {item.topic}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
