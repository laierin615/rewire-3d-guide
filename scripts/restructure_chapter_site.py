from pathlib import Path

path = Path('/home/ubuntu/rewire-neuroplasticity-story/client/src/pages/Home.tsx')
s = path.read_text(encoding='utf-8')


def replace_once(old: str, new: str, label: str) -> None:
    global s
    if old not in s:
        raise SystemExit(f'Missing target: {label}')
    s = s.replace(old, new, 1)


replace_once('  Activity,\n  ArrowRight,', '  Activity,\n  ArrowLeftRight,\n  ArrowRight,', 'comparison icon import')
replace_once('  Check,\n  ChevronRight,', '  Check,\n  ChevronRight,\n  Columns2,', 'columns icon import')

replace_once(
'''const quizFilters: QuizFilter[] = ["全部", "額葉／前額葉", "海馬迴", "杏仁核", "大腦皮質與側化", "腦幹與注意系統", "執行功能與工作記憶"];
''',
'''const quizFilters: QuizFilter[] = ["全部", "額葉／前額葉", "海馬迴", "杏仁核", "大腦皮質與側化", "腦幹與注意系統", "執行功能與工作記憶"];

const chapterLinks = [
  ["book", "01", "本書"],
  ["evidence", "02", "書中證據"],
  ["brain", "03", "大腦圖譜"],
  ["plasticity", "04", "神經可塑性"],
  ["chapters", "05", "十章深讀"],
  ["tools", "06", "工具脈絡"],
  ["education", "07", "教育連結"],
  ["exam", "08", "教檢題庫"],
] as const;

function withoutPageReference(text: string) {
  return text
    .replace(/（PDF p\\.[^）]+）/g, "")
    .replace(/PDF p\\.[0-9–、，.]+/g, "")
    .replace(/\\s{2,}/g, " ")
    .trim();
}
''',
'chapter links and page stripping helper')

replace_once(
'''  const [activeBrain, setActiveBrain] = useState<BrainRegionId>("frontal");
  const [brainState, setBrainState] = useState<BrainState>("baseline");
''',
'''  const [activeBrain, setActiveBrain] = useState<BrainRegionId>("frontal");
  const [compareMode, setCompareMode] = useState(true);
  const [compareLeft, setCompareLeft] = useState<BrainRegionId>("frontal");
  const [compareRight, setCompareRight] = useState<BrainRegionId>("amygdala");
  const [activeSection, setActiveSection] = useState("book");
  const [brainState, setBrainState] = useState<BrainState>("baseline");
''',
'comparison state')

replace_once(
'''  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.1 });
    document.querySelectorAll(".reveal, .stagger").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
''',
'''  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.1 });
    document.querySelectorAll(".reveal, .stagger").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-24% 0px -62%", threshold: [0.05, 0.2, 0.45] });
    chapterLinks.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
''',
'active chapter observer')

replace_once(
'''  const region = brainRegions.find((item) => item.id === activeBrain) ?? brainRegions[0];
''',
'''  const region = brainRegions.find((item) => item.id === activeBrain) ?? brainRegions[0];
  const leftRegion = brainRegions.find((item) => item.id === compareLeft) ?? brainRegions[0];
  const rightRegion = brainRegions.find((item) => item.id === compareRight) ?? brainRegions[1];
''',
'comparison derived regions')

replace_once(
'''          <nav className="nav-links" aria-label="主要導覽">
            <a href="#book">本書</a>
            <a href="#evidence">書中證據</a>
            <a href="#brain">大腦圖譜</a>
            <a href="#chapters">十章深讀</a>
            <a href="#education">教育連結</a>
            <a className="nav-pill" href="#exam">教檢題庫</a>
          </nav>
        </div>
      </header>

      <main id="top">
''',
'''          <nav className="nav-links" aria-label="快速導覽">
            <a href="#brain">比較腦區</a>
            <a className="nav-pill" href="#exam">練習題庫</a>
          </nav>
        </div>
      </header>
      <nav className={`chapter-dock ${scrolled ? "scrolled" : ""}`} aria-label="章節目錄">
        <div className="chapter-dock-track">{chapterLinks.map(([id, number, label]) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : ""}><span>{number}</span><strong>{label}</strong></a>)}</div>
      </nav>

      <main id="top">
''',
'chapter dock')

replace_once(
'''              <div className="eyebrow hero-kicker">AN INTERACTIVE CLOSE READING OF REWIRE</div>
              <h1 className="hero-title serif" id="hero-title">你的大腦<br /><em>如何改變？</em></h1>
              <p className="hero-lede">從一顆被捧在手中的人腦出發，沿著額葉、杏仁核、海馬迴、注意網絡與突觸可塑性，讀懂《Rewire》如何解釋壓力、習慣、記憶與自我敘事。</p>
''',
'''              <div className="eyebrow hero-kicker">《REWIRE》章節式互動深讀</div>
              <h1 className="hero-title serif" id="hero-title">無論這些信念如何形成，<br /><em>它們都有可能改變。</em></h1>
              <p className="hero-lede">本書從額葉、杏仁核、海馬迴、注意網絡與突觸可塑性出發，說明壓力、習慣、記憶與自我敘事如何被建立，也如何因新經驗而改變。</p>
''',
'hero book quote')

replace_once(
'''              <div className="hero-meta">
                <div className="meta-item"><strong>Nicole Vignola</strong>神經科學家／作者</div>
                <div className="meta-item"><strong>梁永安</strong>中文版譯者</div>
                <div className="meta-item"><strong>293</strong>PDF 頁面</div>
                <div className="meta-item"><strong>10</strong>章完整深讀</div>
              </div>
''',
'''              <div className="hero-meta">
                <div className="meta-item"><strong>Nicole Vignola</strong>神經科學家／作者</div>
                <div className="meta-item"><strong>梁永安</strong>中文版譯者</div>
                <div className="meta-item"><strong>8</strong>章節式閱讀路徑</div>
                <div className="meta-item"><strong>10</strong>章完整深讀</div>
              </div>
''',
'hero metadata')

replace_once(
'''              <div className="section-label eyebrow">01 / BOOK + AUTHOR</div>
              <h2 className="section-title serif">一本從「被編程」<br />追問到「可重組」的書。</h2>
''',
'''              <div className="section-label eyebrow">第一章｜本書與作者</div>
              <h2 className="section-title serif">「我們的習慣和行為，<br />是自己選擇，還是透過環境無意中獲得？」</h2>
''',
'book chapter quote')
replace_once('<div className="book-spine-note"><span className="eyebrow">CORE QUESTION</span><strong className="serif">「我們的習慣和行為，是自己選擇，還是透過環境無意中獲得？」</strong><small>導言，PDF p.4</small></div>', '<div className="book-spine-note"><span className="eyebrow">書中核心提問</span><strong className="serif">「我們的習慣和行為，是自己選擇，還是透過環境無意中獲得？」</strong><small>《Rewire》導言</small></div>', 'book spine page')

replace_once(
'''<div><div className="section-label eyebrow">02 / EVIDENCE FROM THE BOOK</div><h2 className="section-title serif">先讓原文發聲，<br /><span>再解釋它的意義。</span></h2><p className="section-intro">以下短引文均標示使用者提供 PDF 的頁碼；引文保持精簡，旁邊補上脈絡與機制，避免讓一句話脫離整章論證。</p></div>''',
'''<div><div className="section-label eyebrow">第二章｜書中證據</div><h2 className="section-title serif">「但大腦是可塑的，<br /><span>這種情形是可以改變的。」</span></h2><p className="section-intro">每一句書中原文都搭配脈絡與神經機制，避免讓金句離開作者的完整論證。</p></div>''',
'evidence chapter quote')
replace_once('<div className="quote-footer"><span>{bookQuotes[activeQuote].page}</span><div>{bookQuotes.map((quote, index) => <button key={quote.page} aria-label={`查看引文 ${index + 1}`} className={activeQuote === index ? "active" : ""} onClick={() => setActiveQuote(index)} />)}</div></div>', '<div className="quote-footer"><span>《Rewire》書中重點金句</span><div>{bookQuotes.map((quote, index) => <button key={quote.text} aria-label={`查看引文 ${index + 1}`} className={activeQuote === index ? "active" : ""} onClick={() => setActiveQuote(index)} />)}</div></div>', 'quote page display')
replace_once('<div className="example-meta"><span>{bookExamples[activeExample].label}</span><b>{bookExamples[activeExample].page}</b></div>', '<div className="example-meta"><span>{bookExamples[activeExample].label}</span><b>書中案例</b></div>', 'example page display')

replace_once(
'''<div className="reveal"><div className="section-label eyebrow">03 / BRAIN ATLAS</div><h2 className="section-title serif">先認識整體，<br /><span>再走進關鍵腦區。</span></h2><p className="section-intro">大腦不是一組彼此獨立的按鈕。感覺、記憶、情緒與控制，來自皮質、深部結構、腦幹與全腦網絡持續協作。</p></div>
            <div className="foundation-grid stagger">{foundations.map((item) => <article key={item.title}><div>{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p><small>{item.page}</small></article>)}</div>''',
'''<div className="reveal"><div className="section-label eyebrow">第三章｜大腦圖譜</div><h2 className="section-title serif">「大腦並不是<br /><span>一成不變的。」</span></h2><p className="section-intro">感覺、記憶、情緒與控制並非一組彼此獨立的按鈕，而是皮質、深部結構、腦幹與全腦網絡持續協作的結果。</p></div>
            <div className="foundation-grid stagger">{foundations.map((item) => <article key={item.title}><div>{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>''',
'brain chapter quote and foundation pages')
replace_once('<div className="book-evidence"><BookOpen size={16} /><p><strong>書中依據</strong>{region.bookEvidence}<small>{region.page}</small></p></div>', '<div className="book-evidence"><BookOpen size={16} /><p><strong>書中依據</strong>{region.bookEvidence}</p></div>', 'region page display')

comparison_markup = '''
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
'''
replace_once('\n            <div className="state-mechanism reveal">', comparison_markup + '\n            <div className="state-mechanism reveal">', 'comparison lab insertion')
replace_once('<p className="mechanism-source">對照《Rewire》PDF p.26–31、p.45–54。這是為了理解系統互動所做的簡化模型，不用來進行個人醫療判斷。</p>', '<p className="mechanism-source">這是根據《Rewire》相關章節整理的系統互動簡化模型，不用來進行個人醫療判斷。</p>', 'mechanism page reference')

replace_once(
'''<div className="reveal"><div className="section-label eyebrow">04 / NEUROPLASTICITY</div><h2 className="section-title serif">可塑性不是魔法，<br /><span>是連結機率的改變。</span></h2>''',
'''<div className="reveal"><div className="section-label eyebrow">第四章｜神經可塑性</div><h2 className="section-title serif">「一起放電的神經元，<br /><span>會彼此連結。」</span></h2>''',
'plasticity chapter quote')
replace_once('<div className="plasticity-quote"><Quote size={20} /><p className="serif">「一個訊息的重複次數愈多，傳達的路徑就會變得愈強。」<small>PDF p.9</small></p></div>', '<div className="plasticity-quote"><Quote size={20} /><p className="serif">「一個訊息的重複次數愈多，傳達的路徑就會變得愈強。」</p></div>', 'plasticity page display')
replace_once('<div className="container-wide plasticity-principles stagger"><article><strong>長期增強</strong><p>共同啟動與有意義的重複，會提高之後再次啟動的效率。</p><small>PDF p.74</small></article><article><strong>連結減弱</strong><p>舊反應不再被持續配對，連結可逐漸失去優勢；這通常需要時間與替代反應。</p><small>PDF p.71、p.74–75</small></article><article><strong>經驗依賴</strong><p>新奇、重要、具回饋的經驗會提供預測誤差，促使大腦更新記憶與策略。</p><small>PDF p.108、p.120</small></article><article><strong>生理底座</strong><p>睡眠、運動、壓力與注意資源會影響新連結是否有機會被穩定使用。</p><small>PDF p.6、p.214</small></article></div>', '<div className="container-wide plasticity-principles stagger"><article><strong>長期增強</strong><p>共同啟動與有意義的重複，會提高之後再次啟動的效率。</p></article><article><strong>連結減弱</strong><p>舊反應不再被持續配對，連結可逐漸失去優勢；這通常需要時間與替代反應。</p></article><article><strong>經驗依賴</strong><p>新奇、重要、具回饋的經驗會提供預測誤差，促使大腦更新記憶與策略。</p></article><article><strong>生理底座</strong><p>睡眠、運動、壓力與注意資源會影響新連結是否有機會被穩定使用。</p></article></div>', 'plasticity principle pages')

replace_once(
'''<div className="reveal"><div className="section-label eyebrow">05 / CHAPTER-BY-CHAPTER READING</div><h2 className="section-title serif">十章不是十個技巧，<br /><span>而是一條因果鏈。</span></h2>''',
'''<div className="reveal"><div className="section-label eyebrow">第五章｜全書十章深讀</div><h2 className="section-title serif">「無論重複什麼想法和反應，<br /><span>都會加強你腦中的路徑。」</span></h2>''',
'chapters chapter quote')
replace_once('<blockquote className="serif">{activeChapter.evidence}<small>{activeChapter.page}</small></blockquote>', '<blockquote className="serif">{activeChapter.evidence}</blockquote>', 'chapter page display')

replace_once(
'''<div className="container-wide"><div className="reveal"><div className="section-label eyebrow">06 / TOOLS IN CONTEXT</div><h2 className="section-title serif">工具的作用，是改變狀態、<br /><span>提示或重複條件。</span></h2>''',
'''<div className="container-wide"><div className="reveal"><div className="section-label eyebrow">第六章｜工具與情境</div><h2 className="section-title serif">「戰略性休息，<br /><span>可以提高我們的注意力。」</span></h2>''',
'process tools chapter quote')
replace_once('<div className="tool-grid stagger">{tools.map((tool) => <article key={tool.title}><div>{tool.icon}</div><h3>{tool.title}</h3><p>{tool.text}</p><small>{tool.page}</small></article>)}</div>', '<div className="tool-grid stagger">{tools.map((tool) => <article key={tool.title}><div>{tool.icon}</div><h3>{tool.title}</h3><p>{tool.text}</p></article>)}</div>', 'tool page display')

replace_once(
'''<div className="reveal"><div className="section-label eyebrow">07 / EDUCATION</div><h2 className="section-title serif">教育不只是輸入內容，<br />也在設計大腦的學習條件。</h2>''',
'''<div className="reveal"><div className="section-label eyebrow">第七章｜教育連結</div><h2 className="section-title serif">「我希望你撕掉<br /><span>別人給你貼的標籤。」</span></h2>''',
'education chapter quote')

replace_once(
'''<div className="reveal"><div className="section-label eyebrow">08 / TEACHER QUALIFICATION EXAM</div><h2 className="section-title serif">直接考查腦區與神經機制的<br /><span>國小教師檢定題。</span></h2>''',
'''<div className="reveal"><div className="section-label eyebrow">第八章｜教檢題庫</div><h2 className="section-title serif">「你相信什麼，<br /><span>就會看見什麼。」</span></h2>''',
'exam chapter quote')
replace_once('<div><b>連結《Rewire》</b><p>{currentQuestion.bookConnection}</p></div>', '<div><b>連結《Rewire》</b><p>{withoutPageReference(currentQuestion.bookConnection)}</p></div>', 'exam book page display')
replace_once('並連回書中的頁碼與例子。', '並連回書中的觀點與案例。', 'analysis placeholder page wording')

replace_once(
'''<footer className="footer"><div className="container-wide"><div className="footer-grid"><div><div className="eyebrow">REWIRE / CLOSE READING</div><h2 className="serif">理解大腦，<br /><em>不是把人簡化成腦區。</em></h2></div><p>本網站以使用者提供的《Rewire－神經可塑性》PDF 為核心，短引文均標示 PDF 頁碼；神經科學內容用於閱讀與教育討論，不構成醫療診斷或治療建議。</p></div>''',
'''<footer className="footer"><div className="container-wide"><div className="footer-grid"><div><div className="eyebrow">《REWIRE》書中重點金句</div><h2 className="serif">「勇於創造<br /><em>你自己吧。」</em></h2></div><p>本網站以《Rewire－神經可塑性》內容為核心，將書中案例、神經機制與教育議題整理為章節式互動閱讀；內容不構成醫療診斷或治療建議。</p></div>''',
'footer quote and page wording')

path.write_text(s, encoding='utf-8')
print('Updated Home.tsx')
