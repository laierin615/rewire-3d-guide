import { GraduationCap, Layers3, ListChecks } from "lucide-react";
import { chapterDepth, type SourceKind } from "../data/chapterDepth";
import { examDeepQA } from "../data/examDeepQA";

/** 書中內容不加標籤，只有導讀另外補充的內容才標示。 */
export function SourceTag({ kind }: { kind: SourceKind }) {
  if (kind !== "導讀延伸") return null;
  return <span className="source-tag tag-guide">導讀補充</span>;
}

export function SourceLegend() {
  return (
    <p className="source-legend">
      標「<span className="source-tag tag-guide">導讀補充</span>」的是延伸說明，其餘都是作者在書裡談到的內容。
    </p>
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
