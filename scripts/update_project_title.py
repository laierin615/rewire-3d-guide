from pathlib import Path

root = Path("/home/ubuntu/rewire-neuroplasticity-story")
old = "Rewire｜神經可塑性互動專書分享"
new = "Rewire｜神經可塑性互動深度閱讀"
for relative in [".project-config.json", "template.json"]:
    path = root / relative
    content = path.read_text(encoding="utf-8")
    if old not in content:
        raise SystemExit(f"Expected title not found in {relative}")
    path.write_text(content.replace(old, new), encoding="utf-8")
    print(f"Updated {relative}")
