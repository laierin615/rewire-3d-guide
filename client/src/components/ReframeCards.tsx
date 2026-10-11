import { RefreshCw } from "lucide-react";
import { useState } from "react";

/** 書中〈重新架構你的想法〉的對照表，做成可翻面的卡片：正面是舊說法，翻過來是新說法。 */
export default function ReframeCards({
  title,
  pairs,
  labels = ["舊說法", "新說法"],
  hint = "點一下卡片，把腦中的舊說法換成新的說法。",
}: {
  title: string;
  pairs: [string, string][];
  labels?: [string, string];
  hint?: string;
}) {
  const [flipped, setFlipped] = useState<boolean[]>(() => pairs.map(() => false));
  const all = flipped.every(Boolean);
  const longest = Math.max(...pairs.flat().map(t => t.length));
  const size = longest > 40 ? "xl" : longest > 16 ? "tall" : "";
  const toggle = (i: number) => setFlipped(f => f.map((v, k) => (k === i ? !v : v)));

  return (
    <div className="reframe">
      <div className="reframe-head">
        <h5>
          <RefreshCw size={20} aria-hidden="true" />
          {title}
        </h5>
        <button type="button" onClick={() => setFlipped(pairs.map(() => !all))}>
          {all ? `全部翻回${labels[0]}` : `全部翻成${labels[1]}`}
        </button>
      </div>
      <p className="reframe-hint">{hint}</p>
      <ul className={`reframe-grid ${size}`}>
        {pairs.map(([before, after], i) => (
          <li key={before}>
            <button
              type="button"
              className={`reframe-card ${flipped[i] ? "flipped" : ""}`}
              onClick={() => toggle(i)}
              aria-pressed={flipped[i]}
              aria-label={flipped[i] ? `${labels[1]}：${after}` : `${labels[0]}：${before}，點一下翻面`}
            >
              <span className="reframe-face front">
                <small>{labels[0]}</small>
                <strong>{before}</strong>
                <i aria-hidden="true">點我翻面 ↻</i>
              </span>
              <span className="reframe-face back">
                <small>{labels[1]}</small>
                <strong>{after}</strong>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
