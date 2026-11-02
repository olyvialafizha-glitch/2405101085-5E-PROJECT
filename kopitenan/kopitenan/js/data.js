// data.js
// Data bawaan website. Kalau admin mengubah menu atau info lewat halaman admin,
// hasilnya disimpan di localStorage browser dan dipakai menggantikan data ini.

const MENU_BAWAAN = [
  {
    id: 1, nama: "Es Kopi Susu", kategori: "Kopi", harga: 15000,
    ukuran: true, tersedia: true, unggulan: true,
    foto: "images/es-kopi-susu.jpg",
    deskripsi: "Espresso dicampur susu dan gula aren, disajikan dingin dengan es batu."
  },
  {
    id: 2, nama: "Espresso", kategori: "Kopi", harga: 12000,
    ukuran: false, tersedia: true, unggulan: false,
    foto: "images/espresso.jpg",
    deskripsi: "Satu shot espresso, pekat dan agak pahit. Cocok buat yang butuh melek."
  },
  {
    id: 3, nama: "Cappuccino", kategori: "Kopi", harga: 16000,
    ukuran: true, tersedia: true, unggulan: true,
    foto: "images/cappuccino.jpg",
    deskripsi: "Espresso dengan susu panas dan busa tebal, ditaburi bubuk kayu manis."
  },
  {
    id: 4, nama: "Orange Mint Cooler", kategori: "Non-Kopi", harga: 12000,
    ukuran: true, tersedia: true, unggulan: false,
    foto: "images/orange-mint-cooler.jpg",
    deskripsi: "Jus jeruk dingin dengan daun mint dan irisan jeruk."
  },
  {
    id: 5, nama: "Jus Alpukat Pisang", kategori: "Non-Kopi", harga: 15000,
    ukuran: true, tersedia: true, unggulan: false,
    foto: "images/jus-alpukat-pisang.jpg",
    deskripsi: "Alpukat dan pisang diblender kental, ditaburi granola."
  },
  {
    id: 6, nama: "Choco Dream Shake", kategori: "Non-Kopi", harga: 17000,
    ukuran: true, tersedia: true, unggulan: false,
    foto: "images/choco-dream-shake.jpg",
    deskripsi: "Coklat dingin dengan whipped cream dan serpihan coklat di atasnya."
  },
  {
    id: 7, nama: "Red Velvet Milkshake", kategori: "Non-Kopi", harga: 18000,
    ukuran: true, tersedia: true, unggulan: false,
    foto: "images/red-velvet-milkshake.jpg",
    deskripsi: "Milkshake rasa red velvet, dengan whipped cream dan remahan kue."
  },
  {
    id: 8, nama: "Oreo Cookies Shake", kategori: "Non-Kopi", harga: 18000,
    ukuran: true, tersedia: true, unggulan: false,
    foto: "images/oreo-cookies-shake.jpg",
    deskripsi: "Milkshake oreo dengan whipped cream, ada remahan biskuit di dalamnya."
  },
  {
    id: 9, nama: "Nasi Ayam Katsu", kategori: "Makanan", harga: 22000,
    ukuran: false, tersedia: true, unggulan: true,
    foto: "images/nasi-ayam-katsu.jpg",
    deskripsi: "Nasi putih dengan ayam katsu, jagung, wortel, buncis, dan saus."
  },
  {
    id: 10, nama: "Mie Katsu Wijen", kategori: "Makanan", harga: 20000,
    ukuran: false, tersedia: true, unggulan: false,
    foto: "images/mie-katsu-wijen.jpg",
    deskripsi: "Mie dengan bumbu wijen, ayam katsu, irisan timun, dan daun bawang."
  },
  {
    id: 11, nama: "Kentang Goreng", kategori: "Camilan", harga: 12000,
    ukuran: false, tersedia: true, unggulan: false,
    foto: "images/kentang-goreng.jpg",
    deskripsi: "Kentang goreng dengan saus tomat."
  },
  {
    id: 12, nama: "Waffle Es Krim Coklat", kategori: "Camilan", harga: 20000,
    ukuran: false, tersedia: true, unggulan: true,
    foto: "images/waffle-es-krim-coklat.jpg",
    deskripsi: "Waffle dengan satu scoop es krim vanila, saus coklat, dan kacang almond."
  }
];

// Info kedai. Alamat dan nomor WhatsApp di bawah ini cuma contoh,
// ganti lewat halaman admin (Info) atau langsung di sini.
const INFO_BAWAAN = {
  promo: "Mahasiswa bawa KTM dapat potongan Rp2.000 untuk minuman, Senin sampai Kamis.",
  jam: "Setiap hari, 08.00 - 22.00 WIB",
  alamat: "Jl. Kopi Raya No. 10",
  wa: "6281234567890",
  instagram: "kopitenan"
};
