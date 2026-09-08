import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Target, 
  CheckCircle2, 
  Users, 
  Heart,
  Sparkles,
  BookOpen,
  Scale,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  AlertTriangle,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { CmsConfig } from '../types';

interface AboutFoundationProps {
  cmsConfig: CmsConfig;
  onOpenVolunteer: () => void;
  onOpenTransparency: () => void;
}

type TabKey = 'sejarah' | 'visi_misi' | 'nilai' | 'legalitas';

export const AboutFoundation: React.FC<AboutFoundationProps> = ({
  cmsConfig,
  onOpenVolunteer,
  onOpenTransparency
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('sejarah');

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'sejarah', label: 'Sejarah & Profil', icon: BookOpen },
    { key: 'visi_misi', label: 'Visi & Misi', icon: Target },
    { key: 'nilai', label: 'Nilai PARAMIS', icon: Sparkles },
    { key: 'legalitas', label: 'Legalitas Resmi', icon: ShieldCheck }
  ];

  return (
    <section id="about-yayasan-section" className="w-full space-y-3 scroll-mt-20">
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-all">
        
        {/* Header Badge & Title */}
        <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-800 text-[11px] font-bold text-[#060ee3] dark:text-blue-300">
              <Building2 className="w-3.5 h-3.5" />
              <span>Profil & Sejarah Yayasan</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <BadgeCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              SK Kemenkumham Resmi
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {cmsConfig.yayasanName || 'Yayasan Prakarsa Hadji Abdul Muis'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Prakarsa Kemanusiaan Nyata Hadji Abdul Muis untuk Menaungi Semua Golongan
          </p>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/70 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-98 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-[#060ee3] dark:text-blue-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#060ee3] dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SEJARAH & PROFIL */}
        {activeTab === 'sejarah' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* Story text */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Prakarsa Kepedulian Sosial & Kemanusiaan Universal</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {cmsConfig.aboutStory}
              </p>
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tonggak Jejak Pengabdian</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-[#060ee3] dark:text-blue-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    01
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 dark:text-white leading-snug">
                      Prakarsa Inisiatif Hadji Abdul Muis
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Bermula dari kepedulian tulus Hadji Abdul Muis dalam menginisiasi gerakan sosial langsung untuk menyantuni anak yatim, lansia, dan warga prasejahtera di lingkungan sekitar secara berkelanjutan tanpa membeda-bedakan latar belakang.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    02
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 dark:text-white leading-snug">
                      Peletakan Badan Hukum Resmi (PARAMIS FOUNDATION)
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Diresmikan melalui akta notaris dan disahkan SK Kemenkumham RI sebagai yayasan sosial dan kemanusiaan untuk menjamin transparansi, akuntabilitas, dan tata kelola organisasi yang amanah.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    03
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 dark:text-white leading-snug">
                      Ekspansi Program Sosial & Pemberdayaan Mandiri
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Penyaluran paket bantuan pangan rutin, beasiswa pendidikan anak prasejahtera, tanggap darurat bencana kemanusiaan, serta pelatihan kerja gratis di Institut Paramis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeTab === 'visi_misi' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Visi */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#060ee3] dark:text-blue-300 uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Visi PARAMIS FOUNDATION</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "Menjadi lembaga sosial dan kemanusiaan terdepan di Indonesia yang berdaya guna, transparan, dan profesional dalam menaungi serta mengangkat harkat martabat seluruh masyarakat prasejahtera lintas agama dan golongan."
              </p>
            </div>

            {/* 4 Pilar Misi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>4 Pilar Misi & Program Utama</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-medium">Berdampak Nyata</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <span>1. Pendidikan Yatim & Dhuafa</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    Menjamin biaya sekolah, seragam, buku, dan beasiswa bagi anak yatim dan siswa prasejahtera agar masa depan mereka cerah.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>2. Pengembangan Skill & Pelatihan</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    Pelatihan keahlian vokasional, soft skill, dan literasi usaha gratis (Institut Paramis) agar janda, pemuda, dan warga prasejahtera berpenghasilan mandiri.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <span>3. Bantuan Sosial & Pangan</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    Penyaluran berkala sembako, santunan pangan, dan bantuan biaya hidup darurat untuk keluarga prasejahtera dan lansia sebatang kara.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>4. Tanggap Darurat Bencana</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    Relawan cepat tiba di lokasi bencana alam menyalurkan logistik, dapur umum, obat-obatan, dan pendampingan kemanusiaan terpadu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NILAI UTAMA (PARAMIS) */}
        {activeTab === 'nilai' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50">
              <h4 className="text-xs font-bold text-[#060ee3] dark:text-blue-300 mb-0.5">
                Tujuh Nilai Luhur Budaya Kerja (P-A-R-A-M-I-S)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Prinsip dasar yang dipegang teguh oleh seluruh pengurus, staf, dan relawan dalam mengemban amanah kemanusiaan untuk semua kalangan tanpa memandang perbedaan agama dan suku.
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { letter: 'P', name: 'Peduli', desc: 'Peka dan tanggap segera terhadap kesulitan sesama yang membutuhkan pertolongan.' },
                { letter: 'A', name: 'Amanah', desc: 'Menyalurkan setiap rupiah donasi dan bantuan sosial secara tepat sasaran tanpa potongan tersembunyi.' },
                { letter: 'R', name: 'Responsif', desc: 'Sigap dan cepat hadir memberikan pertolongan saat terjadi kedaruratan sosial maupun bencana alam.' },
                { letter: 'A', name: 'Adil', desc: 'Melayani dan mendistribusikan bantuan secara adil, merata, dan tulus tanpa membeda-bedakan suku, agama, ras, dan antar golongan.' },
                { letter: 'M', name: 'Mandiri', desc: 'Memberdayakan warga prasejahtera melalui keterampilan terapan agar mampu mandiri dan memiliki penghasilan sendiri.' },
                { letter: 'I', name: 'Inklusif', desc: 'Terbuka merangkul semua saudara sebangsa dari berbagai latar belakang keyakinan dalam payung kemanusiaan.' },
                { letter: 'S', name: 'Solidaritas', desc: 'Menjunjung tinggi persaudaraan universal, toleransi, dan semangat gotong royong demi kebaikan bersama.' }
              ].map((item, idx) => (
                <div 
                  key={`${item.letter}-${item.name}-${idx}`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#060ee3] text-white font-black text-xs flex items-center justify-center shrink-0">
                    {item.letter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 dark:text-white mr-1.5">{item.name}:</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEGALITAS & TATA KELOLA */}
        {activeTab === 'legalitas' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">SK Kemenkumham RI:</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                  {cmsConfig.skKemenkumham || 'AHU-0012948.AH.01.04.Tahun 2021'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sah & Berbadan Hukum
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">Nomor Pokok Wajib Pajak (NPWP):</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                  {cmsConfig.npwp || '81.492.102.8-412.000'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Wajib Pajak Lembaga Resmi
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">Izin Operasional Lembaga:</span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                  {cmsConfig.izinOperasional || 'DINSOS/PPKS/048/2022'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Rekomendasi Dinas Sosial
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">Audit Laporan Keuangan:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  KAP Independen (WTP)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Opini Wajar Tanpa Pengecualian
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Seluruh dana donasi dan bantuan kemanusiaan disalurkan melalui rekening resmi yayasan dan dipertanggungjawabkan secara berkala di hadapan Dewan Pembina dan Pengawas Yayasan secara transparan dan akuntabel.
              </p>
            </div>
          </div>
        )}

        {/* Action Button Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenTransparency}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98"
          >
            <FileText className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400" />
            <span>Laporan Transparansi & Audit</span>
          </button>

          <button
            type="button"
            onClick={onOpenVolunteer}
            className="w-full py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-98"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gabung Relawan Kemanusiaan</span>
          </button>
        </div>

      </div>
    </section>
  );
};
