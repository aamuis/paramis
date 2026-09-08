import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Camera, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  MapPin, 
  Briefcase,
  Sparkles,
  FileDown,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VolunteerApplicant } from '../types';
import { ParamisLogo } from './ParamisLogo';

interface VolunteerKtaCardProps {
  volunteer: VolunteerApplicant;
  onAvatarUpdated?: (newAvatarUrl: string) => void;
  allowEditPhoto?: boolean;
}

export const VolunteerKtaCard: React.FC<VolunteerKtaCardProps> = ({
  volunteer,
  onAvatarUpdated,
  allowEditPhoto = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const isApproved = volunteer.status === 'approved';
  const isRejected = volunteer.status === 'rejected';

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Format file harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Ukuran foto maksimal 5 MB.');
      return;
    }

    setAvatarError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        onAvatarUpdated?.(result);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setAvatarError('Gagal membaca file foto.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#050ca8',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Standard ID Card dimension: 90mm x 58mm (matching landscape CR80 aspect ratio)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [90, 58]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 90, 58);
      const safeName = (volunteer.fullName || 'Relawan').trim().replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`KTA-Relawan-PARAMIS-${safeName}.pdf`);
    } catch (err) {
      console.error('Gagal generate PDF KTA, menggunakan dialog cetak:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* The E-KTA Card container */}
      <div 
        ref={cardRef}
        id={`kta-card-${volunteer.id}`}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#060ee3] via-[#050ca8] to-[#020538] text-white shadow-xl border border-blue-400/40 relative overflow-hidden transition-all"
      >
        {/* Hologram watermark in background */}
        <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
          <ShieldCheck className="w-40 h-40" />
        </div>

        {/* Card Header */}
        <div className="flex justify-between items-start border-b border-white/20 pb-2.5 gap-2">
          <div className="flex items-center gap-2">
            <ParamisLogo variant="white" size="xs" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white leading-tight block">
                KARTU TANDA ANGGOTA RELAWAN
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] text-blue-200 leading-tight font-medium block mt-0.5">
                Yayasan Prakarsa Hadji Abdul Muis
              </span>
            </div>
          </div>

          {/* Status Badge: only show when formally approved or rejected; 'MENUNGGU ACC ADMIN' removed */}
          <div className="text-right shrink-0">
            {isApproved ? (
              <span className="text-[9px] px-2.5 py-1 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-400/40 font-bold inline-flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                RESMI DI-ACC
              </span>
            ) : isRejected ? (
              <span className="text-[9px] px-2.5 py-1 rounded-full bg-rose-500/25 text-rose-300 border border-rose-400/40 font-bold inline-flex items-center gap-1 shadow-xs">
                <XCircle className="w-3 h-3 text-rose-300" />
                DITOLAK
              </span>
            ) : null}
          </div>
        </div>

        {/* Card Body: Photo & Profile Details */}
        <div className="py-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Photo Frame */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/15 border-2 border-white/40 overflow-hidden shadow-inner flex items-center justify-center font-bold text-2xl text-white">
              {volunteer.avatarUrl ? (
                <img 
                  src={volunteer.avatarUrl} 
                  alt={volunteer.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="tracking-wider">
                  {volunteer.fullName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Change Photo Overlay Button on Card */}
            {allowEditPhoto && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Ganti / Upload Foto Profil KTA"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-[#060ee3] hover:bg-blue-600 active:scale-95 text-white shadow-md border-2 border-white transition-all cursor-pointer flex items-center justify-center"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}

            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Info Column */}
          <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <h4 className="text-base font-bold text-white tracking-tight">
                {volunteer.fullName}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-blue-100 font-mono">
                {volunteer.age} thn
              </span>
            </div>

            <p className="text-xs text-blue-100 flex items-center justify-center sm:justify-start gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate">{volunteer.profession || 'Masyarakat Umum'}</span>
            </p>

            <p className="text-xs text-blue-200 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate">{volunteer.city}</span>
            </p>

            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-mono text-blue-200 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                ID: {volunteer.idCardNumber}
              </span>
              <span className="text-[9px] text-blue-300 font-medium">
                Bidang: {volunteer.interestCategory || 'Kemanusiaan'}
              </span>
            </div>
          </div>

          {/* Official QR Code Box */}
          <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-md shrink-0 text-slate-900 text-center">
            <QrCode className="w-12 h-12 text-slate-900" />
            <span className="text-[8px] font-mono font-bold text-slate-700 tracking-tighter mt-0.5">
              PARAMIS RELAWAN
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center text-[9px] text-blue-200 gap-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Aksi Sosial & Kemanusiaan Terpadu
          </span>
          <span>Masa Berlaku: Desember 2027</span>
        </div>
      </div>

      {/* Primary KTA Action Buttons: Download PDF & Cetak */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Membuat PDF KTA...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              <span>Download PDF KTA</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrintCard}
          title="Cetak KTA"
          className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
        >
          <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span className="hidden sm:inline">Cetak</span>
        </button>
      </div>

      {/* Upload photo note & quick action button if allowed */}
      {allowEditPhoto && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Camera className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0" />
            <span>
              {volunteer.avatarUrl 
                ? 'Foto profil KTA sudah terpasang. Klik tombol di kanan jika ingin mengganti.' 
                : 'Belum ada foto profil pada KTA. Silakan upload foto profil Anda.'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Mengunggah...' : volunteer.avatarUrl ? 'Ganti Foto Profil' : 'Upload Foto Profil'}</span>
          </button>
        </div>
      )}

      {avatarError && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium px-1">
          ⚠️ {avatarError}
        </p>
      )}
    </div>
  );
};

