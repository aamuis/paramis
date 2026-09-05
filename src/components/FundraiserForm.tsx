import React, { useState, useId } from 'react';
import { 
  HeartHandshake, 
  Upload, 
  Calendar, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Info,
  Building2,
  Phone,
  User,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CampaignCategory, CampaignSubmission, CmsConfig } from '../types';
import { INDONESIA_PROVINCES, getCitiesByProvince } from '../data/indonesiaRegions';

interface FundraiserFormProps {
  cmsConfig: CmsConfig;
  onSubmitSuccess: (submission: CampaignSubmission) => void;
  onCancel?: () => void;
}

const CATEGORY_OPTIONS: Array<{ id: CampaignCategory; label: string }> = [
  { id: 'pendidikan', label: 'Pendidikan & Beasiswa' },
  { id: 'yatim', label: 'Santunan Yatim & Dhuafa' },
  { id: 'kesehatan', label: 'Bantuan Kesehatan & Medis' },
  { id: 'bencana', label: 'Tanggap Darurat Bencana' },
  { id: 'dakwah', label: 'Dakwah & Pembangunan Masjid' },
  { id: 'ekonomi', label: 'Pemberdayaan Ekonomi / UMKM' }
];

const PRESET_IMAGES = [
  { label: 'Kesehatan / Pasien', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pendidikan / Santri', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Anak Yatim', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Masjid / Fasilitas', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bantuan Pangan', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' }
];

export const FundraiserForm: React.FC<FundraiserFormProps> = ({
  cmsConfig,
  onSubmitSuccess,
  onCancel
}) => {
  const formId = useId();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CampaignCategory>('yatim');
  const [targetAmount, setTargetAmount] = useState<number>(25000000);
  const [durationDays, setDurationDays] = useState<number>(60);
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');

  // Regional Dropdowns (Semua Provinsi & Kabupaten Kota Indonesia)
  const [selectedProvince, setSelectedProvince] = useState<string>('Jawa Barat');
  const [selectedCity, setSelectedCity] = useState<string>('Kota Bogor');
  const [specificAddress, setSpecificAddress] = useState('');

  // Applicant Data (Tanpa buat akun!)
  const [applicantName, setApplicantName] = useState('');
  const [applicantWhatsapp, setApplicantWhatsapp] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  // Bank details for disbursement
  const [bankName, setBankName] = useState('Bank Syariah Indonesia (BSI)');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<CampaignSubmission | null>(null);

  // Available cities based on selected province
  const availableCities = getCitiesByProvince(selectedProvince);

  const handleProvinceChange = (newProv: string) => {
    setSelectedProvince(newProv);
    const cities = getCitiesByProvince(newProv);
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    } else {
      setSelectedCity('');
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file foto maksimal 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Silakan isi nama atau judul kegiatan donasi.');
      return;
    }

    if (!description.trim() || description.trim().length < 30) {
      setErrorMessage('Silakan tulis keterangan / cerita donasi minimal 30 karakter agar dapat diverifikasi.');
      return;
    }

    if (!applicantName.trim()) {
      setErrorMessage('Silakan cantumkan nama lengkap pemohon / penanggung jawab.');
      return;
    }

    if (!applicantWhatsapp.trim() || applicantWhatsapp.replace(/\D/g, '').length < 9) {
      setErrorMessage('Silakan masukkan nomor WhatsApp aktif yang valid untuk menerima laporan dan konfirmasi admin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCatObj = CATEGORY_OPTIONS.find(c => c.id === category);
      const catLabel = selectedCatObj ? selectedCatObj.label : 'Donasi Umum';

      const endDate = new Date(Date.now() + durationDays * 86400000).toISOString().slice(0, 10);

      const submissionPayload: Omit<CampaignSubmission, 'id' | 'status' | 'submittedAt'> = {
        title: title.trim(),
        category,
        categoryLabel: catLabel,
        targetAmount: Number(targetAmount) || 10000000,
        durationDays,
        endDate,
        coverImage,
        description: description.trim(),
        applicantName: applicantName.trim(),
        applicantWhatsapp: applicantWhatsapp.trim(),
        applicantEmail: applicantEmail.trim() || undefined,
        organizationName: organizationName.trim() || undefined,
        location: {
          province: selectedProvince,
          city: selectedCity,
          address: specificAddress.trim() || undefined
        },
        bankAccount: bankAccountNumber.trim() ? {
          bank: bankName,
          accountNumber: bankAccountNumber.trim(),
          accountHolder: bankAccountHolder.trim() || applicantName.trim()
        } : undefined
      };

      // Call parent callback or storage service
      setTimeout(() => {
        setIsSubmitting(false);
        // Created submission object
        const finalSubmission: CampaignSubmission = {
          ...submissionPayload,
          id: `sub-${Date.now()}`,
          status: 'pending',
          submittedAt: new Date().toISOString()
        };
        setSubmittedData(finalSubmission);
        onSubmitSuccess(finalSubmission);
      }, 500);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage('Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.');
    }
  };

  // Success Screen
  if (submittedData) {
    const cleanWaAdmin = (cmsConfig.whatsapp || '085195555674').replace(/\D/g, '');
    const waAdminUrl = `https://wa.me/${cleanWaAdmin.startsWith('0') ? '62' + cleanWaAdmin.slice(1) : cleanWaAdmin}?text=${encodeURIComponent(
      `Assalamu'alaikum Admin PARAMIS FOUNDATION, saya *${submittedData.applicantName}* telah mengajukan program galang dana: *"${submittedData.title}"* (ID: ${submittedData.id}). Mohon untuk dapat ditinjau & di-ACC. Terima kasih.`
    )}`;

    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 inline-block">
            Status: Menunggu ACC Admin
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Pengajuan Donasi Berhasil Dikirim!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            Terima kasih <strong className="text-slate-900 dark:text-white">{submittedData.applicantName}</strong>. Pengajuan Anda telah terdaftar di sistem <strong>PARAMIS FOUNDATION</strong> tanpa perlu registrasi akun.
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="text-slate-500">ID Pengajuan:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{submittedData.id}</span>
          </div>
          <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="text-slate-500">Kegiatan:</span>
            <span className="font-bold text-right text-slate-900 dark:text-white max-w-[200px]">{submittedData.title}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="text-slate-500">Target Dana:</span>
            <span className="font-bold text-[#060ee3] dark:text-blue-400">Rp {submittedData.targetAmount.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="text-slate-500">Lokasi:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{submittedData.location.city}, {submittedData.location.province}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">WhatsApp Pelapor:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{submittedData.applicantWhatsapp}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 shrink-0 text-[#060ee3] dark:text-blue-400 mt-0.5" />
          <p className="leading-relaxed">
            Admin Yayasan PARAMIS akan memvalidasi pengajuan ini dalam waktu <strong>1x24 jam</strong>. Setelah di-ACC, campaign akan langsung tayang di web, dan Anda akan menerima pemberitahuan serta laporan penyaluran berkala via WhatsApp.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <a
            href={waAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Konfirmasi / Chat Admin via WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSubmittedData(null);
              if (onCancel) onCancel();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
          >
            Kembali ke Halaman Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#060ee3] via-[#040bbb] to-[#030880] text-white shadow-md space-y-2 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-white/15 text-white backdrop-blur-xs">
            <HeartHandshake className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
            Layanan Penggalangan Dana Sosial
          </span>
        </div>

        <h1 className="text-base sm:text-lg font-extrabold text-white leading-tight">
          Ajukan Galang Dana & Kegiatan Kemanusiaan
        </h1>

        <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
          Bantu sesama, keluarga, atau komunitas Anda. <strong>Pengunjung tidak perlu mendaftar atau membuat akun</strong>. Seluruh program dikelola & diverifikasi oleh Admin PARAMIS FOUNDATION, dengan pelaporan berkala via WhatsApp.
        </p>

        <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-medium text-blue-100">
          <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3 text-emerald-300" /> Tanpa Biaya Pendaftaran
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <Phone className="w-3 h-3 text-blue-200" /> Report Teratur via WhatsApp
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
            <Sparkles className="w-3 h-3 text-amber-300" /> Cepat Di-ACC Admin
          </span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* 1. INFORMASI KEGIATAN DONASI */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <Sparkles className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
            <span>1. Rincian Kegiatan Donasi</span>
          </div>

          <div>
            <label htmlFor={`${formId}-title`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Donasi / Kegiatan Donasi <span className="text-rose-500">*</span>
            </label>
            <input
              id={`${formId}-title`}
              type="text"
              placeholder="Contoh: Bantuan Pengobatan Kanker Adik Rizky, Renovasi Pesantren Dhuafa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${formId}-category`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Program <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-category`}
                value={category}
                onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-target`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Dana (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
                <input
                  id={`${formId}-target`}
                  type="number"
                  min="500000"
                  step="500000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>
              {/* Quick Target Pills */}
              <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-0.5">
                {[10000000, 25000000, 50000000, 100000000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setTargetAmount(nominal)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer border ${
                      targetAmount === nominal 
                        ? 'bg-[#060ee3] text-white border-[#060ee3]' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {nominal >= 1000000 ? `${nominal / 1000000} Jt` : `${nominal.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-duration`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jangka Waktu Donasi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(days)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    durationDays === days
                      ? 'bg-[#060ee3] text-white border-[#060ee3] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {days} Hari
                </button>
              ))}
            </div>
          </div>

          {/* FOTO KEGIATAN */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300">
              Foto Kegiatan / Foto Campaign <span className="text-rose-500">*</span>
            </label>
            
            {coverImage && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video max-h-48 group">
                <img 
                  src={coverImage} 
                  alt="Preview Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  Foto Terpasang
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <label 
                htmlFor={`${formId}-photo-upload`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-all text-center"
              >
                <Upload className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
                <span>Upload Foto dari Perangkat (Max 5MB)</span>
              </label>
              <input 
                id={`${formId}-photo-upload`}
                type="file" 
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden" 
              />
            </div>

            {/* Quick preset images */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">Atau pilih contoh foto representatif:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap font-medium border cursor-pointer ${
                      coverImage === preset.url
                        ? 'bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 border-blue-300 dark:border-blue-800'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KETERANGAN LENGKAP */}
          <div>
            <label htmlFor={`${formId}-desc`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan / Cerita Lengkap Donasi <span className="text-rose-500">*</span>
            </label>
            <textarea
              id={`${formId}-desc`}
              rows={4}
              placeholder="Jelaskan secara detail siapa penerima manfaat, kondisi saat ini, kendala yang dialami, dan bagaimana dana yang terkumpul akan disalurkan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3] resize-y"
            />
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Minimal 30 karakter. Cerita yang jelas dan transparan akan mempermudah persetujuan tim admin.
            </span>
          </div>
        </div>

        {/* 2. LOKASI KEGIATAN (SEMUA PROVINSI & KABUPATEN INDONESIA) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <MapPin className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
            <span>2. Lokasi Pelaksanaan Kegiatan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${formId}-province`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Provinsi <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-province`}
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {INDONESIA_PROVINCES.map((prov) => (
                  <option key={prov.name} value={prov.name}>{prov.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-city`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Kabupaten / Kota <span className="text-rose-500">*</span>
              </label>
              <select
                id={`${formId}-city`}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-address`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lengkap / Patokan Lokasi
            </label>
            <input
              id={`${formId}-address`}
              type="text"
              placeholder="Nama jalan, RT/RW, Dusun/Desa, Kecamatan..."
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>
        </div>

        {/* 3. DATA PEMOHON (TANPA PERLU AKUN) & KONTAK WHATSAPP */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <User className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
              <span>3. Data Pemohon (Tanpa Registrasi Akun)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Bebas Akun
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${formId}-name`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                placeholder="Nama Anda atau penanggung jawab"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-wa`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-emerald-600 dark:text-emerald-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  id={`${formId}-wa`}
                  type="tel"
                  placeholder="081234567890"
                  value={applicantWhatsapp}
                  onChange={(e) => setApplicantWhatsapp(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Admin akan menghubungi nomor ini untuk verifikasi, ACC, dan kirim laporan donasi via WhatsApp.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${formId}-org`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lembaga / Komunitas (Opsional)
              </label>
              <input
                id={`${formId}-org`}
                type="text"
                placeholder="Misal: Karang Taruna, DKM Masjid, Keluarga..."
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-email`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Pemohon (Opsional)
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                placeholder="nama@email.com"
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>
          </div>
        </div>

        {/* 4. REKENING PENYALURAN HASIL DONASI */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <Building2 className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
            <span>4. Rekening Bank Tujuan Penyaluran (Untuk Pencairan Dana)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${formId}-bank-name`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Bank
              </label>
              <select
                id={`${formId}-bank-name`}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="Bank Syariah Indonesia (BSI)">BSI (Bank Syariah Indonesia)</option>
                <option value="Bank Central Asia (BCA)">BCA</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank Rakyat Indonesia (BRI)">BRI</option>
                <option value="Bank Negara Indonesia (BNI)">BNI</option>
                <option value="Bank Muamalat">Bank Muamalat</option>
                <option value="Bank Jabar Banten (BJB)">BJB</option>
                <option value="Bank Lainnya">Bank Lainnya</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${formId}-acc-num`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Rekening
              </label>
              <input
                id={`${formId}-acc-num`}
                type="text"
                placeholder="Contoh: 7123456789"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div>
              <label htmlFor={`${formId}-acc-holder`} className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Atas Nama Pemilik Rekening
              </label>
              <input
                id={`${formId}-acc-holder`}
                type="text"
                placeholder="Sesuai buku tabungan"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Mengirim Pengajuan...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Klik Ajukan Donasi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
