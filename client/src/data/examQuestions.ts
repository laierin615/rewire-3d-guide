export type ExamQuestion = {
  id: string;
  year: number;
  number: number;
  stem: string;
  options: string[];
  answer: number;
  concept: string;
  explanation: string;
  source: string;
};

export type NeuroExamRegion = "額葉／前額葉" | "海馬迴" | "杏仁核" | "大腦皮質與側化" | "腦幹與注意系統" | "神經傳導與可塑性" | "執行功能與工作記憶";

export type NeuroMechanismQuestion = {
  id: string;
  year: number;
  subject: string;
  number: string;
  stem: string;
  options: string[];
  answer: number;
  region: NeuroExamRegion;
  concept: string;
  explanation: string;
  neuroMechanism: string;
  bookConnection: string;
  distractorAnalysis: string;
  source: string;
  answerSource: string;
};

const officialExamSource = "https://tqa.rcpet.edu.tw/TEA_Exam/TEA03.aspx";
const sourceHistorical = "https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RKZk16RXdNakEyTWw4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWW4501FG2405XT14JCMK2534ROGGMKVXYTMLFCXWA4VSPPECSWB5PKGCPO4415A4NO41WTXSPKHGICKLICYW1044UXQPFGLKECZSDG20OKROTTYW542100EDXWPK10&cg=10325";
const source2020 = "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/481109552.pdf";
const source2023 = "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/863586584.pdf";

export const examQuestions: ExamQuestion[] = [
  { id: "105-01", year: 2016, number: 1, stem: "小安在玩躲迷藏的遊戲時，跑到每個人都可以看得到他的角落蹲下並用手遮住自己的眼睛。小安的行為表現比較符合皮亞傑發展理論哪一個階段的描述？", options: ["前運思期", "形式運思期", "感覺動作期", "具體運思期"], answer: 0, concept: "認知發展／皮亞傑", explanation: "幼兒以為遮住自己的眼睛就等於別人也看不到他，呈現前運思期的自我中心思考。這題可連到大腦如何以自己的視角解釋他人經驗。", source: sourceHistorical },
  { id: "105-03", year: 2016, number: 3, stem: "下列何者較屬於學習負遷移的現象？", options: ["學生無論用各種方法，都學不會小數的借位減法", "學生根據其對整數的認識：三位數比二位數大，因此判定「3.5 < 3.21」", "學生在瞭解三角形面積計算後，無法推論出平行四邊形面積計算的方法", "學生累積整數乘法和除法的計算經驗後歸納認為「整數乘法的結果變大，除法的結果變小」"], answer: 1, concept: "學習遷移／先備知識干擾", explanation: "學生把整數大小的既有規則不當套用到小數，先前形成的知識干擾新情境，屬於負遷移。學習要能成功轉移，需要重新注意情境差異並修正原有表徵。", source: sourceHistorical },
  { id: "105-05", year: 2016, number: 5, stem: "在遇到數學圓柱體體積計算時，松平忘記了當年熟悉使用的公式，因為他已經多年沒有使用這個公式。松平忘記此數學公式最可能是由下列何種原因所造成的？", options: ["訊息壓抑", "訊息未曾儲存", "訊息記憶痕跡消退", "訊息未曾登錄到長期記憶"], answer: 2, concept: "記憶／遺忘與提取", explanation: "題幹指出公式曾經熟悉，但多年未使用，較符合記憶痕跡因缺乏再啟動而逐漸消退；不是從未登錄或未曾儲存。", source: sourceHistorical },
  { id: "105-07", year: 2016, number: 7, stem: "學生根據過去的成敗經驗，評估自己在接受新任務時，可以更加努力面臨挑戰。這較屬於班度拉所提出的下列何種概念？", options: ["自我增強", "自我效能", "自我要求", "自我參照效應"], answer: 1, concept: "學習與情緒／自我效能", explanation: "自我效能是個人對自己能否完成特定任務的信念，會影響目標、努力與面對挫折的持續度。從《Rewire》看，成功經驗與回饋能逐漸改變『我做不到』的預測。", source: sourceHistorical },
  { id: "105-08", year: 2016, number: 8, stem: "江老師發現學生普遍有『記不起來』的學習困擾，於是教導學生畫重點、用自己的話說一次及畫出架構圖。這些策略最接近哪一種學習取向？", options: ["社會學習理論", "認知取向學習策略", "操作制約在學習上的運用", "鷹架理論：提升學習成效的方法"], answer: 1, concept: "記憶／認知學習策略", explanation: "畫重點、重述與組織架構，都是協助注意、編碼、組織與提取的認知策略，讓新知識和既有知識建立更穩定的連結。", source: sourceHistorical },
  { id: "105-10", year: 2016, number: 10, stem: "關於刻板印象威脅的敘述，下列何者較不正確？", options: ["是因為月暈效應所造成", "是因焦慮所造成的表現下降", "是工作記憶容量下降影響表現所造成", "能經由事前告知，可不受負面刻板印象的困擾"], answer: 0, concept: "情緒與認知／刻板印象威脅", explanation: "刻板印象威脅不是月暈效應；它描述個體擔心印證負面刻板印象，因而增加焦慮與認知負荷，可能壓縮工作記憶與表現。", source: sourceHistorical },
  { id: "106-37", year: 2017, number: 37, stem: "李老師在歷史課上除講授內容外，也教導學生一些記憶策略，認為適當策略對學生習得學科內容有正面效益。李老師的教學理念較屬於哪一個學習理論觀點？", options: ["行為主義取向", "認知主義取向", "人本主義取向", "建構主義取向"], answer: 1, concept: "大腦與學習／認知主義", explanation: "把注意、記憶策略與知識習得歷程納入教學，重點在學習者如何處理與組織資訊，符合認知主義取向。", source: sourceHistorical },
  { id: "106-38", year: 2017, number: 38, stem: "李老師教導學生閱讀歷史書籍時，評估需要多少時間、選擇有效策略、隨時評估是否讀懂並思考如何解決不懂之處。這較屬於哪一種策略？", options: ["記憶策略", "認知策略", "後設認知策略", "情意動機策略"], answer: 2, concept: "注意與執行功能／後設認知", explanation: "後設認知包含計畫、監控與調整；學生不只閱讀內容，也監看自己的理解並修正方法。這正是從自動反應走向可選擇路徑的高階控制。", source: sourceHistorical },
  { id: "108-03", year: 2019, number: 3, stem: "兩杯一樣多的蘋果汁，其中一杯倒入較高且較瘦的杯子，小玲認為兩杯仍然一樣多。根據皮亞傑理論，小玲已具備下列何者？", options: ["類包含", "守恆概念", "知覺集中", "命題推理"], answer: 1, concept: "認知發展／守恆概念", explanation: "能不被杯子高度與形狀的表面變化誤導，理解數量保持不變，表示已具備守恆概念，通常與具體運思期的認知發展相關。", source: sourceHistorical },
  { id: "108-04", year: 2019, number: 4, stem: "張老師經常提供學生與原有知識矛盾的訊息，讓學生探究原因並提出解釋。下列何者較能詮釋張老師的目的？", options: ["提升學生的近側發展區", "引發認知失衡，形成基模的調適", "透過同儕互動提升學生的認知發展", "增進學生前運思期不可逆性思考的能力"], answer: 1, concept: "認知發展／失衡與調適", explanation: "與既有基模衝突的訊息會形成認知失衡，促使學習者透過同化與調適重組理解。從神經可塑性角度看，新的預測誤差提供了更新路徑的機會。", source: sourceHistorical },
  { id: "108-05", year: 2019, number: 5, stem: "大華打羽球多年，現在改學網球，過去打羽球的習慣對現在打網球產生干擾。這是下列何種現象？", options: ["水平遷移", "垂直遷移", "順攝抑制", "倒攝抑制"], answer: 2, concept: "記憶與學習／順攝抑制", explanation: "先前學會的羽球動作干擾後來的網球學習，屬於先前學習對後來學習的順攝抑制。它提醒教師要辨識舊路徑何時會和新技能競爭。", source: sourceHistorical },
  { id: "108-08", year: 2019, number: 8, stem: "小華唸唐詩時，為增加記憶不僅大聲朗誦，也抄寫一遍，更理解唐詩內容涵義。這最符合哪個原則？", options: ["意元集組原則", "運用複習原則", "多碼並用原則", "主觀組織原則"], answer: 2, concept: "記憶／多重編碼", explanation: "朗誦、書寫與理解同時提供聲音、動作與語意等不同編碼線索，符合多碼並用原則；多重線索能增加日後提取的入口。", source: sourceHistorical },
  { id: "108-39", year: 2019, number: 39, stem: "小智能妥善應用自己的知識，順利解決問題以達成目標的歷程，較適合用下列何種概念解釋？", options: ["後設認知", "自我探索", "發現學習", "觀點取替"], answer: 0, concept: "執行功能／後設認知", explanation: "能運用知識、監控問題解決歷程並朝目標調整，較接近後設認知，而不只是獲得知識或發現答案。", source: sourceHistorical },
  { id: "108-40", year: 2019, number: 40, stem: "小智發現自己閱讀科學類書籍時有較大的困難。這是屬於下列何種能力的展現？", options: ["計畫", "監控", "提取", "推論"], answer: 1, concept: "注意與執行功能／自我監控", explanation: "能察覺自己在特定閱讀任務上的困難，是對自身理解狀態進行監控；發現問題後才能進一步計畫、提取或調整策略。", source: sourceHistorical },
  { id: "109-01", year: 2020, number: 1, stem: "三歲謙謙與媽媽通電話時，以點頭回答媽媽的問話。雖然彼此看不到，但謙謙認為媽媽知道他的回應。謙謙的行為符合皮亞傑發展理論的哪一個概念？", options: ["物體恆存", "心像保留", "自我中心", "知覺集中"], answer: 2, concept: "認知發展／皮亞傑", explanation: "幼兒把自己的知覺與想法直接視為他人也能知道，呈現前運思期的自我中心傾向。", source: source2020 },
  { id: "109-02", year: 2020, number: 2, stem: "小穎在放假期間做了一些事，下列哪項行為是受到內在動機的驅使？", options: ["填寫網路問卷，希望參加手機抽獎", "複習功課，希望考試得到好成績", "和好朋友玩電腦遊戲，因為和他們在一起總是開心", "閱讀課外書，因為學校會頒發獎章"], answer: 2, concept: "學習與情緒／內在動機", explanation: "內在動機來自行動本身的興趣或滿足；與朋友遊戲因為相處愉快，較不是為了外在獎賞。", source: source2020 },
  { id: "109-03", year: 2020, number: 3, stem: "小美能運用各式工具做出精細手工藝品，但國、英、數表現不佳；只要有教具操作就能理解。根據迦納多元智能理論，她可能具有哪一項優勢智能？", options: ["人際智能", "數理邏輯智能", "視覺－空間智能", "肢體－動覺智能"], answer: 3, concept: "認知與學習／多元智能", explanation: "能靈活操作工具、透過身體動作與實作理解，最符合肢體－動覺智能。", source: source2020 },
  { id: "109-04", year: 2020, number: 4, stem: "王老師解說浮力概念後，鼓勵學生用自己的話解釋並舉例，這是使用哪一種學習策略？", options: ["複誦", "序列化", "精緻化", "自動化"], answer: 2, concept: "學習策略／精緻化", explanation: "把新概念用自己的話重述並連結例子，是將新舊知識建立意義連結的精緻化策略。", source: source2020 },
  { id: "109-05", year: 2020, number: 5, stem: "趙老師偏好認知學習理論，在學生學習上，最可能傳遞給家長的教育信念是？", options: ["讓孩子主動學習才能真正學會知識", "大人以身作則是孩子最好的學習榜樣", "賞罰分明對學習行為很重要", "無條件關愛能讓孩子發揮潛能"], answer: 0, concept: "認知學習／主動建構", explanation: "認知取向重視學習者主動處理、理解與建構知識，而非只接受刺激或外在增強。", source: source2020 },
  { id: "109-06", year: 2020, number: 6, stem: "下列哪一個例子最能闡述刻板印象威脅？", options: ["多數人相信男性語文能力較女性差", "數學考試時女性因性別偏見而焦慮與低表現", "亞裔學生好成績是過度學習的結果", "低成就學生往往被教導服從與死記"], answer: 1, concept: "情緒與認知／刻板印象威脅", explanation: "刻板印象威脅是個體擔心印證負面刻板印象，因而承受焦慮並影響實際表現。", source: source2020 },
  { id: "109-07", year: 2020, number: 7, stem: "小文說『我就是笨，數學怎麼學都不會』。依溫納歸因理論，他對學習失敗做了哪一種歸因？", options: ["穩定－內在－不可控制", "不穩定－內在－可控制", "穩定－外在－不可控制", "不穩定－內在－不可控制"], answer: 0, concept: "情緒與學習／歸因理論", explanation: "把失敗歸因於固定的能力不足，屬內在、穩定且不可控制的歸因，容易形成習得無助。", source: source2020 },
  { id: "109-08", year: 2020, number: 8, stem: "以古蹟探查、分組規劃、實地訪查與統計圖表進行數學教學，核心理念與哪些學習理論相符？甲建構論、乙行為主義、丙情境學習、丁意義學習。", options: ["甲乙", "乙丙", "丙丁", "甲丙"], answer: 3, concept: "學習理論／情境與建構", explanation: "學生主動規劃並在真實情境中建構意義，主要符合建構論與情境學習。", source: source2020 },
  { id: "109-09", year: 2020, number: 9, stem: "四位同學都認為不應作弊，但理由不同。哪一位同學的理由屬於道德循規期？甲被抓會處罰；乙良心不安；丙對別人不公平；丁被抓會被老師認為是壞學生。", options: ["甲", "乙", "丙", "丁"], answer: 2, concept: "情緒與社會認知／道德發展", explanation: "循規期重視維持良好關係與獲得他人認可；不想被老師認為是壞學生最符合此層次。", source: source2020 },
  { id: "109-10", year: 2020, number: 10, stem: "小英不求好成績，但也不希望不及格或排名後段。依成就目標理論，她的目標導向為何？", options: ["趨向精熟目標", "逃避表現目標", "趨向表現目標", "逃避精熟目標"], answer: 1, concept: "學習與情緒／成就目標", explanation: "她的焦點是避免顯得能力差、避免低分與後段排名，屬逃避表現目標。", source: source2020 },
  { id: "112-02", year: 2023, number: 2, stem: "假新聞經由社會知名人士傳述時，易使民眾不假思索接受與散播。『訴諸人身、因人而信』顯示人容易受到哪種力量影響？", options: ["權威", "理性", "感官", "天啟"], answer: 0, concept: "認知與媒體識讀／權威偏誤", explanation: "因為說話者的身分或地位就接受主張，是把知名人士當作權威的訴諸權威，也提醒我們要檢查證據與自身的確認偏誤。", source: source2023 },
  { id: "112-03", year: 2023, number: 3, stem: "下列敘述何者不符合弗雷勒對話式教學的意涵？", options: ["學生可以同時是教學者，教師可以同時是學習者", "對話式教學的目的之一，在於保持教學價值中立", "師生採取非宰制對待，以溝通代替對立", "教師避免囤積式教學，以啟發學生批判能力"], answer: 1, concept: "認知與批判思考／對話教育", explanation: "弗雷勒的對話教育不是價值中立，而是透過對話發展意識覺醒與對不正義的批判行動。", source: source2023 },
  { id: "112-06", year: 2023, number: 6, stem: "漢娜．鄂蘭所說的『平庸之惡』，是缺乏獨立思考與批判能力而任人擺布。何者最符合此現象？", options: ["陽奉陰違的應付", "盲目的順從體制", "不經思索的反對", "違法的濫用處罰"], answer: 1, concept: "認知與批判思考／獨立判斷", explanation: "平庸之惡的核心在於停止思考、以服從制度代替判斷；盲目順從最直接對應。", source: source2023 },
  { id: "112-08", year: 2023, number: 8, stem: "『城牆 100 年沒有被摧毀，也無法保證未來不會被摧毀。』這段話反映的知識觀，與哪位學者理論最相關？", options: ["培根：知識即力量", "傅柯：知識即權力", "波普：知識的可否證性", "李歐塔：知識的操作性"], answer: 2, concept: "認知與知識論／可否證性", explanation: "經驗不能證明命題永遠為真，但一個反例即可推翻它，正是波普的可否證性，提醒學習者保留修正認知的可能。", source: source2023 },
];

export const brainRelatedQuestions = examQuestions;
export const bookRelatedQuestions = brainRelatedQuestions;

export const officialExamSourceUrl = officialExamSource;

export const neuroMechanismQuestions: NeuroMechanismQuestion[] = [
  {
    id: "105-child-06", year: 2016, subject: "兒童發展與輔導", number: "6",
    stem: "海馬迴（hippocampus）及相鄰腦區連結網絡的發展，與下列哪一類功能的發展最有關？",
    options: ["感覺", "運動", "情緒", "記憶"], answer: 3, region: "海馬迴", concept: "海馬迴與記憶形成",
    explanation: "正解是記憶。海馬迴與相鄰內側顳葉皮質共同支持新情節記憶與空間表徵的形成；它不是所有記憶的永久儲藏庫，而是新記憶建立與情境化的重要節點。",
    neuroMechanism: "經驗的感覺特徵分散在不同皮質區，海馬迴協助把同一事件的時間、地點與內容綁定，再透過再活化支持長期皮質表徵。",
    bookConnection: "《Rewire》指出海馬體對記憶形成與壓力反應調節至關重要，並能在壓力源消失後協助關閉警報（PDF p.27）。",
    distractorAnalysis: "感覺由多個感覺皮質與丘腦路徑處理；運動主要涉及運動皮質、基底核與小腦；情緒雖與海馬情境記憶互動，但本題最直接對應記憶。",
    source: "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/180787730.pdf",
    answerSource: "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/759547822.pdf",
  },
  {
    id: "106-child-05", year: 2017, subject: "兒童發展與輔導", number: "5",
    stem: "學齡兒童大腦中的哪一個腦區組織會持續地和周圍的皮質建立聯結，因而提升記憶和空間能力？",
    options: ["杏仁核", "海馬迴", "下視丘", "網狀結構"], answer: 1, region: "海馬迴", concept: "海馬—皮質網絡發展",
    explanation: "正解是海馬迴。海馬迴與內嗅皮質及廣泛聯合皮質的連結，在學齡期仍持續精緻化，支持情節記憶與空間導航。",
    neuroMechanism: "海馬迴不是孤立運作；它把分散在皮質的事件特徵綁定，並在回想時重建脈絡。這也是為何線索與情境能影響提取。",
    bookConnection: "書中以海馬體說明記憶形成、壓力回饋與慢性壓力下的學習困難（PDF p.27、p.46）。",
    distractorAnalysis: "杏仁核偏向情緒顯著性與威脅學習；下視丘調節內分泌與自主神經；網狀結構主要支持清醒與警覺。",
    source: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "106-child-11", year: 2017, subject: "兒童發展與輔導", number: "11",
    stem: "下列何者最能描述兒童『注意力監控』與『不同工作功能調節整合』的工作記憶成份？",
    options: ["語音迴路", "中央執行單位", "動作影像功能", "視覺－空間書寫板"], answer: 1, region: "執行功能與工作記憶", concept: "工作記憶中央執行系統",
    explanation: "正解是中央執行單位。它負責分配注意、協調語音與視空間子系統、監控目標並在任務間切換。",
    neuroMechanism: "中央執行功能不是單一位置，而是以外側前額葉、後頂葉、前扣帶等節點組成的控制網絡，共同維持與更新工作記憶。",
    bookConnection: "《Rewire》把前額葉連到聚焦、專注、自我控制與錯誤修正；高壓時這些功能容易被壓縮（PDF p.45–47）。",
    distractorAnalysis: "語音迴路偏向語音暫存與複誦；視覺－空間書寫板暫存視空間資訊；『動作影像功能』不是該模型的標準中央控制成分。",
    source: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "106-child-12", year: 2017, subject: "兒童發展與輔導", number: "12",
    stem: "一年級小惠常哭鬧並難接受勸慰；四年級姊姊小珠較能察言觀色並表現合宜情緒。下列哪一項腦神經發展解釋最正確？",
    options: ["姊姊的枕葉視覺區較成熟，所以善於察言觀色", "妹妹的威尼克區受損，所以聽不懂勸慰", "妹妹的杏仁核與前額葉間連結及髓鞘化較不成熟，所以情緒掌控較差", "姊姊的大腦側化較完整，所以感性與理性較不衝突"],
    answer: 2, region: "杏仁核", concept: "杏仁核—前額葉連結與髓鞘化",
    explanation: "正解是杏仁核與前額葉連結及髓鞘化的成熟。兒童發展中，前額葉對情緒反應的調節、抑制與重新評估能力仍在逐步增強。",
    neuroMechanism: "杏仁核快速標記情緒顯著性；前額葉透過自上而下控制、語言與規則表徵調節反應。髓鞘化提升長距離訊號傳遞效率。",
    bookConnection: "書中描述杏仁核活動升高會抑制前額葉的清晰思考，而命名情緒可重新動員前額葉相關歷程（PDF p.47–49）。",
    distractorAnalysis: "察言觀色不只靠枕葉；聽不進勸慰不等於威尼克區病灶；『左右腦感性／理性分離』是過度簡化的神經迷思。",
    source: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "106-child-20", year: 2017, subject: "兒童發展與輔導", number: "20",
    stem: "有關大腦皮質左右側功能的描述，下列何者正確？甲、左側擅長整體式、右側擅長序列式；乙、左側負責較多正向情緒、右側負責較多負向情緒；丙、左側負責較多語法功能、右側負責較多語用功能；丁、左側負責空間能力、右側負責邏輯推理。",
    options: ["甲乙", "乙丙", "丙丁", "甲丁"], answer: 1, region: "大腦皮質與側化", concept: "大腦功能側化",
    explanation: "依該年度參考答案，乙、丙正確。語言的語法處理較常呈左側優勢，語調、脈絡與部分語用歷程較常呈右側優勢。",
    neuroMechanism: "側化是相對優勢，不是左右半球各自獨立。兩側透過胼胝體與多條連結持續交換資訊；個體差異也很大。",
    bookConnection: "《Rewire》強調腦區功能互補而非互斥；前額葉與邊緣系統可以共同塑造理解與行為（PDF p.45）。",
    distractorAnalysis: "整體／序列與空間／邏輯的左右配對被題目顛倒，也容易滑向『左腦型／右腦型人格』的錯誤二分。",
    source: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "106-child-26", year: 2017, subject: "兒童發展與輔導", number: "26",
    stem: "媽媽念出阿姨電話號碼後，小明一面複誦，一面找紙記下，並說不趕快記就會忘記。小明的判斷最可能與哪個腦區發展較成熟有關？",
    options: ["額葉（frontal lobe）", "頂葉（parietal lobe）", "顳葉（temporal lobe）", "枕葉（occipital lobe）"], answer: 0, region: "額葉／前額葉", concept: "額葉成熟與工作記憶監控",
    explanation: "正解是額葉。能監控短暫保持的電話號碼、預測遺忘並採取外部記錄策略，涉及前額葉支持的工作記憶與後設認知。",
    neuroMechanism: "前額葉維持目標與策略，頂葉支援注意與表徵；把號碼寫下則是將有限工作記憶負荷外化。",
    bookConnection: "書中把前額葉連到聚焦、專注、自我控制、預見情境與犯錯後調整（PDF p.45）。",
    distractorAnalysis: "頂葉支援注意與數量處理，顳葉涉及聽覺和記憶，枕葉處理視覺；但『監控記憶並規劃補救』最直接對應額葉控制。",
    source: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "107-sample-01", year: 2018, subject: "兒童發展與輔導（官方範例）", number: "範例 1",
    stem: "下列哪一個腦區皮質細胞髓鞘化的時間最晚，直到青春期才完全包覆髓鞘？",
    options: ["頂葉", "額葉", "顳葉", "枕葉"], answer: 1, region: "額葉／前額葉", concept: "額葉髓鞘化與晚期成熟",
    explanation: "正解是額葉。前額葉相關長距離連結與髓鞘化延續到青春期及更後期，與規劃、抑制與風險評估逐步成熟相符。",
    neuroMechanism: "髓鞘像軸突的絕緣層，可提高訊號速度與時序精確度。額葉控制網絡成熟較晚，是兒童與青少年執行功能仍在發展的重要背景。",
    bookConnection: "書中指出髓磷脂覆蓋神經元並協助訊息傳到更遠區域，也把前額葉連到決策與認知控制（PDF p.214）。",
    distractorAnalysis: "其他腦葉也會持續發展，但題目聚焦最晚成熟、與高階控制密切相關的額葉。",
    source: "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/891646133.pdf",
    answerSource: "https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/891646133.pdf",
  },
  {
    id: "108-first-26", year: 2019, subject: "兒童發展與輔導（第一次）", number: "26",
    stem: "小安一直記得幼兒園放學時在巷口被黑狗追趕，因此每到巷口就害怕。這種『一朝被蛇咬、十年怕草繩』與哪些腦區功能最相關？",
    options: ["松果體", "腦下垂體", "視丘與下視丘", "海馬迴與杏仁核"], answer: 3, region: "杏仁核", concept: "恐懼記憶：海馬迴 × 杏仁核",
    explanation: "正解是海馬迴與杏仁核。海馬迴提供巷口、時間與事件脈絡，杏仁核為威脅加上高顯著性的情緒標記，兩者共同使相似線索再次引發恐懼。",
    neuroMechanism: "恐懼記憶不是杏仁核單獨儲存。杏仁核參與情緒學習，海馬迴區分『哪個情境真的危險』；新安全經驗需要在相似情境中反覆被學會。",
    bookConnection: "《Rewire》直接把杏仁核、海馬體與壓力下的認知偏向並列，並說明強烈情緒會改變決策與情境解釋（PDF p.46）。",
    distractorAnalysis: "松果體主要連到晝夜節律；腦下垂體和下視丘參與內分泌與壓力輸出，但題幹問的是長期恐懼記憶與情境線索。",
    source: "https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RSZk9EZ3lORFkwTlY4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWWWWXXFGB0TXXT34DGMOYSOPB0YWMKNPYTQPTWSWMK34SWCCLK45SSUSXW4405A4NO41WTXSPKA1MO14344020XTNPIGB0LKUSPPB420OKROTTYW542100EDXWPK10&cg=10325",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "108-first-30", year: 2019, subject: "兒童發展與輔導（第一次）", number: "30",
    stem: "十歲的小方收到不喜歡的生日禮物，即使不開心，仍微笑向對方道謝。這項表現與大腦哪一區塊功能最密切？",
    options: ["頂葉", "枕葉", "額葉", "顳葉"], answer: 2, region: "額葉／前額葉", concept: "額葉與情緒表達調節",
    explanation: "正解是額葉。小方必須維持社會規則、抑制立即情緒表達並選擇較合宜的反應，涉及前額葉支持的抑制與重新評估。",
    neuroMechanism: "前額葉與杏仁核、前扣帶、島葉等區域共同調節情緒；不是額葉單獨『關掉』不愉快，而是重整行動選項。",
    bookConnection: "書中以情緒命名與暫停說明前額葉重新參與後，人更能選擇不被情緒完全支配的反應（PDF p.49）。",
    distractorAnalysis: "頂葉偏向空間與感覺整合，枕葉偏向視覺，顳葉參與聽覺、語意與記憶；社會情境中的抑制控制最直接對應額葉。",
    source: "https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RSZk9EZ3lORFkwTlY4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWWWWXXFGB0TXXT34DGMOYSOPB0YWMKNPYTQPTWSWMK34SWCCLK45SSUSXW4405A4NO41WTXSPKA1MO14344020XTNPIGB0LKUSPPB420OKROTTYW542100EDXWPK10&cg=10325",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "108-second-22", year: 2019, subject: "兒童發展與輔導（第二次）", number: "22",
    stem: "張老師發現三年級小翔維持注意的能力不佳。從神經學角度，可能是哪一區域尚未發展完備？",
    options: ["杏仁核（amygdala）", "海馬迴（hippocampus）", "下視丘（hypothalamus）", "網狀結構（reticular formation）"], answer: 3, region: "腦幹與注意系統", concept: "網狀結構與清醒／持續注意",
    explanation: "正解是網狀結構。腦幹網狀結構及其上行投射參與清醒與警覺，提供維持注意的基本喚醒條件。",
    neuroMechanism: "上行網狀活化系統向丘腦、基底前腦與皮質廣泛投射，調整全腦喚醒；持續注意仍需前額葉與頂葉控制網絡共同參與。",
    bookConnection: "《Rewire》以咖啡店聲音、機場飛機與嬰兒動靜說明網狀活化系統如何依重要性過濾輸入（PDF p.18、p.108–109）。",
    distractorAnalysis: "杏仁核偏向情緒顯著性，海馬迴偏向情境記憶，下視丘偏向內穩態與內分泌；題目問基本警覺與維持注意。",
    source: "https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RSZk9EZ3lORFkwTlY4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWWWWXXFGB0TXXT34DGMOYSOPB0YWMKNPYTQPTWSWMK34SWCCLK45SSUSXW4405A4NO41WTXSPKA1MO14344020XTNPIGB0LKUSPPB420OKROTTYW542100EDXWPK10&cg=10325",
    answerSource: "https://cte.nptu.edu.tw/p/405-1023-131168,c10325.php?Lang=zh-tw",
  },
  {
    id: "110-learner-09", year: 2021, subject: "學習者發展與適性輔導", number: "9",
    stem: "小新的大腦海馬迴受損，他最可能出現下列哪一種問題？",
    options: ["無法控制情緒常發脾氣", "身體動作不協調時常跌倒", "無法判斷對話中的弦外之音", "記不住老師課堂的教學內容"], answer: 3, region: "海馬迴", concept: "海馬迴受損與新記憶",
    explanation: "正解是記不住新教學內容。海馬迴受損最典型影響之一，是難以形成新的陳述性／情節記憶。",
    neuroMechanism: "海馬迴協助將短暫經驗整合為可日後提取的記憶；程序技能與部分舊記憶可能相對保留，因此不能把它說成『所有記憶消失』。",
    bookConnection: "書中說明慢性壓力造成的海馬體變化可能引發學習與記憶困難（PDF p.27）。",
    distractorAnalysis: "情緒爆發較常連到杏仁核—前額葉調節，小腦損傷較可能動作不協調，弦外之音涉及語用、右半球與社會認知網絡。",
    source: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=bfHm2JdStswH4-s-k7sE85hJ8LbLR60s0sR4ueXxlR4enDELu175729kSz_QHHwU60-eo_Hxi7PDuhLt7kR-fu9RyBn4x1qWFMxVw4Vf5VfRuB9cjYu3nZMuydyxGDBSIhvi3NLGh25rdeuZneMiiA47ELe0Un6w49yo_j4rDTckVnLYVkYk72WPzMIX70Xpa8ZfS9p2-xtVbvjqa0Z8pg",
    answerSource: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=xZFZ1o5hsbTEcoPLHnm3i6m4UtN-XTMJZ632d5rU7NYV42a8b0s0ip-qpn17y_8vrQ4hxdaGgOD_5_TGWC4ra2sFTzZXZGM73g5hImtFSSxe8LoutH1oiUrZswegdMDIifqt1M5onoQszcS-9GwJyz3jQsec0Tt9xWev-0zOisV9gc_hWHAOkOY8UE5S6tnBodfgA2OYwRdOoPflZPqL1Q",
  },
  {
    id: "111-learner-02", year: 2022, subject: "學習者發展與適性輔導", number: "2",
    stem: "小光常有上課不專心、容易衝動發言、做事缺乏計畫性等表現。他最可能是哪一腦區功能有所缺損？",
    options: ["胼胝體", "邊緣系統", "顳葉皮質區", "前額葉皮質區"], answer: 3, region: "額葉／前額葉", concept: "前額葉與執行功能",
    explanation: "正解是前額葉皮質區。不專心、抑制不足與計畫困難都屬執行功能表現，與前額葉控制網絡密切相關。",
    neuroMechanism: "前額葉透過額頂葉與扣帶—島葉網絡維持目標、抑制優勢反應並監控錯誤；不能只憑行為就推論真的存在腦區損傷。",
    bookConnection: "《Rewire》把前額葉描述為聚焦、專注、自我控制、預見與修正反應的重要區域（PDF p.45）。",
    distractorAnalysis: "胼胝體連結兩半球；邊緣系統範圍廣且偏情緒／記憶；顳葉偏聽覺、語意與記憶。題幹的計畫與抑制最指向前額葉。",
    source: "https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411112623.pdf",
    answerSource: "https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411112644.pdf",
  },
  {
    id: "112-learner-01", year: 2023, subject: "學習者發展與適性輔導", number: "1",
    stem: "下列大腦區域何者與情緒控制較有關係？",
    options: ["額葉", "頂葉", "枕葉", "顳葉"], answer: 0, region: "額葉／前額葉", concept: "額葉與情緒控制",
    explanation: "正解是額葉。前額葉支援抑制、重新評估、目標維持與社會規則運用，是情緒控制的重要節點。",
    neuroMechanism: "情緒控制不是額葉單獨工作，而是前額葉與杏仁核、前扣帶、島葉、海馬等區域互相調節。",
    bookConnection: "書中指出強烈情緒可能劫持前額葉，並以生理調節與命名情緒協助高階控制重新參與（PDF p.45–49）。",
    distractorAnalysis: "頂葉偏感覺與空間整合，枕葉偏視覺，顳葉偏聽覺、語意及記憶；四者中額葉最直接對應抑制與調節。",
    source: "https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411113129.pdf",
    answerSource: "https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411113151.pdf",
  },
  {
    id: "113-learner-23", year: 2024, subject: "學習者發展與適性輔導", number: "23",
    stem: "下列哪一項敘述較能說明青少年『不顧風險在懸崖邊自拍』的行為？",
    options: ["處理高層次認知判斷的前額葉尚未發展成熟", "知覺集中傾向使青少年忽視活動風險", "後設認知提升使青少年認為自己不容易受傷", "掌管情緒經驗與感官刺激的邊緣系統尚未成熟"], answer: 0, region: "額葉／前額葉", concept: "青少年前額葉成熟與風險判斷",
    explanation: "正解是前額葉尚未成熟。青少年的計畫、抑制、長期後果評估仍在發展，獎勵與同儕線索有時會比遠期風險取得更高權重。",
    neuroMechanism: "風險行為來自前額葉控制、獎勵系統、情緒與社會情境的動態互動，不能簡化成『青少年沒有前額葉』。",
    bookConnection: "《Rewire》指出前額葉讓人預見可能情境、做判斷並在犯錯時調整反應（PDF p.45）。",
    distractorAnalysis: "知覺集中是皮亞傑前運思概念；後設認知提升通常不會直接造成風險忽視；邊緣系統並非尚未成熟的單一感官中心。",
    source: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=T61ACq_Vo3ST89Xe_6K0j1AfnrmIC5i13uEX6PaYBpb8W09b4lpnSKG40OWGmZX7iXGi7wRnOYFgKldJDZCvFOhCENta2tq6E9dm8EsZ3K9RN8MbFrvmeCBTQcXuAXfZY21ERywip-w3jiljpV3JDhl3_-uhb0U5fAIze1qvPhwpayqAgTvU9FgYT1vf2MtFibbwIlMxvpk7VjUMyjEVkg",
    answerSource: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=p1fjNvkD0XtrCTK98Ww0Ieh53CkWPV-j6Nm_1ZfUx7nJwzI-BhUa4OYeEibxsrtlN6mu90jRP5CKkVhk7zC6U9spA3RyLsn_wJ7NWS8rRulaW-ZiVlA2pZVAKeMHb56oWbHBDT9-b9jSYE9OEPgWOhk0FWhyR37ho1n9auFRDxH4_XMUwAXkXWIx5YYDlW5rRS6lbLd5RAi3Z_98Pm3tJg",
  },
  {
    id: "114-learner-01", year: 2025, subject: "學習者發展與適性輔導", number: "1",
    stem: "小朱一年級時心情不好就哭鬧或罵人；五年級後已能用深呼吸讓自己平靜。這個轉變與大腦哪一部分成熟較有關？",
    options: ["松果體", "胼胝體", "前額葉", "海馬迴"], answer: 2, region: "額葉／前額葉", concept: "前額葉成熟與自我調節",
    explanation: "正解是前額葉。隨著前額葉控制網絡成熟，兒童更能抑制立即反應、使用規則與調節策略，並根據長期目標選擇行動。",
    neuroMechanism: "深呼吸可改變身體喚醒與內感覺輸入，前額葉則協助維持『先平靜再回應』的策略；兩者是身體調節與高階控制的合作。",
    bookConnection: "書中以生理性嘆息、擴大視野與情緒命名說明：先降低警報，前額葉才較能重新參與（PDF p.47–49）。",
    distractorAnalysis: "松果體偏晝夜節律；胼胝體連結兩半球；海馬迴偏新記憶與情境化。情緒抑制與策略使用最直接連到前額葉。",
    source: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=SrvKpHhIChxP53nTh1ORduGTuFcJIYAfJZtHAvzxWa6q4UZW6_5fkVxvaxzdfooTuuq5gFt5EOVCbGmOOq06CipZPWqd7Lvw931BFQnE9jUYdwg28yUc9C32TrAd4iQ7XNqStdXBHs0QgrnRe4vKk78pTvQMqUW92wlWG99Adt804ZmY2A5L4eb1lLA1LoAde0JppKpJ5yFRzhIE5yDjOQ",
    answerSource: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=Ouz54vnsXJ4xNgxFO3hg5iG6Ehdnq0TpX9lGxTyM-LIkGd8G7zfHAqKpdN0WyGdwYyEtpiCaSQxju-DziI8e6z3XrQVH16DJYrMGUvhrYZqgiLFgc5EXMC1ahN0dIXuOoBGYWXgZh_X2dLTlESTCmF4JvbF2UbHbd62qjUc9RwaCVnOEvNz2wzPjHtA076HETiUw4KHKp9nGDTThBoCyEw",
  },
  {
    id: "114-learner-24", year: 2025, subject: "學習者發展與適性輔導", number: "24",
    stem: "張老師要學生朗讀時，遇到『我』字不要念出，而要拍手代替；多次練習後，小維仍會念出字音。小維最可能哪項訊息處理能力較差？",
    options: ["文字解碼", "執行功能", "再認記憶", "精緻化策略"], answer: 1, region: "執行功能與工作記憶", concept: "抑制控制與規則切換",
    explanation: "正解是執行功能。學生需要維持新規則、抑制已高度自動化的朗讀反應，並以拍手替代，主要考查抑制控制與規則切換。",
    neuroMechanism: "前額葉—頂葉控制網絡與前扣帶共同監控衝突、維持任務規則並抑制優勢反應；自動化越強，替代反應需要越多練習。",
    bookConnection: "《Rewire》以自動性與赫布學習說明：反覆走過的路徑更容易啟動，新規則需多次共同啟動才有競爭力（PDF p.9、p.74）。",
    distractorAnalysis: "學生能看懂並念出『我』，所以文字解碼並非主要問題；再認記憶與精緻化也無法解釋不能抑制舊反應。",
    source: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=SrvKpHhIChxP53nTh1ORduGTuFcJIYAfJZtHAvzxWa6q4UZW6_5fkVxvaxzdfooTuuq5gFt5EOVCbGmOOq06CipZPWqd7Lvw931BFQnE9jUYdwg28yUc9C32TrAd4iQ7XNqStdXBHs0QgrnRe4vKk78pTvQMqUW92wlWG99Adt804ZmY2A5L4eb1lLA1LoAde0JppKpJ5yFRzhIE5yDjOQ",
    answerSource: "https://tqa.rcpet.edu.tw/TEA_Exam/ShowPicOut2.aspx?ASParam=Ouz54vnsXJ4xNgxFO3hg5iG6Ehdnq0TpX9lGxTyM-LIkGd8G7zfHAqKpdN0WyGdwYyEtpiCaSQxju-DziI8e6z3XrQVH16DJYrMGUvhrYZqgiLFgc5EXMC1ahN0dIXuOoBGYWXgZh_X2dLTlESTCmF4JvbF2UbHbd62qjUc9RwaCVnOEvNz2wzPjHtA076HETiUw4KHKp9nGDTThBoCyEw",
  },
];
