import React, { useState, useRef, useEffect } from 'react';
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
  Play,
  RefreshCw,
  ShieldCheck,
  Zap,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CmsConfig } from '../../types';
import { updateCmsConfig } from '../../services/storage';
import { QrisDisplay } from '../QrisDisplay';

interface AdminBankQrisViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

const POPULAR_BANKS = [
  'Bank Central Asia (BCA)',
  'Bank Mandiri',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Syariah Indonesia (BSI)',
  'Bank Muamalat',
  'GoPay / GoTo Financial',
  'DANA (Dompet Digital)',
  'OVO (Payment)',
  'ShopeePay',
  'LinkAja',
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
  const [qrisImageUrl, setQrisImageUrl] = useState(cmsConfig.qrisImageUrl || '/qris-prcrsa-hadji-abdul-muis.svg');
  const [qrisMerchantName, setQrisMerchantName] = useState(
    cmsConfig.qrisMerchantName && cmsConfig.qrisMerchantName !== 'PARAMIS FOUNDATION' 
      ? cmsConfig.qrisMerchantName 
      : 'PRCRSA HADJI ABDUL MUIS'
  );
  const [qrisNmid, setQrisNmid] = useState(
    cmsConfig.qrisNmid && cmsConfig.qrisNmid !== 'ID102026198'
      ? cmsConfig.qrisNmid
      : 'ID1026589758873'
  );

  // Payment Gateway Configuration
  const [qrisGatewayProvider, setQrisGatewayProvider] = useState<'manual' | 'midtrans' | 'xendit' | 'tripay' | 'duitku'>(
    cmsConfig.qrisGatewayProvider || 'manual'
  );
  const [qrisGatewayApiKey, setQrisGatewayApiKey] = useState(cmsConfig.qrisGatewayApiKey || '');
  const [qrisGatewayMode, setQrisGatewayMode] = useState<'sandbox' | 'production'>(
    cmsConfig.qrisGatewayMode || 'sandbox'
  );
  const [qrisGatewayEndpoint, setQrisGatewayEndpoint] = useState(cmsConfig.qrisGatewayEndpoint || '');

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

  // ==========================================
  // INTERACTIVE QRIS SIMULATION STATE
  // ==========================================
  const [showSimulationPanel, setShowSimulationPanel] = useState(false);
  const [simStep, setSimStep] = useState<'standby' | 'processing' | 'paid'>('standby');
  const [simAmount, setSimAmount] = useState<number>(50000);
  const [simCustomAmount, setSimCustomAmount] = useState<string>('');
  const [simUniqueCode, setSimUniqueCode] = useState<number>(382);
  const [simInvoice, setSimInvoice] = useState<string>(
    () => 'INV/PRM/SIM-' + Math.floor(1000 + Math.random() * 9000)
  );
  const [simTimer, setSimTimer] = useState<number>(890); // ~14m 50s
  const [simEWallet, setSimEWallet] = useState<'gopay' | 'bca' | 'dana' | 'ovo' | 'shopeepay'>('gopay');
  const [simPaidAt, setSimPaidAt] = useState<string>('');

  // Countdown timer for simulation
  useEffect(() => {
    if (!showSimulationPanel || simStep !== 'standby') return;
    const interval = setInterval(() => {
      setSimTimer((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [showSimulationPanel, simStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
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

  // Toggle active status of a bank
  const handleToggleBankActive = (index: number) => {
    const updated = bankAccounts.map((acc, i) => {
      if (i === index) {
        return { ...acc, isActive: acc.isActive === false ? true : false };
      }
      return acc;
    });
    setBankAccounts(updated);
    const saved = updateCmsConfig({ bankAccounts: updated });
    onConfigSaved(saved);
    showNotification(`Status rekening ${updated[index].bank} diperbarui.`);
  };

  // Handle QRIS File Upload
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

  // SAVE ALL SETTINGS & IMMEDIATELY TRIGGER QRIS SIMULATION
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const saved = updateCmsConfig({
      bankAccounts,
      qrisImageUrl,
      qrisMerchantName,
      qrisNmid,
      qrisGatewayProvider,
      qrisGatewayApiKey,
      qrisGatewayMode,
      qrisGatewayEndpoint
    });
    onConfigSaved(saved);
    showNotification('Seluruh konfigurasi Rekening Bank & Payment Gateway QRIS berhasil disimpan!');

    // PENTING: Otomatis munculkan simulasi pembayaran QRIS agar admin langsung melihat hasil QRIS aktif
    setShowSimulationPanel(true);
    setSimStep('standby');
    setSimUniqueCode(Math.floor(100 + Math.random() * 899));
    setSimInvoice('INV/PRM/SIM-' + Math.floor(1000 + Math.random() * 9000));
    setSimTimer(900);

    // Scroll smoothly to simulation section
    setTimeout(() => {
      document.getElementById('qris-simulation-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Trigger simulated payment success
  const handleSimulatePaymentProcess = () => {
    setSimStep('processing');
    setTimeout(() => {
      setSimStep('paid');
      setSimPaidAt(new Date().toLocaleString('id-ID'));
    }, 1200);
  };

  const handleResetSimulation = () => {
    setSimStep('standby');
    setSimUniqueCode(Math.floor(100 + Math.random() * 899));
    setSimInvoice('INV/PRM/SIM-' + Math.floor(1000 + Math.random() * 9000));
    setSimTimer(900);
  };

  const effectiveSimAmount = simCustomAmount 
    ? parseInt(simCustomAmount.replace(/\D/g, ''), 10) || 50000 
    : simAmount;
  const totalSimAmount = effectiveSimAmount + simUniqueCode;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button 
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Intro Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-blue-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Manajemen Rekening Bank & Payment Gateway QRIS</h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5">
            Kelola nomor rekening donasi, payment gateway QRIS, dan jalankan simulasi pembayaran donatur real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowSimulationPanel(!showSimulationPanel);
              if (!showSimulationPanel) {
                setTimeout(() => {
                  document.getElementById('qris-simulation-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-98"
          >
            <Zap className="w-4 h-4 text-slate-900 fill-slate-900" />
            <span>{showSimulationPanel ? 'Tutup Simulasi' : '⚡ Simulasi QRIS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddBankForm(!showAddBankForm)}
            className="px-3.5 py-2 rounded-xl bg-white text-[#060ee3] hover:bg-blue-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddBankForm ? 'Tutup Formulir' : '+ Tambah Bank'}</span>
          </button>
        </div>
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

        {bankAccounts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-700/80 text-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Belum ada rekening bank yang ditambahkan
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Daftar rekening bank pada formulir donasi saat ini kosong. Klik tombol <strong>"+ Tambah Rekening"</strong> di atas untuk menambahkan rekening bank (BCA, Mandiri, BRI, BSI, dll) atau E-Wallet yang akan tampil pada formulir donasi.
            </p>
          </div>
        ) : (
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
        )}
      </div>

      {/* SECTION 3: QRIS & PAYMENT GATEWAY MANAGEMENT */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100 dark:border-rose-900">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Kelola Barcode QRIS & Payment Gateway Yayasan
              </h4>
              <p className="text-xs text-slate-500">
                Hubungkan barcode QRIS statis yayasan atau integrasi payment gateway otomatis (Midtrans, Xendit, TriPay, Duitku).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowSimulationPanel(!showSimulationPanel);
                if (!showSimulationPanel) {
                  setTimeout(() => {
                    document.getElementById('qris-simulation-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-xs text-[#060ee3] dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{showSimulationPanel ? 'Sembunyikan Simulasi' : 'Uji Simulasi Pembayaran'}</span>
            </button>

            {qrisImageUrl && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset gambar barcode QRIS ke tampilan standar otomatis?')) {
                    setQrisImageUrl('');
                    updateCmsConfig({ qrisImageUrl: '' });
                    showNotification('Barcode QRIS direset ke generator otomatis.');
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer ml-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset QRIS</span>
              </button>
            )}
          </div>
        </div>

        {/* PAYMENT GATEWAY SELECTION ROW */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Mode / Provider Payment Gateway QRIS
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { id: 'manual', label: 'QRIS Statis Yayasan', sub: 'Upload Barcode / URL' },
              { id: 'midtrans', label: 'Midtrans QRIS', sub: 'Gopay / QRIS Otomatis' },
              { id: 'xendit', label: 'Xendit QRIS', sub: 'Dynamic QRIS' },
              { id: 'tripay', label: 'TriPay QRIS', sub: 'Instant Callback' },
              { id: 'duitku', label: 'Duitku QRIS', sub: 'Direct Settlement' }
            ].map((provider) => {
              const isSelected = qrisGatewayProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setQrisGatewayProvider(provider.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#060ee3] bg-blue-50/90 dark:bg-blue-950/60 font-bold text-[#060ee3] dark:text-blue-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold block">{provider.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#060ee3] shrink-0" />}
                  </div>
                  <span className="text-[9px] text-slate-400 block leading-tight">{provider.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Additional gateway settings if not manual */}
          {qrisGatewayProvider !== 'manual' && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-slate-200 dark:border-slate-700 animate-in fade-in">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mode Gateway
                </label>
                <select
                  value={qrisGatewayMode}
                  onChange={(e) => setQrisGatewayMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="sandbox">Sandbox (Testing / Simulasi)</option>
                  <option value="production">Production (Live Transaksi Nyata)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Server Key / API Key Gateway
                </label>
                <input
                  type="password"
                  placeholder="Contoh: SB-Mid-server-..."
                  value={qrisGatewayApiKey}
                  onChange={(e) => setQrisGatewayApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Webhook / Endpoint (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://paramis.id/api/qris-webhook"
                  value={qrisGatewayEndpoint}
                  onChange={(e) => setQrisGatewayEndpoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* INPUT FORM & LIVE PREVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: QRIS Details & Upload */}
          <div className="space-y-3.5 text-xs">
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
                Tips: Gambar barcode QRIS yang diunggah akan otomatis disimpan ke sistem dan ditampilkan langsung di halaman pembayaran donatur.
              </span>
            </div>

            {/* URL Alternative */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Atau Masukkan Tautan / URL Gambar Barcode QRIS
              </label>
              <input
                type="url"
                placeholder="https://contoh.com/qris-yayasan.png atau tautan gateway"
                value={qrisImageUrl}
                onChange={(e) => setQrisImageUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sistem memiliki generator QRIS cerdas: jika URL gambar tidak dapat dimuat, barcode dinamis tetap akan dibuat otomatis sehingga tidak pernah blank.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Merchant QRIS Resmi *
                </label>
                <input
                  type="text"
                  value={qrisMerchantName}
                  onChange={(e) => setQrisMerchantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor NMID QRIS Resmi *
                </label>
                <input
                  type="text"
                  value={qrisNmid}
                  onChange={(e) => setQrisNmid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live QRIS Standar Preview */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Live Barcode QRIS</span>
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Aktif
              </span>
            </div>

            <QrisDisplay 
              imageUrl={qrisImageUrl}
              merchantName={qrisMerchantName}
              nmid={qrisNmid}
              size="md"
              showScanNotice={true}
            />

            <button
              type="button"
              onClick={() => {
                setShowSimulationPanel(true);
                setTimeout(() => {
                  document.getElementById('qris-simulation-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="mt-3 w-full max-w-[240px] py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-[#060ee3] dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buka Simulasi Pembayaran</span>
            </button>
          </div>
        </div>

        {/* Global Save Button - Saving automatically triggers the interactive simulation panel */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Menyimpan akan otomatis memperbarui database dan memunculkan simulasi pembayaran QRIS.</span>
          </div>

          <button
            type="button"
            id="btn-save-all-qris"
            onClick={handleSaveAll}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan Rekening & QRIS</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 4: SIMULASI PEMBAYARAN QRIS (LIVE SIMULATOR)      */}
      {/* Ini otomatis muncul ketika admin menyimpan pengaturan     */}
      {/* ======================================================== */}
      {showSimulationPanel && (
        <div 
          id="qris-simulation-section"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-[#060ee3] shadow-xl space-y-5 animate-in slide-in-from-bottom-3"
        >
          {/* Header Simulasi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold border border-amber-300 dark:border-amber-800">
                <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-slate-900 dark:text-white">
                    Simulasi Pembayaran QRIS Real-Time
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#060ee3] dark:bg-blue-950 dark:text-blue-300">
                    Live Payment Tester
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Uji alur scan barcode QRIS, perhitungan nominal kode unik, dan verifikasi otomatis pelunasan donasi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSimulationPanel(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer shrink-0"
            >
              Tutup Simulasi ✕
            </button>
          </div>

          {/* Simulation Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Tester Configuration Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-white">
                    Pilih Nominal Uji Coba Donasi:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{simInvoice}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSimAmount(amt);
                        setSimCustomAmount('');
                      }}
                      className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer ${
                        simAmount === amt && !simCustomAmount
                          ? 'bg-[#060ee3] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50'
                      }`}
                    >
                      Rp {(amt / 1000).toFixed(0)}rb
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Atau Masukkan Nominal Kustom:
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 150000"
                    value={simCustomAmount}
                    onChange={(e) => setSimCustomAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-blue-200 dark:border-blue-900 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Kode Unik Verifikasi:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    +{simUniqueCode} (Auto-generate)
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-black pt-1 border-t border-blue-200 dark:border-blue-900">
                  <span className="text-slate-700 dark:text-slate-300">Total Pembayaran QRIS:</span>
                  <span className="text-[#060ee3] dark:text-blue-300">
                    Rp {totalSimAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Simulation Provider Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Metode Simulasi Aplikasi Scan:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'gopay', label: 'GoPay / QRIS' },
                    { id: 'bca', label: 'BCA Mobile' },
                    { id: 'dana', label: 'DANA' },
                    { id: 'ovo', label: 'OVO' },
                    { id: 'shopeepay', label: 'ShopeePay' }
                  ].map((wallet) => (
                    <button
                      key={wallet.id}
                      type="button"
                      onClick={() => setSimEWallet(wallet.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                        simEWallet === wallet.id
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {wallet.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Status Trigger Button */}
              {simStep === 'standby' && (
                <button
                  type="button"
                  id="btn-simulate-qris-action"
                  onClick={handleSimulatePaymentProcess}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>⚡ Simulasikan Pembayaran Donatur (Scan & Bayar)</span>
                </button>
              )}

              {simStep === 'processing' && (
                <div className="w-full py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Notifikasi Webhook Gateway & Verifikasi...</span>
                </div>
              )}

              {simStep === 'paid' && (
                <div className="space-y-2">
                  <div className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pembayaran QRIS Berhasil Diverifikasi Otomatis!</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Uji Coba Pembayaran Lagi (Reset)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Box: Live QRIS Display + Official E-Receipt (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center space-y-4">
              {/* Standby & Processing Mode */}
              {simStep !== 'paid' ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                      <span>Menunggu Pembayaran Donatur</span>
                    </span>
                    <span className="font-mono font-bold text-slate-500">
                      Kadaluarsa: {formatTimer(simTimer)}
                    </span>
                  </div>

                  {/* QRIS Card with configured barcode */}
                  <QrisDisplay 
                    imageUrl={qrisImageUrl}
                    merchantName={qrisMerchantName}
                    nmid={qrisNmid}
                    amount={totalSimAmount}
                    invoiceNumber={simInvoice}
                    size="lg"
                    showScanNotice={true}
                  />

                  <p className="text-[11px] text-slate-500 max-w-xs text-center">
                    Klik tombol <b>"Simulasikan Pembayaran Donatur"</b> di sebelah kiri untuk menguji penerimaan dana seketika.
                  </p>
                </div>
              ) : (
                /* Paid Mode: Official Digital Receipt Display */
                <div className="w-full max-w-md p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#060ee3]">PARAMIS FOUNDATION</span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">Bukti Donasi Digital QRIS</h5>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      ✓ LUNAS / TERVERIFIKASI
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nomor Invoice:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{simInvoice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant QRIS:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{qrisMerchantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">NMID:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{qrisNmid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Metode Pembayaran:</span>
                      <span className="font-bold text-slate-900 dark:text-white">QRIS ({simEWallet.toUpperCase()})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Waktu Pelunasan:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{simPaidAt}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-sm font-black">
                      <span className="text-slate-800 dark:text-white">Total Donasi Lunas:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Rp {totalSimAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Tervalidasi Otomatis oleh Sistem PARAMIS</span>
                    </div>
                    <span className="font-mono">STATUS: SUCCESS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
