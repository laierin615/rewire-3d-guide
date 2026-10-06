import { useState } from "react";
import { ArrowRight, MessageCircle, BookOpen } from "lucide-react";
import { bookScenes } from "../data/bookScenes";

export default function ChapterExamples({ chapterId }: { chapterId: string }) {
  const scenes = bookScenes.filter(scene => scene.chapter === chapterId);
  const [selected, setSelected] = useState(0);
  if (!scenes.length) return null;
  const scene = scenes[selected] ?? scenes[0];
  return (
    <div className="chapter-examples">
      <h4>
        <BookOpen size={20} />
        從書中例子理解
      </h4>
      {scenes.length > 1 && (
        <div className="example-switch" role="group" aria-label="選擇書中例子">
          {scenes.map((item, index) => (
            <button
              key={item.id}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
      <article className="example-story" aria-live="polite" aria-atomic="true">
        <span className="example-kind">{scene.kind} · 摘要改寫</span>
        <h5>{scene.title}</h5>
        <p>{scene.story}</p>
        <ol className="example-chain" aria-label="情境如何發展">
          {scene.chain.map((part, index) => (
            <li key={part}>
              <span>{part}</span>
              {index < scene.chain.length - 1 && (
                <ArrowRight size={18} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
        <div className="example-insight">
          <strong>連回本章</strong>
          <p>{scene.insight}</p>
        </div>
        <div className="example-prompt">
          <MessageCircle size={20} />
          <div>
            <strong>導讀提問</strong>
            <p>{scene.question}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
