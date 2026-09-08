import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Camera, 
  Upload, 
  MapPin, 
  Briefcase,
  Sparkles,
  FileDown,
  ImageDown,
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

// Convert an image URL to a clean local Data URL via fetch with CORS
const toCleanDataUrl = async (url: string): Promise<string | null> => {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

// Universal rounded rect helper for Canvas 2D
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// 100% Infallible standalone Canvas 2D card renderer (guaranteed to never taint and never fail)
const renderKtaToCanvasFallback = async (volunteer: VolunteerApplicant): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const width = 1000;
  const height = 630; // CR80 ratio: 85.6mm x 54mm = 1.585
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  // 1. Background with rounded corners
  drawRoundedRect(ctx, 0, 0, width, height, 36);
  ctx.clip();

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#060ee3');
  gradient.addColorStop(0.5, '#050ca8');
  gradient.addColorStop(1, '#020538');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Card border
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 1.5, 1.5, width - 3, height - 3, 36);
  ctx.stroke();

  // Subtle background watermark circle
  ctx.save();
  ctx.translate(width - 120, height - 120);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Header
  // Logo placeholder emblem
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(65, 52, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#060ee3';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', 65, 53);

  // Title: Strictly single line
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = '900 22px system-ui, sans-serif';
  ctx.fillText('KARTU TANDA ANGGOTA RELAWAN', 105, 45);

  ctx.fillStyle = '#bfdbfe';
  ctx.font = '500 16px system-ui, sans-serif';
  ctx.fillText('Yayasan Prakarsa Hadji Abdul Muis', 105, 72);

  // Header divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 100);
  ctx.lineTo(width - 40, 100);
  ctx.stroke();

  // 3. Body: Avatar photo
  const avatarX = 45;
  const avatarY = 135;
  const avatarSize = 160;

  ctx.save();
  drawRoundedRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 24);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.clip();

  let avatarDrawn = false;
  if (volunteer.avatarUrl) {
    try {
      const cleanData = await toCleanDataUrl(volunteer.avatarUrl);
      if (cleanData) {
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
            avatarDrawn = true;
            resolve(true);
          };
          img.onerror = () => resolve(false);
          img.src = cleanData;
        });
      }
    } catch {
      avatarDrawn = false;
    }
  }

  if (!avatarDrawn) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      (volunteer.fullName || 'RE').slice(0, 2).toUpperCase(),
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2
    );
  }
  ctx.restore();

  // 4. Details
  const textX = 240;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Name & age
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText(volunteer.fullName || 'Relawan', textX, 175);

  const nameWidth = ctx.measureText(volunteer.fullName || 'Relawan').width;
  drawRoundedRect(ctx, textX + nameWidth + 14, 150, 75, 28, 14);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
  ctx.fillStyle = '#dbeafe';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(`${volunteer.age || 25} thn`, textX + nameWidth + 24, 170);

  // Profession
  ctx.fillStyle = '#dbeafe';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`💼  ${volunteer.profession || 'Masyarakat Umum'}`, textX, 220);

  // City
  ctx.fillStyle = '#bfdbfe';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText(`📍  ${volunteer.city || 'Indonesia'}`, textX, 260);

  // ID Card Number
  drawRoundedRect(ctx, textX, 290, 220, 36, 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(`ID: ${volunteer.idCardNumber || 'REL-0000'}`, textX + 14, 314);

  // Category
  ctx.fillStyle = '#93c5fd';
  ctx.font = '500 16px system-ui, sans-serif';
  ctx.fillText(`Bidang: ${volunteer.interestCategory || 'Kemanusiaan'}`, textX + 240, 314);

  // QR Code Box
  const qrX = width - 180;
  const qrY = 140;
  drawRoundedRect(ctx, qrX, qrY, 140, 160, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // QR faux pattern
  ctx.fillStyle = '#0f172a';
  const qrInnerX = qrX + 20;
  const qrInnerY = qrY + 18;
  const qSize = 100;
  // Corner markers
  ctx.fillRect(qrInnerX, qrInnerY, 28, 28);
  ctx.clearRect(qrInnerX + 6, qrInnerY + 6, 16, 16);
  ctx.fillRect(qrInnerX + 9, qrInnerY + 9, 10, 10);

  ctx.fillRect(qrInnerX + qSize - 28, qrInnerY, 28, 28);
  ctx.clearRect(qrInnerX + qSize - 22, qrInnerY + 6, 16, 16);
  ctx.fillRect(qrInnerX + qSize - 19, qrInnerY + 9, 10, 10);

  ctx.fillRect(qrInnerX, qrInnerY + qSize - 28, 28, 28);
  ctx.clearRect(qrInnerX + 6, qrInnerY + qSize - 22, 16, 16);
  ctx.fillRect(qrInnerX + 9, qrInnerY + qSize - 19, 10, 10);

  ctx.fillRect(qrInnerX + 38, qrInnerY + 10, 20, 8);
  ctx.fillRect(qrInnerX + 38, qrInnerY + 36, 24, 20);
  ctx.fillRect(qrInnerX + 10, qrInnerY + 36, 16, 12);
  ctx.fillRect(qrInnerX + 68, qrInnerY + 36, 16, 24);
  ctx.fillRect(qrInnerX + 36, qrInnerY + 68, 28, 14);
  ctx.fillRect(qrInnerX + 72, qrInnerY + 68, 14, 18);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PARAMIS RELAWAN', qrX + 70, qrY + 144);

  // 5. Footer
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, height - 70);
  ctx.lineTo(width - 40, height - 70);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#93c5fd';
  ctx.font = '500 16px system-ui, sans-serif';
  ctx.fillText('✦  Aksi Sosial & Kemanusiaan Terpadu', 45, height - 32);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#bfdbfe';
  ctx.font = '500 15px system-ui, sans-serif';
  ctx.fillText('Masa Berlaku: Desember 2027', width - 45, height - 32);

  return canvas;
};

export const VolunteerKtaCard: React.FC<VolunteerKtaCardProps> = ({
  volunteer,
  onAvatarUpdated,
  allowEditPhoto = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingType, setGeneratingType] = useState<'image' | 'pdf' | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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

  const getCardCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!cardRef.current) {
      return renderKtaToCanvasFallback(volunteer);
    }
    
    // Hide camera edit button if present during snapshot
    const cameraBtn = cardRef.current.querySelector<HTMLElement>('[data-kta-camera-btn="true"]');
    if (cameraBtn) cameraBtn.style.display = 'none';

    try {
      // Pre-check avatar to ensure canvas won't be tainted
      let safeAvatarDataUrl: string | null = null;
      if (volunteer.avatarUrl) {
        safeAvatarDataUrl = await toCleanDataUrl(volunteer.avatarUrl);
      }

      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: false, // Must be false to allow canvas.toDataURL()
        backgroundColor: '#050ca8',
        logging: false,
        onclone: (clonedDoc) => {
          const clonedBtn = clonedDoc.querySelector<HTMLElement>('[data-kta-camera-btn="true"]');
          if (clonedBtn) clonedBtn.style.display = 'none';

          const clonedImg = clonedDoc.querySelector<HTMLImageElement>('#kta-card-avatar-img');
          if (clonedImg) {
            if (safeAvatarDataUrl) {
              clonedImg.src = safeAvatarDataUrl;
            } else if (!volunteer.avatarUrl?.startsWith('data:')) {
              // Replace un-fetchable external image with initials to prevent canvas taint
              if (clonedImg.parentElement) {
                const initialsDiv = clonedDoc.createElement('div');
                initialsDiv.className = 'w-full h-full flex items-center justify-center font-bold text-2xl text-white tracking-wider bg-white/20';
                initialsDiv.textContent = (volunteer.fullName || 'RE').slice(0, 2).toUpperCase();
                clonedImg.parentElement.replaceChild(initialsDiv, clonedImg);
              }
            }
          }
        }
      });

      // Verify canvas can be exported without SecurityError
      canvas.toDataURL('image/png', 0.95);
      return canvas;
    } catch (err) {
      console.warn('html2canvas issue encountered, falling back to Canvas 2D card renderer:', err);
      return renderKtaToCanvasFallback(volunteer);
    } finally {
      if (cameraBtn) cameraBtn.style.display = '';
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    setGeneratingType('image');
    setAvatarError(null);
    try {
      const canvas = await getCardCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);
      const safeName = (volunteer.fullName || 'Relawan').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `KTA-Relawan-Hadji-Abdul-Muis-${safeName}.png`;
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 1000);
    } catch (err) {
      console.error('Gagal download file KTA:', err);
      setAvatarError('Gagal mendownload file gambar KTA. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    setGeneratingType('pdf');
    setAvatarError(null);
    try {
      const canvas = await getCardCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Standard ID Card dimension: 85.6mm x 54mm (CR80 standard)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
      const safeName = (volunteer.fullName || 'Relawan').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `KTA-Relawan-Hadji-Abdul-Muis-${safeName}.pdf`;

      // Use Blob URL download link for universal iframe & mobile browser reliability
      try {
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
      } catch {
        pdf.save(filename);
      }
    } catch (err) {
      console.error('Gagal generate PDF KTA:', err);
      setAvatarError('Gagal mendownload file PDF KTA. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
      setGeneratingType(null);
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

        {/* Card Header: Strictly single line KARTU TANDA ANGGOTA RELAWAN */}
        <div className="flex justify-between items-center border-b border-white/20 pb-2.5 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <ParamisLogo variant="white" size="xs" />
            <div className="min-w-0">
              <span className="text-[9.5px] xs:text-[10.5px] sm:text-[12px] font-black uppercase tracking-wider text-white whitespace-nowrap leading-none block">
                KARTU TANDA ANGGOTA RELAWAN
              </span>
              <span className="text-[8px] sm:text-[9px] text-blue-200 whitespace-nowrap leading-tight font-medium block mt-1">
                Yayasan Prakarsa Hadji Abdul Muis
              </span>
            </div>
          </div>

          {/* Official Card Seal / Watermark Chip */}
          <div className="text-right shrink-0">
            <span className="text-[8px] xs:text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-blue-100 border border-white/20 font-medium inline-flex items-center gap-1 shadow-xs whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-blue-300" />
              E-KTA RESMI
            </span>
          </div>
        </div>

        {/* Card Body: Photo & Profile Details */}
        <div className="py-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Photo Frame */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/15 border-2 border-white/40 overflow-hidden shadow-inner flex items-center justify-center font-bold text-2xl text-white">
              {volunteer.avatarUrl ? (
                <img 
                  id="kta-card-avatar-img"
                  src={volunteer.avatarUrl} 
                  alt={volunteer.fullName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="tracking-wider">
                  {volunteer.fullName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Change Photo Overlay Button on Card (hidden during download) */}
            {allowEditPhoto && (
              <button
                data-kta-camera-btn="true"
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

      {/* Primary KTA Action Buttons: Download File Gambar KTA & PDF KTA (Tanpa Kertas/Halaman Lain) */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="py-2.5 px-3.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] active:scale-98 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGenerating && generatingType === 'image' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan Gambar...</span>
              </>
            ) : (
              <>
                <ImageDown className="w-4 h-4" />
                <span>Download File KTA (PNG)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="py-2.5 px-3.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#060ee3] dark:text-blue-300 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGenerating && generatingType === 'pdf' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF KTA</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-medium">
          Hanya mengunduh file kartu KTA saja (tanpa halaman website atau keterangan lain).
        </p>
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

