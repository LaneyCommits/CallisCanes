#!/usr/bin/env python3
"""Convert HEIC/JPEG/PNG images to web-optimized WebP.

Usage:
  .venv-img/bin/python scripts/heic_to_webp.py <input> <output.webp> [max_edge]
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass


def convert(src: Path, dest: Path, max_edge: int = 1600) -> None:
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    im = im.convert('RGB')
    im.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, 'WEBP', quality=82, method=6)


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    max_edge = int(sys.argv[3]) if len(sys.argv) > 3 else 1600
    convert(src, dest, max_edge)
    print(f'OK {dest} ({dest.stat().st_size} bytes)')


if __name__ == '__main__':
    main()
