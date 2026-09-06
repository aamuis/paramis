import React, { useState } from 'react';
import { 
  FileText, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  ChevronDown, 
  ShieldCheck,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { LegalArticle, LEGAL_ARTICLES } from '../../data/legalArticlesData';
import { getLegalArticles, saveLegalArticles, updateLegalArticle } from '../../services/storage';

interface AdminLegalTermsEditorViewProps {
  onRefresh?: () => void;
}

export const AdminLegalTermsEditorView: React.FC<AdminLegalTermsEditorViewProps> = ({
  onRefresh
}) => {
  const [articles, setArticles] = useState<LegalArticle[]>(() => getLegalArticles());
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || 'syarat-ketentuan');
  
  // Current active article
  const currentArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  // Editable fields for active article
  const [title, setTitle] = useState(currentArticle?.title || '');
  const [subtitle, setSubtitle] = useState(currentArticle?.subtitle || '');
  const [categoryBadge, setCategoryBadge] = useState(currentArticle?.categoryBadge || '');
  const [summary, setSummary] = useState(currentArticle?.summary || '');
  const [sections, setSections] = useState(currentArticle?.sections || []);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefresh?.();
  };

  const handleSelectArticle = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    setSelectedArticleId(id);
    setTitle(article.title);
    setSubtitle(article.subtitle);
    setCategoryBadge(article.categoryBadge);
    setSummary(article.summary);
    setSections(article.sections);
  };

  // Save current article edits
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedArticle: LegalArticle = {
      ...currentArticle,
      title: title.trim(),
      subtitle: subtitle.trim(),
      categoryBadge: categoryBadge.trim(),
      summary: summary.trim(),
      lastUpdated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      sections
    };

    updateLegalArticle(selectedArticleId, updatedArticle);
    setArticles(getLegalArticles());
    showNotification(`Dokumen "${updatedArticle.title}" berhasil diperbarui!`);
  };

  // Section handling: Add new section
  const handleAddSection = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      heading: `Pasal Baru ${sections.length + 1}: Ketentuan Tambahan`,
      paragraphs: ['Tuliskan uraian dan rincian hukum untuk pasal ini secara jelas dan transparan.']
    };
    setSections([...sections, newSec]);
  };

  // Section handling: Update section heading
  const handleUpdateHeading = (idx: number, newHeading: string) => {
    const updated = [...sections];
    updated[idx].heading = newHeading;
    setSections(updated);
  };

  // Section handling: Update section paragraph
  const handleUpdateParagraph = (secIdx: number, pIdx: number, text: string) => {
    const updated = [...sections];
    updated[secIdx].paragraphs[pIdx] = text;
    setSections(updated);
  };

  // Section handling: Add paragraph to section
  const handleAddParagraph = (secIdx: number) => {
    const updated = [...sections];
    updated[secIdx].paragraphs.push('Tambahan paragraf baru...');
    setSections(updated);
  };

  // Section handling: Delete section
  const handleDeleteSection = (idx: number) => {
    if (window.confirm('Hapus pasal ini dari dokumen?')) {
      const updated = sections.filter((_, i) => i !== idx);
      setSections(updated);
    }
  };

  // Reset to original default templates
  const handleResetToFactory = () => {
    if (window.confirm('Kembalikan dokumen ketentuan ini ke teks hukum resmi bawaan pabrik?')) {
      const original = LEGAL_ARTICLES.find(a => a.id === selectedArticleId);
      if (original) {
        setTitle(original.title);
        setSubtitle(original.subtitle);
        setCategoryBadge(original.categoryBadge);
        setSummary(original.summary);
        setSections(original.sections);
        updateLegalArticle(selectedArticleId, original);
        setArticles(getLegalArticles());
        showNotification('Dokumen dikembalikan ke teks standar.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-blue-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Kelola & Edit Syarat & Ketentuan / Kebijakan</h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5">
            Sunting pasal-pasal ketentuan donasi, privasi, akuntabilitas, dan kode etik relawan secara fleksibel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToFactory}
          className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Dokumen Ini</span>
        </button>
      </div>

      {/* Document Selector Dropdown */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Pilih Dokumen Ketentuan yang Ingin Diedit:
        </label>
        <select
          value={selectedArticleId}
          onChange={(e) => handleSelectArticle(e.target.value)}
          className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
        >
          {articles.map((art, idx) => (
            <option key={art.id} value={art.id}>
              {idx + 1}. {art.title} ({art.categoryBadge})
            </option>
          ))}
        </select>
      </div>

      {/* EDIT FORM FOR CURRENT DOCUMENT */}
      <form onSubmit={handleSaveArticle} className="space-y-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#060ee3]" />
              <span>Informasi Pokok Dokumen</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Terakhir update: {currentArticle?.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Dokumen Kebijakan *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Badge Dokumen
              </label>
              <input
                type="text"
                value={categoryBadge}
                onChange={(e) => setCategoryBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subjudul / Keterangan Singkat
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ringkasan Eksekutif (Poin Kunci untuk Pembaca)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>
          </div>
        </div>

        {/* PASAL-PASAL / SECTIONS EDITOR */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#060ee3]" />
              <span>Daftar Pasal & Butir Ketentuan ({sections.length} Pasal)</span>
            </h4>

            <button
              type="button"
              onClick={handleAddSection}
              className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Pasal Baru</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((sec, secIdx) => (
              <div
                key={sec.id || secIdx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#060ee3] dark:text-blue-400 font-mono">
                    Pasal #{secIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(secIdx)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Hapus Pasal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Section Heading */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Pasal:
                  </label>
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => handleUpdateHeading(secIdx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                </div>

                {/* Section Paragraphs */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Isi Paragraf Pasal:
                  </label>
                  {sec.paragraphs.map((para, pIdx) => (
                    <textarea
                      key={pIdx}
                      rows={2}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(secIdx, pIdx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddParagraph(secIdx)}
                    className="text-[11px] text-[#060ee3] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Paragraf Baru pada Pasal Ini</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Dokumen "{title}"</span>
          </button>
        </div>
      </form>
    </div>
  );
};
