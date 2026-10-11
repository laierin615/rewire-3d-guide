import { ArrowRight } from "lucide-react";
import { guideLayers } from "../data/guideLayers";

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
      </div>
    </section>
  );
}
