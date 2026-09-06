import React, { useState } from 'react';
import { 
  PanelBottom, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Share2,
  Building2,
  Sparkles,
  Globe,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { CmsConfig } from '../../types';
import { updateCmsConfig } from '../../services/storage';
import { INITIAL_CMS_CONFIG } from '../../data/initialData';

interface AdminFooterEditorViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

export const AdminFooterEditorView: React.FC<AdminFooterEditorViewProps> = ({
  cmsConfig,
  onConfigSaved
}) => {
  const [footerDescription, setFooterDescription] = useState(
    cmsConfig.footerDescription || INITIAL_CMS_CONFIG.footerDescription || ''
  );
  const [footerCopyright, setFooterCopyright] = useState(
    cmsConfig.footerCopyright || INITIAL_CMS_CONFIG.footerCopyright || ''
  );
  const [skKemenkumham, setSkKemenkumham] = useState(
    cmsConfig.skKemenkumham || INITIAL_CMS_CONFIG.skKemenkumham || ''
  );
  const [npwp, setNpwp] = useState(
    cmsConfig.npwp || INITIAL_CMS_CONFIG.npwp || ''
  );
  const [izinOperasional, setIzinOperasional] = useState(
    cmsConfig.izinOperasional || INITIAL_CMS_CONFIG.izinOperasional || ''
  );
  const [address, setAddress] = useState(cmsConfig.address || INITIAL_CMS_CONFIG.address || '');
  const [email, setEmail] = useState(cmsConfig.email || INITIAL_CMS_CONFIG.email || '');
  const [phone, setPhone] = useState(cmsConfig.phone || INITIAL_CMS_CONFIG.phone || '');
  const [whatsapp, setWhatsapp] = useState(cmsConfig.whatsapp || INITIAL_CMS_CONFIG.whatsapp || '');
  const [website, setWebsite] = useState(cmsConfig.website || INITIAL_CMS_CONFIG.website || '');
  const [instagram, setInstagram] = useState(cmsConfig.instagram || INITIAL_CMS_CONFIG.instagram || '');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateCmsConfig({
      footerDescription: footerDescription.trim(),
      footerCopyright: footerCopyright.trim(),
      skKemenkumham: skKemenkumham.trim(),
      npwp: npwp.trim(),
      izinOperasional: izinOperasional.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      website: website.trim(),
      instagram: instagram.trim()
    });
    onConfigSaved(updated);
    showNotification('Seluruh isi Footer & Legalitas yayasan berhasil diperbarui!');
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset isi footer dan legalitas ke pengaturan standar yayasan?')) {
      setFooterDescription(INITIAL_CMS_CONFIG.footerDescription || '');
      setFooterCopyright(INITIAL_CMS_CONFIG.footerCopyright || '');
      setSkKemenkumham(INITIAL_CMS_CONFIG.skKemenkumham);
      setNpwp(INITIAL_CMS_CONFIG.npwp);
      setIzinOperasional(INITIAL_CMS_CONFIG.izinOperasional);
      setAddress(INITIAL_CMS_CONFIG.address);
      setEmail(INITIAL_CMS_CONFIG.email);
      setPhone(INITIAL_CMS_CONFIG.phone);
      setWhatsapp(INITIAL_CMS_CONFIG.whatsapp);
      setWebsite(INITIAL_CMS_CONFIG.website);
      setInstagram(INITIAL_CMS_CONFIG.instagram);

      const updated = updateCmsConfig({
        footerDescription: INITIAL_CMS_CONFIG.footerDescription,
        footerCopyright: INITIAL_CMS_CONFIG.footerCopyright,
        skKemenkumham: INITIAL_CMS_CONFIG.skKemenkumham,
        npwp: INITIAL_CMS_CONFIG.npwp,
        izinOperasional: INITIAL_CMS_CONFIG.izinOperasional,
        address: INITIAL_CMS_CONFIG.address,
        email: INITIAL_CMS_CONFIG.email,
        phone: INITIAL_CMS_CONFIG.phone,
        whatsapp: INITIAL_CMS_CONFIG.whatsapp,
        website: INITIAL_CMS_CONFIG.website,
        instagram: INITIAL_CMS_CONFIG.instagram
      });
      onConfigSaved(updated);
      showNotification('Footer berhasil direset ke standar.');
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
            <PanelBottom className="w-3.5 h-3.5" />
            Footer & Legal Identity Editor
          </span>
          <h2 className="text-xl font-bold mt-1">Edit Teks Footer & Legalitas Yayasan</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
            Perbarui deskripsi singkat yayasan di footer, nomor SK Kemenkumham, NPWP, alamat kantor, kontak WhatsApp, dan informasi hak cipta.
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
            <span>Simpan Footer</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DESKRIPSI & LEGALITAS FORMAL */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <ShieldCheck className="w-4 h-4 text-[#060ee3]" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            1. Deskripsi Footer & Legalitas Hukum Yayasan
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Singkat Yayasan di Footer
            </label>
            <textarea
              rows={3}
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              placeholder="Deskripsi singkat profil yayasan..."
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor SK Kemenkumham
              </label>
              <input
                type="text"
                value={skKemenkumham}
                onChange={(e) => setSkKemenkumham(e.target.value)}
                placeholder="AHU-0014298.AH.01.04.Tahun 2019"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                NPWP Yayasan
              </label>
              <input
                type="text"
                value={npwp}
                onChange={(e) => setNpwp(e.target.value)}
                placeholder="91.829.412.3-014.000"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Izin Operasional Dinsos
              </label>
              <input
                type="text"
                value={izinOperasional}
                onChange={(e) => setIzinOperasional(e.target.value)}
                placeholder="Dinsos No. 460/2081/PPSK-DS/2021"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ALAMAT & KONTAK FOOTER */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <MapPin className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            2. Kontak & Alamat Sekretariat
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lengkap Kantor Yayasan
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp Resmi Yayasan
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 absolute left-3 top-2.5 text-emerald-500" />
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="085195555674"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Resmi Yayasan
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-blue-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@paramis.or.id"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Website Resmi
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-2.5 text-indigo-500" />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.paramis.or.id"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Akun Instagram
            </label>
            <div className="relative">
              <Instagram className="w-4 h-4 absolute left-3 top-2.5 text-rose-500" />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@paramisfoundation"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: COPYRIGHT */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            3. Baris Hak Cipta (Copyright Notice)
          </h3>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Teks Hak Cipta
          </label>
          <input
            type="text"
            value={footerCopyright}
            onChange={(e) => setFooterCopyright(e.target.value)}
            placeholder="Yayasan Prakarsa Hadji Abdul Muis. All rights reserved."
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
          />
        </div>
      </div>

      {/* Save Button */}
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
          <span>Simpan Seluruh Pengaturan Footer</span>
        </button>
      </div>
    </form>
  );
};
