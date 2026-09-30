#!/usr/bin/env python3
"""Derive deck assets from design-system/ into decks/.cache/.

- Renders every SVG in design-system/assets/Logos/ to PNG at 2x with cairosvg.
- Converts every .woff2 in design-system/fonts/ to .ttf with fontTools.

Everything in decks/.cache/ is derived; a fresh clone needs only `uv run prepare.py`.
Idempotent: outputs newer than their source are skipped.
"""

from __future__ import annotations

import sys
from pathlib import Path

DECKS = Path(__file__).resolve().parent
REPO = DECKS.parent
LOGOS = REPO / "design-system" / "assets" / "Logos"
FONTS = REPO / "design-system" / "fonts"
CACHE = DECKS / ".cache"
SCALE = 2.0


def stale(src: Path, dst: Path) -> bool:
    return not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime


def render_logos() -> None:
    import cairosvg

    out = CACHE / "logos"
    out.mkdir(parents=True, exist_ok=True)
    for svg in sorted(LOGOS.glob("*.svg")):
        png = out / (svg.stem + ".png")
        if not stale(svg, png):
            continue
        cairosvg.svg2png(url=str(svg), write_to=str(png), scale=SCALE)
        print(f"  {svg.name} -> {png.relative_to(DECKS)}")


def convert_fonts() -> None:
    from fontTools.ttLib import TTFont

    out = CACHE / "fonts"
    out.mkdir(parents=True, exist_ok=True)
    for woff2 in sorted(FONTS.glob("*.woff2")):
        ttf = out / (woff2.stem + ".ttf")
        if not stale(woff2, ttf):
            continue
        font = TTFont(str(woff2))
        font.flavor = None  # strip the woff2 wrapper -> plain sfnt/ttf
        font.save(str(ttf))
        print(f"  {woff2.name} -> {ttf.relative_to(DECKS)}")


def main() -> None:
    for name, path in (("logos", LOGOS), ("fonts", FONTS)):
        if not path.is_dir():
            sys.exit(f"prepare.py: missing {path} — run from a full checkout")
    print("Rendering logos (SVG -> PNG @2x):")
    render_logos()
    print("Converting fonts (woff2 -> ttf):")
    convert_fonts()
    print(f"Done. Assets in {CACHE}")


if __name__ == "__main__":
    main()
