/* =====================================================
   GAMBAR LATAR PETA (base64 JPEG)
   Simpan gambar peta sebagai images/peta.jpg
   ===================================================== */
const IMG = "images/peta.jpg";   // gambar latar peta (taruh file di folder images/)


/* =====================================================
   1. DATA  (EDIT DATA DI BAGIAN INI)
   ===================================================== */

/* 1a. Rentang usia tiap pimpinan: [nama, usiaMin, usiaMax, warna] */
const A = [
  ["PR Tlumpu",          15, 17, "#2563eb"],
  ["PR Karangsari",      15, 20, "#2563eb"],
  ["PR Tanjungsari",     15, 20, "#2563eb"],
  ["PR Pakunden",        13, 21, "#2563eb"],
  ["PK MTs",             14, 14, "#9333ea"],
  ["PK MA",              17, 17, "#9333ea"],
  ["PAC Sukorejo",       19, 21, "#0d9488"],
  ["PAC Kepanjen Kidul", 19, 22, "#0d9488"],
  ["PAC Sananwetan",     17, 19, "#0d9488"],
  ["Pimpinan Cabang",    19, 23, "#334155"]
];

/* 1b. Data per kecamatan
   Kondisi: a = Aktif, s = SP Habis, v = Vakum
   PR : [nama, kondisi, x, y]
   PK : [nama, kondisi, x, y, namaSingkatDiPeta]
   (x,y = posisi titik pada peta 557 x 715)                        */
const D = {
  sukorejo: {
    nama: "Sukorejo",
    usia: "19–21 tahun",
    pac: {
      kondisi: "a", ketua: "Ridho Mayar", ketri: "Devy Putri", masa: "2026–2027",
      sp: "Ada", adm: "Lengkap", keg: "Aktif",
      spHabis: "-", konfer: "-", masalah: "-", butuh: "-"
    },
    PR: [
      ["Tanjungsari", "a", 120, 455],
      ["Karangsari",  "a", 205, 505],
      ["Tlumpu",      "a", 170, 625],
      ["Pakunden",    "a",  95, 335],
      ["Sukorejo",    "v", 150, 545],
      ["Blitar",      "v", 115, 495],
      ["Turi",        "v", 185, 455]
    ],
    PK: [
      ["Mambaul Huda", "a", 90, 400, "Mambaul Huda"]
    ]
  },

  sananwetan: {
    nama: "Sananwetan",
    usia: "17–19 tahun",
    pac: {
      kondisi: "a", ketua: "Ilham", ketri: "Azizah", masa: "2026–2027",
      sp: "Ada", adm: "Tidak ada", keg: "Tidak ada",
      spHabis: "-", konfer: "-", masalah: "Tidak ada pengurus", butuh: "Regenerasi"
    },
    PR: [
      ["Sananwetan",  "v", 440, 385],
      ["Klampok",     "s", 390, 655],
      ["Gedog",       "s", 400, 290],
      ["Rembang",     "v", 310, 610],
      ["Karangtengah","v", 355, 497],
      ["Plosokerep",  "v", 300, 470],
      ["Bendogerit",  "s", 400, 215],
      ["Pukeas",      "s", 370, 570]
    ],
    PK: []
  },

  kepanjenkidul: {
    nama: "Kepanjen Kidul",
    usia: "19–22 tahun",
    pac: {
      kondisi: "a", ketua: "Mahda", ketri: "Sofi", masa: "2024–2026",
      sp: "Ada", adm: "Sebagian", keg: "Jarang",
      spHabis: "November 2026", konfer: "Desember 2026",
      masalah: "Administrasi", butuh: "Pendampingan"
    },
    PR: [
      ["Kepanjenkidul", "v", 290, 415],
      ["Kauman",        "s", 232, 335],
      ["Santren",       "s", 300, 380],
      ["Ngadirejo",     "a", 350,  85],
      ["Sentul",        "v", 418, 112],
      ["Bendo",         "v", 255, 285],
      ["Kepanjenlor",   "v", 275, 350]
    ],
    PK: [
      ["MA Bustanul Muta'alimin",  "a", 318, 235, "MA Bustanul"],
      ["SMP Bustanul Muta'alimin", "a", 318, 300, "SMP Bustanul"],
      ["MTs Ma'arif NU",           "a", 330, 265, "MTs Ma'arif"],
      ["MA Ma'arif NU",            "a", 300, 205, "MA Ma'arif"],
      ["SMK Islam 1 Blitar",       "s", 310, 360, "SMK Islam 1"],
      ["MTs Ma'arif NU Tambakboyo","a", 330, 400, "MTs Tambakboyo"]
    ]
  }
};

/* 1c. Data pengkaderan: [jenis, jumlah, keterangan, warna] */
const K = [
  ["MAKESTA",   514, "Anggota",           "#14b8a6"],
  ["LAKMUD",     25, "Kader Muda",        "#3b82f6"],
  ["LAKUT",       4, "Kader Utama IPPNU", "#8b5cf6"],
  ["LATPEL",      6, "Pelatih",           "#f59e0b"],
  ["DIKLATAMA",  18, "KPP",               "#ec4899"],
  ["DIKLATPEL",   1, "Pelatih",           "#f97316"]
];
const KT = K.reduce((a, b) => a + b[1], 0);   // total kader

/* 1d. Bentuk wilayah kecamatan pada peta (titik polygon) & warnanya */
const P = {
  sukorejo:      [[0,322],[65,258],[150,270],[195,290],[205,325],[240,360],[255,445],[250,520],[285,650],[240,690],[170,700],[100,640],[50,560],[0,430]],
  kepanjenkidul: [[270,30],[440,15],[480,120],[440,200],[345,215],[330,330],[345,440],[255,445],[240,360],[205,325],[195,290],[225,250],[270,170]],
  sananwetan:    [[440,200],[480,120],[500,250],[515,420],[470,520],[420,700],[330,715],[285,650],[250,520],[255,445],[345,440],[330,330],[345,215]]
};
const COL = { sukorejo: "#16a34a", kepanjenkidul: "#ca8a04", sananwetan: "#ea580c" };

/* 1e. Label & warna kondisi */
const L  = { a: "🟢 Aktif", s: "🟡 SP Habis", v: "🔴 Vakum" };
const CL = { a: "#10b981",  s: "#f59e0b",     v: "#ef4444" };
