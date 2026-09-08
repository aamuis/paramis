export interface LegalArticleSection {
  title: string;
  paragraphs: string[];
  callout?: {
    type: 'info' | 'warning' | 'success';
    text: string;
  };
  listItems?: string[];
}

export interface LegalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  lastUpdated: string;
  iconName: 'FileText' | 'BookOpen' | 'Lock' | 'HeartHandshake' | 'Users' | 'Heart' | 'ShieldCheck';
  summary: string;
  sections: LegalArticleSection[];
}

export const LEGAL_ARTICLES: LegalArticle[] = [
  // 1. SYARAT DAN KETENTUAN PLATFORM (Kitabisa inspired)
  {
    id: 'syarat-ketentuan',
    slug: 'syarat-dan-ketentuan',
    title: 'Syarat dan Ketentuan',
    subtitle: 'Ketentuan umum penggunaan layanan platform filantropi & penggalangan donasi PARAMIS FOUNDATION',
    categoryBadge: 'Ketentuan Platform',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'FileText',
    summary: 'Syarat dan Ketentuan ini mengatur hak, kewajiban, dan tata cara pemanfaatan seluruh layanan digital Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION). Dengan mengakses dan menggunakan platform kami, Anda menyetujui seluruh ketentuan yang tertuang di dalam dokumen ini.',
    sections: [
      {
        title: '1. Pendahuluan dan Penerimaan Ketentuan',
        paragraphs: [
          'Selamat datang di platform digital resmi Yayasan Prakarsa Hadji Abdul Muis (selanjutnya disebut "PARAMIS FOUNDATION" atau "Kami"). Platform ini dikelola dan dioperasikan secara sah berdasarkan hukum Republik Indonesia dengan SK Kemenkumham RI No. AHU-0014298.AH.01.04.Tahun 2019 dan Izin Operasional Dinas Sosial.',
          'Syarat dan Ketentuan ini merupakan perjanjian hukum yang mengikat antara Anda (selaku Pengunjung, Donatur, Penggalang Dana, atau Relawan) dengan PARAMIS FOUNDATION. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda dipersilakan untuk tidak melanjutkan penggunaan platform ini.',
          'Penggunaan layanan secara berkelanjutan setelah adanya pembaruan atau perubahan ketentuan dianggap sebagai bentuk persetujuan penuh terhadap ketentuan yang telah diperbarui.'
        ],
        callout: {
          type: 'info',
          text: 'PARAMIS FOUNDATION adalah lembaga filantropi nirlaba resmi berbadan hukum yang berfokus pada pendidikan yatim, kesehatan gratis, tanggap bencana, dan pemberdayaan ekonomi dhuafa.'
        }
      },
      {
        title: '2. Akun dan Kelayakan Pengguna',
        paragraphs: [
          'Pengguna platform harus merupakan individu yang telah berusia minimal 17 (tujuh belas) tahun atau telah cakap hukum menurut perundang-undangan Republik Indonesia.',
          'Bagi pengunjung yang berdonasi, sistem kami memfasilitasi kemudahan berdonasi langsung (guest checkout) tanpa keharusan mendaftar akun berbelit-belit, guna mempermudah amal ibadah donatur.',
          'Bagi pemohon penggalangan dana (Inisiator), Anda diwajibkan mencantumkan data identitas yang valid, nomor WhatsApp aktif, serta alamat yang dapat diverifikasi secara fisik oleh tim lapangan kami.'
        ]
      },
      {
        title: '3. Kebijakan Transparansi & Biaya Operasional',
        paragraphs: [
          'PARAMIS FOUNDATION berkomitmen teguh menjunjung tinggi amanah donatur dan prinsip transparansi 100% akuntabel.',
          'Untuk program Zakat Maal, Zakat Fitrah, dan Wakaf Produktif, dana yang disalurkan adalah 100% TANPA POTONGAN BIAYA APAPUN (0% fee potongan), disalurkan utuh kepada asnaf mustahiq yang berhak.',
          'Untuk penggalangan dana umum/kemanusiaan mandiri, biaya operasional platform (apabila ada) dibatasi maksimal sesuai regulasi Kementerian Sosial RI dan digunakan secara ketat untuk verifikasi faktual lapangan, pendampingan medis, serta biaya transfer perbankan/QRIS.'
        ],
        callout: {
          type: 'success',
          text: 'Prinsip 0% Potongan Zakat: Dana zakat yang ditunaikan melalui PARAMIS disalurkan penuh 100% tanpa potongan operasional platform.'
        }
      },
      {
        title: '4. Hak Pengawasan, Penangguhan, dan Pembatalan Kampanye',
        paragraphs: [
          'PARAMIS FOUNDATION memiliki hak mutlak untuk memverifikasi, menolak, menangguhkan, atau membatalkan kampanye penggalangan dana apabila terindikasi adanya unsur penipuan, manipulasi dokumen medis, pelanggaran kesusilaan, tindak pidana terorisme, atau pencucian uang.',
          'Apabila sebuah kampanye terbukti melanggar ketentuan hukum, dana yang telah terhimpun dapat dialihkan kepada penerima manfaat lain yang sah atau dikembalikan kepada donatur sesuai mekanisme yang diatur oleh yayasan.'
        ]
      },
      {
        title: '5. Batasan Tanggung Jawab Platform',
        paragraphs: [
          'PARAMIS FOUNDATION bertindak sebagai fasilitator penghubung antara donatur dermawan dan penerima manfaat yang membutuhkan bantuan.',
          'Kami melakukan verifikasi administratif dan faktual sebaik-baiknya dengan ikhtiar maksimal. Namun demikian, kami tidak bertanggung jawab atas kerugian tidak langsung yang disebabkan oleh keadaan kahar (force majeure) atau gangguan jaringan pihak ketiga perbankan.'
        ]
      },
      {
        title: '6. Hukum yang Berlaku & Penyelesaian Sengketa',
        paragraphs: [
          'Syarat dan Ketentuan ini tunduk dan ditafsirkan berdasarkan hukum Negara Kesatuan Republik Indonesia.',
          'Segala perselisihan yang timbul akan diselesaikan terlebih dahulu melalui musyawarah untuk mencapai mufakat. Apabila tidak tercapai mufakat, para pihak sepakat memilih domisili hukum di Pengadilan Negeri Kota Bogor, Jawa Barat.'
        ]
      }
    ]
  },

  // 2. KETENTUAN UMUM DAN DEFINISI (Kitabisa inspired)
  {
    id: 'ketentuan-umum-definisi',
    slug: 'ketentuan-umum-dan-definisi',
    title: 'Ketentuan Umum dan Definisi',
    subtitle: 'Kamus istilah dan penjelasan definisi resmi yang digunakan dalam ekosistem PARAMIS FOUNDATION',
    categoryBadge: 'Definisi & Istilah',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'BookOpen',
    summary: 'Dokumen ini menguraikan makna istilah-istilah baku yang digunakan di seluruh dokumen hukum, situs web, serta aplikasi Yayasan Prakarsa Hadji Abdul Muis guna mencegah kerancuan pemahaman antara yayasan, donatur, dan penerima manfaat.',
    sections: [
      {
        title: '1. Definisi Pihak-Pihak Terkait',
        paragraphs: [
          'Berikut adalah pengertian istilah pihak yang digunakan dalam platform:',
        ],
        listItems: [
          'Yayasan / PARAMIS FOUNDATION: Merujuk kepada Yayasan Prakarsa Hadji Abdul Muis, lembaga nirlaba berbadan hukum yang beralamat di Jl. Dr. Sumeru Gg. Nasedin No.3, Cilendek Barat, Bogor Barat, Kota Bogor, Jawa Barat.',
          'Pengunjung / Pengguna: Setiap individu atau entitas yang mengakses, menjelajah, atau menggunakan layanan situs web PARAMIS FOUNDATION.',
          'Donatur / Muzakki / Wakif: Individu, kelompok, atau korporasi yang menyalurkan donasi, sedekah, zakat, atau bantuan secara sukarela melalui platform.',
          'Penggalang Dana / Inisiator: Pihak yang membuat atau mengajukan permohonan penggalangan dana untuk kepentingan sosial, kesehatan, atau kemanusiaan.',
          'Penerima Manfaat / Mustahiq: Individu, kelompok masyarakat dhuafa, santri yatim, korban bencana, atau institusi sosial yang menjadi tujuan akhir penyaluran bantuan dana dan logistik.'
        ]
      },
      {
        title: '2. Definisi Transaksi dan Operasional',
        paragraphs: [
          'Berikut adalah definisi istilah operasional dan perbankan:',
        ],
        listItems: [
          'Kampanye Donasi: Halaman digital publik yang memuat cerita, foto, target dana, durasi, serta rincian program bantuan sosial.',
          'Donasi / Sedekah: Nilai uang yang diserahkan secara sukarela tanpa imbalan materi demi kemaslahatan sesama dan kemanusiaan universal.',
          'Zakat Maal / Fitrah: Dana titipan bagi donatur muslim yang disalurkan tepat sasaran kepada para mustahik yang berhak.',
          'QRIS Resmi: Kode Quick Response Indonesian Standard resmi atas nama Yayasan Prakarsa Hadji Abdul Muis yang terhubung ke jaringan Bank Indonesia.',
          'Laporan Pertanggungjawaban (LPJ): Bukti dokumentasi salur, kuitansi rumah sakit/toko, nota belanja logistik, dan foto penyerahan bantuan kepada penerima manfaat.'
        ]
      },
      {
        title: '3. Keadaan Kahar (Force Majeure)',
        paragraphs: [
          'Keadaan Kahar adalah peristiwa di luar kendali wajar Yayasan yang secara langsung menghambat pelaksanaan kewajiban operasional, termasuk namun tidak terbatas pada: bencana alam dahsyat, gempa bumi, banjir bandang, perang, kerusuhan massal, pandemi global, kebijakan darurat pemerintah, atau kegagalan sistem perbankan nasional.'
        ]
      }
    ]
  },

  // 3. KEBIJAKAN PRIVASI (Kitabisa inspired)
  {
    id: 'kebijakan-privasi',
    slug: 'kebijakan-privasi',
    title: 'Kebijakan Privasi',
    subtitle: 'Perlindungan kerahasiaan data pribadi, prinsip enkripsi, dan kepatuhan terhadap UU No. 27 Tahun 2022 (UU PDP)',
    categoryBadge: 'Perlindungan Data',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'Lock',
    summary: 'PARAMIS FOUNDATION sangat menghargai privasi setiap donatur, relawan, dan inisiator. Kami berkomitmen melindungi seluruh data pribadi Anda dan tidak akan pernah menjual atau membagikan data kepada pihak ketiga komersial untuk keperluan periklanan atau spam.',
    sections: [
      {
        title: '1. Dasar Hukum & Komitmen Privasi',
        paragraphs: [
          'Kebijakan Privasi ini disusun sesuai dengan amanat Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
          'Kami memastikan bahwa perolehan, penyimpanan, pengolahan, dan penghapusan data pribadi dilakukan secara transparan, aman, dan hanya untuk tujuan penyaluran kebaikan sosial.'
        ]
      },
      {
        title: '2. Data Pribadi yang Kami Kumpulkan',
        paragraphs: [
          'Data yang kami kumpulkan bervariasi bergantung pada interaksi Anda dengan platform:',
        ],
        listItems: [
          'Data Donatur: Nama lengkap, alamat email, nomor WhatsApp, preferensi donasi anonim (Hamba Allah), serta riwayat transaksi donasi.',
          'Data Penggalang Dana: Nama lengkap, nomor KTP (NIK), nomor WhatsApp aktif, foto identitas diri, foto buku tabungan rekening pencairan, dan data penerima manfaat.',
          'Data Relawan: Nama, keahlian khusus, domisili, riwayat aksi sosial, dan kontak darurat.',
          'Data Teknis: Alamat protokol internet (IP), tipe peramban web, dan log aktivitas guna peningkatan keamanan sistem.'
        ]
      },
      {
        title: '3. Fitur Donasi Anonim ("Hamba Allah")',
        paragraphs: [
          'Kami menghormati niat ikhlas para dermawan yang memilih merahasiakan identitasnya demi kesucian niat lillahi ta\'ala.',
          'Jika Anda mencentang opsi "Sembunyikan nama saya (Hamba Allah)" saat berdonasi, sistem kami secara otomatis menyamarkan nama Anda menjadi "Hamba Allah" di seluruh tampilan publik, katalog program, maupun laporan keterbukaan donasi.'
        ],
        callout: {
          type: 'success',
          text: 'Privasi Hamba Allah: Nama asli Anda tidak akan pernah dipublikasikan di halaman kampanye apabila Anda memilih berdonasi secara anonim.'
        }
      },
      {
        title: '4. Penggunaan dan Perlindungan Data',
        paragraphs: [
          'Data pribadi Anda semata-mata digunakan untuk: (a) verifikasi transaksi donasi, (b) pengiriman bukti kuitansi resmi yayasan melalui WhatsApp/Email, (c) pengiriman laporan berkala penyaluran dana, dan (d) verifikasi keaslian penggalangan dana.',
          'Kami TIDAK PERNAH memperjualbelikan, menyewakan, atau mendistribusikan data pribadi Anda kepada pihak ketiga pengiklan, agen asuransi, atau pinjaman online.'
        ],
        callout: {
          type: 'warning',
          text: 'Waspada Penipuan: Pihak PARAMIS FOUNDATION tidak pernah meminta kode OTP, PIN rekening, atau kata sandi perbankan Anda dalam situasi apa pun.'
        }
      },
      {
        title: '5. Hak Pemilik Data Pribadi',
        paragraphs: [
          'Sesuai UU PDP, Anda berhak: (1) meminta akses terhadap salinan data pribadi Anda yang tersimpan, (2) meminta perbaikan atau pembaharuan data yang keliru, dan (3) meminta penghapusan riwayat kontak Anda dari basis data pengiriman notifikasi berkala.',
          'Untuk mengajukan permohonan terkait data pribadi, Anda dapat menghubungi Petugas Pelindungan Data kami melalui email: email@paramis.or.id.'
        ]
      }
    ]
  },

  // 4. KETENTUAN PENGGALANG DANA DONASI (Kitabisa inspired)
  {
    id: 'ketentuan-penggalang-dana',
    slug: 'ketentuan-penggalang-dana-donasi',
    title: 'Ketentuan Penggalang Dana Donasi',
    subtitle: 'Aturan, hak, larangan, dan standar integritas bagi inisiator permohonan galang dana di PARAMIS FOUNDATION',
    categoryBadge: 'Inisiator & Galang Dana',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'HeartHandshake',
    summary: 'Ketentuan ini ditujukan bagi siapa saja yang mengajukan permohonan bantuan atau menggalang dana untuk sesama. Kepercayaan publik adalah mahkota utama filantropi, sehingga setiap inisiator wajib menjamin kejujuran data dan akuntabilitas pelaporan.',
    sections: [
      {
        title: '1. Persyaratan Penggalang Dana',
        paragraphs: [
          'Setiap penggalang dana (Inisiator) wajib memenuhi kualifikasi berikut:',
        ],
        listItems: [
          'Warga Negara Indonesia (WNI) atau WNA yang sah, berusia minimal 17 tahun dan memiliki KTP aktif.',
          'Memiliki hubungan kekeluargaan yang jelas, mandat tertulis, atau rekomendasi resmi dari tokoh masyarakat/DKM/Dinas Sosial apabila mewakili penerima manfaat lain.',
          'Bersedia menjalani verifikasi data faktual oleh tim survei independen PARAMIS FOUNDATION.',
          'Menyediakan nomor WhatsApp aktif yang dapat dihubungi setiap saat untuk proses konfirmasi dan pemantauan kondisi lapangan.'
        ]
      },
      {
        title: '2. Konten dan Penggalangan Dana yang Dilarang Keras',
        paragraphs: [
          'PARAMIS FOUNDATION dengan tegas menolak dan akan melaporkan kepada pihak kepolisian atas pengajuan galang dana yang mengandung:',
        ],
        listItems: [
          'Penipuan, pemalsuan data medis, penggunaan foto pasien orang lain tanpa izin, atau rekayasa kondisi bencana.',
          'Tindakan yang mendukung terorisme, radikalisme, separatisme, atau pencucian uang.',
          'Pelanggaran hak asasi manusia, perdagangan orang (human trafficking), atau eksploitasi anak di bawah umur.',
          'Kegiatan politik praktis, kampanye partai politik, pemilihan umum kepala daerah, atau aksi partisan.',
          'Aktivitas perjudian, skema piramida / ponzi / MLM, atau pembebasan utang akibat judi online.',
          'Pengadaan senjata api, senjata tajam ilegal, narkotika, psikotropika, dan zat adiktif terlarang.'
        ],
        callout: {
          type: 'warning',
          text: 'Tindakan Pidana: Pemalsuan bukti medis dan penggelapan dana donasi melanggar Pasal 378 KUHP dan UU ITE, dan akan langsung diproses ke jalur hukum oleh tim advokasi yayasan.'
        }
      },
      {
        title: '3. Tata Cara Pencairan dan Penyaluran Dana',
        paragraphs: [
          'Pencairan dana donasi hanya dapat diproses setelah kampanye disetujui, terverifikasi, dan dana disalurkan langsung sesuai rencana anggaran biaya (RAB) yang disetujui.',
          'Penyaluran dana diprioritaskan ditransfer langsung ke rekening institusi resmi (seperti kasir Rumah Sakit, rekening DKM Masjid, rekening sekolah/pesantren, atau toko logistik bahan bangunan) untuk mencegah penyalahgunaan dana oleh perorangan.',
          'Penggalang dana wajib menandatangani Berita Acara Serah Terima (BAST) dan mengunggah foto dokumentasi penyerahan bantuan secara nyata.'
        ]
      },
      {
        title: '4. Kewajiban Menulis Kabar Terbaru (Update Pelaporan)',
        paragraphs: [
          'Penggalang dana berkewajiban menyampaikan kabar perkembangan terkini (update kondisi penerima manfaat, nota pembayaran kuitansi, atau progres pengobatan) paling lambat setiap 14 (empat belas) hari kalender.',
          'Ketiadaan pelaporan dapat mengakibatkan pembekuan pencairan dana tahap berikutnya hingga laporan pertanggungjawaban diselesaikan.'
        ]
      }
    ]
  },

  // 5. KETENTUAN PENERIMA MANFAAT (Kitabisa inspired)
  {
    id: 'ketentuan-penerima-manfaat',
    slug: 'ketentuan-penerima-manfaat',
    title: 'Ketentuan Penerima Manfaat',
    subtitle: 'Hak, perlindungan harkat martabat, dan kriteria kelayakan penerima bantuan sosial PARAMIS FOUNDATION',
    categoryBadge: 'Penerima Bantuan',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'Users',
    summary: 'Dokumen ini menjamin hak-hak asasi penerima manfaat bantuan (Mustahiq / Pasien / Anak Yatim / Dhuafa) agar senantiasa diperlakukan dengan hormat, bermartabat, dan menerima hak bantuan secara adil tanpa diskriminasi.',
    sections: [
      {
        title: '1. Kriteria Penerima Manfaat yang Sah',
        paragraphs: [
          'Penerima Manfaat adalah individu atau entitas yang memenuhi kualifikasi sosial dan kemanusiaan:',
        ],
        listItems: [
          'Anak yatim, piatu, atau yatim piatu usia sekolah dari keluarga prasejahtera.',
          'Kaum fakir, miskin, lansia, dan warga prasejahtera yang mengalami kesulitan pemenuhan kebutuhan pangan dan papan dasar.',
          'Pasien penyakit kronis atau kritis yang terancam putus pengobatan karena ketidakmampuan ekonomi.',
          'Korban bencana alam, bencana sosial, atau musibah mendadak yang kehilangan tempat tinggal atau mata pencaharian.',
          'Lembaga sosial/pendidikan prasejahtera, panti asuhan, atau tempat ibadah/fasilitas umum pelosok yang membutuhkan renovasi.'
        ]
      },
      {
        title: '2. Perlindungan Harkat dan Martabat Penerima Manfaat',
        paragraphs: [
          'PARAMIS FOUNDATION memegang teguh prinsip "Menegakkan Harkat Martabat Kemanusiaan". Seluruh proses peliputan, dokumentasi, dan narasi dilarang keras merendahkan martabat penerima manfaat.',
          'Dilarang menampilkan foto luka parah terbuka yang vulgar atau wajah anak di bawah umur dalam kondisi yang mempermalukan keluarga mereka.',
          'Penerima manfaat atau wali sah berhak meminta penyamaran nama atau wajah demi keamanan dan kenyamanan psikologis keluarga.'
        ],
        callout: {
          type: 'info',
          text: 'Filantropi Bermartabat: Bantuan diberikan sebagai hak saudara sebangsa dan sesama manusia, bukan sebagai objek belas kasihan yang mengeksploitasi penderitaan.'
        }
      },
      {
        title: '3. Penyaluran Melalui Wali yang Sah',
        paragraphs: [
          'Apabila penerima manfaat berstatus anak di bawah umur atau dalam kondisi koma/tidak sadarkan diri, penerimaan bantuan wajib diwakili oleh wali keluarga sah (orang tua kandung, kakek/nenek, paman/bibi) atau lembaga pengampu yang berkekuatan hukum.'
        ]
      },
      {
        title: '4. Ketentuan Pengalihan Kelebihan Dana',
        paragraphs: [
          'Apabila target donasi telah melampaui kebutuhan pengobatan/perbaikan nyata, atau apabila penerima manfaat meninggal dunia sebelum seluruh dana terserap:',
          'Kelebihan dana akan dialokasikan kepada penerima manfaat lain dalam kategori yang setara (misal: sesama pasien anak dhuafa atau santri yatim lainnya), dengan persetujuan keluarga dan dicatat transparan di platform.'
        ]
      }
    ]
  },

  // 6. KETENTUAN DONATUR (Kitabisa inspired)
  {
    id: 'ketentuan-donatur',
    slug: 'ketentuan-donatur',
    title: 'Ketentuan Donatur',
    subtitle: 'Hak kemudahan berdonasi, bukti salur sah, kebijakan non-refund, dan komitmen anti pencucian uang (AML)',
    categoryBadge: 'Hak & Kewajiban Donatur',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'Heart',
    summary: 'Dokumen ini menguraikan hak-hak dermawan yang menyalurkan hartanya melalui PARAMIS FOUNDATION, kejelasan akad donasi, serta tata cara penyaluran melalui kanal pembayaran resmi yang aman dan terverifikasi.',
    sections: [
      {
        title: '1. Prinsip Keikhlasan dan Akad Donasi',
        paragraphs: [
          'Donasi yang disalurkan melalui platform merupakan sedekah, infak, zakat, atau hibah sukarela yang diberikan dengan niat tulus demi kemanusiaan dan ibadah.',
          'Donatur menyetujui bahwa dana yang disalurkan menjadi amanah yang dikelola oleh PARAMIS FOUNDATION untuk diteruskan kepada penerima manfaat sesuai kategori program yang dipilih.'
        ]
      },
      {
        title: '2. Kanal Pembayaran Resmi Yayasan',
        paragraphs: [
          'Demi mencegah kejahatan penipuan siber oleh pihak yang mengatasnamakan yayasan, donasi HANYA SAH apabila ditransfer ke rekening resmi terdaftar atas nama YAYASAN PRAKARSA HADJI ABDUL MUIS atau melalui kode QRIS Nasional resmi yayasan.',
          'Kami TIDAK PERNAH menggunakan nomor rekening atas nama pribadi perorangan pengurus untuk menampung dana donasi publik.'
        ],
        callout: {
          type: 'warning',
          text: 'Peringatan Rekening Palsu: Seluruh rekening resmi PARAMIS FOUNDATION selalu tercantum jelas di halaman konfirmasi donasi dan atas nama Yayasan berbadan hukum.'
        }
      },
      {
        title: '3. Kebijakan Non-Refund (Pengembalian Dana)',
        paragraphs: [
          'Mengingat dana donasi yang masuk segera dialokasikan dan disalurkan kepada penerima bantuan yang berada dalam kondisi mendesak, dana donasi yang telah sukses ditransfer PADA PRINSIPNYA TIDAK DAPAT DITARIK KEMBALI (non-refundable).',
          'Pengecualian hanya berlaku apabila terbukti secara teknis terjadi transaksi debit ganda (duplicate payment) yang diakibatkan oleh gangguan sistem switching perbankan, dengan menyertakan bukti mutasi rekening asli dari bank penerbit donatur.'
        ]
      },
      {
        title: '4. Hak Memperoleh Bukti Kuitansi dan Laporan Salur',
        paragraphs: [
          'Setiap donatur berhak menerima:',
        ],
        listItems: [
          'Kuitansi digital resmi tanda terima donasi sesaat setelah transaksi terverifikasi.',
          'Notifikasi kabar penyaluran berkala melalui pesan WhatsApp atau email terdaftar.',
          'Akses terbuka terhadap Laporan Transparansi Keuangan dan Dokumentasi Penyaluran Program di menu Transparansi.'
        ]
      },
      {
        title: '5. Kepatuhan Anti Pencucian Uang (AML) & CFT',
        paragraphs: [
          'Donatur menjamin bahwa dana yang didonasikan berasal dari sumber perolehan harta yang halal dan sah menurut hukum Republik Indonesia, bukan hasil tindak pidana korupsi, pencucian uang (Anti-Money Laundering), perdagangan narkotika, atau pendanaan terorisme (Counter-Financing of Terrorism).'
        ]
      }
    ]
  },

  // 7. PANDUAN MENGGALANG DANA DONASI / COMMUNITY GUIDELINES (Kitabisa inspired)
  {
    id: 'panduan-komunitas',
    slug: 'panduan-menggalang-dana-donasi-community-guidelines',
    title: 'Panduan Menggalang Dana (Community Guidelines)',
    subtitle: 'Standar etika penulisan cerita, adab visual foto/video, transparansi anggaran, dan integritas kampanye',
    categoryBadge: 'Panduan Komunitas',
    lastUpdated: 'Diperbarui September 2026',
    iconName: 'ShieldCheck',
    summary: 'Community Guidelines ini disusun untuk membantu para inisiator membuat penggalangan dana yang jujur, menyentuh hati, menghormati privasi pasien, dan mampu menggerakkan ribuan hati dermawan untuk ikut bergotong royong.',
    sections: [
      {
        title: '1. Tiga Nilai Pokok Komunitas PARAMIS',
        paragraphs: [
          'Setiap kampanye kebaikan di platform kami berlandaskan tiga pilar utama:',
        ],
        listItems: [
          'Kejujuran Mutlak: Seluruh fakta medis, rincian biaya, dan kondisi keluarga disampaikan apa adanya tanpa rekayasa atau dramatisasi berlebihan.',
          'Penghormatan Martabat: Menjaga aib dan kehormatan keluarga mustahiq; menolong dengan memuliakan, bukan merendahkan.',
          'Akuntabilitas Tanpa Henti: Melaporkan setiap rupiah yang telah dibelanjakan kepada donatur dengan kuitansi dan bukti foto yang jelas.'
        ]
      },
      {
        title: '2. Cara Menulis Cerita yang Menggugah dan Bertanggung Jawab',
        paragraphs: [
          'Judul Kampanye: Buatlah judul yang padat, jelas, dan memuat nama serta tujuan bantuan (contoh: "Bantu Dek Fajar Melawan Kanker Darah Stadium 3"). Hindari huruf kapital seluruhnya (CAPSLOCK) atau kata-kata sensasional tak pantas.',
          'Struktur Cerita: Uraikan cerita dalam 4 bagian mudah: (1) Siapa penerima manfaat, (2) Kondisi sakit/musibah yang sedang dihadapi, (3) Ikhtiar apa yang sudah dilakukan keluarga sejauh ini, dan (4) Mengapa mereka sangat membutuhkan uluran tangan dermawan saat ini.'
        ]
      },
      {
        title: '3. Standar Etika Foto dan Video',
        paragraphs: [
          'Foto dan video adalah pintu pertama yang dilihat donatur. Pastikan mematuhi etika berikut:',
        ],
        listItems: [
          'Gunakan pencahayaan yang terang dan jelas, dengan gambar yang fokus (tidak buram).',
          'Fokuskan pada wajah penuh senyum atau ekspresi ikhtiar keluarga, bukan semata luka mengerikan.',
          'DILARANG menampilkan bagian tubuh yang tidak pantas, luka berdarah terbuka tanpa sensor, atau foto jenazah.',
          'Pastikan telah memperoleh izin tertulis atau persetujuan lisan dari orang tua / wali pasien sebelum mengambil foto.'
        ],
        callout: {
          type: 'info',
          text: 'Pedoman Visual: Foto yang memperlihatkan ketabahan dan kasih sayang keluarga terbukti lebih menggerakkan empati donatur dibanding foto yang menakut-nakuti.'
        }
      },
      {
        title: '4. Panduan Penyusunan Rencana Anggaran Biaya (RAB)',
        paragraphs: [
          'Tentukan target dana yang realistis sesuai estimasi kebutuhan nyata, misalnya:',
        ],
        listItems: [
          'Biaya tindakan operasi atau obat-obatan di luar tanggungan BPJS Kesehatan.',
          'Biaya operasional sewa ambulans dan transportasi rujukan ke RS Pusat.',
          'Biaya pembelian susu medis khusus, popok medis, dan nutrisi pemulihan anak.',
          'Biaya tempat tinggal sementara di rumah singgah dekat rumah sakit rujukan.'
        ]
      },
      {
        title: '5. Saluran Pelaporan Kecurangan (Whistleblowing Hotline)',
        paragraphs: [
          'Apabila Anda menemukan adanya kampanye di platform kami yang dicurigai fiktif, menyalahgunakan foto tanpa izin, atau tidak menyalurkan bantuan kepada pasien, segera laporkan kepada tim investigasi kami melalui:',
          'WhatsApp Hotline Layanan & Pengaduan: 0851-9555-5674 | Email: pengaduan@paramis.or.id.',
          'Setiap laporan masyarakat akan diverifikasi dalam waktu maksimal 1x24 jam dan identitas pelapor dijamin kerahasiaannya 100%.'
        ],
        callout: {
          type: 'warning',
          text: 'Komitmen Anti-Penipuan: Kami tidak mentolerir kebohongan apa pun yang mencoreng dunia filantropi dan merampas hak orang-orang miskin yang benar-benar membutuhkan pertolongan.'
        }
      }
    ]
  }
];
