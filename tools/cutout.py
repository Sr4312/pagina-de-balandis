"""Cut the generated sachets out of their white background and normalise them to the 300:592 frame the CSS expects.

Usage: python tools/cutout.py
Reads assets/img/gen-sachet-*.png, writes assets/img/sachet-*.webp (alpha) and assets/img/og-trio.jpg.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
RATIO = 300 / 592
TARGET_H = 1400
KEY = (0, 255, 0)


def cutout(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    work = im.copy()
    for corner in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        ImageDraw.floodfill(work, corner, KEY, thresh=24)  # Neutral's base (#DEE4E8) is 33 away from white, still safe
    # alpha: 255 where not keyed
    mask = Image.new("L", (w, h), 255)
    px = work.load(); mp = mask.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == KEY:
                mp[x, y] = 0
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = im.copy().convert("RGBA")
    out.putalpha(mask)
    bbox = mask.getbbox()
    out = out.crop(bbox)
    # pad to 300:592 (centred), small margin so the shadow in CSS has room
    cw, ch = out.size
    pad = int(ch * 0.02)
    fw, fh = cw + 2 * pad, ch + 2 * pad
    if fw / fh < RATIO:
        fw = int(fh * RATIO)
    else:
        fh = int(fw / RATIO)
    canvas = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    canvas.paste(out, ((fw - cw) // 2, (fh - ch) // 2), out)
    scale = TARGET_H / fh
    canvas = canvas.resize((round(fw * scale), TARGET_H), Image.LANCZOS)
    canvas.save(dst, "WEBP", quality=88, method=6)
    print(dst.name, canvas.size, f"{dst.stat().st_size // 1024} KB")


for key in ("neutral", "citrus", "peach"):
    cutout(ROOT / "assets" / "ref" / f"gen-sachet-{key}.png", IMG / f"sachet-{key}.webp")

trio = Image.open(ROOT / "assets" / "ref" / "gen-trio.jpg").convert("RGB")
trio.thumbnail((1600, 1600), Image.LANCZOS)
trio.save(IMG / "og-trio.jpg", "JPEG", quality=84, optimize=True, progressive=True)
print("og-trio.jpg", trio.size, f"{(IMG / 'og-trio.jpg').stat().st_size // 1024} KB")
