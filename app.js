/* =====================================================
   2. FUNGSI BANTU
   ===================================================== */
const ks = Object.keys(D);                                   // daftar kunci kecamatan
const el = id => document.getElementById(id);

/* badge kondisi */
const badge = k => `<span class="b ${k}">${L[k]}</span>`;

/* hitung jumlah per kondisi dari daftar [nama, kondisi, ...] */
const cnt = list => {
  const c = { a: 0, s: 0, v: 0 };
  list.forEach(i => c[i[1]]++);
  return c;
};

/* semua PR + PK pada satu kecamatan */
const all = k => [...D[k].PR, ...D[k].PK];

/* persentase 1 desimal */
function pc2(a, b) { return Math.round(a / b * 1000) / 10; }

/* usia suatu pimpinan (tipe "PR"/"PK", nama) -> teks, atau null */
const usia = (t, n) => {
  const f = A.find(a => a[0] == t + " " + n);
  if (f) return f[1] == f[2] ? f[1] : f[1] + "–" + f[2];
  return t == "PK" ? (/^MTs/.test(n) ? "14" : /^MA /.test(n) ? "17" : null) : null;
};

/* kumpulan total */
const PRall = ks.flatMap(k => D[k].PR);
const PKall = ks.flatMap(k => D[k].PK);
const ALL   = [...PRall, ...PKall];
const T     = cnt(ALL);
const tot   = ALL.length;

/* bar bertumpuk aktif/sp/vakum */
const sbar = (c, n) =>
  `<div class="sbar">${["a", "s", "v"].filter(k => c[k]).map(k =>
    `<i style="width:${c[k] / n * 100}%;background:${CL[k]}">${c[k]}</i>`
  ).join("")}</div>`;

/* donut kecil untuk panel detail */
function dn(c, n) {
  let offset = 0, arcs = "";
  ["a", "s", "v"].forEach(k => {
    if (!c[k]) return;
    const len = c[k] / n * 314.16;
    arcs += `<circle r="50" cx="70" cy="70" fill="none" stroke="${CL[k]}" stroke-width="22" stroke-dasharray="${len - 1.5} 314.16" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"/>`;
    offset += len;
  });
  return `<svg viewBox="0 0 140 140" style="width:120px;flex:none">${arcs}<text x="70" y="76" text-anchor="middle" font-size="22" font-weight="800" fill="currentColor">${n}</text></svg>`;
}


/* =====================================================
   3. KARTU STATISTIK ATAS
   ===================================================== */
el("stats").innerHTML = [
  ["Total Pimpinan", tot + 3,        "3 PAC + 22 PR + 7 PK", "c0"],
  ["🟢 Aktif",        T.a,            "",                     "c1"],
  ["🟡 SP Habis",     T.s,            "",                     "c2"],
  ["🔴 Vakum",        T.v,            "",                     "c3"],
  ["PAC",            3,              "kecamatan",            "cpac"],
  ["PR",             PRall.length,   "Pimpinan Ranting",     "cpr"],
  ["PK",             PKall.length,   "Pimpinan Komisariat",  "cpk"],
  ["Total Kader",    568,            "semua jenjang",        "ckd"]
].map(s => `<div class="card st ${s[3]}"><span>${s[0]}</span><b>${s[1]}</b><span>${s[2]}</span></div>`).join("");


/* =====================================================
   4. TABEL TOTAL PIMPINAN CABANG
   ===================================================== */
el("sum").innerHTML = `
<thead><tr>
  <th class="n">No</th><th>PAC</th><th class="n">Status PAC</th>
  <th class="n hpr">PR</th><th class="n hpk">PK</th><th class="n">Total PR PK</th>
  <th class="n">🟢 Aktif</th><th class="n">🟡 SP Habis</th><th class="n">🔴 Vakum</th>
</tr></thead>
<tbody>` +
ks.map((k, i) => {
  const c = cnt(all(k));
  return `<tr class="cl" onclick="show('${k}')">
    <td class="n">${i + 1}</td>
    <td><b>PAC ${D[k].nama}</b></td>
    <td class="n">${badge(D[k].pac.kondisi)}</td>
    <td class="n"><span class="t pr">${D[k].PR.length}</span></td>
    <td class="n"><span class="t pk">${D[k].PK.length}</span></td>
    <td class="n"><b>${all(k).length}</b></td>
    <td class="n">${c.a}</td><td class="n">${c.s}</td><td class="n">${c.v}</td>
  </tr>`;
}).join("") +
`</tbody>
<tfoot><tr>
  <td></td>
  <td>Total Semua Pimpinan PC<br><span class="sub" style="font-weight:400">(PAC - PR - PK)</span></td>
  <td></td>
  <td class="n"><span class="t pr">${PRall.length}</span></td>
  <td class="n"><span class="t pk">${PKall.length}</span></td>
  <td class="n">${tot + 3}*</td>
  <td class="n">${T.a}</td><td class="n">${T.s}</td><td class="n">${T.v}</td>
</tr></tfoot>`;

/* catatan di bawah tabel */
el("sum").closest(".tw").insertAdjacentHTML("afterend",
  '<p class="sub" style="margin:8px 2px 0">* Total 32 = 3 PAC + 22 PR + 7 PK. Jumlah per kondisi (11 aktif, 7 SP habis, 11 vakum) dihitung untuk 29 pimpinan PR dan PK.</p>');


/* =====================================================
   5. GRAFIK RINGKAS (donut, PR vs PK, per PAC)
   ===================================================== */

/* 5a. Donut kondisi seluruh pimpinan */
(function () {
  let offset = 0, arcs = "";
  ["a", "s", "v"].forEach(k => {
    const len = T[k] / tot * 314.16;
    arcs += `<circle r="50" cx="70" cy="70" fill="none" stroke="${CL[k]}" stroke-width="22" stroke-dasharray="${len - 1.5} ${314.16 - len + 1.5}" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"/>`;
    offset += len;
  });
  el("donut").innerHTML = `
    <svg viewBox="0 0 140 140">${arcs}
      <text x="70" y="72" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor">${tot}</text>
      <text x="70" y="88" text-anchor="middle" font-size="9" fill="#888">PR + PK</text>
    </svg>
    <div class="lg">${["a", "s", "v"].map(k =>
      `<div><span class="dot" style="background:${CL[k]}"></span>${L[k].slice(3)}: <b>${T[k]}</b> (${Math.round(T[k] / tot * 100)}%)</div>`
    ).join("")}</div>`;
})();

/* 5b. PR vs PK */
el("prpk").innerHTML =
  [["PR", "pr", PRall], ["PK", "pk", PKall]].map(([nama, cls, list]) => `
    <div class="sb">
      <div class="l"><span><span class="t ${cls}">${nama}</span></span><b>${list.length}</b></div>
      ${sbar(cnt(list), list.length)}
    </div>`).join("") +
  `<p class="sub">PR terbanyak vakum, sedangkan PK hampir seluruhnya aktif.</p>`;

/* 5c. Kondisi per PAC */
el("perpac").innerHTML = ks.map(k => {
  const c = cnt(all(k)), n = all(k).length;
  return `
    <div class="sb">
      <div class="l"><span>PAC ${D[k].nama}</span><b>${n}</b></div>
      ${sbar(c, n)}
      <div class="sub" style="font-size:.76rem;margin-top:3px">🟢 ${pc2(c.a, n)}% · 🟡 ${pc2(c.s, n)}% · 🔴 ${pc2(c.v, n)}%</div>
    </div>`;
}).join("");


/* =====================================================
   6. PETA
   ===================================================== */

/* 6a. Kumpulkan semua titik (PR & PK) */
const N = [];
ks.forEach(k => {
  [
    ...D[k].PR.map(i => ["PR", ...i]),
    ...D[k].PK.map(i => ["PK", ...i])
  ].forEach(it => N.push({
    k,
    t:  it[0],              // tipe: PR / PK
    n:  it[1],              // nama
    st: it[2],              // kondisi
    x:  it[3],
    y:  it[4],
    sh: it[5] || it[1]      // nama singkat untuk label
  }));
});

/* 6b. Dorong titik yang saling bertumpuk (jarak minimal 28) */
for (let r = 0; r < 80; r++) {
  for (let a = 0; a < N.length; a++) {
    for (let b = a + 1; b < N.length; b++) {
      const dx = N[b].x - N[a].x, dy = N[b].y - N[a].y;
      const d = Math.hypot(dx, dy) || .1;
      if (d < 28) {
        const m = (28 - d) / 2, ux = dx / d, uy = dy / d;
        N[a].x -= ux * m;  N[a].y -= uy * m;
        N[b].x += ux * m;  N[b].y += uy * m;
      }
    }
  }
}

/* 6c. Tentukan posisi label supaya tidak menabrak titik / label lain */
const boxes = [];
N.forEach(n => boxes.push([n.x - 10, n.y - 10, n.x + 10, n.y + 10]));

const collides = b =>
  b[0] < 4 || b[2] > 553 ||
  boxes.some(o => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]);

N.forEach(n => {
  const w = n.sh.length * 5.8 + 4;
  const options = [
    [n.x + 12, n.y + 4,  "start",  [n.x + 11,     n.y - 7,  n.x + 12 + w,  n.y + 8 ]],   // kanan
    [n.x - 12, n.y + 4,  "end",    [n.x - 12 - w, n.y - 7,  n.x - 11,      n.y + 8 ]],   // kiri
    [n.x,      n.y + 24, "middle", [n.x - w / 2,  n.y + 12, n.x + w / 2,   n.y + 27]],   // bawah
    [n.x,      n.y - 14, "middle", [n.x - w / 2,  n.y - 26, n.x + w / 2,   n.y - 12]]    // atas
  ];
  const pick = options.find(o => !collides(o[3])) || options[0];
  boxes.push(pick[3]);
  n.lx = pick[0];  n.ly = pick[1];  n.an = pick[2];
});

/* 6d. Susun SVG peta */
let svg = `
<rect width="557" height="715" rx="14" fill="#0c1812"/>
<defs>
  <filter id="bl" color-interpolation-filters="sRGB">
    <feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .83  0 0 0 0 .6  -.33 -.59 -.11 0 1"/>
  </filter>
</defs>
<image href="${IMG}" x="0" y="0" width="557" height="715" opacity=".55" filter="url(#bl)"/>`;

/* wilayah kecamatan */
svg += ks.map((k, i) =>
  `<polygon class="reg" data-k="${k}" points="${P[k].join(" ")}" style="fill:${COL[k]};stroke:${COL[k]};animation:fi .9s ${i * .2}s backwards"/>`
).join("");

/* titik PR (lingkaran) & PK (kotak) + label */
N.forEach((n, i) => {
  const warna = CL[n.st];
  const tip   = `${n.t} ${n.n} · ${L[n.st]}`;
  const anim  = `animation:pop .5s ${.5 + i * .035}s backwards`;

  svg += n.t == "PR"
    ? `<circle class="nd" data-k="${n.k}" data-t="${tip}" cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="8" fill="${warna}" style="${anim}"/>`
    : `<rect class="nd" data-k="${n.k}" data-t="${tip}" x="${(n.x - 8).toFixed(1)}" y="${(n.y - 8).toFixed(1)}" width="16" height="16" rx="3" fill="${warna}" style="stroke:#c084fc;stroke-width:2.5;${anim}"/>`;

  svg += `<text class="nl" x="${n.lx.toFixed(1)}" y="${n.ly.toFixed(1)}" text-anchor="${n.an}" style="${n.t == "PK" ? "fill:#d8b4fe;" : ""}animation:fi .5s ${.7 + i * .035}s backwards">${n.sh}</text>`;
});

/* plakat nama kecamatan di sisi kiri peta */
ks.forEach((k, i) => {
  const cx = 82, y = 34 + i * 68;
  const c = cnt(all(k)), pk = D[k].pac.kondisi;
  svg += `
  <g class="pl" data-k="${k}" style="cursor:pointer;animation:sl .6s ${i * .12}s backwards">
    <rect x="${cx - 75}" y="${y - 16}" width="150" height="62" rx="10" fill="${COL[k]}"/>
    <text x="${cx}" y="${y}" text-anchor="middle" fill="#fff" font-size="11.5" font-weight="800">KEC. ${D[k].nama.toUpperCase()}</text>
    <text x="${cx}" y="${y + 14}" text-anchor="middle" fill="#fff" font-size="9.5">${D[k].PR.length} PR · ${D[k].PK.length} PK · 🟢${c.a} 🟡${c.s} 🔴${c.v}</text>
    <rect x="${cx - 48}" y="${y + 22}" width="96" height="17" rx="8" fill="${CL[pk]}" stroke="#0a1511"/>
    <text x="${cx}" y="${y + 34.5}" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">PAC ${L[pk].slice(3).toUpperCase()}</text>
  </g>`;
});

/* legenda di pojok kiri-bawah peta */
svg += `<g style="pointer-events:none">
  <rect x="4" y="636" width="104" height="72" rx="8" fill="#101c16" stroke="#1f3328"/>` +
  [["a", "Aktif"], ["s", "SP Habis"], ["v", "Vakum"]].map((r, i) =>
    `<circle cx="18" cy="${650 + i * 15}" r="6" fill="${CL[r[0]]}"/>
     <text x="30" y="${654 + i * 15}" font-size="10" fill="#e8f3ec">${r[1]}</text>`
  ).join("") +
  `<rect x="12" y="689" width="12" height="12" rx="3" fill="none" stroke="#c084fc" stroke-width="2.5"/>
   <text x="30" y="699" font-size="10" fill="#c084fc">PK</text>
</g>`;

el("map").innerHTML = svg;

/* 6e. Interaksi peta */
const tip = el("tip");

document.querySelectorAll(".cell").forEach(e => {
  e.onmouseenter = () => tip.textContent = e.dataset.t;
});
document.querySelectorAll(".nd").forEach(e => {
  e.onmouseenter = () => tip.textContent = e.dataset.t;
  e.onclick = () => { tip.textContent = e.dataset.t; show(e.dataset.k); };
});
document.querySelectorAll(".reg").forEach(r => r.onclick = () => show(r.dataset.k));
document.querySelectorAll(".pl").forEach(e => e.onclick = () => show(e.dataset.k));


/* =====================================================
   7. PANEL DETAIL KECAMATAN
   ===================================================== */
let cur  = null;      // kecamatan yang sedang dipilih
let filt = "all";     // filter kondisi: all / a / s / v

function show(k) {
  cur = k;
  filt = "all";
  document.querySelectorAll(".reg").forEach(r => r.classList.toggle("dim", r.dataset.k !== k));
  render();
  el("detail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* satu seksi tabel (PR atau PK) */
function sec(t, list, cl, title) {
  const rows = list.filter(r => filt === "all" || r[1] === filt);
  const c = cnt(list);

  const body = rows.map((r, i) => {
    const u = usia(t, r[0]);
    return `<tr>
      <td>${i + 1}</td>
      <td>${t} ${r[0]}</td>
      <td>${u ? u + " th" : "-"}</td>
      <td>${u ? u + " th" : "-"}</td>
      <td>${badge(r[1])}</td>
    </tr>`;
  }).join("") || '<tr><td colspan="5" class="sub">Tidak ada data pada filter ini</td></tr>';

  return `
  <div class="sec ${cl}">
    <div class="sh">
      <h3><span class="t ${cl}">${t}</span> ${title} · ${list.length}</h3>
      <span class="sub">🟢${c.a} · 🟡${c.s} · 🔴${c.v}</span>
    </div>` +
    (list.length
      ? `<div class="tw"><table>
           <thead><tr><th>No</th><th>Nama</th><th style="color:#93c5fd">Usia IPNU</th><th style="color:#f9a8d4">Usia IPPNU</th><th>Kondisi</th></tr></thead>
           <tbody>${body}</tbody>
         </table></div>`
      : `<p class="sub">Belum ada ${t} di kecamatan ini.</p>`) +
  `</div>`;
}

function render() {
  const x = D[cur], p = x.pac;
  const c = cnt(all(cur)), n = all(cur).length;

  /* kotak angka ringkas */
  const stat = [[n, "Total", "c0"], [c.a, "Aktif", "c1"], [c.s, "SP Habis", "c2"], [c.v, "Vakum", "c3"]]
    .map(s => `<div class="card st ${s[2]}" style="padding:10px 12px"><b style="font-size:1.5rem">${s[0]}</b><span>${s[1]}</span></div>`)
    .join("");

  /* info PAC */
  const info = `
    <div class="kv">
      <div style="border-left:4px solid #2563eb"><small>Usia IPNU</small>${x.usia}</div>
      <div style="border-left:4px solid #db2777"><small>Usia IPPNU</small>${x.usia}</div>
      <div><small>Ketua IPNU</small>${p.ketua}</div>
      <div><small>Ketua IPPNU</small>${p.ketri}</div>
      <div><small>Masa Khidmat</small>${p.masa}</div>
      <div><small>SP</small>${p.sp}</div>
      <div><small>Administrasi</small>${p.adm}</div>
      <div><small>Kegiatan</small>${p.keg}</div>
      <div><small>SP Habis</small>${p.spHabis}</div>
      <div><small>Konferancab</small>${p.konfer}</div>
      <div><small>Masalah</small>${p.masalah}</div>
      <div><small>Kebutuhan</small>${p.butuh}</div>
    </div>`;

  /* persentase kondisi */
  const persen = `
    <div style="background:var(--soft);border-radius:14px;padding:12px;margin:10px 0">
      <h3 style="margin-bottom:8px">Persentase Kondisi PAC ${x.nama}</h3>
      <div class="donut">${dn(c, n)}
        <div style="flex:1;min-width:170px">
          ${["a", "s", "v"].map(k => `
            <div class="kr" style="grid-template-columns:70px 1fr 46px">
              <span>${L[k].slice(3)}</span>
              <div class="kb"><i style="width:${pc2(c[k], n)}%;background:${CL[k]}"></i></div>
              <b>${pc2(c[k], n)}%</b>
            </div>`).join("")}
          ${x.PR.length ? `<div class="sub" style="margin-top:6px">PR (${x.PR.length})</div>${sbar(cnt(x.PR), x.PR.length)}` : ""}
          ${x.PK.length ? `<div class="sub" style="margin-top:6px">PK (${x.PK.length})</div>${sbar(cnt(x.PK), x.PK.length)}` : ""}
        </div>
      </div>
    </div>`;

  /* tombol filter */
  const tabs = `<div class="tabs">${
    [["all", "Semua"], ["a", "🟢 Aktif"], ["s", "🟡 SP Habis"], ["v", "🔴 Vakum"]]
      .map(([f, t]) => `<button class="${filt === f ? "on" : ""}" onclick="filt='${f}';render()">${t}</button>`)
      .join("")
  }</div>`;

  el("detail").innerHTML =
    `<h2>PAC ${x.nama} ${badge(p.kondisi)}</h2>
     <div class="grid" style="grid-template-columns:repeat(4,1fr)">${stat}</div>` +
    info + persen + tabs +
    sec("PR", x.PR, "pr", "Pimpinan Ranting") +
    sec("PK", x.PK, "pk", "Pimpinan Komisariat");
}


/* =====================================================
   8. STATISTIK USIA
   ===================================================== */

/* 8a. Rentang usia tiap pimpinan (batang IPNU & IPPNU) */
el("age").innerHTML =
  A.map(a => {
    const bar = (top, warna) =>
      `<i style="top:${top}px;height:11px;left:${(a[1] - 12) / 13 * 100}%;width:${(a[2] - a[1] + 1) / 13 * 100}%;background:${warna}">${a[1] == a[2] ? a[1] : a[1] + "–" + a[2]}</i>`;
    return `<div>${a[0]}</div><div class="tr">${bar(3, "#2563eb")}${bar(15, "#db2777")}</div>`;
  }).join("") +
  `<div></div><div class="ax">${[...Array(13)].map((_, i) => `<span>${12 + i}</span>`).join("")}</div>`;

/* 8b. Kartu ringkas, persentase per usia, tabel per tingkat, donut kelompok usia */
(function () {
  const n   = A.length;
  const mn  = Math.min(...A.map(a => a[1]));
  const mx  = Math.max(...A.map(a => a[2]));
  const yrs = mx - mn + 1;
  const avg = f => (A.reduce((t, a) => t + f(a), 0) / n).toFixed(1);

  /* kartu ringkas */
  el("ak").innerHTML = [
    ["Usia Terendah",         mn + " th",                          "PR Pakunden",       "cpr"],
    ["Usia Tertinggi",        mx + " th",                          "Pimpinan Cabang",   "cpk"],
    ["Rata-rata Batas Bawah", avg(a => a[1]) + " th",              "dari " + n + " data", "c0"],
    ["Rata-rata Batas Atas",  avg(a => a[2]) + " th",              "dari " + n + " data", "c2"],
    ["Rata-rata Rentang",     avg(a => a[2] - a[1] + 1) + " th",   "lebar rentang usia", "c1"]
  ].map(s => `<div class="card st ${s[3]}"><span>${s[0]}</span><b style="font-size:1.6rem">${s[1]}</b><span>${s[2]}</span></div>`).join("");

  /* persentase pimpinan yang mencakup tiap usia */
  let h = "";
  for (let y = mn; y <= mx; y++) {
    const c = A.filter(a => a[1] <= y && y <= a[2]).length;
    const p = pc2(c, n);
    const warna = p >= 70 ? "#10b981" : p >= 40 ? "#3b82f6" : "#8b5cf6";
    h += `<div class="kr" style="grid-template-columns:44px 1fr 92px">
      <span>${y} th</span>
      <div class="kb"><i style="width:${p}%;background:${warna}"></i></div>
      <b>${p}% <span class="sub">(${c}/${n})</span></b>
    </div>`;
  }
  el("ah").innerHTML = h;

  /* ringkasan per tingkat */
  const groups = [
    ["PR",              a => a[0].startsWith("PR ")],
    ["PK",              a => a[0].startsWith("PK ")],
    ["PAC",             a => a[0].startsWith("PAC ")],
    ["Pimpinan Cabang", a => a[0] == "Pimpinan Cabang"],
    ["Seluruh",         () => true]
  ];
  el("at").className = "mx";
  el("at").innerHTML =
    `<thead><tr><th>Tingkat</th><th>Data</th><th>Usia IPNU / IPPNU</th><th>Rata² Rentang</th><th>Cakupan Usia</th></tr></thead><tbody>` +
    groups.map(([nama, fn]) => {
      const l = A.filter(fn);
      const lo = Math.min(...l.map(x => x[1]));
      const hi = Math.max(...l.map(x => x[2]));
      const p  = pc2(hi - lo + 1, yrs);
      const rata = (l.reduce((q, x) => q + x[2] - x[1] + 1, 0) / l.length).toFixed(1);
      return `<tr>
        <td style="text-align:left"><b>${nama}</b></td>
        <td>${l.length}</td>
        <td>${lo}–${hi} th</td>
        <td>${rata} th</td>
        <td style="min-width:130px">
          <div class="kb" style="display:inline-block;width:70px;vertical-align:middle"><i style="width:${p}%;background:#14b8a6"></i></div>
          <b>${p}%</b>
        </td>
      </tr>`;
    }).join("") + `</tbody>`;

  /* donut kelompok usia (berdasarkan titik tengah rentang) */
  const G = [
    ["13–15", 13, 15, "#14b8a6"],
    ["16–18", 16, 18, "#3b82f6"],
    ["19–21", 19, 21, "#8b5cf6"],
    ["22–24", 22, 24, "#f59e0b"]
  ];
  const mid = a => (a[1] + a[2]) / 2;
  const gc  = G.map(q => A.filter(a => mid(a) >= q[1] && mid(a) < q[2] + 1).length);

  let offset = 0, arcs = "";
  G.forEach((q, i) => {
    if (!gc[i]) return;
    const len = gc[i] / n * 314.16;
    arcs += `<circle r="50" cx="70" cy="70" fill="none" stroke="${q[3]}" stroke-width="22" stroke-dasharray="${len - 1.5} 314.16" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"/>`;
    offset += len;
  });
  el("ad").innerHTML = `
    <svg viewBox="0 0 140 140" style="width:140px;flex:none">${arcs}
      <text x="70" y="72" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor">${n}</text>
      <text x="70" y="88" text-anchor="middle" font-size="9" fill="#888">data usia</text>
    </svg>
    <div class="lg">
      ${G.map((q, i) => `<div><span class="dot" style="background:${q[3]}"></span>${q[0]} th: <b>${gc[i]}</b> (${pc2(gc[i], n)}%)</div>`).join("")}
      <div class="sub">berdasarkan titik tengah rentang</div>
    </div>`;
})();


/* =====================================================
   9. DATA PENGKADERAN
   ===================================================== */

/* tabel */
el("kt").innerHTML =
  `<thead><tr><th>No</th><th>Jenis Pengkaderan</th><th class="n">Jumlah</th><th>Porsi</th><th>Keterangan</th></tr></thead><tbody>` +
  K.map((r, i) => `<tr>
    <td>${i + 1}</td>
    <td><span class="dot" style="background:${r[3]}"></span><b>${r[0]}</b></td>
    <td class="n"><b>${r[1]}</b></td>
    <td><div class="kb"><i style="width:${Math.max(r[1] / KT * 100, 2)}%;background:${r[3]}"></i></div></td>
    <td>${r[2]}</td>
  </tr>`).join("") +
  `</tbody><tfoot><tr><td></td><td>Total</td><td class="n">${KT}</td><td></td><td></td></tr></tfoot>`;

/* donut */
(function () {
  let offset = 0, arcs = "";
  K.forEach(r => {
    const len = r[1] / KT * 314.16;
    arcs += `<circle r="50" cx="70" cy="70" fill="none" stroke="${r[3]}" stroke-width="22" stroke-dasharray="${Math.max(len - 1, .6)} ${314.16}" stroke-dashoffset="${-offset}" transform="rotate(-90 70 70)"/>`;
    offset += len;
  });
  el("kd").innerHTML = `
    <svg viewBox="0 0 140 140">${arcs}
      <text x="70" y="72" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor">${KT}</text>
      <text x="70" y="88" text-anchor="middle" font-size="9" fill="#888">total kader</text>
    </svg>
    <div class="lg">${K.map(r =>
      `<div><span class="dot" style="background:${r[3]}"></span>${r[0]}: <b>${r[1]}</b> (${(r[1] / KT * 100).toFixed(1)}%)</div>`
    ).join("")}</div>`;
})();

/* jenjang lanjutan (tanpa MAKESTA) */
el("kb").innerHTML = K.slice(1).map(r => `
  <div class="kr">
    <span>${r[0]}</span>
    <div class="kb"><i style="width:${r[1] / 25 * 100}%;background:${r[3]}"></i></div>
    <b>${r[1]}</b>
  </div>`).join("");


/* =====================================================
   10. ANIMASI MASUK (scroll reveal & hitung naik)
   ===================================================== */

/* kartu muncul saat terlihat di layar */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("go");
      io.unobserve(e.target);
    }
  });
}, { threshold: .1 });

const detail = el("detail");
document.querySelectorAll(".w .card").forEach(c => {
  if (c !== detail && detail.contains(c)) return;
  c.classList.add("rv");
  c.style.transitionDelay = Math.min([...c.parentNode.children].indexOf(c), 8) * 70 + "ms";
  io.observe(c);
});

/* angka pada kartu statistik berhitung naik */
document.querySelectorAll(".stats .st b").forEach(b => {
  const v = +b.textContent;
  if (!Number.isInteger(v)) return;
  const t0 = performance.now();
  (function frame(t) {
    const p = Math.min((t - t0) / 1100, 1);
    b.textContent = Math.round(v * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
});
