import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { sendPeriodicReportEmail, getEmailLogs } from '../services/storage';
import { EmailNotificationLog } from '../types';
import { ParamisLogo } from './ParamisLogo';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [recipientEmail, setRecipientEmail] = useState('donatur.setia@gmail.com');
  const [recipientName, setRecipientName] = useState('Bapak/Ibu Donatur Dermawan');
  const [period, setPeriod] = useState('September 2026');
  const [reportType, setReportType] = useState<'monthly_report' | 'program_update'>('monthly_report');
  const [customMessage, setCustomMessage] = useState(
    'Alhamdulillah, berikut rangkuman penyaluran donasi dan dampak program sosial Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION) sepanjang periode ini. Seluruh donasi telah dialokasikan 100% transparan dan diaudit.'
  );

  const [emailHistory, setEmailHistory] = useState<EmailNotificationLog[]>(getEmailLogs());
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      sendPeriodicReportEmail(recipientEmail, recipientName, period, customMessage);
      setEmailHistory(getEmailLogs());
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        id="email-notification-modal"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#060ee3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="text-sm font-bold">
                Sistem Laporan Berkala & Notifikasi Donatur
              </h3>
              <p className="text-[11px] text-blue-100">
                Pengiriman Otomatis Email Transparansi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Laporan berkala berhasil didispatch ke antrean email donatur!</span>
            </div>
          )}

          {/* Form to dispatch report */}
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kirim Laporan Ke Email Donatur
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  placeholder="email@donatur.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="September 2026">Periode September 2026</option>
                  <option value="Agustus 2026">Periode Agustus 2026</option>
                  <option value="Triwulan III 2026">Kuartal III 2026</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pesan Pembuka Laporan
              </label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Email Visual Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>Template Email Resmi PARAMIS</span>
                <span className="font-mono text-[10px]">HTML Responsive</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <ParamisLogo variant="auto" size="xs" />
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                  Laporan Akuntabilitas Penyaluran Donasi - {period}
                </h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {customMessage}
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[10px] text-slate-700 dark:text-slate-200">
                  <div>Dana Tersalur: <strong>Rp 342.800.000</strong></div>
                  <div>Penerima Manfaat: <strong>2.850 Jiwa</strong></div>
                  <div>Status Audit: <strong className="text-emerald-600">WTP (Wajar Tanpa Pengecualian)</strong></div>
                  <div>Indeks Transparansi: <strong>99.4%</strong></div>
                </div>
              </div>
            </div>

            <button
              id="btn-send-periodic-report"
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSending ? (
                <span>Menyusun & Mengirimkan Email...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Berkala Sekarang</span>
                </>
              )}
            </button>
          </form>

          {/* Email dispatch audit log */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Riwayat Pengiriman Email Terakhir</span>
              <span className="text-[10px] font-normal text-slate-500">Database Real-Time</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {emailHistory.slice(0, 5).map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {log.toEmail}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-semibold">
                      Terkirim
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[10px] line-clamp-1 font-medium">
                    {log.subject}
                  </p>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>{new Date(log.sentAt).toLocaleString('id-ID')}</span>
                    <span>Tipe: {log.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
