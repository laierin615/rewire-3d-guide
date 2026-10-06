from pathlib import Path

path = Path('/home/ubuntu/rewire-neuroplasticity-story/client/src/pages/Home.tsx')
s = path.read_text(encoding='utf-8')

s = s.replace('bookRelatedQuestions', 'brainRelatedQuestions')
s = s.replace('REWIRE-RELATED EXAM BANK', 'BRAIN + COGNITION EXAM BANK')
s = s.replace('只練和本書有關的題目。', '只練和大腦相關的題目。')
s = s.replace('精選 <strong>{brainRelatedQuestions.length}</strong> 題與《Rewire》直接相關的教檢題。先選主題，再用 AI 輔助解析把考點連回神經可塑性。', '近十年精選 <strong>{brainRelatedQuestions.length}</strong> 題與大腦、認知、記憶、學習與情緒調節相關的教檢題。先選主題，再用 AI 輔助解析把考點連回《Rewire》的神經可塑性。')
s = s.replace('近十年國小教師資格考試的「教育原理與制度／教育理念與實務」常見概念，能與本書形成很好的交叉閱讀。', '近十年國小教師資格考試中，和大腦、認知、注意力、記憶、學習策略與情緒調節有關的考點，能與《Rewire》形成交叉閱讀。這裡不把考題硬說成神經科學，而是先辨識正式考點，再討論它對教學的啟示。')
s = s.replace('以下題庫包含可核驗的2020、2023年正式題目與2016–2025年度官方查詢索引；題目來源連結均可追溯。', '互動題目取自 2016、2017、2019、2020、2023 年度可核對題本；2016–2025 年則保留教育部官方查詢索引，題目來源連結均可追溯。')
s = s.replace('<tr><td>操作制約</td><td>提示、行為、回饋：如何讓正向路徑更容易出現？</td></tr>', '<tr><td>操作制約</td><td>提示、行為、回饋：如何讓正向路徑更容易出現？</td></tr><tr><td>記憶編碼與提取</td><td>多重編碼、精緻化、間隔練習：如何讓新知識更容易被叫回來？</td></tr><tr><td>後設認知</td><td>計畫、監控、調整：如何把自動反應轉成可選擇的策略？</td></tr>')
s = s.replace('<a href="#session">60分鐘路線</a><a href="#brain">大腦入門</a>', '<a href="#session">60分鐘路線</a><a href="#deepdive">書本深讀</a><a href="#brain">大腦入門</a>')
s = s.replace('<div className="speaker-cue"><Lightbulb size={17} /><span>{sessionActs[activeAct].cue}</span></div><div className="speaker-progress">', '<div className="speaker-cue"><Lightbulb size={17} /><span>{sessionActs[activeAct].cue}</span></div><ul className="speaker-points">{(actNotes[sessionActs[activeAct].title] ?? []).map((point) => <li key={point}>{point}</li>)}</ul><div className="speaker-progress">')
s = s.replace('<div className="speaker-mode-cue"><Lightbulb size={20} /><div><span className="eyebrow">SAY THIS / 講者提示</span><p>{sessionActs[activeAct].cue}</p></div></div>', '<div className="speaker-mode-cue"><Lightbulb size={20} /><div><span className="eyebrow">SAY THIS / 講者提示</span><p>{sessionActs[activeAct].cue}</p><ul className="speaker-mode-points">{(actNotes[sessionActs[activeAct].title] ?? []).map((point) => <li key={point}>{point}</li>)}</ul></div></div>')
s = s.replace('<div className="print-cue"><b>講者提示</b><span>{act.cue}</span></div>', '<div className="print-cue"><b>講者提示</b><span>{act.cue}</span><ul>{(actNotes[act.title] ?? []).map((point) => <li key={point}>{point}</li>)}</ul></div>')

needle = '      <section className="section" id="toolkit">'
insert = '''      <section className="section book-deep-section" id="deepdive"><div className="container-wide"><div className="reveal"><div className="section-label eyebrow">06.5 / BOOK DEEP DIVE</div><h2 className="section-title serif">不只知道名詞，<br /><span>把《Rewire》的論證講完整。</span></h2><p className="section-intro">這一段把全書整理成三個可講述的深層問題：負面循環如何形成、潛意識如何透過新經驗被重寫，以及為什麼睡眠、運動與安全感是改變的生理底座。每個卡片都附有說書重點與教室轉化，方便你在 60 分鐘分享中停下來解釋。</p></div><div className="deep-dive-grid stagger">{bookDeepDives.map((dive) => <article className="deep-dive-card" key={dive.title}><div className="eyebrow">{dive.label}</div><h3 className="serif">{dive.title}</h3><p className="deep-dive-thesis">{dive.thesis}</p><p>{dive.body}</p><ul>{dive.points.map((point) => <li key={point}>{point}</li>)}</ul><div className="deep-classroom"><strong>教室轉化</strong><span>{dive.classroom}</span></div></article>)}</div><div className="deep-guardrail reveal"><div><span className="eyebrow">READ WITH PRECISION</span><h3 className="serif">神經可塑性不是「只要想就能改變」。</h3></div><p>《Rewire》提供的是一個有希望、但也需要條件的框架：注意、重複、環境、睡眠、身體狀態與社會支持都會影響改變。分享時可以同時保留兩句話：大腦具有可塑性；個人的困境也不能被簡化成意志力不足。</p></div><div className="chapter-lecture-heading reveal"><div className="eyebrow">CHAPTER-BY-CHAPTER TALKING POINTS</div><h3 className="serif">十章逐章講點：每章都回答三個問題</h3><p>這些不是把章節縮成一句標語，而是把每章放回「概念 → 生活例子 → 教學轉化」的說書節奏。</p></div><div className="chapter-lecture-grid stagger">{chapters.map((chapter) => <article className="chapter-lecture-card" key={chapter.id}><div className="chapter-lecture-top"><span>{chapter.number}</span><small>{chapter.subtitle}</small></div><h4 className="serif">{chapter.title}</h4><p>{chapterLongNotes[chapter.id]?.takeaway}</p><div className="lecture-block"><b>怎麼理解</b><span>{chapterLongNotes[chapter.id]?.explain}</span></div><div className="lecture-block"><b>可追問</b><span>{chapterLongNotes[chapter.id]?.prompts.join("／")}</span></div><div className="lecture-classroom"><b>帶進教室</b><span>{chapterLongNotes[chapter.id]?.classroom}</span></div></article>)}</div></div></section>\n\n'''
if needle not in s:
    raise SystemExit('deep dive insertion point not found')
s = s.replace(needle, insert + needle, 1)

path.write_text(s, encoding='utf-8')
print('updated', path)
