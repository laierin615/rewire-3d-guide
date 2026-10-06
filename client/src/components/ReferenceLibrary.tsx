import { useState } from "react";
import { Search, ArrowDownRight, BookOpen } from "lucide-react";
import { glossary, toolsData } from "../data/referenceLibrary";

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

export function PracticeTools() {
  return (
    <div className="practice-grid">
      {toolsData.map(([no, title, when, how, source]) => (
        <article key={no}>
          <span className="practice-number">{no}</span>
          <h3>{title}</h3>
          <dl>
            <div>
              <dt>何時用</dt>
              <dd>{when}</dd>
            </div>
            <div>
              <dt>怎麼做</dt>
              <dd>{how}</dd>
            </div>
          </dl>
          <p className="practice-source">
            <BookOpen size={13} />
            <span>{source}</span>
          </p>
        </article>
      ))}
    </div>
  );
}
