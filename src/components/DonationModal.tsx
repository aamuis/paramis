import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  QrCode, 
  CreditCard, 
  Wallet, 
  Building2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Share2, 
  Download, 
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { DonationCampaign, PaymentMethodType, DonationTransaction, CmsConfig } from '../types';
import { createDonationTransaction, verifyTransaction, getCmsConfig } from '../services/storage';
import { ParamisLogo } from './ParamisLogo';
import { QrisDisplay } from './QrisDisplay';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: DonationCampaign | null;
  onDonationCompleted?: (transaction: DonationTransaction) => void;
  cmsConfig?: CmsConfig;
}

const PRESET_AMOUNTS = [25000, 50000, 100000, 250000, 500000, 1000000];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onDonationCompleted,
  cmsConfig: propCmsConfig
}) => {
  const currentCmsConfig = propCmsConfig || getCmsConfig();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [prayerMessage, setPrayerMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');

  const [createdTransaction, setCreatedTransaction] = useState<DonationTransaction | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) || 0 : selectedAmount;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 10000) {
      alert('Minimal donasi adalah Rp 10.000');
      return;
    }
    if (!donorEmail || !donorPhone) {
      alert('Mohon lengkapi email dan nomor telepon untuk pengiriman bukti donasi.');
      return;
    }

    const res = createDonationTransaction({
      campaignId: campaign ? campaign.id : 'camp-general',
      donorName: isAnonymous ? 'Hamba Allah' : donorName,
      donorEmail,
      donorPhone,
      amount: currentAmount,
      paymentMethod,
      isAnonymous,
      prayerMessage
    });

    setCreatedTransaction(res.transaction);
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    if (!createdTransaction) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      if (onDonationCompleted) {
        onDonationCompleted(createdTransaction);
      }
    }, 400);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        id="donation-modal-container"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header bar */}
        <div className="px-5 py-3.5 bg-[#060ee3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== 'form' && step !== 'success' && (
              <button 
                onClick={() => setStep('form')}
                className="p-1 -ml-1 text-white/80 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-sm font-bold">
                {step === 'form' && 'Formulir Donasi'}
                {step === 'payment' && 'Instruksi Pembayaran Donasi'}
                {step === 'success' && 'Konfirmasi Pembayaran Diterima'}
              </h3>
              <p className="text-[11px] text-blue-100 truncate max-w-[260px]">
                {campaign ? campaign.title : 'Yayasan Prakarsa Hadji Abdul Muis'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-donation-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Campaign summary card */}
              {campaign && (
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center gap-3">
                  <img 
                    src={campaign.coverImage} 
                    alt={campaign.title} 
                    className="w-12 h-12 rounded-lg object-cover shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#060ee3] dark:text-blue-400 uppercase tracking-wide">
                      {campaign.categoryLabel}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {campaign.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Tersalurkan lewat PARAMIS FOUNDATION
                    </p>
                  </div>
                </div>
              )}

              {/* Nominal selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Nominal Donasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#060ee3] text-white border-[#060ee3] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    );
                  })}
                </div>

                {/* Custom nominal input */}
                <div className="mt-2.5">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                      Rp
                    </span>
                    <input
                      id="input-custom-donation-amount"
                      type="number"
                      placeholder="Nominal lainnya (min Rp 10.000)"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full pl-10 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Metode Pembayaran Digital
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'qris' 
                        ? 'border-[#060ee3] bg-blue-50/70 dark:bg-blue-950/50 font-bold text-[#060ee3] dark:text-blue-300' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="text-[#060ee3]"
                    />
                    <QrCode className="w-4 h-4 text-[#060ee3]" />
                    <span className="truncate">QRIS (Semua Bank/E-Wallet)</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'va_bca' 
                        ? 'border-[#060ee3] bg-blue-50/70 dark:bg-blue-950/50 font-bold text-[#060ee3] dark:text-blue-300' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="va_bca"
                      checked={paymentMethod === 'va_bca'}
                      onChange={() => setPaymentMethod('va_bca')}
                      className="text-[#060ee3]"
                    />
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>BCA Virtual Account</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'va_mandiri' 
                        ? 'border-[#060ee3] bg-blue-50/70 dark:bg-blue-950/50 font-bold text-[#060ee3] dark:text-blue-300' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="va_mandiri"
                      checked={paymentMethod === 'va_mandiri'}
                      onChange={() => setPaymentMethod('va_mandiri')}
                      className="text-[#060ee3]"
                    />
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Mandiri Virtual Acc</span>
                  </label>

                  <label 
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'gopay' 
                        ? 'border-[#060ee3] bg-blue-50/70 dark:bg-blue-950/50 font-bold text-[#060ee3] dark:text-blue-300' 
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="gopay"
                      checked={paymentMethod === 'gopay'}
                      onChange={() => setPaymentMethod('gopay')}
                      className="text-[#060ee3]"
                    />
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>GoPay / DANA E-Wallet</span>
                  </label>
                </div>
              </div>

              {/* Donor info fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nama Donatur
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isAnonymous} 
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded-xs text-[#060ee3]" 
                      />
                      <span>Sembunyikan nama (Hamba Allah)</span>
                    </label>
                  </div>
                  <input
                    id="input-donor-name"
                    type="text"
                    disabled={isAnonymous}
                    placeholder={isAnonymous ? "Hamba Allah" : "Contoh: Budi Santoso"}
                    value={isAnonymous ? '' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3] disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email (Laporan & Kwitansi) *
                    </label>
                    <input
                      id="input-donor-email"
                      type="email"
                      required
                      placeholder="email@anda.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / HP *
                    </label>
                    <input
                      id="input-donor-phone"
                      type="tel"
                      required
                      placeholder="0812xxxxxxx"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Doa atau Pesan Kebaikan (Opsional)
                  </label>
                  <textarea
                    id="input-donor-prayer"
                    rows={2}
                    placeholder="Tuliskan doa atau harapan untuk penerima manfaat..."
                    value={prayerMessage}
                    onChange={(e) => setPrayerMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-donation-checkout"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Lanjutkan Pembayaran • Rp {currentAmount.toLocaleString('id-ID')}</span>
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT SCREEN */}
          {step === 'payment' && createdTransaction && (
            <div className="space-y-4">
              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">Total Pembayaran Termasuk Kode Unik</span>
                <div className="text-2xl font-black text-[#060ee3] dark:text-blue-400 mt-0.5">
                  Rp {createdTransaction.totalAmount.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  (Kode unik transfer: {createdTransaction.uniqueCode})
                </span>
              </div>

              {/* Payment Channel display */}
              {createdTransaction.paymentMethod === 'qris' ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center space-y-2">
                  <QrisDisplay 
                    imageUrl={currentCmsConfig.qrisImageUrl}
                    merchantName={currentCmsConfig.qrisMerchantName || 'PARAMIS FOUNDATION'}
                    nmid={currentCmsConfig.qrisNmid || 'ID102026198'}
                    amount={createdTransaction.totalAmount}
                    invoiceNumber={createdTransaction.invoiceNumber}
                    size="md"
                    showScanNotice={true}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Kanal Pembayaran:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{createdTransaction.paymentChannelName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500">Nomor Rekening / Kode VA</span>
                      <div className="text-base font-mono font-bold text-slate-900 dark:text-white">
                        {createdTransaction.paymentCode}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(createdTransaction.paymentCode)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#060ee3] text-white text-xs font-semibold cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Disalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Manual Check Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Status Pembayaran: Diproses oleh Admin</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                  Pembayaran akan dicek oleh admin, dan status pembayaran diproses oleh admin. Terima kasih atas donasi Anda.
                </p>
              </div>

              {/* Button: Saya sudah membayar */}
              <button
                id="btn-confirm-payment"
                type="button"
                onClick={handleConfirmPayment}
                disabled={isVerifying}
                className="w-full py-3.5 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isVerifying ? (
                  <span>Menyimpan konfirmasi...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Saya sudah membayar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: KONFIRMASI PEMBAYARAN */}
          {step === 'success' && createdTransaction && (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 rounded-full bg-[#060ee3] text-white flex items-center justify-center mb-2 shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Konfirmasi Pembayaran Diterima
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs font-medium">
                  Pembayaran akan dicek oleh admin, dan status pembayaran diproses oleh admin. Terima kasih atas donasi Anda.
                </p>
              </div>

              {/* Bukti Donasi Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-md space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <ParamisLogo variant="auto" size="xs" />
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 block">
                      Yayasan Prakarsa Hadji Abdul Muis
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      DIPROSES OLEH ADMIN
                    </span>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">{createdTransaction.invoiceNumber}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Program:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px] text-right">
                      {createdTransaction.campaignTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Donatur:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {createdTransaction.donorName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nominal:</span>
                    <span className="font-black text-[#060ee3] dark:text-blue-400">
                      Rp {createdTransaction.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kanal:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {createdTransaction.paymentChannelName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      Diproses oleh Admin
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu:</span>
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                      {new Date(createdTransaction.createdAt || Date.now()).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Status Notice */}
                <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pembayaran akan dicek oleh admin</span>
                  </div>
                  <span className="font-semibold text-[#060ee3] dark:text-blue-400">Terima kasih</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Bukti konfirmasi donasi telah dicatat dan dikirimkan ke email: ${createdTransaction.donorEmail}`)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Kirim ke Email</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
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
