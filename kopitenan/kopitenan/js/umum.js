// umum.js
// Fungsi bantu yang dipakai di semua halaman (pelanggan maupun admin).

const BIAYA_LAYANAN = 0.05; // 5% dari subtotal
const TAMBAHAN_UKURAN = { Reguler: 0, Besar: 3000 };
const STATUS_PESANAN = [
  "Menunggu konfirmasi",
  "Diproses",
  "Siap diambil",
  "Selesai",
  "Dibatalkan"
];

// ---------- penyimpanan (localStorage) ----------
function ambil(kunci, bawaan) {
  try {
    const isi = localStorage.getItem("kopitenan_" + kunci);
    return isi ? JSON.parse(isi) : bawaan;
  } catch (e) {
    return bawaan;
  }
}

function simpan(kunci, nilai) {
  localStorage.setItem("kopitenan_" + kunci, JSON.stringify(nilai));
}

function ambilMenu() { return ambil("menu", MENU_BAWAAN); }
function ambilPesanan() { return ambil("pesanan", []); }
function ambilKeranjang() { return ambil("keranjang", []); }
function ambilInfo() {
  return Object.assign({}, INFO_BAWAAN, ambil("info", {}));
}

// ---------- format ----------
function rupiah(angka) {
  return "Rp" + Number(angka).toLocaleString("id-ID");
}

// supaya teks dari form tidak merusak tampilan saat dimasukkan ke innerHTML
function aman(teks) {
  return String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function namaItem(item) {
  return item.nama + (item.ukuran ? " (" + item.ukuran + ")" : "");
}

function tanggalIndo(iso) {
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

// ---------- harga & keranjang ----------
function hargaSatuan(menu, ukuran) {
  return menu.harga + (TAMBAHAN_UKURAN[ukuran] || 0);
}

// isi keranjang di localStorage cuma menyimpan id, ukuran, jumlah.
// Fungsi ini menggabungkannya dengan data menu supaya siap ditampilkan.
function barisKeranjang() {
  const semuaMenu = ambilMenu();
  const hasil = [];

  ambilKeranjang().forEach(function (item, index) {
    const menu = semuaMenu.find(function (m) { return m.id === item.id; });
    if (!menu) return; // menu sudah dihapus admin
    hasil.push({
      index: index,
      menu: menu,
      ukuran: item.ukuran,
      jumlah: item.jumlah,
      harga: hargaSatuan(menu, item.ukuran)
    });
  });

  return hasil;
}

function hitungTotal(baris) {
  let subtotal = 0;
  baris.forEach(function (b) { subtotal += b.harga * b.jumlah; });
  const layanan = Math.round(subtotal * BIAYA_LAYANAN);
  return { subtotal: subtotal, layanan: layanan, total: subtotal + layanan };
}

function tampilkanJumlahKeranjang() {
  const el = document.getElementById("jml-keranjang");
  if (!el) return;
  let jumlah = 0;
  ambilKeranjang().forEach(function (i) { jumlah += i.jumlah; });
  el.textContent = jumlah;
}

// ---------- tampilan menu ----------
function fotoMenu(m) {
  if (!m.foto) return '<div class="foto-kosong">Foto belum ada</div>';
  return '<img src="' + aman(m.foto) + '" alt="' + aman(m.nama) + '" loading="lazy">';
}

function kartuMenu(m) {
  return '<a class="kartu" href="detail.html?id=' + m.id + '">' +
    fotoMenu(m) +
    '<div class="kartu-isi">' +
      '<span class="kategori">' + m.kategori + '</span>' +
      '<h3>' + aman(m.nama) + '</h3>' +
      '<p class="harga">' + rupiah(m.harga) + '</p>' +
      (m.tersedia ? '' : '<span class="habis">Habis</span>') +
    '</div>' +
  '</a>';
}
