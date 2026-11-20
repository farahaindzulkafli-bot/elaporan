// ===================================================
// eLaporJP — Logik Utama
// Data dimuatkan terus dari js/data.js (REKOD_DATA)
// ===================================================

let allData = [];

// =====================================================
// INIT — jalankan apabila halaman dimuatkan
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  setupMobileToggle();
  initDashboard();
});

function initDashboard() {
  allData = REKOD_DATA || [];
  renderAll(allData);
  setLastUpdated();
}

// =====================================================
// RENDER SEMUA
// =====================================================
function renderAll(data) {
  renderRekodTable(data);
  updateSummaryCards(data);
  populateKategoriFilters(data);
}

// =====================================================
// JADUAL REKOD AKTIVITI
// =====================================================
function renderRekodTable(data) {
  const tbody = document.getElementById('tbody-rekod');
  if (!data || data.length === 0) {
    tbody.innerHTML = emptyRow(7);
    return;
  }

  tbody.innerHTML = data.map((row, i) => `
    <tr data-search="${esc(row.namaProgram + ' ' + row.namaPIC + ' ' + row.kategori).toLowerCase()}"
        data-kategori="${esc(row.kategori)}">
      <td class="no-col">${i + 1}</td>
      <td class="fw-semibold">${esc(row.namaProgram) || '—'}</td>
      <td class="pic-col">${esc(row.namaPIC) || '—'}</td>
      <td class="tarikh-col">${formatTarikhProgram(row.tarikhMula, row.tarikhTamat)}</td>
      <td>${kategoriBadge(row.kategori)}</td>
      <td>${pdfBtn(row.urlLA, 'laporan')}</td>
      <td>${pdfBtn(row.urlKK, 'kertas')}</td>
    </tr>
  `).join('');
}

// =====================================================
// KAD RINGKASAN
// =====================================================
function updateSummaryCards(data) {
  document.getElementById('count-program').textContent = data.length;

  const totalPeserta = data.reduce((sum, r) => sum + (r.peserta || 0), 0);
  document.getElementById('count-peserta').textContent = totalPeserta.toLocaleString('ms-MY');

  const categories = new Set(data.map(r => r.kategori).filter(Boolean));
  document.getElementById('count-kategori').textContent = categories.size;
}

// Kemaskini kad berdasarkan data yang sedang dipapar (selepas tapis)
function updateSummaryFromVisible() {
  const search = document.getElementById('search-rekod').value.toLowerCase();
  const kategori = document.getElementById('filter-kategori-rekod').value;

  const filtered = allData.filter(r => {
    const matchSearch = !search ||
      (r.namaProgram + ' ' + r.namaPIC + ' ' + r.kategori).toLowerCase().includes(search);
    const matchKat = !kategori || r.kategori.includes(kategori);
    return matchSearch && matchKat;
  });

  updateSummaryCards(filtered);
}

// =====================================================
// PENAPIS KATEGORI
// =====================================================
function populateKategoriFilters(data) {
  const allKats = new Set();
  data.forEach(r => {
    if (r.kategori) {
      r.kategori.split(',').forEach(k => {
        const trimmed = k.trim();
        if (trimmed) allKats.add(trimmed);
      });
    }
  });

  const sorted = [...allKats].sort();
  const options = '<option value="">Semua Kategori</option>' +
    sorted.map(k => `<option value="${esc(k)}">${esc(k)}</option>`).join('');

  document.getElementById('filter-kategori-rekod').innerHTML = options;
}

// =====================================================
// FUNGSI CARIAN & PENAPIS
// =====================================================
function filterRekod() {
  const search = document.getElementById('search-rekod').value;
  const kategori = document.getElementById('filter-kategori-rekod').value;
  const tbody = document.getElementById('tbody-rekod');
  const rows = tbody.querySelectorAll('tr[data-search]');
  let visible = 0;

  rows.forEach(row => {
    const matchSearch = !search || row.dataset.search.includes(search.toLowerCase());
    const matchKat = !kategori || row.dataset.kategori.includes(kategori);
    if (matchSearch && matchKat) {
      row.style.display = '';
      visible++;
    } else {
      row.style.display = 'none';
    }
  });

  // Kemaskini kad ringkasan ikut data yang dipapar
  updateSummaryFromVisible();

  const existing = tbody.querySelector('.no-result-row');
  if (existing) existing.remove();

  if (visible === 0 && rows.length > 0) {
    const tr = document.createElement('tr');
    tr.className = 'no-result-row';
    tr.innerHTML = `<td colspan="7" class="empty-state">
      <i class="bi bi-search"></i>
      <p>Tiada rekod ditemui untuk carian ini.</p>
    </td>`;
    tbody.appendChild(tr);
  }
}

// =====================================================
// UTILITI
// =====================================================
function formatTarikhProgram(mula, tamat) {
  if (!mula) return '—';
  if (!tamat || tamat === mula) return mula;
  return `${mula} – ${tamat}`;
}

function pdfBtn(url, type) {
  if (!url || url.trim() === '') {
    return '<span class="pdf-tiada">Tiada</span>';
  }
  const cls = type === 'laporan' ? 'btn-pdf-laporan' : 'btn-pdf-kertas';
  return `<a href="${esc(url)}" target="_blank" rel="noopener" class="btn-pdf ${cls}">
    <i class="bi bi-file-earmark-pdf-fill"></i> Lihat PDF
  </a>`;
}

function kategoriBadge(kat) {
  if (!kat) return '<span class="pdf-tiada">—</span>';
  return `<span class="badge-kategori">${esc(kat)}</span>`;
}

function emptyRow(cols) {
  return `<tr><td colspan="${cols}" class="empty-state">
    <i class="bi bi-inbox"></i>
    <p>Tiada rekod untuk dipaparkan.</p>
  </td></tr>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setLastUpdated() {
  const el = document.getElementById('last-updated');
  if (!el) return;
  el.textContent = new Date().toLocaleString('ms-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// =====================================================
// SIDEBAR MOBILE
// =====================================================
function setupMobileToggle() {
  const toggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('app-sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

function setActiveNav(el) {
  document.querySelectorAll('.app-sidebar .nav-link')
    .forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}
