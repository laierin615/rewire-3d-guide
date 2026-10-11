import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { chapters as deepReads } from "../data/bookContent";
import { guideChapters } from "../data/guideChapters";
import { guideLayers, topicNumber } from "../data/guideLayers";

/** 主題索引：依四層與小節列出全部主題，展開可看摘要、概念、提問與深讀 */
export default function TopicIndex() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const match = useMemo(
    () => (id: string) => {
      if (!q) return true;
      const ch = guideChapters.find(c => c.id === id);
      const deep = deepReads.find(d => d.topic === id);
      return [ch?.title, ch?.en, ch?.summary, ch?.concepts, deep?.thesis, deep?.keywords.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q);
    },
    [q]
  );
  const total = guideLayers.flatMap(l => l.chapters).filter(match).length;

  return (
    <div className="topic-index" id="topic-index">
      <div className="exam-part-head">
        <span className="exam-part-label">第三部分</span>
        <h3>主題索引</h3>
        <p>全部主題依四個層次排列。點開一個主題，看重點摘要、重要概念和想想看；有些主題另有深讀，補上書中例子、神經機制和教育連結。</p>
      </div>
      <label className="guide-search topic-index-search">
        <Search size={16} aria-hidden="true" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋主題或概念" aria-label="搜尋主題或概念" />
      </label>
      <p className="topic-index-count" aria-live="polite">
        {q ? `找到 ${total} 個主題` : `共 ${total} 個主題`}
      </p>
      {guideLayers.map(layer => {
        const sections = layer.sections
          .map((sec, si) => ({ sec, si, ids: sec.chapters.filter(match) }))
          .filter(x => x.ids.length);
        if (!sections.length) return null;
        return (
          <section key={layer.id} className={`topic-index-layer ${layer.id}`}>
            <h4>
              <span>{layer.label}</span>
              {layer.title}
              <small>{layer.question}</small>
            </h4>
            {sections.map(({ sec, si, ids }) => (
              <div key={sec.title} className="topic-index-section">
                <h5>
                  {guideLayers.indexOf(layer) + 1}.{si + 1} {sec.title}
                </h5>
                <ul>
                  {ids.map(id => {
                    const ch = guideChapters.find(c => c.id === id);
                    if (!ch) return null;
                    const deep = deepReads.find(d => d.topic === id);
                    return (
                      <li key={id}>
                        <details open={!!q}>
                          <summary>
                            <b>{topicNumber(id)}</b>
                            <strong>{ch.title}</strong>
                            {deep && <em>深讀</em>}
                            <ChevronDown size={16} aria-hidden="true" />
                          </summary>
                          <div className="topic-index-body">
                            <div>
                              <span>重點摘要</span>
                              <p>{ch.summary}</p>
                            </div>
                            <div>
                              <span>重要概念</span>
                              <p>{ch.concepts}</p>
                            </div>
                            <div>
                              <span>想想看</span>
                              <p>{ch.question}</p>
                            </div>
                            {deep && (
                              <div className="topic-index-deep">
                                <span>深讀：{deep.title}</span>
                                <p className="topic-index-thesis">{deep.thesis}</p>
                                <dl>
                                  <dt>核心論證</dt>
                                  <dd>{deep.explanation}</dd>
                                  <dt>書中例子</dt>
                                  <dd>{deep.example}</dd>
                                  <dt>神經機制</dt>
                                  <dd>{deep.mechanism}</dd>
                                  <dt>教育連結</dt>
                                  <dd>{deep.education}</dd>
                                </dl>
                                <blockquote>{deep.evidence}</blockquote>
                                <div className="keyword-row">
                                  {deep.keywords.map(k => (
                                    <span key={k}>{k}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <a href={`#chapter-${id}`}>
                              到這個主題 <ArrowRight size={15} aria-hidden="true" />
                            </a>
                          </div>
                        </details>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
