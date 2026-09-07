import React, { useState, useRef } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Clock,
  Sparkles, 
  Download, 
  Plus, 
  Tag,
  Camera,
  Upload,
  Trash2,
  PenTool
} from 'lucide-react';
import { CampaignCategory, VolunteerApplicant } from '../types';
import { registerVolunteer, updateVolunteerAvatar } from '../services/storage';
import { CitySelector } from './CitySelector';
import { VolunteerKtaCard } from './VolunteerKtaCard';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: CampaignCategory;
}

const AVAILABLE_SKILLS = [
  'Pemeriksaan Medis & P3K',
  'Trauma Healing & Konseling',
  'Penyaluran & Logistik Cepat',
  'Pengajaran & Edukasi Anak',
  'Dapur Umum & Masak Higienis',
  'Dokumentasi & Media Sosial',
  'Teknologi Informasi / Web',
  'Pengemudi Siaga Ambulans',
  'Manajemen Posko & Humas',
  'Teknis, Listrik & Pertukangan'
];

const INTEREST_CATEGORIES: { id: CampaignCategory; label: string; icon: string }[] = [
  { id: 'bencana', label: 'Tanggap Darurat Bencana', icon: '🚨' },
  { id: 'kesehatan', label: 'Kesehatan & Medis', icon: '🩺' },
  { id: 'pendidikan', label: 'Pendidikan & Literasi', icon: '📚' },
  { id: 'yatim', label: 'Santunan Yatim & Duafa', icon: '🤲' },
  { id: 'dakwah', label: 'Sosial & Keagamaan', icon: '🕌' },
  { id: 'ekonomi', label: 'Pemberdayaan Ekonomi', icon: '💼' }
];

const QUICK_SKILL_SUGGESTIONS = [
  'Ahli Gizi / Pangan',
  'Bahasa Isyarat / Difabel',
  'Pilot Drone / Aerial',
  'SAR & Penyelam',
  'Hukum & Advokasi',
  'Mekanik & Montir Armada',
  'Akuntansi & Audit Donasi'
];

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'bencana'
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jakarta Pusat');
  const [age, setAge] = useState<number>(24);
  const [profession, setProfession] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Penyaluran & Logistik Cepat']);
  const [interestCategory, setInterestCategory] = useState<CampaignCategory>(defaultCategory);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [motivation, setMotivation] = useState('');
  const [availability, setAvailability] = useState<'weekdays' | 'weekends' | 'flexible' | 'emergency'>('flexible');
  const customInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [registeredResult, setRegisteredResult] = useState<{
    volunteer: VolunteerApplicant;
    passedAutoVerification: boolean;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Format file harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setAvatarUrl(result);
      }
    };
    reader.onerror = () => {
      setAvatarError('Gagal membaca file foto.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleQuickAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !motivation) {
      alert('Mohon lengkapi formulir pendaftaran relawan.');
      return;
    }

    // Merge any pending custom skill text typed in the box
    let finalSkills = [...selectedSkills];
    const pendingText = customSkillInput.trim();
    if (pendingText && !finalSkills.includes(pendingText)) {
      finalSkills.push(pendingText);
    }

    if (finalSkills.length === 0) {
      finalSkills = ['Relawan Tanggap Sosial'];
    }

    setIsProcessing(true);
    setTimeout(() => {
      // HANYA ADMIN yang bisa ACC kelulusan relawan
      const res = registerVolunteer({
        fullName,
        email,
        phone,
        city,
        age: Number(age),
        profession: profession || 'Masyarakat Umum',
        skills: finalSkills,
        interestCategory,
        motivation,
        availability,
        avatarUrl: avatarUrl || undefined
      });
      setIsProcessing(false);
      setRegisteredResult(res);
    }, 600);
  };

  const handleAvatarUpdatedOnKta = (newAvatar: string) => {
    if (registeredResult) {
      updateVolunteerAvatar(registeredResult.volunteer.id, newAvatar);
      setRegisteredResult({
        ...registeredResult,
        volunteer: {
          ...registeredResult.volunteer,
          avatarUrl: newAvatar
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        id="volunteer-modal-container"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#060ee3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="text-sm font-bold">
                {registeredResult ? 'Status Pendaftaran & E-KTA Relawan' : 'Pendaftaran Relawan PARAMIS'}
              </h3>
              <p className="text-[11px] text-blue-100">
                Yayasan Prakarsa Hadji Abdul Muis
              </p>
            </div>
          </div>

          <button
            id="btn-close-volunteer-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          {!registeredResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Intro banner */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#060ee3] dark:text-blue-300">
                    Pendaftaran Relawan Resmi (Verifikasi & ACC oleh Admin)
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    Setiap pendaftaran relawan akan ditinjau dan di-ACC langsung oleh Admin Yayasan. Pastikan melengkapi data dan upload foto profil untuk Kartu Tanda Anggota (E-KTA) Anda.
                  </p>
                </div>
              </div>

              {/* UPLOAD FOTO PROFIL UNTUK KTA */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Foto Profil (Untuk Kartu E-KTA Relawan)
                  </label>
                  <span className="text-[10px] text-slate-400">Opsional / Bisa Diupload</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 border-2 border-dashed border-blue-300 dark:border-blue-700 overflow-hidden flex items-center justify-center shrink-0 relative group">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Foto Profil Relawan" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-5 h-5 text-[#060ee3] dark:text-blue-400" />
                        <span className="text-[8px] mt-0.5">Pas Foto</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                      Foto wajah tampak depan untuk dicetak pada Kartu Tanda Anggota (E-KTA) resmi Anda.
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{avatarUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <input 
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {avatarError && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    ⚠️ {avatarError}
                  </p>
                )}
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap (Sesuai KTP) *
                  </label>
                  <input
                    id="input-volunteer-name"
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Ilham Pratama"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Aktif *
                    </label>
                    <input
                      id="input-volunteer-email"
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp / HP *
                    </label>
                    <input
                      id="input-volunteer-phone"
                      type="tel"
                      required
                      placeholder="0812xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>
                </div>

                {/* KOTA / DOMISILI DENGAN CITY SELECTOR (Pilihan, Manual, Otomatis) */}
                <CitySelector 
                  value={city}
                  onChange={setCity}
                  idPrefix="form-volunteer"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Usia (Tahun) *
                    </label>
                    <input
                      id="input-volunteer-age"
                      type="number"
                      required
                      min={15}
                      max={70}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Profesi / Pekerjaan
                    </label>
                    <input
                      id="input-volunteer-profession"
                      type="text"
                      placeholder="Contoh: Mahasiswa / Tenaga Medis"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>
                </div>

                {/* Minat Bidang Aksi Sosial */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Minat Bidang Aksi Sosial (Fokus Pengabdian) *
                    </label>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      Pilih 1 bidang utama
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {INTEREST_CATEGORIES.map((cat) => {
                      const isSelected = interestCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setInterestCategory(cat.id)}
                          className={`p-2 rounded-xl text-[11px] font-medium text-left border transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/70 border-[#060ee3] text-[#060ee3] dark:text-blue-300 font-bold shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-sm shrink-0">{cat.icon}</span>
                          <span className="truncate flex-1">{cat.label}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Keahlian & Minat */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilih Keahlian & Minat Aksi Sosial
                    </label>
                    <span className="text-[10px] text-slate-500">Bisa pilih lebih dari 1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {AVAILABLE_SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`p-2 rounded-xl text-[11px] text-left border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950 border-[#060ee3] text-[#060ee3] dark:text-blue-300 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className="truncate mr-1">{skill}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Skill Input */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <PenTool className="w-3 h-3 text-[#060ee3]" />
                        <span>Keahlian Lainnya (Bisa Diisi Manual):</span>
                      </label>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Bebas ketik</span>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        ref={customInputRef}
                        type="text"
                        placeholder="Ketik keahlian Anda, lalu klik Tambah..."
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="px-3 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>

                    {/* Quick suggestion tags that can be clicked to add */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                        Contoh keahlian yang bisa langsung ditambahkan:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {QUICK_SKILL_SUGGESTIONS.map((suggestion) => {
                          const isAlreadyAdded = selectedSkills.includes(suggestion);
                          return (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => {
                                if (isAlreadyAdded) {
                                  removeSkill(suggestion);
                                } else {
                                  handleQuickAddSkill(suggestion);
                                }
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                isAlreadyAdded
                                  ? 'bg-[#060ee3] border-[#060ee3] text-white font-bold'
                                  : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                              }`}
                            >
                              <span>{isAlreadyAdded ? '✓' : '+'}</span>
                              <span>{suggestion}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Active Selected & Filled Skills Display */}
                  {selectedSkills.length > 0 && (
                    <div className="pt-1.5 pb-0.5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#060ee3]" />
                          <span>Keahlian yang Dipilih & Diisi ({selectedSkills.length}):</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Klik ✕ untuk batal</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/80 dark:bg-blue-950/80 text-[#060ee3] dark:text-blue-300 text-[11px] font-semibold border border-blue-200 dark:border-blue-800"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="w-3.5 h-3.5 rounded-full hover:bg-blue-300/60 dark:hover:bg-blue-800/60 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-rose-600"
                              aria-label={`Hapus ${skill}`}
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ketersediaan Waktu Pengabdian
                  </label>
                  <select
                    id="select-volunteer-availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  >
                    <option value="flexible">Fleksibel (Kapanpun Dibutuhkan)</option>
                    <option value="weekends">Hanya Akhir Pekan (Sabtu - Minggu)</option>
                    <option value="weekdays">Hari Kerja (Senin - Jumat)</option>
                    <option value="emergency">Siaga Khusus Tanggap Darurat Bencana</option>
                  </select>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Motivasi Bergabung * (Min. 25 Karakter)
                  </label>
                  <textarea
                    id="input-volunteer-motivation"
                    required
                    rows={3}
                    placeholder="Mengapa Anda ingin menjadi bagian dari relawan PARAMIS FOUNDATION?"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Akan ditinjau & di-ACC langsung oleh Tim Admin</span>
                    <span>{motivation.length} karakter</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-volunteer"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Menyimpan formulir pendaftaran relawan...</span>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Kirim Pendaftaran Relawan (Menunggu ACC Admin)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* RESULT SCREEN: STATUS PENDAFTARAN & KARTU TANDA ANGGOTA */
            <div className="space-y-4">
              {/* Status banner - Admin Review Pending */}
              <div className="p-4 rounded-2xl border text-center bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 shadow-sm bg-amber-500 text-white">
                  <Clock className="w-6 h-6" />
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Pendaftaran Berhasil Dikirim!
                </h4>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700 my-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Status: Menunggu ACC Admin</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Berkas pendaftaran Anda telah tercatat di sistem. Sesuai ketentuan, <strong>hanya Admin Yayasan</strong> yang berwenang meninjau dan memutuskan ACC/kelulusan relawan sebelum E-KTA aktif resmi.
                </p>
              </div>

              {/* KARTU TANDA ANGGOTA (E-KTA) COMPONENT DENGAN FITUR UPLOAD FOTO LANGSUNG */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Preview Kartu Tanda Anggota (E-KTA) Relawan:
                  </h5>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                    Bisa ganti foto langsung di kartu
                  </span>
                </div>

                <VolunteerKtaCard 
                  volunteer={registeredResult.volunteer}
                  onAvatarUpdated={handleAvatarUpdatedOnKta}
                  allowEditPhoto={true}
                />
              </div>

              {/* Action */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Bukti pendaftaran relawan telah dikirim ke email: ${registeredResult.volunteer.email}. Mohon menunggu konfirmasi ACC dari Admin Yayasan.`)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Kirim ke Email</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Selesai & Tutup</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
