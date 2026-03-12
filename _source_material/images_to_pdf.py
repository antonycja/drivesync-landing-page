#!/usr/bin/env python3
"""
Convert images to a single compressed PDF.
Supports: JPG, JPEG, PNG, BMP, GIF, TIFF, WEBP

Usage:
    python images_to_pdf.py [OPTIONS] [IMAGE_PATHS...]

Examples:
    python images_to_pdf.py                         # Convert all images in current dir
    python images_to_pdf.py img1.png img2.jpg       # Convert specific files
    python images_to_pdf.py -d ./photos -o out.pdf  # Custom input dir and output file
    python images_to_pdf.py -q 60                   # Lower quality = smaller file
"""

import argparse
import sys
from pathlib import Path

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tiff", ".tif", ".webp"}


def find_images(directory: Path) -> list[Path]:
    images = [
        f for f in sorted(directory.iterdir())
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
    ]
    return images


def convert_images_to_pdf(image_paths: list[Path], output: Path, quality: int) -> None:
    try:
        from PIL import Image
    except ImportError:
        print("Error: Pillow is not installed. Run: pip install Pillow")
        sys.exit(1)

    if not image_paths:
        print("No images found.")
        sys.exit(1)

    print(f"Converting {len(image_paths)} image(s) → {output}")

    pil_images = []
    for path in image_paths:
        print(f"  Loading: {path.name}")
        img = Image.open(path)
        if img.mode in ("RGBA", "P", "LA"):
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")
        pil_images.append(img)

    first, rest = pil_images[0], pil_images[1:]
    output.parent.mkdir(parents=True, exist_ok=True)
    first.save(
        output,
        format="PDF",
        save_all=True,
        append_images=rest,
        optimize=True,
        quality=quality,
    )
    size_kb = output.stat().st_size / 1024
    print(f"Done. Output: {output} ({size_kb:.1f} KB)")


def main():
    parser = argparse.ArgumentParser(description="Convert images to a compressed grouped PDF.")
    parser.add_argument(
        "images", nargs="*", type=Path,
        help="Image files to convert (default: all images in -d directory)"
    )
    parser.add_argument(
        "-d", "--directory", type=Path, default=Path("."),
        help="Directory to scan for images (default: current directory)"
    )
    parser.add_argument(
        "-o", "--output", type=Path, default=Path("output.pdf"),
        help="Output PDF file path (default: output.pdf)"
    )
    parser.add_argument(
        "-q", "--quality", type=int, default=85, choices=range(1, 96),
        metavar="1-95",
        help="JPEG compression quality 1-95 (default: 85, lower = smaller file)"
    )
    args = parser.parse_args()

    if args.images:
        image_paths = []
        for p in args.images:
            if not p.exists():
                print(f"Warning: {p} not found, skipping.")
                continue
            if p.suffix.lower() not in SUPPORTED_EXTENSIONS:
                print(f"Warning: {p} is not a supported image type, skipping.")
                continue
            image_paths.append(p)
    else:
        image_paths = find_images(args.directory)
        if not image_paths:
            print(f"No supported images found in: {args.directory.resolve()}")
            sys.exit(1)

    convert_images_to_pdf(image_paths, args.output, args.quality)


if __name__ == "__main__":
    main()
