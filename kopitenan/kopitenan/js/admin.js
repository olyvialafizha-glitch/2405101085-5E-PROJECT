// admin.js
// Logika halaman admin. Login-nya cuma simulasi di sisi browser (belum pakai server),
// jadi cocok untuk tugas / prototipe saja.

document.addEventListener("DOMContentLoaded", function () {
  const halaman = document.body.dataset.halaman;

  // semua halaman admin selain login harus sudah masuk dulu
  if (halaman !== "admin-login" && sessionStorage.getItem("kopitenan_admin") !== "ya") {
    location.replace("admin-login.html");
    return;
  }

  const tautanKeluar = document.getElementById("keluar");
  if (tautanKeluar) {
    tautanKeluar.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("kopitenan_admin");
      location.href = "index.html";
    });
  }

  if (halaman === "admin-login") adminLogin();
  if (halaman === "admin-dashboard") isiStatistik(0);
  if (halaman === "admin-laporan") adminLaporan();
  if (halaman === "admin-menu") adminMenu();
  if (halaman === "admin-pesanan") adminPesanan();
  if (halaman === "admin-info") adminInfo();
});

// ---------- login ----------
function adminLogin() {
  document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const sandiBenar = ambil("sandi", "admin123");

    if (form.username.value === "admin" && form.sandi.value === sandiBenar) {
      sessionStorage.setItem("kopitenan_admin", "ya");
      location.href = "admin-dashboard.html";
    } else {
      document.getElementById("pesan-login").hidden = false;
    }
  });
}

// ---------- statistik (dipakai dashboard dan laporan) ----------
// hari: 0 = semua, 1 = hari ini, 7 / 30 = sekian hari terakhir
function pesananPeriode(hari) {
  const sekarang = new Date();
  let batas = 0;

  if (hari === 1) {
    batas = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate()).getTime();
  } else if (hari > 1) {
    batas = sekarang.getTime() - hari * 24 * 60 * 60 * 1000;
  }

  // pesanan yang dibatalkan tidak dihitung sebagai penjualan
  return ambilPesanan().filter(function (p) {
    return p.status !== 4 && new Date(p.waktu).getTime() >= batas;
  });
}

function isiStatistik(hari) {
  const daftar = pesananPeriode(hari);
  let omzet = 0;
  let baru = 0;
  const terjual = {};

  daftar.forEach(function (p) {
    omzet += p.total;
    if (p.status === 0) baru += 1;
    p.item.forEach(function (i) {
      terjual[i.nama] = (terjual[i.nama] || 0) + i.jumlah;
    });
  });

  document.getElementById("stat-pesanan").textContent = daftar.length;
  document.getElementById("stat-baru").textContent = baru;
  document.getElementById("stat-omzet").textContent = rupiah(omzet);

  const urutan = Object.keys(terjual).sort(function (a, b) {
    return terjual[b] - terjual[a];
  }).slice(0, 5);

  document.getElementById("terlaris").innerHTML = urutan.length
    ? urutan.map(function (nama) {
        return "<li>" + aman(nama) + " &mdash; " + terjual[nama] + " terjual</li>";
      }).join("")
    : "<li>Belum ada data.</li>";

  document.getElementById("tabel-transaksi").innerHTML = daftar.length
    ? daftar.map(function (p) {
        return "<tr><td>" + p.id + "</td><td>" + tanggalIndo(p.waktu) + "</td><td>" +
          aman(p.nama) + "</td><td>" + STATUS_PESANAN[p.status] + "</td><td>" +
          rupiah(p.total) + "</td></tr>";
      }).join("")
    : '<tr><td colspan="5">Belum ada transaksi.</td></tr>';
}

function adminLaporan() {
  const pilihan = document.getElementById("periode");
  pilihan.addEventListener("change", function () {
    isiStatistik(Number(pilihan.value));
  });
  isiStatistik(0);
}

// ---------- kelola menu ----------
function adminMenu() {
  const form = document.getElementById("form-menu");
  const tbody = document.getElementById("tabel-menu");

  function gambarTabel() {
    tbody.innerHTML = ambilMenu().map(function (m) {
      return "<tr>" +
        "<td>" + aman(m.nama) + "</td>" +
        "<td>" + m.kategori + "</td>" +
        "<td>" + rupiah(m.harga) + "</td>" +
        "<td>" + (m.tersedia ? "Tersedia" : "Habis") + "</td>" +
        "<td>" +
          '<button class="tombol-kecil" data-aksi="ubah" data-id="' + m.id + '">Ubah</button> ' +
          '<button class="tombol-kecil" data-aksi="stok" data-id="' + m.id + '">' + (m.tersedia ? "Tandai habis" : "Tandai ada") + "</button> " +
          '<button class="tombol-kecil merah" data-aksi="hapus" data-id="' + m.id + '">Hapus</button>' +
        "</td></tr>";
    }).join("");
  }

  function kosongkanForm() {
    form.reset();
    form.id_menu.value = "";
    document.getElementById("judul-form").textContent = "Tambah menu";
  }

  tbody.addEventListener("click", function (e) {
    const tombol = e.target.closest("button");
    if (!tombol) return;

    const id = Number(tombol.dataset.id);
    const semua = ambilMenu();
    const m = semua.find(function (x) { return x.id === id; });

    if (tombol.dataset.aksi === "ubah") {
      form.id_menu.value = m.id;
      form.nama.value = m.nama;
      form.kategori.value = m.kategori;
      form.harga.value = m.harga;
      form.foto.value = m.foto || "";
      form.deskripsi.value = m.deskripsi || "";
      form.ukuran.checked = !!m.ukuran;
      form.unggulan.checked = !!m.unggulan;
      document.getElementById("judul-form").textContent = "Ubah menu: " + m.nama;
      window.scrollTo(0, 0);
    }

    if (tombol.dataset.aksi === "stok") {
      m.tersedia = !m.tersedia;
      simpan("menu", semua);
      gambarTabel();
    }

    if (tombol.dataset.aksi === "hapus" && confirm("Hapus menu " + m.nama + "?")) {
      simpan("menu", semua.filter(function (x) { return x.id !== id; }));
      gambarTabel();
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const semua = ambilMenu();

    const data = {
      nama: form.nama.value.trim(),
      kategori: form.kategori.value,
      harga: Number(form.harga.value),
      foto: form.foto.value.trim(),
      deskripsi: form.deskripsi.value.trim(),
      ukuran: form.ukuran.checked,
      unggulan: form.unggulan.checked
    };

    const idLama = Number(form.id_menu.value);
    const lama = semua.find(function (x) { return x.id === idLama; });

    if (lama) {
      Object.assign(lama, data);
    } else {
      data.id = Date.now();
      data.tersedia = true;
      semua.push(data);
    }

    simpan("menu", semua);
    kosongkanForm();
    gambarTabel();
  });

  document.getElementById("batal-ubah").addEventListener("click", kosongkanForm);
  gambarTabel();
}

// ---------- kelola pesanan ----------
function adminPesanan() {
  const wadah = document.getElementById("daftar-pesanan");

  function gambar() {
    const daftar = ambilPesanan();
    if (daftar.length === 0) {
      wadah.innerHTML = "<p>Belum ada pesanan masuk.</p>";
      return;
    }

    wadah.innerHTML = daftar.map(function (p) {
      const opsi = STATUS_PESANAN.map(function (s, i) {
        return '<option value="' + i + '"' + (i === p.status ? " selected" : "") + ">" + s + "</option>";
      }).join("");

      const itemTeks = p.item.map(function (i) {
        return aman(namaItem(i)) + " x" + i.jumlah;
      }).join(", ");

      return '<article class="pesanan">' +
        "<header><strong>" + p.id + "</strong><span>" + tanggalIndo(p.waktu) + "</span></header>" +
        "<p>" + aman(p.nama) + " (" + aman(p.hp) + ")<br>" + itemTeks + "</p>" +
        "<p>" + aman(p.pengambilan) + " &middot; " + aman(p.pembayaran) +
          (p.catatan ? "<br>Catatan: " + aman(p.catatan) : "") + "</p>" +
        "<p><strong>" + rupiah(p.total) + "</strong> &nbsp; " +
          'Status: <select data-id="' + p.id + '">' + opsi + "</select></p>" +
      "</article>";
    }).join("");
  }

  wadah.addEventListener("change", function (e) {
    if (!e.target.matches("select")) return;
    const daftar = ambilPesanan();
    const p = daftar.find(function (x) { return x.id === e.target.dataset.id; });
    p.status = Number(e.target.value);
    simpan("pesanan", daftar);
  });

  gambar();
}

// ---------- info kedai & akun ----------
function adminInfo() {
  const info = ambilInfo();
  const form = document.getElementById("form-info");

  form.promo.value = info.promo;
  form.jam.value = info.jam;
  form.alamat.value = info.alamat;
  form.wa.value = info.wa;
  form.instagram.value = info.instagram;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    simpan("info", {
      promo: form.promo.value.trim(),
      jam: form.jam.value.trim(),
      alamat: form.alamat.value.trim(),
      wa: form.wa.value.trim(),
      instagram: form.instagram.value.trim()
    });
    alert("Info tersimpan.");
  });

  document.getElementById("form-sandi").addEventListener("submit", function (e) {
    e.preventDefault();
    const f = e.target;
    if (f.sandi_lama.value !== ambil("sandi", "admin123")) {
      alert("Kata sandi lama tidak cocok.");
      return;
    }
    simpan("sandi", f.sandi_baru.value);
    f.reset();
    alert("Kata sandi diganti.");
  });
}
