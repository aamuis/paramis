import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  RefreshCw,
  LogOut,
  UserPlus
} from 'lucide-react';
import { VolunteerApplicant } from '../types';
import { getVolunteers, updateVolunteerAvatar } from '../services/storage';
import { VolunteerKtaCard } from './VolunteerKtaCard';

interface MyVolunteerKtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterModal?: () => void;
}

export const MyVolunteerKtaModal: React.FC<MyVolunteerKtaModalProps> = ({
  isOpen,
  onClose,
  onOpenRegisterModal
}) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeVolunteer, setActiveVolunteer] = useState<VolunteerApplicant | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Check saved volunteer ID on modal open
  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    const savedId = localStorage.getItem('paramis_my_volunteer_id');
    const savedEmail = localStorage.getItem('paramis_my_volunteer_email');

    if (savedId || savedEmail) {
      const allVolunteers = getVolunteers();
      const matched = allVolunteers.find(
        v => (savedId && v.id === savedId) || (savedEmail && v.email.toLowerCase() === savedEmail.toLowerCase())
      );
      if (matched) {
        setActiveVolunteer(matched);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setErrorMessage('Silakan masukkan email terdaftar, nomor WhatsApp, atau ID KTA Anda.');
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    setTimeout(() => {
      const allVolunteers = getVolunteers();
      const matched = allVolunteers.find(v => {
        const emailMatch = v.email.toLowerCase() === cleanQuery;
        const idMatch = v.idCardNumber.toLowerCase() === cleanQuery;
        const rawPhone = v.phone.replace(/\D/g, '');
        const queryPhone = cleanQuery.replace(/\D/g, '');
        const phoneMatch = queryPhone.length >= 8 && (rawPhone.endsWith(queryPhone) || queryPhone.endsWith(rawPhone));
        return emailMatch || idMatch || phoneMatch;
      });

      setIsSearching(false);

      if (matched) {
        setActiveVolunteer(matched);
        try {
          localStorage.setItem('paramis_my_volunteer_id', matched.id);
          localStorage.setItem('paramis_my_volunteer_email', matched.email);
        } catch {
          // ignore storage error
        }
      } else {
        setErrorMessage('Data pendaftaran tidak ditemukan. Pastikan email atau nomor WhatsApp yang Anda masukkan sesuai saat mendaftar.');
      }
    }, 400);
  };

  const handleLogoutFromDevice = () => {
    try {
      localStorage.removeItem('paramis_my_volunteer_id');
      localStorage.removeItem('paramis_my_volunteer_email');
    } catch {
      // ignore
    }
    setActiveVolunteer(null);
    setQuery('');
    setErrorMessage(null);
  };

  const handleAvatarUpdated = (newAvatar: string) => {
    if (activeVolunteer) {
      updateVolunteerAvatar(activeVolunteer.id, newAvatar);
      setActiveVolunteer({
        ...activeVolunteer,
        avatarUrl: newAvatar
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div 
        id="my-volunteer-kta-modal-container"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Header with Privacy Guarantee */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Akses KTA Relawan</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#060ee3] dark:text-blue-300 font-semibold">
                  Khusus Pendaftar
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Akses privat untuk melihat dan mengunduh Kartu Tanda Anggota Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Perlindungan Privasi Anggota:</strong> Demi menjaga data pribadi para relawan, Kartu Tanda Anggota (KTA) tidak dapat dilihat oleh orang umum dan hanya dapat diakses langsung oleh pendaftar yang bersangkutan.
          </p>
        </div>

        {/* View Mode: If Volunteer is Verified and Found */}
        {activeVolunteer ? (
          <div className="space-y-4">
            {/* Authenticated banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                    Terverifikasi Sebagai Pendaftar: {activeVolunteer.fullName}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    ID: {activeVolunteer.idCardNumber} • {activeVolunteer.email}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogoutFromDevice}
                title="Keluar / Ganti Akun Pendaftar"
                className="p-1.5 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ganti Akun</span>
              </button>
            </div>

            {/* Status note if pending review */}
            {activeVolunteer.status === 'pending_review' && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200">
                ℹ️ Berkas pendaftaran Anda saat ini dalam proses verifikasi Admin Yayasan. Anda tetap dapat menyimpan atau memperbarui foto pada KTA Anda di bawah ini.
              </div>
            )}

            {/* Official KTA Component */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#060ee3]" />
                  Kartu Tanda Anggota (E-KTA) Anda:
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  Unduh PNG / PDF di bawah
                </span>
              </div>

              <VolunteerKtaCard 
                volunteer={activeVolunteer}
                allowEditPhoto={true}
                onAvatarUpdated={handleAvatarUpdated}
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
              >
                Tutup Jendela KTA
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form to Access KTA */
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Verifikasi Identitas Pendaftar:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Masukkan Email, No. WhatsApp, atau No. KTA"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Contoh: <em>andi@gmail.com</em> atau <em>08123456789</em> atau <em>REL-PRM-2026-1234</em>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[11px] leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-2.5 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memeriksa database pendaftaran...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Buka & Verifikasi KTA Saya</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Registration Link if not yet registered */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">
                Belum mendaftar sebagai relawan PARAMIS?
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegisterModal?.();
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#060ee3]" />
                <span>Daftar Relawan Sekarang (Gratis)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
