import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Target, 
  Users, 
  Search, 
  Star,
  ArrowUpRight,
  TrendingUp,
  X
} from 'lucide-react';
import { DonationCampaign } from '../../types';
import { getCampaigns, updateCampaign } from '../../services/storage';

interface AdminUrgentProgramsViewProps {
  campaigns: DonationCampaign[];
  onRefresh?: () => void;
}

export const AdminUrgentProgramsView: React.FC<AdminUrgentProgramsViewProps> = ({
  campaigns: initialCampaigns,
  onRefresh
}) => {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefresh?.();
  };

  const handleToggleUrgent = (campaign: DonationCampaign) => {
    const newUrgentStatus = !campaign.isUrgent;
    updateCampaign(campaign.id, { isUrgent: newUrgentStatus });
    setCampaigns(getCampaigns());
    showNotification(
      newUrgentStatus
        ? `Program "${campaign.title}" berhasil DIJADIKAN PROGRAM MENDESAK!`
        : `Status mendesak pada "${campaign.title}" telah DINONAKTIFKAN.`
    );
  };

  const handleUpdateDaysLeft = (campaign: DonationCampaign, days: number) => {
    updateCampaign(campaign.id, { daysLeft: Math.max(1, days) });
    setCampaigns(getCampaigns());
    showNotification(`Sisa waktu program diperbarui menjadi ${days} hari.`);
  };

  const urgentList = campaigns.filter(c => c.isUrgent && c.status === 'active');
  const nonUrgentList = campaigns.filter(c => !c.isUrgent && c.status === 'active' && (
    !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
            <h3 className="font-bold text-base">Kelola Menu Program Mendesak (Update Sesuai Kemauan Admin)</h3>
          </div>
          <p className="text-xs text-rose-100 mt-0.5">
            Tentukan program donasi mana yang tampil di slot utama "Program Mendesak" beranda dengan satu klik.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-white/20 border border-white/25 text-center text-xs font-bold shrink-0">
          <span>{urgentList.length} Program Mendesak Aktif</span>
        </div>
      </div>

      {/* 1. ACTIVE URGENT CAMPAIGNS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Sedang Ditampilkan di Bagian Program Mendesak ({urgentList.length})</span>
          </span>
          <span className="text-[10px] text-slate-500">Prioritas utama di layar beranda</span>
        </div>

        {urgentList.length === 0 ? (
          <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
            Belum ada program yang ditandai sebagai program mendesak. Pilih salah satu dari daftar di bawah.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {urgentList.map((camp) => {
              const progress = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));

              return (
                <div
                  key={camp.id}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800 border-2 border-rose-400/80 dark:border-rose-500/80 shadow-md space-y-3 relative overflow-hidden"
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 relative">
                      <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-rose-600 text-white text-[8px] font-bold">
                        MENDESAK
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold uppercase">
                        {camp.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mt-1">
                        {camp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-rose-500" />
                          Sisa {camp.daysLeft} hari
                        </span>
                        <span>•</span>
                        <span>{camp.donorCount} Donatur</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Terkumpul: Rp {camp.collectedAmount.toLocaleString('id-ID')}</span>
                      <span className="font-bold text-rose-600">{progress}%</span>
                    </div>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-500">Sisa hari:</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateDaysLeft(camp, camp.daysLeft - 5)}
                        className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md font-bold hover:bg-slate-200"
                        title="Kurangi 5 hari"
                      >
                        -5
                      </button>
                      <span className="font-bold font-mono px-1">{camp.daysLeft}h</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateDaysLeft(camp, camp.daysLeft + 5)}
                        className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md font-bold hover:bg-slate-200"
                        title="Tambah 5 hari"
                      >
                        +5
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleUrgent(camp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 text-slate-700 dark:text-slate-200 hover:text-rose-600 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Hapus dari Mendesak</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. OTHER CAMPAIGNS (1-CLICK ACTIVATE TO URGENT) */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            Pilih Program Lain untuk Dijadikan Program Mendesak
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program donasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nonUrgentList.map((camp) => (
            <div
              key={camp.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                  <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 font-bold uppercase">
                    {camp.category}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                    {camp.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Target: Rp {camp.targetAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleUrgent(camp)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/60 transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>+ Jadikan Mendesak</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
