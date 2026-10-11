import { useState } from "react";
import { Search, ArrowDownRight, ArrowRight } from "lucide-react";
import { glossary, toolsData } from "../data/referenceLibrary";
import { topicLabel } from "../data/guideLayers";

export function TermLibrary() {
  const [query, setQuery] = useState("");
  const terms = glossary.filter(term =>
    term.join(" ").toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <section className="term-library" aria-labelledby="term-title">
      <div className="reference-heading">
        <div>
          <span className="eyebrow">CONCEPT LIBRARY</span>
          <h3 id="term-title">先懂詞語，再懂整個過程。</h3>
          <p>展開查看白話解釋與書中脈絡。</p>
        </div>
        <label className="guide-search">
          <Search size={16} />
          <input
            type="search"
            aria-label="搜尋神經科學概念"
            placeholder="搜尋中文或英文術語"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="term-grid">
        {terms.map(([name, en, explain, context]) => (
          <details key={en}>
            <summary>
              <span>
                <strong>{name}</strong>
                <small>{en}</small>
              </span>
              <ArrowDownRight size={17} />
            </summary>
            <div>
              <span>白話解釋</span>
              <p>{explain}</p>
              <span>書中脈絡</span>
              <p>{context}</p>
            </div>
          </details>
        ))}
      </div>
      {!terms.length && (
        <p className="reference-empty">沒有符合的概念，試試其他關鍵字。</p>
      )}
    </section>
  );
}

const toolTopic: Record<string, string> = {
  "01": "break-cycle",
  "02": "neurotoolkit",
  "03": "negative-bias",
  "04": "confirmation-bias",
  "05": "make-space",
  "06": "phone",
  "07": "visualization",
  "08": "strategy",
  "09": "sleep",
  "10": "self-trust",
};

/** 練習清單：每個練習一行，連回原本的主題 */
export function PracticeTools() {
  return (
    <ol className="practice-list">
      {toolsData.map(([no, title, , how]) => {
        const id = toolTopic[no];
        return (
          <li key={no}>
            <span className="practice-number">{no}</span>
            <div>
              <strong>{title}</strong>
              <p>{how}</p>
            </div>
            {id && (
              <a href={`#chapter-${id}`}>
                {topicLabel(id)}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
