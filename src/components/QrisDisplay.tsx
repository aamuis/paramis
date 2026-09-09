import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { OFFICIAL_QRIS_CONFIG, buildQrisPayload } from '../utils/qris';

interface QrisDisplayProps {
  imageUrl?: string;
  merchantName?: string;
  nmid?: string;
  amount?: number;
  invoiceNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  showScanNotice?: boolean;
  showDownloadBtn?: boolean;
}

export const QrisDisplay: React.FC<QrisDisplayProps> = ({
  imageUrl,
  merchantName = OFFICIAL_QRIS_CONFIG.merchantName,
  nmid = OFFICIAL_QRIS_CONFIG.nmid,
  amount,
  invoiceNumber,
  size = 'md',
  showScanNotice = true,
  showDownloadBtn = false
}) => {
  const [imgError, setImgError] = useState(false);
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string>('');
  const [copiedNmid, setCopiedNmid] = useState(false);

  // Clean values
  const cleanNmid = nmid?.trim() || OFFICIAL_QRIS_CONFIG.nmid;
  const cleanMerchant = merchantName?.trim() || OFFICIAL_QRIS_CONFIG.merchantName;

  // Generate dynamic QR code if amount or specific invoice is provided
  useEffect(() => {
    let isMounted = true;
    if (amount && amount > 0) {
      const payload = buildQrisPayload({
        merchantName: cleanMerchant,
        nmid: cleanNmid,
        amount,
        invoiceNumber,
      });

      QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 400,
        color: { dark: '#000000', light: '#FFFFFF' }
      })
        .then((url: string) => {
          if (isMounted) setGeneratedDataUrl(url);
        })
        .catch(() => {
          // Fallback to static SVG if generation fails
        });
    } else {
      setGeneratedDataUrl('');
    }

    return () => {
      isMounted = false;
    };
  }, [amount, invoiceNumber, cleanMerchant, cleanNmid]);

  // Determine active QR image source:
  // 1. Dynamic generated QR if amount > 0
  // 2. Custom valid image from config/upload
  // 3. Official static vector SVG in /qris-prcrsa-hadji-abdul-muis.svg
  const hasCustomValidImage = !!imageUrl && !imgError && imageUrl.trim().length > 5;
  const activeQrSrc = generatedDataUrl 
    ? generatedDataUrl 
    : hasCustomValidImage 
      ? imageUrl 
      : OFFICIAL_QRIS_CONFIG.defaultImageUrl;

  const boxWidthClass = size === 'sm' ? 'w-52' : size === 'lg' ? 'w-80' : 'w-64';
  const qrImageSizeClass = size === 'sm' ? 'w-40 h-40' : size === 'lg' ? 'w-60 h-60' : 'w-52 h-52';

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(cleanNmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleDownload = () => {
    const downloadUrl = generatedDataUrl || OFFICIAL_QRIS_CONFIG.defaultPngUrl;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `QRIS-${cleanMerchant.replace(/\s+/g, '_')}-${cleanNmid}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
        <button
          type="button"
          onClick={handleCopyNmid}
          title="Klik untuk salin NMID"
          className="text-[8.5px] px-1.5 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold tracking-tight flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
        >
          <span>NMID: {cleanNmid}</span>
          {copiedNmid ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-70" />}
        </button>
      </div>

      {/* Merchant Title */}
      <div className="text-center px-1">
        <h5 className="font-black text-xs text-slate-900 dark:text-white uppercase truncate max-w-[220px]">
          {cleanMerchant}
        </h5>
        <div className="flex items-center justify-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
          <ShieldCheck className="w-3 h-3 shrink-0" />
          <span>Terverifikasi Bank Indonesia</span>
        </div>
      </div>

      {/* QR Barcode Canvas/Image Box (Hanya kode QR saja yang ditampilkan secara bersih) */}
      <div className={`${qrImageSizeClass} rounded-2xl bg-white p-2.5 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner relative`}>
        <img
          src={activeQrSrc}
          alt={`Barcode QRIS ${cleanMerchant}`}
          className="w-full h-full object-contain select-none"
          onError={() => {
            setImgError(true);
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

      {/* Download & Copy Buttons */}
      {showDownloadBtn && (
        <div className="w-full flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-3 h-3 text-[#060ee3]" />
            <span>Unduh QR</span>
          </button>
          <button
            type="button"
            onClick={handleCopyNmid}
            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            {copiedNmid ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Salin NMID</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Supported Payment Logos / Notice */}
      {showScanNotice && (
        <div className="text-[9px] text-slate-500 dark:text-slate-400 space-y-1 pt-0.5">
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
