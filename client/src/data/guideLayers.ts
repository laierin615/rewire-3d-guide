import { guideChapters } from "./guideChapters";
import type { Mode } from "./neuroLessons";

// 導讀敘事主軸：把原書的「故事、提問、科學名詞」重新排成四層漏斗。
// 從底層的生理機制，推到中層的認知心智，最後收斂在教育實務與行動。
// source 只作內部核對；不在書裡的延伸說明一律放在 note（顯示為「導讀補充」）。

export type LayerNode = {
  title: string;
  /** 內部備註：取材自原書哪一段（不顯示） */
  source: string;
  text: string;
  /** 導讀補充：教育心理學或教學現場的延伸，不是作者的說法 */
  note?: string;
  /** 補充這個理論的動畫：小島情境（scene）或立體示意（lab） */
  anim?: { scene: string } | { lab: Mode; id: string };
};

/** 層內的小節：一個引導問題、幾個主題，結尾一句橋接到下一節 */
export type LayerSection = {
  title: string;
  question: string;
  chapters: string[];
  bridge: string;
};

export type GuideLayer = {
  id: string;
  no: string;
  label: string;
  en: string;
  title: string;
  question: string;
  intro: string;
  nodes: LayerNode[];
  /** 放在層最前面的前導情境 */
  lead: { scene: string; question: string };
  /** 這一層的小節（依導讀順序） */
  sections: LayerSection[];
  /** 這一層底下的主題（由小節推得） */
  chapters: string[];
};

export const guideLayers: GuideLayer[] = [
  {
    id: "layer1",
    no: "01",
    label: "第一層",
    en: "The Problem",
    title: "覺察陷阱",
    question: "為什麼改變這麼難？",
    lead: { scene: "intro", question: "你每天有哪件事，像刷牙一樣想都不用想就做完了？如果要換個做法，你會怎麼提醒自己？" },
    intro: "很多讓人困住的反應，不只是態度問題，而是大腦把重複的經驗走成了熟悉的路，在背景裡自動執行。",
    nodes: [
      {
        title: "阻礙你的是什麼故事？",
        source: "1.3",
        text: "「你反覆對自己講述並因此阻礙你表現傑出的是什麼故事？」「你是如何的畫地為牢以致你的生活被困在四面牆壁之內？」",
        note: "帶入教學現場：想想班上那些總說「我不會」就放棄，或一點小事就情緒失控的孩子。他們身上，可能也有一個反覆被講述的故事。",
      },
      {
        title: "自動化反應",
        anim: { scene: "subconscious" },
        source: "2.0",
        text: "據估計，大腦約九成在潛意識裡運作。剛學開車時每個動作都要想，熟練後腳自己知道要踩哪個踏板；習慣和內在的故事，也是這樣被「預先設定」的。熟悉，讓大腦省力。",
        note: "教育心理學稱為「自動化」（automaticity）：反覆的經驗被自動處理，不再占用注意力。重複的負面經驗也會被自動化，「習得無助」可以從這個角度理解。",
      },
      {
        title: "奶昔實驗：預期會改變身體",
        anim: { scene: "thought-power" },
        source: "1.3",
        text: "2011 年艾莉雅．克拉姆博士的研究：同一杯奶昔，被告知是高熱量的那一組，喝完後飢餓素下降得比較多。我們相信什麼，身體就跟著反應。",
      },
    ],
    sections: [
      { title: "壓力怎麼把人困住", question: "為什麼明知道該改，卻總是回到老樣子？", chapters: ["break-cycle", "loss-grief"], bridge: "壓力讓大腦只顧著撐過眼前。接下來看：大腦還會替我們挑選要看見什麼。" },
      { title: "大腦怎麼扭曲我們看到的", question: "為什麼壞事總是比較顯眼？", chapters: ["negative-bias", "confirmation-bias"], bridge: "偏誤不是一天形成的。下一步要看：這些反應是怎麼一點一滴被設定的？" },
      { title: "我們怎麼慢慢被設定", question: "那些「我就是這樣」，是從哪裡來的？", chapters: ["creeping-normality", "subconscious"], bridge: "看見了陷阱，接著要問：大腦到底能不能改？靠的是什麼機制？" },
    ],
    get chapters() {
      return this.sections.flatMap(sec => sec.chapters);
    },
  },
  {
    id: "layer2",
    no: "02",
    label: "第二層",
    en: "The Science",
    title: "解碼大腦",
    question: "改變的底層生理機制是什麼？",
    lead: { scene: "lead-low-power", question: "你最近有沒有哪段時間，覺得自己像在低電量模式？那時最先被放掉的是什麼？" },
    intro: "給改變一個生理學的基礎：神經元怎麼連結、怎麼鬆開，以及身體的狀態如何決定大腦有沒有電力去改變。",
    nodes: [
      {
        title: "赫布定律・長期增強作用",
        anim: { lab: "synapse", id: "lab3d" },
        source: "1.2",
        text: "「一起放電的神經元會彼此連結。」兩個神經元反覆一起活化，連結就愈來愈強。固定的想法和壞習慣，就是這樣被一次次強化的。",
      },
      {
        title: "長期壓抑作用",
        anim: { lab: "practice", id: "practice-animation" },
        source: "1.2",
        text: "「但分開放電的神經元會互不相干。」我們可以切斷神經元的共同放電，讓它們不再互相活化。書中的例子是：一有壓力就想吸菸，是因為大腦把吸菸和緩解壓力連在一起；換一種方式紓壓，舊連結就會慢慢變弱。",
        note: "這是「孩子可以改變」的生理學依據，也是班級輔導的基礎：舊路不走，會慢慢變淡。",
      },
      {
        title: "鋼琴心理練習實驗",
        source: "1.3",
        text: "只在腦中想像練琴的人，和真的去彈的人，出現相似的大腦可塑性變化。注意力和意識本身，就能參與神經重塑。",
      },
      {
        title: "低電量模式",
        source: "導言",
        text: "大腦是硬體，記憶、想法、習慣是軟體。硬體電量不足時，大腦只顧維持基本功能，不理會軟體更新。所以這一層也接上運動、睡眠和多巴胺：顧好身體，大腦才有電力建立新連結。",
      },
    ],
    sections: [
      { title: "大腦為什麼能改變", question: "大腦是怎麼被塑形的？", chapters: ["intro", "thought-power"], bridge: "知道大腦能改，下一個問題是：新的路要怎麼走出來？" },
      { title: "新路怎麼被走出來", question: "為什麼要重複那麼多次？", chapters: ["repetition"], bridge: "重複需要電力。接著看身體怎麼替大腦充電。" },
      { title: "改變需要電力", question: "身體的狀態，如何決定大腦有沒有餘力改變？", chapters: ["muscles", "sleep", "dopamine"], bridge: "原理清楚了，接下來把它變成能練習的方法。" },
    ],
    get chapters() {
      return this.sections.flatMap(sec => sec.chapters);
    },
  },
  {
    id: "layer3",
    no: "03",
    label: "第三層",
    en: "The Strategy",
    title: "阻斷與重建",
    question: "如何設計成長迴路？",
    lead: { scene: "make-space", question: "下一次被觸發時，你想替自己留下哪一個暫停的動作？" },
    intro: "把作者散落在書中各處的方法收成一套：辨識提示、掌握公式、重新架構，再一步步練出新的反應。",
    nodes: [
      {
        title: "拆解觸發提示",
        anim: { lab: "regulation", id: "stress-animation" },
        source: "1.7",
        text: "提示是提醒我們做某件事的訊號，可能來自環境、身邊的人（社交提示）、看到或感覺到的東西（感官提示），或特定的時間。提示本身不一定是負面的，同樣的機制也能替新習慣搭好提示。",
        note: "教師的任務：幫孩子辨識引發負面反應的提示，並刻意在教室裡創造正向的提示。",
      },
      {
        title: "核心公式",
        anim: { scene: "neurotoolkit" },
        source: "1.7",
        text: "重複＋注意力＋刻意＝持久的改變。大腦不知道對錯，只知道重複會讓路徑變強；人平均每分鐘約有 6.5 個意念，如果多半在挑剔自己，我們每天都在把挑剔「練」得很熟。",
      },
      {
        title: "重新架構",
        source: "1.2・1.3",
        text: "把腦中的舊說法換成新說法，例如「我不夠好」換成「我可以適應和學習」、「我做不到」換成「我做得到」。用新的敘事反覆走新路，舊連結就會慢慢變弱；寫日記能把盤旋的念頭變成可以處理的故事。",
        note: "對應輔導實務中認知行為取向的「認知重建」：先覺察自動化的想法，再用證據替它換一個說法。",
      },
    ],
    sections: [
      { title: "攔截舊反應", question: "舊反應冒出來的那一刻，可以做什麼？", chapters: ["neurotoolkit", "make-space"], bridge: "攔下舊路之後，要替新路鋪好條件。" },
      { title: "鋪設新路", question: "怎麼讓新的反應更容易被選擇？", chapters: ["phone", "visualization"], bridge: "新路剛鋪好時最脆弱，接下來要學會怎麼撐下去。" },
      { title: "撐過挫折", question: "動機消退、挫折來時，怎麼不被打回原點？", chapters: ["boundaries", "strategy", "fear", "resilience"], bridge: "方法有了，最後回到教室：老師可以怎麼用？" },
    ],
    get chapters() {
      return this.sections.flatMap(sec => sec.chapters);
    },
  },
  {
    id: "layer4",
    no: "04",
    label: "第四層",
    en: "The Application",
    title: "教育現場落地",
    question: "教師可以怎麼做？",
    lead: { scene: "growth", question: "你最常對學生說的一句讚美是什麼？它讚美的是天分，還是努力和方法？" },
    intro: "把理論收束到教學與班級經營：課程怎麼安排專注與留白，回饋怎麼說，以及老師自己在孩子環境裡扮演的角色。",
    nodes: [
      {
        title: "兩個網絡的切換",
        anim: { lab: "attention", id: "attention-animation" },
        source: "1.3",
        text: "大腦閒下來時，預設模式網絡讓思緒飄向過去、未來與內省；專注任務時，中央執行網絡接手；顯著性網絡負責在兩者之間切換。",
        note: "課程設計的提醒：既要有高專注的精熟練習，也要給大腦留白和反思的時間。",
      },
      {
        title: "回饋語句的重塑",
        source: "3.2",
        text: "杜維克的研究：被稱讚「你真聰明」的學生，之後比較會挑簡單的題目；被稱讚「你一定很努力」的學生，反而願意挑戰更難的問題。身分認同不等於表現。",
        note: "老師的每一句讚美和提問，都在幫孩子刻意練習某一條路：稱讚努力和方法，而不是天分。",
      },
      {
        title: "結尾定錨：科比的投籃",
        source: "1.7",
        text: "籃球員科比．布萊恩青少年時每天投籃一千次，後來在球隊練習前先自己投八百球，投籃成了大腦的自動反應。",
        note: "給教育工作者：我們就是孩子學習環境中最重要的提示之一，每天重複的引導，會一點一點決定他們大腦的路徑。",
      },
    ],
    sections: [
      { title: "回饋與心態", question: "老師的一句話，會把孩子帶往哪條路？", chapters: ["growth"], bridge: "心態改變之後，要靠一次次守住承諾，長出信心。" },
      { title: "信任與承諾", question: "怎麼讓改變真正站穩？", chapters: ["self-trust", "closing"], bridge: "最後，把這些概念接回教師資格考。" },
    ],
    get chapters() {
      return this.sections.flatMap(sec => sec.chapters);
    },
  },
];

/** 依導讀順序排好的章節 id */
export const layerChapterOrder = guideLayers.flatMap(l => l.chapters);


/** 主題編號，例如第二層第三個主題是 "2-3" */
export const topicNumber = (id: string) => {
  const li = guideLayers.findIndex(l => l.chapters.includes(id));
  return li < 0 ? "" : `${li + 1}-${guideLayers[li].chapters.indexOf(id) + 1}`;
};

/** 給連結用的主題名稱，例如「1-1 打破循環」 */
export const topicLabel = (id: string) => {
  const ch = guideChapters.find(c => c.id === id);
  return ch ? `${topicNumber(id)} ${ch.title}` : id;
};

/** 已移到層前導或理論節點的情境：主題卡不再重複播放 */
export const relocatedScenes = new Set(
  guideLayers.flatMap(l => [l.lead.scene, ...l.nodes.flatMap(n => (n.anim && "scene" in n.anim ? [n.anim.scene] : []))])
);
