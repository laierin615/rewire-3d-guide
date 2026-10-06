from pathlib import Path
import re

text_path = Path('/tmp/rewire.txt')
text = text_path.read_text(encoding='utf-8', errors='ignore')
pages = text.split('\f')
terms = [
    '杏仁核', '海馬迴', '海馬', '前額葉', '額葉', '網狀活化系統',
    '負面偏見', '抱怨', '手機', '睡眠', '多巴胺', '皮質醇',
    '神經可塑性', '一起放電', '漸進的常態', '反芻', '習慣迴路',
]
lines = []
for term in terms:
    lines.append(f'\n===== {term} =====')
    count = 0
    for page_no, page in enumerate(pages, 1):
        clean = re.sub(r'\n{3,}', '\n\n', page)
        for match in re.finditer(re.escape(term), clean, flags=re.I):
            start = max(0, match.start() - 260)
            end = min(len(clean), match.end() + 520)
            snippet = clean[start:end].strip().replace('\n', ' ')
            snippet = re.sub(r'\s+', ' ', snippet)
            lines.append(f'[PDF p.{page_no}] {snippet}')
            count += 1
            if count >= 8:
                break
        if count >= 8:
            break
out = Path('/home/ubuntu/rewire-neuroplasticity-story/.book_evidence.txt')
out.write_text('\n'.join(lines), encoding='utf-8')
print(f'wrote {out} with {len(pages)} PDF pages')
