import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface QrisDisplayProps {
  imageUrl?: string;
  merchantName?: string;
  nmid?: string;
  amount?: number;
  invoiceNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  showScanNotice?: boolean;
}

export const QrisDisplay: React.FC<QrisDisplayProps> = ({
  imageUrl,
  merchantName = 'PARAMIS FOUNDATION',
  nmid = 'ID102026198',
  amount,
  invoiceNumber,
  size = 'md',
  showScanNotice = true
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  // Reset error state if imageUrl changes
  useEffect(() => {
    setImgError(false);
    setImgLoading(true);
  }, [imageUrl]);

  // Clean values
  const cleanNmid = nmid?.trim() || 'ID102026198';
  const cleanMerchant = merchantName?.trim() || 'PARAMIS FOUNDATION';

  // Dynamic fallback QR data
  const dynamicQrPayload = `00020101021226${cleanMerchant.length + 12}0014ID.LINKAJA.WWW01189360091800000000000215${cleanNmid}520400005303360${
    amount ? `540${amount}` : ''
  }5802ID59${cleanMerchant.length < 10 ? '0' + cleanMerchant.length : cleanMerchant.length}${cleanMerchant}6007JAKARTA6304${
    invoiceNumber ? `//${invoiceNumber}` : ''
  }`;

  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    dynamicQrPayload
  )}&margin=10`;

  // Determine active QR source
  const hasCustomValidImage = !!imageUrl && !imgError && imageUrl.trim().length > 10;
  const activeQrSrc = hasCustomValidImage ? imageUrl : fallbackQrUrl;

  const boxWidthClass = size === 'sm' ? 'w-48' : size === 'lg' ? 'w-72' : 'w-60';
  const qrImageSizeClass = size === 'sm' ? 'w-36 h-36' : size === 'lg' ? 'w-56 h-56' : 'w-48 h-48';

  return (
    <div className={`${boxWidthClass} p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center text-center space-y-2.5 transition-all`}>
      {/* QRIS Header */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-black tracking-widest text-slate-900 dark:text-white">QRIS</span>
          <span className="text-[8px] px-1 py-0.2 rounded-xs bg-red-600 text-white font-bold tracking-tight">
            STANDAR
          </span>
        </div>
        <span className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-slate-900 text-white font-mono font-bold tracking-tight">
          NMID: {cleanNmid}
        </span>
      </div>

      {/* Merchant Title */}
      <div className="text-center px-1">
        <h5 className="font-black text-xs text-slate-900 dark:text-white uppercase truncate max-w-[200px]">
          {cleanMerchant}
        </h5>
        <div className="flex items-center justify-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
          <ShieldCheck className="w-3 h-3" />
          <span>Merchant Terverifikasi Bank Indonesia</span>
        </div>
      </div>

      {/* QR Barcode Canvas/Image Box */}
      <div className={`${qrImageSizeClass} rounded-2xl bg-white p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner relative`}>
        <img
          src={activeQrSrc}
          alt={`Barcode QRIS ${cleanMerchant}`}
          className="w-full h-full object-contain rounded-lg select-none"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
        />
      </div>

      {/* Amount indicator if available */}
      {amount !== undefined && amount > 0 && (
        <div className="w-full py-1.5 px-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Pembayaran:</span>
          <span className="text-sm font-black text-[#060ee3] dark:text-blue-300">
            Rp {amount.toLocaleString('id-ID')}
          </span>
        </div>
      )}

      {/* Supported Payment Logos / Notice */}
      {showScanNotice && (
        <div className="text-[9px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Dapat discan dengan semua aplikasi:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 font-bold text-[8.5px] text-slate-600 dark:text-slate-400">
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">BCA</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">BSI</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">Mandiri</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">BRI</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">GoPay</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">OVO</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">DANA</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800">ShopeePay</span>
          </div>
        </div>
      )}
    </div>
  );
};
