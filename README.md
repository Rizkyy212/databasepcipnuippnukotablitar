# Peta Kondisi IPNU-IPPNU Kota Blitar

Dashboard kondisi PAC, PR, dan PK. Murni HTML, CSS, dan JavaScript, tanpa build.

## Struktur
```
index.html        kerangka halaman
css/style.css     tampilan
js/data.js        DATA (edit di sini: pimpinan, kondisi, usia, kader, posisi titik peta)
js/app.js         logika tampilan
images/peta.jpg   gambar latar peta (wajib ada)
ambil-gambar.py   skrip bantu mengambil gambar dari HTML lama
```

## Gambar peta
Simpan gambar peta sebagai `images/peta.jpg`. Kalau masih punya HTML lama:
`python ambil-gambar.py file-lama.html`

## Edit data
Buka `js/data.js`. Kondisi: `a` = Aktif, `s` = SP Habis, `v` = Vakum.

## Pasang di GitHub Pages
1. Buat repository baru, upload semua isi folder ini.
2. Settings -> Pages -> Source: Deploy from a branch -> `main` / `(root)` -> Save.
3. Buka `https://USERNAME.github.io/NAMA-REPO/`.

Catatan: buka lewat GitHub Pages atau server lokal, bukan klik ganda file, supaya gambar peta tampil.
