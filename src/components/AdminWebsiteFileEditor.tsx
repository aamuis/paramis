import React, { useState } from 'react';
import { 
  FileCode, 
  Save, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  RefreshCw, 
  FileText, 
  Layers, 
  Heart, 
  Settings, 
  Database,
  Code
} from 'lucide-react';
import { 
  CmsConfig, 
  DonationCampaign, 
  ServiceItem, 
  SocialActivityReport, 
  CustomMenuItem 
} from '../types';
import { 
  updateCmsConfig, 
  saveCampaigns, 
  saveServices, 
  saveReports, 
  exportAllWebsiteData, 
  importAllWebsiteData 
} from '../services/storage';

interface AdminWebsiteFileEditorProps {
  cmsConfig: CmsConfig;
  campaigns: DonationCampaign[];
  services: ServiceItem[];
  reports: SocialActivityReport[];
}

type FileKey = 'cmsConfig' | 'campaigns' | 'services' | 'reports' | 'metadata';

export const AdminWebsiteFileEditor: React.FC<AdminWebsiteFileEditorProps> = ({
  cmsConfig,
  campaigns,
  services,
  reports,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileKey>('cmsConfig');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for Visual Editing of CMS Config
  const [configForm, setConfigForm] = useState<CmsConfig>({ ...cmsConfig });

  // Code editor raw string state
  const getRawContent = (key: FileKey): string => {
    switch (key) {
      case 'cmsConfig':
        return JSON.stringify(cmsConfig, null, 2);
      case 'campaigns':
        return JSON.stringify(campaigns, null, 2);
      case 'services':
        return JSON.stringify(services, null, 2);
      case 'reports':
        return JSON.stringify(reports, null, 2);
      case 'metadata':
        return JSON.stringify({
          name: "PARAMIS FOUNDATION",
          description: "Aplikasi Donasi & Penggalangan Dana Resmi Yayasan Prakarsa Hadji Abdul Muis",
          brandName: configForm.brandName || "PARAMIS FOUNDATION",
          version: "2.4.0",
          legal: configForm.legalitasKemenkumham || "AHU-0012345.AH.01.04.Tahun 2021",
          izin: configForm.izinOperasional || "503/089-Dinsos/2022",
          alamat: configForm.address,
          kontak: {
            whatsapp: configForm.whatsapp,
            email: configForm.email,
            website: configForm.website
          }
        }, null, 2);
      default:
        return '{}';
    }
  };

  const [rawText, setRawText] = useState<string>(() => getRawContent(selectedFile));

  const handleSelectFile = (fileKey: FileKey) => {
    setSelectedFile(fileKey);
    setRawText(getRawContent(fileKey));
    setErrorMsg(null);
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Save Visual Form
  const handleSaveVisual = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsConfig(configForm);
    showToast('File konfigurasi website berhasil diperbarui dan disimpan!');
  };

  // Save Raw Code
  const handleSaveCode = () => {
    try {
      const parsed = JSON.parse(rawText);
      setErrorMsg(null);

      switch (selectedFile) {
        case 'cmsConfig':
          updateCmsConfig(parsed);
          setConfigForm({ ...parsed });
          break;
        case 'campaigns':
          if (!Array.isArray(parsed)) throw new Error('Data kampanye harus berupa Array []');
          saveCampaigns(parsed);
          break;
        case 'services':
          if (!Array.isArray(parsed)) throw new Error('Data layanan harus berupa Array []');
          saveServices(parsed);
          break;
        case 'reports':
          if (!Array.isArray(parsed)) throw new Error('Data laporan harus berupa Array []');
          saveReports(parsed);
          break;
        case 'metadata':
          if (parsed.brandName || parsed.alamat) {
            updateCmsConfig({
              brandName: parsed.brandName || configForm.brandName,
              address: parsed.alamat || configForm.address,
              whatsapp: parsed.kontak?.whatsapp || configForm.whatsapp,
              email: parsed.kontak?.email || configForm.email,
            });
          }
          break;
      }

      showToast(`File ${selectedFile}.json berhasil diperbarui secara langsung!`);
    } catch (err) {
      setErrorMsg('Gagal menyimpan: ' + (err as Error).message);
    }
  };

  // Format / Beautify JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawText);
      setRawText(JSON.stringify(parsed, null, 2));
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Format JSON tidak valid: ' + (err as Error).message);
    }
  };

  // Export all data
  const handleExportBackup = () => {
    const dataStr = exportAllWebsiteData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `paramis-website-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File cadangan website berhasil diunduh!');
  };

  // Import all data
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importAllWebsiteData(content);
        if (res.success) {
          showToast(res.message);
          setRawText(getRawContent(selectedFile));
        } else {
          setErrorMsg(res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 animate-in fade-in text-xs">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Editor File & Konten Website</h3>
              <p className="text-[10px] text-slate-400">
                Kelola file konfigurasi, database kampanye, teks beranda, dan seluruh isi website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Download File Cadangan JSON"
            >
              <Download className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">Export Backup</span>
            </button>

            <label
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Upload File Cadangan JSON"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* File Selection Tabs */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Pilih File Website untuk Diedit:
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleSelectFile('cmsConfig')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFile === 'cmsConfig'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>cms_config.json</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFile('campaigns')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFile === 'campaigns'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>campaigns.json ({campaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFile('services')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFile === 'services'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>services.json ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFile('reports')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFile === 'reports'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>reports.json ({reports.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectFile('metadata')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedFile === 'metadata'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>metadata.json</span>
          </button>
        </div>
      </div>

      {/* Editor Mode Switcher (Visual vs Code) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`px-3 py-1 rounded-md font-semibold text-xs cursor-pointer transition-colors ${
              editorMode === 'visual'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Visual Form
          </button>
          <button
            type="button"
            onClick={() => {
              setRawText(getRawContent(selectedFile));
              setEditorMode('code');
            }}
            className={`px-3 py-1 rounded-md font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1 ${
              editorMode === 'code'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Raw JSON Editor</span>
          </button>
        </div>

        {editorMode === 'code' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFormatJson}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-medium hover:bg-slate-200 cursor-pointer"
              title="Rapikan Format JSON"
            >
              Rapikan Format
            </button>
            <button
              type="button"
              onClick={handleSaveCode}
              className="px-3 py-1 rounded-lg bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>Simpan File</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: RAW CODE / JSON EDITOR */}
      {editorMode === 'code' && (
        <div className="space-y-2">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-[11px] shadow-md">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-semibold text-slate-300">File: {selectedFile}.json</span>
              <span>UTF-8 • JSON File Mode</span>
            </div>
            <textarea
              rows={18}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3 bg-transparent text-emerald-400 focus:outline-none resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
          <p className="text-[10px] text-slate-500 italic">
            * Perubahan pada file JSON langsung diterapkan ke seluruh sistem aplikasi saat tombol "Simpan File" diklik.
          </p>
        </div>
      )}

      {/* VIEW 2: VISUAL FORM EDITOR */}
      {editorMode === 'visual' && (
        <div className="space-y-4">
          {selectedFile === 'cmsConfig' && (
            <form onSubmit={handleSaveVisual} className="space-y-3">
              {/* Hero Banner Editor */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
                  <span>Banner Utama Beranda</span>
                </h4>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Judul Banner (Hero Title)
                  </label>
                  <input
                    type="text"
                    value={configForm.heroBannerTitle}
                    onChange={(e) => setConfigForm({ ...configForm, heroBannerTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Sub-judul Banner (Deskripsi Beranda)
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.heroBannerSubtitle}
                    onChange={(e) => setConfigForm({ ...configForm, heroBannerSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Teks Tombol Aksi (CTA)
                  </label>
                  <input
                    type="text"
                    value={configForm.heroBannerCta}
                    onChange={(e) => setConfigForm({ ...configForm, heroBannerCta: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Identitas Yayasan */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                  Identitas & Profil Yayasan
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Nama Brand
                    </label>
                    <input
                      type="text"
                      value={configForm.brandName}
                      onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Nama Resmi Yayasan
                    </label>
                    <input
                      type="text"
                      value={configForm.yayasanName}
                      onChange={(e) => setConfigForm({ ...configForm, yayasanName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={configForm.tagline}
                    onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Tentang & Sejarah Yayasan
                  </label>
                  <textarea
                    rows={3}
                    value={configForm.aboutStory}
                    onChange={(e) => setConfigForm({ ...configForm, aboutStory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Visi Yayasan
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.vision || ''}
                    onChange={(e) => setConfigForm({ ...configForm, vision: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    Alamat Kantor Yayasan
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.address}
                    onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      WhatsApp Resmi
                    </label>
                    <input
                      type="text"
                      value={configForm.whatsapp}
                      onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      value={configForm.email}
                      onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      SK Kemenkumham
                    </label>
                    <input
                      type="text"
                      value={configForm.legalitasKemenkumham}
                      onChange={(e) => setConfigForm({ ...configForm, legalitasKemenkumham: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                      Izin Operasional
                    </label>
                    <input
                      type="text"
                      value={configForm.izinOperasional}
                      onChange={(e) => setConfigForm({ ...configForm, izinOperasional: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Konfigurasi Website</span>
              </button>
            </form>
          )}

          {selectedFile !== 'cmsConfig' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <Database className="w-8 h-8 text-[#060ee3] mx-auto" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                File Data: {selectedFile}.json
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                File ini berisi data terstruktur sistem. Buka tab <strong>Raw JSON Editor</strong> di atas untuk mengedit langsung baris data dan konten file ini secara menyeluruh.
              </p>
              <button
                type="button"
                onClick={() => {
                  setRawText(getRawContent(selectedFile));
                  setEditorMode('code');
                }}
                className="px-4 py-2 rounded-xl bg-[#060ee3] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Buka di Raw JSON Editor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
