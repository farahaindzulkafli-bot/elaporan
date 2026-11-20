# eLaporJP — Dashboard Rekod Aktiviti Jabatan Perdagangan

Dashboard web statik untuk menyenaraikan dan menyemak rekod aktiviti serta kertas kerja Jabatan Perdagangan 2026.

## 📁 Struktur Fail

```
elaporjp/
├── index.html        ← Halaman utama dashboard
├── style.css         ← Gaya (tema biru-putih-kelabu)
├── app.js            ← Logik dashboard
├── js/
│   └── data.js       ← Data rekod aktiviti (27 rekod)
└── netlify.toml      ← Konfigurasi deploy Netlify
```

## 🚀 Cara Deploy ke Netlify

### Kaedah 1 — Drag & Drop (Paling Mudah)
1. Buka [netlify.com](https://netlify.com) → Log masuk
2. Pergi ke **Sites** → **Add new site** → **Deploy manually**
3. Seret dan lepas **keseluruhan folder `elaporjp/`** ke kawasan upload
4. Netlify akan beri URL automatik (contoh: `https://amazing-site-123.netlify.app`)

### Kaedah 2 — GitHub + Netlify (Auto-deploy)
1. Upload folder `elaporjp/` ke GitHub repository
2. Di Netlify → **Add new site** → **Import from Git**
3. Pilih repository → **Deploy site**
4. Setiap kali push ke GitHub, Netlify auto-deploy

## 📝 Tambah Rekod Baru

Edit fail `js/data.js` dan tambah baris baharu dalam array `REKOD_DATA`:

```js
{ 
  namaProgram: "Nama Program", 
  namaPIC: "Nama PIC", 
  tarikhMula: "DD/MM/YYYY", 
  tarikhTamat: "DD/MM/YYYY", 
  peserta: 50, 
  kategori: "IEEP/PPI", 
  urlKK: "https://drive.google.com/...", 
  urlLA: "https://drive.google.com/..." 
},
```

Kemudian deploy semula ke Netlify.

## 🛠️ Teknologi

- HTML5 + CSS3 + Vanilla JavaScript
- Bootstrap 5.3 (CDN)
- Bootstrap Icons 1.11 (CDN)
- Tiada backend / server diperlukan
