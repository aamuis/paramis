import { 
  DonationCampaign, 
  SocialActivityReport, 
  DonationTransaction, 
  VolunteerApplicant, 
  CmsConfig, 
  ServiceItem,
  EmailNotificationLog,
  CampaignSubmission
} from '../types';

export const INITIAL_CMS_CONFIG: CmsConfig = {
  yayasanName: "Yayasan Prakarsa Hadji Abdul Muis",
  brandName: "PARAMIS FOUNDATION",
  tagline: "Menebar Kebaikan Berkelanjutan, Menegakkan Harkat Martabat Kemanusiaan",
  aboutStory: "Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION) didirikan langsung oleh Hadji Abdul Muis sebagai wadah sosial dan kemanusiaan terpercaya yang menaungi semua kalangan tanpa memandang perbedaan suku, agama, dan golongan melalui pengentasan kemiskinan, pendidikan anak prasejahtera, pelatihan keterampilan kerja mandiri, penyaluran bantuan sosial, serta tanggap darurat bencana alam di seluruh penjuru nusantara.",
  vision: "Menjadi lembaga sosial dan kemanusiaan terdepan di Indonesia yang berdaya guna, transparan, dan profesional dalam menaungi serta memberdayakan seluruh masyarakat prasejahtera lintas agama dan golongan.",
  missions: [
    "Menjamin akses pendidikan dan beasiswa berkualitas bagi anak yatim dan prasejahtera.",
    "Menyelenggarakan pelatihan keterampilan kerja terapan (Institut Paramis) untuk kemandirian ekonomi.",
    "Menyalurkan bantuan pangan, sembako, pendampingan sosial, dan respon tanggap darurat bencana kemanusiaan."
  ],
  skKemenkumham: "AHU-0014298.AH.01.04.Tahun 2019",
  npwp: "91.829.412.3-014.000",
  izinOperasional: "Dinsos No. 460/2081/PPSK-DS/2021",
  address: "Jl. Dr. Sumeru Gg. Nasedin No.3, RT.03/RW.02, Cilendek Barat, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16111",
  phone: "085195555674",
  email: "email@paramis.or.id",
  whatsapp: "085195555674",
  website: "www.paramis.or.id",
  instagram: "@paramisfoundation",
  navigationTitles: {
    home: "Beranda",
    donations: "Program",
    volunteers: "Relawan",
    transparency: "Transparansi",
    fundraiser: "Galang Dana",
    admin: "Admin CMS"
  },
  customMenuItems: [
    {
      id: "menu-bansos",
      title: "Bantuan Sosial & Sembako",
      pathOrTab: "bansos",
      iconName: "HeartHandshake",
      isExternal: false,
      isActive: true
    },
    {
      id: "menu-zakat",
      title: "Kalkulator Zakat",
      pathOrTab: "zakat",
      iconName: "Calculator",
      isExternal: false,
      isActive: true
    },
    {
      id: "menu-institut-paramis",
      title: "Pelatihan Gratis di Institut Paramis untuk Janda Yatim supaya dapat penghasilan tambahan",
      pathOrTab: "https://institutparamis.com",
      iconName: "GraduationCap",
      isExternal: true,
      externalUrl: "https://institutparamis.com",
      isActive: true
    },
    {
      id: "menu-terms",
      title: "Syarat & Ketentuan",
      pathOrTab: "terms",
      iconName: "FileText",
      isExternal: false,
      isActive: true
    }
  ],
  heroBannerTitle: "Ulurkan Tanganmu, Ciptakan Perubahan",
  heroBannerSubtitle: "Bukan seberapa besar yang kita beri, tapi seberapa tulus hati yang menyertai. Karena dari tangan yang sederhana, lahir perubahan yang luar biasa.",
  footerDescription: "Lembaga filantropi nirlaba resmi berbadan hukum yang berdedikasi mengabdi untuk pendidikan yatim, kesehatan gratis, tanggap bencana, dan kemandirian dhuafa.",
  footerCopyright: "Yayasan Prakarsa Hadji Abdul Muis. All rights reserved.",
  sectionTitles: {
    urgentProgramsTitle: "Bantuan Mendesak & Tanggap Darurat",
    urgentProgramsSubtitle: "Program prioritas dengan urgensi tinggi yang membutuhkan uluran tangan kita segera",
    catalogTitle: "Katalog Penggalangan Dana",
    catalogSubtitle: "Pilih dan salurkan donasi terbaik Anda untuk program kemanusiaan yang terpercaya",
    servicesTitle: "Pilar Layanan Sosial Yayasan",
    servicesSubtitle: "Program pengabdian berkelanjutan untuk kesejahteraan dan kemandirian ummat",
    transparencyTitle: "Laporan Transparansi Penyaluran",
    transparencySubtitle: "Dokumentasi dan laporan pertanggungjawaban dana publik 100% akuntabel",
    volunteersTitle: "Bergabung Menjadi Relawan Kebaikan",
    volunteersSubtitle: "Jadilah bagian dari langkah nyata mengabdi dan membawa senyum bagi sesama"
  },
  customCategories: [
    { id: "pendidikan", name: "Pendidikan & Beasiswa", iconName: "GraduationCap", description: "Beasiswa dan sarana belajar santri/siswa dhuafa" },
    { id: "yatim", name: "Yatim & Dhuafa", iconName: "HeartHandshake", description: "Santunan, asrama, dan gizi anak-anak yatim" },
    { id: "kesehatan", name: "Kesehatan & Medis", iconName: "Stethoscope", description: "Bantuan pengobatan darurat dan ambulans gratis" },
    { id: "bencana", name: "Tanggap Bencana", iconName: "ShieldAlert", description: "Bantuan darurat logistik & pemulihan korban bencana" },
    { id: "ekonomi", name: "Pemberdayaan Ekonomi", iconName: "Coins", description: "Modal usaha mikro dan kemandirian pangan umat" },
    { id: "dakwah", name: "Dakwah & Sarana Ibadah", iconName: "Church", description: "Renovasi masjid dan sarana ibadah pelosok" }
  ],
  qrisMerchantName: "PRCRSA HADJI ABDUL MUIS",
  qrisNmid: "ID1026589758873",
  qrisImageUrl: "/qris-prcrsa-hadji-abdul-muis.svg",
  bankAccounts: []
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-1",
    title: "Santunan & Asrama Yatim Dhuafa",
    description: "Pendampingan pemenuhan kebutuhan dasar, pangan bergizi, tempat tinggal aman, dan pembinaan karakter anak yatim binaan.",
    iconName: "HeartHandshake",
    category: "yatim",
    badge: "Program Utama",
    beneficiaries: "1.240+ Anak Binaan"
  },
  {
    id: "srv-2",
    title: "Beasiswa Generasi PARAMIS",
    description: "Bantuan biaya SPP, seragam, buku, dan perlengkapan sekolah dari jenjang SD hingga Perguruan Tinggi bagi dhuafa berprestasi.",
    iconName: "GraduationCap",
    category: "pendidikan",
    badge: "Pendidikan",
    beneficiaries: "850+ Pelajar Aktif"
  },
  {
    id: "srv-3",
    title: "Tanggap Darurat & Mitigasi Bencana",
    description: "Distribusi logistik kilat, dapur umum higienis, evakuasi medis, serta renovasi huntara bagi korban bencana di pelosok.",
    iconName: "Flame",
    category: "bencana",
    badge: "Siaga 24 Jam",
    beneficiaries: "14.500+ Jiwa Terdampak"
  },
  {
    id: "srv-4",
    title: "Bantuan Sembako & Pangan Dhuafa",
    description: "Penyaluran beras, sembako, dan paket nutrisi pokok bagi lansia, janda, dan keluarga prasejahtera lintas agama secara berkala.",
    iconName: "HeartHandshake",
    category: "kemanusiaan",
    badge: "Pangan Merata",
    beneficiaries: "6.200+ Keluarga Terbantu"
  },
  {
    id: "srv-5",
    title: "Pemberdayaan UMKM Mustahik",
    description: "Pemberian modal usaha produktif tanpa riba, gerobak berkah, dan pendampingan manajemen usaha mikro dhuafa mandiri.",
    iconName: "TrendingUp",
    category: "ekonomi",
    badge: "Kemandirian",
    beneficiaries: "320+ Pengusaha Dhuafa"
  },
  {
    id: "srv-6",
    title: "Dakwah & Renovasi Masjid Pelosok",
    description: "Penyaluran Mushaf Al-Quran, sarana wudhu bersih, serta perbaikan masjid rapuh di wilayah pedalaman dan kepulauan terluar.",
    iconName: "BookOpen",
    category: "dakwah",
    badge: "Spiritual",
    beneficiaries: "48 Masjid/Musholla"
  }
];

export const INITIAL_CAMPAIGNS: DonationCampaign[] = [
  {
    id: "camp-1",
    title: "Bantu 500 Anak Yatim & Dhuafa Menyambut Tahun Ajaran Baru",
    slug: "bantu-500-anak-yatim-tahun-ajaran-baru",
    category: "pendidikan",
    categoryLabel: "Pendidikan & Yatim",
    shortDescription: "Pemberian seragam lengkap, tas, sepatu, dan buku untuk anak yatim pra-sejahtera agar tetap semangat menuntut ilmu.",
    fullDescription: "Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION) mengajak segenap donatur dermawan untuk bersama-sama meringankan beban ratusan anak yatim dan dhuafa di wilayah Jabodetabek dan Jawa Barat yang terancam putus sekolah karena kendala biaya perlengkapan sekolah dasar. Melalui program ini, setiap donasi Rp 250.000 akan dikonversi menjadi paket perlengkapan sekolah lengkap yang diserahkan langsung secara transparan.",
    targetAmount: 125000000,
    collectedAmount: 89450000,
    donorCount: 412,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      distanceKm: 3.2,
      address: "Jl. Kramat Raya No. 45, Senen",
      latitude: -6.1852,
      longitude: 106.8451
    },
    daysLeft: 18,
    isUrgent: true,
    isFeatured: true,
    organizer: "Tim Pendidikan PARAMIS FOUNDATION",
    startDate: "2026-08-01",
    endDate: "2026-09-25",
    active: true,
    updates: [
      {
        id: "upd-1-1",
        date: "2026-08-28",
        title: "Tahap 1 Penyaluran Seragam untuk 150 Anak Selesai",
        description: "Alhamdulillah tim relawan PARAMIS telah menyalurkan 150 paket seragam di SDN Johar Baru 01 Pagi bersama orang tua murid penerima manfaat.",
        imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        fundSpent: 37500000
      }
    ],
    transparencyReports: [
      {
        id: "tr-1-1",
        date: "2026-08-28",
        title: "Pembelian 150 Paket Seragam & Sepatu Mitra UMKM",
        category: "penyaluran_langsung",
        amount: 37500000,
        recipientCount: 150,
        description: "Pengadaan seragam merah putih, pramuka, tas ransel anti air, dan sepatu sekolah melalui konveksi UMKM binaan.",
        verifiedBy: "Akuntan Publik & Satuan Pengawas Internal PARAMIS"
      }
    ]
  },
  {
    id: "camp-2",
    title: "Tanggap Darurat Banjir Bandang & Dapur Hangat Warga",
    slug: "tanggap-darurat-banjir-bandang-dapur-hangat",
    category: "bencana",
    categoryLabel: "Tanggap Bencana",
    shortDescription: "Pendirian posko dapur umum higienis, penyediaan 1.500 porsi makanan siap santap/hari, selimut, dan air bersih.",
    fullDescription: "Curah hujan ekstrem memicu luapan sungai yang merendam puluhan pemukiman warga di pesisir. PARAMIS FOUNDATION sigap menerjunkan Tim Relawan Rescue dan Mobil Dapur Berkah untuk menyuplai makanan bergizi hangat 3 kali sehari bagi pengungsi, lansia, serta balita yang bertahan di posko darurat.",
    targetAmount: 85000000,
    collectedAmount: 76800000,
    donorCount: 538,
    coverImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Bekasi",
      province: "Jawa Barat",
      distanceKm: 18.5,
      address: "Kecamatan Muara Gembong",
      latitude: -6.0421,
      longitude: 107.0125
    },
    daysLeft: 8,
    isUrgent: true,
    isFeatured: true,
    organizer: "Divisi Kemanusiaan & Bencana PARAMIS",
    startDate: "2026-08-20",
    endDate: "2026-09-15",
    active: true,
    updates: [
      {
        id: "upd-2-1",
        date: "2026-09-02",
        title: "Distribusi 3.200 Porsi Makanan & 200 Kasur Busa",
        description: "Dapur umum beroperasi 24 jam dengan melibatkan ibu-ibu warga setempat. Armada relawan menyisir rumah terisolasi menggunakan perahu karet.",
        fundSpent: 42000000
      }
    ],
    transparencyReports: [
      {
        id: "tr-2-1",
        date: "2026-09-02",
        title: "Belanja Bahan Pokok Sembako & Operasional Dapur",
        category: "logistik",
        amount: 42000000,
        recipientCount: 850,
        description: "Beras 2 ton, telur 350 kg, minyak, bumbu dapur, gas elpiji, air mineral kemasan, dan popok balita.",
        verifiedBy: "Inspektorat Internal PARAMIS"
      }
    ]
  },
  {
    id: "camp-3",
    title: "Sedekah Paket Sembako & Pangan Keluarga Prasejahtera",
    slug: "sedekah-paket-sembako-pangan-keluarga-prasejahtera",
    category: "kemanusiaan",
    categoryLabel: "Kemanusiaan",
    shortDescription: "Bantu penyediaan beras, minyak, dan kebutuhan pokok bagi keluarga prasejahtera dan lansia dhuafa lintas agama.",
    fullDescription: "Kenaikan harga kebutuhan pokok semakin memberatkan keluarga prasejahtera dan lansia sebatang kara. Yayasan Prakarsa Hadji Abdul Muis menyalurkan paket sembako lengkap (beras 10kg, minyak goreng, telur, terigu, dan makanan bernutrisi) secara merata dan amanah tanpa membedakan suku, ras, dan keyakinan.",
    targetAmount: 60000000,
    collectedAmount: 34100000,
    donorCount: 219,
    coverImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Bogor",
      province: "Jawa Barat",
      distanceKm: 4.2,
      address: "Posko Penyaluran PARAMIS, Cilendek Barat",
      latitude: -6.5892,
      longitude: 106.7741
    },
    daysLeft: 42,
    isUrgent: false,
    isFeatured: false,
    organizer: "Divisi Bantuan Sosial PARAMIS",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    active: true,
    updates: [],
    transparencyReports: []
  },
  {
    id: "camp-4",
    title: "Modal Usaha Gerobak Berkah & Pendampingan Mustahik Mandiri",
    slug: "modal-usaha-gerobak-berkah-mustahik",
    category: "ekonomi",
    categoryLabel: "Pemberdayaan Ekonomi",
    shortDescription: "Bantuan modal usaha mikro tanpa bunga, gerobak jualan keliling, dan pelatihan pembukuan keuangan bagi kepala keluarga dhuafa.",
    fullDescription: "Agar mustahik dapat berdikari dan menjadi muzakki, program Gerobak Berkah PARAMIS memberikan sarana usaha lengkap, modal kerja bergulir, dan pelatihan keterampilan kuliner higienis. Target tahun ini adalah memandirikan 50 keluarga miskin menjadi pedagang mandiri.",
    targetAmount: 90000000,
    collectedAmount: 61500000,
    donorCount: 284,
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Tangerang Selatan",
      province: "Banten",
      distanceKm: 24.1,
      address: "Ciputat, Tangerang Selatan",
      latitude: -6.3112,
      longitude: 106.7466
    },
    daysLeft: 29,
    isUrgent: false,
    isFeatured: true,
    organizer: "Biro Ekonomi Umat PARAMIS",
    startDate: "2026-08-10",
    endDate: "2026-10-05",
    active: true,
    updates: [],
    transparencyReports: []
  },
  {
    id: "camp-5",
    title: "Pembangunan Sarana Air Bersih & MCK Masjid Pelosok Desa",
    slug: "sarana-air-bersih-mck-masjid-pelosok",
    category: "dakwah",
    categoryLabel: "Dakwah & Sarana Ibadah",
    shortDescription: "Pengeboran sumur air tawar dalam, instalasi filter, dan tempat wudhu layak untuk jamaah masjid pedalaman yang kekeringan.",
    fullDescription: "Warga desa kerap harus berjalan 2 kilometer demi mengambil air wudhu yang keruh saat musim kemarau. PARAMIS FOUNDATION menginisiasi pembangunan sumur bor artesis berkedalaman 70 meter dengan tandon air kapasitas 5.000 liter dan bilik wudhu ramah difabel.",
    targetAmount: 50000000,
    collectedAmount: 48900000,
    donorCount: 310,
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Cianjur",
      province: "Jawa Barat",
      distanceKm: 68.3,
      address: "Desa Sarampad, Cugenang, Cianjur",
      latitude: -6.8123,
      longitude: 107.1394
    },
    daysLeft: 5,
    isUrgent: true,
    isFeatured: false,
    organizer: "Tim Pembangunan Wilayah PARAMIS",
    startDate: "2026-08-05",
    endDate: "2026-09-12",
    active: true,
    updates: [],
    transparencyReports: []
  },
  {
    id: "camp-6",
    title: "Pemberian Paket Nutrisi & Susu untuk 250 Balita Dhuafa",
    slug: "paket-nutrisi-susu-balita-dhuafa",
    category: "kesehatan",
    categoryLabel: "Kesehatan & Gizi",
    shortDescription: "Cegah stunting pada balita dari keluarga prasejahtera dengan asupan vitamin, biskuit gizi, dan susu berkala.",
    fullDescription: "Stunting pada usia dini menghambat perkembangan fisik dan kognitif generasi penerus bangsa. PARAMIS FOUNDATION rutin menyalurkan intervensi gizi terukur bagi balita keluarga prasejahtera melalui posyandu binaan.",
    targetAmount: 40000000,
    collectedAmount: 22800000,
    donorCount: 175,
    coverImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80",
    location: {
      city: "Jakarta Utara",
      province: "DKI Jakarta",
      distanceKm: 12.4,
      address: "Kampung Nelayan Kalibaru, Cilincing",
      latitude: -6.1089,
      longitude: 106.9152
    },
    daysLeft: 34,
    isUrgent: false,
    isFeatured: false,
    organizer: "Tim Medis & Gizi PARAMIS",
    startDate: "2026-08-15",
    endDate: "2026-10-10",
    active: true,
    updates: [],
    transparencyReports: []
  }
];

export const INITIAL_TRANSACTIONS: DonationTransaction[] = [
  {
    id: "tx-1001",
    invoiceNumber: "INV/PRM/20260905/001",
    campaignId: "camp-1",
    campaignTitle: "Bantu 500 Anak Yatim & Dhuafa Menyambut Tahun Ajaran Baru",
    donorName: "Hj. Siti Mariam, S.Pd",
    donorEmail: "siti.mariam@gmail.com",
    donorPhone: "081288991122",
    amount: 500000,
    uniqueCode: 114,
    totalAmount: 500114,
    paymentMethod: "qris",
    paymentChannelName: "QRIS Instant Real-Time",
    paymentCode: "00020101021226580014ID.CO.QRIS.WWW...",
    status: "verified",
    isAnonymous: false,
    prayerMessage: "Semoga ananda para yatim menjadi anak sholeh berilmu dan bermanfaat bagi ummat. Aamiin.",
    createdAt: "2026-09-05T05:12:00Z",
    verifiedAt: "2026-09-05T05:12:28Z",
    receiptNumber: "RCPT-20260905-001"
  },
  {
    id: "tx-1002",
    invoiceNumber: "INV/PRM/20260905/002",
    campaignId: "camp-2",
    campaignTitle: "Tanggap Darurat Banjir Bandang & Dapur Hangat Warga",
    donorName: "Hamba Allah",
    donorEmail: "donatur.dermawan@yahoo.com",
    donorPhone: "081399002233",
    amount: 1000000,
    uniqueCode: 382,
    totalAmount: 1000382,
    paymentMethod: "va_bca",
    paymentChannelName: "BCA Virtual Account",
    paymentCode: "8271081399002233",
    status: "verified",
    isAnonymous: true,
    prayerMessage: "Doa terbaik untuk saudara-saudara kami yang sedang tertimpa musibah. Tetap sabar dan tabah.",
    createdAt: "2026-09-05T04:45:00Z",
    verifiedAt: "2026-09-05T04:46:15Z",
    receiptNumber: "RCPT-20260905-002"
  },
  {
    id: "tx-1003",
    invoiceNumber: "INV/PRM/20260905/003",
    campaignId: "camp-4",
    campaignTitle: "Modal Usaha Gerobak Berkah & Pendampingan Mustahik Mandiri",
    donorName: "Rahmat Hidayatullah, M.M",
    donorEmail: "rahmat.h@corporate.co.id",
    donorPhone: "081700223344",
    amount: 250000,
    uniqueCode: 209,
    totalAmount: 250209,
    paymentMethod: "gopay",
    paymentChannelName: "GoPay E-Wallet",
    paymentCode: "GP-PARAMIS-77491",
    status: "verified",
    isAnonymous: false,
    prayerMessage: "Insya Allah berkah untuk bapak ibu yang berikhtiar menjemput nafkah halal.",
    createdAt: "2026-09-05T03:30:00Z",
    verifiedAt: "2026-09-05T03:30:42Z",
    receiptNumber: "RCPT-20260905-003"
  },
  {
    id: "tx-1004",
    invoiceNumber: "INV/PRM/20260905/004",
    campaignId: "camp-5",
    campaignTitle: "Pembangunan Sarana Air Bersih & MCK Masjid Pelosok Desa",
    donorName: "dr. Farhan Al-Ghifari",
    donorEmail: "farhan.alghifari@hospital.id",
    donorPhone: "081822334455",
    amount: 1500000,
    uniqueCode: 671,
    totalAmount: 1500671,
    paymentMethod: "va_mandiri",
    paymentChannelName: "Mandiri Virtual Account",
    paymentCode: "889081822334455",
    status: "verified",
    isAnonymous: false,
    prayerMessage: "Wakaf air bersih atas nama almarhum ayahanda. Semoga menjadi amal jariyah yang mengalir.",
    createdAt: "2026-09-04T22:10:00Z",
    verifiedAt: "2026-09-04T22:11:05Z",
    receiptNumber: "RCPT-20260904-098"
  },
  {
    id: "tx-1005",
    invoiceNumber: "INV/PRM/20260905/005",
    campaignId: "camp-1",
    campaignTitle: "Bantu 500 Anak Yatim & Dhuafa Menyambut Tahun Ajaran Baru",
    donorName: "Anisa Wardhani",
    donorEmail: "anisa.wardhani@gmail.com",
    donorPhone: "082199887766",
    amount: 100000,
    uniqueCode: 425,
    totalAmount: 100425,
    paymentMethod: "dana",
    paymentChannelName: "DANA E-Wallet",
    paymentCode: "DANA-PRM-19283",
    status: "verified",
    isAnonymous: false,
    prayerMessage: "Sedekah subuh, semoga berkah bagi keluarga dan melancarkan segala urusan.",
    createdAt: "2026-09-04T21:05:00Z",
    verifiedAt: "2026-09-04T21:05:30Z",
    receiptNumber: "RCPT-20260904-097"
  }
];

export const INITIAL_VOLUNTEERS: VolunteerApplicant[] = [
  {
    id: "vol-201",
    fullName: "Dimas Arya Pratama",
    email: "dimas.arya@campus.id",
    phone: "081299882211",
    city: "Jakarta Selatan",
    age: 22,
    profession: "Mahasiswa Tingkat Akhir (Kesejahteraan Sosial)",
    skills: ["Manajemen Posko", "Trauma Healing", "Dokumentasi Foto/Video"],
    interestCategory: "bencana",
    motivation: "Saya ingin mendedikasikan waktu luang dan ilmu sosial saya untuk terjun langsung membantu masyarakat di garda terdepan saat terjadi krisis kemanusiaan bersama PARAMIS FOUNDATION.",
    availability: "flexible",
    status: "verified_auto",
    verificationScore: 96,
    verificationNotes: [
      "No. HP & Email terverifikasi valid",
      "Keahlian selaras dengan kebutuhan unit Tanggap Bencana",
      "Ketersediaan waktu fleksibel & usia produktif (22 th)",
      "Lulus verifikasi otomatis sistem kriteria PARAMIS"
    ],
    idCardNumber: "REL-PRM-2026-0042",
    registeredAt: "2026-09-04T10:15:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "vol-202",
    fullName: "dr. Zahra Nurul Izzah",
    email: "zahra.izzah@medika.org",
    phone: "081177665544",
    city: "Jakarta Pusat",
    age: 28,
    profession: "Dokter Umum",
    skills: ["Pemeriksaan Medis Dasar", "Pelatihan P3K", "Konseling Kesehatan"],
    interestCategory: "kesehatan",
    motivation: "Terpanggil untuk mengabdi memberikan pelayanan medis cuma-cuma bagi dhuafa, balita stunting, dan lansia yang sulit menjangkau faskes.",
    availability: "weekends",
    status: "approved",
    verificationScore: 99,
    verificationNotes: [
      "Tenaga Medis Bersertifikat Resmi (SIP Aktif)",
      "Komitmen tinggi pada aksi sosial akhir pekan",
      "Lolos verifikasi otomatis & verifikasi tim pengawas PARAMIS"
    ],
    idCardNumber: "REL-PRM-2026-0038",
    registeredAt: "2026-09-03T14:20:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1594824813589-497745778848?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "vol-203",
    fullName: "Fajar Wicaksono, S.T",
    email: "fajar.wicak@techcorp.io",
    phone: "081344556677",
    city: "Depok",
    age: 26,
    profession: "IT Support & Pengajar Relawan",
    skills: ["Literasi Digital", "Pengajaran Bahasa Inggris", "Desain Grafis"],
    interestCategory: "pendidikan",
    motivation: "Ingin mengajarkan keterampilan digital dan bahasa asing bagi adik-adik asrama yatim dhuafa agar memiliki daya saing tinggi.",
    availability: "weekends",
    status: "verified_auto",
    verificationScore: 92,
    verificationNotes: [
      "Pengalaman mengajar anak-anak teruji",
      "Domisili dekat dengan asrama binaan",
      "Lolos verifikasi otomatis sistem relawan"
    ],
    idCardNumber: "REL-PRM-2026-0045",
    registeredAt: "2026-09-05T01:10:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  }
];

export const INITIAL_ACTIVITY_REPORTS: SocialActivityReport[] = [
  {
    id: "rep-101",
    title: "Penyaluran 1.000 Paket Sembako & Alat Tulis Santri Dhuafa",
    date: "2026-08-25",
    category: "pendidikan",
    location: "Pesantren & Panti Asuhan Al-Muis Binaan, Pandeglang",
    beneficiariesCount: 1000,
    totalBudget: 150000000,
    documentationImages: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Program berkala Yayasan Prakarsa Hadji Abdul Muis dalam menjamin kecukupan pangan bernutrisi dan suplai fasilitas belajar santri penghafal Quran pra-sejahtera. Seluruh paket diserahkan secara simbolis dan didistribusikan langsung ke kamar-kamar santri.",
    impactHighlights: [
      "1.000 santri & anak yatim menerima paket seragam, tas, dan Al-Quran hafalan",
      "Suplai beras premium 5 ton untuk kebutuhan dapur asrama selama 3 bulan",
      "Pemeriksaan kesehatan gigi dan mata gratis oleh dokter relawan PARAMIS"
    ],
    publishedAt: "2026-08-26T08:00:00Z"
  },
  {
    id: "rep-102",
    title: "Respon Kilat Bencana Longsor: Distribusi Tenda Darurat & Air Bersih",
    date: "2026-08-14",
    category: "bencana",
    location: "Kecamatan Sukaresmi, Kabupaten Cianjur",
    beneficiariesCount: 450,
    totalBudget: 65000000,
    documentationImages: [
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Tim Tanggap Bencana PARAMIS Foundation tiba di lokasi bencana 4 jam setelah tanah longsor memutus akses jalan utama. Kami mendirikan 12 unit tenda pleton pengungsi, instalasi penjernih air darurat, dan membagikan selimut hangat.",
    impactHighlights: [
      "12 tenda pleton ramah keluarga dan lansia terpasang",
      "2.000 liter air minum layak konsumsi terfilterasi per hari",
      "Trauma healing terintegrasi untuk 85 anak-anak penyintas"
    ],
    publishedAt: "2026-08-15T09:30:00Z"
  }
];

export const INITIAL_EMAIL_LOGS: EmailNotificationLog[] = [
  {
    id: "eml-1",
    toEmail: "siti.mariam@gmail.com",
    donorName: "Hj. Siti Mariam, S.Pd",
    subject: "Bukti Penerimaan Donasi Resmi & E-Kwitansi PARAMIS FOUNDATION #INV/PRM/20260905/001",
    type: "donation_receipt",
    sentAt: "2026-09-05T05:12:30Z",
    status: "delivered",
    contentSnippet: "Terima kasih Hj. Siti Mariam atas donasi sebesar Rp 500.114 untuk program Pendidikan Yatim. E-Kwitansi resmi telah diverifikasi sistem.",
    period: "September 2026"
  },
  {
    id: "eml-2",
    toEmail: "donatur-all@paramisfoundation.org",
    donorName: "Para Donatur Dermawan PARAMIS",
    subject: "Laporan Berkala Penyaluran Donasi Periode Agustus 2026 - Yayasan Prakarsa Hadji Abdul Muis",
    type: "monthly_report",
    sentAt: "2026-09-01T08:00:00Z",
    status: "delivered",
    contentSnippet: "Laporan transparansi keuangan bulan Agustus 2026: Total dana terhimpun Rp 342.800.000, tersalurkan 92% untuk 2.850 penerima manfaat.",
    period: "Agustus 2026"
  }
];

export const INITIAL_CAMPAIGN_SUBMISSIONS: CampaignSubmission[] = [
  {
    id: "sub-1",
    title: "Bantuan Renovasi TPQ Al-Barokah Pasca Ambruk",
    category: "dakwah",
    categoryLabel: "Dakwah Masjid",
    targetAmount: 35000000,
    durationDays: 45,
    endDate: "2026-10-20",
    coverImage: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80",
    description: "Atap bangunan TPQ Al-Barokah di Kampung Cipayung roboh akibat hujan lebat disertai angin kencang pekan lalu. Saat ini 60 santri cilik terpaksa mengaji di teras warga secara bergantian. Dibutuhkan bantuan segera untuk perbaikan rangka atap baja ringan dan semen.",
    applicantName: "Ustadz Ahmad Fauzi",
    applicantWhatsapp: "081298765432",
    applicantEmail: "ahmad.fauzi@gmail.com",
    organizationName: "Pengurus TPQ Al-Barokah",
    location: {
      province: "Jawa Barat",
      city: "Kabupaten Bogor",
      address: "Kp. Cipayung RT 02/RW 05, Megamendung"
    },
    bankAccount: {
      bank: "Bank Syariah Indonesia (BSI)",
      accountNumber: "7123456789",
      accountHolder: "TPQ Al-Barokah"
    },
    status: "pending",
    submittedAt: "2026-09-04T10:15:00Z"
  },
  {
    id: "sub-2",
    title: "Biaya Operasi Jantung Ananda Bilal (4 Tahun)",
    category: "kesehatan",
    categoryLabel: "Kesehatan",
    targetAmount: 45000000,
    durationDays: 60,
    endDate: "2026-11-04",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80",
    description: "Adik Bilal didiagnosis kelainan jantung bawaan (PJB) dan membutuhkan tindakan kateterisasi serta operasi lanjutan segera di RS Jantung Harapan Kita. Ayah Bilal bekerja sebagai buruh harian lepas dengan penghasilan tidak menentu dan kesulitan menutup selisih biaya penunjang obat non-BPJS.",
    applicantName: "Rahmat Hidayat (Ayah Bilal)",
    applicantWhatsapp: "085712345678",
    applicantEmail: "rahmat.bilal@gmail.com",
    organizationName: "Keluarga Bilal",
    location: {
      province: "DKI Jakarta",
      city: "Kota Jakarta Timur",
      address: "Jl. Kramat Jati No. 12"
    },
    bankAccount: {
      bank: "Bank Mandiri",
      accountNumber: "1330012345678",
      accountHolder: "Rahmat Hidayat"
    },
    status: "approved",
    submittedAt: "2026-08-28T14:20:00Z",
    reviewedAt: "2026-08-29T09:00:00Z",
    adminNotes: "Sudah diverifikasi langsung oleh Tim Relawan PARAMIS ke RS. Dokumen medis lengkap dan valid."
  }
];

