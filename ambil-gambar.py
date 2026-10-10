"""Ambil gambar peta dari file HTML lama (yang gambarnya masih base64).
Cara pakai:  python ambil-gambar.py nama-file-lama.html
Hasil: images/peta.jpg
"""
import re, sys, base64
html = open(sys.argv[1], encoding="utf-8").read()
m = re.search(r'data:image/jpeg;base64,([A-Za-z0-9+/=]+)', html)
if not m:
    sys.exit("Gambar base64 tidak ditemukan di file tersebut.")
open("images/peta.jpg", "wb").write(base64.b64decode(m.group(1)))
print("Selesai: images/peta.jpg")
