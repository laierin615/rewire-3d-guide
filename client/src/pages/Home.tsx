import BookWalkthrough from "../components/BookWalkthrough";
import ExamDeepQAPanel from "../components/ExamDeepQA";
import { SourceLegend } from "../components/ChapterDepth";
import { neuroQuestionChapters, neuroRegionNotes, rocYear } from "../data/examDeepQA";
import TeachingGuide from "../components/TeachingGuide";
import { TermLibrary, PracticeTools } from "../components/ReferenceLibrary";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  BookMarked,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Columns2,
  CircleDot,
  ExternalLink,
  Eye,
  Footprints,
  HeartPulse,
  Layers3,
  Lightbulb,
  Microscope,
  Moon,
  Network,
  Pause,
  Play,
  Quote,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import {
  bookExamples,
  bookQuotes,
  brainRegions,
  chapters,
  phaseLabels,
  type BrainRegionId,
} from "../data/bookContent";
import {
  neuroMechanismQuestions,
  officialExamSourceUrl,
  type NeuroExamRegion,
} from "../data/examQuestions";

const coverImage = "./book-cover.jpg";

type PhaseId = keyof typeof phaseLabels;
type BrainState = "baseline" | "threat" | "safe";
type QuizFilter = "全部" | NeuroExamRegion;

const quizFilters: QuizFilter[] = ["全部", "額葉／前額葉", "海馬迴", "杏仁核", "大腦皮質與側化", "腦幹與注意系統", "執行功能與工作記憶"];

const brainToQuizFilter: Partial<Record<BrainRegionId, QuizFilter>> = {
  frontal: "額葉／前額葉",
  frontoparietal: "執行功能與工作記憶",
  amygdala: "杏仁核",
  hippocampus: "海馬迴",
  ras: "腦幹與注意系統",
};

const chapterLinks = [
  ["journey", "", "全書地圖"],
  ["intro", "", "導言"],
  ["stage1", "01", "擺脫負面情緒"],
  ["stage2", "02", "改變你的敘事"],
  ["stage3", "03", "增強積極性"],
  ["outro", "", "尾聲"],
  ["exam", "", "教檢連結"],
  ["reference", "", "延伸資料"],
] as const;

const videoLogicPhases = [
  { label: "GUIDE 01", title: "先理解：大腦不是固定硬體", hook: "你不是被個性判決的人，而是一個可以更新的神經系統。", text: "《Rewire》的第一個入口，是把大腦看成可塑的生物系統。它會為了節省能量而偏好熟悉路徑，因此改變常常先讓人感到卡住；那不是做不到，而是新路徑還沒有足夠的重複與注意力。", cards: ["省電模式：左手刷牙為何突然變得不順？", "年齡不是邊界：新經驗仍能改變連結效率。", "把『我就是這樣』改成『我目前常走這條路』。"] },
  { label: "GUIDE 02", title: "再看見：大腦如何製造痛點", hook: "自動反應不是你的全部，它只是被練習得很熟的預測。", text: "當反芻、負面偏見、確認偏誤與壓力疊在一起，大腦會把威脅線索放大，並尋找支持既有信念的證據。先辨認三種壓力——警覺、急性與適應不良的慢性壓力——才能找到真正的介入位置。", cards: ["反芻：同一段痛苦被反覆播放。", "負面偏見：一個威脅訊號可能蓋過許多肯定。", "慢性壓力：長期警覺會壓縮記憶、注意與控制資源。"] },
  { label: "GUIDE 03", title: "接著重塑：用機制取代意志力", hook: "改變不是刪除過去，而是讓另一條路變得更容易被選擇。", text: "重複啟動會強化連結；不再配對舊反應、同時練習替代反應，則能逐步降低舊路徑的優勢。後設認知把人從『我正在生氣』帶到『我正在注意到生氣如何影響我的選擇』，這個距離就是重新評估的空間。", cards: ["長期增強：有意義的共同啟動讓新路徑更有效率。", "命名情緒：把命令轉成可以被理解的資訊。", "觸發與反應之間：先暫停，再選擇下一步。"] },
  { label: "GUIDE 04", title: "最後實踐：把科學放進日常", hook: "重複 × 注意力 × 刻意，才會把一次嘗試變成持久改變。", text: "改變需要進入日常節奏：早晨先讓大腦接觸光線與身體，而不是立即被手機餵入訊息；休息要真正離開高刺激；用視覺化預演、呼吸與小型替代行動，為新路徑提供更多成功經驗。", cards: ["早晨儀式：先照光、伸展、喝水，再接收大量訊息。", "真正休息：遠離社群刺激，讓注意力恢復。", "視覺化：先在腦中預演新反應與突發狀況。"] },
] as const;

const conceptChapterCards = [
  {
    phase: "第一階段",
    title: "擺脫負面情緒",
    icon: <ShieldCheck size={22} />,
    iconLabel: "安全與威脅辨識",
    brainRegion: "杏仁核 × 前額葉",
    brainDescription: "杏仁核先辨識威脅，前額葉再幫你停一下、想清楚再回應。",
    brainTarget: "amygdala",
    pulseClass: "pulse-coral",
    summary: "先辨認負面偏見、思想慣性與逐步累積的壓力，理解大腦為何會把熟悉的痛苦誤認成安全感。",
    chapters: chapters.filter((chapter) => chapter.phase === "phase1"),
    accent: "coral",
  },
  {
    phase: "第二階段",
    title: "改變你的敘事",
    icon: <Network size={22} />,
    iconLabel: "神經網絡重組",
    brainRegion: "海馬迴 × 突觸網絡",
    brainDescription: "海馬迴把經驗放回情境中，突觸則讓反覆練習慢慢走成新路。",
    brainTarget: "hippocampus",
    pulseClass: "pulse-violet",
    summary: "透過覺察、重複與留白，讓新的反應逐步取得與舊路徑競爭的機會。",
    chapters: chapters.filter((chapter) => chapter.phase === "phase2"),
    accent: "gold",
  },
  {
    phase: "第三階段",
    title: "增強積極性",
    icon: <Sparkles size={22} />,
    iconLabel: "新路徑增強",
    brainRegion: "前額葉控制網絡",
    brainDescription: "前額葉控制網絡協助規劃、抑制衝動，並把目標變成下一步行動。",
    brainTarget: "frontoparietal",
    pulseClass: "pulse-gold",
    summary: "把挫折轉成回饋，培養心理韌性與成長心態，讓可塑性不只用來修補，也用來創造。",
    chapters: chapters.filter((chapter) => chapter.phase === "phase3"),
    accent: "sage",
  },
  {
    phase: "全書收束",
    title: "讓身體支援改變",
    icon: <HeartPulse size={22} />,
    iconLabel: "身心節律支援",
    brainRegion: "腦幹 × 網狀活化系統",
    brainDescription: "腦幹維持清醒、呼吸與心跳，網狀活化系統幫你調整注意力的開關。",
    brainTarget: "ras",
    pulseClass: "pulse-mint",
    summary: "運動、睡眠與日常環境共同提供神經系統所需的能量，將心理上的理解落實為可持續的生活節奏。",
    chapters: chapters.filter((chapter) => chapter.number === "10"),
    accent: "blue",
  },
] as const;

function BiasRuminationVisual() {
  const [mode, setMode] = useState<"bias" | "rumination">("bias");
  return <div className={`mechanism-visual ${mode === "bias" ? "bias-mode" : "rumination-mode"}`}><div className="mechanism-visual-head"><div><span className="eyebrow">NEURAL LOOP / LIVE MODEL</span><h4>{mode === "bias" ? "負面偏見：威脅訊號被放大" : "反芻：同一條路徑反覆播放"}</h4></div><div className="mechanism-tabs"><button className={mode === "bias" ? "active" : ""} onClick={() => setMode("bias")}>負面偏見</button><button className={mode === "rumination" ? "active" : ""} onClick={() => setMode("rumination")}>反芻</button></div></div><div className="mechanism-visual-body"><svg viewBox="0 0 620 190" role="img" aria-label={mode === "bias" ? "負面偏見放大威脅訊號的神經迴路示意圖" : "反芻反覆啟動同一條神經迴路的示意圖"}><defs><filter id="mechanismGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter><path id="biasPath" d="M72 100 C165 30 214 150 310 92 S453 42 548 95" /><path id="ruminationPath" d="M72 100 C155 24 240 28 302 96 C366 165 454 162 548 95 C456 28 365 31 302 96 C238 164 150 166 72 100" /></defs><path className="mechanism-base-path" d="M72 100 C165 30 214 150 310 92 S453 42 548 95" /><path className={`mechanism-active-path ${mode === "bias" ? "bias-path" : "rumination-path"}`} d={mode === "bias" ? "M72 100 C165 30 214 150 310 92 S453 42 548 95" : "M72 100 C155 24 240 28 302 96 C366 165 454 162 548 95 C456 28 365 31 302 96 C238 164 150 166 72 100"} />{mode === "bias" ? <><circle className="mechanism-node input-node" cx="72" cy="100" r="13" /><circle className="mechanism-node threat-node" cx="310" cy="92" r="17" /><circle className="mechanism-node control-node" cx="548" cy="95" r="13" /><text x="42" y="143">輸入</text><text x="270" y="48">威脅顯著性</text><text x="503" y="143">注意偏向</text><circle className="mechanism-particle bias-particle" r="7"><animateMotion dur="2.1s" repeatCount="indefinite"><mpath href="#biasPath" /></animateMotion></circle></> : <><circle className="mechanism-node input-node" cx="72" cy="100" r="13" /><circle className="mechanism-node loop-node" cx="302" cy="96" r="18" /><circle className="mechanism-node control-node" cx="548" cy="95" r="13" /><text x="42" y="143">觸發</text><text x="262" y="48">反覆咀嚼</text><text x="493" y="143">回到原點</text><circle className="mechanism-particle rumination-particle" r="7"><animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#ruminationPath" /></animateMotion></circle></>}</svg></div><p className="mechanism-visual-caption">{mode === "bias" ? "大腦為了生存會優先處理威脅線索；若沒有重新評估，注意力便更容易被負面訊息攫取。" : "反芻不是單純『想太多』，而是同一組記憶、情緒與預測反覆共同啟動，讓舊路徑持續保持優勢。"}</p></div>;
}

function withoutPageReference(text: string) {
  return text
    .replace(/（PDF p\.[^）]+）/g, "")
    .replace(/PDF p\.[0-9–、，.]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const examCoverage = [
  { year: 2016, count: 1, note: "海馬迴" },
  { year: 2017, count: 5, note: "額葉、海馬、杏仁核" },
  { year: 2018, count: 1, note: "官方範例題" },
  { year: 2019, count: 3, note: "恐懼、額葉、注意" },
  { year: 2020, count: 0, note: "無直接腦區題" },
  { year: 2021, count: 1, note: "海馬迴" },
  { year: 2022, count: 1, note: "前額葉" },
  { year: 2023, count: 1, note: "額葉" },
  { year: 2024, count: 1, note: "前額葉" },
  { year: 2025, count: 2, note: "前額葉、執行功能" },
];

const foundations = [
  {
    icon: <CircleDot size={19} />,
    title: "神經元與突觸",
    text: "神經元以電化學訊號傳遞資訊；突觸是細胞彼此交換訊息的微小間隙。反覆共同啟動會改變連結效率。",
    page: "PDF p.8–10",
  },
  {
    icon: <Layers3 size={19} />,
    title: "灰質與白質",
    text: "灰質包含大量神經元胞體與突觸，白質以髓鞘化軸突連結較遠區域。思考與行為來自網絡協作，不是某一點單獨完成。",
    page: "PDF p.213–214",
  },
  {
    icon: <Network size={19} />,
    title: "神經網絡",
    text: "注意、記憶、情緒與控制功能橫跨多個腦區。『杏仁核劫持』是方便理解的比喻，實際上是網絡權重與資源分配改變。",
    page: "PDF p.45–47",
  },
  {
    icon: <RefreshCw size={19} />,
    title: "可塑性是雙向的",
    text: "路徑可以因重複而增強，也可因不再共同啟動而減弱。新經驗不是刪除過去，而是增加另一條可被選擇的路。",
    page: "PDF p.11、p.74–75",
  },
];

const lobes = [
  { name: "額葉", role: "規劃、抑制、決策、動作與語言產出", note: "前額葉是額葉前端的高階聯合區。" },
  { name: "頂葉", role: "身體感覺、空間注意、數量與感覺整合", note: "與額葉共同構成重要的控制網絡。" },
  { name: "顳葉", role: "聽覺、語意、物體辨識與記憶", note: "海馬迴與杏仁核位在內側顳葉深部。" },
  { name: "枕葉", role: "視覺訊息的初步處理與特徵分析", note: "看見並不等於理解，仍須與其他區域整合。" },
  { name: "小腦", role: "動作協調、時序、誤差修正與部分認知歷程", note: "不只控制平衡，也參與自動化學習。" },
  { name: "腦幹", role: "呼吸、心跳、清醒與基本生存調節", note: "網狀活化系統的核心結構位於此處。" },
];

const mechanismSteps = {
  threat: [
    ["01", "威脅線索", "不確定、疼痛、羞辱或過往記憶提高顯著性。"],
    ["02", "杏仁核快速評估", "警報優先，注意開始偏向危險線索。"],
    ["03", "下丘腦與 HPA 軸", "交感神經、腎上腺素與皮質醇動員身體。"],
    ["04", "控制資源變窄", "工作記憶與前額葉抑制較難維持，熟悉反應更容易出現。"],
  ],
  safe: [
    ["01", "安全線索", "清楚預測、穩定關係、呼吸與環境訊息降低警報。"],
    ["02", "海馬情境化", "把『現在』和過去危險記憶區分，更新事件脈絡。"],
    ["03", "副交感調節", "迷走神經相關路徑支持心率下降與身體恢復。"],
    ["04", "前額葉重新參與", "比較、抑制、規劃與替代選項重新取得空間。"],
  ],
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openReference(id: string) {
  const reference = document.getElementById("reference");
  if (reference instanceof HTMLDetailsElement) reference.open = true;
  requestAnimationFrame(() => scrollToId(id));
}

function BrainAtlas({ active, state, onSelect }: { active: BrainRegionId; state: BrainState; onSelect: (id: BrainRegionId) => void }) {
  const nodeColors: Record<BrainRegionId, string> = { frontal: "#ef7658", amygdala: "#ef7658", hippocampus: "#9474cf", ras: "#4e9e91", frontoparietal: "#c7953c" };
  const positions: Record<BrainRegionId, [number, number]> = {
    frontal: [465, 145],
    amygdala: [328, 236],
    hippocampus: [272, 270],
    ras: [177, 279],
    frontoparietal: [382, 102],
  };
  const focus: BrainRegionId = state === "threat" ? "amygdala" : state === "safe" ? "frontal" : active;
  const [x, y] = positions[focus];
  const paths = [
    [465, 145, 328, 236],
    [272, 270, 328, 236],
    [177, 279, 328, 236],
    [382, 102, 465, 145],
    [272, 270, 465, 145],
  ];
  const pathColors = ["#ef7658", "#9474cf", "#4e9e91", "#c7953c", "#9474cf"];

  return (
    <svg className="atlas-svg" viewBox="0 0 640 390" role="img" aria-label="額葉、杏仁核、海馬迴、網狀活化系統與額頂葉控制網絡示意圖">
      <defs>
        <filter id="atlasGlow"><feGaussianBlur stdDeviation="8" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path className="atlas-shell" d="M91 219C67 177 82 125 129 101C141 54 194 31 240 53C281 17 348 32 375 71C430 39 494 67 506 123C554 139 567 197 536 231C551 282 504 326 459 316C420 351 362 347 334 318C288 348 230 330 214 291C161 304 105 279 91 219Z" />
      <path className="atlas-frontal" d="M376 72C431 38 496 68 507 124C554 140 567 198 536 231C519 248 493 252 464 245C469 207 463 170 441 140C424 117 401 95 376 72Z" />
      <path className="atlas-parietal" d="M239 53C282 17 349 32 376 72C401 95 423 115 441 140C407 154 365 159 324 148C282 138 253 102 239 53Z" />
      <path className="atlas-temporal" d="M214 291C165 302 112 278 96 233C147 214 200 207 251 216C292 224 318 251 334 318C286 349 230 330 214 291Z" />
      <path className="atlas-occipital" d="M536 231C551 282 504 326 459 316C419 350 362 347 334 318C349 272 377 241 421 226C462 212 500 217 536 231Z" />
      <path className="atlas-ridges" d="M128 137C175 108 204 137 236 109M105 190C153 166 187 191 221 165M120 240C162 217 198 242 232 222M246 88C281 111 292 137 322 148M304 54C328 73 344 88 382 100M442 140C472 148 491 167 507 191M251 216C291 199 326 211 358 231M334 318C363 288 389 271 421 255" />
      {paths.map(([x1, y1, x2, y2], index) => (
        <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: pathColors[index] }} className={`atlas-link ${state === "threat" && index === 0 ? "danger" : ""} ${state === "safe" && (index === 4 || index === 1) ? "regulated" : ""}`} />
      ))}
      <path className="atlas-brainstem" d="M183 247C178 276 173 302 154 327C172 334 195 328 207 311C218 294 216 276 210 258Z" />
      <ellipse className="atlas-cerebellum" cx="177" cy="258" rx="48" ry="35" />
      {Object.entries(positions).map(([id, [cx, cy]]) => (
        <g key={id} className={`atlas-node ${focus === id ? "active" : ""} ${state === "threat" && id === "amygdala" ? "danger" : ""} ${state === "safe" && id === "frontal" ? "regulated" : ""}`} role="button" tabIndex={0} aria-label={`查看${id}相關教檢題目`} onClick={() => onSelect(id as BrainRegionId)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(id as BrainRegionId); } }}>
          <circle cx={cx} cy={cy} r="9" style={{ fill: nodeColors[id as BrainRegionId] }} />
          <circle cx={cx} cy={cy} r="21" className="atlas-ring" style={{ stroke: nodeColors[id as BrainRegionId] }} />
        </g>
      ))}
      <circle cx={x} cy={y} r="17" className="atlas-signal" style={{ fill: nodeColors[focus] }} filter="url(#atlasGlow)" />
      <g className="atlas-labels">
        <text x="493" y="130">額葉</text>
        <text x="356" y="229">杏仁核</text>
        <text x="222" y="307">海馬迴</text>
        <text x="116" y="324">腦幹／RAS</text>
        <text x="337" y="76">額頂葉網絡</text>
      </g>
    </svg>
  );
}

function BrainConstellation() {
  const nodes = [[42, 61], [61, 34], [86, 27], [108, 47], [119, 74], [96, 88], [69, 84], [56, 105], [84, 112], [127, 105]];
  const links = [[0, 1], [1, 2], [1, 3], [0, 6], [3, 4], [3, 5], [4, 5], [5, 6], [6, 7], [6, 8], [5, 8], [4, 9], [8, 9]];
  return (
    <div className="brain-constellation" aria-label="神經元與腦區連結動畫示意" role="img">
      <div className="brain-constellation-glow" />
      <svg viewBox="0 0 160 140" aria-hidden="true">
        <path className="mini-brain-shell" d="M38 76C25 62 31 42 47 37C46 20 66 12 78 24C94 12 115 23 113 40C131 43 135 63 122 74C132 92 116 111 99 105C90 125 65 122 60 105C42 108 30 95 38 76Z" />
        {links.map(([from, to], index) => <line key={index} x1={nodes[from][0]} y1={nodes[from][1]} x2={nodes[to][0]} y2={nodes[to][1]} className="mini-neural-link" style={{ animationDelay: `${index * -180}ms` }} />)}
        {nodes.map(([cx, cy], index) => <g key={index} className="mini-neural-node" style={{ animationDelay: `${index * -240}ms` }}><circle cx={cx} cy={cy} r={index % 3 === 0 ? 4.5 : 3.2} /><circle cx={cx} cy={cy} r="10" className="mini-neural-ring" /></g>)}
        <path className="mini-brain-fold" d="M52 48C68 56 72 41 86 45C98 49 96 61 111 58M49 74C64 66 70 78 82 70C94 62 105 75 118 70M62 93C73 83 83 96 96 88" />
      </svg>
      <span className="brain-constellation-label">NEURAL NETWORK / LIVE</span>
    </div>
  );
}

const brain3DNodes: Array<{ id: BrainRegionId; label: string; x: string; y: string }> = [
  { id: "frontal", label: "額葉", x: "73%", y: "31%" },
  { id: "frontoparietal", label: "額頂葉", x: "58%", y: "21%" },
  { id: "amygdala", label: "杏仁核", x: "58%", y: "55%" },
  { id: "hippocampus", label: "海馬迴", x: "43%", y: "62%" },
  { id: "ras", label: "腦幹／RAS", x: "27%", y: "68%" },
];

function playBrainTone(regionId: BrainRegionId) {
  const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const frequencies: Record<BrainRegionId, number> = { frontal: 392, amygdala: 196, hippocampus: 294, ras: 220, frontoparietal: 440 };
  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = regionId === "amygdala" ? "sawtooth" : "sine";
  oscillator.frequency.value = frequencies[regionId];
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.45);
  window.setTimeout(() => void context.close(), 700);
}

function Brain3DModel({ active, state, onSelect }: { active: BrainRegionId; state: BrainState; onSelect: (id: BrainRegionId) => void }) {
  const [rotation, setRotation] = useState({ x: -8, y: -18 });
  const [dragging, setDragging] = useState(false);
  const [zoomed, setZoomed] = useState<BrainRegionId | null>(null);
  const dragOrigin = useRef({ x: 0, y: 0, rotationX: 0, rotationY: 0 });
  const selectRegion = (id: BrainRegionId) => { setZoomed(id); onSelect(id); playBrainTone(id); };
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX, y: event.clientY, rotationX: rotation.x, rotationY: rotation.y };
    setDragging(true);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setRotation({ x: Math.max(-42, Math.min(42, dragOrigin.current.rotationX - (event.clientY - dragOrigin.current.y) * 0.35)), y: dragOrigin.current.rotationY + (event.clientX - dragOrigin.current.x) * 0.45 });
  };
  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => { if (dragging) event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); };
  return (
    <section className="brain-3d-lab" aria-labelledby="brain-3d-title">
      <div className="brain-3d-copy"><span className="eyebrow">BRAIN COLLABORATION MAP</span><h3 className="serif" id="brain-3d-title">從不同角度，看見腦區如何協作。</h3><p>拖曳模型旋轉視角；點擊腦區節點，觀察它在控制、記憶、情境與注意中的角色。</p><div className="brain-3d-legend"><span><i className="legend-dot dot-coral" />高階控制</span><span><i className="legend-dot dot-gold" />記憶與情境</span><span><i className="legend-dot dot-sage" />清醒與注意</span></div></div>
      <div className={`brain-3d-stage ${dragging ? "is-dragging" : ""}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging} role="application" aria-label="可拖曳旋轉的腦區關係圖層">
        <div className="brain-3d-grid" aria-hidden="true" />
        <div className="brain-3d-object" style={{ transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
          <div className="brain-3d-depth depth-back" /><div className="brain-3d-depth depth-mid" />
          <svg className="brain-3d-svg" viewBox="0 0 420 300" aria-hidden="true"><path className="brain-3d-silhouette" d="M60 188C31 158 39 111 75 94C72 54 112 30 148 48C171 17 220 22 240 51C279 26 328 46 331 85C372 90 391 127 370 158C390 198 354 238 316 225C290 269 233 268 209 239C166 265 112 245 111 211C87 215 68 205 60 188Z" /><path className="brain-3d-folds" d="M83 105C117 82 135 115 164 91C186 73 205 102 228 84C251 67 272 98 297 86M67 141C101 119 124 151 151 132C181 111 201 143 229 125C260 106 283 136 324 118M73 176C106 154 135 185 162 164C187 145 209 180 239 157C269 135 301 171 349 148M113 211C142 185 165 221 192 198C219 176 240 211 267 190C294 168 315 199 338 184" /><path className="brain-3d-midline" d="M211 46C198 84 204 120 211 153C217 188 208 220 209 239" /></svg>
          <div className="brain-3d-node-layer">{brain3DNodes.map((node) => <button key={node.id} className={`brain-3d-node node-${node.id} ${active === node.id ? "active" : ""} ${zoomed === node.id ? "zoomed" : ""} state-${state}`} style={{ left: node.x, top: node.y }} onClick={() => selectRegion(node.id)} aria-label={`查看${node.label}`}><span /><b>{node.label}</b></button>)}</div>
        </div>
        <div className="brain-3d-hint"><ArrowLeftRight size={14} />拖曳旋轉 · 點擊腦區</div>
      </div>
    </section>
  );
}

function NeuralPath({ step }: { step: number }) {
  const lines = [[34, 105, 118, 54], [34, 105, 132, 170], [34, 105, 228, 120], [118, 54, 228, 120], [132, 170, 228, 120], [228, 120, 335, 52], [228, 120, 352, 183], [335, 52, 405, 142], [352, 183, 405, 142], [405, 142, 475, 82], [405, 142, 494, 205]];
  const nodes = [[34, 105], [118, 54], [132, 170], [228, 120], [335, 52], [352, 183], [405, 142], [475, 82], [494, 205]];
  const activeCount = Math.min(lines.length, 2 + step * 3);
  return (
    <svg className="path-svg" viewBox="0 0 520 230" role="img" aria-label="重複經驗使神經路徑逐步增強的示意圖">
      {lines.map(([x1, y1, x2, y2], index) => <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} className={index < activeCount ? "active" : ""} />)}
      {nodes.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={index <= step * 3 + 2 ? 7 : 5} className={index <= step * 3 + 2 ? "active" : ""} />)}
    </svg>
  );
}

type SignalScenario = "baseline" | "deep-breath" | "sudden-stress";

function VitalMetrics({ mode, step, running, scenario, soundOn }: { mode: BrainState; step: number; running: boolean; scenario: SignalScenario; soundOn: boolean }) {
  const [vitals, setVitals] = useState({ heartRate: 112, cortisol: 78, hrv: 28 });
  const heartRateRef = useRef(vitals.heartRate);
  heartRateRef.current = vitals.heartRate;
  const target = scenario === "deep-breath" ? { heartRate: 58, cortisol: 22, hrv: 78 } : scenario === "sudden-stress" ? { heartRate: 132, cortisol: 91, hrv: 18 } : mode === "safe" ? { heartRate: 68, cortisol: 31, hrv: 62 } : { heartRate: 112, cortisol: 78, hrv: 28 };
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setVitals((current) => ({
        heartRate: Math.round(current.heartRate + (target.heartRate - current.heartRate) * 0.12 + (Math.random() - .5) * 2),
        cortisol: Math.round(current.cortisol + (target.cortisol - current.cortisol) * 0.1 + (Math.random() - .5) * 1.4),
        hrv: Math.round(current.hrv + (target.hrv - current.hrv) * 0.1 + (Math.random() - .5) * 1.2),
      }));
    }, 160);
    return () => window.clearInterval(timer);
  }, [mode, step, running, target.heartRate, target.cortisol, target.hrv]);
  useEffect(() => {
    if (!soundOn || !running) return;
    const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;
    const context = new AudioContextCtor();
    const beat = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = mode === "safe" ? 178 : 138;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.13);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.15);
    };
    let timer = 0;
    const schedule = () => { beat(); timer = window.setTimeout(schedule, Math.max(280, 60000 / Math.max(48, heartRateRef.current))); };
    schedule();
    return () => { window.clearTimeout(timer); void context.close(); };
  }, [soundOn, running, mode, scenario]);
  const beat = mode === "safe" ? 900 : 540;
  const ecgPoints = Array.from({ length: 44 }, (_, index) => {
    const x = index * 15.5;
    const phase = (index + Math.floor(vitals.heartRate / 8)) % 11;
    const y = phase === 4 ? 22 : phase === 5 ? 4 : phase === 6 ? 36 : phase === 7 ? 20 : 20 + Math.sin(index * .7) * 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className={`vital-metrics ${mode === "safe" ? "vitals-safe" : "vitals-threat"}`} aria-label="生理狀態的概念動畫">
      <div className="vital-metrics-head"><span className="eyebrow">PHYSIOLOGY / CONCEPT MODEL</span><span className="vital-status"><i />{mode === "safe" ? "恢復中" : "警覺中"}</span></div>
      <div className="ecg-window"><svg viewBox="0 0 682 42" preserveAspectRatio="none" aria-label="心電波形動畫"><polyline points={ecgPoints} /></svg><span className="ecg-scan" style={{ animationDuration: `${beat}ms`, animationPlayState: running ? "running" : "paused" }} /></div>
      <div className="vital-cards"><article><div><span>心率</span><strong>{vitals.heartRate}</strong><small>bpm</small></div><div className="vital-bar"><i style={{ width: `${Math.min(100, (vitals.heartRate - 55) / .72)}%` }} /></div><p>{vitals.heartRate > 90 ? "交感神經動員" : "心率逐步下降"}</p></article><article><div><span>皮質醇</span><strong>{vitals.cortisol}</strong><small>%</small></div><div className="vital-bar cortisol"><i style={{ width: `${vitals.cortisol}%` }} /></div><p>{vitals.cortisol > 55 ? "壓力荷爾蒙升高" : "HPA 軸逐步回落"}</p></article><article><div><span>心率變異</span><strong>{vitals.hrv}</strong><small>ms</small></div><div className="vital-bar hrv"><i style={{ width: `${Math.min(100, vitals.hrv)}%` }} /></div><p>{vitals.hrv > 45 ? "調節彈性增加" : "資源集中於警報"}</p></article></div>
      <small className="vital-note">數值為動畫示意設定，非測量資料，也不預測呼吸後的生理變化。</small>
      <div className="vital-explanation"><strong>{scenario === "deep-breath" ? "深呼吸：替大腦爭取重新評估的時間" : scenario === "sudden-stress" ? "突發壓力：警報優先於複雜思考" : mode === "safe" ? "安全狀態：情境化讓學習資源回來" : "威脅狀態：高喚起讓注意變窄"}</strong><p>皮質醇升高時，海馬迴較難有效提取脈絡與既有記憶；工作記憶也可能被威脅線索佔用，讓理解、提取與新學習變得不穩定。當呼吸、關係與環境提供安全線索，前額葉與海馬迴較有機會重新參與。</p></div>
    </div>
  );
}

function BreathGuide({ running }: { running: boolean }) {
  const phases = [{ label: "吸氣", hint: "慢慢吸入，讓腹部向外擴張", seconds: 4, className: "inhale" }, { label: "停留", hint: "保持柔軟，不需要用力", seconds: 2, className: "hold" }, { label: "吐氣", hint: "比吸氣更慢地吐出", seconds: 6, className: "exhale" }];
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(phases[0].seconds);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setPhaseIndex((index) => (index + 1) % phases.length);
          return phases[(phaseIndex + 1) % phases.length].seconds;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phaseIndex]);
  const phase = phases[phaseIndex];
  return <div className={`breath-guide ${phase.className} ${running ? "is-running" : "is-paused"}`} aria-live="polite"><div className="breath-guide-visual"><div className="breath-orbit orbit-one" /><div className="breath-orbit orbit-two" /><div className="breath-core"><strong>{remaining}</strong><small>秒</small></div></div><div className="breath-guide-copy"><span className="eyebrow">BREATHING RESET</span><h4>跟著圓形節奏，讓警報慢慢退後。</h4><div className="breath-phase"><b>{phase.label}</b><span>{phase.hint}</span></div><div className="breath-sequence"><i className="active" />吸氣 4<i />停留 2<i />吐氣 6</div><small>每一輪約 12 秒；可配合心跳音效，感受節奏逐步變慢。</small></div></div>;
}

function SignalTracker() {
  const [mode, setMode] = useState<BrainState>("threat");
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(true);
  const [scenario, setScenario] = useState<SignalScenario>("baseline");
  const [soundOn, setSoundOn] = useState(false);
  const steps = mechanismSteps[mode === "safe" ? "safe" : "threat"];
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % steps.length), 1600);
    return () => window.clearInterval(timer);
  }, [mode, running, steps.length]);
  return (
    <section className={`signal-tracker reveal ${mode === "safe" ? "tracker-safe" : "tracker-threat"}`} aria-labelledby="signal-tracker-title">
      <div className="signal-tracker-head"><div><span className="eyebrow">NEURAL SIGNAL TRACKER</span><h3 className="serif" id="signal-tracker-title">看見訊號如何改變路徑。</h3><p>切換狀態，觀察同一顆大腦如何把注意與控制資源分配給不同的網絡。</p></div><div className="signal-tracker-controls"><button className={mode === "threat" ? "active threat" : ""} onClick={() => { setMode("threat"); setScenario("baseline"); setStep(0); setRunning(true); }}>威脅路徑</button><button className={mode === "safe" ? "active safe" : ""} onClick={() => { setMode("safe"); setScenario("baseline"); setStep(0); setRunning(true); }}>安全路徑</button><button className="signal-play" onClick={() => setRunning((value) => !value)}>{running ? <Pause size={14} /> : <Play size={14} />}{running ? "暫停" : "播放"}</button></div></div>
      <div className="scenario-strip"><span>互動情境</span><button className={scenario === "deep-breath" ? "active safe" : ""} onClick={() => { setScenario("deep-breath"); setMode("safe"); setStep(0); setRunning(true); setSoundOn(true); }}><Wind size={15} />深呼吸</button><button className={scenario === "sudden-stress" ? "active threat" : ""} onClick={() => { setScenario("sudden-stress"); setMode("threat"); setStep(0); setRunning(true); setSoundOn(true); }}><Zap size={15} />突發壓力</button><button className={soundOn ? "sound-on" : ""} onClick={() => setSoundOn((value) => !value)}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}{soundOn ? "關閉心跳音效" : "開啟心跳音效"}</button></div>
      {scenario === "deep-breath" && <BreathGuide running={running} />}
      <div className="signal-tracker-body">
        <div className="signal-map" aria-label={`${mode === "safe" ? "安全" : "威脅"}神經訊號流動示意`}>
          <svg viewBox="0 0 680 230" aria-hidden="true">
            <defs><filter id="signalGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter><path id="threatRoute" d="M50 150 C145 150 160 52 280 72 S425 168 610 78" /><path id="safeRoute" d="M50 150 C145 150 170 190 285 166 S430 62 610 78" /></defs>
            <path className="signal-route-base" d="M50 150 C145 150 160 52 280 72 S425 168 610 78" /><path className="signal-route-base" d="M50 150 C145 150 170 190 285 166 S430 62 610 78" />
            <path className={`signal-route ${mode === "threat" ? "route-threat" : "route-muted"}`} d="M50 150 C145 150 160 52 280 72 S425 168 610 78" /><path className={`signal-route ${mode === "safe" ? "route-safe" : "route-muted"}`} d="M50 150 C145 150 170 190 285 166 S430 62 610 78" />
            <circle className="signal-map-node node-start" cx="50" cy="150" r="12" /><circle className="signal-map-node node-alert" cx="280" cy="72" r="12" /><circle className="signal-map-node node-context" cx="285" cy="166" r="12" /><circle className="signal-map-node node-end" cx="610" cy="78" r="14" />
            <text x="28" y="190">輸入</text><text x="243" y="39">杏仁核</text><text x="248" y="203">海馬情境化</text><text x="553" y="47">前額葉控制</text>
            {running && mode === "threat" && <circle r="7" className="signal-particle particle-threat"><animateMotion dur="2.4s" repeatCount="indefinite" rotate="auto"><mpath href="#threatRoute" /></animateMotion></circle>}
            {running && mode === "safe" && <circle r="7" className="signal-particle particle-safe"><animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto"><mpath href="#safeRoute" /></animateMotion></circle>}
          </svg>
        </div>
        <VitalMetrics mode={mode} step={step} running={running} scenario={scenario} soundOn={soundOn} />
        <div className="signal-step-list">{steps.map(([number, title, description], index) => <button key={number} className={step === index ? "active" : ""} onClick={() => { setStep(index); setRunning(false); }}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></button>)}</div>
      </div>
      <div className="signal-tracker-foot"><span><i className="tracker-dot" />目前追蹤：{steps[step][1]}</span><small>{mode === "threat" ? "警報優先，路徑快速而窄。" : "情境化與控制重新取得空間。"}</small></div>
    </section>
  );
}

const guideTeam: [string, string][] = [
  ["F114006", "余俊誠"],
  ["F114036", "黃瑞雲"],
  ["F114001", "于立舫"],
  ["F114045", "賴奕芸"],
  ["F114049", "蘇宛菁"],
  ["F114018", "邱雅姿"],
  ["F114010", "沈佳"],
];

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [roadmapPhase, setRoadmapPhase] = useState(0);
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeExample, setActiveExample] = useState(0);
  const [activeBrain, setActiveBrain] = useState<BrainRegionId>("frontal");
  const [compareMode, setCompareMode] = useState(true);
  const [compareLeft, setCompareLeft] = useState<BrainRegionId>("frontal");
  const [compareRight, setCompareRight] = useState<BrainRegionId>("amygdala");
  const [activeSection, setActiveSection] = useState("journey");
  const [brainState, setBrainState] = useState<BrainState>("baseline");
  const [brainAuto, setBrainAuto] = useState(false);
  const [pathStep, setPathStep] = useState(0);
  const [phase, setPhase] = useState<PhaseId>("all");
  const [activeChapter, setActiveChapter] = useState(chapters[0]);
  const [activeConceptCard, setActiveConceptCard] = useState(0);
  const [quizFilter, setQuizFilter] = useState<QuizFilter>("全部");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [brainLabActive, setBrainLabActive] = useState<BrainRegionId>("frontal");
  const [returnConceptCard, setReturnConceptCard] = useState(0);
  const [regionScenario, setRegionScenario] = useState<"resting" | "activated">("resting");
  const [examJumpRegion, setExamJumpRegion] = useState<QuizFilter | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.1 });
    document.querySelectorAll(".reveal, .stagger").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = chapterLinks.map(([id]) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    let frame = 0;
    const update = () => {
      frame = 0;
      const reached = sections.filter(el => el.getBoundingClientRect().top <= 180);
      setActiveSection((reached[reached.length - 1] ?? sections[0]).id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  useEffect(() => {
    const track = document.querySelector<HTMLElement>(".chapter-dock-track");
    const link = track?.querySelector<HTMLElement>(`a[href="#${activeSection}"]`);
    if (!track || !link || track.scrollWidth <= track.clientWidth) return;
    track.scrollTo({ left: link.offsetLeft - (track.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [activeSection]);

  useEffect(() => {
    if (!brainAuto) return;
    const timer = window.setInterval(() => {
      setActiveBrain((current) => brainRegions[(brainRegions.findIndex((region) => region.id === current) + 1) % brainRegions.length].id);
      setBrainState("baseline");
    }, 2100);
    return () => window.clearInterval(timer);
  }, [brainAuto]);

  const region = brainRegions.find((item) => item.id === activeBrain) ?? brainRegions[0];
  const leftRegion = brainRegions.find((item) => item.id === compareLeft) ?? brainRegions[0];
  const rightRegion = brainRegions.find((item) => item.id === compareRight) ?? brainRegions[1];
  const currentRoadmap = videoLogicPhases[roadmapPhase];
  const filteredChapters = useMemo(() => phase === "all" ? chapters : chapters.filter((chapter) => chapter.phase === phase), [phase]);
  const filteredQuestions = useMemo(() => quizFilter === "全部" ? neuroMechanismQuestions : neuroMechanismQuestions.filter((question) => question.region === quizFilter), [quizFilter]);
  const currentQuestion = filteredQuestions[quizIndex % filteredQuestions.length];

  function resetQuiz(filter: QuizFilter) {
    setQuizFilter(filter);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowAnalysis(false);
  }

  function jumpToRegionQuestions(regionId: BrainRegionId) {
    const filter = brainToQuizFilter[regionId];
    if (!filter) return;
    setActiveBrain(regionId);
    setBrainLabActive(regionId);
    setBrainState("baseline");
    setBrainAuto(false);
    setQuizFilter(filter);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowAnalysis(false);
    setExamJumpRegion(filter);
    window.setTimeout(() => {
      (document.activeElement as HTMLElement | null)?.blur();
      window.history.replaceState(null, "", "#exam");
      scrollToId("exam");
    }, 180);
  }

  function nextQuestion() {
    setQuizIndex((index) => (index + 1) % filteredQuestions.length);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowAnalysis(false);
  }

  return (
    <div className="site-shell">
      <header className={`top-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container-wide nav-inner">
          <a className="brand-mark" href="#top" aria-label="回到首頁"><span className="brand-dot" /><span className="brand-book">《Rewire－神經可塑性》</span><span className="brand-tag">專書導讀</span></a>
          <nav className="nav-links" aria-label="快速導覽">
            <a href="#intro">開始閱讀</a><a href="#reference" onClick={event=>{event.preventDefault();openReference("reference")}}>搜尋與延伸</a>
            <a className="nav-pill" href="#exam">教檢連結</a>
          </nav>
        </div>
      </header>
      <nav className={`chapter-dock ${scrolled ? "scrolled" : ""}`} aria-label="章節目錄">
        <div className="chapter-dock-track">{chapterLinks.map(([id, number, label]) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}><span>{number}</span><strong>{label}</strong></a>)}</div>
      </nav>

      <main id="top">
        <section className="hero bright-hero" aria-labelledby="hero-title">
          <div className="hero-soft-shape shape-a"/><div className="hero-soft-shape shape-b"/>
          <div className="container-wide hero-story-layout">
            <div className="hero-copy">
              <div className="eyebrow hero-kicker"><span/>一段重新選擇的旅程</div>
              <h1 className="hero-title" id="hero-title"><small>REWIRE</small>神經可塑性<br/><em>看見大腦，<br/>也看見改變的可能。</em></h1>
              <p className="hero-lede">用神經科學突破行為模式迴圈，終結焦慮、恐慌和憂鬱，實現最佳的心理健康。</p>
              <p className="hero-core">看見舊反應 → 練習新選擇 → 讓改變走進日常</p>
              <div className="hero-actions"><button className="btn btn-primary" onClick={()=>scrollToId("intro")}><BookOpen size={18}/>開始閱讀<ArrowRight size={17}/></button></div>
              <div className="hero-meta"><div className="meta-item"><strong>Nicole Vignola</strong>作者</div><div className="meta-item"><strong>梁永安</strong>譯者</div></div>
              <div className="hero-team" aria-label="導讀小組成員"><span className="hero-team-label">導讀小組</span><ul>{guideTeam.map(([id, name]) => <li key={id}><b>{name}</b><small>{id}</small></li>)}</ul></div>
            </div>
            <div className="hero-book-world" aria-label="Rewire 書籍導讀視覺">
              <div className="book-world-ring ring-a"/><div className="book-world-ring ring-b"/>
              <span className="world-ball ball-coral"/><span className="world-ball ball-gold"/><span className="world-ball ball-teal"/>
              <div className="guide-book"><div className="guide-book-spine">REWIRE · Nicole Vignola</div><img src={coverImage} alt="《Rewire－神經可塑性》繁體中文版封面"/></div>
              <div className="world-note note-neuron"><Network size={19}/><div><b>注意 × 重複 × 經驗</b><small>新的反應，可以被練習。</small></div></div>
              <span className="world-tag">YOUR BRAIN CAN CHANGE ↗</span>
              <figure className="world-qr"><img src="site-qr.svg" alt="本網站網址 QR code" width="104" height="104" /><figcaption><b>掃描帶走導讀</b><small>手機開啟本網站</small></figcaption></figure>
            </div>
          </div>
          <div className="container-wide hero-phase-strip"><a href="#stage1"><span>01</span><div><strong>擺脫負面情緒</strong><small>Ditch the Negative</small></div><ArrowRight size={19}/></a><a href="#stage2"><span>02</span><div><strong>改變你的敘事</strong><small>Shift Your Narrative</small></div><ArrowRight size={19}/></a><a href="#stage3"><span>03</span><div><strong>增強積極性</strong><small>Boost the Positive</small></div><ArrowRight size={19}/></a></div>
        </section>
        <section className="section book-route" id="journey" aria-labelledby="book-route-title"><div className="container-wide"><span className="section-label">全書地圖</span><h2 className="section-title" id="book-route-title">從看見舊模式，到練習新的自己。</h2><p className="section-intro">先理解大腦，再鬆動舊循環、改變敘事，最後支持新的生活方式。</p><ol className="original-book-map" aria-label="全書地圖">{[["intro","導言","Introduction","理解改變的基礎"],["stage1","擺脫負面情緒","Ditch the Negative","辨識舊循環"],["stage2","改變你的敘事","Shift Your Narrative","練習新的反應"],["stage3","增強積極性","Boost the Positive","支援持久改變"],["outro","尾聲","Epilogue","把理解帶回日常"]].map(([id,title,en,note],i)=><li key={id}><a href={`#${id}`}><span>{i===0?"導言":i===4?"尾聲":`階段 ${i}`}</span><strong>{title}</strong><small>{en}</small><p>{note}</p><ArrowRight size={18} aria-hidden="true"/></a></li>)}</ol><div className="book-core" aria-label="全書核心"><article><span>核心提問</span><p>我們的習慣和行為，是自己選的，還是環境無意中給的？作者的答案是：兩者兼有。</p></article><article><span>核心機制</span><p>一起放電的神經元會彼此連結。重複的想法會走成自動反應；不再使用的路徑，也會慢慢變弱。</p></article><article><span>核心方法</span><p>重複＋注意力＋刻意＝持久的改變。先看見舊循環，再練習新反應，最後用身體、睡眠與自我信賴讓改變站穩。</p></article></div><SourceLegend /></div></section>
        <BookWalkthrough />
        <section className="section exam-section walk-phase" id="exam" aria-labelledby="exam-title">
          <div className="container-wide">
            <header className="walk-phase-heading exam-heading"><div><span className="walk-label">教檢連結<small>For Teacher Exams</small></span><h2 id="exam-title">把書中的大腦，接回教師資格考。</h2></div><p>讀完全書後，用兩種方式複習：先做歷屆試題中的腦區題，再用深度問答把書中概念連到教育心理學。題目只收錄能核對題本與答案的試題。</p></header>
            <div className="exam-part-head"><span className="exam-part-label">第一部分</span><h3>歷屆試題：腦區與學習</h3><p>沿著四站作答：先定位腦區，再讀題、核對解答，最後回到書中章節。</p></div>
            <div className="exam-source reveal"><div><ShieldCheck size={18} /><p><strong>延伸閱讀</strong>：教育部教師資格考試歷屆試題。</p></div><a href={officialExamSourceUrl} target="_blank" rel="noreferrer">查看歷屆試題 <ExternalLink size={14} /></a></div>
            <div className="coverage-strip reveal" aria-label="各年度腦區題主題">{examCoverage.map((record) => <article key={record.year} className={record.count === 0 ? "empty" : record.year === 2018 ? "sample" : ""}><strong>{rocYear(record.year)}</strong><small>{record.note}</small></article>)}</div>
            {examJumpRegion && <div className="exam-jump-banner reveal"><Brain size={18} /><p><strong>{examJumpRegion}</strong>相關題目已載入。作答後會依序顯示解答與書中概念。</p><button type="button" onClick={() => setExamJumpRegion(null)}>知道了</button></div>}
            <div className="quiz-filter reveal"><span>依神經主題篩選</span>{quizFilters.map((filter) => <button key={filter} className={quizFilter === filter ? "active" : ""} disabled={filter !== "全部" && !neuroMechanismQuestions.some((question) => question.region === filter)} onClick={() => resetQuiz(filter)}>{filter}</button>)}</div>
            {currentQuestion && <ol className="exam-path" aria-label="作答路徑">{["腦區", "考題", "解答", "書中概念"].map((label, index) => { const stage = submitted ? 3 : selectedAnswer === null ? 1 : 2; const state = index < stage ? "done" : index === stage ? "current" : ""; return <li key={label} className={state} aria-current={index === stage ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{label}</li>; })}</ol>}
            {currentQuestion && <div className="exam-region-station"><span>01 腦區</span><strong>{currentQuestion.region}</strong><p>{neuroRegionNotes[currentQuestion.region]}</p></div>}
            {currentQuestion ? <div className="quiz-layout">
              <article className="quiz-card reveal">
                <div className="quiz-meta"><span>02 考題 · {rocYear(currentQuestion.year)}教檢 · {currentQuestion.subject} · 第 {currentQuestion.number} 題</span><b>{currentQuestion.region}</b></div>
                <h3 className="serif">{currentQuestion.stem}</h3>
                <div className="quiz-options">{currentQuestion.options.map((option, index) => { const correct = submitted && index === currentQuestion.answer; const wrong = submitted && selectedAnswer === index && index !== currentQuestion.answer; return <button key={option} className={`${selectedAnswer === index ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => !submitted && setSelectedAnswer(index)}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p>{correct && <Check size={16} />}</button>; })}</div>
                <div className="quiz-actions"><p className={submitted ? selectedAnswer === currentQuestion.answer ? "good" : "needs" : ""}>{submitted ? selectedAnswer === currentQuestion.answer ? "答對了：腦區與功能配對正確。" : `正解為 ${String.fromCharCode(65 + currentQuestion.answer)}，請看解答與書中概念。` : selectedAnswer === null ? "先選一個答案。" : "已選取，可以核對答案。"}</p>{submitted ? <button className="btn btn-primary" onClick={nextQuestion}>下一題 <ArrowRight size={15} /></button> : <button className="btn btn-primary" disabled={selectedAnswer === null} onClick={() => setSubmitted(true)}>核對答案 <Check size={15} /></button>}</div>
              </article>
              <aside className={`analysis-card reveal ${submitted ? "visible" : ""}`}>
                <div className="eyebrow">03 解答 · 04 書中概念</div>
                <h3 className="serif">{submitted ? currentQuestion.concept : "作答後展開機制解析"}</h3>
                {submitted ? <><div><b>03 解答</b><p>{currentQuestion.explanation}</p></div><div><b>腦區／路徑</b><p>{currentQuestion.neuroMechanism}</p></div><div className="book-station"><b>04 書中概念</b><p>{withoutPageReference(currentQuestion.bookConnection)}</p>{neuroQuestionChapters[currentQuestion.id] && <a className="book-station-link" href={`#chapter-${neuroQuestionChapters[currentQuestion.id].id}`}>回到 {neuroQuestionChapters[currentQuestion.id].label} <ArrowRight size={15} /></a>}</div><div className="source-links"><a href={currentQuestion.source} target="_blank" rel="noreferrer">查看題本 <ExternalLink size={14} /></a><a href={currentQuestion.answerSource} target="_blank" rel="noreferrer">核對答案 <ExternalLink size={14} /></a></div><button className="analysis-toggle" onClick={() => setShowAnalysis((value) => !value)}><Sparkles size={15} />{showAnalysis ? "收起選項分析" : "為什麼其他選項不對？"}</button>{showAnalysis && <div className="ai-analysis"><strong>為什麼其他選項不成立？</strong><p>{currentQuestion.distractorAnalysis}</p></div>}</> : <div className="analysis-placeholder"><Brain size={42} /><p>這裡會依正解顯示額葉、海馬迴、杏仁核或相關神經路徑，並連回書中的觀點與案例。</p></div>}
              </aside>
            </div> : <div className="empty-quiz"><Brain size={34} /><h3>這個分類目前沒有題目</h3><p>切換到「全部」或其他分類繼續練習。</p></div>}
            <ExamDeepQAPanel />
          </div>
        </section>
        <details className="book-reference" id="reference"><summary><span>延伸資料</span><strong>概念、案例、工具與練習</strong><small>需要時展開查閱</small></summary><div className="book-reference-body">


        <section className="section logic-journey-section" id="topic-map" aria-labelledby="topic-map-title">
          <div className="container-wide">
            <div className="logic-journey-intro reveal"><div><div className="section-label eyebrow">02 / 全書的閱讀路線</div><h2 className="section-title serif" id="topic-map-title">先問一個生活問題，<br /><span>再讓大腦科學回答。</span></h2></div><p className="section-intro">從熟悉的壓力、習慣與情緒反應出發，逐步看見大腦如何形成預測，又如何透過新的經驗改變。</p></div>
<div className="logic-journey-layout">
              <div className="logic-phase-list" role="tablist" aria-label="四個導讀角度">{videoLogicPhases.map((item, index) => <button key={item.label} role="tab" aria-selected={roadmapPhase === index} className={roadmapPhase === index ? "active" : ""} onClick={() => setRoadmapPhase(index)}><span>{item.label}</span><strong>{item.title}</strong><ChevronRight size={16} /></button>)}</div>
              <article className="logic-phase-card reveal"><div className="logic-phase-mark"><Brain size={20} /><span>{currentRoadmap.label}</span></div><h3 className="serif">{currentRoadmap.hook}</h3><p>{currentRoadmap.text}</p>{roadmapPhase === 1 || roadmapPhase === 2 ? <BiasRuminationVisual /> : null}<div className="logic-case-grid">{currentRoadmap.cards.map((card, index) => <div key={card}><span>0{index + 1}</span><strong>{card}</strong></div>)}</div><div className="logic-formula"><span>重複</span><b>＋</b><span>注意力</span><b>＋</b><span>刻意</span><b>＝</b><strong>可持續的改變</strong></div></article>
            </div>
            <div className="concept-chapter-summary reveal">
              <div className="concept-summary-heading"><div><span className="eyebrow">CHAPTER SNAPSHOT</span><h3 className="serif">三階段與身體支持，看見改變路徑。</h3></div><p>點選階段，快速掌握對應章節的核心問題，再進入「逐章閱讀」深入閱讀。</p></div>
              <div className="concept-summary-grid">{conceptChapterCards.map((card, index) => <div key={card.title} className={`concept-summary-card ${card.accent} ${activeConceptCard === index ? "active" : ""}`} role="button" tabIndex={0} onClick={() => setActiveConceptCard(index)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setActiveConceptCard(index); } }}><span className="concept-card-index">0{index + 1}</span><span className="concept-card-icon-wrap"><button type="button" className={`concept-card-icon ${card.pulseClass}`} title={`${card.brainRegion}：${card.brainDescription}`} aria-label={`查看${card.brainRegion}的詳細神經機制`} onClick={(event) => { event.stopPropagation(); setActiveConceptCard(index); setReturnConceptCard(index); setActiveBrain(card.brainTarget as BrainRegionId); setBrainLabActive(card.brainTarget as BrainRegionId); setRegionScenario("resting"); scrollToId("brain"); }}><span className="concept-card-symbol">{card.icon}</span><span className="concept-neural-flow" aria-hidden="true"><i /><i /><i /></span></button><span className="concept-card-tooltip" role="tooltip"><strong>{card.brainRegion}</strong><span>{card.brainDescription}</span></span></span><span className="concept-card-icon-label">{card.iconLabel}</span><span className="eyebrow">{card.phase}</span><strong>{card.title}</strong><p>{card.summary}</p><span className="concept-card-chapters">{card.chapters.map((chapter) => chapter.number).join(" · ")} <ChevronRight size={15} /></span></div>)}</div>
              <div className="concept-summary-detail" key={activeConceptCard}><div><div className="concept-detail-icon" aria-hidden="true">{conceptChapterCards[activeConceptCard].icon}</div><span className="eyebrow">{conceptChapterCards[activeConceptCard].phase}</span><h4 className="serif">{conceptChapterCards[activeConceptCard].title}</h4><p>{conceptChapterCards[activeConceptCard].summary}</p></div><div className="concept-detail-chapters"><span>對應章節</span>{conceptChapterCards[activeConceptCard].chapters.map((chapter) => <button key={chapter.id} onClick={() => { setActiveChapter(chapter); scrollToId("chapters"); }}><strong>{chapter.number} {chapter.title}</strong><small>{chapter.thesis}</small><ChevronRight size={15} /></button>)}</div></div>
            </div>
          </div>
        </section>

        <section className="section book-section" id="book">
          <div className="container-wide book-layout">
            <div className="reveal">
              <div className="section-label eyebrow">書籍與作者</div>
              <h2 className="section-title serif">「我們的習慣和行為，<br />是自己選擇，還是透過環境無意中獲得？」</h2>
              <p className="section-intro">作者 Nicole Vignola 以神經科學與組織心理學背景，把行為改變拆成三層：先看見壓力與負面迴路，再以重複和新經驗重寫預測，最後用睡眠、運動與環境支撐新路徑。</p>
              <div className="author-facts">
                <div><span>作者</span><strong>妮可・維諾拉</strong><small>Nicole Vignola</small></div>
                <div><span>英文版出版</span><strong>2024</strong><small>Michael Joseph / Penguin</small></div>
                <div><span>中文版譯者</span><strong>梁永安</strong><small>繁體中文版</small></div>
              </div>
              <div className="precision-note"><Microscope size={18} /><p><strong>讀懂大腦</strong>：腦區各有主要功能，但記憶、情緒與控制都來自多個網絡的協作。</p></div>
            </div>
            <div className="book-visual reveal">
              <div className="cover-halo" /><img className="book-cover" src={coverImage} alt="《Rewire－神經可塑性》繁體中文版封面" />
              <div className="book-spine-note"><span className="eyebrow">書中核心提問</span><strong className="serif">「我們的習慣和行為，是自己選擇，還是透過環境無意中獲得？」</strong><small>《Rewire》導言</small></div>
            </div>
          </div>
        </section>

        <section className="section evidence-section" id="evidence">
          <div className="container-wide">
              <div className="section-heading-row reveal">
              <div><div className="section-label eyebrow">03 / 書中證據與案例</div><h2 className="section-title serif">「但大腦是可塑的，<br /><span>這種情形是可以改變的。」</span></h2><p className="section-intro">每則引文都回到書中的脈絡，並連結相關神經機制，讓金句不只是被引用，而是被理解。</p></div>
              <div className="quote-index"><strong>{String(activeQuote + 1).padStart(2, "0")}</strong><span>/ {String(bookQuotes.length).padStart(2, "0")}</span></div>
            </div>
            <div className="quote-stage reveal">
              <Quote size={34} />
              <blockquote className="serif">{bookQuotes[activeQuote].text}</blockquote>
              <p>{bookQuotes[activeQuote].context}</p>
              <div className="quote-footer"><span>《Rewire》書中重點金句</span><div>{bookQuotes.map((quote, index) => <button key={quote.text} aria-label={`查看引文 ${index + 1}`} className={activeQuote === index ? "active" : ""} onClick={() => setActiveQuote(index)} />)}</div></div>
            </div>

            <div className="example-heading reveal"><div><span className="eyebrow">BOOK SCENES &amp; MECHANISMS</span><h3 className="serif">書中的例子，不只是故事。</h3></div><p>點選一個案例，查看情境、腦機制與作者想推進的論點。</p></div>
            <div className="example-explorer">
              <div className="example-rail reveal">{bookExamples.map((example, index) => <button key={example.id} className={activeExample === index ? "active" : ""} onClick={() => setActiveExample(index)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{example.title}</strong><small>{example.label}</small></div><ChevronRight size={16} /></button>)}</div>
              <article className="example-card reveal">
                <div className="example-meta"><span>{bookExamples[activeExample].label}</span><b>書中案例</b></div>
                <h3 className="serif">{bookExamples[activeExample].title}</h3>
                <div className="evidence-block"><span>書中情境</span><p>{bookExamples[activeExample].scene}</p></div>
                <div className="evidence-block mechanism"><span>神經機制</span><p>{bookExamples[activeExample].mechanism}</p></div>
                <div className="evidence-block insight"><span>閱讀重點</span><p>{bookExamples[activeExample].insight}</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="section brain-section" id="brain">
          <div className="brain-noise" />
          <div className="container-wide">
            <div className="reveal"><div className="section-label eyebrow">04 / 腦區與網絡</div><h2 className="section-title serif">「一起放電的神經元，<br /><span>會彼此連結。」</span></h2><p className="section-intro">感覺、記憶、情緒與控制並非一組彼此獨立的按鈕，而是皮質、深部結構、腦幹與全腦網絡持續協作的結果。</p></div>
            <div className="foundation-grid stagger">{foundations.map((item) => <article key={item.title}><div className="foundation-icon"><Brain size={18} /><span>{item.icon}</span></div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>

            <TermLibrary />
            <div className="lobe-atlas reveal"><div className="lobe-copy"><span className="eyebrow">MACRO ANATOMY</span><h3 className="serif">六個入口，建立大腦基本地圖。</h3><p>腦葉名稱描述位置與主要功能傾向，不代表功能只存在那裡。閱讀任何「某腦區負責某能力」的句子，都應補上：它需要與哪些區域一起工作？</p><BrainConstellation /></div><div className="lobe-grid">{lobes.map((lobe) => <article key={lobe.name}><strong>{lobe.name}</strong><p>{lobe.role}</p><small>{lobe.note}</small></article>)}</div></div>

            <Brain3DModel active={brainLabActive} state={brainState} onSelect={(id) => { setBrainLabActive(id); setActiveBrain(id); setBrainState("baseline"); setBrainAuto(false); }} />

            <div className="brain-atlas-layout">
              <div className={`atlas-panel reveal state-${brainState}`}>
                <div className="atlas-panel-head"><div><span className="eyebrow">INTERACTIVE SYSTEM MAP</span><h3 className="serif">{brainState === "threat" ? "威脅升高：警報與生存反應取得優先。" : brainState === "safe" ? "安全線索：情境辨識與高階控制重新加入。" : "選一個節點，查看它如何參與行為。"}</h3></div><button className={`atlas-play ${brainAuto ? "playing" : ""}`} onClick={() => setBrainAuto((value) => !value)}>{brainAuto ? <Pause size={15} /> : <Play size={15} />}{brainAuto ? "暫停巡覽" : "自動巡覽"}</button></div>
                <div className="state-switch"><span><Activity size={14} />生理狀態</span><button className={brainState === "threat" ? "active threat" : ""} onClick={() => { setBrainState("threat"); setBrainAuto(false); }}>威脅升高</button><button className={brainState === "safe" ? "active safe" : ""} onClick={() => { setBrainState("safe"); setBrainAuto(false); }}>安全線索</button><button className={brainState === "baseline" ? "active" : ""} onClick={() => setBrainState("baseline")}>回到基準</button></div>
                <div className="atlas-scanline" aria-hidden="true" />
                <BrainAtlas active={activeBrain} state={brainState} onSelect={jumpToRegionQuestions} />
                <div className="atlas-disclaimer"><Network size={15} /><span>腦區位置與路徑顯示它們如何透過網絡共同參與行為。</span></div>
              </div>
              <div className="region-panel reveal">
                <div className="region-tabs">{brainRegions.map((item) => <button key={item.id} className={activeBrain === item.id ? "active" : ""} onClick={() => { setActiveBrain(item.id); setBrainLabActive(item.id); setBrainState("baseline"); setBrainAuto(false); playBrainTone(item.id); }}><span style={{ background: item.color }} /><div><strong>{item.label}</strong><small>{item.english}</small></div></button>)}</div>
                <article className="region-detail">
                  <div className="region-detail-actions"><button type="button" className="return-summary-button" onClick={() => { setActiveConceptCard(returnConceptCard); scrollToId("topic-map"); }}>← 返回摘要卡片</button><button type="button" className="region-exam-link" onClick={() => jumpToRegionQuestions(region.id)}>查看相關教檢題目 <ArrowRight size={15} /></button></div>
                  <div className="region-title"><div style={{ background: region.color }}><Brain size={22} /></div><div><span className="eyebrow">{region.english}</span><h3 className="serif">{region.label}</h3></div></div>
                  <dl><div><dt>主要角色</dt><dd>{region.role}</dd></div><div><dt>大致位置</dt><dd>{region.location}</dd></div><div><dt>高壓時</dt><dd>{region.underStress}</dd></div></dl>
                  <div className={`everyday-neuro-example ${regionScenario === "activated" ? "is-activated" : ""}`}>
                    <div className="everyday-neuro-head"><div><span className="eyebrow">生活情境</span><p>{region.everydayExample}</p></div><button type="button" className="neuro-scenario-trigger" onClick={() => { setRegionScenario((value) => value === "activated" ? "resting" : "activated"); setBrainState(region.id === "amygdala" ? "threat" : "safe"); setBrainAuto(false); }}>{regionScenario === "activated" ? "回到平穩" : "觸發神經反應"} <Zap size={14} /></button></div>
                    <div className="neuro-reaction-visual" aria-live="polite"><svg viewBox="0 0 520 92" role="img" aria-label={`${region.label}生活情境神經反應動畫`}><defs><path id="neuroReactionPath" d="M26 46 C112 46 120 18 204 46 S315 75 494 46" /></defs><path className="neuro-reaction-base" d="M26 46 C112 46 120 18 204 46 S315 75 494 46" /><path className="neuro-reaction-active" d="M26 46 C112 46 120 18 204 46 S315 75 494 46" /><circle className="neuro-reaction-node node-a" cx="26" cy="46" r="9" /><circle className="neuro-reaction-node node-b" cx="204" cy="46" r="11" /><circle className="neuro-reaction-node node-c" cx="494" cy="46" r="10" />{regionScenario === "activated" && <circle className="neuro-reaction-particle" r="6"><animateMotion dur="1.8s" repeatCount="indefinite" rotate="auto"><mpath href="#neuroReactionPath" /></animateMotion></circle>}</svg><div className="neuro-reaction-labels"><span>生活線索</span><strong>{regionScenario === "activated" ? "神經反應已啟動" : "等待情境輸入"}</strong><span>行動選擇</span></div></div>
                  </div>
                  <div className="book-evidence"><BookOpen size={16} /><p><strong>書中依據</strong>{region.bookEvidence}</p></div>
                  <div className="education-link"><Lightbulb size={16} /><p><strong>教育連結</strong>{region.education}</p></div>
                </article>
              </div>
            </div>

            <SignalTracker />

            <section className={`comparison-lab reveal ${compareMode ? "open" : ""}`} aria-labelledby="comparison-title">
              <div className="comparison-head">
                <div><span className="eyebrow">BRAIN REGION COMPARISON</span><h3 className="serif" id="comparison-title">腦區並排比較</h3><p>把兩個腦區放在同一組維度中對照，避免只記住單一功能標籤。</p></div>
                <button className="compare-toggle" onClick={() => setCompareMode((value) => !value)}><Columns2 size={18} />{compareMode ? "收起比較" : "開啟比較"}</button>
              </div>
              {compareMode && <>
                <div className="comparison-selectors">
                  <label><span>左側腦區</span><select value={compareLeft} onChange={(event) => setCompareLeft(event.target.value as BrainRegionId)}>{brainRegions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                  <button className="swap-regions" aria-label="交換左右腦區" onClick={() => { setCompareLeft(compareRight); setCompareRight(compareLeft); }}><ArrowLeftRight size={19} /></button>
                  <label><span>右側腦區</span><select value={compareRight} onChange={(event) => setCompareRight(event.target.value as BrainRegionId)}>{brainRegions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
                </div>
                <div className="comparison-table" role="table" aria-label={`${leftRegion.label}與${rightRegion.label}比較`}>
                  <div className="comparison-row comparison-title-row" role="row"><div role="columnheader">比較維度</div><div role="columnheader"><i style={{ background: leftRegion.color }} />{leftRegion.label}</div><div role="columnheader"><i style={{ background: rightRegion.color }} />{rightRegion.label}</div></div>
                  {[
                    ["主要角色", leftRegion.role, rightRegion.role],
                    ["大致位置", leftRegion.location, rightRegion.location],
                    ["高壓時", leftRegion.underStress, rightRegion.underStress],
                    ["書中說明", leftRegion.bookEvidence, rightRegion.bookEvidence],
                    ["教育連結", leftRegion.education, rightRegion.education],
                  ].map(([label, left, right]) => <div className="comparison-row" role="row" key={label}><strong role="rowheader">{label}</strong><p role="cell">{left}</p><p role="cell">{right}</p></div>)}
                </div>
                <div className="comparison-summary"><Network size={20} /><p><strong>閱讀提醒：</strong>比較的目的不是把功能切成互不相干的格子，而是看見不同結構如何在記憶、情緒、注意與控制中彼此協作。</p></div>
              </>}
            </section>

            <div className="state-mechanism reveal">
              <div className="state-mechanism-head"><div><span className="eyebrow">FROM SIGNAL TO STATE</span><h3 className="serif">同一顆大腦，在不同狀態下會分配不同資源。</h3></div><div><button className={brainState !== "safe" ? "active" : ""} onClick={() => setBrainState("threat")}>威脅路徑</button><button className={brainState === "safe" ? "active" : ""} onClick={() => setBrainState("safe")}>恢復路徑</button></div></div>
              <div className="mechanism-chain">{(brainState === "safe" ? mechanismSteps.safe : mechanismSteps.threat).map(([number, title, text]) => <article key={number}><span>{number}</span><h4>{title}</h4><p>{text}</p></article>)}</div>
              <p className="mechanism-source">威脅狀態讓警報與生理動員取得優先；安全狀態則讓情境辨識、記憶提取與高階控制重新取得空間。</p>
            </div>
          </div>
        </section>

        <section className="section plasticity-section" id="plasticity">
          <div className="container-wide plasticity-layout">
            <div className="reveal"><div className="section-label eyebrow">延伸觀察 / 神經可塑性</div><h2 className="section-title serif">「一個訊息重複得愈多，<br /><span>傳達的路徑就會愈強。」</span></h2><p className="section-intro">書中以「羊腸小徑 → 土路 → 柏油大道」比喻反覆啟動的路徑。這個比喻的重點不是腦內真的長出道路，而是同一組神經活動反覆出現後，訊號傳遞與行為選擇會變得更有效率。</p><div className="plasticity-quote"><Quote size={20} /><p className="serif">「一起放電的神經元會彼此連結。」</p></div></div>
            <div className="path-card reveal"><span className="eyebrow">PATHWAY MODEL / CONCEPTUAL</span><h3 className="serif">重複不是複製；每一次都在改變下一次的門檻。</h3><NeuralPath step={pathStep} /><div className="path-controls"><div>{[0,1,2,3].map((step) => <i key={step} className={pathStep >= step ? "active" : ""} />)}</div><button className="btn btn-primary" onClick={() => setPathStep((step) => step === 3 ? 0 : step + 1)}><Zap size={15} />{pathStep === 3 ? "重新觀察" : "加入一次經驗"}</button></div></div>
          </div>
          <div className="container-wide plasticity-principles stagger"><article><strong>長期增強</strong><p>共同啟動與有意義的重複，會提高之後再次啟動的效率。</p></article><article><strong>連結減弱</strong><p>舊反應不再被持續配對，連結可逐漸失去優勢；這通常需要時間與替代反應。</p></article><article><strong>經驗依賴</strong><p>新奇、重要、具回饋的經驗會提供預測誤差，促使大腦更新記憶與策略。</p></article><article><strong>生理底座</strong><p>睡眠、運動、壓力與注意資源會影響新連結是否有機會被穩定使用。</p></article></div>
        </section>

        <section className="section chapters-section" id="chapters">
          <div className="container-wide">
            <div className="reveal"><div className="section-label eyebrow">05 / 主題深讀</div><h2 className="section-title serif">「無論重複什麼想法和反應，<br /><span>都會加強你腦中的路徑。」</span></h2><p className="section-intro">先理解負面迴路與壓力，再重寫潛意識預測，最後以韌性、心態、睡眠與運動維持新路徑。可以從這裡延伸查看書中例子、機制、短引文與教育連結。</p></div>
            <div className="chapter-filter reveal">{(Object.keys(phaseLabels) as PhaseId[]).map((id) => <button key={id} className={phase === id ? "active" : ""} onClick={() => setPhase(id)}>{phaseLabels[id]}</button>)}</div>
            <div className="chapter-atlas">
              <div className="chapter-list reveal">{filteredChapters.map((chapter) => <button key={chapter.id} className={activeChapter.id === chapter.id ? "active" : ""} onClick={() => setActiveChapter(chapter)}><span>{chapter.number}</span><div><strong>{chapter.title}</strong><small>{chapter.english}</small></div><ChevronRight size={16} /></button>)}</div>
              <article className="chapter-detail reveal">
                <div className="chapter-detail-top"><span>{activeChapter.number}</span><div><small>{activeChapter.english}</small><h3 className="serif">{activeChapter.title}</h3></div></div>
                <p className="chapter-thesis">{activeChapter.thesis}</p>
                <div className="chapter-detail-grid"><div><b>章節論證</b><p>{activeChapter.explanation}</p></div><div><b>書中例子</b><p>{activeChapter.example}</p></div><div><b>神經機制</b><p>{activeChapter.mechanism}</p></div><div><b>教育連結</b><p>{activeChapter.education}</p></div></div>
                <blockquote className="serif">{activeChapter.evidence}</blockquote>
                <div className="keyword-row">{activeChapter.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
              </article>
            </div>
          </div>
        </section>

        <TeachingGuide />

        <section className="section tools-section" id="tools">
          <div className="container-wide"><div className="reveal"><div className="section-label eyebrow">07 / 把練習帶回日常</div><h2 className="section-title serif">「戰略性休息，<br /><span>可以提高我們的注意力。」</span></h2><p className="section-intro">這些日常練習不是治癒承諾，而是用來降低自動反應、恢復注意與增加替代行動的小型介入。</p></div><PracticeTools /></div>
        </section>

        <section className="section education-section" id="education">
          <div className="container-wide education-layout">
            <div className="reveal"><div className="section-label eyebrow">延伸閱讀 / 教育連結</div><h2 className="section-title serif">「我希望你撕掉<br /><span>別人給你貼的標籤。」</span></h2><p className="section-intro">從《Rewire》回看教育概論，關鍵不是把每個行為都解釋成某個腦區，而是理解注意、情境記憶、壓力調節、回饋與練習如何共同改變學習機率。</p></div>
            <div className="education-cards stagger"><article><span>01</span><h3>從標籤轉向可觀察證據</h3><p>「不專心」「不努力」「不擅長數學」都容易成為固定敘事。改用行為、策略與情境描述，才能找到可調整的節點。</p></article><article><span>02</span><h3>先調節，再要求高階控制</h3><p>工作記憶、抑制與後設認知在威脅升高時較難維持。清楚結構與心理安全不是降低標準，而是保留學習入口。</p></article><article><span>03</span><h3>用提取與回饋形成新路徑</h3><p>學生需要在不同時間、不同情境重新提取，並取得具體回饋；熟悉感不能取代真正的可提取能力。</p></article><article><span>04</span><h3>把身體狀態放回學習設計</h3><p>睡眠、活動、壓力與環境刺激會改變注意和記憶條件，不能把所有表現差異簡化成意志力。</p></article></div>
          </div>
        </section>

        </div></details>
      </main>

      <footer className="footer"><div className="container-wide"><div className="footer-grid"><div><div className="eyebrow">《REWIRE》書中重點金句</div><h2 className="serif">「勇於創造<br /><em>你自己吧。」</em></h2></div><p>從書中的案例出發，理解壓力、記憶、情緒與習慣如何在大腦網絡中彼此影響，也看見改變如何從一次新的經驗開始。</p></div><div className="footer-bottom"><span>《Rewire－神經可塑性》互動深度閱讀</span><span>Book evidence · Brain atlas · Neurobiology</span></div></div></footer>
    </div>
  );
}

export default Home;
