import { ArrowRight } from "lucide-react";
import { guideLayers } from "../data/guideLayers";
import FormulaShowcase from "./FormulaShowcase";

const depthTags = ["生理與現象", "生理機制", "認知與策略", "教育實務"];

/** 首頁的導讀主軸：四層漏斗 */
export default function GuideFunnel() {
  return (
    <section className="section book-route" id="journey" aria-labelledby="book-route-title">
      <div className="container-wide">
        <span className="section-label">導讀主軸</span>
        <h2 className="section-title" id="book-route-title">
          從「大腦重塑」到「學習賦能」
        </h2>
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
        <div className="book-core key-lines" aria-label="全書三個關鍵句">
          <article>
            <span>關鍵句 1・可能</span>
            <h3>
              <mark className="key-mark">大腦是可塑的</mark>
            </h3>
            <p>任何年紀，大腦都能改變、重組，走出新的路徑；習慣不是天生的個性。</p>
          </article>
          <article>
            <span>關鍵句 2・機制</span>
            <h3>
              <mark className="key-mark">一起放電的神經元會彼此連結</mark>
            </h3>
            <p>重複的想法會走成自動反應；不再使用的路徑，也會慢慢變弱。</p>
          </article>
          <article>
            <span>關鍵句 3・方法</span>
            <FormulaShowcase compact />
            <p>先看見舊循環，再刻意練習新反應，最後用身體、睡眠與自我信賴讓改變站穩。</p>
          </article>
        </div>
      </div>
    </section>
  );
}
