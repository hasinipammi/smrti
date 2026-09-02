#!/usr/bin/env python3
"""Import newly generated dish images into the app.

Usage:
    python tools/dish-images/import.py <folder> [--dry-run] [--no-grade]

Reads images named `dish-<slug>.(jpg|jpeg|png|webp)` from <folder>, normalises
each to 420x300 (the exact size used by src/assets/ds2), writes it over the
live file in public/l5e/, and resyncs the `size` field in the matching
src/assets/mcq2/dish-<slug>.jpg.asset.json manifest.

Nothing under src/ needs editing: the asset id and URL stay the same, so the
existing import.meta.glob in src/lib/mcq-data.ts picks the new image up.

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
EXTS = (".jpg", ".jpeg", ".png", ".webp")

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def manifests():
    """slug -> (manifest path, live image path)"""
    out = {}
    pattern = os.path.join(REPO, "src", "assets", "mcq2", "dish-*.asset.json")
    for p in sorted(glob.glob(pattern)):
        p = p.replace("\\", "/")
        slug = os.path.basename(p).replace(".jpg.asset.json", "")
        d = json.load(open(p, encoding="utf-8"))
        out[slug] = (p, os.path.join(REPO, "public" + d["url"]).replace("\\", "/"))
    return out


def center_crop_to_ar(im, ar):
    w, h = im.size
    if w / h > ar:
        new_w = int(round(h * ar))
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = int(round(w / ar))
    top = (h - new_h) // 2
    return im.crop((0, top, w, top + new_h))


def normalise(src, dst, grade):
    im = Image.open(src)
    # flatten transparency onto the app's cream so PNGs never import black edges
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 243, 220, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")

    before = im.size
    im = center_crop_to_ar(im, TARGET_AR)
    upscaling = im.size[0] < TARGET_W
    im = im.resize((TARGET_W, TARGET_H), Image.LANCZOS)
    # sharpen harder when we had to upscale a small source
    im = im.filter(ImageFilter.UnsharpMask(
        radius=1.1, percent=95 if upscaling else 60, threshold=3))
    if grade:
        im = ImageEnhance.Color(im).enhance(1.04)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "JPEG", quality=88, optimize=True, progressive=True)
    return before, upscaling, os.path.getsize(dst)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", help="folder containing dish-<slug>.<ext> images")
    ap.add_argument("--dry-run", action="store_true", help="report, change nothing")
    ap.add_argument("--no-grade", action="store_true", help="skip the saturation nudge")
    args = ap.parse_args()

    known = manifests()
    if not known:
        sys.exit("No dish manifests found - run this from inside the repo.")

    found, unknown = {}, []
    for f in sorted(os.listdir(args.folder)):
        stem, ext = os.path.splitext(f)
        if ext.lower() not in EXTS:
            continue
        if stem in known:
            found[stem] = os.path.join(args.folder, f)
        else:
            unknown.append(f)

    if unknown:
        print("Unrecognised filenames (skipped) - see PROMPTS.md for exact names:")
        for u in unknown:
            print("   ", u)
    if not found:
        sys.exit("\nNothing to import. Expected names like: %s" % ", ".join(
            sorted(known)[:3]) + ".jpg")

    print("\n%-22s %-14s %-10s %s" % ("dish", "source", "upscaled?", "result"))
    total = 0
    for slug, src in sorted(found.items()):
        manifest, live = known[slug]
        if args.dry_run:
            with Image.open(src) as im:
                w, h = im.size
            print("%-22s %-14s %-10s %s" % (
                slug, "%dx%d" % (w, h), "yes" if w < TARGET_W else "no",
                "(dry run) -> " + os.path.relpath(live, REPO).replace("\\", "/")))
            continue

        backup = live + ".bak"
        if not os.path.exists(backup):
            shutil.copy2(live, backup)

        before, upscaled, nbytes = normalise(src, live, grade=not args.no_grade)

        d = json.load(open(manifest, encoding="utf-8"))
        d["size"] = nbytes
        with open(manifest, "w", encoding="utf-8", newline="\n") as fh:
            json.dump(d, fh, indent=2, ensure_ascii=False)
            fh.write("\n")

        total += nbytes
        print("%-22s %-14s %-10s %dx%d  %.1f KB" % (
            slug, "%dx%d" % before, "yes" if upscaled else "no",
            TARGET_W, TARGET_H, nbytes / 1024))

    if not args.dry_run:
        print("\nImported %d dish image(s), %.0f KB total." % (len(found), total / 1024))
        print("Previous versions saved alongside as *.jpg.bak - delete them once happy:")
        print("   find public/l5e -name '*.bak' -delete")


if __name__ == "__main__":
    main()
