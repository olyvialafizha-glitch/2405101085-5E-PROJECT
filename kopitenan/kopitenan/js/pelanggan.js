// pelanggan.js
// Logika halaman untuk pengunjung dan pelanggan.
// Kerangka HTML ada di tiap file .html, di sini hanya mengisi data dan menangani klik.

document.addEventListener("DOMContentLoaded", function () {
  tampilkanJumlahKeranjang();

  const halaman = document.body.dataset.halaman;
  if (halaman === "beranda") halamanBeranda();
  if (halaman === "menu") halamanMenu();
  if (halaman === "detail") halamanDetail();
  if (halaman === "keranjang") halamanKeranjang();
  if (halaman === "checkout") halamanCheckout();
  if (halaman === "status") halamanStatus();
  if (halaman === "kontak") halamanKontak();
});

// ---------- beranda ----------
function halamanBeranda() {
  const info = ambilInfo();
  document.getElementById("promo-teks").textContent = info.promo;
  document.getElementById("jam-buka").textContent = info.jam;
  document.getElementById("alamat").textContent = info.alamat;

  const tersedia = ambilMenu().filter(function (m) { return m.tersedia; });
  let pilihan = tersedia.filter(function (m) { return m.unggulan; });
  if (pilihan.length === 0) pilihan = tersedia;

  document.getElementById("menu-unggulan").innerHTML =
    pilihan.slice(0, 4).map(kartuMenu).join("");
}

// ---------- daftar menu ----------
function halamanMenu() {
  const kolomCari = document.getElementById("cari");
  const tombolKategori = document.querySelectorAll(".chip");
  let kategoriAktif = "Semua";

  function tampilkan() {
    const kata = kolomCari.value.trim().toLowerCase();
    const hasil = ambilMenu().filter(function (m) {
      const cocokKategori = kategoriAktif === "Semua" || m.kategori === kategoriAktif;
      const cocokNama = m.nama.toLowerCase().includes(kata);
      return cocokKategori && cocokNama;
    });

    document.getElementById("daftar-menu").innerHTML = hasil.map(kartuMenu).join("");
    document.getElementById("menu-kosong").hidden = hasil.length > 0;
  }

  kolomCari.addEventListener("input", tampilkan);

  tombolKategori.forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      kategoriAktif = tombol.dataset.kategori;
      tombolKategori.forEach(function (t) {
        t.classList.toggle("aktif", t === tombol);
      });
      tampilkan();
    });
  });

  tampilkan();
}

// ---------- detail menu ----------
function halamanDetail() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const menu = ambilMenu().find(function (m) { return m.id === id; });

  if (!menu) {
    document.getElementById("detail-isi").hidden = true;
    document.getElementById("detail-kosong").hidden = false;
    return;
  }

  document.title = menu.nama + " | Kopi Tenan";
  document.getElementById("foto-detail").innerHTML = fotoMenu(menu);
  document.getElementById("kategori-menu").textContent = menu.kategori;
  document.getElementById("nama-menu").textContent = menu.nama;
  document.getElementById("deskripsi-menu").textContent = menu.deskripsi;
  document.getElementById("blok-ukuran").hidden = !menu.ukuran;

  const pilihUkuran = document.getElementById("ukuran");
  const kolomJumlah = document.getElementById("jumlah");
  const tombolTambah = document.getElementById("tombol-tambah");

  function perbaruiHarga() {
    const ukuran = menu.ukuran ? pilihUkuran.value : "";
    document.getElementById("harga-menu").textContent = rupiah(hargaSatuan(menu, ukuran));
  }
  pilihUkuran.addEventListener("change", perbaruiHarga);
  perbaruiHarga();

  if (!menu.tersedia) {
    tombolTambah.disabled = true;
    tombolTambah.textContent = "Menu sedang habis";
    return;
  }

  tombolTambah.addEventListener("click", function () {
    const ukuran = menu.ukuran ? pilihUkuran.value : "";
    const jumlah = Math.max(1, parseInt(kolomJumlah.value, 10) || 1);
    const keranjang = ambilKeranjang();

    // kalau menu + ukuran yang sama sudah ada, tinggal tambah jumlahnya
    const sudahAda = keranjang.find(function (i) {
      return i.id === menu.id && i.ukuran === ukuran;
    });
    if (sudahAda) {
      sudahAda.jumlah += jumlah;
    } else {
      keranjang.push({ id: menu.id, ukuran: ukuran, jumlah: jumlah });
    }

    simpan("keranjang", keranjang);
    location.href = "keranjang.html";
  });
}

// ---------- keranjang ----------
function halamanKeranjang() {
  const tbody = document.getElementById("baris-keranjang");

  function gambar() {
    const baris = barisKeranjang();
    document.getElementById("keranjang-isi").hidden = baris.length === 0;
    document.getElementById("keranjang-kosong").hidden = baris.length > 0;
    if (baris.length === 0) return;

    tbody.innerHTML = baris.map(function (b) {
      return '<tr>' +
        '<td>' + aman(b.menu.nama) + '</td>' +
        '<td>' + (b.ukuran || "-") + '</td>' +
        '<td>' + rupiah(b.harga) + '</td>' +
        '<td class="jumlah-ubah">' +
          '<button class="tombol-kecil" data-aksi="kurang" data-i="' + b.index + '">-</button> ' +
          b.jumlah +
          ' <button class="tombol-kecil" data-aksi="tambah" data-i="' + b.index + '">+</button>' +
        '</td>' +
        '<td>' + rupiah(b.harga * b.jumlah) + '</td>' +
        '<td><button class="tombol-kecil merah" data-aksi="hapus" data-i="' + b.index + '">Hapus</button></td>' +
      '</tr>';
    }).join("");

    const total = hitungTotal(baris);
    document.getElementById("k-subtotal").textContent = rupiah(total.subtotal);
    document.getElementById("k-layanan").textContent = rupiah(total.layanan);
    document.getElementById("k-total").textContent = rupiah(total.total);
  }

  tbody.addEventListener("click", function (e) {
    const tombol = e.target.closest("button");
    if (!tombol) return;

    const i = Number(tombol.dataset.i);
    const keranjang = ambilKeranjang();

    if (tombol.dataset.aksi === "tambah") keranjang[i].jumlah += 1;
    if (tombol.dataset.aksi === "kurang" && keranjang[i].jumlah > 1) keranjang[i].jumlah -= 1;
    if (tombol.dataset.aksi === "hapus") keranjang.splice(i, 1);

    simpan("keranjang", keranjang);
    tampilkanJumlahKeranjang();
    gambar();
  });

  gambar();
}

// ---------- checkout ----------
function halamanCheckout() {
  const baris = barisKeranjang();
  if (baris.length === 0) {
    location.href = "keranjang.html";
    return;
  }

  const total = hitungTotal(baris);
  document.getElementById("ringkasan-item").innerHTML = baris.map(function (b) {
    return '<div class="baris-ringkas"><span>' + aman(namaItem({ nama: b.menu.nama, ukuran: b.ukuran })) +
      ' x' + b.jumlah + '</span><span>' + rupiah(b.harga * b.jumlah) + '</span></div>';
  }).join("");
  document.getElementById("co-subtotal").textContent = rupiah(total.subtotal);
  document.getElementById("co-layanan").textContent = rupiah(total.layanan);
  document.getElementById("co-total").textContent = rupiah(total.total);

  // petunjuk transfer cuma muncul kalau pilih transfer
  const infoTransfer = document.getElementById("info-transfer");
  document.querySelectorAll('input[name="pembayaran"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      infoTransfer.hidden = radio.value !== "Transfer bank";
    });
  });

  document.getElementById("form-pesan").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;

    const pesanan = {
      id: "KT" + String(Date.now()).slice(-6),
      nama: form.nama.value.trim(),
      hp: form.hp.value.trim(),
      pengambilan: form.pengambilan.value,
      pembayaran: form.pembayaran.value,
      catatan: form.catatan.value.trim(),
      item: baris.map(function (b) {
        return { nama: b.menu.nama, ukuran: b.ukuran, jumlah: b.jumlah, harga: b.harga };
      }),
      total: total.total,
      status: 0,
      waktu: new Date().toISOString()
    };

    const semuaPesanan = ambilPesanan();
    semuaPesanan.unshift(pesanan); // pesanan terbaru di paling atas
    simpan("pesanan", semuaPesanan);
    simpan("keranjang", []);

    location.href = "status.html?no=" + pesanan.id;
  });
}

// ---------- cek status ----------
function halamanStatus() {
  const nomor = (new URLSearchParams(location.search).get("no") || "").trim().toUpperCase();
  document.getElementById("nomor").value = nomor;
  if (!nomor) return;

  const hasil = document.getElementById("hasil-status");
  const p = ambilPesanan().find(function (x) { return x.id === nomor; });

  if (!p) {
    hasil.innerHTML = '<p class="galat">Pesanan dengan nomor ' + aman(nomor) +
      ' tidak ditemukan. Coba cek lagi nomornya.</p>';
    return;
  }

  const langkah = STATUS_PESANAN.slice(0, 4).map(function (s, i) {
    return '<li' + (i === p.status ? ' class="sekarang"' : '') + '>' + s + '</li>';
  }).join("");

  const posisi = p.status === 4
    ? '<p><span class="lencana s4">Dibatalkan</span></p>'
    : '<ol class="langkah">' + langkah + '</ol>';

  const daftarItem = p.item.map(function (i) {
    return '<div class="baris-ringkas"><span>' + aman(namaItem(i)) + ' x' + i.jumlah +
      '</span><span>' + rupiah(i.harga * i.jumlah) + '</span></div>';
  }).join("");

  hasil.innerHTML = '<div class="panel">' +
    '<h2>Pesanan ' + p.id + '</h2>' +
    '<p>Atas nama ' + aman(p.nama) + ', dipesan ' + tanggalIndo(p.waktu) + '</p>' +
    posisi + daftarItem +
    '<div class="baris-ringkas total"><span>Total</span><span>' + rupiah(p.total) + '</span></div>' +
    '<p>' + aman(p.pengambilan) + ' &middot; Bayar: ' + aman(p.pembayaran) + '</p>' +
    (p.catatan ? '<p>Catatan: ' + aman(p.catatan) + '</p>' : '') +
  '</div>';
}

// ---------- kontak ----------
function halamanKontak() {
  const info = ambilInfo();
  document.getElementById("kontak-alamat").textContent = info.alamat;
  document.getElementById("kontak-jam").textContent = info.jam;
  document.getElementById("tautan-wa").href = "https://wa.me/" + info.wa;
  document.getElementById("tautan-ig").href = "https://instagram.com/" + info.instagram;
  document.getElementById("tautan-peta").href =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(info.alamat);
}
