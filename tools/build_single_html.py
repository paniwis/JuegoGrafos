from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_ROOT = ROOT.parent

html_path = ROOT / "index.html"
css_path = ROOT / "src" / "styles.css"
js_path = ROOT / "src" / "game.js"
output_path = OUT_ROOT / "necroforge.html"

html = html_path.read_text(encoding="utf-8-sig")
css = css_path.read_text(encoding="utf-8-sig")
js = js_path.read_text(encoding="utf-8-sig")

html = html.replace(
    '<link rel="stylesheet" href="src/styles.css">',
    f"<style>\n{css}\n  </style>",
)
html = html.replace(
    '<script src="src/game.js"></script>',
    f"<script>\n{js}\n  </script>",
)

output_path.write_text(html, encoding="utf-8")
print(f"Built {output_path}")
