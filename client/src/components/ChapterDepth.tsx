import { GraduationCap, Layers3, ListChecks } from "lucide-react";
import {
  chapterDepth,
  sourceKindNotes,
  type SourceKind,
} from "../data/chapterDepth";
import { examDeepQA } from "../data/examDeepQA";

const kindClass: Record<SourceKind, string> = {
  書中觀點: "view",
  作者經驗: "author",
  書中案例: "case",
  書中研究: "research",
  書中比喻: "metaphor",
  書中方法: "method",
  導讀延伸: "guide",
};

export function SourceTag({ kind }: { kind: SourceKind }) {
  return (
    <span className={`source-tag tag-${kindClass[kind]}`} title={sourceKindNotes[kind]}>
      {kind}
    </span>
  );
}

export function SourceLegend() {
  return (
    <div className="source-legend" aria-label="閱讀標示說明">
      <strong>閱讀標示</strong>
      <ul>
        {(Object.keys(sourceKindNotes) as SourceKind[]).map(kind => (
          <li key={kind}>
            <SourceTag kind={kind} />
            <span>{sourceKindNotes[kind]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function openExamQA(id: string) {
  window.dispatchEvent(new CustomEvent("rewire:open-qa", { detail: id }));
}

export default function ChapterDepth({ chapterId }: { chapterId: string }) {
  const depth = chapterDepth[chapterId];
  if (!depth) return null;
  const examLinks = (depth.exam ?? [])
    .map(id => examDeepQA.find(item => item.id === id))
    .filter(item => item !== undefined);
  return (
    <section className="chapter-depth" aria-label="讀懂這一章">
      <h4>
        <Layers3 size={20} aria-hidden="true" />
        讀懂這一章
      </h4>
      <ul className="depth-points">
        {depth.points.map(point => (
          <li key={point.text}>
            <SourceTag kind={point.kind} />
            <p>{point.text}</p>
          </li>
        ))}
      </ul>
      {depth.tool && (
        <div className="depth-tool">
          <div className="depth-tool-head">
            <ListChecks size={20} aria-hidden="true" />
            <h5>{depth.tool.title}</h5>
            <SourceTag kind={depth.tool.kind} />
          </div>
          <ol>
            {depth.tool.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {depth.tool.note && <p className="depth-note">{depth.tool.note}</p>}
        </div>
      )}
      {examLinks.length > 0 && (
        <div className="depth-exam">
          <span>
            <GraduationCap size={18} aria-hidden="true" />
            教檢連結
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
