import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  BookOpen, 
  Lock, 
  HeartHandshake, 
  Users, 
  Heart, 
  ShieldCheck, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Share2, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  MessageCircle, 
  Mail,
  Scale,
  Building2
} from 'lucide-react';
import { CmsConfig } from '../types';
import { LEGAL_ARTICLES, LegalArticle } from '../data/legalArticlesData';

interface LegalTermsViewProps {
  cmsConfig: CmsConfig;
  onBackToHome: () => void;
  initialArticleId?: string;
}

export const LegalTermsView: React.FC<LegalTermsViewProps> = ({
  cmsConfig,
  onBackToHome,
  initialArticleId
}) => {
  // Current active article state (default to first article if not specified)
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    if (initialArticleId && LEGAL_ARTICLES.some(a => a.id === initialArticleId)) {
      return initialArticleId;
    }
    return LEGAL_ARTICLES[0].id;
  });

  // Dropdown open/close state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search keyword inside article
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Copy link feedback state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Find active article
  const currentArticleIndex = LEGAL_ARTICLES.findIndex(a => a.id === selectedArticleId);
  const currentArticle: LegalArticle = LEGAL_ARTICLES[currentArticleIndex] || LEGAL_ARTICLES[0];

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Handle article change
  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsDropdownOpen(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous & Next Article Navigation
  const handlePrevArticle = () => {
    if (currentArticleIndex > 0) {
      handleSelectArticle(LEGAL_ARTICLES[currentArticleIndex - 1].id);
    }
  };

  const handleNextArticle = () => {
    if (currentArticleIndex < LEGAL_ARTICLES.length - 1) {
      handleSelectArticle(LEGAL_ARTICLES[currentArticleIndex + 1].id);
    }
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#terms-${currentArticle.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // Helper to render icon dynamically
  const renderArticleIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Lock':
        return <Lock className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'FileText':
      default:
        return <FileText className={className} />;
    }
  };

  // Filter sections if search query is entered
  const filteredSections = searchQuery.trim()
    ? currentArticle.sections.filter(sec => 
        sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sec.paragraphs.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sec.listItems && sec.listItems.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : currentArticle.sections;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
          aria-label="Kembali ke Beranda"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Beranda</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#060ee3] dark:text-blue-400 block">
            Pusat Legalitas & Kebijakan
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {cmsConfig.brandName || "PARAMIS FOUNDATION"}
          </span>
        </div>
      </div>

      {/* Main Legal Authority Hero Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#060ee3] via-[#050cc0] to-[#030678] text-white shadow-md relative overflow-hidden space-y-3">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold text-blue-100 flex items-center gap-1">
            <Scale className="w-3 h-3 text-emerald-300" />
            <span>Kepatuhan Hukum RI</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-mono text-blue-100">
            {cmsConfig.skKemenkumham || "SK Kemenkumham Terdaftar"}
          </span>
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-bold leading-tight">
            Syarat, Ketentuan & Kebijakan Layanan
          </h1>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Pedoman resmi hak, kewajiban, transparansi penyaluran, dan perlindungan data bagi seluruh donatur, penggalang dana, dan relawan Yayasan Prakarsa Hadji Abdul Muis.
          </p>
        </div>

        <div className="pt-1 flex items-center gap-2 text-[11px] text-blue-200 border-t border-white/15">
          <Building2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
          <span className="truncate">{cmsConfig.yayasanName}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DROPDOWN SELECTOR KETENTUAN (Sesuai instruksi: dibuat dropdown agar tidak menumpuk) */}
      {/* ========================================================================= */}
      <div className="space-y-1.5" ref={dropdownRef}>
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Pilih Dokumen Ketentuan</span>
            <span className="text-[10px] font-normal text-slate-400">
              ({currentArticleIndex + 1} dari {LEGAL_ARTICLES.length})
            </span>
          </label>
          <span className="text-[10px] text-[#060ee3] dark:text-blue-400 font-semibold">
            Mode Dropdown
          </span>
        </div>

        {/* Interactive Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#060ee3]/30 dark:border-blue-500/40 hover:border-[#060ee3] dark:hover:border-blue-400 shadow-sm transition-all text-left cursor-pointer group active:scale-[0.99]"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#060ee3] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                {renderArticleIcon(currentArticle.iconName, 'w-5 h-5')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 text-[9px] font-bold uppercase tracking-wider">
                    {currentArticle.categoryBadge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Dokumen #{currentArticleIndex + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {currentArticle.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 pl-2 shrink-0">
              <span className="text-xs font-bold text-[#060ee3] dark:text-blue-400 hidden sm:inline">
                Pilih Menu
              </span>
              <div className={`p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 bg-blue-100 text-[#060ee3]' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Expanded Dropdown Menu List */}
          {isDropdownOpen && (
            <div 
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex justify-between items-center">
                <span>Daftar 7 Dokumen Kebijakan & Ketentuan</span>
                <span className="text-[#060ee3] dark:text-blue-400">Klik untuk Buka</span>
              </div>

              {LEGAL_ARTICLES.map((article, index) => {
                const isSelected = article.id === selectedArticleId;
                return (
                  <button
                    key={article.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectArticle(article.id)}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-[#060ee3] dark:text-blue-300 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-[#060ee3] text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {renderArticleIcon(article.iconName, 'w-4 h-4')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold leading-tight">
                          {index + 1}. {article.title}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {article.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Native Mobile Quick-Select (Accessible Alternative) */}
        <div className="pt-1">
          <label htmlFor="native-legal-select" className="sr-only">
            Pilih Halaman Kebijakan Cepat
          </label>
          <select
            id="native-legal-select"
            value={selectedArticleId}
            onChange={(e) => handleSelectArticle(e.target.value)}
            className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
          >
            {LEGAL_ARTICLES.map((article, idx) => (
              <option key={article.id} value={article.id}>
                {idx + 1}. {article.title} ({article.categoryBadge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE ARTICLE VIEW (Hanya dokumen terpilih yang tampil agar tidak menumpuk) */}
      {/* ========================================================================= */}
      <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 sm:p-6 space-y-5">
        
        {/* Article Header & Metadata */}
        <header className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/60">
              {currentArticle.categoryBadge}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                {currentArticle.lastUpdated}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                title="Salin Tautan Dokumen Ini"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {currentArticle.title}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentArticle.subtitle}
          </p>

          {/* Quick Summary Callout */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Ringkasan Kebijakan
            </span>
            <p className="leading-relaxed text-[11.5px]">
              {currentArticle.summary}
            </p>
          </div>

          {/* In-Article Search Bar */}
          <div className="relative pt-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-5" />
            <input
              type="text"
              placeholder={`Cari kata kunci dalam ${currentArticle.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-5 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </header>

        {/* Article Body Sections */}
        <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {filteredSections.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 stroke-[1.5]" />
              <p>Tidak ditemukan bagian yang cocok dengan kata kunci "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#060ee3] dark:text-blue-400 cursor-pointer"
              >
                Tampilkan Seluruh Isi
              </button>
            </div>
          ) : (
            filteredSections.map((section, idx) => (
              <section key={idx} className="space-y-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white border-l-3 border-[#060ee3] dark:border-blue-400 pl-2.5 py-0.5">
                  {section.title}
                </h3>

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.listItems && section.listItems.length > 0 && (
                  <ul className="space-y-1.5 pl-2 pt-1">
                    {section.listItems.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#060ee3] dark:bg-blue-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 mt-2 ${
                    section.callout.type === 'warning'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                      : section.callout.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                      : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200'
                  }`}>
                    {section.callout.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : section.callout.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug font-medium">
                      {section.callout.text}
                    </span>
                  </div>
                )}
              </section>
            ))
          )}
        </div>

        {/* Bottom Sequential Article Navigation */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevArticle}
            disabled={currentArticleIndex === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="truncate">Sebelumnya</span>
          </button>

          <span className="text-[10px] font-mono text-slate-400 px-2 shrink-0">
            {currentArticleIndex + 1} / {LEGAL_ARTICLES.length}
          </span>

          <button
            type="button"
            onClick={handleNextArticle}
            disabled={currentArticleIndex === LEGAL_ARTICLES.length - 1}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span className="truncate">Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>

      {/* Official Legal Helpdesk & Whistleblower Card */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Pusat Bantuan & Pengaduan Legalitas
          </h4>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Memiliki pertanyaan terkait klausul Syarat & Ketentuan, atau hendak melaporkan dugaan penyalahgunaan donasi? Tim hukum dan kepatuhan PARAMIS siap melayani Anda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <a
            href={`https://wa.me/${(cmsConfig.whatsapp || "085195555674").replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Tim Legal PARAMIS, saya ingin berkonsultasi mengenai: ${currentArticle.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Tim Legal</span>
          </a>

          <a
            href={`mailto:${cmsConfig.email || "email@paramis.or.id"}?subject=${encodeURIComponent(`Pertanyaan Legalitas: ${currentArticle.title}`)}`}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span>Kirim Email Pengaduan</span>
          </a>
        </div>
      </div>
    </div>
  );
};
