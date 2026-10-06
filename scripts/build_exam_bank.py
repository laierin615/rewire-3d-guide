from pathlib import Path
import json
import re
import subprocess
import urllib.request

OUT = Path('/home/ubuntu/rewire-neuroplasticity-story/client/src/data')
RAW = Path('/home/ubuntu/rewire-neuroplasticity-story/.exam_raw')
OUT.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

sources = {
    2016: {
        'question': 'https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RKZk16RXdNakEyTWw4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWW4501FG2405XT14JCMK2534ROGGMKVXYTMLFCXWA4VSPPECSWB5PKGCPO4415A4NO41WTXSPKHGICKLICYW1044UXQPFGLKECZSDG20OKROTTYW542100EDXWPK10&cg=10325',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/573781383.pdf'
    },
    2017: {
        'question': 'https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RKZk16RXdNakEyTWw4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWW4501FG2405XT14JCMK2534ROGGMKVXYTMLFCXWA4VSPPECSWB5PKGCPO4415A4NO41WTXSPKHGICKLICYW1044UXQPFGLKECZSDG20OKROTTYW542100EDXWPK10&cg=10325',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/169328641.pdf'
    },
    2019: {
        'question': 'https://cte.nptu.edu.tw/app/index.php?Action=downloadfile&file=WVhSMFlXTm9MekkwTDNCMFlWOHhNVEU0T1RKZk16RXdNakEyTWw4d05ERTNPUzV3WkdZPQ==&fname=LOGGVWOKUS0011XXLOLKTSXTXS30OOKKWS34YSGCNP5110A5YSA4YS5450OKOKSWPOWW4501FG2405XT14JCMK2534ROGGMKVXYTMLFCXWA4VSPPECSWB5PKGCPO4415A4NO41WTXSPKHGICKLICYW1044UXQPFGLKECZSDG20OKROTTYW542100EDXWPK10&cg=10325',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/532573992.pdf'
    },
    2020: {
        'question': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/481109552.pdf',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/564088572.pdf'
    },
    2021: {
        'question': 'https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411111658.pdf',
        'answer': 'https://phpweb.nutn.edu.tw/cte/download/newsFile_20240411111757.pdf'
    },
    2022: {
        'question': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4654/388050732.pdf',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/641698346.pdf'
    },
    2023: {
        'question': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4651/863586584.pdf',
        'answer': 'https://littletree.ndhu.edu.tw/var/file/23/1023/img/4653/484641599.pdf'
    },
}


def download(url, path):
    if path.exists() and path.stat().st_size > 1000:
        return
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=45) as response:
        path.write_bytes(response.read())

for year, pair in sources.items():
    for kind, url in pair.items():
        path = RAW / f'{year}_{kind}.pdf'
        try:
            download(url, path)
            subprocess.run(['pdftotext', '-layout', str(path), str(path.with_suffix('.txt'))], check=False)
        except Exception as exc:
            print(f'WARN {year} {kind}: {exc}')

# Keep a deterministic, transparent index. Full official PDFs remain the canonical source;
# parsed prompts are expanded from verified text where a stable PDF was available.
index = []
for year in range(2016, 2026):
    if year in sources:
        index.append({
            'year': year,
            'status': 'available',
            'question_source': sources[year]['question'],
            'answer_source': sources[year]['answer'],
            'label': '可互動作答：官方／大學師培中心鏡像 PDF'
        })
    else:
        index.append({
            'year': year,
            'status': 'official_lookup',
            'question_source': 'https://tqa.rcpet.edu.tw/TEA_Exam/TEA03.aspx',
            'answer_source': 'https://tqa.rcpet.edu.tw/TEA_Exam/TEA03.aspx',
            'label': '官方歷屆試題查詢：動態下載入口'
        })
(OUT / 'examIndex.json').write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding='utf-8')
print('built', len(index), 'year records')
