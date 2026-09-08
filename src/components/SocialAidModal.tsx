import React from 'react';
import { 
  X, 
  HeartHandshake, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Heart, 
  CheckCircle2,
  PackageCheck,
  Users,
  Sparkles
} from 'lucide-react';

interface SocialAidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonateAid: () => void;
}

export const SocialAidModal: React.FC<SocialAidModalProps> = ({
  isOpen,
  onClose,
  onDonateAid
}) => {
  if (!isOpen) return null;

  const handleWhatsAppDispatch = () => {
    const text = encodeURIComponent(
      'Halo Admin PARAMIS FOUNDATION, saya ingin mengajukan permohonan/konfirmasi Program Bantuan Sosial & Sembako bagi warga prasejahtera yang membutuhkan...'
    );
    window.open(`https://wa.me/6285195555674?text=${text}`, '_blank');
  };

  const handleCallHotline = () => {
    window.open('tel:085195555674', '_self');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#060ee3] via-[#050ca8] to-[#1e1b4b] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                  Siap Salur
                </span>
                <span className="text-[10px] text-blue-200">Menaungi Semua Agama</span>
              </div>
              <h3 className="text-base font-bold leading-tight mt-0.5">
                Layanan Bantuan Sosial & Sembako
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Universal Humanitarian Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[12px]">
                Peduli & Merangkul Seluruh Kalangan Prasejahtera
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                Yayasan PARAMIS FOUNDATION menyalurkan paket sembako, pangan, santunan yatim, dan bantuan biaya hidup darurat bagi warga yang membutuhkan tanpa memandang perbedaan suku, agama, dan golongan.
              </p>
            </div>
          </div>

          {/* Service Specifications */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400" />
              Bentuk Bantuan & Program Penyaluran
            </h4>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">📦 Paket Sembako Rutin</span>
                <span className="text-[10px] text-slate-500">Beras, minyak, telur & terigu</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">🍼 Nutrisi Anak & Lansia</span>
                <span className="text-[10px] text-slate-500">Susu gizi & makanan sehat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">💊 Biaya Berobat Darurat</span>
                <span className="text-[10px] text-slate-500">Obat & ongkos berobat prasejahtera</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <span className="font-bold text-slate-900 dark:text-white block">🚨 Tanggap Darurat Bencana</span>
                <span className="text-[10px] text-slate-500">Logistik & posko dapur umum</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400" />
              Layanan Pengajuan & Informasi Bantuan
            </h4>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWhatsAppDispatch}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Ajukan Bantuan via WhatsApp (0851-9555-5674)</span>
              </button>

              <button
                type="button"
                onClick={handleCallHotline}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer transition-all"
              >
                <Phone className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
                <span>Panggilan Telepon Hotline</span>
              </button>
            </div>
          </div>

          {/* Support Social Aid via Donation */}
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white text-[11px] block">
                Sedekah Paket Pangan & Sembako
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                Bantu pengadaan beras dan sembako untuk keluarga dhuafa
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDonateAid();
              }}
              className="px-3 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-[11px] shrink-0 shadow-xs cursor-pointer active:scale-95"
            >
              Donasi Sekarang
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Posko Penyaluran: Jl. Dr. Sumeru Gg. Nasedin No.3, Cilendek Barat, Bogor Barat
          </p>
        </div>
      </div>
    </div>
  );
};
