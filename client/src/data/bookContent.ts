export type BookQuote = {
  text: string;
  page: string;
  context: string;
};

export type BookExample = {
  id: string;
  label: string;
  title: string;
  page: string;
  scene: string;
  mechanism: string;
  insight: string;
};

export type BrainRegionId = "frontal" | "amygdala" | "hippocampus" | "ras" | "frontoparietal";

export type BrainRegion = {
  id: BrainRegionId;
  label: string;
  english: string;
  role: string;
  location: string;
  underStress: string;
  bookEvidence: string;
  page: string;
  education: string;
  everydayExample: string;
  color: string;
};

export type ChapterStudy = {
  id: string;
  number: string;
  phase: "phase1" | "phase2" | "phase3";
  title: string;
  english: string;
  thesis: string;
  explanation: string;
  example: string;
  evidence: string;
  page: string;
  mechanism: string;
  education: string;
  keywords: string[];
};

export const bookQuotes: BookQuote[] = [
  {
    text: "無論這些信念是如何形成，它們都是有可能改變的。",
    page: "PDF p.4",
    context: "作者把先天、環境與個人選擇放在同一個框架中，強調形成原因不等於永久命運。",
  },
  {
    text: "一起放電的神經元會彼此連結。",
    page: "PDF p.9",
    context: "書中用赫布式學習的簡化語句，說明重複經驗如何讓某條反應路徑變得更容易啟動。",
  },
  {
    text: "但大腦是可塑的，這種情形是可以改變的。",
    page: "PDF p.27",
    context: "這句話接在慢性壓力對額葉皮質、杏仁核與海馬體的影響之後，重點不是否認壓力，而是保留恢復與重組的可能。",
  },
  {
    text: "請記住，無論重複什麼想法和反應都會加強你腦中的路徑。",
    page: "PDF p.71",
    context: "作者把反芻視為一種反覆排演；同樣的可塑性既可能強化負面路徑，也能支持新的注意與回應。",
  },
];

export const bookExamples: BookExample[] = [
  {
    id: "brain-lab",
    label: "導言／第一次觸摸人腦",
    title: "額葉皮質承載的，不只是一個腦區名稱",
    page: "PDF p.3–4",
    scene: "作者回憶大一神經解剖課第一次雙手捧著人腦。她的手指觸到額葉皮質時，想到腦主人一生的記憶、愛、悲傷與選擇，於是追問：我們的習慣究竟是自己選擇，還是環境逐步寫入？",
    mechanism: "額葉皮質參與判斷、規劃、問題解決與抑制控制。作者以這個具體觸感，把抽象的神經結構連回人的生命經驗。",
    insight: "全書由此建立雙重觀點：人會被環境塑造，但也能藉由覺察、經驗與重複，改變日後較容易啟動的反應。",
  },
  {
    id: "low-power",
    label: "壓力／低電量模式",
    title: "疲憊時，大腦會選擇熟路而不是新路",
    page: "PDF p.5、p.26–27",
    scene: "作者在解剖課注意到自己的 iPhone 快沒電，因而想到『低電量模式』：當睡眠不足、壓力過高、能量耗竭時，大腦會優先維持基本功能，也更容易回到早已自動化的舊習慣。",
    mechanism: "慢性壓力會影響額葉調節、杏仁核警覺與海馬體的記憶／壓力回饋。此時需要較多認知資源的新選項，往往輸給阻力最小的熟悉路徑。",
    insight: "書中的硬體／軟體比喻要表達的不是心靈像電腦，而是改變需要生理條件；休息並非偏離改變，而是改變的基礎。",
  },
  {
    id: "complaining",
    label: "習慣／抱怨被朋友指出",
    title: "看不見的自動化，必須先被命名",
    page: "PDF p.19",
    scene: "朋友坦白說作者太愛抱怨，所以不太想約她出門。她才發現自己在屋裡走動時會不斷抱怨、嘆氣，卻幾乎沒有察覺。從記錄每一次抱怨開始，習慣第一次成為可觀察的對象。",
    mechanism: "自動化降低了每次行為的認知成本，因此常在意識介入前就完成。監測與命名能把路徑重新帶回工作記憶，增加插入替代反應的機會。",
    insight: "覺察不是消極觀察，而是改變迴路的第一個可操作節點。",
  },
  {
    id: "smoke-alarm",
    label: "注意／煙霧偵測器",
    title: "大腦不是收進全部資訊，而是持續篩選",
    page: "PDF p.108–109",
    scene: "作者住在姊姊家時，被固定間隔響起的煙霧偵測器吵得睡不著；姊姊卻早已聽不見那個規律聲響，反而會被嬰兒極小的動靜叫醒。",
    mechanism: "書中用網狀活化系統說明重要性篩選：重複、無害且可預測的刺激容易被降低優先級；與照顧目標有關的聲音則仍能穿過篩選。",
    insight: "注意力不是單純的集中能力，也包含大腦依經驗判斷『什麼值得進入意識』。",
  },
  {
    id: "negative-comment",
    label: "負面偏見／一條負評",
    title: "一百個肯定，可能輸給一個威脅線索",
    page: "PDF p.66–71",
    scene: "書中舉例：社群貼文即使收到許多好評，人仍可能在接下來一天甚至一週反覆想著唯一一條負評；室友也會把火車稍微晚點一路串成『整天都很糟』的故事。",
    mechanism: "負面刺激常獲得較高的注意與資訊價值。若反芻持續，負面解釋與身體壓力反應會彼此強化。",
    insight: "目標不是假裝只有好事，而是避免讓單一負面訊息吞沒完整證據。",
  },
  {
    id: "smoking-loop",
    label: "赫布學習／壓力與吸菸",
    title: "當舒解緊跟在壓力之後，連結就會被學會",
    page: "PDF p.74–75",
    scene: "作者以『一感到壓力就想吸菸』說明：若吸菸總在壓力之後出現，短暫舒解會讓大腦把兩者配對，下一次壓力來臨時，吸菸念頭更快浮現。",
    mechanism: "反覆共同啟動可增強突觸效率；若逐步延長刺激與反應之間的距離，並反覆加入替代行為，舊連結可減弱，新連結則有機會增強。",
    insight: "改變不是靠一次拒絕，而是重新安排提示、反應與結果的多次配對。",
  },
  {
    id: "phone-dopamine",
    label: "獎勵／疲累時滑手機",
    title: "快速獎勵會讓新路徑更難競爭",
    page: "PDF p.60–62",
    scene: "作者描述精神枯竭時，人更容易暴食或反覆滑手機，因為大腦會尋找低成本的獎勵與最熟悉的捷徑；她自己避免午休看手機，改用閉眼休息補回注意資源。",
    mechanism: "書中把快速刺激、警覺遞減與多巴胺驅力放在一起。較精確的理解是：多巴胺參與獎勵預測、學習與動機，不只是『快樂化學物質』。",
    insight: "降低高頻刺激、安排真正的休息，可以讓需要努力的新行動重新取得競爭力。",
  },
  {
    id: "emotion-label",
    label: "情緒調節／說出情緒名稱",
    title: "命名把情緒從命令變成資訊",
    page: "PDF p.47–49",
    scene: "書中描述爭吵時徹底爆發、事後甚至記不清細節的情境；作者接著提出生理性嘆息、擴大視野與情緒命名，讓高張狀態逐步下降。",
    mechanism: "強烈情緒下，杏仁核與邊緣系統活動升高，可能抑制前額葉的抑制、比較與彈性選擇。命名情緒需要動員語言與前額葉相關歷程，有助於重新組織反應。",
    insight: "調節不是壓掉情緒，而是恢復足夠的認知空間，讓人能看見不只一個選項。",
  },
];

export const brainRegions: BrainRegion[] = [
  {
    id: "frontal",
    label: "額葉皮質／前額葉",
    english: "FRONTAL & PREFRONTAL CORTEX",
    role: "規劃、決策、抑制衝動、工作記憶、後設認知與錯誤修正。它不是單一『理性按鈕』，而是多個網絡共同完成目標導向控制。",
    location: "位於大腦前部；前額葉皮質是額葉最前端的高階聯合區。",
    underStress: "高壓與疲累時，工作記憶、抑制控制與彈性轉換容易下降，人因而更依賴熟悉反應。",
    bookEvidence: "書中指出前額葉的處理較慢、較深思熟慮，使人能預見情境、理解事件並在犯錯時調整反應。",
    page: "PDF p.26、p.45、p.49",
    education: "要求學生反思、規劃與自我監控前，先降低不確定性與威脅，並把任務拆成可處理的步驟。",
    everydayExample: "收到一封讓人緊張的訊息時，先深呼吸、列出事實與選項，再決定如何回覆，就是讓前額葉重新加入。",
    color: "#ef7658",
  },
  {
    id: "amygdala",
    label: "杏仁核",
    english: "AMYGDALA",
    role: "快速評估情緒顯著性，尤其與威脅、恐懼及安全學習有關；它也參與正向刺激與重要事件，不只是『恐懼中心』。",
    location: "位於內側顳葉深部，屬於邊緣系統的重要結構，左右半球各有一個。",
    underStress: "警報提高時，杏仁核經由下丘腦與 HPA 軸推動交感反應；若長期過度警覺，注意會更偏向威脅線索。",
    bookEvidence: "書中把杏仁核比作快速評估環境刺激的指揮中心，並描述其如何促使皮質醇釋放與戰鬥／逃跑反應。",
    page: "PDF p.27、p.31、p.47",
    education: "羞辱、不可預測與持續高壓會佔用學習資源；清楚規則、可修正錯誤與穩定關係能提供安全線索。",
    everydayExample: "走在昏暗巷口突然聽見身後腳步聲時，心跳先加快、注意力立刻鎖定聲音，常常就是杏仁核先按下警報。",
    color: "#ef7c71",
  },
  {
    id: "hippocampus",
    label: "海馬迴／海馬體",
    english: "HIPPOCAMPUS",
    role: "協助形成新的情節與空間記憶，將經驗放回時間、地點與情境，也參與壓力反應的負回饋。",
    location: "位於內側顳葉，形狀彎曲，與周邊內嗅皮質等記憶網絡密切合作。",
    underStress: "長期高壓可能干擾新記憶形成、情境辨識與壓力反應關閉；一次想不起來不等於記憶永久消失。",
    bookEvidence: "書中指出海馬體對記憶形成與調節壓力反應至關重要，原可在壓力源消失後協助關閉壓力反應。",
    page: "PDF p.27、p.46、p.214",
    education: "使用情境線索、間隔提取與多次回想，讓知識在不同脈絡中重新被啟動，而非只靠重讀製造熟悉感。",
    everydayExample: "考試時一時想不起公式，看到老師曾用過的圖示或回到熟悉情境後，線索一出現，記憶可能就被重新提取。",
    color: "#9474cf",
  },
  {
    id: "ras",
    label: "網狀活化系統",
    english: "RETICULAR ACTIVATING SYSTEM",
    role: "維持清醒與警覺，並與廣泛注意網絡共同影響哪些感覺訊息取得較高優先級。它不是位於一點的單一過濾器。",
    location: "核心位於腦幹網狀結構，向丘腦與大腦皮質廣泛投射。",
    underStress: "過低喚醒會昏沉，過高喚醒會過度掃描威脅；適中的警覺較有利於穩定注意。",
    bookEvidence: "咖啡店談話、機場飛機聲與嬰兒動靜、煙霧偵測器等例子，用來說明大腦會依重要性篩選輸入。",
    page: "PDF p.18、p.108–109",
    education: "用明確目標、對比、提問與新奇但不驚嚇的刺激，讓關鍵訊息從背景中浮現。",
    everydayExample: "在吵雜咖啡店裡，你仍能聽見別人叫自己的名字；大腦會把它判定為重要，讓注意力從背景聲音轉過去。",
    color: "#4e9e91",
  },
  {
    id: "frontoparietal",
    label: "額頂葉控制網絡",
    english: "FRONTOPARIETAL CONTROL NETWORK",
    role: "在額葉與頂葉之間協調注意轉移、工作記憶、複雜問題解決與規則切換，支援彈性的目標導向行為。",
    location: "由分布在外側前額葉與後頂葉等區域的節點構成，是網絡而非單一腦區。",
    underStress: "焦慮會讓資源偏向威脅監測，降低可用於工作記憶與問題解決的容量。",
    bookEvidence: "書中以戶外步行時的橫向眼動為例，連結額頂葉網絡、注意、工作記憶與杏仁核活動的競爭。",
    page: "PDF p.54",
    education: "降低同時處理的項目數，外化步驟與使用視覺提示，可減少工作記憶負荷。",
    everydayExample: "一邊看導航、一邊找停車位又回覆訊息時容易漏看路標；把任務分開，控制網絡就比較有餘裕切換注意力。",
    color: "#c7953c",
  },
];

export const chapters: ChapterStudy[] = [
  {
    id: "negativity",
    number: "01",
    phase: "phase1",
    title: "負面偏見",
    english: "NEGATIVITY BIAS",
    thesis: "大腦優先處理威脅，不代表負面解釋就是完整事實。",
    explanation: "負面刺激通常獲得較高注意與記憶權重。若人反覆回想唯一的壞評價，這條敘事會越來越容易被提取，並影響下一次判斷。",
    example: "社群貼文得到許多好評與一條負評，人卻可能整天只記得那一條；室友也會把火車稍微晚點串成整天倒楣的故事。",
    evidence: "「負面情緒在大腦中引起的反應要比正面情緒大。」",
    page: "PDF p.66–71、p.81",
    mechanism: "威脅優先、注意偏誤、反芻、長期增強／減弱",
    education: "回饋同時指出錯誤、已完成部分與下一步，避免單一負面訊息吞沒學習證據。",
    keywords: ["負面偏見", "威脅優先", "反芻"],
  },
  {
    id: "thoughts",
    number: "02",
    phase: "phase1",
    title: "思想的力量",
    english: "THE POWER OF THOUGHTS",
    thesis: "想法會調整注意力與身體狀態，但不是能控制一切的魔法。",
    explanation: "反覆內在語句會成為注意濾鏡，使符合既有信念的證據更容易被看見；身體也可能因持續想像壓力事件而維持壓力反應。",
    example: "當人先宣告『今天一定很糟』，大腦便更容易搜尋能證明這句話的事件，形成確認偏誤與自我實現預言。",
    evidence: "「你相信什麼就會看見什麼。」",
    page: "PDF p.108–114",
    mechanism: "網狀活化系統、確認偏誤、預測與注意",
    education: "把『我就是不會』改寫成可驗證描述：卡在哪一步、需要什麼線索、下一次怎麼試。",
    keywords: ["確認偏誤", "注意濾鏡", "自我敘事"],
  },
  {
    id: "normality",
    number: "03",
    phase: "phase1",
    title: "漸進的常態",
    english: "CREEPING NORMALITY",
    thesis: "每天只偏移一點點，也足以改變情緒與行為的基準線。",
    explanation: "高頻通知、縮短睡眠、習慣抱怨或長期過量工作，都可能因變化太小而未被察覺，最後被視為『本來就這樣』。",
    example: "作者直到朋友拒絕相約，才發現抱怨與嘆氣已成為自動背景；她從逐次注意每一個抱怨開始改變。",
    evidence: "「承認自己有壞習慣是第一步。」",
    page: "PDF p.19",
    mechanism: "自動化、環境提示、低認知成本",
    education: "觀察一週課堂中的微小刺激，例如等待時間、噪音與任務轉換，再一次調整一個變項。",
    keywords: ["自動化", "微小累積", "覺察"],
  },
  {
    id: "subconscious",
    number: "04",
    phase: "phase2",
    title: "重組潛意識",
    english: "REWIRE THE SUBCONSCIOUS",
    thesis: "潛意識不是神祕黑盒子，而是大量已自動化的預測與反應。",
    explanation: "新的敘事必須與新的行動證據一起出現。看見觸發點、安排替代反應，再讓新經驗重複，才能讓大腦逐步更新『接下來會發生什麼』。",
    example: "父母無意間說『她不擅長數學』，可能被孩子內化成能力判決；同樣的標籤也可被具體成功經驗逐步鬆動。",
    evidence: "「我希望你撕掉別人給你貼的標籤。」",
    page: "PDF p.7–8、p.15–16",
    mechanism: "觀察學習、預測更新、經驗依賴可塑性",
    education: "避免人格化標籤，改用行為與策略證據描述學生目前狀態。",
    keywords: ["潛意識", "標籤", "新證據"],
  },
  {
    id: "space",
    number: "05",
    phase: "phase2",
    title: "重複與戰略性休息",
    english: "REPETITION & STRATEGIC REST",
    thesis: "重複讓路徑變熟，戰略性休息支援注意恢復；〈騰出空間〉則著重觸發與反應間的暫停。",
    explanation: "有效重複不是把資訊塞得更密，而是讓同一概念在不同時間被重新提取；真正休息也能減少警覺遞減。",
    example: "作者避免午休時間看手機，有時閉眼但不睡著，讓大腦重新分配能量；她也指出狗在持續訓練一段時間後會因注意下降而開始犯錯。",
    evidence: "「戰略性休息可以提高我們的注意力。」",
    page: "PDF p.60–62",
    mechanism: "警覺遞減、間隔練習、提取、睡眠整合",
    education: "用短輸入—主動提取—回饋—間隔再提取，取代長時間單向輸入。",
    keywords: ["間隔", "提取", "警覺遞減"],
  },
  {
    id: "boundaries",
    number: "06",
    phase: "phase2",
    title: "突破界線",
    english: "PUSH THE BOUNDARIES",
    thesis: "可恢復的挑戰會提供『我能處理』的新證據；過度威脅只會加深逃避。",
    explanation: "舒適圈可被逐步擴張，但劑量很重要。任務需要明確、可拆分且有回饋，才能形成成功預測，而不是再度確認失敗敘事。",
    example: "書中以公開表現、運動與新目標說明：先把挑戰拆到願意開始的大小，再讓完成經驗成為下一次嘗試的記憶模板。",
    evidence: "「勇於創造你自己吧。」",
    page: "PDF p.8、第二階段相關章節",
    mechanism: "壓力劑量、自我效能、預測誤差",
    education: "同一學習目標提供不同入口與難度，讓學生累積可辨認的進步證據。",
    keywords: ["可恢復挑戰", "自我效能", "預測更新"],
  },
  {
    id: "setbacks",
    number: "07",
    phase: "phase2",
    title: "挫折與自我破壞",
    english: "SETBACKS & SABOTAGE",
    thesis: "退回舊習慣不等於全部歸零，而是舊路徑在特定條件下仍較有優勢。",
    explanation: "疲累、壓力、酒精、社群媒體與全有全無信念，都可能讓舊反應再次取得優先權。挫折可被拆成提示、反應、短期獎勵與長期代價。",
    example: "書中把『壓力後吸菸』拆成共同啟動的神經連結：壓力是提示，吸菸是反應，短暫舒解是強化結果。",
    evidence: "「分開放電的神經元會互不相干。」",
    page: "PDF p.74–75、p.141",
    mechanism: "習慣迴路、長期增強、消退與替代反應",
    education: "訂正時除答案外，再記錄觸發錯誤的線索與下一次替代策略。",
    keywords: ["習慣迴路", "復發", "替代反應"],
  },
  {
    id: "resilience",
    number: "08",
    phase: "phase3",
    title: "提升心理韌性",
    english: "MENTAL RESILIENCE",
    thesis: "韌性不是永不受壓，而是能從動員狀態回到基準線。",
    explanation: "急性壓力可提高警覺與反應；真正的問題是壓力源消失後，反芻仍讓身體持續像威脅存在。恢復能力因此和承受能力同樣重要。",
    example: "作者描述下班後持續反芻衝突，皮質醇可能不易下降；投入嗜好能轉移注意，給副交感調節與恢復留下機會。",
    evidence: "「你永遠無法避免壓力，我們也不應該嘗試這樣做。」",
    page: "PDF p.34、p.38–39、p.193",
    mechanism: "HPA 軸、交感／副交感平衡、恢復",
    education: "建立可被使用的暫停、求助與重來機制，讓壓力反應有結束點。",
    keywords: ["恢復", "副交感", "韌性"],
  },
  {
    id: "growth",
    number: "09",
    phase: "phase3",
    title: "成長心態",
    english: "GROWTH MINDSET",
    thesis: "可塑性提供可能，策略、時間與回饋才把可能變成路徑。",
    explanation: "只說『我做得到』不足以更新大腦；需要把目標變成可反覆完成的行動，並讓成功、錯誤與修正產生新的預測。",
    example: "作者舉夏奇拉曾被形容歌聲像山羊、其他成功女性也曾被否定的例子，說明早期評價不是能力的最終定稿。",
    evidence: "「你可以在任何年齡做出改變。」",
    page: "PDF p.7–10",
    mechanism: "經驗依賴可塑性、回饋、自我效能",
    education: "回饋策略與進步證據，而非只稱讚天賦或努力。",
    keywords: ["策略", "回饋", "能力可發展"],
  },
  {
    id: "optimization",
    number: "10",
    phase: "phase3",
    title: "運動、睡眠與最佳化",
    english: "MUSCLES, SLEEP & OPTIMIZATION",
    thesis: "沒有穩定的生理底座，大腦就難以維持注意、記憶與抑制控制。",
    explanation: "睡眠參與記憶整合與情緒調節；規律活動與 BDNF、灰質及學習表現相關。這些條件不保證改變，但會改變新路徑成功競爭的機率。",
    example: "書中指出有氧適能較高的少年有較大的海馬體灰質體積，認知測驗表現也較好，並把運動視為可支援情緒與可塑性的日常條件。",
    evidence: "「我們可以透過充足的睡眠和固定的運動來確保我們的硬體處於良好的運作狀態。」",
    page: "PDF p.6、p.214",
    mechanism: "睡眠整合、BDNF、灰質、海馬體與前額葉",
    education: "把課間活動、作息、光線與節奏視為學習設計，而不是與學習無關的附加項。",
    keywords: ["睡眠", "運動", "BDNF"],
  },
];

export const phaseLabels = {
  all: "全部章節",
  phase1: "階段一｜擺脫負面情緒",
  phase2: "階段二｜改變你的敘事",
  phase3: "階段三｜增強積極性",
} as const;
