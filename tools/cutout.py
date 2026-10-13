"""Cut the generated sticks out of their white background and normalise them to the 300:1080 frame the CSS expects.

Usage: python tools/cutout.py [rojos lima neutro]
Reads assets/ref/gen-stick-<key>.png, writes assets/img/stick-<key>.webp (alpha).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
RATIO = 300 / 1080
TARGET_H = 1400
KEY = (0, 255, 0)
# Flood threshold per flavour: Neutro's printed colour (#ECE8DF) is close to white, so it gets a tighter key.
THRESH = {"rojos": 26, "lima": 26, "neutro": 14}


def cutout(src: Path, dst: Path, thresh: int) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    work = im.copy()
    for corner in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        ImageDraw.floodfill(work, corner, KEY, thresh=thresh)
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
    # pad to 300:1080 (centred), small margin so the shadow in CSS has room
    cw, ch = out.size
    pad = int(ch * 0.015)
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


keys = sys.argv[1:] or ["rojos", "lima", "neutro"]
for key in keys:
    cutout(ROOT / "assets" / "ref" / f"gen-stick-{key}.png", IMG / f"stick-{key}.webp", THRESH.get(key, 24))
