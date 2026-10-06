import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  GraduationCap,
  MessageCircleQuestion,
  School,
} from "lucide-react";
import {
  examDeepQA,
  examQAGroups,
  rocYear,
  type ExamQAGroup,
} from "../data/examDeepQA";
import {
  examQuestions,
  neuroMechanismQuestions,
} from "../data/examQuestions";

type PracticeItem = {
  id: string;
  meta: string;
  stem: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
};

function withoutPageReference(text: string) {
  return text
    .replace(/（PDF p\.[^）]+）/g, "")
    .replace(/PDF p\.[0-9–、，.]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function findPractice(id: string): PracticeItem | null {
  const neuro = neuroMechanismQuestions.find(q => q.id === id);
  if (neuro)
    return {
      id,
      meta: `${rocYear(neuro.year)}教檢 · ${neuro.subject} · 第 ${neuro.number} 題`,
      stem: neuro.stem,
      options: neuro.options,
      answer: neuro.answer,
      explanation: `${neuro.explanation} ${withoutPageReference(neuro.bookConnection)}`,
      source: neuro.source,
    };
  const general = examQuestions.find(q => q.id === id);
  if (general)
    return {
      id,
      meta: `${rocYear(general.year)}教檢 · 第 ${general.number} 題 · ${general.concept}`,
      stem: general.stem,
      options: general.options,
      answer: general.answer,
      explanation: general.explanation,
      source: general.source,
    };
  return null;
}

function MiniQuiz({ item }: { item: PracticeItem }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <article className="mini-quiz">
      <span className="mini-quiz-meta">{item.meta}</span>
      <p className="mini-quiz-stem">{item.stem}</p>
      <div className="mini-quiz-options">
        {item.options.map((option, index) => {
          const correct = checked && index === item.answer;
          const wrong = checked && selected === index && index !== item.answer;
          return (
            <button
              key={option}
              aria-pressed={selected === index}
              className={`${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
              onClick={() => !checked && setSelected(index)}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
              {correct && <Check size={16} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {checked ? (
        <div className="mini-quiz-answer" aria-live="polite">
          <strong>
            {selected === item.answer
              ? "答對了。"
              : `正解是 ${String.fromCharCode(65 + item.answer)}。`}
          </strong>
          <p>{item.explanation}</p>
          <a href={item.source} target="_blank" rel="noreferrer">
            查看題本 <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      ) : (
        <button
          className="mini-quiz-check"
          disabled={selected === null}
          onClick={() => setChecked(true)}
        >
          核對答案
        </button>
      )}
    </article>
  );
}

export default function ExamDeepQAPanel() {
  const [group, setGroup] = useState<ExamQAGroup | "全部">("全部");
  const [activeId, setActiveId] = useState(examDeepQA[0].id);
  const [showPoints, setShowPoints] = useState(false);
  const detail = useRef<HTMLElement>(null);

  const list = useMemo(
    () =>
      group === "全部"
        ? examDeepQA
        : examDeepQA.filter(item => item.group === group),
    [group]
  );
  const active = examDeepQA.find(item => item.id === activeId) ?? list[0];
  const practice = active.related
    .map(findPractice)
    .filter((item): item is PracticeItem => item !== null);

  const select = (id: string) => {
    setActiveId(id);
    setShowPoints(false);
  };

  useEffect(() => {
    const open = (id: string, scroll: boolean) => {
      if (!examDeepQA.some(item => item.id === id)) return;
      setGroup("全部");
      select(id);
      if (scroll)
        requestAnimationFrame(() =>
          detail.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        );
    };
    const onOpen = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      history.replaceState(null, "", `#qa-${id}`);
      open(id, true);
    };
    window.addEventListener("rewire:open-qa", onOpen);
    if (location.hash.startsWith("#qa-")) {
      const id = location.hash.slice(4);
      window.setTimeout(() => open(id, true), 300);
    }
    return () => window.removeEventListener("rewire:open-qa", onOpen);
  }, []);

  return (
    <div className="exam-qa" id="exam-qa">
      <header className="exam-qa-head">
        <div>
          <span className="exam-part-label">第二部分</span>
          <h3>教檢深度問答</h3>
        </div>
        <p>
          每一題都先整理「書中說法」，再補上教師資格考常考的理論與答題要點。
          <strong>書中說法</strong>只來自原書；<strong>教檢延伸</strong>是本導讀補充，不是作者的主張。
        </p>
      </header>
      <div className="exam-qa-groups" role="group" aria-label="依考點分類">
        {(["全部", ...examQAGroups] as const).map(item => (
          <button
            key={item}
            aria-pressed={group === item}
            onClick={() => {
              setGroup(item);
              const first =
                item === "全部"
                  ? examDeepQA[0]
                  : examDeepQA.find(qa => qa.group === item);
              if (first) select(first.id);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="exam-qa-layout">
        <nav className="exam-qa-list" aria-label="教檢概念">
          {list.map(item => (
            <button
              key={item.id}
              aria-current={item.id === active.id ? "true" : undefined}
              onClick={event => {
                select(item.id);
                event.currentTarget.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "nearest",
                });
              }}
            >
              <small>{item.group}</small>
              <strong>{item.topic}</strong>
            </button>
          ))}
        </nav>
        <article className="exam-qa-detail" ref={detail} aria-live="polite">
          <div className="exam-qa-title">
            <span>{active.group}</span>
            <h4>{active.topic}</h4>
            <p>相關學者：{active.scholars}</p>
          </div>
          <div className="exam-qa-compare">
            <section className="qa-book">
              <h5>
                <BookOpen size={18} aria-hidden="true" />
                書中說法
              </h5>
              <p>{active.bookSays}</p>
              <div className="qa-chapter-links">
                {active.chapters.map(chapter => (
                  <a key={chapter.id} href={`#chapter-${chapter.id}`}>
                    回到 {chapter.label} <ArrowRight size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
            <section className="qa-theory">
              <h5>
                <GraduationCap size={18} aria-hidden="true" />
                教檢延伸
              </h5>
              <p>{active.theory}</p>
            </section>
          </div>
          <section className="qa-question">
            <h5>
              <MessageCircleQuestion size={18} aria-hidden="true" />
              深度問答
            </h5>
            <p className="qa-question-text">{active.question}</p>
            <button
              className="qa-reveal"
              aria-expanded={showPoints}
              onClick={() => setShowPoints(value => !value)}
            >
              {showPoints ? "收起答題要點" : "先想一想，再看答題要點"}
            </button>
            {showPoints && (
              <ol className="qa-points">
                {active.answerPoints.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ol>
            )}
          </section>
          <div className="qa-notes">
            <section className="qa-pitfall">
              <h5>
                <AlertTriangle size={18} aria-hidden="true" />
                容易混淆
              </h5>
              <p>{active.pitfall}</p>
            </section>
            <section className="qa-classroom">
              <h5>
                <School size={18} aria-hidden="true" />
                帶回教學現場
              </h5>
              <p>{active.classroom}</p>
            </section>
          </div>
          {practice.length > 0 && (
            <section className="qa-practice">
              <h5>相關歷屆試題</h5>
              <div className="qa-practice-grid">
                {practice.map(item => (
                  <MiniQuiz key={`${active.id}-${item.id}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
