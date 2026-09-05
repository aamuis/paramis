import React, { useState } from 'react';
import { 
  X, 
  PieChart, 
  FileText, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Search,
  ExternalLink
} from 'lucide-react';
import { DonationCampaign, SocialActivityReport, DonationTransaction } from '../types';
import { ParamisLogo } from './ParamisLogo';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: DonationCampaign[];
  reports: SocialActivityReport[];
  transactions: DonationTransaction[];
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  reports,
  transactions
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ringkasan' | 'laporan_kegiatan' | 'mutasi'>('ringkasan');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Calculate real-time totals
  const totalCollected = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);
  const totalBeneficiaries = reports.reduce((acc, r) => acc + r.beneficiariesCount, 0);
  const totalBudgetSpent = reports.reduce((acc, r) => acc + r.totalBudget, 0);
  const totalDonors = campaigns.reduce((acc, c) => acc + c.donorCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        id="transparency-modal-container"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#060ee3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="text-sm font-bold">
                Transparansi & Akuntabilitas Dana
              </h3>
              <p className="text-[11px] text-blue-100">
                Yayasan Prakarsa Hadji Abdul Muis
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

        {/* Sub-tabs */}
        <div className="px-4 pt-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex gap-1">
          <button
            onClick={() => setActiveSubTab('ringkasan')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeSubTab === 'ringkasan'
                ? 'border-[#060ee3] text-[#060ee3] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Ringkasan Kas
          </button>

          <button
            onClick={() => setActiveSubTab('laporan_kegiatan')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeSubTab === 'laporan_kegiatan'
                ? 'border-[#060ee3] text-[#060ee3] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Kegiatan Sosial ({reports.length})
          </button>

          <button
            onClick={() => setActiveSubTab('mutasi')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeSubTab === 'mutasi'
                ? 'border-[#060ee3] text-[#060ee3] dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Arus Donasi Real-Time
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* TAB 1: FINANCIAL OVERVIEW */}
          {activeSubTab === 'ringkasan' && (
            <div className="space-y-3.5">
              {/* Financial metric cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                    Total Donasi Terhimpun
                  </span>
                  <div className="text-base font-black text-[#060ee3] dark:text-blue-400 mt-0.5">
                    Rp {totalCollected.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {totalDonors} Transaksi Terverifikasi
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                    Total Dana Tersalurkan
                  </span>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Rp {totalBudgetSpent.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[9px] text-emerald-700 dark:text-emerald-300 font-medium">
                    {totalBeneficiaries.toLocaleString('id-ID')} Penerima Manfaat
                  </span>
                </div>
              </div>

              {/* Legal audit certificate card */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Opini Auditor Independen: WTP
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Wajar Tanpa Pengecualian • Tahun Berjalan 2026
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    VALID
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Laporan keuangan Yayasan Prakarsa Hadji Abdul Muis diaudit secara berkala oleh Kantor Akuntan Publik (KAP) terdaftar dan dilaporkan kepada Kementerian Sosial RI serta publik secara transparan.
                </p>
              </div>

              {/* Fund allocation breakdown bars */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Distribusi Alokasi Program Sosial
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Pendidikan & Yatim</span>
                      <span className="font-bold text-[#060ee3] dark:text-blue-400">38%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#060ee3] h-full rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Tanggap Bencana & Logistik</span>
                      <span className="font-bold text-amber-500">27%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '27%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Layanan Kesehatan & Ambulans</span>
                      <span className="font-bold text-emerald-500">21%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '21%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Pemberdayaan Ekonomi Mustahik</span>
                      <span className="font-bold text-purple-500">14%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Download simulated report */}
              <button
                type="button"
                onClick={() => alert('Mengunduh Laporan Keuangan Audited PARAMIS FOUNDATION (Format PDF)...')}
                className="w-full py-2.5 px-3 rounded-xl border border-[#060ee3] text-[#060ee3] dark:text-blue-400 font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan Keuangan Audited (PDF)</span>
              </button>
            </div>
          )}

          {/* TAB 2: SOCIAL ACTIVITY REPORTS */}
          {activeSubTab === 'laporan_kegiatan' && (
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
                        {report.location}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                        {report.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                      {report.date}
                    </span>
                  </div>

                  {report.documentationImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden">
                      {report.documentationImages.slice(0, 2).map((imgUrl, idx) => (
                        <img 
                          key={idx} 
                          src={imgUrl} 
                          alt="Dokumentasi" 
                          className="w-full h-24 object-cover hover:scale-105 transition-transform" 
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Dampak & Realisasi Penyaluran:
                    </span>
                    {report.impactHighlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>Dana Terserap: <strong>Rp {report.totalBudget.toLocaleString('id-ID')}</strong></span>
                    <span>Penerima: <strong>{report.beneficiariesCount} Jiwa</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REAL-TIME TRANSACTION FEED */}
          {activeSubTab === 'mutasi' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Aliran Donasi Masuk Terkini</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Stream
                </span>
              </div>

              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {tx.donorName}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 font-mono">
                          {tx.paymentChannelName}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px] mt-0.5">
                        {tx.campaignTitle}
                      </p>
                      {tx.prayerMessage && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                          "{tx.prayerMessage}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        +Rp {tx.amount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
