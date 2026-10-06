export type GuideChapter = {
  id: string;
  stage: string;
  no: string;
  title: string;
  en: string;
  summary: string;
  concepts: string;
  question: string;
  takeaway: string;
};

export const guideChapters: GuideChapter[] = [
  {
    id: "intro",
    stage: "intro",
    no: "00",
    title: "導言",
    en: "Introduction",
    summary:
      "作者從大腦如何因經驗改變談起：神經元透過突觸交流，重複的想法與行為逐漸形成省力的自動模式。成人仍能改變，但需有意識地注意並反覆練習。作者以大腦作硬體、思想與習慣作軟體的比喻，提醒我們身體恢復也支援行為改變。",
    concepts:
      "神經可塑性、神經元與突觸、自動性、心理捷思、RAS、硬體／軟體比喻。",
    question: "你每天有哪件事，像刷牙一樣想都不用想就做完了？如果要換個做法，你會怎麼提醒自己？",
    takeaway: "大腦的舊路徑有來處，也有重新練習的空間。",
  },
  {
    id: "break-cycle",
    stage: "stage1",
    no: "1.1",
    title: "打破循環",
    en: "Break the Cycle",
    summary:
      "本章區分短暫而有功能的壓力，與缺乏恢復機會的慢性壓力；說明身體警報、情緒與焦慮如何互相推動，並提出辨認感受及調節反應的方法。",
    concepts: "交感／副交感神經、HPA 軸、杏仁核、情緒命名、焦慮與壓力。",
    question: "最近一次壓力很大的時候，你的身體有什麼感覺？後來，有讓自己真正放鬆下來嗎？",
    takeaway: "先辨認壓力反應，再為身體創造回到基準線的機會。",
  },
  {
    id: "negative-bias",
    stage: "stage1",
    no: "1.2",
    title: "負面偏見",
    en: "Negativity Bias",
    summary:
      "大腦較容易注意與記住負面事件；單一壞消息可能蓋過一整天的好事。本章討論如何看見這種注意偏向，重新架構想法，並練習感激。",
    concepts: "負面偏見、長期增強與抑制、注意力、感恩。",
    question: "今天有哪一件小得意？再小都算。",
    takeaway: "看見負面偏見，才能把注意力重新分配給完整的經驗。",
  },
  {
    id: "thought-power",
    stage: "stage1",
    no: "1.3",
    title: "你的思想的力量",
    en: "The Power of Your Thoughts",
    summary:
      "反覆對自己說的話會影響感受、行為與信念。作者以日常內在對話說明，負面故事若不被察覺，就容易成為習慣性的背景聲。",
    concepts: "自我敘事、內在對話、反芻、思想與身體反應。",
    question: "你最常對自己說的一句話是什麼？說久了，它把你帶往哪裡？",
    takeaway: "先聽見自己的內在語言，才有機會改寫它。",
  },
  {
    id: "creeping-normality",
    stage: "stage1",
    no: "1.4",
    title: "悄悄展開的常態",
    en: "Creeping Normality",
    summary:
      "細小卻反覆發生的傷害或否定，可能被當成「很正常」，久而久之影響自我價值和安全感。本章提醒讀者辨認被忽略的累積經驗。",
    concepts: "微創傷、漸進常態、自我價值、界線。",
    question: "有沒有哪種讓你不舒服的對待，因為一直發生，你已經不覺得奇怪了？",
    takeaway: "反覆的微小經驗也會塑造自我認識，值得被看見。",
  },
  {
    id: "confirmation-bias",
    stage: "stage1",
    no: "1.5",
    title: "確認偏誤：你相信什麼就會看見什麼",
    en: "You’ll See It When You Believe It",
    summary:
      "既有信念像篩選器，影響我們注意哪些訊息、如何解讀他人的行為。本章把記憶模板、注意力過濾與確認偏誤連在一起。",
    concepts: "確認偏誤、RAS、記憶模板、注意力。",
    question: "最近有沒有一件事，你很快就認定了別人的意思？換個角度，還可能是什麼？",
    takeaway: "檢查自己的假設，才能看到舊故事之外的證據。",
  },
  {
    id: "loss-grief",
    stage: "stage1",
    no: "1.6",
    title: "結束、失去與悲傷",
    en: "Endings, Loss and Grief",
    summary:
      "失去會打斷大腦對日常的預測與熟悉感，也可能牽動睡眠、情緒和衝動。作者透過個人經驗談適應新現實與在悲傷中善待自己。",
    concepts: "悲傷、預測與記憶、壓力反應、適應。",
    question: "你是否也曾為一個沒有發生的未來難過？那段時間，你最需要的是什麼？",
    takeaway: "悲傷需要時間；適應新生活並不是否定曾經失去的事。",
  },
  {
    id: "neurotoolkit",
    stage: "stage1",
    no: "1.7",
    title: "神經工具包：如何擺脫負面情緒",
    en: "NeuroToolkit: How to Ditch the Negative",
    summary:
      "階段一的收束：先辨識觸發點與重複放電模式，再用覺察、調節與替代行動，打斷熟悉的負面反應鏈。",
    concepts: "觸發點、神經連結、覺察、情緒調節、替代反應。",
    question: "最近有什麼正學得很吃力？下次卡住時，可以先替哪個小進步慶祝？",
    takeaway: "工具的用途是中斷舊迴路，讓新回應有機會被練習。",
  },
  {
    id: "subconscious",
    stage: "stage2",
    no: "2.0",
    title: "重組你的潛意識",
    en: "Rewire Your Subconscious",
    summary:
      "進入第二階段，作者把焦點從看見舊模式轉向建立新模式：注意力、重複與環境安排共同決定新反應是否能逐漸成為習慣。",
    concepts: "潛意識模式、刻意注意、習慣重組。",
    question: "你想練習的新反應是什麼？身邊的環境比較像在幫你，還是一直把你拉回老路？",
    takeaway: "改變敘事要讓新行動反覆發生，而不只是在心裡想一遍。",
  },
  {
    id: "phone",
    stage: "stage2",
    no: "2.1",
    title: "擱下你的手機",
    en: "Leave Your Phone Alone",
    summary:
      "作者從數位環境與早晨注意力談起，鼓勵清理干擾、避免一起床就被手機帶走，為有意識的選擇保留空間。",
    concepts: "注意力、數位刺激、早晨習慣、環境整理。",
    question: "明天醒來後的第一個十分鐘，你想留給什麼？",
    takeaway: "先把注意力拿回來，才有餘裕練習新的敘事。",
  },
  {
    id: "visualization",
    stage: "stage2",
    no: "2.2",
    title: "視覺化想像與注意力",
    en: "Visualization & Attention",
    summary:
      "本章把清楚描繪想要的行動與主動配置注意力結合。想像不是替代實作，而是幫助大腦辨識下一步與相關線索。",
    concepts: "視覺化、注意力選擇、目標表徵。",
    question: "明天有一件想做的事，能先在腦中彩排一次嗎？連想放棄的那一刻也一起。",
    takeaway: "想像新路徑，然後在現實中給它一次行動機會。",
  },
  {
    id: "repetition",
    stage: "stage2",
    no: "2.3",
    title: "重複",
    en: "Repetition",
    summary:
      "新的反應需要反覆使用才會漸漸省力。作者提醒讀者，短期不熟悉與偶爾回到舊習慣，並不等於改變失敗。",
    concepts: "重複練習、神經路徑、習慣、自動化。",
    question: "到了第五天、快要忘記的時候，什麼可以提醒你？",
    takeaway: "改變不是一次領悟，而是一次又一次地使用新路。",
  },
  {
    id: "make-space",
    stage: "stage2",
    no: "2.4",
    title: "騰出空間",
    en: "Make Space",
    summary:
      "本章的「空間」是觸發與反應之間的一次暫停。愈能察覺自己的自動反應，就愈可能在那一刻選擇不同的行動方向。",
    concepts: "觸發與反應、暫停、覺察、自動反應。",
    question: "下次又被同一件事惹毛時，你想在哪一刻先按下暫停？",
    takeaway: "在觸發與反應之間騰出一秒，就多了一次選擇。",
  },
  {
    id: "boundaries",
    stage: "stage2",
    no: "2.5",
    title: "突破界限",
    en: "Push Through the Boundaries",
    summary:
      "當舊模式鬆動，不熟悉感容易讓人退縮。作者討論如何跨過舒適圈的邊緣，在可承受的挑戰中累積新經驗。",
    concepts: "舒適圈、界線、不適感、逐步練習。",
    question: "你的新土路是哪一條？今天可以替它鋪上哪一塊磚？",
    takeaway: "讓自己跨出可承受的一小步，為大腦提供新的證據。",
  },
  {
    id: "strategy",
    stage: "stage2",
    no: "2.6",
    title: "制定策略和為遇到挫折做好準備",
    en: "Create a Strategy & Prepare for Setbacks",
    summary:
      "光有意願不足以維持改變。本章要求把目標拆成行動計畫，預想阻礙與回復方式，避免一次挫折就把自己判為失敗。",
    concepts: "行動計畫、障礙預想、回復策略、挫折。",
    question: "如果下週有一天沒做到，你的備案是什麼？",
    takeaway: "預備好回到路上的方法，挫折就不必變成終點。",
  },
  {
    id: "fear",
    stage: "stage2",
    no: "2.7",
    title: "跨越恐懼與征服自我破壞",
    en: "Step Through Fear & Conquer Self-Sabotage",
    summary:
      "恐懼可能誘使我們用拖延或自我破壞維持熟悉感。作者主張不必等到完全不怕，仍可用逐步行動走向想要的改變。",
    concepts: "恐懼、自我破壞、逃避、漸進行動。",
    question: "有沒有一件事，你一直說「還沒準備好」？最小的一步會是什麼？",
    takeaway: "勇氣是帶著恐懼行動，讓新經驗慢慢取代舊預測。",
  },
  {
    id: "resilience",
    stage: "stage3",
    no: "3.1",
    title: "運用神經科學提升心靈韌性",
    en: "Increase Mental Resilience",
    summary:
      "韌性不是永遠不受壓，而是面對挑戰後能調節並恢復。作者區分自願、短期與慢性壓力，並談正念與壓力心態。",
    concepts: "心靈韌性、自願壓力、壓力恢復、正念。",
    question: "這陣子，你比較缺的是挑戰，還是休息？",
    takeaway: "韌性包含承受，也包含回復。",
  },
  {
    id: "growth",
    stage: "stage3",
    no: "3.2",
    title: "成長型心態背後的神經科學",
    en: "Growth Mindset",
    summary:
      "把表現等同身分，容易讓失敗變成對自我的威脅。本章以成長型心態重新看待努力、回饋與學習，鼓勵把錯誤視為可用資訊。",
    concepts: "固定型心態、成長型心態、身分認同、學習。",
    question: "最近一次搞砸時，你是不是很快就想成「我就是這樣的人」？",
    takeaway: "一次結果描述的是這次嘗試，不是你的全部能力。",
  },
  {
    id: "muscles",
    stage: "stage3",
    no: "3.3",
    title: "你的肌肉直接與你的大腦溝通",
    en: "Your Muscles Communicate Directly With Your Brain",
    summary:
      "作者重新定位運動：除了體態，它也與腦部健康、情緒、學習和壓力調節有關。重點是找到可持續的活動方式。",
    concepts: "運動、BDNF、海馬體、前額葉皮質、身心連結。",
    question: "有沒有一種活動，是你邊做邊聊天也很開心的？",
    takeaway: "照顧身體，也是為大腦的改變創造條件。",
  },
  {
    id: "sleep",
    stage: "stage3",
    no: "3.4",
    title: "睡眠是你的頭號最優化工具",
    en: "Sleep Is Your Number-One Optimization Tool",
    summary:
      "睡眠協助鞏固白天學到的資訊與新連結；不足的睡眠會影響注意、情緒與持續改變的能力。作者把睡眠視為習慣重組的基礎。",
    concepts: "睡眠、記憶鞏固、REM／非 REM、情緒調節。",
    question: "你的新習慣計畫裡，留給睡覺的時間夠嗎？",
    takeaway: "練習發生在白天，鞏固也仰賴夜裡的恢復。",
  },
  {
    id: "dopamine",
    stage: "stage3",
    no: "3.5",
    title: "多巴胺──你的快樂是在當下",
    en: "Dopamine — Your Happiness Is Now",
    summary:
      "本章區分追逐下一個獎勵的動力與感受當下的滿足，討論即時刺激、努力過程、無聊與「到達後就會快樂」的想像。",
    concepts: "多巴胺、獎勵預期、即時滿足、到達謬誤。",
    question: "你是不是也在等「到了某個目標就會快樂」？今天有什麼已經值得開心？",
    takeaway: "讓努力有方向，也把注意力帶回此刻。",
  },
  {
    id: "self-trust",
    stage: "stage3",
    no: "3.6",
    title: "建立自我信賴和信心",
    en: "Build Self-Trust and Confidence",
    summary:
      "作者認為信心可由自我信賴累積：設定可達成的承諾、對決定負責並逐步做到，會改變我們看待自身能力的方式。",
    concepts: "自我信賴、信心、可實現的目標、信守承諾。",
    question: "今天可以對自己許一個小到一定做得到的承諾嗎？",
    takeaway: "信心可以從一次次守住對自己的小承諾開始。",
  },
  {
    id: "closing",
    stage: "outro",
    no: "04",
    title: "尾聲",
    en: "Outro",
    summary:
      "尾聲以力量、承諾與寬恕收束全書：承認自己有能力改變，同時對反覆、失誤與過去的自己保持理解。",
    concepts: "力量、承諾、寬恕、持續練習。",
    question: "走完這一趟，你最想帶回生活裡的一個小選擇是什麼？",
    takeaway: "改變是持續對自己負責，也容許自己再次開始。",
  },
];
