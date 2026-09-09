import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  QrCode, 
  Download, 
  Sparkles,
  ShieldCheck,
  Send,
  Heart
} from 'lucide-react';
import { DonationCampaign } from '../types';
import { getCampaignShareUrl, getCampaignShareText, copyToClipboard } from '../utils/share';

interface ShareCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: DonationCampaign | null;
  onDonateNow?: (campaign: DonationCampaign) => void;
}

export const ShareCampaignModal: React.FC<ShareCampaignModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onDonateNow
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isOpen || !campaign) return null;

  const shareUrl = getCampaignShareUrl(campaign.id);
  const shareText = getCampaignShareText(campaign, shareUrl);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Bantu donasi: "${campaign.title}" melalui Yayasan PARAMIS FOUNDATION.`)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `Bantu donasi: "${campaign.title}" melalui Yayasan PARAMIS FOUNDATION (Bebas berdonasi berapa rupiahpun tanpa batas minimum).`,
          url: shareUrl
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  // QR Code URL for the specific campaign link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-400">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bagikan Tautan Donasi
              </h3>
              <p className="text-[10px] text-slate-500">
                Ajak keluarga & sahabat untuk menebar kebaikan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Campaign Summary Card */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
            <img 
              src={campaign.coverImage} 
              alt={campaign.title} 
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white dark:border-slate-700 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-[#060ee3] dark:text-blue-400 uppercase tracking-wide block">
                {campaign.categoryLabel}
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {campaign.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Terkumpul: <strong className="text-[#060ee3] dark:text-blue-400">Rp {campaign.collectedAmount.toLocaleString('id-ID')}</strong> • {campaign.donorCount} Donatur
              </p>
            </div>
          </div>

          {/* Direct Share Link Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tautan Khusus Donasi Ini:
            </label>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-2.5 py-1 text-xs font-mono text-slate-700 dark:text-slate-200 truncate focus:outline-hidden select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#060ee3] hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification when copied */}
            {copied && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Tautan donasi berhasil disalin! Siap ditempelkan dan dibagikan.</span>
              </div>
            )}
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Bagikan Langsung Lewat:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-7 h-7 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-white" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block">WhatsApp</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Kirim ke Chat/Grup</span>
                </div>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleTelegramShare}
                className="p-3 rounded-2xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-7 h-7 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block">Telegram</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Bagikan Tautan</span>
                </div>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookShare}
                className="p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-7 h-7 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block">Facebook</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Bagikan Beranda</span>
                </div>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleTwitterShare}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">𝕏</span>
                </div>
                <div className="text-left leading-tight">
                  <span className="block">Twitter / X</span>
                  <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">Posting Tweet</span>
                </div>
              </button>
            </div>

            {/* Native Mobile Share Button (if available or as generic share) */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400" />
              <span>Buka Menu Berbagi di HP / Perangkat (Lainnya)</span>
            </button>
          </div>

          {/* Toggle QR Code for Campaign */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowQrCode(!showQrCode)}
              className="w-full py-2 text-xs font-bold text-[#060ee3] dark:text-blue-400 hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQrCode ? 'Sembunyikan QR Code Tautan' : 'Tampilkan QR Code Tautan Donasi'}</span>
            </button>

            {showQrCode && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-3 animate-in fade-in">
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Scan QR code ini dengan kamera HP untuk langsung membuka kampanye donasi ini:
                </p>
                <div className="p-3 bg-white rounded-2xl inline-block shadow-sm border border-slate-200">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code Donasi" 
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
                <div>
                  <a
                    href={qrCodeUrl}
                    download={`QR-Donasi-${campaign.id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh Gambar QR</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Trust Banner */}
          <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#060ee3] dark:text-blue-400 shrink-0" />
            <span className="text-[11px] leading-snug">
              Tautan ini resmi mengarah langsung ke kampanye donasi terverifikasi di bawah pengawasan <strong>PARAMIS FOUNDATION</strong>. Bebas berdonasi berapa rupiahpun tanpa batas minimum.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Tutup
          </button>

          {onDonateNow && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDonateNow(campaign);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#060ee3] hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donasi Sekarang</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
