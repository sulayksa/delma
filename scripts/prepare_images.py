"""Converts the company's original photos into web-ready WebP (full + 800px) in public/img.
Usage: python3 scripts/prepare_images.py <source_root>"""
import sys, os
from PIL import Image, ImageOps
SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
os.makedirs(OUT, exist_ok=True)
Z = 'co/zip/دلما/ابواب wpc/'
M = {
  # showroom & headquarters
  'showroom-hall': 'delma-ad/public/img/s23.jpg', 'showroom-wide': 'delma-ad/public/img/s11.jpg', 'showroom-corner': 'delma-ad/public/img/s14.jpg',
  'showroom-1': 'delma-ad/public/img/s16.jpg', 'showroom-2': 'delma-ad/public/img/s17.jpg', 'showroom-3': 'delma-ad/public/img/s18.jpg',
  'showroom-4': 'delma-ad/public/img/s19.jpg', 'showroom-5': 'delma-ad/public/img/s20.jpg', 'showroom-6': 'delma-ad/public/img/s21.jpg',
  'showroom-7': 'delma-ad/public/img/s12.jpg', 'showroom-8': 'delma-ad/public/img/s15.jpg',
  'hq-building': 'hq/wide2.jpg', 'hq-sign': 'hq/sign2.jpg',
  # WPC models (studio shots from the company)
  'wpc-plain-white': 'delma-ad/public/img/d_white.jpg', 'wpc-plain-wood': 'delma-ad/public/img/d_wood.jpg',
  'wpc-carved': 'delma-ad/public/img/d_cream.jpg', 'wpc-glass': 'delma-ad/public/img/d_glass_room.jpg',
  'wpc-decor': 'delma-ad/public/img/d_inlay.jpg', 'wpc-double': 'delma-ad/public/img/d_double.jpg',
  'wpc-walnut': 'delma-ad/public/img/d_ang_walnut.jpg', 'wpc-grey': 'delma-ad/public/img/d_ang_grey.jpg', 'wpc-oak': 'delma-ad/public/img/d_ang_oak.jpg',
  'wpc-corner': 'delma-ad/public/img/corner_a.jpg', 'wpc-corner-b': 'delma-ad/public/img/corner_b.jpg',
  'wpc-profile': 'delma-ad/public/img/profile_a.jpg', 'wpc-profile-b': 'delma-ad/public/img/profile_b.jpg',
  # installed work
  'work-wpc-1': 'img/wpc_wpc_12.jpg', 'work-wpc-2': 'img/wpc_wpc_15.jpg', 'work-wpc-3': 'img/wpc_wpc_4.jpg', 'work-wpc-4': 'img/wpc_wpc_7.jpg',
  'upvc-sliding-door': 'img/windows_windows_1.jpg', 'upvc-window-row': 'img/windows_windows_3.jpg',
  'upvc-glass-door': 'img/upvc_upvc_6.jpg', 'upvc-panel-door': 'img/upvc_upvc-door4.jpg',
  'upvc-arch': 'delma-ad/public/img/u0.jpg', 'upvc-arch-pair': 'delma-ad/public/img/u1.jpg', 'upvc-arch-sliding': 'delma-ad/public/img/u2.jpg',
  'upvc-arch-tall': 'delma-ad/public/img/u3.jpg', 'upvc-tilt': 'delma-ad/public/img/u4.jpg', 'upvc-sliding': 'delma-ad/public/img/u5.jpg',
  'upvc-casement-wood': 'delma-ad/public/img/u6.jpg', 'upvc-casement': 'delma-ad/public/img/u7.jpg',
  # aluminium & glass
  'alu-structure': 'img/structure.jpg',
}
def save(name, im):
    im = ImageOps.exif_transpose(im).convert('RGB')
    w, h = im.size
    full = im if w <= 1800 else im.resize((1800, round(h * 1800 / w)), Image.LANCZOS)
    full.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=80, method=6)
    if w > 900:
        sm = im.resize((800, round(h * 800 / w)), Image.LANCZOS)
        sm.save(os.path.join(OUT, name + '-800.webp'), 'WEBP', quality=78, method=6)
    return full.size
sizes = {}
for k, v in M.items():
    sizes[k] = save(k, Image.open(os.path.join(SRC, v)))
# u7 has a phone status bar at the top — trim it
im = Image.open(os.path.join(SRC, M['upvc-casement'])); w, h = im.size; sizes['upvc-casement'] = save('upvc-casement', im.crop((0, int(h * 0.12), w, h)))
# WPC colour catalogue P01–P19: remove the printed label strip at the bottom
os.makedirs(os.path.join(OUT, 'colors'), exist_ok=True)
for i in range(1, 20):
    im = Image.open(os.path.join(SRC, f'img/wpc_colors_catalog_delma_{i:03d}.jpg')).convert('RGB'); w, h = im.size
    im = im.crop((0, 0, w, int(h * 0.86)))
    im.resize((900, round(im.size[1] * 900 / w)), Image.LANCZOS).save(os.path.join(OUT, 'colors', f'P{i:02d}.webp'), 'WEBP', quality=82, method=6)
    im.resize((360, round(im.size[1] * 360 / w)), Image.LANCZOS).save(os.path.join(OUT, 'colors', f'P{i:02d}-sm.webp'), 'WEBP', quality=78, method=6)
import json; json.dump({k: list(v) for k, v in sizes.items()}, open(os.path.join(OUT, 'sizes.json'), 'w'), indent=0)
print('done', len(sizes))
