import React, { useState } from 'react';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileText,
  Type
} from 'lucide-react';
import { CmsConfig } from '../../types';
import { updateCmsConfig } from '../../services/storage';
import { INITIAL_CMS_CONFIG } from '../../data/initialData';

interface AdminWebsiteContentViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

export const AdminWebsiteContentView: React.FC<AdminWebsiteContentViewProps> = ({
  cmsConfig,
  onConfigSaved
}) => {
  // Website Identity
  const [yayasanName, setYayasanName] = useState(cmsConfig.yayasanName || 'Yayasan Prakarsa Hadji Abdul Muis');
  const [brandName, setBrandName] = useState(cmsConfig.brandName || 'PARAMIS FOUNDATION');
  const [tagline, setTagline] = useState(cmsConfig.tagline || 'Menebar Kebaikan Berkelanjutan, Menegakkan Martabat Ummat');
  const [aboutStory, setAboutStory] = useState(cmsConfig.aboutStory || '');
  const [vision, setVision] = useState(cmsConfig.vision || '');
  
  // Hero Banner
  const [heroBannerTitle, setHeroBannerTitle] = useState(cmsConfig.heroBannerTitle || 'Ulurkan Tanganmu, Ciptakan Perubahan');
  const [heroBannerSubtitle, setHeroBannerSubtitle] = useState(
    cmsConfig.heroBannerSubtitle || 'Bukan seberapa besar yang kita beri, tapi seberapa tulus hati yang menyertai.'
  );

  // Section Titles (bagian per bagian)
  const defaultTitles = INITIAL_CMS_CONFIG.sectionTitles || {
    urgentProgramsTitle: 'Bantuan Mendesak & Tanggap Darurat',
    urgentProgramsSubtitle: 'Program prioritas dengan urgensi tinggi yang membutuhkan uluran tangan kita segera',
    catalogTitle: 'Katalog Penggalangan Dana',
    catalogSubtitle: 'Pilih dan salurkan donasi terbaik Anda untuk program kemanusiaan yang terpercaya',
    servicesTitle: 'Pilar Layanan Sosial Yayasan',
    servicesSubtitle: 'Inisiatif terarah untuk mewujudkan kemandirian, pendidikan, dan kesehatan umat',
    transparencyTitle: 'Laporan Penyaluran & Akuntabilitas Terbuka',
    transparencySubtitle: 'Bukti nyata amanah donatur yang kami salurkan secara langsung dan bertanggung jawab',
    volunteersTitle: 'Mari Bergabung Menjadi Relawan Kebaikan',
    volunteersSubtitle: 'Jadilah bagian dari pejuang kemanusiaan yang bergerak nyata di garis terdepan'
  };

  const [sectionTitles, setSectionTitles] = useState({
    urgentProgramsTitle: cmsConfig.sectionTitles?.urgentProgramsTitle || defaultTitles.urgentProgramsTitle || '',
    urgentProgramsSubtitle: cmsConfig.sectionTitles?.urgentProgramsSubtitle || defaultTitles.urgentProgramsSubtitle || '',
    catalogTitle: cmsConfig.sectionTitles?.catalogTitle || defaultTitles.catalogTitle || '',
    catalogSubtitle: cmsConfig.sectionTitles?.catalogSubtitle || defaultTitles.catalogSubtitle || '',
    servicesTitle: cmsConfig.sectionTitles?.servicesTitle || defaultTitles.servicesTitle || '',
    servicesSubtitle: cmsConfig.sectionTitles?.servicesSubtitle || defaultTitles.servicesSubtitle || '',
    transparencyTitle: cmsConfig.sectionTitles?.transparencyTitle || defaultTitles.transparencyTitle || '',
    transparencySubtitle: cmsConfig.sectionTitles?.transparencySubtitle || defaultTitles.transparencySubtitle || '',
    volunteersTitle: cmsConfig.sectionTitles?.volunteersTitle || defaultTitles.volunteersTitle || '',
    volunteersSubtitle: cmsConfig.sectionTitles?.volunteersSubtitle || defaultTitles.volunteersSubtitle || ''
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateCmsConfig({
      yayasanName,
      brandName,
      tagline,
      aboutStory,
      vision,
      heroBannerTitle,
      heroBannerSubtitle,
      sectionTitles
    });
    onConfigSaved(updated);
    showNotification('Seluruh isi website & judul bagian per bagian berhasil diperbarui!');
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset seluruh teks isi website ke pengaturan standar yayasan?')) {
      setYayasanName(INITIAL_CMS_CONFIG.yayasanName);
      setBrandName(INITIAL_CMS_CONFIG.brandName);
      setTagline(INITIAL_CMS_CONFIG.tagline);
      setAboutStory(INITIAL_CMS_CONFIG.aboutStory);
      setVision(INITIAL_CMS_CONFIG.vision || '');
      setHeroBannerTitle(INITIAL_CMS_CONFIG.heroBannerTitle);
      setHeroBannerSubtitle(INITIAL_CMS_CONFIG.heroBannerSubtitle);
      setSectionTitles({
        urgentProgramsTitle: defaultTitles.urgentProgramsTitle || '',
        urgentProgramsSubtitle: defaultTitles.urgentProgramsSubtitle || '',
        catalogTitle: defaultTitles.catalogTitle || '',
        catalogSubtitle: defaultTitles.catalogSubtitle || '',
        servicesTitle: defaultTitles.servicesTitle || '',
        servicesSubtitle: defaultTitles.servicesSubtitle || '',
        transparencyTitle: defaultTitles.transparencyTitle || '',
        transparencySubtitle: defaultTitles.transparencySubtitle || '',
        volunteersTitle: defaultTitles.volunteersTitle || '',
        volunteersSubtitle: defaultTitles.volunteersSubtitle || ''
      });

      const updated = updateCmsConfig({
        yayasanName: INITIAL_CMS_CONFIG.yayasanName,
        brandName: INITIAL_CMS_CONFIG.brandName,
        tagline: INITIAL_CMS_CONFIG.tagline,
        aboutStory: INITIAL_CMS_CONFIG.aboutStory,
        vision: INITIAL_CMS_CONFIG.vision,
        heroBannerTitle: INITIAL_CMS_CONFIG.heroBannerTitle,
        heroBannerSubtitle: INITIAL_CMS_CONFIG.heroBannerSubtitle,
        sectionTitles: defaultTitles
      });
      onConfigSaved(updated);
      showNotification('Teks isi website berhasil dikembalikan ke standar.');
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Website Content & Section Editor
          </span>
          <h2 className="text-xl font-bold mt-1">Edit Isi Website & Judul Bagian per Bagian</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
            Kustomisasi narasi utama, slogan yayasan, headline banner hero, cerita profil, dan judul serta sub-judul setiap bagian beranda website secara dinamis.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: IDENTITAS & BRANDING UTAMA */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Type className="w-4 h-4 text-[#060ee3]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            1. Identitas, Nama Yayasan & Slogan Utama
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Resmi Yayasan (Badan Hukum)
            </label>
            <input
              type="text"
              value={yayasanName}
              onChange={(e) => setYayasanName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Brand Publik (Singkat / Populer)
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tagline / Slogan Inspiratif Yayasan
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Menebar Kebaikan Berkelanjutan, Menegakkan Martabat Ummat"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tentang Yayasan & Narasi Profil Singkat
            </label>
            <textarea
              rows={3}
              value={aboutStory}
              onChange={(e) => setAboutStory(e.target.value)}
              placeholder="Ceritakan latar belakang berdirinya yayasan dan kepedulian sosial..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Visi Yayasan
            </label>
            <textarea
              rows={2}
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="Menjadi lembaga filantropi Islam dan kemanusiaan terdepan..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: HERO BANNER UTAMA */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            2. Teks Banner Utama (Hero Section Beranda)
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul Utama Hero (Headline Banner)
            </label>
            <input
              type="text"
              value={heroBannerTitle}
              onChange={(e) => setHeroBannerTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sub-Judul Hero (Deskripsi Singkat Ajakan Donasi)
            </label>
            <textarea
              rows={2}
              value={heroBannerSubtitle}
              onChange={(e) => setHeroBannerSubtitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: JUDUL BAGIAN PER BAGIAN WEBSITE */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Layers className="w-4 h-4 text-indigo-500" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              3. Edit Judul & Subjudul Bagian per Bagian Website
            </h3>
            <p className="text-[11px] text-slate-500">
              Ubah teks judul dan keterangan untuk setiap blok tampilan yang ada di halaman utama
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 3.1 Urgent Programs */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Bagian Program Mendesak
            </span>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Judul Bagian</label>
              <input
                type="text"
                value={sectionTitles.urgentProgramsTitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, urgentProgramsTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Subjudul / Keterangan</label>
              <input
                type="text"
                value={sectionTitles.urgentProgramsSubtitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, urgentProgramsSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          </div>

          {/* 3.2 Donation Catalog */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Bagian Katalog Donasi
            </span>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Judul Bagian</label>
              <input
                type="text"
                value={sectionTitles.catalogTitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, catalogTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Subjudul / Keterangan</label>
              <input
                type="text"
                value={sectionTitles.catalogSubtitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, catalogSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          </div>

          {/* 3.3 Services / Program Yayasan */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Bagian Layanan & Program Yayasan
            </span>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Judul Bagian</label>
              <input
                type="text"
                value={sectionTitles.servicesTitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, servicesTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Subjudul / Keterangan</label>
              <input
                type="text"
                value={sectionTitles.servicesSubtitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, servicesSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          </div>

          {/* 3.4 Transparency Reports */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Bagian Laporan Transparansi
            </span>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Judul Bagian</label>
              <input
                type="text"
                value={sectionTitles.transparencyTitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, transparencyTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Subjudul / Keterangan</label>
              <input
                type="text"
                value={sectionTitles.transparencySubtitle}
                onChange={(e) => setSectionTitles({ ...sectionTitles, transparencySubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          </div>

          {/* 3.5 Volunteers Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Bagian Banner Relawan
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Judul Bagian</label>
                <input
                  type="text"
                  value={sectionTitles.volunteersTitle}
                  onChange={(e) => setSectionTitles({ ...sectionTitles, volunteersTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Subjudul / Keterangan</label>
                <input
                  type="text"
                  value={sectionTitles.volunteersSubtitle}
                  onChange={(e) => setSectionTitles({ ...sectionTitles, volunteersSubtitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleResetToDefault}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
        >
          Reset Pengaturan
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-2xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Isi Website</span>
        </button>
      </div>
    </form>
  );
};
