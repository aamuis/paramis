import React, { useState } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Heart,
  QrCode,
  Download
} from 'lucide-react';
import { CampaignCategory, VolunteerApplicant } from '../types';
import { registerVolunteer } from '../services/storage';
import { ParamisLogo } from './ParamisLogo';

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
  'Pengemudi Siaga Ambulans'
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
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Penyaluran & Logistik Cepat']);
  const [interestCategory, setInterestCategory] = useState<CampaignCategory>(defaultCategory);
  const [motivation, setMotivation] = useState('');
  const [availability, setAvailability] = useState<'weekdays' | 'weekends' | 'flexible' | 'emergency'>('flexible');

  const [registeredResult, setRegisteredResult] = useState<{
    volunteer: VolunteerApplicant;
    passedAutoVerification: boolean;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !motivation) {
      alert('Mohon lengkapi formulir pendaftaran relawan.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = registerVolunteer({
        fullName,
        email,
        phone,
        city,
        age: Number(age),
        profession: profession || 'Masyarakat Umum',
        skills: selectedSkills,
        interestCategory,
        motivation,
        availability
      });
      setIsProcessing(false);
      setRegisteredResult(res);
    }, 700);
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
                {registeredResult ? 'Status Verifikasi Relawan' : 'Pendaftaran Relawan PARAMIS'}
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
                <Sparkles className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#060ee3] dark:text-blue-300">
                    Sistem Verifikasi Otomatis Terpadu
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                    Sistem akan memverifikasi kualifikasi, keahlian, dan kesiapan Anda secara real-time. Relawan yang lolos otomatis akan langsung diterbitkan E-KTA resmi PARAMIS FOUNDATION.
                  </p>
                </div>
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kota / Domisili *
                    </label>
                    <input
                      id="input-volunteer-city"
                      type="text"
                      required
                      placeholder="Contoh: Jakarta Pusat"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>

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
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profesi / Latar Belakang
                  </label>
                  <input
                    id="input-volunteer-profession"
                    type="text"
                    placeholder="Contoh: Mahasiswa / Tenaga Kesehatan / Karyawan Swasta"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                </div>

                {/* Skills Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pilih Keahlian & Minat Aksi Sosial
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {AVAILABLE_SKILLS.map((skill) => {
                      const isChecked = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`p-2 rounded-xl text-[11px] font-medium text-left border transition-all cursor-pointer flex items-center justify-between ${
                            isChecked
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-[#060ee3] text-[#060ee3] dark:text-blue-300 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span className="truncate pr-1">{skill}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#060ee3] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
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
                    <span>Diperiksa oleh algoritma verifikasi otomatis</span>
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
                  <span>Menjalankan sistem verifikasi otomatis...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Daftar & Jalankan Verifikasi Otomatis</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* RESULT SCREEN: VERIFICATION DETAILS & OFFICIAL DIGITAL E-KTA */
            <div className="space-y-4">
              {/* Status banner */}
              <div className={`p-4 rounded-2xl border text-center ${
                registeredResult.passedAutoVerification
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 shadow-sm ${
                  registeredResult.passedAutoVerification 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-amber-500 text-white'
                }`}>
                  <Award className="w-6 h-6" />
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {registeredResult.passedAutoVerification 
                    ? 'Selamat! Verifikasi Otomatis Berhasil' 
                    : 'Pendaftaran Telah Diterima (Review Tim)'}
                </h4>

                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Skor Verifikasi Sistem:
                  </span>
                  <span className="text-sm font-black text-[#060ee3] dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {registeredResult.volunteer.verificationScore} / 100
                  </span>
                </div>
              </div>

              {/* Verification Audit Trail Notes */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Evaluasi Sistem Otomatis:
                </span>
                {registeredResult.volunteer.verificationNotes.map((note, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              {/* OFFICIAL DIGITAL E-KTA RELAWAN PARAMIS FOUNDATION */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#060ee3] via-[#050ca8] to-[#020538] text-white shadow-xl border border-blue-400/40 relative overflow-hidden">
                {/* Hologram badge watermark */}
                <div className="absolute top-2 right-2 opacity-15">
                  <ShieldCheck className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-start border-b border-white/20 pb-3">
                  <div>
                    <ParamisLogo variant="white" size="xs" />
                    <span className="text-[9px] uppercase tracking-widest text-blue-200 font-semibold block mt-0.5">
                      KARTU TANDA ANGGOTA RELAWAN
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold">
                      TERVERIFIKASI
                    </span>
                  </div>
                </div>

                <div className="py-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center font-bold text-lg text-white shrink-0">
                    {registeredResult.volunteer.fullName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-bold text-white truncate">
                      {registeredResult.volunteer.fullName}
                    </h5>
                    <p className="text-[11px] text-blue-100 truncate">
                      {registeredResult.volunteer.profession} • {registeredResult.volunteer.city}
                    </p>
                    <p className="text-[10px] font-mono text-blue-200 mt-1">
                      ID: {registeredResult.volunteer.idCardNumber}
                    </p>
                  </div>

                  <div className="p-1 bg-white rounded-lg shadow-sm shrink-0">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/15 flex justify-between items-center text-[9px] text-blue-200">
                  <span>Yayasan Prakarsa Hadji Abdul Muis</span>
                  <span>Berlaku s/d: Desember 2027</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert(`E-KTA dan surat tugas relawan telah dikirim ke email: ${registeredResult.volunteer.email}`)}
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
