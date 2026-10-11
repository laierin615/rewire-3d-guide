import { BookOpen, Maximize2, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** 看得到才播放：離開畫面就暫停 CSS 與 SVG 動畫 */
function usePlayInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.classList.toggle("is-paused", !e.isIntersecting);
      el.querySelectorAll("svg").forEach(svg => (e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** 標題 REWIRE：RE 與 WIRE 之間用一條會亮起來的線重新接上 */
export function RewireWordmark() {
  return (
    <span className="rw-mark" aria-label="REWIRE">
      <span className="rw-re" aria-hidden="true">RE</span>
      <svg className="rw-link" viewBox="0 0 60 40" aria-hidden="true">
        <circle cx="6" cy="20" r="5" />
        <path className="rw-old" d="M6 20 Q30 40 54 20" />
        <path className="rw-new" d="M6 20 Q30 0 54 20" />
        <circle cx="54" cy="20" r="5" />
      </svg>
      <span className="rw-wire" aria-hidden="true">WIRE</span>
    </span>
  );
}

/** 舊連結變淡斷開，新連結接上並亮起 */
function RewireAnimation() {
  return (
    <svg className="decode-svg rewire-svg" viewBox="0 0 320 170" role="img" aria-label="神經元的舊連結變淡，新連結接上並亮起來">
      <path className="rwa-old" d="M40 85 C90 150 230 150 280 85" />
      <path className="rwa-new" d="M40 85 C90 20 230 20 280 85" />
      <circle className="rwa-signal" r="7">
        {!reducedMotion() && (
          <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;0.5;0.8;1" calcMode="linear" path="M40 85 C90 20 230 20 280 85" />
        )}
      </circle>
      <g className="rwa-node">
        <circle cx="40" cy="85" r="15" />
        <circle cx="280" cy="85" r="15" />
      </g>
      <text className="rwa-label old" x="160" y="158">舊連結：變淡、斷開</text>
      <text className="rwa-label new" x="160" y="22">新連結：接上、變強</text>
    </svg>
  );
}

const shapes = [
  // 圓：原本的樣子
  "M110 85 C110 57 132 35 160 35 C188 35 210 57 210 85 C210 113 188 135 160 135 C132 135 110 113 110 85 Z",
  // 被捏過的樣子
  "M100 95 C96 55 140 27 168 39 C200 51 236 65 216 101 C198 133 160 145 136 129 C116 117 104 113 100 95 Z",
  // 新的形狀：大腦輪廓
  "M92 100 C80 56 126 26 160 44 C196 22 246 54 228 100 C216 130 186 122 160 124 C130 130 100 128 92 100 Z",
];

/** 一團黏土被捏成新的形狀 */
function PlasticAnimation() {
  const values = [shapes[0], shapes[0], shapes[1], shapes[2], shapes[2], shapes[0]].join(";");
  return (
    <svg className="decode-svg plastic-svg" viewBox="0 0 320 170" role="img" aria-label="一團黏土被捏成新的形狀，最後變成大腦的輪廓">
      <path className="pla-clay" d={reducedMotion() ? shapes[2] : shapes[0]}>
        {!reducedMotion() && (
          <animate attributeName="d" dur="7s" repeatCount="indefinite" values={values} keyTimes="0;0.12;0.38;0.62;0.88;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />
        )}
      </path>
      <g className="pla-gyri">
        <path d="M118 92 C130 78 146 98 158 82" />
        <path d="M164 70 C178 58 192 76 206 66" />
        <path d="M150 108 C166 98 182 114 200 102" />
      </g>
      <circle className="pla-finger a" cx="98" cy="70" r="9" />
      <circle className="pla-finger b" cx="222" cy="108" r="9" />
      <text className="pla-label" x="160" y="162">能夠被塑形</text>
    </svg>
  );
}

function DecodeCards() {
  return (
    <div className="decode-cards">
      <article className="decode-card rewire">
        <div className="decode-word">
          <strong>
            <b>RE</b>
            <span>·</span>
            <b>WIRE</b>
          </strong>
          <p>
            <span>re＝重新</span>
            <span>wire＝接線</span>
          </p>
        </div>
        <RewireAnimation />
        <p className="decode-meaning">
          把大腦中的神經元<em>重新連接</em>。作者說：透過重新連接神經元，我們可以塑造自己的想法、習慣和行為。
        </p>
      </article>
      <article className="decode-card plastic">
        <div className="decode-word">
          <strong>
            <b>PLASTIC</b>
          </strong>
          <p>
            <span>希臘文 plastikos</span>
            <span>＝能夠塑形的</span>
          </p>
        </div>
        <PlasticAnimation />
        <p className="decode-meaning">
          大腦是<em>可塑的</em>：就算上了年紀，也能改變、重組，走出新的路徑。整容手術叫 plastic surgery，用的也是同一個字根。
        </p>
      </article>
    </div>
  );
}

function Background() {
  return (
    <div className="decode-background">
      <article>
        <h3>
          <UserRound size={20} aria-hidden="true" />
          關於作者
        </h3>
        <p>
          <b>妮可．維諾拉（Nicole Vignola）</b>
          念神經科學系大一時，第一次在神經解剖實驗室雙手捧著一顆人腦。她從小就想知道：我們的習慣和行為，是偶然得之，還是蓄意為之？
        </p>
        <p>她替自己訂下的人生使命，是把神經科學帶離實驗室和學術期刊，讓每個人都能受用。書中常穿插她自己的經歷、客戶的故事，以及和 IG 讀者的對話。</p>
      </article>
      <article>
        <h3>
          <BookOpen size={20} aria-hidden="true" />
          關於這本書
        </h3>
        <p>
          原書名 <i>Rewire: Break the Cycle, Alter Your Thoughts and Create Lasting Change</i>，意思是「打破循環、改變想法、創造持久的改變」。
        </p>
        <p>作者把它定位成一個「神經科學工具包」：說明大腦如何改變，也提供能在生活中實際練習的方法。中譯本由梁永安翻譯，時報出版。</p>
      </article>
    </div>
  );
}

/** 首頁開場：先認識兩個詞，再認識作者與這本書 */
export default function HeroIntro() {
  const [full, setFull] = useState(false);
  const ref = usePlayInView<HTMLDivElement>();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const openBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!full) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") {
        e.preventDefault();
        if (e.key === "Escape") setFull(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", key);
      openBtn.current?.focus();
    };
  }, [full]);

  return (
    <div className="container-wide hero-intro" ref={ref}>
      <header className="hero-intro-head">
        <div>
          <span className="eyebrow">開場</span>
          <h2>先認識兩個詞</h2>
        </div>
        <button ref={openBtn} type="button" className="hero-intro-full" onClick={() => setFull(true)}>
          <Maximize2 size={18} aria-hidden="true" />
          滿版
        </button>
      </header>
      <DecodeCards />
      <Background />
      {full && (
        <div className="hero-intro-present" role="dialog" aria-modal="true" aria-label="先認識兩個詞">
          <header>
            <h2>先認識兩個詞</h2>
            <button ref={closeBtn} type="button" onClick={() => setFull(false)} aria-label="離開滿版">
              <X size={24} />
            </button>
          </header>
          <DecodeCards />
          <Background />
        </div>
      )}
    </div>
  );
}
