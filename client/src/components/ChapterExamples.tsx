import { useState } from "react";
import { BookOpen } from "lucide-react";
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
        書中例子
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
        <h5>{scene.title}</h5>
        <p>{scene.story}</p>
        <p className="example-insight">{scene.insight}</p>
      </article>
    </div>
  );
}
