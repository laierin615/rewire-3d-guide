import { Eye, Repeat, Sparkles, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const terms = [
  {
    key: "repeat",
    name: "重複",
    en: "Repetition",
    icon: Repeat,
    short: "一次又一次走同一條路",
    text: "一起放電的神經元會彼此連結。神經元要一次又一次地溝通，才會形成牢固的連結；科比青少年時每天投籃一千次。",
  },
  {
    key: "attention",
    name: "注意力",
    en: "Attention",
    icon: Eye,
    short: "先看見老路正在發生",
    text: "大腦不知道對錯，只會強化被重複的路。舊念頭冒出來時先注意到它，才有機會不讓它自動跑完。",
  },
  {
    key: "intent",
    name: "刻意",
    en: "Deliberate",
    icon: Target,
    short: "有意識地選擇新的反應",
    text: "替新習慣安排好提示，舊反應一出現就攔截，接上你想建立的新行為，並慶祝每一個小進步。",
  },
] as const;

const STEP_MS = 1100;

/** 神經可塑性的公式：三項依序點亮，最後得出持久的改變 */
export default function FormulaShowcase({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(4);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const play = () => {
      window.clearInterval(timer);
      setStep(0);
      timer = window.setInterval(() => {
        setStep(s => {
          if (s >= 4) {
            window.clearInterval(timer);
            return s;
          }
          return s + 1;
        });
      }, STEP_MS);
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && play(), { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const active = terms.find(t => t.key === open);

  return (
    <div ref={ref} className={`formula ${compact ? "compact" : ""}`} aria-label="重複加注意力加刻意，等於持久的改變">
      {!compact && <p className="formula-kicker">神經可塑性的公式</p>}
      <div className="formula-row">
        {terms.map((t, i) => {
          const Icon = t.icon;
          return (
            <div className="formula-cell" key={t.key}>
              {i > 0 && (
                <span className={`formula-op ${step > i ? "on" : ""}`} aria-hidden="true">
                  ＋
                </span>
              )}
              <button
                type="button"
                className={`formula-term ${t.key} ${step > i ? "on" : ""} ${open === t.key ? "open" : ""}`}
                aria-pressed={open === t.key}
                onClick={() => setOpen(o => (o === t.key ? null : t.key))}
                disabled={compact}
              >
                <Icon size={compact ? 18 : 26} aria-hidden="true" />
                <strong>{t.name}</strong>
                {!compact && <small>{t.short}</small>}
              </button>
            </div>
          );
        })}
        <span className={`formula-op eq ${step > 3 ? "on" : ""}`} aria-hidden="true">
          ＝
        </span>
        <div className={`formula-result ${step > 3 ? "on" : ""}`}>
          <Sparkles size={compact ? 18 : 28} aria-hidden="true" />
          <strong>持久的改變</strong>
          {!compact && <small>新路走成自動反應</small>}
        </div>
      </div>
      {!compact && (
        <div className="formula-detail" aria-live="polite">
          {active ? (
            <p>
              <b>{active.name}</b>
              {active.text}
            </p>
          ) : (
            <p className="formula-hint">點一下「重複」「注意力」「刻意」，看書中怎麼說。少了任何一項，新路都很難走成。</p>
          )}
        </div>
      )}
    </div>
  );
}
