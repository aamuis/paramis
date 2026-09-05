import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, X, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { ParamisLogo } from './ParamisLogo';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Accepted PINs: 1945 (Tahun Kemerdekaan), 5674 (4 digit akhir kontak yayasan), paramis, admin123
  const validPins = ['1945', '5674', 'paramis', 'admin', 'admin123', '085195555674'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = pin.trim().toLowerCase();
    if (!cleanInput) {
      setError('Masukkan PIN atau kata sandi pengelola.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (validPins.includes(cleanInput)) {
        setPin('');
        setError('');
        onSuccess();
      } else {
        setError('PIN atau kata sandi tidak sesuai. Silakan periksa kembali.');
      }
    }, 400);
  };

  return (
    <div 
      id="modal-secret-admin"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with close button */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#060ee3]/10 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Akses Privat Pengelola
              </h3>
              <p className="text-[10px] text-slate-500">
                PARAMIS FOUNDATION CMS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Logo */}
        <div className="py-1 flex justify-center">
          <ParamisLogo variant="auto" size="sm" />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">
          Halaman admin disembunyikan dari publik. Masukkan kode PIN pengelola Anda untuk membuka dashboard.
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              PIN / Kata Sandi Pengelola
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Masukkan PIN (cth: 1945 atau 5674)"
                autoFocus
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#060ee3]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
            <div className="flex items-center gap-1 font-semibold text-[#060ee3] dark:text-blue-300 text-[10px] uppercase">
              <KeyRound className="w-3 h-3" />
              <span>Petunjuk Akses Cepat</span>
            </div>
            <p className="text-[10.5px]">
              Gunakan PIN default <strong className="font-mono text-[#060ee3] dark:text-blue-300">1945</strong> atau 4 digit akhir kontak yayasan <strong className="font-mono text-[#060ee3] dark:text-blue-300">5674</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Memverifikasi...' : 'Buka Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
