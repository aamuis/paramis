import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Award, 
  Trash2, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  ExternalLink,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { VolunteerApplicant } from '../../types';
import { updateVolunteerStatus, deleteVolunteer, batchApproveVolunteers } from '../../services/storage';

interface AdminVolunteerAccViewProps {
  volunteers: VolunteerApplicant[];
  onRefresh?: () => void;
}

export const AdminVolunteerAccView: React.FC<AdminVolunteerAccViewProps> = ({
  volunteers,
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplicant | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
    onRefresh?.();
  };

  const handleApprove = (id: string, name: string) => {
    updateVolunteerStatus(id, 'approved');
    showNotification(`Pendaftar relawan "${name}" berhasil di-ACC dan Disetujui!`);
  };

  const handleReject = (id: string, name: string) => {
    updateVolunteerStatus(id, 'rejected');
    showNotification(`Pendaftaran relawan "${name}" telah ditolak.`);
  };

  const handlePending = (id: string, name: string) => {
    updateVolunteerStatus(id, 'pending_review');
    showNotification(`Status relawan "${name}" dikembalikan ke antrean peninjauan (Pending).`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pendaftar "${name}" secara permanen?`)) {
      deleteVolunteer(id);
      showNotification(`Data pendaftar "${name}" telah dihapus.`);
    }
  };

  const handleBatchApproveQualified = () => {
    const qualifiedPending = volunteers.filter(
      v => (v.status === 'pending_review' || v.status === 'verified_auto') && v.verificationScore >= 75
    );
    if (qualifiedPending.length === 0) {
      alert('Tidak ada pendaftar pending dengan skor kelayakan >= 75.');
      return;
    }
    if (window.confirm(`ACC sekaligus ${qualifiedPending.length} pendaftar yang memenuhi skor kelayakan (>= 75)?`)) {
      batchApproveVolunteers(qualifiedPending.map(v => v.id));
      showNotification(`Sukses! ${qualifiedPending.length} pendaftar relawan resmi di-ACC sekaligus!`);
    }
  };

  // Filter & Search Logic
  const filteredVolunteers = volunteers.filter(vol => {
    // Status Filter
    if (filterStatus === 'pending') {
      if (vol.status !== 'pending_review' && vol.status !== 'verified_auto') return false;
    } else if (filterStatus === 'approved') {
      if (vol.status !== 'approved') return false;
    } else if (filterStatus === 'rejected') {
      if (vol.status !== 'rejected') return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = vol.fullName.toLowerCase().includes(q);
      const matchCity = vol.city.toLowerCase().includes(q);
      const matchPhone = vol.phone.includes(q);
      const matchSkill = vol.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchPhone && !matchSkill) return false;
    }

    return true;
  });

  const pendingCount = volunteers.filter(v => v.status === 'pending_review' || v.status === 'verified_auto').length;
  const approvedCount = volunteers.filter(v => v.status === 'approved').length;
  const rejectedCount = volunteers.filter(v => v.status === 'rejected').length;

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* Header & Quick Action Bar */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-900 to-[#060ee3] text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-200" />
              <h3 className="font-bold text-base">ACC & Verifikasi Pendaftar Relawan</h3>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Tinjau dan setujui pendaftar relawan sebelum diterbitkan Kartu E-KTA resmi PARAMIS FOUNDATION.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBatchApproveQualified}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>ACC Sekaligus Skor &ge; 75</span>
          </button>
        </div>

        {/* Stats Pills */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-center">
            <span className="text-[10px] text-blue-200 block">Total Pendaftar</span>
            <span className="text-base font-bold">{volunteers.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-center">
            <span className="text-[10px] text-amber-200 block">Menunggu ACC</span>
            <span className="text-base font-bold text-amber-300">{pendingCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-400/20 border border-emerald-300/30 text-center">
            <span className="text-[10px] text-emerald-200 block">Telah Di-ACC</span>
            <span className="text-base font-bold text-emerald-300">{approvedCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-400/20 border border-rose-300/30 text-center">
            <span className="text-[10px] text-rose-200 block">Ditolak</span>
            <span className="text-base font-bold text-rose-300">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'pending'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu ACC ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lolos / Disetujui ({approvedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filterStatus === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak ({rejectedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Semua ({volunteers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, kota, no HP, atau keahlian relawan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
          />
        </div>
      </div>

      {/* Volunteer Applicants List */}
      <div className="space-y-3">
        {filteredVolunteers.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              Tidak Ada Data Relawan
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filterStatus === 'pending'
                ? 'Semua pendaftar relawan telah selesai diverifikasi atau belum ada pendaftar baru.'
                : 'Tidak ditemukan relawan yang sesuai dengan kriteria filter pencarian.'}
            </p>
          </div>
        ) : (
          filteredVolunteers.map((vol) => {
            const isPending = vol.status === 'pending_review' || vol.status === 'verified_auto';
            const isApproved = vol.status === 'approved';
            const isRejected = vol.status === 'rejected';
            const cleanPhone = (vol.phone || '').replace(/\D/g, '').replace(/^0/, '62');

            return (
              <div
                key={vol.id}
                className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border transition-all space-y-3 shadow-xs ${
                  isApproved 
                    ? 'border-emerald-200 dark:border-emerald-800/60' 
                    : isRejected 
                    ? 'border-rose-200 dark:border-rose-800/60 opacity-80' 
                    : 'border-amber-200 dark:border-amber-800/80 ring-1 ring-amber-400/30'
                }`}
              >
                {/* Top Row: Name, Score, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isApproved 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200' 
                        : isRejected 
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200'
                    }`}>
                      {vol.fullName.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {vol.fullName}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({vol.age} thn)
                        </span>

                        {/* Status Badge */}
                        {isApproved && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            RESMI DI-ACC
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[9px] flex items-center gap-1 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            MENUNGGU ACC ADMIN
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[9px] flex items-center gap-1 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            DITOLAK
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {vol.profession || 'Umum'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {vol.city}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">
                          No KTA: {vol.idCardNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Score Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 text-xs">
                      <Award className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400" />
                      <span className="text-slate-600 dark:text-slate-300 text-[10px]">Skor Sistem:</span>
                      <span className={`font-bold ${
                        vol.verificationScore >= 75 ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {vol.verificationScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Motivation & Skills */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Motivasi Pendaftaran:
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 italic leading-relaxed text-[11px]">
                      "{vol.motivation}"
                    </p>
                  </div>

                  {/* Skills tags */}
                  {vol.skills && vol.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400">Keahlian:</span>
                      {vol.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#060ee3] dark:text-blue-300 font-semibold text-[10px] border border-blue-100 dark:border-blue-900/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* System verification checklist notes */}
                  {vol.verificationNotes && vol.verificationNotes.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {vol.verificationNotes.map((note, idx) => (
                        <span 
                          key={idx}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        >
                          ✓ {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons: The Core ACC Requirement */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                  {/* Contact Links */}
                  <div className="flex items-center gap-2">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(vol.fullName)},%20kami%20dari%20Pengurus%20PARAMIS%20FOUNDATION%20terkait%20pendaftaran%20relawan%20Anda.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800"
                        title="Hubungi via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat WA ({vol.phone})</span>
                      </a>
                    )}

                    {vol.email && (
                      <a
                        href={`mailto:${vol.email}?subject=Verifikasi%20Relawan%20PARAMIS%20FOUNDATION`}
                        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                        title={vol.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* ACC Decision Controls */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(vol.id, vol.fullName)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ACC / Setujui Relawan</span>
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => handleReject(vol.id, vol.fullName)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-800 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    )}

                    {(isApproved || isRejected) && (
                      <button
                        type="button"
                        onClick={() => handlePending(vol.id, vol.fullName)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        title="Kembalikan ke antrean peninjauan"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Tinjau Ulang</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(vol.id, vol.fullName)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Hapus data pendaftar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
