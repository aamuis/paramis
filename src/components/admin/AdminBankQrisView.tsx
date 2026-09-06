import React, { useState, useRef } from 'react';
import { 
  Building2, 
  QrCode, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Upload, 
  Copy, 
  Check, 
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import { CmsConfig } from '../../types';
import { updateCmsConfig } from '../../services/storage';

interface AdminBankQrisViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

const POPULAR_BANKS = [
  'Bank Syariah Indonesia (BSI)',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Central Asia (BCA)',
  'Bank Mandiri',
  'Bank Negara Indonesia (BNI)',
  'Bank Muamalat',
  'Bank Jabar Banten (BJB / BJB Syariah)',
  'Bank CIMB Niaga / Syariah',
  'Bank Permata Syariah',
  'Bank Mega Syariah',
  'Bank Danamon'
];

export const AdminBankQrisView: React.FC<AdminBankQrisViewProps> = ({
  cmsConfig,
  onConfigSaved
}) => {
  // Local state for banks and QRIS
  const [bankAccounts, setBankAccounts] = useState(cmsConfig.bankAccounts || []);
  const [qrisImageUrl, setQrisImageUrl] = useState(cmsConfig.qrisImageUrl || '');
  const [qrisMerchantName, setQrisMerchantName] = useState(cmsConfig.qrisMerchantName || 'PARAMIS FOUNDATION');
  const [qrisNmid, setQrisNmid] = useState(cmsConfig.qrisNmid || 'ID102026198');

  // Form state for adding new bank
  const [selectedPresetBank, setSelectedPresetBank] = useState(POPULAR_BANKS[0]);
  const [customBankName, setCustomBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountName, setNewAccountName] = useState('Yayasan Prakarsa Hadji Abdul Muis');
  const [newAccountNotes, setNewAccountNotes] = useState('');
  const [showAddBankForm, setShowAddBankForm] = useState(false);

  // Status & copy feedback
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Add new bank account
  const handleAddNewBank = (e: React.FormEvent) => {
    e.preventDefault();
    const bankName = customBankName.trim() || selectedPresetBank;
    if (!bankName || !newAccountNumber.trim()) {
      alert('Nama Bank dan Nomor Rekening wajib diisi!');
      return;
    }

    const newAcc = {
      bank: bankName,
      accountNumber: newAccountNumber.trim(),
      accountName: newAccountName.trim() || 'Yayasan Prakarsa Hadji Abdul Muis',
      notes: newAccountNotes.trim() || undefined,
      isActive: true
    };

    const updated = [...bankAccounts, newAcc];
    setBankAccounts(updated);
    
    // Auto-save
    const saved = updateCmsConfig({ bankAccounts: updated });
    onConfigSaved(saved);

    // Reset form
    setCustomBankName('');
    setNewAccountNumber('');
    setNewAccountNotes('');
    setShowAddBankForm(false);
    showNotification(`Rekening bank ${bankName} berhasil ditambahkan!`);
  };

  // Delete bank account
  const handleDeleteBank = (index: number) => {
    const bankToDelete = bankAccounts[index];
    if (window.confirm(`Hapus rekening ${bankToDelete?.bank} (${bankToDelete?.accountNumber})?`)) {
      const updated = bankAccounts.filter((_, i) => i !== index);
      setBankAccounts(updated);
      const saved = updateCmsConfig({ bankAccounts: updated });
      onConfigSaved(saved);
      showNotification('Rekening bank berhasil dihapus.');
    }
  };

  // Toggle bank active status
  const handleToggleBankActive = (index: number) => {
    const updated = [...bankAccounts];
    updated[index].isActive = updated[index].isActive === false ? true : false;
    setBankAccounts(updated);
    const saved = updateCmsConfig({ bankAccounts: updated });
    onConfigSaved(saved);
    showNotification(`Status rekening ${updated[index].bank} diperbarui.`);
  };

  // Handle QRIS image file upload
  const handleQrisFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WebP, atau SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setQrisImageUrl(base64);
      const saved = updateCmsConfig({ qrisImageUrl: base64 });
      onConfigSaved(saved);
      showNotification('Gambar barcode QRIS donasi berhasil diunggah!');
    };
    reader.readAsDataURL(file);
  };

  // Save all settings
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = updateCmsConfig({
      bankAccounts,
      qrisImageUrl,
      qrisMerchantName,
      qrisNmid
    });
    onConfigSaved(saved);
    showNotification('Seluruh konfigurasi Rekening Bank & QRIS berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Intro Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-blue-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Manajemen Rekening Bank & Barcode QRIS</h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5">
            Atur rekening tujuan transfer donatur dan upload barcode QRIS resmi yayasan untuk transaksi instan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddBankForm(!showAddBankForm)}
          className="px-3.5 py-2 rounded-xl bg-white text-[#060ee3] hover:bg-blue-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddBankForm ? 'Tutup Formulir' : '+ Tambah Bank Baru'}</span>
        </button>
      </div>

      {/* SECTION 1: ADD NEW BANK FORM */}
      {showAddBankForm && (
        <form 
          onSubmit={handleAddNewBank}
          className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-[#060ee3]/30 shadow-sm space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-900 pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#060ee3]" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Formulir Tambah Rekening Bank Donasi Baru
              </h4>
            </div>
            <span className="text-[10px] text-slate-500">Tersedia langsung di modal donasi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Bank Selection */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Bank
              </label>
              <select
                value={selectedPresetBank}
                onChange={(e) => setSelectedPresetBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {POPULAR_BANKS.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Custom Bank Name if not listed */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Atau Tulis Nama Bank Lain (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bank Nagari Syariah / BPD"
                value={customBankName}
                onChange={(e) => setCustomBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Rekening *
              </label>
              <input
                type="text"
                placeholder="Contoh: 7188 9090 12"
                required
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Atas Nama Pemilik Rekening *
              </label>
              <input
                type="text"
                placeholder="Yayasan Prakarsa Hadji Abdul Muis"
                required
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Account Branch / Notes */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Keterangan / Kantor Cabang (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: KCP Jakarta Thamrin (Rekening Khusus Yatim & Dhuafa)"
                value={newAccountNotes}
                onChange={(e) => setNewAccountNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddBankForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Tambahkan Rekening</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: LIST OF ACTIVE BANK ACCOUNTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
            <span>Daftar Rekening Bank Donasi Aktif</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 text-[10px]">
              {bankAccounts.length} Rekening
            </span>
          </span>
          <span className="text-[10px] text-slate-500">Donatur dapat memilih bank ini saat donasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bankAccounts.map((acc, idx) => {
            const isActive = acc.isActive !== false;

            return (
              <div
                key={idx}
                className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border transition-all space-y-3 shadow-xs relative ${
                  isActive 
                    ? 'border-slate-200 dark:border-slate-700' 
                    : 'border-slate-200 dark:border-slate-700 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#060ee3] dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100 dark:border-blue-900">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {acc.bank}
                        </h4>
                        {!isActive && (
                          <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-600 text-[8px] font-bold uppercase">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        a/n {acc.accountName}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBank(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                    title="Hapus Rekening"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Account Number Box */}
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                      Nomor Rekening:
                    </span>
                    <span className="font-mono font-bold text-sm text-[#060ee3] dark:text-blue-400 tracking-wide">
                      {acc.accountNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc.accountNumber.replace(/\s+/g, ''), idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#060ee3] dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-900 cursor-pointer"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIdx === idx ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>

                {acc.notes && (
                  <p className="text-[10px] text-slate-500 italic">
                    Catatan: {acc.notes}
                  </p>
                )}

                {/* Status Switch */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
                  <span className="text-slate-500">Status untuk Donatur:</span>
                  <button
                    type="button"
                    onClick={() => handleToggleBankActive(idx)}
                    className={`font-semibold cursor-pointer ${
                      isActive ? 'text-emerald-600 hover:underline' : 'text-slate-400 hover:underline'
                    }`}
                  >
                    {isActive ? '● Aktif (Ditampilkan)' : '○ Disembunyikan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: QRIS BARCODE MANAGEMENT */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100 dark:border-rose-900">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Kelola Barcode QRIS Resmi Yayasan
              </h4>
              <p className="text-xs text-slate-500">
                Upload barcode QRIS dari m-Banking yayasan (BSI, BCA, Mandiri, dll) untuk discan donatur.
              </p>
            </div>
          </div>

          {qrisImageUrl && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset gambar barcode QRIS ke tampilan standar?')) {
                  setQrisImageUrl('');
                  updateCmsConfig({ qrisImageUrl: '' });
                  showNotification('Barcode QRIS direset.');
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset QRIS</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Left Column: Upload Controls & Meta */}
          <div className="space-y-3 text-xs">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleQrisFileUpload}
              className="hidden"
            />

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unggah File Barcode QRIS dari HP / Komputer
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#060ee3]/40 hover:border-[#060ee3] bg-blue-50/50 dark:bg-blue-950/30 text-[#060ee3] dark:text-blue-300 font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih File Gambar Barcode (PNG / JPG / WebP)</span>
              </button>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Tips: Gunakan screenshot kode QRIS yang jelas dari aplikasi m-Banking atau Surat Resmi Merchant QRIS.
              </span>
            </div>

            {/* URL Alternative */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Atau Masukkan Tautan / URL Gambar Barcode QRIS
              </label>
              <input
                type="url"
                placeholder="https://contoh.com/qris-yayasan.png"
                value={qrisImageUrl}
                onChange={(e) => setQrisImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Merchant QRIS
                </label>
                <input
                  type="text"
                  value={qrisMerchantName}
                  onChange={(e) => setQrisMerchantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor NMID QRIS
                </label>
                <input
                  type="text"
                  value={qrisNmid}
                  onChange={(e) => setQrisNmid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live QRIS Preview Mockup */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau QRIS (Tampilan Donatur)</span>
            </span>

            <div className="w-64 p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center text-center space-y-2.5">
              {/* QRIS Header */}
              <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-[11px] font-black tracking-widest text-slate-900 dark:text-white">QRIS</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-rose-600 text-white font-bold font-mono">
                  NMID: {qrisNmid}
                </span>
              </div>

              <div className="text-center">
                <h5 className="font-black text-xs text-slate-900 dark:text-white uppercase">
                  {qrisMerchantName}
                </h5>
                <span className="text-[9px] text-slate-400">Pembayaran Cepat & Terverifikasi Otomatis</span>
              </div>

              {/* QR Image Box */}
              <div className="w-48 h-48 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center overflow-hidden shadow-inner">
                {qrisImageUrl ? (
                  <img
                    src={qrisImageUrl}
                    alt="Barcode QRIS Yayasan"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-2 space-y-1">
                    <QrCode className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Menggunakan QRIS Interaktif Standar
                    </span>
                    <span className="text-[9px] text-[#060ee3] dark:text-blue-400 font-semibold block">
                      Unggah barcode khusus untuk menampilkan QR Anda
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <span>Scan dengan: BCA, Mandiri, BSI, GoPay, OVO, DANA, ShopeePay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan Rekening & QRIS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
