import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  MapPin,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  ShieldCheck,
  Building,
  RotateCcw
} from 'lucide-react';
import { CampaignCategory, DonationCampaign } from '../types';
import { addCampaign, updateCampaign } from '../services/storage';

interface AdminCreateCampaignViewProps {
  onCampaignCreated: (campaign: DonationCampaign) => void;
  onCancelOrGoCatalog: () => void;
}

const PRESET_CAMPAIGN_TEMPLATES: Array<{
  name: string;
  category: CampaignCategory;
  title: string;
  target: number;
  days: number;
  desc: string;
  image: string;
  urgent: boolean;
}> = [
  {
    name: 'Santunan Yatim & Dhuafa',
    category: 'yatim',
    title: 'Santunan Biaya Pendidikan & Kebutuhan Santri Yatim Dhuafa',
    target: 35000000,
    days: 60,
    desc: 'Mari bersama PARAMIS FOUNDATION bantu mencukupi kebutuhan pangan bergizi, perlengkapan belajar, dan pembinaan karakter ratusan anak yatim dan santri dhuafa penghafal Al-Qur\'an.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    urgent: false
  },
  {
    name: 'Bantuan Medis Pasien Dhuafa',
    category: 'kesehatan',
    title: 'Bantuan Biaya Tindakan Medis & Operasi Pasien Dhuafa',
    target: 50000000,
    days: 45,
    desc: 'Bantuan pengobatan lanjutan, obat-obatan non-BPJS, serta akomodasi ambulans untuk pasien dari keluarga prasejahtera yang berjuang melawan penyakit kronis.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    urgent: true
  },
  {
    name: 'Renovasi / Sarana Masjid',
    category: 'dakwah',
    title: 'Renovasi Fasilitas Wudhu & Sarana Ibadah Masjid Pelosok',
    target: 40000000,
    days: 90,
    desc: 'Penyediaan tempat wudhu layak, perbaikan atap bocor, dan karpet ibadah untuk jamaah masjid di wilayah pelosok pedesaan agar beribadah lebih nyaman dan khusyuk.',
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    urgent: false
  },
  {
    name: 'Beasiswa Santri Penghafal Quran',
    category: 'pendidikan',
    title: 'Beasiswa Pendidikan & Asrama Santri Penghafal Al-Qur\'an',
    target: 60000000,
    days: 90,
    desc: 'Program beasiswa penuh meliputi biaya asrama, kitab kuning, makan harian, dan pembinaan intensif bagi calon da\'i dan penghafal Al-Qur\'an berprestasi dari keluarga kurang mampu.',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    urgent: false
  },
  {
    name: 'Tanggap Bencana & Darurat',
    category: 'bencana',
    title: 'Bantuan Darurat Logistik, Dapur Umum & Obat Korban Bencana',
    target: 75000000,
    days: 30,
    desc: 'Penyaluran cepat paket sembako darurat, air bersih, tenda penampungan sementara, dan layanan ambulans medis siaga bagi warga yang terdampak bencana alam.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
    urgent: true
  },
  {
    name: 'Pangan & Sembako Dhuafa',
    category: 'ekonomi',
    title: 'Paket Beras & Sembako Berkah untuk Lansia Prasejahtera',
    target: 25000000,
    days: 30,
    desc: 'Distribusi bahan pangan pokok berisi beras, minyak goreng, telur, dan nutrisi untuk para lansia sebatang kara dan buruh harian lepas yang membutuhkan uluran tangan kita.',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    urgent: false
  }
];

const CURATED_IMAGES = [
  { label: 'Anak Yatim', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Medis / Rumah Sakit', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
  { label: 'Masjid / Fasilitas', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pendidikan / Santri', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pangan / Sembako', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tanggap Bencana', url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80' }
];

export const AdminCreateCampaignView: React.FC<AdminCreateCampaignViewProps> = ({
  onCampaignCreated,
  onCancelOrGoCatalog
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CampaignCategory>('yatim');
  const [targetAmount, setTargetAmount] = useState<number>(35000000);
  const [initialCollected, setInitialCollected] = useState<number>(0);
  const [initialDonors, setInitialDonors] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(60);
  const [city, setCity] = useState('Kota Bogor');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState<DonationCampaign | null>(null);

  // Apply template
  const handleApplyTemplate = (tmpl: typeof PRESET_CAMPAIGN_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setTargetAmount(tmpl.target);
    setDurationDays(tmpl.days);
    setDescription(tmpl.desc);
    setCoverImage(tmpl.image);
    setIsUrgent(tmpl.urgent);
    setErrorMsg('');
  };

  // Upload image handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCoverImage(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const handleResetForm = () => {
    setTitle('');
    setCategory('yatim');
    setTargetAmount(25000000);
    setInitialCollected(0);
    setInitialDonors(0);
    setDurationDays(60);
    setCity('Kota Bogor');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
    setIsUrgent(false);
    setIsActive(true);
    setErrorMsg('');
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Harap masukkan judul program penggalangan donasi.');
      return;
    }

    if (!targetAmount || targetAmount < 100000) {
      setErrorMsg('Target donasi minimal adalah Rp 100.000.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Harap masukkan penjelasan atau deskripsi program donasi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = addCampaign({
        title: title.trim(),
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `camp-${Date.now()}`,
        category,
        categoryLabel: category.toUpperCase(),
        shortDescription: description.trim().slice(0, 160) + (description.length > 160 ? '...' : ''),
        fullDescription: description.trim(),
        targetAmount: Number(targetAmount),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
        active: isActive,
        isUrgent,
        location: {
          city: city.trim() || 'Kota Bogor',
          province: 'Jawa Barat',
          distanceKm: 2.5,
          address: city.trim() || 'Kota Bogor',
          latitude: -6.5971,
          longitude: 106.8060
        },
        daysLeft: Number(durationDays) || 60,
        organizer: 'PARAMIS FOUNDATION Pusat',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + (Number(durationDays) || 60) * 86400000).toISOString().slice(0, 10)
      });

      // Update initial collected if provided
      if (initialCollected > 0 || initialDonors > 0) {
        updateCampaign(created.id, {
          collectedAmount: Number(initialCollected),
          donorCount: Number(initialDonors)
        });
        created.collectedAmount = Number(initialCollected);
        created.donorCount = Number(initialDonors);
      }

      setCreatedSuccess(created);
      onCampaignCreated(created);
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat menyimpan program donasi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Header Info Banner */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight">
              Pembuatan Galang Donasi Baru
            </h3>
            <p className="text-[11px] text-emerald-100">
              Terbitkan program galang dana resmi PARAMIS FOUNDATION langsung ke aplikasi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancelOrGoCatalog}
          className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold cursor-pointer transition-colors shrink-0"
        >
          Lihat Katalog
        </button>
      </div>

      {/* Success Notification Card */}
      {createdSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 space-y-2 animate-in zoom-in-95">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Program Donasi Berhasil Diterbitkan dan Aktif!</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Program <strong>"{createdSuccess.title}"</strong> kini telah dapat menerima donasi publik melalui QRIS dan Bank Transfer.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onCancelOrGoCatalog}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Buka Daftar Donasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCreatedSuccess(null);
                handleResetForm();
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Buat Donasi Lainnya
            </button>
          </div>
        </div>
      )}

      {/* Quick Template Picker */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilih Cepat Template Program (Opsional)</span>
          </div>
          <span className="text-[10px] text-slate-500">Klik untuk isi otomatis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PRESET_CAMPAIGN_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all cursor-pointer group"
            >
              <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                {tmpl.name}
              </div>
              <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                Rp {tmpl.target.toLocaleString('id-ID')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Judul & Kategori */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Informasi Utama Program Donasi
            </h4>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Judul Galang Donasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Bantuan Pengobatan Balita Dhuafa atau Beasiswa Santri Yatim"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-[#060ee3] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Kategori Program *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="yatim">Yatim & Dhuafa</option>
                <option value="kesehatan">Kesehatan & Medis</option>
                <option value="pendidikan">Pendidikan & Santri</option>
                <option value="dakwah">Dakwah & Masjid</option>
                <option value="bencana">Tanggap Bencana Alam</option>
                <option value="ekonomi">Pemberdayaan Ekonomi & Pangan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Lokasi Penerima / Wilayah
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Kota Bogor, Jawa Barat"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Target Dana & Durasi */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Target Dana & Durasi Penggalangan
            </h4>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Target Donasi Dibutuhkan (Rp) *
            </label>
            <input
              type="number"
              required
              min={100000}
              step={100000}
              value={targetAmount}
              onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-[#060ee3] dark:text-blue-400 font-mono font-black text-sm focus:outline-none"
            />
            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {[10000000, 25000000, 50000000, 75000000, 100000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTargetAmount(val)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    targetAmount === val
                      ? 'bg-[#060ee3] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Rp {val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Durasi Penggalangan
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none"
                >
                  <option value={30}>30 Hari</option>
                  <option value={45}>45 Hari</option>
                  <option value={60}>60 Hari (2 Bulan)</option>
                  <option value={90}>90 Hari (3 Bulan)</option>
                  <option value={120}>120 Hari</option>
                  <option value={180}>180 Hari (6 Bulan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Dana Awal (Rp, Opsional)
              </label>
              <input
                type="number"
                min={0}
                value={initialCollected}
                onChange={(e) => setInitialCollected(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Donatur Awal (Opsional)
              </label>
              <input
                type="number"
                min={0}
                value={initialDonors}
                onChange={(e) => setInitialDonors(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Foto Sampul Program */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Foto Sampul & Banner Galang Donasi
            </h4>
          </div>

          {/* Image Live Preview */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="w-full sm:w-44 h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shrink-0 relative">
              <img
                src={coverImage}
                alt="Pratinjau Sampul"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {isUrgent && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[9px] uppercase shadow-xs">
                  Mendesak
                </span>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Masukkan tautan URL foto gambar..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:outline-none"
                />
                <label className="px-3.5 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Curated Thumbnails */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">
                  Atau pilih foto kurasi cepat:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {CURATED_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverImage(img.url)}
                      className={`px-2 py-1 rounded-lg text-[10px] border whitespace-nowrap cursor-pointer transition-all ${
                        coverImage === img.url
                          ? 'border-[#060ee3] bg-blue-50 dark:bg-blue-950/60 font-bold text-[#060ee3] dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Deskripsi & Cerita Lengkap */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
              4
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Cerita & Deskripsi Lengkap Penerima Manfaat *
            </h4>
          </div>

          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan latar belakang penerima manfaat, kondisi saat ini, rincian penggunaan dana, serta ajakan kepada para dermawan untuk berdonasi..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-[#060ee3] focus:outline-none"
          />
        </div>

        {/* 5. Pengaturan Publikasi */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center font-bold text-[11px]">
              5
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Status & Opsi Penayangan
            </h4>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-rose-600 dark:text-rose-400 block">
                Tandai sebagai Program Mendesak (Urgent)
              </span>
              <span className="text-[10px] text-slate-500">
                Akan memunculkan badge merah "MENDESAK" di beranda aplikasi.
              </span>
            </div>
            <input
              type="checkbox"
              id="is-urgent-check"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Publikasikan Sekarang (Status Aktif)
              </span>
              <span className="text-[10px] text-slate-500">
                Langsung tampil di beranda dan halaman donasi utama untuk menerima donatur.
              </span>
            </div>
            <input
              type="checkbox"
              id="is-active-check"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#060ee3] border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Menerbitkan...' : 'Terbitkan Galang Donasi Sekarang'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
