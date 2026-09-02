#!/usr/bin/env python3
"""Import newly generated dish or festival images into the app.

Usage:
    python tools/quiz-images/import.py <folder> [--dry-run] [--fit auto|cover|blur]

Reads images from <folder> named after the asset they replace:

    dish-samosa.jpg        -> src/assets/mcq2/dish-samosa.jpg.asset.json
    hindi-diwali.jpg       -> src/assets/fest3/hindi-diwali.jpg.asset.json

Each is normalised to 420x300 - the size used by every other image set in the
app (src/assets/ds2) - written over the live file in public/l5e/, and the
`size` field in the matching manifest is resynced.

Fitting (`--fit auto`, the default):
  * source aspect ratio within ~12% of 1.40  -> centre-crop ("cover").
    Trims a sliver; keeps the frame full-bleed.
  * anything further out (portraits, panoramas) -> letterbox onto a blurred
    copy of itself ("blur"). NOTHING is cropped. This matters: a hard crop of
    the 420x180 odia-rath-yatra panorama removes two of its three chariots,
    and a hard crop of the 210x269 portraits cuts off faces.

Nothing under src/ needs editing: asset ids and URLs are unchanged, so the
existing import.meta.glob in src/lib/mcq-data.ts picks the new images up.

Requires Pillow:  pip install pillow
"""
import argparse
import glob
import json
import os
import shutil
import sys

try:
    from PIL import Image, ImageEnhance, ImageFilter
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")

TARGET_W, TARGET_H = 420, 300
TARGET_AR = TARGET_W / TARGET_H
AR_TOLERANCE = 0.12          # within 12% of 1.40 -> safe to centre-crop
EXTS = (".jpg", ".jpeg", ".png", ".webp")

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def manifests():
    """slug -> (manifest path, live image path)"""
    out = {}
    for pattern in ("src/assets/mcq2/dish-*.asset.json",
                    "src/assets/fest3/*.asset.json"):
        for p in sorted(glob.glob(os.path.join(REPO, pattern))):
            p = p.replace("\\", "/")
            slug = os.path.basename(p).replace(".jpg.asset.json", "")
            d = json.load(open(p, encoding="utf-8"))
            live = os.path.join(REPO, "public" + d["url"]).replace("\\", "/")
            out[slug] = (p, live)
    return out


def _flatten(im):
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bed = Image.new("RGBA", im.size, (255, 243, 220, 255))
        im = Image.alpha_composite(bed, im)
    return im.convert("RGB")


def _cover(im, w, h):
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    nw, nh = max(1, round(sw * scale)), max(1, round(sh * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    return im.crop(((nw - w) // 2, (nh - h) // 2, (nw - w) // 2 + w, (nh - h) // 2 + h))


def _contain(im, w, h):
    sw, sh = im.size
    scale = min(w / sw, h / sh)
    return im.resize((max(1, round(sw * scale)), max(1, round(sh * scale))), Image.LANCZOS)


def _sharpen(im, upscaled):
    return im.filter(ImageFilter.UnsharpMask(
        radius=1.1 if upscaled else 1.0,
        percent=95 if upscaled else 55,
        threshold=3))


def normalise(src, dst, fit):
    im = _flatten(Image.open(src))
    before = im.size
    src_ar = before[0] / before[1]

    if fit == "auto":
        fit = "cover" if abs(src_ar - TARGET_AR) / TARGET_AR <= AR_TOLERANCE else "blur"

    if fit == "cover":
        upscaled = before[0] < TARGET_W
        out = _sharpen(_cover(im, TARGET_W, TARGET_H), upscaled)
        bars = "none"
    else:
        bed = _cover(im, TARGET_W, TARGET_H).filter(ImageFilter.GaussianBlur(radius=34))
        bed = ImageEnhance.Brightness(bed).enhance(0.88)
        bed = ImageEnhance.Color(bed).enhance(0.55)
        fg = _contain(im, TARGET_W, TARGET_H)
        fg = _sharpen(fg, fg.size[0] > before[0])
        out = bed.copy()
        out.paste(fg, ((TARGET_W - fg.size[0]) // 2, (TARGET_H - fg.size[1]) // 2))
        bars = "none" if fg.size == (TARGET_W, TARGET_H) else (
            "side" if fg.size[0] < TARGET_W else "top/bottom")

    out = ImageEnhance.Color(out).enhance(1.04)
    os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
    out.save(dst, "JPEG", quality=88, optimize=True, progressive=True)
    return before, src_ar, fit, bars, os.path.getsize(dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", help="folder of images named <slug>.<ext>")
    ap.add_argument("--dry-run", action="store_true", help="report, change nothing")
    ap.add_argument("--fit", choices=("auto", "cover", "blur"), default="auto",
                    help="auto (default): crop only when the ratio is already close")
    args = ap.parse_args()

    known = manifests()
    if not known:
        sys.exit("No manifests found - run this from inside the repo.")

    found, unknown = {}, []
    for f in sorted(os.listdir(args.folder)):
        stem, ext = os.path.splitext(f)
        if ext.lower() not in EXTS:
            continue
        (found.setdefault(stem, os.path.join(args.folder, f))
         if stem in known else unknown.append(f))

    if unknown:
        print("Unrecognised filenames (skipped) - see PROMPTS.md for exact names:")
        for u in unknown:
            print("   ", u)
    if not found:
        sys.exit("\nNothing to import. Names must match a manifest, e.g. "
                 "dish-samosa.jpg or hindi-diwali.jpg")

    print("\n%-30s %-11s %-6s %-6s %-11s %s" % (
        "asset", "source", "ar", "fit", "bars", "result"))
    total = 0
    for slug, src in sorted(found.items()):
        manifest, live = known[slug]

        if args.dry_run:
            with Image.open(src) as im:
                w, h = im.size
            ar = w / h
            fit = args.fit if args.fit != "auto" else (
                "cover" if abs(ar - TARGET_AR) / TARGET_AR <= AR_TOLERANCE else "blur")
            print("%-30s %-11s %-6.2f %-6s %-11s %s" % (
                slug, "%dx%d" % (w, h), ar, fit, "-", "(dry run)"))
            continue

        backup = live + ".bak"
        if not os.path.exists(backup):
            shutil.copy2(live, backup)

        before, ar, fit, bars, nbytes = normalise(src, live, args.fit)

        d = json.load(open(manifest, encoding="utf-8"))
        d["size"] = nbytes
        with open(manifest, "w", encoding="utf-8", newline="\n") as fh:
            json.dump(d, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

        total += nbytes
        print("%-30s %-11s %-6.2f %-6s %-11s %dx%d  %.1f KB" % (
            slug, "%dx%d" % before, ar, fit, bars, TARGET_W, TARGET_H, nbytes / 1024))

    if not args.dry_run:
        print("\nImported %d image(s), %.0f KB total." % (len(found), total / 1024))
        print("Previous versions kept alongside as *.jpg.bak. Once happy:")
        print("   find public/l5e -name '*.bak' -delete")


if __name__ == "__main__":
    main()
