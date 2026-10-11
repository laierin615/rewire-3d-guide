import { ArrowRight, ChevronDown } from "lucide-react";
import { guideChapters } from "../data/guideChapters";
import { bookStages, guideLayers } from "../data/guideLayers";

const depthTags = ["生理與現象", "生理機制", "認知與策略", "教育實務"];

/** 首頁的導讀主軸：四層漏斗，加上原書章節對照 */
export default function GuideFunnel() {
  const layerOf = (id: string) => guideLayers.find(l => l.chapters.includes(id));
  return (
    <section className="section book-route" id="journey" aria-labelledby="book-route-title">
      <div className="container-wide">
        <span className="section-label">導讀主軸</span>
        <h2 className="section-title" id="book-route-title">
          從「大腦重塑」到「學習賦能」
        </h2>
        <p className="section-intro">
          原書以故事、反思提問和科學名詞交錯書寫。這份導讀把全書重新排成四層：從為什麼改變這麼難，到大腦怎麼改變，再到怎麼練、在教室裡怎麼用。
        </p>
        <ol className="guide-funnel" aria-label="導讀四層漏斗">
          {guideLayers.map((l, i) => (
            <li key={l.id} className={`funnel-${i}`}>
              <a href={`#${l.id}`}>
                <span className="funnel-no">{l.no}</span>
                <div>
                  <strong>
                    {l.title}
                    <small>{l.en}</small>
                  </strong>
                  <p>{l.question}</p>
                </div>
                <em>{depthTags[i]}</em>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
        <p className="funnel-path">
          覺察 <ArrowRight size={14} aria-hidden="true" /> 科學解碼 <ArrowRight size={14} aria-hidden="true" /> 策略重建{" "}
          <ArrowRight size={14} aria-hidden="true" /> 實務落地
          <small>對應教檢複習：生理學基礎 → 訊息處理 → 認知行為輔導</small>
        </p>
        <div className="book-core" aria-label="全書核心">
          <article>
            <span>核心提問</span>
            <p>我們的習慣和行為，是自己選的，還是環境無意中給的？作者的答案是：兩者兼有。</p>
          </article>
          <article>
            <span>核心機制</span>
            <p>一起放電的神經元會彼此連結。重複的想法會走成自動反應；不再使用的路徑，也會慢慢變弱。</p>
          </article>
          <article>
            <span>核心方法</span>
            <p>重複＋注意力＋刻意＝持久的改變。先看見舊循環，再練習新反應，最後用身體、睡眠與自我信賴讓改變站穩。</p>
          </article>
        </div>
        <details className="book-order">
          <summary>
            原書章節對照
            <small>想照原書順序讀，從這裡找每一章在導讀的哪一層</small>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>
          <div className="book-order-grid">
            {Object.entries(bookStages).map(([stage, name]) => (
              <section key={stage}>
                <h3>{name}</h3>
                <ul>
                  {guideChapters
                    .filter(ch => ch.stage === stage)
                    .map(ch => {
                      const layer = layerOf(ch.id);
                      return (
                        <li key={ch.id}>
                          <a href={`#chapter-${ch.id}`}>
                            {stage !== "intro" && stage !== "outro" && <b>{ch.no}</b>}
                            {ch.title}
                            {layer && <span className={`book-order-layer ${layer.id}`}>{layer.title}</span>}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
