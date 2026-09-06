import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Image as ImageIcon,
  Check,
  Smartphone,
  PanelBottom
} from 'lucide-react';
import { CmsConfig } from '../../types';
import { updateCmsConfig } from '../../services/storage';
import { ParamisLogo } from '../ParamisLogo';

interface AdminLogoEditorViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

export const AdminLogoEditorView: React.FC<AdminLogoEditorViewProps> = ({
  cmsConfig,
  onConfigSaved
}) => {
  const [customHeaderLogo, setCustomHeaderLogo] = useState(cmsConfig.customHeaderLogo || '');
  const [customSplashLogo, setCustomSplashLogo] = useState(cmsConfig.customSplashLogo || '');
  const [customFooterLogo, setCustomFooterLogo] = useState(cmsConfig.customFooterLogo || '');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const headerFileRef = useRef<HTMLInputElement>(null);
  const splashFileRef = useRef<HTMLInputElement>(null);
  const footerFileRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleHeaderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCustomHeaderLogo(base64);
      const saved = updateCmsConfig({ customHeaderLogo: base64 });
      onConfigSaved(saved);
      showNotification('Logo header website berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  const handleSplashFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCustomSplashLogo(base64);
      const saved = updateCmsConfig({ customSplashLogo: base64 });
      onConfigSaved(saved);
      showNotification('Logo splash screen pembuka berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  const handleFooterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCustomFooterLogo(base64);
      const saved = updateCmsConfig({ customFooterLogo: base64 });
      onConfigSaved(saved);
      showNotification('Logo footer website berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = updateCmsConfig({
      customHeaderLogo: customHeaderLogo.trim(),
      customSplashLogo: customSplashLogo.trim(),
      customFooterLogo: customFooterLogo.trim()
    });
    onConfigSaved(saved);
    showNotification('Konfigurasi logo website berhasil disimpan!');
  };

  const handleResetHeaderLogo = () => {
    if (window.confirm('Reset logo header ke logo tipografi PARAMIS FOUNDATION resmi?')) {
      setCustomHeaderLogo('');
      const saved = updateCmsConfig({ customHeaderLogo: '' });
      onConfigSaved(saved);
      showNotification('Logo header dikembalikan ke logo tipografi standar.');
    }
  };

  const handleResetSplashLogo = () => {
    if (window.confirm('Reset logo splash screen ke logo standar?')) {
      setCustomSplashLogo('');
      const saved = updateCmsConfig({ customSplashLogo: '' });
      onConfigSaved(saved);
      showNotification('Logo splash screen dikembalikan ke standar.');
    }
  };

  const handleResetFooterLogo = () => {
    if (window.confirm('Reset logo footer ke standar?')) {
      setCustomFooterLogo('');
      const saved = updateCmsConfig({ customFooterLogo: '' });
      onConfigSaved(saved);
      showNotification('Logo footer dikembalikan ke standar.');
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

      {/* Hidden file inputs */}
      <input type="file" ref={headerFileRef} accept="image/*" onChange={handleHeaderFileUpload} className="hidden" />
      <input type="file" ref={splashFileRef} accept="image/*" onChange={handleSplashFileUpload} className="hidden" />
      <input type="file" ref={footerFileRef} accept="image/*" onChange={handleFooterFileUpload} className="hidden" />

      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Website & Mobile Branding
          </span>
          <h2 className="text-xl font-bold mt-1">Edit & Unggah Logo Website</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
            Kustomisasi logo header navigasi, logo splash screen aplikasi, dan logo footer resmi. Anda dapat mengunggah file gambar (PNG/SVG/JPG) atau memasukkan URL gambar.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Logo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. HEADER LOGO */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#060ee3]" />
                <span>1. Logo Header Website</span>
              </h3>
              {customHeaderLogo && (
                <button
                  type="button"
                  onClick={handleResetHeaderLogo}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Kembalikan ke logo tipografi bawaan"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tampil di bagian navbar atas aplikasi. Jika dikosongkan, logo tipografi resmi PARAMIS FOUNDATION akan digunakan secara otomatis.
            </p>

            {/* Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center min-h-[100px] text-center">
              {customHeaderLogo ? (
                <div className="space-y-2">
                  <img src={customHeaderLogo} alt="Header Logo" className="h-10 max-w-[200px] object-contain mx-auto" />
                  <span className="text-[10px] text-emerald-600 font-semibold block">Logo Kustom Aktif</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <ParamisLogo variant="blue" size="md" />
                  <span className="text-[10px] text-slate-400 block">Menggunakan Logo Tipografi Bawaan</span>
                </div>
              )}
            </div>

            {/* Input URL */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Gambar Logo Header
              </label>
              <input
                type="text"
                value={customHeaderLogo}
                onChange={(e) => setCustomHeaderLogo(e.target.value)}
                placeholder="https://... / path logo"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => headerFileRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#060ee3] dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Gambar dari Perangkat</span>
          </button>
        </div>

        {/* 2. SPLASH SCREEN LOGO */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-amber-500" />
                <span>2. Logo Splash Screen</span>
              </h3>
              {customSplashLogo && (
                <button
                  type="button"
                  onClick={handleResetSplashLogo}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Kembalikan ke standar"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tampil di layar pembuka saat pengguna pertama kali memuat web / aplikasi mobile.
            </p>

            {/* Preview Box */}
            <div className="p-4 rounded-2xl bg-[#060ee3] text-white flex flex-col items-center justify-center min-h-[100px] text-center shadow-inner">
              {customSplashLogo ? (
                <div className="space-y-2">
                  <img src={customSplashLogo} alt="Splash Logo" className="h-12 max-w-[200px] object-contain mx-auto" />
                  <span className="text-[10px] text-blue-200 font-semibold block">Logo Kustom Aktif</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <ParamisLogo variant="white" size="md" />
                  <span className="text-[10px] text-blue-200/70 block">Logo Splash Standar</span>
                </div>
              )}
            </div>

            {/* Input URL */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Gambar Logo Splash Screen
              </label>
              <input
                type="text"
                value={customSplashLogo}
                onChange={(e) => setCustomSplashLogo(e.target.value)}
                placeholder="https://... / path logo"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => splashFileRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Logo Splash</span>
          </button>
        </div>

        {/* 3. FOOTER LOGO */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <PanelBottom className="w-4 h-4 text-indigo-500" />
                <span>3. Logo Footer Website</span>
              </h3>
              {customFooterLogo && (
                <button
                  type="button"
                  onClick={handleResetFooterLogo}
                  className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Kembalikan ke standar"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tampil di bagian bawah (footer). Disarankan logo monokrom atau versi putih jika background footer gelap.
            </p>

            {/* Preview Box */}
            <div className="p-4 rounded-2xl bg-[#060ee3] text-white flex flex-col items-center justify-center min-h-[100px] text-center shadow-inner">
              {customFooterLogo ? (
                <div className="space-y-2">
                  <img src={customFooterLogo} alt="Footer Logo" className="h-10 max-w-[200px] object-contain mx-auto" />
                  <span className="text-[10px] text-blue-200 font-semibold block">Logo Kustom Footer</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <ParamisLogo variant="white" size="md" />
                  <span className="text-[10px] text-blue-200/70 block">Logo Footer Standar</span>
                </div>
              )}
            </div>

            {/* Input URL */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Gambar Logo Footer
              </label>
              <input
                type="text"
                value={customFooterLogo}
                onChange={(e) => setCustomFooterLogo(e.target.value)}
                placeholder="https://... / path logo"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => footerFileRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Logo Footer</span>
          </button>
        </div>
      </div>
    </form>
  );
};
